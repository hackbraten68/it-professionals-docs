---
title: Single-Host Production Deployment
---
# Single-Host Production Deployment

## Beschreibung

Single-Host-Production-Deployment bezeichnet den Betrieb von Docker-Containern auf **einem einzigen physischen oder virtuellen Server**. Dieser Server kann sich **on-premises** (im eigenen Rechenzentrum oder Büro) oder in der **Cloud** (z. B. AWS EC2, DigitalOcean Droplet, Azure VM) befinden.

Dieser Ansatz eignet sich besonders für **kleine bis mittelgroße Anwendungen** mit vergleichsweise **geringer Komplexität**. Häufig wird er von Startups, für Hobbyprojekte oder von Teams genutzt, die eine Anwendung schnell und unkompliziert in Produktion bringen möchten – ohne den Overhead eines Orchestrators wie Kubernetes oder Docker Swarm.

Es ist jedoch wichtig, die **Abwägungen** zu verstehen, insbesondere in Bezug auf **Skalierbarkeit** und **Ausfallsicherheit**.

---

## Tools und Setup

### 1. Basis-Containerverwaltung

* **`docker run`**
  Der einfachste Weg, einen Container zu starten. Beispiel:

  ```bash
  docker run -d -p 80:80 myapp:latest
  ```

  Startet einen Container im Hintergrundmodus und mappt Port 80 des Hosts auf Port 80 im Container.

* **`docker-compose`**
  Sinnvoll für Anwendungen mit mehreren Containern. Über eine `docker-compose.yml` können mehrere Services, Netzwerke und Volumes definiert werden.
  Beispiel:

  ```yaml
  version: '3.8'
  services:
    web:
      image: myapp:latest
      ports:
        - "80:80"
      restart: always
    db:
      image: postgres:15
      volumes:
        - db_data:/var/lib/postgresql/data
  volumes:
    db_data:
  ```

### 2. Service-Management mit Systemd

* Container können mit **systemd** als **Systemdienste** verwaltet werden, um sicherzustellen, dass sie nach einem Neustart automatisch starten und bei Abstürzen überwacht werden.

* Beispiel für eine `myapp.service` Unit-Datei:

  ```ini
  [Unit]
  Description=MyApp Container
  After=network.target

  [Service]
  ExecStart=/usr/bin/docker run --rm -p 80:80 --name myapp myapp:latest
  ExecStop=/usr/bin/docker stop myapp
  Restart=always

  [Install]
  WantedBy=multi-user.target
  ```

* Vorteile:

  * Automatische Neustarts
  * Integration in System-Logs (`journalctl`)
  * Einfachere Prozessüberwachung

---

## Vorteile

* **Einfache Einrichtung**
  Schnelle Inbetriebnahme ohne komplexe Orchestrierung.

* **Geringe Einstiegshürde**
  Entwickler mit Docker-Grundkenntnissen können direkt starten.

* **Niedriger Verwaltungsaufwand**
  Weniger Infrastrukturkomponenten zu betreuen; ideal für Teams ohne dedizierte DevOps-Rolle.

* **Kostengünstig**
  Betrieb auf nur einer VM oder Maschine reduziert die Infrastrukturkosten.

* **Passend für kleine Projekte**
  Optimal für persönliche Projekte, MVPs oder wenig frequentierte Produktions-Services.

---

## Einschränkungen

* **Nicht skalierbar**
  Horizontale Skalierung (mehrere Server) ist nur manuell und mit erheblichem Aufwand möglich.

* **Single Point of Failure**
  Fällt der Server aus, ist die gesamte Anwendung offline.

* **Keine Hochverfügbarkeit**
  Es gibt keine automatische Redundanz oder Failover-Mechanismen.

* **Ressourcenbeschränkungen**
  CPU, RAM und Speicherplatz sind auf die Kapazität des Hosts limitiert.

* **Manuelle Updates und Rollbacks**
  Erfordern sorgfältiges Vorgehen, um Ausfallzeiten zu vermeiden.

---

## Best Practices

* **Monitoring & Logging**
  Tools wie Prometheus, Grafana oder ELK/EFK einsetzen, um Container-Performance und Logs zu überwachen.

* **Backups**
  Regelmäßige Sicherung von Volumes und Konfigurationsdateien.

* **Sicherheits-Hardening**

  * Regelmäßige Updates von Docker und Host-OS.
  * Container möglichst nicht als Root laufen lassen.
  * Firewalls und Reverse Proxies (z. B. Nginx, Traefik) einsetzen.

* **CI/CD-Integration**
  Automatisierte Builds und Deployments mit GitHub Actions, GitLab CI oder Jenkins nutzen.

---

## Einsatzszenarien

* **Prototypen und MVPs**
  Schnelles Deployment für frühes Nutzerfeedback.

* **Kleinunternehmen oder Hobbyprojekte**
  Produktionsumgebungen mit geringem Budget und überschaubarem Traffic.

* **Interne Tools**
  Dashboards, kleine APIs oder Entwicklerwerkzeuge, die keine hohe Verfügbarkeit erfordern.

---

## Fazit

Ein Single-Host-Production-Deployment ist eine **einfache, kosteneffiziente und praktikable** Lösung für viele kleine Projekte. Es bietet einen guten Mittelweg zwischen Entwicklungsfreundlichkeit und Produktionsreife, bringt jedoch klare Einschränkungen bei **Skalierbarkeit** und **Fehlertoleranz** mit sich.

Für größere oder geschäftskritische Systeme empfiehlt sich der Umstieg auf **Multi-Host-Orchestrierung** (z. B. Kubernetes, Swarm oder Nomad). Für kleinere Projekte reicht jedoch oft ein einzelner Host völlig aus.
