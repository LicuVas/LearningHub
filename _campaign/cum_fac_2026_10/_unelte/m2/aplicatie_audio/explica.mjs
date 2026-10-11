// Cum înțelege motorul câteva întrebări pe un date.js dat (jetoane, aplicația dedusă, primele fișe, vetoul).
//   node explica.mjs <date.js> "întrebarea 1" ["întrebarea 2" ...]
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const C = createRequire(import.meta.url)('C:/00/Projects/LearningHub/cum-fac/cautare.js');
const [dj, ...qs] = process.argv.slice(2);
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(dj, 'utf8'), ctx);
const { fise, sensuri } = ctx.window.CUM_FAC_DATE;
const I = C.creeaza(fise, sensuri);
for (const q of qs) {
  const e = I.explica(q);
  const r = I.cauta(q, { diag: true });
  console.log(`„${q}” · dedusă ${e.aplicatieDedusa || '—'}${e.numita ? ' (numită)' : ''} · găsit ${r.gasit}${r.vetoTaie ? ' · VETO a tăiat' : ''}`);
  console.log('   jetoane: ' + e.jetoane.map(j => `${j.w}[${j.rad}; ${j.fel}; idf ${j.idf}${j.sensuri.length ? '; ' + j.sensuri.join('/') : ''}]`).join(' '));
  for (const p of e.primele.slice(0, 3)) console.log(`   ${p.id}: tare ${p.tare} (n ${p.nTare}), acoperire ${p.acoperire}, frază ${p.fraza}, potrivite: ${p.de_ce.join(', ')}`);
}
