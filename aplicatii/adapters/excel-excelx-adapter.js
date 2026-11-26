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
     zoom, latimi {A: 6}                  zoom-ul de pornire, lățimile coloanelor (în caractere Excel; vezi Pornirea foii, mai jos)
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
     forma {…}                            FORMATAREA (lecția 6; vechiul lectii/_sim/excelx-formatare.js › problemeForma, aceleași mesaje):
                                          faraDiez 'C2:C4' (fără ####), vizibil 'A2:A4' (textul nu e tăiat: stare().text_taiat),
                                          inaltime {'1':{min:25}} (puncte), al {'B2:B4':'center'}, va {'A1':'middle'}, wrap {'B2':true},
                                          imbinat 'A1:D1' (+ centrat), b / fill / color {'A1:C1':true}, fs, borduri {'A1:C4':'toate'|
                                          'exterior'|'exteriorGros'}, format {'B2:B4':{zecimale:2}|{procent:0}|{data:'lunga'|'scurta'}},
                                          stil {'A1':'Title'}, text, valori:true (valorile de la pornire n-au fost schimbate)
   Pornirea foii (lecția 6): latimi {C: 6} = lățimea în CARACTERE (ca fereastra Column Width), inaltimi {1: 40} în puncte,
     forme {'B2:B4': {nfx: '#.##0,00'}} (codul pe setări românești), imbinari ['A1:D1'] — le pune excel.js (conținutul de pornire).
     functie {B7: 'SUM'}                  (lecția 8) celula folosește funcția cerută; spus doar când restul e bun, ca pe vechi
                                          (lectii/_sim/excelx-functii.js › render): „În B7 rezultatul e bun, dar aici se cere funcția SUM…”
     umplut {E2: ['E3','E6']}             (lecția 8) celulele umplute din sursă: ținta = formula sursei mutată (judecată prin rezultat)
     gest ['autosum'|'umple'], umple true (lecția 8; umple = în teste) gestul cerut, citit din evenimentele bibliotecii: Σ / lista ▾ /
                                          Alt+= (suma_automata), mânerul de umplere tras (umplere_tragere); mesajele din tip-excel.js
     sortat {zona, dupa:[{col, ord}], antet} (lecția 10) rândurile zonei întregi (față de foaia de la deschidere) și în ordinea
                                          cerută; în teste: antet / intregi (bifate abia după o sortare) / ordonat [{col, ord}];
                                          mesajele din tip-excel.js și excelx-sortare.js › mesajSortare (desperecheat / titlul printre date)
   O cheie pe care adaptorul nu o știe NU trece (și se scrie în consolă): grafic, format.nume, latime, gesturile
   clic-adresa / f4 / zona-mouse / autocompletare / ctrl-d … — ale lecțiilor 9-11, de adus când se leagă acelea.
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
.xa-teste .xa-motiv{display:block;margin:3px 0 4px;padding:5px 9px;border-left:3px solid var(--accent,#107c41);border-radius:6px;background:var(--paper,#fff);color:var(--ink,#1d1d1b);font-weight:400;font-size:.92rem;line-height:1.4;overflow-wrap:anywhere}
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

  /* ---------- formatarea (Q.verifica.forma, lecția 6): mesajele simulatorului vechi (lectii/_sim/excelx-formatare.js › problemeForma) ----------
     Totul se citește din starea bibliotecii: format_celule (aliniere, aliniere_verticala, incadrare, imbinat, bold, umplere, borduri,
     format_numar, stil), celule (text = ce se vede în lățimea coloanei: „####”), text_taiat, inaltimi_randuri (px la 100 %). Textul
     întreg al unui număr într-un format și codurile listei Number Format le dă excel.js (tipuri.formatat, tipuri.formate). */
  const zonaDe = t => { const [x, y] = String(t).split(':'), p = pos(x), q = pos(y || x); return p && q ? { c1: Math.min(p.c, q.c), c2: Math.max(p.c, q.c), r1: Math.min(p.r, q.r), r2: Math.max(p.r, q.r) } : null; };
  const adrDe = (c, r) => COL(c) + (r + 1);
  const zonaText = z => adrDe(z.c1, z.r1) + (z.c1 === z.c2 && z.r1 === z.r2 ? '' : ':' + adrDe(z.c2, z.r2));
  const celuleZona = t => { const z = zonaDe(t), o = []; if (z) for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) o.push(adrDe(c, r)); return o; };
  const coloaneDin = d => [...new Set(d.map(a => a.replace(/\d+/, '')))];
  const imbinari = F0 => [...new Set(Object.values(F0 || {}).map(x => x.imbinat).filter(Boolean))].map(zonaDe).filter(Boolean);
  const peste = (m, z) => !(m.c2 < z.c1 || m.c1 > z.c2 || m.r2 < z.r1 || m.r1 > z.r2);
  const nrRo = x => String(Math.round(x * 100) / 100).replace('.', ',');
  const AL = { left: 'stanga', center: 'centru', right: 'dreapta' }, VA = { top: 'sus', middle: 'mijloc', bottom: null };
  const NA = { left: 'la stânga', center: 'la centru', right: 'la dreapta' }, NV = { top: 'sus', middle: 'la mijloc', bottom: 'jos' };
  const BUT_AL = { left: 'Align Left', center: 'Center', right: 'Align Right' }, BUT_VA = { top: 'Top Align', middle: 'Middle Align', bottom: 'Bottom Align' };
  const BORD = { toate: 'All Borders', exterior: 'Outside Borders', exteriorGros: 'Thick Outside Borders' };
  const CHEI_FORMA = ['vizibil', 'inaltime', 'al', 'va', 'wrap', 'imbinat', 'centrat', 'b', 'fill', 'color', 'fs', 'borduri', 'format', 'faraDiez', 'stil', 'text', 'valori'];
  const PX_RAND = 20;   // rândul standard: 15 puncte = 20 px (Calibri 11)
  function problemeForma(ctx, S, s) {
    const out = [], R = celulePe(s, s.foaie_activa), F0 = s.format_celule || {}, fmt = a => F0[a] || {}, T = tipuriBiblioteca();
    const strain = Object.keys(S).filter(k => CHEI_FORMA.indexOf(k) < 0);
    if (strain.length) { W.console.warn('excel-excelx-adapter: verificare de formă necunoscută', strain, S); out.push(`Foaia de aici nu știe încă să verifice: ${strain.join(', ')}. Spune-i profesorului.`); }
    if (S.vizibil) { const t = new Set(s.text_taiat || []), d = celuleZona(S.vizibil).filter(a => t.has(a)); if (d.length) out.push(`Textul din ${d.join(', ')} e tăiat de celula din dreapta. Lățește coloana ${coloaneDin(d).join(', ')} (tragi de linia din dreapta literei sau dublu-clic pe ea).`); }
    Object.entries(S.inaltime || {}).forEach(([r, x]) => { const h = ((s.inaltimi_randuri || {})[r] || (s.inaltimi_manuale || {})[r] || PX_RAND) * 3 / 4; if (x.min != null && h < x.min - 1e-9) out.push(`Rândul ${r} e încă prea scund (${nrRo(h)} puncte). Trage în jos de linia de sub numărul ${r}.`); });
    Object.entries(S.al || {}).forEach(([t, v]) => { const d = celuleZona(t).filter(a => (fmt(a).aliniere || '') !== AL[v]); if (d.length) out.push(`${d.slice(0, 4).join(', ')}${d.length > 4 ? '…' : ''}: conținutul nu e aliniat ${NA[v]}. Selectează ${t}, apoi butonul din grupul Aliniere (Alignment).`); });
    Object.entries(S.va || {}).forEach(([t, v]) => { const d = celuleZona(t).filter(a => (fmt(a).aliniere_verticala || null) !== VA[v]); if (d.length) out.push(`${d.join(', ')}: conținutul nu e aliniat ${NV[v]}.`); });
    Object.entries(S.wrap || {}).forEach(([t, v]) => { const d = celuleZona(t).filter(a => !!fmt(a).incadrare !== !!v); if (d.length) out.push(v ? `${d.join(', ')} nu are Încadrare text (Wrap Text): textul stă tot pe un rând.` : `${d.join(', ')} are încă Încadrare text (Wrap Text).`); });
    if (S.imbinat) {
      const ms = imbinari(F0);
      [].concat(S.imbinat).forEach(t => {
        const z = zonaDe(t), m = ms.find(x => zonaText(x) === zonaText(z));
        if (!m) { const alt = ms.find(x => peste(x, z)); out.push(alt ? `Ai îmbinat ${zonaText(alt)}, dar trebuie exact ${t}. Apasă din nou pe ea și Merge & Center (o desface), apoi selectează ${t} și Merge & Center.` : `Celulele ${t} nu sunt îmbinate. Selectează ${t}, apoi Pornire (Home) › Merge & Center (Îmbinare și centrare).`); }
        else if (S.centrat && fmt(adrDe(z.c1, z.r1)).aliniere !== 'centru') out.push(`${t} e îmbinată, dar titlul nu e centrat. Folosește Merge & Center, nu Merge Cells.`);
      });
    }
    const cul = x => String(x || '').replace('#', '').toUpperCase();
    const prop = (k, cheie, nume) => Object.entries(S[k] || {}).forEach(([t, v]) => { const d = celuleZona(t).filter(a => { const x = fmt(a)[cheie]; return v === true ? !x : (typeof v === 'object' ? false : cul(x) !== cul(v)); }); if (d.length) out.push(`${nume} lipsește în ${d.slice(0, 4).join(', ')}${d.length > 4 ? '…' : ''}. Selectează ${t}, apoi apasă butonul.`); });
    prop('b', 'bold', 'Aldinul (Bold)'); prop('fill', 'umplere', 'Culoarea de umplere (Fill Color)'); prop('color', 'culoare_font', 'Culoarea fontului (Font Color)');
    Object.entries(S.fs || {}).forEach(([t, x]) => { const d = celuleZona(t).filter(a => (fmt(a).marime_font || 11) < (x.min || 0)); if (d.length) out.push(`Textul din ${d.join(', ')} e încă mic (${fmt(d[0]).marime_font || 11}). Mărește-l din Font Size.`); });
    Object.entries(S.borduri || {}).forEach(([t, tip]) => {
      const z = zonaDe(t), lipsa = [], gros = [];
      for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) {
        const a = adrDe(c, r), m = fmt(a).borduri || {};
        const cer = tip === 'toate' ? ['sus', 'jos', 'stanga', 'dreapta'] : [r === z.r1 ? 'sus' : '', r === z.r2 ? 'jos' : '', c === z.c1 ? 'stanga' : '', c === z.c2 ? 'dreapta' : ''].filter(Boolean);
        cer.forEach(l => { if (!m[l]) lipsa.push(a); else if (tip === 'exteriorGros' && !/groas/.test(m[l])) gros.push(a); });
      }
      if (lipsa.length) out.push(tip === 'toate' ? `Nu toate celulele din ${t} au linii pe toate laturile (de exemplu ${[...new Set(lipsa)].slice(0, 3).join(', ')}). Selectează ${t}, apoi Borders ▾ › All Borders (Toate bordurile).` : `Conturul zonei ${t} nu e complet (${[...new Set(lipsa)].slice(0, 3).join(', ')}). Selectează ${t}, apoi Borders ▾ › ${BORD[tip]}.`);
      else if (gros.length) out.push(`Conturul lui ${t} e subțire; se cere unul gros: Borders ▾ › Thick Outside Borders.`);
    });
    Object.entries(S.format || {}).forEach(([t, x]) => celuleZona(t).forEach(a => {
      const c = R[a], v = c ? c.valoare : null;
      if (typeof v !== 'number') { out.push(`${a} nu conține un număr.`); return; }
      const cod = fmt(a).format_numar || 'General', vazut = String(c.text != null ? c.text : ''), diez = /^#+$/.test(vazut);
      const txt = String(T.formatat(v, cod)).replace(/[  ]/g, '').trim();   // ce ar arăta celula dacă ar încăpea (ca vechiul o.plin)
      if (x.zecimale != null) {
        const k = ((txt.match(/,(\d+)/) || ['', ''])[1]).length, zc = n => n === 0 ? 'fără zecimale' : n === 1 ? 'cu o zecimală' : `cu ${n} zecimale`;
        if (/lei|%/.test(txt)) out.push(`${a} arată „${txt}”: ai pus un format cu ${/%/.test(txt) ? 'procent' : 'lei'}. Se cere doar numărul cu ${x.zecimale} zecimale (Number sau Increase Decimal).`);
        else if (k !== x.zecimale || (cod === 'General' && x.zecimale > 0)) {
          const are = diez ? `are forma ${zc(k)} („${txt}”) și nu încape (se vede ####)` : `arată „${vazut}”, ${zc(k)}`;
          out.push(`${a} ${are}; se cer ${x.zecimale} zecimale.` + (k < x.zecimale && cod !== 'General' ? ` Ai scos zecimale: apasă Ctrl+Z (↶) de atâtea ori câte zecimale ai scos (aici de ${x.zecimale - k === 1 ? 'o dată' : (x.zecimale - k) + ' ori'}), sau Increase Decimal, până revin cele ${x.zecimale}. Dacă apoi apare ####, lățește coloana.` : ''));
        }
      }
      if (x.procent != null) { const k = ((txt.match(/,(\d+)%/) || ['', ''])[1]).length; if (!/%$/.test(txt)) out.push(`${a} arată „${vazut}”, nu un procent. Apasă butonul % (Percent Style).`); else if (k !== x.procent) out.push(`${a} arată „${vazut}”; se cere procentul cu ${x.procent} zecimale.`); }
      if (x.data) { const ti = (s.tip_celule || {})[a], lunga = cod === T.formate['Long Date']; if (!ti || ti.tip !== 'data') out.push(`${a} nu arată o dată.`); else if ((x.data === 'lunga') !== lunga) out.push(`${a} arată data ${x.data === 'lunga' ? 'scurt' : 'lung'}; alege ${x.data === 'lunga' ? 'Long Date' : 'Short Date'} din lista Number Format.`); }
      if (x.nume) out.push(`Foaia de aici nu știe încă să verifice: format.nume. Spune-i profesorului.`);
    }));
    if (S.faraDiez) { const d = celuleZona(S.faraDiez).filter(a => R[a] && /^#+$/.test(String(R[a].text || ''))); if (d.length) out.push(`${d.join(', ')} arată încă ####: coloana ${coloaneDin(d).join(', ')} e prea îngustă. Lățește-o: trage de linia din dreapta literei ei sau dă dublu-clic pe linie.`); }
    Object.entries(S.stil || {}).forEach(([t, n]) => { const d = celuleZona(t).filter(a => fmt(a).stil !== n); if (d.length) out.push(`${d.join(', ')} nu are stilul „${n}”. Selectează ${t}, apoi Cell Styles › ${n}.`); });
    Object.entries(S.text || {}).forEach(([a, t]) => { const x = String(afisat(R[a])).trim(); if (x !== t) out.push(`În ${a} trebuie să se vadă „${t}” (acum: „${x}”).`); });
    if (S.valori) {
      const ms = imbinari(F0);
      Object.entries(ctx.Q.cells || {}).forEach(([a, v]) => {
        const nv = R[a] ? R[a].valoare : '', p = pos(a);
        const k = typeof v === 'number' ? { tip: 'numar', v } : T.afisare(String(v)), ini = typeof k.v === 'number' ? { tip: 'num', v: k.v } : { tip: 'text', v: String(k.v != null ? k.v : v) };
        const inMerge = ms.some(m => p && p.c >= m.c1 && p.c <= m.c2 && p.r >= m.r1 && p.r <= m.r2 && !(p.c === m.c1 && p.r === m.r1));
        if (ini.tip === 'num' && (typeof nv !== 'number' || Math.abs(nv - ini.v) > 1e-9)) out.push(`Valoarea din ${a} s-a schimbat (era ${String(ini.v).replace('.', ',')}). Formatarea nu schimbă valorile: apasă Ctrl+Z (↶) până revine.`);
        else if (ini.tip === 'text' && !inMerge && (typeof nv !== 'string' || nv !== ini.v)) out.push(`Conținutul din ${a} s-a schimbat (era „${ini.v}”). Apasă Ctrl+Z (↶) până revine.`);
      });
    }
    return out;
  }
  /* „Arată-mi răspunsul”, în cuvinte (vechiul solutieForma, în aceeași ordine) */
  function solutieForma(S) {
    const s = [], cols = t => coloaneDin(celuleZona(t)).join(', ');
    if (S.imbinat) [].concat(S.imbinat).forEach(t => s.push(`selectezi ${t} și apeși Merge &amp; Center (Îmbinare și centrare)`));
    if (S.faraDiez) s.push(`dai dublu-clic pe linia din dreapta literei coloanei ${cols(S.faraDiez)} (sus, între litere)`);
    if (S.vizibil) s.push(`dai dublu-clic pe linia din dreapta literei ${cols(S.vizibil)}`);
    Object.keys(S.inaltime || {}).forEach(r => s.push(`tragi în jos de linia de sub numărul ${r}`));
    Object.entries(S.al || {}).forEach(([t, v]) => s.push(`selectezi ${t} și apeși ${BUT_AL[v]}`));
    Object.entries(S.va || {}).forEach(([t, v]) => s.push(`selectezi ${t} și apeși ${BUT_VA[v]}`));
    Object.keys(S.wrap || {}).forEach(t => s.push(`selectezi ${t} și apeși Wrap Text (Încadrare text)`));
    Object.keys(S.b || {}).forEach(t => s.push(`selectezi ${t} și apeși B (Bold)`));
    Object.keys(S.fill || {}).forEach(t => s.push(`pe ${t} pui o culoare de umplere (găleata, Fill Color)`));
    Object.entries(S.borduri || {}).forEach(([t, v]) => s.push(`selectezi ${t}, apoi Borders ▾ › ${BORD[v]}`));
    Object.entries(S.format || {}).forEach(([t, x]) => s.push(`selectezi ${t}, apoi ${x.zecimale != null ? `lista Number Format › Number (sau Increase Decimal până apar ${x.zecimale} zecimale)` : x.procent != null ? 'butonul % (Percent Style)' + (x.procent ? ` și Increase Decimal de ${x.procent} ori` : '') : x.data ? `lista Number Format › ${x.data === 'lunga' ? 'Long Date' : 'Short Date'}` : `lista Number Format › ${x.nume}`}`));
    Object.entries(S.stil || {}).forEach(([t, n]) => s.push(`selectezi ${t}, apoi Cell Styles › ${n}`));
    return s.join('; ');
  }

  /* ---------- formulele (lecția 7): judecate prin REZULTAT, ca simulatorul vechi ----------
     jocuri/_motor/tip-excel.js › probleme: formula elevului față de cea cerută, pe datele de acum și pe date schimbate (numerele
     din `cells` + 3 / + 6 / + 9, după poziție; plus Q.variants), deci o formulă echivalentă scrisă altfel (=B2*A2, =a2*b2,
     =A2/2+B2/2) e primită, iar un rezultat tastat de mână sau numere în loc de adrese nu. Mesajele sunt cele vechi; codurile de
     eroare, cu explicația din tip-foaie.js / lectii/_sim/excelx-formule.js. Calculul îl face biblioteca (excel.js › valoareCu,
     pe o copie a foii); adaptorul doar compară (R6). */
  const calc = (ctx, a, sch) => {
    const m = L._module && L._module.excel;
    if (!m || !m.valoareCu) throw new Error('excel-excelx-adapter: aplicatii/excel.js (valoareCu) nu e încărcat');
    return ctx.root ? m.valoareCu(ctx.root, a, sch || {}) : undefined;
  };
  const eEroare = v => !!(v && typeof v === 'object' && 'eroare' in v);
  /* textul rezultat se compară fără diacritice și fără diferență de litere (lecția 9; lectii/_sim/excelx-decizie.js › la: tastatura
     din laborator poate fi fără diacritice, iar Excel afișează ce a scris elevul — aici e NOTAREA, nu foaia) */
  const faraDiac = s => String(s == null ? '' : s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[şș]/g, 's').replace(/[ţț]/g, 't').replace(/\s+/g, ' ');
  const laFel = (x, y) => typeof x === 'number' && typeof y === 'number' ? Math.abs(x - y) < 1e-6 : faraDiac(x) === faraDiac(y);
  const aproape = (x, y) => typeof x === 'number' && typeof y === 'number' && Math.abs(x - y) < 1e-6;
  const afisVal = v => typeof v === 'number' ? numarRo(Math.round(v * 1e6) / 1e6) : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : (v === '' || v == null ? 'nimic' : '„' + v + '”');
  const fmtNr = v => typeof v !== 'number' ? String(v) : numarRo(Number.isInteger(v) ? v : Math.round(v * 1e10) / 1e10);
  /* ce a scris elevul în celulă: formula (cum o arată bara de formule) sau textul tastat */
  const scrisIn = x => !x ? '' : x.formula != null ? String(x.formula) : afisat(x);
  /* datele schimbate ale simulatorului vechi: fiecare număr din `cells`, + 3, + 6 sau + 9 după locul lui în listă */
  const dateSchimbate = Q => { const o = {}; Object.entries(Q.cells || {}).forEach(([k, v], i) => { if (typeof v === 'number') o[k] = v + (i % 3 + 1) * 3; }); return o; };
  /* cuvintele din formulă (fără textele dintre ghilimele) care nu sunt adrese și nici funcții (pentru #NAME?) */
  const faraText = f => String(f).replace(/"[^"]*"?/g, '""');
  const eAdresa = t => { const m = String(t).replace(/\$/g, '').match(/^([A-Za-z]{1,3})(\d{1,7})$/); return !!m && colIdx(m[1].toUpperCase()) < 16384 && +m[2] >= 1 && +m[2] <= 1048576; };
  const GHILIMEA_DREAPTA = 'Ghilimeaua dreaptă ": pe tastatura englezească, Shift + tasta din stânga lui Enter; pe cea românească (tasta aceea scrie ț), Shift + AltGr + aceeași tastă sau, pe unele calculatoare, Shift + 2.';
  /* explicația codului de eroare din formula f (mesajele vechi: tip-foaie.js › evaluate, excelx-formule.js, excelx-decizie.js) */
  function deCeEroare(cod, f) {
    const s = faraText(String(f || '').replace(/^=/, '')).replace(/\$/g, '');
    if (cod === '#VALUE!') return 'Formula calculează cu un text ca și cum ar fi număr.';
    if (cod === '#DIV/0!') return 'Împărțire la zero.';
    if (cod === '#NAME?') {
      /* lecția 9 (lectii/_sim/excelx-decizie.js › evaluate, pașii 3, 2, 8): semnele de la matematică, ghilimelele întoarse, textul
         fără ghilimele într-un IF — aceleași mesaje */
      const mat = s.match(/[≥≤≠]/);
      if (mat) return `Excel nu cunoaște semnul ${mat[0]} de la matematică, deci arată #NAME?. În Excel îl scrii din două semne: ${{ '≥': '>=', '≤': '<=', '≠': '<>' }[mat[0]]}.`;
      if (/[“”]/.test(s)) return 'Ghilimelele întoarse “ ” nu sunt ghilimele de formulă, deci Excel arată #NAME?. Textul se scrie între ghilimele drepte: "promovat". ' + GHILIMEA_DREAPTA + ' Pe telefon, caută ghilimeaua dreaptă " printre simboluri.';
      if (/(^|[^A-Za-z0-9_.])IF\s*\(/i.test(s)) {
        let t = null;
        s.replace(/[A-Za-zĂÂÎȘȚăâîșțŞŢşţ_\\][A-Za-z0-9_.ĂÂÎȘȚăâîșțŞŢşţ]*/g, (x, off) => { if (t) return x; const dupa = s.slice(off + x.length).trimStart(); if (/[0-9]/.test(s[off - 1] || '') || /^(TRUE|FALSE)$/i.test(x) || dupa[0] === '(' || eAdresa(x)) return x; t = x; return x; });
        if (t) return `Excel nu cunoaște cuvântul „${t}”, deci arată #NAME?. Un text din formulă se scrie între ghilimele drepte: "${t}". ` + GHILIMEA_DREAPTA;
      }
      const w = (s.match(/[A-Za-zĂÂÎȘȚăâîșțŞŢşţ_\\][A-Za-z0-9_.ĂÂÎȘȚăâîșțŞŢşţ]*/g) || []).find(x => !eAdresa(x) && !/^(TRUE|FALSE)$/i.test(x) && !new RegExp(x.replace(/[.\\]/g, '\\$&') + '\\s*\\(').test(s));
      const cuX = '=' + s.replace(/([A-Za-z]{1,3}\d+)\s*[xX]\s*(?=[A-Za-z]{1,3}\d+)/g, '$1*').toUpperCase();
      if (w && cuX !== '=' + s.toUpperCase()) return `Excel nu cunoaște cuvântul „${/^[xX]$/.test(w) ? 'x' : w}”: litera x nu înmulțește. Înmulțirea se scrie cu *: ${cuX}.`;
      return `Excel nu cunoaște cuvântul „${w || '?'}” din formulă. O adresă se scrie cu litera coloanei și numărul rândului (A2), iar semnele de calcul sunt + - * /.`;
    }
    if (cod === '#NULL!') { const m = s.match(/([A-Za-z]{1,3}\d+)\s+([A-Za-z]{1,3}\d+)/); if (m) return `Ai uitat semnul dintre ${m[1].toUpperCase()} și ${m[2].toUpperCase()}: între ele trebuie un semn de calcul (+ - * /). Excel arată aici #NULL!.`; }
    return '';
  }
  /* lecția 8: #NAME? dintr-un nume de FUNCȚIE necunoscut (=SUMA(B2:B6)): mesajul vechi din tip-foaie.js › call („Excel nu cunoaște
     funcția SUMA. Numele funcțiilor sunt în engleză: SUM.”), cu numele românești ale vechiului RO_NAMES. Dacă Excel cunoaște sau nu
     un nume o spune biblioteca (valoarea lui =NUME(1) pe copia foii), nu o listă din adaptor (R6) */
  const NUME_RO = { SUMA: 'SUM', MEDIE: 'AVERAGE', MEDIA: 'AVERAGE', DACA: 'IF', 'DACĂ': 'IF', MAXIM: 'MAX', MINIM: 'MIN', ROTUNJIRE: 'ROUND', NUMARA: 'COUNT', 'NUMĂRĂ': 'COUNT' };
  function functieNecunoscuta(ctx, a, raw) {
    const re = /([A-Za-zĂÂÎȘȚăâîșțŞŢşţ_][A-Za-z0-9_.ĂÂÎȘȚăâîșțŞŢşţ]*)\s*\(/g, s = faraText(String(raw).replace(/^=/, '')); let m;
    while ((m = re.exec(s))) {
      if (/[A-Za-z0-9_.]/.test(s[m.index - 1] || '')) continue;
      const n = m[1].toUpperCase(), ro = NUME_RO[n];
      if (ro) return `Excel nu cunoaște funcția ${n}. Numele funcțiilor sunt în engleză: ${ro}.`;
      const v = calc(ctx, a, { [a]: '=' + n + '(1)' });
      if (eEroare(v) && v.eroare === '#NAME?') return `Excel nu cunoaște funcția ${n}.`;
    }
    return '';
  }
  /* lecția 8: funcția cerută (verifica.functie {B7:'SUM'}; excelx-functii.js › areFunctia), gesturile cerute (verifica.gest) */
  const areFunctia = (raw, fn) => typeof raw === 'string' && raw.charAt(0) === '=' && new RegExp('(^|[^A-Z0-9_.])' + fn + '\\s*\\(', 'i').test(faraText(raw));
  const MESAJ_GEST = {
    autosum: 'Folosește butonul Σ, Însumare automată (AutoSum): fila Formule (Formulas), la început, sau fila Pornire (Home), în dreapta.',
    umple: 'Copiază formula TRĂGÂND de pătrățelul verde din colțul celulei (fill handle), ca în Excel, nu scriind-o din nou.'
  };
  /* Σ: rândurile listei ▾ (ținta meniu:<rând> a bibliotecii) și numele lor în textul răspunsului */
  const LISTA_SIGMA = { SUM: 'Sum', AVERAGE: 'Average', COUNT: 'Count Numbers', MAX: 'Max', MIN: 'Min' };
  const LISTA_SIGMA_RO = { AVERAGE: 'Medie (Average)', COUNT: 'Contorizare numere (Count Numbers)', MAX: 'Max', MIN: 'Min' };
  /* celula a se face cu Σ (gest autosum și funcția cerută a celulei e în lista lui Σ) → numele funcției, altfel '' */
  const cuSigma = (V, a) => { const fn = (V.gest || []).indexOf('autosum') >= 0 && V.functie && V.functie[a] ? String(V.functie[a]).toUpperCase() : ''; return LISTA_SIGMA[fn] ? fn : ''; };
  /* ce stă între parantezele funcției (=SUM(B2:B6) → B2:B6) */
  const argFunctie = f => { const m = String(f).match(/^=\s*[A-Za-z]+\s*\((.*)\)\s*$/); return m ? m[1] : ''; };
  /* umplut {E2: ['E3','E4']}: ce trebuie să ajungă în celulele umplute = formula sursei mutată cu rândul / coloana (JocFoaie.shift) */
  function tinteUmplut(V) {
    const t = {};
    Object.entries(V.umplut || {}).forEach(([s, dest]) => { const a = pos(s); [].concat(dest).forEach(d => { const b = pos(d); if (a && b && V.formule && V.formule[s]) t[d] = mutaFormula(String(V.formule[s]), b.r - a.r, b.c - a.c); }); });
    return t;
  }
  /* formula f a celulei a dă același rezultat ca ținta, acum și pe fiecare set de date schimbate (sch = celulele celelalte, peste foaie) */
  function treceToate(ctx, a, f, tinte, variante) {
    const una = v => { let g = calc(ctx, a, Object.assign({}, v, { [a]: f })), x = calc(ctx, a, Object.assign({}, tinte, v)); if (eEroare(g)) g = '#'; if (eEroare(x)) x = '?'; return laFel(g, x); };
    return una({}) && variante.every(una);
  }
  /* lecția 9 (lectii/_sim/excelx-decizie.js › semnLaLimita, M3 al judecătorului): formula greșește DOAR la limită dacă, schimbând un
     singur semn de comparare (< ↔ <=, > ↔ >=, în afara ghilimelelor), trece toate verificările → mesajul duce la semn, fără să-l spună */
  function semnLaLimita(ctx, a, raw0, tinte, variante) {
    /* formula din stare e în forma din COM (, și .); valoareCu primește forma tastată pe setări românești (; și ,) */
    const m = L._module && L._module.excel, raw = m && m.formulaRo ? m.formulaRo(raw0) : null;
    if (!raw) return false;
    let q = false;
    for (let k = 1; k < raw.length; k++) {
      const ch = raw[k];
      if (ch === '"') { q = !q; continue; }
      if (q || (ch !== '<' && ch !== '>')) continue;
      if (ch === '<' && raw[k + 1] === '>') { k++; continue; }
      const cuEgal = raw[k + 1] === '=', nou = cuEgal ? raw.slice(0, k + 1) + raw.slice(k + 2) : raw.slice(0, k + 1) + '=' + raw.slice(k + 1);
      if (treceToate(ctx, a, nou, tinte, variante)) return true;
      if (cuEgal) k++;
    }
    return false;
  }
  function mesajLimita(ctx, a, tinte) {
    let acum = false; try { const g = calc(ctx, a, {}), x = calc(ctx, a, tinte); acum = !eEroare(g) && !eEroare(x) && laFel(g, x); } catch (e) { /* */ }
    return (acum ? `${a} dă rezultatul bun acum, dar greșește la limită, când valoarea e exact numărul din regulă. Scrie în foaie chiar numărul din regulă și uită-te ce arată ${a}.`
      : `${a} greșește la limită: acum valoarea e exact numărul din regulă, iar ${a} arată ce nu trebuie.`) + ' Apoi uită-te la semnul de comparare: la limită, regula trebuie să ia și valoarea egală sau nu?';
  }
  function problemeFormule(ctx, tinte, R, cuUmplut, varianteProprii) {
    const out = [], Q = ctx.Q, variante = (varianteProprii || Q.variants || []).slice().concat([dateSchimbate(Q)]);
    for (const [a, tf] of Object.entries(tinte)) {
      const raw = scrisIn(R[a]);
      if (raw === '') { out.push(`${a} e goală.`); continue; }
      if (raw.charAt(0) !== '=') { out.push(`În ${a} ai scris ${esc(raw)}, nu o formulă: formula începe cu =.`); continue; }
      if (!/\$?[A-Za-z]{1,2}\$?\d+/.test(raw)) { out.push(`${a} are doar numere scrise de mână. Folosește adresele celulelor, ca rezultatul să se recalculeze.`); continue; }
      const g = calc(ctx, a, {});
      if (eEroare(g)) { const d = (g.eroare === '#NAME?' && functieNecunoscuta(ctx, a, raw)) || deCeEroare(g.eroare, raw); out.push(`${a} arată ${g.eroare || 'o eroare'}${d ? ': ' + d : '.'}`); continue; }
      let x = calc(ctx, a, tinte);
      if (eEroare(x)) x = null;
      const bunAcum = laFel(g, x);
      let bunPeDate = bunAcum, eroarePeDate = null;
      if (bunAcum) for (const v of variante) {
        let g2 = calc(ctx, a, v), x2 = calc(ctx, a, Object.assign({}, tinte, v));
        if (eEroare(g2)) { if (!eEroare(x2) && g2.eroare) eroarePeDate = g2.eroare; g2 = '#'; }
        if (eEroare(x2)) x2 = '?';
        if (!laFel(g2, x2)) { bunPeDate = false; break; }
        eroarePeDate = null;
      }
      if (bunPeDate) continue;
      /* lecția 9: IF calculează doar ramura aleasă (ca Excel), deci un text fără ghilimele în cealaltă ramură dă #NAME? abia pe datele
         schimbate (=IF(B2="da";"merge";nu merge) cu B2 = nu); pe vechi foaia arăta #NAME? de la început — aici se spune când apare */
      if (eroarePeDate) { const d = deCeEroare(eroarePeDate, raw); out.push(`${a} dă rezultatul bun acum, dar când se schimbă datele arată ${eroarePeDate}${d ? ': ' + d : '.'}`); continue; }
      if (/[<>]/.test(faraText(raw)) && semnLaLimita(ctx, a, raw, tinte, (varianteProprii || Q.variants || []).slice().concat([dateSchimbate(Q)]))) { out.push(mesajLimita(ctx, a, tinte)); continue; }
      out.push(bunAcum ? `${a} dă rezultatul bun acum, dar greșește când se schimbă datele. Verifică adresele${cuUmplut ? ' și semnul $' : ''}.` : `${a} dă ${afisVal(g)}, dar ar trebui să dea ${afisVal(x)}.`);
    }
    return out;
  }
  /* un test numit al atelierului e bifat de formula din celula a (excelx-formule.js › eFormulaBuna) */
  function formulaBuna(ctx, R, a, f) {
    const raw = scrisIn(R[a]);
    if (raw.charAt(0) !== '=' || !/[A-Za-z]{1,3}\$?\d+/.test(raw)) return false;
    const v0 = calc(ctx, a, {}), v1 = calc(ctx, a, { [a]: f });
    if (!aproape(v0, v1)) return false;
    const V = dateSchimbate(ctx.Q);
    if (!Object.keys(V).length) return true;
    return aproape(calc(ctx, a, V), calc(ctx, a, Object.assign({}, V, { [a]: f })));
  }
  /* MOTIVUL de sub testul nebifat (Q.motive: true), mesajele vechi din lectii/_sim/excelx-formule.js › motiv, în aceeași ordine:
     apostroful; fără =; două semne =; capcanele testului; o celulă de pe lanțul formulei bune încă negata; rezultat bun acum, dar
     cu numere de mână; rezultat greșit. Codurile de eroare: nimic (le explică Verifică) */
  function adreseDin(f) {
    const s = faraText(String(f)).replace(/\$/g, ''), r = [], re = /([A-Za-z]{1,3})(\d+)/g; let m;
    while ((m = re.exec(s))) { const p = s[m.index - 1] || '', d = s.slice(re.lastIndex); if (/[A-Za-z0-9_.]/.test(p) || /^[A-Za-z0-9_]/.test(d) || d.trimStart()[0] === '(') continue; if (eAdresa(m[0])) r.push(m[0].toUpperCase()); }
    return r;
  }
  function numereDin(f) { const s = faraText(String(f)).replace(/\$/g, ''), r = [], re = /\d+(?:[.,]\d+)?/g; let m; while ((m = re.exec(s))) if (!/[A-Za-z0-9_.,]/.test(s[m.index - 1] || '')) r.push(m[0].replace('.', ',')); return r; }
  const lista = x => x.length < 2 ? (x[0] || '') : x.slice(0, -1).join(', ') + ' și ' + x[x.length - 1];
  function motivTest(ctx, s, T) {
    const Q = ctx.Q, R = celulePe(s, s.foaie_activa), tactil = (() => { try { return matchMedia('(pointer:coarse)').matches; } catch (e) { return false; } })();
    const asteptat = Object.assign({}, (Q.verifica && Q.verifica.formule) || {}); (Q.teste || []).forEach(t => Object.assign(asteptat, t.formule || {}));
    const val = (a, sch) => { const v = calc(ctx, a, sch); return eEroare(v) ? undefined : v; };
    for (const [a, fx] of Object.entries(T.formule || {})) {
      if (formulaBuna(ctx, R, a, fx)) continue;
      const tc = (s.tip_celule || {})[a], ap = !!(tc && typeof tc === 'object' && tc.apostrof);
      let raw = scrisIn(R[a]); if (raw.trim() === '') continue;
      if (ap) raw = "'" + raw;
      const t = raw.trim(), v = val(a, {}), bun = val(a, { [a]: fx }), ale = adreseDin(t), nr = numereDin(t), cod = `<code>${esc(t)}</code>`;
      const sfat = ce => tactil ? `Atinge ${a}, apoi bara de formule, șterge tot textul de acolo, până la ultimul semn, și scrie ${ce}.` : `Dă un singur clic pe ${a} și scrie ${ce}: ce scrii așa înlocuiește tot ce era în celulă.`;
      if (t[0] === "'") return `În ${a} ai scris un apostrof (') la început, așa că Excel ia ce urmează drept text. ${sfat('formula din nou, fără apostrof, începând cu =')}`;
      if (t[0] !== '=') return ale.length ? `În ${a} lipsește semnul = de la început, așa că Excel ia ${cod} drept text. ${sfat('formula din nou, începând cu =')}`
        : `În ${a} ai scris ${cod} de mână, nu o formulă. Formula începe cu = și folosește adresele celulelor, ca rezultatul să se refacă singur.`;
      const corp = faraText(t.slice(1)), eg = [...corp.matchAll(/[^<>=]=\s*[-A-Za-z0-9(]/g)];
      if (eg.length) {
        const coada = corp.slice(eg[eg.length - 1].index + 2).trim();
        return /^-?\d+([.,]\d+)?$/.test(coada) ? `În ${a} ai scris la final și rezultatul (<code>=${esc(coada)}</code>). În Excel, formula are un singur semn =, la început, iar rezultatul îl calculează Excel. ${sfat('doar formula')}`
          : `În ${a} sunt două formule legate prin =: ${cod}. O formulă are un singur semn =, la început. ${sfat('o singură formulă')}`;
      }
      for (const C of T.capcane || []) { const f = C.formule && C.formule[a]; if (f && adreseDin(f).every(r => ale.includes(r)) && aproape(v, val(a, { [a]: f })) && !aproape(v, bun)) return esc(C.spune); }
      const prin = {}, st = adreseDin(fx).filter(d => d !== a).map(d => [d, null]);
      while (st.length) { const [d, p] = st.shift(); if (d === a || d in prin || !(d in asteptat)) continue; prin[d] = p; adreseDin(asteptat[d]).forEach(x => st.push([x, p || d])); }
      const neGata = Object.keys(prin).filter(d => !formulaBuna(ctx, R, d, asteptat[d]));
      const sunt = x => x.length > 1 ? 'sunt gata' : 'e gata', directe = neGata.filter(d => prin[d] === null);
      if (directe.length) return `Pentru ${a}, tema folosește ${lista(directe)}, care încă nu ${sunt(directe)}. Fă întâi ${lista(directe)}, apoi uită-te din nou la ${a}.`;
      if (neGata.length) { const via = prin[neGata[0]], rad = neGata.filter(d => prin[d] === via); return `Pentru ${a}, tema folosește ${via}, care se calculează din ${lista(rad)}. ${lista(rad)} încă nu ${sunt(rad)}: fă întâi ${lista(rad)}, apoi uită-te din nou la ${a}.`; }
      if (aproape(v, bun)) {
        const lipsa = adreseDin(fx).filter(r => !ale.includes(r));
        for (const n of nr) { const x = Number(n.replace(',', '.')), r = lipsa.find(r => aproape(val(r, {}), x)); if (r) return `${a} arată bine acum (${fmtNr(v)}), dar în formulă ai scris ${n} de mână, în loc de ${r}. Pune adresa ${r}: când se schimbă numărul din ${r}, rezultatul se reface singur.`; }
        return nr.length ? `${a} arată bine acum (${fmtNr(v)}), dar formula are numere scrise de mână. Folosește adresele celulelor, ca rezultatul să se refacă singur când se schimbă tabelul.`
          : `${a} arată bine acum (${fmtNr(v)}), dar ia numerele din alte celule decât cere tema, așa că nu se mai potrivește când se schimbă tabelul. Citește din nou ce cere tema pentru ${a}.`;
      }
      if (typeof v !== 'number') continue;
      return ale.length ? `${a} arată ${fmtNr(v)}, dar nu e cât trebuie. Citește din nou ce cere tema pentru ${a}.`
        : `În ${a} ai scris doar numere, fără adrese de celule, iar ${fmtNr(v)} nu e cât trebuie. Folosește adresele celulelor, de exemplu ${lista(adreseDin(fx))}.`;
    }
    return '';
  }

  /* ---------- sortarea (lecția 10): verifica.sortat {zona, dupa:[{col, ord}], antet?} și testele {antet | intregi | ordonat} ----------
     Ca pe vechi (jocuri/_motor/tip-excel.js › probleme, „SORTAREA”; lectii/_sim/excelx-sortare.js › mesajSortare, testOk):
     rândurile zonei comparate cu cele de la DESCHIDEREA foii (ctx.start, citit din starea bibliotecii, cu valorile ei: datele
     calendaristice sunt numere), întâi ca mulțime de rânduri întregi, apoi în ordinea cerută. Ordinea textelor NU trece prin
     laFel (care ignoră diacriticele): localeCompare pe românește, fără diferență de litere mari, deci Ș vine după S. */
  const cmpSort = (x, y) => typeof x === 'number' && typeof y === 'number' ? x - y : String(x == null ? '' : x).localeCompare(String(y == null ? '' : y), 'ro', { sensitivity: 'base' });
  const cheieVal = v => v == null || v === '' ? '' : typeof v === 'number' ? v.toFixed(6) : String(v).toLowerCase();
  const randSort = (C, z, r) => { const o = []; for (let c = z.c1; c <= z.c2; c++) o.push(brut(C[adrDe(c, r)])); return o; };
  const cheieRand = (C, z, r) => randSort(C, z, r).map(cheieVal).join('|');
  /* rândurile r0..r2 ale zonei sunt aceleași cu cele de la început (în orice ordine) */
  function randuriIntregi(ctx, R, z, r0) {
    const a = [], b = [];
    for (let r = r0; r <= z.r2; r++) { a.push(cheieRand(R, z, r)); b.push(cheieRand(ctx.start, z, r)); }
    return a.sort().join('\n') === b.sort().join('\n');
  }
  /* rândurile r0..r2 sunt în ordinea cheilor [{col, ord}] (primul criteriu contează cel mai mult) */
  function inOrdine(R, z, r0, chei) {
    for (let r = r0 + 1; r <= z.r2; r++) {
      for (const k of chei) {
        const c = pos(k.col + '1').c;
        let d = cmpSort(brut(R[adrDe(c, r - 1)]), brut(R[adrDe(c, r)]));
        if (k.ord === 'desc') d = -d;
        if (d < 0) break;
        if (d > 0) return false;
      }
    }
    return true;
  }
  const textOrdine = dupa => dupa.map(x => 'coloana ' + x.col + ' ' + (x.ord === 'desc' ? 'descrescător' : 'crescător')).join(', apoi ');
  function problemaSortare(ctx, VS, R) {
    const z = zonaDe(VS.zona);
    if (!z || !ctx.start) return 'Excel încă se încarcă. Așteaptă un moment și apasă din nou.';
    const r0 = VS.antet === false ? z.r1 : z.r1 + 1;
    if (!randuriIntregi(ctx, R, z, r0)) {
      /* excelx-sortare.js › mesajSortare: toate rândurile zonei, cu titlul, sunt întregi, dar titlul nu mai e sus = antetul nerecunoscut */
      if (VS.antet !== false && randuriIntregi(ctx, R, z, z.r1) && cheieRand(R, z, z.r1) !== cheieRand(ctx.start, z, z.r1)) {
        const t = []; for (let c = z.c1; c <= z.c2; c++) { const x = afisat(ctx.start[adrDe(c, z.r1)]); if (x !== '') t.push(x); }
        return `Titlul de pe rândul ${z.r1 + 1} („${esc(t.join(', '))}”) a ajuns printre date: Excel nu l-a recunoscut ca rând de antet. Rândurile în sine sunt întregi. Apasă Ctrl+Z (pe telefon, ↶), apoi fila Date (Data) › butonul mare Sortare (Sort) și bifează My data has headers (Datele mele au anteturi).`;
      }
      return 'Rândurile s-au desperecheat: unele valori au ajuns pe rândul altuia. Apasă Ctrl+Z (pe telefon, ↶). Dacă ai ales Continue with the current selection, repetă sortarea din coloana selectată: când apare Sort Warning, alege Expand the selection. Altfel, fă clic pe o singură celulă din tabel și sortează din nou. Dacă selectezi doar unele coloane, Excel le mută numai pe ele.';
    }
    if (!inOrdine(R, z, r0, VS.dupa)) return `Tabelul nu e încă în ordinea cerută (${textOrdine(VS.dupa)}). Folosește Date (Data) → Sortare.`;
    return '';
  }
  /* testele numite ale atelierului (excelx-sortare.js › testOk): antet și intregi se bifează abia după o sortare (ctx.sortari, din
     evenimentele bibliotecii); ordonat = ordinea cerută și rândurile întregi */
  function problemaTestSortare(ctx, T, R) {
    const VS = (ctx.Q.verifica || {}).sortat || {}, z = zonaDe(T.zona || VS.zona);
    if (!z || !ctx.start) return 'nu';
    const r0 = VS.antet !== false ? z.r1 + 1 : z.r1;
    if (T.antet) return ctx.sortari && cheieRand(R, z, z.r1) === cheieRand(ctx.start, z, z.r1) ? '' : 'antet';
    if (T.intregi) return ctx.sortari && randuriIntregi(ctx, R, z, r0) ? '' : 'intregi';
    if (T.ordonat) return inOrdine(R, z, r0, T.ordonat) && randuriIntregi(ctx, R, z, r0) ? '' : 'ordonat';
    return '';
  }

  /* ---------- verificarea ---------- */
  const CHEI = ['unde', 'fila', 'foaie', 'pe', 'zoom', 'valori', 'formule', 'gol', 'sel', 'activa', 'zona', 'neatinsa', 'doarTaste', 'mesajActiva', 'fara', 'tip', 'forma', 'capcane', 'functie', 'gest', 'umplut', 'umple', 'functii', 'variante', 'sortat', 'antet', 'intregi', 'ordonat'];
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
    /* formulele, prin rezultat (lecția 7); ca pe vechi (excelx.js › render: tipul se judecă după foaie), tipul cerut se spune
       doar când formulele sunt bune: „C2 arată #VALUE!” înaintea lui „A2 a rămas text” */
    const tf = V.umplut ? Object.assign({}, V.formule || {}, tinteUmplut(V)) : V.formule;
    const pf = tf ? problemeFormule(ctx, tf, R, !!V.umplut, V.variante) : [];
    pf.forEach(x => out.push(x));
    if (!pf.length) Object.entries(V.tip || {}).forEach(([a, e]) => { const p = problemaTip(ctx, s, R, a, e); if (p) out.push(p); });
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
    if (V.forma) problemeForma(ctx, V.forma, s).forEach(x => out.push(esc(x)));
    /* sortarea (lecția 10): pe foaia activă, ca pe vechi (o singură foaie în lecție) */
    if (V.sortat) { const m = problemaSortare(ctx, V.sortat, R); if (m) out.push(m); }
    if (V.antet || V.intregi || V.ordonat) { const m = problemaTestSortare(ctx, V, R); if (m) out.push(m); }
    /* gesturile cerute (lecția 8; tip-excel.js › probleme, la sfârșit): Σ (autosum) și mânerul de umplere (umple; în teste umple:true).
       Le citește render din evenimentele bibliotecii (ctx.gest). Un gest pe care adaptorul nu-l știe citi NU trece. */
    const gesturi = [].concat(V.gest || [], V.umple ? ['umple'] : []);
    gesturi.forEach(x => {
      if (!MESAJ_GEST[x]) { W.console.warn('excel-excelx-adapter: gest necunoscut', x); out.push(`Foaia de aici nu știe încă să verifice gestul: ${esc(x)}. Spune-i profesorului.`); return; }
      if (!(ctx.gest && ctx.gest.has(x))) out.push(MESAJ_GEST[x]);
    });
    /* funcția cerută, doar când restul e bun (ca pe vechi: excelx-functii.js › render, la „Corect” al foii) */
    if (!out.length && V.functie) {
      for (const [a, fn] of Object.entries(V.functie)) {
        if (areFunctia(scrisIn(R[a]), fn)) continue;
        out.push(`În ${a} rezultatul e bun, dar aici se cere funcția ${fn}: scrie =${fn}(…) cu zona potrivită${(V.gest || []).indexOf('autosum') >= 0 ? ' (sau folosește butonul Σ)' : ''}.`);
        break;
      }
    }
    /* lecția 9: Q.functii / teste[].functii {D5:'SUM'} (lectii/_sim/excelx-decizie.js › resolve, cu mesajul lui), tot când restul e bun */
    if (!out.length && V.functii) {
      const lipsa = Object.entries(V.functii).find(([a, fn]) => !areFunctia(scrisIn(R[a]), fn));
      if (lipsa) out.push(`${lipsa[0]} dă rezultatul bun, dar aici se cere funcția ${lipsa[1]}: =${lipsa[1]}(…), cu zona între paranteze.`);
    }
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
    Object.entries(V.formule || {}).forEach(([a, f]) => {
      const fn = cuSigma(V, a);
      s.push(`în ${a} scrii <code>${esc(f)}</code>` + (fn ? ` cu butonul Σ: clic pe ${a}, apoi ${fn === 'SUM' ? 'pe Σ (Însumare automată / AutoSum)' : `pe săgeata ▾ de lângă Σ › ${LISTA_SIGMA_RO[fn]}`}; ${argFunctie(f) ? `scrii ${esc(argFunctie(f))} peste zona propusă și ` : ''}apeși Enter` : ''));
    });
    Object.entries(V.umplut || {}).forEach(([a, d]) => s.push(`tragi de colțul lui ${a} până la ${[].concat(d).slice(-1)[0]}`));
    (V.gol || []).forEach(a => s.push(`alegi ${a} și apeși Delete`));
    if (V.activa) s.push(`la final celula activă e ${V.activa}`);
    if (V.zoom != null) s.push(`duci zoom-ul${V.pe && multe ? ' foii ' + esc(V.pe) : ''} la ${V.zoom} % cu + și −`);
    const tp = Object.entries(V.tip || {}).map(([a, e]) => `în ${a} scrii <code>${esc('numar' in e ? numarRo(e.numar) : 'data' in e ? e.data : (cuApostrof(e.text) ? "'" : '') + e.text)}</code>`);
    if (tp.length) s.push(tp.join(', '));
    if (V.forma) { const sf = solutieForma(V.forma); if (sf) s.push(sf); }
    if (V.sortat) s.push(`alegi o celulă din tabel și Date (Data) → Sortare după ${textOrdine(V.sortat.dupa)}`);
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
  /* ---------- formatarea (lecția 6), cu gesturile elevului: selecție, butoanele din Home, listele lor, linia dintre litere ---------- */
  const HOME = (g, n) => 'panglica:Home/' + g + '/' + n;
  function selecteaza(ctx, t) { const [a, b] = String(t).split(':'); laCelula(ctx, a); if (b && b !== a) apasaTinta(ctx, 'celula:' + b, { shift: true }); }
  const fmtAcum = ctx => { const s = stare(ctx); return (s && s.format_celule) || {}; };
  /* comutatoarele (B, Center, Wrap Text …) se uită la celula ACTIVĂ: dacă ea are deja forma, primul clic o scoate de pe toată zona */
  function comutator(ctx, t, tinta0, are) {
    selecteaza(ctx, t);
    const F0 = fmtAcum(ctx), a0 = String(t).split(':')[0];
    if (celuleZona(t).every(a => are(F0[a] || {}))) return;
    if (are(F0[a0] || {})) apasaTinta(ctx, tinta0);
    apasaTinta(ctx, tinta0);
  }
  function dinLista(ctx, lista0, rand) { apasaTinta(ctx, lista0); apasaTinta(ctx, 'meniu:' + rand); }
  /* dublul clic pe linia din dreapta literei: două apăsări în același punct (biblioteca le citește ca dublu clic) */
  function dubluPe(ctx, t) { ctx.ux = null; apasaTinta(ctx, t); ctx.ux = null; apasaTinta(ctx, t); ctx.ux = null; }
  /* tragerea de linie (sub numărul rândului / din dreapta literei): apăsat, mișcat, eliberat */
  function tragePe(ctx, t, dx, dy) {
    const el = tinta(ctx, t);
    if (!el) return;
    try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* */ }
    const b = el.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    const ev = (fel, cx, cy, bt) => new PointerEvent(fel, { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: bt, clientX: cx, clientY: cy });
    el.dispatchEvent(ev('pointerdown', x, y, 1));
    for (let k = 1; k <= 4; k++) (el.isConnected ? el : ctx.root).dispatchEvent(ev('pointermove', x + dx * k / 4, y + dy * k / 4, 1));
    (el.isConnected ? el : ctx.root).dispatchEvent(ev('pointerup', x + dx, y + dy, 0));
    ctx.ux = null;
  }
  /* tragerea unui element (mânerul de umplere) până pe alt element (o celulă): apăsat pe primul, mișcat în pași, eliberat pe al doilea */
  function tragePanaLa(ctx, t1, t2) {
    const b2el = tinta(ctx, t2);
    try { if (b2el) b2el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* */ }
    const el = tinta(ctx, t1);
    if (!el || !b2el) return;
    const b = el.getBoundingClientRect(), d = b2el.getBoundingClientRect();
    const x = b.left + b.width / 2, y = b.top + b.height / 2, x2 = d.left + d.width / 2, y2 = d.top + d.height / 2;
    const ev = (fel, cx, cy, bt) => new PointerEvent(fel, { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: bt, clientX: cx, clientY: cy });
    el.dispatchEvent(ev('pointerdown', x, y, 1));
    for (let k = 1; k <= 6; k++) (el.isConnected ? el : ctx.root).dispatchEvent(ev('pointermove', x + (x2 - x) * k / 6, y + (y2 - y) * k / 6, 1));
    (el.isConnected ? el : ctx.root).dispatchEvent(ev('pointerup', x2, y2, 0));
    ctx.ux = null;
  }
  function imbinaZona(ctx, t, centrat) {
    const z = zonaDe(t), tl = adrDe(z.c1, z.r1);
    let F0 = fmtAcum(ctx);
    const ms = imbinari(F0);
    if (ms.some(m => zonaText(m) === zonaText(z))) { if (centrat !== false && (F0[tl] || {}).aliniere !== 'centru') { laCelula(ctx, tl); apasaTinta(ctx, HOME('Alignment', 'Center')); } return; }
    ms.filter(m => peste(m, z)).forEach(m => { laCelula(ctx, adrDe(m.c1, m.r1)); apasaTinta(ctx, HOME('Alignment', 'Merge & Center')); });   // o desface
    selecteaza(ctx, t);
    if (centrat === false) dinLista(ctx, 'meniu_derulant:Home/Alignment/Merge & Center', 'Merge Cells');
    else apasaTinta(ctx, HOME('Alignment', 'Merge & Center'));
    const s = stare(ctx);
    if (s && (s.dialog || s.fereastra_mesaj)) apasaTinta(ctx, 'fereastra:OK');   // avertismentul: zona are mai multe valori
  }
  function executaForma(ctx, S) {
    apasaTinta(ctx, 'fila:Home');
    if (S.imbinat) [].concat(S.imbinat).forEach(t => imbinaZona(ctx, t, S.centrat === false ? false : true));
    Object.entries(S.al || {}).forEach(([t, v]) => comutator(ctx, t, HOME('Alignment', BUT_AL[v]), f => f.aliniere === AL[v]));
    Object.entries(S.va || {}).forEach(([t, v]) => comutator(ctx, t, HOME('Alignment', BUT_VA[v]), f => (f.aliniere_verticala || null) === VA[v]));
    Object.entries(S.wrap || {}).forEach(([t, v]) => { if (v) comutator(ctx, t, HOME('Alignment', 'Wrap Text'), f => !!f.incadrare); else { selecteaza(ctx, t); if ((fmtAcum(ctx)[String(t).split(':')[0]] || {}).incadrare) apasaTinta(ctx, HOME('Alignment', 'Wrap Text')); } });
    Object.keys(S.b || {}).forEach(t => comutator(ctx, t, HOME('Font', 'Bold'), f => !!f.bold));
    Object.keys(S.fill || {}).forEach(t => { selecteaza(ctx, t); const F0 = fmtAcum(ctx); if (!celuleZona(t).every(a => (F0[a] || {}).umplere)) apasaTinta(ctx, HOME('Font', 'Fill Color')); });
    Object.entries(S.borduri || {}).forEach(([t, v]) => { selecteaza(ctx, t); dinLista(ctx, 'meniu_derulant:Home/Font/Borders', BORD[v]); });
    Object.entries(S.format || {}).forEach(([t, x]) => {
      const s0 = stare(ctx);
      if (s0 && !problemeForma(ctx, { format: { [t]: x } }, s0).length) return;   // forma e deja cea cerută (ex. „#.##0,00” de la pornire)
      selecteaza(ctx, t);
      const lista0 = 'meniu_derulant:Home/Number/Number Format';
      if (x.zecimale != null) { dinLista(ctx, lista0, 'Number'); for (let k = 2; k < x.zecimale; k++) apasaTinta(ctx, HOME('Number', 'Increase Decimal')); for (let k = x.zecimale; k < 2; k++) apasaTinta(ctx, HOME('Number', 'Decrease Decimal')); }
      else if (x.procent != null) { apasaTinta(ctx, HOME('Number', 'Percent Style')); for (let k = 0; k < x.procent; k++) apasaTinta(ctx, HOME('Number', 'Increase Decimal')); }
      else if (x.data) dinLista(ctx, lista0, x.data === 'lunga' ? 'Long Date' : 'Short Date');
      else if (x.nume) dinLista(ctx, lista0, x.nume);
    });
    Object.entries(S.stil || {}).forEach(([t, n]) => { selecteaza(ctx, t); dinLista(ctx, 'meniu_derulant:Home/Styles/Cell Styles', n); });
    Object.entries(S.inaltime || {}).forEach(([r, x]) => {
      for (let i = 0; i < 3 && x.min != null; i++) {
        const s = stare(ctx), px = ((s && s.inaltimi_randuri) || {})[r] || PX_RAND, vrut = Math.ceil(x.min * 4 / 3) + 8;
        if (px * 3 / 4 >= x.min) break;
        tragePe(ctx, 'antet_rand_margine:' + r, 0, (vrut - px) * ((s && s.zoom) || 100) / 100);
      }
    });
    /* lățimile la urmă: potrivirea ține cont de formatele de mai sus (zecimale, aldin, îmbinarea titlului) */
    const cols = new Set();
    [S.faraDiez, S.vizibil].filter(Boolean).forEach(t => coloaneDin(celuleZona(t)).forEach(c => cols.add(c)));
    cols.forEach(c => dubluPe(ctx, 'antet_coloana_margine:' + c));
  }
  /* greșeala tipică a formatării (pentru poarta de test; vechiul aplicaGresit): îmbinarea mai scurtă, alt chenar, alt format,
     aldin în loc de lățime, cealaltă aliniere; la restul, nimic făcut */
  function gresesteForma(ctx, S) {
    apasaTinta(ctx, 'fila:Home');
    if (S.imbinat) { const z = zonaDe([].concat(S.imbinat)[0]); imbinaZona(ctx, zonaText({ c1: z.c1, c2: Math.max(z.c1 + 1, z.c2 - 1), r1: z.r1, r2: z.r2 }), true); return; }
    if (S.borduri) { const [t] = Object.keys(S.borduri); selecteaza(ctx, t); dinLista(ctx, 'meniu_derulant:Home/Font/Borders', S.borduri[t] === 'toate' ? 'Outside Borders' : 'Bottom Border'); return; }
    if (S.format) { const [t] = Object.keys(S.format); selecteaza(ctx, t); dinLista(ctx, 'meniu_derulant:Home/Number/Number Format', S.format[t].zecimale != null ? 'Currency' : 'General'); return; }
    if (S.faraDiez || S.vizibil) { selecteaza(ctx, S.faraDiez || S.vizibil); apasaTinta(ctx, HOME('Font', 'Bold')); return; }
    if (S.al) { const [t] = Object.keys(S.al); selecteaza(ctx, t); apasaTinta(ctx, HOME('Alignment', S.al[t] === 'right' ? 'Align Left' : 'Align Right')); }
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
  /* sortarea cu gesturile elevului (lecția 10): clic pe o celulă din coloana primului criteriu, fila Data › Sort (butonul mare),
     bifa „My data has headers” cum cere zona, „Sort by” / „Then by” alese din liste (coloana după numele ei, ordinea: primul rând
     = crescător, al doilea = descrescător), Add Level / Delete Level până sunt atâtea niveluri câte criterii, OK.
     Fereastra Sort e întotdeauna drumul: butonul A→Z ar sorta și titlul unei liste numai de texte (lecția o arată ca greșeală) */
  const inFereastra = (ctx, sel) => ctx.root.querySelector('[data-lh-tip="Window"] ' + sel);
  const butonFereastra = (ctx, et) => inFereastra(ctx, `[data-lh-tip="Button"][data-lh-eticheta="${et}"]`);
  function alegeDinLista(ctx, cb, alege) {
    if (!cb || !apasa(ctx, cb)) return false;
    const it = [...ctx.root.querySelectorAll('[role="listbox"] [role="option"]')];
    const x = typeof alege === 'number' ? it[alege] : it.find(e => e.getAttribute('data-lh-eticheta') === alege);
    return x ? apasa(ctx, x) : (tasta(ctx, 'Escape'), false);
  }
  function sorteazaCuFereastra(ctx, VS) {
    const z = zonaDe(VS.zona);
    if (!z || !VS.dupa || !VS.dupa.length) return;
    const antet = VS.antet !== false, r0 = antet ? z.r1 + 1 : z.r1;
    /* rândurile desperecheate / titlul ajuns printre date nu se repară prin sortare: întâi Ctrl+Z până revin rândurile întregi
       (ca în mesajul vechi: „Apasă Ctrl+Z…”); dacă nu ajunge, se scriu la loc valorile de la început, cum le-a pus lecția */
    const intreg = () => { const s = stare(ctx), R = s ? celulePe(s, s.foaie_activa) : null; return !!R && !!ctx.start && cheieRand(R, z, z.r1) === cheieRand(ctx.start, z, z.r1) && randuriIntregi(ctx, R, z, r0); };
    for (let g = 0; g < 30 && ctx.start && !intreg(); g++) tasta(ctx, 'z', { ctrlKey: true, code: 'KeyZ' });
    if (ctx.start && !intreg()) {
      const s = stare(ctx), R = celulePe(s, s.foaie_activa), C0 = ctx.Q.cells || {}, dif = [];
      for (let r = z.r1; r <= z.r2; r++) for (let c = z.c1; c <= z.c2; c++) { const a = adrDe(c, r); if (cheieVal(brut(R[a])) !== cheieVal(brut(ctx.start[a]))) dif.push([a, C0[a] == null ? '' : numarRo(C0[a])]); }
      dif.forEach(([a, t]) => { laCelula(ctx, a); if (t === '') tasta(ctx, 'Delete'); else { tasteaza(ctx, t); tasta(ctx, 'Enter'); } });
    }
    laCelula(ctx, adrDe(pos(VS.dupa[0].col + '1').c, r0));
    apasaTinta(ctx, 'fila:Data');
    apasaTinta(ctx, 'mso:SortDialog');
    if (!inFereastra(ctx, '[data-lh-nivel]')) return;
    const bifa = inFereastra(ctx, '[data-lh-tip="CheckBox"][data-lh-eticheta="My data has headers"]');
    if (bifa && (bifa.getAttribute('aria-checked') === 'true') !== antet) apasa(ctx, bifa);
    const nume = c => (antet && ctx.start ? afisat(ctx.start[adrDe(c, z.r1)]) : '') || 'Column ' + COL(c);
    const niveluri = () => ctx.root.querySelectorAll('[data-lh-tip="Window"] [data-lh-nivel]').length;
    VS.dupa.forEach((k, i) => {
      if (i >= niveluri()) apasa(ctx, butonFereastra(ctx, 'Add Level'));
      alegeDinLista(ctx, inFereastra(ctx, `[data-lh-nivel="${i}"] [data-lh-camp="coloana"]`), nume(pos(k.col + '1').c));
      alegeDinLista(ctx, inFereastra(ctx, `[data-lh-nivel="${i}"] [data-lh-camp="ordine"]`), k.ord === 'desc' ? 1 : 0);
    });
    /* nivelurile rămase de la o sortare de dinainte (fereastra se deschide cu ea): alege nivelul de jos, Delete Level */
    for (let g = 0; g < 64 && niveluri() > VS.dupa.length; g++) {
      const n = niveluri() - 1, et = inFereastra(ctx, `[data-lh-nivel="${n}"] .lh-ap-x-nivel-et`) || inFereastra(ctx, `[data-lh-nivel="${n}"]`);
      apasa(ctx, et); apasa(ctx, butonFereastra(ctx, 'Delete Level'));
    }
    apasa(ctx, butonFereastra(ctx, 'OK'));
  }
  /* greșeala tipică a sortării (ca ExcelS.gresit): doar coloana criteriului, cu Continue with the current selection în Sort Warning
     (rândurile se desperechează); la o listă de o coloană, toată coloana cu titlul, butonul A→Z (titlul ajunge printre nume) */
  function sorteazaGresit(ctx, VS) {
    const z = zonaDe(VS.zona), k = (VS.dupa || [])[0];
    if (!z || !k) return;
    const c = pos(k.col + '1').c, mso = 'mso:' + (k.ord === 'desc' ? 'SortDescendingExcel' : 'SortAscendingExcel');
    selecteaza(ctx, z.c1 === z.c2 ? adrDe(z.c1, z.r1) + ':' + adrDe(z.c1, z.r2) : adrDe(c, z.r1 + 1) + ':' + adrDe(c, z.r2));
    apasaTinta(ctx, 'fila:Data');
    apasaTinta(ctx, mso);
    const cont = inFereastra(ctx, '[data-lh-tip="RadioButton"][data-lh-eticheta="Continue with the current selection"]');
    if (cont) { apasa(ctx, cont); apasa(ctx, butonFereastra(ctx, 'Sort...')); }
  }
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
      const deScris = Object.entries(V.valori || {}).map(([a, v]) => [a, numarRo(v)]).concat(Object.entries(V.formule || {}).filter(([a]) => !cuSigma(V, a)).map(([a, f]) => [a, String(f)]));
      if (deScris.length) scrieCelule(ctx, deScris);
      /* lecția 8: celulele cerute cu Σ se fac cu Σ (panglica: Σ = Sumă; săgeata ▾ › rândul funcției), zona bună scrisă peste cea
         propusă (biblioteca o ține aleasă, deci scrisul o înlocuiește), Enter */
      Object.entries(V.formule || {}).filter(([a]) => cuSigma(V, a)).forEach(([a, f]) => {
        const fn = cuSigma(V, a), s1 = stare(ctx);
        if (s1 && filaDeschisa(s1) !== 'home') apasaTinta(ctx, 'fila:Home');
        laCelula(ctx, a);
        if (fn === 'SUM') apasaTinta(ctx, 'panglica:Home/Editing/AutoSum');
        else { apasaTinta(ctx, 'meniu_derulant:Home/Editing/AutoSum'); apasaTinta(ctx, 'meniu:' + LISTA_SIGMA[fn]); }
        const z = argFunctie(f);
        if (z) tasteaza(ctx, z);
        tasta(ctx, 'Enter');
      });
      /* mânerul de umplere: selecția = celulele-sursă, mânerul tras până la ultima celulă-țintă (apăsat, mișcat, eliberat) */
      if (V.umplut) {
        const src = Object.keys(V.umplut).map(pos).filter(Boolean), dst = [].concat(...Object.values(V.umplut)).map(pos).filter(Boolean);
        if (src.length && dst.length) {
          const c1 = Math.min(...src.map(p => p.c)), r1 = Math.min(...src.map(p => p.r)), c2 = Math.max(...src.map(p => p.c)), r2 = Math.max(...src.map(p => p.r));
          selecteaza(ctx, adrDe(c1, r1) + ':' + adrDe(c2, r2));
          tragePanaLa(ctx, 'maner_umplere', 'celula:' + adrDe(Math.max(c2, ...dst.map(p => p.c)), Math.max(r2, ...dst.map(p => p.r))));
        }
      }
      if (V.tip) scrieTipuri(ctx, V);
      if (V.forma) executaForma(ctx, V.forma);
      if (V.zoom != null) laZoom(ctx, V.zoom);
      if (V.sortat) sorteazaCuFereastra(ctx, V.sortat);
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
      if (V.forma) gresesteForma(ctx, V.forma);
      if (V.zoom != null) laZoom(ctx, V.zoom === 100 ? 90 : 100);
      if (V.sortat) sorteazaGresit(ctx, V.sortat);
      const cel = V.activa || V.sel || (V.zona ? String(V.zona).split(':')[0] : null);
      if (cel) laCelula(ctx, cel === 'A1' ? 'B2' : 'A1');
      if (V.unde) { apasaTinta(ctx, potriveste('celula:A1', V.unde) ? 'camp:Name Box' : 'celula:A1'); }
    } finally { ctx.robot = false; }
  }

  /* ---------- conținutul de pornire, în forma bibliotecii ---------- */
  /* forme {'B2:B4': {nfx: '#.##0,00', b: true, fill: '#FFFF00', al: 'center'}} și imbinari ['A1:D1'] (lecția 6) → `format` al bibliotecii;
     codul de format e scris pe setări românești, ca în lecție: excel.js îl traduce (format_numar_ro → tipuri.codDinRo) */
  function formaPornire(Q) {
    if (!Q.forme && !Q.imbinari) return null;
    const out = {}, pe = (a, o) => { out[a] = Object.assign(out[a] || {}, o); };
    Object.entries(Q.forme || {}).forEach(([t, pr]) => celuleZona(t).forEach(a => Object.entries(pr || {}).forEach(([k, v]) => {
      if (k === 'nfx') pe(a, { format_numar_ro: v });
      else if (k === 'b') pe(a, { bold: !!v }); else if (k === 'i') pe(a, { italic: !!v }); else if (k === 'u') pe(a, { underline: !!v });
      else if (k === 'fill') pe(a, { umplere: String(v).replace('#', '').toUpperCase() });
      else if (k === 'al' && AL[v]) pe(a, { aliniere: AL[v] });
      else W.console.warn('excel-excelx-adapter: forma de pornire necunoscută', k, v);
    })));
    (Q.imbinari || []).forEach(t => { const z = zonaDe(t); if (z) pe(adrDe(z.c1, z.r1), { imbinat: zonaText(z) }); });
    return out;
  }
  function continutDe(Q) {
    const c = {};
    if (Q.foi && Q.foi.length) {
      const k0 = Math.min(Q.foaie || 0, Q.foi.length - 1);
      c.foi = Q.foi.map((f, i) => ({ nume: f.nume, celule: f.cells || {}, latimi_caractere: f.latimi, zoom: i === k0 ? Q.zoom : undefined }));
      c.fi = k0;
    } else {
      c.celule = Q.cells || {};
      if (Q.zoom) c.zoom = Q.zoom;
      if (Q.latimi && typeof Q.latimi === 'object' && !Array.isArray(Q.latimi)) c.latimi_caractere = Q.latimi;
      /* lecția 10: tabelul de sortat e un tabel terminat, cu datele calendaristice citibile (pe vechi se vedeau întregi). Biblioteca,
         ca Excel, NU lățește coloanele conținutului de pornire, deci o dată în coloana de 64 px ar apărea „########” (doar la
         tastare coloana se lățește singură). Aici coloana cu date primește lățimea pe care i-ar fi dat-o Excel dacă profesorul ar
         fi tastat datele (11 caractere pentru zz.ll.aaaa); doar la exercițiile de sortare și doar unde lecția nu dă lățimi */
      else if (Q.verifica && Q.verifica.sortat) {
        const lat = {};
        Object.entries(Q.cells || {}).forEach(([a, v]) => { const m = /^([A-Z]+)\d+$/.exec(a); if (m && typeof v === 'string' && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(v.trim())) lat[m[1]] = 11; });
        if (Object.keys(lat).length) c.latimi_caractere = lat;
      }
      if (Q.inaltimi && typeof Q.inaltimi === 'object') c.inaltimi = Q.inaltimi;
      const fm = formaPornire(Q);
      if (fm) c.format = fm;
      if (Q.numeFoaie) c.foi = [{ nume: Q.numeFoaie, celule: c.celule, latimi_caractere: c.latimi_caractere, inaltimi: c.inaltimi, format: c.format, zoom: Q.zoom }];
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
    /* lecția 9: Q.functii (în afara lui verifica, ca pe vechi: excelx-decizie.js › resolve) se verifică împreună cu verifica */
    const V = Q.functii && Q.verifica ? Object.assign({}, Q.verifica, { functii: Q.functii }) : (Q.verifica || {});
    body.innerHTML = `${Q.teste ? '<div class="xa-teste" aria-live="polite"></div>' : ''}<div class="xa-host"></div><p class="xa-nota" role="status"></p>${Q.o ? '<div class="opts xa-opts" id="xopts"></div>' : ''}`;
    const host = body.querySelector('.xa-host'), cutie = body.querySelector('.xa-teste'), nota = body.querySelector('.xa-nota');
    /* formatarea (lecția 6): ajutorul de sub foaie pe care îl dădea simulatorul vechi (excelx-formatare.js › TEL și nota panglicii),
       spus pentru Excelul din bibliotecă: pe telefon, cercurile ⇔ / ⇕; pe calculator, panglica derulată lateral, doar dacă nu încape */
    const cuForma = !!(V.forma || (Q.teste || []).some(T => T && T.forma));
    const ajutorForma = cuForma ? document.createElement('p') : null;
    if (ajutorForma) { ajutorForma.className = 'xa-nota xa-ajutor'; host.after(ajutorForma); }
    const peDeget = () => { try { return matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0; } catch (e) { return false; } };
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

    /* gesturile cerute (lecția 8: verifica.gest, teste umple:true), din evenimentele bibliotecii — ca `gest` al simulatorului vechi
       (tip-excel.js): Σ / lista ▾ / Alt+= = autosum (acțiunea suma_automata), mânerul tras și eliberat = umple (gestul
       umplere_tragere cu acțiunea umplere; apăsarea simplă pe mâner nu umple nimic). Și „Arată-mi răspunsul” le face cu aceleași gesturi */
    if ((V && (V.gest || V.umplut)) || (Q.teste || []).some(T => T && (T.gest || T.umple))) {
      ctx.gest = new Set();
      const gest = ev => {
        if (!host.isConnected) { W.removeEventListener('lh-aplicatie', gest); return; }
        const d = ev.detail || {};
        if (d.aplicatie !== 'excel') return;
        if (d.actiune === 'suma_automata') ctx.gest.add('autosum');
        if (d.actiune === 'umplere' && d.gest === 'umplere_tragere') ctx.gest.add('umple');
      };
      W.addEventListener('lh-aplicatie', gest);
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

    /* sortarea (lecția 10): s-a făcut o sortare (acțiunile sortare / sortare_crescatoare / sortare_descrescatoare ale bibliotecii,
       din butoane, din Sort Warning sau din fereastra Sort) — testele antet / intregi se bifează abia după ea, ca pe vechi (S.gest) */
    if ((V && V.sortat) || (Q.teste || []).some(T => T && (T.antet || T.intregi || T.ordonat))) {
      const sort = ev => {
        if (!host.isConnected) { W.removeEventListener('lh-aplicatie', sort); return; }
        const d = ev.detail || {};
        if (d.aplicatie === 'excel' && /^sortare/.test(d.actiune || '')) ctx.sortari = true;
      };
      W.addEventListener('lh-aplicatie', sort);
    }

    /* testele numite, bifate pe loc */
    let semn = '';
    function bifeaza() {
      if (!cutie) return;
      const s = stare(ctx);
      if (!s) return;
      const rez = Q.teste.map(T => ({ ce: T.ce, ok: probleme(ctx, T, s).length === 0 }));
      /* motivul de sub testul nebifat, doar unde lecția îl cere (motive:true, lecția 7) */
      if (Q.motive) rez.forEach((x, i) => { if (!x.ok) { try { x.motiv = motivTest(ctx, s, Q.teste[i]); } catch (e) { x.motiv = ''; } } });
      const h = `<div class="lbl">Testele atelierului: ${rez.filter(x => x.ok).length} din ${rez.length} gata</div><ul>${rez.map(x => `<li class="${x.ok ? 'ok' : ''}"><span aria-hidden="true">${x.ok ? '✔' : '○'}</span><span>${x.ce}<span class="xa-sr">${x.ok ? ' (gata)' : ' (încă nu)'}</span>${x.motiv ? `<span class="xa-motiv">${x.motiv}</span>` : ''}</span></li>`).join('')}</ul>`;
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
        /* foaia de la deschidere (lecția 10: rândurile întregi se compară cu ea); o singură dată, nu și la redeschiderea de după
           „Exersează pe variante” (foaia revine atunci cum a rămas) */
        if (!ctx.start) { const s0 = stare(ctx); ctx.start = s0 ? JSON.parse(JSON.stringify(celulePe(s0, s0.foaie_activa))) : null; }
        if (Q.start) {
          /* foaia are tastatura de la început (elevul scrie fără clic); motorul mai mută focusul după ce așază exercițiul */
          const laStart = () => { const a = document.activeElement; if (!host.isConnected || (a && ctx.root.contains(a))) return; if (a && a.closest && a.closest('input,textarea,select')) return; try { inst.focus(); } catch (e) { /* */ } };
          laStart(); setTimeout(laStart, 0); setTimeout(laStart, 200);
        }
        if (ajutorForma) {
          const sus = ctx.root.querySelector('.lh-ap-sus');
          if (peDeget()) ajutorForma.innerHTML = '<b>Formatarea pe telefon:</b> lățimea unei coloane: atingi litera ei, apoi tragi de cercul verde ⇔ de pe marginea ei; două atingeri pe cerc o potrivesc singură. Înălțimea unui rând: atingi numărul lui, apoi tragi de cercul ⇕. Panglica și foaia le derulezi în lateral cu degetul. Săgeata ▾ a unui buton deschide lista lui.';
          else if (sus && sus.scrollWidth > sus.clientWidth + 1) ajutorForma.innerHTML = 'Panglica nu încape toată: grupurile Număr (Number), Stiluri (Styles), Celule (Cells) și Editare (Editing) sunt mai la dreapta. Trage spre dreapta de bara subțire de sub panglică sau rotește rotița mouse-ului ținând apăsat Shift. În Excel-ul de pe calculator o vezi întreagă.';
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
