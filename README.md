# 🔒 Sichere Rezept-App - Production-Ready PWA

Eine **sicherheitsgehärtete** Progressive Web App für Kochrezepte und Einkaufslisten, optimiert für GitHub Pages.

## 🎯 Highlights

- ✅ **Maximale Sicherheit** - Strikte CSP, kein XSS-Risiko
- ✅ **Keine innerHTML** - Nur sichere DOM-Manipulation
- ✅ **Input-Validierung** - Jede Eingabe wird geprüft
- ✅ **Blockierte SVGs** - Schutz vor SVG-basierten Angriffen
- ✅ **Schema-Validation** - Sichere Datenspeicherung
- ✅ **Modularer Code** - Wartbar und erweiterbar
- ✅ **Offline-fähig** - Service Worker für PWA
- ✅ **GitHub Pages ready** - Direkt deploybar

## 🚀 Quick Start

### Installation (GitHub Pages)

1. **GitHub Repository erstellen**
   ```
   https://github.com → New Repository
   Name: rezept-app
   Public
   ```

2. **Dateien hochladen**
   - Lade ALLE Dateien aus diesem Ordner hoch
   - Settings → Pages → Source: main branch → Save

3. **Fertig!**
   ```
   Deine App: https://username.github.io/rezept-app/
   ```

4. **Zum Home-Screen** (iPhone)
   - In Safari öffnen
   - Teilen → "Zum Home-Bildschirm"

## 📱 Features

### Rezeptverwaltung
- Rezepte mit Namen, Bildern, Portionen
- Zutaten mit Menge, Einheit, Bezeichnung
- Sichere Bild-Uploads (nur JPG/PNG/WebP, max 5MB)
- Anleitung/Zubereitung

### Einkaufsliste
- Mehrere Rezepte kombinieren
- Personenanzahl anpassen
- Automatische Mengenberechnung
- Intelligente Zusammenfassung
- Sortierung (alphabetisch/Kategorien)
- Artikel abhaken

### Kühlschrank-Check
- Vorhandene Zutaten eingeben
- Automatische Subtraktion
- Spart Zeit beim Einkaufen

## 🔒 Sicherheits-Features

### Content Security Policy
```
script-src 'self'           # Nur eigene Scripts
style-src 'self'            # Nur eigene Styles
img-src 'self' data: blob:  # Nur sichere Bilder
default-src 'none'          # Alles andere blockiert
```

### DOM-Sicherheit
- Keine `innerHTML`, `outerHTML`, `insertAdjacentHTML`
- Nur `createElement()` + `textContent`
- Keine Inline-Event-Handler
- Nur `addEventListener()`

### Input-Validierung
- Regex-Pattern für alle Texteingaben
- Längenlimits (Name: 200, Zutat: 100 Zeichen)
- Wertebereiche (Portionen: 1-100, Menge: 0.01-10000)
- Typ-Validierung (String, Number, etc.)

### Bild-Sicherheit
- **SVG blockiert** (XSS-Risiko)
- Nur JPG, PNG, WebP
- Max. 5MB pro Bild
- MIME-Type-Prüfung
- Base64-Validation

### Storage-Sicherheit
- Try-Catch um alle Operationen
- Schema-Validation vor Speichern
- Speicherlimit: 10MB
- Data-Sanitization
- Deep-Clone für Isolation

## 📊 Architektur

```
Strikte Modul-Trennung:
├── config.js        → Konstanten & Limits
├── validator.js     → Input-Validierung
├── sanitizer.js     → Daten-Bereinigung
├── storage.js       → Sichere Persistenz
├── dom-builder.js   → Sichere DOM-Erstellung
├── recipe-helpers.js → Business-Logik
├── router.js        → Navigation
└── views/           → UI-Komponenten
```

## 🛡️ Verwendete Security-Patterns

### Pattern 1: Sichere Text-Ausgabe
```javascript
// ❌ Unsicher
element.innerHTML = userInput;

// ✅ Sicher
element.textContent = userInput;
```

### Pattern 2: Validierung
```javascript
const result = Validator.validateRecipeName(input);
if (!result.valid) {
    showError(result.error);
    return;
}
const safeName = result.value; // Bereits sanitized
```

### Pattern 3: Storage
```javascript
const result = SecureStorage.saveRecipes(recipes);
if (!result.success) {
    handleError(result.error);
}
```

## 📝 Verwendung

### Rezept hinzufügen
1. Plus-Button (+) antippen
2. Felder ausfüllen (Name, Personen, Bild, Zutaten)
3. "Rezept speichern"

### Einkaufsliste erstellen
1. Tab "Einkaufen"
2. "Rezepte auswählen"
3. Rezepte markieren + Portionen anpassen
4. "Einkaufsliste erstellen"

### Kühlschrank-Check
1. In Einkaufsliste → "🧊 Kühlschrank-Check"
2. Vorhandene Zutaten eingeben
3. "Anwenden" → automatische Subtraktion

## ⚙️ Konfiguration

### Limits anpassen (config.js)
```javascript
MAX_IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
MAX_RECIPE_NAME_LENGTH: 200,
MAX_INGREDIENTS_COUNT: 50,
```

### Styles anpassen (styles.css)
```css
:root {
    --primary-color: #4CAF50; /* Deine Farbe */
}
```

## 🔧 Entwicklung

### Lokal testen
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Dann: http://localhost:8000
```

### Service Worker Cache aktualisieren
```javascript
// In sw.js
const CACHE_NAME = 'secure-rezept-app-v2'; // Version erhöhen
```

## 📱 Browser-Kompatibilität

- ✅ Safari (iOS 11.3+)
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Edge

**Empfohlen:** Safari auf iOS (beste PWA-Unterstützung)

## ⚠️ Wichtige Hinweise

### Datenspeicherung
- LocalStorage (~10MB Limit)
- Bei Browser-Reset → Daten weg
- Empfehlung: Wichtige Rezepte als Screenshot

### Bilder
- Base64-Speicherung → füllt Storage schnell
- Empfehlung: Max. 10-20 Bilder
- Große Bilder komprimieren

### Offline-Modus
- Erste Nutzung online → dann offline nutzbar
- Service Worker cached statische Assets
- Daten bleiben in LocalStorage

## 🐛 Troubleshooting

**CSP-Fehler in Console?**
- Keine Inline-Scripts verwenden
- Nur `addEventListener()` nutzen

**Bild wird nicht gespeichert?**
- Nur JPG/PNG/WebP erlaubt (kein SVG!)
- Max. 5MB Dateigröße
- Safari Foto-Zugriff erlauben

**Storage voll?**
- Limit: 10MB
- Alte Rezepte löschen
- Bilder komprimieren

**App lädt nicht?**
- Service Worker deregistrieren
- Browser-Cache leeren
- Neu laden

## 📊 Performance

- **Modulare Struktur** → Besseres Caching
- **Lazy Image Loading** → Schnellere Ladezeiten
- **Service Worker** → Offline-fähig
- **Minimale Dependencies** → Kleine Bundle-Size

## 🔐 Security Audit

Erfüllt:
- ✅ OWASP Top 10
- ✅ CSP Level 3
- ✅ No eval() Policy
- ✅ XSS Prevention
- ✅ Input Validation
- ✅ Safe DOM Manipulation
- ✅ HTTPS-only (via GitHub Pages)

## 📄 Lizenz

Für persönlichen Gebrauch.

## 🤝 Weiterentwicklung

Mögliche Erweiterungen:
- Export/Import von Rezepten (JSON)
- Druck-Funktion
- Kategorien/Tags
- Suchfunktion
- Mehrsprachigkeit
- Dark Mode

## 📞 Support

**Detaillierte Sicherheits-Dokumentation:** Siehe `SECURITY.md`

---

**Production-Ready · Security-Hardened · PWA-Optimized** 🔒✨
