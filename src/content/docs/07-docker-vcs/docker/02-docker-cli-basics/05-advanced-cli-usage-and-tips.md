---
title: Advanced CLI Usage & Tips
---
Resource Constraints

- **Limit CPUs**

    ```bash
    docker run --cpus="1.5" ubuntu
    ```

- **Limit memory**

    ```bash
    docker run -m 512m ubuntu
    ```

- **Ulimits**

    ```bash
    docker run --ulimit nofile=2048:4096 my-app
    ```

### 5.2 Logging Drivers & Options

- **Specify driver**

    ```bash
    docker run \
      --log-driver=json-file \
      --log-opt max-size=10m \
      my-app
    ```

- **Other drivers:** `syslog`, `journald`, `fluentd`, `awslogs`, etc.

### 5.3 Formatting & Filtering Output

- **Go‐template formatting**

    ```bash
    docker ps --format "{{.Names}}\t{{.Status}}"
    ```

- **Filtering**

    ```bash
    docker ps --filter "status=exited"
    ```

### 5.4 Contexts & Profiles

- **List contexts**

    ```bash
    docker context ls
    ```

- **Switch context**

    ```bash
    docker context use remote-docker
    ```

### 5.5 Shell Autocomplete & Aliases

- **Enable bash/zsh autocomplete**

    ```bash
    source <(docker completion bash)
    source <(docker completion zsh)
    ```

- **Common aliases**

    ```bash
    alias dps='docker ps'
    alias drmi='docker rmi'
