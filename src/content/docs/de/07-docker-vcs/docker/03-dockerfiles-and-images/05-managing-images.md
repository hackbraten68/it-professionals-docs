---
title: Docker Images verwalten
---

## Einführung

Docker-Images sind die **Bausteine von Containern**. Sie bündeln Anwendungscode, Abhängigkeiten und Konfigurationsumgebungen in einem einzigen, portablen Artefakt.  
Eine effektive Verwaltung dieser Images ist entscheidend, um Konsistenz sicherzustellen, Speicherplatz zu sparen und reibungslose Deployments in verschiedenen Umgebungen zu ermöglichen.

Dieser Leitfaden erklärt, wie man Images auflistet, taggt, pusht, pullt und entfernt, sowie Best Practices für das Image-Lifecycle-Management.

---

## Images auflisten

Um alle lokal verfügbaren Images anzuzeigen:

```bash
docker images
```

* **Repository**: Der Name des Images (z. B. `nginx`).
* **Tag**: Die Version oder Kennzeichnung (z. B. `1.25`, `latest`).
* **Image ID**: Eine eindeutige Kennung des Images.
* **Created**: Zeitpunkt der Erstellung des Images.
* **Size**: Speicherplatz, den das Image belegt.

**Beispielausgabe:**

```bash
REPOSITORY          TAG       IMAGE ID       CREATED        SIZE
nginx               latest    605c77e624dd   2 weeks ago    141MB
ubuntu              22.04     9873176a8ff5   3 months ago   77.8MB
```

---

## Images taggen

Tags helfen dabei, Images zu versionieren und zu organisieren. Standardmäßig wird ein Image mit `latest` getaggt, wenn kein anderer Tag angegeben ist.

```bash
docker tag myapp:latest registry.example.com/myapp:v1.0
```

* `myapp:latest`: Der lokale Image-Name und Tag.
* `registry.example.com/myapp:v1.0`: Die neue Referenz, die die Registry-Adresse, den Repository-Namen und die Versionsmarkierung enthält.

**Warum Tags wichtig sind:**

* Versionskontrolle für Deployments (`v1.0`, `v1.1`, etc.).
* Nutzung in verschiedenen Umgebungen (`dev`, `staging`, `prod`).
* Kennzeichnung, ob das Image lokal oder in einer Registry liegt.

---

## Images in eine Registry pushen

Um Images zu teilen, pusht man sie in eine Container-Registry (z. B. Docker Hub, GitHub Container Registry, AWS ECR).

```bash
docker push registry.example.com/myapp:v1.0
```

**Schritte:**

1. Anmeldung bei der Registry (`docker login registry.example.com`).
2. Das Image mit dem Registry-Pfad taggen.
3. Das Image pushen.

**Best Practices:**

* Private Registries für sensible Anwendungen verwenden.
* Pushes in CI/CD-Pipelines automatisieren.

---

## Images aus einer Registry pullen

Um Images von Docker Hub oder einer anderen Registry herunterzuladen:

```bash
docker pull ubuntu:22.04
```

* Wird kein Tag angegeben, verwendet Docker automatisch `latest`.
* Gepullte Images können sofort genutzt werden, um Container zu starten.

**Beispiele:**

* `docker pull nginx` → lädt die neueste Version.
* `docker pull postgres:15` → lädt PostgreSQL Version 15.

---

## Images entfernen

Um Speicherplatz freizugeben oder nicht mehr benötigte Versionen zu löschen:

```bash
docker rmi myapp:latest
```

* `rmi` steht für „remove image“.
* Mit `-f` kann das Entfernen erzwungen werden, wenn das Image von gestoppten Containern genutzt wird.
* Ungenutzte (dangling) Images entfernen:

```bash
docker image prune
```

**Achtung:**
Nur Images löschen, die nicht mehr für laufende Container benötigt werden.

---

## Weitere nützliche Befehle

* **Details eines Images anzeigen:**

  ```bash
  docker inspect myapp:v1.0
  ```

  Zeigt Metadaten wie Layer, Umgebungsvariablen und Architektur.

* **Image-Historie (Layer) anzeigen:**

  ```bash
  docker history myapp:v1.0
  ```

  Zeigt die Befehle, die zum Erstellen des Images verwendet wurden.

* **Alle ungenutzten Images, Container, Netzwerke und Caches aufräumen:**

  ```bash
  docker system prune
  ```

---

## Best Practices beim Verwalten von Images

1. **Versions-Tags verwenden** anstelle von `latest`, um Reproduzierbarkeit sicherzustellen.
2. **Images klein halten** durch die Wahl schlanker Basis-Images (z. B. `alpine`).
3. **Regelmäßig ungenutzte Images bereinigen**, um Speicherplatz zu sparen.
4. **Registries absichern** durch Authentifizierung und TLS.
5. **Builds und Pushes automatisieren** in CI/CD-Pipelines, um Konsistenz zu gewährleisten.

---

## Zusammenfassung

* **Auflisten** hilft, lokale Images im Überblick zu behalten.
* **Taggen** organisiert Versionen und Registry-Ziele.
* **Push und Pull** ermöglichen das Teilen und Deployment in verschiedenen Umgebungen.
* **Entfernen** von Images hält das System schlank und effizient.
* **Best Practices** sichern Stabilität, Sicherheit und Ressourcenschonung.

Wer diese Befehle und Vorgehensweisen beherrscht, kann Docker-Images effektiv über den gesamten Software-Lebenszyklus hinweg verwalten.
