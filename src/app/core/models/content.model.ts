import { ImageAsset } from './image.model';

/** Capítulo de la sección "Nuestra historia". */
export interface StoryChapter {
  /** Numeral mostrado en la timeline: "01", "02"… */
  index: string;
  title: string;
  subtitle: string;
  text: string;
  image?: ImageAsset;
}

/** Etapa del recorrido "De los Andes a tu mesa". */
export interface JourneyStep {
  id: string;
  label: string;
  caption: string;
  /** Identificador del icono SVG dibujado por `JourneyPathComponent`. */
  icon: 'mountain' | 'sprout' | 'harvest' | 'select' | 'package' | 'home';
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Tiempo de preparación aproximado. */
  time: string;
  difficulty: 'Fácil' | 'Media';
  serves: string;
  variety: string;
  image: ImageAsset;
  tags: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface SustainabilityPillar {
  id: string;
  title: string;
  text: string;
}

export interface SocialPost {
  id: string;
  image: ImageAsset;
  caption: string;
  url: string;
}
