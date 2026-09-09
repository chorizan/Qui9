import { NutritionFact, Product } from '../models';

/**
 * DATOS MOCK — sustituir por la respuesta del backend/CMS.
 *
 * · Los precios son referenciales y NO son precios definitivos de la marca.
 * · Los valores nutricionales están en `null` a propósito: se completan
 *   cuando exista un análisis de laboratorio de los lotes reales.
 */

/** Ficha nutricional compartida: mismas métricas para todas las variedades. */
const nutritionTemplate = (): NutritionFact[] => [
  {
    id: 'protein',
    label: 'Proteína',
    value: null,
    unit: 'g',
    per: 'por 100 g',
    note: 'Valor declarado tras el análisis de cada lote.',
    placeholderRatio: 0.78,
  },
  {
    id: 'fiber',
    label: 'Fibra',
    value: null,
    unit: 'g',
    per: 'por 100 g',
    note: 'Valor declarado tras el análisis de cada lote.',
    placeholderRatio: 0.62,
  },
  {
    id: 'minerals',
    label: 'Minerales',
    value: null,
    unit: 'mg',
    per: 'por 100 g',
    note: 'Perfil mineral pendiente de informe.',
    placeholderRatio: 0.7,
  },
  {
    id: 'energy',
    label: 'Energía',
    value: null,
    unit: 'kcal',
    per: 'por 100 g',
    note: 'Aporte energético pendiente de informe.',
    placeholderRatio: 0.55,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'qn-001',
    slug: 'quinua-blanca-andina',
    name: 'Quinua Blanca Andina',
    shortName: 'Quinua Blanca',
    variety: 'blanca',
    category: 'grano',
    tagline: 'Textura ligera, sabor delicado',
    description: 'Textura ligera y sabor delicado para acompañar tus comidas.',
    longDescription:
      'Nuestra quinua blanca se selecciona grano a grano para conservar una textura suelta y un sabor suave que combina con cualquier preparación. Es el punto de partida ideal para quien descubre la quinua y la base preferida en cocinas donde el grano debe acompañar sin imponerse.',
    price: 24.9,
    currency: 'PEN',
    weightGrams: 500,
    presentation: 'Bolsa resellable de 500 g',
    image: {
      base: 'assets/img/pack-blanca',
      alt: 'Envase azul de Quinua Blanca Andina QUI9 junto a un cuenco con granos blancos',
      ratio: 1,
    },
    gallery: [
      {
        base: 'assets/img/pack-blanca',
        alt: 'Envase de Quinua Blanca Andina QUI9',
        ratio: 1,
      },
      {
        base: 'assets/img/seeds-macro',
        alt: 'Macro de granos de quinua blanca sobre fondo azul profundo',
        ratio: 16 / 9,
      },
      {
        base: 'assets/img/farmer-hands',
        alt: 'Manos de agricultor andino sosteniendo granos de quinua',
        ratio: 4 / 3,
      },
    ],
    grainColor: '#efe6d2',
    features: [
      'Grano entero seleccionado',
      'Lavado y secado controlado',
      'Cocción aproximada de 15 minutos',
      'Envase resellable con barrera de luz',
    ],
    attributes: [
      { label: 'Variedad', value: 'Blanca' },
      { label: 'Presentación', value: 'Bolsa resellable' },
      { label: 'Peso neto', value: '500 g' },
      { label: 'Origen', value: 'Andes del Perú' },
    ],
    nutrition: nutritionTemplate(),
    available: true,
    featured: true,
  },
  {
    id: 'qn-002',
    slug: 'quinua-roja-real',
    name: 'Quinua Roja Real',
    shortName: 'Quinua Roja',
    variety: 'roja',
    category: 'grano',
    tagline: 'Carácter intenso, textura firme',
    description: 'Una variedad de carácter intenso y textura particular.',
    longDescription:
      'La quinua roja mantiene el grano firme después de la cocción, por lo que aporta cuerpo y contraste a ensaladas, guarniciones y platos fríos. Su color profundo y su textura marcada la convierten en la elección de quienes buscan que el grano se note en el plato.',
    price: 27.9,
    currency: 'PEN',
    weightGrams: 500,
    presentation: 'Bolsa resellable de 500 g',
    image: {
      base: 'assets/img/pack-roja',
      alt: 'Envase azul de Quinua Roja Real QUI9 junto a un cuenco con granos rojos',
      ratio: 1,
    },
    gallery: [
      { base: 'assets/img/pack-roja', alt: 'Envase de Quinua Roja Real QUI9', ratio: 1 },
      {
        base: 'assets/img/recipe-salad',
        alt: 'Ensalada preparada con quinua roja',
        ratio: 4 / 3,
      },
      {
        base: 'assets/img/quinoa-field',
        alt: 'Panojas de quinua roja en un campo andino',
        ratio: 3 / 4,
      },
    ],
    grainColor: '#8c3b2e',
    features: [
      'Grano firme tras la cocción',
      'Ideal para ensaladas y guarniciones',
      'Selección por color y calibre',
      'Envase resellable con barrera de luz',
    ],
    attributes: [
      { label: 'Variedad', value: 'Roja' },
      { label: 'Presentación', value: 'Bolsa resellable' },
      { label: 'Peso neto', value: '500 g' },
      { label: 'Origen', value: 'Andes del Perú' },
    ],
    nutrition: nutritionTemplate(),
    available: true,
    featured: true,
  },
  {
    id: 'qn-003',
    slug: 'quinua-negra-collana',
    name: 'Quinua Negra Collana',
    shortName: 'Quinua Negra',
    variety: 'negra',
    category: 'grano',
    tagline: 'Distintiva, para explorar',
    description: 'Una opción distintiva para explorar nuevas preparaciones.',
    longDescription:
      'De grano pequeño y color intenso, la quinua negra aporta un contraste visual inmediato y una textura crujiente que se mantiene. Es la variedad favorita de cocinas de autor y de quienes quieren llevar la quinua a preparaciones menos convencionales.',
    price: 29.9,
    currency: 'PEN',
    weightGrams: 500,
    presentation: 'Bolsa resellable de 500 g',
    image: {
      base: 'assets/img/pack-negra',
      alt: 'Envase azul de Quinua Negra Collana QUI9 junto a un cuenco con granos negros',
      ratio: 1,
    },
    gallery: [
      { base: 'assets/img/pack-negra', alt: 'Envase de Quinua Negra Collana QUI9', ratio: 1 },
      {
        base: 'assets/img/recipe-bowl',
        alt: 'Bowl de quinua con verduras asadas',
        ratio: 4 / 3,
      },
      {
        base: 'assets/img/seeds-macro',
        alt: 'Macro de granos de quinua sobre fondo azul profundo',
        ratio: 16 / 9,
      },
    ],
    grainColor: '#241c1a',
    features: [
      'Grano pequeño y textura marcada',
      'Contraste visual en el plato',
      'Selección por color y calibre',
      'Envase resellable con barrera de luz',
    ],
    attributes: [
      { label: 'Variedad', value: 'Negra' },
      { label: 'Presentación', value: 'Bolsa resellable' },
      { label: 'Peso neto', value: '500 g' },
      { label: 'Origen', value: 'Andes del Perú' },
    ],
    nutrition: nutritionTemplate(),
    available: true,
    featured: true,
  },
  {
    id: 'qn-004',
    slug: 'tricolor-andina',
    name: 'Selección Tricolor Andina',
    shortName: 'Tricolor',
    variety: 'tricolor',
    category: 'pack',
    tagline: 'Las tres variedades, una sola mesa',
    description: 'Blanca, roja y negra en una mezcla equilibrada de las tres selecciones.',
    longDescription:
      'Una mezcla pensada para descubrir las tres variedades en un mismo plato: la suavidad de la blanca, el cuerpo de la roja y el contraste de la negra. La proporción se ajusta para que las tres alcancen su punto en el mismo tiempo de cocción.',
    price: 32.9,
    currency: 'PEN',
    weightGrams: 750,
    presentation: 'Bolsa resellable de 750 g',
    image: {
      base: 'assets/img/pack-tricolor',
      alt: 'Envase azul de Selección Tricolor Andina QUI9 junto a tres cuencos con las variedades',
      ratio: 1,
    },
    gallery: [
      {
        base: 'assets/img/pack-tricolor',
        alt: 'Envase de Selección Tricolor Andina QUI9',
        ratio: 1,
      },
      {
        base: 'assets/img/recipe-traditional',
        alt: 'Preparación tradicional andina con quinua',
        ratio: 4 / 3,
      },
      {
        base: 'assets/img/andes-dawn',
        alt: 'Amanecer sobre campos de quinua en los Andes',
        ratio: 16 / 9,
      },
    ],
    grainColor: '#b98a5a',
    features: [
      'Tres variedades en una mezcla',
      'Cocción homogénea',
      'Formato familiar de 750 g',
      'Envase resellable con barrera de luz',
    ],
    attributes: [
      { label: 'Variedad', value: 'Blanca · Roja · Negra' },
      { label: 'Presentación', value: 'Bolsa resellable' },
      { label: 'Peso neto', value: '750 g' },
      { label: 'Origen', value: 'Andes del Perú' },
    ],
    nutrition: nutritionTemplate(),
    available: true,
    featured: false,
  },
];

/** Umbral mock de envío gratuito y coste base de envío (soles). */
export const SHIPPING_CONFIG = {
  freeFrom: 120,
  cost: 12,
};
