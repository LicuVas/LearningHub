// Probe de paritate PowerPoint, felia c (noaptea 23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_powerpoint_23_11/felii/felie_c.json  (24 de randuri:
//   Diapozitive, Text, Formatare text, Formatare forme, Fundal si teme, Expunere, Atelier „repara diapozitivul”).
// O proba = gestul elevului jucat in browser (clicuri, taste, deget reale prin Playwright, pe elemente vizibile, cu
// focusul IN aplicatie), apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('powerpoint').
// Tinta = PowerPointul real (Microsoft 365, interfata EN); vechiul simulator arata doar CE trebuie sa existe.
// Unde sursele reale tac, proba cere doar efectul sigur si poarta `// [DEDUS]` langa presupunere.
// Pagina de proba: /aplicatii/poligon.html?aplicatie=powerpoint (3 diapozitive: Title Slide „Vulcanii” / „Clasa a VI-a”,
// Title and Content „Ce sunt vulcanii” / „Munti prin care iese lava…”, Title Only „Intrebari?”).
// Rulare:  node aplicatii/_verificare/powerpoint_paritate_c.mjs   (din orice director; caile se afla singure)
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
const R = '[data-lh-aplicatie="powerpoint"]';
// tinta canonica, in ambele forme din api_biblioteca.md §3 (fel + data-lh-id sau „fel:valoare”), doar vizibila
const sel = (fel, val) => val == null ? `${R} [data-lh-tinta="${fel}"]:visible`
  : `${R} [data-lh-tinta="${fel}"][data-lh-id="${val}"]:visible, ${R} [data-lh-tinta="${fel}:${val}"]:visible`;
const TITLURI = ['Vulcanii', 'Ce sunt vulcanii', 'Întrebări?'];
const titluri = s => s.diapozitive.map(d => (d.texte || [])[0]);
const hex = c => (c || '').toUpperCase();

// ---------- unelte legate de o pagina
function unelte(p, erori, deschideAlt) {
  const u = {
    p, erori,
    alt: deschideAlt,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('powerpoint')),
    loc: (fel, val) => p.locator(sel(fel, val)).first(),
    are: async (fel, val) => (await p.locator(sel(fel, val)).count()) > 0,
    mso: id => p.locator(`${R} [data-lh-id-mso="${id}"]:visible`).first(),
    mini: n => u.loc('miniatura', String(n)),
    forma: (d, s) => u.loc('forma', `${d}/${s}`),
    margine: (d, s) => u.loc('margine_forma', `${d}/${s}`),
    // clic REAL al mouse-ului in centrul elementului vizibil (ca un elev: pe un buton gri clicul nu face nimic)
    async clic(loc, ce, opt = {}) {
      let b = null;
      try { await loc.scrollIntoViewIfNeeded({ timeout: 3000 }); b = await loc.boundingBox({ timeout: 3000 }); } catch (e) { b = null; }
      if (!b || b.width < 1 || b.height < 1) throw new Error(`nu găsesc pe ecran ${ce}`);
      await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2, opt.button ? { button: opt.button } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 200);
    },
    async fila(nume) {
      const l = p.locator(`${R} [data-lh-tip="TabItem"][data-lh-eticheta="${nume}"]:visible, ${sel('fila', nume)}`);
      if (!(await l.count())) throw new Error('nu găsesc fila ' + nume);
      await u.clic(l.first(), 'fila ' + nume, { pauza: 250 });
    },
    // mesajele „aici nu e simulată” vizibile (doar cele care pomenesc cuvantul, daca e dat)
    nesim: (cuvant) => p.evaluate(([R, cuvant]) => {
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      return [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(viz).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 110))
        .filter(t => !cuvant || t.includes(cuvant));
    }, [R, cuvant || null]),
    // tine minte ce e vizibil acum; „noi” = ce devine vizibil dupa
    marcheaza: () => p.evaluate(R => {
      const s = new WeakSet();
      for (const e of document.querySelector(R).querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) s.add(e); }
      window.__probaVechi = s;
    }, R),
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
        if (scor > bs) { bs = scor; best = { x: cx, y: cy, w: r.width, h: r.height, tinta: ti, eticheta: e.getAttribute('data-lh-eticheta'), text: own, vazut: !!(sus && (e === sus || e.contains(sus))) }; }
      }
      return best;
    }, [R, re.source, re.flags, !!opt.noi]),
    async clicEt(re, opt = {}) {
      const g = await u.gaseste(re, opt);
      if (!g || !g.vazut) return null;           // ascuns sub altceva (galerie derulata): nu-l apasam pe ghicite
      if (opt.tap) await p.touchscreen.tap(g.x, g.y);
      else await p.mouse.click(g.x, g.y, opt.dreapta ? { button: 'right' } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 250);
      return g;
    },
    // clic dreapta pe un element, apoi randul din meniul aparut
    async meniuPe(loc, ce, re) {
      await u.marcheaza();
      await u.clic(loc, ce + ' (clic dreapta)', { button: 'right', pauza: 300 });
      return u.clicEt(re, { noi: true });
    },
    // clic dreapta intr-un punct, apoi randul din meniul aparut
    async meniuLa(x, y, re) {
      await u.marcheaza();
      await p.mouse.click(x, y, { button: 'right' }); await pauza(300);
      return u.clicEt(re, { noi: true });
    },
    // un punct gol pe diapozitivul din mijloc (nu pe o caseta), de jos in sus
    punctGol: () => p.evaluate(R => {
      const root = document.querySelector(R);
      const d = [...root.querySelectorAll('[data-lh-tinta="diapozitiv"]')].find(e => e.getBoundingClientRect().width > 50);
      if (!d) return null;
      const r = d.getBoundingClientRect();
      for (const fy of [0.92, 0.85, 0.78, 0.7, 0.6, 0.5]) for (const fx of [0.5, 0.2, 0.8, 0.1, 0.9]) {
        const x = r.x + r.width * fx, y = r.y + r.height * fy;
        const e = document.elementFromPoint(x, y);
        if (!e || !d.contains(e)) continue;
        if (e.closest('[data-lh-tinta^="forma"],[data-lh-tinta^="margine_forma"]')) continue;
        return { x, y };
      }
      return null;
    }, R),
    // punctul de pe ecran al inceputului unui cuvant din textul unei casete (pentru a pune cursorul in el)
    punctCuvant: (d, s, cuv) => p.evaluate(([R, ds, cuv]) => {
      const f = document.querySelector(`${R} [data-lh-tinta="forma"][data-lh-id="${ds}"], ${R} [data-lh-tinta="forma:${ds}"]`);
      if (!f) return null;
      const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const i = w.currentNode.textContent.indexOf(cuv);
        if (i < 0) continue;
        const rg = document.createRange(); rg.setStart(w.currentNode, i + 1); rg.setEnd(w.currentNode, i + 2);
        const r = rg.getBoundingClientRect();
        if (r.width > 0) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      const r = f.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, [R, `${d}/${s}`, cuv]),
    // stratul expunerii: cel mai mic stramos al punctului din mijloc care acopera ~toata fereastra aplicatiei
    expunere: () => p.evaluate(R => {
      const root = document.querySelector(R), rr = root.getBoundingClientRect();
      let e = document.elementFromPoint(rr.x + rr.width / 2, rr.y + rr.height / 2);
      while (e && e !== root && root.contains(e)) {
        const r = e.getBoundingClientRect();
        if (r.width * r.height >= 0.97 * rr.width * rr.height) break;
        e = e.parentElement;
      }
      if (!e || e === root || !root.contains(e)) return null;
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(e).backgroundColor) || [];
      const anim = document.getAnimations ? document.getAnimations().filter(a => a.effect && a.effect.target && e.contains(a.effect.target) && a.playState === 'running').length : 0;
      let opac = 1;
      for (const x of e.querySelectorAll('*')) { const o = +getComputedStyle(x).opacity; if (o < opac) opac = o; }
      return { text: e.innerText.replace(/\s+/g, ' ').trim(), fundal: m.length ? [+m[1], +m[2], +m[3]] : null, anim, opac };
    }, R),
    // are elementul (sau un copil) culoarea data, ca fundal sau umplere SVG?
    areCuloare: (loc, h) => loc.evaluate((f, h) => {
      const tinta = h.replace('#', '').toUpperCase();
      const toHex = c => { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(c || ''); return m && (m[4] == null || +m[4] > 0.3) ? [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('').toUpperCase() : null; };
      for (const e of [f, ...f.querySelectorAll('*')]) {
        const cs = getComputedStyle(e);
        if (toHex(cs.backgroundColor) === tinta) return true;
        if (toHex(cs.fill) === tinta) return true;
        const fa = (e.getAttribute('fill') || '').replace('#', '').toUpperCase();
        if (fa === tinta) return true;
        if ((cs.backgroundImage || '').toUpperCase().includes(tinta)) return true;
      }
      return false;
    }, h),
    // culoarea literelor vazuta in caseta (primul nod de text), #RRGGBB
    culoareLitere: loc => loc.evaluate(f => {
      const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) if (w.currentNode.textContent.trim()) {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(w.currentNode.parentElement).color);
        return m ? '#' + [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('').toUpperCase() : null;
      }
      return null;
    }),
    async alegeTextul(d, s) {                // tot textul unei casete selectat (clic in text, Ctrl+A)
      await u.clic(u.forma(d, s), `caseta ${d}/${s}`, { pauza: 200 });
      await p.keyboard.press('Control+A'); await pauza(150);
    },
    async marimeScrisa(n) {                  // scrii numarul in caseta Font Size si apesi Enter
      await u.clic(p.locator(`${R} [data-lh-id-mso="FontSize"]:visible input`).first(), 'caseta Font Size', { pauza: 150 });
      await p.keyboard.press('Control+A'); await p.keyboard.type(String(n)); await p.keyboard.press('Enter'); await pauza(250);
    },
    async culoareDinLista(dropMso, re) {     // ▾ al unei palete › o culoare
      await u.marcheaza();
      await u.clic(u.mso(dropMso), dropMso, { pauza: 300 });
      return u.clicEt(re, { noi: true });
    },
    // trage cu mouse-ul; inainteDeSus = ce citim cu butonul inca apasat
    async trageMouse(x0, y0, x1, y1, inainteDeSus) {
      await p.mouse.move(x0, y0); await p.mouse.down();
      await p.mouse.move(x0 + (x1 - x0) * 0.3, y0 + (y1 - y0) * 0.3, { steps: 4 });
      await p.mouse.move(x1, y1, { steps: 6 });
      await pauza(150);
      const r = inainteDeSus ? await inainteDeSus() : null;
      await p.mouse.up(); await pauza(300);
      return r;
    },
    // pe telefon: tii degetul apasat, apoi tragi
    async tineSiTrage(x0, y0, x1, y1, tinereMs) {
      const cdp = await p.context().newCDPSession(p);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
      await pauza(tinereMs);
      for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 10, y: y0 + (y1 - y0) * i / 10 }] }); await pauza(30); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await cdp.detach();
      await pauza(350);
    },
    // elemente vizibile NOI (fata de marcheaza) subtiri si late = linia care arata locul la tragere
    // (panoul se poate redesena la apasare: nu numaram nimic din interiorul miniaturilor si nimic cu text)
    liniiNoi: latMini => p.evaluate(([R, latMini]) => {
      const vechi = window.__probaVechi, out = [];
      for (const e of document.querySelector(R).querySelectorAll('*')) {
        if (vechi && vechi.has(e)) continue;
        if (e.closest('[data-lh-tinta="miniatura"]') || e.querySelector('[data-lh-tinta="miniatura"]') || e.textContent.trim()) continue;
        if (/^(margine_forma|forma)/.test(e.getAttribute('data-lh-tinta') || '')) continue;
        const r = e.getBoundingClientRect();
        // doar in coloana miniaturilor (diapozitivul mare se redeseneaza si el)
        if (r.x > latMini.x + latMini.w + 30 || r.x + r.width < latMini.x - 30) continue;
        if (r.height >= 1 && r.height <= 8 && r.width >= 0.6 * latMini.w) out.push(Math.round(r.width) + 'x' + Math.round(r.height));
      }
      return out;
    }, [R, latMini]),
    // o tema din Design › Themes: galeria arata un rand; randurile urmatoare vin cu rotita mouse-ului peste galerie
    // (ca in PowerPoint); ▾ More nu deschide azi galeria intreaga (vezi raportul), deci nu ne bazam pe el
    async cautaTema(nume, apasa) {
      await u.fila('Design');
      const re = new RegExp('^' + nume + '$');
      const gal = await p.locator(`${R} [data-lh-id-mso="SlideThemesGallery"]:visible`).first().boundingBox().catch(() => null);
      if (gal) { await p.mouse.move(gal.x + gal.width * 0.4, gal.y + gal.height / 2); await p.mouse.wheel(0, -800); await pauza(150); }
      for (let i = 0; i < 14; i++) {
        const g = await u.gaseste(re);
        if (g && g.vazut) { if (apasa) { await p.mouse.click(g.x, g.y); await pauza(300); } return true; }
        if (!gal) break;
        await p.mouse.move(gal.x + gal.width * 0.4, gal.y + gal.height / 2); await p.mouse.wheel(0, 40); await pauza(120);
      }
      return false;
    },
    alegeTema: nume => u.cautaTema(nume, true),
    vedeTema: nume => u.cautaTema(nume, false),
  };
  return u;
}

async function deschide(browser, base, tel, contexte) {
  const ctx = await browser.newContext(tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
  contexte.push(ctx);
  ctx.setDefaultTimeout(5000);
  ctx.setDefaultNavigationTimeout(15000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0].slice(0, 120)));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=powerpoint`, { waitUntil: 'load' });
  await p.waitForSelector(R, { timeout: 12000 });
  await p.waitForFunction(() => { try { return window.LH.aplicatii.stare('powerpoint').diapozitive.length === 3; } catch (e) { return false; } }, null, { timeout: 12000 });
  await pauza(400);
  return unelte(p, erori, () => deschide(browser, base, true, contexte));
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
      const u = await deschide(browser, base, !!pr.tel, contexte);
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
const proba = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, ...opt });

// ---- Diapozitive
proba('powerpoint-F003', 'Layout din panglică și din clic dreapta (miniatură, fundal); textul rămâne; aspectele verticale', async u => {
  const pb = [];
  // a) clic dreapta pe miniatura 2 › Layout › Section Header: aspectul se schimba, titlul ramane
  if (!(await u.meniuPe(u.mini(2), 'miniatura 2', /^Layout$/))) pb.push('meniul de clic dreapta al miniaturii n-are Layout');
  else {
    const g = await u.clicEt(/^Section Header$/, { noi: true });
    const s = await u.st(); const d = s.diapozitive[1];
    if (!g) pb.push('miniatură › Layout nu deschide aspectele' + ((await u.nesim()).length ? ' (mesaj „nesimulat”)' : ''));
    else if (d.aspect !== 'Section Header' || d.texte[0] !== 'Ce sunt vulcanii') pb.push(`miniatură › Layout › Section Header: aspect=${d.aspect}, texte=${JSON.stringify(d.texte)}`);
    await u.p.keyboard.press('Escape'); await pauza(150);
  }
  // b) clic dreapta pe fundalul diapozitivului 3 › Layout › Blank: textul casetei care dispare ramane pe diapozitiv
  await u.clic(u.mini(3), 'miniatura 3');
  const pt = await u.punctGol();
  if (!pt) pb.push('n-am găsit un loc gol pe diapozitivul 3');
  else if (!(await u.meniuLa(pt.x, pt.y, /^Layout$/))) pb.push('meniul de clic dreapta pe diapozitiv n-are Layout');
  else {
    const g = await u.clicEt(/^Blank$/, { noi: true });
    const s = await u.st(); const d = s.diapozitive[2];
    if (!g) pb.push('fundal › Layout nu deschide aspectele');
    else if (d.aspect !== 'Blank' || !(d.texte || []).includes('Întrebări?')) pb.push(`fundal › Layout › Blank: aspect=${d.aspect}, texte=${JSON.stringify(d.texte)} (textul trebuia să rămână)`);
    await u.p.keyboard.press('Escape'); await pauza(150);
  }
  // c) Home › Layout ▾: tema Office are si cele doua aspecte verticale (11 aspecte)
  // [DEDUS] uia_powerpoint.json › lista.SlideLayoutGallery arata 9 (galeria se deruleaza); Office Theme are 11, ca vechiul
  await u.fila('Home');
  await u.marcheaza();
  await u.clic(u.mso('SlideLayoutGallery'), 'Home › Layout', { pauza: 300 });
  const lips = [];
  for (const n of ['Title and Vertical Text', 'Vertical Title and Text']) if (!(await u.gaseste(new RegExp('^' + n + '$'), { noi: true }))) lips.push(n);
  if (lips.length) pb.push('Home › Layout n-are: ' + lips.join(', '));
  else {
    await u.clic(u.mini(2), 'miniatura 2');
    await u.marcheaza(); await u.clic(u.mso('SlideLayoutGallery'), 'Home › Layout', { pauza: 300 });
    await u.clicEt(/^Title and Vertical Text$/, { noi: true });
    const d = (await u.st()).diapozitive[1];
    if (d.aspect !== 'Title and Vertical Text' || !(d.texte || []).includes('Ce sunt vulcanii')) pb.push(`Title and Vertical Text: aspect=${d.aspect}, texte=${JSON.stringify(d.texte)}`);
  }
  return pb;
}, { ok: 'miniatură › Layout, fundal › Layout (textul rămas), cele 11 aspecte' });

proba('powerpoint-F006', 'Tragerea miniaturii mută diapozitivul; o linie arată locul; pe telefon: ții apăsat și tragi', async u => {
  const pb = [];
  const b1 = await u.mini(1).boundingBox(), b3 = await u.mini(3).boundingBox();
  if (!b1 || !b3) return ['miniaturile nu sunt pe ecran'];
  await u.marcheaza();
  // [DEDUS] forma liniei: un element nou subtire (<= 8 px) si lat (>= 40 px), aparut doar in timpul tragerii
  const linii = await u.trageMouse(b1.x + b1.width / 2, b1.y + b1.height / 2, b3.x + b3.width / 2, b3.y + b3.height * 0.9, () => u.liniiNoi({ x: b1.x, w: b1.width }));
  let s = await u.st();
  if (JSON.stringify(titluri(s)) !== JSON.stringify([TITLURI[1], TITLURI[2], TITLURI[0]]) || s.diapozitiv_activ !== 3) pb.push(`după tragerea 1→3: ordinea ${JSON.stringify(titluri(s))}, ales ${s.diapozitiv_activ}`);
  if (!linii.length) pb.push('în timpul tragerii nu apare nicio linie care să arate locul');
  // pe telefon (390×844, deget): tii apasat pe miniatura 1, apoi tragi sub a 3-a
  const t = await u.alt();
  const m1 = await t.mini(1).boundingBox().catch(() => null), m3 = await t.mini(3).boundingBox().catch(() => null);
  if (!m1 || !m3) pb.push('pe telefon miniaturile nu sunt pe ecran');
  else {
    await t.tineSiTrage(m1.x + m1.width / 2, m1.y + m1.height / 2, m3.x + m3.width / 2, m3.y + m3.height * 0.9, 700);
    s = await t.st();
    if (JSON.stringify(titluri(s)) !== JSON.stringify([TITLURI[1], TITLURI[2], TITLURI[0]])) pb.push(`pe telefon (ții apăsat, tragi 1→3): ordinea ${JSON.stringify(titluri(s))}`);
  }
  return pb;
}, { tel: false, contexte: 2, ok: 'ordinea 2,3,1, linia de loc, merge și cu degetul' });

proba('powerpoint-F007', 'Duplicate: Ctrl+D, New Slide ▾ › Duplicate Selected Slides, Copy ▾ › Duplicate, miniatură › Duplicate Slide', async u => {
  const pb = [];
  const verif = async (ce, nAstept) => {
    const s = await u.st();
    if (s.diapozitive.length !== nAstept || s.diapozitiv_activ !== 3 || s.diapozitive[2].texte[0] !== 'Ce sunt vulcanii' || s.diapozitive[1].texte[0] !== 'Ce sunt vulcanii')
      pb.push(`${ce}: n=${s.diapozitive.length} (trebuia ${nAstept}), ales ${s.diapozitiv_activ}, titluri ${JSON.stringify(titluri(s))}`);
    return s.diapozitive.length;
  };
  const sterge3 = async () => { await u.clic(u.mini(3), 'miniatura 3'); await u.p.keyboard.press('Delete'); await pauza(200); };
  await u.clic(u.mini(2), 'miniatura 2');
  await u.p.keyboard.press('Control+D'); await pauza(250);
  if ((await verif('Ctrl+D', 4)) === 4) await sterge3();
  // Home › New Slide ▾ › Duplicate Selected Slides
  await u.clic(u.mini(2), 'miniatura 2'); await u.fila('Home');
  await u.marcheaza(); await u.clic(u.mso('SlideNewGallery_Dropdown'), 'New Slide ▾', { pauza: 300 });
  if (!(await u.clicEt(/^Duplicate Selected Slides$/, { noi: true }))) pb.push('New Slide ▾ n-are Duplicate Selected Slides');
  else if ((await verif('New Slide ▾ › Duplicate Selected Slides', 4)) === 4) await sterge3();
  // Home › Copy ▾ › Duplicate (in PowerPoint 365 randul se cheama „Duplicate”; acceptam si „Duplicate Slide”)
  await u.clic(u.mini(2), 'miniatura 2');
  await u.marcheaza(); await u.clic(u.mso('CopySplitButton_Dropdown'), 'Copy ▾', { pauza: 300 });
  if (!(await u.clicEt(/^Duplicate( Slide)?$/, { noi: true }))) pb.push('Copy ▾ n-are Duplicate');
  else if ((await verif('Copy ▾ › Duplicate', 4)) === 4) await sterge3();
  // clic dreapta pe miniatura › Duplicate Slide
  if (!(await u.meniuPe(u.mini(2), 'miniatura 2', /^Duplicate Slide$/))) pb.push('meniul miniaturii n-are Duplicate Slide');
  else await verif('miniatură › Duplicate Slide', 4);
  return pb;
}, { ok: 'toate cele 4 drumuri: copia după original, aleasă' });

proba('powerpoint-F009', 'Cut / Copy / Paste pe diapozitive: din Home › Clipboard și din meniul miniaturii', async u => {
  const pb = [];
  // Home › Copy pe 2, Home › Paste dupa 3
  await u.clic(u.mini(2), 'miniatura 2'); await u.clic(u.mso('Copy'), 'Home › Copy');
  await u.clic(u.mini(3), 'miniatura 3'); await u.clic(u.mso('Paste'), 'Home › Paste', { pauza: 300 });
  let s = await u.st();
  if (s.diapozitive.length !== 4 || s.diapozitiv_activ !== 4 || s.diapozitive[3].texte[0] !== 'Ce sunt vulcanii') pb.push(`Home › Copy + Paste: n=${s.diapozitive.length}, ales ${s.diapozitiv_activ}, titluri ${JSON.stringify(titluri(s))}`);
  // Home › Cut pe 1 (Vulcanii)
  const n0 = s.diapozitive.length;
  await u.clic(u.mini(1), 'miniatura 1'); await u.clic(u.mso('Cut'), 'Home › Cut', { pauza: 300 });
  s = await u.st();
  if (s.diapozitive.length !== n0 - 1 || titluri(s).includes('Vulcanii')) pb.push(`Home › Cut: n=${s.diapozitive.length} (era ${n0}), titluri ${JSON.stringify(titluri(s))}`);
  // meniul miniaturii › Paste Options dupa ultimul
  const n1 = s.diapozitive.length;
  const last = n1;
  if (!(await u.meniuPe(u.mini(last), 'ultima miniatură', /^(Use Destination Theme|Keep Source Formatting|Keep Text Only|Paste)( \(.\))?$/))) pb.push('meniul miniaturii n-are Paste Options');
  else {
    s = await u.st();
    if (s.diapozitive.length !== n1 + 1 || s.diapozitive[s.diapozitive.length - 1].texte[0] !== 'Vulcanii') pb.push(`miniatură › Paste: n=${s.diapozitive.length}, titluri ${JSON.stringify(titluri(s))}`);
  }
  // meniul miniaturii › Copy pe 1, apoi Ctrl+V
  s = await u.st(); const n2 = s.diapozitive.length; const t1 = s.diapozitive[0].texte[0];
  if (!(await u.meniuPe(u.mini(1), 'miniatura 1', /^Copy$/))) pb.push('meniul miniaturii n-are Copy');
  else {
    await u.clic(u.mini(1), 'miniatura 1'); await u.p.keyboard.press('Control+V'); await pauza(250);
    s = await u.st();
    if (s.diapozitive.length !== n2 + 1 || s.diapozitive[1].texte[0] !== t1) pb.push(`miniatură › Copy + Ctrl+V: n=${s.diapozitive.length} (era ${n2}), titluri ${JSON.stringify(titluri(s))}`);
  }
  // meniul miniaturii › Cut pe 1
  s = await u.st(); const n3 = s.diapozitive.length;
  if (!(await u.meniuPe(u.mini(1), 'miniatura 1', /^Cut$/))) pb.push('meniul miniaturii n-are Cut');
  else {
    s = await u.st();
    if (s.diapozitive.length !== n3 - 1) pb.push(`miniatură › Cut: n=${s.diapozitive.length} (era ${n3})`);
  }
  return pb;
}, { ok: 'Home › Cut/Copy/Paste și meniul miniaturii › Cut/Copy/Paste' });

proba('powerpoint-F010', 'Hide Slide din meniul miniaturii; la expunere diapozitivul ascuns e sărit', async u => {
  const pb = [];
  if (!(await u.meniuPe(u.mini(2), 'miniatura 2', /^Hide Slide$/))) return ['meniul miniaturii n-are Hide Slide'];
  const ns = await u.nesim('Hide');
  if (ns.length) pb.push('mesaj: ' + ns[0]);
  // diapozitivul ramane in prezentare (doar ascuns)
  let s = await u.st();
  if (s.diapozitive.length !== 3) pb.push(`după Hide Slide sunt ${s.diapozitive.length} diapozitive (trebuia să rămână 3)`);
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('F5'); await pauza(350);
  s = await u.st();
  if (s.expunere !== 1) return pb.concat(`F5 nu pornește expunerea de la 1 (expunere=${s.expunere})`);
  await u.p.keyboard.press('ArrowRight'); await pauza(300);
  s = await u.st(); const x = await u.expunere();
  if (s.expunere !== 3 || !(x && x.text.includes('Întrebări?'))) pb.push(`după 1, → arată diapozitivul ${s.expunere} („${x ? x.text.slice(0, 40) : '?'}”), trebuia 3 (2 e ascuns)`);
  return pb;
}, { ok: '2 ascuns: expunerea merge 1 → 3' });

// ---- Text
proba('powerpoint-F012', 'Enter = rând nou; în caseta de conținut fiecare rând are buliță', async u => {
  const pb = [];
  await u.clic(u.mini(2), 'miniatura 2');
  await u.clic(u.forma(2, 2), 'caseta de conținut');
  await u.p.keyboard.press('End'); await u.p.keyboard.press('Enter'); await u.p.keyboard.type('Erupții'); await pauza(250);
  const s = await u.st(); const t = s.diapozitive[1].texte[1] || '';
  const randuri = t.split('\n');
  if (randuri.length !== 2 || randuri[1] !== 'Erupții') pb.push(`textul casetei: ${JSON.stringify(t)} (trebuia 2 rânduri, al doilea „Erupții”)`);
  // bulițele: pe fiecare rând vizibil, un semn de buliță (text, ::before sau list-item)
  const bul = await u.forma(2, 2).evaluate(f => {
    const randuri = [];
    const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const tx = w.currentNode.textContent.trim(); if (tx && !/^[•▪■●◦–\-]$/.test(tx)) randuri.push(w.currentNode); }
    const areBul = n => {
      for (let e = n.parentElement; e && e !== f.parentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === 'list-item' && cs.listStyleType !== 'none') return true;
        const b = getComputedStyle(e, '::before').content || '';
        if (/[•▪■●◦➢✓]/.test(b)) return true;
        const prev = e.previousElementSibling;
        if (prev && /^[•▪■●◦➢✓]$/.test((prev.textContent || '').trim())) return true;
        if (/^[•▪■●◦➢✓]/.test((e.textContent || '').trim()) && e.textContent.trim().length <= n.textContent.trim().length + 3) return true;
      }
      return false;
    };
    return { n: randuri.length, cuBul: randuri.filter(areBul).length };
  });
  if (bul.cuBul < 2) pb.push(`rânduri cu buliță: ${bul.cuBul} din ${bul.n} (trebuia fiecare rând al casetei de conținut)`);
  return pb;
}, { ok: '2 rânduri, fiecare cu buliță' });

proba('powerpoint-F013', 'Toată caseta aleasă: Esc în timp ce scrii și clic dreapta › Exit Edit Text (formatarea merge pe toată caseta)', async u => {
  const pb = [];
  // Esc: cursorul in „sunt” din titlul diapozitivului 2, Esc, Bold → tot titlul ingrosat
  await u.clic(u.mini(2), 'miniatura 2');
  let pt = await u.punctCuvant(2, 1, 'sunt');
  await u.p.mouse.click(pt.x, pt.y); await pauza(200);
  await u.p.keyboard.press('Escape'); await pauza(150);
  await u.clic(u.mso('Bold'), 'Home › Bold');
  let s = await u.st(); let c = s.formatare_pe_caractere || [];
  if (!c.length || c.some(x => !x.bold) || c.map(x => x.text).join('') !== 'Ce sunt vulcanii') pb.push(`Esc + Bold: ${JSON.stringify(c.map(x => [x.text, x.bold]))}`);
  // Exit Edit Text: cursorul in „Clasa” din subtitlul diapozitivului 1, clic dreapta › Exit Edit Text, Bold → tot subtitlul
  await u.clic(u.mini(1), 'miniatura 1');
  pt = await u.punctCuvant(1, 2, 'Clasa');
  await u.p.mouse.click(pt.x, pt.y); await pauza(200);
  if (!(await u.meniuLa(pt.x, pt.y, /^Exit Edit Text$/))) pb.push('meniul de clic dreapta în text n-are Exit Edit Text');
  else {
    await u.clic(u.mso('Bold'), 'Home › Bold');
    s = await u.st(); c = s.formatare_pe_caractere || [];
    if (!c.length || c.some(x => !x.bold) || c.map(x => x.text).join('') !== 'Clasa a VI-a') pb.push(`Exit Edit Text + Bold: ${JSON.stringify(c.map(x => [x.text, x.bold]))} (trebuia tot „Clasa a VI-a” îngroșat)`);
  }
  return pb;
}, { ok: 'Esc și Exit Edit Text aleg toată caseta' });

proba('powerpoint-F014', 'Caseta de text goală dispare la clicul în altă parte', async u => {
  const pb = [];
  await u.clic(u.mini(3), 'miniatura 3');
  await u.fila('Insert');
  await u.clic(u.mso('TextBoxInsert'), 'Insert › Text Box');
  const pt = await u.punctGol();
  if (!pt) return ['n-am găsit loc gol pe diapozitivul 3'];
  await u.p.mouse.click(pt.x, pt.y); await pauza(300);
  let s = await u.st(); const n1 = s.forme_diapozitiv[2].length;
  if (n1 !== 2) return [`după Text Box + clic pe diapozitiv sunt ${n1} forme pe diapozitivul 3 (trebuia 2: caseta nouă)`];
  // clic in alta parte (pe titlu, apoi pe miniatura) fara sa scrii nimic
  await u.clic(u.forma(3, 1), 'titlul diapozitivului 3', { pauza: 300 });
  s = await u.st();
  if (s.forme_diapozitiv[2].length !== 1) pb.push(`după clicul în altă parte caseta goală a rămas (${s.forme_diapozitiv[2].length} forme: ${JSON.stringify(s.forme_diapozitiv[2].map(f => f.fel))})`);
  return pb;
}, { ok: 'caseta goală a dispărut' });

// ---- Formatare text
proba('powerpoint-F030', 'Font Size: lista ▾ (32) și numărul scris în casetă (54) + Enter', async u => {
  const pb = [];
  await u.alegeTextul(1, 1);
  await u.fila('Home');
  await u.marcheaza();
  const drop = (await u.are('meniu_derulant', 'Home/Font/Font Size')) ? u.loc('meniu_derulant', 'Home/Font/Font Size') : u.mso('FontSize');
  await u.clic(drop, 'Font Size ▾', { pauza: 300 });
  const g = await u.clicEt(/^32$/, { noi: true });
  let s = await u.st();
  if (!g) pb.push('lista Font Size ▾ nu se deschide (n-are 32)' + ((await u.nesim()).length ? ': ' + (await u.nesim())[0] : ''));
  else if (s.formatare_text.marime !== 32) pb.push(`după 32 din listă: mărimea ${s.formatare_text.marime}`);
  await u.alegeTextul(1, 1);
  await u.marimeScrisa(54);
  s = await u.st();
  if (s.formatare_text.marime !== 54) pb.push(`după 54 scris + Enter: mărimea ${s.formatare_text.marime}`);
  return pb;
}, { ok: '32 din listă, 54 scris' });

proba('powerpoint-F032', 'Clear All Formatting readuce textul la formatul casetei', async u => {
  const pb = [];
  await u.alegeTextul(1, 2);
  const s0 = await u.st();
  const m0 = s0.formatare_text.marime, c0 = hex(s0.culoare_text), f0 = s0.font_text;
  await u.clic(u.mso('Bold'), 'Bold'); await u.clic(u.mso('Italic'), 'Italic');
  await u.marimeScrisa(40);
  await u.clic(u.mso('FontColorPicker'), 'Font Color');
  await u.alegeTextul(1, 2);
  let s = await u.st();
  if (!(s.formatare_pe_caractere || []).every(x => x.bold) || s.formatare_text.marime !== 40) pb.push(`pregătirea n-a mers (bold, 40): ${JSON.stringify(s.formatare_pe_caractere)}`);
  await u.clic(u.mso('ClearFormatting'), 'Home › Clear All Formatting', { pauza: 300 });
  s = await u.st(); const c = s.formatare_pe_caractere || [];
  const ns = await u.nesim();
  if (ns.length) pb.push('mesaj: ' + ns[ns.length - 1]);
  if (c.some(x => x.bold || x.italic)) pb.push(`după Clear All Formatting tot îngroșat/înclinat: ${JSON.stringify(c.map(x => [x.text, x.bold, x.italic]))}`);
  if (s.formatare_text.marime !== m0) pb.push(`mărimea ${s.formatare_text.marime}, trebuia ${m0} (a casetei)`);
  if (hex(s.culoare_text) !== c0) pb.push(`culoarea ${s.culoare_text}, trebuia ${c0}`);
  if (s.font_text !== f0) pb.push(`fontul ${s.font_text}, trebuia ${f0}`);
  return pb;
}, { ok: 'bold, italic, mărime, culoare: înapoi la formatul casetei' });

proba('powerpoint-F033', 'Font ▾: un font din All Fonts și fontul TEMEI (Headings) care urmează tema', async u => {
  const pb = [];
  await u.clic(u.mini(2), 'miniatura 2');
  await u.alegeTextul(2, 1);
  const deschideFont = async () => { await u.marcheaza(); await u.clic(u.p.locator(`${R} [data-lh-id-mso="Font"]:visible input`).first(), 'caseta Font', { pauza: 300 }); };
  await deschideFont();
  const hd = await u.gaseste(/\(Headings\)$/, { noi: true }), bd = await u.gaseste(/\(Body\)$/, { noi: true });
  if (!hd || !bd) pb.push('lista Font n-are fonturile temei (Headings / Body)');
  const g = (await u.clicEt(/^Arial$/, { noi: true })) || (await u.clicEt(/^Times New Roman$/, { noi: true }));
  let s = await u.st();
  if (!g) pb.push('lista Font n-are Arial / Times New Roman (All Fonts)');
  else if (!/^(Arial|Times New Roman)$/.test(s.font_text)) pb.push(`după un font din All Fonts: ${s.font_text}`);
  // inapoi pe fontul temei pentru titluri
  await u.alegeTextul(2, 1);
  await deschideFont();
  if (!(await u.clicEt(/\(Headings\)$/, { noi: true }))) return pb.concat('nu pot alege fontul Headings');
  s = await u.st();
  if (s.font_text !== 'Calibri Light') pb.push(`după Calibri Light (Headings): ${s.font_text}`);
  // tema noua (Ion): titlul cu font de tema trebuie sa ia fontul de titluri al temei, ca titlul neatins al diapozitivului 3
  await u.alegeTema('Ion');
  if ((await u.st()).tema !== 'Ion') return pb.concat(`nu pot pune tema Ion (tema=${(await u.st()).tema})`);
  await u.fila('Home');
  await u.alegeTextul(2, 1); const fT = (await u.st()).font_text;
  await u.clic(u.mini(3), 'miniatura 3'); await u.alegeTextul(3, 1); const fRef = (await u.st()).font_text;
  // [DEDUS] Ion are alt font de titluri decat Calibri Light (Century Gothic), deci fontul trebuie sa se schimbe
  if (fT === 'Calibri Light' || fT !== fRef) pb.push(`după tema Ion, titlul cu „(Headings)” are ${fT}, titlul neatins ${fRef} (fontul temei nu e legat de temă)`);
  return pb;
}, { ok: 'Headings/Body în listă, Arial pus, fontul temei urmează tema' });

proba('powerpoint-F034', 'Font Color: ▾ Theme/Standard Colors, iar butonul ține minte ultima culoare aleasă', async u => {
  const pb = [];
  await u.alegeTextul(1, 2);
  const g = await u.culoareDinLista('FontColorPicker_Dropdown', /^Blue$/);
  let s = await u.st();
  if (!g) return ['Font Color ▾ n-are Blue'];
  if (hex(s.culoare_text) !== '#0070C0') pb.push(`după Font Color ▾ › Blue: ${s.culoare_text}`);
  const g2 = await u.culoareDinLista('FontColorPicker_Dropdown', /^Orange, Accent 2$/);
  s = await u.st();
  if (!g2 || hex(s.culoare_text) !== '#ED7D31') pb.push(`Font Color ▾ › Orange, Accent 2: ${g2 ? s.culoare_text : 'lipsește'}`);
  // butonul principal (pe alt text) pune ultima culoare aleasa din ▾ (Orange, Accent 2), ca in PowerPoint
  await u.alegeTextul(1, 1);
  await u.clic(u.mso('FontColorPicker'), 'butonul Font Color');
  s = await u.st();
  if (hex(s.culoare_text) !== '#ED7D31') pb.push(`butonul Font Color după Orange, Accent 2 pune ${s.culoare_text} (trebuia ultima culoare aleasă, #ED7D31)`);
  const vazut = await u.culoareLitere(u.forma(1, 1));
  if (vazut && vazut !== hex(s.culoare_text)) pb.push(`pe ecran literele titlului au ${vazut}, starea spune ${s.culoare_text}`);
  return pb;
}, { ok: 'Blue, Orange Accent 2, butonul ține minte' });

// ---- Formatare forme
proba('powerpoint-F035', 'Shape Fill: pe o formă (stea) și pe o casetă; butonul pune ultima culoare', async u => {
  const pb = [];
  await u.clic(u.mini(3), 'miniatura 3');
  // o stea din Insert › Shapes, pusa printr-un clic pe diapozitiv
  await u.fila('Insert');
  await u.marcheaza(); await u.clic(u.mso('ShapesInsertGallery'), 'Insert › Shapes', { pauza: 300 });
  if (!(await u.clicEt(/^Star: 5 Points$/, { noi: true }))) return ['Shapes n-are Star: 5 Points'];
  const pt = await u.punctGol();
  await u.p.mouse.click(pt.x, pt.y); await pauza(300);
  let s = await u.st();
  const iS = s.forme_diapozitiv[2].length;            // indicele stelei (de la 1)
  if (iS < 2) return ['steaua nu s-a pus pe diapozitiv'];
  await u.fila('Home');
  const g = await u.culoareDinLista('ShapeFillColorPicker_Dropdown', /^Red$/);
  s = await u.st(); let uf = (s.umplere_forme[2] || [])[iS - 1] || {};
  if (!g) pb.push('Shape Fill ▾ n-are Red');
  else if (uf.tip !== 'solid' || hex(uf.culoare) !== '#FF0000') pb.push(`steaua după Shape Fill ▾ › Red: ${JSON.stringify(uf)}`);
  else if (!(await u.areCuloare(u.forma(3, iS), '#FF0000'))) pb.push('steaua nu se vede roșie');
  // caseta titlului (aleasa ca obiect, de margine): Shape Fill ▾ › Orange, si se vede
  await u.clic(u.margine(3, 1), 'marginea titlului', { pauza: 250 });
  if (!(await u.culoareDinLista('ShapeFillColorPicker_Dropdown', /^Orange$/))) pb.push('Shape Fill ▾ n-are Orange');
  s = await u.st(); uf = (s.umplere_forme[2] || [])[0] || {};
  if (uf.tip !== 'solid' || hex(uf.culoare) !== '#FFC000') pb.push(`titlul după Shape Fill ▾ › Orange: ${JSON.stringify(uf)}`);
  if (!(await u.areCuloare(u.forma(3, 1), '#FFC000'))) pb.push('umplerea casetei de titlu (Orange) nu se vede pe diapozitiv');
  // butonul Shape Fill = ultima culoare aleasa (Orange): pe stea
  await u.clic(u.forma(3, iS), 'steaua', { pauza: 250 });
  // corectat de dirijor 23.11 06:06 (contestatia F035, runda 1): in PowerPointul real centrul SplitButton-ului Shape Fill
  // [996,83,48,24] cade pe jumatatea ▾ (partea buton = [996,83,24,24], referinte/uia_powerpoint.json) => se apasa partea Button
  const bShapeFill = u.p.locator(`${R} [data-lh-id-mso="ShapeFillColorPicker"]:visible [data-lh-tip="Button"]`).first();
  await u.clic((await bShapeFill.count()) ? bShapeFill : u.mso('ShapeFillColorPicker'), 'butonul Shape Fill', { pauza: 300 });
  s = await u.st(); uf = (s.umplere_forme[2] || [])[iS - 1] || {};
  if (hex(uf.culoare) !== '#FFC000') pb.push(`butonul Shape Fill pe stea pune ${JSON.stringify(uf)} (trebuia ultima culoare, Orange #FFC000)`);
  return pb;
}, { ok: 'steaua roșie, caseta roșie (butonul = ultima culoare), se văd' });

// ---- Fundal si teme
const deschideFundal = async u => {                 // clic dreapta pe diapozitiv › Format Background...
  await u.clic(u.mini(3), 'miniatura 3');
  const pt = await u.punctGol();
  if (!pt) throw new Error('n-am găsit loc gol pe diapozitiv');
  if (!(await u.meniuLa(pt.x, pt.y, /^Format Background\.\.\.$/))) throw new Error('meniul diapozitivului n-are Format Background...');
};
proba('powerpoint-F043', 'Format Background › Reset Background readuce fundalul temei', async u => {
  const pb = [];
  await deschideFundal(u);
  const f0 = (await u.st()).fundal_diapozitive[2];
  await u.clicEt(/^Solid fill$/);
  await u.marcheaza();
  if (!(await u.clicEt(/^Fill Color/))) return ['panoul n-are caseta Color'];
  if (!(await u.clicEt(/^Yellow$/, { noi: true }))) return ['Color ▾ n-are Yellow'];
  let s = await u.st();
  if (hex((s.fundal_diapozitive[2] || {}).culoare) !== '#FFFF00') return [`pregătirea: fundalul ${JSON.stringify(s.fundal_diapozitive[2])}`];
  if (!(await u.clicEt(/^Reset Background$/))) return ['panoul n-are Reset Background'];
  s = await u.st();
  const ns = await u.nesim('Reset');
  if (ns.length) pb.push('mesaj: ' + ns[0]);
  if (JSON.stringify(s.fundal_diapozitive[2]) !== JSON.stringify(f0)) pb.push(`după Reset Background: ${JSON.stringify(s.fundal_diapozitive[2])}, trebuia ${JSON.stringify(f0)}`);
  if (await u.areCuloare(u.loc('diapozitiv'), '#FFFF00')) pb.push('diapozitivul se vede tot galben');
  return pb;
}, { ok: 'galben, apoi Reset Background → fundalul temei' });

proba('powerpoint-F044', 'Format Background › Hide background graphics (bifa)', async u => {
  const pb = [];
  await deschideFundal(u);
  const bifa = async () => u.p.evaluate(R => {
    const e = [...document.querySelectorAll(R + ' [data-lh-eticheta="Hide background graphics"]')].find(x => x.getBoundingClientRect().width > 0);
    if (!e) return null;
    const i = e.matches('input') ? e : e.querySelector('input');
    const a = e.getAttribute('aria-checked');
    return i ? i.checked : a === 'true' ? true : a === 'false' ? false : e.hasAttribute('data-lh-selectat');
  }, R);
  const b0 = await bifa();
  if (b0 === null) return ['panoul n-are Hide background graphics'];
  await u.clicEt(/^Hide background graphics$/);
  const b1 = await bifa();
  const ns = await u.nesim();
  if (ns.length) pb.push('mesaj: ' + ns[ns.length - 1]);
  if (b1 === b0) pb.push(`bifa nu se schimbă la clic (${b0} → ${b1})`);
  // [DEDUS] efectul pe grafica temei nu se poate proba pe Office Theme (n-are grafica de fundal); cerem doar bifa
  return pb;
}, { ok: 'bifa se pune' });

proba('powerpoint-F045', 'Design › Themes › Ion: fundal, font și culori; formatarea pusă de mână rămâne; Retrospect există', async u => {
  const pb = [];
  // de mana: titlul diapozitivului 2 ingrosat
  await u.clic(u.mini(2), 'miniatura 2');
  await u.alegeTextul(2, 1); await u.clic(u.mso('Bold'), 'Bold');
  const s0 = await u.st();
  if (!(await u.vedeTema('Retrospect'))) pb.push('galeria Themes n-are Retrospect (cerută la m1-l06)');
  if (!(await u.alegeTema('Ion'))) return pb.concat('nu pot alege Ion din galeria Themes');
  const s = await u.st();
  if (s.tema !== 'Ion') return pb.concat(`tema=${s.tema}`);
  if (JSON.stringify(s.fundal_diapozitive) === JSON.stringify(s0.fundal_diapozitive)) pb.push(`fundalul nu s-a schimbat (${JSON.stringify(s.fundal_diapozitive[0])})`);
  await u.fila('Home');
  await u.alegeTextul(2, 1);
  const s1 = await u.st();
  if (s1.font_text === s0.font_text) pb.push(`fontul titlului a rămas ${s1.font_text}`);
  if (!(s1.formatare_pe_caractere || []).every(x => x.bold)) pb.push('îngroșarea pusă de mână s-a pierdut');
  const fond = (s1.fundal_diapozitive[1] || {}).culoare;
  if (fond && hex(s1.culoare_text) === hex(fond)) pb.push(`textul (${s1.culoare_text}) are culoarea fundalului`);
  // [DEDUS] culorile textului: Ion are fundal inchis si litere deschise; cerem doar ca literele sa se schimbe odata cu tema
  if (hex(s1.culoare_text) === hex(s0.culoare_text)) pb.push(`culoarea literelor a rămas ${s1.culoare_text}`);
  return pb;
}, { ok: 'Ion: fundal, font, culori; bold păstrat; Retrospect în galerie' });

// ---- Expunere
proba('powerpoint-F065', 'După ultimul diapozitiv: ecran negru „End of slide show, click to exit.”; încă un clic iese', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('F5'); await pauza(350);
  for (let i = 0; i < 3; i++) { await u.p.keyboard.press('ArrowRight'); await pauza(200); }
  let s = await u.st(); const x = await u.expunere();
  if (s.expunere == null) return ['expunerea s-a închis singură după ultimul diapozitiv (trebuia ecranul negru)'];
  if (!x || !x.text.includes('End of slide show, click to exit.')) pb.push(`ecranul de final arată „${x ? x.text.slice(0, 60) : '?'}”`);
  if (x && x.fundal && x.fundal.some(v => v > 30)) pb.push(`ecranul de final nu e negru (rgb ${x.fundal})`);
  const b = await u.p.locator(R).boundingBox();
  await u.p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await pauza(300);
  s = await u.st();
  if (s.expunere != null || s.vedere !== 'normala') pb.push(`după clicul pe ecranul negru: expunere=${s.expunere}, vedere=${s.vedere}`);
  return pb;
}, { ok: 'textul de final, clicul iese' });

proba('powerpoint-F066', 'Esc iese din expunere și te lasă pe diapozitivul la care ai ieșit', async u => {
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('F5'); await pauza(350);
  await u.p.keyboard.press('ArrowRight'); await pauza(250);
  let s = await u.st();
  if (s.expunere !== 2) return [`după F5 și → expunerea e la ${s.expunere}`];
  await u.p.keyboard.press('Escape'); await pauza(300);
  s = await u.st();
  return s.expunere == null && s.diapozitiv_activ === 2 ? [] : [`după Esc: expunere=${s.expunere}, ales ${s.diapozitiv_activ} (trebuia 2)`];
}, { ok: 'Esc pe 2 → ales 2' });

proba('powerpoint-F067', 'În expunere animația pornește la clic și tranziția se vede', async u => {
  const pb = [];
  // tranzitia Fade pe diapozitivul 2
  await u.clic(u.mini(2), 'miniatura 2');
  await u.fila('Transitions');
  if (!(await u.clicEt(/^Fade$/))) pb.push('Transitions n-are Fade');
  // Fly In pe titlul diapozitivului 1
  await u.clic(u.mini(1), 'miniatura 1');
  await u.clic(u.forma(1, 1), 'titlul diapozitivului 1');
  await u.fila('Animations');
  if (!(await u.clicEt(/^Fly In$/))) return pb.concat('Animations n-are Fly In');
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('F5'); await pauza(400);
  let x = await u.expunere(); let s = await u.st();
  if (s.expunere !== 1 || !x) return pb.concat(`F5: expunere=${s.expunere}`);
  if (x.text.includes('Vulcanii')) pb.push('titlul cu Fly In se vede înainte de clic');
  if (!x.text.includes('Clasa a VI-a')) pb.push(`subtitlul fără animație nu se vede („${x.text.slice(0, 40)}”)`);
  await u.p.keyboard.press('ArrowRight'); await pauza(700);
  x = await u.expunere(); s = await u.st();
  if (s.expunere !== 1 || !x || !x.text.includes('Vulcanii')) pb.push(`după primul clic: diapozitivul ${s.expunere}, se vede „${x ? x.text.slice(0, 40) : '?'}” (trebuia titlul, tot pe 1)`);
  await u.p.keyboard.press('ArrowRight'); await pauza(60);
  // [DEDUS] „tranziția se vede” = imediat după trecere stratul are o animație în curs sau un element pe jumătate transparent
  x = await u.expunere(); s = await u.st();
  if (s.expunere !== 2) pb.push(`după al doilea clic: diapozitivul ${s.expunere} (trebuia 2)`);
  else if (!x || (x.anim === 0 && x.opac >= 0.99)) pb.push('trecerea pe diapozitivul 2 (Fade) se face fără nicio tranziție vizibilă');
  return pb;
}, { ok: 'titlul apare la clic, Fade se vede' });

proba('powerpoint-F068', 'Tasta B în expunere: ecran negru; încă o dată B revine', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('F5'); await pauza(350);
  await u.p.keyboard.press('b'); await pauza(250);
  let x = await u.expunere(); let s = await u.st();
  if (s.expunere !== 1) pb.push(`după B expunerea e la ${s.expunere} (trebuia să rămână pe 1)`);
  if (!x || x.text.includes('Vulcanii') || (x.fundal && x.fundal.some(v => v > 30))) pb.push(`după B ecranul nu e negru („${x ? x.text.slice(0, 40) : '?'}”, rgb ${x && x.fundal})`);
  await u.p.keyboard.press('b'); await pauza(250);
  x = await u.expunere(); s = await u.st();
  if (s.expunere !== 1 || !x || !x.text.includes('Vulcanii')) pb.push(`după al doilea B: diapozitivul ${s.expunere}, „${x ? x.text.slice(0, 40) : '?'}”`);
  return pb;
}, { ok: 'B negru, B înapoi pe 1' });

proba('powerpoint-F069', 'Slide Show › Use Presenter View (bifa, pusă implicit)', async u => {
  const pb = [];
  await u.fila('Slide Show');
  const bifa = () => u.mso('SlideShowUsePresenterView').evaluate(e => {
    const i = e.matches('input') ? e : e.querySelector('input');
    const a = e.getAttribute('aria-checked');
    return i ? i.checked : a === 'true' ? true : a === 'false' ? false : e.hasAttribute('data-lh-selectat') ? true : null;
  });
  const b0 = await bifa();
  // probe_prezentator.json (m2-l08/surse.md:49): in PowerPointul real bifa e pusa implicit
  if (b0 !== true) pb.push(`la pornire bifa e ${b0} (în PowerPoint e pusă implicit)`);
  await u.clic(u.mso('SlideShowUsePresenterView'), 'Use Presenter View');
  const b1 = await bifa();
  await u.clic(u.mso('SlideShowUsePresenterView'), 'Use Presenter View');
  const b2 = await bifa();
  const ns = await u.nesim();
  if (ns.length) pb.push('mesaj: ' + ns[ns.length - 1]);
  if (b1 === b0 || b2 !== b0 || b1 == null) pb.push(`bifa nu se schimbă la clic (${b0} → ${b1} → ${b2})`);
  return pb;
}, { ok: 'bifa pusă implicit, se scoate și se pune' });

// ---- Atelier „repara diapozitivul” (panoul jocului nu e al aplicatiei; probam doar drumul PowerPoint care da acelasi rezultat)
proba('powerpoint-F099', 'Culoarea textului (partea aplicației: caseta aleasă › Font Color ▾ › White)', async u => {
  const pb = [];
  await u.clic(u.mini(2), 'miniatura 2');
  await u.clic(u.margine(2, 1), 'marginea titlului', { pauza: 250 });
  if (!(await u.culoareDinLista('FontColorPicker_Dropdown', /^White, Background 1$|^White$/))) return ['Font Color ▾ n-are White'];
  const s = await u.st();
  if (hex(s.culoare_text) !== '#FFFFFF') pb.push(`după White pe caseta aleasă: ${s.culoare_text}`);
  const v = await u.culoareLitere(u.forma(2, 1));
  if (v !== '#FFFFFF') pb.push(`pe ecran literele au ${v}`);
  return pb;
}, { ok: 'toată caseta albă (lista „Textul” a jocului nu e a aplicației)' });

proba('powerpoint-F101', 'Mărimea titlului și a textului (partea aplicației: Font Size pe caseta aleasă)', async u => {
  const pb = [];
  await u.clic(u.mini(2), 'miniatura 2');
  await u.clic(u.margine(2, 1), 'marginea titlului', { pauza: 250 });
  await u.marimeScrisa(36);
  let s = await u.st();
  if (s.formatare_text.marime !== 36) pb.push(`titlul: ${s.formatare_text.marime} (trebuia 36)`);
  await u.clic(u.margine(2, 2), 'marginea casetei de conținut', { pauza: 250 });
  await u.marimeScrisa(26);
  s = await u.st();
  if (s.formatare_text.marime !== 26) pb.push(`textul: ${s.formatare_text.marime} (trebuia 26)`);
  return pb;
}, { ok: 'titlu 36, text 26 (lista mărimilor: F030)' });

proba('powerpoint-F102', 'Scoate un rând și îl readuce (partea aplicației: Delete pe rând, Ctrl+Z)', async u => {
  const pb = [];
  await u.clic(u.mini(2), 'miniatura 2');
  await u.alegeTextul(2, 2);
  await u.p.keyboard.press('Delete'); await pauza(200);
  let s = await u.st();
  if ((s.diapozitive[1].texte[1] || '') !== '') pb.push(`după Delete rândul a rămas: ${JSON.stringify(s.diapozitive[1].texte[1])}`);
  await u.p.keyboard.press('Control+Z'); await pauza(250);
  s = await u.st();
  if (s.diapozitive[1].texte[1] !== 'Munți prin care iese lava din adâncul Pământului') pb.push(`după Ctrl+Z: ${JSON.stringify(s.diapozitive[1].texte[1])}`);
  return pb;
}, { ok: 'rândul scos, Ctrl+Z îl readuce' });

// ================= rularea =================
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, rulate = 0;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const pr of PROBE) { await ruleaza(browser, base, pr); rulate++; }
  } catch (e) {
    for (const pr of PROBE.slice(rulate)) scrie('FAIL', pr.id, pr.nume, 'nerulată: ' + e.message.split('\n')[0]);
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
