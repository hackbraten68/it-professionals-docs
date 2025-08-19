---
title: Best Practices for Securing Docker
---
# Best Practices for Securing Docker

Securing Docker containers requires a proactive approach. Containers are lightweight and efficient, but if not configured properly, they can introduce significant security risks. The following best practices will help you reduce vulnerabilities and strengthen your containerized environments.

---

## Use Minimal Base Images

A smaller image footprint means fewer potential vulnerabilities.

* **Why it matters:** Large base images often contain unnecessary packages and libraries that can expand the attack surface.
* **Recommendation:**

  * Prefer lightweight images such as **Alpine Linux** or **Distroless** images.
  * These images exclude package managers, shells, or other utilities that attackers could exploit.
  * Verify image integrity by using cryptographic signatures (`docker pull alpine@sha256:<digest>`).

**Example:**

```dockerfile
# Instead of using a large base like Ubuntu
FROM ubuntu:20.04

# Use a minimal base image
FROM alpine:3.19
```

---

## Drop Unnecessary Privileges

Containers should run with the **least privileges required**.

* **Why it matters:** Running containers in `--privileged` mode grants full access to the host, effectively disabling isolation.
* **Recommendation:**

  * Avoid `--privileged` unless absolutely necessary.
  * Use `--cap-drop` to remove Linux capabilities you don’t need.
  * Use `--cap-add` only for specific permissions required by your application.

**Example:**

```bash
# Drop all capabilities and only add NET_BIND_SERVICE
docker run \
  --cap-drop ALL \
  --cap-add NET_BIND_SERVICE \
  myapp:latest
```

---

## Use Docker User Namespaces

Mapping container users to non-root users on the host reduces the risk of privilege escalation.

* **Why it matters:** By default, the root user inside a container has root privileges on the host as well.
* **Recommendation:**

  * Enable **user namespaces** so that container root maps to a non-root user on the host.
  * Run applications as a **non-root user** inside the container.

**Example `Dockerfile`:**

```dockerfile
# Create a non-root user
RUN adduser -D appuser
USER appuser
```

**Daemon configuration (`/etc/docker/daemon.json`):**

```json
{
  "userns-remap": "default"
}
```

---

## Enable Seccomp, AppArmor, or SELinux

Mandatory Access Control (MAC) systems prevent containers from executing unauthorized actions.

* **Why it matters:** Attackers often rely on system calls (syscalls) to escape containers or escalate privileges.
* **Recommendation:**

  * Use **Seccomp** profiles to restrict syscalls.
  * Use **AppArmor** or **SELinux** to enforce strict security policies.
  * Customize profiles based on workload requirements.

**Example (using Docker’s default Seccomp profile):**

```bash
docker run --security-opt seccomp=default.json myapp:latest
```

---

## Regularly Scan Images for Vulnerabilities

Even minimal images can contain outdated libraries.

* **Why it matters:** Known vulnerabilities (CVEs) in images are common attack vectors.
* **Recommendation:**

  * Integrate **image scanning tools** into your CI/CD pipeline.
  * Regularly update base images and dependencies.

**Tools to use:**

* **Docker Scan** (powered by Snyk):

  ```bash
  docker scan myapp:latest
  ```

* **Trivy** (by Aqua Security):

  ```bash
  trivy image myapp:latest
  ```

* **Clair** (static vulnerability scanner for containers).

---

## Conclusion

Securing Docker environments requires a **defense-in-depth** strategy:

1. Start with minimal base images.
2. Remove unnecessary privileges.
3. Use non-root users and namespaces.
4. Enforce security profiles with Seccomp, AppArmor, or SELinux.
5. Continuously scan for vulnerabilities.

By adopting these practices, you significantly reduce your container attack surface and improve resilience against real-world threats.
