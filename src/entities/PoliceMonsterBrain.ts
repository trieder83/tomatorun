import { distance, type Vec3 } from '../physics';

export const MONSTER_SPEED = 4.8;
export const MONSTER_CATCH_DISTANCE = 1.3;
export const MONSTER_STUN_TIME = 2;
export const MONSTER_THROW_INTERVAL = 3;
export const MONSTER_THROW_RANGE = 22;
export const MONSTER_START_DISTANCE = 16;

/** Verfolger-KI des Monster-Polizisten (ohne Rendering). Er fliegt über Lava. */
export class PoliceMonsterBrain {
  pos: Vec3 = { x: 0, y: 1, z: 0 };
  stunTimer = 0;
  throwTimer = MONSTER_THROW_INTERVAL;

  constructor(public speed = MONSTER_SPEED) {}

  /** Setzt das Monster hinter einen Punkt (Laufrichtung ist -z). */
  resetBehind(point: Vec3, dist = MONSTER_START_DISTANCE): void {
    this.pos = { x: point.x, y: point.y, z: point.z + dist };
    this.stunTimer = 0;
    this.throwTimer = MONSTER_THROW_INTERVAL;
  }

  stun(): void {
    this.stunTimer = MONSTER_STUN_TIME;
  }

  get isStunned(): boolean {
    return this.stunTimer > 0;
  }

  /** Bewegt das Monster Richtung Ziel. Gibt true zurück, wenn es eine Tomate wirft. */
  update(dt: number, target: Vec3): boolean {
    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
      return false;
    }
    const dx = target.x - this.pos.x;
    const dy = target.y - this.pos.y;
    const dz = target.z - this.pos.z;
    const len = Math.hypot(dx, dy, dz);
    if (len > 0.001) {
      const step = Math.min(len, this.speed * dt);
      this.pos.x += (dx / len) * step;
      this.pos.y += (dy / len) * step;
      this.pos.z += (dz / len) * step;
    }
    this.throwTimer -= dt;
    if (this.throwTimer <= 0 && len < MONSTER_THROW_RANGE) {
      this.throwTimer = MONSTER_THROW_INTERVAL;
      return true;
    }
    return false;
  }

  catches(target: Vec3): boolean {
    return !this.isStunned && distance(this.pos, target) < MONSTER_CATCH_DISTANCE;
  }
}
