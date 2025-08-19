---
title: Inspecting and Managin Docker Networks
---
# Inspecting and Managing Docker Networks

A practical, structured guide to **discovering**, **understanding**, and **modifying** Docker networks—designed for teaching and hands-on learning.

---

## Learning Objectives

By the end, learners can:

* Enumerate existing Docker networks and explain the purpose of the defaults.
* Inspect network details (driver, scope, subnets, gateways, connected containers).
* Create user-defined networks with custom IPAM settings and options.
* Connect and disconnect running containers from networks (including static IPs).
* Troubleshoot common networking issues and apply best practices.

---

## Key Concepts (Quick Ref)

* **Network drivers:** `bridge` (single host), `host` (share host stack), `none` (no networking), `macvlan/ipvlan` (L2/L3 integration with physical LAN), `overlay` (multi-host via Swarm).
* **User-defined bridge vs default `bridge`:** user-defined bridges provide **embedded DNS-based service discovery** (containers can reach each other by name) and better isolation. The default `bridge` is more limited and intended for simple setups.
* **IPAM:** IP Address Management (subnets, gateways, pools, IPv6..

---

## 1. List Available Networks

```bash
docker network ls
```

Typical output:

```
NETWORK ID     NAME      DRIVER    SCOPE
6f8b4c12cd0a   bridge    bridge    local
9b1c2d3e4f5g   host      host      local
1a2b3c4d5e6f   none      null      local
a7b8c9d0e1f2   my-bridge bridge    local
```

**What to look for**

* **NAME:** Human-friendly identifier used in other commands.
* **DRIVER:** Behavior and capabilities (`bridge`, `overlay`, etc.).
* **SCOPE:** `local` (single host) or `swarm` (multi-host).

**Teaching tip:** Have learners identify which networks are **default** (`bridge`, `host`, `none`) vs **user-defined**.

---

## 2. Inspect Network Configuration

```bash
docker network inspect <network-name>
```

Example:

```bash
docker network inspect my-bridge
```

Key fields to highlight in the JSON:

* **"Driver"** – e.g., `"bridge"`.
* **"IPAM.Config"** – subnets, gateways, and (optionally) IPv6 ranges.
* **"Containers"** – list of connected containers and their assigned IPs.
* **"Options"** – driver-specific tunables (e.g., bridge name, ICC).

Readable output with Go templates:

```bash
docker network inspect my-bridge \
  --format '{{json .IPAM.Config}}'
```

Or filter connected containers:

```bash
docker network inspect my-bridge \
  --format 'Containers: {{range $id, $c := .Containers}}{{$c.Name}} ({{$c.IPv4Address}}) {{end}}'
```

**Teaching tip:** Ask learners to find the **subnet**, **gateway**, and list connected **container names** and **IPs**.

---

## 3. Create a Custom Bridge Network

```bash
docker network create my-bridge
```

Why user-defined bridges?

* **Isolation:** Containers on different user-defined networks are isolated by default.
* **DNS service discovery:** Containers can resolve each other by **name**.
* **Custom IPAM:** Choose your own subnets/gateways.

### Useful creation flags

```bash
# Specify subnet and gateway
docker network create \
  --driver bridge \
  --subnet 10.10.0.0/24 \
  --gateway 10.10.0.1 \
  my-bridge

# Enable IPv6 (requires daemon IPv6 enabled)
docker network create \
  --driver bridge \
  --ipv6 \
  --subnet 2001:db8:abcd::/64 \
  my-bridge-v6

# Make it internal (no outbound access via NAT)
docker network create \
  --driver bridge \
  --internal \
  internal-net

# Add labels for organization
docker network create \
  --label env=dev \
  --label owner=team-a \
  team-a-net
```

Driver-specific options (example for bridge):

```bash
docker network create \
  --driver bridge \
  --opt com.docker.network.bridge.name=br-mynet \
  --opt com.docker.network.bridge.enable_icc=true \
  my-bridge-advanced
```

**Note:** Most network properties (driver, subnets) are immutable after creation. If you need different IP ranges, **create a new network** and migrate containers.

---

## 4. Connect / Disconnect Containers

Connect a **running** container to a network:

```bash
docker network connect my-bridge my-container
```

Disconnect:

```bash
docker network disconnect my-bridge my-container
```

### Assign a static IP (IPv4/IPv6.

```bash
docker network connect \
  --ip 10.10.0.50 \
  my-bridge my-container
```

```bash
docker network connect \
  --ip6 2001:db8:abcd::50 \
  my-bridge my-container
```

### Add a per-network alias

Aliases become additional DNS names reachable by peers on the same network.

```bash
docker network connect \
  --alias db \
  my-bridge postgres-1
```

**Verification exercises**

* From another container on `my-bridge`, `ping db` or `curl http://db:5432` (adjust for service).
* Run `docker inspect my-container` and confirm the interface entry under `.NetworkSettings.Networks["my-bridge"]`.

---

## 5. Network Lifecycle Management

### Remove a network

```bash
docker network rm my-bridge
```

A network must be **unused** (no connected containers). Disconnect or stop/remove containers first.

### Prune unused networks

```bash
docker network prune
```

Removes **all** unused (dangling) networks. Review the prompt carefully.

### Rename a network

Docker does **not** support renaming networks. Recreate with the desired name.

---

## 6. Practical Scenarios

### A) Isolating front-end and back-end

```bash
docker network create frontend
docker network create backend

# Nginx on frontend only
docker run -d --name web --network frontend nginx

# App on both networks (talks to web and db)
docker run -d --name app \
  --network frontend \
  --network-alias app \
  myorg/app:latest

docker network connect backend app

# Database on backend only
docker run -d --name db --network backend postgres
```

Outcome:

* `web` ↔ `app` via `frontend`
* `app` ↔ `db` via `backend`
* `web` cannot reach `db` directly.

### B) Migrating a service to a new subnet

1. Create a new network with the desired IPAM settings.
2. `docker network connect new-net service`
3. Update peer services to use the new DNS name (if applicable).
4. `docker network disconnect old-net service`
5. Remove `old-net` once unused.

---

## 7. Troubleshooting & Diagnostics

* **Container can’t resolve another by name**

  * Ensure both are on the **same user-defined network**.
  * Check aliases: `docker network inspect <net>` and review `Containers`.
* **IP conflict with host LAN**

  * Use a **non-overlapping** subnet for bridge networks (e.g., avoid `192.168.0.0/24` if your LAN uses it).
* **No internet from container**

  * If network is `--internal`, containers won’t have outbound NAT.
  * Check host firewall rules and `iptables`/`nftables` policies.
* **Port mapping confusion**

  * Port mapping (`-p 8080:80`) is a **host publish** feature and not required within the same user-defined network. Peers talk directly via container IP/port.
* **Find which networks a container uses**

  ```bash
  docker inspect <container> \
    --format '{{json .NetworkSettings.Networks}}'
  ```
* **Trace routes and DNS**

  * Use debugging containers (e.g., `nicolaka/netshoot`) with `dig`, `tcpdump`, `traceroute`, `curl`:

    ```bash
    docker run -it --rm --network my-bridge nicolaka/netshoot
    ```

---

## 8. Beyond Bridge: Other Useful Drivers (Quick Overview)

* **host:** Container shares host’s network stack (no port mapping needed). Highest performance, least isolation. Single host only.
* **none:** Fully isolated; no network interfaces except loopback. Useful for strict sandboxing.
* **macvlan / ipvlan:** Give containers IPs on the **physical LAN**. Useful for services that must be first-class LAN citizens. Requires careful parent interface and VLAN planning.
* **overlay (Swarm):** Multi-host virtual networks. Requires initializing Docker Swarm (`docker swarm init`). Ideal for distributed services; supports **attachable** networks for standalone containers in a Swarm.

---

## 9. Security & Best Practices

* Prefer **user-defined bridge** networks for app stacks; avoid piling everything onto the default `bridge`.
* Use **internal** networks for back-end tiers (DB/cache) that should not reach the internet.
* Segment services (frontend/backend/ops) across **separate networks** to minimize blast radius.
* Assign **least privilege**: only connect containers to the networks they truly need.
* Avoid `--net=host` for untrusted workloads; it removes critical isolation.
* Choose **non-overlapping** subnets to prevent routing ambiguity with your host/LAN/VPNs.
* Use **labels** to track ownership and environment; prune unused networks regularly.

---

## 10. Teaching Lab Checklist

1. Create `my-bridge` with a custom subnet and gateway.
2. Run two containers on `my-bridge`, verify DNS by container name and alias.
3. Assign a **static IP** to one container and verify connectivity.
4. Create an **internal** network and show that outbound internet is blocked.
5. Disconnect and reconnect a container to migrate it to a new network.
6. Inspect networks and containers with `--format` to extract key fields.
7. Clean up: disconnect containers, remove networks, and run `docker network prune`.

---

## Command Reference (Cheat Sheet)

```bash
# List
docker network ls

# Inspect (JSON)
docker network inspect <network>

# Create (bridge by default)
docker network create <name>
docker network create --driver bridge --subnet 10.10.0.0/24 --gateway 10.10.0.1 <name>
docker network create --internal <name>
docker network create --ipv6 --subnet 2001:db8:1::/64 <name>

# Connect / disconnect
docker network connect <network> <container>
docker network connect --ip 10.10.0.50 --alias svc <network> <container>
docker network disconnect <network> <container>

# Remove / prune
docker network rm <network>
docker network prune
```
