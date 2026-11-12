import type * as THREE from 'three';

export interface GameScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update(dt: number): void;
  dispose(): void;
}
