import {
  JourneyStep,
  Recipe,
  SocialPost,
  StoryChapter,
  SustainabilityPillar,
  Testimonial,
} from '../models';

/**
 * CONTENIDO EDITORIAL MOCK.
 *
 * Todo lo que hay aquí está redactado para ser sustituido por la información
 * real de la marca. No se incluyen datos históricos, nutricionales ni
 * ambientales que no puedan verificarse.
 */

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    index: '01',
    title: 'El origen',
    subtitle: 'La conexión con los Andes',
    text: 'Trabajamos donde la quinua se cultiva desde hace generaciones: en la altura, con el clima y la tierra que le dan carácter. Esa relación con el territorio es el punto de partida de todo lo que hacemos.',
    image: {
      base: 'assets/img/andes-dawn',
      alt: 'Amanecer sobre la cordillera andina con campos en terraza',
      ratio: 16 / 9,
    },
  },
  {
    index: '02',
    title: 'La selección',
    subtitle: 'Selección cuidadosa del grano',
    text: 'Cada lote se revisa por variedad, color y calibre. Sólo el grano que cumple nuestros criterios continúa el camino hacia el envase.',
    image: {
      base: 'assets/img/farmer-hands',
      alt: 'Manos de agricultor sosteniendo granos de quinua recién seleccionados',
      ratio: 4 / 3,
    },
  },
  {
    index: '03',
    title: 'La calidad',
    subtitle: 'Procesos orientados a preservar sus propiedades',
    text: 'El lavado, el secado y el envasado se controlan para cuidar la integridad del grano y su sabor. Menos intervención, más producto.',
    image: {
      base: 'assets/img/seeds-macro',
      alt: 'Detalle macro de granos de quinua sobre fondo azul profundo',
      ratio: 16 / 9,
    },
  },
  {
    index: '04',
    title: 'La evolución',
    subtitle: 'Una tradición adaptada al consumidor moderno',
    text: 'Formatos, envases y recetas pensados para cocinas actuales, sin alterar lo que hace especial a la quinua.',
    image: {
      base: 'assets/img/recipe-bowl',
      alt: 'Bowl contemporáneo de quinua con verduras asadas',
      ratio: 4 / 3,
    },
  },
  {
    index: '05',
    title: 'El futuro',
    subtitle: 'Llevar la quinua peruana a nuevas mesas',
    text: 'Queremos que la quinua peruana se reconozca por su origen y su calidad allí donde llegue. Ese es el trabajo que continúa.',
    image: {
      base: 'assets/img/sustainability',
      alt: 'Agricultor caminando junto a campos de quinua al atardecer',
      ratio: 16 / 9,
    },
  },
];

export const JOURNEY_STEPS: JourneyStep[] = [
  { id: 'andes', label: 'Andes', caption: 'Altura, clima y tierra', icon: 'mountain' },
  { id: 'cultivo', label: 'Cultivo', caption: 'Siembra y crecimiento', icon: 'sprout' },
  { id: 'cosecha', label: 'Cosecha', caption: 'Recolección de la panoja', icon: 'harvest' },
  { id: 'seleccion', label: 'Selección', caption: 'Color, calibre y limpieza', icon: 'select' },
  { id: 'producto', label: 'Producto', caption: 'Envasado y trazabilidad', icon: 'package' },
  { id: 'mesa', label: 'Tu mesa', caption: 'Listo para cocinar', icon: 'home' },
];

export const RECIPES: Recipe[] = [
  {
    id: 'rc-01',
    slug: 'bowl-de-quinua',
    title: 'Bowl de quinua',
    description:
      'Quinua blanca con verduras asadas, palta y semillas tostadas. Un plato completo en un solo cuenco.',
    time: '30 min',
    difficulty: 'Fácil',
    serves: '2 porciones',
    variety: 'Quinua Blanca',
    image: {
      base: 'assets/img/recipe-bowl',
      alt: 'Bowl de quinua con verduras asadas, palta y semillas',
      ratio: 4 / 3,
    },
    tags: ['Almuerzo', 'Vegetariano'],
  },
  {
    id: 'rc-02',
    slug: 'ensalada-de-quinua',
    title: 'Ensalada de quinua',
    description:
      'Quinua roja fría con tomate, pepino, hierbas frescas y limón. Ligera y con textura firme.',
    time: '20 min',
    difficulty: 'Fácil',
    serves: '4 porciones',
    variety: 'Quinua Roja',
    image: {
      base: 'assets/img/recipe-salad',
      alt: 'Ensalada fresca de quinua roja con tomate, pepino y hierbas',
      ratio: 4 / 3,
    },
    tags: ['Entrada', 'Fresco'],
  },
  {
    id: 'rc-03',
    slug: 'desayuno-con-quinua',
    title: 'Desayuno con quinua',
    description:
      'Quinua cocida en leche con frutas, semillas y un hilo de miel. Para empezar el día con calma.',
    time: '15 min',
    difficulty: 'Fácil',
    serves: '2 porciones',
    variety: 'Quinua Blanca',
    image: {
      base: 'assets/img/recipe-breakfast',
      alt: 'Desayuno de quinua con frutos rojos, plátano y semillas',
      ratio: 4 / 3,
    },
    tags: ['Desayuno', 'Dulce'],
  },
  {
    id: 'rc-04',
    slug: 'preparacion-tradicional',
    title: 'Preparación tradicional',
    description:
      'Quinua en olla de barro con verduras de temporada y hierbas. La receta de siempre, sin apuros.',
    time: '45 min',
    difficulty: 'Media',
    serves: '4 porciones',
    variety: 'Tricolor',
    image: {
      base: 'assets/img/recipe-traditional',
      alt: 'Olla de barro con preparación tradicional andina de quinua',
      ratio: 4 / 3,
    },
    tags: ['Tradicional', 'Caliente'],
  },
];

/**
 * TESTIMONIOS FICTICIOS — marcador de posición.
 * Reemplazar por reseñas reales y verificables antes de publicar.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-01',
    quote: 'Una quinua excelente y muy fácil de preparar. El grano queda suelto siempre.',
    author: 'Camila R.',
    location: 'Lima',
    rating: 5,
  },
  {
    id: 'tm-02',
    quote: 'La roja tiene una textura que se nota en las ensaladas. Ya es fija en casa.',
    author: 'Diego M.',
    location: 'Arequipa',
    rating: 5,
  },
  {
    id: 'tm-03',
    quote: 'El envase mantiene el grano en buen estado y se abre y cierra sin problema.',
    author: 'Ana L.',
    location: 'Trujillo',
    rating: 4,
  },
  {
    id: 'tm-04',
    quote: 'Pedí la selección tricolor por curiosidad y terminó siendo mi favorita.',
    author: 'Sofía V.',
    location: 'Cusco',
    rating: 5,
  },
];

export const SUSTAINABILITY_PILLARS: SustainabilityPillar[] = [
  {
    id: 'sp-01',
    title: 'Agricultura responsable',
    text: 'Trabajamos con productores andinos y documentamos las prácticas de cada campaña. La información verificada se publicará en esta sección.',
  },
  {
    id: 'sp-02',
    title: 'Relación con productores',
    text: 'Acuerdos claros de compra y seguimiento de cada lote desde el campo. Los detalles del programa se detallarán aquí.',
  },
  {
    id: 'sp-03',
    title: 'Aprovechamiento del grano',
    text: 'Buscamos reducir la pérdida de producto en selección y envasado. Publicaremos los indicadores cuando estén auditados.',
  },
  {
    id: 'sp-04',
    title: 'Trazabilidad',
    text: 'Cada envase corresponde a un lote identificable. El sistema de consulta de lote está en desarrollo.',
  },
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'ig-1',
    image: { base: 'assets/img/ig-1', alt: 'Granos de quinua sobre fondo azul profundo', ratio: 1 },
    caption: 'El grano, de cerca',
    url: '#',
  },
  {
    id: 'ig-2',
    image: { base: 'assets/img/ig-2', alt: 'Bowl de quinua con verduras', ratio: 1 },
    caption: 'Bowl de martes',
    url: '#',
  },
  {
    id: 'ig-3',
    image: { base: 'assets/img/ig-3', alt: 'Panojas de quinua en el campo', ratio: 1 },
    caption: 'Panojas en punto',
    url: '#',
  },
  {
    id: 'ig-4',
    image: { base: 'assets/img/ig-4', alt: 'Manos sosteniendo granos de quinua', ratio: 1 },
    caption: 'Selección a mano',
    url: '#',
  },
  {
    id: 'ig-5',
    image: { base: 'assets/img/ig-5', alt: 'Amanecer en los Andes', ratio: 1 },
    caption: 'Amanece arriba',
    url: '#',
  },
  {
    id: 'ig-6',
    image: { base: 'assets/img/ig-6', alt: 'Campos de quinua al atardecer', ratio: 1 },
    caption: 'Fin de campaña',
    url: '#',
  },
  {
    id: 'ig-7',
    image: { base: 'assets/img/ig-7', alt: 'Ensalada de quinua roja', ratio: 1 },
    caption: 'Ensalada de verano',
    url: '#',
  },
  {
    id: 'ig-8',
    image: { base: 'assets/img/ig-8', alt: 'Preparación tradicional en olla de barro', ratio: 1 },
    caption: 'Olla de barro',
    url: '#',
  },
];
