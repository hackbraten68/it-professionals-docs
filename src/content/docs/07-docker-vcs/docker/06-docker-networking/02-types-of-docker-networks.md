---
title: Types of Docker Networks
---

a) Bridge Network (Default)
Content:
The bridge network is the default network type when using Docker on a single host. When you start a container without specifying a network, Docker connects it to the bridge network.

Key characteristics:

NAT (Network Address Translation) is used to route traffic.

Each container gets its own IP on the virtual bridge.

You can link containers by name if they share a custom bridge.

Useful for simple multi-container setups on the same host.

✅ Use for: Small-scale local projects and development.

b) Host Network
Content:
With the host network driver, the container shares the same network stack as the Docker host. That means it uses the host’s IP address, and ports don’t need to be mapped explicitly.

Advantages:

No overhead of virtual networking or NAT.

Direct access to host’s interfaces.

Disadvantages:

No network isolation.

Port conflicts may occur.

✅ Use for: Performance-critical services or tools that need access to the host's network.

c) None Network
Content:
This option disables all networking for the container. It has no access to the outside world, nor can it talk to other containers or even localhost.

✅ Use for: Running isolated tasks, security testing, or background jobs that don't require networking.

d) Overlay Network
Content:
Overlay networks allow communication between containers on different Docker hosts (i.e., in a cluster). They work by creating a virtual network that spans multiple hosts.

How it works:

Requires Docker Swarm mode or an external KV store.

Encrypts container traffic across hosts.

Automatically assigns IP addresses to containers.

Built-in service discovery.

✅ Use for: Scalable, distributed systems, microservices, or service meshes.

e) Macvlan Network
Content:
Macvlan networks allow you to assign a MAC address to a container, making it appear like a physical device on the network.

Benefits:

Container gets an IP on the physical network.

Can be discovered by other physical devices (like printers, routers).

Drawbacks:

More complex setup.

Not supported on all platforms (especially Windows).

✅ Use for: IoT, legacy systems, or containers needing full network presence.
