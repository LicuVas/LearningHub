// Fișele din instantaneul date_inainte.js (cele de la începutul reglajului, ca cifrele să nu se miște când alt agent
// repară fișele), cu formulările în plus („fx”) refăcute din _sursa/formulari_extra_*.json cu normalizeaza() de ACUM
// din cautare.js (exact ce face build.mjs). Scrie date_lucru.js lângă el. Rulează-l după orice schimbare a normalizării.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { createRequire } from 'node:module';
const CF = 'C:/00/Projects/LearningHub/cum-fac';
const U = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3';
const require = createRequire(import.meta.url);
const C = require(CF + '/cautare.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(U + '/date_inainte.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const extra = {};
for (const n of fs.readdirSync(CF + '/_sursa').filter(n => /^formulari_extra_.*\.json$/.test(n)).sort())
  for (const [id, l] of Object.entries(JSON.parse(fs.readFileSync(path.join(CF, '_sursa', n), 'utf8')))) (extra[id] = extra[id] || []).push(...l);
let n = 0;
for (const f of D.fise) {
  const vaz = new Set([f.titlu, f.intrebare, ...(f.formulari || [])].map(x => C.normalizeaza(x)));
  const o = [];
  for (const x of extra[f.id] || []) { const k = C.normalizeaza(x); if (!k || vaz.has(k)) continue; vaz.add(k); o.push(k); }
  if (o.length) f.fx = o.join('|'); else delete f.fx;
  n += o.length;
}
fs.writeFileSync(U + '/date_lucru.js', 'window.CUM_FAC_DATE = ' + JSON.stringify(D) + ';\n', 'utf8');
console.log(`date_lucru.js: ${D.fise.length} fișe, ${n} formulări în plus`);
