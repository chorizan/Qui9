import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../data/site.data';
import { Product } from '../models';

export interface SeoTags {
  title: string;
  description: string;
  /** Ruta relativa, p. ej. `/productos/quinua-roja-real`. */
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
}

const JSONLD_ID = 'qui9-structured-data';

/** Título, descripción, Open Graph, Twitter Cards, canonical y Schema.org. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  apply(tags: SeoTags): void {
    const url = `${SITE.url}${tags.path ?? '/'}`;
    const image = tags.image ?? `${SITE.url}/assets/brand/og-cover.png`;

    this.title.setTitle(tags.title);
    this.meta.updateTag({ name: 'description', content: tags.description });

    this.meta.updateTag({ property: 'og:title', content: tags.title });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: tags.type ?? 'website' });

    this.meta.updateTag({ name: 'twitter:title', content: tags.title });
    this.meta.updateTag({ name: 'twitter:description', content: tags.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
  }

  /** Schema.org Product para las fichas de producto. */
  setProductSchema(product: Product): void {
    this.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: `${SITE.url}/${product.image.base}.jpg`,
      brand: { '@type': 'Brand', name: SITE.name },
      category: 'Alimentos > Granos > Quinua',
      weight: { '@type': 'QuantitativeValue', value: product.weightGrams, unitCode: 'GRM' },
      offers: {
        '@type': 'Offer',
        url: `${SITE.url}/productos/${product.slug}`,
        priceCurrency: product.currency,
        price: product.price.toFixed(2),
        availability: product.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: SITE.name },
      },
    });
  }

  /** Listado de productos como ItemList. */
  setCatalogSchema(products: Product[]): void {
    this.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Nuestra selección de quinua peruana',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE.url}/productos/${product.slug}`,
        name: product.name,
      })),
    });
  }

  clearStructuredData(): void {
    this.doc.getElementById(JSONLD_ID)?.remove();
  }

  private setStructuredData(data: unknown): void {
    this.clearStructuredData();
    const script = this.doc.createElement('script');
    script.id = JSONLD_ID;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
