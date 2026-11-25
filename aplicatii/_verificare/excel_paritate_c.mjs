// Probe de paritate Excel, felia c (noaptea 22.11.2026): IF si erorile formulei, editare, copiere / mutare / stergere,
// foi, imbinari, borduri. Felia: _campaign/aplicatii_fidele_2026_11/runde/noapte_excel_22_11/felii/felie_c.json (41 randuri).
// Fiecare proba joaca gestul ca un elev (clicuri si taste reale prin Playwright, pe elemente vizibile, cautate dupa
// eticheta din Excelul real: data-lh-eticheta / data-lh-tinta / data-lh-id-mso) si verifica REZULTATUL pe ecran si in
// LH.aplicatii.stare('excel'). Tinta = Excelul adevarat (interfata EN, setari regionale RO: virgula zecimala, ; intre
// argumente); unde simulatorul vechi difera, castiga Excelul si proba are un comentariu de un rand.
// Rulare:  node C:/00/Projects/LearningHub_fidel/aplicatii/_verificare/excel_paritate_c.mjs
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: PASS / FAIL / SKIP <id> <nume> - <ce a vazut>; la final REZUMAT, apoi „TOTAL FAIL”, apoi DOAR numarul de FAIL.
// Totul headless; reteaua e taiata in afara lui 127.0.0.1 / localhost (regula 24 din 05_STANDARD_LECTIE.md).
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
const LIMITA_PROBA = 20000;
const APP = '[data-lh-aplicatie="excel"]';

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

const rezultate = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, id, nume, detalii) {
  rezultate[stare]++;
  console.log(`${stare} ${id} ${nume}${detalii ? ' - ' + String(detalii).replace(/\s+/g, ' ').slice(0, 400) : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const j = v => JSON.stringify(v);

// ---------------------------------------------------------------- unelte (doar gesturi reale + citirea ecranului / starii)
function unelte(p, base, atingere) {
  let ultimClic = { cheie: '', t: 0 };
  const h = {};
  // clic real pe un element; doua clicuri pe acelasi loc la < 500 ms ar fi dublu clic: asteptam
  h.clicLoc = async (loc, cheie, opt = {}) => {
    if (cheie && cheie === ultimClic.cheie && Date.now() - ultimClic.t < 650) await pauza(650 - (Date.now() - ultimClic.t));
    if ((await loc.count()) === 0) throw new Error('nu exista pe ecran: ' + cheie);
    if (atingere && !opt.button) await loc.first().tap({ modifiers: opt.modifiers });
    else await loc.first().click(opt);
    ultimClic = { cheie, t: Date.now() };
  };
  h.celula = a => p.locator(`${APP} [data-lh-tinta="celula"][data-lh-id="${a}"]`);
  h.clic = (a, opt) => h.clicLoc(h.celula(a), 'celula:' + a, opt);
  h.scrie = async (a, text) => { await h.clic(a); await p.keyboard.type(text); await p.keyboard.press('Enter'); await pauza(120); };
  h.sel = async (a, b) => {
    await h.clic(a);
    await h.clicLoc(h.celula(b), 'celula:' + b, { modifiers: ['Shift'] });
    await pauza(80);
    const z = (await h.st()).selectie.zona;
    if (z !== `${a}:${b}`) throw new Error(`selectia ${a}:${b} prin Shift+clic nu s-a facut (zona=${z})`);
  };
  h.st = () => p.evaluate(() => window.LH.aplicatii.stare('excel'));
  h.c = async a => ((await h.st()).celule || {})[a];
  h.v = async a => { const c = await h.c(a); return c ? c.valoare : undefined; };
  h.fmt = async a => ((await h.st()).format_celule || {})[a] || {};
  h.fx = () => p.locator(`${APP} input[aria-label="Formula Bar"]`).first().inputValue();
  h.mso = (id, opt) => h.clicLoc(p.locator(`${APP} [data-lh-id-mso="${id}"]:visible`), 'mso:' + id, opt);
  h.tinta = (t, opt) => h.clicLoc(p.locator(`${APP} [data-lh-tinta="${t}"]:visible`), t, opt);
  h.antetRand = (n, opt) => h.clicLoc(p.locator(`${APP} [data-lh-tinta="antet_rand"][data-lh-id="${n}"]`), 'antet_rand:' + n, opt);
  h.antetCol = (l, opt) => h.clicLoc(p.locator(`${APP} [data-lh-tinta="antet_coloana"][data-lh-id="${l}"]`), 'antet_coloana:' + l, opt);
  h.fila = n => p.locator(`${APP} [data-lh-tinta="fila_foii"][data-lh-id="${n}"]`);
  // un rand de meniu / lista deschisa, dupa eticheta din Excel; clic (sau atingere) in mijlocul lui
  h.meniu = async et => {
    const r = await p.evaluate(et => {
      const viz = e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden'; };
      const cand = [...document.querySelectorAll(`[data-lh-aplicatie="excel"] [data-lh-tinta="meniu:${CSS.escape(et)}"]`)]
        .concat([...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-eticheta]')].filter(e => e.getAttribute('data-lh-eticheta') === et && /MenuItem|ListItem|RadioButton|Button|CheckBox/.test(e.getAttribute('data-lh-tip') || '')));
      const e = cand.find(viz);
      if (!e) return null;
      e.scrollIntoView({ block: 'nearest' });
      const b = e.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }, et);
    if (!r) return false;
    if (atingere) await p.touchscreen.tap(r.x, r.y); else await p.mouse.click(r.x, r.y);
    ultimClic = { cheie: 'meniu:' + et, t: Date.now() };
    await pauza(150);
    return true;
  };
  // un buton / optiune din fereastra deschisa (Delete, Insert, mesajele)
  h.fereastra = async et => {
    const r = await p.evaluate(et => {
      const viz = e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden'; };
      const cand = [...document.querySelectorAll(`[data-lh-tinta="fereastra:${CSS.escape(et)}"]`)]
        .concat([...document.querySelectorAll('[data-lh-tip="Window"] [data-lh-eticheta], [role="dialog"] [data-lh-eticheta]')].filter(e => e.getAttribute('data-lh-eticheta') === et))
        .concat([...document.querySelectorAll('[data-lh-tip="Window"] button, [data-lh-tip="Window"] [role="button"], [data-lh-tip="Window"] [role="option"], [role="dialog"] button')].filter(e => (e.innerText || '').trim() === et));
      const e = cand.find(viz);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }, et);
    if (!r) return false;
    await p.mouse.click(r.x, r.y);
    await pauza(150);
    return true;
  };
  // textul ferestrelor de mesaj vizibile (nu si mesajul „aici nu e simulata”) + ce spune starea despre ele
  h.mesaj = () => p.evaluate(() => {
    const viz = e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden'; };
    const parti = [];
    document.querySelectorAll('[data-lh-tip="Window"], [role="dialog"], [role="alertdialog"]').forEach(e => { if (viz(e) && !e.closest('[data-lh-nesimulat]')) parti.push(e.innerText || ''); });
    let s = null; try { s = window.LH.aplicatii.stare('excel'); } catch (e) { /* */ }
    if (s && s.fereastra_mesaj) parti.push((s.fereastra_mesaj.titlu || '') + ' ' + (s.fereastra_mesaj.texte || []).join(' '));
    if (s && s.dialog) parti.push((s.dialog.titlu || '') + ' ' + (s.dialog.intrebare || ''));
    return parti.join(' | ').replace(/\s+/g, ' ').trim();
  });
  h.nesimulat = () => p.evaluate(() => [...document.querySelectorAll('[data-lh-nesimulat]')].filter(e => e.getBoundingClientRect().width > 0).map(e => '„' + e.getAttribute('data-lh-nesimulat') + '” nesimulat').join('; '));
  // marginea punctata a copierii (ce vede elevul): un element vizibil din grila, cu chenar punctat sau animat
  h.furnici = () => p.evaluate(() => {
    const z = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-zona]');
    if (!z) return false;
    for (const e of z.querySelectorAll('*')) {
      const b = e.getBoundingClientRect(); if (b.width === 0 || b.height === 0) continue;
      const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (/dashed|dotted/.test(cs.borderTopStyle + ' ' + cs.outlineStyle) || (cs.animationName && cs.animationName !== 'none')) return true;
    }
    return false;
  });
  // copierea e oprita = nu mai e margine punctata SI Ctrl+V pe o celula goala nu mai lipeste nimic (ca in Excel)
  h.copiereOprita = async tinta => {
    const f = await h.furnici();
    await h.clic(tinta); await p.keyboard.press('Control+v'); await pauza(200);
    const v = await h.v(tinta);
    return { ok: !f && (v === undefined || v === ''), det: `margine punctata=${f}, Ctrl+V pe ${tinta} -> ${v === undefined ? 'gol' : j(v)}` };
  };
  h.inchideFereastra = async () => { for (const b of ['OK', 'No', 'Cancel']) if (await h.fereastra(b)) break; await p.keyboard.press('Escape'); await pauza(120); };
  h.reincarca = async () => { await deschide(p, base); ultimClic = { cheie: '', t: 0 }; };
  return h;
}

async function deschide(p, base) {
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(APP, { timeout: 15000 });
  await p.waitForFunction(() => { try { const s = window.LH.aplicatii.stare('excel'); return !!(s && s.celule && s.celule.A1); } catch (e) { return false; } }, null, { timeout: 15000 });
  await pauza(350);
}

// formula primita = are formula in stare si nu mai e in editare
const primita = c => !!(c && c.formula && !c.editare);
const RE_PROBLEMA = /There.s a problem with this formula/i;
const RE_TYPO = /We found a typo/i;

// ---------------------------------------------------------------- probele (in ordinea din felie)
const PROBE = [
  { id: 'excel-a-F145', nume: 'Bara de formule arata valoarea din spatele formatului (12,5% sub 13%, data, 7,125 sub 7,13)', fn: async (p, h) => {
    await h.scrie('F12', '0,125');
    await h.clic('F12'); await h.mso('PercentStyle'); await pauza(150);
    const t12 = (await h.c('F12') || {}).text;
    await h.clic('H12'); await h.clic('F12'); await pauza(100);
    const fxP = await h.fx();
    await h.scrie('F14', '27.09.2026');
    await h.clic('F14'); await pauza(100);
    const fxD = await h.fx();
    await h.scrie('F13', '7,125');
    await h.clic('F13'); await h.mso('DecimalsDecrease'); await pauza(150);
    const t13 = (await h.c('F13') || {}).text;
    await h.clic('H13'); await h.clic('F13'); await pauza(100);
    const fxN = await h.fx();
    // partea 7,13 se poate proba doar daca Decrease Decimal exista (randul lui e in felia e); altfel o notam, fara verdict
    const parteaN = t13 === '7,13' ? fxN === '7,125' : null;
    const ok = t12 === '13%' && /^12[,.]5%$/.test(fxP) && fxD === '27.09.2026' && parteaN !== false;
    return { ok, det: `celula 13%: text=${j(t12)}, bara=${j(fxP)} (asteptat 12,5%); data: bara=${j(fxD)}; 7,125 dupa Decrease Decimal: text=${j(t13)}, bara=${j(fxN)}${parteaN === null ? ' (Decrease Decimal nu da 7,13 - parte neprobata)' : ''}` };
  } },
  { id: 'excel-a-F122', nume: 'Merge & Center ▾ › Merge Across imbina fiecare rand separat', fn: async (p, h) => {
    await h.scrie('F6', 'a'); await h.scrie('F7', 'b');
    await h.sel('F6', 'G7');
    await h.mso('MergeCenterMenu_Dropdown'); await pauza(200);
    const are = await h.meniu('Merge Across');
    if (!are) return { ok: false, det: 'lista Merge & Center ▾ nu are randul Merge Across; ' + await h.nesimulat() };
    const f6 = await h.fmt('F6'), f7 = await h.fmt('F7');
    // in Excel, Merge Across nu centreaza (e Merge Cells pe fiecare rand)
    const ok = String(f6.imbinat) === 'F6:G6' && String(f7.imbinat) === 'F7:G7' && await h.v('F6') === 'a' && await h.v('F7') === 'b' && f6.aliniere !== 'centru';
    return { ok, det: `F6.imbinat=${j(f6.imbinat)} F7.imbinat=${j(f7.imbinat)} aliniere=${j(f6.aliniere)}` };
  } },
  { id: 'excel-a-F123', nume: 'Merge & Center ▾ › Merge Cells imbina fara sa centreze', fn: async (p, h) => {
    await h.scrie('F6', 'x');
    await h.sel('F6', 'G6');
    await h.mso('MergeCenterMenu_Dropdown'); await pauza(200);
    if (!await h.meniu('Merge Cells')) return { ok: false, det: 'lista Merge & Center ▾ nu are randul Merge Cells; ' + await h.nesimulat() };
    const f6 = await h.fmt('F6');
    const ok = String(f6.imbinat) === 'F6:G6' && f6.aliniere !== 'centru' && await h.v('F6') === 'x';
    return { ok, det: `F6.imbinat=${j(f6.imbinat)} aliniere=${j(f6.aliniere)}` };
  } },
  { id: 'excel-a-F124', nume: 'Merge & Center ▾ › Unmerge Cells desface imbinarea', fn: async (p, h) => {
    await h.scrie('F6', 'x');
    await h.sel('F6', 'G6');
    await h.mso('MergeCenter'); await pauza(150);
    const imb = (await h.fmt('F6')).imbinat;
    if (String(imb) !== 'F6:G6') return { ok: false, det: 'pregatirea: Merge & Center nu a imbinat F6:G6 (imbinat=' + j(imb) + ')' };
    await h.mso('MergeCenterMenu_Dropdown'); await pauza(200);
    if (!await h.meniu('Unmerge Cells')) return { ok: false, det: 'lista Merge & Center ▾ nu are randul Unmerge Cells; ' + await h.nesimulat() };
    const f6 = await h.fmt('F6'), g6 = await h.fmt('G6');
    const ok = !f6.imbinat && !g6.imbinat && await h.v('F6') === 'x';
    return { ok, det: `dupa Unmerge: F6.imbinat=${j(f6.imbinat)} G6.imbinat=${j(g6.imbinat)}` };
  } },
  { id: 'excel-a-F022', nume: 'Ctrl+Z / Ctrl+Y ajung la foaie si dupa clic pe Bold si dupa clic pe un buton al lectiei', fn: async (p, h) => {
    await h.clic('B2'); await h.mso('Bold'); await pauza(120);
    const b1 = !!(await h.fmt('B2')).bold;
    await p.keyboard.press('Control+z'); await pauza(150);
    const a = !(await h.fmt('B2')).bold;
    // butonul lectiei (ex. „Verifica”) sta in pagina, in afara aplicatiei; focusul pleaca acolo
    await p.evaluate(() => { const b = document.createElement('button'); b.type = 'button'; b.id = 'proba-buton-lectie'; b.textContent = 'Verifică'; document.body.prepend(b); });
    await h.clic('C2'); await h.mso('Bold'); await pauza(120);
    await h.clicLoc(p.locator('#proba-buton-lectie'), 'buton-lectie'); await pauza(100);
    await p.keyboard.press('Control+z'); await pauza(150);
    const b = !(await h.fmt('C2')).bold;
    await p.keyboard.press('Control+y'); await pauza(150);
    const c = b && !!(await h.fmt('C2')).bold;
    return { ok: b1 && a && b && c, det: `dupa Bold, Ctrl+Z: ${a ? 'anulat' : 'NU'}; focus pe butonul lectiei, Ctrl+Z: ${b ? 'anulat' : 'NU (Bold ramas pe C2)'}, Ctrl+Y: ${b ? (c ? 'refacut' : 'NU') : 'neprobat'}` };
  } },
  { id: 'excel-a-F112', nume: 'Butonul Borders pune ultima bordura aleasa din lista (la inceput Bottom Border)', fn: async (p, h) => {
    await h.sel('F3', 'G3'); await h.tinta('panglica:Home/Font/Borders'); await pauza(150);
    const jos = !!(((await h.fmt('F3')).borduri || {}).jos);
    await h.sel('F6', 'G6');
    await h.mso('BordersGallery_Dropdown'); await pauza(200);
    if (!await h.meniu('Top Border')) return { ok: false, det: 'lista Borders nu are Top Border' };
    const sus6 = !!(((await h.fmt('F6')).borduri || {}).sus);
    await h.sel('F9', 'G9'); await h.tinta('panglica:Home/Font/Borders'); await pauza(150);
    const b9 = (await h.fmt('F9')).borduri || {}, g9 = (await h.fmt('G9')).borduri || {};
    const ok = jos && sus6 && !!b9.sus && !!g9.sus && !b9.jos;
    return { ok, det: `la inceput F3 jos=${jos}; Top Border din lista pe F6:G6 -> sus=${sus6}; apoi butonul pe F9:G9 -> F9 ${j(b9)}, G9 ${j(g9)} (asteptat sus, fara jos)` };
  } },
  { id: 'excel-b-F119', nume: 'Home › Clear ▾: Clear All goleste si formatul, Clear Contents doar continutul', fn: async (p, h) => {
    await h.clic('B2'); await h.mso('Bold'); await h.clic('B3'); await h.mso('Bold'); await pauza(100);
    await h.clic('B2'); await h.mso('ClearMenu'); await pauza(200);
    if (!await h.meniu('Clear All')) return { ok: false, det: 'lista Clear nu se deschide / nu are Clear All; ' + await h.nesimulat() };
    const b2 = await h.c('B2'), f2 = await h.fmt('B2');
    await h.clic('B3'); await h.mso('ClearMenu'); await pauza(200);
    if (!await h.meniu('Clear Contents')) return { ok: false, det: 'lista Clear nu are Clear Contents' };
    const b3 = await h.c('B3'), f3 = await h.fmt('B3');
    const ok = !b2 && !f2.bold && !b3 && !!f3.bold;
    return { ok, det: `Clear All: B2=${j(b2 && b2.valoare)} bold=${!!f2.bold}; Clear Contents: B3=${j(b3 && b3.valoare)} bold ramas=${!!f3.bold}` };
  } },
  { id: 'excel-b-F120', nume: 'Lipirea pe o zona de aceeasi marime sau pe un multiplu exact repeta copia', fn: async (p, h) => {
    await h.sel('A2', 'A3'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.sel('K5', 'K6'); await p.keyboard.press('Control+v'); await pauza(200);
    const egal = [await h.v('K5'), await h.v('K6')];
    await h.sel('B2', 'C2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.sel('F2', 'I3'); await p.keyboard.press('Control+v'); await pauza(200);
    const m = [];
    for (const a of ['F2', 'G2', 'H2', 'I2', 'F3', 'G3', 'H3', 'I3']) m.push(await h.v(a));
    const ok = j(egal) === j(['Ana', 'Bogdan']) && j(m) === j([9, 10, 9, 10, 9, 10, 9, 10]);
    return { ok, det: `A2:A3 pe K5:K6 -> ${j(egal)}; B2:C2 pe F2:I3 -> ${j(m)} (asteptat 9,10 de patru ori)` };
  } },
  { id: 'excel-b-F121', nume: 'Enter dupa copiere lipeste si opreste copierea', fn: async (p, h) => {
    await h.sel('B2', 'C2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.clic('F5'); await p.keyboard.press('Enter'); await pauza(200);
    const lip = [await h.v('F5'), await h.v('G5')];
    const o = await h.copiereOprita('F9');
    return { ok: j(lip) === j([9, 10]) && o.ok, det: `F5:G5=${j(lip)}; ${o.det}` };
  } },
  { id: 'excel-b-F122', nume: 'Golirea (Delete) si stergerea unui rand opresc copierea', fn: async (p, h) => {
    await h.scrie('F7', 'q');
    await h.clic('B2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.clic('F7'); await p.keyboard.press('Delete'); await pauza(150);
    const golit = (await h.v('F7')) === undefined;
    const o1 = await h.copiereOprita('F9');
    await h.reincarca();
    await h.scrie('A7', 'z');
    await h.clic('B2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.antetRand(6, { button: 'right' }); await pauza(200);
    const areDelete = await h.meniu('Delete');
    const sters = (await h.v('A6')) === 'z';
    const o2 = await h.copiereOprita('H9');
    return { ok: golit && o1.ok && areDelete && sters && o2.ok, det: `Delete: F7 golita=${golit}, ${o1.det}; stergerea randului 6 (clic dreapta pe antet › Delete): sters=${sters}${sters ? '' : ' ' + await h.nesimulat()}, ${o2.det}` };
  } },
  { id: 'excel-b-F124', nume: 'Ctrl+- sterge coloanele selectate; pe o zona de celule deschide fereastra Delete', fn: async (p, h) => {
    await h.antetCol('B'); await pauza(100);
    await p.keyboard.press('Control+Minus'); await pauza(200);
    const b1 = await h.v('B1');
    await h.sel('B2', 'C2'); await p.keyboard.press('Control+Minus'); await pauza(200);
    const m = await h.mesaj();
    const ok = b1 === 'Nota 2' && /Shift cells up/.test(m) && /Entire column/.test(m);
    return { ok, det: `dupa Ctrl+- pe coloana B: B1=${j(b1)} (asteptat Nota 2); pe B2:C2: fereastra=${j(m.slice(0, 80))}` };
  } },
  { id: 'excel-b-F125', nume: 'Shift+Spatiu selecteaza randul, Ctrl+Spatiu coloana', fn: async (p, h) => {
    await h.antetRand(4); await pauza(80); const zR = (await h.st()).selectie.zona;
    await h.antetCol('C'); await pauza(80); const zC = (await h.st()).selectie.zona;
    await h.clic('C4'); await p.keyboard.press('Shift+Space'); await pauza(150);
    const s1 = await h.st();
    await p.keyboard.press('Escape'); await h.clic('C3'); await p.keyboard.press('Control+Space'); await pauza(150);
    const s2 = await h.st();
    const ok = s1.selectie.zona === zR && !s1.ramane_in_editare && (s1.celule.C4 || {}).valoare === 6 && s2.selectie.zona === zC && !s2.ramane_in_editare;
    return { ok, det: `Shift+Spatiu pe C4: zona=${j(s1.selectie.zona)} (ca antetul: ${j(zR)}), C4=${j((s1.celule.C4 || {}).valoare)}, editare=${s1.ramane_in_editare}; Ctrl+Spatiu pe C3: zona=${j(s2.selectie.zona)} (ca antetul: ${j(zC)})` };
  } },
  { id: 'excel-b-F126', nume: 'Shift+F10 deschide meniul de clic dreapta, iar randul ales lucreaza pe selectie', fn: async (p, h) => {
    await h.sel('B2', 'C2'); await p.keyboard.press('Shift+F10'); await pauza(200);
    const are = await h.meniu('Clear Contents');
    const b2 = await h.v('B2'), c2 = await h.v('C2');
    return { ok: are && b2 === undefined && c2 === undefined, det: `meniu deschis=${are}; dupa Clear Contents: B2=${j(b2)} C2=${j(c2)}` };
  } },
  { id: 'excel-b-F128', nume: 'Caseta de nume: „note” pe B2:C3 devine un nume; scris din nou, selecteaza B2:C3', fn: async (p, h) => {
    // simulatorul vechi arata doar un mesaj; in Excel textul devine un NUME definit pentru selectie (castiga Excelul)
    await h.sel('B2', 'C3');
    const nb = p.locator(`${APP} input[aria-label="Name Box"]`);
    await h.clicLoc(nb, 'namebox'); await p.keyboard.press('Control+a'); await p.keyboard.type('note'); await p.keyboard.press('Enter'); await pauza(200);
    await h.clic('E8'); await pauza(100);
    await h.clicLoc(nb, 'namebox2'); await p.keyboard.press('Control+a'); await p.keyboard.type('note'); await p.keyboard.press('Enter'); await pauza(200);
    const z = (await h.st()).selectie.zona;
    return { ok: z === 'B2:C3', det: `dupa „note” scris a doua oara: zona=${j(z)} (asteptat B2:C3)` };
  } },
  { id: 'excel-b-F062', nume: 'Ghilimelele romanesti „ ” in formula: fereastra „There\'s a problem with this formula”, formula neprimita', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2>=5;„promovat”;„respins”)'); await pauza(150);
    const m = await h.mesaj(), c = await h.c('F6');
    return { ok: RE_PROBLEMA.test(m) && !primita(c), det: `fereastra=${j(m.slice(0, 90))}; F6 primita=${primita(c)}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-b-F063', nume: 'Ghilimelele intoarse “ ”: formula primita, celula arata #NAME?', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2>=5;“da”;“nu”)'); await pauza(150);
    const s = await h.st(), c = s.celule.F6 || {};
    return { ok: !s.ramane_in_editare && (c.valoare === '#NAME?' || c.text === '#NAME?'), det: `F6=${j(c.text)} editare=${s.ramane_in_editare}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-b-F064', nume: 'Semnele de la matematica ≥ ≤ ≠: formula primita, celula arata #NAME?', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2≥5;"da";"nu")'); await pauza(150);
    const s = await h.st(), c = s.celule.F6 || {};
    return { ok: !s.ramane_in_editare && (c.valoare === '#NAME?' || c.text === '#NAME?'), det: `F6=${j(c.text)} editare=${s.ramane_in_editare}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-b-F065', nume: 'Semnul => : fereastra „We found a typo…”, la No formula nu e primita', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2=>5;"da";"nu")'); await pauza(150);
    const m = await h.mesaj();
    if (!RE_TYPO.test(m)) return { ok: false, det: `fara fereastra de corectura: ${j(m.slice(0, 80))}; ${await h.nesimulat()}` };
    const no = await h.fereastra('No'); await pauza(150);
    const c = await h.c('F6'), m2 = await h.mesaj();
    // probat in Excel real (lectii/viii/m2-l09/surse.md): la No urmeaza fereastra de problema, formula ramane neprimita
    return { ok: no && !primita(c) && RE_PROBLEMA.test(m2), det: `fereastra=${j(m.slice(0, 80))}; No apasat=${no}; dupa No: ${j(m2.slice(0, 60))}, F6 primita=${primita(c)}` };
  } },
  { id: 'excel-b-F066', nume: 'Zecimala cu punct (4.5) pe setari romanesti: fereastra de problema', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2>=4.5;"da";"nu")'); await pauza(150);
    const m = await h.mesaj(), c = await h.c('F6');
    return { ok: RE_PROBLEMA.test(m) && !primita(c), det: `fereastra=${j(m.slice(0, 90))}; F6 primita=${primita(c)}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-b-F068', nume: 'Prea multe parti in IF: „You\'ve entered too many arguments for this function”', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2>=5;"a";"b";"c")'); await pauza(150);
    const m = await h.mesaj(), c = await h.c('F6');
    return { ok: /too many arguments/i.test(m) && !primita(c), det: `fereastra=${j(m.slice(0, 90))}` };
  } },
  { id: 'excel-b-F070', nume: 'O parte goala intre ; valoreaza 0 (IF(B2<14;;20) -> 0; AVERAGE(B2;;B3) numara un 0)', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2<14;;20)');
    await h.scrie('F7', '=AVERAGE(B2;;B3)'); await pauza(100);
    const f6 = await h.c('F6') || {}, f7 = await h.c('F7') || {};
    const ok = f6.valoare === 0 && f6.text === '0' && typeof f7.valoare === 'number' && Math.abs(f7.valoare - 16 / 3) < 1e-6;
    return { ok, det: `IF -> ${j(f6.text)}; AVERAGE(9;;7) -> ${j(f7.valoare)} (asteptat 5,333…)` };
  } },
  { id: 'excel-b-F071', nume: 'Spatiu intre IF si paranteza: Excel propune corectura (Yes -> IF( )', fn: async (p, h) => {
    await h.scrie('F6', '=IF (B2>5;"da";"nu")'); await pauza(150);
    const m = await h.mesaj();
    if (!RE_TYPO.test(m)) { const c = await h.c('F6'); return { ok: false, det: `fara fereastra de corectura (F6=${j(c && c.text)}, formula=${j(c && c.formula)})` }; }
    const da = await h.fereastra('Yes'); await pauza(150);
    const c = await h.c('F6');
    return { ok: da && primita(c) && c.valoare === 'da', det: `fereastra=${j(m.slice(0, 80))}; dupa Yes F6=${j(c && c.text)}` };
  } },
  { id: 'excel-b-F072', nume: 'Paranteza ) inchisa prea devreme sau in plus: fereastra de problema / de corectura', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2<14);10;20)'); await pauza(150);
    const m1 = await h.mesaj(), c1 = await h.c('F6');
    await h.reincarca();
    await h.scrie('F6', '=IF(B2>5;"da";"nu"))'); await pauza(150);
    const m2 = await h.mesaj();
    // probat in Excel real (lectii/viii/m2-l09/surse.md, n3 si m2): inchisa prea devreme = fereastra de problema (r20); ) in plus la sfarsit = „We found a typo” (e33)
    const ok = RE_PROBLEMA.test(m1) && !primita(c1) && RE_TYPO.test(m2);
    return { ok, det: `IF(B2<14);10;20): ${j(m1.slice(0, 80))}; IF(...)): ${j(m2.slice(0, 80))}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-b-F073', nume: 'Ghilimea fara pereche: Excel nu primeste formula (fereastra lui)', fn: async (p, h) => {
    await h.scrie('F6', '=IF(B2>5;"da;"nu")'); await pauza(150);
    const m = await h.mesaj(), c = await h.c('F6');
    return { ok: (RE_PROBLEMA.test(m) || RE_TYPO.test(m)) && !primita(c), det: `fereastra=${j(m.slice(0, 90))}; F6 primita=${primita(c)}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-b-F076', nume: 'Pe ecran cu atingere: butoane pentru " ; < > = care scriu semnul in bara fx', atingere: true, fn: async (p, h) => {
    // Excel pentru web pe telefon nu are asa butoane: e un ajutor al simulatorului vechi (vezi raportul, „nesigure”)
    // caseta din bara fx e doar pentru citire (readonly); elevul atinge celula si incepe formula, bara fx o arata
    await h.clic('F6'); await pauza(100);
    await p.keyboard.type('=IF(B2>5'); await pauza(100);
    const gasite = await p.evaluate(() => {
      const viz = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
      const o = {};
      for (const e of document.querySelectorAll('button, [role="button"]')) { const t = (e.textContent || '').trim(); if (['"', ';', '<', '>', '='].includes(t) && viz(e) && !o[t]) { const b = e.getBoundingClientRect(); o[t] = { x: b.x + b.width / 2, y: b.y + b.height / 2 }; } }
      return o;
    });
    const lipsa = ['"', ';', '<', '>', '='].filter(s => !gasite[s]);
    if (lipsa.length) return { ok: false, det: 'nu sunt butoane vizibile pentru: ' + lipsa.join(' ') };
    await p.touchscreen.tap(gasite[';'].x, gasite[';'].y); await pauza(150);
    const v = await h.fx(), c = await h.c('F6');
    return { ok: v.endsWith(';') || !!(c && String(c.text).endsWith(';')), det: `dupa atingerea lui ; bara fx=${j(v)}, F6=${j(c && c.text)}` };
  } },
  { id: 'excel-a-F132', nume: 'Clear ▾ › Clear Formats lasa valorile, scoate bordurile si imbinarea; Clear All desface si imbinarea', fn: async (p, h) => {
    await h.scrie('F6', 'x');
    await h.sel('F6', 'G6'); await h.mso('MergeCenter'); await pauza(120);
    await h.mso('Bold'); await h.tinta('panglica:Home/Font/Borders'); await pauza(120);
    const ina = await h.fmt('F6');
    if (String(ina.imbinat) !== 'F6:G6' || !ina.bold) return { ok: false, det: 'pregatirea nu a mers: ' + j(ina) };
    await h.mso('ClearMenu'); await pauza(200);
    if (!await h.meniu('Clear Formats')) return { ok: false, det: 'lista Clear nu se deschide / nu are Clear Formats; ' + await h.nesimulat() };
    const f6 = await h.fmt('F6'), g6 = await h.fmt('G6'), v6 = await h.v('F6');
    const okF = v6 === 'x' && !f6.imbinat && !g6.imbinat && !f6.bold && !f6.borduri && !g6.borduri;
    await h.scrie('F9', 'y');
    await h.sel('F9', 'G9'); await h.mso('MergeCenter'); await pauza(120);
    await h.mso('ClearMenu'); await pauza(200);
    const areAll = await h.meniu('Clear All');
    const f9 = await h.fmt('F9'), v9 = await h.v('F9');
    const okA = areAll && v9 === undefined && !f9.imbinat;
    return { ok: okF && okA, det: `Clear Formats: F6=${j(v6)} format=${j(f6)} G6=${j(g6)}; Clear All: F9=${j(v9)} format=${j(f9)}` };
  } },
  { id: 'excel-a-F035', nume: 'Fereastra Delete (clic dreapta › Delete...): Shift cells left, Entire row, Entire column', fn: async (p, h) => {
    await h.scrie('F4', '=A4');
    const pas = async (a, opt) => {
      await h.clic(a, { button: 'right' }); await pauza(200);
      if (!await h.meniu('Delete...')) return 'meniul nu are Delete...';
      if (!await h.fereastra(opt)) return 'fereastra Delete nu are ' + opt;
      if (!await h.fereastra('OK')) return 'fereastra Delete nu are OK';
      await pauza(150); return '';
    };
    let e = await pas('B3', 'Shift cells left'); if (e) return { ok: false, det: e };
    const s1 = [await h.v('B3'), await h.v('C3')];
    e = await pas('B2', 'Entire row'); if (e) return { ok: false, det: e };
    const s2 = [await h.v('A2'), await h.v('B2'), await h.v('A3')], f3 = await h.c('F3');
    e = await pas('C1', 'Entire column'); if (e) return { ok: false, det: e };
    const s3 = [await h.v('C1'), await h.v('B3')], e3 = await h.c('E3');
    const ok = j(s1) === j([8, undefined]) && j(s2) === j(['Bogdan', 8, 'Dan']) && f3 && (f3.formula || '').replace(/\s/g, '') === '=A3' && f3.valoare === 'Dan'
      && j(s3) === j(['Media', 8]) && e3 && (e3.formula || '').replace(/\s/g, '') === '=A3';
    return { ok, det: `stanga: B3,C3=${j(s1)}; rand: A2,B2,A3=${j(s2)}, F3=${j(f3 && f3.formula)}; coloana: C1,B3=${j(s3)}, E3=${j(e3 && e3.formula)}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-a-F036', nume: 'Butonul Delete din Home scoate direct randul / coloana selectata sau urca celulele', fn: async (p, h) => {
    await h.scrie('F5', '=A4');
    await h.antetRand(3); await h.mso('CellsDeleteSmart'); await pauza(200);
    const r = [await h.v('A3'), await h.v('A4')], f4 = await h.c('F4');
    await h.antetCol('B'); await h.mso('CellsDeleteSmart'); await pauza(200);
    const c = await h.v('B1');
    // o singura celula: Excel urca celulele de dedesubt (probat in Excel real, nota din excelx.js:434)
    await h.clic('B2'); await h.mso('CellsDeleteSmart'); await pauza(200);
    const u = [await h.v('B2'), await h.v('B3')];
    const ok = j(r) === j(['Dan', undefined]) && f4 && (f4.formula || '').replace(/\s/g, '') === '=A3' && c === 'Nota 2' && j(u) === j([6, undefined]);
    return { ok, det: `rand 3: A3,A4=${j(r)}, F4=${j(f4 && f4.formula)}; coloana B: B1=${j(c)}; celula B2: B2,B3=${j(u)}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-a-F037', nume: 'Home › Delete ▾: Delete Cells..., Delete Sheet Rows, Delete Sheet Columns', fn: async (p, h) => {
    await h.scrie('F5', '=A4');
    await h.clic('B3'); await h.mso('TableDeleteRowsAndColumnsMenu_Dropdown'); await pauza(200);
    if (!await h.meniu('Delete Sheet Rows')) return { ok: false, det: 'lista Delete nu are Delete Sheet Rows' };
    const r = [await h.v('A3'), await h.v('B3')], f4 = await h.c('F4');
    await h.clic('C1'); await h.mso('TableDeleteRowsAndColumnsMenu_Dropdown'); await pauza(200);
    if (!await h.meniu('Delete Sheet Columns')) return { ok: false, det: 'lista Delete nu are Delete Sheet Columns' };
    const c = await h.v('C1'), e4 = await h.c('E4');
    await h.clic('B2'); await h.mso('TableDeleteRowsAndColumnsMenu_Dropdown'); await pauza(200);
    const areCells = await h.meniu('Delete Cells...');
    const m = await h.mesaj();
    const ok = j(r) === j(['Dan', 8]) && f4 && (f4.formula || '').replace(/\s/g, '') === '=A3' && c === 'Media' && e4 && (e4.formula || '').replace(/\s/g, '') === '=A3' && areCells && /Entire row/.test(m);
    return { ok, det: `Delete Sheet Rows pe B3: A3,B3=${j(r)}, F4=${j(f4 && f4.formula)}; Delete Sheet Columns pe C1: C1=${j(c)}, E4=${j(e4 && e4.formula)}; Delete Cells... -> ${j(m.slice(0, 60))}; ${await h.nesimulat()}` };
  } },
  { id: 'excel-a-F038', nume: 'Home › Editing › Clear ▾ › Clear Contents goleste valorile, pastreaza formatul', fn: async (p, h) => {
    await h.clic('B2'); await h.mso('Bold'); await pauza(100);
    await h.sel('B2', 'C2'); await h.mso('ClearMenu'); await pauza(200);
    if (!await h.meniu('Clear Contents')) return { ok: false, det: 'lista Clear nu se deschide / nu are Clear Contents; ' + await h.nesimulat() };
    const b2 = await h.v('B2'), c2 = await h.v('C2'), bold = !!(await h.fmt('B2')).bold;
    return { ok: b2 === undefined && c2 === undefined && bold, det: `B2=${j(b2)} C2=${j(c2)} bold ramas=${bold}` };
  } },
  { id: 'excel-a-F039', nume: 'A1:A2 copiat pe K1:K4 se lipeste de doua ori', fn: async (p, h) => {
    await h.sel('A1', 'A2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.sel('K1', 'K4'); await p.keyboard.press('Control+v'); await pauza(200);
    const k = [await h.v('K1'), await h.v('K2'), await h.v('K3'), await h.v('K4')];
    return { ok: j(k) === j(['Elev', 'Ana', 'Elev', 'Ana']), det: `K1:K4=${j(k)}` };
  } },
  { id: 'excel-a-F040', nume: 'Lipirea pe o zona de alta marime: Excel nu lipeste si spune ca zonele nu au aceeasi marime', fn: async (p, h) => {
    await h.sel('A2', 'A3'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.sel('K1', 'K3'); await p.keyboard.press('Control+v'); await pauza(200);
    const m = await h.mesaj();
    const k = [await h.v('K1'), await h.v('K2'), await h.v('K3')];
    return { ok: /same size/i.test(m) && j(k) === j([undefined, undefined, undefined]), det: `mesaj=${j(m.slice(0, 90))}; K1:K3=${j(k)}` };
  } },
  { id: 'excel-a-F041', nume: 'Enter dupa copiere lipeste in celula activa si opreste copierea', fn: async (p, h) => {
    await h.clic('B2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.clic('F5'); await p.keyboard.press('Enter'); await pauza(200);
    const v = await h.v('F5');
    const o = await h.copiereOprita('F9');
    return { ok: v === 9 && o.ok, det: `F5=${j(v)}; ${o.det}` };
  } },
  { id: 'excel-a-F042', nume: 'Esc sau golirea (Delete) opresc copierea', fn: async (p, h) => {
    await h.clic('B2'); await p.keyboard.press('Control+c'); await pauza(100);
    const inainte = await h.furnici();
    await p.keyboard.press('Escape'); await pauza(120);
    const o1 = await h.copiereOprita('F6');
    await h.scrie('F7', 'q');
    await h.clic('B2'); await p.keyboard.press('Control+c'); await pauza(100);
    await h.clic('F7'); await p.keyboard.press('Delete'); await pauza(150);
    const o2 = await h.copiereOprita('F8');
    return { ok: inainte && o1.ok && o2.ok, det: `margine punctata dupa Ctrl+C=${inainte}; Esc: ${o1.det}; Delete: ${o2.det}` };
  } },
  { id: 'excel-a-F046', nume: 'Ctrl+- sterge randul selectat (formulele se muta); pe o celula deschide fereastra Delete', fn: async (p, h) => {
    await h.scrie('F5', '=A4');
    await h.antetRand(3); await pauza(80); await p.keyboard.press('Control+Minus'); await pauza(200);
    const a3 = await h.v('A3'), f4 = await h.c('F4');
    await h.clic('B2'); await p.keyboard.press('Control+Minus'); await pauza(200);
    const m = await h.mesaj();
    const ok = a3 === 'Dan' && f4 && (f4.formula || '').replace(/\s/g, '') === '=A3' && /Shift cells up/.test(m);
    return { ok, det: `dupa Ctrl+- pe randul 3: A3=${j(a3)}, F4=${j(f4 && f4.formula)}; pe B2: fereastra=${j(m.slice(0, 80))}` };
  } },
  { id: 'excel-a-F049', nume: 'Shift+F10 deschide meniul de clic dreapta al celulei', fn: async (p, h) => {
    await h.clic('C3'); await p.keyboard.press('Shift+F10'); await pauza(200);
    const n = await p.evaluate(() => ['Clear Contents', 'Insert...', 'Delete...'].filter(et => [...document.querySelectorAll(`[data-lh-aplicatie="excel"] [data-lh-tinta="meniu:${et}"]`)].some(e => e.getBoundingClientRect().width > 0)));
    return { ok: n.length === 3, det: `randuri vizibile din meniul celulei: ${j(n)}` };
  } },
  { id: 'excel-a-F151', nume: 'Shift+F11 pune o foaie noua inaintea foii active', fn: async (p, h) => {
    await h.clic('B2'); await p.keyboard.press('Shift+F11'); await pauza(200);
    const s = await h.st();
    return { ok: j(s.foi) === j(['Sheet2', 'Sheet1']) && s.foaie_activa === 'Sheet2', det: `foi=${j(s.foi)} activa=${j(s.foaie_activa)}` };
  } },
  { id: 'excel-a-F152', nume: 'Clic dreapta pe fila › Insert... › Worksheet › OK pune o foaie noua inaintea celei active', fn: async (p, h) => {
    await h.clicLoc(h.fila('Sheet1'), 'fila', { button: 'right' }); await pauza(200);
    if (!await h.meniu('Insert...')) return { ok: false, det: 'meniul filei nu are Insert...' };
    const m = await h.mesaj();
    if (!/Worksheet/.test(m)) return { ok: false, det: 'fereastra Insert cu Worksheet nu a aparut; ' + await h.nesimulat() };
    await h.fereastra('Worksheet');
    if (!await h.fereastra('OK')) return { ok: false, det: 'fereastra Insert nu are OK' };
    await pauza(150);
    const s = await h.st();
    return { ok: j(s.foi) === j(['Sheet2', 'Sheet1']) && s.foaie_activa === 'Sheet2', det: `foi=${j(s.foi)} activa=${j(s.foaie_activa)}` };
  } },
  { id: 'excel-a-F157', nume: 'In numele foii : \\ / ? * [ ] nu se scriu deloc (Ore/2 -> Ore2); cel mult 31 de caractere', fn: async (p, h) => {
    await h.fila('Sheet1').dblclick(); await pauza(200);
    await p.keyboard.type('Ore/2'); await pauza(100);
    const caseta = await p.evaluate(() => document.activeElement && 'value' in document.activeElement ? document.activeElement.value : null);
    await p.keyboard.press('Enter'); await pauza(200);
    const n1 = (await h.st()).foi[0];
    await h.fila(n1).dblclick(); await pauza(200);
    await p.keyboard.press('Control+a'); await p.keyboard.type('A'.repeat(35)); await p.keyboard.press('Enter'); await pauza(200);
    const n2 = (await h.st()).foi[0];
    return { ok: caseta === 'Ore2' && n1 === 'Ore2' && n2.length === 31, det: `caseta dupa „Ore/2”=${j(caseta)}; fila=${j(n1)}; 35 de A -> ${n2.length} caractere` };
  } },
  { id: 'excel-a-F158', nume: 'Nume de foaie gol sau nepermis -> „You typed an invalid name for a sheet or chart…”', fn: async (p, h) => {
    await h.fila('Sheet1').dblclick(); await pauza(200);
    await p.keyboard.press('Control+a'); await p.keyboard.press('Backspace'); await p.keyboard.press('Enter'); await pauza(200);
    const m1 = await h.mesaj(), f1 = (await h.st()).foi;
    await h.inchideFereastra(); await p.keyboard.press('Escape'); await pauza(120);
    // un nume care se termina cu apostrof e refuzat de Excel cu acelasi mesaj (registru-foi.js:454)
    await h.fila((await h.st()).foi[0]).dblclick(); await pauza(200);
    await p.keyboard.press('Control+a'); await p.keyboard.type("Ore'"); await p.keyboard.press('Enter'); await pauza(200);
    const m2 = await h.mesaj(), f2 = (await h.st()).foi;
    const re = /invalid name for a sheet or chart/i;
    return { ok: re.test(m1) && j(f1) === j(['Sheet1']) && re.test(m2) && j(f2) === j(['Sheet1']), det: `gol: ${j(m1.slice(0, 70))} foi=${j(f1)}; „Ore'”: ${j(m2.slice(0, 70))} foi=${j(f2)}` };
  } },
  { id: 'excel-a-F159', nume: '„History” ca nume de foaie -> „History is a reserved name.”', fn: async (p, h) => {
    await h.fila('Sheet1').dblclick(); await pauza(200);
    await p.keyboard.press('Control+a'); await p.keyboard.type('History'); await p.keyboard.press('Enter'); await pauza(200);
    const m = await h.mesaj(), f = (await h.st()).foi;
    return { ok: /History'?\s+is a reserved name/i.test(m) && j(f) === j(['Sheet1']), det: `mesaj=${j(m.slice(0, 70))}; foi=${j(f)}` };
  } },
];

// ---------------------------------------------------------------- rularea
async function ruleaza(browser, base, pr) {
  if (pr.skip) { scrie('SKIP', pr.id, pr.nume, pr.skip); return; }
  let ctx = null;
  const lucru = (async () => {
    ctx = await browser.newContext(pr.atingere ? { viewport: { width: 390, height: 844 }, hasTouch: true } : { viewport: { width: 1280, height: 800 } });
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); return (u.hostname === '127.0.0.1' || u.hostname === 'localhost') ? r.continue() : r.abort(); });
    const p = await ctx.newPage();
    p.setDefaultTimeout(6000);   // un element vizibil dar neapasabil nu tine proba pana la limita de 20 s
    const erori = [];
    p.on('pageerror', e => erori.push(e.message));
    await deschide(p, base);
    const r = await pr.fn(p, unelte(p, base, !!pr.atingere));
    return { ...r, erori };
  })();
  let ceas;
  const limita = new Promise((_, rej) => { ceas = setTimeout(() => rej(new Error('timp depasit (20 s)')), LIMITA_PROBA); });
  try {
    const r = await Promise.race([lucru, limita]);
    const er = r.erori.length ? ` [eroare in pagina: ${r.erori[0].slice(0, 120)}]` : '';
    scrie(r.ok ? 'PASS' : 'FAIL', pr.id, pr.nume, r.det + er);
  } catch (e) {
    scrie('FAIL', pr.id, pr.nume, 'proba a crapat: ' + (e && e.message ? e.message.split('\n')[0] : String(e)));
  } finally {
    clearTimeout(ceas);
    lucru.catch(() => {});
    if (ctx) await ctx.close().catch(() => {});
  }
}

async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const doar = process.argv.slice(2);
    for (const pr of PROBE) if (!doar.length || doar.includes(pr.id)) await ruleaza(browser, base, pr);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(`DURATA ${Math.round((Date.now() - t0) / 1000)} s`);
  console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL} SKIP=${rezultate.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rezultate.FAIL));
}

main().catch(e => { console.log('FAIL eroare la rulare - ' + e.message); console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL + 1} SKIP=${rezultate.SKIP}`); console.log('TOTAL FAIL'); console.log(String(rezultate.FAIL + 1)); });
