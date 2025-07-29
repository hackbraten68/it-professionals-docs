---
title: Networks and Communication
---

By default, all services in the same Compose file are placed on a shared **network** and can talk to each other using the **service name** as hostname.

**Example:**  
If the backend connects to the database at `db:5432`, the `db` is automatically resolved within the network.

```yaml
services:
  api:
    build: ./api
    depends_on:
      - db
  db:
    image: postgres
```

In the API code, the DB connection string might look like:  
`postgres://user:password@db:5432/mydb`
