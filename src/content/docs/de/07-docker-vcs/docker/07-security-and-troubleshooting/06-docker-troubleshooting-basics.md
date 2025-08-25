---
title: Docker Troubleshooting Basics
---
# Docker Troubleshooting Basics

Docker vereinfacht die Anwendungsbereitstellung, doch wie bei jedem komplexen System können Probleme auftreten. Troubleshooting erfordert ein systematisches Vorgehen – Protokolle prüfen, Konfigurationen verifizieren und Probleme Schritt für Schritt eingrenzen. Dieser Leitfaden behandelt die häufigsten Fehlerszenarien und zeigt, wie man sie behebt.

---

## 1. Container startet nicht

Eines der häufigsten Probleme in Docker ist ein Container, der nicht startet. Ursachen können Konfigurationsfehler, Probleme mit Images oder Konflikte mit dem Hostsystem sein.

### Schritte zur Diagnose

* **Container-Logs prüfen**

  ```bash
  docker logs <container-name-oder-id>
  ```

  Logs zeigen oft fehlende Abhängigkeiten, falsch gesetzte Umgebungsvariablen oder Laufzeitfehler.

* **Image-Namen und Tag überprüfen**

  ```bash
  docker images
  docker run <image:tag>
  ```

  Sicherstellen, dass das richtige Image und die richtige Version verwendet werden. `latest` ist nicht immer das erwartete Build.

* **Auf Port-Konflikte prüfen**

  ```bash
  docker ps -a
  ```

  Wenn ein Host-Port bereits belegt ist, kann der Container nicht starten. Beispiel:

  ```bash
  Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
  ```

  Lösung: einen anderen Host-Port zuordnen oder den belegten Port freigeben.

---

## 2. Ressourcenprobleme

Container teilen sich CPU, Arbeitsspeicher und Speicherplatz des Hosts. Ohne Überwachung können Limits überschritten werden, was zu schlechter Performance oder Abstürzen führt.

### Schritte zur Diagnose

* **Ressourcennutzung prüfen**

  ```bash
  docker stats
  ```

  Zeigt in Echtzeit CPU-, Speicher-, Netzwerk- und I/O-Auslastung pro Container.

* **Ressourcenlimits setzen**
  Direkt beim Start:

  ```bash
  docker run --memory="512m" --cpus="1.5" <image>
  ```

  * `--memory`: Begrenzung des Arbeitsspeichers
  * `--cpus`: Begrenzung der verfügbaren CPU-Kerne

* **Systemressourcen überwachen**
  Mit Host-Tools wie:

  * `top` oder `htop` (Linux)
  * Task-Manager (Windows)
  * Aktivitätsanzeige (macOS)

---

## 3. Netzwerkprobleme

Oft können Container nicht miteinander oder mit dem Internet kommunizieren – Grund sind fehlerhafte Netzwerkeinstellungen, Firewalls oder DNS-Probleme.

### Schritte zur Diagnose

* **Netzwerkeinstellungen prüfen**

  ```bash
  docker inspect <container>
  ```

  Im Abschnitt `Networks` IP-Adressen und Netzwerke prüfen.

* **Konnektivität im Container testen**

  ```bash
  docker exec -it <container> bash
  ping <anderer-container>
  curl http://<service>:<port>
  telnet <host> <port>
  ```

  So lässt sich feststellen, ob DNS, Routing oder Firewalls die Verbindung blockieren.

* **Docker-Netzwerke prüfen**

  ```bash
  docker network ls
  docker network inspect <netzwerk-name>
  ```

  Sicherstellen, dass die Services im richtigen Netzwerk verbunden sind.

* **Firewall/Proxy berücksichtigen**
  Manche Hosts blockieren Container-Traffic über Firewalls oder Proxys. Regeln anpassen oder Netzwerke freigeben.

---

## 4. Probleme mit dem Docker Daemon

Manchmal liegt die Ursache nicht beim Container, sondern bei der Docker Engine selbst. Wenn Images nicht gezogen werden, Container nicht starten oder Befehle nicht reagieren, könnte der Daemon fehlerhaft sein.

### Schritte zur Diagnose

* **Daemon-Logs prüfen**

  ```bash
  journalctl -u docker
  ```

  Auf systemd-basierten Systemen finden sich hier detaillierte Log-Einträge.

* **Docker-Dienst neu starten**

  ```bash
  sudo systemctl restart docker
  ```

  Unter Windows/macOS (Docker Desktop) über die GUI neu starten.

* **Daemon-Konfiguration prüfen**
  Datei `/etc/docker/daemon.json` auf falsche Syntax oder ungültige Optionen prüfen:

  ```bash
  cat /etc/docker/daemon.json
  ```

* **Docker-Version verifizieren**

  ```bash
  docker version
  ```

  Veraltete Versionen können Fehler verursachen – ein Update behebt oft Probleme.

---

## 5. Allgemeine Troubleshooting-Tipps

* **Docker Events überwachen**

  ```bash
  docker events
  ```

  Zeigt in Echtzeit, was Docker intern macht, inkl. Fehler.

* **System-Logs prüfen**
  In `/var/log/syslog` oder `/var/log/messages` nach Host-Fehlern suchen, die Docker betreffen.

* **Konfigurationsdateien validieren**

  * JSON-Validator für `daemon.json`
  * YAML-Linter für `docker-compose.yml`

* **Images aktualisieren**

  ```bash
  docker pull <image:tag>
  docker-compose build --no-cache
  ```

* **Debug-Modus aktivieren**

  ```bash
  dockerd --debug
  ```

  Gibt ausführliche Logs zur detaillierten Analyse.

---

## Zusammenfassung

Troubleshooting in Docker folgt einem klaren Ablauf:

1. **Container startet nicht** → Logs, Image-Tag, Port-Konflikte prüfen.
2. **Ressourcenprobleme** → Mit `docker stats` überwachen, Limits setzen.
3. **Netzwerkprobleme** → Netzwerke inspizieren, Konnektivität testen.
4. **Daemon-Probleme** → Logs prüfen, Dienst neustarten, Konfigs validieren.
5. **Allgemeine Praktiken** → Events überwachen, Images aktualisieren, Debug nutzen.

Mit diesem strukturierten Vorgehen lassen sich Fehlerquellen schnell eingrenzen und Containerumgebungen stabil betreiben.
