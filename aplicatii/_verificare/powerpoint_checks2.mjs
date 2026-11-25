// Verificare automata a PowerPoint (runda 2): Copy/Cut/Paste pe diapozitive (taste + panglica + Copy ▾ > Duplicate Slide),
// Layout (galeria aspectelor, textul pastrat), font de tema si culoarea de tema din Font Color ▾, doua efecte pe o caseta
// (Add Animation), scoaterea unui efect din Animation Pane, Start ▾ (On Click / With Previous) pe randul ales.
// Fiecare verificare porneste o pagina proaspata si foloseste clicuri reale ale mouse-ului si taste (Playwright).
// Starea se citeste din window.LH.aplicatii.stare('powerpoint'). Iesire: cate o linie PASS / FAIL; ULTIMA linie = numarul
// de FAIL (exit 0 mereu).
// Rulare:  node aplicatii/_verificare/powerpoint_checks2.mjs      (din radacina depozitului)
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
const APP = '[data-lh-aplicatie="powerpoint"]';

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
    srv.listen(0, '127.0.0.1', () => resolve(srv));
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
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=powerpoint`, { waitUntil: 'load' });
  await p.waitForSelector(APP, { timeout: 15000 });
  await pauza(1200);
  return { ctx, p, erori };
}

const stare = p => p.evaluate(() => window.LH.aplicatii.stare('powerpoint'));

// clic REAL al mouse-ului in centrul celui de-al k-lea element VIZIBIL care se potriveste cu selectorul (in aplicatie)
async function clic(p, sel, k = 0, dupa = 350) {
  const pt = await p.evaluate(([s, kk, app]) => {
    const vis = [...document.querySelectorAll(app + ' ' + s)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    const e = vis[kk];
    if (!e) return null;
    e.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, n: vis.length };
  }, [sel, k, APP]);
  if (!pt) throw new Error('nu gasesc pe ecran: ' + sel + ' [' + k + ']');
  await p.mouse.click(pt.x, pt.y);
  await pauza(dupa);
}

// numarul de elemente vizibile care se potrivesc (ca sa stim daca o galerie e deschisa)
const nVizibile = (p, sel) => p.evaluate(([s, app]) => [...document.querySelectorAll(app + ' ' + s)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length, [sel, APP]);
const mini = n => `[data-lh-tinta="miniatura"][data-lh-id="${n}"]`;
const titluri = st => st.diapozitive.map(d => d.texte[0]);

async function verifica(browser, base, nume, fn) {
  try {
    const { ctx, p, erori } = await deschide(browser, base);
    try {
      const r = await fn(p);
      if (erori.length) scrie('FAIL', nume, 'erori: ' + erori.slice(0, 2).join(' | '));
      else if (r === true) scrie('PASS', nume);
      else scrie('FAIL', nume, String(r));
    } finally { await ctx.close(); }
  } catch (e) { scrie('FAIL', nume, e.message.split('\n')[0]); }
}

// pregatire: diapozitivul 1 (Vulcanii), forma titlu aleasa, galeria Animations deschisa cu Fly In pe caseta
async function unEfect(p) {
  await clic(p, '[data-lh-tinta="forma"]', 0);
  await clic(p, '[data-lh-tip="TabItem"][data-lh-eticheta="Animations"]');
  await clic(p, '[data-lh-tip="ListItem"][data-lh-eticheta="Fly In"]', 0);
}

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    // 1 Ctrl+C / Ctrl+V pe miniatura aleasa (taste)
    await verifica(browser, base, '1 Ctrl+C / Ctrl+V pe miniaturi: copia vine dupa 3', async p => {
      await clic(p, mini(1));
      await p.keyboard.press('Control+C');
      await clic(p, mini(3));
      await p.keyboard.press('Control+V');
      const st = await stare(p);
      return st.diapozitive.length === 4 && st.diapozitiv_activ === 4 && st.diapozitive[3].texte[0] === 'Vulcanii' ? true
        : `n=${st.diapozitive.length} activ=${st.diapozitiv_activ} titluri=${JSON.stringify(titluri(st))}`;
    });

    // 2 Home > Copy si Home > Paste (butoanele panglicii)
    await verifica(browser, base, '2 Home › Copy + Paste: diapozitivul 2 dupa 3', async p => {
      await clic(p, mini(2));
      await clic(p, '[data-lh-id-mso="Copy"]');
      await clic(p, mini(3));
      await clic(p, '[data-lh-id-mso="Paste"]');
      const st = await stare(p);
      return st.diapozitive.length === 4 && st.diapozitiv_activ === 4 && st.diapozitive[3].texte[0] === 'Ce sunt vulcanii' ? true
        : `n=${st.diapozitive.length} titluri=${JSON.stringify(titluri(st))}`;
    });

    // 3 Copy ▾ > Duplicate Slide
    await verifica(browser, base, '3 Copy ▾ › Duplicate Slide: copia vine dupa original, devine aleasa', async p => {
      await clic(p, mini(2));
      await clic(p, '[data-lh-id-mso="CopySplitButton_Dropdown"]');
      await clic(p, '[data-lh-tinta="meniu:Duplicate Slide"]');
      const st = await stare(p);
      return st.diapozitive.length === 4 && st.diapozitiv_activ === 3 && st.diapozitive[2].texte[0] === 'Ce sunt vulcanii' ? true
        : `n=${st.diapozitive.length} activ=${st.diapozitiv_activ} titluri=${JSON.stringify(titluri(st))}`;
    });

    // 4 Cut (Home) + Paste (taste) pe miniatura
    await verifica(browser, base, '4 Home › Cut pe diapozitivul 3, apoi Ctrl+V dupa 1', async p => {
      await clic(p, mini(3));
      await clic(p, '[data-lh-id-mso="Cut"]');
      const dupaCut = await stare(p);
      await clic(p, mini(1));
      await p.keyboard.press('Control+V');
      const st = await stare(p);
      return dupaCut.diapozitive.length === 2 && st.diapozitive.length === 3 && st.diapozitiv_activ === 2 && st.diapozitive[1].texte[0] === 'Întrebări?' ? true
        : `dupa cut n=${dupaCut.diapozitive.length}; n=${st.diapozitive.length} activ=${st.diapozitiv_activ} titluri=${JSON.stringify(titluri(st))}`;
    });

    // 5 Delete pe miniatura aleasa (taste)
    await verifica(browser, base, '5 Delete pe miniatura 2 sterge diapozitivul 2', async p => {
      await clic(p, mini(2));
      await p.keyboard.press('Delete');
      const st = await stare(p);
      return st.diapozitive.length === 2 && JSON.stringify(titluri(st)) === JSON.stringify(['Vulcanii', 'Întrebări?']) ? true
        : `n=${st.diapozitive.length} titluri=${JSON.stringify(titluri(st))}`;
    });

    // 6 Layout: Section Header pastreaza titlul
    await verifica(browser, base, '6 Layout › Section Header: titlul ramane, aspectul se schimba', async p => {
      await clic(p, mini(2));
      await clic(p, '[data-lh-id-mso="SlideLayoutGallery"]');
      await clic(p, '[data-lh-lista="aspect"][data-lh-eticheta="Section Header"], [data-lh-suprafata="lista.SlideLayoutGallery"] [data-lh-eticheta="Section Header"]');
      const st = await stare(p);
      const d = st.diapozitive[1];
      return d.aspect === 'Section Header' && d.texte[0] === 'Ce sunt vulcanii' ? true : `aspect=${d.aspect} texte=${JSON.stringify(d.texte)}`;
    });

    // 6b Layout: Comparison si Blank
    await verifica(browser, base, '6b Layout › Comparison, apoi Blank pe diapozitivul 3', async p => {
      await clic(p, mini(3));
      await clic(p, '[data-lh-id-mso="SlideLayoutGallery"]');
      await clic(p, '[data-lh-suprafata="lista.SlideLayoutGallery"] [data-lh-eticheta="Comparison"]');
      const a = (await stare(p)).diapozitive[2].aspect;
      await clic(p, '[data-lh-id-mso="SlideLayoutGallery"]');
      await clic(p, '[data-lh-suprafata="lista.SlideLayoutGallery"] [data-lh-eticheta="Blank"]');
      const b = (await stare(p)).diapozitive[2].aspect;
      return a === 'Comparison' && b === 'Blank' ? true : `comparison=${a} blank=${b}`;
    });

    // 7 Font de tema: Calibri (Body) din lista Font, pe textul titlului
    await verifica(browser, base, '7 Font: Calibri (Body) din lista Font se aplica textului', async p => {
      await clic(p, mini(2));
      await clic(p, '[data-lh-tinta="forma"]', 0);
      await p.keyboard.press('Control+A');
      const antes = (await stare(p)).font_text;
      await clic(p, '[data-lh-id-mso="Font"] input');
      await clic(p, '[data-lh-suprafata="lista.Font"] [data-lh-eticheta="Calibri (Body)"]');
      const f = (await stare(p)).font_text;
      return antes === 'Calibri Light' && f === 'Calibri' ? true : `inainte=${antes} dupa=${f}`;
    });

    // 8 Font Color ▾: culoarea de tema „Blue, Accent 1”
    await verifica(browser, base, '8 Font Color ▾ › Blue, Accent 1 pe text selectat', async p => {
      await clic(p, mini(2));
      await clic(p, '[data-lh-tinta="forma"]', 0);
      await p.keyboard.press('Control+A');
      await clic(p, '[data-lh-id-mso="FontColorPicker_Dropdown"]');
      await clic(p, '[data-lh-suprafata="lista.FontColorPicker"] [data-lh-eticheta="Blue, Accent 1"]');
      const c = (await stare(p)).culoare_text;
      return c === '#4472C4' ? true : `culoare=${c}`;
    });

    // 9 Doua efecte pe aceeasi caseta (Add Animation)
    await verifica(browser, base, '9 Add Animation: al doilea efect pe aceeasi caseta', async p => {
      await clic(p, mini(1));
      await unEfect(p);
      await clic(p, '[data-lh-id-mso="AnimationAddGallery"]');
      await clic(p, '[data-lh-tip="ListItem"][data-lh-eticheta="Fade"]', 0);
      const st = await stare(p);
      return st.pornire_animatii[0].length === 2 ? true : `efecte=${st.pornire_animatii[0].length} ordine=${JSON.stringify(st.ordine_animatii)}`;
    });

    // 10 Animation Pane: Start ▾ = With Previous pe randul 2
    await verifica(browser, base, '10 Start ▾ › With Previous pe al doilea efect', async p => {
      await clic(p, mini(1));
      await unEfect(p);
      await clic(p, '[data-lh-id-mso="AnimationAddGallery"]');
      await clic(p, '[data-lh-tip="ListItem"][data-lh-eticheta="Fade"]', 0);
      await clic(p, '[data-lh-id-mso="AnimationCustom"]');
      await clic(p, '.lh-ap-p-anim-rand', 1);
      await clic(p, '[data-lh-tip="ComboBox"][data-lh-eticheta="Start"]');
      await clic(p, '[data-lh-lista="pornire"] [data-lh-eticheta="With Previous"]');
      const pr = (await stare(p)).pornire_animatii[0];
      return pr && pr[0] === 'la_clic' && pr[1] === 'cu_precedenta' ? true : `pornire=${JSON.stringify(pr)}`;
    });

    // 11 Animation Pane: scoate doar al doilea efect, forma ramane
    await verifica(browser, base, '11 Animation Pane: Delete scoate un efect, forma ramane', async p => {
      await clic(p, mini(1));
      const f0 = (await stare(p)).forme_diapozitiv[0].length;
      await unEfect(p);
      await clic(p, '[data-lh-id-mso="AnimationAddGallery"]');
      await clic(p, '[data-lh-tip="ListItem"][data-lh-eticheta="Fade"]', 0);
      await clic(p, '[data-lh-id-mso="AnimationCustom"]');
      await clic(p, '.lh-ap-p-anim-rand', 1);
      await p.keyboard.press('Delete');
      const st = await stare(p);
      return st.pornire_animatii[0].length === 1 && st.forme_diapozitiv[0].length === f0 ? true
        : `efecte=${st.pornire_animatii[0].length} forme=${st.forme_diapozitiv[0].length} (era ${f0})`;
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
