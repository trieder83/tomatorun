import { CLOTHES, findOption } from '../state/Outfit';
import type { GameState } from '../state/GameState';

/** Anzeige von Leben, Punkten, Tomaten und dreckiger Kleidung. */
export class Hud {
  readonly root = document.createElement('div');
  private lives = document.createElement('div');
  private score = document.createElement('div');
  private tomatoes = document.createElement('div');
  private msg = document.createElement('div');
  private dirt = document.createElement('div');
  private splatCount = -1;
  private msgTimer = 0;

  constructor(private state: GameState) {
    const bar = document.createElement('div');
    bar.className = 'hud';
    for (const el of [this.lives, this.score, this.tomatoes]) {
      el.className = 'box';
      bar.append(el);
    }
    this.msg.className = 'msg';
    bar.append(this.msg);
    const cross = document.createElement('div');
    cross.className = 'crosshair';
    const help = document.createElement('div');
    help.className = 'help';
    help.innerHTML = 'WASD laufen · Leertaste springen · Maus schauen · Klick Tomate werfen · E Tomaten aufheben';
    this.dirt.className = 'dirt';
    this.root.append(bar, cross, help, this.dirt);
  }

  flash(text: string, seconds = 1.5): void {
    this.msg.textContent = text;
    this.msgTimer = seconds;
  }

  update(dt: number): void {
    const s = this.state;
    this.lives.textContent = '❤️'.repeat(s.lives) + '🖤'.repeat(Math.max(0, 5 - s.lives));
    this.score.textContent = `⭐ ${s.score}`;
    this.tomatoes.textContent = `🍅 ${s.tomatoes}`;
    if (this.msgTimer > 0) {
      this.msgTimer -= dt;
      if (this.msgTimer <= 0) this.msg.textContent = '';
    }
    if (this.splatCount !== s.splats.length) {
      this.splatCount = s.splats.length;
      const color = findOption(CLOTHES, s.outfit.clothes).color;
      this.dirt.style.background = `#${color.toString(16).padStart(6, '0')}`;
      this.dirt.replaceChildren(
        ...s.splats.map((sp) => {
          const d = document.createElement('div');
          d.className = 'spot';
          const size = sp.size * 150;
          Object.assign(d.style, { left: `${sp.x * 100}%`, top: `${sp.y * 100}%`, width: `${size}px`, height: `${size}px`, transform: 'translate(-50%,-50%)' });
          return d;
        }),
      );
    }
  }
}
