import * as THREE from 'three';
import { gsap } from '../core/animations/gsap.config';
import { applyStudioLighting } from './lighting';
import { loadColorTexture, loadGltfModel } from './model-loader';
import { GrainField, createGrainField, createPouch } from './quinoa-object';
import { SceneBase, SceneOptions } from './scene-base';

export interface HeroSceneOptions extends SceneOptions {
  /** Número de granos flotantes (0 en dispositivos de gama baja). */
  grainCount: number;
  reducedMotion: boolean;
  /** Modelo real opcional; si falla se usa el envase procedimental. */
  modelUrl?: string;
}

/**
 * Escena del hero: el envase QUI9 suspendido en una nube de granos.
 *
 * Reacciona al puntero (rotación sutil), al scroll (escala, giro y
 * desplazamiento) y entra con una animación cinematográfica en tres tiempos:
 * partículas → semillas → producto.
 */
export class HeroScene extends SceneBase {
  private readonly product = new THREE.Group();
  private grains?: GrainField;
  private disposeLighting?: () => void;

  /** Puntero normalizado (-1 … 1) y su valor suavizado. */
  private readonly pointer = new THREE.Vector2();
  private readonly smoothPointer = new THREE.Vector2();

  private scrollProgress = 0;
  private smoothScroll = 0;
  private grainSpread = 1;
  private introDone = false;
  /** Escala de referencia según el formato del contenedor. */
  private baseScale = 1;

  constructor(private readonly heroOptions: HeroSceneOptions) {
    super(heroOptions);
    this.camera.position.set(0, 0, 5.4);
  }

  protected async build(): Promise<void> {
    this.disposeLighting = applyStudioLighting(this.scene, this.renderer);

    // Granos primero: son lo que aparece antes en la animación de entrada.
    if (this.heroOptions.grainCount > 0) {
      this.grains = createGrainField({
        count: this.heroOptions.grainCount,
        radius: 3.6,
        height: 5,
      });
      this.scene.add(this.grains.mesh);
    }

    const external = this.heroOptions.modelUrl
      ? await loadGltfModel(this.heroOptions.modelUrl, 2.1)
      : null;

    if (external) {
      this.product.add(external);
    } else {
      const logo = await loadColorTexture('assets/brand/qui9-mark.png');
      this.product.add(createPouch({ logoTexture: logo }));
    }

    this.product.rotation.y = -0.42;
    this.scene.add(this.product);
    this.layout();

    if (this.heroOptions.reducedMotion) {
      // Sin animación de entrada: el producto ya está colocado.
      this.introDone = true;
      this.product.scale.setScalar(this.baseScale);
      return;
    }

    this.prepareIntro();
  }

  /** Estado inicial de la animación de entrada. */
  private prepareIntro(): void {
    this.grainSpread = 0.25;
    this.product.scale.setScalar(this.baseScale * 0.72);
    this.product.position.y = -0.6;

    this.forEachMaterial((material) => {
      material.transparent = true;
      material.opacity = 0;
    });

    if (this.grains) {
      const material = this.grains.mesh.material as THREE.MeshStandardMaterial;
      material.transparent = true;
      material.opacity = 0;
    }
  }

  /**
   * Línea de tiempo de entrada. El componente la encadena con la aparición
   * del texto del hero para que todo forme una sola secuencia.
   */
  playIntro(): gsap.core.Timeline {
    const timeline = gsap.timeline();

    if (this.heroOptions.reducedMotion) {
      this.introDone = true;
      return timeline;
    }

    // 1 · Las semillas se dispersan y se encienden.
    if (this.grains) {
      const material = this.grains.mesh.material as THREE.MeshStandardMaterial;
      timeline
        .to(this, { grainSpread: 1, duration: 2.6, ease: 'expo.out' }, 0)
        .to(material, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0);
    }

    // 2 · El producto emerge del centro.
    const target = this.baseScale;
    timeline
      .to(this.product.scale, { x: target, y: target, z: target, duration: 2, ease: 'expo.out' }, 0.45)
      .to(this.product.position, { y: 0, duration: 2, ease: 'expo.out' }, 0.45)
      .to(this.product.rotation, { y: 0.32, duration: 2.4, ease: 'expo.out' }, 0.45);

    const fade = { value: 0 };
    timeline.to(
      fade,
      {
        value: 1,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => this.forEachMaterial((m) => (m.opacity = fade.value)),
        onComplete: () => {
          // Volvemos a materiales opacos (mejor orden de dibujado), salvo
          // los que necesitan alfa de forma permanente, como el logotipo.
          this.forEachMaterial((m) => {
            if (!m.userData['keepTransparent']) m.transparent = false;
          });
          this.introDone = true;
        },
      },
      0.6,
    );

    return timeline;
  }

  /** Puntero normalizado entre -1 y 1. */
  setPointer(x: number, y: number): void {
    this.pointer.set(x, y);
  }

  /** Progreso de scroll del hero, de 0 (arriba) a 1 (fuera de pantalla). */
  setScrollProgress(progress: number): void {
    this.scrollProgress = progress;
  }

  protected update(delta: number, elapsed: number): void {
    const damping = 1 - Math.pow(0.001, delta);

    this.smoothPointer.lerp(this.pointer, damping);
    this.smoothScroll += (this.scrollProgress - this.smoothScroll) * damping;

    this.grains?.update(elapsed, this.grainSpread);

    if (this.grains) {
      this.grains.mesh.rotation.y = elapsed * 0.02 + this.smoothPointer.x * 0.12;
      this.grains.mesh.position.y = this.smoothScroll * 1.6;
    }

    if (!this.introDone) return;

    // Rotación base + reacción al puntero + giro adicional con el scroll.
    this.product.rotation.y =
      0.32 + this.smoothPointer.x * 0.45 + this.smoothScroll * Math.PI * 0.5;
    this.product.rotation.x = -this.smoothPointer.y * 0.22 + this.smoothScroll * 0.18;
    this.product.rotation.z = this.smoothPointer.x * 0.05;

    // Flotación permanente: el producto nunca se queda quieto del todo.
    const idle = this.heroOptions.reducedMotion ? 0 : 1;
    this.product.position.y =
      Math.sin(elapsed * 0.55) * 0.06 * idle - this.smoothScroll * 1.1;
    this.product.position.x = this.smoothPointer.x * 0.12;

    this.product.scale.setScalar(this.baseScale * (1 + this.smoothScroll * 0.22));

    // La cámara acompaña muy levemente al puntero.
    this.camera.position.x += (this.smoothPointer.x * 0.35 - this.camera.position.x) * damping;
    this.camera.position.y += (this.smoothPointer.y * 0.25 - this.camera.position.y) * damping;
    this.camera.lookAt(0, 0, 0);
  }

  protected override onResize(width: number, height: number): void {
    this.layout(width / Math.max(height, 1));
  }

  /** Adapta encuadre y distancia de cámara al formato del contenedor. */
  private layout(aspect = this.camera.aspect): void {
    const portrait = aspect < 0.9;
    this.camera.position.z = portrait ? 6.6 : 5.4;
    this.baseScale = portrait ? 0.86 : 1;

    // Durante la intro la escala la controla la línea de tiempo.
    if (this.introDone) this.product.scale.setScalar(this.baseScale);
  }

  private forEachMaterial(callback: (material: THREE.Material) => void): void {
    this.product.traverse((object) => {
      const mesh = object as THREE.Mesh;
      const material = mesh.material;
      if (!material) return;
      Array.isArray(material) ? material.forEach(callback) : callback(material);
    });
  }

  override dispose(): void {
    this.disposeLighting?.();
    super.dispose();
  }
}
