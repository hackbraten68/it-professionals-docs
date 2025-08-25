---
title: Summary
---
# Lektion: Zusammenfassung von Persistent Data in Docker

---

## Einführung

Docker-Container sind von Natur aus **flüchtig**. Das bedeutet, dass alle Daten, die sich innerhalb eines Containers befinden, verloren gehen, sobald dieser gestoppt oder entfernt wird. Für viele Anwendungen – wie Datenbanken, Webapplikationen oder Logging-Systeme – ist dieses Verhalten jedoch ungeeignet.

In dieser Lektion fassen wir die Kernkonzepte von **persistenten Daten** in Docker zusammen, erklären ihre Bedeutung und zeigen, wie sie effektiv genutzt werden können.

---

## Lernziele

Am Ende dieser Lektion solltest du in der Lage sein:

* zu erklären, was persistente Daten sind und warum sie wichtig sind
* den Unterschied zwischen **Volumes** und **Bind Mounts** zu verstehen
* Volumes in Docker zu erstellen und zu nutzen
* Backups und Wiederherstellungen von Volumes durchzuführen
* Best Practices für den Umgang mit persistenten Daten anzuwenden

---

## 1. Was sind persistente Daten?

Persistente Daten sind Informationen, die **Container-Neustarts oder -Löschungen überdauern**. Im Gegensatz zu temporären Daten im Container stellen sie sicher, dass der Zustand einer Anwendung erhalten bleibt.

**Beispiele:**

* Datenbankeinträge
* Hochgeladene Dateien (z. B. Bilder, Dokumente, Videos)
* Konfigurationsdateien und Secrets
* Anwendungsprotokolle

---

## 2. Warum brauchen wir persistente Daten?

Ohne persistente Speicherung:

* gehen **alle Datenbanken** verloren, sobald ein Container entfernt wird
* verschwinden **Logs und Konfigurationen** bei jedem Neustart
* ist **Datenaustausch zwischen Containern** nicht möglich

Mit persistenter Speicherung:

* können Anwendungen ihren **Zustand über Neustarts hinweg behalten**
* lassen sich Daten **zwischen mehreren Containern teilen**
* bleiben Systeme **zuverlässig und robust** für kritische Anwendungen

---

## 3. Volumes vs. Bind Mounts

Docker stellt zwei Hauptmethoden zur Verfügung: **Volumes** und **Bind Mounts**.

### Volumes

* werden von Docker verwaltet
* liegen im internen Docker-Verzeichnis (`/var/lib/docker/volumes/`)
* sind portabel und leicht zu sichern
* unabhängig von der Host-Systemstruktur
* empfohlen für **Produktivumgebungen**

**Beispiel:**

```bash
docker volume create mydata
docker run -v mydata:/app/data myapp
```

### Bind Mounts

* binden direkt ein Host-Verzeichnis an den Container
* praktisch in der **Entwicklung** (z. B. für Quellcode-Sync)
* weniger portabel, abhängig von der Host-Verzeichnisstruktur

**Beispiel:**

```bash
docker run -v /home/user/data:/app/data myapp
```

**Merksatz:**

* **Volumes** für Produktion
* **Bind Mounts** für Entwicklung

---

## 4. Erstellen und Verwenden von Volumes

**Schritt 1: Volume erstellen**

```bash
docker volume create myvolume
```

**Schritt 2: Volume im Container nutzen**

```bash
docker run -d \
  -v myvolume:/app/data \
  myapp
```

**Schritt 3: Volume inspizieren**

```bash
docker volume inspect myvolume
```

**Typische Anwendungsfälle:**

* Datenbank-Speicherung (`/var/lib/postgresql/data`)
* Uploads von Webanwendungen
* Gemeinsame Daten für mehrere Services

---

## 5. Backup und Wiederherstellung von Volumes

Um Datenverlust zu vermeiden, sollten **regelmäßige Backups** erfolgen.

**Backup eines Volumes:**

```bash
docker run --rm \
  -v myvolume:/data \
  -v $(pwd):/backup \
  busybox \
  tar czf /backup/backup.tar.gz /data
```

**Wiederherstellung eines Volumes:**

```bash
docker run --rm \
  -v myvolume:/data \
  -v $(pwd):/backup \
  busybox \
  tar xzf /backup/backup.tar.gz -C /
```

So können Daten gesichert, migriert oder nach einem Fehler wiederhergestellt werden.

---

## 6. Best Practices

* **Bevorzuge Volumes** statt Bind Mounts in Produktion
* **Backup-Strategien mit Versionierung** nutzen (mehrere Wiederherstellungspunkte)
* **Host-Pfade nicht fest verdrahten** (erhöht Portabilität)
* **Speichernutzung überwachen**, damit Volumes nicht unkontrolliert wachsen
* **Volume-Driver** einsetzen (z. B. Cloud-Speicher, Verschlüsselung) bei besonderen Anforderungen

---

## Checkpoint-Fragen

<details>
<summary>1. Was passiert mit Container-Daten ohne persistente Speicherung?</summary>
Die Daten gehen verloren, sobald der Container entfernt oder neu erstellt wird.
</details>

<details>
<summary>2. Was ist der Hauptunterschied zwischen Volumes und Bind Mounts?</summary>
Volumes werden von Docker verwaltet und sind portabel; Bind Mounts sind an Host-Verzeichnisse gebunden und weniger flexibel.
</details>

<details>
<summary>3. Warum sind Volumes in Produktion empfehlenswert?</summary>
Sie sind portabel, leichter zu verwalten und unabhängig von der Host-Verzeichnisstruktur.
</details>

<details>
<summary>4. Wie kann man ein Docker-Volume sichern?</summary>
Indem man einen Container startet, das Volume mountet und mit `tar` ein Archiv erstellt.
</details>

---

## Fazit

Persistente Speicherung ist entscheidend, um Docker-Anwendungen zuverlässig und produktiv zu betreiben.
Mit **Volumes**, regelmäßigen **Backups** und den richtigen **Best Practices** stellst du sicher, dass deine Daten sicher, portabel und jederzeit verfügbar bleiben.
