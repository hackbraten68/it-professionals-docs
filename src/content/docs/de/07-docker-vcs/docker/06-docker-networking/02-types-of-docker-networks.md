---
title: Typen von Docker-Netzwerken
---
# Typen von Docker-Netzwerken

Docker bietet verschiedene Netzwerkoptionen, um Container miteinander und mit der Außenwelt zu verbinden. Die Wahl des richtigen Netzwerktyps ist entscheidend, um ein Gleichgewicht zwischen **Performance, Isolation und Skalierbarkeit** in containerisierten Umgebungen zu erreichen.

In dieser Lektion betrachten wir die fünf wichtigsten Docker-Netzwerktypen: **Bridge, Host, None, Overlay und Macvlan**.

---

## 1. Bridge-Netzwerk (Standard)

Das **Bridge-Netzwerk** ist der Standardtyp, wenn Container auf einem einzelnen Docker-Host gestartet werden. Wird kein Netzwerk angegeben, verbindet Docker den Container automatisch mit dem Standard-`bridge`.

### Wichtige Merkmale

* **NAT-basiertes Routing**: Container kommunizieren mit der Außenwelt über Network Address Translation (NAT).
* **Eigene IP-Adresse pro Container**: Jeder Container erhält eine private IP im virtuellen Bridge-Netzwerk.
* **Namensbasierte Verlinkung**: In einem benutzerdefinierten Bridge-Netzwerk können sich Container gegenseitig über Namen erreichen.
* **Host-zu-Container-Kommunikation**: Container können Ports nach außen freigeben.

### Beispiel

```bash
docker network create mybridge
docker run -d --name app1 --network mybridge nginx
docker run -d --name app2 --network mybridge alpine ping app1
```

### Einsatzgebiete

✅ Geeignet für **kleine lokale Projekte**, Entwicklungsumgebungen und einfache Multi-Container-Setups auf demselben Host.

---

## 2. Host-Netzwerk

Beim **Host-Netzwerk** teilt sich der Container den **Netzwerk-Stack** mit dem Docker-Host. Der Container nutzt also die IP-Adresse des Hosts, und Ports müssen nicht explizit gemappt werden.

### Vorteile

* **Kein Virtualisierungs-Overhead**: Höhere Geschwindigkeit, da kein NAT oder virtuelle Bridges verwendet werden.
* **Direkter Zugriff**: Container können die Interfaces des Hosts direkt nutzen.

### Nachteile

* **Keine Isolation**: Container und Host teilen denselben Netzwerk-Namespace.
* **Port-Konflikte möglich**: Mehrere Container können denselben Port nicht gleichzeitig belegen.

### Beispiel

```bash
docker run -d --network host nginx
```

Hier lauscht der Nginx-Server direkt auf der Netzwerk-Schnittstelle des Hosts.

### Einsatzgebiete

✅ Sinnvoll für **leistungsintensive Anwendungen** oder Tools, die direkten Zugriff auf das Host-Netzwerk benötigen.

---

## 3. None-Netzwerk

Das **None-Netzwerk** deaktiviert jegliche Netzwerkverbindungen für einen Container. Der Container hat keinen Zugriff auf das Internet, andere Container oder sogar `localhost`.

### Merkmale

* Container ist vollständig vom Netzwerk isoliert.
* Nur interne Prozesse laufen ohne Netzwerkanbindung.

### Beispiel

```bash
docker run -d --network none alpine sleep 1000
```

### Einsatzgebiete

✅ Nützlich für:

* **Isolierte Aufgaben**
* **Sicherheitstests**
* Hintergrundjobs ohne Netzwerkbedarf

---

## 4. Overlay-Netzwerk

Das **Overlay-Netzwerk** ermöglicht die Kommunikation zwischen Containern auf unterschiedlichen Docker-Hosts. Typischerweise wird es in **Cluster-Umgebungen** (z. B. Docker Swarm, Kubernetes) genutzt.

### Funktionsweise

* Benötigt **Docker Swarm Mode** oder einen externen Key-Value-Store (z. B. etcd, Consul).
* Erstellt ein **virtuelles Netzwerk** über mehrere Hosts hinweg.
* Bietet **integrierte Verschlüsselung** für den Datenverkehr zwischen den Knoten.
* Unterstützt **automatische IP-Zuweisung** und **Service Discovery**.

### Beispiel

```bash
docker swarm init
docker network create -d overlay myoverlay
docker service create --name web --network myoverlay nginx
```

### Einsatzgebiete

✅ Ideal für **skalierbare, verteilte Systeme**, **Microservices-Architekturen** und **Service Meshes**.

---

## 5. Macvlan-Netzwerk

Das **Macvlan-Netzwerk** weist Containern eine eigene **MAC-Adresse** zu, sodass sie wie eigenständige physische Geräte im Netzwerk erscheinen.

### Vorteile

* Jeder Container erhält eine **eigene IP-Adresse** direkt im physischen Netzwerk.
* Container können von **anderen Geräten im Netzwerk entdeckt** werden (z. B. Router, Drucker, IoT-Hardware).
* Geeignet für Umgebungen mit **Legacy-Systemen**, die physische Geräte erwarten.

### Nachteile

* Komplexere Konfiguration als andere Netzwerke.
* Nicht auf allen Plattformen verfügbar (besonders eingeschränkt auf **Windows**).

### Beispiel

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 mymacvlan
```

### Einsatzgebiete

✅ Sinnvoll für **IoT**, **Legacy-Anwendungen** oder wenn Container im physischen Netzwerk wie „echte“ Geräte auftreten müssen.

---

# Vergleichstabelle

| Netzwerktyp | Isolation | Performance  | Multi-Host-Support | Typische Nutzung                    |
| ----------- | --------- | ------------ | ------------------ | ----------------------------------- |
| **Bridge**  | Mittel    | NAT-Overhead | Nein               | Lokale Entwicklung, kleine Projekte |
| **Host**    | Gering    | Hoch         | Nein               | Performancekritische Services       |
| **None**    | Hoch      | N/A          | Nein               | Isolierte Tasks, Tests              |
| **Overlay** | Hoch      | Mittel       | Ja                 | Verteilte Systeme, Microservices    |
| **Macvlan** | Gering    | Hoch         | Eingeschränkt      | IoT, Legacy-Systeme                 |

---

# Wichtigste Erkenntnisse

* **Bridge**: Standard, geeignet für lokale und einfache Setups.
* **Host**: Maximale Performance, aber ohne Isolation.
* **None**: Komplett isolierte Container für Spezialfälle.
* **Overlay**: Ermöglicht Kommunikation über mehrere Hosts hinweg – ideal für Cluster.
* **Macvlan**: Container erscheinen als eigenständige Geräte im Netzwerk.
