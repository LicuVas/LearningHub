/* lectii/_sim/scratch-conditie.js — SimScratchConditie: blocul „repetă până când ⬡” (Control) și condițiile lui simple
   (Detectare „atinge [marginea]?”, Mișcare „poziția x”, Operatori „( ) > ( )”, „( ) < ( )”, „( ) = ( )”) pentru SimScratch.
   Se încarcă DUPĂ lectii/_sim/scratch.js și lectii/_sim/scratch-control.js. Nu schimbă nimic din ele: doar
   SimScratch.bloc(...). În `tipuri` folosiți SimScratchControl.tipuri.scratch (înfășurarea VI/20 merge pe orice bloc C).

   PROPRIETAR: lecția VI/21 (lectii/vi/m3-l21, „Structura repetitivă condiționată anterior (cu test inițial)”,
   24.10.2026). Lecțiile următoare (VI/22-26) adaugă blocurile lor din fișiere NOI și NU schimbă ce e scris aici.
   Granița: _campaign/revizuire_completa_2026_09/m3_noapte_23_10/granite/vi_l21.md.

   FIDELITATEA (regula 9) — PROBATĂ în editorul viu scratch.mit.edu, în română (Chromium headless, profil temporar, fără
   cont, 24.10.2026; lectii/vi/m3-l21/_proba/live_conditie*.py → live_conditie.json; structura citită din project.json-ul
   SALVAT): vezi lectii/vi/m3-l21/surse.md §5. Pe scurt:
     - „repetă până când ⬡” (repeat until %1), în Control; ÎNAINTE de fiecare trecere Scratch evaluează condiția
       (Cast.toBoolean): adevărată → gata, merge la blocul de sub braț (deci 0 treceri dacă e adevărată de la început);
       falsă → o trecere, apoi cadrul următor. Locul gol (fără condiție) = fals → nu se oprește singur (butonul Stop);
     - „atinge [marginea]?”: adevărat când cutia personajului (forma pisicii) iese, oricât de puțin, din scenă
       (x de la −240 la 240, y de la −180 la 180) — scratch-vm isTouchingEdge; cutia pisicii e MĂSURATĂ viu (CUTIE, mai jos);
     - „poziția x” = x-ul personajului; comparațiile ca scratch-vm Cast.compare (numere comparate ca numere; textul gol
       sau un text care nu e număr → comparație de texte, fără să țină seama de litere mari/mici).
   ABATERI (spuse pe ecran unde contează):
     - „atinge [cursorul mouse-ului]?” e mereu FALS în pagină (nu urmărim mouse-ul peste scenă); lista are doar
       „cursorul mouse-ului” și „marginea” (în Scratch, și celelalte personaje, dacă există);
     - la direcții care nu sunt 0 / 90 / 180 / −90, cutia rotită e o aproximare (ca gardul din scratch.js);
     - căsuța de bifat de lângă „poziția x” din paleta Scratch nu e desenată.

   API PUBLIC (window.SimScratchConditie) — stabil de la 24.10.2026; orice schimbare se trece în graniță, cu data:
     versiune
     blocurile înregistrate:
       'repeta_pana' {cat:'control', forma:'c', text:'repetă până când [b]', en:'repeat until %1'}
           în program: ['repeta_pana', {s:{0:['atinge', 'marginea']}, guri:[[['mergi', 10]]]}]   (fără condiție: {guri:[[…]]})
           la fiecare test: ctx.noteaza('test', {k, c, pana:true}); la fiecare trecere: ctx.noteaza('trecere', {k, n:null, pana:true})
       'atinge'      {cat:'detectare', forma:'boolean', text:'atinge [m:cursorul mouse-ului|marginea]?', en:'touching %1?'}
       'pozitia_x'   {cat:'miscare', forma:'raportor', text:'poziția x', en:'x position'}
       'mai_mare' / 'mai_mic' / 'egal'  {cat:'operatori', forma:'boolean', text:'[t:] > [t:50]' / '[t:] < [t:50]' / '[t:] = [t:50]'}
           ex.: ['mai_mare', '', 140, {s:{0:['pozitia_x']}}]
     teste(U) → [{k, c}, …]            testele condiției, în ordine (din toate „repetă până când”)
     treceri(U) → [{k}, …]             trecerile lui „repetă până când” (SimScratchControl.treceri le numără și pe ale lui „repetă”)
     conditia(P) → spec | null          condiția (blocul din locul în șase colțuri) din PRIMUL „repetă până când” de sub steag
     textConditie(P) → text             ex. „atinge marginea?”, „(poziția x) > 140”; '' dacă locul e gol
     subPana(P) → [id…]                 blocurile din gura primului „repetă până când” de sub steag
     dupaPana(P) → [id…]                blocurile de sub brațul lui
     atingeMarginea({x, y, directie}) → bool   (funcția pură din spatele lui „atinge marginea?”)
     compara(a, b) → număr              Cast.compare (pentru probe)
     CUTIE                              {st, dr, sus, jos}: cât iese forma pisicii din centru, la direcția 90 (măsurat)
*/
(function () {
  'use strict';
  if (window.SimScratchConditie) return;
  if (!window.SimScratch) throw new Error('scratch-conditie.js: încarcă întâi lectii/_sim/scratch.js');
  const SS = window.SimScratch;
  const VERSIUNE = '1.0 (24.10.2026)';

  /* forma pisicii, față de centrul ei, la direcția 90 (unități Scratch). Valorile = măsurătorile vii (surse.md §5). */
  const CUTIE = {st: 47, dr: 47, sus: 49, jos: 50};
  function atingeMarginea(p) {
    const d = ((Number(p.directie) - 90) % 360 + 360) % 360;   // rotirea față de direcția 90, în sensul acelor
    let st, dr, sus, jos;
    if (Math.abs(d) < 1e-9) ({st, dr, sus, jos} = CUTIE);
    else if (Math.abs(d - 180) < 1e-9) { st = CUTIE.dr; dr = CUTIE.st; sus = CUTIE.jos; jos = CUTIE.sus; }   // spre stânga: întoarsă
    else if (Math.abs(d - 90) < 1e-9) { st = CUTIE.jos; dr = CUTIE.sus; sus = CUTIE.st; jos = CUTIE.dr; }    // spre jos (180)
    else if (Math.abs(d - 270) < 1e-9) { st = CUTIE.sus; dr = CUTIE.jos; sus = CUTIE.dr; jos = CUTIE.st; }   // în sus (0)
    else {   // aproximare: cutia rotită
      const a = d * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
      const hw = (CUTIE.st + CUTIE.dr) / 2, hh = (CUTIE.sus + CUTIE.jos) / 2;
      st = dr = hw * c + hh * s; sus = jos = hw * s + hh * c;
    }
    const x = Number(p.x), y = Number(p.y);
    return x - st < -240 || x + dr > 240 || y + sus > 180 || y - jos < -180;
  }
  /* scratch-vm Cast.toBoolean și Cast.compare */
  const laBool = (v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') { const s = v.toLowerCase(); return !(v === '' || v === '0' || s === 'false'); }
    return Boolean(v);
  };
  const gol = (v) => v === null || v === undefined || (typeof v === 'string' && v.trim().length === 0);
  function compara(v1, v2) {
    let n1 = Number(v1), n2 = Number(v2);
    if (n1 === 0 && gol(v1)) n1 = NaN;
    else if (n2 === 0 && gol(v2)) n2 = NaN;
    if (isNaN(n1) || isNaN(n2)) {
      const s1 = String(v1 == null ? '' : v1).toLowerCase(), s2 = String(v2 == null ? '' : v2).toLowerCase();
      return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
    }
    if ((n1 === Infinity && n2 === Infinity) || (n1 === -Infinity && n2 === -Infinity)) return 0;
    return n1 - n2;
  }

  SS.bloc('repeta_pana', {cat: 'control', forma: 'c', text: 'repetă până când [b]', en: 'repeat until %1', *executa(ctx, v, nod) {
    const gura = nod.guri[0] || [];
    for (let k = 1; ; k++) {
      const c = laBool(ctx.valoare(nod, 0));   // testul ÎNAINTE de fiecare trecere (condiționată anterior)
      ctx.noteaza('test', {k, c, pana: true});
      if (c) return;
      ctx.noteaza('trecere', {k, n: null, pana: true});
      yield* ctx.ruleaza(gura);
      /* cadrul următor, după fiecare trecere (ca „repetă” din scratch-control.js: în „Pas cu pas” niciun pas gol);
         cu gura GOALĂ, tot un cadru (și în „Pas cu pas”): o buclă care nu se oprește nu are voie să blocheze pagina */
      if (gura.length) yield* ctx.asteapta(0); else yield;
    }
  }});
  SS.bloc('atinge', {cat: 'detectare', forma: 'boolean', text: 'atinge [m:cursorul mouse-ului|marginea]?', en: 'touching %1?',
    valoare(ctx, v) { return v[0] === 'marginea' ? atingeMarginea(ctx.personaj) : false; }});
  SS.bloc('pozitia_x', {cat: 'miscare', forma: 'raportor', text: 'poziția x', en: 'x position', valoare(ctx) { return ctx.personaj.x; }});
  SS.bloc('mai_mare', {cat: 'operatori', forma: 'boolean', text: '[t:] > [t:50]', en: '%1 > %2', valoare(ctx, v) { return compara(v[0], v[1]) > 0; }});
  SS.bloc('mai_mic', {cat: 'operatori', forma: 'boolean', text: '[t:] < [t:50]', en: '%1 < %2', valoare(ctx, v) { return compara(v[0], v[1]) < 0; }});
  SS.bloc('egal', {cat: 'operatori', forma: 'boolean', text: '[t:] = [t:50]', en: '%1 = %2', valoare(ctx, v) { return compara(v[0], v[1]) === 0; }});

  /* ---------------- ajutoare pe programul serializat și pe urmă ---------------- */
  const ext = (b) => { const e = b[b.length - 1]; return e && typeof e === 'object' && !Array.isArray(e) ? e : null; };
  const primulPana = (P) => { const s = SS.ajutor.cuSteag(P)[0]; if (!s) return null; const i = s.b.findIndex(b => b[0] === 'repeta_pana'); return i < 0 ? null : {s, i}; };
  function conditia(P) { const r = primulPana(P); if (!r) return null; const e = ext(r.s.b[r.i]); return e && e.s && e.s[0] ? e.s[0] : null; }
  function textConditie(P) { const c = conditia(P); return c ? SS.text(c).replace(/\s+/g, ' ').replace(/ \?/g, '?').trim() : ''; }
  function subPana(P) { const r = primulPana(P); if (!r) return []; const e = ext(r.s.b[r.i]); return e && e.guri && e.guri[0] ? e.guri[0].map(b => b[0]) : []; }
  function dupaPana(P) { const r = primulPana(P); return r ? r.s.b.slice(r.i + 1).map(b => b[0]) : []; }
  const teste = (U) => ((U && U.evenimente) || []).filter(e => e.tip === 'test' && e.valoare && e.valoare.pana).map(e => ({k: e.valoare.k, c: e.valoare.c}));
  const treceri = (U) => ((U && U.evenimente) || []).filter(e => e.tip === 'trecere' && e.valoare && e.valoare.pana).map(e => ({k: e.valoare.k}));

  window.SimScratchConditie = {
    versiune: VERSIUNE, CUTIE, atingeMarginea, compara, laBool,
    teste, treceri, conditia, textConditie, subPana, dupaPana
  };
})();
