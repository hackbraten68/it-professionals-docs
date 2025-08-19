---
title: Summary
---
### Summary

This table provides a quick overview of the **core concepts of GitHub Actions**. Each concept plays a distinct role in defining, triggering, and executing automation workflows.

| Concept  | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| Workflow | A **YAML file** that defines the automation process. Stored in `.github/workflows/`. |
| Event    | A **trigger** that starts a workflow. Examples: `push`, `pull_request`, `schedule`, or manual `workflow_dispatch`. |
| Job      | A **group of steps** executed together on a specific runner. Jobs can run in parallel or sequentially, depending on configuration. |
| Step     | A **single unit of work** inside a job, such as running a shell command or using an action. Steps run sequentially inside their job. |
| Action   | A **reusable piece of automation logic**, either from the GitHub Marketplace, the community, or custom-built by you. Simplifies workflows by packaging commands. |
| Runner   | The **execution environment** for jobs. It can be: <br> - GitHub-hosted (e.g., Ubuntu, Windows, macOS) <br> - Self-hosted (your own server or machine). |

---

### Detailed Breakdown

#### 1. Workflow

- Acts as the **blueprint** of automation.  
- Written in YAML format and placed under `.github/workflows/`.  
- Can include **multiple jobs**, each with its own steps.  
- Example: Continuous Integration pipeline that builds, tests, and deploys code.

#### 2. Event

- Defines **when** the workflow should run.  
- Types of events:
  - **Repository events**: `push`, `pull_request`, `release`, `issues`.
  - **Scheduled events**: Run on a cron schedule (`schedule`).
  - **Manual events**: Triggered with `workflow_dispatch`.
  - **External events**: Triggered by webhooks or APIs.

#### 3. Job

- Represents a **container of steps**.  
- Each job:
  - Runs on its own runner.  
  - Can have **dependencies** (`needs`) on other jobs.  
  - May run **in parallel** with other jobs to save time.  

Example:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building project"
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - run: echo "Running tests"
```

#### 4. Step

* The **building blocks** of a job.
* Executed **sequentially** in the order they are defined.
* Can be:

  * Shell commands (`run`)
  * Reusable actions (`uses`)

Example:

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
  - name: Install dependencies
    run: npm install
```

#### 5. Action

* Encapsulated logic that performs a specific task.
* Can be:

  * **Pre-built**: Found on the [GitHub Marketplace](https://github.com/marketplace?type=actions).
  * **Custom**: Written in JavaScript, Docker, or Composite YAML.
* Benefits:

  * Reusability
  * Simplified workflow files
  * Community sharing

Example:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18
```

#### 6. Runner

* The **machine** that executes jobs.
* Two main types:

  * **GitHub-hosted runners**: Automatically provisioned by GitHub.
  * **Self-hosted runners**: Your own infrastructure (server, VM, container).
* Runners provide the **execution context**, including OS, CPU, and tools.

---

### Key Takeaways

* **Workflow**: The overall automation design.
* **Event**: Defines *when* workflows start.
* **Job**: Groups of steps executed in isolation.
* **Step**: The smallest unit of execution.
* **Action**: Prebuilt or custom logic to simplify workflows.
* **Runner**: The environment where jobs are executed.

Together, these concepts form the **foundation of GitHub Actions**, enabling powerful automation for Continuous Integration (CI), Continuous Deployment (CD), and beyond.
