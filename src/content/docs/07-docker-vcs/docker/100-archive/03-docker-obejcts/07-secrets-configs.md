---
title: Docker Images
---

### Why Not ENV Vars?

- Environment variables can leak in `docker inspect`.
    
- Secrets are encrypted at rest and only exposed to authorized services.
    

### Docker Swarm Secrets

```bash
# Create a secret
echo "SuperS3cretPwd" | docker secret create db_password -

# In docker-compose.yml (version: "3.7")
services:
  db:
    image: postgres:15
    secrets:
      - db_password
secrets:
  db_password:
    external: true
```

```bash
# List & inspect
docker secret ls
docker secret inspect db_password
docker secret rm db_password
```

### Docker Configs

- Similar to secrets but intended for non-sensitive config files (e.g. NGINX conf).

### Docker Compose (v3.5+)

```yaml
version: "3.7"
services:
  app:
    image: myapp
    secrets:
      - jwt_key
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf

secrets:
  jwt_key:
    file: ./jwt_key.pem

configs:
  nginx_conf:
    file: ./nginx.conf
```
