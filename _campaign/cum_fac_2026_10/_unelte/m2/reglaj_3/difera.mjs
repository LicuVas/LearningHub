// Ce întrebări din bazin (FĂRĂ B) își schimbă soarta între două variante.
//   node difera.mjs --date d.js --a '{"cautare":"…","mod":"x,y","cfg":{}}' --b '{"mod":"x,y,z","cfg":{"k":1}}' [--fx]
// --fx: și formulările în plus (index întreg; aproximare).
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac', T = CF + '/_teste/';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || CF + '/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const { aplica } = await import('./mod.mjs');
function fa(spec) {
  const C = require(spec.cautare || CF + '/cautare.js');
  const s = JSON.parse(fs.readFileSync(spec.sensuri || CF + '/_sursa/sensuri.json', 'utf8'));
  delete s.despre;
  if (spec.mod) aplica(s, spec.mod.split(','));
  return C.creeaza(D.fise, s, { reglaj: spec.cfg || {} });
}
const A = fa(JSON.parse(opt('--a') || '{}')), B = fa(JSON.parse(opt('--b') || '{}'));
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const pool = [];
inc('set_dezvoltare_m2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 'm2A' }); });
inc('set_dezvoltare_2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, src: 's2A' }); });
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung', 'set_r5', 'exemplele_profesorului', 'set_feedback_profesor']) pool.push(...inc(n + '.json').map(x => ({ ...x, src: n })));
if (fs.existsSync(opt('--extra') || '')) pool.push(...JSON.parse(fs.readFileSync(opt('--extra'), 'utf8')).map(x => ({ ...x, src: 'extra' })));
if (arg.includes('--fx')) for (const f of D.fise) if (f.fx) for (const q of f.fx.split('|')) pool.push({ q: q + ' ', accept: [f.id], src: 'fx' });
function stare(ix, x) {
  const r = ix.cauta(x.q);
  const acc = x.accept || [];
  if (!acc.length) return r.gasit ? 'GRESIT:' + r.rezultate[0].id : 'ok';
  if (!r.gasit) return 'n-am-gasit';
  const ids = r.rezultate.map(z => z.id);
  const k = ids.findIndex(i => acc.includes(i));
  return k === 0 ? 'ok' : (k > 0 && k < 3 ? 'loc' + (k + 1) : 'GRESIT:' + ids[0]);
}
let plus = 0, minus = 0;
for (const x of pool) {
  const a = stare(A, x), b = stare(B, x);
  if (a === b) continue;
  const bun = s => s === 'ok' ? 2 : (/^loc/.test(s) ? 1 : 0);
  const d = bun(b) - bun(a);
  if (d > 0) plus++; else if (d < 0) minus++;
  if (x.src !== 'fx' || arg.includes('--toate-fx')) console.log(`${d > 0 ? '+' : (d < 0 ? '-' : '~')} [${x.src}] „${x.q.trim()}” · ${a} -> ${b}`);
}
console.log(`mai bine ${plus} · mai rău ${minus}`);
