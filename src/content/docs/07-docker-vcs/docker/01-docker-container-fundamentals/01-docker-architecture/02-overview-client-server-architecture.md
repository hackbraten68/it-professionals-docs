---
title: Overview of Client–Server Architecture
---
**Objective:** Understand Docker’s distributed model and how client and daemon communicate.

**Content:**

- **Client–Server Paradigm:**
    
    - The **Docker Client** issues commands (e.g. `docker run`, `docker build`) via a RESTful API.
        
    - The **Docker Daemon** listens for API requests and orchestrates containers, images, networks, and volumes.
        
- **Communication Channels:**
    
    - **Unix domain socket** (`/var/run/docker.sock`) for local CLI.
        
    - **TCP socket** (e.g. `tcp://hostname:2375/2376`) for remote clients—secured via TLS.
        
- **REST API Endpoints:**
    
    - `POST /containers/create` → create container
        
    - `GET /containers/json` → list containers
        
    - `POST /images/create` → pull image
        
- **Use Cases:**
    
    - **Local Development:** Client and daemon on same host.
        
    - **Remote Management:** Client on laptop ↔ Daemon on remote server.
        
    - **Orchestration Layers:** Swarm/Kubernetes talk to multiple daemons via higher-level APIs.
        

**Diagram (optional):**

css

KopierenBearbeiten

`[Docker Client] ──HTTP/TCP or Unix Socket──▶ [Docker Daemon]        │                                         │        └─────────────> REST API <───────────────┘              (containers, images, volumes)`

**Checkpoint (Matching):**

> Match each role to its function:
> 
> 1. Receives HTTP requests and runs containers
>     
> 2. Converts CLI input into API calls
>     
> 
> A) Docker Daemon → ___  
> B) Docker Client → ___