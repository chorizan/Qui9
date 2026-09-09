import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from '../../../core/animations/gsap.config';
import { DeviceService } from '../../../core/services/device.service';
import { UiService } from '../../../core/services/ui.service';

/**
 * Cursor personalizado de escritorio.
 *
 * Un punto que sigue al puntero al instante y un anillo que llega con
 * retraso. Las directivas `appCursor` cambian su estado: aumenta sobre
 * botones y muestra "VER" o "EXPLORAR" sobre productos e imágenes.
 * No se monta en dispositivos táctiles.
 */
@Component({
  selector: 'app-custom-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled()) {
      <div class="cursor" aria-hidden="true">
        <span class="cursor__dot" #dot></span>
        <span class="cursor__ring" #ring [class]="'is-' + ui.cursorVariant()">
          @if (ui.cursorLabel()) {
            <span class="cursor__label">{{ ui.cursorLabel() }}</span>
          }
        </span>
      </div>
    }
  `,
  styleUrl: './custom-cursor.scss',
})
export class CustomCursorComponent {
  protected readonly ui = inject(UiService);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dot = viewChild<ElementRef<HTMLElement>>('dot');
  private readonly ring = viewChild<ElementRef<HTMLElement>>('ring');

  protected readonly enabled = computed(
    () => !this.device.isTouch() && this.device.animationsEnabled(),
  );

  constructor() {
    afterNextRender(() => this.track());
  }

  private track(): void {
    if (!this.enabled()) return;

    const dot = this.dot()?.nativeElement;
    const ring = this.ring()?.nativeElement;
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeaveWindow);
    document.addEventListener('pointerenter', onEnterWindow);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeaveWindow);
      document.removeEventListener('pointerenter', onEnterWindow);
      document.body.classList.remove('has-custom-cursor');
    });
  }
}
