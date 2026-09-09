import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { UiService } from '../../core/services/ui.service';
import { LogoComponent } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent],
  template: `
    <section class="nf">
      <app-logo variant="lockup" [size]="40" />
      <p class="t-eyebrow nf__code">Error 404</p>
      <h1 class="t-display">Esta página se perdió camino a la mesa.</h1>
      <p class="t-lead">
        El enlace que buscas ya no existe. Vuelve al inicio o descubre nuestra selección.
      </p>
      <div class="nf__actions">
        <a class="btn btn--dark" routerLink="/">Volver al inicio</a>
        <a class="btn btn--outline-dark" routerLink="/productos">Ver productos</a>
      </div>
    </section>
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'mixins' as *;

      .nf {
        @include container(760px);
        min-height: 78vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        text-align: center;
        color: $blue-deep;
        padding-block: 140px 100px;
      }

      .nf__code {
        color: $gold;
      }

      .nf__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        margin-top: 12px;
      }
    `,
  ],
})
export class NotFoundPage {
  private readonly seo = inject(SeoService);

  constructor() {
    inject(UiService).setHeaderTheme('light');

    this.seo.apply({
      title: 'Página no encontrada — QUI9',
      description: 'La página que buscas no existe. Descubre la quinua peruana QUI9.',
      path: '/404',
    });
  }
}
