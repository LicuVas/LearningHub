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
];
async function apasaTinta(p, tinta) { await p.locator(`${APP} [data-lh-tinta="${tinta}"]:visible`).first().click(); await pauza(250); }

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const v of VERIFICARI) {
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
