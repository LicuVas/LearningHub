// Ce intrări „neacoperite” pomenește o întrebare și dacă fișa de sus le ridică. node vetodbg.mjs "<q>" --mod a,b
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac';
const require = createRequire(import.meta.url);
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const C = require(CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(opt('--date') || 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/date_lucru.js', 'utf8'), ctx);
const s = JSON.parse(fs.readFileSync(CF + '/_sursa/sensuri.json', 'utf8')); delete s.despre;
const { aplica } = await import('./mod.mjs'); if (opt('--mod')) aplica(s, opt('--mod').split(','));
const rads = C.normalizeaza(arg[0]).split(' ').map(C.radacina);
console.log('rădăcini:', rads.join(' '));
const toate = [...s.neacoperite.map(l => ['', l])];
for (const a of Object.keys(s.aplicatii)) for (const l of s.aplicatii[a].neacoperite || []) toate.push([a, l]);
for (const [a, l] of toate) for (const f of l) {
  const b = C.normalizeaza(f).split(' ').map(C.radacina);
  for (let i = 0; i + b.length <= rads.length; i++) if (b.every((x, j) => rads[i + j] === x)) console.log(`  pomenește ${a ? a + ':' : ''}„${l[0]}” prin „${f}”`);
}
const ix = C.creeaza(ctx.window.CUM_FAC_DATE.fise, s, { reglaj: { articol_necunoscut: true, margine_slab: 0.45 } });
const r = ix.cauta(arg[0], { diag: true });
console.log('top', r.diag && r.diag.top && r.diag.top.id, 'gasit', r.gasit, 'vetoTaie', r.vetoTaie, 'intrari', JSON.stringify(r.vetoIntrari));
