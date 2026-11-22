// Verificare automata a jurnalului de gesturi al Word (stare('word').gesturi).
// Fiecare verificare porneste o pagina proaspata si foloseste taste si mouse reale (Playwright).
// Iesire: cate o linie PASS / FAIL; ULTIMA linie = numarul de FAIL (exit 0 mereu).
// Rulare:  node aplicatii/_verificare/word_gesturi_checks.mjs      (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR = folderul unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
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
const pauza = ms => new Promise(r => setTimeout(r, ms));
function scrie(stare, nume, detalii) {
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`);
}

async function deschide(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=word`, { waitUntil: 'load' });
  await p.waitForSelector('[data-lh-aplicatie="word"]', { timeout: 15000 });
  await pauza(1200);
  return { ctx, p, erori };
}

const gesturi = p => p.evaluate(() => window.LH.aplicatii.stare('word').gesturi);
const text = p => p.evaluate(() => window.LH.aplicatii.stare('word').text.join('\n'));
const tipuri = g => g.map(x => x.tip).join(',');
const detalii = g => g.map(x => x.tip + ':' + JSON.stringify(x.detalii)).join(' ');

// clic real (mouse) pe centrul primului element care are __nod.e == eticheta (buton din panglica)
async function clicEticheta(p, eticheta) {
  const b = await p.evaluate(et => {
    const x = [...document.querySelectorAll('[data-lh-tip]')].find(y => y.__nod && y.__nod.e === et && y.getBoundingClientRect().width > 0);
    if (!x) return null;
    const r = x.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, eticheta);
  if (!b) throw new Error('fara butonul ' + eticheta);
  await p.mouse.click(b.x, b.y);
  await pauza(400);
}

async function verifica(browser, base, nume, fn) {
  const { ctx, p, erori } = await deschide(browser, base);
  try {
    const r = await fn(p);
    if (erori.length) scrie('FAIL', nume, erori.join(' | '));
    else scrie(r === true ? 'PASS' : 'FAIL', nume, r === true ? '' : String(r));
  } catch (e) {
    scrie('FAIL', nume, 'exceptie: ' + e.message);
  } finally {
    await ctx.close();
  }
}

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    // 1. secventa din cerere: salut, Backspace, selectie tot, Ctrl+C, End, Ctrl+V, Ctrl+Z
    await verifica(browser, base, 'Secventa: tastare, sters, selectie, copiere, lipire, anulare', async p => {
      await p.mouse.click(300, 300);
      await pauza(300);
      await p.keyboard.type('salut');
      await p.keyboard.press('Backspace');
      await p.keyboard.press('Control+A');
      await p.keyboard.press('Control+C');
      await p.keyboard.press('End');
      await p.keyboard.press('Control+V');
      await p.keyboard.press('Control+Z');
      const g = await gesturi(p);
      const ok = tipuri(g) === 'tastare,sters,selectie,copiere,lipire,anulare'
        && g[0].detalii === 'salut' && g[1].detalii === 'inainte' && g[2].detalii === 'salu'
        && g[4].detalii === 'salu';
      return ok ? true : `gesturi: ${detalii(g)}`;
    });

    // 2. Delete (tasta) -> sters/dupa
    await verifica(browser, base, 'Delete: sters cu detalii dupa', async p => {
      await p.mouse.click(300, 300);
      await pauza(300);
      await p.keyboard.type('abc');
      await p.keyboard.press('Home');
      await p.keyboard.press('Delete');
      const g = await gesturi(p);
      const t = await text(p);
      const ok = tipuri(g) === 'tastare,sters' && g[1].detalii === 'dupa' && t.indexOf('bc') >= 0;
      return ok ? true : `gesturi: ${detalii(g)} text=${JSON.stringify(t)}`;
    });

    // 3. Ctrl+Y dupa Ctrl+Z -> refacere
    await verifica(browser, base, 'Ctrl+Y: refacere dupa anulare', async p => {
      await p.mouse.click(300, 300);
      await pauza(300);
      await p.keyboard.type('ab');
      await p.keyboard.press('Control+Z');
      await p.keyboard.press('Control+Y');
      const g = await gesturi(p);
      const ok = tipuri(g) === 'tastare,anulare,refacere';
      return ok ? true : `gesturi: ${detalii(g)}`;
    });

    // 4. Ctrl+X + Ctrl+V -> decupare (fara copiere suplimentara) si lipire
    await verifica(browser, base, 'Ctrl+X si Ctrl+V: decupare, lipire', async p => {
      await p.mouse.click(300, 300);
      await pauza(300);
      await p.keyboard.type('xyz');
      await p.keyboard.press('Control+A');
      await p.keyboard.press('Control+X');
      await p.keyboard.press('Control+V');
      const g = await gesturi(p);
      const ok = tipuri(g) === 'tastare,selectie,decupare,lipire' && g[3].detalii === 'xyz';
      return ok ? true : `gesturi: ${detalii(g)}`;
    });

    // 5. buton din panglica (mouse real): Bold -> comanda cu numele comenzii
    await verifica(browser, base, 'Panglica: Bold -> comanda', async p => {
      await p.mouse.click(300, 300);
      await pauza(300);
      await p.keyboard.type('ab');
      await p.keyboard.press('Control+A');
      await clicEticheta(p, 'Bold');
      const g = await gesturi(p);
      const ultim = g[g.length - 1];
      const ok = ultim && ultim.tip === 'comanda' && ultim.detalii === 'Bold';
      return ok ? true : `gesturi: ${detalii(g)}`;
    });

    // 6. selectie cu mouse (dublu clic pe primul cuvant) + tragere (mutare)
    await verifica(browser, base, 'Mouse: selectie si mutare prin tragere', async p => {
      await p.mouse.click(300, 300);
      await pauza(300);
      await p.keyboard.type('uno dos');
      await pauza(300);
      const b = await p.evaluate(() => {
        const x = document.querySelector('[data-lh-tinta="text"]');
        const r = x.getBoundingClientRect();
        return { l: r.left, r: r.right, t: r.top, h: r.height };
      });
      const y = b.t + b.h / 2, x0 = b.l + 8;
      await p.mouse.dblclick(x0, y);
      await pauza(800);
      await p.mouse.move(x0, y);
      await p.mouse.down();
      await p.mouse.move(x0 + 30, y, { steps: 5 });
      await p.mouse.move(b.r - 4, y, { steps: 10 });
      await p.mouse.up();
      await pauza(400);
      const g = await gesturi(p);
      const sel = g.find(x => x.tip === 'selectie');
      const mut = g.find(x => x.tip === 'mutare');
      const t = await text(p);
      /* AutoCorect majuscula prima litera („Uno”) si dublul clic ia cuvantul cu spatiul de dupa el („Uno ”) */
      const cuv = s => String(s || '').trim().toLowerCase();
      const ok = sel && cuv(sel.detalii) === 'uno' && mut && cuv(mut.detalii) === 'uno' && t !== 'uno dos';
      return ok ? true : `gesturi: ${detalii(g)} text=${JSON.stringify(t)}`;
    });
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => {
  console.log('FAIL harness - ' + e.message);
  console.log('1');
});
