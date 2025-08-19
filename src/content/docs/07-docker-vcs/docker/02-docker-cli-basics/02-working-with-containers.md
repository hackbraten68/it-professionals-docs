---
title: Working with Containers
description: A comprehensive, structured guide to managing containers with the Docker CLI—covering lifecycle, run modes, networking, logs, exec, resources, health checks, cleanup, troubleshooting, and best practices.
audience: Beginners to intermediate learners in DevOps/software engineering
prerequisites:
  - Docker Engine and CLI installed
  - Basic terminal proficiency
  - (Linux) Use `sudo` with Docker commands if your user is not in the `docker` group
---

# Working with Containers (Docker CLI)

This lesson teaches the day-to-day Docker CLI you’ll use to **launch, inspect, connect to, observe, and clean up containers**. It focuses on practical commands and includes explanations, defaults, and gotchas.

---

## 1. Containers vs. Images (Quick Recap)

- **Image**: A read-only template (layers) used to create containers (e.g., `nginx:latest`).
- **Container**: A **running** (or stopped) instance of an image with its own writable layer, process, namespaces, and cgroup limits.
- **Immutable image, mutable container**: Config changes made at `docker run` time belong to the container, not the image.

---

## 2. Container Lifecycle in a Nutshell

1. **Create**: Defines container config, but doesn’t start the process.
   - `docker create --name web -p 8080:80 nginx:latest`
2. **Start**: Launches the container’s PID 1.
   - `docker start web`
3. **Run**: Shorthand for **create + start** in one step.
   - `docker run ...`
4. **Stop**: Sends `SIGTERM`, then `SIGKILL` if not exiting gracefully within timeout.
   - `docker stop web`
5. **Restart**: Stops and starts again.
   - `docker restart web`
6. **Pause/Unpause**: Suspends/resumes processes with cgroup freezer.
   - `docker pause web && docker unpause web`
7. **Remove**: Deletes container metadata and writable layer (must be stopped).
   - `docker rm web` (or `docker rm -f web` to force-kill then remove)

---

## 3. Starting & Running Containers

### 3.1 Basic run

```bash
docker run nginx:latest
````

**What happens / defaults**

* Runs in **foreground** (attached), streams container STDOUT/STDERR.
* No port mapping by default (you won’t reach it from the host browser).
* Auto-generated name (e.g., `nostalgic_mcnulty`).
* **Container exits when PID 1 exits**. For `nginx`, it stays running; for one-shot commands it will exit.

### 3.2 Detached mode (`-d`)

```bash
docker run -d --name my-nginx -p 8080:80 nginx:latest
```

* Runs in the background (prints container ID).
* `-p HOST:CONTAINER` publishes container port to host.
* Name your containers (`--name`) to avoid random names and ease scripting.

### 3.3 Interactive & TTY

```bash
docker run -it ubuntu:22.04 /bin/bash
```

* `-i` keeps STDIN open.
* `-t` allocates a pseudo-TTY.
* Useful for **debug shells** and **exploration** of images.

### 3.4 Environment variables (`-e`, `--env-file`)

```bash
docker run -d -e MYSQL_ROOT_PASSWORD=secret --name db mysql:8
```

* Pass environment configuration into containers.
* Use `--env-file .env` to provide many variables from a file.
* Avoid committing secrets to images; inject them at runtime.

### 3.5 Working directory (`-w`) & user (`-u`)

```bash
docker run -it -v "$(pwd)":/app -w /app node:18-alpine npm start
```

* `-w` sets the working directory (like `cd`).
* `-u` can run as a non-root user (e.g., `-u 1000:1000`).
* Mount your source code (`-v` or `--mount`) for **live dev loops**.

### 3.6 Resource limits (recommended)

```bash
docker run -d --name cpu-demo --cpus="1.5" --memory="512m" busybox:stable sleep 3600
```

* Control CPU and memory to **prevent noisy neighbors** or runaway containers.
* Common flags: `--cpus`, `--cpuset-cpus`, `--memory`, `--memory-swap`.

### 3.7 Restart policies (for long-running services)

```bash
docker run -d --restart unless-stopped --name api -p 3000:3000 myorg/api:1.0
```

* Options: `no` (default), `on-failure[:max]`, `always`, `unless-stopped`.
* Ensures containers auto-recover on daemon restart or crashes.

---

## 4. Networking & Ports

### 4.1 Publish ports

```bash
docker run -d -p 8080:80 nginx:latest
```

* `-p hostPort:containerPort` binds the container port to the host.
* `-P` (capital P) publishes all EXPOSEd ports to **random** host ports.

### 4.2 Inspect mapped ports

```bash
docker port my-nginx
```

* Shows runtime mappings (e.g., `80/tcp -> 0.0.0.0:8080`).

### 4.3 Container-to-container communication

* On the default **bridge** network, containers can **reach each other via IP**.
* For name-based DNS resolution and isolation, create a user-defined bridge:

```bash
docker network create appnet
docker run -d --name db --network appnet postgres:16
docker run -d --name api --network appnet -e DB_HOST=db myorg/api:1.0
```

* Containers on `appnet` can use `db:5432` by name (built-in DNS).

---

## 5. Filesystems, Mounts & Copying

### 5.1 Bind mounts vs. Volumes (quick)

* **Bind mount**: Host path into container (`-v "$(pwd)":/app`)—great for dev.
* **Volume**: Docker-managed path—portable, good for persistent data in prod.

### 5.2 CLI examples

```bash
# Bind mount current dir into /app (dev workflow)
docker run -it --rm -v "$(pwd)":/app -w /app node:18-alpine npm test

# Named volume for persistent DB data
docker volume create pgdata
docker run -d --name pg -v pgdata:/var/lib/postgresql/data postgres:16
```

### 5.3 Copy files to/from a container

```bash
# Copy from host to container
docker cp ./config.yml my-nginx:/etc/nginx/conf.d/config.yml

# Copy from container to host
docker cp my-nginx:/var/log/nginx/access.log ./access.log
```

---

## 6. Listing, Inspecting & Metadata

### 6.1 List containers

```bash
docker ps          # running only
docker ps -a       # all (including exited)
```

* Useful columns: `STATUS`, `PORTS`, `NAMES`, `IMAGE`, `COMMAND`, `CREATED`.

### 6.2 Inspect container details

```bash
docker inspect my-nginx
```

* Dumps JSON with **config**, **network settings**, **mounts**, **state**, etc.
* Filter with `--format` (Go templates) to extract fields:

```bash
docker inspect --format '{{ .NetworkSettings.IPAddress }}' my-nginx
```

### 6.3 Top & Stats

```bash
docker top my-nginx      # processes inside the container
docker stats             # live CPU/mem/IO metrics for all containers
```

---

## 7. Logs, Exec & Attach

### 7.1 Logs

```bash
docker logs my-nginx
docker logs -f my-nginx        # follow (tail -f)
docker logs --since=10m my-nginx
docker logs --tail=100 my-nginx
```

* Logs come from the container’s **stdout/stderr**.
* Use `--timestamps` to include ISO timestamps.

### 7.2 Execute commands inside a running container

```bash
docker exec -it my-nginx /bin/sh
```

* Starts a **new process** inside the container’s namespaces.
* Add `-u` to run as a specific user: `docker exec -u 0 -it my-nginx sh` (root).
* Use for **one-off diagnostics** or admin tasks.

### 7.3 Attach to PID 1

```bash
docker attach my-nginx
```

* Re-connects your terminal to the **main process** (PID 1..
* **Caution**: `CTRL+C` may send signals to the main process (could stop it).
* Prefer `docker logs -f` for viewing output without sending signals.

---

## 8. Health Checks (Know When “Up” Is Really Up)

* Images can define a `HEALTHCHECK` command. Docker evaluates it periodically.
* Check via `docker ps` (`(healthy)`, `(unhealthy)`) or inspect:

```bash
docker inspect --format '{{json .State.Health}}' my-nginx | jq
```

* Use health to gate orchestration or restart policies.

---

## 9. Updating & Recreating Containers (Immutable Config Pattern)

* Many flags (ports, env, mounts) **cannot be changed in place**.
* Pattern: **stop → remove → run** again with new config (idempotent scripts).

```bash
docker pull myorg/api:1.1
docker stop api && docker rm api
docker run -d --name api -p 3000:3000 --env-file .env --restart unless-stopped myorg/api:1.1
```

---

## 10. Cleaning Up

```bash
# Stop / start
docker stop my-nginx
docker start my-nginx

# Remove a single container (must be stopped unless -f)
docker rm my-nginx
docker rm -f stuck-container    # force remove

# Prune stopped containers (interactive confirm)
docker container prune

# Prune *everything* not in use (be careful)
docker system prune
docker system prune -a           # also removes unused images
```

**Tip**: Use `--rm` on `docker run` to auto-remove when the process exits:

```bash
docker run --rm -it alpine:3.20 sh
```

---

## 11. Signals, Exit Codes & Graceful Shutdowns

* `docker stop` sends `SIGTERM`, waits (default 10s), then `SIGKILL`.
* Applications should **trap `SIGTERM`** to close gracefully (flush logs, close DB).
* Container exit code = **main process exit code**. Check with:

```bash
docker inspect --format '{{ .State.ExitCode }}' my-job
```

---

## 12. Security-Conscious Flags (Quick Wins)

* Run as a non-root user: `-u 1000:1000`.
* Read-only filesystem: `--read-only` (mount a tmpfs for writable paths if needed).
* Drop Linux capabilities you don’t need: `--cap-drop ALL --cap-add NET_BIND_SERVICE`.
* Limit device access: `--device-read-bps`, `--device-write-bps`, or no devices at all.
* Seccomp/AppArmor (defaults help; use custom profiles when required).

---

## 13. Common Patterns & One-Liners

* **Ad-hoc test container**:

```bash
docker run --rm -it --network host nicolaka/netshoot bash
```

* **Tail a file inside a container**:

```bash
docker exec -it my-nginx sh -c 'tail -f /var/log/nginx/access.log'
```

* **Export filesystem (for debugging)**:

```bash
docker export my-nginx | tar -tvf -     # list files
```

* **Rename container**:

```bash
docker rename old-name new-name
```

* **Set container hostname**:

```bash
docker run -d --hostname web-1 nginx:latest
```

---

## 14. Troubleshooting Checklist

1. **Container exits immediately**: Is the command a one-shot? Check `docker logs`. Use `-it` if it expects a TTY.
2. **Port not reachable**: Did you publish the port (`-p`)? Is the app listening on the correct interface (0.0.0.0 not 127.0.0.1.?
3. **Permission denied with bind mounts**: Check host file permissions/SELinux; try `:Z` on SELinux systems or fix ownership (`-u`).
4. **High CPU/memory**: Inspect with `docker stats`; add `--cpus`/`--memory` limits.
5. **DNS/connectivity**: Verify the network (`docker inspect`, `docker network ls`), try a user-defined bridge.
6. **Stuck on stop**: `docker stop -t 3` then `docker rm -f`. Investigate signal handling in the app.
7. **Logs too noisy/large**: Configure logging driver/rotation in daemon or per-container options (e.g., `--log-opt max-size=10m`).

---

## 15. Hands-On Exercises

1. **Hello Nginx**: Run `nginx:latest` on port 8080; verify with browser and `docker logs -f`.
2. **Interactive Ubuntu**: Start `ubuntu:22.04` with `/bin/bash`, create a file in `/tmp`, exit, `docker ps -a` to see status.
3. **App + DB Network**: Create `appnet`, run `postgres:16` and an app container on it; connect via service name.
4. **Resource Limits**: Run a CPU-bound container and cap it with `--cpus=1`; compare `docker stats`.
5. **Graceful Stop**: Run a simple HTTP server that traps `SIGTERM`; confirm `docker stop` exits cleanly.
6. **Persist Data**: Use a named volume for Postgres data; stop/remove the container and verify data persists with a new one.

---

## 16. Quick Reference (Cheat Sheet)

```bash
# Run
docker run [--rm] [-d] [-it] [--name NAME] [-p HOST:CONT] [-e K=V] [-v SRC:DEST] IMAGE [CMD]

# Lifecycle
docker ps [-a]                # list
docker stop|start|restart ID
docker pause|unpause ID
docker rm [-f] ID

# Inspect/observe
docker inspect ID
docker logs [-f] ID
docker top ID
docker stats [ID]

# Exec/attach
docker exec [-u UID:GID] -it ID sh|bash
docker attach ID

# Networks & ports
docker port ID
docker network ls|inspect|create NET

# Volumes & files
docker volume ls|inspect|create NAME
docker cp SRC DEST
```

---

## 17. Example Snippets From This Lesson

### Start & Publish

```bash
docker run -d --name my-nginx -p 8080:80 nginx:latest
```

### Inspect Ports

```bash
docker port my-nginx
```

### Follow Logs

```bash
docker logs -f my-nginx
```

### Exec into Shell

```bash
docker exec -it my-nginx /bin/sh
```

### Stop, Start, Remove, Prune

```bash
docker stop my-nginx
docker start my-nginx
docker rm my-nginx
docker container prune
```

---

## 18. Best Practices Summary

* **Name containers** for easier scripting and ops.
* **Pin image tags** (e.g., `nginx:1.25`) for reproducibility.
* **Use restart policies** for services; **resource limits** for stability.
* Prefer **user-defined bridge networks** for clean service discovery.
* Run as **non-root**, consider **read-only** FS, and **drop capabilities**.
* Keep containers **single-purpose**; store data in **volumes**.
* Treat container config as **immutable**: recreate with new flags rather than mutating in place.

---
