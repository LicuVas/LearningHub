// Golurile panglicii Excel: controale fara pictograma, galerii nedesenate, nume de grup taiate de bara de derulare.
// Rulare:  node aplicatii/_verificare/panglica_goluri.mjs [--capturi=<dosar>] [--aplicatie=excel]
//   --capturi=<dosar>  salveaza cate o captura a benzii de sus pe fiecare fila si latime (ex. C:/00/AI_0/.scratch/panglica_goluri/dupa)
// Variabila optionala: HARNESS_PW_DIR = folder unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
// Ce numara:
//   (a) la 1920 si 1366 px, pe fiecare fila + bara Acces rapid: controalele vizibile (Button / MenuItem / ListItem / SplitButton fara
//       parti) care nu au nicio pictograma desenata (niciun <svg>) sau au patratelul de rezerva `.lh-ap-gol`, plus orice nod vizibil
//       al carui idMso e in date/<aplicatie>.json › fara_icoana;
//   (b) la aceleasi latimi: galeriile `List` in care nu s-a desenat nimic (niciun <svg>);
//   (c) la 360, 600, 1024, 1366, 1920 px: numele de grup vizibile al caror text nu sta intreg in zona vizibila a benzii care
//       deruleaza (`.lh-ap-sus`: deasupra barei de derulare orizontale = clientHeight).
// Iesire: cate o linie pe fila si latime; ULTIMA linie = un singur numar intreg = totalul (a)+(b)+(c). Tinta: 0.
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

const arg = n => { const a = process.argv.find(x => x.startsWith('--' + n + '=')); return a ? a.slice(n.length + 3) : null; };
const APP = arg('aplicatie') || 'excel';
const CAPTURI = arg('capturi');
const LATIMI_GOLURI = [1920, 1366];
const LATIMI_LEGENDE = [360, 600, 1024, 1366, 1920];
const INALTIME = { 600: 410 };   // fereastra in care omul a vazut numele taiate: ~600 x 410

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
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}
const pauza = ms => new Promise(r => setTimeout(r, ms));

/* ruleaza in pagina: golurile filei afisate acum */
function masoara(arg) {
  const { faraIcoana, cuGoluri, zona } = arg;
  const FARA = new Set(faraIcoana);
  const rad = document.querySelector('[data-lh-aplicatie]');
  const vizibil = e => {
    if (e.closest('.lh-ap-virtual')) return false;
    const r = e.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    for (let x = e; x && x !== rad; x = x.parentElement) if (getComputedStyle(x).display === 'none') return false;
    return true;
  };
  const out = { a: [], b: [], c: [], grupuri: 0, controale: 0 };
  const sus = rad.querySelector('.lh-ap-sus');
  if (cuGoluri) {
    const zone = [...rad.querySelectorAll(zona === 'acces_rapid' ? '[data-lh-suprafata="acces_rapid"]' : '.lh-ap-loc-panglica [data-lh-suprafata]')];
    const vazut = new Set();
    for (const z of zone) {
      for (const e of [z, ...z.querySelectorAll('[data-lh-tip]')]) {
        if (vazut.has(e) || !vizibil(e)) continue;
        vazut.add(e);
        const t = e.getAttribute('data-lh-tip'), id = e.getAttribute('data-lh-id-mso'), nume = (e.getAttribute('data-lh-eticheta') || '').slice(0, 40);
        const areParti = !!e.querySelector('[data-lh-tip]');
        if (id && FARA.has(id)) { out.a.push(t + ' «' + nume + '» ' + id + ' (in fara_icoana)'); continue; }
        if (t === 'List') { if (!e.querySelector('svg')) out.b.push('List «' + nume + '»'); continue; }
        if (!/^(Button|MenuItem|ListItem|SplitButton)$/.test(t) || areParti) continue;
        out.controale++;
        if (e.querySelector('.lh-ap-gol')) out.a.push(t + ' «' + nume + '» ' + (id || '-') + ' (patratel gol)');
        else if (!e.querySelector('svg')) out.a.push(t + ' «' + nume + '» ' + (id || '-') + ' (fara pictograma)');
      }
    }
  }
  /* (c) numele grupurilor: textul intreg deasupra barei de derulare a benzii */
  if (sus && zona !== 'acces_rapid') {
    const cr = sus.getBoundingClientRect();
    const sx = cr.left + sus.clientLeft, sy = cr.top + sus.clientTop;
    const dr = sx + sus.clientWidth, jos = sy + sus.clientHeight;
    for (const lg of rad.querySelectorAll('.lh-ap-loc-panglica .lh-ap-legenda')) {
      if (!vizibil(lg) || !lg.firstChild) continue;
      const rg = document.createRange();
      rg.selectNodeContents(lg);
      const r = rg.getBoundingClientRect();
      if (r.width <= 0 || r.right <= sx || r.left >= dr) continue;   // derulat in afara: nu e vizibil acum
      out.grupuri++;
      if (r.bottom > jos + 0.5 || r.top < sy - 0.5 || r.bottom > innerHeight + 0.5)
        out.c.push('«' + lg.textContent + '» jos ' + r.bottom.toFixed(1) + ' > ' + jos.toFixed(1));
    }
    out.bara = sus.offsetHeight - sus.clientHeight;
  }
  return out;
}

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
// fara --hide-scrollbars (pus implicit de Playwright in headless): bara de derulare a benzii ocupa loc, ca la om
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
let total = 0;
try {
  const date = JSON.parse(fs.readFileSync(path.join(ROOT, 'aplicatii', 'date', APP + '.json'), 'utf8'));
  const file = date.file || [];
  if (CAPTURI) fs.mkdirSync(CAPTURI, { recursive: true });
  const latimi = [...new Set([...LATIMI_LEGENDE, ...LATIMI_GOLURI])].sort((x, y) => y - x);
  for (const w of latimi) {
    const cuGoluri = LATIMI_GOLURI.includes(w);
    const ctx = await browser.newContext({ viewport: { width: w, height: INALTIME[w] || 800 } });
    await ctx.route('**/*', r => (/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
    const p = await ctx.newPage();
    await p.goto(`${base}/aplicatii/poligon.html?aplicatie=${APP}`, { waitUntil: 'load' });
    await p.waitForSelector(`[data-lh-aplicatie="${APP}"]`, { timeout: 15000 });
    await pauza(1200);
    if (cuGoluri) {
      const q = await p.evaluate(masoara, { faraIcoana: date.fara_icoana || [], cuGoluri, zona: 'acces_rapid' });
      total += q.a.length + q.b.length;
      console.log(`${w}px Acces rapid: fara pictograma ${q.a.length} din ${q.controale} controale` + (q.a.length ? '  -> ' + q.a.join('; ') : ''));
    }
    for (const f of file) {
      let m;
      try {
        await p.evaluate(() => { const s = document.querySelector('.lh-ap-sus'); if (s) s.scrollLeft = 0; });
        const tab = p.locator(`[data-lh-tip="TabItem"][data-lh-id-mso="${f.id}"]`).first();
        await tab.scrollIntoViewIfNeeded();
        await tab.click();
        await p.waitForSelector(`[data-lh-suprafata="${f.s}"]`, { timeout: 5000 });
        await p.evaluate(() => { const s = document.querySelector('.lh-ap-sus'); if (s) s.scrollLeft = 0; });
        await pauza(150);
        m = await p.evaluate(masoara, { faraIcoana: date.fara_icoana || [], cuGoluri, zona: 'panglica' });
      } catch (e) {
        total++;
        console.log(`${w}px ${f.e}: EROARE ${String(e.message).split('\n')[0]}`);
        continue;
      }
      const n = m.a.length + m.b.length + m.c.length;
      total += n;
      console.log(`${w}px ${f.e}: ` + (cuGoluri ? `fara pictograma ${m.a.length} din ${m.controale} controale, galerii goale ${m.b.length}, ` : '') +
        `nume de grup taiate ${m.c.length} din ${m.grupuri} (bara de derulare ${m.bara}px)` +
        (n ? '  -> ' + [...m.a, ...m.b, ...m.c].slice(0, 60).join('; ') : ''));
      if (CAPTURI) {
        const sus = p.locator('.lh-ap-sus').first();
        await sus.screenshot({ path: path.join(CAPTURI, `${APP}_${w}_${f.id}.png`) });
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
}
console.log(total);
