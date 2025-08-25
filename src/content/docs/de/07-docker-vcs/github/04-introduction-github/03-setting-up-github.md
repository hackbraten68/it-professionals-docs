---
title: GitHub einrichten
---

## 3. GitHub einrichten

Bevor du Projekte gemeinsam bearbeiten oder Code nach GitHub hochladen kannst, musst du sowohl ein **GitHub-Konto** erstellen als auch **Git** auf deinem lokalen Rechner installieren und konfigurieren. Die folgenden Schritte führen dich durch den Prozess.

---

### Schritt 1: GitHub-Konto erstellen

1. **Besuche die GitHub-Webseite**: [https://github.com](https://github.com)  
2. **Klicke auf "Sign up"** und folge dem Registrierungsprozess:
   - Gib deine **E-Mail-Adresse** ein.  
   - Wähle einen **eindeutigen Benutzernamen** und ein **sicheres Passwort**.  
   - Bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.  
3. Nach der Einrichtung kannst du dich in dein **GitHub-Dashboard** einloggen, wo du Repositories, Organisationen und Zusammenarbeit verwaltest.

> **Tipp:** Verwende einen professionellen Benutzernamen (z. B. `vorname-nachname` oder `dev-username`), wenn du dein GitHub-Profil später Arbeitgebern oder Kunden zeigen möchtest.

---

### Schritt 2: Git installieren

Um mit GitHub zu arbeiten, benötigst du **Git** auf deinem lokalen System. Git ist das Versionskontroll-Tool, das mit GitHub kommuniziert.  

- **Windows**: Lade Git von [https://git-scm.com/download/win](https://git-scm.com/download/win) herunter und installiere es.  
  - Während der Installation kannst du die Standardoptionen übernehmen, aber stelle sicher, dass Git in den **PATH** aufgenommen wird.  
- **macOS**: Installiere Git mit **Homebrew** (falls vorhanden):

  ```bash
  brew install git
```

Oft ist Git bereits vorinstalliert. Überprüfen kannst du das mit:

```bash
git --version
```

* **Linux (Debian-basiert)**: Verwende `apt`, um Git zu installieren:

  ```bash
  sudo apt update
  sudo apt install git
  ```

Nach der Installation kannst du mit folgendem Befehl überprüfen, ob Git funktioniert:

```bash
git --version
```

---

### Schritt 3: Git konfigurieren

Bevor du Git mit GitHub verbindest, solltest du deine Identität konfigurieren. Diese Informationen werden deinen Commits hinzugefügt.

```bash
git config --global user.name "Dein Name"
git config --global user.email "du@example.com"
```

* `user.name`: Dein Anzeigename (z. B. `Max Mustermann`).
* `user.email`: Die E-Mail-Adresse, die mit deinem GitHub-Konto verknüpft ist.

Zum Überprüfen deiner Einstellungen:

```bash
git config --list
```

---

### Schritt 4: (Optional) SSH für die Authentifizierung einrichten

Neben HTTPS ist die Verwendung von **SSH-Schlüsseln** eine sichere und bequeme Möglichkeit, dich bei GitHub anzumelden, ohne jedes Mal ein Passwort eingeben zu müssen.

1. Erzeuge einen neuen SSH-Schlüssel:

   ```bash
   ssh-keygen -t ed25519 -C "du@example.com"
   ```

2. Füge den SSH-Schlüssel dem Agenten hinzu:

   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Kopiere den öffentlichen Schlüssel nach GitHub:

   * Gehe zu **GitHub → Settings → SSH and GPG keys → New SSH key**
   * Füge den Inhalt von `~/.ssh/id_ed25519.pub` ein

Teste die Verbindung:

```bash
ssh -T git@github.com
```

---

### Schritt 5: (Optional) GitHub CLI konfigurieren

GitHub bietet das **GitHub CLI-Tool (`gh`)**, mit dem du Repositories und Pull Requests direkt aus dem Terminal verwalten kannst.

* Installation: [https://cli.github.com](https://cli.github.com)
* Anmeldung bei GitHub:

  ```bash
  gh auth login
  ```

---

### Zusammenfassung

* Du hast ein **GitHub-Konto** erstellt, um Projekte online zu verwalten.
* Du hast **Git** lokal installiert, um Änderungen zu verfolgen und dich mit GitHub zu verbinden.
* Du hast Git mit deinem **Namen und deiner E-Mail-Adresse** konfiguriert.
* (Optional) Du kannst **SSH-Schlüssel** oder das **GitHub CLI** für eine komfortablere Arbeitsweise nutzen.

Mit dieser Einrichtung bist du bereit, **Repositories zu erstellen, Code hochzuladen und gemeinsam an Projekten zu arbeiten**.
