---
title: Secrets Management
---
# Secrets Management in Docker

Die richtige Verwaltung von Secrets ist ein zentraler Aspekt der Containersicherheit. Zu den **Secrets** zählen **Passwörter, API-Keys, Zertifikate, Datenbank-Credentials und Tokens**. Ein unsachgemäßer Umgang kann zu **schweren Sicherheitsvorfällen** führen, wie z. B. unbefugtem Zugriff auf Datenbanken, Services oder ganze Infrastrukturen.

Dieses Kapitel behandelt Best Practices für das **Secrets Management in Docker**, zeigt typische Fehler auf und stellt sichere Vorgehensweisen vor.

---

## Keine Secrets in Images speichern

Ein häufiger, aber gefährlicher Fehler besteht darin, Secrets direkt in **Dockerfiles** oder resultierende **Container-Images** einzubetten.

### Warum das riskant ist:

* **Image-Layer sind permanent**: Jede Dockerfile-Anweisung erzeugt einen Layer. Selbst wenn ein Secret später entfernt wird, kann es in älteren Layern sichtbar bleiben.
* **Öffentliche Distribution**: Wird ein Image in ein Registry (z. B. Docker Hub) hochgeladen, können Secrets von jedem eingesehen werden.
* **Versionskontrolle**: Dockerfiles werden häufig in Git gespeichert. Fest eingetragene Secrets können dadurch in Commits oder Pull Requests landen.

### Beispiel (so **nicht** machen):

```dockerfile
FROM node:18
ENV DB_PASSWORD=mysecretpassword
```

Dieses Vorgehen macht das Secret sowohl in den **Image-Metadaten** als auch in den **Umgebungsvariablen** sichtbar.

✅ **Best Practice**: Secrets **nicht ins Image packen**, sondern erst zur Laufzeit bereitstellen – z. B. über Umgebungsvariablen, externe Dateien oder Secret Manager.

---

## Docker Secrets nutzen (nur Swarm)

Docker Swarm bietet ein **integriertes Secrets Management**, mit dem sich sensible Informationen sicher handhaben lassen.

### Wichtige Eigenschaften:

* Secrets werden im **Raft-Log** gespeichert, verschlüsselt im Ruhezustand und während der Übertragung.
* Container greifen auf Secrets über **in-Memory-Dateien** zu (`/run/secrets/<secret_name>`).
* Nur Container, die explizit ein Secret anfordern, erhalten Zugriff darauf.

### Beispiel: Secret erstellen und nutzen

```bash
# Secret aus einer Datei erstellen
echo "supersecret" | docker secret create db_password -

# Service mit Secret deployen
docker service create \
  --name myapp \
  --secret db_password \
  myimage:latest
```

Im Container ist das Secret verfügbar über:

```bash
cat /run/secrets/db_password
```

⚠️ **Einschränkung**: Docker Secrets funktionieren nur in **Swarm-Umgebungen**. In klassischem Docker Compose (ohne Swarm) sind sie nicht verfügbar.

---

## Externe Secret Manager nutzen

Für **Produktivumgebungen** oder beim Einsatz von **Kubernetes** oder **Standalone-Docker** sind externe Secret-Management-Lösungen oft die bessere Wahl. Sie bieten stärkere Sicherheit, Rotation, Auditing und Cloud-Integration.

### Gängige Optionen:

#### 1. **HashiCorp Vault**

* Open-Source-Lösung für zentrales Secret Management.
* Unterstützt **dynamische Secrets** (z. B. automatische Erstellung temporärer Datenbank-Credentials).
* Integration mit Docker via:

  * Volume Mounts
  * API-Aufrufe beim Container-Start
  * Vault Agent Sidecar

#### 2. **AWS Secrets Manager**

* Cloud-Dienst zur sicheren Speicherung und Rotation von Secrets.
* Integriert mit **IAM** für feingranulare Zugriffskontrolle.
* Container können Secrets über AWS SDK oder ECS Task Definitions abrufen.

#### 3. **SOPS + Volume Mount**

* [Mozilla SOPS](https://github.com/mozilla/sops) erlaubt die **Verschlüsselung von Konfigurationsdateien** (YAML, JSON, ENV).
* Secrets bleiben verschlüsselt in Git und werden nur zur Laufzeit entschlüsselt.
* Beispiel-Workflow:

  * `config.enc.yaml` im Git-Repo speichern
  * Bei Containerstart entschlüsseln und als Volume mounten
  * Datei ins Container-Dateisystem einbinden

---

## Best Practices für Secrets Management

1. **Prinzip der minimalen Rechte**: Nur Services/Container, die ein Secret wirklich benötigen, sollen Zugriff haben.
2. **Secrets regelmäßig rotieren**: Besonders API-Keys und Datenbank-Passwörter.
3. **Zugriffe auditieren**: Tools wie Vault oder AWS Secrets Manager protokollieren Zugriffe.
4. **Keine Secrets über Umgebungsvariablen in Produktion**: Besser sind Datei-Mounts, da Variablen in Logs und Prozesslisten sichtbar sein können.
5. **Versionskontrolle sicher nutzen**: Niemals Secrets direkt in Git einchecken, auch nicht verschlüsselt, ohne klare Rotationsrichtlinien.

---

## Zusammenfassung

* **Keine Secrets in Docker-Images ablegen** – sie bleiben dauerhaft sichtbar.
* **Docker Secrets nutzen**, wenn man mit Swarm arbeitet.
* **Externe Secret Manager einsetzen** (Vault, AWS Secrets Manager, SOPS) für skalierbare, revisionssichere Lösungen.
* Immer **Best Practices** einhalten: Least Privilege, Rotation, Auditing, sichere Speicherung.

Ein sauberes Secrets Management ist ein **unverzichtbarer Bestandteil von Container-Sicherheit** und schützt sensible Informationen in **Dev, Staging und Production**.
