---
title: Docker Layers
---
# Docker Layers (Docker-Schichten)

## Lernziele

Am Ende dieser Lerneinheit sollen die Teilnehmenden in der Lage sein:

- **Das Konzept von Schichten in Docker-Images zu erklären**  
- **Zu beschreiben, wie Schichten während des Build-Prozesses entstehen**  
- **Zu verstehen, wie Docker Build-Cache und Wiederverwendung von Schichten nutzt**  
- **Best Practices zur Optimierung von Schichten in Dockerfiles anzuwenden**  
- **Schichten in Docker-Images zu inspizieren und zu analysieren**  
- **Einen praktischen Ablauf zum Erstellen und Untersuchen von Images nachzuvollziehen**  

---

## 1. Einführung in Schichten

- Ein **Docker-Image** besteht aus einem Stapel von **Read-Only-Schichten**.  
- Jede Schicht repräsentiert Änderungen am Dateisystem (hinzugefügte, veränderte oder gelöschte Dateien).  
- Beim Erstellen eines Images mit einem `Dockerfile` erzeugt jede Anweisung (`FROM`, `RUN`, `COPY`, `ADD`) eine neue Schicht.  
- Ein Container wird durch Hinzufügen einer finalen **Read-Write-Schicht** auf Basis dieser unveränderlichen Schichten erzeugt.  
- Vorteile dieses Designs:
  - **Wiederverwendbarkeit**: Schichten können in mehreren Images genutzt werden.  
  - **Effizienz**: Nur geänderte Schichten müssen neu erstellt werden.  
  - **Portabilität**: Schichten können einzeln in Registries gespeichert und übertragen werden.  

---

## 2. Wie Schichten entstehen

- Jede **Dockerfile-Anweisung** erzeugt eine neue Schicht. Beispiele:
  - `FROM ubuntu:20.04` → Basis-Image-Schicht  
  - `RUN apt-get update && apt-get install -y curl` → Installation von Software  
  - `COPY . /app` → Kopieren von Dateien ins Image  
- Der Build-Prozess ist **schichtbasiert**, d. h.:
  - Ändert sich ein Schritt, werden alle nachfolgenden Schichten neu gebaut.  
  - Unveränderte Schichten werden aus dem Cache übernommen.  
- Schichten werden durch **SHA256-Digests** eindeutig identifiziert.  

---

## 3. Build Cache & Wiederverwendung von Schichten

- Docker **speichert Zwischenschichten im Cache**, um Builds zu beschleunigen.  
- Beim Erstellen eines Images:
  - Docker prüft, ob eine identische Schicht (gleiche Anweisung, gleicher Kontext) bereits existiert.  
  - Falls ja → wird sie wiederverwendet.  
  - Falls nein → wird eine neue Schicht gebaut.  
- Beispiel:  
  - Wenn nur eine Quelldatei geändert wird, werden nur die `COPY`-Schicht und die darauffolgenden Schichten neu erstellt.  
- Vorteile:
  - **Schnellere Builds**  
  - **Reduzierter Speicherverbrauch** (jede Schicht wird nur einmal gespeichert, auch wenn sie in mehreren Images vorkommt)  
  - **Schnelleres Deployment** (Registries übertragen nur fehlende Schichten)  

---

## 4. Best Practices zur Optimierung von Schichten

- **Anzahl der Schichten minimieren**:  
  - Mehrere Befehle mit `&&` in einem einzigen `RUN` kombinieren.  
- **Anweisungen strategisch anordnen**:  
  - Weniger häufig veränderte Schritte (z. B. Paketinstallation) nach oben setzen.  
  - Häufig veränderte Schritte (z. B. Kopieren von Code) nach unten.  
- **Unnötige Dateien entfernen**:  
  - Nach der Installation aufräumen (`apt-get clean && rm -rf /var/lib/apt/lists/*`).  
- **Kleinere Basis-Images nutzen**:  
  - z. B. Alpine Linux statt Ubuntu.  
- **Multi-Stage-Builds einsetzen**:  
  - Build-Tools in einer Stage, schlankes Runtime-Image in einer anderen Stage.  

---

## 5. Schichten inspizieren

- Werkzeuge und Befehle zur Analyse:
  - `docker history <image>` → zeigt Schichten, Größen und Befehle.  
  - `docker inspect <image>` → detaillierte JSON-Ausgabe inkl. Layer-Digests.  
  - Drittanbieter-Tools:
    - **Dive**: Visualisierung von Schichten und Optimierungspotenzial.  
    - `ctr images info <image>` (bei containerd).  
- Nützlich um:
  - Große oder redundante Schichten zu erkennen.  
  - Verbesserungen bei der Image-Struktur zu finden.  

---

## 6. Beispielhafter Ablauf

**Schritt 1: Einfaches Dockerfile**

```dockerfile
FROM alpine:3.18
RUN apk add --no-cache curl
COPY app.sh /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh
CMD ["app.sh"]
```

**Schritt 2: Image bauen**

```bash
docker build -t myapp:1.0 .
```

**Schritt 3: Schichten inspizieren**

```bash
docker history myapp:1.0
```

*Beispielausgabe:*

```bash
IMAGE          CREATED BY                      SIZE
<sha>          /bin/sh -c chmod +x /usr...     0B
<sha>          /bin/sh -c #(nop) COPY...       1.2kB
<sha>          /bin/sh -c apk add --no-cache   5.4MB
<sha>          /bin/sh -c #(nop)  CMD...       0B
<sha>          alpine:3.18                     5.6MB
```

**Schritt 4: `app.sh` ändern und neu bauen**

* Nur die `COPY`- und `chmod`-Schichten (und darüberliegende) werden neu erstellt.
* Vorherige Schichten (Alpine-Basis, curl-Installation) werden aus dem Cache genutzt.

---

## 7. Weiterführende Ressourcen

* **Offizielle Dokumentation**: [Docker Image Layers](https://docs.docker.com/storage/storagedriver/#images-and-layers)
* **Best Practices**: [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
* **Tools**:

  * [Dive](https://github.com/wagoodman/dive) – Layer-Analyse und Optimierung
  * [Snyk](https://snyk.io/) – Sicherheitsscans für Images
* **Tutorials**:

  * Docker „Get Started“-Guide
  * Community-Blogs zu Docker-Optimierungen
