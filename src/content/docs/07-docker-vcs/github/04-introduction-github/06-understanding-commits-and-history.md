---
title: Understanding Commits and History
---

## 1. What is a Commit?

A **commit** in Git represents a snapshot of your project at a specific point in time.  
When you commit, you save the current state of your files (those that have been staged) into the repository’s history.  

Each commit contains:

- A **unique identifier (SHA hash)** — a 40-character code that makes every commit distinct.
- **Author information** — the name and email of the person who made the change.
- A **timestamp** — when the commit was created.
- A **commit message** — a short description explaining the purpose of the change.
- A **reference to parent commits** — showing the history and how commits are connected.

---

## 2. Why Commits Matter

Commits are central to version control. They allow you to:

- **Track changes** over time and understand the evolution of a project.
- **Roll back** to a stable version if something breaks.
- **Collaborate effectively**, since everyone can see who made what changes and why.
- **Maintain accountability** through the commit history.
- **Experiment safely** by branching, committing, and later deciding to merge or discard changes.

---

## 3. Viewing Commit History

Git provides tools to explore the commit history.

### Basic Log

```bash
git log
````

This shows:

* The commit hash (unique ID).
* The author’s name and email.
* The date of the commit.
* The commit message.

### Simplified Log

```bash
git log --oneline
```

This shows each commit as a single line, which is useful for a quick overview.

Example output:

```bash
a1b2c3d Fix login button alignment
f4e5g6h Add user authentication feature
i7j8k9l Initial commit
```

### Visualize Branches and History

```bash
git log --oneline --graph --all
```

This displays a text-based graph of branches and how commits are connected.

---

## 4. Inspecting Changes in Commits

You can look inside a commit to see what exactly was changed.

* Show differences introduced by the last commit:

```bash
git show
```

* Show differences for a specific commit:

```bash
git show <commit-hash>
```

* Compare changes between two commits:

```bash
git diff <commit1> <commit2>
```

---

## 5. Navigating Commit History

Sometimes you need to go back or move through history.

* **Check out an older commit** (detached HEAD state):

```bash
git checkout <commit-hash>
```

* **Return to the latest commit on the main branch**:

```bash
git checkout main
```

* **Undo changes by resetting to a commit** (destructive action, be careful):

```bash
git reset --hard <commit-hash>
```

---

## 6. Best Practices for Commits

* **Make small, focused commits**
  Each commit should represent a single logical change.

* **Write clear commit messages**
  A good message explains *what* changed and *why*.
  Example:

  ```text
  Add validation for user email input
  ```

* **Commit often**
  This creates more restore points and makes troubleshooting easier.

* **Avoid committing large binary files**
  Git is best suited for source code and text-based files.

---

## 7. Summary

* A **commit** is a snapshot of your project’s history.
* Commits allow you to **track changes, collaborate, and revert if needed**.
* Use `git log`, `git show`, and `git diff` to explore history.
* Good commit practices improve project clarity and teamwork.

By mastering commits and history, you gain full control over the timeline of your project.
