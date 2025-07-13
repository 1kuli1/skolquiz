# Klinkekula Interaktivt Frågespel

Detta projekt innehåller:
- En HTML-baserad frågeapp för pedagoger
- ESP32-kod för huvudkula och svarskulor
- JSON-fil med exempeldata

## Katalogstruktur
- `html-app/` – Frågegränssnitt i webbläsare
- `esp32/` – Arduino-kod för huvud- och svarskulor
- `data/` – JSON-fil med frågor

## Användning
1. Öppna `html-app/index.html` i en webbläsare
2. Välj årskurs, ämne och fråga
3. ESP32-enhet tar emot frågan via WiFi eller lokal server
