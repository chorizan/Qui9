import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RevealDirective } from '../../../../core/directives';
import { StoryService } from '../../../../core/services/story.service';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/**
 * Testimonios en carrusel.
 *
 * Los textos son ficticios y están marcados como tales en `content.data.ts`:
 * se sustituyen por reseñas reales antes de publicar.
 */
@Component({
  selector: 'app-testimonials-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RevealDirective],
  template: `
    <section class="tm section" id="testimonios" aria-labelledby="tm-title">
      <div class="container tm__inner">
        <app-section-header
          align="center"
          eyebrow="Testimonios"
          [lines]="['Lo que dicen', 'quienes la prueban.']"
        />
        <h2 class="sr-only" id="tm-title">Testimonios de clientes</h2>

        <div class="tm__stage" appReveal="scale">
          <!-- El @for con clave recrea la cita al cambiar: así se repite su entrada. -->
          @for (item of [current()]; track item.id) {
            <blockquote class="tm__quote">
              <div class="tm__stars" [attr.aria-label]="item.rating + ' de 5 estrellas'">
                @for (star of stars(); track $index) {
                  <span aria-hidden="true">★</span>
                }
              </div>
              <p class="tm__text">“{{ item.quote }}”</p>
              <footer class="tm__author">
                <cite>{{ item.author }}</cite>
                <span class="tm__location t-small">{{ item.location }}</span>
              </footer>
            </blockquote>
          }

          <div class="tm__controls">
            <button type="button" class="tm__arrow" (click)="prev()" aria-label="Testimonio anterior">
              <span aria-hidden="true">←</span>
            </button>

            <div class="tm__dots" role="tablist" aria-label="Seleccionar testimonio">
              @for (item of testimonials; track item.id; let i = $index) {
                <button
                  type="button"
                  class="tm__dot"
                  [class.is-active]="i === index()"
                  [attr.aria-selected]="i === index()"
                  [attr.aria-label]="'Testimonio ' + (i + 1)"
                  role="tab"
                  (click)="go(i)"
                ></button>
              }
            </div>

            <button type="button" class="tm__arrow" (click)="next()" aria-label="Testimonio siguiente">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <p class="tm__note t-small">
          Testimonios de ejemplo. Se reemplazarán por reseñas verificadas de clientes.
        </p>
      </div>
    </section>
  `,
  styleUrl: './testimonials.scss',
})
export class TestimonialsSection {
  private readonly story = inject(StoryService);

  protected readonly testimonials = this.story.testimonials();
  protected readonly index = signal(0);
  protected readonly current = computed(() => this.testimonials[this.index()]);
  protected readonly stars = computed(() => Array.from({ length: this.current().rating }));

  protected go(index: number): void {
    this.index.set(index);
  }

  protected next(): void {
    this.index.update((i) => (i + 1) % this.testimonials.length);
  }

  protected prev(): void {
    this.index.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }
}
