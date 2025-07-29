---
title: Docker Troubleshooting Basics
---
### Container Won’t Start

- Check logs: `docker logs <container>`
- Check image name/tag
- Look for port conflicts

### Resource Problems

- Check memory/CPU: docker stats
- Apply limits using `--memory`, `--cpus`

### Network Issues

- Check container network: `docker inspect`
- Use `ping`, `curl`, or `telnet` inside the container

### Docker Daemon Issues

- Check daemon logs: `journalctl -u docker`
- Restart Docker service
- Check /etc/docker/daemon.json
