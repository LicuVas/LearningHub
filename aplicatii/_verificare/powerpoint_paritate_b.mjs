// Probe de paritate PowerPoint, felia b (noaptea 23.11.2026): cate o proba pe fiecare rand din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_powerpoint_23_11/felii/felie_b.json  (22 de randuri: Obiecte, Tranzitii, Animatii).
// O proba = gestul elevului jucat in browser (clicuri si taste reale prin Playwright, pe elemente vizibile, cu focusul in
// aplicatie), apoi rezultatul citit in ce se vede (DOM) si/sau in LH.aplicatii.stare('powerpoint'). Tinta = PowerPointul real
// (Microsoft 365, interfata EN): referinte/uia_powerpoint.json, referinte/scenarii_real/powerpoint-*.json. Unde vechiul
// simulator difera, castiga PowerPointul real (comentariu de un rand); unde sursele reale tac: `// [DEDUS]`.
// Pagina: /aplicatii/poligon.html?aplicatie=powerpoint (3 diapozitive: Title Slide „Vulcanii” / „Clasa a VI-a”,
// Title and Content „Ce sunt vulcanii” + continut, Title Only „Întrebări?”).
// Rulare:  node aplicatii/_verificare/powerpoint_paritate_b.mjs   (din orice director; caile se afla singure)
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
const J = x => JSON.stringify(x);

// ---------- unelte legate de o pagina
function unelte(p, erori) {
  const u = {
    p, erori,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('powerpoint')),
    // clic REAL al mouse-ului in centrul celui de-al k-lea element VIZIBIL (din aplicatie) care se potriveste cu selectorul
    async clic(s, k = 0, opt = {}) {
      const pt = await p.evaluate(([s, kk, R]) => {
        const vis = [...document.querySelectorAll(R + ' ' + s)].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden'; });
        const e = vis[kk];
        if (!e) return null;
        e.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        const r = e.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, [s, k, R]);
      if (!pt) throw new Error('nu găsesc pe ecran: ' + s + (k ? ' [' + k + ']' : ''));
      for (const m of opt.modifiers || []) await p.keyboard.down(m);
      await p.mouse.click(pt.x, pt.y, opt.dreapta ? { button: 'right' } : undefined);
      for (const m of opt.modifiers || []) await p.keyboard.up(m);
      await pauza(opt.pauza != null ? opt.pauza : 250);
    },
    exista: s => p.evaluate(([s, R]) => [...document.querySelectorAll(R + ' ' + s)].some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }), [s, R]),
    mini: (n, opt) => u.clic(`[data-lh-tinta="miniatura"][data-lh-id="${n}"]`, 0, opt),
    // alege caseta ca OBIECT: clic pe chenarul ei (ca in PowerPoint real: clicul pe margine = Selection.Type 2)
    margine: (d, s) => u.clic(`[data-lh-tinta="margine_forma"][data-lh-id="${d}/${s}"]`),
    fila: nume => u.clic(`[data-lh-tinta="fila:${nume}"]`, 0, { pauza: 250 }),
    mso: (id, opt) => u.clic(`[data-lh-id-mso="${id}"]`, 0, opt),
    // dala unei galerii (Transitions / Animations): data-lh-tinta="meniu:<nume>"
    dala: nume => u.clic(`[data-lh-tinta="meniu:${nume}"]`),
    // dreptunghiul diapozitivului mare (cel mai mare element vizibil data-lh-tinta="diapozitiv")
    slide: () => p.evaluate(R => {
      let best = null;
      for (const e of document.querySelectorAll(R + ' [data-lh-tinta="diapozitiv"]')) { const r = e.getBoundingClientRect(); if (!best || r.width * r.height > best.width * best.height) best = r; }
      return best && { x: best.x, y: best.y, w: best.width, h: best.height };
    }, R),
    async clicSlide(fx, fy, opt = {}) { const b = await u.slide(); await p.mouse.click(b.x + b.w * fx, b.y + b.h * fy, opt.dreapta ? { button: 'right' } : undefined); await pauza(opt.pauza != null ? opt.pauza : 300); },
    boxForma: (d, s) => p.evaluate(([R, id]) => {
      const e = [...document.querySelectorAll(`${R} [data-lh-tinta="forma"][data-lh-id="${id}"]`)].find(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
    }, [R, `${d}/${s}`]),
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
        if (scor > bs) { bs = scor; best = { x: cx, y: cy, w: r.width, h: r.height, tinta: ti, eticheta: e.getAttribute('data-lh-eticheta'), text: own }; }
      }
      return best;
    }, [R, re.source, re.flags, !!opt.noi]),
    async clicEt(re, opt = {}) {
      const g = await u.gaseste(re, opt);
      if (!g) return null;
      await p.mouse.click(g.x, g.y, opt.dreapta ? { button: 'right' } : undefined);
      await pauza(opt.pauza != null ? opt.pauza : 250);
      return g;
    },
    // scrie intr-o caseta a panglicii (Spinner / ComboBox): clic in ea, Ctrl+A, textul, Enter
    async scrieCaseta(selCaseta, text) {
      const s = (await u.exista(selCaseta + ' input')) ? selCaseta + ' input' : selCaseta;
      await u.clic(s, 0, { pauza: 150 });
      await p.keyboard.press('Control+A');
      await p.keyboard.type(text);
      await p.keyboard.press('Enter');
      await pauza(250);
    },
    valoareCaseta: selCaseta => p.evaluate(([R, s]) => {
      const e = [...document.querySelectorAll(R + ' ' + s)].find(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      if (!e) return null;
      const i = e.tagName === 'INPUT' ? e : e.querySelector('input');
      return i ? i.value : e.textContent.trim();
    }, [R, selCaseta]),
    // virgula sau punctul zecimal, cum le arata caseta (PowerPoint real cu Windows in romana: „02,00”)
    async zecimal(selCaseta, x) { const v = (await u.valoareCaseta(selCaseta)) || ''; return v.includes(',') ? String(x).replace('.', ',') : String(x); },
    // Home › Shapes ▾ › Arrow: Right, apoi clic pe diapozitiv (jos-dreapta, departe de casetele aspectului)
    async sageata() {
      await u.fila('Home');
      await u.mso('ShapesInsertGallery');
      await u.clic('[data-lh-tinta="meniu:Arrow: Right"], [data-lh-eticheta="Arrow: Right"]');
      await u.clicSlide(0.8, 0.85);
    },
    // Animations › Add Animation ▾ › efect (din lista care se deschide, nu din galeria panglicii)
    // (PowerPoint real deschide o listă separată — [DEDUS], necapturată; dacă biblioteca folosește galeria vizibilă după
    // Add Animation, se acceptă și aceea: contează rezultatul, nu drumul)
    async adaugaAnimatie(efect) {
      await u.marcheaza();
      await u.mso('AnimationAddGallery', { pauza: 300 });
      const re = new RegExp('^' + efect + '$');
      const g = await u.gaseste(re, { noi: true });
      if (g && /^meniu:/.test(g.tinta || '') && g.w > 20) { await p.mouse.click(g.x, g.y); await pauza(250); return true; }
      if (!(await u.exista(`[data-lh-tinta="meniu:${efect}"]`))) return false;
      await u.clic(`[data-lh-tinta="meniu:${efect}"]`);
      return true;
    },
    // Animations › Start ▾ › optiunea (caseta Start de pe panglica)
    async start(optiune) {
      await u.marcheaza();
      await u.clic('[data-lh-tip="ComboBox"][data-lh-eticheta="Start"]', 0, { pauza: 300 });
      return !!(await u.clicEt(new RegExp('^' + optiune + '$'), { noi: true }));
    },
    // randurile din Animation Pane (ListItem in suprafata panou.AnimationCustom), vizibile
    randuriPanou: () => p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-suprafata="panou.AnimationCustom"] [data-lh-tip="ListItem"]')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map(e => (e.getAttribute('data-lh-eticheta') || e.textContent).replace(/\s+/g, ' ').trim()), R),
    clicRandPanou: k => u.clic('[data-lh-suprafata="panou.AnimationCustom"] [data-lh-tip="ListItem"]', k),
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
  return unelte(p, erori);
}

function cuTimp(promise, ms) {
  let t;
  return Promise.race([promise, new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`timp depășit (${ms / 1000} s)`)), ms); })]).finally(() => clearTimeout(t));
}

async function ruleaza(browser, base, pr) {
  if (pr.skip) { rez.SKIP++; console.log(`SKIP ${pr.id} - ${pr.skip}`); return; }
  const contexte = [];
  const t0 = Date.now();
  const info = [];
  try {
    const probleme = await cuTimp((async () => {
      const u = await deschide(browser, base, !!pr.tel, contexte);
      u.info = s => info.push(s);
      const pb = (await pr.fn(u)) || [];
      const er = [...new Set(u.erori)];
      if (er.length) pb.push('eroare în pagină: ' + er.slice(0, 2).join(' | '));
      return pb;
    })(), LIMITA);
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    const inf = info.length ? ' [' + info.join('; ') + ']' : '';
    if (probleme.length === 0) scrie('PASS', pr.id, pr.nume, (pr.ok || 'merge') + ` (${sec} s)` + inf);
    else scrie('FAIL', pr.id, pr.nume, probleme.join('; ') + inf);
  } catch (e) {
    scrie('FAIL', pr.id, pr.nume, 'proba a crăpat: ' + e.message.split('\n')[0].slice(0, 200));
  } finally {
    for (const c of contexte) await c.close().catch(() => {});
  }
}

// ---------- verificari comune pe DOM
// numarul de randuri / coloane ale tabelului din forma d/s (tr+td sau role=row/cell)
const gridTabel = (p, d, s) => p.evaluate(([R, id]) => {
  const e = document.querySelector(`${R} [data-lh-tinta="forma"][data-lh-id="${id}"]`);
  if (!e) return null;
  let rows = [...e.querySelectorAll('tr')];
  if (!rows.length) rows = [...e.querySelectorAll('[role="row"]')];
  const cols = Math.max(0, ...rows.map(r => r.querySelectorAll('td, th, [role="cell"], [role="gridcell"]').length));
  return { r: rows.length, c: cols };
}, [R, `${d}/${s}`]);
// imaginea chiar se vede: <img> incarcat, sau fundal cu url(...), sau <canvas>/<svg image> in forma d/s
const imagineDesenata = (p, d, s) => p.evaluate(([R, id]) => {
  const e = document.querySelector(`${R} [data-lh-tinta="forma"][data-lh-id="${id}"]`);
  if (!e) return 'forma nu e în pagină';
  for (const x of [e, ...e.querySelectorAll('*')]) {
    if (x.tagName === 'IMG' && x.complete && x.naturalWidth > 0) return true;
    if (x.tagName === 'image' || x.tagName === 'CANVAS') return true;
    const bg = getComputedStyle(x).backgroundImage;
    if (bg && bg !== 'none' && /url\(/.test(bg)) return true;
  }
  return 'în forma imaginii nu se desenează nicio imagine (doar dreptunghiul)';
}, [R, `${d}/${s}`]);
// numele scris pe dala galeriei (innerText vizibil, nu doar tooltip)
const numeDala = (p, nume) => p.evaluate(([R, nume]) => {
  const e = [...document.querySelectorAll(`${R} [data-lh-tinta="meniu:${nume}"]`)].find(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  return e ? e.innerText.replace(/\s+/g, ' ').trim() : null;
}, [R, nume]);
// instantaneu al diapozitivului mare: stilul vazut al fiecarui element + animatiile care ruleaza in el
const instantaneu = p => p.evaluate(R => {
  let best = null;
  for (const e of document.querySelectorAll(R + ' [data-lh-tinta="diapozitiv"]')) { const r = e.getBoundingClientRect(); if (!best || r.width * r.height > best.getBoundingClientRect().width * best.getBoundingClientRect().height) best = e; }
  if (!best) return { sig: '', anim: 0 };
  const zona = best.parentElement || best;
  const els = [zona, ...zona.querySelectorAll('*')].slice(0, 400);
  const sig = els.map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return [cs.opacity, cs.transform, cs.visibility, cs.clipPath, Math.round(r.x), Math.round(r.y)].join('|'); }).join(';');
  let anim = 0;
  try { anim = zona.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length; } catch (e) { anim = 0; }
  return { sig, anim, n: els.length };
}, R);
async function seRedaCeva(u, gest) {
  await pauza(1800);                                    // PowerPoint real reda singur efectul ales; asteptam sa se termine
  const s0 = await instantaneu(u.p);
  await gest();
  for (let i = 0; i < 14; i++) {
    const s = await instantaneu(u.p);
    if (s.anim > s0.anim || s.sig !== s0.sig) return true;
    await pauza(100);
  }
  return false;
}

// ================= probele (in ordinea feliei) =================
const PROBE = [];
const proba = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, ...opt });

// ---- Obiecte
proba('powerpoint-F015', 'Insert › Table ▾ › 3x2 Table: tabel cu 3 coloane și 2 rânduri, în caseta de conținut goală', async u => {
  const pb = [];
  await u.mini(2);
  await u.clic('[data-lh-tinta="panglica:Home/Slides/New Slide"]');                // diapozitiv nou Title and Content, după 2
  let s = await u.st(); const d = s.diapozitiv_activ;
  if (d !== 3 || s.diapozitive[2].aspect !== 'Title and Content') return [`New Slide după 2: activ=${d}, aspect=${s.diapozitive[2] && s.diapozitive[2].aspect}`];
  // drumul din caseta goală (iconița Insert Table) — echivalent; doar informativ
  u.info('iconița Insert Table în caseta goală: ' + ((await u.gaseste(/^Insert Table$/)) ? 'există' : 'lipsește'));
  await u.fila('Insert');
  await u.mso('TableInsertGallery', { pauza: 300 });
  // „3x2 Table” = 3 coloane × 2 rânduri, ca în PowerPoint real (lista.TableInsertGallery)
  await u.clic('[data-lh-tinta="meniu:3x2 Table"], [data-lh-eticheta="3x2 Table"]');
  s = await u.st();
  const forme = s.forme_diapozitiv[d - 1];
  const k = forme.findIndex(f => f.fel === 'tabel');
  if (k < 0) return [`niciun tabel pe diapozitivul ${d}: ${J(forme)}`];
  const g = await gridTabel(u.p, d, k + 1);
  if (!g || g.c !== 3 || g.r !== 2) pb.push(`tabelul se vede cu ${g ? g.c + ' coloane × ' + g.r + ' rânduri' : '? (nu-l găsesc în pagină)'} (trebuia 3 × 2)`);
  // [DEDUS] ca la imagine (scenariul real powerpoint-imagine-two-content): tabelul ia locul casetei de conținut goale
  const goale = forme.filter(f => f.fel === 'substituent' && f.text === '').length;
  if (forme.length !== 2 || goale > 1) pb.push(`tabelul nu a intrat în caseta de conținut goală (pe diapozitiv: ${J(forme.map(f => f.fel + (f.text === '' && f.fel === 'substituent' ? '(gol)' : '')))})`);
  return pb;
}, { ok: 'tabel 3 × 2 în caseta de conținut' });

proba('powerpoint-F016', 'Insert › Pictures › This Device...: alegi luna.png din fereastră, intră în caseta goală și se vede', async u => {
  const pb = [];
  await u.mini(2);
  await u.clic('[data-lh-tinta="panglica:Home/Slides/New Slide"]');
  const d = (await u.st()).diapozitiv_activ;
  u.info('iconița Pictures în caseta goală: ' + ((await u.gaseste(/^(Pictures|Insert Picture from File)$/)) ? 'există' : 'lipsește'));
  await u.fila('Insert');
  await u.mso('FlyoutAnchorInsertPictures', { pauza: 300 });
  if (!(await u.clicEt(/^This Device/))) return ['Pictures ▾ n-are This Device...'];
  const ns = await u.nesim(); if (ns.length) return ['This Device...: ' + ns[0]];
  // fișierul se ALEGE din fereastră (rândul lui), nu se scrie de mână — [DEDUS] poligonul nu dă o listă de imagini a lecției;
  // proba cere ca fereastra să arate măcar o imagine de ales (luna.png dacă există, altfel prima .png/.jpg)
  let f = await u.gaseste(/^luna\.png$/i);
  if (!f) f = await u.gaseste(/\.(png|jpe?g|gif|bmp)$/i);
  if (!f || /^camp/.test(f.tinta || '')) return ['fereastra Insert Picture nu arată nicio imagine de ales (luna.png, soare.png …) — numele se poate doar scrie de mână'];
  await u.p.mouse.click(f.x, f.y); await pauza(200);
  if (!(await u.clicEt(/^(Insert|Open)$/))) return ['fereastra n-are butonul Insert / Open'];
  const s = await u.st();
  const forme = s.forme_diapozitiv[d - 1];
  const k = forme.findIndex(x => x.fel === 'imagine');
  if (k < 0) return [`nicio imagine pe diapozitiv după Insert: ${J(forme)}`];
  // scenariul real powerpoint-imagine-two-content: imaginea ia locul casetei de conținut goale (tot 2 forme)
  if (forme.length !== 2) pb.push(`imaginea nu a intrat în caseta goală: ${J(forme.map(x => x.fel))}`);
  const v = await imagineDesenata(u.p, d, k + 1);
  if (v !== true) pb.push(v);
  return pb;
}, { ok: 'imagine aleasă din fereastră, în caseta goală, desenată' });

proba('powerpoint-F018', 'Insert › Text Box, clic pe diapozitiv, tastezi „Proiect la geografie”', async u => {
  await u.mini(3);
  await u.fila('Insert');
  const n0 = (await u.st()).forme_diapozitiv[2].length;
  await u.mso('TextBoxInsert', { pauza: 300 });
  const ns = await u.nesim('Text Box'); if (ns.length) return ['Insert › Text Box: ' + ns[0]];
  // PowerPoint real: butonul pregătește caseta, clicul pe diapozitiv o pune cu cursorul în ea
  if ((await u.st()).forme_diapozitiv[2].length === n0) await u.clicSlide(0.5, 0.7);
  await u.p.keyboard.type('Proiect la geografie'); await pauza(200);
  const forme = (await u.st()).forme_diapozitiv[2];
  return forme.some(f => f.fel === 'caseta_text' && f.text === 'Proiect la geografie') ? [] : [`pe diapozitivul 3: ${J(forme)}`];
}, { ok: 'casetă de text cu „Proiect la geografie”' });

proba('powerpoint-F021', 'Săgețile mută puțin obiectul ales (subtitlul ales prin chenar)', async u => {
  await u.mini(1);
  await u.margine(1, 2);
  let s = await u.st();
  if (J(s.selectie_forma) !== '[1,2]') return [`clicul pe chenar nu alege caseta ca obiect: selectie_forma=${J(s.selectie_forma)}`];
  const p0 = s.pozitii_forme[0][1];
  for (let i = 0; i < 3; i++) { await u.p.keyboard.press('ArrowRight'); await pauza(60); }
  s = await u.st(); const p1 = s.pozitii_forme[0][1];
  for (let i = 0; i < 2; i++) { await u.p.keyboard.press('ArrowDown'); await pauza(60); }
  s = await u.st(); const p2 = s.pozitii_forme[0][1];
  const pb = [];
  if (!(p1[0] > p0[0] && p1[1] === p0[1])) pb.push(`după 3 × → poziția ${J(p0)} → ${J(p1)} (trebuia mutată la dreapta)`);
  if (!(p2[1] > p1[1] && p2[0] === p1[0])) pb.push(`după 2 × ↓ poziția ${J(p1)} → ${J(p2)} (trebuia mutată în jos)`);
  if (s.diapozitive[0].texte[1] !== 'Clasa a VI-a') pb.push(`textul s-a schimbat: ${s.diapozitive[0].texte[1]}`);
  return pb;
}, { ok: '→ și ↓ mută caseta aleasă' });

proba('powerpoint-F022', 'Delete pe obiectul ales: săgeata dispare; caseta aspectului: întâi textul, apoi locul gol', async u => {
  const pb = [];
  await u.mini(1);
  await u.sageata();
  let s = await u.st();
  const k = s.forme_diapozitiv[0].findIndex(f => f.fel === 'forma');
  if (k < 0) return [`Shapes › Arrow: Right n-a pus săgeata: ${J(s.forme_diapozitiv[0])}`];
  const b = await u.boxForma(1, k + 1);
  await u.p.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await pauza(200);
  await u.p.keyboard.press('Delete'); await pauza(200);
  s = await u.st();
  if (s.forme_diapozitiv[0].some(f => f.fel === 'forma')) pb.push('Delete pe săgeata aleasă n-a scos-o');
  // caseta de conținut a diapozitivului 2, aleasă ca obiect (PowerPoint real: primul Delete golește textul, al doilea scoate caseta)
  await u.mini(2);
  await u.margine(2, 2);
  await u.p.keyboard.press('Delete'); await pauza(200);
  s = await u.st();
  const f1 = s.forme_diapozitiv[1];
  if (!(f1.length === 2 && f1[1].fel === 'substituent' && f1[1].text === '')) pb.push(`primul Delete pe caseta cu text: ${J(f1)} (trebuia: caseta rămâne, goală)`);
  await u.p.keyboard.press('Delete'); await pauza(200);
  s = await u.st();
  if (s.forme_diapozitiv[1].length !== 1) pb.push(`al doilea Delete: ${J(s.forme_diapozitiv[1])} (trebuia: caseta goală scoasă, rămâne titlul)`);
  return pb;
}, { ok: 'săgeata scoasă; caseta: text, apoi locul' });

proba('powerpoint-F023', 'Ctrl+C / Ctrl+X / Ctrl+V pe obiect: pe alt diapozitiv în același loc, pe același diapozitiv mai jos și la dreapta', async u => {
  const pb = [];
  await u.mini(1);
  await u.sageata();
  let s = await u.st();
  const k = s.forme_diapozitiv[0].findIndex(f => f.fel === 'forma');
  if (k < 0) return [`Shapes › Arrow: Right n-a pus săgeata: ${J(s.forme_diapozitiv[0])}`];
  const p0 = s.pozitii_forme[0][k];
  const alege = async () => { await u.mini(1); const b = await u.boxForma(1, k + 1); await u.p.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await pauza(200); };
  // drumul exercițiului (m1-l05:184): clic pe obiect → Ctrl+C; clic pe miniatură → Ctrl+V
  await alege();
  await u.p.keyboard.press('Control+C'); await pauza(150);
  await u.mini(3);
  await u.p.keyboard.press('Control+V'); await pauza(250);
  s = await u.st();
  let j = s.forme_diapozitiv[2].findIndex(f => f.fel === 'forma');
  if (j < 0) pb.push(`Ctrl+V pe diapozitivul 3 n-a lipit săgeata: ${J(s.forme_diapozitiv[2])}`);
  else if (J(s.pozitii_forme[2][j].slice(0, 2)) !== J(p0.slice(0, 2))) pb.push(`pe alt diapozitiv copia stă la ${J(s.pozitii_forme[2][j])}, originalul la ${J(p0)} (trebuia același loc)`);
  // pe același diapozitiv: copia puțin mai jos și la dreapta (PowerPoint real deplasează lipirea peste original)
  await alege();
  await u.p.keyboard.press('Control+C'); await pauza(150);
  await u.p.keyboard.press('Control+V'); await pauza(250);
  s = await u.st();
  const sag = s.forme_diapozitiv[0].map((f, i) => f.fel === 'forma' ? s.pozitii_forme[0][i] : null).filter(Boolean);
  if (sag.length !== 2) pb.push(`după Ctrl+C, Ctrl+V pe același diapozitiv sunt ${sag.length} săgeți`);
  else if (!(sag[1][0] > p0[0] && sag[1][1] > p0[1])) pb.push(`pe același diapozitiv copia stă la ${J(sag[1])}, peste original ${J(p0)} (trebuia puțin mai jos și la dreapta)`);
  // decupare: Ctrl+X scoate obiectul, Ctrl+V pe alt diapozitiv îl pune în același loc
  await alege();
  await u.p.keyboard.press('Control+X'); await pauza(200);
  s = await u.st(); const ramase = s.forme_diapozitiv[0].filter(f => f.fel === 'forma').length;
  await u.mini(2);
  await u.p.keyboard.press('Control+V'); await pauza(250);
  s = await u.st();
  j = s.forme_diapozitiv[1].findIndex(f => f.fel === 'forma');
  if (ramase !== 1) pb.push(`Ctrl+X pe săgeată: pe diapozitivul 1 au rămas ${ramase} săgeți (trebuia 1)`);
  if (j < 0 || J(s.pozitii_forme[1][j].slice(0, 2)) !== J(p0.slice(0, 2))) pb.push(`după Ctrl+X, Ctrl+V pe diapozitivul 2: ${j < 0 ? 'nimic lipit' : 'la ' + J(s.pozitii_forme[1][j])}`);
  // drumul panglicii (Home › Copy / Paste) — echivalent; doar informativ
  await alege();
  await u.fila('Home'); await u.mso('Copy'); await u.mini(3);
  const n3 = (await u.st()).forme_diapozitiv[2].length;
  await u.mso('Paste');
  u.info('Home › Copy + Paste pe obiect: ' + ((await u.st()).forme_diapozitiv[2].length > n3 ? 'merge' : 'nu merge'));
  return pb;
}, { ok: 'același loc pe alt diapozitiv, deplasat pe același, Ctrl+X mută' });

proba('powerpoint-F024', 'Ctrl+D dublează obiectul ales: copia puțin mai jos și la dreapta', async u => {
  await u.mini(1);
  await u.sageata();
  let s = await u.st();
  const k = s.forme_diapozitiv[0].findIndex(f => f.fel === 'forma');
  if (k < 0) return [`Shapes › Arrow: Right n-a pus săgeata: ${J(s.forme_diapozitiv[0])}`];
  const p0 = s.pozitii_forme[0][k];
  const b = await u.boxForma(1, k + 1);
  await u.p.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await pauza(200);
  await u.p.keyboard.press('Control+D'); await pauza(250);
  const ns = await u.nesim('Duplicate'); if (ns.length) return ['Ctrl+D: ' + ns[0]];
  s = await u.st();
  const sag = s.forme_diapozitiv[0].map((f, i) => f.fel === 'forma' && f.forma === 'Arrow: Right' ? s.pozitii_forme[0][i] : null).filter(Boolean);
  if (sag.length !== 2) return [`după Ctrl+D sunt ${sag.length} săgeți (trebuia 2)`];
  return sag[1][0] > p0[0] && sag[1][1] > p0[1] ? [] : [`copia stă la ${J(sag[1])}, originalul la ${J(p0)} (trebuia mai jos și la dreapta)`];
}, { ok: 'copie deplasată' });

proba('powerpoint-F025', 'Clic dreapta pe obiect › Send to Back / Bring to Front schimbă ordinea formelor', async u => {
  await u.mini(1);
  await u.sageata();
  let s = await u.st();
  const n = s.forme_diapozitiv[0].length;
  if (s.forme_diapozitiv[0][n - 1].fel !== 'forma') return [`săgeata nu e ultima pusă: ${J(s.forme_diapozitiv[0])}`];
  const meniu = async (re) => {
    const i = s.forme_diapozitiv[0].findIndex(f => f.fel === 'forma');
    const b = await u.boxForma(1, i + 1);
    await u.marcheaza();
    await u.p.mouse.click(b.x + b.w / 2, b.y + b.h / 2, { button: 'right' }); await pauza(300);
    // [DEDUS] meniul real al unei forme are „Send to Back ▸” / „Bring to Front ▸” (cu submeniu); al doilea clic alege
    // rândul cu același nume din submeniu, dacă s-a deschis unul
    if (!(await u.clicEt(re, { noi: true }))) return false;
    await u.marcheaza();
    await pauza(150);
    await u.clicEt(re, { noi: true });
    await u.p.keyboard.press('Escape').catch(() => {}); await pauza(150);
    return true;
  };
  if (!(await meniu(/^Send to Back$/))) return ['meniul de clic dreapta al săgeții n-are Send to Back'];
  s = await u.st();
  if (s.forme_diapozitiv[0][0].fel !== 'forma') return [`după Send to Back ordinea e ${J(s.forme_diapozitiv[0].map(f => f.fel))} (săgeata trebuia prima)`];
  if (!(await meniu(/^Bring to Front$/))) return ['meniul de clic dreapta al săgeții n-are Bring to Front'];
  s = await u.st();
  return s.forme_diapozitiv[0][n - 1].fel === 'forma' ? [] : [`după Bring to Front ordinea e ${J(s.forme_diapozitiv[0].map(f => f.fel))} (săgeata trebuia ultima)`];
}, { ok: 'Send to Back o pune prima, Bring to Front ultima' });

proba('powerpoint-F026', 'Insert › Link (pe textul ales) și Insert › Audio › Audio on My PC...', async u => {
  const pb = [];
  await u.mini(1);
  await u.clic('[data-lh-tinta="forma"][data-lh-id="1/2"]');
  await u.p.keyboard.press('Control+A');
  await u.fila('Insert');
  await u.marcheaza();
  await u.mso('HyperlinkInsert', { pauza: 350 });
  let ns = await u.nesim('Link');
  // [DEDUS] fereastra reală e „Insert Hyperlink” cu caseta Address; efectul vizibil: textul legat se subliniază
  const adr = ns.length ? null : await u.gaseste(/^Address:?$/, { noi: true });
  if (ns.length) pb.push('Link: ' + ns[0]);
  else if (!adr) pb.push('Link nu deschide fereastra Insert Hyperlink (caseta Address)');
  else {
    await u.p.mouse.click(adr.x, adr.y); await pauza(100);
    await u.p.keyboard.type('https://ro.wikipedia.org/wiki/Vulcan');
    if (!(await u.clicEt(/^OK$/, { noi: true }))) await u.p.keyboard.press('Enter');
    await pauza(250);
    const sub = await u.p.evaluate(R => {
      const e = document.querySelector(R + ' [data-lh-tinta="forma"][data-lh-id="1/2"]');
      if (!e) return false;
      return [e, ...e.querySelectorAll('*')].some(x => x.tagName === 'A' || /underline/.test(getComputedStyle(x).textDecorationLine));
    }, R);
    if (!sub) pb.push('după Link + OK textul ales nu arată ca o legătură (nesubliniat)');
  }
  await u.fila('Insert');
  await u.marcheaza();
  await u.mso('SoundInsertMenu02', { pauza: 300 });
  ns = await u.nesim('Audio');
  if (ns.length) pb.push('Audio: ' + ns[0]);
  else if (!(await u.clicEt(/^Audio on My PC/, { noi: true }))) pb.push('Audio ▾ n-are Audio on My PC...');
  else {
    ns = await u.nesim();
    if (ns.length) pb.push('Audio on My PC...: ' + ns[ns.length - 1]);
    else if (!(await u.gaseste(/^(Insert Audio|Open|Insert|File name:?)$/, { noi: true }))) pb.push('Audio on My PC... nu deschide fereastra de ales sunetul');
  }
  return pb;
}, { ok: 'Insert Hyperlink leagă textul; Audio on My PC... deschide fereastra' });

// ---- Tranzitii
proba('powerpoint-F046', 'Transitions › Fade pe diapozitivul 2: doar el o primește, lângă miniatură apare steluța, dalele au nume', async u => {
  const pb = [];
  await u.mini(2);
  await u.fila('Transitions');
  const nd = await numeDala(u.p, 'Fade');
  if (!nd || !/Fade/.test(nd)) pb.push(`dala Fade din galerie nu-și scrie numele (text vizibil: „${nd || ''}”)`);
  await u.dala('Fade');
  let s = await u.st();
  if (s.tranzitie_galerie !== 'Fade' || s.diapozitiv_activ !== 2) pb.push(`după Fade: tranziția diapozitivului activ (${s.diapozitiv_activ}) = ${s.tranzitie_galerie}`);
  // steluța de lângă miniatura 2 (PowerPoint real: pictograma sub numărul diapozitivului); nu un punct
  const st = await u.p.evaluate(R => {
    const m = document.querySelector(R + ' [data-lh-tinta="miniatura"][data-lh-id="2"]');
    if (!m) return 'miniatura 2 lipsește';
    const rand = m.parentElement;
    const cand = [...rand.querySelectorAll('*')].filter(e => !m.contains(e) && e !== m).filter(e => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (r.width < 3 || r.height < 3 || cs.visibility === 'hidden' || cs.display === 'none') return false;
      const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      return !/^\d+$/.test(own);
    });
    if (!cand.length) return 'lângă miniatura 2 nu apare nimic';
    const stea = cand.some(e => {
      const own = e.textContent.trim();
      const lab = [e.getAttribute('data-lh-eticheta'), e.getAttribute('aria-label'), e.getAttribute('title')].join(' ');
      const bg = getComputedStyle(e).backgroundImage;
      return /[★☆✦✧✩✪✫✬✭✮✯⭐]/.test(own) || e.tagName.toLowerCase() === 'svg' || e.querySelector('svg, img') || e.tagName === 'IMG'
        || /anim|transit|star|play/i.test(lab) || (bg && bg !== 'none');
    });
    return stea ? true : 'lângă miniatura 2 apare doar un semn simplu (punct), nu steluța';
  }, R);
  if (st !== true) pb.push(st);
  for (const k of [1, 3]) { await u.mini(k); s = await u.st(); if (s.tranzitie_galerie !== 'None') pb.push(`diapozitivul ${k} a primit și el tranziția ${s.tranzitie_galerie}`); }
  return pb;
}, { ok: 'Fade doar pe 2, steluța lângă miniatură, dala cu nume' });

proba('powerpoint-F047', 'Shift+clic pe miniaturi (1…3), apoi Transitions › Wipe: toate trei o primesc', async u => {
  await u.mini(1);
  await u.mini(3, { modifiers: ['Shift'] });
  await u.fila('Transitions');
  await u.dala('Wipe');
  const tr = [];
  for (const k of [1, 2, 3]) { await u.mini(k); tr.push((await u.st()).tranzitie_galerie); }
  const pb = J(tr) === J(['Wipe', 'Wipe', 'Wipe']) ? [] : [`tranzițiile după Shift+clic 1…3 și Wipe: ${J(tr)} (trebuia Wipe pe toate)`];
  // Ctrl+clic (1 și 3, fără 2) — echivalent; doar informativ
  await u.mini(1); await u.mini(3, { modifiers: ['Control'] });
  await u.dala('Fade');
  const tc = [];
  for (const k of [1, 2, 3]) { await u.mini(k); tc.push((await u.st()).tranzitie_galerie); }
  u.info('Ctrl+clic 1 și 3, Fade: ' + J(tc));
  return pb;
}, { ok: 'Wipe pe toate miniaturile alese' });

proba('powerpoint-F049', 'Duration: scrii 0,5 + Enter, apoi săgețile casetei (±0,25)', async u => {
  const pb = [];
  const DUR = '[data-lh-id-mso="TransitionDuration"]';
  await u.mini(2);
  await u.fila('Transitions');
  await u.dala('Fade');
  await u.scrieCaseta(DUR, await u.zecimal(DUR, 0.5));         // exercițiul m1-l07:164: „Scrie 0,5 în caseta Duration”
  let s = await u.st();
  if (s.durata_tranzitie[1] !== 0.5) pb.push(`după 0,5 + Enter: durata_tranzitie=${J(s.durata_tranzitie)}`);
  // [DEDUS] pasul săgeților = 0,25 s (vechiul simulator; sursele reale nu-l dau)
  await u.clic('[data-lh-tinta="panglica:Transitions/Timing/More"]');
  s = await u.st(); const sus = s.durata_tranzitie[1];
  await u.clic('[data-lh-tinta="panglica:Transitions/Timing/Less"]');
  await u.clic('[data-lh-tinta="panglica:Transitions/Timing/Less"]');
  s = await u.st(); const jos = s.durata_tranzitie[1];
  if (sus !== 0.75 || jos !== 0.25) pb.push(`săgețile casetei: ▲ → ${sus} (trebuia 0.75), ▼▼ → ${jos} (trebuia 0.25); valoarea afișată: ${await u.valoareCaseta(DUR)}`);
  return pb;
}, { ok: '0,5 scris; ▲ 0,75; ▼▼ 0,25' });

proba('powerpoint-F051', 'Transitions › After: 00:01 bifat: în expunere diapozitivul trece singur la următorul', async u => {
  const AF = '[data-lh-tip="Spinner"][data-lh-id-mso="TransitionTimeAutomaticallyAfter"]';
  await u.mini(1);
  await u.fila('Transitions');
  await u.clic('[data-lh-tip="CheckBox"][data-lh-id-mso="SlideTransitionAutomaticallyAfter"]');
  let ns = await u.nesim('After'); if (ns.length) return ['bifa After: ' + ns[0]];
  await u.scrieCaseta(AF, '00:01');
  ns = await u.nesim('After'); if (ns.length) return ['caseta After: ' + ns[0]];
  const val = await u.valoareCaseta(AF);
  await u.mini(1);
  await u.p.keyboard.press('F5'); await pauza(300);
  let s = await u.st();
  if (s.expunere == null) { await u.clic('[data-lh-tinta="bara_stare:Slide Show"]'); s = await u.st(); }
  if (s.expunere == null) return ['nu pornește expunerea (F5 / Slide Show)'];
  const e0 = s.expunere;
  let e1 = e0;
  for (let i = 0; i < 16 && e1 === e0; i++) { await pauza(200); e1 = (await u.st()).expunere; }
  await u.p.keyboard.press('Escape').catch(() => {});
  return e1 != null && e1 > e0 ? [] : [`în expunere diapozitivul ${e0} nu trece singur după 1 s (după 3 s: ${e1}); caseta After arată „${val}”`];
}, { ok: 'After 1 s avansează singur în expunere' });

// ---- Animatii
proba('powerpoint-F052', 'Animations › efect pe obiectul ales; alt efect îl înlocuiește pe loc, cu pornirea lui', async u => {
  const pb = [];
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  const nd = await numeDala(u.p, 'Fly In');
  if (!nd || !/Fly In/.test(nd)) pb.push(`dala Fly In din galerie nu-și scrie numele (text vizibil: „${nd || ''}”)`);
  await u.dala('Fade');
  let s = await u.st();
  if (s.animatie_galerie !== 'Fade' || J(s.ordine_animatii) !== '[1]') return pb.concat(`după Fade pe titlu: efect=${s.animatie_galerie}, ordine=${J(s.ordine_animatii)}`);
  if (!(await u.start('After Previous'))) return pb.concat('Start ▾ n-are After Previous');
  await u.margine(2, 2);
  await u.dala('Fly In');
  s = await u.st();
  if (J(s.ordine_animatii) !== '[1,2]' || J(s.pornire_animatii[1]) !== '["dupa_precedenta","la_clic"]') return pb.concat(`pregătirea: ordine=${J(s.ordine_animatii)}, pornire=${J(s.pornire_animatii[1])}`);
  // [DEDUS] (vechiul simulator; sursele reale tac): efectul nou ia locul celui vechi în listă și îi păstrează pornirea
  await u.margine(2, 1);
  await u.dala('Wipe');
  s = await u.st();
  if (s.animatie_galerie !== 'Wipe') pb.push(`Wipe pe titlu: efectul ales arată ${s.animatie_galerie}`);
  if (J(s.ordine_animatii) !== '[1,2]' || s.pornire_animatii[1][0] !== 'dupa_precedenta') pb.push(`după Wipe pe titlu: ordine ${J(s.ordine_animatii)}, pornire ${J(s.pornire_animatii[1])} (trebuia [1,2], titlul tot After Previous)`);
  return pb;
}, { ok: 'efect pus; înlocuirea păstrează locul și pornirea' });

proba('powerpoint-F053', 'Add Animation ▾ › Pulse: al doilea efect pe același obiect', async u => {
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fly In');
  if (!(await u.adaugaAnimatie('Pulse'))) return ['Add Animation ▾ nu deschide o listă cu Pulse'];
  const ns = await u.nesim(); if (ns.length) return ['Add Animation: ' + ns[ns.length - 1]];
  const s = await u.st();
  return J(s.ordine_animatii) === '[1,1]' && s.pornire_animatii[1].length === 2 ? [] : [`după Fly In + Add Animation › Pulse: ordine=${J(s.ordine_animatii)} (trebuia [1,1])`];
}, { ok: 'două efecte pe titlu' });

proba('powerpoint-F054', 'Animations › None scoate efectele obiectului ales (și pe amândouă), celelalte rămân', async u => {
  const pb = [];
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fly In');
  if (!(await u.adaugaAnimatie('Pulse'))) return ['pregătirea: Add Animation ▾ n-are Pulse'];
  await u.margine(2, 2);
  await u.dala('Fade');
  let s = await u.st();
  const ord0 = J(s.ordine_animatii);
  await u.margine(2, 1);
  const nd = await numeDala(u.p, 'None');
  if (!nd || !/None/.test(nd)) pb.push(`dala None din galerie nu-și scrie numele (text vizibil: „${nd || ''}”)`);
  await u.dala('None');
  s = await u.st();
  // PowerPoint real nu spune nimic la None pe un obiect fără animații (mesajul vechiului simulator nu se cere)
  if (J(s.ordine_animatii) !== '[2]' || s.forme_diapozitiv[1].length !== 2) pb.push(`înainte ${ord0}; după None pe titlu: ordine=${J(s.ordine_animatii)}, forme=${s.forme_diapozitiv[1].length} (trebuia [2], 2 forme)`);
  return pb;
}, { ok: 'None scoate ambele efecte ale titlului; al conținutului rămâne' });

proba('powerpoint-F055', 'Animations › Start ▾: With Previous, apoi After Previous pe efectul ales', async u => {
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fade');
  await u.margine(2, 2);
  await u.dala('Fly In');
  if (!(await u.start('With Previous'))) return ['Start ▾ n-are With Previous'];
  let s = await u.st(); const a = J(s.pornire_animatii[1]);
  if (!(await u.start('After Previous'))) return ['Start ▾ n-are After Previous'];
  s = await u.st(); const b = J(s.pornire_animatii[1]);
  // drumul din Animation Pane (▾ pe rând) — echivalent; doar informativ
  await u.mso('AnimationCustom', { pauza: 300 });
  await u.marcheaza();
  await u.clicRandPanou(1).catch(() => {});
  u.info('▾ pe rândul din Animation Pane: ' + ((await u.gaseste(/^(▾|▼|Open|More Options|Dropdown)$/, { noi: true })) ? 'există' : 'lipsește'));
  return a === '["la_clic","cu_precedenta"]' && b === '["la_clic","dupa_precedenta"]' ? [] : [`pornire după With Previous: ${a}; după After Previous: ${b}`];
}, { ok: 'Start ▾ schimbă pornirea efectului ales' });

proba('powerpoint-F056', 'Animations › Duration 1,5 și Delay 0,5 se păstrează pe efect', async u => {
  const DU = '[data-lh-id-mso="AnimationDuration"]', DE = '[data-lh-id-mso="AnimationDelay"]';
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fly In');
  await u.scrieCaseta(DU, await u.zecimal(DU, 1.5));
  await u.scrieCaseta(DE, await u.zecimal(DE, 0.5));
  const ns = await u.nesim(); if (ns.length) return ['Duration / Delay: ' + ns[ns.length - 1]];
  await u.margine(2, 2);
  await u.margine(2, 1);
  const nr = v => { const m = /(\d+)(?:[.,](\d+))?/.exec(String(v || '').replace(/^.*?(\d)/, '$1')); return m ? parseFloat(m[1] + '.' + (m[2] || '0')) : NaN; };
  const du = await u.valoareCaseta(DU), de = await u.valoareCaseta(DE);
  return nr(du) === 1.5 && nr(de) === 0.5 ? [] : [`după ce titlul e ales din nou: Duration „${du}”, Delay „${de}” (trebuia 1,5 și 0,5)`];
}, { ok: 'Duration 1,5 și Delay 0,5 ținute pe efect' });

proba('powerpoint-F057', 'Animation Pane › ▲ (Move Up) urcă efectul ales; Move Earlier / Later de pe panglică', async u => {
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fade');
  await u.margine(2, 2);
  await u.dala('Fly In');
  let s = await u.st();
  if (J(s.ordine_animatii) !== '[1,2]') return [`pregătirea: ordine=${J(s.ordine_animatii)}`];
  // drumul exercițiului (m1-l07:204): „Alege-o în panou și apasă ▲”
  await u.mso('AnimationCustom', { pauza: 300 });
  await u.clicRandPanou(1);
  await u.clic('[data-lh-tinta="fereastra:Move Up"]');
  s = await u.st();
  const pb = J(s.ordine_animatii) === '[2,1]' ? [] : [`după rândul 2 + ▲ în panou: ordine=${J(s.ordine_animatii)} (trebuia [2,1])`];
  // Move Earlier / Move Later de pe panglică — echivalente; doar informativ
  await u.margine(2, 1);
  const o0 = J((await u.st()).ordine_animatii);
  await u.mso('AnimationMoveEarlier');
  const ne = await u.nesim('Move Earlier');
  u.info(`Move Earlier pe titlu: ordine ${o0} → ${J((await u.st()).ordine_animatii)}${ne.length ? ' (mesaj: nesimulat)' : ''}`);
  return pb;
}, { ok: '▲ din panou schimbă ordinea' });

proba('powerpoint-F059', 'Delete pe rândul din Animation Pane scoate doar efectul; obiectul rămâne', async u => {
  const pb = [];
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fly In');
  if (!(await u.adaugaAnimatie('Pulse'))) return ['pregătirea: Add Animation ▾ n-are Pulse'];
  await u.margine(2, 2);
  await u.dala('Fade');
  let s = await u.st();
  if (J(s.ordine_animatii) !== '[1,1,2]') return [`pregătirea: ordine=${J(s.ordine_animatii)} (trebuia [1,1,2])`];
  await u.mso('AnimationCustom', { pauza: 300 });
  // al doilea efect al titlului (Pulse), apoi Delete
  await u.clicRandPanou(1);
  await u.p.keyboard.press('Delete'); await pauza(250);
  s = await u.st();
  if (J(s.ordine_animatii) !== '[1,2]' || s.forme_diapozitiv[1].length !== 2) pb.push(`Delete pe rândul 2: ordine=${J(s.ordine_animatii)}, forme=${s.forme_diapozitiv[1].length} (trebuia [1,2] și 2 forme)`);
  // singurul efect al conținutului: obiectul rămâne pe diapozitiv cu textul lui
  const rd = await u.randuriPanou();
  const k = rd.findIndex(t => /Fade/.test(t));
  if (k >= 0) {
    await u.clicRandPanou(k);
    await u.p.keyboard.press('Delete'); await pauza(250);
    s = await u.st();
    if (s.forme_diapozitiv[1].length !== 2 || s.diapozitive[1].texte[1] !== 'Munți prin care iese lava din adâncul Pământului' || s.ordine_animatii.includes(2)) pb.push(`Delete pe rândul Fade al conținutului: forme=${J(s.forme_diapozitiv[1].map(f => f.text.slice(0, 12)))}, ordine=${J(s.ordine_animatii)} (caseta trebuia să rămână, fără efect)`);
  } else pb.push('panoul nu mai arată rândul Fade al conținutului');
  return pb;
}, { ok: 'Delete în panou scoate efectul, nu obiectul' });

proba('powerpoint-F060', 'Fila Animations: numerele efectelor lângă obiecte; clic pe număr alege efectul', async u => {
  await u.mini(2);
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fade');
  await u.margine(2, 2);
  await u.dala('Fly In');
  const tag = n => u.p.evaluate(([R, n]) => {
    let best = null;
    const forme = [...document.querySelectorAll(R + ' [data-lh-tinta="forma"]')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0);
    for (const e of document.querySelectorAll(R + ' *')) {
      const own = [...e.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent).join('').trim();
      if (own !== String(n)) continue;
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (r.width < 4 || r.height < 4 || r.width > 48 || r.height > 48 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (e.closest('[data-lh-tinta="miniatura"]')) continue;
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      const langa = forme.some(f => cx > f.x - 60 && cx < f.x + f.width && cy > f.y - 40 && cy < f.y + f.height);
      if (langa) best = { x: cx, y: cy };
    }
    return best;
  }, [R, n]);
  const t1 = await tag(1), t2 = await tag(2);
  if (!t1 || !t2) return [`lângă obiecte nu se văd numerele efectelor (1: ${t1 ? 'da' : 'nu'}, 2: ${t2 ? 'da' : 'nu'})`];
  await u.p.mouse.click(t1.x, t1.y); await pauza(250);
  const s = await u.st();
  return s.animatie_galerie === 'Fade' ? [] : [`clic pe numărul 1: efectul ales arată ${s.animatie_galerie} (trebuia Fade, al titlului)`];
}, { ok: 'numerele 1 și 2 lângă obiecte; clicul pe 1 alege Fade' });

proba('powerpoint-F061', 'Preview (Transitions și Animations) redă efectul pe diapozitiv', async u => {
  const pb = [];
  await u.mini(2);
  await u.fila('Transitions');
  await u.dala('Fade');
  await u.mini(2);
  // [DEDUS] „redă” = ceva se mișcă / se schimbă pe diapozitivul mare în ~1,5 s după clic (sursele reale nu descriu redarea)
  if (!(await seRedaCeva(u, () => u.mso('TransitionPreview', { pauza: 0 })))) pb.push('Transitions › Preview nu redă nimic pe diapozitiv');
  await u.margine(2, 1);
  await u.fila('Animations');
  await u.dala('Fly In');
  if (!(await seRedaCeva(u, () => u.mso('AnimationPreview', { pauza: 0 })))) pb.push('Animations › Preview nu redă nimic pe diapozitiv');
  return pb;
}, { ok: 'ambele Preview redau ceva pe diapozitiv' });

// ================= rularea =================
async function main() {
  const t0 = Date.now();
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser = null, rulate = 0;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    // PROBE_ID=F053,F054 (optional) = doar probele acelea, pentru depanare; fara el ruleaza toate
    const doar = (process.env.PROBE_ID || '').split(',').filter(Boolean);
    for (const pr of PROBE) { if (!doar.length || doar.some(d => pr.id.endsWith(d))) await ruleaza(browser, base, pr); rulate++; }
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
