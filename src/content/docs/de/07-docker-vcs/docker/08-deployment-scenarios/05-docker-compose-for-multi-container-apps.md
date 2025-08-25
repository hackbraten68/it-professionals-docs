---
title: Docker Compose für Multi-Container-Apps
---
# Docker Compose für Multi-Container-Apps

Docker Compose vereinfacht die Definition, Vernetzung und Verwaltung von Anwendungen, die aus mehreren Services bestehen (z. B. Frontend, Backend, Datenbanken, Queues). Durch die Deklaration in einer einzigen YAML-Datei entstehen reproduzierbare Umgebungen für Entwicklung und Produktion.

---

## Lernziele

* Grundkonzepte von Compose: **Services, Netzwerke, Volumes** und die Compose-Datei.
* Wichtige Befehle für **Build, Start, Skalierung, Debugging**.
* Muster für **Entwicklung vs. Produktion**, Konfiguration, Secrets, Health Checks und Abhängigkeiten.
* Praxisbeispiele, die direkt einsetzbar sind.

---

## Warum Docker Compose?

* **Single Source of Truth:** Die gesamte App-Topologie in einer `docker-compose.yml`.
* **Konsistente Umgebungen:** Gleiche Datei auf verschiedenen Rechnern und in CI/CD.
* **Einfache Orchestrierung:** Start/Stopp/Skalierung mehrerer Services mit nur einem Befehl.
* **Integriertes Networking:** Automatische Service-Discovery über Servicenamen.
* **Flexible Konfiguration:** Überschreiben, erweitern und Profile nutzen.

> Hinweis: Moderne Docker-Versionen nutzen `docker compose` (mit Leerzeichen) für Compose V2. Ältere Installationen verwenden `docker-compose` (mit Bindestrich).

---

## Minimales Beispiel

```yaml
# docker-compose.yml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis
  redis:
    image: redis:7-alpine
```

Starten:

```bash
docker compose up -d
# oder: docker-compose up -d
```

---

## Bausteine von Compose

### Services

* Definieren, wie ein Container läuft.
* Wichtige Felder:

  * `image`, `build`, `command`, `environment`, `env_file`
  * `ports`, `volumes`, `networks`
  * `depends_on`, `healthcheck`, `restart`, `profiles`

### Netzwerke

* Automatisch erstellt, falls nicht angegeben.
* Services erreichen sich per **Servicename**.
* Eigene Netzwerke ermöglichen Isolierung.

```yaml
networks:
  backend:
  frontend:
services:
  api:
    image: ghcr.io/example/api:latest
    networks: [backend]
  db:
    image: postgres:16
    networks: [backend]
  ui:
    build: ./ui
    networks: [frontend]
```

### Volumes

* Für persistente Daten oder Code-Sharing.

```yaml
volumes:
  pgdata: {}
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### Umgebungsvariablen & Konfiguration

* Direkt oder über `.env` Dateien.

```yaml
services:
  api:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:${DB_PASSWORD}@db:5432/app
    env_file:
      - .env
```

`.env` Beispiel:

```bash
DB_PASSWORD=supersecret
```

---

## Realistisches Multi-Service-Beispiel

```yaml
version: "3.9"

x-common-env: &common_env
  TZ: "UTC"
  APP_LOG_LEVEL: "info"

services:
  reverse-proxy:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
    volumes:
      - ./ops/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
      - ui
    restart: unless-stopped

  ui:
    build: ./ui
    environment:
      <<: *common_env
      VITE_API_BASE: "http://reverse-proxy"
    volumes:
      - ./ui:/app
    restart: unless-stopped

  api:
    build: ./api
    environment:
      <<: *common_env
      DATABASE_URL: postgres://app:app@db:5432/app
      REDIS_URL: redis://cache:6379/0
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 5
    ports:
      - "3000:3000"
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
    restart: unless-stopped

  cache:
    image: redis:7-alpine
    command: ["redis-server", "--save", "", "--appendonly", "no"]
    restart: unless-stopped

volumes:
  dbdata: {}
```

Highlights:

* **`x-common-env`**: Wiederverwendbare Umgebungsvariablen.
* **`depends_on`** mit Bedingungen für Service-Reihenfolge.
* Nginx als **Reverse Proxy**.

---

## Dev vs. Prod Muster

### Getrennte Dateien

* `docker-compose.yml`: Basis
* `docker-compose.override.yml`: automatisch für Dev
* `docker-compose.prod.yml`: für Produktion

```bash
# Dev
docker compose up -d

# Prod
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Beispiel `docker-compose.prod.yml`:**

```yaml
services:
  ui:
    volumes: []       
  api:
    environment:
      APP_LOG_LEVEL: "warn"
  reverse-proxy:
    ports:
      - "80:80"
      - "443:443"
```

### Profile

Optionale Services nur bei Bedarf starten.

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    profiles: ["dev"]
```

```bash
docker compose --profile dev up -d
```

---

## Skalierung

```bash
docker compose up -d --scale api=3
```

* Nur sinnvoll für **zustandslose Services**.
* Für echte Multi-Host Orchestrierung: **Kubernetes oder Swarm**.

---

## Health Checks & Abhängigkeiten

* `healthcheck` prüft Bereitschaft.
* `depends_on` steuert Startreihenfolge.

---

## Konfiguration & Secrets

* **Keine Secrets ins Image einbauen!**
* Nutzung:

  * `.env` (lokal/dev)
  * `secrets:` (Docker Swarm)
  * externe Manager wie Vault

Beispiel:

```yaml
services:
  api:
    environment:
      JWT_PRIVATE_KEY_PATH: /run/secrets/jwt_key
    volumes:
      - ./secrets/jwt_key:/run/secrets/jwt_key:ro
```

---

## Logging & Monitoring

* Logs: `docker compose logs -f api`
* Restart Policies: `restart: unless-stopped`
* Erweiterbar mit:

  * **Prometheus**
  * **cAdvisor**
  * **Loki / Fluent Bit**

---

## Typische Befehle

```bash
docker compose up -d        # Starten
docker compose ps           # Status
docker compose stop         # Stoppen
docker compose logs -f api  # Logs streamen
docker compose exec api sh  # In Container einloggen
docker compose down -v      # Stoppen + Volumes löschen
```

---

## Sicherheit

* **Keine Docker-Socket-Mounts**.
* Container als **non-root** laufen lassen.
* Images aktuell halten (z. B. mit **Trivy** scannen).
* Nur notwendige Ports veröffentlichen.
* Zusätzliche Hardening-Optionen: `cap_drop`, `security_opt`.

---

## Fazit

1. Modellierung der App als **klare Services**.
2. Konfiguration über Variablen und Dateien, **Secrets geschützt halten**.
3. Nutzung von **Health Checks** und Abhängigkeiten.
4. **Dev und Prod** mit Overrides oder Profilen trennen.
5. Monitoring und Logging einplanen.

Mit diesen Mustern kannst du Multi-Container-Anwendungen effizient mit Docker Compose in Entwicklung **und** Produktion betreiben.
