---
title: Lokales Deployment
---
# Lokales Deployment mit Docker — Ein Praxisorientierter Leitfaden

Lokales Deployment ist der schnellste Weg, Software während der Entwicklung, beim Testen oder für den persönlichen Gebrauch im kleinen Maßstab auszuführen. Dieser Leitfaden erweitert das Grundgerüst zu einer vollständigen, klar strukturierten Unterrichtseinheit, die in Schulungen oder internen Dokumentationen eingesetzt werden kann.

---

## 1) Was bedeutet „Lokales Deployment“?

**Definition:**
Ausführung einer containerisierten Anwendung auf einem einzelnen Entwicklerrechner (Laptop oder Workstation), ohne dass externe Cloud-Infrastruktur benötigt wird.

**Ziel:**
Verkürzung der Feedback-Schleife, schnelles Prototyping und möglichst nahe Nachbildung von produktionsähnlichem Verhalten — ohne den Overhead komplexer Betriebsumgebungen.

**Wann es ideal ist**

* Schnelle Feature-Iterationen und Bugfixing
* Prototyping neuer Services oder Architekturen
* Demos und interne Tools für kleine Teams
* Lernen/Lehren von Docker-Grundlagen

**Wann man es vermeiden sollte**

* Wenn horizontale Skalierung, Hochverfügbarkeit oder komplexes Networking benötigt werden
* Wenn Abhängigkeiten von Cloud-Diensten bestehen
* Wenn mehrere Entwickler eine geteilte, dauerhaft verfügbare Umgebung benötigen

---

## 2) Voraussetzungen

* **Docker Engine** oder **Docker Desktop** (Windows/macOS)
* Optional: **Docker Compose** (ab Version 2 meist enthalten)
* Grundkenntnisse zu **Dockerfiles**, **Images** und **Containern**
* Vertrautheit mit Terminal-Kommandos und dem Build-Prozess des Projekts

---

## 3) Schnellstart (Einzelner Container)

Dein Beispiel:

```bash
docker build -t myapp .
docker run -p 8080:80 myapp
```

**Erklärung:**

* `docker build -t myapp .` erstellt ein lokales Image mit dem Tag `myapp`.
* `docker run -p 8080:80 myapp` startet den Container und mapped Port `80` im Container auf Port `8080` des Hosts.
  Zugriff: [http://localhost:8080](http://localhost:8080)

**Häufig genutzte Flags**

* `-e KEY=VALUE` — Umgebungsvariablen setzen
* `-v ./data:/var/lib/myapp` — Daten persistent speichern
* `--name myapp` — Container benennen
* `--rm` — Container nach Beenden automatisch löschen

---

## 4) Projektstruktur & Dockerfile-Grundlagen

**Empfohlene Struktur:**

```bash
.
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── src/
└── tests/
```

**Beispiel Dockerfile (Node.js, Multi-Stage):**

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
EXPOSE 80
CMD ["node", "dist/server.js"]
```

**.dockerignore (wichtig für kleine Images):**

```bash
node_modules
.git
dist
*.log
.env
```

---

## 5) Lokales Deployment mit Docker Compose

Compose vereinfacht den Betrieb von Multi-Container-Anwendungen (z. B. Web + DB).

**Minimalbeispiel:**

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

**Kommandos:**

```bash
docker compose up -d
docker compose logs -f web
docker compose exec web sh
docker compose down
```

---

## 6) Developer Experience: Schnelles Feedback

* **Bind Mounts** für Hot-Reload: Quellcode ins Container-Verzeichnis mounten.
* **Makefile** für Kurzbefehle (`make up`, `make down`, `make logs`).
* **Profiles** in Compose nutzen, um optionale Services (z. B. Mailhog) nur bei Bedarf zu starten.

---

## 7) Networking & Ports

* Container teilen sich im Compose-Projekt ein internes Netzwerk.
* Services können sich gegenseitig über **Servicenamen** erreichen (`db` statt IP).
* Zugriff von Host: `http://localhost:<Port>`
* Zugriff von Container auf Host:

  * macOS/Windows: `host.docker.internal`
  * Linux: `--add-host=host.docker.internal:host-gateway`

---

## 8) Daten & Zustand

* **Bind Mounts** (`./dir:/app`) → ideal für Quellcode und lokale Artefakte.
* **Named Volumes** → ideal für Datenbanken und persistente Daten.

---

## 9) Konfiguration & Secrets

* Nutzung von **Umgebungsvariablen** und `.env` Dateien.
* Keine Passwörter im Git-Repo oder in Dockerfiles hinterlegen.
* Für lokale Entwicklung genügt meist `.env.local` (in `.gitignore`).

---

## 10) Logs, Health & Debugging

* Logs: `docker logs -f <container>`
* Healthcheck in Compose:

  ```yaml
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost/health"]
    interval: 10s
    timeout: 2s
    retries: 5
  ```

* Debugging: `docker exec -it <container> sh`
* Bei komplexeren Problemen: Sidecar-Container wie `nicolaka/netshoot` verwenden.

---

## 11) Performance-Tipps

* **BuildKit** aktivieren:

  ```bash
  DOCKER_BUILDKIT=1 docker build -t myapp .
  ```

* Multi-Stage Builds & schlanke Basisimages (Alpine, Distroless) verwenden.
* Bind Mounts auf schnellen lokalen Laufwerken nutzen.

---

## 12) Cross-Platform Hinweise

* **Apple Silicon (arm64):** Multi-Arch-Images nutzen.
* **Windows:** WSL 2 Backend bevorzugen.
* **Linux:** Volle Produktionsparität, aber Host-Zugriff über `--add-host` konfigurieren.

---

## 13) Beispiel: Voller Stack (Frontend + API + DB)

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - API_URL=http://localhost:8080
    depends_on:
      - api
  api:
    build: ./api
    ports:
      - "8080:80"
    environment:
      - DB_HOST=db
      - DB_USER=appuser
      - DB_PASS=secret
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=secret
    volumes:
      - dbdata:/var/lib/postgresql/data
volumes:
  dbdata:
```

---

## 14) Tests im Lokalen Deployment

* Unit Tests im Container:

  ```bash
  docker run --rm myapp npm test
  ```

* Integrationstests via Compose:

  ```bash
  docker compose -f docker-compose.test.yml up --abort-on-container-exit
  ```

---

## 15) Sicherheit (auch lokal)

* Container nicht als Root ausführen (`USER` im Dockerfile).
* Images aktuell halten.
* Docker-Socket nicht in Container mounten.
* Nur benötigte Ports öffnen.

---

## 16) Lokales Image-Registry (optional)

* Start einer lokalen Registry:

  ```bash
  docker run -d -p 5000:5000 --name registry registry:2
  ```

* Push/Pull lokal:

  ```bash
  docker tag myapp localhost:5000/myapp:dev
  docker push localhost:5000/myapp:dev
  ```

---

## 17) Typische Stolperfallen

* **„Works on my machine“** → Versionen pinnen, Compose-Dateien committen
* **Aufgeblähte Images** → `.dockerignore`, Multi-Stage, kleine Basisimages
* **Fehler beim Hot Reload** → Mounts klar definieren
* **Versteckter Zustand** → Volumes regelmäßig löschen (`docker compose down -v`)

---

## 18) Checklisten

**Erstmaliges Setup**

* [ ] Docker Engine installiert
* [ ] `Dockerfile` & `.dockerignore` vorhanden
* [ ] Build erfolgreich
* [ ] Healthcheck oder `/health`-Endpoint verfügbar
* [ ] Ports dokumentiert

**Tägliche Arbeit**

* [ ] `docker compose up -d` starten
* [ ] Logs mit `logs -f` prüfen
* [ ] Hot Reload aktiv
* [ ] Tests im Container laufen lassen
* [ ] Projekt mit `compose down` sauber beenden

---

## 19) Zusammenfassung

Lokales Deployment bietet:

* **Schnelle Feedback-Schleifen**
* **Einfache Kommandos** (`docker run`, `docker compose up`)
* **Perfekte Umgebung für Tests und Prototypen**

Es ist ein essenzieller Baustein im Entwicklungsprozess, um Ideen schnell umzusetzen, produktionsähnliche Szenarien nachzustellen und neue Teammitglieder unkompliziert einzubinden.
