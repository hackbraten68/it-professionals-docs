---
title: Was ist Stashing?
---
# Was ist Stashing? (Git)

Stashing ermöglicht es dir, **lokale Änderungen temporär zwischenzuspeichern** (sowohl gestagte als auch ungestagte), sodass du zu einem sauberen Arbeitsverzeichnis zurückkehren kannst – ohne diese Änderungen im aktuellen Branch zu committen. Man kann es sich wie ein schnelles „Halte meine Änderungen kurz fest“ vorstellen.

---

## Wann Stashing sinnvoll ist

- Du musst **den Branch wechseln**, hast aber uncommittete Änderungen, die sonst blockieren würden.  
- Du möchtest **pullen oder rebasen** mit einem sauberen Arbeitsverzeichnis.  
- Du experimentierst und willst einen **sicheren Zwischenspeicher**, ohne Commits zu erzeugen.  
- Du musst **den Kontext schnell wechseln** und später an derselben Stelle weitermachen.  

---

## Funktionsweise von Stash (Konzept)

- Ein Stash wird intern als **Commit-Paar** unter `refs/stash` gespeichert:  
  - Ein Commit enthält die **Working-Tree-Änderungen**.  
  - Ein weiteres Commit kann die **Index-Änderungen (gestagte Dateien)** erfassen.  
- Stashes sind **nur lokal** in deinem Repository vorhanden und werden **nicht gepusht**.  
- Standardmäßig werden **nicht verfolgte** und **ignorierte** Dateien *nicht* gespeichert (es sei denn, du forderst es explizit an).  

---

## Schnellstart: Wichtige Befehle

```bash
# Änderungen in einem neuen Stash sichern
git stash

# Modernere Variante (empfohlen) mit optionaler Nachricht:
git stash push -m "WIP: Bugfix Layout"

# Alle Stashes auflisten
git stash list

# Den neuesten Stash anwenden (bleibt erhalten)
git stash apply

# Den neuesten Stash anwenden und entfernen
git stash pop

# Den neuesten Stash löschen, ohne ihn anzuwenden
git stash drop
```

> **Tipp:** Verwende `git stash pop` nur, wenn du sicher bist, dass er sauber angewendet wird. Andernfalls erst `apply`, und wenn alles passt, danach `drop`.

---

## Einen Stash benennen

```bash
# Veraltet, aber noch möglich:
git stash save "WIP: Layout-Bug beheben"

# Empfohlen:
git stash push -m "WIP: Layout-Bug beheben"
```

So erscheinen deine Nachrichten in `git stash list`, was die Übersicht deutlich erleichtert.

---

## Stashes anzeigen & inspizieren

```bash
# Kompakte Liste
git stash list

# Änderungen des neuesten Stash im Überblick
git stash show

# Volles Diff für einen bestimmten Stash
git stash show -p stash@{2}
```

---

## Spezifische Stashes anwenden

```bash
# Bestimmten Stash anwenden, ohne ihn zu löschen
git stash apply stash@{2}

# Anwenden und löschen
git stash pop stash@{2}
```

Bei Konflikten: Konflikte wie bei einem Merge lösen und dann fortfahren.

---

## Untracked & ignorierte Dateien einbeziehen

Standardmäßig speichert Stash nur **verfolgte Dateien**. Mit folgenden Optionen kannst du mehr aufnehmen:

```bash
# Auch untracked Dateien sichern
git stash push -u -m "WIP mit untracked"

# Auch ignorierte Dateien sichern
git stash push -a -m "WIP mit ignored"
```

* `-u` / `--include-untracked`
* `-a` / `--all`

---

## Selektives / partielles Stashing

### 1) Nur bestimmte Pfade stashen

```bash
git stash push -m "nur Styles" -- src/styles/ public/
```

### 2) Interaktive Auswahl von Hunks

```bash
git stash -p
# oder:
git stash push -p -m "teilweises WIP"
```

### 3) Gestagte Änderungen behalten

```bash
# Nur ungestagte Änderungen stashen
git stash push --keep-index -m "nur ungestagte stashen"
```

### 4) Staged Build testen

```bash
git stash push --keep-index -m "Test staged"
# Tests/Build ausführen...
git stash pop
```

---

## Staged vs. Unstaged Änderungen

* **Standard:** `git stash` sichert sowohl gestagte als auch ungestagte Änderungen.
* Mit `--keep-index` bleiben gestagte Änderungen bestehen, nur ungestagte werden gestasht.
* Mit `--staged` (neuere Git-Versionen) nur gestagte stashen:

  ```bash
  git stash push --staged -m "nur staged WIP"
  ```

---

## In einen Branch umwandeln

Wenn ein Stash nicht sauber angewendet werden kann oder du in Isolation weiterarbeiten möchtest:

```bash
git stash branch fix/layout-bug stash@{1}
```

---

## Einzelne Dateien aus einem Stash zurückholen

```bash
git checkout stash@{2} -- src/components/Header.tsx
```

Sehr nützlich, um gezielt eine Datei wiederherzustellen.

---

## Stashes verwalten

```bash
# Bestimmten Stash entfernen
git stash drop stash@{3}

# Alle Stashes löschen (Vorsicht!)
git stash clear
```

---

## Typische Workflows

### A) Schneller Kontextwechsel

```bash
git stash push -m "WIP: Menü-Refactor"
git checkout hotfix/urgent
# ...Hotfix erledigen & committen...
git checkout feature/menu-refactor
git stash pop
```

### B) Pull mit sauberem Verzeichnis

```bash
git stash push -m "vor Pull"
git pull --rebase
git stash pop
```

### C) Nur staged Änderungen testen

```bash
git add .
git stash push --keep-index -m "unstaged sichern"
# Tests auf staged Code laufen lassen
git stash pop
```

---

## Konflikte behandeln

Beim Anwenden eines Stash können **Merge-Konflikte** entstehen:

1. `git stash apply` (oder `pop`) ausführen.
2. Konflikte in Dateien lösen.
3. Änderungen mit `git add` übernehmen.
4. Falls `apply` genutzt wurde: Stash danach manuell mit `git stash drop` löschen.

---

## Best Practices & Stolperfallen

* **Immer beschriften:** `git stash push -m "..."` für Übersichtlichkeit.
* **Nicht zu viele Stashes sammeln:** Sonst wird es unübersichtlich.
* **`apply` vor `drop`:** Bietet mehr Sicherheit als `pop`.
* **Stashes sind lokal:** Sie werden nicht geteilt.
* **Manchmal lieber committen:** Für langfristige Arbeit ist ein **WIP-Commit auf Feature-Branch** oft besser.
* **Selektive Optionen nutzen:** `-u`, `-a`, Pfadangaben oder `-p`.
* **Regelmäßig aufräumen:** Alte Stashes entfernen.

---

## Häufige Probleme

* **„Mein Stash ist nach `pop` weg“** → Gewollt, `pop` löscht ihn nach erfolgreichem Anwenden.
* **„Falschen Stash angewendet“** → Arbeitsbaum ggf. zurücksetzen (`git reset --hard`, wenn sicher) und richtigen Stash anwenden.
* **„Alle Stashes gelöscht“** → Nur schwer wiederherstellbar (`git fsck --lost-found` kann evtl. helfen).

---

## Befehlsübersicht (Cheat Sheet)

```bash
# Änderungen sichern
git stash
git stash push -m "msg"

# Mit untracked / ignored
git stash push -u -m "msg"
git stash push -a -m "msg"

# Nur ungestagte stashen
git stash push --keep-index -m "msg"

# Hunks auswählen
git stash -p
git stash push -p -m "msg"

# Nur bestimmte Pfade
git stash push -m "msg" -- pathA pathB

# Liste & Details
git stash list
git stash show
git stash show -p stash@{n}

# Anwenden / löschen
git stash apply [stash@{n}]
git stash pop   [stash@{n}]
git stash drop  [stash@{n}]
git stash clear

# Branch aus Stash
git stash branch mein-branch stash@{n}

# Einzelne Datei zurückholen
git checkout stash@{n} -- path/to/file
```

---

## Beispielsession

```bash
# Änderungen vorhanden
git status
#  geändert: src/App.jsx
#  untracked: src/styles/new-theme.css

# Änderungen inkl. untracked stashen
git stash push -u -m "WIP: neues Theme"

# Prüfen
git stash list
# stash@{0}: On feature/layout: WIP: neues Theme

# Branch wechseln, updaten, zurück
git checkout main
git pull --rebase
git checkout feature/layout

# Stash wieder anwenden
git stash apply stash@{0}

# Wenn alles passt, löschen
git stash drop stash@{0}
```

---

## FAQ

**Enthält ein Stash Submodule?**
Nein, Submodule müssen separat committet oder gestasht werden.

**Ist `git stash save` veraltet?**
Ja, empfohlen ist `git stash push -m`.

**Kann man Stashes teilen?**
Nicht direkt. Lege einen Branch mit `git stash branch` an oder exportiere ihn über `git format-patch`.

---

Mit diesen Mustern und Befehlen kannst du Git Stash sicher einsetzen, um Arbeit zwischenzuspeichern, den Kontext zu wechseln und später exakt dort weiterzumachen – ohne deine Commit-Historie mit unfertigen Zwischenständen zu belasten.
