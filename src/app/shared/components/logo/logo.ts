import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Logotipo QUI9 en dos formatos.
 *
 * · `mark`   — el símbolo completo (racimo, tipografía y ave). Se pinta como
 *              máscara del PNG de marca, así que hereda `currentColor` y
 *              funciona sobre azul o sobre marfil. Pensado para tamaños ≥ 56px.
 * · `lockup` — versión reducida para la barra de navegación: el racimo de
 *              granos dibujado en SVG junto al nombre en la serif de marca.
 *              Se mantiene legible a 30px.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="logo"
      [class.logo--stacked]="stacked()"
      [class.logo--lockup]="variant() === 'lockup'"
      [style.--logo-size.px]="size()"
    >
      @if (variant() === 'mark') {
        <span class="logo__mark" aria-hidden="true"></span>
      } @else {
        <svg class="logo__panicle" viewBox="0 0 34 44" fill="currentColor" aria-hidden="true">
          <!-- Racimo de granos: el mismo gesto del logotipo, simplificado -->
          @for (seed of panicle; track $index) {
            <circle [attr.cx]="seed.x" [attr.cy]="seed.y" [attr.r]="seed.r" />
          }
        </svg>
        <span class="logo__word">Qui<span class="logo__nine">9</span></span>
      }

      <span class="sr-only">{{ label() }}</span>
    </span>
  `,
  styleUrl: './logo.scss',
})
export class LogoComponent {
  /** Alto del símbolo en píxeles. */
  readonly size = input(38);
  readonly variant = input<'mark' | 'lockup'>('mark');
  readonly stacked = input(false);
  readonly label = input('QUI9 — Quinua peruana premium');

  /** Racimo de quinua: gotas que se abren hacia abajo. */
  protected readonly panicle = [
    { x: 17, y: 3, r: 2.2 },
    { x: 23, y: 6.5, r: 2 },
    { x: 11.5, y: 8, r: 2.4 },
    { x: 19, y: 12, r: 2.6 },
    { x: 26, y: 14, r: 2.1 },
    { x: 8, y: 16, r: 2.7 },
    { x: 15, y: 20, r: 2.9 },
    { x: 24, y: 23, r: 2.4 },
    { x: 6, y: 26, r: 3 },
    { x: 14, y: 31, r: 3.1 },
    { x: 22, y: 33, r: 2.5 },
    { x: 7, y: 37, r: 2.6 },
  ];
}
