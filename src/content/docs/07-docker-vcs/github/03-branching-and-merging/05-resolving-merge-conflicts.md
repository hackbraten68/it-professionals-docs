---
title: Resolving Merge Conflicts
---

If two branches modify the same part of a file, Git will raise a merge conflict.

Example conflict:

```diff
<<<<<<< HEAD
This is from the main branch
=======
This is from feature-login
>>>>>>> feature-login
```

Steps to resolve:

- Edit the file and choose the correct content
- Stage the resolved file:

```bash
git add filename
```

- Commit the merge:

```bash
git commit
```
