import { describe, expect, it } from 'vitest';
import { TomatoProjectile } from './Tomato';

describe('TomatoProjectile', () => {
  it('fliegt in Wurfrichtung', () => {
    const t = TomatoProjectile.thrown({ x: 0, y: 2, z: 0 }, { x: 0, y: 0, z: -1 }, 'player');
    t.step(0.1, []);
    expect(t.pos.z).toBeLessThan(-1);
    expect(t.alive).toBe(true);
  });

  it('verschwindet beim Aufprall auf eine Wand', () => {
    const wall = { min: { x: -1, y: 0, z: -3 }, max: { x: 1, y: 5, z: -2 } };
    const t = TomatoProjectile.thrown({ x: 0, y: 2, z: 0 }, { x: 0, y: 0, z: -1 }, 'player');
    for (let i = 0; i < 20; i++) t.step(0.01, [wall]);
    expect(t.alive).toBe(false);
  });

  it('trifft ein Ziel in der Nähe', () => {
    const t = new TomatoProjectile({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, 'monster');
    expect(t.hits({ x: 0.5, y: 1, z: 0 })).toBe(true);
    expect(t.hits({ x: 5, y: 1, z: 0 })).toBe(false);
  });
});
