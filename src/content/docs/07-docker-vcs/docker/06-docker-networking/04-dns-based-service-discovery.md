---
title: DNS-Based Service Discovery
---

When containers are on the same custom bridge or overlay network, Docker provides automatic name resolution.

Example:

- You launch two containers: web and db.
- As long as both are on the same custom network, web can reach db using just the name db.
- This eliminates the need to hard-code IPs and is vital for building microservices and systems with dynamic scaling.
