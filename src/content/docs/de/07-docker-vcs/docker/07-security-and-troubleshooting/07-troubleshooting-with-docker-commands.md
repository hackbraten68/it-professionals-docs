---
title: Troubleshooting mit Docker-Befehlen
---
# Troubleshooting mit Docker-Befehlen

Beim Arbeiten mit Docker können Probleme auftreten – Container starten nicht, Anwendungen stürzen ab oder es gibt Netzwerkfehler. Um diese Probleme effektiv zu beheben, stellt Docker eine Reihe von wichtigen Befehlen bereit. Diese helfen dabei, Container zu inspizieren, zu überwachen und direkt mit ihnen zu interagieren.

Dieses Handbuch erklärt die wichtigsten Befehle zum Troubleshooting, deren Nutzung und praktische Beispiele.

---

## 1. Laufende Container überprüfen mit `docker ps`

Der erste Schritt bei der Fehlersuche ist festzustellen, welche Container aktuell laufen.

```bash
docker ps
```

### Wichtige Optionen:

* `-a` – Zeigt alle Container, auch gestoppte.
* `--format` – Gibt die Möglichkeit, die Ausgabe individuell anzupassen (z. B. nur ID und Name).

### Anwendungsfälle:

* Überprüfen, ob der erwartete Container läuft.
* Feststellen, ob Container unerwartet gestoppt sind.
* Schnell Container-IDs für weitere Debugging-Schritte herausfinden.

---

## 2. Container-Logs anzeigen mit `docker logs`

Logs sind oft der schnellste Weg, Fehler eines Containers zu diagnostizieren.

```bash
docker logs <container-id-oder-name>
```

### Wichtige Optionen:

* `-f` – Logs in Echtzeit verfolgen.
* `--tail N` – Nur die letzten N Zeilen anzeigen.
* `-t` – Zeitstempel bei Logeinträgen anzeigen.

### Anwendungsfälle:

* Anwendungfehler im `stdout` oder `stderr` nachvollziehen.
* Startprobleme erkennen, wenn ein Container sofort beendet wird.
* Lang laufende Container überwachen und Anomalien erkennen.

---

## 3. Befehle in Containern ausführen mit `docker exec`

Manchmal ist es notwendig, direkt innerhalb eines Containers zu arbeiten.

```bash
docker exec -it <container-id-oder-name> <befehl>
```

### Beispiele:

* Eine Shell öffnen:

  ```bash
  docker exec -it myapp-container /bin/bash
  ```
  
* Konfigurationsdatei überprüfen:

  ```bash
  docker exec -it myapp-container cat /etc/config.conf
  ```

### Anwendungsfälle:

* Laufzeitumgebung, Variablen oder Dateisystem prüfen.
* Diagnose-Tools (z. B. `ping`, `curl`) direkt im Container nutzen.
* Prozesse manuell neu starten, ohne den Container zu stoppen.

---

## 4. Container-Details inspizieren mit `docker inspect`

Der Befehl `docker inspect` liefert detaillierte Informationen im JSON-Format.

```bash
docker inspect <container-id-oder-name>
```

### Wichtige Informationen:

* Netzwerkeinstellungen (IP-Adresse, Ports).
* Mounts und Volumes.
* Umgebungsvariablen.
* Neustart-Richtlinien und Laufzeitkonfiguration.

### Anwendungsfälle:

* Netzwerkdetails prüfen, wenn Verbindungen fehlschlagen.
* Überprüfen, ob Volumes korrekt eingebunden sind.
* Ressourcen-Zuteilungen (CPU, RAM) nachvollziehen.

---

## 5. Ereignisse in Echtzeit überwachen mit `docker events`

Zur Echtzeit-Überwachung von Docker-Aktivitäten eignet sich der Events-Stream.

```bash
docker events
```

### Wichtige Funktionen:

* Zeigt Ereignisse wie Container-Start/Stop, Netzwerk-Erstellung oder Image-Pulls.
* Unterstützt Filterung nach Container, Image oder Event-Typ.

```bash
docker events --filter 'container=myapp-container'
```

### Anwendungsfälle:

* Herausfinden, warum Container unerwartet neu starten.
* Netzwerk-Events während Debugging verfolgen.
* Systemweite Aktivitäten auf Anomalien prüfen.

---

## 6. Netzwerke analysieren mit `docker network ls` und `docker network inspect`

Netzwerkprobleme sind oft Ursache für Verbindungsfehler zwischen Containern oder mit externen Systemen.

### Netzwerke auflisten:

```bash
docker network ls
```

Zeigt alle Netzwerke, inklusive `bridge`, `host` und benutzerdefinierter Netzwerke.

### Netzwerke inspizieren:

```bash
docker network inspect <netzwerk-name>
```

Liefert Details über verbundene Container, Subnetze, Gateways und DNS-Einstellungen.

### Anwendungsfälle:

* Prüfen, ob Container mit dem richtigen Netzwerk verbunden sind.
* Sicherstellen, dass Service Discovery (DNS) funktioniert.
* Debuggen, wenn zwei Container nicht miteinander kommunizieren können.

---

# Fazit

Effektives Troubleshooting in Docker hängt stark vom richtigen Einsatz der Befehle ab.

* **`docker ps`** überprüft laufende Container.
* **`docker logs`** gibt Einblick in Anwendungsfehler.
* **`docker exec`** ermöglicht direkte Diagnose im Container.
* **`docker inspect`** liefert detaillierte Metadaten.
* **`docker events`** überwacht Echtzeit-Ereignisse.
* **`docker network ls/inspect`** unterstützt bei Netzwerk-Fehleranalysen.

Durch die Kombination dieser Befehle können Entwickler systematisch die meisten Container-Probleme identifizieren und lösen.
