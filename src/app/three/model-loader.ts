import * as THREE from 'three';

/**
 * Carga de modelos GLTF/GLB con degradación limpia.
 *
 * El sitio funciona sin ningún modelo: si `/assets/3d/quinoa.glb` no existe
 * (o el servidor devuelve el index.html de la SPA), se usa el producto
 * procedimental. Basta con dejar el archivo en su sitio para que el visor
 * empiece a usarlo, sin tocar código.
 */

/** Comprueba que la URL devuelve realmente un binario antes de descargarlo. */
async function modelExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) return false;
    const type = response.headers.get('content-type') ?? '';
    return !type.includes('text/html');
  } catch {
    return false;
  }
}

/** Escala y centra el modelo para que quepa en una altura objetivo. */
export function normalizeModel(model: THREE.Object3D, targetHeight = 2): THREE.Object3D {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const scale = size.y > 0 ? targetHeight / size.y : 1;
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));

  return model;
}

/**
 * Devuelve la escena del GLB o `null` si no hay modelo disponible.
 * `GLTFLoader` se importa de forma diferida: no entra en el bundle si
 * nunca se usa un modelo real.
 */
export async function loadGltfModel(url: string, targetHeight = 2): Promise<THREE.Object3D | null> {
  if (!(await modelExists(url))) return null;

  try {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(url);
    return normalizeModel(gltf.scene, targetHeight);
  } catch {
    return null;
  }
}

/** Textura con el color y filtrado correctos para usarse como mapa de color. */
export function loadColorTexture(url: string): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        resolve(texture);
      },
      undefined,
      () => resolve(null),
    );
  });
}
