// Cât costă fiecare intrare „neacoperite” (globală sau a unei aplicații): pe câte întrebări bune taie un „am găsit”
// (formulările în plus, cu indexul întreg = aproximare, + întrebările bune din bazinul de reglaj, FĂRĂ B) și pe câte
// din afara materiei din bazin le taie.
//   node vetocost.mjs --mod a,b [--date date.js] [--min 1]
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac', T = CF + '/_teste/';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const Cautare = require(CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || CF + '/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const sensuri = JSON.parse(fs.readFileSync(CF + '/_sursa/sensuri.json', 'utf8'));
delete sensuri.despre;
if (opt('--mod')) { const { aplica } = await import('./mod.mjs'); aplica(sensuri, opt('--mod').split(',')); }
const index = Cautare.creeaza(D.fise, sensuri);
const nume = [...(sensuri.neacoperite || []).map(l => l[0])];
for (const a of Object.keys(sensuri.aplicatii)) for (const l of sensuri.aplicatii[a].neacoperite || []) nume.push(a + ':' + l[0]);
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const bune = [], afara = [];
const pool = [...inc('set_dezvoltare_m2.json').filter((x, i) => i % 2 === 0), ...inc('set_dezvoltare_2.json').filter((x, i) => i % 2 === 0)];
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung', 'set_r5', 'exemplele_profesorului', 'set_feedback_profesor']) pool.push(...inc(n + '.json'));
pool.push(...JSON.parse(fs.readFileSync('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/set_reglor3.json', 'utf8')));
for (const x of pool) (x.accept && x.accept.length ? bune : afara).push({ q: x.q, acc: x.accept, src: 'set' });
for (const f of D.fise) if (f.fx) for (const q of f.fx.split('|')) bune.push({ q: q + ' ', acc: [f.id], src: 'fx' });
const cost = new Map();
const c = k => { if (!cost.has(k)) cost.set(k, { fxBun: 0, fxOrice: 0, setBun: 0, afara: 0, ex: [] }); return cost.get(k); };
for (const b of bune) {
  const r = index.cauta(b.q, { diag: true });
  if (!r.gasitFaraVeto || !r.vetoIntrari) continue;
  const corect = r.diag.top && b.acc.includes(r.diag.top.id);
  for (const ix of new Set(r.vetoIntrari)) {
    const o = c(ix);
    if (b.src === 'fx') { o.fxOrice++; if (corect) { o.fxBun++; if (o.ex.length < 4) o.ex.push(b.q.trim() + ' → ' + r.diag.top.id); } }
    else if (corect) { o.setBun++; o.ex.unshift('[SET] ' + b.q + ' → ' + r.diag.top.id); }
  }
}
for (const a of afara) {
  const r = index.cauta(a.q, { diag: true });
  if (!r.gasitFaraVeto || !r.vetoIntrari) continue;
  for (const ix of new Set(r.vetoIntrari)) { const o = c(ix); o.afara++; o.ex.push('[AFARA] ' + a.q); }
}
const min = parseInt(opt('--min') || '1', 10);
const rows = [...cost.entries()].sort((a, b) => a[0] - b[0]);
let tot = { fxBun: 0, setBun: 0, afara: 0 };
for (const [ix, o] of rows) {
  tot.fxBun += o.fxBun; tot.setBun += o.setBun; tot.afara += o.afara;
  if (o.fxBun + o.setBun + o.afara < min) continue;
  console.log(`${String(ix).padStart(3)} ${nume[ix]}: fx bune tăiate ${o.fxBun} (orice ${o.fxOrice}) · set bune ${o.setBun} · afară ${o.afara}${o.ex.length ? '\n      ' + o.ex.slice(0, 5).join('\n      ') : ''}`);
}
console.log(`TOTAL fx bune tăiate ${tot.fxBun} · set bune tăiate ${tot.setBun} · afară tăiate ${tot.afara} (din ${afara.length})`);
