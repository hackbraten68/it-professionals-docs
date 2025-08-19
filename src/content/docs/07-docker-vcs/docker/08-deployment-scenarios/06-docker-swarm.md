---
title: Docker Swarm
---
# Docker Swarm — A Practical, Comprehensive Guide

> **Goal:** Give you a crystal‑clear, educator‑ready overview of Docker Swarm for orchestrating containers across a cluster, with enough depth to teach, demo, and operate it confidently.

---

## 1) What Is Docker Swarm?

**Docker Swarm** is Docker’s native orchestrator that turns a set of machines (VMs or physical) into a **single, secure cluster** for running containers. It provides **service discovery, load balancing, scaling, rolling updates,** and **fault tolerance** with a minimal learning curve compared to heavier orchestrators.

**Why it’s appealing**

* **Built into Docker Engine** (no separate control plane to install).
* **Simple mental model** (services → tasks → containers).
* **Secure by default** (mutual TLS, cert rotation).
* **Good for small‑to‑medium production workloads**, edge clusters, labs, and teaching.

---

## 2) Core Architecture & Concepts

### Nodes

* **Manager nodes**: hold the **Raft**-backed control plane (desired state, scheduling, cluster membership). Require **quorum** (n/2 + 1) to remain available.
* **Worker nodes**: run workloads (tasks/containers). Can be promoted/demoted.

> **Tip:** In small clusters, use **3 managers** (or 5) to maintain quorum during failures.

### Services, Tasks, and Containers

* **Service**: desired state (image, replicas, networks, secrets, constraints).
* **Task**: a single running unit of a service on a node (1 task → 1 container).
* **Replicated services**: `--replicas N` places N tasks across nodes.
* **Global services**: `--mode global` runs exactly one task per node (great for agents/log shippers).

### Networking

* **Overlay networks** (multi‑host): built‑in SDN for cross‑node communication.
* **Service discovery**: internal **DNS** on overlay; each service gets a stable **VIP** by default.
* **Load balancing**:

  * **VIP mode (default):** Swarm’s internal LB sends traffic to tasks.
  * **DNSRR:** round‑robin DNS records (no VIP).
* **Routing Mesh** (ingress): Any node can accept traffic to a published port and forward to a task anywhere in the cluster.

  * **Publish modes**:

    * `--publish mode=ingress,target=80,published=8080` (via routing mesh)
    * `--publish mode=host,target=80,published=8080` (bind only on the node running the task)

### Security

* **Mutual TLS** between nodes (auto‑managed).
* **Certificate rotation** and **CA** management built‑in.
* **Raft logs** encrypted at rest on managers.
* Optional **encrypted overlay networks**.

### State & Scheduling

* **Declarative desired state:** You tell Swarm *what* you want; it figures out *where* and *how*.
* **Constraints & placement**: labels and filters control where tasks land.
* **Health & restart policies**: watch & replace failed tasks automatically.

---

## 3) Quick Start (Minimum Viable Cluster)

```bash
# On the first node:
docker swarm init --advertise-addr <MANAGER_IP>

# Output will include a worker join command like:
# docker swarm join --token <TOKEN> <MANAGER_IP>:2377

# On each additional node:
docker swarm join --token <TOKEN> <MANAGER_IP>:2377

# Verify membership from a manager:
docker node ls
```

Create your first service and scale it:

```bash
# Run 3 replicas of nginx, published on port 8080 via routing mesh
docker service create \
  --name web \
  --replicas 3 \
  --publish mode=ingress,target=80,published=8080 \
  nginx:alpine

# Observe:
docker service ls
docker service ps web
docker service logs -f web

# Scale up/down:
docker service scale web=5
```

---

## 4) Deploying with Compose Files (Stacks)

Swarm supports **Compose v3+** files for multi‑service apps:

```yaml
# docker-compose.yml (Swarm stack example)
version: "3.9"
services:
  web:
    image: nginx:alpine
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first   # zero-downtime style
      placement:
        constraints:
          - "node.labels.zone == blue"
    ports:
      - target: 80
        published: 8080
        protocol: tcp
        mode: ingress
    networks: [frontend]
    configs: [nginx_conf]
  api:
    image: ghcr.io/example/api:1.2.3
    deploy:
      replicas: 2
    networks: [frontend, backend]
    secrets: [api_key]
networks:
  frontend:
    driver: overlay
  backend:
    driver: overlay
secrets:
  api_key:
    external: true
configs:
  nginx_conf:
    file: ./nginx.conf
```

Deploy and manage:

```bash
docker stack deploy -c docker-compose.yml mystack
docker stack ls
docker stack services mystack
docker stack ps mystack
docker stack rm mystack
```

---

## 5) Rolling Updates, Rollbacks & Zero‑Downtime

**Rolling update controls** on a service:

* `--update-parallelism 1` — how many tasks update at once
* `--update-delay 10s` — wait between batches
* `--update-order start-first` — start new task before stopping the old
* `--update-failure-action rollback` — auto‑rollback on failure

```bash
# Update image and enable safe rollout
docker service update \
  --image nginx:1.27-alpine \
  --update-parallelism 1 \
  --update-delay 10s \
  --update-order start-first \
  --update-failure-action rollback \
  web

# Manual rollback if needed:
docker service rollback web
```

> **Best practice:** Combine with **healthchecks** (in Dockerfile or Compose) so Swarm only advances if new tasks become healthy.

---

## 6) Secrets & Configs (Built‑In)

**Secrets** are mounted in‑memory (tmpfs) to tasks that need them.

```bash
# Create secrets
echo -n "super-secret-token" | docker secret create api_key -
docker secret ls

# Use in service (CLI)
docker service create \
  --name api \
  --secret api_key \
  ghcr.io/example/api:1.2.3
```

**Configs** are similar but intended for non‑sensitive data (e.g., nginx.conf):

```bash
docker config create nginx_conf ./nginx.conf
docker service update --config-add nginx_conf web
```

> **Tip:** Avoid baking secrets into images or env vars. Use Swarm secrets consistently.

---

## 7) Persistent Data & Volumes

Swarm schedules tasks anywhere; **design storage accordingly**:

* **Local volumes** work but tie a task to a node. Combine with **constraints** or **node labels** to keep stateful tasks on specific nodes.
* Use a **networked storage driver** (NFS, CIFS, Longhorn, Portworx, etc.) when tasks may move.
* For databases, consider **single‑writer** (constraints + backups) or **external managed DB**.

Example with constraints:

```bash
# Label a node
docker node update --label-add role=db node-2

# Pin a stateful service
docker service create \
  --name postgres \
  --constraint 'node.labels.role == db' \
  --mount type=volume,source=pgdata,target=/var/lib/postgresql/data \
  postgres:16
```

---

## 8) Placement, Constraints & Affinities

Control *where* tasks go:

* **Node labels:** manual metadata key/value on nodes.
* **Constraints:** e.g., `node.role == manager`, `node.labels.zone == blue`.
* **Resource reservations/limits:** improve scheduling decisions.

```bash
docker node update --label-add zone=blue node-1
docker service create \
  --name worker \
  --constraint 'node.labels.zone == blue' \
  busybox sleep 1d
```

---

## 9) Health, Resiliency & Self‑Healing

* **Restart policies:** `on-failure`, `any`, with retries and windows.
* **Healthchecks:** surface container health to Swarm.
* **Automatic rescheduling:** if a node dies or a task fails, Swarm replaces it elsewhere (subject to constraints).

```yaml
deploy:
  restart_policy:
    condition: on-failure
    delay: 5s
    max_attempts: 3
    window: 30s
```

---

## 10) Observability: Logs & Metrics

* **Logs:** `docker service logs -f <svc>` aggregates logs across tasks.
* **Events:** `docker events` for real‑time cluster events.
* **Integrations:** run a **global** logging agent (Fluent Bit/Filebeat) and metrics (cAdvisor/Node Exporter) as global services; visualize with Grafana/Prometheus stacks.

Global agent example:

```bash
docker service create \
  --name node-exporter \
  --mode global \
  --mount type=bind,src=/proc,dst=/host/proc,ro \
  --mount type=bind,src=/sys,dst=/host/sys,ro \
  --mount type=bind,src=/,dst=/rootfs,ro \
  prom/node-exporter
```

---

## 11) Common Commands (Cheat Sheet)

Cluster & nodes:

```bash
docker swarm init
docker swarm join-token worker
docker node ls
docker node inspect <node>
docker node update --availability drain <node>   # cordon a node
docker node update --availability active <node>
docker node promote <node> / docker node demote <node>
```

Services:

```bash
docker service create --name web --replicas 3 -p 8080:80 nginx
docker service ls
docker service ps web
docker service inspect web
docker service logs -f web
docker service scale web=6
docker service update --image nginx:alpine web
docker service rollback web
docker service rm web
```

Stacks:

```bash
docker stack deploy -c docker-compose.yml mystack
docker stack services mystack
docker stack ps mystack
docker stack rm mystack
```

Secrets & configs:

```bash
echo -n "pwd" | docker secret create db_pwd -
docker secret ls
docker config create nginx_conf ./nginx.conf
docker config ls
```

---

## 12) Security Best Practices

* **Rotate join tokens** and **certificates** regularly.
* Restrict **manager API** access to trusted networks.
* Prefer **encrypted overlays** for sensitive East‑West traffic.
* Run services as **non‑root** users; apply **read‑only** filesystems where possible.
* Keep Docker Engine and OS **patched**.

Encrypted overlay example:

```bash
docker network create --driver overlay --opt encrypted secure-net
```

---

## 13) When to Use Swarm (and When Not)

**Use Swarm if**

* You want **simpler orchestration** than Kubernetes.
* Your cluster is **small‑to‑medium**, predictable, and you value **easy ops**.
* You’re teaching containers & orchestration and want **fast wins**.

**Consider Kubernetes if**

* You need **extensive ecosystem/integrations**, CRDs, advanced scheduling, autoscaling (HPA/VPA), service mesh, complex RBAC, or multi‑tenancy at scale.

---

## 14) Troubleshooting Playbook

* **Service won’t start**: check `docker service ps <svc>` for **Last Error**, then `docker service logs`.
* **No traffic to service**: verify published ports, `mode=ingress` vs `mode=host`, and that tasks are **Running**.
* **Tasks stuck in Pending**: missing constraints/labels/resources or lacking image pull access.
* **Quorum lost**: managers < majority → promote a worker or **force new cluster** from remaining manager **only in emergencies** (data loss risk).
* **Overlay network issues**: check firewall rules (UDP 4789, TCP/UDP 7946), MTU, and that nodes can reach the manager on **TCP 2377**.

---

## 15) Example: Blue‑Green / Start‑First Updates

```bash
# Current running service:
docker service create --name web --replicas 3 -p 8080:80 nginx:1.25

# Deploy new version with zero-downtime intent:
docker service update \
  --image nginx:1.27-alpine \
  --update-order start-first \
  --update-parallelism 1 \
  --update-delay 5s \
  --update-failure-action rollback \
  web
```

---

## 16) Teaching & Lab Ideas

* **Lab 1:** Build a 3‑node Swarm, deploy a replicated web, scale up/down, observe routing mesh.
* **Lab 2:** Add a database with constraints + a labeled node; discuss persistence trade‑offs.
* **Lab 3:** Rolling update with a failing image + automatic rollback.
* **Lab 4:** Create secrets/configs; rotate a secret without downtime.
* **Lab 5:** Compare `mode=ingress` vs `mode=host`, and VIP vs DNSRR.

---

## 17) Summary (Cheat‑Sheet Style)

* Swarm = **simple, secure, built‑in** orchestrator.
* **Services** (desired state) → **Tasks** → **Containers**.
* **Overlay networks**, **VIP load‑balancing**, **routing mesh**.
* **Rolling updates**, **rollbacks**, **secrets/configs**, **constraints**.
* Best for **small‑to‑medium** clusters and **education**; Kubernetes for complex needs.

---

## 18) Minimal Command Reference (Copy & Paste)

```bash
# Cluster
docker swarm init
docker swarm join --token <token> <manager_ip>:2377
docker node ls
docker node update --availability drain <node>

# Networking
docker network create -d overlay app-net

# Services
docker service create --name web --replicas 3 --network app-net -p 8080:80 nginx:alpine
docker service update --image nginx:1.27-alpine --update-order start-first web
docker service scale web=6
docker service logs -f web

# Stacks
docker stack deploy -c docker-compose.yml mystack
docker stack ps mystack
docker stack rm mystack

# Secrets / Configs
echo -n "shhh" | docker secret create api_key -
docker config create nginx_conf ./nginx.conf
```
