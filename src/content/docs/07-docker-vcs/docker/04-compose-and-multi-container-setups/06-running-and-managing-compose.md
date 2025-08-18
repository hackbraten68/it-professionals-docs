---
title: Running and Managing Compose
---
# Running & Managing Docker Compose

A practical, comprehensive guide for day-to-day use of Docker Compose in development, CI, and small deployments.

> **Note on CLI names:** Modern Docker uses **`docker compose`** (space, **v2**). Many guides still show **`docker-compose`** (hyphen, legacy **v1**). All commands below work the same; pick the form your environment supports.

---

## 1) Core Lifecycle Commands

### Start services

```bash
docker compose up            # build (if needed) + create + start + attach logs
docker compose up -d         # same, but detached (runs in background)
```

Useful flags:

* `--build` – force a rebuild before starting
* `--no-build` – do not build even if required
* `--force-recreate` – recreate containers even if nothing changed
* `--renew-anon-volumes` – replace anonymous volumes to avoid stale state
* `--remove-orphans` – remove containers of services no longer in the file
* `--scale SERVICE=NUM` – run N replicas of a service (e.g., `web=3`)

### Stop & remove

```bash
docker compose down          # stop and remove containers, default network
```

Destructive options:

* `--volumes` – also remove named & anonymous volumes created by Compose
* `--rmi local` or `--rmi all` – remove images (careful!)
* `--remove-orphans` – clean up stray containers
* `--timeout SECONDS` – graceful stop timeout before SIGKILL

> **When to use `stop` vs `down`:**
> `docker compose stop` stops containers but **keeps** them and the network for quick restart.
> `docker compose down` **removes** them (clean slate).

### Build images

```bash
docker compose build         # build all services with a build context
docker compose build web     # build a single service
```

Common flags:

* `--no-cache` – ignore the build cache
* `--pull` – always attempt to pull newer base images
* `--progress=plain` – full logs in CI

---

## 2) Observability & Diagnostics

### Logs

```bash
docker compose logs                  # aggregated logs from all services
docker compose logs api              # logs for a single service
docker compose logs -f --tail=100    # follow, last 100 lines
```

Flags:

* `--timestamps` – show log timestamps
* `--no-color` – monochrome output (CI, file export)

### List containers

```bash
docker compose ps            # show running service containers
docker compose ps -a         # include stopped
docker compose ps --services # only service names
```

Tip: Combine with `--filter` (v2 supports limited filters), or use plain Docker:

```bash
docker ps --filter "label=com.docker.compose.project=<project>"
```

### Shell access & ad-hoc commands

```bash
docker compose exec web sh           # open a shell in a running container
docker compose exec db psql -U user  # run commands in place
```

If the service has no shell, prefer `bash -lc` or the service’s native CLI.

Run a **one-off** container using service config (network/env/volumes):

```bash
docker compose run --rm web node scripts/seed.js
```

Key differences:

* `exec` runs **inside** an existing container.
* `run` creates a **new** temporary container for the task.

---

## 3) Day-to-Day Management Cheatsheet

| Task                        | Command                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| Start in background         | `docker compose up -d`                                                 |
| Tail live logs              | `docker compose logs -f`                                               |
| Rebuild + restart           | `docker compose up -d --build`                                         |
| Recreate everything cleanly | `docker compose down && docker compose up -d --build --remove-orphans` |
| Scale a service             | `docker compose up -d --scale worker=5`                                |
| Enter container             | `docker compose exec api sh`                                           |
| Stop without removing       | `docker compose stop`                                                  |
| Tear down including volumes | `docker compose down --volumes`                                        |

---

## 4) Configuration Controls That Affect Runtime

### Project name

Compose derives a **project name** (used in container, network, and volume labels) from the directory. Override it to avoid collisions:

```bash
docker compose -p myproject up -d
# or via env: COMPOSE_PROJECT_NAME=myproject
```

### Specify files & overrides

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

* Later files override earlier ones (great for per-env tweaks).
* Common pattern: keep `docker-compose.yml` minimal, put dev specifics in `docker-compose.override.yml` (auto-picked up).

### Environment files

```bash
docker compose --env-file .env.dev up -d
```

* Variables in `.env` can parameterize your compose file (ports, versions, credentials).
* Do **not** commit secrets; prefer a secure secret manager in production.

### Profiles (selective startup)

In `docker-compose.yml`:

```yaml
services:
  admin:
    image: myorg/admin:latest
    profiles: ["ops"]
```

Run:

```bash
docker compose --profile ops up -d   # only includes services with profile "ops"
```

---

## 5) Health, Restart, and Persistence (Operational Basics)

### Healthchecks (configured in YAML)

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 2s
      retries: 5
      start_period: 20s
```

* Compose will show health in `ps` (e.g., `healthy`, `starting`).
* Dependents can use `depends_on: condition: service_healthy` (Compose v3.4+).

### Restart policies

```yaml
services:
  worker:
    restart: unless-stopped   # or: "no" | always | on-failure[:max-retries]
```

* Use `docker compose restart [SERVICE]` to bounce services.

### Volumes for data

* Named volumes persist container rebuilds.
* Use `down --volumes` **only** when you truly want to delete stored state.

---

## 6) Networking & Names

* Services share a default project network: reach peers via **service name** (e.g., `db:5432`).
* Expose to host via `ports:` in YAML or `-p` in plain `docker run`.
* Use additional `networks:` if you need isolation or to connect to external stacks.

---

## 7) CI/CD & Production Tips

* **Deterministic builds:** pin image tags (e.g., `postgres:16.3`) and lock dependency versions.
* **Build cache in CI:** use `--cache-from` with a remote registry or Docker BuildKit cache exports.
* **Read-only runtime:** for web/API services, prefer read-only filesystems with explicit writable mounts.
* **Secrets:** don’t bake secrets into images or compose files. Use Docker/Swarm secrets or environment injection via CI.
* **Separate concerns:** build images in CI (`docker build ... && docker push ...`), then `docker compose pull && docker compose up -d` on servers.

---

## 8) Troubleshooting Playbook

### Port is already allocated

* Find the conflict:

  ```bash
  lsof -i :3000   # macOS/Linux
  ```
  
* Change `ports:` mapping or stop the conflicting service.

### Code changes not reflected

* If using bind mounts (`./src:/app/src`), the change should be live.
* If files are copied into images during build, you must rebuild:

  ```bash
  docker compose build api && docker compose up -d api
  ```

### “Orphan” containers after file changes

```bash
docker compose up -d --remove-orphans
```

### Stuck state or weird volumes

```bash
docker compose down --volumes --remove-orphans
docker volume ls | grep <project>    # inspect leftovers
```

### Permission errors with volumes

* On Linux, ensure proper uid/gid ownership or use `user:` in service config.
* For databases, **never** delete volumes unless you’ve backed up data.

---

## 9) Helpful Secondary Commands

* **`docker compose config`** – validate & print the fully-merged config (great for debugging overrides/profiles).
* **`docker compose pull [SERVICE]`** – fetch latest images from registry.
* **`docker compose push [SERVICE]`** – push built images to registry.
* **`docker compose rm`** – remove **stopped** service containers.
* **`docker compose pause` / `unpause`** – temporarily freeze/unfreeze processes.

---

## 10) Example Workflows

### Local development

```bash
# first time
docker compose up -d --build

# interactive debugging
docker compose exec api sh
docker compose logs -f api

# after changing Dockerfile
docker compose build api && docker compose up -d api
```

### Clean rebuild while keeping data

```bash
docker compose down --remove-orphans
docker compose up -d --build
```

### Full reset (including data) — **destructive**

```bash
docker compose down --volumes --rmi local --remove-orphans
docker compose up -d --build
```

---

## 11) Quick Reference

* `docker-compose up` – starts the defined services
* `docker-compose up -d` – starts in detached mode
* `docker-compose down` – stops **and removes** containers (and default network)
* `docker-compose build` – builds the images (if using `build:` context)
* `docker-compose logs` – view logs from all services (`-f` to follow)
* `docker-compose ps` – shows running containers

*(Replace `docker-compose` with `docker compose` on newer Docker installations.)*

---

## 12) Best Practices Summary

* Use **named volumes** for state; avoid wiping them casually.
* Prefer **`docker compose up -d --build --remove-orphans`** after changes.
* Keep a tidy environment with **project names** and **profiles**.
* Validate with **`docker compose config`** before CI/CD runs.
* Treat Compose as **orchestration for a single host**; graduate to Swarm/Kubernetes for multi-host needs.
