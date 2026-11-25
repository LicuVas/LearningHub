// Probe de paritate Word, felia b (noaptea 23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_word_23_11/felii/felie_b.json  (27 de randuri).
// O proba = gestul elevului jucat in browser (clicuri, taste, deget reale prin Playwright, pe elemente vizibile),
// apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('word'). Tinta = Word-ul real (interfata EN);
// unde vechiul simulator difera, castiga Word-ul real (comentariu de un rand la proba).
// Profiluri: proba se joaca pe implicit (word365); unde functia exista si in Word 2007, si pe &profil=word2007
// (acelasi id, sufixul „ [2007]”).
// Rulare:  node aplicatii/_verificare/word_paritate_b.mjs   (din orice director; caile se afla singure)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: o linie PASS / FAIL / SKIP pe proba; ultimele trei linii: REZUMAT, TOTAL FAIL, numarul de FAIL.
// Totul headless; reteaua din afara lui 127.0.0.1 e oprita (ctx.route).
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
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

const rez = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, id, nume, det) {
  rez[stare]++;
  console.log(`${stare} ${id} ${nume}${det ? ' - ' + det : ''}`.replace(/\s*\n\s*/g, ' '));
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const LIMITA = 20000;                       // pe fiecare context de browser al unei probe
const R = '[data-lh-aplicatie="word"]';
// tinta canonica, in ambele forme din api_biblioteca.md §3 („fel” + data-lh-id sau „fel:valoare”), doar vizibila
const sel = (fel, val) => val == null ? `${R} [data-lh-tinta="${fel}"]:visible`
  : `${R} [data-lh-tinta="${fel}"][data-lh-id="${val}"]:visible, ${R} [data-lh-tinta="${fel}:${val}"]:visible`;
const aprox = (a, b, tol = 0.06) => typeof a === 'number' && Math.abs(a - b) <= tol;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------- unelte legate de o pagina
function unelte(p, erori, deschideAlt) {
  const u = {
    p, erori,
    alt: deschideAlt,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('word')),
    loc: (fel, val) => p.locator(sel(fel, val)).first(),
    are: async (fel, val) => (await p.locator(sel(fel, val)).count()) > 0,
    async clic(loc, ce, opt) {
      try { await loc.click(opt); } catch (e) { throw new Error(`nu pot apăsa ${ce} (${e.message.split('\n')[0].slice(0, 80)})`); }
      await pauza(opt && opt.pauza != null ? opt.pauza : 150);
    },
    async fila(nume, tap) {
      const l = p.locator(sel('fila', nume));
      if (!(await l.count())) return false;
      if (tap) await l.first().tap(); else await l.first().click();
      await pauza(220); return true;
    },
    // clic in document, la capatul textului
    async doc(tap) {
      const l = (await p.locator(sel('text', '1')).count()) ? u.loc('text', '1') : u.loc('document');
      if (tap) await l.tap(); else await l.click();
      await pauza(120);
      await p.keyboard.press('Control+End'); await pauza(60);
    },
    async scrie(t) { await u.doc(); await p.keyboard.type(t, { delay: 8 }); await pauza(120); },
    // selecteaza cu tastele (Shift+sageti) bucata [de, de+lung) din primul paragraf
    async selecteaza(de, lung) {
      await p.keyboard.press('Control+Home');
      for (let i = 0; i < de; i++) await p.keyboard.press('ArrowRight');
      for (let i = 0; i < lung; i++) await p.keyboard.press('Shift+ArrowRight');
      await pauza(100);
    },
    nesim: (cuvant) => p.evaluate(([R, cuvant]) => {
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      return [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(viz).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 110))
        .filter(t => !cuvant || t.includes(cuvant));
    }, [R, cuvant || null]),
    marcheaza: () => p.evaluate(R => {
      const s = new WeakSet();
      for (const e of document.querySelector(R).querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) s.add(e); }
      window.__probaVechi = s;
    }, R),
    // cel mai bun element vizibil a carui eticheta / tinta / aria-label / text propriu se potriveste cu re
    gaseste: (re, opt = {}) => p.evaluate(([R, src, fl, noi, doarText]) => {
      const re = new RegExp(src, fl);
      const root = document.querySelector(R), vechi = window.__probaVechi;
      const viz = e => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
      let best = null, bs = -1;
      for (const e of root.querySelectorAll('*')) {
        if (noi && vechi && vechi.has(e)) continue;
        if (!viz(e)) continue;
        const ti = e.getAttribute('data-lh-tinta') || '';
        const tv = ti.includes(':') ? ti.slice(ti.indexOf(':') + 1) : (e.getAttribute('data-lh-id') || '');
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        const cand = doarText ? [own] : [e.getAttribute('data-lh-eticheta'), tv, e.getAttribute('aria-label'), own].filter(Boolean);
        if (!cand.some(c => c && re.test(c.trim()))) continue;
        const r = e.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const sus = document.elementFromPoint(cx, cy);
        const scor = (sus && (e === sus || e.contains(sus)) ? 8 : 0) + (ti ? 4 : 0) + (e.hasAttribute('data-lh-eticheta') ? 2 : 0) - r.width * r.height / 1e6;
        if (scor > bs) { bs = scor; best = { x: cx, y: cy, w: r.width, h: r.height, tinta: ti, eticheta: e.getAttribute('data-lh-eticheta'), text: own }; }
      }
      return best;
    }, [R, re.source, re.flags, !!opt.noi, !!opt.doarText]),
    async clicEt(re, opt = {}) {
      const g = await u.gaseste(re, opt);
      if (!g) return null;
      if (opt.tap) await p.touchscreen.tap(g.x, g.y);
      else if (opt.dublu) await p.mouse.dblclick(g.x, g.y);
      else await p.mouse.click(g.x, g.y, opt.dreapta ? { button: 'right' } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 200);
      return g;
    },
    textNoi: () => p.evaluate(R => {
      const vechi = window.__probaVechi, out = [];
      for (const e of document.querySelector(R).querySelectorAll('*')) {
        if (vechi && vechi.has(e)) continue;
        const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        if (own) out.push(own);
        const et = e.getAttribute('data-lh-eticheta'); if (et) out.push(et);
      }
      return out.join(' | ');
    }, R),
    textPagina: () => p.evaluate(R => document.querySelector(R).innerText, R),
    // stilul vazut (calculat) al textului care contine `cuv` in document
    stilText: cuv => p.evaluate(([R, cuv]) => {
      const d = document.querySelector(`${R} [data-lh-tinta="document"]`) || document.querySelector(R);
      const w = document.createTreeWalker(d, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        if (!w.currentNode.textContent.includes(cuv)) continue;
        const el = w.currentNode.parentElement, cs = getComputedStyle(el);
        return { font: cs.fontFamily, culoare: cs.color, marime: parseFloat(cs.fontSize), text: w.currentNode.textContent };
      }
      return null;
    }, [R, cuv]),
    // campul unei ferestre: tinta camp:<nume> (Spinner/Edit) -> clic, Ctrl+A, scrie valoarea
    async camp(re, val) {
      const g = await u.gaseste(re);
      if (!g) return false;
      await p.mouse.click(g.x, g.y); await pauza(80);
      await p.keyboard.press('Control+a'); await p.keyboard.type(String(val)); await pauza(80);
      return true;
    },
    // valoarea vazuta a unei casete din panglica (ComboBox Font / Font Size)
    caseta: tinta => p.evaluate(([R, t]) => {
      const e = [...document.querySelectorAll(`${R} [data-lh-tinta="${t}"]`)].find(x => x.getBoundingClientRect().width > 0);
      if (!e) return null; const i = e.querySelector('input'); return ((i && i.value) || e.innerText || '').trim();
    }, [R, tinta]),
    // poza din document: primul element vizibil din document cu tinta imagine*, sau img / canvas / svg mare
    poza: () => p.evaluate(R => {
      const d = document.querySelector(`${R} [data-lh-tinta="document"]`) || document.querySelector(R);
      const viz = e => { const r = e.getBoundingClientRect(); return r.width > 8 && r.height > 8 && getComputedStyle(e).visibility !== 'hidden'; };
      const c = [...d.querySelectorAll('[data-lh-tinta^="imagine"], [data-lh-tinta^="poza"], img, canvas, svg')].filter(viz);
      if (!c.length) return null;
      const e = c[0], r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, tag: e.tagName.toLowerCase(), tinta: e.getAttribute('data-lh-tinta'), desen: e.tagName === 'IMG' ? !!e.getAttribute('src') : (e.tagName === 'CANVAS' || e.tagName === 'svg' || !!getComputedStyle(e).backgroundImage.match(/url\(/)) };
    }, R),
    // celulele primului tabel din document, din DOM: [[{x,y,w,h,t}]]
    celule: () => p.evaluate(R => {
      const d = document.querySelector(`${R} [data-lh-tinta="document"]`) || document.querySelector(R);
      const t = d.querySelector('table');
      if (!t) return null;
      return [...t.rows].map(r => [...r.cells].map(c => { const b = c.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, t: c.innerText.trim(), span: c.colSpan || 1, bg: getComputedStyle(c).backgroundColor }; }));
    }, R),
    // pune tabelul din grila Insert › Table (c coloane × r randuri)
    async tabelGrila(c, r) {
      await u.doc();
      await u.fila('Insert');
      if (!(await u.are('meniu_derulant', 'Insert/Tables/Table'))) return 'Insert › Table ▾ lipsește';
      await u.clic(u.loc('meniu_derulant', 'Insert/Tables/Table'), 'Table ▾', { pauza: 250 });
      const g = await u.clicEt(new RegExp(`^${c}x${r} Table$`));
      if (!g) return `grila n-are ${c}x${r} Table`;
      await pauza(200);
      const s = await u.st();
      if (!s.tabele || !s.tabele.length) return 'după clic în grilă nu e niciun tabel';
      return null;
    },
    // pune o poza: Insert › Pictures ▾ › This Device…, Pictures (Imagini) daca e, primul fisier imagine, Insert
    // lax = pregatire pentru probele de dupa (F062/F064/F065): daca fereastra n-are niciun fisier imagine (F060),
    // scriu numele „munte.png” in File name, ca sa am o poza pe care sa joc gestul probei (nu se numara la F060)
    async insereazaPoza(lax = true) {
      await u.fila('Insert');
      if (!(await u.are('meniu_derulant', 'Insert/Illustrations/Pictures'))) return { motiv: 'Insert › Pictures ▾ lipsește' };
      await u.marcheaza();
      await u.clic(u.loc('meniu_derulant', 'Insert/Illustrations/Pictures'), 'Pictures ▾', { pauza: 250 });
      if (!(await u.clicEt(/^This Device(\.\.\.|…)$/, { noi: true, pauza: 400 }))) return { motiv: 'meniul Pictures n-are This Device…' };
      const dlg = await u.textNoi();
      const folder = await u.clicEt(/^(Pictures|Imagini)$/, { pauza: 300 });
      let fis = await u.clicEt(/\.(png|jpe?g|gif|bmp|webp)$/i, { pauza: 200 });
      if (!fis && lax && (await u.are('camp', 'nume_fisier'))) {
        await u.clic(u.loc('camp', 'nume_fisier'), 'File name'); await p.keyboard.press('Control+a'); await p.keyboard.type('munte.png');
        fis = { text: 'munte.png (scris)' };
      }
      if (!fis) return { motiv: `fereastra Insert Picture n-are niciun fișier imagine${folder ? ' (nici în Pictures)' : ' și n-are folderul Pictures/Imagini'}`, dlg, folder: !!folder };
      const ins = await u.clicEt(/^Insert$/, { pauza: 400 });
      if (!ins) return { motiv: 'fereastra n-are butonul Insert', folder: !!folder };
      return { ok: true, folder: !!folder, fisier: fis.text || fis.eticheta };
    },
  };
  return u;
}

async function deschide(browser, base, tel, contexte, profil) {
  const ctx = await browser.newContext(tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
  contexte.push(ctx);
  ctx.setDefaultTimeout(5000);
  ctx.setDefaultNavigationTimeout(15000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0].slice(0, 120)));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=word${profil ? '&profil=' + profil : ''}`, { waitUntil: 'load' });
  await p.waitForSelector(R, { timeout: 12000 });
  await p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
  await pauza(500);
  return unelte(p, erori, () => deschide(browser, base, true, contexte, profil));
}

function cuTimp(promise, ms) {
  let t;
  return Promise.race([promise, new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`timp depășit (${ms / 1000} s)`)), ms); })]).finally(() => clearTimeout(t));
}

async function ruleaza(browser, base, pr) {
  if (pr.skip) { rez.SKIP++; console.log(`SKIP ${pr.id} - ${pr.skip}`); return; }
  const contexte = [];
  const t0 = Date.now();
  try {
    const probleme = await cuTimp((async () => {
      const u = await deschide(browser, base, !!pr.tel, contexte, pr.profil);
      const pb = (await pr.fn(u)) || [];
      const er = [...new Set(u.erori)];
      if (er.length) pb.push('eroare în pagină: ' + er.slice(0, 2).join(' | '));
      return pb;
    })(), LIMITA * (pr.contexte || 1));
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    if (probleme.length === 0) scrie('PASS', pr.id, pr.nume, (pr.ok || 'merge') + ` (${sec} s)`);
    else scrie('FAIL', pr.id, pr.nume, probleme.join('; '));
  } catch (e) {
    scrie('FAIL', pr.id, pr.nume, 'proba a crăpat: ' + e.message.split('\n')[0].slice(0, 200));
  } finally {
    for (const c of contexte) await c.close().catch(() => {});
  }
}

// ================= probele (in ordinea feliei) =================
const PROBE = [];
// opt.v2007 = true: se mai joaca o data pe &profil=word2007, acelasi id, sufixul „ [2007]”
const proba = (id, nume, fn, opt = {}) => {
  PROBE.push({ id, nume, fn, ...opt });
  if (opt.v2007) PROBE.push({ id, nume: '[2007] ' + nume, fn, ...opt, profil: 'word2007' });
};
const pas = (id, motiv) => PROBE.push({ id, skip: motiv });

// ---- Formatare text
proba('word-F033', 'Schimbă fontul: lista Font (Georgia) și numele scris în casetă + Enter (Arial)', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere');
  // drumul obisnuit: lista Font ▾, Georgia
  await u.selecteaza(0, 3);
  await u.fila('Home'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Home/Font/Font'), 'Font ▾', { pauza: 250 });
  const g = await u.clicEt(/^Georgia$/, { noi: true });
  if (!g) pb.push('lista Font n-are Georgia' + ((await u.nesim()).length ? ' (' + (await u.nesim())[0] + ')' : ''));
  else {
    const v = await u.stilText('Ana'); const s = await u.st(); const b = (s.formatare_pe_caractere || []).find(x => x.text.includes('Ana'));
    if (!v || !/Georgia/i.test(v.font)) pb.push(`după Georgia din listă, „Ana” se vede cu fontul ${v && v.font}`);
    if (b && 'font' in b && b.font !== 'Georgia') pb.push(`stare: font ${b.font}`);
    if (!/Georgia/.test(await u.caseta('panglica:Home/Font/Font') || '')) pb.push('caseta Font nu arată Georgia');
  }
  // numele scris în casetă + Enter, pe „mere”
  await u.selecteaza(8, 4);
  await u.clic(u.loc('panglica', 'Home/Font/Font'), 'caseta Font');
  await p.keyboard.press('Control+a'); await p.keyboard.type('Arial'); await p.keyboard.press('Enter'); await pauza(200);
  const v2 = await u.stilText('mere'); const s2 = await u.st(); const b2 = (s2.formatare_pe_caractere || []).find(x => x.text.includes('mere'));
  if (!v2 || !/^"?Arial/i.test(v2.font)) pb.push(`după „Arial”+Enter în casetă, „mere” se vede cu fontul ${v2 && v2.font}`);
  if (b2 && 'font' in b2 && b2.font !== 'Arial') pb.push(`stare: font ${b2.font}`);
  if ((s2.text || [])[0] !== 'Ana are mere') pb.push(`textul s-a schimbat: ${JSON.stringify(s2.text)}`);
  return pb;
}, { ok: 'Georgia din listă și Arial scris se văd pe cuvinte', v2007: true });

proba('word-F034', 'Mărimea literelor: 20 din listă, 13.2 scris → 13, mesajele „not a valid number” / „between 1 and 1638”', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere');
  await u.selecteaza(4, 3);
  await u.fila('Home'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Home/Font/Font Size'), 'Font Size ▾', { pauza: 250 });
  if (!(await u.clicEt(/^20$/, { noi: true }))) pb.push('lista Font Size n-are 20');
  let s = await u.st(); let b = (s.formatare_pe_caractere || []).find(x => x.text.includes('are'));
  if (!b || b.marime !== 20) pb.push(`după 20 din listă „are” are mărimea ${b && b.marime}`);
  // scris: 13.2 -> 13 (Word rotunjeste la jumatate de punct; 13,2 da 13 si la rotunjirea in jos din vechi, si la cea mai apropiata)
  const scrieMarime = async v => {
    await u.clic(u.loc('panglica', 'Home/Font/Font Size'), 'caseta Font Size');
    await p.keyboard.press('Control+a'); await p.keyboard.type(v); await p.keyboard.press('Enter'); await pauza(250);
  };
  await u.selecteaza(4, 3);
  await scrieMarime('13.2');
  s = await u.st(); b = (s.formatare_pe_caractere || []).find(x => x.text.includes('are'));
  if (!b || b.marime !== 13) pb.push(`după „13.2”+Enter mărimea e ${b && b.marime} (Word: 13)`);
  await u.selecteaza(4, 3);
  await scrieMarime('abc');
  const t1 = await u.textPagina();
  if (!/This is not a valid number\./.test(t1)) pb.push('„abc”+Enter: nu apare „This is not a valid number.”');
  await u.clicEt(/^OK$/); await p.keyboard.press('Escape').catch(() => {}); await pauza(150);
  await u.selecteaza(4, 3);
  await scrieMarime('2000');
  const t2 = await u.textPagina();
  if (!/The number must be between 1 and 1638\./.test(t2)) pb.push('„2000”+Enter: nu apare „The number must be between 1 and 1638.”');
  s = await u.st(); b = (s.formatare_pe_caractere || []).find(x => x.text.includes('are'));
  if (b && b.marime === 2000) pb.push('mărimea 2000 a fost primită');
  return pb;
}, { ok: '20 din listă, 13.2→13, cele două mesaje', v2007: true });

proba('word-F036', 'Culoarea literelor: Font Color ▾ › Red, butonul Font Color pune ultima culoare, Automatic = negru', async u => {
  const pb = []; const p = u.p;
  const rosu = c => /rgb\(\s*(2[0-9]{2}|1[89][0-9])\s*,\s*([0-5]?[0-9])\s*,\s*([0-5]?[0-9])\s*\)/.test(c || '');
  await u.scrie('Ana are mere');
  await u.selecteaza(0, 3);
  await u.fila('Home'); await u.marcheaza();
  if (!(await u.are('meniu_derulant', 'Home/Font/Font Color'))) return ['Font Color ▾ lipsește'];
  await u.clic(u.loc('meniu_derulant', 'Home/Font/Font Color'), 'Font Color ▾', { pauza: 250 });
  const g = await u.clicEt(/^Red$/, { noi: true });
  if (!g) { const ns = await u.nesim(); return ['lista Font Color n-are culoarea standard Red' + (ns.length ? ' (' + ns[0] + ')' : '')]; }
  let v = await u.stilText('Ana');
  if (!v || !rosu(v.culoare)) pb.push(`după Red, „Ana” se vede cu culoarea ${v && v.culoare}`);
  // butonul (nu sageata) pune ultima culoare aleasa
  await u.selecteaza(8, 4);
  if (await u.are('panglica', 'Home/Font/Font Color')) await u.clic(u.loc('panglica', 'Home/Font/Font Color'), 'Font Color');
  else await u.clicEt(/^Font Color/);
  v = await u.stilText('mere');
  if (!v || !rosu(v.culoare)) pb.push(`butonul Font Color pe „mere”: culoarea ${v && v.culoare} (trebuia ultima, Red)`);
  // Automatic
  await u.selecteaza(0, 3); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Home/Font/Font Color'), 'Font Color ▾', { pauza: 250 });
  if (!(await u.clicEt(/^Automatic$/, { noi: true }))) pb.push('lista Font Color n-are Automatic');
  else { v = await u.stilText('Ana'); if (!v || rosu(v.culoare)) pb.push(`după Automatic „Ana” are culoarea ${v && v.culoare}`); }
  const s = await u.st(); const b = (s.formatare_pe_caractere || []).find(x => x.text.includes('mere'));
  if (b && ('culoare' in b) && !/FF0000|rosu|red/i.test(String(b.culoare))) pb.push(`stare: culoarea lui „mere” = ${b.culoare}`);
  return pb;
}, { ok: 'Red din listă, butonul repetă culoarea, Automatic', v2007: true });

// ---- Imagine
// Word 2007: Insert › Picture deschide direct fereastra (fara „This Device…”) — drum diferit, varianta 2007 nejucata.
proba('word-F060', 'Inserează o poză: Insert › Pictures › This Device…, folderul Pictures, poza aleasă, Insert — la cursor, desenată, selectată', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere');
  await u.selecteaza(4, 0);                 // cursorul dupa „Ana ”
  const r = await u.insereazaPoza(false);
  if (!r.ok) return [r.motiv];
  if (!r.folder) pb.push('fereastra n-are folderul Pictures/Imagini (fișierele vin doar din conținut)');
  const s = await u.st();
  if (!s.imagini || s.imagini.in_linie < 1) return pb.concat(`după Insert: imagini ${JSON.stringify(s.imagini)}`);
  const po = await u.poza();
  if (!po) pb.push('poza nu se vede în document');
  else {
    if (!po.desen) pb.push(`poza e un dreptunghi fără desenul fișierului (${po.tag})`);
    // la cursor: dupa „Ana ”, deci la dreapta inceputului textului
    const ana = await p.evaluate(R => { const d = document.querySelector(`${R} [data-lh-tinta="document"]`); const w = document.createTreeWalker(d, NodeFilter.SHOW_TEXT); while (w.nextNode()) if (w.currentNode.textContent.includes('Ana')) { const rg = document.createRange(); rg.setStart(w.currentNode, 0); rg.setEnd(w.currentNode, 3); const b = rg.getBoundingClientRect(); return { x: b.x, r: b.right }; } return null; }, R);
    if (ana && po.x < ana.r - 2) pb.push(`poza e la începutul paragrafului (x=${Math.round(po.x)}), nu la cursor după „Ana ” (x≥${Math.round(ana.r)})`);
  }
  const sel = (s.selectie || {});
  const selPoza = await p.evaluate(R => !!document.querySelector(`${R} [data-lh-tinta="document"] [data-lh-selectat], ${R} [data-lh-tinta="document"] [aria-selected="true"]`), R);
  const fila = await u.are('fila', 'Picture Format');
  if (!selPoza && !fila && !sel.imagine) pb.push('poza nu rămâne selectată (nici fila Picture Format, nici marcajul de selecție)');
  return pb;
}, { ok: 'Pictures, poza desenată la cursor, selectată' });

proba('word-F062', 'Mărește poza trăgând de mânerul din colț, cu proporția păstrată', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere'); await p.keyboard.press('Enter');
  const r = await u.insereazaPoza();
  if (!r.ok) return ['nu pot pune poza: ' + r.motiv];
  let po = await u.poza();
  if (!po) return [`poza pusă (stare imagini ${JSON.stringify((await u.st()).imagini)}) nu se vede în document ca element — n-am pe ce juca gestul`];
  await p.mouse.click(po.x + po.w / 2, po.y + po.h / 2); await pauza(200);
  // manerul din coltul dreapta-jos: un element vizibil mic (4-20 px) la cel mult 10 px de colt
  const m = await p.evaluate(([R, X, Y]) => {
    let best = null, bd = 1e9;
    for (const e of document.querySelector(R).querySelectorAll('*')) {
      const r = e.getBoundingClientRect(); if (r.width < 3 || r.height < 3 || r.width > 22 || r.height > 22) continue;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const d = Math.hypot(r.x + r.width / 2 - X, r.y + r.height / 2 - Y); if (d < 12 && d < bd) { bd = d; best = { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }
    }
    return best;
  }, [R, po.x + po.w, po.y + po.h]);
  if (!m) return ['după clic pe poză nu apare mânerul din colțul dreapta-jos'];
  await p.mouse.move(m.x, m.y); await p.mouse.down();
  for (let i = 1; i <= 6; i++) { await p.mouse.move(m.x + 10 * i, m.y + 5 * i); await pauza(25); }
  await p.mouse.up(); await pauza(250);
  const po2 = await u.poza();
  if (!po2 || po2.w < po.w + 25) pb.push(`lățimea pozei ${Math.round(po.w)}→${po2 && Math.round(po2.w)} px după tragere`);
  else if (Math.abs(po2.w / po2.h - po.w / po.h) > 0.04 * (po.w / po.h)) pb.push(`proporția nu s-a păstrat: ${(po.w / po.h).toFixed(2)}→${(po2.w / po2.h).toFixed(2)}`);
  return pb;
}, { ok: 'mânerul din colț mărește poza proporțional', v2007: true });

proba('word-F064', 'Scrie lățimea pozei în Shape Width (Picture Format › Size) + Enter; înălțimea urmează proporția', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere'); await p.keyboard.press('Enter');
  const r = await u.insereazaPoza();
  if (!r.ok) return ['nu pot pune poza: ' + r.motiv];
  const po = await u.poza();
  if (!po) return [`poza pusă (stare imagini ${JSON.stringify((await u.st()).imagini)}) nu se vede în document ca element — n-am pe ce juca gestul`];
  await p.mouse.click(po.x + po.w / 2, po.y + po.h / 2); await pauza(200);
  if (!(await u.fila('Picture Format'))) return ['după clic pe poză nu apare fila Picture Format'];
  const ok = await u.camp(/^(Shape Width|Width)( ?:)?$/, '3 cm');
  if (!ok) return ['fila Picture Format n-are caseta Shape Width'];
  await p.keyboard.press('Enter'); await pauza(250);
  const po2 = await u.poza();
  const pxcm = await p.evaluate(R => { const pg = [...document.querySelectorAll(R + ' [data-lh-eticheta="Page 1"]')].find(e => e.getBoundingClientRect().width > 0); return pg ? pg.getBoundingClientRect().width / window.LH.aplicatii.stare('word').pagina.latime_cm : 0; }, R);
  if (!po2) return ['poza a dispărut'];
  if (pxcm && Math.abs(po2.w / pxcm - 3) > 0.35) pb.push(`după Shape Width 3 cm poza are ${(po2.w / pxcm).toFixed(2)} cm lățime`);
  if (!pxcm && Math.abs(po2.w - po.w) < 3) pb.push('lățimea pozei nu s-a schimbat');
  if (Math.abs(po2.w / po2.h - po.w / po.h) > 0.05 * (po.w / po.h)) pb.push('înălțimea nu a urmat proporția (Lock aspect ratio)');
  return pb;
}, { ok: 'Shape Width 3 cm, proporția păstrată', v2007: true });

proba('word-F065', 'Încadrarea pozei: Wrap Text › Square, apoi Behind Text (poza devine flotantă)', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere'); await p.keyboard.press('Enter');
  const r = await u.insereazaPoza();
  if (!r.ok) return ['nu pot pune poza: ' + r.motiv];
  const po = await u.poza();
  if (!po) return [`poza pusă (stare imagini ${JSON.stringify((await u.st()).imagini)}) nu se vede în document ca element — n-am pe ce juca gestul`];
  const alege = async opt => {
    await p.mouse.click(po.x + po.w / 2, po.y + po.h / 2); await pauza(200);
    let des = false;
    for (const f of ['Picture Format', 'Layout']) {
      if (!(await u.fila(f))) continue;
      const l = p.locator(`${R} [data-lh-tinta$="/Wrap Text"]:visible, ${R} [data-lh-eticheta="Wrap Text"]:visible`).first();
      if (await l.count()) { await u.marcheaza(); await u.clic(l, 'Wrap Text ▾', { pauza: 250 }); des = true; break; }
    }
    if (!des) return 'nu găsesc Wrap Text ▾ (Picture Format / Layout)';
    if (!(await u.clicEt(new RegExp('^' + esc(opt) + '$'), { noi: true }))) { const ns = await u.nesim(); return `Wrap Text n-are „${opt}”${ns.length ? ' (' + ns[0] + ')' : ''}`; }
    return null;
  };
  let e = await alege('Square');
  if (e) return [e];
  let s = await u.st();
  if (!s.imagini || s.imagini.flotante !== 1 || s.imagini.in_linie !== 0) pb.push(`după Square: imagini ${JSON.stringify(s.imagini)} (trebuia flotante 1, in_linie 0)`);
  e = await alege('Behind Text');
  if (e) pb.push(e);
  else { s = await u.st(); if (!s.imagini || s.imagini.flotante !== 1) pb.push(`după Behind Text: imagini ${JSON.stringify(s.imagini)}`); }
  return pb;
}, { ok: 'Square și Behind Text fac poza flotantă', v2007: true });

// ---- Navigare
proba('word-F009', 'Mută cursorul: săgeți, Home/End, Ctrl+săgeți, Ctrl+Home/End; pe telefon butoanele ← →', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere'); await p.keyboard.press('Enter'); await p.keyboard.type('Dan are pere', { delay: 8 });
  const ins = async (tasta, x) => { for (const t of [].concat(tasta)) await p.keyboard.press(t); await p.keyboard.type(x); await pauza(60); };
  await ins('Control+Home', '1');          // 1Ana are mere
  await ins('End', '2');                   // 1Ana are mere2
  await ins(['Control+End'], '3');         // Dan are pere3
  await ins(['Home', 'Control+ArrowRight'], '4'); // Dan 4are pere3
  await ins(['ArrowUp', 'Home', 'ArrowRight', 'ArrowRight'], '5'); // 1A5na are mere2
  let s = await u.st();
  const asteptat = ['1A5na are mere2', 'Dan 4are pere3'];
  if (JSON.stringify(s.text) !== JSON.stringify(asteptat)) pb.push(`tastatura: text ${JSON.stringify(s.text)}, trebuia ${JSON.stringify(asteptat)}`);
  // telefonul: butoanele ← → de sub fereastra (vechiul wordobj-interfata.js:192)
  const t = await u.alt();
  await t.doc(true); await t.p.keyboard.type('abc'); await pauza(100);
  await t.marcheaza();
  const st0 = await t.gaseste(/^(←|◀|Left|Left Arrow|Cursor left)$/);
  if (!st0) pb.push('pe telefon nu există butonul ← pentru cursor');
  else {
    await t.p.touchscreen.tap(st0.x, st0.y); await pauza(120);
    await t.p.keyboard.type('X'); await pauza(100);
    const s2 = await t.st();
    if ((s2.text || [])[0] !== 'abXc') pb.push(`pe telefon, ← apoi X: ${JSON.stringify(s2.text)} (trebuia abXc)`);
    if (!(await t.gaseste(/^(→|▶|Right|Right Arrow|Cursor right)$/))) pb.push('pe telefon nu există butonul →');
  }
  return pb;
}, { ok: 'tastatura și butoanele ← → de pe telefon', contexte: 2, v2007: true });

// ---- Pagina
proba('word-F068', 'Orientarea: Layout › Orientation › Landscape; marginile se rotesc cu foaia', async u => {
  const pb = []; const p = u.p;
  await u.doc();
  // margini nesimetrice puse din Custom Margins (sus 2, jos 1.5, stanga 3, dreapta 1), ca in vechiul „probat”
  await u.fila('Layout');
  await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Margins'), 'Margins ▾', { pauza: 250 });
  let marg = false;
  if (await u.clicEt(/^Custom Margins(\.\.\.|…)?$/, { pauza: 350 })) {
    const ok = (await u.camp(/^Top:?$/, '2')) && (await u.camp(/^Bottom:?$/, '1.5')) && (await u.camp(/^Left:?$/, '3')) && (await u.camp(/^Right:?$/, '1'));
    if (ok && await u.clicEt(/^OK$/, { pauza: 300 })) { const m = (await u.st()).pagina.margini_cm; marg = aprox(m.sus, 2) && aprox(m.jos, 1.5) && aprox(m.stanga, 3) && aprox(m.dreapta, 1); }
  }
  await u.fila('Layout'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Orientation'), 'Orientation ▾', { pauza: 250 });
  if (!(await u.clicEt(/^Landscape$/, { noi: true }))) return ['Orientation n-are Landscape'];
  const s = await u.st(), pg = s.pagina;
  if (pg.orientare !== 'vedere' || !aprox(pg.latime_cm, 29.7) || !aprox(pg.inaltime_cm, 21)) pb.push(`după Landscape: ${JSON.stringify(pg)}`);
  const box = await p.evaluate(R => { const e = [...document.querySelectorAll(R + ' [data-lh-eticheta="Page 1"]')].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { w: r.width, h: r.height }; }, R);
  if (box && box.w <= box.h) pb.push(`foaia se vede tot în picioare (${Math.round(box.w)}×${Math.round(box.h)} px)`);
  // Word real: sus 2, jos 1.5, st 3, dr 1 -> pe vedere sus 3, jos 1, st 1.5, dr 2 (vechiul wordobj-hartie.js:266, „probat”)
  if (!marg) pb.push('nu pot pune margini nesimetrice (Custom Margins nu le aplică — F070), deci rotirea marginilor nu se poate vedea');
  else { const m = pg.margini_cm; if (!(aprox(m.sus, 3) && aprox(m.jos, 1) && aprox(m.stanga, 1.5) && aprox(m.dreapta, 2))) pb.push(`marginile nu s-au rotit: ${JSON.stringify(m)} (trebuia sus 3, jos 1, stânga 1.5, dreapta 2)`); }
  return pb;
}, { ok: 'foaia culcată, marginile rotite', v2007: true });

proba('word-F069', 'Margini gata făcute: Moderate, Wide, Narrow, Normal din Layout › Margins', async u => {
  const pb = [];
  await u.doc();
  const cazuri = [['Moderate', { sus: 2.54, jos: 2.54, stanga: 1.91, dreapta: 1.91 }], ['Wide', { sus: 2.54, jos: 2.54, stanga: 5.08, dreapta: 5.08 }],
    ['Narrow', { sus: 1.27, jos: 1.27, stanga: 1.27, dreapta: 1.27 }], ['Normal', { sus: 2.54, jos: 2.54, stanga: 2.54, dreapta: 2.54 }]];
  for (const [n, m] of cazuri) {
    await u.fila('Layout'); await u.marcheaza();
    await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Margins'), 'Margins ▾', { pauza: 250 });
    if (!(await u.clicEt(new RegExp(`^${n}( Margins)?$`), { noi: true }))) { pb.push(`Margins n-are ${n}`); await u.p.keyboard.press('Escape'); continue; }
    const r = (await u.st()).pagina.margini_cm;
    if (!Object.keys(m).every(k => aprox(r[k], m[k], 0.06))) pb.push(`${n}: ${JSON.stringify(r)}`);
  }
  // Mirrored: sus/jos 2.54, inside 3.18, outside 2.54 (stare: stanga = inside)
  await u.fila('Layout'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Margins'), 'Margins ▾', { pauza: 250 });
  if (!(await u.clicEt(/^Mirrored( Margins)?$/, { noi: true }))) pb.push('Margins n-are Mirrored');
  else { const r = (await u.st()).pagina.margini_cm; if (!(aprox(r.stanga, 3.18) && aprox(r.dreapta, 2.54))) pb.push(`Mirrored: ${JSON.stringify(r)}`); }
  return pb;
}, { ok: 'Moderate, Wide, Narrow, Normal, Mirrored', v2007: true });

proba('word-F070', 'Custom Margins…: stânga 3, dreapta 2.5, OK ajung în pagină; margini prea mari refuzate', async u => {
  const pb = []; const p = u.p;
  await u.doc();
  await u.fila('Layout'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Margins'), 'Margins ▾', { pauza: 250 });
  if (!(await u.clicEt(/^Custom Margins(\.\.\.|…)?$/, { noi: true, pauza: 350 }))) return ['Margins n-are Custom Margins…'];
  if (!(await u.camp(/^Left:?$/, '3')) || !(await u.camp(/^Right:?$/, '2.5'))) return ['fereastra Page Setup n-are casetele Left / Right'];
  if (!(await u.clicEt(/^OK$/, { pauza: 300 }))) return ['fereastra n-are OK'];
  let m = (await u.st()).pagina.margini_cm;
  if (!aprox(m.stanga, 3) || !aprox(m.dreapta, 2.5)) pb.push(`după OK: margini ${JSON.stringify(m)} (trebuia stânga 3, dreapta 2.5)`);
  // prea mari: stanga 12 + dreapta 12 > 21 cm
  await u.fila('Layout');
  await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Margins'), 'Margins ▾', { pauza: 250 });
  await u.clicEt(/^Custom Margins(\.\.\.|…)?$/, { pauza: 350 });
  await u.camp(/^Left:?$/, '12'); await u.camp(/^Right:?$/, '12');
  await u.clicEt(/^OK$/, { pauza: 300 });
  const t = await u.textPagina();
  m = (await u.st()).pagina.margini_cm;
  if (aprox(m.stanga, 12)) pb.push('margini de 12 + 12 cm pe o foaie de 21 cm au fost primite');
  if (!/too large|outside the printable|must be between|not valid/i.test(t)) pb.push('la margini prea mari nu apare niciun mesaj');
  return pb;
}, { ok: 'valorile ajung în pagină, cele prea mari sunt refuzate', v2007: true });

proba('word-F071', 'Mărimea foii din Layout › Size: A5, apoi Letter', async u => {
  const pb = [];
  await u.doc();
  for (const [n, w, h] of [['A5', 14.8, 21], ['Letter', 21.59, 27.94]]) {
    await u.fila('Layout'); await u.marcheaza();
    await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Size'), 'Size ▾', { pauza: 250 });
    if (!(await u.clicEt(new RegExp(`^${n}\\b`), { noi: true }))) { const ns = await u.nesim(); pb.push(`Size n-are ${n}${ns.length ? ' (' + ns[0] + ')' : ''}`); await u.p.keyboard.press('Escape'); continue; }
    const pg = (await u.st()).pagina;
    if (!aprox(pg.latime_cm, w, 0.1) || !aprox(pg.inaltime_cm, h, 0.1)) pb.push(`${n}: ${pg.latime_cm} × ${pg.inaltime_cm} cm (trebuia ${w} × ${h})`);
  }
  return pb;
}, { ok: 'A5 și Letter', v2007: true });

proba('word-F072', 'More Paper Sizes…: Page Setup › Paper, Width 15 / Height 20, OK', async u => {
  const pb = [];
  await u.doc();
  await u.fila('Layout'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Layout/Page Setup/Size'), 'Size ▾', { pauza: 250 });
  if (!(await u.clicEt(/^More Paper Sizes(\.\.\.|…)?$/, { noi: true, pauza: 350 }))) return ['Size n-are More Paper Sizes…'];
  if (await u.are('fila_dialog', 'Paper')) await u.clic(u.loc('fila_dialog', 'Paper'), 'fila Paper');
  if (!(await u.camp(/^Width:?$/, '15')) || !(await u.camp(/^Height:?$/, '20'))) return ['fila Paper n-are casetele Width / Height'];
  if (!(await u.clicEt(/^OK$/, { pauza: 300 }))) return ['fereastra n-are OK'];
  const pg = (await u.st()).pagina;
  if (!aprox(pg.latime_cm, 15, 0.1) || !aprox(pg.inaltime_cm, 20, 0.1)) pb.push(`după OK: ${pg.latime_cm} × ${pg.inaltime_cm} cm (trebuia 15 × 20)`);
  return pb;
}, { ok: 'foaia 15 × 20 cm', v2007: true });

// ---- Stiluri
// Word real (M365): Heading 1 = Aptos Display 20 pt, #0F4761 (vechiul: 20 pt Calibri Light #2F5496); Word 2007: Cambria 14 pt #365F91.
// Verific doar ce e comun: titlul albastru, mai mare decat Normal, cu alt font; stilul legat pe o bucata = doar bucata.
proba('word-F046', 'Stil Heading 1 din galerie: font, culoare, mărime; pe o bucată selectată schimbă doar bucata', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Partea întâi'); await p.keyboard.press('Enter'); await p.keyboard.type('Textul primei părți.', { delay: 8 });
  await p.keyboard.press('Control+Home'); await pauza(80);
  await u.fila('Home');
  const n0 = await u.stilText('Textul');
  if (!(await u.clicEt(/^Heading 1$/))) return ['galeria Styles n-are Heading 1'];
  let s = await u.st();
  if (JSON.stringify(s.stil_paragrafe) !== JSON.stringify(['Heading 1', 'Normal'])) pb.push(`stiluri ${JSON.stringify(s.stil_paragrafe)}`);
  const h = await u.stilText('Partea');
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)/.exec((h && h.culoare) || '') || [0, 0, 0, 0];
  if (!(+m[3] > +m[1] + 30)) pb.push(`titlul nu e albastru (${h && h.culoare})`);
  const bs = (s.formatare_pe_caractere || []).find(x => x.text.includes('Partea'));
  if (!h || !n0 || h.marime <= n0.marime + 2) pb.push(`titlul nu se vede mai mare decât Normal (${h && h.marime} px față de ${n0 && n0.marime} px; stare marime ${bs && bs.marime})`);
  if (h && n0 && h.font === n0.font) pb.push(`titlul are același font ca Normal (${h.font})`);
  // stil legat pe o bucata din paragraf: doar bucata ia aspectul, paragraful ramane Normal
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('Home');
  for (let i = 0; i < 6; i++) await p.keyboard.press('Shift+ArrowRight');
  await u.clicEt(/^Heading 1$/);
  s = await u.st();
  if ((s.stil_paragrafe || [])[1] !== 'Normal') pb.push(`„Textul” selectat + Heading 1 a schimbat tot paragraful 2 (${(s.stil_paragrafe || [])[1]})`);
  return pb;
}, { ok: 'Heading 1 albastru, mai mare, alt font; bucata singură', v2007: true });

// ---- Tabel
proba('word-F048', 'Tabel din grila Insert › Table: „3x2 Table” scris deasupra; pe telefon două atingeri', async u => {
  const pb = []; const p = u.p;
  await u.doc(); await u.fila('Insert');
  await u.clic(u.loc('meniu_derulant', 'Insert/Tables/Table'), 'Table ▾', { pauza: 250 });
  const c = await u.gaseste(/^3x2 Table$/);
  if (!c) return ['grila n-are 3x2 Table'];
  await p.mouse.move(c.x, c.y); await pauza(200);
  if (!(await u.gaseste(/^3x2 Table$/, { doarText: true }))) pb.push('deasupra grilei nu scrie „3x2 Table” (doar pătrățele colorate)');
  await p.mouse.click(c.x, c.y); await pauza(250);
  const s = await u.st(); const t = (s.tabele || [])[0];
  if (!t || t.randuri !== 2 || t.coloane !== 3) pb.push(`tabelul: ${JSON.stringify(t && { r: t.randuri, c: t.coloane })} (trebuia 2 × 3)`);
  // telefon: prima atingere arata „3x2 Table — atinge încă o dată”, a doua pune tabelul
  const tl = await u.alt();
  await tl.doc(true);
  if (!(await tl.fila('Insert', true))) { pb.push('pe telefon nu găsesc fila Insert'); return pb; }
  const dd = tl.p.locator(sel('meniu_derulant', 'Insert/Tables/Table'));
  if (!(await dd.count())) { pb.push('pe telefon nu găsesc Table ▾'); return pb; }
  await dd.first().tap(); await pauza(250);
  const c2 = await tl.gaseste(/^3x2 Table$/);
  if (!c2) { pb.push('pe telefon grila n-are 3x2 Table'); return pb; }
  await tl.p.touchscreen.tap(c2.x, c2.y); await pauza(250);
  const s1 = await tl.st();
  if ((s1.tabele || []).length) pb.push('pe telefon o singură atingere a pus tabelul (trebuia întâi „3x2 Table”, apoi a doua atingere)');
  else {
    if (!(await tl.gaseste(/3x2 Table/, { doarText: true }))) pb.push('pe telefon prima atingere nu arată „3x2 Table”');
    await tl.p.touchscreen.tap(c2.x, c2.y); await pauza(250);
    const t2 = ((await tl.st()).tabele || [])[0];
    if (!t2 || t2.randuri !== 2 || t2.coloane !== 3) pb.push(`pe telefon după a doua atingere: ${JSON.stringify(t2 && { r: t2.randuri, c: t2.coloane })}`);
  }
  return pb;
}, { ok: '3x2 Table scris, tabel 2 × 3; pe telefon două atingeri', contexte: 2, v2007: true });

proba('word-F049', 'Tabel din fereastra Insert Table: 4 coloane, 3 rânduri, OK', async u => {
  const pb = [];
  await u.doc(); await u.fila('Insert'); await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Insert/Tables/Table'), 'Table ▾', { pauza: 250 });
  if (!(await u.clicEt(/^Insert Table(\.\.\.|…)$/, { noi: true, pauza: 350 }))) return ['meniul Table n-are Insert Table…'];
  if (!(await u.camp(/^Number of columns:?$/, '4')) || !(await u.camp(/^Number of rows:?$/, '3'))) return ['fereastra Insert Table n-are Number of columns / rows'];
  if (!(await u.clicEt(/^OK$/, { pauza: 300 }))) return ['fereastra n-are OK'];
  const t = ((await u.st()).tabele || [])[0];
  if (!t || t.randuri !== 3 || t.coloane !== 4) pb.push(`tabelul: ${JSON.stringify(t && { r: t.randuri, c: t.coloane })} (trebuia 3 × 4)`);
  return pb;
}, { ok: 'tabel 3 × 4 din fereastră', v2007: true });

// Word 2007 n-are „Grid Table 4 - Accent 1” (stilurile 2007 au alte nume) — varianta 2007 nejucata.
proba('word-F053', 'Stilul tabelului din Table Design: Grid Table 4 - Accent 1', async u => {
  const pb = [];
  const e = await u.tabelGrila(3, 3); if (e) return ['nu pot pune tabelul: ' + e];
  if (!(await u.fila('Table Design'))) return ['cu cursorul în tabel nu apare fila Table Design'];
  const c0 = await u.celule();
  let g = await u.clicEt(/^Grid Table 4 - Accent 1$/);
  if (!g) {                                   // galeria intreaga (More ▾)
    await u.marcheaza();
    const more = await u.clicEt(/^(More|Table Styles)$/);
    if (more) g = await u.clicEt(/^Grid Table 4 - Accent 1$/, { noi: true });
  }
  if (!g) { const ns = await u.nesim(); return ['galeria Table Styles n-are Grid Table 4 - Accent 1' + (ns.length ? ' (' + ns[0] + ')' : '')]; }
  const t = ((await u.st()).tabele || [])[0];
  const c1 = await u.celule();
  const bgAntet = c1 && c1[0][0].bg, bgCorp = c1 && c1[1] && c1[1][0].bg;
  const vazut = c1 && bgAntet !== (c0 && c0[0][0].bg) && bgAntet !== bgCorp;
  if (!(t && t.stil === 'Grid Table 4 - Accent 1') && !vazut) pb.push(`stilul nu s-a pus: stare stil ${t && t.stil}, antet ${bgAntet}, corp ${bgCorp}`);
  return pb;
}, { ok: 'Grid Table 4 - Accent 1 pe tabel' });

proba('word-F054', 'Bifa Header Row din Table Style Options scoate formatarea rândului de antet', async u => {
  const pb = [];
  const e = await u.tabelGrila(3, 3); if (e) return ['nu pot pune tabelul: ' + e];
  if (!(await u.fila('Table Design'))) return ['cu cursorul în tabel nu apare fila Table Design'];
  // corectată de dirijor 23.11: în panglică se vede doar primul rând de stiluri (word.json › Ctx_TableDesign); ca la F053, galeria întreagă
  let g = await u.clicEt(/^Grid Table 4 - Accent 1$/);
  if (!g) { await u.marcheaza(); const more = await u.clicEt(/^(More|Table Styles)$/); if (more) g = await u.clicEt(/^Grid Table 4 - Accent 1$/, { noi: true }); }
  const b = await u.gaseste(/^Header Row$/);
  if (!b) return ['fila Table Design n-are bifa Header Row'];
  const s0 = await u.st(); const c0 = await u.celule(); const t0 = Object.assign({}, (s0.tabele || [])[0], (s0.tabele_format || [])[0]);
  await u.p.mouse.click(b.x, b.y); await pauza(250);
  const s1 = await u.st(); const c1 = await u.celule(); const t1 = Object.assign({}, (s1.tabele || [])[0], (s1.tabele_format || [])[0]);
  const stare = t1 && 'antet' in t1 && t1.antet === false && (!t0 || t0.antet !== false);
  const vazut = c0 && c1 && c0[0][0].bg !== c1[0][0].bg;
  if (!stare && !vazut) pb.push(`după Header Row debifat nimic nu s-a schimbat (stare antet ${t1 && t1.antet}, fundal antet ${c0 && c0[0][0].bg}→${c1 && c1[0][0].bg})`);
  return pb;
}, { ok: 'Header Row schimbă rândul de antet', v2007: true });

proba('word-F055', 'Lățimea coloanei trăgând de linia dintre coloane', async u => {
  const pb = []; const p = u.p;
  const e = await u.tabelGrila(3, 2); if (e) return ['nu pot pune tabelul: ' + e];
  const c0 = await u.celule();
  if (!c0) return ['tabelul nu se vede în DOM ca tabel (nu pot găsi linia dintre coloane)'];
  const x = c0[0][0].x + c0[0][0].w, y = c0[0][0].y + c0[0][0].h / 2;
  await p.mouse.move(x, y); await pauza(100); await p.mouse.down();
  for (let i = 1; i <= 6; i++) { await p.mouse.move(x + 10 * i, y); await pauza(25); }
  await p.mouse.up(); await pauza(250);
  const c1 = await u.celule();
  if (!c1 || c1[0][0].w < c0[0][0].w + 30) pb.push(`coloana 1: ${Math.round(c0[0][0].w)}→${c1 && Math.round(c1[0][0].w)} px după tragerea liniei cu 60 px`);
  return pb;
}, { ok: 'coloana s-a lățit', v2007: true });

proba('word-F056', 'AutoFit Contents (Table Layout › AutoFit sau clic dreapta › AutoFit): coloana se strânge pe text', async u => {
  const pb = []; const p = u.p;
  const e = await u.tabelGrila(3, 2); if (e) return ['nu pot pune tabelul: ' + e];
  await p.keyboard.type('Ana'); await pauza(100);
  const c0 = await u.celule();
  let ok = false;
  if (await u.fila('Table Layout') || await u.fila('Layout')) {
    await u.marcheaza();
    if (await u.clicEt(/^AutoFit$/)) ok = !!(await u.clicEt(/^AutoFit (to )?Contents$/, { noi: true }));
  }
  if (!ok) {                                 // clic dreapta in tabel › AutoFit › AutoFit to Contents
    if (c0) { await p.mouse.click(c0[0][0].x + 5, c0[0][0].y + c0[0][0].h / 2, { button: 'right' }); await pauza(250); }
    await u.marcheaza();
    if (await u.clicEt(/^AutoFit$/)) ok = !!(await u.clicEt(/^AutoFit (to )?Contents$/));
  }
  if (!ok) return ['nici Table Layout, nici clic dreapta nu au AutoFit › AutoFit Contents'];
  const c1 = await u.celule();
  if (!c0 || !c1 || c1[0][0].w > c0[0][0].w - 20) pb.push(`coloana cu „Ana”: ${c0 && Math.round(c0[0][0].w)}→${c1 && Math.round(c1[0][0].w)} px`);
  return pb;
}, { ok: 'AutoFit Contents strânge coloana', v2007: true });

// Exercitiul vine din jocuri (butoanele − / + ale jocului); in Word real: Table Layout › Insert Below / Right, Delete › Delete Rows / Columns.
proba('word-F058', 'Adaugă / scoate rânduri și coloane: Table Layout › Insert Below / Insert Right / Delete Rows / Delete Columns', async u => {
  const pb = [];
  const e = await u.tabelGrila(3, 2); if (e) return ['nu pot pune tabelul: ' + e];
  const dim = async () => { const t = ((await u.st()).tabele || [])[0]; return t ? `${t.randuri}×${t.coloane}` : 'fără tabel'; };
  if (!(await u.fila('Table Layout')) && !(await u.fila('Layout'))) return ['cu cursorul în tabel nu apare fila Table Layout'];
  const pasi = [[/^Insert Below$/, '3×3', null], [/^Insert Right$/, '3×4', null], [/^Delete Rows$/, '2×4', /^Delete( Table| Cells)?$/], [/^Delete Columns$/, '2×3', /^Delete( Table| Cells)?$/]];
  for (const [re, ast, meniu] of pasi) {
    await u.fila('Table Layout') || await u.fila('Layout');
    if (meniu) { await u.marcheaza(); await u.clicEt(/^Delete$/); }
    if (!(await u.clicEt(re))) { pb.push(`Table Layout n-are ${re.source.replace(/[\^$]/g, '')}`); continue; }
    const d = await dim();
    if (d !== ast) pb.push(`după ${re.source.replace(/[\^$]/g, '')}: ${d} (trebuia ${ast})`);
  }
  return pb;
}, { ok: 'rând și coloană adăugate, apoi șterse', v2007: true });

proba('word-F059', 'Îmbină celulele primului rând (selectat) cu Table Layout › Merge Cells', async u => {
  const pb = []; const p = u.p;
  const e = await u.tabelGrila(3, 2); if (e) return ['nu pot pune tabelul: ' + e];
  const c0 = await u.celule();
  if (c0) { await p.mouse.click(c0[0][0].x + 4, c0[0][0].y + c0[0][0].h / 2); await p.keyboard.down('Shift'); await p.mouse.click(c0[0][2].x + c0[0][2].w - 6, c0[0][2].y + c0[0][2].h / 2); await p.keyboard.up('Shift'); await pauza(150); }   // corectată de dirijor 23.11: Mouse.click n-are `modifiers`
  else { await p.keyboard.press('Shift+ArrowRight'); await p.keyboard.press('Shift+ArrowRight'); }
  if (!(await u.fila('Table Layout')) && !(await u.fila('Layout'))) return ['cu cursorul în tabel nu apare fila Table Layout'];
  if (!(await u.clicEt(/^Merge Cells$/))) {
    await p.mouse.click(c0 ? c0[0][1].x + 5 : 400, c0 ? c0[0][1].y + 5 : 300, { button: 'right' }); await pauza(250);
    if (!(await u.clicEt(/^Merge Cells$/))) return ['nici Table Layout, nici clic dreapta nu au Merge Cells'];
  }
  const t = ((await u.st()).tabele || [])[0]; const c1 = await u.celule();
  const stare = t && Array.isArray(t.celule) && t.celule[0] && t.celule[0].length === 1;
  const vazut = c1 && c1[0].length === 1;
  if (!stare && !vazut) pb.push(`primul rând are tot ${c1 ? c1[0].length : '?'} celule (stare: ${t && JSON.stringify(t.celule && t.celule[0])})`);
  return pb;
}, { ok: 'primul rând = o singură celulă', v2007: true });

// ---- Tiparire
// Word 2007: previzualizarea e modul separat Print Preview (butonul Office › Print › Print Preview) — varianta 2007 nejucata.
proba('word-F105', 'Ctrl+P: previzualizarea arată documentul elevului, „1 of 2”, ▶ trece la pagina 2', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere'); await p.keyboard.press('Enter');
  await p.keyboard.press('Control+a'); await p.keyboard.press('Control+c'); await p.keyboard.press('Control+End');
  for (let i = 0; i < 6; i++) { await p.keyboard.press('Control+v'); await p.keyboard.press('Control+a'); await p.keyboard.press('Control+c'); await p.keyboard.press('Control+End'); }
  const n = ((await u.st()).text || []).length;
  await p.keyboard.press('Control+p'); await pauza(500);
  const t = await u.textPagina();
  if (!/\bPrint\b/.test(t) || (await u.are('fila', 'Home'))) return [`Ctrl+P nu deschide pagina Print (${(await u.nesim())[0] || 'nimic'})`];
  if (!/Ana are mere/.test(t.replace(/\s+/g, ' ').split('Print').slice(1).join(' '))) pb.push('previzualizarea nu arată textul documentului');
  if (n >= 60 && !/\b1\s*of\s*2\b/.test(t)) pb.push(`documentul are ${n} paragrafe (2 pagini) dar previzualizarea nu scrie „1 of 2” (${(/\d+\s*of\s*\d+/.exec(t) || ['—'])[0]})`);
  const nx = await u.clicEt(/^(Next Page|▶|►)$/);
  if (!nx) pb.push('sub previzualizare nu e butonul ▶ (Next Page)');
  else if (!/\b2\s*of\s*2\b/.test(await u.textPagina())) pb.push('▶ nu trece la „2 of 2”');
  return pb;
}, { ok: 'documentul în previzualizare, 1 of 2, ▶' });

// ---- Vizualizare
// Word 2007 n-are Read Mode (are Full Screen Reading, alt comportament) — varianta 2007 nejucata.
proba('word-F093', 'Read Mode: tastarea nu scrie, meniul View › Edit Document, Esc întoarce la Print Layout', async u => {
  const pb = []; const p = u.p;
  await u.scrie('Ana are mere');
  await u.clic(u.loc('bara_stare', 'Read Mode'), 'Read Mode (bara de stare)', { pauza: 400 });
  const ns = await u.nesim();
  if (ns.length) return ['Read Mode: ' + ns[0]];
  if (await u.are('fila', 'Home')) pb.push('după Read Mode panglica (fila Home) e tot acolo');
  await p.keyboard.type('xyz'); await pauza(150);
  if (((await u.st()).text || [])[0] !== 'Ana are mere') pb.push(`în Read Mode tastarea a scris: ${JSON.stringify((await u.st()).text)}`);
  await u.marcheaza();
  if (!(await u.clicEt(/^View$/))) pb.push('Read Mode n-are meniul View');
  else if (!(await u.gaseste(/^Edit Document$/, { noi: true }))) pb.push('meniul View din Read Mode n-are Edit Document');
  await p.keyboard.press('Escape'); await pauza(150); await p.keyboard.press('Escape'); await pauza(300);
  if (!(await u.are('fila', 'Home'))) pb.push('Esc nu întoarce la Print Layout (panglica nu revine)');
  return pb;
}, { ok: 'Read Mode citește, Esc întoarce' });

proba('word-F094', 'View › Web Layout (textul pe toată lățimea), apoi Print Layout (foaia revine)', async u => {
  const pb = [];
  await u.scrie('Ana are mere');
  const lat = () => u.p.evaluate(R => { const e = [...document.querySelectorAll(R + ' [data-lh-eticheta="Page 1"], ' + R + ' [data-lh-tinta="text"]')].find(x => x.getBoundingClientRect().width > 0); return e ? e.getBoundingClientRect().width : 0; }, R);
  const w0 = await lat();
  await u.fila('View');
  await u.clic(u.loc('panglica', 'View/Views/Web Layout'), 'Web Layout', { pauza: 400 });
  const ns = await u.nesim('Web');
  if (ns.length) return ['Web Layout: ' + ns[0]];
  const w1 = await lat();
  if (w1 < w0 + 80) pb.push(`după Web Layout lățimea textului ${Math.round(w0)}→${Math.round(w1)} px (trebuia toată fereastra)`);
  await u.fila('View');
  await u.clic(u.loc('panglica', 'View/Views/Print Layout'), 'Print Layout', { pauza: 400 });
  const w2 = await lat();
  if (Math.abs(w2 - w0) > 5) pb.push(`după Print Layout lățimea ${Math.round(w2)} px, nu revine la ${Math.round(w0)}`);
  return pb;
}, { ok: 'Web Layout lățește, Print Layout revine', v2007: true });

proba('word-F095', 'Zoom cu − / + din bara de stare (pasul lui Word: 8 %)', async u => {
  const pb = [];
  const z = async () => { const e = await u.p.locator(sel('zoom', 'Zoom')).first().getAttribute('data-lh-eticheta').catch(() => ''); const m = /(\d+)\s*%/.exec(e || await u.p.locator(sel('zoom', 'Zoom')).first().innerText().catch(() => '')); return m ? +m[1] : NaN; };
  const lat = () => u.p.evaluate(R => { const e = [...document.querySelectorAll(R + ' [data-lh-eticheta="Page 1"]')].find(x => x.getBoundingClientRect().width > 0); return e ? e.getBoundingClientRect().width : 0; }, R);
  const z0 = await z(), w0 = await lat();
  await u.clic(u.loc('zoom', 'Zoom In (Ctrl +)'), 'Zoom In (+)', { pauza: 300 });
  const z1 = await z(), w1 = await lat();
  // corectată de dirijor 23.11: în Word real + din bara de stare mută cu 8 % (100 → 108 → 116 → 124), măsurat de judecător:
  // lectii/vii/m1-l03/surse.md:68 (arbitru_ui.json). Sub 100 % pasul nu e măsurat: proba cere doar să scadă.
  if (z1 !== z0 + 8) pb.push(`după + zoom ${z0}→${z1} % (${(await u.nesim())[0] || ''})`);
  if (w1 <= w0) pb.push(`după + foaia ${Math.round(w0)}→${Math.round(w1)} px`);
  await u.clic(u.loc('zoom', 'Zoom Out (Ctrl -)'), 'Zoom Out (−)', { pauza: 300 });
  await u.clic(u.loc('zoom', 'Zoom Out (Ctrl -)'), 'Zoom Out (−)', { pauza: 300 });
  const z2 = await z();
  if (!(z2 < z0)) pb.push(`după + − − zoom ${z0}→${z2} %`);
  return pb;
}, { ok: '+ mută cu 8 %, − coboară', v2007: true });

proba('word-F098', 'View › bifa Ruler arată / ascunde riglele', async u => {
  const pb = []; const p = u.p;
  await u.doc();
  const rigle = () => p.evaluate(R => [...document.querySelectorAll(R + ' *')].filter(e => {
    const r = e.getBoundingClientRect(); if (r.width < 5 || r.height < 5) return false;
    const s = (e.getAttribute('data-lh-tinta') || '') + ' ' + (e.getAttribute('data-lh-eticheta') || '') + ' ' + (e.getAttribute('aria-label') || '');
    return /(Horizontal|Vertical) Ruler|^rigla|\brigl/i.test(s.trim()) || /^rigla/.test(e.getAttribute('data-lh-tinta') || '');
  }).length, R);
  const n0 = await rigle();
  await u.fila('View');
  await u.clic(u.loc('panglica', 'View/Show/Ruler'), 'bifa Ruler', { pauza: 300 });
  const ns = await u.nesim('Ruler');
  if (ns.length) return ['Ruler: ' + ns[0]];
  const n1 = await rigle();
  if ((n0 === 0) === (n1 === 0)) pb.push(`după bifa Ruler riglele vizibile ${n0}→${n1} (nu s-a schimbat nimic)`);
  await u.clic(u.loc('panglica', 'View/Show/Ruler'), 'bifa Ruler', { pauza: 300 });
  const n2 = await rigle();
  if ((n2 === 0) !== (n0 === 0)) pb.push(`a doua bifă nu revine: ${n0}→${n1}→${n2}`);
  return pb;
}, { ok: 'riglele apar și dispar', v2007: true });

// ================= rularea =================
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, rulate = 0;
  const filtru = process.argv[2] ? new RegExp(process.argv[2]) : null;
  const lista = filtru ? PROBE.filter(pr => filtru.test(pr.id)) : PROBE;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const pr of lista) { await ruleaza(browser, base, pr); rulate++; }
  } catch (e) {
    for (const pr of lista.slice(rulate)) scrie('FAIL', pr.id, pr.nume || '', 'nerulată: ' + e.message.split('\n')[0]);
  } finally {
    if (browser) await browser.close().catch(() => {});
    srv.close();
  }
  console.log(`durata ${((Date.now() - t0) / 1000).toFixed(0)} s, ${lista.length} probe`);
  console.log(`REZUMAT PASS=${rez.PASS} FAIL=${rez.FAIL} SKIP=${rez.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rez.FAIL));
}

main().catch(e => {
  console.log('FAIL eroare la rulare - ' + e.message);
  console.log(`REZUMAT PASS=${rez.PASS} FAIL=${PROBE.length - rez.PASS - rez.SKIP} SKIP=${rez.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(PROBE.length - rez.PASS - rez.SKIP));
});
