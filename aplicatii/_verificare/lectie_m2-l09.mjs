// Probele JUCATE ale lecției lectii/viii/m2-l09 (13 exerciții `excelx`: condiția ca comparație, funcția IF cu numere și cu
// text între ghilimele drepte, condiția pe rezultatul altei formule, situația-problemă, atelierele cu testele numite), scrise
// ÎNAINTEA legării lecției la bibliotecă. Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs.
// La b (greșeala tipică) se cere și MESAJUL din inventar (ce e greșit), nu doar „Nu încă”. Probele în plus:
//   e  al doilea drum bun: o formulă IF echivalentă scrisă altfel (semnul întors, cu ramurile inversate), textul fără diacritice
//   v  o greșeală cu mesajul ei vechi: ramurile schimbate între ele, textul fără ghilimele (#NAME?), rezultatul tastat de mână,
//      semnul greșit la limită (< în loc de <=), funcția cerută lipsă (SUM / MAX în atelier)
//   d  foaia arată ce spune lecția;  t  testele atelierului (câte se bifează);  g  greșeala porții (JocMotor.test.gresit)
// Datele schimbate ale foii (+3 / +6 / +9) și variantele exercițiului trec prin AMBELE ramuri ale fiecărei condiții (verificat
// la scrierea probelor: variants are câte o valoare de la limită și una de fiecare parte), deci o ramură greșită nu poate trece.
// Simulatorul vechi al lecției = jocuri/_motor/tip-excel.js + lectii/_sim/excelx.js + excelx-formule.js + excelx-decizie.js (ExcelD).
import { ruleaza, ecran } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<!-- foaia „excelx” comună clasei a VIII-a (lecțiile 4-5) + formulele (lecția 7) + extensia lecției 9: funcția IF, fidelă
     Excel-ului pe setări românești (probat în Excel real: _proba/proba_ascuns*.json) -->
<script src="../../_sim/excelx.js"></script>
<script src="../../_sim/excelx-formule.js"></script>
<script src="../../_sim/excelx-decizie.js"></script>
`;

/* clic pe celulă; al doilea clic pe ACEEAȘI celulă vine după o pauză de om (un clic imediat ar fi dublu clic = editare) */
const clic = async (u, a) => { if (u._ultima === a) await u.pauza(700); await u.celula(a); u._ultima = a; };
const scrieIn = async (u, a, ...vals) => { await clic(u, a); for (const v of vals) { await u.scrie(v); await u.tasta('Enter'); } u._ultima = null; };
const verif = fn => async u => { await fn(u); await u.verifica(); };
const doarVerifica = async u => { await u.verifica(); };

const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u); await u.pauza(250); const e = await ecran(p); return e && bun(e.cel, e) ? true : 'foaia arată altceva: ' + JSON.stringify(e); } });
const echiv = (nume, fa) => ({ lit: 'e', nume, corect: verif(fa) });
const gresit = (nume, fa, mesaj) => ({ lit: 'v', nume, respins: verif(fa), mesaj });
const testeBifate = (nume, fa, n) => ({ lit: 't', nume, fa: async (u, p) => { await fa(u); await u.pauza(600);
  const k = await p.evaluate(() => document.querySelectorAll('#body .xp-teste li.ok, #body .xa-teste li.ok').length);
  return k === n ? true : `testele bifate: ${k}, nu ${n}`; } });
const dePoarta = () => ({ lit: 'g', nume: 'greșeala porții (JocMotor.test.gresit) e respinsă', fa: async (u, p, x) => {
  const are = await p.evaluate(() => JocMotor.test.gresit());
  if (!are) return 'tipul exercițiului nu are greșeala porții (gresit)';
  await u.pauza(300); await u.verifica();
  const f = await x.fb(p);
  if (f.ok || /Corect!/.test(f.text)) return 'greșeala porții e luată drept „Corect”';
  return /Nu încă/.test(f.text) ? true : `nu e „Nu încă”: ${f.text}`;
} });

/* mesajele vechi (lectii/_sim/excelx-decizie.js; textele culese pe ecran în inventar_m2-l09.md) */
const LIMITA = a => new RegExp(`${a} (dă rezultatul bun acum, dar )?greșește la limită.*Apoi uită-te la semnul de comparare: la limită, regula trebuie să ia și valoarea egală sau nu\\?`);
/* cuvântul fără ghilimele: foaia veche trece formula tastată cu litere mari („LA”), deci cuvântul se caută fără diferență de litere */
const FARA_GHILIMELE = w => new RegExp(`Excel nu cunoaște cuvântul „${w}”, deci arată #NAME\\?\\. Un text din formulă se scrie între ghilimele drepte: "${w}"\\.`, 'i');
const NU_FORMULA = (a, t) => new RegExp(`În ${a} ai scris ${t}, nu o formulă: formula începe cu =\\.`);
const DA_DAR = (a, x, y) => new RegExp(`${a} dă ${x}, dar ar trebui să dea ${y}\\.`);
const SE_CERE = (a, fn) => new RegExp(`${a} dă rezultatul bun, dar aici se cere funcția ${fn}: =${fn}\\(…\\), cu zona între paranteze\\.`);

const F_TIMP = '=IF(B2<=14;"la timp";"cu întârziere")';
const ATEL_D = ['=IF(B2<14;10;20)', '=IF(B3<14;10;20)', '=IF(B4<14;10;20)'];
const ATEL_E = ['=IF(C2="da";"merge";"nu merge")', '=IF(C3="da";"merge";"nu merge")', '=IF(C4="da";"merge";"nu merge")'];
const atelier = (d, e, d5 = '=SUM(D2:D4)') => async u => { await scrieIn(u, 'D2', ...d, ...(d5 ? [d5] : [])); if (e) await scrieIn(u, 'E2', ...e); };
const SAR = ['=IF(B2>=3,5;"calificat";"necalificat")', '=IF(B3>=3,5;"calificat";"necalificat")', '=IF(B4>=3,5;"calificat";"necalificat")'];
const sarituri = (c, b5 = '=MAX(B2:B4)') => async u => { await scrieIn(u, 'C2', ...c); if (b5) await scrieIn(u, 'B5', b5); };

const EX = [
  /* ---- P2 „Condiția: o comparație adevărată sau falsă” ---- */
  { id: 'E01', nav: 'p2', k: 0, ce: '=B2<=15 în C2', ok: verif(u => scrieIn(u, 'C2', '=B2<=15')),
    rau: verif(u => scrieIn(u, 'C2', '=B2<15')), mesaj: LIMITA('C2'),
    raspuns: /=B2<=15/, aratat: e => e.cel.C2 === 'TRUE',
    extra: [echiv('=15>=B2 (comparația întoarsă) → Corect', u => scrieIn(u, 'C2', '=15>=B2')),
      gresit('TRUE tastat de mână e respins', u => scrieIn(u, 'C2', 'TRUE'), /C2/),
      inFoaie('după Enter, C2 arată TRUE', u => scrieIn(u, 'C2', '=B2<=15'), c => c.C2 === 'TRUE'),
      dePoarta()] },
  { id: 'E02', nav: 'p2', k: 2, ce: '=B2<>0 în C2', ok: verif(u => scrieIn(u, 'C2', '=B2<>0')),
    rau: verif(u => scrieIn(u, 'C2', '=B2=0')), mesaj: DA_DAR('C2', 'FALSE', 'TRUE'),
    raspuns: /=B2<>0/, aratat: e => e.cel.C2 === 'TRUE' },
  /* ---- P3 „Funcția IF: condiția și cele două rezultate” ---- */
  { id: 'E03', nav: 'p3', k: 0, ce: F_TIMP + ' în C2', ok: verif(u => scrieIn(u, 'C2', F_TIMP)),
    rau: verif(u => scrieIn(u, 'C2', '=IF(B2<14;"la timp";"cu întârziere")')), mesaj: LIMITA('C2'),
    raspuns: /=IF\(B2<=14;"la timp";"cu întârziere"\)/, aratat: e => e.cel.C2 === 'la timp',
    extra: [gresit('ramurile schimbate între ele (condiția întoarsă) sunt respinse', u => scrieIn(u, 'C2', '=IF(B2<=14;"cu întârziere";"la timp")'), DA_DAR('C2', '„cu întârziere”', '„la timp”')),
      gresit('textul fără ghilimele e respins: #NAME?, cu mesajul despre ghilimele', u => scrieIn(u, 'C2', '=IF(B2<=14;la timp;cu întârziere)'), FARA_GHILIMELE('la')),
      echiv('=IF(B2>14;"cu întârziere";"la timp") (> cu ramurile inversate) → Corect', u => scrieIn(u, 'C2', '=IF(B2>14;"cu întârziere";"la timp")')),
      gresit('rezultatul „la timp” tastat de mână e respins', u => scrieIn(u, 'C2', 'la timp'), NU_FORMULA('C2', 'la timp')),
      echiv('textul fără diacritice ("cu intarziere") → Corect', u => scrieIn(u, 'C2', '=IF(B2<=14;"la timp";"cu intarziere")')),
      inFoaie('după Enter, C2 arată la timp', u => scrieIn(u, 'C2', F_TIMP), c => c.C2 === 'la timp')] },
  { id: 'E04', nav: 'p3', k: 2, ce: '=IF(B2>100;"reducere";"preț întreg") în C2', ok: verif(u => scrieIn(u, 'C2', '=IF(B2>100;"reducere";"preț întreg")')),
    rau: verif(u => scrieIn(u, 'C2', '=IF(B2>=100;"reducere";"preț întreg")')), mesaj: LIMITA('C2'),
    raspuns: /=IF\(B2>100;"reducere";"preț întreg"\)/, aratat: e => e.cel.C2 === 'reducere',
    extra: [echiv('=IF(B2<=100;"preț întreg";"reducere") (<= cu ramurile inversate) → Corect', u => scrieIn(u, 'C2', '=IF(B2<=100;"preț întreg";"reducere")')),
      gresit('ramurile schimbate între ele sunt respinse', u => scrieIn(u, 'C2', '=IF(B2>100;"preț întreg";"reducere")'), DA_DAR('C2', '„preț întreg”', '„reducere”'))] },
  /* ---- P4 „Textul din rezultat: între ghilimele drepte” ---- */
  { id: 'E05', nav: 'p4', k: 0, ce: 'C2 reparată: =IF(B2="da";"merge";"nu merge")', ok: verif(u => scrieIn(u, 'C2', '=IF(B2="da";"merge";"nu merge")')),
    rau: doarVerifica, mesaj: FARA_GHILIMELE('merge'),
    raspuns: /=IF\(B2="da";"merge";"nu merge"\)/, aratat: e => e.cel.C2 === 'merge',
    extra: [gresit('doar „merge” pus între ghilimele: #NAME? pentru „nu”', u => scrieIn(u, 'C2', '=IF(B2="da";"merge";nu merge)'), FARA_GHILIMELE('nu')),
      echiv('=IF(B2<>"da";"nu merge";"merge") (<> cu ramurile inversate) → Corect', u => scrieIn(u, 'C2', '=IF(B2<>"da";"nu merge";"merge")')),
      gresit('rezultatul „merge” tastat de mână e respins', u => scrieIn(u, 'C2', 'merge'), NU_FORMULA('C2', 'merge'))] },
  { id: 'E06', nav: 'p4', k: 1, ce: '=IF(B2>=100;0;15) în C2', ok: verif(u => scrieIn(u, 'C2', '=IF(B2>=100;0;15)')),
    rau: verif(u => scrieIn(u, 'C2', '=IF(B2>100;0;15)')), mesaj: LIMITA('C2'),
    raspuns: /=IF\(B2>=100;0;15\)/, aratat: e => e.cel.C2 === '15',
    extra: [echiv('=IF(B2<100;15;0) (< cu ramurile inversate) → Corect', u => scrieIn(u, 'C2', '=IF(B2<100;15;0)')),
      gresit('15 tastat de mână e respins', u => scrieIn(u, 'C2', '15'), NU_FORMULA('C2', '15')),
      gresit('ramurile schimbate între ele sunt respinse', u => scrieIn(u, 'C2', '=IF(B2>=100;15;0)'), DA_DAR('C2', '0', '15'))] },
  /* ---- P5 „Condiția pe rezultatul altei formule” ---- */
  { id: 'E07', nav: 'p5', k: 0, ce: '=IF(D2>=5;"promovat";"corigent") în E2', ok: verif(u => scrieIn(u, 'E2', '=IF(D2>=5;"promovat";"corigent")')),
    rau: verif(u => scrieIn(u, 'E2', '=IF(B2>=5;"promovat";"corigent")')), mesaj: /E2 dă rezultatul bun acum, dar greșește când se schimbă datele\./,
    raspuns: /=IF\(D2>=5;"promovat";"corigent"\)/, aratat: e => e.cel.E2 === 'promovat',
    extra: [echiv('=IF(D2<5;"corigent";"promovat") (< cu ramurile inversate) → Corect', u => scrieIn(u, 'E2', '=IF(D2<5;"corigent";"promovat")'))] },
  { id: 'E08', nav: 'p5', k: 1, ce: '=IF(B2>=3,5;"calificat";"necalificat") în C2', ok: verif(u => scrieIn(u, 'C2', '=IF(B2>=3,5;"calificat";"necalificat")')),
    rau: verif(u => scrieIn(u, 'C2', '=IF(B2>3,5;"calificat";"necalificat")')), mesaj: LIMITA('C2'),
    raspuns: /=IF\(B2>=3,5;"calificat";"necalificat"\)/, aratat: e => e.cel.C2 === 'calificat' },
  /* ---- P6 „Situația-problemă” ---- */
  { id: 'E09', nav: 'p6', k: 0, ce: 'B7 corectată: =IF(B5<=B6;"ne ajung banii";"nu ne ajung")', ok: verif(u => scrieIn(u, 'B7', '=IF(B5<=B6;"ne ajung banii";"nu ne ajung")')),
    rau: doarVerifica, mesaj: LIMITA('B7'),
    raspuns: /=IF\(B5<=B6;"ne ajung banii";"nu ne ajung"\)/, aratat: e => e.cel.B7 === 'ne ajung banii',
    extra: [echiv('=IF(B5>B6;"nu ne ajung";"ne ajung banii") (> cu ramurile inversate) → Corect', u => scrieIn(u, 'B7', '=IF(B5>B6;"nu ne ajung";"ne ajung banii")')),
      gresit('„ne ajung banii” tastat de mână e respins', u => scrieIn(u, 'B7', 'ne ajung banii'), NU_FORMULA('B7', 'ne ajung banii'))] },
  /* ---- Atelierul ---- */
  { id: 'E10', nav: 'atelier', k: 0, ce: 'atelier: excursia (D2:D4, E2:E4, D5 cu SUM)', teste: 4,
    ok: verif(atelier(ATEL_D, ATEL_E)),
    rau: verif(atelier(['=IF(B2<=14;10;20)', '=IF(B3<=14;10;20)', '=IF(B4<=14;10;20)'], ATEL_E)), mesaj: LIMITA('D2'),
    rau2: doarVerifica, raspuns: /=IF\(B2<14;10;20\)/,
    aratat: e => e.cel.D2 === '10' && e.cel.D3 === '20' && e.cel.D4 === '20' && e.cel.E2 === 'merge' && e.cel.E3 === 'nu merge' && e.cel.D5 === '50',
    extra: [testeBifate('doar D2:D4 bune: 2 teste din 4', atelier(ATEL_D, null, null), 2),
      gresit('D5 cu =D2+D3+D4 (restul bune) e respins: se cere SUM', atelier(ATEL_D, ATEL_E, '=D2+D3+D4'), SE_CERE('D5', 'SUM')),
      testeBifate('D5 cu =D2+D3+D4: testul lui D5 nu se bifează (3 din 4)', atelier(ATEL_D, ATEL_E, '=D2+D3+D4'), 3)] },
  { id: 'E11', nav: 'atelier', k: 1, ce: 'atelier 2: săriturile (C2:C4, B5 cu MAX)', teste: 2,
    ok: verif(sarituri(SAR)),
    rau: verif(sarituri(['=IF(B2>3,5;"calificat";"necalificat")', '=IF(B3>3,5;"calificat";"necalificat")', '=IF(B4>3,5;"calificat";"necalificat")'])), mesaj: LIMITA('C2'),
    rau2: doarVerifica, raspuns: /=IF\(B2>=3,5;"calificat";"necalificat"\)/,
    aratat: e => e.cel.C2 === 'calificat' && e.cel.C3 === 'calificat' && e.cel.C4 === 'necalificat' && e.cel.B5 === '3,6',
    extra: [gresit('B5 cu =B2 (rezultatul bun acum, fără MAX) e respins', sarituri(SAR, '=B2'), /B5/)] },
  /* ---- Întrebările de la sfârșit ---- */
  { id: 'E12', nav: 'q2', ce: 'Î2: =IF(B2>=10;"diplomă";"mai citește") în C2', ok: verif(u => scrieIn(u, 'C2', '=IF(B2>=10;"diplomă";"mai citește")')),
    rau: verif(u => scrieIn(u, 'C2', '=IF(B2>10;"diplomă";"mai citește")')), mesaj: LIMITA('C2'),
    raspuns: /=IF\(B2>=10;"diplomă";"mai citește"\)/, aratat: e => e.cel.C2 === 'diplomă',
    extra: [echiv('textul fără diacritice ("diploma", "mai citeste") → Corect', u => scrieIn(u, 'C2', '=IF(B2>=10;"diploma";"mai citeste")'))] },
  { id: 'E13', nav: 'q4', ce: 'Î4: =IF(D2>=9;"bursă";"fără bursă") în E2', ok: verif(u => scrieIn(u, 'E2', '=IF(D2>=9;"bursă";"fără bursă")')),
    rau: verif(u => scrieIn(u, 'E2', '=IF(D2>9;"bursă";"fără bursă")')), mesaj: LIMITA('E2'),
    raspuns: /=IF\(D2>=9;"bursă";"fără bursă"\)/, aratat: e => e.cel.E2 === 'bursă' }
];

ruleaza({ lectie: '/lectii/viii/m2-l09/index.html', cheie: 'lectie_viii_m2_l09', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, vechiNume: 'tip-excel.js + lectii/_sim/excelx.js + excelx-formule.js + excelx-decizie.js', EX });
