/* lectii/_sim/cutii-variabile.js — „Datele unui algoritm”: tabelul de analiză (ce se dă / ce se cere / ce se calculează pe
   parcurs) și cutiile etichetate (variabilele), pentru o lecție FĂRĂ profesor (ora simultană).

   PROPRIETAR: lecția V/26 (lectii/v/m4-l26, „Datele: de intrare, de ieșire, de manevră. Constante și variabile”),
   02.11.2026. Lecțiile următoare îl pot încărca întreg, NEMODIFICAT; ce le lipsește fac într-un fișier NOU
   (`lectii/_sim/cutii-variabile-<ceva>.js`). Nu depinde de niciun alt simulator (nici de `executant.js` al V/24,
   nici de `algoritm-defect.js` al V/25, nici de `analiza-enunt.js` al VII/23).

   FIDELITATE (nu simulează o aplicație; e o fișă de lucru în pagină, ca în caiet):
     - Tabelul de analiză: coloanele „Ce se dă”, „Ce se cere”, „Ce se calculează pe parcurs” (activitatea profesorului).
       Rolul fiecărei date e scris de pagina care folosește simulatorul (câmpul `rol`), împreună cu algoritmul problemei:
       „ce se calculează pe parcurs” depinde de pașii aleși, de aceea fiecare problemă cu trei coloane își are pașii scriși.
     - Cutiile (analogia profesorului: variabila = cutie etichetată): eticheta = numele variabilei, ce e în cutie = valoarea.
       REGULILE PAGINII (spuse în lecție, nu fapte despre vreun program): o cutie ține O SINGURĂ valoare odată (un singur
       număr); când pui alta, cea veche dispare; o cutie se schimbă doar când pui ceva în ea; cutia cu lacăt e o constantă și
       nu primește altă valoare.
     - Răspunsurile scrise se citesc cu `numar()`: cifre, „12 lei”, „12 de baloane”, „doisprezece”, „douăzeci și opt”,
       calculul „60 - 48 = 12” (contează ce e după ultimul „=”) sau „60 - 48” (se face calculul). Din 1.1 (02.11.2026,
       reparația r1): „4.5” / „4,5” → motivul 'zecimal' (înainte: „mai multe numere”, fals); „50,0” / „50.0” = 50;
       „1.000” → 'zecimal' (punctul poate fi al miilor: nu ghicesc); „-3”, „−3”, „minus 3” → 'minus' (înainte: citit 3);
       „cinci zeci” (cuvântul „zeci” singur), „o mie” → 'nu_inteleg' (înainte: citit 5).
     - După „Corect” (sau „Arată-mi răspunsul”), o atingere pe date / cutii spune de ce nu se mai schimbă nimic; „Ia-o de la
       capăt” după „Corect” spune că e o încercare nouă, doar pentru exersare, și NU mai arată ✗ la teste până la noul
       „Verifică” (1.1).
     - Nimic nu se salvează și nimic nu pleacă: 0 scrieri în localStorage / sessionStorage / cookie, 0 cereri.

   API PUBLIC (window.CutiiVariabile):
     versiune                      '1.1 (02.11.2026)'  (1.0 → 1.1: doar ADĂUGIRI compatibile, vezi mai sus și granița V/26)
     numar(text)                   -> {ok, v, motiv?}  motiv: 'gol' | 'multe' (mai multe numere fără calcul) | 'nu_inteleg'
                                      | 'zecimal' (1.1: număr cu virgulă / punct) | 'minus' (1.1: număr cu minus în față)
     ROLURI                        {da:'Ce se dă', cere:'Ce se cere', parcurs:'Ce se calculează pe parcurs'}
     tabel(P, {coloane?, valori?}) -> HTML static: tabelul de analiză completat (pentru „Uite cum”)
     urma(C)                       -> HTML static: pașii unui algoritm cu cutii și cutiile după fiecare pas (pentru „Uite cum”)
     ruleaza(C)                    -> {cutii:{nume: valoare}} după toți pașii (pentru teste și chei)
     tipuri['date-rol'], tipuri.cutii   {render, rezolva, gresit} pentru JocMotor

   PROBLEMA P (pentru tabel și `date-rol`):
     {nume, enunt:'text', pasi?:['Pasul 1…', …], date:[{t:'câți elevi sunt în clasă', rol:'da'|'cere'|'parcurs',
       v?:'24' (valoarea, de arătat în „Uite cum”), val?:număr (pentru rol cere/parcurs: ce trebuie scris), pas?:indice}]}
   TIPUL „date-rol”:
     {t:'date-rol', q, probleme:[P, …], coloane?:['da','cere'] | ['da','cere','parcurs'] (implicit toate trei),
      teste:[{k:'coloane'|'valori', p:indice, ce}], gresit?:{p, id: indicele datei, rol} (greșeala tipică), ajutor, why}
     Sub fiecare dată nepusă stă câte un buton pentru fiecare coloană (o atingere o pune acolo); o dată din tabel, atinsă,
     se întoarce sus. După „Corect”, simulatorul nu mai primește schimbări până la „Ia-o de la capăt”.
     'coloane' = fiecare dată e pusă, în coloana ei; 'valori' = la datele din „Ce se cere” / „Ce se calculează pe parcurs”
     valoarea scrisă e cea bună. Mai multe probleme = file „Problema 1, 2, …”. Testele se bifează la „Verifică”.
   ALGORITMUL CU CUTII C (pentru urma și tipul „cutii”):
     {cutii:[{n:'bomboane', c?:true (constantă, cu lacăt), v?:valoarea de la început}],
      pasi:[{t:'Pune 4 în cutia «bomboane».', pune:{bomboane:4 | (s) => număr}}, …]}
   TIPUL „cutii”:
     {t:'cutii', q, cutii, pasi, teste:[{k:'cutie', n, ce}], gresit?:{nume: valoare} (starea greșită tipică), ajutor, why}
     Elevul e executantul: atinge o cutie, scrie valoarea, „Pune”. Testele judecă doar cutiile de la sfârșit (rezultat,
     nu drum). „Ia-o de la capăt” golește cutiile (constantele rămân).
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('cutii-variabile', {detail:{tip, bune, total, ok}}).

   CE NU SE SCHIMBĂ (lecțiile următoare se sprijină pe ele): numele tipurilor și ale testelor (k), forma lui P și C,
   ROLURI și textele coloanelor, regulile cutiilor de mai sus, clasele CSS cu prefixul `cv-`, id-ul stilului `cv-css`,
   regula „nimic nu se salvează, nimic nu pleacă”.
*/
(function () {
  'use strict';
  const VERSIUNE = '1.1 (02.11.2026)';
  const ROLURI = {da: 'Ce se dă', cere: 'Ce se cere', parcurs: 'Ce se calculează pe parcurs'};
  const SCURT = {da: 'Ce se dă', cere: 'Ce se cere', parcurs: 'Pe parcurs'};   // pe butoanele de sub o dată nepusă
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const nrRo = v => String(v).replace('.', ',');   // 1.1: un rezultat cu zecimale (ex. „50 : 4”) se arată cu virgulă, ca la școală
  /* 1.1 (judecata 1, sonnet M4): după „Corect” atingerile nu fac nimic — acum spun de ce; reluarea spune ce e */
  const NOTA_GATA = 'Exercițiul e încheiat, de aceea nu se mai schimbă nimic. Ca să-l faci din nou, apasă „Ia-o de la capăt”.';
  const NOTA_DIN_NOU = 'O încercare nouă, doar ca să exersezi: exercițiul e deja încheiat. Testele se bifează iar la „Verifică”.';

  /* ===================== citirea unui număr scris de un copil ===================== */
  const fara = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[şș]/g, 's').replace(/[ţț]/g, 't');
  const UNIT = {zero: 0, unu: 1, una: 1, un: 1, doi: 2, doua: 2, trei: 3, patru: 4, cinci: 5, sase: 6, sapte: 7, opt: 8, noua: 9,
    zece: 10, unsprezece: 11, unspe: 11, doisprezece: 12, douasprezece: 12, doispe: 12, treisprezece: 13, treispe: 13,
    paisprezece: 14, patrusprezece: 14, paispe: 14, cincisprezece: 15, cinspe: 15, saisprezece: 16, sasesprezece: 16, saispe: 16,
    saptesprezece: 17, saptispe: 17, optsprezece: 18, optspe: 18, nouasprezece: 19, nouaspe: 19};
  const ZECI = {douazeci: 20, treizeci: 30, patruzeci: 40, cincizeci: 50, saizeci: 60, sasezeci: 60, saptezeci: 70, optzeci: 80, nouazeci: 90};
  /* numerele scrise în cuvinte: grupuri separate; „și” leagă doar zecile de unități („douăzeci și opt”) */
  function cuvinte(t) {
    const tok = t.split(/\s+/).filter(Boolean);
    const grupuri = [];
    let cur = null, dupaZeci = false, asteaptaUnit = false;
    const inchide = () => { if (cur) grupuri.push(cur.sute + cur.v); cur = null; dupaZeci = false; asteaptaUnit = false; };
    for (let i = 0; i < tok.length; i++) {
      const w = tok[i];
      if (w === 'o' && (tok[i + 1] === 'suta')) { inchide(); cur = {sute: 0, v: 1}; continue; }
      if (w === 'suta' || w === 'sute') { if (cur && cur.v && cur.v < 10 && !cur.sute) { cur.sute = cur.v * 100; cur.v = 0; continue; } inchide(); continue; }
      if (w === 'si') { if (dupaZeci) { asteaptaUnit = true; continue; } inchide(); continue; }
      if (w in ZECI) {
        if (cur && (cur.v || asteaptaUnit)) inchide();
        if (!cur) cur = {sute: 0, v: 0};
        cur.v += ZECI[w]; dupaZeci = true; continue;
      }
      if (w in UNIT) {
        if (cur && cur.v && !asteaptaUnit) inchide();
        if (!cur) cur = {sute: 0, v: 0};
        cur.v += UNIT[w]; dupaZeci = false; asteaptaUnit = false; continue;
      }
      inchide();   // alt cuvânt („lei”, „baloane”, „de”): desparte grupurile
    }
    inchide();
    return grupuri;
  }
  /* un calcul simplu, fără paranteze: + − × : (ordinea de la școală: întâi × și :) */
  function calcul(e) {
    const m = e.match(/\d+(?:,\d+)?|[+\-*\/:x]/g);
    if (!m) return null;
    const t = m.map(x => /\d/.test(x) ? parseFloat(x.replace(',', '.')) : x);
    if (typeof t[0] !== 'number' || typeof t[t.length - 1] !== 'number') return null;
    for (let i = 1; i < t.length; i += 2) if (typeof t[i] === 'number' || typeof t[i + 1] !== 'number') return null;
    const v = t.slice();
    for (let i = 1; i < v.length;) {
      if (v[i] === '*' || v[i] === 'x' || v[i] === '/' || v[i] === ':') {
        const r = (v[i] === '*' || v[i] === 'x') ? v[i - 1] * v[i + 1] : v[i - 1] / v[i + 1];
        v.splice(i - 1, 3, r);
      } else i += 2;
    }
    let r = v[0];
    for (let i = 1; i < v.length; i += 2) r = v[i] === '+' ? r + v[i + 1] : r - v[i + 1];
    return isFinite(r) ? Math.round(r * 1000) / 1000 : null;
  }
  function numar(text) {
    let t = fara(text).trim();
    if (!t) return {ok: false, motiv: 'gol'};
    if (t.includes('=')) t = t.slice(t.lastIndexOf('=') + 1);
    t = t.replace(/[×·∙]/g, '*').replace(/[–—−]/g, '-').replace(/(\d)\s*x\s*(\d)/g, '$1*$2');
    /* 1.1 (02.11, J2-U, dirijor): „30 minus 6” e o scădere, ca „30 - 6”; motivul 'minus' rămâne doar pentru minusul din față */
    t = t.replace(/(\d)\s*minus\s*(\d)/g, '$1-$2');
    /* 1.1: minusul din fața unui număr (nimic cu cifre înainte) nu e o scădere: „-3”, „e -3”, „minus 3” */
    if (/^[^\d]*-\s*\d/.test(t) || /(^|\s)minus(\s|$)/.test(t)) return {ok: false, motiv: 'minus'};
    /* 1.1: „50,0” / „50.0” = 50; „4,5”, „4.5”, „1.000” (poate fi punctul miilor) → 'zecimal', nu „mai multe numere” */
    let zec = false;
    t = t.replace(/(\d+)([.,])(\d+)/g, (m, a, sep, b) => { if (/^0+$/.test(b) && !(sep === '.' && b.length === 3)) return a; zec = true; return m; });
    if (zec) return {ok: false, motiv: 'zecimal'};
    const cifre = t.match(/\d+(?:,\d+)?/g);
    if (cifre) {
      if (cifre.length === 1) return {ok: true, v: parseFloat(cifre[0].replace(',', '.'))};
      const doar = t.replace(/[a-z]+/g, ' ').replace(/[.!?;"'„”«»()]/g, ' ');
      if (/^[\s\d,+\-*\/:]+$/.test(doar) && /[+\-*\/:]/.test(doar)) { const r = calcul(doar.replace(/\s+/g, '')); if (r != null) return {ok: true, v: r}; }
      return {ok: false, motiv: 'multe'};
    }
    const tw = t.replace(/[^a-z\s]/g, ' ');
    /* 1.1: „cinci zeci” (fără „și”, despărțit greșit), „o mie”: nu ghicesc ce a vrut să scrie (înainte: citit 5) */
    if (/(^|\s)(zeci|mie|mii)(\s|$)/.test(tw)) return {ok: false, motiv: 'nu_inteleg'};
    const g = cuvinte(tw);
    if (g.length === 1) return {ok: true, v: g[0]};
    if (g.length > 1) return {ok: false, motiv: 'multe'};
    return {ok: false, motiv: 'nu_inteleg'};
  }

  /* ===================== stilul (o singură dată pe pagină) ===================== */
  function stil() {
    if (document.getElementById('cv-css')) return;
    const st = document.createElement('style');
    st.id = 'cv-css';
    st.textContent = `
.cv{--cv-ok:var(--ok,#1E7A46);--cv-bad:var(--bad,#B8362E);--cv-cutie:#E9D3A8;--cv-cutieL:#B88B4A;--cv-cutieInk:#3B2A12}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .cv{--cv-cutie:#5A4527;--cv-cutieL:#C9A46A;--cv-cutieInk:#F6E9CF}}
:root[data-theme="dark"] .cv{--cv-cutie:#5A4527;--cv-cutieL:#C9A46A;--cv-cutieInk:#F6E9CF}
.cv-file{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.cv-file button{min-height:40px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:600;cursor:pointer}
.cv-file button.on{border:2px solid var(--accent);background:var(--paper)}
.cv-file button.ok{border-color:var(--cv-ok)}
.cv-file button.no{border-color:var(--cv-bad)}
.cv-card{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:10px 12px}
.cv-nume{font-family:var(--fd,inherit);font-weight:600;font-size:1.05rem;margin:0 0 4px}
.cv-enunt{margin:0 0 6px;line-height:1.45}
.cv-alg{margin:4px 0 8px 1.3em;padding:0}
.cv-alg li{margin:2px 0;line-height:1.4}
.cv-lbl{font-weight:700;margin:10px 0 4px}
.cv-lbl2{font-size:.88rem;color:var(--ink2);margin:2px 0 4px}
.cv-nepuse{display:flex;flex-direction:column;gap:6px;min-height:44px;padding:6px;border:1px dashed var(--line);border-radius:8px;background:var(--paper2)}
.cv-np{border:1px solid var(--line);border-radius:8px;background:var(--paper);padding:6px 8px;display:flex;flex-direction:column;gap:6px}
.cv-np-t{font-weight:600;line-height:1.3;overflow-wrap:anywhere}
.cv-np .cv-bt{display:flex;flex-wrap:wrap;gap:6px}
.cv-np button{min-height:40px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;cursor:pointer}
.cv-data .cv-inapoi{color:var(--ink2);font-size:.82rem;white-space:nowrap}
.cv-nepuse .cv-gol{color:var(--ink2);font-size:.9rem;align-self:center}
.cv-data{min-height:40px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;cursor:pointer;text-align:left;line-height:1.3;overflow-wrap:anywhere}
.cv-data.ales{outline:3px solid var(--accent);outline-offset:1px}
.cv-tabel{display:grid;grid-template-columns:repeat(var(--cv-n,3),minmax(0,1fr));gap:8px;margin-top:8px}
@media (max-width:640px){.cv-tabel{grid-template-columns:1fr}}
.cv-col{border:2px solid var(--line);border-radius:10px;background:var(--paper2);padding:6px 8px;min-height:64px}
.cv-col-t{font-weight:700;font-size:.95rem;margin-bottom:6px}
.cv-col .cv-item{display:flex;flex-direction:column;gap:4px;margin:0 0 8px}
.cv-col .cv-data{width:100%}
.cv-val{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:.92rem}
.cv-val input{font:inherit;font-size:16px;min-height:38px;width:9em;max-width:100%;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.cv-val.no input{border:2px solid var(--cv-bad)}
.cv-gol-col{color:var(--ink2);font-size:.85rem}
.cv-teste{margin:0;padding-left:1.2em}
.cv-teste li{margin:2px 0}
.cv-teste li.ok{color:var(--cv-ok)}
.cv-teste li.ok::marker{content:'✓ '}
.cv-teste li.no{color:var(--cv-bad)}
.cv-teste li.no::marker{content:'✗ '}
.cv-bara{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.cv-bara button{min-height:40px}
.cv-nota{font-size:.85rem;color:var(--ink2);margin:4px 0}
.cv-cutii{display:flex;flex-wrap:wrap;gap:12px;margin:8px 0;align-items:flex-end}
.cv-cutie{position:relative;display:flex;flex-direction:column;align-items:center;min-width:104px;max-width:150px;padding:0;border:0;background:none;color:var(--ink);font:inherit;cursor:pointer}
.cv-cutie[disabled]{cursor:default}
.cv-et{display:inline-block;max-width:100%;padding:3px 9px;margin-bottom:-2px;border:1px solid var(--cv-cutieL);border-radius:6px 6px 0 0;background:var(--paper);font-weight:700;font-size:.9rem;overflow-wrap:anywhere;position:relative;z-index:1}
.cv-cut{display:flex;align-items:center;justify-content:center;width:100%;min-height:64px;padding:6px;border:3px solid var(--cv-cutieL);border-top-width:6px;border-radius:4px 4px 10px 10px;background:var(--cv-cutie);color:var(--cv-cutieInk);font-family:var(--fm,monospace);font-size:1.6rem;font-weight:700;overflow-wrap:anywhere}
.cv-cut .cv-gola{font-family:inherit;font-size:.85rem;font-weight:400;opacity:.85}
.cv-cutie.nou .cv-cut{animation:cv-puls .9s ease-out 1}
@keyframes cv-puls{0%{box-shadow:0 0 0 0 var(--accent)}100%{box-shadow:0 0 0 12px transparent}}
@media (prefers-reduced-motion:reduce){.cv-cutie.nou .cv-cut{animation:none}}
.cv-cutie.ales .cv-cut{outline:3px solid var(--accent);outline-offset:2px}
.cv-cutie.no .cv-cut{border-color:var(--cv-bad)}
.cv-lacat{font-size:.8rem;color:var(--ink2);margin-top:3px}
.cv-ed{margin:6px 0;padding:8px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 8px 8px 0}
.cv-ed label{display:block;font-weight:700;margin-bottom:4px}
.cv-ed .cv-rand{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.cv-ed input{font:inherit;font-size:16px;min-height:40px;width:8em;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.cv-ed .cv-err{color:var(--cv-bad);font-size:.9rem;margin-top:4px}
.cv-msg{min-height:1.4em;margin:6px 0;padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);line-height:1.4}
.cv-urma{display:flex;flex-direction:column;gap:6px}
.cv-urma .cv-pas{border:1px solid var(--line);border-radius:8px;background:var(--paper2);padding:6px 8px}
.cv-urma .cv-pas-t{font-weight:600;margin-bottom:2px}
.cv-urma .cv-cutii{margin:2px 0;gap:8px}
.cv-urma .cv-cutie{min-width:88px;cursor:default}
.cv-urma .cv-cut{min-height:48px;font-size:1.3rem}
.cv-urma .cv-dispare{font-size:.85rem;color:var(--ink2)}
.cv-static .cv-data{cursor:default}
`;
    document.head.appendChild(st);
  }

  /* ===================== tabelul de analiză ===================== */
  const valText = d => d.v != null ? String(d.v) : (d.val != null ? String(d.val) : '');
  function tabel(P, o) {
    stil();
    o = o || {};
    const col = o.coloane || ['da', 'cere', 'parcurs'];
    const cel = r => P.date.filter(d => d.rol === r).map(d => `<div class="cv-item"><span class="cv-data">${esc(d.t)}${o.valori === false ? '' : `: <b>${esc(valText(d))}</b>`}</span></div>`).join('') || '<span class="cv-gol-col">nimic</span>';
    return `<div class="cv cv-static">${P.nume ? `<div class="cv-nume">${esc(P.nume)}</div>` : ''}${P.enunt ? `<p class="cv-enunt">${P.enunt}</p>` : ''}${P.pasi && o.pasi !== false ? `<ol class="cv-alg">${P.pasi.map(x => `<li>${x}</li>`).join('')}</ol>` : ''}<div class="cv-tabel" style="--cv-n:${col.length}" role="table" aria-label="Tabelul de analiză">${col.map(r => `<div class="cv-col" role="cell"><div class="cv-col-t">${ROLURI[r]}</div>${cel(r)}</div>`).join('')}</div></div>`;
  }

  /* ===================== algoritmul cu cutii ===================== */
  function start(C) { const s = {}; C.cutii.forEach(c => { s[c.n] = c.v != null ? c.v : null; }); return s; }
  function pasCutii(C, s, p) {
    const s2 = Object.assign({}, s);
    Object.keys(p.pune || {}).forEach(n => {
      const c = C.cutii.find(x => x.n === n);
      if (c && c.c) return;   // constanta nu primește altă valoare
      const x = p.pune[n]; s2[n] = typeof x === 'function' ? x(s) : x;
    });
    return s2;
  }
  function ruleaza(C) { let s = start(C); C.pasi.forEach(p => { s = pasCutii(C, s, p); }); return {cutii: s}; }
  function htmlCutie(c, v, o) {
    o = o || {};
    const tag = o.static ? 'div' : 'button';
    const atr = o.static ? '' : ` type="button" data-cutie="${esc(c.n)}" aria-label="Cutia ${esc(c.n)}${c.c ? ', constantă' : ''}: ${v == null ? 'goală' : esc(v)}.${c.c ? '' : ' Atinge ca să pui o valoare.'}"`;
    return `<${tag} class="cv-cutie${o.cls ? ' ' + o.cls : ''}"${atr}><span class="cv-et">${c.c ? '🔒 ' : ''}${esc(c.n)}</span><span class="cv-cut">${v == null ? '<span class="cv-gola">goală</span>' : esc(v)}</span>${c.c ? '<span class="cv-lacat">constantă</span>' : ''}</${tag}>`;
  }
  /* urma statică: după fiecare pas, cutiile; o valoare înlocuită e spusă („5 a dispărut”) */
  function urma(C, o) {
    stil();
    o = o || {};
    let s = start(C);
    const rand = [];
    if (o.inceput) rand.push(`<div class="cv-pas"><div class="cv-pas-t">La început:</div><div class="cv-cutii">${C.cutii.map(c => htmlCutie(c, s[c.n], {static: true})).join('')}</div></div>`);
    C.pasi.forEach((p, i) => {
      const s2 = pasCutii(C, s, p);
      const disp = C.cutii.filter(c => s[c.n] != null && s2[c.n] !== s[c.n]).map(c => `în «${esc(c.n)}», ${esc(s[c.n])} a dispărut`);
      rand.push(`<div class="cv-pas"><div class="cv-pas-t">După pasul ${i + 1}: <span style="font-weight:400">${esc(p.t)}</span></div><div class="cv-cutii">${C.cutii.map(c => htmlCutie(c, s2[c.n], {static: true, cls: s2[c.n] !== s[c.n] ? 'nou' : ''})).join('')}</div>${disp.length ? `<div class="cv-dispare">(${disp.join('; ')})</div>` : ''}</div>`);
      s = s2;
    });
    return `<div class="cv cv-static cv-urma">${rand.join('')}</div>`;
  }

  /* focusul după un „Verifică” corect: butonul următor al motorului (regula 14) */
  const focUrmator = () => setTimeout(() => { const bb = ['inca', 'pas-next', 'go', 'next'].map(i => document.getElementById(i)).find(e => e && e.offsetParent !== null && !e.disabled); if (bb) bb.focus({preventScroll: true}); }, 0);
  const anunta = (tip, bune, total) => { try { window.dispatchEvent(new CustomEvent('cutii-variabile', {detail: {tip, bune, total, ok: bune === total}})); } catch (e) { /* fără eveniment */ } };

  /* ===================== tipul „date-rol” ===================== */
  function colDe(Q) { return Q.coloane || ['da', 'cere', 'parcurs']; }
  const cuValoare = (Q, r) => r === 'cere' || (r === 'parcurs' && colDe(Q).includes('parcurs'));
  function testeazaDate(Q, st, t) {
    const pi = t.p || 0, P = Q.probleme[pi], pre = Q.probleme.length > 1 ? `Problema ${pi + 1}: ` : '';
    const loc = st.loc[pi], val = st.val[pi];
    const nepuse = P.date.map((d, i) => loc[i] ? -1 : i).filter(i => i >= 0);
    if (t.k === 'coloane') {
      if (nepuse.length) return {ok: false, m: `${pre}mai ai ${nepuse.length === 1 ? 'o dată nepusă' : nepuse.length + ' date nepuse'} în tabel (${nepuse.map(i => '«' + P.date[i].t + '»').join(', ')}). ${nepuse.length === 1 ? 'Sub ea' : 'Sub fiecare'}, atinge butonul coloanei ei.`};
      const rau = P.date.findIndex((d, i) => loc[i] !== d.rol);
      if (rau >= 0) {
        const intreb = colDe(Q).length === 2 ? 'E scrisă în enunț sau e întrebarea problemei?' : 'E scrisă în enunț, e întrebarea problemei sau o afli la un pas al algoritmului, ca să ajungi la răspuns?';
        return {ok: false, m: `${pre}«${P.date[rau].t}» nu e în coloana bună. ${intreb}`, i: rau};
      }
      return {ok: true};
    }
    if (t.k === 'valori') {
      const deScris = P.date.map((d, i) => cuValoare(Q, d.rol) ? i : -1).filter(i => i >= 0);
      for (const i of deScris) {
        const d = P.date[i];
        if (loc[i] !== d.rol) return {ok: false, m: `${pre}pune întâi «${d.t}» în coloana ei; apoi scrii cât e.`, i};
        const r = numar(val[i]);
        if (!r.ok) {
          if (r.motiv === 'gol') return {ok: false, m: `${pre}scrie cât e «${d.t}».`, i};
          if (r.motiv === 'multe') return {ok: false, m: `${pre}la «${d.t}» ai scris mai multe numere („${val[i]}”). Scrie un singur număr: cât e.`, i};
          if (r.motiv === 'zecimal') return {ok: false, m: `${pre}la «${d.t}» ai scris „${val[i]}”. Aici numerele sunt fără virgulă și fără punct: refă socoteala și scrie rezultatul doar cu cifre.`, i};
          if (r.motiv === 'minus') return {ok: false, m: `${pre}la «${d.t}» ai scris „${val[i]}”. Aici numerele sunt fără semnul minus în față: refă socoteala și scrie rezultatul fără minus.`, i};
          return {ok: false, m: `${pre}la «${d.t}» nu înțeleg „${val[i]}”. Scrie un număr, de exemplu cu cifre.`, i};
        }
        if (r.v !== d.val) return {ok: false, m: `${pre}«${d.t}» nu e ${nrRo(r.v)}. Refă socoteala${d.pas != null ? ` de la pasul ${d.pas + 1} al algoritmului` : ''}.`, i};
      }
      return {ok: true};
    }
    return {ok: false, m: 'Test necunoscut.'};
  }
  const DATE = {
    render(Q, body, api) {
      stil();
      const col = colDe(Q), probs = Q.probleme;
      const st = {tab: 0, ales: -1, loc: probs.map(P => P.date.map(() => null)), val: probs.map(P => P.date.map(() => '')), verificat: false, rele: {}, gata: false, nota: ''};
      /* după o schimbare: mesajul vechi al verificării pleacă, bifele se refac pe starea de acum */
      const proaspat = () => { if (!st.verificat || api.done()) return; const fb = document.getElementById('fb'); if (fb) fb.innerHTML = ''; marcheaza(); };
      body._cvd = {Q, st};
      const draw = foc => {
        const P = probs[st.tab], loc = st.loc[st.tab], val = st.val[st.tab];
        const file = probs.length > 1 ? `<div class="cv-file" role="tablist" aria-label="Problemele">${probs.map((x, k) => {
          const stare = st.verificat ? (Q.teste.filter(t => (t.p || 0) === k).every(t => testeazaDate(Q, st, t).ok) ? ' ok' : ' no') : '';
          return `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === st.tab}" class="${k === st.tab ? 'on' : ''}${stare}">Problema ${k + 1}</button>`;
        }).join('')}</div>` : '';
        /* o dată din tabel: o atingere o întoarce sus, la datele nepuse */
        const buton = i => `<button type="button" class="cv-data" data-d="${i}" data-scoate="1" aria-label="${esc(P.date[i].t)}. Atinge ca s-o scoți din coloană.">${esc(P.date[i].t)} <span class="cv-inapoi">↩</span></button>`;
        /* o dată nepusă: textul ei și, dedesubt, câte un buton pentru fiecare coloană (o singură atingere) */
        const nepuse = P.date.map((d, i) => loc[i] ? '' : `<div class="cv-np"><div class="cv-np-t">${esc(d.t)}</div><div class="cv-bt" role="group" aria-label="Unde pui: ${esc(d.t)}">${col.map(r => `<button type="button" data-d="${i}" data-rol="${r}" aria-label="${esc(d.t)}: în coloana ${ROLURI[r]}">${SCURT[r]}</button>`).join('')}</div></div>`).join('');
        const coloana = r => {
          const ii = P.date.map((d, i) => loc[i] === r ? i : -1).filter(i => i >= 0);
          return `<div class="cv-col" data-col="${r}"><div class="cv-col-t">${ROLURI[r]}</div>${ii.map(i => `<div class="cv-item">${buton(i)}${cuValoare(Q, r) ? `<label class="cv-val${st.rele[st.tab + ':' + i] ? ' no' : ''}">Cât e: <input type="text" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-v="${i}" value="${esc(val[i])}"${st.gata ? ' readonly' : ''} aria-label="Cât e ${esc(P.date[i].t)}"></label>` : ''}</div>`).join('') || '<span class="cv-gol-col">nimic încă</span>'}</div>`;
        };
        body.innerHTML = `<div class="cv">${file}<div class="cv-card">
          ${P.nume ? `<div class="cv-nume">${probs.length > 1 ? `Problema ${st.tab + 1}: ` : ''}${esc(P.nume)}</div>` : ''}
          <p class="cv-enunt">${P.enunt}</p>${P.pasi ? `<div class="cv-lbl2">Algoritmul:</div><ol class="cv-alg">${P.pasi.map(x => `<li>${x}</li>`).join('')}</ol>` : ''}
          <div class="cv-lbl">Datele: sub fiecare, atinge coloana ei</div>
          <div class="cv-nepuse">${nepuse || '<span class="cv-gol">Toate datele sunt în tabel. Una e greșit pusă? Atinge-o în tabel: se întoarce aici.</span>'}</div>
          <div class="cv-tabel" style="--cv-n:${col.length}">${col.map(coloana).join('')}</div>
          <div class="cv-bara"><button type="button" class="btn ghost" data-x="capat">Ia-o de la capăt</button>${probs.length > 1 && st.tab < probs.length - 1 ? `<button type="button" class="btn" data-tab="${st.tab + 1}">Problema ${st.tab + 2} →</button>` : ''}</div>
          <p class="cv-nota" data-x="nota" aria-live="polite">${esc(st.nota)}</p></div>
          <div class="cv-lbl">Testele</div><ul class="cv-teste">${Q.teste.map((t, k) => `<li data-t="${k}">${esc(t.ce || 'Testul ' + (k + 1))}</li>`).join('')}</ul>
          ${probs.length > 1 ? '<p class="cv-nota">„Ia-o de la capăt” golește doar tabelul problemei deschise.</p>' : ''}</div>`;
        if (st.verificat) marcheaza();
        if (foc) { const e = body.querySelector(foc); if (e) e.focus({preventScroll: true}); }
      };
      body._draw = draw;
      const marcheaza = () => {
        let bune = 0; const motive = [];
        Q.teste.forEach((t, k) => {
          const r = testeazaDate(Q, st, t), li = body.querySelector(`li[data-t="${k}"]`);
          if (r.ok) bune++; else motive.push(r.m);
          if (li) li.className = r.ok ? 'ok' : 'no';
        });
        body.querySelectorAll('.cv-file button[data-tab]').forEach(fb => { const k = +fb.dataset.tab; const ok = Q.teste.filter(t => (t.p || 0) === k).every(t => testeazaDate(Q, st, t).ok); fb.classList.toggle('ok', ok); fb.classList.toggle('no', !ok); });
        return {bune, motive};
      };
      if (body._cvClick) body.removeEventListener('click', body._cvClick);
      body._cvClick = ev => {
        const b = ev.target.closest('button'), inBody = !!b && body.contains(b);
        /* după „Corect”: doar filele și „Ia-o de la capăt”; orice altă atingere spune de ce nu se schimbă nimic (1.1) */
        if (st.gata && !(inBody && (b.dataset.tab != null || b.dataset.x === 'capat'))) {
          if (inBody || (ev.target.closest && ev.target.closest('input[data-v]'))) { st.nota = NOTA_GATA; const n = body.querySelector('[data-x="nota"]'); if (n) n.textContent = st.nota; }
          return;
        }
        if (!inBody) return;
        const loc = st.loc[st.tab];
        if (b.dataset.x !== 'capat') st.nota = '';
        if (b.dataset.tab != null) { st.tab = +b.dataset.tab; st.ales = -1; draw(`[data-tab="${st.tab}"]`); return; }
        if (b.dataset.d != null && b.dataset.rol != null) {   // o atingere: data merge în coloana aleasă
          const i = +b.dataset.d; loc[i] = b.dataset.rol; delete st.rele[st.tab + ':' + i];
          const urm = P0 => { const k = P0.date.findIndex((d, j) => !loc[j]); return k >= 0 ? `.cv-np button[data-d="${k}"]` : '[data-x="capat"]'; };
          draw(cuValoare(Q, loc[i]) ? `input[data-v="${i}"]` : urm(probs[st.tab])); proaspat(); return;
        }
        if (b.dataset.scoate) {   // din tabel înapoi, sus
          const i = +b.dataset.d; loc[i] = null; delete st.rele[st.tab + ':' + i];
          draw(`.cv-np button[data-d="${i}"]`); proaspat(); return;
        }
        if (b.dataset.x === 'capat') {
          /* 1.1: după „Corect”, reluarea e doar exersare: fără ✗ la teste până la noul „Verifică”, cu nota care o spune */
          if (st.gata) { st.verificat = false; st.nota = NOTA_DIN_NOU; } else st.nota = '';
          st.loc[st.tab] = probs[st.tab].date.map(() => null); st.val[st.tab] = probs[st.tab].date.map(() => ''); st.ales = -1; st.rele = {}; st.gata = false;
          draw('[data-x="capat"]'); proaspat();
        }
      };
      body.addEventListener('click', body._cvClick);
      if (body._cvInput) body.removeEventListener('input', body._cvInput);
      body._cvInput = ev => { const t = ev.target; if (st.gata) return; if (t && t.dataset && t.dataset.v != null) { st.val[st.tab][+t.dataset.v] = t.value; t.closest('.cv-val').classList.remove('no'); delete st.rele[st.tab + ':' + t.dataset.v]; proaspat(); } };
      body.addEventListener('input', body._cvInput);
      if (body._cvKey) body.removeEventListener('keydown', body._cvKey);
      body._cvKey = ev => {
        const t = ev.target;
        if (ev.key === 'Enter' && t && t.dataset && t.dataset.v != null) { ev.preventDefault(); const n = body.querySelector('[data-x="nota"]'); if (n) n.textContent = 'Apasă Verifică când ești gata.'; }
        if (ev.key === 'Escape' && st.ales >= 0) { const i = st.ales; st.ales = -1; draw(`[data-d="${i}"]`); ev.preventDefault(); }
      };
      body.addEventListener('keydown', body._cvKey);
      draw();
      const nav = api.checkButton(() => {
        st.verificat = true; st.ales = -1; st.rele = {};
        Q.teste.forEach(t => { if (t.k === 'valori') { const r = testeazaDate(Q, st, t); if (!r.ok && r.i != null) st.rele[(t.p || 0) + ':' + r.i] = true; } });
        draw();
        const {bune, motive} = marcheaza(), total = Q.teste.length;
        anunta('date-rol', bune, total);
        if (bune === total) { st.gata = true; draw(); nav.innerHTML = ''; api.resolve(true); focUrmator(); }
        else {
          const m0 = motive[0] || '';
          api.resolve(false, `${bune} din ${total} teste trec. ${esc(m0.charAt(0).toUpperCase() + m0.slice(1))}`);
          api.revealButton(() => { DATE.rezolva(Q, body); st.gata = true; body._draw(); nav.innerHTML = ''; api.giveUp('fiecare dată e acum în coloana ei, cu numerele aflate.'); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) {
      const d = body._cvd; if (!d) return;
      d.Q.probleme.forEach((P, k) => { d.st.loc[k] = P.date.map(x => x.rol); d.st.val[k] = P.date.map(x => x.val != null ? String(x.val) : ''); });
      d.st.ales = -1; d.st.rele = {};
      body._draw();
    },
    gresit(Q, body) {
      const d = body._cvd; if (!d) return;
      DATE.rezolva(Q, body);
      const g = Q.gresit || {p: 0, id: d.Q.probleme[0].date.findIndex(x => x.rol === 'parcurs'), rol: 'cere'};
      if (g.id >= 0) d.st.loc[g.p || 0][g.id] = g.rol;
      if (g.val != null) d.st.val[g.p || 0][g.id] = String(g.val);
      body._draw();
    }
  };

  /* ===================== tipul „cutii” ===================== */
  function testeazaCutii(Q, st, t, tinta) {
    if (t.k !== 'cutie') return {ok: false, m: 'Test necunoscut.'};
    const v = st.s[t.n], ok = v === tinta[t.n];
    if (ok) return {ok: true};
    if (v == null) return {ok: false, m: `Cutia «${t.n}» e încă goală. Care pas pune ceva în ea?`, n: t.n};
    return {ok: false, m: `În cutia «${t.n}» e ${v}. Uită-te din nou la pașii care pun ceva în ea; contează ce e în cutii în momentul acela.`, n: t.n};
  }
  const CUTII = {
    render(Q, body, api) {
      stil();
      const tinta = ruleaza(Q).cutii;
      const st = {s: start(Q), ales: null, msg: '', nou: null, verificat: false, err: '', gata: false};
      const proaspat = () => { if (!st.verificat || api.done()) return; const fb = document.getElementById('fb'); if (fb) fb.innerHTML = ''; marcheaza(); };
      body._cvc = {Q, st};
      const draw = foc => {
        const cutii = Q.cutii.map(c => htmlCutie(c, st.s[c.n], {cls: [st.ales === c.n ? 'ales' : '', st.nou === c.n ? 'nou' : ''].filter(Boolean).join(' ')})).join('');
        const c = st.ales ? Q.cutii.find(x => x.n === st.ales) : null;
        const ed = c ? `<div class="cv-ed"><label for="cv-in">Ce pui în cutia «${esc(c.n)}»?</label><div class="cv-rand"><input id="cv-in" type="text" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="cv-err"><button type="button" class="btn" data-x="pune">Pune</button><button type="button" class="btn ghost" data-x="renunta">Renunță</button></div><div class="cv-err" id="cv-err" aria-live="polite">${esc(st.err)}</div></div>` : '';
        body.innerHTML = `<div class="cv"><div class="cv-card">
          <div class="cv-lbl2">Algoritmul (tu ești executantul):</div><ol class="cv-alg">${Q.pasi.map(p => `<li>${esc(p.t)}</li>`).join('')}</ol>
          <div class="cv-lbl2">Cutiile: atinge una ca să pui în ea o valoare.</div>
          <div class="cv-cutii">${cutii}</div>${ed}
          <div class="cv-msg" aria-live="polite">${st.msg || 'Fă pașii pe rând, în ordine.'}</div>
          <div class="cv-bara"><button type="button" class="btn ghost" data-x="capat">Ia-o de la capăt</button></div></div>
          <div class="cv-lbl">Testele</div><ul class="cv-teste">${Q.teste.map((t, k) => `<li data-t="${k}">${esc(t.ce || 'Testul ' + (k + 1))}</li>`).join('')}</ul></div>`;
        if (st.verificat) marcheaza();
        if (foc) { const e = body.querySelector(foc); if (e) e.focus({preventScroll: true}); }
      };
      body._draw = draw;
      const marcheaza = () => {
        let bune = 0; const motive = [];
        Q.teste.forEach((t, k) => {
          const r = testeazaCutii(Q, st, t, tinta), li = body.querySelector(`li[data-t="${k}"]`);
          if (r.ok) bune++; else motive.push(r.m);
          if (li) li.className = r.ok ? 'ok' : 'no';
        });
        return {bune, motive};
      };
      const pune = () => {
        const inp = body.querySelector('#cv-in'), n = st.ales;
        if (!inp || !n) return;
        const r = numar(inp.value);
        if (!r.ok) {
          st.err = r.motiv === 'gol' ? 'Scrie întâi un număr.' : r.motiv === 'multe' ? 'O cutie ține o singură valoare: scrie un singur număr.'
            : r.motiv === 'zecimal' ? 'Numerele din pași sunt fără virgulă și fără punct: scrie numărul doar cu cifre.'
            : r.motiv === 'minus' ? 'Numerele din pași sunt fără semnul minus în față: scrie numărul fără minus.'
            : `Nu înțeleg „${inp.value}”. Scrie un număr, de exemplu cu cifre.`;
          const e = body.querySelector('#cv-err'); if (e) e.textContent = st.err;
          inp.focus(); return;
        }
        const vechi = st.s[n];
        st.s[n] = r.v; st.err = ''; st.ales = null; st.nou = n;
        st.msg = vechi == null ? `În cutia «${esc(n)}» e acum <b>${r.v}</b>.` : vechi === r.v ? `În cutia «${esc(n)}» era deja <b>${r.v}</b>; a rămas ${r.v}.` : `În cutia «${esc(n)}» era ${vechi}. Acum e <b>${r.v}</b>: ${vechi} a dispărut.`;
        draw(`[data-cutie="${CSS.escape(n)}"]`); proaspat();
        setTimeout(() => { st.nou = null; }, 50);
      };
      if (body._cvClick) body.removeEventListener('click', body._cvClick);
      body._cvClick = ev => {
        const b = ev.target.closest('button');
        if (!b || !body.contains(b)) return;
        if (st.gata && b.dataset.x !== 'capat') {   // după „Corect”: doar „Ia-o de la capăt”; atingerea spune de ce (1.1)
          st.msg = esc(NOTA_GATA); draw(b.dataset.cutie != null ? `[data-cutie="${CSS.escape(b.dataset.cutie)}"]` : null); return;
        }
        if (b.dataset.cutie != null) {
          const c = Q.cutii.find(x => x.n === b.dataset.cutie);
          if (c && c.c) { st.ales = null; st.msg = `«${esc(c.n)}» e o constantă: are mereu ${esc(st.s[c.n])}. Nu pui nimic în ea.`; draw(`[data-cutie="${CSS.escape(c.n)}"]`); return; }
          st.ales = st.ales === b.dataset.cutie ? null : b.dataset.cutie; st.err = '';
          draw(st.ales ? '#cv-in' : `[data-cutie="${CSS.escape(b.dataset.cutie)}"]`); return;
        }
        if (b.dataset.x === 'pune') { pune(); return; }
        if (b.dataset.x === 'renunta') { const n = st.ales; st.ales = null; st.err = ''; draw(n ? `[data-cutie="${CSS.escape(n)}"]` : null); return; }
        if (b.dataset.x === 'capat') {
          const reluare = st.gata; if (reluare) st.verificat = false;   // 1.1: după „Corect”, fără ✗ până la noul „Verifică”
          st.s = start(Q); st.ales = null; st.err = ''; st.gata = false; st.msg = 'Cutiile sunt ca la început.' + (reluare ? ' ' + esc(NOTA_DIN_NOU) : '');
          draw('[data-x="capat"]'); proaspat();
        }
      };
      body.addEventListener('click', body._cvClick);
      if (body._cvKey) body.removeEventListener('keydown', body._cvKey);
      body._cvKey = ev => {
        if (ev.target && ev.target.id === 'cv-in' && ev.key === 'Enter') { ev.preventDefault(); pune(); return; }
        if (ev.key === 'Escape' && st.ales) { const n = st.ales; st.ales = null; st.err = ''; draw(`[data-cutie="${CSS.escape(n)}"]`); ev.preventDefault(); }
      };
      body.addEventListener('keydown', body._cvKey);
      draw();
      const nav = api.checkButton(() => {
        st.verificat = true; st.ales = null; st.err = '';
        draw();
        const {bune, motive} = marcheaza(), total = Q.teste.length;
        body.querySelectorAll('.cv-cutie').forEach(e => { const t = Q.teste.find(x => x.n === e.dataset.cutie); if (t && !testeazaCutii(Q, st, t, tinta).ok) e.classList.add('no'); });
        anunta('cutii', bune, total);
        if (bune === total) { st.gata = true; nav.innerHTML = ''; api.resolve(true); focUrmator(); }
        else {
          const m0 = motive[0] || '';
          api.resolve(false, `${bune} din ${total} teste trec. ${esc(m0.charAt(0).toUpperCase() + m0.slice(1))}`);
          api.revealButton(() => { CUTII.rezolva(Q, body); st.gata = true; nav.innerHTML = ''; api.giveUp('cutiile au acum valorile de la sfârșitul algoritmului.'); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) {
      const d = body._cvc; if (!d) return;
      d.st.s = ruleaza(d.Q).cutii; d.st.ales = null; d.st.err = ''; d.st.msg = 'Cutiile au valorile de după ultimul pas.';
      body._draw();
    },
    gresit(Q, body) {
      const d = body._cvc; if (!d) return;
      d.st.s = Object.assign(ruleaza(d.Q).cutii, d.Q.gresit || {}); d.st.ales = null; d.st.err = '';
      body._draw();
    }
  };

  window.CutiiVariabile = {
    versiune: VERSIUNE, ROLURI, numar, tabel, urma, ruleaza,
    tipuri: {'date-rol': DATE, cutii: CUTII},
    _intern: {esc, stil, testeazaDate, testeazaCutii, cuvinte, calcul}
  };
})();
