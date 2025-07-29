---
title: Docker Swarm
---
### Description

Docker Swarm is Docker’s native solution for orchestrating containers across a cluster of machines.

### Features

- Built-in with Docker
- Simple to get started
- Service discovery and load balancing
- Rolling updates and scaling

### Commands

```bash
docker swarm init
docker service create --replicas 3 --name web nginx
```

### When to Use

- You need clustering and scaling
- You want simpler orchestration than Kubernetes
