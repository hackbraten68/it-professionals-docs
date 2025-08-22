---
title: Praxisbeispiel – Fullstack-App
---

# Praxisbeispiel — Full-Stack-App mit Docker Compose

Dieses Handbuch verwandelt das folgende Compose-Snippet in ein vollständiges, produktionsreifes und **lehrbares** Beispiel. Es erklärt jeden Teil, ergänzt sinnvolle Defaults (Health Checks, Umgebungsvariablen, Hot-Reload für Entwicklung, Backups) und zeigt, wie man es für reale Projekte erweitert.

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## 1. Was dieser Stack macht

* **frontend**: Eine statische Seite oder SPA (z. B. React/Vite), ausgeliefert von einem kleinen Webserver (oft Nginx).
* **backend**: Eine API (Node/Express, Flask/FastAPI, Spring Boot, etc.), die mit der Datenbank verbunden ist.
* **db**: Eine PostgreSQL-Instanz, deren Daten in einem **benannten Volume** (`db-data`) gespeichert werden.

### Warum Compose?

* Ein einziger Befehl zum Starten/Stoppen der gesamten App.
* Integriertes Netzwerk, sodass sich Services gegenseitig über ihren Servicenamen erreichen können (`backend` → `db`).
* Einfaches Hinzufügen von Hilfsdiensten (Admin-UI, Migrationstools, Testrunner) mit **Profiles**.

---

## 2. Empfohlene Projektstruktur

```bash
project-root/
├─ compose.yaml
├─ .env                      # gemeinsame Umgebungsvariablen (keine Secrets)
├─ frontend/
│  ├─ Dockerfile
│  └─ ... (App-Quellcode)
├─ backend/
│  ├─ Dockerfile
│  ├─ .env                   # nur für Backend, lokale Entwicklung
│  └─ src/
└─ ops/
   ├─ initdb/                # SQL-Init-Skripte für Postgres (optional)
   └─ backups/               # Backup-/Restore-Skripte
```

> Halte **Secrets** aus Git fern. Nutze `.env` nur für **nicht-sensitive** Konfigurationen; echte Secrets über `.env.local`, einen Secrets-Manager oder Compose `secrets:` injizieren.

---

## 3. Erweiterte `compose.yaml` (entwicklerfreundlich)

```yaml
name: fullstack-app

services:
  frontend:
    build:
      context: ./frontend
      target: prod
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    volumes:
      - ./frontend:/app:delegated
    environment:
      - VITE_API_URL=http://localhost:5000
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/ || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 5

  backend:
    build:
      context: ./backend
      target: dev
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - PORT=5000
      - NODE_ENV=development
    volumes:
      - ./backend:/app:delegated
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:5000/health"]
      interval: 10s
      timeout: 3s
      retries: 5

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=${DB_USER:-user}
      - POSTGRES_PASSWORD=${DB_PASS:-pass}
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./ops/initdb:/docker-entrypoint-initdb.d:ro
    expose:
      - "5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 5s
      timeout: 3s
      retries: 10

  pgadmin:
    image: dpage/pgadmin4
    profiles: ["tools"]
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@example.com
      - PGADMIN_DEFAULT_PASSWORD=admin123
    ports:
      - "5050:80"
    depends_on:
      db:
        condition: service_healthy

volumes:
  db-data:
```

**Highlights**

* `depends_on.condition: service_healthy` stellt sicher, dass ein Service erst startet, wenn der vorherige gesund ist.
* **Bind Mounts** ermöglichen Hot Reload.
* **Profiles** erlauben optionale Tools.
* Umgebungsvariablen werden aus `.env` geladen.

---

## 4. Beispiel `.env`

```bash
DATABASE_URL=postgres://user:pass@db:5432/mydb
DB_USER=user
DB_PASS=pass
```

> Keine echten Secrets committen – stattdessen `.env.local`, `secrets:` oder externe Secret-Manager verwenden.

---

## 5. Service-Details

### Frontend

* Baut statische Dateien (z. B. React/Vite).
* In Dev per Dev-Server mit Hot Reload.
* `VITE_API_URL` verweist auf die API.

### Backend

* Läuft auf `:5000`.
* Nutzt `DATABASE_URL`.
* Sollte einen `/health`-Endpoint bieten.

### Datenbank

* Nutzt Volume `db-data`.
* Init-Skripte laufen beim ersten Start.
* Healthcheck: `pg_isready`.

---

## 6. Networking

* Compose erstellt ein eigenes Netzwerk.
* Service-Namen sind DNS-Hostnames.
* Zugriff vom Host:

  * `http://localhost:3000` → Frontend
  * `http://localhost:5000` → Backend
  * `5432` nur verfügbar, wenn explizit gemappt.

---

## 7. Persistenz & Backups

* Named Volumes überleben Neustarts.
* Backups per `pg_dump`/`psql`.
* Automatisiert via Cron oder dediziertem Service.

---

## 8. Migrationen & Seeds

* Tools wie Prisma, Sequelize, Knex, Alembic etc.
* Migrationsbefehl im Backend beim Start.
* Seeds über Skripte oder Init-SQL.

---

## 9. Healthchecks & Startreihenfolge

* `depends_on` nur Reihenfolge, nicht Readiness.
* Nutze Healthchecks + `condition: service_healthy`.

---

## 10. Observability

* Logs über `docker compose logs`.
* API-Logging, DB-Slow-Query-Logging.
* Optional Prometheus/Grafana hinzufügen.

---

## 11. Wichtige Befehle

```bash
docker compose up        # Start
docker compose up -d     # Start im Hintergrund
docker compose down      # Stop (Volumes bleiben)
docker compose build     # Neu bauen
docker compose ps        # Status
docker compose logs -f   # Logs streamen
docker compose exec backend bash   # Shell im Backend
docker compose run --rm backend npm test
docker compose --profile tools up -d   # Extras starten
```

---

## 12. Troubleshooting

* **Backend erreicht DB nicht**: Hostname `db` prüfen, Logs ansehen.
* **Port belegt**: Mapping ändern oder Prozess stoppen.
* **CORS-Probleme**: CORS im Backend konfigurieren.
* **Hot Reload geht nicht**: Volumes prüfen, Dev-Watcher nutzen.
* **Daten verloren**: `down -v` löscht Volumes – vorsichtig!

---

## 13. Sicherheit & Secrets

* Keine Secrets committen.
* `secrets:` oder externe Manager nutzen.
* Minimal-Images verwenden.
* Nur benötigte Ports veröffentlichen.

---

## 14. Von Dev zu Prod

* Reverse Proxy + TLS (Traefik, Caddy, Nginx).
* DB auslagern (Managed Service).
* Stateless Services skalieren.
* Backend auf `prod`-Stage umstellen, keine Bind Mounts.
* Secrets über Vault/Doppler/SSM.

---

## 15. Minimaler Testplan

1. Build läuft fehlerfrei.
2. Services zeigen `healthy`.
3. `/health` liefert 200, Frontend lädt.
4. Datenbank-Operation testen.
5. Neustart: Daten bestehen.
6. Backup + Restore erfolgreich.

---

## 16. Verbesserungen gegenüber Original

* Healthchecks + Bedingungen.
* `.env` und `secrets:` nutzen.
* Hot Reload für Dev.
* Backups automatisieren.
* Profiles für optionale Tools.
* Dev-/Prod-Stages trennen.

---

## 17. Kleine Übungen

1. `/health`-Endpoint hinzufügen.
2. Migrationstool einbinden.
3. pgAdmin-Profil ergänzen.
4. Multi-Stage-Build fürs Frontend.
5. DB gegen Managed Postgres tauschen.
6. Reverse Proxy ergänzen.

---

## Fazit

Mit diesem Compose-Setup erhält man eine **realistische, durchgängige** Entwicklungsumgebung mit minimalem Setup. Ergänzt man Healthchecks, Profiles, Secrets und saubere Dockerfiles, wird daraus ein **lehrbares**, **zuverlässiges** und überall einsetzbares Stack – startklar mit einem einzigen Befehl.
