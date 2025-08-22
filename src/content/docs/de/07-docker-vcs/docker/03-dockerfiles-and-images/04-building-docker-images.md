---
title: Docker Images bauen
---

# Docker Images bauen

> Ziel: Verstehen, wie Docker aus einem **Dockerfile** + **Build Context** ein reproduzierbares **Image** erstellt und wie man Tagging, Caching, Multi-Stage-Builds und Multi-Architekturen für zuverlässige Deployments kontrolliert.

---

## 1. Schnellstart

```bash
# im Verzeichnis, das Dockerfile und App-Quellen enthält
docker build -t myapp:latest .
```

**Wichtige Optionen**

* `-t name:tag` — setzt den Namen und Tag des Images.
* `-f path/to/Dockerfile` — verwendet ein alternatives Dockerfile.
* `--no-cache` — ignoriert Cache (erzwingt kompletten Neuaufbau).
* `--pull` — prüft immer auf neuere Basisimages.
* `--build-arg KEY=VALUE` — übergibt Build-Variablen.
* `--target STAGE` — baut nur eine spezifische Stage (Multi-Stage-Builds).
* `--progress=plain` — detaillierte Logs (praktisch in CI).

---

## 2. Grundkonzepte

### Image, Layer und Cache

* Jede Dockerfile-Anweisung erzeugt einen **Layer**.
* Der Build-Cache nutzt Layer erneut, wenn **Anweisung + Input** (Dateien, Args, Base Image Digest) unverändert sind.
* Anweisungen von **stabil → volatil** anordnen, um Cache optimal zu nutzen.

### Build Context

* Der **Build Context** ist alles, was aus dem angegebenen Verzeichnis (`.`) an den Daemon gesendet wird.
* Verwende **`.dockerignore`**, um unnötige Dateien (z. B. `.git`, `node_modules`, Logs) auszuschließen → **schnellere Builds & kleinere Images**.

Beispiel `.dockerignore`:

```bash
.git
node_modules
*.log
dist/
.env
Dockerfile*
```

---

## 3. Dockerfile Aufbau (Minimal → Solide)

```dockerfile
# 1. Basisimage
FROM node:22-slim

# 2. Metadaten (für Nachvollziehbarkeit)
LABEL org.opencontainers.image.source="https://github.com/acme/myapp" \
      org.opencontainers.image.version="1.2.3"

# 3. Arbeitsverzeichnis
WORKDIR /app

# 4. Zuerst nur Manifest-Dateien kopieren (Cache-Vorteil)
COPY package*.json ./

# 5. Abhängigkeiten installieren (cache-freundlich)
RUN npm ci --omit=dev

# 6. Restliche Dateien kopieren
COPY . .

# 7. Build (falls nötig)
RUN npm run build

# 8. Startkommando
CMD ["node", "dist/server.js"]
```

**Hinweise**

* **Abhängigkeiten getrennt kopieren** → Cache bleibt erhalten, wenn nur Quellcode geändert wird.
* Verwende `npm ci` / `pip install --no-cache-dir` / `poetry install --no-root` für **deterministische Builds**.
* **OCI Labels** hinzufügen: `org.opencontainers.image.*`.

---

## 4. Tagging, Benennung und Versionierung

* Format: `registry/namespace/name:tag`
  Beispiele: `myrepo/web:1.4.0`, `ghcr.io/acme/api:2025-08-18`

* Strategie:

  * **Unveränderliche Tags** (z. B. Commit SHA) für Deployments.
  * Zusätzlich **bewegliche Tags** (`:latest`, `:main`) als Convenience.

* Beispiel:

```bash
docker tag myapp:build-abc123 myorg/myapp:1.4.0
docker push myorg/myapp:1.4.0
```

---

## 5. Caching optimieren

* Standardmäßig: Layer-Caching.
* `--no-cache` — erzwingt Neuaufbau aller Layer.
* `--pull` — aktualisiert Basisimage.
* Reihenfolge optimieren: **OS-Pakete / Dependencies zuerst**, volatile Dateien später.
* Best Practice: Lockfiles zuerst kopieren → Installation → Rest kopieren.

---

## 6. Multi-Stage-Builds (kleiner, sicherer)

```dockerfile
# Stage 1: Build
FROM golang:1.22 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o app ./cmd/server

# Stage 2: Runtime
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /src/app /app/app
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/app/app"]
```

**Vorteile**

* Kleinere Angriffsfläche
* Schnellere Deployments
* Keine Compiler/Dev-Tools im Runtime-Image

---

## 7. Build-Argumente, ENV und Secrets

### Build Args (nur zur Buildzeit)

```dockerfile
ARG NODE_ENV=production
RUN echo "Building for $NODE_ENV"
```

```bash
docker build --build-arg NODE_ENV=production -t myapp:prod .
```

### ENV (zur Laufzeit)

```dockerfile
ENV TZ=UTC
```

### Secrets (mit BuildKit)

```dockerfile
# syntax=docker/dockerfile:1.7
FROM alpine:3.20
RUN --mount=type=secret,id=npm_token \
    sh -c 'echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/npm_token)" > ~/.npmrc'
```

```bash
DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,src=.secrets/npm_token \
  -t myapp:secure .
```

### SSH Forwarding

```dockerfile
# syntax=docker/dockerfile:1.7
RUN --mount=type=ssh git clone git@github.com:org/private-repo.git
```

```bash
docker build --ssh default -t myapp:with-ssh .
```

---

## 8. Reproduzierbare & sichere Builds

* Versionen fixieren / Digest nutzen:

  ```dockerfile
  FROM python@sha256:<digest>
  ```

* Lockfiles verwenden.
* Non-root User hinzufügen.
* Schichten minimieren, Caches aufräumen.
* Images validieren:

  ```bash
  docker run --rm myapp:latest --version
  docker inspect myapp:latest
  ```
  
* Regelmäßig rebuilden, um Security-Updates einzubinden.

---

## 9. BuildKit & Erweiterte Outputs

* Aktivieren:

  ```bash
  export DOCKER_BUILDKIT=1
  ```

* Multi-Plattform:

  ```bash
  docker buildx create --use --name multi
  docker buildx build --platform linux/amd64,linux/arm64 \
    -t myorg/myapp:1.4.0 --push .
  ```

* Nur Stage bauen:

  ```bash
  docker build --target builder -t myapp:builder .
  ```

* Alternative Outputs:

  ```bash
  docker buildx build --output type=local,dest=./out .
  docker buildx build --output type=docker -t myapp:dev .
  ```

---

## 10. Sprachspezifische Patterns

### Node.js

```dockerfile
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]
```

### Python

```dockerfile
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false \
 && poetry install --only main --no-root
COPY . .
CMD ["python", "-m", "myapp"]
```

### Go

→ Statisches Binary im Builder bauen und in distroless-Image kopieren.

---

## 11. Lokales Testen

```bash
docker run --rm -p 8080:8080 myapp:latest
curl -f http://localhost:8080/health
```

Healthcheck im Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
```

---

## 12. Push in ein Registry

```bash
docker login ghcr.io
docker tag myapp:1.4.0 ghcr.io/acme/myapp:1.4.0
docker push ghcr.io/acme/myapp:1.4.0
```

---

## 13. CI/CD Tipps

* Caching über Builds hinweg (`--cache-from`).
* Automatische Security-Scans integrieren.
* Images durch **Tagging** promoten, nicht neu bauen.

---

## 14. Optimierung der Image-Größe

* Verwende **slim/alpine/distroless** Images.
* Multi-Stage-Builds.
* Temporäre Dateien in einem RUN aufräumen.
* `.dockerignore` einsetzen.
* Dependency-Optimierung (`npm ci --omit=dev`, `pip --no-cache-dir`).

---

## 15. Troubleshooting

* **Langsame Builds** → `.dockerignore` prüfen, Layer optimieren.
* **Änderungen fehlen** → Sind Dateien im Build Context? COPY-Pfade checken.
* **Permission Errors** → `USER` und `--chown` nutzen.
* **Base Image nicht aktualisiert** → `--pull` verwenden.

---

## 16. Aufräumen

```bash
docker image prune -f
docker builder prune -f
docker system prune -a
```

---

## 17. Befehlsübersicht (Cheat-Sheet)

```bash
docker build -t myapp:latest .
docker build -f build/Dockerfile -t myapp:dev .
docker build --build-arg NODE_ENV=production -t myapp:prod .
docker build --target builder -t myapp:builder .
docker build --progress=plain -t myapp:debug .
docker build --no-cache --pull -t myapp:nocache .
docker buildx build --platform linux/amd64,linux/arm64 -t myorg/myapp:multi --push .
docker history myapp:latest
docker inspect myapp:latest
docker push myorg/myapp:1.4.0
```

---

## 18. Übung

1. Schreibe ein **Multi-Stage-Dockerfile** für deine App.
2. Erstelle eine `.dockerignore` und optimiere die Layer-Reihenfolge.
3. Baue lokal, starte das Image und teste einen Health-Endpunkt.
4. Erstelle ein **Multi-Arch-Image** mit `buildx` und pushe es.
5. Vergleiche die Imagegrößen vor/nach Optimierung (`docker images`, `docker history`).
