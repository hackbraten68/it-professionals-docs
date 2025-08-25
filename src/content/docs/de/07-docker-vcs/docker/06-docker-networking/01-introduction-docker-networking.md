---
title: Einführung in Docker Networking
---

Docker-Container laufen in isolierten Umgebungen. Während diese Isolation für Sicherheit und Prozess-Trennung nützlich ist, benötigen die meisten realen Anwendungen **Netzwerkkommunikation** – entweder zwischen Containern oder mit der Außenwelt. Docker stellt hierfür ein flexibles und leistungsfähiges Netzwerk-System bereit, das interne DNS, virtuelle Switches und verschiedene Netzwerktreiber umfasst.

---

## Warum Docker Networking wichtig ist

Ohne Networking wären Container vollständig isoliert. Docker Networking ermöglicht:

- **Verbindung zwischen Containern** (z. B. Webserver-Container und Datenbank-Container).
- **Kontrolle des Datenverkehrs** innerhalb und außerhalb des Docker-Hosts.
- **Isolation von Workloads** für Sicherheit und Trennung von Umgebungen.
- **Bereitstellung von Diensten für externe Nutzer** oder Clients.

---

## Grundlagen von Docker Networking

Bei der Installation von Docker werden automatisch einige Netzwerkkonzepte eingerichtet:

1. **Virtuelle Ethernet-Schnittstellen**  
   Docker erstellt virtuelle Netzwerkinterfaces, um Container und Hostsystem zu verbinden.

2. **Internes DNS-System**  
   Docker ermöglicht die automatische Namensauflösung: Container können sich über ihre **Namen** erreichen, wenn sie im gleichen benutzerdefinierten Netzwerk laufen.

3. **Bridge-Netzwerke**  
   Ein privates internes Netzwerk, das Container auf demselben Host miteinander verbindet.

4. **Netzwerktreiber**  
   Docker nutzt austauschbare Treiber, um Netzwerke zu erstellen und zu verwalten. Jeder Treiber hat spezifische Anwendungsfälle.

---

## Standardnetzwerke

Standardmäßig legt Docker drei Netzwerke an:

- **bridge**  
  Das Standardnetzwerk für Container ohne explizite Angabe. Container im Bridge-Netzwerk können über IP-Adressen oder (in benutzerdefinierten Bridges) über Containernamen kommunizieren.

- **none**  
  Container sind vollständig isoliert und haben keinen Netzwerkzugang. Praktisch für Tests oder strikte Sicherheitsszenarien.

- **host**  
  Der Container teilt sich den Netzwerk-Stack mit dem Host. Keine Isolation, dafür direkter Zugriff auf Host-Netzwerk.

Alle Netzwerke lassen sich anzeigen mit:

```bash
docker network ls
```

---

## Netzwerktreiber

Docker stellt mehrere integrierte Treiber zur Verfügung:

1. **Bridge (Standard)**

   * Für Single-Host-Setups.
   * Geeignet für einfache Web-Stacks oder lokale Entwicklung.
   * Kommunikation über internes Bridge-Netzwerk, Port-Mappings für externe Erreichbarkeit.

   **Beispiel:**

   ```bash
   docker run -d --name web --network bridge -p 8080:80 nginx
   ```

2. **Host**

   * Entfernt die Netzwerktrennung zwischen Container und Host.
   * Container nutzt direkt die IP des Hosts.
   * Weniger Isolation, dafür bessere Performance.

3. **None**

   * Deaktiviert die Netzwerkanbindung komplett.
   * Eher selten genutzt, z. B. für Sicherheitstests.

4. **Overlay**

   * Verbindet Container über mehrere Docker-Hosts hinweg.
   * Wird in Docker Swarm oder anderen Orchestrierungslösungen eingesetzt.
   * Ermöglicht sichere Multi-Host-Kommunikation.

5. **Macvlan**

   * Weist Containern eigene MAC-Adressen zu, sodass sie wie physische Geräte im Netzwerk erscheinen.
   * Besonders nützlich bei Integration in bestehende Netzwerkinfrastrukturen.

6. **Drittanbieter-/Custom-Treiber**

   * Von der Community oder Anbietern entwickelt.
   * Zusatzfunktionen wie Verschlüsselung, SDN-Integration oder VPN-ähnliche Verbindungen.

---

## Eigene Netzwerke erstellen

Benutzerdefinierte Netzwerke bieten mehr Kontrolle:

```bash
docker network create mein-netzwerk
```

Container verbinden:

```bash
docker run -d --name app --network mein-netzwerk nginx
```

Details prüfen:

```bash
docker network inspect mein-netzwerk
```

---

## Service Discovery mit Docker DNS

* Container im selben benutzerdefinierten Netzwerk können sich per **Namen** ansprechen.
* Docker pflegt ein internes DNS-System.
* Beispiel: Ein `web`-Container kann einen `db`-Container einfach über `db` erreichen.

---

## Dienste nach außen bereitstellen

Um einen Container nach außen erreichbar zu machen:

```bash
docker run -d -p 8080:80 nginx
```

* `-p 8080:80` mappt den Host-Port **8080** auf den Container-Port **80**.
* Anwendung erreichbar unter: `http://localhost:8080`.

---

## Best Practices für Docker Networking

* **Benutzerdefinierte Netzwerke** statt Standard-Bridge verwenden (bessere DNS-Funktionalität).
* **Host-Netzwerk vermeiden**, außer Performance ist entscheidend.
* **Sensible Services isolieren** in separaten Netzwerken.
* **Port-Mappings dokumentieren**, um Konflikte zu vermeiden.
* **Netzwerkverkehr überwachen**, besonders in Produktion.
* **Overlay-Netzwerke verschlüsseln**, wenn sie mehrere Hosts verbinden.

---

## Zusammenfassung

Docker Networking ist die Grundlage für Kommunikation zwischen Containern und mit externen Systemen.
Mit den verschiedenen **Netzwerktreibern** und dem internen **DNS**-System können Netzwerke flexibel, sicher und skalierbar aufgebaut werden.

Diese Kenntnisse sind entscheidend, um Anwendungen in Docker – von einfachen Setups bis hin zu komplexen Multi-Host-Umgebungen – erfolgreich zu betreiben.
