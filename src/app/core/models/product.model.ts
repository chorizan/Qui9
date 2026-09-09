import { ImageAsset } from './image.model';

/** Variedades de grano que maneja la marca. */
export type QuinoaVariety = 'blanca' | 'roja' | 'negra' | 'tricolor';

export type ProductCategory = 'grano' | 'hojuelas' | 'harina' | 'pack';

/**
 * Dato nutricional.
 *
 * IMPORTANTE: `value` es `null` mientras no exista un análisis de laboratorio
 * de la marca. La interfaz muestra el estado "por confirmar" en lugar de
 * inventar cifras. Al recibir los valores reales basta con completarlos.
 */
export interface NutritionFact {
  id: string;
  label: string;
  /** Valor real por porción. `null` = pendiente de análisis. */
  value: number | null;
  unit: string;
  /** Referencia de la medida, p. ej. "por 100 g". */
  per: string;
  /** Nota corta y cualitativa (sin afirmaciones nutricionales no verificables). */
  note: string;
  /** Sólo para el gráfico: proporción 0–1 usada cuando aún no hay valor real. */
  placeholderRatio: number;
}

export interface ProductAttribute {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  /** URL amigable: /productos/{slug} */
  slug: string;
  name: string;
  /** Nombre corto para el carrito y migas de pan. */
  shortName: string;
  variety: QuinoaVariety;
  category: ProductCategory;
  tagline: string;
  description: string;
  /** Descripción extensa de la ficha de producto. */
  longDescription: string;
  /** Precio mock en soles. Reemplazar por el precio real de la marca. */
  price: number;
  currency: 'PEN';
  /** Peso neto en gramos. */
  weightGrams: number;
  presentation: string;
  image: ImageAsset;
  gallery: ImageAsset[];
  /** Ruta al modelo 3D específico; si no existe se usa el modelo genérico. */
  model3D?: string;
  /** Color de acento del grano, usado en detalles de UI y en el visor 3D. */
  grainColor: string;
  features: string[];
  attributes: ProductAttribute[];
  nutrition: NutritionFact[];
  available: boolean;
  featured: boolean;
}
