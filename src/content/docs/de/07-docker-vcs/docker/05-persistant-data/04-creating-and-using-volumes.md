---
title: Erstellen und Verwenden von Volumes
---
# Erstellen und Verwenden von Volumes

## Einführung

In Docker sind Container standardmäßig **flüchtig** – alle darin gespeicherten Daten gehen verloren, sobald der Container entfernt oder neu erstellt wird. Um sicherzustellen, dass wichtige Daten über den Lebenszyklus eines Containers hinaus bestehen bleiben, stellt Docker **Volumes** bereit.

Volumes sind die **empfohlene Methode zur Speicherung persistenter Daten**, da sie vollständig von Docker verwaltet, portabel und für containerisierte Umgebungen optimiert sind.

---

## Was sind Volumes?

Ein **Volume** ist ein spezieller Speichermechanismus, der von Docker verwaltet wird. Im Gegensatz zu Bind Mounts, bei denen ein Host-Verzeichnis in einen Container eingebunden wird, werden Volumes im eigenen Speicherbereich von Docker gespeichert (meist unter `/var/lib/docker/volumes/`).

**Wichtige Eigenschaften:**

* Werden vollständig von Docker verwaltet
* Können einfach mit der Docker-CLI erstellt, aufgelistet und entfernt werden
* Portabel und unabhängig von der Dateistruktur des Hostsystems
* Funktionieren plattformübergreifend
* Geeignet für Einzelcontainer- und Multi-Container-Umgebungen

---

## Schritte zum Erstellen und Verwenden eines Volumes

### 1. Volume erstellen

Mit folgendem Befehl wird ein neues Volume angelegt:

```bash
docker volume create myvolume
```

* `myvolume` ist der Name des Volumes.
* Wird kein Name angegeben, erstellt Docker einen zufälligen Namen.
* Das Volume ist nun verfügbar und kann in Containern genutzt werden.

---

### 2. Volume in einem Container verwenden

Das Volume kann beim Start eines Containers eingebunden werden:

```bash
docker run -v myvolume:/app/data mycontainer
```

Erklärung:

* `-v` gibt die Verwendung eines Volumes an.
* `myvolume` ist der Name des Volumes.
* `/app/data` ist der Pfad im Container, an dem das Volume eingebunden wird.
* Alle Daten, die nach `/app/data` geschrieben werden, bleiben erhalten – selbst wenn der Container gelöscht wird.

---

### 3. Volume inspizieren

Mit folgendem Befehl lassen sich Details zum Volume anzeigen:

```bash
docker volume inspect myvolume
```

Angezeigt werden unter anderem:

* Name des Volumes
* Mountpoint auf dem Host
* Erstellungszeitpunkt
* Verwendeter Treiber (Standard: `local`)

---

## Anwendungsfälle für Volumes

Volumes werden in vielen Szenarien eingesetzt:

1. **Datenbanken**

   * Speicherung von Daten für PostgreSQL, MySQL oder MongoDB
   * Verhindert Datenverlust bei Neustart von Containern

2. **Dateiuploads und Medien**

   * Speichern von Benutzer-Uploads wie Bildern oder Dokumenten
   * Webanwendungen können Mediendateien außerhalb des Containers speichern

3. **Gemeinsamer Speicher für mehrere Container**

   * Mehrere Container können dasselbe Volume einbinden
   * Beispiel: Ein Webserver-Container und ein Applikations-Container greifen auf dieselben Uploads zu

4. **Backups und Wiederherstellung**

   * Volumes können einfach gesichert und wiederhergestellt werden – mit der Docker-CLI oder externen Tools

---

## Best Practices für Volumes

* Verwende Volumes statt Bind Mounts für bessere Portabilität und Wartbarkeit.
* Vergib sprechende Namen für Volumes (z. B. `db-data`, `uploads`).
* Sichere regelmäßig Volumes, die kritische Daten enthalten.
* Nutze **docker-compose**, um Volumes in komplexen Projekten zentral zu definieren und zwischen Services wiederzuverwenden.

---

## Zusammenfassung

* **Volumes** sind der empfohlene Weg, um Daten in Docker persistent zu speichern.
* Sie werden mit `docker volume create` erstellt, mit `docker run -v` genutzt und mit `docker volume inspect` verwaltet.
* Typische Einsatzszenarien sind Datenbanken, Dateiuploads, gemeinsamer Zugriff mehrerer Container sowie Backups.
* Mit Best Practices stellst du sicher, dass deine Anwendungen zuverlässig und portabel bleiben.
