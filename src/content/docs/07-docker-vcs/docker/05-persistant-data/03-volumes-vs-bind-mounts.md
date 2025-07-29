---
title: Volumes vs. Bind Mounts
---
There are two main ways to persist data in Docker:

Volumes

- Managed by Docker

- Stored in Docker’s internal directory (e.g., `/var/lib/docker/volumes/`)

- Ideal for most use cases

- Can be backed up, listed, and inspected easily

**Example:**

```bash
docker volume create mydata
docker run -v mydata:/data myapp
```

Bind Mounts

- Link a host system directory to the container

- You control the exact location

- Useful for development (e.g., syncing source code)

- Less portable and more host-dependent

**Example:**

```bash
docker run -v /home/user/data:/data myapp
```
