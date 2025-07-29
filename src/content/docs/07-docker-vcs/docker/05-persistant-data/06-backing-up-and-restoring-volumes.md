---
title: Backing Up and Restoring Volumes
---
You can back up a volume like this:

```bash
docker run --rm \
  -v myvolume:/data \
  -v $(pwd):/backup \
  busybox \
  tar czf /backup/backup.tar.gz /data
```

To restore:

```bash
docker run --rm \
  -v myvolume:/data \
  -v $(pwd):/backup \
  busybox \
  tar xzf /backup/backup.tar.gz -C /
```
