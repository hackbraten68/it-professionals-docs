---
title: What is Rebase
---

## Introduction

In Git, **rebase** is a command that allows you to move or combine a sequence of commits onto a new base commit.  
This makes your commit history cleaner, more linear, and easier to read compared to merge commits.  

Rebasing is one of the most powerful tools in Git, but it also requires careful use because it rewrites history.

---

## Why Use Rebase?

Rebase is commonly used to:

- **Clean up commit history:** Instead of multiple scattered commits, you can rewrite them into a clean, linear history.
- **Avoid unnecessary merge commits:** Merging often introduces additional commits (e.g., "Merge branch main into feature"), which can clutter the history. Rebase avoids this by applying changes directly.
- **Update a feature branch with the latest changes from `main`:** Rebase ensures your feature branch sits on top of the most recent commits of `main`.

---

## How Rebase Works

Imagine this situation:

- You have a `main` branch with commits `A–B–C`.
- You created a `feature` branch and made commits `D–E`.

Later, `main` received a new commit `F`.  
Now your branches look like this:

```bash

main:    A -- B -- C -- F
feature:             -- D -- E

```

If you run `git rebase main` on your `feature` branch, Git will:

1. Temporarily remove commits `D` and `E`.
2. Move the branch pointer to the latest commit of `main` (`F`).
3. Replay commits `D` and `E` on top of `F`.

The history now looks like this:

```bash

main:    A -- B -- C -- F
feature:                   -- D' -- E'

```

Notice that the commits `D'` and `E'` are new (rebased) versions of the old commits, rewritten onto the new base.

---

## Common Rebase Commands

### Rebase onto `main`

```bash
git checkout feature
git fetch origin
git rebase origin/main
```

This updates your feature branch so that it includes the latest changes from `main` without creating a merge commit.

---

### Interactive Rebase

```bash
git rebase -i HEAD~3
```

* `-i` stands for *interactive*.
* This opens an editor where you can choose to **squash, edit, reword, or drop commits**.
* Example use cases:

  * Combine several small commits into one meaningful commit (squash).
  * Edit a commit message for clarity.
  * Remove unnecessary commits.

---

## Rebase vs. Merge

| **Aspect**    | **Rebase**                                     | **Merge**                                       |
| ------------- | ---------------------------------------------- | ----------------------------------------------- |
| History style | Linear, cleaner                                | Branching, may include merge commits            |
| Safety        | Rewrites history (be cautious on shared repos) | Preserves complete history as it happened       |
| Use case      | Updating a feature branch with latest `main`   | Integrating multiple branches without rewriting |

---

## Important Considerations

* **Never rebase public/shared branches**: Rebasing rewrites history. If teammates have already based work on the old commits, this can cause serious conflicts.
* **Safe to rebase private branches**: If you are the only one working on a branch, rebase is a great tool.
* **Conflicts can occur**: Just like merging, rebasing may result in conflicts that need to be resolved manually.

---

## Example Workflow

1. Start a new feature branch:

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make several commits.
3. Before creating a pull request, update with the latest `main`:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. Resolve any conflicts, then continue:

   ```bash
   git add .
   git rebase --continue
   ```

5. Push the rebased branch (force push needed since history changed):

   ```bash
   git push --force
   ```

---

## Summary

* **Rebase** moves or combines commits onto a new base commit.
* It creates a **clean, linear history** that is easier to follow.
* It is best used for **local or private branches** to prepare code before merging.
* Use **interactive rebase** to polish commit history.
* Avoid rebasing shared/public branches to prevent disrupting others.

When used wisely, rebase is one of the most effective tools to keep a Git project’s history clear and maintainable.
