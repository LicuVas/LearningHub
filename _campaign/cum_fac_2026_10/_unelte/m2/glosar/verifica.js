const fs=require("fs");const D="C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/digest/";
const g=JSON.parse(fs.readFileSync("C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json","utf8"));
const x=g.find(t=>t.t==="riglă"&&t.aplicatii.includes("audio"));
const j=JSON.parse(fs.readFileSync(D+"vii_m2-l11.json","utf8"));
const p=JSON.stringify(j).includes("p3")&&(j.pasi||j.pasi_lectie||[]);
const s=JSON.stringify(j).replace(/\s+/g," ");
console.log("ancora gasita:",s.includes(x.sursa.ancora));
const raw=fs.readFileSync("C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json","utf8");
console.log("CRLF fara LF gol:",!/[^\r]\n/.test(raw));
