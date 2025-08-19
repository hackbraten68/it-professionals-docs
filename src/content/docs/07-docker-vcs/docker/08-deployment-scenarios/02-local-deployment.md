---
title: Local Deployment
---
# Local Deployment with Docker — A Practical, Structured Guide

Local deployment is the fastest way to iterate on software during development, testing, and small‑scale personal use. This guide turns the outline into a complete, classroom‑ready lesson you can drop into a curriculum or internal docs.

---

## 1) What “Local Deployment” Means

**Definition:** Running your containerized application on a single developer machine (laptop or workstation) without relying on external cloud infrastructure.
**Goal:** Shorten the feedback loop, enable quick prototyping, and reproduce production‑like behavior as closely as needed—without the operational overhead.

**When it’s ideal**

* Rapid feature iteration and bug fixing
* Prototyping new services or architectures
* Demos and internal tools for a small team
* Learning/teaching Docker fundamentals

**When to *avoid* it**

* When you need horizontal scaling, HA, or production‑grade networking
* When you depend on managed services only available in the cloud
* When multiple developers must share the same always‑on environment

---

## 2) Prerequisites

* **Docker Engine** or **Docker Desktop** (Windows/macOS).
* Optional: **Docker Compose** (v2 is bundled with recent Docker Desktop/Engine).
* Basic knowledge of **Dockerfiles**, **images**, and **containers**.
* Familiarity with terminal commands and your project’s build tooling.

---

## 3) Quick Start (Single Container)

Your outline’s example:

```bash
docker build -t myapp .
docker run -p 8080:80 myapp
```

**What happens:**

* `docker build -t myapp .` creates a local image tagged `myapp`.
* `docker run -p 8080:80 myapp` starts a container and publishes container port `80` to host port `8080`.
  Access it at [http://localhost:8080](http://localhost:8080).

**Common flags you’ll add quickly**

* `-e KEY=VALUE` — inject environment variables
* `-v ./data:/var/lib/myapp` — persist state via a volume/bind mount
* `--name myapp` — name your container for easier `logs/exec/stop`
* `--rm` — auto‑remove container on stop during rapid iteration

---

## 4) Project Scaffolding & Dockerfile Basics

**Recommended layout (example):**

```bash
.
├── Dockerfile
├── docker-compose.yml        # optional, for multi-service dev
├── .dockerignore
├── .env                      # optional, local config
├── src/
└── tests/
```

**A clean Dockerfile (Node.js example with multi-stage build):**

```dockerfile
# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
EXPOSE 80
CMD ["node", "dist/server.js"]
```

**.dockerignore essentials:**

```bash
node_modules
.git
dist
*.log
.env
```

This keeps builds fast and images small.

---

## 5) Local Deployment with Docker Compose

Compose simplifies multi‑container apps (web + DB + cache, etc.).

**Minimal `docker-compose.yml`:**

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=development
    depends_on:
      - db
    volumes:
      - ./:/app            # hot reload for many stacks
      - /app/node_modules  # avoid overriding node_modules if needed
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

**Commands you’ll use constantly**

```bash
docker compose up -d         # start in background
docker compose logs -f web   # tail logs for 'web' service
docker compose exec web sh   # open a shell inside the 'web' container
docker compose down          # stop and remove containers/network
```

**.env for Compose**
Compose auto‑loads `.env` (same directory as `docker-compose.yml`):

```bash
NODE_ENV=development
APP_PORT=8080
DB_PASSWORD=secret
```

Then reference with `${VAR}` in the YAML:

```yaml
ports:
  - "${APP_PORT}:80"
```

---

## 6) Developer Experience: Fast Feedback

**Bind mounts for hot reload**

* Map source code into the container so your process reloads on save.
* Use nodemon, webpack dev server, or framework‑native dev modes.

**Makefile helpers (optional but powerful)**

```makefile
.PHONY: build up down logs sh test
build:
	docker compose build
up:
	docker compose up -d
down:
	docker compose down
logs:
	docker compose logs -f
sh:
	docker compose exec web sh
test:
	docker compose run --rm web npm test
```

**Profiles for optional services (Compose v2):**

```yaml
services:
  web:
    build: .
  mailhog:
    image: mailhog/mailhog
    profiles: ["devtools"]
```

Run with `docker compose --profile devtools up -d`.

---

## 7) Networking, Ports, and Service Discovery

* Containers in the same Compose project share a **user‑defined bridge network** with DNS‑based service discovery (use service names like `db` instead of IPs).
* `ports:` publishes container ports to the host for local access.
* **Host‑to‑container**: visit `http://localhost:<published-port>`.
* **Container‑to‑host**:

  * macOS/Windows: use `host.docker.internal`.
  * Linux: add `--add-host=host.docker.internal:host-gateway` to your service or use the gateway IP (often `172.17.0.1`).

---

## 8) Data & State: Volumes vs Bind Mounts

* **Bind mounts (`-v ./dir:/path`)** map host folders into the container—great for *source code* and local dev artifacts.
* **Named volumes** (managed by Docker) are best for *databases* and persistent state because they’re isolated from your working tree.

**Example:**

```yaml
volumes:
  dbdata:

services:
  db:
    image: postgres:16-alpine
    volumes:
      - dbdata:/var/lib/postgresql/data
```

---

## 9) Configuration & Secrets (in Dev)

* Prefer environment variables (`-e`, `.env`, Compose `environment`).
* Avoid committing secrets to Git or baking them into images.
* For dev, a `.env.local` in `.gitignore` is common.
  In production, migrate to a real secrets manager; for local dev, keep secrets minimal and disposable.

---

## 10) Observability: Logs, Health, and Metrics (Locally)

* **Logs:** `docker logs -f <container>` or `docker compose logs -f`.
* **Healthchecks** catch boot loops early:

  ```yaml
  services:
    web:
      build: .
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost/health"]  # adjust to your app
        interval: 10s
        timeout: 2s
        retries: 5
  ```

* **Metrics/Profiling:** Add dev‑only exporters (e.g., Prometheus endpoints) or lightweight APM in dev mode if needed.

---

## 11) Debugging Locally

* `docker exec -it <container> sh` — inspect runtime environment.

* If your base image lacks tools, run a **debug sidecar**:

  ```bash
  docker run --rm -it --network container:<target_container> nicolaka/netshoot
  ```

  This gives you `dig`, `curl`, `tcpdump`, etc., sharing the target’s network namespace.

* **Common issues & quick checks**

  * Port already in use → change host port or stop conflicting process.
  * Container exits immediately → check `docker logs` for startup errors.
  * Can’t reach service by name → confirm both services share the same user‑defined network (Compose handles this).

---

## 12) Performance Tips on a Laptop

* **Leverage BuildKit** for faster builds:

  ```bash
  DOCKER_BUILDKIT=1 docker build -t myapp .
  ```

* Use **multi‑stage builds** and a slim runtime base (alpine, distroless).
* Avoid large bind mounts on slow filesystems (e.g., network drives).
* On macOS/Windows (desktop hypervisors), bind mounts can be slower; cache dependencies inside the image where possible.

---

## 13) Cross‑Platform Notes (Apple Silicon, Windows, Linux)

* **Apple Silicon (arm64):**

  * Choose images that publish multi‑arch manifests (`linux/amd64`, `linux/arm64`).
  * If a dependency is x86‑only, run with `--platform=linux/amd64` (slower emulation).
* **Windows:**

  * Prefer WSL 2 backend with Docker Desktop for Linux containers.
  * Use LF line endings for scripts inside Linux containers.
* **Linux:**

  * Full parity with production Linux runtime; `host.docker.internal` requires the extra host‑gateway mapping noted above.

---

## 14) Example: Full Local Stack (Web + API + DB)

```yaml
version: "3.9"
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"        # e.g., Vite dev server
    environment:
      - API_URL=http://localhost:8080
    volumes:
      - ./frontend:/app
    depends_on:
      - api

  api:
    build: ./api
    ports:
      - "8080:80"
    environment:
      - DB_HOST=db
      - DB_USER=appuser
      - DB_PASS=secret
      - DB_NAME=appdb
    volumes:
      - ./api:/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=secret
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

**Run it:**

```bash
docker compose up --build
```

Then visit your frontend at `http://localhost:5173`, which calls the API at `http://localhost:8080`.

---

## 15) Testing Locally

* **Unit tests inside a container:**

  ```bash
  docker run --rm myapp npm test
  ```

* **Compose for integration tests:**

  ```bash
  docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from tests
  ```

* Seed test data with an init container or startup script mounted into the DB.

---

## 16) Security Considerations (Even in Dev)

* Don’t run containers as root unless necessary; use `USER` in your Dockerfile.
* Keep images updated; rebuild frequently to pick up patches.
* Avoid mounting the Docker socket (`/var/run/docker.sock`) in dev containers.
* Limit published ports; prefer internal networks where possible.

---

## 17) Local Image Registry (Optional, Advanced)

For teams with intermittent internet or to speed up pulls:

* Run a local registry:

  ```bash
  docker run -d -p 5000:5000 --name registry registry:2
  ```

* Tag and push locally:

  ```bash
  docker tag myapp localhost:5000/myapp:dev
  docker push localhost:5000/myapp:dev
  ```

---

## 18) Common Pitfalls & How to Avoid Them

* **“Works on my machine” drift:** pin image versions, commit your Compose file, and document env vars.
* **Bloated images:** use multi‑stage builds, `.dockerignore`, and slim base images.
* **Flaky “hot reload”:** be explicit about watched paths and mount only what you need.
* **Hidden state:** clear volumes when necessary: `docker compose down -v` (careful—this deletes data).

---

## 19) Checklists

**First‑time local bring‑up**

* [ ] Docker Engine/Desktop installed
* [ ] `Dockerfile`, `.dockerignore` present
* [ ] `docker build` succeeds locally
* [ ] Healthcheck or simple `/health` endpoint available
* [ ] Ports mapped and documented in README

**Daily dev loop**

* [ ] `docker compose up -d`
* [ ] Tail logs (`logs -f`) while coding
* [ ] Hot reload confirmed
* [ ] Run tests in container (`compose run --rm web npm test`)
* [ ] Stop/clean (`compose down`) when switching projects

---

## 20) Summary

Local deployment gives you:

* A **fast feedback loop** for developers
* **Simple commands** (`docker run`, `docker compose up`) to spin up services
* Ideal conditions for **testing and prototyping** before promoting to shared or cloud environments

Use it to iterate quickly, keep parity where it matters, and document your local setup so new contributors can be productive in minutes.
