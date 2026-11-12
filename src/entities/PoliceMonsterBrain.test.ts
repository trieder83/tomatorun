import { describe, expect, it } from 'vitest';
import { MONSTER_STUN_TIME, MONSTER_THROW_INTERVAL, PoliceMonsterBrain } from './PoliceMonsterBrain';

describe('PoliceMonsterBrain', () => {
  it('kommt dem Spieler näher', () => {
    const m = new PoliceMonsterBrain(5);
    m.resetBehind({ x: 0, y: 1, z: 0 }, 10);
    m.update(1, { x: 0, y: 1, z: 0 });
    expect(m.pos.z).toBeCloseTo(5);
  });

  it('fängt den Spieler, wenn nah genug', () => {
    const m = new PoliceMonsterBrain();
    m.pos = { x: 0, y: 1, z: 0.5 };
    expect(m.catches({ x: 0, y: 1, z: 0 })).toBe(true);
    expect(m.catches({ x: 0, y: 1, z: -5 })).toBe(false);
  });

  it('bleibt betäubt stehen und fängt nicht', () => {
    const m = new PoliceMonsterBrain(5);
    m.pos = { x: 0, y: 1, z: 0.5 };
    m.stun();
    expect(m.catches({ x: 0, y: 1, z: 0 })).toBe(false);
    m.update(MONSTER_STUN_TIME / 2, { x: 0, y: 1, z: -10 });
    expect(m.pos.z).toBe(0.5);
    m.update(MONSTER_STUN_TIME, { x: 0, y: 1, z: -10 });
    expect(m.isStunned).toBe(false);
  });

  it('wirft regelmässig Tomaten', () => {
    const m = new PoliceMonsterBrain(0);
    m.resetBehind({ x: 0, y: 1, z: 0 }, 5);
    expect(m.update(MONSTER_THROW_INTERVAL - 0.1, { x: 0, y: 1, z: 0 })).toBe(false);
    expect(m.update(0.2, { x: 0, y: 1, z: 0 })).toBe(true);
  });
});
