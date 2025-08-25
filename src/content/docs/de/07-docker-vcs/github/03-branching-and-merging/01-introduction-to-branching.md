---
title: Einführung in Branches
---

Branching ist eine der mächtigsten Funktionen von Git. Es ermöglicht Entwicklern, **unabhängige Entwicklungslinien** zu erstellen, die sich vom Haupt-Repository abzweigen. Dadurch können Experimente, parallele Arbeit und eine sicherere Zusammenarbeit umgesetzt werden.

---

## Was ist ein Branch?

- Ein **Branch** ist im Wesentlichen ein Zeiger auf einen bestimmten Commit in der Versionsgeschichte.
- Jeder Branch stellt eine **eigene Entwicklungslinie** dar.
- Der Standard-Branch heißt typischerweise **`main`** (früher **`master`**).

Wenn ein neuer Branch erstellt wird, entsteht eine **parallele Zeitlinie**, in der Änderungen gemacht werden können, ohne das Hauptprojekt zu beeinflussen.

---

## Warum Branches verwenden?

Branches werden in der Softwareentwicklung aus mehreren Gründen genutzt:

1. **Features isolieren**
   - Neue Funktionen entwickeln, ohne den Haupt-Branch zu stören.
   - Für jede Funktion kann ein eigener Branch angelegt werden, der nach Fertigstellung wieder zurückgeführt wird.

2. **Neue Ideen testen**
   - Experimentelle Änderungen oder Prototypen ausprobieren.
   - Falls die Idee nicht funktioniert, kann der Branch einfach gelöscht werden – ohne Risiko für den Haupt-Branch.

3. **Konfliktfreie Zusammenarbeit**
   - Mehrere Entwickler können gleichzeitig an unterschiedlichen Branches arbeiten.
   - Verringert die Wahrscheinlichkeit von Konflikten beim späteren Zusammenführen.

---

## Der Standard-Branch: `main` (oder `master`)

- Jedes Git-Repository startet mit einem **Standard-Branch**.
- Dieser Branch enthält in der Regel den **stabilen, produktionsreifen Code**.
- Die Community hat sich weitgehend von `master` zu **`main`** als Standardbezeichnung verschoben.
- Andere Branches (z. B. Feature, Bugfix, Hotfix) werden nach Tests und Code-Reviews wieder in `main` integriert.

---

## Häufige Einsatzszenarien für Branches

- **Feature-Branches**: Entwicklung neuer Features (`feature/login-page`).
- **Bugfix-Branches**: Fehlerkorrekturen ohne Unterbrechung der Hauptentwicklung (`bugfix/header-issue`).
- **Hotfix-Branches**: Dringende Fehlerbehebung in der Produktion (`hotfix/payment-error`).
- **Experiment-Branches**: Testen neuer Ideen (`experiment/ui-redesign`).

---

## Vorteile von Branching in Git

- Sorgt für eine **aufgeräumtere Projekt-Historie** (durch isolierte Arbeit).
- Unterstützt **parallele Entwicklung** durch mehrere Teammitglieder.
- Ermöglicht ein **einfaches Umschalten zwischen Aufgaben**.
- Bietet einen **sicheren Raum für Experimente**.

---

## Visualisierung von Branches

Man kann sich den **main-Branch** als eine gerade Linie mit stabilem Code vorstellen.  
Wenn ein neuer Branch erstellt wird, entsteht ein **neuer Pfad**, der später durch **Merging** wieder in die Hauptlinie aufgenommen werden kann.

```bash
main ----A----B----C----D
E----F (feature-branch)
```

Hier:
- Commits `A → D` gehören zum `main`-Branch.
- Commits `E → F` gehören zum `feature-branch`.
- Der `feature-branch` kann später wieder in `main` integriert werden.

---

## Zusammenfassung

- **Branching** ist die Grundlage moderner kollaborativer Entwicklung mit Git.
- Jeder Branch ist eine unabhängige Entwicklungslinie.
- Entwickler nutzen Branches, um Features zu isolieren, Ideen zu testen und effektiver zusammenzuarbeiten.
- Der **Standard-Branch** ist in der Regel `main`, in dem stabiler, produktionsreifer Code liegt.

Das Verständnis von Branches ist essenziell, bevor man in weiterführende Konzepte wie **Merging** oder **Rebasing** einsteigt.
