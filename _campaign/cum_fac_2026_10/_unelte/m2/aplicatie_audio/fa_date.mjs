// Face un date.js de PROBĂ (nu atinge cum-fac/date.js): fișele dintr-un date.js de bază (cu „fx”), dicționarul dintr-un
// sensuri.json dat și, opțional, fișe în plus (fișiere JSON cu o listă de fișe, ca fise_*.json).
//   node fa_date.mjs <date_baza.js> <sensuri.json> <iesire.js> [fise_extra.json ...]
import fs from 'node:fs';
import vm from 'node:vm';
const [baza, sens, iesire, ...extra] = process.argv.slice(2);
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(baza, 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const S = JSON.parse(fs.readFileSync(sens, 'utf8'));
delete S.despre;
let fise = D.fise.slice();
for (const e of extra) {
  const l = JSON.parse(fs.readFileSync(e, 'utf8'));
  const noi = new Set(l.map(f => f.id));
  fise = fise.filter(f => !noi.has(f.id)).concat(l);
}
const out = { ...D, fise, numar: fise.length, sensuri: S, versiune: 'proba-' + fise.length };
fs.writeFileSync(iesire, 'window.CUM_FAC_DATE = ' + JSON.stringify(out) + ';\n', 'utf8');
console.log(`${iesire}: ${fise.length} fișe (${extra.length} fișiere în plus)`);
