---
title: Arbeiten mit Remote-Repositories
---
# Arbeiten mit Remote-Repositories

Remote-Repositories (z. B. GitHub, GitLab, Bitbucket, selbstgehostete Git-Server) ermöglichen Zusammenarbeit, Backups, CI/CD und Code-Reviews.
Dieses Dokument erklärt, wie man ein lokales Repository mit Remotes verbindet, Änderungen synchronisiert, Branches verwaltet und Best Practices befolgt.

---

## 1) Grundlagen zu Remotes

* Ein **Remote** ist eine benannte Referenz auf ein Repository, das extern gehostet wird.
* Der Standardname für ein Remote ist meist `origin`.
* Man kann mehrere Remotes haben (z. B. `origin` für den eigenen Fork, `upstream` für das Originalprojekt).
* Lokale Branches können mit Remote-Branches **verbunden** werden, um einfacher zu synchronisieren.

Mentalmodell:

```bash
Lokales Repo (dein Rechner)  <--sync-->  Remote Repo (Server/Host)
   | Arbeitsverzeichnis
   | Index (Staging)
   | Commits (Historie)
```

---

## 2) Remotes hinzufügen & überprüfen

### Remote hinzufügen

```bash
git remote add origin https://github.com/user/repo.git
```

* `origin` ist der Standardname, aber frei wählbar.
* URL kann HTTPS oder SSH sein (siehe nächstes Kapitel).

### Remotes anzeigen

```bash
git remote -v
# Listet Remotes mit Fetch-/Push-URLs

git remote show origin
# Zeigt Details: Branches, Tracking-Infos, Push/Pull-Status
```

### Remote ändern oder löschen

```bash
git remote set-url origin https://github.com/user/neues-repo.git
git remote rename origin primary
git remote remove origin
```

---

## 3) Authentifizierung: HTTPS vs. SSH

### HTTPS

* URL-Form: `https://github.com/user/repo.git`
* Authentifizierung meist per **Personal Access Token (PAT)** oder Passwort-Manager.
* Einfach für Einsteiger, erfordert aber oft wiederholte Eingaben.

### SSH

* URL-Form: `git@github.com:user/repo.git`
* Nutzt SSH-Schlüssel (`~/.ssh/id_ed25519`).
* Einmalige Einrichtung, danach nahtlose Nutzung.

SSH-Key erstellen und bei Git-Host einfügen:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
ssh -T git@github.com
```

---

## 4) Repositories klonen

Kopiere ein Remote-Repo lokal:

```bash
git clone https://github.com/user/repo.git
cd repo
```

Optionen:

```bash
git clone --branch main --single-branch https://github.com/user/repo.git
git clone --depth 1 https://github.com/user/repo.git          # flaches Klonen
git clone --filter=blob:none https://github.com/user/repo.git # partielles Klonen
```

* **Shallow Clones** laden nur begrenzte Historie.
* **Partial Clones** laden Dateien bei Bedarf.

---

## 5) Änderungen pushen

### Erster Push (Upstream setzen)

```bash
git push -u origin main
```

* `-u` setzt den **Upstream**, sodass zukünftige `git push`/`git pull` automatisch wissen, wohin synchronisiert wird.

### Spätere Pushes

```bash
git push
```

### Neuen Branch pushen

```bash
git checkout -b feature/api
git push -u origin feature/api
```

---

## 6) Pull, Fetch und Rebase

**Wichtiger Unterschied:**

* `git fetch` holt nur Änderungen vom Remote (kein Merge).
* `git pull` = `git fetch` + **Merge oder Rebase**.

### Standard-Pull (Merge)

```bash
git pull
```

### Pull mit Rebase (sauberere Historie)

```bash
git pull --rebase
```

Standard einstellen:

```bash
git config pull.rebase true
```

---

## 7) Tracking-Branches (Upstream)

Ein **Tracking Branch** verbindet lokal und remote.

Beim ersten Push gesetzt:

```bash
git push -u origin main
```

Tracking nachträglich setzen:

```bash
git branch --set-upstream-to=origin/main main
```

Tracking anzeigen:

```bash
git branch -vv
```

---

## 8) Arbeiten mit mehreren Remotes

Typisches Open-Source-Beispiel:

```bash
git remote add upstream https://github.com/original/repo.git

git fetch upstream
git checkout main
git rebase upstream/main

git push origin main
```

---

## 9) Tags und Releases

### Tag erstellen und pushen

```bash
git tag v1.2.0
git push origin v1.2.0
```

### Annotated Tag

```bash
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin --tags
```

---

## 10) Aufräumen (Pruning)

Nicht mehr vorhandene Remote-Branches entfernen:

```bash
git fetch --prune
```

Remote-Branch löschen:

```bash
git push origin --delete feature/alt
```

---

## 11) Konflikte lösen

Typischer Ablauf:

```bash
git pull --rebase
# Konflikte bearbeiten
git add <datei>
git rebase --continue
```

Abbrechen:

```bash
git rebase --abort
```

---

## 12) Geschützte Branches & Force Push

* Wichtige Branches wie `main` sollten geschützt sein.
* Wenn Force Push nötig:

```bash
git push --force-with-lease
```

(Sicherer als `--force`.)

---

## 13) Große Dateien (Git LFS)

Große Dateien auslagern:

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
git commit -m "Große Dateien mit LFS"
git push
```

---

## 14) CI/CD und Remotes

* Push → löst CI-Pipelines aus (Build, Tests, Deploy).
* Nutze Branches + Pull Requests für Review-Prozesse.
* Keine Secrets committen → stattdessen Secret Manager verwenden.

---

## 15) Fehlerbehebung

**Auth fehlgeschlagen** → Token/SSH-Key prüfen
**404 Repository not found** → Rechte oder URL falsch
**non-fast-forward** → zuerst `git pull --rebase`

---

## 16) Best Practices

* Upstream immer setzen: `git push -u origin branch`
* Rebase bevorzugen für lineare Historie
* Alte Branches löschen (`git fetch --prune`)
* Force nur mit `--force-with-lease`
* Geheimnisse nie ins Repo committen
* CI/CD-Pipelines als Pflicht nutzen

---

## 17) Quick Reference

```bash
git remote add origin <URL>
git push -u origin <branch>
git fetch --prune
git pull --rebase
git checkout -b feature/x
git push -u origin feature/x
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
git push origin --delete feature/alt
git branch -d feature/alt
```

---

## 18) Glossar

* **Remote**: Verweis auf ein externes Repo
* **Origin**: Standardname des Hauptremotes
* **Upstream**: Ursprungs-Repository oder Tracking-Branch
* **Fetch**: Nur Änderungen herunterladen
* **Pull**: Änderungen herunterladen + integrieren
* **Push**: Eigene Commits hochladen
* **PR/MR**: Pull-/Merge-Request für Code-Review
* **Protected Branch**: Branch mit Schreibschutz-Regeln
* **Git LFS**: Erweiterung für große Dateien

---

### Minimal-Befehle aus der Eingabe

```bash
# Remote hinzufügen
git remote add origin https://github.com/user/repo.git

# Änderungen pushen
git push -u origin main

# Änderungen ziehen
git pull
```
