import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursorTargetDirective, RevealDirective } from '../../../../core/directives';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/** "Nuestra selección": las variedades destacadas del catálogo. */
@Component({
  selector: 'app-catalog-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SectionHeaderComponent,
    ProductCardComponent,
    RevealDirective,
    CursorTargetDirective,
  ],
  template: `
    <section class="catalog section section--light" id="productos" aria-labelledby="catalog-title">
      <div class="container">
        <div class="catalog__head">
          <app-section-header
            eyebrow="Nuestra selección"
            [lines]="['Tres variedades.', 'Un mismo criterio.']"
            text="Cada variedad tiene su carácter. Todas comparten la misma selección y el mismo envase que protege el grano."
          />
          <a class="link-underline catalog__all" routerLink="/productos" appCursor="link">
            Ver todo el catálogo
          </a>
        </div>

        <h2 class="sr-only" id="catalog-title">Productos destacados</h2>

        <div class="catalog__grid" appReveal revealChildren="app-product-card" [revealStagger]="0.12">
          @for (product of products; track product.id; let i = $index) {
            <app-product-card [product]="product" [index]="i" />
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './catalog.scss',
})
export class CatalogSection {
  private readonly service = inject(ProductService);
  protected readonly products = this.service.featured();
}
