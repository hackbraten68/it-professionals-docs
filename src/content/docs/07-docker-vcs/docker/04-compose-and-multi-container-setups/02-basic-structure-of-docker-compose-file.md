---
title: Basic Structure of a docker-compose.yml File
---
# Basic Structure of a `docker-compose.yml` File

---

## 1) Purpose & Big Picture

Docker Compose lets you **define, run, and manage multi-container apps** using a single YAML file. The file declares your **services** (containers), how they connect via **networks**, where they store data via **volumes**, and how they’re configured (env vars, ports, healthchecks, etc.).

---

## 2) Minimal Example (Annotated)

```yaml
# docker-compose.yml
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"              # host:container
  app:
    build: ./app             # build image from Dockerfile in ./app
    depends_on:
      - db                   # start order hint
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
```

**Key ideas**

* `services`: each item is a container definition (`web`, `app`, `db`).
* `image` or `build`: use a prebuilt image or build your own.
* `ports`, `environment`, etc.: per-service config.
* `depends_on`: orchestrates **start order** (not health; see §8.2).

---

## 3) File Layout & Top-Level Keys

A typical Compose file includes some or all of:

```yaml
services:   # REQUIRED: Your containers
volumes:    # OPTIONAL: Named volumes usable by services
networks:   # OPTIONAL: Custom networks
secrets:    # OPTIONAL: Runtime secrets (Compose/Swarm aware)
configs:    # OPTIONAL: Runtime configs (Swarm/Compose)
```

> The `version:` key is **no longer required** with the modern Compose Specification; Compose infers the spec. You’ll still see older files with `version: "3.x"`—they work, but aren’t necessary for new projects.

---

## 4) Core Building Blocks

### 4.1 Services

Common service options (selected highlights):

```yaml
services:
  api:
    image: myorg/api:1.2.3
    container_name: api               # optional, otherwise auto-generated
    restart: unless-stopped           # restart policy (non-Swarm)
    environment:
      - NODE_ENV=production
      - PORT=8080
    env_file:
      - .env                          # load env vars for interpolation and runtime
    command: ["node", "server.js"]    # override default CMD
    entrypoint: ["docker-entrypoint.sh"]
    working_dir: /usr/src/app
    ports:
      - "8080:8080"
    expose:
      - "8081"                        # expose to other services (not host)
    volumes:
      - appdata:/var/lib/app          # named volume
      - ./api:/usr/src/app:ro         # bind mount
    networks:
      - backend
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 2s
      retries: 5
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
    deploy:                            # only fully honored in Swarm mode
      replicas: 2
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
```

> **Tip:** `deploy.*` is primarily for **Docker Swarm**. With the local `docker compose` (non-Swarm), many `deploy` options are ignored. For local resource limits, use `cpus`, `mem_limit` under `deploy.resources` in Swarm or `--cpus/-m` flags in plain `docker run`.

### 4.2 Volumes

```yaml
volumes:
  appdata:          # named volume, stored by Docker
  pgdata:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /data/postgres  # bind host path as a "local driver" volume
```

Attach in a service:

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### 4.3 Networks

```yaml
networks:
  backend:
    driver: bridge   # default for local Compose
  public:
    driver: bridge
```

Attach in a service:

```yaml
services:
  web:
    image: nginx
    networks: [public]
  api:
    image: myorg/api
    networks: [backend, public]
```

### 4.4 Secrets & Configs (optional)

* **Secrets**: Sensitive data (passwords, keys).
* **Configs**: Non-secret configuration blobs.

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

configs:
  nginx_conf:
    file: ./nginx/nginx.conf
```

Use in services:

```yaml
services:
  db:
    image: postgres
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

  web:
    image: nginx
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf
```

> **Note:** Secret mounting paths vary by implementation; Compose typically mounts to `/run/secrets/<name>`.

---

## 5) Environment Variables & Interpolation

Compose supports **variable interpolation** from the shell and `.env` files:

`.env`

```bash
POSTGRES_PASSWORD=supersecret
API_TAG=1.2.3
```

`docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  api:
    image: myorg/api:${API_TAG:-latest}   # default to "latest" if unset
```

**Commands**

* Use a specific env file at runtime:
  `docker compose --env-file .env.prod up -d`

---

## 6) Profiles (conditional services)

Enable groups of services per scenario (dev/test/ci):

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    profiles: ["dev"]

  e2e:
    build: ./e2e
    profiles: ["test"]
```

Run with a profile:

```bash
docker compose --profile dev up -d
```

---

## 7) Reuse, Overrides, and DRY Techniques

### 7.1 Multiple Files & Overrides

Compose merges files in order (later wins):

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

Typical pattern:

* `docker-compose.yml` — base
* `docker-compose.override.yml` — dev-only tweaks (bind mounts, extra ports)
* `docker-compose.prod.yml` — prod settings (images, replicas, secrets)

### 7.2 Anchors, Aliases, and Extensions

Use YAML anchors (`&`), aliases (`*`), and extension fields (`x-*`) to avoid repetition:

```yaml
x-common-env: &common_env
  NODE_ENV: production
  TZ: UTC

x-health: &http_health
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 10s
  timeout: 2s
  retries: 5

services:
  api:
    image: myorg/api:1.2.3
    environment:
      <<: *common_env
      API_CACHE: "true"
    healthcheck: *http_health

  worker:
    image: myorg/worker:1.2.3
    environment:
      <<: *common_env
      QUEUE: "critical"
```

---

## 8) Service Coordination & Health

### 8.1 Healthchecks

Healthchecks let Compose (and other services) know when a container is “ready”:

```yaml
services:
  db:
    image: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 5s
```

### 8.2 `depends_on` Nuances

* Basic `depends_on` controls **start order** only.
* For readiness, combine `healthcheck` in the dependency and implement **retry logic** in the dependent service, or (in modern Compose implementations) use conditional depends\_on:

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy    # Supported in recent Compose versions
```

If conditional `depends_on` isn’t available in your environment, rely on app-level retries or wait-for scripts.

---

## 9) Port Publishing & Networking

* `ports: ["8000:80"]` publishes container port 80 to host port 8000.
* `expose: ["80"]` makes port 80 available **to other services on the same network only** (not the host).
* Service DNS: services can reach each other by **service name** (e.g., `http://db:5432`).

---

## 10) Build Options (when `build:` is used)

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile.prod
      target: runner               # for multi-stage Dockerfiles
      args:
        APP_VERSION: "1.2.3"       # build-time args
    image: myorg/app:1.2.3         # optionally tag the result
```

---

## 11) Data Persistence Patterns

* **Named volumes** (recommended) for database and app data:

  ```yaml
  services:
    db:
      volumes:
        - dbdata:/var/lib/postgresql/data
  volumes:
    dbdata:
  ```
  
* **Bind mounts** for **live code reload** in dev:

  ```yaml
  services:
    app:
      volumes:
        - ./src:/usr/src/app
  ```

---

## 12) Logging & Observability

```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

* Use `docker compose logs -f api` to stream logs.
* Consider external drivers (e.g., `fluentd`, `syslog`) for centralization.

---

## 13) Common Commands (Compose V2+)

```bash
# Start in foreground (Ctrl+C to stop)
docker compose up

# Start detached
docker compose up -d

# Rebuild changed images
docker compose up -d --build

# Stop and remove containers (keep volumes)
docker compose down

# Stop and remove containers + volumes + orphans
docker compose down -v --remove-orphans

# Status, logs, and shell
docker compose ps
docker compose logs -f api
docker compose exec api sh

# Validate and view merged config
docker compose config
```

---

## 14) Typical Multi-Service Template (Comprehensive)

```yaml
services:
  reverse-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      api:
        condition: service_started
      web:
        condition: service_started
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
    networks: [public, backend]

  web:
    build:
      context: ./web
    environment:
      - VITE_API_URL=http://api:8080
    depends_on:
      - api
    networks: [public, backend]

  api:
    image: myorg/api:1.2.3
    environment:
      - DATABASE_URL=postgres://postgres:${POSTGRES_PASSWORD}@db:5432/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 2s
      retries: 5
    networks: [backend]

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-example}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 10s
      timeout: 3s
      retries: 10
    networks: [backend]

volumes:
  pgdata:

networks:
  public:
  backend:
```

---

## 15) Dev vs. Prod Patterns

* **Dev**:

  * Bind mounts for live reload (`./app:/usr/src/app`).
  * Extra tools (mailhog, adminer) under a `dev` profile.
  * `.env` tailored to local credentials.
* **Prod**:

  * Prefer **immutable images** (`image: myorg/app:sha-…`).
  * Secrets loaded from external secret stores or Swarm/K8s.
  * Strict resource controls (in Swarm via `deploy.resources`).
  * Read-only root FS where possible, minimal ports exposed.

---

## 16) Pitfalls & Best Practices

* **Don’t commit real secrets** to Git; use `secrets:` or external secret stores.
* Prefer **named volumes** over bind mounts for databases.
* Keep services **small and single-purpose**.
* Define **healthchecks** for critical dependencies.
* Use **profiles** and **override files** to separate environments cleanly.
* Validate with `docker compose config` before running.
* Use YAML anchors / extension fields to **DRY** repeated config.

---

## 17) Quick Reference: Most-Used Service Keys

* **Image/Build**: `image`, `build.context`, `build.dockerfile`, `build.args`, `build.target`
* **Runtime**: `command`, `entrypoint`, `environment`, `env_file`, `working_dir`, `user`
* **Networking**: `ports`, `expose`, `networks`, `extra_hosts`
* **Storage**: `volumes`, `tmpfs`
* **Health & Lifecycle**: `healthcheck`, `restart`, `depends_on`
* **Logging**: `logging.driver`, `logging.options`
* **Security**: `secrets`, `read_only`, `cap_add`, `cap_drop`

---

## 18) Practice Tasks

1. Convert a single-container app to Compose with separate `web`, `api`, and `db` services.
2. Add a **healthcheck** to each service and use `depends_on` conditions where supported.
3. Split base and environment-specific settings into `docker-compose.yml` + `docker-compose.dev.yml`.
4. Introduce a **profile** for optional services (e.g., a local SMTP sink).
5. Validate with `docker compose config` and run with `--profile`.

---

**You now have a robust, production-aware understanding of `docker-compose.yml` structure—ready to build, iterate, and teach.**
