import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { NutritionFact } from '../../../core/models';

/**
 * Gráfico nutricional minimalista.
 *
 * Las barras crecen al entrar en pantalla. Mientras la marca no disponga de
 * un análisis de laboratorio, cada métrica se muestra como "por confirmar"
 * con una barra punteada: informa del formato sin inventar cifras.
 */
@Component({
  selector: 'app-nutrition-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nutrition-chart.html',
  styleUrl: './nutrition-chart.scss',
})
export class NutritionChartComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly facts = input.required<NutritionFact[]>();
  /** Valor máximo de referencia para escalar las barras con dato real. */
  readonly scale = input(100);

  protected readonly shown = signal(false);

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          this.shown.set(true);
          observer.disconnect();
        },
        { threshold: 0.3 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Longitud de la barra: valor real si existe, marcador si aún no. */
  protected width(fact: NutritionFact): number {
    if (!this.shown()) return 0;
    if (fact.value === null) return fact.placeholderRatio * 100;
    return Math.min(100, (fact.value / this.scale()) * 100);
  }
}
