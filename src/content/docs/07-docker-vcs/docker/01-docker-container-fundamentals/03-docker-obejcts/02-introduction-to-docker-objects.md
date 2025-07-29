---
title: Introduction to Docker Objects
---

### What Is a “Docker Object”?

- Docker treats every resource (images, containers, networks, volumes, secrets) as an object with its own lifecycle and metadata.
- This uniform model simplifies management via the CLI or API.

### Core Object Types

1. **Image** – a read-only, versioned template (filesystem + metadata).
2. **Container** – a running (or stopped) instance of an Image, with isolated namespaces and cgroups.
3. **Volume** – a managed storage area, decoupled from container lifecycles.
4. **Network** – virtual networks for container communication, supporting isolation and discovery.
5. **Secrets & Configs** – encrypted or managed configuration data, only exposed to authorized services.
