---
title: Managing Images
---

- **List images:**

    ```bash
    docker images
    ```

- **Tagging:**

    ```bash
    docker tag myapp:latest registry.example.com/myapp:v1.0
    ```

- **Pushing to a registry:**

    ```bash
    docker push registry.example.com/myapp:v1.0
    ```

- **Pulling images:**

    ```bash
    docker pull ubuntu:22.04
    ```

- **Removing images:**

    ```bash
    docker rmi myapp:latest
    ```
