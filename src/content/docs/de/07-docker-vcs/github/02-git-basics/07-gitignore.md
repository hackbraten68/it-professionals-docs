---
title: .gitignore
---

Eine `.gitignore`-Datei wird in Git-Projekten verwendet, um festzulegen, welche Dateien und Verzeichnisse von Git ignoriert werden sollen. Das bedeutet, dass Git diese Dateien nicht überwacht und sie nicht in das Repository übernommen werden. Das Ignorieren unnötiger oder sensibler Dateien hilft dabei, das Repository sauber, sicher und effizient zu halten.

---

## Warum eine `.gitignore` verwenden?

1. **Unnötige Dateien ausschließen**  
   Verhindert, dass temporäre Build-Ergebnisse, Logs oder editor-spezifische Einstellungen das Repository überladen.

2. **Sensible Informationen schützen**  
   Hält Umgebungsvariablen, API-Keys und private Konfigurationsdateien (z. B. `.env`) aus der Versionskontrolle heraus.

3. **Performance verbessern**  
   Große Verzeichnisse wie `node_modules/` oder kompilierte Binärdateien können Git stark verlangsamen. Das Ignorieren dieser Dateien sorgt für eine bessere Geschwindigkeit.

4. **Konsistenz im Team gewährleisten**  
   Eine gemeinsame `.gitignore`-Datei stellt sicher, dass alle Teammitglieder dieselben Regeln nutzen und keine unerwünschten Dateien committen.

---

## Aufbau einer `.gitignore`-Datei

- Jede Zeile definiert ein Muster.
- Leere Zeilen werden ignoriert.
- Zeilen, die mit `#` beginnen, sind Kommentare.
- Muster können einzelne Dateien, ganze Verzeichnisse oder Dateigruppen mit Platzhaltern betreffen.

---

## Häufige Muster

### Verzeichnisse ignorieren

```bash
node_modules/
dist/
build/
```

* Der abschließende `/` zeigt an, dass ein komplettes Verzeichnis ignoriert wird.

### Bestimmte Dateien ignorieren

```bash
.env
config.json
```

* Nützlich für sensible Konfigurationsdateien.

### Dateitypen ignorieren

```bash
*.log
*.tmp
*.swp
```

* Das `*` ist ein Platzhalter für beliebig viele Zeichen.
  Beispiel: `*.log` ignoriert alle Log-Dateien.

### Regeln negieren

```bash
*.log
!important.log
```

* Das Präfix `!` bedeutet „nicht ignorieren“.
  In diesem Beispiel werden alle `.log`-Dateien ignoriert – außer `important.log`.

---

## Beispiel einer `.gitignore`-Datei

```bash
# Abhängigkeiten
node_modules/
vendor/

# Build-Ausgaben
dist/
build/

# Umgebungsvariablen
.env

# Logs
*.log

# Editor-/IDE-Einstellungen
.vscode/
.idea/
*.swp
```

---

## Globale `.gitignore`

Manchmal möchte man Dateien **in allen Repositories** ignorieren, z. B. systembedingte oder editor-spezifische Dateien.
Dafür kann man eine **globale gitignore**-Datei anlegen:

```bash
git config --global core.excludesfile ~/.gitignore_global
```

In `~/.gitignore_global` können dann Regeln wie folgt hinterlegt werden:

```bash
# macOS
.DS_Store

# Windows
Thumbs.db

# Linux
*~
```

---

## Best Practices

1. **Regelmäßig aktualisieren**: Passe die `.gitignore`-Datei an, wenn sich das Projekt weiterentwickelt.
2. **Keine wichtigen Dateien ignorieren**: Stelle sicher, dass wichtige Konfigurationen und Dokumentationen im Repository bleiben.
3. **Vorlagen nutzen**: GitHub stellt `.gitignore`-Vorlagen für verschiedene Sprachen und Frameworks bereit:
   [https://github.com/github/gitignore](https://github.com/github/gitignore)
4. **Mit dem Team teilen**: Committe die `.gitignore`-Datei ins Repository, sodass alle Teammitglieder dieselben Regeln nutzen.

---

## Zusammenfassung

* Eine `.gitignore`-Datei legt fest, welche Dateien Git nicht verfolgen soll.
* Sie sorgt für bessere Performance, mehr Sicherheit und ein sauberes Projekt.
* Muster können für Verzeichnisse, bestimmte Dateien oder ganze Dateitypen definiert werden – mit der Möglichkeit, Ausnahmen hinzuzufügen.
* Es gibt sowohl projektbezogene als auch globale `.gitignore`-Dateien.
* Durch Best Practices bleibt das Repository professionell und übersichtlich.
