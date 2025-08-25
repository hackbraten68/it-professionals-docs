---
title: Erstellen und Wechseln von Branches
---
# Erstellen und Wechseln von Branches

> Ein praxisnaher Leitfaden zum Erstellen, Anzeigen und Wechseln von Branches in Git – klar, umfassend und mit Beispielen.

---

## 1) Was ist ein Branch (und warum ist er wichtig)?

* **Branch**: ein beweglicher Zeiger auf einen Commit; jeder Branch ist eine unabhängige Entwicklungslinie.
* **HEAD**: deine aktuelle „Position“ – zeigt in der Regel auf den neuesten Commit des **aktuellen Branches**.
* **Working Tree / Index**: deine lokalen Dateien und der Staging-Bereich; diese wechseln mit dir, wenn du den Branch wechselst.

**Warum Branches?** Sie ermöglichen es, Features isoliert zu entwickeln, sicher zu experimentieren, parallel zu arbeiten und `main` stabil zu halten.

---

## 2) Voraussetzungen

* Git ist installiert und konfiguriert (`git --version`, `git config --global user.name`, `git config --global user.email`).
* Ein Repository ist initialisiert (`git init`) oder geklont (`git clone ...`).

---

## 3) Branches erstellen

### 3.1 Branch vom aktuellen Commit erstellen

```bash
git branch feature-login
```

Erstellt `feature-login`, der auf denselben Commit wie dein aktueller Branch zeigt – du **wechselst** aber nicht automatisch dorthin.

### 3.2 Branch von einem anderen Ausgangspunkt erstellen

```bash
# Von einem bestimmten Commit (SHA verwenden)
git branch feature-login a1b2c3d

# Von einem anderen Branch
git branch feature-login main
```

### 3.3 Branch erstellen, der einen Remote-Branch trackt

```bash
git fetch
git branch --track feature-login origin/feature-login
```

> `--track` legt den Upstream fest, sodass `push` und `pull` wissen, welchen Remote-Branch sie verwenden sollen.

---

## 4) Branches wechseln

Du kannst mit dem modernen **`git switch`** (empfohlen) oder dem älteren **`git checkout`** wechseln.

### 4.1 Zu einem bestehenden Branch wechseln

```bash
# Empfohlen
git switch feature-login

# Äquivalent (älter)
git checkout feature-login
```

### 4.2 Erstellen **und** direkt wechseln

```bash
# Modern
git switch -c feature-login

# Legacy
git checkout -b feature-login
```

### 4.3 Remote-Branch auschecken und tracken

```bash
git fetch
git switch -c feature-login origin/feature-login
# oder:
git switch --track origin/feature-login
```

> **Hinweis:** Wenn du ungespeicherte Änderungen hast, die im Zielbranch Konflikte verursachen würden, blockiert Git den Wechsel. Committe oder stash die Änderungen zuerst.

---

## 5) Branches auflisten und inspizieren

### 5.1 Lokale Branches

```bash
git branch
```

* Der aktuelle Branch ist mit `*` markiert (oder farblich hervorgehoben).

### 5.2 Lokale + Remote-Branches

```bash
git branch -a
```

### 5.3 Upstream-Info und letzten Commit anzeigen

```bash
git branch -vv
```

### 5.4 Branches anzeigen, die bereits gemerged wurden oder nicht

```bash
git branch --merged
git branch --no-merged
```

---

## 6) Branches löschen, umbenennen und verwalten

### 6.1 Branch umbenennen

```bash
# Aktuellen Branch
git branch -m neuer-name

# Anderen Branch
git branch -m alt-name neu-name
```

### 6.2 Gelöschten Branch (nur wenn gemerged)

```bash
git branch -d feature-login
```

### 6.3 Erzwingen (auch wenn nicht gemerged – gefährlich)

```bash
git branch -D feature-login
```

### 6.4 Remote-Branch löschen

```bash
git push origin --delete feature-login
# oder:
git push origin :feature-login
```

---

## 7) Upstream-Branches, Tracking und erster Push

### 7.1 Upstream beim ersten Push setzen

```bash
git push -u origin feature-login
```

### 7.2 Upstream nachträglich ändern

```bash
git branch -u origin/feature-login
```

---

## 8) Detached HEAD: Was das ist und wie man es löst

* **Detached HEAD**: Wenn `HEAD` direkt auf einen Commit zeigt statt auf einen Branch (`git checkout a1b2c3d`).
* Du kannst experimentieren, aber neue Commits hängen nicht an einem Branch.

**Lösung:**

```bash
git switch -c hotfix-temp
```

Damit hängt dein Commit an einem neuen Branch.

---

## 9) Typische Workflows

### 9.1 Feature-Branch-Flow

1. `main` aktualisieren:

   ```bash
   git switch main
   git pull
   ```
2. Branch erstellen & wechseln:

   ```bash
   git switch -c feature-login
   ```
3. Änderungen committen & pushen:

   ```bash
   git add .
   git commit -m "Add login form skeleton"
   git push -u origin feature-login
   ```
4. Pull Request erstellen, reviewen, mergen.

### 9.2 Hotfix-Flow

```bash
git switch main
git pull
git switch -c hotfix-logout-bug
# fix, commit, test
git push -u origin hotfix-logout-bug
# PR erstellen, mergen, Branch löschen
```

### 9.3 Feature-Branch aktuell halten

```bash
git switch feature-login
git fetch origin
git merge origin/main      # ODER: git rebase origin/main
```

---

## 10) Namenskonventionen

* Nutze konsistente, kurze Namen:
  `feature/login-form`, `bugfix/logout-crash`, `chore/deps-bump`, `docs/contributing`.
* Präfixe wie `feature/`, `bugfix/`, `hotfix/`, `release/`, `docs/`, `chore/`.

---

## 11) Best Practices

* **Kleine, fokussierte Branches** → weniger Konflikte.
* **Oft synchronisieren** mit `main`.
* **Branch-Protection** für `main` aktivieren.
* **Alte Branches löschen** nach Merge.
* **Kein force-push auf geteilte Branches**, außer mit klarer Absprache.

---

## 12) Troubleshooting

### 12.1 „Your local changes would be overwritten…“

→ Änderungen committen oder stashen:

```bash
git add .
git commit -m "WIP"
# oder
git stash
git switch ziel-branch
git stash pop
```

### 12.2 „pathspec did not match…“

→ Branch existiert nicht. Lösung: Namen prüfen, `git fetch --all`, dann `git branch -a`.

### 12.3 Commits auf falschem Branch

```bash
git switch -c richtiger-branch
git switch falscher-branch
git reset --hard origin/falscher-branch
```

---

## 13) Cheat Sheet

```bash
# Erstellen
git branch <name>
git switch -c <name>
git checkout -b <name>

# Wechseln
git switch <name>
git checkout <name>

# Remote
git fetch
git switch --track origin/<name>

# Auflisten
git branch
git branch -a
git branch -vv

# Umbenennen / Löschen
git branch -m <neu>
git branch -d <name>
git branch -D <name>

# Upstream
git push -u origin <name>
git branch -u origin/<name>

# Merge-Status
git branch --merged
git branch --no-merged
```

---

## 14) Übung

1. Aktualisiere `main`, dann erstelle `feature/login-ui`.
2. Mache zwei Commits.
3. Push mit Upstream, öffne PR.
4. Simuliere Änderung auf `main`.
5. Merge oder Rebase in deinem Branch.
6. PR mergen, Branch löschen.

---

**Wichtigste Erkenntnis:** Nutze `git switch` für moderne Workflows, halte Branches klein & aktuell, setze Upstreams richtig, lösche alte Branches.
