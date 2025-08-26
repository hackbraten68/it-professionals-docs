---
title: Was sind Git-Tags?
---
# Was sind Git-Tags? — Ein vollständiger, praxisnaher Leitfaden

Git **Tags** sind unveränderliche Bezeichner, die auf bestimmte Commits zeigen. Sie werden am häufigsten verwendet, um **Releases** zu markieren (z. B. `v1.0.0`, `v2.1.0-beta`), sodass man zuverlässig auf einen bestimmten Zustand des Codes verweisen kann.

---

## Warum Tags verwenden?

- **Release-Management:** Ein Commit wird als Version eingefroren (z. B. für Pakete oder Deployment).
- **Nachvollziehbarkeit & Reproduzierbarkeit:** Jederzeit den exakten Stand des veröffentlichten Codes abrufen.
- **Kommunikation:** Wichtige Meilensteine für Teammitglieder und CI/CD sichtbar machen.
- **Tool-Integration:** Viele Tools (GitHub/GitLab Releases, Changelog-Generatoren, Paket-Registries) basieren auf Tags.

---

## Arten von Tags

### 1) Lightweight Tags (leichte Tags)
- Ähnlich wie **Lesezeichen**: Nur ein Name → Commit-Hash.
- Keine Metadaten (kein Autor, kein Datum, keine Nachricht).
- Sehr schnell erstellt.

```bash
git tag v1.0.0
```

### 2) Annotated Tags (annotierte Tags)

* Ein vollständiges **Tag-Objekt** in der Git-Datenbank.
* Enthält **Autor, E-Mail, Datum, Nachricht** (optional auch GPG-Signatur).
* Für Releases empfohlen.

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

> **Empfehlung:** Verwende **annotierte Tags** für Releases. Sie enthalten wertvolle Metadaten und werden von Tools besser unterstützt.

---

## Tags erstellen

### Tag auf aktuellem `HEAD`

```bash
# Lightweight
git tag v1.0.0

# Annotiert
git tag -a v1.0.0 -m "Release v1.0.0"
```

### Tag auf einen bestimmten Commit setzen

```bash
git tag -a v1.0.0 3f1c2a9 -m "Release v1.0.0 auf Commit 3f1c2a9"
```

### Signierte (GPG) Tags

```bash
git tag -s v1.0.0 -m "Release v1.0.0 (signiert)"
# später verifizieren
git tag -v v1.0.0
```

---

## Tags ansehen & finden

### Alle Tags auflisten

```bash
git tag
```

### Filtern & sortieren

```bash
git tag --list "v1.*"
git tag --sort=-version:refname
git tag --sort=creatordate
```

### Details zu einem Tag anzeigen

```bash
git show v1.0.0
```

### Nächstes Tag zum aktuellen Commit

```bash
git describe --tags
```

---

## Tags pushen & abrufen

> Tags werden bei normalem `git push` **nicht automatisch** übertragen!

### Einzelnen Tag pushen

```bash
git push origin v1.0.0
```

### Alle lokalen Tags pushen

```bash
git push --tags
```

### Nur Tags pushen, die Commits annotieren

```bash
git push --follow-tags
```

### Tags vom Remote abrufen

```bash
git fetch --tags
```

---

## Tags löschen & verschieben (vorsichtig!)

### Lokal löschen

```bash
git tag -d v1.0.0
```

### Remote löschen

```bash
git push origin --delete v1.0.0
# oder
git push origin :refs/tags/v1.0.0
```

> **Hinweis:** Veröffentlichte Tags sollten nicht überschrieben werden. Erstelle lieber ein neues Tag (z. B. `v1.0.1`).

### Tag verschieben (nur im Notfall)

```bash
git tag -f v1.0.0 <neuer-commit>
git push origin -f v1.0.0
```

---

## Mit Tags arbeiten

Tags sind keine Branches. Beim Checkout landet man in einem **detached HEAD**:

```bash
git checkout tags/v1.0.0
# Neuen Branch daraus erstellen:
git checkout -b hotfix/v1.0.0 tags/v1.0.0
```

---

## Namenskonventionen & Versionierung

* Nutze **Semantic Versioning** (`MAJOR.MINOR.PATCH`), z. B. `v2.3.1`:

  * **MAJOR**: Inkompatible Änderungen
  * **MINOR**: Neue Features, rückwärtskompatibel
  * **PATCH**: Bugfixes, rückwärtskompatibel
* Präfix `v` ist gängige Konvention (`v1.0.0`, `v2.0.0-rc.1`).
* Vermeide Leerzeichen, halte Namen unveränderlich.

---

## Tags & Releases (Plattformen)

* **GitHub/GitLab Releases:** Erstellen aus Tags, inkl. Release-Notes und Assets.
* **Registries (npm, PyPI, Docker Hub):** Bauen oft direkt auf Tags auf.

---

## CI/CD mit Tags

* Tags können Release-Pipelines triggern.
* Beispiel (GitHub Actions):

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/build.sh
      - run: ./scripts/publish.sh
```

* Verwende `git push --follow-tags`, damit CI/CD die richtigen Versionstags erhält.

---

## Typische Workflows

* **Release-Cut:**

  1. Code nach `main` mergen
  2. Version/Changelog anpassen
  3. Annotiertes Tag setzen `vX.Y.Z`
  4. Tag pushen → CI/CD & Release starten

* **Pre-Releases:** Tags mit Suffixen: `-alpha.1`, `-beta.2`, `-rc.1`.

* **Hotfix:** Branch von `tags/vX.Y.Z`, Fix einbauen, neues Patch-Tag setzen.

---

## Häufige Stolperfallen

* **„CI hat nicht ausgelöst.“**
  → Tag nicht gepusht (`git push origin <tag>`).

* **„Mein Tag hat keine Nachricht.“**
  → Leichtes Tag statt annotiertem Tag.

* **„Im Clone fehlen Tags.“**
  → `git fetch --tags` ausführen.

* **„Tag muss geändert werden.“**
  → Neue Version setzen (`v1.0.1`), altes Tag nicht überschreiben.

---

## Kurzübersicht (Cheat Sheet)

```bash
# Erstellen
git tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git tag -s v1.0.0 -m "Release (signiert)"

# Anzeigen
git tag
git show v1.0.0
git describe --tags

# Pushen / Abrufen
git push origin v1.0.0
git push --tags
git push --follow-tags
git fetch --tags

# Löschen
git tag -d v1.0.0
git push origin --delete v1.0.0

# Checkout
git checkout tags/v1.0.0
git checkout -b hotfix/v1.0.0 tags/v1.0.0
```

---

## Best Practices (Zusammenfassung)

* Nutze **annotierte (ggf. signierte) Tags** für Releases.
* Befolge **SemVer** und verwende ein `v`-Präfix.
* Veröffentliche Tags nur einmal, **niemals nachträglich ändern**.
* Push Tags explizit (`--follow-tags` im Workflow nutzen).
* Nutze Tags, um **CI/CD automatisiert** auszulösen.

---

*Mit diesen Konventionen und Befehlen sind Tags ein zuverlässiges Fundament für Release- und Automatisierungsprozesse – leicht zu erstellen, gut dokumentierbar und ideal für reproduzierbare Softwarestände.*
