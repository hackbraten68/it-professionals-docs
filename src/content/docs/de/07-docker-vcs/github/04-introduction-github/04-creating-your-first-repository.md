---
title: Dein erstes Repository erstellen
---
# Dein erstes Repository erstellen

Ein **Repository (Repo)** ist der Speicherort für die Dateien deines Projekts, seine Versionsgeschichte und die Zusammenarbeit mit anderen. Es enthält deinen Code, eine Zeitleiste von Commits, Branches für parallele Arbeit und Metadaten wie Issues, Pull Requests und Releases.

Diese Anleitung erweitert dein Grundgerüst zu einem klar strukturierten Schritt-für-Schritt-Handbuch, das du für Unterricht oder Selbststudium nutzen kannst. Sie behandelt sowohl das Erstellen eines Repos auf GitHub als auch das Initialisieren eines lokalen Projekts und das anschließende Pushen zu GitHub.

---

## Voraussetzungen

* **Git installiert** auf deinem Rechner

  * Windows: Download von git-scm.com und Standardoptionen übernehmen
  * macOS: `brew install git`
  * Linux (Debian/Ubuntu): `sudo apt install git`
* **Git konfiguriert** mit deiner Identität:

  ```bash
  git config --global user.name "Dein Name"
  git config --global user.email "du@example.com"
  ```

* **GitHub-Konto** (kostenlos): Registrierung auf github.com
* Optional, aber empfohlen:

  * SSH-Key zu GitHub hinzugefügt (für sichere Pushes ohne Passwortabfrage)
  * Ein lokaler Projektordner ist bereits vorbereitet

---

## Option A — Repository auf GitHub erstellen

### 1) Neues Repository starten

1. Melde dich bei GitHub an und klicke auf **New** (oder auf **+ → New repository**).
2. **Repository-Name:** kurz und prägnant, Bindestriche sind üblich (z. B. `mein-erstes-repo`).
3. **Beschreibung:** Eine kurze Zusammenfassung hilft dir und späteren Mitwirkenden.

### 2) Sichtbarkeit auswählen

* **Public:** Jeder kann das Repo sehen (typisch für Open Source, Portfolios, Unterricht).
* **Private:** Nur du und eingeladene Personen haben Zugriff.

### 3) Optionale Initial-Dateien

* **README:** Startdatei, in der du Zweck, Einrichtung und Nutzung erklärst.
* **.gitignore:** Gibt an, welche Dateien Git ignorieren soll (z. B. `node_modules/`, Logs). GitHub bietet Vorlagen.
* **Lizenz:** Wähle eine Lizenz, wenn du dein Projekt teilen möchtest (z. B. MIT für freie Nutzung).

> Hinweis: Falls du ein bereits bestehendes lokales Projekt hochladen willst, **erstelle keine Dateien auf GitHub**. Sonst musst du beim Pushen Konflikte lösen.

### 4) Repository erstellen

Klicke auf **Create repository**. Du gelangst zur neuen Projektseite.

### 5) Nächste Schritte

Auf der Repo-Seite findest du Anweisungen wie:

* **A. Klonen und starten** (wenn schon Dateien wie README existieren):

  ```bash
  git clone https://github.com/<username>/<mein-erstes-repo>.git
  cd mein-erstes-repo
  git add .
  git commit -m "Erste Änderungen"
  git push
  ```

* **B. Lokales Projekt hochladen** → siehe Option B.

---

## Option B — Repository aus einem lokalen Projekt erstellen

### 1) Projektordner erstellen und initialisieren

```bash
mkdir mein-projekt
cd mein-projekt
git init
```

* `git init` legt ein verstecktes `.git`-Verzeichnis an → dein Projekt ist nun Git-gesteuert.

> Prüfe den Standardbranch: Moderne Git-Versionen verwenden `main`. Falls noch `master`:
>
> ```bash
> git branch -M main
> ```

### 2) GitHub-Remote hinzufügen

Erstelle zuerst ein leeres Repo auf GitHub (ohne Dateien) und verbinde es:

```bash
git remote add origin https://github.com/username/mein-projekt.git
# oder mit SSH:
# git remote add origin git@github.com:username/mein-projekt.git
```

Überprüfen:

```bash
git remote -v
```

### 3) Dateien hinzufügen, committen und pushen

```bash
echo "# Mein Projekt" > README.md

git add .
git commit -m "Erster Commit"
git push -u origin main
```

* `-u` setzt den Standard-Remote (Upstream). Danach reicht `git push`/`git pull`.

---

## Empfohlene Dateien im Repository

### README (Beispielvorlage)

````markdown
# Projektname

Kurze Beschreibung.

## Features
- Punkt 1
- Punkt 2

## Installation
```bash
# Setup-Befehle
```

## Nutzung

Beispiele, Befehle, Screenshots.

## Lizenz

MIT (oder eine andere Wahl)

```

### .gitignore (Beispiele)

```bash
# Node
node_modules/
dist/

# Python
__pycache__/
*.pyc
.venv/

# Allgemein
.env
.DS_Store
*.log
```

### LICENSE

Falls du dein Projekt teilst → füge eine Lizenzdatei hinzu.
Ohne Lizenz gilt automatisch: Alle Rechte vorbehalten.

---

## HTTPS vs. SSH für `origin`

* **HTTPS:** Einfach, aber erfordert Personal Access Token bei jedem Push.
* **SSH:** Einmal Schlüssel einrichten → dann Pushes ohne Passwort.

  ```bash
  ssh-keygen -t ed25519 -C "du@example.com"
  # Schlüssel zu GitHub → Settings → SSH and GPG keys
  ```

---

## Überprüfen, ob alles funktioniert

```bash
git branch
git remote -v
echo "Hallo Repo" >> hallo.txt
git add hallo.txt
git commit -m "Datei hinzugefügt"
git push
```

→ Datei sollte auf GitHub erscheinen.

---

## Zusammenarbeit & Zugriff

* **Private Repos:** Mitwirkende über **Settings → Collaborators** hinzufügen.
* **Öffentliche Repos:** Jeder kann forken, Push bleibt kontrolliert.
* Branch-Schutz für `main` möglich:

  * Pull Requests erzwingen
  * Statusprüfungen verlangen
  * Alte Freigaben bei neuen Commits zurückziehen

---

## Commit-Nachrichten (Best Practices)

* **Imperativ verwenden:** „Add login page“ (statt „Added“ oder „Adds“).
* Betreff ≤ 50 Zeichen, längere Infos in den Body.
* Optional: **Conventional Commits**:

  * `feat: neues Feature`
  * `fix: Bug behoben`
  * `docs: Doku ergänzt`
  * `chore: Abhängigkeiten aktualisiert`

---

## Häufige Fehler und Lösungen

1. **`src refspec main does not match any`**
   → Noch kein Commit vorhanden.

   ```bash
   git branch -M main
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **`fatal: remote origin already exists`**

   ```bash
   git remote set-url origin <url>
   ```

3. **Authentifizierungsfehler (HTTPS)**

   * Personal Access Token nutzen
   * Oder auf SSH umstellen

4. **Push rejected (non-fast-forward)**
   → Repo auf GitHub ist neuer.

   ```bash
   git pull --rebase origin main
   # Konflikte lösen
   git push
   ```

---

## Nächste Schritte

* Erstelle ein Test-Repo („Hello World“)
* Arbeite mit Branches und Pull Requests
* Ergänze `.gitignore`, README und Lizenz

Damit hast du alle Grundlagen, um dein erstes Repository – ob auf GitHub oder lokal – sauber und sicher einzurichten.

---
