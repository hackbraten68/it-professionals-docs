---
title: Git Lifecycle
---
## Introduction

Git is a **Distributed Version Control System (DVCS)** that manages changes to files and projects.  
One of the most important concepts to understand when learning Git is the **lifecycle of a file**.  
Every file in a Git project exists in one of several states, and developers move files between these states as they work on their projects.

---

## Overview of the Git Lifecycle

Every file in Git goes through a cycle that helps you track and manage changes. The three main stages are:

1. **Working Directory** – where files are created, edited, and deleted.
2. **Staging Area** – where changes are prepared before being permanently recorded.
3. **Repository** – where committed snapshots are stored as part of the project history.

Understanding these stages is crucial because Git does not automatically track every change. You decide what to include, commit, or discard.

---

## 1. Working Directory

The **Working Directory** is the local folder on your machine where your project files live.

- This is where you actively edit files.
- Files can have different states in the working directory:
  - **Untracked**: Files that Git is not yet monitoring.
  - **Modified**: Files that Git is tracking but have been changed since the last commit.
  - **Deleted**: Files that were removed but not yet updated in Git.

### Example Commands

```bash
git status       # Show the state of files in the working directory
git add <file>   # Move changes from the working directory to the staging area
```

---

## 2. Staging Area

The **Staging Area** (also called the **Index**) is like a **preparation zone**.
You decide which changes should be included in the next commit.

* When you use `git add`, you place changes into the staging area.
* This allows you to commit specific changes while leaving others uncommitted.
* You can stage multiple files or just parts of a file.

### Example Commands

```bash
git add file1.txt       # Stage a single file
git add .               # Stage all changes in the current directory
git reset file1.txt     # Remove a file from the staging area
```

---

## 3. Repository

The **Repository** is the database where Git stores **committed snapshots** of your project.

* A **commit** is a permanent snapshot of the staged files.
* Commits create a timeline of project history.
* Each commit has:

  * A unique ID (SHA hash)
  * Author information
  * A commit message
  * A reference to its parent commits

### Example Commands

```bash
git commit -m "Add new feature"   # Create a new commit with staged changes
git log                           # Show commit history
```

---

## Lifecycle in Action

Here’s how a file typically moves through the lifecycle:

1. **Create/Edit file** → File appears as *untracked* or *modified* in the **Working Directory**.
2. **Stage changes** → Use `git add` to move changes to the **Staging Area**.
3. **Commit** → Use `git commit` to store the staged changes in the **Repository**.

---

## Visualizing the Git Lifecycle

```bash
Working Directory  →  Staging Area  →  Repository
       (edit)            (git add)        (git commit)
```

* **Working Directory** = Sandbox for editing
* **Staging Area** = Checklist of changes to commit
* **Repository** = Permanent history of commits

---

## Key Takeaways

* Git files move through **Working Directory → Staging Area → Repository**.
* The **Working Directory** is where you make changes.
* The **Staging Area** allows you to carefully prepare commits.
* The **Repository** stores your project history permanently.
* By mastering this lifecycle, you gain precise control over what gets saved and shared.
