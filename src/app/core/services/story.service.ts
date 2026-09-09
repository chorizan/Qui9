import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  JOURNEY_STEPS,
  RECIPES,
  SOCIAL_POSTS,
  STORY_CHAPTERS,
  SUSTAINABILITY_PILLARS,
  TESTIMONIALS,
} from '../data/content.data';
import {
  JourneyStep,
  Recipe,
  SocialPost,
  StoryChapter,
  SustainabilityPillar,
  Testimonial,
} from '../models';

/**
 * Contenido editorial: historia, recorrido, recetas, testimonios y social.
 * Preparado para reemplazarse por un CMS headless sin tocar los componentes.
 */
@Injectable({ providedIn: 'root' })
export class StoryService {
  chapters(): StoryChapter[] {
    return STORY_CHAPTERS;
  }

  journey(): JourneyStep[] {
    return JOURNEY_STEPS;
  }

  recipes(): Recipe[] {
    return RECIPES;
  }

  recipeBySlug(slug: string): Recipe | undefined {
    return RECIPES.find((r) => r.slug === slug);
  }

  testimonials(): Testimonial[] {
    return TESTIMONIALS;
  }

  sustainability(): SustainabilityPillar[] {
    return SUSTAINABILITY_PILLARS;
  }

  social(): SocialPost[] {
    return SOCIAL_POSTS;
  }

  /** GET /api/content/chapters — versión asíncrona para el futuro CMS. */
  chapters$(): Observable<StoryChapter[]> {
    return of(STORY_CHAPTERS);
  }
}
