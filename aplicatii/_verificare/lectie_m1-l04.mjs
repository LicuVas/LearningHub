// Probele JUCATE ale lecției lectii/viii/m1-l04 (25 de exerciții `excelx`: adresa, selectarea, copierea, mutarea, golirea,
// scoaterea de rânduri / coloane), scrise ÎNAINTEA extinderii adaptorului aplicatii/adapters/excel-excelx-adapter.js.
// Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs. Probele în plus ale lecției:
//   d  la exercițiile cu variante de răspuns: foaia chiar arată ce spune răspunsul bun (elevul „încearcă în foaie”)
//   e  al doilea drum cerut de lecție (panglica, Golire conținut / Clear Contents)
//   v  „Exersează pe variante” (cele 3 exerciții de selectare): o variantă rezolvată → „Corect! Serie: 1/3”; una greșită → „Nu încă”
// Simulatorul vechi al lecției = jocuri/_motor/tip-excel.js + învelișul ExcelPlus scris chiar în pagina lecției.
import { ruleaza, interfata, ecran, VECHI } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
`;

/* gesturile lecției, din bucăți */
const copiaza = async (u, a, b, la) => { await u.trage(a, b); await u.tasta('Control+c'); await u.celula(la); await u.tasta('Control+v'); };
const muta = async (u, a, b, la) => { await u.trage(a, b); await u.tasta('Control+x'); await u.celula(la); await u.tasta('Control+v'); };
const scoateRand = async (u, n) => { await u.clicDreapta('rand:' + n); await u.meniu('Delete'); };
const stergeCelula = async (u, a) => { await u.clicDreapta('celula:' + a); await u.meniu('Delete...'); await u.dialogOK(); };
/* proba d: fă gesturile, apoi uită-te în foaie */
const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u); const e = await ecran(p); return e && bun(e.cel, e) ? true : 'foaia arată altceva: ' + JSON.stringify(e); } });
/* proba v: „Exersează pe variante” — zona cerută de variantă se citește din textul ei */
const peVariante = {
  lit: 'v', nume: '„Exersează pe variante”: varianta rezolvată e „Corect”, una greșită e „Nu încă”, „Gata cu exersarea” readuce sarcina',
  fa: async (u, p) => {
    await u.ok0(u);
    const b = p.locator('#body [data-exs]');
    if (!(await b.count())) return 'după „Corect” nu apare butonul „Exersează pe variante”';
    await b.click(); await p.waitForTimeout(VECHI ? 500 : 1500);
    const uv = interfata(p, '#body .xl-ex');
    /* zona cerută: din textul variantei; când textul o spune doar în cuvinte (E04), din foaia variantei (u.zonaVar) */
    const zonaDin = async () => {
      const t = await p.locator('#body .xl-ex .q').first().textContent(); const m = t.match(/\b([A-Z]\d+):([A-Z]\d+)\b/);
      if (m) return [m[1], m[2], t];
      const e = u.zonaVar ? await ecran(p, '#body .xl-ex') : null, z = e ? u.zonaVar(e.cel) : null;
      return z ? [z[0], z[1], t] : [null, null, t];
    };
    const starea = () => p.evaluate(() => { const f = document.querySelector('#body .xl-ex #xexf'); return f ? f.textContent.trim() : ''; });
    let [a, z, t] = await zonaDin();
    if (!a) return 'varianta nu spune o zonă: ' + t;
    await uv.trage(a, z); await uv.verifica();
    let s = await starea();
    if (!/Corect!.*Serie: 1\/3/.test(s)) return `varianta ${a}:${z} rezolvată nu e „Corect! Serie: 1/3”: ${s}`;
    await p.locator('#body .xl-ex [data-exa]').click(); await p.waitForTimeout(VECHI ? 500 : 1500);
    [a, z, t] = await zonaDin();
    if (!a) return 'a doua variantă nu spune o zonă: ' + t;
    await uv.celula(a); await uv.verifica();
    s = await starea();
    if (!/Nu încă/.test(s) || /Corect!/.test(s)) return 'varianta greșită (un singur clic) nu e „Nu încă”: ' + s;
    await p.locator('#body .xl-ex [data-exg]').click(); await p.waitForTimeout(300);
    const inapoi = await p.evaluate(() => { const q = document.querySelector('.q, #pq'), ex = document.querySelector('#body .xl-ex'); return !!(q && q.offsetParent) && !ex && !!document.querySelector('#body [data-exs]'); });
    if (!inapoi) return '„Gata cu exersarea” nu a readus sarcina de bază';
    /* foaia sarcinii de bază e iar pe ecran, cu tabelul ei (pe simulatorul vechi, foaia unei sarcini rezolvate nu mai primește clicuri) */
    await p.waitForTimeout(VECHI ? 100 : 1500); const e = await ecran(p);
    return e && e.cel.A1 === 'Elev' && e.cel.C6 === '7' ? true : 'după „Gata cu exersarea”, foaia sarcinii nu mai e pe ecran: ' + JSON.stringify(e);
  }
};
const cuVariante = (ok, zonaVar) => Object.assign({}, peVariante, { fa: (u, p) => peVariante.fa(Object.assign(u, { ok0: ok, zonaVar }), p) });
/* E04, varianta: „toate notele” ultimilor trei elevi = de sub capul „Nota 1”, rândurile 3-5 de sub cap, două coloane */
const noteleUltimilorTrei = cel => {
  const a = Object.keys(cel).find(k => cel[k] === 'Nota 1'); if (!a) return null;
  const m = a.match(/^([A-Z])(\d+)$/), c = m[1].charCodeAt(0), r = Number(m[2]);
  return [String.fromCharCode(c) + (r + 3), String.fromCharCode(c + 1) + (r + 5)];
};

const selA2B4 = async u => { await u.trage('A2', 'B4'); await u.verifica(); };
const selB4C6 = async u => { await u.trage('B4', 'C6'); await u.verifica(); };
const selShift = async u => { await u.celula('A1'); await u.shiftClic('C6'); await u.verifica(); };
const atelier = async (u, cuRand) => {
  await muta(u, 'F1', 'F6', 'D1');
  if (cuRand) await scoateRand(u, 5); else { await u.trage('A5', 'D5'); await u.tasta('Delete'); }
  await u.trage('A1', 'A6'); await u.tasta('Control+c'); await u.celula('E1'); await u.tasta('Control+v'); await u.tasta('Escape');
  await u.celula(cuRand ? 'B7' : 'B8'); await u.tasta('Delete');
  await u.verifica();
};

const EX = [
  { id: 'E01', nav: 'p2', k: 0, ce: 'clic pe C5 (Nota 2 a Danei)', ok: async u => { await u.celula('C5'); await u.verifica(); }, rau: async u => { await u.celula('B5'); await u.verifica(); },
    raspuns: /C5/, aratat: e => e.activa === 'C5' },
  { id: 'E02', nav: 'p2', k: 1, ce: 'clic pe Bogdan, răspuns A3', ok: async u => { await u.celula('A3'); await u.optiune('A3'); }, rau: async u => { await u.optiune('B3'); }, rau2: async u => { await u.optiune('3A'); },
    raspuns: /A3/, extra: [inFoaie('clic pe Bogdan: caseta de nume arată A3', u => u.celula('A3'), (c, e) => e.activa === 'A3')] },
  { id: 'E03', nav: 'p3', k: 0, ce: 'zona A2:B4, trasă', ok: selA2B4, rau: async u => { await u.celula('A2'); await u.celula('B4'); await u.verifica(); },
    raspuns: /A2:B4/, aratat: e => e.zona === 'A2:B4', extra: [cuVariante(selA2B4)] },
  { id: 'E04', nav: 'p3', k: 1, ce: 'zona B4:C6, trasă', ok: selB4C6, rau: async u => { await u.trage('B4', 'B6'); await u.verifica(); },
    raspuns: /B4:C6/, aratat: e => e.zona === 'B4:C6', extra: [cuVariante(selB4C6, noteleUltimilorTrei)] },
  { id: 'E05', nav: 'p3', k: 2, ce: 'A1, apoi Shift+clic pe C6', ok: selShift, rau: async u => { await u.celula('A1'); await u.celula('C6'); await u.verifica(); },
    raspuns: /A1:C6/, aratat: e => e.zona === 'A1:C6', extra: [cuVariante(selShift)] },
  { id: 'E06', nav: 'p3', k: 4, ce: 'tragere din C5 la A3: caseta de nume arată C5', ok: async u => { await u.trage('C5', 'A3'); await u.optiune('C5'); }, rau: async u => { await u.optiune('A3:C5'); }, rau2: async u => { await u.optiune('A3'); },
    raspuns: /C5/, extra: [inFoaie('după tragerea C5 → A3, caseta de nume arată C5', u => u.trage('C5', 'A3'), (c, e) => e.activa === 'C5')] },
  { id: 'E07', nav: 'p4', k: 0, ce: 'copiezi A1:B3 în D1 (Ctrl+C, Ctrl+V)', ok: async u => { await copiaza(u, 'A1', 'B3', 'D1'); await u.verifica(); }, rau: async u => { await muta(u, 'A1', 'B3', 'D1'); await u.verifica(); },
    raspuns: /Elev/, aratat: e => e.cel.D1 === 'Elev' && e.cel.E3 === '7' && e.cel.A1 === 'Elev' && e.cel.B3 === '7' },
  { id: 'E08', nav: 'p4', k: 1, ce: 'copiezi A2:A4 peste echipa din C2', ok: async u => { await copiaza(u, 'A2', 'A4', 'C2'); await u.verifica(); }, rau: async u => { await copiaza(u, 'A2', 'A4', 'C1'); await u.verifica(); },
    raspuns: /Cristi/, aratat: e => e.cel.C2 === 'Ana' && e.cel.C4 === 'Cristi' && e.cel.C1 === 'Echipa' && e.cel.A2 === 'Ana' },
  { id: 'E09', nav: 'p4', k: 2, ce: 'lipești de două ori: tabelul apare încă o dată', ok: async u => { await copiaza(u, 'A1', 'B2', 'D1'); await u.celula('D4'); await u.tasta('Control+v'); await u.optiune('Tabelul apare încă o dată, din D4'); },
    rau: async u => { await u.optiune('Nu se mai lipește nimic'); }, rau2: async u => { await u.optiune('Apare un mesaj de eroare'); }, raspuns: /încă o dată/,
    extra: [inFoaie('după copiere, a doua lipire (în D4) aduce iar tabelul', async u => { await copiaza(u, 'A1', 'B2', 'D1'); await u.celula('D4'); await u.tasta('Control+v'); }, c => c.D1 === 'Elev' && c.E2 === '9' && c.D4 === 'Elev' && c.E5 === '9' && c.A1 === 'Elev')] },
  { id: 'E10', nav: 'p5', k: 0, ce: 'copiezi A1:B2 în D1 doar cu mouse-ul (clic dreapta › Copy, clic dreapta › Paste)',
    ok: async u => { await u.trage('A1', 'B2'); await u.clicDreapta('celula:A1'); await u.meniu('Copy'); await u.clicDreapta('celula:D1'); await u.meniu('Paste'); await u.verifica(); },
    /* greșeala tipică: copierea iese bine, dar cu tastele */
    rau: async u => { await copiaza(u, 'A1', 'B2', 'D1'); await u.verifica(); },
    /* a doua greșeală: cu mouse-ul, dar lipit un rând mai jos (D2) — abia acum lecția oferă „Arată-mi răspunsul” (pe simulatorul
       vechi, mesajul „dă comenzile cu mouse-ul” nu aduce butonul) */
    rau2: async u => { await u.trage('A1', 'B2'); await u.clicDreapta('celula:A1'); await u.meniu('Copy'); await u.clicDreapta('celula:D2'); await u.meniu('Paste'); await u.verifica(); },
    raspuns: /Produs/, aratat: e => e.cel.D1 === 'Produs' && e.cel.E2 === '5' && e.cel.A1 === 'Produs',
    extra: [{ lit: 'e', nume: 'corect și cu butoanele Copy / Paste din fila Home', corect: async u => { await u.trage('A1', 'B2'); await u.panglica('Copy'); await u.celula('D1'); await u.panglica('Paste'); await u.verifica(); } }] },
  { id: 'E11', nav: 'p6', k: 0, ce: 'muți A1:B2 în C3 (Ctrl+X, Ctrl+V)', ok: async u => { await muta(u, 'A1', 'B2', 'C3'); await u.verifica(); }, rau: async u => { await copiaza(u, 'A1', 'B2', 'C3'); await u.verifica(); },
    raspuns: /Produs/, aratat: e => e.cel.C3 === 'Produs' && e.cel.D4 === '5' && !e.cel.A1 && !e.cel.B2 },
  { id: 'E12', nav: 'p6', k: 1, ce: 'muți notele din D1:D4 în B1:B4', ok: async u => { await muta(u, 'D1', 'D4', 'B1'); await u.verifica(); }, rau: async u => { await muta(u, 'D1', 'D4', 'B2'); await u.verifica(); },
    raspuns: /Nota/, aratat: e => e.cel.B1 === 'Nota' && e.cel.B4 === '10' && !e.cel.D1 && !e.cel.D4 },
  { id: 'E13', nav: 'p6', k: 2, ce: 'după decupare lipești o singură dată', ok: async u => { await muta(u, 'A1', 'A2', 'C1'); await u.celula('E1'); await u.tasta('Control+v'); await u.optiune('Nu se mai lipește nimic'); },
    rau: async u => { await u.optiune('Numele apar și în E1:E2'); }, rau2: async u => { await u.optiune('Apare un mesaj de eroare'); }, raspuns: /Nu se mai lipește nimic/,
    extra: [inFoaie('după decupare, a doua lipire (în E1) nu aduce nimic', async u => { await muta(u, 'A1', 'A2', 'C1'); await u.celula('E1'); await u.tasta('Control+v'); }, c => c.C1 === 'Ana' && c.C2 === 'Bogdan' && !c.E1 && !c.E2 && !c.A1)] },
  { id: 'E14', nav: 'p7', k: 0, ce: 'golești C3 cu Delete', ok: async u => { await u.celula('C3'); await u.tasta('Delete'); await u.verifica(); },
    /* greșeala tipică (capcana din pasul 8): clic dreapta › Delete… scoate celula și urcă observația lui Cristi */
    rau: async u => { await stergeCelula(u, 'C3'); await u.verifica(); },
    raspuns: /C3/, aratat: e => !e.cel.C3 && e.cel.C4 === 'premiul I' && e.cel.B3 === '7',
    extra: [{ lit: 'e', nume: 'corect și cu clic dreapta › Clear Contents', corect: async u => { await u.clicDreapta('celula:C3'); await u.meniu('Clear Contents'); await u.verifica(); } }] },
  { id: 'E15', nav: 'p7', k: 1, ce: 'golești B3:C3 dintr-o dată', ok: async u => { await u.trage('B3', 'C3'); await u.tasta('Delete'); await u.verifica(); }, rau: async u => { await u.celula('B3'); await u.tasta('Delete'); await u.verifica(); },
    raspuns: /B3/, aratat: e => !e.cel.B3 && !e.cel.C3 && e.cel.A3 === 'Bogdan' && e.cel.B4 === '10' },
  { id: 'E16', nav: 'p7', k: 2, ce: 'Delete, apoi Ctrl+Z: notele revin', ok: async u => { await u.trage('B2', 'C4'); await u.tasta('Delete'); await u.tasta('Control+z'); await u.optiune('Revin exact cum erau'); },
    rau: async u => { await u.optiune('Rămân șterse'); }, rau2: async u => { await u.optiune('Se golește tot tabelul'); }, raspuns: /Revin exact cum erau/,
    extra: [inFoaie('Delete golește B2:C4', async u => { await u.trage('B2', 'C4'); await u.tasta('Delete'); }, c => !c.B2 && !c.C4 && !c.B3 && c.B5 === '6' && c.A2 === 'Ana'),
      inFoaie('Ctrl+Z după Delete repune notele', async u => { await u.trage('B2', 'C4'); await u.tasta('Delete'); await u.tasta('Control+z'); }, c => c.B2 === '9' && c.C2 === '10' && c.B4 === '10' && c.C4 === '6')] },
  { id: 'E17', nav: 'p8', k: 0, ce: 'scoți rândul lui Bogdan (clic dreapta pe 3 › Delete)', ok: async u => { await scoateRand(u, 3); await u.verifica(); },
    rau: async u => { await u.trage('A3', 'C3'); await u.tasta('Delete'); await u.verifica(); },
    raspuns: /Cristi/, aratat: e => e.cel.A3 === 'Cristi' && e.cel.C3 === '6' && e.cel.A5 === 'Elena' && !e.cel.A6,
    extra: [{ lit: 'e', nume: 'corect și cu numărul rândului + pictograma Delete din panglică', corect: async u => { await u.clicPe('rand:3'); await u.panglica('Delete'); await u.verifica(); } }] },
  { id: 'E18', nav: 'p8', k: 1, ce: 'scoți coloana Absențe (clic dreapta pe B › Delete)', ok: async u => { await u.clicDreapta('coloana:B'); await u.meniu('Delete'); await u.verifica(); },
    rau: async u => { await u.clicPe('coloana:B'); await u.tasta('Delete'); await u.verifica(); },
    raspuns: /Nota/, aratat: e => e.cel.B1 === 'Nota' && e.cel.B3 === '7' && !e.cel.C1 && !e.cel.C3 },
  { id: 'E19', nav: 'p8', k: 2, ce: 'capcana: Delete… › Shift cells up urcă observația', ok: async u => { await stergeCelula(u, 'C3'); await u.optiune('Urcă în C3, lângă Bogdan'); },
    rau: async u => { await u.optiune('Rămâne în C4'); }, rau2: async u => { await u.optiune('Dispare de tot'); }, raspuns: /Urcă în C3/,
    extra: [inFoaie('Delete… cu „Shift cells up” lăsat bifat urcă „premiul I” în C3', u => stergeCelula(u, 'C3'), c => c.C3 === 'premiul I' && !c.C4 && c.B4 === '10' && c.A4 === 'Cristi')] },
  { id: 'E20', nav: 'atelier', k: 0, ce: 'atelier: muți absențele, scoți rândul Danei, copiezi numele, golești ciorna', ok: u => atelier(u, true),
    /* greșeala tipică: rândul Danei doar golit, nu scos */
    rau: u => atelier(u, false), teste: 4, raspuns: /Absențe/,
    aratat: e => e.cel.D1 === 'Absențe' && e.cel.A5 === 'Elena' && e.cel.E5 === 'Elena' && e.cel.D5 === '0' && !e.cel.A6 && !e.cel.F1 && !e.cel.B7 && !e.cel.B8 },
  { id: 'E21', nav: 'atelier', k: 1, ce: 'atelier 2: scoți rândul riglei, apoi copiezi tabelul în A6', ok: async u => { await scoateRand(u, 3); await copiaza(u, 'A1', 'C3', 'A6'); await u.verifica(); },
    /* greșeala tipică: ordinea inversă — copia ia și rigla */
    rau: async u => { await copiaza(u, 'A1', 'C3', 'A6'); await scoateRand(u, 3); await u.verifica(); }, teste: 3, raspuns: /Pix/,
    aratat: e => e.cel.A3 === 'Pix' && e.cel.A6 === 'Produs' && e.cel.A8 === 'Pix' && e.cel.C8 === '35' && !e.cel.A4 },
  { id: 'E22', nav: 'q2', ce: 'Î2: zona A3:C5', ok: async u => { await u.trage('A3', 'C5'); await u.verifica(); }, rau: async u => { await u.trage('A3', 'B5'); await u.verifica(); },
    raspuns: /A3:C5/, aratat: e => e.zona === 'A3:C5' },
  { id: 'E23', nav: 'q3', ce: 'Î3: copiezi orarul A1:C3 în A5', ok: async u => { await copiaza(u, 'A1', 'C3', 'A5'); await u.verifica(); }, rau: async u => { await muta(u, 'A1', 'C3', 'A5'); await u.verifica(); },
    raspuns: /Ora/, aratat: e => e.cel.A5 === 'Ora' && e.cel.C7 === 'Engleză' && e.cel.A1 === 'Ora' && e.cel.C3 === 'Engleză' },
  { id: 'E24', nav: 'q4', ce: 'Î4: muți absențele din E1:E4 în C1', ok: async u => { await muta(u, 'E1', 'E4', 'C1'); await u.verifica(); }, rau: async u => { await copiaza(u, 'E1', 'E4', 'C1'); await u.verifica(); },
    raspuns: /Absențe/, aratat: e => e.cel.C1 === 'Absențe' && e.cel.C4 === '1' && !e.cel.E1 && !e.cel.E4 },
  { id: 'E25', nav: 'q5', ce: 'Î5: scoți rândul lui Cristi, golești Nota 2 a Anei', ok: async u => { await scoateRand(u, 4); await u.celula('C2'); await u.tasta('Delete'); await u.verifica(); },
    /* greșeala tipică: nota Anei scoasă cu Delete… — notele de sub ea urcă */
    rau: async u => { await scoateRand(u, 4); await stergeCelula(u, 'C2'); await u.verifica(); },
    raspuns: /Dana/, aratat: e => e.cel.A4 === 'Dana' && e.cel.C4 === '9' && e.cel.C3 === '8' && !e.cel.C2 && !e.cel.A6 }
];

ruleaza({ lectie: '/lectii/viii/m1-l04/index.html', cheie: 'lectie_viii_m1_l04', parcurs: { ps: [0, 1, 2, 3, 4, 5, 6, 7], pn: 8, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, vechiNume: 'tip-excel.js + ExcelPlus din pagina lecției', EX });
