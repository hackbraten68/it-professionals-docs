---
title: Networking and Volumes
---
Docker Networks

- **Default networks:** `bridge`, `host`, `none`

- **List networks**

    ```bash
    docker network ls
    ```

- **Create custom bridge**

    ```bash
    docker network create my-bridge
    ```

- **Run on custom network**

    ```bash
    docker run -d --network my-bridge --name app my-node-app
    ```

- **Inspect network details**

    ```bash
    docker network inspect my-bridge
    ```

### Data Persistence

#### Named Volumes

- **Create a volume**

    ```bash
    docker volume create data-vol
    ```

- **Use in container**

    ```bash
    docker run -d -v data-vol:/var/lib/mysql mysql:8
    ```

- **Inspect & list**

    ```bash
    docker volume ls
    docker volume inspect data-vol
    ```

#### Bind Mounts

- **Host directory into container**

    ```bash
    docker run -it \
      -v /home/user/app:/usr/src/app \
      -w /usr/src/app \
      node:18-alpine \
      npm run dev
    ```

- **Pros & cons**

  - Bind: real-time sync, but less portable

  - Volume: managed by Docker, safe for production
