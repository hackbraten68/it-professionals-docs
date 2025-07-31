---
title: What are Tags?
---
Tags are used to mark specific points in history as important. Most commonly used to mark release versions (e.g. v1.0, v2.0-beta).

There are two types:

- Lightweight Tags – like a bookmark.
- Annotated Tags – contain metadata (author, date, message).

#### Creating Tags

```bash
# Lightweight tag
git tag v1.0

# Annotated tag
git tag -a v1.0 -m "Release version 1.0"
```

#### Listing Tags

```bash
git tag
```

#### Pushing Tags to Remote

```bash
# Push a single tag
git push origin v1.0

# Push all tags
git push --tags
```

#### Deleting Tags

```bash
# Delete locally
git tag -d v1.0

# Delete from remote
git push origin --delete tag v1.0
```
