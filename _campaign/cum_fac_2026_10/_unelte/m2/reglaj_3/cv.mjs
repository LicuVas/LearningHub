// Validare încrucișată pe formulările în plus (ca la reglorul nr. 2): 5 bucăți; pe rând, o bucată iese din index și
// devine întrebare (fișa ei = răspunsul bun). Bancul de „cât din bune pierde o regulă mai strictă”.
//   node cv.mjs [--date date.js] [--mod a,b] [--reglaj '{}'] [--doar-noi] [--lista N]
// Tipărește: găsit %, fișa ei în primele 3 %, pe locul 1 % (pe toate și pe fișele noi M2).
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const Cautare = require(opt('--cautare') || CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || CF + '/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const sensuri = JSON.parse(fs.readFileSync(opt('--sensuri') || CF + '/_sursa/sensuri.json', 'utf8'));
delete sensuri.despre;
if (opt('--mod')) { const { aplica } = await import('./mod.mjs'); aplica(sensuri, opt('--mod').split(',')); }
const optiuni = opt('--reglaj') ? { reglaj: JSON.parse(opt('--reglaj')) } : undefined;
const noi = new Set(JSON.parse(fs.readFileSync('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/ids_noi_48.json', 'utf8')));
const K = 5;
const st = { tot: { n: 0, g: 0, t3: 0, t1: 0 }, noi: { n: 0, g: 0, t3: 0, t1: 0 } };
const pierdute = [];
for (let k = 0; k < K; k++) {
  const fise = D.fise.map(f => {
    if (!f.fx) return f;
    const l = f.fx.split('|');
    return { ...f, fx: l.filter((x, j) => j % K !== k).join('|') };
  });
  const index = Cautare.creeaza(fise, sensuri, optiuni);
  for (const f of D.fise) {
    if (!f.fx) continue;
    f.fx.split('|').forEach((q, j) => {
      if (j % K !== k) return;
      const r = index.cauta(q + ' ');
      const ids = r.gasit ? r.rezultate.map(z => z.id) : [];
      for (const b of [st.tot, ...(noi.has(f.id) ? [st.noi] : [])]) {
        b.n++;
        if (r.gasit) b.g++;
        if (ids.slice(0, 3).includes(f.id)) b.t3++;
        if (ids[0] === f.id) b.t1++;
      }
      if (!r.gasit && r.propuneri.includes(f.id)) pierdute.push(`${f.id}: ${q}`);
    });
  }
}
const p = (a, b) => (100 * a / b).toFixed(1) + '%';
for (const [n, b] of Object.entries(st)) console.log(`CV ${n}: ${b.n} · găsit ${b.g} ${p(b.g, b.n)} · primele 3 ${b.t3} ${p(b.t3, b.n)} · locul 1 ${b.t1} ${p(b.t1, b.n)}`);
const L = parseInt(opt('--lista') || '0', 10);
if (L) for (const x of pierdute.slice(0, L)) console.log('  n-am găsit, dar e în propuneri: ' + x);
