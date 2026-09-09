import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Configuración única de GSAP para toda la aplicación.
 * Cualquier archivo que necesite animar importa `gsap`/`ScrollTrigger`
 * desde aquí para garantizar que los plugins están registrados una sola vez.
 */
let registered = false;

export function setupGsap(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

setupGsap();

/** Curvas compartidas: mismo lenguaje de movimiento en toda la web. */
export const EASE = {
  /** Entradas suaves y largas. */
  out: 'expo.out',
  /** Micro-interacciones. */
  soft: 'power2.out',
  /** Transiciones de capas completas. */
  inOut: 'power4.inOut',
  /** Rebote muy contenido para elementos físicos. */
  back: 'back.out(1.6)',
} as const;

/** Duraciones de referencia (segundos). */
export const DURATION = {
  micro: 0.28,
  short: 0.5,
  base: 0.9,
  long: 1.4,
  cinematic: 2.2,
} as const;

export { gsap, ScrollTrigger };
