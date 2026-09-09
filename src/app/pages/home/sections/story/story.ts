import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { ScrollTrigger, gsap } from '../../../../core/animations/gsap.config';
import { RevealDirective } from '../../../../core/directives';
import { DeviceService } from '../../../../core/services/device.service';
import { StoryService } from '../../../../core/services/story.service';
import { ImgComponent } from '../../../../shared/components/img/img';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';

/**
 * "Nuestra historia": línea de tiempo de cinco capítulos.
 *
 * Una línea vertical se dibuja al ritmo del scroll y cada capítulo aparece
 * al alcanzarla. En móvil la línea se mantiene, pero el contenido pasa a una
 * sola columna.
 */
@Component({
  selector: 'app-story-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ImgComponent, RevealDirective],
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class StorySection {
  private readonly story = inject(StoryService);
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  private readonly progress = viewChild<ElementRef<HTMLElement>>('progress');

  protected readonly chapters = this.story.chapters();

  constructor() {
    afterNextRender(() => this.animateLine());
  }

  /** La línea crece con el scroll y marca el avance por la historia. */
  private animateLine(): void {
    const track = this.track()?.nativeElement;
    const progress = this.progress()?.nativeElement;
    if (!track || !progress || !this.device.animationsEnabled()) return;

    const tween = gsap.fromTo(
      progress,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', transformOrigin: 'top center' },
    );

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top 65%',
      end: 'bottom 75%',
      scrub: 0.6,
      animation: tween,
    });

    this.destroyRef.onDestroy(() => {
      trigger.kill();
      tween.kill();
    });
  }
}
