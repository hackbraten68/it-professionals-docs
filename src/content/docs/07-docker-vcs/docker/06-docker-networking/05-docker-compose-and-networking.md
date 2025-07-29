---
title: Docker Compose and Networking
---

Docker Compose simplifies multi-container setups and automatically creates a shared network for your services.

Benefits:

- Each service can refer to the other by its service name.
- All services are on the same project-specific network by default.
- You can override or define your own networks in the docker-compose.yml.

Example:

```yaml
services:
  backend:
    image: node
  frontend:
    image: nginx
```

In this case, `frontend` can reach `backend` via `backend:PORT`.

You can also define:

```yaml
networks:
  default:
    name: my-custom-network
```
