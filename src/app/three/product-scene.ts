import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { applyStudioLighting } from './lighting';
import { loadColorTexture, loadGltfModel } from './model-loader';
import { GrainField, createGrainField, createPouch } from './quinoa-object';
import { SceneBase, SceneOptions } from './scene-base';

export interface ProductSceneOptions extends SceneOptions {
  /** Modelo real; si no existe se genera el envase procedimental. */
  modelUrl?: string;
  /** Color del grano que acompaña al producto. */
  grainColor?: string;
  grainCount?: number;
  autoRotate?: boolean;
  reducedMotion?: boolean;
}

/**
 * Visor 3D interactivo de la sección "Mírala de cerca" y de la ficha de
 * producto: rotación 360°, zoom, inercia, giro automático opcional y soporte
 * táctil, todo sobre el mismo producto que aparece en el hero.
 */
export class ProductScene extends SceneBase {
  private readonly product = new THREE.Group();
  private controls?: OrbitControls;
  private grains?: GrainField;
  private disposeLighting?: () => void;
  private autoRotate: boolean;

  constructor(private readonly productOptions: ProductSceneOptions) {
    super(productOptions);
    this.autoRotate = productOptions.autoRotate ?? true;
    this.camera.position.set(0, 0.15, 4.6);
  }

  protected async build(): Promise<void> {
    this.disposeLighting = applyStudioLighting(this.scene, this.renderer, 1.05);

    const external = this.productOptions.modelUrl
      ? await loadGltfModel(this.productOptions.modelUrl, 2.1)
      : null;

    if (external) {
      this.product.add(external);
    } else {
      const logo = await loadColorTexture('assets/brand/qui9-mark.png');
      this.product.add(createPouch({ logoTexture: logo }));
    }

    this.scene.add(this.product);

    const grainCount = this.productOptions.grainCount ?? 0;
    if (grainCount > 0) {
      this.grains = createGrainField({
        count: grainCount,
        radius: 2.4,
        height: 3,
        color: this.productOptions.grainColor ?? '#f5f0e6',
      });
      this.scene.add(this.grains.mesh);
    }

    this.controls = new OrbitControls(this.camera, this.options.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.minDistance = 2.6;
    this.controls.maxDistance = 7;
    // Limitamos la vertical para que el producto nunca se vea "desde abajo".
    this.controls.minPolarAngle = Math.PI * 0.22;
    this.controls.maxPolarAngle = Math.PI * 0.78;
    this.controls.rotateSpeed = 0.7;
    this.controls.zoomSpeed = 0.6;
    this.controls.autoRotate = this.autoRotate && !this.productOptions.reducedMotion;
    this.controls.autoRotateSpeed = 0.9;

    // El giro automático se detiene en cuanto el usuario toma el control.
    this.controls.addEventListener('start', () => {
      if (this.controls) this.controls.autoRotate = false;
    });
  }

  protected update(_delta: number, elapsed: number): void {
    this.controls?.update();
    this.grains?.update(elapsed);
    if (this.grains) this.grains.mesh.rotation.y = elapsed * 0.05;
  }

  /** Coloca la cámara en una vista predefinida. */
  setView(view: 'front' | 'side' | 'top'): void {
    const positions: Record<typeof view, [number, number, number]> = {
      front: [0, 0.15, 4.6],
      side: [4.2, 0.4, 1.6],
      top: [0, 3.4, 3.2],
    };
    const [x, y, z] = positions[view];
    this.camera.position.set(x, y, z);
    this.controls?.target.set(0, 0, 0);
    this.controls?.update();
  }

  /** Tiñe los granos que rodean al producto (cambio de variedad). */
  setGrainColor(color: string): void {
    if (!this.grains) return;
    (this.grains.mesh.material as THREE.MeshStandardMaterial).color.set(color);
  }

  toggleAutoRotate(): boolean {
    if (!this.controls) return false;
    this.controls.autoRotate = !this.controls.autoRotate;
    return this.controls.autoRotate;
  }

  zoomBy(factor: number): void {
    const direction = this.camera.position.clone().normalize();
    const distance = THREE.MathUtils.clamp(this.camera.position.length() * factor, 2.6, 7);
    this.camera.position.copy(direction.multiplyScalar(distance));
    this.controls?.update();
  }

  resetView(): void {
    this.setView('front');
    if (this.controls) this.controls.autoRotate = this.autoRotate;
  }

  override dispose(): void {
    this.controls?.dispose();
    this.disposeLighting?.();
    super.dispose();
  }
}
