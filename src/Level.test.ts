import { describe, expect, it } from 'vitest';
import { buildLevel, isInLava } from './Level';

describe('Level', () => {
  const level = buildLevel();

  it('hat Checkpoints, Körbe, Hindernisse und ein Ziel', () => {
    expect(level.checkpoints.length).toBeGreaterThanOrEqual(3);
    expect(level.baskets.length).toBeGreaterThan(0);
    expect(level.obstacles.length).toBeGreaterThan(0);
    expect(level.goal.z).toBeLessThan(level.checkpoints[level.checkpoints.length - 1].z);
  });

  it('alle Lücken sind springbar (< 4m, max 1m höher)', () => {
    for (let i = 1; i < level.platforms.length; i++) {
      const prev = level.platforms[i - 1];
      const cur = level.platforms[i];
      expect(prev.min.z - cur.max.z).toBeLessThan(4);
      expect(cur.max.y - prev.max.y).toBeLessThanOrEqual(1);
    }
  });

  it('Hindernisse sind niedrig genug zum Drüberspringen', () => {
    for (const o of level.obstacles) expect(o.max.y - o.min.y).toBeLessThanOrEqual(1);
  });

  it('erkennt Lava', () => {
    expect(isInLava({ x: 0, y: 0.1, z: 0 })).toBe(true);
    expect(isInLava({ x: 0, y: 1, z: 0 })).toBe(false);
  });
});
