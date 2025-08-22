---
title: Docker CLI Fundamentals
---
# Command-Line Interface (CLI) Grundlagen + Die Docker CLI

## Teil 1 — Was *ist* eine CLI?

### 1) Definition

Eine **Command-Line Interface (CLI)** ist eine textbasierte Schnittstelle, über die man mit einem Betriebssystem oder einer Software durch das Eingeben von Befehlen interagiert. Anstatt Schaltflächen anzuklicken, gibt man Anweisungen ein, die das System interpretiert und ausführt.

- **Terminal/Konsole:** Das Programmfenster, das eine Eingabeaufforderung zeigt (z. B. `bash`, `zsh`, Windows Terminal).
- **Shell:** Der Befehlsinterpreter (z. B. `bash`, `zsh`, `fish`, `PowerShell`), der Eingaben ausliest und Programme ausführt.
- **Programme/Utilities:** Ausführbare Programme, die über die Shell aufgerufen werden (z. B. `ls`, `git`, `docker`).

### 2) Warum eine CLI nutzen?

- **Präzision & Automatisierung:** Befehle lassen sich wiederholen, in Skripten nutzen und in CI/CD integrieren.
- **Schnelligkeit & Ressourcenschonung:** Ideal für Remote-Server und Systeme ohne grafische Oberfläche.
- **Kombinierbarkeit:** Befehle können mit Pipes verbunden werden, um komplexe Abläufe zu erstellen.

### 3) Aufbau eines CLI-Befehls

```bash
<programm> <unterbefehl> \[optionen/flags] \[argumente]
```

- **Optionen/Flags:** Beginnen oft mit `-` (kurz) oder `--` (lang), z. B. `-f`, `--help`.
- **Positionsargumente:** Müssen in einer festen Reihenfolge angegeben werden (z. B. Pfad, Containername).
- **Exit Codes:** `0` = Erfolg, ungleich `0` = Fehler.
- **Std-Streams:** `stdin` (Eingabe), `stdout` (normale Ausgabe), `stderr` (Fehler).
- **Umgebungsvariablen:** Schlüssel-Wert-Paare, die Prozessen zur Verfügung stehen (z. B. `PATH`, `HOME`).

### 4) Zentrale CLI-Fertigkeiten

- **Navigation & Dateien:** `pwd`, `ls`, `cd`, `cat`, `less`, `cp`, `mv`, `rm`, `mkdir`.
- **Hilfe & Doku:** `<programm> --help`, `man <programm>`.
- **Pipelines & Umleitungen:** `cmd1 | cmd2`, `>`, `>>`, `2>`, `2>&1`.
- **Berechtigungen & sudo:** Mit `sudo` lassen sich Befehle mit Root-Rechten ausführen.
- **Sicherheit:** Tab-Completion nutzen, gefährliche Befehle doppelt prüfen, `--dry-run` nutzen, wenn verfügbar.

---

## Teil 2 — Die Docker CLI (der `docker` Client)

### 1) Was ist die Docker CLI?

Die **Docker CLI** (`docker`) ist die wichtigste Schnittstelle zum **Docker Daemon** (`dockerd`).  
Die CLI sendet Anfragen (über einen lokalen Unix-Socket oder TCP) an den Daemon, der dann Container startet, Images baut oder verwaltet.

- **Client–Server-Modell:** `docker` (Client) → API → `dockerd` (Server).
- **Kontexte & Hosts:** Mit `docker context` lassen sich verschiedene Docker-Endpunkte ansprechen (z. B. Remote-Server).
- **Authentifizierung:** `docker login` dient zum Einloggen in Registries wie Docker Hub oder private Registries.

> **Tipp:** Unter Linux müssen Befehle oft mit `sudo` ausgeführt werden, wenn der Benutzer **nicht** in der `docker`-Gruppe ist. Alternativ kann man den Nutzer zur Gruppe hinzufügen (Sicherheitsaspekte beachten!).

### 2) Aufbau von Docker-Befehlen

```bash
docker <befehl> \[unterbefehl] \[optionen] \[argumente]
```

- Hilfe: `docker --help`, `docker <befehl> --help`
- Formatierte Ausgabe: `--format`
- Debug-Infos: `--log-level debug`

### 3) Images finden: `docker search`
Sucht Images auf Docker Hub (oder einer anderen Registry).

**Beispiele**

```bash
docker search nginx
docker search --filter=is-official=true nginx
docker search --filter=stars=100 postgres
```

### 4) Images herunterladen: `docker pull`

Lädt ein Image (inkl. Layer) in den lokalen Cache.

**Beispiele**

```bash
docker pull nginx\:latest
docker pull nginx:1.27
docker pull --platform linux/arm64 node:20
```

### 5) Images bauen: `docker build`

Baut ein Image aus einem **Build-Kontext** und einer `Dockerfile`.

**Beispiele**

```bash
docker build -t myapp:1.0 .
docker build --build-arg NODE\_ENV=production -t myapp\:prod .
```

**Best Practices**

- Wenige Layer, möglichst kleine Basis-Images.
- Multi-Stage Builds für kleinere Images.
- Keine Secrets ins Image kopieren.

### 6) Container starten: `docker run`

Startet Container aus Images.

**Beispiele**

```bash
docker run -it --rm alpine:3.20 sh
docker run -d --name web -p 8080:80 nginx:1.27
docker run -d -v data:/var/lib/postgresql/data postgres:16
```

### 7) Container inspizieren, überwachen, verwalten

- **Liste anzeigen:** `docker ps`, `docker ps -a`
- **Details:** `docker inspect <name>`
- **Logs:** `docker logs -f <name>`
- **In Container einloggen:** `docker exec -it <name> sh`
- **Statistiken:** `docker stats`
- **Stop/Start:** `docker stop <name>`, `docker start <name>`
- **Ressourcen bereinigen:** `docker system prune`

### 8) sudo & Berechtigungen

- Docker nutzt `/var/run/docker.sock`.
- Ohne Gruppenmitgliedschaft: Befehle mit `sudo` ausführen.
- Mit Gruppenmitgliedschaft:

```bash
sudo usermod -aG docker \$USER
```

→ Achtung: Mitglieder der `docker`-Gruppe haben Root-ähnliche Rechte!

### 9) Troubleshooting

- **Daemon läuft nicht:** `sudo systemctl status docker`
- **Zugriffsfehler:** `sudo` oder Gruppenmitgliedschaft prüfen.
- **Portkonflikt:** Host-Port ändern oder Dienst stoppen.
- **Speicherplatz:** `docker system df` & `docker system prune`
- **Namenskonflikt:** Container/Images löschen oder umbenennen.

---

## Hands-On Übung (Vorschlag)

1. **Image suchen:**

```bash
docker search httpd
```

2. **Image laden:**

```bash
docker pull nginx:1.27
```

3. **Container starten:**  

```bash
docker run -d --name web -p 8080:80 nginx:1.27
```

4. **Logs ansehen:**  

```bash
docker logs -f web
```

5. **In Container einloggen:**  

```bash
docker exec -it web sh
```

6. **Aufräumen:**  

```bash
docker stop web && docker rm web
```

---

## Mini-Cheat Sheet

- **Suchen:** `docker search <begriff>`
- **Herunterladen:** `docker pull <image>[:tag]`
- **Bauen:** `docker build -t <name:tag> <pfad>`
- **Starten:** `docker run [optionen] <image>`
- **Container anzeigen:** `docker ps -a`
- **Logs:** `docker logs <container>`
- **In Container einloggen:** `docker exec -it <container> sh`
- **Details:** `docker inspect <ressource>`
- **Stop/Start:** `docker stop|start <container>`
- **Löschen:** `docker rm <container>`, `docker rmi <image>`
- **Aufräumen:** `docker system prune`

---

## Glossar

- **Image:** Vorlage für Container (Dateisystem + Metadaten).
- **Container:** Laufende Instanz eines Images.
- **Layer:** Bausteine eines Images; Container bekommen eine zusätzliche Schreibschicht.
- **Registry:** Plattform zum Speichern/Verteilen von Images (z. B. Docker Hub).
- **Volume:** Persistenter Speicher für Container.
- **Netzwerk:** Virtuelles Netzwerk, das Container verbindet.
- **Daemon (`dockerd`):** Hintergrundprozess, der Docker steuert.
- **Client (`docker`):** CLI-Werkzeug, das mit `dockerd` kommuniziert.
