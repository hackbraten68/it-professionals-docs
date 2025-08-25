---
title: Inspizieren und Verwalten von Docker-Netzwerken
---
# Inspizieren und Verwalten von Docker-Netzwerken

Ein praktischer, strukturierter Leitfaden zum **Entdecken**, **Verstehen** und **Verwalten** von Docker-Netzwerken – ausgelegt für Unterricht und praxisnahes Lernen.

---

## Lernziele

Am Ende können Lernende:

* Vorhandene Docker-Netzwerke auflisten und die Standardnetzwerke erklären.
* Netzwerkdetails inspizieren (Treiber, Scope, Subnetze, Gateways, verbundene Container).
* Benutzerdefinierte Netzwerke mit eigenen IPAM-Einstellungen erstellen.
* Container dynamisch mit Netzwerken verbinden und wieder trennen (inkl. statischer IPs).
* Häufige Netzwerkprobleme analysieren und Best Practices anwenden.

---

## Grundbegriffe (Schnellüberblick)

* **Netzwerktreiber:** `bridge` (einzelner Host), `host` (Host-Stack gemeinsam), `none` (kein Netzwerk), `macvlan/ipvlan` (Integration ins physische LAN), `overlay` (Multi-Host, Swarm).
* **Benutzerdefinierte Bridge vs. Standard-Bridge:** Benutzerdefinierte Brücken bieten **eingebaute DNS-basierte Namensauflösung** und bessere Isolation. Die Standard-Bridge ist eingeschränkt und für einfache Setups gedacht.
* **IPAM:** IP Address Management (Subnetze, Gateways, Adresspools, IPv6).

---

## 1) Vorhandene Netzwerke auflisten

```bash
docker network ls
```

Typische Ausgabe:

```bash
NETWORK ID     NAME      DRIVER    SCOPE
6f8b4c12cd0a   bridge    bridge    local
9b1c2d3e4f5g   host      host      local
1a2b3c4d5e6f   none      null      local
a7b8c9d0e1f2   my-bridge bridge    local
```

**Zu beachten:**

* **NAME:** Menschlich lesbarer Name für Befehle.
* **DRIVER:** Verhalten und Fähigkeiten (`bridge`, `overlay` etc.).
* **SCOPE:** `local` (ein Host) oder `swarm` (Multi-Host).

---

## 2) Netzwerkdetails inspizieren

```bash
docker network inspect <netzwerk-name>
```

Beispiel:

```bash
docker network inspect my-bridge
```

Wichtige Felder in der JSON-Ausgabe:

* **"Driver"** – z. B. `"bridge"`.
* **"IPAM.Config"** – Subnetze, Gateways, IPv6-Bereiche.
* **"Containers"** – verbundene Container und ihre IPs.
* **"Options"** – treiberspezifische Optionen.

Gefilterte Ausgabe:

```bash
docker network inspect my-bridge --format '{{json .IPAM.Config}}'
```

Oder verbundene Container anzeigen:

```bash
docker network inspect my-bridge \
  --format 'Containers: {{range $id, $c := .Containers}}{{$c.Name}} ({{$c.IPv4Address}}) {{end}}'
```

---

## 3) Benutzerdefiniertes Bridge-Netzwerk erstellen

```bash
docker network create my-bridge
```

**Vorteile:**

* **Isolation:** Container auf verschiedenen Netzwerken sind getrennt.
* **DNS:** Container können sich per **Namen** erreichen.
* **Anpassbar:** Eigene Subnetze und Gateways möglich.

### Beispiele

```bash
# Mit Subnetz und Gateway
docker network create --driver bridge --subnet 10.10.0.0/24 --gateway 10.10.0.1 my-bridge

# IPv6 aktivieren
docker network create --driver bridge --ipv6 --subnet 2001:db8:abcd::/64 my-bridge-v6

# Internes Netz (kein Internetzugang)
docker network create --driver bridge --internal internal-net
```

---

## 4) Container verbinden / trennen

Container zur Laufzeit verbinden:

```bash
docker network connect my-bridge mein-container
```

Trennen:

```bash
docker network disconnect my-bridge mein-container
```

### Mit statischer IP

```bash
docker network connect --ip 10.10.0.50 my-bridge mein-container
```

### Mit Alias (zusätzlicher DNS-Name)

```bash
docker network connect --alias db my-bridge postgres-1
```

---

## 5) Netzwerklebenszyklus

* **Löschen:**

  ```bash
  docker network rm my-bridge
  ```

  Nur möglich, wenn keine Container verbunden sind.

* **Ungenutzte Netzwerke entfernen:**

  ```bash
  docker network prune
  ```

---

## 6) Praxisbeispiel: Frontend/Backend-Isolierung

```bash
docker network create frontend
docker network create backend

docker run -d --name web --network frontend nginx
docker run -d --name app --network frontend myorg/app:latest
docker network connect backend app
docker run -d --name db --network backend postgres
```

* `web` ↔ `app` über `frontend`
* `app` ↔ `db` über `backend`
* `web` hat keinen Zugriff auf `db`

---

## 7) Fehleranalyse & Tipps

* **DNS funktioniert nicht?**
  Container müssen auf **demselben benutzerdefinierten Netzwerk** laufen.

* **IP-Konflikt?**
  Verwende ein **nicht überlappendes Subnetz**.

* **Kein Internet?**
  Prüfen, ob Netzwerk mit `--internal` erstellt wurde.

* **Welche Netzwerke nutzt ein Container?**

  ```bash
  docker inspect <container> --format '{{json .NetworkSettings.Networks}}'
  ```

---

## 8) Weitere Netzwerktypen (Überblick)

* **host:** Container nutzt den Netzwerkstack des Hosts. Sehr performant, aber keine Isolation.
* **none:** Kein Netzwerk, nur `localhost`. Gut für Sandboxing.
* **macvlan/ipvlan:** Container bekommen IPs direkt aus dem physischen LAN.
* **overlay:** Multi-Host-Netzwerke (Docker Swarm).

---

## 9) Sicherheit & Best Practices

* Immer **benutzerdefinierte Netzwerke** nutzen.
* **Interne Netzwerke** für Backends ohne Internetzugriff.
* Container nur mit den Netzwerken verbinden, die sie wirklich brauchen.
* Vorsicht mit `--net=host` – es hebt die Isolation auf.
* Regelmäßig mit `docker network prune` aufräumen.

---

## 10) Lernlabor-Aufgaben

1. Erstelle `my-bridge` mit eigenem Subnetz.
2. Verbinde zwei Container und teste DNS-Auflösung.
3. Vergib einer Instanz eine **statische IP**.
4. Erstelle ein **internes** Netzwerk ohne Internetzugang.
5. Verschiebe einen Container in ein anderes Netzwerk.
6. Inspiziere Netzwerke mit `--format`.
7. Entferne ungenutzte Netzwerke.

---

## Befehlsübersicht (Cheat Sheet)

```bash
docker network ls
docker network inspect <netz>
docker network create <name>
docker network connect [--ip <addr>] [--alias <alias>] <netz> <container>
docker network disconnect <netz> <container>
docker network rm <netz>
docker network prune
```
