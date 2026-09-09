import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RevealDirective } from '../../../../core/directives';
import { StoryService } from '../../../../core/services/story.service';
import { RecipeCardComponent } from '../../../../shared/components/recipe-card/recipe-card';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/** "Llévala a tu mesa": recetas con fotografía grande. */
@Component({
  selector: 'app-recipes-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RecipeCardComponent, RevealDirective],
  template: `
    <section class="recipes section section--light" id="recetas" aria-labelledby="recipes-title">
      <div class="container">
        <app-section-header
          eyebrow="Recetas"
          [lines]="['Llévala', 'a tu mesa.']"
          text="Cuatro maneras de empezar. La quinua admite mucho más, pero por algún sitio hay que abrir el paquete."
        />
        <h2 class="sr-only" id="recipes-title">Recetas con quinua</h2>

        <div class="recipes__grid" appReveal revealChildren="app-recipe-card" [revealStagger]="0.1">
          @for (recipe of recipes; track recipe.id) {
            <app-recipe-card [recipe]="recipe" />
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './recipes.scss',
})
export class RecipesSection {
  private readonly story = inject(StoryService);
  protected readonly recipes = this.story.recipes();
}
