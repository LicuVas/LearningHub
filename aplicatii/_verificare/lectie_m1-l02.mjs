// Probele JUCATE ale lecției lectii/viii/m1-l02 (19 exerciții `excelx`), scrise ÎNAINTEA adaptorului
// aplicatii/adapters/excel-excelx-adapter.js (contract: _campaign/aplicatii_fidele_2026_11/runde/legare_lectii_excel/contract.md, R3-R5).
// Rulare (din rădăcina depozitului):
//   node aplicatii/_verificare/lectie_m1-l02.mjs            lecția cum e ACUM în lectii/viii/m1-l02/index.html
//   node aplicatii/_verificare/lectie_m1-l02.mjs --vechi    aceeași lecție, servită cu blocul de <script> al simulatorului VECHI
//                                                           (tip-foaie.js, tip-excel.js, excelx.js, excelx-interfata.js), ca să se
//                                                           vadă că probele sunt corecte: pe vechi trebuie să treacă
//   --doar E07      doar exercițiul acela        --arata    tipărește și textele din #fb (pentru inventar)
// Pe fiecare exercițiu, cu gesturi REALE (mouse și tastatură prin Playwright; nicio funcție internă a simulatorului):
//   a  rezolvarea corectă        → lecția arată „Corect”
//   b  o greșeală tipică         → lecția NU arată „Corect” (arată „Nu încă”)
//   c1 „Am nevoie de un indiciu” → indiciul apare
//   c2 „Arată-mi răspunsul”      → apare după a doua greșeală, arată răspunsul în cuvinte; pe biblioteca nouă îl și EXECUTĂ
//                                  (se citește de pe ecran: caseta de nume, celulele, fila foii, zoom-ul, fila panglicii, chenarul)
// Navigarea între exerciții NU e gest de elev: legătura directă ?pas=… a motorului + JocMotor.test.exercitiu(k) („Încă un
// exercițiu”), cu drumul marcat ca parcurs în localStorage-ul paginii de probă.
// Rețeaua: orice cerere care nu merge la 127.0.0.1 / localhost e ABANDONATĂ (lecțiile trimit activitatea la un server real).
// Ieșire: câte o linie PASS / FAIL pe probă; ULTIMA linie = un singur număr întreg (câte FAIL).
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

const ARG = process.argv.slice(2);
const VECHI = ARG.includes('--vechi');
const ARATA = ARG.includes('--arata');
const DOAR = ARG.includes('--doar') ? ARG[ARG.indexOf('--doar') + 1].split(',') : null;
const LECTIE = '/lectii/viii/m1-l02/index.html';
const CHEIE = 'lectie_viii_m1_l02';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
/* blocul de <script src> al simulatorului vechi (cum era lecția înainte de legare) */
const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<script src="../../_sim/excelx.js"></script>
<script src="../../_sim/excelx-interfata.js"></script>
<script src="../../_sim/tur-captura.js"></script>
`;
function paginaVeche() {
  const s = fs.readFileSync(path.join(ROOT, LECTIE), 'utf8');
  const a = s.indexOf('<script src='), b = s.indexOf('<script>\n', a) >= 0 ? s.indexOf('<script>\n', a) : s.indexOf('<script>\r\n', a);
  if (a < 0 || b < 0) throw new Error('nu găsesc blocul de <script src> al lecției');
  return s.slice(0, a) + SCRIPTURI_VECHI + s.slice(b);
}
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      const rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      if (VECHI && rel === LECTIE) { s.writeHead(200, { 'Content-Type': MIME['.html'] }); return s.end(paginaVeche()); }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end('nu'); }
      s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(s);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

let nFail = 0, nPass = 0;
function scrie(ok, nume, detalii) {
  if (ok) nPass++; else nFail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${detalii ? ' - ' + String(detalii).replace(/\s+/g, ' ').slice(0, 300) : ''}`);
}

/* ---------- gesturile, pe cele două interfețe (aceeași probă, alt loc pe ecran) ---------- */
const T = t => { const i = t.indexOf(':'), f = i < 0 ? t : t.slice(0, i), v = i < 0 ? null : t.slice(i + 1); return v == null ? `#body [data-lh-tinta="${f}"]:not([data-lh-id])` : `#body [data-lh-tinta="${f}"][data-lh-id="${v}"], #body [data-lh-tinta="${t}"]`; };
const FILE_EN = { home: 'Home', insert: 'Insert', data: 'Data', view: 'View' };
function interfata(p) {
  const clic = sel => p.locator(sel).first().click({ timeout: 8000 });
  const clicPeNume = async sel => {
    const r = await p.locator(sel).first().evaluate(e => { e.scrollIntoView({ block: 'nearest', inline: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
    await p.waitForTimeout(150);
    const r2 = await p.locator(sel).first().evaluate(e => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
    await p.mouse.click(r2.x || r.x, r2.y || r.y);
  };
  const comun = {
    scrie: t => p.keyboard.type(t, { delay: 15 }),
    tasta: async (k, n = 1) => { for (let i = 0; i < n; i++) { await p.keyboard.press(k); await p.waitForTimeout(40); } },
    verifica: async () => { await clic('#chk'); await p.waitForTimeout(350); },
    optiune: async text => { await p.locator('#body .opt, #body .rel-opt').filter({ hasText: new RegExp('^\\s*' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).first().click({ timeout: 8000 }); await p.waitForTimeout(350); }
  };
  if (VECHI) return Object.assign(comun, {
    caseta: () => clic('#body .nb'),
    bara: () => clic('#body #xfx'),
    zoom: s => clic(`#body [data-xi-z="${s}"]`),
    fila: f => clic(`#body .rb [data-tab="${f}"]`),
    /* numele grupului poate fi în afara benzii vizibile: elevul derulează panglica spre dreapta (indiciul lecției o spune);
       clicul se dă cu mouse-ul chiar pe nume (numele nu prinde el clicul, îl prinde grupul) */
    grup: g => clicPeNume(`#body .pg-grup[aria-label="${g}"] .pg-nume`),
    celula: a => clic(`#body .gw td[data-a="${a}"]`),
    foaie: n => clic(`#body [data-xi-foaie="${n}"]`),
    sariLa: async a => { await clic('#body .nb'); await p.keyboard.press('Control+a'); await p.keyboard.type(a, { delay: 15 }); await p.keyboard.press('Enter'); }
  });
  return Object.assign(comun, {
    caseta: () => clic(T('camp:Name Box')),
    bara: () => clic(T('bara_formule')),
    zoom: s => clic(T(s === '+' ? 'zoom:Zoom In' : 'zoom:Zoom Out')),
    fila: f => clic(T('fila:' + FILE_EN[f])),
    grup: g => clicPeNume(`#body [data-lh-tip="Group"][data-lh-eticheta="${g}"] > .lh-ap-legenda`),
    celula: a => clic(T('celula:' + a)),
    foaie: n => clic(T('fila_foii:' + n)),
    sariLa: async a => { await clic(T('camp:Name Box')); await p.keyboard.press('Control+a'); await p.keyboard.type(a, { delay: 15 }); await p.keyboard.press('Enter'); }
  });
}
/* ce se vede pe ecran în Excelul din bibliotecă (doar interfața nouă), pentru „Arată-mi răspunsul” executat */
const ecran = p => p.evaluate(() => {
  const r = document.querySelector('#body [data-lh-aplicatie="excel"]');
  if (!r) return null;
  const q = (f, v) => r.querySelector(v == null ? `[data-lh-tinta="${f}"]` : `[data-lh-tinta="${f}"][data-lh-id="${v}"], [data-lh-tinta="${f}:${v}"]`);
  const nb = q('camp', 'Name Box');
  const cel = {};
  r.querySelectorAll('[data-lh-zona] [data-lh-tinta="celula"], [data-lh-zona] [data-lh-tinta^="celula:"]').forEach(e => { const t = e.textContent.trim(); if (t) cel[e.getAttribute('data-lh-id') || e.getAttribute('data-lh-tinta').slice(7)] = t; });
  const foaie = [...r.querySelectorAll('[data-lh-tinta="fila_foii"]')].find(x => x.getAttribute('aria-selected') === 'true');
  const fila = [...r.querySelectorAll('[data-lh-tinta="fila"], [data-lh-tinta^="fila:"]')].find(x => x.getAttribute('aria-selected') === 'true');
  const proc = [...r.querySelectorAll('*')].filter(e => !e.children.length && /^\d+\s?%$/.test(e.textContent.trim())).map(e => parseInt(e.textContent, 10));
  const ev = r.querySelector('[data-lh-evidentiat]');
  return { activa: nb ? (nb.value != null ? nb.value : nb.textContent).trim() : null, cel, foaie: foaie ? foaie.getAttribute('data-lh-id') : null,
    fila: fila ? (fila.getAttribute('data-lh-id') || fila.getAttribute('data-lh-tinta').slice(5)) : null, zoom: proc.length ? proc[proc.length - 1] : null,
    evidentiat: ev ? (ev.getAttribute('data-lh-tinta') + (ev.getAttribute('data-lh-id') ? ':' + ev.getAttribute('data-lh-id') : '')) : null };
});

/* ---------- cele 19 exerciții: unde sunt în lecție, rezolvarea, greșeala tipică, ce spune răspunsul arătat ---------- */
const scrieRand = async (u, bucati, sfarsit) => { for (let i = 0; i < bucati.length; i++) { await u.scrie(bucati[i]); await u.tasta(i < bucati.length - 1 ? 'Tab' : sfarsit || 'Enter'); } };
const EX = [
  { id: 'E01', nav: 'p2', k: 0, ce: 'clic pe caseta de nume', ok: async u => { await u.caseta(); await u.verifica(); }, rau: async u => { await u.bara(); await u.verifica(); },
    raspuns: /caseta de nume/, aratat: e => e.evidentiat === 'camp:Name Box' },
  { id: 'E02', nav: 'p2', k: 1, ce: 'clic pe bara de formule', ok: async u => { await u.bara(); await u.verifica(); }, rau: async u => { await u.caseta(); await u.verifica(); },
    raspuns: /bara de formule/, aratat: e => e.evidentiat === 'bara_formule' },
  { id: 'E03', nav: 'p2', k: 2, ce: 'zoom 120 %', ok: async u => { await u.zoom('+'); await u.zoom('+'); await u.verifica(); }, rau: async u => { await u.zoom('+'); await u.verifica(); },
    rau2: async u => { await u.zoom('+'); await u.zoom('+'); await u.verifica(); }, raspuns: /120 %/, aratat: e => e.zoom === 120 },
  { id: 'E04', nav: 'p3', k: 0, ce: 'fila Data', ok: async u => { await u.fila('data'); await u.verifica(); }, rau: async u => { await u.fila('insert'); await u.verifica(); },
    raspuns: /Date \(Data\)/, aratat: e => e.fila === 'Data' },
  { id: 'E05', nav: 'p3', k: 1, ce: 'Insert, înapoi pe Home, clic pe numele grupului Number', ok: async u => { await u.fila('insert'); await u.fila('home'); await u.grup('Number'); await u.verifica(); },
    rau: async u => { await u.fila('insert'); await u.fila('home'); await u.grup('Font'); await u.verifica(); }, raspuns: /grupul Number/, aratat: e => e.fila === 'Home' },
  { id: 'E06', nav: 'p4', k: 0, ce: 'clic pe D3', ok: async u => { await u.celula('D3'); await u.verifica(); }, rau: async u => { await u.celula('C4'); await u.verifica(); },
    raspuns: /D3/, aratat: e => e.activa === 'D3' },
  { id: 'E07', nav: 'p4', k: 1, ce: 'foaia Excursie, celula B3', ok: async u => { await u.foaie('Excursie'); await u.celula('B3'); await u.verifica(); }, rau: async u => { await u.celula('B3'); await u.verifica(); },
    raspuns: /Excursie/, aratat: e => e.foaie === 'Excursie' && e.activa === 'B3' },
  { id: 'E08', nav: 'p5', k: 0, ce: 'Elev ⇥ Nota ↵ Ana ⇥ 9 ↵', ok: async u => { await u.celula('A1'); await scrieRand(u, ['Elev', 'Nota']); await scrieRand(u, ['Ana', '9']); await u.verifica(); },
    rau: async u => { await u.celula('A1'); for (const t of ['Elev', 'Nota', 'Ana', '9']) { await u.scrie(t); await u.tasta('Enter'); } await u.verifica(); },
    raspuns: /Elev în A1/, aratat: e => e.cel.A1 === 'Elev' && e.cel.B1 === 'Nota' && e.cel.A2 === 'Ana' && e.cel.B2 === '9' && e.activa === 'A3' },
  { id: 'E09', nav: 'p5', k: 2, ce: 'din A1 în D5 doar cu săgețile', ok: async u => { await u.celula('A1'); await u.tasta('ArrowRight', 3); await u.tasta('ArrowDown', 4); await u.verifica(); },
    rau: async u => { await u.celula('A1'); await u.celula('D5'); await u.verifica(); }, raspuns: /D5/, aratat: e => e.activa === 'D5' },
  { id: 'E10', nav: 'p5', k: 3, ce: 'scrii 5 în A2 și Esc: rămâne 9', ok: async u => { await u.celula('A2'); await u.scrie('5'); await u.tasta('Escape'); await u.optiune('9'); },
    rau: async u => { await u.optiune('5'); }, rau2: async u => { await u.optiune('95'); }, raspuns: /9/, optiuni: true },
  { id: 'E11', nav: 'p6', k: 0, ce: 'clic pe A3, citești bara de formule: robotică', ok: async u => { await u.celula('A3'); await u.optiune('robotică'); },
    rau: async u => { await u.optiune('dans'); }, rau2: async u => { await u.optiune('șah'); }, raspuns: /robotică/, optiuni: true },
  { id: 'E12', nav: 'p6', k: 1, ce: 'H15 din caseta de nume', ok: async u => { await u.sariLa('H15'); await u.verifica(); }, rau: async u => { await u.sariLa('H5'); await u.verifica(); },
    raspuns: /H15/, aratat: e => e.activa === 'H15' },
  /* E13: exercițiul cere scris FĂRĂ niciun clic (foaia are tastatura de la început); clicul pe „Am nevoie de un indiciu” ar lua
     tastatura de la foaie, deci indiciul se cere pe pagina a doua (înaintea greșelii, care începe oricum cu un clic) */
  { id: 'E13', nav: 'p6', k: 2, indiciuDupa: true, ce: 'fără clic: „aici” ajunge în celula activă D4', ok: async u => { await u.scrie('aici'); await u.tasta('Enter'); await u.verifica(); },
    rau: async u => { await u.celula('A1'); await u.scrie('aici'); await u.tasta('Enter'); await u.verifica(); }, raspuns: /aici în D4/, aratat: e => e.cel.D4 === 'aici' },
  { id: 'E14', nav: 'atelier', k: 0, ce: 'atelier: foaia Excursie, tabelul, zoom 120 %',
    ok: async u => { await u.foaie('Excursie'); await u.celula('A1'); await scrieRand(u, ['Elev', 'Suma']); await scrieRand(u, ['Ana', '150']); await scrieRand(u, ['Bogdan', '120']); await u.zoom('+'); await u.zoom('+'); await u.verifica(); },
    /* greșeala tipică: totul bine, dar zoom-ul schimbat pe foaia Note (fiecare foaie își ține zoom-ul ei) */
    rau: async u => { await u.zoom('+'); await u.zoom('+'); await u.foaie('Excursie'); await u.celula('A1'); await scrieRand(u, ['Elev', 'Suma']); await scrieRand(u, ['Ana', '150']); await scrieRand(u, ['Bogdan', '120']); await u.verifica(); },
    rau2: async u => { await u.verifica(); }, teste: 6, raspuns: /Excursie/,
    aratat: e => e.foaie === 'Excursie' && e.cel.A1 === 'Elev' && e.cel.B1 === 'Suma' && e.cel.A3 === 'Bogdan' && e.cel.B3 === '120' && e.activa === 'A4' && e.zoom === 120 },
  { id: 'E15', nav: 'atelier', k: 1, ce: 'atelier 2: foaia Orar, rândul Miercuri, zoom 90 %',
    ok: async u => { await u.foaie('Orar'); await u.celula('A4'); await scrieRand(u, ['Miercuri', 'Biologie', 'Muzică']); await u.zoom('-'); await u.verifica(); },
    rau: async u => { await u.foaie('Orar'); await u.celula('A4'); await scrieRand(u, ['Miercuri', 'Biologie', 'Muzică']); await u.zoom('+'); await u.verifica(); },
    rau2: async u => { await u.verifica(); }, teste: 5, raspuns: /Orar/,
    aratat: e => e.foaie === 'Orar' && e.cel.A4 === 'Miercuri' && e.cel.C4 === 'Muzică' && e.activa === 'A5' && e.zoom === 90 },
  { id: 'E16', nav: 'q2', ce: 'Î2: clic pe bara de formule', ok: async u => { await u.bara(); await u.verifica(); }, rau: async u => { await u.caseta(); await u.verifica(); },
    raspuns: /bara de formule/, aratat: e => e.evidentiat === 'bara_formule' },
  { id: 'E17', nav: 'q3', ce: 'Î3: fila View', ok: async u => { await u.fila('view'); await u.verifica(); }, rau: async u => { await u.fila('data'); await u.verifica(); },
    raspuns: /Vizualizare \(View\)/, aratat: e => e.fila === 'View' },
  { id: 'E18', nav: 'q4', ce: 'Î4: foaia Orar, celula C3', ok: async u => { await u.foaie('Orar'); await u.celula('C3'); await u.verifica(); }, rau: async u => { await u.celula('C3'); await u.verifica(); },
    raspuns: /Orar/, aratat: e => e.foaie === 'Orar' && e.activa === 'C3' },
  { id: 'E19', nav: 'q5', ce: 'Î5: rândul lui Radu, apoi Enter', ok: async u => { await u.celula('A4'); await scrieRand(u, ['Radu', '8', '9']); await u.verifica(); },
    rau: async u => { await u.celula('A4'); await scrieRand(u, ['Radu', '8', '9'], 'Tab'); await u.verifica(); },
    raspuns: /Radu în A4/, aratat: e => e.cel.A4 === 'Radu' && e.cel.B4 === '8' && e.cel.C4 === '9' && e.activa === 'A5' }
];

async function deschide(p, base, ex) {
  await p.goto(`${base}${LECTIE}?pas=${ex.nav}`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.JocMotor && JocMotor.test.stare() && document.getElementById('body'), null, { timeout: 15000 });
  if (ex.k) await p.evaluate(k => JocMotor.test.exercitiu(k), ex.k);
  /* întrebarea despre înscriere (prezenta.js) acoperă pagina: „Nu, doar vizitez” */
  const viz = p.getByRole('button', { name: /doar vizitez/ });
  if (await viz.count()) await viz.first().click().catch(() => {});
  if (VECHI) await p.waitForSelector('#body #xwrap .gw td[data-a="A1"]', { timeout: 15000 });
  else await p.waitForSelector('#body [data-lh-aplicatie="excel"] [data-lh-zona]', { timeout: 20000 });
  await p.waitForTimeout(VECHI ? 500 : 900);
  const st = await p.evaluate(() => ({ t: (JocMotor.test.stare().mode === 'practice' ? document.getElementById('pq') : document.querySelector('.q')).textContent, s: JocMotor.test.stare() }));
  return st;
}
const fb = p => p.evaluate(() => { const f = document.getElementById('fb'); return { ok: !!f.querySelector('.fb.ok'), bad: !!f.querySelector('.fb.bad'), text: f.textContent.trim() }; });

async function joaca(browser, base, ex) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  /* NIMIC în afara calculatorului: lecția trimite activitatea elevilor la un server real */
  const afara = [];
  await ctx.route('**/*', r => { const h = new URL(r.request().url()).hostname; if (h === '127.0.0.1' || h === 'localhost') return r.continue(); afara.push(h); return r.abort(); });
  await ctx.addInitScript(([k]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ nume: '', lv: { 0: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 } } })); } catch (e) { /* */ } }, [CHEIE]);
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message));
  const u = interfata(p);
  const proba = async (lit, nume, fn) => { try { const r = await fn(); scrie(r === true, `${ex.id} ${lit} ${nume}`, r === true ? '' : r); } catch (e) { scrie(false, `${ex.id} ${lit} ${nume}`, e.message.split('\n')[0]); } };
  // ---- pagina 1: indiciul (c1), apoi rezolvarea corectă (a)
  let pornit = null;
  try { pornit = await deschide(p, base, ex); } catch (e) { pornit = null; erori.push('deschidere: ' + e.message.split('\n')[0]); }
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
  await proba('a', `corect: ${ex.ce}`, async () => {
    if (!pornit) return 'exercițiul nu s-a deschis';
    await ex.ok(u);
    const f = await fb(p);
    if (ARATA) console.log(`   [${ex.id} corect] ${f.text}`);
    if (ex.teste) { const n = await p.evaluate(() => document.querySelectorAll('#body .xp-teste li.ok, #body .xa-teste li.ok').length); if (n !== ex.teste) return `testele atelierului bifate: ${n} din ${ex.teste}; ${f.text}`; }
    if (erori.length) return 'eroare în pagină: ' + erori.join(' | ');
    return f.ok && /Corect/.test(f.text) ? true : 'lecția nu arată „Corect”: ' + (f.text || '(nimic)');
  });
  // ---- pagina 2: greșeala tipică (b), a doua greșeală, „Arată-mi răspunsul” (c2)
  erori.length = 0;
  try { pornit = await deschide(p, base, ex); } catch (e) { pornit = null; erori.push('deschidere: ' + e.message.split('\n')[0]); }
  if (ex.indiciuDupa) await c1();
  await proba('b', 'greșeala tipică e respinsă', async () => {
    if (!pornit) return 'exercițiul nu s-a deschis: ' + erori.join(' | ');
    await ex.rau(u);
    const f = await fb(p);
    if (ARATA) console.log(`   [${ex.id} greșit] ${f.text}`);
    if (f.ok || /Corect!/.test(f.text)) return 'lecția arată „Corect” la o rezolvare greșită';
    return f.bad && /Nu încă/.test(f.text) ? true : 'lecția nu spune „Nu încă”: ' + (f.text || '(nimic)');
  });
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
  await ctx.close();
  return afara;
}

(async () => {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const afara = new Set();
  console.log(`# lecția m1-l02 pe ${VECHI ? 'simulatorul VECHI (tip-excel.js + excelx.js + excelx-interfata.js)' : 'pagina de ACUM (lectii/viii/m1-l02/index.html)'}`);
  for (const ex of EX) {
    if (DOAR && !DOAR.includes(ex.id)) continue;
    try { (await joaca(browser, base, ex)).forEach(h => afara.add(h)); } catch (e) { scrie(false, `${ex.id} proba întreagă`, e.message.split('\n')[0]); }
  }
  await browser.close();
  srv.close();
  console.log(`# cereri în afara calculatorului, abandonate: ${afara.size ? [...afara].join(', ') : 'niciuna'}`);
  console.log(`# ${nPass} PASS, ${nFail} FAIL`);
  console.log(String(nFail));
})();
