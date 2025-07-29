---
title: PaaS & CI/CD Integration
---
### Examples

- Heroku, Render, Railway: Abstract away Docker details
- GitHub Actions, GitLab CI: Automate container builds and deployments

### Docker in CI/CD

```yaml
# Example GitHub Actions workflow
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker image
        run: |
          docker build -t myorg/myapp:${{ github.sha }} .
          docker push myorg/myapp:${{ github.sha }}
```

### Benefits

- Automate deployments
- Enforce consistency and repeatability
