// Verificari proprii ale constructorilor din noaptea Excel 22-23.11 (aplicatii/excel.js): drumurile despre care raportul spune
// ca merg, altele decat cele jucate de probele de paritate (alt rand, Ctrl+Z / Ctrl+Y, tastatura, atingere pe 390x844).
// Fiecare constructor ADAUGA verificari la sfarsitul listei VERIFICARI, fara sa le rescrie pe cele de dinainte.
// Rulare:  node aplicatii/_verificare/excel_noapte_checks.mjs   (din orice director; intra singur in excel_paritate.mjs --regres)
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
  // ---------------- runda 1 (lot 1: stergerea de randuri / coloane / celule, Clear, lipirea)
  { nume: 'r1 rand 5 › clic dreapta › Delete: randurile urca, =SUM(B2:B6) se strange, =B5*2 devine #REF!, =$B$6 urmeaza; Ctrl+Z / Ctrl+Y', fn: async (p, h) => {
    await h.scrie('F1', '=SUM(B2:B6)'); await h.scrie('G1', '=B5*2'); await h.scrie('H1', '=$B$6'); await h.scrie('A6', 'r6'); await h.scrie('A5', 'r5');
    const s0 = await h.st(), a6 = (s0.celule.A6 || {}).valoare, a5 = (s0.celule.A5 || {}).valoare;
    if (a6 !== 'r6' || a5 !== 'r5') return { ok: false, det: 'pregatirea nu a mers: A5,A6=' + j([a5, a6]) };
    await h.antetRand(5, { button: 'right' });
    if (!await h.clicEt('Delete', 'MenuItem')) return { ok: false, det: 'meniul numarului de rand n-are Delete' };
    const d = [await h.v('A5'), await h.f('F1'), await h.f('G1'), await h.v('G1'), await h.f('H1')];
    const okD = d[0] === a6 && d[1] === '=SUM(B2:B5)' && d[2] === '=#REF!*2' && d[3] === '#REF!' && d[4] === '=$B$5';
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = [await h.v('A5'), await h.f('F1'), await h.f('G1')];
    const okU = u[0] === a5 && u[1] === '=SUM(B2:B6)' && u[2] === '=B5*2';
    await p.keyboard.press('Control+y'); await pauza(150);
    const okY = (await h.v('A5')) === a6 && (await h.f('F1')) === '=SUM(B2:B5)';
    return { ok: okD && okU && okY, det: `dupa Delete: A5,F1,G1,G1=,H1=${j(d)}; Ctrl+Z: ${j(u)}; Ctrl+Y: ${okY}` };
  } },
  { nume: 'r1 B2:B4 › clic dreapta › Delete...: alegerea de pornire Shift cells left (zona inalta); Entire row + Enter din tastatura sterge randurile 2-4', fn: async (p, h) => {
    await h.scrie('A6', 'r6'); await pauza(700);
    await h.cel('B2'); await h.cel('B4', { modifiers: ['Shift'] });
    await h.cel('B3', { button: 'right' });
    if (!await h.clicEt('Delete...', 'MenuItem')) return { ok: false, det: 'meniul celulei n-are Delete...' };
    const b0 = await h.bifat('Shift cells left');
    if (!await h.clicEt('Entire row', 'RadioButton')) return { ok: false, det: 'fereastra Delete n-are Entire row' };
    const b1 = await h.bifat('Entire row');
    await p.keyboard.press('Enter'); await pauza(200);
    const s = await h.st();
    const ok = b0 === 'true' && b1 === 'true' && !s.dialog && (s.celule.A3 || {}).valoare === 'r6' && !s.celule.A6;
    return { ok, det: `Shift cells left bifat la pornire=${b0}; Entire row bifat dupa clic=${b1}; dupa Enter: fereastra=${j(s.dialog)}, A3=${j((s.celule.A3 || {}).valoare)} (asteptat "r6", urcat din A6), A6=${j(s.celule.A6)}` };
  } },
  { nume: 'r1 coloanele B:C (scrise in Name Box) › Home › Delete: D1 ajunge in B1, =D2 din F1 devine =B2 in D1', fn: async (p, h) => {
    await h.scrie('F1', '=D2');
    const d1 = await h.v('D1');
    const nb = p.locator(`${APP} input[aria-label="Name Box"]`);
    await nb.click(); await p.keyboard.press('Control+a'); await p.keyboard.type('B:C'); await p.keyboard.press('Enter'); await pauza(150);
    const z = (await h.st()).selectie.zona;
    await h.mso('CellsDeleteSmart'); await pauza(150);
    const r = [await h.v('B1'), await h.f('D1')];
    return { ok: z === 'B:C' && r[0] === d1 && r[1] === '=B2', det: `selectie ${z}; B1,D1=${j(r)} (asteptat ${j([d1, '=B2'])})` };
  } },
  { nume: 'r1 B2 copiat pe F2:F5 (multiplu) se lipeste de 4 ori; Ctrl+Z goleste; Paste ▾ › Values (V) lipeste valoarea unei formule, nu formula', fn: async (p, h) => {
    await h.cel('B2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.cel('F2'); await h.cel('F5', { modifiers: ['Shift'] }); await p.keyboard.press('Control+v'); await pauza(150);
    const b2 = await h.v('B2'), m = [await h.v('F2'), await h.v('F3'), await h.v('F4'), await h.v('F5')];
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = [await h.v('F2'), await h.v('F5')];
    await h.scrie('H2', '=B2*2'); await pauza(700);   // al doilea clic pe H2 sub 650 ms ar fi dublu clic (editare)
    await h.cel('H2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.cel('J2'); await h.mso('PasteMenu_Dropdown', { pauza: 250 });
    if (!await h.clicEt('Values (V)', 'MenuItem')) return { ok: false, det: 'Paste ▾ n-are Values (V)' };
    const c = ((await h.st()).celule.J2) || {};
    const ok = m.every(x => x === b2) && u.every(x => x === undefined) && c.valoare === b2 * 2 && !c.formula;
    return { ok, det: `F2:F5=${j(m)}; dupa Ctrl+Z F2,F5=${j(u)}; Values pe J2: ${j(c)}` };
  } },
  { nume: 'r1 Clear ▾ › Clear All scoate valoarea, boldul si imbinarea; Ctrl+Z le aduce inapoi', fn: async (p, h) => {
    await h.scrie('F6', 'x'); await h.cel('F6'); await h.cel('G6', { modifiers: ['Shift'] });
    await h.mso('MergeCenter'); await h.mso('Bold'); await pauza(100);
    await h.mso('ClearMenu', { pauza: 250 });
    if (!await h.clicEt('Clear All', 'MenuItem')) return { ok: false, det: 'lista Clear n-are Clear All' };
    const a = [await h.v('F6'), await h.fmt('F6')];
    await p.keyboard.press('Control+z'); await pauza(150);
    const b = [await h.v('F6'), await h.fmt('F6')];
    const ok = a[0] === undefined && !a[1].bold && !a[1].imbinat && b[0] === 'x' && b[1].bold && b[1].imbinat === 'F6:G6';
    return { ok, det: `dupa Clear All: ${j(a)}; dupa Ctrl+Z: ${j(b)}` };
  } },
  { nume: 'r1 atingere 390x844: atingere pe numarul randului 3 › atingere pe Home › Delete sterge randul', atingere: true, fn: async (p, h) => {
    const s0 = await h.st(), a4 = (s0.celule.A4 || {}).valoare;
    await h.antetRand(3);
    const z = (await h.st()).selectie.zona;
    await h.mso('CellsDeleteSmart'); await pauza(200);
    const a3 = await h.v('A3');
    return { ok: z === '3:3' && a3 === a4, det: `selectie dupa atingere ${z}; A3 dupa Delete=${j(a3)} (asteptat ${j(a4)})` };
  } },
  { nume: 'r1 Name Box: numele „note” pe B3:C4 urmeaza zona dupa stergerea randului 2 (devine B2:C3) si se vede in Name Box', fn: async (p, h) => {
    await h.cel('B3'); await h.cel('C4', { modifiers: ['Shift'] });
    const nb = p.locator(`${APP} input[aria-label="Name Box"]`);
    await nb.click(); await p.keyboard.press('Control+a'); await p.keyboard.type('note'); await p.keyboard.press('Enter'); await pauza(150);
    await h.antetRand(2, { button: 'right' });
    if (!await h.clicEt('Delete', 'MenuItem')) return { ok: false, det: 'meniul randului n-are Delete' };
    await h.cel('E8');
    await nb.click(); await p.keyboard.press('Control+a'); await p.keyboard.type('note'); await p.keyboard.press('Enter'); await pauza(150);
    const s = await h.st(), vNb = await nb.inputValue();
    return { ok: s.selectie.zona === 'B2:C3' && vNb === 'note' && (s.nume_definite || {}).note === 'Sheet1!B2:C3', det: `zona=${s.selectie.zona}; Name Box=${j(vNb)}; nume_definite=${j(s.nume_definite)}` };
  } },
  // ---------------- runda 2 (lot 2: tipuri de date, formate de numar)
  { nume: 'r2 Number Format ▾ › Currency pe J2:J3 (1234,5 / -7): „1.234,50 lei” / „-7,00 lei”, caseta „Currency”, alta celula = „General”; Ctrl+Z da inapoi; Text pe K2 + 0123 ramane text', fn: async (p, h) => {
    const caseta = () => p.evaluate(() => { const i = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-tip="ComboBox"][data-lh-eticheta="Number Format"] input'); return i ? i.value : null; });
    const txt = async a => (((await h.st()).celule || {})[a] || {}).text;
    await h.scrie('J2', '1234,5'); await h.scrie('J3', '-7');
    await h.cel('J2'); await h.cel('J3', { modifiers: ['Shift'] });
    await apasaTinta(p, 'meniu_derulant:Home/Number/Number Format');
    if (!await h.clicEt('Currency', 'MenuItem')) return { ok: false, det: 'lista Number Format n-are Currency' };
    const t = [await txt('J2'), await txt('J3')], c1 = await caseta();
    await h.cel('L9'); const c2 = await caseta();
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = await txt('J2');
    await h.cel('K2'); await apasaTinta(p, 'meniu_derulant:Home/Number/Number Format');
    if (!await h.clicEt('Text', 'MenuItem')) return { ok: false, det: 'lista Number Format n-are Text' };
    await h.scrie('K2', '0123');
    const k2 = ((await h.st()).celule || {}).K2 || {};
    const ok = t[0] === '1.234,50 lei' && t[1] === '-7,00 lei' && c1 === 'Currency' && c2 === 'General' && u === '1234,5' && k2.valoare === '0123';
    return { ok, det: `J2,J3=${j(t)}; caseta=${j(c1)}, pe L9=${j(c2)}; dupa Ctrl+Z J2=${j(u)}; K2 (Text) + 0123 = ${j(k2)}` };
  } },
  { nume: 'r2 Decrease Decimal pe 2,5 → „3”, Increase de doua ori → „2,50”, Ctrl+Z → „2,5”; valoarea ramane 2,5; Comma Style pe -1234 → „-1.234,00”', fn: async (p, h) => {
    const txt = async a => (((await h.st()).celule || {})[a] || {}).text;
    await h.scrie('J4', '2,5'); await h.cel('J4');
    await h.mso('DecimalsDecrease'); const a = await txt('J4');
    await h.mso('DecimalsIncrease'); await h.mso('DecimalsIncrease'); const b = await txt('J4');
    await p.keyboard.press('Control+z'); await pauza(150); const c = await txt('J4'), v = await h.v('J4');
    await h.scrie('J6', '-1234'); await h.cel('J6'); await h.mso('CommaStyle');
    const d = String(await txt('J6')).replace(/\s+/g, ' ').trim();
    return { ok: a === '3' && b === '2,50' && c === '2,5' && v === 2.5 && d === '-1.234,00', det: `dupa Decrease ${j(a)}, dupa 2×Increase ${j(b)}, dupa Ctrl+Z ${j(c)} (valoare ${v}); Comma Style pe -1234: ${j(d)}` };
  } },
  { nume: 'r2 forme tastate: 15/03/2027, 3 martie 2027, 25%, 1.234.567, 7:05 — valori, texte, bara de formule; =L5*2 cu 25% da 0,5', fn: async (p, h) => {
    const fx = () => p.evaluate(() => { const i = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-tinta="bara_formule"] input, [data-lh-aplicatie="excel"] input[aria-label="Formula Bar"]'); return i ? i.value : null; });
    const forme = [['L2', '15/03/2027'], ['L3', '3 martie 2027'], ['L5', '25%'], ['L6', '1.234.567'], ['L7', '7:05']];
    for (const [a, t] of forme) await h.scrie(a, t);
    await h.scrie('M5', '=L5*2');
    const s = await h.st(), c = a => s.celule[a] || {};
    const bara = [];
    for (const a of ['L2', 'L5', 'L7']) { await h.cel(a); bara.push(await fx()); }
    const ok = c('L2').valoare === 46461 && c('L2').text === '15.03.2027' && c('L3').valoare === 46449 && c('L5').valoare === 0.25 && c('L5').text === '25%'
      && c('L6').valoare === 1234567 && c('L6').text === '1.234.567' && Math.abs(c('L7').valoare - (7 * 60 + 5) / 1440) < 1e-9 && c('L7').text === '7:05'
      && c('M5').valoare === 0.5 && bara[0] === '15.03.2027' && bara[1] === '25%' && bara[2] === '7:05:00';
    return { ok, det: `L2=${j(c('L2'))} L3=${j(c('L3'))} L5=${j(c('L5'))} L6=${j(c('L6'))} L7=${j(c('L7'))} M5=${j(c('M5').valoare)}; bara L2/L5/L7=${j(bara)}` };
  } },
  { nume: 'r2 triunghiul verde: =1/0 › butonul de avertizare › „Divide by Zero Error” › Ignore Error scoate triunghiul; \'42 › Convert to Number da numarul 42; Ctrl+Z il face iar text', fn: async (p, h) => {
    const tri = a => p.evaluate(a => !!document.querySelector(`[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${a}"] .lh-ap-x-tri`), a);
    const butonViz = () => p.evaluate(() => { const b = document.querySelector('[data-lh-aplicatie="excel"] .lh-ap-x-avert'); return !!b && b.getBoundingClientRect().width > 0; });
    const textNoi = () => p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-suprafata="lista.ErrorChecking"] *')].map(e => e.textContent).join('|'));
    await h.scrie('J8', '=1/0'); const t0 = await tri('J8');
    await pauza(700); await h.cel('J8'); const bv = await butonViz();   // pauza: al doilea clic sub 650 ms ar fi dublu clic (editare)
    await p.locator(`${APP} .lh-ap-x-avert`).click(); await pauza(200);
    const lista = await textNoi();
    if (!await h.clicEt('Ignore Error', 'MenuItem')) return { ok: false, det: 'lista avertizarii n-are Ignore Error: ' + lista };
    const t1 = await tri('J8');
    await h.scrie('K8', "'42"); await pauza(700); await h.cel('K8');
    await p.locator(`${APP} .lh-ap-x-avert`).click(); await pauza(200);
    if (!await h.clicEt('Convert to Number', 'MenuItem')) return { ok: false, det: 'lista n-are Convert to Number' };
    const v1 = await h.v('K8'), t2 = await tri('K8');
    await p.keyboard.press('Control+z'); await pauza(150);
    const v2 = await h.v('K8');
    const ok = t0 && bv && /Divide by Zero Error/.test(lista) && !t1 && v1 === 42 && !t2 && v2 === '42';
    return { ok, det: `triunghi J8=${t0}, buton=${bv}, lista=${j(lista.slice(0, 80))}, dupa Ignore Error triunghi=${t1}; K8 dupa Convert=${j(v1)} (triunghi ${t2}), dupa Ctrl+Z=${j(v2)}` };
  } },
  { nume: 'r2 calculator fara atingere: bara de taste nu apare (nu ia loc)', fn: async (p) => {
    const n = await p.evaluate(() => [...document.querySelectorAll('[data-lh-ajutor="taste"]')].filter(e => e.getBoundingClientRect().height > 0).length);
    return { ok: n === 0, det: `bare de taste vizibile: ${n}` };
  } },
  { nume: 'r2 atingere 390x844: bara de taste sub fereastra; C3 › „\'” › 12 › „Enter” = textul „12” (triunghi), activa C4; „↑” urca pe C3; „Esc” renunta la o scriere', atingere: true, fn: async (p, h) => {
    const tasta = async et => { const b = p.locator(`${APP} [data-lh-ajutor="taste"] [data-lh-eticheta="${et}"]`); if (!(await b.count())) return false; await b.first().tap(); await pauza(180); return true; };
    const bara = await p.evaluate(() => { const b = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-ajutor="taste"]'); const g = document.querySelector('[data-lh-aplicatie="excel"] .lh-ap-x-corp') || document.querySelector('[data-lh-aplicatie="excel"] [data-lh-tinta="celula"]'); if (!b) return null; const r = b.getBoundingClientRect(), q = g.getBoundingClientRect(); return { sub: r.top >= q.top, h: Math.round(r.height) }; });
    await h.cel('C3');
    if (!await tasta("'")) return { ok: false, det: 'nu exista butonul apostrof in bara' };
    await p.keyboard.type('12');
    await tasta('Enter');
    const s1 = await h.st(), c3 = s1.celule.C3 || {};
    await tasta('↑'); const act = (await h.st()).selectie.activa;
    await p.keyboard.type('9'); await tasta('Esc');
    const c3b = ((await h.st()).celule.C3 || {}).valoare;
    const ok = !!bara && bara.sub && c3.valoare === '12' && s1.selectie.activa === 'C4' && act === 'C3' && c3b === '12';
    return { ok, det: `bara=${j(bara)}; C3=${j(c3)}, activa ${s1.selectie.activa}; dupa ↑ ${act}; 9 + Esc: C3=${j(c3b)}` };
  } },
  // ---------------- runda 2: reparatiile din critici/de_reparat.md (G1-1, G1-2, G1-3)
  { nume: 'r2 G1-2 clic pe numarul 4 › Shift+clic pe 5 = 4:5, clic dreapta › Delete sterge ambele; clic 3 › Ctrl+clic 6 = 3:3,6:6; clic B › Shift+clic C = B:C', fn: async (p, h) => {
    for (let r = 3; r <= 8; r++) await h.scrie('J' + r, 'r' + r);
    await pauza(300);
    await h.antetRand(4); await h.antetRand(5, { modifiers: ['Shift'] });
    const z1 = (await h.st()).selectie.zona;
    await h.antetRand(5, { button: 'right' });
    if (!await h.clicEt('Delete', 'MenuItem')) return { ok: false, det: 'meniul randului n-are Delete' };
    const dupa = [await h.v('J4'), await h.v('J5'), await h.v('J6')];
    await h.antetRand(3); await h.antetRand(6, { modifiers: ['Control'] });
    const z2 = (await h.st()).selectie.zona;
    await h.antetCol('B'); await h.antetCol('C', { modifiers: ['Shift'] });
    const z3 = (await h.st()).selectie.zona;
    const ok = z1 === '4:5' && j(dupa) === j(['r6', 'r7', 'r8']) && z2 === '3:3,6:6' && z3 === 'B:C';
    return { ok, det: `Shift: ${z1}; dupa Delete J4:J6=${j(dupa)} (asteptat r6,r7,r8); Ctrl: ${z2}; coloane: ${z3}` };
  } },
  { nume: 'r2 G1-1 graficul din J10:K15 urmeaza stergerea randului 11 (zona J10:K14); Ctrl+Z il pune la loc', fn: async (p, h) => {
    await h.scrie('J10', 'nume'); await h.scrie('K10', 'val');
    for (let r = 11; r <= 17; r++) { await h.scrie('J' + r, 'r' + (r - 9)); await h.scrie('K' + r, String((r - 10) * 10)); }
    await pauza(300);
    await h.cel('J10'); await h.cel('K15', { modifiers: ['Shift'] });
    await p.locator(`${APP} [data-lh-tinta="fila:Insert"]`).first().click(); await pauza(200);
    await h.mso('ChartTypeColumnInsertGallery', { pauza: 250 });
    if (!await h.clicEt('Clustered Column')) return { ok: false, det: 'galeria n-are Clustered Column' };
    await pauza(200); await h.cel('N25');
    const z0 = ((await h.st()).grafice || [])[0];
    await h.antetRand(11, { button: 'right' });
    if (!await h.clicEt('Delete', 'MenuItem')) return { ok: false, det: 'meniul randului n-are Delete' };
    const g1 = ((await h.st()).grafice || [])[0] || {};
    await p.keyboard.press('Control+z'); await pauza(150);
    const g2 = ((await h.st()).grafice || [])[0] || {};
    const ok = !!z0 && z0.zona === 'J10:K15' && g1.zona === 'J10:K14' && j(g1.categorii) === j(['r3', 'r4', 'r5', 'r6']) && g2.zona === 'J10:K15';
    return { ok, det: `inainte ${j(z0 && z0.zona)}; dupa Delete rand 11: ${j(g1.zona)} categorii ${j(g1.categorii)}; dupa Ctrl+Z ${j(g2.zona)}` };
  } },
  { nume: 'r2 G1-3 J20:K21 imbinata, I21 › Delete... › Shift cells left › OK: mesajul „We can\'t do that to a merged cell.”, nimic mutat; OK il inchide', fn: async (p, h) => {
    await h.scrie('J20', 'x'); await h.scrie('L21', 'e3'); await pauza(300);
    await h.cel('J20'); await h.cel('K21', { modifiers: ['Shift'] });
    await h.mso('MergeCenter'); await pauza(150);
    await h.cel('I21'); await h.cel('I21', { button: 'right' });
    if (!await h.clicEt('Delete...', 'MenuItem')) return { ok: false, det: 'meniul celulei n-are Delete...' };
    if (!await h.clicEt('Shift cells left', 'RadioButton')) return { ok: false, det: 'fereastra Delete n-are Shift cells left' };
    if (!await h.clicEt('OK', 'Button')) return { ok: false, det: 'fereastra Delete n-are OK' };
    const s = await h.st(), mesaj = j(s.fereastra_mesaj || s.dialog || null);
    const l21 = (s.celule.L21 || {}).valoare, imb = ((s.format_celule || {}).J20 || {}).imbinat;
    await h.clicEt('OK', 'Button');
    const dupa = (await h.st()).dialog;
    const ok = /merged cell/.test(mesaj) && l21 === 'e3' && imb === 'J20:K21' && !dupa;
    return { ok, det: `mesaj=${mesaj.slice(0, 120)}; L21=${j(l21)}, J20 imbinat=${j(imb)}; dupa OK fereastra=${j(dupa)}` };
  } },
  // ---------------- runda 2: lotul de rezerva (lot 3) — aliniere verticala, imbinare, culori, marimea fontului
  { nume: 'r2 L3 Top Align pe J2:K3 (aliniere_verticala sus pe ambele), Middle pe J2, Ctrl+Z inapoi la sus; Clear Formats scoate alinierea', fn: async (p, h) => {
    await h.cel('J2'); await h.cel('K3', { modifiers: ['Shift'] });
    await h.mso('AlignTopExcel');
    const a = [(await h.fmt('J2')).aliniere_verticala, (await h.fmt('K3')).aliniere_verticala];
    await h.cel('J2'); await h.mso('AlignMiddleExcel'); const b2 = (await h.fmt('J2')).aliniere_verticala;
    await p.keyboard.press('Control+z'); await pauza(150); const c = (await h.fmt('J2')).aliniere_verticala;
    await h.cel('J2'); await h.cel('K3', { modifiers: ['Shift'] }); await h.mso('ClearMenu', { pauza: 250 });
    if (!await h.clicEt('Clear Formats', 'MenuItem')) return { ok: false, det: 'Clear ▾ n-are Clear Formats' };
    const d = (await h.fmt('K3')).aliniere_verticala;
    return { ok: j(a) === j(['sus', 'sus']) && b2 === 'mijloc' && c === 'sus' && !d, det: `Top pe J2:K3=${j(a)}; Middle pe J2=${j(b2)}; Ctrl+Z=${j(c)}; dupa Clear Formats K3=${j(d)}` };
  } },
  { nume: 'r2 L3 Merge & Center pe J2:L2 cu doua valori: avertismentul; Cancel nu imbina; OK imbina si pastreaza J2; Ctrl+Z aduce inapoi L2', fn: async (p, h) => {
    await h.scrie('J2', 'unu'); await h.scrie('L2', 'doi'); await pauza(300);
    await h.cel('J2'); await h.cel('L2', { modifiers: ['Shift'] });
    await h.mso('MergeCenter', { pauza: 250 });
    const m1 = j((await h.st()).fereastra_mesaj || null);
    if (!await h.clicEt('Cancel', 'Button')) return { ok: false, det: 'avertismentul n-are Cancel: ' + m1 };
    const dupaC = (await h.fmt('J2')).imbinat;
    await h.cel('J2'); await h.cel('L2', { modifiers: ['Shift'] });
    await h.mso('MergeCenter', { pauza: 250 });
    if (!await h.clicEt('OK', 'Button')) return { ok: false, det: 'avertismentul n-are OK' };
    const s = await h.st(), imb = ((s.format_celule || {}).J2 || {}).imbinat, j2 = (s.celule.J2 || {}).valoare, l2 = (s.celule.L2 || {}).valoare;
    await p.keyboard.press('Control+z'); await pauza(150);
    const l2b = await h.v('L2');
    const ok = /upper-left value/.test(m1) && !dupaC && imb === 'J2:L2' && j2 === 'unu' && l2 === undefined && l2b === 'doi';
    return { ok, det: `mesaj=${m1.slice(0, 90)}; dupa Cancel imbinat=${j(dupaC)}; dupa OK imbinat=${j(imb)} J2=${j(j2)} L2=${j(l2)}; Ctrl+Z L2=${j(l2b)}` };
  } },
  { nume: 'r2 L3 Merge & Center ▾ › Merge Across pe J5:K6 (cate o valoare pe rand, fara avertisment) = J5:K5 si J6:K6 necentrate; › Unmerge Cells le desface', fn: async (p, h) => {
    await h.scrie('J5', 'a'); await h.scrie('K6', 'b'); await pauza(300);
    await h.cel('J5'); await h.cel('K6', { modifiers: ['Shift'] });
    await h.mso('MergeCenterMenu_Dropdown', { pauza: 250 });
    if (!await h.clicEt('Merge Across', 'MenuItem')) return { ok: false, det: 'lista n-are Merge Across' };
    const s = await h.st(), f5 = (s.format_celule || {}).J5 || {}, f6 = (s.format_celule || {}).J6 || {}, j6 = (s.celule.J6 || {}).valoare;
    await h.mso('MergeCenterMenu_Dropdown', { pauza: 250 });
    if (!await h.clicEt('Unmerge Cells', 'MenuItem')) return { ok: false, det: 'lista n-are Unmerge Cells' };
    const u = [(await h.fmt('J5')).imbinat, (await h.fmt('J6')).imbinat];
    const ok = f5.imbinat === 'J5:K5' && f6.imbinat === 'J6:K6' && f5.aliniere !== 'centru' && j6 === 'b' && !u[0] && !u[1];
    return { ok, det: `J5=${j(f5)} J6=${j(f6)} J6 valoare=${j(j6)} (b mutat din K6); dupa Unmerge ${j(u)}` };
  } },
  { nume: 'r2 L3 Font Color ▾ › Dark Red pe J8, butonul pe J9 pune tot Dark Red, Automatic scoate culoarea; Fill Color ▾ › Gold, Accent 4, Lighter 80% pe J10', fn: async (p, h) => {
    await h.scrie('J8', 'x'); await h.scrie('J9', 'y'); await pauza(300);
    const alege = async (a, tinta, et) => { await h.cel(a); await apasaTinta(p, tinta); return h.clicEt(et); };
    if (!await alege('J8', 'meniu_derulant:Home/Font/Font Color', 'Dark Red')) return { ok: false, det: 'paleta Font Color n-are Dark Red' };
    await h.cel('J9'); await h.mso('FontColorPicker');
    const c = [(await h.fmt('J8')).culoare_font, (await h.fmt('J9')).culoare_font];
    if (!await alege('J8', 'meniu_derulant:Home/Font/Font Color', 'Automatic')) return { ok: false, det: 'paleta Font Color n-are Automatic' };
    const auto = (await h.fmt('J8')).culoare_font;
    if (!await alege('J10', 'meniu_derulant:Home/Font/Fill Color', 'Gold, Accent 4, Lighter 80%')) return { ok: false, det: 'paleta Fill Color n-are nuanta Gold, Accent 4, Lighter 80%' };
    const u = (await h.fmt('J10')).umplere;
    return { ok: j(c) === j(['C00000', 'C00000']) && !auto && u === 'FFF2CC', det: `Font Color J8,J9=${j(c)}; dupa Automatic=${j(auto)}; umplere J10=${j(u)}` };
  } },
  { nume: 'r2 L3 Font Size ▾ › 36 pe J12 (goala) creste randul 12; Ctrl+Z il readuce; A▼ pe J13 da 10 pt', fn: async (p, h) => {
    await h.cel('J12'); await apasaTinta(p, 'meniu_derulant:Home/Font/Font Size');
    if (!await h.clicEt('36', 'MenuItem')) return { ok: false, det: 'lista Font Size n-are 36' };
    const s = await h.st(), r12 = (s.inaltimi_randuri || {})['12'], m = ((s.format_celule || {}).J12 || {}).marime_font;
    await p.keyboard.press('Control+z'); await pauza(150);
    const r12b = ((await h.st()).inaltimi_randuri || {})['12'];
    await h.cel('J13'); await apasaTinta(p, 'panglica:Home/Font/Decrease Font Size');
    const m13 = (await h.fmt('J13')).marime_font;
    return { ok: m === 36 && r12 > 50 && !r12b && m13 === 10, det: `J12 marime=${j(m)}, randul 12=${j(r12)} px; dupa Ctrl+Z=${j(r12b)}; A▼ pe J13=${j(m13)}` };
  } },
  { nume: 'r2 L3 atingere 390x844: Fill Color ▾ › Red pe C3 cu degetul (paleta incape pe ecran)', atingere: true, fn: async (p, h) => {
    await h.cel('C3');
    await p.locator(`${APP} [data-lh-tinta="meniu_derulant:Home/Font/Fill Color"]:visible`).first().tap(); await pauza(250);
    const inc = await p.evaluate(() => { const m = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-suprafata="lista.FillColor"]'); if (!m) return null; const r = m.getBoundingClientRect(); return { stanga: Math.round(r.left), dreapta: Math.round(r.right), jos: Math.round(r.bottom), w: innerWidth, h: innerHeight }; });
    if (!inc) return { ok: false, det: 'paleta nu s-a deschis la atingere' };
    if (!await h.clicEt('Red')) return { ok: false, det: 'paleta n-are Red' };
    const u = (await h.fmt('C3')).umplere;
    return { ok: u === 'FF0000' && inc.stanga >= 0 && inc.dreapta <= inc.w && inc.jos <= inc.h, det: `paleta ${j(inc)}; umplere C3=${j(u)}` };
  } },
  // ---------------- runda 3 (lotul r3: latime si inaltime)
  { nume: 'r3 randurile 5:6 › Home › Format › Row Height… 25 = amandoua 33 px; Ctrl+Z le readuce, Ctrl+Y le pune la loc; AutoFit Row Height le scoate', fn: async (p, h) => {
    await h.antetRand(5); await h.antetRand(6, { modifiers: ['Shift'] });
    await h.mso('FormatCellsMenu', { pauza: 250 });
    if (!await h.clicEt('Row Height...', 'MenuItem')) return { ok: false, det: 'meniul Format n-are Row Height...' };
    const inp = p.locator(`${APP} [data-lh-tinta="camp:inaltime_rand"] input`).first();
    const v0 = await inp.inputValue();
    await inp.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('25'); await p.keyboard.press('Enter'); await pauza(200);
    const ir = s => [(s.inaltimi_randuri || {})['5'], (s.inaltimi_randuri || {})['6']];
    const a = ir(await h.st());
    await p.keyboard.press('Control+z'); await pauza(150); const u = ir(await h.st());
    await p.keyboard.press('Control+y'); await pauza(150); const y = ir(await h.st());
    await h.mso('FormatCellsMenu', { pauza: 250 });
    if (!await h.clicEt('AutoFit Row Height', 'MenuItem')) return { ok: false, det: 'meniul Format n-are AutoFit Row Height' };
    const af = ir(await h.st());
    return { ok: v0 === '14,4' && j(a) === j([33, 33]) && !u[0] && !u[1] && j(y) === j([33, 33]) && !af[0] && !af[1],
      det: `valoarea de pornire ${j(v0)}; dupa 25: ${j(a)}; Ctrl+Z ${j(u)}; Ctrl+Y ${j(y)}; AutoFit ${j(af)}` };
  } },
  { nume: 'r3 tragerea liniei de sub numarul 8 cu mouse-ul: bula „Height: … (… pixels)”, randul creste; Ctrl+Z; dublu clic pe linie = inaltimea standard', fn: async (p, h) => {
    const b = await p.locator(`${APP} [data-lh-tinta="antet_rand_margine"][data-lh-id="8"]`).first().boundingBox();
    const x = b.x + b.width / 2, y = b.y + b.height / 2;
    await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x, y + 15, { steps: 3 }); await p.mouse.move(x, y + 30, { steps: 3 }); await pauza(100);
    const bula = await p.evaluate(() => (document.querySelector('[data-lh-aplicatie="excel"] .lh-ap-x-bula') || {}).textContent || '');
    await p.mouse.up(); await pauza(200);
    const h8 = ((await h.st()).inaltimi_randuri || {})['8'];
    await p.keyboard.press('Control+z'); await pauza(150); const u = ((await h.st()).inaltimi_randuri || {})['8'];
    await p.keyboard.press('Control+y'); await pauza(150);
    await p.locator(`${APP} [data-lh-tinta="antet_rand_margine"][data-lh-id="8"]`).first().dblclick(); await pauza(250);
    const d = ((await h.st()).inaltimi_randuri || {})['8'], gata = await p.evaluate(() => !document.querySelector('[data-lh-aplicatie="excel"] .lh-ap-x-bula'));
    return { ok: /^Height: \d+,\d\d \(\d+ pixels\)$/.test(bula) && h8 >= 45 && !u && !d && gata, det: `bula ${j(bula)}; randul 8=${j(h8)}; Ctrl+Z ${j(u)}; dublu clic ${j(d)}; bula disparuta ${gata}` };
  } },
  { nume: 'r3 B:C › Format › Column Width… 12 = amandoua; Default Width… 10 lateste D (nelatita), B:C raman; Ctrl+Z readuce D la 64', fn: async (p, h) => {
    await h.antetCol('B'); await h.antetCol('C', { modifiers: ['Shift'] });
    await h.mso('FormatCellsMenu', { pauza: 250 });
    if (!await h.clicEt('Column Width...', 'MenuItem')) return { ok: false, det: 'meniul Format n-are Column Width...' };
    let inp = p.locator(`${APP} [data-lh-tinta="camp:latime_coloana"] input`).first();
    await inp.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('12'); await p.keyboard.press('Enter'); await pauza(200);
    const w = async c => { const b = await p.locator(`${APP} [data-lh-tinta="antet_coloana"][data-lh-id="${c}"]`).first().boundingBox(); return Math.round(b.width); };
    const bc = [await w('B'), await w('C')];
    await h.cel('E2');
    await h.mso('FormatCellsMenu', { pauza: 250 });
    if (!await h.clicEt('Default Width...', 'MenuItem')) return { ok: false, det: 'meniul Format n-are Default Width...' };
    inp = p.locator(`${APP} [data-lh-tinta="camp:latime_standard"] input`).first();
    const v0 = await inp.inputValue();
    await inp.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('10'); await p.keyboard.press('Enter'); await pauza(200);
    const dupa = [await w('B'), await w('D')], std = (await h.st()).latime_standard;
    await p.keyboard.press('Control+z'); await pauza(200);
    const d2 = await w('D');
    return { ok: bc[0] === 92 && bc[1] === 92 && v0 === '8,11' && dupa[0] === 92 && dupa[1] === 78 && std === 78 && d2 === 64, det: `B,C dupa 12: ${j(bc)}; Standard Width arata ${j(v0)}; dupa 10: B,D=${j(dupa)} latime_standard=${j(std)}; Ctrl+Z D=${d2}` };
  } },
  { nume: 'r3 B:C selectate, dublu clic pe linia lui B = amandoua dupa textul lor; o coloana goala latita (H) revine la 64; Ctrl+Z', fn: async (p, h) => {
    await h.scrie('B9', 'Un text destul de lung aici'); await h.scrie('C9', 'Alt text si mai lung decat primul');
    await h.antetCol('B'); await h.antetCol('C', { modifiers: ['Shift'] });
    await p.locator(`${APP} [data-lh-tinta="antet_coloana_margine"][data-lh-id="B"]`).first().dblclick(); await pauza(250);
    const s = await h.st(), lb = (s.latimi_coloane || {}).B, lc = (s.latimi_coloane || {}).C;
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = (await h.st()).latimi_coloane || {};
    await h.cel('J2');
    const m = await p.locator(`${APP} [data-lh-tinta="antet_coloana_margine"][data-lh-id="H"]`).first().boundingBox();
    await p.mouse.move(m.x + 4, m.y + 5); await p.mouse.down(); await p.mouse.move(m.x + 40, m.y + 5, { steps: 4 }); await p.mouse.up(); await pauza(200);
    const lh = ((await h.st()).latimi_coloane || {}).H;
    await p.locator(`${APP} [data-lh-tinta="antet_coloana_margine"][data-lh-id="H"]`).first().dblclick(); await pauza(250);
    const lh2 = ((await h.st()).latimi_coloane || {}).H;
    return { ok: lb > 150 && lc > lb && u.B == null && u.C == null && lh > 90 && lh2 == null, det: `B=${j(lb)} C=${j(lc)}; Ctrl+Z ${j([u.B, u.C])}; H trasa ${j(lh)}, dupa dublu clic ${j(lh2)} (standard)` };
  } },
  { nume: 'r3 atingere 390x844: litera B › cercul ⇔ (tras 50 px lateste B); numarul 4 › cercul ⇕ (tras 40 px), doua atingeri pe cerc = inaltimea standard', atingere: true, fn: async (p, h) => {
    const cerc = async sel => { const l = p.locator(`${APP} .lh-ap-x-cerc${sel}`).first(); if (!(await l.count())) return null; const b = await l.boundingBox(); return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; };
    const trage = async (a, dx, dy) => {
      const cdp = await p.context().newCDPSession(p);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x, y: a.y }] });
      for (let i = 1; i <= 6; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + dx * i / 6, y: a.y + dy * i / 6 }] }); await pauza(25); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach(); await pauza(250);
    };
    const nimic = await cerc('');
    // B, nu C: pe 390 px marginea lui C cade sub bara de derulare verticala (cercul acoperit, vezi raportul runda 3 pct. 4)
    await h.antetCol('B'); await pauza(200);
    const cc = await cerc('-c');
    if (!cc) return { ok: false, det: 'dupa atingerea literei B nu apare cercul ⇔' };
    await trage(cc, 50, 0);
    const lc = ((await h.st()).latimi_coloane || {}).B;
    await h.antetRand(4); await pauza(200);
    const cr = await cerc('-r');
    if (!cr) return { ok: false, det: `B=${j(lc)}; dupa atingerea numarului 4 nu apare cercul ⇕` };
    await trage(cr, 0, 40);
    const r4 = ((await h.st()).inaltimi_randuri || {})['4'];
    const cr2 = await cerc('-r');
    await p.touchscreen.tap(cr2.x, cr2.y); await pauza(80); await p.touchscreen.tap(cr2.x, cr2.y); await pauza(300);
    const r4b = ((await h.st()).inaltimi_randuri || {})['4'];
    return { ok: !nimic && lc > 90 && r4 > 40 && !r4b, det: `cerc inainte de atingere: ${j(nimic)}; B dupa tragere ${j(lc)}; randul 4 dupa tragere ${j(r4)}; dupa doua atingeri ${j(r4b)}` };
  } },
  { nume: 'r3 Cell Styles › Calculation pe B2:C3 (aldin, FA7D00, F2F2F2, bordura); Ctrl+Z il scoate; Currency pe D2 = formatul contabil; Normal scoate tot', fn: async (p, h) => {
    await h.cel('B2'); await h.cel('C3', { modifiers: ['Shift'] });
    const stil = async n => { await h.mso('CellStylesGallery', { pauza: 250 }); return h.clicEt(n, 'MenuItem'); };
    if (!await stil('Calculation')) return { ok: false, det: 'galeria n-are Calculation' };
    const s = await h.st(), b2 = (s.format_celule || {}).B2 || {}, c3 = (s.format_celule || {}).C3 || {}, bd = ((s.format_celule || {}).C3 || {}).borduri || {};
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = (await h.fmt('B2'));
    await h.cel('D2');
    if (!await stil('Currency')) return { ok: false, det: 'galeria n-are Currency' };
    const d2 = (await h.fmt('D2')).format_numar || '';
    if (!await stil('Normal')) return { ok: false, det: 'galeria n-are Normal' };
    const d2n = await h.fmt('D2');
    const ok = b2.bold && b2.culoare_font === 'FA7D00' && b2.umplere === 'F2F2F2' && c3.stil === 'Calculation' && bd.jos && !u.bold && !u.umplere && /lei/.test(d2) && !d2n.format_numar && !d2n.stil;
    return { ok, det: `B2=${j(b2)}; borduri C3=${j(bd)}; Ctrl+Z B2=${j(u)}; Currency D2=${j(d2)}; Normal D2=${j(d2n)}` };
  } },
  { nume: 'r3 formule: -B2 (fara =) devine =-B2, -5 ramane numar, „×” intre ghilimele ramane, =SUM(B4:A2) devine =SUM(A2:B4); Ctrl+Z', fn: async (p, h) => {
    await h.scrie('B2', '7'); await h.scrie('B3', '5'); await h.scrie('B4', '3');
    await h.scrie('D2', '-B2'); await h.scrie('D3', '-5'); await h.scrie('D4', '=IF(B2>1;"2×3";B3÷B4)'); await h.scrie('D5', '=SUM(B4:A2)');
    const s = await h.st(), c = a => s.celule[a] || {};
    const r = [normF(c('D2').formula), c('D2').valoare, c('D3').formula, c('D3').valoare, normF(c('D4').formula), c('D4').valoare, normF(c('D5').formula), c('D5').valoare];
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = await h.v('D5');
    const ok = r[0] === '=-B2' && r[1] === -7 && !r[2] && r[3] === -5 && r[4] === '=IF(B2>1,"2×3",B3/B4)' && r[5] === '2×3' && r[6] === '=SUM(A2:B4)' && r[7] === 15 && u === undefined;
    return { ok, det: `D2..D5 = ${j(r)}; Ctrl+Z D5=${j(u)}` };
  } },
  { nume: 'r3 partea goala intre ; = 0: =MAX(-5;;-3) = 0, =AVERAGE(9;;7) = 5,33, =COUNT(1;;2) = 3, =AVERAGE(9;C20;7) cu C20 goala = 8 (referinta goala nu se numara)', fn: async (p, h) => {
    await h.scrie('E2', '=MAX(-5;;-3)'); await h.scrie('E3', '=AVERAGE(9;;7)'); await h.scrie('E4', '=COUNT(1;;2)'); await h.scrie('E5', '=AVERAGE(9;C20;7)');
    const r = [await h.v('E2'), await h.v('E3'), await h.v('E4'), await h.v('E5')];
    return { ok: r[0] === 0 && Math.abs(r[1] - 16 / 3) < 1e-9 && r[2] === 3 && r[3] === 8, det: `E2..E5 = ${j(r)}` };
  } },
  { nume: 'r3 G2-1 Percent Style pe C1:C3, apoi 5 → 0,05 (5%), 0,5 → 0,5 (50%), 12% → 0,12; Ctrl+Z', fn: async (p, h) => {
    await h.cel('C1'); await h.cel('C3', { modifiers: ['Shift'] }); await h.mso('PercentStyle');
    await h.scrie('C1', '5'); await h.scrie('C2', '0,5'); await h.scrie('C3', '12%');
    const s = await h.st(), c = a => s.celule[a] || {};
    const r = [c('C1').valoare, c('C1').text, c('C2').valoare, c('C3').valoare];
    await p.keyboard.press('Control+z'); await pauza(150);
    const u = await h.v('C3');
    return { ok: r[0] === 0.05 && r[1] === '5%' && r[2] === 0.5 && r[3] === 0.12 && u !== 0.12, det: `C1 ${j(r.slice(0, 2))}, C2 ${j(r[2])}, C3 ${j(r[3])}; Ctrl+Z C3=${j(u)} (valoarea de dinainte)` };
  } },
  { nume: 'r3 G2-2 =A1+1 si =A1 iau formatul datei din A1, =B2-B1 pe ore ia h:mm; =A1*2 si =SUM(A1;1) raman General; o celula deja formatata nu se schimba', fn: async (p, h) => {
    await h.scrie('A1', '27.09.2026'); await h.scrie('B1', '12:30'); await h.scrie('B2', '14:15');
    await h.scrie('A4', '=A1+1'); await h.scrie('A5', '=A1'); await h.scrie('B4', '=B2-B1'); await h.scrie('A6', '=A1*2'); await h.scrie('A7', '=SUM(A1;1)');
    await h.cel('C8'); await h.mso('PercentStyle'); await h.scrie('C8', '=A1+1');
    const s = await h.st(), t = a => (s.celule[a] || {}).text;
    const r = [t('A4'), t('A5'), t('B4'), t('A6'), t('A7'), ((s.format_celule || {}).C8 || {}).format_numar];
    return { ok: r[0] === '28.09.2026' && r[1] === '27.09.2026' && r[2] === '1:45' && r[3] === '92584' && r[4] === '46293' && r[5] === '0%', det: `A4,A5,B4,A6,A7 = ${j(r.slice(0, 5))}; formatul C8 = ${j(r[5])}` };
  } },
  { nume: 'r3 =ROUND(1;2;3) › Enter: fereastra „too many arguments” (OK, formula ramane in editare); =ROUND(1) da tot „too few”', fn: async (p, h) => {
    const mesaj = () => p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="Window"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' | '));
    await h.cel('E9'); await p.keyboard.type('=ROUND(1;2;3)'); await p.keyboard.press('Enter'); await pauza(200);
    const m1 = await mesaj();
    await p.keyboard.press('Enter'); await pauza(200);
    const ed = (await h.st()).ramane_in_editare;
    await p.keyboard.press('Escape'); await pauza(100); await p.keyboard.press('Escape'); await pauza(100);
    await h.cel('E10'); await p.keyboard.type('=ROUND(1)'); await p.keyboard.press('Enter'); await pauza(200);
    const m2 = await mesaj();
    return { ok: /too many arguments/.test(m1) && ed === true && /too few arguments/.test(m2) && (await h.v('E9')) === undefined, det: `m1=${j(m1.slice(0, 80))}; dupa OK in editare=${ed}; m2=${j(m2.slice(0, 80))}` };
  } },
  { nume: 'r3 pe calculator nu apare niciun cerc ⇔ / ⇕ la clic pe litera / numar', fn: async (p, h) => {
    await h.antetCol('C'); await h.antetRand(4);
    const n = await p.locator(`${APP} .lh-ap-x-cerc`).count();
    return { ok: n === 0, det: `cercuri: ${n}` };
  } },
  // ---------------- runda 5 (reparatiile criticilor 4g si 4f)
  { nume: 'r5 G4g-1 cu Sheet2 ascunsa, Delete pe Sheet1 (clic dreapta, apoi Home › Delete ▾ › Delete Sheet) = refuzul „at least one visible worksheet”, nimic sters', fn: async (p, h) => {
    const fila = n => p.locator(`${APP} [data-lh-tinta="fila_foii"][data-lh-id="${n}"]`);
    const meniuFila = async (n, rand) => { await fila(n).first().click({ button: 'right' }); await pauza(300); return h.clicEt(rand, 'MenuItem'); };
    const mesaj = () => p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="Window"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' | '));
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    await h.scrie('A1', 'date2');
    if (!await meniuFila('Sheet2', 'Hide')) return { ok: false, det: 'meniul filei n-are Hide' };
    await pauza(200);
    if (!await meniuFila('Sheet1', 'Delete')) return { ok: false, det: 'meniul filei n-are Delete' };
    await pauza(250);
    const m1 = await mesaj(), s1 = await h.st();
    await h.clicEt('OK', 'Button'); await pauza(200);
    await apasaTinta(p, 'meniu_derulant:Home/Cells/Delete');
    if (!await h.clicEt('Delete Sheet', 'MenuItem')) return { ok: false, det: 'lista Delete ▾ n-are Delete Sheet' };
    await pauza(250);
    const m2 = await mesaj();
    await h.clicEt('OK', 'Button'); await pauza(200);
    const s2 = await h.st(), nf = await p.locator(`${APP} [data-lh-tinta="fila_foii"]`).count();
    const ok = /at least one visible worksheet/.test(m1) && /at least one visible worksheet/.test(m2) && j(s1.foi) === '["Sheet1","Sheet2"]' && j(s2.foi) === '["Sheet1","Sheet2"]'
      && j(s2.foi_ascunse) === '["Sheet2"]' && s2.foaie_activa === 'Sheet1' && nf === 1 && !s2.dialog;
    return { ok, det: `clic dreapta: ${j(m1.slice(0, 70))}, foi ${j(s1.foi)}; panglica: ${j(m2.slice(0, 70))}; dupa OK: foi ${j(s2.foi)}, ascunse ${j(s2.foi_ascunse)}, activa ${s2.foaie_activa}, file ${nf}, dialog ${j(s2.dialog || null)}` };
  } },
  { nume: 'r5 G4g-1 atingere 390x844: apasare lunga pe Sheet2 › Hide, apasare lunga pe Sheet1 › Delete = refuzul, Sheet1 ramane', atingere: true, fn: async (p, h) => {
    const fila = n => p.locator(`${APP} [data-lh-tinta="fila_foii"][data-lh-id="${n}"]`);
    const cdp = await p.context().newCDPSession(p);
    const lung = async loc => { const b = await loc.first().boundingBox(); if (!b) return false; const x = b.x + b.width / 2, y = b.y + b.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await pauza(900); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pauza(400); return true; };
    const b = await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().boundingBox();
    await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await pauza(400);
    await lung(fila('Sheet2'));
    if (!await h.clicEt('Hide', 'MenuItem')) return { ok: false, det: 'apasarea lunga pe Sheet2 n-a deschis meniul cu Hide' };
    await pauza(250);
    await lung(fila('Sheet1'));
    if (!await h.clicEt('Delete', 'MenuItem')) return { ok: false, det: 'apasarea lunga pe Sheet1 n-a deschis meniul cu Delete' };
    await pauza(250);
    const m = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="Window"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' | '));
    await h.clicEt('OK', 'Button'); await pauza(250);
    const s = await h.st(), nf = await p.locator(`${APP} [data-lh-tinta="fila_foii"]`).count();
    return { ok: /at least one visible worksheet/.test(m) && j(s.foi) === '["Sheet1","Sheet2"]' && s.foaie_activa === 'Sheet1' && nf === 1 && !s.dialog,
      det: `mesaj ${j(m.slice(0, 70))}; foi ${j(s.foi)}, activa ${s.foaie_activa}, file ${nf}, dialog ${j(s.dialog || null)}` };
  } },
  { nume: 'r5 G4g-2 Sheet1..3, Sheet2 ascunsa, Delete pe Sheet1 (activa) › activa devine Sheet3 (vizibila), C3 se scrie in Sheet3', fn: async (p, h) => {
    const fila = n => p.locator(`${APP} [data-lh-tinta="fila_foii"][data-lh-id="${n}"]`);
    const meniuFila = async (n, rand) => { await fila(n).first().click({ button: 'right' }); await pauza(300); return h.clicEt(rand, 'MenuItem'); };
    const plus = async () => { await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300); };
    const pasi = [];
    try {
      await plus(); await plus(); pasi.push('+ + ' + j((await h.st()).foi));
      pasi.push('Hide ' + await meniuFila('Sheet2', 'Hide')); await pauza(200);
      await fila('Sheet1').first().click(); await pauza(300); pasi.push('clic Sheet1');
      pasi.push('Delete ' + await meniuFila('Sheet1', 'Delete')); await pauza(250);
      // '^Button$': butonul Delete din panglica (SplitButton) are aceeasi eticheta si e gasit primul
      if ((await h.st()).dialog) { pasi.push('fereastra Delete ' + await h.clicEt('Delete', '^Button$')); await pauza(250); }
    } catch (e) { return { ok: false, det: 'pasi ' + j(pasi) + ' apoi: ' + String(e.message).split(/\r?\n/)[0] }; }
    const s1 = await h.st();
    try { await h.scrie('C3', 'unde?'); } catch (e) { return { ok: false, det: `pasi ${j(pasi)}; dupa Delete: foi ${j(s1.foi)}, activa ${s1.foaie_activa}, dialog ${j(s1.dialog || null)}, mesaj ${j(s1.fereastra_mesaj || null)}; clic C3: ${String(e.message).split(/\r?\n/)[0]}` }; }
    const s2 = await h.st();
    const act = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tinta="fila_foii"]')].map(x => x.getAttribute('data-lh-id') + (x.classList.contains('activ') ? '*' : '')));
    const fc = s2.foi_celule || {};
    const ok = j(s1.foi) === '["Sheet2","Sheet3"]' && s1.foaie_activa === 'Sheet3' && j(s1.foi_ascunse) === '["Sheet2"]' && ((s2.celule || {}).C3 || {}).valoare === 'unde?' && j(act) === '["Sheet3*"]'
      && !j(fc.Sheet2 || []).includes('C3');
    return { ok, det: `dupa Delete: foi ${j(s1.foi)}, activa ${s1.foaie_activa}, ascunse ${j(s1.foi_ascunse)}; file ${j(act)}; C3=${j(((s2.celule || {}).C3 || {}).valoare)}; foi_celule ${j(fc).slice(0, 120)}` };
  } },
  { nume: 'r5 G4g-3 Sort Largest to Smallest pe o coloana cu #DIV/0! si #VALUE!: erorile primele (in ordinea lor), apoi 5 | 2,5 | 2; Smallest to Largest: erorile dupa numere; Ctrl+Z', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    const rows = [['Suma', 'Raport', 'Elev'], ['5', '=10/A2', 'Ana'], ['0', '=10/A3', 'Bogdan'], ['2', '=10/A4', 'Cristi'], ['4', '=10/A5', 'Dana'], ['x', '=10/A6', 'Elena']];
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < 3; c++) await h.scrie('ABC'[c] + (r + 1), rows[r][c]);
    const elevi = async () => { const s = await h.st(); return [2, 3, 4, 5, 6].map(r => ((s.celule || {})['C' + r] || {}).valoare); };
    // coloana cu erori: meniul spune „Z to A” / „A to Z” (numericaCol cere doar numere), Data › Sort are butoanele fixe
    await h.cel('B4'); await h.mso('SortFilterMenu');
    if (!await h.clicEt('Sort Largest to Smallest', 'MenuItem') && !await h.clicEt('Sort Z to A', 'MenuItem')) return { ok: false, det: 'meniul n-are sortarea descrescatoare' };
    await pauza(200);
    const d = await elevi();
    await h.cel('B4'); await h.mso('SortFilterMenu');
    if (!await h.clicEt('Sort Smallest to Largest', 'MenuItem') && !await h.clicEt('Sort A to Z', 'MenuItem')) return { ok: false, det: 'meniul n-are sortarea crescatoare' };
    await pauza(200);
    const a = await elevi();
    await p.keyboard.press('Control+z'); await pauza(200);
    const u = await elevi();
    const ok = j(d) === '["Bogdan","Elena","Cristi","Dana","Ana"]' && j(a) === '["Ana","Dana","Cristi","Bogdan","Elena"]' && j(u) === j(d);
    return { ok, det: `Z→A ${j(d)}; A→Z ${j(a)}; Ctrl+Z ${j(u)}` };
  } },
  { nume: 'r5 G4f-1 paranteza de la sfarsit uitata se pune singura: =SUM(B2:B7 / =MAX( / =IF(…;"nu" / =ROUND(AVERAGE(…);1 (Enter si Tab); =SUM(B2:B7; ramane refuzata; Ctrl+Z', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    for (const [i, n] of [45, 70, 52, 90, 30, 66].entries()) await h.scrie('B' + (i + 2), String(n));
    await h.scrie('D3', '=SUM(B2:B7'); await h.scrie('D4', '=MAX(B2:B7'); await h.scrie('D5', '=IF(B2>50;"da";"nu"');
    await h.cel('D6'); await p.keyboard.type('=ROUND(AVERAGE(B2:B7);1'); await p.keyboard.press('Tab'); await pauza(200);
    const s = await h.st(), c = a => s.celule[a] || {};
    const r = [normF(c('D3').formula), c('D3').valoare, normF(c('D4').formula), c('D4').valoare, normF(c('D5').formula), c('D5').valoare, normF(c('D6').formula), c('D6').valoare, (s.selectie || {}).activa, s.ramane_in_editare];
    await p.keyboard.press('Control+z'); await pauza(200);
    const u = await h.v('D6');
    await h.cel('D8'); await p.keyboard.type('=SUM(B2:B7;'); await p.keyboard.press('Enter'); await pauza(250);
    const s8 = await h.st();
    const ok = r[0] === '=SUM(B2:B7)' && r[1] === 353 && r[2] === '=MAX(B2:B7)' && r[3] === 90 && r[4] === '=IF(B2>50,"DA","NU")' && r[5] === 'nu' && r[6] === '=ROUND(AVERAGE(B2:B7),1)' && Math.abs(r[7] - 58.8) < 1e-9
      && r[8] === 'E6' && !r[9] && u === undefined && s8.ramane_in_editare === true;
    return { ok, det: `D3..D6 ${j(r.slice(0, 8))}; activa ${r[8]}, in editare ${r[9]}; Ctrl+Z D6=${j(u)}; =SUM(B2:B7; → D8=${j(((s8.celule || {}).D8 || {}).valoare)}, editare ${s8.ramane_in_editare}` };
  } },
  { nume: 'r5 G4f-2 referinta la o singura celula cu text / TRUE e sarita: =SUM(C5)=0, =SUM(B1;B2)=45, =AVERAGE(B1;B2)=45, =MAX(C5;B2)=45, =COUNT(B1;B2)=1, =SUM(C6)=0; =SUM(2;TRUE)=3, =C5+1 = #VALUE!', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    await h.scrie('B1', 'Punctaj'); await h.scrie('B2', '45'); await h.scrie('C5', 'da'); await h.scrie('C6', 'TRUE');
    const f = ['=SUM(C5)', '=SUM(B1;B2)', '=AVERAGE(B1;B2)', '=MAX(C5;B2)', '=COUNT(B1;B2)', '=SUM(C6)', '=SUM(2;TRUE)', '=C5+1'];
    for (const [i, t] of f.entries()) await h.scrie('E' + (i + 1), t);
    const s = await h.st(), r = f.map((_, i) => ((s.celule || {})['E' + (i + 1)] || {}).valoare);
    const ok = j(r) === j([0, 45, 45, 45, 1, 0, 3, '#VALUE!']);
    return { ok, det: `E1..E8 ${j(r)}` };
  } },
  { nume: 'r5 G4f-3 AutoSum pe B2:D5 (coloana D si randul 5 goale): B5 9, C5 90, D2:D4 =SUM(B2:C2)… 22/33/44, D5 99; un Ctrl+Z le scoate; pe B2:D4: D2:D4 pe randuri, nimic sub', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    for (const [i, n] of [2, 3, 4].entries()) { await h.scrie('B' + (i + 2), String(n)); await h.scrie('C' + (i + 2), String(n * 10)); }
    await h.cel('B2'); await h.cel('D5', { modifiers: ['Shift'] });
    await apasaTinta(p, 'panglica:Home/Editing/AutoSum');
    const s = await h.st(), c = a => (s.celule || {})[a] || {};
    const r = ['B5', 'C5', 'D2', 'D3', 'D4', 'D5'].map(a => c(a).valoare), fd = [normF(c('D2').formula), normF(c('D5').formula)];
    await p.keyboard.press('Control+z'); await pauza(200);
    const u = [await h.v('B5'), await h.v('D2'), await h.v('D5')];
    await h.cel('B2'); await h.cel('D4', { modifiers: ['Shift'] });
    await apasaTinta(p, 'panglica:Home/Editing/AutoSum');
    const s2 = await h.st(), c2 = a => (s2.celule || {})[a] || {};
    const r2 = ['D2', 'D3', 'D4', 'B5', 'C5'].map(a => c2(a).valoare);
    const ok = j(r) === '[9,90,22,33,44,99]' && fd[0] === '=SUM(B2:C2)' && fd[1] === '=SUM(D2:D4)' && u.every(x => x === undefined) && r2[0] === 22 && r2[1] === 33 && r2[2] === 44 && r2[3] === undefined && r2[4] === undefined;
    return { ok, det: `B5,C5,D2..D5 ${j(r)}; formule D2,D5 ${j(fd)}; Ctrl+Z ${j(u)}; pe B2:D4: D2,D3,D4,B5,C5 ${j(r2)}` };
  } },
  { nume: 'r5 filele la redimensionare (4c pct. 4.2): 6 foi pe 1280 px › fereastra 480 px: + si fila activa (Sheet6) raman inaintea barei de derulare, sageata spre stanga se aprinde › inapoi 1280: + inaintea barei, Sheet6 vizibila', fn: async (p, h) => {
    for (let i = 0; i < 5; i++) { await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(250); }
    const masura = () => p.evaluate(() => {
      const R = document.querySelector('[data-lh-aplicatie="excel"]'), q = s => R.querySelector(s), bx = e => e ? e.getBoundingClientRect() : null;
      const file = [...R.querySelectorAll('[data-lh-tinta="fila_foii"]')], plus = bx(q('[data-lh-tinta="fila_foii_buton:Add Sheet"]'));
      const bara = [...R.querySelectorAll('[data-lh-tinta^="bara_derulare"], .lh-ap-x-bara-h, [data-lh-tip="ScrollBar"]')].map(bx).filter(b => b && b.width > b.height && b.width > 40 && plus && b.top < plus.bottom && b.bottom > plus.top);
      const sag = [...R.querySelectorAll('[data-lh-tinta^="fila_foii_buton:Scroll"]')].map(e => [e.getAttribute('data-lh-eticheta'), e.getAttribute('aria-disabled') !== 'true']);
      const act = R.querySelector('[data-lh-tinta="fila_foii"].activ');
      return { n: file.length, ultimaDreapta: file.length ? Math.round(Math.max(...file.map(f => bx(f).right))) : 0, plus: plus ? [Math.round(plus.left), Math.round(plus.right)] : null,
        bara: bara.length ? Math.round(Math.min(...bara.map(b => b.left))) : null, latApp: Math.round(bx(R).right), activa: act ? act.getAttribute('data-lh-id') : null,
        stanga: sag.some(x => /Left/i.test(x[0]) && x[1]) };
    });
    const a = await masura();
    await p.setViewportSize({ width: 480, height: 800 }); await pauza(700);
    const b = await masura();
    await p.setViewportSize({ width: 1280, height: 800 }); await pauza(700);
    const c = await masura();
    const lim = b.bara != null ? b.bara : b.latApp;
    const ok = a.n === 6 && b.plus && b.plus[1] <= lim + 1 && b.ultimaDreapta <= b.plus[0] + 1 && b.n < 6 && b.activa === 'Sheet6' && b.stanga === true
      && c.plus && c.plus[1] <= c.bara + 1 && c.activa === 'Sheet6' && (c.n === 6 || c.stanga === true);
    return { ok, det: `1280: ${j(a)}; 480: ${j(b)}; inapoi 1280: ${j(c)}` };
  } },
  { nume: 'r6 G5-1 referinta la O celula in COUNTA / COUNTIF / SUMIF / COUNTBLANK / COUNT / AVERAGEIF (numar, text, gol): =COUNTA(Z1)=0, =COUNTA(B2;Z1)=1, =COUNTIF(C2;"da")=1, =SUMIF(B3;">50")=70, =COUNTBLANK(Z1)=1 …; =B1+1 ramane #VALUE!', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    await h.scrie('B1', 'Punctaj'); await h.scrie('B2', '45'); await h.scrie('B3', '70'); await h.scrie('C2', 'da');
    const f = ['=COUNTA(Z1)', '=COUNTA(B2;Z1)', '=COUNTIF(C2;"da")', '=SUMIF(B3;">50")', '=COUNTBLANK(Z1)', '=COUNT(Z1)', '=COUNT(B2)', '=COUNT(C2)',
      '=COUNTA(C2)', '=COUNTBLANK(B2)', '=COUNTBLANK(C2)', '=COUNTIF(B2;">50")', '=AVERAGEIF(B3;">50")', '=AVERAGEIF(B2;">50")', '=B1+1'];
    for (const [i, t] of f.entries()) await h.scrie('E' + (i + 1), t);
    const s = await h.st(), r = f.map((_, i) => ((s.celule || {})['E' + (i + 1)] || {}).valoare);
    const ok = j(r) === j([0, 1, 1, 70, 1, 0, 1, 0, 1, 0, 0, 0, 70, '#DIV/0!', '#VALUE!']);
    return { ok, det: `E1..E15 ${j(r)}` };
  } },
  { nume: 'r6 G5-1 …IFS / SUMIF cu zona de adunat / MATCH pe O celula, zonele neschimbate: =COUNTIFS(C2;"da")=1, =SUMIFS(B3;B3;">50")=70, =SUMIF(C2;"da";B2)=45, =SUMIF(C2:C4;"da";B2)=97, =COUNTIF(C2:C4;"da")=2, =COUNTBLANK(Z1:Z3)=3', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().click(); await pauza(300);
    for (const [i, [b, c]] of [['45', 'da'], ['70', 'nu'], ['52', 'da']].entries()) { await h.scrie('B' + (i + 2), b); await h.scrie('C' + (i + 2), c); }
    const f = ['=COUNTIFS(C2;"da")', '=COUNTIFS(C2;"da";B2;">40")', '=COUNTIFS(C2;"da";B2:B3;">40")', '=SUMIFS(B3;B3;">50")', '=SUMIF(C2;"da";B2)', '=SUMIF(C2:C4;"da";B2)',
      '=COUNTA(Z1:Z3)', '=COUNTIF(C2:C4;"da")', '=SUMIF(B2:B4;">50")', '=COUNTBLANK(Z1:Z3)', '=MATCH(70;B3;0)', '=SUMIF(C2:C4;"da";B2:B4)'];
    for (const [i, t] of f.entries()) await h.scrie('E' + (i + 1), t);
    const s = await h.st(), r = f.map((_, i) => ((s.celule || {})['E' + (i + 1)] || {}).valoare);
    const ok = j(r) === j([1, 1, '#VALUE!', 70, 45, 97, 0, 2, 122, 3, 1, 97]);
    return { ok, det: `E1..E12 ${j(r)}` };
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
