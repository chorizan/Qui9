import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursorTargetDirective, MagneticDirective, RevealDirective } from '../../../../core/directives';
import { AnimatedTextComponent } from '../../../../shared/components/animated-text/animated-text';
import { LogoComponent } from '../../../../shared/components/logo/logo';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field';

/** Cierre de la narrativa: la invitación a comprar. */
@Component({
  selector: 'app-cta-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AnimatedTextComponent,
    ParticleFieldComponent,
    LogoComponent,
    RevealDirective,
    MagneticDirective,
    CursorTargetDirective,
  ],
  template: `
    <section class="cta" aria-labelledby="cta-title">
      <app-particle-field class="cta__particles" tint="rgba(245, 240, 230, 1)" [density]="0.8" />
      <span class="cta__halo" aria-hidden="true"></span>

      <div class="container cta__inner">
        <app-logo class="cta__logo" [size]="104" />

        <h2 class="t-display cta__title" id="cta-title">
          <app-animated-text [lines]="['Empieza por', 'el grano correcto.']" />
        </h2>

        <p class="t-lead cta__text" appReveal [revealDelay]="0.15">
          Elige tu variedad, recíbela en casa y comprueba la diferencia desde la primera cocción.
        </p>

        <div class="cta__actions" appReveal [revealDelay]="0.25">
          <a class="btn btn--primary" routerLink="/productos" appMagnetic appCursor="link">
            Comprar ahora
            <span class="btn__icon" aria-hidden="true">→</span>
          </a>
          <a class="btn btn--ghost" routerLink="/" fragment="historia" appCursor="link">
            Conocer la historia
          </a>
        </div>

        <span class="hairline cta__hairline" appReveal="line" aria-hidden="true"></span>
      </div>
    </section>
  `,
  styleUrl: './cta.scss',
})
export class CtaSection {}
