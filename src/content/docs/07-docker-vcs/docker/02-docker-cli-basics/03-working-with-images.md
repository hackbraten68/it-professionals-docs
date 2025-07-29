---
title: Working with Images
---
### Searching & Pulling

- **Search on Docker Hub**

    ```bash
    docker search redis
    ```

- **Pull an image**

    ```bash
    docker pull redis:7
    ```

### Listing & Tagging

- **List local images**

    ```bash
    docker images
    ```

- **Tag an existing image**

    ```bash
    docker tag redis:7 myrepo/redis:7-custom
    ```

### Inspecting & History

- **Inspect metadata**

    ```bash
    docker inspect redis:7
    ```

- **View layer history**

    ```bash
    docker history redis:7
    ```

### Pushing & Cleaning

- **Push to registry**

    ```bash
    docker push myrepo/redis:7-custom
    ```

- **Remove image**

    ```bash
    docker rmi myrepo/redis:7-custom
    ```

- **Prune dangling images**

    ```bash
    docker image prune
    ```

- **Prune all unused images**

    ```bash
    docker image prune -a
    ```
