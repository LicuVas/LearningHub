// Probele JUCATE ale lecției lectii/viii/m2-l10 (10 exerciții `excelx`: sortarea crescătoare / descrescătoare după o coloană —
// numere, date calendaristice, text cu Ș —, capcana coloanei selectate singure și fereastra Sort Warning, rândul de antet și
// „My data has headers”, două criterii cu Add Level, atelierele cu testele numite), scrise ÎNAINTEA legării lecției la bibliotecă.
// Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs. La b (greșeala tipică) se cere și MESAJUL din inventar.
// Probele în plus:
//   v  o greșeală cu mesajul ei vechi: doar coloana sortată (Continue with the current selection → rândurile desperecheate),
//      titlul sortat printre date (butonul A→Z pe o listă numai de texte), criteriile inversate, sortat după altă coloană,
//      valorile mutate de mână
//   d  foaia arată ce spune lecția (rândurile întregi, Ș după S);  t  testele atelierului (câte se bifează);  g  greșeala porții
// Gesturile sortării sunt ale fiecărei interfețe (aceeași probă, alt loc pe ecran): fila Data (Date), butoanele A→Z / Z→A /
// Sort, fereastra Sort Warning (Expand / Continue, butonul Sort), fereastra Sort (Sort by / Then by, Order, Add Level,
// My data has headers, OK). Pe vechi listele ferestrei Sort sunt <select> (alegerea din listă), pe bibliotecă liste de clic.
// Simulatorul vechi al lecției = jocuri/_motor/tip-excel.js + lectii/_sim/excelx.js + excelx-sortare.js (ExcelS).
import { ruleaza, ecran, VECHI } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<!-- foaia „excelx” comună clasei a VIII-a (lecțiile 4-5) + extensia lecției 10: sortarea, fidelă Excel-ului pe setări
     românești (probat în Excel real: _proba/proba_excel_2.json, _proba/proba_excel_b.json) -->
<script src="../../_sim/excelx.js"></script>
<script src="../../_sim/excelx-sortare.js"></script>
`;

const APP = '#body [data-lh-aplicatie="excel"]', WIN = `${APP} [data-lh-tip="Window"]`;
const vis = s => `${s} >> visible=true`;
const clicL = async (p, sel) => { await p.locator(sel).first().click({ timeout: 8000 }); await p.waitForTimeout(200); };

/* ---------- gesturile sortării, pe cele două interfețe ---------- */
const filaData = u => VECHI ? clicL(u.p, '#body #xwrap [data-tab="data"]') : clicL(u.p, `${APP} [data-lh-tinta="fila:Data"]`);
const MSO = { asc: 'SortAscendingExcel', desc: 'SortDescendingExcel', dlg: 'SortDialog' };
/* butonul din grupul Sort & Filter al filei Data: asc (A→Z), desc (Z→A), dlg (Sort, butonul mare) */
const buton = async (u, k) => { await filaData(u); if (VECHI) await clicL(u.p, `#body #xwrap [data-so="${k}"]`); else await clicL(u.p, vis(`${APP} [data-lh-id-mso="${MSO[k]}"]`)); await u.pauza(250); };
/* Sort Warning: varianta (Expand the selection / Continue with the current selection), apoi butonul Sort */
const avertizare = async (u, extinde) => {
  if (VECHI) { await u.p.locator(`#body .xs-dlg input[name="xs-av"][value="${extinde ? 'extinde' : 'curenta'}"]`).click({ timeout: 8000 }); await clicL(u.p, '#body .xs-dlg [data-xs="sort"]'); }
  else { await clicL(u.p, vis(`${APP} [data-lh-tip="RadioButton"][data-lh-eticheta="${extinde ? 'Expand the selection' : 'Continue with the current selection'}"]`)); await clicL(u.p, vis(`${WIN} [data-lh-tip="Button"][data-lh-eticheta="Sort..."]`)); }
  await u.pauza(250);
};
const areAvertizare = async u => VECHI ? (await u.p.locator('#body .xs-dlg input[name="xs-av"]').count()) > 0
  : (await u.p.locator(vis(`${APP} [data-lh-tip="RadioButton"][data-lh-eticheta="Expand the selection"]`)).count()) > 0;
/* fereastra Sort: bifa „My data has headers” (se uită la ea și o schimbă doar dacă nu e cum trebuie) */
const antetBifat = async (u, vrea) => {
  if (VECHI) { const c = u.p.locator('#body .xs-dlg input[data-sd="antet"]'); if ((await c.isChecked()) !== vrea) await c.click(); }
  else { const c = u.p.locator(vis(`${WIN} [data-lh-tip="CheckBox"][data-lh-eticheta="My data has headers"]`)).first(); if (((await c.getAttribute('aria-checked')) === 'true') !== vrea) await c.click(); }
  await u.pauza(200);
};
/* nivelul i: coloana (după numele din listă) și ordinea (prima variantă = crescător, a doua = descrescător) */
const nivel = async (u, i, col, desc) => {
  if (VECHI) {
    await u.p.locator(`#body .xs-dlg select[data-sd="col"][data-i="${i}"]`).selectOption({ label: col }); await u.pauza(200);
    await u.p.locator(`#body .xs-dlg select[data-sd="ord"][data-i="${i}"]`).selectOption(desc ? 'desc' : 'asc'); await u.pauza(150);
    return;
  }
  await clicL(u.p, vis(`${WIN} [data-lh-nivel="${i}"] [data-lh-camp="coloana"]`));
  await clicL(u.p, vis(`${APP} [role="listbox"] [role="option"][data-lh-eticheta="${col}"]`));
  await clicL(u.p, vis(`${WIN} [data-lh-nivel="${i}"] [data-lh-camp="ordine"]`));
  await u.p.locator(vis(`${APP} [role="listbox"] [role="option"]`)).nth(desc ? 1 : 0).click({ timeout: 8000 }); await u.pauza(200);
};
const adaugaNivel = u => VECHI ? clicL(u.p, '#body .xs-dlg [data-sd="adauga"]') : clicL(u.p, vis(`${WIN} [data-lh-tip="Button"][data-lh-eticheta="Add Level"]`));
const okSort = async u => { if (VECHI) await clicL(u.p, '#body .xs-dlg [data-sd="ok"]'); else await clicL(u.p, vis(`${WIN} [data-lh-tip="Button"][data-lh-eticheta="OK"]`)); await u.pauza(300); };
/* toată fereastra Sort: niv = [[coloana, desc], …]; antet = bifa „My data has headers” */
const cuFereastra = (cel, niv, antet = true) => async u => {
  await u.celula(cel); await buton(u, 'dlg');
  await antetBifat(u, antet);
  for (let i = 0; i < niv.length; i++) { if (i) await adaugaNivel(u); await nivel(u, i, niv[i][0], niv[i][1]); }
  await okSort(u);
};
/* clic pe o celulă, apoi butonul A→Z / Z→A */
const dinCelula = (cel, k) => async u => { await u.celula(cel); await buton(u, k); };
/* o zonă trasă (sau coloana întreagă, din literă), butonul, apoi varianta din Sort Warning */
const dinZona = (a, b, k, extinde) => async u => { await u.trage(a, b); await buton(u, k); await avertizare(u, extinde); };
const dinColoana = (L, k, extinde) => async u => { await u.clicPe('coloana:' + L); await u.pauza(150); await buton(u, k); await avertizare(u, extinde); };

const verif = fn => async u => { await fn(u); await u.verifica(); };
const doarVerifica = async u => { await u.verifica(); };
const scrieIn = async (u, a, ...vals) => { await u.celula(a); for (const v of vals) { await u.scrie(v); await u.tasta('Enter'); } };

const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u); await u.pauza(300); const e = await ecran(p); return e && bun(e.cel, e) ? true : 'foaia arată altceva: ' + JSON.stringify(e && e.cel); } });
const gresit = (nume, fa, mesaj) => ({ lit: 'v', nume, respins: verif(fa), mesaj });
const testeBifate = (nume, fa, n) => ({ lit: 't', nume, fa: async (u, p) => { await fa(u); await u.pauza(600);
  const k = await p.evaluate(() => document.querySelectorAll('#body .xs-teste li.ok, #body .xa-teste li.ok').length);
  return k === n ? true : `testele bifate: ${k}, nu ${n}`; } });
const avertizareApare = (nume, fa) => ({ lit: 'w', nume, fa: async u => { await fa(u); return (await areAvertizare(u)) ? true : 'fereastra Sort Warning nu a apărut'; } });
const dePoarta = () => ({ lit: 'g', nume: 'greșeala porții (JocMotor.test.gresit) e respinsă', fa: async (u, p, x) => {
  const are = await p.evaluate(() => JocMotor.test.gresit());
  if (!are) return 'tipul exercițiului nu are greșeala porții (gresit)';
  await u.pauza(400); await u.verifica();
  const f = await x.fb(p);
  if (f.ok || /Corect!/.test(f.text)) return 'greșeala porții e luată drept „Corect”';
  return /Nu încă/.test(f.text) ? true : `nu e „Nu încă”: ${f.text}`;
} });

/* mesajele vechi (jocuri/_motor/tip-excel.js › probleme „SORTAREA” și lectii/_sim/excelx-sortare.js › mesajSortare; textele
   culese pe ecran în inventar_m2-l10.md) */
const ORDINE = s => new RegExp(`Tabelul nu e încă în ordinea cerută \\(${s}\\)\\. Folosește Date \\(Data\\) → Sortare\\.`);
const DESPERECHEAT = /Rândurile s-au desperecheat: unele valori au ajuns pe rândul altuia\. Apasă Ctrl\+Z \(pe telefon, ↶\)\. Dacă ai ales Continue with the current selection, repetă sortarea/;
const TITLU = (r, t) => new RegExp(`Titlul de pe rândul ${r} \\(„${t}”\\) a ajuns printre date: Excel nu l-a recunoscut ca rând de antet\\. Rândurile în sine sunt întregi\\.`);
const RASPUNS = s => new RegExp(`Sortare după ${s}`);

const ordine = (c, ...nume) => c && nume.every((n, i) => c['A' + (i + 2)] === n);

const EX = [
  /* ---- P2 (PASUL 2) „O coloană, dintr-o singură celulă” ---- */
  { id: 'E01', nav: 'p3', k: 0, ce: 'clasamentul: clic pe C3, Z→A (Punctaj descrescător)', ok: verif(dinCelula('C3', 'desc')),
    rau: verif(dinCelula('C3', 'asc')), mesaj: ORDINE('coloana C descrescător'),
    raspuns: RASPUNS('coloana C descrescător'), aratat: e => ordine(e.cel, 'Ioana', 'Ana', 'Sara', 'Radu', 'Matei') && e.cel.B2 === '8B' && e.cel.C2 === '95',
    extra: [gresit('doar punctajele C2:C6, Z→A, Continue with the current selection → rândurile desperecheate', dinZona('C2', 'C6', 'desc', false), DESPERECHEAT),
      gresit('sortat după altă coloană (Elev, A→Z) e respins', dinCelula('A3', 'asc'), ORDINE('coloana C descrescător')),
      gresit('punctajele rescrise de mână în ordine (95, 92, 88, 78, 70), numele pe loc → desperecheat', u => scrieIn(u, 'C2', '95', '92', '88', '78', '70'), DESPERECHEAT),
      inFoaie('după Z→A rândurile rămân întregi: Ioana 8B 95 sus, Matei 8A 70 jos', dinCelula('C3', 'desc'), c => c.A2 === 'Ioana' && c.B2 === '8B' && c.C2 === '95' && c.A6 === 'Matei' && c.B6 === '8A' && c.C6 === '70' && c.A1 === 'Elev'),
      dePoarta()] },
  { id: 'E02', nav: 'p3', k: 1, ce: 'evenimentele: clic pe o dată, A→Z (Oldest to Newest)', ok: verif(dinCelula('B3', 'asc')),
    rau: verif(dinCelula('B3', 'desc')), mesaj: ORDINE('coloana B crescător'),
    raspuns: RASPUNS('coloana B crescător'), aratat: e => ordine(e.cel, 'Excursie', 'Teză', 'Serbare', 'Concurs'),
    extra: [inFoaie('după A→Z: Excursie (05.10.2026) sus, Concurs (12.03.2027) jos', dinCelula('B3', 'asc'), c => ordine(c, 'Excursie', 'Teză', 'Serbare', 'Concurs') && /05.10.2026|05\.oct/.test(c.B2 || ''))] },
  { id: 'E03', nav: 'p3', k: 2, ce: 'ordinea alfabetică: clic pe un nume, A→Z (Ș după S)', ok: verif(dinCelula('A3', 'asc')),
    rau: verif(dinCelula('A3', 'desc')), mesaj: ORDINE('coloana A crescător'),
    raspuns: RASPUNS('coloana A crescător'), aratat: e => ordine(e.cel, 'Ilinca', 'Ioana', 'Sara', 'Ștefan', 'Tudor'),
    extra: [inFoaie('după A→Z: Ilinca, Ioana, Sara, Ștefan, Tudor (Ș după S), fiecare cu nota lui', dinCelula('A3', 'asc'), c => ordine(c, 'Ilinca', 'Ioana', 'Sara', 'Ștefan', 'Tudor') && c.B5 === '9' && c.B6 === '10'),
      gresit('sortat după Nota (A→Z pe B) e respins', dinCelula('B3', 'asc'), ORDINE('coloana A crescător'))] },
  /* ---- P3 (PASUL 3) „Capcana: o singură coloană selectată” ---- */
  { id: 'E04', nav: 'p4', k: 0, ce: 'C2:C6 trase, Z→A, Sort Warning: Expand the selection, Sort', ok: verif(dinZona('C2', 'C6', 'desc', true)),
    rau: verif(dinZona('C2', 'C6', 'desc', false)), mesaj: DESPERECHEAT,
    raspuns: RASPUNS('coloana C descrescător'), aratat: e => ordine(e.cel, 'Elena', 'Bianca', 'Andrei', 'Victor', 'Mihai') && e.cel.B2 === '8B' && e.cel.C2 === '97',
    extra: [avertizareApare('C2:C6 trase, Z→A: apare Sort Warning', async u => { await u.trage('C2', 'C6'); await buton(u, 'desc'); }),
      inFoaie('după Expand: Elena 8B 97 sus, rândurile întregi', dinZona('C2', 'C6', 'desc', true), c => c.A2 === 'Elena' && c.B2 === '8B' && c.C2 === '97' && c.A6 === 'Mihai' && c.C6 === '64'),
      gresit('Expand, dar A→Z (sortat invers) e respins', dinZona('C2', 'C6', 'asc', true), ORDINE('coloana C descrescător'))] },
  { id: 'E05', nav: 'p4', k: 1, ce: 'litera C (coloana întreagă), A→Z, Sort Warning: Expand, Sort', ok: verif(dinColoana('C', 'asc', true)),
    rau: verif(dinColoana('C', 'asc', false)), mesaj: DESPERECHEAT,
    raspuns: RASPUNS('coloana C crescător'), aratat: e => ordine(e.cel, 'Sara', 'Ilinca', 'Darius', 'Matei') && e.cel.B2 === '8A' && e.cel.C2 === '0',
    extra: [inFoaie('după Expand: Sara 8A 0 sus, antetul Absențe pe rândul 1', dinColoana('C', 'asc', true), c => c.A2 === 'Sara' && c.B2 === '8A' && c.C2 === '0' && c.C1 === 'Absențe')] },
  /* ---- P4 (PASUL 4) „Rândul de antet și My data has headers” ---- */
  { id: 'E06', nav: 'p5', k: 0, ce: 'lista Nume: fereastra Sort, My data has headers bifat, Sort by Nume, A to Z', ok: verif(cuFereastra('A3', [['Nume', false]])),
    rau: verif(dinCelula('A3', 'asc')), mesaj: TITLU(1, 'Nume'),
    raspuns: RASPUNS('coloana A crescător'), aratat: e => e.cel.A1 === 'Nume' && ordine(e.cel, 'Ana', 'Bogdan', 'Ioana', 'Radu', 'Zamfir'),
    extra: [inFoaie('butonul A→Z pe lista numai de texte: „Nume” ajunge printre nume (ca în Excel)', dinCelula('A3', 'asc'), c => c.A1 !== 'Nume' && Object.values(c).includes('Nume')),
      inFoaie('fereastra Sort cu bifa: Nume rămâne sus, Ana … Zamfir dedesubt', cuFereastra('A3', [['Nume', false]]), c => c.A1 === 'Nume' && c.A2 === 'Ana' && c.A6 === 'Zamfir')] },
  /* ---- P5 (PASUL 5) „Mai multe criterii: Add Level” ---- */
  { id: 'E07', nav: 'p6', k: 0, ce: 'două criterii: Sort by Clasa A to Z, Add Level, Then by Punctaj Largest to Smallest', ok: verif(cuFereastra('B3', [['Clasa', false], ['Punctaj', true]])),
    rau: verif(cuFereastra('B3', [['Punctaj', true], ['Clasa', false]])), mesaj: ORDINE('coloana B crescător, apoi coloana C descrescător'),
    raspuns: RASPUNS('coloana B crescător, apoi coloana C descrescător'), aratat: e => ordine(e.cel, 'Lia', 'Irina', 'Cosmin', 'Paul', 'Oana', 'Tudor'),
    extra: [gresit('doar Clasa (A→Z pe B), fără al doilea criteriu, e respins', dinCelula('B3', 'asc'), ORDINE('coloana B crescător, apoi coloana C descrescător')),
      inFoaie('după OK: 8A Lia 99, Irina 85, Cosmin 60; 8B Paul 91, Oana 88, Tudor 72', cuFereastra('B3', [['Clasa', false], ['Punctaj', true]]), c => ordine(c, 'Lia', 'Irina', 'Cosmin', 'Paul', 'Oana', 'Tudor') && c.C2 === '99' && c.B5 === '8B')] },
  /* ---- Atelierele ---- */
  { id: 'E08', nav: 'atelier', k: 0, ce: 'atelier: crosul (Clasa A to Z, apoi Timp Smallest to Largest)', teste: 4,
    ok: verif(cuFereastra('B3', [['Clasa', false], ['Timp (s)', false]])),
    rau: verif(dinCelula('C3', 'asc')), mesaj: ORDINE('coloana B crescător, apoi coloana C crescător'),
    rau2: doarVerifica, raspuns: RASPUNS('coloana B crescător, apoi coloana C crescător'),
    aratat: e => ordine(e.cel, 'Ana', 'Bogdan', 'Matei', 'Ioana', 'Radu', 'Irina', 'Sara', 'Ștefan'),
    extra: [testeBifate('la deschidere: 0 teste din 4', async () => {}, 0),
      testeBifate('doar Clasa (A→Z pe B): 3 teste din 4 (timpii nu sunt în ordine în clase)', dinCelula('B3', 'asc'), 3),
      testeBifate('doar timpii C2:C9, Continue → rândurile desperecheate: antetul rămâne, celelalte nu (1 din 4)', dinZona('C2', 'C9', 'asc', false), 1)] },
  { id: 'E09', nav: 'atelier', k: 1, ce: 'atelier 2: lista de lectură (My data has headers, Sort by Autor, A to Z)', teste: 3,
    ok: verif(cuFereastra('B3', [['Autor', false]])),
    rau: verif(dinCelula('B3', 'asc')), mesaj: TITLU(1, 'Carte, Autor'),
    rau2: doarVerifica, raspuns: RASPUNS('coloana B crescător'),
    aratat: e => e.cel.A1 === 'Carte' && e.cel.B1 === 'Autor' && e.cel.B2 === 'Antoine de Saint-Exupéry' && e.cel.B7 === 'Radu Tudoran' && e.cel.A4 === 'Amintiri din copilărie' && e.cel.A5 === 'Povestea lui Harap-Alb',
    extra: [testeBifate('butonul A→Z (titlul printre date): 0 teste din 3', dinCelula('B3', 'asc'), 0)] },
  /* ---- Întrebările de la sfârșit ---- */
  { id: 'E10', nav: 'q2', ce: 'Î2: timpii de la cel mai mic la cel mai mare (A→Z pe B)', ok: verif(dinCelula('B3', 'asc')),
    rau: verif(dinCelula('B3', 'desc')), mesaj: ORDINE('coloana B crescător'),
    raspuns: RASPUNS('coloana B crescător'), aratat: e => ordine(e.cel, 'Eva', 'Lia', 'Dan', 'Ion'),
    extra: [inFoaie('după A→Z: Eva 13,5 sus, Ion 15,1 jos', dinCelula('B3', 'asc'), c => c.A2 === 'Eva' && c.B2 === '13,5' && c.A5 === 'Ion' && c.B5 === '15,1')] }
];

ruleaza({ lectie: '/lectii/viii/m2-l10/index.html', cheie: 'lectie_viii_m2_l10', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, vechiNume: 'tip-excel.js + lectii/_sim/excelx.js + excelx-sortare.js', EX });
