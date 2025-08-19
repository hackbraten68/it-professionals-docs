---
title: Resolving Conflicts
---
# Resolving Conflicts — A Practical, End‑to‑End Guide

Conflicts happen when Git cannot automatically combine changes from different commits or branches. They’re a natural part of collaborative work—not a failure. This guide explains **why conflicts occur**, **how to resolve them safely**, and **how to reduce their frequency**. It’s designed for hands‑on learning in courses, workshops, and team onboarding.

---

## 1) What is a Merge Conflict?

A merge conflict occurs when Git’s automatic **three‑way merge** can’t decide which version of a line (or block) to keep. Typical situations:

* Two people edit the same lines in the same file.
* One branch renames or deletes a file that another branch edits.
* History rewriting (e.g., **rebase**) changes commit ordering, creating incompatible edits.

Conflicts can appear during:

* `git merge`
* `git rebase`
* `git cherry-pick`
* `git revert`
* `git stash pop` / `git stash apply`

---

## 2) Quick Resolution Flow (Cheat Sheet)

```bash
# 0) Make sure your working tree is clean (commit or stash local changes)
git status

# 1) Update local main and your branch
git checkout main
git pull
git checkout feature/my-feature
git merge main       # or: git rebase main

# 2) Resolve conflicts in files flagged by `git status`
#    Fix markers, test locally.

git add <fixed-files>
git commit           # if merging
# or:
git rebase --continue

# 3) Push the resolved history
git push
```

> For your original input:
>
> ```bash
> git checkout feature/my-feature
> git pull origin main
> # Fix conflicts in your code editor
> git add .
> git commit -m "Resolved merge conflicts"
> git push
> ```

---

## 3) Recognizing Conflict Markers

When a conflict occurs, Git inserts **conflict markers** into files:

```diff
<<<<<<< HEAD
console.log("Welcome!");
=======
console.log("Hello!");
>>>>>>> feature/new-greeting
```

* `<<<<<<< HEAD` = your current branch’s version
* `=======`      = separator
* `>>>>>>> other-branch` = the incoming changes

**Your task:** edit the file to produce the correct final content, then remove all markers.

---

## 4) The Safe, Step‑by‑Step Method

### A) Prepare and Merge (or Rebase)

1. **Sync main**

   ```bash
   git checkout main
   git pull
   ```

2. **Update your branch**

   ```bash
   git checkout feature/my-feature
   git merge main         # integrates main into your branch
   # OR (alternative history style):
   git rebase main        # replays your commits atop main
   ```

> **When to choose which?**
>
> * **Merge** keeps full history as it happened (great for teams that value traceability).
> * **Rebase** produces a cleaner, linear history (nice for readability before opening a PR).
>   Never rebase **shared** branches that others have already pulled.

### B) Inspect Conflicts

Run:

```bash
git status
```

Typical output:

```bash
both modified:   src/app.ts
deleted by them: docs/old-guide.md
```

### C) Resolve File‑by‑File

Open each conflicted file and decide the correct result. Useful commands:

* View the two sides and base:

  ```bash
  git diff --merge src/app.ts         # shows base, ours, theirs hunks
  ```

* See only your side vs. theirs:

  ```bash
  git show :1:src/app.ts  # base
  git show :2:src/app.ts  # ours (current)
  git show :3:src/app.ts  # theirs (incoming)
  ```

**Then edit files to the desired final state** and remove all markers.

### D) Stage and Continue

* For a **merge**:

  ```bash
  git add src/app.ts
  git commit              # or `git commit -m "Resolve conflict in app.ts"`
  ```

* For a **rebase**:

  ```bash
  git add src/app.ts
  git rebase --continue
  ```

### E) Test, Push, and Verify

```bash
npm test        # or your test command
git push
```

If you rebased previously pushed commits:

```bash
git push --force-with-lease
```

> Prefer `--force-with-lease` to avoid overwriting teammates’ new work.

---

## 5) Special Conflict Scenarios & Strategies

### A) Deleted vs. Modified

If one branch **deletes** a file that the other **modifies**, decide whether to keep or delete the file.

* Keep it (modified version):

  ```bash
  # Restore file, fix if needed, then
  git add <file>
  ```

* Keep the deletion:

  ```bash
  git rm <file>
  git add -A
  ```

### B) Renames

If both branches **rename** a file differently, pick a final name and ensure imports/build still work. Test after resolution.

### C) Binary Files

Binary conflicts can’t be auto‑merged. Options:

* Choose one side:

  ```bash
  git checkout --ours path/to/image.png
  # or
  git checkout --theirs path/to/image.png
  git add path/to/image.png
  ```

* Recreate the file from source or re‑export as needed.

Define binary files in `.gitattributes` to prevent accidental line‑based merges:

```bash
*.png binary
*.jpg binary
```

### D) Large, Multi‑File Conflicts

Resolve incrementally:

```bash
# Triage, resolve a subset, commit, then continue
git add path/one path/two
git commit -m "Resolve part 1"
# continue with remaining files
```

### E) Merge Options for Tough Cases

* Prefer **our** changes when safe:

  ```bash
  git merge -X ours main
  ```

* Prefer **their** changes:

  ```bash
  git merge -X theirs main
  ```

> Use these **sparingly**. They apply a default preference where conflicts arise, but you might still need manual edits.

---

## 6) Helpful Tools (CLI & GUI)

* **CLI**: `git mergetool` launches a configured merge tool.

  ```bash
  git config --global merge.tool vimdiff  # or kdiff3, meld, etc.
  git mergetool
  ```
* **Editors with merge UI**: VS Code, JetBrains IDEs, Sublime Merge, etc.
  They show **Current/Ours** vs **Incoming/Theirs** and a **Result** pane.

> Tip for VS Code: After starting a merge/rebase, open the conflicted file and use the inline actions **Accept Current / Incoming / Both / Compare Changes**. Always run tests after merging.

---

## 7) Resolving Conflicts During Rebase

Rebase repeats commits one by one; conflicts may occur multiple times.

```bash
git rebase main
# fix files
git add .
git rebase --continue
# if a commit is unnecessary after conflict:
git rebase --skip
# to bail out:
git rebase --abort
```

Use `git rebase -i main` (interactive) to **reorder**, **squash**, or **edit** commits, which can reduce noise and help resolve conflicts once instead of repeatedly.

---

## 8) Advanced: Make Future Conflicts Easier

### A) `.gitattributes` for Smarter Merges

```gitattributes
# Treat these as binary (no text merge)
*.png binary
*.pdf binary

# Favor union merging for frequently appended files (keeps both sides)
CHANGELOG.md merge=union
```

Enable the union driver:

```bash
git config --global merge.union.driver true
```

Or tie a custom driver name to the built‑in `union`:

```gitattributes
CHANGELOG.md merge=union
```

### B) `rerere` (Reuse Recorded Resolution)

Git can remember how you resolved a conflict and **auto‑apply** the same resolution next time the conflict recurs.

```bash
git config --global rerere.enabled true
```

### C) Normalize Line Endings

Line‑ending mismatches cause noisy diffs. Add:

```bash
* text=auto
```

to `.gitattributes` and ensure teammates use the same setting.

---

## 9) Team Practices to Reduce Conflicts

* **Keep PRs small and focused.**
* **Sync frequently** with `main` (or `git pull --rebase` on your feature branch).
* **Communicate ownership** of high‑churn files; serialize edits where sensible.
* **Automate formatting** (Prettier, Black, gofmt) to avoid whitespace conflicts.
* **Protect branches** and require checks to pass before merging.
* **Adopt a consistent branching strategy** (GitHub Flow, Git Flow, Trunk‑Based Development).

---

## 10) Troubleshooting & Recovery

* **I messed up the merge. How do I start over?**

  ```bash
  git merge --abort           # during a merge
  git rebase --abort          # during a rebase
  ```

* **I force‑pushed bad history. Can we recover?**

  * Use `git reflog` locally to find the last good commit.
  * Coordinate with teammates; you may need to re‑push a corrected branch.

* **Conflicts keep reappearing. Why?**

  * You may be rebasing and hitting the same hunk repeatedly. Consider merging once, or squash related commits to apply the resolution once.

* **“Both added” conflicts in new files**

  * Two branches added different files with the same path. Rename one file and update imports.

---

## 11) Example: End‑to‑End Conflict Resolution

**Scenario:** Two edits to the same function.

1. Update main & merge:

   ```bash
   git checkout main && git pull
   git checkout feature/price-calculator
   git merge main
   ```

2. Fix conflict markers in `src/calc.ts`, run tests:

   ```bash
   npm test
   ```

3. Stage & commit:

   ```bash
   git add src/calc.ts
   git commit -m "Resolve conflict in calc.ts by preserving tax rounding from main"
   git push
   ```

4. Open/refresh PR; ensure CI is green; request review.

---

## 12) Classroom & Workshop Exercises

1. **Simple Line Conflict**

   * Two students edit the same line in `greeting.js` on separate branches.
   * Merge and resolve; include both messages conditionally.

2. **Rename + Edit**

   * One branch renames `utils.js` → `helpers.js`, the other edits a function in `utils.js`.
   * Resolve by ensuring the function ends up in `helpers.js` and imports are updated.

3. **Binary Conflict**

   * Replace an image with two different versions on two branches.
   * Decide which to keep; demonstrate `.gitattributes` binary handling.

4. **Rebase Marathon**

   * Create 3 small commits on a feature branch; rebase onto an updated main that changes the same file thrice.
   * Practice `git rebase --continue`, `--skip`, and squash in `-i`.

---

## 13) Reference Commands (At a Glance)

```bash
# Status and diff
git status
git diff                     # unstaged
git diff --staged            # staged
git diff --merge <file>      # base/ours/theirs hunks

# Merge and resolve
git merge main
git add <file>
git commit

# Rebase and resolve
git rebase main
git rebase --continue
git rebase --skip
git rebase --abort

# Choose one side for a conflicted file
git checkout --ours <file>
git checkout --theirs <file>
git add <file>

# Tools
git mergetool
git config --global rerere.enabled true
```

---

## 14) Review Checklist (Before You Push)

* [ ] All conflict markers removed (`<<<<<<<`, `=======`, `>>>>>>>`)
* [ ] Code compiles; tests pass locally
* [ ] Imports/renames adjusted; no dead files left behind
* [ ] Commit message explains **why** the chosen resolution is correct
* [ ] Pushed with `--force-with-lease` if rebased
* [ ] PR updated; CI green; reviewer notified

---

### Key Takeaways

* Conflicts are normal. Approach them methodically.
* Prefer **small, frequent integrations** to reduce conflict blast radius.
* Use tooling (`mergetool`, rerere, `.gitattributes`, formatters) to make conflicts rarer and easier.
* Always test after resolving.
* Communicate early when multiple people touch the same hotspots.
