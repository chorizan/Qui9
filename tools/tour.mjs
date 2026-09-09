/**
 * Recorrido completo de la home: captura una serie de posiciones de scroll
 * en una sola sesión de navegador.
 *
 *   node tools/tour.mjs [url] [prefijo] [ancho] [alto]
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));

const [, , url = 'http://localhost:4321/', prefix = 'tour', w = '1440', h = '900'] = process.argv;

await mkdir('.shots', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--enable-unsafe-swiftshader'],
  defaultViewport: { width: +w, height: +h, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));

await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 4500));

const total = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.ceil(total / +h);
console.log(`alto total ${total}px · ${steps} pantallas`);

for (let i = 0; i < steps; i++) {
  const y = i * +h;
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
  // Damos tiempo a que ScrollTrigger resuelva las animaciones de entrada.
  await new Promise((r) => setTimeout(r, 1600));
  const label = String(i).padStart(2, '0');
  await page.screenshot({ path: `.shots/${prefix}-${label}.png` });
}

console.log(`✓ ${steps} capturas en .shots/${prefix}-*.png`);
if (errors.length) console.log('errores:\n' + [...new Set(errors)].slice(0, 12).join('\n'));

await browser.close();
