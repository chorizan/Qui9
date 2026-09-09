import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CursorTargetDirective } from '../../../core/directives';
import { ImageAsset } from '../../../core/models';
import { DeviceService } from '../../../core/services/device.service';
import type { ProductScene } from '../../../three/product-scene';
import { ImgComponent } from '../img/img';

/**
 * Visor 3D del producto.
 *
 * Rotación 360°, zoom, vistas predefinidas y giro automático. La escena y
 * Three.js se cargan de forma diferida y sólo cuando el visor está a punto
 * de entrar en pantalla; si no hay WebGL, se muestra una fotografía premium
 * del producto en su lugar.
 */
@Component({
  selector: 'app-product-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImgComponent, CursorTargetDirective],
  templateUrl: './product-viewer.html',
  styleUrl: './product-viewer.scss',
})
export class ProductViewerComponent {
  private readonly device = inject(DeviceService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  /** Modelo GLB opcional; si no existe se usa el envase procedimental. */
  readonly modelUrl = input<string | undefined>('assets/3d/quinoa.glb');
  readonly grainColor = input('#f5f0e6');
  /** Imagen mostrada cuando no hay WebGL. */
  readonly fallbackImage = input.required<ImageAsset>();
  readonly autoRotate = input(true);
  readonly showControls = input(true);
  readonly compact = input(false);
  /** Tono del fondo sobre el que se monta el visor. */
  readonly theme = input<'dark' | 'light'>('dark');

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly rotating = signal(true);

  /** El 3D sólo se intenta si el dispositivo lo soporta. */
  protected readonly canRender = computed(() => this.device.webglSupported() && !this.failed());

  private scene?: ProductScene;

  constructor() {
    afterNextRender(() => this.observe());

    // Al cambiar de variedad, los granos de la escena adoptan su color.
    effect(() => this.scene?.setGrainColor(this.grainColor()));

    this.destroyRef.onDestroy(() => this.scene?.dispose());
  }

  /** Espera a que el visor esté cerca del viewport antes de cargar Three.js. */
  private observe(): void {
    const stage = this.stage()?.nativeElement;
    if (!stage || !this.canRender()) {
      this.loading.set(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        void this.boot();
      },
      { rootMargin: '300px' },
    );

    observer.observe(stage);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private async boot(): Promise<void> {
    const stage = this.stage()?.nativeElement;
    const canvas = this.canvas()?.nativeElement;
    if (!stage || !canvas) return;

    try {
      const { ProductScene } = await import('../../../three/product-scene');

      this.scene = new ProductScene({
        canvas,
        container: stage,
        pixelRatioCap: this.device.pixelRatioCap(),
        grainColor: this.grainColor(),
        grainCount: this.device.tier() === 'high' ? 260 : 90,
        modelUrl: this.modelUrl(),
        autoRotate: this.autoRotate(),
        reducedMotion: this.device.reducedMotion(),
        antialias: this.device.tier() !== 'low',
      });

      await this.scene.start();
      this.rotating.set(this.autoRotate() && !this.device.reducedMotion());
      this.loading.set(false);
    } catch {
      // Cualquier fallo del contexto WebGL cae en la imagen de respaldo.
      this.failed.set(true);
      this.loading.set(false);
    }
  }

  protected toggleRotation(): void {
    if (!this.scene) return;
    this.rotating.set(this.scene.toggleAutoRotate());
  }

  protected zoom(factor: number): void {
    this.scene?.zoomBy(factor);
  }

  protected reset(): void {
    this.scene?.resetView();
    this.rotating.set(this.autoRotate());
  }

  protected view(view: 'front' | 'side' | 'top'): void {
    this.scene?.setView(view);
  }
}
