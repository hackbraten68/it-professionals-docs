---
title: Kurze Einführung in Docker Persistente Daten
---

## Einführung

Docker-Container sind von Natur aus **ephemer**. Das bedeutet, dass standardmäßig alle Daten, die innerhalb eines Containers gespeichert werden, verloren gehen, sobald der Container gestoppt, entfernt oder neu erstellt wird. Während dieses Verhalten für zustandslose Anwendungen (z. B. APIs oder Frontends) nützlich ist, stellt es ein Problem dar für Anwendungen, die Daten dauerhaft speichern müssen, wie zum Beispiel:

- **Datenbanken** (PostgreSQL, MySQL, MongoDB)  
- **Content-Management-Systeme** (WordPress, Drupal)  
- **Dateispeicher-Dienste**  

Um dieses Problem zu lösen, bietet Docker Mechanismen für **persistente Datenspeicherung**. In dieser Lektion lernst du:

- Warum Persistenz in Docker wichtig ist  
- Den Unterschied zwischen **Volumes** und **Bind Mounts**  
- Wie man persistente Speicher nutzt und erstellt  
- Best Practices für den Umgang mit Daten in Containern  

---

## Warum Persistenz wichtig ist

Ohne persistente Speicherung gehen alle Änderungen an den Daten innerhalb eines Containers verloren, sobald der Container neu gestartet oder ersetzt wird. Beispiele:

- Wenn du einen PostgreSQL-Container ohne Persistenz betreibst und ihn neu startest, sind alle Tabellen und Datensätze verloren.  
- Wenn du ein CMS wie WordPress hostest, verschwinden hochgeladene Mediendateien, sobald der Container neu erstellt wird.  

Persistenz stellt sicher, dass **Anwendungszustände und Benutzerdaten Container-Neustarts überdauern**.

---

## Speicheroptionen in Docker

Docker bietet zwei Hauptmöglichkeiten, Daten persistent zu speichern:

### 1. Volumes

- **Definition**: Von Docker selbst verwaltet und in einem speziellen Bereich des Host-Dateisystems gespeichert (meist `/var/lib/docker/volumes/`).  
- **Vorteile**:
  - Unabhängig vom Container-Lebenszyklus  
  - Einfach zwischen Containern teilbar  
  - Für Docker optimiert (Performance, Portabilität)  
  - Leicht zu sichern und auf andere Hosts übertragbar  

**Beispiel:**

```yaml
services:
  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

Hier sorgt das `db-data` Volume dafür, dass die Datenbankdateien auch nach dem Entfernen des Containers erhalten bleiben.

---

### 2. Bind Mounts

* **Definition**: Bindet ein Verzeichnis oder eine Datei vom **Hostsystem** direkt in den Container ein.
* **Vorteile**:

  * Sehr praktisch für die Entwicklung (z. B. Code-Sync zwischen Host und Container).
  * Dateien lassen sich direkt auf dem Host ansehen und ändern.
* **Nachteile**:

  * Starke Kopplung an die Host-Dateistruktur.
  * Kann Sicherheitsrisiken bergen, wenn Host-Pfade unkontrolliert eingebunden werden.

**Beispiel:**

```yaml
services:
  app:
    image: nginx
    volumes:
      - ./html:/usr/share/nginx/html
```

Hier wird das lokale Verzeichnis `./html` in den Container gemountet, sodass Änderungen sofort sichtbar sind.

---

## Erstellung und Nutzung von persistentem Speicher

### Mit der Docker CLI

* Volume erstellen:

  ```bash
  docker volume create mydata
  ```
  
* Volume in einem Container verwenden:

  ```bash
  docker run -d -v mydata:/var/lib/mysql mysql
  ```

### Mit Docker Compose

Wie in den obigen Beispielen definiert man persistente Volumes im Schlüssel `volumes` der `docker-compose.yml`.

---

## Best Practices für den Umgang mit Daten in Containern

1. **Benannte Volumes für Produktion verwenden**: Leichter zu verwalten, zu migrieren und zu sichern.
2. **Bind Mounts für Entwicklung nutzen**: Ermöglichen schnelles Testen und Iterieren.
3. **Keine Daten im beschreibbaren Layer speichern**: Diese gehen beim Neubauen des Containers verloren.
4. **Regelmäßige Backups machen**: Besonders für Datenbanken und wichtige Dateien.
5. **Auf Berechtigungen achten**: Container sollten die richtigen Lese-/Schreibrechte auf die eingebundenen Verzeichnisse haben.

---

## Fazit

Persistente Daten sind die Grundlage für den Betrieb zustandsbehafteter Anwendungen in Docker. Durch den gezielten Einsatz von **Volumes** und **Bind Mounts** stellst du sicher, dass wichtige Anwendungsdaten Container-Neustarts und Deployments überleben.

Dieses Wissen ist essenziell beim Arbeiten mit Datenbanken, Dateispeichern oder jeder Anwendung, bei der Datenintegrität und Kontinuität entscheidend sind.
