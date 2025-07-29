---
title: "Exploring the Docker Client"
---

**Objectives** See how the CLI/API interacts with the daemon and what extensions exist.

- **Common Commands & Flags**

  - `docker run --rm -d -p 80:80 nginx:latest`
  - `docker build -t myapp:1.0 .`
  - `docker push myregistry.com/myapp:1.0`
  - `docker volume create data-vol`

- **How It Works Under the Hood**

    1. User types `docker <command>`.
    2. CLI parses flags and forms an HTTP request.
    3. Request sent to daemon’s API endpoint.
    4. CLI streams JSON-encoded progress/events back to user.

- **Client Extensions & Plugins**

  - **Buildx:** advanced multi-architecture builds.
  - **Compose CLI plugin:** `docker compose up`.
  - **Third‑party tools:** Portainer, Rancher, or custom UI frameworks hitting the same API.

- **Environment Variables**

  - `DOCKER_HOST`: change the socket/host.
  - `DOCKER_TLS_VERIFY=1` & `DOCKER_CERT_PATH`: for secure remote use.

Checkpoint (Fill‑in‑the‑Blank)

> The CLI translates `docker build` into an HTTP `POST /build` request to the Daemon. True or False?
