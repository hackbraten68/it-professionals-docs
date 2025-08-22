---
title: Docker Terminologie
---
# Docker-Terminologie

Um Docker zu verstehen, ist es wichtig, die grundlegenden Begriffe zu kennen. Diese Konzepte bilden die Basis für das Arbeiten mit Containern, das Erstellen von Anwendungen und deren Deployment. Im Folgenden werden die wichtigsten Begriffe detailliert erklärt.

---

## 1. Docker Images

- **Definition:**  
  Ein Docker Image ist ein **schreibgeschütztes Template**, das alle Anweisungen enthält, um einen Container zu erstellen. Es umfasst alles, was für den Betrieb einer Anwendung benötigt wird: Quellcode, Laufzeitumgebung, Bibliotheken, Umgebungsvariablen und Konfigurationen.

- **Wichtige Punkte:**
  - Images bestehen aus **Schichten (Layers)**. Jede Anweisung im `Dockerfile` erzeugt eine neue Schicht.
  - Images sind **unveränderlich** – sie können nicht direkt geändert, sondern nur durch neue Versionen ersetzt werden.
  - Images werden mit Namen und Versionen (Tags) versehen, z. B. `nginx:latest` oder `meinapp:1.0`.

- **Beispiel:**  
  `docker pull ubuntu:20.04` lädt das Ubuntu-20.04-Image von Docker Hub.

---

## 2. Docker Container

- **Definition:**  
  Ein Container ist eine **laufende Instanz** eines Docker Images. Er stellt eine leichtgewichtige, isolierte Umgebung für Anwendungen dar.

- **Wichtige Punkte:**
  - Container können gestartet, gestoppt, verschoben und gelöscht werden.
  - Sie teilen sich den Kernel des Host-Betriebssystems, bleiben aber durch **Namespaces** und **cgroups** isoliert.
  - Container sind standardmäßig **flüchtig** – Daten gehen verloren, wenn sie nicht persistent gespeichert werden.

- **Beispiel:**  
  `docker run -it ubuntu:20.04 bash` erstellt und startet einen neuen Ubuntu-Container.

---

## 3. Docker Engine

- **Definition:**  
  Die Docker Engine ist die **Client-Server-Anwendung**, die Docker antreibt. Sie ist das Kernstück, das Container erstellt, ausführt und verwaltet.

- **Komponenten:**
  - **Docker Daemon (`dockerd`):** Verwaltet Container, Images, Netzwerke und Volumes.
  - **Docker API:** Eine REST-API, über die Tools mit dem Daemon kommunizieren.
  - **Docker CLI (`docker`):** Das Kommandozeilen-Tool, um mit Docker zu arbeiten.

---

## 4. Dockerfile

- **Definition:**  
  Ein `Dockerfile` ist eine **Textdatei**, die alle Schritte beschreibt, um ein Docker Image zu erstellen.

- **Häufige Anweisungen:**
  - `FROM` – Basis-Image.
  - `RUN` – Befehle im Image ausführen.
  - `COPY` / `ADD` – Dateien ins Image kopieren.
  - `CMD` / `ENTRYPOINT` – Standardbefehl beim Start des Containers.

- **Beispiel:**

  ```dockerfile
  FROM node:18
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  CMD ["node", "server.js"]
  ```

---

## 5. Docker Registry

* **Definition:**
  Eine Docker Registry ist ein **Speicher- und Verteilungssystem** für Docker Images.

* **Arten:**

  * **Öffentliche Registrys:** z. B. Docker Hub.
  * **Private Registrys:** für Unternehmen, mit mehr Kontrolle und Sicherheit.

* **Wichtige Punkte:**

  * Eine Registry enthält **Repositories**, die wiederum verschiedene Versionen eines Images speichern.
  * Mit `docker push` und `docker pull` werden Images übertragen.

---

## 6. Docker Volume

* **Definition:**
  Ein Docker Volume ist ein **Persistenzmechanismus** zum Speichern von Daten, die von Containern genutzt oder erzeugt werden.

* **Wichtige Punkte:**

  * Volumes liegen außerhalb des Container-Dateisystems.
  * Daten bleiben auch nach Container-Neustart oder -Löschung bestehen.
  * Mehrere Container können auf dasselbe Volume zugreifen.

* **Beispiel:**

  ```bash
  docker volume create meineDaten
  docker run -v meineDaten:/app/data meinimage
  ```

---

## 7. Docker Network

* **Definition:**
  Docker Netzwerke ermöglichen die Kommunikation zwischen Containern und zwischen Containern und der Außenwelt.

* **Netzwerk-Typen:**

  * **Bridge (Standard):** Container-Kommunikation auf demselben Host.
  * **Host:** Container nutzen direkt das Host-Netzwerk.
  * **Overlay:** Kommunikation über mehrere Hosts hinweg (z. B. in Swarm).
  * **Macvlan:** Container erhalten eine eigene MAC-Adresse im LAN.

* **Beispiel:**

  ```bash
  docker network create meinNetz
  docker run -d --network=meinNetz meinContainer
  ```

---

## 8. Docker Compose

* **Definition:**
  Docker Compose ist ein Tool, mit dem man **Multi-Container-Anwendungen** über eine YAML-Datei (`docker-compose.yml`) definieren und starten kann.

* **Wichtige Punkte:**

  * Mehrere Services (z. B. Webserver + Datenbank) lassen sich in einer Datei beschreiben.
  * Starten der gesamten Umgebung mit `docker-compose up`.
  * Unterstützt Netzwerke, Volumes und Skalierung.

* **Beispiel (`docker-compose.yml`):**

  ```yaml
  version: "3.9"
  services:
    web:
      image: nginx
      ports:
        - "80:80"
    db:
      image: postgres
      volumes:
        - dbdata:/var/lib/postgresql/data
  volumes:
    dbdata:
  ```

---

## 9. Docker Swarm

* **Definition:**
  Docker Swarm ist das **Clustering- und Orchestrierungs-Tool** von Docker. Es ermöglicht, Container über mehrere Hosts verteilt zu betreiben.

* **Wichtige Punkte:**

  * Unterstützt Hochverfügbarkeit mit Manager- und Workerknoten.
  * Automatisches Load-Balancing und Service Discovery.
  * Rolling Updates und einfache Skalierung.
  * Weniger komplex als Kubernetes, aber auch eingeschränkter.

* **Beispiel:**

  ```bash
  docker swarm init
  docker service create --replicas 3 nginx
  ```

---

# Zusammenfassung

* **Images**: Vorlagen für Container.
* **Container**: Laufende Instanzen von Images.
* **Engine**: Zentrale Laufzeitumgebung für Docker.
* **Dockerfile**: Bauanleitung für Images.
* **Registry**: Speicher für Images.
* **Volume**: Persistente Datenspeicherung.
* **Netzwerk**: Kommunikation zwischen Containern.
* **Compose**: Verwaltung von Multi-Container-Anwendungen.
* **Swarm**: Clustering und Orchestrierung über mehrere Hosts.

Diese Begriffe bilden das Fundament für die Arbeit mit Docker und helfen dabei, Anwendungen effizient zu entwickeln, zu verteilen und auszuführen.
