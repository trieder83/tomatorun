import { distance, GRAVITY, pointInBox, type Box, type Vec3 } from '../physics';

export const TOMATO_SPEED = 20;
export const TOMATO_HIT_RADIUS = 1.1;

export type TomatoOwner = 'player' | 'monster';

/** Flugbahn einer Tomate (ohne Rendering). */
export class TomatoProjectile {
  alive = true;
  age = 0;

  constructor(public pos: Vec3, public vel: Vec3, public owner: TomatoOwner) {}

  /** Erzeugt eine Tomate, die von "from" Richtung "dir" fliegt. */
  static thrown(from: Vec3, dir: Vec3, owner: TomatoOwner, speed = TOMATO_SPEED): TomatoProjectile {
    const len = Math.hypot(dir.x, dir.y, dir.z) || 1;
    return new TomatoProjectile(
      { ...from },
      { x: (dir.x / len) * speed, y: (dir.y / len) * speed + 2, z: (dir.z / len) * speed },
      owner,
    );
  }

  step(dt: number, solids: Box[]): void {
    if (!this.alive) return;
    this.age += dt;
    this.vel.y -= GRAVITY * 0.5 * dt;
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.pos.z += this.vel.z * dt;
    if (this.pos.y < 0 || this.age > 5 || solids.some((b) => pointInBox(this.pos, b))) {
      this.alive = false;
    }
  }

  hits(target: Vec3, radius = TOMATO_HIT_RADIUS): boolean {
    return this.alive && distance(this.pos, target) < radius;
  }
}
