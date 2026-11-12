import { describe, expect, it } from 'vitest';
import { GameState, MAX_SPLATS, MAX_TOMATOES, POINTS, START_LIVES } from './GameState';

describe('GameState', () => {
  it('startet mit 5 Leben', () => {
    const s = new GameState();
    expect(s.lives).toBe(START_LIVES);
    expect(START_LIVES).toBe(5);
  });

  it('Game Over bei 0 Leben', () => {
    const s = new GameState();
    for (let i = 0; i < 4; i++) expect(s.loseLife()).toBe(false);
    expect(s.loseLife()).toBe(true);
    expect(s.lives).toBe(0);
    s.loseLife();
    expect(s.lives).toBe(0);
  });

  it('Checkpoints zählen nur vorwärts und geben Punkte', () => {
    const s = new GameState();
    expect(s.reachCheckpoint(1)).toBe(true);
    expect(s.score).toBe(POINTS.checkpoint);
    expect(s.reachCheckpoint(1)).toBe(false);
    expect(s.reachCheckpoint(0)).toBe(false);
    expect(s.checkpoint).toBe(1);
  });

  it('Tomaten aufheben (max) und werfen', () => {
    const s = new GameState();
    expect(s.throwTomato()).toBe(false);
    s.pickUpTomatoes(3);
    expect(s.tomatoes).toBe(3);
    s.pickUpTomatoes(100);
    expect(s.tomatoes).toBe(MAX_TOMATOES);
    expect(s.throwTomato()).toBe(true);
    expect(s.tomatoes).toBe(MAX_TOMATOES - 1);
  });

  it('Kleidung wird dreckig', () => {
    const s = new GameState();
    expect(s.dirtiness).toBe(0);
    s.addSplat(() => 0.5);
    expect(s.splats).toHaveLength(1);
    for (let i = 0; i < 100; i++) s.addSplat();
    expect(s.splats).toHaveLength(MAX_SPLATS);
    expect(s.dirtiness).toBe(1);
  });

  it('startRun setzt alles zurück, Outfit bleibt', () => {
    const s = new GameState();
    s.outfit.hat = 'krone';
    s.loseLife();
    s.addScore(10);
    s.addSplat();
    s.reachCheckpoint(2);
    s.startRun();
    expect(s.lives).toBe(5);
    expect(s.score).toBe(0);
    expect(s.splats).toHaveLength(0);
    expect(s.checkpoint).toBe(0);
    expect(s.outfit.hat).toBe('krone');
  });
});
