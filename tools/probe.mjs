/** Inspección rápida del layout en el navegador. */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const failures = [];
page.on('requestfailed', (r) => failures.push(r.url()));
page.on('response', (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});

await page.goto(process.argv[2] ?? 'http://localhost:4321/', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 3500));

const info = await page.evaluate(() => {
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  return {
    stage: rect('.hero__stage'),
    canvas: rect('.hero__canvas'),
    content: rect('.hero__content'),
    particles: rect('app-particle-field canvas'),
    docHeight: document.body.scrollHeight,
  };
});

console.log(JSON.stringify(info, null, 2));
console.log('fallos de red:', failures.length ? failures.join('\n') : 'ninguno');
await browser.close();
