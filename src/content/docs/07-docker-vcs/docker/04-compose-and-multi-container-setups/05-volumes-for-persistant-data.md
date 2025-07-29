---
title: Volumes for Persistent Data
---

Use **volumes** to store data that should persist even if the container is removed.

```yaml
services:
  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

This avoids data loss during container rebuilds and is essential for stateful services like databases.
