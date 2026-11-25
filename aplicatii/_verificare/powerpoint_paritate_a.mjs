// Probe de paritate PowerPoint, felia a (noaptea 23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_powerpoint_23_11/felii/felie_a.json  (22 de randuri: Fisier, Interfata,
//   Anulare, Vizualizari).
// O proba = gestul elevului jucat in browser (clicuri, taste, deget reale prin Playwright, pe elemente vizibile, cu focusul
// in aplicatie), apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('powerpoint').
// Tinta = PowerPointul real (Microsoft 365, interfata EN; Windows in romana). Surse: referinte/uia_powerpoint.json,
// referinte/scenarii_real/powerpoint-*.json, iar pentru fisiere probele pe PowerPointul real rezumate in capul lui
// lectii/_sim/simppt-fisier.js (litere A…R6 = lectii/vi/m1-l03/_proba/probe_fisier.json). Unde sursele tac: efectul sigur
// + `// [DEDUS]`.
// Pagina de proba: /aplicatii/poligon.html?aplicatie=powerpoint (Vulcanii: Title Slide „Vulcanii / Clasa a VI-a”,
// Title and Content „Ce sunt vulcanii”, Title Only „Întrebări?”; prezentarea „Presentation1”, nesalvata).
// Rulare:  node aplicatii/_verificare/powerpoint_paritate_a.mjs   (din orice director; caile se afla singure)
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
const APP = 'powerpoint';
const R = '[data-lh-aplicatie="powerpoint"]';
// tinta canonica, in ambele forme din api_biblioteca.md §3 (fel + data-lh-id sau „fel:valoare”), doar vizibila
const sel = (fel, val, r = R) => val == null ? `${r} [data-lh-tinta="${fel}"]:visible`
  : `${r} [data-lh-tinta="${fel}"][data-lh-id="${val}"]:visible, ${r} [data-lh-tinta="${fel}:${val}"]:visible`;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// continutul poligonului (aplicatii/poligon.html), ca sa-l putem redeschide cu fisiere in dosarul de lucru (api §7.1)
const VULCANII = [{ aspect: 'Title Slide', texte: ['Vulcanii', 'Clasa a VI-a'] }, { aspect: 'Title and Content', texte: ['Ce sunt vulcanii', 'Munți prin care iese lava din adâncul Pământului'] }, { aspect: 'Title Only', texte: ['Întrebări?'] }];
const PLANTE = { nume: 'Plante_6A_Pop.pptx', diapozitive: [{ aspect: 'Title Slide', texte: ['Plantele', 'Clasa a VI-a A'] }] };
const RE_EXT = /\.(pptx|ppsx|pdf|odp|png|jpe?g)$/i;
const CHEI_DOC = new Set(['nume_fisier', 'prezentare_activa', 'titlu_fereastra', 'documente_deschise', 'dialog', 'dialog_salvare']);

// ---------- fisierele de pe „disc” din stare, oricum le-ar numi biblioteca: orice sir cu extensie de fisier,
// cu drumul cheilor pana la el (fara cheile documentului deschis). { nume, cale } ; cale = cheile + numele, unite cu /
function fisiereDinStare(s) {
  const out = [];
  const mers = (v, cale) => {
    if (v == null) return;
    if (typeof v === 'string') { if (RE_EXT.test(v) || /\//.test(v) && RE_EXT.test(v)) out.push({ nume: v.split(/[\\/]/).pop(), cale: cale.concat(v).join('/') }); return; }
    if (Array.isArray(v)) { v.forEach(x => mers(x, cale)); return; }
    if (typeof v === 'object') {
      // forma {nume:'Vulcanii', ext:'pdf', dosar|dir|folder:'Documente'}
      if (typeof v.nume === 'string' && typeof v.ext === 'string' && !RE_EXT.test(v.nume)) out.push({ nume: v.nume + '.' + v.ext, cale: cale.concat(v.dosar || v.dir || v.folder || '', v.nume + '.' + v.ext).join('/') });
      for (const [k, x] of Object.entries(v)) {
        if (cale.length === 0 && CHEI_DOC.has(k)) continue;
        const dos = (typeof v.dosar === 'string' && v.dosar) || (typeof v.dir === 'string' && v.dir) || (typeof v.folder === 'string' && v.folder) || '';
        mers(x, cale.concat(dos && k === 'nume' ? [dos] : [], k));
      }
    }
  };
  mers(s, []);
  return out;
}
const areFisier = (s, nume, dosar) => fisiereDinStare(s).some(f => f.nume.toLowerCase() === nume.toLowerCase() && (!dosar || new RegExp(dosar, 'i').test(f.cale)));

// ---------- unelte legate de o pagina
function unelte(p, erori, alt) {
  const u = {
    p, erori, alt,
    st: () => p.evaluate(a => window.LH.aplicatii.stare(a), APP),
    loc: (fel, val) => p.locator(sel(fel, val)).first(),
    are: async (fel, val) => (await p.locator(sel(fel, val)).count()) > 0,
    mso: id => p.locator(`${R} [data-lh-id-mso="${id}"]:visible`).first(),
    mini: n => p.locator(sel('miniatura', String(n))).first(),
    async clic(loc, ce, opt) {
      try { await loc.click(opt); } catch (e) { throw new Error(`nu pot apăsa ${ce} (${e.message.split('\n')[0].slice(0, 80)})`); }
      await pauza(opt && opt.pauza != null ? opt.pauza : 150);
    },
    async fila(nume) { await u.clic(u.loc('fila', nume), 'fila ' + nume, { pauza: 250 }); },
    async backstage(nume) { await u.clic(u.loc('backstage', nume), 'File › ' + nume, { pauza: 300 }); },
    // mesajele „aici nu e simulată” vizibile
    nesim: (cuvant) => p.evaluate(([R, cuvant]) => {
      const viz = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      return [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].filter(viz).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 160))
        .filter(t => !cuvant || t.includes(cuvant));
    }, [R, cuvant || null]),
    marcheaza: (r = R) => p.evaluate(R => {
      const s = new WeakSet();
      for (const e of document.querySelectorAll(R + ' *')) { const b = e.getBoundingClientRect(); if (b.width > 0 && b.height > 0) s.add(e); }
      window.__probaVechi = s;
    }, r),
    // cel mai bun element vizibil a carui eticheta / tinta / aria-label / text propriu se potriveste cu re
    gaseste: (re, opt = {}) => p.evaluate(([R, src, fl, noi]) => {
      const re = new RegExp(src, fl);
      const root = document.querySelector(R), vechi = window.__probaVechi;
      if (!root) return null;
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
    }, [opt.r || R, re.source, re.flags, !!opt.noi]),
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
    ev: () => p.evaluate(() => (window.__lhAplicatieEv || []).slice(-1)[0] || null).then(e => e && { gest: e.gest, actiune: e.actiune, tinta: e.tinta }),
    nrEv: () => p.evaluate(() => (window.__lhAplicatieEv || []).length),
    fereastraSalvare: async () => (await p.locator(sel('camp', 'nume_fisier')).count()) > 0,
    async scrieNume(nume) {
      await u.clic(u.loc('camp', 'nume_fisier'), 'File name', { pauza: 120 });
      await p.keyboard.press('Control+a'); await p.keyboard.type(nume); await pauza(100);
    },
    async apasaSave() {
      const l = p.locator(sel('dialog_salvare', 'Save'));
      if (await l.count()) await u.clic(l.first(), 'Save', { pauza: 400 });
      else if (!(await u.clicEt(/^Save$/, { noi: true, pauza: 400 }))) throw new Error('fereastra de salvare n-are Save');
    },
    // Save as type ▾ › tipul (lista reala a PowerPointului: „PDF (*.pdf)”, „PowerPoint Show (*.ppsx)”…)
    async alegeTip(re) {
      const c = p.locator(sel('camp', 'tip_fisier'));
      if (!(await c.count())) return 'fereastra n-are Save as type';
      await u.marcheaza();
      await u.clic(c.first(), 'Save as type', { pauza: 300 });
      let g = await u.clicEt(re, { noi: true });
      if (!g) {
        const b = c.first().locator('[role="button"]:visible').first();
        if (await b.count()) { await u.marcheaza(); await u.clic(b, 'Save as type ▾', { pauza: 300 }); g = await u.clicEt(re, { noi: true }); }
      }
      if (!g) { await p.keyboard.press('Escape'); await pauza(150); return `în lista Save as type nu e „${re.source.replace(/\\/g, '')}”`; }
      const v = await c.first().evaluate(e => { const i = e.querySelector('input,select'); return ((i && (i.value || '')) || e.innerText || '').trim(); });
      if (!re.test(v)) return `Save as type arată „${v}” după alegere`;
      return null;
    },
    // F12 › (Documente) › tipul › numele › Save ; intoarce mesajul problemei sau null
    async salveazaCa(nume, opt = {}) {
      await p.keyboard.press('F12'); await pauza(400);
      if (!(await u.fereastraSalvare())) return 'F12 nu deschide fereastra Save As';
      if (opt.dosar) {
        const g = await u.clicEt(new RegExp('^(' + opt.dosar + ')$'));
        if (!g) return `fereastra Save As n-are folderul „${opt.dosar}” în stânga`;
        await pauza(200);
      }
      if (opt.tip) { const m = await u.alegeTip(opt.tip); if (m) return m; }
      await u.scrieNume(nume);
      await u.marcheaza();
      await u.apasaSave();
      return null;
    },
  };
  return u;
}

async function deschide(browser, base, opt, contexte) {
  const tel = !!opt.tel;
  const ctx = await browser.newContext(tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
  contexte.push(ctx);
  ctx.setDefaultTimeout(5000);
  ctx.setDefaultNavigationTimeout(15000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0].slice(0, 120)));
  const aplic = opt.pagina || 'powerpoint';
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=${aplic}`, { waitUntil: 'load' });
  await p.waitForSelector(`[data-lh-aplicatie="${aplic}"]`, { timeout: 12000 });
  if (aplic === 'powerpoint') await p.waitForFunction(() => { try { return !!window.LH.aplicatii.stare('powerpoint').diapozitive; } catch (e) { return false; } }, null, { timeout: 12000 });
  await pauza(350);
  return unelte(p, erori, o => deschide(browser, base, o || {}, contexte));
}

// redeschide PowerPoint in poligon cu alt continut (api §1 deschide + §7.1 start: diapozitive, fisiere)
async function redeschide(u, continut) {
  await u.p.evaluate(c => window.LH.aplicatii.deschide('powerpoint', { loc: '[data-lh-aplicatie-loc]', continut: c, focus: true }), continut);
  await u.p.waitForFunction(() => { try { return !!window.LH.aplicatii.stare('powerpoint'); } catch (e) { return false; } }, null, { timeout: 8000 });
  await pauza(400);
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
      const u = await deschide(browser, base, pr, contexte);
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

// ---- Vizualizari
// real: scenariul powerpoint-slide-sorter-normal (Slide Sorter › Normal din bara de stare = vedere normala)
proba('powerpoint-F071', 'Înapoi în Normal din Slide Sorter: Normal din bara de stare; dublu clic pe un diapozitiv', async u => {
  const pb = [];
  await u.clic(u.loc('bara_stare', 'Slide Sorter'), 'Slide Sorter (bara de stare)', { pauza: 300 });
  let s = await u.st();
  if (s.vedere !== 'sortare') return [`după Slide Sorter vederea e „${s.vedere}”`];
  await u.clic(u.loc('bara_stare', 'Normal'), 'Normal (bara de stare)', { pauza: 300 });
  s = await u.st();
  if (s.vedere !== 'normala') pb.push(`Normal din bara de stare: vederea e „${s.vedere}”`);
  await u.clic(u.loc('bara_stare', 'Slide Sorter'), 'Slide Sorter (a doua oară)', { pauza: 300 });
  await u.mini(3).dblclick(); await pauza(350);
  s = await u.st();
  if (s.vedere !== 'normala' || s.diapozitiv_activ !== 3) pb.push(`dublu clic pe diapozitivul 3 în Slide Sorter: vederea „${s.vedere}”, activ ${s.diapozitiv_activ} (trebuia normala, 3)`);
  else if (!(await u.are('forma', '3/1'))) pb.push('după dublul clic, diapozitivul 3 nu e în zona de lucru');
  return pb;
}, { ok: 'Normal din bara de stare și dublul clic pe diapozitivul 3 duc în Normal, pe 3' });

// [DEDUS] reala: in PowerPoint 365, Normal din bara de stare apasat cand esti deja in Normal comuta panoul din stanga intre
// miniaturi si schita (Outline View exista in uia_powerpoint.json, fila View); verific doar efectul vazut: miniaturile pleaca,
// textul diapozitivelor 2-3 apare in panoul din stanga; View › Normal aduce miniaturile inapoi.
proba('powerpoint-F072', 'Schița: Normal din bara de stare apăsat în Normal schimbă panoul din stânga; View › Normal aduce miniaturile', async u => {
  const pb = [];
  const nMini = () => u.p.locator(sel('miniatura')).count();
  if (!(await nMini())) return ['la pornire nu se văd miniaturile'];
  await u.clic(u.loc('bara_stare', 'Normal'), 'Normal (bara de stare, deja în Normal)', { pauza: 350 });
  const n1 = await nMini(); const s = await u.st(); const txt = await u.textPagina();
  if (n1 > 0) pb.push(`după Normal apăsat în Normal, panoul din stânga tot miniaturi arată (${n1}); vederea „${s.vedere}”`);
  else if (!txt.includes('Ce sunt vulcanii') || !txt.includes('Întrebări?')) pb.push('panoul din stânga nu arată textul diapozitivelor (schița)');
  await u.fila('View');
  const nrm = u.p.locator(`${R} [data-lh-tinta^="panglica:View/"][data-lh-tinta$="/Normal"]:visible, ${R} [data-lh-tinta="panglica"][data-lh-id^="View/"][data-lh-id$="/Normal"]:visible`).first();
  if (!(await nrm.count())) return pb.concat('fila View n-are Normal');
  await u.clic(nrm, 'View › Normal', { pauza: 350 });
  const n2 = await nMini();
  if (n2 !== 3) pb.push(`după View › Normal se văd ${n2} miniaturi (trebuiau 3)`);
  return pb;
}, { ok: 'schița apare și pleacă, miniaturile revin' });

// ---- Interfata
// Ce e al aplicatiei: filele se deschid cu comenzile lor; clicul pe fiecare zona e recunoscut (tinta zonei in evenimentul
// standard, nu „fereastra_app”, fara mesajul „nu e simulată”). Numele zonei spus elevului = al lectiei.
proba('powerpoint-F075', 'File panglicii și zonele ferestrei (miniaturi, zona de lucru, note, bara de stare)', async u => {
  const pb = [];
  for (const [fila, grup] of [['Insert', 'Insert/'], ['Design', 'Design/'], ['Transitions', 'Transitions/'], ['View', 'View/']]) {
    await u.fila(fila);
    const n = await u.p.locator(`${R} [data-lh-tinta^="panglica:${grup}"]:visible, ${R} [data-lh-tinta^="meniu_derulant:${grup}"]:visible, ${R} [data-lh-tinta="panglica"][data-lh-id^="${grup}"]:visible`).count();
    if (!n) pb.push(`fila ${fila} nu-și arată comenzile`);
  }
  await u.fila('Home');
  // zona de note
  await u.clic(u.loc('zona_note'), 'zona de note', { pauza: 200 });
  let e = await u.ev();
  if (!e || !/zona_note/.test(e.tinta || '')) pb.push(`clic în zona de note: evenimentul are ținta „${e && e.tinta}”`);
  // bara de stare: textul „Slide 1 of 3”
  const g = await u.gaseste(/^Slide 1 of 3$/);
  if (!g) pb.push('bara de stare nu arată „Slide 1 of 3”');
  else {
    await u.marcheaza();
    await u.p.mouse.click(g.x, g.y); await pauza(250);
    e = await u.ev(); const ns = await u.nesim();
    if (ns.length) pb.push('clic pe „Slide 1 of 3”: ' + ns[0]);
    else if (!e || !/^bara_stare/.test(e.tinta || '')) pb.push(`clic pe „Slide 1 of 3”: ținta „${e && e.tinta}” (trebuia o țintă bara_stare)`);
  }
  // golul panoului de miniaturi, sub ultima miniatura
  const b = await u.mini(3).boundingBox();
  if (b) {
    const x = b.x + b.width / 2, y = b.y + b.height + 40;
    const pe = await u.p.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return el ? (el.closest('[data-lh-tinta]') || {}).outerHTML ? el.closest('[data-lh-tinta]').getAttribute('data-lh-tinta') : '' : null; }, [x, y]);
    if (pe === null || /^miniatura/.test(pe || '')) pb.push('sub miniatura 3 nu e gol de panou (nu pot proba golul)');
    else {
      await u.p.mouse.click(x, y); await pauza(250);
      e = await u.ev();
      // [DEDUS] numele tintei golului; cer doar sa fie o tinta a panoului de miniaturi
      if (!e || /^fereastra_app/.test(e.tinta || '') || !/miniatur|panou|slides|thumbnail/i.test(e.tinta || '')) pb.push(`clic în golul panoului de miniaturi: ținta „${e && e.tinta}” (nerecunoscut ca zonă)`);
    }
  }
  return pb;
}, { ok: 'filele își arată comenzile; notele, bara de stare și golul panoului sunt recunoscute' });

// [DEDUS] PowerPointul real arata la trecerea mouse-ului doar numele (ScreenTip); fila si grupul sunt ale simulatorului.
// Aplicatia: evenimentul clicului poarta drumul Fila/Grup/Buton, iar mesajul unei comenzi nesimulate pomeneste fila si grupul.
proba('powerpoint-F076', 'Buton din panglică: la clic se știe numele, fila și grupul lui', async u => {
  const pb = [];
  await u.fila('Insert');
  const t = u.p.locator(`${R} [data-lh-id-mso="TableInsertGallery"]:visible`).first();
  if (!(await t.count())) pb.push('Insert n-are Table (TableInsertGallery)');
  else {
    await u.clic(t, 'Insert › Table', { pauza: 250 });
    const e = await u.ev();
    if (!e || !/^(panglica|meniu_derulant):Insert\/Tables\/Table/.test(e.tinta || '')) pb.push(`clic pe Table: ținta „${e && e.tinta}” (trebuia Insert/Tables/Table)`);
    await u.p.keyboard.press('Escape'); await pauza(150);
  }
  // un buton nesimulat: caut pe fila Review primul care raspunde cu mesajul standard
  await u.fila('Review');
  const tinte = await u.p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-tinta^="panglica:Review/"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-tinta')).slice(0, 10), R);
  let gasit = null;
  for (const ti of tinte) {
    await u.clic(u.p.locator(`${R} [data-lh-tinta="${ti}"]:visible`).first(), ti, { pauza: 250 });
    const ns = await u.nesim();
    if (ns.length) { gasit = { ti, msg: ns[ns.length - 1] }; break; }
    await u.p.keyboard.press('Escape'); await pauza(100);
    if (!(await u.p.locator(`${R} [data-lh-tinta^="panglica:Review/"]:visible`).count())) await u.fila('Review');
  }
  if (!gasit) pb.push('pe fila Review n-am găsit o comandă cu mesajul „nu e simulată” (nimic de verificat la mesaj)');
  else {
    const [, grupul, buton] = gasit.ti.split(':')[1].split('/');
    if (!gasit.msg.includes('Review') || !gasit.msg.includes(grupul)) pb.push(`mesajul pentru ${buton} nu spune fila și grupul („${gasit.msg.slice(0, 120)}”)`);
  }
  return pb;
}, { ok: 'ținta Insert/Tables/Table; mesajul spune fila Review și grupul' });

// ---- Anulare
// real: scenariul powerpoint-ctrl-z-diapozitiv-nou (New Slide, Ctrl+Z = diapozitivul nou dispare)
proba('powerpoint-F077', 'Undo pe rând: Ctrl+Z, Undo din bara de acces rapid (cu pictogramă)', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  const ns = u.p.locator(sel('panglica', 'Home/Slides/New Slide')).first();
  await u.clic(ns, 'New Slide', { pauza: 250 }); await u.clic(ns, 'New Slide', { pauza: 250 });
  let s = await u.st();
  if (s.diapozitive.length !== 5) return [`după două New Slide sunt ${s.diapozitive.length} diapozitive`];
  await u.p.keyboard.press('Control+z'); await pauza(250);
  s = await u.st();
  if (s.diapozitive.length !== 4) pb.push(`primul Ctrl+Z: ${s.diapozitive.length} diapozitive (trebuiau 4)`);
  await u.clic(u.loc('acces_rapid', 'Undo'), 'Undo (bara de acces rapid)', { pauza: 250 });
  s = await u.st();
  if (s.diapozitive.length !== 3 || s.diapozitive[1].texte[0] !== 'Ce sunt vulcanii') pb.push(`Undo din bara de acces rapid: ${s.diapozitive.length} diapozitive`);
  const ic = await u.loc('acces_rapid', 'Undo').evaluate(e => !!e.querySelector('svg, img, path'));
  if (!ic) pb.push('butonul Undo din bara de acces rapid n-are pictogramă (pătrățel gol)');
  // cu degetul (telefon 390×844, atingere): butonul Ctrl+Z din bara de taste de SUB fereastră, nu din panglică
  const t = await u.alt({ tel: true });
  await t.mini(1).tap(); await pauza(200);
  await t.p.keyboard.press('Control+m'); await pauza(300);
  s = await t.st();
  if (s.diapozitive.length !== 4) return pb.concat(`telefon: Ctrl+M n-a pus diapozitiv nou (${s.diapozitive.length})`);
  const bt = t.p.locator(`${R} [data-lh-ajutor="taste"] [data-lh-eticheta="Ctrl+Z"]:visible, ${R} [data-lh-ajutor="taste"] [data-lh-eticheta="Undo"]:visible`).first();
  if (!(await bt.count())) return pb.concat('telefon: nu există bara de taste de sub fereastră cu butonul Ctrl+Z ([data-lh-ajutor="taste"])');
  await bt.tap(); await pauza(300);
  s = await t.st();
  if (s.diapozitive.length !== 3) pb.push(`telefon: după Ctrl+Z din bara de taste ${s.diapozitive.length} diapozitive`);
  return pb;
}, { contexte: 2, ok: 'Ctrl+Z și Undo anulează pe rând; Undo are pictogramă; Ctrl+Z din bara de taste pe telefon' });


// ---- Fisier
// real (simppt-fisier.js, proba A_start): pornit din pictograma → ecranul de inceput: Home, New, Open, Blank Presentation, teme;
// nicio prezentare deschisa inca. [DEDUS] unde sta pictograma in Windows-ul simulat: desktop, bara de activitati sau Start.
proba('powerpoint-F079', 'Pornește PowerPoint din pictogramă: ecranul de început (Home, New, Open, Blank Presentation, teme)', async u => {
  const W = '[data-lh-aplicatie="windows"]';
  let g = await u.gaseste(/^(Microsoft )?PowerPoint$/, { r: W });
  if (!g) {
    const st = u.p.locator(sel('bara_activitati', 'Start', W)).first();
    if (await st.count()) { await u.clic(st, 'Start', { pauza: 400 }); g = await u.gaseste(/^(Microsoft )?PowerPoint$/, { r: W }); }
  }
  if (!g) return ['în Windows-ul simulat nu găsesc pictograma PowerPoint (desktop, bara de activități, Start)'];
  if (/^desktop/.test(g.tinta || '')) await u.p.mouse.dblclick(g.x, g.y); else await u.p.mouse.click(g.x, g.y);
  await pauza(800);
  const vis = await u.p.locator(`${R}:visible`).count();
  if (!vis) return ['după clicul pe pictogramă nu apare fereastra PowerPoint'];
  const pb = [];
  const txt = await u.p.locator(R).first().innerText().catch(() => '');
  for (const w of ['Blank Presentation', 'Home', 'New', 'Open']) if (!new RegExp('(^|\\n)\\s*' + w + '\\s*(\\n|$)').test(txt)) pb.push(`ecranul de început n-are „${w}”`);
  const s = await u.st().catch(() => null);
  if (s && s.prezentari_deschise) pb.push(`la pornire sunt deja ${s.prezentari_deschise} prezentări deschise (trebuia ecranul de început, fără prezentare)`);
  return pb;
}, { pagina: 'windows', ok: 'ecranul de început: Home, New, Open, Blank Presentation' });

// real (R4_tema): o tema → fereastra cu previzualizarea si Create; Create → prezentare noua cu tema
proba('powerpoint-F081', 'Prezentare nouă cu o temă: File › New › Atlas › Create', async u => {
  await u.fila('File'); await u.backstage('New');
  if (!(await u.are('backstage', 'Atlas'))) return ['File › New n-are tema Atlas'];
  await u.marcheaza();
  await u.clic(u.loc('backstage', 'Atlas'), 'Atlas', { pauza: 350 });
  const ns = await u.nesim();
  if (ns.length) return ['clic pe Atlas: ' + ns[0]];
  const cr = await u.clicEt(/^Create$/, { noi: true, pauza: 500 });
  if (!cr) return ['după clic pe Atlas nu apare previzualizarea cu butonul Create'];
  const s = await u.st();
  return /Atlas/i.test(s.tema || '') && s.prezentari_deschise === 2 ? [] : [`după Create: tema „${s.tema}”, ${s.prezentari_deschise} prezentări deschise (trebuia Atlas, 2)`];
}, { ok: 'Create face o prezentare nouă cu tema Atlas' });

// real (D, F): Ctrl+S pe o prezentare nesalvata → „Save this file” cu numele propus = titlul; pe una salvata → nicio fereastra
proba('powerpoint-F083', 'Salvare: nesalvată → „Save this file” cu numele = titlul; salvată → fără fereastră', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('Control+s'); await pauza(400);
  const txt = await u.textPagina();
  if (!/Save this file/.test(txt)) return [`Ctrl+S pe prezentarea nesalvată nu deschide „Save this file” (${(await u.st()).backstage ? 'a deschis pagina Save As din Backstage' : 'altceva'})`];
  const val = await u.p.evaluate(R => [...document.querySelectorAll(R + ' input')].filter(i => i.getBoundingClientRect().width > 0).map(i => i.value), R);
  if (!val.some(v => /^Vulcanii(\.pptx)?$/.test(v))) pb.push(`numele propus nu e titlul „Vulcanii” (câmpuri: ${JSON.stringify(val.slice(0, 4))})`);
  await u.marcheaza();
  await u.apasaSave();
  let s = await u.st();
  if (s.nume_fisier !== 'Vulcanii.pptx' || !areFisier(s, 'Vulcanii.pptx')) pb.push(`după Save: nume_fisier ${s.nume_fisier}, fișierul pe disc: ${areFisier(s, 'Vulcanii.pptx')}`);
  // a doua salvare: modific, apoi Save din bara de acces rapid → fara fereastra
  await u.clic(u.loc('panglica', 'Home/Slides/New Slide'), 'New Slide', { pauza: 250 });
  await u.clic(u.loc('acces_rapid', 'Save'), 'Save (bara de acces rapid)', { pauza: 350 });
  s = await u.st();
  if (/Save this file/.test(await u.textPagina()) || await u.fereastraSalvare() || s.backstage) pb.push('Save pe fișierul deja salvat deschide o fereastră');
  if (s.nume_fisier !== 'Vulcanii.pptx' || s.modificat) pb.push(`după Save pe fișierul salvat: nume ${s.nume_fisier}, modificat ${s.modificat}`);
  return pb;
}, { ok: 'Save this file cu Vulcanii; a doua oară fără fereastră' });

// real (E): F12 → fereastra clasica Save As; in stanga folderele; fisierul ramane pe disc dupa Save As cu alt nume.
// [DEDUS] subfolderul TIC_6A vine din configuratia exercitiului (nu din poligon) — nu-l cer aici.
proba('powerpoint-F084', 'Save As (F12): folderul Documente, numele, Save; după a doua salvare cu alt nume rămân ambele fișiere', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  let m = await u.salveazaCa('Vulcanii', { dosar: 'Documente|Documents' });
  if (m) return [m];
  let s = await u.st();
  if (s.nume_fisier !== 'Vulcanii.pptx' || !areFisier(s, 'Vulcanii.pptx', 'Document')) pb.push(`după Save în Documente: nume ${s.nume_fisier}, fișierul în Documente: ${areFisier(s, 'Vulcanii.pptx', 'Document')} (${JSON.stringify(fisiereDinStare(s).map(f => f.cale)).slice(0, 120)})`);
  m = await u.salveazaCa('Vulcanii_v2');
  if (m) return pb.concat('a doua oară: ' + m);
  s = await u.st();
  if (s.nume_fisier !== 'Vulcanii_v2.pptx') pb.push(`după Save As Vulcanii_v2: nume ${s.nume_fisier}`);
  if (!areFisier(s, 'Vulcanii.pptx') || !areFisier(s, 'Vulcanii_v2.pptx')) pb.push(`după Save As nu rămân ambele fișiere (originalul ${areFisier(s, 'Vulcanii.pptx')}, copia ${areFisier(s, 'Vulcanii_v2.pptx')})`);
  // fereastra Save As redeschisa arata ambele fisiere in Documente
  await u.p.keyboard.press('F12'); await pauza(400);
  const txt = await u.textPagina();
  if (!/(^|\n)\s*Vulcanii(\.pptx)?\s*(\n|$)/.test(txt) || !/Vulcanii_v2/.test(txt)) pb.push('fereastra Save As redeschisă nu arată Vulcanii și Vulcanii_v2 în folder');
  return pb;
}, { ok: 'Documente ales; Vulcanii și Vulcanii_v2 rămân amândouă' });

// real (G): PDF → fisier nou .pdf; prezentarea deschisa ramane .pptx (aici: tot nesalvata)
proba('powerpoint-F085', 'Salvează ca PDF (Save as type › PDF, Save)', async u => {
  await u.clic(u.mini(1), 'miniatura 1');
  const m = await u.salveazaCa('Vulcanii', { tip: /^PDF \(\*\.pdf\)$/ });
  if (m) return [m];
  await pauza(200);
  const s = await u.st();
  const pb = [];
  if (!areFisier(s, 'Vulcanii.pdf')) pb.push(`nu s-a scris Vulcanii.pdf (fișiere în stare: ${JSON.stringify(fisiereDinStare(s).map(f => f.nume)).slice(0, 100)}; nume_fisier ${s.nume_fisier})`);
  if (/\.pdf$/i.test(s.nume_fisier || '')) pb.push('prezentarea deschisă a devenit .pdf (trebuia să rămână prezentare)');
  return pb;
}, { ok: 'Vulcanii.pdf scris, prezentarea rămâne prezentare' });

// real (J): PowerPoint Show → fisier .ppsx, iar prezentarea deschisa DEVINE .ppsx
proba('powerpoint-F086', 'Salvează ca PowerPoint Show (.ppsx): prezentarea deschisă devine .ppsx', async u => {
  await u.clic(u.mini(1), 'miniatura 1');
  const m = await u.salveazaCa('Vulcanii', { tip: /^PowerPoint Show \(\*\.ppsx\)$/ });
  if (m) return [m];
  const s = await u.st();
  return s.nume_fisier === 'Vulcanii.ppsx' && areFisier(s, 'Vulcanii.ppsx') ? [] : [`după Save: nume_fisier ${s.nume_fisier}, Vulcanii.ppsx pe disc: ${areFisier(s, 'Vulcanii.ppsx')}`];
}, { ok: 'Vulcanii.ppsx scris și deschis' });

// [DEDUS] la .odp PowerPointul real poate intreba de pierderea unor functii; daca apare o intrebare, o confirm.
proba('powerpoint-F087', 'Salvează ca OpenDocument Presentation (.odp)', async u => {
  await u.clic(u.mini(1), 'miniatura 1');
  const m = await u.salveazaCa('Vulcanii', { tip: /^OpenDocument Presentation \(\*\.odp\)$/ });
  if (m) return [m];
  await u.clicEt(/^(Yes|OK|Continue)$/, { noi: true });
  const s = await u.st();
  return areFisier(s, 'Vulcanii.odp') ? [] : [`nu s-a scris Vulcanii.odp (nume_fisier ${s.nume_fisier}; fișiere ${JSON.stringify(fisiereDinStare(s).map(f => f.nume)).slice(0, 100)})`];
}, { ok: 'Vulcanii.odp scris' });

// real (H, R3_png_toate): PNG → „Which slides do you want to export?” All Slides / Just This One / Cancel;
// Just This One = o imagine; All Slides = folder cu Slide1.PNG, Slide2.PNG… si mesajul „Each slide …”
proba('powerpoint-F088', 'Salvează ca imagini PNG: Just This One = o imagine; All Slides = folder cu Slide1, Slide2, Slide3', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  let m = await u.salveazaCa('Vulcanii', { tip: /^PNG Portable Network Graphics Format \(\*\.png\)$/ });
  if (m) return [m];
  if (!/Which slides do you want to export/i.test(await u.textPagina())) return ['după Save cu PNG nu apare „Which slides do you want to export?”'];
  if (!(await u.clicEt(/^Just This One$/, { noi: true, pauza: 350 }))) return ['întrebarea n-are Just This One'];
  let s = await u.st();
  if (!areFisier(s, 'Vulcanii.png')) pb.push('Just This One: nu s-a scris Vulcanii.png');
  m = await u.salveazaCa('Vulcanii2', { tip: /^PNG Portable Network Graphics Format \(\*\.png\)$/ });
  if (m) return pb.concat('a doua oară: ' + m);
  await u.marcheaza();
  if (!(await u.clicEt(/^All Slides$/, { noi: true, pauza: 350 }))) return pb.concat('întrebarea n-are All Slides');
  if (!/Each slide in your presentation has been saved as a separate file/i.test(await u.textPagina())) pb.push('All Slides: nu apare mesajul „Each slide in your presentation has been saved as a separate file…”');
  await u.clicEt(/^OK$/, { noi: true });
  s = await u.st();
  const toate = fisiereDinStare(s);
  const ok = [1, 2, 3].every(k => toate.some(f => new RegExp('^Slide' + k + '\\.png$', 'i').test(f.nume) && /Vulcanii2/.test(f.cale)));
  if (!ok) pb.push(`All Slides: nu există folderul Vulcanii2 cu Slide1..3.PNG (${JSON.stringify(toate.map(f => f.cale)).slice(0, 140)})`);
  if (/\.png$/i.test(s.nume_fisier || '')) pb.push('prezentarea deschisă a devenit .png');
  return pb;
}, { ok: 'o imagine și folderul cu trei imagini' });

// real (I, R6_*): Save As cu un nume care exista → „Confirm Save As”: „<nume> already exists. Do you want to replace it?”
// Yes / No; No = inapoi in fereastra; Yes = inlocuieste. Fisierul deschis in alta fereastra → „… is currently in use”.
proba('powerpoint-F089', 'Numele există deja: „already exists” — No lasă fereastra, Yes înlocuiește; fișierul deschis altundeva nu se înlocuiește', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  let m = await u.salveazaCa('A_vulcani'); if (m) return [m];
  m = await u.salveazaCa('B_vulcani'); if (m) return ['a doua salvare: ' + m];
  // acum lucram in B_vulcani.pptx; A_vulcani.pptx e pe disc, inchis
  m = await u.salveazaCa('A_vulcani'); if (m) return ['a treia salvare: ' + m];
  if (!/A_vulcani(\.pptx)? already exists/i.test(await u.textPagina())) return ['Save As cu „A_vulcani” (există): nu apare „A_vulcani.pptx already exists. Do you want to replace it?”'];
  if (!(await u.clicEt(/^(No|Nu)$/, { noi: true, pauza: 300 }))) return ['întrebarea n-are No'];
  let s = await u.st();
  if (/already exists/i.test(await u.textPagina())) pb.push('întrebarea a rămas după No');
  if (!(await u.fereastraSalvare())) pb.push('după No fereastra Save As nu mai e deschisă');
  if (s.nume_fisier !== 'B_vulcani.pptx') pb.push(`după No: nume_fisier ${s.nume_fisier} (trebuia B_vulcani.pptx)`);
  await u.marcheaza();
  await u.apasaSave();
  if (!(await u.clicEt(/^(Yes|Da|OK)$/, { noi: true, pauza: 300 }))) return pb.concat('a doua oară întrebarea n-are Yes');
  s = await u.st();
  if (s.nume_fisier !== 'A_vulcani.pptx' || fisiereDinStare(s).filter(f => f.nume === 'A_vulcani.pptx').length > 1) pb.push(`după Yes: nume_fisier ${s.nume_fisier}`);
  // in folosinta: prezentare noua, salvata peste A_vulcani.pptx care e deschis in fereastra cealalta
  await u.fila('File'); await u.backstage('New');
  await u.clic(u.loc('backstage', 'Blank Presentation'), 'Blank Presentation', { pauza: 400 });
  m = await u.salveazaCa('A_vulcani'); if (m) return pb.concat('prezentarea nouă: ' + m);
  await u.clicEt(/^(Yes|Da|OK)$/, { noi: true, pauza: 300 });
  if (!/currently in use|in use/i.test(await u.textPagina())) pb.push('salvarea altei prezentări peste A_vulcani.pptx (deschis): nu apare „… is currently in use. Please save with a different file name.”');
  return pb;
}, { ok: 'already exists cu No / Yes; in use pentru fișierul deschis' });

// real (Windows): numele cu \ / : * ? " < > | e refuzat cu un mesaj; regula Subiect_Clasa_Nume e a atelierului (lectia)
proba('powerpoint-F090', 'Numele fișierului e verificat (fără \\ / : * ? " < > |)', async u => {
  const pb = [];
  await u.clic(u.mini(1), 'miniatura 1');
  for (const nume of ['vulcani?', 'a:b']) {
    await u.p.keyboard.press('F12'); await pauza(400);
    if (!(await u.fereastraSalvare())) return ['F12 nu deschide Save As'];
    await u.scrieNume(nume); await u.marcheaza(); await u.apasaSave();
    const s = await u.st(); const txt = await u.textPagina();
    if (s.nume_fisier) pb.push(`numele „${nume}” a fost primit (nume_fisier ${s.nume_fisier})`);
    else if (!/not valid|nu este valid|invalid|cannot contain|nu poate con[țt]ine|characters/i.test(txt)) pb.push(`numele „${nume}”: niciun mesaj că numele nu e valid`);
    await u.clicEt(/^(OK|Close|Închidere)$/, { noi: true });
    await u.p.keyboard.press('Escape'); await pauza(200);
    if (await u.fereastraSalvare()) { await u.p.keyboard.press('Escape'); await pauza(200); }
  }
  return pb;
}, { ok: 'numele cu ? și : sunt refuzate cu mesaj' });

// real (L, M, R3_x): File › Close pe ultima prezentare = fereastra goala „PowerPoint”; X pe ultima fereastra = PowerPoint inchis
proba('powerpoint-F092', 'File › Close lasă fereastra goală „PowerPoint”; X pe ultima fereastră închide PowerPoint', async u => {
  const pb = [];
  await u.fila('File'); await u.backstage('Close'); await pauza(200);
  await u.clicEt(/^Don['’]t Save$/, { noi: false, pauza: 350 });
  let s = await u.st();
  if (s.prezentari_deschise !== 0) return [`după File › Close: ${s.prezentari_deschise} prezentări deschise`];
  if (!(await u.p.locator(`${R}:visible`).count())) pb.push('după File › Close fereastra PowerPoint a dispărut (trebuia să rămână goală)');
  await u.clic(u.loc('bara_titlu', 'Close'), 'X (bara de titlu)', { pauza: 400 });
  const vis = await u.p.locator(`${R}:visible`).count();
  s = await u.st().catch(() => null);
  // [DEDUS] cum spune biblioteca „inchisa”: radacina ascunsa / scoasa, stare null sau o cheie de aplicatie inchisa
  const inchis = !vis || s == null || s.inchisa === true || s.aplicatie_inchisa === true || s.pornita === false || s.aplicatie === 'inchisa';
  if (!inchis) pb.push('X pe fereastra goală (ultima) n-a închis PowerPoint');
  // a doua cale (pagina proaspata): X pe ultima prezentare, modificata › Don't Save → PowerPoint inchis de tot (R3_x)
  const v = await u.alt({});
  await v.clic(v.loc('bara_titlu', 'Close'), 'X (bara de titlu)', { pauza: 350 });
  if (!(await v.clicEt(/^Don['’]t Save$/, { pauza: 400 }))) return pb.concat('X pe prezentarea modificată nu întreabă „Save your changes to this file?” cu Don’t Save');
  const vis2 = await v.p.locator(`${R}:visible`).count();
  const s2 = await v.st().catch(() => null);
  const inchis2 = !vis2 || s2 == null || s2.inchisa === true || s2.aplicatie_inchisa === true || s2.pornita === false || s2.aplicatie === 'inchisa';  // [DEDUS]
  if (!inchis2) pb.push(`X › Don't Save pe ultima prezentare: PowerPoint rămâne deschis (fereastra goală, ${s2 && s2.prezentari_deschise} prezentări)`);
  return pb;
}, { contexte: 2, ok: 'fereastra goală după File › Close; PowerPoint închis după X' });


// real: scenariul powerpoint-ctrl-o-browse (Ctrl+O › Browse › fereastra Open › numele › Enter → prezentarea activa, 2 deschise)
proba('powerpoint-F093', 'Deschide: Ctrl+O › Browse › Open (folderele, fișierul, dublu clic); Ctrl+F12', async u => {
  const pb = [];
  await redeschide(u, { diapozitive: VULCANII, fisiere: [PLANTE] });
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('Control+o'); await pauza(350);
  if (!(await u.are('backstage', 'Browse'))) return ['Ctrl+O nu duce la pagina Open cu Browse'];
  await u.clic(u.loc('backstage', 'Browse'), 'Browse', { pauza: 400 });
  if (!(await u.fereastraSalvare())) return ['Browse nu deschide fereastra Open'];
  const lips = [];
  for (const [n, re] of [['Desktop', /^Desktop$/], ['Documente', /^(Documente|Documents)$/], ['Descărcări', /^(Descărcări|Downloads)$/]]) if (!(await u.gaseste(re))) lips.push(n);
  if (lips.length) pb.push('fereastra Open n-are în stânga: ' + lips.join(', '));
  if (!(await u.gaseste(/^Plante_6A_Pop(\.pptx)?$/))) await u.clicEt(/^(Documente|Documents)$/, { pauza: 300 });
  const f = await u.gaseste(/^Plante_6A_Pop(\.pptx)?$/);
  if (!f) return pb.concat('fereastra Open nu arată Plante_6A_Pop în Documente');
  await u.p.mouse.dblclick(f.x, f.y); await pauza(450);
  let s = await u.st();
  if (s.prezentare_activa !== 'Plante_6A_Pop.pptx' || s.prezentari_deschise !== 2) pb.push(`după dublu clic: activa ${s.prezentare_activa}, ${s.prezentari_deschise} deschise (trebuia Plante_6A_Pop.pptx, 2)`);
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('Control+F12'); await pauza(400);
  const txt = await u.textPagina();
  if (!(await u.fereastraSalvare()) || /Save as type/.test(txt)) pb.push('Ctrl+F12 nu deschide fereastra Open');
  return pb;
}, { ok: 'folderele, Plante_6A_Pop deschisă cu dublu clic, Ctrl+F12' });

// real (N): pagina Open are lista Recent; un clic pe rand deschide fisierul
proba('powerpoint-F094', 'Deschide din lista Recent (File › Open › Recent)', async u => {
  await u.clic(u.mini(1), 'miniatura 1');
  const m = await u.salveazaCa('Vulcanii'); if (m) return [m];
  await u.fila('File'); await u.backstage('Close'); await pauza(300);
  let s = await u.st();
  if (s.prezentari_deschise !== 0) return [`File › Close pe Vulcanii.pptx salvat: ${s.prezentari_deschise} deschise`];
  await u.fila('File'); await u.backstage('Open');
  if (await u.are('backstage', 'Recent')) await u.clic(u.loc('backstage', 'Recent'), 'Recent', { pauza: 250 });
  await u.marcheaza();
  const r = await u.clicEt(/^Vulcanii(\.pptx)?$/, { pauza: 450 });
  if (!r) return ['lista Recent nu arată Vulcanii'];
  s = await u.st();
  return s.prezentare_activa === 'Vulcanii.pptx' && s.prezentari_deschise === 1 && s.diapozitive.length === 3 ? [] : [`după clic pe Vulcanii în Recent: activa ${s.prezentare_activa}, ${s.prezentari_deschise} deschise`];
}, { ok: 'Vulcanii redeschisă din Recent' });

// real (R2_open_dialog, pornire /B): prezentarea goala de la pornire, neatinsa, e inlocuita de fisierul deschis.
// [DEDUS] „prezentare goala neatinsa” = pornirea cu un singur Title Slide gol (fara texte).
proba('powerpoint-F095', 'Deschiderea peste prezentarea goală neatinsă o înlocuiește', async u => {
  await redeschide(u, { diapozitive: [{ aspect: 'Title Slide', texte: [] }], fisiere: [PLANTE] });
  let s = await u.st();
  if (s.prezentari_deschise !== 1) return [`pornirea goală: ${s.prezentari_deschise} prezentări`];
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('Control+o'); await pauza(350);
  await u.clic(u.loc('backstage', 'Browse'), 'Browse', { pauza: 400 });
  if (!(await u.gaseste(/^Plante_6A_Pop(\.pptx)?$/))) await u.clicEt(/^(Documente|Documents)$/, { pauza: 300 });
  const f = await u.gaseste(/^Plante_6A_Pop(\.pptx)?$/);
  if (!f) return ['fereastra Open nu arată Plante_6A_Pop'];
  await u.p.mouse.dblclick(f.x, f.y); await pauza(450);
  s = await u.st();
  return s.prezentare_activa === 'Plante_6A_Pop.pptx' && s.prezentari_deschise === 1 ? [] : [`după deschidere: activa ${s.prezentare_activa}, ${s.prezentari_deschise} deschise (trebuia 1: cea goală înlocuită)`];
}, { ok: 'prezentarea goală înlocuită' });

// real: View › Window › Switch Windows (uia_powerpoint.json) sau clic pe fereastra prezentarii
proba('powerpoint-F096', 'Treci de la o fereastră PowerPoint la alta (View › Switch Windows sau clic pe fereastră)', async u => {
  await u.fila('File'); await u.backstage('New');
  await u.clic(u.loc('backstage', 'Blank Presentation'), 'Blank Presentation', { pauza: 400 });
  let s = await u.st();
  if (s.prezentari_deschise !== 2) return [`după Blank Presentation: ${s.prezentari_deschise} deschise`];
  const act0 = s.prezentare_activa;
  await u.fila('View'); await u.marcheaza();
  const sw = await u.clicEt(/^Switch Windows$/, { pauza: 300 });
  if (!sw) return ['fila View n-are Switch Windows'];
  const g = await u.clicEt(/Presentation1/, { noi: true, pauza: 400 });
  if (!g) { const ns = await u.nesim(); return ['Switch Windows nu arată Presentation1' + (ns.length ? ' (' + ns[0] + ')' : '')]; }
  s = await u.st();
  return s.prezentare_activa === 'Presentation1' && s.diapozitive[0] && s.diapozitive[0].texte[0] === 'Vulcanii' ? [] : [`după Switch Windows › Presentation1: activa ${s.prezentare_activa} (era ${act0})`];
}, { ok: 'Presentation1 din nou activă' });

// real (lectia m1-l03:246-248; simppt-fisier.js :282): fisierul din Descarcari (de pe internet) se deschide in PROTECTED VIEW,
// bara galbena cu Enable Editing; pana atunci nu se poate modifica. [DEDUS] cheile cu care se spune biblioteca „vine de pe
// internet” (dosar Descărcări + protejat); probez varianta prin fereastra Open.
proba('powerpoint-F097', 'Protected View: Enable Editing pe bara galbenă face prezentarea editabilă', async u => {
  const pb = [];
  const CA = { nume: 'ciclul-apei-de-reparat.pptx', dosar: 'Descărcări', folder: 'Descărcări', protejat: true, protected_view: true, din_internet: true, diapozitive: [{ aspect: 'Title Slide', texte: ['Ciclul apei', 'de reparat'] }] };
  await redeschide(u, { diapozitive: VULCANII, fisiere: [CA] });
  await u.clic(u.mini(1), 'miniatura 1');
  await u.p.keyboard.press('Control+o'); await pauza(350);
  await u.clic(u.loc('backstage', 'Browse'), 'Browse', { pauza: 400 });
  if (!(await u.gaseste(/^ciclul-apei-de-reparat(\.pptx)?$/))) await u.clicEt(/^(Descărcări|Downloads)$/, { pauza: 300 });
  const f = await u.gaseste(/^ciclul-apei-de-reparat(\.pptx)?$/);
  if (!f) return ['fereastra Open nu arată ciclul-apei-de-reparat (Descărcări)'];
  await u.p.mouse.dblclick(f.x, f.y); await pauza(450);
  if (!/PROTECTED VIEW/i.test(await u.textPagina())) return ['fișierul din Descărcări nu se deschide în PROTECTED VIEW'];
  const t0 = JSON.stringify((await u.st()).diapozitive);
  await u.clic(u.loc('panglica', 'Home/Slides/New Slide'), 'New Slide (în Protected View)', { pauza: 250 }).catch(() => {});
  if (JSON.stringify((await u.st()).diapozitive) !== t0) pb.push('în Protected View prezentarea se poate modifica');
  if (!(await u.clicEt(/^Enable Editing$/, { pauza: 350 }))) return pb.concat('bara galbenă n-are Enable Editing');
  if (/PROTECTED VIEW/i.test(await u.textPagina())) pb.push('după Enable Editing bara galbenă a rămas');
  await u.clic(u.loc('panglica', 'Home/Slides/New Slide'), 'New Slide', { pauza: 250 });
  if ((await u.st()).diapozitive.length !== 2) pb.push('după Enable Editing New Slide nu merge');
  return pb;
}, { ok: 'PROTECTED VIEW, Enable Editing, apoi editabil' });

// real (P_ppsx_dublu_clic; lectia m1-l03:246): dublu clic in File Explorer: .pptx se deschide in PowerPoint; .ppsx porneste
// direct expunerea. [DEDUS] legatura Explorer → PowerPoint in biblioteca (o fereastra PowerPoint apare in pagina).
proba('powerpoint-F098', 'Dublu clic în File Explorer: .pptx se deschide, .ppsx pornește expunerea', async u => {
  const pb = [];
  await u.p.evaluate(() => window.LH.aplicatii.deschide('explorer', { loc: '[data-lh-aplicatie-loc]', continut: { folder: 'Descărcări', arbore: ['ciclul-apei-de-reparat.pptx', 'Vulcanii.ppsx'] }, focus: true }));
  await pauza(600);
  const E = '[data-lh-aplicatie="explorer"]';
  const l = u.p.locator(sel('lista', 'ciclul-apei-de-reparat.pptx', E)).first();
  if (!(await l.count())) return ['Explorer nu arată ciclul-apei-de-reparat.pptx'];
  await l.dblclick(); await pauza(800);
  if (!(await u.p.locator(`${R}:visible`).count())) return ['dublu clic pe .pptx în Explorer nu deschide PowerPoint'];
  let s = await u.st().catch(() => null);
  if (!s || s.prezentare_activa !== 'ciclul-apei-de-reparat.pptx') pb.push(`după dublu clic pe .pptx: prezentarea activă ${s && s.prezentare_activa}`);
  const l2 = u.p.locator(sel('lista', 'Vulcanii.ppsx', E)).first();
  if (!(await l2.count())) return pb.concat('Explorer nu mai arată Vulcanii.ppsx (fereastra acoperită?)');
  await l2.dblclick({ force: true }); await pauza(800);
  s = await u.st().catch(() => null);
  if (!s || !(s.vedere === 'expunere' || s.expunere)) pb.push(`dublu clic pe .ppsx: nu pornește expunerea (vedere ${s && s.vedere})`);
  return pb;
}, { pagina: 'explorer', ok: '.pptx deschis, .ppsx în expunere' });

// ================= rularea =================
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, rulate = 0;
  const doar = process.argv.slice(2).filter(a => /^powerpoint-F\d+$/.test(a));
  const lista = doar.length ? PROBE.filter(p => doar.includes(p.id)) : PROBE;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const pr of lista) { await ruleaza(browser, base, pr); rulate++; }
  } catch (e) {
    for (const pr of lista.slice(rulate)) scrie('FAIL', pr.id, pr.nume, 'nerulată: ' + e.message.split('\n')[0]);
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
