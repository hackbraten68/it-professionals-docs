---
title: Docker Layers
---
## Learning Objectives

By the end of this lesson, learners will be able to:

- **Explain** the concept of layers in Docker images.  
- **Describe** how layers are created during the build process.  
- **Understand** how Docker uses build cache and layer reuse to improve efficiency.  
- **Apply** best practices for optimizing layers in Dockerfiles.  
- **Inspect** and analyze layers in Docker images.  
- **Follow** a practical walkthrough of building and examining layered images.  

---

## 1. Introduction to Layers

- A **Docker image** is made up of a stack of **read-only layers**.  
- Each layer represents a set of filesystem changes (added/modified/deleted files).  
- When you build an image with a `Dockerfile`, each instruction (`FROM`, `RUN`, `COPY`, `ADD`) creates a new layer.  
- Containers are created from images by adding a final **read-write layer** on top of these immutable layers.  
- This design provides:
  - **Reusability**: layers can be shared across multiple images.  
  - **Efficiency**: changes only rebuild the affected layers.  
  - **Portability**: layers can be pushed/pulled to registries independently.  

---

## 2. How Layers Are Created

- Every **instruction** in a `Dockerfile` adds a new layer. Examples:
  - `FROM ubuntu:20.04` → base image layer.  
  - `RUN apt-get update && apt-get install -y curl` → adds software.  
  - `COPY . /app` → copies files into the image.  
- The build process is **layered**, meaning:
  - If one step changes, all subsequent layers are rebuilt.  
  - Unchanged layers are cached and reused.  
- Layers are **identified by SHA256 digests**.  

---

## 3. Build Cache & Layer Reuse

- Docker **caches intermediate layers** to speed up builds.  
- When building an image:
  - Docker checks if an identical layer (same instruction, same context) already exists.  
  - If yes → reuse it from cache.  
  - If no → build a new layer.  
- Example:  
  - If only one source file changes, only the `COPY` step and following layers are rebuilt.  
- Benefits:
  - **Faster builds**.  
  - **Reduced storage** (layers are stored once, even if used in multiple images).  
  - **Faster deployments** (registries only push/pull missing layers).  

---

## 4. Best Practices for Layer Optimization

- **Minimize the number of layers**:
  - Combine related commands with `&&` in a single `RUN`.  
- **Order instructions strategically**:
  - Place less frequently changing steps (e.g., installing dependencies) at the top.  
  - Place frequently changing steps (e.g., copying application code) at the bottom.  
- **Clean up unnecessary files**:
  - Example: remove package lists after installation (`apt-get clean && rm -rf /var/lib/apt/lists/*`).  
- **Use smaller base images**:
  - Alpine Linux instead of Ubuntu for lightweight images.  
- **Leverage multi-stage builds**:
  - Keep build tools in one stage, final runtime in a slim stage.  

---

## 5. Layer Inspection

- Tools and commands to analyze layers:
  - `docker history <image>` → shows layers, sizes, and instructions.  
  - `docker inspect <image>` → detailed JSON output, including layers’ digests.  
  - Third-party tools:
    - **Dive**: visualize layers, analyze image efficiency.  
    - **ctr images info <image>` (containerd).  
- Inspection helps identify:
  - Large or redundant layers.  
  - Opportunities for optimization.  

---

## 6. Example Walkthrough

**Step 1: Simple Dockerfile**

```dockerfile
FROM alpine:3.18
RUN apk add --no-cache curl
COPY app.sh /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh
CMD ["app.sh"]
```

**Step 2: Build the image**

```bash
docker build -t myapp:1.0 .
```

**Step 3: Inspect layers**

```bash
docker history myapp:1.0
```

*Output (example):*

```bash
IMAGE          CREATED BY                      SIZE
<sha>          /bin/sh -c chmod +x /usr...     0B
<sha>          /bin/sh -c #(nop) COPY...       1.2kB
<sha>          /bin/sh -c apk add --no-cache   5.4MB
<sha>          /bin/sh -c #(nop)  CMD...       0B
<sha>          alpine:3.18                     5.6MB
```

**Step 4: Modify `app.sh` and rebuild**

* Only the `COPY` and `chmod` layers (and above) are rebuilt.
* Earlier layers (Alpine base + curl installation) are reused from cache.

---

## 7. Further Reading & Resources

* **Official Documentation**: [Docker Image Layers](https://docs.docker.com/storage/storagedriver/#images-and-layers)
* **Best Practices**: [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
* **Tools**:

  * [Dive](https://github.com/wagoodman/dive) – layer inspection and optimization.
  * [Snyk](https://snyk.io/) – security scanning for layers.
* **Tutorials**:

  * Docker’s official “[Get Started](https://docs.docker.com/get-started/)” guide.
  * Community blogs on optimizing Docker builds.
