import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { EASE, ScrollTrigger, gsap } from '../../../core/animations/gsap.config';
import { splitIntoWords } from '../../../core/animations/reveal.animations';
import { DeviceService } from '../../../core/services/device.service';

/**
 * Texto que aparece palabra por palabra (opacity + translateY + blur).
 *
 *   <h2 class="t-display">
 *     <app-animated-text [lines]="['El sabor', 'de los Andes.']" />
 *   </h2>
 *
 * Con `autoplay = false` la animación queda a la espera de que alguien llame
 * a `play()`, que es como el hero la encadena con la entrada del 3D.
 */
@Component({
  selector: 'app-animated-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (line of resolvedLines(); track $index) {
      <span class="line" #line>{{ line }}</span>
    }
  `,
  styleUrl: './animated-text.scss',
})
export class AnimatedTextComponent {
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly text = input('');
  /** Cada entrada se renderiza en su propia línea. */
  readonly lines = input<string[]>([]);
  /** Dispara solo al entrar en pantalla. */
  readonly autoplay = input(true);
  readonly delay = input(0);
  readonly stagger = input(0.055);

  private readonly lineElements = viewChildren<ElementRef<HTMLElement>>('line');

  private words: HTMLElement[] = [];
  private timeline?: gsap.core.Timeline;
  private trigger?: ScrollTrigger;

  protected readonly resolvedLines = () => (this.lines().length ? this.lines() : [this.text()]);

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => {
      this.trigger?.kill();
      this.timeline?.kill();
    });
  }

  /** Reproduce la animación (usado cuando `autoplay` está desactivado). */
  play(delay = 0): void {
    this.timeline?.delay(delay).play();
  }

  private setup(): void {
    const elements = this.lineElements().map((ref) => ref.nativeElement);
    if (!elements.length) return;

    this.words = elements.flatMap((el) => splitIntoWords(el));

    if (!this.device.animationsEnabled()) {
      gsap.set(this.words, { opacity: 1, y: 0, filter: 'none' });
      return;
    }

    this.timeline = gsap
      .timeline({ paused: true, delay: this.delay() })
      .fromTo(
        this.words,
        { yPercent: 115, opacity: 0, filter: 'blur(10px)' },
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.15,
          ease: EASE.out,
          stagger: this.stagger(),
        },
      );

    if (this.autoplay()) {
      this.trigger = ScrollTrigger.create({
        trigger: elements[0],
        start: 'top 88%',
        once: true,
        onEnter: () => this.timeline?.play(),
      });
    }
  }
}
