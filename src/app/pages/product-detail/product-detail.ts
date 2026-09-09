import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CursorTargetDirective, MagneticDirective, RevealDirective } from '../../core/directives';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { UiService } from '../../core/services/ui.service';
import { ImgComponent } from '../../shared/components/img/img';
import { NutritionChartComponent } from '../../shared/components/nutrition-chart/nutrition-chart';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductViewerComponent } from '../../shared/components/product-viewer/product-viewer';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper';
import { PricePipe } from '../../shared/pipes/price.pipe';

/** Ficha de producto: 3D, galería, características, nutrición y relacionados. */
@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ImgComponent,
    ProductViewerComponent,
    QuantityStepperComponent,
    NutritionChartComponent,
    ProductCardComponent,
    PricePipe,
    RevealDirective,
    MagneticDirective,
    CursorTargetDirective,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);
  private readonly seo = inject(SeoService);
  private readonly cart = inject(CartService);
  private readonly ui = inject(UiService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: null,
  });

  protected readonly product = computed(() => {
    const slug = this.slug();
    return slug ? this.service.findBySlug(slug) : undefined;
  });

  protected readonly related = computed(() => this.service.related(this.slug() ?? '', 3));

  protected readonly quantity = signal(1);
  /** Índice de la imagen activa en la galería (0 = visor 3D). */
  protected readonly activeMedia = signal(0);

  /**
   * Motivos para elegir la quinua. Los iconos son trazos SVG en lugar de
   * emoji: el color y el grosor tienen que seguir el sistema visual.
   */
  protected readonly reasons = [
    {
      icon: 'M12 20.5V10m0 3.2C8.7 13.2 6.4 11 6.4 7.7c3.3 0 5.6 2.2 5.6 5.5Zm0-1.4c0-3.3 2.3-5.5 5.6-5.5 0 3.3-2.3 5.5-5.6 5.5Z',
      title: 'Origen peruano',
      text: 'Grano cultivado y seleccionado en los Andes.',
    },
    {
      icon: 'M12 3.5 13.7 9l5.3 1.8-5.3 1.9L12 18l-1.7-5.3L5 10.8 10.3 9 12 3.5Z',
      title: 'Selección cuidadosa',
      text: 'Revisión por variedad, color y calibre.',
    },
    {
      icon: 'M4 10.5h16a8 8 0 0 1-8 8 8 8 0 0 1-8-8ZM9.5 7c0-1.2 1-1.6 1-2.6M14 7c0-1.2 1-1.6 1-2.6',
      title: 'Múltiples preparaciones',
      text: 'Guarniciones, ensaladas, desayunos o platos de cuchara.',
    },
    {
      icon: 'M5 8.5h14v11H5v-11Zm0 0 1.6-4h10.8l1.6 4M9.6 12.4h4.8',
      title: 'Empaque que conserva',
      text: 'Barrera de luz y cierre resellable en cada bolsa.',
    },
  ];

  constructor() {
    // La ficha abre sobre fondo marfil: la barra necesita texto azul.
    this.ui.setHeaderTheme('light');

    effect(() => {
      const product = this.product();

      if (!product) {
        // Slug inexistente: la página 404 se encarga del resto.
        if (this.slug()) void this.router.navigate(['/404'], { skipLocationChange: true });
        return;
      }

      this.quantity.set(1);
      this.activeMedia.set(0);

      this.seo.apply({
        title: `${product.name} — QUI9`,
        description: product.description,
        path: `/productos/${product.slug}`,
        image: `${product.image.base}.jpg`,
        type: 'product',
      });
      this.seo.setProductSchema(product);
    });
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product) return;
    this.cart.add(product, this.quantity());
    this.ui.openCart();
  }
}
