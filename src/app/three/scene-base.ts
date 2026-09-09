import * as THREE from 'three';

export interface SceneOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  /** Tope de densidad de píxeles (2 en desktop, 1.5 en móvil). */
  pixelRatioCap?: number;
  antialias?: boolean;
  /** Campo de visión de la cámara. */
  fov?: number;
}

/**
 * Base común de todas las escenas Three.js del sitio.
 *
 * Se encarga de lo aburrido pero crítico: renderer, cámara, redimensionado,
 * bucle de animación, pausa cuando la escena no se ve (IntersectionObserver
 * + visibilidad de pestaña) y liberación completa de memoria GPU.
 */
export abstract class SceneBase {
  protected readonly renderer: THREE.WebGLRenderer;
  protected readonly scene = new THREE.Scene();
  protected readonly camera: THREE.PerspectiveCamera;
  protected readonly clock = new THREE.Clock();

  private frameId = 0;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private onVisibilityChange?: () => void;

  /** La escena está dentro del viewport. */
  protected inView = true;
  /** La pestaña está activa. */
  protected tabActive = true;
  protected disposed = false;

  constructor(protected readonly options: SceneOptions) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: options.canvas,
      alpha: true,
      antialias: options.antialias ?? true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.pixelRatioCap ?? 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const { clientWidth, clientHeight } = options.container;
    this.camera = new THREE.PerspectiveCamera(
      options.fov ?? 38,
      (clientWidth || 1) / (clientHeight || 1),
      0.1,
      100,
    );

    this.resize();
  }

  /** Construye el contenido concreto de la escena. */
  protected abstract build(): void | Promise<void>;

  /** Se llama en cada frame renderizado. */
  protected abstract update(delta: number, elapsed: number): void;

  async start(): Promise<void> {
    await this.build();
    this.observe();
    this.loop();
  }

  protected loop = (): void => {
    if (this.disposed) return;
    this.frameId = requestAnimationFrame(this.loop);

    // Fuera de pantalla o pestaña en segundo plano: no gastamos GPU.
    if (!this.inView || !this.tabActive) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.update(delta, this.clock.getElapsedTime());
    this.renderer.render(this.scene, this.camera);
  };

  protected resize(): void {
    const { container } = this.options;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.onResize(width, height);
  }

  /** Punto de extensión para adaptar la composición al formato. */
  protected onResize(_width: number, _height: number): void {}

  private observe(): void {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.options.container);

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.inView = entry.isIntersecting;
        // Evita un salto de animación al volver a entrar en pantalla.
        if (this.inView) this.clock.getDelta();
      },
      { rootMargin: '120px' },
    );
    this.intersectionObserver.observe(this.options.container);

    this.onVisibilityChange = () => {
      this.tabActive = document.visibilityState === 'visible';
      if (this.tabActive) this.clock.getDelta();
    };
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    if (this.onVisibilityChange) {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose?.();
      const material = mesh.material;
      if (Array.isArray(material)) {
        material.forEach((m) => this.disposeMaterial(m));
      } else if (material) {
        this.disposeMaterial(material);
      }
    });

    this.scene.clear();
    this.renderer.dispose();
  }

  private disposeMaterial(material: THREE.Material): void {
    for (const value of Object.values(material)) {
      if (value instanceof THREE.Texture) value.dispose();
    }
    material.dispose();
  }
}
