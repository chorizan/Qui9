import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursorTargetDirective, RevealDirective } from '../../../../core/directives';
import { Product } from '../../../../core/models';
import { ProductService } from '../../../../core/services/product.service';
import { ProductViewerComponent } from '../../../../shared/components/product-viewer/product-viewer';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/**
 * "Mírala de cerca": visor 3D interactivo con selector de variedad.
 * El grano del producto elegido tiñe las partículas de la escena.
 */
@Component({
  selector: 'app-experience-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SectionHeaderComponent,
    ProductViewerComponent,
    RevealDirective,
    CursorTargetDirective,
  ],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceSection {
  private readonly products = inject(ProductService);

  protected readonly catalog = this.products.featured();
  protected readonly selected = signal<Product>(this.catalog[0]);

  protected readonly capabilities = [
    { title: 'Rotación 360°', text: 'Arrastra para girar el envase y verlo desde cualquier ángulo.' },
    { title: 'Zoom real', text: 'Acércate al detalle del acabado mate y la franja dorada.' },
    { title: 'Luz de estudio', text: 'Iluminación PBR calculada en tiempo real sobre el producto.' },
    { title: 'Sin WebGL, también', text: 'Si tu equipo no lo soporta, mostramos la fotografía.' },
  ];

  protected select(product: Product): void {
    this.selected.set(product);
  }
}
