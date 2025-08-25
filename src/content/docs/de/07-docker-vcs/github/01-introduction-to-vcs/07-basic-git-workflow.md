---
title: Basic Git Workflow
---
# Grundlegender Git-Workflow

Ein praxisnaher, beispielbasierter Leitfaden zu den wichtigsten Git-Befehlen, die du im Alltag benötigst. Jeder Schritt erklärt, was der Befehl tut, warum er gebraucht wird, wie er funktioniert und welche typischen Stolperfallen es gibt.

---

## Übersicht

1. Repository initialisieren: `git init`  
2. Änderungen vormerken (stagen): `git add`  
3. Änderungen ins lokale Repository sichern: `git commit`  
4. Änderungen ins Remote-Repository hochladen: `git push`  
5. Änderungen aus dem Remote-Repository herunterladen: `git pull`

> Hilfreiche Zusatzbefehle: `git status`, `git log`, `git diff`, `git branch`, `git remote`, `.gitignore`.

---

## 0) Voraussetzungen (einmalige Einrichtung)

```bash
# Nutzerinformationen (Commit-Metadaten) setzen
git config --global user.name "Dein Name"
git config --global user.email "du@example.com"

# Standard-Branchnamen festlegen
git config --global init.defaultBranch main

# Nützliche Status-Hinweise aktivieren
git config --global advice.statusHints true
```

Remote-Repository hinzufügen (GitHub, GitLab etc.):

```bash
# HTTPS (einfacher Start, benötigt Token)
git remote add origin https://github.com/deinuser/dein-repo.git

# SSH (nach Einrichtung ohne Passwortabfragen)
git remote add origin git@github.com:deinuser/dein-repo.git
```

---

## 1) `git init` — Neues Repository initialisieren

**Funktion:** Erstellt ein `.git/`-Verzeichnis, das alle Versionsinformationen (Objekte, Referenzen, Konfiguration) enthält.

```bash
# Neues Repo im aktuellen Ordner starten
git init

# Oder einen neuen Ordner anlegen und initialisieren
mkdir mein-projekt && cd mein-projekt && git init
```

**Nützliche Folgeaktionen:**

* `.gitignore` erstellen, um Dateien auszuschließen:

  ```bash
  printf "node_modules/\n.DS_Store\ndist/\n.env\n" > .gitignore
  ```

* Status prüfen:

  ```bash
  git status
  ```

**Typische Fehler:**

* Git aus Versehen in einem verschachtelten Repo initialisieren. Mit
  `git rev-parse --show-toplevel` prüfen, wo das Repo-Root liegt.
* Geheimnisse versehentlich committet, weil `.gitignore` zu spät erstellt wurde.

---

## 2) `git add` — Dateien zum Commit vormerken

**Funktion:** Verschiebt Änderungen vom Arbeitsverzeichnis in den **Staging-Bereich**. Nur dort befindliche Dateien kommen in den nächsten Commit.

```bash
# Alles stagen (respektiert .gitignore)
git add .

# Einzelne Dateien stagen
git add src/app.js README.md

# Interaktiv stagen (Hunks auswählen)
git add -p
```

**Gut zu wissen:**

* `git add` ist wiederholbar; du kannst jederzeit nachstagen oder zurücknehmen.
* Dateien wieder herausnehmen:

  ```bash
  git restore --staged <datei>
  ```

**Prüfen:**

```bash
git status         # Übersicht
git diff           # Nicht vorgemerkte Änderungen
git diff --staged  # Vorgemerkte Änderungen
```

---

## 3) `git commit` — Änderungen ins lokale Repo sichern

**Funktion:** Speichert einen Schnappschuss des Staging-Bereichs als Commit mit Autor, Zeitstempel, Nachricht und Eltern-Commit(s).

```bash
# Einfacher Commit mit Nachricht
git commit -m "feat: Benutzer-Login hinzugefügt"

# Ausführlicher Commit (Editor öffnet sich)
git commit
```

**Empfohlene Commit-Struktur (Konventionell):**

```
<typ>(optional-bereich): kurze Zusammenfassung

Längere Erklärung, Motivation, Referenzen.
```

Typische Typen: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

**Commit ändern:**

```bash
git commit --amend
```

**Historie ansehen:**

```bash
git log --oneline --graph --decorate --all
```

---

## 4) `git push` — Änderungen ins Remote hochladen

**Funktion:** Sendet deine lokalen Commits ins Remote-Repository (z. B. `origin`).

```bash
# Erster Push eines neuen Branches
git push -u origin main

# Weitere Pushes
git push
```

**Hinweis:**

* `-u` speichert die Zuordnung zu Remote/Branch → danach reicht `git push`.

**Typischer Fehler:**
„non-fast-forward“: Remote enthält neue Commits → zuerst `git pull --rebase`.

---

## 5) `git pull` — Änderungen aus Remote laden

**Funktion:** Holt neue Commits und integriert sie in den aktuellen Branch.

```bash
# Standard: fetch + merge
git pull

# Schlanker Verlauf: fetch + rebase
git pull --rebase
```

**Empfohlene Einstellung:**

```bash
git config --global pull.rebase true
```

**Konflikte lösen:**

1. Git markiert Konflikte in Dateien.
2. Konflikte manuell beheben.
3. Dateien stagen: `git add <datei>`
4. Fortfahren mit `git commit` oder `git rebase --continue`.

---

## Typischer Tagesablauf

```bash
# 1) Branch aktualisieren
git switch main
git pull --rebase

# 2) Feature-Branch erstellen
git switch -c feature/auth-login

# 3) Arbeiten + Commit
git add .
git commit -m "feat(auth): Login-Formular"

# 4) Branch pushen, PR/MR erstellen
git push -u origin feature/auth-login

# 5) Nach Merge: Main aktualisieren
git switch main
git pull --rebase
```

---

## Branching (leichtgewichtig, aber wichtig)

```bash
git branch                # Branches auflisten
git switch -c feature/ui  # neuen Branch erstellen
git switch main           # zurück wechseln
git branch -d feature/ui  # Branch löschen (gemergt)
git branch -D feature/ui  # Branch erzwingen (nicht gemergt)
```

**Warum Branches?**
Isolation, parallele Entwicklung, stabile `main`.

---

## Remotes verwalten

```bash
git remote -v                   # Remotes anzeigen
git remote add origin <URL>     # Remote hinzufügen
git remote set-url origin <URL> # Remote-URL ändern
git fetch --all --prune         # alles aktualisieren
```

---

## Vergleichen & Rückgängig machen

```bash
git diff                 # Änderungen seit letztem Commit
git diff --staged        # Vorgemerkte Änderungen
git log -- <datei>       # Historie einer Datei
git restore <datei>      # Änderungen verwerfen
git restore --staged <d> # Staging rückgängig
git revert <sha>         # Commit rückgängig (neuer Commit)
git reset --hard <sha>   # Branch zurücksetzen (gefährlich)
```

---

## `.gitignore` — Unnötige Dateien ausschließen

Beispiel:

```bash
# OS
.DS_Store
Thumbs.db

# Abhängigkeiten / Builds
node_modules/
dist/
build/

# Umgebungen
.env
.env.local

# Logs
*.log
```

---

## Zusammenarbeit mit Plattformen

**Neues Projekt:**

```bash
echo "# mein-projekt" > README.md
git init
git add .
git commit -m "chore: Initial Commit"
git branch -M main
git remote add origin https://github.com/deinuser/mein-projekt.git
git push -u origin main
```

**Forks + Pull Requests:**

* Fork erstellen → Feature-Branch → Push ins Fork → PR öffnen.
* Upstream aktuell halten:

  ```bash
  git remote add upstream <url>
  git fetch upstream
  git rebase upstream/main
  ```

---

## Häufige Probleme

* **„Nothing to commit“** → Auf falschem Branch? `.gitignore` prüft Dateien?
* **Push abgelehnt** → `git pull --rebase`, Konflikte lösen, neu pushen.
* **Große Datei versehentlich committed** → Datei löschen, ggf. `git filter-repo`.
* **Zeilenenden (Windows/Linux/macOS):**

  ```bash
  git config --global core.autocrlf input   # macOS/Linux
  git config --global core.autocrlf true    # Windows
  ```

---

## Cheat Sheet

```bash
# Start
git init
git add .
git commit -m "Initial Commit"

# Remote verbinden + Push
git branch -M main
git remote add origin <URL>
git push -u origin main

# Daily
git pull --rebase
git add -p
git commit -m "feat: ..."
git push
```

---

## Wichtige Begriffe

* **Working Directory:** deine Dateien auf der Festplatte
* **Staging Area (Index):** vorgemerkte Änderungen
* **Commit:** Schnappschuss mit Metadaten
* **Branch:** Zeiger auf eine Commit-Kette
* **Remote:** externe Kopie des Repositories
* **Fast-Forward:** Branch-Zeiger direkt verschieben
* **Rebase vs. Merge:** Rebase → linear, Merge → parallele Historie

---

## Nächste Schritte

* `git stash` zum schnellen Zwischenspeichern
* `git tag` und Releases nutzen
* Branching-Strategie (z. B. GitHub Flow, Git Flow) wählen
* CI/CD einrichten, damit jeder Push automatisch geprüft wird

---

> Mit diesen Grundlagen kannst du Projekte initialisieren, saubere Historien führen und effektiv mit anderen zusammenarbeiten. Übung in einem Test-Repo hilft, Sicherheit im Workflow aufzubauen.
