---
title: Docker Compose und Networking
---
# Docker Compose und Networking

Docker Compose ist ein leistungsstarkes Werkzeug, das die Definition und Orchestrierung von Multi-Container-Anwendungen vereinfacht. Mit Compose können Entwickler den gesamten Anwendungs-Stack – einschließlich Services, Volumes und Netzwerke – in einer einzigen YAML-Konfigurationsdatei (`docker-compose.yml`) beschreiben.

Ein zentrales Feature von Docker Compose ist das **automatische Networking**: Wenn mehrere Services gemeinsam gestartet werden, stellt Compose sicher, dass Container nahtlos miteinander kommunizieren können.

---

## 1. Automatische Netzwerkerstellung

Beim Start eines Docker-Compose-Projekts (z. B. mit `docker-compose up`) erstellt Compose automatisch ein **projektspezifisches Netzwerk**.

* Alle in der `docker-compose.yml` definierten Services werden standardmäßig mit diesem Netzwerk verbunden.
* Jeder Service kann die anderen über den **Servicenamen** ansprechen, anstatt IP-Adressen zu verwenden.
* Dadurch entfällt das Hardcoding von IPs und das System wird **dynamischer und portabler**.

**Beispiel:**

```yaml
services:
  backend:
    image: node
  frontend:
    image: nginx
```

In diesem Setup:

* Ein Standard-Netzwerk (meist `<projekt>_default`) wird automatisch erstellt.
* Sowohl `backend` als auch `frontend` treten diesem Netzwerk bei.
* Der `frontend`-Service kann den `backend`-Service über den Hostnamen `backend` erreichen (z. B. `http://backend:PORT`).

---

## 2. Vorteile des Compose-Networkings

* **Namensauflösung über Servicenamen**
  Jeder Container ist über den in der Compose-Datei vergebenen Servicenamen erreichbar.

* **Isolation und Sicherheit**
  Jedes Compose-Projekt verfügt über ein eigenes isoliertes Netzwerk, was Konflikte reduziert und die Sicherheit erhöht.

* **Flexibilität**
  Man kann das Standardnetzwerk überschreiben oder eigene Netzwerke definieren.

* **Portabilität**
  Da Docker das Networking verwaltet, muss man sich nicht um host-spezifische Netzwerkkonfigurationen kümmern.

---

## 3. Eigene Netzwerke in Compose

Man ist nicht auf das Standardnetzwerk beschränkt. Eigene Netzwerke können definiert werden, um die Kommunikation gezielt zu strukturieren.

**Beispiel:**

```yaml
services:
  backend:
    image: node
    networks:
      - custom_net

  frontend:
    image: nginx
    networks:
      - custom_net

networks:
  custom_net:
    driver: bridge
```

In diesem Beispiel:

* Ein benutzerdefiniertes Netzwerk namens `custom_net` wird explizit definiert.
* Sowohl `backend` als auch `frontend` werden diesem Netzwerk zugewiesen.
* Das Standardnetzwerk wird ignoriert, zugunsten eines klar kontrollierten eigenen Netzwerks.

---

## 4. Umbenennen des Standardnetzwerks

Manchmal ist es sinnvoll, dem Standardnetzwerk einen eigenen Namen zu geben, z. B. für eine bessere Übersicht oder Integration mit anderen Tools.

**Beispiel:**

```yaml
networks:
  default:
    name: my-custom-network
```

In diesem Fall heißt das Standardnetzwerk nicht `<projekt>_default`, sondern einfach `my-custom-network`.

---

## 5. Erweiterte Netzwerk-Szenarien

* **Mehrere Netzwerke**
  Ein Service kann auch mehreren Netzwerken beitreten, wenn er mit unterschiedlichen Servicegruppen kommunizieren muss.

```yaml
services:
  backend:
    image: node
    networks:
      - internal
      - external

networks:
  internal:
  external:
```

* **Externe Netzwerke**
  Man kann Services an Netzwerke anbinden, die **außerhalb von Compose** erstellt wurden.

```yaml
networks:
  external_net:
    external: true
```

Dies ist besonders nützlich, wenn man Compose-Services in ein bereits existierendes Containersystem integrieren möchte.

---

## 6. Zusammenfassung

* Docker Compose erstellt automatisch ein gemeinsames, projektspezifisches Netzwerk für alle Services.
* Services kommunizieren untereinander über **Servicenamen** statt IP-Adressen.
* Standardnetzwerke lassen sich überschreiben oder durch **eigene/externe Netzwerke** ersetzen.
* Das macht Multi-Container-Umgebungen **portabel, sicher und leicht wartbar**.

Durch den Einsatz von Docker Compose Networking können Entwickler skalierbare und wartbare Microservice-Architekturen entwerfen, ohne sich um IP-Adressen oder komplexe Netzwerkeinstellungen kümmern zu müssen.
