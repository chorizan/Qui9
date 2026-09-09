import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { OrderConfirmation, OrderDraft } from '../models';

/**
 * Alta de pedidos.
 *
 * Simula la respuesta del backend. Cuando exista la API real, `submit`
 * pasará a ser `http.post<OrderConfirmation>('/api/orders', draft)` y la
 * pasarela de pago se enganchará a la confirmación devuelta.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  submit(draft: OrderDraft): Observable<OrderConfirmation> {
    const confirmation: OrderConfirmation = {
      reference: this.buildReference(),
      createdAt: new Date().toISOString(),
      total: draft.total,
      status: 'pending_payment',
    };
    return of(confirmation).pipe(delay(900));
  }

  private buildReference(): string {
    const stamp = Date.now().toString(36).toUpperCase().slice(-5);
    const random = Math.random().toString(36).toUpperCase().slice(2, 5);
    return `QUI9-${stamp}${random}`;
  }
}
