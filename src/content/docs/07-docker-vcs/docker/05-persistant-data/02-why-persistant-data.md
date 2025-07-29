---
title: Why Do We Need Persistant Data?
---
Without persistent storage:

- Database data would be lost on container removal.

- Logs and configuration files would not survive a restart.

- You cannot share files between containers or with the host system.

Persistent storage allows containers to:

- Retain important data between restarts

- Share data across containers

- Store application states, logs, uploads, etc.
