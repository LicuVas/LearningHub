// Măsoară motorul „Cum fac…?” pe un set de întrebări (format: SPEC.md, „Setul de test”).
//
//   node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs <set.json> [--detalii] [--date <date.js>]
//        [--fise <folder cu fise_*.json> [--sensuri <sensuri.json>]] [--umple N]
//
// Implicit folosește exact ce publică pagina: cum-fac/date.js (fișele + sensurile) și cum-fac/cautare.js.
// --fise: construiește indexul direct din fise_*.json (fără să scrie date.js), ca să încerci fișe nepublicate.
// --umple N: adaugă copii ale fișelor până la N (doar pentru măsurarea vitezei pe un index mare).
// Tipărește: locul 1 %, primele 3 %, „din afara materiei” corecte / total, timpul mediu și maxim pe întrebare,
// ratările. Ratare = fișa bună nu e în primele 3 (sau „n-am găsit”), ori, la o întrebare din afara materiei,
// gasit=true. ULTIMA LINIE = numărul de întrebări ratate.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';

const CF = 'C:/00/Projects/LearningHub/cum-fac';
const require = createRequire(import.meta.url);
const Cautare = require(path.join(CF, 'cautare.js'));

const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const DETALII = arg.includes('--detalii');
const setCale = arg.find((a, i) => !a.startsWith('--') && !['--date', '--fise', '--sensuri', '--umple'].includes(arg[i - 1]));
if (!setCale) { console.log('folosire: evalueaza.mjs <set.json> [--detalii] [--date date.js] [--fise folder] [--umple N]'); console.log(1); process.exit(2); }

let fise, sensuri, sursa;
if (opt('--fise')) {
  const dir = path.resolve(opt('--fise'));
  fise = [];
  for (const n of fs.readdirSync(dir).filter(n => /^fise_.*\.json$/.test(n)).sort()) fise.push(...JSON.parse(fs.readFileSync(path.join(dir, n), 'utf8')));
  sensuri = JSON.parse(fs.readFileSync(path.resolve(opt('--sensuri') || path.join(CF, '_sursa/sensuri.json')), 'utf8'));
  sursa = `fise_*.json din ${dir.replace(/\\/g, '/')}`;
} else {
  const dj = path.resolve(opt('--date') || path.join(CF, 'date.js'));
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(dj, 'utf8'), ctx);
  ({ fise, sensuri } = ctx.window.CUM_FAC_DATE);
  sursa = `${path.basename(dj)} (versiunea ${ctx.window.CUM_FAC_DATE.versiune})`;
}
const umple = parseInt(opt('--umple') || '0', 10);
if (umple > fise.length) {
  const baza = fise.slice();
  for (let k = 0; fise.length < umple; k++) {
    const f = JSON.parse(JSON.stringify(baza[k % baza.length]));
    f.id = f.id + '-copie' + k;
    fise.push(f);
  }
}

const t0 = performance.now();
const index = Cautare.creeaza(fise, sensuri);
const tIndex = performance.now() - t0;
const ids = new Set(fise.map(f => f.id));
const set = JSON.parse(fs.readFileSync(path.resolve(setCale), 'utf8'));

let n1 = 0, n3 = 0, nIn = 0, okAfara = 0, nAfara = 0;
const timpi = [], ratari = [], peTip = {};
const necunoscute = new Set();
for (const x of set) {
  const accept = x.accept || [];
  for (const a of accept) if (!ids.has(a)) necunoscute.add(a);
  const s = performance.now();
  const r = index.cauta(x.q);
  timpi.push(performance.now() - s);
  const top = r.gasit ? r.rezultate.map(z => z.id) : [];
  const tip = x.tip || '—';
  peTip[tip] = peTip[tip] || { n: 0, ok: 0 };
  peTip[tip].n++;
  let ok;
  if (!accept.length) {
    nAfara++;
    ok = !r.gasit;
    if (ok) okAfara++;
  } else {
    nIn++;
    const l1 = top.length > 0 && accept.includes(top[0]);
    const l3 = top.slice(0, 3).some(id => accept.includes(id));
    if (l1) n1++;
    if (l3) n3++;
    ok = l3;
  }
  if (ok) peTip[tip].ok++;
  else ratari.push({ x, r });
}

const pct = (a, b) => (b ? (100 * a / b).toFixed(1) : '—') + '%';
const medie = timpi.reduce((a, b) => a + b, 0) / (timpi.length || 1);
console.log(`set: ${path.basename(setCale)} · ${set.length} întrebări · index: ${fise.length} fișe din ${sursa}, construit în ${tIndex.toFixed(0)} ms`);
console.log(`locul 1: ${n1}/${nIn} = ${pct(n1, nIn)} · primele 3: ${n3}/${nIn} = ${pct(n3, nIn)} (prag R4: 75% / 90%)`);
console.log(`din afara materiei, „n-am găsit” corect: ${okAfara}/${nAfara} (prag R6: 18/20)`);
console.log(`timp pe întrebare: mediu ${medie.toFixed(2)} ms · maxim ${Math.max(0, ...timpi).toFixed(2)} ms (prag R7: < 100 ms)`);
console.log('pe tipuri: ' + Object.entries(peTip).map(([t, v]) => `${t} ${v.ok}/${v.n}`).join(' · '));
if (necunoscute.size) console.log(`ATENȚIE: setul cere fișe care nu există în index: ${[...necunoscute].join(', ')}`);
if (ratari.length) console.log('ratări:');
for (const { x, r } of ratari) {
  const ce = r.gasit ? r.rezultate.slice(0, 3).map(z => `${z.id} (${z.acoperire})`).join(', ') : `n-am găsit; propuneri ${r.propuneri.join(', ')}`;
  console.log(`  ✗ [${x.tip || '—'}] „${x.q}” · vrea ${x.accept && x.accept.length ? x.accept.join(' | ') : 'n-am găsit'} · a dat ${ce}`);
  if (DETALII) {
    const e = index.explica(x.q);
    console.log(`      normalizat: „${e.normalizat}” · aplicația dedusă: ${e.aplicatieDedusa || '—'}${e.numita ? ' (numită)' : ''}`);
    console.log('      jetoane: ' + e.jetoane.map(j => `${j.w}[${j.rad}; ${j.fel}; idf ${j.idf}${j.sensuri.length ? '; ' + j.sensuri.join('/') : ''}]`).join(' '));
    for (const p of e.primele) console.log(`      ${p.id}: acoperire ${p.acoperire}, frază ${p.fraza}, potrivite: ${p.de_ce.join(', ')}`);
  }
}
if (arg.includes('--praguri')) {
  // pentru reglajul pragului „am găsit” (pe setul de DEZVOLTARE): acoperirea pe câmpurile tari a primului rezultat
  const vin = [], afara = [];
  for (const x of set) {
    const e = index.explica(x.q);
    const p = e.primele[0];
    const v = p ? p.tare : 0;
    if ((x.accept || []).length) { if (p && x.accept.includes(p.id)) vin.push([v, x.q]); }
    else afara.push([v, x.q]);
  }
  vin.sort((a, b) => a[0] - b[0]); afara.sort((a, b) => b[0] - a[0]);
  console.log('prag: întrebări bune cu fișa bună pe locul 1, cele mai joase: ' + vin.slice(0, 12).map(([v, q]) => `${v.toFixed(2)} „${q}”`).join(' · '));
  console.log('prag: din afara materiei, cele mai înalte: ' + afara.slice(0, 12).map(([v, q]) => `${v.toFixed(2)} „${q}”`).join(' · '));
}
console.log(ratari.length);
process.exitCode = ratari.length ? 1 : 0;
