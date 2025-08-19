---
title: Key Concepts in Git (as an Example of DVCS)
---

## Introduction

Git is one of the most popular **Distributed Version Control Systems (DVCS)**. Unlike centralized systems, each user has a complete copy of the repository, including its full history.  
Understanding the key concepts of Git is essential to effectively manage code, collaborate with others, and maintain a clean development workflow.

---

## Repository

- A **repository (repo)** is the core storage location for a project’s files and its entire history.
- It contains:
  - The working directory (the files you are actively editing).
  - The staging area (where changes are prepared before committing).
  - The `.git` directory (hidden metadata that stores history, branches, and configuration).
- Repositories can be **local** (on your machine) or **remote** (on platforms like GitHub, GitLab, Bitbucket).

---

## Commit

- A **commit** is like a snapshot of your project at a specific point in time.
- Each commit stores:
  - The changes you made (added, modified, or deleted files).
  - A unique commit ID (SHA hash).
  - Author information and a timestamp.
  - A commit message describing the purpose of the change.
- Commits create a timeline of development that you can navigate, revert, or build upon.

---

## Branch

- A **branch** is a separate line of development.
- By default, Git creates a `main` (or `master`) branch.
- Developers can create new branches to:
  - Work on features independently.
  - Test new ideas without affecting the main codebase.
  - Fix bugs while keeping production code stable.
- Branches allow parallel development and make collaboration easier.

---

## Merge

- **Merging** is the process of integrating changes from one branch into another.
- Common scenarios:
  - Merging a feature branch into `main` after development is complete.
  - Resolving conflicts when different branches have modified the same part of a file.
- Merge types:
  - **Fast-forward merge**: No conflicts, the branch history simply extends.
  - **Three-way merge**: Combines different histories and may require conflict resolution.

---

## Clone

- To **clone** a repository means to make a full copy of it on your local machine.
- Unlike downloading a ZIP file, cloning includes:
  - The complete history of commits.
  - All branches, tags, and metadata.
- Command example:
  ```bash
  git clone https://github.com/user/project.git
