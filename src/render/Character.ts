import * as THREE from 'three';
import { CLOTHES, findOption, HATS, SHOES, type Outfit } from '../state/Outfit';
import { toon, withOutline } from './toon';

const SKIN = 0xffd2a8;

function part(geo: THREE.BufferGeometry, color: number, x: number, y: number, z: number): THREE.Mesh {
  const m = withOutline(new THREE.Mesh(geo, toon(color)));
  m.position.set(x, y, z);
  return m;
}

/** Baut eine Cartoon-Figur mit dem gewählten Outfit. Füsse bei y=0. */
export function createCharacter(outfit: Outfit): THREE.Group {
  const g = new THREE.Group();
  const shoe = findOption(SHOES, outfit.shoes);
  const cloth = findOption(CLOTHES, outfit.clothes);
  const hat = findOption(HATS, outfit.hat);

  // Schuhe
  const shoeGeo =
    outfit.shoes === 'flossen'
      ? new THREE.BoxGeometry(0.3, 0.08, 0.6)
      : outfit.shoes === 'stiefel'
        ? new THREE.BoxGeometry(0.25, 0.35, 0.35)
        : new THREE.BoxGeometry(0.25, 0.15, 0.4);
  const shoeY = outfit.shoes === 'stiefel' ? 0.17 : 0.06;
  g.add(part(shoeGeo, shoe.color, -0.18, shoeY, 0.05), part(shoeGeo, shoe.color, 0.18, shoeY, 0.05));

  // Beine
  const legColor = outfit.clothes === 'anzug' ? cloth.color : 0x22336b;
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7);
  g.add(part(legGeo, legColor, -0.18, 0.5, 0), part(legGeo, legColor, 0.18, 0.5, 0));

  // Körper
  const bodyGeo =
    outfit.clothes === 'kleid'
      ? new THREE.ConeGeometry(0.5, 1.0, 16)
      : new THREE.CylinderGeometry(0.35, 0.35, 0.8, 16);
  g.add(part(bodyGeo, cloth.color, 0, 1.25, 0));
  if (outfit.clothes === 'anzug') g.add(part(new THREE.BoxGeometry(0.1, 0.5, 0.05), 0xff0000, 0, 1.3, 0.35));

  // Arme
  const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7);
  const armL = part(armGeo, cloth.color, -0.48, 1.3, 0);
  const armR = part(armGeo, cloth.color, 0.48, 1.3, 0);
  armL.rotation.z = -0.3;
  armR.rotation.z = 0.3;
  g.add(armL, armR);

  // Kopf
  g.add(part(new THREE.SphereGeometry(0.33, 20, 16), SKIN, 0, 1.95, 0));
  const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
  g.add(part(eyeGeo, 0x000000, -0.11, 2.0, 0.3), part(eyeGeo, 0x000000, 0.11, 2.0, 0.3));

  // Hut / Haare
  switch (outfit.hat) {
    case 'cap':
      g.add(part(new THREE.SphereGeometry(0.34, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), hat.color, 0, 2.05, 0));
      g.add(part(new THREE.BoxGeometry(0.4, 0.04, 0.3), hat.color, 0, 2.08, 0.38));
      break;
    case 'zylinder':
      g.add(part(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 20), hat.color, 0, 2.2, 0));
      g.add(part(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 20), hat.color, 0, 2.45, 0));
      break;
    case 'krone':
      g.add(part(new THREE.CylinderGeometry(0.28, 0.25, 0.25, 8, 1, true), hat.color, 0, 2.32, 0));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        g.add(part(new THREE.ConeGeometry(0.06, 0.18, 6), hat.color, Math.sin(a) * 0.26, 2.5, Math.cos(a) * 0.26));
      }
      break;
    case 'afro':
      g.add(part(new THREE.IcosahedronGeometry(0.5, 1), hat.color, 0, 2.15, -0.08));
      break;
  }
  return g;
}

/** Fügt der Figur einen Tomatenfleck hinzu (Position 0..1 auf dem Körper). */
export function addSplatToCharacter(g: THREE.Group, x: number, y: number, size: number): void {
  const angle = (x - 0.5) * Math.PI * 1.4;
  const spot = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 6), toon(0xd11a1a));
  spot.scale.z = 0.4;
  spot.position.set(Math.sin(angle) * 0.36, 0.9 + y * 1.2, Math.cos(angle) * 0.36);
  spot.lookAt(spot.position.x * 2, spot.position.y, spot.position.z * 2);
  g.add(spot);
}
