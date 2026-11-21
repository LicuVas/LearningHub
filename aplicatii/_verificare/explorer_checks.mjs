// Verificare Explorer (aplicatii/explorer.js): Acest PC, unitatea E: (STICK), navigare, bara de adresa, extensii, ascunse, stare().
// Clicuri si taste REALE (Playwright). Rulare:  node aplicatii/_verificare/explorer_checks.mjs   (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node). Iesire: PASS/FAIL per verificare;
// ULTIMA linie = numarul de FAIL.
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
function scrie(ok, nume, detalii) {
  if (!ok) nFail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${detalii ? ' - ' + detalii : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const EX = '[data-lh-aplicatie="explorer"]';

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  const stare = () => p.evaluate(() => window.LH.aplicatii.stare('explorer'));
  const text = async sel => ((await p.locator(sel).count()) ? p.locator(sel).first().innerText() : '');
  const clickMeniu = async eticheta => {
    await p.locator(`${EX} [data-lh-tinta="meniu_derulant"][data-lh-id="Vizualizați"]`).click();
    await pauza(250);
    await p.locator(`${EX} [data-lh-tinta="meniu"][data-lh-id="${eticheta}"]`).click();
    await pauza(300);
  };
  try {
    await p.goto(`${base}/aplicatii/poligon.html?aplicatie=explorer`, { waitUntil: 'load' });
    await p.waitForSelector(`[data-lh-aplicatie="explorer"]`, { timeout: 15000 });
    await pauza(1200);

    // 1. Acest PC din panoul din stanga (clic real)
    await p.locator(`${EX} [data-lh-tinta="arbore"][data-lh-id="Acest PC"]`).click();
    await pauza(300);
    let s = await stare();
    scrie(s.cale_curenta === 'Acest PC' && s.cale_afisata === 'Acest PC', '1 Acest PC: se deschide, bara arata „Acest PC”', `cale=${s.cale_curenta} bara=${s.cale_afisata}`);

    // 2. Unitatea E: (STICK) apare in lista, cu tipul ei
    const randE = p.locator(`${EX} .lh-ap-e-rand[data-lh-id="E:"]`);
    const txtE = (await randE.count()) ? await randE.first().innerText() : '';
    scrie(txtE.includes('STICK (E:)') && txtE.includes('Unitate amovibilă'), '2 Acest PC: unitatea E: apare ca „STICK (E:)”, tip „Unitate amovibilă”', JSON.stringify(txtE));
    const arboreE = await p.locator(`${EX} [data-lh-tinta="arbore"][data-lh-id="STICK (E:)"]`).count();
    scrie(arboreE === 1, '2b Panoul din stanga arata si „STICK (E:)” sub Acest PC', `noduri=${arboreE}`);

    // 3. Dublu-clic pe E: -> radacina stickului, bara „E:\”
    await randE.first().dblclick();
    await pauza(300);
    s = await stare();
    const crumbs = await text(`${EX} .lh-ap-e-crumbs`);
    scrie(s.cale_curenta === 'E:/' && s.cale_afisata === 'E:\\' && crumbs.includes('STICK (E:)'), '3 dublu-clic pe E: -> bara „STICK (E:)” si calea „E:\\”', `cale=${s.cale_curenta} bara=${s.cale_afisata} crumbs=${JSON.stringify(crumbs)}`);

    // 4. Dublu-clic pe folderul Excursie -> E:\Excursie, cu fisierele lui
    await p.locator(`${EX} .lh-ap-e-rand[data-lh-id="Excursie"]`).dblclick();
    await pauza(300);
    s = await stare();
    const titlu = await text(`${EX} .lh-ap-e-fila`);
    scrie(s.cale_curenta === 'E:/Excursie/' && s.cale_afisata === 'E:\\Excursie' && titlu.includes('Excursie'), '4 dublu-clic Excursie -> calea „E:\\Excursie”, titlul ferestrei arata Excursie', `cale=${s.cale_afisata} titlu=${JSON.stringify(titlu)}`);
    scrie(s.elemente_afisate.includes('munte') && s.elemente_afisate.includes('drumul'), '4b Excursie: contine munte si drumul (extensiile ascunse)', JSON.stringify(s.elemente_afisate));

    // 5. Bara de adresa: clic real pe partea goala -> caseta cu calea, scrisa cu \
    const box = await p.locator(`${EX} .lh-ap-e-adr`).boundingBox();
    await p.mouse.click(box.x + box.width - 12, box.y + box.height / 2);
    await pauza(300);
    s = await stare();
    const valCaseta = (await p.locator(`${EX} .lh-ap-e-adr-in`).count()) ? await p.locator(`${EX} .lh-ap-e-adr-in`).inputValue() : null;
    scrie(s.bara_adresa.clicata === true && valCaseta === 'E:\\Excursie', '5 clic pe bara de adresa: caseta arata „E:\\Excursie”', `clicata=${s.bara_adresa.clicata} caseta=${valCaseta}`);

    // 6. Cale scrisa de la tastatura, apoi Enter -> navigare
    await p.keyboard.press('Control+A');
    await p.keyboard.type('E:\\Scoala\\TIC');
    await pauza(200);
    s = await stare();
    scrie(s.bara_adresa.scris === 'E:\\Scoala\\TIC', '6 cale scrisa in caseta: starea o vede („bara_adresa.scris”)', `scris=${s.bara_adresa.scris}`);
    await p.keyboard.press('Enter');
    await pauza(300);
    s = await stare();
    scrie(s.cale_curenta === 'E:/Scoala/TIC/' && s.cale_afisata === 'E:\\Scoala\\TIC' && s.bara_adresa.clicata === false, '6b Enter pe cale -> E:\\Scoala\\TIC, caseta se inchide', `cale=${s.cale_afisata} clicata=${s.bara_adresa.clicata}`);

    // 7. Extensii: Vizualizati > Extensii nume de fisier (clicuri reale)
    await clickMeniu('Extensii nume de fișier');
    s = await stare();
    scrie(s.extensii_vizibile === true && s.elemente_afisate.includes('orar.txt'), '7 Vizualizati > Extensii: starea arata extensiile si numele cu .txt', `extensii=${s.extensii_vizibile} afisate=${JSON.stringify(s.elemente_afisate)}`);

    // 8. Selectie: clic pe orar.txt -> selectia in stare
    await p.locator(`${EX} .lh-ap-e-rand[data-lh-id="orar.txt"]`).click();
    await pauza(250);
    s = await stare();
    scrie(s.selectie_afisata.includes('orar.txt'), '8 clic pe orar.txt: selectia apare in stare', JSON.stringify(s.selectie_afisata));

    // 9. Elemente ascunse: Vizualizati > Elemente ascunse
    await clickMeniu('Elemente ascunse');
    s = await stare();
    scrie(s.elemente_ascunse === true, '9 Vizualizati > Elemente ascunse: starea o arata', `ascunse=${s.elemente_ascunse}`);

    // 10. Documente merge in continuare (panoul din stanga)
    await p.locator(`${EX} [data-lh-tinta="arbore"][data-lh-id="Documente"]`).click();
    await pauza(300);
    s = await stare();
    scrie(s.cale_curenta === 'Documente/' && s.cale_afisata === 'Documente' && s.elemente_afisate.includes('Teme'), '10 Documente: navigarea ramane, arata folderele din Documente', `cale=${s.cale_afisata} afisate=${JSON.stringify(s.elemente_afisate)}`);

    // 11. Inapoi (Alt+sageata stanga) readuce E:\Scoala\TIC
    await p.keyboard.press('Alt+ArrowLeft');
    await pauza(300);
    s = await stare();
    scrie(s.cale_afisata === 'E:\\Scoala\\TIC', '11 Alt+Stanga: inapoi la E:\\Scoala\\TIC', `cale=${s.cale_afisata}`);

    scrie(erori.length === 0, '12 fara erori in consola sau pagina', erori.slice(0, 3).join(' | '));
  } catch (e) {
    scrie(false, 'executie', e.message);
  } finally {
    await ctx.close();
    await browser.close();
    srv.close();
  }
  console.log(`REZUMAT FAIL=${nFail}`);
  console.log(String(nFail));
}
main();
