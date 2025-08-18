---
title: Volumes, Bind Mounts & tmpfs
---

### Why Externalize Data?

- Containers are ephemeral; data in a stopped & removed container is lost unless persisted.

### Types of Mounts

|Type|Managed By|Scope|Use case|
|---|---|---|---|
|**Volume**|Docker|Named, reusable|Databases, shared state|
|**Bind**|Host OS|Host directory|Development: live code editing|
|**tmpfs**|Memory|Non-persisted|Caching, sensitive in-memory data|

```bash
# Named volume
docker volume create app-data
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v app-data:/var/lib/postgresql/data \
  postgres:15

# Bind mount
docker run -v $(pwd)/src:/usr/src/app -w /usr/src/app node:18 npm start

# tmpfs mount
docker run --tmpfs /cache:rw,size=100m my-builder
```

### Volume Commands

```bash
docker volume ls
docker volume inspect app-data
docker volume prune
docker volume rm app-data
```
