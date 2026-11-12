# 🍅 Tomaten-Parkour

Ein buntes 3D-Browsergame in der Ego-Perspektive – entstanden in nur **45 Minuten** am **Zukunftstag bei Eviden**. Alle Ideen stammen von den teilnehmenden Kindern! 💡

Zieh dich schick an, renn über den blubbernden Lavasee, spring über Hindernisse und entkomme dem Monster-Polizisten – und wirf ihm dabei Tomaten an den Kopf!

## 🎮 Spielablauf

1. **Startbildschirm** – Titel und Start-Button
2. **Dress-up** – Wähle dein Outfit:
   - 👟 Schuhe: Sneaker, Stiefel, Flossen
   - 👕 Kleidung: T-Shirt, Kleid, Anzug
   - 🎩 Hut / Haare: Cap, Zylinder, Krone, Afro
3. **Parkour** – Lauf über bunte Plattformen bis ins Ziel
   - ❤️ Du startest mit **5 Leben**
   - 🔥 **Lava** am Boden kostet ein Leben
   - 👮 Ein **Monster-Polizist** verfolgt dich und wirft Tomaten
   - 🧱 **Hindernisse** musst du überspringen
   - 🚩 **Checkpoints**: Nach dem Tod geht es am letzten Checkpoint weiter
   - 💀 Bei 0 Leben: Game Over

## ✨ Features

- 🍅 **Tomaten** aus Körben aufheben und werfen – ein Treffer betäubt das Monster kurz
- 💦 **Dreckige Kleidung**: Wirst du von Tomaten getroffen, bekommt dein Outfit Flecken
- ⭐ **Punkte sammeln**: Sterne, Treffer, Checkpoints und das Ziel geben Punkte
- 🌋 Wellige, **blubbernde Lava** und ein blauer Himmel mit Wolken
- 🎨 **Cartoon-Look** mit Toon-Shading und schwarzen Umrissen

### Punkte

| Aktion | Punkte |
|---|---|
| Stern einsammeln | 10 |
| Monster mit Tomate treffen | 50 |
| Neuer Checkpoint | 100 |
| Ziel erreicht | 500 |

## ⌨️ Steuerung

| Taste | Aktion |
|---|---|
| Klick ins Bild | Maus einfangen / Spiel starten |
| `W` `A` `S` `D` / Pfeiltasten | Laufen |
| Maus | Umschauen |
| `Leertaste` | Springen |
| Linksklick | Tomate werfen |
| `E` | Tomaten aus dem Korb aufheben |

## 🚀 Starten

Voraussetzung: [Node.js](https://nodejs.org/) (Version 20 oder neuer)

```bash
npm install
npm run dev
```

Dann im Browser **http://localhost:5173** öffnen.

Weitere Befehle:

```bash
npm test         # alle Tests ausführen
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
```

## 🛠️ Technik

- **TypeScript** (strict)
- **Three.js** für die 3D-Grafik
- **Vite** als Entwicklungsserver und Build-Tool
- **Vitest** für Tests

## 📁 Projektstruktur

```
src/
  main.ts                  # Einstiegspunkt, Game-Loop, Szenenwechsel
  Level.ts                 # Aufbau der Parkour-Strecke
  physics.ts               # Kollision, Schwerkraft
  scenes/
    StartScreen.ts         # Startbildschirm
    DressUp.ts             # Outfit auswählen
    Parkour.ts             # Das eigentliche Spiel
  entities/
    PoliceMonsterBrain.ts  # Verfolger-KI des Monster-Polizisten
    Tomato.ts              # Wurf-Physik der Tomaten
    Lava.ts                # Lava-Wellen und Blasen
  render/
    Character.ts           # Cartoon-Figur mit Outfit
    toon.ts                # Toon-Material und Umrisse
  state/
    GameState.ts           # Leben, Punkte, Tomaten, Checkpoint, Flecken
    Outfit.ts              # Auswahl an Schuhen, Kleidung, Hüten
  ui/
    Hud.ts                 # Anzeige von Leben, Punkten, Tomaten
```

Die Spiellogik ist bewusst unabhängig vom 3D-Rendering geschrieben. So lässt sie sich einfach testen: Jedes Feature hat eine eigene `*.test.ts`-Datei direkt daneben.

## 💡 Über das Projekt

Dieses Spiel ist in einem **45-minütigen Workshop am Zukunftstag bei [Eviden](https://eviden.com/)** entstanden.

**Alle Ideen stammen von den teilnehmenden Kindern!** 🧒👧 Sie haben sich das Spielkonzept, die Genres, die Spielregeln und die Features selbst ausgedacht (siehe [`Notes.txt`](Notes.txt)) – vom Monster-Polizisten über die Lava bis zu den dreckigen Kleidern. Umgesetzt wurden ihre Ideen anschliessend gemeinsam mit Hilfe eines KI-Coding-Assistenten.

Ziel war es zu zeigen, wie aus ein paar Notizen in kurzer Zeit ein spielbares 3D-Spiel werden kann – und wie viel Spass Programmieren macht! 🚀

### Ideen zum Weitermachen

- Mehr Outfits und Farben
- Weitere Level mit beweglichen Plattformen
- Soundeffekte und Musik
- Highscore-Liste
- Die eigene Figur in der Ego-Ansicht sehen (Arme, Füsse)
