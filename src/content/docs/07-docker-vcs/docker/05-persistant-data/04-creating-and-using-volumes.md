---
title: Creating and Using Volumes
---
Volumes are the preferred method for storing persistent data.

**Steps:**

1. Create a volume:

```bash
docker volume create myvolume
```

2. Use the volume in a container:

```bash
docker run -v myvolume:/app/data mycontainer
```

3. Inspect the volume:

```bash
docker volume inspect myvolume
```

**Use cases:**

- Storing database data (PostgreSQL, MySQL)

- Saving uploaded files

- Sharing files between multiple containers
