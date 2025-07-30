---
title: Creating your first Repository
---

#### Option A - On GitHub

- Click on New Repository
- Give it a name (e.g., my-first-repo)
- Choose visibility (public/private)
- Optionally add README and .gitignore
- Click Create repository

#### Option B - From Local Directory

```bash
mkdir my-project
cd my-project
git init
git remote add origin https://github.com/username/my-project.git
git add .
git commit -m "Initial commit"
git push -u origin main
```
