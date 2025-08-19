---
title: Setting up GitHub
---

## 3. Setting Up GitHub

Before you can collaborate on projects or push your code to GitHub, you need to set up both a GitHub account and Git on your local machine. The following steps will guide you through the process.

---

### Step 1: Create a GitHub Account

1. **Visit the GitHub website**: [https://github.com](https://github.com)  
2. **Click "Sign up"** and follow the registration process:
   - Enter your **email address**.  
   - Choose a **unique username** and a **strong password**.  
   - Verify your email to activate the account.  
3. After completing the setup, you can log in to your **GitHub Dashboard**, where you will manage repositories, organizations, and collaboration settings.

> **Tip:** Use a professional username (e.g., `firstname-lastname` or `dev-username`) if you plan to showcase your GitHub profile to employers or clients.

---

### Step 2: Install Git

To work with GitHub, you must have **Git** installed locally. Git is the version control tool that communicates with GitHub.  

- **Windows**: Download and install Git from [https://git-scm.com/download/win](https://git-scm.com/download/win).  
  - During installation, you can use the default settings, but make sure to allow Git to be added to your PATH.  
- **macOS**: Install Git using **Homebrew** (if installed) with:  

  ```bash
  brew install git
    ```

Alternatively, Git may already be available by default on macOS. You can check with:

```bash
git --version
```

* **Linux (Debian-based)**: Use `apt` to install Git:

  ```bash
  sudo apt update
  sudo apt install git
  ```

After installation, confirm it works by running:

```bash
git --version
```

---

### Step 3: Configure Git

Before connecting to GitHub, you should configure your identity in Git. This information will be attached to your commits.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

* `user.name`: Your display name (e.g., `Jane Doe`).
* `user.email`: The email linked to your GitHub account.

To verify your settings:

```bash
git config --list
```

---

### Step 4: (Optional) Set Up SSH for Authentication

While HTTPS is commonly used, **SSH keys** offer a more secure and convenient way to connect with GitHub (avoiding repeated password prompts).

1. Generate a new SSH key:

   ```bash
   ssh-keygen -t ed25519 -C "you@example.com"
   ```

2. Add the SSH key to your system’s SSH agent:

   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```
   
3. Copy the public key to GitHub:

   * Go to **GitHub → Settings → SSH and GPG keys → New SSH key**
   * Paste the contents of `~/.ssh/id_ed25519.pub`

Test the connection:

```bash
ssh -T git@github.com
```

---

### Step 5: (Optional) Configure GitHub CLI

GitHub also provides the **GitHub CLI (`gh`)** tool, which allows you to manage repositories and pull requests directly from the terminal.

* Install the CLI: [https://cli.github.com](https://cli.github.com)
* Authenticate with GitHub:

  ```bash
  gh auth login
  ```

---

### Summary

* You created a **GitHub account** for managing repositories online.
* You installed **Git** locally to track changes and connect to GitHub.
* You configured Git with your **name and email**.
* (Optional) You can set up **SSH keys** or use the **GitHub CLI** for enhanced workflows.

With this setup complete, you’re ready to **create repositories, push code, and collaborate** on GitHub projects.
