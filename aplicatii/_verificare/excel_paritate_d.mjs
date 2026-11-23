// Probe de paritate Excel, felia d (noapte_excel_22_11/felii/felie_d.json, 41 de randuri): foi, formatare (font, umplere,
// Clear Formats), greselile de scriere a formulelor, scrierea functiilor, Sigma (AutoSum), grafice.
// Fiecare proba JOACA gestul elevului (clicuri si taste reale prin Playwright, pe elementele vizibile gasite dupa
// data-lh-tinta / data-lh-eticheta / aria-label, ca in Excelul real, interfata in engleza) si verifica REZULTATUL
// pe ecran (DOM) si/sau in LH.aplicatii.stare('excel'). Tinta = Excelul adevarat; unde vechiul simulator difera,
// proba urmeaza Excelul si o spune intr-un comentariu.
// Pornirea foii: LH.aplicatii.deschide('excel', {continut}) = API-ul public (api_biblioteca.md §1, §7.1), ca la rulatorul
// scenariilor; restul e gest.
// Rulare:  node aplicatii/_verificare/excel_paritate_d.mjs   (din radacina depozitului; merge si cu cale absoluta)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: PASS / FAIL / SKIP pe fiecare proba; ultimele trei linii: REZUMAT, „TOTAL FAIL”, numarul de FAIL.
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
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

const rezultate = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, nume, detalii) {
  rezultate[stare]++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const R = '[data-lh-aplicatie="excel"]';
const css = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
const nf = f => String(f == null ? '' : f).replace(/\s+/g, '').replace(/;/g, ',').toUpperCase();
const verdict = (probleme, ok) => (probleme.length ? { ok: false, det: probleme.join('; ') } : { ok: true, det: ok });

// ---------------------------------------------------------------- deschiderea (context proaspat pe fiecare proba)
const TEL = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };
async function deschide(ctx, base, continut) {
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(R, { timeout: 15000 });
  await p.waitForFunction(() => !!(window.LH && window.LH.aplicatii && window.LH.aplicatii.stare), null, { timeout: 15000 });
  if (continut) {
    await p.evaluate(c => window.LH.aplicatii.deschide('excel', { continut: c, focus: true }), continut);
    await p.waitForSelector(R, { timeout: 15000 });
  }
  await pauza(350);
  return { p, erori };
}

// ---------------------------------------------------------------- ajutoare de gest (doar elemente vizibile)
const st = p => p.evaluate(() => window.LH.aplicatii.stare('excel'));
async function primulVizibil(p, sel) {
  const L = p.locator(sel);
  const n = await L.count();
  for (let i = 0; i < n; i++) { const x = L.nth(i); if (await x.isVisible().catch(() => false)) return x; }
  return null;
}
const selTinta = t => `${R} [data-lh-tinta=${css(t)}]`;
async function tinta(p, t) { return primulVizibil(p, selTinta(t)); }
async function clicTinta(p, t, opt) {
  const x = await tinta(p, t);
  if (!x) throw new Error(`nu văd pe ecran ținta ${t}`);
  await x.click(opt);
  await pauza(180);
}
// un rând de meniu / galerie / fereastră, după eticheta de pe ecran (ca în Excelul real). Antetele de rând / coloană,
// celulele și filele foilor NU sunt rânduri de meniu (antetul rândului 8 are și el eticheta „8”).
const NU_MENIU = ':not([data-lh-tinta="celula"]):not([data-lh-tinta="antet_rand"]):not([data-lh-tinta="antet_coloana"]):not([data-lh-tinta="fila_foii"])';
async function articol(p, et, { inFereastra = false, doarLista = false } = {}) {
  const e = css(et);
  const sel = inFereastra
    ? [`${R} [data-lh-tinta=${css('fereastra:' + et)}]`, `${R} [data-lh-tip="Window"] [data-lh-eticheta=${e}]`, `${R} [role="dialog"] [data-lh-eticheta=${e}]`, `${R} [data-lh-tip="Window"] [aria-label=${e}]`]
    : doarLista
      ? [`${R} [data-lh-tinta=${css('meniu:' + et)}]`, ...['ListItem', 'MenuItem'].map(t => `${R} [data-lh-tip="${t}"][data-lh-eticheta=${e}]`), ...['option', 'menuitem', 'menuitemradio'].map(r => `${R} [role="${r}"][aria-label=${e}]`)]
      : [`${R} [data-lh-tinta=${css('meniu:' + et)}]`, `${R} [data-lh-tinta=${css('fereastra:' + et)}]`, `${R} [data-lh-eticheta=${e}]${NU_MENIU}`, `${R} [aria-label=${e}]${NU_MENIU}`, `${R} [title=${e}]${NU_MENIU}`];
  for (const s of sel) { const x = await primulVizibil(p, s); if (x) return x; }
  return null;
}
async function clicArticol(p, et, opt = {}) {
  const x = await articol(p, et, opt);
  if (!x) throw new Error(`nu văd pe ecran „${et}”`);
  await x.click();
  await pauza(250);
}
const celula = (p, a) => p.locator(`${R} [data-lh-tinta="celula"][data-lh-id="${a}"]`).first();
async function clicCelula(p, a, opt) { await celula(p, a).click(opt); await pauza(120); }
async function scrieIn(p, a, text, tasta = 'Enter') {
  await clicCelula(p, a);
  await p.keyboard.type(text);
  await pauza(120);
  if (tasta) { await p.keyboard.press(tasta); await pauza(250); }
}
const fila = (p, nume) => p.locator(`${R} [data-lh-tinta="fila_foii"][data-lh-id=${css(nume)}]`).first();
async function filaVizibila(p, nume) {   // fila e pe ecran și NU e acoperită (punctul din mijloc cade pe ea)
  const loc = fila(p, nume);
  if ((await loc.count()) === 0) return false;
  const b = await loc.boundingBox().catch(() => null);
  if (!b || b.width < 2) return false;
  return p.evaluate(([x, y, n]) => { const e = document.elementFromPoint(x, y); const f = e && e.closest('[data-lh-tinta="fila_foii"]'); return !!f && f.getAttribute('data-lh-id') === n; }, [b.x + b.width / 2, b.y + b.height / 2, nume]);
}
// textele ferestrelor / mesajelor de pe ecran (ce citește elevul): ferestre, dialoguri, mesajul central, plus stare()
async function mesaje(p) {
  const dom = await p.evaluate(() => {
    const Rr = document.querySelector('[data-lh-aplicatie="excel"]');
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden'; };
    return [...Rr.querySelectorAll('[data-lh-tip="Window"],[role="dialog"],[role="alertdialog"],[data-lh-dialog-intrebare],[data-lh-nesimulat],[role="status"],[role="alert"],[data-lh-indiciu]')]
      .filter(vis).map(e => e.innerText || '').join(' | ');
  });
  const s = await st(p);
  const fm = s.fereastra_mesaj ? [s.fereastra_mesaj.titlu, ...(s.fereastra_mesaj.texte || [])].join(' ') : '';
  const dl = s.dialog ? [s.dialog.titlu, s.dialog.intrebare].join(' ') : '';
  return [dom, fm, dl].filter(x => x && x.trim()).join(' | ').replace(/[\u202a-\u202e]/g, '');
}
async function fereastraDeschisa(p) {
  const s = await st(p);
  if (s.dialog || s.fereastra_mesaj) return true;
  return !!(await primulVizibil(p, `${R} [data-lh-tip="Window"], ${R} [role="dialog"], ${R} [role="alertdialog"]`));
}
// textul formulei pe care o scrie elevul (bara de formule / caseta din celulă), cu stare() ca rezervă
async function textEditare(p) {
  const dom = await p.evaluate(() => {
    const Rr = document.querySelector('[data-lh-aplicatie="excel"]');
    const fb = Rr.querySelector('[data-lh-tinta="bara_formule"]');
    const inp = fb && (fb.matches('input,textarea') ? fb : fb.querySelector('input,textarea'));
    if (inp && inp.value) return inp.value;
    const alt = Rr.querySelector('input[aria-label="Formula Bar"],textarea[aria-label="Formula Bar"]');
    if (alt && alt.value) return alt.value;
    return fb ? (fb.innerText || '').trim() : '';
  });
  if (dom) return dom.replace(/[\u202a-\u202e]/g, '');
  const s = await st(p);
  const a = s.selectie && s.selectie.activa;
  return a && s.celule[a] && s.celule[a].editare ? String(s.celule[a].valoare) : '';
}
// cum se vede celula: mărimea și culoarea literelor (elementul care ține textul), umplerea
async function stilCelula(p, a) {
  return p.evaluate(a => {
    const c = document.querySelector(`[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${a}"]`);
    if (!c) return null;
    const toate = [c, ...c.querySelectorAll('*')];
    const cuText = toate.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const e = cuText[cuText.length - 1] || c;
    const cs = getComputedStyle(e);
    let bg = 'rgba(0, 0, 0, 0)';
    for (const x of toate) { const b = getComputedStyle(x).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') { bg = b; break; } }
    return { fs: parseFloat(cs.fontSize), color: cs.color, bg, text: (c.innerText || '').trim() };
  }, a);
}
const rgb = s => { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(s || ''); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] } : null; };
const aproape = (s, hex, tol = 4) => { const c = rgb(s); if (!c) return false; const h = hex.replace('#', ''); const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); return Math.abs(c.r - r) <= tol && Math.abs(c.g - g) <= tol && Math.abs(c.b - b) <= tol; };
const faraUmplere = s => { const c = rgb(s); return !c || c.a === 0 || (c.r > 250 && c.g > 250 && c.b > 250); };
const inaltimeRand = (p, r) => p.locator(`${R} [data-lh-tinta="antet_rand"][data-lh-id="${r}"]`).first().boundingBox().then(b => (b ? b.height : 0));

// grafic: inserează Clustered Column din fila Insert (drumul obișnuit), cu celula activă în tabel
async function insereazaGrafic(p, tip = 'Clustered Column') {
  await clicTinta(p, 'fila:Insert');
  await clicTinta(p, 'meniu_derulant:Insert/Charts/Insert Column or Bar Chart');
  await clicArticol(p, tip);
  await pauza(400);
  const s = await st(p);
  if (!s.tip_grafic) throw new Error('graficul nu a apărut după Insert › ' + tip);
  return s;
}
// unde apare un text în grafic (fără meniurile / bifele / ferestrele care pot sta deasupra lui): poziții față de grafic
async function texteInGrafic(p, txt) {
  return p.evaluate(txt => {
    const g = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-tinta="grafic"]');
    if (!g) return null;
    const gr = g.getBoundingClientRect();
    const out = [];
    const w = document.createTreeWalker(g, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (n.textContent.trim() !== txt) continue;
      const el = n.parentElement;
      const sus = el.closest('[role="menu"],[role="menuitem"],[role="checkbox"],[role="dialog"],[role="option"],[data-lh-tip="CheckBox"],[data-lh-tip="MenuItem"],[data-lh-tip="ListItem"],[data-lh-tip="Menu"],[data-lh-tip="Window"],[data-lh-tip="Pane"]');
      if (sus && g.contains(sus)) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      out.push({ x: (r.x + r.width / 2 - gr.x) / gr.width, y: (r.y + r.height / 2 - gr.y) / gr.height });
    }
    return out;
  }, txt);
}
async function clicAddChartElement(p, element, optiune) {
  if (!(await tinta(p, 'meniu_derulant:Chart Design/Chart Layouts/Add Chart Element'))) await clicTinta(p, 'fila:Chart Design');
  await clicTinta(p, 'meniu_derulant:Chart Design/Chart Layouts/Add Chart Element');
  await clicArticol(p, element);
  await pauza(200);
  const x = await articol(p, optiune, { doarLista: true });
  if (!x) {
    const m = (await mesajNesimulat(p)) || (await mesaje(p));
    await p.keyboard.press('Escape');
    throw new Error(`după Add Chart Element › ${element} nu văd „${optiune}” (ecran: ${m.replace(/\s+/g, ' ').slice(0, 80) || 'nimic'})`);
  }
  await x.click();
  await pauza(300);
}
async function mesajNesimulat(p) {
  return p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-nesimulat]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim()).join(' | '));
}

const NOTE = { A1: 'Elev', B1: 'Nota 1', C1: 'Nota 2', A2: 'Ana', B2: 9, C2: 10, A3: 'Bogdan', B3: 7, C3: 8, A4: 'Dan', B4: 8, C4: 6 };
const COLOANA = { B1: 'Nota', B2: 9, B3: 7, B4: 8, B5: 9, B6: 6 };   // suma B2:B6 = 39

// ================================================================ PROBELE
const PROBE = [];
const proba = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, ...opt });

// ---------------------------------------------------------------- FOI
proba('excel-a-F160', "Redenumire: 'Note devine Note; Note' dă mesajul „invalid name”", async ({ p }) => {
  const pr = [];
  await fila(p, 'Sheet1').dblclick();               // m1-l03: „dublu clic pe filă, scrii, Enter”
  await pauza(250);
  await p.keyboard.press('Control+A');
  await p.keyboard.type("'Note");
  await p.keyboard.press('Enter');
  await pauza(300);
  let s = await st(p);
  const prima = s.foi[0];
  if (prima !== 'Note') pr.push(`'Note → fila se numește „${prima}” (aștept Note)`);
  if (await fereastraDeschisa(p)) { pr.push("'Note a deschis o fereastră: " + (await mesaje(p)).slice(0, 80)); await p.keyboard.press('Escape'); await pauza(200); }
  await fila(p, prima).dblclick();
  await pauza(250);
  await p.keyboard.press('Control+A');
  await p.keyboard.type("Note'");
  await p.keyboard.press('Enter');
  await pauza(350);
  const m = await mesaje(p);
  s = await st(p);
  if (!/typed an invalid name/i.test(m)) pr.push(`Note' → niciun mesaj „You typed an invalid name…” (ecran: ${m.replace(/\s+/g, ' ').slice(0, 90) || 'nimic'})`);
  if (s.foi.includes("Note'")) pr.push("fila a primit numele Note'");
  return verdict(pr, "'Note → Note; Note' → mesajul „invalid name”");
});

proba('excel-a-F161', 'Ctrl+Z desface redenumirea foii (și numai pe ea)', async ({ p }) => {
  await clicTinta(p, 'fila_foii_buton:Add Sheet');
  let s = await st(p);
  if (s.foi.join() !== 'Sheet1,Sheet2') return { ok: false, det: 'pregătire: Add Sheet a dat ' + JSON.stringify(s.foi) };
  await fila(p, 'Sheet2').dblclick();
  await pauza(250);
  await p.keyboard.press('Control+A');
  await p.keyboard.type('Note');
  await p.keyboard.press('Enter');
  await pauza(300);
  s = await st(p);
  if (s.foi.join() !== 'Sheet1,Note') return { ok: false, det: 'pregătire: redenumirea a dat ' + JSON.stringify(s.foi) };
  await p.keyboard.press('Control+Z');
  await pauza(350);
  s = await st(p);
  const pr = [];
  if (s.foi.join() !== 'Sheet1,Sheet2') pr.push(`după Ctrl+Z foile sunt ${JSON.stringify(s.foi)} (aștept ["Sheet1","Sheet2"])`);
  if (!(await filaVizibila(p, 'Sheet2'))) pr.push('fila Sheet2 nu e pe ecran');
  return verdict(pr, 'Note → Ctrl+Z → Sheet2, foaia adăugată înainte rămâne');
});

async function ascunde(p, nume) {
  await fila(p, nume).click({ button: 'right' });
  await pauza(250);
  await clicArticol(p, 'Hide');
  await pauza(300);
}
proba('excel-a-F169', 'Ascunde o foaie: clic dreapta pe filă › Hide', async ({ p }) => {
  await clicTinta(p, 'fila_foii_buton:Add Sheet');
  let s = await st(p);
  if (s.foi.join() !== 'Sheet1,Sheet2') return { ok: false, det: 'pregătire: Add Sheet a dat ' + JSON.stringify(s.foi) };
  await ascunde(p, 'Sheet2');
  s = await st(p);
  const pr = [];
  if (await filaVizibila(p, 'Sheet2')) pr.push('fila Sheet2 e încă pe ecran');
  if (s.foaie_activa !== 'Sheet1') pr.push(`foaia activă = ${s.foaie_activa} (aștept Sheet1)`);
  // ascunsă, nu ștearsă: foaia rămâne în registru (Worksheets o cuprinde și ascunsă)
  if (!JSON.stringify(s).includes('"Sheet2"')) pr.push('Sheet2 a dispărut din registru (ștearsă, nu ascunsă)');
  const nes = await mesajNesimulat(p);
  if (/Hide/.test(nes)) pr.push('mesaj: ' + nes.slice(0, 80));
  return verdict(pr, 'Sheet2 ascunsă, Sheet1 activă, foaia rămâne în registru');
});

proba('excel-a-F170', 'Reafișează o foaie ascunsă: clic dreapta › Unhide... › foaia › OK', async ({ p }) => {
  await clicTinta(p, 'fila_foii_buton:Add Sheet');
  await scrieIn(p, 'A1', 'x');                      // ca să recunosc foaia când revine
  await ascunde(p, 'Sheet2');
  if (await filaVizibila(p, 'Sheet2')) return { ok: false, det: 'nu am putut ascunde Sheet2 (Hide, F169, lipsește), deci nu am ce reafișa' };
  await fila(p, 'Sheet1').click({ button: 'right' });
  await pauza(250);
  const un = await articol(p, 'Unhide...');
  if (!un) return { ok: false, det: 'nu văd „Unhide...” în meniul filei' };
  if ((await un.getAttribute('aria-disabled')) === 'true') return { ok: false, det: '„Unhide...” e gri deși Sheet2 e ascunsă' };
  await un.click();
  await pauza(300);
  const rand = await articol(p, 'Sheet2', { inFereastra: true });
  if (!rand) return { ok: false, det: 'fereastra Unhide nu arată Sheet2 (ecran: ' + (await mesaje(p)).slice(0, 80) + ')' };
  await rand.click();
  await pauza(150);
  await clicArticol(p, 'OK', { inFereastra: true });
  await pauza(300);
  const s = await st(p);
  const pr = [];
  if (!(await filaVizibila(p, 'Sheet2'))) pr.push('fila Sheet2 nu a revenit pe ecran');
  if (s.foaie_activa !== 'Sheet2') pr.push(`foaia activă = ${s.foaie_activa} (aștept Sheet2)`);
  else if (!s.celule.A1 || s.celule.A1.valoare !== 'x') pr.push('Sheet2 a revenit fără datele ei (A1 ≠ x)');
  return verdict(pr, 'Unhide › Sheet2 › OK: fila revine, activă, cu datele ei');
});

proba('excel-a-F175', 'Ctrl+Z desface mutarea unei foi (Move or Copy › Before sheet)', async ({ p }) => {
  await clicTinta(p, 'fila_foii_buton:Add Sheet');
  await fila(p, 'Sheet2').click({ button: 'right' });
  await pauza(250);
  await clicArticol(p, 'Move or Copy...');
  await pauza(250);
  await clicArticol(p, 'Sheet1', { inFereastra: true });
  await clicArticol(p, 'OK', { inFereastra: true });
  await pauza(300);
  let s = await st(p);
  if (s.foi.join() !== 'Sheet2,Sheet1') return { ok: false, det: 'pregătire: mutarea a dat ' + JSON.stringify(s.foi) };
  // doar mutarea: copia de foaie urmată de Ctrl+Z e „NEPROBAT” pe Excelul real în comentariul vechiului (registru-foi.js:59)
  await p.keyboard.press('Control+Z');
  await pauza(350);
  s = await st(p);
  return verdict(s.foi.join() === 'Sheet1,Sheet2' ? [] : [`după Ctrl+Z foile sunt ${JSON.stringify(s.foi)} (aștept ["Sheet1","Sheet2"])`], 'mutată înaintea Sheet1, apoi Ctrl+Z o pune la loc');
});

proba('excel-a-F176', 'Filele care nu încap: săgețile ‹ › le aduc la vedere; tragerea filei lângă margine derulează', async ({ p }) => {
  const pr = [];
  const ultima = 'Luna16';
  if (await filaVizibila(p, ultima)) return { ok: false, det: 'pregătire: toate cele 16 file încap pe ecran, nu pot proba derularea' };
  const dr = await tinta(p, 'fila_foii_buton:Scroll Right');
  if (!dr) return { ok: false, det: 'nu văd săgeata Scroll Right' };
  if ((await dr.getAttribute('aria-disabled')) === 'true') pr.push('Scroll Right e gri deși 6+ file nu se văd');
  for (let i = 0; i < 20 && !(await filaVizibila(p, ultima)); i++) { await dr.click({ force: true }).catch(() => {}); await pauza(80); }
  if (!(await filaVizibila(p, ultima))) pr.push(`după 20 de clicuri pe ›, fila ${ultima} tot nu se vede`);
  else {
    await fila(p, ultima).click();
    await pauza(200);
    if ((await st(p)).foaie_activa !== ultima) pr.push(`clic pe ${ultima} nu a activat-o`);
    const st_ = await tinta(p, 'fila_foii_buton:Scroll Left');
    for (let i = 0; i < 20 && st_ && !(await filaVizibila(p, 'Luna1')); i++) { await st_.click({ force: true }).catch(() => {}); await pauza(80); }
    if (!(await filaVizibila(p, 'Luna1'))) pr.push('după 20 de clicuri pe ‹, Luna1 nu revine la vedere');
  }
  if (pr.length) return verdict(pr);
  // tragerea filei Luna1 până la marginea din dreapta a șirului de file: șirul se derulează singur (filele ascunse ies la vedere)
  const ascunse = [];
  for (let k = 1; k <= 16; k++) if (!(await filaVizibila(p, 'Luna' + k))) ascunse.push('Luna' + k);
  const vizibile = [];
  for (let k = 1; k <= 16; k++) if (!ascunse.includes('Luna' + k)) vizibile.push('Luna' + k);
  const b1 = await fila(p, 'Luna1').boundingBox();
  const bu = await fila(p, vizibile[vizibile.length - 1]).boundingBox();
  await p.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2);
  await p.mouse.down();
  await p.mouse.move(b1.x + b1.width / 2 + 30, b1.y + b1.height / 2, { steps: 4 });
  const xm = bu.x + bu.width - 6, ym = bu.y + bu.height / 2;
  for (let i = 0; i < 12; i++) { await p.mouse.move(xm + (i % 2 ? 4 : 0), ym, { steps: 2 }); await pauza(110); }
  let iesite = 0;
  for (const n of ascunse) if (await filaVizibila(p, n)) iesite++;
  await p.keyboard.press('Escape');
  await p.mouse.up();
  await pauza(200);
  return verdict(iesite > 0 ? [] : [`ținută lângă marginea din dreapta ~1,3 s, bara filelor nu s-a derulat (0 din ${ascunse.length} file ascunse au ieșit la vedere)`],
    `› / ‹ aduc filele la vedere; tragerea lângă margine a scos ${iesite} file`);
}, { continut: { foi: Array.from({ length: 16 }, (_, i) => ({ nume: 'Luna' + (i + 1), celule: { A1: i + 1 } })) } });

proba('excel-a-F177', 'Meniul filei de la tastatură (Shift+F10, tasta Meniu) și alegerea filei cu Enter / Spațiu', async ({ p }) => {
  const pr = [];
  const focus = async n => { await fila(p, n).focus().catch(() => {}); await pauza(100); return p.evaluate(n => { const a = document.activeElement; const f = a && a.closest('[data-lh-tinta="fila_foii"]'); return !!f && f.getAttribute('data-lh-id') === n; }, n); };
  if (!(await focus('Sheet1'))) return { ok: false, det: 'fila Sheet1 nu poate primi focusul tastaturii (nu e accesibilă din tastatură)' };
  await p.keyboard.press('Enter');
  await pauza(200);
  if ((await st(p)).foaie_activa !== 'Sheet1') pr.push('Enter pe fila Sheet1 nu a activat-o');
  if (await focus('Sheet2')) {
    await p.keyboard.press(' ');
    await pauza(200);
    if ((await st(p)).foaie_activa !== 'Sheet2') pr.push('Spațiu pe fila Sheet2 nu a activat-o');
  } else pr.push('Sheet2 nu primește focusul');
  for (const tasta of ['Shift+F10', 'ContextMenu']) {
    await focus('Sheet2');
    await p.keyboard.press(tasta);
    await pauza(250);
    if (!(await articol(p, 'Rename'))) pr.push(`${tasta} pe filă nu a deschis meniul filei (Rename…)`);
    await p.keyboard.press('Escape');
    await pauza(150);
  }
  return verdict(pr, 'Enter / Spațiu activează fila; Shift+F10 și tasta Meniu deschid meniul ei');
}, { continut: { foi: [{ nume: 'Sheet1' }, { nume: 'Sheet2' }], fi: 1 } });

// telefonul: apăsare lungă cu degetul (atingere CDP ținută 700 ms). Chrome fără fereastră NU trimite „contextmenu” la
// apăsarea lungă — exact ca Safari pe iPhone; deci proba trece doar dacă biblioteca își măsoară singură apăsarea lungă.
proba('excel-a-F178', 'Pe telefon: apăsarea lungă pe filă deschide meniul filei', async ({ p, ctx }) => {
  const f = fila(p, 'Sheet1');
  await f.scrollIntoViewIfNeeded();
  const b = await f.boundingBox();
  if (!b) return { ok: false, det: 'fila Sheet1 nu e pe ecranul telefonului' };
  const cdp = await ctx.newCDPSession(p);
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await pauza(700);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await pauza(400);
  return verdict((await articol(p, 'Rename')) ? [] : ['după 700 ms de apăsare pe filă nu apare meniul filei (Rename…)'], 'apăsarea lungă deschide meniul filei');
}, { tel: true });

// ---------------------------------------------------------------- FORMATARE
proba('excel-b-F111', 'Home › Clear › Clear Formats scoate umplerea, centrarea și bordura (valoarea rămâne)', async ({ p }) => {
  // „Fără formatare” din jocurile vechi = în Excel: Home › Editing › Clear › Clear Formats
  await clicCelula(p, 'A2');
  await clicTinta(p, 'panglica:Home/Font/Fill Color');
  await clicTinta(p, 'panglica:Home/Alignment/Center');
  await clicTinta(p, 'panglica:Home/Font/Borders');
  let s = await st(p);
  const f0 = s.format_celule.A2 || {};
  if (!f0.umplere || !f0.aliniere || !f0.borduri) return { ok: false, det: 'pregătire: A2 nu a primit umplere + centrare + bordură: ' + JSON.stringify(f0) };
  await clicTinta(p, 'meniu_derulant:Home/Editing/Clear');
  const cf = await articol(p, 'Clear Formats');
  if (!cf) return { ok: false, det: 'nu văd „Clear Formats” după clic pe Clear ▾ (ecran: ' + (await mesaje(p)).replace(/\s+/g, ' ').slice(0, 90) + ')' };
  await cf.click();
  await pauza(300);
  await clicCelula(p, 'F10');
  s = await st(p);
  const f = s.format_celule.A2 || {};
  const pr = [];
  if (f.umplere || f.aliniere || f.borduri) pr.push('A2 are încă ' + JSON.stringify(f));
  const v = await stilCelula(p, 'A2');
  if (!faraUmplere(v.bg)) pr.push('pe ecran A2 e încă colorată: ' + v.bg);
  if (!s.celule.A2 || s.celule.A2.valoare !== 'Ana') pr.push('valoarea din A2 s-a pierdut');
  return verdict(pr, 'formatele au plecat, „Ana” a rămas');
}, { continut: { celule: NOTE, selectie: 'A2' } });

proba('excel-a-F111', 'Fill Color ▾: o culoare standard, o nuanță a temei, No Fill', async ({ p }) => {
  const pr = [];
  const alege = async (a, et) => {
    await clicCelula(p, a);
    await clicTinta(p, 'meniu_derulant:Home/Font/Fill Color');
    const x = await articol(p, et);
    if (!x) { const m = (await mesaje(p)).replace(/\s+/g, ' ').slice(0, 80); await p.keyboard.press('Escape'); throw new Error(`paleta Fill Color nu are „${et}” (ecran: ${m})`); }
    await x.click();
    await pauza(250);
  };
  await alege('A2', 'Light Green');
  await alege('A3', 'Blue, Accent 1, Lighter 80%');
  await clicCelula(p, 'F10');
  let a2 = await stilCelula(p, 'A2'), a3 = await stilCelula(p, 'A3');
  if (!aproape(a2.bg, '#92D050')) pr.push(`Light Green → A2 = ${a2.bg} (aștept rgb(146, 208, 80))`);
  if (!aproape(a3.bg, '#D9E1F2')) pr.push(`Blue, Accent 1, Lighter 80% → A3 = ${a3.bg} (aștept rgb(217, 225, 242))`);
  await alege('A2', 'No Fill');
  await clicCelula(p, 'F10');
  a2 = await stilCelula(p, 'A2');
  const s = await st(p);
  if (!faraUmplere(a2.bg) || (s.format_celule.A2 || {}).umplere) pr.push(`No Fill → A2 e încă ${a2.bg} / ${JSON.stringify(s.format_celule.A2)}`);
  return verdict(pr, 'Light Green, nuanța Lighter 80% și No Fill se văd pe celule');
}, { continut: { celule: NOTE, selectie: 'A2' } });

proba('excel-a-F106', 'Font Size ▾ › 20: literele cresc și rândul crește singur', async ({ p }) => {
  await clicCelula(p, 'A2');
  const s0 = await stilCelula(p, 'A2');
  const h0 = await inaltimeRand(p, 2);
  await clicTinta(p, 'meniu_derulant:Home/Font/Font Size');
  const lipsa = [];
  for (const m of [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]) if (!(await articol(p, String(m), { doarLista: true }))) lipsa.push(m);
  if (lipsa.length === 16) return { ok: false, det: 'lista Font Size nu se deschide (ecran: ' + (await mesaje(p)).replace(/\s+/g, ' ').slice(0, 80) + ')' };
  const pr = [];
  if (lipsa.length) pr.push('lista nu are mărimile ' + lipsa.join(', '));
  const x20 = await articol(p, '20', { doarLista: true });
  if (x20) { await x20.click(); await pauza(300); }
  await clicCelula(p, 'F10');
  const s1 = await stilCelula(p, 'A2');
  const h1 = await inaltimeRand(p, 2);
  const rap = s1.fs / s0.fs;
  if (Math.abs(rap - 20 / 11) > 0.08) pr.push(`literele din A2: ${s0.fs}px → ${s1.fs}px (aștept ×${(20 / 11).toFixed(2)})`);
  // Excel: Calibri 20 → rândul 26,25 pt față de 15 pt (×1,75)
  if (h1 < h0 * 1.5) pr.push(`rândul 2: ${h0}px → ${h1}px (aștept cam ×1,75, 26,25 pt)`);
  return verdict(pr, `font ${s0.fs}→${s1.fs}px, rândul ${h0}→${h1}px`);
}, { continut: { celule: NOTE, selectie: 'A2' } });

proba('excel-a-F107', 'Increase / Decrease Font Size: câte un pas din lista Excel (11 → 12 → 14 → 12)', async ({ p }) => {
  await clicCelula(p, 'A2');
  const s0 = await stilCelula(p, 'A2');
  await clicTinta(p, 'panglica:Home/Font/Increase Font Size');
  await clicTinta(p, 'panglica:Home/Font/Increase Font Size');
  const s1 = await stilCelula(p, 'A2');
  await clicTinta(p, 'panglica:Home/Font/Decrease Font Size');
  const s2 = await stilCelula(p, 'A2');
  const pr = [];
  if (Math.abs(s1.fs / s0.fs - 14 / 11) > 0.05) pr.push(`după A▲ A▲: ${s0.fs}px → ${s1.fs}px (aștept 14 pt, ×${(14 / 11).toFixed(2)})`);
  if (Math.abs(s2.fs / s0.fs - 12 / 11) > 0.05) pr.push(`după A▼: ${s2.fs}px (aștept 12 pt, ×${(12 / 11).toFixed(2)})`);
  const nes = await mesajNesimulat(p);
  if (/Font Size/.test(nes)) pr.push('mesaj: ' + nes.slice(0, 70));
  return verdict(pr, `${s0.fs} → ${s1.fs} → ${s2.fs}px`);
}, { continut: { celule: NOTE, selectie: 'A2' } });

proba('excel-a-F108', 'Butonul Font Color: roșu la început, apoi ultima culoare aleasă', async ({ p }) => {
  const pr = [];
  await clicCelula(p, 'A2');
  await clicTinta(p, 'panglica:Home/Font/Font Color');
  await clicCelula(p, 'F10');
  const a2 = await stilCelula(p, 'A2');
  if (!aproape(a2.color, '#FF0000')) pr.push(`Font Color pe A2 → literele ${a2.color} (aștept roșu rgb(255, 0, 0))`);
  // „apoi ultima culoare”: doar dacă paleta există (altfel e treaba lui F109)
  let parte2 = 'paleta lipsește, „ultima culoare” neverificată (vezi F109)';
  await clicCelula(p, 'A3');
  await clicTinta(p, 'meniu_derulant:Home/Font/Font Color');
  const albastru = await articol(p, 'Blue');
  if (albastru) {
    await albastru.click(); await pauza(250);
    await clicCelula(p, 'A4');
    await clicTinta(p, 'panglica:Home/Font/Font Color');
    await clicCelula(p, 'F10');
    const a4 = await stilCelula(p, 'A4');
    if (!aproape(a4.color, '#0070C0')) pr.push(`după Blue din paletă, butonul pune pe A4 ${a4.color} (aștept ultima culoare, Blue rgb(0, 112, 192))`);
    parte2 = 'apoi butonul pune ultima culoare (Blue)';
  } else await p.keyboard.press('Escape');
  return verdict(pr, 'roșu pe A2; ' + parte2);
}, { continut: { celule: NOTE, selectie: 'A2' } });

proba('excel-a-F109', 'Font Color ▾: Automatic, culorile temei cu nuanțe, Standard Colors', async ({ p }) => {
  await clicCelula(p, 'A2');
  await clicTinta(p, 'meniu_derulant:Home/Font/Font Color');
  const lipsa = [];
  for (const et of ['Automatic', 'Blue, Accent 1', 'Blue, Accent 1, Lighter 80%', 'Blue, Accent 1, Darker 50%', 'Dark Red', 'Red', 'Orange', 'Yellow', 'Light Green', 'Green', 'Light Blue', 'Blue', 'Dark Blue', 'Purple'])
    if (!(await articol(p, et))) lipsa.push(et);
  if (lipsa.length >= 13) return { ok: false, det: 'paleta Font Color nu se deschide (ecran: ' + (await mesaje(p)).replace(/\s+/g, ' ').slice(0, 80) + ')' };
  const pr = [];
  if (lipsa.length) pr.push('paleta nu are: ' + lipsa.join(', '));
  const b = await articol(p, 'Blue');
  if (b) { await b.click(); await pauza(250); }
  await clicCelula(p, 'F10');
  let a2 = await stilCelula(p, 'A2');
  if (!aproape(a2.color, '#0070C0')) pr.push(`Blue → literele din A2 ${a2.color} (aștept rgb(0, 112, 192))`);
  await clicCelula(p, 'A2');
  await clicTinta(p, 'meniu_derulant:Home/Font/Font Color');
  const au = await articol(p, 'Automatic');
  if (au) { await au.click(); await pauza(250); }
  await clicCelula(p, 'F10');
  a2 = await stilCelula(p, 'A2');
  if (!aproape(a2.color, '#000000', 10)) pr.push(`Automatic → literele ${a2.color} (aștept negru)`);
  return verdict(pr, 'paleta completă; Blue colorează, Automatic revine la negru');
}, { continut: { celule: NOTE, selectie: 'A2' } });

// ---------------------------------------------------------------- FORMULE
const FORM = { A1: 'a', B1: 'b', A2: 20, B2: 30 };
const acceptata = (s, a) => !s.ramane_in_editare && s.celule[a] && !s.celule[a].editare;

/* Proba corectată de dirijor pe 23.11.2026 după ce a întrebat Excelul REAL (16.0, instanță invizibilă prin COM,
   _campaign/…/runde/noapte_excel_22_11/excel_real_f071.json): =LEN(„Ana”) (ghilimele românești jos-sus) e REFUZATĂ de Excel
   (excepție la scriere), iar =LEN(“Ana”) (ghilimele englezești curbe) e primită și arată #NAME?. La început proba cerea
   #NAME? și pentru „ ” (inventarul marcase rândul „de verificat”). */
proba('excel-a-F071', 'Ghilimelele tipografice în formulă: „ ” → Excel refuză formula; “ ” → formula e primită și arată #NAME?', async ({ p }) => {
  const pr = [];
  await scrieIn(p, 'C2', '=LEN(„Ana”)');
  const s1 = await st(p);
  if (acceptata(s1, 'C2')) pr.push(`=LEN(„Ana”) a fost primită (C2 = ${JSON.stringify(s1.celule.C2.valoare)}); Excel o refuză`);
  for (let i = 0; i < 3; i++) { await p.keyboard.press('Escape'); await pauza(200); }   // închide fereastra de eroare și editarea
  await scrieIn(p, 'D2', '=LEN(“Ana”)');
  const s2 = await st(p);
  if (!acceptata(s2, 'D2')) pr.push('=LEN(“Ana”) nu e primită (rămâne în editare); Excel o primește');
  else if (s2.celule.D2.valoare !== '#NAME?') pr.push(`D2 = ${JSON.stringify(s2.celule.D2.valoare)} (aștept #NAME?)`);
  else if ((await celula(p, 'D2').innerText()).trim() !== '#NAME?') pr.push('pe ecran D2 nu arată #NAME?');
  return verdict(pr, '„ ” refuzată, “ ” → #NAME?');
}, { continut: { celule: FORM, selectie: 'C2' } });

proba('excel-a-F213', 'Celula cu eroare (#DIV/0!) are triunghiul verde din colț; celula fără eroare nu', async ({ p }) => {
  await scrieIn(p, 'C2', '=A2/B2');
  await scrieIn(p, 'C3', '=A2+B2');
  await clicCelula(p, 'H12');                        // selecția departe: chenarul verde al celulei active nu se confundă
  await pauza(200);
  // semnul verde: în elementul celulei (copil, ::before/::after, SVG) sau un element mic desenat peste colțul ei din stânga-sus
  const verde = a => p.evaluate(a => {
    const c = document.querySelector(`[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${a}"]`);
    if (!c) return 'fara celula';
    const eVerde = s => { const re = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g; let m; while ((m = re.exec(s || ''))) { const [r, g, b, al] = [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]]; if (al > 0.3 && g >= 90 && g - r >= 40 && g - b >= 40) return true; } return false; };
    const rc = c.getBoundingClientRect();
    const grila = c.closest('[data-lh-zona]') || c.parentElement;
    const peste = [...grila.querySelectorAll('*')].filter(e => { if (c.contains(e)) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.width <= 14 && r.height > 0 && r.height <= 14 && r.left < rc.left + 10 && r.right > rc.left && r.top < rc.top + 10 && r.bottom > rc.top; });
    for (const el of [c, ...c.querySelectorAll('*'), ...peste]) {
      for (const ps of [null, '::before', '::after']) {
        const cs = getComputedStyle(el, ps);
        if (ps && (cs.content === 'none' || cs.content === 'normal')) continue;
        const lat = ['Top', 'Right', 'Bottom', 'Left'].filter(k => parseFloat(cs['border' + k + 'Width']) > 0).map(k => cs['border' + k + 'Color']).join(' ');
        if (eVerde(cs.backgroundColor) || eVerde(cs.backgroundImage) || eVerde(lat) || eVerde(cs.fill) || eVerde(cs.stroke)) return true;
      }
    }
    return false;
  }, a);
  const s = await st(p);
  const pr = [];
  if (s.celule.C2.valoare !== '#DIV/0!') pr.push(`pregătire: C2 = ${s.celule.C2.valoare}`);
  const v2 = await verde('C2'), v3 = await verde('C3');
  if (v2 !== true) pr.push('C2 (#DIV/0!) nu are niciun semn verde în colț');
  if (v3 === true) pr.push('și C3 (fără eroare) are semn verde: proba nu poate deosebi');
  return verdict(pr, 'triunghi verde pe C2, nimic pe C3');
}, { continut: { celule: { A2: 1, B2: 0 }, selectie: 'C2' } });

proba('excel-a-F203', '=A2 x B2 (cu spații) e primită și arată #NAME?', async ({ p }) => {
  await scrieIn(p, 'C2', '=A2 x B2');
  const s = await st(p);
  if (!acceptata(s, 'C2')) return { ok: false, det: 'formula nu e primită (rămâne în editare); ecran: ' + (await mesaje(p)).replace(/\s+/g, ' ').slice(0, 80) };
  return verdict(s.celule.C2.valoare === '#NAME?' ? [] : [`C2 = ${JSON.stringify(s.celule.C2.valoare)} (aștept #NAME?)`], 'C2 = #NAME?');
}, { continut: { celule: FORM, selectie: 'C2' } });

// Excel real: doar #NULL!, fără fereastră; mesajul „ai uitat semnul…” e al lecției vechi, nu al Excelului (nu-l cer)
proba('excel-a-F204', '=A2 B2 (semnul uitat) e primită și arată #NULL!', async ({ p }) => {
  await scrieIn(p, 'C2', '=A2 B2');
  const s = await st(p);
  if (!acceptata(s, 'C2')) return { ok: false, det: 'formula nu e primită (rămâne în editare)' };
  return verdict(s.celule.C2.valoare === '#NULL!' ? [] : [`C2 = ${JSON.stringify(s.celule.C2.valoare)} (aștept #NULL!)`], 'C2 = #NULL!');
}, { continut: { celule: FORM, selectie: 'C2' } });

// Excel real: formula nu e primită și Excel propune corectura =5*3 (fereastra Formula AutoCorrect)
proba('excel-a-F205', '=5x3 nu e primită; pe ecran apare corectura propusă =5*3', async ({ p }) => {
  await scrieIn(p, 'C2', '=5x3');
  const s = await st(p);
  const m = await mesaje(p);
  const pr = [];
  if (s.celule.C2 && !s.celule.C2.editare && s.celule.C2.valoare === 15 && !(await fereastraDeschisa(p))) pr.push('formula a fost primită pe tăcute ca =5*3');
  if (!/=\s*5\s*\*\s*3/.test(m)) pr.push('pe ecran nu apare corectura =5*3 (ecran: ' + m.replace(/\s+/g, ' ').slice(0, 90) + ')');
  return verdict(pr, 'refuzată, cu corectura =5*3 pe ecran');
}, { continut: { celule: FORM, selectie: 'C2' } });

// Excel real pe setări românești: punctul e separatorul miilor, deci propune corectura greșită =A2*05
proba('excel-a-F206', '=A2*0.5 nu e primită; pe ecran apare corectura propusă de Excel (=A2*05)', async ({ p }) => {
  await scrieIn(p, 'C2', '=A2*0.5');
  const s = await st(p);
  const m = await mesaje(p);
  const pr = [];
  if (s.celule.C2 && !s.celule.C2.editare && typeof s.celule.C2.valoare === 'number' && !(await fereastraDeschisa(p))) pr.push(`formula a fost primită pe tăcute (C2 = ${s.celule.C2.valoare})`);
  if (!/=\s*A2\s*\*\s*05\b/i.test(m)) pr.push('pe ecran nu apare corectura =A2*05 (ecran: ' + m.replace(/\s+/g, ' ').slice(0, 90) + ')');
  return verdict(pr, 'refuzată, cu corectura =A2*05 pe ecran');
}, { continut: { celule: FORM, selectie: 'C2' } });

// Excel 365: zona se varsă (C2 = 20, D2 = 4); explicația „: nu împarte” e a lecției vechi, Excelul nu o dă
proba('excel-a-F207', '=A2:B2 face ce face Excel 365 cu o zonă: valorile se varsă în C2:D2', async ({ p }) => {
  await scrieIn(p, 'C2', '=A2:B2');
  const s = await st(p);
  const pr = [];
  if (!acceptata(s, 'C2')) pr.push('formula nu e primită');
  else {
    if (s.celule.C2.valoare !== 20) pr.push(`C2 = ${JSON.stringify(s.celule.C2.valoare)} (aștept 20)`);
    if (!s.celule.D2 || s.celule.D2.valoare !== 4) pr.push(`D2 = ${JSON.stringify(s.celule.D2 && s.celule.D2.valoare)} (aștept 4, vărsat)`);
    if ((await celula(p, 'D2').innerText()).trim() !== '4') pr.push('pe ecran D2 nu arată 4');
  }
  return verdict(pr, 'C2 = 20, D2 = 4 (vărsat, ca Excel 365)');
}, { continut: { celule: { A2: 20, B2: 4 }, selectie: 'C2' } });

// Excel real primește formula (rândurile 4:20) și dă #SPILL! (sau 0, nota din inventar)
proba('excel-a-F208', '=20:4 e primită (rândurile 4:20) și arată #SPILL!', async ({ p }) => {
  await scrieIn(p, 'C2', '=20:4');
  const s = await st(p);
  if (!acceptata(s, 'C2')) return { ok: false, det: 'formula nu e primită (rămâne în editare)' };
  return verdict(['#SPILL!', 0].includes(s.celule.C2.valoare) ? [] : [`C2 = ${JSON.stringify(s.celule.C2.valoare)} (aștept #SPILL!)`], 'C2 = ' + s.celule.C2.valoare);
}, { continut: { celule: FORM, selectie: 'C2' } });

proba('excel-a-F209', '× și ÷ în formulă devin * și / și se calculează', async ({ p }) => {
  await scrieIn(p, 'C2', '=A2×B2');
  await scrieIn(p, 'C3', '=A2÷B2');
  const s = await st(p);
  const pr = [];
  const c2 = s.celule.C2 || {}, c3 = s.celule.C3 || {};
  if (nf(c2.formula) !== '=A2*B2' || c2.valoare !== 600) pr.push(`=A2×B2 → ${c2.formula} = ${JSON.stringify(c2.valoare)} (aștept =A2*B2 = 600)`);
  if (nf(c3.formula) !== '=A2/B2' || typeof c3.valoare !== 'number' || Math.abs(c3.valoare - 20 / 30) > 1e-9) pr.push(`=A2÷B2 → ${c3.formula} = ${JSON.stringify(c3.valoare)} (aștept =A2/B2 = 0,67)`);
  return verdict(pr, '=A2*B2 = 600, =A2/B2 = 0,67');
}, { continut: { celule: FORM, selectie: 'C2' } });

proba('excel-a-F210', '+A2*B2 (fără =) devine formula =+A2*B2 = 600', async ({ p }) => {
  await scrieIn(p, 'C2', '+A2*B2');
  const s = await st(p);
  const c = s.celule.C2 || {};
  return verdict(nf(c.formula) === '=+A2*B2' && c.valoare === 600 ? [] : [`C2: formula ${JSON.stringify(c.formula)}, valoare ${JSON.stringify(c.valoare)} (aștept =+A2*B2 = 600)`], '=+A2*B2 = 600');
}, { continut: { celule: FORM, selectie: 'C2' } });

proba('excel-a-F212', 'Textul pe care Excel îl ia drept număr („150 lei”, „12 octombrie 2026”) intră în calcul ca număr', async ({ p }) => {
  await scrieIn(p, 'A2', '150 lei');
  await scrieIn(p, 'A3', '12 octombrie 2026');
  await scrieIn(p, 'C2', '=A2*2');
  await scrieIn(p, 'C3', '=A3*1');
  const s = await st(p);
  const pr = [];
  if (!s.celule.C2 || s.celule.C2.valoare !== 300) pr.push(`=A2*2 cu A2 = „150 lei” → ${JSON.stringify(s.celule.C2 && s.celule.C2.valoare)} (aștept 300)`);
  // 12.10.2026 = numărul de serie 46307 în Excel
  if (!s.celule.C3 || s.celule.C3.valoare !== 46307) pr.push(`=A3*1 cu A3 = „12 octombrie 2026” → ${JSON.stringify(s.celule.C3 && s.celule.C3.valoare)} (aștept 46307, data ca număr)`);
  return verdict(pr, '300 și 46307');
}, { continut: { celule: { A1: 'Preț' }, selectie: 'A2' } });

// ---------------------------------------------------------------- FUNCȚII — SCRIERE
proba('excel-a-F223', 'Tab după =SU / =MA / =MI / =AV completează prima funcție din lista Excel', async ({ p }) => {
  const pr = [];
  for (const [inceput, asteptat] of [['=SU', '=SUBSTITUTE('], ['=MA', '=MATCH('], ['=MI', '=MID('], ['=AV', '=AVEDEV(']]) {
    await clicCelula(p, 'C2');
    await p.keyboard.type(inceput);
    await pauza(200);
    await p.keyboard.press('Tab');
    await pauza(250);
    const t = await textEditare(p);
    if (!t.toUpperCase().startsWith(asteptat)) pr.push(`${inceput} + Tab → ${JSON.stringify(t)} (aștept ${asteptat})`);
    await p.keyboard.press('Escape'); await pauza(120);
    if ((await st(p)).ramane_in_editare) { await p.keyboard.press('Escape'); await pauza(120); }
  }
  return verdict(pr, 'SUBSTITUTE(, MATCH(, MID(, AVEDEV(');
}, { continut: { celule: COLOANA, selectie: 'C2' } });

// Excel real calculează MATCH / SUMIFS; trece și varianta vechiului (fără #NAME?, cu mesajul „există în Excel, nu se calculează aici”)
proba('excel-a-F224', 'Funcție Excel nesimulată (MATCH, SUMIFS): nu #NAME?, ci rezultatul sau mesajul că foaia de aici nu o calculează', async ({ p }) => {
  const pr = [];
  for (const [a, f, nume, bun] of [['D2', '=MATCH(7;B2:B4;0)', 'MATCH', 2], ['D3', '=SUMIFS(B2:B6;B2:B6;">8")', 'SUMIFS', 18]]) {
    await scrieIn(p, a, f);
    const s = await st(p);
    const m = await mesaje(p);
    const c = s.celule[a] || {};
    if (c.valoare === bun && !c.editare) continue;
    const mesajOk = new RegExp(nume).test(m) && /(nu o calculează|nu se calculează|nu e simulat|aici nu|not (calculated|supported))/i.test(m);
    if (c.valoare === '#NAME?' || (await celula(p, a).innerText()).trim() === '#NAME?') pr.push(`${f} → #NAME? (aștept ${bun} sau mesajul că ${nume} există în Excel dar nu se calculează aici)`);
    else if (!mesajOk) pr.push(`${f} → ${JSON.stringify(c.valoare)}, fără mesaj despre ${nume} (ecran: ${m.replace(/\s+/g, ' ').slice(0, 70)})`);
    if ((await st(p)).ramane_in_editare) { await p.keyboard.press('Escape'); await pauza(120); }
  }
  return verdict(pr, 'MATCH și SUMIFS nu mai dau #NAME?');
}, { continut: { celule: COLOANA, selectie: 'D2' } });

async function fereastraTypo(p, corectura) {
  const m = await mesaje(p);
  const are = /typo/i.test(m) && m.replace(/\s+/g, '').includes(corectura.replace(/\s+/g, ''));
  return { are, m };
}
proba('excel-a-F225', '=SUM B2:B6: fereastra „We found a typo…” (Yes / No); No lasă #NAME?; revine la fiecare Enter; Yes corectează', async ({ p }) => {
  const pr = [];
  await scrieIn(p, 'B7', '=SUM B2:B6');
  let f = await fereastraTypo(p, '=SUM(B2:B6)');
  if (!f.are) return { ok: false, det: 'după Enter nu apare „We found a typo… =SUM(B2:B6)” (ecran: ' + f.m.replace(/\s+/g, ' ').slice(0, 90) + ')' };
  await clicArticol(p, 'No', { inFereastra: true });
  await pauza(250);
  let s = await st(p);
  if (s.ramane_in_editare || !s.celule.B7 || s.celule.B7.valoare !== '#NAME?') pr.push(`No → B7 = ${JSON.stringify(s.celule.B7 && s.celule.B7.valoare)}, editare=${s.ramane_in_editare} (aștept #NAME?, formula lăsată)`);
  await clicCelula(p, 'B7');
  await p.keyboard.press('F2'); await pauza(150);
  await p.keyboard.press('Enter'); await pauza(300);
  f = await fereastraTypo(p, '=SUM(B2:B6)');
  if (!f.are) pr.push('la al doilea Enter fereastra nu mai apare');
  else {
    await clicArticol(p, 'Yes', { inFereastra: true });
    await pauza(250);
    s = await st(p);
    if (nf(s.celule.B7 && s.celule.B7.formula) !== '=SUM(B2:B6)' || s.celule.B7.valoare !== 39) pr.push(`Yes → B7 = ${JSON.stringify(s.celule.B7)} (aștept =SUM(B2:B6) = 39)`);
  }
  return verdict(pr, 'No → #NAME?; fereastra revine; Yes → =SUM(B2:B6) = 39');
}, { continut: { celule: COLOANA, selectie: 'B7' } });

proba('excel-a-F226', '=SUM (B2:B6): fereastra „We found a typo…”; Yes = =SUM(B2:B6), No = #NAME?', async ({ p }) => {
  const pr = [];
  await scrieIn(p, 'B7', '=SUM (B2:B6)');
  let f = await fereastraTypo(p, '=SUM(B2:B6)');
  if (!f.are) {
    const s = await st(p);
    return { ok: false, det: `fără fereastra „We found a typo…”; B7 = ${JSON.stringify(s.celule.B7)}` };
  }
  await clicArticol(p, 'Yes', { inFereastra: true });
  await pauza(250);
  let s = await st(p);
  if (nf(s.celule.B7 && s.celule.B7.formula) !== '=SUM(B2:B6)' || s.celule.B7.valoare !== 39) pr.push(`Yes → B7 = ${JSON.stringify(s.celule.B7)}`);
  await scrieIn(p, 'B8', '=SUM (B2:B6)');
  f = await fereastraTypo(p, '=SUM(B2:B6)');
  if (!f.are) pr.push('a doua oară (B8) fereastra nu apare');
  else {
    await clicArticol(p, 'No', { inFereastra: true });
    await pauza(250);
    s = await st(p);
    if (!s.celule.B8 || s.celule.B8.valoare !== '#NAME?' || s.ramane_in_editare) pr.push(`No → B8 = ${JSON.stringify(s.celule.B8)} (aștept #NAME?)`);
  }
  return verdict(pr, 'Yes → =SUM(B2:B6) = 39; No → #NAME?');
}, { continut: { celule: COLOANA, selectie: 'B7' } });

proba('excel-a-F227', '=SUM(B2:B7) în B7: fereastra referinței circulare (OK), apoi B7 arată 0', async ({ p }) => {
  await scrieIn(p, 'B7', '=SUM(B2:B7)');
  const m = await mesaje(p);
  if (!/circular/i.test(m)) { const s = await st(p); return { ok: false, det: `fără fereastra „circular references”; B7 = ${JSON.stringify(s.celule.B7)}` }; }
  await clicArticol(p, 'OK', { inFereastra: true });
  await pauza(250);
  const s = await st(p);
  const pr = [];
  if (!s.celule.B7 || s.celule.B7.valoare !== 0) pr.push(`după OK B7 = ${JSON.stringify(s.celule.B7 && s.celule.B7.valoare)} (aștept 0)`);
  if (await fereastraDeschisa(p)) pr.push('fereastra nu s-a închis la OK');
  return verdict(pr, 'fereastra circulară, OK, B7 = 0');
}, { continut: { celule: COLOANA, selectie: 'B7' } });

proba('excel-a-F228', '=SUM(B6:B2) devine =SUM(B2:B6) după Enter', async ({ p }) => {
  await scrieIn(p, 'B7', '=SUM(B6:B2)');
  await clicCelula(p, 'B7');
  const s = await st(p);
  const bara = await textEditare(p);
  const pr = [];
  if (nf(s.celule.B7 && s.celule.B7.formula) !== '=SUM(B2:B6)') pr.push(`formula din B7 = ${s.celule.B7 && s.celule.B7.formula} (aștept =SUM(B2:B6))`);
  if (nf(bara) !== '=SUM(B2:B6)') pr.push(`bara de formule arată ${JSON.stringify(bara)}`);
  if (s.celule.B7 && s.celule.B7.valoare !== 39) pr.push('rezultatul nu e 39');
  return verdict(pr, '=SUM(B2:B6) = 39');
}, { continut: { celule: COLOANA, selectie: 'B7' } });

// ---------------------------------------------------------------- Σ (AutoSum)
async function sigma(p, a) {
  await clicCelula(p, a);
  await clicTinta(p, 'panglica:Home/Editing/AutoSum');
  await pauza(200);
  const t = await textEditare(p);
  await p.keyboard.press('Escape'); await pauza(120);
  if ((await st(p)).ramane_in_editare) { await p.keyboard.press('Escape'); await pauza(120); }
  return t;
}
proba('excel-a-F215', 'Σ sare peste celula goală de deasupra (B8 → =SUM(B2:B7)); deasupra doar formule și în stânga numere → stânga', async ({ p }) => {
  const pr = [];
  const t1 = await sigma(p, 'B8');
  if (nf(t1) !== '=SUM(B2:B7)') pr.push(`B8 (B7 goală) → ${JSON.stringify(t1)} (aștept =SUM(B2:B7))`);
  const t2 = await sigma(p, 'E13');
  if (nf(t2) !== '=SUM(B13:D13)') pr.push(`E13 (deasupra doar formula din E12, în stânga numere) → ${JSON.stringify(t2)} (aștept =SUM(B13:D13))`);
  return verdict(pr, '=SUM(B2:B7) și =SUM(B13:D13)');
}, { continut: { celule: { ...COLOANA, B12: 1, C12: 2, D12: 3, E12: '=B12+C12+D12', B13: 4, C13: 5, D13: 6 }, selectie: 'B8' } });

proba('excel-a-F216', 'Σ sub un total SUM propune doar totalul (=SUM(B7)); urcă doar până sub ultimul SUM; Average urcă peste total', async ({ p }) => {
  const pr = [];
  const t1 = await sigma(p, 'B8');
  if (nf(t1) !== '=SUM(B7)') pr.push(`B8 sub =SUM(B2:B6) → ${JSON.stringify(t1)} (aștept =SUM(B7))`);
  const t2 = await sigma(p, 'D9');
  if (nf(t2) !== '=SUM(D8)') pr.push(`D9 sub =MAX (D8) și =SUM (D7) → ${JSON.stringify(t2)} (aștept =SUM(D8))`);
  await clicCelula(p, 'B8');
  await clicTinta(p, 'meniu_derulant:Home/Editing/AutoSum');
  await clicArticol(p, 'Average');
  await pauza(200);
  const t3 = await textEditare(p);
  if (nf(t3) !== '=AVERAGE(B2:B7)') pr.push(`B8 › Average → ${JSON.stringify(t3)} (aștept =AVERAGE(B2:B7))`);
  await p.keyboard.press('Escape');
  return verdict(pr, '=SUM(B7), =SUM(D8), =AVERAGE(B2:B7)');
}, { continut: { celule: { ...COLOANA, B7: '=SUM(B2:B6)', D1: 'Nota', D2: 5, D3: 6, D4: 7, D5: 8, D6: 9, D7: '=SUM(D2:D6)', D8: '=MAX(D2:D6)' }, selectie: 'B8' } });

proba('excel-a-F218', 'Σ pe o zonă selectată scrie direct rezultatele (sub coloane / în ultimul rând gol / în dreapta rândului) și extinde selecția', async ({ p }) => {
  const pr = [];
  const zona = async (a, b) => { await clicCelula(p, a); await celula(p, b).click({ modifiers: ['Shift'] }); await pauza(150); };
  await zona('B2', 'D3');
  await clicTinta(p, 'panglica:Home/Editing/AutoSum');
  await pauza(250);
  let s = await st(p);
  if (s.ramane_in_editare) { pr.push('B2:D3: rezultatele nu s-au scris direct (a rămas în editare)'); await p.keyboard.press('Escape'); await pauza(120); }
  for (const [a, f] of [['B4', '=SUM(B2:B3)'], ['C4', '=SUM(C2:C3)'], ['D4', '=SUM(D2:D3)']]) if (nf(s.celule[a] && s.celule[a].formula) !== f) pr.push(`${a} = ${JSON.stringify(s.celule[a] && s.celule[a].formula)} (aștept ${f})`);
  if ((s.selectie.zona || '').toUpperCase() !== 'B2:D4') pr.push(`selecția după Σ = ${s.selectie.zona} (aștept B2:D4)`);
  await zona('F2', 'F7');
  await clicTinta(p, 'panglica:Home/Editing/AutoSum');
  await pauza(250);
  s = await st(p);
  if (nf(s.celule.F7 && s.celule.F7.formula) !== '=SUM(F2:F6)') pr.push(`F2:F7 (F7 goală) → F7 = ${JSON.stringify(s.celule.F7 && s.celule.F7.formula)}, F8 = ${JSON.stringify(s.celule.F8 && s.celule.F8.formula)} (aștept F7 =SUM(F2:F6))`);
  await zona('H2', 'J2');
  await clicTinta(p, 'panglica:Home/Editing/AutoSum');
  await pauza(250);
  s = await st(p);
  if (nf(s.celule.K2 && s.celule.K2.formula) !== '=SUM(H2:J2)') pr.push(`H2:J2 (un rând) → K2 = ${JSON.stringify(s.celule.K2 && s.celule.K2.formula)}, H3 = ${JSON.stringify(s.celule.H3 && s.celule.H3.formula)} (aștept K2 =SUM(H2:J2))`);
  return verdict(pr, 'B4:D4 + selecția B2:D4; F7; K2');
}, { continut: { celule: { B2: 1, C2: 2, D2: 3, B3: 4, C3: 5, D3: 6, F2: 1, F3: 2, F4: 3, F5: 4, F6: 5, H2: 1, I2: 2, J2: 3 }, selectie: 'B2' } });

// ---------------------------------------------------------------- GRAFICE
const NOTE3 = { A3: 'Elev', B3: 'Nota 1', C3: 'Nota 2', A4: 'Ana', B4: 9, C4: 10, A5: 'Bogdan', B5: 7, C5: 8, A6: 'Dan', B6: 8, C6: 6 };
proba('excel-b-F029', 'Zona graficului: dintr-o celulă ia tabelul din jur; din coloane întregi doar partea folosită (fără rândurile goale de sus)', async ({ p, ctx, base }) => {
  const pr = [];
  await clicCelula(p, 'B5');
  let s = await insereazaGrafic(p);
  if (JSON.stringify(s.serii_grafic) !== '["Nota 1","Nota 2"]' || JSON.stringify(s.categorii_grafic) !== '["Ana","Bogdan","Dan"]') pr.push(`din B5: serii ${JSON.stringify(s.serii_grafic)}, categorii ${JSON.stringify(s.categorii_grafic)}`);
  // a doua foaie proaspătă: coloanele A:C alese trăgând peste literele lor
  const { p: p2 } = await deschide(ctx, base, { celule: NOTE3, selectie: 'B5' });
  const a = await p2.locator(`${R} [data-lh-tinta="antet_coloana"][data-lh-id="A"]`).first().boundingBox();
  const c = await p2.locator(`${R} [data-lh-tinta="antet_coloana"][data-lh-id="C"]`).first().boundingBox();
  await p2.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p2.mouse.down();
  await p2.mouse.move(c.x + c.width / 2, c.y + c.height / 2, { steps: 5 }); await p2.mouse.up();
  await pauza(200);
  const sel = (await st(p2)).selectie.zona;
  if (sel !== 'A:C') pr.push(`pregătire: selecția coloanelor = ${sel}`);
  s = await insereazaGrafic(p2);
  if (JSON.stringify(s.serii_grafic) !== '["Nota 1","Nota 2"]' || JSON.stringify(s.categorii_grafic) !== '["Ana","Bogdan","Dan"]') pr.push(`din coloanele A:C: serii ${JSON.stringify(s.serii_grafic)}, categorii ${JSON.stringify(s.categorii_grafic)} (aștept Nota 1, Nota 2 / Ana, Bogdan, Dan)`);
  return verdict(pr, 'din B5 și din A:C: serii Nota 1, Nota 2; categorii Ana, Bogdan, Dan');
}, { continut: { celule: NOTE3, selectie: 'B5' } });

proba('excel-b-F036', 'Change Chart Type (coloane → linie): rămân titlul, legenda, etichetele; etichetele trec pe Right', async ({ p }) => {
  await clicCelula(p, 'B2');
  await insereazaGrafic(p);
  await clicAddChartElement(p, 'Data Labels', 'Outside End');
  let s = await st(p);
  if (!s.etichete_date || Object.values(s.etichete_date).some(v => v !== 'Outside End')) return { ok: false, det: 'pregătire: Data Labels › Outside End a dat ' + JSON.stringify(s.etichete_date) };
  await clicTinta(p, 'panglica:Chart Design/Type/Change Chart Type...');
  await clicArticol(p, 'Line', { inFereastra: true });
  await clicArticol(p, 'OK', { inFereastra: true });
  await pauza(400);
  s = await st(p);
  const pr = [];
  if (s.tip_grafic !== 'Line') pr.push(`tipul = ${s.tip_grafic} (aștept Line)`);
  if (!s.etichete_date || Object.values(s.etichete_date).some(v => v !== 'Right')) pr.push(`etichetele = ${JSON.stringify(s.etichete_date)} (aștept Right la linie)`);
  if (!(await texteInGrafic(p, 'Chart Title') || []).length) pr.push('titlul a dispărut');
  if (!(await texteInGrafic(p, 'Nota 1') || []).length) pr.push('legenda a dispărut');
  return verdict(pr, 'Line, etichete Right, titlu și legendă păstrate');
}, { continut: { celule: NOTE, selectie: 'B2' } });

proba('excel-b-F038', 'Al doilea clic pe titlu pune cursorul în text: scrii la capăt, Enter = rând nou, Esc lasă textul', async ({ p }) => {
  await clicCelula(p, 'B2');
  await insereazaGrafic(p);
  const t = await tinta(p, 'grafic:1/titlu') || p.locator(`${R} [data-lh-tinta="grafic"]`).getByText('Chart Title', { exact: true }).first();
  await t.click();
  await pauza(700);                                  // două clicuri separate (nu dublu clic)
  await t.click();
  await pauza(300);
  await p.keyboard.press('End');
  await p.keyboard.type(' 2026');
  await p.keyboard.press('Enter');
  await p.keyboard.type('clasa');
  await p.keyboard.press('Escape');
  await pauza(300);
  const s = await st(p);
  const dom = await p.locator(`${R} [data-lh-tinta="grafic"]`).first().innerText().catch(() => '');
  const titlu = (s.grafice && s.grafice[0] && s.grafice[0].titlu) || '';
  const ok = /Chart Title 2026\s*[\n\r\u000b]\s*clasa/.test(titlu) || /Chart Title 2026\s*\n\s*clasa/.test(dom);
  return verdict(ok ? [] : [`titlul = ${JSON.stringify(titlu)} (aștept „Chart Title 2026” + rând nou „clasa”)`], 'Chart Title 2026 / clasa');
}, { continut: { celule: NOTE, selectie: 'B2' } });

proba('excel-b-F039', 'Dublu clic pe titlu deschide panoul Format Chart Title; ✕ îl închide, titlul rămâne ales', async ({ p }) => {
  await clicCelula(p, 'B2');
  await insereazaGrafic(p);
  const t = await tinta(p, 'grafic:1/titlu') || p.locator(`${R} [data-lh-tinta="grafic"]`).getByText('Chart Title', { exact: true }).first();
  await t.dblclick();
  await pauza(400);
  const panou = async () => p.evaluate(() => {
    const Rr = document.querySelector('[data-lh-aplicatie="excel"]');
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const c = [...Rr.querySelectorAll('*')].filter(e => vis(e) && ((e.getAttribute('data-lh-eticheta') || e.getAttribute('aria-label') || '') === 'Format Chart Title' || [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === 'Format Chart Title')));
    return c.length;
  });
  if (!(await panou())) return { ok: false, det: 'după dublu clic pe titlu nu apare panoul „Format Chart Title” (ecran: ' + (await mesaje(p)).replace(/\s+/g, ' ').slice(0, 70) + ')' };
  // butonul ✕ al panoului (Close)
  const x = await primulVizibil(p, `${R} [data-lh-eticheta="Close"]:not([data-lh-tinta^="bara_titlu"]), ${R} [aria-label="Close"]:not([data-lh-tinta^="bara_titlu"])`);
  if (!x) return { ok: false, det: 'panoul nu are butonul Close (✕)' };
  await x.click();
  await pauza(300);
  const s = await st(p);
  const pr = [];
  if (await panou()) pr.push('panoul nu s-a închis');
  if (s.grafic_element_ales !== 'Chart Title') pr.push(`după ✕ e ales ${JSON.stringify(s.grafic_element_ales)} (aștept titlul)`);
  return verdict(pr, 'panoul se deschide și se închide; titlul rămâne ales');
}, { continut: { celule: NOTE, selectie: 'B2' } });

proba('excel-b-F041', 'Add Chart Element › Chart Title: None / Above Chart / Centered Overlay', async ({ p }) => {
  await clicCelula(p, 'B2');
  await insereazaGrafic(p);
  const pr = [];
  await clicAddChartElement(p, 'Chart Title', 'None');
  if ((await texteInGrafic(p, 'Chart Title') || []).length) pr.push('None: titlul a rămas (ecran: ' + ((await mesajNesimulat(p)) || '-').slice(0, 60) + ')');
  await clicAddChartElement(p, 'Chart Title', 'Above Chart');
  const sus = await texteInGrafic(p, 'Chart Title') || [];
  if (!sus.length) pr.push('Above Chart: titlul nu a revenit');
  else if (sus[0].y > 0.25) pr.push(`Above Chart: titlul nu e sus (y = ${sus[0].y.toFixed(2)})`);
  await clicAddChartElement(p, 'Chart Title', 'Centered Overlay');
  if (!(await texteInGrafic(p, 'Chart Title') || []).length) pr.push('Centered Overlay: titlul lipsește');
  const nes = await mesajNesimulat(p);
  if (/Chart Title|None|Above|Overlay/.test(nes)) pr.push('mesaj: ' + nes.slice(0, 70));
  return verdict(pr, 'None scoate titlul; Above Chart / Centered Overlay îl pun');
}, { continut: { celule: NOTE, selectie: 'B2' } });

proba('excel-b-F044', 'Add Chart Element › Legend: None / Right / Top / Left / Bottom', async ({ p }) => {
  await clicCelula(p, 'B2');
  await insereazaGrafic(p);
  const pr = [];
  await clicAddChartElement(p, 'Legend', 'None');
  if ((await texteInGrafic(p, 'Nota 1') || []).length) pr.push('None: legenda a rămas');
  for (const [loc, bun] of [['Right', q => q.x > 0.6], ['Top', q => q.y < 0.35], ['Left', q => q.x < 0.4], ['Bottom', q => q.y > 0.7]]) {
    await clicAddChartElement(p, 'Legend', loc);
    const q = (await texteInGrafic(p, 'Nota 1') || [])[0];
    if (!q) pr.push(`${loc}: legenda lipsește`);
    else if (!bun(q)) pr.push(`${loc}: legenda e la x=${q.x.toFixed(2)}, y=${q.y.toFixed(2)} din grafic`);
  }
  const nes = await mesajNesimulat(p);
  if (/Legend|None|Right|Top|Left|Bottom/.test(nes)) pr.push('mesaj: ' + nes.slice(0, 70));
  return verdict(pr, 'legenda dispare și se mută în cele 4 locuri');
}, { continut: { celule: NOTE, selectie: 'B2' } });

proba('excel-b-F045', 'Butonul + de lângă grafic (Chart Elements): bifele Chart Title, Data Labels, Legend', async ({ p }) => {
  await clicCelula(p, 'B2');
  await insereazaGrafic(p);
  const plus = await articol(p, 'Chart Elements');
  if (!plus) return { ok: false, det: 'lângă graficul ales nu văd butonul „Chart Elements” (+)' };
  await plus.click();
  await pauza(300);
  const pr = [];
  for (const et of ['Chart Title', 'Data Labels', 'Legend']) {
    const b = await primulVizibil(p, `${R} [data-lh-tip="CheckBox"][data-lh-eticheta=${css(et)}], ${R} [role="checkbox"][aria-label=${css(et)}], ${R} [data-lh-tinta=${css('meniu:' + et)}]`);
    if (!b) { pr.push(`bifa „${et}” lipsește`); continue; }
    await b.click();
    await pauza(250);
  }
  const s = await st(p);
  if (!s.etichete_date || Object.values(s.etichete_date).some(v => !v)) pr.push(`Data Labels bifat → etichete ${JSON.stringify(s.etichete_date)}`);
  if ((await texteInGrafic(p, 'Chart Title') || []).length) pr.push('Chart Title debifat → titlul a rămas');
  if ((await texteInGrafic(p, 'Nota 1') || []).length) pr.push('Legend debifat → legenda a rămas');
  return verdict(pr, 'bifele pun etichetele și scot titlul și legenda');
}, { continut: { celule: NOTE, selectie: 'B2' } });

// ================================================================ RULAREA
async function ruleaza(browser, base, pr) {
  const nume = `${pr.id} ${pr.nume}`;
  if (pr.skip) { scrie('SKIP', pr.id, pr.skip); return; }
  let ctx;
  try {
    ctx = await browser.newContext(pr.tel ? TEL : { viewport: { width: 1280, height: 800 } });
    ctx.setDefaultTimeout(4000);
    let ceas;
    const r = await Promise.race([
      (async () => { const o = await deschide(ctx, base, pr.continut); return pr.fn({ ...o, ctx, base }); })(),
      new Promise((_, rej) => { ceas = setTimeout(() => rej(new Error('timp depășit (20 s)')), 20000); }),
    ]);
    clearTimeout(ceas);
    scrie(r.ok ? 'PASS' : 'FAIL', nume, r.det);
  } catch (e) {
    scrie('FAIL', nume, 'eroare: ' + String(e.message || e).split('\n')[0].slice(0, 160));
  } finally {
    if (ctx) await ctx.close().catch(() => {});
  }
}

async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const doar = process.argv.slice(2);
    for (const pr of PROBE) if (!doar.length || doar.some(d => pr.id.endsWith(d))) await ruleaza(browser, base, pr);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(`(${PROBE.length} probe, ${((Date.now() - t0) / 1000).toFixed(0)} s)`);
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
