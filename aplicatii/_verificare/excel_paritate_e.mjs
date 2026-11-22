// Probe de paritate Excel, felia E (noaptea 22->23.11.2026): cate o proba pentru fiecare rand din
// _campaign/aplicatii_fidele_2026_11/runde/noapte_excel_22_11/felii/felie_e.json (40 de randuri).
// O proba = gestul elevului jucat cu clicuri / taste / atingeri reale (Playwright, fara fereastra), apoi rezultatul
// citit pe ecran (DOM) si in LH.aplicatii.stare('excel'). Tinta = Excelul adevarat (interfata in engleza, setari
// regionale romanesti: virgula zecimala, punct la mii); unde simulatorul vechi difera, castiga Excelul (comentariu).
// Controalele se cauta dupa ce vede omul: data-lh-eticheta, data-lh-tip, data-lh-id-mso, data-lh-tinta (+ data-lh-id).
// Rulare:  node aplicatii/_verificare/excel_paritate_e.mjs   (din radacina depozitului; sau cu cale absoluta)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: PASS / FAIL / SKIP <id> <nume> - <ce a vazut proba>; apoi REZUMAT, TOTAL FAIL, iar ULTIMA linie = numarul de FAIL.
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
const PROBA_MS = 20000;
const R = '[data-lh-aplicatie="excel"]';

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

const rezultate = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, id, nume, detalii) {
  rezultate[stare]++;
  console.log(`${stare} ${id} ${nume}${detalii ? ' - ' + String(detalii).replace(/\s+/g, ' ').slice(0, 600) : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const vis = sel => `${sel} >> visible=true`;
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const J = x => JSON.stringify(x);

// ---------- deschiderea: context proaspat, doar 127.0.0.1 (regula 24), pagina-poligon
async function deschide(browser, base, tel) {
  const ctx = await browser.newContext(tel
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
    : { viewport: { width: 1280, height: 800 } });
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  p.setDefaultTimeout(4000);
  const erori = [];
  p.on('pageerror', e => erori.push(e.message));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(`${R} [data-lh-tinta="celula"]`, { timeout: 10000 });
  await p.waitForFunction(() => !!(window.LH && window.LH.aplicatii && window.LH.aplicatii.stare && window.LH.aplicatii.stare('excel')), null, { timeout: 10000 });
  await pauza(350);
  return { ctx, p, erori };
}

// ---------- ce vede si ce face elevul
const st = p => p.evaluate(() => window.LH.aplicatii.stare('excel'));
const val = (s, a) => (s.celule && s.celule[a] ? s.celule[a].valoare : undefined);
const txt = (s, a) => (s.celule && s.celule[a] ? s.celule[a].text : undefined);
const celula = (p, a) => p.locator(`${R} [data-lh-tinta="celula"][data-lh-id="${a}"]`).first();
async function clicCelula(p, a, opt) {
  const l = celula(p, a);
  if (!(await l.count())) throw new Error(`celula ${a} nu e pe ecran`);
  await l.click(opt);
  await pauza(60);
}
async function scrieIn(p, a, text) { await clicCelula(p, a); await p.keyboard.type(text); await p.keyboard.press('Enter'); await pauza(60); }
async function selecteaza(p, a, b) { await clicCelula(p, a); await clicCelula(p, b, { modifiers: ['Shift'] }); await pauza(80); }
const antet = (p, fel, id) => p.locator(`${R} [data-lh-tinta="${fel}"][data-lh-id="${id}"]`).first();
// clicul omului: mouse-ul pe mijlocul elementului, chiar daca e gri (un buton inactiv nu face nimic, nu blocheaza proba)
async function apasa(p, l, opt) {
  await l.scrollIntoViewIfNeeded().catch(() => {});
  const b = await l.boundingBox();
  if (!b) throw new Error('elementul nu are loc pe ecran');
  await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2, opt);
  await pauza(220);
}
async function fila(p, nume) {
  const l = p.locator(vis(`${R} [data-lh-tinta="fila:${esc(nume)}"]`)).first();
  if (!(await l.count())) throw new Error(`fila ${nume} nu e pe ecran`);
  await apasa(p, l);
}
async function mso(p, id, numeFila) {
  let l = p.locator(vis(`${R} [data-lh-id-mso="${id}"]`)).first();
  if (!(await l.count()) && numeFila) { await fila(p, numeFila); l = p.locator(vis(`${R} [data-lh-id-mso="${id}"]`)).first(); }
  if (!(await l.count())) throw new Error(`comanda ${id} nu e pe ecran`);
  await apasa(p, l);
  return l;
}
// primul element vizibil cu eticheta data (exacta, apoi inceputul ei: „Column Width” prinde si „Column Width...”), apoi textul vizibil
async function gaseste(p, et, { tip, peste = R, prefix = true } = {}) {
  const t = tip ? `[data-lh-tip="${tip}"]` : '';
  const cand = [`${peste} ${t}[data-lh-eticheta="${esc(et)}"]`];
  if (prefix) cand.push(`${peste} ${t}[data-lh-eticheta^="${esc(et)}"]`);
  for (const c of cand) { const l = p.locator(vis(c)).first(); if (await l.count()) return l; }
  const l = p.locator(`${peste} >> text="${esc(et)}" >> visible=true`).first();
  if (await l.count()) return l;
  return null;
}
async function gasesteMeniu(p, et) {   // un rand de meniu: role=menuitem / MenuItem / meniu:<et>, apoi orice eticheta
  for (const c of [`${R} [role="menuitem"][data-lh-eticheta^="${esc(et)}"]`, `${R} [data-lh-tip="MenuItem"][data-lh-eticheta^="${esc(et)}"]`, `${R} [data-lh-tinta^="meniu:${esc(et)}"]`]) {
    const l = p.locator(vis(c)).first(); if (await l.count()) return l;
  }
  return gaseste(p, et);
}
async function clicEt(p, et, opt) {
  const l = await gaseste(p, et, opt);
  if (!l) throw new Error(`nu găsesc „${et}” pe ecran`);
  await apasa(p, l);
}
async function nesimulat(p) {
  return p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-nesimulat')), R);
}
// tot ce spune aplicatia acum: fereastra de mesaj, dialogul, ferestrele si mesajele vizibile
async function mesaje(p) {
  const s = await st(p);
  const dom = await p.evaluate(R => [...document.querySelectorAll(`${R} [data-lh-tip="Window"], ${R} [role="dialog"], ${R} [role="alertdialog"], ${R} [role="alert"], ${R} [role="status"], ${R} [data-lh-dialog-intrebare]`)]
    .filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' | '), R);
  return [J(s.fereastra_mesaj || ''), J(s.dialog || ''), dom].join(' | ');
}
async function fereastraDeschisa(p, titlu) {
  return p.evaluate(([R, t]) => [...document.querySelectorAll(`${R} [data-lh-tip="Window"], ${R} [role="dialog"]`)]
    .some(e => e.getBoundingClientRect().width > 0 && ((e.getAttribute('data-lh-eticheta') || '') === t || (e.getAttribute('aria-label') || '') === t)), [R, titlu]);
}
// campul de text al ferestrei deschise; il completeaza ca omul: clic, Ctrl+A, scrie
async function scrieInFereastra(p, text) {
  const l = p.locator(vis(`${R} [data-lh-tip="Window"] input`)).first();
  if (!(await l.count())) throw new Error('fereastra nu are niciun câmp de scris');
  await l.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(text); await pauza(80);
}
async function ok(p) {
  let l = p.locator(vis(`${R} [data-lh-tinta="fereastra:OK"]`)).last();
  if (!(await l.count())) l = await gaseste(p, 'OK', { prefix: false });
  if (!l || !(await l.count())) throw new Error('nu găsesc butonul OK');
  await apasa(p, l);
}
const cutie = l => l.boundingBox();
// inaltimea pe ecran a numarului de rand / latimea literei de coloana
const hRand = async (p, r) => { const b = await cutie(antet(p, 'antet_rand', String(r))); return b ? b.height : null; };
const wCol = async (p, c) => { const b = await cutie(antet(p, 'antet_coloana', c)); return b ? b.width : null; };
const aproape = (a, b, d) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= d;

// un buton de pe ecran (telefon) dupa eticheta / aria-label / title / text; intoarce centrul lui sau null
async function butonEcran(p, sursa, flags) {
  return p.evaluate(([src, fl]) => {
    const re = new RegExp(src, fl);
    const el = [...document.querySelectorAll('button, [role="button"], [data-lh-tip="Button"]')].find(e => {
      const r = e.getBoundingClientRect(); if (r.width === 0 || r.height === 0) return false;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      return [e.getAttribute('data-lh-eticheta'), e.getAttribute('aria-label'), e.getAttribute('title'), (e.innerText || '').trim()].some(x => x && re.test(x.trim()));
    });
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, et: el.getAttribute('data-lh-eticheta') || el.getAttribute('aria-label') || el.innerText };
  }, [sursa, flags || 'i']);
}

// ---------- grafice
async function graficNou(p, a, b, tip) {
  await selecteaza(p, a, b);
  await mso(p, 'ChartTypeColumnInsertGallery', 'Insert');
  const l = await gaseste(p, tip, { prefix: false });
  if (!l) throw new Error(`galeria nu are „${tip}”`);
  await apasa(p, l); await pauza(200);
  const s = await st(p);
  if (!s.grafice || s.grafice.length !== 1) throw new Error('graficul nu a apărut: grafice=' + J(s.grafice && s.grafice.length));
}
async function numereAxa(p) {
  return p.evaluate(R => {
    const g = [...document.querySelectorAll(R + ' [data-lh-tinta="grafic"]')].find(e => e.getBoundingClientRect().width > 0);
    if (!g) return null;
    const n = [...g.querySelectorAll('*')].filter(e => e.children.length === 0 && e.getBoundingClientRect().width > 0)
      .map(e => (e.textContent || '').trim()).filter(t => /^-?\d{1,3}(\.\d{3})*(,\d+)?$|^-?\d+(,\d+)?$/.test(t))
      .map(t => Number(t.replace(/\./g, '').replace(',', '.')));
    return [...new Set(n)].sort((x, y) => x - y);
  }, R);
}

// ---------- randul 3 facut inalt (~40 px) pe orice drum care merge azi; intoarce drumul sau null
async function randInalt(p, r) {
  const inalt = async () => { const s = await st(p); const h = (s.inaltimi_randuri || {})[r]; return typeof h === 'number' && h > 30; };
  // 1) clic dreapta pe numarul randului › Row Height… › 30 › OK
  try {
    await antet(p, 'antet_rand', String(r)).click({ button: 'right' }); await pauza(200);
    const m = await gasesteMeniu(p, 'Row Height');
    if (m) { await apasa(p, m); await scrieInFereastra(p, '30'); await ok(p); }
    else await p.keyboard.press('Escape');
  } catch (e) { await p.keyboard.press('Escape').catch(() => {}); }
  if (await inalt()) return 'clic dreapta › Row Height…';
  for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await pauza(60); }
  // 2) Home › Format › Row Height…
  try {
    await antet(p, 'antet_rand', String(r)).click(); await pauza(100);
    await mso(p, 'FormatCellsMenu', 'Home');
    const m = await gasesteMeniu(p, 'Row Height');
    if (m) { await apasa(p, m); await scrieInFereastra(p, '30'); await ok(p); }
  } catch (e) { /* drumul lipseste */ }
  if (await inalt()) return 'Format › Row Height…';
  for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await pauza(60); }
  // 3) tragerea marginii de sub numarul randului
  const h = await cutie(antet(p, 'antet_rand', String(r)));
  const marg = p.locator(vis(`${R} [data-lh-tinta="antet_rand_margine"][data-lh-id="${r}"]`)).first();
  let x = h.x + h.width / 2, y = h.y + h.height - 1;
  if (await marg.count()) { const b = await cutie(marg); x = b.x + b.width / 2; y = b.y + b.height / 2; }
  await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x, y + 22, { steps: 6 }); await p.mouse.up(); await pauza(200);
  if (await inalt()) return 'tragerea marginii';
  return null;
}
async function dubluClicMargineRand(p, r) {
  const marg = p.locator(vis(`${R} [data-lh-tinta="antet_rand_margine"][data-lh-id="${r}"]`)).first();
  if (await marg.count()) { await marg.dblclick(); return 'antet_rand_margine'; }
  const h = await cutie(antet(p, 'antet_rand', String(r)));
  await p.mouse.dblclick(h.x + h.width / 2, h.y + h.height - 1);
  return 'linia de sub număr (fără țintă antet_rand_margine)';
}

// ======================================================================================= PROBELE
const PROBE = [];
const def = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, opt });

// ---------- Grafice
def('excel-b-F046', 'Clicul alege o parte a graficului și Delete șterge doar partea aleasă', async (p, nou) => {
  // a) seria: clic pe coloana lui Ana (Nota 1), Delete -> graficul ramane, cu o singura serie (Nota 2)
  await graficNou(p, 'A1', 'C4', 'Clustered Column');
  const bara = await p.evaluate(R => {
    const g = [...document.querySelectorAll(R + ' [data-lh-tinta="grafic"]')].find(e => e.getBoundingClientRect().width > 0);
    const b = [...g.querySelectorAll('rect, path')].map(r => ({ r, b: r.getBoundingClientRect() })).filter(o => o.b.width > 4 && o.b.height > 10 && o.r.getAttribute('fill') && !/^(none|#fff(fff)?|white)$/i.test(o.r.getAttribute('fill')));
    const ana = b.find(o => o.r.getAttribute('data-lh-valoare') === '9') || b[0];
    return ana ? { x: ana.b.x + ana.b.width / 2, y: ana.b.y + ana.b.height / 2 } : null;
  }, R);
  if (!bara) return { ok: false, vazut: 'nu găsesc nicio coloană desenată în grafic' };
  await p.mouse.click(bara.x, bara.y); await pauza(200);
  await p.keyboard.press('Delete'); await pauza(300);
  const s1 = await st(p);
  const serii1 = s1.grafice && s1.grafice[0] ? (s1.grafice[0].serii || s1.serii_grafic || []) : null;
  const okSerie = !!serii1 && s1.grafice.length === 1 && serii1.length === 1;
  // b) legenda: clic pe „Nota 1” din legenda, Delete -> graficul ramane, fara legenda, cu ambele serii
  const q = await nou();
  await graficNou(q, 'A1', 'C4', 'Clustered Column');
  const leg = await q.evaluate(R => {
    const g = [...document.querySelectorAll(R + ' [data-lh-tinta="grafic"]')].find(e => e.getBoundingClientRect().width > 0);
    const e = [...g.querySelectorAll('*')].find(x => x.children.length === 0 && (x.textContent || '').trim() === 'Nota 1' && x.getBoundingClientRect().width > 0);
    if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }, R);
  let okLeg = false, s2 = null;
  if (leg) {
    await q.mouse.click(leg.x, leg.y); await pauza(200);
    await q.keyboard.press('Delete'); await pauza(300);
    s2 = await st(q);
    const g2 = s2.grafice && s2.grafice[0];
    okLeg = !!g2 && s2.grafice.length === 1 && (!g2.legenda || g2.legenda.length === 0) && (g2.serii || s2.serii_grafic || []).length === 2;
  }
  return {
    ok: okSerie && okLeg,
    vazut: `coloană+Delete: grafice=${s1.grafice ? s1.grafice.length : 0}, serii=${J(serii1)} (aștept 1 grafic cu [Nota 2]); legendă+Delete: ${leg ? `grafice=${s2.grafice ? s2.grafice.length : 0}, legenda=${J(s2.grafice && s2.grafice[0] && s2.grafice[0].legenda)}, serii=${J(s2.grafice && s2.grafice[0] && s2.grafice[0].serii)}` : 'legenda „Nota 1” nu e pe ecran'} (aștept 1 grafic, fără legendă, 2 serii)`,
  };
});

def('excel-b-F053', 'Axa cu numere ca în Excel (120…140 → 110…145; la bare cel mult 7 intervale)', async (p, nou) => {
  const date = async q => { await scrieIn(q, 'H1', 'Luna'); await scrieIn(q, 'I1', 'Vanzari'); for (const [a, t] of [['H2', 'Ian'], ['H3', 'Feb'], ['H4', 'Mar'], ['I2', '120'], ['I3', '130'], ['I4', '140']]) await scrieIn(q, a, t); };
  await date(p);
  await graficNou(p, 'H1', 'I4', 'Clustered Column');
  const col = await numereAxa(p);
  const q = await nou();
  await date(q);
  await graficNou(q, 'H1', 'I4', 'Clustered Bar');
  const bar = await numereAxa(q);
  const okCol = !!col && col.length > 1 && col[0] === 110 && col[col.length - 1] === 145;
  const okBar = !!bar && bar.length > 1 && bar[0] === 110 && bar[bar.length - 1] === 145 && bar.length - 1 <= 7;
  return { ok: okCol && okBar, vazut: `Clustered Column: ${J(col)}; Clustered Bar: ${J(bar)} (aștept 110…145 din 5 în 5, adică 7 intervale)` };
});

// ---------- Interfata
def('excel-a-F054', 'Fiecare foaie își ține zoom-ul ei (Sheet1 120 %, foaia nouă 100 %)', async p => {
  const zoom = () => p.evaluate(R => {
    const e = [...document.querySelectorAll(R + ' [data-lh-eticheta^="Zoom "]')].find(x => /\d+\s*%/.test(x.getAttribute('data-lh-eticheta')) && x.getBoundingClientRect().width > 0);
    return e ? parseInt(e.getAttribute('data-lh-eticheta').match(/(\d+)\s*%/)[1], 10) : null;
  }, R);
  const plus = p.locator(vis(`${R} [data-lh-tinta="zoom:Zoom In"]`)).first();
  await plus.click(); await pauza(100); await plus.click(); await pauza(200);
  const z1 = await zoom();
  await p.locator(vis(`${R} [data-lh-tinta="fila_foii_buton:Add Sheet"]`)).first().click(); await pauza(300);
  const z2 = await zoom();
  const foi = (await st(p)).foi;
  await p.locator(vis(`${R} [data-lh-tinta="fila_foii"][data-lh-id="Sheet1"]`)).first().click(); await pauza(300);
  const z3 = await zoom();
  return { ok: z1 === 120 && z2 === 100 && z3 === 120, vazut: `Sheet1 după 2×+: ${z1} %; foaia nouă (${J(foi)}): ${z2} % (aștept 100); înapoi pe Sheet1: ${z3} % (aștept 120)` };
});

def('excel-a-F060', 'Pe telefon: Tab, Enter, săgețile și Esc sunt butoane sub foaie (merg și în caseta de nume)', async p => {
  const B = {
    tab: await butonEcran(p, '^tab(\\s|$)|⇥'),
    enter: await butonEcran(p, '^enter(\\s|$)|↵|⏎'),
    jos: await butonEcran(p, '↓|^(arrow\\s*)?down(\\s*arrow)?$|săgeata\\s*(jos|down)'),
    esc: await butonEcran(p, '^esc(ape)?(\\s|$)|⎋'),
  };
  const lipsa = Object.entries(B).filter(([, v]) => !v).map(([k]) => k);
  if (lipsa.length) return { ok: false, vazut: `lipsesc butoanele de pe ecran: ${lipsa.join(', ')} (căutate după eticheta/aria-label/text: Tab ⇥, Enter ↵, ↓, Esc)` };
  await celula(p, 'B2').tap(); await pauza(150);
  await p.keyboard.type('x');
  await p.touchscreen.tap(B.tab.x, B.tab.y); await pauza(200);
  const s1 = await st(p);
  await p.touchscreen.tap(B.jos.x, B.jos.y); await pauza(200);
  const s2 = await st(p);
  await p.keyboard.type('z');
  await p.touchscreen.tap(B.esc.x, B.esc.y); await pauza(200);
  const s3 = await st(p);
  const nb = p.locator(vis(`${R} [data-lh-tinta="camp:Name Box"]`)).first();
  await nb.tap(); await pauza(100); await p.keyboard.press('Control+A'); await p.keyboard.type('E5');
  await p.touchscreen.tap(B.enter.x, B.enter.y); await pauza(250);
  const s4 = await st(p);
  const okT = val(s1, 'B2') === 'x' && s1.selectie.activa === 'C2';
  const okJ = s2.selectie.activa === 'C3';
  const okE = val(s3, 'C3') === undefined && s3.ramane_in_editare === false;
  const okN = s4.selectie.activa === 'E5';
  return { ok: okT && okJ && okE && okN, vazut: `x + Tab⇥: B2=${J(val(s1, 'B2'))}, activă ${s1.selectie.activa} (aștept C2); ↓: ${s2.selectie.activa} (aștept C3); z + Esc: C3=${J(val(s3, 'C3'))}; caseta de nume E5 + Enter↵: activă ${s4.selectie.activa}` };
}, { tel: true });

// ---------- Latime si inaltime
def('excel-a-F136', 'Potrivește singură înălțimea rândului cu dublu-clic pe linia de sub numărul lui', async p => {
  const std = await hRand(p, 4);
  const drum = await randInalt(p, 3);
  if (!drum) return { ok: false, vazut: 'precondiție: nu pot face rândul 3 mai înalt (nici clic dreapta › Row Height…, nici Format › Row Height…, nici tragerea marginii nu schimbă înaltimi_randuri) — nu se poate juca dublu-clicul' };
  const h0 = await hRand(p, 3);
  const unde = await dubluClicMargineRand(p, 3); await pauza(300);
  const s = await st(p); const h1 = await hRand(p, 3);
  const ir = (s.inaltimi_randuri || {})['3'];
  return { ok: (ir === undefined || aproape(ir, std, 2)) && aproape(h1, std, 2), vazut: `rândul 3 făcut înalt prin ${drum}: ${h0} px; dublu-clic pe ${unde}: ${h1} px, înaltimi_randuri[3]=${J(ir)} (aștept înălțimea standard ${std} px, rândul are text obișnuit)` };
});

def('excel-a-F137', 'Lățimea coloanei într-o fereastră: Home › Cells › Format › Column Width… (și din clic dreapta pe literă)', async p => {
  // drumul cel mai obisnuit (asa il da Microsoft in „Change the column width”): Home › Format › Column Width…; clic dreapta se raporteaza in detaliu
  await antet(p, 'antet_coloana', 'C').click(); await pauza(100);
  let okF = false, detF = '';
  try {
    await mso(p, 'FormatCellsMenu', 'Home');
    const m = await gasesteMeniu(p, 'Column Width');
    if (!m) detF = `meniul Format nu are „Column Width…” (nesimulat: ${J(await nesimulat(p))})`;
    else { await apasa(p, m); await scrieInFereastra(p, '15'); await ok(p);
      const s = await st(p); const w = (s.latimi_coloane || {}).C; const wd = await wCol(p, 'C');
      okF = typeof w === 'number' && w >= 100 && w <= 125 && aproape(wd, w, 3); detF = `Format › Column Width… 15: latimi_coloane.C=${w}, pe ecran ${wd} px (aștept ~110 px)`; }
  } catch (e) { detF = 'drumul Format: ' + e.message.split('\n')[0]; }
  for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await pauza(60); }
  let detC = '';
  try {
    await antet(p, 'antet_coloana', 'E').click({ button: 'right' }); await pauza(200);
    const m = await gasesteMeniu(p, 'Column Width');
    if (m) { await apasa(p, m); await scrieInFereastra(p, '15'); await ok(p); detC = `clic dreapta pe E › Column Width… 15: latimi_coloane.E=${(await st(p)).latimi_coloane.E}`; }
    else detC = 'clic dreapta: fără Column Width…';
  } catch (e) { detC = 'clic dreapta: ' + e.message.split('\n')[0]; }
  return { ok: okF, vazut: `${detF}; ${detC}` };
});

def('excel-a-F138', 'Înălțimea rândului într-o fereastră: Format › Row Height… (și din clic dreapta pe număr) → 30 → OK', async p => {
  // drumul cel mai obisnuit (Microsoft, „Change the column width and row height”): Home › Format › Row Height…
  await antet(p, 'antet_rand', '3').click(); await pauza(100);
  let okF = false, detF = '';
  try {
    await mso(p, 'FormatCellsMenu', 'Home');
    const m = await gasesteMeniu(p, 'Row Height');
    if (!m) detF = `meniul Format nu are „Row Height…” (nesimulat: ${J(await nesimulat(p))})`;
    else { await apasa(p, m); await scrieInFereastra(p, '30'); await ok(p);
      const s = await st(p); const h = (s.inaltimi_randuri || {})['3']; const hd = await hRand(p, 3);
      okF = aproape(h, 40, 1.5) && aproape(hd, 40, 2.5); detF = `Format › Row Height… 30: inaltimi_randuri[3]=${J(h)}, pe ecran ${hd} px (aștept 40 px = 30 pt)`; }
  } catch (e) { detF = 'drumul Format: ' + e.message.split('\n')[0]; }
  for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await pauza(60); }
  let detC = '';
  try {
    await antet(p, 'antet_rand', '6').click({ button: 'right' }); await pauza(200);
    const m = await gasesteMeniu(p, 'Row Height');
    if (m) { await apasa(p, m); await scrieInFereastra(p, '30'); await ok(p); const s = await st(p); detC = `clic dreapta pe 6 › Row Height… 30 › OK: inaltimi_randuri[6]=${J((s.inaltimi_randuri || {})['6'])}, pe ecran ${await hRand(p, 6)} px, nesimulat=${J(await nesimulat(p))}`; }
    else detC = 'clic dreapta: fără Row Height…';
  } catch (e) { detC = 'clic dreapta: ' + e.message.split('\n')[0]; }
  return { ok: okF, vazut: `${detF}; ${detC}` };
});

def('excel-a-F139', 'Potrivește lățimea coloanei după celulele SELECTATE (Format › AutoFit Column Width)', async p => {
  await scrieIn(p, 'B6', 'Aceasta este o propozitie lunga');
  await clicCelula(p, 'B6');
  await mso(p, 'FormatCellsMenu', 'Home');
  const m = await gasesteMeniu(p, 'AutoFit Column Width');
  if (!m) return { ok: false, vazut: `meniul Format nu are „AutoFit Column Width” (nesimulat: ${J(await nesimulat(p))})` };
  await apasa(p, m);
  const w1 = ((await st(p)).latimi_coloane || {}).B; const wd1 = await wCol(p, 'B');
  // a doua oara, doar B2 („9”) selectata: coloana se strange dupa „9” (Excel potriveste dupa celulele alese, nu dupa toata coloana)
  await clicCelula(p, 'B2');
  await mso(p, 'FormatCellsMenu', 'Home');
  const m2 = await gasesteMeniu(p, 'AutoFit Column Width');
  if (m2) { await apasa(p, m2); }
  const w2 = ((await st(p)).latimi_coloane || {}).B; const wd2 = await wCol(p, 'B');
  return { ok: typeof w1 === 'number' && w1 > 130 && aproape(wd1, w1, 3) && typeof w2 === 'number' && w2 < 40, vazut: `B6 (propoziție lungă) aleasă: latimi_coloane.B=${w1}, pe ecran ${wd1} px (aștept > 130); apoi doar B2 („9”) aleasă: latimi_coloane.B=${w2}, pe ecran ${wd2} px (aștept < 40)` };
});

def('excel-a-F140', 'Readuce înălțimea automată a rândurilor selectate (Format › AutoFit Row Height)', async p => {
  const std = await hRand(p, 4);
  const drum = await randInalt(p, 3);
  if (!drum) return { ok: false, vazut: 'precondiție: nu pot face rândul 3 mai înalt (Row Height… din clic dreapta / Format și tragerea marginii nu schimbă înaltimi_randuri)' };
  for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await pauza(60); }
  await antet(p, 'antet_rand', '3').click(); await pauza(100);
  await mso(p, 'FormatCellsMenu', 'Home');
  const m = await gasesteMeniu(p, 'AutoFit Row Height');
  if (!m) return { ok: false, vazut: `rândul 3 înalt prin ${drum}; meniul Format nu are „AutoFit Row Height” (nesimulat: ${J(await nesimulat(p))})` };
  await apasa(p, m);
  const s = await st(p); const ir = (s.inaltimi_randuri || {})['3']; const h1 = await hRand(p, 3);
  return { ok: (ir === undefined || aproape(ir, std, 2)) && aproape(h1, std, 2), vazut: `după AutoFit Row Height: rândul 3 = ${h1} px, inaltimi_randuri[3]=${J(ir)} (aștept standard ${std} px)` };
});

def('excel-a-F141', 'Schimbă lățimea standard a coloanelor nelățite de mână (Format › Default Width…)', async p => {
  // coloana B latita de mana (clic dreapta › Column Width… 5): trebuie sa ramana cum e
  await antet(p, 'antet_coloana', 'B').click({ button: 'right' }); await pauza(200);
  const cw = await gasesteMeniu(p, 'Column Width');
  if (cw) { await apasa(p, cw); await scrieInFereastra(p, '5'); await ok(p); }
  const b0 = await wCol(p, 'B'), e0 = await wCol(p, 'E');
  await clicCelula(p, 'E6');
  await mso(p, 'FormatCellsMenu', 'Home');
  const m = await gasesteMeniu(p, 'Default Width');
  if (!m) return { ok: false, vazut: `meniul Format nu are „Default Width…” (nesimulat: ${J(await nesimulat(p))}); B=${b0} px, E=${e0} px` };
  await apasa(p, m); await scrieInFereastra(p, '15'); await ok(p);
  const b1 = await wCol(p, 'B'), e1 = await wCol(p, 'E');
  return { ok: typeof e1 === 'number' && e1 >= 100 && e1 <= 125 && aproape(b1, b0, 2), vazut: `Default Width 15: coloana E ${e0} → ${e1} px (aștept ~110), coloana B lățită de mână ${b0} → ${b1} px (aștept neschimbată)` };
});

// ---------- Navigare
def('excel-a-F056', 'Clicul pe celula ACTIVĂ nu rupe șirul Tab–Enter; clicul pe altă celulă îl rupe', async p => {
  // simulatorul vechi: „clicul pe celula ACTIVA nu rupe sirul Tab–Enter (probat in Excel)”
  await clicCelula(p, 'B7'); await p.keyboard.type('x'); await p.keyboard.press('Tab'); await pauza(100);
  await clicCelula(p, 'C7'); await p.keyboard.type('y'); await p.keyboard.press('Enter'); await pauza(150);
  const s1 = await st(p);
  await clicCelula(p, 'B12'); await p.keyboard.type('x'); await p.keyboard.press('Tab'); await pauza(100);
  await clicCelula(p, 'E14'); await p.keyboard.type('y'); await p.keyboard.press('Enter'); await pauza(150);
  const s2 = await st(p);
  const okA = val(s1, 'C7') === 'y' && s1.selectie.activa === 'B8';
  const okB = val(s2, 'E14') === 'y' && s2.selectie.activa === 'E15';
  return { ok: okA && okB, vazut: `x⇥, clic pe C7 (activă), y↵: activă ${s1.selectie.activa} (aștept B8); x⇥, clic pe E14 (alta), y↵: activă ${s2.selectie.activa} (aștept E15)` };
});

// ---------- Numar
def('excel-a-F126', 'Formatul contabil (Accounting Number Format: lei, minusul la stânga, liniuță la zero)', async p => {
  await scrieIn(p, 'F2', '1234,5'); await scrieIn(p, 'F3', '0'); await scrieIn(p, 'F4', '-5');
  await selecteaza(p, 'F2', 'F4');
  await mso(p, 'InternationalCurrency', 'Home');
  const s = await st(p);
  const t = a => String(txt(s, a) || '').replace(/\s+/g, ' ').trim();
  // RON sau lei: simbolul monedei din Windows (ro-RO); simulatorul vechi scrie „lei”
  const ok2 = /1\.234,50 ?(lei|RON)/.test(t('F2')), ok3 = /^-+ ?(lei|RON)$/.test(t('F3')), ok4 = /^- ?5,00 ?(lei|RON)$/.test(t('F4'));
  const okV = val(s, 'F2') === 1234.5 && val(s, 'F3') === 0 && val(s, 'F4') === -5;
  return { ok: ok2 && ok3 && ok4 && okV, vazut: `afișat: F2=${J(t('F2'))} F3=${J(t('F3'))} F4=${J(t('F4'))} (aștept „1.234,50 lei”, „- lei”, „-5,00 lei”), valori ${val(s, 'F2')}/${val(s, 'F3')}/${val(s, 'F4')}, nesimulat=${J(await nesimulat(p))}` };
});

def('excel-a-F128', 'Stilul virgulă (Comma Style: separator de mii, două zecimale)', async p => {
  await scrieIn(p, 'F2', '1234,5');
  await clicCelula(p, 'F2');
  await mso(p, 'CommaStyle', 'Home');
  const s = await st(p); const t = String(txt(s, 'F2') || '').replace(/\s+/g, ' ').trim();
  return { ok: /^1\.234,50$/.test(t) && val(s, 'F2') === 1234.5, vazut: `F2 afișat ${J(t)} (aștept „1.234,50”), valoare ${val(s, 'F2')}, nesimulat=${J(await nesimulat(p))}` };
});

def('excel-a-F130', 'Scoate o zecimală afișată (Decrease Decimal): 7,5 → 8, valoarea rămâne 7,5', async p => {
  await scrieIn(p, 'F2', '7,5');
  await clicCelula(p, 'F2');
  await mso(p, 'DecimalsDecrease', 'Home');
  const s = await st(p); const ecran = (await celula(p, 'F2').innerText()).trim();
  return { ok: txt(s, 'F2') === '8' && ecran === '8' && val(s, 'F2') === 7.5, vazut: `F2 afișat ${J(txt(s, 'F2'))} / pe ecran ${J(ecran)} (aștept „8”), valoare ${val(s, 'F2')} (aștept 7.5), nesimulat=${J(await nesimulat(p))}` };
});

// ---------- Registru: meniul Fisier, salvare, inchidere si deschidere
const DLG_OPEN = `${R} [data-lh-fis="deschidere"], ${R} [role="dialog"][aria-label="Open"], ${R} [data-lh-tip="Window"][data-lh-eticheta="Open"]`;
async function fereastraOpen(p) {
  await p.keyboard.press('Control+o'); await pauza(300);
  const br = await gaseste(p, 'Browse', { prefix: false });
  if (!br) throw new Error('Backstage › Open nu are „Browse”');
  await br.click(); await pauza(300);
  const d = p.locator(vis(DLG_OPEN)).first();
  if (!(await d.count())) throw new Error('fereastra Open nu a apărut');
  return d;
}
const fisiereInLista = p => p.evaluate(sel => {
  const d = [...document.querySelectorAll(sel)].find(e => e.getBoundingClientRect().width > 0);
  return d ? [...d.querySelectorAll('[data-lh-tinta^="fisier:"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-tinta').slice(7)) : null;
}, DLG_OPEN);
async function alegeTip(p, re) {   // lista „Files of type”
  const sel = p.locator(vis(`${R} select[aria-label^="Files of type"], ${R} [data-lh-tinta="camp:tip_fisier"] select, ${R} select[data-lh-tinta="camp:tip_fisier"]`)).first();
  if (!(await sel.count())) throw new Error('lista „Files of type” nu e pe ecran');
  const v = await sel.evaluate((s, src) => { const o = [...s.options].find(x => new RegExp(src, 'i').test(x.text)); return o ? o.value : null; }, re);
  if (v == null) throw new Error('lista „Files of type” nu are ' + re);
  await sel.selectOption(v); await pauza(200);
}

def('excel-a-F200', 'Meniul File cu New, Open, Save, Save As, Close (Open chiar deschide un registru)', async p => {
  await fila(p, 'File'); await pauza(300);
  const are = {};
  for (const et of ['New', 'Open', 'Save', 'Save As', 'Close']) are[et] = !!(await p.locator(vis(`${R} [data-lh-tinta="backstage:${et}"]`)).count()) || !!(await gaseste(p, et, { prefix: false, tip: 'ListItem' }));
  await p.locator(vis(`${R} [data-lh-tinta="backstage:Open"]`)).first().click(); await pauza(300);
  const br = await gaseste(p, 'Browse', { prefix: false });
  if (!br) return { ok: false, vazut: `File: ${J(are)}; Open nu are „Browse”` };
  await br.click(); await pauza(300);
  await p.locator(vis(`${DLG_OPEN.split(',')[0]} [data-lh-tinta="arbore:Documente"], ${R} [role="dialog"] [data-lh-tinta="arbore:Documente"]`)).first().click(); await pauza(200);
  await p.locator(vis(`${R} [data-lh-tinta="fisier:Note clasa.xlsx"]`)).first().click(); await pauza(100);
  const deschide = p.locator(vis(`${R} [role="dialog"] [data-lh-tinta="buton:Open"], ${R} [data-lh-fis="deschidere"] [data-lh-tinta="buton:Open"]`)).first();
  await apasa(p, deschide); await pauza(200);
  const s = await st(p); const nes = await nesimulat(p);
  const okMeniu = Object.values(are).every(Boolean);
  const okOpen = s.nume_fisier === 'Note clasa.xlsx';
  return { ok: okMeniu && okOpen, vazut: `File are: ${J(are)}; Open › Browse › Documente › Note clasa.xlsx › Open: nume_fisier=${J(s.nume_fisier)}, registru_activ=${J(s.registru_activ)}${nes.length ? ', mesaj nesimulat: ' + J(nes) : ''}` };
});

def('excel-a-F186', 'Numele fișierului cu semne interzise (\\ / : * ? " < > |) → mesaj sub casetă, fereastra rămâne deschisă', async p => {
  await p.keyboard.press('Control+s'); await pauza(400);
  const inp = p.locator(vis(`${R} [data-lh-tinta="camp:nume_fisier"] input, ${R} input[data-lh-tinta="camp:nume_fisier"], ${R} input[aria-label^="File name"]`)).first();
  if (!(await inp.count())) return { ok: false, vazut: 'Ctrl+S nu a deschis o fereastră cu caseta File name' };
  const inainte = await p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-tip="Window"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' '), R);
  await inp.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('AMF1/IF');
  let sv = p.locator(vis(`${R} [data-lh-tinta="dialog_salvare:Save"]`)).first();
  if (!(await sv.count())) sv = await gaseste(p, 'Save', { prefix: false, tip: 'Button' });
  await apasa(p, sv); await pauza(200);
  const s = await st(p);
  const dupa = await p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-tip="Window"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' '), R);
  const deschisa = !!(await inp.count()) && !!s.dialog;
  const nou = dupa.replace(inainte, ' ');
  const mesaj = /not allowed|can.?t contain|cannot contain|can.?t be used|invalid|isn.?t valid|not valid|characters?|caracter/i.test(nou) || /[\\/:*?"<>|]{3,}/.test(nou);
  const salvat = JSON.stringify(s.fisiere || {}).includes('AMF1') || !!s.nume_fisier;
  return { ok: deschisa && mesaj && !salvat, vazut: `după Save cu „AMF1/IF”: fereastra ${deschisa ? 'a rămas deschisă' : 'S-A ÎNCHIS'}, mesaj despre semne ${mesaj ? 'DA' : 'NU'}, salvat=${salvat ? J(s.nume_fisier) : 'nu'}` };
});

def('excel-a-F192', '„More options…” și „More locations” din fereastra „Save this file” duc la Save As', async (p, nou) => {
  await p.keyboard.press('Control+s'); await pauza(400);
  const mo = await gaseste(p, 'More options', { tip: 'Button' }) || await gaseste(p, 'More options');
  if (mo) { await apasa(p, mo); }
  const sA = await st(p);
  const okA = !!mo && (sA.pagina_backstage === 'Save As' || await fereastraDeschisa(p, 'Save As'));
  const q = await nou();
  await q.keyboard.press('Control+s'); await pauza(400);
  let ml = await gaseste(q, 'More locations');
  if (!ml) {   // lista „Choose a Location ▾”: clic pe caseta, apoi pe sageata ei
    const cl = q.locator(vis(`${R} [data-lh-tinta="camp:Choose a Location"]`)).first();
    if (await cl.count()) { await apasa(q, cl); }
    ml = await gaseste(q, 'More locations');
    if (!ml) {
      const sag = q.locator(vis(`${R} [data-lh-tip="Window"] [data-lh-tinta="fereastra:Open"]`)).first();
      if (await sag.count()) { await apasa(q, sag); }
      ml = await gaseste(q, 'More locations');
    }
  }
  let sB = null;
  if (ml) { await apasa(q, ml); sB = await st(q); }
  const okB = !!ml && (sB.pagina_backstage === 'Save As' || await fereastraDeschisa(q, 'Save As'));
  return { ok: okA && okB, vazut: `More options…: ${mo ? 'pagina_backstage=' + J(sA.pagina_backstage) : 'nu e pe ecran'}; More locations: ${ml ? 'pagina_backstage=' + J(sB.pagina_backstage) : 'nu apare în lista Choose a Location ▾ (nesimulat: ' + J(await nesimulat(q)) + ')'} (aștept Save As la amândouă)` };
});

def('excel-a-F196', 'Butonul ✕ din bara de titlu închide registrul (cu aceeași întrebare la modificări)', async p => {
  await scrieIn(p, 'F2', 'modificat');
  await p.locator(vis(`${R} [data-lh-tinta="bara_titlu:Close"]`)).first().click(); await pauza(400);
  const s1 = await st(p);
  const intreaba = /save your changes/i.test(J(s1.dialog || '') + (await mesaje(p)));
  const ds = await gaseste(p, "Don't Save", { prefix: false });
  if (!intreaba || !ds) return { ok: false, vazut: `după ✕: dialog=${J(s1.dialog)}, nesimulat=${J(await nesimulat(p))} (aștept „Save your changes to this file?” cu Don't Save)` };
  await apasa(p, ds); await pauza(200);
  const s2 = await st(p);
  const inchis = s2.registru_activ == null || (s2.registre || []).length === 0 || (s2.inchideri || 0) > (s1.inchideri || 0);
  return { ok: inchis, vazut: `✕ → întrebarea Save your changes; Don't Save → registru_activ=${J(s2.registru_activ)}, registre=${J(s2.registre)}, inchideri=${s2.inchideri}` };
});

def('excel-a-F198', 'În fereastra Open, „Files of type” filtrează lista (All Excel Files / Text Files / All Files)', async p => {
  await fereastraOpen(p);
  await p.locator(vis(`${R} [data-lh-tinta="arbore:Descărcări"]`)).first().click(); await pauza(200);
  const l1 = await fisiereInLista(p);
  await alegeTip(p, '^Text Files'); const l2 = await fisiereInLista(p);
  await alegeTip(p, '^All Files'); const l3 = await fisiereInLista(p);
  const ok1 = Array.isArray(l1) && !l1.some(n => /\.(csv|pdf)$/i.test(n));
  const ok2 = Array.isArray(l2) && l2.includes('lista-clasei.csv') && !l2.includes('raport.pdf');
  const ok3 = Array.isArray(l3) && l3.includes('lista-clasei.csv') && l3.includes('raport.pdf');
  return { ok: ok1 && ok2 && ok3, vazut: `Descărcări: All Excel Files → ${J(l1)}; Text Files → ${J(l2)}; All Files → ${J(l3)}` };
});

def('excel-a-F199', 'Un PDF deschis în Excel arată semne fără sens („%PDF-…” în A1)', async p => {
  await fereastraOpen(p);
  await p.locator(vis(`${R} [data-lh-tinta="arbore:Descărcări"]`)).first().click(); await pauza(200);
  await alegeTip(p, '^All Files');
  await p.locator(vis(`${R} [data-lh-tinta="fisier:raport.pdf"]`)).first().click(); await pauza(100);
  await p.locator(vis(`${R} [role="dialog"] [data-lh-tinta="buton:Open"], ${R} [data-lh-fis="deschidere"] [data-lh-tinta="buton:Open"]`)).first().click(); await pauza(400);
  // daca Excel intreaba ceva intai (formatul nu se potriveste / Text Import), raspunsul obisnuit e Yes / Finish / OK
  for (const b of ['Yes', 'Finish', 'OK']) { const l = await gaseste(p, b, { prefix: false, tip: 'Button' }); if (l) { await apasa(p, l); break; } }
  const s = await st(p);
  return { ok: /^%PDF/.test(String(txt(s, 'A1') || '')), vazut: `după Open pe raport.pdf: A1=${J(txt(s, 'A1'))}, nume_fisier=${J(s.nume_fisier)}, nesimulat=${J(await nesimulat(p))}` };
});

// ---------- Selectie
def('excel-a-F031', 'Shift+clic pe alt număr de rând / altă literă extinde selecția la mai multe rânduri / coloane', async p => {
  await antet(p, 'antet_rand', '2').click(); await antet(p, 'antet_rand', '4').click({ modifiers: ['Shift'] }); await pauza(150);
  const z1 = (await st(p)).selectie.zona;
  await antet(p, 'antet_coloana', 'A').click(); await antet(p, 'antet_coloana', 'C').click({ modifiers: ['Shift'] }); await pauza(150);
  const z2 = (await st(p)).selectie.zona;
  return { ok: z1 === '2:4' && z2 === 'A:C', vazut: `clic pe 2, Shift+clic pe 4 → ${J(z1)} (aștept 2:4); clic pe A, Shift+clic pe C → ${J(z2)} (aștept A:C)` };
});

def('excel-a-F044', 'Pe telefon: tragerea cu degetul peste celule selectează o zonă', async p => {
  // Excel pe telefon: tragerea pe foaie poate derula; se accepta si drumul cu manerul de selectie (atingi B2, tragi cerculetul la C4)
  const c = async a => { const b = await cutie(celula(p, a)); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const a = await c('B2'), b = await c('C4');
  const cdp = await p.context().newCDPSession(p);
  const trage = async (de, la) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: de.x, y: de.y }] }); await pauza(80);
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: de.x + (la.x - de.x) * i / 8, y: de.y + (la.y - de.y) * i / 8 }] }); await pauza(30); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pauza(250);
  };
  await trage(a, b);
  const z1 = (await st(p)).selectie.zona;
  if (z1 === 'B2:C4') return { ok: true, vazut: 'degetul tras de pe B2 pe C4 → B2:C4' };
  await celula(p, 'B2').tap(); await pauza(200);
  const maner = await p.evaluate(R => {
    const e = [...document.querySelectorAll(R + ' *')].find(x => { const r = x.getBoundingClientRect(); if (!r.width) return false;
      return /maner_selectie|selection.?handle|mâner de selec/i.test([x.getAttribute('data-lh-tinta'), x.getAttribute('data-lh-eticheta'), x.getAttribute('aria-label')].join(' ')); });
    if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, R);
  let z2 = null;
  if (maner) { await trage(maner, b); z2 = (await st(p)).selectie.zona; }
  return { ok: z2 === 'B2:C4', vazut: `degetul tras de pe B2 pe C4 → ${J(z1)}; mânerul de selecție ${maner ? 'tras pe C4 → ' + J(z2) : 'nu există'} (aștept B2:C4)` };
}, { tel: true });

def('excel-a-F047', 'Shift+Spațiu selectează tot rândul celulei active', async p => {
  await clicCelula(p, 'B3'); await p.keyboard.press('Shift+Space'); await pauza(150);
  const s = await st(p);
  return { ok: s.selectie.zona === '3:3', vazut: `B3, Shift+Spațiu → zona ${J(s.selectie.zona)} (aștept 3:3), B3=${J(val(s, 'B3'))}` };
});

def('excel-a-F048', 'Ctrl+Spațiu selectează toată coloana celulei active', async p => {
  await clicCelula(p, 'B3'); await p.keyboard.press('Control+Space'); await pauza(150);
  const s = await st(p);
  return { ok: s.selectie.zona === 'B:B', vazut: `B3, Ctrl+Spațiu → zona ${J(s.selectie.zona)} (aștept B:B)` };
});

def('excel-a-F146', 'Clic pe litera unei coloane care atinge o îmbinare selectează toată lățimea îmbinării (A8:D8 → clic pe C = A:D)', async p => {
  await selecteaza(p, 'A8', 'D8');
  await mso(p, 'MergeCenter', 'Home');
  const s0 = await st(p);
  const imbinat = J(s0.format_celule || {}).includes('A8:D8') || !(await celula(p, 'C8').isVisible().catch(() => false));
  if (!imbinat) return { ok: false, vazut: `precondiție: Merge & Center pe A8:D8 nu a îmbinat (format_celule=${J(s0.format_celule).slice(0, 200)})` };
  await antet(p, 'antet_coloana', 'C').click(); await pauza(150);
  const z = (await st(p)).selectie.zona;
  return { ok: z === 'A:D', vazut: `A8:D8 îmbinat, clic pe litera C → zona ${J(z)} (aștept A:D)` };
});

// ---------- Sortare
const coloana = (s, c) => [2, 3, 4].map(r => val(s, c + r));
// selectia trasa cu mouse-ul peste celule (asa cere exercitiul m2-l10: „trăgând peste ele”); daca tragerea nu merge, Shift+clic
async function trageSelectie(p, a, b) {
  const ca = await cutie(celula(p, a)), cb = await cutie(celula(p, b));
  await p.mouse.move(ca.x + ca.width / 2, ca.y + ca.height / 2); await p.mouse.down();
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2, { steps: 8 }); await p.mouse.up(); await pauza(120);
  if ((await st(p)).selectie.zona !== `${a}:${b}`) await selecteaza(p, a, b);
}
def('excel-b-F008', 'Sort Warning la o singură coloană cu date alături: Expand (ales de la început) / Continue sortează doar selecția; la 2 coloane din 3 Excel sortează fără întrebare', async (p, nou) => {
  const avertizare = async q => { await trageSelectie(q, 'B2', 'B4'); await mso(q, 'SortAscendingExcel', 'Data'); return fereastraDeschisa(q, 'Sort Warning'); };
  const sorteaza = async q => {   // butonul Sort (in Excel „Sort...” cand vii din fereastra Sort); daca se deschide fereastra Sort, OK
    const b = await gaseste(q, 'Sort', { tip: 'Button', peste: `${R} [data-lh-tip="Window"]` });
    if (!b) throw new Error('Sort Warning fără butonul Sort');
    await apasa(q, b);
    if (await fereastraDeschisa(q, 'Sort')) await ok(q);
  };
  // a) direct Sort: varianta aleasa de la inceput e Expand -> tot tabelul dupa Nota 1
  const a1 = await avertizare(p);
  if (a1) await sorteaza(p);
  const s1 = await st(p);
  const okA = a1 && J(coloana(s1, 'A')) === J(['Bogdan', 'Dan', 'Ana']) && J(coloana(s1, 'B')) === J([7, 8, 9]) && J(coloana(s1, 'C')) === J([8, 6, 10]);
  // b) Continue with the current selection -> doar B2:B4 (randurile se desperecheaza)
  const q = await nou();
  const a2 = await avertizare(q);
  if (a2) { await clicEt(q, 'Continue with the current selection'); await sorteaza(q); }
  const s2 = await st(q);
  const okB = a2 && J(coloana(s2, 'A')) === J(['Ana', 'Bogdan', 'Dan']) && J(coloana(s2, 'B')) === J([7, 8, 9]) && J(coloana(s2, 'C')) === J([10, 8, 6]);
  // c) B2:C4 (doua coloane din trei): fara Sort Warning, sorteaza selectia dupa B
  const w = await nou();
  await trageSelectie(w, 'B2', 'C4'); await mso(w, 'SortAscendingExcel', 'Data');
  const a3 = await fereastraDeschisa(w, 'Sort Warning');
  const s3 = await st(w);
  const okC = !a3 && J(coloana(s3, 'B')) === J([7, 8, 9]) && J(coloana(s3, 'C')) === J([8, 6, 10]) && J(coloana(s3, 'A')) === J(['Ana', 'Bogdan', 'Dan']);
  // d) toata coloana B aleasa din litera ei: tot „o singura coloana cu date alaturi” -> Excel arata Sort Warning
  const v = await nou();
  await antet(v, 'antet_coloana', 'B').click(); await pauza(100); await mso(v, 'SortAscendingExcel', 'Data');
  const a4 = await fereastraDeschisa(v, 'Sort Warning');
  const s4 = await st(v);
  return { ok: okA && okB && okC && a4, vazut: `B2:B4+A→Z: Sort Warning=${a1}, Sort direct → A=${J(coloana(s1, 'A'))} B=${J(coloana(s1, 'B'))}; Continue → A=${J(coloana(s2, 'A'))} B=${J(coloana(s2, 'B'))} C=${J(coloana(s2, 'C'))}; B2:C4+A→Z: Sort Warning=${a3} (aștept fără), B=${J(coloana(s3, 'B'))} C=${J(coloana(s3, 'C'))}; litera B+A→Z: Sort Warning=${a4} (aștept da), A=${J(coloana(s4, 'A'))} B=${J(coloana(s4, 'B'))}` };
});

// fereastra Sort: alege coloana unui nivel (lista „Sort by” / „Then by”)
async function alegeNivel(p, eticheta, coloanaNume, alCatelea = 0) {
  const cb = p.locator(vis(`${R} [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-eticheta="${eticheta}"], ${R} [data-lh-tip="Window"] [data-lh-tinta="camp:${eticheta}"]`)).nth(alCatelea);
  if (!(await cb.count())) throw new Error(`fereastra Sort nu are lista „${eticheta}”`);
  await apasa(p, cb);
  const opt = p.locator(vis(`${R} [role="option"][data-lh-eticheta="${esc(coloanaNume)}"], ${R} [data-lh-tinta="meniu:${esc(coloanaNume)}"]`)).last();
  if (!(await opt.count())) throw new Error(`lista „${eticheta}” nu are „${coloanaNume}”`);
  await apasa(p, opt);
}
const valoareLista = (p, eticheta, alCatelea = 0) => p.evaluate(([R, et, i]) => {
  const c = [...document.querySelectorAll(`${R} [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-eticheta="${et}"], ${R} [data-lh-tip="Window"] [data-lh-tinta="camp:${et}"]`)].filter(e => e.getBoundingClientRect().width > 0)[i];
  if (!c) return null; const inp = c.querySelector('input') || (c.tagName === 'INPUT' ? c : null);
  return (inp ? inp.value : c.innerText || c.getAttribute('data-lh-valoare') || '').trim();
}, [R, eticheta, alCatelea]);
async function fereastraSort(p, celulaStart = 'A2') {
  await clicCelula(p, celulaStart);
  await mso(p, 'SortDialog', 'Data');
  if (!(await fereastraDeschisa(p, 'Sort'))) throw new Error('fereastra Sort nu s-a deschis');
}
async function adaugaNivel(p) { await clicEt(p, 'Add Level', { tip: 'Button' }); }

def('excel-b-F013', 'Mută nivelul ales mai sus / mai jos (▲ Move Up / ▼ Move Down) în fereastra Sort', async p => {
  await fereastraSort(p);
  await alegeNivel(p, 'Sort by', 'Nota 1');
  await adaugaNivel(p);
  await alegeNivel(p, 'Then by', 'Nota 2');
  await clicEt(p, 'Move Up', { tip: 'Button' });
  const dupaSus = await valoareLista(p, 'Sort by');
  await clicEt(p, 'Move Down', { tip: 'Button' });
  const dupaJos = await valoareLista(p, 'Sort by');
  await clicEt(p, 'Move Up', { tip: 'Button' });
  const final = await valoareLista(p, 'Sort by');
  await ok(p);
  const s = await st(p);
  const okS = J(coloana(s, 'A')) === J(['Dan', 'Bogdan', 'Ana']);
  return { ok: dupaSus === 'Nota 2' && dupaJos === 'Nota 1' && final === 'Nota 2' && okS, vazut: `primul nivel: după ▲ ${J(dupaSus)}, după ▼ ${J(dupaJos)}, după ▲ ${J(final)}; după OK A2:A4=${J(coloana(s, 'A'))} (aștept sortat după Nota 2: Dan, Bogdan, Ana)` };
});

def('excel-b-F015', 'Numele ordinii după tipul coloanei: A to Z / Smallest to Largest / Oldest to Newest', async p => {
  await scrieIn(p, 'E1', 'Data');
  for (const [a, t] of [['E2', '15.03.2026'], ['E3', '01.02.2026'], ['E4', '20.12.2025']]) await scrieIn(p, a, t);
  const s0 = await st(p);
  if (typeof val(s0, 'E2') !== 'number') return { ok: false, vazut: `precondiție: „15.03.2026” nu a devenit dată (E2=${J(s0.celule.E2)})` };
  await fereastraSort(p);
  await alegeNivel(p, 'Sort by', 'Data'); const colData = await valoareLista(p, 'Sort by'); const oData = await valoareLista(p, 'Order');
  const cbo = p.locator(vis(`${R} [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-eticheta="Order"], ${R} [data-lh-tip="Window"] [data-lh-tinta="camp:Order"]`)).first();
  await apasa(p, cbo);
  const variante = await p.evaluate(R => [...document.querySelectorAll(R + ' [role="listbox"] [role="option"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-eticheta') || e.innerText.trim()), R);
  await p.keyboard.press('Escape'); await pauza(150);
  if (!(await fereastraDeschisa(p, 'Sort'))) await fereastraSort(p);
  await alegeNivel(p, 'Sort by', 'Nota 1'); const oNum = await valoareLista(p, 'Order');
  await alegeNivel(p, 'Sort by', 'Elev'); const oText = await valoareLista(p, 'Order');
  return { ok: oData === 'Oldest to Newest' && variante.includes('Newest to Oldest') && oNum === 'Smallest to Largest' && oText === 'A to Z', vazut: `Sort by ${J(colData)} → Order ${J(oData)}, variante ${J(variante)}; pentru „Nota 1”: ${J(oNum)}; pentru „Elev”: ${J(oText)}` };
});

def('excel-b-F017', 'Mesajul la aceeași coloană pe două niveluri („… is being sorted by values more than once”)', async p => {
  await fereastraSort(p);
  await alegeNivel(p, 'Sort by', 'Nota 1');
  await adaugaNivel(p);
  await alegeNivel(p, 'Then by', 'Nota 1');
  await ok(p);
  const m = await mesaje(p);
  return { ok: /more than once/i.test(m), vazut: `după OK: ${m.slice(0, 260)}` };
});

def('excel-b-F020', 'Home › Editing › Sort & Filter: meniul cu Sort A to Z, Sort Z to A, Custom Sort…', async p => {
  await clicCelula(p, 'A2');
  await mso(p, 'SortFilterMenu', 'Home');
  const are = {};
  for (const et of ['Sort A to Z', 'Sort Z to A', 'Custom Sort']) are[et] = !!(await gasesteMeniu(p, et));
  if (!are['Sort Z to A']) return { ok: false, vazut: `meniul are: ${J(are)}, nesimulat=${J(await nesimulat(p))}` };
  await apasa(p, await gasesteMeniu(p, 'Sort Z to A'));
  const s = await st(p);
  const okS = J(coloana(s, 'A')) === J(['Dan', 'Bogdan', 'Ana']) && J(coloana(s, 'B')) === J([8, 7, 9]);
  return { ok: Object.values(are).every(Boolean) && okS, vazut: `meniul are: ${J(are)}; Sort Z to A pe A2 → A=${J(coloana(s, 'A'))} B=${J(coloana(s, 'B'))} (aștept Dan, Bogdan, Ana / 8, 7, 9)` };
});

def('excel-b-F021', 'Sortare dintr-o celulă goală fără date în jur: mesajul „This can\'t be applied to the selected range…”', async p => {
  await clicCelula(p, 'H12');
  await mso(p, 'SortAscendingExcel', 'Data');
  const m = await mesaje(p); const nes = await nesimulat(p);
  return { ok: /can.?t be applied to the selected range/i.test(m), vazut: `după A→Z pe H12: ${m.slice(0, 200)}${nes.length ? ' / nesimulat: ' + J(nes) : ''}` };
});

def('excel-b-F022', 'Butonul de sortare apăsat în timp ce scrii într-o celulă nu sortează (Excel îl ține inactiv cât scrii)', async p => {
  // in Excel, cat timp scrii in celula (modul Enter/Edit) comenzile de pe panglica, si Sort, sunt inactive; vechiul cerea intai Enter
  await fila(p, 'Data');
  await clicCelula(p, 'A5'); await p.keyboard.type('Aaron'); await pauza(100);
  const b = p.locator(vis(`${R} [data-lh-id-mso="SortAscendingExcel"]`)).first();
  const bb = await cutie(b);
  await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await pauza(300);
  const s = await st(p);
  const nesortat = J(coloana(s, 'A')) === J(['Ana', 'Bogdan', 'Dan']);
  return { ok: nesortat, vazut: `scriu „Aaron” în A5 și apăs A→Z: A2:A4=${J(coloana(s, 'A'))}, A5=${J(val(s, 'A5'))}, ramane_in_editare=${J(s.ramane_in_editare)} (aștept nesortat)` };
});

def('excel-b-F133', 'Exersează pe variante (3 corecte la rând = stăpânit)', null);

// ---------- Tipuri de date (setari regionale romanesti: punct = separator de data si de mii, virgula = zecimale)
const serial = (an, luna, zi) => Math.round((Date.UTC(an, luna - 1, zi) - Date.UTC(1899, 11, 30)) / 864e5);
async function scrieSiCiteste(p, perechi) { for (const [a, t] of perechi) await scrieIn(p, a, t); return st(p); }

def('excel-a-F003', 'Scrie lună.an (6.75) și Excel face din el data iun.75', async p => {
  const s = await scrieSiCiteste(p, [['F2', '6.75']]);
  return { ok: val(s, 'F2') === serial(1975, 6, 1) && /^iun\.?-?\.?75$/i.test(String(txt(s, 'F2'))), vazut: `F2=${J(s.celule.F2)} (aștept valoarea ${serial(1975, 6, 1)} = 1 iunie 1975, afișat „iun.75”)` };
});

def('excel-a-F004', 'Scrie un număr cu punct de mii (1.250) și Excel îl ia drept 1250, cu separator de mii', async p => {
  const s = await scrieSiCiteste(p, [['F2', '1.250']]);
  return { ok: val(s, 'F2') === 1250 && txt(s, 'F2') === '1.250', vazut: `F2=${J(s.celule.F2)} (aștept valoarea 1250, afișat „1.250”)` };
});

def('excel-a-F005', 'Scrie o sumă cu „lei” (12 lei) și Excel o ține ca număr cu formatul lei (negativ cu roșu)', async p => {
  const s = await scrieSiCiteste(p, [['F2', '12 lei'], ['F3', '-5 lei']]);
  const culoare = await celula(p, 'F3').evaluate(e => { let x = e; while (x.firstElementChild && (x.firstElementChild.textContent || '').trim() === (e.textContent || '').trim()) x = x.firstElementChild; return getComputedStyle(x).color; });
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(culoare || ''); const rosu = !!m && +m[1] >= 170 && +m[2] < 90 && +m[3] < 90;
  const ok2 = val(s, 'F2') === 12 && /12/.test(txt(s, 'F2')) && /lei/.test(txt(s, 'F2'));
  const ok3 = val(s, 'F3') === -5 && /lei/.test(txt(s, 'F3')) && rosu;
  return { ok: ok2 && ok3, vazut: `F2=${J(s.celule.F2)}; F3=${J(s.celule.F3)} culoare ${culoare} (aștept 12 / -5 ca numere cu „lei”, negativul roșu)` };
});

def('excel-a-F006', 'Scrie un procent (10%) și Excel îl ține ca 0,1 cu formatul procent', async p => {
  const s = await scrieSiCiteste(p, [['F2', '10%']]);
  return { ok: val(s, 'F2') === 0.1 && txt(s, 'F2') === '10%', vazut: `F2=${J(s.celule.F2)} (aștept valoarea 0.1, afișat „10%”)` };
});

def('excel-a-F009', 'Scrie o oră (12:30, 12:30:15) și Excel o ține ca oră', async p => {
  const s = await scrieSiCiteste(p, [['F2', '12:30'], ['F3', '12:30:15']]);
  const ok2 = aproape(val(s, 'F2'), 12.5 / 24, 1e-9) && txt(s, 'F2') === '12:30';
  const ok3 = aproape(val(s, 'F3'), (12 * 3600 + 30 * 60 + 15) / 86400, 1e-9) && txt(s, 'F3') === '12:30:15';
  return { ok: ok2 && ok3, vazut: `F2=${J(s.celule.F2)}, F3=${J(s.celule.F3)} (aștept fracțiuni de zi 0,5208… / 0,5210…, afișate ca oră)` };
});

def('excel-a-F013', 'Alte forme de număr: 1,5E3 (științific), 1 1/2 (fracție), (5) = −5, € 5', async p => {
  const s = await scrieSiCiteste(p, [['F2', '1,5E3'], ['F3', '1 1/2'], ['F4', '(5)'], ['F5', '€ 5']]);
  const ok = val(s, 'F2') === 1500 && /E\+?0?3$/i.test(String(txt(s, 'F2'))) && val(s, 'F3') === 1.5 && txt(s, 'F3') === '1 1/2' && val(s, 'F4') === -5 && txt(s, 'F4') === '-5' && val(s, 'F5') === 5;
  return { ok, vazut: `F2=${J(s.celule.F2)} (1500, „1,50E+03”), F3=${J(s.celule.F3)} (1.5, „1 1/2”), F4=${J(s.celule.F4)} (-5), F5=${J(s.celule.F5)} (5)` };
});

def('excel-a-F021', 'Pe telefon: butonul „\' apostrof drept” pune apostroful drept la începutul barei de formule', async p => {
  // nu e o comanda a Excelului real: ajutorul paginii vechi pentru tastaturile de telefon care pun ’ in loc de '
  await celula(p, 'F2').tap(); await pauza(150);
  const b = await butonEcran(p, "apostrof|apostrophe|^['’]$");
  if (!b) return { ok: false, vazut: 'pe telefon nu există niciun buton „\' apostrof drept” (căutat după eticheta/aria-label/text)' };
  await p.touchscreen.tap(b.x, b.y); await pauza(200);
  const bara = await p.locator(vis(`${R} [data-lh-tinta="bara_formule"] input, ${R} input[aria-label="Formula Bar"]`)).first().inputValue().catch(() => null);
  await p.keyboard.type('007'); await p.keyboard.press('Enter'); await pauza(200);
  const s = await st(p);
  return { ok: val(s, 'F2') === '007' && txt(s, 'F2') === '007', vazut: `buton „${b.et}”; bara de formule după atingere: ${J(bara)}; după 007 + Enter: F2=${J(s.celule.F2)} (aștept textul „007”)` };
}, { tel: true });

// ======================================================================================= rularea
function ruleazaUna(browser, base, pr) {
  return new Promise(resolve => {
    const contexte = [];
    let terminat = false;
    const deschideNou = async tel => { const d = await deschide(browser, base, tel); contexte.push(d.ctx); if (terminat) await d.ctx.close().catch(() => {}); return d; };
    const timer = setTimeout(() => fin({ ok: false, vazut: 'proba a depășit 20 s' }), PROBA_MS);
    async function fin(r) {
      if (terminat) return; terminat = true; clearTimeout(timer);
      scrie(r.ok ? 'PASS' : 'FAIL', pr.id, pr.nume, r.vazut);
      await Promise.all(contexte.map(c => c.close().catch(() => {})));
      resolve();
    }
    (async () => {
      const { p, erori } = await deschideNou(pr.opt.tel);
      const r = await pr.fn(p, async () => (await deschideNou(pr.opt.tel)).p);
      if (erori.length && !r.ok) r.vazut += ' / eroare în pagină: ' + erori.slice(0, 2).join(' | ');
      return r;
    })().then(fin, e => fin({ ok: false, vazut: 'proba a crăpat: ' + String((e && e.message) || e).split('\n')[0].slice(0, 300) }));
  });
}

async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, i = 0;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (; i < PROBE.length; i++) {
      const pr = PROBE[i];
      if (!pr.fn) { scrie('SKIP', pr.id, pr.nume, 'strat de exercițiu: ține de lecție / motorul jocurilor (variante, „stăpânit”), nu de aplicația Excel'); continue; }
      await ruleazaUna(browser, base, pr);
    }
  } catch (e) {
    for (; i < PROBE.length; i++) if (PROBE[i].fn) scrie('FAIL', PROBE[i].id, PROBE[i].nume, 'nu s-a putut rula: ' + e.message.split('\n')[0]);
  } finally {
    if (browser) await browser.close().catch(() => {});
    srv.close();
  }
  console.log(`DURATA ${Math.round((Date.now() - t0) / 1000)} s, ${PROBE.length} probe`);
  console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL} SKIP=${rezultate.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rezultate.FAIL));
}

main().catch(e => {
  console.log('FAIL harness - ' + e.message);
  console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL + 1} SKIP=${rezultate.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rezultate.FAIL + 1));
});
