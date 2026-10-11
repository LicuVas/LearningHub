// Primele 3 rezultate pentru fiecare întrebare a unui set (X = fișa bună nu e pe locul 1 / „n-am găsit” greșit).
//   node top3.mjs <date.js> <set.json>
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const C = createRequire(import.meta.url)('C:/00/Projects/LearningHub/cum-fac/cautare.js');
const [dj, sc] = process.argv.slice(2);
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(dj, 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const I = C.creeaza(D.fise, D.sensuri);
let rau = 0;
for (const x of JSON.parse(fs.readFileSync(sc, 'utf8'))) {
  const r = I.cauta(x.q);
  const acc = x.accept || [];
  const t = r.gasit ? r.rezultate.slice(0, 3).map(z => `${z.id}(${z.acoperire})`) : ['n-am găsit; propuneri ' + r.propuneri.join(', ')];
  const ok = acc.length ? (r.gasit && acc.includes(r.rezultate[0].id)) : !r.gasit;
  if (!ok) rau++;
  console.log(`${ok ? '  ' : 'X '}${x.q} | ${r.aplicatieDedusa || '—'} | ${t.join(', ')}`);
}
console.log(rau);
