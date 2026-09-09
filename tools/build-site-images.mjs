/**
 * Procesa la fotografía del sitio:
 *   1. Estampa el logotipo QUI9 sobre los envases (mockups sin marca).
 *   2. Genera variantes responsive en WebP + fallback JPG.
 *   3. Recorta cuadrados para la retícula de Instagram.
 *
 *   node tools/build-site-images.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

/** Anchos disponibles por imagen; se vuelca a un manifiesto TypeScript. */
const manifest = {};

const SRC_DIR = process.env.QUI9_SRC_IMAGES ?? 'source-images';
const OUT = 'public/assets/img';
const MARK = 'public/assets/brand/qui9-mark.png';
const WIDTHS = [640, 1024, 1600];

await mkdir(OUT, { recursive: true });

/** Envases a los que se les estampa el logotipo (coordenadas en el lienzo 1024²). */
const PACKS = {
  'pack-blanca': { left: 318, top: 360, width: 236 },
  'pack-roja': { left: 292, top: 340, width: 246 },
  'pack-negra': { left: 288, top: 300, width: 246 },
  'pack-tricolor': { left: 322, top: 380, width: 216 },
};

const FILES = [
  'andes-dawn',
  'quinoa-field',
  'farmer-hands',
  'seeds-macro',
  'recipe-bowl',
  'recipe-salad',
  'recipe-breakfast',
  'recipe-traditional',
  'sustainability',
  ...Object.keys(PACKS),
];

/** Aplica el logotipo blanco sobre el frente del envase. */
async function brand(name, buffer) {
  const cfg = PACKS[name];
  if (!cfg) return buffer;

  const mark = await sharp(MARK)
    .resize({ width: cfg.width })
    .composite([
      {
        // Ligera transparencia: el logo se integra con la textura mate del envase.
        input: Buffer.from([255, 255, 255, 232]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: 'dest-in',
      },
    ])
    .toBuffer();

  return sharp(buffer)
    .composite([{ input: mark, left: cfg.left, top: cfg.top }])
    .toBuffer();
}

for (const name of FILES) {
  const src = path.join(SRC_DIR, `${name}.png`);
  if (!existsSync(src)) {
    console.warn(`· omitido (no existe): ${src}`);
    continue;
  }

  const branded = await brand(name, await sharp(src).toBuffer());
  const meta = await sharp(branded).metadata();

  const widths = [];
  for (const w of WIDTHS) {
    if (w > meta.width) continue;
    await sharp(branded)
      .resize({ width: w })
      .webp({ quality: 80, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
    widths.push(w);
  }

  manifest[`assets/img/${name}`] = {
    widths,
    width: meta.width,
    height: meta.height,
  };

  // Fallback universal + imagen "por defecto".
  await sharp(branded)
    .resize({ width: Math.min(1600, meta.width) })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, `${name}.jpg`));

  await sharp(branded)
    .resize({ width: Math.min(1600, meta.width) })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(OUT, `${name}.webp`));

  console.log(`✓ ${name}`);
}

/** Retícula social: recortes cuadrados. */
const IG = [
  'seeds-macro',
  'recipe-bowl',
  'quinoa-field',
  'farmer-hands',
  'andes-dawn',
  'sustainability',
  'recipe-salad',
  'recipe-traditional',
];

let i = 1;
for (const name of IG) {
  const src = path.join(SRC_DIR, `${name}.png`);
  if (!existsSync(src)) continue;
  const square = sharp(src).resize(720, 720, { fit: 'cover', position: 'attention' });
  await square.clone().webp({ quality: 78 }).toFile(path.join(OUT, `ig-${i}.webp`));
  await square.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `ig-${i}.jpg`));
  manifest[`assets/img/ig-${i}`] = { widths: [], width: 720, height: 720 };
  console.log(`✓ ig-${i} (${name})`);
  i++;
}

// Manifiesto: el componente `app-img` construye el srcset sólo con los
// anchos que existen realmente, evitando peticiones 404.
const entries = Object.entries(manifest)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([key, value]) =>
      `  '${key}': { widths: [${value.widths.join(', ')}], width: ${value.width}, height: ${value.height} },`,
  )
  .join('\n');

await writeFile(
  'src/app/core/data/image-manifest.ts',
  `/**
 * GENERADO AUTOMÁTICAMENTE por tools/build-site-images.mjs — no editar a mano.
 *
 * Anchos disponibles y dimensiones intrínsecas de cada imagen del sitio.
 * \`app-img\` los usa para construir el srcset y reservar el espacio (evita CLS).
 */
export interface ImageVariants {
  /** Anchos con versión WebP generada. */
  widths: number[];
  width: number;
  height: number;
}

export const IMAGE_MANIFEST: Record<string, ImageVariants> = {
${entries}
};
`,
  'utf8',
);
console.log('✓ image-manifest.ts');
