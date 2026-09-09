import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CursorTargetDirective } from '../../../core/directives';
import { Recipe } from '../../../core/models';
import { ImgComponent } from '../img/img';

/** Tarjeta de receta: fotografía grande, overlay al pasar el ratón y meta. */
@Component({
  selector: 'app-recipe-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImgComponent, CursorTargetDirective],
  template: `
    <article class="recipe" appCursor="explore" cursorLabel="Explorar">
      <div class="recipe__media">
        <app-img [image]="recipe().image" [sizes]="sizes()" />
        <div class="recipe__overlay">
          <span class="recipe__cta">
            Ver receta
            <span aria-hidden="true">→</span>
          </span>
        </div>
        <span class="recipe__tag">{{ recipe().variety }}</span>
      </div>

      <div class="recipe__body">
        <h3 class="recipe__title">{{ recipe().title }}</h3>
        <p class="recipe__desc t-small">{{ recipe().description }}</p>
        <ul class="recipe__meta t-small">
          <li>{{ recipe().time }}</li>
          <li>{{ recipe().difficulty }}</li>
          <li>{{ recipe().serves }}</li>
        </ul>
      </div>
    </article>
  `,
  styleUrl: './recipe-card.scss',
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly sizes = input('(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 88vw');
}
