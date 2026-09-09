import { Injectable, effect, inject } from '@angular/core';
import Lenis from 'lenis';
import { ScrollTrigger, gsap } from '../animations/gsap.config';
import { DeviceService } from './device.service';
import { UiService } from './ui.service';

/**
 * Scroll suave (Lenis) sincronizado con GSAP ScrollTrigger.
 *
 * Un único bucle de animación gobierna ambos: el ticker de GSAP alimenta a
 * Lenis y cada scroll de Lenis actualiza los ScrollTriggers. Con
 * `prefers-reduced-motion` el scroll suave no se inicializa en absoluto.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly device = inject(DeviceService);
  private readonly ui = inject(UiService);

  private lenis?: Lenis;
  private rafHandler?: (time: number) => void;

  constructor() {
    // El scroll se congela mientras hay un overlay abierto o el preloader activo.
    effect(() => {
      const locked = this.ui.scrollLocked();
      if (!this.lenis) return;
      locked ? this.lenis.stop() : this.lenis.start();
    });
  }

  init(): void {
    if (typeof window === 'undefined' || this.lenis) return;

    if (this.device.reducedMotion()) {
      // Sin scroll suave: ScrollTrigger sigue funcionando con el scroll nativo.
      ScrollTrigger.refresh();
      return;
    }

    this.lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    this.rafHandler = (time: number) => this.lenis?.raf(time * 1000);
    gsap.ticker.add(this.rafHandler);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();
  }

  /** Desplaza a un elemento, ancla (`#id`) o posición absoluta. */
  scrollTo(target: string | number | HTMLElement, offset = 0): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset, duration: 1.4 });
      return;
    }

    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset });
      return;
    }

    const el =
      typeof target === 'string'
        ? document.querySelector<HTMLElement>(target.startsWith('#') ? target : `#${target}`)
        : target;

    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
    }
  }

  toTop(immediate = true): void {
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate });
      return;
    }
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }

  /** Recalcula posiciones tras cambios de layout (imágenes, rutas, fuentes). */
  refresh(): void {
    ScrollTrigger.refresh();
  }

  destroy(): void {
    if (this.rafHandler) gsap.ticker.remove(this.rafHandler);
    this.lenis?.destroy();
    this.lenis = undefined;
  }
}
