---
title: Local Deployment
---
### Description

Local deployment is useful during development, testing, or for small-scale personal use. It doesn’t require internet access or complex infrastructure.

### Key Features

- Fast feedback loop for developers
- Simple docker run or docker-compose up
- Ideal for testing and prototyping

### Example

```bash
docker build -t myapp .
docker run -p 8080:80 myapp
```

### Use Cases

- Testing new features locally
- Internal tools for small teams
- Prototyping applications
