---
title: Zusammenfassung
---

### Zusammenfassung

Diese Tabelle bietet einen schnellen Überblick über die **Kernkonzepte von GitHub Actions**. Jedes Konzept hat eine eigene Rolle bei der Definition, Auslösung und Ausführung von Automatisierungs-Workflows.

| Konzept  | Beschreibung                                                                 |
| -------- | ----------------------------------------------------------------------------- |
| Workflow | Eine **YAML-Datei**, die den Automatisierungsprozess definiert. Gespeichert in `.github/workflows/`. |
| Event    | Ein **Auslöser**, der einen Workflow startet. Beispiele: `push`, `pull_request`, `schedule` oder manuelles `workflow_dispatch`. |
| Job      | Eine **Gruppe von Schritten**, die zusammen auf einem bestimmten Runner ausgeführt werden. Jobs können parallel oder nacheinander laufen. |
| Step     | Eine **einzelne Aufgabe** innerhalb eines Jobs, z. B. das Ausführen eines Befehls oder einer Action. Schritte laufen sequenziell im Rahmen ihres Jobs. |
| Action   | Ein **wiederverwendbares Stück Logik**, entweder aus dem GitHub Marketplace, von der Community oder selbst erstellt. Vereinfacht Workflows, indem Befehle gebündelt werden. |
| Runner   | Die **Ausführungsumgebung** für Jobs. Kann sein: <br> - GitHub-gehostet (z. B. Ubuntu, Windows, macOS) <br> - Selbst-gehostet (eigener Server oder Rechner). |

---

### Detaillierte Erläuterung

#### 1. Workflow
- Dient als **Bauplan** der Automatisierung.  
- Wird im YAML-Format geschrieben und in `.github/workflows/` abgelegt.  
- Kann **mehrere Jobs** enthalten, die jeweils eigene Schritte haben.  
- Beispiel: Ein Continuous-Integration-Workflow, der Code baut, testet und anschließend bereitstellt.

#### 2. Event
- Definiert, **wann** ein Workflow ausgeführt wird.  
- Arten von Events:
  - **Repository-Events**: `push`, `pull_request`, `release`, `issues`.  
  - **Geplante Events**: Ausführung nach Zeitplan mit `schedule` (Cron-Syntax).  
  - **Manuelle Events**: Mit `workflow_dispatch` vom Nutzer gestartet.  
  - **Externe Events**: Über Webhooks oder APIs ausgelöst.  

#### 3. Job
- Stellt einen **Container von Schritten** dar.  
- Jeder Job:
  - Läuft auf einem eigenen Runner.  
  - Kann **Abhängigkeiten** (`needs`) zu anderen Jobs haben.  
  - Kann **parallel** zu anderen Jobs laufen, um Zeit zu sparen.  

Beispiel:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Projekt wird gebaut"
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - run: echo "Tests werden ausgeführt"
```

#### 4. Step

* Die **Bausteine** eines Jobs.
* Werden **nacheinander** in der definierten Reihenfolge ausgeführt.
* Arten von Steps:

  * Shell-Befehle (`run`)
  * Wiederverwendbare Actions (`uses`)

Beispiel:

```yaml
steps:
  - name: Code auschecken
    uses: actions/checkout@v4
  - name: Abhängigkeiten installieren
    run: npm install
```

#### 5. Action

* Kapselt wiederverwendbare Logik für eine bestimmte Aufgabe.
* Kann sein:

  * **Vorbereitet**: Über den [GitHub Marketplace](https://github.com/marketplace?type=actions) verfügbar.
  * **Eigenentwickelt**: In JavaScript, Docker oder als Composite-YAML geschrieben.
* Vorteile:

  * Wiederverwendbarkeit
  * Vereinfachung von Workflows
  * Teilen mit der Community

Beispiel:

```yaml
- name: Node.js einrichten
  uses: actions/setup-node@v4
  with:
    node-version: 18
```

#### 6. Runner

* Die **Maschine**, die Jobs ausführt.
* Zwei Haupttypen:

  * **GitHub-gehostete Runner**: Automatisch von GitHub bereitgestellt.
  * **Selbst-gehostete Runner**: Eigene Infrastruktur (Server, VM, Container).
* Runner liefern den **Ausführungskontext**, inklusive Betriebssystem, CPU und Tools.

---

### Wichtigste Erkenntnisse

* **Workflow**: Der gesamte Automatisierungsplan.
* **Event**: Definiert, *wann* ein Workflow startet.
* **Job**: Sammlung von Schritten, die isoliert laufen.
* **Step**: Kleinste Ausführungseinheit.
* **Action**: Vorgefertigte oder eigene Logik für Aufgaben.
* **Runner**: Die Umgebung, in der Jobs ausgeführt werden.

Gemeinsam bilden diese Konzepte das **Fundament von GitHub Actions** und ermöglichen leistungsstarke Automatisierung für Continuous Integration (CI), Continuous Deployment (CD) und vieles mehr.
