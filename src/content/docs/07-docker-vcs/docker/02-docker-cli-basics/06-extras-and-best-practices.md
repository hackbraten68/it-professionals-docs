---
title: Extras & Best Practices
---
Handy Commands

- **Copy files to/from container**

    ```bash
    docker cp ./local.txt container:/tmp/remote.txt
    ```

- **Rename container/image**

    ```bash
    docker rename old-name new-name
    docker tag old-image:tag new-image:newtag
    ```

- **View real-time events**

    ```bash
    docker events
    ```

### Best Practices

- **Keep containers immutable** – push config via env vars.

- **Minimize image size** – use slim/alpine bases, multi-stage builds.

- **Leverage build cache** – order Dockerfile layers by volatility.

- **Clean up regularly** – scheduled `prune` jobs.

- **Use volumes for data** – never bake persistent data into images.
