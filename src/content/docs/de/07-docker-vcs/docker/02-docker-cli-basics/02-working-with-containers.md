---
title: Arbeiten mit Containern
description: Ein umfassender, strukturierter Leitfaden zur Verwaltung von Containern mit der Docker CLI – behandelt Lebenszyklus, Laufmodi, Netzwerk, Logs, Exec, Ressourcen, Health Checks, Bereinigung, Troubleshooting und Best Practices.
audience: Anfänger bis fortgeschrittene Lernende in DevOps/Softwareentwicklung
prerequisites:
  - Docker Engine und CLI installiert
  - Grundkenntnisse im Umgang mit dem Terminal
  - (Linux) Verwende `sudo` bei Docker-Befehlen, falls dein Benutzer nicht in der `docker`-Gruppe ist
---
# Arbeiten mit Containern (Docker CLI)

Diese Lektion zeigt die alltägliche Nutzung der Docker CLI, mit der du **Container starten, inspizieren, verbinden, überwachen und bereinigen** kannst. Der Fokus liegt auf praktischen Befehlen mit Erklärungen, Standardwerten und Stolperfallen.

---

## 1. Container vs. Images (Kurzüberblick)

- **Image**: Ein schreibgeschütztes Template (Layer), das zum Erstellen von Containern genutzt wird (z. B. `nginx:latest`).
- **Container**: Eine **laufende** (oder gestoppte) Instanz eines Images mit eigenem beschreibbaren Layer, Prozessen, Namespaces und cgroup-Limits.
- **Unveränderliches Image, veränderbarer Container**: Konfigurationsänderungen beim `docker run` gehören zum Container, nicht zum Image.

---

## 2. Container-Lebenszyklus im Überblick

1. **Create**: Erstellt Container-Konfiguration, startet den Prozess aber nicht.  
   - `docker create --name web -p 8080:80 nginx:latest`
2. **Start**: Startet den Hauptprozess des Containers (PID 1).  
   - `docker start web`
3. **Run**: Kurzform für **create + start**.  
   - `docker run ...`
4. **Stop**: Sendet `SIGTERM`, danach `SIGKILL`, wenn der Prozess nicht rechtzeitig beendet wird.  
   - `docker stop web`
5. **Restart**: Stoppt und startet erneut.  
   - `docker restart web`
6. **Pause/Unpause**: Friert Prozesse ein bzw. setzt sie fort (cgroup freezer).  
   - `docker pause web && docker unpause web`
7. **Remove**: Entfernt Metadaten und Schreib-Layer (muss gestoppt sein).  
   - `docker rm web` (oder `docker rm -f web` für erzwungenes Entfernen)

---

## 3. Container starten & ausführen

### 3.1 Einfacher Start

```bash
docker run nginx:latest
```

**Ablauf / Standardwerte**

* Läuft im **Vordergrund**, Ausgabe auf STDOUT/STDERR.
* Keine Portweiterleitung (nicht über Browser erreichbar).
* Automatisch generierter Name (z. B. `nostalgic_mcnulty`).
* **Container endet, wenn PID 1 endet**. `nginx` läuft dauerhaft, Einmalbefehle enden sofort.

### 3.2 Hintergrundmodus (`-d`)

```bash
docker run -d --name my-nginx -p 8080:80 nginx:latest
```

* Läuft im Hintergrund (gibt Container-ID zurück).
* `-p HOST:CONTAINER` veröffentlicht Ports.
* Mit `--name` Container sinnvoll benennen.

### 3.3 Interaktiv & TTY

```bash
docker run -it ubuntu:22.04 /bin/bash
```

* `-i`: STDIN bleibt offen.
* `-t`: Weist ein Pseudo-TTY zu.
* Nützlich für **Debug-Shells** und Image-Erkundung.

### 3.4 Umgebungsvariablen (`-e`, `--env-file`)

```bash
docker run -d -e MYSQL_ROOT_PASSWORD=secret --name db mysql:8
```

* Übergibt Variablen an den Container.
* Mit `--env-file .env` mehrere Variablen laden.
* Geheimnisse niemals ins Image einbauen.

### 3.5 Arbeitsverzeichnis (`-w`) & Benutzer (`-u`)

```bash
docker run -it -v "$(pwd)":/app -w /app node:18-alpine npm start
```

* `-w`: Setzt Arbeitsverzeichnis.
* `-u`: Führt Prozesse als Nicht-Root-Benutzer aus.
* Code mit `-v` mounten für **Live-Entwicklung**.

### 3.6 Ressourcenlimits

```bash
docker run -d --name cpu-demo --cpus="1.5" --memory="512m" busybox:stable sleep 3600
```

* Begrenze CPU & RAM zur Stabilität.
* Flags: `--cpus`, `--cpuset-cpus`, `--memory`, `--memory-swap`.

### 3.7 Restart-Policies

```bash
docker run -d --restart unless-stopped --name api -p 3000:3000 myorg/api:1.0
```

* Optionen: `no`, `on-failure[:max]`, `always`, `unless-stopped`.
* Hilfreich für Dienste im Dauerbetrieb.

---

## 4. Netzwerk & Ports

### 4.1 Ports veröffentlichen

```bash
docker run -d -p 8080:80 nginx:latest
```

* `-p hostPort:containerPort` bindet Port.
* `-P` veröffentlicht alle EXPOSE-Ports auf zufällige Host-Ports.

### 4.2 Ports prüfen

```bash
docker port my-nginx
```

* Zeigt Laufzeit-Zuordnungen.

### 4.3 Container-Kommunikation

* Standard-Bridge: Kommunikation per IP.
* Eigene Bridge für DNS-gestützte Namensauflösung:

```bash
docker network create appnet
docker run -d --name db --network appnet postgres:16
docker run -d --name api --network appnet -e DB_HOST=db myorg/api:1.0
```

---

## 5. Dateisysteme, Mounts & Kopieren

### 5.1 Bind Mount vs. Volume

* **Bind Mount**: Host-Pfad in Container (z. B. `-v "$(pwd)":/app`).
* **Volume**: Von Docker verwalteter Speicher, ideal für persistente Daten.

### 5.2 Beispiele

```bash
# Bind Mount im Dev-Workflow
docker run -it --rm -v "$(pwd)":/app -w /app node:18-alpine npm test

# Named Volume für DB
docker volume create pgdata
docker run -d --name pg -v pgdata:/var/lib/postgresql/data postgres:16
```

### 5.3 Dateien kopieren

```bash
docker cp ./config.yml my-nginx:/etc/nginx/conf.d/config.yml
docker cp my-nginx:/var/log/nginx/access.log ./access.log
```

---

## 6. Container auflisten & inspizieren

```bash
docker ps      # nur laufende
docker ps -a   # alle
```

```bash
docker inspect my-nginx
docker inspect --format '{{ .NetworkSettings.IPAddress }}' my-nginx
```

```bash
docker top my-nginx
docker stats
```

---

## 7. Logs, Exec & Attach

```bash
docker logs -f my-nginx
docker exec -it my-nginx /bin/sh
docker attach my-nginx
```

---

## 8. Health Checks

```bash
docker inspect --format '{{json .State.Health}}' my-nginx | jq
```

---

## 9. Aktualisieren & Neuaufsetzen

```bash
docker pull myorg/api:1.1
docker stop api && docker rm api
docker run -d --name api -p 3000:3000 --env-file .env myorg/api:1.1
```

---

## 10. Aufräumen

```bash
docker stop my-nginx
docker rm my-nginx
docker container prune
docker system prune -a
```

---

## 11. Signale & Exit Codes

* `docker stop` → `SIGTERM` → Timeout → `SIGKILL`.
* Exit-Code prüfen mit:

```bash
docker inspect --format '{{ .State.ExitCode }}' my-job
```

---

## 12. Sicherheits-Flags

* `-u 1000:1000` → Nicht-Root.
* `--read-only` für Read-only FS.
* `--cap-drop ALL` und nur nötige Capabilities hinzufügen.

---

## 13. Häufige Muster

```bash
docker run --rm -it --network host nicolaka/netshoot bash
docker exec -it my-nginx sh -c 'tail -f /var/log/nginx/access.log'
docker export my-nginx | tar -tvf -
docker rename old-name new-name
```

---

## 14. Troubleshooting-Checkliste

1. Container beendet sofort → Logs prüfen.
2. Port nicht erreichbar → Port publiziert? App auf 0.0.0.0?
3. Permission denied → Ownership prüfen.
4. Hohe CPU/RAM-Nutzung → `docker stats`, Limits setzen.
5. Netzwerkprobleme → Custom-Bridge nutzen.
6. Container hängt beim Stoppen → `docker rm -f`.
7. Log zu groß → Logging-Optionen konfigurieren.

---

## 15. Übungen

1. Nginx auf Port 8080 starten und testen.
2. Ubuntu interaktiv öffnen, Datei erstellen, `docker ps -a` prüfen.
3. Netzwerk mit DB + App erstellen.
4. CPU-Limit testen mit `--cpus=1`.
5. SIGTERM sauber abfangen.
6. Persistente Daten mit Volumes testen.

---

## 16. Schnellreferenz

```bash
docker run [--rm] [-d] [-it] [--name NAME] [-p HOST:CONT] [-e K=V] [-v SRC:DEST] IMAGE [CMD]
docker ps -a
docker stop|start|restart ID
docker inspect ID
docker logs -f ID
docker exec -it ID sh
docker port ID
docker cp SRC DEST
```

---

## 17. Beispielbefehle

```bash
docker run -d --name my-nginx -p 8080:80 nginx:latest
docker port my-nginx
docker logs -f my-nginx
docker exec -it my-nginx /bin/sh
docker container prune
```

---

## 18. Best Practices

* Container **benennen**.
* **Tags pinnen** (`nginx:1.25`).
* **Restart-Policies & Limits** nutzen.
* **Eigene Netzwerke** für DNS & Isolation.
* Container als **Nicht-Root** betreiben.
* Container sollten **Single Purpose** haben.
* Konfig als **immutable** behandeln → neu erstellen statt ändern.
