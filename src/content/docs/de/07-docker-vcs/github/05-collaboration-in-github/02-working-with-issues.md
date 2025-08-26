---
title: Arbeiten mit Issues
---

GitHub **Issues** sind ein leistungsstarkes Werkzeug, um Aufgaben, Bugs und Feature-Anfragen zu verfolgen.  
Sie dienen als zentrale Plattform für Diskussionen über den Fortschritt eines Projekts und helfen Teams, organisiert zu bleiben.

---

## Warum Issues verwenden?

- **Bugs verfolgen:** Probleme im Code melden.  
- **Features planen:** Neue Funktionalitäten dokumentieren.  
- **Aufgaben zuweisen:** Verantwortlichkeiten im Team klar machen.  
- **Zusammenarbeit fördern:** Diskussionen direkt am Projekt führen.  
- **Transparenz schaffen:** Jeder sieht, woran gearbeitet wird.  

---

## Ein Issue erstellen

Wann immer ein Fehler entdeckt wird, eine neue Idee entsteht oder eine Frage auftaucht, kann ein Issue erstellt werden.

**Schritte zum Erstellen eines Issues:**

1. Gehe zum Tab **"Issues"** deines Repositories.  
2. Klicke auf **"New issue"**.  
3. Vergib einen **aussagekräftigen Titel** und eine **detaillierte Beschreibung** des Problems oder Features.  
4. Ergänze bei Bedarf weitere Informationen:  
   - **Zuweisung** an ein oder mehrere Teammitglieder.  
   - **Labels hinzufügen** (z. B. `bug`, `enhancement`, `help wanted`).  
   - **Milestones verknüpfen**, wenn das Issue zu einer bestimmten Version erledigt sein soll.  
5. Klicke auf **Submit new issue**.  

---

## Issues verwalten

- **Mitglieder zuweisen:** Jedes Issue sollte eine verantwortliche Person haben.  
- **Labels verwenden:** Strukturierung und Kategorisierung, z. B.:  
  - `bug`: Fehler oder defekte Funktionalität.  
  - `enhancement`: Verbesserungen oder neue Features.  
  - `documentation`: Aufgaben für Dokumentation.  
  - `help wanted` / `good first issue`: Ermutigung für Community-Beiträge.  
- **Milestones:** Mehrere Issues zu einem Ziel oder Release bündeln.  
- **Kommentare & Diskussionen:** Lösungen vorschlagen, Fragen stellen, Fortschritte dokumentieren.  

---

## Issues mit Code verknüpfen

Ein großer Vorteil von GitHub ist die direkte Verbindung zwischen Issues und Codeänderungen:

- **Commits:** Erwähne ein Issue in der Commit-Message mit `#Issue-Nummer`.  
  Beispiel:  
  ```bash
  git commit -m "Login-Fehler behoben #42"
  ```

→ Der Commit wird automatisch mit Issue #42 verknüpft.

* **Pull Requests:** Erwähne Issues in der PR-Beschreibung.
  Beispiel:

  ```bash
  Fixes #42
  ```

  → Sobald der PR gemergt wird, wird Issue #42 automatisch geschlossen.

---

## Best Practices

* **Beschreibend sein:** Klare Titel und ausführliche Beschreibungen verwenden.
* **Organisiert bleiben:** Labels und Milestones konsequent nutzen.
* **Code referenzieren:** Issues immer mit Commits und PRs verbinden, wenn möglich.
* **Abschließen, wenn gelöst:** Geschlossene Issues zeigen den Fortschritt.
* **Team einbeziehen:** Diskussionen nutzen, um alle einzubinden.

---

## Beispiel-Workflow

1. Ein Tester entdeckt einen Bug und erstellt ein neues Issue mit Label `bug`.
2. Der Teamleiter weist das Issue einem Entwickler zu.
3. Der Entwickler erstellt einen Branch, behebt den Fehler und pusht die Änderungen.
4. In Commit-Message und Pull Request verweist er auf die Issue-Nummer.
5. Nach Review und Merge wird das Issue automatisch geschlossen.
6. Das Issue bleibt in der Historie dokumentiert und kann später nachvollzogen werden.

---

## Fazit

Issues sind das **Rückgrat des Projektmanagements in GitHub**.
Sie unterstützen Teams dabei, **organisiert**, **transparent** und **kollaborativ** zu arbeiten.
Durch Labels, Zuweisungen, Milestones und die Verknüpfung mit Code entsteht ein klarer und effizienter Workflow, der das Projekt zuverlässig voranbringt.
