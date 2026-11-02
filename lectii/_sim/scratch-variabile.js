/* lectii/_sim/scratch-variabile.js — SimScratchVariabile: VARIABILELE din Scratch 3 (categoria „Variabile”: butonul
   „Creează o variabilă” cu fereastra „Variabilă nouă”, raportorul variabilei, „setează … la …”, „modifică … cu …”,
   caseta variabilei pe scenă), operatorii de calcul („( ) + ( )”, „( ) - ( )”, „( ) * ( )”, „( ) / ( )”,
   „( ) mod ( )”, „rotunjește ( )”) și blocul „dacă ⬡ atunci” (Control), pentru SimScratch.
   Se încarcă DUPĂ lectii/_sim/scratch.js, scratch-control.js și scratch-conditie.js (folosește „( ) = (50)” de acolo).
   Nu schimbă nimic din ele: doar SimScratch.bloc(...), API-ul public al instanței (.on, .verifica, .element, .stare)
   și DOM-ul declarat al instanței (.ss, .ss-scena, .ss-lista, h4[data-cat], .ss-b[data-id], .ss-slot, .ss-pill).

   PROPRIETAR: lecția VI/25 (lectii/vi/m4-l25, „Rezolv probleme cu repetiție: sume, numărări, cifre”, 01-02.11.2026).
   Lecțiile următoare (VI/26 …) adaugă ce le trebuie dintr-un fișier NOU și NU schimbă ce e scris aici.
   Granița: _campaign/revizuire_completa_2026_09/m4_noapte_01_11/granite/vi_l25.md.

   FIDELITATEA (regula 9) — PROBATĂ în editorul viu scratch.mit.edu, în română (Chromium headless, profil temporar, fără
   cont, rețeaua doar spre scratch.mit.edu, 01.11.2026; lectii/vi/m4-l25/_proba/live_var.py → live_var.json,
   live_var2.py → live_var2.json; execuția citită din mașina virtuală scratch-vm):
     - paleta „Variabile”: butonul „Creează o variabilă”, raportoarele variabilelor (în ordine alfabetică), apoi
       „setează [▾] la (0)” și „modifică [▾] cu (1)”; aceste două blocuri arată în paletă PRIMA variabilă în ordine
       alfabetică (cu „suma” și „variabila mea” → „suma”); ordinea nu ține seama de literele mari: la nume care diferă
       doar prin ele, ordinea creării („K” apoi „k” → K, k; „k” apoi „K” → k, K — 1.2, live_var6.json V1-V2);
     - „Creează o variabilă” → fereastra „Variabilă nouă”, „Numele variabilei:”, „Pentru toate personajele” (ales) /
       „Doar pentru acest personaj”, butoanele „Renunță” și „OK”; după OK apare raportorul în paletă și CASETA
       variabilei pe scenă, sus în stânga („suma 0”); același nume a doua oară → „O variabilă denumită "suma" există
       deja.”, nimic nou; numele gol + OK → nimic nou;
     - câmpul lui „setează … la” e de TEXT („5a” rămâne „5a”); câmpul lui „modifică … cu” e numeric („3a” → „3”);
       câmpurile operatorilor sunt numerice și GOALE în paletă;
     - execuția (ca scratch-vm): „setează” pune valoarea așa cum e; „modifică” adună ca numere (textul care nu e număr
       = 0); operatorii: 47 mod 10 = 7, 47 / 10 = 4.7, rotunjește 4.7 = 5 (4.5 → 5), (47 − 7) / 10 = 4, 0 mod 10 = 0;
     - VALOAREA RĂMÂNE de la o rulare la alta (steagul nu o golește: „modifică s cu 5” sub steag → 5, 10, 15);
       de aceea programul o setează la început;
     - clic pe un raportor (variabilă sau operator) → Scratch arată valoarea lui într-o cutie, sub bloc.
   ABATERI (spuse pe ecran, în notă, unde contează):
     - variabila pe care o are orice proiect nou („variabila mea” / „my variable”) NU e desenată;
     - lista ▾ din „setează” / „modifică” are doar variabilele (în Scratch mai are „Redenumește variabila” și „Șterge
       variabila cu numele …”); căsuța de bifat de lângă raportor (arată / ascunde caseta) nu e desenată: casetele
       variabilelor exercițiului sunt mereu pe scenă;
     - o variabilă creată în pagină apare pe scenă și în listele ▾; raportorul ei apare în paletă doar dacă exercițiul
       îl pregătește (`deCreat`); după fiecare creare, „setează” / „modifică” din paletă trec pe prima variabilă, ca
       în Scratch (1.2; până la 1.1 rămâneau pe ce arătau, chiar pe o variabilă încă necreată — punctul O);
     - numele deja folosit: mesajul apare într-o casetă a paginii (în Scratch, o fereastră a browserului);
     - o trecere a lui „repetă” = un cadru și când în gură sunt doar variabile (ca în scratch-control.js);
     - clic pe un bloc în șase colțuri (condiție) nu arată nimic (în Scratch arată true / false).
   PROBATE viu și de judecătorul 1 (02.11.2026, m4-l25/_verificare/j1_live.py → j1_live.json): „Doar pentru acest
     personaj” → caseta „Sprite1: n 0” (ca aici); „K” mare e altă variabilă decât „k” (ca aici: numele comparat exact).
   1.1 (02.11.2026, reparația după judecata 1 a VI/25 — registrul m4-l25/_verificare/registru_j1.md):
     - fereastra „Variabilă nouă” și mesajul „există deja” stau FIXE pe ecran, sus (12 % din înălțime), peste toată
       pagina, ca fereastra din Scratch — nu lipite de marginea de sus a simulatorului, unde ieșeau din ecran (punctul E);
     - un exercițiu FĂRĂ variabile (Q.variabile gol + Q.deCreat): în paletă NU apar „setează” / „modifică” până la prima
       variabilă creată (PROBAT viu: proiect fără nicio variabilă → categoria Variabile are doar butoanele; după
       „Creează o variabilă” k → raportorul k, „setează k la 0”, „modifică k cu 1”: m4-l25/_proba/live_var5.json F1-F2);
     - inst.stare() are în plus `variabileCreate` = numele create de elev cu butonul (pentru teste: S.variabileCreate);
     - după „Arată rezolvarea”, mesajul comun „… privește ce face pisica” devine „… privește casetele de pe scenă”
       (sau Q.dupaRezolvare, dacă exercițiul îl dă) — doar pentru exercițiile cu casete (punctul J).
   1.2 (02.11.2026, reparația după judecata 2 a VI/25, punctul O; API-ul NESCHIMBAT):
     - după fiecare creare (butonul, „Arată rezolvarea”, rezolva), „setează” / „modifică” din PALETĂ arată prima
       variabilă în ordinea lui Scratch, deci niciodată una necreată (PROBAT viu, live_var6.json: proiect fără
       variabile, „K” → „setează K la 0”; apoi „k” → tot „setează K”; „k” apoi „K” → „setează k”). Până la 1.1, după
       „K” paleta arăta „setează k” (din `deCreat`), steagul scria într-un k necreat, iar „Creează o variabilă” k
       răspundea „există deja” — o buclă. scratch.js 1.4 (publicat, neatins) schimbă valoarea unui bloc din paletă
       doar prin lista lui ▾: o deschid și aleg numele în același pas, fără să ajungă pe ecran (paletaPe);
     - ordinea (raportoare, liste ▾, prima variabilă): alfabetic fără majuscule; la egalitate, ordinea creării (până
       la 1.1: „K” înaintea lui „k” mereu);
     - „Arată rezolvarea” / rezolva: o variabilă din `deCreat` care e deja pe scenă fără să fi fost creată cu butonul
       (o scriere dintr-un program) se socotește creată, deci testul „Ai creat variabila …” trece din orice stare.
     - numele cu spații la capete se taie, ca în Scratch („k ” → k; „ k” lângă k → „există deja”; „k k” = altă
       variabilă: live_var6.json V3) — așa era și în 1.0, acum probat.

   API PUBLIC (window.SimScratchVariabile) — stabil de la 02.11.2026; orice schimbare se trece în graniță, cu data:
     versiune
     variabila(nume) → 'var:<nume>'      înregistrează (o dată) raportorul variabilei: {cat:'variabile', forma:'raportor',
                                          text:nume}; în program: ['var:s'] (ex. ['modifica_var', 's', '', {s:{1:['var:i']}}])
     blocurile înregistrate (fiecare doar dacă id-ul e liber):
       'seteaza_var'  {cat:'variabile', text:'setează [m:…] la [t:0]', en:'set %1 to %2'}   ex. ['seteaza_var', 's', 0]
       'modifica_var' {cat:'variabile', text:'modifică [m:…] cu [n:1]', en:'change %1 by %2'} ex. ['modifica_var', 's', 1]
           la fiecare scriere: ctx.noteaza('var', {nume, valoare})
       'plus' '[n:] + [n:]' · 'minus' '[n:] - [n:]' · 'ori' '[n:] * [n:]' · 'impartit' '[n:] / [n:]' ·
       'mod' '[n:] mod [n:]' · 'rotunjeste' 'rotunjește [n:]'   (cat:'operatori', forma:'raportor')
           ex. ['mod', '', 10, {s:{0:['var:n']}}]
       'daca' {cat:'control', forma:'c', text:'dacă [b] atunci', en:'if %1 then'}
           ex. ['daca', {s:{0:['egal', '', 0, {s:{0:['mod', '', 3, {s:{0:['var:i']}}]}}]}, guri:[[['modifica_var', 'k', 1]]]}]
     paleta(ids, variabile) → ids         inserează după ultimul bloc din Control/Operatori… raportoarele variabilelor
                                          (alfabetic) și „setează” / „modifică” (ex. paleta(['steag','repeta'], ['s','i']))
     creeaza(el, o) → instanța            ca SimScratchControl.creeaza, plus o.variabile ({nume: valoare}), o.deCreat
                                          ([nume] pregătite ascuns, apar după „Creează o variabilă”), o.casete (implicit da)
     leaga(inst, {variabile, deCreat, casete}) → inst   (pe o instanță făcută altfel; o dată)
     tipuri.scratch                       ca SimScratchControl.tipuri.scratch (aceleași câmpuri Q) + Q.variabile,
                                          Q.deCreat, Q.casete, Q.dupaRezolvare (1.1). La „Rulează testele”, fiecare
                                          rulare a testelor pornește cu variabilele din Q.variabile (nu cu cele de pe
                                          ecran). În teste, S (al treilea argument al lui ok) = inst.stare(), cu
                                          S.variabileCreate (1.1).
     ruleaza(P, {variabile, cadre, personaj}) → {variabile:{…la final}, spuse, terminat, U}
                                          programul rulat de la steag, cu variabilele de pornire date (pentru teste);
                                          fără să atingă ce e pe ecran
     cuValoare(P, nume, valoare) → P'     copie a programului în care PRIMUL „setează <nume> la …” are altă valoare
                                          (ca elevul care schimbă numărul și apasă steagul)
     scrieri(U, nume) → [valoare, …]      valorile scrise în variabilă, în ordine (din U.evenimente)
     valori(inst) → {nume: valoare}       variabilele de ACUM ale instanței (cele din casete)
     caCast: {numar(v), text(v)}          conversiile scratch-vm (Cast.toNumber, Cast.toString), pentru probe
   ATENȚIE (pentru cine scrie teste): SimScratch.urma(...) chemat direct, în afara lui ruleaza() și a „Rulează
   testele”, folosește variabilele instanței pornite ultima. În teste folosiți SimScratchVariabile.ruleaza.
*/
(function () {
  'use strict';
  if (window.SimScratchVariabile) return;
  const SS = window.SimScratch, SC = window.SimScratchControl;
  if (!SS || !SC) throw new Error('scratch-variabile.js: încarcă întâi lectii/_sim/scratch.js și scratch-control.js');
  const VERSIUNE = '1.2 (02.11.2026)';

  /* ---------------- conversiile scratch-vm (Cast) ---------------- */
  const numar = (v) => { if (typeof v === 'number') return Number.isNaN(v) ? 0 : v; if (typeof v === 'boolean') return v ? 1 : 0; const n = Number(v); return Number.isNaN(n) ? 0 : n; };
  const text = (v) => String(v == null ? '' : v);
  const laBool = (v) => { if (typeof v === 'boolean') return v; if (typeof v === 'string') { const s = v.toLowerCase(); return !(v === '' || v === '0' || s === 'false'); } return Boolean(v); };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  /* 1.2: fără departajare pe codul literei — sort() e stabil, deci la egalitate („K” / „k”) rămâne ordinea creării,
     ca în Scratch (live_var6.json V1-V2) */
  const alfabetic = (a, b) => a.localeCompare(b, 'ro', {sensitivity: 'base'});

  /* ---------------- depozitele de variabile ----------------
     Fiecare instanță are depozitul ei (ce arată casetele). O rulare (contextul unui Motor din scratch.js) se leagă de un
     depozit la prima atingere a unei variabile: în timpul lui ruleaza() / „Rulează testele” → un depozit NOU, cu valorile
     de pornire cerute; altfel → depozitul instanței pornite ultima (steag, clic pe bloc, „Pas cu pas”). */
  const LEG = new WeakMap();
  let FORTAT = null;        // {init:{…}, ultim:depozit} cât rulează ruleaza() sau verifica()
  let ACTIV = null;         // depozitul instanței pornite ultima
  const DEP = new WeakMap(); // inst -> depozit
  function depozitNou(init, inst) {
    const d = {vals: {}, ordine: [], local: {}, ver: 0, inst: inst || null};
    Object.keys(init || {}).forEach(n => { d.vals[n] = init[n]; d.ordine.push(n); });
    return d;
  }
  function dep(ctx) {
    let d = LEG.get(ctx);
    if (d) return d;
    if (FORTAT) { d = depozitNou(FORTAT.init); FORTAT.ultim = d; }
    else d = ACTIV || depozitNou({});
    LEG.set(ctx, d);
    return d;
  }
  const citeste = (ctx, nume) => { const d = dep(ctx); return Object.prototype.hasOwnProperty.call(d.vals, nume) ? d.vals[nume] : 0; };
  function scrie(ctx, nume, val) {
    const d = dep(ctx);
    if (!Object.prototype.hasOwnProperty.call(d.vals, nume)) d.ordine.push(nume);
    d.vals[nume] = val;
    d.ver++;
    ctx.noteaza('var', {nume, valoare: val});
  }

  /* ---------------- blocurile ---------------- */
  const liber = (id) => !SS.def(id);
  function variabila(nume) {
    const id = 'var:' + nume;
    if (liber(id)) SS.bloc(id, {cat: 'variabile', forma: 'raportor', text: String(nume).replace(/\[/g, '(').replace(/\]/g, ')'), en: String(nume), valoare(ctx) { return citeste(ctx, nume); }});
    return id;
  }
  if (liber('seteaza_var')) SS.bloc('seteaza_var', {cat: 'variabile', text: 'setează [m:s] la [t:0]', en: 'set %1 to %2', *executa(ctx, v) { scrie(ctx, v[0], v[1]); }});
  if (liber('modifica_var')) SS.bloc('modifica_var', {cat: 'variabile', text: 'modifică [m:s] cu [n:1]', en: 'change %1 by %2', *executa(ctx, v) { scrie(ctx, v[0], numar(citeste(ctx, v[0])) + numar(v[1])); }});
  const op = (id, t, en, f) => { if (liber(id)) SS.bloc(id, {cat: 'operatori', forma: 'raportor', text: t, en, valoare(ctx, v) { return f(v); }}); };
  op('plus', '[n:] + [n:]', '%1 + %2', v => numar(v[0]) + numar(v[1]));
  op('minus', '[n:] - [n:]', '%1 - %2', v => numar(v[0]) - numar(v[1]));
  op('ori', '[n:] * [n:]', '%1 * %2', v => numar(v[0]) * numar(v[1]));
  op('impartit', '[n:] / [n:]', '%1 / %2', v => numar(v[0]) / numar(v[1]));
  op('mod', '[n:] mod [n:]', '%1 mod %2', v => { const n = numar(v[0]), m = numar(v[1]); let r = n % m; if (r / m < 0) r += m; return r; });
  op('rotunjeste', 'rotunjește [n:]', 'round %1', v => Math.round(numar(v[0])));
  if (liber('daca')) SS.bloc('daca', {cat: 'control', forma: 'c', text: 'dacă [b] atunci', en: 'if %1 then', *executa(ctx, v, nod) {
    if (laBool(v[0])) yield* ctx.ruleaza((nod.guri && nod.guri[0]) || []);
  }});

  /* lista ▾ din „setează” / „modifică”: variabilele instanței în care lucrezi, alfabetic */
  function listaVar(d) { return d.ordine.slice().sort(alfabetic); }
  function puneLista(d) {
    const l = listaVar(d);
    if (!l.length) return;
    ['seteaza_var', 'modifica_var'].forEach(id => { const def = SS.def(id); if (def && def.campuri[0]) def.campuri[0].opt = l.slice(); });
  }
  /* blocurile din PALETĂ arată prima variabilă alfabetic (ca Scratch): se pune înainte de crearea instanței */
  function pregateste(variabile, deCreat) {
    let l = Object.keys(variabile || {}).sort(alfabetic);
    /* 1.1: exercițiu fără variabile → blocurile (ascunse până la prima creare) arată prima variabilă de creat */
    if (!l.length) l = (deCreat || []).slice().sort(alfabetic);
    if (!l.length) return;
    ['seteaza_var', 'modifica_var'].forEach(id => { const def = SS.def(id); if (def && def.campuri[0]) { def.campuri[0].imp = l[0]; def.campuri[0].opt = l.slice(); } });
    l.forEach(variabila);
  }
  /* raportoarele de variabile pomenite într-un program (['var:s'] oriunde) se înregistrează înainte de desen / rulare */
  function inregistreaza(P) {
    const w = (b) => {
      if (!Array.isArray(b)) return;
      if (typeof b[0] === 'string' && b[0].indexOf('var:') === 0) variabila(b[0].slice(4));
      const e = b[b.length - 1];
      if (e && typeof e === 'object' && !Array.isArray(e)) { (e.guri || []).forEach(g => (g || []).forEach(w)); Object.values(e.s || {}).forEach(w); }
    };
    (P || []).forEach(sc => ((sc && sc.b) || []).forEach(w));
  }
  function paleta(ids, variabile) {
    const vs = (variabile || []).slice().sort(alfabetic).map(variabila);
    return ids.concat(vs, ['seteaza_var', 'modifica_var'].filter(x => ids.indexOf(x) < 0));
  }

  /* ---------------- CSS (prefix ssv-) ---------------- */
  const CSS = `
.ssv-casete{position:absolute;left:1.5%;top:2%;display:flex;flex-direction:column;align-items:flex-start;gap:3px;pointer-events:none;z-index:2}
.ssv-cas{display:inline-flex;align-items:center;gap:5px;background:#E6F0FF;border:1px solid #C3CCD8;border-radius:4px;padding:2px 4px;font:700 11px/1.1 "Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif;color:#575E75;white-space:nowrap;max-width:96%}
.ssv-cas .v{display:inline-block;min-width:32px;padding:2px 5px;border-radius:4px;background:#FF8C1A;color:#fff;text-align:center;font-weight:500;overflow:hidden;text-overflow:ellipsis;max-width:120px}
.ss-lista .ss-b[data-id^="var:"]{display:flex;width:max-content;min-width:44px}
.ss-lista .ss-b[data-id^="var:"] > .ss-rand{justify-content:center}
.ssv-creeaza{display:block;margin:2px 0 calc(var(--ss-u,.68)*16px);min-height:34px;padding:6px 12px;border:1px solid #C6CCD6;border-radius:6px;background:#fff;color:#575E75;font:500 12px/1.2 "Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif;cursor:pointer;touch-action:manipulation}
.ssv-creeaza:hover,.ssv-creeaza:focus-visible{background:#F2F5FA}
.ssv-fundal{position:fixed;inset:0;z-index:2147482000;background:rgba(76,151,255,.55);display:flex;align-items:flex-start;justify-content:center;padding:max(16px,12vh) 16px 16px;box-sizing:border-box;overflow:auto}
.ssv-fer{width:min(330px,100%);background:#fff;border-radius:8px;box-shadow:0 0 0 4px rgba(255,255,255,.35);overflow:hidden;font-family:"Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif;color:#575E75}
.ssv-cap{position:relative;background:#855CD6;color:#fff;text-align:center;font:500 15px/1.2 inherit;padding:12px 40px}
.ssv-x{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:50%;border:0;background:rgba(0,0,0,.18);color:#fff;font:700 15px/1 inherit;cursor:pointer}
.ssv-corp{padding:14px 18px 16px;font-size:14px}
.ssv-corp label.n{display:block;margin:0 0 6px}
.ssv-corp input[type=text]{width:100%;box-sizing:border-box;height:38px;border:1px solid #C6CCD6;border-radius:6px;padding:0 10px;font:400 16px/1 inherit;color:#575E75;-webkit-user-select:text;user-select:text}
.ssv-corp input[type=text]:focus{outline:0;border:2px solid #575E75}
.ssv-radio{display:flex;flex-wrap:wrap;gap:6px 14px;margin:12px 0 0}
.ssv-radio label{display:inline-flex;align-items:center;gap:5px;min-height:32px;cursor:pointer}
.ssv-radio input{width:18px;height:18px;margin:0}
.ssv-but{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
.ssv-but button{min-height:38px;min-width:64px;padding:0 14px;border-radius:6px;font:700 14px/1 inherit;cursor:pointer}
.ssv-but .r{background:#fff;border:1px solid #C6CCD6;color:#575E75}
.ssv-but .ok{background:#855CD6;border:1px solid #855CD6;color:#fff}
.ssv-mesaj{position:fixed;left:50%;top:max(16px,12vh);transform:translateX(-50%);width:min(340px,calc(100vw - 32px));box-sizing:border-box;z-index:2147482001;background:#fff;border:2px solid #855CD6;border-radius:8px;padding:10px 12px;font:400 13px/1.35 "Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif;color:#3D4458;box-shadow:0 4px 14px rgba(0,0,0,.18)}
.ssv-mesaj button{display:block;margin:8px 0 0 auto;min-height:34px;min-width:56px;border:1px solid #855CD6;border-radius:6px;background:#855CD6;color:#fff;font:700 13px/1 inherit;cursor:pointer}
.ssv-val{position:absolute;z-index:15;background:#fff;border:1px solid #C6CCD6;border-radius:6px;padding:4px 10px;min-width:20px;text-align:center;font:500 12px/1.2 "Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif;color:#575E75;box-shadow:0 2px 6px rgba(0,0,0,.15);pointer-events:none}
`;
  function stil() {
    if (document.getElementById('ssv-css')) return;
    const e = document.createElement('style');
    e.id = 'ssv-css';
    e.textContent = CSS;
    document.head.appendChild(e);
  }

  /* ---------------- legarea unei instanțe ---------------- */
  function leaga(inst, o) {
    if (!inst || DEP.has(inst)) return inst;
    o = o || {};
    stil();
    const d = depozitNou(o.variabile || {}, inst);
    const deCreat = (o.deCreat || []).filter(n => !Object.prototype.hasOwnProperty.call(d.vals, n));
    deCreat.forEach(variabila);
    const casete = o.casete !== false;
    DEP.set(inst, d);
    const el = inst.element, root = el.querySelector('.ss');
    const $ = (s) => root.querySelector(s);
    const pers = () => { const s = inst.stare(); return {x: s.x, y: s.y, directie: s.directie}; };

    /* pornirea pe ecran (steag, clic pe bloc, paleta) → rulările noi folosesc depozitul ăsta */
    inst.on('pornit', () => { ACTIV = d; });
    /* orice atingere în instanță: „Pas cu pas” nu anunță pornirea; listele ▾ iau variabilele de aici */
    let jos = null;
    el.addEventListener('pointerdown', (e) => {
      ACTIV = d; puneLista(d);
      inchideValoarea();
      const b = e.target && e.target.closest ? e.target.closest('.ss-b') : null;
      jos = b ? {b, x: e.clientX, y: e.clientY, t: Date.now()} : null;
    }, true);
    el.addEventListener('keydown', () => { ACTIV = d; puneLista(d); }, true);

    /* „Rulează testele”: fiecare rulare a testelor pornește cu variabilele de pornire ale exercițiului */
    const v0 = inst.verifica;
    inst.verifica = function () {
      const prev = FORTAT;
      FORTAT = {init: Object.assign({}, o.variabile || {})};
      try { return v0.apply(inst, arguments); } finally { FORTAT = prev; }
    };

    /* ---- casetele de pe scenă ---- */
    let cutieCasete = null, aratat = -1;
    function deseneazaCasete() {
      if (!casete) return;
      const sc = $('.ss-scena');
      if (!sc) return;
      if (!cutieCasete || !cutieCasete.isConnected) { cutieCasete = document.createElement('div'); cutieCasete.className = 'ssv-casete'; cutieCasete.setAttribute('aria-label', 'Casetele variabilelor'); sc.appendChild(cutieCasete); }
      const pn = (inst.stare && root.querySelector('.ss-info input.nume')) ? root.querySelector('.ss-info input.nume').value : 'Sprite1';
      cutieCasete.innerHTML = d.ordine.map(n => `<div class="ssv-cas" data-v="${esc(n)}"><span>${esc(d.local[n] ? pn + ': ' + n : n)}</span><span class="v">${esc(text(d.vals[n]))}</span></div>`).join('');
      aratat = d.ver;
    }
    (function bucla() {
      if (!el.isConnected && aratat !== -1) return;
      if (d.ver !== aratat) deseneazaCasete();
      requestAnimationFrame(bucla);
    })();
    deseneazaCasete();

    /* ---- butonul „Creează o variabilă” (în paletă, la începutul categoriei Variabile) ---- */
    const ascunde = () => {
      deCreat.forEach(n => { if (Object.prototype.hasOwnProperty.call(d.vals, n)) return; root.querySelectorAll('.ss-lista .ss-b').forEach(b => { if (b.dataset.id === 'var:' + n) b.style.display = 'none'; }); });
      /* 1.1: fără nicio variabilă, Scratch nu arată „setează” / „modifică” în paletă (live_var5.json F1); apar după prima creare (F2) */
      const nimic = !d.ordine.length;
      root.querySelectorAll('.ss-lista .ss-b[data-id="seteaza_var"], .ss-lista .ss-b[data-id="modifica_var"]').forEach(b => {
        if (nimic) b.style.display = 'none'; else if (b.style.display === 'none') b.style.display = '';
      });
    };
    /* 1.1: numele create de elev cu butonul (testele le citesc din S.variabileCreate) */
    const create = [];
    const st0 = inst.stare;
    if (typeof st0 === 'function') inst.stare = function () { return Object.assign(st0.apply(inst, arguments), {variabileCreate: create.slice()}); };
    function butonul() {
      const L = $('.ss-lista');
      if (!L) return;
      const h = L.querySelector('h4[data-cat="variabile"]');
      if (!h) return;
      if (!(h.nextElementSibling && h.nextElementSibling.classList.contains('ssv-creeaza'))) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ssv-creeaza';
        b.textContent = 'Creează o variabilă';
        b.addEventListener('click', fereastra);
        h.after(b);
      }
      ascunde();
    }
    const L0 = $('.ss-lista');
    if (L0 && window.MutationObserver) new MutationObserver(() => butonul()).observe(L0, {childList: true});
    butonul();

    /* 1.1: crearea unei variabile (butonul „Creează o variabilă”, „Arată rezolvarea”, rezolva) → true dacă raportorul e în paletă */
    function creeazaVar(n, local) {
      variabila(n);
      d.vals[n] = 0; d.ordine.push(n); if (local) d.local[n] = true; d.ver++;
      create.push(n);
      puneLista(d);
      ascunde();
      paletaPe(listaVar(d)[0]);
      let inPaleta = false;
      root.querySelectorAll('.ss-lista .ss-b').forEach(b => { if (b.dataset.id === 'var:' + n) { b.style.display = ''; inPaleta = true; } });
      return inPaleta;
    }
    /* 1.2 (punctul O): „setează” / „modifică” din PALETĂ trec pe variabila `nume` (prima, în ordinea lui Scratch).
       Modelul paletei din scratch.js 1.4 se schimbă doar din lista ▾ a blocului: apăs pe ▾ (pointerdown pe câmp,
       pointerup pe fereastră, ca un clic de mouse), aleg `nume` din meniul deschis — totul în același pas, deci
       meniul nu se desenează; paleta se redesenează din model, iar butonul „Creează o variabilă” se pune la loc.
       Apăsarea nu urcă mai sus de .ss (opreste) și focusul revine unde era. */
    function paletaPe(nume) {
      if (nume == null) return;
      const fa = document.activeElement;
      let schimbat = false;
      ['seteaza_var', 'modifica_var'].forEach(id => {
        const b = root.querySelector(`.ss-lista .ss-b[data-id="${id}"]`);
        const p = b && b.querySelector(':scope > .ss-rand > .ss-dd[data-k="0"]');
        if (!p || p.textContent.replace(/\s*▾\s*$/, '') === nume) return;
        const r = p.getBoundingClientRect();
        const o = {bubbles: true, cancelable: true, pointerId: 7025, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1, clientX: r.left + 2, clientY: r.top + 2};
        const opreste = (e) => e.stopPropagation();
        root.addEventListener('pointerdown', opreste);
        try { p.dispatchEvent(new PointerEvent('pointerdown', o)); } finally { root.removeEventListener('pointerdown', opreste); }
        window.dispatchEvent(new PointerEvent('pointerup', Object.assign({}, o, {buttons: 0})));
        const m = document.querySelector('.ss-meniu');
        const x = m && [...m.querySelectorAll('button')].find(e => e.textContent === nume);
        if (x) { x.click(); schimbat = true; } else if (m) m.remove();
      });
      jos = null;
      if (schimbat) butonul();
      if (fa && fa.isConnected && fa !== document.activeElement && fa.focus) fa.focus({preventScroll: true});
    }
    d.creeazaLipsa = (nume) => (nume || []).forEach(n => {
      if (!Object.prototype.hasOwnProperty.call(d.vals, n)) { creeazaVar(n, false); return; }
      /* 1.2: deja pe scenă fără butonul (o scriere dintr-un program): socotită creată, cu raportorul în paletă */
      if (create.indexOf(n) < 0) { create.push(n); root.querySelectorAll('.ss-lista .ss-b').forEach(b => { if (b.dataset.id === 'var:' + n) b.style.display = ''; }); }
    });

    let fer = null;
    function mesaj(t) {
      const m = document.createElement('div');
      m.className = 'ssv-mesaj';
      m.setAttribute('role', 'alertdialog');
      m.innerHTML = `<div>${esc(t)}</div><button type="button">OK</button>`;
      root.appendChild(m);
      const b = m.querySelector('button');
      b.addEventListener('click', () => m.remove());
      b.focus({preventScroll: true});
    }
    function fereastra() {
      if (fer) return;
      fer = document.createElement('div');
      fer.className = 'ssv-fundal';
      fer.innerHTML = `<div class="ssv-fer" role="dialog" aria-label="Variabilă nouă"><div class="ssv-cap">Variabilă nouă<button type="button" class="ssv-x" aria-label="Închide">✕</button></div>
<div class="ssv-corp"><label class="n" for="ssv-in-${Math.random().toString(36).slice(2, 8)}">Numele variabilei:</label><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Numele variabilei">
<div class="ssv-radio"><label><input type="radio" name="ssv-r" value="toate" checked> Pentru toate personajele</label><label><input type="radio" name="ssv-r" value="unul"> Doar pentru acest personaj</label></div>
<div class="ssv-but"><button type="button" class="r">Renunță</button><button type="button" class="ok">OK</button></div></div></div>`;
      const nume = 'ssv-r-' + Math.random().toString(36).slice(2, 8);
      fer.querySelectorAll('input[type=radio]').forEach(r => { r.name = nume; });
      root.appendChild(fer);
      const inp = fer.querySelector('input[type=text]');
      fer.querySelector('label.n').htmlFor = inp.id = 'ssv-in-' + nume;
      const inchide = () => { if (fer) { fer.remove(); fer = null; } };
      const ok = () => {
        const n = String(inp.value).trim();
        const local = fer.querySelector('input[value="unul"]').checked;
        inchide();
        if (!n) return;
        if (Object.prototype.hasOwnProperty.call(d.vals, n)) { mesaj(`O variabilă denumită "${n}" există deja.`); return; }
        const inPaleta = creeazaVar(n, local);
        if (!inPaleta) mesaj(`Variabila „${n}” e creată: o vezi pe scenă și în listele ▾ ale blocurilor „setează” și „modifică”. În pagină, blocul ei rotunjit apare în paletă doar dacă exercițiul îl cere; în Scratch apare mereu.`);
      };
      fer.querySelector('.ok').addEventListener('click', ok);
      fer.querySelector('.r').addEventListener('click', inchide);
      fer.querySelector('.ssv-x').addEventListener('click', inchide);
      inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); ok(); } else if (e.key === 'Escape') inchide(); });
      fer.addEventListener('pointerdown', (e) => e.stopPropagation());
      setTimeout(() => inp.focus({preventScroll: true}), 0);
    }

    /* ---- clic pe un raportor: cutia cu valoarea (ca Scratch) ---- */
    let cutieVal = null;
    function inchideValoarea() { if (cutieVal) { cutieVal.remove(); cutieVal = null; } }
    function valoareDin(b) {
      const id = b.dataset.id, def = SS.def(id);
      if (!def || !def.valoare) return undefined;
      const v = [];
      b.querySelectorAll(':scope > .ss-rand > .ss-slot').forEach(sl => {
        const k = +sl.dataset.k;
        const in2 = sl.querySelector(':scope > .ss-b');
        if (in2) v[k] = valoareDin(in2);
        else if (sl.classList.contains('ss-golb')) v[k] = '';
        else v[k] = sl.textContent.replace(/\s*▾\s*$/, '').replace(/ /g, ' ');
      });
      const ctx = {personaj: pers(), noteaza() {}};
      LEG.set(ctx, d);
      return def.valoare(ctx, v, null);
    }
    el.addEventListener('pointerup', (e) => {
      const j = jos; jos = null;
      /* o apăsare lungă (pe telefon: meniul blocului) sau o tragere nu arată valoarea */
      if (!j || Math.abs(e.clientX - j.x) > 6 || Math.abs(e.clientY - j.y) > 6 || Date.now() - j.t > 600) return;
      let b = j.b;
      if (b.dataset.forma !== 'raportor') return;
      /* doar raportorul de sine stătător: în paletă sau singur în zona de cod (într-un bloc, clicul rulează stiva) */
      const inPaleta = !!b.closest('.ss-lista');
      if (!inPaleta) { if (b.parentElement && b.parentElement.closest('.ss-b')) return; const sc = b.closest('.ss-script'); if (!sc || sc.children.length !== 1) return; }
      if (b.querySelector('input')) return;
      let val;
      try { val = valoareDin(b); } catch (er) { return; }
      if (val === undefined) return;
      setTimeout(() => {
        inchideValoarea();
        if (!b.isConnected) { b = null; }
        const rr = root.getBoundingClientRect(), r = (b || j.b).getBoundingClientRect();
        cutieVal = document.createElement('div');
        cutieVal.className = 'ssv-val';
        cutieVal.setAttribute('role', 'status');
        cutieVal.textContent = text(val);
        root.appendChild(cutieVal);
        cutieVal.style.left = Math.max(0, Math.min(r.left - rr.left, rr.width - cutieVal.offsetWidth - 2)) + 'px';
        cutieVal.style.top = (r.bottom - rr.top + 4) + 'px';
      }, 0);
    });
    puneLista(d);
    return inst;
  }

  function creeaza(el, o) {
    o = o || {};
    pregateste(o.variabile, o.deCreat);
    inregistreaza(o.program);
    return leaga(SC.creeaza(el, o), o);
  }
  const tipScratch = {
    render(Q, body, api) {
      pregateste(Q.variabile, Q.deCreat);
      [Q.program, Q.start, Q.solutie, Q.gresit].forEach(inregistreaza);
      /* 1.1 (punctul J): după „Arată rezolvarea”, privirea la casete, nu la pisică (doar cu casete) */
      const cuCasete = Q.casete !== false;
      const api2 = (!api || !cuCasete) ? api : new Proxy(api, {get(t, k) {
        if (k === 'giveUp') return (m, ...r) => t.giveUp(Q.dupaRezolvare || String(m == null ? '' : m).replace('privește ce face pisica', 'privește casetele de pe scenă'), ...r);
        /* „Arată rezolvarea” pune și variabilele de creat (ca un elev care le-a creat), apoi programul corect */
        if (k === 'revealButton') return (cb, ...r) => t.revealButton(() => { const d = body._ss && DEP.get(body._ss); if (d && d.creeazaLipsa) d.creeazaLipsa(Q.deCreat); return cb(); }, ...r);
        const v = t[k];
        return typeof v === 'function' ? v.bind(t) : v;
      }});
      SC.tipuri.scratch.render(Q, body, api2);
      if (body._ss) leaga(body._ss, {variabile: Q.variabile, deCreat: Q.deCreat, casete: Q.casete});
    },
    rezolva(Q, body, api) { const d = body._ss && DEP.get(body._ss); if (d && d.creeazaLipsa) d.creeazaLipsa(Q.deCreat); return SC.tipuri.scratch.rezolva(Q, body, api); },
    gresit(Q, body, api) { return SC.tipuri.scratch.gresit(Q, body, api); }
  };

  /* ---------------- pentru teste ---------------- */
  function ruleaza(P, o) {
    o = o || {};
    inregistreaza(P);
    const prev = FORTAT;
    FORTAT = {init: Object.assign({}, o.variabile || {})};
    try {
      const pz = o.personaj || {};
      const U = SS.urma(P, {x: pz.x || 0, y: pz.y || 0, directie: pz.directie != null ? pz.directie : 90, cadre: o.cadre || 900});
      const d = FORTAT.ultim || depozitNou(o.variabile || {});
      return {variabile: Object.assign({}, d.vals), spuse: U.spuse, terminat: U.terminat, U};
    } finally { FORTAT = prev; }
  }
  const ext = (b) => { const e = b[b.length - 1]; return e && typeof e === 'object' && !Array.isArray(e) ? e : null; };
  function cuValoare(P, nume, valoare) {
    const Q = JSON.parse(JSON.stringify(P || []));
    let gata = false;
    const w = (lista) => lista.forEach(b => {
      if (gata) return;
      if (b[0] === 'seteaza_var' && b[1] === nume) { const e = ext(b); if (e && e.s && e.s[1]) delete e.s[1]; b[2] = valoare; gata = true; return; }
      const e = ext(b); if (e && e.guri) e.guri.forEach(w);
    });
    Q.forEach(sc => { if (sc.b[0] && sc.b[0][0] === 'steag') w(sc.b); });
    return Q;
  }
  const scrieri = (U, nume) => ((U && U.evenimente) || []).filter(e => e.tip === 'var' && e.valoare && e.valoare.nume === nume).map(e => e.valoare.valoare);
  const valori = (inst) => { const d = DEP.get(inst); return d ? Object.assign({}, d.vals) : {}; };

  window.SimScratchVariabile = {
    versiune: VERSIUNE, variabila, paleta, creeaza, leaga, tipuri: {scratch: tipScratch},
    ruleaza, cuValoare, scrieri, valori, caCast: {numar, text}, _intern: {laBool, pregateste}
  };
})();
