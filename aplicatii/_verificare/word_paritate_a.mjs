// Probe de paritate Word, felia a (noaptea 23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_word_23_11/felii/felie_a.json  (28 de randuri).
// O proba = gestul elevului jucat in browser (clicuri, taste, deget reale prin Playwright, pe elemente vizibile),
// apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('word'). Tinta = Word-ul real (interfata EN);
// unde vechiul simulator difera, castiga Word-ul real (comentariu de un rand la proba).
// Profilul: proba se joaca pe implicit (word365); unde functia exista si in Word 2007, inca o data pe &profil=word2007
// (acelasi id, sufixul [2007] in nume).
// Rulare:  node aplicatii/_verificare/word_paritate_a.mjs   (din orice director; caile se afla singure)
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
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
const PX_CM = 96 / 2.54;                    // pagina e desenata la 100 % (794 px = 21 cm)
// tinta canonica, in ambele forme din api_biblioteca.md §3, doar vizibila
const sel = (fel, val) => val == null ? `${R} [data-lh-tinta="${fel}"]:visible`
  : `${R} [data-lh-tinta="${fel}"][data-lh-id="${val}"]:visible, ${R} [data-lh-tinta="${fel}:${val}"]:visible`;
const J = x => JSON.stringify(x);

// ---------- unelte legate de o pagina
function unelte(p, erori, deschideAlt, profil) {
  const u = {
    p, erori, profil,
    alt: deschideAlt,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('word')),
    text: async () => (await u.st()).text,
    loc: (fel, val) => p.locator(sel(fel, val)).first(),
    mso: id => p.locator(`${R} [data-lh-id-mso="${id}"]:visible`).first(),
    async clic(loc, ce, opt) {
      try { await loc.click(opt); } catch (e) { throw new Error(`nu pot apăsa ${ce} (${e.message.split('\n')[0].slice(0, 80)})`); }
      await pauza(opt && opt.pauza != null ? opt.pauza : 150);
    },
    async atinge(loc, ce) {
      try { await loc.tap(); } catch (e) { throw new Error(`nu pot atinge ${ce} (${e.message.split('\n')[0].slice(0, 80)})`); }
      await pauza(200);
    },
    // clic in ultimul paragraf, cursorul la capatul documentului, apoi tastarea
    async scrie(t, opt = {}) {
      const par = p.locator(`${R} [data-lh-zona] [data-lh-tinta="text"]:visible, ${R} [data-lh-zona] [data-lh-tinta^="text:"]:visible`).last();
      if (opt.tap) await u.atinge(par, 'pagina'); else await u.clic(par, 'pagina');
      await p.keyboard.press('Control+End');
      await p.keyboard.type(t, { delay: 8 });
      await pauza(120);
    },
    // selectie cu tastatura (Shift+sageti), in primul paragraf: de la caracterul k, n caractere
    async selecteaza(k, n) {
      await p.keyboard.press('Control+Home');
      for (let i = 0; i < k; i++) await p.keyboard.press('ArrowRight');
      for (let i = 0; i < n; i++) await p.keyboard.press('Shift+ArrowRight');
      await pauza(100);
    },
    async cursorLa(k) { await p.keyboard.press('Control+Home'); for (let i = 0; i < k; i++) await p.keyboard.press('ArrowRight'); await pauza(60); },
    // formatarea pe caractere a primului paragraf: sir de 0/1 pentru cheia data (bold / italic / underline)
    async fmt(cheie) {
      const s = await u.st();
      let o = '';
      for (const b of s.formatare_pe_caractere || []) { if (b.paragraf != null && b.paragraf > 1) continue; o += String(b.text || '').split('').map(() => (b[cheie] ? '1' : '0')).join(''); }
      return o;
    },
    // x-ul (px pe ecran) al primului caracter al paragrafului N (1 = primul)
    xPrim: (n = 1) => p.evaluate(([R, n]) => {
      const el = document.querySelector(`${R} [data-lh-zona] [data-lh-tinta="text"][data-lh-id="${n}"], ${R} [data-lh-zona] [data-lh-tinta="text:${n}"]`);
      if (!el) return NaN;
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const t = w.currentNode; const i = t.textContent.search(/\S/);
        if (i < 0) continue;
        const pe = t.parentElement; if (pe.closest('[aria-hidden="true"]')) continue;
        const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1);
        const q = r.getBoundingClientRect(); if (q.width > 0) return q.left;
      }
      return NaN;
    }, [R, n]),
    inaltimePar: (n = 1) => p.evaluate(([R, n]) => {
      const el = document.querySelector(`${R} [data-lh-zona] [data-lh-tinta="text"][data-lh-id="${n}"], ${R} [data-lh-zona] [data-lh-tinta="text:${n}"]`);
      return el ? el.getBoundingClientRect().height : NaN;
    }, [R, n]),
    // mesajele „aici nu e simulată” vizibile
    nesim: (cuvant) => p.evaluate(([R, cuvant]) => {
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      return [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(viz).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 110))
        .filter(t => !cuvant || t.includes(cuvant));
    }, [R, cuvant || null]),
    async ultimNesim() { const n = await u.nesim(); return n.length ? ' (mesaj: ' + n[n.length - 1] + ')' : ''; },
    // tine minte ce e vizibil acum; „noi” = ce devine vizibil dupa
    marcheaza: () => p.evaluate(() => {
      const s = new WeakSet();
      for (const e of document.body.querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) s.add(e); }
      window.__probaVechi = s;
    }),
    // cel mai bun element vizibil (oriunde in pagina: si sub fereastra) a carui eticheta / tinta / aria-label / text propriu
    // se potriveste cu re; „exclude” = re pe tinta, pentru elemente de sarit
    gaseste: (re, opt = {}) => p.evaluate(([src, fl, noi, exSrc, incSrc]) => {
      const re = new RegExp(src, fl), ex = exSrc ? new RegExp(exSrc) : null, inc = incSrc ? new RegExp(incSrc) : null;
      const vechi = window.__probaVechi;
      const viz = e => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
      let best = null, bs = -1;
      for (const e of document.body.querySelectorAll('*')) {
        if (noi && vechi && vechi.has(e)) continue;
        if (!viz(e)) continue;
        const ti = e.getAttribute('data-lh-tinta') || '';
        if (ex && ex.test(ti)) continue;
        if (inc && !inc.test(ti)) continue;
        if (e.closest('[data-lh-nesimulat]')) continue;            // mesajul „aici nu e simulată” nu e un control
        const tv = ti.includes(':') ? ti.slice(ti.indexOf(':') + 1) : (e.getAttribute('data-lh-id') || '');
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        const cand = [e.getAttribute('data-lh-eticheta'), tv, e.getAttribute('aria-label'), e.getAttribute('title'), own,
          ti.split(':')[0], e.getAttribute('data-lh-suprafata')].filter(Boolean);
        if (!cand.some(c => re.test(c.trim()))) continue;
        const r = e.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
        const sus = document.elementFromPoint(cx, cy);
        const scor = (sus && (e === sus || e.contains(sus)) ? 8 : 0) + (ti ? 4 : 0) + (e.hasAttribute('data-lh-eticheta') ? 2 : 0) - r.width * r.height / 1e6;
        if (scor > bs) { bs = scor; best = { x: cx, y: cy, w: r.width, h: r.height, tinta: ti, eticheta: e.getAttribute('data-lh-eticheta'), text: own, dezactivat: e.getAttribute('aria-disabled') === 'true' }; }
      }
      return best;
    }, [re.source, re.flags, !!opt.noi, opt.exclude ? opt.exclude.source : null, opt.doarTinta ? opt.doarTinta.source : null]),
    async clicEt(re, opt = {}) {
      const g = await u.gaseste(re, opt);
      if (!g) return null;
      if (opt.tap) await p.touchscreen.tap(g.x, g.y);
      else if (opt.dublu) await p.mouse.dblclick(g.x, g.y);
      else await p.mouse.click(g.x, g.y, opt.dreapta ? { button: 'right' } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 250);
      return g;
    },
    textPagina: () => p.evaluate(() => document.body.innerText),
    async fila(nume) { await u.clic(u.loc('fila', nume), 'fila ' + nume, { pauza: 700 }); },   // panglica alunecă ~0,5 s
  };
  return u;
}

async function deschide(browser, base, tel, contexte, profil, continut) {
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
  if (continut) {
    // pregatirea lectiei (nu gestul elevului): Word redeschis cu fisierele din foldere
    await p.evaluate(([profil, continut]) => window.LH.aplicatii.deschide('word', { profil: profil || undefined, continut, focus: true }), [profil, continut]);
    await p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
  }
  await pauza(400);
  return unelte(p, erori, () => deschide(browser, base, true, contexte, profil, continut), profil);
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
      const u = await deschide(browser, base, !!pr.tel, contexte, pr.profil, pr.continut);
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
// proba pe implicit si, cu opt.w2007, inca o data pe profilul word2007 (acelasi id, sufix [2007])
const proba = (id, nume, fn, opt = {}) => {
  PROBE.push({ id, nume, fn: u => fn(u, false), ...opt });
  if (opt.w2007) PROBE.push({ id, nume: '[2007] ' + nume, fn: u => fn(u, true), ...opt, profil: 'word2007' });
};
const RE_SUB_FEREASTRA = /^(fila|panglica|meniu_derulant|lansator|backstage)\b/;   // butoanele „de sub fereastră” nu stau in panglica

// ---- Anulare
// Butonul „Ctrl+Z” de sub fereastră (wordobj.js:419) e al simulatorului (in Chrome, pe telefon / tabla n-ai tastatura);
// se accepta si un Undo vizibil fara sa schimbi fila (bara Acces rapid) — fila Draw › Undo e alt drum (inventarul).
proba('word-F024', 'Ctrl+Z anulează ultima operație (și butonul Ctrl+Z de sub fereastră, pe telefon)', async (u, v07) => {
  const pb = [];
  await u.scrie('abc');
  await u.p.keyboard.press('Control+z'); await pauza(150);
  const t = (await u.text())[0];
  // Word 2007 (laboratorul, contractul I4): Ctrl+Z ia înapoi literă cu literă; 365: tot cuvântul tastat
  if (v07 ? !(t.length < 3 && 'abc'.startsWith(t)) : t !== '') pb.push(`tastatura: după „abc” + Ctrl+Z textul e ${J(t)}`);
  const w = await u.alt();
  await w.scrie('abc', { tap: true });
  const b = await w.clicEt(/^(Ctrl\s*\+\s*Z|Undo( Typing)?)$/i, { tap: true, exclude: RE_SUB_FEREASTRA });
  if (!b) pb.push('telefon (390×844): niciun buton Ctrl+Z / Undo vizibil de atins, fără tastatură');
  else { const t2 = (await w.text())[0]; if (t2 === 'abc') pb.push(`telefon: atins „${b.eticheta || b.text}”, textul a rămas „abc”`); }
  return pb;
}, { contexte: 2, w2007: true, ok: 'Ctrl+Z și butonul de pe telefon' });

proba('word-F025', 'Ctrl+Y reface ce ai anulat (și butonul Ctrl+Y pe telefon)', async (u) => {
  const pb = [];
  await u.scrie('abc');
  await u.p.keyboard.press('Control+z'); await pauza(120);
  for (let i = 0; i < 3 && (await u.text())[0] !== ''; i++) { await u.p.keyboard.press('Control+z'); await pauza(100); }   // 2007: literă cu literă
  await u.p.keyboard.press('Control+y'); await pauza(150);
  for (let i = 0; i < 3 && (await u.text())[0] !== 'abc'; i++) { await u.p.keyboard.press('Control+y'); await pauza(100); }
  const t = (await u.text())[0];
  if (t !== 'abc') pb.push(`tastatura: Ctrl+Z apoi Ctrl+Y dă ${J(t)}`);
  const w = await u.alt();
  await w.scrie('abc', { tap: true });
  await w.p.keyboard.press('Control+z'); await pauza(150);
  const t1 = (await w.text())[0];
  const b = await w.clicEt(/^(Ctrl\s*\+\s*Y|Redo( Typing)?)$/i, { tap: true, exclude: RE_SUB_FEREASTRA });
  if (!b) pb.push('telefon (390×844): niciun buton Ctrl+Y / Redo vizibil de atins');
  else { const t2 = (await w.text())[0]; if (t2 === t1) pb.push(`telefon: atins „${b.eticheta || b.text}”, textul a rămas ${J(t2)}`); }
  return pb;
}, { contexte: 2, w2007: true, ok: 'Ctrl+Y și butonul de pe telefon' });

// ---- Clipboard
proba('word-F018', 'Home › Copy copiază textul selectat (butonul activ cu selecție)', async (u) => {
  const pb = [];
  await u.scrie('Ana are mere');
  await u.selecteaza(0, 3);
  const b = u.loc('panglica', 'Home/Clipboard/Copy');
  if ((await b.getAttribute('aria-disabled')) === 'true') pb.push('Home › Copy e gri cu „Ana” selectat');
  else {
    await u.clic(b, 'Home › Copy');
    await u.p.keyboard.press('End'); await u.p.keyboard.type(' '); await u.p.keyboard.press('Control+v'); await pauza(150);
    const t = (await u.text())[0];
    if ((t.match(/Ana/g) || []).length !== 2) pb.push(`după Copy + Ctrl+V la capăt textul e ${J(t)}`);
  }
  return pb;
}, { w2007: true, ok: 'Copy activ, „Ana” lipit la capăt' });

proba('word-F019', 'Home › Cut decupează textul selectat', async (u) => {
  const pb = [];
  await u.scrie('Ana are mere');
  await u.selecteaza(0, 4);
  const b = u.loc('panglica', 'Home/Clipboard/Cut');
  if ((await b.getAttribute('aria-disabled')) === 'true') pb.push('Home › Cut e gri cu „Ana ” selectat');
  else {
    await u.clic(b, 'Home › Cut');
    const t1 = (await u.text())[0];
    if (/Ana/.test(t1)) pb.push(`după Cut textul e ${J(t1)}`);
    await u.p.keyboard.press('End'); await u.p.keyboard.type(' '); await u.p.keyboard.press('Control+v'); await pauza(150);
    const t2 = (await u.text())[0];
    if (!/mere\s+Ana\s*$/.test(t2)) pb.push(`după Ctrl+V la capăt textul e ${J(t2)}`);
  }
  return pb;
}, { w2007: true, ok: 'Cut scoate „Ana”, Ctrl+V îl pune la capăt' });

// Word real (365): clic dreapta › Paste Options › Keep Source Formatting (K); Word 2007: rândul „Paste”
proba('word-F020', 'Clic dreapta › Paste lipește cu formatarea copiată; Ctrl+V peste o selecție o înlocuiește', async (u) => {
  const pb = [];
  await u.scrie('Ana are mere');
  await u.selecteaza(0, 3);
  await u.p.keyboard.press('Control+b'); await u.p.keyboard.press('Control+c'); await pauza(100);
  await u.p.keyboard.press('End'); await u.p.keyboard.type(' ');
  await u.marcheaza();
  await u.clic(u.loc('text', '1'), 'paragraful (clic dreapta)', { button: 'right', pauza: 300 });
  const m = await u.clicEt(/^(Paste|Keep Source Formatting)( \([PK]\))?$/, { noi: true });
  if (!m) pb.push('meniul de clic dreapta n-are „Keep Source Formatting” / „Paste” (doar Keep Text Only)');
  else {
    const t = (await u.text())[0], f = await u.fmt('bold');
    if (!/Ana$/.test(t)) pb.push(`după Paste textul e ${J(t)}${await u.ultimNesim()}`);
    else if (!f.endsWith('111')) pb.push(`„Ana” lipit nu e aldin (bold pe caractere ${f})`);
  }
  // peste o selecție: „are” (4..7) înlocuit de „Ana”
  await u.selecteaza(4, 3); await u.p.keyboard.press('Control+v'); await pauza(150);
  const t2 = (await u.text())[0];
  if (!/^Ana Ana mere/.test(t2)) pb.push(`Ctrl+V peste „are” selectat dă ${J(t2)}`);
  return pb;
}, { w2007: true, ok: 'Paste cu aldinul copiat; peste selecție înlocuiește' });

// Smart paste (Word: Options › Advanced › Use smart cut and paste, pornit implicit; și în Word 2007)
proba('word-F021', 'La lipire Word potrivește singur spațiile la ambele capete (Smart paste)', async (u) => {
  await u.scrie('Ana are mere.');
  await u.selecteaza(4, 3); await u.p.keyboard.press('Control+c');
  await u.cursorLa(8);                                   // înaintea lui „mere”, după spațiu
  await u.p.keyboard.press('Control+v'); await pauza(120);
  const t1 = (await u.text())[0];
  const pb = [];
  if (t1 !== 'Ana are are mere.') pb.push(`lipit „are” înaintea lui „mere” dă ${J(t1)} (Word: „Ana are are mere.”, spațiul de după)`);
  await u.p.keyboard.press('End'); await u.p.keyboard.press('ArrowLeft');   // înaintea punctului
  await u.p.keyboard.press('Control+v'); await pauza(120);
  const t2 = (await u.text())[0];
  const ast = (t1 === 'Ana are are mere.' ? 'Ana are are mere' : t1.replace(/\.$/, '')) + ' are.';
  if (t2 !== ast) pb.push(`lipit înaintea punctului dă ${J(t2)} (Word: ${J(ast)})`);
  return pb;
}, { w2007: true, ok: 'spațiile potrivite la ambele capete' });

// ---- Editare text
proba('word-F006', 'Șterge textul selectat (Delete) și potrivește spațiile ca Word (Smart cut)', async (u) => {
  const pb = [];
  await u.scrie('Ana are mere frumoase.');
  await u.selecteaza(13, 8); await u.p.keyboard.press('Delete'); await pauza(120);
  const t1 = (await u.text())[0];
  if (t1 !== 'Ana are mere.') pb.push(`„frumoase” șters dinaintea punctului dă ${J(t1)} (Word: „Ana are mere.”)`);
  await u.selecteaza(0, 3); await u.p.keyboard.press('Delete'); await pauza(120);
  const t2 = (await u.text())[0];
  const ast = t1.slice(4);
  if (t2 !== ast) pb.push(`„Ana” șters la început de paragraf dă ${J(t2)} (Word: ${J(ast)})`);
  return pb;
}, { w2007: true, ok: 'spațiile potrivite după ștergere' });

// ---- Fereastra
proba('word-F099', 'Ribbon Display Options › Show Quick Access Toolbar arată bara Acces rapid', async (u) => {
  await u.marcheaza();
  await u.clic(u.loc('meniu_derulant', 'Ribbon Display Options'), 'Ribbon Display Options', { pauza: 300 });
  const m = await u.clicEt(/^Show Quick Access Toolbar$/, { noi: true });
  if (!m) return ['meniul Ribbon Display Options n-are „Show Quick Access Toolbar”' + await u.ultimNesim()];
  // numele din Word real (uia_word.json): Quick Access Toolbar, „Can't Undo” (nimic de anulat), Undo, Save
  const q = await u.gaseste(/^(Quick Access Toolbar|Undo( Typing)?|Can['’]t Undo|Save|AutoSave)$/, { noi: true, exclude: RE_SUB_FEREASTRA });
  if (!q) return ['după Show Quick Access Toolbar nu apare bara (niciun Undo / Save nou vizibil)' + await u.ultimNesim()];
  return [];
}, { ok: 'bara Acces rapid apare' });
// Word 2007: bara Acces rapid e mereu afișată, fără Ribbon Display Options; profilul nu schimbă interfața -> fără [2007]

proba('word-F100', 'Undo / Redo din bara Acces rapid', async (u) => {
  await u.clic(u.loc('meniu_derulant', 'Ribbon Display Options'), 'Ribbon Display Options', { pauza: 300 });
  await u.clicEt(/^Show Quick Access Toolbar$/);
  await u.p.keyboard.press('Escape');
  await u.scrie('abc');
  const un = await u.clicEt(/^Undo( Typing)?$/, { exclude: RE_SUB_FEREASTRA });
  if (!un) return ['niciun buton Undo vizibil în bara Acces rapid' + await u.ultimNesim()];
  const t1 = (await u.text())[0];
  if (t1 === 'abc') return [`Undo apăsat, textul a rămas „abc”${await u.ultimNesim()}`];
  const re = await u.clicEt(/^(Redo|Repeat)( Typing)?$/, { exclude: RE_SUB_FEREASTRA });
  if (!re) return ['niciun buton Redo vizibil în bara Acces rapid'];
  const t2 = (await u.text())[0];
  return t2 === 'abc' ? [] : [`Redo apăsat, textul e ${J(t2)}`];
}, { ok: 'Undo și Redo din bara Acces rapid' });
// Word 2007: bara se arată altfel (fără Ribbon Display Options), interfața profilului e 365 -> fără [2007]

// Word real: lansatorul Clipboard deschide panoul Clipboard, lansatorul Styles panoul Styles
proba('word-F102', 'Lansatorul ↘ al grupurilor Clipboard și Styles deschide fereastra grupului', async (u) => {
  const pb = [];
  for (const [grup, re] of [['Home/Clipboard', /^Clipboard$/], ['Home/Styles', /^Styles$/]]) {
    await u.marcheaza();
    await u.clic(u.loc('lansator', grup), 'lansatorul ' + grup, { pauza: 400 });
    const ns = await u.nesim();
    const f = await u.gaseste(re, { noi: true });
    if (ns.length || !f) pb.push(`lansatorul ${grup}: ${ns.length ? 'mesaj „' + ns[ns.length - 1] + '”' : 'nu apare nicio fereastră / panou nou cu titlul ' + re.source.replace(/[\^$]/g, '')}`);
    await u.p.keyboard.press('Escape'); await pauza(150);
  }
  return pb;
}, { w2007: true, ok: 'panourile Clipboard și Styles' });

// Word 365: rigla e ascunsă implicit; View › Ruler o arată (ca în Word real); clicul pe ea trebuie să ajungă în aplicație
proba('word-F103', 'Clic pe riglă (după View › Ruler)', async (u) => {
  await u.fila('View');
  const cb = u.loc('panglica', 'View/Show/Ruler');
  await u.marcheaza();
  await u.clic(cb, 'View › Ruler', { pauza: 300 });
  const ns = await u.nesim();
  const r = await u.gaseste(/^((Horizontal|Vertical) )?Ruler$|^rigl[aă]/i, { noi: true, exclude: /^panglica:/ });
  if (!r) return ['după View › Ruler nu apare nicio riglă' + (ns.length ? ' (mesaj: ' + ns[ns.length - 1] + ')' : '')];
  await u.p.mouse.click(r.x, r.y); await pauza(150);
  const ns2 = await u.nesim();
  return ns2.length ? ['clic pe riglă: mesaj ' + ns2[ns2.length - 1]] : [];
}, { w2007: true, ok: 'rigla apare și primește clicul' });

proba('word-F104', 'Bara de stare: „N words”; cu text selectat „X of N words”', async (u) => {
  const pb = [];
  const cuv = async () => { const g = await u.gaseste(/^Word Count\b/); return g ? `${g.eticheta || ''} ${g.text || ''}` : ''; };
  await u.scrie('Ana are mere multe');
  const c1 = await cuv();
  if (!/\b4 words\b/.test(c1)) pb.push(`fără selecție bara arată ${J(c1)}`);
  await u.selecteaza(0, 7);
  const c2 = await cuv();
  if (!/\b2 of 4 words\b/.test(c2)) pb.push(`cu „Ana are” selectat bara arată ${J(c2.trim())} (Word: „2 of 4 words”)`);
  return pb;
}, { ok: '4 words / 2 of 4 words' });
// Word 2007: „Words: 2/4” — profilul nu schimbă interfața (bara de stare e cea din 365) -> fără [2007]

// ---- Fișiere
// Ctrl+N nu ajunge la pagină în Chrome (îl ia browserul): vechiul avea butonul „Ctrl+N” (wordfisier.js:397, 595).
// Playwright trimite tasta direct paginii, deci tastatura nu dovedește nimic aici; proba cere butonul de pe ecran, jucat
// pe ecranul cu atingere (hotarari_dirijor.md 1: bara de taste `data-lh-ajutor="taste"` apare pe ecranele cu atingere).
proba('word-F074', 'Document nou: File › Blank document și butonul „Ctrl+N” (bara de taste, pe telefon)', async (u) => {
  const pb = [];
  const w = await u.alt();
  const n0 = (await w.st()).documente_deschise;
  const b = await w.clicEt(/^Ctrl\s*\+\s*N$/i, { tap: true, exclude: RE_SUB_FEREASTRA });
  if (!b) pb.push('telefon (390×844): niciun buton „Ctrl+N” de atins (Ctrl+N de pe tastatură îl ia Chrome)');
  else { const n1 = (await w.st()).documente_deschise; if (!(n1 > n0)) pb.push(`butonul Ctrl+N: documente deschise ${n0} -> ${n1}`); }
  const n2 = (await u.st()).documente_deschise;
  await u.clic(u.loc('fila', 'File'), 'File', { pauza: 500 });
  await u.clic(u.loc('backstage', 'Blank document'), 'Blank document', { pauza: 400 });
  const n3 = (await u.st()).documente_deschise;
  if (!(n3 > n2)) pb.push(`File › Blank document: documente deschise ${n2} -> ${n3}`);
  return pb;
}, { contexte: 2, ok: 'butonul Ctrl+N și File › Blank document' });
// Word 2007: butonul Office › New › Blank document › Create (alt drum în backstage) -> fără [2007]

proba('word-F075', 'Document nou dintr-un șablon (File › New, clic pe șablon)', async (u) => {
  const n0 = (await u.st()).documente_deschise;
  await u.clic(u.loc('fila', 'File'), 'File', { pauza: 500 });
  await u.clic(u.loc('backstage', 'New'), 'New', { pauza: 500 });
  // primul șablon din listă care nu e Blank document
  const sab = await u.p.evaluate(R => {
    const viz = e => { const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 20; };
    const e = [...document.querySelectorAll(`${R} [data-lh-tinta^="backstage"][data-lh-tip="ListItem"]`)].filter(viz)
      .find(e => { const r = e.getBoundingClientRect(); const et = e.getAttribute('data-lh-eticheta') || ''; return r.height > 60 && !/^(Blank document|New|Home|Open|Info|Save|Save As|History|Print|Share|Export|Close|Account|Options|Back)$/.test(et); });
    if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, et: e.getAttribute('data-lh-eticheta') };
  }, R);
  if (!sab) return ['File › New nu arată niciun șablon'];
  await u.p.mouse.click(sab.x, sab.y); await pauza(500);
  const s = await u.st();
  if (!(s.documente_deschise > n0)) return [`clic pe șablonul „${sab.et}”: documente deschise ${n0} -> ${s.documente_deschise}${await u.ultimNesim()}`];
  if (!s.text.join('').trim()) return [`documentul nou din „${sab.et}” e gol`];
  return [];
}, { ok: 'documentul din șablon se deschide cu conținut' });
// Word 2007: butonul Office › New (Installed Templates) e alt drum -> fără [2007]

proba('word-F076', 'Ctrl+S: document nou -> „Save this file” cu primul rând; salvat -> pe loc; butonul Ctrl+S pe telefon', async (u, v07) => {
  const pb = [];
  await u.scrie('Orarul meu');
  await u.p.keyboard.press('Control+s'); await pauza(400);
  let s = await u.st();
  const titlu = v07 ? 'Save As' : 'Save this file';    // Word 2007 n-are „Save this file”: Ctrl+S pe document nou = Save As
  if (!s.dialog_salvare || s.dialog_salvare.titlu !== titlu) pb.push(`Ctrl+S pe document nou: fereastra ${J(s.dialog_salvare)} (Word: „${titlu}”)`);
  else {
    if (!/^Orarul meu/.test(s.dialog_salvare.nume_propus || '')) pb.push(`numele propus ${J(s.dialog_salvare.nume_propus)} (Word: primul rând)`);
    await u.clic(u.loc('dialog_salvare', 'Save'), 'Save', { pauza: 400 });
    await u.scrie(' nou');
    await u.p.keyboard.press('Control+s'); await pauza(300);
    s = await u.st();
    const f = (s.fisiere || []).find(x => x.nume === s.nume_fisier);
    // stare().dialog_salvare ține minte ultima fereastră arătată; „deschisă acum” = butonul Save al ferestrei e vizibil
    const deschisa = await u.p.locator(sel('dialog_salvare', 'Save')).count();
    if (deschisa || !f || f.text.join('\n') !== 'Orarul meu nou') pb.push(`al doilea Ctrl+S: fereastra de salvare ${deschisa ? 'deschisă iar' : 'închisă'}, fișierul ${J(f && f.text)}`);
  }
  const w = await u.alt();
  await w.scrie('Orarul meu', { tap: true });
  const b = await w.clicEt(/^(Ctrl\s*\+\s*S|Save)$/i, { tap: true, exclude: RE_SUB_FEREASTRA });
  if (!b) pb.push('telefon (390×844): niciun buton Ctrl+S / Save vizibil de atins (doar File › Save)');
  else if (!(await w.p.locator(sel('dialog_salvare', 'Save')).count())) pb.push(`telefon: atins „${b.eticheta || b.text}”, nu s-a deschis fereastra de salvare`);
  return pb;
}, { contexte: 2, w2007: true, ok: 'Ctrl+S nou / pe loc și butonul de pe telefon' });

// Save As: în stânga Acest PC › Desktop (sau Descărcări / Imagini), numele, Save -> fișierul e acolo
proba('word-F077', 'Save As (F12): alegi alt folder (Desktop / Descărcări / Imagini), scrii numele, Save', async (u) => {
  await u.scrie('Tema mea');
  await u.p.keyboard.press('F12'); await pauza(500);
  if (!(await u.st()).dialog_salvare) return ['F12 nu deschide Save As'];
  const RE_F = /^(Desktop|Descărcări|Downloads|Imagini|Pictures)$/;
  await u.marcheaza();
  let f = await u.gaseste(RE_F);
  if (!f) {
    const pc = await u.clicEt(/^Acest PC$/, { pauza: 400 });
    if (!pc) return ['Save As n-are în stânga nici Desktop / Descărcări / Imagini, nici Acest PC'];
    f = await u.gaseste(RE_F, { noi: true });
    if (!f) return ['după clic pe Acest PC nu apare Desktop / Descărcări / Imagini' + await u.ultimNesim()];
  }
  const numeF = f.eticheta || f.text || f.tinta.split(':').pop();
  if (/^arbore/.test(f.tinta)) await u.p.mouse.click(f.x, f.y); else await u.p.mouse.dblclick(f.x, f.y);
  await pauza(400);
  const ns = await u.nesim();
  if (ns.length) return [`folderul ${numeF}: mesaj ${ns[ns.length - 1]}`];
  const camp = u.loc('camp', 'nume_fisier');
  await u.clic(camp, 'File name'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('tema_ana', { delay: 5 });
  await u.clic(u.loc('dialog_salvare', 'Save'), 'Save', { pauza: 400 });
  const s = await u.st();
  const fis = (s.fisiere || []).find(x => /^tema_ana\.docx$/.test(x.nume));
  if (!fis) return [`după Save nu există tema_ana.docx (fișiere: ${J((s.fisiere || []).map(x => x.folder + '/' + x.nume))})${await u.ultimNesim()}`];
  if (!RE_F.test(fis.folder) && fis.folder !== numeF) return [`tema_ana.docx e în ${fis.folder}, nu în ${numeF}`];
  return [];
}, { w2007: true, ok: 'salvat în alt folder decât Documente' });

// Word real: „… already exists. Do you want to replace it?” (Confirm Save As) / Replace existing file; Replace -> fișierul nou
proba('word-F080', 'Save pe un nume care există: întrebarea lui Word, apoi Replace înlocuiește fișierul', async (u) => {
  await u.scrie('textul meu');
  await u.p.keyboard.press('F12'); await pauza(500);
  const camp = u.loc('camp', 'nume_fisier');
  await u.clic(camp, 'File name'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('tema', { delay: 5 });
  await u.marcheaza();
  await u.clic(u.loc('dialog_salvare', 'Save'), 'Save', { pauza: 400 });
  const s = await u.st();
  const intr = s.dialog && s.dialog.intrebare ? s.dialog.intrebare : '';
  if (!/already exists/i.test(intr)) return [`nicio întrebare „already exists” (dialog ${J(s.dialog)})${await u.ultimNesim()}`];
  const b = await u.clicEt(/^(Replace existing file|Yes|Da|OK|Replace)$/, { noi: true });
  if (!b) return [`întrebarea n-are Replace / Yes (butoane ${J(s.dialog.butoane)})`];
  await pauza(300);
  const s2 = await u.st();
  const f = (s2.fisiere || []).find(x => x.nume === 'tema.docx');
  if (!f || f.text.join('\n') !== 'textul meu') return [`după Replace tema.docx are ${J(f && f.text)}`];
  return [];
}, { w2007: true, continut: { fisiere: [{ nume: 'tema.docx', folder: 'Documente', text: ['textul colegei'] }] }, ok: 'întrebarea și Replace' });

// Word real: bara de activități (butonul ferestrei) sau View › Switch Windows › documentul
proba('word-F087', 'Treci înapoi la primul document deschis (bara de activități sau View › Switch Windows)', async (u) => {
  await u.scrie('primul');
  await u.clic(u.loc('fila', 'File'), 'File', { pauza: 500 });
  await u.clic(u.loc('backstage', 'Blank document'), 'Blank document', { pauza: 400 });
  const s0 = await u.st();
  if (s0.documente_deschise < 2) return [`File › Blank document: ${s0.documente_deschise} document(e)`];
  let b = await u.clicEt(/^Document1\b/, { doarTinta: /^(bara_activitati|fereastra_app)/ });
  if (!b) {
    await u.fila('View');
    await u.marcheaza();
    await u.clic(u.loc('meniu_derulant', 'View/Window/Switch Windows'), 'View › Switch Windows', { pauza: 300 });
    b = await u.clicEt(/^(\d\s+)?Document1\b/, { noi: true });
    if (!b) return ['nici bara de activități, nici View › Switch Windows nu arată Document1' + await u.ultimNesim()];
  }
  const s = await u.st();
  if (!/^Document1\b/.test(s.titlu_fereastra || '') || s.text[0] !== 'primul') return [`după clic pe „${b.eticheta || b.text}”: fereastra ${J(s.titlu_fereastra)}, text ${J(s.text)}`];
  return [];
}, { w2007: true, ok: 'Document1 vine în față' });

proba('word-F090', 'Pornește Word din meniul Start; pagina de început › Blank document', async (u) => {
  await u.clic(u.loc('bara_titlu', 'Close'), 'Close', { pauza: 400 });
  const st = await u.clicEt(/^Start$/i, { pauza: 400 });           // eticheta „Start” sau ținta `start` / `bara_activitati:Start`
  if (!st) return ['după ce Word s-a închis nu există butonul Start pe ecran'];
  const w = await u.clicEt(/^Word$/, { pauza: 600 });
  if (!w) return ['meniul Start n-are Word'];
  const b = await u.clicEt(/^Blank document$/, { pauza: 400 });
  if (!b) return ['Word pornit nu arată pagina de început cu Blank document'];
  const s = await u.st();
  return s.documente_deschise >= 1 ? [] : [`după Blank document: ${s.documente_deschise} documente`];
}, { ok: 'Start › Word › Blank document' });
// Word 2007 n-are pagina de început (pornește direct cu Document1) -> fără [2007]

// Pregătirea: fișierul „descărcat de pe internet” în Descărcări (vechiul: fisiere[].web = true, wordfisier.js:175).
// Word 2007 n-are Protected View (a apărut în Word 2010) -> fără [2007]
proba('word-F092', 'Vizualizarea protejată: fișierul din Descărcări nu se poate schimba până la Enable Editing', async (u) => {
  await u.p.keyboard.press('Control+o'); await pauza(500);
  const br = await u.clicEt(/^Browse$/, { pauza: 500 });
  if (!br) return ['Ctrl+O n-are Browse'];
  const d = await u.clicEt(/^(Descărcări|Downloads)$/, { pauza: 400 });
  if (!d) return ['fereastra Open n-are Descărcări'];
  const f = await u.clicEt(/^club-lectura(\.docx)?$/, { dublu: true, pauza: 500 });
  if (!f) return ['Descărcări nu arată club-lectura.docx'];
  const s0 = await u.st();
  if (!/club-lectura/.test(s0.nume_fisier || '')) return [`fișierul nu s-a deschis (nume ${J(s0.nume_fisier)})`];
  const txt = await u.textPagina();
  if (!/PROTECTED VIEW/i.test(txt)) return ['fișierul de pe internet se deschide fără bara galbenă PROTECTED VIEW'];
  await u.scrie('X');
  if ((await u.text()).join('').includes('X')) return ['în Protected View tastarea schimbă documentul'];
  const en = await u.clicEt(/^Enable Editing$/, { pauza: 300 });
  if (!en) return ['bara PROTECTED VIEW n-are Enable Editing'];
  await u.scrie('Y');
  return (await u.text()).join('').includes('Y') ? [] : ['după Enable Editing tot nu se poate scrie'];
}, { continut: { fisiere: [{ nume: 'club-lectura.docx', folder: 'Descărcări', text: ['Clubul de lectură'], web: true, internet: true }] }, ok: 'Protected View și Enable Editing' });

// ---- Formatare paragraf
const cm = (x0, x1) => (x1 - x0) / PX_CM;
const aprox = (v, t) => Math.abs(v - t) < 0.2;
proba('word-F039', 'Increase / Decrease Indent și Ctrl+M / Ctrl+Shift+M mută retragerea cu 1,25 cm', async (u) => {
  const pb = [];
  await u.scrie('Ana are mere.');
  const x0 = await u.xPrim();
  await u.clic(u.loc('panglica', 'Home/Paragraph/Increase Indent'), 'Increase Indent');
  const x1 = await u.xPrim();
  if (!aprox(cm(x0, x1), 1.25)) pb.push(`Increase Indent: textul s-a mutat ${cm(x0, x1).toFixed(2)} cm (Word: 1,25)${await u.ultimNesim()}`);
  await u.p.keyboard.press('Control+m'); await pauza(150);
  const x2 = await u.xPrim();
  if (!aprox(cm(x0, x2), 2.5)) pb.push(`Ctrl+M: retragerea e ${cm(x0, x2).toFixed(2)} cm (Word: 2,5)${await u.ultimNesim()}`);
  await u.clic(u.loc('panglica', 'Home/Paragraph/Decrease Indent'), 'Decrease Indent');
  await u.p.keyboard.press('Control+Shift+m'); await pauza(150);
  const x3 = await u.xPrim();
  if (!aprox(cm(x0, x3), 0)) pb.push(`Decrease Indent + Ctrl+Shift+M: retragerea rămâne ${cm(x0, x3).toFixed(2)} cm (Word: 0)`);
  return pb;
}, { w2007: true, ok: '1,25 / 2,5 / 0 cm' });

// Word real: AutoFormat As You Type › „Set left- and first-indent with tabs and backspaces” (pornit implicit, și în 2007)
proba('word-F040', 'Tab la începutul unui paragraf cu text pune alineat de 1,25 cm; ⌫ îl scoate', async (u) => {
  const pb = [];
  await u.scrie('Ana are mere.');
  const x0 = await u.xPrim();
  await u.p.keyboard.press('Home'); await u.p.keyboard.press('Tab'); await pauza(150);
  const t1 = (await u.text())[0], x1 = await u.xPrim();
  if (t1.includes('\t')) pb.push('Tab a scris un caracter tab în text (Word: alineatul primului rând, fără tab)');
  else if (!aprox(cm(x0, x1), 1.25)) pb.push(`după Tab primul rând s-a mutat ${cm(x0, x1).toFixed(2)} cm (Word: 1,25)`);
  await u.p.keyboard.press('Backspace'); await pauza(150);
  const t2 = (await u.text())[0], x2 = await u.xPrim();
  if (t2 !== 'Ana are mere.' || !aprox(cm(x0, x2), 0)) pb.push(`după ⌫ la început: text ${J(t2)}, alineat ${cm(x0, x2).toFixed(2)} cm (Word: fără alineat, textul neschimbat)`);
  return pb;
}, { w2007: true, ok: 'alineat pus și scos' });

proba('word-F041', 'Fereastra Paragraph: Before text 1,25 cm + Special First line 1,25 cm, OK', async (u) => {
  await u.scrie('Ana are mere.');
  const x0 = await u.xPrim();
  await u.clic(u.loc('lansator', 'Home/Paragraph'), 'lansatorul Paragraph', { pauza: 400 });
  const scrieCamp = async (nume, val) => {
    const c = u.loc('camp', nume);
    const inp = c.locator('input, [contenteditable="true"], textarea').first();
    await u.clic((await inp.count()) ? inp : c, nume);
    await u.p.keyboard.press('Control+a'); await u.p.keyboard.type(val, { delay: 5 }); await u.p.keyboard.press('Tab'); await pauza(100);
  };
  await scrieCamp('Before text', '1,25 cm');
  // Special: lista ▾ (clic pe câmp sau pe săgeata din dreapta lui); dacă nu se deschide nicio listă, scris în câmp + Tab
  const sp = u.loc('camp', 'Special');
  await u.marcheaza();
  await u.clic(sp, 'Special', { pauza: 250 });
  let fl = await u.clicEt(/^First line$/, { noi: true });
  if (!fl) {
    const bb = await sp.boundingBox();
    if (bb) { await u.p.mouse.click(bb.x + bb.width - 6, bb.y + bb.height / 2); await pauza(250); }
    fl = await u.clicEt(/^First line$/, { noi: true });
  }
  if (!fl) { await u.clic(sp, 'Special'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('First line'); await u.p.keyboard.press('Tab'); await pauza(100); }
  await scrieCamp('By', '1,25 cm');
  await u.clic(u.loc('fereastra', 'OK'), 'OK', { pauza: 300 });
  const x1 = await u.xPrim();
  return aprox(cm(x0, x1), 2.5) ? [] : [`după OK primul rând s-a mutat ${cm(x0, x1).toFixed(2)} cm (Word: 1,25 + 1,25 = 2,5)`];
}, { w2007: true, ok: 'retragerea + First line aplicate' });

// Ctrl+1 / Ctrl+2 / Ctrl+5 le ia Chrome (schimbă fila browserului) -> drumul jucat = butonul Line and Paragraph Spacing
proba('word-F043', 'Line and Paragraph Spacing ▾ › 2,0 dublează spațiul dintre rânduri', async (u) => {
  await u.scrie('Ana are mere și pere în coșul cel mare de pe masă, iar Bogdan are prune și caise în lada de lângă ușă, ca să le ducă la piață mâine dimineață.');
  const h0 = await u.inaltimePar();
  await u.clic(u.loc('meniu_derulant', 'Home/Paragraph/Line and Paragraph Spacing'), 'Line and Paragraph Spacing', { pauza: 250 });
  const m = await u.clicEt(/^2[,.]0$/);
  if (!m) return ['lista Line and Paragraph Spacing n-are 2,0'];
  const h1 = await u.inaltimePar();
  return h1 / h0 > 1.5 ? [] : [`după 2,0 paragraful are ${Math.round(h0)} -> ${Math.round(h1)} px (trebuia ~1,8×)${await u.ultimNesim()}`];
}, { w2007: true, ok: 'rândurile s-au rărit' });

proba('word-F045', 'Butonul ¶ (Show/Hide) arată semnele ¶ și le ascunde', async (u) => {
  await u.scrie('Ana are mere.');
  const semne = () => u.p.evaluate(R => {
    const z = document.querySelector(`${R} [data-lh-zona]`); if (!z) return 0;
    let n = 0;
    for (const e of z.querySelectorAll('*')) {
      const own = [...e.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent).join('');
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      if (r.width > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && /¶/.test(own + (cs.content || ''))) n++;
      const af = getComputedStyle(e, '::after').content + getComputedStyle(e, '::before').content;
      if (r.width > 0 && /¶/.test(af)) n++;
    }
    return n;
  }, R);
  const n0 = await semne();
  await u.clic(u.mso('ParagraphMarks'), 'Show/Hide ¶');
  const n1 = await semne();
  const ap = await u.mso('ParagraphMarks').getAttribute('aria-pressed');
  if (!(n1 > n0)) return [`după ¶ semnele vizibile ${n0} -> ${n1}, butonul aria-pressed=${ap}`];
  await u.clic(u.mso('ParagraphMarks'), 'Show/Hide ¶');
  const n2 = await semne();
  return n2 <= n0 ? [] : [`a doua apăsare nu ascunde semnele (${n2})`];
}, { w2007: true, ok: '¶ apar și dispar' });

// ---- Formatare text: selecție amestecată -> Word hotărăște după PRIMUL caracter (probat prin COM, vechiul wordobj-formatare.js:413)
function probaFormat(id, numeB, cheie, tasta, tinta) {
  proba(id, `${numeB}: pe o selecție amestecată hotărăște primul caracter`, async (u) => {
    const pb = [];
    await u.scrie('vineri');
    await u.selecteaza(0, 3); await u.p.keyboard.press('Control+' + tasta); await pauza(120);
    const f1 = await u.fmt(cheie);
    if (f1 !== '111000') { pb.push(`Ctrl+${tasta.toUpperCase()} pe „vin”: ${cheie} pe caractere ${f1}`); return pb; }
    await u.selecteaza(0, 6); await u.clic(u.loc('panglica', tinta), numeB);
    const f2 = await u.fmt(cheie);
    if (f2 !== '000000') pb.push(`„vin” ${cheie} + „eri” normal, clic ${numeB} pe tot: ${f2} (Word: tot normal, 000000)`);
    // invers: primul caracter normal -> tot formatat
    await u.selecteaza(0, 6); await u.p.keyboard.press('Control+' + tasta); await pauza(100);
    if ((await u.fmt(cheie)) === '111111') { await u.selecteaza(0, 6); await u.p.keyboard.press('Control+' + tasta); await pauza(100); }
    await u.selecteaza(3, 3); await u.p.keyboard.press('Control+' + tasta); await pauza(100);
    const f3 = await u.fmt(cheie);
    if (f3 === '000111') {
      await u.selecteaza(0, 6); await u.clic(u.loc('panglica', tinta), numeB);
      const f4 = await u.fmt(cheie);
      if (f4 !== '111111') pb.push(`„vin” normal + „eri” ${cheie}, clic ${numeB} pe tot: ${f4} (Word: tot formatat)`);
    }
    return pb;
  }, { w2007: true, ok: 'hotărăște primul caracter' });
}
probaFormat('word-F028', 'Bold', 'bold', 'b', 'Home/Font/Bold');
probaFormat('word-F029', 'Italic', 'italic', 'i', 'Home/Font/Italic');
probaFormat('word-F030', 'Underline', 'underline', 'u', 'Home/Font/Underline');

// ================= rularea =================
// DOAR=word-F074,word-F024 (variabilă opțională) rulează numai acele id-uri (pentru constructori); numărătoarea nopții = fără ea
const DOAR = (process.env.DOAR || '').split(',').map(s => s.trim()).filter(Boolean);
const LISTA = DOAR.length ? PROBE.filter(pr => DOAR.includes(pr.id)) : PROBE;
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, rulate = 0;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const pr of LISTA) { await ruleaza(browser, base, pr); rulate++; }
  } catch (e) {
    for (const pr of LISTA.slice(rulate)) scrie('FAIL', pr.id, pr.nume, 'nerulată: ' + e.message.split('\n')[0]);
  } finally {
    if (browser) await browser.close().catch(() => {});
    srv.close();
  }
  console.log(`durata ${((Date.now() - t0) / 1000).toFixed(0)} s, ${LISTA.length} probe`);
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
