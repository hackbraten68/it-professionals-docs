---
title: Best Practices
---

- Use custom bridge networks for improved DNS resolution and container discovery.
- Avoid `--network host` unless you need raw performance or full access to host ports.
- Don’t expose every service to the outside—use internal-only networks for backend systems.
- Prefer Docker Compose for predictable and readable multi-container networking setups.
- Monitor networks using `docker network inspect` and logging tools like Wireshark (in bridge mode).
- Document your network architecture—especially in production.
