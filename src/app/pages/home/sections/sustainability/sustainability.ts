import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ParallaxDirective, RevealDirective } from '../../../../core/directives';
import { StoryService } from '../../../../core/services/story.service';
import { ImgComponent } from '../../../../shared/components/img/img';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/**
 * Sostenibilidad.
 *
 * Se describe el enfoque de trabajo sin afirmar certificaciones ni cifras
 * que la marca todavía no pueda demostrar. Cada pilar indica explícitamente
 * qué información se publicará cuando esté verificada.
 */
@Component({
  selector: 'app-sustainability-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ImgComponent, RevealDirective, ParallaxDirective],
  template: `
    <section class="sus" id="sostenibilidad" aria-labelledby="sus-title">
      <div class="sus__media" aria-hidden="true">
        <app-img
          appParallax
          [parallaxSpeed]="0.18"
          [image]="{ base: 'assets/img/sustainability', alt: '', ratio: 16 / 9 }"
          sizes="100vw"
        />
        <span class="sus__veil"></span>
      </div>

      <div class="container sus__inner">
        <app-section-header
          eyebrow="Sostenibilidad"
          [lines]="['Cuidar el origen', 'también es cuidar', 'el futuro.']"
          text="Nuestro compromiso empieza por no prometer más de lo que podemos demostrar."
        />
        <h2 class="sr-only" id="sus-title">Sostenibilidad</h2>

        <ul class="sus__pillars" appReveal revealChildren="li" [revealStagger]="0.1">
          @for (pillar of pillars; track pillar.id) {
            <li>
              <h3 class="sus__pillar-title">{{ pillar.title }}</h3>
              <p class="t-small">{{ pillar.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './sustainability.scss',
})
export class SustainabilitySection {
  private readonly story = inject(StoryService);
  protected readonly pillars = this.story.sustainability();
}
