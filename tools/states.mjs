/**
 * Capturas de estados interactivos: preloader, menú móvil y carrito.
 *
 *   node tools/states.mjs [url] [ancho] [alto] [prefijo]
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));

const [, , url = 'http://localhost:4321/', w = '390', h = '844', prefix = 'st'] = process.argv;

await mkdir('.shots', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--enable-unsafe-swiftshader'],
  defaultViewport: { width: +w, height: +h, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Preloader: se captura antes de que termine la carga.
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await wait(700);
await page.screenshot({ path: `.shots/${prefix}-preloader.png` });

await wait(5000);

// Menú (hamburguesa en móvil).
const burger = await page.$('.nav__burger');
if (burger && (await burger.boundingBox())) {
  await burger.click();
  await wait(1400);
  await page.screenshot({ path: `.shots/${prefix}-menu.png` });
  await burger.click();
  await wait(1000);
}

// Carrito con un producto dentro: se pulsa por DOM para no depender del
// desplazamiento ni del enlace que cubre la tarjeta.
await page.goto(new URL('/productos', url).href, { waitUntil: 'networkidle2' });
await wait(2500);
await page.evaluate(() => {
  document.querySelectorAll('.card__buy').forEach((b, i) => i < 2 && b.click());
});
await wait(1800);
await page.screenshot({ path: `.shots/${prefix}-cart.png` });

console.log(`✓ ${prefix}-preloader / ${prefix}-menu / ${prefix}-cart`);
if (errors.length) console.log('errores:\n' + [...new Set(errors)].join('\n'));

await browser.close();
