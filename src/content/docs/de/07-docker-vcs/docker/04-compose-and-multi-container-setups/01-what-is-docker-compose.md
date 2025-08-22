---
title: Was ist Docker Compose?
---

## Was ist Docker Compose?

*Zielgruppe: Lernende und Praktiker, die ein klares und praxisnahes Verständnis von Docker Compose für die Entwicklung und das Testen von Multi-Container-Anwendungen erhalten möchten.*

---

## 1. Konzept & Zweck

**Docker Compose** ist ein Werkzeug, mit dem man **Multi-Container-Anwendungen** in einer einzigen deklarativen Datei definieren, ausführen und verwalten kann – typischerweise `docker-compose.yml` oder `compose.yaml`.  
Anstatt viele `docker run`-Befehle manuell auszuführen und Netzwerke/Volumes einzeln zu konfigurieren, **beschreibt** man mit Compose seine Services (Container), wie sie verbunden sind und welche Ressourcen sie benötigen – und startet alles mit nur einem Befehl.

**Warum das wichtig ist**

* **Konsistenz:** Eine einzige versionierte Datei beschreibt die komplette Laufzeitumgebung (Services, Netzwerke, Volumes).
* **Reproduzierbarkeit:** Ein einziger Befehl erstellt die gleiche Umgebung auf beliebigen Rechnern.
* **Geschwindigkeit für Entwickler:** Schnelleres Setup, leichteres Onboarding, weniger manuelle Konfiguration.
* **Portabilität:** Compose-Dateien können im Repository mitgeführt und in CI/CD, Demos oder Tests genutzt werden.

---

## 2. Zentrale Bausteine

Eine Compose-Datei basiert auf **YAML** und hat einige wichtige Hauptsektionen:

* `services:` Container, die laufen sollen (z. B. web, api, db, cache, worker …)
* `volumes:` Datenpersistenz-Einheiten, die von Services eingebunden werden
* `networks:` isolierte virtuelle Netzwerke, die Services verbinden
* `configs:` & `secrets:` strukturierte Dateien/Werte, die Services bereitgestellt werden können

Minimalbeispiel:

```yaml
# compose.yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
````

Starten:

```bash
docker compose up
```

Stoppen und Entfernen von Containern, Netzwerken (aber **Behalten** benannter Volumes):

```bash
docker compose down
```

---

## 3. Typisches Multi-Service-Beispiel

```yaml
# compose.yaml
services:
  app:
    build: ./app
    command: npm run dev
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./app:/usr/src/app # Hot Reload in Entwicklung
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: appdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - dbdata:/var/lib/postgresql/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  dbdata:
```

**Highlights**

* `depends_on` + `healthcheck` verbessern die Startreihenfolge (App startet erst, wenn DB bereit ist).
* Das benannte Volume `dbdata` erhält Daten auch nach Neustarts.
* Bind-Mount `./app:/usr/src/app` erlaubt Live-Codebearbeitung.

---

## 4. Wichtige Befehle (Compose V2 Syntax)

> Moderne Docker-Installationen nutzen **`docker compose`** (mit Leerzeichen), nicht mehr `docker-compose` (mit Bindestrich).

```bash
# Alles starten (inkl. Build), Logs im Vordergrund
docker compose up --build

# Im Hintergrund starten
docker compose up -d

# Stoppen + Entfernen von Containern und Default-Netzwerk (Volumes bleiben)
docker compose down

# Auch benannte Volumes löschen
docker compose down -v

# Status anzeigen
docker compose ps

# Logs streamen (alle oder pro Service)
docker compose logs -f
docker compose logs -f app

# Befehle in einem laufenden Container ausführen
docker compose exec app sh
docker compose exec db psql -U postgres -d appdb

# Images nur bauen, nicht starten
docker compose build

# Einzelnen Service starten/stoppen
docker compose up -d app
docker compose stop app

# Services skalieren
docker compose up -d --scale worker=3
```

---

## 5. Wichtige Service-Optionen

Innerhalb von `services.<name>`:

* **`image`**: Vorhandenes Image verwenden.
* **`build`**: Eigenes Image aus Dockerfile bauen (z. B. `build: ./api` oder detailliert mit `context`, `dockerfile`, `args`).
* **`ports`**: Host-zu-Container-Mapping (`"8080:80"`).
* **`environment`**: Umgebungsvariablen (inline oder aus Dateien).
* **`volumes`**: Bind Mounts (`./code:/app`) und benannte Volumes (`data:/var/lib/...`).
* **`depends_on`**: Startreihenfolge; mit Bedingungen + Healthchecks für Betriebsbereitschaft.
* **`healthcheck`**: Testbefehle mit Intervallen und Retries.
* **`command` / `entrypoint`**: Standardbefehle überschreiben.
* **`restart`**: Neustart-Policies (`no`, `on-failure`, `always`, `unless-stopped`).
* **`networks`**: Anbindung an benutzerdefinierte Netzwerke.
* **`configs` / `secrets`**: Dateien/Werte bereitstellen (wo unterstützt).

Beispiel mit Build-Argumenten:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
      args:
        NODE_ENV: production
```

---

## 6. Netzwerkmodell

* Jedes Compose-Projekt hat ein **Default-Netzwerk**; Services können sich per **Servicename** erreichen (DNS).
  Beispiel: `http://db:5432`.
* Eigene Netzwerke können für Isolierung oder Front-/Backend-Trennung erstellt werden:

```yaml
networks:
  frontend:
  backend:

services:
  web:
    image: caddy
    networks: [frontend]
  api:
    build: ./api
    networks: [frontend, backend]
  db:
    image: postgres
    networks: [backend]
```

---

## 7. Volumes & Datei-Mounts

* **Bind Mounts** (Host-Pfad ↔ Container-Pfad) sind ideal für **Entwicklung** & Hot Reload.
* **Benannte Volumes** werden von Docker verwaltet und sind optimal für **persistente Daten**.

```yaml
services:
  app:
    volumes:
      - ./src:/app/src        # Bind Mount (Dev)
      - cachedata:/app/.cache # Named Volume (Persistenz)
volumes:
  cachedata:
```

**Tipp:** Nicht versehentlich wichtige Verzeichnisse der Basis-Images überschreiben (z. B. `node_modules`).

---

## 8. Umgebungsvariablen & `.env`

Compose unterstützt **Variablenersetzung** aus der Shell oder einer `.env`-Datei:

```yaml
services:
  web:
    image: ${WEB_IMAGE:-nginx:alpine}
    environment:
      - APP_ENV=${APP_ENV}
      - API_URL=${API_URL:-http://localhost:3000}
```

Beispiel `.env`:

```bash
APP_ENV=development
API_URL=http://localhost:3000
```

**Hinweise**

* Mit `${VAR:-default}` Standardwerte setzen.
* Keine sensiblen Daten in `.env`, wenn das Repo öffentlich ist → besser Secrets verwenden.

---

## 9. Profile (selektives Aktivieren)

**Profile** erlauben es, Services optional zu aktivieren, z. B. nur in Entwicklung:

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    ports: ["8025:8025"]
    profiles: ["dev"]
```

Starten mit:

```bash
docker compose --profile dev up -d
```

---

## 10. Mehrere Dateien & Overrides

Compose kann mehrere Dateien kombinieren – spätere überschreiben frühere. Übliche Struktur:

* `compose.yaml` – Basis
* `compose.override.yaml` – lokale Entwicklung (automatisch geladen, falls vorhanden)
* `compose.prod.yaml` – Produktion

Explizit anwenden:

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

---

## 11. Healthchecks & Startreihenfolge

Beispiel mit Healthcheck:

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 5

  app:
    build: ./app
    depends_on:
      db:
        condition: service_healthy
```

Verhindert, dass die App startet, bevor die Datenbank bereit ist.

---

## 12. CI, Tests & Temporäre Umgebungen

* **CI-Pipelines:** Images bauen → mit `docker compose up -d` Services starten → Tests via `exec` laufen lassen.
* **Ephemere Stacks:** Branch-spezifische Umgebungen starten, nach Review mit `down -v` entfernen.
* **Caching:** Layer-Caching beschleunigt Builds in CI.

---

## 13. Logs, Debugging & Fehlersuche

* `docker compose logs -f <svc>` → Logs verfolgen.
* `docker compose exec <svc> sh` → in Container einloggen.
* `docker inspect <container>` → Details prüfen (Env, Mounts, Netzwerke).
* Häufige Probleme:

  * Port-Konflikte → Host-Port ändern.
  * Rechtefehler bei Bind Mounts → Benutzer-IDs angleichen oder Volumes nutzen.
  * Hot Reload funktioniert nicht → sicherstellen, dass Mounts und Watcher korrekt laufen.
  * DNS-Probleme → Service-Namen statt `localhost` nutzen.

---

## 14. Muster & Rezepte

**Reverse Proxy + App + DB**

```yaml
services:
  proxy:
    image: caddy:2
    ports: ["80:80"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    depends_on: [app]
  app:
    build: ./app
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/appdb
  db:
    image: postgres:16-alpine
    volumes: [dbdata:/var/lib/postgresql/data]
volumes:
  dbdata:
```

**Worker-Pool**

```yaml
services:
  api:
    build: ./api
  worker:
    build: ./worker
    depends_on: [api, redis]
  redis:
    image: redis:alpine
```

---

## 15. Best Practices

* **Images schlank halten:** Multi-Stage-Builds, kleine Base-Images.
* **Single Responsibility:** Pro Service nur eine Hauptaufgabe (API, Worker, DB …).
* **Healthchecks + depends\_on** nutzen.
* **Volumes & Netzwerke klar benennen**.
* **Konfiguration via Env Vars**, keine Werte fest ins Image backen.
* **Dev vs. Prod trennen** mit Overrides & Profilen.
* **Nur notwendige Daten persistieren**.
* **Compose-Dateien versionieren** → Teil der App.

---

## 16. Compose V2 vs. V1

* **V2** ist die moderne Version, integriert in Docker: `docker compose`.
* **V1** (`docker-compose`) ist veraltet – V2 nutzen.

---

## 17. Aufräumen & Lifecycle

```bash
# Container stoppen, behalten
docker compose stop

# Container + Netzwerke löschen
docker compose down

# Alles inklusive Volumes löschen
docker compose down -v

# Nicht genutzte Images/Volumes entfernen
docker image prune
docker volume prune
```

---

## 18. Quick-Checkliste

* Habe ich **separate Services** für API, DB, Cache, Proxy?
* Sind die **Ports** korrekt und konfliktfrei?
* Sind **Env Vars** + `.env` richtig gesetzt?
* Nutze ich **Bind Mounts** für Code (Dev) und **Named Volumes** für Daten?
* Habe ich **Healthchecks** & **depends\_on**?
* Brauche ich **Profile** (z. B. Dev-Services)?
* Trenne ich **Dev vs. Prod** mit Overrides?

---

## 19. Weiterführende Ideen

* **TLS & Domains** mit Caddy/Traefik.
* **Profiles** für optionale Services.
* **CI-Integration** mit echten Stacks.
* **Secrets/Configs** produktionsreif einsetzen.

---

## 20. TL;DR

**Docker Compose** verwandelt eine Multi-Container-Anwendung in eine **deklarative Spezifikation**, die mit einem einzigen Befehl gestartet oder gestoppt werden kann. Es standardisiert Umgebungen, beschleunigt das Onboarding und ermöglicht verlässliche Integrationstests – ein unverzichtbares Werkzeug für moderne Container-Workflows.
