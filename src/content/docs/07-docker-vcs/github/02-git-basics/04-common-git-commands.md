---
title: Common Git Commands
---
# Common Git Commands

A practical, structured guide to the Git commands you’ll use most—what they do, why they matter, and how to use them safely. Examples assume a Unix-like shell, but work similarly on Windows.

---

## Quick Reference

| Task                    | Command                       | Notes                                          |
| ----------------------- | ----------------------------- | ---------------------------------------------- |
| Initialize repository   | `git init`                    | Creates a new `.git/` in the current folder    |
| Check status            | `git status`                  | Shows staged/unstaged/untracked files & branch |
| Stage changes           | `git add <path>`              | Use `.` for “everything changed” (with care)   |
| Commit staged changes   | `git commit -m "message"`     | Creates a snapshot of staged changes           |
| View history            | `git log`                     | Add flags like `--oneline --graph`             |
| See unstaged diffs      | `git diff`                    | Compare working tree ↔ index                   |
| See staged diffs        | `git diff --staged`           | Compare index ↔ last commit                    |
| Inspect a commit        | `git show <commit>`           | Shows patch and metadata                       |
| Create/switch branch    | `git switch -c <name>`        | Or `git checkout -b <name>` for older Git      |
| Merge branch            | `git merge <branch>`          | Fast-forward or merge commit                   |
| Undo with new commit    | `git revert <commit>`         | Safe in shared history                         |
| Move back pointer       | `git reset --hard <commit>`   | Dangerous on shared branches                   |
| Temporarily shelve work | `git stash` / `git stash pop` | Clean working tree without committing          |
| Work with remotes       | `git remote add`              | Add, list, or remove remotes                   |
| Push to remote          | `git push origin <branch>`    | Upload your commits                            |
| Pull from remote        | `git pull`                    | `fetch` + `merge` (or `rebase`)                |
| Tag a version           | `git tag -a v1.0 -m "msg"`    | Lightweight or annotated tags                  |

---

## Initialize a Repository

```bash
git init
```

**What it does:** Creates a new, empty Git repository by adding a `.git/` directory. Use this in a new or existing project folder.

**Common patterns**

```bash
mkdir my-project && cd my-project
git init
```

**Tips**

* If you accidentally `init` inside the wrong folder, delete the `.git/` directory to “de‑git” it.
* For a brand-new project, create a `.gitignore` early (see below).

---

## Check Status

```bash
git status
```

**What it shows:**

* Current branch name
* Whether your branch is ahead/behind the remote
* Untracked files (not in Git)
* Changes not staged for commit
* Changes staged for commit

**Useful flags**

```bash
git status -sb   # short output + branch info
```

---

## Add Files to Staging

```bash
git add <path>         # stage a single file
git add dir/           # stage a directory
git add -p             # interactively choose hunks to stage
git add .              # stage all changes in the current directory
```

**What staging means:** You select exactly what will be included in the next commit. This enables small, focused commits.

**Pro tips**

* Use `git add -p` to craft tidy commits from a messy working tree.
* Be cautious with `git add .` in large repos (you might stage more than intended).

---

## Commit Staged Changes

```bash
git commit -m "Describe your changes"
```

**What it does:** Records a snapshot of the index (staging area) along with a message.

**Good messages**

* Summary line in imperative mood: “Add user signup form”
* Optionally, a blank line followed by details (what/why).

**Common options**

```bash
git commit            # opens editor for a full message
git commit --amend    # edit last commit (message or add more staged changes)
```

**Caution:** Amending rewrites the last commit. Avoid amending commits that were already pushed to shared branches.

---

## View Commit History

```bash
git log
```

**Readable formats**

```bash
git log --oneline --graph --decorate --all
git log --stat                    # file change stats
git log -p                        # show patches
git log -- <path>                 # history for a file or folder
```

**Filtering examples**

```bash
git log --author="Alice"
git log --since="2025-08-01"
git log --grep="hotfix"
```

---

## Compare Changes (Diff)

```bash
git diff                 # working tree ↔ index (unstaged)
git diff --staged        # index ↔ HEAD (staged)
git diff HEAD~1..HEAD    # last commit vs previous
git diff main..feature   # branch vs branch
```

**Tip:** Pair `diff` with `--word-diff` for text-heavy files.

---

## Inspect Specific Commits

```bash
git show <commit-ish>
```

Works with commit hashes, tags, or refs like `HEAD`, `HEAD~2`, `main~1`, etc.

---

## Branching and Switching

```bash
git branch                  # list branches
git switch -c feature/login # create and switch
git switch main             # switch to existing branch

# Older alternative:
git checkout -b feature/login
git checkout main
```

**Conventions**

* Use short, descriptive names: `feature/…`, `fix/…`, `chore/…`.
* Keep branches focused and short-lived.

---

## Merging (Combining Work)

```bash
git switch main
git merge feature/login
```

**Outcomes**

* **Fast-forward:** If `main` has not advanced, the pointer moves forward.
* **Merge commit:** Records a new commit that unifies histories.
* **Conflicts:** Git marks conflicting files; resolve manually, then:

  ```bash
  git add <resolved-files>
  git commit
  ```

**Alternative:** Rebase (see below) yields a linear history but rewrites commits.

---

## Rebase (Optional, Advanced)

```bash
git switch feature/login
git rebase main
```

**What it does:** Replays your branch commits on top of another base for a cleaner, linear history.

**Caution:** Do not rebase public/shared history.

---

## Stashing Work

```bash
git stash            # save dirty state; clean working tree
git stash list
git stash show -p
git stash pop        # reapply and drop
git stash apply      # reapply but keep in stash
```

**Use cases:** Quick context switches, pulling updates requiring a clean tree.

---

## Restore and Reset (Undo Toolkit)

**Restore (safer for files)**

```bash
git restore <path>            # discard unstaged changes in file
git restore --staged <path>   # unstage file (keeps changes)
git restore --source=HEAD --staged <path>
```

**Reset (moves branch/index pointers)**

```bash
git reset --soft HEAD~1   # keep changes staged; move HEAD back
git reset --mixed HEAD~1  # unstage changes; default
git reset --hard HEAD~1   # discard changes; DANGEROUS
```

**Revert (safe in shared repos)**

```bash
git revert <commit>
```

Creates a new commit that undoes `<commit>` without rewriting history.

---

## Removing and Renaming Files

```bash
git rm <path>             # remove and stage deletion
git mv old new            # rename and stage move
```

---

## Working with Remotes

**Add and inspect**

```bash
git remote add origin <url>
git remote -v
```

**Clone an existing repository**

```bash
git clone <url> [folder-name]
```

**Fetch, Pull, Push**

```bash
git fetch                  # update remote tracking branches
git pull                   # fetch + merge (or rebase per config)
git push origin <branch>   # push current branch
git push -u origin <branch># set upstream for easier future pushes
```

**Set default upstream (once)**

```bash
git push --set-upstream origin feature/login
# later: just `git push`
```

---

## Tags (Versioning)

```bash
git tag                     # list
git tag -a v1.0 -m "1.0"    # annotated tag
git push origin v1.0        # push a single tag
git push origin --tags      # push all tags
```

---

## .gitignore Essentials

Create a `.gitignore` to avoid committing build artefacts, secrets, and OS cruft.

Examples:

```bash
# dependencies
node_modules/
# builds
dist/
build/
# OS / editor
.DS_Store
*.swp
```

**Tip:** Use language/framework-specific templates from gitignore repositories when starting out.

---

## Safer, Sharper Workflows

* Make **small, focused commits** with meaningful messages.
* Use `git add -p` to stage only the intent of your change.
* Prefer `git revert` over `reset --hard` on shared branches.
* Set helpful aliases in your global config:

  ```bash
  git config --global alias.st status
  git config --global alias.last 'log -1 --stat'
  git config --global alias.lg 'log --oneline --graph --decorate --all'
  ```

---

## Common “Oops” Scenarios

* **Staged the wrong file**

  ```bash
  git restore --staged <file>
  ```

* **Committed to the wrong branch (unpushed)**

  ```bash
  git switch correct-branch
  git cherry-pick <bad-commit-sha>
  git switch wrong-branch
  git reset --hard HEAD~1
  ```

* **Forgot a file in the last commit (unpushed)**

  ```bash
  git add forgotten-file
  git commit --amend
  ```

* **Need to rewrite the last N local commits into one**

  ```bash
  git reset --soft HEAD~N
  git commit -m "squashed message"
  ```

---

## Putting It Together: A Minimal Daily Flow

```bash
# start from latest main
git switch main
git pull

# create a feature branch
git switch -c feature/contact-form

# work and commit in small steps
git add -p
git commit -m "Add basic contact form UI"

# keep up-to-date
git fetch
git rebase origin/main   # or: git merge origin/main

# share your work
git push -u origin feature/contact-form

# open a pull request on your platform of choice
```

---

## Further Reading (What to learn next)

* Interactive rebase for commit cleanup
* Bisecting (`git bisect`) to locate regressions
* Submodules vs. monorepos
* Signed commits and release tagging

---

**Checklist**

* [ ] Repository initialized (`git init` or `git clone`)
* [ ] Clean status before committing (`git status`, `git diff`)
* [ ] Staged intentionally (`git add -p`)
* [ ] Clear message (`git commit -m "…"`)
* [ ] Pushed with upstream set (`git push -u origin <branch>`)
* [ ] History readable (`git log --oneline --graph`)

This guide equips you with the core commands and safe habits to work effectively in Git, from your first `init` to confident collaboration.
