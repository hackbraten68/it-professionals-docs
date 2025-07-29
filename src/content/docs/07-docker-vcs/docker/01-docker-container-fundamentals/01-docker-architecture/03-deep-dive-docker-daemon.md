---
title: Deep Dive into Docker Daemon
---

**Objective:** Learn how the daemon manages lifecycle, storage, networking, and security.

**Content:**

- **Core Responsibilities:**
    
    - **Container lifecycle:** `create`, `start`, `stop`, `remove`.
        
    - **Image management:** build, pull, push, tag, prune.
        
    - **Network drivers:** bridge, overlay, host, macvlan.
        
    - **Storage drivers:** `overlay2` (default), `aufs`, `devicemapper`, `btrfs`.
        
- **Configuration & Startup:**
    
    - **Systemd unit** or manual invocation: `dockerd --config-file /etc/docker/daemon.json`.
        
    - **Sample `daemon.json`:**
    
        ```json
        {   
            "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"], 
            "storage-driver": "overlay2",   
            "tls": true,   
            "tlsverify": true,   
            "tlscacert": "/etc/docker/ca.pem",   
            "tlscert": "/etc/docker/server-cert.pem",   
            "tlskey": "/etc/docker/server-key.pem" 
        }
        ```
        
- **Security Modes:**
    
    - **Rootful vs. Rootless Daemon:** run without root privileges for extra safety.
        
    - **TLS authentication:** ensure only authorized clients connect.
        
- **Monitoring & Logs:**
    
    - **Event stream:** `docker events` for real-time daemon events.
        
    - **Metrics:** via cgroups or third-party exporters (e.g. Prometheus).
        

**Checkpoint (True/False):**

> **Q3:** The Docker Daemon can run in “rootless” mode to avoid requiring root privileges.
> 
> - True ✔
>     
> - False
>