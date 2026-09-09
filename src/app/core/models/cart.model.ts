import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

/** Estado serializado en localStorage (sólo id + cantidad). */
export interface PersistedCartLine {
  productId: string;
  quantity: number;
}

export interface CartSummary {
  /** Unidades totales. */
  count: number;
  subtotal: number;
  /** Coste de envío; 0 cuando el subtotal supera el umbral gratuito. */
  shipping: number;
  total: number;
  /** Cuánto falta para el envío sin coste (0 si ya se alcanzó). */
  missingForFreeShipping: number;
}
