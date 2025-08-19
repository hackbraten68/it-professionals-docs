---
title: Rebase vs. Merge
---
# Rebase vs. Merge

A clear, practical guide to choosing and using Git rebase and merge—what they do, when to use each, how to resolve conflicts safely, and how to recover if something goes wrong.

---

## 1) Conceptual Overview

### Merge

* **What it does:** Creates a new **merge commit** that ties together the histories of two branches.
* **Key property:** **Preserves** the exact history of both branches (non‑linear DAG).
* **Typical use:** Integrating a completed feature branch into `main` while keeping the original commit structure.

```
Before:
A---B---C (main)
     \
      D---E (feature)

After merge:
A---B---C------M (main)
     \        /
      D------E (feature)

M = merge commit with two parents
```

### Rebase

* **What it does:** **Rewrites history** by moving (“replaying”) commits from one branch so they appear as if they were based on another branch all along.
* **Key property:** Produces a **linear** history.
* **Typical use:** Updating a topic branch onto latest `main`, or cleaning up local commits before sharing.

```
Before:
A---B---C (main)
     \
      D---E (feature)

Rebase feature onto main:
A---B---C (main)
          \
           D'---E' (feature rebased)
```

---

## 2) Practical Summary

| Criterion         | Merge                                       | Rebase                                              |
| ----------------- | ------------------------------------------- | --------------------------------------------------- |
| History shape     | Non-linear, explicit merge commits          | Linear, rewritten commits                           |
| Traceability      | Shows where branches diverged and converged | Easier to read linear history                       |
| Safety            | Safe for shared branches (no rewrite)       | Safe primarily for local/unpushed branches          |
| Conflict handling | Once per merge                              | Possibly multiple times across each replayed commit |
| Preferred when    | Preserving context matters; shared history  | You want a tidy, linear history; local cleanups     |
| CI implications   | Merge commit can trigger full pipeline      | Rebased branch may retrigger checks per commit      |

---

## 3) Core Commands

### Merge a feature branch into main

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Merge feature (fast-forward if possible)
git merge --no-ff feature
# Optionally push
git push origin main
```

* `--no-ff` ensures a merge commit even if fast‑forward is possible, preserving the fact a feature branch existed.

### Rebase a feature branch onto main

```bash
git checkout feature
git fetch origin
git rebase origin/main
# Resolve conflicts as they arise, then:
git rebase --continue
# If needed:
git rebase --abort
```

### Interactive rebase (edit history locally)

```bash
# Rewrite the last 3 commits
git rebase -i HEAD~3
# Actions: pick, reword, edit, squash, fixup, drop
```

### Autosquash quality-of-life

```bash
# Mark fixup commits while you work
git commit --fixup <commit>
# Then reorder & squash automatically during rebase
git rebase -i --autosquash HEAD~10
```

---

## 4) Conflict Resolution During Rebase or Merge

1. Git stops at the first conflicting commit.
2. Open files, search for conflict markers `<<<<<<<`, `=======`, `>>>>>>>`.
3. Edit to the correct result.
4. Stage resolved files:

   ```bash
   git add path/to/file
   ```

5. Continue:

   * Merge: `git commit` (if not auto‑created), then proceed.
   * Rebase: `git rebase --continue`.

If you get stuck:

* Abort rebase: `git rebase --abort`
* Abort merge: `git merge --abort`

Tip: Use `git rerere` to record conflict resolutions and auto‑reapply them later.

```bash
git config --global rerere.enabled true
```

---

## 5) When to Prefer Merge vs. Rebase

### Prefer Merge

* The branch is already shared/pushed and others depend on it.
* You want an auditable record of integration points (e.g., regulated environments).
* Large cross‑team feature integration where the merge commit is meaningful context.

### Prefer Rebase

* You are working on a **local** branch and want to keep history linear and clean.
* You want to **squash** noisy WIP commits into a few meaningful ones before opening a PR.
* You need to put your work on top of the latest `main` to reduce future integration friction.

---

## 6) Team Policy Patterns

1. **Linear history policy:**

   * Devs rebase their feature branches onto `main` regularly.
   * Final integration uses **fast‑forward merges** or **squash merge** in the PR UI.

2. **Merge‑commit policy:**

   * All PRs are merged with **merge commits** (`--no-ff`).
   * No history rewriting on shared branches.
   * Useful for auditing and seeing exactly when integration occurred.

3. **Hybrid policy:**

   * Local tidy‑ups with rebase (interactive squashing, rewording).
   * PRs merged with merge commits for traceability—or with squash‑merge for cleanliness.

Be explicit in CONTRIBUTING.md: which merge strategy is allowed, whether rebasing before merge is required, and how to handle conflicts.

---

## 7) Interactive Rebase Deep Dive

Common actions in the editor (opened by `git rebase -i`):

* `pick` — keep commit as‑is.
* `reword` — change the commit message.
* `edit` — pause to amend the commit’s content.
* `squash` — combine this commit with the previous; concatenate messages.
* `fixup` — like `squash` but discard this commit’s message.
* `drop` — remove the commit entirely.

Workflow example:

```bash
git rebase -i HEAD~6
# change lines: convert several "pick" to "fixup" or "squash", maybe "reword"
# save & exit, resolve any conflicts, then:
git rebase --continue
```

Editing a commit’s content after choosing `edit`:

```bash
# Git pauses at the chosen commit
# Make file changes
git add -A
git commit --amend
git rebase --continue
```

---

## 8) Squash Merge vs. Rebase Squash

* **Squash merge (in PR UI)**:

  * Produces a single commit on `main` representing the entire PR.
  * Leaves the feature branch history untouched in the branch, but **not** on `main`.
* **Interactive rebase with squash**:

  * Rewrites the feature branch locally into a single or few commits.
  * Good before pushing or before opening a PR to present a clean story.

---

## 9) Fast‑Forward vs. No‑FF

* **Fast‑forward:** `main` moves forward to point at the feature branch tip if `main` hasn’t diverged.

  ```bash
  git merge --ff-only feature
  ```

* **No fast‑forward:** forces a merge commit even if FF is possible, preserving a branch boundary.

  ```bash
  git merge --no-ff feature
  ```

---

## 10) Common Pitfalls and How to Avoid Them

1. **Rebasing shared branches**

   * Avoid rebasing branches others have already pulled; it rewrites commits and disrupts collaborators.
   * If necessary, coordinate and communicate clearly.

2. **Losing commits during rebase**

   * Use `git reflog` to find lost tips and recover:

     ```bash
     git reflog
     git checkout <reflog-hash>
     git branch recovered-work
     ```

3. **Conflicts at every commit during rebase**

   * This can happen if your changes overlap heavily with `main`.
   * Consider a **merge** instead to resolve conflicts once.

4. **Messy commit messages**

   * Use interactive rebase to `reword`, `squash`, and `fixup`.
   * Adopt a message convention (Conventional Commits, etc.).

---

## 11) Recommended Workflows

### A) Clean feature workflow (linear history)

```bash
git checkout -b feature/awesome
# ... commits ...
git fetch origin
git rebase origin/main
git push -u origin feature/awesome
# Open PR with "Rebase and merge" or "Squash and merge"
```

### B) Preserve integration context (merge commits)

```bash
git checkout -b feature/awesome
# ... commits ...
git push -u origin feature/awesome
# Open PR; reviewers merge with a merge commit ("Create a merge commit")
```

### C) Local polish before PR

```bash
# While developing
git commit --fixup <SHA-to-clean>
# Before pushing
git rebase -i --autosquash origin/main
git push -u origin feature/awesome
```

---

## 12) Configuration Tips

* Enable autosquash:

  ```bash
  git config --global rebase.autosquash true
  ```

* Prefer rebase on pull (use with care; only on your local topic branches):

  ```bash
  git config --global pull.rebase true
  ```

* Enable rerere for smarter conflict repeats:

  ```bash
  git config --global rerere.enabled true
  ```

---

## 13) CI/CD and Code Review Considerations

* **Rebase before PR** can reduce merge conflicts and flaky CI on the PR branch.
* **Merge commits** can make bisecting integration regressions easier (you can test at merge points).
* **Squash merges** yield a clean `main`, but you lose the granular commit breakdown on `main` (still visible in the PR conversation).

---

## 14) Decision Checklist

* Is the branch **already shared**? → Prefer **merge** (avoid rewriting others’ history).
* Do you want a **clean, linear story**? → **Rebase** locally, then open your PR.
* Do you need **auditable integration points**? → Use **merge commits** (`--no-ff`).
* Are you facing **many overlapping changes** with `main`? → A **merge** may be simpler.

---

## 15) Example Session

```bash
# Update feature on top of latest main and tidy commits
git checkout feature/invoices
git fetch origin
git rebase -i --autosquash origin/main
# resolve, test, continue
git push --force-with-lease

# Open PR; team uses squash merge for final integration
```

Notes:

* Use `--force-with-lease` (not `--force`) to avoid clobbering teammates’ work.

---

## 16) Recovery Cookbook

* Oops, bad rebase:

  ```bash
  git reflog                 # find previous HEAD
  git reset --hard <hash>    # restore
  ```

* Abort in-progress:

  ```bash
  git rebase --abort
  git merge --abort
  ```

* Keep both sides during conflict resolution:

  * Manually edit conflict to combine content, or use:

    ```bash
    git checkout --theirs path/to/file   # choose incoming
    git checkout --ours  path/to/file    # choose current
    ```

---

## 17) Takeaways

* **Merge**: preserves history, creates an integration point, safest for shared branches.
* **Rebase**: rewrites history for clarity, ideal for local cleanup and linearization.
* Choose intentionally, document the policy, and automate consistency in your repository settings and CI.

---

## Appendix: Quick Reference

```bash
# Merge (no-ff)
git checkout main
git merge --no-ff feature
git push

# Rebase onto main
git checkout feature
git fetch origin
git rebase origin/main
git push --force-with-lease

# Interactive cleanup
git rebase -i HEAD~N
git commit --fixup <SHA>
git rebase -i --autosquash HEAD~N

# Recovery
git reflog
git reset --hard <hash>
git rebase --abort
git merge --abort
```
