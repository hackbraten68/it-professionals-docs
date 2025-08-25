---
title: Auflösen von Merge-Konflikten
---

Beim Arbeiten mit Git treten **Merge-Konflikte** auf, wenn zwei Branches denselben Teil einer Datei verändert haben oder wenn Git die Unterschiede zwischen Branches nicht automatisch zusammenführen kann. Merge-Konflikte sind ein normaler Bestandteil kollaborativer Entwicklung und müssen manuell gelöst werden, bevor ein Merge abgeschlossen werden kann.

---

## Was ist ein Merge-Konflikt?

Ein Merge-Konflikt entsteht, wenn Git versucht, zwei Änderungsstände zu kombinieren, aber nicht weiß, welche Version übernommen werden soll. Typische Fälle sind:

- Zwei Entwickler bearbeiten dieselbe Zeile einer Datei.
- Ein Entwickler bearbeitet eine Datei, während ein anderer sie löscht.

---

## Wie Git Konflikte darstellt

Wenn ein Konflikt auftritt, stoppt Git den Merge-Vorgang und markiert die betroffene Datei. Git fügt spezielle Marker ein, um die Konfliktstellen sichtbar zu machen:

```diff
<<<<<<< HEAD
Dies ist aus dem main-Branch
=======
Dies ist aus feature-login
>>>>>>> feature-login
```

* `<<<<<<< HEAD`
  Inhalt aus dem Branch, **in den gemergt wird** (z. B. `main`).
* `=======`
  Trenner zwischen den beiden Änderungen.
* `>>>>>>> feature-login`
  Inhalt aus dem Branch, **der gemergt wird** (hier: `feature-login`).

---

## Konfliktdateien identifizieren

Nach Auftreten eines Konflikts:

```bash
git status
```

Git zeigt alle betroffenen Dateien unter **„Unmerged paths“** an. Diese müssen gelöst werden, bevor der Merge abgeschlossen werden kann.

---

## Schritte zum Lösen eines Merge-Konflikts

1. **Konfliktdatei öffnen**
   Die markierten Abschnitte prüfen und entscheiden, welche Änderungen behalten werden sollen. Möglichkeiten:

   * Eine Seite übernehmen (`HEAD` oder `feature-login`)
   * Beide Änderungen kombinieren
   * Eine komplett neue Lösung schreiben

2. **Datei manuell bearbeiten**
   Konfliktmarker (`<<<<<<<`, `=======`, `>>>>>>>`) entfernen und den finalen gewünschten Inhalt behalten.
   Beispiel einer gelösten Datei:

   ```text
   Dies ist der endgültige Inhalt nach der Konfliktlösung.
   ```

3. **Datei als gelöst markieren (stagen)**

   ```bash
   git add dateiname
   ```

   Dadurch weiß Git, dass der Konflikt behoben wurde.

4. **Merge committen**

   ```bash
   git commit
   ```

   Git erstellt automatisch eine Commit-Nachricht, die den Merge und die Konfliktlösung dokumentiert.

---

## Praktisches Beispiel

Angenommen, beide Branches ändern dieselbe Datei `login.js`:

* **`main`-Branch Version:**

  ```javascript
  console.log("Benutzer wird eingeloggt...");
  ```

* **`feature-login`-Branch Version:**

  ```javascript
  console.log("Benutzer wird authentifiziert...");
  ```

Nach dem Merge zeigt Git:

```javascript
<<<<<<< HEAD
console.log("Benutzer wird eingeloggt...");
=======
console.log("Benutzer wird authentifiziert...");
>>>>>>> feature-login
```

### Mögliche Lösungen:

* Nur `main` behalten:

  ```javascript
  console.log("Benutzer wird eingeloggt...");
  ```

* Nur `feature-login` behalten:

  ```javascript
  console.log("Benutzer wird authentifiziert...");
  ```
  
* Beide Änderungen kombinieren:

  ```javascript
  console.log("Benutzer wird eingeloggt und authentifiziert...");
  ```

---

## Werkzeuge zur Konfliktlösung

* **Manuelle Bearbeitung** (z. B. in VS Code, IntelliJ, Vim)
* **Git-GUIs** (z. B. GitKraken, SourceTree, GitHub Desktop)
* **Editor-Integrationen** (z. B. visuelle Merge-Tools in VS Code)

Diese Tools helfen oft, Konflikte übersichtlich darzustellen und die Auswahl per Klick vorzunehmen.

---

## Best Practices

* **Regelmäßig pullen**, um die eigene Branch aktuell zu halten und Konflikte zu reduzieren.
* **Kleine, fokussierte Commits** erstellen – das erleichtert die Konfliktlösung.
* **Im Team kommunizieren**, wenn an denselben Dateien gearbeitet wird.
* **Rebase bewusst einsetzen**: Rebase kann ebenfalls Konflikte erzeugen, hilft aber, eine saubere Historie zu bewahren.

---

## Zusammenfassung

* Merge-Konflikte entstehen, wenn Git Änderungen nicht automatisch zusammenführen kann.
* Git markiert Konfliktstellen mit `<<<<<<<`, `=======`, `>>>>>>>`.
* Lösung: Datei bearbeiten → Marker entfernen → Datei stagen → Merge committen.
* Tools und Best Practices helfen, Konflikte zu vermeiden oder schneller zu lösen.

Durch das Verständnis von Merge-Konflikten und deren Auflösung können Entwickler effektiv im Team arbeiten und eine saubere Codebasis beibehalten.
