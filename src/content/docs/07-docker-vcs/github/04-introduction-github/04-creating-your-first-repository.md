---
title: Creating your first Repository
---
# Creating Your First Repository

A **repository (repo)** is the home for your project’s files, history, and collaboration. It contains your code, a timeline of commits, branches for parallel work, and metadata like issues, pull requests, and releases.

This guide expands your outline into a clear, step‑by‑step playbook you can use in class or self‑study. It covers both creating a repo on GitHub and initializing one locally, then pushing to GitHub.

---

## Prerequisites

* **Git installed** on your machine

  * Windows: download from git-scm.com and accept defaults
  * macOS: `brew install git`
  * Linux (Debian/Ubuntu): `sudo apt install git`
* **Git configured** with your identity:

  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "you@example.com"
  ```
  
* **GitHub account** (free): sign up at github.com
* Optional but recommended:

  * An SSH key added to GitHub (for passwordless, secure pushes)
  * A project folder ready to version

---

## Option A — Create the Repository on GitHub

### 1) Start a New Repository

1. Sign in at GitHub and click **New** (usually next to your profile repo list) or go to **+** → **New repository**.
2. **Repository name:** short, hyphenated is fine (e.g., `my-first-repo`).
3. **Description:** a one‑sentence summary helps future collaborators.

### 2) Choose Visibility

* **Public:** visible to everyone (common for open source, portfolios, coursework).
* **Private:** only you and selected collaborators can see it.

### 3) Initialize Optional Files

* **README**: Adds a starting file where you explain the project’s purpose, setup, and usage.
* **.gitignore**: Tells Git which files to exclude (e.g., `node_modules/`, logs). Pick a template matching your tech stack.
* **License**: Choose one if you intend to share code (e.g., MIT for permissive use).

> Tip: If you plan to **push an existing local project**, you can **skip** auto‑creating files on GitHub and push from your machine. If you create files on GitHub first, you’ll need to pull/merge when you later push from local.

### 4) Create the Repository

Click **Create repository**. You’ll land on the new repo page.

### 5) Next Steps After Creation

You’ll see “Quick setup” instructions. Common paths:

* **A. Clone and start coding** (repo already has a README or files):

  ```bash
  git clone https://github.com/<username>/<my-first-repo>.git
  cd my-first-repo
  # create/edit files
  git add .
  git commit -m "Add initial content"
  git push
  ```

* **B. Push an existing local project to this empty GitHub repo** (see Option B below for full flow).

---

## Option B — Create From a Local Directory (then connect to GitHub)

### 1) Create and initialize the project locally

```bash
mkdir my-project
cd my-project
git init
```

**What this does**

* `git init` creates a hidden `.git` directory—Git now tracks changes here.

> Ensure your default branch is `main` (modern default). If your Git still uses `master`, rename it:
>
> ```bash
> git branch -M main
> ```

### 2) Add a remote pointing to GitHub

Create an empty repo on GitHub (Option A steps 1–4), **without** adding files. Then connect it:

```bash
git remote add origin https://github.com/username/my-project.git
# or with SSH (recommended after setting up an SSH key):
# git remote add origin git@github.com:username/my-project.git
```

Check it:

```bash
git remote -v
```

### 3) Add files, commit, and push

```bash
# add your project files or create a README
echo "# My Project" > README.md

git add .
git commit -m "Initial commit"
git push -u origin main
```

**What the flags mean**

* `-u` sets `origin/main` as the upstream for your local `main`, enabling simple `git push`/`git pull` later.

---

## Recommended Setup Files

### README (starter template)

Create a clear README to help others—and your future self.

```markdown
# Project Name

Short description (what, why).

## Features
- Bullet list of key features

## Getting Started
```bash
# prerequisites
# installation
# run the app
```

## Usage

Examples, commands, screenshots.

## Contributing

How to propose changes, branch naming, PR steps.

## License

MIT (or your choice)

### .gitignore (examples)

```gitignore
# Node
node_modules/
dist/
npm-debug.log*
yarn-error.log*

# Python
__pycache__/
*.pyc
.venv/

# General
.env
.DS_Store
*.log
````

Choose a template on GitHub when creating the repo, or place one locally before your first commit.

### LICENSE

If you’re sharing code, add a license file (e.g., **MIT**, **Apache‑2.0**, **GPL‑3.0**). No license = all rights reserved by default.

---

## HTTPS vs SSH for `origin`

* **HTTPS**: Works anywhere; you’ll authenticate with GitHub tokens when pushing.
* **SSH**: One‑time setup of an SSH key → fast, secure pushes without re‑entering credentials.

  * Generate key: `ssh-keygen -t ed25519 -C "you@example.com"`
  * Copy public key (e.g., `~/.ssh/id_ed25519.pub`) to **GitHub → Settings → SSH and GPG keys**.

---

## Verifying Everything Works

* Check branch:

  ```bash
  git branch
  ```

* Confirm remote:

  ```bash
  git remote -v
  ```

* Make a small change and push:

  ```bash
  echo "Hello repo" >> hello.txt
  git add hello.txt
  git commit -m "Add hello.txt"
  git push
  ```

You should see the new file on GitHub within your repo.

---

## Collaborators and Access

* **Private repo:** Add collaborators via **Settings → Collaborators**.
* **Public repo:** Anyone can fork; you can still restrict who can push.
* Consider enabling **branch protection rules** on `main`:

  * Require pull requests
  * Require status checks (CI)
  * Dismiss stale approvals on new commits

---

## Commit Message Conventions (Good Practice)

* Use **imperative mood**: “Add login page” (not “Added” or “Adds”).
* Keep subject ≤ 50 chars; wrap body at \~72 chars.
* Optionally adopt **Conventional Commits**:

  * `feat: add playlist search`
  * `fix: handle null pointer in auth`
  * `docs: update README`
  * `chore: bump dependencies`

---

## Common Pitfalls and How to Fix Them

1. **`src refspec main does not match any`**
   Cause: No `main` branch yet or nothing committed.
   Fix:

   ```bash
   git branch -M main
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **`fatal: remote origin already exists`**
   Fix:

   ```bash
   git remote set-url origin https://github.com/username/my-project.git
   # or:
   git remote remove origin
   git remote add origin <url>
   ```

3. **Authentication failed (HTTPS)**

   * Use a **personal access token** instead of password.
   * Or switch to **SSH** after adding your public key to GitHub.

4. **Push rejected (non‑fast‑forward)**
   Cause: Remote has new commits you don’t have.
   Fix:

   ```bash
   git pull --rebase origin main
   # resolve any conflicts
   git push
   ```

5. **Default branch is `master` but you want `main`**

   ```bash
   git branch -M main
   git push -u origin main
   # On GitHub, change default branch in Settings if needed
   ```

---

## Optional Enhancements

* **Add a CI workflow** (GitHub Actions) to run tests on each push.
* **Create issues and milestones** to plan work.
* **Enable Discussions or a Wiki** for documentation.
* **Use Releases** to tag stable versions (e.g., `v1.0.0`).

---

## Quick Reference

### Create on GitHub, then clone

```bash
git clone https://github.com/username/my-first-repo.git
cd my-first-repo
# work, commit, push
```

### Create locally, then push to GitHub

```bash
mkdir my-project && cd my-project
git init
git branch -M main
echo "# My Project" > README.md
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/my-project.git
git push -u origin main
```

---

## Next Steps

* Practice by creating a small repo (e.g., a “Hello World” app).
* Open a pull request from a feature branch and merge it.
* Add a `.gitignore`, a license, and a helpful README.

You’ve now got all the building blocks to create your first repository—both on GitHub and from your local machine—cleanly and confidently.
