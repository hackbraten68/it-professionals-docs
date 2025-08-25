---
title: Best Practices
---
# Best Practices

Ein praktischer, meinungsstarker Leitfaden für die Zusammenarbeit mit Git und Remote-Plattformen (GitHub/GitLab). Verwende ihn als Referenz und Checkliste im täglichen Arbeiten.

---

## Warum Best Practices wichtig sind

- **Konsistenz:** Teams arbeiten schneller, wenn Konventionen vorhersehbar sind.  
- **Nachvollziehbarkeit:** Klare Branches, Commits und PRs erleichtern Reviews und Debugging.  
- **Sicherheit:** Leitplanken (PRs, CI, geschützte Branches) verhindern teure Fehler.  

---

## Branch-Namenskonventionen

Verwende beschreibende, klar abgegrenzte Namen. Nutze Kleinbuchstaben mit Schrägstrichen und Bindestrichen.

**Format**

```php
<typ>/<scope>-<kurze-zusammenfassung>
```

**Beispiele**

- `feature/auth-oauth2`  
- `bugfix/login-issue-500-on-empty-pw`  
- `chore/deps-bump-axios-1-7`  
- `docs/readme-installation`

**Tipps**

- Möglichst unter ~50 Zeichen bleiben.  
- Keine Leerzeichen oder Sonderzeichen.  
- Falls vorhanden, Issue-ID hinzufügen: `feature/1234-auth-oauth2`.  

---

## Branches kurzlebig halten

Langfristige Branches driften auseinander und verursachen komplizierte Merge-Konflikte.

- Ziel: **1–5 Tage** Arbeit pro Branch.  
- Lieber mehrere kleine PRs als einen riesigen.  
- Bei großen Änderungen: **Feature Flags** nutzen.  

---

## Vor dem Mergen die neuesten Änderungen holen

Halte deine Arbeit synchron mit der Hauptlinie, um Konflikte zu minimieren.

**Grundlegende Synchronisierung**

```bash
# Von deinem Feature-Branch aus:
git fetch origin
git merge origin/main
# oder (wenn das Team Rebase bevorzugt):
git rebase origin/main
```

**Wann Rebase vs. Merge**

* **Rebase** vor dem Öffnen eines PRs für eine saubere, lineare History.
* **Merge** beim Integrieren geprüfter PRs in geschützte Branches.
* Niemals **öffentliche Branches** (bereits geteilte) rebaseden, außer es ist teamweit abgesprochen.

---

## Pull Requests (PRs) für Reviews nutzen

PRs sind der zentrale Ort für Diskussion, Qualitätsprüfung und Sichtbarkeit.

**Vor dem Öffnen eines PRs**

* Branch ist aktuell mit `main`.
* Alle Tests lokal bestanden.
* Commits ggf. squashen oder sinnvoll ordnen.

**PR eröffnen**

* **Titel:** kurz und handlungsorientiert.
* **Beschreibung:** Kontext, Motivation, Screenshots, Testschritte.
* **Scope:** klein und fokussiert (\~200–400 geänderte Zeilen sind ideal).
* **Issues verlinken:** “Closes #123”.
* **Labels:** helfen bei der Einordnung (`feature`, `bug`, `security`).

**Während des Reviews**

* Auf jeden Kommentar eingehen.
* Änderungen pushen statt lange Diskussionen führen.
* Respektvoll, spezifisch und konstruktiv bleiben.

**Mergen**

* **Squash Merge** für kleine PRs (saubere History).
* **Merge Commit** für größere PRs mit mehreren Commits.
* **Force-Push** nach Reviews vermeiden (nur nach Absprache).

---

## Commit-Nachrichten

Gute Commits erklären *warum* und *was* geändert wurde.

**Stil**

* **Betreffzeile:** ≤ 72 Zeichen, im Imperativ (“Add”, nicht “Added”).
* **Body:** Motivation, Ansatz, Abwägungen.
* **Referenzen:** Issue-IDs angeben.

**Beispiele**

```
Fix login redirect loop on expired sessions

Die Session-Überprüfung lief nach den Router-Guards,
was bei abgelaufenen Tokens eine Endlosschleife verursachte.
Validierung in den Guard verschoben und Test hinzugefügt.

Closes #456.
```

```
Add OAuth2 PKCE flow for mobile clients

Implementiert Code Verifier/Challenge-Generierung und Token-Austausch.
Enthält Konfigurationsdokumentation und Integrationstests.

Refs #789.
```

---

## PRs klein und fokussiert halten

* Pro PR nur **eine logische Änderung** (Feature, Bugfix, Refactor).
* Keine Vermischung von Refactor + Feature.
* Wenn zu groß → splitten in:

  * **Prep PRs:** nur Refactor/Umstrukturierung.
  * **Feature PR:** eigentliche Änderung.

---

## Tests & CI

Automatisierte Qualitätskontrollen sind Pflicht.

* **Pre-Commit Hooks:** Linting, Formatierung, Tests.
* **CI Checks:** Unit-/Integrationstests, Typprüfungen, Security-Scans.
* **Geschützte Branches:** nur Merge, wenn alles grün.
* **Bugfixes:** mit Testabdeckung einchecken.

---

## Merge-Konflikte sauber lösen

* Häufig syncen, um Konflikte klein zu halten.
* Konflikte **lokal** mit Kontext lösen, dann Tests laufen lassen.
* Bei schwierigen Konflikten: **Pair Review** für die Auflösung.
* Niemals Konfliktmarker einchecken:

  ```bash
  <<<<<<< HEAD
  =======
  >>>>>>> other-branch
  ```

---

## Geschützte Branches & Rechte

* `main`/`release/*` schützen:

  * PR-Reviews (mind. 1–2 Reviewer).
  * CI muss grün sein.
  * Kein Force-Push oder direkte Commits.
* **CODEOWNERS** nutzen, um Reviewer automatisch zuzuweisen.

---

## Release-Hygiene

* **Tags:** für Releases

  ```bash
  git tag -a v1.4.0 -m "Release 1.4.0"
  git push origin v1.4.0
  ```

* **Changelog:** Änderungen seit letztem Release dokumentieren.
* **Release-Branches:** `release/1.4.x` für Stabilisierung, Hotfixes per Cherry-Pick.

---

## Dokumentation & Developer UX

* **README/Docs** aktualisieren bei API- oder Verhaltensänderungen.
* **Migration Notes** bei Breaking Changes.
* **Beispiele & `.env.example`** bereitstellen.

---

## Sicherheit & Secrets

* Niemals Secrets committen.
* `.gitignore` für lokale Dateien und Schlüssel anpassen.
* Verdacht auf Leaks → Schlüssel sofort rotieren.
* Abhängigkeiten auf Schwachstellen prüfen (`npm audit`, `pip-audit`).

---

## Kollaborations-Etikette

* **Asynchron** in PRs/Issues kommunizieren; Entscheidungen zusammenfassen.
* **Draft PRs** für frühes Feedback.
* **Ownership & Übergaben** klar benennen.
* Feststecken >30–60 Min → Hilfe holen mit Kontext.

---

## Beispiel-Workflow (täglich)

```bash
# 1) Main synchronisieren
git checkout main
git pull origin main

# 2) Neuen Feature-Branch erstellen
git checkout -b feature/auth-oauth2

# 3) Kleine Commits, Tests laufen lassen
git add .
git commit -m "Add PKCE helper and token exchange"
npm test

# 4) Regelmäßig synchronisieren
git fetch origin
git rebase origin/main

# 5) Push & PR eröffnen
git push -u origin feature/auth-oauth2
# Im PR: Titel, Beschreibung, Issue, ggf. Draft

# 6) Review einarbeiten, Commits sauber halten
git commit --fixup <sha>

# 7) Merge über Plattform nach grünem CI & Review
# Squash/Merge je nach Teamregel

# 8) Aufräumen
git checkout main
git pull origin main
git branch -d feature/auth-oauth2
git push origin --delete feature/auth-oauth2
```

---

## Do / Don’t

**Do**

* Beschreibende Branches & Commits.
* Häufig syncen.
* PRs klein & fokussiert.
* CI & Reviews erzwingen.
* Dokumentation aktuell halten.

**Don’t**

* Force-Push ohne Absprache.
* Refactor + Feature in einem PR.
* Merge mit rotem CI.
* PR-Kommentare offen lassen.
* Secrets oder Artefakte committen.

---

## PR-Checkliste (für Templates)

* [ ] Branchname korrekt
* [ ] Kleiner, fokussierter Scope
* [ ] Up-to-date mit `main`
* [ ] Tests grün
* [ ] Linting/Checks bestanden
* [ ] Docs/README aktualisiert
* [ ] Screenshots (bei UI)
* [ ] Verlinkte Issues
* [ ] Reviewer angefragt

---

## Team-Policies (optional)

* **Conventional Commits:** `feat:`, `fix:`, `chore:` → automatische Changelogs.
* **Trunk-Based Development:** kleine PRs direkt nach `main`.
* **WIP Limits:** begrenzte parallele PRs zur Reduzierung von Kontextwechseln.

---

## Schlusswort

Diese Regeln sind **praktische Leitplanken**.
Falls etwas bremst, ohne Qualität zu verbessern: **Vorschlagen, anpassen, dokumentieren.**
