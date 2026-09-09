import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EASE, ScrollTrigger, gsap } from '../../../../core/animations/gsap.config';
import { CursorTargetDirective, MagneticDirective } from '../../../../core/directives';
import { DeviceService } from '../../../../core/services/device.service';
import { ScrollService } from '../../../../core/services/scroll.service';
import { UiService } from '../../../../core/services/ui.service';
import { AnimatedTextComponent } from '../../../../shared/components/animated-text/animated-text';
import { ImgComponent } from '../../../../shared/components/img/img';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field';
import type { HeroScene } from '../../../../three/hero-scene';

/**
 * Hero de apertura.
 *
 * Secuencia de entrada en cuatro tiempos —partículas, semillas, producto y
 * texto— encadenada con el final del preloader. El envase 3D responde al
 * puntero y al scroll; si no hay WebGL se sustituye por una fotografía.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AnimatedTextComponent,
    ParticleFieldComponent,
    ImgComponent,
    MagneticDirective,
    CursorTargetDirective,
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroSection {
  private readonly device = inject(DeviceService);
  private readonly ui = inject(UiService);
  private readonly scroll = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly title = viewChild.required(AnimatedTextComponent);

  protected readonly webgl = signal(true);
  protected readonly ready = signal(false);

  protected readonly fallbackImage = {
    base: 'assets/img/pack-blanca',
    alt: 'Envase de quinua peruana QUI9 sobre fondo marfil',
    ratio: 1,
  };

  private scene?: HeroScene;
  private trigger?: ScrollTrigger;

  constructor() {
    this.webgl.set(this.device.webglSupported());

    afterNextRender(() => {
      void this.bootScene();
      this.trackPointer();
      this.bindScroll();
    });

    // La entrada arranca justo cuando el preloader termina de retirarse.
    effect(() => {
      if (!this.ui.introComplete() || !this.ready()) return;
      this.playIntro();
    });

    this.destroyRef.onDestroy(() => {
      this.trigger?.kill();
      this.scene?.dispose();
    });
  }

  private async bootScene(): Promise<void> {
    if (!this.device.webglSupported()) {
      this.ready.set(true);
      return;
    }

    try {
      const { HeroScene } = await import('../../../../three/hero-scene');

      this.scene = new HeroScene({
        canvas: this.canvas().nativeElement,
        container: this.stage().nativeElement,
        pixelRatioCap: this.device.pixelRatioCap(),
        antialias: this.device.tier() !== 'low',
        grainCount: this.device.grainCount(),
        reducedMotion: this.device.reducedMotion(),
        modelUrl: 'assets/3d/quinoa.glb',
      });

      await this.scene.start();
    } catch {
      this.webgl.set(false);
      this.scene = undefined;
    }

    this.ready.set(true);
  }

  /** Encadena la escena 3D con la aparición del texto y los botones. */
  private playIntro(): void {
    const timeline = gsap.timeline();

    if (this.scene) timeline.add(this.scene.playIntro(), 0);

    if (this.device.animationsEnabled()) {
      timeline.add(() => this.title().play(), 0.5);
      timeline.fromTo(
        '.hero__reveal',
        { opacity: 0, y: 26, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: EASE.out,
          stagger: 0.12,
        },
        1.1,
      );
    } else {
      gsap.set('.hero__reveal', { opacity: 1, y: 0, filter: 'none' });
      this.title().play();
    }
  }

  /** El puntero inclina levemente el producto y la cámara. */
  private trackPointer(): void {
    if (this.device.isTouch()) return;

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      this.scene?.setPointer(x, -y);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('pointermove', onMove));
  }

  /** El scroll del hero controla giro, escala y desplazamiento del producto. */
  private bindScroll(): void {
    const root = this.root().nativeElement;

    this.trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => this.scene?.setScrollProgress(self.progress),
    });

    if (!this.device.animationsEnabled()) return;

    // El contenido se desvanece y sube mientras el hero sale de pantalla.
    gsap.to('.hero__content', {
      yPercent: -18,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom 20%', scrub: true },
    });
  }

  protected discover(): void {
    this.scroll.scrollTo('#origen', -40);
  }
}
