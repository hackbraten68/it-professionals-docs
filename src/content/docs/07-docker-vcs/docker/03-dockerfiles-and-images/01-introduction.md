---
title: Dockerfiles and Images – Introduction
---

Understand how **Dockerfiles** define container images and learn to **build**, **tag**, and **manage** images for reproducible deployments.

## Why It Matters

Dockerfiles provide a **declarative blueprint** to capture an application’s **environment, dependencies, and configurations**. This ensures:

- **Consistency** across development, testing, and production environments.  
- **Portability**, as images can run anywhere Docker is supported.  
- **Reproducibility**, since the same Dockerfile always produces the same result.  
- **Automation**, making application builds and deployments easier to manage.  

---

## 1. What is a Dockerfile?

A **Dockerfile** is a plain text file containing **instructions** that Docker uses to build an image step by step.  
Each instruction creates a **layer**, resulting in a layered image that is efficient to store and distribute.

Example:

```dockerfile
# Start from an official base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to start the app
CMD ["node", "server.js"]
```

### Key Characteristics

* **Declarative**: Describes the desired state of the image.
* **Layered**: Each instruction adds a new image layer, improving caching and efficiency.
* **Portable**: Can be built and run on different systems consistently.

---

## 2. What is an Image?

A **Docker image** is a **read-only, versioned snapshot** of an application and its dependencies.
It is built from a Dockerfile and can be used to run containers.

* **Base Image**: The starting point (e.g., `ubuntu:22.04`, `node:20-alpine`).
* **Derived Image**: Built on top of a base image, adding application-specific layers.
* **Immutable**: Once built, an image does not change. Updates create a new version/tag.

---

## 3. Building Images

To create an image from a Dockerfile, use:

```bash
docker build -t my-app:1.0 .
```

* `-t my-app:1.0`: Tags the image with a name and version.
* `.`: Context directory (where Dockerfile and app files are located).

---

## 4. Tagging Images

Tags help identify versions of an image:

```bash
docker tag my-app:1.0 myrepo/my-app:stable
```

* `my-app:1.0`: Local image.
* `myrepo/my-app:stable`: Repository and tag for publishing.

---

## 5. Managing Images

Common image management commands:

* **List local images**

  ```bash
  docker images
  ```

* **Remove an image**

  ```bash
  docker rmi my-app:1.0
  ```

* **Inspect image details**

  ```bash
  docker inspect my-app:1.0
  ```

* **View image history (layers)**

  ```bash
  docker history my-app:1.0
  ```

---

## 6. Best Practices for Dockerfiles & Images

* Use **small base images** (`alpine`, `slim`) to reduce size.
* Apply **multi-stage builds** to separate build tools from runtime.
* **Order instructions carefully** to maximize caching efficiency.
* Store **configuration in environment variables**, not hardcoded values.
* Regularly **update base images** to include security patches.

---

## 7. Summary

* **Dockerfiles** describe how to build images using declarative steps.
* **Images** are portable, immutable, and layered artifacts that ensure consistent deployments.
* Building, tagging, and managing images is essential for **reproducible deployments** in modern DevOps workflows.

---
