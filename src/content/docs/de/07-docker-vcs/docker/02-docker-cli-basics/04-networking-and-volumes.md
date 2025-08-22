---
title: Networking und Volumes
---

# Lernziele

Am Ende dieser Lektion wirst du in der Lage sein:

- Die Netzwerk- und Speicher-Modelle von Docker zu erklären und zu wissen, wann man welche Funktion nutzt.  
- Netzwerke erstellen und verwalten (`bridge`, `host`, `none` und benutzerdefinierte Netzwerke).  
- Ports veröffentlichen, Container-zu-Container-Kommunikation aktivieren und DNS-basierte Service-Discovery nutzen.  
- Daten mit **Named Volumes**, **Bind Mounts** und **tmpfs** dauerhaft speichern und zwischen Containern teilen.  
- Zwischen `-v` und der expliziteren `--mount` Syntax wählen; Berechtigungen, SELinux und Besitzrechte verstehen.  
- Netzwerke und Volumes sicher inspizieren, Fehler beheben, sichern und bereinigen.  

---

# 1. Networking in Docker

Docker Networking verbindet Container untereinander, mit dem Host und mit externen Netzwerken. Jeder Container erhält einen eigenen Netzwerk-Namespace (eigenen Netzwerk-Stack), und Netzwerke werden durch Treiber implementiert (z. B. `bridge`, `host`, `overlay`, `macvlan`, `ipvlan`).

## 1.1 Standardnetzwerke auf einem Host

- **bridge** (Standard unter Linux): NAT-Netzwerk hinter dem Host; Container erhalten private IPs auf einer virtuellen Bridge, ausgehender Verkehr wird über NAT weitergeleitet.  
- **host** (Linux): Container teilt sich den Netzwerk-Namespace des Hosts – keine Isolation, kein Port-Mapping nötig.  
- **none**: Kein Netzwerk (nur Loopback im Container).  

Netzwerke auflisten:

```bash
docker network ls
````

Ein Netzwerk inspizieren:

```bash
docker network inspect bridge
```

## 1.2 Benutzerdefinierte Bridge-Netzwerke (empfohlen)

Vorteile von benutzerdefinierten Bridges:

* Automatisches **eingebettetes DNS** für Namensauflösung.
* Bessere Isolation (nur Container im selben Netzwerk sehen sich).
* Konfigurierbare Subnetze, IP-Ranges und Gateways.
* Netzwerkweite Aliase.

Erstellen:

```bash
docker network create my-bridge
```

Container starten:

```bash
docker run -d --network my-bridge --name app my-node-app
```

Details inspizieren:

```bash
docker network inspect my-bridge
```

Container verbinden/trennen:

```bash
docker network connect my-bridge some-container
docker network disconnect my-bridge some-container
```

Subnetz und IP-Range angeben:

```bash
docker network create \
  --driver bridge \
  --subnet 10.10.0.0/24 \
  --gateway 10.10.0.1 \
  --ip-range 10.10.0.128/25 \
  appnet
```

Statische IP vergeben (nur wenn nötig):

```bash
docker run -d --network appnet --ip 10.10.0.10 --name api myorg/api:1.0
```

## 1.3 Namensauflösung und Aliase

Docker löst Container-Namen im selben benutzerdefinierten Netzwerk auf:

```bash
ping api
curl http://api:8080/health
```

Alias setzen:

```bash
docker run -d --network appnet \
  --network-alias service-a \
  --name service-a-1 myorg/service-a
```

Nun wird `service-a` → `service-a-1` aufgelöst.

## 1.4 Ports veröffentlichen (Host ↔ Container)

Im **bridge**-Netzwerk sind Container privat; Ports müssen veröffentlicht werden:

* `-p HOST:CONTAINER` für explizites Mapping.
* `-P` veröffentlicht alle `EXPOSE`-Ports auf zufälligen Host-Ports.

Beispiele:

```bash
docker run -d -p 8080:80 --name web nginx:latest
docker run -d -P myapp:latest
```

Im **host**-Netzwerk (Linux) ist kein Port-Mapping nötig:

```bash
docker run --network host -d myapp:latest
```

**Hinweis:** `--network host` vermeiden in Multi-Tenant-Umgebungen → Isolation sinkt.

## 1.5 Weitere Treiber (Überblick)

* **overlay**: Multi-Host-Netzwerke (Swarm/Kubernetes).
* **macvlan/ipvlan**: Container erhalten direkt routbare IPs im physischen Netz (ohne NAT).

Beispiel:

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  extnet
```

## 1.6 Troubleshooting

```bash
docker inspect --format '{{json .NetworkSettings}}' app | jq .
docker exec -it app sh
apk add curl bind-tools
curl -I http://api:8080/health
nslookup api
```

Typische Probleme:

* Port schon belegt → anderen Host-Port wählen.
* Container auf unterschiedlichen Netzwerken → nicht erreichbar, außer man verbindet sie.
* DNS-Auflösung nur innerhalb **eines** benutzerdefinierten Netzwerks.

---

# 2. Datenpersistenz

Standardmäßig sind Container-Dateisysteme **flüchtig**.
Mit **Volumes** oder **Bind Mounts** kann man Daten persistent speichern und zwischen Containern teilen.

## 2.1 Speicheroptionen

* **Named Volumes**: Von Docker verwaltet, portabel, produktionssicher.
* **Bind Mounts**: Host-Pfad ↔ Container-Pfad, praktisch für Entwicklung.
* **tmpfs**: Nur im Speicher, verschwindet beim Stoppen.

### Wann nutzen?

* Produktionsdatenbanken: **Named Volumes**
* Entwicklung mit Hot-Reload: **Bind Mounts**
* Geheimnisse/temporäre Caches: **tmpfs**

---

## 2.2 Named Volumes

Anlegen:

```bash
docker volume create data-vol
```

Nutzen:

```bash
docker run -d -v data-vol:/var/lib/mysql mysql:8
```

Verwalten:

```bash
docker volume ls
docker volume inspect data-vol
docker volume rm data-vol
```

Mit `--mount`:

```bash
docker run -d \
  --mount type=volume,src=data-vol,dst=/var/lib/mysql \
  mysql:8
```

### Erweiterte Optionen

NFS:

```bash
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=10.0.0.5,nolock,soft,rw \
  --opt device=:/exports/appdata \
  nfs-appdata
```

CIFS:

```bash
docker volume create \
  --driver local \
  --opt type=cifs \
  --opt device=//10.0.0.6/share \
  --opt o=username=myuser,password=mypass,uid=1000,gid=1000 \
  cifs-share
```

---

## 2.3 Bind Mounts

```bash
docker run -it \
  -v /home/user/app:/usr/src/app \
  -w /usr/src/app \
  node:18-alpine \
  npm run dev
```

Mit `--mount`:

```bash
docker run -it \
  --mount type=bind,src=/home/user/app,dst=/usr/src/app \
  -w /usr/src/app \
  node:18-alpine \
  npm run dev
```

Vor- und Nachteile:

* **Bind**: Echtzeit-Sync, gut für Dev, aber weniger portabel.
* **Volume**: Von Docker verwaltet, sicherer für Prod.

### Spezialfälle

* Einzelne Datei mounten:

```bash
docker run -d \
  --mount type=bind,src=/etc/myapp/config.yml,dst=/app/config.yml,ro \
  myapp:1.0
```

* Read-only Mounts:

```bash
docker run -d \
  --mount type=bind,src=/var/log/myapp,dst=/logs,ro \
  myapp:1.0
```

### Rechte & SELinux

```bash
sudo chown -R 1000:1000 /home/user/app-data
docker run -d -v /data/mysql:/var/lib/mysql:Z mysql:8
```

### Hinweis Docker Desktop

Unter macOS/Windows laufen Bind Mounts durch eine VM → Performanceunterschiede.
Für DBs besser **Volumes** nutzen.

---

## 2.4 tmpfs (RAM, nur Linux)

```bash
docker run -d \
  --tmpfs /run/secrets:rw,size=64m,mode=1700 \
  myapp:1.0
```

Oder:

```bash
docker run -d \
  --mount type=tmpfs,destination=/tmp \
  myapp:1.0
```

Daten verschwinden beim Stoppen.

---

# 3. `-v` vs `--mount`

* `-v`: kurz, flexibel, aber weniger klar.
* `--mount`: explizit, empfohlen für Prod.

---

# 4. Operative Aufgaben

## 4.1 Backup/Restore Volumes

Backup:

```bash
docker run --rm \
  -v data-vol:/data:ro \
  -v "$PWD":/backup \
  alpine \
  sh -c "cd /data && tar -cf /backup/data-vol.tar ."
```

Restore:

```bash
docker run --rm \
  -v data-vol:/data \
  -v "$PWD":/backup \
  alpine \
  sh -c "cd /data && tar -xf /backup/data-vol.tar"
```

## 4.2 Aufräumen

```bash
docker volume prune
docker network prune
```

---

# 5. Best Practices

* Benutzerdefinierte Netzwerke für App-Tiers nutzen.
* Service-Namen statt IPs.
* `--network host` nur wenn nötig.
* Für Datenbanken: **Volumes** statt Bind Mounts.
* Möglichst Read-only Mounts.
* Backups regelmäßig testen.

---

# 6. Hands-On Lab

1. Netzwerk erstellen & inspizieren
2. Zwei Services starten & DNS testen
3. Port veröffentlichen
4. Named Volume für DB
5. Bind Mount für Dev
6. Backup & Restore testen

---

# Appendix: Quick Reference

## Netzwerke

* `docker network ls`
* `docker network inspect <net>`
* `docker network create <name>`
* `docker network connect <net> <container>`
* `docker network prune`

## Volumes

* `docker volume ls`
* `docker volume inspect <vol>`
* `docker volume create <name>`
* `docker volume rm <name>`
* `docker volume prune`
