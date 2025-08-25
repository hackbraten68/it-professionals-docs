---
title: Merging Branches
---
# Branches zusammenführen (Merging Branches)

Ein Merge kombiniert die Historien zweier Branches, sodass die Änderungen aus einem Branch Teil eines anderen werden. In der täglichen Arbeit wird meist ein **Feature-Branch** in den **main**- (oder **develop**-) Branch gemergt, sobald die Funktion fertig ist.

---

## Schnellstart

```bash
# 1) In den Branch wechseln, der die Änderungen erhalten soll
git checkout main

# 2) Den Feature-Branch hinein mergen
git merge feature-login
```

Wenn Git die Änderungen automatisch kombinieren kann, entsteht entweder ein **Fast-Forward Merge** (kein Merge-Commit) oder ein **Three-Way Merge** (mit Merge-Commit). Wenn Konflikte auftreten, stoppt Git und fordert dich auf, sie zu lösen.

---

## Grundkonzepte

### Merge Base

Beim Mergen sucht Git die **gemeinsame Basis** (Merge Base) – also den letzten gemeinsamen Vorfahren beider Branches – und vergleicht alle Änderungen, die seit diesem Punkt gemacht wurden. Deshalb ist eine saubere Historie (kleine, fokussierte Commits; häufiges Rebasen von Feature-Branches) entscheidend, um Merges einfach zu halten.

### Merge-Typen

* **Fast-Forward Merge**
  Tritt auf, wenn sich der Ziel-Branch nicht verändert hat, seit der Feature-Branch abgezweigt wurde. Git verschiebt einfach den Branch-Zeiger nach vorne – es entsteht **kein Merge-Commit**.

  ```bash
  git checkout main
  git merge --ff-only feature-login
  # Erzwingt, dass nur ein Fast-Forward ausgeführt wird; sonst Abbruch
  ```

* **Three-Way Merge (Merge-Commit)**
  Tritt auf, wenn beide Branches sich unabhängig weiterentwickelt haben. Git vergleicht **(main, feature, merge base)** und erstellt einen neuen **Merge-Commit** mit zwei Eltern.

  ```bash
  git checkout main
  git merge feature-login
  # Erstellt einen Merge-Commit, falls notwendig
  ```

---

## Wichtige Merge-Optionen

* `--ff`, `--ff-only`, `--no-ff`

  * `--ff-only`: erlaubt Merge nur, wenn Fast-Forward möglich ist.
  * `--no-ff`: erzwingt immer einen Merge-Commit (nützlich, um Feature-Kontext zu erhalten).

* `--squash`
  Fasst alle Commits des Source-Branches zu einem einzigen Commit zusammen, **ohne Merge-Commit** und ohne Branch-Topologie zu speichern.

  ```bash
  git checkout main
  git merge --squash feature-login
  git commit -m "feat(login): add login flow (squashed)"
  ```

* `--no-commit`
  Führt den Merge aus, stoppt aber vor dem Commit, sodass du das Ergebnis noch anpassen kannst.

  ```bash
  git merge --no-commit feature-login
  # Änderungen prüfen, ggf. anpassen, dann:
  git commit
  ```

* `-m "Nachricht"`
  Ermöglicht eine eigene Merge-Commit-Nachricht.

* Strategien:

  * `-s ours`: behält nur die aktuelle Branch-Version (selten).
  * `-X ours` / `-X theirs`: entscheidet bei Konflikten automatisch für eine Seite.

---

## Konfliktlösung

Wenn Änderungen kollidieren, markiert Git **Konflikte** und pausiert den Merge.

1. **Merge starten**

   ```bash
   git checkout main
   git merge feature-login
   # CONFLICT (content): Merge-Konflikt in src/auth/login.ts
   ```

2. **Konflikte ansehen**
   Im Editor erscheinen Markierungen:

   ```text
   <<<<<<< HEAD
   Version des aktuellen Branches
   =======
   Version des gemergten Branches
   >>>>>>> feature-login
   ```

3. **Konflikte lösen**
   Datei bearbeiten, richtige Inhalte kombinieren, Marker entfernen.

4. **Als gelöst markieren**

   ```bash
   git add src/auth/login.ts
   ```

5. **Fortsetzen oder abbrechen**

   ```bash
   git commit                # Merge-Commit erstellen
   # oder
   git merge --continue      # falls Git dies verlangt
   # oder komplett abbrechen:
   git merge --abort
   ```

### Hilfreiche Werkzeuge

* **Status & Diff**

  ```bash
  git status
  git diff
  git diff --staged
  ```

* **Mergetool starten**

  ```bash
  git mergetool
  ```

* **Ergebnis prüfen**

  ```bash
  git log --graph --oneline --decorate
  git show
  ```

---

## Welche Strategie wählen?

* **Fast-Forward bevorzugen**, wenn:

  * Feature klein oder kurzlebig ist.
  * Du lineare Historie erzwingen willst (`--ff-only`).

* **Merge-Commits (`--no-ff`) bevorzugen**, wenn:

  * Feature-Kontext erhalten bleiben soll.
  * Branch mehrere aussagekräftige Commits enthält.

* **Squash-Merge bevorzugen**, wenn:

  * Du nur **einen sauberen Commit** in `main` haben willst.
  * Feature-Historie nicht im Hauptverlauf erscheinen soll.

---

## Merge vs Rebase (Kurzvergleich)

* **Merge**: bewahrt Branch-Topologie, zeigt Zusammenführungen explizit.
* **Rebase**: schreibt Historie um, macht sie linear, aber verändert Commit-IDs.

**Praxis:**
Feature-Branch regelmäßig auf `main` rebasen, dann Fast-Forward in `main` mergen:

```bash
git checkout feature-login
git fetch origin
git rebase origin/main
git checkout main
git merge --ff-only feature-login
```

---

## Erweiterte Themen

* **Unrelated Histories**:

  ```bash
  git merge other-branch --allow-unrelated-histories
  ```

* **Binärdateien & Merge-Treiber**:
  Konflikte lassen sich nicht automatisch lösen → `.gitattributes` verwenden.

* **Rerere aktivieren** (merkt sich frühere Konfliktlösungen):

  ```bash
  git config --global rerere.enabled true
  ```

* **Nur bestimmte Dateien mergen**:

  ```bash
  git checkout main
  git checkout feature-login -- src/auth/ src/ui/LoginForm.tsx
  git commit -m "merge auth UI from feature-login"
  ```

* **Octopus-Merges (mehrere Branches gleichzeitig)**:

  ```bash
  git checkout main
  git merge feature-a feature-b feature-c
  ```

---

## Best Practices im Team

* `main` schützen (PRs, Reviews, Tests erzwingen).
* Merge-Strategie im Team klar definieren (`--no-ff`, Squash etc.).
* Commit-Messages einheitlich halten (z. B. Conventional Commits).
* Kleine, fokussierte Feature-Branches verwenden.
* Merge nur, wenn CI erfolgreich ist.

---

## Häufige Probleme

* **“Automatic merge failed”** → Konflikte lösen, `git add`, dann `git commit`.
* **“Not possible to fast-forward”** → Feature-Branch rebasen.
* **Falschen Branch gemergt** → `git reset --hard` (falls unpushed) oder Merge-Commit mit `git revert -m 1 <sha>` rückgängig machen.
* **Nachricht ändern** → `git commit --amend` (falls unpushed).

---

## Beispiele

* **Feature-Kontext behalten (immer Merge-Commit)**:

  ```bash
  git checkout main
  git merge --no-ff feature-login -m "merge: integrate feature-login"
  ```

* **Lineare Historie erzwingen**:

  ```bash
  git checkout main
  git merge --ff-only feature-login
  ```

* **Squash-Merge für sauberen Commit**:

  ```bash
  git checkout main
  git merge --squash feature-login
  git commit -m "feat(login): add form, validation, API hook"
  ```

---

## Historie prüfen

* Grafische Ansicht:

  ```bash
  git log --graph --oneline --decorate --all
  ```

* Merge-Commit anzeigen:

  ```bash
  git show <merge-commit-sha>
  ```

---

## Checkliste vor dem Merge

* [ ] Branch mit `main` synchronisiert
* [ ] Tests laufen grün (lokal & CI)
* [ ] Konflikte gelöst
* [ ] Commit-Messages klar
* [ ] Merge-Strategie bewusst gewählt

---

## Übung

1. Repo erstellen, Branch `feature-a` anlegen.
2. In beiden Branches denselben Codeabschnitt ändern → Konflikt provozieren.
3. Merge versuchen, Konflikte lösen, committen.
4. Historie mit `git log --graph` anschauen.
5. Mit `--no-ff` und `--squash` wiederholen und Unterschiede vergleichen.

---

### Zusammenfassung

* **Fast-Forward**: kein Merge-Commit, einfaches Verschieben.
* **Three-Way Merge**: erstellt Merge-Commit, Historie bleibt vollständig.
* **Squash**: fasst Änderungen zu einem Commit zusammen.
* Regel: Branches klein halten, regelmäßig aktualisieren, Merge-Strategie bewusst einsetzen.
