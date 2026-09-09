import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { EASE, gsap } from '../../../core/animations/gsap.config';
import { DeviceService } from '../../../core/services/device.service';
import { UiService } from '../../../core/services/ui.service';
import { LogoComponent } from '../logo/logo';

/**
 * Preloader de marca.
 *
 * Muestra el símbolo QUI9, una semilla que cae y un contador 0 → 100 %.
 * El progreso es real hasta donde puede serlo (fuentes y `window.load`) y
 * nunca retiene al usuario más de lo necesario: en cuanto todo está listo,
 * la capa se retira con un barrido de clip-path hacia el hero.
 */
@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  template: `
    @if (visible()) {
      <div class="preloader" #root role="status" aria-live="polite">
        <div class="preloader__grain" aria-hidden="true">
          @for (seed of seeds; track $index) {
            <span class="seed" [style.--i]="$index"></span>
          }
        </div>

        <div class="preloader__center">
          <app-logo class="preloader__logo" [size]="118" />
          <p class="preloader__claim">El sabor de los Andes.</p>
        </div>

        <div class="preloader__bottom">
          <span class="preloader__count t-mono-num">{{ display() }}</span>
          <span class="preloader__track" aria-hidden="true">
            <span class="preloader__bar" #bar></span>
          </span>
        </div>

        <span class="sr-only">Cargando la experiencia QUI9: {{ display() }}</span>
      </div>
    }
  `,
  styleUrl: './preloader.scss',
})
export class PreloaderComponent {
  private readonly ui = inject(UiService);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private readonly bar = viewChild<ElementRef<HTMLElement>>('bar');

  protected readonly visible = signal(true);
  protected readonly progress = signal(0);
  protected readonly display = () => `${Math.round(this.progress())}%`;
  protected readonly seeds = Array.from({ length: 9 });

  private timeline?: gsap.core.Timeline;

  constructor() {
    afterNextRender(() => this.run());
    this.destroyRef.onDestroy(() => this.timeline?.kill());
  }

  private run(): void {
    const counter = { value: 0 };
    const bar = this.bar()?.nativeElement;

    // Avance amortiguado: llega al 90 % y espera a que la página esté lista.
    this.timeline = gsap.timeline();
    this.timeline.to(counter, {
      value: 90,
      duration: this.device.reducedMotion() ? 0.3 : 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        this.progress.set(counter.value);
        if (bar) gsap.set(bar, { scaleX: counter.value / 100 });
      },
    });

    void this.waitForReady().then(() => {
      gsap.to(counter, {
        value: 100,
        duration: this.device.reducedMotion() ? 0.2 : 0.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.progress.set(counter.value);
          if (bar) gsap.set(bar, { scaleX: counter.value / 100 });
        },
        onComplete: () => this.exit(),
      });
    });
  }

  /** Fuentes cargadas + `load` de la ventana, con tope de seguridad. */
  private waitForReady(): Promise<void> {
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const windowLoad =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
    const cap = new Promise<void>((resolve) => setTimeout(resolve, 3200));
    const floor = new Promise<void>((resolve) => setTimeout(resolve, 700));

    return Promise.race([Promise.all([fonts, windowLoad, floor]).then(() => undefined), cap]);
  }

  private exit(): void {
    const root = this.root()?.nativeElement;
    this.ui.loadProgress.set(100);

    if (!root || this.device.reducedMotion()) {
      this.finish();
      return;
    }

    gsap
      .timeline({ onComplete: () => this.finish() })
      .to('.preloader__center, .preloader__bottom', {
        opacity: 0,
        y: -24,
        duration: 0.6,
        ease: EASE.soft,
      })
      .to(
        root,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1.1,
          ease: 'expo.inOut',
        },
        '-=0.2',
      );
  }

  private finish(): void {
    this.visible.set(false);
    this.ui.introComplete.set(true);
  }
}
