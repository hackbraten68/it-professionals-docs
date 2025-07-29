---
title: Virtual Machines (VMs)
---

### 3.1 Architecture

```bash
┌───────────────────┐
│   Physical Host   │
│   ─────────────── │
│   Host Operating  │
│   System          │
│   ─────────────── │
│   Hypervisor      │
├───────────────────┤
│  VM1 │ VM2 │ VM3  │
│──────┼─────┼──────│
│Guest │Guest│Guest │
│ OS A │OS B │ OS C │
│ App  │App  │ App  │
└───────────────────┘

```

### 3.2 How It Works

1. Hypervisor reserves CPU, memory, disk blocks.
2. Each VM boots a full guest OS kernel + userland.
3. Strong hardware-level isolation via virtualized devices.

### 3.3 Pros & Cons

|**Pros**|**Cons**|
|---|---|
|✔️ Full isolation (separate kernels)|⏱️ Slow boot time (minutes)|
|✔️ Can run any OS (Windows, Linux, BSD)|💾 High resource overhead (RAM, storage)|
|✔️ Mature security tools & tooling|🔧 Management complexity grows with # of VMs|
