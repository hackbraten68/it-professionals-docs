---
title: Docker Container Register
---
# Docker Container Registry

## Einführung in Docker Container Registry

Eine **Docker Container Registry** ist ein Dienst, der Docker-Images speichert und verteilt.  
Sie fungiert als zentralisiertes Repository, in dem Entwickler Container-Images hochladen (push) und herunterladen (pull) können, um sie in verschiedenen Umgebungen wiederzuverwenden.  

- **Docker Hub** ist die standardmäßige öffentliche Registry von Docker.  
- Registries unterstützen die Versionierung von Images über **Tags**.  
- Registries ermöglichen Zusammenarbeit, Portabilität und Konsistenz zwischen Entwicklung, Test und Produktion.  

**Wichtige Vorteile:**

- Effizientes Teilen von Anwendungs-Images  
- Vereinfachte Deployment-Workflows  
- Integration in CI/CD-Pipelines  
- Caching und Versionskontrolle für Images  

---

## Öffentliche vs. Private Registries

### Öffentliche Registries

- Beispiele: **Docker Hub**, **GitHub Container Registry (GHCR)**, **Google Container Registry (GCR)**, **Amazon Elastic Container Registry (ECR)**  
- Für die Allgemeinheit zugänglich (Authentifizierung für Push-Vorgänge meist erforderlich).  
- Geeignet für Open-Source-Projekte oder weit verbreitete Basis-Images.  
- Begrenzte Kontrolle über Speicher und Zugriff.  

### Private Registries

- Bieten kontrollierten Zugriff auf Images innerhalb einer Organisation.  
- Können von Cloud-Anbietern (z. B. AWS ECR, Azure Container Registry, Google Artifact Registry) oder selbst gehostet bereitgestellt werden.  
- Erlauben **feingranulare Zugriffssteuerung**, Auditing und Integration in interne Workflows.  
- Ideal für proprietäre Anwendungen und sensible Umgebungen.  

---

## Registry-Architektur und Komponenten

Eine Docker-Registry besteht aus mehreren Bausteinen:

1. **Registry-Server**  
   - Zentrale Komponente, die Images speichert und bereitstellt.  
   - Stellt eine API für Push/Pull-Anfragen bereit.  

2. **Repository**  
   - Sammlung verwandter Images, identifiziert durch einen Namen.  
   - Enthält mehrere Versionen (Tags).  

3. **Tags**  
   - Menschlich lesbare Labels für spezifische Image-Versionen.  
   - Beispiel: `myapp:1.0`, `myapp:latest`.  

4. **Image-Manifest**  
   - Metadaten über Image-Layer und Konfiguration.  
   - Stellt sicher, dass konsistent die richtigen Images geladen werden.  

5. **Authentifizierung & Autorisierung**  
   - Steuerung, welche Benutzer oder Dienste Zugriff haben.  
   - Oft integriert mit externen Identitätsprovidern (LDAP, OAuth, Cloud IAM).  

---

## Arbeiten mit Registries – Docker CLI Workflow

### Herunterladen eines Images

```bash
docker pull nginx:latest
```

* Lädt das angegebene Image aus der Registry herunter.
* Standardmäßig wird Docker Hub genutzt, wenn keine Registry angegeben ist.

### Hochladen eines Images

```bash
docker tag myapp:1.0 myregistry.com/myapp:1.0
docker push myregistry.com/myapp:1.0
```

* **Tagging** ordnet das Image einem Registry-Pfad zu.
* **Push** lädt das Image in die Registry hoch.

### Anmeldung

```bash
docker login myregistry.com
```

* Authentifiziert den Benutzer per Benutzername/Passwort oder Token.

### Images suchen (nur Docker Hub)

```bash
docker search alpine
```

**Workflow-Zusammenfassung:**

1. Image lokal mit `docker build` erstellen.
2. Das Image mit registry/repository\:tag versehen.
3. Bei der Registry anmelden.
4. Image hochladen (push).
5. Auf anderen Systemen das Image herunterladen (pull) und einsetzen.

---

## Einrichtung einer selbstgehosteten privaten Registry

### Nutzung des offiziellen Registry-Images

```bash
docker run -d -p 5000:5000 --name registry registry:2
```

* Startet eine private Registry auf `localhost:5000`.

### Push in die private Registry

```bash
docker tag myapp:1.0 localhost:5000/myapp:1.0
docker push localhost:5000/myapp:1.0
```

### Speicher konfigurieren

* Standardmäßig speichert die Registry Daten im Container-Dateisystem.
* Empfehlung: Persistente Volumes einbinden oder Anbindung an Objektspeicher (z. B. S3, GCS).

### Authentifizierung & TLS hinzufügen

* `htpasswd` für Basis-Authentifizierung einsetzen.
* TLS-Zertifikate konfigurieren, um Kommunikation abzusichern.

**Best Practice:** In Produktionsumgebungen immer **HTTPS** aktivieren.

---

## Erweiterte Features und Integrationen

1. **Content Trust & Image-Signierung**

   * Docker Content Trust (DCT) stellt die Integrität von Images sicher.
   * Images werden kryptografisch signiert.

2. **Schwachstellen-Scanning**

   * Registries wie Docker Hub, Harbor oder AWS ECR bieten integrierte Security-Scans.
   * Erkennt veraltete Pakete oder bekannte CVEs.

3. **Automatisierte Builds & CI/CD**

   * Integration in Pipelines für automatische Image-Builds.
   * Beispiel: GitHub Actions → Build → Push → Deploy.

4. **Replikation & Caching**

   * Enterprise-Registries (Harbor, Artifactory) unterstützen Spiegelung.
   * Reduziert Latenzen und Abhängigkeit von externen Registries.

5. **Zugriffskontroll-Policies**

   * Detaillierte Berechtigungen für Nutzer und Teams.
   * Beispiel: Read-only für Entwickler, Write-Access für CI/CD-Systeme.

---

## Sicherheits-Best Practices

1. **Private Registries für sensible Workloads nutzen**

   * Verhindert das versehentliche Veröffentlichen sensibler Images.

2. **TLS/SSL aktivieren**

   * Immer verschlüsselte Kommunikation zwischen Client und Registry.

3. **Authentifizierung und Autorisierung erzwingen**

   * Zugriff auf Push/Pull nur für autorisierte Benutzer oder Dienste.

4. **Regelmäßiges Schwachstellen-Scanning**

   * Sicherheitsprobleme frühzeitig erkennen.

5. **Image-Signierung einsetzen**

   * Sicherstellen, dass Images nicht manipuliert wurden.

6. **Prinzip der minimalen Rechte**

   * Nur notwendige Berechtigungen an Benutzer und Automatisierungssysteme vergeben.

7. **Registry aktuell halten**

   * Regelmäßig Updates und Patches einspielen, um Sicherheitslücken zu schließen.

---

## Fazit

Eine Docker Container Registry ist ein zentrales Element moderner containerisierter Workflows.
Mit Wissen über Architektur, Workflows, erweiterte Features und Sicherheitspraktiken können Teams robuste, sichere und skalierbare Pipelines aufbauen.
So wird eine zuverlässige Image-Verteilung über Entwicklung, Test und Produktion hinweg sichergestellt.
