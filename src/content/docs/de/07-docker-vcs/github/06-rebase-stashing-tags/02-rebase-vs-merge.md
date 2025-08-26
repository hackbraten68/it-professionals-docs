---
title: Rebase vs. Merge
---
# Rebase vs. Merge

Ein klarer, praxisnaher Leitfaden zur Entscheidung und Anwendung von Git Rebase und Merge – was sie tun, wann man welche Methode einsetzt, wie man Konflikte sicher löst und wie man sich bei Problemen erholt.

---

## 1) Grundlegender Überblick

### Merge

* **Was es macht:** Erstellt einen neuen **Merge-Commit**, der die Historien von zwei Branches zusammenführt.
* **Eigenschaft:** **Bewahrt** die exakte Historie beider Branches (nicht-lineare DAG).
* **Typische Nutzung:** Integration eines abgeschlossenen Feature-Branches in `main`, wobei die ursprüngliche Commit-Struktur erhalten bleibt.

```bash
Vorher:
A---B---C (main)
     \
      D---E (feature)

Nach Merge:
A---B---C------M (main)
     \        /
      D------E (feature)

M = Merge-Commit mit zwei Eltern
```

### Rebase

* **Was es macht:** **Schreibt die Historie um**, indem Commits von einem Branch „wiederholt“ werden, als ob sie von Anfang an auf einem anderen Branch basierten.
* **Eigenschaft:** Erzeugt eine **lineare** Historie.
* **Typische Nutzung:** Einen Feature-Branch auf den neuesten Stand von `main` bringen oder lokale Commits aufräumen, bevor sie geteilt werden.

```bash
Vorher:
A---B---C (main)
     \
      D---E (feature)

Rebase des Feature-Branches auf main:
A---B---C (main)
          \
           D'---E' (feature rebased)
```

---

## 2) Praxis-Vergleich

| Kriterium             | Merge                                               | Rebase                                              |
| --------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Verlauf               | Nicht-linear, explizite Merge-Commits               | Linear, neu geschriebene Commits                    |
| Nachvollziehbarkeit   | Zeigt, wann Branches auseinanderliefen/verschmolzen | Einfacher zu lesen, linearer Verlauf                |
| Sicherheit            | Sicher für geteilte Branches (keine Umschreibung)   | Sicher v. a. für lokale, unveröffentlichte Branches |
| Konfliktlösung        | Einmal pro Merge                                    | Möglicherweise mehrfach, pro wiederholtem Commit    |
| Besser geeignet, wenn | Kontext wichtig ist, gemeinsame Historie            | Saubere, lineare Historie gewünscht ist             |
| CI-Auswirkung         | Merge-Commit löst Pipeline einmal aus               | Rebase kann Tests pro Commit neu starten            |

---

## 3) Grundlegende Befehle

### Merge eines Feature-Branches in main

```bash
git checkout main
git pull origin main
git merge --no-ff feature
git push origin main
```

* `--no-ff`: Erzwingt einen Merge-Commit, auch wenn Fast-Forward möglich wäre.

### Rebase eines Feature-Branches auf main

```bash
git checkout feature
git fetch origin
git rebase origin/main
# Konflikte lösen, dann:
git rebase --continue
# Abbrechen, falls nötig:
git rebase --abort
```

### Interaktives Rebase (lokale Historie bearbeiten)

```bash
git rebase -i HEAD~3
```

* Aktionen: `pick`, `reword`, `edit`, `squash`, `fixup`, `drop`

---

## 4) Konfliktlösung bei Rebase oder Merge

1. Git stoppt beim ersten Konflikt.
2. Dateien öffnen und Konfliktmarker `<<<<<<<`, `=======`, `>>>>>>>` bereinigen.
3. Änderungen mit `git add` markieren.
4. Fortfahren:

   * Merge: `git commit` (falls nicht automatisch erstellt).
   * Rebase: `git rebase --continue`.

Falls festgefahren:

* Rebase abbrechen: `git rebase --abort`
* Merge abbrechen: `git merge --abort`

Tipp: `git rerere` merken, um Konfliktlösungen wiederzuverwenden.

```bash
git config --global rerere.enabled true
```

---

## 5) Wann Merge, wann Rebase?

### Merge bevorzugen

* Branch ist bereits **geteilt/veröffentlicht**.
* Nachvollziehbare Integrationspunkte sind wichtig.
* Große teamübergreifende Features, wo der Merge-Kontext zählt.

### Rebase bevorzugen

* Branch ist **lokal**.
* Aufräumen vor Veröffentlichung (z. B. Squash von WIP-Commits).
* Branch auf neuesten Stand von `main` bringen, um spätere Konflikte zu vermeiden.

---

## 6) Team-Strategien

1. **Lineare Historie:**

   * Entwickler rebased ihre Branches regelmäßig auf `main`.
   * Endintegration erfolgt mit Fast-Forward oder Squash-Merge.

2. **Merge-Commit-Strategie:**

   * Alle PRs werden mit Merge-Commits integriert.
   * Keine Umschreibung der Historie auf geteilten Branches.

3. **Hybrid:**

   * Lokales Aufräumen mit Rebase.
   * Integration ins Repo via Merge-Commit oder Squash-Merge.

---

## 7) Interaktives Rebase im Detail

Aktionen im Editor:

* `pick` – Commit übernehmen
* `reword` – Commit-Nachricht ändern
* `edit` – Commit-Inhalt ändern
* `squash` – Commit mit vorherigem kombinieren
* `fixup` – Wie `squash`, aber Nachricht verwerfen
* `drop` – Commit entfernen

---

## 8) Squash Merge vs. Rebase Squash

* **Squash Merge (UI):** Alles im Branch zu einem Commit auf `main`.
* **Rebase Squash:** Branch wird lokal vor dem Push zu wenigen Commits reduziert.

---

## 9) Fast-Forward vs. No-FF

* **Fast-Forward:** `main` bewegt sich direkt auf Branch-Spitze.

  ```bash
  git merge --ff-only feature
  ```
* **No-FF:** Erzwingt Merge-Commit, auch wenn FF möglich wäre.

  ```bash
  git merge --no-ff feature
  ```

---

## 10) Typische Stolperfallen

1. **Rebase auf geteilten Branches** → Historienchaos.
2. **Commits „verschwinden“** → Mit `git reflog` wiederherstellen.
3. **Konflikte bei jedem Commit** → Merge kann sinnvoller sein.
4. **Unübersichtliche Commit-Messages** → Interaktives Rebase nutzen.

---

## 11) Empfohlene Workflows

**A) Linear, sauber**

```bash
git checkout -b feature/xyz
# Arbeiten …
git fetch origin
git rebase origin/main
git push -u origin feature/xyz
```

**B) Historie mit Merge-Commits**

```bash
git checkout -b feature/xyz
git push -u origin feature/xyz
# PR mit Merge-Commit
```

**C) Lokales Aufräumen**

```bash
git commit --fixup <SHA>
git rebase -i --autosquash origin/main
```

---

## 12) Nützliche Einstellungen

```bash
git config --global rebase.autosquash true
git config --global pull.rebase true
git config --global rerere.enabled true
```

---

## 13) CI/CD & Code Review

* **Rebase vor PR** → weniger Konflikte, stabilere CI.
* **Merge-Commits** → besseres Debugging bei Integration.
* **Squash Merge** → sauberes `main`, granularer Verlauf nur in PR sichtbar.

---

## 14) Entscheidungs-Checkliste

* Branch geteilt? → **Merge**
* Saubere lineare Historie? → **Rebase**
* Auditierbare Integrationspunkte? → **Merge**
* Viele überlappende Änderungen? → **Merge** kann einfacher sein.

---

## 15) Beispiel-Session

```bash
git checkout feature/invoices
git fetch origin
git rebase -i --autosquash origin/main
git push --force-with-lease
```

Hinweis: **Immer `--force-with-lease` statt `--force` verwenden.**

---

## 16) Recovery-Strategien

* Falsches Rebase:

  ```bash
  git reflog
  git reset --hard <hash>
  ```
* Abbrechen:

  ```bash
  git rebase --abort
  git merge --abort
  ```

---

## 17) Kernaussagen

* **Merge**: bewahrt Historie, sicher für geteilte Branches.
* **Rebase**: schreibt um, ideal für lokale Aufräumarbeiten.
* **Wichtig:** Team-Policy definieren, um Konsistenz zu sichern.

---

## Anhang: Quick Reference

```bash
# Merge
git checkout main
git merge --no-ff feature
git push

# Rebase
git checkout feature
git fetch origin
git rebase origin/main
git push --force-with-lease

# Interaktiv
git rebase -i HEAD~N
git commit --fixup <SHA>
git rebase -i --autosquash HEAD~N

# Recovery
git reflog
git reset --hard <hash>
git rebase --abort
git merge --abort
```
