---
title: What are Tags?
---
# What Are Git Tags? — A Complete, Practical Guide

Git **tags** are immutable labels that point to specific commits. They’re most often used to mark **releases** (e.g., `v1.0.0`, `v2.1.0-beta`) so you can reliably reference and reproduce a known state of your codebase.

---

## Why Use Tags?

* **Release management:** Freeze a commit as a version (e.g., for packaging, deployment).
* **Auditability & reproducibility:** Always return to the exact code that shipped.
* **Communication:** Make important milestones discoverable to your team and CI/CD.
* **Tooling integration:** Most release tooling (GitHub/GitLab Releases, changelog generators, package registries) centers around tags.

---

## Tag Types

### 1) Lightweight Tags

* Think of them as **bookmarks**: just a name → commit hash.
* No metadata (no tagger, date, message).
* Quick to create.

```bash
git tag v1.0.0
```

### 2) Annotated Tags

* A full **tag object** stored in Git’s database.
* Includes **tagger name, email, date, message** (and optionally a GPG signature).
* Preferred for releases.

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

> **Recommendation:** Use **annotated tags** for anything public or release-related. They carry useful metadata and are better supported by tools (e.g., `git describe`).

---

## Creating Tags

### Tag the current `HEAD`

```bash
# Lightweight
git tag v1.0.0

# Annotated
git tag -a v1.0.0 -m "Release v1.0.0"
```

### Tag a specific commit (by hash or ref)

```bash
git tag -a v1.0.0 3f1c2a9 -m "Release v1.0.0 at commit 3f1c2a9"
```

### Signed (GPG) annotated tag

```bash
git tag -s v1.0.0 -m "Release v1.0.0 (signed)"
# later
git tag -v v1.0.0   # verify signature
```

> Configure GPG once (keys, `user.signingkey`, etc.) if you want signed tags for authenticity.

---

## Inspecting & Finding Tags

### List all tags

```bash
git tag
```

### Filter & sort

```bash
git tag --list "v1.*"
git tag --sort=-version:refname       # sort by semantic version descending
git tag --sort=creatordate            # by tag creation date
```

### Show tag details (message, tagger, target)

```bash
git show v1.0.0
```

### Describe current commit with the nearest tag

```bash
git describe --tags
```

---

## Pushing & Fetching Tags

> Tags **are not pushed by default** with normal `git push`. Choose one of the following:

### Push a single tag

```bash
git push origin v1.0.0
```

### Push all local tags

```bash
git push --tags
```

### Push only tags that annotate commits you’re pushing

```bash
git push --follow-tags
```

### Fetch tags from remote

```bash
git fetch --tags
```

---

## Deleting & Moving Tags (Careful!)

### Delete a local tag

```bash
git tag -d v1.0.0
```

### Delete a remote tag (two correct options)

```bash
git push origin --delete v1.0.0
# or
git push origin :refs/tags/v1.0.0
```

> **Note:** Deleting or “retagging” a published version can break consumers. Prefer creating a **new** tag (e.g., `v1.0.1`) if you need to correct a release.

### Move (retarget) a tag locally, then force-push (only if absolutely necessary)

```bash
git tag -f v1.0.0 <new-commit>
git push origin -f v1.0.0
```

> This rewrites history of a published tag—coordinate with your team before doing this.

---

## Checking Out Code at a Tag

Tags aren’t branches; checking out a tag puts you in **detached HEAD**:

```bash
git checkout tags/v1.0.0
# create a new branch from it if you want to commit:
git checkout -b hotfix/from-v1.0.0 tags/v1.0.0
```

---

## Recommended Versioning & Naming

* Use **Semantic Versioning** (`MAJOR.MINOR.PATCH`), e.g., `v2.3.1`.

  * **MAJOR**: breaking changes
  * **MINOR**: new features, backwards compatible
  * **PATCH**: bug fixes, backwards compatible
* Prefix with `v` (common convention): `v1.4.0`, `v2.0.0-rc.1`
* Avoid spaces; keep names **immutable** once published.

---

## Tags & Releases (Platforms)

* **GitHub/GitLab Releases**: Create a release from an existing tag to attach notes, assets (binaries), and changelogs.
* Many package registries (npm, PyPI, Docker Hub via CI) trigger from tags.

---

## CI/CD With Tags

* Trigger release pipelines on tag creation:

  * Example (GitHub Actions):

    ```yaml
    on:
      push:
        tags:
          - 'v*.*.*'
    jobs:
      release:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - run: ./scripts/build.sh
          - run: ./scripts/publish.sh
    ```

* Use `git push --follow-tags` to ensure annotated version tags ride along with the release commit.
* Generate changelogs from commits **since the last tag**.

---

## Useful Tagging Patterns & Workflows

* **Release cut**:

  1. Merge release-ready code to `main`
  2. Bump version in code/changelog
  3. Create **annotated** tag `vX.Y.Z`
  4. Push tag to trigger CI/CD and create release

* **Pre-releases**: Use suffixes like `-alpha.1`, `-beta.2`, `-rc.1` (e.g., `v2.0.0-rc.1`).

* **Hotfix flow**: Branch off `tags/vX.Y.Z`, fix, tag a patch release `vX.Y.(Z+1)`.

---

## Advanced Techniques

### Tag a merge commit (explicit)

```bash
git log --oneline --graph --decorate
# find the merge commit hash
git tag -a v2.0.0 <merge-commit> -m "Release v2.0.0"
```

### Convert a lightweight tag to annotated

```bash
# Recreate annotated tag at same commit
git tag -f -a v1.0.0 -m "Release v1.0.0 (annotated now)" v1.0.0
# force-push if already published (coordinate with team!)
git push origin -f v1.0.0
```

### Store release notes in the tag message

```bash
git tag -a v1.2.0 -m $'Release v1.2.0\n\nChanges:\n- Add X\n- Fix Y\n- Improve Z'
```

### Show only annotated tags

```bash
git for-each-ref refs/tags --format='%(objecttype) %(refname:short)' \
| awk '$1=="tag"{print $2}'
```

---

## Common Pitfalls & How to Avoid Them

* **“I tagged locally but CI didn’t run.”**
  You probably didn’t push the tag. Use `git push origin <tag>` or `git push --tags`.

* **“Why doesn’t my tag have notes?”**
  You created a **lightweight** tag. Use `-a` (or `-s`) next time.

* **“My clone doesn’t see tags.”**
  Run `git fetch --tags` or ensure your fetch/prune settings include tags.

* **“We need to change a public tag.”**
  Avoid rewriting published tags. Create a new tag (e.g., `v1.0.1`) and deprecate the old one in the release notes.

---

## Quick Reference (Cheat Sheet)

```bash
# Create
git tag v1.0.0                             # lightweight
git tag -a v1.0.0 -m "Release v1.0.0"      # annotated
git tag -s v1.0.0 -m "Release (signed)"    # signed

# Inspect
git tag                                    # list
git show v1.0.0                             # details
git describe --tags                         # nearest tag

# Push / Fetch
git push origin v1.0.0
git push --tags
git push --follow-tags
git fetch --tags

# Delete
git tag -d v1.0.0
git push origin --delete v1.0.0             # remote delete

# Checkout (detached), then branch if needed
git checkout tags/v1.0.0
git checkout -b hotfix/from-v1.0.0 tags/v1.0.0
```

---

## Best Practices Summary

* Prefer **annotated** (and optionally **signed**) tags for releases.
* Use **semantic versioning** with a `v` prefix.
* Treat published tags as **immutable**; fix forward with a new tag.
* Always **push** the tag; consider `--follow-tags` in your release workflow.
* Automate releases by triggering CI/CD on tag pushes and generating changelogs from tags.

---

*With these conventions and commands, tags become a reliable backbone for your release and audit workflows—simple to create, easy to discover, and robust for automation.*
