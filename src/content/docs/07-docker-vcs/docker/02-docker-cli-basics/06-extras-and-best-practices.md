---
title: Extras & Best Practices
---

## Overview

This guide collects high-value Docker extras, idiomatic CLI patterns, and production-ready best practices. It complements the core commands by focusing on maintainability, security, performance, and operability at scale.

---

## Handy Commands

### Copy, Rename & Move

- **Copy files to/from a container**

  ```bash
  # Host → container
  docker cp ./local.txt myctr:/tmp/remote.txt

  # Container → host
  docker cp myctr:/var/log/app.log ./app.log
  ```

*Tip:* Paths must exist; create target dirs first (e.g., `mkdir -p` inside container).

* **Rename a container**

  ```bash
  docker rename old-name new-name
  ```

* **Retag an image**

  ```bash
  docker tag old-image:tag new-repo/new-image:newtag
  ```

### Inspect, Diff, Top

* **Inspect with formatting (focus only what you need)**

  ```bash
  docker inspect myctr --format '{{.State.Status}} {{.NetworkSettings.IPAddress}}'
  docker inspect myimg:1.2 --format '{{json .Config.Env}}' | jq
  ```

* **Show filesystem changes since container start**

  ```bash
  docker diff myctr
  ```

* **List running processes in a container**

  ```bash
  docker top myctr -eo pid,ppid,user,etime,cmd
  ```

### Events, Stats, Logs

* **Real-time daemon events (filter to reduce noise)**

  ```bash
  docker events --filter 'type=container' --filter 'event=die'
  ```

* **Live resource stats**

  ```bash
  docker stats --no-stream
  ```

* **Logs with time and tail**

  ```bash
  docker logs -f --since=10m --timestamps --tail=200 myctr
  ```

### Exec, Attach, Copy-on-Demand

* **Open a shell (non-TTY vs. TTY)**

  ```bash
  docker exec -it myctr /bin/sh        # BusyBox/Alpine
  docker exec -it myctr /bin/bash      # Debian/Ubuntu
  ```

* **Attach to PID 1 (rare; prefer `exec`)**

  ```bash
  docker attach myctr
  ```

### Export/Import, Save/Load

* **Container filesystem snapshot (tar)**

  ```bash
  docker export myctr | gzip > myctr.tar.gz
  docker import myctr.tar.gz myimg:from-export
  ```

* **Image tarball (preserves layers & metadata)**

  ```bash
  docker save myimg:1.2 | gzip > myimg_1.2.tgz
  docker load -i myimg_1.2.tgz
  ```

### Health, Wait, Exit Codes

* **Wait for container to exit; get exit code**

  ```bash
  docker wait myctr
  echo $?
  ```

* **Kill with a specific signal (for graceful shutdowns)**

  ```bash
  docker kill --signal=SIGTERM myctr
  ```

### Prune & Cleanup (use filters!)

* **Selective pruning (dry run first)**

  ```bash
  docker system df
  docker image prune --filter "until=168h" --dry-run
  docker container prune --filter "until=72h"
  docker volume prune
  docker system prune -a --volumes
  ```

### Formatting Lists (Quick Triage)

* **Images**

  ```bash
  docker images --format 'table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.ID}}'
  ```

* **Containers**

  ```bash
  docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
  ```

---

## Best Practices

### 1. Immutability & Configuration

* **Keep containers immutable.** Build once, run anywhere.
* **Externalize configuration:**

  * Environment variables (`-e`, `--env-file`)
  * **Secrets** (Swarm/Compose) and **configs** for sensitive or text settings
  * **Volumes** for runtime data & credentials mounted at runtime
* **Avoid** `docker commit` for changes; make changes via Dockerfile & CI.

**Example: Compose with env + secrets**

```yaml
services:
  app:
    image: myorg/app:1.4.0
    env_file: .env
    secrets:
      - db_password
    configs:
      - app_config
    volumes:
      - app-data:/var/lib/app

secrets:
  db_password:
    file: ./secrets/db_password.txt

configs:
  app_config:
    file: ./configs/app.yml

volumes:
  app-data:
```

---

### 2. Minimal & Reproducible Images

* **Choose slim bases** (e.g., `debian:bookworm-slim`, `alpine` when compatible).
* **Pin versions & checksums** for package installs and language deps.
* **Use multi-stage builds** to separate build tools from runtime.
* **Use `.dockerignore`** to keep contexts small and protect secrets.

**Multi-stage example (Node.js)**

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:20-bookworm AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
USER 10001:10001
EXPOSE 8080
CMD ["dist/server.js"]
```

**Layer hygiene tips**

* Combine package installs in a single `RUN` and **clean caches** in the same layer.
* Order Dockerfile instructions by **volatility**:

  * least changing (base, OS deps) → most changing (source code).
* Prefer `npm ci`, `pip install --no-cache-dir`, `apt-get clean` patterns.

---

### 3. Build Performance & Cache

* Enable **BuildKit** (`DOCKER_BUILDKIT=1`) for:

  * `--mount=type=cache` for language managers / compilers
  * `--secret` and `--ssh` mounts for private deps
* Use **targeted builds** with `--target`, and **platform** with `--platform`.

**Secrets in builds (no leakage in final image)**

```dockerfile
# syntax=docker/dockerfile:1.7
RUN --mount=type=secret,id=npm_token \
    bash -lc 'echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/npm_token)" > ~/.npmrc && npm ci'
```

```bash
docker build --secret id=npm_token,src=./.secrets/npm_token.txt -t myimg:secure .
```

---

### 4. Security Hardening

* **Run as non-root** (`USER` directive) and set ownership during copy/install.
* **Drop Linux capabilities** unless needed.
* **Read-only root filesystem** + **tmpfs** for write-needed dirs.
* **No new privileges** and restrictive seccomp/AppArmor profiles.
* **Scan images** regularly (CI step) and keep bases patched.

**Hardened run**

```bash
docker run -d --name app \
  --read-only \
  --tmpfs /tmp \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --pids-limit 256 \
  --memory 512m --cpus 1.5 \
  --health-cmd='curl -f http://localhost:8080/health || exit 1' \
  --health-interval=10s --health-retries=3 --health-timeout=2s \
  myorg/app:1.4.0
```

**Dockerfile guardrails**

```dockerfile
USER 10001:10001
VOLUME ["/var/lib/app"]        # Persist state outside container layer
HEALTHCHECK --interval=10s --timeout=2s --retries=3 CMD curl -f http://localhost:8080/health || exit 1
```

---

### 5. Logging & Observability

* Prefer **structured logs** (JSON) at stdout/stderr.
* Choose a suitable **logging driver** and set rotation:

  ```bash
  docker run \
    --log-driver=json-file \
    --log-opt max-size=10m --log-opt max-file=3 \
    myorg/app:1.4.0
  ```

* Centralize logs in the platform (Fluentd/Vector/OTel collector).
* Expose **/metrics** (Prometheus) and set **healthchecks**.
* Add **labels** for ownership and SLOs:

  ```bash
  docker run -d \
    --label "com.myorg.team=platform" \
    --label "com.myorg.service=checkout" \
    myorg/checkout:2.3.1
  ```

---

### 6. Resource Limits & Reliability

* Set **CPU/memory** limits and **ulimits** to contain blast radius:

  ```bash
  docker run --cpus="1.5" -m 512m --ulimit nofile=2048:4096 my-app
  ```

* Use proper **restart policies**:

  ```bash
  docker run --restart=on-failure:3 my-app
  # or: --restart=always for long-lived services (be cautious with crash loops)
  ```

* Prefer **graceful shutdowns**:

  * Ensure the app handles `SIGTERM`.
  * Use a minimal init (e.g., `--init`) to reap zombies.

---

### 7. Networking Practices

* Use **user-defined bridge networks** for built-in DNS & isolation:

  ```bash
  docker network create app-net
  docker run -d --network app-net --name api myorg/api:1.2.0
  docker run -d --network app-net --name web -p 8080:80 myorg/web:2.1.0
  # web can reach api via http://api:PORT
  ```

* Expose only necessary ports (`-p host:container`), avoid `--network host` in multi-tenant hosts.
* Use **network aliases** for service discovery; avoid hardcoding IPs.

---

### 8. Data Management & Backups

* **Never bake persistent data into images.** Use **named volumes**.
* Plan **backups** of volumes (e.g., `docker run --rm -v vol:/data -v $PWD:/backup alpine tar czf /backup/vol.tgz /data`).
* Know the difference:

  * **Volume** (managed by Docker; portable)
  * **Bind mount** (host path; powerful but less portable)
  * **tmpfs** (in-memory; good for secrets/temp data)

---

### 9. Tagging, Versioning & Promotion

* Avoid relying on `latest` in production.
* Use **SemVer tags** and **immutable digests** for promotions:

  ```bash
  docker run myorg/app:1.4.0@sha256:...   # precise & tamper-resistant
  ```

* Maintain **channel tags** that move forward (e.g., `:prod`, `:staging`) via CI.

---

### 10. CI/CD Integration

* Build once, then **sign & scan**:

  * Build → Test → Scan → Push → Sign → Deploy.
* Use **multi-arch** with `buildx`:

  ```bash
  docker buildx build --platform linux/amd64,linux/arm64 -t myorg/app:1.4.0 --push .
  ```
  
* Store **SBOMs** and scan for vulnerabilities in the pipeline.

---

### 11. Compose Tips

* Use **profiles** to toggle optional services.
* Model **dependencies** with healthchecks (`depends_on: condition: service_healthy`).
* Put **secrets/configs** in Compose instead of env vars for sensitive data.
* Example:

  ```yaml
  services:
    db:
      image: postgres:16
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U postgres"]
        interval: 10s
        retries: 5
    api:
      image: myorg/api:1.2.0
      depends_on:
        db:
          condition: service_healthy
      env_file: .env
      profiles: ["default", "dev"]
  ```

---

## Troubleshooting Playbook

* **Container won’t start**

  * `docker logs myctr` (with `--tail` / `--since`)
  * `docker inspect myctr --format '{{.State.ExitCode}} {{.State.Error}}'`
* **Networking issues**

  * `docker network inspect app-net`
  * `docker exec -it web getent hosts api`
* **Disk pressure**

  * `docker system df` then targeted `prune`
* **High CPU/mem**

  * `docker stats` and app profiling; adjust `--cpus`/`-m`
* **File perms**

  * Ensure `USER` matches volume ownership; use `--user` or `chown` during build.

---

## Operational Checklists

### Image Build Checklist

* [ ] Base image minimal & current
* [ ] Multi-stage build separating build/runtime
* [ ] `.dockerignore` present & effective
* [ ] Reproducible deps (lockfiles; pinned versions)
* [ ] `USER` non-root; only needed files in final stage
* [ ] Healthcheck defined (when appropriate)
* [ ] SBOM/scan completed; known vulns triaged

### Runtime Checklist

* [ ] Resource limits (`--cpus`, `-m`, `--ulimit`)
* [ ] Restart policy appropriate
* [ ] Logging rotation configured
* [ ] Read-only root FS + tmpfs for writable dirs
* [ ] Capabilities dropped; no-new-privileges set
* [ ] Secrets via engine/Compose, not plain env vars
* [ ] Backups scheduled for volumes

---

## Reference Snippets

### Read-only FS with writable paths

```bash
docker run -d --read-only \
  --tmpfs /tmp \
  -v app-data:/var/lib/app \
  myorg/app:1.4.0
```

### Fine-grained capabilities (grant only what’s needed)

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE myproxy:2.0
```

### Healthcheck (Dockerfile)

```dockerfile
HEALTHCHECK --interval=10s --timeout=2s \
  CMD wget -qO- http://localhost:8080/health || exit 1
```

### Structured JSON logs (Node example)

```js
console.log(JSON.stringify({ level: "info", msg: "started", ts: Date.now() }));
```

---

## Further Pointers

* Prefer **distroless** or minimal bases for production.
* Avoid mutable path side effects in containers; treat them as **ephemeral**.
* Make **graceful shutdown** part of your dev workflow (simulate `SIGTERM` locally).
* Regularly **rotate credentials** and automate image rebuilds on base updates.

---
