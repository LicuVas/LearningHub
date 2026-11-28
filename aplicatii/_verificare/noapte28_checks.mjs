// Verificarile reparatiilor din noaptea 28.11.2026 (bucla, restantele vazute de verificatorul lectiilor: runde/noapte_27_11/
// poarta_lectii.md si gasit_pe_drum.md). Scrise INAINTEA reparatiilor (au picat pe 0fc070aa), dupa modelul excel_noapte_d_checks.mjs.
//   T1  tragerea unei file pe marginea primei file vedute nu mai deruleaza sirul (viii/m1-l03, pasul 6 si atelierul)
//   T2  „Save this file” (Ctrl+S) si „Save your changes to this file?” (Ctrl+W) au etichetele File name si Choose a Location;
//       caseta mica Save as type arata „.xlsx” intreg
//   T3  ferestrele lipite de marginea dreapta / de jos stau in interiorul stratului (fara bare de derulare native peste Excel)
//   T4  bara de stare din Word si PowerPoint fara bara de derulare orizontala la 1366 si 1280 px
// Browserul porneste FARA --hide-scrollbars (Playwright ascunde barele native implicit, deci nu le-ar vedea): barele de derulare
// ocupa loc ca pe calculatoarele din laborator.
// Rulare:  node aplicatii/_verificare/noapte28_checks.mjs   (din orice director); NOAPTE_FILTRU=<prefix> = doar unele (ex. T1).
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL. Reteaua din afara lui 127.0.0.1 e oprita.
// Gesturile sunt jucate (mouse, taste prin Playwright); starea se citeste din DOM si din LH.aplicatii.stare('excel').
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

/* --vechi=<dosar> = fișierele bibliotecii din alt dosar (ex. copia de dinaintea reparațiilor: <dosar>/aplicatii/excel.js …),
   ca să se vadă că verificările pică pe codul vechi; ce nu e în dosar vine din depozit */
const VECHI = (process.argv.find(a => a.startsWith('--vechi=')) || '').slice(8);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      const rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      if (VECHI && /^\/aplicatii\//.test(rel) && fs.existsSync(path.join(VECHI, rel)) && fs.statSync(path.join(VECHI, rel)).isFile()) {
        s.writeHead(200, { 'Content-Type': MIME[path.extname(rel)] || 'application/octet-stream' });
        return fs.createReadStream(path.join(VECHI, rel)).pipe(s);
      }
      let f = path.join(ROOT, rel);
      if (f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { s.writeHead(404); return s.end('nu'); }
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
const css = s => '"' + String(s).replace(/"/g, '\\"') + '"';
const X = '#body [data-lh-aplicatie="excel"]';
const LABORATOR = { viewport: { width: 1366, height: 768 } };

/* ---------- lecțiile ---------- */
const L03 = '/lectii/viii/m1-l03/index.html';
/* m1-l06 se deschide ca în lectie_m1-l06.mjs: ?pas=p2 + exercițiul 0, cu drumul marcat parcurs */
const L06 = { url: '/lectii/viii/m1-l06/index.html?pas=p2', cheie: 'lectie_viii_m1_l06', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 } };
const pq = p => p.evaluate(() => { const e = document.getElementById('pq') || document.querySelector('.q'); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; });
const faza = p => p.evaluate(() => { const s = JocMotor.test.stare(); return s ? s.phase : null; });
/* lecția 3, până la pasul ales (cond: async p => true când e locul), cu „Pasul următor” ca elevul */
async function deschideL03(p, base, cond) {
  await p.goto(base + L03, { waitUntil: 'load' });
  await p.waitForFunction(() => window.JocMotor && JocMotor.test && JocMotor.test.config && JocMotor.test.config() && document.querySelector('.lvl'), null, { timeout: 30000 });
  await pauza(500);
  const viz = p.locator('#lhp-viz'); if (await viz.count() && await viz.first().isVisible()) { await viz.first().click(); await pauza(300); }
  await p.locator('.lvl').first().click(); await pauza(500);
  for (let k = 0; k < 14; k++) {
    if (await cond(p)) { await p.waitForSelector(X, { timeout: 20000 }); await p.locator(X).first().scrollIntoViewIfNeeded(); await pauza(1200); return true; }
    const n = p.locator('#pas-next'); if (!(await n.count()) || !(await n.first().isVisible())) break;
    await n.first().click(); await pauza(600);
  }
  throw new Error('n-am ajuns la pasul cerut în lecția 3');
}
const cuExcel = async p => (await p.locator(X).count()) > 0;
const pas6 = async p => /Șterge foaia Ciornă/.test(await pq(p)) && (await p.locator(X).count()) > 0;
const atelier = async p => (await faza(p)) === 'atelier' && (await p.locator(X).count()) > 0;
async function deschideL06(p, base) {
  await p.goto(base + L06.url, { waitUntil: 'load' });
  await p.waitForFunction(() => window.JocMotor && JocMotor.test.stare() && document.getElementById('body'), null, { timeout: 15000 });
  await p.evaluate(() => JocMotor.test.exercitiu(0));
  const viz = p.getByRole('button', { name: /doar vizitez/ });
  if (await viz.count()) await viz.first().click().catch(() => {});
  await p.waitForSelector(`${X} [data-lh-tinta="celula"]`, { timeout: 20000 });
  await p.locator(X).first().scrollIntoViewIfNeeded(); await pauza(1000);
}

/* ---------- gesturile ---------- */
const stX = p => p.evaluate(() => { try { return window.LH.aplicatii.stare('excel') || {}; } catch (e) { return {}; } });
const fila = (p, n) => p.locator(`${X} [data-lh-tinta="fila_foii"][data-lh-id=${css(n)}]`).first();
const fileVazute = p => p.evaluate(X => [...document.querySelectorAll(X + ' [data-lh-tinta="fila_foii"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-id')), X);
const sageata = (p, dir) => p.locator(`${X} [data-lh-tinta^="fila_foii_buton:Scroll"].lh-ap-x-${dir === 'stanga' ? 'st' : 'dr'}`).first();
/* clic pe elementul vizibil cel mai adânc din rădăcină al cărui nume (eticheta, aria-label, textul) se potrivește */
async function clicText(p, rad, re) {
  const h = await p.evaluateHandle(([rad, src, fl]) => {
    const re = new RegExp(src, fl);
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const R = document.querySelector(rad) || document;
    const cand = [...R.querySelectorAll('[data-lh-eticheta],[aria-label],button,[role=menuitem],[role=option],span,div')].filter(vis);
    const potr = e => [e.getAttribute('data-lh-eticheta'), e.getAttribute('aria-label'), (e.childElementCount === 0 || e.tagName === 'BUTTON') ? e.textContent.trim() : null].some(t => t && re.test(t.trim()));
    const toate = cand.filter(potr);
    const adanc = toate.filter(e => !toate.some(x => x !== e && e.contains(x)));
    return adanc[adanc.length - 1] || null;
  }, [rad, re.source, re.flags]);
  const el = h.asElement(); if (!el) throw new Error('nu găsesc pe ecran ' + re);
  await el.click(); await pauza(350);
}
async function redenumeste(p, vechi, nou) { await fila(p, vechi).dblclick(); await pauza(300); await p.keyboard.press('Control+a'); await p.keyboard.type(nou, { delay: 15 }); await p.keyboard.press('Enter'); await pauza(350); }
async function plus(p) { await p.locator(`${X} [data-lh-tinta=${css('fila_foii_buton:Add Sheet')}]`).first().click(); await pauza(400); }
async function excelGolSiNou(p) { await p.locator(`${X} .lh-ap-x-gol`).first().click(); await pauza(200); await p.keyboard.press('Control+n'); await pauza(700); }
async function salvareNoua(p) { await excelGolSiNou(p); await p.keyboard.press('Control+s'); await pauza(800); }
async function intrebareInchidere(p) {
  await excelGolSiNou(p);
  await p.locator(`${X} [data-lh-tinta="celula"][data-lh-id="A1"]`).click(); await pauza(150);
  await p.keyboard.type('x', { delay: 20 }); await p.keyboard.press('Enter'); await pauza(250);
  await p.keyboard.press('Control+w'); await pauza(800);
}
/* tragere cu mouse-ul în 10 pași de la mijlocul filei la (x, y) */
async function tragePana(p, sursa, x, y) {
  const a = await fila(p, sursa).boundingBox();
  const x0 = a.x + a.width / 2, y0 = a.y + a.height / 2;
  await p.mouse.move(x0, y0); await p.mouse.down(); await pauza(120);
  for (let i = 1; i <= 10; i++) { await p.mouse.move(x0 + (x - x0) * i / 10, y0 + (y - y0) * i / 10); await pauza(35); }
}

/* ---------- măsurătorile ---------- */
/* textul vizibil exact `t` din fereastra `sup`: dreptunghiul lui, dacă e acoperit, și caseta de sub el (ținta dată) */
const eticheta = (p, sup, t, tinta) => p.evaluate(([X, sup, t, tinta]) => {
  const A = document.querySelector(X), D = A && A.querySelector(`[data-lh-suprafata="${sup}"]`);
  if (!D) return { err: 'fereastra ' + sup + ' nu e deschisă' };
  const w = document.createTreeWalker(D, NodeFilter.SHOW_TEXT);
  let n, gasit = null;
  while ((n = w.nextNode())) {
    if (n.textContent.trim() !== t) continue;
    const e = n.parentElement, cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const b = rg.getBoundingClientRect();
    if (b.width < 1 || b.height < 1) continue;
    const sus = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    gasit = { b: [b.left, b.top, b.right, b.bottom].map(Math.round), acoperit: !(sus && (sus === e || e.contains(sus) || sus.contains(e))) };
    break;
  }
  const c = D.querySelector(`[data-lh-tinta=${JSON.stringify(tinta)}]`), cb = c && c.getBoundingClientRect();
  const db = D.getBoundingClientRect();
  return { gasit, caseta: cb ? [cb.left, cb.top, cb.right, cb.bottom].map(Math.round) : null, fereastra: [db.left, db.top, db.right, db.bottom].map(Math.round) };
}, [X, sup, t, tinta]);
const deasupra = (r, cuNume) => {
  if (r.err) return r.err;
  if (!r.gasit) return `„${cuNume}” nu se vede în fereastră`;
  if (r.gasit.acoperit) return `„${cuNume}” e acoperit`;
  const [l, t, rr, b] = r.gasit.b, c = r.caseta, f = r.fereastra;
  if (!c) return 'caseta de sub eticheta nu există';
  if (l < f[0] || rr > f[2] || t < f[1] || b > f[3]) return `„${cuNume}” iese din fereastră ${j(r.gasit.b)} față de ${j(f)}`;
  if (!(b <= c[1] + 1 && t >= c[1] - 40)) return `„${cuNume}” nu stă chiar deasupra casetei (${j(r.gasit.b)} față de caseta ${j(c)})`;
  if (!(l >= c[0] - 12 && l <= c[0] + 40)) return `„${cuNume}” nu e aliniat la stânga casetei (${j(r.gasit.b)} față de caseta ${j(c)})`;
  return '';
};
/* caseta mică Save as type: ce scrie în ea și dacă încape */
const tipFisier = (p, sup) => p.evaluate(([X, sup]) => {
  const D = document.querySelector(X).querySelector(`[data-lh-suprafata="${sup}"]`);
  const c = D && D.querySelector('[data-lh-tinta="camp:tip_fisier"]');
  if (!c) return { err: 'nu există caseta Save as type' };
  const i = c.querySelector('input'), e = i || c;
  const text = i ? i.value : c.textContent.trim();
  return { text, sw: e.scrollWidth, cw: e.clientWidth, cutie: [Math.round(c.getBoundingClientRect().width)] };
}, [X, sup]);
/* straturile din rădăcină fără bare de derulare, fereastra întreagă în rădăcină */
const incadrare = (p, sup) => p.evaluate(([X, sup]) => {
  const A = document.querySelector(X), D = A && A.querySelector(`[data-lh-suprafata="${sup}"]`);
  if (!D) return { err: 'fereastra ' + sup + ' nu e deschisă' };
  const R = A.getBoundingClientRect(), b = D.getBoundingClientRect();
  const L = R.left + A.clientLeft, T = R.top + A.clientTop, Rr = L + A.clientWidth, B = T + A.clientHeight;
  const straturi = [...A.querySelectorAll('.lh-ap-strat')].map(s => ({ c: String(s.className).replace('lh-ap-strat ', ''), sw: s.scrollWidth, cw: s.clientWidth, sh: s.scrollHeight, ch: s.clientHeight }));
  const cuBare = straturi.filter(s => s.sw > s.cw || s.sh > s.ch);
  const inauntru = b.left >= L - 0.5 && b.top >= T - 0.5 && b.right <= Rr + 0.5 && b.bottom <= B + 0.5;
  return { inauntru, cuBare, fereastra: [b.left - L, b.top - T, b.right - L, b.bottom - T].map(v => Math.round(v * 10) / 10), interior: [A.clientWidth, A.clientHeight] };
}, [X, sup]);
const verdictIncadrare = r => r.err ? { ok: false, det: r.err } : { ok: r.inauntru && !r.cuBare.length, det: `fereastra ${j(r.fereastra)} în interiorul ${j(r.interior)}: ${r.inauntru ? 'da' : 'NU'}; straturi cu bare de derulare: ${r.cuBare.length ? j(r.cuBare) : 'niciunul'}` };
/* bara de stare: fără bară de derulare orizontală (clientHeight = offsetHeight - chenarul de sus) sau totul încape */
const baraStare = (p, ap) => p.evaluate(ap => {
  const A = document.querySelector(`[data-lh-aplicatie="${ap}"]`), J = A.querySelector('.lh-ap-jos');
  const cs = getComputedStyle(J), bt = parseFloat(cs.borderTopWidth) || 0;
  const jb = J.getBoundingClientRect();
  /* textele barei care ies din ce se vede (fără derulare) */
  const taiate = [];
  const w = document.createTreeWalker(J, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue;
    const e = n.parentElement, s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const b = rg.getBoundingClientRect();
    if (b.width < 1) continue;
    if (b.right > jb.left + J.clientLeft + J.clientWidth + 0.5 || b.bottom > jb.top + J.clientTop + J.clientHeight + 0.5) taiate.push(t.slice(0, 24));
  }
  return { oh: J.offsetHeight, ch: J.clientHeight, bt, sw: J.scrollWidth, cw: J.clientWidth, ox: cs.overflowX, taiate };
}, ap);

const VERIFICARI = [
  // ---------------------------------------------------------------- T1: tragerea filei
  { nume: 'T1 m1-l03 pasul 6 la 1366x768: Ciornă ștearsă, ›, Octombrie trasă pe marginea stângă a lui Noiembrie (+4 px) → Septembrie, Octombrie, Noiembrie', fn: async (p, base) => {
    await deschideL03(p, base, pas6);
    const s0 = (await stX(p)).foi;
    await fila(p, 'Ciornă').click({ button: 'right' }); await pauza(350);
    await clicText(p, X, /^Delete$/);
    if ((await p.locator(`${X} [data-lh-tinta="fereastra:Delete"]`).count())) { await p.locator(`${X} [data-lh-tinta="fereastra:Delete"]`).first().click(); await pauza(500); }
    const s1 = (await stX(p)).foi, v1 = await fileVazute(p);
    await sageata(p, 'dreapta').click(); await pauza(400);
    const v2 = await fileVazute(p);
    if (v2[0] !== 'Noiembrie' || !v2.includes('Octombrie')) return { ok: false, det: `locul nu e cel din lecție: foi ${j(s0)} → ${j(s1)}; file văzute ${j(v1)}, după › ${j(v2)} (trebuia Noiembrie prima, Octombrie văzută)` };
    const b = await fila(p, 'Noiembrie').boundingBox();
    await tragePana(p, 'Octombrie', b.x + 4, b.y + b.height / 2);
    const vIn = await fileVazute(p);
    await p.mouse.up(); await pauza(500);
    const s2 = (await stX(p)).foi;
    return { ok: j(s2) === j(['Septembrie', 'Octombrie', 'Noiembrie']), det: `foi ${j(s0)} → după ștergere ${j(s1)}; file văzute după › ${j(v2)}, în timpul tragerii ${j(vIn)}; după lăsare ${j(s2)}` };
  } },
  { nume: 'T1 m1-l03 atelierul la 1366x768: trei foi (Octombrie ascunsă la stânga), Septembrie trasă peste săgeata ‹ derulează și ajunge înaintea lui Octombrie', fn: async (p, base) => {
    await deschideL03(p, base, atelier);
    await excelGolSiNou(p);
    await redenumeste(p, 'Sheet1', 'Octombrie');
    await plus(p); await redenumeste(p, (await stX(p)).foi.slice(-1)[0], 'Noiembrie');
    await plus(p); await redenumeste(p, (await stX(p)).foi.slice(-1)[0], 'Septembrie');
    const s0 = (await stX(p)).foi, v0 = await fileVazute(p);
    if (j(s0) !== j(['Octombrie', 'Noiembrie', 'Septembrie']) || v0.includes('Octombrie') || !v0.includes('Septembrie')) return { ok: false, det: `locul nu e cel din lecție: foi ${j(s0)}, file văzute ${j(v0)} (trebuia Octombrie ascunsă, Septembrie văzută)` };
    const sg = await sageata(p, 'stanga').boundingBox();
    const x = sg.x + sg.width / 2, y = sg.y + sg.height / 2;
    await tragePana(p, 'Septembrie', x, y);
    /* mâna stă pe săgeată: câteva mișcări mici, ca șirul să aibă timp să se deruleze */
    for (let i = 0; i < 4; i++) { await p.mouse.move(x + (i % 2 ? 1 : -1), y); await pauza(160); }
    const vIn = await fileVazute(p);
    await p.mouse.up(); await pauza(500);
    const s2 = (await stX(p)).foi;
    return { ok: j(s2) === j(['Septembrie', 'Octombrie', 'Noiembrie']) && vIn[0] === 'Octombrie', det: `foi ${j(s0)}, file văzute ${j(v0)}; pe săgeată se văd ${j(vIn)}; după lăsare ${j(s2)}` };
  } },
  { nume: 'T1 m1-l03 pasul 6 la 1366x768: Septembrie trasă repede pe marginea dreaptă a ultimei file văzute (Ciornă, −4 px; Noiembrie și Octombrie nevăzute) → șirul nu se derulează, fila ajunge după Ciornă, unde arată triunghiul', fn: async (p, base) => {
    await deschideL03(p, base, pas6);
    const s0 = (await stX(p)).foi, v0 = await fileVazute(p);
    if (j(v0) !== j(['Septembrie', 'Ciornă'])) return { ok: false, det: `locul nu e cel din lecție: foi ${j(s0)}, file văzute ${j(v0)} (trebuiau Septembrie și Ciornă)` };
    const b = await fila(p, 'Ciornă').boundingBox();
    await tragePana(p, 'Septembrie', b.x + b.width - 4, b.y + b.height / 2);
    const vIn = await fileVazute(p);
    const tri = await p.evaluate(X => { const t = document.querySelector(X + ' .lh-ap-x-ff-loc'), c = document.querySelector(X + ' [data-lh-tinta="fila_foii"][data-lh-id="Ciornă"]'); return t && c ? Math.round(t.getBoundingClientRect().left + 5 - c.getBoundingClientRect().right) : null; }, X);
    await p.mouse.up(); await pauza(500);
    const s2 = (await stX(p)).foi;
    return { ok: j(vIn) === j(v0) && tri != null && Math.abs(tri) <= 2 && j(s2) === j(['Ciornă', 'Septembrie', 'Noiembrie', 'Octombrie']), det: `foi ${j(s0)}, file văzute ${j(v0)}; în timpul tragerii ${j(vIn)}, triunghiul la ${tri} px de marginea dreaptă a lui Ciornă; după lăsare ${j(s2)}` };
  } },
  // ---------------------------------------------------------------- T2: etichetele ferestrelor de salvare
  { nume: 'T2 m1-l03 la 1366x768, Ctrl+N, Ctrl+S: „File name” și „Choose a Location” se văd deasupra casetelor lor; Save as type arată „.xlsx” întreg', fn: async (p, base) => {
    await deschideL03(p, base, cuExcel);
    await salvareNoua(p);
    const sup = 'dialog.save_this_file';
    const a = deasupra(await eticheta(p, sup, 'File name', 'camp:nume_fisier'), 'File name'), b = deasupra(await eticheta(p, sup, 'Choose a Location', 'camp:Choose a Location'), 'Choose a Location');
    const t = await tipFisier(p, sup);
    const okT = !t.err && t.text === '.xlsx' && t.sw <= t.cw;
    return { ok: !a && !b && okT, det: `File name: ${a || 'da'}; Choose a Location: ${b || 'da'}; Save as type: ${t.err || `„${t.text}” (${t.sw} în ${t.cw} px)`}` };
  } },
  { nume: 'T2 m1-l03 la 1366x768, registru modificat, Ctrl+W: „File name” și „Choose a Location” se văd deasupra casetelor lor; Save as type arată „.xlsx” întreg', fn: async (p, base) => {
    await deschideL03(p, base, cuExcel);
    await intrebareInchidere(p);
    const sup = 'dialog.save_your_changes_to_this_file';
    const a = deasupra(await eticheta(p, sup, 'File name', 'camp:nume_fisier'), 'File name'), b = deasupra(await eticheta(p, sup, 'Choose a Location', 'camp:Choose a Location'), 'Choose a Location');
    const t = await tipFisier(p, sup);
    const okT = !t.err && t.text === '.xlsx' && t.sw <= t.cw;
    return { ok: !a && !b && okT, det: `File name: ${a || 'da'}; Choose a Location: ${b || 'da'}; Save as type: ${t.err || `„${t.text}” (${t.sw} în ${t.cw} px)`}` };
  } },
  // ---------------------------------------------------------------- T3: ferestrele în interiorul stratului
  { nume: 'T3 m1-l03 la 1366x768, Ctrl+S: „Save this file” întreagă în Excel, fără bare de derulare native', fn: async (p, base) => {
    await deschideL03(p, base, cuExcel); await salvareNoua(p);
    return verdictIncadrare(await incadrare(p, 'dialog.save_this_file'));
  } },
  { nume: 'T3 m1-l03 la 1366x768, Ctrl+W pe registrul modificat: „Save your changes” întreagă în Excel, fără bare de derulare native', fn: async (p, base) => {
    await deschideL03(p, base, cuExcel); await intrebareInchidere(p);
    return verdictIncadrare(await incadrare(p, 'dialog.save_your_changes_to_this_file'));
  } },
  { nume: 'T3 m1-l03 pasul 6 la 1366x768, clic dreapta pe filă › Move or Copy: fereastra întreagă în Excel, fără bare de derulare native', fn: async (p, base) => {
    await deschideL03(p, base, pas6);
    await fila(p, 'Septembrie').click({ button: 'right' }); await pauza(350);
    await clicText(p, X, /^Move or Copy\.\.\.$|^Move or Copy…$/); await pauza(300);
    return verdictIncadrare(await incadrare(p, 'dialog.SheetMoveOrCopy'));
  } },
  { nume: 'T3 m1-l06 la 1366x768, clic dreapta pe litera B › Column Width: fereastra întreagă în Excel, fără bare de derulare native', fn: async (p, base) => {
    await deschideL06(p, base);
    await p.locator(`${X} [data-lh-tinta="antet_coloana"][data-lh-id="B"]`).first().click({ button: 'right' }); await pauza(350);
    await clicText(p, X, /^Column Width\.\.\.$|^Column Width…$/); await pauza(300);
    return verdictIncadrare(await incadrare(p, 'dialog.ColumnWidth'));
  } },
  { nume: 'T3 poligon word la 1366x768, clic dreapta lângă marginea din dreapta a documentului: meniul întreg în interiorul Word-ului (nu tăiat 2 px)', poligon: 'word', fn: async (p) => {
    const z = await p.locator('[data-lh-aplicatie="word"] [data-lh-tinta="document"]').first().boundingBox();
    await p.mouse.click(z.x + z.width - 18, 400, { button: 'right' }); await pauza(400);
    const r = await p.evaluate(() => {
      const A = document.querySelector('[data-lh-aplicatie="word"]'), m = A.querySelector('[data-lh-suprafata^="meniu_contextual"]');
      if (!m) return { err: 'meniul nu s-a deschis' };
      const b = m.getBoundingClientRect(), R = A.getBoundingClientRect(), L = R.left + A.clientLeft, T = R.top + A.clientTop;
      return { fereastra: [b.left - L, b.top - T, b.right - L, b.bottom - T].map(v => Math.round(v * 10) / 10), interior: [A.clientWidth, A.clientHeight] };
    });
    if (r.err) return { ok: false, det: r.err };
    const [l, t, rr, bb] = r.fereastra;
    return { ok: l >= -0.5 && t >= -0.5 && rr <= r.interior[0] + 0.5 && bb <= r.interior[1] + 0.5, det: `meniul ${j(r.fereastra)} în interiorul ${j(r.interior)}` };
  } },
  // ---------------------------------------------------------------- T4: bara de stare fără bară de derulare
  ...[['word', 1366, 768], ['word', 1280, 720], ['powerpoint', 1366, 768], ['powerpoint', 1280, 720], ['excel', 1366, 768], ['excel', 1280, 720]].map(([ap, w, h]) => ({
    nume: `T4 poligon ${ap} la ${w}x${h}: bara de stare fără bară de derulare orizontală, niciun text al ei tăiat`, ecran: { viewport: { width: w, height: h } }, poligon: ap, fn: async (p) => {
      const r = await baraStare(p, ap);
      const faraBara = r.ch >= r.oh - r.bt - 0.5 || r.sw <= r.cw;
      return { ok: faraBara && !r.taiate.length, det: `înălțimea ${r.oh}, din care se vede ${r.ch} (chenar ${r.bt}); conținutul ${r.sw} în ${r.cw} px; tăiate: ${r.taiate.length ? r.taiate.join(' | ') : 'niciunul'}` };
    } })),
  { nume: 'T4 poligon powerpoint la 1366x768, vederea Slide Sorter (alt desen al barei de stare): fără bară de derulare orizontală, niciun text tăiat', poligon: 'powerpoint', fn: async (p) => {
    await p.locator('[data-lh-aplicatie="powerpoint"] [data-lh-tinta="bara_stare:Slide Sorter"]').first().click(); await pauza(600);
    const sup = await p.evaluate(() => { const e = document.querySelector('[data-lh-aplicatie="powerpoint"] .lh-ap-jos [data-lh-suprafata^="bara_stare"]'); return e && e.getAttribute('data-lh-suprafata'); });
    const r = await baraStare(p, 'powerpoint');
    const faraBara = r.ch >= r.oh - r.bt - 0.5 || r.sw <= r.cw;
    return { ok: sup === 'bara_stare#Slide Sorter' && faraBara && !r.taiate.length, det: `bara ${sup}; înălțimea ${r.oh}, din care se vede ${r.ch}; conținutul ${r.sw} în ${r.cw} px; tăiate: ${r.taiate.length ? r.taiate.join(' | ') : 'niciunul'}` };
  } },
  ...['word', 'powerpoint'].map(ap => ({
    nume: `T4 poligon ${ap} pe telefon 360 px: bara de stare se derulează în continuare acolo unde nu încape`, ecran: { viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, poligon: ap, fn: async (p) => {
      const r = await baraStare(p, ap);
      return { ok: r.ox === 'auto' && r.sw > r.cw, det: `overflow-x ${r.ox}; conținutul ${r.sw} în ${r.cw} px` };
    } })),
];

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  /* barele de derulare native la vedere, ca în laborator (Playwright le ascunde implicit) */
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
  try {
    for (const v of VERIFICARI.filter(x => !process.env.NOAPTE_FILTRU || x.nume.startsWith(process.env.NOAPTE_FILTRU))) {
      let ctx = null;
      try {
        ctx = await browser.newContext(v.ecran || LABORATOR);
        await ctx.route('**/*', r => { const u = new URL(r.request().url()); return (u.hostname === '127.0.0.1' || u.hostname === 'localhost') ? r.continue() : r.abort(); });
        await ctx.addInitScript(([k, lv]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ nume: '', lv: { 0: lv } })); } catch (e) { /* */ } }, [L06.cheie, L06.parcurs]);
        const p = await ctx.newPage();
        p.setDefaultTimeout(10000);
        const erori = [];
        p.on('pageerror', e => erori.push(e.message));
        if (v.poligon) {
          await p.goto(`${base}/aplicatii/poligon.html?aplicatie=${v.poligon}`, { waitUntil: 'load' });
          await p.waitForSelector(`[data-lh-aplicatie="${v.poligon}"] .lh-ap-jos`, { timeout: 15000 }); await pauza(1200);
        }
        const r = await Promise.race([v.fn(p, base, ctx), new Promise((_, rej) => setTimeout(() => rej(new Error('timp depasit (60 s)')), 60000))]);
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
