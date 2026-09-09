import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ParallaxDirective, RevealDirective } from '../../../../core/directives';
import { AnimatedTextComponent } from '../../../../shared/components/animated-text/animated-text';
import { ImgComponent } from '../../../../shared/components/img/img';

/**
 * "Nacida en los Andes": fotografía a gran escala con parallax y un texto
 * breve. Los datos concretos de la marca sustituyen fácilmente este bloque.
 */
@Component({
  selector: 'app-origin-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedTextComponent, ImgComponent, RevealDirective, ParallaxDirective],
  template: `
    <section class="origin" id="origen" aria-labelledby="origin-title">
      <div class="origin__backdrop" aria-hidden="true">
        <app-img
          appParallax
          [parallaxSpeed]="0.22"
          [image]="{
            base: 'assets/img/andes-dawn',
            alt: '',
            ratio: 16 / 9,
          }"
          sizes="100vw"
        />
        <span class="origin__veil"></span>
      </div>

      <div class="container origin__inner">
        <div class="origin__head">
          <p class="t-eyebrow eyebrow-mark origin__eyebrow" appReveal="fade">Nuestro origen</p>
          <h2 class="t-display origin__title" id="origin-title">
            <app-animated-text [lines]="['Nacida', 'en los Andes.']" />
          </h2>
        </div>

        <div class="origin__body">
          <p class="t-lead" appReveal [revealDelay]="0.15">
            La quinua forma parte de la historia agrícola de los Andes desde hace siglos. Su
            riqueza nace de una tierra donde tradición y naturaleza conviven.
          </p>

          <dl class="origin__data" appReveal revealChildren="div" [revealStagger]="0.1">
            <div>
              <dt class="t-eyebrow">Altitud</dt>
              <dd>Cultivo de altura</dd>
            </div>
            <div>
              <dt class="t-eyebrow">Campaña</dt>
              <dd>Una cosecha al año</dd>
            </div>
            <div>
              <dt class="t-eyebrow">Selección</dt>
              <dd>Por variedad y calibre</dd>
            </div>
          </dl>
        </div>

        <figure class="origin__inset" appReveal="mask" [revealDelay]="0.2">
          <app-img
            [image]="{
              base: 'assets/img/quinoa-field',
              alt: 'Panojas de quinua roja, dorada y blanca en un campo andino',
              ratio: 3 / 4,
            }"
            sizes="(min-width: 1024px) 30vw, 62vw"
          />
          <figcaption class="t-small">Panojas en punto de cosecha.</figcaption>
        </figure>
      </div>
    </section>
  `,
  styleUrl: './origin.scss',
})
export class OriginSection {}
