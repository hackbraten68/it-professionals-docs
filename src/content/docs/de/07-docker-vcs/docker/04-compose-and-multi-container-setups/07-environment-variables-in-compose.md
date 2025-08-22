---
title: Umgebungsvariablen in Docker Compose
------

# Umgebungsvariablen in Docker Compose

> Umgebungsvariablen werden verwendet, um Container zu konfigurieren, ohne Werte direkt im Compose-File zu hinterlegen. Dadurch werden **Code** und **Konfiguration** sauber getrennt, **verschiedene Umgebungen** (z. B. Dev, Staging, Prod) unterstützt und das **Management von Secrets** vereinfacht (mit Einschränkungen – siehe „Sicherheit“ unten).

---

## 1. Quellen von Umgebungsvariablen

Compose löst Variablen aus mehreren Quellen auf. Die **Prioritätsreihenfolge** bestimmt, welcher Wert am Ende im Container ankommt.

**Höchste → Niedrigste Priorität:**

1. **Direkte Werte in `docker-compose.yml`**

   * Schlüssel `services.<name>.environment:`
2. **`env_file:` Einträge** in einem Service
3. **Shell-Umgebung** des `docker compose` Prozesses (exportierte Variablen im Terminal)
4. **`.env` Datei** im selben Verzeichnis wie das Compose-File
5. **Standardwerte im Compose-File** (z. B. `${VAR:-default}`)

> Wenn eine Variable mehrfach gesetzt ist, gewinnt diejenige mit **höherer Priorität**.

---

## 2. Zwei verschiedene Arten der Variablenverwendung

Es gibt **(A)** Variablen, die Compose selbst verwendet, um das YAML zu *rendern* (Interpolation), und **(B)** Variablen, die im **Container** zur Laufzeit verfügbar sind.

### A) Interpolation im Compose-File

```yaml
version: "3.9"
services:
  db:
    image: postgres:${POSTGRES_TAG:-16}
    ports:
      - "${DB_PORT:-5432}:5432"
```

* `POSTGRES_TAG` und `DB_PORT` werden **auf deinem Rechner** beim Parsen aufgelöst.
* Falls nicht definiert, werden die Standardwerte genutzt (`:-16`, `:-5432`).

### B) Variablen im Container (Runtime Env)

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

* Diese Werte stehen dann **innerhalb** des Containers als Umgebungsvariablen zur Verfügung.

---

## 3. Nutzung einer `.env` Datei

`.env` im gleichen Verzeichnis wie das Compose-File ablegen:

```dotenv
# .env
POSTGRES_PASSWORD=securepass
POSTGRES_USER=appuser
DB_PORT=5433
```

In YAML referenzieren:

```yaml
services:
  db:
    image: postgres
    ports:
      - "${DB_PORT}:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

**Hinweise**

* `.env` wird **automatisch** von Compose geladen (keine zusätzlichen Flags notwendig).
* Nicht in Git einchecken → in `.gitignore` aufnehmen.

---

## 4. `environment:` vs `env_file:`

### `environment:` (inline, für wenige Werte)

```yaml
services:
  api:
    image: node:20-alpine
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
```

### `env_file:` (für viele Werte)

```yaml
services:
  api:
    image: node:20-alpine
    env_file:
      - ./.env
      - ./api.env    # spätere Dateien überschreiben frühere
```

* Wenn eine Variable in beiden Varianten definiert ist, hat `environment:` Vorrang.

---

## 5. Variablen-Syntax & Operatoren

* **Referenz:** `${VAR}`
* **Standard, falls nicht gesetzt oder leer:** `${VAR:-default}`
* **Standard, nur falls nicht gesetzt (leerer String erlaubt):** `${VAR-default}`
* **Pflichtvariable (Fehler, falls nicht vorhanden):** `${VAR?Fehlermeldung}`
* **Escape `$`**: `$$` für ein echtes Dollarzeichen

**Beispiel:**

```yaml
services:
  worker:
    image: myorg/worker:${WORKER_TAG:-latest}
    environment:
      QUEUE: ${QUEUE?You must set QUEUE}
      HOME_HINT: "Use $$HOME for your home directory"
```

---

## 6. Mehrere Umgebungen (dev / staging / prod)

### Option A: mehrere `.env` Dateien

```bash
.env.development
.env.staging
.env.production
```

Aktiv laden:

```bash
set -a
. .env.production
set +a
docker compose up -d
```

### Option B: Override-Files

* `docker-compose.yml` (Basis)
* `docker-compose.override.yml` (automatisch angewendet)
* `docker-compose.prod.yml` (per Flag aktivieren)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Option C: Profiles

```yaml
services:
  db:
    image: postgres
  grafana:
    image: grafana/grafana
    profiles: ["observability"]
```

```bash
COMPOSE_PROFILES=observability docker compose up -d
```

---

## 7. Praxisbeispiel: PostgreSQL + App

**`.env`**

```dotenv
POSTGRES_PASSWORD=supersecret
POSTGRES_USER=app
POSTGRES_DB=appdb
DB_PORT=5432
```

**`docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16
    ports:
      - "${DB_PORT:-5432}:5432"
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-postgres}
    volumes:
      - db-data:/var/lib/postgresql/data

  api:
    build: ./api
    depends_on: [db]
    environment:
      DATABASE_URL: "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${DB_PORT:-5432}/${POSTGRES_DB}"
      NODE_ENV: ${NODE_ENV:-development}

volumes:
  db-data:
```

---

## 8. Debugging & Überprüfung

* **Final gerendertes Config anzeigen:**

  ```bash
  docker compose config
  ```

* **Umgebungsvariablen im Container prüfen:**

  ```bash
  docker compose exec api env | sort
  ```

---

## 9. Sicherheitshinweise

* Secrets **nicht** in Git einchecken → `.gitignore` nutzen.
* `.env` ist **nicht verschlüsselt**.
* Für sensible Werte besser **Docker Secrets** oder externe **Secret Manager** verwenden.

### Beispiel: Compose Secrets

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
```

**Wann von `.env` weggehen?**

* Produktion
* Geteilte Umgebungen
* Compliance-Anforderungen

→ Vault, AWS Secrets Manager, GCP Secret Manager, Kubernetes-Secrets etc.

---

## 10. Windows, Quoting & Formatierung

* **Line Endings:** `.env` mit LF, nicht CRLF
* **Quoting:** keine Anführungszeichen nutzen (werden Teil des Wertes)
* **Leere Werte:** `KEY=` → leerer String
* **Kommentare:** `#` am Zeilenanfang

---

## 11. Build-Time vs Run-Time: `ARG` vs `ENV`

* **`ARG`**: nur beim Build verfügbar
* **`ENV`**: landet im Image und ist zur Laufzeit sichtbar

---

## 12. Validierungsmuster

```yaml
services:
  api:
    environment:
      JWT_SECRET: ${JWT_SECRET?You must set JWT_SECRET}
```

---

## 13. Checkliste

* [ ] Secrets in `.env` (Dev) oder Secret Manager (Prod)
* [ ] `.env` in `.gitignore`
* [ ] Defaults mit `${VAR:-default}`
* [ ] `docker compose config` nutzen
* [ ] `env_file:` für viele Variablen
* [ ] Interpolation vs. Container-Variablen im Kopf behalten

---

## 14. Minimalbeispiel

**`.env`**

```dotenv
POSTGRES_PASSWORD=securepass
```

**`docker-compose.yml`**

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

**Gut weil:**

* Secrets nicht im Code
* Verschiedene Passwörter je Umgebung möglich

---

## 15. Troubleshooting Quick-Hits

* **Var greift nicht?** → `docker compose config` prüfen
* **Falscher Port?** → Defaults vs. Container prüfen
* **Dollarzeichen?** → mit `$$` escapen
* **Windows-Problem?** → `.env` Encoding checken (UTF-8, LF)

---

**Kurzfassung (TL;DR):**
Mit `.env` und `env_file:` Konfiguration **auslagern**, mit `environment:` Werte **ins Runtime-Environment** geben, mit `${VAR}` **parameterisieren** und für Produktion **Secrets oder Secret Manager** einsetzen.
