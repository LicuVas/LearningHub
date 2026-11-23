// Verificari de noapte PowerPoint (noaptea 23.11.2026, constructorii rundelor): drumurile despre care raportul unui constructor
// spune ca merg, ALTELE decat cele jucate de probele de paritate (alt diapozitiv, primul / ultimul, Ctrl+Z, alt drum).
// Facut dupa modelul powerpoint_checks2.mjs: server local, Playwright din HARNESS_PW_DIR, o pagina proaspata pe verificare,
// clicuri reale ale mouse-ului si taste. Iesire: o linie PASS / FAIL pe verificare; ULTIMA linie = numarul de FAIL (exit 0).
// Fiecare constructor ADAUGA verificari la sfarsitul listei VERIFICARI, fara sa le rescrie pe cele de dinainte, si nu lasa aici
// verificari care pica.
// Rulare:  node aplicatii/_verificare/powerpoint_noapte_checks.mjs   (din orice director)
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
const APP = '[data-lh-aplicatie="powerpoint"]';

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
const pauza = ms => new Promise(r => setTimeout(r, ms));
function scrie(stare, nume, detalii) {
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`.replace(/\s*\n\s*/g, ' '));
}

async function deschide(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await ctx.route(u => !/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(String(u)) && !/^(data|blob|about):/.test(String(u)), r => r.abort());
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push('eroare pagina: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') erori.push('consola: ' + m.text()); });
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=powerpoint`, { waitUntil: 'load' });
  await p.waitForSelector(APP, { timeout: 15000 });
  await pauza(1000);
  return { ctx, p, erori };
}

const stare = p => p.evaluate(() => window.LH.aplicatii.stare('powerpoint'));
const mini = n => `[data-lh-tinta="miniatura"][data-lh-id="${n}"]`;
const forma = (d, s) => `[data-lh-tinta="forma"][data-lh-id="${d}/${s}"]`;
const margine = (d, s) => `[data-lh-tinta="margine_forma"][data-lh-id="${d}/${s}"]`;
const mso = id => `[data-lh-id-mso="${id}"]`;
const et = n => `[data-lh-eticheta="${n}"]`;
const titluri = st => st.diapozitive.map(d => (d.texte || [])[0]);

// punctul din centrul celui de-al k-lea element VIZIBIL (k < 0 = de la coada: -1 = ultimul, adica cel deschis cel mai recent)
async function punct(p, sel, k = 0) {
  const pt = await p.evaluate(([s, kk, app]) => {
    const vis = [...document.querySelectorAll(app + ' ' + s)].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none'; });
    const e = vis[kk < 0 ? vis.length + kk : kk];
    if (!e) return null;
    e.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, [sel, k, APP]);
  if (!pt) throw new Error('nu gasesc pe ecran: ' + sel + ' [' + k + ']');
  return pt;
}
async function clic(p, sel, k = 0, opt = {}) {
  const pt = await punct(p, sel, k);
  if (opt.dublu) await p.mouse.dblclick(pt.x, pt.y);
  else await p.mouse.click(pt.x, pt.y, opt.dreapta ? { button: 'right' } : undefined);
  await pauza(opt.dupa != null ? opt.dupa : 300);
  return pt;
}
const exista = (p, sel) => p.evaluate(([s, app]) => [...document.querySelectorAll(app + ' ' + s)].some(e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; }), [sel, APP]);
// un punct gol pe diapozitivul din zona de lucru (sub casete), pentru clic dreapta pe fundal
async function punctGol(p) {
  return p.evaluate(app => {
    const d = [...document.querySelectorAll(app + ' [data-lh-tinta="diapozitiv"]')].find(e => e.getBoundingClientRect().width > 50);
    if (!d) return null;
    const r = d.getBoundingClientRect();
    for (const fy of [0.92, 0.85, 0.78]) for (const fx of [0.5, 0.2, 0.8]) {
      const x = r.x + r.width * fx, y = r.y + r.height * fy, e = document.elementFromPoint(x, y);
      if (e && (e === d || (d.contains(e) && !e.closest('[data-lh-tinta="forma"],[data-lh-tinta="margine_forma"]')))) return { x, y };
    }
    return null;
  }, APP);
}
async function deschideFundal(p, n) {          // miniatura n › clic dreapta pe fundal › Format Background...
  await clic(p, mini(n));
  const pt = await punctGol(p);
  if (!pt) throw new Error('n-am gasit loc gol pe diapozitiv');
  await p.mouse.click(pt.x, pt.y, { button: 'right' }); await pauza(300);
  await clic(p, et('Format Background...'), -1);
}

async function verifica(browser, base, nume, fn) {
  try {
    const { ctx, p, erori } = await deschide(browser, base);
    try {
      const r = await fn(p);
      if (erori.length) scrie('FAIL', nume, 'erori: ' + erori.slice(0, 2).join(' | '));
      else if (r === true) scrie('PASS', nume);
      else scrie('FAIL', nume, String(r));
    } finally { await ctx.close(); }
  } catch (e) { scrie('FAIL', nume, e.message.split('\n')[0]); }
}

// ================= verificarile (fiecare constructor adauga la coada) =================
const VERIFICARI = [];
const v = (nume, fn) => VERIFICARI.push({ nume, fn });

// ---- runda 1
v('R1-01 F071 Slide Sorter: dublu clic pe PRIMUL si pe ULTIMUL diapozitiv -> Normal, cu el ales', async p => {
  for (const n of [1, 3]) {
    await clic(p, `[data-lh-tinta="bara_stare:Slide Sorter"], [data-lh-tinta="bara_stare"][data-lh-id="Slide Sorter"], [data-lh-eticheta="Slide Sorter"]`, 0, { dupa: 400 });
    let st = await stare(p);
    if (st.vedere !== 'sortare') return `Slide Sorter nu s-a deschis (vedere ${st.vedere})`;
    await clic(p, mini(n), -1, { dublu: true, dupa: 400 });
    st = await stare(p);
    if (st.vedere !== 'normala' || st.diapozitiv_activ !== n) return `dublu clic pe ${n}: vedere ${st.vedere}, activ ${st.diapozitiv_activ}`;
  }
  return true;
});

v('R1-02 F034 Font Color ▾ › Blue pe caseta aleasa, apoi butonul pe ALT diapozitiv pune Blue; Ctrl+Z il scoate', async p => {
  await clic(p, mini(1)); await clic(p, margine(1, 1));
  await clic(p, mso('FontColorPicker_Dropdown'));
  await clic(p, '[data-lh-tip="ListItem"]' + et('Blue'), -1);
  await clic(p, mini(2)); await clic(p, margine(2, 2));
  const inainte = (await stare(p)).culoare_text;
  await clic(p, mso('FontColorPicker') + ' > [data-lh-tip="Button"]');
  let st = await stare(p);
  if ((st.culoare_text || '').toUpperCase() !== '#0070C0') return `butonul pe diapozitivul 2: ${st.culoare_text}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  return st.culoare_text === inainte ? true : `dupa Ctrl+Z: ${st.culoare_text} (era ${inainte})`;
});

v('R1-03 F035 Shape Fill: umplerea casetei de CONTINUT se vede; partea Button a lui Shape Fill pune ultima culoare (Orange)', async p => {
  await clic(p, mini(2)); await clic(p, margine(2, 1));
  await clic(p, mso('ShapeFillColorPicker_Dropdown'));
  await clic(p, '[data-lh-tip="ListItem"]' + et('Orange'), -1);
  await clic(p, margine(2, 2));
  await clic(p, mso('ShapeFillColorPicker') + ' > [data-lh-tip="Button"]');
  const st = await stare(p), u = st.umplere_forme[1][1] || {};
  if (u.tip !== 'solid' || (u.culoare || '').toUpperCase() !== '#FFC000') return `caseta de continut dupa butonul Shape Fill: ${JSON.stringify(u)}`;
  const bg = await p.evaluate(s => { const e = [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().width > 0); const t = e && e.querySelector('.lh-ap-p-text'); return t ? getComputedStyle(t).backgroundColor : null; }, APP + ' ' + forma(2, 2));
  return bg === 'rgb(255, 192, 0)' ? true : `pe ecran caseta de continut are fundalul ${bg}`;
});

v('R1-04 F043 Reset Background: gri cu fundalul temei, aprins dupa Yellow; Ctrl+Z dupa Reset readuce galbenul', async p => {
  await deschideFundal(p, 1);
  const gri0 = await p.evaluate(s => { const e = [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().width > 0); return e ? e.getAttribute('aria-disabled') : 'lipsa'; }, APP + ' ' + et('Reset Background'));
  if (gri0 !== 'true') return `la deschidere Reset Background nu e gri (${gri0})`;
  await clic(p, et('Solid fill'), -1);
  await clic(p, '[data-lh-eticheta^="Fill Color"]', -1);
  await clic(p, '[data-lh-tip="ListItem"]' + et('Yellow'), -1);
  let st = await stare(p);
  if ((st.fundal_diapozitive[0].culoare || '').toUpperCase() !== '#FFFF00') return `pregatirea: ${JSON.stringify(st.fundal_diapozitive[0])}`;
  await clic(p, et('Reset Background'), -1);
  st = await stare(p);
  if ((st.fundal_diapozitive[0].culoare || '').toUpperCase() !== '#FFFFFF') return `dupa Reset: ${JSON.stringify(st.fundal_diapozitive[0])}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  return (st.fundal_diapozitive[0].culoare || '').toUpperCase() === '#FFFF00' ? true : `dupa Ctrl+Z: ${JSON.stringify(st.fundal_diapozitive[0])}`;
});

v('R1-05 F044 Hide background graphics: doar pe diapozitivul activ, al doilea clic o scoate, Ctrl+Z o pune la loc', async p => {
  await deschideFundal(p, 2);
  await clic(p, et('Hide background graphics'), -1);
  let st = await stare(p);
  if (JSON.stringify(st.grafica_fundal_ascunsa) !== '[false,true,false]') return `dupa primul clic: ${JSON.stringify(st.grafica_fundal_ascunsa)}`;
  await clic(p, et('Hide background graphics'), -1);
  st = await stare(p);
  if (st.grafica_fundal_ascunsa[1] !== false) return `al doilea clic n-a scos bifa: ${JSON.stringify(st.grafica_fundal_ascunsa)}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  return st.grafica_fundal_ascunsa[1] === true ? true : `dupa Ctrl+Z: ${JSON.stringify(st.grafica_fundal_ascunsa)}`;
});

v('R1-06 F010 Hide Slide: PRIMUL ascuns -> F5 incepe de la 2; ULTIMUL ascuns (Slide Show › Hide Slide) -> dupa 2 vine finalul; Ctrl+Z', async p => {
  await clic(p, mini(1), 0, { dreapta: true });
  await clic(p, '[data-lh-tip="MenuItem"]' + et('Hide Slide'), -1);
  let st = await stare(p);
  if (JSON.stringify(st.diapozitive_ascunse) !== '[1]') return `dupa Hide Slide pe 1: ${JSON.stringify(st.diapozitive_ascunse)}`;
  await p.keyboard.press('F5'); await pauza(350);
  st = await stare(p);
  if (st.expunere !== 2) return `F5 cu 1 ascuns porneste de la ${st.expunere}`;
  await p.keyboard.press('Escape'); await pauza(300);
  await clic(p, mini(3));
  await clic(p, '[data-lh-tip="TabItem"]' + et('Slide Show'));
  await clic(p, mso('HideSlide'));
  st = await stare(p);
  if (JSON.stringify(st.diapozitive_ascunse) !== '[1,3]') return `dupa Slide Show › Hide Slide pe 3: ${JSON.stringify(st.diapozitive_ascunse)}`;
  await p.keyboard.press('F5'); await pauza(350);
  await p.keyboard.press('ArrowRight'); await pauza(300);
  st = await stare(p);
  if (st.expunere !== 4) return `dupa 2, → arata ${st.expunere} (trebuia ecranul de final, 4)`;
  await p.keyboard.press('ArrowLeft'); await pauza(300);
  st = await stare(p);
  if (st.expunere !== 2) return `de pe final, ← arata ${st.expunere} (trebuia 2: 3 e ascuns)`;
  await p.keyboard.press('Escape'); await pauza(300);
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  return JSON.stringify(st.diapozitive_ascunse) === '[1]' ? true : `dupa Ctrl+Z: ${JSON.stringify(st.diapozitive_ascunse)}`;
});

v('R1-07 F009 meniul miniaturii: Paste Options apar doar cu un DIAPOZITIV copiat; Use Destination Theme pe PRIMA miniatura -> copia pe locul 2', async p => {
  await clic(p, mini(1), 0, { dreapta: true });
  if (await exista(p, et('Use Destination Theme'))) return 'Use Destination Theme apare fara diapozitiv in clipboard';
  await p.keyboard.press('Escape'); await pauza(200);
  await clic(p, mini(3), 0, { dreapta: true });
  await clic(p, '[data-lh-tip="MenuItem"]' + et('Copy'), -1);
  await clic(p, mini(1), 0, { dreapta: true });
  if (!(await exista(p, et('Keep Source Formatting')))) return 'cu un diapozitiv copiat meniul n-are Keep Source Formatting';
  await clic(p, et('Use Destination Theme'), -1);
  const st = await stare(p);
  return JSON.stringify(titluri(st)) === JSON.stringify(['Vulcanii', 'Întrebări?', 'Ce sunt vulcanii', 'Întrebări?']) && st.diapozitiv_activ === 2 ? true
    : `titluri ${JSON.stringify(titluri(st))}, activ ${st.diapozitiv_activ}`;
});

v('R1-08 F013 Exit Edit Text pe caseta de CONTINUT (diapozitivul 2), apoi Bold -> tot textul casetei', async p => {
  await clic(p, mini(2));
  const pt = await clic(p, forma(2, 2));
  await p.mouse.click(pt.x, pt.y, { button: 'right' }); await pauza(300);
  await clic(p, et('Exit Edit Text'), -1);
  let st = await stare(p);
  if (!st.selectie_forma || st.selectie_forma[1] !== 2) return `dupa Exit Edit Text: selectie_forma ${JSON.stringify(st.selectie_forma)}`;
  await clic(p, mso('Bold'));
  st = await stare(p);
  const c = st.formatare_pe_caractere || [];
  return c.length && c.every(x => x.bold) ? true : `dupa Bold: ${JSON.stringify(c.map(x => [x.text, x.bold]))}`;
});

v('R1-09 F003 meniul PRIMEI miniaturi › Layout › Title Only: titlul ramane; Ctrl+Z readuce Title Slide', async p => {
  await clic(p, mini(1), 0, { dreapta: true });
  await clic(p, '[data-lh-tip="MenuItem"]' + et('Layout'), -1);
  await clic(p, et('Title Only'), -1);
  let st = await stare(p);
  if (st.diapozitive[0].aspect !== 'Title Only' || st.diapozitive[0].texte[0] !== 'Vulcanii') return `dupa Layout › Title Only: ${st.diapozitive[0].aspect} ${JSON.stringify(st.diapozitive[0].texte)}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  return st.diapozitive[0].aspect === 'Title Slide' ? true : `dupa Ctrl+Z: ${st.diapozitive[0].aspect}`;
});

v('R1-10 F032 Clear All Formatting pe caseta aleasa ca OBIECT (titlul diapozitivului 2): fara aldin, 44 pt; Ctrl+Z readuce aldinul', async p => {
  await clic(p, mini(2)); await clic(p, margine(2, 1));
  await clic(p, mso('Bold'));
  await clic(p, mso('FontSizeIncrease'));
  let st = await stare(p);
  if (!(st.formatare_pe_caractere || []).every(x => x.bold) || st.formatare_text.marime === 44) return `pregatirea: ${JSON.stringify(st.formatare_text)}`;
  await clic(p, mso('ClearFormatting'));
  st = await stare(p);
  if ((st.formatare_pe_caractere || []).some(x => x.bold) || st.formatare_text.marime !== 44) return `dupa Clear: marime ${st.formatare_text.marime}, ${JSON.stringify((st.formatare_pe_caractere || []).map(x => x.bold))}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  return (st.formatare_pe_caractere || []).every(x => x.bold) ? true : `dupa Ctrl+Z: ${JSON.stringify((st.formatare_pe_caractere || []).map(x => x.bold))}`;
});

v('R1-11 F014 Text Box: cea goala dispare la clicul pe ALTA miniatura; cea in care ai scris ramane', async p => {
  await clic(p, mini(1));
  await clic(p, '[data-lh-tip="TabItem"]' + et('Insert'));
  await clic(p, mso('TextBoxInsert'));
  let pt = await punctGol(p);
  await p.mouse.click(pt.x, pt.y); await pauza(300);
  if ((await stare(p)).forme_diapozitiv[0].length !== 3) return 'Text Box nu s-a pus pe diapozitivul 1';
  await clic(p, mini(2));
  let st = await stare(p);
  if (st.forme_diapozitiv[0].length !== 2) return `dupa clic pe miniatura 2 caseta goala a ramas (${st.forme_diapozitiv[0].length} forme)`;
  await clic(p, mso('TextBoxInsert'));
  pt = await punctGol(p);
  await p.mouse.click(pt.x, pt.y); await pauza(300);
  await p.keyboard.type('Lava'); await pauza(200);
  await clic(p, mini(1));
  st = await stare(p);
  const t = st.forme_diapozitiv[1].map(f => f.text);
  return t.includes('Lava') ? true : `caseta cu text a disparut de pe diapozitivul 2: ${JSON.stringify(t)}`;
});

v('R1-12 F030 Font Size ▾ pe caseta aleasa ca OBIECT: 10,5 din lista; lista se inchide cu Esc fara sa schimbe', async p => {
  await clic(p, mini(2)); await clic(p, margine(2, 2));
  await clic(p, mso('FontSize') + ' [data-lh-tinta^="meniu_derulant"], ' + mso('FontSize') + ' [data-lh-tip="Button"]', -1);
  if (!(await exista(p, '.lh-ap-p-lista-marimi'))) return 'lista Font Size ▾ nu s-a deschis';
  await clic(p, '[data-lh-tip="ListItem"]' + et('10,5'), -1);
  let st = await stare(p);
  if (st.formatare_text.marime !== 10.5) return `dupa 10,5: ${st.formatare_text.marime}`;
  await clic(p, mso('FontSize') + ' [data-lh-tinta^="meniu_derulant"], ' + mso('FontSize') + ' [data-lh-tip="Button"]', -1);
  await p.keyboard.press('Escape'); await pauza(250);
  st = await stare(p);
  if (await exista(p, '.lh-ap-p-lista-marimi')) return 'Esc n-a inchis lista';
  return st.formatare_text.marime === 10.5 ? true : `dupa Esc: ${st.formatare_text.marime}`;
});

v('R1-13 F012 bulite: caseta de continut a unui diapozitiv NOU (Ctrl+M) are buliță pe fiecare rând; titlul n-are', async p => {
  await clic(p, mini(2));
  await p.keyboard.press('Control+M'); await pauza(300);
  const st = await stare(p), n = st.diapozitive.length;
  if (n !== 4 || st.diapozitive[2].aspect !== 'Title and Content' || st.diapozitiv_activ !== 3) return `New Slide: ${n} diapozitive, aspect ${st.diapozitive[2].aspect}, activ ${st.diapozitiv_activ}`;
  await clic(p, forma(3, 2));
  await p.keyboard.type('Unu'); await p.keyboard.press('Enter'); await p.keyboard.type('Doi'); await p.keyboard.press('Enter'); await p.keyboard.type('Trei'); await pauza(250);
  const r = await p.evaluate(([app, f, t]) => {
    const bul = s => [...document.querySelectorAll(app + ' ' + s + ' .lh-ap-p-par')].filter(x => x.getBoundingClientRect().width > 0).map(x => getComputedStyle(x, '::before').content);
    return { c: bul(f), t: bul(t) };
  }, [APP, forma(3, 2), forma(3, 1)]);
  if (r.c.length !== 3 || !r.c.every(x => x.includes('•'))) return `rândurile casetei de conținut: ${JSON.stringify(r.c)}`;
  return r.t.some(x => x.includes('•')) ? `titlul are buliță: ${JSON.stringify(r.t)}` : true;
});

v('R1-14 F072 schita: View › Outline View o arata (cu textul diapozitivelor); clic pe randul 3 il alege; Normal din bara de stare o scoate', async p => {
  await clic(p, '[data-lh-tip="TabItem"]' + et('View'));
  await clic(p, mso('ViewOutlineViewPowerPoint'));
  let st = await stare(p);
  if (!st.panou_schita || await exista(p, '[data-lh-tinta="miniatura"]')) return `dupa Outline View: panou_schita ${st.panou_schita}`;
  await clic(p, '[data-lh-tinta="schita"][data-lh-id="3"]');
  st = await stare(p);
  if (st.diapozitiv_activ !== 3) return `clic pe randul 3 din schita: activ ${st.diapozitiv_activ}`;
  await clic(p, `[data-lh-tinta="bara_stare:Normal"], [data-lh-tinta="bara_stare"][data-lh-id="Normal"]`);
  st = await stare(p);
  const n = await p.evaluate(app => [...document.querySelectorAll(app + ' [data-lh-tinta="miniatura"]')].filter(e => e.getBoundingClientRect().width > 0).length, APP);
  return !st.panou_schita && n === 3 && st.diapozitiv_activ === 3 ? true : `dupa Normal: schita ${st.panou_schita}, miniaturi ${n}, activ ${st.diapozitiv_activ}`;
});

v('R1-15 F077 telefon (390x844, atingere): bara de taste — Ctrl+M, F5, →, Esc, Ctrl+Z, apasate cu DEGETUL; pe desktop bara nu exista', async p => {
  if (await exista(p, '[data-lh-ajutor="taste"]')) return 'pe desktop (fara atingere) bara de taste ocupa loc';
  const ctx = await p.context().browser().newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    const t = await ctx.newPage();
    const erori = [];
    t.on('pageerror', e => erori.push(e.message));
    await t.goto(p.url(), { waitUntil: 'load' });
    await t.waitForSelector(APP, { timeout: 15000 }); await pauza(1000);
    const tap = async (sel, k = 0) => { const pt = await punct(t, sel, k); await t.touchscreen.tap(pt.x, pt.y); await pauza(300); };
    const tasta = n => `[data-lh-ajutor="taste"] [data-lh-eticheta="${n}"]`;
    await tap(mini(2));
    await tap(tasta('Ctrl+M'));
    let st = await stare(t);
    if (st.diapozitive.length !== 4 || st.diapozitiv_activ !== 3) return `Ctrl+M din bara: ${st.diapozitive.length} diapozitive, activ ${st.diapozitiv_activ}`;
    await tap(tasta('F5'));
    st = await stare(t);
    if (st.expunere !== 1) return `F5 din bara: expunere ${st.expunere}`;
    await tap(tasta('→'));
    st = await stare(t);
    if (st.expunere !== 2) return `→ din bara: expunere ${st.expunere}`;
    await tap(tasta('Esc'));
    st = await stare(t);
    if (st.expunere !== null) return `Esc din bara: expunere ${st.expunere}`;
    await tap(tasta('Ctrl+Z'));
    st = await stare(t);
    if (st.diapozitive.length !== 3) return `Ctrl+Z din bara: ${st.diapozitive.length} diapozitive`;
    const jos = await t.evaluate(app => { const b = document.querySelector(app + ' [data-lh-ajutor="taste"]').getBoundingClientRect(); return b.bottom <= window.innerHeight + 1 && b.right <= window.innerWidth + 1; }, APP);
    if (!jos) return 'bara de taste iese din ecranul de 390x844';
    return erori.length ? 'erori: ' + erori[0] : true;
  } finally { await ctx.close(); }
});

// ---- runda 2
async function trage(p, n1, n3, jos = 0.9, liniaCb) {
  const a = await p.locator(APP + ' ' + mini(n1)).first().boundingBox(), b = await p.locator(APP + ' ' + mini(n3)).first().boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
  await p.mouse.move(b.x + b.width / 2, b.y + b.height * jos, { steps: 8 }); await pauza(150);
  const r = liniaCb ? await liniaCb() : null;
  await p.mouse.up(); await pauza(300);
  return r;
}
const nrLinii = p => p.evaluate(app => [...document.querySelectorAll(app + ' .lh-ap-p-loc')].filter(e => e.getBoundingClientRect().height > 0).length, APP);
async function cdpAtinge(t, x0, y0, x1, y1, tinere) {
  const cdp = await t.context().newCDPSession(t);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
  await pauza(tinere);
  for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 10, y: y0 + (y1 - y0) * i / 10 }] }); await pauza(30); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach(); await pauza(350);
}
v('R2-01 F006 tragerea 3 -> deasupra lui 1 (sus): linia apare in timpul tragerii, dispare la ridicare; ordinea 3,1,2, ales 1; Ctrl+Z reface', async p => {
  const t0 = titluri(await stare(p));
  const linii = await trage(p, 3, 1, 0.1, () => nrLinii(p));
  if (linii !== 1) return `in timpul tragerii: ${linii} linii de loc (trebuia 1)`;
  if (await nrLinii(p)) return 'linia de loc ramane dupa ridicare';
  let st = await stare(p);
  if (JSON.stringify(titluri(st)) !== JSON.stringify([t0[2], t0[0], t0[1]]) || st.diapozitiv_activ !== 1) return `dupa 3->1: ${JSON.stringify(titluri(st))}, ales ${st.diapozitiv_activ}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  st = await stare(p);
  if (JSON.stringify(titluri(st)) !== JSON.stringify(t0)) return `Ctrl+Z: ${JSON.stringify(titluri(st))}`;
  // tragere pe loc (2 peste el insusi): nimic nu se muta, linia dispare
  await trage(p, 2, 2, 0.5);
  st = await stare(p);
  if (JSON.stringify(titluri(st)) !== JSON.stringify(t0) || await nrLinii(p)) return `tragere pe loc: ${JSON.stringify(titluri(st))}`;
  return true;
});
v('R2-02 F006 telefon (390x844, deget): tii apasat + tragi 3 -> sus = mutare; glisare rapida (fara tinere) NU muta; tinerea pe loc nu muta', async p => {
  const ctx = await p.context().browser().newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    const t = await ctx.newPage();
    const erori = [];
    t.on('pageerror', e => erori.push(e.message));
    await t.goto(p.url(), { waitUntil: 'load' });
    await t.waitForSelector(APP, { timeout: 15000 }); await pauza(1000);
    const t0 = titluri(await stare(t));
    const bb = async n => t.locator(APP + ' ' + mini(n)).first().boundingBox();
    let a = await bb(3), b = await bb(1);
    await cdpAtinge(t, a.x + a.width / 2, a.y + a.height / 2, b.x + b.width / 2, b.y + 3, 600);
    let st = await stare(t);
    if (JSON.stringify(titluri(st)) !== JSON.stringify([t0[2], t0[0], t0[1]])) return `tinere + tragere 3->sus: ${JSON.stringify(titluri(st))}`;
    a = await bb(1); b = await bb(3);
    await cdpAtinge(t, a.x + a.width / 2, a.y + a.height / 2, b.x + b.width / 2, b.y + b.height * 0.9, 0);
    st = await stare(t);
    if (JSON.stringify(titluri(st)) !== JSON.stringify([t0[2], t0[0], t0[1]])) return `glisarea rapida a mutat: ${JSON.stringify(titluri(st))}`;
    if (await nrLinii(t)) return 'linia de loc ramane dupa glisare';
    a = await bb(2);
    await cdpAtinge(t, a.x + a.width / 2, a.y + a.height / 2, a.x + a.width / 2, a.y + a.height / 2, 900);
    // (meniul la tinere nu se poate juca aici: Chrome fara fereastra nu trimite contextmenu la tinerea din CDP)
    st = await stare(t);
    if (JSON.stringify(titluri(st)) !== JSON.stringify([t0[2], t0[0], t0[1]])) return `tinerea pe loc a mutat: ${JSON.stringify(titluri(st))}`;
    return erori.length ? 'erori: ' + erori[0] : true;
  } finally { await ctx.close(); }
});

const puneTema = async (p, n) => {
  await clic(p, '[data-lh-tinta="fila:TabDesign"], [data-lh-eticheta="Design"][data-lh-tip="TabItem"]', 0, { dupa: 400 });
  await p.evaluate(([app, n]) => document.querySelector(app + ' [data-lh-id-mso="SlideThemesGallery"] [data-lh-eticheta="' + n + '"]').click(), [APP, n]);
  await pauza(400);
};
v('R2-03 F033 fontul temei e legatura: titlul 1 (neatins) si titlul 2 cu „(Headings)” iau Century Gothic sub Ion, titlul 3 cu Arial ramane Arial; lista Font arata „Century Gothic (Headings)”; Ctrl+Z -> Calibri Light', async p => {
  const font = async (d) => { await clic(p, mini(d)); await clic(p, margine(d, 1)); return (await stare(p)).font_text; };
  const alegeFont = async n => { await clic(p, mso('Font') + ' input'); await clic(p, '[data-lh-tip="ListItem"]' + et(n), -1); };
  await clic(p, mini(3)); await clic(p, margine(3, 1)); await alegeFont('Arial');
  await clic(p, mini(2)); await clic(p, margine(2, 1)); await alegeFont('Calibri Light (Headings)');
  await puneTema(p, 'Ion');
  if ((await stare(p)).tema !== 'Ion') return 'tema Ion nu s-a pus';
  const f = [await font(1), await font(2), await font(3)];
  if (JSON.stringify(f) !== JSON.stringify(['Century Gothic', 'Century Gothic', 'Arial'])) return `sub Ion: ${JSON.stringify(f)}`;
  await clic(p, '[data-lh-tinta="fila:TabHome"], [data-lh-eticheta="Home"][data-lh-tip="TabItem"]', 0, { dupa: 300 });
  await clic(p, mini(2)); await clic(p, margine(2, 1)); await clic(p, mso('Font') + ' input');
  if (!(await exista(p, '[data-lh-tip="ListItem"]' + et('Century Gothic (Headings)')))) return 'lista Font sub Ion n-are „Century Gothic (Headings)”';
  await p.keyboard.press('Escape'); await pauza(200);
  await p.keyboard.press('Control+Z'); await pauza(300);
  const st = await stare(p);
  if (st.tema !== 'Office Theme') return `Ctrl+Z: tema ${st.tema}`;
  if (await font(2) !== 'Calibri Light') return `Ctrl+Z: titlul 2 are ${await font(2)}`;
  return true;
});
v('R2-04 F045 tema Ion: fundalul tuturor diapozitivelor (fara cel pus de mana) si literele se schimba; fundalul pus de mana pe 3 ramane; Ctrl+Z le reface', async p => {
  const s0 = await stare(p);
  await deschideFundal(p, 3);
  await clic(p, et('Solid fill'), -1);
  await clic(p, '[data-lh-eticheta^="Fill Color"]', -1);
  await clic(p, '[data-lh-tip="ListItem"]' + et('Yellow'), -1);
  const manual = (await stare(p)).fundal_diapozitive[2];
  await p.keyboard.press('Escape'); await pauza(200);
  await puneTema(p, 'Ion');
  const st = await stare(p);
  if (st.tema !== 'Ion') return 'tema Ion nu s-a pus';
  if (st.fundal_diapozitive[0].culoare !== '#1A6A6F' || st.fundal_diapozitive[1].culoare !== '#1A6A6F') return `fundaluri sub Ion: ${JSON.stringify(st.fundal_diapozitive)}`;
  if (JSON.stringify(st.fundal_diapozitive[2]) !== JSON.stringify(manual)) return `fundalul pus de mana s-a schimbat: ${JSON.stringify(st.fundal_diapozitive[2])} (era ${JSON.stringify(manual)})`;
  await clic(p, mini(1)); await clic(p, margine(1, 1));
  if ((await stare(p)).culoare_text !== '#FFFFFF') return `literele sub Ion: ${(await stare(p)).culoare_text}`;
  await p.keyboard.press('Control+Z'); await pauza(300);
  const s2 = await stare(p);
  if (s2.tema !== s0.tema || s2.fundal_diapozitive[0].culoare !== '#FFFFFF') return `Ctrl+Z: tema ${s2.tema}, fundal ${JSON.stringify(s2.fundal_diapozitive[0])}`;
  return true;
});

v('R2-05 G1-1 schita: clic pe textul titlului 2 + „abc” scrie in titlu; Delete / Backspace / Enter nu sterg diapozitivul; Ctrl+Z scoate scrisul; clic pe numarul randului 3 + Delete sterge diapozitivul 3', async p => {
  await clic(p, '[data-lh-tinta="fila:TabView"], [data-lh-eticheta="View"][data-lh-tip="TabItem"]', 0, { dupa: 300 });
  await clic(p, et('Outline View'), -1, { dupa: 400 });
  if (!(await stare(p)).panou_schita) return 'schita nu s-a deschis';
  const t0 = titluri(await stare(p));
  await clic(p, '[data-lh-tinta="schita"][data-lh-id="2"] .lh-ap-p-schita-t');
  await p.keyboard.type('abc'); await pauza(300);
  let st = await stare(p);
  if (st.diapozitive[1].texte[0] !== t0[1] + 'abc') return `dupa „abc”: titlul 2 = ${JSON.stringify(st.diapozitive[1].texte[0])}`;
  for (const k of ['Delete', 'Backspace', 'Enter']) { await p.keyboard.press(k); await pauza(200); }
  st = await stare(p);
  if (st.diapozitive.length !== 3) return `Delete/Backspace/Enter pe text au schimbat diapozitivele: ${st.diapozitive.length}`;
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Control+Z'); await pauza(200); }
  st = await stare(p);
  if (JSON.stringify(titluri(st)) !== JSON.stringify(t0)) return `Ctrl+Z: ${JSON.stringify(titluri(st))}`;
  await clic(p, '[data-lh-tinta="schita"][data-lh-id="3"] .lh-ap-p-schita-nr');
  await p.keyboard.press('Delete'); await pauza(300);
  st = await stare(p);
  if (st.diapozitive.length !== 2) return `clic pe numarul 3 + Delete: ${st.diapozitive.length} diapozitive`;
  return true;
});

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const x of VERIFICARI) await verifica(browser, base, x.nume, x.fn);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => {
  console.log('FAIL harness - ' + e.message);
  console.log('1');
});
