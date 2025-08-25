---
title: Merging Branches
---
# Merging Branches

Merging combines the histories of two branches so that the changes from one branch become part of another. In everyday work, you’ll most often merge a **feature branch** into your **main** (or **develop**) branch after the feature is complete.

---

## Quick Start

```bash
# 1) Switch to the branch you want to receive changes
git checkout main

# 2) Merge the feature branch into it
git merge feature-login
```

If Git can combine the changes automatically, you’ll either get a **fast‑forward** (no merge commit) or a **merge commit** (three‑way merge). If there are conflicts, Git will pause and ask you to resolve them.

---

## Core Concepts

### The Merge Base

When merging, Git finds a **merge base**—the most recent common ancestor of the two branch tips—and compares changes introduced since that point. This is why the quality of your history (small, focused commits; frequent rebasing of feature branches) affects the ease of merges.

### Merge Types

* **Fast‑forward merge**
  Occurs when the target branch hasn’t moved since the feature branch diverged. Git simply moves the branch pointer forward—no merge commit is created.

  ```bash
  git checkout main
  git merge --ff-only feature-login
  # Ensures only fast-forward is allowed; fails otherwise
  ```

* **Three‑way merge (merge commit)**
  Happens when both branches have diverged. Git compares **(main, feature, merge base)** and creates a new **merge commit** with two parents.

  ```bash
  git checkout main
  git merge feature-login
  # Creates a merge commit if necessary
  ```

---

## Common Merge Options

* `--ff`, `--ff-only`, `--no-ff`

  * `--ff-only`: allow merge only if fast‑forward is possible (safe for linear history).
  * `--no-ff`: always create a merge commit (useful to preserve feature context in history).

* `--squash`
  Combines all commits from the source branch into a single staged change on the target branch **without** creating a merge commit or recording branch topology.

  ```bash
  git checkout main
  git merge --squash feature-login
  git commit -m "feat(login): add login flow (squashed)"
  ```

* `--no-commit`
  Perform the merge but stop before creating the merge commit, letting you review/edit the staged result.

  ```bash
  git merge --no-commit feature-login
  # Inspect, adjust, then:
  git commit
  ```

* `-m "message"`
  Provide a custom merge commit message.

* Strategy options:

  * `-s ours` (rare; keep the current branch’s content, record merge)
  * `-X ours` / `-X theirs` (tie‑breaker for content-level conflicts with the default strategy)

---

## Conflict Resolution Workflow

When changes overlap, Git flags **conflicts** and halts the merge.

1. **Run the merge**

   ```bash
   git checkout main
   git merge feature-login
   # CONFLICT (content): Merge conflict in src/auth/login.ts
   ```

2. **Inspect conflicts**
   Open the files and look for conflict markers:

   ```text
   <<<<<<< HEAD
   current branch version
   =======
   incoming branch version
   >>>>>>> feature-login
   ```

3. **Resolve conflicts**
   Edit the file so it contains the correct, combined result. Remove the conflict markers.

4. **Mark as resolved**

   ```bash
   git add src/auth/login.ts
   ```

5. **Continue or abort**

   ```bash
   git commit                # completes the merge with a merge commit
   # or
   git merge --continue      # if prompted
   # or to undo the merge attempt entirely:
   git merge --abort
   ```

### Helpful Tools & Tips

* **Diff & status**

  ```bash
  git status
  git diff
  git diff --staged
  ```
  
* **Mergetool**

  ```bash
  git mergetool
  ```

* **Verify result**

  ```bash
  git log --graph --oneline --decorate
  git show
  ```

---

## Choosing a Merge Strategy

### When to prefer fast‑forward

* The feature branch is trivial or very short‑lived.
* You enforce linear history (`--ff-only`), keeping `main` tidy.

### When to prefer merge commits (`--no-ff`)

* You want to preserve the **feature branch context** (useful in larger teams).
* The feature has multiple commits that tell a story and you want that topology visible.

### When to prefer squash merges

* You want a **clean, single commit** on `main` but keep the feature branch history only on the side (not recorded in ancestry).
* Good for large “work-in-progress” histories that would be noisy on `main`.

> **Note:** Squash merges lose branch topology. You cannot later see which individual feature commits created that one change on `main`.

---

## Rebase vs Merge (Short Comparison)

* **Merge** preserves branch topology; history shows when lines of work converged.
* **Rebase** rewrites commit bases to create a linear sequence of commits; makes history cleaner but changes commit IDs.

**Typical pattern:**
Regularly `git fetch` and `git rebase origin/main` on your feature branch to reduce conflicts, then merge into `main` when done.

```bash
git checkout feature-login
git fetch origin
git rebase origin/main
# Resolve any conflicts during rebase, then:
git checkout main
git merge --ff-only feature-login
```

---

## Advanced Topics

### Handling Unrelated Histories

If two repositories/branches share no common history:

```bash
git merge other-branch --allow-unrelated-histories
```

Use with care—review file overlaps thoroughly.

### Binary Files & Custom Merge Drivers

Conflicts in binaries can’t be auto‑merged. Consider:

* Locking workflow (only one person edits the binary at a time).
* `.gitattributes` with custom **merge drivers**:

  ```bash
  *.lockbin merge=binary
  ```

  Then define `binary` driver in your Git config or attributes.

### Rerere: Reuse Recorded Resolutions

Git can remember how you resolved a conflict and apply it next time:

```bash
git config --global rerere.enabled true
```

### Partial Merges with Paths

Merge only specific paths from a branch:

```bash
git checkout main
git checkout feature-login -- src/auth/ src/ui/LoginForm.tsx
git commit -m "chore: merge auth UI pieces from feature-login"
```

> This is **not** a true merge (no ancestry recorded), but a pragmatic way to cherry‑pick content.

### Octopus Merges (multiple branches)

Useful for unrelated, conflict‑free topic branches:

```bash
git checkout main
git merge feature-a feature-b feature-c
```

---

## Team Practices & Governance

* **Protect main**: Require PRs, status checks, code review, and up‑to‑date branches before merging.
* **Define policy**: Decide when to use `--no-ff`, squash merges, or rebase‑and‑merge in your hosting platform (GitHub/GitLab/Bitbucket).
* **Consistent messages**: Use conventional commits or a team standard for merge commit messages.
* **CI first**: Ensure the feature branch is green in CI before merging.
* **Small, focused branches**: Smaller diffs → fewer conflicts → faster reviews.

---

## Troubleshooting

* **“Automatic merge failed; fix conflicts and then commit the result.”**
  Resolve conflicts, `git add` the fixed files, then `git commit` or `git merge --continue`.

* **“Not possible to fast-forward, aborting.” (with `--ff-only`)**
  Rebase your feature branch onto the latest `main` or run a regular merge (without `--ff-only`).

  ```bash
  git checkout feature-login
  git fetch origin
  git rebase origin/main
  git checkout main
  git merge --ff-only feature-login
  ```

* **Accidentally merged the wrong branch**
  If unpushed: `git reset --hard <commit-before-merge>`
  If pushed: consider a **revert** of the merge commit (use `-m 1` to select the mainline parent):

  ```bash
  git revert -m 1 <merge-commit-sha>
  ```

* **Merge commit message too generic**
  Amend right away (unpushed):

  ```bash
  git commit --amend
  ```

---

## Practical Examples

### Preserve Feature Topology (always create a merge commit)

```bash
git checkout main
git merge --no-ff feature-login -m "merge: integrate feature-login"
```

### Enforce Linear History (only accept fast-forward)

```bash
git checkout main
git merge --ff-only feature-login
```

### Squash for a Clean Single Commit

```bash
git checkout main
git merge --squash feature-login
git commit -m "feat(login): add form, validation, API hook"
```

---

## Verification & History Views

* Compact visualization:

  ```bash
  git log --graph --oneline --decorate --all
  ```

* Inspect the merge commit:

  ```bash
  git show <merge-commit-sha>
  ```

---

## Mini Checklist (Before Merging)

* [ ] Feature branch rebased or merged with latest `main`.
* [ ] Tests pass locally and in CI.
* [ ] Conflicts resolved and code reviewed.
* [ ] Commit messages are clear (or plan to squash).
* [ ] Appropriate merge method selected (`--ff-only`, `--no-ff`, or `--squash`).

---

## Practice Exercise

1. Create a repo with `main` and `feature-a`; make conflicting edits to the same line.
2. Attempt `git merge feature-a` on `main`.
3. Resolve conflicts in your editor, `git add` the files, then `git commit`.
4. Visualize the history with `git log --graph --oneline --decorate --all`.
5. Repeat with `--no-ff` and then with `--squash` to see the differences.

---

### Summary

* **Fast‑forward** merges move the pointer—no merge commit.
* **Three‑way** merges create a merge commit to record convergence.
* Choose between **ff-only**, **no-ff**, and **squash** based on your team’s history preferences.
* Keep branches small and current, resolve conflicts carefully, and verify the final history.
