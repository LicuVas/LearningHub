/* lectii/_sim/scratch-control.js — SimScratchControl: blocul „repetă” (Control, forma C) pentru SimScratch.
   Se încarcă DUPĂ lectii/_sim/scratch.js. Nu schimbă nimic din scratch.js: doar SimScratch.bloc(...) și, prin API-ul
   public al instanței (.on('schimbat'), .program(), .seteaza()), „înfășurarea” de mai jos.

   PROPRIETAR: lecția VI/20 (lectii/vi/m3-l20, „Structura repetitivă cu contor”, 24.10.2026). Lecțiile următoare
   (VI/21-26: cât timp / repetă până când / dacă) adaugă blocurile lor din fișiere NOI (`lectii/_sim/scratch-<ceva>.js`);
   NU schimbă ce e scris aici. Granița: _campaign/revizuire_completa_2026_09/m3_noapte_23_10/granite/vi_l20.md.

   FIDELITATEA (regula 9) — PROBATĂ în editorul viu scratch.mit.edu, în română (Chromium headless, profil temporar, fără
   cont, 24.10.2026; lectii/vi/m3-l20/_proba/live_repeta*.py → live_repeta*.json; structura citită din project.json-ul
   SALVAT, nu din desen):
     - în Control, blocul „repetă 10” (repeat %1; implicit 10) și „la infinit” (forever; fără crestătură jos);
     - câmpul lui primește, ca orice câmp numeric, cifre, „.” și „-” (scrise: 2.5 și -3 rămân; „3a” → „3”); la rulare
       numărul se ROTUNJEȘTE: 2.5 → 3 treceri, 2.4 → 2, 0 și -3 → nicio trecere (scratch-vm: Math.round);
     - după fiecare trecere Scratch desenează scena (cadrul următor): „repetă 4: mergi 100, rotește-te 90” se face în
       4 cadre (≈ 0,13 s, pisica abia se vede mișcându-se); cu „spune Colț! pentru 1 secunde” în gură, pisica stă câte o
       secundă în fiecare colț (măsurat: 100,0 → 100,−100 → 0,−100 → 0,0, câte 1 s);
     - blocul de SUB brațul de jos se execută o dată, DUPĂ toate trecerile;
     - tras din paletă și lăsat GOL chiar sub un bloc din mijlocul unei stive, „repetă” ia în gură blocurile care erau
       dedesubt (le „înfășoară”); dacă are deja ceva în gură, ele rămân sub brațul lui. Lăsat sub ULTIMUL bloc, gura
       rămâne goală. Un bloc lăsat sub brațul de jos vine după repetiție, nu în ea. Tras de „repetă”, vin și cele din
       gură, și cele de sub el; tras în paletă, se șterg toate.
     - înfășurarea e O SINGURĂ modificare: un Ctrl+Z imediat după ea întoarce programul de dinainte de lăsare (probat
       viu de judecătorul VI/20: lectii/vi/m3-l20/_verificare/j1_live.json L3; din nou în _proba/live_repeta6.py).
   ABATERI (spuse în lecție, unde contează):
     - ÎNFĂȘURAREA o face acest fișier DUPĂ lăsare (scratch.js 1.1 pune blocurile de dedesubt sub braț): elevul vede
       rezultatul ca în Scratch, dar o clipă stiva poate apărea „neînfășurată”. Doar pe instanțele făcute cu
       SimScratchControl.creeaza(...) sau cu tipul SimScratchControl.tipuri.scratch (cele simple din SimScratch nu știu).
       Când scratch.js va înfășura singur, codul de aici nu mai găsește nimic de făcut (verifică gura goală).
     - ANULAREA (1.1, după judecata 1): istoricul scratch.js ține și forma neînfășurată (lăsarea), și pe cea înfășurată
       (seteaza de aici). Ca în Scratch, o anulare (Ctrl+Z / Cmd+Z, sau „Anulează ultima modificare” din meniul zonei
       de cod) care ajunge din forma înfășurată în cea neînfășurată a aceleiași înfășurări mai face încă una, pe aceeași
       cale a scratch.js (tasta Ctrl+Z trimisă instanței). Așa, un singur Ctrl+Z, ca în Scratch. Refacerea (Ctrl+Y /
       Ctrl+Shift+Z / „Refă acțiunea anulată”) de după anularea unei înfășurări NU aduce înapoi nimic, tot ca în Scratch
       (probat viu: lectii/vi/m3-l20/_proba/live_repeta6.json, R2; pe o tragere simplă refacerea merge, R4): pagina o
       face și o anulează pe loc, deci programul rămâne cel de dinainte.
     - o trecere = un cadru și când în gură nu e nimic de desenat (Scratch face atunci mai multe treceri într-un cadru);
       cu gura GOALĂ, trecerile se fac toate deodată (ca Scratch: nimic de desenat).
     - săgeata ↻ de pe brațul de jos al blocului din Scratch nu e desenată.

   API PUBLIC (window.SimScratchControl) — stabil de la 24.10.2026; orice schimbare se trece în graniță, cu data:
     versiune                         '1.1 (24.10.2026)'  (1.1 = anularea unei înfășurări dintr-o singură apăsare;
                                                           API-ul neschimbat)
     blocurile înregistrate:          'repeta'     {cat:'control', forma:'c', text:'repetă [n:10]', en:'repeat %1'}
                                      'la_infinit' {cat:'control', forma:'c', final:true, text:'la infinit', en:'forever'}
                                                    (doar înregistrat, pentru lecțiile următoare; VI/20 nu-l folosește)
         în program: ['repeta', 4, {guri: [[['mergi', 100], ['roteste_dr', 90]]]}]  (gura goală: {guri: [[]]})
         la fiecare trecere: ctx.noteaza('trecere', {k, n}) — k = 1…n — deci U.evenimente are {tip:'trecere', valoare:{k,n}}
     creeaza(element, optiuni) → instanța SimScratch (aceleași opțiuni), cu înfășurarea pornită
     tipuri.scratch                   ca SimScratch.tipuri.scratch (aceleași câmpuri Q), cu înfășurarea pornită
     infasoara(inst)                  pornește înfășurarea pe o instanță făcută altfel (o dată; întoarce inst)
     treceri(U) → [{k, n}, …]         trecerile notate în urma unei rulări (SimScratch.urma / inst.urma)
     numere(P) → [număr, …]           numărul scris în fiecare „repetă” din program (în ordinea în care apar)
     inGura(P, id) → bool             e vreun bloc `id` în gura unui „repetă”?
     subRepeta(P) → [id…]             blocurile din gura PRIMULUI „repetă” de sub steag
     dupaRepeta(P) → [id…]            blocurile de sub brațul PRIMULUI „repetă” de sub steag
     potrivesteInfasurarea(P0, P1) → P1 înfășurat | null   (funcția pură din spatele înfășurării; pentru probe)
*/
(function () {
  'use strict';
  if (window.SimScratchControl) return;
  if (!window.SimScratch) throw new Error('scratch-control.js: încarcă întâi lectii/_sim/scratch.js');
  const SS = window.SimScratch;
  const VERSIUNE = '1.1 (24.10.2026)';

  /* numărul de treceri, ca scratch-vm (Cast.toNumber + Math.round): „2.5” → 3, „-3” → 0, „” → 0, „abc” → 0 */
  const nrTreceri = (s) => { const x = Number(String(s == null ? '' : s).trim()); return isFinite(x) ? Math.max(0, Math.round(x)) : 0; };

  SS.bloc('repeta', {cat: 'control', forma: 'c', text: 'repetă [n:10]', en: 'repeat %1', *executa(ctx, v, nod) {
    const n = nrTreceri(v[0]);
    const gura = nod.guri[0] || [];
    if (!gura.length) { for (let k = 1; k <= Math.min(n, 10000); k++) ctx.noteaza('trecere', {k, n}); return; }
    for (let k = 1; k <= n; k++) {
      ctx.noteaza('trecere', {k, n});
      yield* ctx.ruleaza(gura);
      yield* ctx.asteapta(0);   // cadrul următor (în „Pas cu pas” asteapta nu oprește: niciun pas gol)
    }
  }});
  SS.bloc('la_infinit', {cat: 'control', forma: 'c', final: true, text: 'la infinit', en: 'forever', *executa(ctx, v, nod) {
    const gura = nod.guri[0] || [];
    for (let k = 1; ; k++) {
      ctx.noteaza('trecere', {k, n: Infinity});
      yield* ctx.ruleaza(gura);
      yield;   // mereu un cadru (și în „Pas cu pas”): o buclă fără sfârșit nu are voie să blocheze pagina
    }
  }});

  /* ---------------- ajutoare pe programul serializat ---------------- */
  const ext = (b) => { const e = b[b.length - 1]; return e && typeof e === 'object' && !Array.isArray(e) ? e : null; };
  const eC = (id) => { const d = SS.def(id); return !!d && d.forma === 'c'; };
  const guraGoala = (b) => { const e = ext(b); return !(e && e.guri && e.guri[0] && e.guri[0].length); };
  const copie = (x) => JSON.parse(JSON.stringify(x));
  function toateListele(P) {   // fiecare listă de blocuri (stivele și gurile), cu drumul până la ea
    const out = [];
    const w = (lista, drum) => {
      out.push({lista, drum});
      lista.forEach((b, i) => { const e = ext(b); if (e && e.guri) e.guri.forEach((g, k) => w(g, drum.concat([[i, k]]))); });
    };
    (P || []).forEach((sc, si) => w(sc.b, [si]));
    return out;
  }
  function listaLa(P, drum) {
    let l = P[drum[0]].b;
    for (let j = 1; j < drum.length; j++) { const [i, k] = drum[j]; l = ext(l[i]).guri[k]; }
    return l;
  }
  const cheie = (P) => (P || []).map(sc => JSON.stringify(sc.b)).sort().join('\n');

  /* P0 → P1 a fost o lăsare a unui grup G = L[i..j) care începe cu un bloc C cu gura GOALĂ, chiar sub L[i-1] (i ≥ 1;
     probat viu pe stivă, sub pălărie; în gura altui bloc C, aceeași regulă, neprobată), iar sub el au rămas L[j..]?
     Atunci, ca în Scratch, L[j..] intră în gura lui L[i].
     Criteriul: P1 fără grup = P0 fără grupul acela (oriunde era: stivă separată, coada altei liste) sau P0 (din paletă). */
  function potrivesteInfasurarea(P0, P1) {
    if (!P0 || !P1) return null;
    const k0 = new Set([cheie(P0)]);
    const variante0 = (G) => {
      const gs = JSON.stringify(G), s = new Set(k0);
      P0.forEach((sc, si) => { if (JSON.stringify(sc.b) === gs) { const Q = P0.filter((_, x) => x !== si); s.add(cheie(Q)); } });
      toateListele(P0).forEach(({lista, drum}) => {
        for (let k = 0; k < lista.length; k++) {
          if (JSON.stringify(lista.slice(k)) !== gs) continue;
          if (drum.length === 1 && k === 0) continue;   // stiva întreagă: tratată mai sus
          const Q = copie(P0); listaLa(Q, drum).splice(k); s.add(cheie(Q));
        }
      });
      return s;
    };
    for (const {lista, drum} of toateListele(P1)) {
      for (let i = 0; i < lista.length - 1; i++) {
        if (i === 0) continue;   // primul într-o stivă sau într-o gură: neprobat viu, nu înfășor (rămâne ca în scratch.js)
        const b = lista[i];
        if (!eC(b[0]) || !guraGoala(b)) continue;
        for (let j = i + 1; j < lista.length; j++) {
          const G = lista.slice(i, j);
          const Q = copie(P1); listaLa(Q, drum).splice(i, j - i);
          if (!variante0(G).has(cheie(Q))) continue;
          const R = copie(P1), L = listaLa(R, drum);
          const rest = L.splice(j), C = L[i];
          let e = ext(C);
          if (!e) { e = {guri: [[]]}; C.push(e); }
          if (!e.guri) e.guri = [[]];
          e.guri[0] = rest;
          return R;
        }
      }
    }
    return null;
  }

  /* anularea / refacerea cerută CHIAR ACUM (tastă sau meniul zonei de cod): 'z' | 'y' | null; se șterge după tura
     curentă (scratch.js le face sincron, în același eveniment) */
  let ANUL = null;
  const cere = (t) => { ANUL = t; setTimeout(() => { ANUL = null; }, 0); };
  if (typeof document !== 'undefined' && document.addEventListener) {   // (fără DOM, ex. probele în Node: nimic de ascultat)
    document.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key;
      if ((k === 'z' || k === 'Z') && !e.shiftKey) cere('z');
      else if (k === 'y' || k === 'Y' || ((k === 'z' || k === 'Z') && e.shiftKey)) cere('y');
    }, true);
    document.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest('.ss-meniu button') : null;
      if (!b) return;
      const t = (b.textContent || '').trim();
      if (t === 'Anulează ultima modificare') cere('z');
      else if (t === 'Refă acțiunea anulată') cere('y');
    }, true);
  }

  const PORNIT = new WeakSet();
  function infasoara(inst) {
    if (!inst || PORNIT.has(inst)) return inst;
    PORNIT.add(inst);
    let P0 = inst.program(), eu = false;
    const facute = [];   // înfășurările făcute: {A: înainte de lăsare, B: lăsat (neînfășurat), W: înfășurat} (chei)
    /* încă o anulare / refacere, pe calea scratch.js: tasta trimisă rădăcinii instanței (ascultătorul ei de keydown) */
    const inca = (t) => {
      const r = inst.element && inst.element.querySelector('.ss');
      if (!r) return;
      eu = true;
      try { r.dispatchEvent(new KeyboardEvent('keydown', {key: t, ctrlKey: true, bubbles: true, cancelable: true})); } finally { eu = false; }
    };
    inst.on('schimbat', (d) => {
      if (eu) return;
      const P1 = d && d.program ? d.program : inst.program();
      const k0 = cheie(P0), k1 = cheie(P1);
      const dubla = ANUL === 'z' ? facute.find(f => f.W === k0 && f.B === k1) : ANUL === 'y' ? facute.find(f => f.A === k0 && f.B === k1) : null;
      if (dubla) { inca('z'); P0 = inst.program(); return; }   // 'z': încă o anulare; 'y': refacerea se anulează (ca Scratch)
      const R = potrivesteInfasurarea(P0, P1);
      if (R) {
        eu = true; try { inst.seteaza(R); } finally { eu = false; }
        P0 = inst.program();
        facute.push({A: k0, B: k1, W: cheie(P0)});
        if (facute.length > 60) facute.shift();
      } else P0 = P1;
    });
    return inst;
  }
  function creeaza(el, o) { return infasoara(SS.creeaza(el, o)); }
  const tipScratch = {
    render(Q, body, api) { SS.tipuri.scratch.render(Q, body, api); if (body._ss) infasoara(body._ss); },
    rezolva(Q, body, api) { return SS.tipuri.scratch.rezolva(Q, body, api); },
    gresit(Q, body, api) { return SS.tipuri.scratch.gresit(Q, body, api); }
  };

  const treceri = (U) => ((U && U.evenimente) || []).filter(e => e.tip === 'trecere').map(e => e.valoare);
  const numere = (P) => SS.ajutor.valori(P, 'repeta').map(v => Number(v[0]));
  function inGura(P, id) {
    let da = false;
    const w = (b, inRep) => {
      if (inRep && b[0] === id) da = true;
      const e = ext(b);
      if (e && e.guri) e.guri.forEach(g => g.forEach(x => w(x, inRep || b[0] === 'repeta')));
    };
    (P || []).forEach(sc => sc.b.forEach(b => w(b, false)));
    return da;
  }
  const primulRepeta = (P) => { const s = SS.ajutor.cuSteag(P)[0]; if (!s) return null; const i = s.b.findIndex(b => b[0] === 'repeta'); return i < 0 ? null : {s, i}; };
  function subRepeta(P) { const r = primulRepeta(P); if (!r) return []; const e = ext(r.s.b[r.i]); return e && e.guri ? e.guri[0].map(b => b[0]) : []; }
  function dupaRepeta(P) { const r = primulRepeta(P); return r ? r.s.b.slice(r.i + 1).map(b => b[0]) : []; }

  window.SimScratchControl = {
    versiune: VERSIUNE, creeaza, infasoara, tipuri: {scratch: tipScratch},
    treceri, numere, inGura, subRepeta, dupaRepeta, potrivesteInfasurarea, nrTreceri
  };
})();
