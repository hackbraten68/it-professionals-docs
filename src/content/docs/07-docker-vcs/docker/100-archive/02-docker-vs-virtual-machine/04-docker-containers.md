---
title: Docker Containers
---
### Architecture

```bash
┌───────────────────────────┐
│     Physical Host         │
│   ─────────────────────   │
│    Host OS + Kernel       │
│   ─────────────────────   │
│    Docker Engine (daemon) │
│    ─────────────────      │
│  ● Container A            │
│     (App + libs + bins)   │
│  ● Container B            │
│     (App + libs + bins)   │
└───────────────────────────┘
```

### How It Works

1. Docker daemon uses **namespaces** (PID, network, mount) & **cgroups** for resource limits.
2. Containers share the host kernel; each one packages only app + dependencies.
3. Images are built in layers—only changed layers are shipped, cached, and reused.

### Pros & Cons

|**Pros**|**Cons**|
|---|---|
|✔️ Starts in <1 second|🔐 Weaker isolation (shared kernel)|
|✔️ Lightweight—minimal overhead|🐧 Host kernel must be compatible (Linux only)|
|✔️ Portable images via Docker Hub/Registry|⚙️ Security depends on correct configuration|
|✔️ Layered images speed CI/CD pipelines|🔄 No full OS abstraction (cannot run Windows on Linux host)|
