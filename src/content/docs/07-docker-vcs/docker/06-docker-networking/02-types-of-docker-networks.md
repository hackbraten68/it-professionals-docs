---
title: Types of Docker Networks
---
# Types of Docker Networks

Docker provides multiple networking options to connect containers with each other and the outside world. Choosing the right type of network is essential for balancing **performance, isolation, and scalability** in containerized environments.

In this lesson, we will explore the five major Docker network types: **Bridge, Host, None, Overlay, and Macvlan**.

---

## 1. Bridge Network (Default)

The **bridge network** is the default type used when running containers on a single Docker host. If you start a container without explicitly specifying a network, Docker automatically connects it to the default `bridge`.

### Key Characteristics

* **NAT-based routing**: Containers communicate with the outside world using Network Address Translation (NAT).
* **Per-container IP addresses**: Each container gets its own private IP address on the virtual bridge.
* **Name-based linking**: On a custom bridge, containers can reach each other by name instead of IP.
* **Host-to-container communication**: Containers can expose ports to be accessed from the host.

### Example

```bash
docker network create mybridge
docker run -d --name app1 --network mybridge nginx
docker run -d --name app2 --network mybridge alpine ping app1
```

### When to Use

✅ Best suited for **small-scale local projects**, development environments, and simple multi-container setups on the same host.

---

## 2. Host Network

With the **host network driver**, the container shares the same **network stack** as the Docker host. In this case, the container uses the host’s IP address, and you don’t need to map ports.

### Advantages

* **No virtualization overhead**: Faster networking, as no NAT or virtual bridges are used.
* **Direct access**: Containers can use the host’s interfaces directly.

### Disadvantages

* **No isolation**: Containers share the same network namespace with the host.
* **Port conflicts**: Multiple containers cannot bind to the same port.

### Example

```bash
docker run -d --network host nginx
```

Here, the containerized Nginx server listens directly on the host’s network interface.

### When to Use

✅ Recommended for **performance-critical services** or applications/tools that need full access to the host’s network.

---

## 3. None Network

The **none network** disables all networking for a container. It has no access to the internet, other containers, or even the host’s localhost.

### Characteristics

* Container is completely isolated from any network.
* Only internal processes run without network connectivity.

### Example

```bash
docker run -d --network none alpine sleep 1000
```

### When to Use

✅ Suitable for:

* Running **isolated tasks**
* **Security testing**
* Background jobs that do not require networking

---

## 4. Overlay Network

The **overlay network** enables communication between containers running on different Docker hosts. This is typically used in **clustered environments** (e.g., Docker Swarm or Kubernetes).

### How It Works

* Requires **Docker Swarm mode** or an external key-value store (e.g., etcd, Consul).
* Creates a **virtual network** spanning multiple hosts.
* Provides **built-in encryption** for traffic between nodes.
* Supports **automatic IP assignment** and **service discovery**.

### Example

```bash
docker swarm init
docker network create -d overlay myoverlay
docker service create --name web --network myoverlay nginx
```

### When to Use

✅ Ideal for **scalable, distributed systems**, **microservices architectures**, and **service meshes**.

---

## 5. Macvlan Network

The **macvlan network** allows assigning a unique **MAC address** to a container, making it appear as a physical device on the local network.

### Benefits

* Each container receives its **own IP address** directly from the physical network.
* Containers can be **discovered by other devices** (routers, printers, IoT hardware).
* Enables integration with **legacy systems** that expect real devices.

### Drawbacks

* More complex configuration compared to other network types.
* Not supported on all platforms (especially limited on **Windows**).

### Example

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 mymacvlan
```

### When to Use

✅ Best for **IoT**, **legacy applications**, or scenarios where containers must appear as **first-class citizens** on the physical network.

---

# Summary Table

| Network Type | Isolation | Performance  | Multi-Host Support | Typical Use Case                |
| ------------ | --------- | ------------ | ------------------ | ------------------------------- |
| **Bridge**   | Medium    | NAT overhead | No                 | Local dev, small projects       |
| **Host**     | Low       | High         | No                 | Performance-critical services   |
| **None**     | Full      | N/A          | No                 | Isolated tasks, testing         |
| **Overlay**  | High      | Moderate     | Yes                | Distributed apps, microservices |
| **Macvlan**  | Low       | High         | Limited            | IoT, legacy systems             |

---

# Key Takeaways

* **Bridge** is the go-to choice for local and simple setups.
* **Host** provides raw performance but sacrifices isolation.
* **None** offers complete network isolation for special cases.
* **Overlay** enables communication across multiple hosts in distributed systems.
* **Macvlan** makes containers act like physical devices on the same network.
