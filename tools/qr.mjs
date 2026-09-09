/**
 * Genera un QR con la URL del servidor de desarrollo en la red local.
 *
 *   node tools/qr.mjs [url] [salida]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const [, , url = 'http://192.168.18.33:4200/', out = '.shots/qui9-qr.png'] = process.argv;

await mkdir('.shots', { recursive: true });

let QRCode;
try {
  QRCode = require('qrcode');
} catch {
  // Si no está instalado, lo descargamos al vuelo con npx no es ideal;
  // usamos la API pública como respaldo.
  const res = await fetch(
    `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=20&data=${encodeURIComponent(url)}`,
  );
  if (!res.ok) throw new Error('No se pudo generar el QR');
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(out);
  console.log(url);
  process.exit(0);
}

await QRCode.toFile(out, url, {
  width: 480,
  margin: 2,
  color: { dark: '#0d056f', light: '#fdfbf6' },
});

console.log(out);
console.log(url);
