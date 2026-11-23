// Verificari proprii ale constructorului din banda A (formulele) a rundei 4 din noaptea Excel 22-23.11 (aplicatii/excel.js):
// drumurile despre care raportul spune ca merg, altele decat cele jucate de probele de paritate (Tab, Esc, inchidere, Ctrl+Z,
// alt caz, atingere pe 390x844). Fisier separat de excel_noapte_checks.mjs (acelasi model), ca ramurile paralele sa nu se
// loveasca la unire. Rulare:  node aplicatii/_verificare/excel_noapte_a_checks.mjs   (intra singur in excel_paritate.mjs --regres)
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

const mesaj = p => p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tip="Window"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText).join(' | ').replace(/[‪-‮]/g, ''));

const VERIFICARI = [
  // ---------------- runda 4a (lot 4: ferestrele de eroare ale formulei, intersectia, cercul, AutoSum, functiile Excelului)
  { nume: 'r4a =SUM (B2:B4) + Tab › Yes: =SUM(B2:B4) = 24, celula activa trece la dreapta; Ctrl+Z goleste', fn: async (p, h) => {
    await h.cel('E2'); await p.keyboard.type('=SUM (B2:B4)'); await p.keyboard.press('Tab'); await pauza(200);
    const m = await mesaj(p);
    if (!/We found a typo/.test(m) || !/=SUM\(B2:B4\)/.test(m)) return { ok: false, det: 'fara fereastra typo: ' + j(m.slice(0, 90)) };
    if (!await h.clicEt('Yes', 'Button')) return { ok: false, det: 'fara Yes' };
    const s = await h.st(), e2 = s.celule.E2 || {};
    const ok1 = normF(e2.formula) === '=SUM(B2:B4)' && e2.valoare === 24 && s.selectie.activa === 'F2' && !s.ramane_in_editare;
    await p.keyboard.press('Control+z'); await pauza(150);
    const dupa = await h.v('E2');
    return { ok: ok1 && dupa === undefined, det: `E2=${j(e2.formula)} ${j(e2.valoare)}, activa=${j(s.selectie.activa)}; dupa Ctrl+Z E2=${j(dupa)}` };
  } },
  { nume: 'r4a =MAX (B2:B4) › Esc in fereastra typo = No: formula ramane, #NAME?, iesit din editare; F2 + Enter o readuce', fn: async (p, h) => {
    await h.cel('E3'); await p.keyboard.type('=MAX (B2:B4)'); await p.keyboard.press('Enter'); await pauza(200);
    if (!/We found a typo/.test(await mesaj(p))) return { ok: false, det: 'fara fereastra typo' };
    await p.keyboard.press('Escape'); await pauza(200);
    const s = await h.st(), e3 = s.celule.E3 || {};
    await pauza(500);
    await h.cel('E3'); await p.keyboard.press('F2'); await pauza(120); await p.keyboard.press('Enter'); await pauza(200);
    const m2 = await mesaj(p);
    return { ok: e3.valoare === '#NAME?' && !s.ramane_in_editare && !s.dialog && /We found a typo/.test(m2), det: `E3=${j(e3.valoare)} editare=${s.ramane_in_editare} dialog=${j(s.dialog && s.dialog.titlu)}; dupa F2+Enter: ${j(m2.slice(0, 40))}` };
  } },
  { nume: 'r4a =IF(B2!=9;1;0) › Yes = =IF(B2<>9;1;0) = 0; =IF(B3=<8;1;0) › inchidere (✕) = inapoi in editare, fara fereastra', fn: async (p, h) => {
    await h.cel('E4'); await p.keyboard.type('=IF(B2!=9;1;0)'); await p.keyboard.press('Enter'); await pauza(200);
    if (!await h.clicEt('Yes', 'Button')) return { ok: false, det: 'fara Yes' };
    const e4 = ((await h.st()).celule.E4) || {};
    await h.cel('E5'); await p.keyboard.type('=IF(B3=<8;1;0)'); await p.keyboard.press('Enter'); await pauza(200);
    const m = await mesaj(p);
    const x = await h.clicEt('Închidere', 'Button');
    const s = await h.st();
    const ok = normF(e4.formula) === '=IF(B2<>9,1,0)' && e4.valoare === 0 && /=IF\(B3<=8;1;0\)/.test(m) && x && s.ramane_in_editare === true && !s.dialog && !(s.celule.E5 && s.celule.E5.formula);
    return { ok, det: `E4=${j(e4.formula)} ${j(e4.valoare)}; fereastra E5=${j(m.slice(0, 100))}; inchidere=${x}, dupa: editare=${s.ramane_in_editare}, dialog=${j(s.dialog && s.dialog.titlu)}` };
  } },
  { nume: 'r4a intersectia: =B2:B4 B3:C3 → 7; =B2:B4 C2:C4 → #NULL!; =SUM(B2:C4 C2:C4) → 24', fn: async (p, h) => {
    await h.scrie('F2', '=B2:B4 B3:C3'); await h.scrie('F3', '=B2:B4 C2:C4'); await h.scrie('F4', '=SUM(B2:C4 C2:C4)');
    const r = [await h.v('F2'), await h.v('F3'), await h.v('F4')];
    return { ok: j(r) === j([7, '#NULL!', 24]), det: j(r) };
  } },
  { nume: 'r4a cerc indirect: E2 =E3+1, E3 =E2+1 › fereastra circulara, Enter o inchide, E3 = 0; Ctrl+Z scoate E3 si E2 revine la 1', fn: async (p, h) => {
    await h.scrie('E2', '=E3+1');
    const v0 = await h.v('E2');
    await h.scrie('E3', '=E2+1');
    const m = await mesaj(p);
    await p.keyboard.press('Enter'); await pauza(200);
    const s = await h.st(), e3 = (s.celule.E3 || {}).valoare;
    await p.keyboard.press('Control+z'); await pauza(200);
    const s2 = await h.st();
    const ok = v0 === 1 && /circular references/.test(m) && !s.dialog && e3 === 0 && !s2.celule.E3 && (s2.celule.E2 || {}).valoare === 1;
    return { ok, det: `E2 inainte=${j(v0)}; fereastra=${j(m.slice(0, 60))}; dupa Enter dialog=${j(s.dialog && s.dialog.titlu)}, E3=${j(e3)}; dupa Ctrl+Z E3=${j(s2.celule.E3)}, E2=${j((s2.celule.E2 || {}).valoare)}` };
  } },
  { nume: 'r4a Σ pe B2:C4 scrie B5, C5 deodata, selectia B2:C5; un singur Ctrl+Z le scoate; ▾ Average pe B2:C2 → D2 =AVERAGE(B2:C2)', fn: async (p, h) => {
    await h.cel('B2'); await h.cel('C4', { modifiers: ['Shift'] });
    await apasaTinta(p, 'panglica:Home/Editing/AutoSum');
    const s = await h.st();
    const r = [normF((s.celule.B5 || {}).formula), normF((s.celule.C5 || {}).formula), s.selectie.zona];
    await p.keyboard.press('Control+z'); await pauza(150);
    const s2 = await h.st();
    await h.cel('B2'); await h.cel('C2', { modifiers: ['Shift'] });
    await apasaTinta(p, 'meniu_derulant:Home/Editing/AutoSum');
    await h.clicEt('Average');
    const d2 = ((await h.st()).celule.D2) || {};
    const ok = r[0] === '=SUM(B2:B4)' && r[1] === '=SUM(C2:C4)' && r[2] === 'B2:C5' && !s2.celule.B5 && !s2.celule.C5 && normF(d2.formula) === '=AVERAGE(B2:C2)' && d2.valoare === 9.5;
    return { ok, det: `B5,C5,zona=${j(r)}; dupa Ctrl+Z B5=${j(s2.celule.B5)}; D2=${j(d2.formula)} ${j(d2.valoare)}` };
  } },
  { nume: 'r4a functiile Excelului: MATCH exact pe numar si text, COUNTIFS, SUM(2:2), SUM(B:B); VLOOKUP → #NAME? cu mesajul „exista in Excel”', fn: async (p, h) => {
    await h.scrie('F6', '=MATCH(8;B2:B4;0)'); await h.scrie('F7', '=MATCH("dan";A2:A4;0)'); await h.scrie('F8', '=COUNTIFS(B2:B4;">7";C2:C4;">7")');
    await h.scrie('F9', '=SUM(2:2)'); await h.scrie('F10', '=SUM(B:B)');
    await h.scrie('F11', '=VLOOKUP(8;B2:C4;2;0)');
    const m = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-nesimulat]')].map(e => e.innerText).join(' | '));
    const r = [await h.v('F6'), await h.v('F7'), await h.v('F8'), await h.v('F9'), await h.v('F10'), await h.v('F11')];
    return { ok: j(r) === j([3, 3, 1, 19, 24, '#NAME?']) && /VLOOKUP există în Excel/.test(m), det: `${j(r)}; mesaj=${j(m.slice(0, 80))}` };
  } },
  { nume: 'r4a atingere 390x844: =SUM (B2:B4) + Enter › fereastra typo incape pe ecran, Yes atins cu degetul → 24', atingere: true, fn: async (p, h) => {
    await h.cel('E2'); await p.keyboard.type('=SUM (B2:B4)'); await p.keyboard.press('Enter'); await pauza(250);
    const b = await p.evaluate(() => { const e = [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-eticheta="Yes"]')].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    if (!b) return { ok: false, det: 'fara Yes vizibil' };
    const inEcran = b.x >= 0 && b.y >= 0 && b.x + b.w <= 390 && b.y + b.h <= 844;
    await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2); await pauza(250);
    const e2 = ((await h.st()).celule.E2) || {};
    return { ok: inEcran && e2.valoare === 24, det: `Yes la ${j(b)} (pe ecran=${inEcran}); E2=${j(e2.formula)} ${j(e2.valoare)}` };
  } },
  { nume: 'r4a datele (critic runda 2, M-2, M-6): 29.02.1900 tastat = 60; DAY / MONTH / YEAR; =DATE(2026;13;1) = 46388 (01.01.2027, formatul datei); =DATE(1900;2;29) = 60', fn: async (p, h) => {
    await h.scrie('A10', '29.02.1900'); await h.scrie('B10', '=DAY(A10)'); await h.scrie('C10', '=MONTH(A10)'); await h.scrie('D10', '=YEAR(A10)');
    await h.scrie('E10', '=DATE(2026;13;1)'); await h.scrie('F10', '=DATE(1900;2;29)');
    const s = await h.st(), c = a => s.celule[a] || {};
    const r = [c('A10').valoare, c('B10').valoare, c('C10').valoare, c('D10').valoare, c('E10').valoare, ((s.format_celule || {}).E10 || {}).format_numar, c('F10').valoare];
    return { ok: j(r) === j([60, 29, 2, 1900, 46388, 'dd.mm.yyyy', 60]), det: j(r) };
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
