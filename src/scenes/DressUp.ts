import * as THREE from 'three';
import { createCharacter } from '../render/Character';
import { CLOTHES, cycle, findOption, HATS, SHOES, type Option, type Outfit } from '../state/Outfit';
import type { GameState } from '../state/GameState';
import type { GameScene } from './GameScene';
import { lights } from './StartScreen';

export class DressUp implements GameScene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  private char: THREE.Group | null = null;
  private ui = document.createElement('div');

  constructor(private state: GameState, uiRoot: HTMLElement, onDone: () => void) {
    this.scene.background = new THREE.Color(0x9be7ff);
    lights(this.scene);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32), new THREE.MeshToonMaterial({ color: 0xffe14d }));
    floor.position.y = -0.1;
    this.scene.add(floor);
    this.camera.position.set(1.2, 1.4, 5.5);
    this.camera.lookAt(1.2, 1.2, 0);

    this.ui.className = 'screen dress';
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = '<h2>👗 Dress-up</h2>';
    panel.append(
      this.row('Schuhe', SHOES, 'shoes'),
      this.row('Kleidung', CLOTHES, 'clothes'),
      this.row('Hut / Haare', HATS, 'hat'),
    );
    const go = document.createElement('button');
    go.className = 'btn';
    go.textContent = 'Los geht’s! 🏃';
    go.addEventListener('click', onDone);
    panel.append(go);
    this.ui.append(document.createElement('div'), panel);
    uiRoot.append(this.ui);
    this.rebuild();
  }

  private row<K extends keyof Outfit>(label: string, list: Option<Outfit[K]>[], key: K): HTMLElement {
    const row = document.createElement('div');
    row.className = 'row';
    const value = document.createElement('span');
    value.className = 'value';
    const show = () => (value.textContent = findOption(list, this.state.outfit[key]).name);
    const arrow = (txt: string, step: 1 | -1) => {
      const b = document.createElement('button');
      b.className = 'arrow';
      b.textContent = txt;
      b.addEventListener('click', () => {
        this.state.outfit[key] = cycle(list, this.state.outfit[key], step);
        show();
        this.rebuild();
      });
      return b;
    };
    const name = document.createElement('span');
    name.textContent = label;
    const ctrl = document.createElement('span');
    ctrl.style.display = 'flex';
    ctrl.style.alignItems = 'center';
    ctrl.append(arrow('◀', -1), value, arrow('▶', 1));
    row.append(name, ctrl);
    show();
    return row;
  }

  private rebuild(): void {
    const rot = this.char?.rotation.y ?? 0;
    if (this.char) this.scene.remove(this.char);
    this.char = createCharacter(this.state.outfit);
    this.char.rotation.y = rot;
    this.scene.add(this.char);
  }

  update(dt: number): void {
    if (this.char) this.char.rotation.y += dt * 0.8;
  }

  dispose(): void {
    this.ui.remove();
  }
}
