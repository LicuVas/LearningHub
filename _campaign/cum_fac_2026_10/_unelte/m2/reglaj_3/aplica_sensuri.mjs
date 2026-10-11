// Scrie în cum-fac/_sursa/sensuri.json variantele alese (mod.mjs) + cheile de reglaj, pornind de la sensuri_inainte.json.
//   node aplica_sensuri.mjs --mod a,b,c --reglaj '{"k":v}' [--despre "text"] [--proba]
// --proba: nu scrie, doar arată ce s-ar schimba (numărul de intrări).
// Formatul: ca înainte (JSON cu un spațiu de indentare); „1.0” din reglaj rămâne „1.0”.
import fs from 'node:fs';
const U = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3';
const TINTA = 'C:/00/Projects/LearningHub/cum-fac/_sursa/sensuri.json';
const arg = process.argv.slice(2);
const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : null; };
const orig = fs.readFileSync(U + '/sensuri_inainte.json', 'utf8');
const s = JSON.parse(orig);
const { aplica } = await import('./mod.mjs');
if (opt('--mod')) aplica(s, opt('--mod').split(','));
const rg = JSON.parse(opt('--reglaj') || '{}');
for (const [k, v] of Object.entries(rg)) {
  if (v && typeof v === 'object' && s.reglaj[k] && typeof s.reglaj[k] === 'object') Object.assign(s.reglaj[k], v);
  else s.reglaj[k] = v;
}
if (opt('--despre')) s.despre.push(opt('--despre'));
let t = JSON.stringify(s, null, 1) + '\n';
// valorile scrise „1.0” în original rămân la fel (doar forma; JSON le citește identic)
for (const m of orig.matchAll(/^(\s*"[^"]+": )1\.0(,?)$/gm)) t = t.replace(new RegExp('^' + m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '1(,?)$', 'm'), m[1] + '1.0$1');
if (arg.includes('--proba')) {
  console.log(`neacoperite ${JSON.parse(orig).neacoperite.length} -> ${s.neacoperite.length}; grupuri ${JSON.parse(orig).grupuri.length} -> ${s.grupuri.length}; umplutura ${JSON.parse(orig).umplutura.length} -> ${s.umplutura.length}; octeți ${orig.length} -> ${t.length}`);
} else {
  fs.writeFileSync(TINTA, t, 'utf8');
  console.log('scris ' + TINTA + ' (' + t.length + ' octeți)');
}
