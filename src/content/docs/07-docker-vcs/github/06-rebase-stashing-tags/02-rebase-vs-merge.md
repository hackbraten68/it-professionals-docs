---
title: Rebase vs. Merge
---
- **Merge** creates a new commit that combines two branches.
- **Rebase** rewrites history by "replaying" your commits on top of another branch.

#### Example

```bash
# Switch to your feature branch
git checkout feature

# Rebase onto main
git rebase main
```

You can also use rebase to edit, squash, or delete commits interactively:

```bash
git rebase -i HEAD~3
```

This command opens an editor where you can choose actions like `pick`, `reword`, `squash`, etc.
