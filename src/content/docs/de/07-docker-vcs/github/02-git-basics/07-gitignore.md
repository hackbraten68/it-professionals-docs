---
title: .gitignore
---

A `.gitignore` file is used in Git projects to specify which files and directories should be ignored by Git. This means Git will not track changes to these files, and they will not be committed to the repository. Ignoring unnecessary or sensitive files helps keep the repository clean, secure, and efficient.

---

## Why Use a `.gitignore`?

1. **Exclude unnecessary files**  
   Prevent files such as temporary build outputs, logs, or editor-specific settings from cluttering the repository.

2. **Protect sensitive information**  
   Keep environment variables, API keys, and private configuration files (e.g., `.env`) out of version control.

3. **Improve performance**  
   Large directories like `node_modules/` or compiled binaries can drastically slow down Git operations. Ignoring them ensures faster performance.

4. **Maintain consistency across teams**  
   Using a shared `.gitignore` file helps all team members avoid accidentally committing files that should remain local.

---

## Structure of a `.gitignore` File

- Each line represents a pattern.
- Blank lines are ignored.
- Lines starting with `#` are treated as comments.
- Patterns can match individual files, directories, or groups of files using wildcards.

---

## Common Patterns

### Ignoring Directories

```bash
node_modules/
dist/
build/
```

* The trailing `/` indicates an entire directory should be ignored.

### Ignoring Specific Files

```bash
.env
config.json
```

* Useful for sensitive configuration files.

### Ignoring File Types

```bash
*.log
*.tmp
*.swp
```

* The `*` wildcard matches any number of characters, so `*.log` ignores all log files.

### Negating Rules

```bash
*.log
!important.log
```

* The `!` prefix means "do not ignore."
  In this example, all `.log` files are ignored except for `important.log`.

---

## Example `.gitignore` File

```bash
# Dependency directories
node_modules/
vendor/

# Build output
dist/
build/

# Environment variables
.env

# Logs
*.log

# Editor/IDE settings
.vscode/
.idea/
*.swp
```

---

## Global `.gitignore`

Sometimes, you want to ignore files across **all repositories** on your system, such as operating system files or editor caches.
You can create a **global gitignore**:

```bash
git config --global core.excludesfile ~/.gitignore_global
```

Then add rules inside `~/.gitignore_global`. Example:

```bash
# macOS
.DS_Store

# Windows
Thumbs.db

# Linux
*~
```

---

## Best Practices

1. **Keep `.gitignore` updated**: Adjust as your project evolves.
2. **Do not ignore critical files**: Ensure necessary configs and documentation are included in version control.
3. **Use templates**: GitHub maintains a collection of `.gitignore` templates for different languages and frameworks:
   [https://github.com/github/gitignore](https://github.com/github/gitignore)
4. **Share with the team**: Commit the `.gitignore` file so all collaborators benefit from consistent rules.

---

## Summary

* A `.gitignore` file prevents unwanted files and directories from being tracked by Git.
* It improves performance, security, and collaboration.
* Patterns can target directories, specific files, file types, or use negation rules.
* Both project-specific and global `.gitignore` files can be used.
* Following best practices helps maintain a clean and professional repository.
