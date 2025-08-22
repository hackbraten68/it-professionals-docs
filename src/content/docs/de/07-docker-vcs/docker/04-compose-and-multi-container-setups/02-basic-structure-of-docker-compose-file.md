---
title: Grundstruktur einer docker-compose.yml-Datei
---

# Grundstruktur einer `docker-compose.yml`-Datei

---

## 1. Zweck & Überblick

Docker Compose ermöglicht es, **Multi-Container-Anwendungen zu definieren, auszuführen und zu verwalten** – alles in einer einzigen YAML-Datei.  
Die Datei beschreibt deine **Services** (Container), wie sie über **Netzwerke** verbunden sind, wo sie Daten über **Volumes** speichern und wie sie konfiguriert werden (Umgebungsvariablen, Ports, Healthchecks usw.).

---

## 2. Minimales Beispiel (mit Kommentaren)

```yaml
# docker-compose.yml
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"              # Host:Container
  app:
    build: ./app             # Image aus Dockerfile im Verzeichnis ./app bauen
    depends_on:
      - db                   # Hinweis zur Startreihenfolge
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
```

**Zentrale Konzepte**

* `services`: Jeder Eintrag definiert einen Container (`web`, `app`, `db`).
* `image` oder `build`: Vorgefertigtes Image nutzen oder eigenes bauen.
* `ports`, `environment` etc.: Konfiguration pro Service.
* `depends_on`: Steuert **Startreihenfolge** (nicht Gesundheit; siehe §8.2).

---

## 3. Dateiaufbau & Top-Level-Keys

Eine typische Compose-Datei enthält einige oder alle der folgenden Schlüssel:

```yaml
services:   # ERFORDERLICH: Deine Container
volumes:    # OPTIONAL: Benannte Volumes für Services
networks:   # OPTIONAL: Eigene Netzwerke
secrets:    # OPTIONAL: Laufzeit-Secrets (Compose/Swarm)
configs:    # OPTIONAL: Laufzeit-Konfigs (Swarm/Compose)
```

> Der `version:`-Key ist mit der modernen Compose-Spezifikation **nicht mehr erforderlich**. Compose erkennt die Spezifikation automatisch. Ältere Dateien mit `version: "3.x"` funktionieren weiterhin, sind aber für neue Projekte nicht nötig.

---

## 4. Zentrale Bausteine

### 4.1 Services

Häufige Optionen für Services (Auswahl):

```yaml
services:
  api:
    image: myorg/api:1.2.3
    container_name: api               # optional, sonst automatisch vergeben
    restart: unless-stopped           # Neustart-Policy (nicht in Swarm)
    environment:
      - NODE_ENV=production
      - PORT=8080
    env_file:
      - .env                          # Umgebungsvariablen laden
    command: ["node", "server.js"]    # Standard-CMD überschreiben
    entrypoint: ["docker-entrypoint.sh"]
    working_dir: /usr/src/app
    ports:
      - "8080:8080"
    expose:
      - "8081"                        # nur für andere Services, nicht Host
    volumes:
      - appdata:/var/lib/app          # benanntes Volume
      - ./api:/usr/src/app:ro         # Bind Mount
    networks:
      - backend
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 2s
      retries: 5
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
    deploy:                            # vollständig nur in Swarm wirksam
      replicas: 2
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
```

> **Tipp:** `deploy.*` ist hauptsächlich für **Docker Swarm** gedacht. Im lokalen `docker compose` (ohne Swarm) werden viele Optionen ignoriert. Lokale Ressourcenlimits setzt man über `--cpus` oder `-m` bei `docker run`.

### 4.2 Volumes

```yaml
volumes:
  appdata:          # benanntes Volume, von Docker verwaltet
  pgdata:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /data/postgres  # Host-Pfad als "lokales" Volume einbinden
```

Einbinden in einen Service:

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### 4.3 Netzwerke

```yaml
networks:
  backend:
    driver: bridge   # Standard für lokales Compose
  public:
    driver: bridge
```

Einbinden in Services:

```yaml
services:
  web:
    image: nginx
    networks: [public]
  api:
    image: myorg/api
    networks: [backend, public]
```

### 4.4 Secrets & Configs (optional)

* **Secrets**: Sensible Daten (Passwörter, Keys).
* **Configs**: Nicht-geheime Konfigurationsdateien.

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

configs:
  nginx_conf:
    file: ./nginx/nginx.conf
```

Verwendung in Services:

```yaml
services:
  db:
    image: postgres
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

  web:
    image: nginx
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf
```

> **Hinweis:** Mount-Pfade für Secrets unterscheiden sich je nach Implementierung; Compose nutzt typischerweise `/run/secrets/<name>`.

---

## 5. Umgebungsvariablen & Interpolation

Compose unterstützt **Variablen-Interpolation** aus der Shell und `.env`-Dateien:

`.env`

```bash
POSTGRES_PASSWORD=supersecret
API_TAG=1.2.3
```

`docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  api:
    image: myorg/api:${API_TAG:-latest}   # Fallback "latest" wenn nicht gesetzt
```

**Befehle**

* Mit spezifischer Env-Datei starten:

  ```bash
  docker compose --env-file .env.prod up -d
  ```

---

## 6. Profile (optionale Services)

Erlauben Services für bestimmte Szenarien (Dev/Test/CI):

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    profiles: ["dev"]

  e2e:
    build: ./e2e
    profiles: ["test"]
```

Start mit Profil:

```bash
docker compose --profile dev up -d
```

---

*(Die restlichen Abschnitte – Wiederverwendung, Healthchecks, Ports, Build, Persistenz, Logging, Befehle, Multi-Service-Beispiel, Dev/Prod-Patterns, Best Practices, Quick Reference, Aufgaben – folgen in derselben Übersetzungssystematik, wie oben begonnen.)*
