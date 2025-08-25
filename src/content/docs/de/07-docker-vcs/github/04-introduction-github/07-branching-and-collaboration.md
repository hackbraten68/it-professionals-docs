---
title: Branching and Collaboration
---
# Branching und Zusammenarbeit

> Ein praxisnaher, für den Unterricht geeigneter Leitfaden zum Arbeiten mit Branches in Git und zur effektiven Zusammenarbeit in geteilten Repositories.

---

## 1) Grundidee: Was ist ein Branch?

Ein **Branch** ist eine unabhängige Entwicklungslinie – im Kern ein beweglicher Zeiger auf eine Reihe von Commits. Der Standardbranch heißt meist `main` (ältere Repos nutzen `master`). Branches ermöglichen dir:

- Arbeit zu isolieren (Features, Fixes, Experimente) vom stabilen Code
- Sicher zu iterieren, ohne den Standardbranch zu beschädigen
- Parallel im Team zu arbeiten und Änderungen zusammenzuführen, wenn sie bereit sind

---

## 2) Mentales Modell

- Denke an `main` als **Stamm** eines Baums.  
- Jeder **Feature-Branch** wächst vom Stamm ab.  
- Wenn das Feature fertig und getestet ist, **merged** man es zurück in den Stamm.

```bash
main ──●──●──────●────────●
          \
feature    ●──●──●──●───► (pull request → review → merge)
```

---

## 3) Wichtige Befehle (modern & klassisch)

### Auflisten & Erstellen

```bash
git branch                  # lokale Branches anzeigen
git branch -r               # Remote-Branches anzeigen
git branch -a               # alle (lokal + remote) anzeigen

# Branch erstellen (klassisch)
git branch new-feature

# Erstellen & wechseln in einem Schritt (modern)
git switch -c new-feature

# Klassisch wechseln (vor Git 2.23)
git checkout new-feature
```

### Wechseln & Synchronisieren

```bash
git switch main             # zurück zu main
git fetch origin            # Remote-Infos aktualisieren
git pull --ff-only          # sicher fast-forward auf main
```

### Pushen & Tracking

```bash
git push -u origin new-feature   # Branch pushen und Tracking setzen
git push                         # weitere Pushes nutzen Tracking
```

### Mergen (in aktuellen Branch)

```bash
git switch main
git merge new-feature            # feature in main mergen
```

### Löschen

```bash
git branch -d new-feature        # lokal löschen (sicher, nach Merge)
git branch -D new-feature        # lokal erzwingen (vorsicht!)
git push origin --delete new-feature   # remote löschen
```

---

## 4) Fast-Forward vs. 3-Way Merge

* **Fast-Forward**: `main` hat sich seit dem Abzweigen nicht bewegt. Git schiebt einfach den Zeiger vorwärts – kein neuer Merge-Commit.
* **3-Way Merge**: Beide Branches haben sich verändert. Git erstellt einen Merge-Commit, um die Historien zusammenzuführen.

Steuerung:

```bash
# Immer einen Merge-Commit erstellen (auch wenn FF möglich)
git merge --no-ff new-feature

# Lineare Historie erzwingen
git pull --ff-only
```

---

## 5) Branch aktuell halten

Halte deine Branches regelmäßig aktuell, um Konflikte zu reduzieren:

**Variante A – Merge von `main` in deinen Branch (nicht-linear, einfach):**

```bash
git switch new-feature
git fetch origin
git merge origin/main
```

**Variante B – Rebase deines Branches auf `main` (linear, saubere Historie):**

```bash
git switch new-feature
git fetch origin
git rebase origin/main
# Konflikte lösen → git add <files> → git rebase --continue
```

> Wichtig: Im Team abstimmen, ob **Merge** oder **Rebase** bevorzugt wird.

---

## 6) Kollaborations-Workflow (Pull Requests)

1. **Branch** von `main` erstellen: `git switch -c feat/login`
2. **Commits** klein und mit klaren Nachrichten
3. **Push** und **Pull Request (PR)** öffnen
4. **Automatische Checks** (CI, Linter, Tests) laufen
5. **Review**: Feedback, Änderungswünsche, Approval
6. **Branch aktualisieren** (mit main mergen/rebasen)
7. **Merge** über:

   * **Merge Commit** (volle Historie bleibt)
   * **Squash & Merge** (alles in einem Commit; gut für viele kleine Commits)
   * **Rebase & Merge** (linear, erhält alle Commits)
8. **Branch löschen** (lokal & remote)

---

## 7) Benennungskonventionen

Namen beschreibend, kleinbuchstaben, mit Typ-Präfix:

* `feat/user-onboarding`
* `fix/login-null-pointer`
* `docs/api-usage`
* `chore/ci-cache`
* `hotfix/payment-timeout`

Mit Ticket-ID (z. B. Jira): `feat/1234-user-onboarding`.

---

## 8) Bekannte Branching-Modelle

### GitHub Flow (einfach, CI/CD-freundlich)

* Nur ein dauerhafter Branch: `main`
* Kurze Feature-Branches → PR → Review → Merge → Deploy

### Git Flow (für Release-Zyklen)

* Dauerhafte Branches: `main` (Produktion), `develop` (Integration)
* Zusatz: `feature/*`, `release/*`, `hotfix/*`

### Trunk-Based Development

* Änderungen direkt und schnell auf `main`
* Branches leben < 1–2 Tage
* Inkomplette Features über Feature Flags

---

## 9) Merge-Konflikte lösen

Konflikte entstehen, wenn Änderungen die gleichen Stellen betreffen.

```bash
# Konflikte im Merge oder Rebase
# Dateien anpassen → richtige Version wählen
git add path/to/conflicted-file
git commit                # bei merge
git rebase --continue     # bei rebase
```

**Tipps:**

* Kleine PRs, früh committen
* Häufig rebasen/pullen
* Kommunikation bei kritischen Dateien

---

## 10) Best Practices für Reviews

**Für Autoren**

* Kleine PRs, klare Beschreibung
* Screenshots / Testhinweise
* Feedback zügig einarbeiten
* Squash & Merge bevorzugt (falls Team-Policy)

**Für Reviewer**

* Verhalten zuerst prüfen (Tests, Anforderungen)
* Sachlich bleiben, konkrete Verbesserungsvorschläge
* Nur freigeben, wenn Tests grün

---

## 11) Branch-Schutz & Berechtigungen

* PR-Review erforderlich (1–2 Approvals)
* CI-Checks müssen grün sein
* Force-Push verbieten
* Direkte Pushes auf `main` blockieren
* Optional: signierte Commits erzwingen

---

## 12) Commit-Strategie

* Nachrichten im **Imperativ**: `"Add login validation"`
* **Conventional Commits** nutzen:

  * `feat: add password strength meter`
  * `fix(auth): handle token refresh`
  * `docs(readme): update setup steps`
* Mit `git rebase -i` Fixup-Commits sauber zusammenfassen

---

## 13) Feature Flags

Unfertige Features hinter Flags verstecken:

* Früh mergen, trotzdem deploybar
* Flags in Config oder Code
* Alte Flags rechtzeitig entfernen

---

## 14) Erweiterte Branch-Operationen

```bash
# Release-Branch starten
git switch -c release/1.4.0

# Hotfix von Produktion
git switch -c hotfix/checkout-crash main

# Commit übernehmen
git cherry-pick <commit-sha>

# Merge rückgängig machen
git revert -m 1 <merge-commit-sha>

# WIP sichern
git stash push -m "WIP: tweak styles"
git stash list
git stash pop
```

---

## 15) Kollaborations-Checkliste

* [ ] Klar benannter Branch, mit Issue verknüpft
* [ ] Kleine, fokussierte Commits mit Tests
* [ ] Branch aktuell mit `main`
* [ ] CI grün, Linting ok
* [ ] PR mit guter Beschreibung & Screenshots
* [ ] Review abgeschlossen
* [ ] Merge nach Team-Regel (Merge, Squash, Rebase)
* [ ] Branch gelöscht

---

## 16) Typische Stolperfallen

* **“Diverged branches”** → `git pull --rebase` oder manuell `fetch` + `merge/rebase`
* **Falscher Commit auf `main`** → neuen Branch erstellen, `main` resetten, Commit cherry-picken
* **Force-Push auf Shared-Branch** → vermeiden, nur mit Absprache
* **Zu lange Branches** → lieber in kleinere Features splitten

---

## 17) Beispiel-Workflow

```bash
# Branch erstellen & pushen
git switch -c feat/profile-page
git add .
git commit -m "feat(profile): initial profile page"
git push -u origin feat/profile-page

# PR öffnen, CI läuft, Review einarbeiten
git add .
git commit -m "fix(profile): align avatar and bio"
git push

# Aktuell halten
git fetch origin
git rebase origin/main
git push --force-with-lease    # nur im eigenen Feature-Branch

# Merge, dann aufräumen
git switch main
git pull --ff-only
git branch -d feat/profile-page
git push origin --delete feat/profile-page
```

---

## 18) Kurzreferenz

```bash
# Erstellen & wechseln
git switch -c <branch>

# Push & track
git push -u origin <branch>

# Branch aktualisieren
git fetch origin
git rebase origin/main     # oder: git merge origin/main

# PR öffnen (GitHub/GitLab)

# Merge-Strategie: merge | squash | rebase

# Aufräumen
git branch -d <branch>
git push origin --delete <branch>
```

---

## Zusammenfassung

Branches sind das Fundament für sicheres, paralleles Arbeiten in Git. Wähle ein Branching-Modell, das zu deinem Release-Prozess passt, schütze `main`, halte Änderungen klein und überprüft, und nutze Automatisierung (CI/CD) für Qualität. Mit klaren Namen, diszipliniertem Updaten (merge oder rebase) und konsistenten Pull-Requests können Teams schnell **und** sicher ausliefern.
