---
title: Deleting Branches
---
# Deleting Branches

Cleaning up branches is a key part of keeping a Git repository tidy and easy to navigate. This guide explains when and how to delete branches—locally and on remotes—plus safety checks, recovery options, and automation tips.

---

## Why delete branches?

* **Reduce clutter:** Fewer stale branches in `git branch -a` and in your remote UI.
* **Signal completion:** Deleting a feature branch communicates that work is finished and merged.
* **Avoid mistakes:** Old branches can confuse collaborators or hide outdated work.

---

## Prerequisites & terminology

* **Local branch:** Lives only in your local clone (e.g., `feature-login`).
* **Remote branch:** Lives on a remote server (e.g., `origin/feature-login`).
* **Tracking branch:** Your local branch that tracks a remote branch (e.g., local `feature-login` tracking `origin/feature-login`).

> You cannot delete the branch you’re currently on. Check out another branch first (e.g., `git switch main`).

---

## Deleting a local branch

### Safe delete (only if merged)

```bash
git branch -d feature-login
```

* Fails with a warning if `feature-login` is not fully merged into your current branch (typically `main`).
* Use when you’re confident the branch has been merged via PR or a clean merge.

### Force delete (even if unmerged)

```bash
git branch -D feature-login
```

* `-D` is short for `--delete --force`.
* Use with caution: you may lose unmerged work (recoverable via reflog if needed, see **Recovery**).

### Common errors

* **“error: Cannot delete branch 'X' checked out at '…'”**
  Switch to another branch first:

  ```bash
  git switch main
  git branch -d X
  ```
  
* **“The branch 'X' is not fully merged.”**
  Either merge it or use `-D` if you’re sure.

---

## Deleting a remote branch

### Using the modern syntax

```bash
git push origin --delete feature-login
```

### Legacy equivalent (still works)

```bash
git push origin :feature-login
```

**Notes**

* Deleting the remote branch does **not** delete your local branch automatically.
* You typically cannot delete the remote’s **default branch** (e.g., `main`) and may be blocked by branch protection rules.

---

## Cleaning up local references to deleted remote branches

After a remote branch is deleted, your local clone may still show `origin/feature-login` until you prune:

```bash
git fetch --prune
# or shorter:
git fetch -p
```

You can also prune while listing:

```bash
git remote prune origin
```

---

## Verify before deleting

### List merged branches into your current branch

```bash
git branch --merged
```

### List branches not yet merged

```bash
git branch --no-merged
```

> Best practice: Delete only branches visible in `--merged` unless you intentionally force-delete.

---

## Typical workflow (feature branch)

1. Update main and merge feature (or complete PR):

   ```bash
   git switch main
   git pull
   git merge --no-ff feature-login   # or merge via PR on your platform
   ```

2. Delete local branch:

   ```bash
   git branch -d feature-login
   ```

3. Delete remote branch:

   ```bash
   git push origin --delete feature-login
   ```

4. Prune stale references:

   ```bash
   git fetch -p
   ```

---

## Recovering an accidentally deleted branch

If you deleted locally:

1. Find the last commit (via reflog):

   ```bash
   git reflog
   # Note the commit hash for the branch tip
   ```

2. Recreate the branch at that commit:

   ```bash
   git branch feature-login <commit-hash>
   ```

3. (Optional) Re-publish to the remote:

   ```bash
   git push -u origin feature-login
   ```

If you deleted on the remote but still have the branch locally:

```bash
git push -u origin feature-login
```

If both local and remote are gone and you don’t know the commit:

* Search reflogs (`git reflog`) across machines used for the work.
* Check the PR merge commit; you might cherry-pick or branch from it if needed.

---

## Protected and default branches

* **Default branch** (e.g., `main`) is usually protected and cannot be deleted from the server UI or via push.
* **Branch protection rules** may prevent deletion or require reviews/status checks. Adjust settings in your platform (GitHub/GitLab/Bitbucket) if necessary.

---

## Deleting via Git hosting UIs

Most platforms provide a “Delete branch” button on a merged pull/merge request. This:

* Deletes the remote branch.
* Does **not** delete local clones—developers still need to prune or delete locally.

---

## Bulk cleanup: delete all local branches merged into `main`

> **Careful:** Review the list before executing destructive commands.

**Preview what would be deleted:**

```bash
git checkout main
git fetch -p
git branch --merged main | egrep -v "^\*|main|master|develop"
```

**Delete them (UNIX shell):**

```bash
git branch --merged main \
  | egrep -v "^\*|main|master|develop" \
  | xargs -n 1 git branch -d
```

To include unmerged branches (risky), change `-d` to `-D`.

---

## Housekeeping tips

* **Name clearly:** Use prefixes like `feat/`, `fix/`, `chore/` to make cleanup safer with patterns.
* **Delete after merge:** Make it part of your PR checklist.
* **Automate reminders:** Periodically run `git fetch -p` and prune stale branches.
* **Avoid long‑lived feature branches:** Prefer small, frequent merges to reduce conflicts and cleanup load.

---

## FAQ

**Q: Do I need to delete both local and remote branches?**
**A:** Yes—if you used both. Deleting the remote doesn’t remove your local branch (and vice versa).

**Q: Can I delete the branch I’m on?**
**A:** No. Switch to another branch first.

**Q: What’s the difference between `-d` and `-D`?**
**A:** `-d` deletes **only if merged**. `-D` force-deletes regardless of merge status.

**Q: Will deleting a branch remove the commits?**
**A:** Commits reachable from other references (e.g., `main`) remain. If the commits exist **only** on that branch, you risk losing access unless you recover via reflog.

**Q: How do I see what remote branches exist?**
**A:** `git branch -r` (remote only) or `git branch -a` (all).

---

## Quick reference (copy/paste)

```bash
# Delete local (safe)
git branch -d <branch>

# Delete local (force)
git branch -D <branch>

# Delete remote
git push origin --delete <branch>
# or
git push origin :<branch>

# Prune stale remote refs
git fetch -p

# Check merged vs unmerged
git branch --merged
git branch --no-merged

# Recover via reflog
git reflog
git branch <branch> <commit>
```

---

With these practices, your repositories will stay clean, understandable, and safer to collaborate in.
