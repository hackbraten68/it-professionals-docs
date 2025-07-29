---
title: Introduction to Docker Architecture
---
**Objective:** Grasp why Docker has its own layered, client-server design and what problems it solves.

**Content:**

- **What is Docker?**  
    A platform for packaging applications and their dependencies into lightweight, portable containers that run consistently across environments.
    
- **Why a distinct architecture?**
    
    - **Isolation & Security:** Namespaces and control groups enforce resource and process separation.
        
    - **Portability:** Images encapsulate everything needed, from OS libraries to application code.
        
    - **Efficiency:** Shared kernel avoids the overhead of full VMs.
        
- **Key components at a glance:**
    
    1. **Docker Client** (CLI or API)
        
    2. **Docker Daemon** (`dockerd`)
        
    3. **Images & Registries**
        
    4. **Containers**
        
    5. **Networks & Volumes**