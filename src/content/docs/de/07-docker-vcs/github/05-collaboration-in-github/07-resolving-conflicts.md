---
title: Konflikte lösen
---
# Konflikte lösen — Ein praktischer, umfassender Leitfaden

Konflikte treten auf, wenn Git Änderungen aus verschiedenen Commits oder Branches nicht automatisch zusammenführen kann. Sie sind ein natürlicher Teil der Zusammenarbeit — kein Fehler. Dieser Leitfaden erklärt **warum Konflikte entstehen**, **wie man sie sicher löst** und **wie man ihre Häufigkeit reduziert**. Er ist für den praktischen Einsatz in Kursen, Workshops und beim Teambuilding gedacht.

---

## 1) Was ist ein Merge-Konflikt?

Ein Merge-Konflikt entsteht, wenn Git beim automatischen **Drei-Wege-Merge** nicht entscheiden kann, welche Version einer Zeile (oder eines Blocks) beibehalten werden soll. Typische Fälle:

- Zwei Personen bearbeiten dieselben Zeilen in derselben Datei.
- Ein Branch benennt eine Datei um oder löscht sie, während ein anderer Branch sie bearbeitet.
- Rewriting der Historie (z. B. **Rebase**) ändert die Commit-Reihenfolge, sodass inkompatible Änderungen entstehen.

Konflikte können auftreten bei:

- `git merge`
- `git rebase`
- `git cherry-pick`
- `git revert`
- `git stash pop` / `git stash apply`

---

## 2) Schneller Lösungsablauf (Cheat Sheet)

```bash
# 0) Sicherstellen, dass der Arbeitsbereich sauber ist (commit oder stash lokale Änderungen)
git status

# 1) Lokalen main-Branch aktualisieren
git checkout main
git pull
git checkout feature/my-feature
git merge main       # oder: git rebase main

# 2) Konflikte in den von `git status` angezeigten Dateien beheben

git add <gefixte-Dateien>
git commit           # bei merge
# oder:
git rebase --continue

# 3) Getesteten Stand pushen
git push
````

> Dein ursprüngliches Beispiel:
>
> ```bash
> git checkout feature/my-feature
> git pull origin main
> # Konflikte im Editor beheben
> git add .
> git commit -m "Resolved merge conflicts"
> git push
> ```

---

## 3) Konflikt-Markierungen erkennen

Bei einem Konflikt setzt Git **Konflikt-Markierungen** in Dateien ein:

```diff
<<<<<<< HEAD
console.log("Willkommen!");
=======
console.log("Hallo!");
>>>>>>> feature/new-greeting
```

* `<<<<<<< HEAD` = Version deines aktuellen Branches
* `=======`      = Trenner
* `>>>>>>> other-branch` = Version des eingehenden Branches

**Aufgabe:** Datei so bearbeiten, dass das gewünschte Endergebnis entsteht, und alle Marker entfernen.

---

## 4) Die sichere Schritt-für-Schritt-Methode

### A) Vorbereiten und Mergen (oder Rebasen)

1. **Main synchronisieren**

   ```bash
   git checkout main
   git pull
   ```

2. **Feature-Branch aktualisieren**

   ```bash
   git checkout feature/my-feature
   git merge main         # integriert main in deinen Branch
   # ODER:
   git rebase main        # spielt deine Commits auf main erneut ab
   ```

> **Wann Merge, wann Rebase?**
>
> * **Merge**: bewahrt den gesamten Verlauf, gut für Nachvollziehbarkeit.
> * **Rebase**: erstellt eine lineare, „aufgeräumte“ Historie, nützlich vor Pull Requests.
>   Wichtig: niemals Branches rebasen, die schon geteilt wurden.

### B) Konflikte prüfen

```bash
git status
```

Beispielausgabe:

```bash
both modified:   src/app.ts
deleted by them: docs/old-guide.md
```

### C) Dateien einzeln lösen

Optionen zum Vergleichen:

```bash
git diff --merge src/app.ts   # zeigt base/ours/theirs
git show :1:src/app.ts        # base
git show :2:src/app.ts        # ours (aktuell)
git show :3:src/app.ts        # theirs (eingehend)
```

Danach Dateien anpassen und Marker entfernen.

### D) Stagen und Fortfahren

* **Merge**:

  ```bash
  git add src/app.ts
  git commit -m "Konflikt in app.ts gelöst"
  ```

* **Rebase**:

  ```bash
  git add src/app.ts
  git rebase --continue
  ```

### E) Testen, Pushen, Verifizieren

```bash
npm test
git push
```

Falls du einen Rebase durchgeführt hast:

```bash
git push --force-with-lease
```

---

## 5) Besondere Konfliktszenarien

* **Gelöscht vs. Geändert**: entscheiden, ob Datei gelöscht oder behalten wird.
* **Umbenennungen**: finalen Namen wählen, Imports prüfen.
* **Binärdateien**: `--ours` oder `--theirs` verwenden, `.gitattributes` pflegen.
* **Große Konflikte**: Stückweise lösen und committen.
* **Automatische Strategien**: `-X ours` oder `-X theirs` für Standardentscheidungen.

---

## 6) Nützliche Werkzeuge

* **CLI**: `git mergetool` mit Tools wie `vimdiff`, `meld`, `kdiff3`.
* **Editoren**: VS Code, JetBrains IDEs, Sublime Merge mit grafischen Merge-Ansichten.

---

## 7) Konflikte beim Rebase

Rebase wiederholt Commits einzeln, Konflikte können mehrfach auftreten:

```bash
git rebase main
# Konflikte fixen
git add .
git rebase --continue
# überspringen:
git rebase --skip
# abbrechen:
git rebase --abort
```

Mit `git rebase -i` (interaktiv) lassen sich Commits squashen oder neu ordnen.

---

## 8) Konflikte für die Zukunft minimieren

* `.gitattributes` für Binärdateien oder Union-Merges.
* `rerere` aktivieren:

  ```bash
  git config --global rerere.enabled true
  ```
* Einheitliche Line-Endings mit:

  ```bash
  * text=auto
  ```

---

## 9) Team-Praktiken

* Kleine, fokussierte Pull Requests.
* Häufig mit `main` synchronisieren.
* Verantwortlichkeiten für Dateien abstimmen.
* Automatische Formatter einsetzen.
* Branch-Schutz und CI nutzen.
* Einheitliche Branch-Strategie vereinbaren.

---

## 10) Fehlerbehebung & Recovery

* Merge/Rebase abbrechen:

  ```bash
  git merge --abort
  git rebase --abort
  ```
* Falschen Push rückgängig machen: `git reflog` + `git push --force-with-lease`.
* Wiederkehrende Konflikte: ggf. squashen oder einmalig lösen.

---

## 11) Beispielablauf

```bash
git checkout main && git pull
git checkout feature/price-calculator
git merge main
# Konfliktmarker in src/calc.ts beheben
npm test
git add src/calc.ts
git commit -m "Konflikt in calc.ts gelöst (Tax-Rounding aus main übernommen)"
git push
```

---

## 12) Übungen für Schulungen

1. **Einfache Zeilenkonflikte** in `greeting.js`.
2. **Rename + Edit** bei `utils.js`.
3. **Binärkonflikt** mit Bildern.
4. **Rebase mit Mehrfachkonflikten**.

---

## 13) Wichtige Befehle im Überblick

```bash
git status
git diff --merge <file>
git merge main
git add <file>
git commit
git rebase main
git rebase --continue
git checkout --ours <file>
git checkout --theirs <file>
git mergetool
```

---

## 14) Checkliste vor dem Push

* [ ] Alle Konfliktmarker entfernt
* [ ] Code kompiliert & Tests grün
* [ ] Umbenennungen/Imports geprüft
* [ ] Commit-Nachricht erklärt Lösung
* [ ] Korrekt gepusht (`--force-with-lease` bei Rebase)
* [ ] Pull Request überprüft & CI grün

---

### Kernaussagen

* Konflikte sind normal – systematisch angehen.
* **Kleine, häufige Integrationen** reduzieren Risiko.
* Tools und Regeln (`rerere`, `.gitattributes`, Formatter) vereinfachen Konfliktlösung.
* Immer testen nach der Lösung.
* Frühzeitige Kommunikation im Team verhindert Eskalationen.
