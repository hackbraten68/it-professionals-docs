---
title: Docker Objects
---
## Learning Objectives

By the end of this lesson, learners will be able to:

1. **Identify** and **describe** the core Docker objects: Images, Containers, Volumes, Networks, Secrets & Configs.  
2. **Build** and **optimize** Docker Images (including multi-stage builds and caching).  
3. **Run**, **manage** and **inspect** Containers, understanding namespaces and resource constraints.  
4. **Persist** and **share** data via Volumes, Bind mounts and tmpfs.  
5. **Configure** container Networking (bridge, host, overlay, macvlan) and DNS-based service discovery.  
6. **Securely** handle Secrets & Configs in Docker Swarm and Docker Compose.  

---

## 1. What Is a Docker Object?

- In Docker, **everything is treated as an object**: Images, Containers, Networks, Volumes, Secrets, Configs.  
- Each object has a **lifecycle** and **metadata** that can be inspected, modified, and managed.  
- The uniform model makes management via the CLI or API straightforward and consistent.  

---

## 2. Core Object Types

### **Images**

- Read-only, versioned templates containing a filesystem and metadata.  
- Built from Dockerfiles and organized in layers.  

### **Containers**

- A running (or stopped) instance of an image.  
- Uses **Linux namespaces** (PID, network, IPC, mount) for isolation.  
- Controlled via **cgroups** for CPU/memory constraints.  

### **Volumes**

- Managed storage, decoupled from container lifecycle.  
- Ensures data persists even if a container is removed.  

### **Networks**

- Provide communication channels between containers.  
- Support isolation, discovery, and multiple driver options.  

### **Secrets & Configs**

- Securely store sensitive or non-sensitive configuration data.  
- Exposed only to authorized services in Swarm or Compose.  

---

## 3. Images: Structure & Layers

- Built incrementally: each Dockerfile instruction (`RUN`, `COPY`, `ADD`) adds a **layer**.  
- Layers are cached and reused to optimize rebuilds.  
- Layers are **content-addressable** and immutable.  

### Best Practices

- **Order matters**: place frequently changing instructions (like `COPY . .`) at the bottom.  
- **Multi-stage builds** reduce size by discarding build-only dependencies.  

Example:

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
````

### Useful Commands

```bash
docker build -t myapp:1.0 .
docker images
docker history myapp:1.0
docker inspect myapp:1.0
docker pull alpine:3.18
docker push myregistry.local/myapp:1.0
docker rmi myapp:1.0
```

---

## 4. Containers

* **Ephemeral by default**: once removed, their data is lost unless persisted externally.
* Each container runs in its own isolated environment.

### Lifecycle Commands

```bash
docker create --name test alpine:3.18
docker start test
docker run --name web -d -p 8080:80 nginx:latest
docker ps -a
docker logs web
docker exec -it web /bin/sh
docker stop web
docker rm web
docker stats web
```

### Advanced Options

* **Resource limits**: `--memory`, `--cpus`.
* **Entrypoint vs CMD**: define container behavior.
* **Healthchecks**: monitor container health with `HEALTHCHECK`.

---

## 5. Persisting Data: Volumes & Mounts

Containers are temporary, but applications often require persistent storage.

### Types of Mounts

| Type       | Managed By | Scope           | Use Case                            |
| ---------- | ---------- | --------------- | ----------------------------------- |
| **Volume** | Docker     | Named, reusable | Databases, shared application data  |
| **Bind**   | Host OS    | Host directory  | Development (live code editing)     |
| **tmpfs**  | Memory     | Non-persistent  | In-memory caching or sensitive data |

Examples:

```bash
docker volume create app-data
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v app-data:/var/lib/postgresql/data \
  postgres:15

docker run -v $(pwd)/src:/usr/src/app -w /usr/src/app node:18 npm start
docker run --tmpfs /cache:rw,size=100m my-builder
```

### Volume Commands

```bash
docker volume ls
docker volume inspect app-data
docker volume prune
docker volume rm app-data
```

---

## 6. Networking

### Network Drivers

| Driver      | Scope       | Use Case                          |
| ----------- | ----------- | --------------------------------- |
| **bridge**  | Single host | Default; container isolation      |
| **host**    | Single host | Zero-overhead networking          |
| **overlay** | Multi-host  | Swarm or Kubernetes networks      |
| **macvlan** | Single host | Connect container directly to LAN |

Examples:

```bash
docker network create --driver bridge my-bridge
docker network inspect my-bridge
docker run -d --name backend --network my-bridge my-api
docker run -d --name frontend --network my-bridge nginx
docker network connect my-bridge some-container
```

### Service Discovery & DNS

* On user-defined networks, containers can resolve each other by **name**.
* Overlay networks extend this across multiple nodes in Swarm clusters.

---

## 7. Secrets & Configs

### Why Not Environment Variables?

* Environment variables can be leaked in `docker inspect`.
* Secrets are **encrypted at rest** and exposed only to authorized containers.

### Managing Secrets

```bash
echo "SuperS3cretPwd" | docker secret create db_password -
docker secret ls
docker secret inspect db_password
docker secret rm db_password
```

### Using in Docker Compose

```yaml
version: "3.7"
services:
  db:
    image: postgres:15
    secrets:
      - db_password
secrets:
  db_password:
    external: true
```

### Configs

* Store **non-sensitive** config files (e.g. NGINX configs).
* Mounted into containers at runtime.

---

## 8. Recap

* **Images**: Immutable templates.
* **Containers**: Running instances.
* **Volumes**: Persistent storage.
* **Networks**: Connectivity and isolation.
* **Secrets & Configs**: Secure or structured configuration management.

---

## 9. Next Steps

* Explore **Docker Compose** for multi-container applications.
* Learn **Docker Swarm** and **Kubernetes** for orchestration.
* Integrate **logging and monitoring** solutions like Prometheus or ELK.

---

## 10. Further Reading

* [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Docker Swarm](https://docs.docker.com/engine/swarm/)
