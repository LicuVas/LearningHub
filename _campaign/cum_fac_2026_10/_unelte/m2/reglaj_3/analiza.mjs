// Analiza regulii „am găsit” pe bazinul de reglaj (FĂRĂ jumătățile B):
// m2A, s2A, set_dezvoltare, set_inginer_real, set_inginer, set_reglor_lung, set_r5, exemplele, feedback.
// Pentru fiecare întrebare: dacă primul rezultat e bun / din afara materiei, tare, nTare, diceFx, pe ce regulă trece.
//   node analiza.mjs [--date date.js] [--reglaj '{}'] [--toate]
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac', T = CF + '/_teste/';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const Cautare = require(opt('--cautare') || CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || CF + '/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const sensuri = JSON.parse(fs.readFileSync(CF + '/_sursa/sensuri.json', 'utf8'));
const index = Cautare.creeaza(D.fise, sensuri, opt('--reglaj') ? { reglaj: JSON.parse(opt('--reglaj')) } : undefined);
const R = index.reglaj;
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const pool = [];
const add = (nume, l) => l.forEach(x => pool.push({ ...x, set: nume }));
add('m2A', inc('set_dezvoltare_m2.json').filter((x, i) => i % 2 === 0));
add('s2A', inc('set_dezvoltare_2.json').filter((x, i) => i % 2 === 0));
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung', 'set_r5', 'exemplele_profesorului', 'set_feedback_profesor']) add(n, inc(n + '.json'));
const out = [];
for (const x of pool) {
  const r = index.cauta(x.q, { diag: true });
  const top = r.diag && r.diag.top;
  if (!top) { out.push({ x, fel: x.accept && x.accept.length ? 'bun-gol' : 'afara-gol' }); continue; }
  const p = top.p;
  const bun = x.accept && x.accept.length ? x.accept.includes(top.id) : null;
  const regula = p.tare >= R.prag ? 'baza' : (R.lung_potrivite && p.nTare >= R.lung_potrivite && p.tare >= R.prag_lung ? 'lung' : (r.diceFx >= R.fx_dice ? 'dice' : 'sub'));
  out.push({ x, top: top.id, bun, tare: p.tare, nTare: p.nTare, dice: r.diceFx, regula, veto: r.vetoTaie, gasit: r.gasit, nQ: r.diag.Q.length });
}
const cnt = {};
for (const o of out) {
  const k = (o.bun === null ? 'AFARA' : (o.bun ? 'BUN' : 'GRESIT')) + ':' + o.regula + (o.veto ? '+veto' : '');
  cnt[k] = (cnt[k] || 0) + 1;
}
console.log(Object.entries(cnt).sort().map(([k, v]) => `${k} ${v}`).join(' · '));
if (arg.includes('--toate')) for (const o of out.filter(o => o.bun === null && o.gasit)) console.log(`  AFARA găsit [${o.x.set}] ${o.regula} tare ${o.tare.toFixed(2)} n${o.nTare} dice ${o.dice.toFixed(2)} „${o.x.q}” → ${o.top}`);
if (arg.includes('--lung')) for (const o of out.filter(o => o.bun && (o.regula === 'lung' || o.regula === 'dice'))) console.log(`  BUN prin ${o.regula} [${o.x.set}] tare ${o.tare.toFixed(2)} n${o.nTare}/${o.nQ} dice ${o.dice.toFixed(2)} „${o.x.q}”`);
