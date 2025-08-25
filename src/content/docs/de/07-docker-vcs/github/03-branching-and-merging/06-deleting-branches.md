---
title: Branches löschen
---
# Branches löschen

Das Aufräumen von Branches ist ein wichtiger Teil, um ein Git-Repository übersichtlich und leicht navigierbar zu halten. Dieser Leitfaden erklärt, **wann** und **wie** man Branches löscht – sowohl lokal als auch auf Remotes – inklusive Sicherheitsprüfungen, Wiederherstellungsoptionen und Automatisierungstipps.

---

## Warum Branches löschen?

* **Weniger Unordnung:** Weniger alte Branches in `git branch -a` und im Remote-UI.
* **Signal für Abschluss:** Das Löschen eines Feature-Branches zeigt, dass die Arbeit abgeschlossen und gemerged ist.
* **Fehler vermeiden:** Alte Branches können zu Verwirrung führen oder veraltete Arbeit verstecken.

---

## Voraussetzungen & Begriffe

* **Lokaler Branch:** Existiert nur im lokalen Clone (z. B. `feature-login`).
* **Remote Branch:** Existiert auf einem Remote-Server (z. B. `origin/feature-login`).
* **Tracking Branch:** Ein lokaler Branch, der einen Remote-Branch verfolgt.

> Du kannst den Branch, auf dem du dich gerade befindest, **nicht löschen**. Wechsle vorher auf einen anderen Branch, z. B. `git switch main`.

---

## Lokale Branches löschen

### Sicheres Löschen (nur wenn gemerged)

```bash
git branch -d feature-login
```

* Bricht mit einer Warnung ab, falls `feature-login` nicht vollständig in den aktuellen Branch (z. B. `main`) gemerged ist.
* Verwende dies, wenn du sicher bist, dass der Branch über einen PR oder Merge integriert wurde.

### Erzwingen des Löschens (auch ungemergt)

```bash
git branch -D feature-login
```

* `-D` ist Kurzform für `--delete --force`.
* Vorsicht: Nicht gemergte Arbeit kann verloren gehen (über Reflog aber wiederherstellbar, siehe **Wiederherstellung**).

### Häufige Fehler

* **„error: Cannot delete branch 'X' checked out …“**
  → Zuerst den Branch wechseln:

  ```bash
  git switch main
  git branch -d X
  ```

* **„The branch 'X' is not fully merged.“**
  → Entweder mergen oder mit `-D` löschen (Risiko beachten).

---

## Remote Branches löschen

### Moderne Syntax

```bash
git push origin --delete feature-login
```

### Ältere Variante (funktioniert noch)

```bash
git push origin :feature-login
```

**Hinweise:**

* Das Löschen des Remote-Branches löscht **nicht automatisch** deinen lokalen Branch.
* Standard- oder geschützte Branches (z. B. `main`) können nicht so einfach gelöscht werden.

---

## Lokale Referenzen zu gelöschten Remote-Branches aufräumen

Nach dem Entfernen eines Remote-Branches kann er lokal noch angezeigt werden, bis du prune ausführst:

```bash
git fetch --prune
# oder kurz:
git fetch -p
```

Alternativ:

```bash
git remote prune origin
```

---

## Vor dem Löschen prüfen

### Gemergte Branches anzeigen

```bash
git branch --merged
```

### Nicht gemergte Branches anzeigen

```bash
git branch --no-merged
```

> Best Practice: Lösche nur Branches, die in `--merged` erscheinen.

---

## Typischer Workflow (Feature-Branch)

1. Hauptbranch aktualisieren & Feature mergen:

   ```bash
   git switch main
   git pull
   git merge --no-ff feature-login   # oder PR-Merge
   ```

2. Lokalen Branch löschen:

   ```bash
   git branch -d feature-login
   ```

3. Remote-Branch löschen:

   ```bash
   git push origin --delete feature-login
   ```

4. Stale References aufräumen:

   ```bash
   git fetch -p
   ```

---

## Gelöschte Branches wiederherstellen

Falls lokal gelöscht:

1. Commit über Reflog suchen:

   ```bash
   git reflog
   ```

2. Branch neu erstellen:

   ```bash
   git branch feature-login <commit-hash>
   ```

3. (Optional) wieder auf Remote pushen:

   ```bash
   git push -u origin feature-login
   ```

Falls nur Remote gelöscht, aber lokal vorhanden:

```bash
git push -u origin feature-login
```

Falls komplett verloren: Reflog prüfen oder Merge-Commit als Basis nutzen.

---

## Geschützte und Standard-Branches

* **Standard-Branch** (z. B. `main`) ist meist geschützt.
* **Branch-Schutzregeln** (GitHub/GitLab/Bitbucket) verhindern oft Löschung oder erzwingen Reviews/Checks.

---

## Löschen über Git-Plattformen (UI)

* Meist gibt es im Pull/Merge Request einen Button **„Branch löschen“**.
* Dies betrifft nur den Remote, lokale Branches bleiben bestehen.

---

## Bulk-Cleanup: Alle lokal gemergten Branches löschen

**Liste anzeigen (Vorschau):**

```bash
git checkout main
git fetch -p
git branch --merged main | egrep -v "^\*|main|master|develop"
```

**Automatisch löschen:**

```bash
git branch --merged main \
  | egrep -v "^\*|main|master|develop" \
  | xargs -n 1 git branch -d
```

---

## Tipps zur Ordnung

* **Namenskonventionen nutzen:** z. B. `feat/`, `fix/`, `chore/`.
* **Direkt nach Merge löschen:** Teil der PR-Checkliste machen.
* **Automatisiert aufräumen:** Regelmäßig `git fetch -p` nutzen.
* **Kurze Feature-Branches:** Lieber kleine, schnelle Merges statt lange Branches.

---

## FAQ

**Muss ich sowohl lokal als auch Remote löschen?**
Ja, beide existieren unabhängig voneinander.

**Kann ich den aktiven Branch löschen?**
Nein, vorher wechseln.

**Unterschied `-d` vs. `-D`?**

* `-d`: löscht nur, wenn gemergt.
* `-D`: erzwingt Löschung.

**Werden die Commits gelöscht?**
Nur, wenn sie nirgendwo referenziert sind. Ansonsten bleiben sie erhalten.

**Wie sehe ich Remote-Branches?**

```bash
git branch -r   # nur Remote
git branch -a   # alle
```

---

## Schnellreferenz

```bash
# Lokal löschen (sicher)
git branch -d <branch>

# Lokal löschen (erzwingen)
git branch -D <branch>

# Remote löschen
git push origin --delete <branch>
# oder
git push origin :<branch>

# Aufräumen
git fetch -p

# Gemergte / ungemergte anzeigen
git branch --merged
git branch --no-merged

# Wiederherstellung über Reflog
git reflog
git branch <branch> <commit>
```

---

Mit diesen Praktiken bleiben Repositories **aufgeräumt, verständlich und sicher für die Zusammenarbeit**. ✅
