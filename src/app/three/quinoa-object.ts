import * as THREE from 'three';

/**
 * Construcción procedimental del producto QUI9 y de los granos de quinua.
 *
 * Todo se genera con geometría: no depende de descargas y sirve como
 * fallback cuando no hay un GLB real en `/assets/3d/`.
 */

export const BRAND_BLUE = 0x0d056f;
export const BRAND_GOLD = 0xc9a961;
export const BRAND_IVORY = 0xf5f0e6;

/**
 * Silueta 2D de una bolsa doypack: base ancha, laterales ligeramente
 * abombados y boca más estrecha. Es lo que la distingue de una caja.
 */
function pouchShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const base = width / 2;
  const mouth = (width * 0.92) / 2;
  const h = height / 2;
  const bulge = width * 0.035;

  shape.moveTo(-base + radius, -h);
  shape.lineTo(base - radius, -h);
  shape.quadraticCurveTo(base, -h, base, -h + radius);
  shape.quadraticCurveTo(base + bulge, 0, mouth, h - radius);
  shape.quadraticCurveTo(mouth, h, mouth - radius, h);
  shape.lineTo(-mouth + radius, h);
  shape.quadraticCurveTo(-mouth, h, -mouth, h - radius);
  shape.quadraticCurveTo(-base - bulge, 0, -base, -h + radius);
  shape.quadraticCurveTo(-base, -h, -base + radius, -h);

  return shape;
}

export interface PouchOptions {
  width?: number;
  height?: number;
  depth?: number;
  /** Textura del logotipo aplicada al frente. */
  logoTexture?: THREE.Texture | null;
}

/**
 * Envase QUI9: cuerpo azul mate, franja dorada inferior, cierre superior y
 * logotipo blanco al frente. Devuelve un grupo centrado en el origen.
 */
export function createPouch(options: PouchOptions = {}): THREE.Group {
  const { width = 1.24, height = 1.86, depth = 0.3, logoTexture = null } = options;

  const group = new THREE.Group();
  group.name = 'qui9-pouch';

  const geometry = new THREE.ExtrudeGeometry(pouchShape(width, height, 0.14), {
    depth: depth * 0.7,
    bevelEnabled: true,
    bevelThickness: depth * 0.15,
    bevelSize: 0.045,
    bevelSegments: 6,
    curveSegments: 24,
  });
  geometry.center();

  const body = new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      color: BRAND_BLUE,
      roughness: 0.62,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.6,
      sheen: 0.4,
      sheenColor: new THREE.Color(0x2418ab),
    }),
  );
  body.name = 'pouch-body';
  group.add(body);

  // Franja dorada inferior: el único destello metálico del envase.
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.985, height * 0.062, depth * 1.02),
    new THREE.MeshStandardMaterial({
      color: BRAND_GOLD,
      roughness: 0.22,
      metalness: 0.92,
    }),
  );
  band.position.y = -height / 2 + height * 0.048;
  group.add(band);

  // Cierre superior (zip).
  const zip = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.9, height * 0.018, depth * 1.02),
    new THREE.MeshStandardMaterial({ color: 0x0a0450, roughness: 0.9 }),
  );
  zip.position.y = height / 2 - height * 0.11;
  group.add(zip);

  if (logoTexture) {
    const image = logoTexture.image as { width?: number; height?: number } | undefined;
    const aspect = image?.width && image?.height ? image.width / image.height : 1.15;
    const logoWidth = width * 0.62;

    const logoMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      roughness: 0.5,
      metalness: 0,
      depthWrite: false,
    });
    // El logotipo es blanco con canal alfa: su transparencia es permanente
    // y no debe desactivarse al terminar la animación de entrada.
    logoMaterial.userData['keepTransparent'] = true;

    const logo = new THREE.Mesh(
      new THREE.PlaneGeometry(logoWidth, logoWidth / aspect),
      logoMaterial,
    );
    logo.position.set(0, height * 0.06, depth / 2 + 0.012);
    logo.name = 'pouch-logo';
    group.add(logo);
  }

  return group;
}

export interface GrainFieldOptions {
  count: number;
  /** Radio de la nube de granos. */
  radius?: number;
  height?: number;
  color?: THREE.ColorRepresentation;
  seed?: number;
}

export interface GrainField {
  mesh: THREE.InstancedMesh;
  /** Actualiza la posición de cada grano. */
  update(elapsed: number, spread?: number): void;
}

/**
 * Nube de granos de quinua flotantes.
 *
 * Un `InstancedMesh` para dibujar cientos de semillas en una sola llamada.
 * Cada grano tiene su propia órbita, deriva vertical y rotación.
 */
export function createGrainField(options: GrainFieldOptions): GrainField {
  const { count, radius = 3.4, height = 4.2, color = BRAND_IVORY } = options;

  // Semilla achatada: la forma reconocible del grano de quinua.
  // El tamaño es deliberadamente pequeño: el grano acompaña, no compite
  // con el producto ni con el texto.
  const geometry = new THREE.IcosahedronGeometry(0.006, 0);
  geometry.scale(1, 0.6, 1);

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.08,
    flatShading: true,
    transparent: true,
    opacity: 0.9,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, Math.max(count, 1));
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;

  // Variación de color grano a grano (marfil → arena → dorado muy suave).
  const palette = [
    new THREE.Color(0xf5f0e6),
    new THREE.Color(0xe7dfcd),
    new THREE.Color(0xd8ccb4),
    new THREE.Color(0xc9a961),
  ];
  const colors = new Float32Array(count * 3);

  interface Seed {
    angle: number;
    radius: number;
    y: number;
    speed: number;
    bob: number;
    scale: number;
    spin: THREE.Vector3;
  }

  const seeds: Seed[] = [];

  for (let i = 0; i < count; i++) {
    const seed: Seed = {
      angle: Math.random() * Math.PI * 2,
      radius: 0.9 + Math.pow(Math.random(), 0.7) * radius,
      y: (Math.random() - 0.5) * height,
      speed: 0.04 + Math.random() * 0.14,
      bob: Math.random() * Math.PI * 2,
      scale: 0.7 + Math.random() * 1.2,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.6),
    };
    seeds.push(seed);

    const tone = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = tone.r;
    colors[i * 3 + 1] = tone.g;
    colors[i * 3 + 2] = tone.b;
  }

  mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);

  const dummy = new THREE.Object3D();

  return {
    mesh,
    update(elapsed: number, spread = 1): void {
      for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const angle = seed.angle + elapsed * seed.speed;
        const r = seed.radius * spread;

        dummy.position.set(
          Math.cos(angle) * r,
          seed.y + Math.sin(elapsed * 0.5 + seed.bob) * 0.22,
          Math.sin(angle) * r,
        );
        dummy.rotation.set(
          elapsed * seed.spin.x,
          elapsed * seed.spin.y,
          elapsed * seed.spin.z,
        );
        dummy.scale.setScalar(seed.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/** Cuenco de cerámica con granos, alternativa al envase en el visor 3D. */
export function createBowl(grainColor: THREE.ColorRepresentation = BRAND_IVORY): THREE.Group {
  const group = new THREE.Group();

  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    profile.push(new THREE.Vector2(0.08 + Math.sin(t * Math.PI * 0.5) * 0.92, t * 0.52));
  }

  const bowl = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xe7dfcd,
      roughness: 0.75,
      metalness: 0,
      clearcoat: 0.2,
      side: THREE.DoubleSide,
    }),
  );
  group.add(bowl);

  // Superficie de grano dentro del cuenco.
  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(0.86, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: grainColor,
      roughness: 0.9,
      flatShading: true,
    }),
  );
  surface.scale.y = 0.3;
  surface.position.y = 0.4;
  group.add(surface);

  return group;
}
