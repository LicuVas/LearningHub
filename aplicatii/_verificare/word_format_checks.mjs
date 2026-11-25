// Verificare automata a formatarii Word: caseta Font Size, B pe selectie mixta, aliniere, caseta Paragraph, retrageri,
// Tab la inceputul paragrafului, interlinia 1,0-3,0 si Ctrl+1/2/5, galeria Margins, Custom Margins, galeria de stiluri.
// Fiecare verificare porneste o pagina proaspata si foloseste clicuri si taste reale (Playwright). Starea se citeste din
// window.LH.aplicatii.stare('word'). Iesire: cate o linie PASS / FAIL; ULTIMA linie = numarul de FAIL (exit 0 mereu).
// Rulare:  node aplicatii/_verificare/word_format_checks.mjs      (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR = folderul unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
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
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

let nFail = 0;
const pauza = ms => new Promise(r => setTimeout(r, ms));
function scrie(stare, nume, detalii) {
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`);
}

async function deschide(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=word`, { waitUntil: 'load' });
  await p.waitForSelector('[data-lh-aplicatie="word"]', { timeout: 15000 });
  await pauza(1200);
  return { ctx, p, erori };
}

const stare = p => p.evaluate(() => window.LH.aplicatii.stare('word'));
// formatul fiecarui caracter al textului dat (null daca textul nu e in document)
function formatDe(st, text) {
  const bucati = st.formatare_pe_caractere;
  const plin = bucati.map(b => b.text).join('');
  const k = plin.indexOf(text);
  if (k < 0) return null;
  const out = [];
  let pos = 0;
  for (const b of bucati) for (let j = 0; j < b.text.length; j++) { if (pos >= k && pos < k + text.length) out.push(b); pos++; }
  return out;
}
const alertaAre = (p, txt) => p.evaluate(t => [...document.querySelectorAll('.lh-ap-alerta')].some(x => x.innerText.includes(t)), txt);
const pe = (p, sel) => p.locator(sel).first();
async function scrieNumar(p, sel, valoare) {
  await pe(p, sel).click();
  await p.keyboard.press('Control+A');
  await p.keyboard.type(valoare);
  await pauza(150);
}
async function clicPe(p, sel) { await pe(p, sel).click(); await pauza(350); }
// clic real cu mouse-ul in centrul casutei (pentru galeria de stiluri, unde o dala poate fi taiata de derulare)
async function clicXY(p, sel) {
  const b = await pe(p, sel).boundingBox();
  if (!b) throw new Error("fara casuta: " + sel);
  await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await pauza(350);
}

async function verifica(browser, base, nume, fn) {
  try {
    const { ctx, p, erori } = await deschide(browser, base);
    try {
      const r = await fn(p);
      if (erori.length) scrie('FAIL', nume, 'erori: ' + erori.slice(0, 2).join(' | '));
      else if (r === true) scrie('PASS', nume);
      else scrie('FAIL', nume, String(r));
    } finally { await ctx.close(); }
  } catch (e) { scrie('FAIL', nume, e.message.split('\n')[0]); }
}

const CM_PX = 96 / 2.54;

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await verifica(browser, base, '3a Font Size: 13,3 pe selectie -> 13', async p => {
      await p.keyboard.type('Ana are mere');
      await p.keyboard.press('Control+A');
      await scrieNumar(p, '[data-lh-id-mso="FontSize"] input', '13.3');
      await p.keyboard.press('Enter');
      await pauza(300);
      const f = formatDe(await stare(p), 'Ana are mere');
      return f && f.length && f.every(b => b.marime === 13) ? true : 'marimea: ' + JSON.stringify(f && f[0]);
    });
    await verifica(browser, base, '3b Font Size: „abc” -> „This is not a valid number.”', async p => {
      await p.keyboard.type('Ana');
      await p.keyboard.press('Control+A');
      await scrieNumar(p, '[data-lh-id-mso="FontSize"] input', 'abc');
      await p.keyboard.press('Enter');
      await pauza(300);
      return (await alertaAre(p, 'This is not a valid number.')) ? true : 'mesajul nu apare';
    });
    await verifica(browser, base, '3c Font Size: 2000 -> „The number must be between 1 and 1638.”', async p => {
      await p.keyboard.type('Ana');
      await p.keyboard.press('Control+A');
      await scrieNumar(p, '[data-lh-id-mso="FontSize"] input', '2000');
      await p.keyboard.press('Enter');
      await pauza(300);
      if (!(await alertaAre(p, 'The number must be between 1 and 1638.'))) return 'mesajul de interval nu apare';
      await pe(p, '.lh-ap-alerta-ok').click();
      await pauza(300);
      return (await p.locator('.lh-ap-alerta').count()) === 0 ? true : 'fereastra nu s-a inchis cu OK';
    });
    await verifica(browser, base, '3d Font Size: lista are 16 marimi, 8 … 72', async p => {
      await p.keyboard.type('Ana');
      await clicPe(p, '[data-lh-id-mso="FontSize"] [data-lh-tip="Button"]');
      const txt = await p.locator('.lh-ap-lista-ref [data-lh-tip="ListItem"]').allInnerTexts();
      return txt.length === 16 && txt[0].trim() === '8' && txt[15].trim() === '72' ? true : `randuri=${txt.length} ${JSON.stringify(txt.slice(0, 3))}`;
    });
    /* Word real hotărăște după PRIMUL caracter al selecției (COM, LearningHub/lectii/vii/m1-l06/_proba/rezultate_word.json
       › bold_amestecat_primul_normal / _primul_aldin): aici primul caracter („A”) e normal, deci B îngroașă tot.
       Varianta veche („Ab” aldin, deci primul aldin) cerea opusul lui Word — corectată de dirijorul nopții Word, 23.11. */
    await verifica(browser, base, '4a B pe selectie mixta: toata selectia, apoi scoate', async p => {
      await p.keyboard.type('Ab cd');
      await p.keyboard.press('Home');
      await p.keyboard.press('ArrowRight');
      await p.keyboard.press('Shift+ArrowRight');
      await p.keyboard.press('Control+B');
      await p.keyboard.press('Control+A');
      await p.keyboard.press('Control+B');
      await pauza(200);
      const f1 = formatDe(await stare(p), 'Ab cd');
      if (!f1 || !f1.every(b => b.bold)) return 'dupa primul B nu e toata selectia ingrosata';
      await p.keyboard.press('Control+B');
      await pauza(200);
      const f2 = formatDe(await stare(p), 'Ab cd');
      return f2 && f2.every(b => !b.bold) ? true : 'al doilea B nu scoate ingrosarea';
    });
    await verifica(browser, base, '4b Aliniere: Center (clic), a doua oara revine la stanga', async p => {
      await p.keyboard.type('Ana are mere');
      await clicPe(p, '[data-lh-id-mso="AlignCenter"]');
      const a1 = (await stare(p)).aliniere_paragrafe[0];
      await clicPe(p, '[data-lh-id-mso="AlignCenter"]');
      const a2 = (await stare(p)).aliniere_paragrafe[0];
      return a1 === 'centru' && a2 === 'stanga' ? true : `dupa 1: ${a1}, dupa 2: ${a2}`;
    });
    await verifica(browser, base, '5a Paragraph: retragere si prima linie din caseta Paragraph', async p => {
      await p.keyboard.type('Ana are mere');
      await clicPe(p, '[data-lh-id-mso="LineSpacingGallery"]');
      await clicPe(p, '[data-lh-tinta="meniu:Line Spacing Options…"]');
      const d = '[data-lh-suprafata="dialog.ParagraphDialog"]';
      await scrieNumar(p, `${d} [data-lh-tinta="camp:Before text"] input`, '1,25');
      await scrieNumar(p, `${d} [data-lh-tinta="camp:By"] input`, '1,25');
      await scrieNumar(p, `${d} [data-lh-tinta="camp:Before"] input`, '6');
      await clicPe(p, `${d} [data-lh-tinta="fereastra:OK"]`);
      await pauza(300);
      const st = await p.evaluate(() => {
        const par = document.querySelector('[data-lh-aplicatie="word"] .lh-ap-par');
        return par ? { ml: getComputedStyle(par).marginLeft, ti: getComputedStyle(par).textIndent } : null;
      });
      return st && parseFloat(st.ml) > 40 ? true : 'retragerea nu apare pe paragraf: ' + JSON.stringify(st);
    });
    await verifica(browser, base, '5b Increase Indent = 1,25 cm', async p => {
      await p.keyboard.type('Ana are mere');
      await clicPe(p, '[data-lh-id-mso="IndentIncreaseWord"]');
      const ml = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-lh-aplicatie="word"] .lh-ap-par')).marginLeft));
      return Math.abs(ml - 1.25 * CM_PX) < 1.5 ? true : 'margine stanga ' + ml + 'px';
    });
    await verifica(browser, base, '5c Tab la inceput de paragraf = prima linie retrasa, fara caracter Tab', async p => {
      await p.keyboard.type('Ana are mere');
      await p.keyboard.press('Home');
      await p.keyboard.press('Tab');
      await pauza(200);
      const st = await stare(p);
      const ti = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-lh-aplicatie="word"] .lh-ap-par')).textIndent));
      return !st.text[0].includes('\t') && Math.abs(ti - 1.25 * CM_PX) < 1.5 ? true : `text=${JSON.stringify(st.text[0])} retragere=${ti}`;
    });
    await verifica(browser, base, '6a Ctrl+2 dublu, Ctrl+5 1,5, Ctrl+1 simplu', async p => {
      await p.keyboard.type('Ana are mere');
      const lh = () => p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-lh-aplicatie="word"] .lh-ap-par')).lineHeight));
      await p.keyboard.press('Control+2');
      const a = await lh();
      await p.keyboard.press('Control+5');
      const b = await lh();
      await p.keyboard.press('Control+1');
      const c = await lh();
      const fs16 = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-lh-aplicatie="word"] .lh-ap-par')).fontSize));
      const ok = (x, v) => Math.abs(x - v * 1.2 * fs16) < 2;
      return ok(a, 2) && ok(b, 1.5) && ok(c, 1) ? true : `dublu=${a} 1,5=${b} simplu=${c} (font ${fs16})`;
    });
    await verifica(browser, base, '6b Meniul Line Spacing: 1,0 … 3,0', async p => {
      await clicPe(p, '[data-lh-id-mso="LineSpacingGallery"]');
      const n = (await p.locator('.lh-ap-meniu [data-lh-tinta^="meniu:"]').allInnerTexts()).map(x => x.trim());
      const cer = ['1,0', '1,15', '1,5', '2,0', '2,5', '3,0'];
      return cer.every(c => n.includes(c)) ? true : 'randuri: ' + JSON.stringify(n);
    });
    await verifica(browser, base, '7a Margins: Moderate Margins', async p => {
      await clicPe(p, '[data-lh-tip="TabItem"][data-lh-eticheta="Layout"]');
      await clicPe(p, '[data-lh-id-mso="PageMarginsGallery"]');
      await clicPe(p, '[data-lh-tinta="meniu:Moderate Margins"]');
      const m = (await stare(p)).pagina.margini_cm;
      return m.sus === 2.54 && m.stanga === 1.91 && m.dreapta === 1.91 ? true : JSON.stringify(m);
    });
    await verifica(browser, base, '7b Margins: Custom Margins, Top 3 cm', async p => {
      await clicPe(p, '[data-lh-tip="TabItem"][data-lh-eticheta="Layout"]');
      await clicPe(p, '[data-lh-id-mso="PageMarginsGallery"]');
      await clicPe(p, '[data-lh-tinta="meniu:Custom Margins"]');
      await scrieNumar(p, '[data-lh-suprafata="dialog.PageSetupDialog"] [data-lh-tinta="camp:Top"] input', '3');
      await clicPe(p, '[data-lh-suprafata="dialog.PageSetupDialog"] [data-lh-tinta="fereastra:OK"]');
      await pauza(300);
      const m = (await stare(p)).pagina.margini_cm;
      return m.sus === 3 ? true : JSON.stringify(m);
    });
    await verifica(browser, base, '8a Stiluri: Heading 1 = 16, Title = 28', async p => {
      await p.keyboard.type('Titlu');
      await p.keyboard.press('Control+A');
      await clicXY(p, '[data-lh-id-mso="QuickStylesGallery"] [data-lh-tinta="meniu:Heading 1"]');
      const h = formatDe(await stare(p), 'Titlu');
      await p.keyboard.press('Control+A');
      /* Title nu e pe prima linie de dale: se deschide galeria întreagă (săgeata Styles) și se alege din ea */
      await clicPe(p, '[data-lh-tinta="panglica:Home/Styles/Styles"]');
      await clicPe(p, '.lh-ap-galerie [data-lh-tinta="meniu:Title"]');
      const t = formatDe(await stare(p), 'Titlu');
      return h && h[0].marime === 16 && t && t[0].marime === 28 ? true : `h1=${h && h[0].marime} title=${t && t[0].marime}`;
    });
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => {
  console.log('FAIL harness - ' + e.message);
  console.log('1');
});
