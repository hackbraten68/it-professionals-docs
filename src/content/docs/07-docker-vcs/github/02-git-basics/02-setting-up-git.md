---
title: Setting Up Git
---
# Setting Up Git

Before you can start working with Git, you need to **install** it on your system and perform some **initial configuration**. This setup ensures that Git works correctly across all your projects and associates your work with your identity.

---

## 1. Installing Git

Git can be installed on all major operating systems. The method depends on your platform:

### Windows

* Download the installer from the official website:
  [https://git-scm.com/download/win](https://git-scm.com/download/win)
* Run the installer and follow the prompts.
* The installer also gives you the option to install **Git Bash**, a terminal emulator with UNIX-like commands that is very useful for working with Git on Windows.

### macOS

* If you use **Homebrew** (a popular package manager), run:

  ```bash
  brew install git
  ```

* Alternatively, you can install Xcode Command Line Tools, which includes Git:

  ```bash
  xcode-select --install
  ```

### Linux

* Use your system’s package manager. For example:

  * Debian/Ubuntu:

    ```bash
    sudo apt update
    sudo apt install git
    ```

  * Fedora:

    ```bash
    sudo dnf install git
    ```

  * Arch Linux:

    ```bash
    sudo pacman -S git
    ```

> ✅ **Tip:** To verify the installation, open a terminal and run:
>
> ```bash
> git --version
> ```
>
> This will print the installed version of Git.

---

## 2. Initial Configuration

After installation, you need to configure Git with your personal information. These settings are used for commit metadata and help identify who made changes to the codebase.

### Set Your Name and Email

Run the following commands (replace with your actual name and email):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

* `user.name`: This will appear as the author of your commits.
* `user.email`: This email will be linked to your commits. If you use GitHub or GitLab, it should match the email address registered with your account.

### Other Useful Configurations

* Set your default text editor (example: VS Code):

  ```bash
  git config --global core.editor "code --wait"
  ```

* Enable colored output for better readability:

  ```bash
  git config --global color.ui auto
  ```

---

## 3. Checking Your Configuration

You can view your current configuration with:

```bash
git config --list
```

Or check specific values:

```bash
git config user.name
git config user.email
```

---

## 4. Local vs. Global Configuration

* **Global** (`--global`): Applies the setting for your entire system (all repositories).
* **Local**: Without `--global`, the configuration applies only to the current repository.
* **System**: With `--system`, the configuration applies to all users on the machine.

For example, to set a repository-specific email:

```bash
git config user.email "project-specific@example.com"
```

---

## 5. Next Steps

Once Git is installed and configured, you are ready to:

* Initialize a new repository with `git init`.
* Clone an existing repository with `git clone <url>`.
* Start tracking changes, making commits, and collaborating with others.

---

👉 With this setup, you have a solid foundation to begin using Git effectively.
