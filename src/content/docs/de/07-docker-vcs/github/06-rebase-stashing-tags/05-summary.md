---
title: Zusammenfassung
---
# Zusammenfassung

In Git gibt es mehrere Funktionen, die dir helfen, deine Arbeit effektiver zu verwalten. Jede hat einen anderen Zweck, aber zusammen verbessern sie die Zusammenarbeit, die Nachverfolgung der Historie und die Effizienz des Workflows. Dieser Abschnitt fasst drei wichtige Konzepte zusammen: **Rebase**, **Stashing** und **Tags**.

---

## Rebase

**Definition:**
Rebase ermöglicht es dir, Commits auf einen anderen Branch zu verschieben oder erneut anzuwenden. Es wird oft verwendet, um die neuesten Änderungen aus einem Hauptbranch in deinen Feature-Branch zu integrieren, ohne Merge-Commits einzuführen.

**Wichtige Vorteile:**

* Hält die Commit-Historie **linear und sauber**.
* Macht es einfacher, den Projektverlauf nachzuvollziehen.
* Nützlich, um einen Feature-Branch mit den neuesten Änderungen zu aktualisieren.

**Vorsicht:**

* Rebase **schreibt die Historie um**, was Probleme verursachen kann, wenn andere am gleichen Branch arbeiten.
* Vermeide das Rebasen von gemeinsamen/öffentlichen Branches, es sei denn, du hast dich mit deinem Team abgestimmt.

**Wichtiger Hinweis:**
Wenn du nach einem Rebase pushen musst, brauchst du oft:

```bash
git push --force
```

⚠️ Vorsicht: `--force` kann die Remote-Historie überschreiben und die Arbeit anderer zerstören. Kommuniziere immer mit deinem Team, bevor du es benutzt.

---

## Stashing

**Definition:**
Stashing ermöglicht es dir, **nicht commitete Änderungen vorübergehend zu speichern**, ohne sie in deinem Branch zu committen. Es ist wie Arbeit beiseitelegen, damit du später darauf zurückkommen kannst.

**Typische Anwendungsfälle:**

* Du möchtest den Branch wechseln, hast aber lokale Änderungen, die du noch nicht committen willst.
* Du brauchst ein sauberes Arbeitsverzeichnis zum Testen, Debuggen oder zum Holen von Updates.

**Grundlegende Befehle:**

```bash
# Änderungen in einem neuen Stash speichern
git stash

# Alle Stashes auflisten
git stash list

# Den neuesten Stash anwenden (bleibt in der Liste)
git stash apply

# Anwenden und aus der Liste entfernen
git stash pop

# Den neuesten Stash löschen, ohne ihn anzuwenden
git stash drop
```

**Tipp:** Du kannst einem Stash auch einen beschreibenden Namen geben:

```bash
git stash save "WIP: Layout-Bug beheben"
```

---

## Tags

**Definition:**
Tags sind Verweise, die auf bestimmte Commits in der Git-Historie zeigen. Sie werden typischerweise verwendet, um **Releases** (z. B. `v1.0`, `v2.0-beta`) oder andere wichtige Punkte im Projekt zu markieren.

**Arten von Tags:**

1. **Leichte Tags** – einfache Zeiger auf einen Commit (wie ein Lesezeichen).
2. **Annotierte Tags** – enthalten Metadaten wie Autor, Datum und eine Nachricht (empfohlen für Releases).

**Beispiele:**

```bash
# Einen leichten Tag erstellen
git tag v1.0

# Einen annotierten Tag erstellen
git tag -a v1.0 -m "Release Version 1.0"

# Alle Tags auflisten
git tag

# Einen einzelnen Tag pushen
git push origin v1.0

# Alle Tags pushen
git push --tags
```

---

## Abschließender Tipp

* **Rebase**: Großartig, um die Historie sauber zu halten, aber gefährlich, wenn es unvorsichtig eingesetzt wird.
* **Stashing**: Ideal, um temporäre Arbeit zu sichern, ohne sie zu committen.
* **Tags**: Unverzichtbar, um Projektmeilensteine und Releases zu markieren.

👉 **Goldene Regel:** Wenn du **rebase** benutzt und danach **force push**, informiere immer dein Team. Fehlende Kommunikation hier kann in einem kollaborativen Workflow große Probleme verursachen.
