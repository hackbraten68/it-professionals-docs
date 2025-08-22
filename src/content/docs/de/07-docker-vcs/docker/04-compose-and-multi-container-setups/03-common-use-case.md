---
title: Häufiger Anwendungsfall - Web-App mit Datenbank
---

## Häufiger Anwendungsfall: Web-App mit Datenbank

## Einführung

Moderne Webanwendungen bestehen selten nur aus einer einzelnen Komponente. Ein **typisches Setup** umfasst häufig ein **Frontend**, eine **Backend-API** und eine **Datenbank**.  
Das manuelle Starten und Verwalten dieser Komponenten mit Docker würde bedeuten, mehrere Befehle auszuführen und die richtige Netzwerkkonfiguration zwischen den Containern sicherzustellen.  
**Docker Compose** vereinfacht diesen Prozess, da die gesamte Umgebung mit nur einer Konfigurationsdatei und einem einzigen Befehl gestartet werden kann.

---

## Typisches Multi-Container-Setup

1. **Frontend (Client-Anwendung)**

   * Beispiele: **React**, **Angular**, **Vue**
   * Zweck: Stellt die **Benutzeroberfläche** bereit, die im Browser läuft.
   * Bereitstellung: Häufig ausgeliefert über einen leichtgewichtigen HTTP-Server wie **Nginx**.
   * Container-Aufgaben:

     * Ausliefern von statischen Dateien (HTML, CSS, JS).
     * Weiterleiten von API-Aufrufen an das Backend.

2. **Backend-API (Anwendungsserver)**

   * Beispiele: **Express.js**, **Flask**, **Django**, **Spring Boot**
   * Zweck: Dient als **Business-Logik-Schicht**, die Anfragen verarbeitet und Antworten zurückgibt.
   * Verantwortlichkeiten:

     * Handhaben von Authentifizierung, Autorisierung und Datenvalidierung.
     * Verarbeiten von Client-Anfragen und Rückgabe von Antworten.
     * Kommunikation mit der Datenbank zum Speichern oder Abrufen von Informationen.

3. **Datenbank**

   * Beispiele: **PostgreSQL**, **MySQL**, **MongoDB**
   * Zweck: Speichert Anwendungsdaten **persistant**.
   * Wichtige Punkte:

     * Datenbanken benötigen in der Regel **Volumes** für dauerhafte Speicherung.
     * Konfiguration (z. B. Datenbankname, Benutzername, Passwort) erfolgt üblicherweise über **Umgebungsvariablen**.

---

## Beispiel `docker-compose.yml`

Ein minimales Beispiel-Setup könnte so aussehen:

```yaml
version: '3.9'
services:
  frontend:
    image: nginx:latest
    volumes:
      - ./frontend/build:/usr/share/nginx/html
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/mydb
    ports:
      - "5000:5000"
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

---

## Funktionsweise

* **Netzwerk:**
  Docker Compose erstellt ein **Standard-Netzwerk**, in dem alle Services über ihren **Servicenamen** miteinander kommunizieren können (z. B. verbindet sich das Backend mit `db:5432`).

* **Abhängigkeiten:**
  Die Option `depends_on` sorgt dafür, dass das Backend nicht vor der Datenbank gestartet wird und das Frontend auf das Backend wartet.

* **Persistente Daten:**
  Das Volume `db_data` stellt sicher, dass Daten auch dann erhalten bleiben, wenn der Datenbank-Container neu gestartet wird.

* **Port-Mapping:**

  * Frontend: Erreichbar unter `http://localhost:3000`
  * Backend API: Erreichbar unter `http://localhost:5000`

---

## Vorteile von Docker Compose für Web-Apps

* **Ein-Kommando-Start:**
  Mit `docker-compose up` werden alle Komponenten gleichzeitig gestartet.

* **Vereinfachte lokale Entwicklung:**
  Entwickler können den gesamten Stack auf ihrem Rechner betreiben, ohne mehrere Laufzeitumgebungen manuell zu installieren.

* **Isolation:**
  Jede Komponente läuft in einem eigenen Container und vermeidet so Konflikte zwischen Abhängigkeiten.

* **Portabilität:**
  Die gleiche Konfiguration kann für Entwicklung, Tests und kleine Produktionsumgebungen genutzt werden.

* **Skalierbarkeit:**
  Container können einfach skaliert werden (z. B. mehrere Backend-Instanzen) mit einem simplen Befehl:

  ```bash
  docker-compose up --scale backend=3
  ```

---

## Fazit

Eine **Webanwendung mit Datenbank** ist einer der häufigsten Anwendungsfälle für Docker Compose.
Durch die Kombination von **Frontend**, **Backend-API** und **Datenbank** in einer einzigen Konfiguration können Entwickler komplexe Multi-Container-Umgebungen einfach erstellen, starten und verwalten.
Dieses Setup eignet sich hervorragend für die **lokale Entwicklung** und kann als Grundlage für **Produktionsumgebungen** mit zusätzlichem Tooling dienen.
