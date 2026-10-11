// Întrebările sub prag („n-am găsit”), bune (fișa bună pe locul 1) vs din afara materiei (fără veto): trăsături
// tare, distanța față de al doilea (scor), nTare/nQ, dice. Bazin FĂRĂ B + C + D. node sub.mjs --mod … --reglaj '{}'
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac', T = CF + '/_teste/', U = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const Cautare = require(CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || U + '/date_lucru.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const s = JSON.parse(fs.readFileSync(CF + '/_sursa/sensuri.json', 'utf8')); delete s.despre;
if (opt('--mod')) { const { aplica } = await import('./mod.mjs'); aplica(s, opt('--mod').split(',')); }
const index = Cautare.creeaza(D.fise, s, { reglaj: JSON.parse(opt('--reglaj') || '{}') });
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const pool = [];
inc('set_dezvoltare_m2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 'm2A' }); });
inc('set_dezvoltare_2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 's2A' }); });
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung']) pool.push(...inc(n + '.json').map(x => ({ ...x, src: n })));
pool.push(...JSON.parse(fs.readFileSync(U + '/set_reglor3.json', 'utf8')).map(x => ({ ...x, src: 'C' })));
pool.push(...JSON.parse(fs.readFileSync(U + '/set_reglor3_d.json', 'utf8')).map(x => ({ ...x, src: 'D' })));
const rows = [];
for (const x of pool) {
  const r = index.cauta(x.q, { diag: true });
  if (!r.diag || !r.diag.top || r.gasit) continue;
  if (r.vetoTaie) continue;
  const acc = x.accept || [];
  const fel = !acc.length ? 'AFARA' : (acc.includes(r.diag.top.id) ? 'BUN' : null);
  if (!fel) continue;
  const p = r.diag.top.p, d = r.diag.doi ? r.diag.doi.p : null;
  const gap = d ? (p.scor - d.scor) / p.scor : 1;
  const gapT = d ? p.tare - d.tare : p.tare;
  rows.push({ fel, tare: p.tare, gap, gapT, n: p.nTare, nQ: r.diag.Q.length, dice: r.diceFx, q: x.q, src: x.src });
}
rows.sort((a, b) => b.tare - a.tare);
for (const o of rows.filter(o => o.tare >= 0.4)) console.log(`${o.fel.padEnd(5)} tare ${o.tare.toFixed(2)} gap ${o.gap.toFixed(2)} gapT ${o.gapT.toFixed(2)} n${o.n}/${o.nQ} dice ${o.dice.toFixed(2)} [${o.src}] ${o.q.slice(0, 70)}`);
