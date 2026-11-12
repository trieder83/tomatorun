export type ShoeId = 'sneaker' | 'stiefel' | 'flossen';
export type ClothesId = 'tshirt' | 'kleid' | 'anzug';
export type HatId = 'cap' | 'zylinder' | 'krone' | 'afro';

export interface Option<T extends string> {
  id: T;
  name: string;
  color: number;
}

export interface Outfit {
  shoes: ShoeId;
  clothes: ClothesId;
  hat: HatId;
}

export const SHOES: Option<ShoeId>[] = [
  { id: 'sneaker', name: 'Sneaker', color: 0xff3b3b },
  { id: 'stiefel', name: 'Stiefel', color: 0x8b5a2b },
  { id: 'flossen', name: 'Flossen', color: 0x2ecc71 },
];

export const CLOTHES: Option<ClothesId>[] = [
  { id: 'tshirt', name: 'T-Shirt', color: 0x3b82f6 },
  { id: 'kleid', name: 'Kleid', color: 0xff69b4 },
  { id: 'anzug', name: 'Anzug', color: 0x333344 },
];

export const HATS: Option<HatId>[] = [
  { id: 'cap', name: 'Cap', color: 0xffcc00 },
  { id: 'zylinder', name: 'Zylinder', color: 0x111111 },
  { id: 'krone', name: 'Krone', color: 0xffd700 },
  { id: 'afro', name: 'Afro', color: 0x6b3e1f },
];

export const DEFAULT_OUTFIT: Outfit = { shoes: 'sneaker', clothes: 'tshirt', hat: 'cap' };

export function findOption<T extends string>(list: Option<T>[], id: T): Option<T> {
  const found = list.find((o) => o.id === id);
  if (!found) throw new Error(`Unbekannte Option: ${id}`);
  return found;
}

/** Wählt die nächste (oder vorherige) Option in der Liste, mit Umlauf. */
export function cycle<T extends string>(list: Option<T>[], current: T, step: 1 | -1): T {
  const i = list.findIndex((o) => o.id === current);
  return list[(i + step + list.length) % list.length].id;
}
