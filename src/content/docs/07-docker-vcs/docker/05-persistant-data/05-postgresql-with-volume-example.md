---
title: Practical Example - PostgreSQL with Volume
---
# Running PostgreSQL with a Persistent Docker Volume

This guide turns the snippet below into a clear, classroom‑ready walkthrough. You’ll learn what each flag does, what happens under the hood, how to verify persistence, and how to back up, restore, and upgrade safely.

```bash
docker volume create pgdata

docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

---

## 1. What This Setup Achieves

* **Creates a named volume** `pgdata` managed by Docker.
* **Runs a PostgreSQL container** from the official `postgres` image.
* **Mounts** the volume at PostgreSQL’s data directory `/var/lib/postgresql/data`.
* **Persists your database** data even if the container is removed or recreated.

---

## 2. Prerequisites

* Docker installed (Docker Desktop on macOS/Windows, or Docker Engine on Linux).
* Network access to pull the `postgres` image from Docker Hub.
* Basic shell access.

---

## 3. Command Deep Dive

### 3.1 Create the volume

```bash
docker volume create pgdata
```

* **Named volume**: Docker stores it in its internal volume directory (e.g., `/var/lib/docker/volumes/...` on Linux).
* **Lifecycle**: A volume outlives containers that use it, so data isn’t tied to a specific container.

### 3.2 Run PostgreSQL with the volume

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

* `-d`: Run in detached mode (in the background).
* `--name my-postgres`: Assigns a human‑friendly container name.
* `-e POSTGRES_PASSWORD=...`: **Required** for the default `postgres` superuser if you don’t set `POSTGRES_HOST_AUTH_METHOD=trust` (not recommended).
* `-v pgdata:/var/lib/postgresql/data`: Mounts the named volume at the path where PostgreSQL stores cluster data (WAL, tables, indexes, etc.).
* `postgres`: Uses the **latest** tag by default. Pin a specific version for stability (e.g., `postgres:16`).

> ✅ **Result**: On first start, the image initializes a new PostgreSQL cluster under `/var/lib/postgresql/data`. On subsequent starts with the same volume, it **reuses** the existing data.

---

## 4. What Happens Under the Hood

1. Docker **pulls** the `postgres` image if not present.
2. The container **initializes** a data directory on first run (cluster init).
3. The `pgdata` volume is **mounted** into the container at `/var/lib/postgresql/data`.
4. PostgreSQL **writes** all persistent state to that mounted path.
5. Stopping/removing the container does **not** delete the volume’s contents.

---

## 5. Verify That Data Persists

### 5.1 (Optional) Expose a port and create a test table

Recreate with port mapping so you can connect from your host:

```bash
docker rm -f my-postgres
docker run -d \
  --name my-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

From your host (needs `psql`):

```bash
PGPASSWORD=mysecretpassword psql -h localhost -U postgres -c "CREATE DATABASE demo;"
PGPASSWORD=mysecretpassword psql -h localhost -U postgres -d demo -c "CREATE TABLE t (id int); INSERT INTO t VALUES (1.;"
```

### 5.2 Stop/remove the container and start a new one

```bash
docker rm -f my-postgres
docker run -d \
  --name my-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

### 5.3 Check the data is still there

```bash
PGPASSWORD=mysecretpassword psql -h localhost -U postgres -d demo -c "SELECT * FROM t;"
```

You should still see your row `1`, proving persistence.

---

## 6. Useful Day‑to‑Day Commands

* **Inspect the volume**:

  ```bash
  docker volume inspect pgdata
  ```

* **List volumes**:

  ```bash
  docker volume ls
  ```

* **Shell into the container**:

  ```bash
  docker exec -it my-postgres bash
  ```

* **View logs**:

  ```bash
  docker logs -f my-postgres
  ```

---

## 7. Environment Variables You’ll Commonly Use

* `POSTGRES_PASSWORD`: Password for the `postgres` superuser (required if `POSTGRES_HOST_AUTH_METHOD` is not set to `trust`).
* `POSTGRES_USER`: Create a different superuser (default: `postgres`).
* `POSTGRES_DB`: Create a database at first startup (default: same as user).
* `TZ` or `PGTZ`: Time zone (varies by image base; safe to set `TZ=UTC`).

**Example**:

```bash
docker run -d \
  --name my-postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=strongpass \
  -e POSTGRES_DB=appdb \
  -e TZ=UTC \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

---

## 8. Backups and Restores

### 8.1 Logical backups (portable, for migrations)

* **Backup**:

  ```bash
  docker exec -t my-postgres pg_dump -U app -d appdb > appdb_$(date +%F).sql
  ```

* **Restore**:

  ```bash
  cat appdb_2025-08-19.sql | docker exec -i my-postgres psql -U app -d appdb
  ```

### 8.2 Volume‑level backups (fast, full data directory)

* **Archive the volume** (container must be stopped or DB must be consistent—prefer stopping):

  ```bash
  docker run --rm \
    -v pgdata:/source \
    -v "$PWD":/backup \
    alpine sh -c "cd /source && tar czf /backup/pgdata_$(date +%F).tar.gz ."
  ```

* **Restore** to an **empty** volume:

  ```bash
  docker volume rm pgdata
  docker volume create pgdata
  docker run --rm \
    -v pgdata:/restore \
    -v "$PWD":/backup \
    alpine sh -c "cd /restore && tar xzf /backup/pgdata_2025-08-19.tar.gz"
  ```

> ℹ️ For consistent volume backups **while running**, use PostgreSQL tools (e.g., `pg_basebackup`) or filesystem snapshots (host‑level). Simple tar while DB runs can capture an inconsistent state.

---

## 9. Upgrading PostgreSQL Safely

1. **Pin versions** to avoid surprise major upgrades:

   ```bash
   postgres:16
   ```

2. **Major upgrade** (e.g., 16 → 17. options:

   * **Dump/restore**: Use `pg_dump`/`pg_restore` into a fresh 17 container/volume.
   * **pg\_upgrade**: Requires both versions and more steps; often easier with a dedicated upgrade container or on a VM.
3. **Process (dump/restore, recommended for small/medium DBs)**:

   * Create a **new volume** `pgdata17`.
   * Start a `postgres:17` container with `pgdata17`.
   * Dump from old and restore into new.
   * Switch applications to the new port/container and decommission the old one after verification.

---

## 10. Security Best Practices

* **Never** use weak or default passwords; store secrets outside version control.
* Restrict network exposure: map to `localhost` during development:

  ```bash
  -p 127.0.0.1:5432:5432
  ```

* Use host‑level disk encryption if required (volumes inherit host storage).
* Regular backups and restore drills.
* Least privilege DB roles for applications.

---

## 11. Performance Notes

* Named volumes perform well for databases; avoid slow remote filesystems unless designed for DB I/O.
* Prefer SSD/NVMe storage for lower latency.
* Tune shared buffers, work\_mem, and effective\_cache\_size for production (via `postgresql.conf` or environment/`-c` flags).

---

## 12. Common Pitfalls & Troubleshooting

* **“permission denied” with bind mounts**: Named volumes usually “just work”. If you bind‑mount a host directory, ensure the directory is owned by (or writable to) the `postgres` user inside the container. On Linux:

  ```bash
  sudo mkdir -p /data/pg
  sudo chown -R 999:999 /data/pg   # typical uid/gid for postgres in the image
  docker run ... -v /data/pg:/var/lib/postgresql/data
  ```

* **SELinux (Fedora/RHEL)**: Add `:Z` or `:z` to bind mount to relabel:

  ```bash
  -v /data/pg:/var/lib/postgresql/data:Z
  ```

* **Port already in use**: Choose a different host port (e.g., `-p 5433:5432`).
* **Data loss after recreate**: Verify you used the **same named volume** and not an anonymous one; check `docker inspect my-postgres` mounts.
* **Crash loops**: Check logs:

  ```bash
  docker logs my-postgres
  ```

---

## 13. Docker Compose Equivalent

```yaml
services:
  db:
    image: postgres:16
    container_name: my-postgres
    ports:
      - "127.0.0.1:5432:5432"
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: strongpass
      POSTGRES_DB: appdb
      TZ: UTC
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

* Bring up: `docker compose up -d`
* Tear down (keep volume): `docker compose down`
* Tear down **and** delete volume: `docker compose down -v` (⚠️ deletes data)

---

## 14. Cleaning Up

* Stop & remove the container:

  ```bash
  docker rm -f my-postgres
  ```

* Remove the volume (⚠️ deletes DB data):

  ```bash
  docker volume rm pgdata
  ```

---

## 15. Quick FAQ

**Q: Can multiple containers share the same `pgdata` volume?**
A: Not safely at the same time for PostgreSQL data; it expects exclusive access.

**Q: Do I need `-p 5432:5432`?**
A: Only if you want to connect from the host or other machines. For container‑to‑container on the same Docker network, use service name + internal port.

**Q: Where is the volume on disk?**
A: Docker manages it internally. Use `docker volume inspect pgdata` to see the mountpoint (path varies by OS/engine).

**Q: How do I change config?**
A: You can pass flags like `-c shared_buffers=256MB` or mount a config file. Example:

```bash
docker run ... postgres:16 -c shared_buffers=256MB -c max_connections=200
```

---

### Summary

Using a **named volume** with the official `postgres` image is the simplest, most robust way to persist database data in Docker. Pin versions, keep backups, verify restores, and you’ll have a dependable local or small‑scale production setup.
