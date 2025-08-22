---
title: Ausführen und Verwalten von Compose
---

# Ausführen & Verwalten von Docker Compose

Ein praktischer, umfassender Leitfaden für den täglichen Einsatz von Docker Compose in Entwicklung, CI und kleinen Deployments.

> **Hinweis zu CLI-Namen:** Modernes Docker verwendet **`docker compose`** (mit Leerzeichen, **v2**). Viele Anleitungen zeigen noch **`docker-compose`** (mit Bindestrich, Legacy **v1**). Alle Befehle unten funktionieren gleich – nutze die Form, die deine Umgebung unterstützt.

---

## 1. Zentrale Lifecycle-Befehle

### Services starten

```bash
docker compose up            # build (falls nötig) + erstellen + starten + Logs anhängen
docker compose up -d         # gleiches, aber detached (läuft im Hintergrund)
```

Nützliche Flags:

* `--build` – erzwingt ein Rebuild vor dem Start
* `--no-build` – baut nicht, auch wenn nötig
* `--force-recreate` – Container auch ohne Änderungen neu erstellen
* `--renew-anon-volumes` – ersetzt anonyme Volumes, um veraltete Daten zu vermeiden
* `--remove-orphans` – entfernt Container von nicht mehr definierten Services
* `--scale SERVICE=NUM` – startet N Replikate eines Services (z. B. `web=3`)

### Stoppen & Entfernen

```bash
docker compose down          # stoppt und entfernt Container sowie das Standard-Netzwerk
```

Destruktive Optionen:

* `--volumes` – entfernt auch benannte & anonyme Volumes, die durch Compose erstellt wurden
* `--rmi local` oder `--rmi all` – entfernt Images (vorsichtig!)
* `--remove-orphans` – räumt übrig gebliebene Container auf
* `--timeout SECONDS` – Zeitfenster für sauberes Stoppen vor SIGKILL

> **Wann `stop` vs. `down` nutzen:**
> `docker compose stop` stoppt Container, **behält** sie aber inkl. Netzwerk für schnellen Neustart.
> `docker compose down` **entfernt** sie komplett (Clean Slate).

### Images bauen

```bash
docker compose build         # baut alle Services mit build context
docker compose build web     # baut nur einen Service
```

Häufige Flags:

* `--no-cache` – ignoriert Build-Cache
* `--pull` – zieht immer neueste Base-Images
* `--progress=plain` – vollständige Logs für CI

---

## 2. Beobachtung & Diagnose

### Logs

```bash
docker compose logs                  # aggregierte Logs aller Services
docker compose logs api              # Logs eines einzelnen Services
docker compose logs -f --tail=100    # folgen, letzte 100 Zeilen
```

Flags:

* `--timestamps` – zeigt Timestamps
* `--no-color` – monochrom (z. B. CI, Datei-Export)

### Container auflisten

```bash
docker compose ps            # laufende Service-Container
docker compose ps -a         # inkl. gestoppte
docker compose ps --services # nur Servicenamen
```

Tipp: mit Docker filtern:

```bash
docker ps --filter "label=com.docker.compose.project=<projekt>"
```

### Shell-Zugriff & Ad-hoc-Kommandos

```bash
docker compose exec web sh           # Shell in laufendem Container öffnen
docker compose exec db psql -U user  # Kommando direkt im Container ausführen
```

Falls kein Shell vorhanden: `bash -lc` oder CLI des Services verwenden.

**Einmalige Container** mit Service-Config (Netzwerk/Umgebung/Volumes):

```bash
docker compose run --rm web node scripts/seed.js
```

Unterschiede:

* `exec` – läuft **innerhalb** eines existierenden Containers
* `run` – erstellt einen **neuen** temporären Container

---

## 3. Management-Cheatsheet

| Aufgabe                    | Befehl                                                                 |
| -------------------------- | ---------------------------------------------------------------------- |
| Start im Hintergrund       | `docker compose up -d`                                                 |
| Live-Logs verfolgen        | `docker compose logs -f`                                               |
| Rebuild + Neustart         | `docker compose up -d --build`                                         |
| Alles sauber neu aufsetzen | `docker compose down && docker compose up -d --build --remove-orphans` |
| Service skalieren          | `docker compose up -d --scale worker=5`                                |
| Container betreten         | `docker compose exec api sh`                                           |
| Stoppen ohne Entfernen     | `docker compose stop`                                                  |
| Entfernen inkl. Volumes    | `docker compose down --volumes`                                        |

---

## 4. Laufzeit-Konfigurationen

### Projektname

Compose leitet einen **Projektnamen** (für Container-, Netzwerk- & Volume-Labels) aus dem Verzeichnis ab. Überschreiben, um Kollisionen zu vermeiden:

```bash
docker compose -p meinprojekt up -d
# oder via env: COMPOSE_PROJECT_NAME=meinprojekt
```

### Dateien & Overrides

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

* Spätere Dateien überschreiben frühere (ideal für Umgebungsvarianten).
* Standardmuster: Basis in `docker-compose.yml`, Entwicklungsdetails in `docker-compose.override.yml`.

### Environment-Dateien

```bash
docker compose --env-file .env.dev up -d
```

* `.env`-Variablen können Ports, Versionen, Credentials parameterisieren.
* Keine Secrets einchecken – besser Secret Manager in Produktion.

### Profile (selektiver Start)

In `docker-compose.yml`:

```yaml
services:
  admin:
    image: myorg/admin:latest
    profiles: ["ops"]
```

Starten:

```bash
docker compose --profile ops up -d
```

---

## 5. Health, Restart & Persistenz

### Healthchecks

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 2s
      retries: 5
      start_period: 20s
```

* Status sichtbar in `ps` (`healthy`, `starting`).
* Mit `depends_on: condition: service_healthy` kombinierbar (ab v3.4).

### Restart-Policies

```yaml
services:
  worker:
    restart: unless-stopped   # Optionen: "no" | always | on-failure[:max]
```

* Neustart mit `docker compose restart [SERVICE]`.

### Volumes

* Benannte Volumes überleben Rebuilds.
* `down --volumes` nur, wenn Daten wirklich gelöscht werden sollen.

---

## 6. Netzwerke & Namen

* Standardmäßig ein gemeinsames Projekt-Netzwerk → Services per **Name** erreichbar (`db:5432`).
* Externe Ports via `ports:` oder `-p`.
* Zusätzliche `networks:` für Isolation oder externe Anbindung.

---

## 7. CI/CD & Produktionstipps

* **Deterministische Builds:** feste Tags (`postgres:16.3`) nutzen.
* **Build Cache in CI:** mit `--cache-from` oder BuildKit Caches.
* **Read-only Runtimes:** nur explizite Mounts beschreibbar machen.
* **Secrets:** nicht in Images oder Compose-Dateien einbetten. CI/Secret Manager nutzen.
* **Trennung:** Images in CI bauen & pushen, auf Server nur `pull + up`.

---

## 8. Troubleshooting

### Port bereits belegt

```bash
lsof -i :3000   # macOS/Linux
```

→ Port ändern oder Dienst beenden.

### Code-Änderungen nicht sichtbar

* Mit Bind Mounts (`./src:/app/src`) sofort wirksam.
* Wenn ins Image kopiert: neu bauen & hochfahren:

```bash
docker compose build api && docker compose up -d api
```

### Verwaiste Container

```bash
docker compose up -d --remove-orphans
```

### Hängende Zustände/Volumes

```bash
docker compose down --volumes --remove-orphans
docker volume ls | grep <projekt>
```

### Berechtigungsfehler mit Volumes

* UID/GID prüfen oder `user:` in Compose setzen.
* Datenbanken: niemals Volumes löschen ohne Backup.

---

## 9. Nützliche Zusatzbefehle

* **`docker compose config`** – validiert & zeigt finale Config
* **`docker compose pull [SERVICE]`** – Images ziehen
* **`docker compose push [SERVICE]`** – Images pushen
* **`docker compose rm`** – gestoppte Service-Container entfernen
* **`docker compose pause` / `unpause`** – Prozesse einfrieren/fortsetzen

---

## 10. Beispiel-Workflows

### Lokale Entwicklung

```bash
docker compose up -d --build   # erster Start
docker compose exec api sh     # Debugging
docker compose logs -f api     # Logs verfolgen
docker compose build api && docker compose up -d api   # nach Dockerfile-Änderung
```

### Sauberes Rebuild mit Daten

```bash
docker compose down --remove-orphans
docker compose up -d --build
```

### Vollständiges Reset (inkl. Daten) – **destruktiv**

```bash
docker compose down --volumes --rmi local --remove-orphans
docker compose up -d --build
```

---

## 11. Kurzreferenz

* `docker-compose up` – startet definierte Services
* `docker-compose up -d` – startet detached
* `docker-compose down` – stoppt & entfernt Container + Standard-Netzwerk
* `docker-compose build` – baut Images (bei `build:` context)
* `docker-compose logs` – zeigt Logs aller Services (`-f` für Follow)
* `docker-compose ps` – zeigt laufende Container

*(In moderner Docker-Version: `docker compose` statt `docker-compose`.)*

---

## 12. Best Practices

* **Benannte Volumes** für Daten nutzen, nur mit Bedacht löschen.
* Änderungen mit **`docker compose up -d --build --remove-orphans`** anwenden.
* **Projektname & Profile** für Ordnung verwenden.
* Mit **`docker compose config`** vor CI/CD validieren.
* Compose als **Single-Host-Orchestrierung** sehen; für Multi-Host: Swarm/Kubernetes.
