---
title: What is a Dockerfile?
---

## Definition

A **Dockerfile** is a plain text file that contains a sequence of instructions which tell Docker how to build a container image.  

- By convention, the file is named `Dockerfile` (without an extension).  
- Each line in the Dockerfile represents a command that is executed in order, forming layers in the final image.  
- The Docker CLI uses the Dockerfile when running `docker build` to create reproducible, portable images.

---

## Purpose

Dockerfiles are essential for modern containerized application development. Their main goals include:

1. **Automate Image Creation**  
   - Instead of manually configuring a container every time, a Dockerfile allows you to define the steps once and build consistent images automatically.  
   - This saves time and reduces human error.

2. **Capture Dependencies & Environment**  
   - A Dockerfile can specify:  
     - **Base images** (e.g., `FROM ubuntu:22.04`)  
     - **Dependencies** (libraries, runtimes, packages)  
     - **Environment variables** (`ENV NODE_ENV=production`)  
     - **Configuration** such as working directories, ports, or users  
   - This ensures anyone using the image has the exact same environment, regardless of their host system.

3. **Define Commands & Metadata**  
   - You can declare the commands a container will run (`CMD` or `ENTRYPOINT`).  
   - Metadata such as labels, default ports (`EXPOSE`), and mount points (`VOLUME`) can be included.  
   - This makes containers more self-documenting.

4. **Version-Control Your Configuration**  
   - Dockerfiles are text-based, so they can be stored in **Git repositories** alongside application code.  
   - Teams can track changes to environments just like they track changes to source code.  
   - This improves collaboration, reproducibility, and rollback in case of misconfiguration.

---

## Structure of a Dockerfile

A typical Dockerfile includes:

- **Base image** (`FROM`) – the starting point for your build.  
- **Instructions** such as `RUN`, `COPY`, `ADD` to install software or copy files.  
- **Environment setup** (`ENV`, `WORKDIR`, `USER`).  
- **Entrypoint and command** (`ENTRYPOINT`, `CMD`) to specify default behavior.  

Example:

```dockerfile
# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Expose application port
EXPOSE 3000

# Define startup command
CMD ["node", "server.js"]
```

---

## Why Dockerfiles Matter

* **Consistency:** Every build is the same, reducing "works on my machine" issues.
* **Portability:** Applications can be shipped across environments (development, staging, production).
* **Scalability:** Teams can standardize how apps are built and deployed.
* **Documentation:** The Dockerfile itself acts as a blueprint of how the application runs.

---

## Key Takeaways

* A Dockerfile defines the **blueprint** of a container image.
* It ensures **automation, consistency, and reproducibility** of application environments.
* By storing Dockerfiles in version control, teams can manage and evolve their infrastructure just like they do with application code.
