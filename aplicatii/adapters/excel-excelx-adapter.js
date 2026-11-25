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
   O cheie pe care adaptorul nu o știe NU trece (și se scrie în consolă): tip, forma, functie, gest, umplut, sortat, format,
   imbinat, grafic — ale lecțiilor 5-11, de adus când se leagă acelea (vezi raportul pilotului).
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

  /* ---------- verificarea ---------- */
  const CHEI = ['unde', 'fila', 'foaie', 'pe', 'zoom', 'valori', 'formule', 'gol', 'sel', 'activa', 'zona', 'neatinsa', 'doarTaste', 'mesajActiva', 'fara'];
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
    return s.length ? s.join('; ') + '.' : '';
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
        const p = probleme(ctx, V, s);
        if (!p.length) { api.resolve(true); return; }
        api.resolve(false, p.slice(0, 2).join(' '));
        api.revealButton(() => { executa(ctx); bifeaza(); api.giveUp(solutie(ctx, V)); });
        try { ctx.inst.focus(); } catch (e) { /* */ }   // după „Nu încă”, tastele (Ctrl+Z) ajung iar la foaie
      });
    }

    L.gata.then(() => L.deschide('excel', { loc: host, continut: continutDe(Q), focus: !!Q.start }))
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
  }
  function rezolva(Q, body) {
    const ctx = CTX.get(body);
    if (!ctx) return;
    if (Q.o) { const b = body.querySelector(`.opt[data-k="${Q.ok}"]`); if (b) b.click(); return; }
    executa(ctx);
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
})();
