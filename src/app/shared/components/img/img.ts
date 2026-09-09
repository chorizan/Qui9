import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { IMAGE_MANIFEST } from '../../../core/data/image-manifest';
import { ImageAsset } from '../../../core/models';

/**
 * Imagen responsive del sitio.
 *
 * Sirve WebP con `srcset` (y JPG como red de seguridad), reserva el espacio
 * con `aspect-ratio` para no provocar saltos de layout y aparece con un
 * fundido con desenfoque cuando termina de descargarse.
 */
@Component({
  selector: 'app-img',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <picture class="img" [class.is-loaded]="loaded()" [style.aspect-ratio]="ratio()">
      @if (srcset()) {
        <source type="image/webp" [srcset]="srcset()" [attr.sizes]="sizes()" />
      }
      <source type="image/webp" [srcset]="webp()" />
      <img
        [src]="fallback()"
        [alt]="image().alt"
        [attr.loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : 'auto'"
        [attr.width]="variants()?.width"
        [attr.height]="variants()?.height"
        [style.object-fit]="fit()"
        [style.object-position]="image().focus ?? 'center'"
        decoding="async"
        (load)="loaded.set(true)"
        (error)="loaded.set(true)"
      />
    </picture>
  `,
  styleUrl: './img.scss',
})
export class ImgComponent {
  readonly image = input.required<ImageAsset>();
  /** Atributo `sizes` para que el navegador elija el ancho correcto. */
  readonly sizes = input('100vw');
  /** `true` sólo para la imagen visible al cargar (LCP). */
  readonly priority = input(false);
  readonly fit = input<'cover' | 'contain'>('cover');

  protected readonly loaded = signal(false);

  protected readonly variants = computed(() => IMAGE_MANIFEST[this.image().base]);

  protected readonly srcset = computed(() => {
    const variants = this.variants();
    if (!variants?.widths.length) return '';
    return variants.widths.map((w) => `${this.image().base}-${w}.webp ${w}w`).join(', ');
  });

  protected readonly webp = computed(() => `${this.image().base}.webp`);
  protected readonly fallback = computed(() => `${this.image().base}.jpg`);

  protected readonly ratio = computed(() => {
    const declared = this.image().ratio;
    if (declared) return declared;
    const variants = this.variants();
    return variants ? variants.width / variants.height : 1.5;
  });
}
