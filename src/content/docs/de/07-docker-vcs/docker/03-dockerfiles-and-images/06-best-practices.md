---
title: Best Practices für Dockerfiles und Images
---

## Einführung

Dockerfiles definieren, wie Container-Images erstellt werden. Effiziente und sichere Dockerfiles sind entscheidend für **Performance, Wartbarkeit und Sicherheit**. Das Befolgen von Best Practices sorgt für kleinere, schnellere und reproduzierbare Images, die zuverlässig in verschiedenen Umgebungen funktionieren.

---

## 1. Schichten minimieren

- **Erklärung:**  
  Jede Dockerfile-Anweisung (`RUN`, `COPY`, `ADD`) erzeugt eine neue Image-Schicht. Zu viele Schichten führen zu aufgeblähten Images und längeren Build-Zeiten.
  
- **Best Practice:**  
  Verwandte `RUN`-Befehle mit `&&` kombinieren und temporäre Dateien im gleichen Befehl bereinigen.
  
- **Beispiel:**

  ```dockerfile
  # Schlecht: erzeugt mehrere Schichten
  RUN apt-get update
  RUN apt-get install -y curl
  RUN apt-get install -y git

  # Besser: eine Schicht, aufgeräumt
  RUN apt-get update && \
      apt-get install -y curl git && \
      rm -rf /var/lib/apt/lists/*
  ```

---

## 2. Offizielle und minimale Basis-Images verwenden

* **Erklärung:**
  Basis-Images sind Ausgangspunkte für Container. Große oder unzuverlässige Images erhöhen Sicherheitsrisiken und Image-Größe.

* **Best Practice:**

  * **Offizielle Images** aus Docker Hub oder vertrauenswürdigen Registries bevorzugen.
  * **Leichtgewichtige Varianten** wie `alpine`, `slim` oder `buster-slim` nutzen.

* **Beispiel:**

  ```dockerfile
  # Schweres Basisimage
  FROM ubuntu:22.04

  # Leichteres Basisimage
  FROM python:3.11-slim
  ```

---

## 3. Multi-Stage Builds einsetzen

* **Erklärung:**
  Multi-Stage Builds trennen Build-Abhängigkeiten (z. B. Compiler, Libraries) vom finalen Laufzeit-Image. Ergebnis: deutlich kleinere Images.

* **Best Practice:**
  Einen Builder-Stage für die Kompilierung und ein leichtes Runtime-Image für den Betrieb verwenden.

* **Beispiel:**

  ```dockerfile
  # Build-Stage
  FROM golang:1.22 AS builder
  WORKDIR /app
  COPY . .
  RUN go build -o myapp

  # Runtime-Stage
  FROM alpine:3.20
  WORKDIR /app
  COPY --from=builder /app/myapp .
  CMD ["./myapp"]
  ```

---

## 4. Reihenfolge beachten (Layer-Caching)

* **Erklärung:**
  Docker nutzt **Layer-Caching**. Unveränderte Anweisungen werden wiederverwendet. Häufig veränderte Befehle sollten **weiter unten** stehen.

* **Best Practice:**

  * Statische, selten geänderte Befehle (z. B. Systemabhängigkeiten) nach oben.
  * Volatile Befehle (z. B. `COPY src/`) ans Ende.

* **Beispiel:**

  ```dockerfile
  # Abhängigkeiten zuerst (ändern sich selten)
  RUN pip install -r requirements.txt

  # Quellcode ändert sich oft
  COPY src/ /app/src
  ```

---

## 5. Keine Secrets im Dockerfile

* **Erklärung:**
  Zugangsdaten, Tokens oder Schlüssel direkt im Dockerfile sind ein Sicherheitsrisiko. Jeder mit Zugriff auf das Image kann diese extrahieren.

* **Best Practice:**

  * **Build-Argumente (`ARG`)** für nicht sensible Variablen.
  * **Umgebungsvariablen** zur Laufzeit übergeben.
  * **Secret-Management-Systeme** verwenden (z. B. Docker Secrets, HashiCorp Vault, AWS Secrets Manager).

* **Schlechtes Beispiel (NIE so machen):**

  ```dockerfile
  ENV DB_PASSWORD=mysecretpassword
  ```

* **Besser:**

  ```dockerfile
  ARG APP_ENV
  ENV APP_ENV=$APP_ENV
  ```

---

## 6. Aufräumen nach Installationen

* **Erklärung:**
  Temporäre Dateien, Cache und Build-Artefakte blähen das Image unnötig auf.

* **Best Practice:**
  Paketlisten, Cache und temporäre Dateien im gleichen `RUN`-Befehl löschen.

* **Beispiel:**

  ```dockerfile
  RUN apt-get update && \
      apt-get install -y build-essential && \
      make myapp && \
      apt-get remove -y build-essential && \
      rm -rf /var/lib/apt/lists/*
  ```

---

## 7. Weitere Empfehlungen

* **`.dockerignore` verwenden:**
  Verhindert, dass unnötige Dateien (Logs, lokale Configs, `.git`) ins Image gelangen.

* **Versionen fixieren:**
  Konkrete Versionen für Images und Pakete angeben (`python:3.11.6-slim`), um Reproduzierbarkeit sicherzustellen.

* **Sicherheits-Scanning:**
  Images regelmäßig mit Tools wie `trivy` oder `docker scan` prüfen.

* **Non-Root User:**
  Prozesse nicht als `root` laufen lassen.

  ```dockerfile
  RUN useradd -m appuser
  USER appuser
  ```

---

## Fazit

Durch das Befolgen dieser Best Practices werden Docker-Images:

* **Kleiner und schneller im Build**
* **Sicherer und einfacher wartbar**
* **Leicht reproduzierbar und zuverlässig deploybar**

Ein gut geschriebenes Dockerfile ist die Grundlage für stabile containerisierte Anwendungen in der Produktion.
