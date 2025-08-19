---
title: PaaS & CI/CD Integration
---
# PaaS & CI/CD Integration

A **Platform‑as‑a‑Service (PaaS)** abstracts away most infrastructure concerns—provisioning, scaling, routing, TLS—so teams can ship code (or containers) quickly. **CI/CD** (Continuous Integration/Continuous Delivery/Deployment) automates build, test, and release workflows. Combined, they enable frequent, reliable releases with minimal ops toil.

This guide explains how to wire up PaaS platforms (e.g., Heroku, Render, Railway) with CI/CD systems (e.g., GitHub Actions, GitLab CI). It emphasizes container‑based delivery with Docker while acknowledging buildpack‑based “no‑Dockerfile” paths.

---

## 1) Core Concepts

### PaaS in a nutshell

* **Abstractions:** managed build/runtime, process orchestration, autoscaling, config/secrets, logs, metrics, TLS, domains.
* **Runtimes:**

  * **Buildpacks/Nixpacks:** auto‑detect language, build an image without a Dockerfile (Heroku buildpacks, Railway/Render Nixpacks).
  * **Container runtimes:** deploy a pre‑built Docker image from a registry.

### CI/CD in a nutshell

* **CI:** automatically build, test, and validate code on every change.
* **CD:** automatically deliver artifacts to staging/production via controlled strategies (manual approval or fully automated).

### Typical flow (container path)

1. Push to Git → CI builds Docker image → scan → push to registry.
2. CD step triggers PaaS deployment (by API, CLI, webhooks, or “auto deploy from registry”).
3. PaaS rolls out the new version, runs health checks, and routes traffic.

---

## 2) Reference Architectures

### A. Buildpacks/Nixpacks (no Dockerfile)

* **Pros:** fastest onboarding, fewer platform gotchas, fewer security concerns in Dockerfiles.
* **Cons:** less control over system deps, multi‑stage builds, and image size.

**Flow:**

```bash
git push -> CI: run tests -> PaaS: build using buildpacks -> deploy -> run release tasks -> scale
```

### B. Container‑native (Dockerfile)

* **Pros:** control over base image, caching, multi‑arch, reproducibility.
* **Cons:** maintain Dockerfiles and base image hygiene.

**Flow:**

```bash
git push -> CI: docker buildx build + test + scan + push -> PaaS: pull from registry & deploy
```

---

## 3) Example PaaS Platforms

### Heroku

* **Two paths:**

  * **Buildpacks** (classic): `Procfile` defines processes (web, worker).
  * **Container Registry:** `heroku container:push web -a <app>` then `heroku container:release`.
* **Release tasks:** `release` phase for DB migrations, etc.
* **Config:** `heroku config:set KEY=VALUE`.

### Render

* **Blueprints:** declarative `render.yaml`.
* **Builds:** via Dockerfile or Nixpacks.
* **Deploys:** auto on new images/commits; supports deploy hooks; managed Postgres/Redis.

### Railway

* **Nixpacks** by default; Dockerfile supported.
* **Envs:** variables/secrets per environment; auto‑generated URLs for services.
* **PR Previews:** ephemeral environments per branch/PR.

> Other PaaS with similar patterns: Fly.io (global VMs/Apps), Google Cloud Run (container PaaS), Azure Container Apps, AWS App Runner.

---

## 4) Docker in CI/CD

### Secure, cache‑efficient builds

* Use **multi‑stage** Dockerfiles.
* Prefer **distroless**/slim base images for smaller attack surface.
* Enable **BuildKit** and **buildx** for caching and multi‑arch:

  ```bash
  docker buildx build --platform linux/amd64 \
    --cache-from=type=registry,ref=ghcr.io/myorg/myapp:buildcache \
    --cache-to=type=registry,ref=ghcr.io/myorg/myapp:buildcache,mode=max \
    -t ghcr.io/myorg/myapp:${GITHUB_SHA} -t ghcr.io/myorg/myapp:latest .
  ```

### Tagging strategy

* Immutable SHA tags: `${GIT_SHA}` for exact rollbacks.
* Mutable channel tags: `:staging`, `:prod`, `:latest`.
* Optionally semantic versions: `:1.4.3`.

### Supply‑chain hardening

* Vulnerability scan (e.g., Trivy, Grype) on images during CI.
* Generate **SBOM** (CycloneDX/SPDX) and store as artifact.
* **Sign images** (cosign) and verify in deploy step.
* Pin base images by digest (e.g., `python@sha256:...`).

---

## 5) GitHub Actions: End‑to‑End Example

The snippet you provided focuses on building and pushing. Here’s a full workflow with buildx, cache, scan, and deployment triggers for different PaaS targets.

```yaml
name: ci-cd

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          platforms: linux/amd64
          tags: |
            ghcr.io/myorg/myapp:${{ github.sha }}
            ghcr.io/myorg/myapp:latest
          cache-from: type=registry,ref=ghcr.io/myorg/myapp:buildcache
          cache-to: type=registry,ref=ghcr.io/myorg/myapp:buildcache,mode=max

      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@0.24.0
        with:
          image-ref: ghcr.io/myorg/myapp:${{ github.sha }}
          format: 'table'
          exit-code: '1'     # fail on high/critical
          severity: 'HIGH,CRITICAL'

  deploy-staging-heroku:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Install Heroku CLI
        uses: heroku/actions/setup@v2
      - name: Heroku login
        run: heroku login --apikey ${{ secrets.HEROKU_API_KEY }}
      - name: Release image to Heroku
        run: |
          heroku container:login
          # Tell Heroku to use the image we just pushed to GHCR:
          # Option A: push again to Heroku registry
          docker tag ghcr.io/myorg/myapp:${{ github.sha }} registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web
          docker push registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web
          heroku container:release web -a ${{ secrets.HEROKU_APP_NAME }}

  deploy-prod-render:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - name: Trigger Render Deploy from Image
        run: |
          curl -X POST https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
            -H 'Authorization: Bearer ${{ secrets.RENDER_API_KEY }}' \
            -H 'Content-Type: application/json' \
            -d '{"imageId":"ghcr.io/myorg/myapp:'"${GITHUB_REF_NAME}"'"}'
```

Notes:

* Use environment protection rules (required reviewers) for production.
* For Render you can also “auto‑deploy” from the registry tag (e.g., `:prod`), or use `render.yaml` to pin deployment config.
* For Railway, trigger via CLI (`railway up`) or API; for PRs, Railway can create preview envs automatically.

---

## 6) GitLab CI: Equivalent Pipeline

```yaml
stages: [test, build, scan, deploy]

variables:
  IMAGE: $CI_REGISTRY_IMAGE/myapp
  TAG_SHA: $CI_COMMIT_SHA

test:
  stage: test
  image: cimg/node:20.11
  script:
    - npm ci
    - npm test --ci

build:
  stage: build
  image: docker:27.0.3
  services: [docker:27.0.3-dind]
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE:$TAG_SHA -t $IMAGE:latest .
    - docker push $IMAGE:$TAG_SHA
    - docker push $IMAGE:latest

scan:
  stage: scan
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE:$TAG_SHA

deploy_prod:
  stage: deploy
  environment: production
  when: manual
  script:
    - apk add --no-cache curl
    - curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"imageId\":\"$IMAGE:$TAG_SHA\"}"
```

---

## 7) Heroku, Render, Railway: Quick Recipes

### Heroku (buildpacks)

* `Procfile`:

  ```bash
  web: gunicorn myapp.wsgi --preload
  worker: rq worker default
  ```

* DB migrations in **release** phase using `heroku.yml` or Release Phase scripts.

### Heroku (container registry)

```bash
heroku create myapp
heroku container:login
docker build -t registry.heroku.com/myapp/web .
docker push registry.heroku.com/myapp/web
heroku container:release web -a myapp
```

### Render via `render.yaml`

```yaml
services:
  - type: web
    name: myapp
    env: docker
    plan: starter
    autoDeploy: true
    dockerCommand: ./entrypoint.sh
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString

databases:
  - name: mydb
```

### Railway (Nixpacks by default)

* No Dockerfile required; Railway detects runtime and builds.
* To use Dockerfile, enable “Use Dockerfile” in service settings or `railway.json`.

---

## 8) Environments, Secrets, and Config

* **Environment segregation:** `dev` → `staging` → `prod`. Use separate apps/services and databases.
* **Secrets:** store in CI secret store and PaaS config. Rotate regularly. Avoid `.env` in repo.
* **Config as code:** Render Blueprints (`render.yaml`), Railway `railway.json`, Heroku `app.json` review apps.
* **Review/Preview apps:** spin temporary environments per PR for product/design QA.

---

## 9) Release Strategies and Operability

* **Strategies:** blue‑green, canary, rolling, “preboot” (Heroku) to avoid downtime.
* **Health checks:** HTTP `/healthz`, readiness vs. liveness separation; set appropriate timeouts.
* **DB migrations:** run in release phase or pre‑deploy job; prefer backward‑compatible, two‑step migrations.
* **Observability:** centralize logs, metrics, traces; wire alerts to Slack/Teams.
* **Rollbacks:** keep immutable image tags; 1‑click revert to prior image/deploy in the PaaS UI or via API.

---

## 10) Testing Stages in CI

* **Unit tests** → **integration tests** (spin ephemeral DB/service) → **contract/API tests** → **e2e smoke** post‑deploy.
* Cache dependencies (npm/pip) and Docker layers to speed feedback loops.

---

## 11) Compliance and Security Checklist

* Least‑privilege CI tokens; prefer **OIDC** federation to cloud registries (no long‑lived PATs).
* Pin actions with SHAs; keep base images up to date.
* Run containers as non‑root; drop Linux capabilities; read‑only rootfs when possible.
* Enable dependency and image scanning; produce SBOM; sign images.
* Protect main branch; require code reviews; enable status checks.

---

## 12) Common Pitfalls

* Building on every job without cache → long pipelines.
* Single shared database across environments → unsafe migrations and data leaks.
* Secrets in logs or Docker build args → leakage risk.
* Health checks that hit the database on every probe → cascading failures.
* Assuming “latest” tag equals production artifact → ambiguous rollbacks.

---

## 13) Minimal End‑to‑End Example (GitHub Actions → GHCR → Render)

1. **Dockerfile** (multi‑stage, non‑root):

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=build /app ./
USER 10001
EXPOSE 3000
CMD ["server.js"]
```

2. **CI/CD** (build, scan, push, deploy trigger): see “GitHub Actions: End‑to‑End Example”.

3. **Render**: `render.yaml` points the service to `ghcr.io/myorg/myapp:latest` with `autoDeploy: true` or deploy via API using the SHA tag.

---

## 14) When to Pick Which Path

* **You want speed and simplicity:** Buildpacks/Nixpacks on Heroku/Render/Railway.
* **You need full control/reproducibility, custom system deps, or multi‑arch:** Dockerfile‑based flows.
* **You need regional autoscaling, per‑request billing, or serverless semantics:** Container serverless (Cloud Run/Azure Container Apps/AWS App Runner) with similar CI/CD patterns.

---

## 15) Learning and Teaching Tips

* Start with buildpacks for a quick win; then refactor to Dockerfile to learn supply‑chain best practices.
* Add one improvement at a time: caching → scanning → SBOM → signing → OIDC.
* Use preview environments to make reviews tangible and reduce “works on my machine” friction.

---

## Appendix: Your Provided Example (annotated)

```yaml
# Builds and pushes a Docker image tagged with the commit SHA.
# Extend by adding caching (buildx), scanning, and a deploy job.
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker image
        run: |
          docker build -t myorg/myapp:${{ github.sha }} .
          docker push myorg/myapp:${{ github.sha }}
```

Enhancements to consider:

* Login to a secure registry (GHCR/ECR/GCR).
* Add buildx caching and multi‑arch if needed.
* Add Trivy/Grype scan with failure gates.
* Tag with `:latest` or environment tags.
* Separate **deploy** jobs per environment with approvals.
* Trigger PaaS deployment via API/CLI or auto‑deploy from registry.
