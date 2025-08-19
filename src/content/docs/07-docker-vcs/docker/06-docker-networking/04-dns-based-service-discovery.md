---
title: DNS-Based Service Discovery
---
# DNS-Based Service Discovery in Docker

## 1. Introduction

In modern containerized environments, applications often consist of multiple services that must communicate with each other. Hard-coding IP addresses for these services is unreliable, since container IPs can change when containers restart or scale.
To solve this, **Docker provides DNS-based service discovery**. Containers in the same user-defined network can automatically resolve each other by their **container name** or **service name**.

This feature is especially powerful when building **microservices** or **distributed systems**, where dynamic scaling and service discovery are essential.

---

## 2. How Docker’s Internal DNS Works

Docker runs an internal DNS server that automatically manages name resolution for containers.

* **Scope**: The DNS-based discovery works only within a **user-defined bridge** or **overlay network**.
* **Mechanism**: When a container starts, Docker registers its name and network alias in the internal DNS.
* **Resolution**: Other containers on the same network can reach it simply by using that name instead of an IP.

> **Note**: Default `bridge` networks created automatically by Docker do **not** provide this DNS-based name resolution. You must use a **custom bridge network** or an **overlay network**.

---

## 3. Example: Containers Communicating by Name

### Step 1: Create a Custom Network

```bash
docker network create mynetwork
```

### Step 2: Run a Database Container

```bash
docker run -d --name db --network mynetwork postgres
```

### Step 3: Run a Web Application Container

```bash
docker run -d --name web --network mynetwork nginx
```

### Step 4: Test Communication

From inside the `web` container, you can connect to the database using the **name `db`**:

```bash
ping db
```

Docker’s DNS will resolve `db` to the correct IP address of the database container.

---

## 4. Benefits of DNS-Based Service Discovery

* **No Hard-coded IPs**: Services can be reached by name instead of fragile IP addresses.
* **Dynamic Scaling**: New containers of the same service can join and be reachable without configuration changes.
* **Simplified Configuration**: Application configuration files can reference services by their names.
* **Microservices Friendly**: Ideal for service-oriented architectures where components must discover each other dynamically.

---

## 5. Use Cases in Real-World Scenarios

1. **Microservices Applications**

   * A `frontend` service communicates with an `api` service simply using `http://api:5000`.
   * No manual IP management is needed, even when scaling `api` to multiple containers.

2. **Docker Compose Projects**

   * In Compose, all services are on the same network by default.
   * The Compose service name (e.g., `db`) is automatically resolvable by other services.

3. **Swarm / Kubernetes Style Scaling**

   * Overlay networks extend DNS-based discovery across multiple hosts.
   * Containers (tasks) from different nodes can resolve each other using service names.

---

## 6. DNS Aliases and Custom Hostnames

Docker also supports custom DNS aliases and hostnames:

* **Network Alias**

  ```bash
  docker run -d --name cache --network mynetwork --network-alias redis redis
  ```

  Here, the container can be reached by both `cache` and `redis`.

* **Custom Hostnames**
  With `--hostname`, you can define how a container identifies itself internally.

---

## 7. Limitations and Considerations

* Works **only within the same Docker network**. Containers on different networks cannot resolve each other by name unless explicitly connected.
* The default `bridge` network does not support DNS-based discovery. Use a **custom bridge** or **overlay**.
* Load balancing across multiple containers with the same alias is limited in plain Docker; Swarm or Kubernetes adds more advanced service discovery.
* For external communication, you may still need traditional DNS records or reverse proxies.

---

## 8. Summary

DNS-based service discovery in Docker is a **built-in mechanism** that makes container communication simple and robust.

* Containers in the same **custom network** can resolve each other by **name**.
* This avoids hard-coding IPs and supports **dynamic scaling**.
* Widely used in **microservices architectures**, Docker Compose setups, and distributed environments.

In short: **Service names become the stable way to connect applications in a containerized world.**
