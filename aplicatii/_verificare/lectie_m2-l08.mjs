// Probele JUCATE ale lecției lectii/viii/m2-l08 (17 exerciții `excelx`: funcțiile SUM / AVERAGE / MAX / MIN, butonul Σ
// Însumare automată și lista lui ▾, zona propusă reparată, mânerul de umplere, atelierul cu testele numite), scrise ÎNAINTEA
// legării lecției la bibliotecă. Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs.
// La b (greșeala tipică) se cere și MESAJUL din inventar (ce e greșit), nu doar „Nu încă”. Probele în plus:
//   e  al doilea drum bun (litere mici, Alt+=, Σ din panglică) → „Corect”
//   v  o greșeală cu mesajul ei vechi: adunarea de mână (=B2+B3+…) acolo unde se cere FUNCȚIA, valoarea tastată, numele
//      românesc al funcției (#NAME?), funcția scrisă de mână acolo unde se cere Σ, formula scrisă acolo unde se cere mânerul
//   d  foaia arată ce spune lecția;  t  testele atelierului (câte se bifează);  g  greșeala porții (JocMotor.test.gresit)
// Simulatorul vechi al lecției = jocuri/_motor/tip-excel.js + lectii/_sim/excelx.js + excelx-formule.js + excelx-functii.js (ExcelFn).
import { ruleaza, ecran, VECHI } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<!-- foaia „excelx” comună clasei a VIII-a + extensia lecției 7 (formulele) + extensia lecției 8 (funcțiile, Σ) -->
<script src="../../_sim/excelx.js"></script>
<script src="../../_sim/excelx-formule.js"></script>
<script src="../../_sim/excelx-functii.js"></script>
`;

/* clic pe celulă; al doilea clic pe ACEEAȘI celulă vine după o pauză de om (un clic imediat ar fi dublu clic = editare) */
const clic = async (u, a) => { if (u._ultima === a) await u.pauza(700); await u.celula(a); u._ultima = a; };
const scrieIn = async (u, a, ...vals) => { await clic(u, a); for (const v of vals) { await u.scrie(v); await u.tasta('Enter'); } u._ultima = null; };
const verif = fn => async u => { await fn(u); await u.verifica(); };
const doarVerifica = async u => { await u.verifica(); };

/* ---- gesturile lecției 8, pe cele două interfețe ---- */
const BIB = t => `#body [data-lh-aplicatie="excel"] [data-lh-tinta="${t}"]`;
/* butonul Σ (Home › Editing): partea de sus = Sumă; săgeata ▾ = lista */
async function sigma(u, lista) {
  const p = u.p;
  if (VECHI) {
    const s = '#body [data-rb="sum"]:visible';
    await p.locator(s).first().scrollIntoViewIfNeeded(); await u.pauza(450);   // derularea paginii se termină înainte de clic
    const b = await p.locator(s).first().boundingBox();
    if (lista) await p.mouse.click(b.x + b.width * 0.85, b.y + b.height * 0.85); else await p.mouse.click(b.x + b.width * 0.3, b.y + b.height * 0.25);
  } else await p.locator(BIB(lista ? 'meniu_derulant:Home/Editing/AutoSum' : 'panglica:Home/Editing/AutoSum')).first().click({ timeout: 8000 });
  await u.pauza(250);
}
/* Σ ▾ › rândul listei (Average, Max, Min) */
const sigmaLista = async (u, rand) => {
  await sigma(u, true);
  if (VECHI) {   // lista veche se închide la orice derulare: clic cu mouse-ul pe locul rândului, fără derularea lui locator.click
    const b = u.p.locator('.xfn-meniu button').filter({ hasText: rand === 'Average' ? 'Medie (Average)' : new RegExp('^' + rand + '$') }).first();
    await b.waitFor({ state: 'visible', timeout: 8000 });
    const r = await b.boundingBox(); await u.p.mouse.click(r.x + r.width / 2, r.y + r.height / 2);
  } else await u.meniu(rand);
  await u.pauza(200);
};
/* mânerul de umplere: apucat cu mouse-ul și tras până la celula b (pași mici, ca o mână) */
async function umple(u, b) {
  const p = u.p, h = VECHI ? '#body .gw [data-fh]' : BIB('maner_umplere'), c = VECHI ? `#body .gw td[data-a="${b}"]` : BIB('celula:' + b) + `, #body [data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="${b}"]`;
  await p.locator(c).first().scrollIntoViewIfNeeded(); await u.pauza(350);
  const H = await p.locator(h).first().boundingBox(), C = await p.locator(c).first().boundingBox();
  if (!H) throw new Error('mânerul de umplere nu e pe ecran');
  const x0 = H.x + H.width / 2, y0 = H.y + H.height / 2, x1 = C.x + C.width / 2, y1 = C.y + C.height / 2;
  await p.mouse.move(x0, y0); await p.mouse.down();
  await p.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, { steps: 5 }); await p.mouse.move(x1, y1, { steps: 5 });
  await p.mouse.up(); await u.pauza(250); u._ultima = null;
}
/* proba d: fă gesturile, apoi uită-te în foaie */
const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u); await u.pauza(250); const e = await ecran(p); return e && bun(e.cel, e) ? true : 'foaia arată altceva: ' + JSON.stringify(e); } });
const echiv = (nume, fa) => ({ lit: 'e', nume, corect: verif(fa) });
const gresit = (nume, fa, mesaj) => ({ lit: 'v', nume, respins: verif(fa), mesaj });
/* proba t: câte teste ale atelierului sunt bifate după gesturi */
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
const CERE = fn => new RegExp(`rezultatul e bun, dar aici se cere funcția ${fn}: scrie =${fn}\\(…\\) cu zona potrivită`);
const GEST_SIGMA = /Folosește butonul Σ, Însumare automată \(AutoSum\): fila Formule \(Formulas\), la început, sau fila Pornire \(Home\), în dreapta\./;
const GEST_UMPLE = /Copiază formula TRĂGÂND de pătrățelul verde din colțul celulei \(fill handle\), ca în Excel, nu scriind-o din nou\./;
const sigmaPe = (a, zona) => async u => { await clic(u, a); await sigma(u); if (zona) await u.scrie(zona); await u.tasta('Enter'); u._ultima = null; };
const listaPe = (a, rand, zona) => async u => { await clic(u, a); await sigmaLista(u, rand); if (zona) await u.scrie(zona); await u.tasta('Enter'); u._ultima = null; };
const ATELIER = ['=SUM(B2:B6)', '=MAX(B2:B6)', '=MIN(B2:B6)', '=AVERAGE(B2:B6)'];
const atelierCu = (vals, fill = true) => async u => { await scrieIn(u, 'B7', ...vals); if (fill) { await u.trage('B7', 'B10'); await umple(u, 'C10'); } };

const EX = [
  /* ---- P2 „Ce este o funcție” ---- */
  { id: 'E01', nav: 'p2', k: 0, ce: '=SUM(B2:B6) în B7', ok: verif(u => scrieIn(u, 'B7', '=SUM(B2:B6)')),
    rau: verif(u => scrieIn(u, 'B7', '=B2+B3+B4+B5+B6')), mesaj: CERE('SUM'),
    /* pe vechi, după respingerea „se cere funcția”, răspunsul e „în B7 scrii =SUM(…), ca în soluția de mai sus” */
    raspuns: /=SUM\(/, aratat: e => e.cel.B7 === '42',
    extra: [echiv('=sum(b2:b6) (litere mici) → Corect', u => scrieIn(u, 'B7', '=sum(b2:b6)')),
      echiv('Alt+= (Însumare automată de la tastatură), apoi Enter → Corect', async u => { await clic(u, 'B7'); await u.tasta('Alt+Equal'); await u.pauza(200); await u.tasta('Enter'); }),
      gresit('rezultatul 42 tastat de mână e respins', u => scrieIn(u, 'B7', '42'), /În B7 ai scris 42, nu o formulă: formula începe cu =\./),
      gresit('=SUMA(B2:B6) (numele românesc) e respins: #NAME?', u => scrieIn(u, 'B7', '=SUMA(B2:B6)'), /B7 arată #NAME\?: Excel nu cunoaște funcția SUMA\. Numele funcțiilor sunt în engleză: SUM\./),
      inFoaie('după Enter, B7 arată 42', u => scrieIn(u, 'B7', '=SUM(B2:B6)'), c => c.B7 === '42'),
      dePoarta()] },
  { id: 'E02', nav: 'p2', k: 1, ce: '=SUM(B2:B5) în B6', ok: verif(u => scrieIn(u, 'B6', '=SUM(B2:B5)')),
    rau: verif(u => scrieIn(u, 'B6', '=SUM(B2:B4)')), mesaj: /B6 dă 36, dar ar trebui să dea 50\./,
    raspuns: /=SUM\(B2:B5\)/, aratat: e => e.cel.B6 === '50',
    extra: [gresit('=B2+B3+B4+B5 (adunarea de mână) e respinsă', u => scrieIn(u, 'B6', '=B2+B3+B4+B5'), CERE('SUM'))] },
  /* ---- P3 „Patru funcții” ---- */
  { id: 'E03', nav: 'p3', k: 0, ce: '=MAX(B2:B6) în B8', ok: verif(u => scrieIn(u, 'B8', '=MAX(B2:B6)')),
    rau: verif(u => scrieIn(u, 'B8', '=MAX(B2:B7)')), mesaj: /B8 dă 42, dar ar trebui să dea 10\./,
    raspuns: /=MAX\(B2:B6\)/, aratat: e => e.cel.B8 === '10',
    extra: [gresit('10 tastat de mână e respins', u => scrieIn(u, 'B8', '10'), /În B8 ai scris 10, nu o formulă/),
      gresit('=B4 (celula Carlei) e respins: greșește pe datele schimbate', u => scrieIn(u, 'B8', '=B4'), /B8 dă rezultatul bun acum, dar greșește când se schimbă datele\./)] },
  { id: 'E04', nav: 'p3', k: 1, ce: '=MIN(B2:B6) în B9', ok: verif(u => scrieIn(u, 'B9', '=MIN(B2:B6)')),
    rau: verif(u => scrieIn(u, 'B9', '=MAX(B2:B6)')), mesaj: /B9 dă 10, dar ar trebui să dea 7\./,
    raspuns: /=MIN\(B2:B6\)/, aratat: e => e.cel.B9 === '7',
    extra: [gresit('=MINIM(B2:B6) e respins: #NAME?', u => scrieIn(u, 'B9', '=MINIM(B2:B6)'), /B9 arată #NAME\?: Excel nu cunoaște funcția MINIM\. Numele funcțiilor sunt în engleză: MIN\./)] },
  { id: 'E05', nav: 'p3', k: 2, ce: '=AVERAGE(B2:B6) în B7', ok: verif(u => scrieIn(u, 'B7', '=AVERAGE(B2:B6)')),
    rau: verif(u => scrieIn(u, 'B7', '=(B2+B3+B4+B5+B6)/5')), mesaj: CERE('AVERAGE'),
    raspuns: /=AVERAGE\(B2:B6\)/, aratat: e => e.cel.B7 === '5',
    extra: [gresit('=SUM(B2:B6) în loc de medie e respins', u => scrieIn(u, 'B7', '=SUM(B2:B6)'), /B7 dă 25, dar ar trebui să dea 5\./)] },
  /* ---- P4 „Celulele goale, textul și zeroul” ---- */
  { id: 'E06', nav: 'p4', k: 0, ce: '=AVERAGE(B2:B6) cu B4 goală; alegi 8', ok: async u => { await scrieIn(u, 'B7', '=AVERAGE(B2:B6)'); await u.optiune('8'); },
    rau: u => u.optiune('6,4'), rau2: u => u.optiune('32'), mesaj: /Încearcă în foaia de mai sus/, raspuns: /8/,
    extra: [inFoaie('B4 goală: media din B7 arată 8', u => scrieIn(u, 'B7', '=AVERAGE(B2:B6)'), c => c.B7 === '8')] },
  { id: 'E07', nav: 'p4', k: 1, ce: 'B3 golită cu Delete, B7 rămâne', ok: verif(async u => { await clic(u, 'B3'); await u.tasta('Delete'); }),
    rau: doarVerifica, mesaj: /B3 nu e goală încă\. Alege-o și apasă Delete\./,
    raspuns: /alegi B3 și apeși Delete/, aratat: e => !e.cel.B3 && e.cel.B7 === '8,5',
    extra: [gresit('„absent” scris în B3 e respins', u => scrieIn(u, 'B3', 'absent'), /B3 nu e goală încă/),
      inFoaie('B3 golită: B7 arată 8,5', async u => { await clic(u, 'B3'); await u.tasta('Delete'); }, c => c.B7 === '8,5' && !c.B3)] },
  /* ---- P5 „Butonul Σ” ---- */
  { id: 'E08', nav: 'p5', k: 0, ce: 'Σ pe B7, Enter', ok: verif(sigmaPe('B7')),
    rau: verif(u => scrieIn(u, 'B7', '=SUM(B2:B6)')), mesaj: GEST_SIGMA,
    raspuns: /=SUM\(B2:B6\)/, aratat: e => e.cel.B7 === '42',
    extra: [inFoaie('Σ pe B7 + Enter: B7 arată 42', sigmaPe('B7'), c => c.B7 === '42'),
      echiv('Alt+= pe B7, apoi Enter → Corect', async u => { await clic(u, 'B7'); await u.tasta('Alt+Equal'); await u.pauza(200); await u.tasta('Enter'); })] },
  { id: 'E09', nav: 'p5', k: 1, ce: 'Σ ▾ Average pe B8, zona B2:B6 scrisă peste cea propusă', ok: verif(listaPe('B8', 'Average', 'B2:B6')),
    rau: verif(listaPe('B8', 'Average')), mesaj: /B8 dă 14, dar ar trebui să dea 8,4\./,
    raspuns: /=AVERAGE\(B2:B6\)/, aratat: e => e.cel.B8 === '8,4',
    extra: [gresit('=AVERAGE(B2:B6) scrisă de mână, fără Σ, e respinsă', u => scrieIn(u, 'B8', '=AVERAGE(B2:B6)'), GEST_SIGMA)] },
  { id: 'E10', nav: 'p5', k: 2, ce: 'Σ pe B7 cu B3 goală, zona B2:B6 scrisă peste B4:B6', ok: verif(sigmaPe('B7', 'B2:B6')),
    rau: verif(sigmaPe('B7')), mesaj: /B7 dă 25, dar ar trebui să dea 34\./,
    raspuns: /=SUM\(B2:B6\)/, aratat: e => e.cel.B7 === '34' },
  /* ---- P6 „Copiezi funcția” ---- */
  { id: 'E11', nav: 'p6', k: 0, ce: 'mânerul lui E2 tras până la E6', ok: verif(async u => { await clic(u, 'E2'); await umple(u, 'E6'); }),
    rau: verif(u => scrieIn(u, 'E3', '=AVERAGE(B3:D3)', '=AVERAGE(B4:D4)', '=AVERAGE(B5:D5)', '=AVERAGE(B6:D6)')), mesaj: GEST_UMPLE,
    raspuns: /tragi de colțul lui E2 până la E6/, aratat: e => e.cel.E3 === '9' && e.cel.E4 === '6' && e.cel.E5 === '9' && e.cel.E6 === '8',
    extra: [gresit('mânerul tras doar până la E4 e respins', async u => { await clic(u, 'E2'); await umple(u, 'E4'); }, /E5 e goală\./),
      inFoaie('mânerul lui E2 până la E6: E3:E6 arată 9, 6, 9, 8', async u => { await clic(u, 'E2'); await umple(u, 'E6'); }, c => c.E3 === '9' && c.E4 === '6' && c.E5 === '9' && c.E6 === '8')] },
  { id: 'E12', nav: 'p6', k: 1, ce: 'mânerul până la E6, E5 = =AVERAGE(B5:D5); alegi varianta', ok: async u => { await clic(u, 'E2'); await umple(u, 'E6'); await clic(u, 'E5'); await u.optiune('=AVERAGE(B5:D5)'); },
    rau: u => u.optiune('=AVERAGE(B2:D2)'), rau2: u => u.optiune('=AVERAGE(B2:D5)'), mesaj: /Încearcă în foaia de mai sus/, raspuns: /=AVERAGE\(B5:D5\)/ },
  { id: 'E13', nav: 'p6', k: 2, ce: 'mânerul lui B7 tras până la D7', ok: verif(async u => { await clic(u, 'B7'); await umple(u, 'D7'); }),
    rau: verif(async u => { await clic(u, 'B7'); await umple(u, 'C7'); }), mesaj: /D7 e goală\./,
    raspuns: /tragi de colțul lui B7 până la D7/, aratat: e => e.cel.C7 === '9' && e.cel.D7 === '10',
    extra: [gresit('=MAX(C2:C6) și =MAX(D2:D6) scrise de mână sunt respinse', u => scrieIn(u, 'C7', '=MAX(C2:C6)'), GEST_UMPLE)] },
  /* ---- Atelierul ---- */
  { id: 'E14', nav: 'atelier', k: 0, ce: 'atelier: cheltuielile (B7:B10, umplut până în C)', teste: 4,
    ok: verif(atelierCu(ATELIER)),
    rau: verif(atelierCu(['=SUM(B2:B6)', '=MAX(B2:B6)', '=MIN(B2:B6)', '=AVERAGE(B2:B9)'])), mesaj: /B10 dă 15,5, dar ar trebui să dea 10,3\./,
    rau2: doarVerifica, raspuns: /=AVERAGE\(B2:B6\)/, aratat: e => e.cel.B7 === '51,5' && e.cel.B10 === '10,3' && e.cel.C7 === '45' && e.cel.C10 === '9',
    extra: [testeBifate('B7 cu =B2+B3+B4+B5+B6 (fără SUM): testul 1 nu se bifează', u => scrieIn(u, 'B7', '=B2+B3+B4+B5+B6'), 0),
      testeBifate('B7:B10 scrise, fără mâner: 3 teste din 4', atelierCu(ATELIER, false), 3),
      gresit('B7 cu adunarea de mână (restul bune, umplut) e respins: se cere SUM', atelierCu(['=B2+B3+B4+B5+B6', '=MAX(B2:B6)', '=MIN(B2:B6)', '=AVERAGE(B2:B6)']), CERE('SUM')),
      gresit('C7:C10 scrise de mână, fără mâner, e respins', async u => { await atelierCu(ATELIER, false)(u); await scrieIn(u, 'C7', '=SUM(C2:C6)', '=MAX(C2:C6)', '=MIN(C2:C6)', '=AVERAGE(C2:C6)'); }, GEST_UMPLE)] },
  { id: 'E15', nav: 'atelier', k: 1, ce: 'atelier 2: temperaturile (B7:B9)', teste: 3,
    ok: verif(u => scrieIn(u, 'B7', '=MIN(B2:B6)', '=MAX(B2:B6)', '=AVERAGE(B2:B6)')),
    rau: verif(u => scrieIn(u, 'B7', '=MIN(B2:B6)', '=MAX(B2:B6)', '=SUM(B2:B6)/4')), mesaj: /B9 dă 0,75, dar ar trebui să dea 0,6\./,
    rau2: doarVerifica, raspuns: /=AVERAGE\(B2:B6\)/, aratat: e => e.cel.B7 === '-3' && e.cel.B8 === '5' && e.cel.B9 === '0,6' },
  /* ---- Întrebările de la sfârșit ---- */
  { id: 'E16', nav: 'q2', ce: 'Î2: =MIN(B2:B6) în B7', ok: verif(u => scrieIn(u, 'B7', '=MIN(B2:B6)')),
    rau: verif(u => scrieIn(u, 'B7', '38')), mesaj: /În B7 ai scris 38, nu o formulă/,
    raspuns: /=MIN\(B2:B6\)/, aratat: e => e.cel.B7 === '38',
    extra: [gresit('=MAX(B2:B6) e respins', u => scrieIn(u, 'B7', '=MAX(B2:B6)'), /B7 dă 52, dar ar trebui să dea 38\./)] },
  { id: 'E17', nav: 'q4', ce: 'Î4: Σ ▾ Max pe B8, zona B2:B6', ok: verif(listaPe('B8', 'Max', 'B2:B6')),
    rau: verif(listaPe('B8', 'Max')), mesaj: /B8 dă 40, dar ar trebui să dea 10\./,
    raspuns: /=MAX\(B2:B6\)/, aratat: e => e.cel.B8 === '10',
    extra: [gresit('=MAX(B2:B6) scrisă de mână, fără Σ, e respinsă', u => scrieIn(u, 'B8', '=MAX(B2:B6)'), GEST_SIGMA)] }
];

ruleaza({ lectie: '/lectii/viii/m2-l08/index.html', cheie: 'lectie_viii_m2_l08', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, vechiNume: 'tip-excel.js + lectii/_sim/excelx.js + excelx-formule.js + excelx-functii.js', EX });
