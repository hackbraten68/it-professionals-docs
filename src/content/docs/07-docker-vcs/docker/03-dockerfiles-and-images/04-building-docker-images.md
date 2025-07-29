---
title: Building Docker Images
---
- **Command:**

    ```bash
    docker build -t myapp:latest .
    ```

- **Options:**

  - `-t` tags the image (`name:tag`).
  - `--file` or `-f` specifies a custom Dockerfile path.
  - `--no-cache` forces rebuild without using cache.
