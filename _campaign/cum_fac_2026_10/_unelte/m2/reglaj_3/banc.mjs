// Bancul reglorului nr. 3: toate seturile de dezvoltare, cu jumătățile fixe A (indicii pari) / B (impari)
// pentru set_dezvoltare_m2.json și set_dezvoltare_2.json.
//
//   node banc.mjs [--date <date.js>] [--sensuri <sensuri.json>] [--cautare <cautare.js>] [--reglaj '{"k":v}']
//                 [--ratari m2A|m2B|s2A|s2B|s1|ex|fb|ing] [--afara] [--detalii] [--json]
//
// Implicit: fișele din cum-fac/date.js, dicționarul din cum-fac/_sursa/sensuri.json (fără rebuild), motorul cum-fac/cautare.js.
// --ratari X: tipărește ratările doar pe bucata X (reglajul se face pe A; B doar se măsoară).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';

const CF = 'C:/00/Projects/LearningHub/cum-fac';
const T = CF + '/_teste/';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const Cautare = require(path.resolve(opt('--cautare') || CF + '/cautare.js'));

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.resolve(opt('--date') || CF + '/date.js'), 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
let sensuri = D.sensuri;
if (opt('--sensuri') !== 'date') {
  sensuri = JSON.parse(fs.readFileSync(path.resolve(opt('--sensuri') || CF + '/_sursa/sensuri.json'), 'utf8'));
  delete sensuri.despre;
}
if (opt('--mod')) { const { aplica } = await import('./mod.mjs'); aplica(sensuri, opt('--mod').split(',')); }
const optiuni = opt('--reglaj') ? { reglaj: JSON.parse(opt('--reglaj')) } : undefined;
const t0 = performance.now();
const index = Cautare.creeaza(D.fise, sensuri, optiuni);
const tIndex = performance.now() - t0;

const incarca = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const m2 = incarca('set_dezvoltare_m2.json'), s2 = incarca('set_dezvoltare_2.json');
const bucati = {
  m2A: m2.filter((x, i) => i % 2 === 0), m2B: m2.filter((x, i) => i % 2 === 1),
  s2A: s2.filter((x, i) => i % 2 === 0), s2B: s2.filter((x, i) => i % 2 === 1),
  s1: incarca('set_dezvoltare.json'), ex: incarca('exemplele_profesorului.json'),
  fb: incarca('set_feedback_profesor.json'), ing: incarca('set_inginer_real.json'),
  c3: JSON.parse(fs.readFileSync('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/set_reglor3.json', 'utf8')),
  d3: fs.existsSync('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/set_reglor3_d.json') ? JSON.parse(fs.readFileSync('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/set_reglor3_d.json', 'utf8')) : []
};
let tMax = 0;
function masoara(set) {
  let n1 = 0, n3 = 0, nIn = 0, ok = 0, nAf = 0;
  const rat = [];
  for (const x of set) {
    const acc = x.accept || [];
    const s = performance.now();
    const r = index.cauta(x.q);
    const dt = performance.now() - s;
    if (dt > tMax) tMax = dt;
    const top = r.gasit ? r.rezultate.map(z => z.id) : [];
    if (!acc.length) { nAf++; if (!r.gasit) ok++; else rat.push({ x, r, fel: 'afara' }); }
    else {
      nIn++;
      const l1 = top.length && acc.includes(top[0]);
      const l3 = top.slice(0, 3).some(id => acc.includes(id));
      if (l1) n1++;
      if (l3) n3++;
      if (!l3) rat.push({ x, r, fel: r.gasit ? 'ordine' : 'n-am-gasit' });
      else if (!l1 && arg.includes('--l1')) rat.push({ x, r, fel: 'locul2-3' });
    }
  }
  return { n1, n3, nIn, ok, nAf, rat };
}
const rez = {};
for (const [k, set] of Object.entries(bucati)) rez[k] = masoara(set);
const pct = (a, b) => b ? (100 * a / b).toFixed(1) : '—';
const linie = (k, m) => `${k.padEnd(4)} loc1 ${m.n1}/${m.nIn} ${pct(m.n1, m.nIn)}% · top3 ${m.n3}/${m.nIn} ${pct(m.n3, m.nIn)}% · afara ${m.ok}/${m.nAf}`;
const uneste = (a, b) => ({ n1: a.n1 + b.n1, n3: a.n3 + b.n3, nIn: a.nIn + b.nIn, ok: a.ok + b.ok, nAf: a.nAf + b.nAf });
if (arg.includes('--json')) {
  const o = {};
  for (const [k, m] of Object.entries(rez)) o[k] = { n1: m.n1, n3: m.n3, nIn: m.nIn, ok: m.ok, nAf: m.nAf };
  o.tMax = tMax; o.tIndex = tIndex;
  console.log(JSON.stringify(o));
} else {
  console.log(`index ${D.fise.length} fișe (${D.versiune}), ${tIndex.toFixed(0)} ms; timp maxim pe întrebare ${tMax.toFixed(1)} ms`);
  const B = arg.includes('--B');
  for (const [k, m] of Object.entries(rez)) if (B || !/B$/.test(k)) console.log(linie(k, m));
  if (B) { console.log(linie('m2', uneste(rez.m2A, rez.m2B))); console.log(linie('s2', uneste(rez.s2A, rez.s2B))); }
}
const R = opt('--ratari');
if (R) {
  for (const { x, r, fel } of rez[R].rat) {
    if (arg.includes('--afara') && fel !== 'afara') continue;
    if (arg.includes('--bune') && fel === 'afara') continue;
    const ce = r.gasit ? r.rezultate.slice(0, 3).map(z => `${z.id} (${z.acoperire})`).join(', ') : `n-am găsit; prop ${r.propuneri.join(', ')}`;
    console.log(`  ✗ ${fel} [${x.tip || '—'}] „${x.q}” · vrea ${(x.accept || []).join(' | ') || '—'} · a dat ${ce}`);
    if (arg.includes('--detalii')) {
      const e = index.explica(x.q);
      const d = index.cauta(x.q, { diag: true });
      console.log(`      norm „${e.normalizat}” · app ${e.aplicatieDedusa || '—'}${e.numita ? ' (numită)' : ''} · veto ${d.vetoTaie} · diceFx ${d.diceFx != null ? d.diceFx.toFixed(2) : '—'}`);
      console.log('      jet: ' + e.jetoane.map(j => `${j.w}[${j.rad};${j.fel};${j.idf}${j.sensuri.length ? ';' + j.sensuri.join('/') : ''}]`).join(' '));
      for (const p of e.primele.slice(0, 3)) console.log(`      ${p.id}: acop ${p.acoperire} tare ${p.tare} n${p.nTare} fraza ${p.fraza} · ${p.de_ce.join(', ')}`);
      for (const a of (x.accept || []).slice(0, 2)) { const z = index.explicaId(x.q, a); if (z) console.log(`      → ${a}: loc ${z.loc} tare ${z.tare} scor ${z.scor} · ${z.de_ce.join(', ')}`); }
    }
  }
}
