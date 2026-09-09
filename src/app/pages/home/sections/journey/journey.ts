import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ScrollTrigger, gsap } from '../../../../core/animations/gsap.config';
import { RevealDirective } from '../../../../core/directives';
import { DeviceService } from '../../../../core/services/device.service';
import { StoryService } from '../../../../core/services/story.service';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/**
 * "De los Andes a tu mesa".
 *
 * Una línea orgánica se dibuja con el scroll y va encendiendo las seis
 * etapas del recorrido. Los nodos se colocan muestreando el propio trazado
 * (`getPointAtLength`), así que siempre caen exactamente sobre la curva.
 * En móvil el recorrido pasa a ser vertical.
 */
@Component({
  selector: 'app-journey-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
})
export class JourneySection {
  private readonly story = inject(StoryService);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private readonly path = viewChild<ElementRef<SVGPathElement>>('path');
  private readonly trail = viewChild<ElementRef<SVGPathElement>>('trail');

  protected readonly steps = this.story.journey();
  protected readonly isDesktop = computed(() => this.device.viewportWidth() >= 1024);

  /** Posición de cada nodo sobre la curva, en porcentaje del viewBox. */
  protected readonly nodePositions = signal<{ x: number; y: number }[]>([]);
  protected readonly activeIndex = signal(-1);

  /** Dimensiones del viewBox del trazado. */
  protected readonly viewBox = { width: 1200, height: 260 };

  constructor() {
    afterNextRender(() => {
      this.placeNodes();
      this.drawOnScroll();
    });
  }

  /** Reparte los nodos a lo largo del trazado real. */
  private placeNodes(): void {
    const path = this.path()?.nativeElement;
    if (!path) return;

    const length = path.getTotalLength();
    const total = this.steps.length - 1;

    const positions = this.steps.map((_, index) => {
      const point = path.getPointAtLength((length * index) / total);
      return {
        x: (point.x / this.viewBox.width) * 100,
        y: (point.y / this.viewBox.height) * 100,
      };
    });

    this.nodePositions.set(positions);
  }

  /** El trazado se dibuja y los nodos se encienden al pasar el scroll. */
  private drawOnScroll(): void {
    const root = this.root()?.nativeElement;
    const trail = this.trail()?.nativeElement;
    if (!root) return;

    if (!this.device.animationsEnabled()) {
      this.activeIndex.set(this.steps.length - 1);
      if (trail) trail.style.strokeDashoffset = '0';
      return;
    }

    if (trail) {
      const length = trail.getTotalLength();
      gsap.set(trail, { strokeDasharray: length, strokeDashoffset: length });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(trail, { strokeDashoffset: length * (1 - self.progress) });
          this.activeIndex.set(Math.floor(self.progress * this.steps.length) - 1);
        },
      });

      this.destroyRef.onDestroy(() => trigger.kill());
    }
  }
}
