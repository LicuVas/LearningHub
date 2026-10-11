// Întrebările care trec pe regula frazelor lungi (prag_lung) sau pe asemănarea cu formulările (fx_dice):
// trăsăturile primului rezultat (tare, nTare, ident = Dice cu titlul/întrebarea, fraza, fq), bune vs din afara materiei.
// Bazin FĂRĂ B + set_reglor3 (C). node lung.mjs --mod a,b --date d.js [--reglaj '{}']
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac', T = CF + '/_teste/', U = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const Cautare = require(CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || CF + '/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const s = JSON.parse(fs.readFileSync(CF + '/_sursa/sensuri.json', 'utf8')); delete s.despre;
if (opt('--mod')) { const { aplica } = await import('./mod.mjs'); aplica(s, opt('--mod').split(',')); }
const index = Cautare.creeaza(D.fise, s, { reglaj: JSON.parse(opt('--reglaj') || '{}') });
const R = index.reglaj;
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const pool = [];
inc('set_dezvoltare_m2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 'm2A' }); });
inc('set_dezvoltare_2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 's2A' }); });
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung']) pool.push(...inc(n + '.json').map(x => ({ ...x, src: n })));
pool.push(...JSON.parse(fs.readFileSync(U + '/set_reglor3.json', 'utf8')).map(x => ({ ...x, src: 'C' })));
const rows = [];
for (const x of pool) {
  const r = index.cauta(x.q, { diag: true });
  if (!r.diag || !r.diag.top) continue;
  const p = r.diag.top.p;
  const acc = x.accept || [];
  const fel = !acc.length ? 'AFARA' : (acc.includes(r.diag.top.id) ? 'BUN' : 'GRESIT');
  if (fel === 'GRESIT') continue;
  const reg = p.tare >= R.prag ? 'baza' : (p.nTare >= R.lung_potrivite && p.tare >= R.prag_lung ? 'lung' : (r.diceFx >= R.fx_dice ? 'dice' : 'sub'));
  if (reg === 'sub' || reg === 'baza') continue;
  if (fel === 'AFARA' && r.vetoTaie) continue;
  rows.push({ fel, reg, q: x.q, src: x.src, tare: p.tare, n: p.nTare, nQ: r.diag.Q.length, ident: p.ident, fraza: p.fraza, fq: p.fq, dice: r.diceFx, id: r.diag.top.id, acop: p.acoperire });
}
rows.sort((a, b) => a.reg.localeCompare(b.reg) || a.fel.localeCompare(b.fel) || a.fraza - b.fraza);
for (const o of rows) console.log(`${o.reg} ${o.fel.padEnd(5)} tare ${o.tare.toFixed(2)} n${o.n}/${o.nQ} ident ${o.ident.toFixed(2)} fraza ${o.fraza.toFixed(2)} fq ${o.fq.toFixed(2)} dice ${o.dice.toFixed(2)} acop ${o.acop.toFixed(2)} [${o.src}] ${o.q.slice(0, 70)}`);
