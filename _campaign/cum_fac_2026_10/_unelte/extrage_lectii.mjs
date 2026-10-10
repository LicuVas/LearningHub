// Extrage din lecțiile PUBLICATE (lectii/plan.json, stare=publicat) materialul de care au nevoie fișele „Cum fac…?”:
// pașii (id-ul din bară p1..pN, titlul, textul, „Uite cum”, „Altfel”, „Încearcă”, indiciile), pasul din aplicația
// adevărată și capturile (src, alt, figcaption). Lecția se EVALUEAZĂ (node:vm) cu JocMotor.porneste prins, ca toate
// constantele (IMG, fig, PROVOCARE…) să fie rezolvate exact cum le vede motorul. Nu scrie nimic în lecții.
// Rulare: node extrage_lectii.mjs  -> ../digest/<clasa>_<slug>.json + ../digest/_index.json; ultima linie = nr. erori.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const L = 'C:/00/Projects/LearningHub';
const OUT = path.join(L, '_campaign/cum_fac_2026_10/digest');
fs.mkdirSync(OUT, { recursive: true });
const plan = JSON.parse(fs.readFileSync(path.join(L, 'lectii/plan.json'), 'utf8'));

const faraEtichete = h => String(h || '')
  .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
  .replace(/<kbd>([\s\S]*?)<\/kbd>/g, '[$1]')
  .replace(/<br\s*\/?>/g, ' ').replace(/<\/(p|li)>/g, ' ')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

function capturi(h, dirLectie) {
  const o = [];
  const re = /<figure class="captura">[\s\S]*?<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)"[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>/g;
  let m;
  while ((m = re.exec(String(h || '')))) {
    const abs = path.posix.normalize(path.posix.join(dirLectie, m[1]));   // cale de la rădăcina sitului
    o.push({ src: abs, alt: m[2], w: +m[3], h: +m[4], legenda: faraEtichete(m[5]), exista: fs.existsSync(path.join(L, abs)) });
  }
  return o;
}

function evalueaza(fisier) {
  const s = fs.readFileSync(fisier, 'utf8');
  const blocuri = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(b => b.includes('JocMotor.porneste'));
  if (!blocuri.length) throw new Error('fără JocMotor.porneste');
  let cfg = null;
  const sim = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : sim), apply: () => sim, construct: () => sim });
  // orice nume necunoscut (window, document, SimRegistru, ExcelTest, MutationObserver…) = un „sim” inofensiv
  const p = new Proxy({
    JocMotor: new Proxy({ porneste: c => { cfg = c; } }, { get: (t, k) => (k in t ? t[k] : sim) }),
    console, Math, JSON, Object, Array, String, Number, Date, RegExp, Set, Map, Boolean, Symbol, Error, parseInt, parseFloat,
    encodeURIComponent, decodeURIComponent, isNaN, isFinite, undefined,
  }, { has: () => true, get: (t, k) => (k in t ? t[k] : (k === Symbol.unscopables ? undefined : sim)), set: (t, k, v) => { t[k] = v; return true; } });
  vm.runInNewContext('with(__p){' + blocuri[0] + '\n}', { __p: p }, { timeout: 5000 });
  if (!cfg) throw new Error('porneste n-a fost chemat');
  return cfg;
}

let erori = 0;
const index = [];
for (const [cl, c] of Object.entries(plan.clase)) {
  for (const m of c.module) {
    for (const le of m.lectii) {
      if (le.stare !== 'publicat') continue;
      const cale = le.cale.replace(/\/$/, '');
      const f = path.join(L, cale, 'index.html');
      if (!fs.existsSync(f)) { console.log('LIPSĂ', f); erori++; continue; }
      let cfg;
      try { cfg = evalueaza(f); } catch (e) { console.log('EROARE', cale, e.message); erori++; continue; }
      const Lv = (cfg.nivele || [])[0] || {};
      const pasi = (Lv.pasi || []).map((p, k) => {
        const html = [p.text, p.exemplu, p.altfel].join(' ');
        const inc = [p.incearca, ...(p.inca || [])].filter(Boolean);
        return {
          id: 'p' + (k + 1), titlu: p.t || '',
          text: faraEtichete(p.text), uite_cum: faraEtichete(p.exemplu), altfel: faraEtichete(p.altfel),
          incearca: inc.map(x => ({ cerinta: faraEtichete(x.q), ajutor: faraEtichete(x.ajutor), de_ce: faraEtichete(x.why) })),
          capturi: capturi(html, cale + '/'),
        };
      });
      const A = Lv.aplicatieReala || cfg.aplicatieReala || {}, D = cfg.diploma || {};
      const real = { aplicatie: A.aplicatie || D.aplicatie || '', titlu: A.titlu || '', pasi: (A.pasi || D.provocare || []).map(faraEtichete) };
      const qs = (Lv.qs || []).map(q => ({ q: faraEtichete(q.q), ajutor: faraEtichete(q.ajutor), de_ce: faraEtichete(q.why) }));
      const d = {
        clasa: c.nume, cl, nr: le.nr, modul: le.modul, titlu: le.titlu, cale: cale + '/', cheie: cfg.cheie,
        unitate: cfg.unitateTitlu || '', obiectiv: faraEtichete(Lv.obiectiv), pasi, aplicatie_reala: real, intrebari: qs,
      };
      const nume = `${cl}_${path.posix.basename(cale)}.json`;
      fs.writeFileSync(path.join(OUT, nume), JSON.stringify(d, null, 1), 'utf8');
      const nCap = pasi.reduce((a, p) => a + p.capturi.length, 0), lipsa = pasi.reduce((a, p) => a + p.capturi.filter(x => !x.exista).length, 0);
      index.push({ fisier: nume, clasa: c.nume, nr: le.nr, titlu: le.titlu, cale: d.cale, pasi: pasi.length, capturi: nCap, capturi_lipsa: lipsa, kb: Math.round(JSON.stringify(d).length / 1024) });
      if (lipsa) { console.log('CAPTURI LIPSĂ', cale, lipsa); }
    }
  }
}
fs.writeFileSync(path.join(OUT, '_index.json'), JSON.stringify(index, null, 1), 'utf8');
console.log('lecții extrase:', index.length, '· KB total:', index.reduce((a, x) => a + x.kb, 0));
console.log(erori);
