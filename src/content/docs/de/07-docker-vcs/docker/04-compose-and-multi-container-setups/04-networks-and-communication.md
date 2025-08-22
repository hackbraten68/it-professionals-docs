---
title: Netzwerke und Kommunikation
---
# Netzwerke & Kommunikation in Docker Compose

> **Ziel:** Verstehen, wie Container in einem Compose-Projekt einander finden und miteinander kommunizieren, wie man diese Kommunikation über Netzwerke steuert und wie man Services sauber und sicher nach außen verfügbar macht.

---

## 1. Überblick

* **Compose-Standard:** Alle Services in derselben `docker-compose.yml` werden in ein **projektbezogenes Bridge-Netzwerk** eingebunden (z. B. `<projekt>_default`).
* **Service Discovery:** Jeder Service kann andere über **DNS** erreichen, wobei der **Service-Name** als Hostname dient.
* **Ports vs. interne Kommunikation:** Container kommunizieren intern über ihre Container-Ports. **Ports veröffentlichen** muss man nur, wenn ein Container **vom Host oder Internet aus** erreichbar sein soll.

---

## 2. Standard-Netzwerk & Service Discovery

Beispiel:

```yaml
services:
  api:
    build: ./api
    depends_on:
      - db
  db:
    image: postgres:16
```

* Compose erstellt ein Netzwerk (z. B. `myapp_default`).
* `api` erreicht die Datenbank unter Hostname `db` am Standard-Postgres-Port `5432`.
* Typische Verbindungs-URL:

```bash
postgres://user:password@db:5432/mydb
```

**Wichtig:** Es sind **keine IP-Adressen nötig**. DNS im Netzwerk löst `db` → Container-IP.

---

## 3. Ports veröffentlichen (Host ↔ Container)

* **Interner Container-Traffic:** kein `ports:` erforderlich.
* **Externer Zugriff (Browser, curl vom Host):** Port veröffentlichen:

```yaml
services:
  api:
    build: ./api
    ports:
      - "8080:3000"  # host:container
```

* Zugriff vom Host: `http://localhost:8080`
* Innerhalb des Netzwerks: `http://api:3000`

**Achtung:** Innerhalb eines Containers bedeutet **`localhost` den Container selbst**.
Um den Host zu erreichen, nutze `host.docker.internal` (funktioniert auf Mac/Windows; auf Linux ggf. `--add-host=host.docker.internal:host-gateway` hinzufügen).

---

## 4. Mehrere Netzwerke zur Segmentierung

Nutze mehrere Netzwerke, um Komponenten zu isolieren:

```yaml
services:
  api:
    build: ./api
    networks: [app, dbnet]
  db:
    image: postgres:16
    networks: [dbnet]
  nginx:
    image: nginx:alpine
    networks: [app]

networks:
  app:
  dbnet:
```

* `nginx` hat **keinen Zugriff** auf `db`.
* `api` ist in beiden Netzwerken erreichbar.

**Warum:** Prinzip der minimalen Rechte, klarere Topologie, leichteres Debugging.

---

## 5. Netzwerk-Aliase & eigene Hostnames

* **Aliases:** Zusätzliche DNS-Namen vergeben:

```yaml
services:
  api:
    build: ./api
    networks:
      app:
        aliases: [backend, service-api]
networks:
  app: {}
```

* **Eigener Container-Name:** Möglich mit `container_name`, aber in Compose nicht empfohlen (Kollisionsgefahr). Lieber **Service-Namen** oder **Aliases** nutzen.

---

## 6. Netzwerk-Treiber in der Praxis

| Treiber   | Wo              | Funktion                               | Typischer Einsatz                                  |
| --------- | --------------- | -------------------------------------- | -------------------------------------------------- |
| `bridge`  | Lokal / Compose | NAT-Netzwerk pro Projekt               | Standard in fast allen Compose-Projekten           |
| `host`    | Nur Linux       | Teilt den Netzwerk-Namespace des Hosts | Hohe Performance, Apps die direkt Host-IP brauchen |
| `overlay` | Swarm/K8s       | Multi-Host-Netzwerk                    | Nicht für lokales Compose                          |
| `macvlan` | Fortgeschritten | Container erhalten eigene LAN-IP/MAC   | Legacy/IoT-Integration                             |

**Standard:** `bridge` – ändere nur, wenn nötig.

---

## 7. Health, Startreihenfolge & Verbindungsrobustheit

* `depends_on` wartet **nicht**, bis ein Service **bereit** ist – nur, bis er **gestartet** wurde.
* Für robuste Abläufe:

  * `healthcheck` nutzen
  * App-seitige Retry-Mechanismen einbauen

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER:-postgres}"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy
```

---

## 8. Externe Netzwerke (projektübergreifend nutzen)

Ein Service in ein existierendes Netzwerk hängen:

```bash
docker network create --driver bridge shared_net
```

```yaml
services:
  gateway:
    image: traefik:v3
    networks: [shared_net]

networks:
  shared_net:
    external: true
```

Sehr nützlich für einen **gemeinsamen Reverse Proxy** (Traefik, Caddy, Nginx).

---

## 9. IPv6, DNS & MTU

* **IPv6:** Aktivierbar über Docker-Daemon-Konfiguration.
* **DNS:** Docker stellt pro Netzwerk einen internen DNS-Server.
* **MTU-Probleme:** Besonders bei VPN/Cloud können falsche MTU-Werte Timeouts erzeugen. Lösung: MTU manuell setzen.

---

## 10. Sicherheitstipps

* Datenbanken in **privaten Netzwerken** (ohne `ports:`).
* Nur nötige Services miteinander verbinden.
* Keine Secrets ins Image packen → über `env`, `secrets` oder externe Stores.
* TLS am Reverse Proxy terminieren.

---

## 11. Praktische Muster

### A) Klassisches 3-Tier mit privater DB

```yaml
services:
  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    ports:
      - "8080:80"
    networks: [web]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://app:app@db:5432/appdb
    networks: [web, db]

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    volumes:
      - dbdata:/var/lib/postgresql/data
    networks: [db]

volumes:
  dbdata:

networks:
  web:
  db:
```

* `db` ist nicht nach außen erreichbar.
* `frontend` sieht nur `api`.

### B) Gemeinsamer Reverse Proxy

* `shared_net` einmalig erstellen.
* Proxy (Traefik, Nginx, Caddy) veröffentlicht 80/443.
* Alle Apps laufen intern ohne eigene Ports.

---

## 12. Troubleshooting & Monitoring

```bash
docker network ls               # Netzwerke anzeigen
docker network inspect <net>    # Details
docker compose exec api sh      # Test im Container
```

Typische Probleme:

* **Falsches `localhost`** → Service-Namen nutzen
* **Port belegt** → Host-Port ändern
* **DNS-Fehler** → Container nicht im selben Netzwerk

---

## 13. Zugriff auf den Host

* macOS/Windows: `http://host.docker.internal:<port>`
* Linux:

```yaml
services:
  api:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

---

## 14. Robuster App-Start (Beispiel Node.js)

```js
for (let i = 0; i < 10; i++) {
  try {
    await client.connect();
    break;
  } catch {
    await new Promise(r => setTimeout(r, 3000));
  }
}
```

---

## 15. Erweiterte Netzwerkmodi

* `network_mode: "host"`: Nutzt Host-Netzwerk direkt (nur Linux).
* `network_mode: "service:<name>"`: Teilt Namespace eines anderen Containers.
* `macvlan`: Container erhält eigene IP im LAN.

---

## 16. Übungen

1. **Ping per Service-Name**
2. **Netzwerk-Splitting (web vs. db)**
3. **Reverse Proxy mit externem Netzwerk**
4. **DB-Healthcheck + Retry im API-Start**

---

## 17. Kurzreferenz

```bash
docker network create my_net          # eigenes Netzwerk
```

```yaml
ports: ["80:80", "443:443"]           # mehrere Ports
```

---

## 18. Best Practices

* Service-Namen für interne Kommunikation.
* Nur nötige Ports veröffentlichen.
* Mehrere Netzwerke nutzen.
* Healthchecks + Retries einbauen.
* Reverse Proxy zentral nutzen.
* Keine IPs hardcoden → Docker-DNS.
* Secrets nicht ins Image.

---

## 19. Minimalbeispiel

```yaml
version: "3.9"

services:
  nginx:
    image: nginx:alpine
    ports: ["8080:80"]
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    networks: [web]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://app:app@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    networks: [web, db]

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
    volumes:
      - dbdata:/var/lib/postgresql/data
    networks: [db]

volumes:
  dbdata:

networks:
  web: {}
  db: {}
```

---

## 20. Wichtigste Erkenntnisse

* Compose-Netzwerke sind **DNS-basiert** und nutzen **Service-Namen**.
* Netzwerke bestimmen, **wer mit wem sprechen darf**.
* Ports nur veröffentlichen, wenn nötig.
* Stabilität durch **Healthchecks + Retries + Segmentierung**.
