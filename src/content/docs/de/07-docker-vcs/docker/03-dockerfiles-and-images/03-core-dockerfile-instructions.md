---
title: Grundlegende Dockerfile-Anweisungen
---
# Grundlegende Dockerfile-Anweisungen

> Ein praxisorientierter, beispielbasierter Leitfaden zu den wichtigsten Dockerfile-Direktiven – was sie tun, wie sie Schichten (Layers) und Caching beeinflussen, typische Stolperfallen und Best Practices.

---

## Kurzer Überblick: Wie Dockerfile-Instruktionen Layers erzeugen

* Jede Instruktion (außer einigen wenigen rein für Metadaten) erzeugt eine **neue Image-Layer**.
* Der **Build-Cache** wiederverwendet Layers, wenn die Instruktion und ihre Eingaben unverändert bleiben.
* Ordne deine Instruktionen von **weniger zu stärker variabel** (z. B. Base → Dependencies → App-Code), um Cache-Treffer zu maximieren.

---

## 1. `FROM` — Basis-Image festlegen

**Zweck:** Definiert das Start-Dateisystem sowie optional Plattform und Stage-Name.

**Syntax:**

```dockerfile
FROM <image>[:<tag>] [AS <stage>]
# Mit Plattform (BuildKit):
FROM --platform=$BUILDPLATFORM <image> AS builder
```

**Beispiele:**

```dockerfile
FROM node:20-alpine AS build
FROM nginx:1.27-alpine
```

**Hinweise & Stolperfallen**

* Ein Dockerfile **muss mit** `FROM` beginnen (außer in speziellen Multi-Stage-Fällen).
* Bevorzuge **feste Tags** (z. B. `node:20.11-alpine`) oder Digests für Reproduzierbarkeit.
* Verwende **Multi-Stage-Builds**, um Runtime-Images schlank zu halten.

**Best Practices**

* Wo möglich, mit **offiziellen, schlanken oder distroless** Images starten.
* Entscheidung in Kommentaren dokumentieren (z. B. Sicherheit, Größe, Kompatibilität).

---

## 2. `LABEL` — Metadaten hinzufügen

**Zweck:** Schlüssel/Wert-Metadaten anhängen (Maintainer, Quelle, Version, Lizenz usw.).

**Syntax:**

```dockerfile
LABEL <key>=<value> <key2>=<value2>
```

**Beispiel:**

```dockerfile
LABEL org.opencontainers.image.title="Acme API" \
      org.opencontainers.image.source="https://github.com/acme/api" \
      org.opencontainers.image.version="1.3.2"
```

**Hinweise**

* Passt gut zu **OCI Image Annotation Keys**.
* Mehrere `LABEL`-Anweisungen werden kombiniert, erzeugen aber jeweils eine neue Layer.

**Best Practices**

* `source`, `revision` (git SHA) und `licenses` hinzufügen, wo relevant.
* Möglichst in **einem `LABEL`-Block** sammeln, um Layer zu sparen.

---

## 3. `RUN` — Befehle zur Build-Zeit ausführen

**Zweck:** Befehle *während des Builds* ausführen (z. B. Pakete installieren, Assets kompilieren).

**Formen:**

* **Shell-Form:** `RUN apt-get update && apt-get install -y curl`
* **Exec (JSON)-Form:** `RUN ["bash", "-lc", "bundle install"]`

**Beispiele:**

```dockerfile
RUN apk add --no-cache curl
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
```

**Hinweise & Stolperfallen**

* Jede `RUN`-Instruktion erzeugt eine neue Layer — **verwandte Schritte kombinieren**.
* Immer **Paket-Caches im selben Layer löschen**, um Images klein zu halten.
* Mit BuildKit: `--mount=type=cache` für schnelleren, aber nicht persistierenden Dependency-Cache.

**Best Practices**

* **Nicht-interaktive** Installationen verwenden (`DEBIAN_FRONTEND=noninteractive`).
* **Versionen fixieren**, Prüfsummen nutzen.
* Mit `set -euxo pipefail` arbeiten, um Fehler früh zu erkennen.

---

## 4. `COPY` vs. `ADD` — Dateien ins Image bringen

**Zweck:** Dateien aus dem Build-Kontext ins Image kopieren.

**COPY Syntax:**

```dockerfile
COPY [--chown=<user>:<group>] <src>... <dest>
```

**ADD Extra-Funktionen (vorsichtig einsetzen):**

* Kann **Remote-URLs** holen
* Entpackt **Tar-Archive** automatisch

**Beispiele:**

```dockerfile
COPY package.json package-lock.json ./
COPY src/ ./src/
COPY --chown=node:node . /app
```

**Hinweise & Stolperfallen**

* **Bevorzuge `COPY`**, da einfacher und vorhersehbarer.
* `ADD` für Remote-Downloads vermeiden → besser `RUN curl ... && sha256sum`.
* `.dockerignore` nutzen, um unnötige oder geheime Dateien auszuschließen.

**Best Practices**

* Manifest-Dateien **zuerst kopieren**, damit Dependency-Installationen gecached werden.
* Build-Kontext **klein halten**.

---

## 5. `WORKDIR` — Arbeitsverzeichnis setzen

**Zweck:** Setzt das Arbeitsverzeichnis für nachfolgende Instruktionen.

**Syntax:**

```dockerfile
WORKDIR /app
```

**Hinweise**

* Verzeichnis wird erstellt, wenn es nicht existiert.
* Kein `cd` in `RUN` verwenden → stattdessen `WORKDIR`.

**Best Practices**

* Möglichst **einmal oben im Dockerfile** definieren.

---

## 6. `ENV` — Umgebungsvariablen definieren

**Zweck:** Setzt Variablen für **Build** und/oder **Runtime**.

**Syntax:**

```dockerfile
ENV KEY=value
ENV PATH="/opt/bin:${PATH}" PORT=8080
```

**Hinweise & Stolperfallen**

* Jeder `ENV`-Wert bleibt im Image und ist sichtbar mit `docker inspect`.
* Keine **Secrets** hier speichern → dafür Docker Secrets oder Orchestrator-Mechanismen nutzen.

**Best Practices**

* Für sichere **Standardwerte** nutzen (z. B. `NODE_ENV=production`).
* Für reine Build-Variablen → `ARG` statt `ENV`.

---

## 7. `EXPOSE` — Container-Ports dokumentieren

**Zweck:** Dokumentiert, auf welchen Ports der Container lauscht.

**Syntax:**

```dockerfile
EXPOSE 8080
EXPOSE 80/tcp 8443/udp
```

**Hinweise**

* Öffnet **nicht automatisch** Ports → `docker run -p` oder Orchestrator nutzen.
* Reine Dokumentation.

**Best Practices**

* Exakt und minimal halten → nur echte Service-Ports.

---

## 8. `CMD` vs. `ENTRYPOINT` — Prozess definieren

**Zweck:** Definiert, was beim Starten des Containers ausgeführt wird.

### `CMD`

* Setzt **Standardbefehl oder Argumente** → können mit `docker run …` überschrieben werden.
* Empfohlen: **Exec-Form** (`["node", "server.js"]`).

### `ENTRYPOINT`

* Setzt ein **festes Programm** → `CMD` oder Laufzeitargumente werden als Parameter übergeben.
* Empfohlen: **Exec-Form**.

**Beispiele:**

```dockerfile
ENTRYPOINT ["nginx", "-g"]
CMD ["daemon off;"]

CMD ["node", "server.js"]
```

**Hinweise & Stolperfallen**

* Exec-Form bevorzugen → bessere Signalweitergabe.
* Bei Shell-Form `tini`/`dumb-init` für Signalhandling nutzen.

**Best Practices**

* `ENTRYPOINT` für das Hauptprogramm, `CMD` für Standard-Flags.
* In Tool-Images `CMD ["--help"]` als Default hilfreich.

---

## 9. `USER` — Rechte reduzieren

**Zweck:** Legt User/Gruppe für nachfolgende Befehle fest.

**Syntax:**

```dockerfile
USER <user>[:<group>]
```

**Beispiel:**

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

**Hinweise & Stolperfallen**

* Root-Default ist ein Sicherheitsrisiko.
* Schreibrechte für den User sicherstellen.

**Best Practices**

* Dedizierten **Non-Root-User** mit minimalen Rechten anlegen.

---

## 10. `VOLUME` — Mount-Punkte deklarieren

**Zweck:** Markiert Verzeichnisse für externe Speicherung.

**Syntax:**

```dockerfile
VOLUME ["/data"]
```

**Hinweise & Stolperfallen**

* Daten in einem `VOLUME` bleiben **außerhalb** des Images → spätere `RUN`-Änderungen dort gehen verloren.
* Nicht für App-Code, nur für **veränderliche Daten**.

**Best Practices**

* In Compose/K8s Volumes definieren.
* `VOLUME` nur bei stark generischem Bedarf (z. B. DB-Daten).

---

## 11. `HEALTHCHECK` — Container-Gesundheit prüfen

**Zweck:** Definiert, wie Docker den Zustand des Containers prüft.

**Syntax:**

```dockerfile
HEALTHCHECK [options] CMD <command>
```

**Beispiele:**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1
HEALTHCHECK NONE
```

**Hinweise & Stolperfallen**

* Läuft im Container → benötigte Tools müssen installiert sein.
* Nicht zu oft prüfen → sonst unnötige Last.

**Best Practices**

* **Leichtgewichtige, deterministische** Endpoints abfragen.
* Checks **schnell halten**.

---

## Alles zusammen — Minimalbeispiel für Produktion

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
LABEL org.opencontainers.image.source="https://github.com/acme/webapp"
ENV NODE_ENV=production PORT=8080
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node dist/healthcheck.js || exit 1
CMD ["node", "dist/server.js"]
```

**Warum gut?**

* **Multi-Stage** reduziert Größe.
* Dependencies sind cachefreundlich.
* Läuft als **Non-Root**.
* **Healthcheck** sorgt für Monitoring.
* **Exec-Form** für sauberes Signalhandling.

---

## Häufige Anti-Patterns

* `ADD` für Remote-Downloads.
* Shell-Form bei `CMD`.
* Secrets in `ENV` oder `COPY`.
* `apt-get update` ohne `apt-get install` im gleichen Layer.
* Alles als Root laufen lassen.
* Fehlendes `.dockerignore`.

---

## Nützliche Zusatzbefehle

* `ARG` — Build-Variablen.
* `ONBUILD` — Trigger für Child-Builds.
* `SHELL` — Standard-Shell ändern.
* `STOPSIGNAL` — Stop-Signal definieren.

---

## Cheat Sheet

* **Base:** `FROM <image>:<tag> [AS name]`
* **Meta:** `LABEL key="value"`
* **Build:** `RUN <cmd>`
* **Files:** `COPY src dest`
* **Dir:** `WORKDIR /path`
* **Env:** `ENV KEY=value`
* **Ports:** `EXPOSE 8080`
* **Entrypoint:** `ENTRYPOINT ["bin"]`
* **Default args:** `CMD ["--flag"]`
* **User:** `USER app`
* **Data:** `VOLUME /data`
* **Health:** `HEALTHCHECK CMD <cmd>`

---

## Abschließende Tipps

* Versionen fixieren, Downloads validieren, Images klein halten.
* Für **Unveränderlichkeit** designen → Konfiguration per ENV, nicht per Image-Änderung.
* **Multi-Stage-Builds** nutzen, um Build-Tools draußen zu halten.
* Orchestratoren wie Compose/K8s sollen **Ports/Volumes/Secrets** managen.
