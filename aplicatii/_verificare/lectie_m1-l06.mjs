// Probele JUCATE ale lecției lectii/viii/m1-l06 (21 de exerciții `excelx`: FORMATAREA — lățimea coloanei și ####, textul
// tăiat, înălțimea rândului, alinierea orizontală și verticală, Merge & Center (cu avertismentul), Wrap Text, borduri,
// aldin și culoare de umplere, stilul Title, zecimale, procent, Long Date), scrise ÎNAINTEA legării lecției la bibliotecă.
// Rulare, opțiuni și ce înseamnă a / b / c1 / c2: vezi lectie_comun.mjs. La b se cere și MESAJUL din inventar.
// Probele în plus:  e  al doilea drum bun · g  greșeala porții · r  „Arată-mi” lasă foaia rezolvată (starea Excelului, doar pe bibliotecă)
//   · h  ajutorul panglicii de sub foaie (la 1366 px nu încape) · d  foaia face ce spune lecția (al doilea clic pe Center scoate alinierea;
//   avertismentul de îmbinare și x care dispare după OK) · t  pe telefon (360 px, atingere): litera C, apoi două atingeri pe cercul ⇔.
// Gesturile noi (marginea dintre litere / sub numărul rândului, butoanele panglicii, listele lor) stau aici, pe ambele
// interfețe: pe simulatorul vechi (lectii/_sim/excelx-formatare.js) butoanele au data-xf, pe bibliotecă data-lh-tinta.
import { ruleaza, ecran, VECHI } from './lectie_comun.mjs';

const SCRIPTURI_VECHI = `<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../../jocuri/_motor/tip-foaie.js"></script>
<script src="../../../jocuri/_motor/tip-excel.js"></script>
<!-- foaia „excelx” comună clasei a VIII-a (lecțiile 4-5), plus stratul de FORMATARE scris pentru lecția 6 -->
<script src="../../_sim/excelx.js"></script>
<script src="../../_sim/excelx-formatare.js"></script>
`;

/* ---------- gesturile lecției 6, pe cele două interfețe ---------- */
const AX = '#body [data-lh-aplicatie="excel"]';
/* numele butonului (ca în Excel) -> data-xf pe vechi, grupul lui pe bibliotecă */
const XF = { Center: 'AlignCenter', 'Align Right': 'AlignRight', 'Middle Align': 'AlignMiddleExcel', 'Merge & Center': 'MergeCenter', 'Wrap Text': 'WrapText',
  Bold: 'Bold', 'Fill Color': 'CellFillColorPicker', Borders: 'BorderBottomNoToggle', 'Increase Decimal': 'DecimalsIncrease', 'Decrease Decimal': 'DecimalsDecrease',
  'Percent Style': 'PercentStyle', 'Number Format': 'NumberFormatGallery', 'Cell Styles': 'CellStylesGallery' };
const GR = { Center: 'Alignment', 'Align Right': 'Alignment', 'Middle Align': 'Alignment', 'Merge & Center': 'Alignment', 'Wrap Text': 'Alignment', Bold: 'Font',
  'Fill Color': 'Font', Borders: 'Font', 'Increase Decimal': 'Number', 'Decrease Decimal': 'Number', 'Percent Style': 'Number', 'Number Format': 'Number', 'Cell Styles': 'Styles' };
/* rândurile listelor, pe vechi (data-m) */
const M_VECHI = { 'All Borders': 'all', 'Merge Cells': 'cells', 'Long Date': 'Long Date', 'Short Date': 'Short Date', Title: 'Title' };
const colIdx = L => L.split('').reduce((x, ch) => x * 26 + ch.charCodeAt(0) - 64, 0);
const loc = (u, s) => u.p.locator(s).first();
/* butonul panglicii (pictograma; la butoanele despărțite, partea din stânga, nu săgeata ▾) */
async function buton(u, n) {
  if (VECHI) {
    const l = loc(u, `#body [data-xf="${XF[n]}"]`); await l.scrollIntoViewIfNeeded();
    const b = await l.boundingBox(); if (!b) throw new Error('nu e pe ecran: ' + n);
    await u.p.mouse.click(b.x + Math.min(b.width / 2, 8), b.y + b.height / 2);
  } else await loc(u, `${AX} [data-lh-tinta="panglica:Home/${GR[n]}/${n}"]`).click({ timeout: 8000 });
  await u.pauza(250);
}
/* lista unui buton: săgeata ▾ (Borders, Merge & Center) sau caseta (Number Format), galeria (Cell Styles) */
async function lista(u, n) {
  if (VECHI) {
    const l = loc(u, `#body [data-xf="${XF[n]}"]`); await l.scrollIntoViewIfNeeded();
    const b = await l.boundingBox(); if (!b) throw new Error('nu e pe ecran: ' + n);
    await u.p.mouse.click(/Borders|Merge/.test(n) ? b.x + b.width - 5 : b.x + b.width / 2, b.y + b.height / 2);
  } else await loc(u, `${AX} [data-lh-tinta="meniu_derulant:Home/${GR[n]}/${n}"]`).click({ timeout: 8000 });
  await u.pauza(250);
}
async function alege(u, n) {
  if (VECHI) await loc(u, `.xf-meniu [data-m="${M_VECHI[n] || n}"]`).click({ timeout: 8000 });
  else await loc(u, `[data-lh-aplicatie="excel"] [data-lh-tinta="meniu"][data-lh-id="${n}"]:visible, [data-lh-aplicatie="excel"] [data-lh-tinta="meniu:${n}"]:visible`).click({ timeout: 8000 });
  await u.pauza(250);
}
/* linia din dreapta literei coloanei L / de sub numărul rândului r */
const margineCol = L => VECHI ? `#body .gw thead th:nth-child(${colIdx(L) + 1}) .xf-rc` : `${AX} [data-lh-tinta="antet_coloana_margine"][data-lh-id="${L}"]`;
const margineRand = r => VECHI ? `#body .gw tbody tr:nth-child(${r}) th .xf-rr` : `${AX} [data-lh-tinta="antet_rand_margine"][data-lh-id="${r}"]`;
async function centru(u, s) { const l = loc(u, s); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox(); if (!b) throw new Error('nu e pe ecran: ' + s); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
/* dublu-clic pe linie = potrivire automată */
async function dublu(u, L) { const c = await centru(u, margineCol(L)); await u.p.mouse.dblclick(c.x, c.y); await u.pauza(300); }
/* tragere de linie: apăsat, mișcat în pași, eliberat */
async function trageLinie(u, s, dx, dy) {
  const c = await centru(u, s);
  await u.p.mouse.move(c.x, c.y); await u.p.mouse.down();
  for (let k = 1; k <= 6; k++) await u.p.mouse.move(c.x + dx * k / 6, c.y + dy * k / 6);
  await u.p.mouse.up(); await u.pauza(300);
}
const lateste = (u, L, dx) => trageLinie(u, margineCol(L), dx, 0);
const inalta = (u, r, dy) => trageLinie(u, margineRand(r), 0, dy);
/* zona: tragere de la a la b (o singură celulă = clic) */
const zona = async (u, a, b) => { if (!b || a === b) { await u.celula(a); await u.pauza(200); } else await u.trage(a, b); };
const verif = fn => async u => { await fn(u); await u.verifica(); };
/* proba d: fă gesturile, apoi uită-te în foaie */
const inFoaie = (nume, fa, bun) => ({ lit: 'd', nume, fa: async (u, p) => { await fa(u, p); await u.pauza(200); const e = await ecran(p); const r = e && await bun(e.cel, e, p); return r === true ? true : 'foaia arată altceva: ' + (typeof r === 'string' ? r + ' | ' : '') + JSON.stringify(e); } });
const respinsCu = (fn, mesaj, nume) => ({ lit: 'd', nume, respins: verif(fn), mesaj });
/* proba r (doar pe bibliotecă): după două greșeli, „Arată-mi răspunsul” lasă foaia REZOLVATĂ — citit din starea Excelului
   (formatarea nu se vede în textul celulelor: borduri, aliniere verticală, îmbinare, înălțime, text tăiat) */
const peStare = (rau, bun) => ({ lit: 'r', doarNou: true, nume: '„Arată-mi răspunsul” lasă foaia rezolvată (citit din starea Excelului)', fa: async (u, p) => {
  await rau(u); await u.verifica();
  const b = p.locator('#reveal');
  if (!(await b.count())) return 'butonul „Arată-mi răspunsul” nu a apărut';
  await b.click(); await p.waitForTimeout(1800);
  const s = await p.evaluate(() => window.LH.aplicatii.stare('excel'));
  const F = s.format_celule || {}, f = a => F[a] || {};
  return bun(f, s) === true ? true : 'starea după „Arată-mi”: ' + JSON.stringify({ F, t: s.text_taiat, h: s.inaltimi_randuri }).slice(0, 400);
} });
const toateLaturile = (f, zona) => zona.every(a => { const m = f(a).borduri || {}; return m.sus && m.jos && m.stanga && m.dreapta; });
const A1C4 = ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3', 'A4', 'B4', 'C4'];
/* proba g: greșeala pusă de poartă (JocMotor.test.gresit; vechiul aplicaGresit), apoi Verifică: „Nu încă”, cu mesajul ei */
const dePoarta = mesaj => ({ lit: 'g', nume: 'greșeala porții (JocMotor.test.gresit) e respinsă, cu mesajul ei', fa: async (u, p, x) => {
  const are = await p.evaluate(() => JocMotor.test.gresit());
  if (!are) return 'tipul exercițiului nu are greșeala porții (gresit)';
  await u.pauza(400); await u.verifica();
  const f = await x.fb(p);
  if (f.ok || /Corect!/.test(f.text)) return 'greșeala porții e luată drept „Corect”';
  return /Nu încă/.test(f.text) && mesaj.test(f.text) ? true : `nu e „Nu încă” cu ${mesaj}: ${f.text}`;
} });
/* atelierul (lista excursiei), pas cu pas, ca în cerință */
async function atelier(u, faraImbinare) {
  if (!faraImbinare) { await zona(u, 'A1', 'D1'); await buton(u, 'Merge & Center'); }
  await zona(u, 'A2', 'D2'); await buton(u, 'Bold'); await buton(u, 'Fill Color');
  await zona(u, 'A2', 'D6'); await lista(u, 'Borders'); await alege(u, 'All Borders');
  await zona(u, 'B3', 'B6'); await buton(u, 'Increase Decimal'); await buton(u, 'Increase Decimal');
  await dublu(u, 'A'); await dublu(u, 'C');
}
async function concurs(u, faraProcent) {
  await zona(u, 'A1', 'C1'); await buton(u, 'Merge & Center');
  await zona(u, 'A2', 'C2'); await buton(u, 'Bold'); await buton(u, 'Fill Color');
  await zona(u, 'A2', 'C5'); await lista(u, 'Borders'); await alege(u, 'All Borders');
  if (!faraProcent) { await zona(u, 'C3', 'C5'); await buton(u, 'Percent Style'); }
  await dublu(u, 'A');
}

const EX = [
  /* ---- P1 „Lățimea coloanei și înălțimea rândului” (foile fără panglică pe vechi) ---- */
  { id: 'E01', nav: 'p2', k: 0, ce: 'coloana C: dublu-clic pe linia dintre C și D, datele se văd', ok: verif(u => dublu(u, 'C')),
    rau: verif(u => u.clicPe('coloana:C')), mesaj: /C2, C3, C4 arată încă ####: coloana C e prea îngustă/,
    raspuns: /dublu-clic pe linia din dreapta literei coloanei C/, aratat: e => e.cel.C2 === '28.09.2026' && e.cel.C4 === '05.10.2026',
    extra: [{ lit: 'e', nume: 'corect și trăgând spre dreapta de linia dintre C și D', corect: verif(u => lateste(u, 'C', 70)) }, dePoarta(/C2, C3, C4 arată încă ####/),
      { lit: 't', nume: 'pe telefon (360 px): atingi litera C, apoi de două ori cercul ⇔ → „Corect”', fa: async (u0, p0, x) => {
        const t = await x.telefon();
        try {
          await t.u.clicPe('coloana:C'); await t.p.waitForTimeout(300);
          const g = t.p.locator(x.VECHI ? '#body .xf-grip.c' : `${AX} .lh-ap-x-cerc[data-lh-tinta="cerc_latime"][data-lh-id="C"]`).first();
          if (!(await g.count()) || !(await g.isVisible())) return 'pe telefon nu apare mânerul ⇔ al coloanei C';
          await g.scrollIntoViewIfNeeded();
          /* două atingeri repezi în același loc, ca degetul (coordonatele luate o dată: fără așteptările lui locator.tap între ele) */
          const gb = await g.boundingBox(), gx = gb.x + gb.width / 2, gy = gb.y + gb.height / 2;
          await t.p.touchscreen.tap(gx, gy); await t.p.waitForTimeout(100); await t.p.touchscreen.tap(gx, gy); await t.p.waitForTimeout(400);
          await t.u.verifica();
          const f = await x.fb(t.p);
          const aj = await t.p.evaluate(v => { const e = document.querySelector(v ? '#body .xf-tel' : '#body .xa-ajutor'); return e ? e.textContent : ''; }, x.VECHI);
          if (!/Formatarea pe telefon/.test(aj) || !/cercul/.test(aj)) return 'sub foaie lipsește ajutorul „Formatarea pe telefon”: ' + aj;
          return f.ok && /Corect/.test(f.text) ? true : 'după două atingeri pe ⇔: ' + f.text + ' | ' + JSON.stringify(await x.ecran(t.p));
        } finally { await t.inchide(); }
      } }] },
  { id: 'E02', nav: 'p2', k: 1, ce: 'coloana A potrivită după cel mai lung nume', ok: verif(u => dublu(u, 'A')),
    rau: verif(u => dublu(u, 'B')), mesaj: /Textul din A2, A3, A4 e tăiat de celula din dreapta\. Lățește coloana A/,
    raspuns: /dublu-clic pe linia din dreapta literei A/,
    extra: [peStare(verif(u => dublu(u, 'B')), (f, s) => !(s.text_taiat || []).some(a => ['A2', 'A3', 'A4'].includes(a)))] },
  { id: 'E03', nav: 'p2', k: 2, ce: 'rândul 1 mai înalt, trăgând de linia de sub numărul 1', ok: verif(u => inalta(u, 1, 28)),
    rau: verif(u => inalta(u, 1, 3)), mesaj: /Rândul 1 e încă prea scund/, raspuns: /tragi în jos de linia de sub numărul 1/,
    extra: [peStare(verif(u => inalta(u, 1, 3)), (f, s) => ((s.inaltimi_randuri || {})['1'] || 20) * 0.75 >= 25)] },
  /* ---- P2 „Alinierea” ---- */
  { id: 'E04', nav: 'p3', k: 0, ce: 'B2:B4 centrate', ok: verif(async u => { await zona(u, 'B2', 'B4'); await buton(u, 'Center'); }),
    rau: verif(async u => { await zona(u, 'B2'); await buton(u, 'Center'); }), mesaj: /B3, B4: conținutul nu e aliniat la centru/,
    raspuns: /selectezi B2:B4 și apeși Center/, aratat: e => e.al.B2 === 'centru' && e.al.B4 === 'centru',
    extra: [respinsCu(async u => { await zona(u, 'B2', 'B4'); await buton(u, 'Center'); await buton(u, 'Center'); }, /nu e aliniat la centru/, 'al doilea clic pe Center scoate alinierea (cum spune pasul): „Nu încă”')] },
  { id: 'E05', nav: 'p3', k: 1, ce: 'B1:C1 la dreapta', ok: verif(async u => { await zona(u, 'B1', 'C1'); await buton(u, 'Align Right'); }),
    rau: verif(async u => { await zona(u, 'B1', 'C1'); await buton(u, 'Center'); }), mesaj: /B1, C1: conținutul nu e aliniat la dreapta/,
    raspuns: /selectezi B1:C1 și apeși Align Right/, aratat: e => e.al.B1 === 'dreapta' && e.al.C1 === 'dreapta' },
  { id: 'E06', nav: 'p3', k: 2, ce: 'A1 la mijlocul rândului înalt (Middle Align)', ok: verif(async u => { await zona(u, 'A1'); await buton(u, 'Middle Align'); }),
    rau: verif(async u => { await zona(u, 'A1'); await buton(u, 'Center'); }), mesaj: /A1: conținutul nu e aliniat la mijloc/,
    raspuns: /selectezi A1 și apeși Middle Align/,
    extra: [peStare(verif(async u => { await zona(u, 'A1'); await buton(u, 'Center'); }), f => f('A1').aliniere_verticala === 'mijloc')] },
  /* ---- P3 „Titlul peste tabel și textul lung” ---- */
  { id: 'E07', nav: 'p4', k: 0, ce: 'Merge & Center pe A1:D1', ok: verif(async u => { await zona(u, 'A1', 'D1'); await buton(u, 'Merge & Center'); }),
    rau: verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Merge & Center'); }), mesaj: /Ai îmbinat A1:C1, dar trebuie exact A1:D1/,
    raspuns: /selectezi A1:D1 și apeși Merge &(amp;)? Center/, aratat: e => e.cel.A1 === 'Excursia clasei a VIII-a' && e.cel.B2 === 'Suma',
    extra: [dePoarta(/Ai îmbinat A1:C1, dar trebuie exact A1:D1/)] },
  { id: 'E08', nav: 'p4', k: 1, ce: 'Wrap Text pe B2', ok: verif(async u => { await zona(u, 'B2'); await buton(u, 'Wrap Text'); }),
    rau: verif(async u => { await zona(u, 'A2'); await buton(u, 'Wrap Text'); }), mesaj: /B2 nu are Încadrare text \(Wrap Text\)/,
    raspuns: /selectezi B2 și apeși Wrap Text/,
    extra: [peStare(verif(async u => { await zona(u, 'A2'); await buton(u, 'Wrap Text'); }), f => !!f('B2').incadrare)] },
  { id: 'E09', nav: 'p4', k: 2, ce: 'îmbinarea cu x în C1: avertismentul, apoi x dispare', ok: async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Merge & Center'); await u.dialogOK(); await u.optiune('Excel te avertizează, iar după OK x dispare'); },
    rau: u => u.optiune('x se mută în rândul 2, sub titlu'), rau2: u => u.optiune('Excel nu te lasă să îmbini celulele'), raspuns: /Excel te avertizează, iar după OK x dispare/,
    extra: [inFoaie('Merge & Center pe A1:C1 arată avertismentul „Merging cells only keeps the upper-left value…”; după OK, x a dispărut', async (u, p) => {
      await zona(u, 'A1', 'C1'); await buton(u, 'Merge & Center');
      const av = await p.evaluate(() => /Merging cells only keeps the upper-left value and discards other values/.test(document.body.innerText));
      if (!av) throw new Error('avertismentul de îmbinare nu apare');
      await u.dialogOK();
    }, c => c.A1 === 'Excursia clasei' && !c.C1 && !Object.values(c).includes('x'))] },
  /* ---- P4 „Borduri, culoare de umplere și stiluri” ---- */
  { id: 'E10', nav: 'p5', k: 0, ce: 'All Borders pe A1:C4', ok: verif(async u => { await zona(u, 'A1', 'C4'); await lista(u, 'Borders'); await alege(u, 'All Borders'); }),
    rau: verif(async u => { await zona(u, 'A1', 'C4'); await buton(u, 'Borders'); }), mesaj: /Nu toate celulele din A1:C4 au linii pe toate laturile/,
    raspuns: /selectezi A1:C4, apoi Borders ▾ › All Borders/,
    extra: [peStare(verif(async u => { await zona(u, 'A1', 'C4'); await buton(u, 'Borders'); }), f => toateLaturile(f, A1C4))] },
  { id: 'E11', nav: 'p5', k: 1, ce: 'A1:C1 aldin și colorat', ok: verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Bold'); await buton(u, 'Fill Color'); }),
    rau: verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Bold'); }), mesaj: /Culoarea de umplere \(Fill Color\) lipsește în A1, B1, C1/,
    raspuns: /selectezi A1:C1 și apeși B \(Bold\)/,
    extra: [peStare(verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Bold'); }), f => ['A1', 'B1', 'C1'].every(a => f(a).bold && f(a).umplere))] },
  { id: 'E12', nav: 'p5', k: 2, ce: 'stilul Title pe A1', ok: verif(async u => { await zona(u, 'A1'); await lista(u, 'Cell Styles'); await alege(u, 'Title'); }),
    rau: verif(async u => { await zona(u, 'A1'); await buton(u, 'Bold'); }), mesaj: /A1 nu are stilul „Title”/, raspuns: /Cell Styles › Title/,
    extra: [peStare(verif(async u => { await zona(u, 'A1'); await buton(u, 'Bold'); }), f => f('A1').stil === 'Title')] },
  /* ---- P5 „Forma numerelor” ---- */
  { id: 'E13', nav: 'p6', k: 0, ce: 'B2:B4 cu două zecimale (Increase Decimal de două ori)', ok: verif(async u => { await zona(u, 'B2', 'B4'); await buton(u, 'Increase Decimal'); await buton(u, 'Increase Decimal'); }),
    rau: verif(async u => { await zona(u, 'B2', 'B4'); await buton(u, 'Increase Decimal'); }), mesaj: /B2 arată „150,0”, cu o zecimală; se cer 2 zecimale/,
    raspuns: /Increase Decimal/, aratat: e => e.cel.B2 === '150,00' && e.cel.B3 === '75,50' && e.cel.B4 === '120,00',
    extra: [dePoarta(/B2 arată „150,00 lei”: ai pus un format cu lei/),
      { lit: 'h', nume: 'la 1366 px panglica nu încape: sub foaie e spus cum ajungi la grupul Număr (Number)', fa: async (u, p, x) => {
        const t = await p.evaluate(v => { const e = document.querySelector(v ? '#body .pg-ingust' : '#body .xa-ajutor'); return e ? e.textContent.trim() : ''; }, x.VECHI);
        return /Panglica (se derulează|nu încape)/.test(t) && /Număr \(Number\)/.test(t) ? true : 'ajutorul panglicii lipsește: „' + t + '”';
      } }] },
  { id: 'E14', nav: 'p6', k: 1, ce: 'C2:C4 ca procent', ok: verif(async u => { await zona(u, 'C2', 'C4'); await buton(u, 'Percent Style'); }),
    rau: verif(async u => { await zona(u, 'C2', 'C4'); await buton(u, 'Increase Decimal'); }), mesaj: /C2 arată „0,10”, nu un procent/,
    raspuns: /butonul % \(Percent Style\)/, aratat: e => e.cel.C2 === '10%' && e.cel.C3 === '25%' && e.cel.C4 === '50%' },
  { id: 'E15', nav: 'p6', k: 2, ce: 'B1 ca Long Date', ok: verif(async u => { await zona(u, 'B1'); await lista(u, 'Number Format'); await alege(u, 'Long Date'); }),
    rau: verif(async u => { await zona(u, 'B1'); await lista(u, 'Number Format'); await alege(u, 'Short Date'); }), mesaj: /B1 arată data scurt; alege Long Date/,
    raspuns: /Number Format › Long Date/, aratat: e => /9 octombrie 2026/.test(e.cel.B1 || '') },
  /* ---- Atelierul ---- */
  { id: 'E16', nav: 'atelier', k: 0, ce: 'atelier: lista excursiei', teste: 6, ok: verif(u => atelier(u)),
    rau: verif(u => atelier(u, true)), mesaj: /Celulele A1:D1 nu sunt îmbinate/, raspuns: /selectezi A1:D1 și apeși Merge &(amp;)? Center/,
    aratat: e => e.cel.B3 === '150,00' && e.cel.B4 === '75,50' && e.cel.C3 === '28.09.2026' && e.cel.A1 === 'Excursia clasei a VIII-a la Cheile Bicazului' },
  { id: 'E17', nav: 'atelier', k: 1, ce: 'atelier 2: concursul de robotică', teste: 5, ok: verif(u => concurs(u)),
    rau: verif(u => concurs(u, true)), mesaj: /C3 arată „0,87”, nu un procent/, raspuns: /Percent Style/,
    aratat: e => e.cel.C3 === '87%' && e.cel.C5 === '92%' },
  /* ---- Întrebările ---- */
  { id: 'E18', nav: 'q2', ce: 'Î2: punctajele #### se văd (coloana B lățită)', ok: verif(u => dublu(u, 'B')),
    rau: verif(u => u.clicPe('coloana:B')), mesaj: /B2, B3, B4 arată încă ####: coloana B e prea îngustă/,
    raspuns: /dublu-clic pe linia din dreapta literei coloanei B/, aratat: e => e.cel.B2 === '1.234,50' && e.cel.B4 === '1.502,00' },
  { id: 'E19', nav: 'q3', ce: 'Î3: Merge & Center pe A1:C1', ok: verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Merge & Center'); }),
    rau: verif(async u => { await zona(u, 'A1', 'C1'); await lista(u, 'Merge & Center'); await alege(u, 'Merge Cells'); }), mesaj: /A1:C1 e îmbinată, dar titlul nu e centrat/,
    raspuns: /selectezi A1:C1 și apeși Merge &(amp;)? Center/,
    extra: [peStare(verif(async u => { await zona(u, 'A1', 'C1'); await lista(u, 'Merge & Center'); await alege(u, 'Merge Cells'); }), f => f('A1').imbinat === 'A1:C1' && f('A1').aliniere === 'centru')] },
  { id: 'E20', nav: 'q4', ce: 'Î4: A1:C1 aldin și All Borders pe A1:C4', ok: verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Bold'); await zona(u, 'A1', 'C4'); await lista(u, 'Borders'); await alege(u, 'All Borders'); }),
    rau: verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Bold'); }), mesaj: /Nu toate celulele din A1:C4 au linii pe toate laturile/,
    raspuns: /All Borders/,
    extra: [peStare(verif(async u => { await zona(u, 'A1', 'C1'); await buton(u, 'Bold'); }), f => ['A1', 'B1', 'C1'].every(a => f(a).bold) && toateLaturile(f, A1C4))] },
  { id: 'E21', nav: 'q5', ce: 'Î5: B2:B4 ca procent', ok: verif(async u => { await zona(u, 'B2', 'B4'); await buton(u, 'Percent Style'); }),
    rau: verif(async u => { await zona(u, 'B2'); await buton(u, 'Percent Style'); }), mesaj: /B3 arată „0,95”, nu un procent/,
    raspuns: /butonul % \(Percent Style\)/, aratat: e => e.cel.B2 === '80%' && e.cel.B3 === '95%' && e.cel.B4 === '100%' }
];

ruleaza({ lectie: '/lectii/viii/m1-l06/index.html', cheie: 'lectie_viii_m1_l06', parcurs: { ps: [0, 1, 2, 3, 4, 5], pn: 6, at: 1, re: 1, qm: 5 },
  scripturiVechi: SCRIPTURI_VECHI, vechiNume: 'tip-excel.js + lectii/_sim/excelx.js + excelx-formatare.js', EX });
