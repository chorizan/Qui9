import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

export type PerformanceTier = 'low' | 'medium' | 'high';

/**
 * Capacidades del dispositivo. Todo lo que decide "cuánta experiencia"
 * podemos permitirnos (partículas, 3D, animaciones) se consulta aquí.
 */
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly destroyRef = inject(DestroyRef);

  /** El usuario pidió menos movimiento en su sistema operativo. */
  readonly reducedMotion = signal(false);
  /** Puntero grueso / sin hover: nada de cursor personalizado. */
  readonly isTouch = signal(false);
  readonly viewportWidth = signal(1440);
  readonly viewportHeight = signal(900);

  readonly isMobile = computed(() => this.viewportWidth() < 768);
  readonly isTablet = computed(() => this.viewportWidth() >= 768 && this.viewportWidth() < 1024);
  readonly isDesktop = computed(() => this.viewportWidth() >= 1024);

  /** WebGL disponible y utilizable (se calcula una sola vez, en frío). */
  readonly webglSupported = signal(true);

  /** Nivel de exigencia gráfica que admite el equipo. */
  readonly tier = computed<PerformanceTier>(() => {
    if (this.reducedMotion() || !this.webglSupported()) return 'low';
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency ?? 4) : 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    if (this.isMobile() && (cores <= 4 || memory <= 4)) return 'low';
    if (cores <= 4 || memory <= 4) return 'medium';
    return this.isMobile() ? 'medium' : 'high';
  });

  /** Nº de partículas recomendado para fondos decorativos. */
  readonly particleCount = computed(() => {
    switch (this.tier()) {
      case 'low':
        return 0;
      case 'medium':
        return 42;
      default:
        return 90;
    }
  });

  /** Nº de granos en las escenas Three.js. */
  readonly grainCount = computed(() => {
    switch (this.tier()) {
      case 'low':
        return 0;
      case 'medium':
        return 420;
      default:
        return 1100;
    }
  });

  /** Cap de densidad de píxeles para no fundir GPUs móviles. */
  readonly pixelRatioCap = computed(() => (this.tier() === 'high' ? 2 : 1.5));

  /** Las animaciones ricas sólo se ejecutan si el usuario no las rechazó. */
  readonly animationsEnabled = computed(() => !this.reducedMotion());

  constructor() {
    if (typeof window === 'undefined') return;

    this.webglSupported.set(this.detectWebgl());
    this.readViewport();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    const syncMotion = () => this.reducedMotion.set(motionQuery.matches);
    const syncTouch = () => this.isTouch.set(touchQuery.matches);
    const syncViewport = () => this.readViewport();

    syncMotion();
    syncTouch();

    motionQuery.addEventListener('change', syncMotion);
    touchQuery.addEventListener('change', syncTouch);
    window.addEventListener('resize', syncViewport, { passive: true });
    window.addEventListener('orientationchange', syncViewport);

    this.destroyRef.onDestroy(() => {
      motionQuery.removeEventListener('change', syncMotion);
      touchQuery.removeEventListener('change', syncTouch);
      window.removeEventListener('resize', syncViewport);
      window.removeEventListener('orientationchange', syncViewport);
    });
  }

  private readViewport(): void {
    this.viewportWidth.set(window.innerWidth);
    this.viewportHeight.set(window.innerHeight);
    // `--vh` corrige el 100vh en navegadores móviles con barra dinámica.
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }

  /** Crea un contexto de prueba y lo descarta inmediatamente. */
  private detectWebgl(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl2') ??
        canvas.getContext('webgl')) as WebGLRenderingContext | null;
      if (!gl) return false;
      const lose = gl.getExtension('WEBGL_lose_context');
      lose?.loseContext();
      return true;
    } catch {
      return false;
    }
  }
}
