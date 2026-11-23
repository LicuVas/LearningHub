// Numaratorul de paritate pentru PowerPoint: ruleaza PE RAND toate fisierele powerpoint_paritate_<litera>.mjs
// (probe jucate, cate una pentru fiecare functie pe care simulatoarele vechi ale lectiilor o au) si aduna FAIL-urile.
// Pe rand, nu in paralel: pe masina lucreaza si alte console cu multe browsere (noaptea 23.11), iar rularile
// paralele isi strica una alteia timpii.
// Rulare:  node aplicatii/_verificare/powerpoint_paritate.mjs [--jurnal <fisier.txt>] [--regres] [--doar a,b]
//   --jurnal  scrie toate liniile PASS/FAIL/SKIP intr-un fisier (pentru comparatia inainte/dupa)
//   --regres  ruleaza in locul paritatii run.mjs si toate *_checks.mjs; ultima linie = FAIL-urile LOR
//   --doar    doar fisierele de paritate cu literele date (ex. --doar b)
// Iesire: liniile FAIL, apoi REZUMAT, apoi ULTIMA linie = un singur numar intreg. Un fisier care crapa sau nu
// se termina cu un numar se socoteste ca 1000 de FAIL (o masuratoare prabusita nu are voie sa arate bine).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const iJ = argv.indexOf('--jurnal');
const jurnal = iJ >= 0 ? argv[iJ + 1] : null;
const regres = argv.includes('--regres');
const iD = argv.indexOf('--doar');
const doar = iD >= 0 ? argv[iD + 1].split(',').map(s => s.trim()) : null;

const toate = fs.readdirSync(HERE).filter(f => f.endsWith('.mjs'));
let paritate = toate.filter(f => /^powerpoint_paritate_[a-z]\.mjs$/.test(f)).sort();
if (doar) paritate = paritate.filter(f => doar.includes(f.slice('powerpoint_paritate_'.length, -4)));
const altele = toate.filter(f => f === 'run.mjs' || /_checks\d*\.mjs$/.test(f)).sort();
const fisiere = regres ? altele : paritate;
const LIMITA_MS = 12 * 60 * 1000;

function ruleaza(f) {
  return new Promise(resolve => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [path.join(HERE, f)], { cwd: path.resolve(HERE, '..', '..') });
    let out = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { out += d; });
    const t = setTimeout(() => { try { p.kill(); } catch (e) { /* deja oprit */ } }, LIMITA_MS);
    p.on('close', cod => {
      clearTimeout(t);
      const linii = out.split(/\r?\n/).map(s => s.trimEnd()).filter(s => s.length);
      const ultima = linii[linii.length - 1] || '';
      const ok = /^\d+$/.test(ultima);
      resolve({ f, cod, linii, fail: ok ? parseInt(ultima, 10) : 1000, ok, sec: Math.round((Date.now() - t0) / 1000) });
    });
  });
}

const rez = [];
for (const f of fisiere) rez.push(await ruleaza(f));
let total = 0, pass = 0, skip = 0;
const tot = [];
for (const r of rez) {
  total += r.fail;
  for (const l of r.linii) {
    if (/^(PASS|FAIL|SKIP) /.test(l)) tot.push(`${r.f}\t${l}`);
    if (/^PASS /.test(l)) pass++;
    if (/^SKIP /.test(l)) skip++;
    if (/^FAIL /.test(l)) console.log(`${r.f}: ${l.slice(0, 300)}`);
  }
  if (!r.ok) console.log(`${r.f}: MASURATOARE PRABUSITA (cod ${r.cod}); ultimele linii: ${r.linii.slice(-3).join(' | ').slice(0, 400)}`);
}
if (jurnal) fs.writeFileSync(jurnal, tot.join('\n') + '\n', 'utf8');
console.log(`PE FISIERE ${rez.map(r => `${r.f}=${r.ok ? r.fail : 'PRABUSIT'}(${r.sec}s)`).join(' ')}`);
console.log(`REZUMAT ${regres ? 'regres' : 'paritate'} fisiere=${rez.length} PASS=${pass} FAIL=${total} SKIP=${skip}`);
console.log(String(fisiere.length ? total : 1000));
