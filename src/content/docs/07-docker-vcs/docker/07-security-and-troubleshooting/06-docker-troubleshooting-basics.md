---
title: Docker Troubleshooting Basics
---
# Docker Troubleshooting Basics

Docker simplifies application deployment, but like any complex system, issues can arise. Troubleshooting requires a systematic approach—checking logs, verifying configurations, and isolating problems step by step. This guide covers the most common troubleshooting scenarios and how to address them.

---

## 1. Container Won’t Start

One of the most frequent issues in Docker is a container that refuses to start. Causes may include configuration errors, image problems, or conflicts with the host system.

### Steps to Diagnose

* **Check Container Logs**

  ```bash
  docker logs <container-name-or-id>
  ```

  Logs often reveal missing dependencies, misconfigured environment variables, or runtime errors.

* **Verify Image Name and Tag**

  ```bash
  docker images
  docker run <image:tag>
  ```

  Ensure the correct image and version are being used. Using `latest` may not always point to the expected build.

* **Check for Port Conflicts**

  ```bash
  docker ps -a
  ```

  If a host port is already in use, the container will fail to start. For example:

  ```bash
  Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
  ```

  Solution: map to a different host port or free the port.

---

## 2. Resource Problems

Containers share the host’s CPU, memory, and storage. Without proper monitoring, resource limits may be exceeded, causing degraded performance or container crashes.

### Steps to Diagnose

* **Check Resource Usage**

  ```bash
  docker stats
  ```

  Displays real-time usage of CPU, memory, network, and block I/O for each container.

* **Apply Resource Limits**
  Set limits at container start:

  ```bash
  docker run --memory="512m" --cpus="1.5" <image>
  ```

  * `--memory`: Restricts maximum RAM.
  * `--cpus`: Restricts available CPU cores.

* **Inspect System Resources**
  Use host tools such as:

  * `top` or `htop` (Linux)
  * Task Manager (Windows)
  * Activity Monitor (macOS)

---

## 3. Network Issues

Containers often fail to communicate due to misconfigured networks, firewall rules, or DNS resolution problems.

### Steps to Diagnose

* **Inspect Network Settings**

  ```bash
  docker inspect <container>
  ```

  Look for the `Networks` section to verify assigned IPs and network modes.

* **Test Connectivity Inside the Container**

  ```bash
  docker exec -it <container> bash
  ping <other-container>
  curl http://<service>:<port>
  telnet <host> <port>
  ```

  Helps confirm if DNS, routing, or firewalls are blocking traffic.

* **Check Docker Networks**

  ```bash
  docker network ls
  docker network inspect <network-name>
  ```

  Ensure services are attached to the correct networks.

* **Firewall/Proxy Considerations**
  On some hosts, firewalls or proxies may block container traffic. Adjust rules or whitelist Docker’s network ranges.

---

## 4. Docker Daemon Issues

Sometimes the problem lies not with the container but with the Docker Engine (daemon) itself. If Docker cannot pull images, start containers, or respond to commands, the daemon may be failing.

### Steps to Diagnose

* **Check Docker Daemon Logs**

  ```bash
  journalctl -u docker
  ```

  On systemd-based systems, this provides detailed logs.

* **Restart the Docker Service**

  ```bash
  sudo systemctl restart docker
  ```

  On Windows/macOS (Docker Desktop), restart via the GUI.

* **Inspect Daemon Configuration**
  Check `/etc/docker/daemon.json` for misconfigurations such as invalid JSON syntax or unsupported options.

  ```bash
  cat /etc/docker/daemon.json
  ```

* **Verify Docker Version**

  ```bash
  docker version
  ```

  Outdated Docker versions may cause unexpected issues; upgrading often resolves bugs.

---

## 5. General Troubleshooting Tips

* **Check Docker Events**

  ```bash
  docker events
  ```

  Streams real-time Docker activity, useful for detecting errors as they happen.

* **Inspect System Logs**
  Look into `/var/log/syslog` or `/var/log/messages` for host-level errors affecting Docker.

* **Validate Configuration Files**
  Use JSON validators for `daemon.json` and YAML linters for `docker-compose.yml`.

* **Update Images**
  Pull the latest base images and rebuild:

  ```bash
  docker pull <image:tag>
  docker-compose build --no-cache
  ```

* **Run in Debug Mode**
  Start Docker with debug enabled:

  ```bash
  dockerd --debug
  ```

  Provides verbose logs for in-depth analysis.

---

## Summary

Troubleshooting Docker requires a structured workflow:

1. **Container won’t start** → Check logs, image name, and port conflicts.
2. **Resource problems** → Monitor with `docker stats`, apply memory/CPU limits.
3. **Network issues** → Inspect container networks, test connectivity with `ping`, `curl`, or `telnet`.
4. **Docker daemon issues** → Review daemon logs, restart the service, and validate configuration.
5. **General practices** → Check events, update images, and use debug mode when needed.

By following these steps, developers can quickly identify root causes and restore containerized applications to a healthy state.
