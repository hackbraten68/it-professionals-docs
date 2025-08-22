---
title: Advanced CLI Usage & Tips
---

## Introduction

While the Docker CLI is powerful even with its basic commands, advanced options allow you to fine-tune container performance, control resource consumption, optimize logging, and improve day-to-day usability.  
This section explores advanced CLI usage and tips that every developer and DevOps engineer should know.

---

## 1. Resource Constraints

By default, containers can consume as many host resources (CPU, RAM, file descriptors, etc.) as the kernel allows. To prevent resource exhaustion and ensure fair usage, Docker provides CLI options to impose **limits**.

### 1.1 Limit CPUs

Restrict a container’s CPU usage. The following example limits a container to **1.5 CPUs**:

```bash
docker run --cpus="1.5" ubuntu
```

* Useful in multi-tenant environments.
* Helps avoid “noisy neighbor” issues.
* Fractions allow proportional sharing of CPU cycles.

### 1.2 Limit Memory

Prevent a container from consuming unlimited memory. The following example limits a container to **512 MB**:

```bash
docker run -m 512m ubuntu
```

* Exceeding the memory limit causes the container to be killed (OOMKilled).
* Memory units: `b`, `k`, `m`, `g`.

### 1.3 Ulimits

Set Linux user limits (ulimits) for containers. For example, restricting the number of open files:

```bash
docker run --ulimit nofile=2048:4096 my-app
```

* **nofile=soft\:hard** → sets soft and hard limits.
* Prevents resource leaks and runaway processes.

---

## 2. Logging Drivers & Options

Containers generate logs, and Docker provides multiple **logging drivers** for storage and integration with external systems.

### 2.1 Specify a Logging Driver

Default is `json-file`. You can configure driver and options per container:

```bash
docker run \
  --log-driver=json-file \
  --log-opt max-size=10m \
  my-app
```

* `max-size=10m` ensures logs are rotated at 10 MB.
* `max-file=N` controls how many rotated files to keep.

### 2.2 Other Common Drivers

* **syslog** → integrates with system syslog.
* **journald** → integrates with systemd’s journal.
* **fluentd** → forwards logs to Fluentd for aggregation.
* **awslogs** → sends logs directly to AWS CloudWatch.
* **gelf**, **splunk**, **etwlogs** (Windows), and more.

Choosing the right driver ensures scalability and centralized monitoring.

---

## 3. Formatting & Filtering Output

When managing multiple containers, CLI output can become noisy. Docker supports **formatting** and **filtering** to extract only the data you need.

### 3.1 Go-template Formatting

Customize `docker ps` output using Go templates:

```bash
docker ps --format "{{.Names}}\t{{.Status}}"
```

Output example:

```bash
web-container   Up 10 minutes
db-container    Exited (0) 2 hours ago
```

This is very helpful for scripting and automation.

### 3.2 Filtering

Apply filters to narrow down results:

```bash
docker ps --filter "status=exited"
```

Other filter keys:

* `name=container_name`
* `id=container_id`
* `ancestor=image_name`
* `before` / `since`

---

## 4. Contexts & Profiles

When working with multiple Docker environments (local, remote, cloud), **contexts** help switch between them seamlessly.

### 4.1 List Contexts

```bash
docker context ls
```

Shows all available contexts with endpoints and status.

### 4.2 Switch Context

```bash
docker context use remote-docker
```

* Great for managing staging vs. production clusters.
* Avoids manually setting `DOCKER_HOST` environment variables.

### 4.3 Profiles (Compose Integration)

Profiles (in `docker-compose.yml`) allow selective service activation.
For example:

```yaml
services:
  db:
    image: postgres
  frontend:
    image: react-app
    profiles: ["dev"]
```

Run only frontend services:

```bash
docker compose --profile dev up
```

---

## 5. Shell Autocomplete & Aliases

Improving CLI efficiency saves time and reduces typing errors.

### 5.1 Enable Bash/Zsh Autocomplete

Docker includes autocompletion scripts:

```bash
source <(docker completion bash)
source <(docker completion zsh)
```

* Adds tab completion for commands, flags, and container names.
* Can be permanently enabled via `.bashrc` or `.zshrc`.

### 5.2 Common Aliases

Define short aliases for frequent commands:

```bash
alias dps='docker ps'
alias drmi='docker rmi'
alias dstop='docker stop $(docker ps -q)'
```

These shortcuts speed up repetitive tasks.

---

## Conclusion

Advanced Docker CLI usage provides better **control**, **visibility**, and **productivity**. By learning resource constraints, logging integrations, output customization, multi-context management, and CLI enhancements, developers can manage containers more effectively in both development and production environments.
