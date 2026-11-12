import { describe, expect, it } from 'vitest';
import { bubbleSize, lavaWave, newBubble, updateBubbles } from './Lava';

describe('Lava-Blasen', () => {
  it('wachsen und platzen', () => {
    const b = newBubble(() => 0.5, 0);
    expect(bubbleSize(b)).toBeGreaterThan(0);
    b.age = b.lifetime / 2;
    expect(bubbleSize(b)).toBeCloseTo(b.maxSize, 1);
    b.age = b.lifetime;
    expect(bubbleSize(b)).toBe(0);
  });

  it('geplatzte Blasen werden ersetzt', () => {
    const bubbles = [newBubble(() => 0.5, 0)];
    updateBubbles(bubbles, 100, -50, () => 0.5);
    expect(bubbles[0].age).toBe(0);
    expect(bubbles[0].z).toBeLessThan(-40);
  });

  it('Lava-Oberfläche bewegt sich', () => {
    expect(lavaWave(1, 1, 0)).not.toBe(lavaWave(1, 1, 1));
    expect(Math.abs(lavaWave(3, 7, 2))).toBeLessThanOrEqual(0.24);
  });
});
