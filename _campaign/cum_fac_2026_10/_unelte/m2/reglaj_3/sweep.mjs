// Încercări de reglaj pe bazinul de reglaj (FĂRĂ B) și, la cerere, pe validarea încrucișată (CV, 5 bucăți).
//   node sweep.mjs --mod a,b --cfg '[{"prag":0.7},{"sens_tare":0.6}]' [--cv] [--date date.js]
// Pe rând: bazin (bune în primele 3 / pe locul 1 / câte; din afara materiei respinse, cu și fără „neacoperite”),
// separat m2A, apoi CV (găsit / primele 3).
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
const inc = n => JSON.parse(fs.readFileSync(T + n, 'utf8'));
const pool = [];
inc('set_dezvoltare_m2.json').forEach((x, i) => { if (i % 2 === 0) pool.push({ ...x, m2: true }); });
inc('set_dezvoltare_2.json').forEach((x, i) => { if (i % 2 === 0) pool.push(x); });
for (const n of ['set_dezvoltare', 'set_inginer_real', 'set_inginer', 'set_reglor_lung', 'set_r5', 'exemplele_profesorului', 'set_feedback_profesor']) pool.push(...inc(n + '.json'));
const cfgs = JSON.parse(opt('--cfg') || '[{}]');
for (const cfg of cfgs) {
  const index = Cautare.creeaza(D.fise, sensuri, { reglaj: cfg });
  const indexFV = Cautare.creeaza(D.fise, sensuri, { reglaj: { ...cfg, veto: false } });
  const s = { t3: 0, t1: 0, n: 0, af: 0, afFV: 0, nAf: 0, m2t3: 0, m2n: 0, m2af: 0, m2nAf: 0 };
  for (const x of pool) {
    const acc = x.accept || [];
    const r = index.cauta(x.q);
    if (acc.length) {
      const ids = r.gasit ? r.rezultate.map(z => z.id) : [];
      s.n++; if (ids.slice(0, 3).some(i => acc.includes(i))) { s.t3++; if (x.m2) s.m2t3++; } if (acc.includes(ids[0])) s.t1++;
      if (x.m2) s.m2n++;
    } else {
      s.nAf++; if (!r.gasit) { s.af++; if (x.m2) s.m2af++; } if (x.m2) s.m2nAf++;
      if (!indexFV.cauta(x.q).gasit) s.afFV++;
    }
  }
  let cv = '';
  if (arg.includes('--cv')) {
    let n = 0, g = 0, t3 = 0;
    for (let k = 0; k < 5; k++) {
      const fise = D.fise.map(f => f.fx ? { ...f, fx: f.fx.split('|').filter((x, j) => j % 5 !== k).join('|') } : f);
      const ix = Cautare.creeaza(fise, sensuri, { reglaj: cfg });
      for (const f of D.fise) if (f.fx) f.fx.split('|').forEach((q, j) => {
        if (j % 5 !== k) return;
        const r = ix.cauta(q + ' '); n++;
        if (r.gasit) { g++; if (r.rezultate.slice(0, 3).some(z => z.id === f.id)) t3++; }
      });
    }
    cv = ` · CV găsit ${g} (${(100 * g / n).toFixed(1)}%) primele3 ${t3} (${(100 * t3 / n).toFixed(1)}%)`;
  }
  console.log(`${JSON.stringify(cfg).padEnd(40)} bazin top3 ${s.t3}/${s.n} loc1 ${s.t1} · afară ${s.af}/${s.nAf} (fără veto ${s.afFV}) · m2A top3 ${s.m2t3}/${s.m2n} afară ${s.m2af}/${s.m2nAf}${cv}`);
}
