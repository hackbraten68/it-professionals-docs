---
title: Docker Networking
---

### Network Drivers

|Driver|Scope|Use Case|
|---|---|---|
|**bridge**|Single host|Default; simple container isolation|
|**host**|Single host|Zero-overhead networking|
|**overlay**|Multi-host|Swarm/Kubernetes service meshes|
|**macvlan**|Single host|Attach containers directly to LAN|

```bash
# Create & inspect
docker network create --driver bridge my-bridge
docker network inspect my-bridge

# Run on custom network
docker run -d --name backend --network my-bridge my-api
docker run -d --name frontend --network my-bridge nginx

# Connect/disconnect existing container
docker network connect my-bridge some-container
docker network disconnect bridge some-container
```

### Service Discovery & DNS

- User-defined networks provide built-in DNS: containers can reach each other by name.
- Overlay networks extend this across Swarm nodes.
