// Proba rapidă: întrebări de copil -> primul rezultat, pe toate fișele din _sursa (nu reglează nimic).
const fs = require('fs'), path = require('path');
const LH = 'C:/00/Projects/LearningHub';
const C = require(path.join(LH, 'cum-fac/cautare.js'));
const SURSA = path.join(LH, 'cum-fac/_sursa');
const fise = fs.readdirSync(SURSA).filter(n => /^fise_.*\.json$/.test(n)).flatMap(n => JSON.parse(fs.readFileSync(path.join(SURSA, n), 'utf8')));
const sensuri = JSON.parse(fs.readFileSync(path.join(SURSA, 'sensuri.json'), 'utf8'));
const ix = C.creeaza(fise, sensuri);
const Q = [
  ['cum pornesc melodia in audacity', 'audio-audacity-redare'],
  ['cum opresc cantecul', 'audio-audacity-stop'],
  ['pauza la sunet', 'audio-audacity-pauza'],
  ['cum deschid audacity', 'audio-audacity-pornire'],
  ['cum mut linia care arata de unde porneste sunetul', 'audio-audacity-cap-redare-mutare'],
  ['zoom pe linia de timp', 'audio-audacity-marire-micsorare'],
  ['ce inseamna 00h00m03.60s', 'audio-audacity-afisaj-timp'],
  ['unde e liniste pe pista', 'audio-audacity-unda-sunet-liniste'],
  ['clipchamp zonele', 'audio-clipchamp-zone'],
  ['sterg fisierul din descarcari', 'windows-stergere-fisier-descarcat'],
  ['inchid audacity fara sa salvez', 'audio-audacity-inchidere-fara-salvare'],
  ['cum ma duc la inceputul sunetului', 'audio-audacity-inceput-sfarsit'],
  ['deschid sunetul descarcat in audacity', 'audio-audacity-deschidere-sunet'],
  ['la ce secunda e bataia', 'audio-audacity-linia-de-timp-secunda'],
  ['clipchamp play film', 'audio-clipchamp-redare'],
  ['clipchamp mut capul de redare', 'audio-clipchamp-cap-redare'],
];
let ok1 = 0, ok3 = 0;
for (const [q, asteptat] of Q) {
  const r = ix.cauta(q, { max: 3 });
  const ids = r.rezultate.map(x => x.id);
  if (ids[0] === asteptat) ok1++;
  if (ids.includes(asteptat)) ok3++;
  console.log((ids[0] === asteptat ? 'OK ' : ids.includes(asteptat) ? 'T3 ' : 'NU ') + q + ' -> ' + ids.join(', ') + (r.gasit ? '' : ' [gasit=false]'));
}
console.log(`locul 1: ${ok1}/${Q.length} · top 3: ${ok3}/${Q.length}`);
