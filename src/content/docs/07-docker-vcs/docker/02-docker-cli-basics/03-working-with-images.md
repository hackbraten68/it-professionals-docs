---
title: Working with Images (Docker CLI)
audience: Learners (beginner → intermediate)
prereqs: Docker installed, terminal basics
outcomes:
  - Understand how Docker images are named, stored, and identified.
  - Search, pull, list, tag, inspect, and view history of images.
  - Push images to registries and clean up local disk usage safely.
  - Work with platforms/architectures, digests, and image exports.
  - Apply best practices for security, caching, and organization.
---

## 1. Key Concepts & Mental Model

**Image**  
A read-only, content-addressed bundle of filesystem layers + metadata (config, env, entrypoint). Images are immutable and referenced by **name:tag** (human-friendly) or **digest** (cryptographic).

**Registry → Repository → Image**

- **Registry**: Server that stores images (e.g., `docker.io`, `ghcr.io`, `registry.example.com`).  
- **Repository**: A collection of related images under a name (e.g., `library/redis`).  
- **Image reference**: `REGISTRY/REPO:TAG` (e.g., `docker.io/library/redis:7`).  
- **Digest**: `@sha256:<hash>` uniquely and immutably identifies the content (e.g., `redis@sha256:abcd...`). Pulls by digest ensure exact bytes.

**Layers & Caching**  
Images are built from layered filesystems. Layers are reused across tags/repositories when content matches, saving disk and speeding pulls/builds.

---

## 2. Searching & Pulling

### 2.1 Search on Docker Hub

```bash
docker search redis
````

**What it does**: Queries Docker Hub for repositories named/related to `redis`.
**Tips**:

* Official images appear with `OFFICIAL` status (e.g., `redis` under `library/`).
* Verify publishers for security and support.
* Consider reading image descriptions/tags on the registry webpage for guidance.

### 2.2 Pull an Image

```bash
docker pull redis:7
```

**Notes**:

* Omit tag to default to `:latest` (not recommended for production).
* Pulling by **digest** guarantees exact content:

  ```bash
  docker pull redis@sha256:<digest>
  ```
* Multi-arch images: the daemon pulls the variant matching your host by default. Override with:

  ```bash
  docker pull --platform linux/arm64 redis:7
  ```

**Troubleshooting**:

* **Auth errors**: `docker login` to the registry first.
* **Rate limits** (public registries): authenticate, mirror, or use a private cache.

---

## 3. Listing, Tagging & Naming

### 3.1 List Local Images

```bash
docker images
docker images --digests
docker image ls --filter reference='redis:*'
```

**Good to know**:

* `REPOSITORY`, `TAG`, `IMAGE ID`, `CREATED`, `SIZE`.
* `--digests` shows the content hash; different tags can point to the same digest.

### 3.2 Tag an Existing Image

```bash
docker tag redis:7 myrepo/redis:7-custom
```

**Why tag?**

* To push to your own registry/repo.
* To add semantic meaning (e.g., `:7.2.5`, `:prod-2025-08-18`).
* Remember: tagging does **not** duplicate image data; it just adds a new reference.

**Naming Rules**:

* Use lowercase, `/` for namespace (e.g., `org/app`).
* Include registry when not Docker Hub (e.g., `registry.example.com/team/app:1.0`).

---

## 4. Inspecting & History

### 4.1 Inspect Metadata

```bash
docker inspect redis:7
```

**What you’ll see**:

* **Config**: `Env`, `Entrypoint`, `Cmd`, exposed ports, working dir, user.
* **RootFS**: layers (diff IDs).
* **RepoDigests**: the immutable digest references you can use to pin deployments.

### 4.2 View Layer History

```bash
docker history redis:7
```

Shows each layer’s command (when available) and size. Use this to:

* Understand **how** an image was built.
* Identify large layers for optimization.
* Spot secrets accidentally baked into layers (avoid this!).

---

## 5. Pushing to Registries

### 5.1 Login, Tag, Push

```bash
docker login myregistry.example.com
docker tag redis:7 myregistry.example.com/team/redis:7-custom
docker push myregistry.example.com/team/redis:7-custom
```

**Requirements**:

* You must have permission to push to the target repository.
* The image name must be fully qualified with registry host if not Docker Hub.

**Best Practices**:

* Use **immutable version tags** (e.g., `1.2.3`) for deploys.
* Optionally also push a **floating tag** (e.g., `1.2`, `1`, `stable`) that you advance when ready.
* For reproducibility and supply-chain safety, record/pin the **digest** emitted after push.

---

## 6. Cleaning Up & Disk Hygiene

### 6.1 Remove a Specific Image

```bash
docker rmi myrepo/redis:7-custom
```

* Fails if containers depend on it. Remove containers first or use `--force` with caution.

### 6.2 Prune Dangling/Unused

```bash
docker image prune          # dangling (untagged) images
docker image prune -a       # all images not used by any container
```

**Safety Tips**:

* **Dangling** are typically intermediate build layers no longer referenced by tags.
* `-a` removes **any** image with no container referencing it. Check `docker ps -a`.

### 6.3 Disk Usage Overview

```bash
docker system df
docker system df -v
```

Inspect which images/volumes/containers consume space and their shared layer sizes.

---

## 7. Working with Platforms & Manifests (Multi-Arch)

**Why it matters**: ARM64 (e.g., Apple Silicon, Raspberry Pi) vs AMD64 (most servers).

* Pull for a specific platform:

  ```bash
  docker pull --platform linux/arm64 alpine:3.20
  ```

* Inspect a **multi-arch manifest** (read-only):

  ```bash
  docker manifest inspect redis:7
  ```

  (Shows which architectures/OS variants are available.)

> Building/publishing multi-arch images typically uses Buildx; this lesson focuses on **consuming** images.

---

## 8. Advanced Image Operations

### 8.1 Pull by Digest & Pin Deployments

```bash
docker pull redis@sha256:<digest>
docker run redis@sha256:<digest>
```

**Why**: Ensures the exact same content across environments.

### 8.2 Save/Load Images (Offline, Air-gapped)

```bash
docker save -o redis7.tar redis:7
docker load -i redis7.tar
```

* **save/load** operates on **images**.
* Compare with container **export/import** (filesystem only, no image metadata):

  ```bash
  docker export <container> -o rootfs.tar
  docker import rootfs.tar myrepo/rootfs:raw
  ```

### 8.3 Show Image Digest Locally

```bash
docker inspect --format='{{index .RepoDigests 0}}' redis:7
```

(If present; otherwise pull or push first to ensure a canonical digest mapping.)

---

## 9. Security & Provenance (Operator’s View)

* **Verify Publisher**: Prefer official/verified images; read tags/notes on the registry page.
* **Minimal Base Images**: Use `-slim` or `alpine` variants when appropriate; verify compatibility and glibc vs musl differences.
* **Pin by Digest in Prod**: Prevents surprise updates under the same tag.
* **Scan for CVEs** (example with Docker Scout CLI):

  ```bash
  docker scout cves redis:7
  ```

  (Or use your organization’s scanner integrated with CI.)
* **Non-root User**: Prefer images configured with non-root users to reduce blast radius.
* **Keep Secrets Out**: Never bake secrets into images; use runtime secrets management.

---

## 10. Common Errors & Fixes

* **`pull access denied` / `repository does not exist`**
  → Check repo spelling, tags, and run `docker login` to the correct registry.

* **`denied: requested access to the resource is denied` (push)**
  → Missing permissions; ask registry admin to grant push rights or use correct namespace.

* **`no space left on device`**
  → Run `docker system df`, then `docker image prune`, remove unused containers/volumes, or expand disk.

* **Wrong Architecture Pulled**
  → Use `--platform` on pull/run; ensure the image actually publishes that architecture.

* **Tag Overwrites Expectations**
  → Remember tags are mutable on registries; use digests for guaranteed immutability.

---

## 11. Practical Walkthrough (End-to-End)

1. **Find an image**

   ```bash
   docker search redis
   ```

2. **Pull a specific major version**

   ```bash
   docker pull redis:7
   ```

3. **List & check digest**

   ```bash
   docker images --digests | grep redis
   docker inspect --format='{{json .Config.Env}}' redis:7 | jq .
   ```

4. **Retag for your registry**

   ```bash
   docker tag redis:7 registry.example.com/course/redis:7.2.5
   ```

5. **Login & push**

   ```bash
   docker login registry.example.com
   docker push registry.example.com/course/redis:7.2.5
   ```

6. **Pin deployment to digest**
   After push, note the `@sha256:<digest>` and deploy with:

   ```bash
   docker pull registry.example.com/course/redis@sha256:<digest>
   docker run -d --name cache registry.example.com/course/redis@sha256:<digest>
   ```
   
7. **Clean up**

   ```bash
   docker image prune
   docker system df
   ```

---

## 12. Cheat Sheet (CLI Quick Reference)

```bash
# Search & Pull
docker search <term>
docker pull [--platform linux/arm64] <repo[:tag]|@digest>

# Listing & Tagging
docker images [--digests]
docker image ls --filter reference='<pattern>'
docker tag <src[:tag]> <dest[:tag]>

# Inspect & History
docker inspect <image>
docker history <image>

# Push (after docker login)
docker push <registry/repo:tag>

# Remove & Prune
docker rmi <image>
docker image prune          # dangling
docker image prune -a       # all unused
docker system df [-v]       # disk usage

# Save / Load (offline)
docker save -o image.tar <image>
docker load -i image.tar

# Manifest / Platforms
docker manifest inspect <image[:tag]|@digest>
```

---

## 13. Best Practices Summary

* Prefer **immutable references** (digests) in production.
* Maintain **clear tagging strategy** (semver + floating tags you control).
* Regularly **scan** and **update** base images; rebuild to pick up patched layers.
* Choose **minimal, purpose-built images** and run as **non-root**.
* Keep **images small** (fewer layers, remove build tools in final images).
* Use `docker system df` and **prune** regularly in CI/build hosts.

---
