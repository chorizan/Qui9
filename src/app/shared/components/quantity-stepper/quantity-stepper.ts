import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Selector de cantidad accesible, compartido por carrito y ficha de producto. */
@Component({
  selector: 'app-quantity-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stepper" [class.stepper--compact]="compact()">
      <button
        type="button"
        class="stepper__btn"
        (click)="change(quantity() - 1)"
        [disabled]="quantity() <= min()"
        [attr.aria-label]="'Reducir cantidad de ' + label()"
      >
        <span aria-hidden="true">−</span>
      </button>

      <span class="stepper__value t-mono-num" aria-live="polite">{{ quantity() }}</span>

      <button
        type="button"
        class="stepper__btn"
        (click)="change(quantity() + 1)"
        [disabled]="quantity() >= max()"
        [attr.aria-label]="'Aumentar cantidad de ' + label()"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  `,
  styleUrl: './quantity-stepper.scss',
})
export class QuantityStepperComponent {
  readonly quantity = input(1);
  readonly min = input(1);
  readonly max = input(99);
  readonly compact = input(false);
  /** Nombre del producto, para las etiquetas de accesibilidad. */
  readonly label = input('producto');

  readonly quantityChange = output<number>();

  protected change(next: number): void {
    const clamped = Math.min(this.max(), Math.max(this.min(), next));
    if (clamped !== this.quantity()) this.quantityChange.emit(clamped);
  }
}
