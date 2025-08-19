---
title: Troubleshooting with Docker Commands
---
# Troubleshooting with Docker Commands

When working with Docker, issues such as containers not starting, applications failing, or network misconfigurations can occur. To troubleshoot these problems effectively, Docker provides a set of essential commands. These commands help developers inspect, monitor, and interact with containers and their environments.

This guide explains the most important troubleshooting commands, their usage, and practical examples.

---

## 1. Checking Running Containers with `docker ps`

The first step in troubleshooting is to identify which containers are currently running.

```bash
docker ps
```

### Key Options:

* `-a` – Shows all containers, including those that have exited.
* `--format` – Allows customizing the output (e.g., display only container ID and name).

### Use Cases:

* Verify if the expected container is running.
* Detect containers that may have stopped unexpectedly.
* Quickly identify container IDs for further debugging.

---

## 2. Viewing Container Logs with `docker logs`

Logs are often the quickest way to diagnose issues with a container.

```bash
docker logs <container-id-or-name>
```

### Key Options:

* `-f` – Follow logs in real-time.
* `--tail N` – Show only the last N log lines.
* `-t` – Display timestamps with log entries.

### Use Cases:

* Debugging application errors by reviewing `stdout` and `stderr`.
* Tracking startup issues when a container fails immediately.
* Monitoring long-running containers for anomalies.

---

## 3. Executing Commands in Containers with `docker exec`

Sometimes troubleshooting requires direct interaction with a container’s environment.

```bash
docker exec -it <container-id-or-name> <command>
```

### Examples:

* Start a shell session:

  ```bash
  docker exec -it myapp-container /bin/bash
  ```
* Check configuration files:

  ```bash
  docker exec -it myapp-container cat /etc/config.conf
  ```

### Use Cases:

* Inspecting runtime environment variables or file systems.
* Running diagnostic tools (e.g., `ping`, `curl`) inside the container.
* Restarting processes without stopping the container.

---

## 4. Inspecting Containers with `docker inspect`

The `docker inspect` command provides detailed, low-level information about a container or image in JSON format.

```bash
docker inspect <container-id-or-name>
```

### Key Information Available:

* Network settings (IP address, ports).
* Mount points and volumes.
* Environment variables.
* Restart policies and runtime configurations.

### Use Cases:

* Verify container networking details when services cannot connect.
* Confirm mounted volumes are correctly configured.
* Audit resource allocation (CPU, memory).

---

## 5. Monitoring Events with `docker events`

For real-time monitoring of Docker’s internal activity, use the events stream.

```bash
docker events
```

### Key Features:

* Displays events such as container start/stop, network creation, or image pulls.
* Supports filtering by container, image, or event type.

```bash
docker events --filter 'container=myapp-container'
```

### Use Cases:

* Identify why containers restart unexpectedly.
* Track network-related events during debugging.
* Monitor system-wide Docker activity for anomalies.

---

## 6. Analyzing Networks with `docker network ls` and `docker network inspect`

Networking is often the root cause of connectivity issues between containers or between containers and external systems.

### List Networks:

```bash
docker network ls
```

Shows all available networks, including `bridge`, `host`, and user-defined networks.

### Inspect Networks:

```bash
docker network inspect <network-name>
```

Reveals detailed information about connected containers, subnet, gateway, and DNS settings.

### Use Cases:

* Validate that containers are attached to the correct network.
* Confirm that service discovery (via DNS) works properly.
* Debug situations where two containers cannot communicate.

---

# Conclusion

Effective troubleshooting in Docker relies on knowing how to use its built-in commands.

* **`docker ps`** helps confirm which containers are running.
* **`docker logs`** provides insight into application-level problems.
* **`docker exec`** allows interactive investigation inside containers.
* **`docker inspect`** reveals detailed metadata and configurations.
* **`docker events`** enables real-time monitoring of Docker’s behavior.
* **`docker network ls/inspect`** supports debugging network issues.

By combining these tools, developers can systematically diagnose and resolve most container-related problems.
