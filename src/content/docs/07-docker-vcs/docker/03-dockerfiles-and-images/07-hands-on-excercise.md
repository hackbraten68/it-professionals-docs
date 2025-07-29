---
title: Hands-Ons Excercise
---

1. **Create a simple Node.js app**:

    - `app.js` printing “Hello, Docker!” on port 3000.

2. **Write a Dockerfile** with:

    - Official Node base image

    - Copy app files

    - Install dependencies

    - Expose port

    - Default command

3. **Build & Run:**

    ```bash
    docker build -t hello-docker .
    docker run -p 3000:3000 hello-docker
    ```

4. **Verify** by visiting `http://localhost:3000`.
