---
title: Verständnis von Commits und Historie
---

## 1. Was ist ein Commit?

Ein **Commit** in Git stellt einen Schnappschuss deines Projekts zu einem bestimmten Zeitpunkt dar.  
Wenn du committest, speicherst du den aktuellen Zustand deiner Dateien (die zuvor gestaged wurden) in der Historie des Repositories.

Jeder Commit enthält:

- Eine **eindeutige Kennung (SHA-Hash)** — ein 40-stelliger Code, der jeden Commit unverwechselbar macht.
- **Autor-Informationen** — Name und E-Mail-Adresse der Person, die die Änderung durchgeführt hat.
- Einen **Zeitstempel** — wann der Commit erstellt wurde.
- Eine **Commit-Nachricht** — eine kurze Beschreibung, die den Zweck der Änderung erklärt.
- Einen **Verweis auf Eltern-Commits** — wodurch die Historie und die Verbindung der Commits sichtbar werden.

---

## 2. Warum Commits wichtig sind

Commits sind das Herzstück der Versionskontrolle. Sie ermöglichen dir:

- **Änderungen nachzuverfolgen** und die Entwicklung des Projekts zu verstehen.
- **Zurückzuspringen**, falls ein stabiler Zustand benötigt wird.
- **Effektiv zusammenzuarbeiten**, da jeder sehen kann, wer was geändert hat und warum.
- **Verantwortlichkeiten nachzuvollziehen** durch die Commit-Historie.
- **Sicher zu experimentieren**, indem man Branches erstellt, committet und später entscheidet, ob man die Änderungen zusammenführt oder verwirft.

---

## 3. Commit-Historie anzeigen

Git bietet Werkzeuge, um die Commit-Historie zu erkunden.

### Basis-Log

```bash
git log
```

Dies zeigt:

* Den Commit-Hash (eindeutige ID).
* Den Namen und die E-Mail des Autors.
* Das Datum des Commits.
* Die Commit-Nachricht.

### Vereinfachtes Log

```bash
git log --oneline
```

Dies zeigt jeden Commit in einer einzelnen Zeile — praktisch für eine schnelle Übersicht.

Beispielausgabe:

```bash
a1b2c3d Fix Login-Button-Ausrichtung
f4e5g6h Benutzer-Authentifizierung hinzugefügt
i7j8k9l Initial Commit
```

### Branches und Historie visualisieren

```bash
git log --oneline --graph --all
```

Dies zeigt ein textbasiertes Diagramm mit Branches und der Verbindung zwischen Commits.

---

## 4. Änderungen in Commits inspizieren

Du kannst dir im Detail anschauen, was in einem Commit geändert wurde.

* Änderungen des letzten Commits anzeigen:

```bash
git show
```

* Änderungen für einen bestimmten Commit anzeigen:

```bash
git show <commit-hash>
```

* Unterschiede zwischen zwei Commits vergleichen:

```bash
git diff <commit1> <commit2>
```

---

## 5. In der Commit-Historie navigieren

Manchmal musst du zu älteren Ständen zurückkehren oder durch die Historie navigieren.

* **Einen älteren Commit auschecken** (Detached HEAD-Zustand):

```bash
git checkout <commit-hash>
```

* **Zurück zum neuesten Commit im Main-Branch**:

```bash
git checkout main
```

* **Änderungen durch Reset rückgängig machen** (Vorsicht: destruktiv):

```bash
git reset --hard <commit-hash>
```

---

## 6. Best Practices für Commits

* **Kleine, fokussierte Commits**
  Jeder Commit sollte eine logische, abgeschlossene Änderung repräsentieren.

* **Aussagekräftige Commit-Nachrichten**
  Eine gute Nachricht erklärt *was* geändert wurde und *warum*.
  Beispiel:

  ```bash
  Validierung der Benutzereingabe für E-Mail hinzugefügt
  ```

* **Häufig committen**
  So entstehen mehr Wiederherstellungspunkte, und das Debugging wird einfacher.

* **Keine großen Binärdateien committen**
  Git ist optimiert für Quellcode und textbasierte Dateien.

---

## 7. Zusammenfassung

* Ein **Commit** ist ein Schnappschuss der Projekt-Historie.
* Commits helfen, **Änderungen nachzuvollziehen, zusammenzuarbeiten und notfalls zurückzugehen**.
* Mit `git log`, `git show` und `git diff` kannst du die Historie untersuchen.
* Gute Commit-Praktiken sorgen für Klarheit und bessere Teamarbeit.

Das Verständnis von Commits und Historie gibt dir die volle Kontrolle über die Zeitreise deines Projekts.
