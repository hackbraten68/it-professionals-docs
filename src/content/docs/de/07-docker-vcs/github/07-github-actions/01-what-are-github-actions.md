---
title: Was sind GitHub Actions?
---

GitHub Actions ist eine **leistungsstarke Automatisierungsfunktion**, die direkt in GitHub integriert ist. Sie ermöglicht es Entwicklerinnen und Entwicklern sowie Teams, Aufgaben im Softwareentwicklungszyklus zu automatisieren – wie das Bauen, Testen und Bereitstellen von Anwendungen.

---

## Zentrale Fähigkeiten

- **Workflows automatisieren**  
  Führe automatisierte Aufgaben als Reaktion auf Ereignisse in deinem Repository aus (z. B. Push, Pull Request, Issue-Erstellung).  
  Beispiele: Tests ausführen, wenn Code gepusht wird; Deployment in Produktion nach dem Merge in `main`.

- **Eigene Skripte**  
  Schreibe eigene Skripte oder verwende vorgefertigte Actions aus der Community. Mehrere Actions können zu Workflows kombiniert werden.

- **CI/CD-Pipelines**  
  Richte **Continuous Integration (CI)** und **Continuous Deployment (CD)** mit nur einer YAML-Datei ein. Damit stellst du sicher, dass Code automatisch getestet und konsistent ausgerollt wird.

---

## Funktionsweise

1. **Events** lösen Workflows aus  
   - Beispiele: `push`, `pull_request`, `issues`, `schedule` (Cron-Jobs).

2. **Workflows** definieren die Automatisierung  
   - Ein Workflow ist eine YAML-Konfiguration im Repository.  
   - Speicherort: `.github/workflows/`

3. **Jobs** laufen innerhalb eines Workflows  
   - Jeder Job besteht aus einem oder mehreren Schritten.  
   - Jobs können nacheinander oder parallel ausgeführt werden.

4. **Steps (Schritte)** führen Aktionen aus  
   - Ein Step kann ein Skript, ein Shell-Kommando oder eine fertige Action aus dem GitHub Marketplace sein.

---

## Aufbau einer Workflow-Datei

Ein Workflow wird in einer `.yml`-Datei innerhalb von `.github/workflows/` definiert.  
Ein einfaches Beispiel:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Repository-Code auschecken
      - uses: actions/checkout@v3

      # Node.js einrichten
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      # Abhängigkeiten installieren und Tests ausführen
      - run: npm install
      - run: npm test
```

---

## Häufige Anwendungsfälle

* **Continuous Integration**: Automatisches Testen des Codes bei jedem Pull Request.
* **Continuous Deployment**: Deployment in Staging oder Produktion nach Merge.
* **Code-Qualität**: Linter oder Security-Scanner automatisch ausführen.
* **Geplante Tasks**: Jobs zeitgesteuert laufen lassen (z. B. tägliche Reports, Aufräumarbeiten).
* **Issue- & PR-Automatisierung**: Labels hinzufügen, Reviewer zuweisen oder neue Contributor begrüßen.

---

## GitHub Marketplace

* Tausende vorgefertigte Actions stehen kostenlos bereit.
* Kategorien: Deployments, Testframeworks, Cloud-Integrationen, Code-Analyse u. v. m.
* Beispiele: `actions/checkout`, `actions/setup-node`, `docker/login-action`.

---

## Vorteile

* **Nahtlose Integration**: Funktioniert direkt mit GitHub-Repositories.
* **Skalierbar**: Unterstützt Linux-, macOS- und Windows-Runner.
* **Community-getrieben**: Riesiges Ökosystem an wiederverwendbaren Actions.
* **Flexibel**: Von simplen Skripten bis zu komplexen Multi-Job-Pipelines.

---

## Zusammenfassung

GitHub Actions bietet eine einfache Möglichkeit, **Workflows der Softwareentwicklung zu automatisieren**, ohne GitHub zu verlassen.
Mit YAML-Definitionen lassen sich mächtige Pipelines für **Build, Test und Deployment** erstellen sowie Routineaufgaben im Projekt automatisieren.
Es ist ein zentrales Werkzeug für moderne **DevOps-Praktiken** und **Continuous Delivery**.
