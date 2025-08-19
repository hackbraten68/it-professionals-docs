---
title: Quick Introduction to Docker Persistent Data
---

## Introduction

Docker containers are designed to be **ephemeral**. This means that by default, any data stored inside a container is lost once the container is stopped, removed, or recreated. While this behavior is useful for stateless applications (e.g., APIs or frontends), it creates a challenge for applications that need to retain data, such as:

- **Databases** (PostgreSQL, MySQL, MongoDB)  
- **Content Management Systems** (WordPress, Drupal)  
- **File storage services**  

To solve this, Docker provides mechanisms for **persistent data storage**. In this lesson, you will learn:

- Why persistence is important in Docker  
- The difference between **volumes** and **bind mounts**  
- How to create and use persistent storage  
- Best practices for managing data in containers  

---

## Why Persistence is Important

Without persistent storage, any changes to data inside a container are lost when the container lifecycle ends. For example:

- If you run a PostgreSQL container without persistence and restart it, all database tables and records will be lost.  
- If you host a CMS like WordPress, uploaded media files disappear once the container is rebuilt.  

Persistence ensures that **application state and user data survive container restarts**.

---

## Storage Options in Docker

Docker provides two main ways to achieve persistence:

### 1. Volumes

- **Definition**: Managed by Docker itself and stored in a dedicated part of the host’s filesystem (usually `/var/lib/docker/volumes/`).
- **Advantages**:
  - Independent of the container lifecycle  
  - Can be easily shared between containers  
  - Optimized for Docker performance  
  - Portable across different hosts when combined with Docker backup/export tools  

**Example:**

```yaml
services:
  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

In this example, the `db-data` volume ensures the database files persist even if the `db` container is removed.

---

### 2. Bind Mounts

* **Definition**: Map a directory or file from the **host machine** directly into a container.
* **Advantages**:

  * Useful for development (sync code between host and container).
  * Easy to inspect and edit files directly on the host.
* **Disadvantages**:

  * Tightly coupled to the host’s filesystem.
  * Can introduce security risks if host paths are not carefully controlled.

**Example:**

```yaml
services:
  app:
    image: nginx
    volumes:
      - ./html:/usr/share/nginx/html
```

Here, the local `./html` folder is mounted into the container, allowing immediate reflection of changes in the host files.

---

## Creating and Using Persistent Storage

### Using Docker CLI

* Create a volume:

  ```bash
  docker volume create mydata
  ```

* Use the volume in a container:

  ```bash
  docker run -d -v mydata:/var/lib/mysql mysql
  ```

### Using Docker Compose

As shown in earlier examples, persistence is defined under the `volumes` key in the `docker-compose.yml` file.

---

## Best Practices for Managing Data in Containers

1. **Use named volumes for production**: They are easier to manage, migrate, and back up.
2. **Use bind mounts for development**: They allow fast iteration on code changes.
3. **Avoid storing data in the container’s writable layer**: It will be lost when the container is rebuilt.
4. **Regularly back up critical volumes**: Especially for databases and application data.
5. **Be mindful of permissions**: Ensure that containers have correct read/write access to mounted directories.

---

## Conclusion

Persistent data is a cornerstone of running stateful applications in Docker. By understanding and properly using **volumes** and **bind mounts**, you can ensure that critical application data survives container restarts and deployments.

This knowledge is fundamental when working with databases, file storage, or any application where data integrity and continuity matter.
