---
title: Environment Variables in Compose
---
# Environment Variables in Docker Compose

> Use environment variables to configure containers without hard-coding values in your Compose files. They help separate **code** from **configuration**, enable **per-environment setups**, and simplify **secret management** (with caveats—see “Security” below).

---

## 1. Where environment variables can come from

Compose resolves variables from several places. Knowing the **precedence order** helps you predict what value a container actually sees.

**Highest → Lowest precedence:**

1. **Explicit values in `docker-compose.yml`**

   * `services.<name>.environment:` key
2. **`env_file:` entries** in a service
3. **Shell environment** of the `docker compose` process (exported vars in your terminal)
4. **`.env` file** in the same directory as the Compose file
5. **Default values in the Compose file** (e.g., `${VAR:-default}`)

> If the same variable is set in multiple places, the one **higher** in the list wins.

---

## 2. Two different usages of variables (don’t confuse them!)

There are **(A)** variables used by Compose **itself** to *render* the YAML (interpolation), and **(B)** variables injected into the **container** process.

### A) Interpolation in the Compose file

You can reference variables in the YAML like:

```yaml
version: "3.9"
services:
  db:
    image: postgres:${POSTGRES_TAG:-16}
    ports:
      - "${DB_PORT:-5432}:5432"
```

* Here `POSTGRES_TAG` and `DB_PORT` are resolved **on your machine** when Compose parses the file.
* If undefined, Compose uses the defaults (`:-16`, `:-5432`).

### B) Variables inside the container (runtime env)

Use the `environment:` key or `env_file:` to **pass values into the container**:

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

* These become real environment variables **inside** the `db` container.

---

## 3. Using a `.env` file

Place a `.env` in the same directory as the Compose file:

```dotenv
# .env
POSTGRES_PASSWORD=securepass
POSTGRES_USER=appuser
DB_PORT=5433
```

And reference in YAML:

```yaml
services:
  db:
    image: postgres
    ports:
      - "${DB_PORT}:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

**Notes**

* `.env` is **automatically** loaded by Compose (no extra flags).
* Keep it out of version control. Add it to `.gitignore`.

---

## 4. `environment:` vs `env_file:`

### `environment:` (inline, explicit, great for a few values)

```yaml
services:
  api:
    image: node:20-alpine
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
```

### `env_file:` (bulk import, great for many values)

```yaml
services:
  api:
    image: node:20-alpine
    env_file:
      - ./.env
      - ./api.env    # later files override earlier ones
```

* `env_file` supports one or more files; later files **override** earlier ones.
* Use **either** `env_file` or `environment:` for a variable; if both define the same key, `environment:` wins.

---

## 5. Variable syntax & operators

* **Reference:** `${VAR}`
* **Default if unset or empty:** `${VAR:-default}`
* **Default only if unset (empty string allowed):** `${VAR-default}`
* **Required (fail if missing):** `${VAR?error message}`
* **Escape `$`** in strings with `$$` if you need a literal dollar sign.

**Example:**

```yaml
services:
  worker:
    image: myorg/worker:${WORKER_TAG:-latest}
    environment:
      QUEUE: ${QUEUE?You must set QUEUE}
      # literal $HOME inside the container env value:
      HOME_HINT: "Use $$HOME for your home directory"
```

---

## 6. Multi-environment setups (dev / staging / prod)

**Option A: multiple `.env` files**

```bash
.env.development
.env.staging
.env.production
```

Run with a selected file by exporting variables first or using a wrapper:

```bash
# Bash
set -a
. .env.production
set +a
docker compose up -d
```

**Option B: Compose override files**

* `docker-compose.yml` (base)
* `docker-compose.override.yml` (auto-applied)
* `docker-compose.prod.yml` (apply explicitly)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Option C: Profiles**
Activate groups of services with `COMPOSE_PROFILES`:

```yaml
services:
  db:
    image: postgres
  grafana:
    image: grafana/grafana
    profiles: ["observability"]
```

```bash
COMPOSE_PROFILES=observability docker compose up -d
```

---

## 7. Common patterns & examples

### PostgreSQL + App

**`.env`**

```dotenv
POSTGRES_PASSWORD=supersecret
POSTGRES_USER=app
POSTGRES_DB=appdb
DB_PORT=5432
```

**`docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16
    ports:
      - "${DB_PORT:-5432}:5432"
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-postgres}
    volumes:
      - db-data:/var/lib/postgresql/data

  api:
    build: ./api
    depends_on: [db]
    environment:
      DATABASE_URL: "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${DB_PORT:-5432}/${POSTGRES_DB}"
      NODE_ENV: ${NODE_ENV:-development}

volumes:
  db-data:
```

---

## 8. Debugging & verification

* **Show the fully rendered config** (after interpolation):

  ```bash
  docker compose config
  ```

* **Check what a container actually got:**

  ```bash
  docker compose exec api env | sort
  ```
  
* **Log values at startup** (app-level): print or validate required envs and exit with an error if missing.

---

## 9. Security considerations (important!)

* **Do not commit secrets** to VCS. Add `.env` and any secret files to `.gitignore`.
* `.env` is **not encrypted**. Anyone with filesystem access can read it.
* Prefer **Docker secrets** (where applicable) or **external secret managers** for sensitive values.

### Using “Compose secrets” (file-mounted; not encrypted at rest)

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
```

> Note: In non-Swarm Compose, secrets are mounted as files in the container. This keeps them out of `docker inspect` and `env`, but the secret file still lives on disk on the host.

**When to move beyond `.env`:**

* Production deployments
* Shared environments / multi-user hosts
* Compliance requirements

Consider Vault, AWS Secrets Manager, GCP Secret Manager, 1Password, SOPS, or sealed secrets in Kubernetes.

---

## 10. Windows, quoting, and formatting tips

* **Line endings:** Ensure `.env` uses LF, not CRLF, to avoid parsing issues.
* **Quoting:** In `.env`, values are plain strings. Avoid quotes if possible; if you include quotes, they become part of the value.
* **Empty values:** `KEY=` sets an **empty string**; `KEY` (no `=`) is ignored.
* **Comments:** Lines starting with `#` are comments in `.env`.

---

## 11. Build-time vs run-time: `ARG` vs `ENV`

* **`ARG`**: available **only during image build**.
* **`ENV`**: baked into the image at build time and available at run time; can be overridden by `environment:`.

**Dockerfile**

```dockerfile
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine
ARG API_BASE
ENV API_BASE=${API_BASE}
```

**Compose**

```yaml
services:
  web:
    build:
      context: ./web
      args:
        NODE_VERSION: ${NODE_VERSION:-20}
        API_BASE: ${API_BASE:-https://api.example.com}
    environment:
      API_BASE: ${API_BASE:-https://api.example.com}
```

> If you need the same value at **build** and **run** time, pass it both via `build.args` and `environment:` (or compute it at runtime).

---

## 12. Validation patterns

Enforce presence with `?` operator:

```yaml
services:
  api:
    environment:
      JWT_SECRET: ${JWT_SECRET?You must set JWT_SECRET}
```

Or validate at app startup (preferred for clear error messages).

---

## 13. Practical checklist

* [ ] Put secrets in `.env` (dev) or a secret manager (prod).
* [ ] Add `.env` to `.gitignore`.
* [ ] Use `${VAR:-default}` for sensible defaults.
* [ ] Use `docker compose config` to check final values.
* [ ] Prefer `env_file:` for many variables; `environment:` for a few or for overrides.
* [ ] Keep interpolation (YAML) and in-container variables straight in your mind.
* [ ] For production, avoid plain `.env` where security matters.

---

## 14. Minimal, correct example (from your prompt)

**`.env`**

```dotenv
POSTGRES_PASSWORD=securepass
```

**`docker-compose.yml`**

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

**Why this is good**

* Keeps secrets out of the YAML and source code.
* Allows different passwords per environment without touching the Compose file.

---

## 15. Troubleshooting quick hits

* **Var not taking effect?** Check `docker compose config`. Make sure you didn’t define a conflicting value in `environment:` or another `env_file`.
* **Service reading wrong port?** Confirm you aren’t mixing interpolation defaults with container env defaults.
* **Value contains `$` or `:`?** Quote it in YAML and escape `$` as `$$` when necessary.
* **On Windows:** Verify the `.env` file encoding (UTF-8, LF).

---

**TL;DR:**
Use `.env` and `env_file:` to **externalize configuration**, `environment:` to **inject runtime variables**, interpolation (`${VAR}`) to **parameterize your Compose file**, and adopt **secrets** or a **secret manager** for sensitive values in production.
