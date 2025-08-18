---
title: Interaction Patterns & Best Practices
---

**Objective:** Apply knowledge to design secure, performant, and maintainable setups.

**Content:**

- **Secure Access:**
  - Limit Unix socket permissions (`chmod 660 /var/run/docker.sock`).
  - Use TLS mutual auth for remote Docker APIs.

- **Resource Constraints:**
  - `--memory`, `--cpus`, `--cpuset-cpus`, `--pids-limit`.
  - Enforce quotas to prevent “noisy neighbor” effects.

- **Networking Strategies:**
  - **Bridge networks** for simple single-host.
  - **Overlay networks** for multi-host clusters.
  - **IPv6** support via custom driver configurations.

- **Storage & Performance:**
  - Choose the right storage driver (e.g. `overlay2` for stability).
  - Use **named volumes** or **bind mounts** for persistent data.

- **Scalability & Orchestration:**
  - Single-host: manual `docker-compose`.
  - Multi-host: **Docker Swarm** or **Kubernetes**, both of which talk to multiple daemons through their own orchestrator daemons.

**Checkpoint (Short Essay):**

> Explain how you would secure Docker Daemons in production, covering at least two techniques.
