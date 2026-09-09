/**
 * Genera los derivados de marca a partir del logotipo original de QUI9.
 *
 *   node tools/build-brand-assets.mjs
 *
 * Salidas en public/assets/brand:
 *   qui9-mark.png    logotipo blanco con canal alfa (usable sobre cualquier fondo)
 *   qui9-logo.png    logotipo sobre el azul de marca, recortado y normalizado
 *   favicon.png      icono 128×128
 *   og-cover.png     imagen social 1200×630
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'public/assets/brand/qui9-logo-original.png';
const OUT = 'public/assets/brand';
const BRAND = { r: 13, g: 5, b: 111 };

await mkdir(OUT, { recursive: true });

const src = sharp(SRC);
const meta = await src.metadata();
console.log(`origen: ${meta.width}×${meta.height}`);

// El logotipo es blanco sobre azul: la luminancia funciona como canal alfa.
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.width * info.height;
const out = Buffer.alloc(px * 4);

for (let i = 0; i < px; i++) {
  const r = data[i * 4];
  const g = data[i * 4 + 1];
  const b = data[i * 4 + 2];
  // Distancia relativa al azul de fondo → opacidad del trazo blanco.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const base = (0.299 * BRAND.r + 0.587 * BRAND.g + 0.114 * BRAND.b) / 255;
  let a = (lum - base) / (1 - base);
  a = Math.max(0, Math.min(1, a));
  out[i * 4] = 255;
  out[i * 4 + 1] = 255;
  out[i * 4 + 2] = 255;
  out[i * 4 + 3] = Math.round(a * 255);
}

const markRaw = sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
});

// Recorta el margen transparente para que el logotipo ocupe todo el lienzo.
const trimmed = await markRaw.png().trim({ threshold: 4 }).toBuffer();
await sharp(trimmed).png({ compressionLevel: 9 }).toFile(`${OUT}/qui9-mark.png`);
console.log('✓ qui9-mark.png');

// Versión sobre el azul de marca.
const markMeta = await sharp(trimmed).metadata();
await sharp({
  create: {
    width: markMeta.width + 120,
    height: markMeta.height + 120,
    channels: 4,
    background: BRAND,
  },
})
  .composite([{ input: trimmed, gravity: 'centre' }])
  .png()
  .toFile(`${OUT}/qui9-logo.png`);
console.log('✓ qui9-logo.png');

// Favicon.
await sharp(trimmed)
  .resize(112, 112, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 8, bottom: 8, left: 8, right: 8, background: BRAND })
  .flatten({ background: BRAND })
  .png()
  .toFile(`${OUT}/favicon.png`);
console.log('✓ favicon.png');

// Portada social.
const ogMark = await sharp(trimmed).resize({ height: 300 }).toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: BRAND },
})
  .composite([{ input: ogMark, gravity: 'centre' }])
  .png()
  .toFile(`${OUT}/og-cover.png`);
console.log('✓ og-cover.png');
