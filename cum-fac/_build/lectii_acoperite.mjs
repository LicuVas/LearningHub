// Fișele „Cum fac…?” cresc odată cu lecțiile (decizia profesorului, 10.10.2026, întrebarea 3 din contract):
// fiecare lecție PUBLICATĂ din lectii/plan.json are cel puțin o fișă (sursa.cale) sau e trecută, cu motiv, în
// cum-fac/_sursa/lectii_fara_gesturi.json. Folosit de contractul selfcheck cum-fac-lectii-acoperite.
// Rulare: node cum-fac/_build/lectii_acoperite.mjs -> lecțiile neacoperite; ultima linie = numărul lor; exit 1 dacă > 0.
import fs from 'node:fs';
import path from 'node:path';

const L = 'C:/00/Projects/LearningHub';
const plan = JSON.parse(fs.readFileSync(path.join(L, 'lectii/plan.json'), 'utf8'));
const fara = new Set(JSON.parse(fs.readFileSync(path.join(L, 'cum-fac/_sursa/lectii_fara_gesturi.json'), 'utf8')).lectii);
const cai = new Set();
for (const f of fs.readdirSync(path.join(L, 'cum-fac/_sursa')).filter(n => /^fise_.*\.json$/.test(n))) {
  for (const x of JSON.parse(fs.readFileSync(path.join(L, 'cum-fac/_sursa', f), 'utf8'))) cai.add(x.sursa && x.sursa.cale);
}
const lipsa = [];
let publicate = 0;
for (const c of Object.values(plan.clase)) for (const m of c.module) for (const le of m.lectii) {
  if (le.stare !== 'publicat') continue;
  publicate++;
  if (!cai.has(le.cale) && !fara.has(le.cale)) lipsa.push(`${le.cale} · ${le.titlu}`);
}
for (const x of lipsa) console.log('FĂRĂ FIȘE:', x);
console.log(`lecții publicate: ${publicate} · cu fișe: ${[...cai].filter(Boolean).length} · fără gesturi (deliberat): ${fara.size} · neacoperite:`);
console.log(lipsa.length);
process.exitCode = lipsa.length ? 1 : 0;
