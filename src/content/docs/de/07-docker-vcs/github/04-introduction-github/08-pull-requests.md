---
title: Pull Requests
---

Ein **Pull Request (PR)** ist eine Funktion, die von Plattformen wie GitHub, GitLab oder Bitbucket bereitgestellt wird.  
Er ermöglicht es Entwickler:innen, Änderungen an einem Repository vorzuschlagen.  
Pull Requests sind ein zentrales Werkzeug für **Zusammenarbeit**, **Code-Reviews** und **Qualitätssicherung** in modernen Softwareentwicklungsprozessen.

---

## Warum Pull Requests wichtig sind

- **Zusammenarbeit:** Teile deine Arbeit mit dem Team auf eine kontrollierte und transparente Weise.  
- **Code-Review:** Bitte um Feedback, bevor Änderungen in den Haupt-Branch übernommen werden.  
- **Qualitätssicherung:** Stelle sicher, dass der Code den Standards entspricht – durch automatisierte Tests und Peer-Reviews.  
- **Dokumentation:** PRs dienen als historischer Nachweis dafür, **was** geändert wurde und **warum**.  
- **Sichere Integration:** Änderungen werden nachvollziehbar zusammengeführt, Konflikte strukturiert gelöst.  

---

## Typischer PR-Workflow

1. **Einen Branch erstellen**  
   Einen neuen Branch für ein Feature oder einen Bugfix anlegen:  

   ```bash
   git checkout -b feature/neues-login
   ```

Dadurch bleiben die Änderungen vom `main`-Branch getrennt.

2. **Änderungen vornehmen und committen**
   Code bearbeiten, dann Dateien zum Commit hinzufügen und committen:

   ```bash
   git add .
   git commit -m "Login-Funktionalität hinzugefügt"
   ```

3. **Branch ins Remote-Repository pushen**
   Den Branch zu GitHub (oder einer anderen Plattform) hochladen:

   ```bash
   git push origin feature/neues-login
   ```

4. **Pull Request eröffnen**

   * Zum Repository auf GitHub gehen.
   * **„New Pull Request“** anklicken.
   * Den Quell-Branch (deinen Feature-Branch) und den Ziel-Branch (z. B. `main`) auswählen.
   * Einen **aussagekräftigen Titel** und eine **detaillierte Beschreibung** hinzufügen.

5. **Reviewer und Labels hinzufügen**

   * Teammitglieder als Reviewer eintragen.
   * Labels (z. B. `bugfix`, `feature`, `documentation`) zur besseren Organisation verwenden.

6. **Diskussion und Review**

   * Reviewer können Kommentare hinterlassen, Änderungen anfordern oder den PR freigeben.
   * Autor\:innen beantworten Feedback, passen den Code an und pushen neue Commits.
   * Alle Diskussionen bleiben dokumentiert.

7. **Tests und CI/CD-Checks**

   * Automatisierte Tests laufen häufig bei jedem PR.
   * Sie stellen sicher, dass der neue Code bestehende Funktionen nicht beschädigt.

8. **Pull Request mergen**
   Nach der Freigabe kann gemergt werden:

   * **Merge Commit:** behält die gesamte Historie.
   * **Squash and Merge:** fasst alle Commits zu einem zusammen.
   * **Rebase and Merge:** schreibt die Historie neu, sorgt für eine saubere Timeline.

9. **Branch löschen**
   Nach dem Merge wird der Feature-Branch gelöscht:

   ```bash
   git branch -d feature/neues-login       # lokal
   git push origin --delete feature/neues-login  # remote
   ```

---

## Best Practices für Pull Requests

* PRs **klein und fokussiert** halten (ein Feature oder ein Fix pro PR).
* **Klare Commit-Nachrichten** und **aussagekräftige PR-Titel** schreiben.
* Kontext in der PR-Beschreibung liefern (**Was**, **Warum**, **Wie**).
* Tests lokal ausführen, bevor ein PR gestellt wird.
* PRs anderer Teammitglieder aufmerksam und konstruktiv reviewen.
* **Draft PRs** nutzen, wenn man unfertige Arbeit teilen möchte.

---

## Beispiel für eine PR-Beschreibung

```bash
### Zusammenfassung
Neues Login-Formular mit Validierung implementiert.

### Änderungen
- Login-Seite mit HTML/CSS hinzugefügt
- Validierung für E-Mail und Passwort eingebaut
- Anbindung an Backend-Authentifizierungs-API integriert

### Hinweise
- Bitte mit gültigen und ungültigen Daten testen.
- Dieser PR schließt Issue #42.
```

---

## Fazit

Pull Requests sind mehr als nur ein Werkzeug zum Zusammenführen von Code – sie sind ein **Kommunikationsmittel**.
Sie fördern Zusammenarbeit, sichern Qualität und dokumentieren den Entwicklungsprozess.
Durch eine strukturierte Vorgehensweise und Best Practices können Teams effizient und transparent arbeiten.
