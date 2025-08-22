---
title: Hands-On Übung
---

## Hands-On Übung: Containerisierung einer einfachen Node.js-App

> In diesem Lab wirst du einen minimalen Node.js-Webserver erstellen, ihn in ein Docker-Image verpacken und als Container ausführen. Außerdem lernst du Best Practices zu Bildgröße, Caching und Entwickler-Workflow kennen.

---

## Lernziele

* Erstelle einen kleinen HTTP-Server in Node.js, der auf Port `3000` antwortet.
* Schreibe ein Dockerfile unter Verwendung eines offiziellen Node-Basisimages.
* Baue und starte die App in einem Container und überprüfe sie über `http://localhost:3000`.
* Wende Best Practices an: `.dockerignore`, Non-Root-User, vorhersagbare Abhängigkeitsinstallation, Caching und Health Checks.
* (Optional) Verwende Docker Compose für einen One-Command-Workflow und füge Live-Reload für die Entwicklung hinzu.

---

## Voraussetzungen

* **Installiert:** Docker Engine oder Docker Desktop (beliebiges OS), Node.js 18+ (nur für lokale Tests oder Dev-Extras erforderlich).
* **Terminal-Kenntnisse:** Grundlegende Shell-Kommandos.
* **Ports:** Stelle sicher, dass Port **3000** auf deinem Host frei ist.

---

## Projektstruktur

Erstelle einen neuen Ordner für die Übung:

```bash
mkdir hello-docker && cd hello-docker
````

Empfohlene Struktur:

```bash
hello-docker/
├─ app.js
├─ package.json
├─ package-lock.json        # generiert durch `npm install` (unbedingt behalten!)
├─ Dockerfile
└─ .dockerignore
```

---

## 1. Erstelle eine einfache Node.js-App

**`app.js`**

```js
// Minimaler HTTP-Server auf Port 3000
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Docker!\n');
});

server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```

**`package.json`**

```json
{
  "name": "hello-docker",
  "version": "1.0.0",
  "description": "Minimale Node.js-App für Docker Hands-On",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "license": "MIT"
}
```

Installiere Abhängigkeiten (hier keine nötig, aber es erzeugt eine Lockfile):

```bash
npm install
```

> **Warum Lockfiles wichtig sind:** Die `package-lock.json` fixiert Versionen für reproduzierbare Builds und besseres Docker-Caching.

---

## 2. Schreibe das Dockerfile

Beginne mit einem sauberen, schnellen und sicheren Basis-Image. Verwende `node:<version>-alpine` oder `-slim`. Alpine ist kleiner; slim basiert auf Debian (breitere Kompatibilität).

**`Dockerfile` (produktionsreif, kleiner Footprint, Non-Root):**

```dockerfile
# 1. Offizielles Node-Basisimage verwenden
FROM node:20-alpine AS base

# 2. Non-Root-User nutzen für mehr Sicherheit
WORKDIR /usr/src/app

# 3. Abhängigkeiten separat installieren für besseres Caching
COPY package*.json ./
RUN npm ci --only=production

# 4. Anwendungscode kopieren
COPY app.js ./

# 5. Port freigeben
EXPOSE 3000

# 6. Einfacher Healthcheck (optional, nützlich in Compose/K8s)
HEALTHCHECK --interval=30s --timeout=3s CMD \
  wget -qO- http://localhost:3000 || exit 1

# 7. Non-Root-User verwenden
USER node

# 8. Startkommando definieren
CMD ["node", "app.js"]
```

> **Caching-Tipp:** Indem du zuerst `package*.json` kopierst und `npm ci` ausführst, bevor du den restlichen Code kopierst, kann Docker die Abhängigkeits-Layer wiederverwenden.

---

## 3. Unnötige Dateien ignorieren

**`.dockerignore`**

```bash
# Node
node_modules
npm-debug.log
.DS_Store

# VCS
.git
.gitignore

# OS/Editor
*.swp
*.log
```

So verhinderst du, dass große oder irrelevante Dateien dein Image aufblähen.

---

## 4. Image bauen

```bash
docker build -t hello-docker .
```

* `-t hello-docker` gibt dem Image einen Namen (implizit `latest`).
* Bei Codeänderungen wird das Docker-Caching genutzt.

---

## 5. Container starten

Port **3000** vom Container auf Host-Port **3000** mappen:

```bash
docker run --name hello-docker --rm -p 3000:3000 hello-docker
```

* `--rm` entfernt den Container beim Stoppen.
* `--name` macht ihn leichter auffindbar.
* Ausgabe: `Server läuft auf Port 3000`.

**Überprüfung:**

* Browser: `http://localhost:3000`
* CLI:

  ```bash
  curl -i http://localhost:3000
  ```

Erwartete Antwort:

```bash
HTTP/1.1 200 OK
Content-Type: text/plain
Hello, Docker!
```

Beenden mit `Ctrl+C` oder:

```bash
docker stop hello-docker
```

---

## 6. Inspect, Logs und Aufräumen

* Images auflisten: `docker images`
* Container auflisten: `docker ps -a`
* Logs ansehen: `docker logs hello-docker`
* Image löschen: `docker rmi hello-docker`

---

## 7. Entwicklungs-Workflow (Optionen)

### A) Live-Reload mit `nodemon`

```bash
npm install --save-dev nodemon
```

**`package.json`** ergänzen:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon --watch . app.js"
}
```

Start im Container mit Code-Mount:

```bash
docker run --name hello-dev --rm -it \
  -p 3000:3000 \
  -v "$PWD":/usr/src/app \
  -w /usr/src/app node:20-alpine sh -c "npm ci && npx nodemon app.js"
```

### B) Docker Compose

**`compose.yaml`**

```yaml
services:
  web:
    image: hello-docker
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000"]
      interval: 30s
      timeout: 3s
      retries: 3
```

```bash
docker compose up --build
docker compose down
```

---

## 8. Multi-Stage Build (kleinere Images)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
COPY --from=build /app/package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/app.js"]
```

Vorteile:

* kleinere Angriffsfläche
* schnellere Deployments

---

## 9. Tagging & Registry

```bash
docker tag hello-docker my-registry.example.com/hello-docker:1.0.0
docker push my-registry.example.com/hello-docker:1.0.0
```

---

## 10. Häufige Fehler & Troubleshooting

* **Port belegt:** Ändere Mapping (`-p 8080:3000`).
* **Keine Antwort im Browser:** App muss auf `0.0.0.0` lauschen.
* **Cache greift nicht:** Änderung an `package.json` erzeugt neuen Layer.
* **Kein `.dockerignore`:** Verlangsamt Build.
* **Root-User aktiv:** Nutze `USER node`.
* **`npm install` vs `npm ci`:** Verwende `npm ci` für reproduzierbare Builds.

---

## 11. Validierung

* [ ] `docker build -t hello-docker .` erfolgreich
* [ ] `docker run -p 3000:3000 hello-docker` zeigt *Server läuft...*
* [ ] `http://localhost:3000` liefert *Hello, Docker!*
* [ ] Cache greift nach Änderung an `app.js`
* [ ] `.dockerignore` vorhanden, Non-Root-User genutzt

---

## 12. Erweiterungen (Optional)

* Environment-Variable nutzen:

  ```bash
  docker run -e MESSAGE="Hallo aus Env" -p 3000:3000 hello-docker
  ```

* JSON-Logging

* `/healthz`-Endpoint hinzufügen

* Unterschied `node:20-slim` vs `node:20-alpine` vergleichen

* Express-App mit Routen & statischen Dateien

---

## Quick Reference

**Build:**

```bash
docker build -t hello-docker .
```

**Run:**

```bash
docker run --name hello-docker --rm -p 3000:3000 hello-docker
```

**Verify:**

```bash
curl -i http://localhost:3000
```

**Stop:**

```bash
docker stop hello-docker
```

---

## Zusammenfassung

Du hast einen kleinen Node.js-Server erstellt, ein Dockerfile mit Best Practices (Lockfile, Caching, `.dockerignore`, Non-Root, Healthcheck) geschrieben, ein Image gebaut und den Container gestartet. Diese Vorgehensweise ist direkt auf größere Node.js-Services und CI/CD-Pipelines übertragbar.
