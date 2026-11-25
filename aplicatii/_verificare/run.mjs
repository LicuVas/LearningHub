// Verificare automata a bibliotecii aplicatii (Word, Excel, PowerPoint, Explorer, Windows).
// Rulare:  node aplicatii/_verificare/run.mjs            (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR = folder unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
// Iesire: cate o linie PASS / FAIL / SKIP per verificare; ULTIMA linie = numarul de FAIL (exit 0 mereu).
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
      // paginile nu au iconita: browserul cere /favicon.ico; raspundem 204 ca sa nu apara o eroare falsa in consola
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
const rezultate = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, nume, detalii) {
  rezultate[stare]++;
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));

async function deschide(browser, base, app, opt = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) erori.push(r.status() + ' ' + r.url()); });
  p.on('requestfailed', r => { if (!/favicon/.test(r.url())) erori.push('cerere esuata ' + r.url()); });
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=${app}`, { waitUntil: 'load' });
  await p.waitForSelector(`[data-lh-aplicatie="${app}"]`, { timeout: 15000 });
  await pauza(opt.asteapta ?? 1500);
  return { ctx, p, erori };
}

// ---------- verificarea 1: fiecare pagina se incarca fara erori in consola
async function verificaIncarcare(browser, base) {
  for (const app of ['word', 'excel', 'powerpoint', 'explorer', 'windows']) {
    const nume = `1 ${app}: se incarca fara erori in consola`;
    try {
      const { ctx, erori } = await deschide(browser, base, app);
      await ctx.close();
      if (erori.length === 0) scrie('PASS', nume);
      else scrie('FAIL', nume, erori.slice(0, 3).join(' | '));
    } catch (e) {
      scrie('FAIL', nume, e.message);
    }
  }
}

// ---------- verificarea 2: Word, Cut/Copy dezactivate fara selectie, active dupa selectie
async function verificaWord(browser, base) {
  const SEL = '[data-lh-id-mso="Cut"],[data-lh-id-mso="Copy"],[data-lh-tip="MenuItem"][data-lh-eticheta="Cut"],[data-lh-tip="MenuItem"][data-lh-eticheta="Copy"]';
  const stareButoane = p => p.evaluate(sel => {
    const els = [...document.querySelectorAll('[data-lh-aplicatie="word"] ' + sel)];
    return { n: els.length, dezact: els.filter(e => e.getAttribute('aria-disabled') === 'true').length };
  }, SEL);
  const nume1 = '2a Word: Cut si Copy dezactivate fara selectie';
  const nume2 = '2b Word: dupa tastare + Ctrl+A, Cut si Copy active';
  try {
    const { ctx, p } = await deschide(browser, base, 'word');
    try {
      const inainte = await stareButoane(p);
      if (inainte.n > 0 && inainte.dezact === inainte.n) scrie('PASS', nume1, `${inainte.n} comenzi, toate dezactivate`);
      else scrie('FAIL', nume1, `din ${inainte.n} comenzi, ${inainte.dezact} dezactivate`);

      await p.keyboard.type('Ana are mere');
      await pauza(300);
      await p.keyboard.press('Control+A');
      await pauza(400);
      const text = await p.evaluate(() => JSON.stringify(window.LH.aplicatii.stare('word').text));
      const dupa = await stareButoane(p);
      if (!text.includes('Ana are mere')) scrie('FAIL', nume2, 'textul tastat nu apare in modelul aplicatiei: ' + text);
      else if (dupa.n > 0 && dupa.dezact === 0) scrie('PASS', nume2, `${dupa.n} comenzi active`);
      else scrie('FAIL', nume2, `dupa Ctrl+A: ${dupa.dezact} din ${dupa.n} inca dezactivate`);
    } finally {
      await ctx.close();
    }
  } catch (e) {
    scrie('FAIL', nume1, e.message);
    scrie('FAIL', nume2, e.message);
  }
}

// ---------- verificarea 3: Excel, sortare cu formule pe randuri
function normFormula(f) { return (f || '').replace(/\s+/g, '').toUpperCase(); }

async function verificaExcel(browser, base) {
  const nume = '3 Excel: sortare A-Z pastreaza formulele pe randurile lor (F1:G3 = 3,1,2 cu =F*10)';
  try {
    const { ctx, p } = await deschide(browser, base, 'excel');
    try {
      // clic real (mouse) pe celula; Playwright deruleaza pana la ea
      const celula = async a => {
        const loc = p.locator(`[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${a}"]`);
        if ((await loc.count()) === 0) return false;
        await loc.first().click();
        return true;
      };
      for (const [a, txt] of [['F1', '3'], ['F2', '1'], ['F3', '2'], ['G1', '=F1*10'], ['G2', '=F2*10'], ['G3', '=F3*10']]) {
        if (!(await celula(a))) throw new Error('celula ' + a + ' nu exista in ecran');
        await p.keyboard.type(txt);
        await p.keyboard.press('Enter');
        await pauza(120);
      }
      // selectie F1:G3 cu tastatura
      await celula('F1');
      await p.keyboard.down('Shift');
      await p.keyboard.press('ArrowDown');
      await p.keyboard.press('ArrowDown');
      await p.keyboard.press('ArrowRight');
      await p.keyboard.up('Shift');
      await pauza(200);
      // Data > Sort A to Z
      const areButon = await p.evaluate(() => !!window.LH.aplicatii.element('excel', 'mso:SortAscendingExcel'));
      if (!areButon) {
        await p.evaluate(() => window.LH.aplicatii.element('excel', 'fila:Data').click());
        await pauza(250);
      }
      const click = await p.evaluate(() => {
        const b = window.LH.aplicatii.element('excel', 'mso:SortAscendingExcel');
        if (b) b.click();
        return !!b;
      });
      if (!click) throw new Error('butonul Sort A to Z nu e vizibil');
      await pauza(500);
      const st = await p.evaluate(() => window.LH.aplicatii.stare('excel'));
      const c = st.celule || {};
      const v = a => c[a] && c[a].valoare;
      const f = a => normFormula(c[a] && c[a].formula);
      const probleme = [];
      if (v('F1') !== 1 || v('F2') !== 2 || v('F3') !== 3) probleme.push(`valori F1:F3=${v('F1')},${v('F2')},${v('F3')} (asteptat 1,2,3)`);
      if (f('G1') !== '=F1*10' || f('G2') !== '=F2*10' || f('G3') !== '=F3*10') probleme.push(`formule G1:G3=${f('G1')},${f('G2')},${f('G3')} (asteptat =F1*10,=F2*10,=F3*10)`);
      if (v('G1') !== 10 || v('G2') !== 20 || v('G3') !== 30) probleme.push(`valori G1:G3=${v('G1')},${v('G2')},${v('G3')} (asteptat 10,20,30)`);
      if (probleme.length === 0) scrie('PASS', nume);
      else scrie('FAIL', nume, probleme.join('; '));
    } finally {
      await ctx.close();
    }
  } catch (e) {
    scrie('FAIL', nume, e.message);
  }
}

// ---------- verificarea 4: PowerPoint, Delete in Animation Pane sterge doar animatia
// Pas cu pas, prin UI-ul bibliotecii: Insert > Shapes > Rectangle, clic pe diapozitiv (forma);
// Animations > Animation Gallery > Fly In (animatia); Animations > Animation Pane (panoul);
// clic pe randul animatiei in panou, apoi Delete. Verificare: animatiile -1, forma ramane.
async function verificaPowerPoint(browser, base) {
  const nume = '4 PowerPoint: Delete in Animation Pane scoate doar animatia, forma ramane';
  try {
    const { ctx, p } = await deschide(browser, base, 'powerpoint');
    try {
      // click JS pe un element vizibil cu eticheta data (ribbon, galerie, lista); true daca a existat
      const clicVizibil = (eticheta, tip) => p.evaluate(([et, tp]) => {
        const c = [...document.querySelectorAll('[data-lh-aplicatie="powerpoint"] [data-lh-eticheta]')]
          .filter(e => e.getAttribute('data-lh-eticheta') === et && (!tp || e.getAttribute('data-lh-tip') === tp))
          .find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
        if (c) c.click();
        return !!c;
      }, [eticheta, tip || null]);
      const stare = () => p.evaluate(() => window.LH.aplicatii.stare('powerpoint'));
      const pas = async (et, tip) => { if (!(await clicVizibil(et, tip))) throw new Error('nu gasesc "' + et + '" pe ecran'); await pauza(300); };

      // 1) forma pe diapozitiv (Insert > Shapes > Rectangle, apoi clic pe diapozitiv)
      await pas('Insert', 'TabItem');
      await pas('Shapes', 'MenuItem');
      await pas('Rectangle', 'ListItem');
      const cadru = await p.evaluate(() => { const s = document.querySelector('[data-lh-aplicatie="powerpoint"] .lh-ap-p-slide'); const r = s.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      await p.mouse.click(cadru.x + cadru.w * 0.3, cadru.y + cadru.h * 0.6);
      await pauza(400);
      const s1 = await stare();
      const nForme0 = s1.diapozitive.reduce((t, d) => t + d.forme, 0);
      const anim0 = (s1.ordine_animatii || []).length;

      // 2) animatie: Animations > Animation Gallery > Fly In (forma ramane selectata)
      await pas('Animations', 'TabItem');
      await p.evaluate(() => window.LH.aplicatii.element('powerpoint', 'mso:AnimationGallery').click());
      await pauza(300);
      await pas('Fly In', 'ListItem');
      await pauza(300);
      const s2 = await stare();
      const anim1 = (s2.ordine_animatii || []).length;

      // 3) Animation Pane, clic pe randul animatiei, Delete cu focul in panou
      await pas('Animation Pane', 'Button');
      await pauza(400);
      const rand = p.locator('[data-lh-aplicatie="powerpoint"] [data-lh-eticheta]', { hasText: /Fly In/ }).filter({ hasNotText: /Animation Styles/ });
      const randuri = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="powerpoint"] .lh-ap-p-panou [data-lh-tip="ListItem"]')].filter(e => e.getBoundingClientRect().width > 0 && /Fly In|Entrance/.test(e.textContent)).length);
      if (randuri === 0) throw new Error('niciun rand de animatie vizibil in Animation Pane');
      await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="powerpoint"] .lh-ap-p-panou [data-lh-tip="ListItem"]')].find(e => e.getBoundingClientRect().width > 0 && /Fly In|Entrance/.test(e.textContent)).click());
      await pauza(300);
      await p.keyboard.press('Delete');
      await pauza(400);

      const s3 = await stare();
      const anim2 = (s3.ordine_animatii || []).length;
      const nForme2 = s3.diapozitive.reduce((t, d) => t + d.forme, 0);
      const probleme = [];
      if (anim0 !== 0) probleme.push(`animatii inainte=${anim0} (asteptat 0)`);
      if (anim1 !== 1) probleme.push(`dupa Fly In animatii=${anim1} (asteptat 1)`);
      if (anim2 !== anim1 - 1) probleme.push(`dupa Delete in panou animatii=${anim2} (asteptat ${anim1 - 1})`);
      if (nForme2 !== nForme0) probleme.push(`forme ${nForme0} -> ${nForme2} (forma trebuia sa ramana)`);
      if (probleme.length === 0) scrie('PASS', nume, `animatii 1 -> 0, forme ${nForme2}`);
      else scrie('FAIL', nume, probleme.join('; '));
    } finally {
      await ctx.close();
    }
  } catch (e) {
    scrie('FAIL', nume, e.message);
  }
}

// ---------- verificarea 5: Explorer, taie un folder si lipeste in propriul subfolder
async function verificaExplorer(browser, base) {
  const nume = '5 Explorer: taie folderul si lipeste in subfolderul lui => folderul nu se pierde + mesaj Windows';
  const MESAJ = 'The destination folder is a subfolder of the source folder.';
  const gasesteRand = () => {
    const toate = [...document.querySelectorAll('[data-lh-aplicatie="explorer"] [data-lh-tinta]')];
    return toate.find(e => e.getAttribute('data-lh-tinta') !== 'arbore' && (e.textContent || '').trim().startsWith('Proiect') && e.textContent.trim().length < 40) || null;
  };
  try {
    const { ctx, p } = await deschide(browser, base, 'explorer');
    try {
      // randul folderului Proiect: eticheta lui din lista (nu din arborele din stanga)
      const rand = p.locator('[data-lh-aplicatie="explorer"] [data-lh-tinta="lista"] span', { hasText: /^Proiect$/ });
      if ((await rand.count()) === 0) throw new Error('nu gasesc randul Proiect in lista');
      await rand.first().click();
      await pauza(200);
      await p.keyboard.press('Control+X');
      await pauza(200);
      await rand.first().dblclick();
      await pauza(400);
      await p.keyboard.press('Control+V');
      await pauza(500);
      const vazut = await p.evaluate(m => (document.body.innerText || '').includes(m), MESAJ);
      const stare = await p.evaluate(() => JSON.stringify(window.LH.aplicatii.stare('explorer')));
      const probleme = [];
      if (!vazut) probleme.push('mesajul Windows nu apare');
      if (!stare.includes('Proiect')) probleme.push('folderul Proiect a disparut din modelul aplicatiei');
      if (probleme.length === 0) scrie('PASS', nume);
      else scrie('FAIL', nume, probleme.join('; '));
    } finally {
      await ctx.close();
    }
  } catch (e) {
    scrie('FAIL', nume, e.message);
  }
}

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await verificaIncarcare(browser, base);
    await verificaWord(browser, base);
    await verificaExcel(browser, base);
    await verificaPowerPoint(browser, base);
    await verificaExplorer(browser, base);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL} SKIP=${rezultate.SKIP}`);
  console.log(String(nFail));
}

main().catch(e => {
  console.log('FAIL harness - ' + e.message);
  console.log('1');
});
