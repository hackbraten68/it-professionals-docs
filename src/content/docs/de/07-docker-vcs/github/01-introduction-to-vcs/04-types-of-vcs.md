---
title: Arten von Versionskontrollsystemen
---

Versionskontrollsysteme (VCS) lassen sich grob in zwei Haupttypen unterteilen: **Zentralisierte VCS (CVCS)** und **Verteilte VCS (DVCS)**. Jede Herangehensweise hat ihre eigene Architektur, ihre Vorteile und ihre Anwendungsfälle. Das Verständnis der Unterschiede ist entscheidend, um das richtige Werkzeug für ein Projekt oder eine Organisation auszuwählen.

---

## 1. Zentralisierte Versionskontrollsysteme (CVCS)

### Beschreibung
In einem **zentralisierten Versionskontrollsystem** gibt es einen einzigen zentralen Server, der das gesamte Repository speichert – einschließlich aller Versionen der Projektdateien. Entwickler agieren als Clients, die sich mit diesem Server verbinden, um Dateien auszuchecken, Änderungen einzuspielen und ihre lokalen Kopien zu aktualisieren.

### Merkmale
- **Ein zentraler Speicherort**: Alle Projekthistorien und Versionen werden auf einem Server gespeichert.
- **Netzwerkabhängigkeit**: Entwickler benötigen eine stabile Netzwerkverbindung, um mit dem Repository zu arbeiten.
- **Einfaches Berechtigungsmanagement**: Da alles über den zentralen Server läuft, ist die Verwaltung von Zugriffsrechten und die Überwachung der Aktivitäten leichter.

### Arbeitsablauf
1. Der Entwickler fordert die aktuelle Version des Projekts vom Server an.  
2. Dateien werden auf den lokalen Rechner heruntergeladen.  
3. Änderungen werden vorgenommen und wieder auf den Server übertragen (committed).  
4. Andere Entwickler können ihre Kopien aktualisieren und die neuen Änderungen abrufen.  

### Vorteile
- **Einfachheit**: Das Modell ist leicht verständlich, besonders für Anfänger.  
- **Kontrolle**: Administratoren können Zugriffe leicht verwalten und Beiträge überwachen.  
- **Konsistenz**: Alle Entwickler arbeiten stets mit derselben zentralen Quelle.  

### Nachteile
- **Single Point of Failure**: Fällt der zentrale Server aus, können keine Änderungen mehr eingespielt oder abgerufen werden.  
- **Abhängigkeit vom Netzwerk**: Ohne Serverzugriff ist produktives Arbeiten kaum möglich.  
- **Geringe Flexibilität**: Offline-Arbeiten ist nicht möglich.  

### Beispiele
- **CVS (Concurrent Versions System)**  
- **Subversion (SVN)**  

---

## 2. Verteilte Versionskontrollsysteme (DVCS)

### Beschreibung
In einem **verteilten Versionskontrollsystem** besitzt jeder Entwickler eine vollständige lokale Kopie des Repositories, einschließlich der gesamten Projekthistorie. Anstatt sich ausschließlich auf einen zentralen Server zu verlassen, erfolgt die Zusammenarbeit durch das Teilen und Zusammenführen von Repositories zwischen den Teammitgliedern.

### Merkmale
- **Lokale Repositories**: Jeder Entwickler hat das komplette Projekt auf seinem Rechner.  
- **Offline-Arbeiten**: Commits, Branching und das Durchsehen der Historie sind auch ohne Netzwerk möglich.  
- **Dezentralisierte Zusammenarbeit**: Änderungen werden durch Push- und Pull-Operationen zwischen Repositories ausgetauscht.  

### Arbeitsablauf
1. Der Entwickler klont ein Repository und erhält eine vollständige Kopie auf seinem Rechner.  
2. Änderungen werden lokal vorgenommen und versioniert.  
3. Updates werden mit anderen geteilt, indem sie an ein zentrales oder gemeinsames Remote-Repository gepusht oder von dort gepullt werden.  
4. Branches und Merges sind Standard, um parallele Entwicklungen zu koordinieren.  

### Vorteile
- **Offline-Fähigkeit**: Entwickler können unabhängig vom Netzwerk arbeiten.  
- **Ausfallsicherheit**: Da jeder eine Kopie besitzt, geht keine Historie durch Serverausfälle verloren.  
- **Flexible Zusammenarbeit**: Entwickler können frei experimentieren und später ihre Arbeit zusammenführen.  
- **Performance**: Lokale Operationen (Commits, Diffs, Logs) sind schneller, da sie ohne Netzwerkanfragen auskommen.  

### Nachteile
- **Komplexität**: Der Workflow ist komplexer und erfordert mehr Einarbeitung.  
- **Datenredundanz**: Jede vollständige Kopie benötigt zusätzlichen Speicherplatz.  

### Beispiele
- **Git**  
- **Mercurial**  

---

## Vergleich: CVCS vs. DVCS

| Aspekt               | Zentralisierte VCS (CVCS)    | Verteilte VCS (DVCS)       |
| -------------------- | ---------------------------- | -------------------------- |
| Repository-Modell    | Ein zentrales Repository     | Jeder Benutzer hat eine Kopie |
| Offline-Arbeiten     | Nicht möglich                | Voll unterstützt           |
| Netzwerkabhängigkeit | Hoch                         | Gering                     |
| Single Point of Failure | Serverausfall blockiert Arbeit | Redundanz durch viele Kopien |
| Lernkurve            | Leicht verständlich          | Anspruchsvoller            |
| Beispiele            | CVS, SVN                     | Git, Mercurial             |

---

## Fazit
Sowohl **zentralisierte** als auch **verteilte** Versionskontrollsysteme haben ihre Stärken und Schwächen.  
- **CVCS** eignet sich für kleine Teams und ist leicht verständlich, leidet aber unter der Abhängigkeit vom Server.  
- **DVCS**, wie Git, bietet Flexibilität, Ausfallsicherheit und ermöglicht Offline-Arbeiten – daher ist es heute der Standard für die meisten Softwareprojekte.  

Die Wahl hängt letztlich von der Teamgröße, den Projektanforderungen und den Kollaborationsbedürfnissen ab.
