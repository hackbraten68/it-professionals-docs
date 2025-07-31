---
title: What is Stashing?
---
Stashing lets you temporarily save your uncommitted changes without committing them to the current branch.

Useful when:

- You want to switch branches but have local changes.
- You need a clean working directory.

#### Common Commands

```bash
# Save changes to a new stash
git stash

# List all stashes
git stash list

# Apply the most recent stash
git stash apply

# Drop the most recent stash
git stash drop

# Apply and remove the stash
git stash pop
```

#### Naming a Stash

```bash
git stash save "WIP: fixing layout bug"
```
