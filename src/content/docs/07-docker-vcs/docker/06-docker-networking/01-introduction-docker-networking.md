---
title: Introduction to Docker Networking
---

Docker containers are designed to run in isolated environments. While this isolation is useful for security and process separation, most real-world applications require **network communication**—either between containers or with the outside world. Docker provides a flexible and powerful networking system that includes internal DNS, virtual switches, and multiple networking drivers to suit different use cases.

---

## Why Docker Networking Matters

Without networking, containers would be limited to working in complete isolation. Networking in Docker allows you to:

- **Connect containers to each other** (e.g., a web server container connecting to a database container).
- **Control traffic flow** within and outside the Docker host.
- **Isolate workloads** for security and environment separation.
- **Expose services to external users** or clients, making containers accessible.

---

## Docker Networking Basics

When Docker is installed, it sets up a few default network components:

1. **Virtual Ethernet Interfaces**  
   Docker creates virtual network interfaces to connect containers and the host system.

2. **Internal DNS System**  
   Docker provides automatic service discovery. Containers can resolve each other by **container name** when connected to the same user-defined network.

3. **Bridge Networks**  
   A private internal network that connects containers together on the same Docker host.

4. **Network Drivers**  
   Docker uses pluggable drivers to create and manage networks. Each driver has its own use case.

---

## Default Networks

By default, Docker sets up three networks:

- **bridge**  
  The default network for containers if no network is specified. Containers on the bridge network can communicate using IP addresses or assigned container names (in user-defined bridges).

- **none**  
  Containers are fully isolated with no network access. Useful for testing or strict isolation.

- **host**  
  The container shares the host’s networking stack. The container is not isolated from the host network.

You can list existing networks with:

```bash
docker network ls
```

---

## Networking Drivers

Docker provides several built-in network drivers:

1. **Bridge (default)**

   * Used for single-host container networking.
   * Suitable for simple web stacks or local development.
   * Containers communicate through an internal bridge and can be exposed with port mappings.

   **Example:**

   ```bash
   docker run -d --name web --network bridge -p 8080:80 nginx
   ```

2. **Host**

   * Removes the network isolation between container and host.
   * The container uses the host’s IP address directly.
   * Offers better performance but less isolation.

3. **None**

   * Completely disables networking.
   * Only useful for security testing or highly restricted environments.

4. **Overlay**

   * Connects containers across multiple Docker hosts using a distributed network.
   * Typically used with Docker Swarm or orchestration tools.
   * Enables multi-host communication securely.

5. **Macvlan**

   * Assigns containers their own MAC addresses, making them appear as physical devices on the network.
   * Useful for integration with existing network infrastructure.

6. **Third-party / Custom Drivers**

   * Developed by the community or vendors.
   * Provide advanced features such as encryption, SDN integration, or VPN-style connectivity.

---

## Creating Custom Networks

Creating your own network gives you more control:

```bash
docker network create mynetwork
```

Attach a container to the network:

```bash
docker run -d --name app --network mynetwork nginx
```

Inspect a network to see details:

```bash
docker network inspect mynetwork
```

---

## Service Discovery with Docker DNS

* Containers in the same user-defined network can communicate by **container name** instead of IP.
* Docker maintains an internal DNS system for name resolution.
* Example: A `web` container can connect to a `db` container by simply using `db` as the hostname.

---

## Exposing Services

To make a container’s service accessible outside the host:

```bash
docker run -d -p 8080:80 nginx
```

* `-p 8080:80` maps host port **8080** to container port **80**.
* Users can access the application via `http://localhost:8080`.

---

## Best Practices for Docker Networking

* **Use user-defined networks** instead of the default bridge for easier DNS-based service discovery.
* **Limit the use of host networking** unless performance is critical.
* **Isolate sensitive services** with custom networks.
* **Document port mappings** to avoid conflicts.
* **Monitor container traffic** when working in production.
* **Secure overlay networks** with encryption if spanning multiple hosts.

---

## Summary

Docker networking provides the foundation for communication between containers and external systems. By leveraging different **network drivers** and Docker’s internal DNS, you can design networks that are isolated, scalable, and secure.

Understanding these fundamentals is key to running real-world applications in Docker—whether it’s a simple local setup or a distributed multi-host environment.
