// Probele JUCATE ale lecției lectii/viii/m1-l07 (15 exerciții `excelx`: formulele cu + - * / și paranteze, recalcularea,
// codurile de eroare #VALUE! și #DIV/0!, atelierul cu testele numite și motivele lor), scrise ÎNAINTEA legării lecției la
// bibliotecă. Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs.
// La b (greșeala tipică) se cere și MESAJUL din inventar (ce e greșit), nu doar „Nu încă”. Probele în plus:
//   e  o formulă ECHIVALENTĂ scrisă altfel (ordinea schimbată, litere mici, spații, paranteze în alt loc) → „Corect”
//      (simulatorul vechi judeca formula prin rezultat, și pe datele schimbate: tip-excel.js › probleme, auto +3/+6/+9)
//   v  numere scrise de mână în formulă (=5*120) / rezultatul tastat → respins, cu mesajul vechi
//   d  foaia arată ce spune lecția (recalcularea; codurile de eroare de la pornire)
//   m  motivul de sub testul nebifat al atelierului (motive:true; capcanele: =D4/(B2+B3), =B2+C2/2)
//   g  greșeala pusă de poartă (JocMotor.test.gresit): „Nu încă”
// Simulatorul vechi al lecției = jocuri/_motor/tip-excel.js + lectii/_sim/excelx.js + lectii/_sim/excelx-formule.js (ExcelF).
import { ruleaza, ecran } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<!-- foaia „excelx” comună clasei a VIII-a (lecțiile 4-5) + extensia lecției 7: formulele, fidele Excel-ului pe setări românești -->
<script src="../../_sim/excelx.js"></script>
<script src="../../_sim/excelx-formule.js"></script>
`;

/* clic pe celulă; al doilea clic pe ACEEAȘI celulă vine după o pauză de om (un clic imediat ar fi dublu clic = editare) */
const clic = async (u, a) => { if (u._ultima === a) await u.pauza(700); await u.celula(a); u._ultima = a; };
/* gesturile lecției: clic pe prima celulă, apoi fiecare valoare / formulă + Enter (Enter coboară un rând) */
const scrieIn = async (u, a, ...vals) => { await clic(u, a); for (const v of vals) { await u.scrie(v); await u.tasta('Enter'); } u._ultima = null; };
const verif = fn => async u => { await fn(u); await u.verifica(); };
const doarVerifica = async u => { await u.verifica(); };
/* proba d: fă gesturile, apoi uită-te în foaie */
const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u); await u.pauza(250); const e = await ecran(p); return e && bun(e.cel, e) ? true : 'foaia arată altceva: ' + JSON.stringify(e); } });
/* proba e: o formulă echivalentă, scrisă altfel → „Corect” */
const echiv = (nume, a, f, teste) => ({ lit: 'e', nume: `formulă echivalentă scrisă altfel: ${nume}`, corect: verif(u => scrieIn(u, a, ...[].concat(f))), teste });
/* proba g: greșeala pusă de poartă, apoi Verifică */
const dePoarta = () => ({ lit: 'g', nume: 'greșeala porții (JocMotor.test.gresit) e respinsă', fa: async (u, p, x) => {
  const are = await p.evaluate(() => JocMotor.test.gresit());
  if (!are) return 'tipul exercițiului nu are greșeala porții (gresit)';
  await u.pauza(300); await u.verifica();
  const f = await x.fb(p);
  if (f.ok || /Corect!/.test(f.text)) return 'greșeala porții e luată drept „Corect”';
  return /Nu încă/.test(f.text) ? true : `nu e „Nu încă”: ${f.text}`;
} });
/* proba m: motivul de sub testul nebifat (atelierul, motive:true) */
const motiv = (nume, fa, re) => ({ lit: 'm', nume, fa: async (u, p) => {
  await fa(u); await u.pauza(500);
  const t = await p.evaluate(() => [...document.querySelectorAll('#body .xp-motiv, #body .xa-motiv')].map(x => x.textContent.trim()).join(' | '));
  return re.test(t) ? true : `motivul de sub teste nu spune ${re}: „${t}”`;
} });
const VALUE = /C2 arată #VALUE!: Formula calculează cu un text ca și cum ar fi număr\./;

const EX = [
  /* ---- P2 „Datele: fiecare număr în celula lui” ---- */
  { id: 'E01', nav: 'p2', k: 0, ce: '4 în A3 și 7 în B3', ok: verif(async u => { await scrieIn(u, 'A3', '4'); await scrieIn(u, 'B3', '7'); }),
    rau: verif(async u => { await scrieIn(u, 'A3', '4 caiete'); await scrieIn(u, 'B3', '7'); }), mesaj: /A3/,
    raspuns: /4.*7/, aratat: e => e.cel.A3 === '4' && e.cel.B3 === '7' },
  /* ---- P3 „Prima formulă: semnul = și adresele” ---- */
  { id: 'E02', nav: 'p3', k: 0, ce: '=A2*B2 în C2', ok: verif(u => scrieIn(u, 'C2', '=A2*B2')),
    rau: verif(u => scrieIn(u, 'C2', '600')), mesaj: /În C2 ai scris 600, nu o formulă: formula începe cu =\./,
    raspuns: /=A2\*B2/, aratat: e => e.cel.C2 === '600',
    extra: [echiv('=B2*A2 (ordinea schimbată)', 'C2', '=B2*A2'), echiv('=a2*b2 (litere mici)', 'C2', '=a2*b2'), echiv('= A2 * B2 (cu spații)', 'C2', '= A2 * B2'),
      { lit: 'v', nume: '=5*120 (numerele scrise de mână) e respinsă, cu mesajul vechi', respins: verif(u => scrieIn(u, 'C2', '=5*120')), mesaj: /C2 are doar numere scrise de mână\. Folosește adresele celulelor, ca rezultatul să se recalculeze\./ },
      { lit: 'v', nume: '=A2xB2 (x în loc de *) e respinsă: #NAME?, cu mesajul vechi', respins: verif(u => scrieIn(u, 'C2', '=A2xB2')), mesaj: /C2 arată #NAME\?: Excel nu cunoaște cuvântul „A2xB2”: litera x nu înmulțește\. Înmulțirea se scrie cu \*: =A2\*B2\./i },
      inFoaie('după Enter, C2 arată 600', u => scrieIn(u, 'C2', '=A2*B2'), c => c.C2 === '600'),
      dePoarta()] },
  { id: 'E03', nav: 'p3', k: 1, ce: '=A3*B3 în C3', ok: verif(u => scrieIn(u, 'C3', '=A3*B3')),
    rau: verif(u => scrieIn(u, 'C3', '=A2*B3')), mesaj: /C3 dă 35, dar ar trebui să dea 28\./,
    raspuns: /=A3\*B3/, aratat: e => e.cel.C3 === '28',
    extra: [echiv('=B3*A3', 'C3', '=B3*A3')] },
  { id: 'E04', nav: 'p3', k: 2, ce: '=A2+B2 în C2', ok: verif(u => scrieIn(u, 'C2', '=A2+B2')),
    rau: verif(u => scrieIn(u, 'C2', '=45+30')), mesaj: /C2 are doar numere scrise de mână/,
    raspuns: /=A2\+B2/, aratat: e => e.cel.C2 === '75',
    extra: [echiv('=B2+A2 (ordinea schimbată)', 'C2', '=B2+A2'),
      { lit: 'v', nume: 'rezultatul 75 tastat de mână e respins, cu mesajul vechi', respins: verif(u => scrieIn(u, 'C2', '75')), mesaj: /În C2 ai scris 75, nu o formulă/ }] },
  { id: 'E05', nav: 'p3', k: 3, ce: '=A2/B2 în C2', ok: verif(u => scrieIn(u, 'C2', '=A2/B2')),
    rau: verif(u => scrieIn(u, 'C2', '=A2*B2')), mesaj: /C2 dă 240, dar ar trebui să dea 15\./,
    raspuns: /=A2\/B2/, aratat: e => e.cel.C2 === '15',
    extra: [{ lit: 'v', nume: '=B2/A2 (împărțirea pe dos) e respinsă, cu rezultatul ei', respins: verif(u => scrieIn(u, 'C2', '=B2/A2')), mesaj: /C2 dă 0,066667, dar ar trebui să dea 15\./ }] },
  /* ---- P4 „Schimbi un număr, rezultatul se schimbă singur” ---- */
  { id: 'E06', nav: 'p4', k: 0, ce: '10 în A2, C2 arată 1200; alegi 1200', ok: async u => { await scrieIn(u, 'A2', '10'); await u.optiune('1200'); },
    rau: u => u.optiune('600'), rau2: u => u.optiune('10'), mesaj: /Încearcă în foaia de mai sus/, raspuns: /1200/,
    extra: [inFoaie('10 în A2: C2 se reface singur, 1200', u => scrieIn(u, 'A2', '10'), c => c.C2 === '1200' && c.A2 === '10')] },
  { id: 'E07', nav: 'p4', k: 1, ce: '150 în B2, formula rămâne', ok: verif(u => scrieIn(u, 'B2', '150')),
    rau: verif(u => scrieIn(u, 'C2', '750')), mesaj: /În C2 ai scris 750, nu o formulă: formula începe cu =\./,
    raspuns: /150/, aratat: e => e.cel.B2 === '150' && e.cel.C2 === '750',
    extra: [inFoaie('150 în B2: C2 arată 750', u => scrieIn(u, 'B2', '150'), c => c.C2 === '750')] },
  /* ---- P5 „Ordinea operațiilor și parantezele” ---- */
  { id: 'E08', nav: 'p5', k: 0, ce: '=(A2+B2)/2 în C2', ok: verif(u => scrieIn(u, 'C2', '=(A2+B2)/2')),
    rau: verif(u => scrieIn(u, 'C2', '=A2+B2/2')), mesaj: /C2 dă 14, dar ar trebui să dea 9,5\./,
    raspuns: /=\(A2\+B2\)\/2/, aratat: e => e.cel.C2 === '9,5',
    extra: [echiv('=(b2+a2)/2', 'C2', '=(b2+a2)/2'), echiv('=A2/2+B2/2 (altă formulă, același rezultat)', 'C2', '=A2/2+B2/2')] },
  /* ---- P6 „Când apare un cod de eroare” ---- */
  { id: 'E09', nav: 'p6', k: 0, ce: '5 în A2: C2 arată 600', ok: verif(u => scrieIn(u, 'A2', '5')),
    rau: verif(u => scrieIn(u, 'A2', 'cinci')), mesaj: VALUE,
    raspuns: /5/, aratat: e => e.cel.A2 === '5' && e.cel.C2 === '600',
    extra: [inFoaie('la pornire C2 arată #VALUE!', async () => {}, c => c.C2 === '#VALUE!' && c.A2 === '5 bucăți')] },
  { id: 'E10', nav: 'p6', k: 1, ce: '4 în B2: C2 arată 15', ok: verif(u => scrieIn(u, 'B2', '4')),
    rau: verif(u => scrieIn(u, 'B2', '0')), mesaj: /C2 arată #DIV\/0!: Împărțire la zero\./,
    raspuns: /4/, aratat: e => e.cel.B2 === '4' && e.cel.C2 === '15',
    extra: [inFoaie('la pornire C2 arată #DIV/0!', async () => {}, c => c.C2 === '#DIV/0!')] },
  /* ---- Atelierul ---- */
  { id: 'E11', nav: 'atelier', k: 0, ce: 'atelier: bugetul excursiei (D2:D5)', teste: 3,
    ok: verif(u => scrieIn(u, 'D2', '=B2*C2', '=B3*C3', '=D2+D3', '=D4/B2')),
    rau: verif(u => scrieIn(u, 'D2', '=B2*C2', '=B3*C3', '=D2+D3', '=D4/(B2+B3)')), mesaj: /D5 dă 26, dar ar trebui să dea 52\./,
    rau2: doarVerifica, raspuns: /=D4\/B2/, aratat: e => e.cel.D2 === '1000' && e.cel.D3 === '300' && e.cel.D4 === '1300' && e.cel.D5 === '52',
    extra: [echiv('=C2*B2, =C3*B3, =D3+D2, =d4/b2', 'D2', ['=C2*B2', '=C3*B3', '=D3+D2', '=d4/b2']),
      motiv('capcana =D4/(B2+B3): motivul „Ai numărat elevii de două ori”', u => scrieIn(u, 'D2', '=B2*C2', '=B3*C3', '=D2+D3', '=D4/(B2+B3)'), /Ai numărat elevii de două ori/),
      motiv('D5 =D4/25: „ai scris 25 de mână, în loc de B2”', u => scrieIn(u, 'D2', '=B2*C2', '=B3*C3', '=D2+D3', '=D4/25'), /D5 arată bine acum \(52\), dar în formulă ai scris 25 de mână, în loc de B2/),
      motiv('1300 tastat în D4: „ai scris 1300 de mână, nu o formulă”', u => scrieIn(u, 'D4', '1300'), /În D4 ai scris 1300 de mână, nu o formulă/)] },
  { id: 'E12', nav: 'atelier', k: 1, ce: 'atelier 2: mediile (D2:D4)', teste: 3,
    ok: verif(u => scrieIn(u, 'D2', '=(B2+C2)/2', '=(B3+C3)/2', '=(D2+D3)/2')),
    rau: verif(u => scrieIn(u, 'D2', '=B2+C2/2', '=(B3+C3)/2', '=(D2+D3)/2')), mesaj: /D2 dă 12,5, dar ar trebui să dea 8,5\./,
    rau2: doarVerifica, raspuns: /=\(D2\+D3\)\/2/, aratat: e => e.cel.D2 === '8,5' && e.cel.D3 === '7,5' && e.cel.D4 === '8',
    extra: [motiv('capcana =B2+C2/2: motivul „Fără paranteze”', u => scrieIn(u, 'D2', '=B2+C2/2'), /Fără paranteze, Excel face întâi împărțirea: împarte la 2 doar nota din C2/)] },
  /* ---- Întrebările de la sfârșit ---- */
  { id: 'E13', nav: 'q2', ce: 'Î2: =A2-B2 în C2', ok: verif(u => scrieIn(u, 'C2', '=A2-B2')),
    rau: verif(u => scrieIn(u, 'C2', '=B2-A2')), mesaj: /C2 dă -32, dar ar trebui să dea 32\./,
    raspuns: /=A2-B2/, aratat: e => e.cel.C2 === '32' },
  { id: 'E14', nav: 'q4', ce: 'Î4: =(A2+B2+C2)/3 în D2', ok: verif(u => scrieIn(u, 'D2', '=(A2+B2+C2)/3')),
    rau: verif(u => scrieIn(u, 'D2', '=A2+B2+C2/3')), mesaj: /D2 dă 18,666667, dar ar trebui să dea 8\./,
    raspuns: /=\(A2\+B2\+C2\)\/3/, aratat: e => e.cel.D2 === '8',
    extra: [echiv('=(C2+B2+A2)/3', 'D2', '=(C2+B2+A2)/3')] },
  { id: 'E15', nav: 'q5', ce: 'Î5: 10 în A2, C2 arată 30', ok: verif(u => scrieIn(u, 'A2', '10')),
    rau: doarVerifica, mesaj: VALUE,
    raspuns: /10/, aratat: e => e.cel.A2 === '10' && e.cel.C2 === '30' }
];

/* blocul bibliotecii al lecției 7: și excel.js, direct (lecția își desenează mini-foile „Uite cum” cu ExcelTipuri, sincron) */
const SCRIPTURI_NOI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../aplicatii/aplicatii.js"></script>
<script src="../../../aplicatii/excel.js"></script>
<script src="../../../aplicatii/adapters/excel-excelx-adapter.js"></script>
`;

ruleaza({ lectie: '/lectii/viii/m1-l07/index.html', cheie: 'lectie_viii_m1_l07', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, scripturiNoi: SCRIPTURI_NOI, vechiNume: 'tip-excel.js + lectii/_sim/excelx.js + excelx-formule.js', EX });
