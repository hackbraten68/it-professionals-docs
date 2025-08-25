---
title: Zentrale Konzepte in Git (als Beispiel für ein DVCS)
---

## Einführung

Git ist eines der beliebtesten **verteilten Versionskontrollsysteme (DVCS)**.  
Im Gegensatz zu zentralisierten Systemen besitzt jeder Benutzer eine vollständige Kopie des Repositories – inklusive seiner gesamten Historie.  
Das Verständnis der wichtigsten Git-Konzepte ist entscheidend, um Code effektiv zu verwalten, mit anderen zusammenzuarbeiten und einen sauberen Entwicklungs-Workflow aufrechtzuerhalten.

---

## Repository

- Ein **Repository (Repo)** ist der zentrale Speicherort für die Dateien eines Projekts und dessen gesamte Versionsgeschichte.  
- Es enthält:
  - Das Arbeitsverzeichnis (die Dateien, die aktiv bearbeitet werden).
  - Den Staging-Bereich (wo Änderungen vor dem Commit vorbereitet werden).
  - Das versteckte Verzeichnis `.git` (enthält Metadaten zu Historie, Branches und Konfiguration).
- Repositories können **lokal** (auf deinem Rechner) oder **remote** (z. B. auf GitHub, GitLab, Bitbucket) existieren.

---

## Commit

- Ein **Commit** ist wie ein Schnappschuss des Projekts zu einem bestimmten Zeitpunkt.  
- Jeder Commit speichert:
  - Die vorgenommenen Änderungen (hinzugefügte, geänderte oder gelöschte Dateien).
  - Eine eindeutige Commit-ID (SHA-Hash).
  - Informationen über den Autor sowie einen Zeitstempel.
  - Eine Commit-Nachricht, die den Zweck der Änderung beschreibt.
- Commits bilden eine Entwicklungslinie, durch die man navigieren, Änderungen zurücknehmen oder neue Arbeit aufbauen kann.

---

## Branch

- Ein **Branch** ist eine separate Entwicklungslinie.  
- Standardmäßig erstellt Git den Branch `main` (früher `master`).  
- Entwickler erstellen neue Branches, um:
  - Features unabhängig zu entwickeln.
  - Neue Ideen auszuprobieren, ohne den Hauptcode zu beeinflussen.
  - Fehler zu beheben, während die stabile Version unangetastet bleibt.
- Branches ermöglichen parallele Entwicklung und vereinfachen die Zusammenarbeit im Team.

---

## Merge

- **Mergen** bedeutet, Änderungen aus einem Branch in einen anderen zu integrieren.  
- Typische Szenarien:
  - Einen Feature-Branch nach Abschluss in `main` integrieren.
  - Konflikte lösen, wenn verschiedene Branches dieselben Codestellen verändert haben.
- Merge-Arten:
  - **Fast-Forward-Merge**: keine Konflikte, die Branch-Historie wird einfach fortgeführt.
  - **Drei-Wege-Merge**: unterschiedliche Entwicklungslinien werden zusammengeführt, evtl. mit Konfliktlösung.

---

## Clone

- Ein Repository zu **klonen** bedeutet, eine vollständige Kopie auf dem eigenen Rechner zu erstellen.  
- Im Gegensatz zum Herunterladen einer ZIP-Datei enthält ein Clone:
  - Die komplette Commit-Historie.
  - Alle Branches, Tags und Metadaten.
- Beispielbefehl:

  ```bash
  git clone https://github.com/user/projekt.git
```

* So kannst du auch offline arbeiten und später wieder mit dem Remote synchronisieren.

---

## Push und Pull

* **Push**: Lädt deine lokalen Commits in ein Remote-Repository hoch, sodass andere darauf zugreifen können.

  ```bash
  git push origin main
  ```
* **Pull**: Holt neue Commits aus dem Remote-Repository und integriert sie in deinen lokalen Branch.

  ```bash
  git pull origin main
  ```
* Zusammen sorgen Push und Pull dafür, dass lokale und entfernte Repositories synchron bleiben.

---

## Fazit

Diese grundlegenden Konzepte – Repository, Commit, Branch, Merge, Clone, Push und Pull – bilden das Fundament der Arbeit mit Git.
Wer sie beherrscht, kann:

* Saubere Versionsgeschichten pflegen.
* Effektiv im Team zusammenarbeiten.
* Sicher experimentieren, ohne den Hauptcode zu gefährden.

Das Verständnis dieser Prinzipien ist der erste Schritt, Git sowohl in persönlichen als auch in professionellen Softwareprojekten erfolgreich einzusetzen.
