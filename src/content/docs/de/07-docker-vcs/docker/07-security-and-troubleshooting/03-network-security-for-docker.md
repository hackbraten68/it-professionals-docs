---
title: Netzwerksicherheit für Docker
---
# Netzwerksicherheit für Docker

Docker-Netzwerke sind leistungsfähig und flexibel, aber unsichere Konfigurationen können Container und Daten unnötigen Risiken aussetzen.
Die Absicherung von Docker-Netzwerken erfordert einen **mehrschichtigen Ansatz** – Begrenzung der Exponierung, Zugangskontrolle, Verschlüsselung der Kommunikation und Schutz vor Angriffen wie Spoofing oder DNS-Rebinding.

Dieser Leitfaden beschreibt **Best Practices für die Absicherung von Docker-Netzwerken**.

---

## Vermeide unnötiges Freigeben von Ports

Ein häufiger Fehler beim Einsatz von Docker-Containern ist das direkte Freigeben von Ports zum Host oder ins Internet ohne Einschränkungen.

### Warum das wichtig ist

* Freigegebene Ports vergrößern die Angriffsfläche, da externe Clients direkt auf Container zugreifen können.
* Angreifer können offene Ports scannen und Dienste mit schwachen Konfigurationen oder veralteter Software ausnutzen.

### Best Practices

* Nutze **Docker-Netzwerke**, um Dienste intern voneinander zu isolieren. Container können intern kommunizieren, ohne Ports nach außen freizugeben.
* Gib nur die Ports frei, die wirklich von extern benötigt werden.
* Verwende **benutzerdefinierte Bridge- oder Overlay-Netzwerke** für interne Kommunikation.
* Beispiel: Anstatt den Datenbank-Port direkt am Host freizugeben, sollte nur das Backend über ein internes Netzwerk darauf zugreifen.

```yaml
services:
  backend:
    image: my-backend
    ports:
      - "8080:8080"  # externer Zugriff notwendig
  database:
    image: postgres
    networks:
      - internal_net

networks:
  internal_net:
    driver: bridge
```

In diesem Beispiel ist die Datenbank vom externen Zugriff isoliert und nur für Container im Netzwerk `internal_net` erreichbar.

---

## Firewalls oder Reverse Proxies nutzen

### Warum das wichtig ist

Auch wenn Ports freigegeben werden müssen, kann direkter Zugriff riskant sein. Eine Firewall oder ein Reverse Proxy fungiert als **Torwächter** und bietet eine zusätzliche Sicherheitsschicht.

### Optionen

* **Nginx oder Traefik**: Reverse Proxies, die den Traffic steuern, TLS beenden und Routing-Regeln anwenden.
* **UFW (Uncomplicated Firewall)**: Host-basierte Firewall zur Steuerung des Netzwerkverkehrs.
* **iptables/nftables**: Fein granulierte Paketfilterung.

### Best Practices

* Setze einen Reverse Proxy an der Netzwerkschnittstelle ein, um **TLS zu terminieren** und Zugriffe zu steuern.
* Nutze **Firewalls**, um ungenutzte Ports zu blockieren und unautorisierten Zugriff auf den Docker-Host zu verhindern.
* Implementiere **Rate-Limiting** und **Request-Filterung** über den Proxy.

Beispiel mit UFW (Ubuntu):

```bash
# Erlaube HTTP und HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Alles andere blockieren
ufw default deny incoming
ufw default allow outgoing
```

---

## Daten während der Übertragung verschlüsseln

### Warum das wichtig ist

Unverschlüsselte Kommunikation zwischen Containern oder zwischen Clients und Diensten kann abgefangen werden (Man-in-the-Middle-Angriffe).
Sensible Daten – API-Aufrufe, Zugangsdaten, persönliche Informationen – müssen geschützt werden.

### Best Practices

* Verwende **TLS/SSL** für APIs, Webservices und interne Service-Kommunikation.
* Nutze **Let’s Encrypt** mit Traefik oder Nginx für automatisches Zertifikatsmanagement.
* Richte **mutual TLS (mTLS)** für besonders sensible Service-zu-Service-Kommunikation ein.
* Stelle sicher, dass in **Docker Swarm Overlay-Netzwerken** die Verschlüsselung (IPSec) aktiviert ist.

Beispiel: Verschlüsseltes Overlay-Netzwerk in Swarm:

```bash
docker network create \
  --driver overlay \
  --opt encrypted \
  secure_overlay
```

---

## DNS-Rebinding und Spoofing verhindern

### Warum das wichtig ist

Angreifer können Schwachstellen im DNS ausnutzen, um Container zu täuschen und sie mit manipulierten Endpunkten zu verbinden oder Zugriffskontrollen zu umgehen.
Das interne DNS-System von Docker ist praktisch, kann aber bei falscher Handhabung missbraucht werden.

### Best Practices

* **Eingaben validieren**: Hostnamen oder IPs aus unsicheren Quellen nie ungeprüft akzeptieren.
* Zugriff auf den **Docker-API-Socket** (`/var/run/docker.sock`) stark einschränken, um Manipulationen des DNS zu verhindern.
* In größeren Setups ggf. einen **dedizierten internen DNS-Server** mit strikten Regeln nutzen.
* **DNS-Logs überwachen**, um verdächtige Anfragen zu erkennen.

### Sicherheit des Docker API Sockets

Der Docker-Socket gewährt Root-Zugriff auf den Host und alle Container. Seine Exponierung über TCP oder Mounting in Container stellt ein **massives Sicherheitsrisiko** dar.

* Zugriff nur für vertrauenswürdige Administratoren oder Automatisierungstools gewähren.
* **Rootless Docker** nutzen, wo immer möglich.
* **TLS-Authentifizierung** einsetzen, wenn Remote-API-Zugriff erforderlich ist.

---

## Fazit

Die Absicherung von Docker-Netzwerken ist kein einmaliger Schritt, sondern ein **kontinuierlicher Prozess**:

* Minimierung freigegebener Ports und Isolierung von Diensten.
* Schutz durch Firewalls und Reverse Proxies.
* Verschlüsselung aller Datenübertragungen mit TLS.
* Schutz vor DNS-Angriffen durch Eingabevalidierung und restriktive API-Socket-Nutzung.

Durch diese mehrschichtige Herangehensweise lässt sich die Angriffsfläche von Docker-Deployments deutlich verringern und die Sicherheit sowie Zuverlässigkeit der Container-Umgebungen verbessern.
