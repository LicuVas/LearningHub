// Probele JUCATE ale lecției lectii/viii/m1-l05 (15 exerciții `excelx`: tipurile de date pe setări românești — numărul,
// textul, data calendaristică, zecimala cu virgulă, forma de dată rămasă, Golire totală, apostroful), scrise ÎNAINTEA
// legării lecției la bibliotecă. Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs.
// La b (greșeala tipică) se cere și MESAJUL din inventar (ce e greșit), nu doar „Nu încă”. Probele în plus:
//   d  foaia arată ce spune lecția (unde s-a așezat ce ai scris; 07.mai; 07.ian după Delete; Ctrl+Z scoate și forma)
//   e  al doilea drum bun (Golire totală / Clear All din panglică; „12 octombrie 2026”; Ctrl+Z de trei ori)
//   g  greșeala pusă de poartă (JocMotor.test.gresit, cheia gresitLipit): „Nu încă”, cu mesajul formei de dată rămase
//   t  pe telefon (360 px, atingere): butonul de apostrof de sub foaie, apoi 007 → „Corect”
// Simulatorul vechi al lecției = jocuri/_motor/tip-excel.js + lectii/_sim/excelx.js (ExcelX, stratul „tipuri de date”).
import { ruleaza, ecran } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<!-- foaia „excelx” comună clasei a VIII-a: gesturile din lecția 4 + tipurile de date pe setări românești (lecția 5) -->
<script src="../../_sim/excelx.js"></script>
`;

/* clic pe celulă; al doilea clic pe ACEEAȘI celulă vine după o pauză de om (proba scrie „7.5” + Enter în 0,2 s: un clic
   imediat pe aceeași celulă ar fi dublu clic, adică editare, ca în Excel) */
const clic = async (u, a) => { if (u._ultima === a) await u.pauza(700); await u.celula(a); u._ultima = a; };
/* gesturile lecției: clic pe prima celulă, apoi fiecare valoare + Enter (Enter coboară un rând) */
const scrieIn = async (u, a, ...vals) => { await clic(u, a); for (const v of vals) { await u.scrie(v); await u.tasta('Enter'); } };
const verif = fn => async u => { await fn(u); await u.verifica(); };
/* Golire totală: Pornire (Home) › Golire (Clear) ▾ › Golire totală (Clear All), pe celula a */
const golireTotala = async (u, a) => { await clic(u, a); await u.panglica('Clear'); await u.meniu('Clear All'); };
/* proba d: fă gesturile, apoi uită-te în foaie */
const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u); await u.pauza(200); const e = await ecran(p); return e && bun(e.cel, e) ? true : 'foaia arată altceva: ' + JSON.stringify(e); } });
/* proba g: greșeala pusă de poartă (gresitLipit), apoi Verifică */
const dePoarta = mesaj => ({ lit: 'g', nume: 'greșeala porții (gresitLipit: număr scris peste o celulă cu forma de dată) e respinsă, cu mesajul formei rămase',
  fa: async (u, p, x) => {
    const are = await p.evaluate(() => JocMotor.test.gresit());
    if (!are) return 'tipul exercițiului nu are greșeala porții (gresit)';
    await u.pauza(300); await u.verifica();
    const f = await x.fb(p);
    if (f.ok || /Corect!/.test(f.text)) return 'greșeala porții e luată drept „Corect”';
    return /Nu încă/.test(f.text) && mesaj.test(f.text) ? true : `nu e „Nu încă” cu ${mesaj}: ${f.text} | ${JSON.stringify(await x.ecran(p))}`;
  } });
const FORMA_RAMASA = /păstrat forma de dată/;
/* proba m: mini-foile „Uite cum” din textul pasului (desenate de lecție cu ExcelTipuri.afisare: pe bibliotecă, parserul din
   excel.js) arată ce arăta simulatorul vechi; bun(celule) primește [{t: text, dr: la dreapta, tri: triunghi verde}] */
const miniFoi = (nume, bun) => ({ lit: 'm', nume, fa: async (u, p) => {
  const c = await p.evaluate(() => [...document.querySelectorAll('table.g td')].map(td => { const d = td.querySelector('div'); return { t: td.textContent.trim(), dr: !!(d && /right/.test(d.style.textAlign)), tri: td.classList.contains('g-tri') }; }));
  return c.length && bun(c) ? true : 'mini-foile arată altceva: ' + JSON.stringify(c.filter(x => x.t)).slice(0, 400);
} });
const are = (c, t, dr, tri) => c.some(x => x.t === t && x.dr === dr && (tri == null || x.tri === tri));

const EX = [
  /* ---- P3 „Alinierea îți arată tipul” ---- */
  { id: 'E01', nav: 'p3', k: 0, ce: '12, Ana, 05.10.2026 în B2:B4', ok: verif(u => scrieIn(u, 'B2', '12', 'Ana', '05.10.2026')),
    rau: verif(u => scrieIn(u, 'B2', '12', 'Ana', '05,10,2026')), mesaj: /În B4, „05,10,2026” a rămas text.*05\.10\.2026/,
    raspuns: /05\.10\.2026/, aratat: e => e.cel.B2 === '12' && e.cel.B3 === 'Ana' && e.cel.B4 === '05.10.2026',
    extra: [inFoaie('12 și data stau la dreapta, Ana la stânga', u => scrieIn(u, 'B2', '12', 'Ana', '05.10.2026'), (c, e) => e.al.B2 === 'dreapta' && e.al.B3 === 'stanga' && e.al.B4 === 'dreapta' && c.B4 === '05.10.2026')] },
  { id: 'E02', nav: 'p3', k: 1, ce: '7B în A1 se așază la stânga', ok: async u => { await scrieIn(u, 'A1', '7B'); await u.optiune('La stânga, pentru că e text'); },
    rau: u => u.optiune('La dreapta, pentru că e număr'), rau2: u => u.optiune('La mijlocul celulei'), raspuns: /La stânga/,
    extra: [inFoaie('7B scris în A1 stă la stânga', u => scrieIn(u, 'A1', '7B'), (c, e) => c.A1 === '7B' && e.al.A1 === 'stanga')] },
  /* ---- P4 „Zecimalele se scriu cu virgulă” ---- */
  { id: 'E03', nav: 'p4', k: 0, ce: '9,5 și 7,5 cu virgulă', ok: verif(u => scrieIn(u, 'B2', '9,5', '7,5')),
    rau: verif(u => scrieIn(u, 'B2', '9.5', '7,5')), mesaj: /În B2 ai scris „9\.5”, iar Excel a făcut din el o dată: 09\.mai\..*virgulă: 9,5/,
    raspuns: /9,5/, aratat: e => e.cel.B2 === '9,5' && e.cel.B3 === '7,5',
    extra: [miniFoi('pasul 4, „Uite cum”: 7,5 → 7,5 la dreapta; 7.5 → 07.mai la dreapta', c => are(c, '7,5', true) && are(c, '07.mai', true) && are(c, 'Bogdan', false)),
      inFoaie('zecimala cu virgulă: 9,5 și 7,5 sunt numere, la dreapta', u => scrieIn(u, 'B2', '9,5', '7,5'), (c, e) => c.B2 === '9,5' && c.B3 === '7,5' && e.al.B2 === 'dreapta' && e.al.B3 === 'dreapta')] },
  { id: 'E04', nav: 'p4', k: 1, ce: '7.5 cu punct devine 07.mai', ok: async u => { await scrieIn(u, 'B2', '7.5'); await u.optiune('07.mai, la dreapta'); },
    rau: u => u.optiune('7,5, la dreapta'), rau2: u => u.optiune('7.5, la stânga'), raspuns: /07\.mai/,
    extra: [inFoaie('7.5 cu punct apare 07.mai, la dreapta', u => scrieIn(u, 'B2', '7.5'), (c, e) => c.B2 === '07.mai' && e.al.B2 === 'dreapta')] },
  /* ---- P5 „Ai greșit tipul? Ctrl+Z sau Golire totală” ---- */
  { id: 'E05', nav: 'p5', k: 0, ce: '7.5, Ctrl+Z, apoi 7,5', ok: verif(async u => { await scrieIn(u, 'B2', '7.5'); await u.tasta('Control+z'); await scrieIn(u, 'B2', '7,5'); }),
    /* greșeala tipică (gresitLipit): 7,5 scris PESTE 07.mai — celula păstrează forma de dată și arată 07.ian */
    rau: verif(async u => { await scrieIn(u, 'B2', '7.5'); await scrieIn(u, 'B2', '7,5'); }), mesaj: /În B2 ai scris un număr, dar celula a păstrat forma de dată.*07\.ian.*Golire totală \(Clear All\)/,
    raspuns: /7,5/, aratat: e => e.cel.B2 === '7,5' && e.al.B2 === 'dreapta',
    extra: [
      inFoaie('Delete nu scoate forma de dată: 7.5, Delete, 7,5 → 07.ian', async u => { await scrieIn(u, 'B2', '7.5'); await clic(u, 'B2'); await u.tasta('Delete'); await scrieIn(u, 'B2', '7,5'); }, c => c.B2 === '07.ian'),
      Object.assign(inFoaie('Ctrl+Z scoate și data, și forma: după 7.5 și Ctrl+Z, 7,5 rămâne 7,5', async u => { await scrieIn(u, 'B2', '7.5'); await u.tasta('Control+z'); await scrieIn(u, 'B2', '7,5'); }, (c, e) => c.B2 === '7,5' && e.al.B2 === 'dreapta'), { lit: 'd2' }),
      { lit: 'e', nume: 'corect și cu Golire totală (Clear All) din panglică, după 07.ian', corect: async u => { await scrieIn(u, 'B2', '7.5'); await scrieIn(u, 'B2', '7,5'); await golireTotala(u, 'B2'); await scrieIn(u, 'B2', '7,5'); await u.verifica(); } },
      dePoarta(FORMA_RAMASA),
      miniFoi('pasul 5, „Uite cum”: 7,5 peste forma de dată arată 07.ian, la dreapta; după Golire totală, 7,5', c => are(c, '07.ian', true) && are(c, '7,5', true))] },
  { id: 'E06', nav: 'p5', k: 2, ce: 'B2 arată 09.ian: Golire totală, apoi 9,5', ok: verif(async u => { await golireTotala(u, 'B2'); await scrieIn(u, 'B2', '9,5'); }),
    rau: verif(async u => { await clic(u, 'B2'); await u.tasta('Delete'); await scrieIn(u, 'B2', '9,5'); }), mesaj: /păstrat forma de dată.*09\.ian/,
    raspuns: /9,5/, aratat: e => e.cel.B2 === '9,5',
    extra: [inFoaie('pornește cu 09.ian în B2 (pașii de dinainte, făcuți cu gesturile foii)', async () => {}, c => c.B2 === '09.ian' && c.A2 === 'Bogdan'), dePoarta(FORMA_RAMASA)] },
  /* ---- P6 „Numere care rămân text: apostroful” ---- */
  { id: 'E07', nav: 'p6', k: 0, ce: "'007 cu apostrof", ok: verif(u => scrieIn(u, 'B2', "'007")),
    rau: verif(u => scrieIn(u, 'B2', '007')), mesaj: /În B2 Excel a făcut din „007” numărul 7 \(la dreapta\).*apostrof.*'007/,
    raspuns: /'007/, aratat: e => e.cel.B2 === '007' && e.al.B2 === 'stanga',
    extra: [
      miniFoi("pasul 6, „Uite cum”: 007 → 7 la dreapta; '007 → 007 la stânga, cu triunghiul verde", c => are(c, '7', true, false) && are(c, '007', false, true)),
      inFoaie("'007 se vede 007, la stânga, cu triunghiul verde", u => scrieIn(u, 'B2', "'007"), (c, e) => c.B2 === '007' && e.al.B2 === 'stanga' && e.tri.includes('B2')),
      { lit: 't', nume: 'pe telefon (360 px): butonul de apostrof de sub foaie, apoi 007 → „Corect”', fa: async (u0, p0, x) => {
        const t = await x.telefon();
        try {
          await t.u.celula('B2');
          const b = t.p.locator(x.VECHI ? '#body .xt-apos' : '#body [data-lh-ajutor="taste"] [data-lh-tasta="\'"]').first();
          if (!(await b.count()) || !(await b.isVisible())) return 'pe telefon nu se vede butonul de apostrof';
          await b.click(); await t.p.waitForTimeout(200);
          await t.u.scrie('007'); await t.u.tasta('Enter'); await t.u.verifica();
          const f = await x.fb(t.p);
          return f.ok && /Corect/.test(f.text) ? true : 'după butonul de apostrof + 007: ' + f.text + ' | ' + JSON.stringify(await x.ecran(t.p));
        } finally { await t.inchide(); }
      } }] },
  { id: 'E08', nav: 'p6', k: 1, ce: "'0042 cu apostrof", ok: verif(u => scrieIn(u, 'B2', "'0042")),
    rau: verif(u => scrieIn(u, 'B2', '0042')), mesaj: /„0042” numărul 42/, raspuns: /'0042/, aratat: e => e.cel.B2 === '0042' },
  { id: 'E09', nav: 'p6', k: 2, ce: '007 fără apostrof devine 7', ok: async u => { await scrieIn(u, 'A1', '007'); await u.optiune('7, la dreapta'); },
    rau: u => u.optiune('007, la stânga'), rau2: u => u.optiune('007, la dreapta'), raspuns: /7, la dreapta/,
    extra: [inFoaie('007 fără apostrof apare 7, la dreapta', u => scrieIn(u, 'A1', '007'), (c, e) => c.A1 === '7' && e.al.A1 === 'dreapta')] },
  /* ---- Atelierul ---- */
  { id: 'E10', nav: 'atelier', k: 0, ce: 'atelier: sume, date, coduri', teste: 3,
    ok: verif(async u => { await scrieIn(u, 'B2', '150', '75,5', '120'); await scrieIn(u, 'C2', '28.09.2026', '01.10.2026', '05.10.2026'); await scrieIn(u, 'D2', "'001", "'002", "'003"); }),
    /* greșeala tipică: codurile fără apostrof (1, 2, 3) */
    rau: verif(async u => { await scrieIn(u, 'B2', '150', '75,5', '120'); await scrieIn(u, 'C2', '28.09.2026', '01.10.2026', '05.10.2026'); await scrieIn(u, 'D2', '001', '002', '003'); }),
    mesaj: /În D2 Excel a făcut din „001” numărul 1/, raspuns: /'001/,
    aratat: e => e.cel.B3 === '75,5' && e.cel.C2 === '28.09.2026' && e.cel.C4 === '05.10.2026' && e.cel.D2 === '001' && e.cel.D4 === '003' },
  { id: 'E11', nav: 'atelier', k: 1, ce: 'atelier 2: jurnalul fasolei', teste: 3,
    ok: verif(async u => { await scrieIn(u, 'B2', '12.10.2026', '13.10.2026'); await scrieIn(u, 'C2', '3,5', '4,25'); await scrieIn(u, 'D2', 'a răsărit'); }),
    rau: verif(async u => { await scrieIn(u, 'B2', '12.10.2026', '13.10.2026'); await scrieIn(u, 'C2', '3.5', '4,25'); await scrieIn(u, 'D2', 'a răsărit'); }),
    mesaj: /În C2 ai scris „3\.5”, iar Excel a făcut din el o dată: 03\.mai/, raspuns: /4,25/,
    aratat: e => e.cel.B2 === '12.10.2026' && e.cel.C2 === '3,5' && e.cel.C3 === '4,25' && e.cel.D2 === 'a răsărit' },
  /* ---- Întrebările ---- */
  { id: 'E12', nav: 'q2', ce: 'Î2: 1,62 ca număr', ok: verif(u => scrieIn(u, 'B3', '1,62')), rau: verif(u => scrieIn(u, 'B3', '1.62')),
    mesaj: /În B3 ai scris „1\.62”, iar Excel a făcut din el o dată: ian\.62/, raspuns: /1,62/, aratat: e => e.cel.B3 === '1,62' },
  { id: 'E13', nav: 'q3', ce: 'Î3: data 12.10.2026', ok: verif(u => scrieIn(u, 'C2', '12.10.2026')), rau: verif(u => scrieIn(u, 'C2', '12,10,2026')),
    mesaj: /În C2, „12,10,2026” a rămas text/, raspuns: /12\.10\.2026/, aratat: e => e.cel.C2 === '12.10.2026',
    extra: [{ lit: 'e', nume: 'corect și cu „12 octombrie 2026” (Excel o recunoaște drept dată)', corect: verif(u => scrieIn(u, 'C2', '12 octombrie 2026')) }] },
  { id: 'E14', nav: 'q4', ce: "Î4: '07", ok: verif(u => scrieIn(u, 'B2', "'07")), rau: verif(u => scrieIn(u, 'B2', '07')),
    mesaj: /„07” numărul 7/, raspuns: /'07/, aratat: e => e.cel.B2 === '07' },
  { id: 'E15', nav: 'q5', ce: 'Î5: B2 arată 08.ian (după Delete): Golire totală, apoi 8,5', ok: verif(async u => { await golireTotala(u, 'B2'); await scrieIn(u, 'B2', '8,5'); }),
    rau: verif(async u => { await clic(u, 'B2'); await u.tasta('Delete'); await scrieIn(u, 'B2', '8,5'); }), mesaj: /păstrat forma de dată.*08\.ian/,
    raspuns: /8,5/, aratat: e => e.cel.B2 === '8,5',
    extra: [{ lit: 'e', nume: 'corect și cu Ctrl+Z de trei ori (08.ian → gol → 08.mai → gol), apoi 8,5', corect: verif(async u => { await clic(u, 'B2'); await u.tasta('Control+z', 3); await scrieIn(u, 'B2', '8,5'); }) },
      dePoarta(FORMA_RAMASA)] }
];

/* blocul bibliotecii al lecției 5: și excel.js, direct, pentru mini-foile „Uite cum” din text (ExcelTipuri.afisare) */
const SCRIPTURI_NOI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../aplicatii/aplicatii.js"></script>
<script src="../../../aplicatii/excel.js"></script>
<script src="../../../aplicatii/adapters/excel-excelx-adapter.js"></script>
`;

ruleaza({ lectie: '/lectii/viii/m1-l05/index.html', cheie: 'lectie_viii_m1_l05', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, scripturiNoi: SCRIPTURI_NOI, vechiNume: 'tip-excel.js + lectii/_sim/excelx.js', EX });
