import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PRODUCTS } from '../data/products.data';
import { Product, QuinoaVariety } from '../models';

/**
 * Catálogo de productos.
 *
 * Hoy sirve datos mock en memoria, pero la firma de los métodos ya es la de
 * un cliente HTTP (`Observable`). Al conectar el backend basta con sustituir
 * los `of(...)` por llamadas a `HttpClient` sin tocar los componentes.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly source = signal<Product[]>(PRODUCTS);

  readonly products = computed(() => this.source());
  readonly featured = computed(() => this.source().filter((p) => p.featured));
  readonly available = computed(() => this.source().filter((p) => p.available));

  /** GET /api/products */
  list(): Observable<Product[]> {
    return of(this.source()).pipe(delay(0));
  }

  /** GET /api/products/{slug} */
  bySlug(slug: string): Observable<Product | undefined> {
    return of(this.source().find((p) => p.slug === slug)).pipe(delay(0));
  }

  /** Lectura síncrona para resolvers y plantillas. */
  findBySlug(slug: string): Product | undefined {
    return this.source().find((p) => p.slug === slug);
  }

  findById(id: string): Product | undefined {
    return this.source().find((p) => p.id === id);
  }

  byVariety(variety: QuinoaVariety): Product[] {
    return this.source().filter((p) => p.variety === variety);
  }

  /** Otros productos para el bloque "también te puede interesar". */
  related(slug: string, limit = 3): Product[] {
    return this.source()
      .filter((p) => p.slug !== slug && p.available)
      .slice(0, limit);
  }
}
