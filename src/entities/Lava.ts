/** Eine Lava-Blase: wächst, steigt etwas auf und platzt dann. */
export interface Bubble {
  x: number;
  z: number;
  age: number;
  lifetime: number;
  maxSize: number;
}

export const BUBBLE_COUNT = 60;

export function newBubble(random: () => number, centerZ: number, spread = 30): Bubble {
  return {
    x: (random() - 0.5) * spread,
    z: centerZ - (random() - 0.3) * spread * 1.5,
    age: 0,
    lifetime: 0.8 + random() * 1.5,
    maxSize: 0.15 + random() * 0.4,
  };
}

/** Grösse der Blase zum aktuellen Zeitpunkt (0 = geplatzt). */
export function bubbleSize(b: Bubble): number {
  if (b.age >= b.lifetime) return 0;
  return b.maxSize * Math.sin((b.age / b.lifetime) * Math.PI * 0.9 + 0.1);
}

/** Lässt die Blasen altern und ersetzt geplatzte durch neue in der Nähe des Spielers. */
export function updateBubbles(bubbles: Bubble[], dt: number, centerZ: number, random: () => number = Math.random): void {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].age += dt;
    if (bubbles[i].age >= bubbles[i].lifetime) bubbles[i] = newBubble(random, centerZ);
  }
}

/** Höhe der Lava-Oberfläche: sanfte Wellen. */
export function lavaWave(x: number, z: number, time: number): number {
  return Math.sin(x * 0.3 + time * 1.5) * 0.12 + Math.cos(z * 0.25 + time) * 0.12;
}
