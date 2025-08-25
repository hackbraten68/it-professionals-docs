---
title: Gängige Git-Befehle
---
# Gängige Git-Befehle

Ein praxisorientierter, strukturierter Leitfaden zu den Git-Befehlen, die du am häufigsten verwenden wirst – was sie tun, warum sie wichtig sind und wie man sie sicher einsetzt. Beispiele gehen von einer Unix-ähnlichen Shell aus, funktionieren aber ähnlich unter Windows.

---

## Schnellreferenz

| Aufgabe                            | Befehl                        | Hinweise                                                   |
| ---------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| Repository initialisieren          | `git init`                    | Erstellt ein neues `.git/` im aktuellen Ordner             |
| Status prüfen                      | `git status`                  | Zeigt gestagte/nicht gestagte/ungetrackte Dateien & Branch |
| Änderungen stagen                  | `git add <path>`              | Mit `.` alle Änderungen stagen (vorsichtig einsetzen)      |
| Gestagte Änderungen committen      | `git commit -m "Nachricht"`   | Erstellt einen Schnappschuss der gestagten Änderungen      |
| Historie ansehen                   | `git log`                     | Mit Flags wie `--oneline --graph`                          |
| Nicht gestagte Diffs anzeigen      | `git diff`                    | Vergleicht Working Tree ↔ Index                            |
| Gestagte Diffs anzeigen            | `git diff --staged`           | Vergleicht Index ↔ letzter Commit                          |
| Commit inspizieren                 | `git show <commit>`           | Zeigt Patch und Metadaten                                  |
| Branch erstellen/wechseln          | `git switch -c <name>`        | Oder `git checkout -b <name>` für ältere Git-Versionen     |
| Branch zusammenführen              | `git merge <branch>`          | Fast-forward oder Merge-Commit                             |
| Mit neuem Commit rückgängig machen | `git revert <commit>`         | Sicher bei geteiltem Verlauf                               |
| Branch zurücksetzen                | `git reset --hard <commit>`   | Gefährlich bei geteilten Branches                          |
| Arbeit zwischenspeichern           | `git stash` / `git stash pop` | Säubert Working Tree ohne Commit                           |
| Mit Remotes arbeiten               | `git remote add`              | Remotes hinzufügen, listen oder löschen                    |
| Push zu Remote                     | `git push origin <branch>`    | Upload deiner Commits                                      |
| Pull von Remote                    | `git pull`                    | `fetch` + `merge` (oder `rebase`)                          |
| Version taggen                     | `git tag -a v1.0 -m "msg"`    | Lightweight oder annotierte Tags                           |

---

## Repository initialisieren

```bash
git init
```

**Was es macht:** Erstellt ein neues, leeres Git-Repository durch Anlegen eines `.git/`-Ordners. Wird in neuen oder bestehenden Projektordnern verwendet.

**Typisches Muster**

```bash
mkdir mein-projekt && cd mein-projekt
git init
```

**Tipps**

* Falls du versehentlich im falschen Ordner `init` ausgeführt hast, einfach den `.git/`-Ordner löschen, um es rückgängig zu machen.
* Für neue Projekte empfiehlt sich ein `.gitignore` von Anfang an.

---

## Status prüfen

```bash
git status
```

**Was angezeigt wird:**

* Aktueller Branch
* Ob dein Branch dem Remote voraus/nachhinkt
* Ungetrackte Dateien
* Nicht gestagte Änderungen
* Gestagte Änderungen

**Nützliche Option**

```bash
git status -sb   # kurze Ausgabe + Branch-Info
```

---

## Dateien zum Staging hinzufügen

```bash
git add <datei>         # einzelne Datei stagen
git add ordner/         # Ordner stagen
git add -p              # interaktives Auswählen von Änderungen
git add .               # alle Änderungen im aktuellen Verzeichnis
```

**Was "Staging" bedeutet:** Du wählst genau aus, was in den nächsten Commit aufgenommen wird. Dadurch entstehen kleine, fokussierte Commits.

**Tipps**

* `git add -p` ist hilfreich, um saubere Commits aus unordentlicher Arbeit zu erstellen.
* Vorsicht mit `git add .` in großen Projekten – man staged schnell zu viel.

---

## Gestagte Änderungen committen

```bash
git commit -m "Beschreibe deine Änderungen"
```

**Was es macht:** Erstellt einen Schnappschuss des Staging-Bereichs mit Nachricht.

**Gute Commit-Nachrichten**

* Erste Zeile: kurze, imperative Form → „Füge Login-Formular hinzu“
* Optional: Leerzeile und genauere Details (was/warum).

**Optionen**

```bash
git commit            # öffnet Editor für ausführliche Nachricht
git commit --amend    # letzten Commit ändern/ergänzen
```

⚠️ **Achtung:** `--amend` ändert die Historie. Nur für Commits nutzen, die noch **nicht gepusht** wurden.

---

## Commit-Historie ansehen

```bash
git log
```

**Lesbare Formate**

```bash
git log --oneline --graph --decorate --all
git log --stat
git log -p
git log -- <datei-oder-ordner>
```

**Filtern**

```bash
git log --author="Alice"
git log --since="2025-08-01"
git log --grep="hotfix"
```

---

## Änderungen vergleichen (Diff)

```bash
git diff                 # Working Tree ↔ Index
git diff --staged        # Index ↔ HEAD
git diff HEAD~1..HEAD    # letzter Commit vs. vorheriger
git diff main..feature   # Branch vs. Branch
```

Tipp: Mit `--word-diff` bekommst du bessere Übersicht bei Textdateien.

---

## Branching und Wechseln

```bash
git branch                  # Branches auflisten
git switch -c feature/login # neuen Branch erstellen + wechseln
git switch main             # zu existierendem Branch wechseln
```

Konvention: kurze, beschreibende Namen wie `feature/…`, `fix/…`.

---

## Merge (Zusammenführen)

```bash
git switch main
git merge feature/login
```

**Ergebnisse**

* **Fast-forward:** einfacher Vorwärtssprung
* **Merge-Commit:** neuer Commit kombiniert Verläufe
* **Konflikte:** manuelle Auflösung, dann:

  ```bash
  git add <gelöste-dateien>
  git commit
  ```

---

## Rebase (fortgeschritten)

```bash
git switch feature/login
git rebase main
```

Spielt deine Commits auf eine neue Basis. Führt zu linearer Historie.
⚠️ Niemals Commits von bereits geteilten Branches rebasen.

---

## Stash (Arbeit zwischenlagern)

```bash
git stash
git stash list
git stash show -p
git stash pop
git stash apply
```

Nützlich, wenn du kurzfristig Branch wechseln oder Updates ziehen musst.

---

## Restore & Reset (Rückgängig machen)

**Restore (sicherer für Dateien)**

```bash
git restore <datei>            
git restore --staged <datei>
```

**Reset (verschiebt Zeiger)**

```bash
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

**Revert (sicher im Team)**

```bash
git revert <commit>
```

Erstellt einen neuen Commit, der Änderungen rückgängig macht.

---

## Dateien löschen oder umbenennen

```bash
git rm <datei>
git mv alt neu
```

---

## Arbeiten mit Remotes

```bash
git remote add origin <url>
git remote -v
```

**Clonen**

```bash
git clone <url> [ordnername]
```

**Push/Pull**

```bash
git fetch
git pull
git push origin <branch>
```

---

## Tags (Versionierung)

```bash
git tag
git tag -a v1.0 -m "Release 1.0"
git push origin v1.0
git push origin --tags
```

---

## .gitignore Grundlagen

Dateien/Ordner ausschließen:

```bash
node_modules/
dist/
.DS_Store
```

---

## Saubere Workflows

* Kleine, fokussierte Commits schreiben.
* `git add -p` für präzises Staging.
* Bei geteilten Branches lieber `revert` statt `reset --hard`.
* Praktische Aliase:

  ```bash
  git config --global alias.st status
  git config --global alias.lg 'log --oneline --graph --decorate --all'
  ```

---

## Häufige Fehlerfälle

* Falsche Datei gestaged → `git restore --staged <datei>`
* Commit auf falschem Branch → `git cherry-pick` + `git reset`
* Datei im letzten Commit vergessen → `git commit --amend`
* Mehrere Commits zusammenfassen → `git reset --soft HEAD~N` + neuer Commit

---

## Minimaler Workflow (Alltag)

```bash
git switch main
git pull
git switch -c feature/kontakt-formular
git add -p
git commit -m "Füge Kontaktformular hinzu"
git rebase origin/main
git push -u origin feature/kontakt-formular
```

---

## Nächste Themen

* Interaktives Rebase (`git rebase -i`)
* `git bisect` für Fehler-Suche
* Submodule & Monorepos
* Signierte Commits & Release-Tags

---

✅ **Checkliste**

* [ ] Repo initialisiert (`git init` oder `git clone`)
* [ ] Sauberer Status vor Commit (`git status`, `git diff`)
* [ ] Änderungen gezielt gestaged (`git add -p`)
* [ ] Aussagekräftige Nachricht (`git commit -m "…"`)
* [ ] Richtig gepusht (`git push -u origin <branch>`)
* [ ] Übersichtliche Historie (`git log --oneline --graph`)
