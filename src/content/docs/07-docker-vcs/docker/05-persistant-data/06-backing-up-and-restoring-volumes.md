---
title: Backing Up and Restoring Volumes
---
# Backing Up and Restoring Docker Volumes

A **Docker volume** holds persistent data for your containers. Backing it up regularly—and knowing how to restore it—protects you from data loss due to mistakes, upgrades, migrations, or host failures.

This guide gives you a clear, comprehensive, and practical playbook to **back up and restore volumes** in multiple ways, with examples for Linux/macOS and Windows, plus best practices and troubleshooting.

---

## Goals

* Understand strategies for backing up and restoring volumes
* Use `docker run` + `tar` to create and restore archive backups
* Verify backup integrity and test restores
* Handle special cases (databases, file permissions, SELinux, Docker Desktop)
* Automate, encrypt, and rotate backups

---

## Prerequisites & Concepts

* **Docker installed** and your user can run Docker commands.
* A **volume name** to back up (e.g., `myvolume`).
* The backup method here uses a **one‑off container** to read from the volume and write an archive to the host.
* Familiarity with:

  * `docker volume ls`, `docker volume inspect`
  * `tar` archives
  * Basic shell or PowerShell usage

---

## Quick Start: Portable `tar` Backup & Restore

### Backup (Archive a Volume)

```bash
docker run --rm \
  -v myvolume:/data:ro \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar czf /backup/backup-$(date +%F-%H%M%S).tar.gz -C /data .'
```

**What this does:**

* Mounts the **named volume** at `/data` (read‑only for safety).
* Mounts the **current directory** as `/backup` on the host.
* Creates a timestamped `tar.gz` of the **contents** of `/data` into the host’s current directory.

> Tip: Using `-C /data .` archives only the volume’s content (not the outer `/data` directory), which restores more cleanly.

### Restore (Extract Archive into a Volume)

```bash
# Stop the app container that uses the volume if data must be consistent
# docker stop <your-app-container>

docker run --rm \
  -v myvolume:/data \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar xzf /backup/backup-2025-08-19-103000.tar.gz -C /data'
```

**Notes:**

* Replace the filename with your actual backup.
* Restores **into** the volume. Existing files with the same names are **overwritten**; others remain. If you want a **clean** restore, create a fresh volume and restore into that (see below).

---

## Choosing a Strategy

### Cold vs. Hot Backups

* **Cold backup**: Stop containers that write to the volume (ideal for databases to ensure consistency).
* **Hot backup**: Back up while running. Fine for static content; risky for write‑heavy services.

### Logical vs. Snapshot

* **Logical backups** (e.g., `tar`, `pg_dump`) are portable and storage‑efficient, but take time to restore.
* **Filesystem snapshots** (ZFS, Btrfs, LVM) are fast and consistent, but tied to the host’s storage stack.

---

## Best‑Practice Patterns

### 1. Use a Fresh Volume for Clean Restores

```bash
docker volume create myvolume-restored

docker run --rm \
  -v myvolume-restored:/data \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar xzf /backup/backup-2025-08-19-103000.tar.gz -C /data'
```

Point your container to `myvolume-restored` to verify data before swapping over.

### 2. Verify Backups

Create a checksum after backup:

```bash
sha256sum backup-2025-08-19-103000.tar.gz > backup-2025-08-19-103000.tar.gz.sha256
```

Verify later:

```bash
sha256sum -c backup-2025-08-19-103000.tar.gz.sha256
```

### 3. Test Restores Regularly

Spin up a disposable container that mounts the **restored** volume and check files/app behavior before relying on the backup.

---

## Practical CLI Cookbook

### List Volumes & Inspect

```bash
docker volume ls
docker volume inspect myvolume
```

### Check Disk Usage

```bash
docker system df -v
```

### Exclude Temporary/Cache Files

```bash
docker run --rm \
  -v myvolume:/data:ro \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar --exclude="**/tmp/*" --exclude="**/cache/*" -czf /backup/backup.tar.gz -C /data .'
```

### Back Up Multiple Volumes (one archive each)

```bash
for v in vol_a vol_b vol_c; do
  docker run --rm \
    -v "$v":/data:ro \
    -v "$(pwd)":/backup \
    busybox \
    sh -c "tar czf /backup/${v}-$(date +%F-%H%M%S).tar.gz -C /data ."
done
```

### Include Metadata

You can **export labels** or notes in a sidecar JSON for auditing:

```bash
docker volume inspect myvolume > myvolume.inspect.json
```

Store it alongside the archive.

---

## Compose Projects: Backing Up Service Volumes

If your `docker-compose.yml` defines volumes:

```yaml
volumes:
  db-data:
```

Back up by **volume name** (Docker prefixes project names; check with `docker volume ls`):

```bash
docker volume ls | grep db-data
# e.g., projectname_db-data

docker run --rm \
  -v projectname_db-data:/data:ro \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar czf /backup/projectname_db-data-$(date +%F-%H%M%S).tar.gz -C /data .'
```

> For **databases**, prefer a **logical dump** (below) for consistency and portability.

---

## Databases: Do It Right

### Prefer Logical Dumps for Consistency

* **PostgreSQL**:

  ```bash
  docker exec -t my-postgres \
    pg_dump -U postgres -F c -d mydb > pgdump-$(date +%F-%H%M%S).dump
  ```

* **MySQL/MariaDB**:

  ```bash
  docker exec -t my-mysql \
    sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --databases mydb' \
    > mysqldump-$(date +%F-%H%M%S).sql
  ```

**Why?** Volume archives can capture **in-flight** states. Logical dumps ensure **transaction‑consistent** backups and are easier to migrate across versions.

### When Volume Archives Are OK

* If the database is **stopped** (cold backup), or
* The engine supports **online snapshot** and you know what you’re doing.

---

## Windows & macOS Notes

### Windows (PowerShell)

```powershell
docker run --rm `
  -v myvolume:/data:ro `
  -v ${PWD}:/backup `
  busybox `
  sh -c "tar czf /backup/backup-$([DateTime]::Now.ToString('yyyy-MM-dd-HHmmss')).tar.gz -C /data ."
```

**Docker Desktop + WSL2**:

* The `myvolume` data is inside the Linux VM; the technique above still works because the one‑off container runs inside that VM and writes the archive to your **bind mount** (`${PWD}`) which is shared.

### macOS

Use the same commands as Linux; quoting `$(pwd)` is recommended if paths contain spaces.

---

## Security & Compliance

* **Encrypt backups** at rest:

  ```bash
  # example using OpenSSL (for demos; consider age/gpg/Key Management Service for production)
  openssl enc -aes-256-cbc -salt -in backup.tar.gz -out backup.tar.gz.enc
  ```

* **Store offsite** (cloud bucket, remote server).
* **Protect keys** and restrict backup directories’ permissions.
* **Redact secrets** only if safe—remember your app may need them on restore.

---

## Automation & Rotation

### Cron (Linux/macOS)

Edit crontab:

```bash
crontab -e
```

Run daily at 02:30, keep last 14 backups:

```cron
30 2 * * * /usr/bin/env bash -lc '
set -euo pipefail
cd /srv/docker-backups
docker run --rm -v myvolume:/data:ro -v "$PWD":/backup busybox \
  sh -c "tar czf /backup/myvolume-$(date +%F-%H%M%S).tar.gz -C /data ."
ls -1t myvolume-*.tar.gz | tail -n +15 | xargs -r rm -f
'
```

### systemd Timer (Linux)

Use a service + timer for finer control and logging.

---

## Alternative Tools

### `rsync` (fast incremental file copy to host or remote)

```bash
docker run --rm \
  -v myvolume:/data:ro \
  -v "$(pwd)":/backup \
  instrumentisto/rsync-ssh \
  rsync -a /data/ /backup/snap/
```

### `restic` (deduplicated, encrypted backups)

Initialize once:

```bash
export RESTIC_REPOSITORY=/backup/repo
export RESTIC_PASSWORD=change-me
restic init
```

Backup:

```bash
docker run --rm \
  -e RESTIC_REPOSITORY=/backup/repo \
  -e RESTIC_PASSWORD=change-me \
  -v myvolume:/data:ro \
  -v "$(pwd)":/backup \
  restic/restic \
  backup /data
```

Restore:

```bash
docker run --rm \
  -e RESTIC_REPOSITORY=/backup/repo \
  -e RESTIC_PASSWORD=change-me \
  -v myvolume:/restore \
  -v "$(pwd)":/backup \
  restic/restic \
  restore latest --target /restore
```

---

## Handling Permissions, SELinux, and Rootless

* **Ownership**: `tar` preserves ownership by default. If restoring on a host with different user IDs, you might need to `chown` inside the container that uses the volume.
* **SELinux (Fedora/RHEL/CentOS)**: For bind mounts, `:z`/`:Z` labels may be required. For named volumes this is usually not needed.
* **Rootless Docker**: The approach still works; UIDs/GIDs are mapped in the user namespace. Verify file ownership from inside your app container.

---

## Troubleshooting

* **`permission denied`** when writing to `/backup`:
  Ensure the **host path** is writable and the container user has permissions (try `busybox` as root; or adjust mount options).
* **Archive contains `/data` folder** instead of just its contents:
  Use `-C /data .` when creating the archive.
* **Container still writing during backup**:
  Stop or quiesce the service, or switch to a logical backup strategy.
* **Large archives**:
  Consider `xz` compression (`tar cJf`) or deduplicating tools like `restic`. Balance CPU vs storage.
* **Wrong volume name** with Compose\*\*:\*\*
  Confirm the **project prefix** (`docker compose ls`, `docker volume ls`).

---

## Reference Scripts

### `backup-volume.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

VOL="${1:?Usage: $0 <volume-name> [dest-dir]}"
DEST="${2:-$(pwd)}"
STAMP="$(date +%F-%H%M%S)"
OUT="$DEST/${VOL}-${STAMP}.tar.gz"

docker run --rm \
  -v "${VOL}:/data:ro" \
  -v "${DEST}:/backup" \
  busybox \
  sh -c "tar czf /backup/$(basename "$OUT") -C /data ."

sha256sum "$OUT" > "${OUT}.sha256"
echo "Created: $OUT"
```

### `restore-volume.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

VOL="${1:?Usage: $0 <volume-name> <archive.tar.gz>}"
ARCHIVE="${2:?Usage: $0 <volume-name> <archive.tar.gz>}"

docker run --rm \
  -v "${VOL}:/data" \
  -v "$(dirname "$ARCHIVE"):/backup" \
  busybox \
  sh -c "tar xzf /backup/$(basename "$ARCHIVE") -C /data"

echo "Restored into volume: $VOL"
```

---

## Disaster‑Recovery Checklist

1. **Backups exist** and are **recent**.
2. **Checksums verified**.
3. **Restore tested** into a **fresh volume**.
4. **App starts** against restored data.
5. Backups are **encrypted** and **offsite**.
6. **Automation** in place (cron/timer), with **retention** policy.
7. Documented **runbooks** (who does what when things break).

---

## Summary

* Use `docker run` + `tar` for simple, portable backups of **named volumes**.
* For **databases**, prefer **logical dumps** (e.g., `pg_dump`) for consistent restores.
* Verify, encrypt, rotate, and **test restores**—regularly.
* Mind permissions, SELinux, and environment specifics (Docker Desktop/WSL2..
* For scale and deduplication, consider tools like **restic**.

With these patterns, you can confidently back up and restore Docker volumes in teaching environments and production alike.
