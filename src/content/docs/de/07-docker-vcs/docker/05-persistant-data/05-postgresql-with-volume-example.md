---
title: PostgreSQL mit einem persistenten Docker Volume betreiben
---
# PostgreSQL mit einem persistenten Docker Volume betreiben

Diese Anleitung macht den folgenden Befehl verständlich und einsatzbereit für den Unterricht. Du lernst, was jede Option macht, was im Hintergrund passiert, wie man Persistenz prüft und wie man Backups, Wiederherstellung und Upgrades sicher durchführt.

```bash
docker volume create pgdata

docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

---

## 1) Was dieses Setup erreicht

* **Erstellt ein benanntes Volume** `pgdata`, das von Docker verwaltet wird.
* **Startet einen PostgreSQL-Container** basierend auf dem offiziellen `postgres`-Image.
* **Bindet das Volume ein** in das Datenverzeichnis von PostgreSQL (`/var/lib/postgresql/data`).
* **Sichert die Daten persistent**, auch wenn der Container entfernt oder neu erstellt wird.

---

## 2) Voraussetzungen

* Installiertes Docker (Docker Desktop auf macOS/Windows oder Docker Engine auf Linux).
* Netzwerkzugriff, um das `postgres`-Image von Docker Hub zu ziehen.
* Zugriff auf ein Terminal/Shell.

---

## 3) Befehlsanalyse

### 3.1 Volume erstellen

```bash
docker volume create pgdata
```

* **Benanntes Volume**: Docker speichert es intern (z. B. unter `/var/lib/docker/volumes/...` auf Linux).
* **Lebensdauer**: Ein Volume überlebt Container, die es nutzen – Daten sind nicht an einen einzelnen Container gebunden.

### 3.2 PostgreSQL mit Volume starten

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

* `-d`: Startet im Hintergrund (detached mode).
* `--name my-postgres`: Gibt dem Container einen sprechenden Namen.
* `-e POSTGRES_PASSWORD=...`: **Pflicht** für den Superuser `postgres`.
* `-v pgdata:/var/lib/postgresql/data`: Mountet das Volume an den Pfad, in dem PostgreSQL Daten speichert.
* `postgres`: Nutzt das offizielle PostgreSQL-Image (Standard: neueste Version).

> ✅ **Ergebnis**: Beim ersten Start wird ein neuer PostgreSQL-Datencluster erstellt. Bei weiteren Starts mit demselben Volume wird dieser wiederverwendet.

---

## 4) Was im Hintergrund passiert

1. Docker **lädt** das `postgres`-Image (falls nicht vorhanden).
2. Der Container **initialisiert** ein Datenverzeichnis beim ersten Start.
3. Das Volume `pgdata` wird **eingehängt** ins Container-Verzeichnis `/var/lib/postgresql/data`.
4. PostgreSQL **schreibt** alle persistenten Daten dorthin.
5. Beim Stoppen/Entfernen des Containers bleibt das Volume **erhalten**.

---

## 5) Persistenz überprüfen

### 5.1 Test-Datenbank und Tabelle erstellen

Container mit Portfreigabe starten:

```bash
docker rm -f my-postgres
docker run -d \
  --name my-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

Dann:

```bash
PGPASSWORD=mysecretpassword psql -h localhost -U postgres -c "CREATE DATABASE demo;"
PGPASSWORD=mysecretpassword psql -h localhost -U postgres -d demo -c "CREATE TABLE t (id int); INSERT INTO t VALUES (1);"
```

### 5.2 Container löschen und neu starten

```bash
docker rm -f my-postgres
docker run -d \
  --name my-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

### 5.3 Daten prüfen

```bash
PGPASSWORD=mysecretpassword psql -h localhost -U postgres -d demo -c "SELECT * FROM t;"
```

Die Zeile `1` ist weiterhin vorhanden → Datenpersistenz bestätigt.

---

## 6) Nützliche Befehle

* Volumes auflisten:

  ```bash
  docker volume ls
  ```

* Volume inspizieren:

  ```bash
  docker volume inspect pgdata
  ```

* Logs ansehen:

  ```bash
  docker logs -f my-postgres
  ```

* In Container einloggen:

  ```bash
  docker exec -it my-postgres bash
  ```

---

## 7) Häufig genutzte Umgebungsvariablen

* `POSTGRES_PASSWORD`: Passwort für `postgres` (Pflicht).
* `POSTGRES_USER`: Erstellt anderen Superuser (Standard: `postgres`).
* `POSTGRES_DB`: Erstellt eine Datenbank (Standard: gleich wie Benutzername).
* `TZ`: Zeitzone (z. B. `UTC`).

---

## 8) Backup und Restore

### 8.1 Logisches Backup

```bash
docker exec -t my-postgres pg_dump -U app -d appdb > backup.sql
```

Wiederherstellung:

```bash
cat backup.sql | docker exec -i my-postgres psql -U app -d appdb
```

### 8.2 Volume-Backup

```bash
docker run --rm \
  -v pgdata:/source \
  -v "$PWD":/backup \
  alpine sh -c "cd /source && tar czf /backup/pgdata_backup.tar.gz ."
```

Restore:

```bash
docker volume rm pgdata
docker volume create pgdata
docker run --rm \
  -v pgdata:/restore \
  -v "$PWD":/backup \
  alpine sh -c "cd /restore && tar xzf /backup/pgdata_backup.tar.gz"
```

---

## 9) Upgrade PostgreSQL

* Versionsnummer festlegen (`postgres:16`).
* Upgrade-Strategie:

  * **Kleinere Versionen**: Volume weiter nutzen.
  * **Major-Versionen**: Dump & Restore oder `pg_upgrade` nutzen.

---

## 10) Sicherheit

* Starke Passwörter nutzen.
* Ports nur lokal freigeben:

  ```bash
  -p 127.0.0.1:5432:5432
  ```

* Backups regelmäßig prüfen.
* Nur minimale Berechtigungen für App-User vergeben.

---

## 11) Performance

* SSD/NVMe nutzen → bessere I/O-Leistung.
* Named Volumes besser als langsame Netzwerk-Mounts.
* Konfiguration (z. B. `shared_buffers`) anpassen.

---

## 12) Häufige Probleme

* **Permission Denied bei Bind-Mounts**: Host-Verzeichnis muss `UID 999` (Postgres-User im Container) gehören.
* **Port belegt**: anderen Host-Port nutzen (`-p 5433:5432`).
* **Datenverlust**: prüfen, ob richtiges **benanntes Volume** genutzt wird.
* **Crash Loops**: Logs prüfen mit `docker logs`.

---

## 13) Docker-Compose-Variante

```yaml
services:
  db:
    image: postgres:16
    container_name: my-postgres
    ports:
      - "127.0.0.1:5432:5432"
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: strongpass
      POSTGRES_DB: appdb
      TZ: UTC
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 14) Aufräumen

* Container entfernen:

  ```bash
  docker rm -f my-postgres
  ```
  
* Volume löschen (**löscht alle Daten!**):

  ```bash
  docker volume rm pgdata
  ```

---

## 15) FAQ

* **Können mehrere Container dasselbe Volume nutzen?**
  Nein, nicht gleichzeitig für PostgreSQL – es erwartet exklusiven Zugriff.

* **Muss ich `-p 5432:5432` angeben?**
  Nur, wenn du vom Host oder anderen Rechnern zugreifen willst. Innerhalb von Docker-Netzwerken reicht der Service-Name.

* **Wo liegen die Volume-Daten?**
  Mit `docker volume inspect pgdata` kannst du den Pfad sehen.

* **Wie ändere ich Konfigurationen?**
  Flags angeben oder eigene `postgresql.conf` einbinden. Beispiel:

  ```bash
  docker run ... postgres:16 -c shared_buffers=256MB -c max_connections=200
  ```

---

### Zusammenfassung

Ein **benanntes Volume** mit dem offiziellen `postgres`-Image ist der einfachste und robusteste Weg, um Daten in Docker persistent zu speichern. Mit Version-Pinning, Backups und Sicherheitsmaßnahmen erhält man eine stabile und zuverlässige Datenbank-Umgebung.
