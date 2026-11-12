import * as THREE from 'three';
import { BUBBLE_COUNT, bubbleSize, lavaWave, newBubble, updateBubbles, type Bubble } from '../entities/Lava';
import { PoliceMonsterBrain } from '../entities/PoliceMonsterBrain';
import { TomatoProjectile } from '../entities/Tomato';
import { buildLevel, eyeHeight, isInLava, LAVA_HEIGHT, type LevelData } from '../Level';
import { distance, GRAVITY, moveAndCollide, type Box, type Vec3 } from '../physics';
import { toon, withOutline } from '../render/toon';
import { POINTS, type GameState } from '../state/GameState';
import { Hud } from '../ui/Hud';
import type { GameScene } from './GameScene';

const WALK_SPEED = 7;
const JUMP_SPEED = 8.5;
const PICKUP_RANGE = 2.2;
const PLATFORM_COLORS = [0x7ed957, 0x5ec8f2, 0xffd84d, 0xc78bff];

function boxMesh(b: Box, color: number): THREE.Mesh {
  const size = new THREE.Vector3(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z);
  const m = withOutline(new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), toon(color)), 0.06);
  m.position.set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2);
  return m;
}

function tomatoMesh(): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), toon(0xe0201b));
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.08, 5), toon(0x2e9e2e));
  leaf.position.y = 0.18;
  m.add(leaf);
  return m;
}

function createMonster(): THREE.Group {
  const g = new THREE.Group();
  const body = withOutline(new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), toon(0x2b4fd6)));
  body.scale.set(1, 1.2, 0.9);
  g.add(body);
  const eyeWhite = toon(0xffffff);
  for (const x of [-0.35, 0.35]) {
    const eye = withOutline(new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), eyeWhite));
    eye.position.set(x, 0.4, 0.8);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), toon(0x000000));
    pupil.position.z = 0.2;
    eye.add(pupil);
    g.add(eye);
  }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.07, 6, 16, Math.PI), toon(0x000000));
  mouth.position.set(0, -0.15, 0.85);
  mouth.rotation.z = Math.PI;
  g.add(mouth);
  // Polizeimütze
  const cap = withOutline(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 0.45, 16), toon(0x111a44)));
  cap.position.y = 1.25;
  g.add(cap);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.45), toon(0x000000));
  visor.position.set(0, 1.05, 0.6);
  g.add(visor);
  const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.15), toon(0xffd700, 0x553300));
  badge.position.set(0, 1.3, 0.72);
  g.add(badge);
  const light = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  light.name = 'siren';
  light.position.y = 1.6;
  g.add(light);
  return g;
}

interface ActiveTomato {
  logic: TomatoProjectile;
  mesh: THREE.Mesh;
}

export class Parkour implements GameScene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 300);
  private level: LevelData = buildLevel();
  private solids: Box[];
  private hud: Hud;
  private ui = document.createElement('div');
  private overlay: HTMLDivElement | null = null;

  private pos: Vec3 = { x: 0, y: 1, z: 0 };
  private vel: Vec3 = { x: 0, y: 0, z: 0 };
  private yaw = 0;
  private pitch = 0;
  private onGround = false;
  private keys = new Set<string>();
  private invulnerable = 0;
  private finished = false;

  private monster = new PoliceMonsterBrain();
  private monsterMesh = createMonster();
  private tomatoes: ActiveTomato[] = [];
  private stars: THREE.Mesh[] = [];
  private flags: THREE.Group[] = [];
  private lava: THREE.Mesh;
  private bubbles: Bubble[] = [];
  private bubbleMeshes: THREE.Mesh[] = [];
  private time = 0;
  private lastDt = 0;

  constructor(
    private state: GameState,
    uiRoot: HTMLElement,
    private canvas: HTMLCanvasElement,
    private onMenu: () => void,
  ) {
    this.solids = [...this.level.platforms, ...this.level.obstacles];
    this.scene.background = new THREE.Color(0x6ec6ff);
    this.scene.fog = new THREE.Fog(0x6ec6ff, 40, 140);
    this.scene.add(new THREE.HemisphereLight(0xcfeeff, 0xff4400, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(10, 20, 10);
    this.scene.add(sun);
    this.addClouds();

    // Lava
    this.lava = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 100, 100), toon(0xff5a00, 0xcc2200));
    this.lava.rotation.x = -Math.PI / 2;
    this.lava.position.y = LAVA_HEIGHT - 0.1;
    this.scene.add(this.lava);
    const bubbleMat = toon(0xffa020, 0xff5500);
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = newBubble(Math.random, 0);
      b.age = Math.random() * b.lifetime;
      this.bubbles.push(b);
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), bubbleMat);
      this.bubbleMeshes.push(m);
      this.scene.add(m);
    }

    this.level.platforms.forEach((p, i) => this.scene.add(boxMesh(p, PLATFORM_COLORS[i % PLATFORM_COLORS.length])));
    this.level.obstacles.forEach((o) => this.scene.add(boxMesh(o, 0xff3355)));
    this.level.checkpoints.forEach((c) => this.scene.add(this.createFlag(c)));
    this.level.baskets.forEach((b) => this.scene.add(this.createBasket(b)));
    for (const s of this.level.stars) {
      const star = withOutline(new THREE.Mesh(new THREE.OctahedronGeometry(0.35), toon(0xffee00, 0x886600)));
      star.position.set(s.x, s.y, s.z);
      this.stars.push(star);
      this.scene.add(star);
    }
    this.scene.add(this.createGoal(this.level.goal));
    this.scene.add(this.monsterMesh);

    this.hud = new Hud(state);
    this.ui.append(this.hud.root);
    uiRoot.append(this.ui);

    this.state.startRun();
    this.respawn();
    this.hud.flash('Klick ins Bild zum Starten!', 3);

    addEventListener('keydown', this.onKeyDown);
    addEventListener('keyup', this.onKeyUp);
    addEventListener('mousemove', this.onMouseMove);
    addEventListener('mousedown', this.onMouseDown);
  }

  // ---------- Aufbau ----------

  private addClouds(): void {
    const mat = toon(0xffffff, 0x777777);
    for (let i = 0; i < 25; i++) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(2 + Math.random() * 1.5, 12, 10), mat);
        puff.position.set(j * 2.5 - 4, Math.random(), Math.random() * 2);
        cloud.add(puff);
      }
      cloud.position.set((Math.random() - 0.5) * 160, 25 + Math.random() * 15, 20 - Math.random() * 200);
      this.scene.add(cloud);
    }
  }

  private createFlag(p: Vec3): THREE.Group {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5), toon(0xffffff));
    pole.position.y = 1.25;
    const flag = withOutline(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.05), toon(0x999999)));
    flag.position.set(0.48, 2.2, 0);
    flag.name = 'flag';
    g.add(pole, flag);
    g.position.set(p.x - 1.5, p.y, p.z);
    this.flags.push(g);
    return g;
  }

  private createBasket(p: Vec3): THREE.Group {
    const g = new THREE.Group();
    const basket = withOutline(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.38, 0.5, 12, 1, true), toon(0xb5651d)));
    (basket.material as THREE.Material).side = THREE.DoubleSide;
    basket.position.y = 0.25;
    g.add(basket);
    for (let i = 0; i < 6; i++) {
      const t = tomatoMesh();
      t.position.set(Math.sin(i) * 0.22, 0.45 + (i % 2) * 0.12, Math.cos(i) * 0.22);
      g.add(t);
    }
    g.position.set(p.x, p.y, p.z);
    return g;
  }

  private createGoal(p: Vec3): THREE.Group {
    const g = new THREE.Group();
    const mat = toon(0xffffff);
    for (const x of [-2, 2]) {
      const post = withOutline(new THREE.Mesh(new THREE.BoxGeometry(0.4, 4, 0.4), mat));
      post.position.set(x, 2, 0);
      g.add(post);
    }
    const top = withOutline(new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.8, 0.4), toon(0xff3355)));
    top.position.y = 4;
    g.add(top);
    g.position.set(p.x, p.y, p.z);
    return g;
  }

  // ---------- Eingabe ----------

  private onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    if (e.code === 'KeyE') this.tryPickUp();
  };
  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };
  private onMouseMove = (e: MouseEvent): void => {
    if (document.pointerLockElement !== this.canvas) return;
    this.yaw -= e.movementX * 0.0025;
    this.pitch = THREE.MathUtils.clamp(this.pitch - e.movementY * 0.0025, -1.4, 1.4);
  };
  private onMouseDown = (e: MouseEvent): void => {
    if (this.overlay || e.target !== this.canvas) return;
    if (document.pointerLockElement !== this.canvas) {
      void this.canvas.requestPointerLock();
      return;
    }
    this.throwTomato();
  };

  // ---------- Aktionen ----------

  private lookDir(): Vec3 {
    const d = new THREE.Vector3();
    this.camera.getWorldDirection(d);
    return { x: d.x, y: d.y, z: d.z };
  }

  private eye(): Vec3 {
    return { x: this.pos.x, y: this.pos.y + eyeHeight(), z: this.pos.z };
  }

  private tryPickUp(): void {
    const near = this.level.baskets.some((b) => distance(b, this.pos) < PICKUP_RANGE);
    if (!near) return;
    const got = this.state.pickUpTomatoes(5);
    this.hud.flash(got > 0 ? `+${got} 🍅` : 'Hände voll!', 1);
  }

  private throwTomato(): void {
    if (!this.state.throwTomato()) {
      this.hud.flash('Keine Tomaten! Such einen Korb (E)', 1.2);
      return;
    }
    const dir = this.lookDir();
    const e = this.eye();
    const from = { x: e.x + dir.x * 0.6, y: e.y - 0.2 + dir.y * 0.6, z: e.z + dir.z * 0.6 };
    this.spawnTomato(TomatoProjectile.thrown(from, dir, 'player'));
  }

  private spawnTomato(logic: TomatoProjectile): void {
    const mesh = tomatoMesh();
    this.scene.add(mesh);
    this.tomatoes.push({ logic, mesh });
  }

  private respawn(): void {
    const cp = this.level.checkpoints[this.state.checkpoint];
    this.pos = { ...cp };
    this.vel = { x: 0, y: 0, z: 0 };
    this.yaw = 0;
    this.pitch = 0;
    this.monster.resetBehind(cp);
    this.invulnerable = 1.5;
    for (const t of this.tomatoes) this.scene.remove(t.mesh);
    this.tomatoes = [];
  }

  private hurt(reason: string): void {
    if (this.invulnerable > 0) return;
    if (this.state.loseLife()) {
      this.showOverlay('💀 Game Over', `Punkte: ${this.state.score}`);
      return;
    }
    this.hud.flash(reason, 1.8);
    this.respawn();
  }

  private showOverlay(title: string, text: string): void {
    void document.exitPointerLock();
    this.overlay = document.createElement('div');
    this.overlay.className = 'screen';
    this.overlay.style.background = 'rgba(0,0,0,.55)';
    this.overlay.innerHTML = `<h1 class="title">${title}</h1><div class="subtitle">${text}</div>`;
    const again = document.createElement('button');
    again.className = 'btn';
    again.textContent = 'Nochmal';
    again.addEventListener('click', () => {
      this.overlay?.remove();
      this.overlay = null;
      this.finished = false;
      this.state.startRun();
      this.respawn();
    });
    const menu = document.createElement('button');
    menu.className = 'btn';
    menu.textContent = 'Menü';
    menu.addEventListener('click', this.onMenu);
    this.overlay.append(again, menu);
    this.ui.append(this.overlay);
  }

  // ---------- Game-Loop ----------

  update(dt: number): void {
    dt = Math.min(dt, 0.05);
    this.time += dt;
    this.lastDt = dt;
    this.animateWorld();
    this.hud.update(dt);
    if (this.overlay) {
      this.updateCamera();
      return;
    }
    this.invulnerable = Math.max(0, this.invulnerable - dt);

    this.updatePlayer(dt);
    this.updateCamera();

    if (isInLava(this.pos)) this.hurt('🔥 Autsch, Lava!');

    // Checkpoints
    this.level.checkpoints.forEach((c, i) => {
      if (distance(c, this.pos) < 2.5 && this.state.reachCheckpoint(i)) this.hud.flash('🚩 Checkpoint!');
    });

    // Sterne
    for (const s of this.stars) {
      if (s.visible && s.position.distanceTo(new THREE.Vector3(this.pos.x, this.pos.y + 1, this.pos.z)) < 1.2) {
        s.visible = false;
        this.state.addScore(POINTS.star);
      }
    }

    // Ziel
    if (!this.finished && distance(this.level.goal, this.pos) < 2.5) {
      this.finished = true;
      this.state.addScore(POINTS.goal);
      this.showOverlay('🏆 Geschafft!', `Punkte: ${this.state.score}`);
    }

    // Monster
    if (this.monster.update(dt, this.pos)) {
      const from = { x: this.monster.pos.x, y: this.monster.pos.y + 1, z: this.monster.pos.z };
      const e = this.eye();
      this.spawnTomato(
        TomatoProjectile.thrown(from, { x: e.x - from.x, y: e.y - 0.6 - from.y, z: e.z - from.z }, 'monster', 15),
      );
    }
    if (this.monster.catches({ x: this.pos.x, y: this.pos.y + 0.5, z: this.pos.z })) {
      this.hurt('👮 Erwischt!');
    }
    this.monsterMesh.position.set(this.monster.pos.x, this.monster.pos.y + 1.2, this.monster.pos.z);
    this.monsterMesh.lookAt(this.pos.x, this.monster.pos.y + 1.2, this.pos.z);
    this.monsterMesh.rotation.z = this.monster.isStunned ? Math.sin(this.time * 20) * 0.3 : 0;

    this.updateTomatoes(dt);
  }

  private updatePlayer(dt: number): void {
    const f = (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0) - (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0);
    const r = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0);
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    let mx = -sin * f + cos * r;
    let mz = -cos * f - sin * r;
    const len = Math.hypot(mx, mz);
    if (len > 0) {
      mx /= len;
      mz /= len;
    }
    this.vel.x = mx * WALK_SPEED;
    this.vel.z = mz * WALK_SPEED;
    if (this.onGround && this.keys.has('Space')) this.vel.y = JUMP_SPEED;
    this.vel.y -= GRAVITY * dt;
    this.onGround = moveAndCollide(this.pos, this.vel, dt, this.solids);
  }

  private updateCamera(): void {
    const e = this.eye();
    this.camera.position.set(e.x, e.y, e.z);
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  private updateTomatoes(dt: number): void {
    const playerCenter = { x: this.pos.x, y: this.pos.y + 1, z: this.pos.z };
    const monsterCenter = { x: this.monster.pos.x, y: this.monster.pos.y + 1.2, z: this.monster.pos.z };
    for (const t of this.tomatoes) {
      t.logic.step(dt, this.solids);
      if (t.logic.owner === 'player' && t.logic.hits(monsterCenter, 1.4)) {
        t.logic.alive = false;
        this.monster.stun();
        this.state.addScore(POINTS.monsterHit);
        this.hud.flash('🍅 Treffer! +50', 1);
      }
      if (t.logic.owner === 'monster' && t.logic.hits(playerCenter)) {
        t.logic.alive = false;
        this.state.addSplat();
        this.hud.flash('💦 Deine Kleider sind dreckig!', 1);
      }
      t.mesh.position.set(t.logic.pos.x, t.logic.pos.y, t.logic.pos.z);
      if (!t.logic.alive) this.scene.remove(t.mesh);
    }
    this.tomatoes = this.tomatoes.filter((t) => t.logic.alive);
  }

  private animateWorld(): void {
    const lavaMat = this.lava.material as THREE.MeshToonMaterial;
    lavaMat.emissive.setHSL(0.03 + Math.sin(this.time * 2) * 0.015, 1, 0.35);

    // Wellen: Lava folgt dem Spieler, damit sie nie endet
    this.lava.position.set(this.pos.x, LAVA_HEIGHT - 0.1, this.pos.z);
    const attr = this.lava.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      // Plane liegt gedreht: lokales y entspricht Welt -z
      attr.setZ(i, lavaWave(attr.getX(i) + this.pos.x, this.pos.z - attr.getY(i), this.time));
    }
    attr.needsUpdate = true;
    this.lava.geometry.computeVertexNormals();

    // Blubber-Blasen
    updateBubbles(this.bubbles, this.lastDt, this.pos.z);
    this.bubbles.forEach((b, i) => {
      const size = bubbleSize(b);
      const m = this.bubbleMeshes[i];
      m.visible = size > 0;
      m.scale.setScalar(Math.max(size, 0.001));
      m.position.set(b.x + this.pos.x, LAVA_HEIGHT + lavaWave(b.x + this.pos.x, b.z, this.time) - 0.1 + size * 0.3, b.z);
    });
    for (const s of this.stars) s.rotation.y = this.time * 2;
    this.flags.forEach((g, i) => {
      const flag = g.getObjectByName('flag') as THREE.Mesh;
      (flag.material as THREE.MeshToonMaterial).color.set(i <= this.state.checkpoint ? 0x22cc44 : 0x999999);
    });
    const siren = this.monsterMesh.getObjectByName('siren') as THREE.Mesh;
    (siren.material as THREE.MeshBasicMaterial).color.set(Math.floor(this.time * 4) % 2 ? 0xff0000 : 0x0044ff);
  }

  dispose(): void {
    removeEventListener('keydown', this.onKeyDown);
    removeEventListener('keyup', this.onKeyUp);
    removeEventListener('mousemove', this.onMouseMove);
    removeEventListener('mousedown', this.onMouseDown);
    void document.exitPointerLock();
    this.ui.remove();
  }
}
