// Arată de ce motorul ordonează rezultatele așa: primele N fișe, scorul și cuvintele potrivite (de_ce).
// Rulare: node de_ce.mjs "intrebarea" [N=8]
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const C = require('C:/00/Projects/LearningHub/cum-fac/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync('C:/00/Projects/LearningHub/cum-fac/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const ix = C.creeaza(D.fise, D.sensuri, D);
const r = ix.cauta(process.argv[2], { max: +(process.argv[3] || 8) });
console.log('gasit', r.gasit, '· aplicatia dedusa', r.aplicatieDedusa);
for (const x of r.rezultate) console.log(x.scor.toFixed(3).padStart(7), x.id.padEnd(40), JSON.stringify(x.de_ce));
