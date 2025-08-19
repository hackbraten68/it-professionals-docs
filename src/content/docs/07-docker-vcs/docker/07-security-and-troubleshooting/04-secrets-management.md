---
title: Secrets Management
---
# Secrets Management in Docker

Managing secrets properly is one of the most critical aspects of container security. Secrets include **passwords, API keys, certificates, database credentials, and tokens**. If mishandled, these can lead to **serious security breaches**, such as unauthorized access to databases, services, or entire infrastructures.

This lesson covers best practices for **secrets management in Docker**, including what to avoid and how to implement secure workflows.

---

## Don’t Store Secrets in Images

A common but dangerous mistake is embedding secrets directly inside **Dockerfiles** or resulting **container images**.

### Why this is risky:

* **Image layers are permanent**: Each instruction in a Dockerfile creates a new layer, and even if you later “remove” a secret, it may still be recoverable from earlier layers.
* **Public distribution**: If the image is pushed to a registry (e.g., Docker Hub), the secrets are exposed to anyone who pulls it.
* **Version control leakage**: Dockerfiles are often tracked in Git. If credentials are hard-coded, they may leak via commits or pull requests.

### Example (what **not** to do):

```dockerfile
FROM node:18
ENV DB_PASSWORD=mysecretpassword
```

This approach embeds the secret into both the **image metadata** and **environment variables**, making it visible to anyone inspecting the container.

✅ **Best Practice**: Keep secrets **outside of the image** and inject them at runtime using environment variables, files, or secret managers.

---

## Use Docker Secrets (Swarm Only)

Docker Swarm includes a **native secrets management system** that allows you to handle sensitive information securely.

### Key Features:

* Secrets are stored in the **Raft log**, encrypted at rest and in transit.
* Containers can access secrets through **in-memory files**, mounted at `/run/secrets/<secret_name>`.
* Secrets are only exposed to containers that explicitly request them.

### Example: Creating and Using a Secret

```bash
# Create a secret from a file
echo "supersecret" | docker secret create db_password -

# Deploy a service that uses the secret
docker service create \
  --name myapp \
  --secret db_password \
  myimage:latest
```

Inside the running container, the secret will be available as:

```bash
cat /run/secrets/db_password
```

⚠️ **Limitations**: Docker Secrets are only available when using **Swarm mode**. They are **not available** in standalone Docker Compose (unless you run Compose against a Swarm).

---

## Use External Secret Managers

For production environments or when using **Kubernetes** or **standalone Docker**, external secret management tools provide stronger security, auditing, and integration with cloud services.

### Common Options:

#### 1. **HashiCorp Vault**

* Centralized, open-source solution for managing secrets.
* Provides **dynamic secrets**: e.g., it can generate database credentials on demand with automatic expiration.
* Integrates with Docker through:

  * Volume mounts
  * API calls during container startup
  * Vault Agent sidecar

#### 2. **AWS Secrets Manager**

* Cloud-native service to store and rotate secrets.
* Supports fine-grained IAM access control.
* Provides SDKs and CLI tools to fetch secrets at runtime.
* Example integration:

  * Containers fetch secrets using the AWS SDK
  * Or inject secrets as environment variables through ECS task definitions.

#### 3. **SOPS + Volume Mount**

* [Mozilla SOPS](https://github.com/mozilla/sops) allows you to encrypt configuration files (YAML, JSON, ENV).
* Secrets remain encrypted in Git and are only decrypted at runtime.
* Example workflow:

  * Store `config.enc.yaml` in Git
  * Decrypt into a Docker volume at runtime
  * Mount the decrypted file into the container

---

## Best Practices for Secrets Management

1. **Use the principle of least privilege**: Ensure only the containers/services that need a secret can access it.
2. **Rotate secrets regularly**: Especially API tokens and database credentials.
3. **Audit access**: Use tools that log secret access (Vault, AWS Secrets Manager).
4. **Avoid passing secrets via environment variables** in production—prefer mounted files to reduce exposure in logs or process lists.
5. **Use version control safely**: Never commit secrets into Git, even if encrypted, unless your team follows strict key rotation policies.

---

## Summary

* **Never store secrets in Docker images**—they are permanent and easily exposed.
* **Use Docker Secrets** when working with Swarm clusters for in-memory secret injection.
* **Adopt external secret managers** (Vault, AWS Secrets Manager, or SOPS) for robust, scalable, and auditable secret handling.
* Follow **security best practices**: least privilege, rotation, auditing, and safe storage.

Effective secrets management is a **non-negotiable part of container security**, ensuring that sensitive information stays protected in development, staging, and production environments.
