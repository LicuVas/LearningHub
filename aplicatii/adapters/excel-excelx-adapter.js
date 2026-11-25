/* excel-excelx-adapter.js — tipul „excelx” al motorului de lecții (clasa a VIII-a), pe biblioteca aplicatii/ (excel.js).
   Înlocuiește, în lecția care îl încarcă, simulatoarele vechi: jocuri/_motor/tip-excel.js (JocExcel), lectii/_sim/excelx.js
   (ExcelX / ExcelPlus) și extensiile lor (excelx-interfata.js = ExcelI …). Datele lecției NU se schimbă: adaptorul pune pe
   `window` numele pe care lecția îl dă deja la `tipuri:{excelx:…}`, implementat pe bibliotecă.
   Folosire (în lecție, după motor.js):
     <script src="../../../aplicatii/aplicatii.js"></script>
     <script src="../../../aplicatii/adapters/excel-excelx-adapter.js"></script>
     JocMotor.porneste({ …, tipuri:{excelx:ExcelI} })        (sau ExcelX, ExcelPlus, ExcelXF, ExcelF, ExcelFn, ExcelD, ExcelS, ExcelG)

   CE FACE ADAPTORUL (și ce NU): deschide Excelul din bibliotecă cu foile exercițiului, citește `inst.stare()` și spune verdictul.
   Nu desenează nimic din Excel și nu calculează nimic din Excel (contract R6): tot ce ține de foaie e în aplicatii/excel.js.

   EXERCIȚIUL (Q), cheile primite:
     cells {A1: 'Elev', B2: 9}            celulele de pornire (o foaie, „Sheet1”)
     foi [{nume, cells}], foaie           registrul cu mai multe foi; foaie = indicele foii deschise la început
     start 'D4'                           celula activă de la început; foaia are tastatura (elevul scrie fără clic)
     zoom, latimi {A: px}                 zoom-ul de pornire, lățimile coloanelor
     inainte [['B2','8.5'],['B2','DEL']]  pași făcuți în foaie înainte de exercițiu (cu aceleași gesturi ca elevul)
     o [...], ok                          variante de răspuns sub foaie (foaia e de încercat; verdictul = clicul pe variantă)
     verifica {...}, teste [{ce, ...}]    vezi mai jos
     cols, rows, panglica                 NU se folosesc: Excelul din bibliotecă are mărimea și panglica lui (nu se reduce interfața)
     doarMouse true                       Copierea și Lipirea trebuie date cu mouse-ul (meniul de clic dreapta sau panglica), nu cu
                                          Ctrl+C / Ctrl+V: se citește din evenimentele bibliotecii (gestul fiecărei copieri / lipiri)
     variante true                        după „Corect” apare „Exersează pe variante”: aceeași sarcină pe un tabel mutat, cu alte nume și
                                          numere (3 corecte la rând = stăpânit; seria se ține în aceeași cheie ca pe simulatorul vechi)
   VERIFICAREA (Q.verifica; toate cheile prezente trebuie să fie adevărate), pe starea bibliotecii:
     unde 'caseta'|'bara'|'fx'|'fila:data'|'grup:Number'|'foaie:Excursie'|'zoom'|'stare'|'coloana:C'|'rand:3'|'celula:B2'|'x:*'
                                          ultimul loc ATINS din fereastră (un șir sau o listă de variante)
     fila 'data'                          fila panglicii deschisă            (stare().fila_panglica)
     foaie 'Excursie'                     foaia deschisă                     (stare().foaie_activa)
     pe 'Excursie'                        foaia pe care se citesc valori / gol / formule / activa / zoom (implicit: cea deschisă)
     zoom 120                             zoom-ul foii                       (stare().zoom_foi)
     valori {A1: 'Elev', B2: 9}           ce e în celule (text fără majuscule / număr)   (stare().foi_celule)
     formule {D2: '=B2*C2'}               formula din celulă, ca text (fără spații, fără majuscule, ; = ,)
     gol ['B3']                           celule goale
     sel 'D3', activa 'A4'                celula activă                      (stare().selectii_foi)
     zona 'B2:D2'                         zona selectată
     neatinsa 'Note'                      foaia a rămas ca la pornire
     doarTaste true                       niciun clic în foaie în afara celulei active
     mesajActiva 'text cu {a}'            mesajul propriu pentru `activa`
     tip {B2:{numar:7.5}, C2:{text:'007'}, D2:{data:'05.10.2026'}}   TIPUL de date înțeles de Excel (lecția 5, setări românești):
                                          stare().tip_celule (numar / data / text, din valoare + forma celulei) și valoarea;
                                          mesajele spun ce a TASTAT elevul (citit din evenimentele bibliotecii: celula în editare
                                          înainte de Enter), ca simulatorul vechi (lectii/_sim/excelx.js › problema)
   gresitLipit ['B2']                     greșeala porții (`gresit`) la B2 = numărul scris PESTE o dată (forma de dată rămâne: 07.ian)
   O cheie pe care adaptorul nu o știe NU trece (și se scrie în consolă): forma, functie, gest, umplut, sortat, format,
   imbinat, grafic — ale lecțiilor 6-11, de adus când se leagă acelea (vezi raportul pilotului).
   TESTELE numite (Q.teste: [{ce, …aceleași chei…, fara: ['x']}]) se bifează singure deasupra foii.

   AJUTOARELE: indiciul e al motorului (Q.ajutor). „Nu încă” spune CE e greșit (aceleași texte ca simulatorul vechi).
   „Arată-mi răspunsul” (după a doua greșeală) spune răspunsul în cuvinte ȘI ÎL EXECUTĂ în Excelul din bibliotecă, cu aceleași
   gesturi ca elevul, trimise ca evenimente către elementele bibliotecii (apăsare pe ținta canonică, taste) — exact cum face bara
   de taste a bibliotecii; nimic nu se scrie direct în modelul foii. La `unde`, locul e și evidențiat (LH.aplicatii.evidentiaza).
   `rezolva` / `gresit` (poarta test_joc.py) fac același lucru: rezolvarea, respectiv o greșeală tipică. */
(function () {
  'use strict';
  const W = window;
  const L = W.LH && W.LH.aplicatii;
  if (!L) throw new Error('excel-excelx-adapter: biblioteca aplicatii/ nu e încărcată (aplicatii.js înainte de adaptor)');

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const numarRo = v => typeof v === 'number' ? String(v).replace('.', ',') : String(v);
  const egalNume = (a, b) => String(a == null ? '' : a).toLowerCase() === String(b == null ? '' : b).toLowerCase();
  /* filele panglicii: cheia din lecție -> eticheta de pe ecran (Excel în engleză) și numele pe „ambele” din textele lecției */
  const FILA_EN = { file: 'File', home: 'Home', insert: 'Insert', draw: 'Draw', pagelayout: 'Page Layout', formulas: 'Formulas', data: 'Data', review: 'Review', view: 'View', help: 'Help' };
  const FILE = { file: 'File', home: 'Pornire (Home)', insert: 'Inserare (Insert)', draw: 'Desenare (Draw)', pagelayout: 'Aspect pagină (Page Layout)', formulas: 'Formule (Formulas)', data: 'Date (Data)', review: 'Revizuire (Review)', view: 'Vizualizare (View)', help: 'Ajutor (Help)' };
  const cheieFila = eticheta => String(eticheta || '').toLowerCase().replace(/\s+/g, '');
  const CTX = new WeakMap();

  let cssPus = false;
  function css() {
    if (cssPus) return; cssPus = true;
    const s = document.createElement('style');
    s.id = 'xa-css';
    s.textContent = `
.xa-host{min-height:0}
.xa-teste{margin:0 0 10px;padding:8px 12px;border:1px solid var(--line,#cfd9d2);border-radius:8px;background:var(--paper2,#eef3ef);font-size:.92rem}
.xa-teste:empty{display:none}
.xa-teste .lbl{font-weight:700;color:var(--accent,#107c41)}
.xa-teste ul{list-style:none;padding:0;margin:4px 0 0}
.xa-teste li{display:flex;gap:8px;margin:2px 0;color:var(--ink2,#546358)}
.xa-teste li.ok{color:var(--ok,#0f6e3a)}
.xa-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.xa-nota{margin:6px 0 0;padding:6px 10px;font-size:.88rem;border-radius:6px;background:var(--sel,#d4eddc);color:var(--ink,#15201a)}
.xa-nota:empty{display:none}
.xa-opts{margin-top:10px}`;
    document.head.appendChild(s);
  }

  /* ---------- starea, citită din bibliotecă ---------- */
  const stare = ctx => { try { return ctx.inst ? ctx.inst.stare() : null; } catch (e) { return null; } };
  const numeFoaie = (s, n) => { if (n == null) return s.foaie_activa; const f = (s.foi || []).find(x => egalNume(x, n)); return f == null ? s.foaie_activa : f; };
  const celulePe = (s, f) => (s.foi_celule || {})[f] || {};
  const activaPe = (s, f) => { const x = (s.selectii_foi || {})[f]; return x ? x.activa : (f === s.foaie_activa && s.selectie ? s.selectie.activa : null); };
  const zonaPe = (s, f) => { const x = (s.selectii_foi || {})[f]; return x ? x.zona : (f === s.foaie_activa && s.selectie ? s.selectie.zona : null); };
  const zoomPe = (s, f) => { const z = (s.zoom_foi || {})[f]; return z != null ? z : (f === s.foaie_activa ? s.zoom : 100); };
  const filaDeschisa = s => cheieFila(s.fila_panglica);
  const brut = x => x == null ? '' : (typeof x === 'object' ? (x.valoare != null ? x.valoare : (x.text != null ? x.text : '')) : x);
  const afisat = x => x == null ? '' : (typeof x === 'object' ? (x.text != null ? x.text : String(brut(x))) : String(x));
  function eqVal(raw, v) {
    if (raw == null || raw === '') return v === '' || v == null;
    if (typeof v === 'number') { const x = typeof raw === 'number' ? raw : Number(String(raw).trim().replace(/^'/, '').replace(',', '.')); return isFinite(x) && Math.abs(x - v) < 1e-9; }
    return String(raw).trim().toLowerCase() === String(v).trim().toLowerCase();
  }
  const formulaNorm = f => String(f == null ? '' : f).replace(/\s+/g, '').replace(/;/g, ',').toUpperCase();
  /* celulele de pornire ale unei foi, ca {A1: valoare} (pentru `neatinsa`) */
  const pornireFoaie = (Q, nume) => { const f = (Q.foi || []).find(x => egalNume(x.nume, nume)); return (Q.foi && Q.foi.length ? (f ? f.cells : {}) : Q.cells) || {}; };

  /* ---------- ce loc din fereastră a fost atins (pe marcajele bibliotecii: data-lh-tinta, data-lh-tip, data-lh-eticheta) ---------- */
  const canon = el => { const t = el.getAttribute('data-lh-tinta') || '', id = el.getAttribute('data-lh-id'); return id != null && t.indexOf(':') < 0 ? t + ':' + id : t; };
  function locDin(t, root) {
    if (!t || !t.closest || !root.contains(t)) return null;
    const x = t.closest('[data-lh-tinta]');
    const c = x && root.contains(x) ? canon(x) : '';
    const i = c.indexOf(':'), fel = i < 0 ? c : c.slice(0, i), v = i < 0 ? '' : c.slice(i + 1);
    if (fel === 'zoom') return 'zoom';
    if (fel === 'fila_foii') return 'foaie:' + v;
    if (fel === 'fila_foii_buton') return 'foi';
    if (c === 'camp:Name Box') return 'caseta';
    if (c === 'bara_formule') return 'bara';
    if (fel === 'bara_formule') return 'fx';
    if (fel === 'fila') return 'fila:' + cheieFila(v);
    if (fel === 'acces_rapid') return 'qat';
    if (fel === 'antet_coloana') return 'coloana:' + v;
    if (fel === 'antet_rand') return 'rand:' + v;
    if (fel === 'selecteaza_tot') return 'colt';
    if (fel === 'celula') return 'celula:' + v;
    if (fel === 'bara_stare') return 'stare';
    /* grupul panglicii: cel mai apropiat grup care își arată numele (legenda) dedesubt */
    let g = t.closest('[data-lh-tip="Group"]');
    while (g && root.contains(g)) {
      if ([].some.call(g.children, k => k.classList && k.classList.contains('lh-ap-legenda'))) return 'grup:' + g.getAttribute('data-lh-eticheta');
      g = g.parentElement ? g.parentElement.closest('[data-lh-tip="Group"]') : null;
    }
    if (fel === 'panglica' || fel === 'lansator' || fel === 'meniu_derulant') return 'panglica';
    return null;
  }
  function descrie(loc) {
    if (!loc) return 'nimic încă';
    const i = loc.indexOf(':'), k = i < 0 ? loc : loc.slice(0, i), v = i < 0 ? '' : loc.slice(i + 1);
    return { caseta: 'caseta de nume (Name Box)', bara: 'bara de formule (Formula Bar)', fx: 'semnul fx (el deschide altceva în Excel)', stare: 'bara de stare', zoom: 'zoom-ul', foi: 'rândul cu filele foilor',
      panglica: 'panglica', qat: 'butoanele ↶ ↷ de deasupra', colt: 'colțul dintre litere și numere',
      fila: `fila ${FILE[v] || v} a panglicii`, grup: `grupul ${v} al panglicii`, foaie: `fila foii ${v}`, coloana: `litera coloanei ${v}`, rand: `numărul rândului ${v}`, celula: `celula ${v}` }[k] || loc;
  }
  const potriveste = (loc, exp) => [].concat(exp).some(e => e === loc || (e.endsWith(':*') && loc && loc.startsWith(e.slice(0, -1))));
  const primul = unde => [].concat(unde)[0].replace(/:\*$/, '');

  /* ---------- tipul de date (Q.verifica.tip, lecția 5): mesajele simulatorului vechi (lectii/_sim/excelx.js › problema) ----------
     Pe bibliotecă panglica e mereu acolo, deci repararea formei de dată rămase e mereu Golire totală (Clear All); pe vechi, la
     foile fără panglică (`panglica:false`), mesajul spunea „Ctrl+Z până dispare …”. */
  const PE_GOLIRE = a => `selectează ${a}, apoi, pe fila Pornire (Home), butonul cu radieră Golire (Clear), al treilea din grupul Editare (Editing) (dacă nu vezi grupul, derulează panglica spre dreapta) › Golire totală (Clear All): celula rămâne goală, fără forma de dată`;
  /* parserul setărilor românești al bibliotecii (excel.js › tipuri): ce face Excel dintr-un text tastat. Adaptorul NU citește
     singur numere / date (R6): îl întreabă pe el ce zi e data cerută și dacă textul cerut ar rămâne text fără apostrof */
  const tipuriBiblioteca = () => {
    const m = L._module && L._module.excel;
    if (!m || !m.tipuri) throw new Error('excel-excelx-adapter: parserul aplicatii/excel.js (tipuri) nu e încărcat');
    return m.tipuri;
  };
  /* numărul zilei datei CERUTE de lecție ('05.10.2026'), cum îl face Excel la tastare */
  const serialCerut = d => { const x = tipuriBiblioteca().afisare(String(d)); return x.tip === 'data' ? x.v : NaN; };
  /* textul cerut trebuie scris cu apostrof ca să rămână text (007 → numărul 7 fără el) */
  const cuApostrof = t => tipuriBiblioteca().afisare(String(t)).tip !== 'text';
  /* ce a tastat elevul în celula a, pentru valoarea de acum (și după Anulare: textul lui, nu ce arată celula) */
  const tastatIn = (ctx, a, c) => { const h = ctx.ist && ctx.ist[a], k = c ? JSON.stringify(c.valoare) : ''; return (h && h[k] != null) ? h[k] : (c ? String(c.text != null ? c.text : brut(c)) : ''); };
  function infoTip(s, R, a) {
    const c = R[a], t = (s.tip_celule || {})[a];
    if (!c || c.editare || brut(c) === '') return { tip: 'gol', afisat: '' };
    return { tip: t ? t.tip : (typeof c.valoare === 'number' ? 'numar' : 'text'), v: c.valoare, afisat: String(c.text != null ? c.text : c.valoare).trim(), apostrof: !!(t && t.apostrof) };
  }
  function problemaTip(ctx, s, R, a, exp) {
    const i = infoTip(s, R, a), tastat = tastatIn(ctx, a, R[a]), af = esc(i.afisat), ts = esc(tastat);
    if ('numar' in exp) {
      const x = exp.numar, xs = numarRo(x);
      if (i.tip === 'gol') return `${a} e goală: scrie în ea ${xs}.`;
      if (i.tip === 'numar' && Math.abs(i.v - x) < 1e-9) return '';
      if (i.tip === 'data' || i.tip === 'ora') {
        /* număr simplu tastat (7,5) care arată o dată = forma rămasă de la o greșeală de mai devreme (07.ian) */
        const p0 = tipuriBiblioteca().afisare(tastat);
        if (Math.abs(i.v - x) < 1e-9 || (p0.tip === 'numar' && p0.fmt === 'General')) return `În ${a} ai scris un număr, dar celula a păstrat forma de dată de la o greșeală de mai devreme și arată ${af}. Ca s-o scoți, ${PE_GOLIRE(a)}. Apoi scrie ${xs}.`;
        return `În ${a} ai scris „${ts}”, iar Excel a făcut din el o dată: ${af}. Pe setări românești zecimala se scrie cu virgulă: ${xs}. Dacă a fost ultimul lucru făcut, apasă Ctrl+Z (sau ↶); altfel ${PE_GOLIRE(a)}. Apoi scrie ${xs}.`;
      }
      if (i.tip === 'text') return i.apostrof ? `În ${a} ai pus un apostrof în față, deci Excel ține „${af}” ca text. Scrie doar ${xs}, fără apostrof.` : `În ${a}, „${af}” a rămas text (stă la stânga), nu număr. Scrie doar cifrele, cu virgulă la zecimale: ${xs}.`;
      return `În ${a} se vede ${af}, dar trebuie numărul ${xs}.`;
    }
    if ('data' in exp) {
      const d = esc(exp.data);
      if (i.tip === 'gol') return `${a} e goală: scrie în ea data ${d}.`;
      if (i.tip === 'data' && Math.floor(i.v + 1e-9) === serialCerut(exp.data)) return '';
      if (i.tip === 'text') return `În ${a}, „${af}” a rămas text, la stânga: Excel nu l-a recunoscut ca dată. Scrie ziua, punct, luna, punct, anul: ${d}.`;
      if (i.tip === 'data') return `În ${a} e data ${af}, dar se cere ${d}.`;
      return `În ${a} e un număr, nu o dată. Scrie data cu puncte: ${d}.`;
    }
    if ('text' in exp) {
      const t = String(exp.text), te = esc(t);
      if (i.tip === 'gol') return `${a} e goală: scrie în ea ${te}.`;
      if (i.tip === 'text' && String(i.v).trim().toLowerCase() === t.toLowerCase()) return '';
      /* tastatura românească: tasta din stânga lui Enter scrie ț (apostroful = AltGr + aceeași tastă); telefonul poate pune ’ */
      if (i.tip === 'text' && /^[țȚ]/.test(i.v)) return `În ${a} a apărut „${af}”: tastatura e românească, iar tasta din stânga lui Enter scrie ț. Apostroful îl faci ținând apăsată tasta AltGr (Alt din dreapta) și apăsând aceeași tastă. Scrie din nou: '${te}.`;
      if (i.tip === 'text' && /^[’‘`´]/.test(i.v)) return `În ${a} a apărut „${af}”: în loc de apostroful drept ' s-a pus alt semn (${esc(i.afisat[0])}), pe care Excel îl ține ca pe o literă. Pe telefon, atinge butonul ' din bara de taste de sub foaie și scrie din nou ${te}.`;
      if (i.tip === 'numar' && /^0\d/.test(t)) return `În ${a} Excel a făcut din „${ts}” numărul ${af} (la dreapta) și a pierdut zerourile din față. Scrie un apostrof înainte: '${te}.`;
      if (i.tip !== 'text') return `În ${a} Excel a făcut din „${ts}” ${i.tip === 'data' ? 'o dată' : 'un număr'}: ${af}. Ca să rămână text, scrie un apostrof înainte: '${te}.`;
      return `În ${a} trebuie să se vadă „${te}”.`;
    }
    return '';
  }

  /* ---------- verificarea ---------- */
  const CHEI = ['unde', 'fila', 'foaie', 'pe', 'zoom', 'valori', 'formule', 'gol', 'sel', 'activa', 'zona', 'neatinsa', 'doarTaste', 'mesajActiva', 'fara', 'tip'];
  function probleme(ctx, V, s) {
    const out = [];
    if (!V) return out;
    if (!s) return ['Excel încă se încarcă. Așteaptă un moment și apasă din nou.'];
    const strain = Object.keys(V).filter(k => k !== 'ce' && CHEI.indexOf(k) < 0);
    if (strain.length) { W.console.warn('excel-excelx-adapter: verificare necunoscută', strain, V); out.push(`Foaia de aici nu știe încă să verifice: ${strain.map(esc).join(', ')}. Spune-i profesorului.`); }
    const multe = (s.foi || []).length > 1;
    if (V.unde && !potriveste(ctx.loc, V.unde)) out.push(ctx.loc ? `Ai atins ${descrie(ctx.loc)}. Caută ${descrie(primul(V.unde))}.` : `Nu ai atins încă nimic din fereastră. Fă clic (sau atinge) pe ${descrie(primul(V.unde))}, apoi apasă Verifică.`);
    if (V.foaie && !egalNume(s.foaie_activa, V.foaie)) out.push(`Acum ești pe foaia ${esc(s.foaie_activa)}. Treci pe foaia ${esc(V.foaie)}: clic pe fila ei, jos, sub celule.`);
    if (V.fila && filaDeschisa(s) !== V.fila) out.push(`Acum e deschisă fila ${FILE[filaDeschisa(s)] || esc(s.fila_panglica) || '—'}. Deschide fila ${FILE[V.fila] || V.fila}: clic pe numele ei, sus.`);
    const fv = numeFoaie(s, V.pe), R = celulePe(s, fv), pe = multe && V.pe ? ` pe foaia ${esc(fv)}` : '';
    if (V.zoom != null) {
      const z = zoomPe(s, fv);
      if (z !== V.zoom) {
        const alta = (s.foi || []).find(n => n !== fv && zoomPe(s, n) === V.zoom);
        out.push(`Zoom-ul${pe} e acum ${z} %. Trebuie ${V.zoom} %: fiecare clic pe + urcă 10 %, fiecare clic pe − coboară 10 %.` + (pe && alta ? ` Ai schimbat zoom-ul foii ${esc(alta)}: fiecare foaie își ține zoom-ul ei.` : ''));
      }
    }
    for (const [a, v] of Object.entries(V.valori || {})) {
      if (!eqVal(brut(R[a]), v)) {
        const aici = fv !== s.foaie_activa && eqVal(brut(celulePe(s, s.foaie_activa)[a]), v) ? ` Ai scris pe foaia ${esc(s.foaie_activa)}; trece pe foaia ${esc(fv)} și scrie acolo.` : '';
        out.push(`${pe ? pe[1].toUpperCase() + pe.slice(2) + ', în' : 'În'} ${a} trebuie scris „${esc(numarRo(v))}”${afisat(R[a]) ? `, iar acum e „${esc(afisat(R[a]))}”` : ''}.${aici}`);
        break;
      }
    }
    for (const [a, f] of Object.entries(V.formule || {})) {
      const x = R[a], are = x && typeof x === 'object' ? x.formula : null;
      if (formulaNorm(are) !== formulaNorm(f)) { out.push(`În ${a} trebuie formula ${esc(f)}${are ? `, iar acum e ${esc(are)}` : afisat(x) ? `, iar acum e „${esc(afisat(x))}”, fără formulă` : ''}.`); break; }
    }
    Object.entries(V.tip || {}).forEach(([a, e]) => { const p = problemaTip(ctx, s, R, a, e); if (p) out.push(p); });
    (V.gol || []).forEach(a => { if (afisat(R[a]) !== '') out.push(`${a} nu e goală încă. Alege-o și apasă Delete.`); });
    (V.fara || []).forEach(x => { if (Object.values(R).some(c => egalNume(String(afisat(c)).trim(), String(x).trim()))) out.push(`În foaie mai e „${esc(x)}”.`); });
    if (V.neatinsa) {
      const k = numeFoaie(s, V.neatinsa), R0 = pornireFoaie(ctx.Q, k), R1 = celulePe(s, k);
      const dif = [...new Set([...Object.keys(R0), ...Object.keys(R1)])].filter(a => !eqVal(brut(R1[a]), R0[a] === undefined ? '' : R0[a]));
      if (dif.length) out.push(`Pe foaia ${esc(k)} s-a schimbat ${dif.slice(0, 3).join(', ')}: acolo nu trebuia scris nimic. Anulează cu butonul ↶ de sus, din stânga (ca în Word), până revine cum era, apoi scrie pe foaia cerută.`);
    }
    if (V.sel) { const a = activaPe(s, s.foaie_activa); if (a !== V.sel) out.push(`Celula aleasă acum e ${a || '—'}. Caută celula ${V.sel}: coloana ${V.sel.replace(/\d+/, '')}, rândul ${V.sel.replace(/\D+/, '')}.`); }
    if (V.zona) { const z = zonaPe(s, s.foaie_activa); if (z !== V.zona) out.push(`Zona selectată e ${z || '—'}, nu ${V.zona}. Apasă pe primul colț și trage până la celălalt.`); }
    if (V.activa) { const a = activaPe(s, fv); if (a !== V.activa) out.push(V.mesajActiva ? V.mesajActiva.replace('{a}', a || '—') : `Celula activă${pe} e acum ${a || '—'}. Trebuie să fie ${V.activa}.`); }
    if (V.doarTaste && ctx.clicInFoaie) out.push('De data asta, fără clic în foaie: te miști doar cu tastele (pe telefon, cu butoanele de sub foaie). Apasă „Arată-mi” sau reia exercițiul.');
    return out;
  }
  function solutie(ctx, V) {
    if (!V) return '';
    const s = [], multe = !!(ctx.Q.foi && ctx.Q.foi.length > 1);
    if (V.unde) s.push(`atingi ${descrie(primul(V.unde))}`);
    if (V.fila) s.push(`deschizi fila ${FILE[V.fila] || V.fila}`);
    if (V.foaie) s.push(`treci pe foaia ${esc(V.foaie)} (clic pe fila ei, jos)`);
    if (V.sel) s.push(`alegi celula <b>${esc(V.sel)}</b>`);
    if (V.zona) s.push(`selectezi zona <b>${esc(V.zona)}</b>`);
    const vs = Object.entries(V.valori || {});
    if (vs.length) s.push(`scrii ${vs.map(([a, v]) => `${esc(numarRo(v))} în ${a}`).join(', ')}`);
    Object.entries(V.formule || {}).forEach(([a, f]) => s.push(`în ${a} scrii <code>${esc(f)}</code>`));
    (V.gol || []).forEach(a => s.push(`alegi ${a} și apeși Delete`));
    if (V.activa) s.push(`la final celula activă e ${V.activa}`);
    if (V.zoom != null) s.push(`duci zoom-ul${V.pe && multe ? ' foii ' + esc(V.pe) : ''} la ${V.zoom} % cu + și −`);
    const tp = Object.entries(V.tip || {}).map(([a, e]) => `în ${a} scrii <code>${esc('numar' in e ? numarRo(e.numar) : 'data' in e ? e.data : (cuApostrof(e.text) ? "'" : '') + e.text)}</code>`);
    if (tp.length) s.push(tp.join(', '));
    return s.length ? s.join('; ') + '.' + (tp.length ? ' Dacă o celulă a rămas cu forma de dată (scrii un număr și apare o dată), o selectezi și alegi, pe fila Pornire (Home), butonul cu radieră Golire (Clear), al treilea din grupul Editare (Editing), apoi Golire totală (Clear All); apoi scrii din nou.' : '') : '';
  }

  /* ---------- „mâinile”: aceleași gesturi ca elevul, trimise elementelor bibliotecii (ca bara de taste a bibliotecii) ---------- */
  function apasa(ctx, el, o) {
    if (!el || !el.isConnected) return false;
    try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* */ }
    const b = el.getBoundingClientRect();
    let x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    /* două apăsări la rând în același punct ar fi citite de bibliotecă drept dublu clic: a doua se dă 7 px mai la dreapta */
    if (ctx.ux != null && Math.hypot(x - ctx.ux, y - ctx.uy) < 6) x += 7;
    ctx.ux = x; ctx.uy = y;
    const init = { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, clientX: x, clientY: y, shiftKey: !!(o && o.shift) };
    el.dispatchEvent(new PointerEvent('pointerdown', Object.assign({ buttons: 1 }, init)));
    (el.isConnected ? el : W).dispatchEvent(new PointerEvent('pointerup', Object.assign({ buttons: 0 }, init)));
    return true;
  }
  const tinta = (ctx, t) => { try { return ctx.inst.element(t); } catch (e) { return null; } };
  const apasaTinta = (ctx, t, o) => apasa(ctx, tinta(ctx, t), o);
  function tasta(ctx, key, o) {
    try { ctx.inst.focus(); } catch (e) { /* */ }
    const ae = document.activeElement, el = ae && ctx.root.contains(ae) ? ae : ctx.root;
    const init = Object.assign({ bubbles: true, cancelable: true, key }, o || {});
    el.dispatchEvent(new KeyboardEvent('keydown', init));
    el.dispatchEvent(new KeyboardEvent('keyup', init));
  }
  const tasteaza = (ctx, text) => { [...String(text)].forEach(ch => tasta(ctx, ch)); };
  const pos = a => { const m = String(a || '').toUpperCase().match(/^([A-Z]{1,3})(\d+)$/); return m ? { c: m[1].split('').reduce((x, ch) => x * 26 + ch.charCodeAt(0) - 64, 0) - 1, r: Number(m[2]) - 1 } : null; };
  /* du celula activă la adresa a: clic pe celulă; dacă nu e pe ecran, prin caseta de nume (scrii adresa, Enter) */
  function laCelula(ctx, a) {
    if (apasaTinta(ctx, 'celula:' + a)) return true;
    const nb = tinta(ctx, 'camp:Name Box');
    if (!nb) return false;
    apasa(ctx, nb);
    try { nb.focus({ preventScroll: true }); nb.value = a; nb.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { /* */ }
    nb.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }));
    return true;
  }
  /* Golire totală pe celula a, din panglică: Pornire (Home) › Golire (Clear) ▾ › Golire totală (Clear All) */
  function golireTotala(ctx, a) {
    laCelula(ctx, a);
    apasaTinta(ctx, 'fila:Home');
    if (!apasaTinta(ctx, 'meniu_derulant:Home/Editing/Clear')) apasaTinta(ctx, 'panglica:Home/Editing/Clear');
    apasaTinta(ctx, 'meniu:Clear All');
  }
  /* tipurile cerute (lecția 5): numărul pe o celulă rămasă cu forma de dată se scrie după Golire totală; textul de cifre, cu apostrof */
  function scrieTipuri(ctx, V) {
    const s = stare(ctx), F0 = (s && s.format_celule) || {};
    Object.entries(V.tip).forEach(([a, e]) => { if ('numar' in e && F0[a] && F0[a].format_numar) golireTotala(ctx, a); });
    scrieCelule(ctx, Object.entries(V.tip).map(([a, e]) => [a, 'numar' in e ? numarRo(e.numar) : 'data' in e ? String(e.data) : (cuApostrof(e.text) ? "'" : '') + e.text]));
  }
  function laFoaie(ctx, nume) { const s = stare(ctx); if (s && nume != null && !egalNume(s.foaie_activa, nume)) apasaTinta(ctx, 'fila_foii:' + numeFoaie(s, nume)); }
  /* scrie valorile rând cu rând, ca în lecție: Tab între coloanele vecine, Enter la capătul rândului */
  function scrieCelule(ctx, perechi) {
    const L2 = perechi.map(([a, t]) => ({ a, t, p: pos(a) })).filter(x => x.p).sort((x, y) => x.p.r - y.p.r || x.p.c - y.p.c);
    for (let i = 0; i < L2.length; i++) {
      const x = L2[i], inainte = L2[i - 1], dupa = L2[i + 1];
      if (!(inainte && inainte.p.r === x.p.r && inainte.p.c === x.p.c - 1)) laCelula(ctx, x.a);
      tasteaza(ctx, x.t);
      tasta(ctx, dupa && dupa.p.r === x.p.r && dupa.p.c === x.p.c + 1 ? 'Tab' : 'Enter');
    }
  }
  function laZoom(ctx, vrut) {
    for (let i = 0; i < 45; i++) {
      const s = stare(ctx);
      if (!s || s.zoom === vrut) return;
      if (!apasaTinta(ctx, s.zoom < vrut ? 'zoom:Zoom In' : 'zoom:Zoom Out')) return;
    }
  }
  function elementLoc(ctx, loc) {
    const i = loc.indexOf(':'), k = i < 0 ? loc : loc.slice(0, i), v = i < 0 ? '' : loc.slice(i + 1);
    const T = { caseta: 'camp:Name Box', bara: 'bara_formule', fx: 'bara_formule:Insert Function', fila: 'fila:' + (FILA_EN[v] || v), foaie: 'fila_foii:' + v, coloana: 'antet_coloana:' + v, rand: 'antet_rand:' + v, celula: 'celula:' + v, colt: 'selecteaza_tot' }[k];
    if (T) return { el: tinta(ctx, T), tinta: T };
    if (k === 'grup') { const g = [...ctx.root.querySelectorAll('[data-lh-tip="Group"]')].find(x => x.getAttribute('data-lh-eticheta') === v && x.querySelector(':scope > .lh-ap-legenda')); return { el: g ? g.querySelector(':scope > .lh-ap-legenda') : null, tinta: null }; }
    return { el: null, tinta: null };
  }
  /* rezolvarea, executată în Excelul din bibliotecă */
  function executa(ctx) {
    const V = (ctx.Q.verifica || {});
    if (!ctx.inst || !ctx.root || !ctx.root.isConnected) return;
    ctx.robot = true;
    try {
      try { L.ascunde(); } catch (e) { /* */ }
      tasta(ctx, 'Escape');   // renunță la ce era început (o scriere, un meniu deschis)
      let s = stare(ctx);
      if (V.neatinsa) {
        const k = numeFoaie(s, V.neatinsa), R0 = pornireFoaie(ctx.Q, k), R1 = celulePe(s, k);
        const dif = [...new Set([...Object.keys(R0), ...Object.keys(R1)])].filter(a => !eqVal(brut(R1[a]), R0[a] === undefined ? '' : R0[a]));
        if (dif.length) {
          laFoaie(ctx, k);
          dif.forEach(a => { laCelula(ctx, a); if (R0[a] === undefined || R0[a] === '') tasta(ctx, 'Delete'); else { tasteaza(ctx, numarRo(R0[a])); tasta(ctx, 'Enter'); } });
        }
      }
      if (V.fila) apasaTinta(ctx, 'fila:' + (FILA_EN[V.fila] || V.fila));
      const lucru = V.pe != null ? V.pe : V.foaie;
      if (lucru != null) laFoaie(ctx, lucru);
      (V.gol || []).forEach(a => { laCelula(ctx, a); tasta(ctx, 'Delete'); });
      const deScris = Object.entries(V.valori || {}).map(([a, v]) => [a, numarRo(v)]).concat(Object.entries(V.formule || {}).map(([a, f]) => [a, String(f)]));
      if (deScris.length) scrieCelule(ctx, deScris);
      if (V.tip) scrieTipuri(ctx, V);
      if (V.zoom != null) laZoom(ctx, V.zoom);
      const cel = V.activa || V.sel;
      s = stare(ctx);
      if (cel && s && activaPe(s, s.foaie_activa) !== cel) {
        const a = pos(activaPe(s, s.foaie_activa)), b = pos(cel);
        if (V.doarTaste && a && b) {   // doar cu săgețile, ca în cerință
          for (let i = 0; i < Math.abs(b.c - a.c); i++) tasta(ctx, b.c > a.c ? 'ArrowRight' : 'ArrowLeft');
          for (let i = 0; i < Math.abs(b.r - a.r); i++) tasta(ctx, b.r > a.r ? 'ArrowDown' : 'ArrowUp');
        } else laCelula(ctx, cel);
      }
      if (V.zona) { const [a, b] = String(V.zona).split(':'); laCelula(ctx, a); if (b && b !== a) apasaTinta(ctx, 'celula:' + b, { shift: true }); }
      if (V.foaie != null && lucru !== V.foaie) laFoaie(ctx, V.foaie);
      if (V.unde) {
        const loc = primul(V.unde), x = elementLoc(ctx, loc);
        if (x.el) { apasa(ctx, x.el); if (x.tinta) { try { L.evidentiaza(x.tinta, { aplicatie: 'excel' }); } catch (e) { /* */ } } }
        ctx.loc = [].concat(V.unde)[0].replace(/:\*$/, ':x');
      }
    } finally { ctx.robot = false; ctx.clicInFoaie = false; }
  }
  /* o greșeală tipică (pentru poarta de test): alt loc, altă filă, altă foaie, „x” în celule, altă celulă, alt zoom */
  function greseste(ctx) {
    const V = (ctx.Q.verifica || {}), s = stare(ctx);
    if (!s) return;
    ctx.robot = true;
    try {
      if (V.fila) apasaTinta(ctx, 'fila:' + (V.fila === 'home' ? 'Insert' : 'Home'));
      if (V.foaie && egalNume(s.foaie_activa, V.foaie)) { const alta = (s.foi || []).find(n => !egalNume(n, V.foaie)); if (alta) laFoaie(ctx, alta); }
      const chei = Object.keys(V.valori || {}).concat(Object.keys(V.formule || {}), V.gol || []);
      if (chei.length) scrieCelule(ctx, chei.map(a => [a, 'x']));
      /* tipul greșit, ca pe simulatorul vechi: 7.5 cu punct (o dată) / 150 cu apostrof (text); data cu virgule (text); 007 fără
         apostrof (numărul 7), alt text cu „?”; gresitLipit = numărul scris PESTE o dată (forma rămâne: 07.ian) */
      if (V.tip) {
        const lipit = ctx.Q.gresitLipit || [], simple = [];
        Object.entries(V.tip).forEach(([a, e]) => {
          if ('numar' in e && lipit.indexOf(a) >= 0) {
            laCelula(ctx, a); tasteaza(ctx, String(e.numar).indexOf('.') >= 0 ? String(e.numar) : '1.1'); tasta(ctx, 'Enter');
            laCelula(ctx, a); tasteaza(ctx, numarRo(e.numar)); tasta(ctx, 'Enter');
          } else simple.push([a, 'numar' in e ? (Number.isInteger(e.numar) ? "'" + e.numar : String(e.numar)) : 'data' in e ? String(e.data).replace(/\./g, ',') : cuApostrof(e.text) ? String(e.text) : e.text + '?']);
        });
        if (simple.length) scrieCelule(ctx, simple);
      }
      if (V.zoom != null) laZoom(ctx, V.zoom === 100 ? 90 : 100);
      const cel = V.activa || V.sel || (V.zona ? String(V.zona).split(':')[0] : null);
      if (cel) laCelula(ctx, cel === 'A1' ? 'B2' : 'A1');
      if (V.unde) { apasaTinta(ctx, potriveste('celula:A1', V.unde) ? 'camp:Name Box' : 'celula:A1'); }
    } finally { ctx.robot = false; }
  }

  /* ---------- conținutul de pornire, în forma bibliotecii ---------- */
  function continutDe(Q) {
    const c = {};
    if (Q.foi && Q.foi.length) {
      const k0 = Math.min(Q.foaie || 0, Q.foi.length - 1);
      c.foi = Q.foi.map((f, i) => ({ nume: f.nume, celule: f.cells || {}, latimi: f.latimi, zoom: i === k0 ? Q.zoom : undefined }));
      c.fi = k0;
    } else {
      c.celule = Q.cells || {};
      if (Q.numeFoaie) c.foi = [{ nume: Q.numeFoaie, celule: c.celule, latimi: Q.latimi, zoom: Q.zoom }];
      if (Q.zoom) c.zoom = Q.zoom;
      if (Q.latimi && typeof Q.latimi === 'object' && !Array.isArray(Q.latimi)) c.latimi = Q.latimi;
    }
    if (Q.start) c.selectie = String(Q.start);
    /* registrul lecției nu e „modificat” la pornire: Ctrl+W / închiderea nu întreabă de salvare pentru datele puse de lecție */
    c.modificat = false;
    return c;
  }

  /* ---------- „Exersează pe variante” (Q.variante): aceeași sarcină pe un tabel mutat, cu alte nume și numere ----------
     Regulile variantei și cheia în care se ține seria sunt cele ale simulatorului vechi (jocuri/_motor/tip-excel.js, 25-27.09.2026),
     aduse aici întocmai, ca elevul să-și păstreze seria: tabelul se mută cu 1-2 rânduri / o coloană, numele se schimbă doar în
     tabelele cu elevi (același gen), numerele se schimbă dacă verificarea nu le așteaptă ca atare; textul sarcinii și ce se
     așteaptă se schimbă împreună. Foaia variantei e tot Excelul din bibliotecă (altă instanță, sub sarcină). */
  const COL = i => { let t = ''; for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) t = String.fromCharCode(65 + (n - 1) % 26) + t; return t; };
  const NUME = ['Andrei', 'Bianca', 'Cristi', 'Diana', 'Eric', 'Flavia', 'George', 'Ioana', 'Luca', 'Maria', 'Nicu', 'Oana', 'Radu', 'Sara', 'Tudor', 'Vlad'];
  const MASC = new Set(['Andrei', 'Cristi', 'Eric', 'George', 'Luca', 'Nicu', 'Radu', 'Tudor', 'Vlad', 'Dan', 'Bogdan', 'Mihai', 'Matei', 'Ion']);
  const rnd = n => Math.floor(Math.random() * n);
  const esteFem = n => !MASC.has(n) && /(a|Carmen)$/.test(n);
  const genitivFem = n => /ca$/.test(n) ? n.slice(0, -1) + 'ăi' : /a$/.test(n) ? n.slice(0, -1) + 'ei' : n + 'ei';
  const CAP_ELEVI = /^(Elev|Elevul|Elevi|Nume|Numele)$/;
  const DEPL = [[0, 1], [1, 0], [1, 1], [2, 0], [2, 1]];
  const colIdx = c => c.split('').reduce((x, ch) => x * 26 + ch.charCodeAt(0) - 64, 0) - 1;
  const mutaAdr = (a, dr, dc) => String(a).replace(/(\$?)([A-Z]{1,2})(\$?)(\d+)/g, (m, d1, c, d2, r) => d1 + COL(colIdx(c) + dc) + d2 + (Number(r) + dr));
  function mutaFormula(f, dr, dc) {
    let out = '', q = false, buf = '';
    const flush = () => { out += buf.replace(/(^|[^A-Za-z])(\$?[A-Z]{1,2}\$?\d+)(?![A-Za-z(])/g, (m, pre, ref) => pre + mutaAdr(ref, dr, dc)); buf = ''; };
    for (const ch of f) { if (ch === '"') { if (!q) flush(); else { out += buf; buf = ''; } q = !q; out += ch; continue; } buf += ch; }
    if (q) out += buf; else flush();
    return out;
  }
  /* adresele din textul sarcinii: „B6”, „coloana B”, „rândul 6”; nu în etichete și nici între <kbd> și </kbd> (o tastă, ex. F4) */
  function rescrieText(t, mA, mC, mR, nume) {
    let kbd = false;
    return String(t || '').split(/(<[^>]*>)/).map(b => {
      if (b.startsWith('<')) { if (/^<kbd/i.test(b)) kbd = true; else if (/^<\/kbd/i.test(b)) kbd = false; return b; }
      if (kbd) return b;
      return b.replace(/\$?\b[A-Z]{1,2}\$?\d{1,2}\b/g, r => mA(r))
        .replace(/\b(coloan(?:a|ei|ele))(\s+)([A-Z]{1,2})\b/g, (m, w, sp, c) => w + sp + mC(c))
        .replace(/(rând(?:ul|ului))(\s+)(\d+)\b/g, (m, w, sp, n) => w + sp + mR(Number(n)))
        .replace(/[A-ZĂÂÎȘȚ][a-zăâîșț]+/g, w => (nume && nume[w]) || w);
    }).join('');
  }
  const areCheie = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  function varianta(Q) {
    const [dr, dc] = DEPL[rnd(DEPL.length)], V = JSON.parse(JSON.stringify(Q.verifica || {}));
    const cells = {}, folosite = new Set(), nume = {};
    const ramanNr = new Set(Object.values((Q.verifica || {}).valori || {}).filter(v => typeof v === 'number'));
    const capElevi = Object.entries(Q.cells || {}).filter(([a, v]) => /^A\d+$/.test(a) && typeof v === 'string' && CAP_ELEVI.test(v.trim())).map(([a]) => Number(a.slice(1))).sort((x, y) => x - y)[0];
    Object.entries(Q.cells || {}).forEach(([a, v]) => {
      let x = v; const p = a.match(/^([A-Z]+)(\d+)$/);
      if (typeof v === 'number') { if (ramanNr.has(v)) x = v; else if (Number.isInteger(v) && v >= 1 && v <= 10) x = 1 + rnd(10); else if (Number.isInteger(v)) x = Math.max(1, Math.round(v * (0.5 + Math.random()))); else { const d = (String(v).split('.')[1] || '').length; x = Number((v * (0.6 + Math.random() * 0.8)).toFixed(d)); } }
      else if (typeof v === 'string' && capElevi && p[1] === 'A' && Number(p[2]) > capElevi && /^[A-ZĂÂÎȘȚ][a-zăâîșț]+$/.test(v) && !/^(Suma|Media|Maxim|Minim|Total|Luni|Marți|Miercuri|Joi|Vineri|Sâmbătă|Duminică)$/.test(v)) {
        if (!nume[v]) {
          const fem = esteFem(v), pool = NUME.filter(n => esteFem(n) === fem && !folosite.has(n)), din = pool.length ? pool : NUME.filter(n => !folosite.has(n));
          const n = din[rnd(din.length)]; folosite.add(n); nume[v] = n;
          if (fem && esteFem(n)) nume[genitivFem(v)] = genitivFem(n);
        }
        x = nume[v];
      } else if (typeof v === 'string' && v.startsWith('=')) x = mutaFormula(v, dr, dc);
      cells[mutaAdr(a, dr, dc)] = x;
    });
    const mA = a => mutaAdr(a, dr, dc), mZ = z => String(z).split(':').map(mA).join(':');
    const mO = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [mZ(k), typeof v === 'string' && v.startsWith('=') ? mutaFormula(v, dr, dc) : v]));
    if (V.sel) V.sel = mA(V.sel);
    if (V.zona) V.zona = mZ(V.zona);
    if (V.activa) V.activa = mA(V.activa);
    ['valori', 'formule', 'format', 'tip'].forEach(k => { if (V[k]) V[k] = mO(V[k]); });
    if (Object.keys(nume).length) {
      const nn = t => typeof t === 'string' && areCheie(nume, t) ? nume[t] : t;
      const nf = t => typeof t === 'string' && t.startsWith('=') ? t.replace(/"([^"]*)"/g, (m, x) => '"' + x.replace(/[A-ZĂÂÎȘȚ][a-zăâîșț]+/g, w => areCheie(nume, w) ? nume[w] : w) + '"') : t;
      if (V.valori) V.valori = Object.fromEntries(Object.entries(V.valori).map(([k, v]) => [k, nn(v)]));
      if (V.formule) V.formule = Object.fromEntries(Object.entries(V.formule).map(([k, v]) => [k, nf(v)]));
      Object.keys(cells).forEach(a => { cells[a] = nf(cells[a]); });
    }
    if (V.umplut) V.umplut = Object.fromEntries(Object.entries(V.umplut).map(([k, d]) => [mA(k), d.map(mA)]));
    if (V.gol) V.gol = V.gol.map(mA);
    if (V.imbinat) V.imbinat = mZ(V.imbinat);
    if (V.sortat) V.sortat = Object.assign({}, V.sortat, { zona: mZ(V.sortat.zona), dupa: V.sortat.dupa.map(k => Object.assign({}, k, { col: mA(k.col + '1').replace(/\d+$/, '') })) });
    if (V.grafic) V.grafic = Object.assign({}, V.grafic, { zona: mZ(V.grafic.zona) });
    let q = rescrieText(Q.q, r => mutaAdr(r, dr, dc), c => COL(colIdx(c) + dc), n => n + dr, nume);
    /* „Alege celula …”: tabelul mutat ar cere aceeași celulă față de tabel; varianta cere ALTĂ celulă din tabel */
    if (Object.keys(V).length === 1 && V.sel) {
      const p = V.sel.match(/^([A-Z]+)(\d+)$/), poz = Object.keys(cells).map(a => a.match(/^([A-Z]+)(\d+)$/)).filter(Boolean);
      if (p && poz.length > 1) {
        const cs = poz.map(m => colIdx(m[1])), rs = poz.map(m => Number(m[2]));
        const c1 = Math.min(...cs), c2 = Math.max(...cs), r1 = Math.min(...rs), r2 = Math.max(...rs);
        const orig = String((Q.verifica || {}).sel || ''); let nc, nr, g = 0;
        do { nc = c1 + rnd(c2 - c1 + 1); nr = r1 + rnd(r2 - r1 + 1); g++; }
        while (g < 200 && (COL(nc) + nr === V.sel || COL(nc) + nr === orig || (COL(nc) === p[1] || nr === Number(p[2])) && rnd(3)));
        const nou = COL(nc) + nr, vc = p[1], vr = Number(p[2]);
        q = rescrieText(q, r => r.replace(/\$/g, '') === V.sel ? nou : r, c => c === vc ? COL(nc) : c, n => n === vr ? nr : n, null);
        V.sel = nou;
      }
    }
    return Object.assign({}, Q, { cells, verifica: V, q, _practica: true });
  }
  const doarRecitire = () => { try { return !!(W.JocMotor && W.JocMotor.recitire && W.JocMotor.recitire()); } catch (e) { return false; } };
  function cheiePractica(Q) {
    let h = 0; const t = (Q.q || '') + JSON.stringify(Q.verifica || {});
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
    let p = ''; try { p = localStorage.getItem('learninghub_active_profile') || ''; } catch (e) { /* */ }
    return 'lh_excel_exersat' + (p && p !== '_guest' ? '@' + p : '') + '|' + h.toString(36);
  }
  const inchideFoaia = el => { const c = el && CTX.get(el); if (c && c.inst) { try { c.inst.inchide(); } catch (e) { /* */ } c.inst = null; } };
  /* butonul de sub sarcina rezolvată */
  function ofera(Q, body, api) {
    if (!Q.variante || Q._practica || body.querySelector('.xl-exloc')) return;
    const loc = document.createElement('div'); loc.className = 'xl-exloc'; body.appendChild(loc);
    const k = cheiePractica(Q);
    loc._ofera = () => {
      let st = {}; try { st = JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { /* */ }
      loc.innerHTML = `<button class="btn ghost" type="button" data-exs="1" style="margin-top:10px">🔁 Exersează pe variante${st.stapanit ? ' (✓ stăpânit)' : ' (3 la rând = stăpânit)'}</button>`;
      loc.querySelector('[data-exs]').onclick = () => exerseaza(Q, loc, api);
    };
    loc._ofera();
  }
  function exerseaza(Q, loc, api) {
    const k = cheiePractica(Q); let st = { serie: 0, stapanit: false };
    try { st = JSON.parse(localStorage.getItem(k)) || st; } catch (e) { /* */ }
    const Qv = varianta(Q);
    inchideFoaia(loc.querySelector('#xexb'));
    /* o singură foaie pe ecran: cât exersează, sarcina de bază, mesajul ei și „Mai departe” stau ascunse */
    if (!loc._ascunse) {
      const corp = loc.parentElement, stiva = corp && corp.closest('.stack');
      const frati = stiva ? [...stiva.children].filter(x => x !== corp && !x.contains(loc)) : [];
      loc._ascunse = [...(corp ? corp.children : [])].filter(x => x !== loc).concat(frati).filter(x => x.style.display !== 'none');
      loc._ascunse.forEach(x => { x.style.display = 'none'; });
    }
    loc.innerHTML = `<div class="xl-ex" style="margin-top:4px">
    <div class="row" style="justify-content:space-between;align-items:center"><div class="eyebrow">Exersează pe o variantă · serie: ${st.serie}/3 corecte la rând${st.stapanit ? ' · ✓ stăpânit' : ''}</div>
    <button class="btn ghost sm" type="button" data-exg="1">✕ Gata cu exersarea</button></div>
    <div class="q" style="margin:6px 0">${Qv.q}</div><div id="xexb"></div><div id="xexf" aria-live="polite"></div><div class="row" id="xexn"></div></div>`;
    const foaie = loc.querySelector('#xexb'), fb = loc.querySelector('#xexf'), nav = loc.querySelector('#xexn');
    loc.querySelector('[data-exg]').onclick = () => {
      inchideFoaia(foaie); (loc._ascunse || []).forEach(x => { x.style.display = ''; }); loc._ascunse = null; loc._ofera();
      /* foaia sarcinii de bază revine cum a rămas: rezolvată (biblioteca a închis-o când s-a deschis foaia variantei) */
      const baza = CTX.get(loc.parentElement);
      if (baza && !(baza.root && baza.root.isConnected)) { baza.inst = null; baza.root = null; baza.deschide().then(() => { if (baza.inst) executa(baza); }); }
    };
    try { loc.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { /* */ }
    let gata = false;
    const salveaza = () => { try { if (!doarRecitire()) localStorage.setItem(k, JSON.stringify(st)); } catch (e) { /* */ } };
    const alta = () => { nav.innerHTML = '<button class="btn" type="button" data-exa="1">🔁 Altă variantă</button>'; nav.querySelector('[data-exa]').onclick = () => exerseaza(Q, loc, api); };
    const apiP = {
      esc: api.esc, shuffle: api.shuffle, done: () => gata, attempts: () => 0,
      checkButton: fn => { nav.innerHTML = '<button class="btn primary" type="button" data-exv="1">Verifică varianta</button>'; nav.querySelector('[data-exv]').onclick = () => { if (!gata) fn(); }; return nav; },
      resolve: (ok, msg) => {
        if (ok) { gata = true; st.serie++; if (st.serie >= 3) st.stapanit = true; fb.innerHTML = `<div class="fb ok"><strong>Corect!</strong> Serie: ${st.serie}/3${st.serie >= 3 ? ' — <b>stăpânit ✓</b>. Poți merge mai departe sau mai exersa.' : ''}</div>`; }
        else { st.serie = 0; fb.innerHTML = `<div class="fb bad"><strong>Nu încă.</strong> ${msg || ''} Seria o iei de la capăt.</div>`; }
        salveaza();
        if (ok) alta();
      },
      revealButton: fn => { if (!nav.querySelector('[data-exr]')) { nav.insertAdjacentHTML('beforeend', '<button class="btn ghost" type="button" data-exr="1">Arată-mi</button>'); nav.querySelector('[data-exr]').onclick = fn; } },
      giveUp: html => { gata = true; st.serie = 0; salveaza(); fb.innerHTML = `<div class="fb bad"><strong>Așa se face:</strong> ${html}</div>`; alta(); },
      feedback: () => {}, nav: () => nav
    };
    render(Qv, foaie, apiP);
  }

  /* ---------- render / rezolva / gresit ---------- */
  function render(Q, body, api) {
    css();
    const V = Q.verifica || {};
    body.innerHTML = `${Q.teste ? '<div class="xa-teste" aria-live="polite"></div>' : ''}<div class="xa-host"></div><p class="xa-nota" role="status"></p>${Q.o ? '<div class="opts xa-opts" id="xopts"></div>' : ''}`;
    const host = body.querySelector('.xa-host'), cutie = body.querySelector('.xa-teste'), nota = body.querySelector('.xa-nota');
    const ctx = { Q, body, host, inst: null, root: null, loc: null, clicInFoaie: false, robot: false, ux: null, uy: null };
    CTX.set(body, ctx);

    /* locul atins și „fără clic în foaie”: la apăsare, înainte ca biblioteca să mute celula activă */
    host.addEventListener('pointerdown', ev => {
      if (!ctx.root) return;
      const l = locDin(ev.target, ctx.root);
      if (!l) return;
      ctx.loc = l;
      if (!ctx.robot && /^(celula:|rand:|coloana:|colt$)/.test(l)) { const s = stare(ctx); if (!s || l !== 'celula:' + activaPe(s, s.foaie_activa)) ctx.clicInFoaie = true; }
    }, true);

    /* doarMouse: de unde au venit Copierea și Lipirea (gestul din evenimentul bibliotecii: ctrl_c / ctrl_v / Enter = taste) */
    if (Q.doarMouse) {
      const asculta = ev => {
        if (!host.isConnected) { W.removeEventListener('lh-aplicatie', asculta); return; }
        const d = ev.detail || {};
        if (d.aplicatie !== 'excel' || ctx.robot || /^(ctrl_|tasta_)/.test(d.gest || '')) return;
        if (d.actiune === 'copiere') ctx.mc = true;
        if (d.actiune === 'lipire') ctx.mp = true;
      };
      W.addEventListener('lh-aplicatie', asculta);
    }

    /* tipul de date (lecția 5): ce a TASTAT elevul în fiecare celulă, pentru mesaje („În B2 ai scris „9.5”…”). Din evenimentele
       bibliotecii: celula în editare ÎNAINTE (textul tastat) și primită DUPĂ; ținut pe valoarea primită, ca după Anulare
       mesajul să vorbească tot de ce a scris elevul (ca simulatorul vechi: excelx.js › sync, IST) */
    if ((V && V.tip) || (Q.teste || []).some(T => T && T.tip)) {
      ctx.ist = {};
      const scris = ev => {
        if (!host.isConnected) { W.removeEventListener('lh-aplicatie', scris); return; }
        const d = ev.detail || {};
        if (d.aplicatie !== 'excel') return;
        const ci = (d.inainte && d.inainte.celule) || {}, cd = (d.dupa && d.dupa.celule) || {};
        Object.keys(ci).forEach(a => {
          const x = ci[a], y = cd[a];
          if (!x || !x.editare || (y && y.editare)) return;
          (ctx.ist[a] = ctx.ist[a] || {})[y ? JSON.stringify(y.valoare) : ''] = String(x.valoare);
        });
      };
      W.addEventListener('lh-aplicatie', scris);
    }

    /* testele numite, bifate pe loc */
    let semn = '';
    function bifeaza() {
      if (!cutie) return;
      const s = stare(ctx);
      if (!s) return;
      const rez = Q.teste.map(T => ({ ce: T.ce, ok: probleme(ctx, T, s).length === 0 }));
      const h = `<div class="lbl">Testele atelierului: ${rez.filter(x => x.ok).length} din ${rez.length} gata</div><ul>${rez.map(x => `<li class="${x.ok ? 'ok' : ''}"><span aria-hidden="true">${x.ok ? '✔' : '○'}</span><span>${x.ce}<span class="xa-sr">${x.ok ? ' (gata)' : ' (încă nu)'}</span></span></li>`).join('')}</ul>`;
      if (h !== semn) { semn = h; cutie.innerHTML = h; }
    }
    if (cutie) { const ceas = setInterval(() => { if (!host.isConnected) { clearInterval(ceas); return; } bifeaza(); }, 200); }

    /* variantele de răspuns (foaia e de încercat) */
    if (Q.o) {
      const ord = Q.amesteca === false ? Q.o.map((_, k) => k) : api.shuffle(Q.o.map((_, k) => k));
      const o = body.querySelector('#xopts');
      o.innerHTML = ord.map(k => `<button class="opt" type="button" data-k="${k}">${esc(Q.o[k])}</button>`).join('');
      o.querySelectorAll('.opt').forEach(b => { b.onclick = () => {
        if (api.done()) return;
        const k = Number(b.dataset.k);
        if (k === Q.ok) { b.classList.add('ok'); api.resolve(true); }
        else {
          b.classList.add('bad'); b.disabled = true;
          api.resolve(false, 'Încearcă în foaia de mai sus și uită-te ce se întâmplă.');
          api.revealButton(() => { const bun = o.querySelector(`.opt[data-k="${Q.ok}"]`); if (bun) bun.classList.add('ok'); api.giveUp(esc(Q.o[Q.ok])); });
        }
      }; });
    } else {
      api.checkButton(() => {
        const s = stare(ctx);
        if (!s) { api.resolve(false, 'Excel încă se încarcă. Așteaptă un moment și apasă din nou.'); return; }
        if (Q.doarMouse && !(ctx.mc && ctx.mp)) { api.resolve(false, 'De data asta dă comenzile cu mouse-ul: clic dreapta pe zonă › Copiere (Copy), apoi clic dreapta pe celula nouă › Lipire (Paste), sau butoanele din fila Pornire (Home).'); return; }
        const p = probleme(ctx, V, s);
        if (!p.length) { api.resolve(true); ofera(Q, body, api); return; }
        api.resolve(false, p.slice(0, 2).join(' '));
        api.revealButton(() => { executa(ctx); bifeaza(); api.giveUp(solutie(ctx, V)); });
        try { ctx.inst.focus(); } catch (e) { /* */ }   // după „Nu încă”, tastele (Ctrl+Z) ajung iar la foaie
      });
    }

    /* deschiderea foii; se cheamă din nou după „Exersează pe variante” (biblioteca ține un singur Excel deschis pe pagină:
       foaia variantei a luat locul foii sarcinii) */
    ctx.deschide = () => L.gata.then(() => L.deschide('excel', { loc: host, continut: continutDe(Q), focus: !!Q.start }))
      .then(inst => {
        if (!host.isConnected) { try { inst.inchide(); } catch (e) { /* */ } return; }
        ctx.inst = inst;
        ctx.root = inst.radacina || host.querySelector('[data-lh-aplicatie="excel"]');
        if (Array.isArray(Q.inainte) && Q.inainte.length) {
          ctx.robot = true;
          try { Q.inainte.forEach(([a, t]) => { laCelula(ctx, a); if (t === 'DEL') tasta(ctx, 'Delete'); else { tasteaza(ctx, t); tasta(ctx, 'Enter'); } }); } finally { ctx.robot = false; }
          ctx.loc = null;
        }
        if (Q.start) {
          /* foaia are tastatura de la început (elevul scrie fără clic); motorul mai mută focusul după ce așază exercițiul */
          const laStart = () => { const a = document.activeElement; if (!host.isConnected || (a && ctx.root.contains(a))) return; if (a && a.closest && a.closest('input,textarea,select')) return; try { inst.focus(); } catch (e) { /* */ } };
          laStart(); setTimeout(laStart, 0); setTimeout(laStart, 200);
        }
        bifeaza();
      })
      .catch(e => { nota.textContent = 'Excel nu s-a încărcat: ' + (e && e.message ? e.message : e) + '. Reîncarcă pagina.'; });
    ctx.deschide();
  }
  function rezolva(Q, body) {
    const ctx = CTX.get(body);
    if (!ctx) return;
    if (Q.o) { const b = body.querySelector(`.opt[data-k="${Q.ok}"]`); if (b) b.click(); return; }
    executa(ctx);
    if (Q.doarMouse) ctx.mc = ctx.mp = true;
  }
  function gresit(Q, body) {
    const ctx = CTX.get(body);
    if (!ctx) return;
    if (Q.o) { const b = body.querySelector(`.opt:not([data-k="${Q.ok}"])`); if (b) b.click(); return; }
    greseste(ctx);
  }

  const TipExcelX = { render, rezolva, gresit };
  W.TipExcelX = TipExcelX;
  /* numele pe care le dau lecțiile la tipuri:{excelx:…}: același tip, pe bibliotecă (simulatoarele vechi NU se mai încarcă în
     lecția care folosește adaptorul). ExcelI = lecția 2 (legată); celelalte sunt pregătite pentru lecțiile 4-11, care se leagă
     doar după ce cheile lor de verificare (vezi sus) sunt aduse aici și probate. */
  ['ExcelX', 'ExcelI', 'ExcelPlus', 'ExcelXF', 'ExcelF', 'ExcelFn', 'ExcelD', 'ExcelS', 'ExcelG'].forEach(n => { W[n] = TipExcelX; });
  /* Lecția 4 își definește ExcelPlus chiar în pagină (un înveliș peste JocExcel din tip-excel.js: meniul de clic dreapta,
     ștergerea de rânduri … desenate peste foaia veche). Cu biblioteca, învelișul acela nu mai are ce înveli: primește aici
     JocExcel = tipul de pe bibliotecă și îi dă exercițiul mai departe neschimbat (ascultătorii lui caută foaia veche, `.gw`,
     care nu mai există, deci nu fac nimic). Așa lecția se leagă doar din blocul de <script src>, fără să i se atingă pagina. */
  if (!W.JocExcel) W.JocExcel = TipExcelX;
  /* Lecția 5 își desenează mini-foile „Uite cum” din text cu window.ExcelTipuri.afisare(textTastat, forma) — parserul setărilor
     românești din simulatorul vechi (lectii/_sim/excelx.js). Numele vechi trimite aici la parserul bibliotecii (excel.js › tipuri),
     pe care lecția îl are încărcat cu <script src> înaintea textului ei; adaptorul doar leagă numele, nu citește nimic singur. */
  if (!W.ExcelTipuri) W.ExcelTipuri = { afisare: (text, forma) => tipuriBiblioteca().afisare(text, forma) };
})();
