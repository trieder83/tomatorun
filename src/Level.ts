import { PLAYER_HEIGHT, type Box, type Vec3 } from './physics';

export const LAVA_HEIGHT = 0.3;

export interface LevelData {
  platforms: Box[];
  obstacles: Box[];
  checkpoints: Vec3[];
  baskets: Vec3[];
  stars: Vec3[];
  goal: Vec3;
}

interface Segment {
  gap: number;
  length: number;
  width: number;
  x: number;
  top: number;
  obstacle?: boolean;
  checkpoint?: boolean;
  basket?: boolean;
}

/** Die Strecke: läuft in Richtung -z über einen Lavasee. */
const SEGMENTS: Segment[] = [
  { gap: 0, length: 14, width: 8, x: 0, top: 1, checkpoint: true, basket: true },
  { gap: 2.5, length: 6, width: 4, x: 0, top: 1 },
  { gap: 2.5, length: 6, width: 3, x: 2, top: 1.5 },
  { gap: 3, length: 10, width: 5, x: 0, top: 1.5, obstacle: true, basket: true },
  { gap: 2.5, length: 4, width: 3, x: -2, top: 2 },
  { gap: 2.5, length: 4, width: 3, x: 1, top: 2.5 },
  { gap: 3, length: 12, width: 6, x: 0, top: 2, checkpoint: true, basket: true },
  { gap: 3, length: 5, width: 2.5, x: 2, top: 2 },
  { gap: 3, length: 5, width: 2.5, x: -1, top: 2.5 },
  { gap: 3, length: 10, width: 5, x: 0, top: 2.5, obstacle: true, basket: true },
  { gap: 3.5, length: 4, width: 3, x: 0, top: 2.5 },
  { gap: 3.5, length: 12, width: 6, x: 0, top: 2, checkpoint: true, basket: true },
  { gap: 3, length: 4, width: 2, x: -2, top: 2.5 },
  { gap: 3, length: 4, width: 2, x: 0, top: 3 },
  { gap: 3, length: 4, width: 2, x: 2, top: 3.5 },
  { gap: 3, length: 10, width: 5, x: 0, top: 3, obstacle: true },
  { gap: 3, length: 14, width: 8, x: 0, top: 3 },
];

export function buildLevel(): LevelData {
  const level: LevelData = { platforms: [], obstacles: [], checkpoints: [], baskets: [], stars: [], goal: { x: 0, y: 0, z: 0 } };
  let z = 5; // Vorderkante des ersten Segments
  for (const s of SEGMENTS) {
    z -= s.gap;
    const front = z;
    const back = z - s.length;
    const center = (front + back) / 2;
    level.platforms.push({
      min: { x: s.x - s.width / 2, y: 0, z: back },
      max: { x: s.x + s.width / 2, y: s.top, z: front },
    });
    if (s.checkpoint) level.checkpoints.push({ x: s.x, y: s.top, z: front - 2 });
    if (s.obstacle) {
      level.obstacles.push({
        min: { x: s.x - s.width / 2, y: s.top, z: center - 0.4 },
        max: { x: s.x + s.width / 2, y: s.top + 0.8, z: center + 0.4 },
      });
    }
    if (s.basket) level.baskets.push({ x: s.x + s.width / 2 - 0.8, y: s.top, z: center + 2 });
    // Stern über jeder Lücke
    if (s.gap > 0) level.stars.push({ x: s.x, y: s.top + 1.2, z: front + s.gap / 2 });
    z = back;
  }
  const last = SEGMENTS[SEGMENTS.length - 1];
  level.goal = { x: last.x, y: last.top, z: z + 3 };
  return level;
}

export function isInLava(feet: Vec3): boolean {
  return feet.y < LAVA_HEIGHT;
}

export function eyeHeight(): number {
  return PLAYER_HEIGHT - 0.1;
}
