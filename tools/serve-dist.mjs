/**
 * Servidor estático mínimo para revisar el build de producción.
 *
 *   node tools/serve-dist.mjs [puerto]
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = 'dist/qui9/browser';
const PORT = Number(process.argv[2] ?? 4400);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

createServer(async (req, res) => {
  const ruta = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let archivo = join(ROOT, normalize(ruta).replace(/^(\.\.[/\\])+/, ''));

  // Rutas de Angular: cualquier camino sin extensión cae en index.html.
  if (!extname(archivo) || !existsSync(archivo)) archivo = join(ROOT, 'index.html');

  try {
    const cuerpo = await readFile(archivo);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
    res.end(cuerpo);
  } catch {
    res.writeHead(404).end('No encontrado');
  }
}).listen(PORT, () => console.log(`dist servido en http://localhost:${PORT}`));
