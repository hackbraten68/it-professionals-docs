---
title: Volumes für persistente Daten
---
# Volumes für persistente Daten

> Verwende **Volumes**, um Daten zu speichern, die Container-Neuaufbauten, Upgrades und Neustarts überleben sollen. Dies ist essenziell für zustandsbehaftete Dienste wie Datenbanken.

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## Warum Persistenz wichtig ist

Container sind **flüchtig**: Wird ein Container entfernt, verschwinden alle Daten in seiner beschreibbaren Schicht. Datenbanken, Message Queues, Uploads und Caches müssen jedoch oft **länger leben** als der Container selbst. Volumes bieten einen dauerhaften, hostverwalteten Speicherort, der **vom Container entkoppelt** ist.

---

## Speicheroptionen im Überblick

* **Benannte Volumes (empfohlen in den meisten Fällen)**
  Von Docker verwaltet; Daten liegen im Docker-Speicherbereich (z. B. `/var/lib/docker/volumes/...`). Portabel über mehrere Compose-Läufe hinweg.

* **Bind Mounts**
  Binden einen spezifischen Host-Pfad in den Container ein (z. B. `./data:/var/lib/postgresql/data`). Praktisch für lokale Entwicklung oder direkten Host-Zugriff, aber man muss Pfade und Berechtigungen selbst verwalten.

* **Anonyme Volumes**
  Implizit erstellt (kein Name). Nützlich für temporäre Daten, aber später schwer wiederzufinden.

* **tmpfs Mounts (nur Linux)**
  Speicher im RAM, nicht persistent. Für sensible oder extrem IO-lastige temporäre Daten.

---

## Verwendung von benannten Volumes in Compose

### Kurze Syntax (Standardfall)

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### Lange Syntax (erweiterte Optionen)

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - type: volume
        source: db-data
        target: /var/lib/postgresql/data
        read_only: false
        volume:
          nocopy: true   # verhindert Kopieren bestehender Container-Daten ins Volume
volumes:
  db-data:
    name: myproject-db   # expliziter Name (nützlich in Skripten oder mehreren Stacks)
```

### Volume zwischen Services teilen

```yaml
services:
  db:
    image: postgres:16
    volumes: [db-data:/var/lib/postgresql/data]
  backup:
    image: alpine
    volumes: [db-data:/var/lib/postgresql/data:ro]
    command: ["sh","-c","tar czf /backup/db.tgz -C /var/lib/postgresql/data ."]
volumes:
  db-data:
```

---

## Bind Mounts vs. benannte Volumes

| Anwendungsfall                             | Empfehlung                                                      |
| ------------------------------------------ | --------------------------------------------------------------- |
| Produktion/zustandsbehaftete Dienste       | **Benannte Volumes** (isoliert vom Host, leichter zu verwalten) |
| Lokale Entwicklung mit Live-Code           | **Bind Mounts** (Dateien direkt am Host editieren)              |
| Präzise Kontrolle über Host-Pfade/Backups  | **Bind Mounts**                                                 |
| Portabilität (z. B. zwischen Maschinen/CI) | **Benannte Volumes**                                            |

**Beispiel Bind Mount:**

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - ./db-data:/var/lib/postgresql/data   # Host-Pfad -> Container-Pfad
```

---

## Funktionsweise von Volumes

* Docker erstellt ein Verzeichnis im Speicherbereich und mountet es in den Container (`target`-Pfad).
* Entfernt man den **Container**, bleibt das **Volume** bestehen.
* Entfernt man das **Volume**, gehen die Daten verloren.

---

## Lebenszyklus & Befehle

```bash
# Volumes auflisten
docker volume ls

# Volume-Details anzeigen
docker volume inspect db-data

# Unbenutztes Volume löschen (nur wenn kein Container es nutzt)
docker volume rm db-data

# Alle unbenutzten Volumes löschen (⚠ nicht umkehrbar)
docker volume prune
```

**Compose-Tipps**

* `docker compose down` lässt benannte Volumes standardmäßig bestehen.
* `docker compose down --volumes` entfernt sie (inkl. Daten). Vorsicht!

---

## Backups & Wiederherstellung

**Mit einem temporären Hilfscontainer (für jeden Service geeignet):**

```bash
# Backup (tar.gz auf Host)
docker run --rm \
  -v db-data:/data:ro \
  -v "$PWD":/backup \
  alpine sh -c "tar czf /backup/db-data-$(date +%F).tgz -C /data ."

# Restore in leeres Volume
docker run --rm \
  -v db-data:/data \
  -v "$PWD":/backup \
  alpine sh -c "tar xzf /backup/db-data-2025-08-18.tgz -C /data"
```

**Backup-Service direkt in Compose:**

```yaml
services:
  backup:
    image: alpine
    volumes:
      - db-data:/data:ro
      - ./backups:/backup
    entrypoint: ["sh","-c","tar czf /backup/db-$(date +%F-%H%M).tgz -C /data . && sleep 3600"]
volumes:
  db-data:
```

---

## Berechtigungen & typische Probleme

* **UID/GID**: Datenbank-Images (z. B. Postgres) erwarten bestimmte Benutzerrechte (oft UID 999). Bei `permission denied` oder „wrong ownership“:

  ```bash
  docker run --rm -v db-data:/var/lib/postgresql/data alpine \
    sh -c "chown -R 999:999 /var/lib/postgresql/data"
  ```

  Oder direkt im Compose setzen:

  ```yaml
  services:
    db:
      image: postgres:16
      user: "999:999"
  ```

* **SELinux (Fedora/RHEL/CentOS)**: Bei Bind Mounts `:z` oder `:Z` hinzufügen:

  ```yaml
  - ./db-data:/var/lib/postgresql/data:Z
  ```

* **Windows/macOS Performance**: Bind Mounts sind langsamer wegen Dateisystem-Sync. Für DBs besser **benannte Volumes** nutzen.

* **Init-Skripte für DBs**: Schemas/Seeds in separatem Mount (`/docker-entrypoint-initdb.d`) statt im Datenverzeichnis ablegen.

---

## Externe & bestehende Volumes

Verwende **external**, wenn ein Volume außerhalb von Compose erstellt wurde:

```yaml
services:
  db:
    image: postgres:16
    volumes: [prod-db:/var/lib/postgresql/data]
volumes:
  prod-db:
    external: true
    name: prod-db
```

---

## Volume-Treiber (fortgeschritten)

Mit Treibern lassen sich Volumes per NFS, CIFS/SMB oder Cloud-Plugins bereitstellen:

```yaml
volumes:
  db-data:
    driver: local
    driver_opts:
      type: "nfs"
      o: "addr=10.0.0.10,nolock,soft,rw"
      device: ":/exports/postgres"
```

Szenarien:

* **local** (Standard): Basislösung.
* **nfs/smb**: Teilen zwischen Hosts (Achtung: Latenz, Locking).
* Plugins (z. B. Cloud, SAN): Für Hochverfügbarkeit oder Managed Storage.

---

## tmpfs Mounts (flüchtig, im RAM)

```yaml
services:
  cache:
    image: redis:7
    tmpfs:
      - /data
```

Sehr schnell, aber nicht persistent. Ideal für temporäre/sensible Daten.

---

## Compose-Patterns & Optionen

* **Read-only Mounts**
  `- db-data:/var/lib/postgresql/data:ro` für Backup-Container.

* **Mehrfachnutzung**
  Mehrere Container können dasselbe Volume nutzen. App muss Synchronisierung sicherstellen.

* **Nocopy**
  Verhindert automatisches Kopieren von Container-Daten ins neue Volume:

  ```yaml
  - type: volume
    source: db-data
    target: /var/lib/postgresql/data
    volume: { nocopy: true }
  ```

---

## Persistenz testen (Quick Check)

1. Postgres mit benanntem Volume starten.
2. Tabelle/Eintrag erstellen.
3. Container löschen: `docker compose rm -sf db`.
4. Neu starten: `docker compose up -d db`.
5. Daten prüfen → sie sind noch da.

---

## Sicherheitsaspekte

* **Least Privilege**: Services als Nicht-Root laufen lassen (`user:`).
* **Backups**: Verschlüsseln und Zugriff einschränken.
* **Secrets**: Keine Passwörter ins Volume schreiben. Lieber Docker Secrets oder Env Vars nutzen.

---

## Troubleshooting-Checkliste

* *Container startet nicht / Permission denied*
  UID/GID prüfen und anpassen.

* *Daten nach Redeploy weg*
  Wahrscheinlich kein benanntes Volume verwendet. Keine Daten in Container-Layer speichern.

* *Langsame DB (Windows/macOS)*
  Bind Mounts durch benannte Volumes ersetzen.

* *SELinux-Fehler bei Bind Mounts*
  `:z` oder `:Z` verwenden.

---

## Praxisbeispiele

**Postgres mit Volume + Init-Skripten**

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./initdb:/docker-entrypoint-initdb.d:ro
volumes:
  db-data:
```

**MySQL mit Backup-Verzeichnis**

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - mysql-data:/var/lib/mysql
      - ./backups:/backups
volumes:
  mysql-data:
```

---

## Clean-up & Migration

* Backups regelmäßig rotieren & Wiederherstellung testen.
* Für Migrationen: Volume archivieren (tar), übertragen und im neuen Host wiederherstellen.
* Mit `labels` Volumes kennzeichnen und verwalten.

```bash
docker volume create --label project=myapp --name myapp-db
docker volume inspect myapp-db
```

---

## Wichtigste Erkenntnisse

* **Benannte Volumes** für produktive Persistenz nutzen.
* **Bind Mounts** nur bei Bedarf für direkten Host-Zugriff (Dev, Tools).
* **Berechtigungen** beachten (UID/GID).
* **Backups explizit** erstellen und testen.
* `down --volumes` nur verwenden, wenn Daten wirklich gelöscht werden sollen.
