---
title: Networks and Communication
---
# Networks & Communication in Docker Compose

> **Goal:** Understand how containers in a Compose project discover and talk to each other, how to shape that communication with networks, and how to expose services to the outside world—cleanly and securely.

---

## 1) Big Picture

* **Compose default:** All services defined in the same `docker-compose.yml` are attached to an **app-scoped bridge network** (named like `<project>_default`).
* **Service discovery:** Each service can reach others via **DNS** using the **service name** as the hostname.
* **Ports vs. internal connectivity:** Containers talk internally on container ports. **Publishing ports** is only required to reach a container **from your host or the internet**.

---

## 2) Default Networking & Service Discovery

Given:

```yaml
services:
  api:
    build: ./api
    depends_on:
      - db
  db:
    image: postgres:16
```

* Compose creates a network (e.g., `myapp_default`).
* `api` can reach the database at hostname `db` on the default Postgres port `5432`.
* Typical connection string:

```bash
postgres://user:password@db:5432/mydb
```

**Key point:** You do **not** need IPs. DNS inside the network resolves `db` → container IP.

---

## 3) Publishing Ports (Host ↔ Container)

* **Internal container-to-container traffic:** no `ports:` needed.
* **External access (browser, curl from host):** publish a port:

```yaml
services:
  api:
    build: ./api
    ports:
      - "8080:3000"  # host:container
```

* Access from host: `http://localhost:8080`
* Inside the network, other services still use `http://api:3000`.

**Common gotcha:** Inside a container, **`localhost` means that container**. To reach the host from a container (for callbacks, dev tools, etc.), use `host.docker.internal` (works on Mac/Windows; on Linux you may need to add `--add-host=host.docker.internal:host-gateway`).

---

## 4) Multiple Networks for Segmentation

Use multiple networks to isolate components:

```yaml
services:
  api:
    build: ./api
    networks: [app, dbnet]
  db:
    image: postgres:16
    networks: [dbnet]
  nginx:
    image: nginx:alpine
    networks: [app]

networks:
  app:
  dbnet:
```

* `nginx` cannot talk to `db` (not on `dbnet`).
* `api` can talk to both.

**Why:** Principle of least privilege, simpler troubleshooting, clearer topology.

---

## 5) Network Aliases & Custom Hostnames

* **Aliases:** Grant extra DNS names on a network.

```yaml
services:
  api:
    build: ./api
    networks:
      app:
        aliases: [backend, service-api]
networks:
  app: {}
```

* **Custom container name:** Discouraged in Compose (can collide) but possible via `container_name`. Prefer **aliases** and **service names**.

---

## 6) Drivers You’ll Actually Use

| Driver    | Where              | What it does                             | Typical Use                                                                |
| --------- | ------------------ | ---------------------------------------- | -------------------------------------------------------------------------- |
| `bridge`  | Local Compose      | NATed network per project                | Most Compose projects                                                      |
| `host`    | Linux only         | Shares host network namespace            | High-perf, or when app must bind actual host IP (no port mapping possible) |
| `overlay` | Swarm/k8s contexts | Multi-host networking                    | Not used by local Compose                                                  |
| `macvlan` | Advanced           | Give containers their **own** LAN MAC/IP | Legacy/IoT/intranet integration                                            |

**Default is `bridge`.** Stick to it unless you have a specific reason not to.

---

## 7) Health, Start Order & Connection Robustness

* `depends_on` **does not** wait for the target service to be **ready**—only for it to **start**.
* For robust boot sequences, combine:

  * `healthcheck` on dependencies.
  * App-level retry/backoff (e.g., wait for DB to accept connections).

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER:-postgres}"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy
```

---

## 8) External Networks (Share Across Projects)

Attach services to an existing user-created network:

```bash
docker network create --driver bridge shared_net
```

```yaml
services:
  gateway:
    image: traefik:v3
    networks: [shared_net]

networks:
  shared_net:
    external: true
```

Great for sharing a reverse proxy (Traefik/Caddy/Nginx) across multiple Compose stacks.

---

## 9) IPv6, DNS & MTU Notes

* **IPv6:** Enable via the Docker daemon config (platform/host setting), then create IPv6-enabled networks. Compose can attach services afterward.
* **DNS:** Docker embeds a DNS server per network; it resolves service names + aliases.
* **MTU issues:** In VPN/cloud environments, wrong MTU may cause timeouts. Fix by setting the Docker daemon’s MTU or using a custom network with `com.docker.network.driver.mtu`.

---

## 10) Security Tips

* **Segmentation:** Place databases on a private network (no `ports:` published). Only the backend joins that network.
* **Least privilege:** Don’t attach every service to every network.
* **No plaintext secrets in images:** Supply secrets via env vars/Compose `secrets`, or external secret stores.
* **TLS:** Terminate at a reverse proxy; use mTLS internally if you have high trust requirements.

---

## 11) Practical Patterns

### A) Classic 3-Tier with Private DB

```yaml
services:
  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    ports:
      - "8080:80"
    networks: [web]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://app:app@db:5432/appdb
    networks: [web, db]

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    volumes:
      - dbdata:/var/lib/postgresql/data
    networks: [db]

volumes:
  dbdata:

networks:
  web:
  db:
```

* `db` is **not** exposed to the host.
* `frontend` only sees `api` (shared `web` net), not `db`.

### B) Shared Reverse Proxy for Many Stacks

* Create `shared_net` once.
* Each app publishes labels for routing (Traefik/Caddy).
* Only the reverse proxy publishes host ports 80/443; apps publish **none**.

---

## 12) Troubleshooting & Observability

**CLI you’ll use a lot:**

```bash
# List networks
docker network ls

# Inspect a network (containers, subnets, options)
docker network inspect <network>

# Exec into a container to test DNS/connectivity
docker compose exec api sh
# Inside:
apk add --no-cache curl # or apt-get update && apt-get install -y curl
curl -v http://db:5432    # Expect connection refusal for HTTP (but proves DNS resolves)
nc -zv db 5432            # netcat test if available
```

**Common issues:**

* “It works on host but not in container”: you used `localhost` inside the container. Use the **service name**.
* “Port already in use”: host port conflict. Change the **left side** of `host:container`.
* “Can’t resolve service name”: containers aren’t on the same network; attach both to a shared network or the Compose default.

---

## 13) Environment-Specific Host Access

Need the container to call back to your **host** (e.g., webhooks to a dev tool running on your laptop)?

* macOS/Windows: `http://host.docker.internal:<port>`
* Linux: add:

```yaml
services:
  api:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Then call `http://host.docker.internal:<port>` from the container.

---

## 14) Healthier Startup in App Code (Example)

Even with `service_healthy`, include retry logic:

```js
// Node.js pseudo-example
import pg from "pg";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

for (let i = 0; i < 10; i++) {
  try {
    await client.connect();
    break;
  } catch (e) {
    console.log("DB not ready, retrying...", e.message);
    await sleep(3000);
  }
}
```

---

## 15) Advanced: Network Modes & When to Use Them

* `network_mode: "host"` (Linux): container shares host network (no `ports:`). Useful for:

  * Apps that must bind multicast/broadcast.
  * Performance-sensitive cases where NAT hurts.
* `network_mode: "service:<name>"`: Share network namespace with another service (rare; advanced).
* `macvlan`: Give a container a first-class IP on your LAN. Handy for NAS/legacy integrations; comes with routing considerations.

---

## 16) Exercises (Hands-On)

1. **Ping by service name**

* Add a tiny debug container (e.g., `alpine`) to your Compose file.
* From it, `ping api`, `ping db`. Confirm DNS resolution.

2. **Split networks**

* Create `web` and `db` networks.
* Ensure `frontend` cannot reach `db` (connection should fail).

3. **Reverse proxy on a shared net**

* Create an **external** network `shared_net`.
* Attach a Traefik service that listens on 80/443 and two demo apps on `shared_net`.
* Route via hostnames (e.g., `app1.localtest.me`, `app2.localtest.me`).

4. **Healthcheck + retries**

* Add a `healthcheck` to your DB.
* Implement retries in your API startup. Simulate a delay in DB startup; verify graceful API boot.

---

## 17) Quick Reference Snippets

**Create a named bridge network**

```bash
docker network create my_net
```

**Attach a service to multiple networks**

```yaml
services:
  svc:
    image: busybox
    command: sleep 3600
    networks: [a, b]
networks:
  a: {}
  b: {}
```

**Publish multiple ports**

```yaml
ports:
  - "80:80"
  - "443:443"
```

**Set custom subnet (advanced)**

```yaml
networks:
  custom:
    driver: bridge
    ipam:
      config:
        - subnet: 172.31.0.0/16
```

---

## 18) Best Practices Checklist

* Use **service names** for internal communication.
* Publish **only** the ports that must be public.
* Segment with **multiple networks** (e.g., `web`, `db`).
* Add **healthchecks** and **app-level retries**.
* Centralize ingress via a **reverse proxy** on a shared/external network.
* Avoid hard-coding IPs; rely on Docker DNS.
* Keep secrets out of images; inject at runtime.

---

## 19) Minimal, Well-Shaped Example

```yaml
version: "3.9"

services:
  nginx:
    image: nginx:alpine
    ports: ["8080:80"]
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    networks: [web]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://app:app@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    networks: [web, db]

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
    volumes:
      - dbdata:/var/lib/postgresql/data
    networks: [db]

volumes:
  dbdata:

networks:
  web: {}
  db: {}
```

**How it flows:**

* Browser → `localhost:8080` → `nginx`
* `nginx` → `api` via `http://api:3000` (internal)
* `api` → `db` via `postgres://...@db:5432/appdb` (internal)
* `db` never exposed to host; reachable only from `api`.

---

## 20) Takeaways

* Compose networking is **DNS-first** and **service-name-driven**.
* Shape **who can talk to whom** using **networks**, not random IPs.
* Publish ports sparingly; internal traffic doesn’t need them.
* Production-grade reliability comes from **healthchecks + retries + segmentation**.
