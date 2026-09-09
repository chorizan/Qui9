import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { gsap } from '../animations/gsap.config';
import { DeviceService } from '../services/device.service';

/**
 * Botón magnético: el elemento se acerca ligeramente al puntero.
 * Sólo en dispositivos con hover real; nunca en táctiles.
 */
@Directive({
  selector: '[appMagnetic]',
})
export class MagneticDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  /** 0 = inmóvil, 1 = sigue al cursor por completo. */
  readonly magneticStrength = input(0.32);

  constructor() {
    afterNextRender(() => {
      if (this.device.isTouch() || !this.device.animationsEnabled()) return;

      const el = this.host.nativeElement;
      const quickX = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
      const quickY = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const strength = this.magneticStrength();
        quickX((event.clientX - (rect.left + rect.width / 2)) * strength);
        quickY((event.clientY - (rect.top + rect.height / 2)) * strength);
      };

      const onLeave = () => {
        quickX(0);
        quickY(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('blur', onLeave);

      this.destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        el.removeEventListener('blur', onLeave);
      });
    });
  }
}
