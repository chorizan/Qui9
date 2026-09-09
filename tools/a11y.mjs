/**
 * Revisión rápida de accesibilidad y de `prefers-reduced-motion`.
 *
 *   node tools/a11y.mjs [url]
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));

const [, , url = 'http://localhost:4321/'] = process.argv;

await mkdir('.shots', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--enable-unsafe-swiftshader'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 4000));

await page.screenshot({ path: '.shots/reduced-motion.png' });

const audit = await page.evaluate(() => {
  const imgsSinAlt = [...document.querySelectorAll('img')]
    .filter((i) => !i.alt)
    .map((i) => i.currentSrc || i.src);

  const botonesSinNombre = [...document.querySelectorAll('button, a')]
    .filter((el) => {
      const texto = (el.textContent ?? '').trim();
      return !texto && !el.getAttribute('aria-label') && !el.querySelector('img[alt]');
    })
    .map((el) => el.className);

  const encabezados = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => h.tagName);

  // Elementos que siguen ocultos por animación con movimiento reducido.
  const invisibles = [...document.querySelectorAll('.hero__reveal, [data-reveal], .word')]
    .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.1)
    .map((el) => el.className)
    .slice(0, 12);

  return {
    h1: document.querySelectorAll('h1').length,
    encabezados: encabezados.join(' '),
    imgsSinAlt,
    botonesSinNombre,
    invisibles,
    scrollHeight: document.body.scrollHeight,
  };
});

console.log(JSON.stringify(audit, null, 2));

// Recorrido con teclado: los primeros focos deben ser visibles y con nombre.
const foco = [];
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab');
  foco.push(
    await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'ninguno';
      const nombre = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40);
      return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} — ${nombre}`;
    }),
  );
}
console.log('recorrido con tabulador:\n' + foco.join('\n'));

await browser.close();
