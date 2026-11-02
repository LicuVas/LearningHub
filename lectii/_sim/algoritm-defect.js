/* lectii/_sim/algoritm-defect.js — „Algoritmul defect”: un EXECUTANT în pagină face EXACT ce scrie un algoritm în
   cuvinte (limbaj natural). Elevul vede ce se întâmplă când un pas se poate face în mai multe feluri (executantul nu știe
   ce să aleagă și se oprește), când un pas nu spune când să se termine (executantul nu se mai oprește: pagina îl oprește
   ea, după 40 de faceri, și spune de ce) și când algoritmul merge doar pentru un caz (executantul îl încearcă pe mai multe
   cazuri de același fel). Elevul repară algoritmul schimbând pasul defect cu o variantă din listă; testele judecă
   algoritmul REPARAT, EXECUTAT (ce face executantul), nu cuvintele alese.

   PROPRIETAR: lecția V/25 (lectii/v/m4-l25, „Proprietățile algoritmilor: claritate, finitudine, generalitate”),
   01-02.11.2026. Lecțiile următoare îl pot încărca întreg, NEMODIFICAT; ce le lipsește fac într-un fișier NOU
   (`lectii/_sim/algoritm-defect-<ceva>.js`), prin `AlgoritmDefect.scena(...)` sau scriind algoritmi noi în pagina lor.
   Nu depinde de niciun alt simulator (nici de `executant.js` al lecției V/24).

   FIDELITATE (nu simulează o aplicație; e un „executant” inventat, ca robotul din clasă):
     - „PAS” și „FACERE” (de la 1.1): un pas = un rând scris al algoritmului; o facere = o dată când executantul face un
       pas (un pas „de 10 ori” = 10 faceri). Executantul numără facerile.
     - REGULA PAGINII, nu un fapt despre calculatoare: după MAX_PASI = 40 de FACERI, PAGINA oprește executantul și o spune
       EA, sub bula lui (`.ad-pagina`), cu numărătoarea adevărată: „Pagina a oprit executantul după 40 de faceri: o dată
       pasul 1 și de 39 de ori pasul 2. …” (până la 1.1: „Am oprit eu executantul…”, în bulă — judecata 1, J1-A/J1-M:
       părea că robotul se oprește singur). Aceeași voce ca la V/24 („Pagina a oprit robotul…”). Un algoritm care ar avea
       nevoie de mai mult de 40 de faceri nu apare în lecție.
     - REGULA PAGINII: un pas „neclar” (scris cu cuvinte care se pot înțelege în mai multe feluri: puțin, câteva, cât
       trebuie, „X sau Y”) îl oprește pe executant; pagina arată câteva înțelesuri posibile (nu pe toate).
     - Cazurile (pentru generalitate) sunt INVENTATE de pagina care folosește simulatorul; executantul încearcă
       algoritmul pe fiecare, cu aceiași pași.
     - Nimic nu se salvează și nimic nu pleacă: 0 scrieri în localStorage / sessionStorage / cookie, 0 cereri.

   API PUBLIC (window.AlgoritmDefect):
     versiune                     '1.1 (02.11.2026)'
     MAX_PASI                     40 (faceri; numele constantei rămâne)
     ruleaza(A, alese, caz)       -> {oprit:null|'neclar'|'prea_multi', pas, pasi (= facerile), s, jurnal:[{i,s}], variante?,
                                     intrebare?}   A = algoritmul (vezi mai jos), alese = [indicele variantei pe fiecare pas]
     judeca(A, alese)             -> {clar, opreste, cazuri:[{caz, ok, are, astept}], toate, r (rularea pe primul caz),
                                     pasNeclar, pasFaraSfarsit}   (clar/opreste = null când nu se pot afla: opreste = null
                                     după un pas neclar; de la 1.1, clar = null după un pas fără sfârșit urmat de alți pași,
                                     la care executantul n-a ajuns; testul arată atunci „?”, nu ✓)
     imagine(A, {alese?, caz?, titlu?}) -> HTML static: pașii + ce a făcut executantul (pentru „Uite cum”, fără butoane)
     pune(s, eticheta, valoare)   ajutor pentru pagini: pune / schimbă un lucru pe „masă” (s.masa)
     scrie(s, text)               ajutor: scrie pe „tablă” (s.tabla)
     nr(n, cuvant)                „5 găini”, „20 de lei” (cu „de” de la 20 în sus, ca în română)
     scena(nume, fn)              EXTINDERE: un desen în plus pentru starea s (fn(s) -> HTML), ales cu A.scena = nume
     PROPRIETATI                  {claritate:'Claritatea', finitudine:'Finitudinea', generalitate:'Generalitatea'}
     tipuri.defect                {render, rezolva, gresit} pentru JocMotor (`tipuri:{defect:AlgoritmDefect.tipuri.defect}`)

   ALGORITMUL A:
     {nume, cerinta?, scena?, masaTitlu?, tablaTitlu?, start(caz) -> s, cazuri?:[{nume, …}], descrieCaz?(caz) -> text,
      pasi:[{v:[varianta, …], ales?:0}], tinta?(caz, s) -> {ok, are, astept}, lipsa?:'claritate'|'finitudine'|'generalitate',
      sol:[indici], gresit:[indici]}
     Starea s: {masa:[[eticheta, valoare]…], tabla:[texte], spune:'', loc:'', gaini?:n, …} (doar ce folosește pagina).
     Varianta unui pas: {t:'textul pasului', fa?(s, caz, k), de?:n | (s, caz) => n, mereu?:true,
       neclar?:['înțeles 1', 'înțeles 2', …], intrebare?:'Câte lingurițe?'}
       - fa se face o dată (sau de `de` ori, k = 0, 1, …); fiecare facere = un pas al executantului;
       - mereu:true = pasul nu spune când să se oprească: fa se face până la MAX_PASI, apoi oprit:'prea_multi';
       - neclar = pasul se poate face în mai multe feluri: executantul se oprește (oprit:'neclar').

   TIPUL „defect” (pentru JocMotor):
     {t:'defect', q, algoritme:[A, …], intreabaLipsa?:bool, teste:[{k, alg?, ce}], ajutor, why, inca?}
     k = 'clar' (niciun pas nu-l oprește nedumerit) · 'opreste' (se termină în cel mult 40 de faceri) · 'cazuri' (la fiecare
     caz, tinta e atinsă) · 'tinta' (la primul caz) · 'lipsa' (elevul a ales ce lipsește: A.lipsa) · 'merge' (clar +
     opreste + cazuri, pentru atelierul cu mai mulți algoritmi). Testele se bifează la „Verifică” (înainte, doar numele).
     Mai mulți algoritmi = file „Algoritmul 1, 2, …”. „Ia-o de la capăt” pune înapoi DOAR algoritmul din fila deschisă.
     În lista de variante a unui pas schimbat, varianta de la pornire are „(la început)”. Escape închide lista deschisă.
     După un „Verifică” corect, focusul trece pe „Încă un exercițiu” / „Pasul următor” / butonul motorului (regula 14).
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('algoritm-defect', {detail:{bune, total, ok}}).

   CE NU SE SCHIMBĂ (lecțiile următoare se sprijină pe ele): numele testelor (k), forma lui A și a variantelor,
   MAX_PASI = 40 de faceri și vocea opririi (PAGINA, sub bulă: „Pagina a oprit executantul după 40 de faceri: …”),
   clasele CSS cu prefixul `ad-`, id-ul stilului `ad-css`, regula „nimic nu se salvează, nimic nu pleacă”.
   SCHIMBĂRI: 1.1 (02.11.2026, reparația după judecata 1 a lecției V/25) — vocea și numărătoarea opririi, „Gata!” cu pași
   scriși + faceri, clar = null după un pas fără sfârșit, „(la început)”, Escape, focusul după „Verifică”, mesajul testului
   „lipsa” când algoritmul e deja schimbat. API-ul (funcțiile, A, testele, evenimentul) neschimbat.
   Tot 1.1 — trecerea după judecata 2 (02.11.2026, doar texte, codul neschimbat): „Gata!” fără „faceri” („Gata! Am făcut
   toți cei 4 pași; pasul 4, de 5 ori.”; „faceri” se explică abia la P3) și rândul paginii fără „Altfel, ar fi continuat
   la nesfârșit.”.
*/
(function () {
  'use strict';
  const VERSIUNE = '1.1 (02.11.2026)';
  const MAX_PASI = 40;
  const PROPRIETATI = {claritate: 'Claritatea', finitudine: 'Finitudinea', generalitate: 'Generalitatea'};
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const SCENE = {};

  /* ===================== ajutoare pentru pagini ===================== */
  function nr(n, cuvant) {
    const r = Math.abs(n) % 100;
    return `${n} ${(n === 0 || r >= 20 || (Math.abs(n) >= 100 && r === 0)) ? 'de ' : ''}${cuvant}`;
  }
  function pune(s, et, val) {
    if (!s.masa) s.masa = [];
    const x = s.masa.find(m => m[0] === et);
    if (x) x[1] = val; else s.masa.push([et, val]);
  }
  function scrie(s, text) { if (!s.tabla) s.tabla = []; s.tabla.push(String(text)); }
  const copie = o => JSON.parse(JSON.stringify(o));

  /* ===================== execuția ===================== */
  function cazuriDe(A) { return A.cazuri && A.cazuri.length ? A.cazuri : [{}]; }
  function ruleaza(A, alese, caz) {
    caz = caz || cazuriDe(A)[0];
    const s = copie(A.start ? A.start(caz) : {});
    const jurnal = [{i: -1, s: copie(s)}];
    let pasi = 0;
    for (let i = 0; i < A.pasi.length; i++) {
      const v = A.pasi[i].v[alese[i] == null ? (A.pasi[i].ales || 0) : alese[i]];
      if (v.neclar) {
        jurnal.push({i, s: copie(s), neclar: true});
        return {oprit: 'neclar', pas: i, pasi, s, jurnal, variante: v.neclar.slice(), intrebare: v.intrebare || ''};
      }
      if (v.mereu) {
        let k = 0;
        while (pasi < MAX_PASI) { if (v.fa) v.fa(s, caz, k); k++; pasi++; jurnal.push({i, s: copie(s)}); }
        return {oprit: 'prea_multi', pas: i, pasi, s, jurnal};
      }
      const n = v.de == null ? 1 : (typeof v.de === 'function' ? v.de(s, caz) : v.de);
      for (let k = 0; k < n; k++) {
        if (pasi >= MAX_PASI) return {oprit: 'prea_multi', pas: i, pasi, s, jurnal};
        if (v.fa) v.fa(s, caz, k);
        pasi++; jurnal.push({i, s: copie(s)});
      }
    }
    return {oprit: null, pas: A.pasi.length - 1, pasi, s, jurnal};
  }
  function judeca(A, alese) {
    const cz = cazuriDe(A);
    const r = ruleaza(A, alese, cz[0]);
    const out = {r, clar: true, opreste: true, cazuri: [], toate: false, pasNeclar: -1, pasFaraSfarsit: -1};
    if (r.oprit === 'neclar') { out.clar = false; out.opreste = null; out.pasNeclar = r.pas; return out; }
    /* un pas fără sfârșit: executantul n-a ajuns la pașii de după, deci nu se poate afla dacă sunt clari (1.1; înainte: ✓ fals) */
    if (r.oprit === 'prea_multi') { out.opreste = false; out.pasFaraSfarsit = r.pas; if (r.pas < A.pasi.length - 1) out.clar = null; return out; }
    out.cazuri = cz.map(caz => {
      const rr = caz === cz[0] ? r : ruleaza(A, alese, caz);
      if (rr.oprit === 'neclar') { out.clar = false; if (out.pasNeclar < 0) out.pasNeclar = rr.pas; return {caz, ok: false, are: 'nu știe ce să aleagă', astept: ''}; }
      if (rr.oprit === 'prea_multi') { out.opreste = false; if (out.pasFaraSfarsit < 0) out.pasFaraSfarsit = rr.pas; if (out.clar === true && rr.pas < A.pasi.length - 1) out.clar = null; return {caz, ok: false, are: 'nu se oprește', astept: ''}; }
      const t = A.tinta ? A.tinta(caz, rr.s) : {ok: true, are: '', astept: ''};
      return {caz, ok: !!t.ok, are: t.are || '', astept: t.astept || ''};
    });
    out.toate = out.clar && out.opreste && out.cazuri.every(c => c.ok);
    return out;
  }

  /* ===================== desenul ===================== */
  function stil() {
    if (document.getElementById('ad-css')) return;
    const st = document.createElement('style');
    st.id = 'ad-css';
    st.textContent = `
.ad{--ad-ok:var(--ok,#1E7A46);--ad-bad:var(--bad,#B8362E);font-size:1rem}
.ad [hidden]{display:none!important}
.ad-file{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.ad-file button{min-height:40px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:600;cursor:pointer}
.ad-file button.on{border:2px solid var(--accent);background:var(--paper)}
.ad-file button.ok{border-color:var(--ad-ok)}
.ad-file button.no{border-color:var(--ad-bad)}
.ad-card{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:10px 12px}
.ad-nume{font-family:var(--fd);font-weight:600;font-size:1.05rem;margin:0 0 2px}
.ad-cer{color:var(--ink2);margin:0 0 6px;font-size:.95rem}
.ad-pasi{list-style:none;margin:6px 0;padding:0;display:flex;flex-direction:column;gap:6px}
.ad-pas{display:flex;align-items:flex-start;gap:8px;width:100%;min-height:44px;text-align:left;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;cursor:pointer;line-height:1.35}
.ad-pas .ad-nr{flex:none;min-width:1.6em;height:1.6em;border-radius:50%;background:var(--accent);color:var(--accentInk);font-weight:700;display:inline-flex;align-items:center;justify-content:center;font-size:.85rem}
.ad-pas .ad-t{flex:1 1 auto;overflow-wrap:anywhere}
.ad-pas .ad-sch{flex:none;color:var(--accent);font-size:.82rem;font-weight:700;white-space:nowrap;padding-top:2px}
.ad-pas.ad-schimbat{border-style:dashed;border-color:var(--accent)}
.ad-pas.ad-acum{outline:3px solid var(--accent);outline-offset:1px}
.ad-pas.ad-rau{outline:3px solid var(--ad-bad);outline-offset:1px}
.ad-opt{margin:4px 0 2px 28px;padding:6px 8px;border-left:3px solid var(--accent);display:flex;flex-direction:column;gap:5px}
.ad-opt .ad-ol{font-size:.85rem;color:var(--ink2)}
.ad-opt button{min-height:40px;text-align:left;padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;cursor:pointer;line-height:1.3;overflow-wrap:anywhere}
.ad-opt button.on{border:2px solid var(--accent)}
.ad-opt button .ad-mic{color:var(--ink2);font-size:.8rem}
.ad-bara{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.ad-bara button{min-height:40px}
.ad-scena{border:1px solid var(--line);border-radius:10px;background:var(--paper2);padding:8px 10px;margin:6px 0;display:grid;grid-template-columns:56px 1fr;gap:8px;align-items:start}
.ad-rob svg{display:block;width:56px;height:56px}
.ad-bula{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:6px 9px;min-height:2.2em;line-height:1.35}
.ad-bula.ad-rau{border:2px solid var(--ad-bad)}
.ad-bula.ad-bine{border:2px solid var(--ad-ok)}
.ad-pagina{grid-column:1 / -1;background:var(--paper);border:1px solid var(--line);border-left:5px solid var(--ad-bad);border-radius:8px;padding:6px 9px;line-height:1.35}
.ad-lume{grid-column:1 / -1;display:flex;flex-direction:column;gap:6px}
.ad-lbl2{font-size:.82rem;color:var(--ink2);margin-bottom:2px}
.ad-masa{display:flex;flex-wrap:wrap;gap:5px}
.ad-ob{border:1px solid var(--line);border-radius:999px;background:var(--paper);padding:3px 10px;font-size:.92rem}
.ad-ob b{font-weight:700}
.ad-tabla{background:#24443a;color:#f4f1e6;border-radius:6px;padding:7px 10px;font-family:var(--fm);font-size:.95rem;line-height:1.5;min-height:2.2em;overflow-wrap:anywhere;word-break:break-word}
.ad-loc{font-size:.95rem}
.ad-contor{font-size:.85rem;color:var(--ink2)}
.ad-fig{display:flex;flex-wrap:wrap;gap:2px}
.ad-fig svg{width:30px;height:30px}
.ad-cz{margin:6px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}
.ad-cz li{padding:5px 9px;border-radius:8px;border:1px solid var(--line);background:var(--paper);line-height:1.35}
.ad-cz li.ok{border-color:var(--ad-ok)}
.ad-cz li.no{border-color:var(--ad-bad)}
.ad-cz .ad-semn{font-weight:700;margin-right:4px}
.ad-cz li.ok .ad-semn{color:var(--ad-ok)}
.ad-cz li.no .ad-semn{color:var(--ad-bad)}
.ad-lipsa{margin:8px 0 2px}
.ad-lipsa .ad-q2{font-weight:700;margin-bottom:4px}
.ad-lipsa .ad-bt{display:flex;flex-wrap:wrap;gap:6px}
.ad-lipsa button{min-height:40px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;cursor:pointer}
.ad-lipsa button.on{border:2px solid var(--accent);background:var(--paper);font-weight:700}
.ad-lbl{font-weight:700;margin:10px 0 4px}
.ad-teste{margin:0;padding-left:1.2em}
.ad-teste li{margin:2px 0}
.ad-teste li.ok{color:var(--ad-ok)}
.ad-teste li.ok::marker{content:'✓ '}
.ad-teste li.no{color:var(--ad-bad)}
.ad-teste li.no::marker{content:'✗ '}
.ad-teste li.ns{color:var(--ink2)}
.ad-teste li.ns::marker{content:'? '}
.ad-nota{font-size:.85rem;color:var(--ink2);margin:4px 0}
.ad-static .ad-pas{cursor:default}
@media (max-width:420px){.ad-scena{grid-template-columns:44px 1fr}.ad-rob svg{width:44px;height:44px}.ad-opt{margin-left:10px}}
`;
    document.head.appendChild(st);
  }
  /* executantul: un robot desenat de pagină (nu e o imagine de pe internet); fata: 'bine' | 'nedumerit' | 'obosit' | 'gata' */
  function robot(fata) {
    const ochi = fata === 'obosit'
      ? '<path d="M17 25h7M32 25h7" stroke="#24333f" stroke-width="2.5" stroke-linecap="round"/>'
      : '<circle cx="20.5" cy="25" r="3.2" fill="#24333f"/><circle cx="35.5" cy="25" r="3.2" fill="#24333f"/>';
    const gura = fata === 'nedumerit' ? '<path d="M21 38q3.5-3 7 0t7 0" fill="none" stroke="#24333f" stroke-width="2.2" stroke-linecap="round"/>'
      : fata === 'obosit' ? '<path d="M22 38h12" stroke="#24333f" stroke-width="2.2" stroke-linecap="round"/>'
      : '<path d="M21 36q7 6 14 0" fill="none" stroke="#24333f" stroke-width="2.2" stroke-linecap="round"/>';
    const semn = fata === 'nedumerit' ? '<text x="45" y="13" font-size="14" font-weight="700" fill="#B8362E" font-family="sans-serif">?</text>' : '';
    return `<svg viewBox="0 0 56 56" role="img" aria-label="executantul${fata === 'nedumerit' ? ', nedumerit' : fata === 'obosit' ? ', oprit' : ''}"><line x1="28" y1="3" x2="28" y2="10" stroke="#5c6b78" stroke-width="2"/><circle cx="28" cy="3.5" r="2.5" fill="#E4002B"/><rect x="8" y="10" width="40" height="38" rx="9" fill="#cfe0ee" stroke="#5c6b78" stroke-width="2"/><rect x="13" y="17" width="30" height="16" rx="5" fill="#f6fbff"/>${ochi}${gura}${semn}</svg>`;
  }
  function gaina() {
    return '<svg viewBox="0 0 30 30" aria-hidden="true"><ellipse cx="15" cy="19" rx="9" ry="7" fill="#f3efe6" stroke="#8a6d3b" stroke-width="1.3"/><circle cx="22" cy="10.5" r="4.6" fill="#f3efe6" stroke="#8a6d3b" stroke-width="1.3"/><path d="M20 5.5q2-3 4 0" fill="#d9302b"/><path d="M26.4 10.2l3 1.2-3 1.2z" fill="#e8a317"/><circle cx="22.8" cy="9.6" r=".9" fill="#222"/><path d="M12 26v3M17 26v3" stroke="#e8a317" stroke-width="1.4"/></svg>';
  }
  function lume(A, s) {
    let h = '';
    if (s.loc) h += `<div class="ad-loc">Executantul e: <b>${esc(s.loc)}</b></div>`;
    if (s.spune) h += `<div class="ad-loc">Executantul spune: <b>${esc(s.spune)}</b></div>`;
    if (s.gaini) h += `<div><div class="ad-lbl2">În curte: ${esc(nr(s.gaini, s.gaini === 1 ? 'găină' : 'găini'))}</div><div class="ad-fig" aria-hidden="true">${Array.from({length: Math.min(s.gaini, 30)}, gaina).join('')}</div></div>`;
    if (s.masa && s.masa.length) h += `<div><div class="ad-lbl2">${esc(A.masaTitlu || 'Pe masă:')}</div><div class="ad-masa">${s.masa.map(m => `<span class="ad-ob">${esc(m[0])}: <b>${esc(m[1])}</b></span>`).join('')}</div></div>`;
    if (s.tabla) h += `<div><div class="ad-lbl2">${esc(A.tablaTitlu || 'Pe tablă:')}</div><div class="ad-tabla">${s.tabla.length ? s.tabla.map(esc).join('&ensp; ') : '&nbsp;'}</div></div>`;
    if (A.scena && SCENE[A.scena]) h += SCENE[A.scena](s);
    return h;
  }
  /* „pas” = un rând scris; „facere” = o dată când executantul face un pas (1.1). Câte faceri a avut fiecare pas, din jurnal. */
  function faceri(r) {
    const c = {};
    r.jurnal.forEach(x => { if (x.i >= 0 && !x.neclar) c[x.i] = (c[x.i] || 0) + 1; });
    return c;
  }
  const oriTxt = n => n === 1 ? 'o dată' : `de ${nr(n, 'ori')}`;
  const siLista = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' și ' + a[a.length - 1] : a.join('');
  const facTxt = n => n === 1 ? 'o facere' : nr(n, 'faceri');
  /* mesajul de la sfârșitul unei rulări: {fata, cls, html (bula executantului), pagina? (vocea PAGINII, sub bulă)} */
  function mesajFinal(A, r, alese) {
    const nrp = r.pas + 1;
    if (r.oprit === 'neclar') {
      const v = A.pasi[r.pas].v[alese[r.pas]];
      const lista = r.variante.length > 1 ? r.variante.slice(0, -1).join(', ') + ' sau ' + r.variante[r.variante.length - 1] : r.variante.join('');
      return {fata: 'nedumerit', cls: 'ad-rau', html: `La pasul ${nrp} m-am oprit: <b>nu știu ce să aleg</b>. <i>${esc(v.t)}</i>${r.intrebare ? ' ' + esc(r.intrebare) : ''} ${esc(lista)}? Fiecare om ar face altfel.`};
    }
    const c = faceri(r), idx = Object.keys(c).map(Number).sort((a, b) => a - b);
    if (r.oprit === 'prea_multi') {
      return {fata: 'obosit', cls: 'ad-rau', html: `Pasul ${nrp} nu-mi spune când să mă opresc.`,
        pagina: `<b>Pagina a oprit executantul</b> după ${facTxt(r.pasi)}: ${siLista(idx.map(i => `${oriTxt(c[i])} pasul ${i + 1}`))}.`};
    }
    const n = A.pasi.length, multe = idx.filter(i => c[i] > 1);
    /* „Gata!” fără „faceri” (cuvântul se explică abia la P3 — judecata 2 a lecției V/25, T): „Gata! Am făcut toți cei 4 pași; pasul 4, de 5 ori.” */
    return {fata: 'gata', cls: 'ad-bine', html: multe.length
      ? `Gata! Am făcut ${n === 1 ? 'singurul pas' : `toți cei ${n} pași`}; ${siLista(multe.map(i => `pasul ${i + 1}, de ${nr(c[i], 'ori')}`))}.`
      : `Gata! Am făcut ${n === 1 ? 'singurul pas' : `toți cei ${n} pași`}.`};
  }
  function htmlCazuri(A, j) {
    if (!j || cazuriDe(A).length < 2 || !j.cazuri.length) return '';
    return `<div class="ad-lbl2">Același algoritm, încercat pe ${cazuriDe(A).length} cazuri de același fel:</div><ul class="ad-cz">${j.cazuri.map(c =>
      `<li class="${c.ok ? 'ok' : 'no'}"><span class="ad-semn">${c.ok ? '✓' : '✗'}</span>${esc(A.descrieCaz ? A.descrieCaz(c.caz) : (c.caz.nume || ''))}: ${esc(c.are)}${c.ok ? (/[.!?]”?$/.test(c.are) ? '' : '.') : (c.astept ? `; trebuia ${esc(c.astept)}.` : '.')}</li>`).join('')}</ul>`;
  }
  function htmlPasi(A, alese, opt) {
    opt = opt || {};
    return `<ol class="ad-pasi">${A.pasi.map((p, i) => {
      const v = p.v[alese[i]];
      const cls = ['ad-pas', alese[i] !== (p.ales || 0) ? 'ad-schimbat' : '', opt.acum === i ? 'ad-acum' : '', opt.rau === i ? 'ad-rau' : ''].filter(Boolean).join(' ');
      const tag = opt.static ? 'div' : 'button';
      const atr = opt.static ? '' : ` type="button" data-p="${i}" aria-expanded="${opt.deschis === i}" aria-label="Pasul ${i + 1}: ${esc(v.t)}. Atinge ca să-l schimbi."`;
      let h = `<li><${tag} class="${cls}"${atr}><span class="ad-nr">${i + 1}</span><span class="ad-t">${esc(v.t)}</span>${opt.static ? '' : `<span class="ad-sch">${opt.deschis === i ? 'închide ▴' : 'schimbă ▾'}</span>`}</${tag}>`;
      if (!opt.static && opt.deschis === i) {
        h += `<div class="ad-opt" role="group" aria-label="Variante pentru pasul ${i + 1}"><div class="ad-ol">Alege cum să fie pasul ${i + 1}:</div>${p.v.map((x, k) =>
          `<button type="button" data-p="${i}" data-v="${k}" class="${k === alese[i] ? 'on' : ''}" aria-pressed="${k === alese[i]}">${esc(x.t)}${k === alese[i] ? ' <span class="ad-mic">(acum)</span>' : k === (p.ales || 0) ? ' <span class="ad-mic">(la început)</span>' : ''}</button>`).join('')}</div>`;
      }
      return h + '</li>';
    }).join('')}</ol>`;
  }
  function htmlScena(A, s, msg) {
    return `<div class="ad-scena"><div class="ad-rob">${robot(msg ? msg.fata : 'bine')}</div><div class="ad-bula ${msg && msg.cls ? msg.cls : ''}" aria-live="polite">${msg ? msg.html : 'Apasă <b>Execută</b>: fac exact ce scrie, pas cu pas.'}</div>${msg && msg.pagina ? `<div class="ad-pagina" role="status">${msg.pagina}</div>` : ''}<div class="ad-lume">${lume(A, s)}</div></div>`;
  }
  /* imagine statică (pentru „Uite cum”): pașii aleși și ce a făcut executantul la sfârșit */
  function imagine(A, o) {
    stil();
    o = o || {};
    const alese = o.alese || A.pasi.map(p => p.ales || 0);
    const cz = cazuriDe(A);
    const j = judeca(A, alese);
    const r = o.caz ? ruleaza(A, alese, o.caz) : j.r;
    const msg = mesajFinal(A, r, alese);
    if (!r.oprit && cz.length > 1) {
      const rele = j.cazuri.filter(x => !x.ok).length;
      msg.html = rele ? `Am făcut toți pașii pentru fiecare caz, dar la ${rele === 1 ? 'unul' : rele + ' dintre ele'} <b>nu merge</b>. Uite ce a ieșit:` : `Am făcut toți pașii pentru fiecare caz. Uite ce a ieșit:`;
      if (rele) { msg.cls = 'ad-rau'; msg.fata = 'nedumerit'; }
    }
    /* în imaginea statică, o tablă lungă se arată prescurtat: primele 8, „…”, ultimul și câte sunt în total */
    let s = r.s;
    if (s.tabla && s.tabla.length > 12) { s = copie(s); s.tabla = [...s.tabla.slice(0, 8), '…', s.tabla[s.tabla.length - 1], `(${s.tabla.length} în total)`]; }
    return `<div class="ad ad-static">${o.titlu ? `<div class="ad-nume">${o.titlu}</div>` : ''}${htmlPasi(A, alese, {static: true, rau: r.oprit ? r.pas : -1})}${htmlScena(A, s, msg)}${htmlCazuri(A, j)}</div>`;
  }

  /* ===================== tipul „defect” pentru JocMotor ===================== */
  const nrPas = i => `pasul ${i + 1}`;
  function textTest(Q, t, k) {
    return esc(t.ce || `Testul ${k + 1}`);
  }
  /* rezultatul unui test + motivul (primul test care pică numește greșeala) */
  function testeaza(Q, st, t) {
    const ai = t.alg || 0, A = Q.algoritme[ai], j = judeca(A, st.alese[ai]);
    const pre = Q.algoritme.length > 1 ? `Algoritmul ${ai + 1}: ` : '';
    const dinNeclar = () => `${pre}la ${nrPas(j.pasNeclar)}, executantul nu știe ce să aleagă («${A.pasi[j.pasNeclar].v[st.alese[ai][j.pasNeclar]].t}»). Schimbă pasul cu unul care se poate face într-un singur fel.`;
    const dinFara = () => `${pre}executantul nu se oprește: ${nrPas(j.pasFaraSfarsit)} nu spune când să se termine. Schimbă pasul cu unul care spune cât sau de câte ori.`;
    const dinCaz = () => { const c = j.cazuri.find(x => !x.ok); return `${pre}${A.descrieCaz ? A.descrieCaz(c.caz) : (c.caz.nume || 'un caz')}: executantul ${c.are}; trebuia ${c.astept}. Algoritmul merge doar pentru unele cazuri: caută pasul care are scris dinainte ceva bun doar pentru un caz (un răspuns, numerele acelui caz sau un nume).`; };
    /* ns = „nu se poate afla încă” (testul arată „?”, nu ✓ / ✗); mesajul numește întâi greșeala care chiar s-a văzut */
    switch (t.k) {
      case 'clar':
        if (j.clar === null) {
          const unu = j.pasFaraSfarsit === A.pasi.length - 2;
          return {ok: false, ns: true, m: `${pre}executantul n-a ajuns la ${unu ? 'pasul' : 'pașii'} de după ${nrPas(j.pasFaraSfarsit)}: pasul acela nu se termină. Nu se poate afla încă dacă ${unu ? 'se poate' : 'se pot'} face într-un singur fel. Repară întâi ${nrPas(j.pasFaraSfarsit)}: spune cât sau de câte ori.`};
        }
        return j.clar ? {ok: true} : {ok: false, m: dinNeclar()};
      case 'opreste':
        if (j.opreste === null) return {ok: false, ns: true, m: `${pre}nu se poate afla încă dacă algoritmul se oprește: executantul s-a oprit nedumerit la ${nrPas(j.pasNeclar)}.`};
        return j.opreste ? {ok: true} : {ok: false, m: dinFara()};
      case 'tinta': case 'cazuri': {
        if (j.clar === false) return {ok: false, m: `${pre}executantul n-a ajuns la capăt: s-a oprit nedumerit la ${nrPas(j.pasNeclar)}.`};
        if (j.opreste === false) return {ok: false, m: `${pre}executantul n-a ajuns la capăt: nu s-a oprit la ${nrPas(j.pasFaraSfarsit)}.`};
        const lista = t.k === 'tinta' ? j.cazuri.slice(0, 1) : j.cazuri;
        return lista.every(c => c.ok) ? {ok: true} : {ok: false, m: dinCaz()};
      }
      case 'merge':
        if (j.clar === false) return {ok: false, m: dinNeclar()};
        if (j.opreste === false) return {ok: false, m: dinFara()};
        return j.cazuri.every(c => c.ok) ? {ok: true} : {ok: false, m: dinCaz()};
      case 'lipsa': {
        const ales = st.lipsa[ai];
        if (!ales) return {ok: false, m: `${pre}alege ce îi lipsea algoritmului (unul dintre cele trei butoane).`};
        if (ales === A.lipsa) return {ok: true};
        /* judecă algoritmul DE LA ÎNCEPUT; dacă elevul a schimbat deja pași, nu-l trimite să „execute neschimbat” ce nu mai e */
        const sch = A.pasi.map((p, i) => st.alese[ai][i] !== (p.ales || 0) ? i : -1).filter(i => i >= 0);
        if (!sch.length) return {ok: false, m: `${pre}ai ales ${PROPRIETATI[ales]}. Execută algoritmul și uită-te ce face executantul: se oprește nedumerit, nu se mai oprește sau merge doar pentru un caz?`};
        return {ok: false, m: `${pre}ai ales ${PROPRIETATI[ales]}. Gândește-te la algoritmul de la început: ai schimbat deja ${sch.length === 1 ? 'pasul' : 'pașii'} ${siLista(sch.map(i => String(i + 1)))} (cu chenar punctat). Atinge-l și uită-te la varianta „(la început)”. Cu ea, executantul se oprea nedumerit, nu se mai oprea sau mergea doar pentru un caz?`};
      }
      default: return {ok: false, m: 'Test necunoscut.'};
    }
  }
  const DEFECT = {
    render(Q, body, api) {
      stil();
      const algs = Q.algoritme;
      const st = {alese: algs.map(A => A.pasi.map(p => p.ales || 0)), lipsa: algs.map(() => null), tab: 0, deschis: -1, verificat: false, ultim: algs.map(() => null), anim: 0};
      body._ad = {Q, st};
      const oprireAnim = () => { st.anim++; };
      const draw = (scena) => {
        const A = algs[st.tab], alese = st.alese[st.tab];
        const file = algs.length > 1 ? `<div class="ad-file" role="tablist" aria-label="Algoritmii">${algs.map((x, k) => {
          const stare = st.verificat ? (Q.teste.filter(t => (t.alg || 0) === k).every(t => testeaza(Q, st, t).ok) ? ' ok' : ' no') : '';
          return `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === st.tab}" class="${k === st.tab ? 'on' : ''}${stare}">Algoritmul ${k + 1}</button>`;
        }).join('')}</div>` : '';
        const lipsa = Q.intreabaLipsa ? `<div class="ad-lipsa"><div class="ad-q2">Ce îi lipsea acestui algoritm, înainte să-l repari?</div><div class="ad-bt" role="group" aria-label="Ce îi lipsea">${Object.keys(PROPRIETATI).map(p =>
          `<button type="button" data-l="${p}" class="${st.lipsa[st.tab] === p ? 'on' : ''}" aria-pressed="${st.lipsa[st.tab] === p}">${PROPRIETATI[p]}</button>`).join('')}</div></div>` : '';
        const sc = scena || st.ultim[st.tab] || {s: ruleaza(A, alese).jurnal[0].s, msg: null, caz: ''};
        body.innerHTML = `<div class="ad">${file}<div class="ad-card">
          ${A.nume ? `<div class="ad-nume">${algs.length > 1 ? `Algoritmul ${st.tab + 1}: ` : ''}${esc(A.nume)}</div>` : ''}${A.cerinta ? `<p class="ad-cer">${A.cerinta}</p>` : ''}
          ${htmlPasi(A, alese, {deschis: st.deschis, acum: sc.acum, rau: sc.rau})}
          <div class="ad-bara"><button type="button" class="btn" data-x="executa">▶ Execută</button><button type="button" class="btn ghost" data-x="capat">Ia-o de la capăt</button></div>
          ${htmlScena(A, sc.s, sc.msg)}${sc.caz || ''}
          ${lipsa}${algs.length > 1 && st.tab < algs.length - 1 ? `<div class="ad-bara"><button type="button" class="btn" data-tab="${st.tab + 1}">Algoritmul ${st.tab + 2} →</button></div>` : ''}</div>
          <div class="ad-lbl">Testele</div><ul class="ad-teste">${Q.teste.map((t, k) => `<li data-t="${k}">${textTest(Q, t, k)}</li>`).join('')}</ul>
          ${algs.length > 1 ? '<p class="ad-nota">„Ia-o de la capăt” pune înapoi doar algoritmul din fila deschisă.</p>' : ''}</div>`;
        if (st.verificat) marcheaza();
      };
      body._draw = draw;
      const marcheaza = () => {
        let bune = 0; const motive = [];
        Q.teste.forEach((t, k) => {
          const r = testeaza(Q, st, t), li = body.querySelector(`li[data-t="${k}"]`);
          if (r.ok) bune++; else motive.push(r.m);
          if (li) li.className = r.ok ? 'ok' : r.ns ? 'ns' : 'no';
        });
        return {bune, motive};
      };
      body._marcheaza = marcheaza;
      /* execuția animată (doar pentru ochi; testele nu depind de ea) */
      const executa = () => {
        oprireAnim();
        const id = st.anim, ti = st.tab, A = algs[ti], alese = st.alese[ti].slice();
        st.deschis = -1;
        const j = judeca(A, alese), r = j.r, cadre = r.jurnal;
        let f = 0;
        const pas = () => {
          if (id !== st.anim || st.tab !== ti || !body.isConnected) return;
          const c = cadre[f];
          if (f === cadre.length - 1) {
            const msg = mesajFinal(A, r, alese);
            if (!r.oprit && cazuriDe(A).length > 1) {
              const rele = j.cazuri.filter(x => !x.ok).length;
              msg.html = rele ? `Am făcut toți pașii. Dar am încercat același algoritm și pe alte cazuri de același fel: la ${rele === 1 ? 'unul dintre ele' : rele + ' dintre ele'} <b>nu merge</b>.` : `Gata! Am încercat algoritmul pe toate cele ${cazuriDe(A).length} cazuri: merge la fiecare.`;
              if (rele) { msg.cls = 'ad-rau'; msg.fata = 'nedumerit'; }
            }
            st.ultim[ti] = {s: c.s, msg, rau: r.oprit ? r.pas : -1, caz: htmlCazuri(A, j)};
            draw();
            const be = body.querySelector('[data-x="executa"]'); if (be && st.focExec) be.focus({preventScroll: true});
            return;
          }
          /* un pas făcut de mai multe ori: câte faceri are până acum (aceeași numărătoare ca în mesajul de la sfârșit) */
          const deCate = c.i >= 0 && cadre.filter(x => x.i === c.i && !x.neclar).length > 1 ? cadre.slice(1, f + 1).filter(x => x.i === c.i).length : 0;
          draw({s: c.s, msg: {fata: 'bine', cls: '', html: c.i >= 0 ? `Fac pasul ${c.i + 1}…${deCate ? ` (${deCate === 1 ? 'o dată' : 'de ' + nr(deCate, 'ori')})` : ''}` : 'Încep.'}, acum: c.i});
          const repede = cadre.length > 14 && f > 3;
          f++;
          setTimeout(pas, f === 1 ? 250 : repede ? 70 : 520);
        };
        pas();
      };
      /* motorul refolosește #body (ghidul, III.1 S4): mânerul vechi se scoate înainte să-l punem pe al nostru */
      if (body._adClick) body.removeEventListener('click', body._adClick);
      body._adClick = ev => {
        const b = ev.target.closest('button');
        if (!b || !body.contains(b)) return;
        st.focExec = b.dataset.x === 'executa';
        if (b.dataset.tab != null) { oprireAnim(); st.tab = +b.dataset.tab; st.deschis = -1; draw(); const nb = body.querySelector(`[data-tab="${st.tab}"]`); if (nb) nb.focus(); return; }
        if (b.dataset.v != null) {
          oprireAnim();
          const i = +b.dataset.p, k = +b.dataset.v;
          st.alese[st.tab][i] = k; st.deschis = -1; st.ultim[st.tab] = null;
          draw();
          const pb = body.querySelector(`.ad-pas[data-p="${i}"]`); if (pb) pb.focus();
          return;
        }
        if (b.dataset.p != null) {
          oprireAnim();
          const i = +b.dataset.p;
          st.deschis = st.deschis === i ? -1 : i;
          st.ultim[st.tab] = null;
          draw();
          const pb = body.querySelector(`.ad-pas[data-p="${i}"]`); if (pb) pb.focus();
          return;
        }
        if (b.dataset.l) { st.lipsa[st.tab] = b.dataset.l; draw(); const lb = body.querySelector(`[data-l="${b.dataset.l}"]`); if (lb) lb.focus(); return; }
        if (b.dataset.x === 'executa') { executa(); return; }
        if (b.dataset.x === 'capat') {
          oprireAnim();
          const A = algs[st.tab];
          st.alese[st.tab] = A.pasi.map(p => p.ales || 0); st.lipsa[st.tab] = null; st.deschis = -1; st.ultim[st.tab] = null;
          draw();
          const bc = body.querySelector('[data-x="capat"]'); if (bc) bc.focus();
        }
      };
      body.addEventListener('click', body._adClick);
      /* Escape închide lista de variante deschisă și întoarce focusul pe pas (1.1) */
      if (body._adKey) body.removeEventListener('keydown', body._adKey);
      body._adKey = ev => {
        if (ev.key !== 'Escape' || st.deschis < 0) return;
        const i = st.deschis; st.deschis = -1; draw();
        const pb = body.querySelector(`.ad-pas[data-p="${i}"]`); if (pb) pb.focus();
        ev.preventDefault();
      };
      body.addEventListener('keydown', body._adKey);
      draw();
      const nav = api.checkButton(() => {
        oprireAnim();
        st.verificat = true; st.deschis = -1;
        // după „Verifică”, fila deschisă arată ce face executantul pe algoritmul ei (fără animație)
        const A = algs[st.tab], alese = st.alese[st.tab], j = judeca(A, alese);
        const msg = mesajFinal(A, j.r, alese);
        if (!j.r.oprit && cazuriDe(A).length > 1) {
          const rele = j.cazuri.filter(x => !x.ok).length;
          msg.html = rele ? `Am făcut toți pașii, dar pe alte cazuri de același fel algoritmul <b>nu merge</b> (vezi mai jos).` : `Gata! Merge la toate cele ${cazuriDe(A).length} cazuri.`;
          if (rele) { msg.cls = 'ad-rau'; msg.fata = 'nedumerit'; }
        }
        st.ultim[st.tab] = {s: j.r.s, msg, rau: j.r.oprit ? j.r.pas : -1, caz: htmlCazuri(A, j)};
        draw();
        const {bune, motive} = marcheaza(), total = Q.teste.length, ok = bune === total;
        try { window.dispatchEvent(new CustomEvent('algoritm-defect', {detail: {bune, total, ok}})); } catch (e) { /* fără eveniment */ }
        if (ok) {
          nav.innerHTML = ''; api.resolve(true);
          /* regula 14: butonul „Verifică” dispare; focusul merge pe butonul următor al motorului, nu pe <body> */
          setTimeout(() => { const bb = ['inca', 'pas-next', 'go', 'next'].map(i => document.getElementById(i)).find(e => e && e.offsetParent !== null && !e.disabled); if (bb) bb.focus({preventScroll: true}); }, 0);
        }
        else {
          const m0 = motive[0] || '';
          api.resolve(false, `${bune} din ${total} teste trec. ${esc(m0.charAt(0).toUpperCase() + m0.slice(1))}`);
          api.revealButton(() => {
            DEFECT.rezolva(Q, body);
            nav.innerHTML = '';
            api.giveUp('pașii reparați sunt acum în algoritm (cu chenar punctat)' + (Q.intreabaLipsa ? ', iar ce lipsea e ales' : '') + '. Apasă <b>▶ Execută</b> ca să vezi ce face executantul.');
          });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) {
      const d = body._ad; if (!d) return;
      d.Q.algoritme.forEach((A, k) => { d.st.alese[k] = A.sol.slice(); d.st.lipsa[k] = A.lipsa || null; d.st.ultim[k] = null; });
      d.st.deschis = -1;
      body._draw();
    },
    gresit(Q, body) {
      const d = body._ad; if (!d) return;
      d.Q.algoritme.forEach((A, k) => { d.st.alese[k] = A.sol.slice(); d.st.lipsa[k] = A.lipsa || null; d.st.ultim[k] = null; });
      const A0 = d.Q.algoritme[0];
      d.st.alese[0] = (A0.gresit || A0.pasi.map(p => p.ales || 0)).slice();   // greșeala tipică: o variantă tot defectă
      d.st.deschis = -1;
      body._draw();
    }
  };

  function scena(nume, fn) { if (typeof fn !== 'function') throw new Error('AlgoritmDefect.scena: fn trebuie să fie o funcție'); SCENE[nume] = fn; }

  window.AlgoritmDefect = {
    versiune: VERSIUNE, MAX_PASI, PROPRIETATI, ruleaza: (A, alese, caz) => ruleaza(A, alese || A.pasi.map(p => p.ales || 0), caz),
    judeca: (A, alese) => judeca(A, alese || A.pasi.map(p => p.ales || 0)), imagine, pune, scrie, nr, scena,
    tipuri: {defect: DEFECT}, _intern: {esc, stil, testeaza, robot, mesajFinal, faceri}
  };
})();
