import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Iluminación de estudio: un entorno PBR generado en memoria (sin descargas)
 * más luces direccionales que definen el volumen del producto.
 *
 *   · key   → luz principal cálida desde la izquierda
 *   · rim   → contraluz dorado que recorta la silueta
 *   · fill  → relleno azul de marca en las sombras
 */
export function applyStudioLighting(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  intensity = 1,
): () => void {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.06);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.55 * intensity;

  const key = new THREE.DirectionalLight(0xfff4e0, 2.6 * intensity);
  key.position.set(-3.2, 3.4, 4.2);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xc9a961, 3.4 * intensity);
  rim.position.set(3.6, 1.4, -3.4);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0x3d2ccf, 1.8 * intensity);
  fill.position.set(2.2, -2.6, 2.4);
  scene.add(fill);

  const ambient = new THREE.AmbientLight(0x6f6aa8, 0.6 * intensity);
  scene.add(ambient);

  // Halo suave detrás del producto: sensación de luz volumétrica.
  const halo = new THREE.PointLight(0x5b3fe0, 6 * intensity, 12, 2);
  halo.position.set(0, 0.4, -2.2);
  scene.add(halo);

  return () => {
    environment.texture.dispose();
    pmrem.dispose();
  };
}
