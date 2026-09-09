import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RevealDirective } from '../../../../core/directives';
import { ProductService } from '../../../../core/services/product.service';
import { NutritionChartComponent } from '../../../../shared/components/nutrition-chart/nutrition-chart';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/**
 * "Pequeña semilla. Gran alimento."
 *
 * Presenta el formato de la información nutricional. Los valores se muestran
 * como pendientes hasta que la marca disponga de un análisis de laboratorio:
 * la interfaz ya está lista para recibirlos sin cambios de código.
 */
@Component({
  selector: 'app-nutrition-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeaderComponent,
    NutritionChartComponent,
    ParticleFieldComponent,
    RevealDirective,
  ],
  template: `
    <section class="nut" id="nutricion" aria-labelledby="nut-title">
      <app-particle-field class="nut__particles" tint="rgba(201, 169, 97, 1)" [density]="0.6" />

      <div class="container nut__inner">
        <div class="nut__intro">
          <app-section-header
            eyebrow="Información nutricional"
            [lines]="['Pequeña semilla.', 'Gran alimento.']"
            text="Publicamos únicamente lo que podemos respaldar. En cuanto el análisis de cada campaña esté disponible, estos valores se completan aquí."
          />

          <p class="nut__disclaimer t-small" appReveal="fade" [revealDelay]="0.2">
            <span class="nut__dot" aria-hidden="true"></span>
            Los valores por porción se incorporarán con el informe de laboratorio del lote
            correspondiente.
          </p>
        </div>

        <div class="nut__chart" appReveal [revealDelay]="0.1">
          <h2 class="sr-only" id="nut-title">Perfil nutricional</h2>
          <app-nutrition-chart [facts]="facts" />
        </div>
      </div>
    </section>
  `,
  styleUrl: './nutrition.scss',
})
export class NutritionSection {
  private readonly products = inject(ProductService);

  /** Todas las variedades comparten la misma plantilla de métricas. */
  protected readonly facts = this.products.products()[0].nutrition;
}
