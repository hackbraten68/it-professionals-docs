---
title: Merging Branches
---

To merge a branch into the current one:

```bash
git checkout main
git merge feature-login
```

#### Merge Types

- **Fast-forward:** No changes in the base branch since branching off
- **Three-way merge:** Both branches have moved forward independently
