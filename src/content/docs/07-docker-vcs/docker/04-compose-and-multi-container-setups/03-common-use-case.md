---
title: Common Use Case - Web App with a Database
---

## Common Use Case: Web App with a Database

## Introduction

Modern web applications are rarely a single component. A **typical setup** often involves a **frontend**, a **backend API**, and a **database**. Managing these components individually with Docker would require running multiple commands and ensuring correct networking between containers.
**Docker Compose** simplifies this process by allowing you to define and start the entire environment with one configuration file and a single command.

---

## Typical Multi-Container Setup

1. **Frontend (Client Application)**

   * Examples: **React**, **Angular**, **Vue**
   * Purpose: Provides the **user interface** that runs in the browser.
   * Deployment: Often served via a lightweight HTTP server such as **Nginx**.
   * Container responsibilities:

     * Serve static assets (HTML, CSS, JS).
     * Forward API calls to the backend API.

2. **Backend API (Application Server)**

   * Examples: **Express.js**, **Flask**, **Django**, **Spring Boot**
   * Purpose: Acts as the **business logic layer**, processing requests and responses.
   * Responsibilities:

     * Handle authentication, authorization, and data validation.
     * Process client requests and return responses.
     * Communicate with the database to store or retrieve information.

3. **Database**

   * Examples: **PostgreSQL**, **MySQL**, **MongoDB**
   * Purpose: Persistently stores application data.
   * Considerations:

     * Databases typically require **volumes** for persistent storage.
     * Configuration (e.g., database name, username, password) is usually provided via **environment variables**.

---

## Example `docker-compose.yml`

A minimal example setup could look like this:

```yaml
version: '3.9'
services:
  frontend:
    image: nginx:latest
    volumes:
      - ./frontend/build:/usr/share/nginx/html
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/mydb
    ports:
      - "5000:5000"
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

---

## How This Works

* **Networking:**
  Docker Compose creates a **default network** where all services can communicate by their **service name** (e.g., the backend connects to `db:5432`).

* **Dependencies:**
  The `depends_on` option ensures that the backend does not start before the database, and the frontend waits for the backend.

* **Persistent Data:**
  The `db_data` volume ensures that data remains available even if the database container is restarted.

* **Port Mapping:**

  * Frontend: Available at `http://localhost:3000`
  * Backend API: Available at `http://localhost:5000`

---

## Benefits of Using Docker Compose for Web Apps

* **One-command startup:**
  `docker-compose up` starts all components together.

* **Simplified local development:**
  Developers can run the full stack on their machine without installing multiple runtimes.

* **Isolation:**
  Each component runs in its own container, preventing dependency conflicts.

* **Portability:**
  The same configuration can be used for development, testing, and small-scale production deployments.

* **Scalability:**
  Containers can be scaled (e.g., multiple backend replicas) using simple commands like:

  ```bash
  docker-compose up --scale backend=3
  ```

---

## Conclusion

A **web application with a database** is one of the most common use cases for Docker Compose. By combining a **frontend**, **backend API**, and **database** into a single configuration, Compose enables developers to easily build, run, and manage complex multi-container environments. This setup is ideal for **local development** and can also serve as a foundation for **production deployments** with additional tooling.

---
