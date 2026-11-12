import { describe, expect, it } from 'vitest';
import { CLOTHES, cycle, findOption, HATS, SHOES } from './Outfit';

describe('Outfit', () => {
  it('hat Auswahl für Schuhe, Kleidung und Hut', () => {
    expect(SHOES.length).toBeGreaterThan(1);
    expect(CLOTHES.length).toBeGreaterThan(1);
    expect(HATS.length).toBeGreaterThan(1);
  });

  it('cycle läuft rundherum', () => {
    expect(cycle(SHOES, 'sneaker', 1)).toBe('stiefel');
    expect(cycle(SHOES, 'sneaker', -1)).toBe('flossen');
    expect(cycle(SHOES, 'flossen', 1)).toBe('sneaker');
  });

  it('findOption findet die Option', () => {
    expect(findOption(HATS, 'krone').name).toBe('Krone');
  });
});
