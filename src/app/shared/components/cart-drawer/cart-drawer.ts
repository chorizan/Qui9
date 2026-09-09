import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SHIPPING_CONFIG } from '../../../core/data/products.data';
import { CartService } from '../../../core/services/cart.service';
import { UiService } from '../../../core/services/ui.service';
import { PricePipe } from '../../pipes/price.pipe';
import { ImgComponent } from '../img/img';
import { QuantityStepperComponent } from '../quantity-stepper/quantity-stepper';

/**
 * Carrito lateral.
 *
 * Entra desde la derecha en escritorio y ocupa toda la pantalla en móvil.
 * La entrada y la salida usan las animaciones nativas de Angular
 * (`animate.enter` / `animate.leave`), de modo que el panel se anima también
 * al desmontarse del DOM.
 */
@Component({
  selector: 'app-cart-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ImgComponent, QuantityStepperComponent, PricePipe],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawerComponent {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);

  protected readonly freeFrom = SHIPPING_CONFIG.freeFrom;

  /** Progreso hacia el envío sin coste, en porcentaje. */
  protected readonly shippingProgress = computed(() => {
    const subtotal = this.cart.summary().subtotal;
    return Math.min(100, Math.round((subtotal / SHIPPING_CONFIG.freeFrom) * 100));
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.ui.cartOpen()) this.ui.closeCart();
  }
}
