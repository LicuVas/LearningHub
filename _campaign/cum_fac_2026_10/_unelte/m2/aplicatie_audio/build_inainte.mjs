// Construirea secțiunii „Cum fac…?” (contract: _campaign/cum_fac_2026_10/contract.md, R2, I8).
//
//   node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs                 # _sursa/fise_*.json -> date.js
//   node .../build.mjs --fise C:/00/Projects/LearningHub/cum-fac/_teste/_exemplu   # alt folder de fișe (probă)
//   node .../build.mjs --verifica            # NU scrie nimic: validează + compară pașii-sursă cu amprentele
//   node .../build.mjs --extrage [...]       # întâi re-extrage lecțiile (scrie DOAR în _campaign/.../digest/)
//   node .../build.mjs --accepta <id>|toate  # fișa a fost re-verificată după schimbarea lecției: amprenta nouă
//
// Ce scrie (fără --verifica):
//   cum-fac/date.js                      window.CUM_FAC_DATE = {versiune, fise, sensuri} — fișele VALIDE + dicționarul
//   cum-fac/_teste/catalog_titluri.json  doar id, aplicatie, titlu, clasa (pentru scriitorii seturilor de test)
//   <folderul fișelor>/amprente.json     pentru fiecare fișă: lecția, pasul și sha1 al textului pasului-sursă din digest
// Formulările în plus <folderul fișelor>/formulari_extra_*.json ({id: [formulări]}, doar pentru căutare) intră în
// date.js în câmpul „fx” al fișei: normalizate, fără dubluri, legate cu „|” (cautare.js le indexează separat).
// Glosarul _sursa/termeni.json (opțional; --termeni <fișier>) intră în date.js; pagina arată la „Cuvinte de știut”
// fisa.termeni + termenii glosarului găsiți în pașii fișei. Dacă lipsește, build-ul merge mai departe fără el.
// Amprenta veche NU se suprascrie când pasul-sursă s-a schimbat: fișa rămâne semnalată până o re-verifică cineva
// și rulează --accepta (altfel orice build ar șterge semnalul). Fișă nouă sau sursă mutată -> amprentă nouă.
//
// Ultima linie = numărul de probleme: fișe invalide (+ fișiere stricate, + dicționar stricat) + fișe al căror
// pas-sursă s-a schimbat față de amprentă (+ fișe fără amprentă, la --verifica). Contract: selfcheck.py.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { valideaza, incarcaDigest } from './valideaza_fise.mjs';
const Cautare = createRequire(import.meta.url)('../cautare.js');   // aceeași potrivire a termenilor ca în pagină

const L = 'C:/00/Projects/LearningHub';
const CF = path.join(L, 'cum-fac');
const EXTRAGE = path.join(L, '_campaign/cum_fac_2026_10/_unelte/extrage_lectii.mjs');

const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? (arg[i + 1] || '') : null; };
const VERIFICA = arg.includes('--verifica');
const FOLDER = path.resolve(opt('--fise') || path.join(CF, '_sursa'));
const SENSURI = path.resolve(opt('--sensuri') || path.join(CF, '_sursa/sensuri.json'));
const ACCEPTA = opt('--accepta');
const TERMENI = path.resolve(opt('--termeni') || path.join(CF, '_sursa/termeni.json'));
const AMPRENTE = path.join(FOLDER, 'amprente.json');

const probleme = [];   // fiecare intră în numărul final
const info = [];
const P = m => probleme.push(m);

// 0) re-extragerea lecțiilor (opțional)
if (arg.includes('--extrage')) {
  const r = spawnSync(process.execPath, [EXTRAGE], { encoding: 'utf8' });
  const linii = String(r.stdout || '').trim().split(/\r?\n/);
  const erori = parseInt(linii[linii.length - 1], 10);
  if (r.status !== 0 || !(erori === 0)) P(`extrage_lectii.mjs: ieșire ${r.status}, ultima linie „${linii[linii.length - 1]}” ${String(r.stderr || '').slice(0, 200)}`);
  else info.push(`lecțiile re-extrase (${linii.length > 1 ? linii[linii.length - 2] : 'ok'})`);
}

// 1) dicționarul de sensuri
let sensuri = null;
try { sensuri = JSON.parse(fs.readFileSync(SENSURI, 'utf8')); } catch (e) { P(`sensuri.json: nu se citește: ${e.message}`); }
if (sensuri) {
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const stop = new Set((sensuri.umplutura || []).map(norm));
  for (const w of sensuri.nu_sunt_umplutura || []) if (stop.has(norm(w))) P(`sensuri.json: „${w}” schimbă sensul, nu are voie în umplutură`);
  const ids = new Set();
  for (const g of sensuri.grupuri || []) {
    if (!g.id || !Array.isArray(g.cuvinte) || !g.cuvinte.length) P(`sensuri.json: grup fără id sau fără cuvinte: ${JSON.stringify(g).slice(0, 80)}`);
    else if (ids.has(g.id)) P(`sensuri.json: grupul „${g.id}” apare de două ori`);
    ids.add(g.id);
    if (g.aplicatie && !['excel', 'word', 'powerpoint', 'windows', 'web'].includes(g.aplicatie)) P(`sensuri.json: grupul „${g.id}” are aplicatie necunoscută „${g.aplicatie}”`);
    for (const w of g.cuvinte || []) if (stop.has(norm(w))) info.push(`sensuri.json: „${w}” (grupul ${g.id}) e și în umplutură, deci nu ajunge niciodată la grup`);
  }
  if (!sensuri.aplicatii || !sensuri.grupuri) P('sensuri.json: lipsesc „aplicatii” sau „grupuri”');
}

// 1b) glosarul termenilor (opțional)
let glosar = [];
if (fs.existsSync(TERMENI)) {
  let g = null;
  try { g = JSON.parse(fs.readFileSync(TERMENI, 'utf8')); } catch (e) { P(`termeni.json: nu se citește: ${e.message}`); }
  if (g && !Array.isArray(g)) P('termeni.json: trebuie să fie o listă de {t, forme, d, aplicatii, sursa}');
  else if (g) {
    const AP = ['excel', 'word', 'powerpoint', 'windows', 'web'];
    g.forEach((x, i) => {
      const rau = !x || typeof x.t !== 'string' || !x.t.trim() || typeof x.d !== 'string' || !x.d.trim()
        || (x.forme != null && !Array.isArray(x.forme)) || (x.aplicatii != null && (!Array.isArray(x.aplicatii) || x.aplicatii.some(a => !AP.includes(a))));
      if (rau) P(`termeni.json, intrarea ${i + 1} („${x && x.t}”): cere t, d (text), forme (listă), aplicatii (din ${AP.join(', ')})`);
      else glosar.push({ t: x.t, forme: x.forme || [], d: x.d, aplicatii: x.aplicatii || [], ...(x.sursa ? { sursa: x.sursa } : {}) });
    });
    info.push(`glosar: ${glosar.length} termeni din ${path.basename(TERMENI)}`);
  }
} else info.push(`glosar: ${path.basename(TERMENI)} lipsește încă; merg mai departe fără el`);

// 2) fișele: verificatorul comun (poarta R2)
const fisiere = fs.existsSync(FOLDER) ? fs.readdirSync(FOLDER).filter(n => /^fise_.*\.json$/.test(n)).sort().map(n => path.join(FOLDER, n)) : [];
if (!fisiere.length) P(`niciun fise_*.json în ${FOLDER}`);
const { fise, probleme: pv } = valideaza(fisiere, { toate: true });
const invalide = new Set();
for (const p of pv) {
  const m = /^(.+?) · (.+?): /.exec(p);
  if (m) invalide.add(m[2]); else P(p);           // fișier stricat: o problemă
  console.log('  PROBLEMĂ', p);
}
for (const id of invalide) P(`fișă invalidă: ${id}`);

// 3) amprentele pașilor-sursă (I8)
const strange = s => String(s || '').replace(/\s+/g, ' ').trim();
function textPas(d, pas) {   // ACELAȘI text în care verificatorul caută ancora (valideaza_fise.mjs)
  if (pas === 'real') return strange(((d.aplicatie_reala && d.aplicatie_reala.pasi) || []).join(' '));
  const p = d.pasi.find(x => x.id === pas);
  if (!p) return null;
  return strange([p.titlu, p.text, p.uite_cum, p.altfel, ...(p.incearca || []).flatMap(x => [x.cerinta, x.ajutor, x.de_ce])].join(' '));
}
const sha1 = s => crypto.createHash('sha1').update(s, 'utf8').digest('hex');
let vechi = {};
try { vechi = (JSON.parse(fs.readFileSync(AMPRENTE, 'utf8')).fise) || {}; } catch (e) { if (fs.existsSync(AMPRENTE)) P(`amprente.json stricat: ${e.message}`); }
const digest = incarcaDigest();
const noi = {};
let schimbate = 0;
for (const f of fise) {
  const s = f.sursa || {};
  const d = digest[s.cale];
  const t = d ? textPas(d, s.pas) : null;
  if (t == null) { if (vechi[f.id]) noi[f.id] = vechi[f.id]; continue; }   // sursa lipsă: o raportează verificatorul
  const acum = { cale: s.cale, pas: s.pas, sha1: sha1(t) };
  const v = vechi[f.id];
  if (!v) {
    if (VERIFICA) P(`fără amprentă: ${f.id} (rulează build.mjs)`);
    noi[f.id] = acum;
  } else if (v.cale !== acum.cale || v.pas !== acum.pas) {
    if (VERIFICA) P(`sursa s-a mutat: ${f.id} (${v.cale} ${v.pas} -> ${acum.cale} ${acum.pas}); rulează build.mjs`);
    noi[f.id] = acum;
  } else if (v.sha1 !== acum.sha1) {
    if (ACCEPTA === 'toate' || ACCEPTA === f.id) { noi[f.id] = acum; info.push(`amprentă acceptată: ${f.id}`); }
    else { noi[f.id] = v; schimbate++; P(`PAS-SURSĂ SCHIMBAT: ${f.id} — ${s.cale} ${s.pas} nu mai e textul din care s-a scris fișa; re-verifică fișa, apoi build.mjs --accepta ${f.id}`); }
  } else noi[f.id] = v;
}
for (const id of Object.keys(vechi)) if (!fise.some(f => f.id === id)) info.push(`amprentă fără fișă (se scoate la build): ${id}`);

// 3b) formulările în plus (_sursa/formulari_extra_*.json = {id_fișă: [formulări de copil]}): doar pentru căutare,
// pagina nu le arată. În date.js intră în câmpul „fx” al fișei, compact: normalizate (litere mici, fără diacritice și
// semne, exact ce face motorul oricum), fără dubluri (nici cu titlul, întrebarea și formulările fișei), legate cu „|”.
const extra = {};
const fisiereFx = fs.existsSync(FOLDER) ? fs.readdirSync(FOLDER).filter(n => /^formulari_extra_.*\.json$/.test(n)).sort() : [];
for (const n of fisiereFx) {
  let o = null;
  try { o = JSON.parse(fs.readFileSync(path.join(FOLDER, n), 'utf8')); } catch (e) { P(`${n}: nu se citește: ${e.message}`); continue; }
  if (!o || typeof o !== 'object' || Array.isArray(o)) { P(`${n}: trebuie să fie {id_fișă: [formulări]}`); continue; }
  for (const [id, l] of Object.entries(o)) {
    if (!Array.isArray(l) || l.some(x => typeof x !== 'string')) { P(`${n}, „${id}”: formulările trebuie să fie o listă de texte`); continue; }
    (extra[id] = extra[id] || []).push(...l);
  }
}

// 4) date.js: doar fișele valide; „înrudite” spre fișe scoase se taie
const valide = fise.filter(f => !invalide.has(f.id));
const okIds = new Set(valide.map(f => f.id));
const fxNecunoscute = Object.keys(extra).filter(id => !okIds.has(id));
let fxTotal = 0, fxPuse = 0;
const fxFisa = f => {
  const l = extra[f.id] || [];
  fxTotal += l.length;
  const vazute = new Set([f.titlu, f.intrebare, ...(f.formulari || [])].map(x => Cautare.normalizeaza(x)));
  const o = [];
  for (const x of l) {
    const n = Cautare.normalizeaza(x);
    if (!n || vazute.has(n)) continue;
    vazute.add(n); o.push(n);
  }
  fxPuse += o.length;
  return o.join('|');
};
const curata = f => {
  const o = {};
  for (const [k, v] of Object.entries(f)) if (k !== '_f') o[k] = v;
  o.sursa = { cale: f.sursa.cale, pas: f.sursa.pas, titlu_pas: f.sursa.titlu_pas || '' };
  o.inrudite = (f.inrudite || []).filter(id => okIds.has(id));
  const fx = fxFisa(f);
  if (fx) o.fx = fx;
  return o;
};
const sensuriPagina = sensuri ? Object.fromEntries(Object.entries(sensuri).filter(([k]) => k !== 'despre')) : {};
const continut = { fise: valide.map(curata), sensuri: sensuriPagina, termeni: glosar };
// evidența termenilor: cât adaugă glosarul și ce termeni ai altei aplicații apar în pași fără să fie explicați
if (glosar.length) {
  let cuGlosar = 0;
  const neacoperite = [];
  for (const f of valide) {
    if (Cautare.termeniFisa(f, glosar).some(x => x.din === 'glosar')) cuGlosar++;
    const n = Cautare.termeniNeacoperiti(f, glosar);
    if (n.length) neacoperite.push(`${f.id} (${n.join(', ')})`);
  }
  info.push(`glosar: ${cuGlosar} fișe primesc termeni din glosar; ${neacoperite.length} fișe au în pași termeni ai glosarului (ai altei aplicații) nici în fisa.termeni, nici acoperiți de glosarul aplicației lor${neacoperite.length ? ': ' + neacoperite.slice(0, 15).join('; ') + (neacoperite.length > 15 ? ' …' : '') : ''}`);
}
if (fisiereFx.length) info.push(`formulări în plus: ${fxPuse} puse în date.js (din ${fxTotal} pentru fișele valide; restul dubluri), din ${fisiereFx.join(', ')}`
  + (fxNecunoscute.length ? `; ${fxNecunoscute.length} id-uri fără fișă validă, sărite: ${fxNecunoscute.slice(0, 10).join(', ')}` : ''));
const versiune = sha1(JSON.stringify(continut)).slice(0, 12);
const dateJs = '/* GENERAT de cum-fac/_build/build.mjs din cum-fac/_sursa/fise_*.json + sensuri.json. Nu edita de mână. */\n'
  + 'window.CUM_FAC_DATE = ' + JSON.stringify({ versiune, numar: valide.length, ...continut }) + ';\n';
const catalog = valide.map(f => ({ id: f.id, aplicatie: f.aplicatie, titlu: f.titlu, clasa: f.clasa }));
const amprente = {
  despre: 'Amprentele pașilor-sursă (sha1 al textului pasului din digest: titlu + text + Uite cum + Altfel + indicii; la „real”, pașii din aplicația adevărată). Scrise de cum-fac/_build/build.mjs; build.mjs --verifica le compară cu digestul curent. Nu edita de mână.',
  fise: Object.fromEntries(Object.keys(noi).sort().map(k => [k, noi[k]]))
};

const tinta = path.join(CF, 'date.js');
const laZi = fs.existsSync(tinta) && fs.readFileSync(tinta, 'utf8') === dateJs;
if (VERIFICA) {
  info.push(`date.js: ${laZi ? 'la zi' : 'NU e la zi față de fișele din ' + path.relative(L, FOLDER).replace(/\\/g, '/') + ' (informativ; rulează build.mjs)'}`);
} else {
  fs.writeFileSync(tinta, dateJs, 'utf8');
  fs.mkdirSync(path.join(CF, '_teste'), { recursive: true });
  fs.writeFileSync(path.join(CF, '_teste/catalog_titluri.json'), JSON.stringify(catalog, null, 1) + '\n', 'utf8');
  fs.writeFileSync(AMPRENTE, JSON.stringify(amprente, null, 1) + '\n', 'utf8');
  info.push(`scrise: cum-fac/date.js (${(dateJs.length / 1024).toFixed(0)} KB, versiunea ${versiune}), cum-fac/_teste/catalog_titluri.json, ${path.relative(L, AMPRENTE).replace(/\\/g, '/')}`);
}

for (const x of info) console.log('  info', x);
for (const x of probleme) console.log('  ✗', x);
const pe = {};
for (const f of valide) pe[f.aplicatie] = (pe[f.aplicatie] || 0) + 1;
console.log(`fișe: ${fise.length} (valide ${valide.length}: ${Object.entries(pe).map(([a, n]) => a + ' ' + n).join(', ') || '—'}) · invalide ${invalide.size} · pași-sursă schimbați ${schimbate} · ${VERIFICA ? 'verificare (nu s-a scris nimic)' : 'construit'} · probleme:`);
console.log(probleme.length);
process.exitCode = probleme.length ? 1 : 0;
