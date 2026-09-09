import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { RevealOptions, RevealPreset, createReveal } from '../animations/reveal.animations';
import { ScrollTrigger } from '../animations/gsap.config';
import { DeviceService } from '../services/device.service';

/**
 * Revela un elemento al entrar en pantalla.
 *
 *   <div appReveal>…</div>
 *   <ul appReveal="up" revealChildren="li" [revealStagger]="0.08">…</ul>
 *
 * Con `prefers-reduced-motion` el elemento se muestra sin animación.
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  /** Preset de entrada. */
  readonly appReveal = input<RevealPreset | ''>('');
  readonly revealDelay = input(0);
  readonly revealDistance = input(42);
  readonly revealChildren = input<string | undefined>(undefined);
  readonly revealStagger = input(0.09);
  readonly revealStart = input('top 82%');

  private trigger?: ScrollTrigger;

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;

      if (!this.device.animationsEnabled()) {
        el.classList.add('is-revealed');
        return;
      }

      const options: RevealOptions = {
        preset: this.appReveal() || 'up',
        delay: this.revealDelay(),
        distance: this.revealDistance(),
        children: this.revealChildren(),
        stagger: this.revealStagger(),
        start: this.revealStart(),
      };

      this.trigger = createReveal(el, options);
    });

    this.destroyRef.onDestroy(() => this.trigger?.kill());
  }
}
