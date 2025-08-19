---
title: Building Docker Images
---
# Building Docker Images

> Objective: Learn how Docker turns a **Dockerfile** + **build context** into a reproducible **image**, and how to control tagging, caching, multi-stage builds, and multi-arch outputs for reliable deployments.

---

## 1. Quick Start

```bash
# in the directory containing your Dockerfile and app sources
docker build -t myapp:latest .
```

**Key flags**

* `-t name:tag` — set image name and tag.
* `-f path/to/Dockerfile` — build using a custom Dockerfile path.
* `--no-cache` — ignore cache (forces all layers to rebuild).
* `--pull` — always check for newer base images.
* `--build-arg KEY=VALUE` — pass build-time variables.
* `--target STAGE` — build only a specific stage (multi-stage builds).
* `--progress=plain` — verbose logs (useful in CI).

---

## 2. Core Concepts

### Image, Layers, and Cache

* Each Dockerfile instruction creates a **layer**.
* Build cache reuses layers when **instruction + inputs** (files, args, base image digest) are unchanged.
* Order instructions from **least changing** → **most changing** to maximize cache hits.

### Build Context

* The **build context** is everything sent to the daemon from the directory you pass (`.`).
* Use a **`.dockerignore`** to exclude files (e.g., `.git`, `node_modules`, logs) to **reduce build time and image size**.

`.dockerignore` example:

```bash
.git
node_modules
*.log
dist/
.env
Dockerfile*
```

---

## 3. Dockerfile Anatomy (Minimal → Solid)

```dockerfile
# 1. Base image
FROM node:22-slim

# 2. Metadata (useful for traceability)
LABEL org.opencontainers.image.source="https://github.com/acme/myapp" \
      org.opencontainers.image.version="1.2.3"

# 3. Working directory
WORKDIR /app

# 4. Copy only dependency manifests first for better cache
COPY package*.json ./

# 5. Install deps (cache-friendly)
RUN npm ci --omit=dev

# 6. Copy the rest
COPY . .

# 7. Build (if needed)
RUN npm run build

# 8. Runtime command
CMD ["node", "dist/server.js"]
```

**Notes**

* Split **dependency installation** from **source copy** to leverage cache when code changes but `package.json` doesn’t.
* Prefer `npm ci`/`pip install --no-cache-dir`/`poetry install --no-root` etc. for **deterministic installs**.
* Add **OCI labels** for provenance: `org.opencontainers.image.*`.

---

## 4. Tagging, Naming, and Versioning

* Format: `registry/namespace/name:tag`

  * Examples: `myrepo/web:1.4.0`, `ghcr.io/acme/api:2025-08-18`
* Strategy:

  * Use **immutable** build tags (e.g., commit SHA) for deployments.
  * Optionally add a **floating** tag (e.g., `:latest` or `:main`) for convenience.
* Commands:

  ```bash
  docker tag myapp:build-abc123 myorg/myapp:1.4.0
  docker push myorg/myapp:1.4.0
  ```

---

## 5. Caching Like a Pro

* Default cache: automatic layer reuse.
* `--no-cache` — rebuild everything (use sparingly).
* `--pull` — refresh base image layer if upstream changed.
* Reorder instructions: put **OS package install** and **dependency install** before copying volatile source files.
* For Node/Python/Go:

  * Copy lockfiles first; run install; then copy the rest.

---

## 6. Multi-Stage Builds (smaller, safer images)

Use a **builder stage** to compile, then copy only the artifacts into a **thin runtime** stage.

```dockerfile
# Stage 1: Build
FROM golang:1.22 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o app ./cmd/server

# Stage 2: Runtime
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /src/app /app/app
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/app/app"]
```

**Benefits**

* Smaller attack surface
* Faster pull/deploy
* No compilers or dev tools in runtime

---

## 7. Build Arguments, ENV, and Secrets

### Build Args (build-time only)

```dockerfile
ARG NODE_ENV=production
RUN echo "Building for $NODE_ENV"
```

Pass via CLI:

```bash
docker build --build-arg NODE_ENV=production -t myapp:prod .
```

### ENV (runtime environment)

```dockerfile
ENV TZ=UTC
```

### Secrets (avoid baking credentials into layers)

With BuildKit features:

```dockerfile
# syntax=docker/dockerfile:1.7
FROM alpine:3.20
RUN --mount=type=secret,id=npm_token \
    sh -c 'echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/npm_token)" > ~/.npmrc'
```

Build:

```bash
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,src=.secrets/npm_token \
  -t myapp:secure .
```

### SSH Forwarding (for private git fetch)

```dockerfile
# syntax=docker/dockerfile:1.7
RUN --mount=type=ssh git clone git@github.com:org/private-repo.git
```

```bash
docker build --ssh default -t myapp:with-ssh .
```

---

## 8. Reproducible & Secure Builds

* Pin versions and use **digest** for bases:

  ```dockerfile
  FROM python@sha256:<digest>
  ```

* Use lockfiles (e.g., `package-lock.json`, `poetry.lock`).
* Add non-root user:

  ```dockerfile
  RUN useradd -u 10001 -m appuser
  USER 10001
  ```

* Minimize layers & clean caches (e.g., `apt-get clean && rm -rf /var/lib/apt/lists/*`).
* Validate image:

  ```bash
  docker run --rm myapp:latest --version
  docker inspect myapp:latest
  ```
  
* Regularly rebuild to pick up security updates in base images.

---

## 9. BuildKit & Advanced Outputs

**Enable BuildKit**

```bash
export DOCKER_BUILDKIT=1
```

**Build Multi-Platform with `buildx`**

```bash
docker buildx create --use --name multi
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myorg/myapp:1.4.0 \
  --push .
```

**Selective Stage Build**

```bash
docker build --target builder -t myapp:builder .
```

**Alternate Outputs**

* To local filesystem or tar:

  ```bash
  docker buildx build --output type=local,dest=./out .
  docker buildx build --output type=docker -t myapp:dev .
  ```

---

## 10. Language-Specific Patterns (Examples)

### Node.js

```dockerfile
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]
```

### Python

```dockerfile
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false \
 && poetry install --only main --no-root
COPY . .
CMD ["python", "-m", "myapp"]
```

### Go (distroless final image shown earlier)

* Compile static binary in builder; copy to minimal base.

---

## 11. Testing Images Locally

```bash
# run and hit a health endpoint
docker run --rm -p 8080:8080 myapp:latest
curl -f http://localhost:8080/health
```

Add a **HEALTHCHECK** in Dockerfile (optional but helpful in orchestration):

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
```

---

## 12. Pushing to a Registry

```bash
docker login ghcr.io
docker tag myapp:1.4.0 ghcr.io/acme/myapp:1.4.0
docker push ghcr.io/acme/myapp:1.4.0
```

Tips:

* Use CI to build, tag with both **version** and **commit SHA**, push both.

---

## 13. CI/CD Tips

* Cache across builds:

  * Mount a persistent cache (platform-specific) or use `--cache-from` with a previously pushed image.
* Fail fast on vulnerabilities (optional with scanners).
* Promote images across environments by **tagging**, not rebuilding.

---

## 14. Size Optimization Checklist

* Prefer **slim/alpine/distroless** bases where appropriate.
* Use **multi-stage** to exclude build tools.
* Clean package caches and temp files in the same `RUN` layer.
* Copy only what you need; use `.dockerignore`.
* For Node: `npm ci --omit=dev`; for Python: `--no-cache-dir`; for Go: static binary.

---

## 15. Troubleshooting

* “Why is my build slow?”

  * Large context → tighten `.dockerignore`.
  * Cache misses → reorder layers; split deps from source.
* “Changes not included?”

  * Ensure files are within the **build context**; confirm `COPY` paths.
* “Permissions issues at runtime?”

  * Use `USER` and fix ownership during build (`chown` or `--chown` on `COPY`).
* “Base image updates not picked up?”

  * Add `--pull` during build; rebuild regularly.

---

## 16. Clean Up

```bash
# remove dangling images and cache
docker image prune -f
docker builder prune -f
# broader cleanup (containers, networks not in use)
docker system prune -a
```

---

## 17. Command Reference (Cheat-Sheet)

```bash
# Build
docker build -t myapp:latest .
docker build -f build/Dockerfile -t myapp:dev .

# Args / Targets / Progress
docker build --build-arg NODE_ENV=production -t myapp:prod .
docker build --target builder -t myapp:builder .
docker build --progress=plain -t myapp:debug .

# No cache / Pull latest base
docker build --no-cache --pull -t myapp:nocache .

# Multi-platform with buildx
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t myorg/myapp:multi --push .

# Inspect
docker history myapp:latest
docker inspect myapp:latest

# Push
docker tag myapp:latest myorg/myapp:1.4.0
docker push myorg/myapp:1.4.0
```

---

## 18. Suggested Exercise

1. Write a **multi-stage** Dockerfile for your app.
2. Add `.dockerignore` and optimize layer order.
3. Build locally, run, and verify a health endpoint.
4. Produce a **multi-arch** image with `buildx` and push to a registry.
5. Compare image sizes before/after optimizations (`docker images` and `docker history`).
