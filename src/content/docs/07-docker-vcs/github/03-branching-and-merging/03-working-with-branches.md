---
title: Working with Branches
---

Once you're on a branch:

- You can commit changes as usual
- These changes will not affect the `main` branch until you merge them

Typical workflow:

```bash
git add .
git commit -m "Add login form"
```

You can push your branch to a remote:

```bash
git push origin feature-login
```
