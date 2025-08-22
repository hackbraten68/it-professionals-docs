---
title: Extras & Best Practices
---

## Überblick

Dieser Leitfaden sammelt wertvolle Docker-Extras, nützliche CLI-Muster und produktionsreife Best Practices. Er ergänzt die Kernbefehle, indem er sich auf Wartbarkeit, Sicherheit, Performance und Betrieb im großen Maßstab konzentriert.

---

## Nützliche Befehle

### Kopieren, Umbenennen & Verschieben

- **Dateien zwischen Host und Container kopieren**

  ```bash
  # Host → Container
  docker cp ./local.txt myctr:/tmp/remote.txt

  # Container → Host
  docker cp myctr:/var/log/app.log ./app.log
  ```

*Tipp:* Pfade müssen existieren; ggf. Zielverzeichnisse vorher anlegen (`mkdir -p` im Container).

* **Container umbenennen**

  ```bash
  docker rename old-name new-name
  ```

* **Image neu taggen**

  ```bash
  docker tag old-image:tag new-repo/new-image:newtag
  ```

### Inspect, Diff, Top

* **Gezielt inspizieren (nur relevante Infos anzeigen)**

  ```bash
  docker inspect myctr --format '{{.State.Status}} {{.NetworkSettings.IPAddress}}'
  docker inspect myimg:1.2 --format '{{json .Config.Env}}' | jq
  ```

* **Dateisystemänderungen seit Start anzeigen**

  ```bash
  docker diff myctr
  ```

* **Laufende Prozesse im Container anzeigen**

  ```bash
  docker top myctr -eo pid,ppid,user,etime,cmd
  ```

### Events, Stats, Logs

* **Echtzeit-Events (gefiltert für weniger Rauschen)**

  ```bash
  docker events --filter 'type=container' --filter 'event=die'
  ```

* **Ressourcenverbrauch**

  ```bash
  docker stats --no-stream
  ```

* **Logs mit Zeitstempel und Tail**

  ```bash
  docker logs -f --since=10m --timestamps --tail=200 myctr
  ```

### Exec, Attach

* **Shell öffnen**

  ```bash
  docker exec -it myctr /bin/sh        # BusyBox/Alpine
  docker exec -it myctr /bin/bash      # Debian/Ubuntu
  ```

* **Direkt anhängen (selten; besser `exec` nutzen)**

  ```bash
  docker attach myctr
  ```

### Export/Import, Save/Load

* **Container-Dateisystem exportieren**

  ```bash
  docker export myctr | gzip > myctr.tar.gz
  docker import myctr.tar.gz myimg:from-export
  ```

* **Image sichern & laden**

  ```bash
  docker save myimg:1.2 | gzip > myimg_1.2.tgz
  docker load -i myimg_1.2.tgz
  ```

### Health, Wait, Exit Codes

* **Warten bis Container stoppt; Exit-Code abrufen**

  ```bash
  docker wait myctr
  echo $?
  ```

* **Container mit bestimmtem Signal stoppen**

  ```bash
  docker kill --signal=SIGTERM myctr
  ```

### Prune & Cleanup (immer mit Filtern!)

* **Selektives Aufräumen (erst Dry-Run!)**

  ```bash
  docker system df
  docker image prune --filter "until=168h" --dry-run
  docker container prune --filter "until=72h"
  docker volume prune
  docker system prune -a --volumes
  ```

### Formatierte Listen

* **Images anzeigen**

  ```bash
  docker images --format 'table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.ID}}'
  ```

* **Container anzeigen**

  ```bash
  docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
  ```

---

## Best Practices

### 1. Unveränderlichkeit & Konfiguration

* Container **unveränderlich** halten – Build once, run anywhere.
* **Konfiguration auslagern:**

  * Umgebungsvariablen (`-e`, `--env-file`)
  * **Secrets** & **Configs** (für sensible Daten)
  * **Volumes** für Laufzeitdaten
* **Nie** `docker commit` für Änderungen nutzen – Änderungen über Dockerfile & CI.

### 2. Schlanke & reproduzierbare Images

* **Schlanke Basisimages** verwenden (`debian:slim`, `alpine`).
* **Versionen fixieren** für reproduzierbare Builds.
* **Multi-Stage Builds** nutzen, um Build-Tools vom Runtime-Image zu trennen.
* **.dockerignore** verwenden, um Kontext klein zu halten.

### 3. Build-Performance & Cache

* **BuildKit aktivieren** (`DOCKER_BUILDKIT=1`).
* Cache-Mounts & Secret-Mounts für Builds nutzen.
* Schichten im Dockerfile nach Änderungsrate ordnen.

### 4. Sicherheit

* **Nicht als root** laufen lassen.
* **Capabilities droppen**, nur nötige behalten.
* **Read-only Root-FS**, `tmpfs` für Schreibpfade.
* **Healthchecks** definieren.
* Regelmäßig Images scannen.

### 5. Logging & Observability

* Logs strukturiert (JSON) über stdout/stderr.
* **Logging-Driver** mit Rotation konfigurieren.
* **Labels** für Team/Service setzen.
* **Metriken & Healthchecks** verfügbar machen.

### 6. Ressourcenlimits & Zuverlässigkeit

* CPU & RAM begrenzen (`--cpus`, `-m`).
* Restart-Policies nutzen (`on-failure`, `always`).
* Anwendungen müssen **SIGTERM** handhaben.

### 7. Netzwerke

* Eigene Netzwerke mit **DNS-Auflösung** erstellen.
* Nur notwendige Ports exposen.
* **Network Aliases** statt fester IPs nutzen.

### 8. Datenmanagement

* Persistente Daten nie ins Image backen.
* **Named Volumes** oder Bind Mounts nutzen.
* **Backups** für Volumes einplanen.

### 9. Tags & Versionierung

* `latest` vermeiden.
* **SemVer-Tags** & Digests nutzen.
* **Channel-Tags** via CI pflegen (`:prod`, `:staging`).

### 10. CI/CD

* Build → Test → Scan → Push → Deploy.
* Multi-Arch-Builds mit `buildx`.
* **SBOMs** speichern & scannen.

### 11. Compose-Tipps

* **Profiles** für optionale Services.
* Abhängigkeiten via **Healthchecks** modellieren.
* Secrets/Configs in Compose statt Env-Variablen.

---

## Troubleshooting Playbook

* Container startet nicht → `logs`, `inspect`.
* Netzwerkprobleme → `docker network inspect`, `getent hosts`.
* Speicherplatz voll → `docker system df`, `prune`.
* Hohe CPU/RAM-Last → `docker stats`.
* Berechtigungen falsch → Nutzer in Dockerfile setzen.

---

## Checklisten

**Image-Build**

* [ ] Basisimage schlank & aktuell
* [ ] Multi-Stage-Build
* [ ] `.dockerignore` vorhanden
* [ ] Abhängigkeiten versioniert
* [ ] Nicht-root-User
* [ ] Healthcheck definiert
* [ ] Scan auf Sicherheitslücken

**Runtime**

* [ ] Ressourcengrenzen gesetzt
* [ ] Restart-Policy korrekt
* [ ] Logrotation aktiv
* [ ] Root-FS read-only
* [ ] Capabilities reduziert
* [ ] Secrets sicher eingebunden
* [ ] Backups geplant

---

## Referenz-Snippets

Read-only FS mit Schreibpfaden:

```bash
docker run -d --read-only \
  --tmpfs /tmp \
  -v app-data:/var/lib/app \
  myorg/app:1.4.0
```

Capabilities minimal setzen:

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE myproxy:2.0
```

Healthcheck:

```dockerfile
HEALTHCHECK --interval=10s --timeout=2s \
  CMD wget -qO- http://localhost:8080/health || exit 1
```

Strukturierte Logs:

```js
console.log(JSON.stringify({ level: "info", msg: "started", ts: Date.now() }));
```

---

## Weitere Hinweise

* **Distroless Images** bevorzugen.
* Container als **ephemeral** behandeln.
* **Graceful Shutdowns** in Tests einplanen.
* Credentials regelmäßig rotieren.
* Automatisierte Rebuilds bei Basisupdates.
