import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { SHIPPING_CONFIG } from '../data/products.data';
import { CartItem, CartSummary, PersistedCartLine, Product } from '../models';
import { ProductService } from './product.service';

const STORAGE_KEY = 'qui9.cart.v1';

/** Carrito con persistencia local y totales derivados por señales. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly products = inject(ProductService);

  private readonly lines = signal<CartItem[]>(this.restore());

  readonly items = computed(() => this.lines());
  readonly count = computed(() => this.lines().reduce((total, i) => total + i.quantity, 0));
  readonly isEmpty = computed(() => this.lines().length === 0);

  readonly summary = computed<CartSummary>(() => {
    const subtotal = this.lines().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const qualifies = subtotal >= SHIPPING_CONFIG.freeFrom || subtotal === 0;
    const shipping = qualifies ? 0 : SHIPPING_CONFIG.cost;
    return {
      count: this.count(),
      subtotal,
      shipping,
      total: subtotal + shipping,
      missingForFreeShipping: Math.max(0, SHIPPING_CONFIG.freeFrom - subtotal),
    };
  });

  /** Marca el último producto añadido para animar el icono del carrito. */
  readonly lastAdded = signal<Product | null>(null);

  constructor() {
    effect(() => this.persist(this.lines()));
  }

  add(product: Product, quantity = 1): void {
    if (!product.available || quantity < 1) return;

    this.lines.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i,
        );
      }
      return [...items, { product, quantity }];
    });

    this.lastAdded.set(product);
  }

  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.lines.update((items) =>
      items.map((i) => (i.product.id === productId ? { ...i, quantity: Math.min(99, quantity) } : i)),
    );
  }

  increment(productId: string): void {
    const item = this.lines().find((i) => i.product.id === productId);
    if (item) this.setQuantity(productId, item.quantity + 1);
  }

  decrement(productId: string): void {
    const item = this.lines().find((i) => i.product.id === productId);
    if (item) this.setQuantity(productId, item.quantity - 1);
  }

  remove(productId: string): void {
    this.lines.update((items) => items.filter((i) => i.product.id !== productId));
  }

  clear(): void {
    this.lines.set([]);
  }

  quantityOf(productId: string): number {
    return this.lines().find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  // --- Persistencia ------------------------------------------------
  // Guardamos sólo id + cantidad: el precio y los textos siempre vienen
  // del catálogo, nunca de datos guardados en el navegador.

  private persist(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') return;
    const payload: PersistedCartLine[] = items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* almacenamiento lleno o bloqueado: el carrito sigue en memoria */
    }
  }

  private restore(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as PersistedCartLine[];
      return parsed
        .map((line) => {
          const product = this.products.findById(line.productId);
          return product ? { product, quantity: Math.min(99, Math.max(1, line.quantity)) } : null;
        })
        .filter((i): i is CartItem => i !== null);
    } catch {
      return [];
    }
  }
}
