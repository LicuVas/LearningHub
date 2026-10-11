// Ipoteza „verbului”: într-o întrebare „cum <verb> …”, primul cuvânt de după „cum” spune gestul. Dacă primul
// rezultat nu-l are în câmpurile tari (titlu, întrebare, formulări, cuvinte, termeni), e mai probabil din afara materiei?
// Numără pe bazin (FĂRĂ B) și pe formulările în plus (index întreg).
//   node verb.mjs --mod a,b [--date date.js] [--lista]
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
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const pool = [];
inc('set_dezvoltare_m2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 'm2A' }); });
inc('set_dezvoltare_2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 's2A' }); });
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung', 'set_r5', 'exemplele_profesorului', 'set_feedback_profesor']) pool.push(...inc(n + '.json').map(x => ({ ...x, src: n })));
for (const f of D.fise) if (f.fx) for (const q of f.fx.split('|')) pool.push({ q: q + ' ', accept: [f.id], src: 'fx' });
function verbIx(q, Q) {
  const w = Cautare.normalizeaza(q).split(' ');
  const c = w.indexOf('cum');
  if (c < 0) return -1;
  // al câtelea jeton e primul cuvânt de după „cum”
  let k = 0;
  for (let i = 0; i < w.length && k < Q.length; i++) {
    if (Q[k].w.split(' ')[0] === w[i]) { if (i > c) return k; k++; }
  }
  return -1;
}
const st = {};
const add = (k, x) => { st[k] = st[k] || { n: 0, ex: [] }; st[k].n++; if (st[k].ex.length < 12) st[k].ex.push(x); };
for (const x of pool) {
  const r = index.cauta(x.q, { diag: true });
  if (!r.gasit || !r.diag || !r.diag.top) continue;
  const Q = r.diag.Q, v = verbIx(x.q, Q);
  const fel = !(x.accept && x.accept.length) ? 'AFARA' : (x.accept.includes(r.diag.top.id) ? 'BUN' : 'GRESIT');
  const grup = x.src === 'fx' ? 'fx' : 'set';
  if (v < 0) { add(`${grup} ${fel} fără-cum`, x.q); continue; }
  const j = r.jur[v];
  const k = j.a > 0 ? 'verb-tare' : (j.t > 0 ? 'verb-doar-fx' : 'verb-nepotrivit');
  add(`${grup} ${fel} ${k}`, `${x.q.trim()} [${Q[v].w}] → ${r.diag.top.id}`);
}
for (const k of Object.keys(st).sort()) {
  console.log(`${k}: ${st[k].n}`);
  if (arg.includes('--lista') && !/verb-tare|fără-cum/.test(k)) for (const e of st[k].ex) console.log('     ' + e);
}
