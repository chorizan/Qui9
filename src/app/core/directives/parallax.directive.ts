import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ScrollTrigger } from '../animations/gsap.config';
import { createParallax } from '../animations/reveal.animations';
import { DeviceService } from '../services/device.service';

/**
 * Parallax ligado al scroll.
 *
 *   <img appParallax [parallaxSpeed]="0.18" />
 *
 * El movimiento se calcula en porcentaje del propio elemento, así que
 * funciona igual en cualquier breakpoint. Se desactiva en móvil de gama baja
 * y con movimiento reducido.
 */
@Directive({
  selector: '[appParallax]',
})
export class ParallaxDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  /** Fracción del alto recorrida durante todo el scroll (0.1 = 10%). */
  readonly parallaxSpeed = input(0.15);
  readonly parallaxAxis = input<'y' | 'x'>('y');

  private trigger?: ScrollTrigger;

  constructor() {
    afterNextRender(() => {
      if (!this.device.animationsEnabled() || this.device.tier() === 'low') return;
      this.trigger = createParallax(
        this.host.nativeElement,
        this.parallaxSpeed(),
        this.parallaxAxis(),
      );
    });

    this.destroyRef.onDestroy(() => this.trigger?.kill());
  }
}
