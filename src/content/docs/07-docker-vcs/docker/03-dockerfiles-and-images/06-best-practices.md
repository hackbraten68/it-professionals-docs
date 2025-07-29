---
title: Best Practices
---

- **Minimize layers:** Combine related `RUN` commands with `&&`.

- **Use official, minimal base images:** e.g., `alpine`, `slim`.

- **Leverage multi-stage builds:** Separate build and runtime stages to reduce image size.

- **Order matters:** Place frequently changing instructions (e.g., `COPY src/`) near the bottom to cache the earlier layers.

- **Avoid secrets in Dockerfile:** Use build arguments (`ARG`) or external secret management.

- **Clean up after installs:** Remove package caches to shrink image.
