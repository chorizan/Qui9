import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursorTargetDirective } from '../../../core/directives';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { UiService } from '../../../core/services/ui.service';
import { PricePipe } from '../../pipes/price.pipe';
import { ImgComponent } from '../img/img';

/**
 * Tarjeta de producto.
 *
 * Toda la superficie es un enlace a la ficha; el botón de compra vive encima
 * y detiene la propagación para poder añadir sin salir del listado.
 */
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ImgComponent, PricePipe, CursorTargetDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  private readonly cart = inject(CartService);
  private readonly ui = inject(UiService);

  readonly product = input.required<Product>();
  /** Índice dentro de la lista, para escalonar la animación de entrada. */
  readonly index = input(0);
  readonly sizes = input('(min-width: 1024px) 32vw, (min-width: 768px) 46vw, 88vw');

  protected addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cart.add(this.product());
    this.ui.openCart();
  }
}
