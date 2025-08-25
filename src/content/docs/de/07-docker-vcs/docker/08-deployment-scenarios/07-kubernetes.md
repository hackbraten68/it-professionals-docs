---
title: Kubernetes (K8s)
---
# Kubernetes (K8s)

## Beschreibung

Kubernetes (oft abgekürzt als **K8s**) ist eine Open-Source-Plattform zur Orchestrierung von Containern.
Es wurde ursprünglich von Google entwickelt und wird heute von der **Cloud Native Computing Foundation (CNCF)** gepflegt.
Kubernetes automatisiert die Bereitstellung, Skalierung und Verwaltung containerisierter Anwendungen über Cluster von Maschinen hinweg.
Es bietet eine konsistente Umgebung, in der Anwendungen zuverlässig laufen – unabhängig davon, ob die Infrastruktur lokal, in der Cloud oder in hybriden Szenarien betrieben wird.

---

## Wichtige Vorteile

* **Hohe Skalierbarkeit**
  Kubernetes kann Anwendungen horizontal (mehr Container-Instanzen) oder vertikal (mehr Ressourcen pro Container) skalieren. So wird sichergestellt, dass Workloads die Nachfrage ohne manuelles Eingreifen bewältigen.

* **Selbstheilung**
  Fehlgeschlagene Container werden automatisch neu gestartet, ersetzt oder auf gesunde Knoten verschoben. Kubernetes sorgt dafür, dass der gewünschte Zustand jederzeit eingehalten wird.

* **Deklarative Konfiguration**
  Infrastruktur und Anwendungen werden mithilfe von YAML- oder JSON-Manifesten beschrieben. Dadurch sind Deployments versionskontrolliert, wiederholbar und automatisierbar.

* **Community und Ökosystem**
  Kubernetes ist eines der aktivsten Open-Source-Projekte und verfügt über eine große Auswahl an Tools, Plugins und Integrationen. Alle großen Cloud-Anbieter bieten Kubernetes-Services an.

* **Portabilität**
  Kubernetes läuft auf Public Clouds, in Rechenzentren oder lokal (z. B. mit Minikube oder Kind) – so wird Flexibilität geschaffen und Vendor Lock-in vermieden.

---

## Zentrale Konzepte

* **Cluster**: Eine Gruppe von Maschinen (Nodes), die gemeinsam Kubernetes ausführen. Besteht aus Control Plane und Worker Nodes.
* **Pods**: Die kleinste ausführbare Einheit in Kubernetes. Ein Pod enthält einen oder mehrere Container, die eng zusammenarbeiten.
* **ReplicaSets**: Stellen sicher, dass eine festgelegte Anzahl von Pod-Replikaten immer läuft.
* **Deployments**: Abstraktion über ReplicaSets, die auch Rolling Updates ermöglichen.
* **Services**: Bieten stabile Netzwerkendpunkte und machen Pods für andere Pods oder externe Clients erreichbar.
* **ConfigMaps & Secrets**: Speichern Konfigurationsdaten und sensible Informationen getrennt vom Anwendungscode.
* **Namespaces**: Logische Abgrenzungen im Cluster, um Ressourcen zu organisieren und zu isolieren.
* **Ingress**: API-Objekt, das den externen Zugriff (meist HTTP/HTTPS) auf Services steuert.

---

## Tools

* **kubectl**
  CLI-Werkzeug zur Interaktion mit Kubernetes-Clustern. Wird zum Bereitstellen, Verwalten und Überprüfen von Ressourcen genutzt.

* **Helm Charts**
  Paketmanager für Kubernetes-Anwendungen. Erlaubt die Verwaltung komplexer Deployments mit Templates und wiederverwendbaren Konfigurationen.

* **Managed Kubernetes Services**

  * **GKE (Google Kubernetes Engine)**
  * **EKS (Amazon Elastic Kubernetes Service)**
  * **AKS (Azure Kubernetes Service)**
    Cloud-Anbieter übernehmen hierbei den Betrieb der Control Plane, Upgrades und einen Teil der Administration.

* **Minikube / Kind**
  Lokale Kubernetes-Umgebungen zum Lernen und Testen, ohne Cloud-Infrastruktur.

---

## Herausforderungen und Überlegungen

* **Komplexität**
  Kubernetes ist deutlich komplexer als einfachere Orchestrierungslösungen (z. B. Docker Swarm). Schulungen und Fachwissen sind erforderlich.

* **Steile Lernkurve**
  Das Verständnis von YAML-Manifests, Netzwerken und Cluster-Operationen erfordert viel Einarbeitung und Praxis.

* **Betriebsaufwand**
  Wer eigene Kubernetes-Cluster betreibt, muss Upgrades, Sicherheit, Monitoring und Skalierung sorgfältig planen.

* **Kosten**
  Kubernetes selbst ist kostenlos, jedoch können die Infrastrukturkosten (Nodes, Storage, Netzwerk) – insbesondere bei Managed Services – hoch werden.

---

## Typische Einsatzszenarien

* **Microservices-Architekturen**: Betrieb locker gekoppelter Services mit unabhängigen Lebenszyklen.
* **CI/CD-Pipelines**: Automatisierung von Build-, Test- und Deployment-Prozessen.
* **Hybrid- oder Multi-Cloud-Betrieb**: Nahtloser Einsatz von Anwendungen über mehrere Umgebungen hinweg.
* **Big Data & Machine Learning**: Orchestrierung von Datenpipelines, Batch-Jobs und ML-Workloads.

---

## Beispiel: Einfaches Deployment

Ein einfaches `nginx`-Deployment in Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

Bereitstellen mit:

```bash
kubectl apply -f nginx-deployment.yaml
kubectl get pods
```

---

## Zusammenfassung

Kubernetes ist der **Industriestandard** für Container-Orchestrierung.
Es bietet Skalierbarkeit, Ausfallsicherheit und Flexibilität – allerdings zum Preis einer hohen Komplexität und Lernkurve.
Mit seinem deklarativen Ansatz, der starken Community und der breiten Tool-Unterstützung bildet Kubernetes das Fundament moderner Cloud-Native-Anwendungen.
