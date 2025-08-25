---
title: Häufige Sicherheits-Fehlkonfigurationen
---
# Häufige Sicherheits-Fehlkonfigurationen in Docker

Docker vereinfacht die Containerisierung und den Anwendungs-Deployment-Prozess erheblich, bringt jedoch auch eigene Sicherheitsherausforderungen mit sich. Viele Risiken entstehen nicht direkt durch Docker selbst, sondern durch **Fehlkonfigurationen** bei Einrichtung und Nutzung. Das Verständnis dieser typischen Fehler und deren Vermeidung ist entscheidend für den Aufbau sicherer containerisierter Systeme.

---

## 1. Container als Root ausführen

Standardmäßig laufen Prozesse in Docker-Containern als **Root-Benutzer** innerhalb des Containers. Dies birgt ein erhebliches Risiko:

* Wenn ein Angreifer aus dem Container ausbricht, erhält er **Root-Zugriff auf das Host-System**.
* Selbst ohne Container-Ausbruch können Root-Rechte innerhalb des Containers missbraucht werden, um Dateien, Netzwerkschnittstellen oder andere Systemkomponenten zu manipulieren.

**Best Practices:**

* Immer einen **Nicht-Root-Benutzer** im Dockerfile erstellen und verwenden (`USER`).
* Docker-**User Namespaces** nutzen, um Container-Root auf einen unprivilegierten Host-User abzubilden.
* Nach dem **Prinzip der minimalen Rechtevergabe** arbeiten.

```dockerfile
# Beispiel: Nicht-Root-Benutzer anlegen und verwenden
RUN useradd -m appuser
USER appuser
```

---

## 2. Docker-Socket an Container weitergeben (`/var/run/docker.sock`)

Der Docker-Socket (`/var/run/docker.sock`) gewährt Root-Zugriff auf den Docker-Daemon. Ein Container mit Zugriff auf diesen Socket kann:

* Andere Container starten oder stoppen.
* Host-Volumes mounten.
* Potenziell die vollständige Kontrolle über den Host übernehmen.

Dies ist eine der **gefährlichsten Fehlkonfigurationen**.

**Best Practices:**

* Den Docker-Socket niemals in Container mounten, außer es ist absolut notwendig.
* Falls Zugriff benötigt wird (z. B. in CI/CD-Pipelines):

  * Einen **Socket-Proxy** nutzen (z. B. `tecnativa/docker-socket-proxy`).
  * Rechte stark einschränken und Container in einem sicheren Netzwerk isolieren.

---

## 3. Unverifizierte Images von Docker Hub nutzen

Docker Hub ist ein riesiges Registry, aber nicht alle Images sind vertrauenswürdig. Risiken umfassen:

* Versteckte Malware oder Kryptominer.
* Veraltete Images mit ungepatchten Sicherheitslücken.
* Manipulierte Images mit irreführenden Namen.

**Best Practices:**

* **Offizielle Images** oder solche von vertrauenswürdigen Anbietern bevorzugen.
* **Image-Signing** (Docker Content Trust / Notary) nutzen, um Authentizität sicherzustellen.
* Images regelmäßig scannen mit Tools wie:

  * `docker scan`
  * **Trivy**
  * **Clair**

---

## 4. Unsicherer Image-Build-Prozess

Die Dockerfile-Befehle beeinflussen sowohl Funktionalität als auch Sicherheit. Häufige Fehler sind:

* **`ADD` anstelle von `COPY` nutzen**:
  `ADD` hat Zusatzfunktionen (wie das Herunterladen von Dateien über URLs oder das automatische Entpacken von Archiven), die unbeabsichtigt Risiken einführen können.
  In den meisten Fällen ist `COPY` sicherer und vorhersehbarer.

* **Geheimnisse einbetten**:
  Manche Entwickler speichern API-Keys, Tokens oder Passwörter direkt im Dockerfile – diese bleiben in der Image-Historie sichtbar.

**Best Practices:**

* `COPY` verwenden, außer wenn `ADD`-Funktionalität ausdrücklich benötigt wird.
* Dockerfiles minimalistisch, übersichtlich und prüfbar halten.
* Keine Geheimnisse in Builds speichern – stattdessen **Docker Secrets** oder externe Secret Manager verwenden.

```dockerfile
# Bessere Praxis: COPY statt ADD verwenden
COPY ./app /usr/src/app
```

---

## 5. Ressourcenlimits vergessen

Container teilen sich die Ressourcen des Hosts. Ohne Limits kann ein einzelner Container übermäßig CPU, Speicher oder I/O beanspruchen – was zu einem **Denial of Service (DoS)** auf dem Host führt.

**Best Practices:**

* Immer **CPU- und Speicherlimits** in Compose-Dateien, Kubernetes-Manifests oder Docker-Run-Kommandos setzen.
* **Control Groups (cgroups)** nutzen, um Ressourcennutzung durchzusetzen.

**Beispiel mit Docker Compose:**

```yaml
services:
  app:
    image: my-app
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: "512M"
```

---

# Zusammenfassung

Das Vermeiden von Sicherheits-Fehlkonfigurationen ist genauso wichtig wie das Schreiben von sicherem Code. Die häufigsten Stolperfallen in Docker sind:

1. Container als Root ausführen.
2. Docker-Socket an Container weitergeben.
3. Unverifizierte Images von Docker Hub nutzen.
4. Unsichere Dockerfile-Praktiken (`ADD`-Missbrauch, Secrets einbetten).
5. Vergessen, Ressourcenlimits zu setzen.

Durch die Anwendung von Best Practices – wie dem Einsatz von Nicht-Root-Benutzern, verifizierten Images, sicheren Dockerfile-Anweisungen und Ressourcenkontrollen – lässt sich die Angriffsfläche containerisierter Anwendungen erheblich reduzieren.
