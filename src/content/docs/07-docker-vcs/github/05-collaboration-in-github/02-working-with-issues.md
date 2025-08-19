---
title: Working with Issues
---

GitHub **Issues** are a powerful tool for tracking tasks, bugs, and feature requests. They serve as the central hub for discussions about your project’s progress and help teams stay organized.

---

## Why Use Issues?

- **Track bugs:** Report problems in the codebase.
- **Plan features:** Document new functionality you want to add.
- **Assign tasks:** Make responsibilities clear within the team.
- **Enable collaboration:** Facilitate discussions directly tied to the project.
- **Maintain transparency:** Everyone can see what is being worked on.

---

## Creating an Issue

When you notice a bug, think of a new feature, or want to raise a question, you can create an Issue.

**Steps to create a new Issue:**

1. Navigate to the **"Issues"** tab of your repository.
2. Click **"New issue"**.
3. Enter a **descriptive title** and a **detailed description** of the problem or feature.
4. Add optional metadata:
   - **Assign** the issue to one or more team members.
   - **Add labels** (e.g., `bug`, `enhancement`, `help wanted`).
   - **Link to milestones** if the issue should be completed by a specific release.
5. Click **Submit new issue**.

---

## Managing Issues

- **Assigning Members:** Make sure each issue has a responsible owner.
- **Using Labels:** Organize issues by categories such as:
  - `bug`: For errors or broken functionality.
  - `enhancement`: For improvements or new features.
  - `documentation`: For tasks related to docs.
  - `help wanted` / `good first issue`: To encourage community contributions.
- **Milestones:** Group issues together under a milestone to track progress toward larger goals.
- **Comments & Discussions:** Team members can comment on issues to propose solutions, ask clarifying questions, or provide updates.

---

## Linking Issues to Code

One of GitHub’s strengths is linking Issues directly with code changes:

- **Commits:** Reference an issue in your commit message using `#issue-number`.  
  Example:  
  ```bash
  git commit -m "Fix login error #42"
```

This automatically links the commit to Issue #42.

* **Pull Requests:** Mention issues in the PR description.
  Example:

  ```bash
  Fixes #42
  ```

  When the PR is merged, Issue #42 will automatically close.

---

## Best Practices

* **Be descriptive:** Write clear titles and detailed descriptions.
* **Keep it organized:** Use labels and milestones to manage complexity.
* **Reference code:** Always connect issues to commits and PRs when relevant.
* **Close when resolved:** Ensure issues are closed once the task is completed.
* **Encourage collaboration:** Use comments to involve the team and external contributors.

---

## Example Workflow

1. A tester discovers a bug and creates a new Issue labeled `bug`.
2. The team lead assigns the issue to a developer.
3. The developer creates a branch, fixes the bug, and pushes the changes.
4. In the commit message and PR, the developer references the issue number.
5. The PR is reviewed and merged, automatically closing the issue.
6. The issue history remains for documentation and future reference.

---

## Conclusion

Issues are the backbone of project management in GitHub. They help teams stay **organized**, **transparent**, and **collaborative**. By using labels, assignments, milestones, and linking code, you create a clear and efficient workflow that keeps your project moving forward.
