import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../../core/directives';
import { AnimatedTextComponent } from '../animated-text/animated-text';

/**
 * Cabecera común de sección: etiqueta, título animado y entradilla.
 * Centraliza el ritmo tipográfico para que todas las secciones respiren igual.
 */
@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedTextComponent, RevealDirective],
  template: `
    <header class="head" [class.head--center]="align() === 'center'">
      @if (eyebrow()) {
        <p class="t-eyebrow eyebrow-mark head__eyebrow" appReveal="fade">{{ eyebrow() }}</p>
      }

      <h2 [class]="titleClass()">
        <app-animated-text [lines]="lines()" />
        @if (accent()) {
          <span class="t-accent head__accent" appReveal="fade" [revealDelay]="0.35">
            {{ accent() }}
          </span>
        }
      </h2>

      @if (text()) {
        <p class="t-lead head__text" appReveal [revealDelay]="0.2">{{ text() }}</p>
      }
    </header>
  `,
  styleUrl: './section-header.scss',
})
export class SectionHeaderComponent {
  readonly eyebrow = input('');
  /** Cada línea se anima por separado, palabra a palabra. */
  readonly lines = input<string[]>([]);
  /** Palabra en cursiva dorada al final del título. */
  readonly accent = input('');
  readonly text = input('');
  readonly align = input<'left' | 'center'>('left');
  readonly titleClass = input('t-display head__title');
}
