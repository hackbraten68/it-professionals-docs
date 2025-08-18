---
title: Networking and Volumes
---

# Learning Objectives

By the end of this lesson, you will be able to:

- Explain Docker’s network and storage models and when to use each feature.
- Create and manage networks (`bridge`, `host`, `none`, and user-defined networks).
- Publish ports, enable container-to-container communication, and use DNS-based service discovery.
- Persist and share data using **named volumes**, **bind mounts**, and **tmpfs**.
- Choose between `-v` and the more explicit `--mount` syntax; understand permissions, SELinux, and ownership.
- Inspect, troubleshoot, back up, and clean up networks and volumes safely.

---

# 1) Networking in Docker

Docker networking connects containers to each other, to the host, and to external networks. Each container gets its own network namespace (its own network stack), and networks are implemented with drivers (e.g., `bridge`, `host`, `overlay`, `macvlan`, `ipvlan`).

## 1.1 Default Networks on a Single Host

- **bridge** (default for Linux): NATed network behind the host; containers get private IPs on a virtual bridge and outbound traffic is SNATed.
- **host** (Linux): Container shares the host’s network namespace—no isolation, no port publishing needed.
- **none**: No networking (only loopback inside the container).

List networks:

```bash
docker network ls
```

Inspect a network:

```bash
docker network inspect bridge
```

## 1.2 User-Defined Bridge Networks (Recommended)

User-defined bridges provide:

* Automatic **embedded DNS** for name-based service discovery.
* Better isolation (containers only see peers on the same network).
* Configurable subnets, IP ranges, and gateways.
* Network-scoped aliases.

Create a custom bridge:

```bash
docker network create my-bridge
```

Run a container on it:

```bash
docker run -d --network my-bridge --name app my-node-app
```

Inspect details (IPAM, connected containers, options):

```bash
docker network inspect my-bridge
```

Connect/disconnect existing containers:

```bash
docker network connect my-bridge some-container
docker network disconnect my-bridge some-container
```

Specify subnets and IP ranges:

```bash
docker network create \
  --driver bridge \
  --subnet 10.10.0.0/24 \
  --gateway 10.10.0.1 \
  --ip-range 10.10.0.128/25 \
  appnet
```

Assign a static container IP (avoid unless you really need it):

```bash
docker run -d --network appnet --ip 10.10.0.10 --name api myorg/api:1.0
```

## 1.3 Name Resolution and Aliases

Docker’s embedded DNS resolves **container names** on the same user-defined bridge:

```bash
# From one container on the same network:
ping api
curl http://api:8080/health
```

Add **network-scoped aliases**:

```bash
docker run -d --network appnet \
  --network-alias service-a \
  --name service-a-1 myorg/service-a
```

Now `service-a` resolves to `service-a-1`’s IP on `appnet`.

## 1.4 Publishing Ports (Host ↔ Container)

On a **bridge** network, containers are private; publish ports to reach them from the host/external clients:

* `-p HOST:CONTAINER` publishes a specific host port.
* `-P` publishes all `EXPOSE`d ports to random high ports.

Examples:

```bash
# Map host 8080 → container 80
docker run -d -p 8080:80 --name web nginx:latest

# Publish all EXPOSEd ports to random host ports
docker run -d -P myapp:latest
```

On **host** network (Linux), you don’t publish ports because the container shares the host stack:

```bash
docker run --network host -d myapp:latest
```

Tip: Avoid `--network host` in multi-tenant environments; it weakens isolation.

## 1.5 Other Drivers (Overview)

* **overlay**: Multi-host networking for Swarm/Kubernetes; creates a virtual L2 overlay across nodes.
* **macvlan/ipvlan**: Give containers routable addresses on the physical network (bypass NAT), useful for appliances or when peers must initiate connections to containers directly. Requires coordination with your physical network.

Example macvlan (advanced):

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  extnet
```

## 1.6 Troubleshooting Networking

Basic checks:

```bash
# See container’s network settings
docker inspect --format '{{json .NetworkSettings}}' app | jq .

# Exec into a container to test connectivity
docker exec -it app sh
apk add curl bind-tools  # alpine
curl -I http://api:8080/health
nslookup api
```

Check host rules (Linux):

* iptables/nftables rules for NAT and port mappings.
* Conflicts with host firewalls or other services binding the same port.

Common pitfalls:

* Port already in use on host → choose another host port.
* Containers on different networks cannot reach each other unless connected to both.
* DNS resolution only works within the same user-defined network.

---

# 2) Data Persistence

By default, container filesystems are **ephemeral**. Use **volumes** or **bind mounts** to persist data beyond container lifecycles and to share data between containers.

## 2.1 Storage Options

* **Named volumes** (managed by Docker): portable across environments, good defaults, safe for production. Data lives under Docker’s data directory (e.g., `/var/lib/docker/volumes/...`).
* **Bind mounts** (host path ↔ container path): direct link to a host directory/file; great for local dev and when you must interact with host tooling.
* **tmpfs** (Linux): in-memory mount for sensitive or transient data; erased when container stops.

### When to choose which

* **Production application data** (databases, app state): **Named volumes**
* **Local development hot-reloading**: **Bind mounts**
* **Secrets/ephemeral caches**: **tmpfs** (or dedicated secrets manager)

---

## 2.2 Named Volumes

Create a volume:

```bash
docker volume create data-vol
```

Use it in a container:

```bash
docker run -d -v data-vol:/var/lib/mysql mysql:8
```

List and inspect:

```bash
docker volume ls
docker volume inspect data-vol
```

Remove (if unused):

```bash
docker volume rm data-vol
```

With `--mount` (preferred explicit syntax):

```bash
docker run -d \
  --mount type=volume,src=data-vol,dst=/var/lib/mysql \
  mysql:8
```

### Advanced: Volume Drivers and Options

The default driver is `local`, but you can use NFS/CIFS or plugins:

```bash
# NFS example (Linux)
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=10.0.0.5,nolock,soft,rw \
  --opt device=:/exports/appdata \
  nfs-appdata
```

```bash
# CIFS example (Linux)
docker volume create \
  --driver local \
  --opt type=cifs \
  --opt device=//10.0.0.6/share \
  --opt o=username=myuser,password=mypass,uid=1000,gid=1000 \
  cifs-share
```

---

## 2.3 Bind Mounts

Mount a host directory:

```bash
docker run -it \
  -v /home/user/app:/usr/src/app \
  -w /usr/src/app \
  node:18-alpine \
  npm run dev
```

With `--mount`:

```bash
docker run -it \
  --mount type=bind,src=/home/user/app,dst=/usr/src/app \
  -w /usr/src/app \
  node:18-alpine \
  npm run dev
```

Pros and cons:

* **Bind**: real-time sync with host, great for dev; **less portable**, depends on host paths and permissions.
* **Volume**: managed by Docker, **portable and safer** for production; can be shared between containers easily.

### File/Dir Mount Specifics

* Mount a single file (e.g., config):

```bash
docker run -d \
  --mount type=bind,src=/etc/myapp/config.yml,dst=/app/config.yml,ro \
  myapp:1.0
```

* Read-only mounts (use `ro` to reduce risk):

```bash
docker run -d \
  --mount type=bind,src=/var/log/myapp,dst=/logs,ro \
  myapp:1.0
```

### Permissions, Ownership, SELinux, User IDs

* Inside the container, processes run as a user (often `root`, or a non-root UID like `1000`).
* The kernel enforces ownership by **numeric UID/GID**. Ensure host directories are writable by the container’s UID/GID:

```bash
sudo chown -R 1000:1000 /home/user/app-data
```

* On SELinux systems (e.g., Fedora/RHEL), add context flags for bind mounts:

  * `:z` (shared across multiple containers) or `:Z` (private label).

```bash
docker run -d -v /data/mysql:/var/lib/mysql:Z mysql:8
```

### Docker Desktop Note

On macOS/Windows, bind mounts go through a virtualization layer; performance can differ. For databases, prefer **volumes** for better performance and consistency.

---

## 2.4 tmpfs Mounts (RAM-backed, Linux)

Use for secrets, caches, or sensitive transient data:

```bash
docker run -d \
  --tmpfs /run/secrets:rw,size=64m,mode=1700 \
  myapp:1.0
```

Or with `--mount`:

```bash
docker run -d \
  --mount type=tmpfs,destination=/tmp \
  myapp:1.0
```

Data disappears when the container stops.

---

# 3) `-v` vs `--mount` Syntax

* `-v` (or `--volume`) is short and flexible; supports both volumes and bind mounts.
* `--mount` is **more explicit**, recommended for production scripts and clarity.

Examples comparison:

```bash
# Volume with -v
docker run -d -v data-vol:/var/lib/postgresql/data postgres:16

# Volume with --mount
docker run -d --mount type=volume,src=data-vol,dst=/var/lib/postgresql/data postgres:16

# Bind with -v (read-only)
docker run -d -v /srv/nginx/conf:/etc/nginx:ro nginx:alpine

# Bind with --mount
docker run -d --mount type=bind,src=/srv/nginx/conf,dst=/etc/nginx,readonly nginx:alpine
```

---

# 4) Operational Tasks

## 4.1 Backing Up and Restoring Volumes

Create a tarball backup via a helper container:

```bash
# Backup named volume "data-vol" to host file ./data-vol.tar
docker run --rm \
  -v data-vol:/data:ro \
  -v "$PWD":/backup \
  alpine \
  sh -c "cd /data && tar -cf /backup/data-vol.tar ."
```

Restore:

```bash
docker run --rm \
  -v data-vol:/data \
  -v "$PWD":/backup \
  alpine \
  sh -c "cd /data && tar -xf /backup/data-vol.tar"
```

## 4.2 Cleaning Up Safely

Prune **dangling** (unused) volumes and networks:

```bash
# Volumes not referenced by any container
docker volume prune

# Unused networks (no containers attached)
docker network prune
```

Remove a specific network or volume (must be unused):

```bash
docker network rm my-bridge
docker volume rm data-vol
```

Caution: Pruning is irreversible—review what will be removed.

## 4.3 Discovering Anonymous Volumes

Anonymous volumes are created when using `-v /path` without a source. List and inspect:

```bash
docker volume ls
docker inspect <container> | jq '.Mounts'
```

Remove anonymous volumes along with a container:

```bash
docker rm -v some-container
```

---

# 5) Patterns and Best Practices

* Prefer **user-defined bridge networks** for application tiers (e.g., `frontend`, `backend`, `db`) to scope communication.
* Use **service names** instead of IP addresses; let embedded DNS handle resolution.
* Minimize `--network host` usage; keep isolation unless you have a strong reason.
* For CPU/IO-intensive databases on Linux, use **named volumes** over bind mounts for performance and portability.
* Use `--mount` for production clarity.
* Set explicit **UID/GID** in your images (non-root where possible) and align host directory ownership when using bind mounts.
* On SELinux hosts, use `:z`/`:Z` labels for bind mounts.
* Make mounts **read-only** where possible; principle of least privilege.
* Separate **config** (bind mount or image) from **stateful data** (named volume).
* Automate **backups** of important volumes; test restores.
* For multi-host: learn **overlay networks** and external storage/CSI if you move to Swarm/Kubernetes.

---

# 6) Hands-On Lab Checklist

1. Create and inspect a user-defined network:

```bash
docker network create appnet
docker network inspect appnet
```

2. Run two services and test name resolution:

```bash
docker run -d --name api --network appnet hashicorp/http-echo -text="ok"
docker run -it --rm --network appnet alpine sh -c "apk add curl; curl http://api:5678"
```

3. Publish a port to the host:

```bash
docker run -d --name web --network appnet -p 8080:80 nginx:alpine
curl -I http://localhost:8080
```

4. Create a named volume and attach it:

```bash
docker volume create appdata
docker run -d --name db --mount type=volume,src=appdata,dst=/var/lib/mysql mysql:8
```

5. Try a bind mount for dev:

```bash
mkdir -p ~/demo && echo "hello" > ~/demo/index.html
docker run -d --name devweb \
  --mount type=bind,src=$HOME/demo,dst=/usr/share/nginx/html \
  -p 8090:80 nginx:alpine
curl http://localhost:8090
```

6. Backup and restore the volume:

```bash
docker run --rm -v appdata:/data -v "$PWD":/backup alpine \
  sh -c "cd /data && tar -cf /backup/appdata.tar ."
# restore to a fresh volume if needed
```

---

# Appendix: Quick Reference

## Networks

* List: `docker network ls`
* Inspect: `docker network inspect <net>`
* Create bridge: `docker network create <name>`
* Connect: `docker network connect <net> <container>`
* Disconnect: `docker network disconnect <net> <container>`
* Prune: `docker network prune`

## Volumes

* List: `docker volume ls`
* Inspect: `docker volume inspect <vol>`
* Create: `docker volume create <name>`
* Remove: `docker volume rm <name>`
* Prune: `docker volume prune`

## Common Examples (from this lesson)

```bash
# Networks
docker network ls
docker network create my-bridge
docker run -d --network my-bridge --name app my-node-app
docker network inspect my-bridge

# Volumes
docker volume create data-vol
docker run -d -v data-vol:/var/lib/mysql mysql:8
docker volume ls
docker volume inspect data-vol
```

```bash
# Bind Mount for dev work
docker run -it \
  -v /home/user/app:/usr/src/app \
  -w /usr/src/app \
  node:18-alpine \
  npm run dev
```

Notes:

* Bind: real-time sync, but less portable.
* Volume: managed by Docker, safer for production.

