import { describe, expect, it } from 'vitest';
import { moveAndCollide, PLAYER_RADIUS, type Box } from './physics';

const floor: Box = { min: { x: -5, y: 0, z: -5 }, max: { x: 5, y: 1, z: 5 } };

describe('physics', () => {
  it('landet auf einer Plattform', () => {
    const pos = { x: 0, y: 1.2, z: 0 };
    const vel = { x: 0, y: -5, z: 0 };
    const onGround = moveAndCollide(pos, vel, 0.1, [floor]);
    expect(onGround).toBe(true);
    expect(pos.y).toBe(1);
    expect(vel.y).toBe(0);
  });

  it('fällt ohne Plattform weiter', () => {
    const pos = { x: 20, y: 1.2, z: 0 };
    const vel = { x: 0, y: -5, z: 0 };
    expect(moveAndCollide(pos, vel, 0.1, [floor])).toBe(false);
    expect(pos.y).toBeCloseTo(0.7);
  });

  it('Hindernis blockiert seitlich', () => {
    const wall: Box = { min: { x: 1, y: 1, z: -1 }, max: { x: 2, y: 2, z: 1 } };
    const pos = { x: 0, y: 1, z: 0 };
    const vel = { x: 10, y: 0, z: 0 };
    moveAndCollide(pos, vel, 0.1, [floor, wall]);
    expect(pos.x).toBeLessThan(1 - PLAYER_RADIUS + 0.01);
    expect(vel.x).toBe(0);
  });
});
