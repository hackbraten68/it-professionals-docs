---
title: Practical Example - PostgreSQL with Volume
---

```bash
docker volume create pgdata

docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

This command:

- Creates a volume `pgdata`

- Starts a PostgreSQL container

- Mounts the volume to the database’s data directory

- Ensures data is not lost when the container is removed
