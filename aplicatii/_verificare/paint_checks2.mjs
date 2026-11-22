// Verificari pentru partea a doua a Paint-ului (aplicatii/paint.js): selectie/mutare/taiere/copiere/lipire,
// grupul Imagine, salvare JPG/BMP/GIF, „Salvați modificările?”, text (font, dimensiune, ingrosat, cursiv), Editare culori.
// Rulare:  node aplicatii/_verificare/paint_checks2.mjs            (din radacina depozitului)
// Variabila optionala: HARNESS_PW_DIR = folder unde e instalat `playwright` (implicit: C:/00/AI_0/.scratch/harness-node)
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL (exit 0 mereu).
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
const TOT = '[data-lh-aplicatie="paint"]';
const PANZA = `${TOT} canvas[data-lh-zona="panza"]`;

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
    srv.listen(0, '127.0.0.1', () => resolve(srv));   // port liber, ales de sistem
  });
}

let nFail = 0;
function scrie(ok, nume, detalii) {
  if (!ok) nFail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${detalii ? ' - ' + detalii : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const st = p => p.evaluate(() => window.LH.aplicatii.stare('paint'));
const btn = (p, t) => p.locator(`${TOT} [data-lh-tinta="${t}"]`);

// coordonatele pânzei (pixeli) -> ecran; caseta se citește o singură dată per gest
async function caseta(p) {
  const c = p.locator(PANZA);
  await c.scrollIntoViewIfNeeded();
  const b = await c.boundingBox();
  const s = await st(p);
  return { b, W: s.panza.latime, H: s.panza.inaltime };
}
const ec = (k, x, y) => ({ x: k.b.x + (x + 0.5) * k.b.width / k.W, y: k.b.y + (y + 0.5) * k.b.height / k.H });

async function trage(p, pts) {                                         // pts: [[x,y], ...] în pixeli; primul = apăsare, ultimul = eliberare
  const k = await caseta(p);
  const a = ec(k, pts[0][0], pts[0][1]), [ex, ey] = pts[pts.length - 1];
  await p.mouse.move(a.x, a.y); await p.mouse.down();
  for (let i = 1; i <= 20; i++) {
    const q = ec(k, pts[0][0] + (ex - pts[0][0]) * i / 20, pts[0][1] + (ey - pts[0][1]) * i / 20);
    await p.mouse.move(q.x, q.y);
  }
  await p.mouse.up();
  await pauza(60);
}
async function clicPanza(p, x, y) { const k = await caseta(p); const q = ec(k, x, y); await p.mouse.click(q.x, q.y); await pauza(60); }

// citește pixeli / numără pixeli întunecați din pânză (în pagină)
const pixel = (p, x, y) => p.evaluate(([x, y, sel]) => {
  const c = document.querySelector(sel), d = c.getContext('2d').getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]];
}, [x, y, PANZA]);
const intunecati = (p, x0, y0, w, h) => p.evaluate(([x0, y0, w, h, sel]) => {
  const d = document.querySelector(sel).getContext('2d').getImageData(x0, y0, w, h).data; let n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i] < 80 && d[i + 1] < 80 && d[i + 2] < 80) n++;
  return n;
}, [x0, y0, w, h, PANZA]);
const negru = v => v[0] < 80 && v[1] < 80 && v[2] < 80;
const alb = v => v.every(c => c > 240);

async function deschide(browser, base, erori) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) erori.push(r.status() + ' ' + r.url()); });
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=paint`, { waitUntil: 'load' });
  await p.waitForSelector(PANZA, { timeout: 15000 });
  await pauza(600);
  return { ctx, p };
}
const linie = p => trage(p, [[200, 120], [400, 120]]);                  // linie neagră orizontală (creionul e unealta implicită)

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const erori = [];
  const sesiuni = [];
  const nou = async () => { const s = await deschide(browser, base, erori); sesiuni.push(s); return s.p; };
  const grup = async (nume, f) => {
    try { await f(); } catch (e) { scrie(false, nume + ' - verificare întreruptă', e.message.split('\n')[0]); }
  };
  try {
    // 1. Selectie: mutare, taiere, copiere, lipire, stergere, selectare totala
    await grup('sel', async () => {
      const p = await nou();
      scrie(await btn(p, 'buton:Copiere').isDisabled() && await btn(p, 'buton:Lipire').isDisabled(),
        '1a Copiere și Lipire sunt inactive fără selecție și fără clipboard');
      await linie(p);
      await btn(p, 'unealta:selectie').click();
      await trage(p, [[190, 110], [410, 130]]);
      let s = await st(p);
      scrie(s.selectie && s.selectie.x0 === 190 && s.selectie.y1 === 130, '1b Selectare dreptunghi cu mouse-ul', JSON.stringify(s.selectie));
      await trage(p, [[300, 120], [400, 170]]);                         // trag din interiorul selecției: o mut cu 100 px dreapta, 50 jos
      s = await st(p);
      scrie(s.selectie && s.selectie.x0 === 290 && s.selectie.y0 === 160, '1c Selecția se mută trăgând din interiorul ei', JSON.stringify(s.selectie));
      scrie(negru(await pixel(p, 350, 170)) && alb(await pixel(p, 350, 120)), '1d După mutare, linia e în locul nou și vechiul loc e alb');
      await p.locator(PANZA).focus();
      await p.keyboard.press('Control+x');
      await pauza(80);
      s = await st(p);
      scrie(s.portapapier && s.portapapier.latime === 221 && s.portapapier.inaltime === 21 && alb(await pixel(p, 350, 170)),
        '1e Ctrl+X: selecția intră în clipboard (221×21) și dispare din pânză', JSON.stringify(s.portapapier));
      await p.keyboard.press('Control+v');
      await pauza(80);
      s = await st(p);
      const n1 = await intunecati(p, 0, 0, 221, 21);
      scrie(s.selectie && s.selectie.x0 === 0 && s.selectie.y0 === 0 && n1 > 150, '1f Ctrl+V: lipește în colțul de sus-stânga, cu linia (pixeli întunecați ' + n1 + ')');
      await p.keyboard.press('Delete');
      await pauza(60);
      scrie((await intunecati(p, 0, 0, 221, 21)) === 0, '1g Delete șterge selecția (zona devine albă)');
      await p.keyboard.press('Control+z');
      await pauza(60);
      scrie((await intunecati(p, 0, 0, 221, 21)) > 150, '1h Ctrl+Z readuce pixelii după ștergere');
      await btn(p, 'buton:Copiere').click();
      await pauza(60);
      await btn(p, 'buton:Lipire').click();
      await pauza(60);
      scrie((await st(p)).unealta === 'selectie', '1i Butonul Lipire din panglică (cu clipboard) trece pe Selectare');
      await p.keyboard.press('Control+a');
      s = await st(p);
      scrie(s.selectie && s.selectie.x1 === 639 && s.selectie.y1 === 479, '1j Ctrl+A selectează toată pânza');
    });

    // 2. Grupul Imagine: rotiri si rasturnari (maparea pixelilor, inversul fiecarei operatii)
    await grup('imagine', async () => {
      const p = await nou();
      await linie(p);                                                   // linia (200..400, 120) în 640×480
      await btn(p, 'buton:Rotire la dreapta 90°').click();
      let s = await st(p);
      scrie(s.panza.latime === 480 && s.panza.inaltime === 640, '2a Rotire la dreapta 90°: pânza devine 480×640', JSON.stringify(s.panza));
      scrie(negru(await pixel(p, 359, 300)), '2b Rotire la dreapta: linia orizontală devine verticală (x=359)');
      await btn(p, 'buton:Rotire la stânga 90°').click();
      s = await st(p);
      scrie(s.panza.latime === 640 && s.panza.inaltime === 480 && negru(await pixel(p, 300, 120)), '2c Rotire la stânga 90° revine la 640×480 și la linia inițială');
      await btn(p, 'buton:Rotire cu 180°').click();
      scrie(negru(await pixel(p, 339, 359)) && (await st(p)).panza.latime === 640, '2d Rotire cu 180°: linia ajunge la (339,359)');
      await btn(p, 'buton:Răsturnare orizontală').click();
      scrie(negru(await pixel(p, 300, 359)), '2e Răsturnare orizontală: (339,359) -> (300,359)');
      await btn(p, 'buton:Răsturnare verticală').click();
      scrie(negru(await pixel(p, 300, 120)), '2f Răsturnare verticală: revine la (300,120)');
      await btn(p, 'buton:Rotire personalizată').click();
      scrie(await p.locator(`${TOT} [data-lh-nesimulat]`).count() >= 1, '2g Rotire personalizată: mesaj central „nesimulat”');
    });

    // 3. Redimensionare si inclinare (pixeli, procente, undo, inclinare)
    await grup('redimensionare', async () => {
      const p = await nou();
      await linie(p);
      await btn(p, 'buton:Redimensionati si inclinati').click();
      await p.locator(`${TOT} [role="dialog"] input[aria-label="Orizontal"]`).fill('50');
      await p.locator(`${TOT} [role="dialog"] input[aria-label="Vertical"]`).fill('50');
      await btn(p, 'buton:OK').click();
      let s = await st(p);
      scrie(s.panza.latime === 320 && s.panza.inaltime === 240, '3a Redimensionare 50 %: 320×240', JSON.stringify(s.panza));
      await p.locator(PANZA).focus();
      await p.keyboard.press('Control+z');
      s = await st(p);
      scrie(s.panza.latime === 640 && s.panza.inaltime === 480 && negru(await pixel(p, 300, 120)), '3b Ctrl+Z după redimensionare readuce 640×480 și pixelii');
      await btn(p, 'buton:Redimensionati si inclinati').click();
      await p.locator(`${TOT} [role="dialog"] input[aria-label="Pixeli"]`).check();
      await p.locator(`${TOT} [role="dialog"] input[aria-label="Orizontal"]`).fill('200');
      await btn(p, 'buton:OK').click();
      s = await st(p);
      scrie(s.panza.latime === 200 && s.panza.inaltime === 150, '3c Pixeli, raport păstrat: 200 × 150 (din 200 orizontal)', JSON.stringify(s.panza));
      await p.locator(PANZA).focus();
      await p.keyboard.press('Control+z');
      await btn(p, 'buton:Redimensionati si inclinati').click();
      await p.locator(`${TOT} [role="dialog"] input[aria-label="Înclinare orizontală"]`).fill('10');
      await btn(p, 'buton:OK').click();
      s = await st(p);
      scrie(s.panza.latime === 640 + Math.round(Math.tan(10 * Math.PI / 180) * 479) && s.panza.inaltime === 480,
        '3d Înclinare orizontală 10°: lățime crește cu tan(10°)·479', JSON.stringify(s.panza));
    });

    // 4. Decupare dupa selectie
    await grup('decupare', async () => {
      const p = await nou();
      await linie(p);
      scrie(await btn(p, 'buton:Decupare').isDisabled(), '4a Decupare e inactivă fără selecție');
      await btn(p, 'unealta:selectie').click();
      await trage(p, [[190, 110], [410, 130]]);
      await btn(p, 'buton:Decupare').click();
      const s = await st(p);
      scrie(s.panza.latime === 221 && s.panza.inaltime === 21 && s.selectie === null, '4b Decupare: pânza devine selecția (221×21)', JSON.stringify(s.panza));
    });

    // 5. Salvare JPG, BMP, GIF: tipul vine din lista „Salvare ca tip”; BMP si GIF se decodeaza in browser si se compara
    await grup('salvare', async () => {
      const p = await nou();
      await linie(p);
      await p.locator(PANZA).focus();
      const salveazaCa = async (nume, tip) => {
        await p.keyboard.press('Control+Shift+S');
        await p.locator(`${TOT} input[aria-label="Nume fișier"]`).fill(nume);
        await p.locator(`${TOT} select[aria-label="Salvare ca tip"]`).selectOption(tip);
        await p.locator(`${TOT} input[aria-label="Nume fișier"]`).press('Enter');
        await pauza(150);
      };
      const magazie = () => p.evaluate(() => window.LH.aplicatii._module.paint.magazie);
      const decodeaza = cheie => p.evaluate(async ([cheie, sel]) => {
        const src = window.LH.aplicatii._module.paint.magazie[cheie];
        const img = new Image(); img.src = src; await img.decode();
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        const o = document.querySelector(sel).getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let dif = 0, suma = 0;
        for (let i = 0; i < d.length; i += 4) {
          const e = Math.abs(d[i] - o[i]) + Math.abs(d[i + 1] - o[i + 1]) + Math.abs(d[i + 2] - o[i + 2]);
          suma += e; if (e) dif++;
        }
        return { w: c.width, h: c.height, dif, medie: suma / (d.length / 4) };
      }, [cheie, PANZA]);
      await salveazaCa('foto', 'jpg');
      let m = await magazie();
      scrie(m['foto.jpg'] && m['foto.jpg'].startsWith('data:image/jpeg'), '5a Salvare ca JPEG: foto.jpg în magazie');
      const j = await decodeaza('foto.jpg');
      scrie(j.w === 640 && j.h === 480 && j.medie < 4, '5b JPEG se decodează (640×480), eroare medie mică', 'medie ' + j.medie.toFixed(2));
      await salveazaCa('desen', 'bmp');
      m = await magazie();
      scrie(m['desen.bmp'] && m['desen.bmp'].startsWith('data:image/bmp'), '5c Salvare ca BMP: desen.bmp în magazie');
      const b = await decodeaza('desen.bmp');
      scrie(b.w === 640 && b.h === 480 && b.dif === 0, '5d BMP se decodează identic cu pânza (0 pixeli diferiți)', 'diferiți ' + b.dif);
      await salveazaCa('desen', 'gif');
      m = await magazie();
      scrie(m['desen.gif'] && m['desen.gif'].startsWith('data:image/gif'), '5e Salvare ca GIF: desen.gif în magazie');
      const g = await decodeaza('desen.gif');
      scrie(g.w === 640 && g.h === 480 && g.dif === 0, '5f GIF (≤256 culori) se decodează identic cu pânza', 'diferiți ' + g.dif);
      // peste 256 de culori: zgomot aleator pe pânză, apoi GIF
      await p.evaluate(() => {
        const c = document.querySelector('[data-lh-aplicatie="paint"] canvas[data-lh-zona="panza"]'), g = c.getContext('2d');
        const im = g.createImageData(640, 480);
        for (let i = 0; i < im.data.length; i += 4) {
          im.data[i] = Math.random() * 256 | 0; im.data[i + 1] = Math.random() * 256 | 0; im.data[i + 2] = Math.random() * 256 | 0; im.data[i + 3] = 255;
        }
        g.putImageData(im, 0, 0);
      });
      await salveazaCa('zgomot', 'gif');
      const z = await decodeaza('zgomot.gif');
      scrie(z.w === 640 && z.h === 480 && z.medie < 40, '5g GIF peste 256 culori (zgomot): se decodează, eroare medie sub 40 (cuantizare 3-3-2)', 'medie ' + z.medie.toFixed(1));
    });

    // 6. „Salvați modificările?” la Nou, Deschidere, Ieșire
    await grup('intrebare', async () => {
      const p = await nou();
      await linie(p);
      await p.locator(PANZA).focus();
      await p.keyboard.press('Control+n');
      await pauza(80);
      let s = await st(p);
      scrie(s.dialog === 'Paint' && (await p.locator(`${TOT} [role="dialog"]`).textContent()).includes('Doriți să salvați'),
        '6a Nou pe o imagine modificată: apare „Doriți să salvați modificările”');
      await btn(p, 'buton:Nu se salvează').click();
      await pauza(60);
      s = await st(p);
      scrie(s.dialog === null && alb(await pixel(p, 300, 120)) && s.panza.latime === 640, '6b „Nu se salvează” golește pânza, fără salvare');
      await linie(p);
      await p.locator(PANZA).focus();
      await p.keyboard.press('Control+o');
      await pauza(80);
      await p.locator(`${TOT} [role="dialog"] [data-lh-tinta="dialog:Anulare"]`).click();
      await pauza(60);
      scrie((await st(p)).dialog === null && negru(await pixel(p, 300, 120)), '6c Deschidere + Anulare: nu se pierde desenul');
      await p.locator(`${TOT} [data-lh-tinta="buton:Fisier"]`).click();
      await p.locator(`${TOT} [data-lh-tinta="meniu:Ieșire"]`).click();
      await pauza(80);
      scrie((await p.locator(`${TOT} [role="dialog"]`).textContent()).includes('Doriți să salvați'), '6d Ieșire din Fișier pe o imagine modificată: întreabă');
      await btn(p, 'buton:Nu se salvează').click();
      await pauza(100);
      scrie(await p.locator(TOT).count() === 0, '6e „Nu se salvează” la Ieșire închide Paint-ul');
      const p2 = await nou();
      await linie(p2);
      await p2.locator(PANZA).focus();
      await p2.keyboard.press('Control+n');
      await pauza(80);
      await btn(p2, 'buton:Salvare').click();
      await pauza(80);
      await p2.locator(`${TOT} input[aria-label="Nume fișier"]`).fill('nou-test');
      await p2.locator(`${TOT} input[aria-label="Nume fișier"]`).press('Enter');
      await pauza(120);
      const m2 = await p2.evaluate(() => Object.keys(window.LH.aplicatii._module.paint.magazie));
      const s2 = await st(p2);
      scrie(m2.includes('nou-test.png') && s2.panza.latime === 640 && alb(await pixel(p2, 300, 120)),
        '6f „Salvare” fără nume: deschide „Salvare ca”, salvează, apoi face Nou', m2.join(', '));
    });

    // 7. Text: font, dimensiune, ingrosat, cursiv (grupul Font apare cu unealta Text)
    await grup('text', async () => {
      const p = await nou();
      scrie(await btn(p, 'lista:Font').isHidden(), '7a Grupul Font e ascuns cu unealta Creion');
      await btn(p, 'unealta:text').click();
      scrie(await btn(p, 'lista:Font').isVisible(), '7b Grupul Font apare cu unealta Text');
      await p.locator(`${TOT} [data-lh-tinta="lista:Dimensiune text"]`).selectOption('48');
      await btn(p, 'buton:Ingrosat').click();
      await clicPanza(p, 100, 120);                                     // rândul 120 e vizibil în zona cu derulare
      await btn(p, 'buton:Cursiv').click();                             // clic pe grupul Font: caseta rămâne deschisă
      scrie(await p.locator(`${TOT} input.lh-ap-pt-text`).count() === 1, '7c Clic pe Font nu închide caseta de text');
      await p.locator(`${TOT} input.lh-ap-pt-text`).pressSequentially('AB');
      await p.keyboard.press('Enter');
      await pauza(80);
      const s = await st(p);
      scrie(s.texte.dimensiune_pt === 48 && s.texte.ingrosat === true && s.texte.cursiv === true, '7d Stare: 48 pt, ingroșat și cursiv', JSON.stringify(s.texte));
      const n = await intunecati(p, 95, 115, 300, 140);
      const hb = await p.evaluate(([sel]) => {
        const d = document.querySelector(sel).getContext('2d').getImageData(95, 115, 300, 140).data;
        let y0 = 1e9, y1 = -1;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] < 80) { const y = Math.floor(i / 4 / 300); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        }
        return y1 - y0 + 1;
      }, [PANZA]);
      scrie(n > 100 && hb >= 30, '7e Textul de 48 pt apare pe pânză, mult mai înalt decât 12 pt (înălțime ' + hb + ' px; 12 pt ≈ 11 px)');
    });

    // 8. Editare culori
    await grup('culori', async () => {
      const p = await nou();
      await btn(p, 'buton:Editare culori').click();
      scrie((await st(p)).dialog === 'Editare culori', '8a „Editare culori” deschide dialogul');
      await p.locator(`${TOT} input[aria-label="Cod culoare"]`).fill('#00ff00');
      await btn(p, 'buton:OK').click();
      scrie((await st(p)).culoare1 === '#00ff00', '8b Cod hex #00ff00 devine Culoarea 1');
      await btn(p, 'buton:Editare culori').click();
      await p.locator(`${TOT} input[aria-label="Roșu"]`).fill('0');
      await p.locator(`${TOT} input[aria-label="Verde"]`).fill('0');
      await p.locator(`${TOT} input[aria-label="Albastru"]`).fill('255');
      scrie(await p.locator(`${TOT} input[aria-label="Cod culoare"]`).inputValue() === '#0000ff', '8c R/G/B se sincronizează cu codul hex (#0000ff)');
      await btn(p, 'buton:OK').click();
      scrie((await st(p)).culoare1 === '#0000ff', '8d OK cu RGB 0,0,255: Culoarea 1 = albastru');
      await btn(p, 'buton:Editare culori').click();
      await p.locator(`${TOT} input[aria-label="Cod culoare"]`).fill('xyz');
      await btn(p, 'buton:OK').click();
      const s = await st(p);
      scrie(s.dialog === 'Editare culori' && (await p.locator(`${TOT} [role="dialog"]`).textContent()).includes('Cod invalid'),
        '8e Cod invalid: dialogul rămâne deschis cu mesaj');
      await p.locator(`${TOT} [role="dialog"] [data-lh-tinta="dialog:Anulare"]`).click();
      const s2 = await st(p);
      scrie(s2.dialog === null && s2.culoare1 === '#0000ff', '8f Anulare: culoarea rămâne neschimbată');
    });

    // 9. Pagina nu are erori in consola
    scrie(erori.length === 0, '9 Nicio eroare în consolă sau pagină în timpul verificărilor', erori.slice(0, 3).join(' | '));
  } finally {
    for (const s of sesiuni) { try { await s.ctx.close(); } catch (e) { /* */ } }
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main();
