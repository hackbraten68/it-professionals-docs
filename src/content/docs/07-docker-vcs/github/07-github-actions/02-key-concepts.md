---
title: Key Concepts of GitHub Actions
---
### 1. **Workflow**

A YAML file that defines the automation process. It consists of:

- **Triggers (events)** — e.g., `push`, `pull_request`
- **Jobs** — units of work to be executed
- **Steps** — commands or actions to be executed inside a job

Example:

```yaml
name: Example Workflow
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run a script
        run: echo "Hello from GitHub Actions!"
```

### 2. **Event Triggers**

Workflows can be triggered by events like:

- `push`
- `pull_request`
- `schedule` (CRON jobs)
- `workflow_dispatch` (manual trigger)

### 3. **Jobs**

Jobs run in parallel by default, unless defined otherwise. Each job can:

- Run on a different OS
- Use different environment variables
- Depend on other jobs

### 4. **Runners**

A runner is a server that runs your jobs. GitHub provides:

- Hosted runners: e.g., `ubuntu-latest`, `windows-latest`
- Self-hosted runners: for custom environments or on-premise usage

### 5. **Steps and Actions**

Steps are the individual tasks inside a job.

- You can use built-in commands, shell scripts, or reusable actions from the GitHub Marketplace.
- Example of using an action:

```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '18'
```
