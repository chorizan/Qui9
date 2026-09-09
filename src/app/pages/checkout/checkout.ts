import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DEPARTAMENTOS } from '../../core/data/site.data';
import { DeliveryMethod, OrderConfirmation, PaymentMethod } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { SeoService } from '../../core/services/seo.service';
import { UiService } from '../../core/services/ui.service';
import { ImgComponent } from '../../shared/components/img/img';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper';
import { PricePipe } from '../../shared/pipes/price.pipe';

/**
 * Checkout en una sola vista: datos, entrega, pago y resumen.
 *
 * El envío llama a `OrderService`, que hoy simula la respuesta del backend.
 * La integración con la pasarela de pago se enganchará a la confirmación.
 */
@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ImgComponent, QuantityStepperComponent, PricePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutPage {
  private readonly fb = inject(FormBuilder);
  private readonly orders = inject(OrderService);
  private readonly seo = inject(SeoService);

  protected readonly cart = inject(CartService);
  protected readonly departamentos = DEPARTAMENTOS;

  protected readonly submitting = signal(false);
  protected readonly confirmation = signal<OrderConfirmation | null>(null);

  protected readonly deliveryOptions: { id: DeliveryMethod; label: string; note: string }[] = [
    { id: 'delivery', label: 'Envío a domicilio', note: '2 a 5 días hábiles' },
    { id: 'pickup', label: 'Recojo en tienda', note: 'Coordinamos por correo' },
  ];

  protected readonly paymentOptions: { id: PaymentMethod; label: string; note: string }[] = [
    { id: 'card', label: 'Tarjeta', note: 'Débito o crédito' },
    { id: 'yape', label: 'Yape / Plin', note: 'Pago móvil' },
    { id: 'transfer', label: 'Transferencia', note: 'Banca por internet' },
    { id: 'cash', label: 'Contra entrega', note: 'Sólo Lima Metropolitana' },
  ];

  protected readonly form: FormGroup = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{6,15}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    district: ['', Validators.required],
    province: ['', Validators.required],
    department: ['Lima', Validators.required],
    notes: [''],
    delivery: ['delivery' as DeliveryMethod, Validators.required],
    payment: ['card' as PaymentMethod, Validators.required],
  });

  constructor() {
    inject(UiService).setHeaderTheme('light');

    this.seo.apply({
      title: 'Finalizar compra — QUI9',
      description: 'Completa tu pedido de quinua peruana QUI9.',
      path: '/checkout',
    });
  }

  /** Marca un campo como inválido sólo cuando el usuario ya interactuó. */
  protected invalid(control: string): boolean {
    const field = this.form.get(control);
    return !!field && field.invalid && (field.touched || field.dirty);
  }

  protected submit(): void {
    if (this.form.invalid || this.cart.isEmpty()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const summary = this.cart.summary();

    this.submitting.set(true);

    this.orders
      .submit({
        customer: {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          phone: value.phone,
          address: value.address,
          district: value.district,
          province: value.province,
          department: value.department,
          notes: value.notes,
        },
        delivery: value.delivery,
        payment: value.payment,
        items: this.cart.items(),
        subtotal: summary.subtotal,
        shipping: summary.shipping,
        total: summary.total,
      })
      .subscribe((confirmation) => {
        this.confirmation.set(confirmation);
        this.submitting.set(false);
        this.cart.clear();
        window.scrollTo({ top: 0 });
      });
  }
}
