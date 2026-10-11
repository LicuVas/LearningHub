// Pentru fiecare fișă semnalată: fișa + pasul-sursă VECHI (digestul din HEAD) față de cel de ACUM (digestul din lucru).
// node compara.mjs <id> [<id> ...]   ->  tipărește pe stdout
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const L = 'C:/00/Projects/LearningHub';
const SURSA = path.join(L, 'cum-fac/_sursa');
const DIG = '_campaign/cum_fac_2026_10/digest';
const fisiere = ['fise_powerpoint.json', 'fise_windows_web.json', 'fise_word.json'];
const fise = fisiere.flatMap(n => JSON.parse(fs.readFileSync(path.join(SURSA, n), 'utf8')).map(f => ({ ...f, _f: n })));

const numeDigest = cale => cale.replace(/^lectii\//, '').replace(/\/$/, '').replace('/', '_') + '.json';
const vechi = cale => JSON.parse(execFileSync('git', ['-C', L, 'show', `HEAD:${DIG}/${numeDigest(cale)}`], { encoding: 'utf8', maxBuffer: 64 << 20 }));
const acum = cale => JSON.parse(fs.readFileSync(path.join(L, DIG, numeDigest(cale)), 'utf8'));

function campuri(d, pas) {
  if (pas === 'real') return Object.fromEntries(((d.aplicatie_reala && d.aplicatie_reala.pasi) || []).map((x, i) => [`real${i + 1}`, x]));
  const p = d.pasi.find(x => x.id === pas);
  if (!p) return null;
  const o = { titlu: p.titlu, text: p.text, uite_cum: p.uite_cum, altfel: p.altfel };
  (p.incearca || []).forEach((x, i) => { o[`inc${i + 1}.cerinta`] = x.cerinta; o[`inc${i + 1}.ajutor`] = x.ajutor; o[`inc${i + 1}.de_ce`] = x.de_ce; });
  return o;
}

const ids = process.argv.slice(2);
for (const id of ids) {
  const f = fise.find(x => x.id === id);
  if (!f) { console.log(`### ${id}: NU EXISTĂ`); continue; }
  const { cale, pas } = f.sursa;
  const a = campuri(vechi(cale), pas) || {};
  const b = campuri(acum(cale), pas) || {};
  console.log(`\n########## ${id}  (${f._f})  ${cale} ${pas}`);
  const copie = { ...f }; delete copie._f; delete copie.formulari; delete copie.cuvinte;
  console.log('FIȘA:', JSON.stringify(copie, null, 1));
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if ((a[k] || '') === (b[k] || '')) continue;
    console.log(`--- ${k} VECHI: ${a[k] || '(lipsă)'}`);
    console.log(`+++ ${k} ACUM : ${b[k] || '(lipsă)'}`);
  }
}
