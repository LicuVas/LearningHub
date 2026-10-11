// Diagnostic: node diag.mjs "<întrebare>" [id ...] [--date date.js] [--reglaj '{}']
// Primele 6 rezultate cu scorurile; pentru fiecare id dat: locul și potrivirile.
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
const sensuri = JSON.parse(fs.readFileSync(CF + '/_sursa/sensuri.json', 'utf8'));
const index = Cautare.creeaza(D.fise, sensuri, opt('--reglaj') ? { reglaj: JSON.parse(opt('--reglaj')) } : undefined);
const libere = arg.filter((a, i) => !a.startsWith('--') && !['--date', '--reglaj', '--cautare'].includes(arg[i - 1]));
const q = libere[0];
const r = index.cauta(q, { diag: true, max: 6 });
const e = index.explica(q);
console.log(`„${q}” · norm „${e.normalizat}” · app ${e.aplicatieDedusa || '—'}${e.numita ? ' numită' : ''} · gasit ${r.gasit} · veto ${r.vetoTaie} · diceFx ${r.diceFx && r.diceFx.toFixed(2)}`);
console.log('  jet: ' + e.jetoane.map(j => `${j.w}[${j.rad};${j.fel};${j.idf}${j.sensuri.length ? ';' + j.sensuri.join('/') : ''}]`).join(' '));
if (r.diag && r.diag.top) { const p = r.diag.top.p; console.log(`  top ${r.diag.top.id}: scor ${p.scor.toFixed(3)} acop ${p.acoperire.toFixed(3)} tare ${p.tare.toFixed(3)} nTare ${p.nTare} fraza ${p.fraza.toFixed(3)} ident ${p.ident.toFixed(3)}`); }
if (r.jur) console.log('  jur: ' + r.jur.map(j => `${j.i.toFixed(2)}×${j.t.toFixed(2)}`).join(' '));
for (const x of (r.gasit ? r.rezultate : []).slice(0, 6)) console.log(`  ${x.id} scor ${x.scor} tare ${x.acoperire} · ${x.de_ce.join(', ')}`);
if (!r.gasit) console.log('  propuneri: ' + r.propuneri.join(', ') + ' · diag ' + (r.diag ? r.diag.ids.join(', ') : ''));
for (const id of libere.slice(1)) { const z = index.explicaId(q, id); console.log(`  → ${id}: ${JSON.stringify(z)}`); }
