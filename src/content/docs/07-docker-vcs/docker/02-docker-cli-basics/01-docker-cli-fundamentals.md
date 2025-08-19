---
title: Docker CLI Fundamentals
---
## Part 1 — What *is* a CLI?

### 1. Definition

A **Command-Line Interface (CLI)** is a text-based interface for interacting with software or an operating system by typing commands. Instead of clicking buttons, you enter instructions (commands) that the computer parses and executes.

- **Terminal/Console:** The program window that shows a prompt (e.g., `bash`, `zsh`, Windows Terminal).
- **Shell:** The command interpreter (e.g., `bash`, `zsh`, `fish`, `PowerShell`) that reads your input and runs programs.
- **Programs/Utilities:** Executables you call from the shell (e.g., `ls`, `git`, `docker`).

### 2. Why use a CLI?

- **Precision & Automation:** Scriptable, repeatable workflows; easy to automate with shell scripts and CI/CD.
- **Speed & Resource Use:** Fast and lightweight; ideal for remote servers and headless environments.
- **Composability:** You can “pipe” outputs of one command into another for powerful data flows.

### 3. How a CLI call is structured

```bash
<program> <subcommand> \[options/flags] \[positional-arguments]
```

- **Options/Flags:** Often begin with `-` (short) or `--` (long), e.g., `-f`, `--help`.
- **Positional args:** Ordered inputs (e.g., path, container name).
- **Exit Codes:** `0` means success; non-zero indicates an error (useful in scripting).
- **Std Streams:** `stdin` (input), `stdout` (normal output), `stderr` (errors).
- **Environment Variables:** Key-value pairs available to processes (e.g., `PATH`, `HOME`).

### 4. Core skills

- **Navigation & Files:** `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`.
- **Help & Docs:** `<program> --help`, `man <program>`, official docs.
- **Pipelines & Redirection:** `cmd1 | cmd2`, `>`, `>>`, `2>`, `2>&1`.
- **Permissions & sudo:** `sudo` runs a command with elevated privileges (Linux/macOS).
- **Safety Tips:** Tab-complete; double-check destructive operations; use `--dry-run` if available.

---

## Part 2 — The Docker CLI (the `docker` client)

### 1. What it is

The **Docker CLI** (`docker`) is the primary interface to the **Docker daemon** (`dockerd`). The CLI sends requests (via a local Unix socket or TCP) to the daemon, which performs actions like pulling images, building, and running containers.

- **Client–Server Model:** `docker` (client) → API call → `dockerd` (server).
- **Context & Host:** You can target different Docker endpoints using **contexts** (`docker context ls/use`), useful for remote hosts.
- **Authentication:** `docker login` lets you authenticate to registries (Docker Hub or private).

> Tip: On Linux, if your user is **not** in the `docker` group, prefix Docker commands with `sudo`. Alternatively, add your user to the `docker` group for password-less use (be aware of the security implications).

### 2. Command shape

```bash
docker <command> \[subcommand] \[options] \[args]
```

Common global patterns:

- `docker --help` and `docker <command> --help` for usage.
- `--format '{{json .}}'` to output JSON-like structures for scripting.
- `--log-level debug` to increase verbosity for troubleshooting.

### 3. Image discovery: `docker search`

Use `docker search` to find images on Docker Hub (or configured default registry).

**Examples**

- Basic:
```bash
docker search nginx
```

- Filter for “official” images:

```bash
docker search --filter=is-official=true nginx
```

- Minimum stars:

```bash
docker search --filter=stars=100 --no-trunc postgres
```

**Notes**

- Shows name, description, stars, official/verified labels.
- Discovery on private registries may be limited or require web UI/API instead.

### 4. Download images: `docker pull`

`docker pull` fetches an image (and its layers) to your local cache.

**Examples**

- Pull `latest` tag (implicit if omitted):

```bash
docker pull nginx\:latest
```

- Pull a specific version:

```bash
docker pull nginx:1.27
```

- Pull for a specific CPU architecture (multi-arch images):

```bash
docker pull --platform linux/arm64 node:20
```

- Pull by digest (immutable reference):

```bash
docker pull nginx\@sha256:<digest>
```

**Notes**

- **Name format:** `[registry/][namespace/]repo[:tag|@digest]`
- Layers are shared across images to save disk space.

### 5. Build images: `docker build`

Build images from a **build context** (directory) and a `Dockerfile`.

**Key concepts**

- **Context:** The directory you send to the daemon. Use `.dockerignore` to exclude files and speed up builds.
- **Dockerfile:** Declarative steps (e.g., `FROM`, `RUN`, `COPY`, `ENV`, `EXPOSE`, `CMD`).
- **Cache:** Docker reuses layers when instructions and file content haven’t changed.
- **Tags:** Give your image a name and version with `-t`.

**Examples**

- Basic build and tag:

```bash
docker build -t myapp:1.0 .
```

- Build with build-time arguments:

```bash
docker build --build-arg NODE\_ENV=production -t myapp\:prod .
```

- Multi-stage build target:

```bash
docker build --target runtime -t myapp\:runtime .
```

- Set build platform (with BuildKit/buildx):

```bash
docker build --platform linux/amd64 -t myapp\:x86 .
```

**Best practices**

- Keep layers minimal; combine `RUN` steps when appropriate.
- Pin base images (e.g., `node:20-alpine`) for repeatability.
- Use **multi-stage builds** to keep runtime images small.
- Avoid copying secrets into images (prefer build args or secret mounts).

### 6. Run containers: `docker run`

Starts a new container from an image.

**Common flags**

- **Foreground/Interactive:** `-it` (interactive TTY), good for shells:

```bash
docker run -it --rm alpine:3.20 sh
```

- **Detached:** `-d` to run in background:

```bash
docker run -d --name web -p 8080:80 nginx:1.27
```

- **Ports:** `-p hostPort:containerPort` or `-p ip:hostPort:containerPort`
- **Environment:** `-e KEY=VALUE` or `--env-file .env`
- **Volumes:** `-v hostPath:containerPath[:ro]` or named volumes:

```bash
docker volume create data
docker run -d -v data:/var/lib/postgresql/data postgres:16
```

- **Restart policy:** `--restart=always|on-failure[:max]`
- **Resources:** `--cpus 2 --memory 1g --memory-swap 1g`
- **Networking:** `--network bridge|host|none|<custom>`
- **Entrypoint/Cmd override:** `--entrypoint` or provide a command at the end.

**Lifecycle**

- Container stops when its **PID 1** process exits.
- Use `--rm` to auto-remove when it exits (for throwaway runs).

### 7. Inspect, monitor, and manage

**List & query**

- Running containers:

```bash
docker ps
```

- All containers:

```bash
docker ps -a
```

- Images and sizes:

```bash
docker images
docker system df
```

**Inspect resources (JSON detail)**

- Containers/images/networks/volumes:

```bash
docker inspect <name-or-id>
```

**Logs & processes**

- Show container logs (and follow):

```bash
docker logs <name>       # recent
docker logs -f <name>    # follow (stream)
```

- Show container processes:

```bash
docker top <name>
```

**Exec into a running container**

- Run a command inside (e.g., get a shell):

```bash
docker exec -it <name> sh

# or bash if available:

docker exec -it <name> bash
```

**Resource usage**

- Live metrics (CPU, memory, network, I/O):

```bash
docker stats
```

**Lifecycle management**

- Stop/start/restart:
```bash
docker stop <name>
docker start <name>
docker restart <name>
```

- Remove containers/images:

```bash
docker rm <name>
docker rmi <image>
```

- Prune unused resources (use with care):

```bash
docker system prune            # containers, networks, build cache
docker system prune -a         # also removes unused images
docker volume prune
docker network prune
```

**Events**

- Stream daemon events (useful for debugging/automation):

```bash
docker events
```

**Volumes & networks (quick view)**

- Volumes:

```bash
docker volume ls
docker volume inspect <vol>
```

- Networks:

```bash
docker network ls
docker network inspect <net>
```

### 8. Permissions & the `sudo` tip
- On Linux, `dockerd` typically listens on `/var/run/docker.sock`. Access is controlled by group membership.
- If you’re **not** in the `docker` group, either:
- Prefix commands with `sudo`:
  
  ```bash
  sudo docker ps
  ```

- Or add your user to the `docker` group (then log out/in):
  
  ```bash
  sudo usermod -aG docker $USER
  ```

**Security note:** Members of the `docker` group can effectively gain root on the host via the Docker socket. Only grant to trusted users.

### 9. Troubleshooting quick wins

- **“Cannot connect to the Docker daemon”**

    - Ensure the daemon is running: `sudo systemctl status docker` (Linux).
    - Check socket permissions; consider `sudo` or group membership.
- **“Permission denied” on the socket**
    - Use `sudo` or join the `docker` group as above.
- **Port conflicts**
    - Another process uses the host port; change `-p` or stop the other service.
- **Disk usage**
    - Prune unused resources; examine with `docker system df`.
- **Name conflicts**
    - Remove or rename existing containers/images; `docker rm -f <name>` if necessary.

### 10. Good practices

- Pin image tags (avoid implicit `latest` in production).
- Keep images small (alpine/distroless when appropriate; multi-stage builds).
- Separate **build-time** vs **run-time** configuration (build args vs env vars).
- Store data in **volumes** rather than container layers for persistence.
- Use healthchecks, resource limits, and restart policies for resilience.
- Prefer **least privilege**: drop unnecessary capabilities; read-only FS when possible.

---

## Hands-On Lab (Suggested)

1. **Discover**

- Search for a lightweight HTTP server:

```bash
docker search httpd
```

2. **Pull**

```bash
docker pull nginx:1.27
```

3. **Run**

```bash
docker run -d --name web -p 8080:80 nginx:1.27
```

4. **Inspect & Logs**

```bash
docker ps
docker logs -f web
docker inspect web --format '{{.NetworkSettings.IPAddress}}'
```

5. **Exec**

```bash
docker exec -it web sh
ls -la /usr/share/nginx/html
exit
```

6. **Clean Up**

```bash
docker stop web && docker rm web
docker image ls
```

---

## Mini-Cheat Sheet

- **Help:** `docker --help`, `docker <cmd> --help`
- **Search:** `docker search <term>`
- **Pull:** `docker pull <image>[:tag]`
- **Build:** `docker build -t <name:tag> <context>`
- **Run:** `docker run [options] <image> [command]`
- **List:** `docker ps` (`-a` for all), `docker images`
- **Logs:** `docker logs [-f] <container>`
- **Exec:** `docker exec -it <container> <cmd>`
- **Inspect:** `docker inspect <resource>`
- **Stop/Start:** `docker stop|start <container>`
- **Remove:** `docker rm <container>`, `docker rmi <image>`
- **Prune:** `docker system prune [-a]`

---

## Glossary

- **Image:** Immutable template (filesystem + metadata) used to create containers.
- **Container:** Running (or stopped) instance of an image with its own process namespace.
- **Layer:** Read-only filesystem slice composing an image; containers add a writable layer.
- **Registry:** Service that stores and distributes images (e.g., Docker Hub).
- **Volume:** Persistent storage managed by Docker, independent of container lifecycle.
- **Network:** Virtual network that connects containers.
- **Daemon (`dockerd`):** Background service performing Docker operations.
- **Client (`docker`):** CLI that talks to `dockerd` via its API.

---
