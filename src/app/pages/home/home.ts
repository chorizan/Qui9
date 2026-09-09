import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { UiService } from '../../core/services/ui.service';
import { CatalogSection } from './sections/catalog/catalog';
import { CtaSection } from './sections/cta/cta';
import { ExperienceSection } from './sections/experience/experience';
import { HeroSection } from './sections/hero/hero';
import { IntroSection } from './sections/intro/intro';
import { JourneySection } from './sections/journey/journey';
import { NutritionSection } from './sections/nutrition/nutrition';
import { OriginSection } from './sections/origin/origin';
import { RecipesSection } from './sections/recipes/recipes';
import { SocialSection } from './sections/social/social';
import { StorySection } from './sections/story/story';
import { SustainabilitySection } from './sections/sustainability/sustainability';
import { TestimonialsSection } from './sections/testimonials/testimonials';

/**
 * Home: el recorrido completo de la marca.
 *
 * Andes → tierra → semilla → cultivo → cosecha → selección → producto →
 * consumo → compra. Cada sección es un componente independiente para poder
 * reordenar la narrativa sin tocar el resto.
 */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroSection,
    IntroSection,
    OriginSection,
    StorySection,
    ExperienceSection,
    CatalogSection,
    NutritionSection,
    JourneySection,
    RecipesSection,
    SustainabilitySection,
    TestimonialsSection,
    SocialSection,
    CtaSection,
  ],
  template: `
    <app-hero />
    <app-intro-section />
    <app-origin-section />
    <app-story-section />
    <app-experience-section />
    <app-catalog-section />
    <app-nutrition-section />
    <app-journey-section />
    <app-recipes-section />
    <app-sustainability-section />
    <app-testimonials-section />
    <app-social-section />
    <app-cta-section />
  `,
})
export class HomePage {
  private readonly seo = inject(SeoService);
  private readonly products = inject(ProductService);

  constructor() {
    inject(UiService).setHeaderTheme('dark');

    this.seo.apply({
      title: 'QUI9 — Quinua Peruana Premium',
      description:
        'Descubre nuestra quinua peruana, seleccionada desde los Andes y llevada hasta tu mesa.',
      path: '/',
    });
    this.seo.setCatalogSchema(this.products.products());
  }
}
