// Verificatorul fișelor „Cum fac…?” (poarta R2 din _campaign/cum_fac_2026_10/contract.md).
// Citește cum-fac/_sursa/fise_*.json (sau doar fișierele date ca argumente) și le compară cu lecțiile extrase în
// _campaign/cum_fac_2026_10/digest/ (node _campaign/cum_fac_2026_10/_unelte/extrage_lectii.mjs).
// Rulare: node cum-fac/_build/valideaza_fise.mjs [fise_excel_a.json ...]  -> ultima linie = numărul de probleme.
// Folosit și de build.mjs (export valideaza).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const L = 'C:/00/Projects/LearningHub';
const SURSA = path.join(L, 'cum-fac/_sursa');
const DIGEST = path.join(L, '_campaign/cum_fac_2026_10/digest');
const APLICATII = ['excel', 'word', 'powerpoint', 'windows', 'web'];
const CAMPURI = ['id', 'aplicatie', 'titlu', 'intrebare', 'scurtatura', 'pasi', 'rezultat', 'atentie', 'termeni', 'captura',
  'formulari', 'cuvinte', 'sursa', 'clasa', 'lectia', 'inrudite'];
const ETICHETE_OK = /^(b|\/b|kbd|\/kbd|code|\/code|i|\/i)$/;

// textul unui pas, așa cum îl are digestul (kbd -> [Ctrl]); ancora se caută aici, cu spațiile strânse
const strange = s => String(s || '').replace(/\s+/g, ' ').trim();
function textPas(d, pas) {
  if (pas === 'real') return strange((d.aplicatie_reala.pasi || []).join(' '));
  const p = d.pasi.find(x => x.id === pas);
  if (!p) return null;
  return strange([p.titlu, p.text, p.uite_cum, p.altfel, ...p.incearca.flatMap(x => [x.cerinta, x.ajutor, x.de_ce])].join(' '));
}
// ancora din fișă poate avea <kbd>Ctrl</kbd>; în digest e [Ctrl]
const ancoraPlana = a => strange(String(a || '').replace(/<kbd>([\s\S]*?)<\/kbd>/g, '[$1]').replace(/<[^>]+>/g, ''));

export function incarcaDigest() {
  const ix = JSON.parse(fs.readFileSync(path.join(DIGEST, '_index.json'), 'utf8'));
  const pe = {};
  for (const x of ix) pe[x.cale] = JSON.parse(fs.readFileSync(path.join(DIGEST, x.fisier), 'utf8'));
  return pe;
}

export function valideaza(fisiere, { toate = true } = {}) {
  const digest = incarcaDigest();
  const probleme = [];
  const fise = [];
  for (const f of fisiere) {
    let lista;
    try { lista = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { probleme.push(`${path.basename(f)}: JSON stricat: ${e.message}`); continue; }
    if (!Array.isArray(lista)) { probleme.push(`${path.basename(f)}: trebuie să fie o listă de fișe`); continue; }
    for (const x of lista) fise.push({ ...x, _f: path.basename(f) });
  }
  const ids = new Map();
  for (const x of fise) ids.set(x.id, (ids.get(x.id) || 0) + 1);
  const toateIds = new Set(ids.keys());
  if (!toate) {   // la verificarea unui singur fișier, „înrudite” poate trimite și spre fișele celorlalți
    for (const f of fs.readdirSync(SURSA).filter(n => /^fise_.*\.json$/.test(n))) {
      try { for (const x of JSON.parse(fs.readFileSync(path.join(SURSA, f), 'utf8'))) toateIds.add(x.id); } catch (e) { /* îl raportează rularea lui */ }
    }
  }
  for (const x of fise) {
    const P = m => probleme.push(`${x._f} · ${x.id || '(fără id)'}: ${m}`);
    for (const c of CAMPURI) if (!(c in x)) P(`lipsește câmpul „${c}”`);
    for (const c of Object.keys(x)) if (c !== '_f' && !CAMPURI.includes(c)) P(`câmp necunoscut „${c}”`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(x.id || '')) P('id-ul trebuie să fie de forma aplicatie-ce-face (litere mici, cifre, cratimă)');
    if (ids.get(x.id) > 1) P('id folosit de mai multe ori');
    if (!APLICATII.includes(x.aplicatie)) P(`aplicatie trebuie să fie una din ${APLICATII.join(', ')}`);
    else if (!String(x.id).startsWith(x.aplicatie + '-')) P(`id-ul începe cu „${x.aplicatie}-”`);
    if (!x.titlu || x.titlu.length > 70) P('titlu gol sau mai lung de 70 de caractere');
    if (!/\?$/.test(x.intrebare || '')) P('întrebarea se termină cu „?”');
    if (!Array.isArray(x.pasi) || x.pasi.length < 1 || x.pasi.length > 7) P('pasi: între 1 și 7');
    if (typeof x.scurtatura !== 'string') P('scurtatura e text ("" dacă nu există)');
    if (!x.rezultat) P('rezultat gol: cum își dă seama elevul că a reușit?');
    if (!Array.isArray(x.formulari) || x.formulari.length < 8 || x.formulari.length > 15) P('formulari: între 8 și 15');
    if (!Array.isArray(x.cuvinte)) P('cuvinte: listă');
    if (!Array.isArray(x.termeni) || x.termeni.some(t => !t || !t.t || !t.d)) P('termeni: listă de {t, d}');
    if (!Array.isArray(x.inrudite)) P('inrudite: listă de id-uri');
    else for (const r of x.inrudite) if (!toateIds.has(r)) P(`înrudita „${r}” nu există`);
    // HTML: doar etichetele mici permise
    const html = [...(x.pasi || []), x.rezultat, x.atentie, x.titlu, x.intrebare].join(' ');
    for (const m of html.matchAll(/<\s*([^\s>]+)[^>]*>/g)) if (!ETICHETE_OK.test(m[1])) P(`etichetă HTML nepermisă <${m[1]}>`);
    // diacritice greșite (sedilă) și notații în locul cuvintelor (regula 3, „ce au găsit judecătorii” 3)
    const tot = JSON.stringify(x);
    if (/[şţŞŢ]/.test(tot)) P('ș/ț cu sedilă: folosește ș, ț cu virgulă');
    if (/\b[A-Z]{1,2}\d{1,3}\s*=\s*[A-Za-zĂÂÎȘȚăâîșț]/.test(html)) P('notație „A1 = …” în locul unei propoziții');
    if (/simulator|de sub titlu|butonul Verifică|în pagină|Încearcă tu/i.test(html)) P('pașii descriu pagina/simulatorul, nu aplicația adevărată');
    // sursa: lecție publicată, pas existent, ancoră VERBATIM
    const s = x.sursa || {};
    const d = digest[s.cale];
    if (!d) P(`sursa.cale „${s.cale}” nu e o lecție publicată extrasă`);
    else {
      const t = textPas(d, s.pas);
      if (t == null) P(`sursa.pas „${s.pas}” nu există în ${s.cale} (p1..p${d.pasi.length} sau „real”)`);
      else {
        const a = ancoraPlana(s.ancora);
        if (a.length < 25) P('sursa.ancora: cel puțin 25 de caractere copiate exact din pas');
        else if (!t.includes(a)) P(`sursa.ancora nu apare literal în ${s.cale} ${s.pas}: „${a.slice(0, 60)}…”`);
      }
      if (x.clasa !== d.clasa) P(`clasa „${x.clasa}” ≠ „${d.clasa}”`);
      if (x.lectia !== d.nr) P(`lectia ${x.lectia} ≠ ${d.nr}`);
    }
    if (x.captura != null) {
      const c = x.captura;
      if (!c.src || !fs.existsSync(path.join(L, c.src))) P(`captura „${c.src}” nu există pe disc`);
      if (!c.alt || !c.w || !c.h) P('captura: alt, w, h obligatorii');
    }
  }
  return { fise, probleme };
}

if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
  const arg = process.argv.slice(2);
  const fisiere = arg.length ? arg.map(a => (path.isAbsolute(a) ? a : path.join(SURSA, a)))
    : fs.readdirSync(SURSA).filter(n => /^fise_.*\.json$/.test(n)).map(n => path.join(SURSA, n));
  const { fise, probleme } = valideaza(fisiere, { toate: !arg.length });
  for (const p of probleme) console.log('PROBLEMĂ', p);
  console.log(`fișe: ${fise.length} · fișiere: ${fisiere.length}`);
  console.log(probleme.length);
}
