---
title: Core Dockerfile Instructions
---

> A practical, example-driven guide to the most important Dockerfile directives—what they do, how they affect layers and cache, common pitfalls, and best-practice usage.

---

## Quick Primer: How Dockerfile Instructions Build Layers

* Every instruction (except a few metadata-only ones) creates a **new image layer**.
* The **build cache** reuses layers when the instruction and its inputs are unchanged.
* Order your instructions from **least to most volatile** (e.g., base → deps → app code) to maximize cache hits.

---

## 1) `FROM` — Set the Base Image

**Purpose:** Defines the starting filesystem and (optionally) platform and stage name.

**Syntax:**

```dockerfile
FROM <image>[:<tag>] [AS <stage>]
# With platform (BuildKit):
FROM --platform=$BUILDPLATFORM <image> AS builder
```

**Examples:**

```dockerfile
FROM node:20-alpine AS build
FROM nginx:1.27-alpine
```

**Notes & Pitfalls**

* A Dockerfile **must start with** `FROM` (except when using multi-stage with an implicit `FROM` via `ARG` in some edge cases).
* Prefer **pinned tags** (e.g., `node:20.11-alpine`) or digests for reproducibility.
* Use **multi-stage builds** to keep runtime images minimal.

**Best Practices**

* Start from **official, slim, or distro-less** images where possible.
* Document your choice in comments (security, size, or compatibility reasons).

---

## 2) `LABEL` — Add Metadata

**Purpose:** Attach key/value metadata (maintainer, source, version, licenses, etc.).

**Syntax:**

```dockerfile
LABEL <key>=<value> <key2>=<value2>
```

**Example:**

```dockerfile
LABEL org.opencontainers.image.title="Acme API" \
      org.opencontainers.image.source="https://github.com/acme/api" \
      org.opencontainers.image.version="1.3.2"
```

**Notes**

* Follows the **OCI image annotation** keys nicely.
* Multiple `LABEL`s combine into a single metadata layer (but still a new layer per instruction).

**Best Practices**

* Include `source`, `revision` (git SHA), and `licenses` where applicable.
* Prefer **one `LABEL` block** to reduce layer count.

---

## 3) `RUN` — Execute Build-Time Commands

**Purpose:** Run commands *during build* (e.g., install packages, compile assets).

**Forms:**

* **Shell form:** `RUN apt-get update && apt-get install -y curl`
* **Exec (JSON) form:** `RUN ["bash", "-lc", "bundle install"]`

**Examples:**

```dockerfile
RUN apk add --no-cache curl
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
```

**Notes & Pitfalls**

* Each `RUN` creates a new layer—**combine related steps** to reduce layers.
* Always **clean up** package caches in the same layer to keep images small.
* With BuildKit, use `--mount=type=cache` to keep deps fast yet out of final image.

**Best Practices**

* Use **non-interactive** installs (`DEBIAN_FRONTEND=noninteractive`).
* Prefer **repeatable commands** (pin versions, checksums).
* Use **`set -euxo pipefail`** in shell to fail early (or exec form).

---

## 4) `COPY` vs. `ADD` — Bring Files into the Image

**Purpose:** Transfer files from build context (the directory you `docker build` from) into the image.

**COPY Syntax:**

```dockerfile
COPY [--chown=<user>:<group>] <src>... <dest>
```

**ADD Extra Powers (Use with Care):**

* Can fetch **remote URLs**
* **Auto-extracts** local tar archives

**Examples:**

```dockerfile
# Typical app copy:
COPY package.json package-lock.json ./
COPY src/ ./src/

# With ownership (Linux only):
COPY --chown=node:node . /app
```

**Notes & Pitfalls**

* **Prefer `COPY`** for local files—it's simpler and more predictable.
* Avoid `ADD` for remote URLs; use `curl`/`wget` in a `RUN` so you can verify checksums.
* `.dockerignore` is crucial to **exclude large/secret files** from the build context.

**Best Practices**

* Copy **manifest files** (e.g., `package.json`, `requirements.txt`) **before** app code to cache dependency installs.
* Keep the build context **small**; use `.dockerignore`.

---

## 5) `WORKDIR` — Set the Working Directory

**Purpose:** Changes the current directory for subsequent instructions.

**Syntax:**

```dockerfile
WORKDIR /app
```

**Notes**

* Creates the directory **if it doesn’t exist**.
* Avoid chaining `cd` in `RUN`; use `WORKDIR` instead for clarity and caching.

**Best Practices**

* Set `WORKDIR` once near the top and reuse.

---

## 6) `ENV` — Define Environment Variables

**Purpose:** Set environment variables available at **build** and **runtime** (depending on usage).

**Syntax:**

```dockerfile
ENV KEY=value
ENV PATH="/opt/bin:${PATH}" PORT=8080
```

**Notes & Pitfalls**

* Each `ENV` persists in the image and can be seen with `docker inspect`.
* Don’t store **secrets** with `ENV`; use runtime mechanisms (Docker secrets, orchestrator vars).

**Best Practices**

* Use `ENV` for **defaults** (e.g., `NODE_ENV=production`) that are safe to expose.
* For build-only variables, prefer `ARG` (not covered here, but often paired with `ENV`).

---

## 7) `EXPOSE` — Document Container Ports

**Purpose:** Declare which ports the container intends to listen on.

**Syntax:**

```dockerfile
EXPOSE 8080
EXPOSE 80/tcp 8443/udp
```

**Notes**

* **Does not publish** the port—use `docker run -p 8080:8080` or compose/Swarm/K8s to publish.
* Purely **documentation/metadata**, but used by some tooling.

**Best Practices**

* Keep it accurate and minimal; match your runtime service.

---

## 8) `CMD` vs. `ENTRYPOINT` — Define the Container’s Process

**Purpose:** Configure the default command/executable when the container starts.

### `CMD`

* **Default arguments or command**; **overridden** by args to `docker run …`.
* **Forms:**

  * Exec: `CMD ["node", "server.js"]`  ← recommended
  * Shell: `CMD node server.js`

### `ENTRYPOINT`

* **Fixed executable**; `CMD` (or `docker run` args) become **arguments** to it.
* **Forms:**

  * Exec: `ENTRYPOINT ["python", "app.py"]`  ← recommended
  * Shell: `ENTRYPOINT python app.py`

**Common Patterns**

```dockerfile
# Entrypoint + default args (override-able):
ENTRYPOINT ["nginx", "-g"]
CMD ["daemon off;"]

# Single command (just CMD):
CMD ["node", "server.js"]
```

**Notes & Pitfalls**

* Prefer **exec form** to avoid shell-processing surprises and to forward signals correctly (PID 1).
* If you need a shell for variable expansion, handle signals (e.g., use `tini` or `dumb-init`).

**Best Practices**

* Use `ENTRYPOINT` for a **fixed binary**, `CMD` for **default flags**.
* Provide helpful `--help` as default `CMD` in builder stages or tool images.

---

## 9) `USER` — Drop Privileges

**Purpose:** Set the **user/group** for subsequent `RUN`, `CMD`, and `ENTRYPOINT`.

**Syntax:**

```dockerfile
USER <user>[:<group>]
USER 1000:1000
```

**Example:**

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

**Notes & Pitfalls**

* Running as **root** by default is a security risk. Switch to a non-root user.
* Ensure directories your app writes to are **writable** by that user.

**Best Practices**

* Create a dedicated user with the **least privileges**.

---

## 10) `VOLUME` — Declare Mount Points

**Purpose:** Mark directories intended for **external storage** (bind mounts or named volumes).

**Syntax:**

```dockerfile
VOLUME ["/data"]
VOLUME /var/lib/postgresql/data
```

**Notes & Pitfalls**

* Declaring a `VOLUME` makes the path **managed outside** the image; subsequent `RUN` steps won’t persist data there.
* Don’t use `VOLUME` for app code; use it for **mutable data**.

**Best Practices**

* Let deploy tooling (Compose/K8s) **define volumes**. Use `VOLUME` when the intent is strong and generic (databases, caches).

---

## 11) `HEALTHCHECK` — Report Container Health

**Purpose:** Tell Docker how to determine if the container is **healthy**.

**Syntax:**

```dockerfile
HEALTHCHECK [options] CMD <command>
# Options:
# --interval=<duration> (default: 30s)
# --timeout=<duration>  (default: 30s)
# --start-period=<dur>  (default: 0s)
# --retries=<n>         (default: 3)
```

**Examples:**

```dockerfile
# Simple HTTP probe
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

# Disable healthcheck (for base images you extend)
HEALTHCHECK NONE
```

**Notes & Pitfalls**

* Health checks run in the **container’s namespace**; ensure tools like `curl`/`wget` are installed.
* Excessively frequent checks can cause **noise** or mask startup delays—use `--start-period`.

**Best Practices**

* Probe a **cheap, deterministic** endpoint.
* Keep checks **fast** and **battery-friendly** in orchestrated environments.

---

## Putting It All Together — A Minimal, Production-minded Example

```dockerfile
# 1) Build stage
FROM node:20-alpine AS build
WORKDIR /app
# Copy only manifests first for better cache on deps
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Runtime stage (small, non-root)
FROM node:20-alpine
LABEL org.opencontainers.image.source="https://github.com/acme/webapp"
ENV NODE_ENV=production PORT=8080
WORKDIR /app
# Create non-root user/group
RUN addgroup -S app && adduser -S app -G app
# Copy built artifacts and production deps
COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node dist/healthcheck.js || exit 1
CMD ["node", "dist/server.js"]
```

**Why this works well**

* **Multi-stage** keeps runtime lean.
* Dependency steps are **cache-friendly**.
* App runs as **non-root**.
* **Healthcheck** verifies liveness.
* **Exec forms** for proper signal handling.

---

## Common Anti-Patterns to Avoid

* `ADD` to fetch remote files (use `RUN curl -fsSLo ... && sha256sum -c`).
* Using shell forms (`CMD node app.js`) when you need signal handling—prefer exec forms.
* Storing **secrets** with `ENV` or `COPY` into the image.
* `RUN apt-get update` **without** `apt-get install` in the **same layer**.
* Running everything as **root**.
* Massive build contexts (missing `.dockerignore`).

---

## Related (Nice-to-Know) Instructions

* `ARG` — build-time variables (often paired with `ENV`).
* `ONBUILD` — triggers in child builds (use sparingly).
* `SHELL` — change default shell (Windows/Linux nuances).
* `STOPSIGNAL` — customize stop signal for PID 1.

---

## Cheat Sheet

* **Base:** `FROM <image>:<tag> [AS name]`
* **Meta:** `LABEL key="value"`
* **Build:** `RUN <cmd>`
* **Files:** `COPY src dest` (prefer over `ADD`)
* **Dir:** `WORKDIR /path`
* **Env:** `ENV KEY=value`
* **Ports:** `EXPOSE 8080`
* **Entrypoint:** `ENTRYPOINT ["bin"]`
* **Default args:** `CMD ["--flag"]`
* **User:** `USER app`
* **Data:** `VOLUME /data`
* **Health:** `HEALTHCHECK --interval=30s CMD <cmd>`

---

## Final Tips

* **Pin versions**, validate downloads, and keep images **small**.
* Design for **immutability**: config via env vars, not by mutating images at runtime.
* Lean on **multi-stage** to separate build tools from the final runtime.
* Let orchestrators (Compose/K8s) handle **ports/volumes/secrets** at deploy time.
