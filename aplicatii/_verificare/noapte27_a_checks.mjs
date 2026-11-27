// Noaptea 27.11.2026 (A): panglica pe telefon si la 1366 px, in Word, PowerPoint si Excel (poligonul bibliotecii).
// Rulare:  node aplicatii/_verificare/noapte27_a_checks.mjs [--doar=A|B|C]
// Variabila optionala: HARNESS_PW_DIR = folder unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
// Ce joaca:
//   A (telefon 360x780, cu atingere): o tragere cu degetul (pointerType touch, prin CDP Input.dispatchTouchEvent) pe panglica,
//     pornind cu tastatura inchisa (nimic in focus). FAIL daca dupa tragere `document.activeElement` e caseta ascunsa a documentului
//     (TEXTAREA.lh-ap-intrare: pe telefon asta deschide tastatura de pe ecran in mijlocul tragerii) sau daca panglica nu s-a
//     derulat (scrollLeft = 0). Excel = martorul (reparat in 520da0e7).
//   B (1366x768, mouse): un clic de mouse pe numele unui grup din panglica, apoi tastare cu tastatura fizica: focusul ajunge in
//     caseta documentului si literele ajung in document (Word: textul documentului; PowerPoint: titlul diapozitivului 1, in care
//     s-a dat clic inainte; Excel: celula A1). Asa era inainte de reparatia A; trebuie sa ramana.
//   C (bara de derulare a panglicii): la 1366x768 (laboratorul) si la 360x780 (telefon), in toate trei aplicatiile:
//     (1) bara de derulare orizontala a benzii de sus `.lh-ap-sus` nu ocupa loc (offsetHeight - clientHeight - chenare = 0 px);
//         browserul porneste FARA --hide-scrollbars, ca barele sa se deseneze ca pe un calculator;
//     (2) panglica ramane derulabila: la 1366 cu rotita mouse-ului (fara Shift) tinut pe panglica, la 360 cu degetul (scrollLeft > 0).
// Iesire: PASS / FAIL pe fiecare verificare, cu cifrele; ULTIMA linie = numarul de FAIL (exit 0 mereu).
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
const DOAR = ((process.argv.find(x => x.startsWith('--doar=')) || '').slice(7) || 'ABC').toUpperCase();

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
let nFail = 0;
function scrie(ok, nume, det) { if (!ok) nFail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${det ? ' - ' + det : ''}`.replace(/\s*\n\s*/g, ' ')); }

const TELEFON = { viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };
const LAB = { viewport: { width: 1366, height: 768 } };

async function deschide(browser, base, app, opt) {
  const ctx = await browser.newContext(opt);
  await ctx.route('**/*', r => (/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=${app}`, { waitUntil: 'load' });
  await p.waitForSelector(`[data-lh-aplicatie="${app}"] .lh-ap-sus`, { timeout: 15000 });
  await pauza(1200);
  return { ctx, p, erori };
}

/* in pagina: banda de sus a aplicatiei (dreptunghi, derulare, grosimea barei de derulare) */
const banda = (p, app) => p.evaluate(a => {
  const s = document.querySelector(`[data-lh-aplicatie="${a}"] .lh-ap-sus`);
  if (!s) return null;
  s.scrollIntoView({ block: 'nearest' });
  const r = s.getBoundingClientRect(), cs = getComputedStyle(s);
  return { x: r.left, y: r.top, w: r.width, h: r.height, sl: s.scrollLeft, depasire: s.scrollWidth - s.clientWidth,
    bara: s.offsetHeight - s.clientHeight - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth) };
}, app);
const focusAcum = p => p.evaluate(() => { const a = document.activeElement; return a ? a.tagName + (a.className ? '.' + String(a.className).trim().replace(/\s+/g, '.') : '') : 'nimic'; });
const eIntrare = f => /^TEXTAREA\..*\blh-ap-intrare\b/.test(f);

/* tragere cu degetul, de la dreapta la stanga, pe randul grupurilor din panglica. Degetul se pune pe un buton / grup al
   panglicii, NU pe o caseta de text (Font, Font Size: acolo focusul e al casetei, pe drept) — punctul se cauta in pagina. */
async function tragereDeget(p, b) {
  const pct = await p.evaluate(([bx, by, bw, bh]) => {
    for (const fy of [0.8, 0.62, 0.72, 0.88, 0.5]) for (let x = Math.min(bx + bw - 30, 330); x > bx + 200; x -= 10) {
      const y = by + bh * fy, e = document.elementFromPoint(x, y);
      if (e && e.closest('.lh-ap-sus') && !e.closest('input,textarea,select,[contenteditable]')) return { x, y, ce: (e.getAttribute('data-lh-tip') || e.tagName) + ' «' + (e.getAttribute('data-lh-eticheta') || '') + '»' };
    }
    return null;
  }, [b.x, b.y, b.w, b.h]);
  if (!pct) throw new Error('niciun punct al panglicii fara caseta de text');
  const y = pct.y, x0 = pct.x, x1 = Math.max(b.x + 20, x0 - 240);
  tragereDeget.ultim = pct.ce;
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] }); await pauza(60);
  for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 8, y }] }); await pauza(30); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  await pauza(400);
}

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
try {
  /* ---------- A: degetul pe panglica nu cheama tastatura */
  if (DOAR.includes('A')) for (const app of ['word', 'powerpoint', 'excel']) {
    const nume = `A ${app} 360px: tragerea cu degetul pe panglica nu da focus casetei ascunse (tastatura) si panglica se deruleaza`;
    const { ctx, p, erori } = await deschide(browser, base, app, TELEFON);
    try {
      await p.evaluate(a => { const s = document.querySelector(`[data-lh-aplicatie="${a}"] .lh-ap-sus`); s.scrollLeft = 0; if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }, app);
      await pauza(150);
      const f0 = await focusAcum(p);
      const b = await banda(p, app);
      await tragereDeget(p, b);
      const f1 = await focusAcum(p), b1 = await banda(p, app);
      scrie(!eIntrare(f1) && b1.sl > 0 && !erori.length, nume,
        `degetul pus pe ${tragereDeget.ultim}; focus inainte ${f0}, dupa tragere ${f1}; scrollLeft ${b1.sl.toFixed(0)} (depasire ${b1.depasire.toFixed(0)} px)${erori.length ? '; ' + erori.join(' | ') : ''}`);
    } catch (e) { scrie(false, nume, 'EROARE ' + String(e.message).split('\n')[0]); }
    await ctx.close();
  }

  /* ---------- B: mouse pe panglica + tastatura fizica = ca inainte */
  if (DOAR.includes('B')) for (const app of ['word', 'powerpoint', 'excel']) {
    const nume = `B ${app} 1366px: clic de mouse pe panglica, apoi tastatura fizica scrie in document`;
    const { ctx, p, erori } = await deschide(browser, base, app, LAB);
    try {
      if (app === 'powerpoint') {
        /* intai clic in titlul diapozitivului 1 (caseta in care se scrie) */
        const t = await p.evaluate(() => { const e = document.querySelector('[data-lh-aplicatie="powerpoint"] [data-lh-tinta="forma"][data-lh-id="1/1"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
        if (!t) throw new Error('nu gasesc titlul diapozitivului 1');
        await p.mouse.click(t.x, t.y); await pauza(300);
      }
      if (app === 'excel') await p.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); });
      if (app === 'word') await p.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); });
      /* numele grupului Font (nu face nimic in Office: un loc „gol” al panglicii) */
      const g = await p.evaluate(a => {
        const gr = [...document.querySelectorAll(`[data-lh-aplicatie="${a}"] .lh-ap-sus [data-lh-tip="Group"]`)].find(x => (x.getAttribute('data-lh-eticheta') || '') === 'Font' && x.getBoundingClientRect().width > 0);
        if (!gr) return null;
        const r = gr.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.bottom - 6 };
      }, app);
      if (!g) throw new Error('nu gasesc grupul Font');
      await p.mouse.click(g.x, g.y); await pauza(300);
      const f1 = await focusAcum(p);
      await p.keyboard.type('qzx'); await pauza(300);
      const ok = await p.evaluate(a => {
        const st = window.LH.aplicatii.stare(a);
        if (a === 'word') return (st.text || []).join('\n').includes('qzx');
        if (a === 'powerpoint') return JSON.stringify(st.forme_diapozitiv || st.diapozitive || '').includes('qzx');
        return JSON.stringify(st).includes('qzx');
      }, app);
      scrie(eIntrare(f1) && ok && !erori.length, nume, `focus dupa clic ${f1}; „qzx” ${ok ? 'a ajuns' : 'NU a ajuns'} in document${erori.length ? '; ' + erori.join(' | ') : ''}`);
    } catch (e) { scrie(false, nume, 'EROARE ' + String(e.message).split('\n')[0]); }
    await ctx.close();
  }

  /* ---------- C: bara de derulare a panglicii */
  if (DOAR.includes('C')) for (const app of ['word', 'excel', 'powerpoint']) {
    for (const [eticheta, opt] of [['1366px', LAB], ['360px', TELEFON]]) {
      const { ctx, p, erori } = await deschide(browser, base, app, opt);
      try {
        const b = await banda(p, app);
        scrie(b.bara === 0, `C ${app} ${eticheta}: nicio bara de derulare vizibila sub panglica`, `bara ${b.bara.toFixed(1)} px, panglica depaseste fereastra cu ${b.depasire.toFixed(0)} px`);
        await p.evaluate(a => { document.querySelector(`[data-lh-aplicatie="${a}"] .lh-ap-sus`).scrollLeft = 0; }, app);
        let cum;
        if (opt === LAB) {
          cum = 'rotita (fara Shift)';
          await p.mouse.move(b.x + b.w / 2, b.y + b.h * 0.62); await pauza(100);
          await p.mouse.wheel(0, 240); await pauza(400);
        } else {
          cum = 'degetul';
          await tragereDeget(p, b);
        }
        const b1 = await banda(p, app);
        scrie(b.depasire > 0 && b1.sl > 0 && !erori.length, `C ${app} ${eticheta}: panglica se deruleaza cu ${cum}`,
          `scrollLeft ${b1.sl.toFixed(0)} din ${b.depasire.toFixed(0)}${erori.length ? '; ' + erori.join(' | ') : ''}`);
      } catch (e) { scrie(false, `C ${app} ${eticheta}`, 'EROARE ' + String(e.message).split('\n')[0]); }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  srv.close();
}
console.log(nFail);
