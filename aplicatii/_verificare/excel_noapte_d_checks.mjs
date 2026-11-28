// Verificarile constructorului B din noaptea 27->28.11.2026 (Excel: pictograma planșetei din meniul de clic dreapta, literele
// coloanelor pe telefon, Excel la 360 px), dupa modelul excel_noapte_c_checks.mjs. Scrise INAINTEA reparatiilor (au picat pe 520da0e7).
// Constructorii urmatori ADAUGA verificari la sfarsitul listei VERIFICARI, fara sa le rescrie pe cele de dinainte.
// Rulare:  node aplicatii/_verificare/excel_noapte_d_checks.mjs   (din orice director)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node); NOAPTE_FILTRU=<prefix> = doar unele.
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL. Totul headless, reteaua din afara lui 127.0.0.1 oprita.
// Gesturile sunt jucate (mouse, taste, deget prin Playwright); starea se citeste din DOM si din LH.aplicatii.stare('excel').
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
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
function scrie(stare, nume, detalii) {
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`.replace(/\s*\n\s*/g, ' '));
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const j = v => JSON.stringify(v);
const APP = '[data-lh-aplicatie="excel"]';
const TELEFON = { viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };
const CALCULATOR = { viewport: { width: 1366, height: 768 } };
/* lecția legată folosită la proba din chenar (aceeași cheie și același drum parcurs ca în lectie_m1-l04.mjs) */
const LECTIE = { url: '/lectii/viii/m1-l04/index.html?pas=p2', cheie: 'lectie_viii_m1_l04', parcurs: { ps: [0, 1, 2, 3, 4, 5, 6, 7], pn: 8, at: 1, re: 1, qm: 5 } };

async function deschidePoligon(p, base) {
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(APP, { timeout: 15000 });
  await p.waitForFunction(() => { try { const s = window.LH.aplicatii.stare('excel'); return !!(s && s.celule && s.celule.A1); } catch (e) { return false; } }, null, { timeout: 15000 });
  await pauza(500);
}
async function deschideLectia(p, base) {
  await p.goto(base + LECTIE.url, { waitUntil: 'load' });
  await p.waitForFunction(() => window.JocMotor && JocMotor.test.stare() && document.getElementById('body'), null, { timeout: 15000 });
  await p.evaluate(() => JocMotor.test.exercitiu(0));
  const viz = p.getByRole('button', { name: /doar vizitez/ });
  if (await viz.count()) await viz.first().click().catch(() => {});
  await p.waitForSelector(`#body ${APP} [data-lh-tinta="celula"]`, { timeout: 20000 });
  await pauza(1200);
}

/* marginea stângă a literei N față de marginea stângă a celulei N<rand>, pentru literele care se văd în bandă */
const decalaje = (p, rand) => p.evaluate(rand => {
  const A = document.querySelector('[data-lh-aplicatie="excel"]');
  const banda = A.querySelector('.lh-ap-x-ant-c').getBoundingClientRect();
  const o = {};
  A.querySelectorAll('[data-lh-tinta="antet_coloana"]').forEach(h => {
    const b = h.getBoundingClientRect();
    if (b.right <= banda.left + 1 || b.left >= banda.right - 1) return;
    const c = A.querySelector(`[data-lh-tinta="celula"][data-lh-id="${h.getAttribute('data-lh-id')}${rand}"]`);
    if (c) o[h.getAttribute('data-lh-id')] = Math.round((b.left - c.getBoundingClientRect().left) * 10) / 10;
  });
  return o;
}, rand);
const aliniat = o => Object.keys(o).length >= 2 && Object.values(o).every(d => Math.abs(d) <= 1);
/* derularea foii cu degetul: atingeri adevărate (CDP Input.dispatchTouchEvent: apăsare, 10 mișcări, ridicare) pe celule; dx > 0 =
   degetul merge spre stânga (foaia arată coloanele din dreapta). Input.synthesizeScrollGesture NU derulează în Chrome fără fereastră. */
async function gliseazaFoaia(p, ctx, dx) {
  const b = await p.locator(`${APP} .lh-ap-x-corp`).boundingBox();
  const cdp = await ctx.newCDPSession(p);
  const x = Math.round(b.x + b.width / 2 + dx / 2), y = Math.round(b.y + b.height / 2);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: Math.round(x - i * dx / 10), y }] }); await pauza(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  await pauza(500);
}

/* câte rânduri întregi se văd (numărul rândului întreg în cutia grilei și în ecran) + textele interfeței tăiate la margine.
   Nu intră: celulele / literele / numerele (foaia se derulează) și panglica cu rândul filelor ei (se derulează lateral, perimetrul
   altui constructor: panglica.js). Un text e „tăiat” când iese din cutia care îl taie (strămoșii cu overflow ≠ visible + aplicația +
   ecranul) dar o parte din el se vede. */
const masoara = p => p.evaluate(() => {
  const A = document.querySelector('[data-lh-aplicatie="excel"]');
  const corp = A.querySelector('.lh-ap-x-corp'), cb = corp.getBoundingClientRect(), ab = A.getBoundingClientRect();
  const jos = Math.min(cb.bottom, innerHeight), sus = Math.max(cb.top, 0);
  const randuri = [...A.querySelectorAll('[data-lh-tinta="antet_rand"]')].filter(h => { const b = h.getBoundingClientRect(); return b.height > 0 && b.top >= sus - 0.5 && b.bottom <= jos + 0.5; }).length;
  const taiate = [];
  const w = document.createTreeWalker(A, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue;
    const e = n.parentElement;
    if (e.closest('.lh-ap-x-corp,.lh-ap-x-ant-c,.lh-ap-x-ant-r,[data-lh-suprafata^="panglica"],[data-lh-suprafata="file_panglicii"]')) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const rr = rg.getBoundingClientRect();
    if (rr.width < 1 || rr.height < 1) continue;
    let L = Math.max(ab.left, 0), R = Math.min(ab.right, innerWidth), T = ab.top, B = ab.bottom;
    for (let q = e; q && q !== A.parentElement; q = q.parentElement) {
      const s = getComputedStyle(q), b = q.getBoundingClientRect();
      if (s.overflowX !== 'visible') { L = Math.max(L, b.left); R = Math.min(R, b.right); }
      if (s.overflowY !== 'visible') { T = Math.max(T, b.top); B = Math.min(B, b.bottom); }
    }
    if (!(rr.right > L + 0.5 && rr.left < R - 0.5 && rr.bottom > T + 0.5 && rr.top < B - 0.5)) continue;
    /* acoperit de un vecin opac (ex. Zoom peste „Accessibility”): ce e deasupra mijlocului părții care se vede */
    const mx = (Math.max(rr.left, L) + Math.min(rr.right, R)) / 2, my = (Math.max(rr.top, T) + Math.min(rr.bottom, B)) / 2;
    const sus2 = document.elementFromPoint(mx, my);
    const acoperit = sus2 && !e.contains(sus2) && !sus2.contains(e);
    if (rr.left < L - 0.5 || rr.right > R + 0.5 || acoperit) {
      const sup = e.closest('[data-lh-suprafata]');
      taiate.push(`${t.slice(0, 28)} [${sup ? sup.getAttribute('data-lh-suprafata') : '?'}] ${Math.round(rr.left)}-${Math.round(rr.right)} în ${Math.round(L)}-${Math.round(R)}${acoperit ? ' acoperit' : ''}`);
    }
  }
  const parti = [...A.children].map(c => { const b = c.getBoundingClientRect(); return Math.round(b.top - ab.top) + '+' + Math.round(b.height); });
  return { randuri, taiate, corp: [Math.round(cb.top - ab.top), Math.round(cb.height), Math.round(cb.width)], app: [Math.round(ab.height), Math.round(ab.width)], parti };
});

const VERIFICARI = [
  // ---------------------------------------------------------------- 1. meniul de clic dreapta: Paste Options = pictograma planșetei
  { nume: 'd1 clic dreapta pe celulă: sub „Paste Options:” prima pictogramă e planșeta (aceeași cu Paste din panglică), clicul pe ea lipește', ecran: CALCULATOR, fn: async (p) => {
    const lipit = await p.evaluate(() => { const s = window.LH.aplicatii.stare('excel'); return s.celule.A1 && s.celule.A1.valoare; });
    await p.locator(`${APP} [data-lh-tinta="celula"][data-lh-id="A1"]`).click(); await pauza(150);
    await p.keyboard.press('Control+c'); await pauza(200);
    await p.locator(`${APP} [data-lh-tinta="celula"][data-lh-id="C6"]`).click({ button: 'right' }); await pauza(300);
    const r = await p.evaluate(() => {
      const A = document.querySelector('[data-lh-aplicatie="excel"]');
      const m = A.querySelector('[data-lh-suprafata="meniu_contextual.celula"]');
      if (!m) return { err: 'meniul nu s-a deschis' };
      const g = [...m.querySelectorAll('[data-lh-eticheta="Paste Options"]')].pop();
      const prima = g && g.querySelector('[data-lh-tip="ListItem"]');
      if (!prima) return { err: 'nu e niciun buton sub Paste Options' };
      const d = x => x ? [...x.querySelectorAll('path')].map(q => q.getAttribute('d')).join('|') : '';
      const ico = prima.querySelector('svg.lh-ap-ico');
      const pang = A.querySelector('[data-lh-id-mso="Paste"] svg.lh-ap-ico');
      const b = ico ? ico.getBoundingClientRect() : null;
      return { eticheta: prima.getAttribute('data-lh-eticheta'), gol: !!prima.querySelector('.lh-ap-gol'), are: !!ico, aceeasi: !!ico && !!pang && d(ico) === d(pang), marime: b ? [Math.round(b.width), Math.round(b.height)] : null };
    });
    if (r.err) return { ok: false, det: r.err };
    const b = await p.locator(`${APP} [data-lh-suprafata="meniu_contextual.celula"] [data-lh-tip="ListItem"]`).first().boundingBox();
    await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await pauza(300);
    const c6 = await p.evaluate(() => { const c = window.LH.aplicatii.stare('excel').celule.C6; return c ? c.valoare : null; });
    return { ok: r.are && !r.gol && r.aceeasi && r.marime && r.marime[0] >= 14 && c6 === lipit, det: `pictograma ${r.are ? 'da' : 'NU'} (pătrățel gol: ${r.gol}), aceeași cu Paste din panglică: ${r.aceeasi}, mărimea ${j(r.marime)}; după clic C6 = ${j(c6)} (A1 = ${j(lipit)})` };
  } },
  // ---------------------------------------------------------------- 2. telefon: literele coloanelor rămân deasupra celulelor lor
  { nume: 'd2 telefon 360 px: atingi litera F (pe jumătate în afara ecranului), apoi glisezi foaia; fiecare literă stă la ±1 px deasupra coloanei ei', ecran: TELEFON, fn: async (p, ctx) => {
    const d0 = await decalaje(p, 5);
    await p.locator(`${APP} [data-lh-tinta="antet_coloana"][data-lh-id="F"]`).tap(); await pauza(600);
    const sel = await p.evaluate(() => JSON.stringify(window.LH.aplicatii.stare('excel').selectie));
    const d1 = await decalaje(p, 5);
    await gliseazaFoaia(p, ctx, 160);
    const d2 = await decalaje(p, 5);
    const lit = await p.evaluate(() => document.querySelector('[data-lh-aplicatie="excel"] .lh-ap-x-corp').scrollLeft);
    return { ok: aliniat(d0) && aliniat(d1) && aliniat(d2) && /F1:F1048576|F:F/.test(sel) && lit > 0,
      det: `înainte ${j(d0)}; după atingerea lui F ${j(d1)} (selecția ${sel}); după glisarea foii (${Math.round(lit)} px) ${j(d2)}` };
  } },
  { nume: 'd2 telefon 360 px: atingi litera C, apoi cercul ⇔ de lângă ea, apoi glisezi foaia de două ori; literele rămân aliniate', ecran: TELEFON, fn: async (p, ctx) => {
    await p.locator(`${APP} [data-lh-tinta="antet_coloana"][data-lh-id="C"]`).tap(); await pauza(600);
    const d1 = await decalaje(p, 5);
    const cerc = p.locator(`${APP} .lh-ap-x-cerc`);
    if (await cerc.count()) { await cerc.first().tap(); await pauza(700); }
    const d2 = await decalaje(p, 5);
    await gliseazaFoaia(p, ctx, 200);
    const d3 = await decalaje(p, 5);
    await gliseazaFoaia(p, ctx, -120);
    const d4 = await decalaje(p, 5);
    return { ok: aliniat(d1) && aliniat(d2) && aliniat(d3) && aliniat(d4), det: `după C ${j(d1)}; după cerc ${j(d2)}; după glisări ${j(d3)} / ${j(d4)}` };
  } },
  // ---------------------------------------------------------------- 3. Excel la 360 px: mai multe rânduri, niciun text tăiat; 1366 neschimbat
  { nume: 'd3 telefon 360 px, poligon: se văd cel puțin 8 rânduri întregi și niciun text al interfeței nu e tăiat la margine', ecran: TELEFON, fn: async (p) => {
    const m = await masoara(p);
    return { ok: m.randuri >= 8 && !m.taiate.length, det: `${m.randuri} rânduri (grila ${j(m.corp)}, aplicația ${j(m.app)}); tăiate: ${m.taiate.length ? m.taiate.join(' | ') : 'niciunul'}` };
  } },
  { nume: 'd3 telefon 360 px, chenarul lecției viii/m1-l04: se văd cel puțin 8 rânduri întregi și niciun text al interfeței nu e tăiat la margine', ecran: TELEFON, lectie: true, fn: async (p) => {
    await p.evaluate(() => document.querySelector('#body [data-lh-aplicatie="excel"]').scrollIntoView({ block: 'start' })); await pauza(400);
    const m = await masoara(p);
    return { ok: m.randuri >= 8 && !m.taiate.length, det: `${m.randuri} rânduri (grila ${j(m.corp)}, aplicația ${j(m.app)}); tăiate: ${m.taiate.length ? m.taiate.join(' | ') : 'niciunul'}` };
  } },
  { nume: 'd3 calculator 1366 px, poligon: Excel arată ca înainte (aceleași benzi, 24 de rânduri, grila 472 px)', ecran: CALCULATOR, fn: async (p) => {
    const m = await masoara(p);
    /* măsurat pe 520da0e7: app [768,1366], benzile 1+180 / 179+565 / 744+23 față de aplicație, grila [240,472,1349] */
    const bun = j(m.app) === j([768, 1366]) && j(m.parti) === j(['1+180', '179+565', '744+23']) && m.randuri === 24 && m.corp[1] === 472;
    return { ok: bun, det: `aplicația ${j(m.app)}, benzile ${j(m.parti)}, ${m.randuri} rânduri, grila ${j(m.corp)}` };
  } },
];

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const v of VERIFICARI.filter(x => !process.env.NOAPTE_FILTRU || x.nume.startsWith(process.env.NOAPTE_FILTRU))) {
      let ctx = null;
      try {
        ctx = await browser.newContext(v.ecran);
        await ctx.route('**/*', r => { const u = new URL(r.request().url()); return (u.hostname === '127.0.0.1' || u.hostname === 'localhost') ? r.continue() : r.abort(); });
        if (v.lectie) await ctx.addInitScript(([k, lv]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ nume: '', lv: { 0: lv } })); } catch (e) { /* */ } }, [LECTIE.cheie, LECTIE.parcurs]);
        const p = await ctx.newPage();
        p.setDefaultTimeout(8000);
        const erori = [];
        p.on('pageerror', e => erori.push(e.message));
        if (v.lectie) await deschideLectia(p, base); else await deschidePoligon(p, base);
        const r = await Promise.race([v.fn(p, ctx), new Promise((_, rej) => setTimeout(() => rej(new Error('timp depasit (40 s)')), 40000))]);
        scrie(r.ok && !erori.length ? 'PASS' : 'FAIL', v.nume, r.det + (erori.length ? ` [eroare in pagina: ${erori[0].slice(0, 120)}]` : ''));
      } catch (e) { scrie('FAIL', v.nume, 'a crapat: ' + (e && e.message ? e.message.split('\n')[0] : String(e))); }
      finally { if (ctx) await ctx.close().catch(() => {}); }
    }
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => { console.log('FAIL eroare la rulare - ' + e.message); console.log('1'); process.exitCode = 0; });
