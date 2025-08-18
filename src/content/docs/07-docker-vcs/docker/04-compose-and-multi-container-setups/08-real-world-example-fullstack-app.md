---
title: Real-World Example - Fullstack App
---
# Real-World Example — Full-Stack App with Docker Compose

This guide turns the following Compose snippet into a complete, production-grade, **teachable** example. It explains each part, adds sensible defaults (health checks, env handling, hot-reload for dev, backups), and shows how to extend it for real projects.

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## 1) What this stack does

* **frontend**: a static site or SPA (e.g., React/Vite) served by a tiny web server (often Nginx).
* **backend**: an API (Node/Express, Flask/FastAPI, Spring Boot, etc.) that connects to the database.
* **db**: a PostgreSQL instance with data persisted in a **named volume** (`db-data`).

### Why Compose?

* One command to start/stop the whole app.
* Built-in network so services can reach each other by service name (`backend` → `db`).
* Easy to add helpers (admin UIs, migrations, test runners) with **profiles**.

---

## 2) Recommended project layout

```bash
project-root/
├─ compose.yaml
├─ .env                      # shared env (safe, non-secrets)
├─ frontend/
│  ├─ Dockerfile
│  └─ ... (app source)
├─ backend/
│  ├─ Dockerfile
│  ├─ .env                   # backend-only env (local dev)
│  └─ src/
└─ ops/
   ├─ initdb/                # SQL init scripts for Postgres (optional)
   └─ backups/               # backup/restore scripts
```

> Keep **secrets** out of Git. Use `.env` for **non-sensitive** config; inject secrets via a `.env.local`, environment managers, or Compose `secrets:`.

---

## 3) A fuller `compose.yaml` you can teach from (dev-friendly)

```yaml
name: fullstack-app

services:
  frontend:
    build:
      context: ./frontend
      target: prod    # assume multi-stage Dockerfile with "prod" stage
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    # For local dev with hot reload, enable this:
    volumes:
      - ./frontend:/app:delegated
    environment:
      - VITE_API_URL=http://localhost:5000
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/ || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 5

  backend:
    build:
      context: ./backend
      target: dev     # dev stage exposes hot reload, e.g., nodemon/uvicorn --reload
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - PORT=5000
      - NODE_ENV=development
    volumes:
      - ./backend:/app:delegated
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:5000/health"]
      interval: 10s
      timeout: 3s
      retries: 5

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=${DB_USER:-user}
      - POSTGRES_PASSWORD=${DB_PASS:-pass}
    volumes:
      - db-data:/var/lib/postgresql/data
      # auto-run SQL on first init:
      - ./ops/initdb:/docker-entrypoint-initdb.d:ro
    expose:
      - "5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 5s
      timeout: 3s
      retries: 10

  # Optional database UI (only when you need it)
  pgadmin:
    image: dpage/pgadmin4
    profiles: ["tools"]
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@example.com
      - PGADMIN_DEFAULT_PASSWORD=admin123
    ports:
      - "5050:80"
    depends_on:
      db:
        condition: service_healthy

volumes:
  db-data:
```

**Highlights**

* `depends_on.condition: service_healthy` ensures the next service waits for the previous **health check** to pass.
* **Bind mounts** (`./frontend:/app`, `./backend:/app`) enable hot reload in dev.
* `profiles` let you run extras on demand: `docker compose --profile tools up`.
* Environment pulled from `.env` (shown below) for portability.

---

## 4) `.env` example (checked into repo, **no secrets**)

```bash
# .env
DATABASE_URL=postgres://user:pass@db:5432/mydb
DB_USER=user
DB_PASS=pass
```

> **Do not** commit real secrets. For secret values, prefer:
>
> * A private `.env.local` ignored by Git, or
> * Compose `secrets:` (file-based), or
> * External secret managers (Doppler, 1Password, Vault, AWS/GCP/Azure).

---

## 5) Service-by-service details

### Frontend

* Typically built as static files (Vite/React) and served by Nginx or similar.
* In dev, use a dev server inside the container with a bind mount for hot reload.
* Pass `VITE_API_URL` (or equivalent) so the SPA knows where the API lives.

**Example Dockerfile (multi-stage)**

```dockerfile
# frontend/Dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build        # outputs to /app/dist

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx already listens on :80
```

### Backend

* Exposes `:5000`.
* Reads `DATABASE_URL`.
* Health endpoint (`/health`) should return 200 quickly.

**Example Node Dockerfile (dev + prod)**

```dockerfile
# backend/Dockerfile
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]   # e.g., nodemon src/index.js

FROM base AS prod
RUN npm ci --omit=dev
COPY . .
CMD ["node", "src/index.js"]
```

### Database (PostgreSQL)

* Uses a **named volume** `db-data` for persistence.
* Optional `ops/initdb/*.sql` will run **once** on first container initialization.
* Healthcheck uses `pg_isready` to coordinate startup.

---

## 6) Networking & addressing

* All services share a default user-defined network created by Compose.
* Service names act as DNS hostnames: the backend connects to `postgres://...@db:5432/...`
* From host machine:

  * `http://localhost:3000` → frontend
  * `http://localhost:5000` → backend
  * `localhost:5432` isn’t published (we used `expose:`). Publish with `- "5432:5432"` **only** if you need local DB tooling.

---

## 7) Data persistence & backups

### Why a named volume?

* Survives container rebuilds/removals.
* Decouples runtime from your source tree.

### Quick backup/restore patterns

```bash
# Backup (creates dump in current dir)
docker exec -t $(docker compose ps -q db) \
  pg_dump -U "$DB_USER" -d "$POSTGRES_DB" > ./ops/backups/backup_$(date +%F).sql

# Restore into a fresh db (ensure db exists; be careful in prod!)
cat ./ops/backups/backup_2025-08-18.sql | \
  docker exec -i $(docker compose ps -q db) psql -U "$DB_USER" -d "$POSTGRES_DB"
```

> For automated backups, schedule a host cron or add a dedicated **backup** service that runs `pg_dump` to a mounted host folder or cloud storage.

---

## 8) Migrations, seeding & test data

* Use a migration tool (e.g., Prisma Migrate, Sequelize, Knex, Alembic, Flyway, Liquibase).
* Add a **migrator** service or `backend` command to run on startup:

```yaml
  backend:
    command: sh -c "npm run migrate && npm run dev"
```

* Seed data via scripts or SQL in `ops/initdb`. Avoid large seeds in prod.

---

## 9) Health checks & startup ordering

* `depends_on` without conditions only controls start **order**, not readiness.
* Use **health checks** to ensure services are actually ready:

  * DB: `pg_isready`
  * Backend: request `/health`
  * Frontend: simple HTTP fetch to `/`
* Then use `depends_on: { condition: service_healthy }` for robust chaining.

---

## 10) Observability (logs, metrics)

* View logs:

  ```bash
  docker compose logs -f backend
  docker compose logs -f
  ```

* Add lightweight observability:

  * **API**: request logging (morgan, pino, or framework middleware)
  * **DB**: `log_min_duration_statement` for slow queries
  * **Metrics**: expose `/metrics` (Prometheus format) and add a Prometheus + Grafana profile later.

---

## 11) Everyday commands

```bash
# Start everything (foreground)
docker compose up

# Start in background (detached)
docker compose up -d

# Stop & remove containers (keeps named volumes)
docker compose down

# Rebuild changed images
docker compose build --no-cache

# Check what's running
docker compose ps

# Tail logs (all services)
docker compose logs -f

# Run one-off commands inside a service
docker compose exec backend bash
docker compose run --rm backend npm test

# Enable optional tools (pgAdmin)
docker compose --profile tools up -d
```

> **Note:** Modern Docker uses `docker compose` (space), not `docker-compose` (hyphen). Both may work; prefer the new CLI.

---

## 12) Troubleshooting cheatsheet

* **Backend can’t reach DB**
  Verify `DATABASE_URL` host is `db` (service name), not `localhost`.
  Confirm DB health: `docker compose ps` and `docker compose logs db`.

* **Port already in use**
  Change host port mapping (`"3001:80"`) or stop the conflicting process.

* **Frontend can’t reach API due to CORS**
  Configure backend CORS to allow `http://localhost:3000` in dev.

* **Hot reload not working**
  Ensure bind mounts are enabled and dev command uses a watcher (nodemon/uvicorn `--reload`).

* **Data lost unexpectedly**
  Did you remove the volume? `docker compose down -v` **removes volumes**. For safe resets, back up first.

---

## 13) Security & secrets (minimum viable hygiene)

* **Never** commit real credentials. Use `.env.local` (git-ignored) or `secrets:`:

  ```yaml
  secrets:
    db-password:
      file: ./ops/secrets/db_password.txt

  services:
    db:
      secrets: [db-password]
      environment:
        - POSTGRES_PASSWORD_FILE=/run/secrets/db-password
  ```

* Run minimal base images (`alpine`, `-slim`) and drop root where feasible.
* Keep images patched: rebuild regularly and pin major versions.
* Restrict published ports to only what you need.

---

## 14) From dev to prod: what changes?

* **Reverse proxy + TLS**: Put Caddy/Traefik/Nginx in front, terminate HTTPS.
* **Externalize the DB**: Use a managed Postgres (Cloud SQL/RDS/Neon/Supabase) and point `DATABASE_URL` to it. Remove the local `db` service in prod.
* **Scale stateless services**: `docker compose up --scale backend=3` (behind a proxy with sticky sessions if needed).
* **Immutability**: Switch backend to `target: prod`, remove bind mounts, rely on built images.
* **Config**: Parameterize with environment and secret managers (Vault, Doppler, SSM).

---

## 15) Minimal test plan (for a class or team)

1. **Build**: `docker compose build` completes without error.
2. **Health**: `docker compose ps` shows all services `healthy`.
3. **Smoke**: `curl http://localhost:5000/health` returns 200; frontend loads at `http://localhost:3000`.
4. **DB RW**: Create a record via API; verify in pgAdmin or via `psql`.
5. **Restart persistence**: `docker compose down && docker compose up -d` → data still there.
6. **Backup/restore**: Create a dump and restore into a fresh environment.

---

## 16) Quick reference: improving the original snippet

* Add **health checks** + `depends_on` with conditions to avoid race conditions.
* Use `.env` and/or `secrets:` for configs and credentials.
* Mount source code for **hot reload** during development.
* Keep **db-data** as a named volume; script backups.
* Consider **profiles** for optional tooling (pgAdmin, Prometheus).
* Separate **dev** and **prod** Dockerfile stages.

---

## 17) Short “lab” exercises

1. Add a `/health` endpoint to the backend and wire the healthcheck.
2. Introduce a migration tool (e.g., Prisma) and run `migrate dev` on container start.
3. Add a **pgAdmin** profile and connect it to `db`.
4. Turn the frontend Dockerfile into a multi-stage build.
5. Replace local `db` with a remote/managed Postgres (update `DATABASE_URL`).
6. Add a **reverse proxy** (Caddy) that serves the frontend and proxies `/api` to the backend.

---

### Final takeaway

This Compose setup gives you a **realistic, end-to-end** development environment with minimal local setup. With a few additions—health checks, profiles, env/secrets, and proper Dockerfiles—you get a stack that’s **teachable**, **reliable**, and **one command** away from running anywhere.
