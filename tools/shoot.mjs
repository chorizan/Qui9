/**
 * Capturas de la web en distintos anchos, para revisión visual.
 *
 *   node tools/shoot.mjs [url] [nombre] [ancho] [alto] [scrollY]
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));

const [, , url = 'http://localhost:4321/', name = 'shot', w = '1440', h = '900', scroll = '0'] =
  process.argv;

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

await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 4200));

if (+scroll > 0) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), +scroll);
  await new Promise((r) => setTimeout(r, 2500));
}

await page.screenshot({ path: `.shots/${name}.png` });
console.log(`✓ .shots/${name}.png`);
if (errors.length) console.log('errores:\n' + errors.slice(0, 12).join('\n'));

await browser.close();
