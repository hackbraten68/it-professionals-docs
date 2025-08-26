---
title: Zentrale Konzepte von GitHub Actions
---
# Zentrale Konzepte von GitHub Actions

> Ein umfassender, klar strukturierter Leitfaden für den Unterricht – mit tiefgehenden Erklärungen, praktischen Beispielen und Best Practices.

---

## Was sind GitHub Actions?

GitHub Actions ist die native Automatisierungsplattform von GitHub für CI/CD und vieles mehr. Du definierst **Workflows** in YAML, die auf **Ereignisse** reagieren (z. B. `push`, `pull_request` oder einen manuellen Auslöser), und ausführst **Jobs** mit **Schritten** auf **Runnern** (Maschinen). So kannst du Builds, Tests, Linting, Releases, Deployments oder beliebige Skripte automatisieren.

---

## 1) Grundbausteine

### A. Workflow (YAML)

Ein **Workflow** ist eine YAML-Datei im Verzeichnis `.github/workflows/`, die Trigger, Jobs und Steps enthält.

```yaml
name: Beispiel-Workflow
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Skript ausführen
        run: echo "Hallo von GitHub Actions!"
```

**Struktur:**

* `on`: definiert Ereignisse, die den Workflow starten.
* `jobs`: listet Arbeitseinheiten.
* Jeder Job enthält `runs-on`, eine Liste von `steps` und optional weitere Felder wie `strategy`, `needs`, `permissions`.

---

### B. Ereignis-Trigger

Gängige Auslöser:

* `push`
* `pull_request`
* `schedule` (Cron-Syntax, läuft in UTC)
* `workflow_dispatch` (manueller Trigger mit optionalen Eingaben)

Weitere nützliche Events: `workflow_run`, `release`, `issues`, `pull_request_review`.

**Beispiel:**

```yaml
on:
  push:
    branches: [ main ]
    paths: [ "src/**", ".github/workflows/**" ]
  pull_request:
    branches: [ main ]
    paths-ignore: [ "docs/**" ]
  schedule:
    - cron: "0 3 * * 1"   # Montags um 03:00 UTC
  workflow_dispatch:
    inputs:
      env:
        description: "Ziel-Umgebung"
        required: true
        type: choice
        options: [ staging, production ]
```

---

### C. Jobs

* **Laufen standardmäßig parallel.**
  Mit `needs:` kannst du Abhängigkeiten festlegen.
* Jeder Job kann auf einem anderen **OS** laufen.
* Jobs haben eigene Umgebungen; Datenaustausch erfolgt über Artefakte oder Outputs.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [ ... ]

  build:
    needs: test
    runs-on: ubuntu-latest
    steps: [ ... ]
```

---

### D. Runner

Ein **Runner** führt Jobs aus.

* **Von GitHub gehostet:** `ubuntu-latest`, `windows-latest`, `macos-latest` – frisch, sauber, verwaltet.
* **Self-hosted:** eigene Server/Container für spezielle Anforderungen (z. B. GPU, internes Netzwerk, individuelle Tools).

---

### E. Schritte und Actions

Ein **Schritt** ist eine einzelne Aufgabe innerhalb eines Jobs. Er kann sein:

* Ein Shell-Befehl (`run`).
* Eine wiederverwendbare **Action** (`uses`).

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
  - name: Abhängigkeiten installieren
    run: npm ci
  - name: Tests ausführen
    run: npm test
```

---

## 2) Strategie, Matrix und Parallelisierung

Mit `strategy.matrix` lassen sich Jobs über mehrere Versionen/OS parallel ausführen:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - run: npm ci
      - run: npm test
```

---

## 3) Variablen, Kontexte und Outputs

### A. Umgebungsvariablen (`env`)

* Können auf Workflow-, Job- oder Step-Ebene gesetzt werden.
* Über `env:` eingebunden.

```yaml
env:
  CI: true
```

### B. Kontexte & Expressions

Über `${{ ... }}` auf Werte zugreifen:

```yaml
- run: echo "Ref: ${{ github.ref }}, Actor: ${{ github.actor }}"
```

### C. Outputs

Steps und Jobs können Werte exportieren:

```yaml
- id: commit
  run: echo "hash=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

- run: echo "Commit: ${{ steps.commit.outputs.hash }}"
```

---

## 4) Abhängigkeiten und Bedingungen

* `needs:` definiert Abhängigkeiten zwischen Jobs.
* `if:` erlaubt bedingte Ausführung.

```yaml
jobs:
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && success()
```

---

## 5) Caching und Artefakte

### A. Cache

Beschleunigt Builds:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

### B. Artefakte

Zum Teilen von Dateien zwischen Jobs:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
```

---

## 6) Service-Container & Docker

Jobs können zusätzliche Container starten, z. B. Datenbanken:

```yaml
services:
  postgres:
    image: postgres:16
    ports: [ "5432:5432" ]
```

---

## 7) Environments, Secrets & Permissions

* **Secrets** sicher in GitHub speichern, Zugriff über `secrets.MY_SECRET`.
* **Environments** erlauben Genehmigungen oder Wartezeiten.
* **Permissions** sollten minimal gesetzt werden:

```yaml
permissions:
  contents: read
  id-token: write
```

---

## 8) Wiederverwendbare Workflows & Composite Actions

### A. Reusable Workflows

Ein Workflow kann andere aufrufen:

```yaml
jobs:
  ci:
    uses: org/repo/.github/workflows/ci.yml@v1
```

### B. Composite Actions

Mehrere Steps zu einer wiederverwendbaren Action bündeln.

---

## 9) Concurrency

Parallele Runs vermeiden:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

---

## 10) Debugging & Monitoring

* Logs pro Step einsehbar.
* Mit `ACTIONS_STEP_DEBUG=true` erweitertes Debugging aktivieren.
* Markdown-Summaries (`$GITHUB_STEP_SUMMARY`) für Berichte nutzen.

---

## 11) Typische Workflow-Muster

### Node.js CI

```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test
```

---

## 12) Sicherheits-Checkliste

* Actions immer mit Version oder SHA pinnen.
* Minimal nötige `permissions` setzen.
* OIDC statt Langzeit-Credentials nutzen.
* Secrets niemals direkt ins Log schreiben.
* Vorsicht bei PRs aus Forks (`pull_request_target` vermeiden).

---

## 13) Best Practices & Stolperfallen

* `schedule` läuft immer in UTC.
* Cache-Keys regelmäßig erneuern, sonst Gefahr veralteter Pakete.
* Für große Monorepos: `paths` und `paths-ignore` nutzen.
* Self-hosted Runner absichern und aktuell halten.

---

## 14) Zusammenfassung

GitHub Actions ermöglichen es, **jede Art von Automatisierung** in GitHub umzusetzen: von einfachen Tests bis zu komplexen Multi-Stage-Deployments.
Die Kernkonzepte sind **Workflows, Events, Jobs, Steps und Runner**. Mit **Caching, Artefakten, Wiederverwendbarkeit und Environments** kannst du deine Pipelines performant, sicher und skalierbar gestalten.

---
