// Verificare automata a aplicatiei Paint din biblioteca (aplicatii/paint.js), prin poligon.html?aplicatie=paint.
// Rulare:  node aplicatii/_verificare/paint_checks.mjs            (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR = folder unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL (exit 0 mereu).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PW_DIR = process.env.HARNESS_PW_DIR || 'C:/00/AI_0/.scratch/harness-node';
const require = createRequire(path.join(PW_DIR, 'package.json'));
const { chromium } = require('playwright');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      const rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end('nu'); }
      s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(s);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));   // port liber, ales de sistem
  });
}

let nFail = 0;
function scrie(ok, nume, detalii) {
  if (!ok) nFail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${detalii ? ' - ' + detalii : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) erori.push(r.status() + ' ' + r.url()); });
  try {
    // 1. Paint se deschide din poligon, fara erori
    await p.goto(`${base}/aplicatii/poligon.html?aplicatie=paint`, { waitUntil: 'load' });
    await p.waitForSelector('[data-lh-aplicatie="paint"] canvas[data-lh-zona="panza"]', { timeout: 15000 });
    await pauza(800);
    const st0 = await p.evaluate(() => window.LH.aplicatii.stare('paint'));
    scrie(!!st0 && st0.aplicatie === 'paint' && st0.panza.latime === 640 && st0.panza.inaltime === 480,
      '1 Paint se deschide: stare() cu pânza 640×480', st0 ? JSON.stringify(st0.panza) : 'stare null');
    scrie(st0 && st0.pixeli_schimbati === false, '2 la deschidere pixeli_schimbati = false');
    scrie(erori.length === 0, '3 Paint se incarca fara erori in consola', erori.slice(0, 3).join(' | '));

    // 2. Creion cu tragere reala de mouse
    const pan = p.locator('[data-lh-aplicatie="paint"] canvas[data-lh-zona="panza"]');
    await p.locator('[data-lh-aplicatie="paint"] [data-lh-tinta="unealta:creion"]').click();
    await pan.scrollIntoViewIfNeeded();
    const box = await pan.boundingBox();
    const sx = box.width / 640, sy = box.height / 480;   // zoom 100 %: 1 px pânză = sx × sy px ecran
    const x0 = box.x + 200 * sx, y0 = box.y + 120 * sy, x1 = box.x + 400 * sx;
    await p.mouse.move(x0, y0);
    await p.mouse.down();
    for (let i = 1; i <= 20; i++) await p.mouse.move(x0 + (x1 - x0) * i / 20, y0);
    await p.mouse.up();
    await pauza(100);
    const st1 = await p.evaluate(() => window.LH.aplicatii.stare('paint'));
    scrie(st1 && st1.pixeli_schimbati === true, '4 Creion: tragerea cu mouse-ul schimba pânza (pixeli_schimbati = true)');
    const pix = await p.evaluate(() => {
      const c = document.querySelector('[data-lh-aplicatie="paint"] canvas[data-lh-zona="panza"]');
      const d = c.getContext('2d').getImageData(300, 120, 1, 1).data;
      return [d[0], d[1], d[2]];
    });
    scrie(pix[0] < 60 && pix[1] < 60 && pix[2] < 60, '5 Creion: pixelul (300,120) din pânză e negru (culoarea 1 implicită)', 'rgb ' + pix.join(','));

    // 3. Ctrl+Z restabileste pânza
    await pan.focus();
    await p.keyboard.press('Control+z');
    await pauza(100);
    const pixU = await p.evaluate(() => {
      const c = document.querySelector('[data-lh-aplicatie="paint"] canvas[data-lh-zona="panza"]');
      const d = c.getContext('2d').getImageData(300, 120, 1, 1).data;
      return [d[0], d[1], d[2]];
    });
    const st2 = await p.evaluate(() => window.LH.aplicatii.stare('paint'));
    scrie(pixU.every(v => v > 240) && st2.pixeli_schimbati === false, '6 Ctrl+Z restabileste pânza (pixel alb, pixeli_schimbati = false)', 'rgb ' + pixU.join(','));

    // 4. Culoarea din paleta devine Culoarea 1 (primul plan)
    await p.locator('[data-lh-aplicatie="paint"] [data-culoare="#ed1c24"]').click();
    await pauza(100);
    const st3 = await p.evaluate(() => window.LH.aplicatii.stare('paint'));
    scrie(st3 && st3.culoare1 === '#ed1c24' && st3.culoare1_nume === 'Roșu',
      '7 Paleta: clic pe Roșu = Culoarea 1 (primul plan)', st3 ? st3.culoare1 + ' ' + st3.culoare1_nume : 'null');

    // bonus: Ctrl+Y refac, si culoarea de pe pânză e cea aleasă la desen
    await pan.focus();
    await p.keyboard.press('Control+y');
    await pauza(100);
    const pixR = await p.evaluate(() => {
      const c = document.querySelector('[data-lh-aplicatie="paint"] canvas[data-lh-zona="panza"]');
      const d = c.getContext('2d').getImageData(300, 120, 1, 1).data;
      return [d[0], d[1], d[2]];
    });
    scrie(pixR[0] < 60 && pixR[1] < 60 && pixR[2] < 60, '8 Ctrl+Y refac linia (pixel negru inapoi)', 'rgb ' + pixR.join(','));

    // 5. Salvare in magazia din memorie (fara descarcare)
    await pan.focus();
    await p.keyboard.press('Control+Shift+S');
    await p.locator('[data-lh-aplicatie="paint"] input[aria-label="Nume fișier"]').fill('test-paint');
    await p.locator('[data-lh-aplicatie="paint"] input[aria-label="Nume fișier"]').press('Enter');
    await pauza(100);
    const mag = await p.evaluate(() => Object.keys(window.LH.aplicatii._module.paint.magazie));
    scrie(mag.indexOf('test-paint.png') >= 0, '9 Salvare ca: fișierul apare în magazia în memorie', mag.join(', '));
  } catch (e) {
    scrie(false, 'verificare intreruptă', e.message);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main();
