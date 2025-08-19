---
title: Introduction to Branching
---

Branching is one of the most powerful features of Git. It allows developers to create independent lines of development that diverge from the main codebase. This enables experimentation, parallel work, and safer collaboration.

---

## What is a Branch?

- A **branch** is essentially a pointer to a specific commit in a repository’s history.
- Each branch represents an **independent line of development**.
- The default branch is typically named **`main`** (formerly **`master`**).

When you create a new branch, you are creating a parallel timeline where you can make changes without affecting the main project.

---

## Why Use Branches?

Branches are used for multiple reasons in software development:

1. **Isolate Features**
   - Work on new features without disturbing the main codebase.
   - Developers can create a branch for each feature and merge it back once complete.

2. **Test New Ideas**
   - Try out experimental changes or prototypes.
   - If the idea fails, simply delete the branch without impacting the main project.

3. **Collaborate Without Conflict**
   - Multiple developers can work on different branches simultaneously.
   - Reduces the risk of conflicts when merging code back into the main branch.

---

## The Default Branch: `main` (or `master`)

- Every Git repository starts with a **default branch**.
- This branch usually contains the **production-ready code**.
- The community has largely shifted from `master` to **`main`** as the default branch name.
- Other branches (e.g., feature, bugfix, hotfix) are typically merged into `main` after testing and review.

---

## Common Use Cases for Branching

- **Feature branches**: For developing new features (`feature/login-page`).
- **Bugfix branches**: For fixing issues without interrupting main development (`bugfix/header-issue`).
- **Hotfix branches**: For urgent fixes in production (`hotfix/payment-error`).
- **Experiment branches**: For testing out ideas (`experiment/ui-redesign`).

---

## Benefits of Branching in Git

- Encourages **cleaner project history** (through isolated work).
- Supports **parallel development** by multiple team members.
- Makes it easy to **switch between tasks** without losing progress.
- Provides a **safe space for experimentation**.

---

## Visualizing Branches

Imagine the **main branch** as a straight line representing stable code.  
When a branch is created, it forms a **new path** that can later rejoin the main line through merging.

```bash
main ----A----B----C----D

E----F (feature-branch)
```

Here:

- Commits `A → D` belong to the `main` branch.
- Commits `E → F` belong to the `feature-branch`.
- The `feature-branch` can later be merged back into `main`.

---

## Summary

- **Branching** is the foundation of modern collaborative development with Git.
- Each branch is an independent line of development.
- Developers use branches to isolate features, test new ideas, and collaborate effectively.
- The **default branch** is usually `main`, where stable and production-ready code resides.

Understanding branching is essential before diving into merging, rebasing, and other advanced Git workflows.
