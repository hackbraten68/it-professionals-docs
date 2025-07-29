---
title: Docker Containers
---

### What Is a Container?

- A live instance of an Image; runs in its own PID, network, IPC and mount namespaces.
- Ephemeral by default—state lives only inside the container unless externalized.

### Lifecycle & Management

```bash
# Create vs Run
docker create --name test-container alpine:3.18
docker start test-container

# One-step run (create + start)
docker run --name web -d -p 8080:80 nginx:latest

# Inspect & debug
docker ps -a
docker logs web
docker exec -it web /bin/sh
docker top web
docker stats web

# Stop, restart, remove
docker stop web
docker start web
docker rm web
docker prune containers
```

### Advanced Options

- **Resource limits:** `--memory`, `--cpus`
- **Entrypoint vs. CMD:** controlling runtime behavior
- **Healthchecks:** `HEALTHCHECK` in Dockerfile or `--health-*` flags
