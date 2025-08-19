---
title: Summary
---
# Summary

In Git, several features help you manage your work more effectively. While each serves a different purpose, together they improve collaboration, history tracking, and workflow efficiency. This section summarizes three important concepts: **Rebase**, **Stashing**, and **Tags**.

---

## Rebase

**Definition:**
Rebase allows you to move or reapply commits onto another branch. It’s often used to integrate the latest changes from a main branch into your feature branch without introducing merge commits.

**Key Benefits:**

* Keeps commit history **linear and clean**.
* Makes it easier to follow project history.
* Useful for updating a feature branch with the latest changes.

**Caution:**

* Rebase **rewrites history**, which can cause problems if others are working on the same branch.
* Avoid rebasing shared/public branches unless you have coordinated with your team.

**Important Note:**
If you need to push after rebasing, you often must use:

```bash
git push --force
```

⚠️ Be careful: `--force` can overwrite remote history and break others’ work. Always communicate with your team before using it.

---

## Stashing

**Definition:**
Stashing allows you to **temporarily save uncommitted changes** without committing them to your branch. It’s like setting work aside so you can come back later.

**Common Use Cases:**

* You want to switch branches but have local changes you don’t want to commit yet.
* You need a clean working directory for testing, debugging, or pulling updates.

**Basic Commands:**

```bash
# Save changes to a new stash
git stash

# List all stashes
git stash list

# Apply the most recent stash (keeps it in stash list)
git stash apply

# Apply and remove the stash
git stash pop

# Remove the most recent stash without applying
git stash drop
```

**Tip:** You can also give a stash a descriptive name:

```bash
git stash save "WIP: fixing layout bug"
```

---

## Tags

**Definition:**
Tags are references that point to specific commits in Git history. They are typically used to mark **releases** (e.g., `v1.0`, `v2.0-beta`) or other important points in the project.

**Types of Tags:**

1. **Lightweight Tags** – simple pointers to a commit (like a bookmark).
2. **Annotated Tags** – include metadata such as author, date, and a message (recommended for releases).

**Examples:**

```bash
# Create a lightweight tag
git tag v1.0

# Create an annotated tag
git tag -a v1.0 -m "Release version 1.0"

# List all tags
git tag

# Push a single tag
git push origin v1.0

# Push all tags
git push --tags
```

---

## Final Tip

* **Rebase**: Great for keeping history clean, but dangerous if used carelessly.
* **Stashing**: Perfect for saving temporary work without committing.
* **Tags**: Essential for marking project milestones and releases.

👉 **Golden Rule:** If you use **rebase** and then **force push**, always let your team know. Miscommunication here can cause major issues in a collaborative workflow.
