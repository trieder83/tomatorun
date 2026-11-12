import * as THREE from 'three';
import { DressUp } from './scenes/DressUp';
import type { GameScene } from './scenes/GameScene';
import { Parkour } from './scenes/Parkour';
import { StartScreen } from './scenes/StartScreen';
import { GameState } from './state/GameState';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.prepend(renderer.domElement);

const uiRoot = document.getElementById('ui')!;
const state = new GameState();
let current: GameScene;

function show(next: GameScene): void {
  current?.dispose();
  current = next;
  resize();
}

function showStart(): void {
  show(new StartScreen(state, uiRoot, showDressUp));
}
function showDressUp(): void {
  show(new DressUp(state, uiRoot, showParkour));
}
function showParkour(): void {
  show(new Parkour(state, uiRoot, renderer.domElement, showStart));
}

function resize(): void {
  renderer.setSize(innerWidth, innerHeight);
  current.camera.aspect = innerWidth / innerHeight;
  current.camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  current.update(clock.getDelta());
  renderer.render(current.scene, current.camera);
});

showStart();
