---
title: PaaS & CI/CD Integration
---
# PaaS & CI/CD Integration

**Platform-as-a-Service (PaaS)** abstrahiert die meisten Infrastrukturthemen – Provisionierung, Skalierung, Routing, TLS – sodass Teams Code (oder Container) schnell bereitstellen können. **CI/CD** (Continuous Integration/Continuous Delivery/Deployment) automatisiert Build-, Test- und Release-Workflows. Zusammen ermöglichen sie häufige, zuverlässige Releases mit minimalem Betriebsaufwand.

Dieser Leitfaden erklärt, wie man PaaS-Plattformen (z. B. Heroku, Render, Railway) mit CI/CD-Systemen (z. B. GitHub Actions, GitLab CI) verbindet. Der Fokus liegt auf containerbasierter Bereitstellung mit Docker, wobei auch Buildpack-basierte Ansätze („kein Dockerfile notwendig“) berücksichtigt werden.

---

## 1) Grundkonzepte

### PaaS in Kürze

* **Abstraktionen:** verwaltete Builds/Runtimes, Prozess-Orchestrierung, Autoskalierung, Konfiguration/Secrets, Logs, Metriken, TLS, Domains.
* **Runtimes:**

  * **Buildpacks/Nixpacks:** erkennen Sprache automatisch, bauen Images ohne Dockerfile (Heroku Buildpacks, Railway/Render Nixpacks).
  * **Container-Runtimes:** deployen ein bereits gebautes Docker-Image aus einer Registry.

### CI/CD in Kürze

* **CI:** baut, testet und validiert Code automatisch bei jeder Änderung.
* **CD:** liefert Artefakte automatisiert in Staging/Production mit kontrollierten Strategien (manuelle Freigabe oder vollautomatisch).

### Typischer Ablauf (Container-Pfad)

1. Push ins Git → CI baut Docker-Image → Scan → Push zur Registry.
2. CD-Schritt triggert PaaS-Deployment (per API, CLI, Webhook oder „Auto-Deploy aus Registry“).
3. PaaS rollt neue Version aus, führt Health-Checks aus und routet Traffic.

---

## 2) Referenzarchitekturen

### A. Buildpacks/Nixpacks (ohne Dockerfile)

* **Vorteile:** schnellster Einstieg, weniger Plattform-Probleme, geringeres Risiko bei Dockerfile-Sicherheitslücken.
* **Nachteile:** weniger Kontrolle über System-Dependencies, Multi-Stage-Builds und Image-Größe.

**Flow:**

```bash
git push -> CI: Tests -> PaaS: Build mit Buildpacks -> Deploy -> Release-Tasks -> Skalierung
```

### B. Container-native (Dockerfile)

* **Vorteile:** volle Kontrolle über Base-Image, Caching, Multi-Arch, Reproduzierbarkeit.
* **Nachteile:** Wartung von Dockerfiles und Base-Image-Pflege.

**Flow:**

```bash
git push -> CI: docker build + test + scan + push -> PaaS: pull aus Registry & deploy
```

---

## 3) Beispiel PaaS-Plattformen

### Heroku

* **Zwei Wege:**

  * **Buildpacks** (klassisch): `Procfile` definiert Prozesse (Web, Worker).
  * **Container Registry:** `heroku container:push web -a <app>` dann `heroku container:release`.
* **Release-Tasks:** `release`-Phase für DB-Migrationen usw.
* **Config:** `heroku config:set KEY=VALUE`.

### Render

* **Blueprints:** deklarative `render.yaml`.
* **Builds:** per Dockerfile oder Nixpacks.
* **Deploys:** automatisch bei neuen Images/Commits; unterstützt Deploy-Hooks; verwaltete Postgres/Redis.

### Railway

* **Standard:** Nixpacks; Dockerfile wird unterstützt.
* **Envs:** Variablen/Secrets pro Umgebung; auto-generierte URLs.
* **PR-Previews:** temporäre Umgebungen pro Branch/PR.

> Weitere ähnliche PaaS: Fly.io (globale VMs/Apps), Google Cloud Run, Azure Container Apps, AWS App Runner.

---

## 4) Docker in CI/CD

### Sichere, effiziente Builds

* Multi-Stage-Dockerfiles nutzen.
* Schlanke/distroless Base-Images → kleinere Angriffsfläche.
* BuildKit/Buildx aktivieren für Caching und Multi-Arch.

### Tagging-Strategie

* **Immutable:** SHA-Tags (`${GIT_SHA}`) für Rollbacks.
* **Mutable:** `:staging`, `:prod`, `:latest`.
* **Optional:** SemVer-Tags (`:1.4.3`).

### Lieferketten-Sicherheit

* Vulnerability-Scan (z. B. Trivy, Grype).
* SBOM (CycloneDX/SPDX) generieren und speichern.
* Images signieren (cosign).
* Base-Images per Digest pinnen.

---

## 5) GitHub Actions: End-to-End Beispiel

```yaml
name: ci-cd

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push image
        run: |
          docker build -t ghcr.io/myorg/myapp:${{ github.sha }} .
          docker push ghcr.io/myorg/myapp:${{ github.sha }}
```

Erweiterungen:

* Caching (buildx), Scan (Trivy), Deploy-Jobs für Staging/Prod.
* Deployment per API/CLI ins PaaS.
* Schutzregeln (Reviewer) für Prod.

---

## 6) GitLab CI: Äquivalentes Pipeline-Beispiel

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
```

---

## 7) Quick Recipes (Heroku, Render, Railway)

### Heroku (Buildpacks)

`Procfile` Beispiel:

```bash
web: gunicorn myapp.wsgi --preload
worker: rq worker default
```

### Heroku (Container)

```bash
heroku create myapp
heroku container:login
docker build -t registry.heroku.com/myapp/web .
docker push registry.heroku.com/myapp/web
heroku container:release web -a myapp
```

### Render (`render.yaml`)

```yaml
services:
  - type: web
    name: myapp
    env: docker
    plan: starter
    autoDeploy: true
```

### Railway

* Nixpacks = Standard.
* Dockerfile kann explizit aktiviert werden.

---

## 8) Umgebungen, Secrets, Config

* **Trennung:** dev → staging → prod.
* **Secrets:** in CI-Secret-Stores & PaaS-Config, niemals im Repo.
* **Config as Code:** `render.yaml`, `railway.json`, `app.json`.
* **Preview Apps:** pro PR für QA/Design.

---

## 9) Release-Strategien

* Blue-Green, Canary, Rolling, „Preboot“ (Heroku).
* Healthchecks: readiness vs. liveness.
* Migrationen: kompatibel, in Release-Phase.
* Monitoring: Logs, Metriken, Alerts.
* Rollbacks: über immutable Image-Tags.

---

## 10) Test-Stages in CI

* Unit → Integration → Contract/API → E2E Smoke.
* Dependency- und Layer-Caching nutzen.

---

## 11) Security-Checkliste

* Least-Privilege Tokens, OIDC anstatt PATs.
* Actions mit SHA pinnen.
* Container non-root laufen lassen.
* Dependency-Scans & SBOM.
* Branch-Protection & Code Reviews.

---

## 12) Häufige Fehler

* Kein Cache → langsame Pipelines.
* Eine gemeinsame DB für alle Envs → Risiko.
* Secrets in Logs oder Build Args.
* Falsche Healthchecks → Ausfälle.
* Nur `latest` nutzen → keine Rollbacks.

---

## 13) End-to-End Minimalbeispiel

* Multi-Stage-Dockerfile
* CI/CD Workflow mit Scan & Deploy
* `render.yaml` für Deployment

---

## 14) Wann welchen Weg wählen?

* **Schnell & einfach:** Buildpacks/Nixpacks.
* **Kontrolle & Reproduzierbarkeit:** Dockerfile.
* **Serverless-ähnlich, Pay-per-Use:** Cloud Run, App Runner, Azure Container Apps.

---

## 15) Lern- & Lehrtipps

* Mit Buildpacks starten → schnelles Erfolgserlebnis.
* Danach Dockerfile einführen → tieferes Verständnis.
* Schrittweise Security-Features ergänzen.
* Preview Environments nutzen, um Reviews greifbarer zu machen.

---

## Anhang: Dein Ursprungsbeispiel (kommentiert)

```yaml
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

**Verbesserungen:**

* Registry-Login hinzufügen.
* Buildx-Caching aktivieren.
* Vulnerability Scan einfügen.
* Tags für Environments.
* Separate Deploy-Jobs pro Env.
