---
title: Branching and Collaboration
---
# Branching and Collaboration

> A practical, classroom‑ready guide to working with branches in Git and collaborating effectively on shared repositories.

---

## 1) Core Idea: What Is a Branch?

A **branch** is an independent line of development—essentially a movable pointer to a sequence of commits. The default branch is usually called `main` (older repos may use `master`). Branches let you:

* Isolate work (features, fixes, experiments) from the stable codebase
* Iterate safely without breaking the default branch
* Collaborate in parallel and merge changes when they’re ready

---

## 2) Mental Model

* Think of `main` as the **trunk** of a tree.
* Each **feature branch** grows off the trunk.
* When the feature is complete and tested, you **merge** it back into the trunk.

```bash
main ──●──●──────●────────●
          \
feature    ●──●──●──●───► (pull request → review → merge)
```

---

## 3) Essential Commands (Modern & Classic)

### Listing & Creating

```bash
git branch                  # list local branches
git branch -r               # list remote branches (origin/...)
git branch -a               # list all (local + remote)

# create a branch (classic)
git branch new-feature

# create & switch in one step (modern)
git switch -c new-feature

# classic switch (prior to Git 2.23)
git checkout new-feature
```

### Switching & Syncing

```bash
git switch main             # switch back to main
git fetch origin            # update remote tracking info
git pull --ff-only          # fast-forward main safely
```

### Pushing & Tracking

```bash
git push -u origin new-feature   # push and set upstream tracking
git push                         # subsequent pushes use the tracked remote
```

### Merging (into current branch)

```bash
git switch main
git merge new-feature            # merge feature into main (FF or 3-way)
```

### Deleting

```bash
git branch -d new-feature        # delete local after merge (safe)
git branch -D new-feature        # force delete local (use sparingly)
git push origin --delete new-feature   # delete remote branch
```

---

## 4) Fast‑Forward vs. 3‑Way Merge

* **Fast‑forward**: `main` hasn’t advanced since you branched. Git just moves the `main` pointer forward—no new merge commit.
* **3‑way merge**: Both branches diverged. Git creates a merge commit tying histories together.

Control behavior:

```bash
# Always create a merge commit (even if FF possible)
git merge --no-ff new-feature

# Prefer linear history (disallow merge commits)
git pull --ff-only
```

---

## 5) Keeping Your Branch Up‑to‑Date

Regularly sync with the default branch to reduce conflicts later:

**Option A — Merge `main` into your branch (non‑linear but simple):**

```bash
git switch new-feature
git fetch origin
git merge origin/main
```

**Option B — Rebase your branch on top of `main` (linear, cleaner history):**

```bash
git switch new-feature
git fetch origin
git rebase origin/main
# If conflicts: resolve → git add <files> → git rebase --continue
```

> Team convention matters. Agree whether contributors should **merge** or **rebase** to update feature branches.

---

## 6) Collaboration Workflow (Pull Requests)

1. **Branch** from `main`: `git switch -c feat/login`
2. **Commit** small, focused changes with clear messages
3. **Push** and open a **Pull Request** (PR)
4. **Automated checks** run (CI, linters, tests)
5. **Review**: peers comment, request changes, approve
6. **Update** the branch (fix ups, rebase/merge `main`)
7. **Merge** via one of:

   * **Merge commit** (preserves full history)
   * **Squash & merge** (one commit on `main`; ideal for many small commits)
   * **Rebase & merge** (linear, preserves individual commits)
8. **Delete** the feature branch (local & remote)

---

## 7) Branch Naming Conventions

Use descriptive, kebab‑case names with a type prefix:

* `feat/user-onboarding`
* `fix/login-null-pointer`
* `docs/api-usage`
* `chore/ci-cache`
* `hotfix/payment-timeout`

If you track work items, include IDs: `feat/1234-user-onboarding`.

---

## 8) Popular Branching Models

### GitHub Flow (simple, continuous delivery)

* One long‑lived branch: `main`
* Short‑lived feature branches off `main`
* PR → review → merge → deploy

**Use when:** frequent deploys, web apps, strong CI/CD.

### Git Flow (release cycles & multiple long‑lived branches)

* Long‑lived: `main` (production), `develop` (integration)
* Support branches: `feature/*`, `release/*`, `hotfix/*`

**Use when:** scheduled releases, heavier process, multiple environments.

### Trunk‑Based Development

* Everyone commits small, frequent changes to `main`
* Branches last < 1–2 days
* Feature flags guard incomplete work

**Use when:** high‑throughput teams, strict CI, strong testing.

> Choose a model that fits your **team size**, **release cadence**, and **risk tolerance**. Document the choice in your CONTRIBUTING guide.

---

## 9) Handling Merge Conflicts

Conflicts happen when changes touch the same lines or related hunks.

**Typical flow:**

```bash
# During merge or rebase you see conflicts:
# Edit files to pick the correct content
git add path/to/conflicted-file
git commit                # if merging
# or
git rebase --continue     # if rebasing
```

**Tips**

* Commit early & often; keep PRs small
* Pull/rebase frequently
* Communicate if you’re editing high‑churn files

---

## 10) Code Review Best Practices

**For Authors**

* Keep PRs small and focused (< \~300 lines changed)
* Provide context: *what & why*, screenshots, test notes
* Respond to feedback promptly
* Prefer “squash & merge” to keep history tidy (if team agrees)

**For Reviewers**

* Review behavior first (tests, acceptance criteria)
* Comment on *code, not people*
* Suggest concrete improvements
* Approve only when tests pass and risks are addressed

---

## 11) Protected Branches & Permissions

Protect `main` (and `release/*` if applicable):

* Require PR reviews (e.g., 1–2 approvals)
* Require status checks (CI) to pass
* Disallow force‑pushes & direct pushes
* Enforce linear history (optional)
* Require signed commits (optional, security‑sensitive repos)

---

## 12) Commit Strategy

* Write **clear, imperative** messages:
  `"Add login form validation"` not `"added validation"`
* Consider **Conventional Commits**:

  * `feat: add password strength meter`
  * `fix(auth): handle token refresh`
  * `docs(readme): update setup steps`
* Group noisy fixups with **interactive rebase** before merging:

  ```bash
  git rebase -i origin/main
  # mark small fix commits as 'fixup' or 'squash'
  ```

---

## 13) Feature Flags (Toggling Incomplete Work)

Ship code behind flags to keep `main` deployable:

* Merge early, iterate safely
* Use configuration or runtime flags
* Remove stale flags promptly

---

## 14) Advanced Branch Operations

```bash
# Start a release branch
git switch -c release/1.4.0

# Hotfix from production
git switch -c hotfix/checkout-crash main

# Cherry-pick (copy a commit onto your branch)
git cherry-pick <commit-sha>

# Revert a bad merge (creates a new commit that undoes changes)
git revert -m 1 <merge-commit-sha>

# Stash WIP changes
git stash push -m "WIP: tweak styles"
git stash list
git stash pop
```

---

## 15) Collaboration Checklist

* [ ] Branch named clearly, linked to issue/ticket
* [ ] Small, focused changes; tests included
* [ ] Rebased/merged with latest `main`
* [ ] CI green; lint/style checks passing
* [ ] PR description explains *what/why*; screenshots/logs if relevant
* [ ] Review complete; comments addressed
* [ ] Merge via team‑approved method (merge, squash, rebase)
* [ ] Branch deleted after merge

---

## 16) Troubleshooting & Pitfalls

* **“Diverged branches” on pull** → Use `git pull --rebase` (if policy allows) or manually `fetch` + `rebase/merge`.
* **Accidental commits on `main`** → `git switch -c fixup/main-typo` → `git reset --hard origin/main` → cherry‑pick needed commits onto a feature branch.
* **Force‑push dangers** → Avoid on shared branches. If required, communicate widely and consider branch protection rules.
* **Long‑lived branches** → Increase conflict risk; break work down and merge smaller increments behind flags.

---

## 17) Putting It All Together (Example Flow)

```bash
# 1) Create and push a feature branch
git switch -c feat/profile-page
git add .
git commit -m "feat(profile): initial profile page"
git push -u origin feat/profile-page

# 2) Open PR → CI runs → review feedback → address comments
git add .
git commit -m "fix(profile): align avatar and bio"
git push

# 3) Keep up-to-date
git fetch origin
git rebase origin/main
# resolve conflicts if any
git push --force-with-lease    # only on your feature branch

# 4) Merge (squash & merge), then clean up
git switch main
git pull --ff-only
git branch -d feat/profile-page
git push origin --delete feat/profile-page
```

---

## 18) Quick Reference

```bash
# Create & switch
git switch -c <branch>

# Track remote
git push -u origin <branch>

# Update your branch
git fetch origin
git rebase origin/main     # or: git merge origin/main

# Open PR on your platform (GitHub/GitLab/etc.)

# Merge strategy (on platform): merge | squash | rebase

# Clean up
git branch -d <branch>
git push origin --delete <branch>
```

---

## Summary

Branches are the foundation of safe, parallel work in Git. Choose a branching model that matches your release cadence, protect your default branch, keep changes small and reviewed, and prefer automation (CI/CD) to keep quality high. With clear naming, disciplined updates (merge or rebase), and a consistent PR process, teams can ship quickly **and** safely.
