---
title: Einführung in die Docker-Sicherheit
---
# Einführung in die Docker-Sicherheit

Docker revolutioniert die Art und Weise, wie wir Anwendungen paketieren, verteilen und ausführen. Durch die Isolierung von Workloads in Containern vereinfacht es die Bereitstellung und stellt Konsistenz über verschiedene Umgebungen hinweg sicher. Allerdings bringt Docker auch neue **Sicherheitsaspekte** mit sich. Da Container denselben Kernel des Hosts teilen, können Fehlkonfigurationen oder Schwachstellen zu erheblichen Risiken führen.

Die Absicherung von Docker erfordert einen **mehrschichtigen Ansatz**, der sowohl die Härtung des Hosts als auch bewährte Container-Konfigurationen und kontinuierliche Überwachung umfasst.

---

## 1. Das Shared-Kernel-Modell

Im Gegensatz zu virtuellen Maschinen besitzen Docker-Container keinen eigenen Kernel. Stattdessen teilen sie sich den **Kernel des Hosts**:

* **Auswirkung:** Eine Schwachstelle im Kernel oder falsch konfigurierte Namespaces könnten zu einem Container-Escape führen, wodurch Angreifer Zugriff auf das Hostsystem erhalten.
* **Isolationsmechanismen:** Docker nutzt Linux-Funktionen wie Namespaces (Prozess, Netzwerk, IPC, Mount, UTS, Benutzer) und cgroups (Ressourcenkontrolle), um Container voneinander zu isolieren.
* **Best Practice:** Halte den Host-Kernel minimal, gehärtet und immer aktuell. Verwende containeroptimierte Betriebssysteme wie **Bottlerocket** oder **Fedora CoreOS**.

---

## 2. Angriffsfläche von Docker-Containern

Docker-Container erweitern die potenzielle Angriffsfläche eines Systems. Kritische Bereiche sind:

* **Docker-Daemon:** Läuft mit Root-Rechten. Bei einem Kompromittieren erhält ein Angreifer volle Kontrolle über Host und Container.
* **Images:** Container basieren auf Images, die Schwachstellen, Malware oder Fehlkonfigurationen enthalten können.
* **Netzwerk:** Offene Container-Ports können Angreifern Zugang zu sensiblen Diensten ermöglichen.
* **Ressourcenmissbrauch:** Ohne Limits kann ein fehlerhafter oder bösartiger Container CPU, Speicher oder Festplattenplatz vollständig beanspruchen und so einen Denial-of-Service verursachen.

**Gegenmaßnahmen:**

* Nur vertrauenswürdige Images nutzen, vorzugsweise aus offiziellen Repositories.
* Images mit Tools wie **Trivy**, **Clair** oder **Docker Scout** auf Schwachstellen prüfen.
* Container-Netzwerke durch Firewalls und eigene Bridges einschränken.
* Ressourcenlimits mit `--memory` und `--cpus` setzen.

---

## 3. Prinzip der minimalen Rechtevergabe

Das **Prinzip der minimalen Rechtevergabe** bedeutet, dass Container nur mit den minimal notwendigen Berechtigungen laufen sollten:

* **Container nicht als Root** ausführen, außer es ist unbedingt erforderlich. Verwende das `USER`-Directive in Dockerfiles.
* Unnötige Linux-Capabilities mit `--cap-drop` entfernen.
* Sicherheitsmodule wie **AppArmor**, **SELinux** oder **seccomp** nutzen, um Systemaufrufe einzuschränken.
* Sensible Verzeichnisse vom Host nicht mounten (z. B. `/var/run/docker.sock`, `/etc`, `/proc`).

**Beispiel: Container als Nicht-Root-Benutzer starten**

```dockerfile
FROM node:18-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

---

## 4. Bedeutung von Updates und Patches

Container sind zwar leichtgewichtig, laufen aber mit Betriebssystempaketen und Bibliotheken, die im Laufe der Zeit verwundbar werden können:

* **Container-Images:** Regelmäßig neu bauen, um die neuesten Sicherheits-Patches einzubinden. Minimal-Images wie `alpine` oder `distroless` nutzen, um die Angriffsfläche zu verringern.
* **Docker Engine & Host-OS:** Docker-Daemon, CLI und zugrundeliegendes Betriebssystem aktuell halten.
* **Automatisierte Updates:** Image-Scanning und Patching in CI/CD-Pipelines integrieren.

**Best Practices:**

* Images versionieren und Updates erzwingen.
* CVEs (Common Vulnerabilities and Exposures) für Basis-Images überwachen.
* Automatisiertes Schwachstellen-Scanning in Build- und Deployment-Prozesse einbauen.

---

## Fazit

Docker steigert die Agilität, erfordert aber **bewusste Sicherheitsmaßnahmen**.
Eine sichere Docker-Umgebung entsteht nicht durch eine einzelne Maßnahme, sondern durch eine **mehrschichtige Verteidigungsstrategie**, die Folgendes umfasst:

1. Verständnis der Risiken des **Shared-Kernel-Modells**.
2. Reduktion der **Angriffsfläche** durch Härtung von Docker und Container-Images.
3. Umsetzung des **Prinzips minimaler Rechtevergabe**, um das Schadenspotenzial zu reduzieren.
4. Kontinuierliches **Aktualisieren und Patchen** von Containern und Hostsystem.

Durch diese Vorgehensweise können Organisationen Container sicher einsetzen und die Risiken deutlich minimieren.
