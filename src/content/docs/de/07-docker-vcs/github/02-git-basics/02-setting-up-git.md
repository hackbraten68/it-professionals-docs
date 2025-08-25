---
title: Git-Lebenszyklus
---

## Einführung

Git ist ein **verteiltes Versionskontrollsystem (DVCS)**, das Änderungen an Dateien und Projekten verwaltet.  
Eines der wichtigsten Konzepte beim Erlernen von Git ist der **Lebenszyklus einer Datei**.  
Jede Datei in einem Git-Projekt befindet sich in einem von mehreren Zuständen, und Entwickler bewegen Dateien zwischen diesen Zuständen, während sie an Projekten arbeiten.

---

## Überblick über den Git-Lebenszyklus

Jede Datei in Git durchläuft einen Zyklus, der dabei hilft, Änderungen nachzuverfolgen und zu verwalten. Die drei Hauptphasen sind:

1. **Arbeitsverzeichnis (Working Directory)** – hier liegen die Projektdateien lokal.  
2. **Staging-Bereich (Staging Area)** – hier werden Änderungen vorbereitet.  
3. **Repository** – hier werden die eingespielten Snapshots dauerhaft gespeichert.  

Es ist wichtig zu verstehen, dass Git nicht automatisch jede Änderung speichert. Du entscheidest, was aufgenommen, committet oder verworfen wird.

---

## 1. Arbeitsverzeichnis (Working Directory)

Das **Arbeitsverzeichnis** ist der lokale Ordner auf deinem Rechner, in dem deine Projektdateien liegen.

- Hier bearbeitest, erstellst oder löschst du Dateien aktiv.  
- Dateien können unterschiedliche Zustände haben:
  - **Untracked (nicht verfolgt)**: Dateien, die Git noch nicht überwacht.  
  - **Modified (geändert)**: Dateien, die bereits unter Versionskontrolle stehen, aber seit dem letzten Commit verändert wurden.  
  - **Deleted (gelöscht)**: Dateien, die entfernt wurden, aber in Git noch nicht aktualisiert sind.  

### Beispielbefehle
```bash
git status       # Zeigt den Zustand der Dateien im Arbeitsverzeichnis
git add <file>   # Verschiebt Änderungen vom Arbeitsverzeichnis in den Staging-Bereich
```

---

## 2. Staging-Bereich (Staging Area)

Der **Staging-Bereich** (auch **Index** genannt) ist wie eine **Vorbereitungsliste**.
Hier entscheidest du, welche Änderungen im nächsten Commit enthalten sein sollen.

* Mit `git add` legst du Änderungen in den Staging-Bereich.
* So kannst du gezielt bestimmen, welche Änderungen übernommen werden.
* Du kannst mehrere Dateien oder sogar nur Teile einer Datei aufnehmen.

### Beispielbefehle

```bash
git add file1.txt       # Eine einzelne Datei zum Staging-Bereich hinzufügen
git add .               # Alle Änderungen im aktuellen Verzeichnis aufnehmen
git reset file1.txt     # Eine Datei wieder aus dem Staging-Bereich entfernen
```

---

## 3. Repository

Das **Repository** ist die Datenbank, in der Git die **committeten Snapshots** deines Projekts speichert.

* Ein **Commit** ist ein dauerhafter Snapshot der Dateien im Staging-Bereich.
* Commits bilden eine Zeitleiste deiner Projektgeschichte.
* Jeder Commit enthält:

  * Eine eindeutige ID (SHA-Hash)
  * Informationen über den Autor
  * Eine Commit-Nachricht
  * Referenzen auf vorherige Commits

### Beispielbefehle

```bash
git commit -m "Neue Funktion hinzugefügt"   # Erzeugt einen neuen Commit mit den gestagten Änderungen
git log                                     # Zeigt die Commit-Historie
```

---

## Ablauf des Lebenszyklus in der Praxis

So bewegt sich eine Datei typischerweise durch den Lebenszyklus:

1. **Datei erstellen/ändern** → Datei erscheint als *untracked* oder *modified* im **Arbeitsverzeichnis**.
2. **Änderungen aufnehmen** → Mit `git add` verschiebst du Änderungen in den **Staging-Bereich**.
3. **Commit** → Mit `git commit` speicherst du die Änderungen dauerhaft im **Repository**.

---

## Visualisierung des Git-Lebenszyklus

```bash
Arbeitsverzeichnis  →  Staging-Bereich  →  Repository
        (edit)            (git add)          (git commit)
```

* **Arbeitsverzeichnis** = Sandbox zum Bearbeiten
* **Staging-Bereich** = Checkliste der Änderungen für den Commit
* **Repository** = Dauerhafte Historie der Commits

---

## Wichtige Erkenntnisse

* Git-Dateien bewegen sich durch **Arbeitsverzeichnis → Staging-Bereich → Repository**.
* Das **Arbeitsverzeichnis** ist der Ort, an dem du Änderungen machst.
* Der **Staging-Bereich** erlaubt dir, gezielt vorzubereiten, was in den nächsten Commit soll.
* Das **Repository** ist die dauerhafte Projekthistorie.
* Wer diesen Lebenszyklus versteht, hat die volle Kontrolle darüber, was gespeichert und geteilt wird.
