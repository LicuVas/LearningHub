// Probe de paritate Excel, felia a (noaptea 22->23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_excel_22_11/felii/felie_a.json  (26 de randuri).
// O proba = gestul elevului jucat in browser (clicuri, taste, deget reale prin Playwright, pe elemente vizibile),
// apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('excel'). Tinta = Excelul real (interfata EN);
// unde vechiul simulator difera, castiga Excelul real (comentariu de un rand la proba).
// Rulare:  node aplicatii/_verificare/excel_paritate_a.mjs   (din orice director; caile se afla singure)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: o linie PASS / FAIL / SKIP pe proba; ultimele trei linii: REZUMAT, TOTAL FAIL, numarul de FAIL.
// Totul headless; reteaua din afara lui 127.0.0.1 e oprita (ctx.route).
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

const rez = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, id, nume, det) {
  rez[stare]++;
  console.log(`${stare} ${id} ${nume}${det ? ' - ' + det : ''}`.replace(/\s*\n\s*/g, ' '));
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const LIMITA = 20000;                       // pe fiecare context de browser al unei probe
const R = '[data-lh-aplicatie="excel"]';
// tinta canonica, in ambele forme din api_biblioteca.md §3 (fel + data-lh-id sau „fel:valoare”), doar vizibila
const sel = (fel, val) => val == null ? `${R} [data-lh-tinta="${fel}"]:visible`
  : `${R} [data-lh-tinta="${fel}"][data-lh-id="${val}"]:visible, ${R} [data-lh-tinta="${fel}:${val}"]:visible`;
const RE_PASTE = /^(Paste|Keep Text Only)( \(P\))?$/;       // randul de lipire din meniul de clic dreapta
const RE_DEL_CEL = /^Delete(\.\.\.|…)$/;

// ---------- modelul stergerilor: ce trebuie sa ajunga unde (valorile, pe adrese)
const litera = c => { let s = ''; c++; while (c) { const m = (c - 1) % 26; s = String.fromCharCode(65 + m) + s; c = Math.floor((c - 1) / 26); } return s; };
const dec = a => { const m = /^([A-Z]+)(\d+)$/.exec(a); let c = 0; for (const ch of m[1]) c = c * 26 + ch.charCodeAt(0) - 64; return { c: c - 1, r: +m[2] }; };
const enc = (r, c) => litera(c) + r;
function zona(z) {                          // 'B2:C3' | 'B2' | '3' | '3:4' | 'C' | 'C:D'
  const [a, b = a] = z.split(':');
  if (/^\d+$/.test(a)) return { r0: +a, r1: +b, c0: 0, c1: 1e4 };
  if (/^[A-Z]+$/.test(a)) return { r0: 1, r1: 1e7, c0: dec(a + '1').c, c1: dec(b + '1').c };
  const p = dec(a), q = dec(b);
  return { r0: Math.min(p.r, q.r), r1: Math.max(p.r, q.r), c0: Math.min(p.c, q.c), c1: Math.max(p.c, q.c) };
}
function valori(s) {
  const o = {};
  for (const [a, x] of Object.entries((s && s.celule) || {})) if (x && x.valoare !== '' && x.valoare != null) o[a] = x.valoare;
  return o;
}
function aplica(v, tip, z) {
  const op = zona(z), o = {};
  for (const [a, val] of Object.entries(v)) {
    let { r, c } = dec(a);
    const inR = r >= op.r0 && r <= op.r1, inC = c >= op.c0 && c <= op.c1;
    if (tip === 'randuri') { if (inR) continue; if (r > op.r1) r -= op.r1 - op.r0 + 1; }
    else if (tip === 'coloane') { if (inC) continue; if (c > op.c1) c -= op.c1 - op.c0 + 1; }
    else if (tip === 'sus') { if (inC) { if (inR) continue; if (r > op.r1) r -= op.r1 - op.r0 + 1; } }
    else if (tip === 'stanga') { if (inR) { if (inC) continue; if (c > op.c1) c -= op.c1 - op.c0 + 1; } }
    o[enc(r, c)] = val;
  }
  return o;
}
function diferente(asteptat, real) {
  const d = [];
  for (const a of new Set([...Object.keys(asteptat), ...Object.keys(real)])) {
    if (String(asteptat[a] ?? '') !== String(real[a] ?? '')) d.push(`${a} trebuia ${JSON.stringify(asteptat[a] ?? '')}, este ${JSON.stringify(real[a] ?? '')}`);
  }
  return d;
}
const normF = f => (f || '').replace(/\s+/g, '').toUpperCase();

// ---------- unelte legate de o pagina
function unelte(p, erori, deschideAlt) {
  const u = {
    p, erori,
    alt: deschideAlt,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('excel')),
    loc: (fel, val) => p.locator(sel(fel, val)).first(),
    cel: a => p.locator(sel('celula', a)).first(),
    mso: id => p.locator(`${R} [data-lh-id-mso="${id}"]:visible`).first(),
    async clic(loc, ce, opt) {
      try { await loc.click(opt); } catch (e) { throw new Error(`nu pot apăsa ${ce} (${e.message.split('\n')[0].slice(0, 80)})`); }
      await pauza(opt && opt.pauza != null ? opt.pauza : 120);
    },
    clicCel: async (a, opt) => u.clic(u.cel(a), 'celula ' + a, { ...(opt || {}), pauza: 80 }),
    async scrieCel(a, v) { await u.clicCel(a); await p.keyboard.type(String(v)); await p.keyboard.press('Enter'); await pauza(70); },
    async zona(a, b) { await u.clicCel(a); await u.clic(u.cel(b), 'celula ' + b, { modifiers: ['Shift'], pauza: 100 }); },
    async fila(nume) { const l = p.locator(sel('fila', nume)); if (await l.count()) await u.clic(l.first(), 'fila ' + nume, { pauza: 200 }); },
    // mesajele „aici nu e simulată” vizibile (doar cele care pomenesc comanda, daca e data)
    nesim: (cuvant) => p.evaluate(([R, cuvant]) => {
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      return [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(viz).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 110))
        .filter(t => !cuvant || t.includes(cuvant));
    }, [R, cuvant || null]),
    // tine minte ce e vizibil acum; „noi” = ce devine vizibil dupa
    marcheaza: () => p.evaluate(R => {
      const s = new WeakSet();
      for (const e of document.querySelector(R).querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) s.add(e); }
      window.__probaVechi = s;
    }, R),
    // cel mai bun element vizibil a carui eticheta / tinta / aria-label / text propriu se potriveste cu re
    gaseste: (re, opt = {}) => p.evaluate(([R, src, fl, noi]) => {
      const re = new RegExp(src, fl);
      const root = document.querySelector(R), vechi = window.__probaVechi;
      const viz = e => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
      let best = null, bs = -1;
      for (const e of root.querySelectorAll('*')) {
        if (noi && vechi && vechi.has(e)) continue;
        if (!viz(e)) continue;
        const ti = e.getAttribute('data-lh-tinta') || '';
        const tv = ti.includes(':') ? ti.slice(ti.indexOf(':') + 1) : (e.getAttribute('data-lh-id') || '');
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        const cand = [e.getAttribute('data-lh-eticheta'), tv, e.getAttribute('aria-label'), own].filter(Boolean);
        if (!cand.some(c => re.test(c.trim()))) continue;
        const r = e.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const sus = document.elementFromPoint(cx, cy);
        const scor = (sus && (e === sus || e.contains(sus)) ? 8 : 0) + (ti ? 4 : 0) + (e.hasAttribute('data-lh-eticheta') ? 2 : 0) - r.width * r.height / 1e6;
        if (scor > bs) { bs = scor; best = { x: cx, y: cy, w: r.width, h: r.height, tinta: ti, eticheta: e.getAttribute('data-lh-eticheta'), text: own }; }
      }
      return best;
    }, [R, re.source, re.flags, !!opt.noi]),
    async clicEt(re, opt = {}) {
      const g = await u.gaseste(re, opt);
      if (!g) return null;
      if (opt.tap) await p.touchscreen.tap(g.x, g.y);
      else await p.mouse.click(g.x, g.y, opt.dreapta ? { button: 'right' } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 180);
      return g;
    },
    textNoi: () => p.evaluate(R => {
      const vechi = window.__probaVechi, out = [];
      for (const e of document.querySelector(R).querySelectorAll('*')) {
        if (vechi && vechi.has(e)) continue;
        const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        if (own) out.push(own);
        const et = e.getAttribute('data-lh-eticheta'); if (et) out.push(et);
      }
      return out.join(' | ');
    }, R),
    textPagina: () => p.evaluate(() => document.body.innerText),
    textCel: a => p.evaluate(([R, a]) => { const e = document.querySelector(`${R} [data-lh-tinta="celula"][data-lh-id="${a}"], ${R} [data-lh-tinta="celula:${a}"]`); return e ? e.innerText.trim() : null; }, [R, a]),
    latime: async lit => { const b = await u.loc('antet_coloana', lit).boundingBox(); return b ? b.width : NaN; },
    inaltime: async r => { const b = await u.loc('antet_rand', String(r)).boundingBox(); return b ? b.height : NaN; },
    // latimea textului unei celule, cu fontul ei (canvas nelegat de pagina)
    latimeText: a => p.evaluate(([R, a]) => {
      const c = document.querySelector(`${R} [data-lh-tinta="celula"][data-lh-id="${a}"], ${R} [data-lh-tinta="celula:${a}"]`);
      if (!c) return NaN;
      const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let el = c;
      while (w.nextNode()) if (w.currentNode.textContent.trim()) { el = w.currentNode.parentElement; break; }
      const cs = getComputedStyle(el), cx = document.createElement('canvas').getContext('2d');
      cx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      return cx.measureText(c.innerText.trim()).width;
    }, [R, a]),
    // culoarea de fundal vazuta a unei celule (prima nenula din celula si copiii ei), ca #RRGGBB, sau null
    fundal: a => p.evaluate(([R, a]) => {
      const c = document.querySelector(`${R} [data-lh-tinta="celula"][data-lh-id="${a}"], ${R} [data-lh-tinta="celula:${a}"]`);
      if (!c) return null;
      for (const e of [c, ...c.querySelectorAll('*')]) {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(getComputedStyle(e).backgroundColor);
        if (m && (m[4] == null || +m[4] > 0.5)) { const h = [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('').toUpperCase(); if (h !== 'FFFFFF') return '#' + h; }
      }
      return null;
    }, [R, a]),
    grosime: a => p.evaluate(([R, a]) => {
      const c = document.querySelector(`${R} [data-lh-tinta="celula"][data-lh-id="${a}"], ${R} [data-lh-tinta="celula:${a}"]`);
      if (!c) return 0;
      const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let el = c;
      while (w.nextNode()) if (w.currentNode.textContent.trim()) { el = w.currentNode.parentElement; break; }
      return +getComputedStyle(el).fontWeight || (getComputedStyle(el).fontWeight === 'bold' ? 700 : 400);
    }, [R, a]),
    // graficele de pe foaie, din DOM: numar, titlul vazut, textele vazute (fara titlu) cu pozitia in grafic
    grafice: () => p.evaluate(R => {
      const root = document.querySelector(R);
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const gr = [...root.querySelectorAll('[data-lh-tinta]')].filter(e => {
        const t = e.getAttribute('data-lh-tinta'), id = e.getAttribute('data-lh-id');
        return (t === 'grafic' && /^\d+$/.test(id || '')) || /^grafic:\d+$/.test(t);
      }).filter(viz);
      return gr.map(g => {
        const n = g.getAttribute('data-lh-id') && /^\d+$/.test(g.getAttribute('data-lh-id')) ? g.getAttribute('data-lh-id') : g.getAttribute('data-lh-tinta').split(':')[1];
        const tEl = root.querySelector(`[data-lh-tinta="grafic:${n}/titlu"], [data-lh-tinta="grafic"][data-lh-id="${n}/titlu"]`);
        const r = g.getBoundingClientRect(), texte = [];
        const w = document.createTreeWalker(g, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const s = w.currentNode.textContent.trim(); if (!s) continue;
          const el = w.currentNode.parentElement; if ((tEl && tEl.contains(el)) || !viz(el)) continue;
          const q = el.getBoundingClientRect(); texte.push({ s, y: (q.y + q.height / 2 - r.y) / r.height });
        }
        return { n: +n, titlu: tEl && viz(tEl) ? tEl.innerText.trim() : null, texte };
      }).sort((a, b) => a.n - b.n);
    }, R),
    // un maner mic (cercul ⇔ / ⇕) aparut langa marginea unui antet dupa atingere (pe telefon): element vizibil NOU
    // (fata de marcheaza() de dinainte de atingere), 12-70 px, la cel mult 24 px de margine; bara de derulare nu se pune
    manerLanga: (x, y, ax) => p.evaluate(([R, x, y, ax]) => {
      let best = null, bd = 1e9; const vechi = window.__probaVechi;
      for (const e of document.querySelector(R).querySelectorAll('*')) {
        if (vechi && vechi.has(e)) continue;
        const r = e.getBoundingClientRect(); if (r.width < 12 || r.height < 12 || r.width > 70 || r.height > 70) continue;
        const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (/^(celula|antet_coloana|antet_rand|derulare)/.test(e.getAttribute('data-lh-tinta') || '')) continue;
        const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const d = ax === 'x' ? Math.abs(cx - x) : Math.abs(cy - y), dl = ax === 'x' ? Math.abs(cy - y) : Math.abs(cx - x);
        if (d <= 24 && dl <= 40 && d + dl < bd) { bd = d + dl; best = { x: cx, y: cy }; }
      }
      return best;
    }, [R, x, y, ax]),
    async trageDeget(x0, y0, x1, y1) {
      const cdp = await p.context().newCDPSession(p);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
      for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 8, y: y0 + (y1 - y0) * i / 8 }] }); await pauza(25); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await cdp.detach();
      await pauza(250);
    },
    async trageMouse(x0, y0, x1, y1, inainteDeSus) {
      await p.mouse.move(x0, y0); await p.mouse.down();
      await p.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, { steps: 4 });
      await p.mouse.move(x1, y1, { steps: 4 });
      await pauza(120);
      const r = inainteDeSus ? await inainteDeSus() : null;
      await p.mouse.up(); await pauza(250);
      return r;
    },
    // o stergere: valorile de dinainte, gestul, apoi comparatia cu modelul
    async stergeCu(tip, z, gest) {
      const v0 = valori(await u.st());
      try { await gest(); } catch (e) { return [e.message]; }
      await pauza(200);
      const v1 = valori(await u.st());
      const d = diferente(aplica(v0, tip, z), v1);
      if (d.length) { const ns = await u.nesim(); if (ns.length) d.unshift('mesaj: ' + ns[ns.length - 1]); }
      return d;
    },
    // clic dreapta pe celula › Delete… › optiunea › OK
    async delDialog(a, optiune) {
      await u.clicCel(a); await u.marcheaza();
      await u.clic(u.cel(a), 'celula ' + a + ' (clic dreapta)', { button: 'right', pauza: 250 });
      if (!(await u.clicEt(RE_DEL_CEL, { noi: true }))) throw new Error('meniul de clic dreapta n-are Delete…');
      if (!(await u.clicEt(optiune, { noi: true }))) throw new Error('fereastra Delete n-are „' + optiune.source.replace(/[\^$\\]/g, '') + '”');
      if (!(await u.clicEt(/^OK$/, { noi: true }))) throw new Error('fereastra Delete n-are OK');
    },
    // lista Number Format › un format
    async alegeFormatNumar(re) {
      await u.marcheaza();
      await u.clic(u.loc('meniu_derulant', 'Home/Number/Number Format'), 'Number Format ▾', { pauza: 300 });
      const ns = await u.nesim();
      if (ns.length) { await p.keyboard.press('Escape'); return { ok: false, motiv: 'lista Number Format nu se deschide (' + ns[0] + ')' }; }
      const g = await u.clicEt(re, { noi: true });
      if (!g) { await p.keyboard.press('Escape'); return { ok: false, motiv: 'în lista Number Format nu e „' + re.source.replace(/[\^$\\b]|\(\?!.*?\)/g, '') + '”' }; }
      return { ok: true };
    },
    casetaFormat: () => p.evaluate(R => {
      const e = [...document.querySelectorAll(R + ' [data-lh-tip="ComboBox"][data-lh-eticheta="Number Format"]')].find(x => x.getBoundingClientRect().width > 0);
      if (!e) return null; const i = e.querySelector('input'); return ((i && i.value) || e.innerText || '').trim();
    }, R),
    async insereazaGrafic(a, b, galerie, tip) {
      await u.clicCel(a); await u.zona(a, b); await u.fila('Insert');
      await u.marcheaza();
      await u.clic(u.loc('meniu_derulant', 'Insert/Charts/' + galerie), galerie + ' ▾', { pauza: 250 });
      const g = await u.clicEt(new RegExp('^' + tip.replace(/[()]/g, '\\$&') + '$'), { noi: true });
      await pauza(250);
      return !!g;
    },
    async schimbaTipul(tip) {           // Chart Design › Change Chart Type... › tip › OK
      await u.fila('Chart Design'); await u.marcheaza();
      await u.clic(u.mso('ChartChangeType'), 'Change Chart Type...', { pauza: 300 });
      if (!(await u.clicEt(new RegExp('^' + tip + '$'), { noi: true }))) return false;
      return !!(await u.clicEt(/^OK$/, { noi: true }));
    },
    async eticheteDate(pozitie) {       // Chart Design › Add Chart Element › Data Labels › pozitie
      await u.fila('Chart Design'); await u.marcheaza();
      await u.clic(u.loc('meniu_derulant', 'Chart Design/Chart Layouts/Add Chart Element'), 'Add Chart Element ▾', { pauza: 250 });
      if (!(await u.clicEt(/^Data Labels$/, { noi: true }))) return 'Add Chart Element n-are Data Labels';
      const ns = await u.nesim('Data Labels');
      if (ns.length) return ns[0];
      if (!(await u.clicEt(new RegExp('^' + pozitie + '$'), { noi: true }))) return 'Data Labels n-are „' + pozitie + '”';
      return null;
    },
  };
  return u;
}

async function deschide(browser, base, tel, contexte) {
  const ctx = await browser.newContext(tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
  contexte.push(ctx);
  ctx.setDefaultTimeout(5000);
  ctx.setDefaultNavigationTimeout(15000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0].slice(0, 120)));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(R, { timeout: 12000 });
  await p.waitForFunction(() => { try { return !!window.LH.aplicatii.stare('excel').celule; } catch (e) { return false; } }, null, { timeout: 12000 });
  await pauza(400);
  return unelte(p, erori, () => deschide(browser, base, true, contexte));
}

function cuTimp(promise, ms) {
  let t;
  return Promise.race([promise, new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`timp depășit (${ms / 1000} s)`)), ms); })]).finally(() => clearTimeout(t));
}

async function ruleaza(browser, base, pr) {
  if (pr.skip) { rez.SKIP++; console.log(`SKIP ${pr.id} - ${pr.skip}`); return; }
  const contexte = [];
  const t0 = Date.now();
  try {
    const probleme = await cuTimp((async () => {
      const u = await deschide(browser, base, !!pr.tel, contexte);
      const pb = (await pr.fn(u)) || [];
      const er = [...new Set(contexte.length ? u.erori : [])];
      if (er.length) pb.push('eroare în pagină: ' + er.slice(0, 2).join(' | '));
      return pb;
    })(), LIMITA * (pr.contexte || 1));
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    if (probleme.length === 0) scrie('PASS', pr.id, pr.nume, (pr.ok || 'merge') + ` (${sec} s)`);
    else scrie('FAIL', pr.id, pr.nume, probleme.join('; '));
  } catch (e) {
    scrie('FAIL', pr.id, pr.nume, 'proba a crăpat: ' + e.message.split('\n')[0].slice(0, 200));
  } finally {
    for (const c of contexte) await c.close().catch(() => {});
  }
}

// ================= probele (in ordinea feliei) =================
const PROBE = [];
const proba = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, ...opt });

// ---- Afisarea in celula
proba('excel-a-F144', 'Lățește singur coloana la o dată tastată și la un format mai lung (Long Date, Accounting)', async u => {
  const pb = [];
  const wE0 = await u.latime('E');
  await u.scrieCel('E5', '27.09.2026');
  let s = await u.st(); const tE = (s.celule.E5 || {}).text ?? ''; const wE = await u.latime('E');
  if (/#/.test(tE) || wE <= wE0 + 2) pb.push(`data tastată în E5 se vede „${tE}”, coloana E ${Math.round(wE0)}→${Math.round(wE)} px (trebuia lățită singură, fără ####)`);
  // exercițiul m1-l06:236: Long Date pe o dată, fără #### (coloana nelățită de mână)
  await u.scrieCel('F1', '09.10.2026');
  const wF0 = await u.latime('F');
  await u.clicCel('F1');
  const ld = await u.alegeFormatNumar(/^Long Date\b/);
  if (!ld.ok) pb.push('Long Date: ' + ld.motiv);
  else {
    s = await u.st(); const t = (s.celule.F1 || {}).text ?? ''; const wF = await u.latime('F');
    if (/#/.test(t) || !/2026/.test(t) || wF <= wF0 + 2) pb.push(`Long Date pe F1: se vede „${t}”, coloana F ${Math.round(wF0)}→${Math.round(wF)} px`);
  }
  await u.scrieCel('G1', '123456');
  const wG0 = await u.latime('G');
  await u.clicCel('G1');
  await u.clic(u.mso('InternationalCurrency'), 'Accounting Number Format', { pauza: 250 });
  s = await u.st(); const tG = (s.celule.G1 || {}).text ?? ''; const wG = await u.latime('G'); const ns = await u.nesim('Accounting');
  if (ns.length) pb.push('Accounting: ' + ns[0]);
  else if (/#/.test(tG) || wG <= wG0 + 2) pb.push(`Accounting pe G1 (123456): se vede „${tG}”, coloana G ${Math.round(wG0)}→${Math.round(wG)} px`);
  return pb;
}, { ok: 'data tastată, Long Date și Accounting lățesc coloana, fără ####' });

// ---- Aliniere
proba('excel-a-F119', 'Aliniere verticală: Middle / Top / Bottom Align', async u => {
  const pb = [];
  const vert = f => { for (const [k, v] of Object.entries(f || {})) { const sv = String(v); if (/vert/i.test(k)) return sv; if (/^(top|middle|bottom|sus|mijloc|jos)$/i.test(sv)) return sv; } return ''; };
  await u.clicCel('A1');
  for (const [mso, eti, re] of [['AlignMiddleExcel', 'Middle Align', /middle|mijloc|centru|center/i], ['AlignTopExcel', 'Top Align', /top|sus/i], ['AlignBottomExcel', 'Bottom Align', /bottom|jos|^$/i]]) {
    await u.clic(u.mso(mso), eti, { pauza: 220 });
    const ns = await u.nesim(eti); const v = vert(((await u.st()).format_celule || {}).A1);
    if (ns.length) pb.push(`${eti}: ${ns[0]}`);
    else if (!re.test(v)) pb.push(`${eti}: alinierea verticală a lui A1 în stare = „${v || 'nimic'}”`);
  }
  return pb;
}, { ok: 'Middle, Top, Bottom se pun pe A1 (implicit jos)' });

proba('excel-a-F121', 'Merge & Center: avertisment OK/Cancel, păstrează stânga-sus, al doilea clic desface, o celulă doar centrează', async u => {
  const pb = [];
  const lat = async a => ((await u.cel(a).boundingBox()) || { width: 0 }).width;
  const AV = /only keeps the upper-left value/i;
  await u.zona('A1', 'C1');                         // A1:C1 = Elev, Nota 1, Nota 2: trei valori
  await u.marcheaza();
  await u.clic(u.mso('MergeCenter'), 'Merge & Center', { pauza: 300 });
  if (!AV.test(await u.textPagina())) pb.push('A1:C1 cu trei valori: nu apare avertismentul „Merging cells only keeps the upper-left value…” (OK / Cancel)');
  else {
    if (!(await u.clicEt(/^Cancel$/, { noi: true }))) pb.push('avertismentul n-are Cancel');
    else { const s = await u.st(); if ((await lat('A1')) > 100 || (s.celule.C1 || {}).valoare !== 'Nota 2') pb.push('după Cancel zona s-a îmbinat totuși'); }
    await u.marcheaza();
    await u.clic(u.mso('MergeCenter'), 'Merge & Center (a doua oară)', { pauza: 300 });
    if (!(await u.clicEt(/^OK$/, { noi: true }))) pb.push('avertismentul n-are OK');
  }
  let s = await u.st(); const w = await lat('A1'); const f = JSON.stringify((s.format_celule || {}).A1 || {});
  if (!((s.celule.A1 || {}).valoare === 'Elev' && !(s.celule.B1 || {}).valoare && !(s.celule.C1 || {}).valoare && w > 150 && /centr|center/i.test(f)))
    pb.push(`după OK: A1=${JSON.stringify((s.celule.A1 || {}).valoare)} B1=${JSON.stringify((s.celule.B1 || {}).valoare ?? '')} C1=${JSON.stringify((s.celule.C1 || {}).valoare ?? '')}, A1 lată de ${Math.round(w)} px, format ${f}`);
  await u.clicCel('A1');
  await u.clic(u.mso('MergeCenter'), 'Merge & Center (desfacere)', { pauza: 250 });
  if ((await lat('A1')) > 100) pb.push('al doilea clic pe Merge & Center nu desface celula îmbinată');
  // doar F1 are valoare: Excelul real o păstrează în celula îmbinată, fără avertisment
  await u.scrieCel('F1', 'Titlu');
  await u.zona('E1', 'G1');
  await u.clic(u.mso('MergeCenter'), 'Merge & Center pe E1:G1', { pauza: 300 });
  if (AV.test(await u.textPagina())) { pb.push('E1:G1 cu o singură valoare: n-ar trebui avertisment'); await u.clicEt(/^OK$/); }
  s = await u.st();
  if ((s.celule.E1 || {}).valoare !== 'Titlu') pb.push(`E1:G1 cu valoare doar în F1: celula îmbinată arată „${(s.celule.E1 || {}).text ?? ''}” (Excel păstrează „Titlu”)`);
  await u.scrieCel('H3', 'x');
  await u.clicCel('H3');
  await u.clic(u.mso('MergeCenter'), 'Merge & Center pe o celulă', { pauza: 250 });
  s = await u.st(); const fh = JSON.stringify((s.format_celule || {}).H3 || {});
  if (!/centr|center/i.test(fh)) pb.push(`pe o singură celulă (H3) Merge & Center nu centrează (format ${fh})`);
  return pb;
}, { ok: 'avertisment, Cancel/OK, desfacere, stânga-sus goală, o celulă' });

// ---- Copiere, mutare, stergere (lectia 4)
proba('excel-b-F112', 'Clic dreapta pe celulă: Cut, Copy, Paste, Delete…, Clear Contents (zona rămâne)', async u => {
  const pb = []; const p = u.p;
  await u.zona('B2', 'C3');
  await u.marcheaza();
  await u.clic(u.cel('C3'), 'C3 (clic dreapta)', { button: 'right', pauza: 250 });
  let s = await u.st();
  if ((s.selectie || {}).zona !== 'B2:C3') pb.push(`clic dreapta în zonă a schimbat selecția în ${(s.selectie || {}).zona}`);
  const lips = [];
  for (const [n, re] of [['Cut', /^Cut$/], ['Copy', /^Copy$/], ['Paste', RE_PASTE], ['Delete...', RE_DEL_CEL], ['Clear Contents', /^Clear Contents$/]]) if (!(await u.gaseste(re, { noi: true }))) lips.push(n);
  if (lips.length) pb.push('meniul n-are: ' + lips.join(', '));
  await u.clicEt(/^Copy$/, { noi: true });
  await u.marcheaza();
  await u.clic(u.cel('E2'), 'E2 (clic dreapta)', { button: 'right', pauza: 250 });
  if (!(await u.clicEt(RE_PASTE, { noi: true }))) pb.push('după Copy, meniul de pe E2 n-are Paste');
  let v = valori(await u.st());
  if (!(v.E2 === 9 && v.F2 === 10 && v.E3 === 7 && v.F3 === 8)) pb.push(`Copy › Paste din meniu: E2:F3 = ${[v.E2, v.F2, v.E3, v.F3].join(',')} (trebuia 9,10,7,8)`);
  await p.keyboard.press('Escape');
  await u.clicCel('E2'); await u.marcheaza();
  await u.clic(u.cel('E2'), 'E2 (clic dreapta)', { button: 'right', pauza: 250 });
  await u.clicEt(/^Clear Contents$/, { noi: true });
  if (valori(await u.st()).E2 != null) pb.push('Clear Contents din meniu n-a golit E2');
  await u.clicCel('F3'); await u.marcheaza();
  await u.clic(u.cel('F3'), 'F3 (clic dreapta)', { button: 'right', pauza: 250 });
  await u.clicEt(/^Cut$/, { noi: true });
  await u.marcheaza();
  await u.clic(u.cel('G6'), 'G6 (clic dreapta)', { button: 'right', pauza: 250 });
  await u.clicEt(RE_PASTE, { noi: true });
  v = valori(await u.st());
  if (!(v.G6 === 8 && v.F3 == null)) pb.push(`Cut › Paste din meniu: G6=${v.G6 ?? 'gol'}, F3=${v.F3 ?? 'gol'} (trebuia 8, gol)`);
  await p.keyboard.press('Escape');
  const d = await u.stergeCu('sus', 'B2', () => u.delDialog('B2', /^Shift cells up$/));   // exercițiul m1-l04:594
  if (d.length) pb.push('Delete… › Shift cells up › OK: ' + d.slice(0, 3).join('; '));
  return pb;
}, { ok: 'zona rămâne; Copy/Paste, Clear Contents, Cut/Paste, Delete… din meniu' });

proba('excel-b-F113', 'Clic dreapta pe antetul rândului / coloanei: Cut, Copy, Paste, Delete, Clear Contents', async u => {
  const pb = []; const p = u.p;
  await u.scrieCel('E1', '=B4*2');
  await u.marcheaza();
  await u.clic(u.loc('antet_rand', '2'), 'numărul rândului 2 (clic dreapta)', { button: 'right', pauza: 250 });
  const lips = [];
  for (const [n, re] of [['Cut', /^Cut$/], ['Copy', /^Copy$/], ['Paste', RE_PASTE], ['Delete', /^Delete$/], ['Clear Contents', /^Clear Contents$/]]) if (!(await u.gaseste(re, { noi: true }))) lips.push(n);
  if (lips.length) pb.push('meniul antetului n-are: ' + lips.join(', '));
  await u.clicEt(/^Copy$/, { noi: true });
  await u.marcheaza();
  await u.clic(u.loc('antet_rand', '6'), 'numărul rândului 6 (clic dreapta)', { button: 'right', pauza: 250 });
  await u.clicEt(RE_PASTE, { noi: true });
  let v = valori(await u.st());
  if (!(v.A6 === 'Ana' && v.B6 === 9 && v.C6 === 10)) pb.push(`rândul 2 copiat pe 6: A6:C6 = ${[v.A6, v.B6, v.C6].join(',')}`);
  await p.keyboard.press('Escape');
  await u.marcheaza();
  await u.clic(u.loc('antet_rand', '6'), 'numărul rândului 6 (clic dreapta)', { button: 'right', pauza: 250 });
  await u.clicEt(/^Clear Contents$/, { noi: true });
  v = valori(await u.st());
  if (v.A6 != null || v.B6 != null) pb.push('Clear Contents pe rândul 6 nu l-a golit');
  const d1 = await u.stergeCu('randuri', '3', async () => {
    await u.marcheaza();
    await u.clic(u.loc('antet_rand', '3'), 'numărul rândului 3 (clic dreapta)', { button: 'right', pauza: 250 });
    if (!(await u.clicEt(/^Delete$/, { noi: true }))) throw new Error('meniul n-are Delete');
  });
  if (d1.length) pb.push('rândul 3 › Delete: ' + d1.slice(0, 3).join('; '));
  const d2 = await u.stergeCu('coloane', 'C', async () => {
    await u.marcheaza();
    await u.clic(u.loc('antet_coloana', 'C'), 'litera C (clic dreapta)', { button: 'right', pauza: 250 });
    if (!(await u.clicEt(/^Delete$/, { noi: true }))) throw new Error('meniul n-are Delete');
  });
  if (d2.length) pb.push('coloana C › Delete: ' + d2.slice(0, 3).join('; '));
  return pb;
}, { ok: 'meniul antetului copiază, lipește, golește, șterge rândul și coloana' });

proba('excel-b-F116', 'Home › Delete (partea de sus): rânduri / coloane întregi sau celule după forma zonei', async u => {
  const pb = [];
  await u.scrieCel('E1', '=B4*2');
  const del = () => u.clic(u.mso('CellsDeleteSmart'), 'Home › Delete', { pauza: 250 });
  const d1 = await u.stergeCu('randuri', '3', async () => { await u.clic(u.loc('antet_rand', '3'), 'numărul rândului 3'); await del(); });   // exercițiul m1-l04:617
  if (d1.length) pb.push('rândul 3 selectat › Delete: ' + d1.slice(0, 3).join('; '));
  const f = normF(((await u.st()).celule.E1 || {}).formula);
  if (!d1.length && f !== '=B3*2') pb.push(`după ștergerea rândului 3 formula din E1 e ${f} (trebuia =B3*2)`);
  const d2 = await u.stergeCu('coloane', 'C', async () => { await u.clic(u.loc('antet_coloana', 'C'), 'litera C'); await del(); });
  if (d2.length) pb.push('coloana C selectată › Delete: ' + d2.slice(0, 3).join('; '));
  // zona mai lată decât înaltă → celulele urcă; mai înaltă decât lată → vin din dreapta (Range.Delete fără Shift: „decide după forma zonei”)
  const d3 = await u.stergeCu('sus', 'B2:C2', async () => { await u.zona('B2', 'C2'); await del(); });
  if (d3.length) pb.push('B2:C2 › Delete (trebuie în sus): ' + d3.slice(0, 3).join('; '));
  const d4 = await u.stergeCu('stanga', 'A2:A3', async () => { await u.zona('A2', 'A3'); await del(); });
  if (d4.length) pb.push('A2:A3 › Delete (trebuie la stânga): ' + d4.slice(0, 3).join('; '));
  return pb;
}, { ok: 'rând, coloană, zonă lată (sus), zonă înaltă (stânga)' });

proba('excel-b-F117', 'Lista Delete ▾: Delete Cells…, Delete Sheet Rows, Delete Sheet Columns', async u => {
  const pb = [];
  await u.scrieCel('E1', '=B4*2');
  const lista = async (re, ce) => {
    await u.marcheaza();
    await u.clic(u.loc('meniu_derulant', 'Home/Cells/Delete'), 'Delete ▾', { pauza: 250 });
    if (!(await u.clicEt(re, { noi: true }))) throw new Error('lista Delete ▾ n-are ' + ce);
  };
  const d1 = await u.stergeCu('coloane', 'C', async () => { await u.clicCel('C2'); await lista(/^Delete Sheet Columns$/, 'Delete Sheet Columns'); });   // exercițiul m1-l04:591
  if (d1.length) pb.push('C2 › Delete Sheet Columns: ' + d1.slice(0, 3).join('; '));
  const d2 = await u.stergeCu('randuri', '3', async () => { await u.clicCel('B3'); await lista(/^Delete Sheet Rows$/, 'Delete Sheet Rows'); });
  if (d2.length) pb.push('B3 › Delete Sheet Rows: ' + d2.slice(0, 3).join('; '));
  if (!d1.length && !d2.length) { const f = normF(((await u.st()).celule.D1 || {}).formula); if (f !== '=B3*2') pb.push(`formula mutată în D1 e ${f} (trebuia =B3*2)`); }
  try {
    await u.clicCel('B2'); await lista(/^Delete Cells(\.\.\.|…)$/, 'Delete Cells...');
    if (!(await u.gaseste(/^Shift cells up$/, { noi: true }))) pb.push('Delete Cells... nu deschide fereastra Delete (Shift cells up …)');
    await u.clicEt(/^Cancel$/, { noi: true });
  } catch (e) { pb.push(e.message); }
  return pb;
}, { ok: 'coloana și rândul din listă; Delete Cells... deschide fereastra' });

proba('excel-b-F118', 'Fereastra Delete: Shift cells left / up, Entire row, Entire column', async u => {
  const pb = [];
  for (const [tip, z, cel, re, ce] of [['stanga', 'B2', 'B2', /^Shift cells left$/, 'Shift cells left'], ['sus', 'B2', 'B2', /^Shift cells up$/, 'Shift cells up'], ['randuri', '3', 'B3', /^Entire row$/, 'Entire row'], ['coloane', 'C', 'C2', /^Entire column$/, 'Entire column']]) {
    const d = await u.stergeCu(tip, z, () => u.delDialog(cel, re));
    if (d.length) pb.push(`${cel} › Delete… › ${ce} › OK: ` + d.slice(0, 3).join('; '));
  }
  return pb;
}, { ok: 'toate cele patru opțiuni șterg corect' });

// ---- Editare
proba('excel-a-F027', 'Paste din meniu și din Home; Paste ▾ deschide lista; Paste e gri cât nu e nimic copiat', async u => {
  const pb = []; const p = u.p;
  const gri = () => p.evaluate(R => { const e = [...document.querySelectorAll(R + ' [data-lh-id-mso="Paste"]')].find(x => x.getBoundingClientRect().width > 0); return e ? e.getAttribute('aria-disabled') === 'true' : null; }, R);
  if ((await gri()) !== true) pb.push('fără nimic copiat, Paste (planșeta) nu e gri');
  await u.clicCel('B2');
  await u.clic(u.mso('Copy'), 'Home › Copy');
  if ((await gri()) === true) pb.push('după Copy, Paste a rămas gri');
  await u.clicCel('E2');
  await u.clic(u.mso('Paste'), 'Home › Paste', { pauza: 250 });
  if (valori(await u.st()).E2 !== 9) pb.push(`Home › Paste: E2=${valori(await u.st()).E2 ?? 'gol'} (trebuia 9)`);
  await u.clicCel('E3'); await u.marcheaza();
  await u.clic(u.cel('E3'), 'E3 (clic dreapta)', { button: 'right', pauza: 250 });
  if (!(await u.clicEt(RE_PASTE, { noi: true }))) pb.push('meniul de clic dreapta n-are Paste');
  else if (valori(await u.st()).E3 !== 9) pb.push(`clic dreapta › Paste: E3=${valori(await u.st()).E3 ?? 'gol'}`);
  await u.clicCel('E4'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Home/Clipboard/Paste'), 'Paste ▾', { pauza: 300 });
  const ns = await u.nesim('Paste');
  if (ns.length) pb.push('Paste ▾: ' + ns[0]);
  else if (!(await u.clicEt(/^(Paste|Values)( \(\w\))?$/, { noi: true }))) pb.push('Paste ▾ nu deschide o listă cu Paste / Values');
  else if (valori(await u.st()).E4 !== 9) pb.push(`Paste ▾ › Paste: E4=${valori(await u.st()).E4 ?? 'gol'}`);
  return pb;
}, { ok: 'gri fără copiere; Home › Paste, meniu › Paste, Paste ▾ › listă' });

proba('excel-a-F032', 'Șterge rândul întreg: clic dreapta pe 3 › Delete (rândurile de dedesubt urcă, formulele se mută)', async u => {
  const pb = [];
  await u.scrieCel('E1', '=B4*2');
  const d = await u.stergeCu('randuri', '3', async () => {
    await u.marcheaza();
    await u.clic(u.loc('antet_rand', '3'), 'numărul rândului 3 (clic dreapta)', { button: 'right', pauza: 250 });
    if (!(await u.clicEt(/^Delete$/, { noi: true }))) throw new Error('meniul n-are Delete');
  });
  if (d.length) pb.push(d.slice(0, 4).join('; '));
  const s = await u.st(); const f = normF((s.celule.E1 || {}).formula);
  if (f !== '=B3*2') pb.push(`formula din E1 e ${f} (trebuia =B3*2, B4 a urcat în B3)`);
  if ((await u.textCel('A3')) !== 'Dan') pb.push(`pe ecran A3 arată „${await u.textCel('A3')}” (trebuia Dan)`);
  return pb;
}, { ok: 'Bogdan scos, Dan urcat în rândul 3, =B4*2 a devenit =B3*2' });

proba('excel-a-F033', 'Șterge coloana întreagă: clic dreapta pe C › Delete (coloanele din dreapta vin la stânga)', async u => {
  const pb = [];
  await u.scrieCel('D2', '5');
  await u.scrieCel('F1', '=D2*2');
  const d = await u.stergeCu('coloane', 'C', async () => {
    await u.marcheaza();
    await u.clic(u.loc('antet_coloana', 'C'), 'litera C (clic dreapta)', { button: 'right', pauza: 250 });
    if (!(await u.clicEt(/^Delete$/, { noi: true }))) throw new Error('meniul n-are Delete');
  });
  if (d.length) pb.push(d.slice(0, 4).join('; '));
  const f = normF(((await u.st()).celule.E1 || {}).formula);
  if (f !== '=C2*2') pb.push(`formula mutată în E1 e ${f} (trebuia =C2*2)`);
  if ((await u.textCel('C1')) !== 'Media') pb.push(`pe ecran C1 arată „${await u.textCel('C1')}” (trebuia Media)`);
  return pb;
}, { ok: 'coloana C scoasă, Media în C1, =D2*2 a devenit =C2*2' });

proba('excel-a-F034', 'Fereastra Delete…: Shift cells up (capcana C3)', async u => {
  const pb = [];
  await u.scrieCel('E1', '=C4*2');
  const d = await u.stergeCu('sus', 'C3', () => u.delDialog('C3', /^Shift cells up$/));   // exercițiul m1-l04:594
  if (d.length) pb.push(d.slice(0, 4).join('; '));
  const f = normF(((await u.st()).celule.E1 || {}).formula);
  if (f !== '=C3*2') pb.push(`formula din E1 e ${f} (trebuia =C3*2)`);
  if ((await u.textCel('C3')) !== '6') pb.push(`pe ecran C3 arată „${await u.textCel('C3')}” (trebuia 6, urcat din C4)`);
  return pb;
}, { ok: 'C4 a urcat în C3, B3 neatins, =C4*2 a devenit =C3*2' });

// ---- Foi
proba('excel-a-F149', 'Butonul + adaugă foaia după cea activă și o face activă; numele crește (după Sheet3 ștearsă vine Sheet4)', async u => {
  const pb = [];
  const add = () => u.clic(u.loc('fila_foii_buton', 'Add Sheet'), 'butonul + (Add Sheet)', { pauza: 250 });
  await add();
  let s = await u.st();
  if (JSON.stringify(s.foi) !== '["Sheet1","Sheet2"]' || s.foaie_activa !== 'Sheet2') pb.push(`primul +: foi ${JSON.stringify(s.foi)}, activă ${s.foaie_activa}`);
  await u.clic(u.loc('fila_foii', 'Sheet1'), 'fila Sheet1');
  await add();
  s = await u.st();
  if (JSON.stringify(s.foi) !== '["Sheet1","Sheet3","Sheet2"]' || s.foaie_activa !== 'Sheet3') pb.push(`+ cu Sheet1 activă: foi ${JSON.stringify(s.foi)}, activă ${s.foaie_activa} (trebuia Sheet3 imediat după Sheet1)`);
  await u.marcheaza();
  await u.clic(u.loc('fila_foii', 'Sheet3'), 'fila Sheet3 (clic dreapta)', { button: 'right', pauza: 250 });
  if (!(await u.clicEt(/^Delete$/, { noi: true }))) pb.push('meniul filei n-are Delete');
  if (/permanently delete/i.test(await u.textPagina())) await u.clicEt(/^Delete$/, { noi: true, pauza: 150 });   // confirmarea, dacă apare
  s = await u.st();
  if (s.foi.includes('Sheet3')) { pb.push('Sheet3 nu s-a șters: ' + JSON.stringify(s.foi)); return pb; }
  const a0 = s.foaie_activa, i0 = s.foi.indexOf(a0);
  await add();
  s = await u.st();
  // Excel (și vechiul) numără foile în sesiune: după Sheet3 ștearsă vine Sheet4, nu iar Sheet3
  if (!s.foi.includes('Sheet4') || s.foaie_activa !== 'Sheet4' || s.foi.indexOf('Sheet4') !== i0 + 1) pb.push(`după ștergerea lui Sheet3, + a dat foi ${JSON.stringify(s.foi)}, activă ${s.foaie_activa} (trebuia Sheet4, imediat după ${a0})`);
  else if (!(await u.p.locator(sel('fila_foii', 'Sheet4')).count())) pb.push('fila Sheet4 nu se vede');
  return pb;
}, { ok: 'Sheet2, Sheet3 după Sheet1, apoi Sheet4 după ștergere' });

// ---- Formatare: celula
proba('excel-a-F110', 'Fill Color: galben la început, apoi ultima culoare aleasă din paletă', async u => {
  const pb = []; const p = u.p;
  await u.zona('A1', 'C1');
  await u.clic(u.loc('panglica', 'Home/Font/Fill Color'), 'găleata Fill Color', { pauza: 250 });
  await u.clicCel('H12');
  const c1 = [await u.fundal('A1'), await u.fundal('C1')];
  if (c1[0] !== '#FFFF00' || c1[1] !== '#FFFF00') pb.push(`găleata pe A1:C1 a pus ${c1.join(', ')} (trebuia galben #FFFF00)`);
  await u.clicCel('E2'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Home/Font/Fill Color'), 'Fill Color ▾', { pauza: 300 });
  const ns = await u.nesim('Fill Color');
  if (ns.length) { pb.push('paleta Fill Color ▾: ' + ns[0]); return pb; }
  if (!(await u.clicEt(/^Green$/, { noi: true }))) { pb.push('paleta Fill Color ▾ n-are culoarea Green (Standard Colors)'); await p.keyboard.press('Escape'); return pb; }
  await u.clicCel('H12');
  const c2 = await u.fundal('E2');
  if (!c2 || c2 === '#FFFF00') pb.push(`Green din paletă a pus pe E2 ${c2 || 'nimic'}`);
  await u.clicCel('E4');
  await u.clic(u.loc('panglica', 'Home/Font/Fill Color'), 'găleata Fill Color', { pauza: 250 });
  await u.clicCel('H12');
  const c4 = await u.fundal('E4');
  if (c4 !== c2) pb.push(`după Green, găleata a pus ${c4 || 'nimic'} pe E4 (trebuia ultima culoare aleasă, ${c2})`);
  return pb;
}, { ok: 'galben, apoi Green din paletă, apoi găleata ține minte Green' });

// ---- Grafice
proba('excel-b-F028', 'Insert › Insert Pie or Doughnut Chart ▾ › Pie inserează graficul radial', async u => {
  const pb = [];
  await u.zona('A1', 'B4'); await u.fila('Insert'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Insert/Charts/Insert Pie or Doughnut Chart'), 'Insert Pie or Doughnut Chart ▾', { pauza: 300 });
  const ns = await u.nesim('Pie');
  if (ns.length) return [ns[0]];
  if (!(await u.clicEt(/^Pie$/, { noi: true }))) return ['galeria radialelor n-are Pie'];
  await pauza(200);
  const s = await u.st(); const g = await u.grafice();
  if (s.tip_grafic !== 'Pie' || JSON.stringify(s.categorii_grafic) !== '["Ana","Bogdan","Dan"]' || !g.length) pb.push(`după Pie: tip ${s.tip_grafic}, categorii ${JSON.stringify(s.categorii_grafic)}, grafice pe ecran ${g.length}`);
  return pb;
}, { ok: 'graficul radial inserat din galerie (Ana, Bogdan, Dan)' });

proba('excel-b-F032', 'Titlul și legenda puse singure la inserarea graficului', async u => {
  const pb = [];
  const ultimul = async () => { const g = await u.grafice(); return g[g.length - 1] || null; };
  const are = (g, s) => g.texte.filter(t => t.s === s);
  const jos = (g, s) => are(g, s).some(t => t.y > 0.6);
  // o serie cu nume: titlul = numele, fără legendă
  if (!(await u.insereazaGrafic('A1', 'B4', 'Insert Column or Bar Chart', 'Clustered Column'))) return ['nu pot insera Clustered Column'];
  let g = await ultimul();
  if (!g || g.titlu !== 'Nota 1' || are(g, 'Nota 1').length) pb.push(`A1:B4 (o serie „Nota 1”): titlul „${g && g.titlu}”, legendă ${g && are(g, 'Nota 1').length ? 'da' : 'nu'} (trebuia „Nota 1”, fără legendă)`);
  // două serii: „Chart Title” + legenda jos
  if (!(await u.insereazaGrafic('A1', 'C4', 'Insert Column or Bar Chart', 'Clustered Column'))) return pb.concat('nu pot insera al doilea grafic');
  g = await ultimul();
  if (!g || g.titlu !== 'Chart Title' || !jos(g, 'Nota 1') || !jos(g, 'Nota 2')) pb.push(`A1:C4 (două serii): titlul „${g && g.titlu}”, legenda jos cu Nota 1 și Nota 2: ${g && jos(g, 'Nota 1') && jos(g, 'Nota 2') ? 'da' : 'nu'}`);
  // o serie fără nume: Excelul real pune „Chart Title” și nicio legendă (vechiul punea legenda jos: abatere a vechiului)
  if (!(await u.insereazaGrafic('B2', 'B4', 'Insert Column or Bar Chart', 'Clustered Column'))) return pb.concat('nu pot insera al treilea grafic');
  g = await ultimul();
  if (!g || g.titlu !== 'Chart Title' || are(g, 'Series1').length) pb.push(`B2:B4 (o serie fără nume): titlul „${g && g.titlu}”, legendă ${g && are(g, 'Series1').length ? 'da' : 'nu'} (trebuia „Chart Title”, fără legendă)`);
  // radialul: legenda cu categoriile (din galeria Pie; dacă lipsește, Change Chart Type › Pie, tot drum din Excel)
  const n3 = (await u.grafice()).length;
  let pie = await u.insereazaGrafic('A1', 'B4', 'Insert Pie or Doughnut Chart', 'Pie');
  if (!pie || (await u.grafice()).length === n3) {
    await u.p.keyboard.press('Escape');
    pie = (await u.insereazaGrafic('A1', 'B4', 'Insert Column or Bar Chart', 'Clustered Column')) && (await u.schimbaTipul('Pie'));
  }
  g = await ultimul();
  if (!pie || !g) pb.push('nu pot face graficul radial');
  else if (g.titlu !== 'Nota 1' || !['Ana', 'Bogdan', 'Dan'].every(c => jos(g, c))) pb.push(`radialul: titlul „${g.titlu}”, legenda jos cu Ana, Bogdan, Dan: ${['Ana', 'Bogdan', 'Dan'].every(c => jos(g, c)) ? 'da' : 'nu'}`);
  return pb;
}, { ok: 'o serie: titlu = nume, fără legendă; două serii: Chart Title + legenda jos; fără nume: Chart Title; radial: legenda cu categoriile' });

proba('excel-b-F043', 'Etichetele de date pe graficul cu bare și pe cel radial (Add Chart Element › Data Labels)', async u => {
  const pb = [];
  const noua = async () => { const g = await u.grafice(); const x = g[g.length - 1]; return x ? x.texte.filter(t => t.s === '9').length : 0; };
  if (!(await u.insereazaGrafic('A1', 'B4', 'Insert Column or Bar Chart', 'Clustered Bar'))) return ['nu pot insera Clustered Bar'];
  const n0 = await noua();
  let m = await u.eticheteDate('Outside End');
  let s = await u.st();
  if (m) pb.push('bare: ' + m);
  else if ((s.etichete_date || {})['Nota 1'] !== 'Outside End' || (await noua()) <= n0) pb.push(`bare › Data Labels › Outside End: etichete_date ${JSON.stringify(s.etichete_date)}, eticheta „9” pe ecran: ${(await noua()) > n0 ? 'da' : 'nu'}`);
  if (!(await u.schimbaTipul('Pie'))) return pb.concat('nu pot schimba graficul în Pie (Change Chart Type)');
  s = await u.st();
  if (s.tip_grafic !== 'Pie') return pb.concat('după Change Chart Type tipul e ' + s.tip_grafic);
  m = await u.eticheteDate('Outside End');
  s = await u.st();
  if (m) pb.push('radial: ' + m);
  else if ((s.etichete_date || {})['Nota 1'] !== 'Outside End' || (await noua()) < 1) pb.push(`radial › Data Labels › Outside End: etichete_date ${JSON.stringify(s.etichete_date)}, eticheta „9” pe ecran: ${(await noua()) >= 1 ? 'da' : 'nu'}`);
  return pb;
}, { ok: 'Data Labels › Outside End pe bare și pe radial' });

// ---- Latime si inaltime
proba('excel-a-F133', 'Lățește coloana trăgând de linia literei (bula Width, mai multe coloane, cercul ⇔ pe telefon)', async u => {
  const pb = []; const p = u.p;
  const m = await u.loc('antet_coloana_margine', 'B').boundingBox().catch(() => null);
  const hb = await u.loc('antet_coloana', 'B').boundingBox();
  const x = m ? m.x + m.width / 2 : hb.x + hb.width, y = hb.y + hb.height / 2;
  const w0 = await u.latime('B');
  const bula = await u.trageMouse(x, y, x + 40, y, () => p.evaluate(() => /Width:\s*\d+([.,]\d+)?\s*\(\s*\d+\s*pixels?\s*\)/i.test(document.body.innerText)));
  const w1 = await u.latime('B');
  if (Math.abs(w1 - (w0 + 40)) > 8) pb.push(`tras 40 px de marginea lui B: ${Math.round(w0)}→${Math.round(w1)} px`);
  if (!bula) pb.push('în timpul tragerii nu apare bula „Width: … (… pixels)”');
  await u.clic(u.loc('antet_coloana', 'D'), 'litera D');
  await u.clic(u.loc('antet_coloana', 'E'), 'litera E', { modifiers: ['Shift'] });
  const me = await u.loc('antet_coloana_margine', 'E').boundingBox().catch(() => null);
  const he = await u.loc('antet_coloana', 'E').boundingBox();
  const xe = me ? me.x + me.width / 2 : he.x + he.width;
  const d0 = await u.latime('D'), e0 = await u.latime('E');
  await u.trageMouse(xe, y, xe + 30, y);
  const d1 = await u.latime('D'), e1 = await u.latime('E');
  if (Math.abs(d1 - (d0 + 30)) > 8 || Math.abs(e1 - (e0 + 30)) > 8) pb.push(`D:E selectate, tras de E cu 30 px: D ${Math.round(d0)}→${Math.round(d1)}, E ${Math.round(e0)}→${Math.round(e1)} (trebuiau amândouă)`);
  const v = valori(await u.st());
  if (v.B2 !== 9 || v.A3 !== 'Bogdan') pb.push('valorile s-au schimbat la lățire');
  // pe telefon: atingi litera, apoi tragi de cercul ⇔ de pe marginea ei (B: marginea ei e în ecran la 390 px)
  const t = await u.alt();
  await t.marcheaza();
  await t.loc('antet_coloana', 'B').tap(); await pauza(300);
  const hc = await t.loc('antet_coloana', 'B').boundingBox();
  const h = await t.manerLanga(hc.x + hc.width, hc.y + hc.height / 2, 'x');
  if (!h) pb.push('pe telefon, după atingerea literei B nu apare cercul ⇔ de tras');
  else {
    const c0 = ((await t.st()).latimi_coloane || {}).B || 64;
    await t.trageDeget(h.x, h.y, h.x + 60, h.y);
    const c1 = ((await t.st()).latimi_coloane || {}).B || 64;
    if (c1 < c0 + 10) pb.push(`pe telefon, tras de cerc 60 px: lățimea lui B ${c0}→${c1} px`);
  }
  if (t.erori.length) pb.push('eroare în pagina de telefon: ' + t.erori[0]);
  return pb;
}, { contexte: 2, ok: 'tragere, bula Width, D:E împreună, cercul ⇔ pe telefon' });

proba('excel-a-F134', 'Potrivește lățimea coloanei cu dublu-clic pe linia literei (mai multe coloane, coloana goală, două atingeri pe telefon)', async u => {
  const pb = [];
  const dublu = async lit => { const m = await u.loc('antet_coloana_margine', lit).boundingBox().catch(() => null); const hb = await u.loc('antet_coloana', lit).boundingBox(); await u.p.mouse.dblclick(m ? m.x + m.width / 2 : hb.x + hb.width, hb.y + hb.height / 2); await pauza(300); };
  await u.scrieCel('A5', 'Cristina Munteanu'); await u.scrieCel('B5', 'x');
  await dublu('A');
  const wA = await u.latime('A'), nA = await u.latimeText('A5');
  if (!(wA > 64 && wA >= nA + 2)) pb.push(`dublu-clic pe linia lui A: ${Math.round(wA)} px pentru un text de ${Math.round(nA)} px`);
  await u.scrieCel('E7', 'Observație foarte lungă aici'); await u.scrieCel('F7', 'Încă un text destul de lung'); await u.scrieCel('G7', 'x');
  await u.clic(u.loc('antet_coloana', 'E'), 'litera E');
  await u.clic(u.loc('antet_coloana', 'F'), 'litera F', { modifiers: ['Shift'] });
  await dublu('E');
  const wE = await u.latime('E'), wF = await u.latime('F'), nE = await u.latimeText('E7'), nF = await u.latimeText('F7');
  if (!(wE >= nE + 2)) pb.push(`E:F selectate, dublu-clic pe E: E ${Math.round(wE)} px pentru ${Math.round(nE)} px de text`);
  if (!(wF >= nF + 2)) pb.push(`E:F selectate, dublu-clic pe E: F ${Math.round(wF)} px pentru ${Math.round(nF)} px de text (trebuia potrivită și ea)`);
  // coloana goală, lățită de mână: dublu-clic o readuce la lățimea standard (64 px)
  const mh = await u.loc('antet_coloana_margine', 'H').boundingBox().catch(() => null);
  const hh = await u.loc('antet_coloana', 'H').boundingBox();
  const xh = mh ? mh.x + mh.width / 2 : hh.x + hh.width, yh = hh.y + hh.height / 2;
  await u.clicCel('J12');
  await u.trageMouse(xh, yh, xh + 50, yh);
  await dublu('H');
  const wH = await u.latime('H');
  if (Math.abs(wH - 64) > 3) pb.push(`coloana goală H, dublu-clic: ${Math.round(wH)} px (trebuia înapoi la 64)`);
  // pe telefon: atingi litera A, apoi atingi de două ori cercul ⇔
  const t = await u.alt();
  await t.scrieCel('A5', 'Cristina Munteanu'); await t.scrieCel('B5', 'x');
  await t.marcheaza();
  await t.loc('antet_coloana', 'A').tap(); await pauza(300);
  const ha = await t.loc('antet_coloana', 'A').boundingBox();
  const h = await t.manerLanga(ha.x + ha.width, ha.y + ha.height / 2, 'x');
  if (!h) pb.push('pe telefon, după atingerea literei A nu apare cercul ⇔');
  else {
    await t.p.touchscreen.tap(h.x, h.y); await pauza(80); await t.p.touchscreen.tap(h.x, h.y); await pauza(350);
    const a1 = ((await t.st()).latimi_coloane || {}).A || 64, na = await t.latimeText('A5');
    const z = (await t.latime('A')) / a1;                  // px pe ecran / px la 100%
    if (!(a1 * z >= na + 2 && a1 > 64)) pb.push(`pe telefon, două atingeri pe cerc: lățimea lui A ${a1} px`);
  }
  if (t.erori.length) pb.push('eroare în pagina de telefon: ' + t.erori[0]);
  return pb;
}, { contexte: 2, ok: 'A după nume, E:F împreună, H goală la standard, două atingeri pe telefon' });

proba('excel-a-F135', 'Face rândul mai înalt trăgând de linia de sub număr (mai multe rânduri, cercul ⇕ pe telefon)', async u => {
  const pb = [];
  const linie = async r => {
    const m = await u.p.locator(sel('antet_rand_margine', String(r))).first().boundingBox().catch(() => null);
    const b = await u.loc('antet_rand', String(r)).boundingBox();
    return m ? { x: m.x + m.width / 2, y: m.y + m.height / 2 } : { x: b.x + b.width / 2, y: b.y + b.height - 1 };
  };
  let q = await linie(1);
  await u.trageMouse(q.x, q.y, q.x, q.y + 22);
  let s = await u.st(); const h1 = (s.inaltimi_randuri || {})['1'], d1 = await u.inaltime(1);
  if (!(h1 >= 34 && d1 >= 34)) pb.push(`tras în jos 22 px sub rândul 1: înălțimea în stare ${h1 ?? 'standard'}, pe ecran ${Math.round(d1)} px (trebuia ≥ 25 pt = 34 px)`);
  await u.clic(u.loc('antet_rand', '3'), 'numărul 3');
  await u.clic(u.loc('antet_rand', '4'), 'numărul 4', { modifiers: ['Shift'] });
  q = await linie(4);
  await u.trageMouse(q.x, q.y, q.x, q.y + 15);
  s = await u.st(); const i3 = (s.inaltimi_randuri || {})['3'], i4 = (s.inaltimi_randuri || {})['4'];
  if (!(i3 >= 30 && i4 >= 30 && Math.abs(i3 - i4) <= 2)) pb.push(`rândurile 3:4 selectate, tras sub 4: înălțimi ${i3 ?? 'standard'} și ${i4 ?? 'standard'} (trebuiau amândouă mai mari)`);
  const t = await u.alt();
  await t.marcheaza();
  await t.loc('antet_rand', '1').tap(); await pauza(300);
  const b = await t.loc('antet_rand', '1').boundingBox();
  const h = await t.manerLanga(b.x + b.width / 2, b.y + b.height, 'y');
  if (!h) pb.push('pe telefon, după atingerea numărului 1 nu apare cercul ⇕');
  else {
    await t.trageDeget(h.x, h.y, h.x, h.y + 50);
    const r1 = ((await t.st()).inaltimi_randuri || {})['1'];
    if (!(r1 > 26)) pb.push(`pe telefon, tras de cerc 50 px: înălțimea rândului 1 = ${r1 ?? 'standard'}`);
  }
  if (t.erori.length) pb.push('eroare în pagina de telefon: ' + t.erori[0]);
  return pb;
}, { contexte: 2, ok: 'rândul 1 ≥ 25 pt, 3:4 împreună, cercul ⇕ pe telefon' });

// ---- Numar
proba('excel-a-F125', 'Lista Number Format: cele 11 formate, cu previzualizare; caseta arată numele formatului', async u => {
  const pb = [];
  await u.clicCel('B2');                                // 9
  await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Home/Number/Number Format'), 'Number Format ▾', { pauza: 300 });
  const ns = await u.nesim();
  if (ns.length) { await u.p.keyboard.press('Escape'); return ['lista Number Format: ' + ns[0]]; }
  const txt = await u.textNoi();
  const lips = ['General', 'Number', 'Currency', 'Accounting', 'Short Date', 'Long Date', 'Time', 'Percentage', 'Fraction', 'Scientific', 'Text'].filter(n => !txt.includes(n));
  if (lips.length) pb.push('lista n-are: ' + lips.join(', '));
  if (!/9[,.]00/.test(txt)) pb.push('lista nu arată cum ar arăta celula (lipsește „9,00” la Number)');
  if (!(await u.clicEt(/^Number(?! Format)\b/, { noi: true }))) { await u.p.keyboard.press('Escape'); pb.push('nu pot alege Number'); }
  else {
    const t = ((await u.st()).celule.B2 || {}).text; const c = await u.casetaFormat();
    if (!/^9[,.]00$/.test(t || '')) pb.push(`Number pe B2: se vede „${t}” (trebuia 9,00)`);
    if (!/^Number$/.test(c || '')) pb.push(`după Number caseta arată „${c}”`);
  }
  await u.scrieCel('F1', '09.10.2026'); await u.clicCel('F1');
  const ld = await u.alegeFormatNumar(/^Long Date\b/);
  if (!ld.ok) pb.push('Long Date: ' + ld.motiv);
  else { const t = ((await u.st()).celule.F1 || {}).text || ''; if (!/vineri|friday/i.test(t) || /#/.test(t)) pb.push(`Long Date pe 09.10.2026: se vede „${t}” (trebuia cu ziua săptămânii, vineri)`); }
  await u.clicCel('C2');                                // 10
  const pc = await u.alegeFormatNumar(/^Percentage\b/);
  if (!pc.ok) pb.push('Percentage: ' + pc.motiv);
  else { const t = ((await u.st()).celule.C2 || {}).text || ''; const c = await u.casetaFormat(); if (!/^1000[,.]00\s?%$/.test(t)) pb.push(`Percentage pe 10: se vede „${t}” (trebuia 1000,00%)`); if (!/^Percentage$/.test(c || '')) pb.push(`după Percentage caseta arată „${c}”`); }
  return pb;
}, { ok: 'cele 11 formate cu previzualizare; Number, Long Date, Percentage; caseta' });

proba('excel-a-F129', 'Increase Decimal după zecimalele celulei active: 7,5 → 7,50; 150 / 75,5 / 120 → 150,00 / 75,50 / 120,00', async u => {
  const pb = [];
  await u.scrieCel('E2', '150'); await u.scrieCel('E3', '75,5'); await u.scrieCel('E4', '120');
  await u.zona('E2', 'E4');
  await u.clic(u.mso('DecimalsIncrease'), 'Increase Decimal', { pauza: 200 });
  await u.clic(u.mso('DecimalsIncrease'), 'Increase Decimal', { pauza: 250 });
  const ns = await u.nesim('Increase Decimal');
  if (ns.length) return [ns[0]];
  let c = (await u.st()).celule; const tx = a => ((c[a] || {}).text || '').replace('.', ',');
  if (tx('E2') !== '150,00' || tx('E3') !== '75,50' || tx('E4') !== '120,00') pb.push(`E2:E4 după două clicuri: ${tx('E2')} / ${tx('E3')} / ${tx('E4')} (trebuia 150,00 / 75,50 / 120,00)`);
  if ((c.E2 || {}).valoare !== 150 || (c.E3 || {}).valoare !== 75.5) pb.push('valorile din spate s-au schimbat');
  await u.scrieCel('G2', '7,5'); await u.clicCel('G2');
  await u.clic(u.mso('DecimalsIncrease'), 'Increase Decimal', { pauza: 250 });
  c = (await u.st()).celule;
  if (tx('G2') !== '7,50') pb.push(`7,5 după un clic: „${tx('G2')}” (trebuia 7,50)`);
  return pb;
}, { ok: '150,00 / 75,50 / 120,00 și 7,50' });

// ---- Proiect (lantul)
proba('excel-b-F077', 'Lanțul pe aceeași foaie: formule → sortare → grafic (formatarea și graficul rămân)', async u => {
  const pb = [];
  // foaia de pornire a exercițiului (m2-l12:370, micșorată) vine prin API-ul public, ca într-o lecție; formulele le scrie elevul
  const start = { A1: 'Clasa', B1: 'Felicitari', C1: 'Pret', D1: 'Incasari', A2: '5A', B2: 30, C2: 4, A3: '5B', B3: 45, C3: 3, A4: '6A', B4: 25, C4: 5, A6: 'Total' };
  await u.p.evaluate(c => window.LH.aplicatii.deschide('excel', { loc: '[data-lh-aplicatie-loc]', continut: { celule: c }, focus: true }), start);
  await u.p.waitForFunction(() => { try { const s = window.LH.aplicatii.stare('excel'); return s.celule.A6 && s.celule.A6.valoare === 'Total'; } catch (e) { return false; } }, null, { timeout: 5000 });
  await pauza(200);
  for (const [a, v] of [['D2', '=B2*C2'], ['D3', '=B3*C3'], ['D4', '=B4*C4'], ['D6', '=SUM(D2:D4)']]) await u.scrieCel(a, v);
  await u.zona('A1', 'D1'); await u.clic(u.mso('Bold'), 'Bold');
  await u.clicCel('A3'); await u.clic(u.loc('panglica', 'Home/Font/Fill Color'), 'găleata Fill Color');   // rândul lui 5B, colorat
  // etapa 2 din m2-l12:388: clic pe D2, Data › Sort Largest to Smallest (pe fila Data: Sort Z to A)
  await u.clicCel('D2'); await u.fila('Data');
  await u.clic(u.mso('SortDescendingExcel'), 'Data › Sort Z to A', { pauza: 300 });
  let c = (await u.st()).celule;
  const val = a => (c[a] || {}).valoare, fo = a => normF((c[a] || {}).formula);
  if (!(val('A2') === '5B' && val('A3') === '6A' && val('A4') === '5A' && val('B2') === 45 && val('C2') === 3)) pb.push(`după sortare A2:A4 = ${val('A2')}, ${val('A3')}, ${val('A4')} (trebuia 5B, 6A, 5A, cu rândurile întregi)`);
  if (!(fo('D2') === '=B2*C2' && fo('D3') === '=B3*C3' && fo('D4') === '=B4*C4' && val('D2') === 135 && val('D4') === 120)) pb.push(`după sortare formulele D2:D4 = ${fo('D2')}, ${fo('D3')}, ${fo('D4')} (${val('D2')}, ${val('D3')}, ${val('D4')})`);
  if (fo('D6') !== '=SUM(D2:D4)' || val('D6') !== 380) pb.push(`totalul D6 = ${fo('D6')} (${val('D6')})`);
  await u.clicCel('H12');
  if ((await u.grosime('A1')) < 600) pb.push('capul de tabel nu mai e aldin după sortare');
  if ((await u.fundal('A2')) !== '#FFFF00' || (await u.fundal('A3')) === '#FFFF00') pb.push(`culoarea rândului 5B nu s-a mutat cu el (A2 ${await u.fundal('A2')}, A3 ${await u.fundal('A3')})`);
  // etapa 3: graficul cu coloane din A1:B4, cu titlul scris de mână
  if (!(await u.insereazaGrafic('A1', 'B4', 'Insert Column or Bar Chart', 'Clustered Column'))) return pb.concat('nu pot insera graficul');
  let s = await u.st();
  if (JSON.stringify(s.categorii_grafic) !== '["5B","6A","5A"]') pb.push(`graficul are categoriile ${JSON.stringify(s.categorii_grafic)} (trebuia ordinea sortată 5B, 6A, 5A)`);
  const tt = u.p.locator(sel('grafic', '1/titlu')).first();
  await u.clic(tt, 'titlul graficului'); await u.clic(tt, 'titlul graficului');
  await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('Felicitari vandute'); await u.p.keyboard.press('Enter'); await pauza(250);
  await u.scrieCel('F10', 'gata');
  const g = await u.grafice(); s = await u.st(); c = s.celule;
  if (!g.length || g[0].titlu !== 'Felicitari vandute') pb.push(`titlul graficului pe ecran: „${g.length ? g[0].titlu : 'fără grafic'}”`);
  if (JSON.stringify(s.foi) !== '["Sheet1"]' || (await u.grosime('A1')) < 600 || fo('D2') !== '=B2*C2') pb.push('după grafic foaia / formatarea / formulele nu mai sunt cele de dinainte');
  return pb;
}, { ok: 'formule, sortare legată, formatarea mutată cu rândul, grafic cu titlu, totul pe Sheet1' });

// ---- Registru: salvare
proba('excel-a-F183', 'Prima salvare (Ctrl+S): „Save this file”, File name, Choose a Location (Desktop, Documente, Descărcări), Save', async u => {
  const pb = []; const p = u.p;
  await u.clicCel('E5'); await u.marcheaza();
  await p.keyboard.press('Control+s'); await pauza(400);
  if (!/Save this file/.test(await u.textPagina()) || !(await p.locator(sel('camp', 'nume_fisier')).count())) return ['Ctrl+S nu deschide fereastra „Save this file” cu File name'];
  const cb = u.loc('camp', 'Choose a Location');
  if (!(await p.locator(sel('camp', 'Choose a Location')).count())) pb.push('fereastra n-are Choose a Location');
  else {
    await u.marcheaza();
    await u.clic(cb, 'Choose a Location', { pauza: 300 });
    let loc = await u.gaseste(/^(Documente|Documents)$/, { noi: true });
    if (!loc && !(await u.nesim()).length) { const b = await cb.boundingBox(); await p.mouse.click(b.x + b.width - 10, b.y + b.height / 2); await pauza(300); loc = await u.gaseste(/^(Documente|Documents)$/, { noi: true }); }
    const lips = [];
    if (!(await u.gaseste(/^Desktop$/, { noi: true }))) lips.push('Desktop');
    if (!loc) lips.push('Documente');
    if (!(await u.gaseste(/^(Descărcări|Downloads)$/, { noi: true }))) lips.push('Descărcări');
    const ns = await u.nesim('Location');
    if (lips.length) pb.push(`lista Choose a Location n-are: ${lips.join(', ')}${ns.length ? ' (' + ns[0] + ')' : ''}`);
    if (loc) await u.clicEt(/^(Documente|Documents)$/, { noi: true });
  }
  await u.clic(u.loc('camp', 'nume_fisier'), 'File name');
  await p.keyboard.press('Control+a'); await p.keyboard.type('lectia3');
  await u.clic(u.loc('dialog_salvare', 'Save'), 'Save', { pauza: 350 });
  const s = await u.st();
  if (s.nume_fisier !== 'lectia3.xlsx' || !/Document/.test(s.dosar_fisier || '') || !((s.fisiere || {}).Documente || []).includes('lectia3.xlsx')) pb.push(`după Save: fișier ${s.nume_fisier}, dosar ${s.dosar_fisier}, Documente ${JSON.stringify((s.fisiere || {}).Documente)}`);
  if (/Save this file/.test(await u.textPagina())) pb.push('fereastra a rămas deschisă după Save');
  return pb;
}, { ok: 'fereastra, lista de locuri, Documente ales, lectia3.xlsx salvat' });

proba('excel-a-F185', 'Prima salvare cu un nume care există: „… already exists” — renunțarea redeschide fereastra, confirmarea înlocuiește', async u => {
  const pb = []; const p = u.p;
  const cate = s => ((s.fisiere || {}).Documente || []).filter(n => n === 'Note clasa.xlsx').length;
  await u.clicCel('E5');
  await p.keyboard.press('Control+s'); await pauza(400);
  // locul propus de fereastră e Documents (acolo stă Note clasa.xlsx); alegerea locului e proba F183
  await u.clic(u.loc('camp', 'nume_fisier'), 'File name');
  await p.keyboard.press('Control+a'); await p.keyboard.type('Note clasa');
  await u.marcheaza();
  await u.clic(u.loc('dialog_salvare', 'Save'), 'Save', { pauza: 350 });
  if (!/already exists/i.test(await u.textPagina())) return ['Save cu „Note clasa” (există în Documente): nu apare „… already exists”'];
  // vechiul: [OK] [Anulare]; Excelul real (Confirm Save As): Yes / No — oricare pereche
  if (!(await u.clicEt(/^(No|Cancel|Anulare|Nu)$/, { noi: true }))) return ['întrebarea n-are buton de renunțare'];
  let s = await u.st();
  if (/already exists/i.test(await u.textPagina())) pb.push('întrebarea a rămas după renunțare');
  if (!(await p.locator(sel('camp', 'nume_fisier')).count())) pb.push('după renunțare fereastra de salvare nu mai e deschisă');
  if (s.nume_fisier || cate(s) !== 1) pb.push(`după renunțare: fișier ${s.nume_fisier}, Note clasa.xlsx de ${cate(s)} ori`);
  await u.marcheaza();
  await u.clic(u.loc('dialog_salvare', 'Save'), 'Save (a doua oară)', { pauza: 350 });
  if (!(await u.clicEt(/^(Yes|OK|Da|Replace)$/, { noi: true }))) return pb.concat('a doua oară întrebarea n-are buton de confirmare');
  s = await u.st();
  if (s.nume_fisier !== 'Note clasa.xlsx' || !/Document/.test(s.dosar_fisier || '') || cate(s) !== 1) pb.push(`după confirmare: fișier ${s.nume_fisier}, dosar ${s.dosar_fisier}, Note clasa.xlsx de ${cate(s)} ori`);
  return pb;
}, { ok: 'already exists; No lasă fereastra și fișierul; Yes înlocuiește' });

proba('excel-a-F187', 'Save As (F12): folderele, fișierele din folder, File name, Save as type', async u => {
  const pb = []; const p = u.p;
  await u.clicCel('E5');
  await p.keyboard.press('F12'); await pauza(400);
  if (!(await p.locator(sel('camp', 'nume_fisier')).count())) return ['F12 nu deschide Save As'];
  const lips = [];
  for (const [n, re] of [['Desktop', /^Desktop$/], ['Documente', /^(Documente|Documents)$/], ['Descărcări', /^(Descărcări|Downloads)$/]]) if (!(await u.gaseste(re))) lips.push(n);
  if (lips.length) pb.push('arborele n-are: ' + lips.join(', '));
  const doc = p.locator(sel('arbore', 'Documente')).first();
  if (await p.locator(sel('arbore', 'Documente')).count()) await u.clic(doc, 'Documente din arbore', { pauza: 300 });
  else await u.clicEt(/^(Documente|Documents)$/);
  const txt = await u.textPagina();
  if (!txt.includes('Note clasa.xlsx') || !txt.includes('Buget excursie.xlsx')) pb.push('lista din Documente nu arată Note clasa.xlsx și Buget excursie.xlsx');
  if (/element de listă/.test(txt)) pb.push('lista are rânduri „[element de listă, nesalvat]”');
  const tip = await p.locator(sel('camp', 'tip_fisier')).first().evaluate(e => { const s = e.tagName === 'SELECT' ? e : e.querySelector('select'); return s ? { n: s.options.length, csv: [...s.options].findIndex(o => /csv/i.test(o.text + o.value)), v: s.value } : null; }).catch(() => null);
  if (!tip || tip.n < 2 || tip.csv < 0) pb.push('Save as type nu are de unde alege (CSV …)');
  else {
    const loc = p.locator(sel('camp', 'tip_fisier')).first();
    const lsel = (await loc.evaluate(e => e.tagName)) === 'SELECT' ? loc : loc.locator('select');
    await lsel.selectOption({ index: tip.csv }); await pauza(150);
    const v2 = await lsel.evaluate(s => s.value);
    if (v2 === tip.v) pb.push('Save as type nu se schimbă');
    await lsel.selectOption({ index: 0 }); await pauza(150);
  }
  await u.clic(u.loc('camp', 'nume_fisier'), 'File name');
  await p.keyboard.press('Control+a'); await p.keyboard.type('robotica');
  const sv = (await p.locator(sel('buton', 'Save')).count()) ? u.loc('buton', 'Save') : u.loc('dialog_salvare', 'Save');
  await u.clic(sv, 'Save', { pauza: 350 });
  const s = await u.st();
  if (s.nume_fisier !== 'robotica.xlsx' || !((s.fisiere || {}).Documente || []).includes('robotica.xlsx')) pb.push(`după Save: fișier ${s.nume_fisier}, Documente ${JSON.stringify((s.fisiere || {}).Documente)}`);
  return pb;
}, { ok: 'arbore, fișierele din Documente, Save as type, robotica.xlsx salvat' });

// ================= rularea =================
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, rulate = 0;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const pr of PROBE) { await ruleaza(browser, base, pr); rulate++; }
  } catch (e) {
    for (const pr of PROBE.slice(rulate)) scrie('FAIL', pr.id, pr.nume, 'nerulată: ' + e.message.split('\n')[0]);
  } finally {
    if (browser) await browser.close().catch(() => {});
    srv.close();
  }
  console.log(`durata ${((Date.now() - t0) / 1000).toFixed(0)} s, ${PROBE.length} probe`);
  console.log(`REZUMAT PASS=${rez.PASS} FAIL=${rez.FAIL} SKIP=${rez.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rez.FAIL));
}

main().catch(e => {
  console.log('FAIL eroare la rulare - ' + e.message);
  console.log(`REZUMAT PASS=${rez.PASS} FAIL=${PROBE.length - rez.PASS - rez.SKIP} SKIP=${rez.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(PROBE.length - rez.PASS - rez.SKIP));
});
