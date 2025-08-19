---
title: Resolving Merge Conflicts
---

When working with Git, **merge conflicts** occur if two branches have made changes to the same part of a file or when Git cannot automatically reconcile differences between branches. Merge conflicts are a natural part of collaborative development and must be resolved manually before completing a merge.

---

## What is a Merge Conflict?

A merge conflict arises when Git tries to combine two sets of changes but cannot determine which version should be kept. For example, if two developers edit the same line in a file or if one edits a file while another deletes it, Git will raise a conflict.

---

## How Git Displays Conflicts

When a conflict occurs, Git stops the merge process and marks the conflicted file. Inside the file, Git inserts special markers that highlight the conflicting sections:

```diff
<<<<<<< HEAD
This is from the main branch
=======
This is from feature-login
>>>>>>> feature-login
```

* `<<<<<<< HEAD`
  Content from the branch you are merging **into** (often `main`).
* `=======`
  Separator between the two conflicting changes.
* `>>>>>>> feature-login`
  Content from the branch you are merging **from** (here: `feature-login`).

---

## Identifying Conflicted Files

After a conflict occurs, run:

```bash
git status
```

Conflicted files will be listed under **"Unmerged paths"**. These files must be resolved before Git can complete the merge.

---

## Steps to Resolve a Merge Conflict

1. **Open the conflicted file**
   Review the conflicting sections and decide how to reconcile them.
   Options include:

   * Keeping one side (e.g., `HEAD` or `feature-login`)
   * Combining changes from both sides
   * Writing a new solution that incorporates both perspectives

2. **Edit the file manually**
   Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and keep only the desired content.
   Example resolved file:

   ```text
   This is the final content after resolving the conflict.
   ```

3. **Stage the resolved file**

   ```bash
   git add filename
   ```

   This tells Git the conflict has been addressed.

4. **Commit the merge**

   ```bash
   git commit
   ```

   If the conflict arose during a merge, this commit finalizes the merge process. Git may provide a default commit message indicating the merge resolution.

---

## Practical Example

Imagine both branches modified the same `login.js` file:

* **`main` branch version:**

  ```javascript
  console.log("Logging in user...");
  ```

* **`feature-login` branch version:**

  ```javascript
  console.log("Authenticating user...");
  ```

After merging, Git inserts conflict markers:

```javascript
<<<<<<< HEAD
console.log("Logging in user...");
=======
console.log("Authenticating user...");
>>>>>>> feature-login
```

### Possible resolutions:

* Keep `main`:

  ```javascript
  console.log("Logging in user...");
  ```

* Keep `feature-login`:

  ```javascript
  console.log("Authenticating user...");
  ```
  
* Combine both:

  ```javascript
  console.log("Logging in and authenticating user...");
  ```

---

## Tools for Resolving Conflicts

* **Manual editing** (in a code editor or IDE)
* **Git GUI tools** (e.g., GitKraken, SourceTree, GitHub Desktop)
* **Editor integrations** (e.g., VS Code, IntelliJ, Vim with plugins)

These tools often provide visual interfaces to select which changes to keep or to merge lines interactively.

---

## Best Practices

* **Pull frequently** to reduce the chance of conflicts by keeping your branch up to date.
* **Keep commits small and focused**, which makes conflicts easier to resolve.
* **Communicate with your team** if you anticipate conflicts in critical files.
* **Use rebase carefully**: Rebasing can also introduce conflicts, but it helps maintain a cleaner commit history.

---

## Summary

* Merge conflicts occur when Git cannot automatically reconcile changes.
* Git marks conflicts with `<<<<<<<`, `=======`, and `>>>>>>>`.
* Resolve by editing files, removing conflict markers, staging changes, and committing.
* Use tools and best practices to minimize and simplify conflict resolution.

By understanding and practicing conflict resolution, developers ensure smoother collaboration and maintain a clean, functional codebase.
