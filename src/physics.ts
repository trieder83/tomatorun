export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Box {
  min: Vec3;
  max: Vec3;
}

export const GRAVITY = 22;
export const PLAYER_RADIUS = 0.35;
export const PLAYER_HEIGHT = 1.7;

export function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

/** Spieler-Box (pos = Füße) überlappt mit Box? */
export function overlapsPlayer(p: Vec3, b: Box): boolean {
  return (
    p.x + PLAYER_RADIUS > b.min.x &&
    p.x - PLAYER_RADIUS < b.max.x &&
    p.y + PLAYER_HEIGHT > b.min.y &&
    p.y < b.max.y &&
    p.z + PLAYER_RADIUS > b.min.z &&
    p.z - PLAYER_RADIUS < b.max.z
  );
}

export function pointInBox(p: Vec3, b: Box): boolean {
  return (
    p.x > b.min.x && p.x < b.max.x && p.y > b.min.y && p.y < b.max.y && p.z > b.min.z && p.z < b.max.z
  );
}

/**
 * Bewegt den Spieler Achse für Achse und schiebt ihn aus Boxen heraus.
 * Verändert pos und vel. Gibt zurück, ob der Spieler auf dem Boden steht.
 */
export function moveAndCollide(pos: Vec3, vel: Vec3, dt: number, boxes: Box[]): boolean {
  let onGround = false;
  for (const axis of ['x', 'z', 'y'] as const) {
    const v = vel[axis];
    if (v === 0) continue;
    pos[axis] += v * dt;
    for (const b of boxes) {
      if (!overlapsPlayer(pos, b)) continue;
      if (axis === 'y') {
        if (v < 0) {
          pos.y = b.max.y;
          onGround = true;
        } else {
          pos.y = b.min.y - PLAYER_HEIGHT;
        }
        vel.y = 0;
      } else {
        pos[axis] = v > 0 ? b.min[axis] - PLAYER_RADIUS - 1e-4 : b.max[axis] + PLAYER_RADIUS + 1e-4;
        vel[axis] = 0;
      }
    }
  }
  return onGround;
}
