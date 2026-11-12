import { DEFAULT_OUTFIT, type Outfit } from './Outfit';

export const START_LIVES = 5;
export const MAX_TOMATOES = 10;
export const MAX_SPLATS = 30;

export const POINTS = {
  checkpoint: 100,
  monsterHit: 50,
  star: 10,
  goal: 500,
} as const;

export interface Splat {
  /** Position auf der Kleidung, 0..1 */
  x: number;
  y: number;
  size: number;
}

export class GameState {
  outfit: Outfit = { ...DEFAULT_OUTFIT };
  lives = START_LIVES;
  score = 0;
  tomatoes = 0;
  checkpoint = 0;
  splats: Splat[] = [];

  /** Neuer Lauf, Outfit bleibt erhalten. */
  startRun(): void {
    this.lives = START_LIVES;
    this.score = 0;
    this.tomatoes = 0;
    this.checkpoint = 0;
    this.splats = [];
  }

  get isGameOver(): boolean {
    return this.lives <= 0;
  }

  /** Zieht ein Leben ab. Gibt true zurück, wenn das Spiel vorbei ist. */
  loseLife(): boolean {
    if (this.lives > 0) this.lives--;
    return this.isGameOver;
  }

  addScore(points: number): void {
    this.score += points;
  }

  /** Nur neue (weiter vorne liegende) Checkpoints zählen. */
  reachCheckpoint(index: number): boolean {
    if (index <= this.checkpoint) return false;
    this.checkpoint = index;
    this.addScore(POINTS.checkpoint);
    return true;
  }

  pickUpTomatoes(count: number): number {
    const before = this.tomatoes;
    this.tomatoes = Math.min(MAX_TOMATOES, this.tomatoes + count);
    return this.tomatoes - before;
  }

  /** Gibt true zurück, wenn eine Tomate geworfen werden konnte. */
  throwTomato(): boolean {
    if (this.tomatoes <= 0) return false;
    this.tomatoes--;
    return true;
  }

  /** Kleidung wird von einer Tomate getroffen. */
  addSplat(random: () => number = Math.random): void {
    if (this.splats.length >= MAX_SPLATS) return;
    this.splats.push({ x: random(), y: random(), size: 0.08 + random() * 0.1 });
  }

  /** Wie dreckig die Kleidung ist (0 = sauber, 1 = total dreckig). */
  get dirtiness(): number {
    return this.splats.length / MAX_SPLATS;
  }
}
