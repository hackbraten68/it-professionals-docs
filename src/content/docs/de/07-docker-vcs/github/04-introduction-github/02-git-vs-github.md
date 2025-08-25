---
title: Git vs. GitHub
---

Das Verständnis des Unterschieds zwischen **Git** und **GitHub** ist grundlegend, wenn man Versionskontrolle und kollaborative Softwareentwicklung erlernen möchte. Obwohl beide eng miteinander verbunden sind, erfüllen sie unterschiedliche Aufgaben.

---

## 1. Was ist Git?

Git ist ein **verteiltes Versionskontrollsystem (DVCS)**. Es wurde 2005 von Linus Torvalds entwickelt, um Entwicklern zu helfen, Änderungen im Quellcode effizient zu verwalten.  

Wichtige Merkmale von Git:

- **Lokal zuerst**: Alle Operationen (Commits, Branching, Merging) erfolgen lokal, ohne dass eine Internetverbindung erforderlich ist.  
- **Snapshots, keine Diffs**: Git speichert Momentaufnahmen der Projektdateien anstatt nur Unterschiede, was Geschwindigkeit und Zuverlässigkeit sicherstellt.  
- **Branching und Merging**: Entwickler können neue Funktionen in eigenen Branches ausprobieren und diese später in das Hauptprojekt zurückführen.  
- **Kommandozeilenbasiert**: Hauptsächlich wird Git über Befehle wie `git add`, `git commit`, `git push` und `git pull` bedient.  

**Anwendungsbeispiel**: Ein Entwickler arbeitet an einer neuen Funktion, kann Änderungen nachverfolgen, Fehler rückgängig machen und die gesamte Projektgeschichte lokal speichern – ganz ohne Internet.

---

## 2. Was ist GitHub?

GitHub ist eine **cloudbasierte Hosting-Plattform für Git-Repositories**. Während Git lokal läuft, bietet GitHub einen **Online-Speicherplatz**, in dem Entwickler Projekte ablegen, teilen und gemeinsam bearbeiten können.  

Wichtige Merkmale von GitHub:

- **Kollaborationstools**: Issue-Tracking, Pull Requests, Diskussionen und Projektboards.  
- **Remote-Repositories**: Code kann von einem lokalen Git-Repository zu GitHub hochgeladen werden, um Teamarbeit zu ermöglichen.  
- **Grafische Benutzeroberfläche (GUI)**: Eine Weboberfläche zum Durchsuchen des Codes, Verfolgen von Änderungen und Verwalten von Projekten.  
- **Integrationen**: GitHub Actions für CI/CD, GitHub Pages für Hosting und Schnittstellen zu anderen Entwickler-Tools.  

**Anwendungsbeispiel**: Ein global verteiltes Entwicklerteam kann am selben Projekt arbeiten, Pull Requests zur Code-Überprüfung einreichen und Fehler über Issues verfolgen – alles zentral in GitHub.

---

## 3. Wichtige Unterschiede: Git vs. GitHub

| Merkmal        | Git | GitHub |
|----------------|-----|--------|
| **Typ**        | Lokales Versionskontrollsystem | Cloudbasierte Hosting-Plattform |
| **Arbeitsweise** | Funktioniert offline | Benötigt Internet für Push/Pull |
| **Oberfläche** | Kommandozeilen-Tool | Weboberfläche, Desktop-App, APIs |
| **Kollaboration** | Einzelarbeit, geteilte Repos nur manuell | Integrierte Zusammenarbeit (Issues, Pull Requests, Reviews) |
| **Umfang**     | Verfolgt und verwaltet Codehistorie lokal | Bietet Hosting und globale Teamarbeit |
| **Kosten**     | Kostenlos, Open Source | Kostenlos für öffentliche Repos, kostenpflichtige Pläne für Private/Enterprise |

---

## 4. Wie Git und GitHub zusammenarbeiten

1. **Git lokal initialisieren**: Ein Entwickler erstellt ein Git-Repository auf dem eigenen Rechner (`git init`).  
2. **Änderungen nachverfolgen**: Dateien werden hinzugefügt und committet (`git add`, `git commit`).  
3. **Mit GitHub verbinden**: Das lokale Repository wird mit GitHub verknüpft (`git remote add origin`).  
4. **Code hochladen**: Der Code wird mit `git push` zu GitHub übertragen, damit andere darauf zugreifen können.  
5. **Zusammenarbeiten**: Teammitglieder klonen das Repository, arbeiten in Branches und senden Pull Requests für Reviews.  

Dieses Zusammenspiel macht Git stark für Versionskontrolle und GitHub unverzichtbar für Teamarbeit.

---

## 5. Zusammenfassung

- **Git = Werkzeug**: Ein verteiltes Versionskontrollsystem, das lokal läuft.  
- **GitHub = Dienst**: Eine Plattform, die Git-Repositories hostet und Kollaboration, Hosting und Projektmanagement ergänzt.  

Kurz gesagt:  
> *Git ist der Motor, der deine Projekthistorie verwaltet, während GitHub die Garage ist, in der du diesen Motor mit anderen teilen und gemeinsam weiterentwickeln kannst.*

---
