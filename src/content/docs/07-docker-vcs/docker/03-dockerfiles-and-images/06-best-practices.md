---
title: Best Practices for Dockerfiles and Images
---

## Introduction

Dockerfiles define how container images are built. Writing efficient and secure Dockerfiles is critical for performance, maintainability, and security. Following best practices ensures smaller, faster, and more reproducible images that work reliably across environments.

---

## 1. Minimize Layers

- **Explanation:**  
  Each Dockerfile instruction (`RUN`, `COPY`, `ADD`) creates a new image layer. Too many layers can lead to bloated images and slower builds.
  
- **Best Practice:**  
  Combine related `RUN` commands using `&&` and clean up temporary files in the same instruction.
  
- **Example:**

  ```dockerfile
  # Bad: creates multiple layers
  RUN apt-get update
  RUN apt-get install -y curl
  RUN apt-get install -y git

  # Good: single layer, cleaned up
  RUN apt-get update && \
      apt-get install -y curl git && \
      rm -rf /var/lib/apt/lists/*
    ```

---

## 2. Use Official and Minimal Base Images

* **Explanation:**
  Base images are starting points for your containers. Large or unverified images can introduce vulnerabilities and increase image size.

* **Best Practice:**

  * Prefer **official images** from Docker Hub or trusted registries.
  * Choose **lightweight variants** like `alpine`, `slim`, or `buster-slim` to reduce footprint.

* **Example:**

  ```dockerfile
  # Heavy base
  FROM ubuntu:22.04

  # Lighter base
  FROM python:3.11-slim
  ```

---

## 3. Leverage Multi-Stage Builds

* **Explanation:**
  Multi-stage builds allow you to separate build dependencies (e.g., compilers, libraries) from the final runtime image. This results in much smaller images.

* **Best Practice:**
  Use a builder stage for compilation and a lightweight runtime stage for deployment.

* **Example:**

  ```dockerfile
  # Build stage
  FROM golang:1.22 AS builder
  WORKDIR /app
  COPY . .
  RUN go build -o myapp

  # Runtime stage
  FROM alpine:3.20
  WORKDIR /app
  COPY --from=builder /app/myapp .
  CMD ["./myapp"]
  ```

---

## 4. Order Matters (Layer Caching)

* **Explanation:**
  Docker builds use **layer caching**. If an earlier instruction hasn’t changed, it will be reused. Frequently changing instructions should be placed **later** to maximize caching efficiency.

* **Best Practice:**
  Place static, rarely changing instructions (e.g., installing system dependencies) at the top. Place volatile instructions (e.g., `COPY src/`) near the bottom.

* **Example:**

  ```dockerfile
  # Install dependencies first (rarely changes)
  RUN pip install -r requirements.txt

  # Application code changes often
  COPY src/ /app/src
  ```

---

## 5. Avoid Secrets in Dockerfiles

* **Explanation:**
  Hardcoding credentials, tokens, or keys in Dockerfiles or images is insecure. Anyone with the image can extract secrets.

* **Best Practice:**

  * Use **build arguments (`ARG`)** for non-sensitive variables.
  * Use **environment variables** injected at runtime.
  * For sensitive data, rely on **secret management systems** (e.g., Docker secrets, HashiCorp Vault, AWS Secrets Manager).

* **Bad Example (DO NOT DO THIS):**

  ```dockerfile
  ENV DB_PASSWORD=mysecretpassword
  ```

* **Better Example:**

  ```dockerfile
  ARG APP_ENV
  ENV APP_ENV=$APP_ENV
  ```

---

## 6. Clean Up After Installs

* **Explanation:**
  Temporary files, caches, and build artifacts can unnecessarily increase image size.

* **Best Practice:**
  Always remove package lists, caches, and temporary files in the same `RUN` command.

* **Example:**

  ```dockerfile
  RUN apt-get update && \
      apt-get install -y build-essential && \
      make myapp && \
      apt-get remove -y build-essential && \
      rm -rf /var/lib/apt/lists/*
  ```

---

## 7. Additional Recommendations

* **Use `.dockerignore`:**
  Prevent unnecessary files (logs, local configs, `.git`) from being copied into the image.

* **Pin Versions:**
  Use specific image and package versions (`python:3.11.6-slim`) for reproducibility.

* **Security Scanning:**
  Regularly scan images for vulnerabilities with tools like `trivy` or `docker scan`.

* **Non-Root User:**
  Avoid running processes as `root` inside containers.

  ```dockerfile
  RUN useradd -m appuser
  USER appuser
  ```

---

## Conclusion

Applying these best practices ensures Docker images are:

* **Smaller and faster to build**
* **Secure and maintainable**
* **Easier to reproduce and deploy**

A well-written Dockerfile is the foundation for reliable containerized applications in production.
