---
title: Zusammenfassung & Referenzen
---

## Zentrale Erkenntnisse

1. **Container**
   - Container sind leichtgewichtige, portable Laufzeiteinheiten für Anwendungen.
   - Sie sind **von Natur aus flüchtig**, das heißt, sie können schnell erstellt, gestoppt und entfernt werden, ohne das zugrunde liegende System zu beeinflussen.
   - Container können **inspiziert** werden (Logs, Umgebungsvariablen, Prozesse), was die Fehlersuche erleichtert.
   - Wichtige Befehle:  
     - `docker ps` (laufende Container anzeigen)  
     - `docker logs <container>` (Logs anzeigen)  
     - `docker exec -it <container> /bin/bash` (Container-Shell betreten)  

2. **Images**
   - Images sind **unveränderliche und versionierte Artefakte**, die als Baupläne für Container dienen.
   - Sie können aus Registries **gezogen**, lokal über Dockerfiles **gebaut**, **getaggt** und **gepusht** werden.
   - Sie bestehen aus **Layern**, was Wiederverwendung und effizientes Caching ermöglicht.
   - Wichtige Befehle:  
     - `docker build -t my-app:1.0 .`  
     - `docker pull nginx:latest`  
     - `docker push myrepo/my-app:1.0`  

3. **Netzwerke & Volumes**
   - **Netzwerke** verbinden Container untereinander und mit externen Systemen.  
     - Standardtypen: `bridge`, `host`, `none`.  
     - Benutzerdefinierte Netzwerke bieten bessere Isolation und DNS-basierte Namensauflösung.  
   - **Volumes** speichern Daten dauerhaft, auch über Container-Neustarts hinaus.  
     - *Named Volumes* werden von Docker verwaltet, *Bind Mounts* verknüpfen Host-Verzeichnisse.  
   - Wichtige Befehle:  
     - `docker network create my-net`  
     - `docker run -d --network my-net my-service`  
     - `docker volume create data-vol`  

4. **Erweiterte Flags**
   - **Ressourcenlimits** erlauben die Begrenzung von CPU, RAM oder Dateideskriptoren.  
     - Beispiel: `docker run -m 512m --cpus="1.5" my-app`  
   - **Logging Treiber** ermöglichen flexible Log-Verarbeitung (`json-file`, `syslog`, `fluentd`, usw.).  
   - **Filter und Formatierung** verbessern die Lesbarkeit von Befehlsausgaben.  
     - Beispiel: `docker ps --filter "status=exited" --format "{{.Names}}"`  
   - **Kontexte** erleichtern den Umgang mit mehreren Docker-Umgebungen (lokal, remote, Cloud).  
     - Beispiel: `docker context use remote-prod`  

5. **Best Practices**
   - Images **klein und sicher** halten, z. B. durch minimale Basis-Images (`alpine`, `slim`).  
   - **Multi-Stage Builds** nutzen, um Build-Dependencies vom Laufzeit-Image zu trennen.  
   - **Layer-Caching optimieren**, indem Dockerfile-Anweisungen von stabil zu volatil sortiert werden.  
   - **Regelmäßige Bereinigung** einplanen (`docker system prune`), um ungenutzte Ressourcen freizugeben.  
   - **Volumes verwenden** für persistente Daten, statt ins Container-Dateisystem zu schreiben.  

---

## Weiterführende Literatur & Referenzen

- [Offizielle Docker CLI Referenz](https://docs.docker.com/engine/reference/commandline/cli/)  
  *Umfassende Dokumentation aller CLI-Befehle, Flags und Optionen.*

- [Docker Cheat Sheet](https://dockerlabs.collabnix.com/docker/cheatsheet/)  
  *Kompakte Übersicht der wichtigsten Befehle und Workflows.*

- [Best Practices für Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)  
  *Richtlinien für effiziente, sichere und optimierte Dockerfiles.*

- [Docker Networking Guide](https://docs.docker.com/network/)  
  *Detaillierte Erklärung der Netzwerkkonzepte, Typen und Anwendungsfälle.*

- [Docker Storage Overview](https://docs.docker.com/storage/)  
  *Einführung in Volumes, Bind Mounts und Storage-Treiber.*

- [Docker Security Best Practices](https://docs.docker.com/engine/security/security/)  
  *Grundprinzipien und Maßnahmen für sichere Docker-Umgebungen.*

---

✅ **Fazit:**  
Das Beherrschen der Docker CLI ist entscheidend für das effiziente Bauen, Starten und Verwalten von Containern. Mit einem klaren Verständnis von Images, Containern, Netzwerken und Volumes sowie dem Einsatz erweiterter Flags und Best Practices können Entwickler sichere, optimierte und produktionsreife containerisierte Anwendungen erstellen.
