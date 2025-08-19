---
title: Undoing Changes
---

Working with Git involves constant changes, and sometimes you may want to undo or adjust those changes. Git provides several commands to **unstage files**, **discard changes**, and even **revert commits**. It is important to understand the difference between these operations to avoid accidentally losing valuable work.

---

## 1. Unstaging Files

If you have added a file to the staging area using `git add`, but later decide you don’t want to include it in your next commit, you can **unstage** it.

### Command

```bash
git reset filename
```

### Explanation

* This removes the file from the **staging area**, but it does not delete or modify the file itself in your working directory.
* The file will remain with your local changes; it just won’t be committed until you add it again.

### Example

```bash
git add report.txt
git reset report.txt
```

In this case, `report.txt` is no longer staged for commit, but your edits are still present.

---

## 2. Discarding Local Changes (Working Directory)

If you made changes to a file but decide you want to throw away those changes and return to the last saved version in Git:

### Command

```bash
git checkout -- filename
```

### Explanation

* This **overwrites** the file in your working directory with the version from the most recent commit (HEAD).
* Any unsaved local edits to that file will be **lost permanently**.
* Use this only when you are sure you do not need the changes anymore.

### Example

```bash
git checkout -- style.css
```

Now, `style.css` will be restored to its last committed state.

---

## 3. Undoing Commits (Going Further)

Beyond unstaging or discarding changes, sometimes you need to undo an actual commit. Two common commands are:

### `git revert`

```bash
git revert <commit-hash>
```

* Creates a new commit that **reverses the changes** introduced by the specified commit.
* Safe to use in **shared repositories** because it does not change history.

### `git reset`

```bash
git reset --soft <commit-hash>
git reset --hard <commit-hash>
```

* **Soft reset**: Moves the branch pointer back, but keeps changes staged.
* **Hard reset**: Moves the branch pointer back and discards all changes in staging and working directory.
* Not recommended for shared branches, as it rewrites history.

---

## 4. Best Practices When Undoing Changes

* Use `git reset filename` if you only want to unstage a file without losing work.
* Use `git checkout -- filename` carefully—this **permanently deletes** local edits.
* Prefer `git revert` over `git reset` when collaborating in a team to avoid rewriting history.
* Always double-check with `git status` before discarding or undoing changes.

---

## Summary

* **Unstage a file:**

  ```bash
  git reset filename
  ```

  Removes the file from the staging area, keeps changes.

* **Discard local changes:**

  ```bash
  git checkout -- filename
  ```

  Restores the last committed version, discards edits.

* **Undo commits:**

  * `git revert` → Safe, creates a new commit reversing changes.
  * `git reset` → Rewrites history, use with caution.

Understanding these commands helps you recover from mistakes and manage your project history more safely and effectively.
