---
title: Was ist Rebase
---

## Einführung

In Git ist **Rebase** ein Befehl, der es ermöglicht, eine Reihe von Commits auf einen neuen Basis-Commit zu verschieben oder miteinander zu kombinieren.  
Dadurch wird die Commit-Historie sauberer, linearer und besser lesbar im Vergleich zu Merge-Commits.  

Rebase ist eines der mächtigsten Werkzeuge in Git, erfordert jedoch vorsichtigen Einsatz, da es die Historie neu schreibt.

---

## Warum Rebase verwenden?

Rebase wird häufig eingesetzt, um:

- **Commit-Historie bereinigen:** Statt vieler verstreuter Commits kann man diese zu einer sauberen, linearen Historie umschreiben.  
- **Unnötige Merge-Commits vermeiden:** Merges erzeugen oft zusätzliche Commits (z. B. "Merge branch main into feature"), die die Historie unübersichtlich machen. Rebase wendet Änderungen direkt an und vermeidet so diese zusätzlichen Commits.  
- **Einen Feature-Branch mit den neuesten Änderungen von `main` aktualisieren:** Rebase sorgt dafür, dass der Feature-Branch auf den aktuellsten Commits von `main` aufsetzt.  

---

## Wie funktioniert Rebase?

Stellen wir uns folgende Situation vor:

- Du hast einen `main`-Branch mit den Commits `A–B–C`.  
- Du hast einen `feature`-Branch erstellt und dort die Commits `D–E` gemacht.  

Später hat `main` einen neuen Commit `F` erhalten.  
Die Branches sehen nun so aus:

```bash
main:    A -- B -- C -- F
feature:             -- D -- E
```

Wenn du nun im `feature`-Branch `git rebase main` ausführst, passiert Folgendes:

1. Git entfernt die Commits `D` und `E` temporär.  
2. Der Branch-Zeiger wird auf den neuesten Commit von `main` (`F`) gesetzt.  
3. Git spielt die Commits `D` und `E` auf `F` neu ab.  

Die Historie sieht danach so aus:

```bash
main:    A -- B -- C -- F
feature:                   -- D' -- E'
```

Beachte: `D'` und `E'` sind **neue (umgeschriebene) Versionen** der alten Commits, die auf die neue Basis verschoben wurden.  

---

## Wichtige Rebase-Befehle

### Rebase auf `main`

```bash
git checkout feature
git fetch origin
git rebase origin/main
```

Damit wird dein Feature-Branch auf den neuesten Stand von `main` gebracht – ohne einen zusätzlichen Merge-Commit zu erzeugen.

---

### Interaktives Rebase

```bash
git rebase -i HEAD~3
```

* `-i` steht für *interactive*.
* Es öffnet einen Editor, in dem du auswählen kannst, ob du Commits **squashen, editieren, umbenennen oder löschen** möchtest.

Typische Anwendungsfälle:

* Mehrere kleine Commits zu einem sinnvollen Commit zusammenfassen (squash).
* Commit-Nachrichten anpassen, um sie aussagekräftiger zu machen.
* Überflüssige Commits entfernen.

---

## Rebase vs. Merge

| **Aspekt**     | **Rebase**                                 | **Merge**                                 |
| -------------- | ------------------------------------------ | ----------------------------------------- |
| Historie       | Linear, sauber                             | Verzweigt, enthält ggf. Merge-Commits     |
| Sicherheit     | Schreibt Historie neu (Vorsicht in Teams!) | Bewahrt die gesamte Historie unverändert  |
| Anwendungsfall | Feature-Branch aktualisieren               | Branches zusammenführen, ohne Umschreiben |

---

## Wichtige Hinweise

* **Nie öffentliche/geteilte Branches rebasen:** Da Rebase die Historie neu schreibt, kann dies Probleme verursachen, wenn andere Entwickler bereits auf den alten Commits aufbauen.
* **Private Branches sind sicher:** Wenn nur du auf einem Branch arbeitest, ist Rebase ein hervorragendes Werkzeug.
* **Konflikte sind möglich:** Wie bei Merges kann es beim Rebase zu Konflikten kommen, die manuell gelöst werden müssen.

---

## Beispiel-Workflow

1. Neuen Feature-Branch erstellen:

   ```bash
   git checkout -b feature/mein-feature
   ```
2. Mehrere Commits hinzufügen.
3. Vor dem Pull Request den Branch aktualisieren:

   ```bash
   git fetch origin
   git rebase origin/main
   ```
4. Konflikte lösen und fortsetzen:

   ```bash
   git add .
   git rebase --continue
   ```
5. Rebasierten Branch pushen (**Force Push erforderlich**):

   ```bash
   git push --force
   ```

---

## Zusammenfassung

* **Rebase** verschiebt oder kombiniert Commits auf eine neue Basis.
* Es sorgt für eine **klare, lineare Historie**, die leicht zu lesen ist.
* Am besten für **lokale oder private Branches**, um den Code vor dem Merge aufzubereiten.
* Mit **interaktivem Rebase** lässt sich die Commit-Historie aufpolieren.
* Niemals rebasen, wenn der Branch bereits von anderen genutzt wird.

Richtig eingesetzt, ist Rebase eines der wirkungsvollsten Werkzeuge, um die Historie eines Git-Projekts übersichtlich und wartbar zu halten.
