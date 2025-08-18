---
title: Docker Terminology
---

Understanding Docker requires familiarity with its core terminology. These terms form the foundation for working with containers, building applications, and deploying them at scale. Below is a detailed explanation of the most important Docker concepts.

---

## 1. Docker Images

- **Definition:**  
  A Docker Image is a **read-only template** that contains the instructions to create a Docker container. It includes everything needed to run an application: the code, runtime, libraries, environment variables, and configuration files.

- **Key Points:**
  - Images are built in layers (each command in the `Dockerfile` creates a new layer).
  - Images are **immutable**—once built, they cannot be changed, only replaced with new versions.
  - Images are usually tagged with names and versions, e.g. `nginx:latest` or `myapp:1.0`.

- **Example:**  
  Running `docker pull ubuntu:20.04` downloads the Ubuntu 20.04 image from Docker Hub.

---

## 2. Docker Containers

- **Definition:**  
  A container is a **runtime instance** of a Docker image. It is a lightweight, isolated environment that runs applications.

- **Key Points:**
  - Containers can be started, stopped, moved, and deleted.
  - They share the host OS kernel but remain isolated through **namespaces** and **cgroups**.
  - Containers are **ephemeral** by default; data inside them is lost if not persisted.

- **Example:**  
  Running `docker run -it ubuntu:20.04 bash` creates and runs a new Ubuntu container.

---

## 3. Docker Engine

- **Definition:**  
  The Docker Engine is the **client-server application** that enables Docker to run. It is the core component that builds, runs, and manages containers.

- **Components:**
  - **Docker Daemon (`dockerd`):** Handles container lifecycle, builds images, manages networks/volumes.
  - **Docker API:** REST API that the CLI and other tools use to communicate with the daemon.
  - **Docker CLI (`docker`):** Command-line tool that allows users to interact with Docker.

---

## 4. Dockerfile

- **Definition:**  
  A `Dockerfile` is a **text file** containing step-by-step instructions to build a Docker image.

- **Common Instructions:**
  - `FROM` – Base image to use.
  - `RUN` – Execute commands inside the image.
  - `COPY` / `ADD` – Add files into the image.
  - `CMD` / `ENTRYPOINT` – Define default container execution behavior.

- **Example:**

  ```dockerfile
  FROM node:18
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  CMD ["node", "server.js"]
  ```

---

## 5. Docker Registry

* **Definition:**
  A Docker Registry is a **storage and distribution system** for Docker images.

* **Types:**

  * **Public Registry:** Open to everyone, e.g. Docker Hub.
  * **Private Registry:** Hosted internally for organizational use, ensuring control and security.

* **Key Points:**

  * Registries store **repositories**, which group related images (e.g. `myapp:v1`, `myapp:v2`).
  * You can push (`docker push`) and pull (`docker pull`) images from registries.

---

## 6. Docker Volume

* **Definition:**
  A Docker Volume is a **persistent storage mechanism** used to save data generated and used by containers.

* **Key Points:**

  * Volumes are managed by Docker and stored outside the container filesystem.
  * They ensure that data survives container restarts or removals.
  * Volumes can be shared between multiple containers.

* **Example:**
  `docker volume create mydata`
  `docker run -v mydata:/app/data myimage`

---

## 7. Docker Network

* **Definition:**
  Docker Networks enable communication between containers and between containers and the outside world.

* **Network Drivers:**

  * **Bridge (default):** Standard local container-to-container communication.
  * **Host:** Shares the host’s networking stack.
  * **Overlay:** Enables multi-host communication, commonly used in Swarm.
  * **Macvlan:** Assigns MAC addresses directly for containers on the LAN.

* **Example:**
  `docker network create mynet`
  `docker run -d --network=mynet mycontainer`

---

## 8. Docker Compose

* **Definition:**
  Docker Compose is a tool for defining and running **multi-container applications** using a YAML configuration file (`docker-compose.yml`).

* **Key Features:**

  * Manage multiple services in one file.
  * Simplify environment setup with a single command (`docker-compose up`).
  * Supports networks, volumes, and scaling.

* **Example (`docker-compose.yml`):**

  ```yaml
  version: "3.9"
  services:
    web:
      image: nginx
      ports:
        - "80:80"
    db:
      image: postgres
      volumes:
        - dbdata:/var/lib/postgresql/data
  volumes:
    dbdata:
  ```

---

## 9. Docker Swarm

* **Definition:**
  Docker Swarm is Docker’s **native clustering and orchestration tool**. It allows running containers across multiple machines as if they were a single system.

* **Key Features:**

  * High availability with manager/worker nodes.
  * Load balancing and service discovery.
  * Rolling updates and scaling services.
  * Simpler compared to Kubernetes but with less advanced features.

* **Example:**
  `docker swarm init` – Initialize a swarm cluster.
  `docker service create --replicas 3 nginx` – Deploy 3 replicas of an Nginx service.

---

## Summary

* **Images**: Blueprints for containers.
* **Containers**: Running instances of images.
* **Engine**: The core Docker runtime.
* **Dockerfile**: Instructions for building images.
* **Registry**: Store and distribute images.
* **Volume**: Persistent data storage.
* **Network**: Communication between containers.
* **Compose**: Multi-container application management.
* **Swarm**: Clustering and orchestration across multiple hosts.

Together, these terms form the backbone of Docker knowledge, enabling developers and system administrators to build, ship, and run applications efficiently.
