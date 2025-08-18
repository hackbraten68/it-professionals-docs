---
title: Docker Images
---

### Structure & Layers

- Images are built in layers; each Dockerfile instruction (e.g. `RUN`, `COPY`) creates a new layer.
- Layers are content-addressable and cached to speed up rebuilds.

### Dockerfile Best Practices

- **Order matters:** put frequently changing instructions (e.g. `COPY . .`) as late as possible.
- **Multi-stage builds:** produce smaller final artifacts by discarding build-only dependencies.

```dockerfile
# Multi-stage example
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Key Commands

```bash
# Build & tag
docker build -t myapp:1.0 .

# List & inspect
docker images
docker history myapp:1.0
docker inspect myapp:1.0

# Pull, push, remove
docker pull alpine:3.18
docker push myregistry.local/myapp:1.0
docker rmi myapp:1.0
```
