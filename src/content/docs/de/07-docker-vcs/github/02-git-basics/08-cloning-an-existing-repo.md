---
title: Cloning an Existing Repo
---
Cloning a repository means making a full local copy of an existing project from a remote source.  
This is one of the most common ways to start working with a project that is hosted on a platform like **GitHub**, **GitLab**, or **Bitbucket**.

---

## What Does "Cloning" Mean?

When you **clone** a repository, Git downloads:

- All project files and folders.
- The complete commit history.
- Branches and tags.
- Remote connection information (so you can easily pull updates or push changes later).

This ensures you have everything you need to work offline and collaborate effectively.

---

## How to Clone with Git (Command Line)

The basic syntax is:

```bash
git clone <repository-url>
```

### Example:

```bash
git clone https://github.com/user/repo.git
```

### Steps Explained:

1. **Find the repository URL**
   On GitHub or GitLab, click the green **"Code"** button and copy the HTTPS or SSH URL.

2. **Run the command**
   Paste the URL into the `git clone` command in your terminal.

3. **Navigate into the project**
   After cloning, Git creates a folder with the repository’s name.

   ```bash
   cd repo
   ```

4. **Check the remote connection**

   ```bash
   git remote -v
   ```

   This shows the link to the original repository (usually called `origin`).

---

## Using SSH vs HTTPS

* **HTTPS**:
  Easier for beginners, requires entering a username/password or a personal access token when pushing changes.
  Example:

  ```bash
  git clone https://github.com/user/repo.git
  ```

* **SSH**:
  Requires setting up SSH keys, but provides secure, password-less authentication.
  Example:

  ```bash
  git clone git@github.com:user/repo.git
  ```

---

## Cloning with GitHub Desktop (GUI Option)

For users who prefer a graphical interface instead of the terminal:

1. Install [GitHub Desktop](https://desktop.github.com/).
2. Open GitHub Desktop and go to **File → Clone Repository**.
3. Enter the repository URL or choose from your GitHub account.
4. Select a local folder where the repository will be saved.
5. Click **Clone** to download the project.

**Advantages of GitHub Desktop:**

* No need to remember Git commands.
* Visual overview of commits, branches, and changes.
* Easier for beginners to get started.

---

## Verifying Your Clone

After cloning, you can run:

```bash
git status
```

This checks your local working directory. At this point, it should say:

```bash
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

This means the project is properly cloned and synchronized with the remote repository.

---

## Summary

* **Cloning** copies an entire remote repository (code + history) to your local machine.
* You can use either **command line Git** or tools like **GitHub Desktop**.
* After cloning, you are ready to explore the project, make changes, and collaborate with others.
