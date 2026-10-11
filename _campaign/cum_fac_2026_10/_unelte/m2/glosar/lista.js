// Listeaza fisele cu termeni neacoperiti: aplicatia, pasul cu termenul, intrarile glosarului care se potrivesc.
const fs = require("fs");
const path = require("path");
const dir = "C:/00/Projects/LearningHub/cum-fac/";
const C = require(dir + "cautare.js");
const glosar = JSON.parse(fs.readFileSync(dir + "_sursa/termeni.json", "utf8"));
let fise = [];
for (const fn of fs.readdirSync(dir + "_sursa")) {
  if (!/^fise_.*\.json$/.test(fn)) continue;
  let j = JSON.parse(fs.readFileSync(dir + "_sursa/" + fn, "utf8"));
  if (!Array.isArray(j)) j = j.fise || [];
  fise = fise.concat(j);
}
const toate = process.argv[2] === "toate";
let n = 0;
for (const f of fise) {
  const neac = C.termeniNeacoperiti(f, glosar);
  if (!neac.length) continue;
  n++;
  console.log("\n== " + f.id + " [" + f.aplicatie + "] neacoperit: " + neac.join(", ") + " | fisa.termeni: " + (f.termeni || []).map(x => x.t).join("; "));
  for (const t of neac) {
    const g = glosar.filter(x => x.t === t);
    g.forEach(x => console.log("   GLOS " + JSON.stringify({ t: x.t, forme: x.forme, aplicatii: x.aplicatii, d: x.d })));
    const k = C.normalizeaza(t);
    (f.pasi || []).forEach((p, i) => { if (C.normalizeaza(p).includes(k)) console.log("   PAS" + (i + 1) + ": " + p); });
  }
}
console.log("\nTOTAL " + n);
