// Verificari pentru magazia de fisiere (aplicatii/fisiere.js) si Save As / Open din Excel (aplicatii/excel.js).
// Conduce fereastra Save As PRIN UI (F12, caseta File name, Save) si verifica in magazie.
// Rulare:  node aplicatii/_verificare/fisiere_checks.mjs   (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL.
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
    srv.listen(0, '127.0.0.1', () => resolve(srv));   // port liber, aleator
  });
}

let nFail = 0;
function scrie(stare, nume, detalii) {
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const SAVE_AS = '[data-lh-fis="salvare_ca"]';
const CONF = '[data-lh-fis="confirmare"]';

// PDF minim: antet, xref cu offset-uri reale, startxref, %%EOF
function pdfValid(s) {
  if (!s.startsWith('%PDF-1.4\n')) return 'antet lipsa';
  if (!s.endsWith('%%EOF\n')) return 'fara %%EOF';
  const m = /startxref\n(\d+)\n%%EOF\n$/.exec(s);
  if (!m) return 'fara startxref';
  const xo = +m[1];
  if (s.substr(xo, 5) !== 'xref\n') return 'startxref nu indica xref';
  const lines = s.substr(xo).split('\n');
  const [, n] = lines[1].split(' ').map(Number);
  for (let i = 1; i < n; i++) {
    const off = +lines[2 + i].slice(0, 10);
    if (!s.substr(off).startsWith(`${i} 0 obj`)) return `obiect ${i} nu e la offset ${off}`;
  }
  return null;
}

async function deschideExcel(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector('[data-lh-aplicatie="excel"]', { timeout: 15000 });
  await p.waitForFunction(() => !!(window.LH && window.LH.aplicatii && window.LH.aplicatii._module && window.LH.aplicatii._module.fisiere), null, { timeout: 15000 });
  await pauza(800);
  return { ctx, p, erori };
}

const st = p => p.evaluate(() => window.LH.aplicatii.stare('excel'));
const magazia = async p => (await st(p)).fisiere || {};

async function salveazaCa(p, nume, tip) {
  await p.keyboard.press('F12');
  await p.waitForSelector(SAVE_AS, { timeout: 5000 });
  if (tip) await p.selectOption(`${SAVE_AS} select`, tip);
  if (nume != null) await p.fill(`${SAVE_AS} input[aria-label="File name:"]`, nume);
  await p.click(`${SAVE_AS} button.pr`);
  await pauza(300);
}

// ---------- 1: Save As prin UI (F12, nume, Save) => fisierul apare in magazie, registrul ia numele
async function verificaSaveAs(browser, base) {
  const nume = '1 Save As (F12, nume nou, Save) => fisierul apare in magazia Documente';
  try {
    const { ctx, p, erori } = await deschideExcel(browser, base);
    try {
      await salveazaCa(p, 'Test salvare');
      const s = await st(p);
      const ramas = await p.locator(SAVE_AS).count();
      const ok = (s.fisiere.Documente || []).includes('Test salvare.xlsx') && ramas === 0 && s.dosar_fisier === 'Documente' && s.nume_fisier === 'Test salvare.xlsx';
      if (ok && erori.length === 0) scrie('PASS', nume, 'Documente: ' + s.fisiere.Documente.join(', '));
      else scrie('FAIL', nume, `Documente=${JSON.stringify(s.fisiere.Documente)} ferestra_ramasa=${ramas} nume=${s.nume_fisier} erori=${erori.slice(0, 2).join(' | ')}`);
    } finally { await ctx.close(); }
  } catch (e) { scrie('FAIL', nume, e.message); }
}

// ---------- 2: nume existent => „Confirm Save As”; No nu scrie si lasa fereastra; Yes inlocuieste
async function verificaInlocuire(browser, base) {
  const nume = '2 Save As peste „Note clasa.xlsx”: Confirm Save As; No pastreaza, Yes inlocuieste';
  try {
    const { ctx, p } = await deschideExcel(browser, base);
    try {
      const inainte = (await magazia(p)).Documente.filter(n => n === 'Note clasa.xlsx').length;
      await salveazaCa(p, 'Note clasa.xlsx');
      const aparuConfirm = await p.waitForSelector(CONF, { timeout: 3000 }).then(() => true, () => false);
      const text = aparuConfirm ? await p.locator(CONF).innerText() : '';
      if (!aparuConfirm || !/already exists/.test(text)) { scrie('FAIL', nume, 'nu a aparut „already exists”: ' + text.slice(0, 80)); return; }
      await p.locator(`${CONF} button`).nth(1).click();             // No
      await pauza(300);
      const dupaNo = { conf: await p.locator(CONF).count(), save: await p.locator(SAVE_AS).count(), n: (await magazia(p)).Documente.filter(n => n === 'Note clasa.xlsx').length };
      await p.locator(`${SAVE_AS} button.pr`).click();              // Save din nou
      await p.waitForSelector(CONF, { timeout: 3000 });
      await p.locator(`${CONF} button`).nth(0).click();             // Yes
      await pauza(300);
      const dupaYes = { conf: await p.locator(CONF).count(), save: await p.locator(SAVE_AS).count(), s: await st(p) };
      const ok = inainte === 1 && dupaNo.conf === 0 && dupaNo.save === 1 && dupaNo.n === 1
        && dupaYes.conf === 0 && dupaYes.save === 0 && dupaYes.s.dosar_fisier === 'Documente' && dupaYes.s.fisiere.Documente.filter(n => n === 'Note clasa.xlsx').length === 1;
      if (ok) scrie('PASS', nume, 'No: fereastra ramane, nimic scris; Yes: inlocuit, un singur fisier');
      else scrie('FAIL', nume, JSON.stringify({ inainte, dupaNo, dupaYes: { conf: dupaYes.conf, save: dupaYes.save, dosar: dupaYes.s.dosar_fisier } }));
    } finally { await ctx.close(); }
  } catch (e) { scrie('FAIL', nume, e.message); }
}

// ---------- 3: CSV si PDF salvate din Save As (UI) apar in magazie; PDF e valid; CSV se deschide din Open
async function verificaCsvPdfDeschidere(browser, base) {
  const nume = '3 CSV + PDF din Save As apar in magazie, PDF valid (xref), CSV deschis din Open (Browse)';
  try {
    const { ctx, p } = await deschideExcel(browser, base);
    try {
      await salveazaCa(p, 'export-foaie', 'csv');
      await salveazaCa(p, 'raport-foaie', 'pdf');
      const m = await magazia(p);
      const aCsv = (m.Documente || []).includes('export-foaie.csv');
      const aPdf = (m.Documente || []).includes('raport-foaie.pdf');
      // PDF-ul generat de aceeasi functie ca la salvare: structura verificata in afara browserului
      const pdf = await p.evaluate(() => window.LH.aplicatii._module.fisiere.pdfDinLinii(['Rand 1', 'Rand 2 (test)'], 'test'));
      const eroare = pdfValid(pdf);
      // Open: Ctrl+O -> Browse din backstage -> Text Files -> lista-clasei.csv -> Open
      await p.keyboard.press('Control+o');
      await pauza(300);
      await p.locator('[data-lh-aplicatie="excel"]').getByText('Browse', { exact: true }).first().click();
      await p.waitForSelector('[data-lh-fis="deschidere"]', { timeout: 5000 });
      await p.selectOption('[data-lh-fis="deschidere"] select', 'text');
      await p.locator('[data-lh-fis="deschidere"] li[data-lh-tinta="arbore:Descărcări"]').click();   // lista-clasei.csv e in Descarcari
      await p.fill('[data-lh-fis="deschidere"] input[aria-label="File name:"]', 'lista-clasei.csv');
      await p.click('[data-lh-fis="deschidere"] button.pr');
      await pauza(300);
      const s = await st(p);
      const deschis = s.nume_fisier === 'lista-clasei.csv' && JSON.stringify(s.foi) === JSON.stringify(['lista-clasei'])
        && JSON.stringify(s.celule || {}).includes('Elev 1');
      if (aCsv && aPdf && !eroare && deschis) scrie('PASS', nume, 'csv+pdf in magazie; PDF valid; lista-clasei.csv deschis (foaia lista-clasei)');
      else scrie('FAIL', nume, `csv=${aCsv} pdf=${aPdf} pdfEroare=${eroare} deschis=${deschis} nume=${s.nume_fisier} foi=${JSON.stringify(s.foi)}`);
    } finally { await ctx.close(); }
  } catch (e) { scrie('FAIL', nume, e.message); }
}

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await verificaSaveAs(browser, base);
    await verificaInlocuire(browser, base);
    await verificaCsvPdfDeschidere(browser, base);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => { console.log('FAIL eroare la rulare - ' + e.message); console.log('1'); process.exitCode = 0; });
