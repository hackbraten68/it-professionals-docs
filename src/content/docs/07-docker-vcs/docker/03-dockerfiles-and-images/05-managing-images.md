---
title: Managing Docker Images
---

## Introduction

Docker images are the **building blocks of containers**. They package application code, dependencies, and environment configuration into a single, portable artifact.  
Managing these images effectively is crucial for ensuring consistency, saving storage space, and enabling smooth deployments across different environments.

This guide explains how to list, tag, push, pull, and remove images, along with best practices for image lifecycle management.

---

## Listing Images

To see all images available locally:

```bash
docker images
```

* **Repository**: The image’s name (e.g., `nginx`).
* **Tag**: The version or label (e.g., `1.25`, `latest`).
* **Image ID**: A unique identifier for the image.
* **Created**: When the image was built.
* **Size**: Disk space the image consumes.

**Example output:**

```bash
REPOSITORY          TAG       IMAGE ID       CREATED        SIZE
nginx               latest    605c77e624dd   2 weeks ago    141MB
ubuntu              22.04     9873176a8ff5   3 months ago   77.8MB
```

---

## Tagging Images

Tags help version and organize images. By default, images are tagged as `latest` unless specified.

```bash
docker tag myapp:latest registry.example.com/myapp:v1.0
```

* `myapp:latest`: The local image name and tag.
* `registry.example.com/myapp:v1.0`: The new reference, which includes the registry address, repository name, and version tag.

**Why tagging matters:**

* Version control for deployments (`v1.0`, `v1.1`, etc.).
* Multiple environments (`dev`, `staging`, `prod`).
* Identifies where the image is stored (local vs remote registry).

---

## Pushing Images to a Registry

To share images, push them to a container registry (e.g., Docker Hub, GitHub Container Registry, AWS ECR).

```bash
docker push registry.example.com/myapp:v1.0
```

**Steps:**

1. Authenticate with the registry (`docker login registry.example.com`).
2. Tag the image with the registry path.
3. Push the image.

**Best Practices:**

* Use private registries for sensitive applications.
* Automate pushes in CI/CD pipelines.

---

## Pulling Images from a Registry

To download images from Docker Hub or another registry:

```bash
docker pull ubuntu:22.04
```

* If no tag is provided, Docker defaults to `latest`.
* Pulled images can be used immediately to start containers.

**Examples:**

* `docker pull nginx` → pulls the latest version.
* `docker pull postgres:15` → pulls PostgreSQL version 15.

---

## Removing Images

To free disk space or clean up unused versions:

```bash
docker rmi myapp:latest
```

* `rmi` stands for “remove image”.
* Use `-f` to force removal if an image is in use by stopped containers.
* Remove dangling (unused) images:

```bash
docker image prune
```

**Caution:**
Only remove images not required for running containers.

---

## Additional Useful Commands

* **Inspect image details:**

  ```bash
  docker inspect myapp:v1.0
  ```

  Shows metadata such as layers, environment variables, and architecture.

* **View image history (layers):**

  ```bash
  docker history myapp:v1.0
  ```

  Displays the commands used to build the image.

* **Clean up all unused images, containers, networks, and caches:**

  ```bash
  docker system prune
  ```

---

## Best Practices for Managing Images

1. **Use version tags** instead of `latest` for reproducibility.
2. **Keep images small** by choosing lightweight base images (e.g., `alpine`).
3. **Regularly prune unused images** to save disk space.
4. **Secure your registries** with authentication and TLS.
5. **Automate builds and pushes** in CI/CD for consistency.

---

## Summary

* **Listing** helps monitor what images are stored locally.
* **Tagging** organizes versions and registry destinations.
* **Pushing and pulling** enable sharing and deployment across environments.
* **Removing** images helps keep the system clean and efficient.
* **Best practices** ensure security, maintainability, and efficient use of resources.

By mastering these commands and practices, developers can manage Docker images effectively across the full software lifecycle.
