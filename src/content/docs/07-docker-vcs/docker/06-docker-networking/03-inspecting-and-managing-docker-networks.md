---
title: Inspecting and Managin Docker Networks
---

Docker offers powerful commands to inspect and modify networks.

### List Available Networks

```bash
docker network ls
```

This shows all existing networks, including default ones like `bridge`, `host`, and `none`.

### Inspect Network Configuration

```bash
docker network inspect <network-name>
```

Displays detailed information: connected containers, subnet, gateway, and driver.

### Create a Custom Bridge Network

```bash
docker network create my-bridge
```

Use this for better DNS support and isolation compared to the default bridge.

### Connect / Disconnect Containers

```bash
docker network connect my-bridge my-container

docker network disconnect my-bridge my-container
```

Useful for dynamically linking containers.
