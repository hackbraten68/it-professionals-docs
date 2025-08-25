---
title: Warum brauchen wir persistente Daten?
---

## Einführung

Docker-Container sind von Natur aus **flüchtig (ephemeral)**. Das bedeutet: Sobald ein Container gestoppt oder entfernt wird, gehen alle darin gespeicherten Daten verloren. Für zustandslose (stateless) Anwendungen ist dieses Verhalten nützlich, doch für Anwendungen, die auf langfristige Datenspeicherung angewiesen sind, wird es zum Problem.  

Um dieses Problem zu lösen, bietet Docker Mechanismen für **persistente Datenspeicherung**, die sicherstellen, dass Informationen auch nach einem Neustart oder dem Entfernen eines Containers erhalten bleiben.

---

## Was passiert ohne Persistenz?

Wenn ausschließlich das interne Dateisystem des Containers genutzt wird, gehen Daten in typischen Szenarien verloren:

- **Datenverlust bei Datenbanken**  
  Wird ein Datenbank-Container (z. B. PostgreSQL, MySQL, MongoDB) entfernt oder neu erstellt, verschwinden alle Tabellen, Datensätze und Konfigurationen.  

- **Verlust von Logdateien**  
  Logs, die im Container-Dateisystem gespeichert werden, sind nach der Löschung des Containers nicht mehr verfügbar. Damit ist langfristiges Debugging, Monitoring oder Auditing unmöglich.  

- **Zurückgesetzte Konfigurationen**  
  Individuell angepasste Konfigurationsdateien (z. B. für Nginx, Apache oder eine App) würden nach einem Neustart verloren gehen, was jedes Mal eine Neueinrichtung erfordern würde.  

- **Keine Dateifreigabe**  
  Ohne Persistenz können Container weder Dateien untereinander noch mit dem Host-System teilen. Beispielsweise kann ein Backend-Container keine hochgeladenen Bilder aus einem Frontend-Container abrufen, wenn diese nur dort gespeichert sind.

---

## Vorteile von persistenter Speicherung

Persistente Speicherlösungen (z. B. **Volumes** oder **Bind Mounts**) verhindern Datenverlust und ermöglichen praxisnahe Szenarien. Zentrale Vorteile sind:

1. **Daten behalten zwischen Neustarts**  
   Kritische Informationen wie Datenbankinhalte, Benutzer-Uploads oder Cache-Daten bleiben auch nach einem Container-Neustart erhalten.  

2. **Datenfreigabe zwischen Containern**  
   Mehrere Container können auf denselben Speicher zugreifen. Zum Beispiel:  
   - Ein Webserver speichert hochgeladene Bilder.  
   - Ein API-Service verarbeitet diese Bilder über dasselbe Volume.  

3. **Erhöhte Zuverlässigkeit**  
   Wichtige Artefakte wie Logs, Backups oder App-Zustände können sicher gespeichert werden, ohne bei jedem Deployment verloren zu gehen.  

4. **Trennung von Logik und Daten**  
   Durch die Entkopplung von Anwendung und Datenspeicherung lassen sich Container leichter aktualisieren, neu erstellen oder austauschen, ohne dass Daten verloren gehen.  

5. **Integration mit dem Host-System**  
   Entwickler und Administratoren können direkt auf Container-Daten zugreifen, etwa für Debugging, Backups oder Dateninspektion.

---

## Typische Anwendungsfälle

Persistente Daten sind in fast allen realen Projekten notwendig. Typische Beispiele sind:

- **Datenbanken:** PostgreSQL, MySQL oder MongoDB zur Speicherung von Tabellen, Indizes und Schemata.  
- **Content-Management-Systeme (CMS):** WordPress oder Drupal für Medien-Uploads und Benutzerdaten.  
- **Log-Speicherung:** Sammlung und Analyse von Applikations-Logs über längere Zeiträume.  
- **Benutzer-Uploads:** Speicherung von Bildern, Dokumenten und Videos, die von Anwendern hochgeladen werden.  
- **Konfigurationsdateien:** Beibehaltung von individuellen Einstellungen und Präferenzen über Deployments hinweg.  

---

## Fazit

Ohne persistente Daten wären Container nur für kurzlebige, zustandslose Aufgaben sinnvoll. Doch die meisten modernen Anwendungen benötigen **dauerhafte Daten**, die auch nach Neustarts oder Updates erhalten bleiben müssen.  

Persistente Speicherung schließt diese Lücke, indem sie sicherstellt, dass wertvolle Informationen – wie Datenbankinhalte, Logs oder Benutzer-Uploads – nicht verloren gehen.  

Kurz gesagt: **Persistente Daten machen Docker-Container erst praxistauglich für den produktiven Einsatz.**
