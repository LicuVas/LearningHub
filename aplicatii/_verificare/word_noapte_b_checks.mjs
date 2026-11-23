// Verificari banda B (noaptea Word 23.11.2026): tabelul si imaginea din aplicatii/word.js, pe alte cazuri decat
// probele de paritate: alte marimi, Ctrl+Z / Ctrl+Y, atingere pe telefon (390x844, hasTouch), &profil=word2007.
// Rulare:  node aplicatii/_verificare/word_noapte_b_checks.mjs   (din orice director)
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
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

const R = '[data-lh-aplicatie="word"]';
const pauza = ms => new Promise(r => setTimeout(r, ms));
let FAIL = 0;
const scrie = (ok, nume, det) => { if (!ok) FAIL++; console.log(`${ok ? 'PASS' : 'FAIL'} ${nume}${det ? ' - ' + det : ''}`); };

async function pagina(browser, base, opt = {}) {
  const ctx = await browser.newContext(opt.tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
  ctx.setDefaultTimeout(6000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0]));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=word${opt.profil ? '&profil=' + opt.profil : ''}`);
  await p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
  await pauza(400);
  const loc = t => p.locator(`${R} [data-lh-tinta="${t}"]:visible`).first();
  const u = {
    p, ctx, erori,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('word')),
    loc,
    async apasa(t, tap) { const l = loc(t); if (tap) await l.tap(); else await l.click(); await pauza(220); },
    async doc(tap) { const l = loc('text:1').or(p.locator(`${R} [data-lh-tinta="text"][data-lh-id="1"]:visible`)).first(); if (tap) await l.tap(); else await l.click(); await pauza(120); },
    async tabel(c, r, tap) {
      await u.apasa('fila:Insert', tap);
      const dd = p.locator(`${R} [data-lh-tinta="meniu_derulant"][data-lh-id="Insert/Tables/Table"]:visible, ${R} [data-lh-tinta="meniu_derulant:Insert/Tables/Table"]:visible`).first();
      if (tap) await dd.tap(); else await dd.click();
      await pauza(250);
      const cel = loc(`meniu:${c}x${r} Table`);
      if (tap) { await cel.tap(); await pauza(200); await cel.tap(); } else await cel.click();
      await pauza(250);
    },
    celule: () => p.evaluate(R => { const t = document.querySelector(R + ' [data-lh-tinta="tabel"]'); return t ? [...t.rows].map(r => [...r.cells].map(c => { const b = c.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, cs: c.colSpan, bg: getComputedStyle(c).backgroundColor }; })) : null; }, R),
    async poza(nume) {
      await u.apasa('fila:Insert');
      const dd = p.locator(`${R} [data-lh-tinta="meniu_derulant"][data-lh-id="Insert/Illustrations/Pictures"]:visible, ${R} [data-lh-tinta="meniu_derulant:Insert/Illustrations/Pictures"]:visible`).first();
      await dd.click(); await pauza(250);
      await loc('meniu:This Device...').click(); await pauza(400);
      return nume;
    },
    img: () => p.evaluate(R => { const e = document.querySelector(R + ' [data-lh-tinta="imagine"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, R),
  };
  return u;
}

async function verif(browser, base, nume, opt, fn) {
  let u = null;
  try {
    u = await pagina(browser, base, opt);
    const r = await fn(u);
    const er = [...new Set(u.erori)];
    if (er.length) scrie(false, nume, 'eroare în pagină: ' + er.slice(0, 2).join(' | '));
    else scrie(r === true || r == null, nume, r === true || r == null ? '' : String(r));
  } catch (e) {
    scrie(false, nume, 'a crăpat: ' + e.message.split('\n')[0].slice(0, 160));
  } finally {
    if (u) await u.ctx.close().catch(() => {});
  }
}

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    // ---------- tabelul
    await verif(browser, base, 'B-T1 grila 5x4 (alt caz decât 3x2): tabel 4 rânduri × 5 coloane, fila Table Design apare', {}, async u => {
      await u.doc(); await u.tabel(5, 4);
      const t = (await u.st()).tabele[0];
      if (!t || t.randuri !== 4 || t.coloane !== 5) return 'tabel ' + JSON.stringify(t && [t.randuri, t.coloane]);
      return (await u.loc('fila:Table Design').count()) ? true : 'fila Table Design lipsește';
    });
    await verif(browser, base, 'B-T2 grila: textul de deasupra arată mărimea la hover („4x3 Table”)', {}, async u => {
      await u.doc(); await u.apasa('fila:Insert');
      await u.p.locator(`${R} [data-lh-tinta="meniu_derulant"][data-lh-id="Insert/Tables/Table"]:visible, ${R} [data-lh-tinta="meniu_derulant:Insert/Tables/Table"]:visible`).first().click(); await pauza(250);
      const t0 = await u.p.locator(`${R} .lh-ap-grila-eticheta`).innerText();
      await u.loc('meniu:4x3 Table').hover(); await pauza(150);
      const t1 = await u.p.locator(`${R} .lh-ap-grila-eticheta`).innerText();
      return t0 === 'Insert Table' && t1 === '4x3 Table' ? true : `${t0} → ${t1}`;
    });
    await verif(browser, base, 'B-T3 telefon: grila 2x2 cu două atingeri, apoi Ctrl+Z scoate tabelul', { tel: true }, async u => {
      await u.doc(true); await u.tabel(2, 2, true);
      let t = (await u.st()).tabele;
      if (!t.length || t[0].randuri !== 2 || t[0].coloane !== 2) return 'după două atingeri: ' + JSON.stringify(t);
      await u.p.keyboard.press('Control+z'); await pauza(200);
      t = (await u.st()).tabele;
      return t.length === 0 ? true : 'după Ctrl+Z tabelul a rămas';
    });
    await verif(browser, base, 'B-T4 Insert Table… 2 coloane × 5 rânduri, word2007', { profil: 'word2007' }, async u => {
      await u.doc(); await u.apasa('fila:Insert');
      await u.p.locator(`${R} [data-lh-tinta="meniu_derulant"][data-lh-id="Insert/Tables/Table"]:visible, ${R} [data-lh-tinta="meniu_derulant:Insert/Tables/Table"]:visible`).first().click(); await pauza(250);
      await u.loc('meniu:Insert Table...').click(); await pauza(350);
      for (const [n, v] of [['Number of columns', '2'], ['Number of rows', '5']]) { await u.loc('camp:' + n).click(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type(v); }
      await u.p.locator(`${R} [data-lh-tinta="fereastra:OK"]:visible`).first().click(); await pauza(300);
      const t = (await u.st()).tabele[0];
      return t && t.randuri === 5 && t.coloane === 2 ? true : JSON.stringify(t && [t.randuri, t.coloane]);
    });
    await verif(browser, base, 'B-T5 Insert Above / Insert Left, apoi Ctrl+Z și Ctrl+Y', {}, async u => {
      await u.doc(); await u.tabel(2, 2);
      await u.p.keyboard.type('x');
      await u.apasa('fila:Table Layout');
      await u.p.locator(`${R} [data-lh-id-mso="TableRowsInsertAboveWord"]:visible`).first().click(); await pauza(200);
      await u.p.locator(`${R} [data-lh-id-mso="TableColumnsInsertLeft"]:visible`).first().click(); await pauza(200);
      let t = (await u.st()).tabele[0];
      if (t.randuri !== 3 || t.coloane !== 3 || t.celule[1][1] !== 'x') return 'după Above + Left: ' + JSON.stringify(t.celule);
      await u.p.keyboard.press('Control+z'); await pauza(150);
      t = (await u.st()).tabele[0];
      if (t.coloane !== 2) return 'Ctrl+Z n-a scos coloana: ' + t.coloane;
      await u.p.keyboard.press('Control+y'); await pauza(150);
      t = (await u.st()).tabele[0];
      return t.coloane === 3 ? true : 'Ctrl+Y n-a refăcut coloana: ' + t.coloane;
    });
    await verif(browser, base, 'B-T6 Delete › Delete Table scoate tot tabelul; Ctrl+Z îl aduce înapoi', {}, async u => {
      await u.doc(); await u.tabel(3, 3);
      await u.apasa('fila:Table Layout');
      await u.p.locator(`${R} [data-lh-id-mso="TableDeleteRowsAndColumnsMenuWord"]:visible`).first().click(); await pauza(200);
      await u.loc('meniu:Delete Table').click(); await pauza(200);
      if ((await u.st()).tabele.length) return 'tabelul a rămas';
      await u.p.keyboard.press('Control+z'); await pauza(200);
      return (await u.st()).tabele.length === 1 ? true : 'Ctrl+Z nu l-a adus';
    });
    await verif(browser, base, 'B-T7 Merge Cells cu Shift+clic real (Shift ținut): 2 celule din coloana 1 devin una, textele rămân', {}, async u => {
      await u.doc(); await u.tabel(2, 3);
      await u.p.keyboard.type('a'); await u.p.keyboard.press('Tab'); await u.p.keyboard.press('Tab'); await u.p.keyboard.type('b');
      let c = await u.celule();
      await u.p.mouse.click(c[0][0].x + 5, c[0][0].y + 5); await pauza(100);
      await u.p.keyboard.down('Shift'); await u.p.mouse.click(c[1][0].x + 5, c[1][0].y + 5); await u.p.keyboard.up('Shift'); await pauza(150);
      await u.apasa('fila:Table Layout');
      await u.p.locator(`${R} [data-lh-id-mso="MergeCells"]:visible`).first().click(); await pauza(200);
      const s = await u.st(); c = await u.celule();
      const f = s.tabele_format[0];
      if (!f.imbinari.length || f.imbinari[0].randuri !== 2) return 'îmbinări ' + JSON.stringify(f.imbinari);
      return s.tabele[0].celule[0][0] === 'a\nb' ? true : 'text ' + JSON.stringify(s.tabele[0].celule[0][0]);
    });
    await verif(browser, base, 'B-T8 Merge Cells e gri cu o singură celulă (uia: activ false)', {}, async u => {
      await u.doc(); await u.tabel(2, 2);
      await u.apasa('fila:Table Layout');
      const d = await u.p.locator(`${R} [data-lh-id-mso="MergeCells"]:visible`).first().getAttribute('aria-disabled');
      return d === 'true' ? true : 'aria-disabled ' + d;
    });
    await verif(browser, base, 'B-T9 stilul Grid Table 4 - Accent 1 din galerie, Header Row debifat schimbă antetul, Ctrl+Z îl pune la loc', {}, async u => {
      await u.doc(); await u.tabel(3, 3);
      await u.apasa('fila:Table Design');
      await u.p.locator(`${R} [data-lh-tinta="panglica:Table Design/Table Styles/Table Styles"]:visible`).first().click(); await pauza(250);
      await u.p.locator(`${R} .lh-ap-galerie-tabel [data-lh-tinta="meniu:Grid Table 4 - Accent 1"]`).click(); await pauza(200);
      const c0 = await u.celule();
      await u.p.locator(`${R} [data-lh-id-mso="TableStyleHeaderRowWord"]:visible`).first().click(); await pauza(200);
      const c1 = await u.celule(), s = await u.st();
      if (s.tabele_format[0].stil !== 'Grid Table 4 - Accent 1' || s.tabele_format[0].antet !== false) return JSON.stringify(s.tabele_format[0]);
      if (c0[0][0].bg === c1[0][0].bg) return 'antetul arată la fel';
      await u.p.keyboard.press('Control+z'); await pauza(200);
      return (await u.st()).tabele_format[0].antet === true ? true : 'Ctrl+Z n-a pus bifa la loc';
    });
    await verif(browser, base, 'B-T11 AutoFit Window după AutoFit Contents: tabelul revine cât pagina', {}, async u => {
      await u.doc(); await u.tabel(2, 2); await u.p.keyboard.type('Ana');
      const c0 = await u.celule();
      await u.apasa('fila:Table Layout');
      await u.p.locator(`${R} [data-lh-id-mso="TableAutoFitMenu"]:visible`).first().click(); await pauza(200);
      await u.loc('meniu:AutoFit Contents').click(); await pauza(200);
      const c1 = await u.celule();
      await u.p.locator(`${R} [data-lh-id-mso="TableAutoFitMenu"]:visible`).first().click(); await pauza(200);
      await u.loc('meniu:AutoFit Window').click(); await pauza(200);
      const c2 = await u.celule();
      return c1[0][0].w < c0[0][0].w - 20 && Math.abs(c2[0][0].w - c0[0][0].w) < 3 ? true : `${Math.round(c0[0][0].w)} → ${Math.round(c1[0][0].w)} → ${Math.round(c2[0][0].w)}`;
    });
    await verif(browser, base, 'B-T12 Enter în celulă, word2007: rând nou în celulă; Ctrl+Z îl scoate', { profil: 'word2007' }, async u => {
      await u.doc(); await u.tabel(2, 2);
      await u.p.keyboard.type('a'); await u.p.keyboard.press('Enter'); await u.p.keyboard.type('b'); await pauza(100);
      if ((await u.st()).tabele[0].celule[0][0] !== 'a\nb') return JSON.stringify((await u.st()).tabele[0].celule[0][0]);
      await u.p.keyboard.press('Control+z'); await u.p.keyboard.press('Control+z'); await pauza(150);
      return (await u.st()).tabele[0].celule[0][0] === 'a' ? true : JSON.stringify((await u.st()).tabele[0].celule[0][0]);
    });
    await verif(browser, base, 'B-T13 View Gridlines pe o celulă fără chenar (Borders › No Border): fără grilă înainte, linie punctată după', {}, async u => {
      await u.doc(); await u.tabel(2, 2);
      await u.apasa('fila:Table Design');
      await u.p.locator(`${R} [data-lh-tip="Button"][data-lh-eticheta="Borders"]:visible`).first().click(); await pauza(200);
      await u.loc('meniu:No Border').click(); await pauza(200);
      const o = () => u.p.evaluate(R => getComputedStyle(document.querySelector(R + ' td')).borderTopStyle, R);
      await u.apasa('fila:Table Layout');
      const g = u.p.locator(`${R} [data-lh-id-mso="TableShowGridlines"]:visible`).first();
      const b = await o();
      await g.click(); await pauza(300); const a = await o();
      return b === 'none' && a === 'dashed' ? true : `${b} → ${a}`;
    });
    // ---------- imaginea
    await verif(browser, base, 'B-I1 poza flori.jpg cu dublu-clic în Imagini, la cursor (după „Ana ”), aleasă, cu fila Picture Format', {}, async u => {
      await u.doc(); await u.p.keyboard.type('Ana are'); await u.p.keyboard.press('Home');
      for (let i = 0; i < 4; i++) await u.p.keyboard.press('ArrowRight');
      await u.poza();
      await u.loc('lista:flori.jpg').dblclick(); await pauza(350);
      const s = await u.st();
      const d = s.imagini_detalii[0];
      if (!d || d.fisier !== 'flori.jpg' || !d.aleasa) return JSON.stringify(s.imagini_detalii);
      if (!(await u.loc('fila:Picture Format').count())) return 'fila Picture Format lipsește';
      const txt = await u.p.evaluate(R => document.querySelector(R + ' [data-lh-tinta="text"][data-lh-id="1"]').innerText.replace(/\s+$/, ''), R);
      return d.loc_in_paragraf === 4 && txt === 'Ana are' && JSON.stringify(s.text) === '["Ana are"]' ? true : `loc ${d.loc_in_paragraf}, text pe ecran ${JSON.stringify(txt)}`;
    });
    await verif(browser, base, 'B-I2 mânerul din colțul stânga-sus micșorează poza proporțional; Ctrl+Z revine', {}, async u => {
      await u.doc(); await u.poza();
      await u.loc('lista:munte.png').click(); await u.p.locator(`${R} [data-lh-tinta="fereastra:Insert"]:visible`).first().click(); await pauza(350);
      const b0 = await u.img();
      const m = await u.p.locator(`${R} .lh-ap-maner-nw`).boundingBox();
      await u.p.mouse.move(m.x + m.width / 2, m.y + m.height / 2); await u.p.mouse.down();
      for (let i = 1; i <= 5; i++) { await u.p.mouse.move(m.x + 4 + 10 * i, m.y + 4 + 6 * i); await pauza(20); }
      await u.p.mouse.up(); await pauza(200);
      const b1 = await u.img();
      if (!(b1.w < b0.w - 20) || Math.abs(b1.w / b1.h - b0.w / b0.h) > 0.05) return `${Math.round(b0.w)}x${Math.round(b0.h)} → ${Math.round(b1.w)}x${Math.round(b1.h)}`;
      await u.p.keyboard.press('Control+z'); await pauza(200);
      const b2 = await u.img();
      return Math.abs(b2.w - b0.w) < 2 ? true : 'după Ctrl+Z lățimea ' + Math.round(b2.w);
    });
    await verif(browser, base, 'B-I4 Shape Height 2 cm + Enter, word2007: lățimea urmează proporția', { profil: 'word2007' }, async u => {
      await u.doc(); await u.poza();
      await u.loc('lista:munte.png').click(); await u.p.locator(`${R} [data-lh-tinta="fereastra:Insert"]:visible`).first().click(); await pauza(350);
      await u.apasa('fila:Picture Format');
      const i = u.p.locator(`${R} [data-lh-id-mso="ShapeHeight"] input`).first();
      await i.click(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('2'); await u.p.keyboard.press('Enter'); await pauza(200);
      const d = (await u.st()).imagini_detalii[0];
      return Math.abs(d.inaltime_cm - 2) < 0.01 && Math.abs(d.latime_cm - 3) < 0.01 ? true : JSON.stringify(d);
    });
    await verif(browser, base, 'B-I5 Layout Options › Tight face poza flotantă; In Line with Text o readuce', {}, async u => {
      await u.doc(); await u.poza();
      await u.loc('lista:pisica.png').click(); await u.p.locator(`${R} [data-lh-tinta="fereastra:Insert"]:visible`).first().click(); await pauza(350);
      await u.p.locator(`${R} .lh-ap-layout-options`).click(); await pauza(250);
      await u.loc('meniu:Tight').click(); await pauza(200);
      let s = await u.st();
      if (s.imagini.flotante !== 1) return 'după Tight ' + JSON.stringify(s.imagini);
      const b = await u.img();
      await u.p.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await pauza(200);
      await u.apasa('fila:Picture Format');
      await u.p.locator(`${R} [data-lh-id-mso="TextWrapGallery"]:visible`).first().click(); await pauza(200);
      await u.loc('meniu:In Line with Text').click(); await pauza(200);
      s = await u.st();
      return s.imagini.in_linie === 1 && s.imagini.flotante === 0 ? true : JSON.stringify(s.imagini);
    });
    await verif(browser, base, 'B-I6 poza în mijlocul textului: Enter înaintea ei o duce pe rândul următor cu restul; Backspace o readuce', {}, async u => {
      await u.doc(); await u.p.keyboard.type('Unu doi'); await u.p.keyboard.press('Home');
      for (let i = 0; i < 4; i++) await u.p.keyboard.press('ArrowRight');
      await u.poza();
      await u.loc('lista:soare.png').click(); await u.p.locator(`${R} [data-lh-tinta="fereastra:Insert"]:visible`).first().click(); await pauza(350);
      const b = await u.img();
      await u.p.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await pauza(150);
      await u.p.keyboard.press('Enter'); await pauza(200);
      let s = await u.st();
      if (JSON.stringify(s.text) !== JSON.stringify(['Unu ', 'doi']) || s.imagini_detalii[0].paragraf !== 2) return JSON.stringify([s.text, s.imagini_detalii]);
      await u.p.keyboard.press('Control+z'); await pauza(200);
      s = await u.st();
      return JSON.stringify(s.text) === JSON.stringify(['Unu doi']) && s.imagini_detalii[0].paragraf === 1 ? true : 'Ctrl+Z: ' + JSON.stringify([s.text, s.imagini_detalii]);
    });
    await verif(browser, base, 'B-I7 Delete pe poza aleasă, apoi Ctrl+Z o aduce, Ctrl+Y o scoate iar', { profil: 'word2007' }, async u => {
      await u.doc(); await u.poza();
      await u.loc('lista:munte.png').click(); await u.p.locator(`${R} [data-lh-tinta="fereastra:Insert"]:visible`).first().click(); await pauza(350);
      await u.p.keyboard.press('Delete'); await pauza(150);
      if ((await u.st()).imagini.in_linie !== 0) return 'Delete n-a șters poza (aleasă după Insert)';
      await u.p.keyboard.press('Control+z'); await pauza(150);
      if ((await u.st()).imagini.in_linie !== 1) return 'Ctrl+Z n-a adus poza';
      await u.p.keyboard.press('Control+y'); await pauza(150);
      return (await u.st()).imagini.in_linie === 0 ? true : 'Ctrl+Y n-a scos poza';
    });
  } finally {
    await browser.close().catch(() => {});
    srv.close();
  }
  console.log(String(FAIL));
}

main().catch(e => { console.log('FAIL eroare la rulare - ' + e.message); console.log(String(FAIL + 1)); });
