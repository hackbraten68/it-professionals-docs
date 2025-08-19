---
title: What is Stashing?
---
# What Is Stashing? (Git)

Stashing lets you **temporarily shelve local changes** (both unstaged and optionally staged) so you can return to a clean working directory—without committing to the current branch. Think of it as a quick “hold my changes” feature.

---

## When to Use Stash

* You need to **switch branches** but have uncommitted changes that would otherwise block checkout.
* You want to **pull/rebase** with a clean tree.
* You’re experimenting and want a **safe scratchpad** without creating commits.
* You need to **context‑switch** quickly, then come back later.

---

## How Stash Works (Conceptual Model)

* A stash is stored as a **pair of commits** under `refs/stash`:

  * One commit holds your **working tree** changes.
  * Another often captures your **index (staged) changes**.
* Stashes live **only in your local repo** and are **not pushed** to remotes.
* By default, **untracked** and **ignored** files are *not* included unless you ask for them.

---

## Quick Start: Core Commands

```bash
# Save changes to a new stash (tracked files; includes staged & unstaged)
git stash

# Equivalent modern form (preferred) with an optional message:
git stash push -m "WIP: fixing layout bug"

# List all stashes
git stash list

# Apply the most recent stash (keeps it in the stash list)
git stash apply

# Apply and remove the most recent stash
git stash pop

# Drop (delete) the most recent stash without applying
git stash drop
```

> **Tip:** Use `git stash pop` only if you’re confident it will apply cleanly. Otherwise use `apply` first; if it looks good, then `drop`.

---

## Naming a Stash

```bash
# Legacy (still works, but 'push -m' is preferred):
git stash save "WIP: fixing layout bug"

# Preferred:
git stash push -m "WIP: fixing layout bug"
```

You’ll see the message in `git stash list`, which makes it much easier to find the right stash later.

---

## Viewing & Inspecting Stashes

```bash
# Compact list
git stash list

# Show patch summary of the most recent stash
git stash show

# Show full patch (diff) for a specific stash
git stash show -p stash@{2}
```

---

## Applying Specific Stashes

```bash
# Apply a specific stash without removing it
git stash apply stash@{2}

# Apply and remove it
git stash pop stash@{2}
```

If conflicts occur, resolve them like any merge conflict and continue.

---

## Including Untracked & Ignored Files

By default, stashes include **only tracked files**. Use the flags below to expand:

```bash
# Include untracked files (new files not yet added)
git stash push -u -m "WIP with untracked"

# Include both untracked and ignored files
git stash push -a -m "WIP including ignored"
```

* `-u` / `--include-untracked`
* `-a` / `--all` (includes ignored)

---

## Selective / Partial Stashing

### 1) Stash Only Certain Paths

```bash
git stash push -m "only styles" -- src/styles/ public/
```

### 2) Interactively Pick Hunks

```bash
git stash -p
# or:
git stash push -p -m "partial WIP"
```

Select exactly which changes (hunks) to stash.

### 3) Keep Staged Changes in Place

```bash
# Stash only unstaged changes; keep index intact
git stash push --keep-index -m "stash unstaged only"
```

### 4) Test Your Staged Build

```bash
# Temporarily stash everything except what’s staged:
git stash push --keep-index -m "testing staged"
# run tests/build...
# bring back the rest:
git stash pop
```

---

## Working with Staged vs. Unstaged Changes

* **Default** `git stash` saves both staged and unstaged changes.
* Use `--keep-index` to **exclude** staged changes from the stash.
* Use `--staged` (in newer Git) to stash **only** staged changes:

  ```bash
  git stash push --staged -m "only staged WIP"
  ```

---

## See What’s Inside a Stash (Advanced)

A stash is just commits. You can diff them like any other:

```bash
# Inspect the "worktree" part
git diff stash@{1}^1 stash@{1}

# Inspect the "index" part
git diff stash@{1}^2 stash@{1}
```

(You rarely need this, but it’s handy for forensics.)

---

## Creating a Branch from a Stash

When a stash doesn’t apply cleanly—or you want to continue work in isolation—create a branch:

```bash
git stash branch fix/layout-bug stash@{1}
# Git: creates branch at the commit where the stash was made, applies stash, and drops it if successful
```

---

## Restoring a Single File from a Stash

```bash
# Apply only changes for one path (from a specific stash)
git checkout stash@{2} -- src/components/Header.tsx
```

This is great for selectively pulling back a file without applying the whole stash.

---

## Managing Stashes

```bash
# Remove a specific entry
git stash drop stash@{3}

# Remove all stashes (careful!)
git stash clear
```

> **Warning:** `clear` is irreversible in normal workflows.

---

## Typical Workflows

### A) Quick Context Switch

```bash
git stash push -m "WIP: refactor menu"
git checkout hotfix/urgent
# ...fix & commit...
git checkout feature/menu-refactor
git stash pop
```

### B) Pull with a Clean Tree

```bash
git stash push -m "before pull"
git pull --rebase
git stash pop
```

### C) Test Staged Changes Only

```bash
git add .
git stash push --keep-index -m "save unstaged"
# run tests/build on staged snapshot
git stash pop  # bring the unstaged work back
```

---

## Conflict Handling

Applying a stash can cause **merge conflicts**, especially if the base branch moved:

1. Run `git stash apply` (or `pop`).
2. Resolve conflicts in files.
3. `git add` the resolved files.
4. If you used `apply`, optionally `git stash drop` that stash.

> If `pop` fails partway due to conflicts, Git **won’t** drop the stash. Resolve conflicts; if you don’t need the stash anymore, drop it manually.

---

## Best Practices & Pitfalls

* **Prefer messages**: `git stash push -m "WIP: …"` makes `list` readable.
* **Avoid stash pile‑ups**: Too many anonymous stashes become unmanageable.
* **Use `apply` before `drop`** when unsure; `pop` is all‑or‑nothing.
* **Remember locality**: Stashes are **not shared**; teammates can’t see them.
* **Consider commits**: If work is meaningful, a **draft/WIP commit** on a feature branch is often safer and more discoverable than a stash.
* **Use selective flags**: `-u`/`-a`, pathspecs, and `-p` give fine‑grained control.
* **Clean up** old stashes periodically (`list`, then `drop` what you no longer need).

---

## Troubleshooting & Recovery

* **“My stash is gone after pop”**: That’s by design—`pop` deletes it if the apply succeeded. Use `apply` first if you want to keep a backup.
* **“I applied the wrong stash”**: If you haven’t changed much since, you can often revert the working tree (e.g., `git reset --hard` if safe) and apply the correct one.
* **“I cleared stashes accidentally”**: Recovery is difficult; `git fsck --lost-found` may surface orphaned objects, but success isn’t guaranteed. Consider stashes ephemeral.

---

## Command Reference (Cheat Sheet)

```bash
# Save (tracked changes)
git stash
git stash push -m "msg"

# Include untracked / ignored
git stash push -u -m "msg"
git stash push -a -m "msg"

# Keep staged, stash only unstaged
git stash push --keep-index -m "msg"

# Interactively select hunks
git stash -p
git stash push -p -m "msg"

# Only certain paths
git stash push -m "msg" -- pathA pathB

# List & inspect
git stash list
git stash show
git stash show -p stash@{n}

# Apply / pop / drop
git stash apply [stash@{n}]
git stash pop   [stash@{n}]
git stash drop  [stash@{n}]
git stash clear

# Branch from stash
git stash branch my-branch stash@{n}

# Restore a single file
git checkout stash@{n} -- path/to/file
```

---

## Example Session

```bash
# Start with some changes
git status
# On branch feature/layout
#  modified: src/App.jsx
#  untracked: src/styles/new-theme.css

# Save both tracked & untracked
git stash push -u -m "WIP: new theme"

# Verify
git stash list
# stash@{0}: On feature/layout: WIP: new theme

# Switch, update, and return
git checkout main
git pull --rebase
git checkout feature/layout

# Bring work back
git stash apply stash@{0}

# If all good, clear it
git stash drop stash@{0}
```

---

## FAQ

**Does stash include submodules?**
It stashes changes within the superproject; submodule changes are separate. Commit or stash inside the submodule itself if needed.

**Is `git stash save` deprecated?**
It still works, but `git stash push` (with `-m`) is the modern, more explicit form.

**Can I share a stash?**
Not directly. Convert it into a commit/branch or use `git format-patch` from a temporary branch created via `git stash branch`.

---

With these patterns and commands, you can use Git stashing confidently to pause work, switch contexts, and resume exactly where you left off—without cluttering your history with WIP commits unless you choose to.
