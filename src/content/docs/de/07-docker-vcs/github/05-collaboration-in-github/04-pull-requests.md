---
title: Pull Requests (PRs)
---

Ein **Pull Request (PR)** ist der zentrale Mechanismus, um Änderungen an einem Code-Repository vorzuschlagen und in den Hauptzweig (z. B. `main` oder `master`) zu integrieren. PRs ermöglichen es Entwicklern, Änderungen gemeinsam zu überprüfen, zu diskutieren und zu verbessern, bevor sie dauerhaft in das Projekt übernommen werden. Sie sind ein essenzieller Bestandteil kollaborativer Softwareentwicklung.

---

## Warum Pull Requests wichtig sind

- **Zusammenarbeit:** PRs schaffen einen Raum, um Änderungen vor der Übernahme gemeinsam zu diskutieren.  
- **Codequalität:** Durch Reviews können Fehler erkannt und Coding Standards eingehalten werden.  
- **Transparenz:** Alle Änderungen werden mit Commit-Historie, Kommentaren und Diskussionen dokumentiert.  
- **Nachvollziehbarkeit:** Aufgaben und Issues lassen sich direkt mit PRs verknüpfen.  

---

## Typischer Ablauf eines Pull Requests

1. **Branch erstellen**  
   - Für ein Feature, einen Bugfix oder eine Verbesserung wird ein eigener Branch angelegt.  
   ```bash
   git checkout -b feature/user-auth
   ```

2. **Änderungen committen und pushen**

   * Änderungen werden erfasst und in das Remote-Repository hochgeladen.

   ```bash
   git add .
   git commit -m "Add user authentication feature"
   git push origin feature/user-auth
   ```

3. **Pull Request eröffnen**

   * Auf GitHub (oder einer vergleichbaren Plattform) „Compare & pull request“ auswählen.
   * Basis-Branch (z. B. `main`) und Vergleichs-Branch (Feature-Branch) auswählen.
   * **Titel** und **detaillierte Beschreibung** hinzufügen.
   * Reviewer zuweisen und ggf. Issues verknüpfen.

4. **Review und Diskussion**

   * Teammitglieder prüfen den Code, geben Feedback und schlagen Verbesserungen vor.
   * Weitere Commits im selben Branch aktualisieren automatisch den PR.

5. **Freigabe und Merge**

   * Nach Freigabe kann der PR in den Hauptzweig gemerged werden.
   * Mögliche Merge-Strategien:

     * **Merge Commit** (bewahrt die gesamte Historie)
     * **Squash and Merge** (führt alle Commits zu einem zusammen)
     * **Rebase and Merge** (spielt Commits auf den Zielbranch oben drauf)

---

## Gute Praktiken für Pull Requests

* **Klare Beschreibungen:** Was macht der PR? Warum ist er nötig? Wie wurde er umgesetzt?
* **Issues verknüpfen:** Mit `Closes #12` oder `Fixes #45` lassen sich Issues automatisch schließen.
* **Klein und fokussiert:** PRs sollten überschaubar bleiben, um das Review zu erleichtern.
* **Aussagekräftige Titel:** Kurze, prägnante Zusammenfassung der Änderungen.
* **Reviewer anfragen:** Teammitglieder einbeziehen, Feedback und Freigabe einholen.
* **Dokumentation und Tests aktualisieren:** Falls nötig, begleitende Anpassungen direkt mitliefern.

---

## Beispiel: PR erstellen

```bash
# Schritt 1: Branch nach GitHub pushen
git push origin feature/my-feature

# Schritt 2: Auf GitHub "Compare & pull request" anklicken
# Schritt 3: Titel, Beschreibung und Reviewer hinzufügen
# Schritt 4: PR einreichen
```

---

## Vorteile von Pull Requests

* **Bessere Zusammenarbeit** im Team
* **Einheitliche Coding Standards** durch Reviews
* **Weniger Fehler** dank Peer Review und Tests
* **Wissensaustausch** zwischen Teammitgliedern
* **Klare Projekt-Historie** mit nachvollziehbaren Diskussionen

---

## Zusammenfassung

Pull Requests sind weit mehr als nur ein Mittel, um Code zu mergen. Sie sind ein strukturierter Prozess für **Zusammenarbeit, Qualitätssicherung und Projektdokumentation**. Wenn Entwickler gute PR-Praktiken befolgen, entstehen effizientere Workflows, bessere Teamarbeit und zuverlässigere Software.
