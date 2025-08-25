---
title: Volumes vs. Bind Mounts
---
# Volumes vs. Bind Mounts

Wenn man mit Docker arbeitet, sind Container standardmäßig **flüchtig (ephemeral)**. Das bedeutet: Alle Daten, die innerhalb eines Containers gespeichert werden, gehen verloren, sobald der Container entfernt oder neugestartet wird. Um dieses Problem zu lösen, stellt Docker zwei Hauptmechanismen für **persistente Datenspeicherung** bereit: **Volumes** und **Bind Mounts**. Beide sorgen dafür, dass Daten über den Lebenszyklus eines Containers hinaus bestehen bleiben, unterscheiden sich jedoch in Anwendungsfall und Eigenschaften.

---

## 1. Warum persistente Speicherung wichtig ist

* **Zustandsbehaftete Anwendungen** (z. B. Datenbanken, CMS) benötigen Daten, die Neustarts überleben.
* **Logs und Konfigurationsdateien** müssen für Debugging und Compliance erhalten bleiben.
* **Dateifreigabe** zwischen Containern oder zwischen Host und Container ist oft notwendig.

Persistente Speicherung ist daher ein Grundpfeiler jeder produktiven Docker-Umgebung.

---

## 2. Volumes

### Eigenschaften

* **Von Docker verwaltet**: Erstellung, Speicherung und Verwaltung erfolgen direkt durch Docker.
* **Speicherort**: Standardmäßig in Dockers internem Verzeichnis (`/var/lib/docker/volumes/`).
* **Portabel & flexibel**: Unabhängig von der Verzeichnisstruktur des Hosts.
* **Sicher & stabil**: Empfohlen für Produktionsumgebungen.
* **Features**: Können gesichert, wiederhergestellt, inspiziert und zwischen Containern geteilt werden.

### Einsatzgebiete

* Datenbanken (PostgreSQL, MySQL, MongoDB).
* Persistente Anwendungsdaten (Uploads, Benutzereinstellungen).
* Wenn Docker die Speicherdetails selbst verwalten soll.

### Beispiel

```bash
# Volume namens "mydata" erstellen
docker volume create mydata

# Container starten und Volume an /data mounten
docker run -v mydata:/data myapp
```

### Volumes inspizieren

```bash
docker volume ls           # Alle Volumes anzeigen
docker volume inspect mydata
docker volume rm mydata    # Entfernen (falls nicht mehr genutzt)
```

---

## 3. Bind Mounts

### Eigenschaften

* **Direkt mit Host-Dateisystem verknüpft**: Ein Ordner oder eine Datei des Hosts wird in den Container gemountet.
* **Genauer Speicherort**: Der Nutzer bestimmt, wo die Daten auf dem Host liegen.
* **Echtzeit-Synchronisierung**: Änderungen im Host-Verzeichnis sind sofort im Container sichtbar (und umgekehrt).
* **Weniger portabel**: Stark an die Host-Umgebung gebunden.
* **Sicherheitsrisiken**: Falsche Konfiguration kann sensible Host-Dateien exponieren.

### Einsatzgebiete

* Entwicklungsumgebungen (Source Code zwischen Host und Container teilen).
* Debugging (Logs und Konfigurationen direkt vom Host zugänglich).
* Wenn exakte Kontrolle über Speicherort erforderlich ist.

### Beispiel

```bash
# Host-Verzeichnis in Container mounten
docker run -v /home/user/data:/data myapp
```

* `/home/user/data` → Host-Verzeichnis
* `/data` → Zielverzeichnis im Container

---

## 4. Vergleich: Volumes vs. Bind Mounts

| Merkmal                   | Volumes (Docker-verwaltet)         | Bind Mounts (Host-gebunden)                |
| ------------------------- | ---------------------------------- | ------------------------------------------ |
| **Verwaltung**            | Durch Docker                       | Durch Nutzer                               |
| **Speicherort**           | `/var/lib/docker/volumes/`         | Beliebiges Host-Verzeichnis                |
| **Portabilität**          | Hoch – unabhängig vom Host-Pfad    | Gering – Pfad muss auf Host vorhanden sein |
| **Backup**                | Mit Docker-Tools möglich           | Manuell zu organisieren                    |
| **Einsatz in Produktion** | Ja, empfohlen                      | Nur in Sonderfällen                        |
| **Geeignet für**          | Datenbanken, persistente App-Daten | Entwicklung, Debugging, lokale Tests       |

---

## 5. Best Practices

* **Volumes für Produktion nutzen**: Stabil, portabel, sicher.
* **Bind Mounts für Entwicklung**: Echtzeit-Sync, ideal für Quellcode.
* **Keine Hardcodierung von Host-Pfaden** in Teams oder CI/CD, um Portabilität zu gewährleisten.
* **Regelmäßige Backups** bei kritischen Daten (insbesondere bei Volumes).
* **Kombination nutzen**: Z. B. Volume für Datenbank, Bind Mount für Quellcode.

---

## 6. Praxisbeispiel

* **Entwicklung**:
  Der Quellcode des Projekts wird als **Bind Mount** eingebunden, damit Änderungen aus dem Editor sofort im Container sichtbar sind.

* **Produktion**:
  Die Anwendung nutzt ein **Volume** für Datenbankdaten, sodass diese bei Updates oder Redeployments erhalten bleiben.

---

✅ **Zusammenfassung**:

* **Volumes** = Von Docker verwaltet, portabel, sicher, ideal für Produktion.
* **Bind Mounts** = Host-gebunden, flexibel für Entwicklung, aber weniger portabel.

Beide Mechanismen sind essenziell im Docker-Ökosystem. Das Verständnis, wann welcher Ansatz sinnvoll ist, ist entscheidend für den Aufbau zuverlässiger containerisierter Anwendungen.
