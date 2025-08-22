---
title: Einführung in die Docker-Architektur
---
## Lernziele

- Verstehen, **warum Docker ein eigenes, geschichtetes Client-Server-Design verwendet**.  
- Nachvollziehen, **wie der Docker Daemon den Lebenszyklus, Speicher, Netzwerke und Sicherheit verwaltet**.  
- Erkennen, **wie CLI/API mit dem Daemon interagieren und welche Erweiterungen existieren**.  
- Wissen anwenden, um **sichere, performante und wartbare Docker-Setups** zu gestalten.  

---

## 1. Was ist Docker?

![Docker Architektur](../../../../../../assets/docker/1_GoZ56yZNpG_VnGGvqhYlCQ.webp)

Docker ist eine **Plattform zum Verpacken von Anwendungen und deren Abhängigkeiten** in leichtgewichtige, portable Einheiten, sogenannte **Container**. Diese Container laufen konsistent über verschiedene Umgebungen hinweg – egal ob auf einem Entwickler-Laptop, einem Testserver oder in der Produktion.

Wesentliche Eigenschaften von Docker-Containern:

- **Leichtgewichtig**: Container teilen sich den Kernel des Host-Betriebssystems und vermeiden so die hohen Ressourcen-Kosten vollständiger virtueller Maschinen.  
- **Portabel**: Ein Container bündelt alles, was die Anwendung benötigt – Bibliotheken, Laufzeitumgebungen, Tools und Code.  
- **Konsistent**: Durch Container-Images können Entwickler und Betriebsteams das bekannte Problem „läuft nur auf meinem Rechner“ vermeiden.  

---

## 2. Zentrale Komponenten im Überblick

- **Docker Client (CLI oder API)** – Benutzerschnittstelle zum Senden von Befehlen.  
- **Docker Daemon (`dockerd`)** – verwaltet Container, Images, Netzwerke und Volumes.  
- **Images & Registries** – Vorlagen für Container, gespeichert in Docker Hub oder privaten Registries.  
- **Container** – ausführbare Instanzen von Images.  
- **Netzwerke & Volumes** – ermöglichen Kommunikation und persistente Speicherung.  

---

## 3. Warum eine eigene Architektur?

### 3.1 Isolation & Sicherheit

Namespaces und cgroups erzwingen Ressourcentrennung und Prozess-Isolation.  

### 3.2 Portabilität

Geschichtete Images kapseln alles und stellen Konsistenz über verschiedene Umgebungen sicher.  

### 3.3 Effizienz

Das Shared-Kernel-Modell reduziert Overhead, ermöglicht schnelleren Start und bessere Dichte als VMs.  

---

## 4. Das Client-Server-Modell von Docker

- **Docker Client**: sendet Befehle über die REST API.  
- **Docker Daemon**: führt Anfragen aus, verwaltet Container und Images.  
- **REST API**: standardisierte Kommunikationsschicht.  
- **Registries**: speichern und verteilen Images.  

### 4.1 Client–Server-Paradigma

- Der Client gibt Befehle ein (`docker run`, `docker build`).  
- Der Daemon hört auf API-Anfragen und orchestriert die Ressourcen.  

### 4.2 Kommunikationskanäle

- **Unix Socket**: `/var/run/docker.sock` (lokal).  
- **TCP Socket**: `tcp://hostname:2376` (remote, mit TLS abgesichert).  

### 4.3 REST API Endpunkte

- `POST /containers/create` → Container erstellen  
- `GET /containers/json` → Container auflisten  
- `POST /images/create` → Image herunterladen  

### 4.4 Anwendungsfälle

- Lokale Entwicklung (Client & Daemon auf demselben Host).  
- Remote-Verwaltung (Laptop-Client ↔ Server-Daemon).  
- Orchestrierung (Swarm, Kubernetes).  

---

## 5. Die Rolle des Docker Daemon

### 5.1 Zentrale Aufgaben

- **Container-Lebenszyklus**: erstellen, starten, stoppen, entfernen.  
- **Image-Verwaltung**: bauen, herunterladen, hochladen, taggen, bereinigen.  
- **Netzwerktreiber**: bridge, overlay, host, macvlan.  
- **Speichertreiber**: overlay2 (Standard), aufs, devicemapper, btrfs.  

### 5.2 Konfiguration & Start

- Gesteuert über **systemd-Unit** oder manuelles Starten.  
- Beispiel: `dockerd --config-file /etc/docker/daemon.json`  
- Siehe **Beispielkonfiguration in Anhang A**.  

### 5.3 Sicherheitsmodi

- **Rootful vs. Rootless Daemon**: rootless erhöht die Sicherheit.  
- **TLS-Authentifizierung**: stellt sicher, dass nur autorisierte Clients zugreifen.  

### 5.4 Monitoring & Logs

- **Ereignis-Stream**: `docker events` für Echtzeitüberwachung.  
- **Metriken**: via cgroups oder Tools wie Prometheus/Grafana.  

---

## 6. CLI/API-Interaktion und Erweiterungen

### 6.1 Häufige Befehle & Flags

```bash
docker run --rm -d -p 80:80 nginx:latest
docker build -t myapp:1.0 .
docker push myregistry.com/myapp:1.0
docker volume create data-vol
````

### 6.2 Funktionsweise unter der Haube

1. Nutzer tippt `docker <command>`.
2. CLI parst Flags und erstellt eine HTTP-Anfrage.
3. Anfrage wird an die API des Daemons gesendet.
4. Daemon führt aus und streamt JSON-kodierte Events zurück.

### 6.3 Client-Erweiterungen & Plugins

* **Buildx**: Multi-Architektur-Builds.
* **Compose-Plugin**: `docker compose up`.
* **Drittanbieter-Tools**: Portainer, Rancher, eigene UIs.

### 6.4 Umgebungsvariablen

* `DOCKER_HOST`: Host/Socket ändern.
* `DOCKER_TLS_VERIFY=1` & `DOCKER_CERT_PATH`: sichere Remote-Verbindungen.

---

## 7. Sichere, performante und wartbare Setups entwerfen

### 7.1 Sicherer Zugriff

* Socket-Berechtigungen einschränken:

  ```bash
  chmod 660 /var/run/docker.sock
  ```

* TLS Mutual Authentication für Remote APIs.

### 7.2 Ressourcenbegrenzungen

* Flags wie:

  * `--memory`
  * `--cpus`
  * `--cpuset-cpus`
  * `--pids-limit`
* Verhindert „Noisy Neighbor“-Effekte.

### 7.3 Netzwerkstrategien

* **Bridge**: einfache Single-Host-Szenarien.
* **Overlay**: Multi-Host-Cluster.
* **IPv6**: über Custom-Driver.

### 7.4 Speicher & Performance

* **overlay2** bevorzugt wegen Stabilität.
* **Named Volumes** oder **Bind Mounts** für persistente Daten.

### 7.5 Skalierung & Orchestrierung

* **Einzel-Host**: `docker-compose`.
* **Multi-Host**: Swarm oder Kubernetes, mehrere Daemons orchestriert.

---

## 8. Zusammenfassung

Die **geschichtete Client-Server-Architektur von Docker** verbindet:

* **Isolation & Sicherheit** (Namespaces, cgroups, TLS, Rootless).
* **Portabilität** (Images, Registries).
* **Effizienz** (Shared Kernel, Ressourcenoptimierung).
* **Daemon-Verantwortung** (Lifecycle, Storage, Networking, Monitoring).
* **CLI/API-Workflow** (REST-basiert).
* **Best Practices** (Security, Performance, Skalierung).

---

## 9. Wichtige Erkenntnisse für Lernende

* Docker löst das „läuft nur auf meinem Rechner“-Problem.
* Der **Daemon ist das Herzstück**, das Container, Images, Netzwerke und Speicher verwaltet.
* Der **CLI/API → Daemon → Registry/Container Workflow** ermöglicht Automatisierung und Erweiterbarkeit.
* Sicherheit (TLS, Rootless, Socket-Rechte) ist in Produktion entscheidend.
* Ressourcenbegrenzung, sauberes Networking und Orchestrierung machen Setups stabil und skalierbar.

---

## Anhang A: Beispiel `daemon.json`

```json
{
    "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
    "storage-driver": "overlay2",
    "tls": true,
    "tlsverify": true,
    "tlscacert": "/etc/docker/ca.pem",
    "tlscert": "/etc/docker/server-cert.pem",
    "tlskey": "/etc/docker/server-key.pem"
}
```
