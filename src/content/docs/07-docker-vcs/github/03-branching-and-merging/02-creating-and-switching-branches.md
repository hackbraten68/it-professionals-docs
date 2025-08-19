---
title: Creating and Switching Branches
---
# Creating and Switching Branches

> A practical, classroom‑ready guide to creating, viewing, and moving between branches in Git—clear, comprehensive, and example‑driven.

---

## 1) What a Branch Is (and Why It Matters)

* **Branch**: a movable pointer to a commit; each branch is an independent line of development.
* **HEAD**: your current “position”—it usually points to the latest commit on the **current branch**.
* **Working tree / Index**: your local files and the staging area; these move with you when you switch branches.

**Why branches?** Isolate features, prototype safely, collaborate without stepping on each other’s toes, and keep `main` stable.

---

## 2) Prerequisites

* Git installed and configured (`git --version`, `git config --global user.name`, `git config --global user.email`).
* A repository initialized (`git init`) or cloned (`git clone ...`).

---

## 3) Creating Branches

### 3.1 Create from the current commit

```bash
git branch feature-login
```

This creates `feature-login` pointing to the same commit as your current branch—but **does not** switch to it.

### 3.2 Create from a different start point

```bash
# From a specific commit (use a short or full SHA)
git branch feature-login a1b2c3d

# From another local branch
git branch feature-login main
```

### 3.3 Create a branch that tracks a remote branch

Useful when the remote already has a branch and you want to base your work on it:

```bash
git fetch
git branch --track feature-login origin/feature-login
```

> `--track` sets the upstream so push/pull know which remote branch to use.

---

## 4) Switching Branches

You can switch with either the **modern** `git switch` (recommended) or the **legacy** `git checkout`.

### 4.1 Switch to an existing branch

```bash
# Recommended
git switch feature-login

# Legacy equivalent
git checkout feature-login
```

### 4.2 Create **and** switch in one step

```bash
# Recommended (modern)
git switch -c feature-login

# Legacy
git checkout -b feature-login
```

### 4.3 Switch to a remote branch and start tracking

```bash
git fetch
git switch -c feature-login origin/feature-login
# or:
git switch --track origin/feature-login
```

> **Heads‑up:** If you have uncommitted changes that conflict with the target branch, Git will block the switch. Commit or stash first (see Troubleshooting).

---

## 5) Listing and Inspecting Branches

### 5.1 Local branches

```bash
git branch
```

* The current branch is highlighted (often with a preceding `*` in legacy output or colored in modern Git).

### 5.2 Local + remote branches

```bash
git branch -a
```

### 5.3 Show each branch’s upstream and last commit

```bash
git branch -vv
```

### 5.4 See which branches are merged (or not) into the current branch

```bash
git branch --merged
git branch --no-merged
```

---

## 6) Deleting, Renaming, and Managing Branches

### 6.1 Rename a branch

```bash
# Rename current branch
git branch -m new-name

# Rename another branch
git branch -m old-name new-name
```

### 6.2 Delete a fully merged branch (safe)

```bash
git branch -d feature-login
```

### 6.3 Force delete (even if not merged—dangerous)

```bash
git branch -D feature-login
```

### 6.4 Remove a remote branch

```bash
git push origin --delete feature-login
# or:
git push origin :feature-login
```

---

## 7) Upstreams, Tracking, and First Push

### 7.1 Set the upstream when you first push

```bash
git push -u origin feature-login
```

* `-u` remembers `origin/feature-login` as the upstream. Later you can simply `git push` and `git pull`.

### 7.2 Change the upstream (after the fact)

```bash
git branch -u origin/feature-login
```

---

## 8) Detached HEAD: What It Is and How to Recover

* **Detached HEAD** occurs when `HEAD` points directly to a commit instead of to a branch (e.g., `git checkout a1b2c3d`).
* You can explore or build without affecting a branch, but your new commits won’t be on a named branch.

**Recover by creating a branch at your current commit:**

```bash
git switch -c hotfix-temp
```

Now your work is safely on `hotfix-temp`.

---

## 9) Typical Workflows

### 9.1 Feature Branch Flow

1. Update `main`:

   ```bash
   git switch main
   git pull
   ```
2. Create & switch:

   ```bash
   git switch -c feature-login
   ```
3. Develop, commit, and push:

   ```bash
   git add .
   git commit -m "Add login form skeleton"
   git push -u origin feature-login
   ```
4. Open a Pull Request (on your platform), review, and merge.

### 9.2 Hotfix Flow (from a released branch)

```bash
git switch main
git pull
git switch -c hotfix-logout-bug
# fix, commit, test
git push -u origin hotfix-logout-bug
# open PR, fast-track review, merge, delete branch
```

### 9.3 Keeping Your Feature Branch Up to Date

```bash
git switch feature-login
git fetch origin
git merge origin/main      # OR: git rebase origin/main (see note below)
```

> **Merge vs Rebase:**
>
> * **Merge** keeps history intact but can create merge commits.
> * **Rebase** creates a linear history but rewrites commits—avoid rebasing shared/public branches.

---

## 10) Naming Conventions (Team‑Friendly)

* Use consistent, hyphenated names:
  `feature/login-form`, `bugfix/logout-crash`, `chore/deps-bump`, `docs/contributing`.
* Prefix by type: `feature/`, `bugfix/`, `hotfix/`, `release/`, `docs/`, `chore/`.
* Keep them short and descriptive.

---

## 11) Safety, Best Practices, and Policies

* **Small, focused branches** reduce merge conflicts and ease reviews.
* **Sync often** with `main` to minimize divergence.
* **Protect `main`** with branch protection rules and PR reviews.
* **Delete stale branches** after merging to keep the repo tidy.
* **Never force‑push shared branches** unless your team has a clear protocol.

---

## 12) Troubleshooting & Common Errors

### 12.1 “Your local changes would be overwritten by checkout/switch”

**Cause:** You have uncommitted changes that conflict with the target branch.
**Fix (choose one):**

```bash
# Commit the work
git add .
git commit -m "WIP: partial changes"

# OR stash it (temporary shelf)
git stash
git switch target-branch
git stash pop   # re-apply the stashed changes (may need to resolve conflicts)
```

### 12.2 “pathspec did not match any file(s) known to git”

**Cause:** The branch or path doesn’t exist.
**Fix:** Check the branch name, run `git fetch --all`, and list with `git branch -a`.

### 12.3 Accidentally created commits on the wrong branch

* Create a new branch at the current commit, then reset the original:

```bash
git switch -c correct-branch
git switch wrong-branch
git reset --hard origin/wrong-branch   # WARNING: discards local commits on wrong-branch
```

*(If those commits are only local, you can also use `git cherry-pick` onto the correct branch instead.)*

---

## 13) Quick Reference (Cheat Sheet)

```bash
# Create
git branch <name>
git switch -c <name>          # create + switch (modern)
git checkout -b <name>        # create + switch (legacy)

# Switch
git switch <name>
git checkout <name>

# Track remote
git fetch
git switch --track origin/<name>

# List
git branch                    # local
git branch -a                 # local + remote
git branch -vv                # with upstream and last commit

# Rename / Delete
git branch -m <new>
git branch -m <old> <new>
git branch -d <name>          # safe delete (merged)
git branch -D <name>          # force delete

# Upstream & push
git push -u origin <name>
git branch -u origin/<name>

# Merged status
git branch --merged
git branch --no-merged
```

---

## 14) Practice Exercise (for Learners)

1. Update local `main`, then create and switch to `feature/login-ui`.
2. Make a small change (e.g., add a placeholder component), commit twice.
3. Push with upstream, open a PR (don’t merge yet).
4. Simulate divergence: on `main`, change a shared file and commit.
5. On `feature/login-ui`, bring in `main` (merge **or** rebase) and resolve a trivial conflict.
6. Finish: merge the PR and delete the remote and local branch.

---

**Key Takeaway:** Use `git switch` (modern) for day‑to‑day branch moves, keep branches short‑lived and focused, set upstreams on first push, and clean up merged branches to keep your repository healthy.
