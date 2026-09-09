import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { DeviceService } from '../../../core/services/device.service';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
}

/**
 * Semillas flotando en canvas 2D.
 *
 * Alternativa ligerísima a las partículas 3D para las secciones donde no hay
 * escena Three.js. El número de partículas lo decide `DeviceService` y baja
 * a cero con movimiento reducido o en equipos modestos.
 */
@Component({
  selector: 'app-particle-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="particles" aria-hidden="true"></canvas>`,
  styleUrl: './particle-field.scss',
})
export class ParticleFieldComponent {
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  /** Color de las semillas. */
  readonly tint = input('rgba(245, 240, 230, 1)');
  /** Multiplicador sobre el número de partículas recomendado. */
  readonly density = input(1);

  private particles: Particle[] = [];
  private frame = 0;
  private width = 0;
  private height = 0;

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    const count = Math.round(this.device.particleCount() * this.density());
    if (count <= 0) return;

    const canvas = this.canvasRef().nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    this.particles = Array.from({ length: count }, () => this.spawn());

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let running = true;
    const visibility = () => (running = document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', visibility);

    const render = () => {
      this.frame = requestAnimationFrame(render);
      if (!running) return;

      context.clearRect(0, 0, this.width, this.height);

      for (const particle of this.particles) {
        particle.y -= particle.speed;
        particle.phase += 0.01;
        const x = particle.x + Math.sin(particle.phase) * particle.drift;

        if (particle.y < -10) {
          particle.y = this.height + 10;
          particle.x = Math.random() * this.width;
        }

        context.globalAlpha = particle.alpha;
        context.fillStyle = this.tint();
        context.beginPath();
        context.ellipse(x, particle.y, particle.radius, particle.radius * 0.68, 0.5, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    render();

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    });
  }

  private spawn(): Particle {
    // Una sola variable de profundidad gobierna tamaño, velocidad y opacidad:
    // las semillas cercanas se ven mayores y avanzan más rápido.
    const depth = Math.random();

    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: 0.7 + depth * 1.8,
      speed: 0.06 + depth * 0.3,
      drift: 6 + Math.random() * 26,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.07 + depth * 0.25,
    };
  }
}
