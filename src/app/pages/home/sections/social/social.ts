import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CursorTargetDirective, RevealDirective } from '../../../../core/directives';
import { SITE } from '../../../../core/data/site.data';
import { StoryService } from '../../../../core/services/story.service';
import { ImgComponent } from '../../../../shared/components/img/img';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/** "Síguenos en el viaje": retícula de publicaciones sociales. */
@Component({
  selector: 'app-social-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ImgComponent, RevealDirective, CursorTargetDirective],
  template: `
    <section class="social section" id="instagram" aria-labelledby="social-title">
      <div class="container">
        <div class="social__head">
          <app-section-header
            eyebrow="Comunidad"
            [lines]="['Síguenos', 'en el viaje.']"
            text="Recetas, campo, producto y cocina real. Lo que pasa entre la cosecha y la mesa."
          />
          <a
            class="btn btn--outline-dark social__cta"
            [href]="instagram.url"
            target="_blank"
            rel="noopener"
            appCursor="link"
          >
            Ver Instagram
            <span class="btn__icon" aria-hidden="true">→</span>
          </a>
        </div>
        <h2 class="sr-only" id="social-title">Publicaciones en redes sociales</h2>

        <ul class="social__grid" appReveal revealChildren="li" [revealStagger]="0.06">
          @for (post of posts; track post.id) {
            <li class="social__item">
              <a
                [href]="post.url"
                target="_blank"
                rel="noopener"
                appCursor="explore"
                cursorLabel="Explorar"
              >
                <app-img [image]="post.image" sizes="(min-width: 768px) 24vw, 48vw" />
                <span class="social__caption">{{ post.caption }}</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './social.scss',
})
export class SocialSection {
  private readonly story = inject(StoryService);

  protected readonly posts = this.story.social();
  protected readonly instagram = SITE.social[0];
}
