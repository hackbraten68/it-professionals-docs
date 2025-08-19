---
title: Basic Git Workflow
---
# Basic Git Workflow

A practical, example‑driven guide to the core Git commands you’ll use every day. Each step explains what the command does, why you need it, how it works under the hood, and common pitfalls. Copy‑pasteable snippets included.

---

## Overview

1. Initialize a repository: `git init`
2. Stage changes: `git add`
3. Commit to history: `git commit`
4. Push to a remote: `git push`
5. Pull from a remote: `git pull`

> Supporting commands you’ll likely use along the way: `git status`, `git log`, `git diff`, `git branch`, `git remote`, `.gitignore`.

---

## 0) Prerequisites (one‑time setup)

```bash
# Identify yourself in commit metadata (global settings)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Optional: default branch name
git config --global init.defaultBranch main

# Optional: show concise status and helpful hints
git config --global advice.statusHints true
```

If you’ll use a hosting provider (GitHub/GitLab/Bitbucket), decide on HTTPS vs SSH:

```bash
# HTTPS (simpler to start; uses tokens)
git remote add origin https://github.com/youruser/your-repo.git

# SSH (no password prompts once keys are set up)
git remote add origin git@github.com:youruser/your-repo.git
```

---

## 1) `git init` — Initialize a new repository

**What it does:** Creates a new `.git/` directory that stores your project’s history (objects, refs, configuration).

```bash
# Start a repo in the current directory
git init

# Or create a directory and initialize
mkdir my-app && cd my-app && git init
```

**Typical follow‑ups:**

* Create a `.gitignore` to exclude generated files:

  ```bash
  printf "node_modules/\n.DS_Store\ndist/\n.env\n" > .gitignore
  ```

* Check repository state:

  ```bash
  git status
  ```

**Common pitfalls:**

* Initializing inside nested Git repos by accident. Use `git rev-parse --show-toplevel` to confirm the repo root.
* Committing secrets because `.gitignore` was added too late (see “Fixing mistakes” below).

---

## 2) `git add` — Stage files for commit

**What it does:** Moves changes from your working directory to the **staging area** (a.k.a. index). Only staged changes are included in the next commit.

```bash
# Stage everything new/modified (respecting .gitignore)
git add .

# Stage specific paths
git add src/app.js README.md

# Stage interactively (review hunks)
git add -p
```

**Good to know:**

* `git add` is safe and repeatable; you can stage more, unstage, or amend before committing.
* Use `git restore --staged <path>` to unstage.

**Check your work:**

```bash
git status         # what is staged vs unstaged
git diff           # unstaged changes
git diff --staged  # what will be committed
```

---

## 3) `git commit` — Save changes to the local repository

**What it does:** Records a snapshot of the staging area as a new commit object, with author, timestamp, message, and parent commit(s).

```bash
# Create a commit with a message
git commit -m "feat: add user login flow"

# For detailed messages (subject line + body):
git commit
# (Editor opens; first line is ~50 chars, body wraps at ~72)
```

**Conventional message style (recommended for teams):**

```bash
<type>(optional-scope): short summary
(blank line)
Longer explanation, rationale, references.
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

**Amending (fix last commit):**

```bash
# Amend message or include newly staged changes
git commit --amend
```

**View history:**

```bash
git log --oneline --graph --decorate --all
```

---

## 4) `git push` — Upload changes to a remote repository

**What it does:** Sends your local commits to a remote (e.g., `origin`) so others (and CI/CD) can access them.

```bash
# First time pushing a new local branch 'main'
git push -u origin main

# Later pushes on the same branch
git push
```

**Flags explained:**

* `-u` (or `--set-upstream`) remembers the remote/branch pair. After that, plain `git push`/`git pull` works.

**Common pitfalls:**

* “non-fast-forward” errors appear when the remote has commits you don’t. Pull (or `git pull --rebase`) first, resolve conflicts, then push again.

---

## 5) `git pull` — Download changes from a remote repository

**What it does:** Fetches new commits from the tracked remote branch and then **merges** (default) or **rebases** them into your current branch.

```bash
# Default: fetch + merge
git pull

# Prefer linear history: fetch + rebase
git pull --rebase
```

**Recommended default (optional):**

```bash
git config --global pull.rebase true   # use rebase on pull
```

**When conflicts happen:**

1. Git marks conflict regions in files.
2. Fix the files manually.
3. Stage the resolutions: `git add <file>`
4. Continue:

   * If merging: `git commit` (Git may auto‑create the merge commit)
   * If rebasing: `git rebase --continue`

---

## A Typical Day‑to‑Day Loop

```bash
# 1) Sync your local branch first
git switch main
git pull --rebase

# 2) Create a feature branch
git switch -c feature/auth-login

# 3) Edit files, then stage + commit
git add .
git commit -m "feat(auth): basic login form and validation"

# 4) Push your branch and open a PR/MR
git push -u origin feature/auth-login

# 5) After review and merge on the remote, update your local main
git switch main
git pull --rebase
```

---

## Branching (lightweight but essential)

```bash
# List branches
git branch

# Create/switch
git switch -c feature/payment
git switch main

# Delete local branch (merged)
git branch -d feature/payment
# Force delete (unmerged; use with care)
git branch -D feature/payment
```

**Why branch?** Isolate work, enable parallel development, and keep `main` stable.

---

## Working With Remotes

```bash
# Show remotes
git remote -v

# Add a remote
git remote add origin https://github.com/youruser/your-repo.git

# Change the remote URL (e.g., switch HTTPS↔SSH)
git remote set-url origin git@github.com:youruser/your-repo.git

# Fetch all branches and tags
git fetch --all --prune
```

---

## Inspecting, Comparing, and Undoing

```bash
# Show changes since last commit
git diff

# Show what’s staged
git diff --staged

# See file history
git log -- <path>

# Restore a file to last commit (discard local changes)
git restore <path>

# Unstage a file
git restore --staged <path>

# Revert a bad commit (creates a new commit that undoes it)
git revert <commit_sha>

# Move branch pointer (advanced; rewrites history)
git reset --hard <commit_sha>   # DANGEROUS: loses local changes
```

---

## .gitignore Essentials

Create a `.gitignore` early to avoid committing generated or secret files.

Examples:

```
# OS
.DS_Store
Thumbs.db

# Dependencies / builds
node_modules/
dist/
build/

# Environment
.env
.env.local

# Logs
*.log
```

**Already committed a secret?**

1. Rotate the credential immediately.
2. Purge it from history (e.g., `git filter-repo` or the hosting provider’s secret scanning/removal tools).

---

## Common Workflows with Hosting Platforms

**Create a remote repo first, then connect:**

```bash
echo "# my-app" > README.md
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/youruser/my-app.git
git push -u origin main
```

**Forking + Pull Requests (collaboration):**

* Fork repository → create feature branch → push to your fork → open PR to upstream.
* Keep your fork updated: `git remote add upstream <original-url>` then `git fetch upstream` and `git rebase upstream/main`.

---

## Troubleshooting & Pitfalls

* **“Nothing to commit, working tree clean”** but changes aren’t visible:
  Ensure you’re on the expected branch (`git status`) and that files aren’t ignored by `.gitignore`.
* **Non‑fast‑forward push rejected:**
  `git pull --rebase`, resolve conflicts, then `git push`.
* **Accidentally committed a large file:**
  Remove it and consider `git filter-repo` to clean history if already pushed.
* **Line endings (Windows/macOS/Linux):**
  Configure once:

  ```bash
  git config --global core.autocrlf input   # macOS/Linux
  git config --global core.autocrlf true    # Windows
  ```

---

## Minimal Cheat Sheet

```bash
# Initialize + first commit
git init
git add .
git commit -m "chore: initial commit"

# Connect remote + push
git branch -M main
git remote add origin <URL>
git push -u origin main

# Daily loop
git pull --rebase
# ...edit...
git add -p
git commit -m "feat: ..."
git push
```

---

## Key Concepts (Quick Glossary)

* **Working directory:** Your files on disk.
* **Staging area (index):** The “next commit” content.
* **Commit:** An immutable snapshot with metadata.
* **Branch:** A movable pointer to a series of commits.
* **Remote:** A named reference to another copy of the repo (e.g., `origin`).
* **Fast‑forward:** Advancing a branch pointer without a merge commit.
* **Rebase vs Merge:** Rebase rewrites your commits on top of another base for linear history; merge preserves both histories with a merge commit.

---

## Next Steps

* Learn `git stash` for quick context switches.
* Explore `git tag` and releases.
* Adopt a branching strategy (e.g., GitHub Flow, Git Flow) suitable for your team.
* Automate checks with CI so every `git push` triggers tests and quality gates.

---

> With these fundamentals, you can initialize projects, record clean histories, and collaborate safely. Practice on a throwaway repo to build muscle memory, then apply the workflow on real projects.
