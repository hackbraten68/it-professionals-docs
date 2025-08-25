---
title: Setting Up Git
---
# Git einrichten

Bevor du mit Git arbeiten kannst, musst du es **installieren** und anschließend eine **Grundkonfiguration** vornehmen. Diese Einrichtung stellt sicher, dass Git korrekt funktioniert und deine Arbeit eindeutig mit deiner Identität verknüpft wird.

---

## 1. Installation von Git

Git kann auf allen gängigen Betriebssystemen installiert werden. Die Vorgehensweise hängt von deinem System ab:

### Windows

* Lade den Installer von der offiziellen Website herunter:
  [https://git-scm.com/download/win](https://git-scm.com/download/win)
* Führe den Installer aus und folge den Anweisungen.
* Optional kannst du **Git Bash** mitinstallieren – ein Terminal mit UNIX-ähnlichen Befehlen, das die Arbeit mit Git unter Windows deutlich erleichtert.

### macOS

* Mit **Homebrew** (Paketmanager) kannst du Git wie folgt installieren:

  ```bash
  brew install git
  ```
* Alternativ kannst du die **Xcode Command Line Tools** installieren, die Git bereits enthalten:

  ```bash
  xcode-select --install
  ```

### Linux

* Verwende den Paketmanager deiner Distribution:

  * Debian/Ubuntu:

    ```bash
    sudo apt update
    sudo apt install git
    ```
  * Fedora:

    ```bash
    sudo dnf install git
    ```
  * Arch Linux:

    ```bash
    sudo pacman -S git
    ```

> ✅ **Tipp:** Überprüfe die Installation mit:
>
> ```bash
> git --version
> ```
>
> Damit wird die installierte Git-Version angezeigt.

---

## 2. Grundkonfiguration

Nach der Installation solltest du Git mit deinen persönlichen Daten konfigurieren. Diese Informationen werden in den Metadaten deiner Commits gespeichert und helfen, deine Änderungen eindeutig zu identifizieren.

### Name und E-Mail festlegen

Führe die folgenden Befehle aus (ersetze durch deine eigenen Daten):

```bash
git config --global user.name "Dein Name"
git config --global user.email "du@example.com"
```

* `user.name`: Wird als Autor deiner Commits angezeigt.
* `user.email`: Diese E-Mail-Adresse wird mit deinen Commits verknüpft. Wenn du GitHub oder GitLab nutzt, sollte sie mit der dort hinterlegten Adresse übereinstimmen.

### Weitere nützliche Einstellungen

* Standard-Editor festlegen (Beispiel: Visual Studio Code):

  ```bash
  git config --global core.editor "code --wait"
  ```
* Farbige Ausgabe aktivieren (bessere Lesbarkeit):

  ```bash
  git config --global color.ui auto
  ```

---

## 3. Konfiguration überprüfen

Du kannst dir die aktuellen Einstellungen anzeigen lassen mit:

```bash
git config --list
```

Oder gezielt einzelne Werte abfragen:

```bash
git config user.name
git config user.email
```

---

## 4. Lokale vs. Globale Konfiguration

* **Global** (`--global`): Gilt für das gesamte System (alle Repositories).
* **Lokal**: Ohne `--global` gilt die Einstellung nur für das aktuelle Repository.
* **Systemweit** (`--system`): Gilt für alle Benutzer auf dem Rechner.

Beispiel für eine repository-spezifische E-Mail:

```bash
git config user.email "projekt@example.com"
```

---

## 5. Nächste Schritte

Sobald Git installiert und eingerichtet ist, kannst du:

* Ein neues Repository erstellen mit `git init`.
* Ein bestehendes Repository klonen mit `git clone <url>`.
* Dateien verfolgen, Änderungen committen und mit anderen zusammenarbeiten.
