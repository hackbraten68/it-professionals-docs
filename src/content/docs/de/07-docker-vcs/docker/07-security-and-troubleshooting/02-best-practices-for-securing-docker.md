---
title: Best Practices zur Absicherung von Docker
---
# Best Practices zur Absicherung von Docker

Die Absicherung von Docker-Containern erfordert einen proaktiven Ansatz. Container sind leichtgewichtig und effizient, können jedoch bei falscher Konfiguration erhebliche Sicherheitsrisiken mit sich bringen. Die folgenden Best Practices helfen dabei, Schwachstellen zu reduzieren und containerisierte Umgebungen zu härten.

---

## Verwende minimale Basis-Images

Ein kleineres Image bedeutet eine kleinere Angriffsfläche.

* **Warum es wichtig ist:** Große Basis-Images enthalten oft unnötige Pakete und Bibliotheken, die das Angriffspotenzial vergrößern.
* **Empfehlung:**

  * Nutze leichte Images wie **Alpine Linux** oder **Distroless**.
  * Diese Images verzichten auf Paketmanager, Shells oder andere Tools, die Angreifer ausnutzen könnten.
  * Überprüfe die Integrität von Images mit kryptografischen Signaturen (`docker pull alpine@sha256:<digest>`).

**Beispiel:**

```dockerfile
# Statt eines großen Basis-Images wie Ubuntu
FROM ubuntu:20.04

# Ein minimalistisches Basis-Image
FROM alpine:3.19
```

---

## Entferne unnötige Privilegien

Container sollten nur mit den **nötigsten Berechtigungen** laufen.

* **Warum es wichtig ist:** Container im `--privileged`-Modus haben praktisch Vollzugriff auf den Host und verlieren ihre Isolierung.
* **Empfehlung:**

  * Vermeide `--privileged`, außer es ist absolut erforderlich.
  * Nutze `--cap-drop`, um unnötige Linux-Capabilities zu entfernen.
  * Verwende `--cap-add` nur für exakt benötigte Berechtigungen.

**Beispiel:**

```bash
# Alle Fähigkeiten entfernen und nur NET_BIND_SERVICE hinzufügen
docker run \
  --cap-drop ALL \
  --cap-add NET_BIND_SERVICE \
  myapp:latest
```

---

## Nutze Docker User Namespaces

Das Mapping von Container-Usern auf Nicht-Root-User des Hosts verringert das Risiko von Privilegieneskalationen.

* **Warum es wichtig ist:** Standardmäßig hat der Root-User im Container auch Root-Rechte auf dem Host.
* **Empfehlung:**

  * Aktiviere **User Namespaces**, damit Container-Root auf einen Nicht-Root-User des Hosts gemappt wird.
  * Lasse Anwendungen innerhalb des Containers als **Nicht-Root-User** laufen.

**Beispiel `Dockerfile`:**

```dockerfile
# Einen Nicht-Root-User anlegen
RUN adduser -D appuser
USER appuser
```

**Daemon-Konfiguration (`/etc/docker/daemon.json`):**

```json
{
  "userns-remap": "default"
}
```

---

## Aktiviere Seccomp, AppArmor oder SELinux

Mandatory Access Control (MAC)-Systeme verhindern, dass Container unautorisierte Aktionen ausführen.

* **Warum es wichtig ist:** Angreifer nutzen oft System Calls (Syscalls), um Container zu verlassen oder Privilegien zu erhöhen.
* **Empfehlung:**

  * Nutze **Seccomp-Profile**, um Syscalls einzuschränken.
  * Verwende **AppArmor** oder **SELinux**, um strikte Sicherheitsrichtlinien durchzusetzen.
  * Passe Profile an die Anforderungen deiner Workloads an.

**Beispiel (Docker mit Standard-Seccomp-Profil):**

```bash
docker run --security-opt seccomp=default.json myapp:latest
```

---

## Scanne Images regelmäßig auf Schwachstellen

Selbst minimale Images können veraltete Bibliotheken enthalten.

* **Warum es wichtig ist:** Bekannte Sicherheitslücken (CVEs) in Images sind häufige Angriffsvektoren.
* **Empfehlung:**

  * Integriere **Image-Scanning-Tools** in deine CI/CD-Pipeline.
  * Aktualisiere regelmäßig Basis-Images und Abhängigkeiten.

**Empfohlene Tools:**

* **Docker Scan** (betrieben von Snyk):

  ```bash
  docker scan myapp:latest
  ```

* **Trivy** (von Aqua Security):

  ```bash
  trivy image myapp:latest
  ```

* **Clair** (statischer Vulnerability Scanner für Container).

---

## Fazit

Die Absicherung von Docker-Umgebungen erfordert eine **Defense-in-Depth-Strategie**:

1. Starte mit minimalen Basis-Images.
2. Entferne unnötige Privilegien.
3. Verwende Nicht-Root-User und Namespaces.
4. Erzwinge Sicherheitsprofile mit Seccomp, AppArmor oder SELinux.
5. Scanne Images kontinuierlich auf Schwachstellen.

Mit diesen Maßnahmen reduzierst du die Angriffsfläche erheblich und erhöhst die Widerstandsfähigkeit deiner Containerumgebungen.
