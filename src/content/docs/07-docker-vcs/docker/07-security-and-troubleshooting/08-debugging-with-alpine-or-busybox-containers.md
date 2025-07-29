---
title: Debugging with Alpine or busyBox Containers
---

Sometimes your image doesn't have `curl`, `bash`, or `ping`. Use tools like:

```bash
docker run --rm -it --network container:<your_container> nicolaka/netshoot
```

This gives you access to networking tools in a separate container on the same network.
