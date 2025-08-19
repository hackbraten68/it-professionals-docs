---
title: What is Docker Compose ?
---
## What Is Docker Compose?

*Audience: learners and practitioners who want a clear, practical understanding of Docker Compose for multi-container development and testing.*

---

## 1. Concept & Purpose

**Docker Compose** is a tool that lets you define, run, and manage **multi-container** applications using a single declarative file, typically `docker-compose.yml` or `compose.yaml`.
Instead of orchestrating many `docker run` commands and manual networks/volumes, you **describe** your services (containers), how they connect, and the resources they need—then start everything with one command.

**Why it matters**

* **Consistency:** A single, versioned file describes your app’s full runtime (services, networks, volumes).
* **Reproducibility:** One command spins up the same environment across machines.
* **Developer speed:** Faster local setups, easier onboarding, less manual glue.
* **Portability:** Compose files travel with your repo for CI, demos, and tests.

---

## 2. Core Building Blocks

Compose centers around a **YAML** file with a few top-level sections:

* `services:` containers to run (web, api, db, cache, worker…)
* `volumes:` data persistence units that services can mount
* `networks:` isolated virtual networks services can join
* `configs:` & `secrets:` structured files/values injected into services (for supported drivers)

A minimal example:

```yaml
# compose.yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

Run it:

```bash
docker compose up
```

Stop and remove containers, networks (but keep named volumes):

```bash
docker compose down
```

---

## 3. Typical Multi-Service Example

```yaml
# compose.yaml
services:
  app:
    build: ./app
    command: npm run dev
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./app:/usr/src/app # hot reload in dev
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: appdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - dbdata:/var/lib/postgresql/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  dbdata:
```

**Highlights**

* `depends_on` + `healthcheck` improves startup order for app → db.
* Named volume `dbdata` persists database between restarts.
* Bind mount `./app:/usr/src/app` enables live code editing.

---

## 4. Essential Commands (Compose V2 syntax)

> Modern Docker installs use **`docker compose`** (space), not `docker-compose` (hyphen).

```bash
# Bring everything up (build if needed), show logs in foreground
docker compose up --build

# Run in background
docker compose up -d

# Stop + remove containers, default network; keep named volumes
docker compose down

# Also remove named volumes
docker compose down -v

# View statuses
docker compose ps

# Stream logs (all or per service)
docker compose logs -f
docker compose logs -f app

# Execute a command inside a running service container
docker compose exec app sh
docker compose exec db psql -U postgres -d appdb

# Build images without starting
docker compose build

# Start/stop a single service
docker compose up -d app
docker compose stop app

# Scale stateless services
docker compose up -d --scale worker=3
```

---

## 5. Key Service Options (Most Common)

Inside `services.<name>`:

* **`image`**: Use an existing image.
* **`build`**: Build from a Dockerfile (e.g., `build: ./api` or object with `context`, `dockerfile`, `args`).
* **`ports`**: Host\:container mappings (`"8080:80"`).
* **`environment`**: Env vars (inline or from files).
* **`volumes`**: Bind mounts (`./code:/app`) and named volumes (`data:/var/lib/...`).
* **`depends_on`**: Startup order; with conditions + healthchecks for readiness.
* **`healthcheck`**: Command + interval/retries for container health.
* **`command` / `entrypoint`**: Override defaults.
* **`restart`**: Policies (`no`, `on-failure`, `always`, `unless-stopped`).
* **`networks`**: Attach to custom networks.
* **`configs` / `secrets`**: Inject files/values where supported.

Example with build args and target:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
      args:
        NODE_ENV: production
```

---

## 6. Networking Model

* Each Compose project gets a **default network**; services can reach each other by **service name** (DNS).
  Example: app calls `http://db:5432`.
* You can create **multiple user-defined networks** for isolation or to split front/back tiers:

```yaml
networks:
  frontend:
  backend:

services:
  web:
    image: caddy
    networks: [frontend]
  api:
    build: ./api
    networks: [frontend, backend]
  db:
    image: postgres
    networks: [backend]
```

---

## 7. Volumes & File Mounts

* **Bind mounts** (host path ↔ container path) are best for **development** & hot reload.
* **Named volumes** are managed by Docker and are best for **persistent data** across machines or paths.

```yaml
services:
  app:
    volumes:
      - ./src:/app/src            # bind (dev)
      - cachedata:/app/.cache     # named (persist)
volumes:
  cachedata:
```

**Tip:** Don’t mount over directories your base image needs at runtime unless you intend to replace them (e.g., avoid shadowing `/usr/src/app/node_modules` without care).

---

## 8. Environment Variables & `.env`

Compose supports **variable substitution** from the shell and `.env` file located next to the compose file:

```yaml
services:
  web:
    image: ${WEB_IMAGE:-nginx:alpine}
    environment:
      - APP_ENV=${APP_ENV}
      - API_URL=${API_URL:-http://localhost:3000}
```

`.env` example:

```
APP_ENV=development
API_URL=http://localhost:3000
```

**Notes**

* Use `${VAR:-default}` to provide defaults.
* Keep secrets out of `.env` if the repo is public; prefer secret stores.

---

## 9. Profiles (Selective Enablement)

**Profiles** let you toggle groups of services (e.g., dev-only dependencies):

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    ports: ["8025:8025"]
    profiles: ["dev"]
```

Run with:

```bash
docker compose --profile dev up -d
```

---

## 10. Multiple Files & Overrides

Compose automatically applies **override files** in order; later files override earlier ones. Common patterns:

* `compose.yaml` – base
* `compose.override.yaml` – local dev overrides (auto-applied if present)
* `compose.prod.yaml` – production overrides

Apply explicitly:

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

---

## 11. Healthchecks & Startup Order

Use healthchecks to gate dependent services:

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 5

  app:
    build: ./app
    depends_on:
      db:
        condition: service_healthy
```

This avoids connection races during startup.

---

## 12. CI, Testing, and Ephemeral Environments

* **CI Pipelines:** Build images with `docker compose build`, run integration tests with `docker compose up -d`, then `docker compose exec` to run test commands.
* **Ephemeral stacks:** Spin up per-branch stacks for review; tear down with `down -v`.
* **Caching:** CI can cache image layers to speed builds.

---

## 13. Logs, Debugging, and Troubleshooting

* `docker compose logs -f <svc>` to tail logs.
* `docker compose exec <svc> sh` to shell in and inspect (`env`, `ls`, `curl`).
* `docker inspect <container>` for low-level details (env, mounts, networks).
* **Common issues:**

  * Port conflicts → change host port in `ports`.
  * Permissions on bind mounts → align user IDs or use volumes.
  * “File changed, but not reloaded” → ensure your app’s watcher is active and paths are bind-mounted.
  * DNS failures → use service names (not `localhost`) for cross-service calls.

---

## 14. Patterns & Recipes

**Reverse proxy + app + db**

```yaml
services:
  proxy:
    image: caddy:2
    ports: ["80:80"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    depends_on: [app]
  app:
    build: ./app
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/appdb
  db:
    image: postgres:16-alpine
    volumes: [dbdata:/var/lib/postgresql/data]
volumes:
  dbdata:
```

**Background worker pool**

```yaml
services:
  api:
    build: ./api
  worker:
    build: ./worker
    depends_on: [api, redis]
    deploy:
      replicas: 3   # with 'up --scale worker=3' for local dev
  redis:
    image: redis:alpine
```

---

## 15. Best Practices

* **Keep images lean:** Use multi-stage Dockerfiles and small base images.
* **One responsibility per service:** Separate API, worker, db, cache, proxy.
* **Use healthchecks + `depends_on` conditions** to manage readiness.
* **Name your volumes and networks** explicitly for clarity and reuse.
* **Parameterize via env vars**; avoid baking environment-specific values into images.
* **Separate dev vs prod** with override files and profiles.
* **Persist only what’s needed**; bind mounts for code (dev), named volumes for data.
* **Version control your compose files**; treat them as part of your app.

---

## 16. Compose V2 vs. V1 (Quick Note)

* **V2** is the modern implementation integrated into Docker: `docker compose`.
* The old standalone **V1** (`docker-compose`) is deprecated; prefer V2 syntax and features.

---

## 17. Clean-Up & Lifecycle Tips

```bash
# Stop containers but keep them
docker compose stop

# Remove stopped containers (and default network)
docker compose down

# Nuke everything including named volumes
docker compose down -v

# Remove dangling images/volumes (be cautious)
docker image prune
docker volume prune
```

---

## 18. Quick Reference Checklist

* Do I have **separate services** for API, DB, cache, proxy?
* Are **ports** correct and non-conflicting?
* Are **env vars** + `.env` set appropriately?
* Do I use **bind mounts** for code (dev) and **named volumes** for data?
* Do I have **healthchecks** and **depends\_on** conditions?
* Do I need **profiles** (e.g., dev-only services)?
* Do I separate **dev vs prod** with override files?

---

## 19. Further Learning Ideas

* Add **TLS** and hostnames with a reverse proxy (Caddy/Traefik).
* Use **Compose profiles** to toggle optional services.
* Integrate with **CI** to run integration tests against a real stack.
* Explore **secrets/configs** providers and production-grade stores.

---

## 20) TL;DR

**Docker Compose** turns a multi-container app into a **single declarative spec** that you can bring up or tear down with one command. It standardizes local environments, accelerates onboarding, and underpins reliable integration testing—an essential tool in modern container-based workflows.
