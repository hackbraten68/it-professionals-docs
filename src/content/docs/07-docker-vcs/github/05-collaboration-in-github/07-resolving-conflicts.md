---
title: Resolving Conflicts
---

Conflicts happen when changes in one branch contradict those in another.

### How to resolve

- Pull the latest changes from `main`
- Merge into your branch
- Manually fix conflicting files
- Commit and push again

```bash
git checkout feature/my-feature
git pull origin main
# Fix conflicts in your code editor
git add .
git commit -m "Resolved merge conflicts"
git push
```
