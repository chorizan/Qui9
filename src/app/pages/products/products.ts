import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CursorTargetDirective, RevealDirective } from '../../core/directives';
import { QuinoaVariety } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { UiService } from '../../core/services/ui.service';
import { AnimatedTextComponent } from '../../shared/components/animated-text/animated-text';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

type Filter = QuinoaVariety | 'todas';

/** Catálogo completo con filtro por variedad. */
@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, AnimatedTextComponent, RevealDirective, CursorTargetDirective],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsPage {
  private readonly service = inject(ProductService);
  private readonly seo = inject(SeoService);

  protected readonly filters: { id: Filter; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'blanca', label: 'Blanca' },
    { id: 'roja', label: 'Roja' },
    { id: 'negra', label: 'Negra' },
    { id: 'tricolor', label: 'Tricolor' },
  ];

  protected readonly active = signal<Filter>('todas');

  protected readonly products = computed(() => {
    const all = this.service.products();
    const filter = this.active();
    return filter === 'todas' ? all : all.filter((p) => p.variety === filter);
  });

  constructor() {
    // La página abre con la cabecera azul: la barra se mantiene en marfil.
    inject(UiService).setHeaderTheme('dark');

    this.seo.apply({
      title: 'Nuestra selección — QUI9',
      description:
        'Quinua blanca, roja, negra y la selección tricolor. Grano entero seleccionado en los Andes del Perú.',
      path: '/productos',
    });
    this.seo.setCatalogSchema(this.service.products());
  }

  protected setFilter(filter: Filter): void {
    this.active.set(filter);
  }
}
