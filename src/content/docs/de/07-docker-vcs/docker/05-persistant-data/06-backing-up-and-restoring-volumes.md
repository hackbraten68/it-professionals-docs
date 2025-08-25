---
title: Backing Up and Restoring Volumes
---
# Sichern und Wiederherstellen von Docker-Volumes

Ein **Docker-Volume** speichert persistente Daten für deine Container. Regelmäßige Backups – und das Wissen, wie man sie zuverlässig wiederherstellt – schützen dich vor Datenverlust durch Fehler, Upgrades, Migrationen oder Host-Ausfälle.

Dieser Leitfaden bietet dir ein klares, umfassendes und praxisorientiertes Vorgehen zum **Sichern und Wiederherstellen von Volumes** – mit Beispielen für Linux/macOS und Windows sowie Best Practices und Troubleshooting.

---

## Ziele

- Backup- und Restore-Strategien für Volumes verstehen  
- Mit `docker run` + `tar` Archiv-Backups erstellen und wiederherstellen  
- Backups prüfen und Test-Restores durchführen  
- Besondere Fälle behandeln (z. B. Datenbanken, Berechtigungen, SELinux, Docker Desktop)  
- Backups automatisieren, verschlüsseln und rotieren  

---

## Voraussetzungen & Konzepte

- **Docker ist installiert** und dein Nutzer kann Docker-Befehle ausführen.  
- Ein **Volume-Name** (z. B. `myvolume`).  
- Die hier genutzte Methode verwendet einen **Einmal-Container**, um die Daten aus dem Volume zu lesen und als Archiv auf dem Host zu speichern.  
- Grundkenntnisse in:  
  - `docker volume ls`, `docker volume inspect`  
  - `tar`-Archiven  
  - Shell oder PowerShell  

---

## Schnellstart: Portable `tar` Backups & Restores

### Backup (Volume archivieren)

```bash
docker run --rm \
  -v myvolume:/data:ro \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar czf /backup/backup-$(date +%F-%H%M%S).tar.gz -C /data .'
```

**Erklärung:**

* Das Volume wird unter `/data` eingehängt (read-only für Sicherheit).
* Das aktuelle Verzeichnis wird als `/backup` eingehängt.
* Ein zeitgestempeltes `tar.gz`-Archiv mit dem Inhalt des Volumes wird im Host-Verzeichnis erzeugt.

> Tipp: Mit `-C /data .` sicherst du nur die Inhalte des Volumes (und nicht den übergeordneten Ordner).

---

### Restore (Archiv in ein Volume einspielen)

```bash
# App-Container stoppen, falls Konsistenz benötigt wird
# docker stop <dein-app-container>

docker run --rm \
  -v myvolume:/data \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar xzf /backup/backup-2025-08-19-103000.tar.gz -C /data'
```

**Hinweise:**

* Archiv-Dateiname entsprechend anpassen.
* Vorhandene Dateien werden **überschrieben**, andere bleiben bestehen.
* Für einen **sauberen Restore**: neues Volume erstellen und dort entpacken.

---

## Strategien

### Cold vs. Hot Backup

* **Cold Backup**: Container stoppen → konsistente Daten (empfohlen für Datenbanken).
* **Hot Backup**: Backup während Container läuft → ok für statische Daten, riskant bei viel Schreiblast.

### Logisch vs. Snapshot

* **Logische Backups** (z. B. `tar`, `pg_dump`) → portabel, platzsparend, aber Restore dauert länger.
* **Snapshots** (ZFS, Btrfs, LVM) → schnell und konsistent, aber an Host gebunden.

---

## Best Practices

### Frisches Volume für Restores

```bash
docker volume create myvolume-restored

docker run --rm \
  -v myvolume-restored:/data \
  -v "$(pwd)":/backup \
  busybox \
  sh -c 'tar xzf /backup/backup-2025-08-19-103000.tar.gz -C /data'
```

### Backup verifizieren

```bash
sha256sum backup-2025-08-19-103000.tar.gz > backup-2025-08-19-103000.tar.gz.sha256
sha256sum -c backup-2025-08-19-103000.tar.gz.sha256
```

### Restore testen

Testweise in ein neues Volume einspielen und Container starten, um die Daten zu prüfen.

---

## Datenbanken: Besonderheiten

### Bevorzugt: Logische Dumps

* **PostgreSQL**

  ```bash
  docker exec -t my-postgres \
    pg_dump -U postgres -F c -d mydb > pgdump-$(date +%F-%H%M%S).dump
  ```

* **MySQL/MariaDB**

  ```bash
  docker exec -t my-mysql \
    sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --databases mydb' \
    > mysqldump-$(date +%F-%H%M%S).sql
  ```

**Warum?** Volume-Backups können inkonsistente Daten enthalten, wenn Container noch schreiben. Dumps sind transaktionssicher und einfacher zu migrieren.

---

## Windows & macOS

### Windows (PowerShell)

```powershell
docker run --rm `
  -v myvolume:/data:ro `
  -v ${PWD}:/backup `
  busybox `
  sh -c "tar czf /backup/backup-$([DateTime]::Now.ToString('yyyy-MM-dd-HHmmss')).tar.gz -C /data ."
```

### macOS

Funktioniert identisch wie Linux, nur `$(pwd)` ggf. in Anführungszeichen setzen.

---

## Sicherheit

* **Backups verschlüsseln**

  ```bash
  openssl enc -aes-256-cbc -salt -in backup.tar.gz -out backup.tar.gz.enc
  ```

* **Offsite speichern** (Cloud/Remote).
* **Zugriffsrechte einschränken**.
* **Secrets sensibel behandeln**.

---

## Automatisierung & Rotation

### Cronjob (Linux/macOS)

```bash
30 2 * * * /usr/bin/env bash -lc '
cd /srv/docker-backups
docker run --rm -v myvolume:/data:ro -v "$PWD":/backup busybox \
  sh -c "tar czf /backup/myvolume-$(date +%F-%H%M%S).tar.gz -C /data ."
ls -1t myvolume-*.tar.gz | tail -n +15 | xargs -r rm -f
'
```

Rotiert alte Backups, behält die letzten 14.

---

## Alternative Tools

* **rsync** für inkrementelle Backups
* **restic** für deduplizierte, verschlüsselte Backups

---

## Troubleshooting

* **`permission denied`** → Schreibrechte prüfen
* **Archiv enthält `/data` statt Inhalte** → `-C /data .` nutzen
* **Container schreibt noch** → Container stoppen oder Dump nutzen
* **Falscher Volume-Name bei Compose** → mit `docker volume ls` prüfen

---

## Zusammenfassung

* Mit `docker run` + `tar` lassen sich Volumes einfach sichern und wiederherstellen.
* Datenbanken sollten über **Dumps** gesichert werden.
* Backups regelmäßig **testen, verschlüsseln und rotieren**.
* Automatisierung mit Cron oder systemd.
* Tools wie **restic** bieten zusätzliche Features.

Mit diesen Methoden kannst du Docker-Volumes zuverlässig sichern und wiederherstellen – in Lernumgebungen und in Produktion.
