// Repara termeni.json: aplicatii extinse + intrare noua "rigla" (audio). Pastreaza CRLF; refuza daca formatul nu se reproduce.
const fs = require("fs");
const p = "C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json";
const ser = o => JSON.stringify(o, null, 1).replace(/\n/g, "\r\n");
const raw = fs.readFileSync(p, "utf8");
const g = JSON.parse(raw);
if (ser(g) !== raw) { console.error("formatul nu se reproduce, ma opresc"); process.exit(1); }
const get = (t, ap) => g.find(x => x.t === t && (!ap || (x.aplicatii || []).includes(ap)));
const adauga = (t, ap, nou) => { const x = get(t, ap); if (!x) throw new Error("lipsa " + t); if (!x.aplicatii.includes(nou)) x.aplicatii.push(nou); };
adauga("butonul Start", "windows", "audio");
adauga("cursor", "word", "windows");
adauga("operație", "word", "windows");
if (!g.some(x => x.t === "riglă" && x.aplicatii.includes("audio"))) {
  const i = g.findIndex(x => x.t === "riglă");
  g.splice(i + 1, 0, {
    t: "riglă", forme: ["rigla", "rigle", "riglele", "riglei"], aplicatii: ["audio"],
    d: "linia de timp: o riglă cu secunde (0:00, 0:01, 0:02…), deasupra pistei",
    sursa: { cale: "lectii/vii/m2-l11/", pas: "p3", ancora: "o riglă cu secunde (0:00, 0:01, 0:02…)" }
  });
}
fs.writeFileSync(p, ser(g));
console.log("scris");
