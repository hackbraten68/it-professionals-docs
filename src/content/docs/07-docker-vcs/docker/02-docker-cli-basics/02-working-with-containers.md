---
title: Working with Containers
---
### Starting & Running Containers

- **Basic run**

    ```bash
    docker run nginx:latest
    ```

  - Defaults: foreground, no port mapping, auto-generated name

- **Detached mode** (`-d`)

    ```bash
    docker run -d --name my-nginx -p 8080:80 nginx:latest
    ```

- **Interactive & TTY**

    ```bash
    docker run -it ubuntu:22.04 /bin/bash
    ```

- **Environment variables** (`-e`)

    ```bash
    docker run -d -e MYSQL_ROOT_PASSWORD=secret --name db mysql:8
    ```

- **Working directory** (`-w`) & **user** (`-u`)

    ```bash
    docker run -it -v "$(pwd)":/app -w /app node:18-alpine npm start
    ```

### Listing & Inspecting

- **List running containers**

    ```bash
    docker ps
    ```

- **All containers (incl. stopped)**

    ```bash
    docker ps -a
    ```

- **Inspect container details**

    ```bash
    docker inspect my-nginx
    ```

- **View mapped ports**

    ```bash
    docker port my-nginx
    ```

### Logs & Exec

- **Fetch container logs**

    ```bash
    docker logs my-nginx
    docker logs -f my-nginx    # follow
    ```

- **Execute commands inside**

    ```bash
    docker exec -it my-nginx /bin/sh
    ```

- **Attach to STDIN/STDOUT**

    ```bash
    docker attach my-nginx
    ```

### Stopping & Cleaning Up

- **Stop & start**

    ```bash
    docker stop my-nginx
    docker start my-nginx
    ```

- **Remove single container**

    ```bash
    docker rm my-nginx
    ```

- **Prune all stopped containers**

    ```bash
    docker container prune
    ```
