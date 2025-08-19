---
title: Pull Requests (PRs)
---

A **Pull Request (PR)** is the main mechanism for proposing changes to a codebase hosted on GitHub (or other Git platforms). PRs allow developers to review, discuss, and merge changes from one branch into another (commonly into the `main` or `master` branch). They are at the heart of collaborative development and ensure that code is reviewed and improved before becoming part of the main project.

---

## Why Pull Requests Matter

- **Collaboration:** PRs create a space for developers to discuss changes before they are merged.
- **Code Quality:** Review processes help catch bugs, improve readability, and maintain coding standards.
- **Transparency:** Every change is documented with commit history, comments, and discussions.
- **Traceability:** Issues, tasks, and discussions can be linked directly to PRs.

---

## Typical Pull Request Workflow

1. **Create a Branch**
   - Work on a feature, bug fix, or improvement in a separate branch.

```bash
   git checkout -b feature/user-auth
```

2. **Commit and Push Changes**

   * Add your changes and push them to the remote repository.

   ```bash
   git add .
   git commit -m "Add user authentication feature"
   git push origin feature/user-auth
   ```

3. **Open a Pull Request**

   * On GitHub, click **Compare & pull request**.
   * Select the base branch (usually `main`) and the compare branch (your feature branch).
   * Add a **title** and a **detailed description** of the changes.
   * Assign reviewers and link issues if relevant.

4. **Review and Discussion**

   * Team members review the code, suggest improvements, and ask clarifying questions.
   * Code can be updated by pushing new commits to the same branch, which automatically updates the PR.

5. **Approval and Merge**

   * Once approved, the PR can be merged into the main branch.
   * Merge strategies include:

     * **Merge commit** (keeps full history)
     * **Squash and merge** (combines commits into one)
     * **Rebase and merge** (applies commits on top of base branch)

---

## Good PR Practices

* **Clear Descriptions:** Explain what the PR does, why it’s needed, and how it was implemented.
* **Link Issues:** Reference issues with keywords like `Closes #12` or `Fixes #45` to automatically close them when the PR is merged.
* **Small and Focused PRs:** Limit the scope of changes to make reviews faster and easier.
* **Meaningful Titles:** Summarize changes in a concise and descriptive way.
* **Request Reviews:** Assign teammates for feedback and approval.
* **Update Documentation and Tests:** If applicable, include updates to docs or tests so the project remains consistent.

---

## Example: Creating a PR

```bash
# Step 1: Push your branch to GitHub
git push origin feature/my-feature

# Step 2: On GitHub, click "Compare & pull request"
# Step 3: Add title, description, and assign reviewers
# Step 4: Submit the PR
```

---

## Benefits of Pull Requests

* **Improved collaboration** between team members
* **Consistent coding standards** through enforced reviews
* **Reduced bugs** via peer review and testing
* **Better knowledge sharing** across the team
* **Clear project history** with context-rich discussions

---

## Summary

Pull Requests are more than just a way to merge code — they are a structured process for **collaboration, quality assurance, and project documentation**. Following good PR practices helps ensure smoother workflows, stronger teamwork, and more reliable software.
