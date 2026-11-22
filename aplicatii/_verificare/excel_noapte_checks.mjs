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
];

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
