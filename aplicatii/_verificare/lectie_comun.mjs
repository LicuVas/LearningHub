// Partea comună a probelor JUCATE pe lecțiile de Excel legate la bibliotecă (lectie_m1-l04.mjs, lectie_m1-l05.mjs …).
// (lectie_m1-l02.mjs, pilotul, a rămas cum era: își are ajutoarele în el.)
// Contract: _campaign/aplicatii_fidele_2026_11/runde/legare_lectii_excel/contract.md, R3-R5.
//   node aplicatii/_verificare/lectie_<lectie>.mjs            lecția cum e ACUM pe disc
//   … --vechi     aceeași lecție, servită cu blocul de <script src> al simulatorului VECHI (probele trebuie să treacă și acolo)
//   … --nou       aceeași lecție, servită cu blocul de <script src> al bibliotecii (și când pe disc e încă blocul vechi)
//   … --doar E07,E09     doar exercițiile acelea        --arata    tipărește și textele din #fb (pentru inventar)
// Pe fiecare exercițiu, cu gesturi REALE (mouse și tastatură prin Playwright; nicio funcție internă a simulatorului):
//   a  rezolvarea corectă → „Corect”;  b  o greșeală tipică → „Nu încă”;  c1 indiciul apare la cerere;
//   c2 „Arată-mi răspunsul” apare după a doua greșeală, spune răspunsul; pe bibliotecă îl și EXECUTĂ (citit de pe ecran).
//   Probele în plus ale unui exercițiu (ex.extra: [{lit, nume, fa}]) rulează fiecare pe o pagină proaspătă.
// Navigarea între exerciții NU e gest de elev: ?pas=… + JocMotor.test.exercitiu(k), cu drumul marcat parcurs în localStorage.
// Rețeaua: orice cerere care nu merge la 127.0.0.1 / localhost e ABANDONATĂ (lecțiile trimit activitatea la un server real).
// Ieșire: câte o linie PASS / FAIL pe probă; ULTIMA linie = un singur număr întreg (câte FAIL).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');
const PW_DIR = process.env.HARNESS_PW_DIR || 'C:/00/AI_0/.scratch/harness-node';
const require = createRequire(path.join(PW_DIR, 'package.json'));
export const { chromium } = require('playwright');

const ARG = process.argv.slice(2);
export const VECHI = ARG.includes('--vechi');
export const NOU = ARG.includes('--nou');
export const ARATA = ARG.includes('--arata');
export const DOAR = ARG.includes('--doar') ? ARG[ARG.indexOf('--doar') + 1].split(',') : null;

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
/* blocul de <script src> al bibliotecii (ce pune legarea în lecție) */
export const SCRIPTURI_NOI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../aplicatii/aplicatii.js"></script>
<script src="../../../aplicatii/adapters/excel-excelx-adapter.js"></script>
`;
/* pagina lecției cu alt bloc de <script src> (de la primul <script src= până la primul <script> fără src) */
export function cuBloc(html, bloc) {
  const a = html.indexOf('<script src='), m = /<script>\r?\n/.exec(html.slice(a));
  if (a < 0 || !m) throw new Error('nu găsesc blocul de <script src> al lecției');
  return html.slice(0, a) + bloc + html.slice(a + m.index);
}
/* scripturiNoi (opțional) = blocul bibliotecii propriu lecției (lecția 5 încarcă și excel.js, pentru mini-foile din text) */
export function serve(lectie, scripturiVechi, scripturiNoi) {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      const rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      if ((VECHI || NOU) && rel === lectie) { s.writeHead(200, { 'Content-Type': MIME['.html'] }); return s.end(cuBloc(fs.readFileSync(path.join(ROOT, lectie), 'utf8'), VECHI ? scripturiVechi : (scripturiNoi || SCRIPTURI_NOI))); }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end('nu'); }
      s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(s);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

let nFail = 0, nPass = 0;
export function scrie(ok, nume, detalii) {
  if (ok) nPass++; else nFail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${detalii ? ' - ' + String(detalii).replace(/\s+/g, ' ').slice(0, 300) : ''}`);
}

/* ---------- gesturile, pe cele două interfețe (aceeași probă, alt loc pe ecran) ---------- */
const TR = R => t => { const i = t.indexOf(':'), f = i < 0 ? t : t.slice(0, i), v = i < 0 ? null : t.slice(i + 1); return v == null ? `${R} [data-lh-tinta="${f}"]:not([data-lh-id])` : `${R} [data-lh-tinta="${f}"][data-lh-id="${v}"], ${R} [data-lh-tinta="${t}"]`; };
const colIdx = L => L.split('').reduce((x, ch) => x * 26 + ch.charCodeAt(0) - 64, 0);
/* numele comenzilor din meniul de clic dreapta, pe simulatorul vechi (românește, cu numele englezesc în paranteză) */
const MENIU_VECHI = { Copy: /Copiere \(Copy\)/, Cut: /Decupare \(Cut\)/, Paste: /Lipire \(Paste\)/, Delete: /^Ștergere \(Delete\)/, 'Delete...': /^Ștergere…/, 'Clear Contents': /Golire conținut/, 'Clear All': /Golire totală \(Clear All\)/ };
/* pe bibliotecă, rândul de lipire din meniul de clic dreapta poartă numele din captura de referință („Keep Text Only”) */
const MENIU_NOU = { Paste: 'Keep Text Only' };
/* R = rădăcina în care se fac gesturile: '#body' (foaia sarcinii) sau '#body .xl-ex' (foaia de la „Exersează pe variante”) */
export function interfata(p, R = '#body') {
  const T = TR(R);
  const clic = (sel, o) => p.locator(sel).first().click(Object.assign({ timeout: 8000 }, o || {}));
  const centru = async sel => { await p.locator(sel).first().scrollIntoViewIfNeeded(); const b = await p.locator(sel).first().boundingBox(); if (!b) throw new Error('nu e pe ecran: ' + sel); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const comun = {
    p,
    scrie: t => p.keyboard.type(t, { delay: 15 }),
    tasta: async (k, n = 1) => { for (let i = 0; i < n; i++) { await p.keyboard.press(k); await p.waitForTimeout(60); } },
    verifica: async () => { await clic(R === '#body' ? '#chk' : R + ' [data-exv]'); await p.waitForTimeout(350); },
    optiune: async text => { await p.locator('#body .opt, #body .rel-opt').filter({ hasText: new RegExp('^\\s*' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).first().click({ timeout: 8000 }); await p.waitForTimeout(350); },
    pauza: ms => p.waitForTimeout(ms || 150)
  };
  const cuCelule = selCel => ({
    celula: a => clic(selCel(a)),
    shiftClic: a => clic(selCel(a), { modifiers: ['Shift'] }),
    /* tragere adevărată: apăsat pe prima celulă, mișcat în pași, eliberat pe ultima */
    trage: async (a, b) => {
      const A = await centru(selCel(a)), B = await centru(selCel(b));
      await p.mouse.move(A.x, A.y); await p.mouse.down(); await p.mouse.move((A.x + B.x) / 2, (A.y + B.y) / 2, { steps: 4 }); await p.mouse.move(B.x, B.y, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(120);
    }
  });
  if (VECHI) {
    const cel = a => `${R} .gw td[data-a="${a}"]`;
    const loc = t => { const [k, v] = t.split(':'); return k === 'rand' ? `${R} .gw tbody tr:nth-child(${v}) th` : k === 'coloana' ? `${R} .gw thead th:nth-child(${colIdx(v) + 1})` : cel(v); };
    return Object.assign(comun, cuCelule(cel), {
      clicDreapta: async t => { await clic(loc(t), { button: 'right' }); await p.waitForTimeout(150); },
      clicPe: t => clic(loc(t)),
      meniu: async n => { await p.locator('.xp-meniu button').filter({ hasText: MENIU_VECHI[n] || n }).first().click({ timeout: 8000 }); await p.waitForTimeout(150); },
      /* butonul din panglică (partea de sus, pictograma, la butoanele despărțite) */
      panglica: async n => { const s = `${R} [data-nesim="${{ Delete: 'CellsDeleteSmart', Clear: 'ClearMenu' }[n] || n}"]`; await p.locator(s).first().scrollIntoViewIfNeeded(); const b = await p.locator(s).first().boundingBox(); await p.mouse.click(b.x + b.width / 2, b.y + Math.min(12, b.height / 3)); await p.waitForTimeout(150); },
      dialogOK: async () => { await p.locator('.xp-dlg [data-ok]').click({ timeout: 8000 }); await p.waitForTimeout(200); },
      sariLa: async a => { await clic(R + ' .nb'); await p.keyboard.press('Control+a'); await p.keyboard.type(a, { delay: 15 }); await p.keyboard.press('Enter'); }
    });
  }
  const cel = a => T('celula:' + a);
  const loc = t => { const [k, v] = t.split(':'); return k === 'rand' ? T('antet_rand:' + v) : k === 'coloana' ? T('antet_coloana:' + v) : cel(v); };
  return Object.assign(comun, cuCelule(cel), {
    clicDreapta: async t => { await clic(loc(t), { button: 'right' }); await p.waitForTimeout(200); },
    clicPe: t => clic(loc(t)),
    meniu: async n0 => { const n = MENIU_NOU[n0] || n0; await clic(`[data-lh-aplicatie="excel"] [data-lh-tinta="meniu"][data-lh-id="${n}"]:visible, [data-lh-aplicatie="excel"] [data-lh-tinta="meniu:${n}"]:visible`); await p.waitForTimeout(200); },
    /* Clear ▾ (Home › Editing) e doar listă: ținta lui e meniu_derulant (sau panglica, după desen) */
    panglica: async n => { const s = n === 'Clear' ? `${T('meniu_derulant:Home/Editing/Clear')}, ${T('panglica:Home/Editing/Clear')}` : T('panglica:' + ({ Copy: 'Home/Clipboard/Copy', Cut: 'Home/Clipboard/Cut', Paste: 'Home/Clipboard/Paste', Delete: 'Home/Cells/Delete' }[n] || n)); await clic(s); await p.waitForTimeout(200); },
    dialogOK: async () => { await clic('[data-lh-aplicatie="excel"] [data-lh-tinta="fereastra"][data-lh-id="OK"], [data-lh-aplicatie="excel"] [data-lh-tinta="fereastra:OK"]'); await p.waitForTimeout(200); },
    sariLa: async a => { await clic(T('camp:Name Box')); await p.keyboard.press('Control+a'); await p.keyboard.type(a, { delay: 15 }); await p.keyboard.press('Enter'); }
  });
}
/* ce se vede pe ecran în foaie: {activa (caseta de nume), cel {A1: text}, al {A1: 'dreapta'|'stanga'|'centru'} (marginea de care
   s-a lipit conținutul), tri [celulele cu triunghiul verde]} — pe ambele interfețe */
export const ecran = (p, R = '#body') => p.evaluate(([vechi, R]) => {
  const cel = {}, al = {}, tri = [];
  if (vechi) {
    const w = document.querySelector(R + ' #xwrap'); if (!w) return null;
    w.querySelectorAll('.gw td[data-a]').forEach(e => { const t = e.textContent.trim(); if (!t) return; const a = e.dataset.a; cel[a] = t; al[a] = e.classList.contains('n') ? 'dreapta' : e.classList.contains('e') ? 'centru' : 'stanga'; if (e.classList.contains('xtri')) tri.push(a); });
    const nb = w.querySelector('.nb');
    return { activa: nb ? nb.textContent.trim() : null, cel, al, tri };
  }
  const r = document.querySelector(R + ' [data-lh-aplicatie="excel"]');
  if (!r) return null;
  const nb = r.querySelector('[data-lh-tinta="camp"][data-lh-id="Name Box"], [data-lh-tinta="camp:Name Box"]');
  r.querySelectorAll('[data-lh-zona] [data-lh-tinta="celula"], [data-lh-zona] [data-lh-tinta^="celula:"]').forEach(e => {
    const t = e.textContent.trim(); if (!t) return;
    const a = e.getAttribute('data-lh-id') || e.getAttribute('data-lh-tinta').slice(7); cel[a] = t;
    const d = e.matches('[class*="lh-ap-x-al-"]') ? e : e.querySelector('[class*="lh-ap-x-al-"]'), m = d && /lh-ap-x-al-(\w+)/.exec(d.className);
    if (m) al[a] = m[1];
    if (e.querySelector('.lh-ap-x-tri')) tri.push(a);
  });
  /* zona selectată nu are un text al ei pe ecran (caseta de nume arată doar celula activă): se citește din starea bibliotecii */
  let zona = null; try { zona = window.LH.aplicatii.stare('excel').selectie.zona; } catch (e) { /* */ }
  return { activa: nb ? (nb.value != null ? nb.value : nb.textContent).trim() : null, cel, zona, al, tri };
}, [VECHI, R]);

export async function deschide(p, base, lectie, ex) {
  await p.goto(`${base}${lectie}?pas=${ex.nav}`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.JocMotor && JocMotor.test.stare() && document.getElementById('body'), null, { timeout: 15000 });
  if (ex.k) await p.evaluate(k => JocMotor.test.exercitiu(k), ex.k);
  /* întrebarea despre înscriere (prezenta.js) acoperă pagina: „Nu, doar vizitez” */
  const viz = p.getByRole('button', { name: /doar vizitez/ });
  if (await viz.count()) await viz.first().click().catch(() => {});
  if (VECHI) await p.waitForSelector('#body #xwrap .gw td[data-a="A1"]', { timeout: 15000 });
  else await p.waitForSelector('#body [data-lh-aplicatie="excel"] [data-lh-zona]', { timeout: 20000 });
  await p.waitForTimeout(VECHI ? 500 : 900);
  return p.evaluate(() => ({ t: (JocMotor.test.stare().mode === 'practice' ? document.getElementById('pq') : document.querySelector('.q')).textContent, s: JocMotor.test.stare() }));
}
export const fb = p => p.evaluate(() => { const f = document.getElementById('fb'); return { ok: !!f.querySelector('.fb.ok'), bad: !!f.querySelector('.fb.bad'), text: f.textContent.trim() }; });

async function joaca(browser, base, cfg, ex) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  /* NIMIC în afara calculatorului: lecția trimite activitatea elevilor la un server real */
  const afara = [];
  await ctx.route('**/*', r => { const h = new URL(r.request().url()).hostname; if (h === '127.0.0.1' || h === 'localhost') return r.continue(); afara.push(h); return r.abort(); });
  await ctx.addInitScript(([k, lv]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ nume: '', lv: { 0: lv } })); } catch (e) { /* */ } }, [cfg.cheie, cfg.parcurs]);
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message));
  const u = interfata(p);
  const proba = async (lit, nume, fn) => { try { const r = await fn(); scrie(r === true, `${ex.id} ${lit} ${nume}`, r === true ? '' : r); } catch (e) { scrie(false, `${ex.id} ${lit} ${nume}`, e.message.split('\n')[0]); } };
  const proaspat = async () => { erori.length = 0; try { return await deschide(p, base, cfg.lectie, ex); } catch (e) { erori.push('deschidere: ' + e.message.split('\n')[0]); return null; } };
  // ---- pagina 1: indiciul (c1), apoi rezolvarea corectă (a)
  let pornit = await proaspat();
  const c1 = () => proba('c1', 'indiciul apare la cerere', async () => {
    if (!pornit) return 'exercițiul nu s-a deschis: ' + erori.join(' | ');
    const b = p.locator('.ajutor button');
    if (!(await b.count())) return 'nu există butonul „Am nevoie de un indiciu”';
    await b.click();
    const t = await p.evaluate(() => { const x = document.querySelector('.ajutor .ajutor-t'); return x && !x.hidden && x.offsetParent ? x.textContent.trim() : ''; });
    if (ARATA) console.log(`   [${ex.id} indiciu] ${t}`);
    return t.length > 15 ? true : 'indiciul nu se vede';
  });
  if (!ex.indiciuDupa) await c1();
  const corect = async fn => {
    if (!pornit) return 'exercițiul nu s-a deschis: ' + erori.join(' | ');
    await fn(u);
    const f = await fb(p);
    if (ARATA) console.log(`   [${ex.id} corect] ${f.text}`);
    if (ex.teste) { const n = await p.evaluate(() => document.querySelectorAll('#body .xp-teste li.ok, #body .xa-teste li.ok').length); if (n !== ex.teste) return `testele atelierului bifate: ${n} din ${ex.teste}; ${f.text}`; }
    if (erori.length) return 'eroare în pagină: ' + erori.join(' | ');
    return f.ok && /Corect/.test(f.text) ? true : 'lecția nu arată „Corect”: ' + (f.text || '(nimic)') + ' | ecran: ' + JSON.stringify(await ecran(p));
  };
  /* mesaj (opțional) = expresia mesajului din inventar: respingerea trebuie să spună CE e greșit, ca pe simulatorul vechi */
  const respins = async (fn, mesaj) => {
    if (!pornit) return 'exercițiul nu s-a deschis: ' + erori.join(' | ');
    await fn(u);
    const f = await fb(p);
    if (ARATA) console.log(`   [${ex.id} greșit] ${f.text}`);
    if (f.ok || /Corect!/.test(f.text)) return 'lecția arată „Corect” la o rezolvare greșită';
    if (!(f.bad && /Nu încă/.test(f.text))) return 'lecția nu spune „Nu încă”: ' + (f.text || '(nimic)');
    return !mesaj || mesaj.test(f.text) ? true : `mesajul nu spune ${mesaj}: ${f.text}`;
  };
  /* o pagină proaspătă pe „telefon” (360 px, ecran cu atingere), cu aceeași rețea oprită și același drum parcurs */
  const telefon = async () => {
    const c2 = await browser.newContext({ viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    await c2.route('**/*', r => { const h = new URL(r.request().url()).hostname; if (h === '127.0.0.1' || h === 'localhost') return r.continue(); afara.push(h); return r.abort(); });
    await c2.addInitScript(([k, lv]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ nume: '', lv: { 0: lv } })); } catch (e) { /* */ } }, [cfg.cheie, cfg.parcurs]);
    const p2 = await c2.newPage();
    p2.on('pageerror', e => erori.push(e.message));
    await deschide(p2, base, cfg.lectie, ex);
    return { p: p2, u: interfata(p2), inchide: () => c2.close() };
  };
  await proba('a', `corect: ${ex.ce}`, () => corect(ex.ok));
  // ---- pagina 2: greșeala tipică (b), a doua greșeală, „Arată-mi răspunsul” (c2)
  pornit = await proaspat();
  if (ex.indiciuDupa) await c1();
  await proba('b', 'greșeala tipică e respinsă' + (ex.mesaj ? ', cu mesajul ei' : ''), () => respins(ex.rau, ex.mesaj));
  await proba('c2', '„Arată-mi răspunsul” apare după a doua greșeală și arată răspunsul' + (VECHI ? '' : ' (și îl execută)'), async () => {
    if (!pornit) return 'exercițiul nu s-a deschis';
    if (ex.rau2) await ex.rau2(u); else await u.verifica();
    const b = p.locator('#reveal');
    if (!(await b.count())) return 'butonul „Arată-mi răspunsul” nu a apărut după a doua greșeală';
    await b.click();
    await p.waitForTimeout(VECHI ? 300 : 1800);
    const f = await fb(p);
    if (ARATA) console.log(`   [${ex.id} răspuns] ${f.text}`);
    if (!/răspunsul/i.test(f.text)) return 'nu apare răspunsul: ' + f.text;
    if (!ex.raspuns.test(f.text)) return `răspunsul arătat nu spune ${ex.raspuns}: ${f.text}`;
    if (!VECHI && ex.aratat) { const e = await ecran(p); if (!e || !ex.aratat(e)) return 'pașii nu s-au executat în Excel: ' + JSON.stringify(e); }
    if (erori.length) return 'eroare în pagină: ' + erori.join(' | ');
    return true;
  });
  // ---- probele în plus: fiecare pe o pagină proaspătă; {corect: fn} / {respins: fn} / {fa: async (u, p, unelte) => true | 'motiv'}
  for (const x of ex.extra || []) {
    if (x.doarNou && VECHI) continue;
    pornit = await proaspat();
    await proba(x.lit, x.nume, () => x.corect ? corect(x.corect) : x.respins ? respins(x.respins, x.mesaj) : (pornit ? x.fa(u, p, { fb, ecran, VECHI, telefon }) : 'exercițiul nu s-a deschis'));
  }
  await ctx.close();
  return afara;
}

/* cfg = {lectie: '/lectii/viii/m1-l04/index.html', cheie, parcurs: {ps, pn, at, re, qm}, scripturiVechi, vechiNume, EX} */
export async function ruleaza(cfg) {
  const srv = await serve(cfg.lectie, cfg.scripturiVechi, cfg.scripturiNoi);
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const afara = new Set();
  console.log(`# lecția ${cfg.lectie} pe ${VECHI ? 'simulatorul VECHI (' + cfg.vechiNume + ')' : NOU ? 'blocul de scripturi al BIBLIOTECII (servit de probă)' : 'pagina de ACUM, de pe disc'}`);
  for (const ex of cfg.EX) {
    if (DOAR && !DOAR.includes(ex.id)) continue;
    try { (await joaca(browser, base, cfg, ex)).forEach(h => afara.add(h)); } catch (e) { scrie(false, `${ex.id} proba întreagă`, e.message.split('\n')[0]); }
  }
  await browser.close();
  srv.close();
  console.log(`# cereri în afara calculatorului, abandonate: ${afara.size ? [...afara].join(', ') : 'niciuna'}`);
  console.log(`# ${nPass} PASS, ${nFail} FAIL`);
  console.log(String(nFail));
}
