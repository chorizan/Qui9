import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../../../core/directives';
import { AnimatedTextComponent } from '../../../../shared/components/animated-text/animated-text';
import { ImgComponent } from '../../../../shared/components/img/img';

/**
 * Introducción: el manifiesto de la marca.
 * Actúa como transición del azul del hero al marfil del resto de la página.
 */
@Component({
  selector: 'app-intro-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedTextComponent, ImgComponent, RevealDirective],
  template: `
    <section class="intro section section--light" id="introduccion">
      <!-- Transición orgánica: una duna que enlaza con el azul del hero -->
      <svg class="intro__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,0 L1440,0 L1440,44 C1180,104 980,10 720,44 C460,78 240,120 0,72 Z"
          fill="currentColor"
        />
      </svg>

      <div class="container intro__inner">
        <p class="t-eyebrow intro__eyebrow" appReveal="fade">Del corazón de los Andes a tu mesa</p>

        <h2 class="t-display intro__statement">
          <app-animated-text
            [lines]="[
              'Una semilla pequeña',
              'que atraviesa montañas',
              'para llegar entera a tu mesa.',
            ]"
          />
        </h2>

        <div class="intro__grid">
          <p class="t-lead intro__text" appReveal [revealDelay]="0.1">
            Trabajamos una sola cosa y la trabajamos bien: quinua peruana seleccionada por
            variedad, color y calibre, con procesos pensados para no alterar el grano.
          </p>

          <figure class="intro__figure" appReveal="mask">
            <app-img
              [image]="{
                base: 'assets/img/seeds-macro',
                alt: 'Granos de quinua sobre una superficie azul profundo',
                ratio: 16 / 9,
              }"
              sizes="(min-width: 1024px) 46vw, 90vw"
            />
            <figcaption class="t-small">Grano entero, sin pulir en exceso.</figcaption>
          </figure>
        </div>

        <ul class="intro__facts" appReveal revealChildren="li" [revealStagger]="0.12">
          <li>
            <span class="intro__fact-num t-mono-num">01</span>
            <h3 class="t-heading">Origen identificado</h3>
            <p class="t-small">Cada lote conserva la referencia de su campaña y su zona.</p>
          </li>
          <li>
            <span class="intro__fact-num t-mono-num">02</span>
            <h3 class="t-heading">Selección por grano</h3>
            <p class="t-small">Color y calibre homogéneos para una cocción pareja.</p>
          </li>
          <li>
            <span class="intro__fact-num t-mono-num">03</span>
            <h3 class="t-heading">Envase que protege</h3>
            <p class="t-small">Barrera de luz y cierre resellable para mantener el grano.</p>
          </li>
        </ul>
      </div>
    </section>
  `,
  styleUrl: './intro.scss',
})
export class IntroSection {}
