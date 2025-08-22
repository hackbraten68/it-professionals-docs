---
title: Docker Objects
---
# Lektion: Docker-Objekte

## Lernziele
Am Ende dieser Lektion können die Lernenden:

1. **Kernobjekte** von Docker identifizieren und beschreiben: Images, Container, Volumes, Netzwerke, Secrets & Configs.  
2. **Docker-Images** erstellen und optimieren (inkl. Multi-Stage-Builds und Caching).  
3. **Container ausführen**, verwalten und inspizieren – mit Verständnis für Namespaces und Ressourcenbegrenzungen.  
4. **Daten persistent speichern und teilen** über Volumes, Bind Mounts und tmpfs.  
5. **Container-Netzwerke konfigurieren** (bridge, host, overlay, macvlan) und DNS-basierte Service-Discovery nutzen.  
6. **Secrets & Configs** sicher verwalten in Docker Swarm und Docker Compose.  

---

## 1. Was ist ein Docker-Objekt?

- In Docker wird **jede Ressource als Objekt** behandelt: Images, Container, Netzwerke, Volumes, Secrets, Configs.  
- Jedes Objekt hat einen **Lebenszyklus** und **Metadaten**, die man inspizieren, ändern und verwalten kann.  
- Dieses einheitliche Modell erleichtert die Administration über CLI oder API.  

---

## 2. Kernobjekttypen

### **Images**

- Schreibgeschützte, versionierte Vorlagen mit Dateisystem und Metadaten.  
- Werden aus Dockerfiles erstellt und sind schichtweise aufgebaut.  

### **Container**

- Eine laufende (oder gestoppte) Instanz eines Images.  
- Nutzt **Linux-Namespaces** (PID, Netzwerk, IPC, Mount) für Isolation.  
- Mit **cgroups** werden CPU- und Speicherkontingente gesteuert.  

### **Volumes**

- Von Docker verwalteter Speicher, unabhängig vom Lebenszyklus von Containern.  
- Ermöglicht persistente Datenhaltung.  

### **Netzwerke**

- Virtuelle Netzwerke für die Kommunikation zwischen Containern.  
- Unterstützen Isolation, Discovery und verschiedene Treiber.  

### **Secrets & Configs**

- Sicherer Umgang mit sensiblen oder allgemeinen Konfigurationsdaten.  
- Werden nur autorisierten Diensten zugänglich gemacht.  

---

## 3. Images: Struktur & Schichten

- Images bestehen aus **Schichten**: Jede Dockerfile-Anweisung (`RUN`, `COPY`, `ADD`) erzeugt eine neue.  
- Schichten werden gecacht und wiederverwendet, um Builds zu beschleunigen.  
- Schichten sind **inhaltadressiert** und unveränderlich.  

### Best Practices

- **Reihenfolge beachten**: Häufig geänderte Befehle (z. B. `COPY . .`) am Ende platzieren.  
- **Multi-Stage-Builds** reduzieren die Größe des finalen Images.  

Beispiel:

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Wichtige Befehle

```bash
docker build -t myapp:1.0 .
docker images
docker history myapp:1.0
docker inspect myapp:1.0
docker pull alpine:3.18
docker push myregistry.local/myapp:1.0
docker rmi myapp:1.0
```

---

## 4. Container

* Container sind **flüchtig**: Daten gehen beim Löschen verloren, sofern sie nicht ausgelagert werden.
* Jeder Container läuft in einer eigenen, isolierten Umgebung.

### Lebenszyklusbefehle

```bash
docker create --name test alpine:3.18
docker start test
docker run --name web -d -p 8080:80 nginx:latest
docker ps -a
docker logs web
docker exec -it web /bin/sh
docker stop web
docker rm web
docker stats web
```

### Erweiterte Optionen

* **Ressourcenlimits**: `--memory`, `--cpus`.
* **Entrypoint vs CMD**: Verhalten des Containers steuern.
* **Healthchecks**: Mit `HEALTHCHECK` Containerzustand prüfen.

---

## 5. Persistente Daten: Volumes & Mounts

Container sind kurzlebig – viele Anwendungen brauchen jedoch dauerhafte Speicherung.

### Mount-Typen

| Typ        | Verwaltet von   | Geltungsbereich           | Anwendungsfall                      |
| ---------- | --------------- | ------------------------- | ----------------------------------- |
| **Volume** | Docker          | Benannt, wiederverwendbar | Datenbanken, gemeinsame App-Daten   |
| **Bind**   | Host-OS         | Host-Verzeichnis          | Entwicklung (Live-Code-Bearbeitung) |
| **tmpfs**  | Arbeitsspeicher | Nicht persistent          | Caching, sensible In-Memory-Daten   |

Beispiele:

```bash
docker volume create app-data
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v app-data:/var/lib/postgresql/data \
  postgres:15

docker run -v $(pwd)/src:/usr/src/app -w /usr/src/app node:18 npm start
docker run --tmpfs /cache:rw,size=100m my-builder
```

### Volume-Befehle

```bash
docker volume ls
docker volume inspect app-data
docker volume prune
docker volume rm app-data
```

---

## 6. Netzwerke

### Netzwerk-Treiber

| Treiber     | Geltungsbereich | Anwendungsfall                     |
| ----------- | --------------- | ---------------------------------- |
| **bridge**  | Ein Host        | Standard, einfache Isolation       |
| **host**    | Ein Host        | Netz ohne Overhead                 |
| **overlay** | Multi-Host      | Swarm-/Kubernetes-Netzwerke        |
| **macvlan** | Ein Host        | Container direkt ins LAN einbinden |

Beispiele:

```bash
docker network create --driver bridge my-bridge
docker network inspect my-bridge
docker run -d --name backend --network my-bridge my-api
docker run -d --name frontend --network my-bridge nginx
docker network connect my-bridge some-container
```

### Service Discovery & DNS

* In benutzerdefinierten Netzwerken können sich Container über **Namen** erreichen.
* Overlay-Netzwerke ermöglichen dies über mehrere Hosts hinweg.

---

## 7. Secrets & Configs

### Warum keine ENV-Variablen?

* Umgebungsvariablen sind in `docker inspect` einsehbar.
* Secrets sind **verschlüsselt gespeichert** und nur autorisierten Containern zugänglich.

### Secrets verwalten

```bash
echo "SuperS3cretPwd" | docker secret create db_password -
docker secret ls
docker secret inspect db_password
docker secret rm db_password
```

### Verwendung in Docker Compose

```yaml
version: "3.7"
services:
  db:
    image: postgres:15
    secrets:
      - db_password
secrets:
  db_password:
    external: true
```

### Configs

* Für **nicht sensible Konfigurationsdateien** (z. B. NGINX-Konfigs).
* Werden zur Laufzeit in Container eingebunden.

---

## 8. Zusammenfassung

* **Images**: Unveränderliche Vorlagen.
* **Container**: Laufende Instanzen.
* **Volumes**: Persistente Speicherbereiche.
* **Netzwerke**: Kommunikation & Isolation.
* **Secrets & Configs**: Sichere Konfiguration.

---

## 9. Nächste Schritte

* **Docker Compose** für Multi-Container-Anwendungen.
* **Docker Swarm** und **Kubernetes** zur Orchestrierung.
* **Monitoring & Logging** mit Prometheus oder ELK.

---

## 10. Weiterführende Ressourcen

* [Docker CLI Referenz](https://docs.docker.com/engine/reference/commandline/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Docker Swarm](https://docs.docker.com/engine/swarm/)
