import * as THREE from 'three';
import { createCharacter } from '../render/Character';
import type { GameState } from '../state/GameState';
import type { GameScene } from './GameScene';

function lights(scene: THREE.Scene): void {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x664422, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(3, 5, 4);
  scene.add(sun);
}

export class StartScreen implements GameScene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  private char: THREE.Group;
  private ui = document.createElement('div');

  constructor(state: GameState, uiRoot: HTMLElement, onStart: () => void) {
    this.scene.background = new THREE.Color(0xff8a3d);
    lights(this.scene);
    this.char = createCharacter(state.outfit);
    this.char.position.y = -1.2;
    this.scene.add(this.char);
    this.camera.position.set(0, 1.5, 9);

    this.ui.className = 'screen';
    this.ui.innerHTML = `
      <h1 class="title">🍅 Tomaten-Parkour 🍅</h1>
      <div class="subtitle">Zieh dich schick an, renn über die Lava<br>und entkomme dem Monster-Polizisten!</div>
      <div style="height:260px"></div>
      <button class="btn">Start</button>`;
    this.ui.querySelector('button')!.addEventListener('click', onStart);
    uiRoot.append(this.ui);
  }

  update(dt: number): void {
    this.char.rotation.y += dt;
  }

  dispose(): void {
    this.ui.remove();
  }
}

export { lights };
