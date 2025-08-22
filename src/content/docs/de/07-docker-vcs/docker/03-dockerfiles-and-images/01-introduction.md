---
title: Dockerfiles und Images – Einführung
---

Verstehen, wie **Dockerfiles** Container-Images definieren und lernen, wie man Images **baut**, **taggt** und **verwaltet**, um reproduzierbare Deployments sicherzustellen.

## Warum ist das wichtig?

Dockerfiles bieten eine **deklarative Blaupause**, um die **Umgebung, Abhängigkeiten und Konfigurationen** einer Anwendung festzuhalten. Das garantiert:

- **Konsistenz** zwischen Entwicklungs-, Test- und Produktionsumgebungen.  
- **Portabilität**, da Images überall laufen können, wo Docker unterstützt wird.  
- **Reproduzierbarkeit**, da dasselbe Dockerfile immer dasselbe Ergebnis erzeugt.  
- **Automatisierung**, wodurch Anwendungs-Builds und Deployments einfacher verwaltet werden können.  

---

## 1. Was ist ein Dockerfile?

Ein **Dockerfile** ist eine einfache Textdatei mit **Anweisungen**, die Docker Schritt für Schritt nutzt, um ein Image zu erstellen.  
Jede Anweisung erzeugt eine **Schicht (Layer)**, wodurch ein geschichtetes Image entsteht, das effizient gespeichert und verteilt werden kann.

Beispiel:

```dockerfile
# Starte von einem offiziellen Basis-Image
FROM node:20-alpine

# Setze Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere package.json und installiere Abhängigkeiten
COPY package*.json ./
RUN npm install --production

# Kopiere den Rest der Anwendung
COPY . .

# Öffne Port 3000
EXPOSE 3000

# Starte die Anwendung
CMD ["node", "server.js"]
```

### Wichtige Eigenschaften

* **Deklarativ**: Beschreibt den gewünschten Zustand des Images.
* **Geschichtet**: Jede Anweisung fügt eine neue Image-Schicht hinzu, was Caching und Effizienz verbessert.
* **Portabel**: Kann konsistent auf verschiedenen Systemen gebaut und ausgeführt werden.

---

## 2. Was ist ein Image?

Ein **Docker-Image** ist ein **schreibgeschützter, versionierter Snapshot** einer Anwendung und ihrer Abhängigkeiten.
Es wird aus einem Dockerfile gebaut und kann genutzt werden, um Container auszuführen.

* **Basis-Image**: Ausgangspunkt (z. B. `ubuntu:22.04`, `node:20-alpine`).
* **Abgeleitetes Image**: Baut auf einem Basis-Image auf und fügt anwendungsspezifische Schichten hinzu.
* **Unveränderlich**: Ein Image ändert sich nach dem Erstellen nicht. Updates erzeugen eine neue Version/einen neuen Tag.

---

## 3. Images bauen

Um ein Image aus einem Dockerfile zu erstellen:

```bash
docker build -t my-app:1.0 .
```

* `-t my-app:1.0`: Versehen des Images mit Namen und Version.
* `.`: Kontextverzeichnis (Ort von Dockerfile und Anwendungsdateien).

---

## 4. Images taggen

Tags helfen, verschiedene Versionen eines Images zu identifizieren:

```bash
docker tag my-app:1.0 myrepo/my-app:stable
```

* `my-app:1.0`: Lokales Image.
* `myrepo/my-app:stable`: Repository und Tag für Veröffentlichung.

---

## 5. Images verwalten

Häufige Befehle zur Image-Verwaltung:

* **Lokale Images anzeigen**

  ```bash
  docker images
  ```

* **Ein Image entfernen**

  ```bash
  docker rmi my-app:1.0
  ```

* **Image-Details prüfen**

  ```bash
  docker inspect my-app:1.0
  ```

* **Image-Historie (Schichten) anzeigen**

  ```bash
  docker history my-app:1.0
  ```

---

## 6. Best Practices für Dockerfiles & Images

* Verwende **kleine Basis-Images** (`alpine`, `slim`), um die Größe zu reduzieren.
* Nutze **Multi-Stage-Builds**, um Build-Tools von der Laufzeitumgebung zu trennen.
* **Ordne Anweisungen sinnvoll**, um Caching optimal auszunutzen.
* Speichere **Konfigurationen in Umgebungsvariablen**, nicht als Hardcoded-Werte.
* Halte Basis-Images durch regelmäßige Updates **sicher und aktuell**.

---

## 7. Zusammenfassung

* **Dockerfiles** beschreiben, wie Images mit deklarativen Schritten gebaut werden.
* **Images** sind portable, unveränderliche und geschichtete Artefakte, die konsistente Deployments ermöglichen.
* Das **Bauen, Taggen und Verwalten von Images** ist ein zentraler Bestandteil reproduzierbarer Deployments in modernen DevOps-Workflows.
