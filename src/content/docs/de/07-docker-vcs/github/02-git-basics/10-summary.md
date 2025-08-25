---
title: Zusammenfassung
---

## Einführung

Git ist ein **verteiltes Versionskontrollsystem (DVCS)**, das es Entwicklern ermöglicht, Änderungen zu verfolgen, effektiv zusammenzuarbeiten und eine vollständige Historie ihrer Projekte zu pflegen. Es wird in der modernen Softwareentwicklung weit verbreitet eingesetzt, da es Teamarbeit erleichtert, Backup- und Wiederherstellungsoptionen bietet und ein besseres Projektmanagement ermöglicht.  

Diese Zusammenfassung hebt die **Kernprinzipien** und **wesentlichen Praktiken** hervor, die jeder Einsteiger beim Arbeiten mit Git verstehen sollte.

---

## Zentrale Punkte

### 1. Git verfolgt Änderungen und unterstützt Teamarbeit
- Jede Änderung am Projekt wird als **Commit** gespeichert, versehen mit Autor, Zeitstempel und Nachricht.  
- Die vollständige Projekt-Historie kann jederzeit mit Befehlen wie `git log` eingesehen werden.  
- Da Git verteilt arbeitet, hat jeder Entwickler eine **vollständige Kopie des Repositories**, inklusive Historie.  
- So können Teams auch ohne zentrale Server zusammenarbeiten.  
- Mehrere Entwickler können gleichzeitig an unterschiedlichen Branches arbeiten, ihre Arbeit später zusammenführen und Konflikte bei Bedarf lösen.

---

### 2. Wichtige Befehle für den täglichen Workflow
Um Git effektiv einzusetzen, nutzen Entwickler regelmäßig einige grundlegende Befehle:

#### `git add`
- Bereitet Dateien für einen Commit vor (**Staging**).  
- Beispiel:

  ```bash
  git add datei.txt
```

* Mehrere Dateien können hinzugefügt werden, oder mit `git add .` alle Änderungen.

#### `git commit`

* Speichert die zuvor vorbereiteten Änderungen als **Snapshot** im lokalen Repository.
* Beispiel:

  ```bash
  git commit -m "Neue Funktion hinzugefügt"
  ```
* Jeder Commit sollte eine klare und aussagekräftige Nachricht haben.

#### `git push`

* Überträgt lokale Commits in das **Remote-Repository** (z. B. GitHub, GitLab).
* Beispiel:

  ```bash
  git push origin main
  ```

#### `git pull`

* Lädt die neuesten Änderungen aus dem Remote-Repository herunter und integriert sie in den lokalen Branch.
* Beispiel:

  ```bash
  git pull origin main
  ```
* So bleibt die lokale Arbeit mit dem Fortschritt des Teams synchron.

---

### 3. Die Rolle von `.gitignore`

* Mit der Datei `.gitignore` wird festgelegt, welche Dateien oder Verzeichnisse **nicht** in die Versionskontrolle aufgenommen werden sollen.
* Dadurch werden unnötige oder sensible Dateien (z. B. Log-Dateien, temporäre Dateien, Zugangsdaten) ausgeschlossen.
* Beispiel für eine `.gitignore`-Datei:

  ```bash
  node_modules/
  .env
  *.log
  ```
* Eine gepflegte `.gitignore` hält das Repository sauber und effizient.

---

## Best Practices

* **Häufig committen**: Kleine, sinnvolle Änderungen mit klaren Nachrichten abspeichern.
* **Regelmäßig pullen**: Änderungen des Teams rechtzeitig einholen, um Konflikte zu vermeiden.
* **Branches nutzen**: Für Features oder Bugfixes eigene Branches verwenden, bevor diese in den Hauptbranch gemerged werden.
* **`.gitignore` aktuell halten**: Immer ergänzen, wenn neue Dateien ausgeschlossen werden sollten.

---

## Fazit

Git ist mehr als nur ein Werkzeug – es ist ein zentraler Bestandteil moderner Softwareentwicklung. Durch die konsequente Nutzung von Befehlen wie `git add`, `git commit`, `git push` und `git pull` sowie durch den Einsatz einer `.gitignore`-Datei können Entwickler eine saubere Projekt-Historie pflegen, effizient im Team arbeiten und Konflikte vermeiden.

Das Beherrschen dieser Grundlagen bildet die Basis, um später fortgeschrittene Funktionen wie Branching, Merging, Rebasing und kollaborative Workflows kennenzulernen.
