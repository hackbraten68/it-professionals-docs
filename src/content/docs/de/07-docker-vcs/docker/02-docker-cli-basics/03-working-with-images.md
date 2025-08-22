---
title: Arbeiten mit Images (Docker CLI)
audience: Lernende (Anfänger → Fortgeschrittene)
prereqs: Docker installiert, grundlegende Terminalkenntnisse
outcomes:
  - Verstehen, wie Docker-Images benannt, gespeichert und identifiziert werden.
  - Images suchen, herunterladen (pull), auflisten, taggen, inspizieren und deren Historie anzeigen.
  - Images in Registries hochladen und lokalen Speicherplatz sicher aufräumen.
  - Mit Plattformen/Architekturen, Digests und Image-Exports arbeiten.
  - Best Practices für Sicherheit, Caching und Organisation anwenden.
---

## 1. Grundkonzepte & Mentales Modell

**Image**  
Ein schreibgeschütztes, inhaltsadressiertes Paket aus Dateisystem-Layern + Metadaten (Config, Env, Entrypoint). Images sind unveränderlich und werden über **Name:Tag** (menschlich lesbar) oder **Digest** (kryptografisch eindeutig) referenziert.

**Registry → Repository → Image**

- **Registry**: Server, der Images speichert (z. B. `docker.io`, `ghcr.io`, `registry.example.com`).  
- **Repository**: Sammlung verwandter Images unter einem Namen (z. B. `library/redis`).  
- **Image-Referenz**: `REGISTRY/REPO:TAG` (z. B. `docker.io/library/redis:7`).  
- **Digest**: `@sha256:<hash>` identifiziert den Inhalt eindeutig und unveränderlich (z. B. `redis@sha256:abcd...`). Pulls per Digest garantieren Byte-genaue Übereinstimmung.

**Layer & Caching**  
Images bestehen aus mehreren Schichten (Layers). Schichten werden über Tags/Repositories hinweg wiederverwendet, wenn der Inhalt identisch ist. Das spart Speicher und beschleunigt Pulls/Builds.

---

## 2. Suchen & Herunterladen (Pull)

### 2.1 Auf Docker Hub suchen

```bash
docker search redis
```

**Funktion**: Fragt Docker Hub nach Repositories ab, die `redis` enthalten.
**Tipps**:

* Offizielle Images erscheinen mit dem Status `OFFICIAL` (z. B. `redis` unter `library/`).
* Herausgeber prüfen (Sicherheit, Support).
* Beschreibungen/Tags auf der Registry-Webseite lesen.

### 2.2 Ein Image herunterladen

```bash
docker pull redis:7
```

**Hinweise**:

* Ohne Tag wird `:latest` verwendet (nicht für Produktion empfohlen).
* Pull per **Digest** garantiert exakten Inhalt:

  ```bash
  docker pull redis@sha256:<digest>
  ```
* Multi-Arch-Images: Standardmäßig lädt Docker die passende Variante für das Hostsystem. Überschreiben mit:

  ```bash
  docker pull --platform linux/arm64 redis:7
  ```

**Troubleshooting**:

* **Auth-Fehler**: zuerst `docker login` für die Registry.
* **Rate Limits** (öffentliche Registries): einloggen, Mirror nutzen oder privaten Cache einrichten.

---

## 3. Auflisten, Taggen & Benennen

### 3.1 Lokale Images anzeigen

```bash
docker images
docker images --digests
docker image ls --filter reference='redis:*'
```

**Wichtig**:

* Spalten: `REPOSITORY`, `TAG`, `IMAGE ID`, `CREATED`, `SIZE`.
* `--digests` zeigt den Content-Hash; verschiedene Tags können auf denselben Digest zeigen.

### 3.2 Ein bestehendes Image taggen

```bash
docker tag redis:7 myrepo/redis:7-custom
```

**Warum taggen?**

* Um in eine eigene Registry zu pushen.
* Um semantische Bedeutung hinzuzufügen (z. B. `:7.2.5`, `:prod-2025-08-18`).
* Wichtiger Hinweis: Tagging **dupliziert keine Daten**, sondern erstellt nur eine neue Referenz.

**Namensregeln**:

* Kleinbuchstaben verwenden, `/` für Namespace (z. B. `org/app`).
* Registry mit angeben, wenn nicht Docker Hub (z. B. `registry.example.com/team/app:1.0`).

---

## 4. Inspizieren & Historie

### 4.1 Metadaten inspizieren

```bash
docker inspect redis:7
```

**Ergebnisse**:

* **Config**: `Env`, `Entrypoint`, `Cmd`, Ports, Arbeitsverzeichnis, Benutzer.
* **RootFS**: Layer (Diff-IDs).
* **RepoDigests**: unveränderliche Digest-Referenzen, um Deployments zu fixieren.

### 4.2 Layer-Historie anzeigen

```bash
docker history redis:7
```

Zeigt den Befehl jedes Layers (falls verfügbar) und dessen Größe. Nützlich, um:

* Nachzuvollziehen, **wie** ein Image gebaut wurde.
* Große Layer für Optimierungen zu identifizieren.
* Versehentlich eingebaute Geheimnisse aufzuspüren (vermeiden!).

---

## 5. Push in Registries

### 5.1 Login, Tag, Push

```bash
docker login myregistry.example.com
docker tag redis:7 myregistry.example.com/team/redis:7-custom
docker push myregistry.example.com/team/redis:7-custom
```

**Voraussetzungen**:

* Schreibrechte für das Ziel-Repository.
* Image-Name muss vollständig mit Registry-Host angegeben werden, wenn nicht Docker Hub.

**Best Practices**:

* **Unveränderliche Versionstags** (z. B. `1.2.3`) für Deployments verwenden.
* Zusätzlich einen **beweglichen Tag** (`1.2`, `1`, `stable`) pflegen, den man bei Bedarf weiterzieht.
* Zur Reproduzierbarkeit und Sicherheit den **Digest** nach Push notieren/fixieren.

---

## 6. Aufräumen & Speicherhygiene

### 6.1 Spezifisches Image löschen

```bash
docker rmi myrepo/redis:7-custom
```

* Fehlschlag, wenn Container davon abhängen. Zuerst Container entfernen oder `--force` (mit Vorsicht).

### 6.2 Ungenutzte Images aufräumen

```bash
docker image prune          # dangling (ungetaggte) Images
docker image prune -a       # alle nicht genutzten Images
```

**Hinweise**:

* **Dangling** = meist Zwischenlayer, die keinen Tag mehr haben.
* `-a` entfernt **alle** Images ohne Container-Referenz. Vorher `docker ps -a` prüfen.

### 6.3 Speicherübersicht

```bash
docker system df
docker system df -v
```

Zeigt, welche Images/Volumes/Container Speicher belegen und wie Layer geteilt werden.

---

## 7. Arbeiten mit Plattformen & Manifests (Multi-Arch)

**Warum wichtig**: ARM64 (z. B. Apple Silicon, Raspberry Pi) vs AMD64 (übliche Server).

* Für spezifische Plattform pullen:

  ```bash
  docker pull --platform linux/arm64 alpine:3.20
  ```

* Multi-Arch-Manifest inspizieren (nur lesen):

  ```bash
  docker manifest inspect redis:7
  ```

  (Zeigt, welche Architekturen/OS-Varianten verfügbar sind.)

> Multi-Arch-Images bauen/veröffentlichen erfolgt meist mit Buildx; hier Fokus auf **Verbrauch**.

---

## 8. Erweiterte Image-Operationen

### 8.1 Pull per Digest & Deployments fixieren

```bash
docker pull redis@sha256:<digest>
docker run redis@sha256:<digest>
```

**Vorteil**: Exakt gleicher Inhalt in allen Umgebungen.

### 8.2 Images speichern/laden (offline, Air-Gap)

```bash
docker save -o redis7.tar redis:7
docker load -i redis7.tar
```

* **save/load** für **Images**.
* Vergleich mit Container **export/import** (nur Filesystem, keine Image-Metadaten):

  ```bash
  docker export <container> -o rootfs.tar
  docker import rootfs.tar myrepo/rootfs:raw
  ```

### 8.3 Digest lokal anzeigen

```bash
docker inspect --format='{{index .RepoDigests 0}}' redis:7
```

(Falls vorhanden; sonst erst pull oder push, um Digest zu erhalten.)

---

## 9. Sicherheit & Herkunft (Operator-Sicht)

* **Publisher verifizieren**: Offizielle/verifizierte Images bevorzugen.
* **Minimale Base-Images**: `-slim` oder `alpine` nutzen, wenn passend; auf glibc vs musl achten.
* **In Produktion per Digest fixieren**: verhindert unbemerkte Updates.
* **CVEs scannen** (Beispiel mit Docker Scout CLI):

  ```bash
  docker scout cves redis:7
  ```

  (Oder Scanner in CI-Pipeline integrieren.)
* **Non-root User** bevorzugen, um Angriffsfläche zu minimieren.
* **Keine Secrets ins Image** einbauen; stattdessen Secrets-Management zur Laufzeit.

---

## 10. Häufige Fehler & Lösungen

* **`pull access denied` / `repository does not exist`**
  → Schreibweise/Tag prüfen, `docker login` durchführen.

* **`denied: requested access to the resource is denied` (push)**
  → Keine Rechte; Admin kontaktieren oder Namespace prüfen.

* **`no space left on device`**
  → `docker system df`, dann `docker image prune`, ungenutzte Container/Volumes löschen oder Speicher erweitern.

* **Falsche Architektur geladen**
  → `--platform` beim Pull/Run nutzen; prüfen, ob Image diese Architektur bereitstellt.

* **Tags überschreiben Erwartungen**
  → Tags sind veränderlich; Digests nutzen für garantierte Unveränderlichkeit.

---

## 11. Praktischer Ablauf (End-to-End)

1. **Image finden**

   ```bash
   docker search redis
   ```

2. **Spezifische Major-Version pullen**

   ```bash
   docker pull redis:7
   ```

3. **Auflisten & Digest prüfen**

   ```bash
   docker images --digests | grep redis
   docker inspect --format='{{json .Config.Env}}' redis:7 | jq .
   ```

4. **Für eigene Registry retaggen**

   ```bash
   docker tag redis:7 registry.example.com/course/redis:7.2.5
   ```

5. **Login & Push**

   ```bash
   docker login registry.example.com
   docker push registry.example.com/course/redis:7.2.5
   ```

6. **Deployment auf Digest fixieren**
   Nach dem Push Digest notieren und so deployen:

   ```bash
   docker pull registry.example.com/course/redis@sha256:<digest>
   docker run -d --name cache registry.example.com/course/redis@sha256:<digest>
   ```

7. **Aufräumen**

   ```bash
   docker image prune
   docker system df
   ```

---

## 12. Cheat Sheet (CLI-Kurzreferenz)

```bash
# Suchen & Pull
docker search <term>
docker pull [--platform linux/arm64] <repo[:tag]|@digest>

# Auflisten & Taggen
docker images [--digests]
docker image ls --filter reference='<pattern>'
docker tag <src[:tag]> <dest[:tag]>

# Inspizieren & Historie
docker inspect <image>
docker history <image>

# Push (nach docker login)
docker push <registry/repo:tag>

# Entfernen & Aufräumen
docker rmi <image>
docker image prune          # dangling
docker image prune -a       # ungenutzt
docker system df [-v]       # Speicherübersicht

# Speichern / Laden (offline)
docker save -o image.tar <image>
docker load -i image.tar

# Manifest / Plattformen
docker manifest inspect <image[:tag]|@digest>
```

---

## 13. Best Practices Zusammenfassung

* In Produktion **immutable References** (Digests) verwenden.
* **Klare Tagging-Strategie** pflegen (Semver + bewegliche Tags).
* Basis-Images regelmäßig **scannen** und **updaten**.
* **Minimale Images** nutzen und Container als **Non-root** laufen lassen.
* Images **klein halten** (weniger Layer, Build-Tools entfernen).
* `docker system df` nutzen und regelmäßig **prunen** (v. a. in CI-Build-Hosts).
