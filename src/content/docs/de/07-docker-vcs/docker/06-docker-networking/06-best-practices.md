---
title: Best Practices für Docker Networking
---
# Best Practices für Docker Networking

Docker Networking ist sehr leistungsfähig, doch um **Sicherheit, Wartbarkeit und Skalierbarkeit** sicherzustellen, ist es wichtig, bestimmte Best Practices einzuhalten. Die folgenden Richtlinien helfen Teams dabei, containerisierte Anwendungen zuverlässig und vorhersehbar zu betreiben.

---

## 1. Verwende eigene Bridge-Netzwerke

* Standardmäßig haben Container im `bridge`-Netzwerk keine automatische DNS-basierte Service-Erkennung.
* Das Anlegen eines **benutzerdefinierten Bridge-Netzwerks** ermöglicht:

  * Eingebaute DNS-Auflösung zwischen Containern.
  * Saubere Service-zu-Service-Kommunikation (`service-name:port`).
  * Isolation von Containern, die nicht mit demselben Netzwerk verbunden sind.

**Beispiel:**

```bash
docker network create my-bridge
docker run -d --name backend --network my-bridge my-backend-image
docker run -d --name frontend --network my-bridge my-frontend-image
```

Jetzt kann der `frontend`-Container den `backend` einfach über `http://backend:PORT` erreichen.

---

## 2. Vermeide `--network host`, außer es ist notwendig

Der **Host Network Driver** erlaubt einem Container, den Netzwerk-Stack des Hosts direkt zu nutzen. Das bietet zwar **maximale Performance** und direkten Zugriff auf Host-Ports, bringt jedoch Nachteile mit sich:

* **Vorteile:**

  * Kein Overhead durch NAT oder virtuelle Bridges.
  * Nützlich für performancekritische Workloads (z. B. Game-Server, Monitoring-Agents).

* **Nachteile:**

  * Geringere Netzwerkisolation.
  * **Port-Konflikte** zwischen Containern und Host sind möglich.
  * Weniger sicher in Multi-Tenant-Umgebungen.

✅ **Empfehlung:** Nur einsetzen, wenn tatsächlich volle Geschwindigkeit oder Host-Zugriff gebraucht wird.

---

## 3. Begrenze Service-Exposition mit internen Netzwerken

Nicht jeder Container sollte von außen erreichbar sein.
Für mehr Sicherheit und klare Architekturen gilt:

* Nur **Frontend-Services** (z. B. Nginx, API-Gateway) nach außen freigeben.
* **Datenbanken, Message Queues und interne APIs** in private Netzwerke legen.
* Mit **Netzwerk-Aliases** und Compose-Netzwerken internen und externen Traffic trennen.

**Beispiel in `docker-compose.yml`:**

```yaml
services:
  db:
    image: postgres
    networks:
      - internal

  backend:
    image: backend-app
    networks:
      - internal
      - frontend

  frontend:
    image: nginx
    ports:
      - "80:80"
    networks:
      - frontend

networks:
  internal:
    internal: true
  frontend:
```

Hier ist die `db` nur innerhalb des internen Netzwerks sichtbar.

---

## 4. Bevorzuge Docker Compose für Multi-Container-Setups

Das manuelle Verbinden und Verwalten mehrerer Container ist fehleranfällig. **Docker Compose** bietet:

* Ein **deklaratives YAML-Format** für Netzwerke, Services und deren Verbindungen.
* Vorhersehbare Benennung von Netzwerken und Containern.
* Bessere Zusammenarbeit im Team (Dokumentation im `docker-compose.yml`).

Das macht Setups **lesbarer, reproduzierbarer und wartbarer**.

---

## 5. Netzwerke überwachen und inspizieren

Regelmäßige Überprüfung stellt sicher, dass Container wie geplant verbunden sind:

* Mit `docker network inspect <network-name>` lassen sich prüfen:

  * Verbundene Container.
  * Subnetze, Gateways und Treiber.
* Für tiefere Analysen:

  * Pakete mit **Wireshark** (insbesondere in Bridge-Netzen) mitlesen.
  * Logging- und Monitoring-Tools zur Traffic-Analyse nutzen.

Gerade in **Produktivumgebungen** wichtig, um Fehlkonfigurationen zu vermeiden.

---

## 6. Dokumentiere deine Netzwerkarchitektur

Komplexe Deployments beinhalten oft **mehrere Services, Netzwerke und externe Systeme**. Ohne Dokumentation wird Onboarding und Troubleshooting schwierig.

Best Practices für Dokumentation:

* **Netzwerkdiagramme** erstellen (Services und ihre Verbindungen).
* Entscheidungen zur Netzwerkkonfiguration im Repository dokumentieren (README, Infrastruktur-Doku).
* Dokumentation aktuell halten, wenn Services wachsen oder sich ändern.

---

## Zusammenfassung

Diese Best Practices machen Docker Networking:

* **Sicher** (durch Isolation und minimale Exposition).
* **Zuverlässig** (dank DNS-Discovery und klaren Compose-Setups).
* **Wartbar** (durch Monitoring und Dokumentation).

So entstehen containerisierte Systeme, die sowohl in der **Entwicklung** als auch in **Produktionsumgebungen** stabil und skalierbar sind.
