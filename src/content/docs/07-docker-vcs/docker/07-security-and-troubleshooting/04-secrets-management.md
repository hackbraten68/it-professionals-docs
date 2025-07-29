---
title: Secrets Management
---
### Don’t Store Secrets in Images

Never bake passwords or tokens into your Dockerfiles.

### Use Docker Secrets (Swarm only)

If you use Swarm, use docker secret to manage credentials securely.

### Use external secret managers

Examples:

- HashiCorp Vault
- AWS Secrets Manager
- SOPS + Volume Mount
