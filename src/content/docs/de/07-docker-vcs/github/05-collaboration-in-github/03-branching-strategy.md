---
title: Branching-Strategie
---

Die Verwendung von Branches (Zweigen) ist eine der wichtigsten Funktionen von Git. Sie ermöglicht es, Entwicklungsarbeiten voneinander zu trennen, Konflikte zu vermeiden und stabilen, produktionsreifen Code zu schützen.

Eine klar definierte Branching-Strategie hilft Teams dabei:
- Änderungen geordnet vorzunehmen,
- parallel zu arbeiten,
- und ein stabiles Hauptprodukt zu gewährleisten.

---

## Warum Branches verwenden?

Branches bieten viele Vorteile:

- **Isolation:** Jede Änderung findet in einem eigenen Zweig statt. Änderungen beeinflussen den Hauptcode nicht, bis sie explizit zusammengeführt werden.
- **Zusammenarbeit:** Mehrere Entwickler:innen können gleichzeitig an unterschiedlichen Features oder Fehlerbehebungen arbeiten.
- **Sicherheit:** Der Hauptzweig (`main` oder `master`) bleibt stabil und einsatzbereit.
- **Flexibilität:** Neue Ideen oder Experimente können gefahrlos getestet werden, ohne die Hauptentwicklung zu stören.

---

## Typischer Branch-Workflow

Ein bewährter Ansatz ist die Einteilung der Branches nach ihrem Zweck. Im Folgenden sind die häufigsten Typen aufgelistet:

### 1. `main` (oder `master`)
- Enthält **stabilen, produktionsreifen Code**.
- Wird nur mit **getestetem und freigegebenem Code** aktualisiert.
- Sollte jederzeit **deploybar** sein.

### 2. Feature-Branches
- Namenskonvention: `feature/mein-feature`
- Zweck: Entwicklung **neuer Funktionen (Features)**.
- Vorgehen:
  - Wird vom `main`-Branch abgezweigt.
  - Dient zur Entwicklung, Tests und evtl. Dokumentation.
  - Nach Abschluss wird er wieder in `main` gemerged.

Beispiel:
```bash
git checkout -b feature/benutzer-authentifizierung
```

### 3. Bugfix-Branches

* Namenskonvention: `bugfix/mein-bug`
* Zweck: **Fehlerbehebungen** in bestehendem Code.
* Vorgehen:

  * Wird von `main` (oder einem Release-Branch) erstellt.
  * Beinhaltet nur die Bugfixes.
  * Wird nach dem Testen wieder zurückgeführt.

Beispiel:

```bash
git checkout -b bugfix/login-fehler
```

### 4. Release-Branches *(optional bei größeren Projekten)*

* Namenskonvention: `release/1.0.0`
* Zweck: Vorbereitung eines **stabilen Releases**.
* Dient der finalen Stabilisierung, Tests, kleinen Fixes.
* Wird nach Fertigstellung in `main` gemerged.

### 5. Hotfix-Branches *(für dringende Produktionsprobleme)*

* Namenskonvention: `hotfix/kritischer-fehler`
* Zweck: **Schnelle Behebung** kritischer Produktionsfehler.
* Wird direkt von `main` erstellt, um Ausfallzeiten zu minimieren.

---

## Gängige Branching-Modelle

Je nach Teamgröße und Projektart gibt es verschiedene Strategien:

### GitHub Flow

* **Einfaches Modell**, ideal für kleine Teams und häufige Deployments.
* Nur zwei Arten:

  * `main` (Produktionscode)
  * Kurzlebige Feature-Branches, die über Pull Requests in `main` gemerged werden.
* Vorteile:

  * Schlank, unkompliziert
* Nachteile:

  * Weniger Kontrolle in großen Teams

### Git Flow

* **Strukturiertes Modell**, ideal für größere Projekte.
* Typische Branches:

  * `main`
  * `develop` (Entwicklungszweig)
  * `feature/*`
  * `release/*`
  * `hotfix/*`
* Vorteile:

  * Klare Trennung von Entwicklungsphasen
  * Stabilität bei großen Teams
* Nachteile:

  * Komplexer, mehr Verwaltungsaufwand

### Trunk-Based Development

* Entwickelnde arbeiten direkt auf `main` oder sehr kurzlebigen Branches.
* Benötigt:

  * Sehr gute automatisierte Tests
  * Kontinuierliche Integration (CI/CD)
* Vorteile:

  * Sehr schnelle Lieferung
* Nachteile:

  * Risiko für Instabilität bei fehlenden Tests

---

## Best Practices für Branching

* ✅ **Aussagekräftige Namen verwenden:**
  z. B. `feature/zwei-faktor-auth` statt `feature/test1`
* ✅ **Kleine, fokussierte Branches:**
  Lieber mehrere kleine Branches als einen großen, unübersichtlichen.
* ✅ **Regelmäßig mit `main` synchronisieren:**
  Um Merge-Konflikte zu vermeiden, regelmäßig `main` reinziehen (rebasen oder mergen).
* ✅ **Pull Requests nutzen:**
  Für Code-Review, Diskussion und automatisiertes Testen.
* ✅ **Branches nach dem Merge löschen:**
  So bleibt das Repository aufgeräumt.

---

## Beispielhafter Workflow

1. **Neuen Branch erstellen:**

   ```bash
   git checkout -b feature/benutzer-auth
   ```

2. **Änderungen vornehmen und committen:**

   ```bash
   git add .
   git commit -m "Implementierung der Benutzer-Authentifizierung"
   ```

3. **Branch ins Remote-Repo pushen:**

   ```bash
   git push origin feature/benutzer-auth
   ```

4. **Pull Request öffnen:**

   * Code Review durch Teammitglieder
   * Automatische Tests prüfen
   * Feedback einarbeiten

5. **Branch in `main` mergen:**

   ```bash
   git checkout main
   git merge feature/benutzer-auth
   ```

6. **Branch lokal löschen:**

   ```bash
   git branch -d feature/benutzer-auth
   ```

---

## Zusammenfassung

Eine durchdachte Branching-Strategie hilft dabei:

* den `main`-Branch stabil und produktionsfähig zu halten,
* die Zusammenarbeit im Team zu erleichtern,
* Konflikte zu minimieren,
* und die Qualität des Codes zu sichern.

Egal ob **GitHub Flow**, **Git Flow** oder eine eigene Variante:

> **Wichtig ist, dass das gesamte Team sich auf eine einheitliche Strategie einigt – und diese konsequent anwendet.**
