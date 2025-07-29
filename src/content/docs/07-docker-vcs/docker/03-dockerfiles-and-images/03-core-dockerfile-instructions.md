---
title: Core Dockerfile Instructions
---
Core Dockerfile Instructions

1. **FROM**

    - Specifies the base image (e.g., `FROM python:3.10-slim`).

    - Every Dockerfile must start with a `FROM` unless using a multi-stage build.

2. **LABEL**

    - Adds metadata (e.g., maintainer, version).

    - Example: `LABEL maintainer="jane@example.com"`

3. **RUN**

    - Executes commands in a new layer (e.g., installing packages).

    - Example:

        ```dockerfile
        RUN apt-get update && apt-get install -y git
        ```

4. **COPY / ADD**

    - `COPY` transfers files/directories from the build context into the image.

    - `ADD` also supports remote URLs and automatic tar extraction.

    - Example:

        ```dockerfile
        COPY . /app
        ```

5. **WORKDIR**

    - Sets the working directory for subsequent instructions.

    - Example: `WORKDIR /app`

6. **ENV**

    - Defines environment variables.

    - Example: `ENV PORT=8080`

7. **EXPOSE**

    - Documents ports the container listens on (does not publish by itself).

    - Example: `EXPOSE 8080`

8. **CMD vs. ENTRYPOINT**

    - **CMD:** Default command to run when container starts; can be overridden.

        ```dockerfile
        CMD ["python", "app.py"]
        ```

    - **ENTRYPOINT:** Sets fixed command; any `CMD` or command-line args become parameters.

        ```dockerfile
        ENTRYPOINT ["python", "app.py"]
        CMD ["--help"]
        ```

9. **USER**

    - Specifies the user to run subsequent commands.

    - Example: `USER node`

10. **VOLUME**

    - Declares mount points for external volumes.

    - Example: `VOLUME /data`

11. **HEALTHCHECK**

    - Defines a command to test container health.

    - Example:

        ```dockerfile
        HEALTHCHECK --interval=30s CMD curl -f http://localhost/health || exit 1
        ```
