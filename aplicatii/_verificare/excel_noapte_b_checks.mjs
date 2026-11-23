// Verificari proprii ale constructorului de pe banda b (copia LearningHub_fidel_b) din noaptea Excel 22-23.11 (aplicatii/excel.js):
// drumurile despre care raportul spune ca merg, altele decat cele jucate de probele de paritate (alt rand, Ctrl+Z, tastatura, atingere pe 390x844).
// Fiecare constructor de pe banda b ADAUGA verificari la sfarsitul listei VERIFICARI, fara sa le rescrie pe cele de dinainte. Facut dupa excel_noapte_checks.mjs.
// Rulare:  node aplicatii/_verificare/excel_noapte_b_checks.mjs   (din orice director; intra singur in excel_paritate.mjs --regres)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL. Totul headless, reteaua din afara lui 127.0.0.1 oprita.
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
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
const normF = f => (f || '').replace(/\s+/g, '').toUpperCase();

function unelte(p, atingere) {
  const h = {};
  h.st = () => p.evaluate(() => window.LH.aplicatii.stare('excel'));
  h.v = async a => { const c = ((await h.st()).celule || {})[a]; return c ? c.valoare : undefined; };
  h.f = async a => { const c = ((await h.st()).celule || {})[a]; return c ? normF(c.formula) : undefined; };
  h.fmt = async a => ((await h.st()).format_celule || {})[a] || {};
  const apasa = async (loc, opt = {}) => { if (atingere && !opt.button) await loc.first().tap({ modifiers: opt.modifiers }); else await loc.first().click(opt); await pauza(opt.pauza || 150); };
  h.cel = (a, opt) => apasa(p.locator(`${APP} [data-lh-tinta="celula"][data-lh-id="${a}"]`), opt);
  h.antetRand = (n, opt) => apasa(p.locator(`${APP} [data-lh-tinta="antet_rand"][data-lh-id="${n}"]`), opt);
  h.antetCol = (l, opt) => apasa(p.locator(`${APP} [data-lh-tinta="antet_coloana"][data-lh-id="${l}"]`), opt);
  h.mso = (id, opt) => apasa(p.locator(`${APP} [data-lh-id-mso="${id}"]:visible`), opt);
  h.scrie = async (a, t) => { await h.cel(a); await p.keyboard.type(t); await p.keyboard.press('Enter'); await pauza(120); };
  // un rand de meniu / un control al ferestrei, dupa eticheta, vizibil; clic (sau atingere) in mijlocul lui
  h.clicEt = async (et, tip) => {
    const r = await p.evaluate(([et, tip]) => {
      const re = tip ? new RegExp(tip) : null;
      const viz = e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden'; };
      const e = [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-eticheta]')].filter(x => x.getAttribute('data-lh-eticheta') === et && (!re || re.test(x.getAttribute('data-lh-tip') || ''))).find(viz);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }, [et, tip || null]);
    if (!r) return false;
    if (atingere) await p.touchscreen.tap(r.x, r.y); else await p.mouse.click(r.x, r.y);
    await pauza(180);
    return true;
  };
  h.bifat = et => p.evaluate(et => { const e = [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="RadioButton"]')].find(x => x.getAttribute('data-lh-eticheta') === et); return e ? e.getAttribute('aria-checked') : null; }, et);
  return h;
}

async function deschide(p, base) {
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(APP, { timeout: 15000 });
  await p.waitForFunction(() => { try { const s = window.LH.aplicatii.stare('excel'); return !!(s && s.celule && s.celule.A1); } catch (e) { return false; } }, null, { timeout: 15000 });
  await pauza(300);
}

const VERIFICARI = [
  // ---------------- runda 4b (lot 6: sortarea si graficele), banda b
  { nume: 'r4b Home › Sort & Filter pe un numar (B2): randurile se numesc dupa tip; Sort Largest to Smallest muta randurile intregi; Ctrl+Z', fn: async (p, h) => {
    await h.cel('B2'); await h.mso('SortFilterMenu');
    const are = await p.evaluate(() => ['Sort Smallest to Largest', 'Sort Largest to Smallest', 'Custom Sort...', 'Filter'].map(et => !![...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="MenuItem"]')].find(x => x.getAttribute('data-lh-eticheta') === et && x.getBoundingClientRect().width > 0)));
    if (!await h.clicEt('Sort Largest to Smallest', 'MenuItem')) return { ok: false, det: 'meniul n-are Sort Largest to Smallest: ' + j(are) };
    const d = [await h.v('A2'), await h.v('A3'), await h.v('A4'), await h.v('B2'), await h.v('B3'), await h.v('B4'), await h.v('A1')];
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = [await h.v('A2'), await h.v('B2')];
    const ok = are.every(Boolean) && j(d) === j(['Ana', 'Dan', 'Bogdan', 9, 8, 7, 'Elev']) && j(u) === j(['Ana', 9]);
    return { ok, det: `randuri ${j(are)}; dupa sortare A2:A4,B2:B4,A1=${j(d)}; Ctrl+Z A2,B2=${j(u)}` };
  } },
  { nume: 'r4b Sort & Filter › Custom Sort... › Sort by Nota 2 › Smallest to Largest › OK; Ctrl+Z', fn: async (p, h) => {
    await h.cel('A3'); await h.mso('SortFilterMenu');
    if (!await h.clicEt('Custom Sort...', 'MenuItem')) return { ok: false, det: 'meniul n-are Custom Sort...' };
    const cb = async (et, opt) => { const c = p.locator(`${APP} [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-eticheta="${et}"]`).first(); await c.click(); await pauza(150); const o = p.locator(`${APP} [role="option"][data-lh-eticheta="${opt}"]`).last(); if (!(await o.count())) return false; await o.click(); await pauza(150); return true; };
    if (!await cb('Sort by', 'Nota 2')) return { ok: false, det: 'lista Sort by n-are Nota 2' };
    if (!await cb('Order', 'Smallest to Largest')) return { ok: false, det: 'lista Order n-are Smallest to Largest' };
    await h.clicEt('OK', 'Button'); await pauza(200);
    const d = [await h.v('A2'), await h.v('A3'), await h.v('A4')];
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = await h.v('A2');
    return { ok: j(d) === j(['Dan', 'Bogdan', 'Ana']) && u === 'Ana', det: `dupa OK A2:A4=${j(d)} (Nota 2 crescator: 6, 8, 10 → Dan, Bogdan, Ana); Ctrl+Z A2=${j(u)}` };
  } },
  { nume: 'r4b litera B › Data › Sort A to Z › Sort Warning › Continue: doar coloana B (antetul ramane), A neschimbata; Ctrl+Z', fn: async (p, h) => {
    await h.antetCol('B'); await p.locator(`${APP} [data-lh-tinta="fila:Data"]`).first().click(); await pauza(150);
    await h.mso('SortAscendingExcel');
    const av = !!(await h.st()).dialog;
    if (!await h.clicEt('Continue with the current selection', 'RadioButton')) return { ok: false, det: 'fara Sort Warning: dialog=' + j((await h.st()).dialog) };
    const z0 = (await h.st()).selectie.zona, rb = await h.bifat('Continue with the current selection');
    const bs = p.locator(`${APP} [data-lh-tip="Window"] [data-lh-tip="Button"][data-lh-eticheta="Sort..."]`).first(), apasat = await bs.count();
    if (apasat) { await bs.click(); await pauza(200); }
    const dz = j((await h.st()).dialog);
    const d = [await h.v('B1'), await h.v('B2'), await h.v('B3'), await h.v('B4'), await h.v('A2'), await h.v('C2')];
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = await h.v('B2');
    return { ok: av && j(d) === j(['Nota 1', 7, 8, 9, 'Ana', 10]) && u === 9, det: `Sort Warning=${av}; zona=${z0}, Continue bifat=${rb}, Sort... apasat=${apasat}, dialog dupa=${dz}; B1:B4,A2,C2=${j(d)}; Ctrl+Z B2=${j(u)}` };
  } },
  { nume: 'r4b H12 goala › Data › Sort...: mesajul „This can\'t be applied…”, Enter il inchide, foaia neschimbata', fn: async (p, h) => {
    await h.cel('H12'); await p.locator(`${APP} [data-lh-tinta="fila:Data"]`).first().click(); await pauza(150);
    await h.mso('SortDialog');
    const s1 = await h.st(), txt = await p.evaluate(() => document.querySelector('[data-lh-aplicatie="excel"]').innerText);
    await p.keyboard.press('Enter'); await pauza(150);
    const s2 = await h.st();
    return { ok: /can.t be applied to the selected range/.test(txt) && !!s1.dialog && !s2.dialog && (await h.v('A2')) === 'Ana', det: `dialog=${j(s1.dialog && (s1.dialog.titlu || s1.dialog))}; dupa Enter dialog=${j(s2.dialog)}` };
  } },
  { nume: 'r4b fereastra Sort: Move Down pe primul nivel, apoi Delete Level; butoanele gri cu un singur nivel', fn: async (p, h) => {
    await h.cel('A2'); await p.locator(`${APP} [data-lh-tinta="fila:Data"]`).first().click(); await pauza(150);
    await h.mso('SortDialog');
    const gri = () => p.evaluate(() => ['Move Up', 'Move Down'].map(et => { const b = document.querySelector(`[data-lh-aplicatie="excel"] [data-lh-tip="Window"] [data-lh-tip="Button"][data-lh-eticheta="${et}"]`); return b ? b.getAttribute('aria-disabled') === 'true' : null; }));
    const g0 = await gri();
    const cb = async (et, opt, n = 0) => { const c = p.locator(`${APP} [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-eticheta="${et}"]`).nth(n); await c.click(); await pauza(150); const o = p.locator(`${APP} [role="option"][data-lh-eticheta="${opt}"]`).last(); await o.click(); await pauza(150); };
    await cb('Sort by', 'Elev'); await h.clicEt('Add Level', 'Button'); await cb('Then by', 'Nota 1');
    await p.locator(`${APP} [data-lh-tip="Window"] [data-lh-nivel="0"] [data-lh-tip="DataItem"]`).first().click(); await pauza(150);
    const lista = await p.locator(`${APP} [role="listbox"]`).count();
    if (lista) { await p.keyboard.press('Escape'); await pauza(100); }
    const g1 = await gri();
    await h.clicEt('Move Down', 'Button');
    const v = async n => p.evaluate(n => { const c = document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-camp="coloana"]')[n]; return c ? c.getAttribute('data-lh-valoare') : null; }, n);
    const dupa = [await v(0), await v(1)];
    const g2 = await gri();
    return { ok: j(g0) === j([true, true]) && j(dupa) === j(['Nota 1', 'Elev']) && j(g2) === j([false, true]), det: `gri la pornire ${j(g0)}; dupa alegerea nivelului 0 ${j(g1)}; dupa Move Down nivelurile ${j(dupa)}, gri ${j(g2)}` };
  } },
  { nume: 'r4b fereastra Sort: Ctrl+Sageata jos / sus muta nivelul ales (scurtatura din referinta); OK sorteaza dupa noua ordine', fn: async (p, h) => {
    await h.cel('A2'); await p.locator(`${APP} [data-lh-tinta="fila:Data"]`).first().click(); await pauza(150);
    await h.mso('SortDialog');
    const cb = async (et, opt) => { const c = p.locator(`${APP} [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-eticheta="${et}"]`).first(); await c.click(); await pauza(150); await p.locator(`${APP} [role="option"][data-lh-eticheta="${opt}"]`).last().click(); await pauza(150); };
    await cb('Sort by', 'Nota 1'); await h.clicEt('Add Level', 'Button'); await cb('Then by', 'Nota 2');
    await p.keyboard.press('Control+ArrowUp'); await pauza(150);
    const v0 = await p.evaluate(() => { const c = document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="Window"] [data-lh-tip="ComboBox"][data-lh-camp="coloana"]')[0]; return c ? c.getAttribute('data-lh-valoare') : null; });
    await h.clicEt('OK', 'Button'); await pauza(200);
    const d = [await h.v('A2'), await h.v('A3'), await h.v('A4')];
    return { ok: v0 === 'Nota 2' && j(d) === j(['Dan', 'Bogdan', 'Ana']), det: `dupa Ctrl+Sus primul nivel=${j(v0)}; dupa OK A2:A4=${j(d)}` };
  } },
  { nume: 'r4b grafic: clic pe o coloana Nota 2 › Delete scoate seria; Ctrl+Z o aduce inapoi; Delete pe grafic il sterge', fn: async (p, h) => {
    await h.cel('A1'); await h.cel('C4', { modifiers: ['Shift'] });
    await p.locator(`${APP} [data-lh-tinta="fila:Insert"]`).first().click(); await pauza(150);
    await h.mso('ChartTypeColumnInsertGallery');
    if (!await h.clicEt('Clustered Column')) return { ok: false, det: 'galeria n-are Clustered Column' };
    const pt = await p.evaluate(() => { const r = document.querySelector('[data-lh-aplicatie="excel"] .lh-ap-x-grafic rect[data-lh-serie="1"]'); if (!r) return null; const b = r.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    if (!pt) return { ok: false, det: 'nu gasesc o coloana a seriei 2' };
    await p.mouse.click(pt.x, pt.y); await pauza(200);
    const ales = (await h.st()).grafic_element_ales;
    await p.keyboard.press('Delete'); await pauza(200);
    const s1 = (await h.st()).grafice[0];
    await p.keyboard.press('Control+z'); await pauza(200);
    const s2 = (await h.st()).grafice[0];
    const box = await p.locator(`${APP} .lh-ap-x-grafic`).first().boundingBox();
    await p.mouse.click(box.x + 4, box.y + box.height / 2); await pauza(200);
    await p.keyboard.press('Delete'); await pauza(200);
    const n3 = (await h.st()).grafice.length;
    return { ok: ales === 'Series' && j(s1.serii) === j(['Nota 1']) && s1.titlu === 'Chart Title' && j(s2.serii) === j(['Nota 1', 'Nota 2']) && n3 === 0, det: `ales=${j(ales)}; dupa Delete serii=${j(s1.serii)} titlu=${j(s1.titlu)}; Ctrl+Z serii=${j(s2.serii)}; marginea + Delete → grafice=${n3}` };
  } },
  { nume: 'r4b titlul scris pe loc: al doilea clic, Backspace x5, „Note”, Esc → „Chart Note”; un Ctrl+Z → „Chart Title”', fn: async (p, h) => {
    await h.cel('A1'); await h.cel('C4', { modifiers: ['Shift'] });
    await p.locator(`${APP} [data-lh-tinta="fila:Insert"]`).first().click(); await pauza(150);
    await h.mso('ChartTypeColumnInsertGallery'); await h.clicEt('Clustered Column');
    const t = p.locator(`${APP} [data-lh-tinta="grafic:1/titlu"]`).first();
    await t.click(); await pauza(700); await t.click(); await pauza(200);
    for (let i = 0; i < 5; i++) await p.keyboard.press('Backspace');
    await p.keyboard.type('Note'); await p.keyboard.press('Escape'); await pauza(200);
    const s1 = await h.st();
    await p.keyboard.press('Control+z'); await pauza(200);
    const s2 = await h.st();
    return { ok: s1.grafice[0].titlu === 'Chart Note' && s1.grafic_element_ales === 'Chart Title' && s2.grafice[0].titlu === 'Chart Title', det: `dupa Esc titlu=${j(s1.grafice[0].titlu)}, ales=${j(s1.grafic_element_ales)}; Ctrl+Z titlu=${j(s2.grafice[0].titlu)}` };
  } },
  { nume: 'r4b axa: valorile 120…140 pe linie pornesc de la 110; valorile 3…9 pornesc de la 0', fn: async (p, h) => {
    for (const [a, t] of [['H1', 'Luna'], ['I1', 'V'], ['H2', 'Ian'], ['H3', 'Feb'], ['H4', 'Mar'], ['I2', '120'], ['I3', '130'], ['I4', '140']]) await h.scrie(a, t);
    await h.cel('H1'); await h.cel('I4', { modifiers: ['Shift'] });
    await p.locator(`${APP} [data-lh-tinta="fila:Insert"]`).first().click(); await pauza(150);
    await h.mso('ChartTypeLineInsertGallery');
    const ln = p.locator(`${APP} [data-lh-suprafata="lista.ChartTypeLineInsertGallery"] [data-lh-eticheta="Line"]`).first();
    if (!(await ln.count())) return { ok: false, det: 'galeria Line n-are Line' };
    await ln.click(); await pauza(250);
    const ax = () => p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] .lh-ap-x-grafic .lh-ap-x-gr-val')].map(e => Number(e.textContent.replace(',', '.'))));
    const a1 = await ax();
    await h.cel('B2'); await p.keyboard.press('Escape');
    await h.cel('A1'); await h.cel('B4', { modifiers: ['Shift'] });
    await p.locator(`${APP} [data-lh-tinta="fila:Insert"]`).first().click(); await pauza(150);
    await h.mso('ChartTypeColumnInsertGallery'); await h.clicEt('Clustered Column');
    const a2 = await p.evaluate(() => { const g = [...document.querySelectorAll('[data-lh-aplicatie="excel"] .lh-ap-x-grafic')].pop(); return [...g.querySelectorAll('.lh-ap-x-gr-val')].map(e => Number(e.textContent.replace(',', '.'))); });
    return { ok: a1[0] === 110 && a1[a1.length - 1] === 145 && a2[0] === 0, det: `linie 120…140: ${j(a1)}; coloane 7…9 (A1:B4): ${j(a2)}` };
  } },
  { nume: 'r4b atingere 390x844: Home › Sort & Filter › Sort Z to A cu degetul pe A2', atingere: true, fn: async (p, h) => {
    await h.cel('A2'); await h.mso('SortFilterMenu');
    if (!await h.clicEt('Sort Z to A', 'MenuItem')) return { ok: false, det: 'meniul n-a aparut / n-are Sort Z to A' };
    const d = [await h.v('A2'), await h.v('A3'), await h.v('A4'), await h.v('B2')];
    return { ok: j(d) === j(['Dan', 'Bogdan', 'Ana', 8]), det: `A2:A4,B2=${j(d)}` };
  } },
  { nume: 'r4b atingere 390x844: graficul ales › butonul + › Legend debifat cu degetul (panoul ramane, legenda dispare)', atingere: true, fn: async (p, h) => {
    const nb = p.locator(`${APP} input[aria-label="Name Box"]`);
    await nb.tap(); await p.keyboard.press('Control+a'); await p.keyboard.type('A1:C4'); await p.keyboard.press('Enter'); await pauza(150);
    await p.locator(`${APP} [data-lh-tinta="fila:Insert"]`).first().tap(); await pauza(200);
    await h.mso('ChartTypeColumnInsertGallery');
    if (!await h.clicEt('Clustered Column')) return { ok: false, det: 'galeria n-are Clustered Column' };
    const plus = p.locator(`${APP} [data-lh-tinta="grafic:1/plus"]`).first();
    if (!(await plus.count())) return { ok: false, det: 'butonul + lipseste' };
    const bb = await plus.boundingBox();
    if (!bb || bb.x + bb.width > 390) return { ok: false, det: 'butonul + iese din ecran: ' + j(bb) };
    await plus.tap(); await pauza(200);
    if (!await h.clicEt('Legend', 'CheckBox')) return { ok: false, det: 'panoul n-are Legend' };
    const s = (await h.st()).grafice[0];
    const panou = await p.locator(`${APP} [data-lh-suprafata="lista.ChartElements"]`).count();
    return { ok: j(s.legenda) === '[]' && panou === 1, det: `legenda=${j(s.legenda)}, panoul deschis=${panou}` };
  } },
];

async function apasaTinta(p, tinta) { await p.locator(`${APP} [data-lh-tinta="${tinta}"]:visible`).first().click(); await pauza(250); }

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    // runda 3: NOAPTE_FILTRU=r3 ruleaza doar verificarile al caror nume incepe asa (fara variabila: toate, ca in --regres)
    for (const v of VERIFICARI.filter(x => !process.env.NOAPTE_FILTRU || x.nume.startsWith(process.env.NOAPTE_FILTRU))) {
      let ctx = null;
      try {
        ctx = await browser.newContext(v.atingere ? { viewport: { width: 390, height: 844 }, hasTouch: true } : { viewport: { width: 1280, height: 800 } });
        await ctx.route('**/*', r => { const u = new URL(r.request().url()); return (u.hostname === '127.0.0.1' || u.hostname === 'localhost') ? r.continue() : r.abort(); });
        const p = await ctx.newPage();
        p.setDefaultTimeout(6000);
        const erori = [];
        p.on('pageerror', e => erori.push(e.message));
        await deschide(p, base);
        const r = await Promise.race([v.fn(p, unelte(p, !!v.atingere)), new Promise((_, rej) => setTimeout(() => rej(new Error('timp depasit (25 s)')), 25000))]);
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
