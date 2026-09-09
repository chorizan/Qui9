import { CartItem } from './cart.model';

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'card' | 'yape' | 'transfer' | 'cash';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  department: string;
  notes?: string;
}

export interface OrderDraft {
  customer: CustomerInfo;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface OrderConfirmation {
  /** Código legible para el cliente. */
  reference: string;
  createdAt: string;
  total: number;
  /** El backend real devolverá el estado de la pasarela de pago. */
  status: 'pending_payment' | 'confirmed';
}
