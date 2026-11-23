// Probe de paritate Word, felia c (noaptea 23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_word_23_11/felii/felie_c.json  (27 de randuri).
// O proba = gestul elevului jucat in browser (clicuri, taste, deget reale prin Playwright, pe elemente vizibile),
// apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('word'). Tinta = Word-ul real (interfata EN);
// unde vechiul simulator difera, castiga Word-ul real (comentariu de un rand la proba).
// Profilul: proba se joaca pe word365 (implicit) si, unde functia exista si in Word 2007, inca o data pe
// &profil=word2007 (acelasi id, sufixul „ [2007]” in nume).
// Rulare:  node aplicatii/_verificare/word_paritate_c.mjs   (din orice director; caile se afla singure)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: o linie PASS / FAIL / SKIP pe proba; ultimele trei linii: REZUMAT, TOTAL FAIL, numarul de FAIL.
// Totul headless; reteaua din afara lui 127.0.0.1 e oprita (ctx.route). Un singur browser, 3 contexte deodata.
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
const linie = (stare, id, nume, det) => { rez[stare]++; return `${stare} ${id} ${nume}${det ? ' - ' + det : ''}`.replace(/\s*\n\s*/g, ' '); };
const pauza = ms => new Promise(r => setTimeout(r, ms));
const LIMITA = 20000;                       // pe fiecare context de browser al unei probe
const PARALEL = 3;                          // contexte deodata in acelasi browser
const R = '[data-lh-aplicatie="word"]';
const sel = (fel, val) => val == null ? `${R} [data-lh-tinta="${fel}"]:visible`
  : `${R} [data-lh-tinta="${fel}"][data-lh-id="${val}"]:visible, ${R} [data-lh-tinta="${fel}:${val}"]:visible`;

// ---------- unelte legate de o pagina
function unelte(p, erori, R) {
  const u = {
    p, erori, R,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('word')),
    loc: (fel, val) => p.locator(sel(fel, val).split(R).join(u.R)).first(),
    are: async (fel, val) => (await p.locator(sel(fel, val).split(R).join(u.R)).count()) > 0,
    async clic(loc, ce, opt) {
      try { await loc.click(opt); } catch (e) { throw new Error(`nu pot apăsa ${ce} (${e.message.split('\n')[0].slice(0, 80)})`); }
      await pauza(opt && opt.pauza != null ? opt.pauza : 150);
    },
    // clic cu mouse-ul in centrul elementului (si cand alt element il acopera, ca la casetele Spinner)
    async clicCentru(loc, ce, opt = {}) {
      const b = await loc.boundingBox().catch(() => null);
      if (!b) throw new Error('nu văd ' + ce);
      await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2, opt);
      await pauza(opt.pauza != null ? opt.pauza : 150);
    },
    async fila(nume) { await u.clic(u.loc('fila', nume), 'fila ' + nume, { pauza: 250 }); },
    // pune cursorul in document (clic in primul paragraf) si scrie
    async scrie(t) {
      const b = await u.loc('text', '1').boundingBox();
      if (!b) throw new Error('nu văd paragraful 1');
      await p.mouse.click(b.x + Math.min(b.width - 2, 400), b.y + b.height / 2); await pauza(120);
      if (t) { await p.keyboard.type(t, { delay: 8 }); await pauza(120); }
    },
    // dreptunghiul unui cuvant din document (prima aparitie, fara diferenta de majuscule); k = a cata aparitie
    cuvant: (cuv, k = 0) => p.evaluate(([R, cuv, k]) => {
      const root = document.querySelector(R);
      const w = document.createTreeWalker(root.querySelector('[data-lh-tinta="document"]') || root, NodeFilter.SHOW_TEXT);
      let n = 0;
      while (w.nextNode()) {
        const t = w.currentNode.textContent, low = t.toLowerCase();
        let i = low.indexOf(cuv.toLowerCase());
        while (i >= 0) {
          if (n++ === k) {
            const r = document.createRange(); r.setStart(w.currentNode, i); r.setEnd(w.currentNode, i + cuv.length);
            const q = r.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height, cx: q.x + q.width / 2, cy: q.y + q.height / 2 };
          }
          i = low.indexOf(cuv.toLowerCase(), i + 1);
        }
      }
      return null;
    }, [u.R, cuv, k]),
    nesim: (cuvant) => p.evaluate(([R, cuvant]) => {
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      return [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(viz).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 110))
        .filter(t => !cuvant || t.includes(cuvant));
    }, [u.R, cuvant || null]),
    marcheaza: () => p.evaluate(R => {
      const s = new WeakSet();
      for (const e of document.querySelector(R).querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) s.add(e); }
      window.__probaVechi = s;
    }, u.R),
    // cel mai bun element vizibil a carui eticheta / tinta / aria-label / text propriu se potriveste cu re
    gaseste: (re, opt = {}) => p.evaluate(([R, src, fl, noi]) => {
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
        const cand = [e.getAttribute('data-lh-eticheta'), tv, e.getAttribute('aria-label'), own].filter(Boolean);
        if (!cand.some(c => re.test(c.trim()))) continue;
        const r = e.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const sus = document.elementFromPoint(cx, cy);
        const scor = (sus && (e === sus || e.contains(sus)) ? 8 : 0) + (ti ? 4 : 0) + (e.hasAttribute('data-lh-eticheta') ? 2 : 0) - r.width * r.height / 1e6;
        if (scor > bs) { bs = scor; best = { x: cx, y: cy, w: r.width, h: r.height, tinta: ti, eticheta: e.getAttribute('data-lh-eticheta'), text: own }; }
      }
      return best;
    }, [u.R, re.source, re.flags, !!opt.noi]),
    async clicEt(re, opt = {}) {
      const g = await u.gaseste(re, opt);
      if (!g) return null;
      if (opt.tap) await p.touchscreen.tap(g.x, g.y);
      else if (opt.dublu) await p.mouse.dblclick(g.x, g.y);
      else await p.mouse.click(g.x, g.y, opt.dreapta ? { button: 'right' } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 200);
      return g;
    },
    textPagina: () => p.evaluate(() => document.body.innerText),
    // o caseta (Spinner / Edit) dintr-o fereastra: clic in ea, Ctrl+A, valoarea
    async completeaza(fel, val, ce) {
      await u.clicCentru(u.loc('camp', fel), ce || fel);
      await p.keyboard.press('Control+a'); await p.keyboard.type(String(val)); await pauza(100);
    },
    // Insert › Table › grila c×r (cursorul ajunge in prima celula)
    async tabel(c, r) {
      await u.fila('Insert');
      await u.clic(u.loc('meniu_derulant', 'Insert/Tables/Table'), 'Insert › Table', { pauza: 250 });
      await u.clic(u.loc('meniu', `${c}x${r} Table`), `grila ${c}x${r}`, { pauza: 300 });
    },
    celula: (r, c) => p.locator(`${u.R} [data-lh-tinta="tabel"] tr:nth-child(${r}) > td:nth-child(${c})`).first(),
    // Insert › Pictures › This Device... › File name › Insert
    async poza() {
      await u.fila('Insert');
      await u.clic(u.loc('meniu_derulant', 'Insert/Illustrations/Pictures'), 'Insert › Pictures', { pauza: 250 });
      await u.clic(u.loc('meniu', 'This Device...'), 'This Device...', { pauza: 400 });
      await u.clicCentru(u.loc('camp', 'nume_fisier'), 'File name');
      await p.keyboard.type('munte.png');
      if (!(await u.clicEt(/^Insert$/, { pauza: 400 }))) throw new Error('fereastra Insert Picture n-are Insert');
      const s = await u.st();
      if (!s.imagini || s.imagini.in_linie < 1) throw new Error('poza nu s-a inserat (pregătirea probei)');
      // azi poza apare pe ecran abia la urmatoarea tasta (raportul probe_c.md, punctul 4); End nu muta nimic
      if (!(await u.p.locator(sel('imagine', '1').split(R).join(u.R)).count())) { await u.p.keyboard.press('End'); await pauza(250); }
    },
    // fila contextuala (Table Layout ...): azi randul filelor se reface abia la clicul pe o fila (punctul 4)
    async filaContext(nume) {
      if (!(await u.are('fila', nume))) await u.fila('Home');
      return u.are('fila', nume);
    },
    async marimeFont(v) {
      await u.clicCentru(u.loc('panglica', 'Home/Font/Font Size'), 'Font Size');
      await p.keyboard.press('Control+a'); await p.keyboard.type(String(v)); await p.keyboard.press('Enter'); await pauza(200);
    },
    textNoi: () => p.evaluate(R => {
      const vechi = window.__probaVechi, out = [];
      for (const e of document.querySelector(R).querySelectorAll('*')) {
        if (vechi && vechi.has(e)) continue;
        const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        if (own) out.push(own);
      }
      return out.join(' | ').slice(0, 220);
    }, u.R),
    imagine: () => u.loc('imagine', '1'),
    zoomEticheta: async () => {
      const l = u.loc('zoom', 'Zoom');
      return ((await l.getAttribute('data-lh-eticheta').catch(() => '')) || '') + ' ' + ((await l.innerText().catch(() => '')) || '');
    },
    async trageMouse(x0, y0, x1, y1, inainteDeSus, opt = {}) {
      await p.mouse.move(x0, y0); await p.mouse.down();
      await p.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, { steps: 5 });
      await p.mouse.move(x1, y1, { steps: 5 });
      await pauza(150);
      const r = inainteDeSus ? await inainteDeSus() : null;
      if (opt.ctrl) { await p.keyboard.down('Control'); await pauza(60); }
      await p.mouse.up();
      if (opt.ctrl) await p.keyboard.up('Control');
      await pauza(300);
      return r;
    },
    // elementele mici NOI (5-20 px) cu centrul langa chenarul unui dreptunghi (manerele)
    manere: (b) => p.evaluate(([R, b]) => {
      const vechi = window.__probaVechi, out = [];
      for (const e of document.querySelector(R).querySelectorAll('*')) {
        if (vechi && vechi.has(e)) continue;
        const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.width > 20 || r.height > 20) continue;
        const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const peX = Math.abs(cx - b.x) < 12 || Math.abs(cx - (b.x + b.width)) < 12, peY = Math.abs(cy - b.y) < 12 || Math.abs(cy - (b.y + b.height)) < 12;
        const inX = cx > b.x - 12 && cx < b.x + b.width + 12, inY = cy > b.y - 12 && cy < b.y + b.height + 12;
        if ((peX && inY) || (peY && inX)) out.push({ x: cx, y: cy });
      }
      return out;
    }, [u.R, b]),
  };
  return u;
}

async function deschide(browser, base, pr, contexte) {
  const tel = !!pr.tel;
  const ctx = await browser.newContext(tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1920, height: 1080 } });
  contexte.push(ctx);
  ctx.setDefaultTimeout(5000);
  ctx.setDefaultNavigationTimeout(15000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0].slice(0, 120)));
  const ap = pr.aplicatie || 'word';
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=${ap}${pr.profil ? '&profil=' + pr.profil : ''}`, { waitUntil: 'load' });
  const RR = `[data-lh-aplicatie="${ap}"]`;
  await p.waitForSelector(RR, { timeout: 12000 });
  if (ap === 'word') await p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
  await pauza(500);
  return unelte(p, erori, RR);
}

function cuTimp(promise, ms) {
  let t;
  return Promise.race([promise, new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`timp depășit (${ms / 1000} s)`)), ms); })]).finally(() => clearTimeout(t));
}

async function ruleaza(browser, base, pr) {
  if (pr.skip) { rez.SKIP++; return `SKIP ${pr.id} - ${pr.skip}`; }
  const contexte = [];
  const t0 = Date.now();
  try {
    const probleme = await cuTimp((async () => {
      const u = await deschide(browser, base, pr, contexte);
      const pb = (await pr.fn(u)) || [];
      const er = [...new Set(u.erori)];
      if (er.length) pb.push('eroare în pagină: ' + er.slice(0, 2).join(' | '));
      return pb;
    })(), LIMITA);
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    if (probleme.length === 0) return linie('PASS', pr.id, pr.nume, (pr.ok || 'merge') + ` (${sec} s)`);
    return linie('FAIL', pr.id, pr.nume, probleme.join('; '));
  } catch (e) {
    return linie('FAIL', pr.id, pr.nume, 'proba a crăpat: ' + e.message.split('\n')[0].slice(0, 200));
  } finally {
    for (const c of contexte) await c.close().catch(() => {});
  }
}

// ================= probele (in ordinea feliei) =================
const PROBE = [];
// ambele: proba pe word365 si inca o data pe word2007 (acelasi id, sufix „ [2007]”); fn2007 = varianta ei, daca difera
const proba = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, ...opt });
const ambele = (id, nume, fn, opt = {}) => {
  PROBE.push({ id, nume, fn, ...opt });
  PROBE.push({ id, nume: `[2007] ${nume}`, fn: opt.fn2007 || fn, ...opt, ok: opt.ok2007 || opt.ok, profil: 'word2007' });
};
const T = async u => (await u.st()).text;
const J = x => JSON.stringify(x);

// ---- Anulare
ambele('word-F026', 'Ctrl+Y fără nimic de refăcut repetă ⌫, Delete și Enter', async u => {
  const pb = [];
  await u.scrie('Ana are mere');
  await u.p.keyboard.press('Backspace'); await pauza(80);
  await u.p.keyboard.press('Control+y'); await pauza(150);
  let t = await T(u);
  if (t[0] !== 'Ana are me') pb.push(`⌫ apoi Ctrl+Y: textul ${J(t)} (trebuia „Ana are me”, ⌫ repetat)`);
  await u.p.keyboard.press('Control+Home'); await pauza(60);
  await u.p.keyboard.press('Delete'); await pauza(80);
  await u.p.keyboard.press('Control+y'); await pauza(150);
  t = await T(u);
  if (!/^a are me/i.test(t[0]) || /^na/i.test(t[0])) pb.push(`Delete apoi Ctrl+Y: textul ${J(t)} (trebuia „a are me”, Delete repetat)`);
  await u.p.keyboard.press('End'); await pauza(60);
  await u.p.keyboard.press('Enter'); await pauza(80);
  const n1 = (await T(u)).length;
  await u.p.keyboard.press('Control+y'); await pauza(150);
  const n2 = (await T(u)).length;
  if (n2 !== n1 + 1) pb.push(`Enter apoi Ctrl+Y: ${n1} → ${n2} paragrafe (trebuia ${n1 + 1}, Enter repetat)`);
  return pb;
}, { ok: '⌫, Delete și Enter repetate de Ctrl+Y' });

// Word 365: tastarea e o operatie, dar ⌫ o rupe; fiecare ⌫ e o operatie separata (probat in Word 16, felia)
ambele('word-F027', 'Anularea pe operații: ⌫ rupe tastarea, fiecare ⌫ e o anulare', async u => {
  const pb = [];
  await u.scrie('abcd');
  await u.p.keyboard.press('Backspace'); await u.p.keyboard.press('Backspace'); await pauza(60);
  await u.p.keyboard.type('xy', { delay: 10 }); await pauza(100);
  const pasi = [];
  for (let i = 0; i < 3; i++) { await u.p.keyboard.press('Control+z'); await pauza(120); pasi.push((await T(u))[0]); }
  const vrut = ['ab', 'abc', 'abcd'];
  if (J(pasi) !== J(vrut)) pb.push(`„abcd”, ⌫⌫, „xy”, apoi 3 × Ctrl+Z dau ${J(pasi)} (trebuia ${J(vrut)})`);
  return pb;
}, {
  ok: 'Ctrl+Z: ab → abc → abcd',
  // Word 2007: tastarea se anuleaza litera cu litera (I4), deci se verifica doar ⌫ ca operatii separate
  fn2007: async u => {
    const pb = [];
    await u.scrie('abcd');
    for (let i = 0; i < 3; i++) await u.p.keyboard.press('Backspace');
    await pauza(80);
    const pasi = [];
    for (let i = 0; i < 3; i++) { await u.p.keyboard.press('Control+z'); await pauza(120); pasi.push((await T(u))[0]); }
    const vrut = ['ab', 'abc', 'abcd'];
    if (J(pasi) !== J(vrut)) pb.push(`„abcd”, 3 × ⌫, apoi 3 × Ctrl+Z dau ${J(pasi)} (trebuia ${J(vrut)})`);
    return pb;
  },
});

// ---- Clipboard
ambele('word-F023', 'Ctrl+tragere copiază textul selectat (originalul rămâne)', async u => {
  const pb = [];
  await u.scrie('uno dos tres');
  const a = await u.cuvant('uno'), b = await u.cuvant('tres');
  if (!a || !b) return ['nu găsesc cuvintele scrise în pagină'];
  // corectată de dirijor 23.11: sub 500 ms după dublul clic, a treia apăsare e triplu clic (scenarii_real/word-triplu-clic-paragraf.json)
  await u.p.mouse.dblclick(a.cx, a.cy); await pauza(650);
  await u.trageMouse(a.cx, a.cy, b.x + 1, b.cy, null, { ctrl: true });   // lasat inaintea lui „tres”
  const t = (await T(u)).join('\n');
  const n = (t.match(/uno/gi) || []).length;
  if (n !== 2) pb.push(`după Ctrl+tragere textul e ${J(t)} („uno” apare de ${n} ori, trebuia de 2: originalul rămâne)`);
  return pb;
}, { ok: '„uno” copiat la capăt, originalul rămas' });

// ---- Editare text
ambele('word-F005', 'Ctrl+⌫ / Ctrl+Delete șterg un cuvânt întreg (și în celula unui tabel)', async u => {
  const pb = [];
  await u.scrie('unu doi trei');
  await u.p.keyboard.press('Control+Backspace'); await pauza(100);
  let t = (await T(u))[0];
  if (t.trim().toLowerCase() !== 'unu doi') pb.push(`în text: Ctrl+⌫ lasă ${J(t)} (trebuia „unu doi ”)`);
  await u.p.keyboard.press('End');
  await u.p.keyboard.press('Enter');
  await u.tabel(3, 2);
  await u.p.keyboard.type('unu doi trei', { delay: 8 }); await pauza(100);
  await u.p.keyboard.press('Control+Backspace'); await pauza(120);
  let c = ((await u.st()).tabele[0] || { celule: [['?']] }).celule[0][0];
  if (c.trim().toLowerCase() !== 'unu doi') pb.push(`în celulă: Ctrl+⌫ lasă ${J(c)} (trebuia „unu doi ”)`);
  await u.p.keyboard.press('Home'); await pauza(60);
  await u.p.keyboard.press('Control+Delete'); await pauza(120);
  c = ((await u.st()).tabele[0] || { celule: [['?']] }).celule[0][0];
  if (!/^doi\b/i.test(c.trim()) || /unu/i.test(c)) pb.push(`în celulă: Home, Ctrl+Delete lasă ${J(c)} (trebuia să înceapă cu „doi”)`);
  return pb;
}, { ok: 'cuvântul șters și în text, și în celulă' });

// Word real („smart cut and paste”): cuvantul ales cu dublu clic se inlocuieste, spatiul de dupa el ramane
ambele('word-F007', 'Tastarea peste cuvântul ales cu dublu-clic îl înlocuiește, spațiul rămâne', async u => {
  await u.scrie('Plecam maine la bunici.');
  const w = await u.cuvant('maine');
  if (!w) return ['nu găsesc „maine” în pagină'];
  await u.p.mouse.dblclick(w.cx, w.cy); await pauza(300);
  await u.p.keyboard.type('joi', { delay: 10 }); await pauza(150);
  const t = (await T(u))[0];
  return t === 'Plecam joi la bunici.' ? [] : [`textul e ${J(t)} (trebuia „Plecam joi la bunici.”)`];
}, { ok: '„Plecam joi la bunici.”' });

// ---- Fisiere
// Word 2007: Save As e in butonul Office, nu in Backstage, si .odt a venit abia in SP2 -> doar pe word365
proba('word-F079', 'Salvează ca .odt / .rtf (Save as type), apoi lucrezi în fișierul nou', async u => {
  const pb = [];
  await u.scrie('Tema mea');
  for (const [tip, ext] of [[/OpenDocument Text/, 'odt'], [/Rich Text Format/, 'rtf']]) {
    await u.p.keyboard.press('F12'); await pauza(500);
    if (!(await u.are('camp', 'tip_fisier'))) { pb.push('F12 nu deschide Save As'); break; }
    await u.completeaza('nume_fisier', 'tema_' + ext, 'File name');
    await u.marcheaza();
    await u.clicCentru(u.loc('camp', 'tip_fisier'), 'Save as type', { pauza: 300 });
    if (!(await u.clicEt(tip, { noi: true, pauza: 250 }))) { pb.push(`lista Save as type n-are ${tip.source} (arată: ${await u.textNoi()})`); await u.p.keyboard.press('Escape'); await u.p.keyboard.press('Escape'); continue; }
    if (!(await u.clicEt(/^Save$/, { pauza: 400 }))) { pb.push('Save As n-are Save'); continue; }
    // la .odt Word intreaba de format (pastrezi formatul ales)
    const d = (await u.st()).dialog;
    if (d && d.butoane) { const b = d.butoane.find(x => /^(Yes|Keep|OK|Use)/i.test(x)) || d.butoane[0]; await u.clicEt(new RegExp('^' + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), { pauza: 300 }); }
    const s = await u.st();
    if (s.nume_fisier !== `tema_${ext}.${ext}`) {
      const ns = await u.nesim();
      pb.push(`.${ext}: după Save numele fișierului e ${J(s.nume_fisier)} (trebuia „tema_${ext}.${ext}”)${ns.length ? ', mesaj: ' + ns[ns.length - 1] : ''}`);
    } else if (!String(s.titlu_fereastra || '').includes(`tema_${ext}.${ext}`)) pb.push(`.${ext}: bara de titlu arată ${J(s.titlu_fereastra)}`);
  }
  return pb;
}, { ok: 'tema_odt.odt și tema_rtf.rtf, titlul ferestrei = fișierul nou' });

// Word 2007: Close e in meniul butonului Office (nu File › Close) -> doar pe word365
proba('word-F088', 'File › Close închide documentul', async u => {
  await u.fila('File');
  if (!(await u.are('backstage', 'Close'))) return ['Backstage n-are Close'];
  await u.clic(u.loc('backstage', 'Close'), 'File › Close', { pauza: 400 });
  const s = await u.st(); const ns = await u.nesim();
  if (s.documente_deschise !== 0) return [`după File › Close: documente_deschise=${s.documente_deschise}, titlu ${J(s.titlu_fereastra)}${ns.length ? ', mesaj: ' + ns[ns.length - 1] : ''}`];
  return [];
}, { ok: 'documentul nemodificat s-a închis (0 documente)' });

// Word 2007: Save e in butonul Office / bara Quick Access -> doar pe word365
proba('word-F089', 'File › Save pe un document deja salvat salvează pe loc', async u => {
  const pb = [];
  await u.scrie('Nota');
  await u.p.keyboard.press('F12'); await pauza(500);
  await u.completeaza('nume_fisier', 'nota', 'File name');
  if (!(await u.clicEt(/^Save$/, { pauza: 400 }))) return ['Save As n-are Save'];
  const s0 = await u.st();
  if (s0.nume_fisier !== 'nota.docx') return [`pregătirea: după Save As fișierul e ${J(s0.nume_fisier)}`];
  await u.scrie(' bine');
  await u.fila('File');
  await u.clic(u.loc('backstage', 'Save'), 'File › Save', { pauza: 400 });
  const s = await u.st();
  if (s.pagina_backstage || s.dialog_salvare || (await u.are('camp', 'nume_fisier'))) pb.push(`File › Save pe nota.docx deschide ${J(s.pagina_backstage || (s.dialog_salvare && s.dialog_salvare.titlu) || 'Save As')} (trebuia să salveze pe loc și să revină în document)`);
  else if (await u.are('backstage', 'Save')) pb.push('după File › Save Backstage-ul rămâne deschis');
  return pb;
}, { ok: 'salvat pe loc, înapoi în document' });

// deschiderea din Explorer nu tine de profilul Word -> doar o data (poligonul Explorer are tema.docx)
proba('word-F091', 'Deschide un .docx din File Explorer cu dublu-clic', async u => {
  await u.marcheaza();
  const g = await u.clicEt(/^tema(\.docx)?$/, { dublu: true, pauza: 900 });
  if (!g) return ['Explorer-ul de probă nu arată tema.docx'];
  const word = await u.p.locator('[data-lh-aplicatie="word"]').count();
  if (!word) { const ns = await u.nesim(); return ['dublu-clic pe tema.docx nu pornește Word' + (ns.length ? ' (mesaj: ' + ns[ns.length - 1] + ')' : ` (apare: ${await u.textNoi()})`)]; }
  const s = await u.p.evaluate(() => { try { return window.LH.aplicatii.stare('word'); } catch (e) { return null; } });
  if (!s || !/tema/i.test(String(s.titlu_fereastra || '') + String(s.nume_fisier || ''))) return [`Word pornit, dar titlul e ${J(s && s.titlu_fereastra)}`];
  return [];
}, { aplicatie: 'explorer', ok: 'Word deschis cu tema.docx' });

// ---- Formatare paragraf
ambele('word-F042', 'Spațiul înainte / după paragraf din fereastra Paragraph', async u => {
  await u.scrie('Unu');
  await u.p.keyboard.press('Enter'); await u.p.keyboard.type('Doi', { delay: 10 }); await pauza(100);
  const y = async () => { const a = await u.loc('text', '1').boundingBox(), b = await u.loc('text', '2').boundingBox(); return [a.y, b.y]; };
  const [a0, b0] = await y();
  const w = await u.cuvant('Unu'); await u.p.mouse.click(w.cx, w.cy); await pauza(100);
  await u.clic(u.loc('lansator', 'Home/Paragraph'), 'Paragraph...', { pauza: 400 });
  if (!(await u.are('camp', 'Before'))) return ['fereastra Paragraph n-are Before'];
  await u.completeaza('Before', '24', 'Before'); await u.completeaza('After', '24', 'After');
  if (!(await u.clicEt(/^OK$/, { pauza: 400 }))) return ['fereastra Paragraph n-are OK'];
  const [a1, b1] = await y();
  const pb = [];
  if (a1 - a0 < 20) pb.push(`Before 24 pt: paragraful 1 coboară ${Math.round(a1 - a0)} px (trebuia ~32 px)`);
  if ((b1 - a1) - (b0 - a0) < 10) pb.push(`After 24 pt: distanța până la paragraful 2 crește cu ${Math.round((b1 - a1) - (b0 - a0))} px (trebuia ~21 px)`);
  return pb;
}, { ok: 'paragraful coboară, distanța crește' });

ambele('word-F044', 'Ctrl+Q scoate formatarea paragrafului', async u => {
  await u.scrie('Ana are mere');
  await u.p.keyboard.press('Control+e'); await pauza(150);
  const a0 = (await u.st()).aliniere_paragrafe[0];
  await u.p.keyboard.press('Control+q'); await pauza(150);
  const a1 = (await u.st()).aliniere_paragrafe[0];
  if (a0 === 'stanga') return [`pregătirea: Ctrl+E n-a centrat (${a0})`];
  const ns = await u.nesim();
  return a1 === 'stanga' ? [] : [`după Ctrl+Q alinierea e ${J(a1)} (trebuia „stanga”)${ns.length ? ', mesaj: ' + ns[ns.length - 1] : ''}`];
}, { ok: 'centrat → stânga' });

// ---- Formatare text
ambele('word-F035', 'Grow / Shrink Font peste 72 și sub 8, plus Ctrl+Shift+> / <', async u => {
  const pb = [];
  const m = async () => ((await u.st()).formatare_pe_caractere[0] || {}).marime;
  await u.scrie('Ana');
  await u.p.keyboard.press('Control+a'); await pauza(80);
  await u.p.keyboard.press('Control+Shift+Period'); await pauza(150);
  let v = await m(); if (v !== 12) pb.push(`Ctrl+Shift+> din 11 dă ${v} (trebuia 12)`);
  const v0 = await m();
  await u.p.keyboard.press('Control+Shift+Comma'); await pauza(150);
  v = await m(); if (v !== v0 - 1) pb.push(`Ctrl+Shift+< din ${v0} dă ${v} (trebuia ${v0 - 1})`);
  await u.marimeFont(11);
  // control: butonul Grow Font merge in mijlocul scarii (11 → 12), deci clicul ajunge la el
  await u.clic(u.loc('panglica', 'Home/Font/Grow Font'), 'Grow Font');
  v = await m(); if (v !== 12) pb.push(`control: Grow Font din 11 dă ${v} (trebuia 12)`);
  await u.marimeFont(72);
  if ((await m()) !== 72) return [...pb, `pregătirea: Font Size 72 nu s-a pus (${await m()})`];
  await u.clic(u.loc('panglica', 'Home/Font/Grow Font'), 'Grow Font');
  v = await m(); if (v !== 80) pb.push(`Grow Font din 72 dă ${v} (trebuia 80)`);
  await u.marimeFont(8);
  await u.clic(u.loc('panglica', 'Home/Font/Shrink Font'), 'Shrink Font');
  v = await m(); if (v !== 7) pb.push(`Shrink Font din 8 dă ${v} (trebuia 7)`);
  return pb;
}, { ok: '11→12→11, 72→80, 8→7' });

ambele('word-F037', 'Ctrl+Space scoate formatarea caracterelor', async u => {
  await u.scrie('Ana are');
  await u.p.keyboard.press('Control+a');
  for (const k of ['Control+b', 'Control+i', 'Control+u']) { await u.p.keyboard.press(k); await pauza(80); }
  const f0 = (await u.st()).formatare_pe_caractere[0] || {};
  if (!f0.bold || !f0.italic) return [`pregătirea: B/I nu s-au pus (${J(f0)})`];
  await u.p.keyboard.press('Control+Space'); await pauza(150);
  const f = (await u.st()).formatare_pe_caractere;
  const ramas = f.filter(x => x.bold || x.italic || x.underline);
  return ramas.length ? [`după Ctrl+Space rămâne formatarea ${J(ramas[0])}`] : [];
}, { ok: 'B, I, U scoase' });

// ---- Imagine
// Word 2007: poza selectata n-are butonul Layout Options (a venit in 2013), fila e Picture Tools › Format -> doar word365
proba('word-F061', 'Un clic pe poză o selectează: 8 mânere, Layout Options, fila Picture Format', async u => {
  const pb = [];
  await u.scrie('');
  await u.poza();
  const b = await u.imagine().boundingBox();
  if (!b) return ['nu văd poza inserată'];
  await u.marcheaza();
  await u.p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await pauza(300);
  const b2 = (await u.imagine().boundingBox()) || b;
  const m = await u.manere(b2);
  if (m.length < 8) pb.push(`în jurul pozei sunt ${m.length} mânere noi (trebuia 8)`);
  if (!(await u.gaseste(/^Layout Options$/))) pb.push('lipsește butonul Layout Options');
  if (!(await u.are('fila', 'Picture Format'))) pb.push('lipsește fila Picture Format');
  return pb;
}, { ok: 'mânere, Layout Options, Picture Format' });

ambele('word-F063', 'Tras de mânerul de pe latura dreaptă: se schimbă doar lățimea', async u => {
  await u.scrie('');
  await u.poza();
  const b = await u.imagine().boundingBox();
  await u.marcheaza();
  await u.p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await pauza(300);
  const m = (await u.manere(b)).filter(h => Math.abs(h.x - (b.x + b.width)) < 12 && Math.abs(h.y - (b.y + b.height / 2)) < 12);
  if (!m.length) return ['poza selectată n-are mâner pe mijlocul laturii din dreapta'];
  await u.trageMouse(m[0].x, m[0].y, m[0].x + 80, m[0].y);
  const b2 = await u.imagine().boundingBox();
  const pb = [];
  if (b2.width - b.width < 40) pb.push(`lățimea ${Math.round(b.width)} → ${Math.round(b2.width)} px (trebuia +80)`);
  if (Math.abs(b2.height - b.height) > 3) pb.push(`înălțimea s-a schimbat ${Math.round(b.height)} → ${Math.round(b2.height)} px`);
  return pb;
}, { ok: 'lățimea +80 px, înălțimea la fel' });

ambele('word-F066', 'Enter cu poza selectată o coboară pe rândul următor', async u => {
  await u.scrie('');
  await u.poza();
  const b = await u.imagine().boundingBox();
  await u.p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await pauza(300);
  const n0 = (await T(u)).length;
  await u.p.keyboard.press('Enter'); await pauza(200);
  const s = await u.st(), b2 = await u.imagine().boundingBox().catch(() => null);
  const pb = [];
  if (!b2 || s.imagini.in_linie !== 1) pb.push(`după Enter poza nu mai e (${J(s.imagini)})`);
  else if (b2.y - b.y < 8) pb.push(`poza n-a coborât (y ${Math.round(b.y)} → ${Math.round(b2.y)}), paragrafe ${n0} → ${s.text.length}`);
  return pb;
}, { ok: 'poza a coborât un rând' });

// partea „⌫ lângă poză n-o șterge” nu e jucată (vezi raportul probe_c.md, punctul 3)
ambele('word-F067', 'Poza selectată se șterge cu Delete și cu ⌫', async u => {
  const pb = [];
  await u.scrie('');
  await u.poza();
  for (const k of ['Delete', 'Backspace']) {
    const b = await u.imagine().boundingBox().catch(() => null);
    if (!b) { pb.push(`înainte de ${k}: nu văd poza`); break; }
    await u.p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await pauza(300);
    await u.p.keyboard.press(k); await pauza(200);
    const s = await u.st();
    if (s.imagini.in_linie !== 0) pb.push(`după clic pe poză și ${k} în document sunt ${s.imagini.in_linie} poze (trebuia 0)`);
    else { await u.p.keyboard.press('Control+z'); await pauza(200); }
  }
  return pb;
}, { ok: 'Delete și ⌫ șterg poza selectată' });

// ---- Navigare
// Word real (la 1920 px pagina incape pe latime) nu arata bara orizontala -> sagetile ◄► nu se probeaza
ambele('word-F010', 'Derulează din bară: ▼, pista deasupra degetului (pagină sus), degetul tras', async u => {
  const pb = [];
  await u.scrie('');
  for (let i = 0; i < 70; i++) await u.p.keyboard.press('Enter');
  await u.p.keyboard.press('Control+Home'); await pauza(300);
  const pg = () => u.gaseste(/^Page 1$/).then(g => g ? g.y - g.h / 2 : NaN);
  const y0 = await pg();
  await u.clic(u.loc('bara_derulare', 'Line down'), '▼');
  await u.clic(u.loc('bara_derulare', 'Line down'), '▼');
  const y1 = await pg();
  if (!(y1 < y0 - 5)) pb.push(`▼ nu derulează (${Math.round(y0)} → ${Math.round(y1)})`);
  const deget = u.p.locator(`${u.R} [data-lh-tip="ScrollBar"] [data-lh-tip="Thumb"]:visible`).first();
  let d = await deget.boundingBox().catch(() => null);
  if (!d) return [...pb, 'bara verticală n-are deget (Thumb)'];
  await u.trageMouse(d.x + d.width / 2, d.y + d.height / 2, d.x + d.width / 2, d.y + d.height / 2 + 120);
  const y2 = await pg();
  if (!(y2 < y1 - 40)) pb.push(`degetul tras 120 px în jos nu derulează (${Math.round(y1)} → ${Math.round(y2)})`);
  // daca degetul n-a plecat, il duce pista de dedesubt (exista), ca sa ramana loc deasupra lui
  d = await deget.boundingBox();
  const sus = await u.loc('bara_derulare', 'Line up').boundingBox();
  if (d.y - (sus.y + sus.height) < 10) { await u.p.mouse.click(d.x + d.width / 2, d.y + d.height + 10); await pauza(200); d = await deget.boundingBox(); }
  const y3 = await pg();
  await u.p.mouse.click(d.x + d.width / 2, sus.y + sus.height + Math.max(3, (d.y - sus.y - sus.height) / 2)); await pauza(250);
  const y4 = await pg();
  if (!(y4 > y3 + 40)) pb.push(`clic pe pistă deasupra degetului nu urcă o pagină (${Math.round(y3)} → ${Math.round(y4)})`);
  return pb;
}, { ok: '▼, deget tras, pagină sus din pistă' });

// ---- Pagina
ambele('word-F073', 'Page Setup refuză o măsură greșită și marginile prea mari, cu mesajul lui Word', async u => {
  const pb = [];
  await u.fila('Layout');
  await u.clic(u.loc('lansator', 'Layout/Page Setup'), 'Page Setup...', { pauza: 400 });
  if (!(await u.are('camp', 'Top'))) return ['fereastra Page Setup n-are Top'];
  await u.completeaza('Top', 'abc', 'Top');
  await u.clicEt(/^OK$/, { pauza: 400 });
  let txt = await u.textPagina();
  if (!/This is not a valid measurement\./.test(txt)) pb.push('Top „abc” + OK: nu apare „This is not a valid measurement.”');
  else { await u.clicEt(/^OK$/, { pauza: 300 }); }
  if (!(await u.are('camp', 'Top'))) { await u.fila('Layout'); await u.clic(u.loc('lansator', 'Layout/Page Setup'), 'Page Setup...', { pauza: 400 }); }
  await u.completeaza('Top', '28', 'Top');
  await u.clicEt(/^OK$/, { pauza: 400 });
  txt = await u.textPagina();
  if (!/margins are too large/i.test(txt)) {
    const m = (await u.st()).pagina.margini_cm;
    pb.push(`Top 28 cm + OK: nu apare „The top/bottom margins are too large…” (marginile acum ${J(m)})`);
  }
  return pb;
}, { ok: 'ambele mesaje' });

// ---- Selectare
ambele('word-F015', 'Ctrl+clic selectează propoziția', async u => {
  await u.scrie('Ana are mere. Dan are pere. Ion are prune.');
  const w = await u.cuvant('pere');
  if (!w) return ['nu găsesc „pere” în pagină'];
  await u.p.keyboard.down('Control'); await u.p.mouse.click(w.cx, w.cy); await u.p.keyboard.up('Control'); await pauza(200);
  const s = (await u.st()).selectie;
  return (s.text || '').trim() === 'Dan are pere.' ? [] : [`selecția după Ctrl+clic pe „pere”: ${J(s.text)} (trebuia „Dan are pere. ”)`];
}, { ok: '„Dan are pere. ” selectată' });

ambele('word-F016', 'Shift+clic și Shift+săgeți măresc selecția (pe telefon: butoanele Shift+← / Shift+→)', async u => {
  const pb = [];
  await u.scrie('Ana are mere');
  await u.p.keyboard.press('Home');
  for (let i = 0; i < 3; i++) await u.p.keyboard.press('Shift+ArrowRight');
  await pauza(100);
  let s = (await u.st()).selectie;
  if (s.text !== 'Ana') pb.push(`Shift+→ × 3: ${J(s.text)} (trebuia „Ana”)`);
  const w = await u.cuvant('are');
  await u.p.keyboard.down('Shift'); await u.p.mouse.click(w.x + w.w - 1, w.cy); await u.p.keyboard.up('Shift'); await pauza(200);
  s = (await u.st()).selectie;
  if (s.text !== 'Ana are') pb.push(`Shift+clic după „are”: ${J(s.text)} (trebuia „Ana are”)`);
  // telefonul: butoanele de sub fereastra
  const t = await u.p.context().browser().newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    await t.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
    const p2 = await t.newPage();
    await p2.goto(u.p.url(), { waitUntil: 'load' });
    await p2.waitForSelector(R, { timeout: 12000 }); await pauza(500);
    const u2 = unelte(p2, [], R);
    const b = await u2.loc('text', '1').boundingBox();
    await p2.touchscreen.tap(b.x + 20, b.y + b.height / 2); await pauza(200);
    await p2.keyboard.type('Ana are mere', { delay: 8 }); await p2.keyboard.press('Home'); await pauza(150);
    let n = 0;
    for (let i = 0; i < 2; i++) if (await u2.clicEt(/^Shift\s*\+?\s*(→|Right|Arrow ?Right)$/i, { tap: true })) n++;
    const s2 = (await u2.st()).selectie;
    if (!n) pb.push('pe telefon nu e niciun buton Shift+→');
    else if ((s2.text || '').length !== 2) pb.push(`pe telefon, 2 × Shift+→: selecția ${J(s2.text)} (trebuia „An”)`);
  } finally { await t.close().catch(() => {}); }
  return pb;
}, { ok: 'Shift+→, Shift+clic, butoanele de telefon' });

// Word real: Ctrl+A selecteaza TOT documentul si cand cursorul e intr-o celula (vechiul lua doar textul celulei)
ambele('word-F017', 'Ctrl+A selectează tot documentul (și din celula unui tabel)', async u => {
  await u.scrie('Ana are mere.');
  await u.p.keyboard.press('Enter');
  await u.tabel(2, 2);
  await u.p.keyboard.type('unu', { delay: 10 }); await pauza(100);
  await u.p.keyboard.press('Control+a'); await pauza(200);
  const s = (await u.st()).selectie;
  return /Ana are mere\./.test(s.text || '') ? [] : [`Ctrl+A din celulă selectează ${J(s.text)} (trebuia tot documentul, cu „Ana are mere.”)`];
}, { ok: 'tot documentul selectat' });

// ---- Tabel
ambele('word-F052', 'Enter într-o celulă face un rând nou în celulă', async u => {
  await u.scrie('');
  await u.tabel(3, 2);
  const h0 = (await u.celula(1, 1).boundingBox()).height;
  await u.p.keyboard.type('unu', { delay: 10 });
  await u.p.keyboard.press('Enter');
  await u.p.keyboard.type('doi', { delay: 10 }); await pauza(150);
  const c = ((await u.st()).tabele[0] || { celule: [['?']] }).celule[0][0];
  const h1 = (await u.celula(1, 1).boundingBox()).height;
  const pb = [];
  if (!/unu\s*[\n\r\u000b]\s*doi/i.test(c)) pb.push(`celula are ${J(c)} (trebuia „unu” și „doi” pe rânduri diferite)`);
  if (h1 - h0 < 10) pb.push(`celula nu s-a înălțat (${Math.round(h0)} → ${Math.round(h1)} px)`);
  return pb;
}, { ok: 'două rânduri în celulă, celula mai înaltă' });

ambele('word-F057', 'Table Layout › View Gridlines arată liniile tabelului fără chenar', async u => {
  await u.scrie('');
  await u.tabel(2, 2);
  // tabelul fara chenar: Table Design › Borders ▾ › No Border (daca exista)
  await u.clicCentru(u.celula(1, 1), 'celula 1,1');
  if (await u.filaContext('Table Design')) {
    await u.fila('Table Design');
    await u.marcheaza();
    const dd = await u.gaseste(/^(More Options|Borders)$/);
    if (dd && await u.clicEt(/^Borders$/, { pauza: 250 })) { await u.clicEt(/^No Border$/, { noi: true, pauza: 250 }); await u.p.keyboard.press('Escape').catch(() => {}); }
  }
  const stil = () => u.p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-tinta="tabel"] td')].map(td => {
    const c = getComputedStyle(td); return [c.borderTopStyle, c.borderTopColor, c.borderTopWidth, c.borderLeftStyle, c.outlineStyle, c.backgroundImage].join(',');
  }).join(';'), u.R);
  const s0 = await stil();
  await u.clicCentru(u.celula(1, 1), 'celula 1,1');
  if (!(await u.filaContext('Table Layout'))) return ['fila Table Layout lipsește cu cursorul în tabel'];
  await u.fila('Table Layout');
  const g = await u.clicEt(/^View Gridlines$/, { pauza: 300 });
  if (!g) return ['Table Layout n-are View Gridlines'];
  const ns = await u.nesim();
  const s1 = await stil();
  if (ns.length) return ['View Gridlines dă mesajul: ' + ns[ns.length - 1]];
  return s1 !== s0 ? [] : ['după View Gridlines liniile celulelor arată la fel (nicio grilă punctată)'];
}, { ok: 'grila apare' });

// ---- Vizualizare
ambele('word-F096', 'Zoom trăgând glisorul din bara de stare', async u => {
  const d = await u.gaseste(/^Position$/);
  if (!d) return ['glisorul zoomului n-are degetul (Position)'];
  const z0 = await u.zoomEticheta();
  // se citeste in timpul tragerii (inainte de eliberare): un clic simplu la capat nu e tragere
  const zIn = await u.trageMouse(d.x, d.y, d.x + 30, d.y, () => u.zoomEticheta());
  const z1 = await u.zoomEticheta();
  const pc = s => (/(\d+)\s*%/.exec(s) || [])[1];
  if (pc(zIn) === pc(z0)) return [`în timpul tragerii zoomul rămâne ${pc(zIn)} % (după eliberare ${pc(z1)} %)`];
  if (!(+pc(z1) > +pc(z0))) return [`după tragere spre dreapta zoomul e ${pc(z1)} % (era ${pc(z0)} %)`];
  return [];
}, { ok: 'zoomul crește în timpul tragerii' });

ambele('word-F097', 'View › 100% readuce zoomul la 100 %', async u => {
  // pregatirea: clic pe glisor, spre dreapta (butonul Zoom In e azi nesimulat)
  const gl = await u.loc('zoom').boundingBox();
  await u.p.mouse.click(gl.x + gl.width * 0.8, gl.y + gl.height / 2); await pauza(250);
  const z0 = await u.zoomEticheta();
  if (/\b100\s*%/.test(z0)) return [`pregătirea: clicul pe glisor nu schimbă zoomul (${z0.trim()})`];
  await u.fila('View');
  await u.clic(u.loc('panglica', 'View/Zoom/100%'), 'View › 100%', { pauza: 300 });
  const z1 = await u.zoomEticheta(); const ns = await u.nesim();
  return /\b100\s*%/.test(z1) ? [] : [`după View › 100% zoomul arată ${J(z1.trim())}${ns.length ? ', mesaj: ' + ns[ns.length - 1] : ''}`];
}, { ok: 'zoom schimbat → 100 %' });

// ================= rularea =================
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null;
  const iesiri = new Array(PROBE.length).fill(null);
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    let k = 0, afisat = 0;
    const scoate = () => { while (afisat < PROBE.length && iesiri[afisat] != null) console.log(iesiri[afisat++]); };
    const lucrator = async () => {
      while (k < PROBE.length) {
        const i = k++;
        iesiri[i] = await ruleaza(browser, base, PROBE[i]);
        scoate();
      }
    };
    await Promise.all(Array.from({ length: PARALEL }, lucrator));
  } catch (e) {
    PROBE.forEach((pr, i) => { if (iesiri[i] == null) console.log(linie('FAIL', pr.id, pr.nume, 'nerulată: ' + e.message.split('\n')[0])); });
  } finally {
    if (browser) await browser.close().catch(() => {});
    srv.close();
  }
  console.log(`durata ${((Date.now() - t0) / 1000).toFixed(0)} s, ${PROBE.length} probe`);
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
