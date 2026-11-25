// Excelul pe telefon: bara de formule si zoom-ul din bara de stare raman la vedere si apasabile in fereastra ingusta.
// Rulare:  node aplicatii/_verificare/ingust_checks.mjs [--capturi=<dosar>]
// Variabila optionala: HARNESS_PW_DIR = folder unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
// Ce masoara, la latimi de ecran 360 si 412 px (telefon, cu atingere), in doua locuri:
//   - poligonul (aplicatii/poligon.html?aplicatie=excel);
//   - lectia lectii/viii/m1-l02/?pas=atelier (Excelul bibliotecii in coloana lectiei).
//   (1) campul de formula (`.lh-ap-x-bara-formule`): latimea VIZIBILA = intersectia cu ecranul, cu fereastra aplicatiei si cu
//       fiecare stramos care taie (overflow), fara derulare. FAIL sub 120 px sau daca punctul din mijlocul partii vizibile nu
//       e al campului (ceva il acopera);
//   (2) zoom-ul din bara de stare: butoanele «Zoom Out», «Zoom In» si textul «Zoom 100 %» (copiii directi ai barei de stare).
//       FAIL daca vreunul are la vedere mai putin de 90 % din latimea lui, fara derulare, sau e acoperit la mijloc;
//   (3) la 1366 px (poligon): pozitiile celor patru piese (Name Box, fx, campul de formula, zoom) = cele masurate inaintea regulilor de telefon
//       (nicio schimbare pe ecran lat). FAIL la orice abatere peste 1 px.
// Iesire: PASS / FAIL pe fiecare masuratoare, cu cifrele; ULTIMA linie = numarul de FAIL.
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
const CAPTURI = (process.argv.find(x => x.startsWith('--capturi=')) || '').slice(10) || null;
const PRAG_FORMULA = 120, PRAG_ZOOM = 0.9;

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.xlsx': 'application/octet-stream' };
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      let rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      let f = path.join(ROOT, rel);
      if (f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { s.writeHead(404); return s.end('nu'); }
      s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(s);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
let nFail = 0;
function scrie(ok, nume, det) { if (!ok) nFail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${det ? ' - ' + det : ''}`); }

/* in pagina: partea la vedere a fiecarei piese */
function masoara() {
  const rad = document.querySelector('[data-lh-aplicatie="excel"]');
  if (!rad) return null;
  const R = rad.getBoundingClientRect();
  const vizibil = e => {
    const b = e.getBoundingClientRect();
    let x0 = Math.max(b.left, 0, R.left), x1 = Math.min(b.right, innerWidth, R.right), y0 = Math.max(b.top, 0, R.top), y1 = Math.min(b.bottom, innerHeight, R.bottom);
    for (let p = e.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      const q = p.getBoundingClientRect();
      if (cs.overflowX !== 'visible') { x0 = Math.max(x0, q.left + p.clientLeft); x1 = Math.min(x1, q.left + p.clientLeft + p.clientWidth); }
      if (cs.overflowY !== 'visible') { y0 = Math.max(y0, q.top + p.clientTop); y1 = Math.min(y1, q.top + p.clientTop + p.clientHeight); }
    }
    const w = Math.max(0, x1 - x0), h = Math.max(0, y1 - y0);
    let sus = false;
    if (w > 0 && h > 0) { const t = document.elementFromPoint(x0 + w / 2, y0 + h / 2); sus = !!t && (t === e || e.contains(t)); }
    return { w: +w.toFixed(1), h: +h.toFixed(1), total: +b.width.toFixed(1), x: +b.left.toFixed(1), sus };
  };
  const bf = rad.querySelector('.lh-ap-x-bara-formule');
  const st = rad.querySelector('.lh-ap-jos [data-lh-suprafata^="bara_stare"]');
  const zoom = {};
  if (st) for (const c of st.children) {
    const e = c.getAttribute('data-lh-eticheta') || '';
    if (c.getAttribute('data-lh-tip') === 'Button' && (e === 'Zoom Out' || e === 'Zoom In')) zoom[e] = vizibil(c);
    if (c.getAttribute('data-lh-tip') === 'Text' && /^Zoom \d/.test(e)) zoom['Zoom %'] = vizibil(c);
  }
  const loc = s => { const e = rad.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [+(b.left - R.left).toFixed(1), +b.width.toFixed(1)]; };
  return { fereastra: +R.width.toFixed(1), formula: bf ? vizibil(bf) : null, zoom,
    loc: { nume: loc('.lh-ap-x-nume'), fx: loc('.lh-ap-x-fx'), formula: loc('.lh-ap-x-bara-formule'),
      zoom: (() => { const e = st && [...st.children].find(c => /^Zoom \d/.test(c.getAttribute('data-lh-eticheta') || '')); if (!e) return null; const b = e.getBoundingClientRect(); return [+(R.right - b.right).toFixed(1), +b.width.toFixed(1)]; })() } };
}

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
try {
  if (CAPTURI) fs.mkdirSync(CAPTURI, { recursive: true });
  const LOCURI = [
    { nume: 'poligon', url: '/aplicatii/poligon.html?aplicatie=excel', gata: '[data-lh-aplicatie="excel"] .lh-ap-x-bara-formule' },
    { nume: 'lectia m1-l02 (atelier)', url: '/lectii/viii/m1-l02/index.html?pas=atelier', gata: '#body [data-lh-aplicatie="excel"] .lh-ap-x-bara-formule', lectie: true }
  ];
  for (const w of [360, 412]) {
    for (const L of LOCURI) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      await ctx.route('**/*', r => (/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
      /* lectia: pasii deschisi (ca in lectie_m1-l02.mjs), altfel ?pas=atelier ramane incuiat */
      await ctx.addInitScript(k => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ nume: '', lv: { 0: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 } } })); } catch (e) { /* */ } }, 'lectie_viii_m1_l02');
      const p = await ctx.newPage();
      const eticheta = `${w}px ${L.nume}`;
      try {
        await p.goto(base + L.url, { waitUntil: 'load' });
        if (L.lectie) {
          await p.waitForFunction(() => window.JocMotor && JocMotor.test.stare() && document.getElementById('body'), null, { timeout: 15000 });
          const viz = p.getByRole('button', { name: /doar vizitez/ });
          if (await viz.count()) await viz.first().click().catch(() => {});
        }
        await p.waitForSelector(L.gata, { timeout: 20000 });
        await pauza(1200);
        await p.locator('[data-lh-aplicatie="excel"]').first().scrollIntoViewIfNeeded();
        await pauza(200);
        const m = await p.evaluate(masoara);
        const f = m.formula;
        scrie(!!f && f.w >= PRAG_FORMULA && f.sus, `${eticheta}: campul de formula la vedere`,
          f ? `${f.w} px vizibili din ${f.total} (prag ${PRAG_FORMULA}), fereastra aplicatiei ${m.fereastra} px, ${f.sus ? 'apasabil' : 'ACOPERIT la mijloc'}` : 'nu exista');
        for (const k of ['Zoom Out', 'Zoom %', 'Zoom In']) {
          const z = m.zoom[k];
          scrie(!!z && z.total > 0 && z.w / z.total >= PRAG_ZOOM && z.sus, `${eticheta}: ${k} la vedere fara derulare`,
            z ? `${z.w} px vizibili din ${z.total}${z.sus ? '' : ', ACOPERIT sau in afara'}` : 'nu exista in bara de stare');
        }
        if (CAPTURI) await p.screenshot({ path: path.join(CAPTURI, `ingust_${w}_${L.lectie ? 'lectie' : 'poligon'}.png`) });
      } catch (e) {
        scrie(false, eticheta, 'EROARE ' + String(e.message).split('\n')[0]);
      }
      await ctx.close();
    }
  }
  /* (3) ecranul lat: nimic mutat */
  const REF = { nume: [11, 131], fx: [208, 28], formula: [241, 1123], zoom: [13, 46] };   // masurat pe 25.11.2026, inaintea regulilor de telefon;   // [stanga in fereastra (zoom: distanta pana la marginea dreapta), latime] la 1366 px
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await ctx.route('**/*', r => (/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  await p.goto(base + '/aplicatii/poligon.html?aplicatie=excel', { waitUntil: 'load' });
  await p.waitForSelector('[data-lh-aplicatie="excel"] .lh-ap-x-bara-formule', { timeout: 15000 });
  await pauza(1200);
  const m = await p.evaluate(masoara);
  for (const k of Object.keys(REF)) {
    const a = m.loc[k], b = REF[k];
    scrie(!!a && Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1, `1366px poligon: ${k} neschimbat`, `masurat ${JSON.stringify(a)}, referinta ${JSON.stringify(b)}`);
  }
  await ctx.close();
} finally {
  await browser.close();
  srv.close();
}
console.log(nFail);
