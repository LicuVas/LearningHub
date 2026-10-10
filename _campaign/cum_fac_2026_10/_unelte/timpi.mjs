// Timpul fiecărei întrebări dintr-un set, de 3 ori la rând (prima rulare include încălzirea motorului JS).
// Rulare: node timpi.mjs <set.json> -> cele mai lente 8 întrebări; ultima linie = nr. de întrebări peste 100 ms (a 3-a rulare).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const L = 'C:/00/Projects/LearningHub';
const require = createRequire(import.meta.url);
const Cautare = require(path.join(L, 'cum-fac/cautare.js'));
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(L, 'cum-fac/date.js'), 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const set = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const t0 = performance.now();
const ix = Cautare.creeaza(D.fise, D.sensuri, D);
console.log('index construit în', (performance.now() - t0).toFixed(0), 'ms');
let rez = [];
for (let r = 0; r < 3; r++) {
  rez = set.map(x => { const a = performance.now(); ix.cauta(x.q, { max: 10 }); return { q: x.q, ms: performance.now() - a }; });
  const max = rez.reduce((m, x) => Math.max(m, x.ms), 0);
  console.log(`rularea ${r + 1}: maxim ${max.toFixed(1)} ms`);
}
rez.sort((a, b) => b.ms - a.ms).slice(0, 8).forEach(x => console.log(x.ms.toFixed(1).padStart(7), 'ms ·', x.q.length, 'caractere'));
console.log(rez.filter(x => x.ms > 100).length);
