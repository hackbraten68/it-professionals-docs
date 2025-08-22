---
title: Was ist ein Dockerfile?
---

## Definition

Ein **Dockerfile** ist eine einfache Textdatei, die eine Abfolge von Anweisungen enthält, welche Docker mitteilen, wie ein Container-Image erstellt werden soll.  

- Üblicherweise trägt die Datei den Namen `Dockerfile` (ohne Dateiendung).  
- Jede Zeile im Dockerfile stellt einen Befehl dar, der der Reihe nach ausgeführt wird und dabei einzelne **Layer** im finalen Image bildet.  
- Die Docker-CLI verwendet das Dockerfile beim Ausführen von `docker build`, um reproduzierbare und portable Images zu erstellen.  

---

## Zweck

Dockerfiles sind ein zentrales Werkzeug in der modernen containerisierten Anwendungsentwicklung. Ihre Hauptziele sind:

1. **Automatisierte Image-Erstellung**  
   - Anstatt einen Container jedes Mal manuell zu konfigurieren, ermöglicht ein Dockerfile, die Schritte einmal festzulegen und anschließend automatisch konsistente Images zu erzeugen.  
   - Dies spart Zeit und reduziert menschliche Fehler.

2. **Abbilden von Abhängigkeiten & Umgebung**  
   - Ein Dockerfile kann folgende Aspekte definieren:  
     - **Basis-Images** (z. B. `FROM ubuntu:22.04`)  
     - **Abhängigkeiten** (Bibliotheken, Laufzeitumgebungen, Pakete)  
     - **Umgebungsvariablen** (`ENV NODE_ENV=production`)  
     - **Konfigurationen** wie Arbeitsverzeichnisse, Ports oder Benutzer  
   - Dadurch wird sichergestellt, dass jeder Nutzer des Images die exakt gleiche Umgebung erhält – unabhängig vom Hostsystem.  

3. **Definieren von Befehlen & Metadaten**  
   - Es lassen sich Standardbefehle deklarieren, die der Container ausführt (`CMD` oder `ENTRYPOINT`).  
   - Metadaten wie Labels, Standard-Ports (`EXPOSE`) und Mount-Punkte (`VOLUME`) können ebenfalls hinzugefügt werden.  
   - Dies macht Container selbstdokumentierend.  

4. **Versionierung der Konfiguration**  
   - Da Dockerfiles Textdateien sind, können sie in **Git-Repositories** zusammen mit dem Anwendungscode gespeichert werden.  
   - Teams können Änderungen an Umgebungen genauso nachverfolgen wie Änderungen am Quellcode.  
   - Das erleichtert Zusammenarbeit, Nachvollziehbarkeit und das Zurückrollen fehlerhafter Konfigurationen.  

---

## Aufbau eines Dockerfiles

Ein typisches Dockerfile besteht aus:

- **Basis-Image** (`FROM`) – Ausgangspunkt des Builds.  
- **Anweisungen** wie `RUN`, `COPY`, `ADD`, um Software zu installieren oder Dateien hinzuzufügen.  
- **Umgebungseinstellungen** (`ENV`, `WORKDIR`, `USER`).  
- **Startpunkt und Standardbefehl** (`ENTRYPOINT`, `CMD`).  

Beispiel:

```dockerfile
# Offizielles Node.js-Image als Basis nutzen
FROM node:20-alpine

# Arbeitsverzeichnis festlegen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install --production

# Anwendungsdateien kopieren
COPY . .

# Port für die Anwendung freigeben
EXPOSE 3000

# Startbefehl definieren
CMD ["node", "server.js"]
```

---

## Warum Dockerfiles wichtig sind

* **Konsistenz:** Jeder Build ist identisch – „funktioniert nur auf meinem Rechner“-Probleme werden minimiert.
* **Portabilität:** Anwendungen können problemlos in verschiedenen Umgebungen (Entwicklung, Staging, Produktion) eingesetzt werden.
* **Skalierbarkeit:** Teams können standardisieren, wie Anwendungen gebaut und ausgeliefert werden.
* **Dokumentation:** Das Dockerfile selbst dient als Blaupause dafür, wie die Anwendung läuft.

---

## Kernaussagen

* Ein Dockerfile definiert die **Baupläne** eines Container-Images.
* Es stellt **Automatisierung, Konsistenz und Reproduzierbarkeit** sicher.
* Durch die Ablage in Versionskontrolle können Teams ihre Infrastruktur genauso verwalten und weiterentwickeln wie Anwendungscode.
