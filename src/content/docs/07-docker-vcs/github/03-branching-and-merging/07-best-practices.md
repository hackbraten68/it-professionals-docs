---
title: Best Practices
---
# Best Practices

A practical, opinionated guide for collaborating with Git and remote platforms (GitHub/GitLab). Use this as a reference and a checklist during daily work.

---

## Why Best Practices Matter

* **Consistency:** Teams move faster when conventions are predictable.
* **Traceability:** Clear branches, commits, and PRs make it easy to review and debug.
* **Safety:** Guardrails (PRs, CI, protected branches) prevent costly mistakes.

---

## Branch Naming Conventions

Use descriptive, scoped names. Prefer lowercase with slashes and hyphens.

**Format**

```php
<type>/<scope>-<short-summary>
```

**Examples**

* `feature/auth-oauth2`
* `bugfix/login-issue-500-on-empty-pw`
* `chore/deps-bump-axios-1-7`
* `docs/readme-installation`

**Tips**

* Keep it under \~50 characters if possible.
* Avoid spaces and special characters.
* Include an issue ID when available: `feature/1234-auth-oauth2`.

---

## Keep Branches Short-Lived

Long-running branches drift, causing heavy conflict resolution later.

* Aim for **1–5 days** of work per branch.
* Prefer a sequence of small PRs over a single massive change.
* Use **feature flags** for incremental delivery when changes are large.

---

## Pull the Latest Changes Before Merging

Keep your work in sync with the mainline to minimize conflicts.

**Basic sync**

```bash
# From your feature branch:
git fetch origin
git merge origin/main
# or (if your team prefers rebase for a cleaner history):
git rebase origin/main
```

**When to rebase vs. merge**

* **Rebase** before opening a PR to create a clean, linear history.
* **Merge** for integrating reviewed PRs into protected branches.
* Never rebase **public** (already-pushed, shared) branches unless your team agrees.

---

## Use Pull Requests (PRs) for Review

PRs are the hub for discussion, quality checks, and visibility.

**Before opening a PR**

* Ensure branch is up-to-date with `main`.
* Pass all tests locally.
* Squash or curate commits into meaningful units.

**Opening a PR**

* **Title:** concise and action-oriented.
* **Description:** include context, motivation, screenshots, and testing steps.
* **Scope:** small and focused (\~200–400 lines changed is a good target).
* **Link issues:** “Closes #123” to auto-close on merge.
* **Labels:** help triage (e.g., `feature`, `bug`, `security`).

**During review**

* Respond to every comment (resolve or explain).
* Prefer code changes over long debates; push an update and explain.
* Be respectful, specific, and constructive.

**Merging**

* Use **squash merge** for small PRs to keep history clean.
* Use **merge commit** for larger multi-commit PRs that matter historically.
* Avoid **force-push** after reviews unless you notify reviewers.

---

## Commit Message Guidelines

Good commits tell a story of *why* and *what*.

**Style**

* **Subject line:** ≤ 72 chars, imperative mood (“Add”, not “Added”).
* **Body:** explain the motivation, approach, and trade-offs.
* **Reference:** include issue IDs.

**Examples**

```sql
Fix login redirect loop on expired sessions

The session check ran after router guards, causing an infinite redirect
when tokens expired. Moved validation into the guard and added a test.

Closes #456.
```

```sql
Add OAuth2 PKCE flow for mobile clients

Implements code verifier/challenge generation and token exchange.
Includes config docs and integration tests for the token endpoint.

Refs #789.
```

---

## Keep PRs Small and Focused

* One logical change per PR (feature, bugfix, refactor).
* Avoid mixing refactors and feature changes—review becomes harder.
* If a PR grows too big, split it:

  * **Prep PRs:** pure refactors/moves.
  * **Feature PR:** the actual change.

---

## Testing and CI

Automate quality gates.

* **Pre-commit hooks:** lint/format/tests (e.g., Husky, pre-commit).
* **CI checks:** run unit/integration tests, linting, type checks, security scans.
* **Required checks:** configure protected branches so PRs can’t merge while red.
* Add **repro steps** for bugs and **test coverage** for fixes.

---

## Handling Merge Conflicts Gracefully

* Pull/rebase frequently to reduce conflict size.
* Resolve conflicts **locally** with context, then run the full test suite.
* If conflict resolution is non-trivial, **pair review** the resolution commit.
* Never commit conflict markers:

  ```bash
  <<<<<<< HEAD
  =======
  >>>>>>> other-branch
  ```

---

## Protected Branches & Permissions

* Protect `main`/`release/*` branches:

  * Require PR reviews (≥1–2 reviewers).
  * Require green CI.
  * Disallow force-push and direct commits.
* Use **CODEOWNERS** for critical areas to route reviews to the right people.

---

## Release Hygiene

* **Tags:** create annotated tags for releases.

  ```bash
  git tag -a v1.4.0 -m "Release 1.4.0"
  git push origin v1.4.0
  ```

* **Changelog:** human-readable changes since last release (auto-generate if possible).
* **Release branches:** `release/1.4.x` for stabilization; cherry-pick urgent fixes.

---

## Documentation & Developer UX

* Update **README/Docs** when behavior or APIs change.
* Add **migration notes** for breaking changes.
* Include **examples** and **env samples** (`.env.example`).

---

## Security & Secrets

* Never commit secrets; use vaults or platform secrets.
* Add common secret patterns to `.gitignore`.
* Rotate credentials if exposure is suspected.
* Run dependency vulnerability checks (e.g., `npm audit`, `pip-audit`, Snyk).

---

## Collaboration Etiquette

* Prefer **async communication** in PRs and issues; summarize decisions.
* Use **draft PRs** for early feedback.
* Be explicit about **ownership** and **handoffs**.
* When stuck >30–60 minutes, **ask for help** with context and what you tried.

---

## Example Daily Workflow

```bash
# 1) Sync local main
git checkout main
git pull origin main

# 2) Create a focused branch
git checkout -b feature/auth-oauth2

# 3) Work with small commits; run tests
git add .
git commit -m "Add PKCE helper and token exchange"
npm test

# 4) Keep in sync
git fetch origin
git rebase origin/main

# 5) Push and open a PR
git push -u origin feature/auth-oauth2
# Open PR with clear title/description, link issue, mark as draft if WIP

# 6) Address review; keep commits clean
git commit --fixup <sha>  # optional; later squash on merge

# 7) Merge through the platform once CI is green and reviews are approved
# Choose squash/merge based on team policy

# 8) Clean up
git checkout main
git pull origin main
git branch -d feature/auth-oauth2
git push origin --delete feature/auth-oauth2
```

---

## Do / Don’t

**Do**

* Use descriptive branches and commits.
* Sync frequently (`fetch` + `rebase/merge`).
* Keep PRs small and focused.
* Enforce CI and reviews on protected branches.
* Document user-facing changes.

**Don’t**

* Force-push shared branches without alignment.
* Mix refactors with features in one PR.
* Merge red (failing) CI.
* Leave PR feedback unresolved.
* Commit secrets or local artifacts.

---

## Quick Checklist (Paste into PR Template)

* [ ] Branch name follows convention
* [ ] Small, focused scope
* [ ] Up-to-date with `main` (rebased/merged)
* [ ] Tests added/updated and passing
* [ ] Lint/type/security checks passing
* [ ] Docs/README updated (if applicable)
* [ ] Screenshots/recordings added (UI changes)
* [ ] Linked issues (Closes/Refs)
* [ ] Reviewers requested / CODEOWNERS satisfied

---

## Team Policy Add‑Ons (Optional)

* **Conventional Commits:** `feat:`, `fix:`, `chore:`, enables automated changelogs.
* **Trunk-Based Development:** tiny PRs to `main` with feature flags.
* **WIP Limits:** cap concurrent branches/PRs to reduce context switching.

---

## Final Notes

These guidelines are meant to be **practical**. If a rule slows you down without improving quality, propose an adjustment—then document the decision so the whole team benefits.
