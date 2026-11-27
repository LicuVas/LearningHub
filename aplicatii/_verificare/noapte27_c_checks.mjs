// noapte27_c_checks.mjs — „Arată-mi răspunsul” pe biblioteca nouă (noaptea 27-28.11.2026, constructorul C).
// Defectul (poarta_lectii.md): în viii/m1-l03 (Excel) și v/m2-l09 (Explorer) butonul nu făcea pașii în fereastră, iar textul
// afirma lucruri false („Zilele sunt în ordine”, „acum trec toate”, „în casetă e calea …”).
// Joc cu gesturi reale (Playwright headless, server local): două greșeli, clic pe „Arată-mi răspunsul”, apoi:
//   (1) textul nu conține fraza falsă veche; (2) ce afirmă textul despre fereastră e adevărat în DOM (testele trec, foile /
//   folderul / caseta sunt cele corecte); (3) butonul de mers mai departe e vizibil.
//   node aplicatii/_verificare/noapte27_c_checks.mjs          -> adaptoarele din dosar
//   node aplicatii/_verificare/noapte27_c_checks.mjs --vechi  -> adaptoarele de dinaintea reparației (git show 520da0e7:…), ca să se vadă că proba pică
// Linii PASS/FAIL; ULTIMA linie = numărul de FAIL; exit 0. Capturi: _campaign/aplicatii_fidele_2026_11/runde/noapte_27_11/img_C/*.png
// Acoperă și Î4, Î5 (același text fals apărea acolo) și pasul cu testul `redeschis`, unde rămâne varianta (b): textul cu pașii.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PW_DIR = process.env.HARNESS_PW_DIR || 'C:/00/AI_0/.scratch/harness-node';
const require = createRequire(path.join(PW_DIR, 'package.json'));
const { chromium } = require('playwright');
const VECHI = process.argv.includes('--vechi');
/* --vechi = adaptoarele de dinaintea reparației (520da0e7, părintele comiterii ei); --ref=<comitere> pentru altă variantă */
const REF = (process.argv.find(a => a.startsWith('--ref=')) || '--ref=520da0e7').slice(6);
const IMG = path.join(ROOT, '_campaign', 'aplicatii_fidele_2026_11', 'runde', 'noapte_27_11', 'img_C');   // capturile, în afara sitului
fs.mkdirSync(IMG, { recursive: true });

const ADAPTOARE = ['/aplicatii/adapters/excel-registru-foi-adapter.js', '/aplicatii/adapters/explorer-citire-adapter.js'];
const vechi = {};
if (VECHI) ADAPTOARE.forEach(p => { vechi[p] = execSync(`git -C "${ROOT}" show ${REF}:${p.slice(1)}`, { encoding: 'utf8', maxBuffer: 1 << 24 }); });

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      let rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      if (VECHI && vechi[rel] != null) { s.writeHead(200, { 'Content-Type': MIME['.js'] }); return s.end(vechi[rel]); }
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
const out = (ok, ce, det) => { if (!ok) nFail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${ce}${det ? ' — ' + String(det).slice(0, 400) : ''}`); };
const pauza = ms => new Promise(r => setTimeout(r, ms));
const css = s => '"' + String(s).replace(/"/g, '\\"') + '"';

async function pagina(br, base, url) {
  const ctx = await br.newContext({ viewport: { width: 1366, height: 768 }, serviceWorkers: 'block' });
  await ctx.route('**/*', rt => { const q = rt.request(); return (q.method() === 'GET' && q.url().startsWith(base)) || /^(data|blob|about):/.test(q.url()) ? rt.continue() : rt.abort(); });
  const pg = await ctx.newPage();
  pg.erori = [];
  pg.on('pageerror', e => pg.erori.push(String(e.message || e).slice(0, 200)));
  await pg.goto(base + url, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.JocMotor && JocMotor.test && JocMotor.test.config && JocMotor.test.config() && document.querySelector('.lvl'), null, { timeout: 30000 });
  await pauza(600);
  const viz = pg.locator('#lhp-viz'); if (await viz.count() && await viz.first().isVisible()) { await viz.first().click(); await pauza(300); }
  await pg.locator('.lvl').first().click(); await pauza(500);
  return { ctx, pg };
}
const fb = pg => pg.evaluate(() => { const e = document.getElementById('fb'); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; });
const stareMotor = pg => pg.evaluate(() => { const s = JocMotor.test.stare(); return s ? { li: s.li, phase: s.phase, si: s.si, qi: s.qi } : null; });
async function vizibil(pg, sel) { const L = pg.locator(sel); const n = await L.count(); for (let i = 0; i < n; i++) if (await L.nth(i).isVisible().catch(() => false)) return L.nth(i); return null; }
async function clic(pg, sel, opt) { const x = await vizibil(pg, sel); if (!x) return false; await x.click(opt); await pauza(350); return true; }
async function clicText(pg, rad, re) {
  const h = await pg.evaluateHandle(([rad, src, fl]) => {
    const re = new RegExp(src, fl);
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const R = document.querySelector(rad) || document;
    const cand = [...R.querySelectorAll('[data-lh-eticheta],[aria-label],[title],button,[role=menuitem],[role=option],li,a,span,div')].filter(vis);
    const potr = e => [e.getAttribute('data-lh-eticheta'), e.getAttribute('aria-label'), e.getAttribute('title'), (e.childElementCount === 0 || e.tagName === 'BUTTON') ? e.textContent.trim() : null].some(t => t && re.test(t.trim()));
    const toate = cand.filter(potr);
    const adanc = toate.filter(e => !toate.some(x => x !== e && e.contains(x)));
    return adanc[adanc.length - 1] || null;
  }, [rad, re.source, re.flags]);
  const el = h.asElement(); if (!el) return false; await el.click(); await pauza(350); return true;
}
async function asteaptaRaspuns(pg) {
  for (let t = 0; t < 40; t++) { const f = await fb(pg); if (/Răspunsul corect|Uite răspunsul/.test(f)) return f; await pauza(200); }
  return await fb(pg);
}
async function ecran(pg, nume) { const f = path.join(IMG, `${VECHI ? 'vechi_' : ''}${nume}.png`); await pg.screenshot({ path: f }); return f; }
const numarTeste = t => { const m = /(\d+) din (\d+) trec/i.exec(t || ''); return m ? [+m[1], +m[2]] : null; };   // eticheta e scrisă cu majuscule (CSS)

/* ——— a VIII-a, m1-l03, Î2 (Excel): Marți înaintea lui Miercuri, Luni galben ——— */
async function excelL03(br, base) {
  const { ctx, pg } = await pagina(br, base, '/lectii/viii/m1-l03/index.html');
  const X = '[data-lh-aplicatie="excel"]';
  try {
    for (let k = 0; k < 30; k++) { const s = await stareMotor(pg); if (s && s.phase === 'q') break; if (!await clic(pg, '#go')) if (!await clic(pg, '#pas-next')) break; await pauza(300); }
    await clicText(pg, '#body', /^PDF \(\*\.pdf\)$/); await pauza(300);
    await clic(pg, '#next'); await pauza(500);
    await pg.waitForSelector(X, { timeout: 20000 }); await pauza(900);
    const stX = () => pg.evaluate(() => { try { return window.LH.aplicatii.stare('excel'); } catch (e) { return {}; } });
    const s0 = await stX();
    out(JSON.stringify(s0.foi) === JSON.stringify(['Luni', 'Miercuri', 'Marți']), 'VIII Î2: Excel pornește cu foile Luni, Miercuri, Marți', JSON.stringify(s0.foi));
    // greșeala 1: Verifică fără nimic; greșeala 2: doar culoarea (fără mutare), cu gesturi
    await clic(pg, '#chk'); await pauza(500);
    await pg.locator(`${X} [data-lh-tinta="fila_foii"][data-lh-id=${css('Luni')}]`).first().click({ button: 'right' }); await pauza(400);
    await clicText(pg, X, /^Tab Color$/); await pauza(400);
    await clicText(pg, X, /^Yellow$/); await pauza(300);
    await clic(pg, '#chk'); await pauza(500);
    const are = await clic(pg, '#nav #reveal');
    out(are, 'VIII Î2: după două greșeli apare „Arată-mi răspunsul” și l-am apăsat');
    const f = await asteaptaRaspuns(pg);
    await pauza(600);
    const s1 = await stX();
    const teste = await pg.evaluate(() => { const e = document.querySelector('.rel-teste'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; });
    const img = await ecran(pg, 'viii_l03_q2_arata');
    console.log(`INFO VIII Î2 text: ${f.slice(0, 500)}`);
    console.log(`INFO VIII Î2 foi=${JSON.stringify(s1.foi)} culori=${JSON.stringify(s1.culori_file)} teste="${teste.slice(0, 160)}" captura=${img}`);
    out(!/registru nou, salvare în Documente/.test(f), 'VIII Î2 (1): textul nu mai spune pașii altui exercițiu („registru nou, salvare în Documente…”)');
    // (2) textul (cu „why” al lecției: „Zilele sunt în ordine, iar Luni se vede de departe”) afirmă foile în ordine și Luni colorat
    const n = numarTeste(teste);
    out(JSON.stringify(s1.foi) === JSON.stringify(['Luni', 'Marți', 'Miercuri']), 'VIII Î2 (2): „Zilele sunt în ordine” e adevărat: foile sunt Luni, Marți, Miercuri', JSON.stringify(s1.foi));
    out(s1.culori_file && String(s1.culori_file.Luni || '').toUpperCase() === '#FFFF00', 'VIII Î2 (2): fila Luni e galbenă (#FFFF00)', JSON.stringify(s1.culori_file));
    const mTrec = /trec acum \((\d+) din (\d+)\)/.exec(f);
    out(!!n && n[0] === n[1] && n[1] === 2 && (!mTrec || (+mTrec[1] === n[0] && +mTrec[2] === n[1])), 'VIII Î2 (2): testele de sub Excel trec toate (cum spune textul)', teste.slice(0, 120));
    const urm = await vizibil(pg, '#nav #next');
    out(!!urm && /Mai departe/.test(await urm.innerText()), 'VIII Î2 (3): „Mai departe” e vizibil');
    // Î3 (adevărat/fals, răspunsul Fals), apoi Î4 și Î5 (registru): același text fals apărea și acolo (poarta_lectii.md)
    await clic(pg, '#next'); await pauza(500);
    await clic(pg, '#body .opt[data-k="1"]'); await pauza(300);
    for (const [q, nTeste] of [['Î4', 2], ['Î5', 2]]) {
      await clic(pg, '#next'); await pauza(500);
      await pg.waitForSelector(X, { timeout: 20000 }); await pauza(900);
      await clic(pg, '#chk'); await pauza(400); await clic(pg, '#chk'); await pauza(400);   // două „Verifică” fără nimic făcut
      out(await clic(pg, '#nav #reveal'), `VIII ${q}: după două greșeli apare „Arată-mi răspunsul” și l-am apăsat`);
      const fq = await asteaptaRaspuns(pg); await pauza(500);
      const tq = await pg.evaluate(() => { const e = document.querySelector('.rel-teste'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; });
      const sq = await stX();
      await ecran(pg, `viii_l03_${q === 'Î4' ? 'q4' : 'q5'}_arata`);
      console.log(`INFO VIII ${q} text: ${fq.slice(0, 500)}`);
      console.log(`INFO VIII ${q} teste="${tq.slice(0, 200)}" registru=${sq.registru_activ} fisiere=${JSON.stringify(sq.fisiere).slice(0, 200)}`);
      out(!/registru nou, salvare în Documente/.test(fq), `VIII ${q} (1): textul nu mai spune pașii altui exercițiu`);
      const nq = numarTeste(tq), mq = /trec acum \((\d+) din (\d+)\)/.exec(fq);
      if (mq) out(!!nq && +mq[1] === nq[0] && +mq[2] === nq[1] && nq[0] === nq[1] && nq[1] === nTeste, `VIII ${q} (2): textul spune că testele trec și chiar trec`, tq.slice(0, 160));
      else out(!/am făcut eu pașii/.test(fq) && /fă tu pașii|Fă-i tu/.test(fq), `VIII ${q} (2): fără pașii făcuți, textul nu afirmă nimic despre fereastră și îi cere elevului pașii`, fq.slice(0, 160));
      out(!!mq, `VIII ${q}: „Arată-mi răspunsul” a făcut pașii în fereastră (varianta a)`, tq.slice(0, 120));
      const uq = await vizibil(pg, '#nav #next');
      out(!!uq, `VIII ${q} (3): butonul de mers mai departe e vizibil`, uq ? await uq.innerText() : '');
    }
    out(pg.erori.length === 0, 'VIII l03: nicio eroare de pagină', pg.erori.join(' | '));
  } catch (e) { out(false, 'VIII l03: proba a căzut', e.message); await ecran(pg, 'viii_l03_eroare').catch(() => {}); }
  await ctx.close();
}

/* ——— a VIII-a, m1-l03, pasul cu „închide și deschide din nou” (testul `redeschis`): varianta (b) — fereastra nu se atinge,
   textul spune pașii și nu afirmă nimic despre fereastră ——— */
async function excelL03Redeschis(br, base) {
  const { ctx, pg } = await pagina(br, base, '/lectii/viii/m1-l03/index.html');
  const erori = pg.erori;
  const X = '[data-lh-aplicatie="excel"]';
  const stX = () => pg.evaluate(() => { try { return window.LH.aplicatii.stare('excel'); } catch (e) { return {}; } });
  const pq = () => pg.evaluate(() => { const e = document.getElementById('pq') || document.querySelector('.q'); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; });
  try {
    let gasit = false;
    for (let k = 0; k < 12 && !gasit; k++) {
      const s = await stareMotor(pg); if (!s || s.phase !== 'learn') break;
      gasit = /Închide registrul și păstrează foaia/.test(await pq());
      if (!gasit && !await clic(pg, '#pas-next')) break;
      await pauza(400);
    }
    out(gasit, 'VIII pasul „închide și deschide din nou”: l-am găsit (Pasul următor)');
    if (gasit) {
      await pg.waitForSelector(X, { timeout: 20000 }); await pauza(900);
      await clic(pg, '#chk'); await pauza(400); await clic(pg, '#chk'); await pauza(400);
      const s0 = await stX();
      out(await clic(pg, '#nav #reveal'), 'VIII redeschis: după două greșeli apare „Arată-mi răspunsul” și l-am apăsat');
      const f = await asteaptaRaspuns(pg); await pauza(500);
      const s1 = await stX();
      const t = await pg.evaluate(() => { const e = document.querySelector('.rel-teste'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; });
      const img = await ecran(pg, 'viii_l03_redeschis_arata');
      console.log(`INFO VIII redeschis text: ${f.slice(0, 600)}`);
      console.log(`INFO VIII redeschis foi ${JSON.stringify(s0.foi)} -> ${JSON.stringify(s1.foi)} registru ${s0.registru_activ} -> ${s1.registru_activ} teste="${t.slice(0, 160)}" captura=${img}`);
      out(!/registru nou, salvare în Documente/.test(f), 'VIII redeschis (1): textul nu mai spune pașii altui exercițiu');
      out(!/am făcut eu pașii|trec acum/.test(f) && /fă tu pașii/.test(f), 'VIII redeschis (2): textul nu afirmă că pașii s-au făcut; îi cere elevului să-i facă', f.slice(0, 200));
      out(JSON.stringify(s0.foi) === JSON.stringify(s1.foi) && s0.registru_activ === s1.registru_activ, 'VIII redeschis (2): fereastra a rămas a elevului (aceleași foi, același registru)');
      out(/Ctrl\+W|Ctrl \+ W/.test(f) && /Ctrl\+O|Ctrl \+ O/.test(f), 'VIII redeschis: textul are pașii exercițiului de față (Ctrl+W, apoi Ctrl+O)');
      const urm = await vizibil(pg, '#pas-next') || await vizibil(pg, '#inca') || await vizibil(pg, '#next');
      out(!!urm, 'VIII redeschis (3): elevul poate merge mai departe (buton vizibil)', urm ? await urm.innerText() : '');
    }
    out(erori.length === 0, 'VIII redeschis: nicio eroare de pagină', erori.join(' | '));
  } catch (e) { out(false, 'VIII redeschis: proba a căzut', e.message); }
  await ctx.close();
}

/* ——— a V-a, m2-l09 (Explorer): pasul „mergi în Excursie” și atelierul ——— */
async function explorerL09(br, base) {
  const { ctx, pg } = await pagina(br, base, '/lectii/v/m2-l09/index.html');
  const EX = '[data-lh-aplicatie="explorer"]';
  const stE = () => pg.evaluate(() => { try { return window.LH.aplicatii.stare('explorer') || {}; } catch (e) { return {}; } });
  const testeEx = () => pg.evaluate(() => { const e = document.querySelector('.ae-teste'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; });
  const caseta = () => pg.evaluate(() => { const i = document.querySelector('#body .ae-in'); return i ? i.value : null; });
  const pq = () => pg.evaluate(() => { const e = document.getElementById('pq') || document.querySelector('.q'); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; });
  const rand = id => `${EX} .lh-ap-e-rand[data-lh-id=${css(id)}]`;
  const dublu = async id => { await pg.locator(rand(id)).first().dblclick(); await pauza(500); };
  async function asteaptaEx() { await pg.waitForSelector(EX, { timeout: 20000 }); await pauza(1500); }
  async function scrie(txt) { const i = pg.locator('#body .ae-in').first(); await i.click(); await pg.keyboard.press('Control+a'); await pg.keyboard.type(txt, { delay: 10 }); await pauza(200); }
  async function clicRandCuTip(nume, tip) {
    const L = pg.locator(`${EX} .lh-ap-e-rand`); const n = await L.count();
    for (let i = 0; i < n; i++) { const t = (await L.nth(i).innerText()).replace(/\s+/g, ' '); if (t.startsWith(nume) && t.includes(tip)) { await L.nth(i).click(); await pauza(400); return true; } }
    return false;
  }
  async function clicBaraAdresa() { const b = await pg.locator(`${EX} .lh-ap-e-adr`).first().boundingBox(); await pg.mouse.click(b.x + b.width - 12, b.y + b.height / 2); await pauza(400); await pg.keyboard.press('Escape'); await pauza(200); }
  const inainte = async () => { const x = await vizibil(pg, '#pas-next') || await vizibil(pg, '#inca') || await vizibil(pg, '#next'); return x ? (await x.innerText()).trim() : null; };
  let facutPas = false, facutAtelier = false;
  try {
    for (let pas = 0; pas < 25; pas++) {
      const s = await stareMotor(pg);
      if (!s || s.phase === 'q') break;
      const q = await pq();
      if (s.phase === 'learn' && /folderul Excursie/.test(q) && !facutPas) {
        facutPas = true;
        await asteaptaEx();
        await clic(pg, '#nav #chk'); await pauza(500);                  // greșeala 1: nimic făcut
        await dublu('E:'); await dublu('Scoala');                        // greșeala 2: a intrat în alt folder
        await clic(pg, '#nav #chk'); await pauza(500);
        const are = await clic(pg, '#nav #reveal');
        out(are, 'V pasul Excursie: după două greșeli apare „Arată-mi răspunsul” și l-am apăsat');
        const f = await asteaptaRaspuns(pg); await pauza(500);
        const st = await stE(), t = await testeEx(), n = numarTeste(t);
        const img = await ecran(pg, 'v_l09_pas_excursie_arata');
        await pg.locator(EX).first().screenshot({ path: path.join(IMG, `${VECHI ? 'vechi_' : ''}v_l09_pas_excursie_arata_explorer.png`) }).catch(() => {});
        console.log(`INFO V Excursie text: ${f.slice(0, 500)}`);
        console.log(`INFO V Excursie cale=${st.cale_curenta} teste="${t.slice(0, 160)}" captura=${img}`);
        out(!/acum trec toate/.test(f), 'V Excursie (1): textul nu mai spune „acum trec toate” fără acoperire');
        out(st.cale_curenta === 'E:/Excursie/', 'V Excursie (2): „acum ești în Excursie” (why) e adevărat: Explorer e în E:/Excursie/', st.cale_curenta);
        const mTrec = /trec acum \((\d+) din (\d+)\)/.exec(f);
        out(!!n && n[0] === n[1] && (!mTrec || (+mTrec[1] === n[0] && +mTrec[2] === n[1])), 'V Excursie (2): testele de sub Explorer trec toate, cum spune textul', t.slice(0, 120));
        const urm = await inainte();
        out(!!urm, 'V Excursie (3): elevul poate merge mai departe (buton vizibil)', urm);
      } else if (s.phase === 'atelier' && !facutAtelier) {
        facutAtelier = true;
        await asteaptaEx();
        await dublu('E:'); await dublu('Scoala'); await dublu('TIC');
        await clicRandCuTip('afis', 'PNG');
        await clicBaraAdresa();
        await scrie('E:\\Scoala\\TIC\\afis'); await clic(pg, '#nav #chk'); await pauza(500);
        await scrie('E:\\Scoala\\afis.png'); await clic(pg, '#nav #chk'); await pauza(500);
        const are = await clic(pg, '#nav #reveal');
        out(are, 'V atelier: după două căi greșite apare „Arată-mi răspunsul” și l-am apăsat');
        const f = await asteaptaRaspuns(pg); await pauza(500);
        const st = await stE(), t = await testeEx(), n = numarTeste(t), c = await caseta();
        const img = await ecran(pg, 'v_l09_atelier_arata');
        await pg.locator(EX).first().screenshot({ path: path.join(IMG, `${VECHI ? 'vechi_' : ''}v_l09_atelier_arata_explorer.png`) }).catch(() => {});
        console.log(`INFO V atelier text: ${f.slice(0, 600)}`);
        console.log(`INFO V atelier cale=${st.cale_curenta} sel=${JSON.stringify(st.selectie)} caseta=${c} teste="${t.slice(0, 200)}" captura=${img}`);
        out(!/poza e selectată, iar în casetă e calea/.test(f) || c === 'E:\\Scoala\\TIC\\afis.png', 'V atelier (1): textul nu mai spune „în casetă e calea …” cu altă cale în casetă', c);
        if (/E:\\Scoala\\TIC\\afis\.png/.test(f) && /casetă/.test(f)) out(c === 'E:\\Scoala\\TIC\\afis.png', 'V atelier (2): caseta are calea pe care o spune textul', c);
        out(c === 'E:\\Scoala\\TIC\\afis.png', 'V atelier (2): în casetă e calea corectă E:\\Scoala\\TIC\\afis.png', c);
        out((st.selectie || []).indexOf('afis.png') >= 0 && st.cale_curenta === 'E:/Scoala/TIC/', 'V atelier (2): Explorer e în TIC, cu afis.png selectat', `${st.cale_curenta} ${JSON.stringify(st.selectie)}`);
        const mTrec = /trec acum \((\d+) din (\d+)\)/.exec(f);
        out(!!n && n[0] === n[1] && n[1] === 3 && (!mTrec || (+mTrec[1] === n[0] && +mTrec[2] === n[1])), 'V atelier (2): testele de sub Explorer trec toate (3 din 3)', t.slice(0, 160));
        const urm = await inainte();
        out(!!urm, 'V atelier (3): elevul poate merge mai departe (buton vizibil)', urm);
        break;
      }
      if (!await clic(pg, '#pas-next')) { if (!await clic(pg, '#go')) break; }
      await pauza(500);
    }
    out(facutPas, 'V l09: am ajuns la pasul „mergi în Excursie”');
    out(facutAtelier, 'V l09: am ajuns la atelier');
    out(pg.erori.length === 0, 'V l09: nicio eroare de pagină', pg.erori.join(' | '));
  } catch (e) { out(false, 'V l09: proba a căzut', e.message); await ecran(pg, 'v_l09_eroare').catch(() => {}); }
  await ctx.close();
}

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const br = await chromium.launch({ channel: 'chrome', headless: true });
try {
  console.log(`INFO adaptoare: ${VECHI ? 'din ' + REF + ' (vechi)' : 'din dosar'}`);
  await excelL03(br, base);
  await excelL03Redeschis(br, base);
  await explorerL09(br, base);
} finally { await br.close(); srv.close(); }
console.log(nFail);
process.exit(0);
