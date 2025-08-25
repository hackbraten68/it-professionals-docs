---
title: Arbeiten mit Branches
---
# Arbeiten mit Branches

> Branches ermöglichen es dir, Features zu entwickeln, Bugs zu beheben oder zu experimentieren, **ohne `main` zu verändern**. Deine Commits bleiben isoliert auf dem Branch, bis du sie absichtlich integrierst (merge oder rebase).

---

## 1) Schnellstart (aus deinem Input)

Sobald du dich auf einem Branch befindest (z. B. `feature-login`):

```bash
# Änderungen machen und zum Staging hinzufügen
git add .
git commit -m "Login-Formular hinzufügen"

# Deinen Branch ins Remote-Repository hochladen
git push origin feature-login
```

Diese Commits **beeinflussen `main` nicht**, bis du sie zusammenführst.

---

## 2) Grundkonzepte

* **Aktueller Branch**: Der Branch, auf den dein HEAD zeigt; hier landen deine Commits.
* **Isolation**: Entwicklungslinien laufen parallel, `main` bleibt unangetastet.
* **Integration**: Einbringen der Branch-Arbeit nach `main` mittels **merge** (bewahrt Historie) oder **rebase** (schreibt Historie linear um).

---

## 3) Wichtige Befehle im Alltag

### Erstellen / Wechseln

```bash
# Neu erstellen und direkt wechseln (modern)
git switch -c feature-login

# Zu existierendem wechseln
git switch feature-login

# Ältere Variante
git checkout -b feature-login
git checkout feature-login
```

### Überblick

```bash
git status            # Welche Dateien haben sich geändert?
git branch            # Lokale Branches anzeigen; * markiert den aktuellen
git branch -vv        # Upstream-Infos anzeigen
git log --oneline --graph --decorate --all  # Historie visualisieren
```

### Commit

```bash
git add .
git commit -m "Beschreibe was und warum, nicht nur was"
```

### Push (erstes Mal vs. danach)

```bash
# Erstes Push: Upstream setzen (-u)
git push -u origin feature-login

# Danach reicht einfach
git push
```

---

## 4) Typischer Feature-Workflow (Empfohlen)

1. **`main` aktualisieren**

   ```bash
   git switch main
   git pull --ff-only
   ```

2. **Neuen Branch erstellen**

   ```bash
   git switch -c feature/login-form
   ```

3. **Entwickeln & committen**

   ```bash
   git add .
   git commit -m "Login-Formular mit Basisvalidierung hinzufügen"
   ```

4. **Branch veröffentlichen**

   ```bash
   git push -u origin feature/login-form
   ```

5. **Pull Request (PR) öffnen** auf GitHub/GitLab.
6. **Branch aktuell halten** (siehe §6).
7. **Merge** über PR (Squash/Merge/Rebase).
8. **Aufräumen**: Branch löschen (siehe §9).

---

## 5) Arbeiten lokal im Branch

* Oft committen, **kleine, fokussierte Schritte**.
* **Aussagekräftige Nachrichten** schreiben:

  ```bash
  feat(auth): Login-Formular mit E-Mail+Passwort hinzufügen
  fix(auth): Leeres Passwort korrekt behandeln
  refactor(ui): <FormRow/> Komponente extrahieren
  ```

* Vor dem Pushen Tests und Linter laufen lassen.

---

## 6) Branch mit `main` synchronisieren

### A) Merge (sicher, nicht destruktiv)

```bash
git switch feature/login-form
git fetch origin
git merge origin/main
# Konflikte lösen und mergen
```

### B) Rebase (lineare Historie)

```bash
git switch feature/login-form
git fetch origin
git rebase origin/main
# Konflikte lösen, dann:
git rebase --continue

# Wenn Branch schon gepusht war:
git push --force-with-lease
```

**Merke:** Rebase nur auf **eigenen Branches**, nicht auf gemeinsam genutzten.

---

## 7) Änderungen nach `main` bringen

### Merge-Strategien

* **Merge-Commit**: Bewahrt Historie + Branch-Struktur.
* **Squash-Merge**: Alle Commits zu einem zusammenfassen → saubere Historie.
* **Rebase & Merge**: Commits linear in `main` einfügen.

### CLI-Beispiel

```bash
git switch main
git pull --ff-only
git merge --ff-only feature/login-form
git push
```

Falls kein Fast-Forward möglich:

```bash
git merge --no-ff feature/login-form
git push
```

---

## 8) Tracking-Branches & Upstream

Ein **Tracking-Branch** kennt sein Remote-Pendant → erleichtert `git pull` & `git push`.

```bash
# Beim ersten Push
git push -u origin feature-login

# Upstream prüfen
git branch -vv
```

Automatisch Upstream setzen:

```bash
git config --global push.autoSetupRemote true
```

---

## 9) Branches umbenennen & löschen

### Umbenennen

```bash
git branch -m feature-login feature-auth-login
git push -u origin feature-auth-login
git push origin --delete feature-login
```

### Löschen

```bash
# Lokal (sicher)
git branch -d feature-auth-login

# Lokal (erzwingen)
git branch -D feature-auth-login

# Remote
git push origin --delete feature-auth-login
```

---

## 10) Konflikte lösen (Kurz)

Konflikte entstehen, wenn dieselben Zeilen unterschiedlich geändert wurden:

```text
<<<<<<< HEAD
aktueller Branch
=======
eingehender Branch
>>>>>>> other-branch
```

**Lösen:** Datei anpassen → speichern → dann:

```bash
git add <datei>
git commit             # bei merge
git rebase --continue  # bei rebase
```

Hilfreich:

```bash
git mergetool
git diff --merge
```

---

## 11) Cherry-Picking & Hotfixes

Einzelnen Commit übernehmen:

```bash
git cherry-pick <commit-sha>
```

Nützlich für Hotfixes oder wenn du **nur eine Änderung** brauchst.

---

## 12) Namenskonventionen

* Prefixe nutzen: `feature/`, `bugfix/`, `hotfix/`, `chore/`, `docs/`.
* Kurze Namen, **kebab-case** oder mit `/` trennen:

  * `feature/login-form`
  * `bugfix/auth-null-check`
* Mit Ticket-ID:

  * `feature/123-user-login-form`

---

## 13) Best Practices für Zusammenarbeit

* **Kleine PRs** → leichter reviewbar.
* **Draft PR früh öffnen** → Feedback im Prozess.
* **CI grün halten** (Tests bestehen).
* **Review-Etikette**: In Commit- und PR-Beschreibungen das *Warum* erklären.

---

## 14) Sicherheitsnetze & Richtlinien

* **`main` schützen**:

  * Review & CI vor Merge verpflichtend.
  * Force-Push auf `main` verbieten.
* Branch muss vor Merge **aktuell** sein.
* **CODEOWNERS** nutzen → Reviewer automatisch zuordnen.

---

## 15) Troubleshooting

* **Kein Upstream gesetzt**

  ```bash
  git push -u origin mein-branch
  ```

* **Aus Versehen in `main` committed**

  ```bash
  git switch -c feature/extract-commits
  git switch main
  git reset --hard origin/main
  ```

* **Letzten Commit rückgängig machen, aber Änderungen behalten**

  ```bash
  git reset --soft HEAD~1
  ```
  
* **Arbeitsverzeichnis zurücksetzen**

  ```bash
  git restore --source=HEAD --staged --worktree .
  ```

---

## 16) Beispiel-Session

```bash
# 1) main aktualisieren
git switch main
git pull --ff-only

# 2) Branch erstellen
git switch -c feature/login-form

# 3) Arbeiten & committen
git add .
git commit -m "feat(auth): Login-Formular (E-Mail + Passwort)"

# 4) Pushen
git push -u origin feature/login-form

# 5) Mit main synchronisieren
git fetch origin
git merge origin/main

# 6) PR öffnen, reviewen, CI prüfen

# 7) PR mergen

# 8) Aufräumen
git switch main
git pull --ff-only
git branch -d feature/login-form
git push origin --delete feature/login-form
```

---

## 17) Wichtigste Punkte

* Arbeite immer in einem **Feature-Branch**, `main` bleibt stabil.
* **`git push -u`** beim ersten Mal, danach einfacher push.
* Branch regelmäßig mit `main` abgleichen.
* Änderungen per **PR** integrieren.
* Branch nach Merge löschen.
* **Kleine, saubere Commits & PRs** schreiben.

Mit diesem Ablauf bleibt Zusammenarbeit sicherer, die Historie übersichtlicher und Konflikte seltener.
