---
title: Cloud-basiertes Deployment
---
# Cloud-basiertes Deployment

## 1. Einführung

Cloud-basiertes Deployment bedeutet, Docker-Container auf von Cloud-Anbietern bereitgestellter Infrastruktur auszuführen. Anstatt lokale Rechner oder On-Premise-Server zu nutzen, werden Container in virtuellen Maschinen (VMs) oder verwalteten Diensten in der Cloud betrieben. Dieses Modell bietet Skalierbarkeit, Flexibilität und eine einfache Integration mit zahlreichen Cloud-nativen Diensten. Es eignet sich besonders für kleine bis mittlere Anwendungen, die mehr Zuverlässigkeit benötigen als ein lokales Deployment, jedoch noch keine komplexen Orchestrierungsplattformen wie Kubernetes.

---

## 2. Beschreibung

Cloud-Anbieter wie **Amazon Web Services (AWS)**, **Google Cloud Platform (GCP)** und **Microsoft Azure** ermöglichen das Deployment von containerisierten Anwendungen auf unterschiedliche Weise:

* **Virtuelle Maschinen (VMs):** Container laufen auf universellen Compute-Instanzen (z. B. AWS EC2, Google Compute Engine, Azure VMs).
* **Docker Machine / SSH:** Mit Tools wie Docker Machine oder SSH-Skripten können Container auf Cloud-Instanzen provisioniert, konfiguriert und bereitgestellt werden.
* **Verwaltete Containerdienste (optional):** Viele Clouds bieten zusätzliche Dienste wie AWS ECS oder Azure Container Instances, die den Prozess vereinfachen (liegt aber außerhalb des Fokus von VMs).

---

## 3. Deployment-Optionen

### 3.1 Nutzung von Virtuellen Maschinen

* **AWS EC2:** Elastic Compute Cloud-Instanzen, auf denen Docker manuell oder automatisiert installiert werden kann.
* **Google Compute Engine:** Flexible VM-Typen mit enger Integration in Google-Netzwerke und Speicherlösungen.
* **Azure Virtual Machines:** Unterstützung für Linux- oder Windows-VMs, auf denen Docker betrieben werden kann.

### 3.2 Nutzung von Docker Machine

* Docker Machine erstellt und provisioniert automatisch Cloud-VMs.
* Beispiel:

  ```bash
  docker-machine create --driver amazonec2 my-docker-host
  eval $(docker-machine env my-docker-host)
  docker run -d -p 80:80 nginx
  ```
  
* Damit lassen sich Container auf entfernten Hosts verwalten, als wären sie lokal.

### 3.3 Nutzung von SSH und Automatisierung

* Direkter SSH-Zugriff auf Cloud-VMs zur Installation von Docker und Deployment von Containern.
* Automatisierung möglich mit Skripten, Ansible oder Terraform.

---

## 4. Vorteile von Cloud-basiertem Deployment

1. **Skalierbarkeit**

   * Ressourcen (CPU, RAM, Speicher) können leichter erweitert werden als lokal.
   * Neue VMs können schnell gestartet werden, um Lastspitzen abzufangen.

2. **Cloud-Integration**

   * Zugriff auf Cloud-Dienste wie Datenbanken (z. B. AWS RDS), Objektspeicher (z. B. S3, Azure Blob Storage) und Monitoring-Tools.
   * Vereinfacht die Architektur durch Kombination von Containern mit vorhandenen Diensten.

3. **Netzwerk & Speicher**

   * Integrierte Netzwerkoptionen (VPCs, Firewalls, Load Balancer).
   * Persistente Speicherlösungen für Container.
   * Backup- und Disaster-Recovery-Möglichkeiten.

4. **Globale Verfügbarkeit**

   * Deployment in verschiedenen Regionen, näher am Endnutzer.
   * Verbessert Performance und reduziert Latenzen.

---

## 5. Überlegungen und Herausforderungen

1. **Betriebssystem- und Docker-Wartung**

   * Verantwortung für Updates von VM-Betriebssystem und Docker-Engine liegt beim Nutzer.
   * Sicherheits-Patches und Kernel-Updates müssen regelmäßig eingespielt werden.

2. **Monitoring & Logging**

   * Monitoring muss selbst eingerichtet werden (z. B. Prometheus, Grafana, ELK-Stack).
   * Logging und Alarme benötigen Integration mit Cloud-Diensten oder Drittanbietern.

3. **Kostenmanagement**

   * Kosten steigen mit Nutzung von Compute, Speicher und Netzwerk.
   * Erfordert regelmäßiges Monitoring, um Überraschungen zu vermeiden.

4. **Sicherheit**

   * Absicherung von VMs, Firewalls und Zugriffskontrolle liegt in der Verantwortung des Nutzers.
   * Best Practices wie sichere SSH-Konfiguration oder Nicht-Root-Docker-Nutzer sind notwendig.

5. **Komplexität beim Skalieren**

   * Skalierung ist möglich, aber oft manuell und weniger komfortabel als mit Kubernetes.
   * Zusätzliche Konfiguration für Load Balancing und Failover erforderlich.

---

## 6. Beispiel-Workflow

1. **VM provisionieren** (z. B. auf AWS EC2).
2. **Docker installieren** (per cloud-init, Ansible oder manuell via SSH).
3. **Applikation deployen** mit Docker run oder docker-compose:

   ```bash
   docker-compose up -d
   ```

4. **Netzwerk konfigurieren** (Security Groups, Load Balancer).
5. **Monitoring einrichten** (z. B. AWS CloudWatch oder eigene Tools).

---

## 7. Einsatzszenarien für Cloud-basiertes Deployment

* Wenn **lokales Deployment** für Verfügbarkeit oder Skalierung nicht mehr ausreicht.
* Wenn man **Cloud-Storage, -Netzwerke oder Datenbanken** nutzen möchte.
* Für **kleine bis mittlere Produktions-Workloads**, bei denen Kubernetes überdimensioniert wäre.
* Als **Übergangsschritt** hin zu komplexeren Orchestrierungsplattformen.

---

## 8. Fazit

Cloud-basiertes Deployment bietet einen Mittelweg zwischen der Einfachheit lokaler Deployments und der Komplexität von Container-Orchestrierung. Durch den Betrieb von Docker-Containern auf VMs in der Cloud gewinnen Teams an Flexibilität, Skalierbarkeit und Zugriff auf Cloud-native Features. Gleichzeitig tragen sie die Verantwortung für Updates, Monitoring und Sicherheit. Für viele Anwendungen ist dieser Ansatz der richtige Kompromiss, bevor ein Wechsel zu vollständig verwalteten Orchestrierungslösungen erfolgt.
