// Probe de paritate Excel, felia b (noaptea 22->23.11.2026): cate o proba pe randul din
//   _campaign/aplicatii_fidele_2026_11/runde/noapte_excel_22_11/felii/felie_b.json
// Fiecare proba joaca gestul ca un elev (clicuri si taste reale prin Playwright, pe elemente vizibile, cautate dupa
// ce vede omul: data-lh-eticheta / data-lh-tip / data-lh-tinta / data-lh-id-mso / textul de pe ecran), apoi verifica
// rezultatul pe ecran si in LH.aplicatii.stare('excel'). Tinta = Excelul adevarat (interfata in engleza, setarile
// regionale romanesti ale laboratorului); unde simulatorul vechi diferea, comentariul de la proba spune.
// Randurile din grupurile „Strat de exercitiu” / „Verificare (exercitiu)” care tin de lectie dau SKIP (nu se numara la
// FAIL); unde o parte e a aplicatiei (evenimentele, textul formulei), proba o joaca: daca lipseste, FAIL; daca exista, SKIP.
// Rulare:  node aplicatii/_verificare/excel_paritate_b.mjs   (din orice director; serverul local serveste depozitul)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: PASS / FAIL / SKIP <id> <nume> - <detalii>; ultimele trei linii: REZUMAT, TOTAL FAIL, numarul de FAIL.
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const LIMITA_PROBA = 20000;

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

const rezultate = { PASS: 0, FAIL: 0, SKIP: 0 };
function scrie(stare, id, nume, detalii) {
  rezultate[stare]++;
  console.log(`${stare} ${id} ${nume}${detalii ? ' - ' + String(detalii).replace(/\s*\n\s*/g, ' ') : ''}`);
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const R = '[data-lh-aplicatie="excel"]';

// ------------------------------------------------------------------ deschiderea paginii de proba
async function deschide(browser, base, mobil) {
  const ctx = await browser.newContext(mobil
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
    : { viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=excel`, { waitUntil: 'load' });
  await p.waitForSelector(R, { timeout: 10000 });
  await p.waitForFunction(() => !!(window.LH && window.LH.aplicatii && window.LH.aplicatii.stare && window.LH.aplicatii.stare('excel')), null, { timeout: 10000 });
  await pauza(400);
  return { ctx, p, erori };
}

// ------------------------------------------------------------------ cautarea pe ecran (dupa ce vede omul)
// crit: { tinte:[...] (forma intreaga „fel:valoare”; se potriveste si cu data-lh-tinta + data-lh-id),
//         et: 'Eticheta' | etRe: 'regex' (data-lh-eticheta, aria-label, title sau textul vizibil al butonului),
//         mso, tip:[...], fara: 'regex pe tinta' (exclude), tot: true (in toata pagina, nu doar in aplicatie) }
async function gaseste(p, crit) {
  return p.evaluate(c => {
    const rad = c.tot ? document.body : document.querySelector('[data-lh-aplicatie="excel"]');
    if (!rad) return null;
    const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
    const vizibil = e => {
      const r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      for (let x = e; x && x !== document.documentElement; x = x.parentElement) {
        const cs = getComputedStyle(x);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
      }
      return true;
    };
    const tintaDe = e => { const t = e.getAttribute('data-lh-tinta'); if (!t) return null; const id = e.getAttribute('data-lh-id'); return id != null && !t.includes(':') ? t + ':' + id : t; };
    const buton = e => e.tagName === 'BUTTON' || e.tagName === 'SELECT' || e.tagName === 'INPUT' || e.hasAttribute('data-lh-tinta')
      || /^(button|menuitem|menuitemcheckbox|menuitemradio|option|tab|treeitem|checkbox|radio|link|gridcell)$/.test(e.getAttribute('role') || '')
      || /^(Button|SplitButton|MenuItem|ListItem|TabItem|TreeItem|CheckBox|RadioButton|DataItem|Hyperlink)$/.test(e.getAttribute('data-lh-tip') || '');
    const re = c.etRe ? new RegExp(c.etRe, 'i') : null;
    const fara = c.fara ? new RegExp(c.fara) : null;
    const potriveste = x => (c.et != null && x === c.et) || (re && re.test(x));
    // eticheta: intai atributele, apoi (doar daca trebuie) textul vizibil
    const areEticheta = e => [e.getAttribute('data-lh-eticheta'), e.getAttribute('aria-label'), e.getAttribute('title')].map(norm).filter(Boolean).some(potriveste)
      || (e.childElementCount < 6 && potriveste(norm(e.innerText).slice(0, 80)));
    const q = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    // selectorul ingusteaza cautarea (pagina are mii de elemente); filtrele de mai jos hotarasc
    let sel = '*';
    if (c.tinte) sel = c.tinte.map(t => { const i = t.indexOf(':'); return `[data-lh-tinta="${q(t)}"]` + (i > 0 ? `, [data-lh-tinta="${q(t.slice(0, i))}"][data-lh-id="${q(t.slice(i + 1))}"]` : ''); }).join(', ');
    else if (c.mso) sel = `[data-lh-id-mso="${q(c.mso)}"]`;
    else if (c.et != null || re) sel = 'button, select, input, [role], [data-lh-tip], [data-lh-tinta]';
    let cand = [...rad.querySelectorAll(sel)].filter(e => {
      const t = tintaDe(e);
      if (c.tinte && (!t || !c.tinte.includes(t))) return false;
      if (c.mso && e.getAttribute('data-lh-id-mso') !== c.mso) return false;
      if (c.tip && !c.tip.includes(e.getAttribute('data-lh-tip'))) return false;
      if (fara && fara.test(t || '')) return false;
      if (c.et != null || re) {
        if (t && /^(celula|antet_rand|antet_coloana)(:|$)/.test(t)) return false;
        if (!buton(e) || !areEticheta(e)) return false;
      }
      return vizibil(e);
    });
    cand = cand.filter(e => !cand.some(x => x !== e && e.contains(x)));    // cel mai adanc
    if (!cand.length) return null;
    const e = c.prim ? cand[0] : cand[cand.length - 1];                   // implicit: ultimul (fereastra de deasupra)
    e.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, tag: e.tagName, tinta: tintaDe(e), et: norm(e.getAttribute('data-lh-eticheta') || e.innerText).slice(0, 60) };
  }, crit);
}
const descrie = c => JSON.stringify(c);

function unelte(p) {
  let ultimClic = { k: null, t: 0 };
  const h = {
    st: () => p.evaluate(() => window.LH.aplicatii.stare('excel')),
    async clicLa(g, cheie) {
      // doua clicuri repezi pe acelasi loc = dublu clic (editare); un elev nu clicheaza de doua ori in 0,6 s
      if (cheie && ultimClic.k === cheie && Date.now() - ultimClic.t < 650) await pauza(650 - (Date.now() - ultimClic.t));
      await p.mouse.click(g.x, g.y);
      ultimClic = { k: cheie, t: Date.now() };
      await pauza(110);
    },
    async apasa(crit, cum) {
      let g = await gaseste(p, crit);
      if (!g && crit.tinte) {                                            // comanda de pe alta fila a panglicii: intai fila
        const m = /^(?:panglica|meniu_derulant|lansator):([^/]+)\//.exec(crit.tinte[0]);
        if (m) { const f = await gaseste(p, { tinte: ['fila:' + m[1]] }); if (f) { await h.clicLa(f, 'fila:' + m[1]); g = await gaseste(p, crit); } }
      }
      if (!g) throw new Error((cum || 'nu gasesc pe ecran') + ': ' + descrie(crit));
      await h.clicLa(g, descrie(crit));
      return g;
    },
    async exista(crit) { return !!(await gaseste(p, crit)); },
    async asteapta(crit, ms = 3000) {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) { if (await gaseste(p, crit)) return true; await pauza(100); }
      return false;
    },
    async celula(a) { const g = await gaseste(p, { tinte: ['celula:' + a] }); if (!g) throw new Error('celula ' + a + ' nu e pe ecran'); await h.clicLa(g, 'celula:' + a); },
    async scrieColoana(a, valori) { await h.celula(a); for (const v of valori) { await p.keyboard.type(v); await p.keyboard.press('Enter'); } await pauza(60); },
    buton: (eticheta, extra) => h.apasa({ et: eticheta, fara: '^(acces_rapid|backstage|panglica|meniu_derulant|fila|fila_foii|bara_titlu|bara_stare|celula|lansator):', ...(extra || {}) }, 'nu gasesc butonul „' + eticheta + '”'),
    areButon: eticheta => h.exista({ et: eticheta, fara: '^(acces_rapid|backstage|panglica|meniu_derulant|fila|fila_foii|bara_titlu|bara_stare|celula|lansator):' }),
    text: () => p.evaluate(() => document.body.innerText),
    textCelula: a => p.evaluate(a => { const c = document.querySelector(`[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${a}"], [data-lh-aplicatie="excel"] [data-lh-tinta="celula:${a}"]`); return c ? c.innerText.replace(/\s+/g, ' ').trim() : null; }, a),
    // fereastra Save As: F12, dosarul, tipul, numele, Save
    async salveazaCa(nume, opt = {}) {
      await p.keyboard.press('F12');
      if (!(await h.asteapta({ tinte: ['camp:nume_fisier'] }))) throw new Error('F12 nu deschide fereastra Save As (caseta File name)');
      await h.dosar(opt.dosar || 'Documente');
      if (opt.tip) await h.alegeTip(opt.tip);
      await h.numeFisier(nume);
      await h.buton('Save');
      await pauza(250);
    },
    async dosar(d) {
      const alt = { Documente: 'Documents', 'Descărcări': 'Downloads' }[d] || d;
      await h.apasa({ tinte: ['arbore:' + d, 'arbore:' + alt] }, 'nu gasesc dosarul ' + d + ' in fereastra');
    },
    async numeFisier(nume) {
      const g = await gaseste(p, { tinte: ['camp:nume_fisier'] });
      if (!g) throw new Error('nu gasesc caseta File name');
      await h.clicLa(g, 'camp:nume_fisier');
      await p.keyboard.press('Control+A');
      await p.keyboard.type(nume);
    },
    async alegeTip(reSrc) {
      const info = await p.evaluate(src => {
        const re = new RegExp(src, 'i');
        const el = [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tinta="camp:tip_fisier"]')].filter(e => e.getBoundingClientRect().width > 0).pop();
        if (!el) return null;
        const sel = el.tagName === 'SELECT' ? el : el.querySelector('select');
        if (sel) { const i = [...sel.options].findIndex(o => re.test(o.text)); return { select: true, i, optiuni: [...sel.options].map(o => o.text) }; }
        return { select: false };
      }, reSrc);
      if (!info) throw new Error('nu gasesc caseta Save as type / Files of type');
      if (info.select) {
        if (info.i < 0) throw new Error('tipul ' + reSrc + ' nu e in lista: ' + info.optiuni.join(' | '));
        const loc = p.locator(`${R} [data-lh-tinta="camp:tip_fisier"]`).filter({ visible: true }).last();
        const tag = await loc.evaluate(e => e.tagName);
        await (tag === 'SELECT' ? loc : loc.locator('select')).selectOption({ index: info.i });
        await pauza(150);
      } else {
        await h.apasa({ tinte: ['camp:tip_fisier'] });
        await h.apasa({ etRe: reSrc }, 'nu gasesc tipul ' + reSrc + ' in lista deschisa');
      }
    },
    // Ctrl+O › Browse › dosar › fisier › Open
    async deschideFisier(nume, opt = {}) {
      await p.keyboard.press('Control+o');
      await pauza(300);
      if (!(await h.exista({ tinte: ['camp:nume_fisier'] }))) {
        if (!(await h.asteapta({ et: 'Browse' }, 2000))) throw new Error('Ctrl+O: nu apare pagina Open cu Browse');
        await h.apasa({ et: 'Browse' });
      }
      if (!(await h.asteapta({ tinte: ['camp:nume_fisier'] }))) throw new Error('Browse nu deschide fereastra Open');
      await h.dosar(opt.dosar || 'Documente');
      if (opt.tip) await h.alegeTip(opt.tip);
      await h.apasa({ tinte: ['fisier:' + nume, 'lista:' + nume] }, 'fisierul ' + nume + ' nu apare in lista ferestrei Open');
      await h.buton('Open');
      await pauza(300);
    },
    // Ctrl+W; daca Excel intreaba, raspunsul dat (implicit Don't Save)
    async inchideRegistru(raspuns = "Don't Save") {
      await p.keyboard.press('Control+w');
      await pauza(300);
      if (await h.areButon("Don't Save")) await h.buton(raspuns);
      await pauza(200);
    },
    marcaj: () => p.evaluate(() => { window.__probaK = (window.__lhAplicatieEv || []).length; }),
    evenimente: () => p.evaluate(() => (window.__lhAplicatieEv || []).slice(window.__probaK || 0).map(e => ({ gest: e.gest, actiune: e.actiune, tinta: e.tinta, activat: e.activat || null }))),
  };
  return h;
}

// valoarea unei celule dintr-o foaie (din foi_celule; altfel din foaia activa)
function valoareDin(s, foaie, a) {
  const fc = s.foi_celule && s.foi_celule[foaie];
  const c = fc ? fc[a] : (s.foaie_activa === foaie ? (s.celule || {})[a] : undefined);
  return c ? c.valoare : undefined;
}
function valoriOriunde(s, a) { return Object.values(s.foi_celule || {}).map(f => f[a] && f[a].valoare).filter(v => v != null); }
const verde = (r, g, b) => g > 90 && g > r + 40 && g > b + 25;

// ================================================================== PROBELE
const PROBE = [];
const proba = (id, nume, fn, opt = {}) => PROBE.push({ id, nume, fn, ...opt });
const skip = (id, nume, motiv) => PROBE.push({ id, nume, motiv });

// ---------------------------------------------------------------- Registru: salvare
proba('excel-a-F188', 'Save As peste un nume luat: Confirm Save As „… already exists. Do you want to replace it?” [Yes] [No]', async (p, h) => {
  const pb = [];
  await h.celula('F1'); await p.keyboard.type('PROBA188'); await p.keyboard.press('Enter');
  await h.salveazaCa('Note clasa');                                     // numele colegului, deja in Documente
  if (!(await h.asteapta({ et: 'No' }, 3000))) return { ok: false, d: 'dupa Save cu „Note clasa” nu apare nicio fereastra cu butonul No; pe ecran: ' + (await h.text()).match(/[^\n]*(exist|replace|Save As)[^\n]*/gi)?.slice(0, 3).join(' | ') };
  const t = await h.text();
  if (!/Confirm Save As/.test(t)) pb.push('titlul „Confirm Save As” lipseste');
  if (!/Note clasa\.xlsx already exists/i.test(t)) pb.push('lipseste „Note clasa.xlsx already exists.”');
  if (!/Do you want to replace it\?/i.test(t)) pb.push('lipseste „Do you want to replace it?”');
  const yes = await gaseste(p, { et: 'Yes', fara: '^(acces_rapid|backstage|panglica|fila):' }), no = await gaseste(p, { et: 'No', fara: '^(acces_rapid|backstage|panglica|fila):' });
  if (!yes) pb.push('butonul Yes lipseste'); else if (no && yes.x > no.x) pb.push('Yes trebuie sa fie la stanga lui No');
  await h.buton('No');
  const s1 = await h.st();
  if (!(await h.exista({ tinte: ['camp:nume_fisier'] }))) pb.push('dupa No, fereastra Save As trebuia sa ramana deschisa');
  if ((s1.fisiere.Documente || []).filter(n => /^note clasa\.xlsx$/i.test(n)).length !== 1) pb.push('dupa No, Documente: ' + JSON.stringify(s1.fisiere.Documente));
  // Yes pe alt nume luat: inlocuieste
  await h.numeFisier('Buget excursie');
  await h.buton('Save');
  if (!(await h.asteapta({ et: 'Yes' }, 3000))) pb.push('a doua oara (Buget excursie) nu apare Confirm Save As');
  else {
    await h.buton('Yes');
    const s2 = await h.st();
    if (await h.exista({ tinte: ['camp:nume_fisier'] })) pb.push('dupa Yes, fereastra Save As a ramas deschisa');
    if (!/^Buget excursie/.test(s2.registru_activ || s2.nume_fisier || '')) pb.push('dupa Yes, registrul activ e ' + s2.registru_activ + ' (asteptat Buget excursie)');
  }
  // fisierele, redeschise: al colegului neatins (No), cel inlocuit are lucrul meu (Yes)
  await h.inchideRegistru();
  await h.deschideFisier('Buget excursie.xlsx');
  const s3 = await h.st();
  if (!valoriOriunde(s3, 'F1').includes('PROBA188')) pb.push('Buget excursie.xlsx redeschis nu are F1=PROBA188 (Yes nu a inlocuit)');
  await h.deschideFisier('Note clasa.xlsx');
  const s4 = await h.st();
  if (!/^Note clasa/.test(s4.registru_activ || '')) pb.push('Note clasa.xlsx nu s-a deschis (activ: ' + s4.registru_activ + ')');
  else if (valoriOriunde(s4, 'F1').includes('PROBA188')) pb.push('Note clasa.xlsx a fost scris desi am raspuns No');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'Confirm Save As cu textul Excel; No lasa fisierul colegului neatins, Yes inlocuieste' };
});

proba('excel-a-F189', 'Dupa Save As lucrezi in copie (titlul arata numele nou), originalul ramane neschimbat', async (p, h) => {
  const pb = [];
  await h.deschideFisier('Note clasa.xlsx');
  const s0 = await h.st();
  if (!/^Note clasa/.test(s0.registru_activ || '')) return { ok: false, d: 'Note clasa.xlsx nu s-a deschis din Documente (activ: ' + s0.registru_activ + ')' };
  await h.celula('F1'); await p.keyboard.type('PROBA189'); await p.keyboard.press('Enter');
  await h.salveazaCa('Copie proba');
  if (await h.areButon('Yes')) return { ok: false, d: 'Save As cu nume nou a cerut confirmare de inlocuire' };
  const s1 = await h.st();
  const titlu = await p.evaluate(() => { const t = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-tip="TitleBar"]'); return t ? t.innerText.replace(/\s+/g, ' ') : ''; });
  if (!/^Copie proba/.test(s1.registru_activ || '')) pb.push('registrul activ e ' + s1.registru_activ + ' (asteptat Copie proba)');
  if (!/Copie proba/.test(titlu) && !/Copie proba/.test(s1.titlu_fereastra || '')) pb.push('titlul ferestrei nu arata „Copie proba”: ' + (titlu || s1.titlu_fereastra));
  else if (!/Copie proba/.test(titlu)) pb.push('numele nou e doar in stare, nu pe bara de titlu (pe ecran: „' + titlu.slice(0, 60) + '”)');
  await h.inchideRegistru();
  await h.deschideFisier('Note clasa.xlsx');
  const s2 = await h.st();
  if (!/^Note clasa/.test(s2.registru_activ || '')) pb.push('originalul nu se mai deschide');
  else if (valoriOriunde(s2, 'F1').includes('PROBA189')) pb.push('originalul Note clasa.xlsx contine modificarea facuta in copie');
  await h.deschideFisier('Copie proba.xlsx');
  const s3 = await h.st();
  if (!valoriOriunde(s3, 'F1').includes('PROBA189')) pb.push('copia redeschisa nu are modificarea (F1=PROBA189)');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'titlul arata Copie proba; Note clasa.xlsx redeschis fara modificare; copia are F1=PROBA189' };
});

// Excel real (desktop 365): dupa OK, fila foii active ia numele fisierului si apare bara galbena „POSSIBLE DATA LOSS”.
// Nu verific aici ce se intampla cu celelalte foi in fereastra deschisa (nesigur pe Excelul real); verific fisierul scris.
proba('excel-a-F190', 'Save As CSV: mesajul cu mai multe foi [OK][Cancel]; doar foaia activa, doar valorile; foaia ia numele fisierului; bara POSSIBLE DATA LOSS', async (p, h) => {
  const pb = [];
  await h.apasa({ tinte: ['fila_foii_buton:Add Sheet'], etRe: '^(New sheet|Add Sheet|Insert Worksheet)$' }).catch(async () => h.apasa({ etRe: '^(New sheet|Add Sheet|Insert Worksheet)$' }));
  await h.celula('A1'); await p.keyboard.type('FOAIA2'); await p.keyboard.press('Enter');
  await h.apasa({ tinte: ['fila_foii:Sheet1'] });
  await h.scrieColoana('F1', ['5', '=F1*2']);
  await h.salveazaCa('export proba', { tip: 'CSV' });
  if (!(await h.asteapta({ et: 'OK' }, 3000))) return { ok: false, d: 'dupa Save ca CSV nu apare mesajul cu OK; pe ecran: ' + ((await h.text()).match(/[^\n]*(sheet|CSV|support)[^\n]*/gi) || []).slice(0, 2).join(' | ') };
  const t = await h.text();
  if (!/does not support workbooks that contain multiple sheets/i.test(t)) pb.push('lipseste textul „does not support workbooks that contain multiple sheets”');
  if (!(await h.areButon('Cancel'))) pb.push('lipseste Cancel in mesaj');
  await h.buton('OK');
  await pauza(200);
  const s1 = await h.st();
  const file = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tinta^="fila_foii"]')].filter(e => e.getBoundingClientRect().width > 0 && !/buton/.test(e.getAttribute('data-lh-tinta'))).map(e => e.innerText.trim()));
  if (!file.includes('export proba')) pb.push('nicio fila „export proba” pe ecran (file: ' + file.join(', ') + ')');
  if (!(s1.fisiere.Documente || []).includes('export proba.csv')) pb.push('export proba.csv nu e in Documente');
  if (!/POSSIBLE DATA LOSS/.test(await h.text())) pb.push('bara „POSSIBLE DATA LOSS” nu apare pe ecran' + (s1.avertisment_fisier ? ' (e doar in stare: avertisment_fisier)' : ''));
  // fisierul scris: inchid fara alta salvare si il deschid din Documente
  await h.inchideRegistru();
  await h.deschideFisier('export proba.csv', { tip: 'All Files|Text Files' });
  const s2 = await h.st();
  if (!/^export proba/.test(s2.registru_activ || s2.nume_fisier || '')) pb.push('export proba.csv nu s-a deschis (activ: ' + s2.registru_activ + ')');
  else {
    if (JSON.stringify(s2.foi) !== JSON.stringify(['export proba'])) pb.push('CSV-ul redeschis are foile ' + JSON.stringify(s2.foi) + ' (asteptat doar „export proba”)');
    const f2 = (s2.celule || {}).F2 || {};
    if (f2.valoare !== 10 || f2.formula) pb.push('in CSV, F2 trebuia sa fie valoarea 10 fara formula: ' + JSON.stringify(f2));
    if (JSON.stringify(s2.foi_celule || s2.celule).includes('FOAIA2')) pb.push('CSV-ul contine si foaia a doua');
  }
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'mesaj + OK; fila export proba; bara POSSIBLE DATA LOSS; CSV redeschis: o foaie, F2=10 fara formula' };
});

proba('excel-a-F191', 'Save As PDF: se face PDF-ul foii active, registrul deschis ramane cel de dinainte', async (p, h) => {
  const pb = [];
  const s0 = await h.st();
  await h.celula('F1'); await p.keyboard.type('PROBA191'); await p.keyboard.press('Enter');
  await h.salveazaCa('raport proba', { tip: 'PDF' });
  if (await h.areButon('OK')) { pb.push('a aparut un mesaj neasteptat: ' + ((await h.text()).match(/[^\n]{0,80}PDF[^\n]{0,80}/) || [''])[0]); await h.buton('OK'); }
  const s1 = await h.st();
  if (await h.exista({ tinte: ['camp:nume_fisier'] })) pb.push('fereastra Save As a ramas deschisa');
  if (!(s1.fisiere.Documente || []).includes('raport proba.pdf')) pb.push('raport proba.pdf nu e in Documente: ' + JSON.stringify(s1.fisiere.Documente));
  if (s1.registru_activ !== s0.registru_activ) pb.push('registrul activ s-a schimbat: ' + s0.registru_activ + ' -> ' + s1.registru_activ);
  if ((s1.titlu_fereastra || '') !== (s0.titlu_fereastra || '')) pb.push('titlul s-a schimbat: ' + s1.titlu_fereastra);
  if (((s1.celule || {}).F1 || {}).valoare !== 'PROBA191') pb.push('registrul deschis nu mai are F1=PROBA191');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'raport proba.pdf in Documente; registrul ramas ' + s1.registru_activ };
});

// Excelul real nu are aceste butoane (nu e in browser); browserul ia insa tastele, iar pe telefon / tabla nu e tastatura.
proba('excel-a-F201', 'Tastele luate de browser (Ctrl+N, Ctrl+W, Ctrl+PageUp, Ctrl+PageDown, F12) se apasa din butoane de sub titlu', async (p, h) => {
  const TASTE = { 'Ctrl+N': ['ctrl+n'], 'Ctrl+W': ['ctrl+w'], 'Ctrl+PageUp': ['ctrl+pageup', 'ctrl+pgup'], 'Ctrl+PageDown': ['ctrl+pagedown', 'ctrl+pgdn'], F12: ['f12'] };
  const gasite = await p.evaluate(T => {
    const n = s => String(s || '').toLowerCase().replace(/\s+/g, '');
    const el = [...document.querySelectorAll('button, [role="button"], [data-lh-tip="Button"]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    const out = {};
    for (const [k, v] of Object.entries(T)) out[k] = el.some(e => [e.innerText, e.getAttribute('aria-label'), e.getAttribute('data-lh-eticheta')].some(x => v.includes(n(x))));
    return out;
  }, TASTE);
  const lipsa = Object.keys(gasite).filter(k => !gasite[k]);
  if (lipsa.length) return { ok: false, d: 'pe pagina nu e niciun buton pentru: ' + lipsa.join(', ') };
  const RE = { 'Ctrl+N': '^ctrl\\s*\\+\\s*n$', 'Ctrl+W': '^ctrl\\s*\\+\\s*w$', 'Ctrl+PageUp': '^ctrl\\s*\\+\\s*(page\\s*up|pg\\s*up)$', 'Ctrl+PageDown': '^ctrl\\s*\\+\\s*(page\\s*down|pg\\s*dn)$', F12: '^f12$' };
  const tasta = async k => h.apasa({ tot: true, etRe: RE[k] }, 'nu gasesc butonul ' + k);
  const pb = [];
  await h.apasa({ tinte: ['fila_foii_buton:Add Sheet'] }); await h.apasa({ tinte: ['fila_foii_buton:Add Sheet'] });
  await h.apasa({ tinte: ['fila_foii:Sheet1'] });
  await tasta('Ctrl+PageDown'); await tasta('Ctrl+PageDown');
  let s = await h.st(); if (s.foaie_activa !== s.foi[2]) pb.push('Ctrl+PageDown x2 de pe prima foaie: activa ' + s.foaie_activa);
  await tasta('Ctrl+PageUp');
  s = await h.st(); if (s.foaie_activa !== s.foi[1]) pb.push('Ctrl+PageUp: activa ' + s.foaie_activa);
  await tasta('F12');
  if (!(await h.asteapta({ tinte: ['camp:nume_fisier'] }, 2000))) pb.push('butonul F12 nu deschide Save As'); else await h.buton('Cancel');
  const n0 = (await h.st()).registre.length;
  await tasta('Ctrl+N');
  s = await h.st(); if (s.registre.length !== n0 + 1) pb.push('butonul Ctrl+N nu face registru nou');
  await tasta('Ctrl+W');
  s = await h.st(); if (s.registre.length !== n0) pb.push('butonul Ctrl+W nu inchide registrul nou');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'cele cinci butoane exista si fac ce face tasta' };
});

// ---------------------------------------------------------------- Registru: inchidere si deschidere
// Excel 365 real: pe un fisier deja salvat intrebarea poate fi „Want to save your changes to 'X'?”; accept ambele texte.
proba('excel-a-F194', 'Inchide un registru modificat: „Save your changes to this file?” [Save] [Don\'t Save] [Cancel]; Save salveaza si inchide, Cancel il lasa deschis', async (p, h) => {
  const pb = [];
  await h.deschideFisier('Note clasa.xlsx');
  if (!/^Note clasa/.test((await h.st()).registru_activ || '')) return { ok: false, d: 'Note clasa.xlsx nu s-a deschis' };
  await h.celula('F1'); await p.keyboard.type('PROBA194'); await p.keyboard.press('Enter');
  await p.keyboard.press('Control+w');
  if (!(await h.asteapta({ et: "Don't Save" }, 3000))) return { ok: false, d: 'Ctrl+W pe registrul modificat nu intreaba (fara Don\'t Save pe ecran)' };
  const t = await h.text();
  if (!/Save your changes to this file\?|Want to save your changes to|save the changes you made to/i.test(t)) pb.push('lipseste intrebarea „Save your changes to this file?”');
  for (const b of ['Save', 'Cancel']) if (!(await h.areButon(b))) pb.push('lipseste butonul ' + b);
  await h.buton('Cancel');
  let s = await h.st();
  if (await h.areButon("Don't Save")) pb.push('dupa Cancel fereastra a ramas');
  if (!/^Note clasa/.test(s.registru_activ || '') || ((s.celule || {}).F1 || {}).valoare !== 'PROBA194') pb.push('dupa Cancel registrul nu mai e deschis cu modificarea');
  await p.keyboard.press('Control+w');
  await h.asteapta({ et: "Don't Save" }, 3000);
  await h.buton('Save');
  await pauza(300);
  s = await h.st();
  if (await h.exista({ tinte: ['camp:nume_fisier'] })) pb.push('Save a deschis o fereastra de salvare (fisierul are deja nume si loc)');
  if ((s.registre || []).some(r => /^Note clasa/.test(r))) pb.push('dupa Save registrul n-a fost inchis');
  await h.deschideFisier('Note clasa.xlsx');
  s = await h.st();
  if (!valoriOriunde(s, 'F1').includes('PROBA194')) pb.push('redeschis, Note clasa.xlsx nu are F1=PROBA194 (Save nu a ajuns in fisier)');
  // Don't Save: modificarea se pierde
  await h.celula('G1'); await p.keyboard.type('NU194'); await p.keyboard.press('Enter');
  await p.keyboard.press('Control+w');
  if (!(await h.asteapta({ et: "Don't Save" }, 3000))) pb.push('a doua modificare: Ctrl+W nu intreaba');
  else {
    await h.buton("Don't Save");
    await h.deschideFisier('Note clasa.xlsx');
    s = await h.st();
    if (valoriOriunde(s, 'G1').includes('NU194')) pb.push("Don't Save a salvat totusi G1");
  }
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'Cancel lasa deschis; Save scrie si inchide (redeschis: F1=PROBA194); Don\'t Save pierde G1' };
});

proba('excel-a-F197', 'Deschide un registru salvat (Ctrl+O › Browse › Documente › fisier › Open): registrul vine cu foile lui', async (p, h) => {
  const pb = [];
  await h.celula('F1'); await p.keyboard.type('PROBA197'); await p.keyboard.press('Enter');
  await h.apasa({ tinte: ['fila_foii_buton:Add Sheet'] });
  await h.salveazaCa('Proba197');
  const s0 = await h.st();
  if (!/^Proba197/.test(s0.registru_activ || '')) return { ok: false, d: 'pregatirea: Save As nu a dat Proba197.xlsx (activ: ' + s0.registru_activ + ')' };
  const foi0 = s0.foi;
  await h.inchideRegistru();
  await h.deschideFisier('Proba197.xlsx');
  const s = await h.st();
  if (!/^Proba197/.test(s.registru_activ || '')) pb.push('dupa Open registrul activ e ' + s.registru_activ);
  else {
    if (JSON.stringify(s.foi) !== JSON.stringify(foi0)) pb.push('foile ' + JSON.stringify(s.foi) + ', salvate erau ' + JSON.stringify(foi0));
    if (valoareDin(s, foi0[0], 'F1') !== 'PROBA197') pb.push('foaia ' + foi0[0] + ' nu are F1=PROBA197');
    const file = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-tinta^="fila_foii"]')].filter(e => e.getBoundingClientRect().width > 0 && !/buton/.test(e.getAttribute('data-lh-tinta'))).map(e => e.innerText.trim()));
    if (!foi0.every(f => file.includes(f))) pb.push('filele de pe ecran: ' + file.join(', '));
  }
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'Proba197.xlsx redeschis cu foile ' + foi0.join(', ') + ' si F1=PROBA197' };
});

// ---------------------------------------------------------------- Sortare
proba('excel-b-F005', 'Sortarea muta formulele cu randul lor, cu adresele randului nou (=G2*H2 dus pe randul 4 devine =G4*H4)', async (p, h) => {
  // tabelul lectiei m2-l12 (A:D) mutat in F:I, langa datele de pornire ale poligonului (coloana E goala le desparte)
  await h.scrieColoana('F1', ['Produs', 'Caiet', 'Pix', 'Rigla', 'Guma', 'Carte']);
  await h.scrieColoana('G1', ['Pret', '5', '3', '4', '2', '20']);
  await h.scrieColoana('H1', ['Cant', '2', '1', '5', '3', '1']);
  await h.scrieColoana('I1', ['Total', '=G2*H2', '=G3*H3', '=G4*H4', '=G5*H5', '=G6*H6']);
  const pret = { Caiet: [5, 2], Pix: [3, 1], Rigla: [4, 5], Guma: [2, 3], Carte: [20, 1] };
  await h.celula('I3');
  await h.apasa({ tinte: ['fila:Data'] });
  await h.apasa({ mso: 'SortDescendingExcel' }, 'nu gasesc Data › Sort Z to A');
  await pauza(300);
  const s = await h.st(), c = s.celule || {};
  const pb = [];
  const tot = [];
  for (let r = 2; r <= 6; r++) {
    const n = (c['F' + r] || {}).valoare, g = (c['G' + r] || {}).valoare, q = (c['H' + r] || {}).valoare, i = c['I' + r] || {};
    const f = String(i.formula || '').replace(/\s+/g, '').toUpperCase();
    if (f !== `=G${r}*H${r}`) pb.push(`I${r} are ${i.formula || '(fara formula)'} (asteptat =G${r}*H${r})`);
    if (i.valoare !== g * q) pb.push(`I${r}=${i.valoare}, dar G${r}*H${r}=${g * q}`);
    if (!pret[n] || pret[n][0] !== g || pret[n][1] !== q) pb.push(`randul ${r} (${n}) are pret/cantitate ${g}/${q}`);
    tot.push(i.valoare);
  }
  if (((c.F1 || {}).valoare) !== 'Produs') pb.push('antetul a fost sortat printre date');
  if (tot.some((v, k) => k && v > tot[k - 1])) pb.push('Totalul nu e descrescator: ' + tot.join(','));
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'dupa Sort Z to A pe Total: ' + tot.join(',') + ', fiecare I = G*H al randului sau' };
});

// Regula Excelului real (masurata pe 8 tabele de simulatorul vechi, excelx-sortare.js:108-113): antet daca, intr-o coloana,
// primul rand e text peste numar; sau MAJUSCULE peste nemajuscule; sau scris altfel (aldin, cursiv, subliniat, umplere,
// culoare) decat randul de dedesubt, in ORICE coloana a zonei. O lista numai de texte, fara diferente, nu are antet.
proba('excel-b-F007', 'Randul de antet ghicit ca in Excel (MAJUSCULE, cursiv, umplere, aldin in alta coloana decat prima; lista numai de texte = fara antet)', async (p, h) => {
  const nume = ['Radu', 'Ana'];
  await h.scrieColoana('F1', ['Nume', ...nume]);      // a: doar text, fara diferente -> fara antet
  await h.scrieColoana('H1', ['NUME', ...nume]);      // b: majuscule peste text
  await h.scrieColoana('J1', ['Nume', ...nume]);      // c: cursiv
  await h.scrieColoana('L1', ['nume', ...nume]);      // d: aldin doar in a doua coloana a zonei L:M
  await h.scrieColoana('M1', ['oras', 'Iasi', 'Cluj']);
  await h.scrieColoana('O1', ['Nume', ...nume]);      // e: umplere (Fill Color)
  await h.celula('J1'); await h.apasa({ tinte: ['panglica:Home/Font/Italic'] });
  await h.celula('M1'); await h.apasa({ tinte: ['panglica:Home/Font/Bold'] });
  await h.celula('O1'); await h.apasa({ tinte: ['panglica:Home/Font/Fill Color'] });
  await h.apasa({ tinte: ['fila:Data'] });
  for (const a of ['F2', 'H2', 'J2', 'L2', 'O2']) { await h.celula(a); await h.apasa({ mso: 'SortAscendingExcel' }, 'nu gasesc Data › Sort A to Z'); await pauza(120); }
  const s = await h.st(), c = s.celule || {};
  const col = k => [1, 2, 3].map(r => (c[k + r] || {}).valoare).join(',');
  const asteptat = { F: 'Ana,Nume,Radu', H: 'NUME,Ana,Radu', J: 'Nume,Ana,Radu', L: 'nume,Ana,Radu', O: 'Nume,Ana,Radu' };
  const cazuri = { F: 'lista numai de texte (fara antet)', H: 'MAJUSCULE', J: 'cursiv', L: 'aldin in coloana a doua', O: 'umplere' };
  const pb = Object.keys(asteptat).filter(k => col(k) !== asteptat[k]).map(k => `${cazuri[k]}: ${col(k)} (asteptat ${asteptat[k]})`);
  if (col('M') !== 'oras,Cluj,Iasi' && !pb.some(x => x.startsWith('aldin'))) pb.push('coloana M nu a mers cu L: ' + col('M'));
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'toate cele cinci cazuri ca in Excel' };
});

// ---------------------------------------------------------------- Stiluri
// Excel real (tema Office): Title = 18 pt (font de titluri); Good = umplere #C6EFCE, litere #006100; Normal scoate stilul.
proba('excel-a-F131', 'Cell Styles: Title pe A1 (aici F1), Good pe G1; Normal scoate stilul', async (p, h) => {
  const pb = [];
  await h.celula('F1'); await p.keyboard.type('Raport'); await p.keyboard.press('Enter');
  await h.celula('G1'); await p.keyboard.type('Bine'); await p.keyboard.press('Enter');
  const aspect = a => p.evaluate(a => {
    const c = document.querySelector(`[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${a}"], [data-lh-aplicatie="excel"] [data-lh-tinta="celula:${a}"]`);
    if (!c) return null;
    const toate = [c, ...c.querySelectorAll('*')].filter(e => e.tagName !== 'TEXTAREA' && e.tagName !== 'INPUT');
    const marime = Math.max(...toate.filter(e => (e.innerText || '').trim()).map(e => parseFloat(getComputedStyle(e).fontSize) || 0));
    const fundaluri = toate.map(e => getComputedStyle(e).backgroundColor).filter(b => b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent');
    const culori = toate.filter(e => (e.innerText || '').trim()).map(e => getComputedStyle(e).color);
    return { marime, fundaluri, culori };
  }, a);
  const a0 = await aspect('F1');
  const stil = async (cel, nume) => {
    await h.celula(cel);
    await h.apasa({ tinte: ['meniu_derulant:Home/Styles/Cell Styles', 'panglica:Home/Styles/Cell Styles'] }, 'nu gasesc Home › Cell Styles');
    await pauza(250);
    // „Normal” e si butonul de vedere din bara de stare: il exclud
    const inGalerie = { et: nume, fara: '^(fila|panglica|bara_titlu|bara_stare|zoom|acces_rapid|backstage|celula):' };
    if (!(await h.exista({ tinte: ['meniu:' + nume] })) && !(await h.exista(inGalerie))) {
      const mesaj = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-nesimulat]')].map(e => e.innerText).join(' '));
      throw new Error('galeria Cell Styles nu arata stilul „' + nume + '”' + (mesaj ? '; pe ecran: ' + mesaj : ''));
    }
    if (await h.exista({ tinte: ['meniu:' + nume] })) await h.apasa({ tinte: ['meniu:' + nume] });
    else await h.apasa(inGalerie);
    await pauza(200);
  };
  try {
    await stil('F1', 'Title');
    const a1 = await aspect('F1');
    if (!(a1.marime > a0.marime * 1.4)) pb.push(`Title: marimea literelor ${a0.marime}px -> ${a1.marime}px (Title = 18 pt fata de 11 pt)`);
    await stil('G1', 'Good');
    const g1 = await aspect('G1');
    if (!g1.fundaluri.some(b => /rgb\(198, 239, 206\)/.test(b))) pb.push('Good: umplerea nu e #C6EFCE (' + g1.fundaluri.join(',') + ')');
    if (!g1.culori.some(b => /rgb\(0, 97, 0\)/.test(b))) pb.push('Good: literele nu sunt #006100 (' + g1.culori.join(',') + ')');
    await stil('F1', 'Normal');
    const a2 = await aspect('F1');
    if (Math.abs(a2.marime - a0.marime) > 0.5) pb.push(`Normal: marimea a ramas ${a2.marime}px (inainte ${a0.marime}px)`);
  } catch (e) { pb.push(e.message); }
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'Title mareste literele, Good pune verde, Normal le scoate' };
});

// ---------------------------------------------------------------- Strat de exercitiu (nu e aplicatie)
skip('excel-b-F129', 'Testele numite ale atelierului, bifate pe loc', 'tine de lectie/motor (bifele de deasupra foii); aplicatia da doar stare(), pe care lectia isi face testele');
skip('excel-b-F130', 'Mesajele la „Verifica” care spun cauza', 'mesajele lui Verifica sunt ale lectiei; aplicatia nu are buton Verifica');
skip('excel-b-F131', 'Proba cu punctaj (lectia 13)', 'punctaj, nota, nivel, salvarea rezultatului, „Sunt alt elev” = motorul lectiei, nu Excelul');
skip('excel-b-F132', 'Itemul de alegere cu explicatie din proba', 'item de lectie (alegere + de ce), nu exista in Excel');
skip('excel-b-F134', 'Foaia libera cu raspuns de ales („incearca singur”)', 'foaia e deja libera in biblioteca; alegerea raspunsului e a lectiei');

// Partea aplicatiei: fiecare gest cerut de exercitii trebuie sa ajunga in evenimentele lh-aplicatie cu un nume care il
// deosebeste (§4 din api_biblioteca.md). Daca exista -> SKIP (restul, „Verifica” cu cerinta de gest, e al lectiei).
proba('excel-b-F135', 'Verificarea gestului cerut (ctrl-d, f4, umple, clic-adresa, autocompletare, copiere, sortare-dlg, doarMouse)', async (p, h) => {
  const pb = [], vazut = {};
  const cauta = (ev, f) => ev.find(e => f(e) && e.actiune && !/^(nesimulat|fara_efect)$/.test(e.actiune));
  const pas = async (cheie, joc, f) => { await h.marcaj(); await joc(); const ev = await h.evenimente(); const e = cauta(ev, f); if (e) vazut[cheie] = e.gest + '/' + e.actiune; else pb.push(cheie + ': niciun eveniment potrivit (' + ev.map(x => x.gest + '/' + x.actiune).join(', ') + ')'); };
  await pas('ctrl-d', async () => { await h.celula('G1'); await p.keyboard.type('5'); await p.keyboard.press('Enter'); await p.keyboard.press('ArrowUp'); await p.keyboard.press('Shift+ArrowDown'); await p.keyboard.press('Shift+ArrowDown'); await p.keyboard.press('Control+d'); await pauza(150); }, e => e.gest === 'ctrl_d');
  await pas('f4', async () => { await h.celula('H1'); await p.keyboard.type('=B2'); await p.keyboard.press('F4'); await p.keyboard.press('Enter'); }, e => e.gest === 'tasta_f4');
  await pas('clic-adresa', async () => { await h.celula('H2'); await p.keyboard.type('='); await h.celula('B3'); await p.keyboard.press('Enter'); }, e => e.gest === 'clic' && /B3/.test(e.tinta || '') && e.actiune !== 'selectare_celula');
  await pas('autocompletare', async () => { await h.celula('H3'); await p.keyboard.type('=SUM'); await pauza(150); await p.keyboard.press('Tab'); await p.keyboard.type('B2:B4)'); await p.keyboard.press('Enter'); }, e => e.gest === 'tasta_tab');
  await pas('umple', async () => {
    await h.celula('H1');
    const m = await gaseste(p, { tinte: ['maner_umplere'] }), t = await gaseste(p, { tinte: ['celula:H4'] });
    if (!m || !t) throw new Error('manerul de umplere nu e pe ecran');
    await p.mouse.move(m.x, m.y); await p.mouse.down(); await p.mouse.move(t.x, t.y, { steps: 6 }); await p.mouse.up(); await pauza(200);
  }, e => e.gest === 'umplere_tragere');
  await pas('copiere (tasta)', async () => { await h.celula('B2'); await p.keyboard.press('Control+c'); }, e => e.gest === 'ctrl_c');
  await pas('copiere (doarMouse, panglica)', async () => { await h.celula('B3'); await h.apasa({ tinte: ['panglica:Home/Clipboard/Copy'] }); }, e => e.gest === 'clic_comanda_panglica' && /Copy/.test(e.tinta || ''));
  await p.keyboard.press('Escape');
  let butonSort = null;
  await pas('sortare (buton)', async () => { await h.celula('A3'); await h.apasa({ tinte: ['fila:Data'] }); await h.apasa({ mso: 'SortAscendingExcel' }); }, e => { if (/Sort A to Z|SortAscending/.test(e.tinta || '')) { butonSort = e.actiune; return true; } return false; });
  await pas('sortare-dlg', async () => { await h.celula('A2'); await h.apasa({ mso: 'SortDialog' }, 'nu gasesc Data › Sort...'); await h.asteapta({ et: 'OK' }, 2000); await h.buton('OK'); }, e => /OK/.test(e.tinta || e.activat || '') && e.actiune !== butonSort);
  if (pb.length) return { ok: false, d: 'partea aplicatiei lipseste: ' + pb.join('; ') };
  return { skip: true, d: 'Verifica cu cerinta de gest e a lectiei; partea aplicatiei exista - evenimente: ' + Object.entries(vazut).map(([k, v]) => k + '=' + v).join(', ') };
});

// ---------------------------------------------------------------- Tipuri de date
// Setarile regionale ale laboratorului = romanesti (dd.mm.yyyy); Excel primeste si / si - ca separator si forma ISO.
proba('excel-a-F007', 'Data intreaga (27.09.2026, 27/09/2026, 27-09-2026, 2026-09-27) e recunoscuta drept data', async (p, h) => {
  const forme = ['27.09.2026', '27/09/2026', '27-09-2026', '2026-09-27'];
  await h.scrieColoana('F1', forme);
  const s = await h.st(), pb = [];
  forme.forEach((f, i) => { const c = (s.celule || {})['F' + (i + 1)] || {}; if (c.valoare !== 46292) pb.push(`${f} -> ${JSON.stringify(c.valoare)} (asteptat data 46292)`); });
  // in Excel coloana standard se lateste la data scrisa; nu apare ########
  const t1 = await h.textCelula('F1');
  if (/^#+$/.test(t1 || '')) pb.push('27.09.2026 apare „' + t1 + '” pe ecran (coloana nu se lateste)');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'toate patru = 46292; pe ecran ' + t1 };
});

proba('excel-a-F008', 'Data cu luna in cuvinte (12 octombrie 2026, oct 2026) e recunoscuta drept data', async (p, h) => {
  await h.scrieColoana('F1', ['12 octombrie 2026', 'oct 2026']);
  const s = await h.st(), c = s.celule || {}, pb = [];
  if ((c.F1 || {}).valoare !== 46307) pb.push(`„12 octombrie 2026” -> ${JSON.stringify((c.F1 || {}).valoare)} (asteptat data 46307)`);
  if ((c.F2 || {}).valoare !== 46296) pb.push(`„oct 2026” -> ${JSON.stringify((c.F2 || {}).valoare)} (asteptat 01.10.2026 = 46296)`);
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'ambele recunoscute ca date' };
});

// Excel real: '007 ramane text „007”; regula de verificare a erorilor pune triunghiul verde in coltul celulei, iar la
// selectare apare butonul de avertizare cu „Number Stored as Text” (Convert to Number, Ignore Error...).
proba('excel-a-F010', "'007 ramane text „007”, cu triunghiul verde (Number Stored as Text)", async (p, h) => {
  const pb = [];
  await h.celula('F1'); await p.keyboard.type("'007"); await p.keyboard.press('Enter');
  const c = ((await h.st()).celule || {}).F1 || {};
  if (c.valoare !== '007') pb.push('valoarea e ' + JSON.stringify(c.valoare) + ' (asteptat textul "007")');
  if ((await h.textCelula('F1')) !== '007') pb.push('pe ecran F1 arata „' + (await h.textCelula('F1')) + '”');
  // triunghiul: ceva verde in coltul stanga-sus al celulei
  const tri = await p.evaluate(() => {
    const c = document.querySelector('[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="F1"], [data-lh-aplicatie="excel"] [data-lh-tinta="celula:F1"]');
    const r = c.getBoundingClientRect();
    // o culoare verde intr-un sir CSS (culoare simpla sau rgb() dintr-un gradient)
    const ver = s => (String(s || '').match(/rgba?\([^)]*\)/g) || []).some(x => { const [R, G, B, A] = (x.match(/[\d.]+/g) || []).map(Number); return A !== 0 && G > 90 && G > R + 40 && G > B + 25; });
    const culori = cs => [cs.backgroundColor, cs.backgroundImage, cs.borderTopColor, cs.borderLeftColor, cs.color, cs.fill];
    const mic = [...document.querySelectorAll('[data-lh-aplicatie="excel"] *')].some(e => {   // element mic in colt (div, svg)
      const q = e.getBoundingClientRect();
      if (q.width < 1 || q.height < 1 || q.width > 20 || q.height > 20) return false;
      if (q.left > r.left + 12 || q.top > r.top + 12 || q.right < r.left - 2 || q.bottom < r.top - 2) return false;
      return culori(getComputedStyle(e)).some(ver);
    });
    const inCelula = [c, ...c.querySelectorAll('*')].some(e => {                               // gradient sau ::before/::after
      if (ver(getComputedStyle(e).backgroundImage)) return true;
      return ['::before', '::after'].some(ps => { const cs = getComputedStyle(e, ps); return cs.content !== 'none' && culori(cs).some(ver); });
    });
    return mic || inCelula;
  });
  if (!tri) pb.push('niciun triunghi verde in coltul lui F1');
  // sfatul: la selectarea celulei, butonul de avertizare -> „Number Stored as Text”
  await p.keyboard.press('ArrowUp'); await pauza(300);
  let sfat = /Number Stored as Text|preceded by an apostrophe/i.test(await h.text());
  if (!sfat) {
    const g = await gaseste(p, { etRe: 'error|stored as text|apostrophe|warning|trace', fara: '^(fila|panglica|meniu_derulant|acces_rapid|backstage|bara_stare|bara_titlu):' });
    if (g) { await h.clicLa(g, 'avertizare'); await pauza(250); }
    sfat = /Number Stored as Text|preceded by an apostrophe/i.test(await h.text())
      || await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [title], [data-lh-aplicatie="excel"] [aria-label], [data-lh-aplicatie="excel"] [data-lh-eticheta]')].some(e => /Number Stored as Text|preceded by an apostrophe/i.test([e.title, e.getAttribute('aria-label'), e.getAttribute('data-lh-eticheta')].join(' ')) && e.getBoundingClientRect().width > 0));
  }
  if (!sfat) pb.push('la selectarea lui F1 nu se ajunge la „Number Stored as Text” (nici buton de avertizare, nici sfat)');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'text 007, triunghi verde, Number Stored as Text' };
});

// Excel real (RO): 7.5 = 7 mai (forma dd.mmm); 7,5 scris peste ea = numarul 7,5 aratat ca data = 07.ian (ziua 7 din 1900,
// cu 29.02.1900 numarat, ca in Excel). Simulatorul vechi dadea tot 07.ian.
proba('excel-a-F015', 'Forma de data ramane: 7,5 scris peste 07.mai arata 07.ian', async (p, h) => {
  await h.celula('F1'); await p.keyboard.type('7.5'); await p.keyboard.press('Enter');
  const t0 = await h.textCelula('F1');
  await p.keyboard.press('ArrowUp'); await p.keyboard.type('7,5'); await p.keyboard.press('Enter');
  const c = ((await h.st()).celule || {}).F1 || {}, t1 = await h.textCelula('F1'), pb = [];
  if (!/^0?7\.mai/i.test(t0 || '')) pb.push('7.5 arata „' + t0 + '” (asteptat 07.mai)');
  if (c.valoare !== 7.5) pb.push('valoarea dupa 7,5 = ' + JSON.stringify(c.valoare));
  if (!/^0?7[.\-]ian/i.test(t1 || '')) pb.push('7,5 peste 07.mai arata „' + t1 + '” (asteptat 07.ian)');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: '07.mai, apoi ' + t1 };
});

proba('excel-a-F016', 'Delete goleste doar continutul: forma de data ramane (8.5, Delete, 8,5 -> 08.ian)', async (p, h) => {
  await h.celula('F1'); await p.keyboard.type('8.5'); await p.keyboard.press('Enter');
  await p.keyboard.press('ArrowUp'); await p.keyboard.press('Delete'); await pauza(150);
  const gol = ((await h.st()).celule || {}).F1, tGol = await h.textCelula('F1');
  await p.keyboard.type('8,5'); await p.keyboard.press('Enter');
  const t1 = await h.textCelula('F1'), pb = [];
  if ((gol && gol.valoare != null && gol.valoare !== '') || tGol) pb.push('dupa Delete F1 nu e goala (' + JSON.stringify(gol) + ')');
  if (!/^0?8[.\-]ian/i.test(t1 || '')) pb.push('8,5 dupa Delete arata „' + t1 + '” (asteptat 08.ian)');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'Delete a golit, forma a ramas: ' + t1 };
});

proba('excel-a-F018', 'Clear All (Home › Clear ▾ › Clear All) goleste continutul si scoate forma celulei', async (p, h) => {
  await h.celula('F1'); await p.keyboard.type('8.5'); await p.keyboard.press('Enter');
  await p.keyboard.press('ArrowUp'); await pauza(100);
  await h.apasa({ tinte: ['meniu_derulant:Home/Editing/Clear', 'panglica:Home/Editing/Clear'] }, 'nu gasesc Home › Clear');
  await pauza(250);
  if (!(await h.exista({ tinte: ['meniu:Clear All'] })) && !(await h.exista({ et: 'Clear All' }))) {
    const mesaj = await p.evaluate(() => [...document.querySelectorAll('[data-lh-aplicatie="excel"] [data-lh-nesimulat]')].map(e => e.innerText).join(' '));
    return { ok: false, d: 'meniul Clear nu are „Clear All”' + (mesaj ? '; pe ecran: ' + mesaj : '') };
  }
  await h.apasa((await h.exista({ tinte: ['meniu:Clear All'] })) ? { tinte: ['meniu:Clear All'] } : { et: 'Clear All' });
  const s0 = await h.st(), t0 = await h.textCelula('F1'), pb = [];
  if (((s0.celule || {}).F1 || {}).valoare != null || t0) pb.push('dupa Clear All F1 nu e goala');
  if ((s0.format_celule || {}).F1) pb.push('dupa Clear All F1 are inca forma ' + JSON.stringify(s0.format_celule.F1));
  await p.keyboard.type('8,5'); await p.keyboard.press('Enter');
  const t1 = await h.textCelula('F1'), c1 = ((await h.st()).celule || {}).F1 || {};
  if (c1.valoare !== 8.5 || !/^8[,.]5$/.test(t1 || '')) pb.push('8,5 dupa Clear All arata „' + t1 + '” (asteptat 8,5, numar, fara forma de data)');
  return pb.length ? { ok: false, d: pb.join('; ') } : { ok: true, d: 'golita si fara forma; 8,5 arata ' + t1 };
});

// ---------------------------------------------------------------- Verificare (exercitiu)
// Partea aplicatiei: stare() da textul formulei, deci lectia poate deosebi =SUM(...) de =B2+B3+B4 la acelasi rezultat.
proba('excel-a-F230', 'Exercitiul verifica functia FOLOSITA (rezultatul bun cu alta functie nu trece)', async (p, h) => {
  await h.celula('F2'); await p.keyboard.type('=SUM(B2:B4)'); await p.keyboard.press('Enter');
  await h.celula('G2'); await p.keyboard.type('=B2+B3+B4'); await p.keyboard.press('Enter');
  const c = (await h.st()).celule || {}, f = c.F2 || {}, g = c.G2 || {};
  const ok = /^=SUM\(/i.test(f.formula || '') && g.formula && !/SUM/i.test(g.formula) && f.valoare === g.valoare && f.valoare === 24;
  if (!ok) return { ok: false, d: 'partea aplicatiei lipseste: stare() nu deosebeste functia folosita (F2=' + JSON.stringify(f) + ', G2=' + JSON.stringify(g) + ')' };
  return { skip: true, d: 'verificatorul („aici se cere functia SUM”) e al lectiei; partea aplicatiei exista: stare().celule[..].formula = ' + f.formula + ' / ' + g.formula };
});
skip('excel-a-F231', 'Testele atelierului trec doar cand formula da bine si pe datele schimbate (+3, +6, +9)', 'logica lectiei (bifele atelierului); biblioteca nu da un calcul public al formulei pe alte date, dar asta e un API cerut de lectie, nu un gest - nu se poate proba jucand');
skip('excel-a-F232', 'Sub testul nebifat apare MOTIVUL (apostrof, lipseste =, numar scris de mana...)', 'motivele de sub teste sunt ale lectiei; aplicatia are doar mesajele Excelului (motivFormula), nu teste');

proba('excel-a-F233', 'Exercitiul stie daca elevul a folosit Σ (autosum) sau manerul de umplere (umple)', async (p, h) => {
  const pb = [], vazut = [];
  await h.marcaj();
  await h.celula('B5');
  await h.apasa({ tinte: ['panglica:Home/Editing/AutoSum'] }, 'nu gasesc Home › AutoSum');
  await p.keyboard.press('Enter'); await pauza(150);
  let ev = await h.evenimente();
  const es = ev.find(e => /AutoSum/.test(e.tinta || '') && e.actiune && !/^(nesimulat|fara_efect)$/.test(e.actiune));
  const b5 = ((await h.st()).celule || {}).B5 || {};
  if (!es) pb.push('Σ nu da niciun eveniment cu actiune (' + ev.map(e => e.gest + '/' + e.actiune).join(', ') + ')'); else vazut.push('Σ=' + es.actiune);
  if (!/^=SUM\(B2:B4\)$/i.test(String(b5.formula || '').replace(/\s/g, ''))) pb.push('Σ sub B2:B4 a pus ' + JSON.stringify(b5));
  await h.marcaj();
  await h.celula('F2'); await p.keyboard.type('=B2*2'); await p.keyboard.press('Enter'); await p.keyboard.press('ArrowUp'); await pauza(150);
  const m = await gaseste(p, { tinte: ['maner_umplere'] }), t = await gaseste(p, { tinte: ['celula:F4'] });
  if (!m || !t) pb.push('manerul de umplere nu e pe ecran');
  else {
    await p.mouse.move(m.x, m.y); await p.mouse.down(); await p.mouse.move(t.x, t.y, { steps: 6 }); await p.mouse.up(); await pauza(200);
    ev = await h.evenimente();
    const eu = ev.find(e => e.gest === 'umplere_tragere' && e.actiune && !/^(nesimulat|fara_efect)$/.test(e.actiune));
    if (!eu) pb.push('tragerea manerului nu da evenimentul umplere_tragere'); else vazut.push('maner=' + eu.actiune);
    const f4 = ((await h.st()).celule || {}).F4 || {};
    if (String(f4.formula || '').replace(/\s/g, '').toUpperCase() !== '=B4*2') pb.push('umplerea a dat F4=' + JSON.stringify(f4));
  }
  if (pb.length) return { ok: false, d: 'partea aplicatiei lipseste: ' + pb.join('; ') };
  return { skip: true, d: 'tinerea minte in test e a lectiei; partea aplicatiei exista - evenimente ' + vazut.join(', ') };
});

// ================================================================== rularea
async function ruleaza(browser, base, pr) {
  if (!pr.fn) { scrie('SKIP', pr.id, pr.nume, pr.motiv); return; }
  let deschis = null, ceas = null, gata = false;
  const t0 = Date.now();
  try {
    const lucru = (async () => {
      deschis = await deschide(browser, base, pr.mobil);
      if (gata) { await deschis.ctx.close().catch(() => {}); return null; }
      return pr.fn(deschis.p, unelte(deschis.p));
    })();
    const limita = new Promise((_, rej) => { ceas = setTimeout(() => rej(new Error('timp depasit (' + LIMITA_PROBA / 1000 + ' s)')), LIMITA_PROBA); });
    const r = await Promise.race([lucru, limita]);
    const er = deschis && deschis.erori.length ? ' [erori in pagina: ' + deschis.erori.slice(0, 2).join(' | ') + ']' : '';
    const sec = ' (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)';
    if (r && r.skip) scrie('SKIP', pr.id, pr.nume, r.d + er + sec);
    else if (r && r.ok) scrie('PASS', pr.id, pr.nume, r.d + er + sec);
    else scrie('FAIL', pr.id, pr.nume, (r ? r.d : 'proba nu a intors nimic') + er + sec);
  } catch (e) {
    scrie('FAIL', pr.id, pr.nume, 'proba a crapat: ' + String(e.message || e).split('\n')[0] + ' (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
  } finally {
    gata = true;
    clearTimeout(ceas);
    if (deschis) await deschis.ctx.close().catch(() => {});
  }
}

async function main() {
  const t0 = Date.now();
  const doar = process.argv.slice(2);                                    // optional: id-uri, pentru depanare
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const pr of PROBE) if (!doar.length || doar.includes(pr.id)) await ruleaza(browser, base, pr);
  } finally {
    await browser.close().catch(() => {});
    srv.close();
  }
  console.log(`DURATA ${((Date.now() - t0) / 1000).toFixed(0)} s, ${PROBE.filter(x => !doar.length || doar.includes(x.id)).length} probe`);
  console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL} SKIP=${rezultate.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rezultate.FAIL));
}

main().catch(e => {
  console.log('FAIL harness - ' + e.message);
  console.log(`REZUMAT PASS=${rezultate.PASS} FAIL=${rezultate.FAIL + 1} SKIP=${rezultate.SKIP}`);
  console.log('TOTAL FAIL');
  console.log(String(rezultate.FAIL + 1));
});
