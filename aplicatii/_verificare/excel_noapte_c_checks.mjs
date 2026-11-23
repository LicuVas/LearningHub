// Verificari proprii ale constructorului de pe banda c (noaptea Excel 22-23.11, runda 4c: foi, selectie, bara de taste, salvare),
// dupa modelul excel_noapte_checks.mjs: drumurile despre care raportul spune ca merg, altele decat cele jucate de probele de paritate.
// Constructorii urmatori ADAUGA verificari la sfarsitul listei VERIFICARI, fara sa le rescrie pe cele de dinainte.
// Rulare:  node aplicatii/_verificare/excel_noapte_c_checks.mjs   (din orice director; intra singur in excel_paritate.mjs --regres)
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

// ---------------------------------------------------------------- banda c (runda 4c): foi, selecție, bara de taste, salvare
const fila = (p, n) => p.locator(`${APP} [data-lh-tinta="fila_foii"][data-lh-id="${n}"]`);
const foi = async h => (await h.st()).foi;
const dlg = async h => j((await h.st()).dialog || '');
async function meniuFila(p, h, n, rand) {
  await fila(p, n).first().click({ button: 'right' }); await pauza(250);
  return h.clicEt(rand);
}
const VERIFICARI = [
  { nume: 'c4 foaie: + apoi Shift+F11 (inainte), Ctrl+Z scoate foaia, Ctrl+Y o pune la loc; numele urmator creste (Sheet4)', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).click(); await pauza(200);
    await h.cel('B2'); await p.keyboard.press('Shift+F11'); await pauza(200);
    const a = await foi(h);
    await p.keyboard.press('Control+z'); await pauza(200);
    const b = await foi(h);
    await p.keyboard.press('Control+y'); await pauza(200);
    const c = await foi(h);
    await p.keyboard.press('Control+z'); await pauza(200);
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).click(); await pauza(200);
    const d = await foi(h);
    return { ok: j(a) === j(['Sheet1', 'Sheet3', 'Sheet2']) && j(b) === j(['Sheet1', 'Sheet2']) && j(c) === j(a) && d.includes('Sheet4') && !d.includes('Sheet3'),
      det: `dupa Shift+F11 ${j(a)}; Ctrl+Z ${j(b)}; Ctrl+Y ${j(c)}; Ctrl+Z si + ${j(d)}` };
  } },
  { nume: "c4 redenumire: No'te ramane No'te; „history” mic = mesajul rezervat, dupa OK caseta revine, Esc pastreaza numele; Ctrl+Z / Ctrl+Y", fn: async (p, h) => {
    await fila(p, 'Sheet1').dblclick(); await pauza(200);
    await p.keyboard.press('Control+a'); await p.keyboard.type("No'te"); await p.keyboard.press('Enter'); await pauza(700);
    const n1 = (await foi(h))[0];
    await fila(p, n1).dblclick(); await pauza(200);
    await p.keyboard.press('Control+a'); await p.keyboard.type('history'); await p.keyboard.press('Enter'); await pauza(200);
    const m = await dlg(h);
    await h.clicEt('OK', 'Button'); await pauza(250);
    const inCaseta = await p.evaluate(() => { const a = document.activeElement; return a && a.classList.contains('lh-ap-x-ff-in') ? a.value : null; });
    await p.keyboard.press('Escape'); await pauza(150);
    const n2 = (await foi(h))[0];
    await h.cel('C3'); await p.keyboard.press('Control+z'); await pauza(200);
    const n3 = (await foi(h))[0];
    await p.keyboard.press('Control+y'); await pauza(200);
    const n4 = (await foi(h))[0];
    return { ok: n1 === "No'te" && /reserved name/.test(m) && inCaseta === 'history' && n2 === "No'te" && n3 === 'Sheet1' && n4 === "No'te",
      det: `No'te → ${j(n1)}; history → ${j(m.slice(0, 60))}, caseta dupa OK ${j(inCaseta)}; dupa Esc ${j(n2)}; Ctrl+Z ${j(n3)}; Ctrl+Y ${j(n4)}` };
  } },
  { nume: 'c4 Hide: foaia din mijloc → activa cea din dreapta; Ctrl+PageDown sare peste ea; ultima vizibila refuzata; Unhide... gri fara foi ascunse; Ctrl+Z o reafiseaza', fn: async (p, h) => {
    const add = () => p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).click();
    await add(); await pauza(150); await add(); await pauza(150);
    await fila(p, 'Sheet1').first().click(); await pauza(150);
    await meniuFila(p, h, 'Sheet1', 'Unhide...');
    const griDlg = await dlg(h);
    await fila(p, 'Sheet2').first().click(); await pauza(150);
    await meniuFila(p, h, 'Sheet2', 'Hide'); await pauza(150);
    const s1 = await h.st();
    await fila(p, 'Sheet1').first().click(); await pauza(150);
    await h.cel('B2'); await p.keyboard.press('Control+PageDown'); await pauza(200);
    const s2 = await h.st();
    await meniuFila(p, h, 'Sheet3', 'Hide'); await pauza(150);
    await meniuFila(p, h, 'Sheet1', 'Hide'); await pauza(200);
    const m = await dlg(h);
    await h.clicEt('OK', 'Button'); await pauza(150);
    await h.cel('B2'); await p.keyboard.press('Control+z'); await pauza(200);
    const s3 = await h.st();
    return { ok: griDlg === '""' && s1.foaie_activa === 'Sheet3' && j(s1.foi_ascunse) === '["Sheet2"]' && s2.foaie_activa === 'Sheet3' && /at least one visible worksheet/.test(m) && j(s3.foi_ascunse) === '["Sheet2"]' && (await fila(p, 'Sheet3').count()) === 1,
      det: `Unhide fara ascunse: dialog=${griDlg}; Hide Sheet2 → activa ${s1.foaie_activa}, ascunse ${j(s1.foi_ascunse)}; Ctrl+PageDown din Sheet1 → ${s2.foaie_activa}; ultima vizibila: ${j(m.slice(0, 60))}; Ctrl+Z → ascunse ${j(s3.foi_ascunse)}` };
  } },
  { nume: 'c4 Move or Copy › (move to end) + Ctrl+Z / Ctrl+Y; Insert... › Chart = mesajul nesimulat, Cancel nu face nimic', fn: async (p, h) => {
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).click(); await pauza(150);
    await fila(p, 'Sheet1').first().click(); await pauza(150);
    await meniuFila(p, h, 'Sheet1', 'Move or Copy...'); await pauza(200);
    await h.clicEt('(move to end)'); await h.clicEt('OK', 'Button'); await pauza(250);
    const a = await foi(h);
    await h.cel('B2'); await p.keyboard.press('Control+z'); await pauza(200);
    const b = await foi(h);
    await p.keyboard.press('Control+y'); await pauza(200);
    const c = await foi(h);
    await meniuFila(p, h, 'Sheet2', 'Insert...'); await pauza(200);
    await h.clicEt('Cancel', 'Button'); await pauza(200);
    const d = await foi(h);
    await meniuFila(p, h, 'Sheet2', 'Insert...'); await pauza(200);
    await h.clicEt('Chart'); await h.clicEt('OK', 'Button'); await pauza(250);
    const ns = await p.evaluate(() => document.body.innerText.includes('nu e simulat') || document.body.innerText.includes('aici nu e simulată'));
    const e = await foi(h);
    return { ok: j(a) === '["Sheet2","Sheet1"]' && j(b) === '["Sheet1","Sheet2"]' && j(c) === j(a) && j(d) === j(a) && j(e) === j(a) && ns,
      det: `move to end ${j(a)}; Ctrl+Z ${j(b)}; Ctrl+Y ${j(c)}; Insert Cancel ${j(d)}; Insert Chart ${j(e)}, mesaj nesimulat ${ns}` };
  } },
  { nume: 'c4 Save this file: Choose a Location › Desktop › Save; Save your changes (✕ din titlu) › Descarcari › Save; semnele: mesajul dispare cand le scoti', fn: async (p, h) => {
    await h.scrie('F2', '5');
    await p.keyboard.press('Control+s'); await pauza(400);
    await p.locator(`${APP} [data-lh-tinta="camp:Choose a Location"]`).first().click(); await pauza(200);
    await h.clicEt('Desktop'); await pauza(150);
    const caseta = await p.locator(`${APP} [data-lh-tinta="camp:Choose a Location"]`).first().getAttribute('aria-label');
    const inp = p.locator(`${APP} [data-lh-tinta="camp:nume_fisier"] input`).first();
    await inp.click(); await p.keyboard.press('Control+a'); await p.keyboard.type('tema:1');
    await p.locator(`${APP} [data-lh-tinta="dialog_salvare:Save"]`).first().click(); await pauza(250);
    const cuMesaj = await p.locator(`${APP} .lh-ap-x-mesaj-nume`).count();
    await inp.click(); await p.keyboard.press('End'); await p.keyboard.press('ArrowLeft'); await p.keyboard.press('Backspace'); await pauza(100);
    const faraMesaj = await p.locator(`${APP} .lh-ap-x-mesaj-nume`).count();
    await p.locator(`${APP} [data-lh-tinta="dialog_salvare:Save"]`).first().click(); await pauza(300);
    const s1 = await h.st();
    await h.scrie('F3', '6');
    await p.locator(`${APP} [data-lh-tinta="bara_titlu:Close"]`).first().click(); await pauza(300);
    const intreb = await dlg(h);
    await p.locator(`${APP} [data-lh-tinta="fereastra:Save"]:visible`).first().click(); await pauza(300);
    const s2 = await h.st();
    return { ok: /Desktop/.test(caseta || '') && cuMesaj === 1 && faraMesaj === 0 && ((s1.fisiere || {}).Desktop || []).includes('tema1.xlsx') && s1.nume_fisier === 'tema1.xlsx' && /save your changes/i.test(intreb) && s2.registru_activ == null,
      det: `caseta ${j(caseta)}; mesaj cu „:” ${cuMesaj}, dupa stergere ${faraMesaj}; salvat ${j(s1.nume_fisier)} in ${j(s1.dosar_fisier)} (Desktop ${j((s1.fisiere || {}).Desktop)}); ✕ cu modificari → ${j(intreb.slice(0, 50))}; Save → registru_activ ${j(s2.registru_activ)}` };
  } },
  { nume: 'c4 atingere 390x844: bara de taste incape (nicio tasta in afara ecranului); Ctrl+PgDn / Ctrl+PgUp / Ctrl+N / Ctrl+W / F12 din bara', atingere: true, fn: async (p, h) => {
    const afara = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-ajutor="taste"] .lh-ap-x-tasta')].filter(b => { const r = b.getBoundingClientRect(); return r.right > window.innerWidth + 0.5 || r.left < -0.5 || r.bottom > window.innerHeight + 0.5; }).map(b => b.textContent));
    const n = await p.locator(`${APP} [data-lh-ajutor="taste"] .lh-ap-x-tasta`).count();
    const tasta = async et => { await p.locator(`${APP} [data-lh-ajutor="taste"] [data-lh-eticheta="${et}"]`).first().tap(); await pauza(250); };
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).first().tap(); await pauza(200);
    await tasta('Ctrl+PgUp'); const a = (await h.st()).foaie_activa;
    await tasta('Ctrl+PgDn'); const b = (await h.st()).foaie_activa;
    await tasta('Ctrl+N'); const r1 = (await h.st()).registre.length;
    await tasta('Ctrl+W'); const r2 = (await h.st()).registre.length;
    await tasta('F12'); const sa = await p.locator(`${APP} [data-lh-tinta="camp:nume_fisier"]`).count();
    return { ok: n >= 16 && !afara.length && a === 'Sheet1' && b === 'Sheet2' && r1 === 2 && r2 === 1 && sa > 0,
      det: `${n} taste, in afara ecranului: ${j(afara)}; Ctrl+PgUp → ${a}, Ctrl+PgDn → ${b}; Ctrl+N → ${r1} registre, Ctrl+W → ${r2}; F12 → Save As ${sa > 0}` };
  } },
  { nume: 'c4 atingere 390x844: cercul de selectie tras de pe B2 pe D5 = B2:D5 (activa B2); Name Box + Enter din bara', atingere: true, fn: async (p, h) => {
    await h.cel('B2'); await pauza(200);
    const m = await p.locator(`${APP} [data-lh-tinta="maner_selectie"]`).first().boundingBox();
    const d5 = await p.locator(`${APP} [data-lh-tinta="celula"][data-lh-id="D5"]`).first().boundingBox();
    if (!m || !d5) return { ok: false, det: `cercul ${j(m)}, D5 ${j(d5)}` };
    const cdp = await p.context().newCDPSession(p);
    const de = { x: m.x + m.width / 2, y: m.y + m.height / 2 }, la = { x: d5.x + d5.width / 2, y: d5.y + d5.height / 2 };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [de] }); await pauza(60);
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: de.x + (la.x - de.x) * i / 8, y: de.y + (la.y - de.y) * i / 8 }] }); await pauza(30); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pauza(250);
    const s = await h.st();
    const nb = p.locator(`${APP} [data-lh-tinta="camp:Name Box"]`).first();
    await nb.tap(); await pauza(100); await p.keyboard.press('Control+A'); await p.keyboard.type('F7');
    await p.locator(`${APP} [data-lh-ajutor="taste"] [data-lh-eticheta="Enter"]`).first().tap(); await pauza(250);
    const s2 = await h.st();
    return { ok: s.selectie.zona === 'B2:D5' && s.selectie.activa === 'B2' && s2.selectie.activa === 'F7',
      det: `cercul tras pe D5 → ${j(s.selectie.zona)} activa ${s.selectie.activa}; Name Box F7 + Enter din bara → ${s2.selectie.activa}` };
  } },
  { nume: 'c4 calculator: fara cerc de selectie; numarul unui rand dintr-o imbinare verticala (A3:A5) alege 3:5; zoomul ramane pe foaie la Ctrl+PageDown', fn: async (p, h) => {
    await h.cel('B2');
    const cerc = await p.locator(`${APP} [data-lh-tinta="maner_selectie"]:visible`).count();
    const nb = p.locator(`${APP} [data-lh-tinta="camp:Name Box"]`).first();
    await nb.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('H3:H5'); await p.keyboard.press('Enter'); await pauza(150);
    await h.mso('MergeCenter'); await pauza(200);
    await h.antetRand(4); const z = (await h.st()).selectie.zona;
    await p.locator(`${APP} [data-lh-tinta="zoom:Zoom In"]`).first().click(); await pauza(150);
    await p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`).click(); await pauza(200);
    const z2 = (await h.st()).zoom;
    await h.cel('B2'); await p.keyboard.press('Control+PageUp'); await pauza(200);
    const z1 = (await h.st()).zoom;
    return { ok: cerc === 0 && z === '3:5' && z1 === 110 && z2 === 100, det: `cerc pe calculator: ${cerc}; clic pe 4 cu H3:H5 imbinat → ${j(z)}; zoom foaia noua ${z2}, Sheet1 ${z1}` };
  } },
  { nume: 'c4 file: tastatura (→ muta focusul, Enter alege); 16 foi: Ctrl+PageDown pana la ultima o aduce la vedere; ‹ dupa ce s-a derulat', fn: async (p, h) => {
    const add = p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Add Sheet"]`);
    for (let i = 0; i < 15; i++) { await add.click(); await pauza(60); }
    await h.cel('B2');
    for (let i = 0; i < 15; i++) { await p.keyboard.press('Control+PageUp'); await pauza(40); }
    const vazuta = async n => { const l = fila(p, n); if (!(await l.count())) return false; const b = await l.first().boundingBox(); if (!b) return false; return p.evaluate(([x, y, n]) => { const e = document.elementFromPoint(x, y); const f = e && e.closest('[data-lh-tinta="fila_foii"]'); return !!f && f.getAttribute('data-lh-id') === n; }, [b.x + b.width / 2, b.y + b.height / 2, n]); };
    const v16a = await vazuta('Sheet16');
    await h.cel('B2');
    for (let i = 0; i < 15; i++) { await p.keyboard.press('Control+PageDown'); await pauza(40); }
    const s = await h.st(), v16 = await vazuta('Sheet16'), v1 = await vazuta('Sheet1');
    const st = p.locator(`${APP} [data-lh-tinta="fila_foii_buton:Scroll Left"]`).first();
    const stGri = await st.getAttribute('aria-disabled');
    await fila(p, 'Sheet16').first().focus(); await p.keyboard.press('ArrowLeft'); await pauza(100);
    const foc = await p.evaluate(() => { const a = document.activeElement; return a && a.getAttribute('data-lh-id'); });
    await p.keyboard.press('Enter'); await pauza(150);
    const s2 = await h.st();
    return { ok: !v16a && s.foaie_activa === 'Sheet16' && v16 && !v1 && stGri !== 'true' && foc === 'Sheet15' && s2.foaie_activa === 'Sheet15',
      det: `Sheet16 vazuta la inceput ${v16a}; dupa 15 × Ctrl+PageDown activa ${s.foaie_activa}, vazuta ${v16}, Sheet1 vazuta ${v1}; ‹ gri ${stGri}; ← pe fila → focus ${foc}, Enter → ${s2.foaie_activa}` };
  } },
  { nume: 'c4 atingere 390x844: bara de taste are cel mult doua randuri (altfel grila scade si sirul filelor acopera cercul ⇕ al randului 4)', atingere: true, fn: async (p) => {
    const r = await p.evaluate(() => { const bs = [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-ajutor="taste"] .lh-ap-x-tasta')]; const ys = new Set(bs.map(b => Math.round(b.getBoundingClientRect().top))); const bar = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-ajutor="taste"]'); return { randuri: ys.size, h: bar ? Math.round(bar.getBoundingClientRect().height) : null }; });
    return { ok: r.randuri <= 2 && r.h != null && r.h <= 72, det: `randuri ${r.randuri}, inaltimea barei ${r.h} px` };
  } },
];
async function apasaTinta(p, tinta) { await p.locator(`${APP} [data-lh-tinta="${tinta}"]:visible`).first().click(); await pauza(250); }

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    // NOAPTE_FILTRU=<prefix> ruleaza doar verificarile al caror nume incepe asa (fara variabila: toate, ca in --regres)
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
