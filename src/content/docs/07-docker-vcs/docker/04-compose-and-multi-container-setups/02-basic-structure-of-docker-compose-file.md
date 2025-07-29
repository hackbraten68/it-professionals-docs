---
title: Basic Structure of a docker-compose.yml File
---

A typical `docker-compose.yml` file uses YAML syntax and includes definitions for services, networks, and volumes.

```yaml
version: '3.9'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  app:
    build: ./app
    depends_on:
      - db
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
```

**Explanation:**

- `services`: Defines your containers (web, app, db)

- `image`: The image to use from Docker Hub

- `build`: Specifies a build context for custom Dockerfiles

- `depends_on`: Ensures service startup order

- `ports`, `environment`: Configuration options passed to the container
