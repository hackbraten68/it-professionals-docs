---
title: Erweiterte CLI-Nutzung & Tipps
---

## Einführung

Auch wenn die Docker-CLI bereits mit ihren Basisbefehlen sehr leistungsfähig ist, ermöglichen erweiterte Optionen eine präzisere Steuerung der Container-Performance, eine bessere Ressourcenkontrolle, optimiertes Logging sowie eine deutlich gesteigerte Effizienz im Alltag.  
In diesem Kapitel werden fortgeschrittene CLI-Funktionen und Tipps vorgestellt, die für Entwickler und DevOps-Engineers unverzichtbar sind.

---

## 1. Ressourcenbeschränkungen

Standardmäßig können Container so viele Host-Ressourcen (CPU, RAM, Dateideskriptoren etc.) nutzen, wie es der Kernel erlaubt. Um Ressourcenerschöpfung zu verhindern und faire Nutzung sicherzustellen, stellt Docker CLI-Optionen bereit, um **Limits** zu setzen.

### 1.1 CPUs begrenzen

Beschränkt die CPU-Nutzung eines Containers. Im folgenden Beispiel wird der Container auf **1,5 CPUs** limitiert:

```bash
docker run --cpus="1.5" ubuntu
```

* Nützlich in Multi-Tenant-Umgebungen.
* Verhindert „Noisy Neighbor“-Probleme.
* Bruchteile erlauben anteilige CPU-Zuteilung.

### 1.2 Arbeitsspeicher begrenzen

Verhindert, dass ein Container unbegrenzt RAM belegt. Beispiel: Limitierung auf **512 MB**:

```bash
docker run -m 512m ubuntu
```

* Überschreiten des Limits führt zum Abbruch des Containers (OOMKilled).
* Speicher-Einheiten: `b`, `k`, `m`, `g`.

### 1.3 Ulimits

Setzt Linux User-Limits (ulimits) innerhalb von Containern. Beispiel: Anzahl offener Dateien begrenzen:

```bash
docker run --ulimit nofile=2048:4096 my-app
```

* **nofile=soft\:hard** → setzt Soft- und Hardlimit.
* Schützt vor Ressourcenlecks und unkontrollierten Prozessen.

---

## 2. Logging-Driver & Optionen

Container erzeugen Logs, die über unterschiedliche **Logging-Driver** verwaltet und in externe Systeme integriert werden können.

### 2.1 Logging-Driver festlegen

Standardmäßig wird `json-file` genutzt. Beispiel mit Rotation:

```bash
docker run \
  --log-driver=json-file \
  --log-opt max-size=10m \
  my-app
```

* `max-size=10m` rotiert Logs ab 10 MB.
* `max-file=N` legt fest, wie viele Rotationsdateien aufbewahrt werden.

### 2.2 Weitere gängige Logging-Driver

* **syslog** → Anbindung an System-Syslog.
* **journald** → Integration in systemd-Journal.
* **fluentd** → Weiterleitung an Fluentd zur Aggregation.
* **awslogs** → Versand an AWS CloudWatch.
* **gelf**, **splunk**, **etwlogs** (Windows) u. a.

Die Wahl des richtigen Drivers sorgt für Skalierbarkeit und zentrales Monitoring.

---

## 3. Formatierung & Filterung der Ausgabe

Bei der Verwaltung vieler Container kann die CLI-Ausgabe unübersichtlich werden. Mit **Formatierung** und **Filterung** lässt sich gezielt die gewünschte Information herausziehen.

### 3.1 Go-Template-Formatierung

Anpassen der `docker ps` Ausgabe mit Go-Templates:

```bash
docker ps --format "{{.Names}}\t{{.Status}}"
```

Beispielausgabe:

```bash
web-container   Up 10 minutes
db-container    Exited (0) 2 hours ago
```

Sehr hilfreich für Skripting und Automatisierung.

### 3.2 Filterung

Filter gezielt anwenden:

```bash
docker ps --filter "status=exited"
```

Weitere Filter-Keys:

* `name=container_name`
* `id=container_id`
* `ancestor=image_name`
* `before` / `since`

---

## 4. Kontexte & Profile

Beim Arbeiten mit mehreren Docker-Umgebungen (lokal, remote, Cloud) erleichtern **Kontexte** den nahtlosen Wechsel.

### 4.1 Kontexte auflisten

```bash
docker context ls
```

Zeigt alle verfügbaren Kontexte mit Endpunkten und Status.

### 4.2 Kontext wechseln

```bash
docker context use remote-docker
```

* Praktisch für Staging- und Produktions-Cluster.
* Spart das manuelle Setzen der Umgebungsvariable `DOCKER_HOST`.

### 4.3 Profile (Compose-Integration)

Mit Profilen (`docker-compose.yml`) können bestimmte Services gezielt aktiviert werden.

Beispiel:

```yaml
services:
  db:
    image: postgres
  frontend:
    image: react-app
    profiles: ["dev"]
```

Nur Frontend-Services starten:

```bash
docker compose --profile dev up
```

---

## 5. Shell-Autovervollständigung & Aliase

Eine effizientere CLI spart Zeit und reduziert Tippfehler.

### 5.1 Bash/Zsh Autocomplete aktivieren

Docker stellt Autocomplete-Skripte bereit:

```bash
source <(docker completion bash)
source <(docker completion zsh)
```

* Ermöglicht Tab-Vervollständigung für Befehle, Flags und Containernamen.
* Dauerhaft aktivierbar über `.bashrc` oder `.zshrc`.

### 5.2 Nützliche Aliase

Häufig verwendete Befehle abkürzen:

```bash
alias dps='docker ps'
alias drmi='docker rmi'
alias dstop='docker stop $(docker ps -q)'
```

Diese Shortcuts beschleunigen wiederkehrende Aufgaben.

---

## Fazit

Die erweiterte Nutzung der Docker-CLI ermöglicht mehr **Kontrolle**, bessere **Transparenz** und höhere **Produktivität**.
Durch das Beherrschen von Ressourcenlimits, Logging-Integrationen, Ausgabeformatierungen, Multi-Context-Verwaltung und CLI-Optimierungen können Entwickler Container effizienter verwalten – sowohl in Entwicklungs- als auch Produktionsumgebungen.
