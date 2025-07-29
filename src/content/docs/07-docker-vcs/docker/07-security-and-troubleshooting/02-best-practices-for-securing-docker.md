---
title: Best Practices for Securing Docker
---
### Use Minimal Base Images

Use images like alpine or distroless to reduce attack surface.

### Drop Unnecessary Privileges

Avoid --privileged mode. Use --cap-drop and --cap-add to control permissions.

### Use Docker User Namespaces

Map container users to non-root host users.

### Enable Seccomp, AppArmor, or SELinux

Apply security profiles to limit syscalls or behaviors.

### Regularly Scan Images for Vulnerabilities

Use tools like:

- `docker scan`
- Trivy
- Clair
