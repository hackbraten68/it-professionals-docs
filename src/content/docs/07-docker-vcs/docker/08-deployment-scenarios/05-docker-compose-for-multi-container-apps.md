---
title: Docker Compose for Multi-Container Apps
---
# Docker Compose for Multi‑Container Apps

Docker Compose streamlines the definition, wiring, and lifecycle management of applications that consist of multiple services (e.g., frontend, backend, databases, queues). By declaring everything in a single YAML file, teams get reproducible environments for development and production alike.

---

## What You’ll Learn

* Core Compose concepts: services, networks, volumes, and the Compose file.
* Day‑to‑day commands for building, running, scaling, debugging.
* Patterns for dev vs. prod, configuration, secrets, health checks, and dependencies.
* Practical examples you can adapt immediately.

---

## Why Use Docker Compose?

* **Single source of truth:** Define your app topology in one `docker-compose.yml`.
* **Consistent environments:** Same file works across machines and CI servers.
* **Simple orchestration:** Start/stop/scale multiple services with one command.
* **Built‑in networking:** Automatic service discovery by service name.
* **Composable configs:** Override, extend, and specialize with multiple files and profiles.

> Note on CLI: Modern Docker uses `docker compose` (space) for Compose V2; older installations use `docker-compose` (hyphen). Both are shown here—use whichever your system supports.

---

## Minimal Example

```yaml
# docker-compose.yml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis
  redis:
    image: redis:7-alpine
```

Start it:

```bash
docker compose up -d
# or: docker-compose up -d
```

---

## Compose Building Blocks

### Services

* A **service** describes how to run a container of your app.
* Key fields:

  * `image`, `build`, `command`, `environment`, `env_file`
  * `ports`, `volumes`, `networks`
  * `depends_on`, `healthcheck`, `restart`, `profiles`

### Networks

* Created automatically unless specified. Services can talk to each other via DNS names equal to their service name (`web` → `http://redis:6379`).
* Custom networks let you isolate groups of services.

```yaml
networks:
  backend:
  frontend:
services:
  api:
    image: ghcr.io/example/api:latest
    networks: [backend]
  db:
    image: postgres:16
    networks: [backend]
  ui:
    build: ./ui
    networks: [frontend]
```

### Volumes

* Persist data beyond the lifecycle of a container or share code in dev.

```yaml
volumes:
  pgdata: {}
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### Environment & Configuration

* Inline or via `.env` files. Compose supports variable substitution.

```yaml
services:
  api:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:${DB_PASSWORD}@db:5432/app
    env_file:
      - .env
```

`.env` example:

```
DB_PASSWORD=supersecret
```

---

## A Realistic Multi‑Service Stack

```yaml
version: "3.9"

x-common-env: &common_env
  TZ: "UTC"
  APP_LOG_LEVEL: "info"

services:
  reverse-proxy:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
    volumes:
      - ./ops/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
      - ui
    restart: unless-stopped

  ui:
    build:
      context: ./ui
      dockerfile: Dockerfile
    environment:
      <<: *common_env
      VITE_API_BASE: "http://reverse-proxy"
    volumes:
      - ./ui:/app # dev-only hot reload; remove in prod
    restart: unless-stopped

  api:
    build:
      context: ./api
    environment:
      <<: *common_env
      DATABASE_URL: postgres://app:app@db:5432/app
      REDIS_URL: redis://cache:6379/0
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 5
    ports:
      - "3000:3000" # optional: expose directly for debugging
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
    restart: unless-stopped

  cache:
    image: redis:7-alpine
    command: ["redis-server", "--save", "", "--appendonly", "no"]
    restart: unless-stopped

volumes:
  dbdata: {}
```

Highlights:

* `x-common-env` shows **extension fields** for DRY configs.
* `depends_on` with `condition` ensures API starts after DB is healthy.
* A reverse‑proxy (Nginx) routes requests to UI/API.

---

## Dev vs. Prod Patterns

### Split Files

* Base file for shared config: `docker-compose.yml`
* Development overrides: `docker-compose.override.yml` (auto‑picked up)
* Production overrides: `docker-compose.prod.yml`

```bash
# Dev
docker compose up -d

# Prod
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Example `docker-compose.prod.yml`:**

```yaml
services:
  ui:
    volumes: []        # disable bind mounts
  api:
    environment:
      APP_LOG_LEVEL: "warn"
  reverse-proxy:
    ports:
      - "80:80"
      - "443:443"
```

### Profiles

Enable optional services (e.g., test tools) only when needed.

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    profiles: ["dev"]
```

```bash
docker compose --profile dev up -d
```

---

## Scaling and Replicas

Compose can run multiple instances of a stateless service:

```bash
docker compose up -d --scale api=3
```

Notes:

* Built for single‑host scenarios. For multi‑host and advanced scheduling, consider Kubernetes or Swarm.
* Ensure your reverse proxy can load balance across replicas (e.g., by upstreams in Nginx).

---

## Health Checks & Dependencies

* Use `healthcheck` to gate readiness.
* `depends_on` controls startup order; with conditions in Compose v3, you can wait for `service_healthy`.

Common checks:

* HTTP `/health` endpoint for web apps.
* `pg_isready` for Postgres, `redis-cli ping` for Redis.

---

## Configuration & Secrets

### Do not bake secrets into images

Use environment variables, mounted files, or a secret manager.

* **Local/dev:** environment variables or files mounted at runtime.
* **Swarm:** `secrets:` integrates with Swarm’s secret store.
* **External solutions:** Vault, AWS Secrets Manager, SOPS (mounted files).

Example (file‑based secret in dev):

```yaml
services:
  api:
    environment:
      JWT_PRIVATE_KEY_PATH: /run/secrets/jwt_key
    volumes:
      - ./secrets/jwt_key:/run/secrets/jwt_key:ro
```

---

## Logging, Monitoring, and Metrics

* Stream logs: `docker compose logs -f api`
* Restart policies: `restart: unless-stopped` for resilience.
* Log drivers (e.g., `json-file`, `local`, `syslog`) configurable per service.
* Sidecar observability:

  * Prometheus exporters (e.g., `node-exporter`)
  * Loki/Fluent Bit for central logs
  * cAdvisor for container metrics (dev/test)

---

## Image Build Options

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    target: runtime # use a multi-stage build target
```

Tips:

* Use **multi‑stage builds** to keep runtime images lean.
* Pin base image tags (e.g., `node:22-alpine`) and digest where appropriate.

---

## Networking: Ports vs. Internal Connectivity

* `ports` publishes a container port on the host; use it sparingly in prod (often only on the reverse proxy).
* For inter‑service calls, use service names and internal ports (no host binding needed).

---

## Bind Mounts vs. Named Volumes

* **Bind mounts:** map host directories → containers; great for live‑reload in dev.
* **Named volumes:** managed by Docker; ideal for persistent data in prod.

---

## Common Commands (Cheat Sheet)

```bash
# Start / stop / status
docker compose up -d
docker compose stop
docker compose ps

# Rebuild images when Dockerfile or deps change
docker compose build --no-cache
docker compose up -d --build

# Logs and debugging
docker compose logs -f api
docker compose exec api sh
docker compose run --rm api <one-off-cmd>

# Scaling
docker compose up -d --scale api=3

# Clean up
docker compose down            # stop and remove containers
docker compose down -v         # also remove named volumes
docker system prune -f         # remove dangling images/containers/networks
```

---

## Troubleshooting

* **Container won’t start**

  * Check logs: `docker compose logs <svc>`
  * Validate env vars and connection strings.
  * Verify `depends_on` and `healthcheck` behavior.
* **Port conflicts**

  * Ensure host ports aren’t already in use (`lsof -i :PORT`).
  * Avoid exposing multiple services to the same host port.
* **Cannot reach other services**

  * Confirm the service name (DNS) and internal port.
  * `docker compose exec <svc> sh` and `curl http://other-svc:PORT`.
* **Permissions on volumes**

  * Check user IDs inside containers vs. host filesystem ownership.
  * Consider `user:` directive or `chown` at container start.

---

## Security Considerations

* Do not mount the Docker socket into containers.
* Run as non‑root where possible (`user:`).
* Keep images minimal and updated; scan for CVEs (e.g., Trivy).
* Restrict published ports; place services behind a reverse proxy with TLS.
* Limit container capabilities if needed (`cap_drop`, `security_opt`).

---

## Example: Dev Convenience with Makefile

```makefile
up:
\tdocker compose up -d
down:
\tdocker compose down
logs:
\tdocker compose logs -f --tail=200
rebuild:
\tdocker compose up -d --build
```

---

## Putting It All Together

1. Model your app as services with clear boundaries.
2. Encode settings via environment and files—keep secrets out of images.
3. Use health checks and `depends_on` to stabilize startup.
4. Separate dev and prod concerns with overrides or profiles.
5. Observe, log, and iterate: Compose makes changes cheap and repeatable.

With these patterns and examples, you can confidently design, run, and evolve multi‑container applications using Docker Compose in both development and production contexts.
