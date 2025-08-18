---
title: Volumes for Persistent Data
---
# Volumes for Persistent Data

> Use **volumes** to store data that should survive container rebuilds, upgrades, and restarts. This is essential for stateful services like databases.

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## Why persistence matters

Containers are **ephemeral**: if you remove a container, everything inside its writable layer disappears. Databases, message queues, uploads, and caches often must **outlive** containers. Volumes provide a durable, host-managed storage location that is **decoupled** from any single container.

---

## Storage options at a glance

* **Named volumes (recommended for most cases)**
  Managed by Docker; data lives under Docker’s storage area (e.g., `/var/lib/docker/volumes/...`). Portable across Compose runs.

* **Bind mounts**
  Map a specific host path into a container (e.g., `./data:/var/lib/postgresql/data`). Great for local dev or when you need direct host access, but you manage permissions and paths yourself.

* **Anonymous volumes**
  Created implicitly (no name). Useful for temporary data but hard to reference later.

* **tmpfs mounts (Linux)**
  In-memory, non-persistent storage for sensitive or high-IO temporary data.

---

## Using named volumes in Compose

### Short syntax (common)

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### Long syntax (advanced options)

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - type: volume
        source: db-data
        target: /var/lib/postgresql/data
        read_only: false
        volume:
          nocopy: true   # do not copy container's existing content into the volume
volumes:
  db-data:
    name: myproject-db   # explicit name (useful across stacks or scripts)
```

### Sharing a volume across services

```yaml
services:
  db:
    image: postgres:16
    volumes: [db-data:/var/lib/postgresql/data]
  backup:
    image: alpine
    volumes: [db-data:/var/lib/postgresql/data:ro]
    command: ["sh","-c","tar czf /backup/db.tgz -C /var/lib/postgresql/data ."]
volumes:
  db-data:
```

---

## Bind mounts vs. named volumes

| Use case                                         | Prefer                                                     |
| ------------------------------------------------ | ---------------------------------------------------------- |
| Production/stateful services                     | **Named volumes** (isolate from host FS, easier lifecycle) |
| Local dev with live code edits                   | **Bind mounts** (edit files directly on host)              |
| Need precise control of host path/backup tooling | **Bind mounts**                                            |
| Portability between machines/CI                  | **Named volumes**                                          |

**Example bind mount:**

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - ./db-data:/var/lib/postgresql/data   # host path -> container path
```

---

## How volumes work under the hood

* Docker creates a directory in its storage area and mounts it into the container at the `target` path.
* Removing a **container** does not remove the **volume**.
* Removing a **volume** deletes the data.

---

## Lifecycle & commands

```bash
# list volumes
docker volume ls

# inspect a volume (shows mountpoint, driver, labels)
docker volume inspect db-data

# remove an unused volume (make sure no container is using it)
docker volume rm db-data

# prune all unused volumes (⚠ irreversible)
docker volume prune
```

**Compose lifecycle tips**

* `docker compose down` leaves named volumes intact by default.
* `docker compose down --volumes` removes them (and the data). Use carefully.

---

## Backups & restore

**Using a one-off helper container (works for any service):**

```bash
# Backup (tar.gz to host)
docker run --rm \
  -v db-data:/data:ro \
  -v "$PWD":/backup \
  alpine sh -c "tar czf /backup/db-data-$(date +%F).tgz -C /data ."

# Restore into an empty volume
docker run --rm \
  -v db-data:/data \
  -v "$PWD":/backup \
  alpine sh -c "tar xzf /backup/db-data-2025-08-18.tgz -C /data"
```

**Compose-native backup job (as a service):**

```yaml
services:
  backup:
    image: alpine
    volumes:
      - db-data:/data:ro
      - ./backups:/backup
    entrypoint: ["sh","-c","tar czf /backup/db-$(date +%F-%H%M).tgz -C /data . && sleep 3600"]
volumes:
  db-data:
```

---

## Permissions, ownership & common pitfalls

* **UID/GID match:** Database images (e.g., Postgres) expect data directories owned by a specific user (often UID 999 for `postgres`). If you see `permission denied` or “wrong ownership”, initialize/adjust ownership:

  ```bash
  docker run --rm -v db-data:/var/lib/postgresql/data alpine \
    sh -c "chown -R 999:999 /var/lib/postgresql/data"
  ```

  Or configure the container user:

  ```yaml
  services:
    db:
      image: postgres:16
      user: "999:999"
  ```

* **SELinux (Fedora/RHEL/CentOS) and bind mounts:** add `:z` (shared) or `:Z` (private) to relabel:

  ```yaml
  - ./db-data:/var/lib/postgresql/data:Z
  ```

* **Windows/macOS performance:** bind mounts can be slower due to filesystem sync. Prefer **named volumes** for heavy IO (databases).

* **Init scripts for DBs:** keep schema/seed scripts in a **separate** mount (e.g., `/docker-entrypoint-initdb.d`) rather than mixing with the data directory.

---

## External & pre-existing volumes

Use **external** if a volume is created outside Compose (e.g., by ops or another stack):

```yaml
services:
  db:
    image: postgres:16
    volumes: [prod-db:/var/lib/postgresql/data]
volumes:
  prod-db:
    external: true
    name: prod-db
```

This tells Compose **not** to create or remove it.

---

## Volume drivers (advanced)

Drivers let you back volumes by NFS, CIFS/SMB, cloud, or plugins:

```yaml
volumes:
  db-data:
    driver: local
    driver_opts:
      type: "nfs"
      o: "addr=10.0.0.10,nolock,soft,rw"
      device: ":/exports/postgres"
```

Common scenarios:

* **local** (default): best baseline.
* **nfs/smb**: share across hosts (mind latency and file locking).
* Third-party plugins (e.g., cloud, SAN): for HA or managed storage.

---

## tmpfs mounts (ephemeral, memory-backed)

```yaml
services:
  cache:
    image: redis:7
    tmpfs:
      - /data
```

Great for sensitive temporary data or when you want extremely fast, non-persistent storage.

---

## Compose patterns & options

* **Read-only data mounts**
  `- db-data:/var/lib/postgresql/data:ro` for consumers that should not modify data (e.g., backup jobs).

* **Multiple targets**
  Mount the same volume in multiple containers; Docker handles concurrent readers/writers (application must ensure correctness).

* **Nocopy**
  Prevent automatic copying of existing container-dir contents into a new volume:

  ```yaml
  - type: volume
    source: db-data
    target: /var/lib/postgresql/data
    volume: { nocopy: true }
  ```

---

## Verifying persistence (quick test)

1. Start Postgres with a named volume.
2. Create a table/row.
3. Remove the **container** (not the volume): `docker compose rm -sf db`.
4. Recreate the service: `docker compose up -d db`.
5. Connect and confirm your data is still there.

---

## Security considerations

* **Least privilege**: run services as non-root users where possible (`user:` in Compose).
* **Backups**: encrypt archives and restrict access to backup locations.
* **Secrets/configs**: don’t bake credentials into volumes; use Docker secrets or environment variables managed by your platform.

---

## Troubleshooting checklist

* *Container can’t start / permission denied*
  Check UID/GID ownership on the volume path. Align with the image’s expected user.

* *Data lost after redeploy*
  Ensure you used a **named** or **external** volume, not only the container’s writable layer. Avoid `down --volumes` unless intentionally wiping data.

* *Slow database performance (macOS/Windows)*
  Switch from bind mounts to named volumes for the data directory.

* *SELinux conflicts (bind mounts)*
  Add `:z`/`:Z` to the mount or use a named volume.

---

## Practical templates

**Postgres with named volume + init scripts**

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./initdb:/docker-entrypoint-initdb.d:ro
volumes:
  db-data:
```

**MySQL with host backup directory**

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - mysql-data:/var/lib/mysql
      - ./backups:/backups
volumes:
  mysql-data:
```

---

## Clean-up and migrations

* **Rotate backups** and test restores regularly.
* For **migrations** between hosts: create a tarball from the volume, transfer it, and restore into a new volume.
* Use `labels` on volumes to track ownership and automate policies.

```bash
docker volume create --label project=myapp --name myapp-db
docker volume inspect myapp-db
```

---

## Key takeaways

* Use **named volumes** for production-grade persistence.
* Prefer bind mounts only when you need direct host access (dev, tooling).
* Manage **permissions**, especially for databases.
* Back up volumes explicitly; test restores.
* Avoid `down --volumes` unless you truly want to delete data.
