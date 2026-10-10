// Exportă N fișe „Cum fac…?” alese la întâmplare (sămânță fixă, pe aplicații) exact cu textul pe care îl vede elevul
// pe pagină: titlu, întrebare, scurtătură, pași, rezultat, atenție, „Cuvinte de știut” (fișa + glosarul), captura,
// legătura spre lecție. Pentru proba „elevul de probă” (R8): agentul citește DOAR acest export.
// Rulare: node export_elev.mjs [N=30] [samanta=20261011] -> ../_proba_elev/fise_<samanta>.md + .json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const L = 'C:/00/Projects/LearningHub';
const require = createRequire(import.meta.url);
const Cautare = require(path.join(L, 'cum-fac/cautare.js'));
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(L, 'cum-fac/date.js'), 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
const N = +(process.argv[2] || 30), SEED = +(process.argv[3] || 20261011);

let s = SEED;
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const peAplicatie = { excel: 9, word: 8, powerpoint: 7, windows: 3, web: 3 };
const scale = N / 30;
const ales = [];
// al 4-lea argument: un fișier JSON cu id-uri anume (de reluat) — atunci nu se alege la întâmplare
const LISTA = process.argv[4] ? JSON.parse(fs.readFileSync(process.argv[4], 'utf8')) : null;
if (LISTA) ales.push(...D.fise.filter(f => LISTA.includes(f.id)));
else for (const [ap, k] of Object.entries(peAplicatie)) {
  const lista = D.fise.filter(f => f.aplicatie === ap).slice();
  for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  ales.push(...lista.slice(0, Math.max(1, Math.round(k * scale))));
}
const text = h => String(h || '').replace(/<kbd>([\s\S]*?)<\/kbd>/g, '[$1]').replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const md = [];
const js = [];
for (const f of ales) {
  const t = Cautare.termeniFisa(f, D.termeni || []);
  const s2 = f.sursa || {};
  const leg = `Exersezi în lecția ${f.lectia} (clasa ${f.clasa}): pasul ${String(s2.pas || '').toUpperCase()} «${text(s2.titlu_pas)}»`;
  md.push(`## ${f.id}\n**${text(f.titlu)}** — ${text(f.intrebare)}  ·  aplicația: ${f.aplicatie}${f.scurtatura ? `  ·  scurtătura: ${f.scurtatura}` : ''}\n`);
  f.pasi.forEach((p, i) => md.push(`${i + 1}. ${text(p)}`));
  md.push(`\n**Ce vezi când ai reușit:** ${text(f.rezultat)}`);
  if (f.atentie) md.push(`\n**Atenție:** ${text(f.atentie)}`);
  if (t.length) md.push(`\n**Cuvinte de știut:** ` + t.map(x => `${x.t} = ${x.d}`).join(' · '));
  if (f.captura) md.push(`\n**Captura** (${f.captura.src}): ${text(f.captura.legenda || f.captura.alt)}`);
  md.push(`\n${leg}\n`);
  js.push({ id: f.id, aplicatie: f.aplicatie, captura: f.captura ? path.join(L, f.captura.src) : null });
}
const OUT = path.join(L, '_campaign/cum_fac_2026_10/_proba_elev');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, `fise_${SEED}.md`), `# ${ales.length} fișe, cum le vede elevul (date.js ${D.versiune}, sămânța ${SEED})\n\n` + md.join('\n'), 'utf8');
fs.writeFileSync(path.join(OUT, `fise_${SEED}.json`), JSON.stringify(js, null, 1), 'utf8');
console.log(ales.map(f => f.id).join(' '));
console.log(ales.length);
