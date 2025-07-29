---
title: Environment Variables in Compose
---

You can use `.env` files or the `environment:` key in the YAML file to configure services.

**Example `.env` file:**

```typescript
POSTGRES_PASSWORD=securepass
```

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

This keeps secrets and configs separate from the code.
