---
title: Working with Branches
---
# Working with Branches

> Branches let you develop features, fix bugs, and experiment **without touching `main`**. Your commits stay isolated on the branch until you intentionally integrate them (merge or rebase).

---

## 1) Quick Start (from your prompt)

Once you’re on a branch (e.g., `feature-login`):

```bash
# Make and stage changes
git add .
git commit -m "Add login form"

# Push your branch to the remote
git push origin feature-login
```

These commits **do not** affect `main` until you merge them.

---

## 2) Core Concepts

* **Current branch**: The branch your HEAD points to; commits go here.
* **Isolation**: Work in parallel lines of development; no impact on `main` until integration.
* **Integration**: Bring branch work back to `main` with a **merge** (keeps history) or **rebase** (rewrites history into a linear sequence).

---

## 3) Essential Commands You’ll Use Daily

### Create / Switch

```bash
# Create and switch (modern)
git switch -c feature-login

# Switch to existing
git switch feature-login

# Legacy equivalent
git checkout -b feature-login
git checkout feature-login
```

### Inspect

```bash
git status            # What changed?
git branch            # List local branches; * marks current
git branch -vv        # Show upstream tracking info
git log --oneline --graph --decorate --all  # Visualize history
```

### Commit

```bash
git add .
git commit -m "Describe what and why, not just what"
```

### Push (first time vs. subsequent)

```bash
# First push: set upstream (-u) so future pushes can be just `git push`
git push -u origin feature-login

# After upstream is set
git push
```

---

## 4) Typical Feature Workflow (Recommended)

1. **Start from fresh `main`**

   ```bash
   git switch main
   git pull --ff-only
   ```

2. **Branch off**

   ```bash
   git switch -c feature/login-form
   ```

3. **Develop & commit**

   ```bash
   git add .
   git commit -m "Add login form UI with basic validation"
   ```

4. **Publish branch**

   ```bash
   git push -u origin feature/login-form
   ```

5. **Open a Pull Request (PR)** on your remote platform (GitHub/GitLab).
6. **Keep your branch up to date** (see §6) while the PR is open.
7. **Merge** via PR (squash/rebase/merge—see §7).
8. **Clean up** local/remote branches (see §9).

---

## 5) Working Locally on a Branch

* Commit often with **small, focused** commits.
* Use **descriptive messages**:

  ```bash
  feat(auth): add login form with email+password
  fix(auth): handle empty password edge case
  refactor(ui): extract <FormRow/> component
  ```

* Run tests/linters before pushing (CI will run again on the PR).

---

## 6) Syncing Your Branch with `main`

Keeping your branch current reduces conflict pain.

### Option A: Merge `main` into your branch (safe, non-destructive)

```bash
git switch feature/login-form
git fetch origin
git merge origin/main
# Resolve conflicts if any, then commit the merge.
```

### Option B: Rebase your branch onto `main` (linear history)

```bash
git switch feature/login-form
git fetch origin
git rebase origin/main
# Resolve conflicts, then:
git rebase --continue

# If you already pushed this branch:
git push --force-with-lease
```

**Rule of thumb:** Only rebase your **own** branches. Avoid rebasing shared branches unless everyone agrees.

---

## 7) Bringing Work Back to `main`

### Merge Strategies (via PR UI or CLI)

* **Merge commit** (default): preserves full history and branch structure.
* **Squash merge**: condenses all branch commits into one clean commit on `main`. Great for tidy history.
* **Rebase and merge**: replays commits onto `main` for a linear history without a merge commit.

**Tips:**

* Use **squash** for noisy WIP branches.
* Use **merge commit** when the branch contains meaningful grouped commits or when you want to preserve the branching context.

### CLI example (fast-forward)

```bash
git switch main
git pull --ff-only
git merge --ff-only feature/login-form
git push
```

If fast-forward isn’t possible:

```bash
git merge --no-ff feature/login-form
git push
```

---

## 8) Tracking Branches & Upstreams

A **tracking branch** knows its remote counterpart (upstream), enabling simple `git pull` and `git push`.

```bash
# Set upstream on first push
git push -u origin feature-login

# Verify upstream
git branch -vv
```

Configure Git to automatically create an upstream on first push:

```bash
git config --global push.autoSetupRemote true
```

---

## 9) Renaming & Deleting Branches

### Rename (local and remote)

```bash
# Rename local
git branch -m feature-login feature-auth-login

# Update remote: push new name and delete old remote branch
git push -u origin feature-auth-login
git push origin --delete feature-login
```

### Delete

```bash
# Local: safe delete (won’t delete if unmerged)
git branch -d feature-auth-login

# Local: force delete (be careful)
git branch -D feature-auth-login

# Remote: delete
git push origin --delete feature-auth-login
```

---

## 10) Handling Conflicts (Quick Guide)

Conflicts happen when the same lines changed differently on two branches.

```bash
# During merge or rebase, Git marks conflicts in files:
<<<<<<< HEAD
current branch changes
=======
incoming changes
>>>>>>> other-branch
```

**Resolve** by editing the file to the intended final content, then:

```bash
git add <resolved-file>
# For merge:
git commit
# For rebase:
git rebase --continue
```

Helpful tools:

```bash
git mergetool
git diff --merge
```

---

## 11) Cherry-Picking & Hotfixes

Apply a specific commit from another branch:

```bash
# Copy a single commit onto the current branch
git cherry-pick <commit-sha>
```

Use for hotfixes or when you need **just one** change without merging the whole branch.

---

## 12) Branch Naming Conventions (Keep It Predictable)

* Prefix by type: `feature/`, `bugfix/`, `hotfix/`, `chore/`, `docs/`.
* Keep short, kebab-case or slash-separated:

  * `feature/login-form`
  * `bugfix/auth-null-check`

If you use issue trackers, include IDs:

* `feature/123-user-login-form`

---

## 13) Collaboration Best Practices

* **Small PRs**: Easier to review and merge.
* **Draft PR early**: Get feedback while you work.
* **CI green**: Keep tests passing before asking for review.
* **Review etiquette**: Explain *why* in commit messages and PR descriptions.

---

## 14) Safety Nets & Policies

* Protect `main`:

  * Require PR reviews and green CI before merge.
  * Disallow force-push to `main`.
* Require branch to be **up to date** with `main` before merge.
* Use **CODEOWNERS** to route reviews to the right people.

---

## 15) Troubleshooting

* **“fatal: The current branch has no upstream branch”**

  ```bash
  git push -u origin my-branch
  ```
* **Accidentally committed to `main`**

  ```bash
  # Create a branch at current HEAD with those commits
  git switch -c feature/extract-commits
  # Reset main to the last good commit (if safe to do so)
  git switch main
  git reset --hard origin/main
  ```

* **Need to undo the last commit but keep changes staged**

  ```bash
  git reset --soft HEAD~1
  ```

* **Clean working tree if you want to discard local changes**

  ```bash
  git restore --source=HEAD --staged --worktree .
  # or older:
  git checkout -- .
  ```

---

## 16) Example End-to-End Session

```bash
# 1) Start clean
git switch main
git pull --ff-only

# 2) Branch off
git switch -c feature/login-form

# 3) Work & commit
git add .
git commit -m "feat(auth): add login form (email + password)"

# 4) Publish
git push -u origin feature/login-form

# 5) Keep updated with main (merge-based)
git fetch origin
git merge origin/main

# 6) Open PR, get review, CI passes

# 7) Merge PR on the platform (squash or merge)

# 8) Cleanup
git switch main
git pull --ff-only
git branch -d feature/login-form
git push origin --delete feature/login-form
```

---

## 17) Key Takeaways

* Do all your work on a **topic branch**; keep `main` stable.
* **Push with `-u`** on first publish to set upstream.
* Regularly **sync with `main`** (merge or rebase).
* **Integrate via PR**, then **clean up** branches.
* Favor **small, well-described commits** and **small PRs**.

With this flow, your team gets safer collaboration, clearer history, and fewer merge headaches.
