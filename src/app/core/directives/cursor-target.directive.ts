import { Directive, HostListener, inject, input } from '@angular/core';
import { CursorVariant, UiService } from '../services/ui.service';

/**
 * Declara cómo debe comportarse el cursor personalizado sobre un elemento.
 *
 *   <a appCursor="link">…</a>
 *   <article appCursor="view" cursorLabel="Ver">…</article>
 */
@Directive({
  selector: '[appCursor]',
})
export class CursorTargetDirective {
  private readonly ui = inject(UiService);

  readonly appCursor = input<CursorVariant>('link');
  readonly cursorLabel = input('');

  @HostListener('pointerenter', ['$event'])
  onEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    this.ui.setCursor(this.appCursor(), this.cursorLabel());
  }

  @HostListener('pointerleave')
  @HostListener('pointerdown')
  onLeave(): void {
    this.ui.resetCursor();
  }
}
