// Pentru fiecare întrebare din seturile de reglaj: ce dă motorul (găsit + primele 3 / propunerile), ca să compar
// două date.js întrebare cu întrebare.
//   node detaliu.mjs <date.js> <iesire.json> [--cautare <cautare.js>]
//   node detaliu.mjs --compara <a.json> <b.json>
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const arg = process.argv.slice(2);
const T = 'C:/00/Projects/LearningHub/cum-fac/_teste';
const SETURI = ['exemplele_profesorului', 'set_feedback_profesor', 'set_dezvoltare', 'set_dezvoltare_2', 'set_inginer_real', 'set_r5', 'set_reglor_lung'];
if (arg[0] === '--compara') {
  const a = JSON.parse(fs.readFileSync(arg[1], 'utf8')), b = JSON.parse(fs.readFileSync(arg[2], 'utf8'));
  let n = 0;
  for (const k of Object.keys(a)) {
    const x = a[k], y = b[k];
    if (!y) continue;
    const st = r => r.ok1 ? 'loc1' : r.ok3 ? 'top3' : 'RATAT';
    if (st(x) !== st(y) || x.top.join() !== y.top.join()) {
      n++;
      console.log(`${st(x) === st(y) ? '  ' : st(y) === 'RATAT' || (st(x) === 'loc1' && st(y) !== 'loc1') ? '↓ ' : '↑ '}${k}\n     înainte ${st(x)} ${x.gasit ? '' : '(n-am găsit) '}${x.top.join(', ')}\n     acum    ${st(y)} ${y.gasit ? '' : '(n-am găsit) '}${y.top.join(', ')}`);
    }
  }
  console.log(`diferențe: ${n}`);
  // rezumat pe seturi: locul 1 / primele 3 (întrebările cu fișă), „n-am găsit” corect (din afara materiei)
  const rez = o => {
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      const s = k.split(' · ')[0];
      const x = r[s] = r[s] || { n: 0, l1: 0, l3: 0, na: 0, ok: 0 };
      if (v.afara) { x.na++; if (v.ok1) x.ok++; } else { x.n++; if (v.ok1) x.l1++; if (v.ok3) x.l3++; }
    }
    return r;
  };
  const ra = rez(a), rb = rez(b);
  for (const s of Object.keys(ra)) {
    const f = x => `locul 1 ${x.l1}/${x.n} · primele 3 ${x.l3}/${x.n} · afară ${x.ok}/${x.na}`;
    console.log(`${s}: înainte ${f(ra[s])}  →  acum ${rb[s] ? f(rb[s]) : '—'}`);
  }
  process.exit(0);
}
const [dj, iesire] = arg;
const ci = arg.indexOf('--cautare');
const C = createRequire(import.meta.url)(ci >= 0 ? arg[ci + 1] : 'C:/00/Projects/LearningHub/cum-fac/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(dj, 'utf8'), ctx);
const { fise, sensuri } = ctx.window.CUM_FAC_DATE;
const I = C.creeaza(fise, sensuri);
const o = {};
for (const s of SETURI) {
  if (!fs.existsSync(`${T}/${s}.json`)) continue;
  for (const x of JSON.parse(fs.readFileSync(`${T}/${s}.json`, 'utf8'))) {
    const r = I.cauta(x.q);
    const acc = x.accept || [];
    const top = r.gasit ? r.rezultate.slice(0, 3).map(z => z.id) : r.propuneri.slice(0, 3);
    const ok1 = acc.length ? (r.gasit && acc.includes(top[0])) : !r.gasit;
    const ok3 = acc.length ? (r.gasit && top.some(id => acc.includes(id))) : !r.gasit;
    o[`${s} · ${x.q}`] = { gasit: r.gasit, top, ok1, ok3, dedusa: r.aplicatieDedusa, afara: !acc.length };
  }
}
fs.writeFileSync(iesire, JSON.stringify(o, null, 1), 'utf8');
console.log(`${Object.keys(o).length} întrebări -> ${iesire}`);
