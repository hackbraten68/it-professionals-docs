---
title: Docker Compose for Multi-Container Apps
---
### Description

`docker-compose` simplifies deploying applications that consist of multiple services, such as frontend, backend, and databases.

### Benefits

- Define services in one docker-compose.yml
- Consistent environments
- Can be used in both dev and prod

### Example

```yaml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
  redis:
    image: redis
```

### Deploy with

```bash
docker-compose up -d
```
