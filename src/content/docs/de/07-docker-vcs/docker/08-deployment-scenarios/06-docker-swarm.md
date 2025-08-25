---
title: Docker Swarm
---
# Docker Swarm — Ein Praktischer, Umfassender Leitfaden

> **Ziel:** Eine klar strukturierte, didaktisch aufbereitete Übersicht zu Docker Swarm, mit genügend Tiefe, um es zu lehren, zu demonstrieren und sicher zu betreiben.

---

## 1) Was ist Docker Swarm?

**Docker Swarm** ist der native Orchestrator von Docker, der einen Verbund von Maschinen (VMs oder physische Rechner) zu einem **einzigen, sicheren Cluster** zusammenfasst, um Container darauf auszuführen.  
Es bietet **Service Discovery, Load Balancing, Skalierung, Rolling Updates** und **Fehlertoleranz** – bei gleichzeitig geringer Einstiegshürde im Vergleich zu komplexeren Orchestratoren.

**Warum es attraktiv ist**
- **In Docker integriert** (kein separates Control Plane erforderlich).
- **Einfache Konzepte** (Services → Tasks → Container).
- **Standardmäßig sicher** (mutual TLS, Zertifikatsrotation).
- **Gut geeignet für kleine bis mittlere Produktionsumgebungen**, Edge-Cluster, Labore und Lehre.

---

## 2) Architektur & Grundkonzepte

### Nodes
- **Manager Nodes**: Halten die **Raft-basierte Control Plane** (Desired State, Scheduling, Cluster-Mitgliedschaft).  
  → Brauchen **Quorum** (n/2 + 1) für Verfügbarkeit.
- **Worker Nodes**: Führen Workloads (Tasks/Container) aus. Können befördert oder zurückgestuft werden.

> **Tipp:** Kleine Cluster sollten **3 Manager** (oder 5) nutzen, um Quorum bei Ausfällen zu wahren.

### Services, Tasks, Container
- **Service**: Beschreibt den gewünschten Zustand (Image, Replikate, Netzwerke, Secrets, Constraints).
- **Task**: Eine einzelne laufende Einheit eines Services auf einem Node (1 Task = 1 Container).
- **Replicated Services**: `--replicas N` startet N Tasks verteilt im Cluster.
- **Global Services**: `--mode global` startet genau einen Task pro Node (praktisch für Agenten oder Monitoring).

### Networking
- **Overlay-Netzwerke**: Ermöglichen Kommunikation über mehrere Hosts.
- **Service Discovery**: Interne **DNS-Auflösung**; jede Service bekommt eine stabile **VIP**.
- **Load Balancing**:
  - **VIP-Modus (Standard):** Interner LB verteilt Traffic auf Tasks.
  - **DNSRR:** DNS-Round-Robin-Einträge ohne VIP.
- **Routing Mesh**: Jeder Node kann Anfragen zu veröffentlichten Ports annehmen und zu Tasks weiterleiten.

### Sicherheit
- **Mutual TLS** zwischen Nodes (automatisch verwaltet).
- **Zertifikatsrotation** eingebaut.
- **Raft-Logs verschlüsselt** auf Managern.
- Optionale **verschlüsselte Overlay-Netzwerke**.

### State & Scheduling
- **Deklarativer Desired State**: Man beschreibt *was*, Swarm entscheidet *wie*.
- **Constraints & Placement**: Labels und Filter steuern Task-Platzierung.
- **Health & Restart Policies**: Swarm ersetzt automatisch fehlerhafte Tasks.

---

## 3) Quick Start (Minimaler Cluster)

```bash
# Auf dem ersten Node:
docker swarm init --advertise-addr <MANAGER_IP>

# Join-Befehl für Worker:
docker swarm join --token <TOKEN> <MANAGER_IP>:2377

# Clusterstatus prüfen:
docker node ls
````

Service starten und skalieren:

```bash
docker service create \
  --name web \
  --replicas 3 \
  --publish mode=ingress,target=80,published=8080 \
  nginx:alpine

docker service ls
docker service ps web
docker service scale web=5
```

---

## 4) Stacks mit Compose-Dateien

Swarm unterstützt **Compose v3+**:

```yaml
version: "3.9"
services:
  web:
    image: nginx:alpine
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
    ports:
      - target: 80
        published: 8080
        mode: ingress
    networks: [frontend]
    configs: [nginx_conf]
networks:
  frontend:
    driver: overlay
configs:
  nginx_conf:
    file: ./nginx.conf
```

Deployment:

```bash
docker stack deploy -c docker-compose.yml mystack
docker stack ls
docker stack services mystack
docker stack rm mystack
```

---

## 5) Rolling Updates & Rollbacks

```bash
docker service update \
  --image nginx:1.27-alpine \
  --update-parallelism 1 \
  --update-delay 10s \
  --update-order start-first \
  --update-failure-action rollback \
  web

docker service rollback web
```

---

## 6) Secrets & Configs

```bash
echo -n "super-secret-token" | docker secret create api_key -
docker service create --name api --secret api_key myimage
```

Configs ähnlich, z. B. `nginx.conf`.

---

## 7) Persistente Daten

* **Lokale Volumes** binden Service an Node.
* **Constraints** nutzen oder verteilte Storage-Treiber (NFS, Portworx etc.).
* Für Datenbanken → Node labeln & Services fixieren.

---

## 8) Placement & Constraints

```bash
docker node update --label-add zone=blue node-1
docker service create \
  --name worker \
  --constraint 'node.labels.zone == blue' \
  busybox sleep 1d
```

---

## 9) Resilienz

* **Restart Policies**
* **Healthchecks**
* **Automatische Reschedulings**

---

## 10) Logs & Monitoring

* `docker service logs -f <svc>`
* **Global Services** für Logging-Agents (z. B. Fluent Bit, Prometheus-Exporter)

---

## 11) Wichtige Befehle

Cluster:

```bash
docker swarm init
docker swarm join-token worker
docker node ls
```

Services:

```bash
docker service create --name web --replicas 3 -p 8080:80 nginx
docker service scale web=6
docker service rollback web
```

Stacks:

```bash
docker stack deploy -c docker-compose.yml mystack
docker stack rm mystack
```

---

## 12) Sicherheitsempfehlungen

* Join Tokens regelmäßig rotieren.
* Manager-API absichern.
* Verschlüsselte Overlays für sensible Kommunikation.
* Container mit Nicht-Root-Benutzern betreiben.

---

## 13) Wann Swarm nutzen?

**Geeignet wenn:**

* Einfachere Orchestrierung gewünscht.
* Cluster ist klein bis mittelgroß.
* Fokus auf Lehre, schnelle Deployments.

**Nicht geeignet wenn:**

* Höchste Flexibilität, HPA/VPA, Service Mesh oder Multi-Tenancy nötig → **Kubernetes**.

---

## 14) Troubleshooting

* **Service hängt:** `docker service ps <svc>` prüfen.
* **Keine Requests:** Ports & Publish-Mode checken.
* **Tasks Pending:** Ressourcen, Constraints, Image-Pulls prüfen.
* **Quorum verloren:** Manager befördern oder neuen Cluster erzwingen (Risiko!).

---

## 15) Beispiel: Zero-Downtime Update

```bash
docker service create --name web --replicas 3 -p 8080:80 nginx:1.25
docker service update \
  --image nginx:1.27-alpine \
  --update-order start-first \
  --update-parallelism 1 \
  --update-delay 5s \
  --update-failure-action rollback \
  web
```

---

## 16) Lehrideen

* **Lab 1:** 3-Node-Swarm + Scaling testen.
* **Lab 2:** Datenbank + Node-Constraints.
* **Lab 3:** Rolling Update mit Rollback.
* **Lab 4:** Secrets & Configs nutzen.
* **Lab 5:** Ingress vs Host-Modus vergleichen.

---

## 17) Zusammenfassung

* Swarm = **einfach, sicher, integriert**.
* **Services → Tasks → Container.**
* Overlay-Netze, VIP Load Balancing, Routing Mesh.
* Rolling Updates, Rollbacks, Secrets, Constraints.
* **Beste Wahl für kleine/mittlere Cluster & Ausbildung.**

## 18) Cheatsheet

```bash
docker swarm init
docker swarm join --token <token> <manager_ip>:2377
docker node ls
docker node update --availability drain <node>
docker network create -d overlay app-net
docker service create --name web --replicas 3 --network app-net -p 8080:80 nginx:alpine
docker service update --image nginx:1.27-alpine --update-order start-first web
docker service scale web=6
docker service logs -f web
docker stack deploy -c docker-compose.yml mystack
docker stack ps mystack
docker stack rm mystack
echo -n "shhh" | docker secret create api_key -
docker config create nginx_conf ./nginx.conf
```
