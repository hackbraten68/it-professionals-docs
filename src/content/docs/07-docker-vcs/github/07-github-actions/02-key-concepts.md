---
title: Key Concepts of GitHub Actions
---
# Key Concepts of GitHub Actions

> A deep‑dive, classroom‑ready guide with clear structure, hands‑on examples, and best practices.

---

## What is GitHub Actions?

GitHub Actions is GitHub’s native automation platform for CI/CD and beyond. You define **workflows** in YAML that respond to **events** (like `push`, `pull_request`, or a manual button click) and run **jobs** with **steps** on **runners** (machines) to build, test, lint, release, deploy, or perform any scripted automation.

---

## 1) Core Building Blocks

### A. Workflow (YAML)

A **workflow** is a YAML file in `.github/workflows/` that declares triggers, jobs, and steps.

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

**Structure:**

* `on`: one or more events that trigger the workflow.
* `jobs`: one or more units of work.
* Each job has `runs-on`, a list of `steps`, and optional `strategy`, `needs`, `permissions`, etc.

---

### B. Event Triggers

Common triggers:

* `push`
* `pull_request`
* `schedule` (cron syntax; runs in UTC)
* `workflow_dispatch` (manual trigger with optional inputs)
* Others you’ll often use: `workflow_run`, `release`, `issues`, `pull_request_target` (security caveats), `pull_request_review`, `check_suite`, `repository_dispatch`.

**Examples:**

```yaml
on:
  push:
    branches: [ main ]
    paths: [ "src/**", ".github/workflows/**" ]
  pull_request:
    branches: [ main ]
    paths-ignore: [ "docs/**" ]
  schedule:
    - cron: "0 3 * * 1"   # Mondays at 03:00 UTC
  workflow_dispatch:
    inputs:
      env:
        description: "Environment to deploy"
        required: true
        type: choice
        options: [ staging, production ]
```

> **Tip:** Use `paths`/`paths-ignore` to avoid unnecessary runs in monorepos.

---

### C. Jobs

* **Parallel by default.** Use `needs:` to chain jobs or express dependencies.
* Each job can target **different OS** (`ubuntu`, `windows`, `macos`) and architectures.
* Jobs have their own environment; artifacts/outputs are the usual way to share data.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [ ... ]

  build:
    needs: test
    runs-on: ubuntu-latest
    steps: [ ... ]
```

---

### D. Runners

A **runner** executes your job.

* **GitHub‑hosted**: `ubuntu-latest`, `windows-latest`, `macos-latest`—managed, ephemeral, clean images.
* **Self‑hosted**: your own machines/containers (custom tools, private networks, GPUs, larger CPUs, etc.). Label them and target via `runs-on: [self-hosted, linux, x64]`.

> **Best practice:** Prefer GitHub‑hosted unless you need special hardware, network access, or custom images.

---

### E. Steps and Actions

A **step** is a single task in a job. Steps can:

* Run shell commands with `run`.
* Use reusable **actions** with `uses`.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
  - name: Install deps
    run: npm ci
  - name: Run tests
    run: npm test
```

> **Action sources:**
>
> * Official marketplace actions (pin by version or SHA for security).
> * Your custom **composite** or **Docker** actions (reusable across repos).

---

## 2) Strategy, Matrix, and Parallelization

Use `strategy.matrix` to fan out jobs across versions/OSes/architectures:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
        exclude:
          - os: windows-latest
            node: 16
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - run: npm ci
      - run: npm test
```

---

## 3) Variables, Contexts, and Outputs

### A. Variables & Env

* `env:` blocks define environment variables at workflow/job/step scope.
* Precedence: **step env** > **job env** > **workflow env**.

```yaml
env:
  CI: true

jobs:
  build:
    env:
      APP_ENV: staging
    steps:
      - name: Print
        run: echo "$CI / $APP_ENV"
```

### B. Contexts & Expressions

Use `${{ ... }}` to access contexts like `github`, `env`, `runner`, `job`, `steps`, `secrets`, `matrix`.

```yaml
- run: echo "Ref is ${{ github.ref }}; Actor is ${{ github.actor }}"
```

### C. Step & Job Outputs

* Give a step an `id`, then write to `$GITHUB_OUTPUT`:

```yaml
- id: compute
  run: echo "hash=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

- run: echo "Commit hash is ${{ steps.compute.outputs.hash }}"
```

* Job outputs are set from a step’s outputs and consumed via `needs.<job>.outputs.<name>`.

```yaml
jobs:
  build:
    outputs:
      image_tag: ${{ steps.meta.outputs.tag }}
    steps:
      - id: meta
        run: echo "tag=app-${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    steps:
      - run: echo "Deploying tag ${{ needs.build.outputs.image_tag }}"
```

---

## 4) Dependencies, Conditionals, and Flow Control

* `needs:` sets explicit job dependencies.
* `if:` controls whether a job/step runs.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [ ... ]

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && success()
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

Other handy flags:

* `continue-on-error: true` (don’t fail the job on step errors)
* `timeout-minutes: 10` (fail a job after a time limit)

---

## 5) Caching and Artifacts

### A. Caching (speed up installs)

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
```

> **Tip:** Keys must change when inputs change (lockfiles, tool versions) to avoid stale cache.

### B. Artifacts (share files between jobs or for download)

```yaml
- name: Upload build output
  uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/

# Later job:
- name: Download
  uses: actions/download-artifact@v4
  with:
    name: dist
    path: dist/
```

---

## 6) Service Containers & Dockerized Builds

Spin up databases or services for integration tests:

```yaml
jobs:
  itests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports: ["5432:5432"]
        options: >-
          --health-cmd="pg_isready -U postgres"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
    steps:
      - uses: actions/checkout@v4
      - run: psql -h localhost -U postgres -c "SELECT 1;"
        env: { PGPASSWORD: postgres }
```

Build and push container images (example only; wire real creds via OIDC or secrets):

```yaml
- name: Build
  run: docker build -t ghcr.io/owner/app:${{ github.sha }} .

- name: Login to GHCR
  run: echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin

- name: Push
  run: docker push ghcr.io/owner/app:${{ github.sha }}
```

---

## 7) Environments, Secrets, and Permissions

### A. Secrets & Variables

* Store **secrets** at repo/org level; reference via `secrets.MY_SECRET`.
* Use **variables** (non‑secret) for reusable strings.

```yaml
- run: echo "Using secret"
  env:
    TOKEN: ${{ secrets.MY_API_TOKEN }}
```

> **Masking:** Action logs automatically mask secret values.

### B. Environments & Protection Rules

* Use **environments** (`staging`, `production`) to gate deployments with required reviewers or wait timers.
* Assign environment‑scoped secrets.

```yaml
jobs:
  deploy:
    environment: production
    steps: [ ... ]
```

### C. Permissions (Least Privilege)

By default, `GITHUB_TOKEN` may have broad permissions. Restrict them:

```yaml
permissions:
  contents: read
  id-token: write   # needed for OIDC federation
  pull-requests: write
```

> **Security Caveat:** Avoid `pull_request_target` for untrusted forks unless you **lock down** what runs. Prefer `pull_request` for fork PRs.

### D. OIDC to Cloud Providers (Passwordless Deploys)

Use `permissions: id-token: write` plus a cloud‑side trust policy to exchange an OIDC token for temporary credentials (AWS/GCP/Azure). This avoids storing long‑lived cloud keys as repo secrets.

---

## 8) Reusable Workflows & Composite Actions

### A. Reusable Workflows (`workflow_call`)

Centralize CI logic and call it from many repos:

**Caller:**

```yaml
jobs:
  ci:
    uses: org/repo/.github/workflows/ci.yml@v1
    with:
      node-version: 20
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Callee (`.github/workflows/ci.yml`):**

```yaml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      NPM_TOKEN:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ inputs.node-version }} }
      - run: npm ci
      - run: npm test
```

### B. Composite Actions

Bundle steps as an action stored in a repo:

**`action.yml`:**

```yaml
name: "Setup & Test"
runs:
  using: "composite"
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    - run: npm ci
      shell: bash
    - run: npm test
      shell: bash
inputs:
  node-version:
    required: true
    default: "18"
```

Use it like:

```yaml
- uses: org/repo/.github/actions/setup-and-test@v1
  with:
    node-version: "20"
```

> **Pin by SHA** where possible: `@<commit-sha>` for stronger supply‑chain guarantees.

---

## 9) Concurrency, Queues, and Run Policies

Avoid overlapping runs for the same branch/PR:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This cancels stale runs when new commits arrive.

---

## 10) Observability & Debugging

* **Logs:** Each step outputs logs; click to expand in the UI.
* **Rerun failed jobs** directly from the run page.
* **Debug logging:** Set repository or secret `ACTIONS_STEP_DEBUG=true` to see more details.
* **Summaries:** Write rich Markdown to `$GITHUB_STEP_SUMMARY`.

```yaml
- name: Add summary
  run: |
    echo "## Test Summary" >> $GITHUB_STEP_SUMMARY
    echo "- Passed: 124" >> $GITHUB_STEP_SUMMARY
```

---

## 11) Common Workflow Patterns (End‑to‑End Examples)

### A. Node.js CI with Matrix + Cache

```yaml
name: Node CI
on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - uses: actions/cache@v4
        with:
          path: ~/.npm
          key: npm-${{ runner.os }}-${{ matrix.node }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: npm-${{ runner.os }}-${{ matrix.node }}-
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --ci
```

### B. Build → Package → Deploy with Approvals

```yaml
name: Build & Deploy
on:
  workflow_dispatch:
  push:
    branches: [ main ]

permissions:
  contents: read
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      tag: ${{ steps.meta.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - id: meta
        run: echo "tag=app-${GITHUB_SHA::7}" >> $GITHUB_OUTPUT
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: web
          path: dist/

  deploy:
    needs: build
    environment: production  # reviewers/approvals can be required here
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: web, path: dist/ }
      - name: Deploy
        run: ./scripts/deploy.sh dist/ "${{ needs.build.outputs.tag }}"
```

### C. Monorepo Path Filters

```yaml
on:
  pull_request:
    paths:
      - "packages/api/**"
      - ".github/workflows/api-*"
```

---

## 12) Security Hardening Checklist

* [ ] **Pin actions** by version or SHA (`@v4` or `@<sha>`).
* [ ] Set **least‑privilege** `permissions:` at workflow/job level.
* [ ] Prefer **`pull_request`** over `pull_request_target` for untrusted forks.
* [ ] Use **OIDC** for cloud deployments (no long‑lived credentials).
* [ ] Store secrets in **repo/org secrets**; never print them.
* [ ] Validate inputs to `workflow_dispatch` and `repository_dispatch`.
* [ ] Avoid running arbitrary code from PRs in privileged contexts.
* [ ] Keep runners ephemeral and patched (for self‑hosted).

---

## 13) Gotchas & Best Practices

* **Cron timezone:** `schedule` uses **UTC**. Convert if you expect local time.
* **Artifacts vs outputs:** Use artifacts for files/binaries; outputs for strings.
* **Cache keys:** Change when dependencies change; otherwise you risk stale cache.
* **Matrix explosion:** Keep combinations reasonable (`include`/`exclude`).
* **Long logs:** Collapse noisy steps or use summaries for highlights.
* **Self‑hosted runners:** Secure network, update images, isolate per repo if possible.
* **PRs from forks:** Treat as untrusted; don’t expose secrets or privileged steps.

---

## 14) Quick Reference (Cheatsheet)

**Trigger on manual run with input**

```yaml
on:
  workflow_dispatch:
    inputs:
      level:
        type: choice
        options: [ low, high ]
```

**Job needs + conditional**

```yaml
jobs:
  a: { ... }
  b:
    needs: a
    if: success() && github.ref == 'refs/heads/main'
```

**Set and read step output**

```yaml
- id: foo
  run: echo "val=42" >> $GITHUB_OUTPUT
- run: echo "${{ steps.foo.outputs.val }}"
```

**Concurrency**

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Cache**

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: pip-${{ runner.os }}-${{ hashFiles('**/requirements.txt') }}
```

**Upload artifact**

```yaml
- uses: actions/upload-artifact@v4
  with: { name: report, path: coverage/ }
```

**Service container**

```yaml
services:
  redis:
    image: redis:7
```

**Permissions minimal**

```yaml
permissions:
  contents: read
```

---

## Wrap‑Up

With **workflows**, **events**, **jobs**, **steps**, and **runners** as your foundation, you can model anything from simple CI to multi‑stage, protected, and secure deployments. Layer in **matrix builds**, **caching**, **artifacts**, **reusable workflows**, **environments**, and **OIDC** to scale efficiently and securely—while keeping configuration clean, modular, and auditable.
