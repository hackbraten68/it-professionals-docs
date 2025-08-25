---
title: DNS-basierte Service Discovery in Docker
---
# DNS-basierte Service Discovery in Docker

## 1. Einführung

In modernen containerisierten Umgebungen bestehen Anwendungen oft aus mehreren Services, die miteinander kommunizieren müssen.
Das manuelle Festlegen von IP-Adressen ist unzuverlässig, da sich Container-IPs bei einem Neustart oder bei Skalierung ändern können.

Um dieses Problem zu lösen, stellt **Docker eine DNS-basierte Service Discovery** bereit. Container im selben benutzerdefinierten Netzwerk können sich automatisch anhand ihres **Container-Namens** oder **Service-Namens** erreichen.

Dies ist besonders nützlich beim Aufbau von **Microservices** oder **verteilten Systemen**, in denen dynamische Skalierung und Service-Erkennung entscheidend sind.

---

## 2. Wie das interne DNS von Docker funktioniert

Docker betreibt einen internen DNS-Server, der die Namensauflösung für Container automatisch verwaltet.

* **Gültigkeitsbereich**: Die DNS-basierte Erkennung funktioniert nur in einem **benutzerdefinierten Bridge-** oder **Overlay-Netzwerk**.
* **Mechanismus**: Beim Start eines Containers registriert Docker dessen Namen und Netzwerk-Alias im internen DNS.
* **Auflösung**: Andere Container im selben Netzwerk können diesen einfach über den Namen statt über die IP-Adresse erreichen.

> **Hinweis**: Das Standard-`bridge`-Netzwerk, das Docker automatisch erstellt, unterstützt **keine** DNS-basierte Namensauflösung. Man muss ein **benutzerdefiniertes Bridge-** oder ein **Overlay-Netzwerk** verwenden.

---

## 3. Beispiel: Container-Kommunikation über Namen

### Schritt 1: Erstellen eines benutzerdefinierten Netzwerks

```bash
docker network create mynetwork
```

### Schritt 2: Starten eines Datenbank-Containers

```bash
docker run -d --name db --network mynetwork postgres
```

### Schritt 3: Starten eines Webserver-Containers

```bash
docker run -d --name web --network mynetwork nginx
```

### Schritt 4: Kommunikation testen

Innerhalb des `web`-Containers kann man die Datenbank über den **Namen `db`** erreichen:

```bash
ping db
```

Docker löst `db` automatisch zur richtigen IP-Adresse des Datenbank-Containers auf.

---

## 4. Vorteile der DNS-basierten Service Discovery

* **Keine festen IPs nötig**: Services können über Namen angesprochen werden.
* **Dynamische Skalierung**: Neue Container einer Service-Gruppe sind sofort erreichbar.
* **Einfache Konfiguration**: Konfigurationsdateien können Service-Namen statt IPs verwenden.
* **Microservices-freundlich**: Ideal für Architekturen, in denen Services dynamisch miteinander interagieren.

---

## 5. Einsatzszenarien in der Praxis

1. **Microservices-Anwendungen**

   * Ein `frontend`-Service kommuniziert mit einem `api`-Service einfach über `http://api:5000`.
   * IP-Management entfällt, auch bei Skalierung.

2. **Docker Compose Projekte**

   * In Compose befinden sich alle Services standardmäßig im gleichen Netzwerk.
   * Der Service-Name (`db`) ist automatisch von anderen Services erreichbar.

3. **Swarm / Kubernetes-ähnliche Skalierung**

   * Overlay-Netzwerke erweitern DNS-Service Discovery über mehrere Hosts hinweg.
   * Container auf verschiedenen Hosts können sich gegenseitig über Service-Namen finden.

---

## 6. DNS-Aliase und benutzerdefinierte Hostnamen

Docker erlaubt zusätzlich eigene Aliase und Hostnamen:

* **Netzwerk-Alias**

  ```bash
  docker run -d --name cache --network mynetwork --network-alias redis redis
  ```

  → Der Container ist nun unter `cache` **und** `redis` erreichbar.

* **Benutzerdefinierte Hostnamen**
  Mit `--hostname` lässt sich ein interner Hostname für den Container setzen.

---

## 7. Einschränkungen und Überlegungen

* Funktioniert **nur im selben Docker-Netzwerk**. Container in verschiedenen Netzwerken müssen explizit verbunden werden.
* Das Standard-`bridge`-Netzwerk unterstützt diese DNS-Auflösung nicht.
* Lastverteilung über mehrere Container mit gleichem Alias ist im reinen Docker eingeschränkt. Für erweitertes Load Balancing bieten **Swarm** oder **Kubernetes** zusätzliche Mechanismen.
* Für externe Zugriffe sind weiterhin klassische DNS-Einträge oder ein Reverse Proxy erforderlich.

---

## 8. Zusammenfassung

Die DNS-basierte Service Discovery in Docker ist ein **integrierter Mechanismus**, der Container-Kommunikation einfach und stabil macht.

* Container im selben **benutzerdefinierten Netzwerk** können sich per **Name** erreichen.
* Das vermeidet harte IP-Vergaben und unterstützt **dynamisches Skalieren**.
* Besonders nützlich in **Microservices-Architekturen**, Docker-Compose-Umgebungen und verteilten Systemen.

Kurz gesagt: **Service-Namen sind der stabile Weg, Anwendungen in einer containerisierten Umgebung zu verbinden.**
