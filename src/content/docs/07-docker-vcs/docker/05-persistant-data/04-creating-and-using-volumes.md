---
title: Creating and Using Volumes
---
# Creating and Using Volumes

## Introduction

In Docker, containers are **ephemeral** by default—any data inside them is lost once the container is removed or recreated. To ensure that important data survives across container lifecycles, Docker provides **volumes**.
Volumes are the **preferred method for storing persistent data**, as they are fully managed by Docker, portable, and optimized for containerized environments.

---

## What Are Volumes?

A **volume** is a special storage mechanism managed by Docker. Unlike bind mounts, which map a host directory into a container, volumes are stored in Docker’s own storage area (commonly `/var/lib/docker/volumes/`).

**Key characteristics:**

* Managed entirely by Docker
* Can be easily created, listed, and removed with Docker CLI
* Portable and not tied to the host machine’s filesystem structure
* Work across different operating systems
* Useful for both single-container and multi-container setups

---

## Steps to Create and Use a Volume

### 1. Create a Volume

Use the following command to create a new volume:

```bash
docker volume create myvolume
```

* `myvolume` is the name of the volume.
* If no name is provided, Docker will generate a random one.
* The volume is now ready to be used by any container.

---

### 2. Use the Volume in a Container

Attach the volume when starting a container:

```bash
docker run -v myvolume:/app/data mycontainer
```

Explanation:

* `-v` specifies volume usage.
* `myvolume` is the volume name.
* `/app/data` is the path inside the container where the volume is mounted.
* Any data written to `/app/data` will persist, even if the container is removed.

---

### 3. Inspect the Volume

Check the details of the volume:

```bash
docker volume inspect myvolume
```

This provides metadata such as:

* Volume name
* Mountpoint on the host
* Creation time
* Driver used (default: `local`)

---

## Use Cases of Volumes

Volumes are widely used in production and development scenarios:

1. **Databases**

   * Storing data for PostgreSQL, MySQL, or MongoDB.
   * Ensures that database contents are not lost when the container restarts.

2. **File Uploads and Media**

   * Persisting user-uploaded files (e.g., images, documents).
   * Web apps can store media in volumes instead of inside the container filesystem.

3. **Shared Storage Between Containers**

   * Multiple containers can mount the same volume to share files.
   * Example: a web server container and an application container both accessing uploaded files.

4. **Backup and Restore**

   * Volumes can be backed up and restored easily using Docker CLI or third-party tools.

---

## Best Practices for Using Volumes

* Prefer volumes over bind mounts for portability and maintainability.
* Name your volumes clearly to reflect their purpose (`db-data`, `uploads`, etc.).
* Regularly back up volumes if they contain critical information.
* Use **docker-compose** for complex projects, where volumes can be defined and reused across services.

---

## Summary

* **Volumes** are the recommended way to persist data in Docker.
* They are created with `docker volume create`, used with `docker run -v`, and managed with commands like `docker volume inspect`.
* Use cases include databases, file uploads, shared container data, and backups.
* Following best practices ensures long-term reliability and portability of your containerized applications.
