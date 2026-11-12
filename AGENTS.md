# AGENTS.md

## Projektübersicht
Ein 3D-Browsergame in der Ego-Perspektive (First Person), gebaut mit **TypeScript** und **Three.js**.
Es kombiniert die Genres **Parkour**, **Jump & Run**, **Dress-up** und **Tomatenwerfen**.

## Technologie
- Plattform: Browser
- Sprache: TypeScript
- 3D-Engine: Three.js
- Kamera: First Person
- Grafikstil: Cartoon (bunte Farben, einfache Formen, Toon-Shading, z. B. `MeshToonMaterial`)

## Spielablauf
1. **Startbildschirm**
   - Titel und Start-Button

2. **Dress-up**
   - Schuhe auswählen
   - Kleidung auswählen
   - Hut / Frisur auswählen
   - Die Auswahl wird für den Parkour gespeichert

3. **Parkour**
   - Spieler startet mit **5 Leben**
   - **Lava am Boden**: Berührung kostet ein Leben
   - **Monster-Polizist** verfolgt den Spieler
   - Spieler muss über **Hindernisse** springen
   - **Checkpoints**: Nach dem Tod startet der Spieler am letzten Checkpoint neu
   - Bei 0 Leben: Game Over

4. **Tomaten**
   - Auf dem Weg stehen **Körbe mit Tomaten**
   - Der Spieler kann Tomaten aufheben und werfen

## Features
- Kleidung wird durch Tomaten **dreckig** (sichtbare Flecken auf der Kleidung)
- **Punkte sammeln** (Punktestand im HUD anzeigen)
- HUD: Leben, Punkte, Anzahl Tomaten

## Vorgeschlagene Projektstruktur
```
src/
  main.ts            # Einstiegspunkt, Game-Loop
  scenes/
    StartScreen.ts
    DressUp.ts
    Parkour.ts
  entities/
    Player.ts        # First-Person-Steuerung, Springen, Leben
    PoliceMonster.ts # Verfolger-KI
    Tomato.ts        # Wurf-Physik, Treffer, Flecken
    TomatoBasket.ts
    Checkpoint.ts
    Obstacle.ts
    Lava.ts
  ui/
    Hud.ts
  state/
    GameState.ts     # Outfit, Leben, Punkte, letzter Checkpoint
```

## Richtlinien für Agents
- Strikt typisiertes TypeScript verwenden (`strict: true`)
- Szenen und Spielobjekte als eigene Klassen/Module kapseln
- Spielzustand (Leben, Punkte, Outfit, Checkpoint) zentral in `GameState` halten
- Cartoon-Stil konsistent halten
- Code einfach und verständlich halten (Projekt für den Zukunftstag)

## Tests
- **Jedes Feature braucht einen Test.** Ein Feature gilt erst als fertig, wenn es getestet ist.
- Spiellogik (Leben, Punkte, Checkpoints, Outfit, Tomaten, dreckige Kleidung, Verfolger-KI) möglichst unabhängig von Three.js-Rendering schreiben, damit sie einfach testbar ist
- Tests liegen neben dem Code als `*.test.ts`
- Vor jedem Abschluss einer Aufgabe alle Tests ausführen; sie müssen grün sein
