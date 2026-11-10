/* lectii/_sim/scratch-gestiune.js — SimScratchGestiune 1.2 (09.11.2026): ce-i lipsește lui scratch.js ca să predai GESTIONAREA unei animații:
   costumul următor, testarea (rulările ținute minte), ecranul complet, fișierul (salvezi, închizi fila, deschizi la loc).
   PROPRIETAR: lecția VI/28 (lectii/vi/m4-l28). Se încarcă DUPĂ scratch.js, scratch-control.js, scratch-interfata.js, pe care NU le schimbă.
   Nu depinde de scratch-animatie.js (VI/27, scrisă în același timp). Lecțiile următoare îl pot încărca nemodificat.
   ATENȚIE: nu se încarcă pe aceeași pagină cu `scratch-animatie.js` (VI/27): amândouă definesc „costumul următor”; prima încărcată câștigă.
   1.1 (R1, 09.11.2026): în tipuri.fisier, ferestrele sunt modale (ca în browser și în Windows: până nu alegi un buton al lor, restul nu răspunde),
     Q.incepe {inlocuieste} pornește exercițiul cu „Replace contents…?” deschisă, D.inlocuitNesalvat, Q.gata; butoanele ferestrei de plecare: „Părăsiți / Leave”, „Anulați / Cancel”.
   1.2 (R2, 09.11.2026): steagul = oricare „când se dă click pe ⚑” cu blocuri sub el (ca în Scratch, toate pornesc), nu doar primul; în editorul viu, steag nou pus peste stiva desprinsă: pisica la x 200 (lectii/vi/m4-l28/_verificare/j2_live_h.json, L4).

   Ce adaugă:
   (1) blocul `costum_urmator` (Aspect, „costumul următor”): pisica din pagină are două desene (picioarele), iar sub scenă scrie cât s-a schimbat costumul;
   (2) `rulare(P, o)` și `respecta(P, spec)`: ce face programul, fără ecran, cadru cu cadru (ca testele să judece ce se VEDE, nu blocurile);
   (3) tipuri.scratch: tipul `scratch` din scratch-interfata.js + (1) + rulările apăsate cu steagul, ținute minte (S.rulari);
   (4) tipuri.expunere: (3) + butonul de ecran complet, deasupra scenei;
   (5) tipuri.fisier: bara filei și meniul Fișier, ferestrele „Salvare ca”, „Deschidere”, „Replace contents…”, „numele există deja”; nu e implicat scratch.js.

   FIDELITATEA (probat în editorul VIU, Chromium headless, profil temporar, fără cont, 09.11.2026: lectii/vi/m4-l28/_proba/live_vi28*.py → live_vi28*.json):
     - „costumul următor” e în Aspect, fără câmpuri; pisica are 2 costume; după al doilea revine la primul;
     - într-un „repetă”, scena se desenează după fiecare trecere: două mutări din aceeași trecere nu se văd amândouă (doar unde ajunge la sfârșitul trecerii);
     - programele din lecție, rulate în editorul adevărat de câte două ori (x final și schimbările de costum), dau aceleași numere ca aici: _proba/oracol_programe.json, _proba/proba_oracol.py;
     - ecranul complet: butonul din dreapta sus, de deasupra scenei (alt „Intră în mod ecran complet”, apoi „Ieși din mod ecran complet”); rămân doar scena, steagul, Stop și acest buton; x și y nu se văd; Esc iese;
       o animație pornită merge mai departe și după ieșire; Stop o oprește unde a ajuns;
     - meniul Fișier: Nou · Load from your computer · Salvează pe calculatorul tău; numele propus: „Proiect Scratch”, iar după o încărcare, numele fișierului încărcat;
     - Load peste un proiect schimbat: DUPĂ alegerea fișierului apare fereastra browserului „Replace contents of the current project?”; Anulare păstrează proiectul, OK îl înlocuiește; neschimbat = fără fereastră;
       Fișier › Nou peste un proiect schimbat: aceeași fereastră; neschimbat = fără fereastră;
     - închiderea filei: proiect neschimbat = fără întrebare; schimbat = browserul întreabă, CHIAR ȘI după „Salvează pe calculatorul tău” (salvarea pe calculator nu șterge semnul „schimbat”); reîncărcarea fără salvare = zero blocuri.
   ABATERI (spuse în nota de sub paletă sau în fereastră): pisica e desenată mai simplu, iar picioarele ei sunt alt desen decât costumele din Scratch; „Costumul” și „schimbări” de sub scenă sunt DOAR în pagină;
     ecranul complet acoperă doar fereastra browserului; în tipuri.fisier, browserul întreabă mereu unde salvezi (la laborator poate să nu întrebe: fișierul ajunge în Descărcări, lecția spune drumul) și ferestrele sunt desenate de noi, iar cuvintele din ele pot fi altele.

   API (window.SimScratchGestiune) — o schimbare se trece în granița _campaign/.../m5_noapte_08_11/granite/vi_l28.md, cu ora:
     versiune · stil()
     rulare(P, {x, y, directie}?) → {x, y, directie, steag:bool, costume:n, vazute:[x și y după fiecare cadru, fără repetări], cadre, terminat}
     respecta(P, spec?) → {buna:bool, prima, adoua} (spec implicit: {x:200, y:0, costume:10, vazute:10}: pornit de la steag, și din x 0 y 0, și din alt loc, ajunge acolo, se vede mergând, costumul se schimbă)
     monteaza(inst, {spec?}) → C (rulari(), costum(), schimbari(), golesteRularile()); inst.stare() primește S.rulari: [{buna, P, cum}], S.ultimaEBuna (ultima rulare e a programului de ACUM și e bună)
     tipuri.scratch   — câmpurile tipului scratch + spec? · strica?: program stricat, folosit doar de `rezolva` (ca să existe o rulare stricată, la exercițiul „strici dinadins”)
     tipuri.expunere  — ca tipuri.scratch; testele primesc S.complet, S.steagInComplet, S.stopInComplet, S.aFostComplet
     tipuri.fisier    — Q = {q, folder:[nume…], teste:[{ce, msg, ok(D)}], rezolva(D), incepe?:{inlocuieste:nume}, gata?:'text la „Arată-mi răspunsul”', ajutor, why};
                        D = {fila, editor:{cum:'lucrul'|'nou'|'fisier', nume}, schimbat, folder:[{nume, al, inlocuit?}], inchisa, pierdut, salvat, inlocuitNesalvat}
                        (inlocuitNesalvat = s-a apăsat OK la „Replace contents…?” cu animația din editor nesalvată: s-a pierdut)
     Stilul are prefixul `sg-`. Nimic nu se salvează și nimic nu pleacă: 0 scrieri în localStorage / sessionStorage / cookie, 0 cereri.
*/
(function () {
  'use strict';
  if (window.SimScratchGestiune) return;
  const SS = window.SimScratch;
  const VERSIUNE = '1.2 (09.11.2026)';
  const SPEC0 = {x: 200, y: 0, costume: 10, vazute: 10};

  /* FARA > 0 = rulează testele, fără ecran: blocul nu atinge pisica de pe scenă */
  let FARA = 0, VIU = null;
  if (!SS.def('costum_urmator')) {
    SS.bloc('costum_urmator', {cat: 'aspect', forma: 'stiva', text: 'costumul următor', en: 'next costume',
      executa(ctx) { ctx.noteaza('costum', 1); if (!FARA && VIU) VIU(); }});
  }

  function stil() {
    if (document.getElementById('sg-css')) return;
    const s = document.createElement('style');
    s.id = 'sg-css';
    s.textContent = `
.sg-pic{position:absolute;left:0;right:0;bottom:-12%;width:100%;height:auto;pointer-events:none}
.sg-pic .b{display:none}.sg-c2 .sg-pic .a{display:none}.sg-c2 .sg-pic .b{display:inline}
.sg-costum{font:600 12px/1.3 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;padding:3px 8px;background:#F1F4FA;border-top:1px solid #E1E6EE}
.ss-steag~.sg-ecran{margin-left:auto}
.sg-ecran{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;min-width:34px;border:1px solid #C8CCD4;border-radius:6px;background:#fff;cursor:pointer;padding:0;margin-left:auto}
.sg-ecran svg{width:18px;height:18px}
.ss.sg-complet{position:fixed;inset:0;z-index:9000;background:#fff;display:flex;flex-direction:column;margin:0;border:0;border-radius:0}
.sg-complet .ss-lucru,.sg-complet .ss-info,.sg-complet .sg-costum,.sg-complet .ss-urm{display:none!important}
.sg-complet .ss-sus{width:100%;max-width:none;display:flex;flex-direction:column;align-items:center}
.sg-complet .ss-scenacap{width:100%;max-width:min(100vw,calc((100vh - 60px)*4/3));display:flex;align-items:center}
.sg-complet .ss-scena{width:100%;max-width:min(100vw,calc((100vh - 60px)*4/3));aspect-ratio:4/3}
.sg-fw{border:2px solid #855CD6;border-radius:10px;overflow:hidden;background:#fff;color:#16283A;font:500 14px/1.35 "Helvetica Neue","Segoe UI",Arial,sans-serif}
.sg-fila{display:flex;align-items:center;gap:6px;background:#DEE1E6;padding:4px 6px}
.sg-fila b{flex:1;min-width:0;font-weight:600}
.sg-x{min-width:40px;min-height:34px;border:1px solid #9AA3AF;border-radius:6px;background:#fff;font:700 16px/1 inherit;cursor:pointer;color:#16283A}
.sg-bara{background:#855CD6;padding:4px 6px;position:relative}
.sg-btn{min-height:36px;border:1px solid #6B46B8;border-radius:6px;background:#fff;color:#16283A;font:600 14px/1.2 inherit;padding:6px 10px;cursor:pointer}
.sg-bara>.sg-btn{background:#6B46B8;color:#fff;border-color:#fff}
.sg-meniu{display:flex;flex-direction:column;gap:2px;margin-top:4px}
.sg-meniu button{min-height:38px;text-align:left;background:#fff;color:#16283A;border:1px solid #C8CCD4;border-radius:4px;font:600 14px/1.2 inherit;padding:6px 10px;cursor:pointer}
.sg-ed{padding:8px 10px;background:#F1F4FA;border-bottom:1px solid #E1E6EE}
.sg-fol{padding:8px 10px}
.sg-fol h5{font:700 13px/1.3 inherit;margin:0 0 4px}
.sg-fol ul{margin:0;padding:0;list-style:none}
.sg-fol li{padding:3px 0;border-bottom:1px dotted #C8CCD4;word-break:break-word}
.sg-fer{border:2px solid #4E6276;border-radius:8px;background:#fff;margin:8px 10px;padding:8px 10px}
.sg-fer h5{font:700 14px/1.3 inherit;margin:0 0 6px}
.sg-fer input{width:100%;box-sizing:border-box;min-height:38px;border:1px solid #4E6276;border-radius:4px;padding:4px 8px;font:500 16px/1.2 inherit;margin:4px 0;background:#fff;color:#16283A}
.sg-rand{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.sg-lista button{display:block;width:100%;min-height:38px;text-align:left;background:#fff;border:1px solid #C8CCD4;border-radius:4px;margin:2px 0;padding:5px 8px;font:500 14px/1.2 inherit;cursor:pointer;color:#16283A;word-break:break-word}
.sg-mes{color:#B8362E;font-weight:600;margin:4px 0 0}
.sg-inchis{padding:12px 10px;text-align:center}
.sg-reset{margin:6px 10px 8px}
.sg-nota{font-size:12px;color:#4E6276;padding:0 10px 8px}
@media (prefers-color-scheme:dark){.sg-costum{background:#E9EEF4}}`;
    document.head.appendChild(s);
  }

  /* ---- ce face programul, fără ecran ---- */
  function rulare(P, o) {
    FARA++;
    let U;
    try { U = SS.urma(P, o); } finally { FARA--; }
    const pe = {};
    let ultim = null;
    (U.evenimente || []).forEach(e => {
      if (e.tip === 'poz') { pe[e.cadru] = e.valoare; ultim = e.cadru; }
    });
    const cadre = Object.keys(pe).map(Number).sort((a, b) => a - b);
    const vazute = [];
    cadre.forEach(c => { const v = pe[c], u = vazute[vazute.length - 1]; if (!u || u[0] !== v[0] || u[1] !== v[1]) vazute.push(v); });
    const costume = (U.evenimente || []).filter(e => e.tip === 'costum').length;
    return {x: U.x, y: U.y, directie: U.directie, steag: SS.ajutor.cuSteag(P).some(s => s.b.length > 1), costume, vazute, cadre: U.cadre, terminat: U.terminat, ultim};
  }
  function respecta(P, spec) {
    const s = Object.assign({}, SPEC0, spec || {});
    const unu = (o) => {
      const r = rulare(P, o);
      return Object.assign(r, {ok: r.steag && r.terminat && Math.abs(r.x - s.x) < 0.5 && Math.abs(r.y - s.y) < 0.5 && r.costume >= s.costume && r.vazute.length >= s.vazute});
    };
    const prima = unu({x: 0, y: 0, directie: 90}), adoua = unu({x: -120, y: 60, directie: 90});
    return {buna: prima.ok && adoua.ok, prima, adoua};
  }
  /* programul fără locul scripturilor din zona de cod: două programe la fel, puse în alt loc, sunt același program */
  const fara = (P) => JSON.stringify((P || []).map(s => s.b));

  /* ---- pe instanță ---- */
  const PICIOARE = '<svg class="sg-pic" viewBox="0 0 60 16" aria-hidden="true"><g stroke="#8a5300" stroke-width="2" fill="#F7A21B"><g class="a"><path d="M18 0 L12 13 L19 14 L25 2 Z"/><path d="M36 2 L42 14 L49 13 L43 0 Z"/></g><g class="b"><path d="M22 0 L19 14 L27 14 L29 2 Z"/><path d="M31 2 L33 14 L41 14 L38 0 Z"/></g></g></svg>';
  function monteaza(inst, optiuni) {
    stil();
    const o = optiuni || {};
    const root = inst.element.querySelector('.ss');
    const sp = root.querySelector('.ss-sprite');
    if (sp && !sp.querySelector('.sg-pic')) sp.insertAdjacentHTML('beforeend', PICIOARE);
    let cos = 1, sch = 0, rul = [];
    const info = root.querySelector('.ss-info');
    const et = document.createElement('div');
    et.className = 'sg-costum';
    et.setAttribute('aria-live', 'off');
    if (info) info.insertAdjacentElement('afterend', et);
    const scrie = () => { et.textContent = `Costumul ${cos} din 2 · schimbări de costum: ${sch} (asta scrie doar în pagină)`; if (sp) sp.classList.toggle('sg-c2', cos === 2); };
    const unPas = () => { cos = cos === 1 ? 2 : 1; sch++; scrie(); };
    inst.on('pornit', (e) => {
      if (e.cum === 'steag') {
        sch = 0;
        const P = inst.program();
        rul.push({P: fara(P), buna: respecta(P, o.spec).buna, cum: 'steag'});
      }
      VIU = unPas;
      scrie();
    });
    /* doar instanța asta pune mâna pe pisică, cât e pornită; verifica() rulează fără ecran */
    const ver = inst.verifica;
    inst.verifica = function () { FARA++; try { return ver.apply(inst, arguments); } finally { FARA--; } };
    const urm = inst.urma;
    inst.urma = function () { FARA++; try { return urm.apply(inst, arguments); } finally { FARA--; } };
    const st0 = inst.stare;
    const extra = {};
    inst.stare = function () {
      const P = inst.program(), u = rul[rul.length - 1];
      return Object.assign(st0.call(inst), {rulari: rul.slice(), ultimaEBuna: !!(u && u.buna && u.P === fara(P))}, extra);
    };
    scrie();
    return {rulari: () => rul, costum: () => cos, schimbari: () => sch, golesteRularile: () => { rul = []; }, reia: () => { cos = 1; sch = 0; scrie(); }, extra};
  }

  /* ---- tipul de bază: scratch-interfata (paza paletei și a pisicii) + costumul + rulările ---- */
  const baza = () => window.SimScratchInterfata.tipuri.scratch;
  const NOTA = 'În pagină sunt doar blocurile de azi, iar pisica e desenată mai simplu: picioarele ei stau în locul celor două costume din Scratch. În Scratch, fiecare categorie are mult mai multe blocuri. „Pas cu pas” e doar în pagină.';
  const tipScratch = {
    render(Q, body, api) {
      /* „Arată-mi răspunsul” pune soluția: rulările ei se socotesc, ca testele să arate adevărul despre programul de acum */
      const apiP = Object.assign({}, api, {revealButton(fn) { api.revealButton(() => {
        const C = body._sg;
        if (C) {
          if (Q.strica) C.rulari().push({P: fara(Q.strica), buna: false, cum: 'arat'});
          if (Q.solutie) C.rulari().push({P: fara(Q.solutie), buna: true, cum: 'arat'});
          if (Q.laArata) Q.laArata(C);
        }
        fn();
      }); }});
      baza().render(Object.assign({}, Q, {nota: Q.nota || NOTA}), body, apiP);
      body._sg = monteaza(body._ss, {spec: Q.spec});
      /* pe telefon nu există Ctrl+Z, iar un program tras peste paletă se pierde (defect știut al lui scratch.js): butonul ăsta îl aduce înapoi */
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sg-btn sg-reset';
      b.textContent = 'Ia-o de la capăt';
      const g = body.querySelector('.ss-gazda');
      if (g) g.insertAdjacentElement('afterend', b);
      b.addEventListener('click', () => {
        const i = body._ss;
        i.opreste();
        i.seteaza(Q.program || []);
        i.punePersonaj(Object.assign({x: 0, y: 0, directie: 90}, Q.personaj || {}));
        body._sg.golesteRularile();
        body._sg.reia();
        if (body._sge) body._sge.pune(false);
      });
    },
    rezolva(Q, body) {
      const i = body._ss;
      if (Q.strica) { i.seteaza(Q.strica); i.steag(); i.opreste(); }
      baza().rezolva(Q, body);
    },
    gresit(Q, body) {
      body._sg.golesteRularile();
      baza().gresit(Q, body);
    }
  };

  /* ---- ecranul complet ---- */
  const ICON_IN = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 7V2h5M13 2h5v5M18 13v5h-5M7 18H2v-5" fill="none" stroke="#4C5A70" stroke-width="2"/></svg>';
  const ICON_OUT = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 2v5H2M18 7h-5V2M13 18v-5h5M2 13h5v5" fill="none" stroke="#4C5A70" stroke-width="2"/></svg>';
  function monteazaEcran(inst, C) {
    const root = inst.element.querySelector('.ss'), cap = root.querySelector('.ss-scenacap');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sg-ecran';
    cap.appendChild(b);
    const E = C.extra;
    E.complet = false; E.steagInComplet = 0; E.stopInComplet = 0; E.aFostComplet = false;
    const scrie = () => {
      root.classList.toggle('sg-complet', E.complet);
      b.innerHTML = E.complet ? ICON_OUT : ICON_IN;
      const n = E.complet ? 'Ieși din mod ecran complet' : 'Intră în mod ecran complet';
      b.title = n; b.setAttribute('aria-label', n);
    };
    const pune = (v) => { E.complet = v; if (v) E.aFostComplet = true; scrie(); };
    b.addEventListener('click', () => pune(!E.complet));
    const tasta = (e) => {
      if (!root.isConnected) { document.removeEventListener('keydown', tasta, true); return; }
      if (e.key === 'Escape' && E.complet) { e.stopPropagation(); e.preventDefault(); pune(false); b.focus(); }
    };
    document.addEventListener('keydown', tasta, true);
    inst.on('pornit', (e) => { if (e.cum === 'steag' && E.complet) E.steagInComplet++; });
    inst.on('oprit', (e) => { if (e.mergea && E.complet) E.stopInComplet++; });
    scrie();
    return {pune};
  }
  const tipExpunere = {
    render(Q, body, api) {
      tipScratch.render(Object.assign({}, Q, {pasCuPas: false, laArata(C) { C.extra.steagInComplet = 1; C.extra.stopInComplet = 1; C.extra.aFostComplet = true; if (body._sge) body._sge.pune(false); }}), body, api);
      body._sge = monteazaEcran(body._ss, body._sg);
    },
    rezolva(Q, body) {
      const i = body._ss;
      i.seteaza(Q.solutie);
      body._sge.pune(true);
      i.steag();
      i.opreste();
      body._sge.pune(false);
    },
    gresit(Q, body) { body._sge.pune(false); const E = body._sg.extra; E.steagInComplet = 0; E.stopInComplet = 0; E.aFostComplet = false; }
  };

  /* ---- fișierul: salvezi, închizi fila, deschizi la loc ---- */
  const NUME_INTERZISE = /[\\/:*?"<>|]/;
  const faraExt = (n) => String(n).replace(/\.sb3$/i, '').trim();
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  function stareNoua(Q) {
    return {fila: true, editor: {cum: 'lucrul', nume: null}, schimbat: true, folder: (Q.folder || []).map(n => ({nume: n, al: 'coleg'})), inchisa: 0, pierdut: false, salvat: null, propus: 'Proiect Scratch', inlocuitNesalvat: false};
  }
  /* fereastra de la început (1.1): exercițiul poate porni cu „Replace contents…?” deschisă */
  const fer0 = (Q) => (Q.incepe && Q.incepe.inlocuieste ? {inlocuieste: Q.incepe.inlocuieste} : null);
  const tipFisier = {
    render(Q, body, api) {
      stil();
      if (SS.stil) SS.stil();
      const teste = Q.teste || [];
      let D = stareNoua(Q), fer = fer0(Q), mes = '', meniu = false, atentie = false;
      /* ferestrele sunt modale: un clic în afara lor nu face nimic, doar le amintește (1.1) */
      const at = () => (atentie ? '<p class="sg-mes" aria-live="polite">Fereastra e încă deschisă: alege întâi unul dintre butoanele ei.</p>' : '');
      body.innerHTML = `<div class="sg-gazda"></div><div class="ss-tst" style="margin-top:8px"><div class="lbl">Testele sarcinii · <span class="nr">apasă „Rulează testele”</span></div><ol>${teste.map(t => `<li><span class="s">○</span> ${t.ce}<div class="m" hidden></div></li>`).join('')}</ol></div>`;
      const gazda = body.querySelector('.sg-gazda');
      const marcheaza = (r) => {
        body.querySelectorAll('.ss-tst li').forEach((li, i) => {
          const ok = r ? r[i] : null;
          li.className = ok == null ? '' : ok ? 'ok' : 'no';
          li.querySelector('.s').textContent = ok == null ? '○' : ok ? '✓' : '✗';
          const m = li.querySelector('.m');
          m.hidden = ok !== false;
          m.textContent = ok === false ? teste[i].msg : '';
        });
        const nrr = body.querySelector('.ss-tst .nr');
        if (nrr) nrr.textContent = r ? `${r.filter(Boolean).length} din ${r.length} trec` : 'apasă „Rulează testele”';
      };
      const edText = () => {
        if (D.editor.cum === 'lucrul') return 'În editor: animația ta, cu pisica care fuge' + (D.salvat ? ` (salvată ca ${esc(D.salvat)})` : ', încă nesalvată') + '.';
        if (D.editor.cum === 'nou') return 'În editor: un proiect nou, gol. Pisica e la x 0, y 0 și nu are niciun bloc.';
        return `În editor: fișierul ${esc(D.editor.nume)}, deschis la loc.`;
      };
      const pereche = (nume, cheie) => `<button type="button" class="sg-btn" data-a="${cheie}">${nume}</button>`;
      const desen = () => {
        let h = '<div class="sg-fw">';
        if (D.fila) {
          h += `<div class="sg-fila"><b>Scratch</b><button type="button" class="sg-x" data-a="inchide" aria-label="Închide fila Scratch" title="Închide fila">×</button></div>`;
          h += `<div class="sg-bara"><button type="button" class="sg-btn" data-a="meniu" aria-expanded="${meniu}">Fișier ▾</button>${meniu ? `<div class="sg-meniu"><button type="button" data-a="nou">Nou</button><button type="button" data-a="load">Load from your computer</button><button type="button" data-a="salveaza">Salvează pe calculatorul tău</button></div>` : ''}</div>`;
          h += `<div class="sg-ed">${edText()}</div>`;
        } else {
          h += `<div class="sg-inchis"><p>Fila Scratch e închisă.${D.pierdut ? ' Animația nesalvată s-a pierdut.' : ''}</p>${pereche('Deschide Scratch din nou (Creează)', 'deschide')}</div>`;
        }
        if (fer === 'salvare') {
          h += `<div class="sg-fer" role="dialog" aria-label="Salvare ca"><h5>Salvare ca</h5><label>Numele fișierului:<input class="sg-nume" value="${esc(D.propus)}" autocomplete="off" autocapitalize="off" spellcheck="false"></label><div class="sg-rand">${pereche('Salvare', 'sal-ok')}${pereche('Anulare', 'sal-no')}</div>${mes ? `<p class="sg-mes" aria-live="polite">${esc(mes)}</p>` : ''}${at()}</div>`;
        } else if (fer && fer.exista) {
          h += `<div class="sg-fer" role="dialog" aria-label="Numele există deja"><h5>Numele există deja</h5><p>${esc(fer.exista)}.sb3 există deja. Îl înlocuiești?</p><div class="sg-rand">${pereche('Da', 'ex-da')}${pereche('Nu', 'ex-nu')}</div>${at()}</div>`;
        } else if (fer === 'deschidere') {
          h += `<div class="sg-fer" role="dialog" aria-label="Deschidere"><h5>Deschidere</h5><div class="sg-lista">${D.folder.length ? D.folder.map((f, i) => `<button type="button" data-f="${i}">${esc(f.nume)}.sb3</button>`).join('') : '<p>Folderul e gol.</p>'}</div><div class="sg-rand">${pereche('Anulare', 'des-no')}</div>${at()}</div>`;
        } else if (fer && fer.inlocuieste) {
          h += `<div class="sg-fer" role="dialog" aria-label="Fereastra browserului"><h5>Replace contents of the current project?</h5><div class="sg-rand">${pereche('OK', 'rep-ok')}${pereche('Anulare', 'rep-no')}</div>${at()}</div>`;
        } else if (fer === 'pleci') {
          h += `<div class="sg-fer" role="dialog" aria-label="Browserul întreabă"><h5>Browserul întreabă dacă pleci</h5><p>${D.salvat ? 'Ai salvat animația. Tot întreabă: de când ai deschis proiectul, s-a schimbat ceva.' : 'Ce nu ai salvat se pierde.'}</p><div class="sg-rand">${pereche('Părăsiți / Leave', 'pl-da')}${pereche('Anulați / Cancel', 'pl-nu')}</div>${at()}</div>`;
        }
        h += `<div class="sg-fol"><h5>Folderul de pe calculator</h5><ul>${D.folder.map(f => `<li>${esc(f.nume)}.sb3${f.al === 'coleg' ? (f.inlocuit ? ' (al colegului, înlocuit de tine)' : ' (al colegului)') : ' (al tău)'}</li>`).join('')}</ul></div>`;
        h += `<p class="sg-nota">Ferestrele sunt desenate de noi; pe calculator, cuvintele pot fi altele. Aici, browserul întreabă mereu unde salvezi.</p>`;
        h += `<button type="button" class="sg-btn sg-reset" data-a="reset">Ia-o de la capăt</button></div>`;
        gazda.innerHTML = h;
        marcheaza(null);
      };
      const aplica = (actiune) => { atentie = false; actiune(); desen(); };
      const inlocuieste = (tinta) => {
        if (D.schimbat) fer = {inlocuieste: tinta};
        else faInlocuire(tinta);
      };
      const faInlocuire = (tinta) => {
        fer = null;
        if (D.editor.cum === 'lucrul' && !D.salvat) D.inlocuitNesalvat = true;
        if (tinta === 'nou') { D.editor = {cum: 'nou', nume: null}; D.propus = 'Proiect Scratch'; }
        else { D.editor = {cum: 'fisier', nume: tinta}; D.propus = tinta; }
        D.schimbat = false;
      };
      const salveaza = (nume) => {
        const ex = D.folder.find(f => f.nume.toLowerCase() === nume.toLowerCase());
        if (ex) { D.tentat = nume; fer = {exista: ex.nume}; return; }
        D.folder.push({nume, al: 'tu'});
        D.salvat = nume; D.propus = nume; fer = null; mes = '';
      };
      gazda.addEventListener('click', (e) => {
        const t = e.target.closest('button');
        if (!t) return;
        if (fer && !t.closest('.sg-fer') && t.dataset.a !== 'reset') return aplica(() => { atentie = true; });
        if (t.dataset.f !== undefined) {
          const f = D.folder[+t.dataset.f];
          return aplica(() => { fer = null; inlocuieste(f.nume); });
        }
        const a = t.dataset.a;
        if (a === 'meniu') return aplica(() => { meniu = !meniu; });
        if (a === 'reset') return aplica(() => { D = stareNoua(Q); fer = fer0(Q); mes = ''; meniu = false; });
        if (a === 'inchide') return aplica(() => {
          meniu = false; mes = '';
          if (D.schimbat) fer = 'pleci';
          else { fer = null; D.fila = false; D.inchisa++; }
        });
        if (a === 'pl-da') return aplica(() => { fer = null; D.pierdut = !D.salvat && D.editor.cum === 'lucrul'; D.fila = false; D.inchisa++; });
        if (a === 'pl-nu') return aplica(() => { fer = null; });
        if (a === 'deschide') return aplica(() => { D.fila = true; D.editor = {cum: 'nou', nume: null}; D.schimbat = false; D.propus = 'Proiect Scratch'; fer = null; });
        if (a === 'nou') return aplica(() => { meniu = false; inlocuieste('nou'); });
        if (a === 'load') return aplica(() => { meniu = false; fer = 'deschidere'; });
        if (a === 'salveaza') return aplica(() => { meniu = false; mes = ''; fer = 'salvare'; });
        if (a === 'sal-no' || a === 'des-no') return aplica(() => { fer = null; mes = ''; });
        if (a === 'rep-no') return aplica(() => { fer = null; });
        if (a === 'rep-ok') return aplica(() => { faInlocuire(fer.inlocuieste); });
        if (a === 'ex-nu') return aplica(() => { fer = 'salvare'; D.propus = D.tentat; });
        if (a === 'ex-da') return aplica(() => {
          const ex = D.folder.find(f => f.nume.toLowerCase() === D.tentat.toLowerCase());
          if (ex.al === 'coleg') ex.inlocuit = true;
          D.salvat = ex.nume; D.propus = ex.nume; fer = null;
        });
        if (a === 'sal-ok') return aplica(() => {
          const n = faraExt((gazda.querySelector('.sg-nume') || {}).value || '');
          D.propus = n;
          if (!n) { mes = 'Scrie un nume.'; return; }
          if (NUME_INTERZISE.test(n)) { mes = 'În numele unui fișier nu poți folosi semnele \\ / : * ? " < > |. Scoate-le și apasă iar Salvare.'; return; }
          mes = '';
          salveaza(n);
        });
      });
      body._sgf = {stare: () => D, aplica: (fn) => aplica(() => fn(D)), reset: () => aplica(() => { D = stareNoua(Q); fer = fer0(Q); mes = ''; meniu = false; }),
        rezolva: () => aplica(() => { fer = null; mes = ''; meniu = false; Q.rezolva(D); })};
      desen();
      api.checkButton(() => {
        const r = teste.map(t => { try { return !!t.ok(D); } catch (e) { return false; } });
        marcheaza(r);
        const prim = r.indexOf(false);
        if (prim < 0) api.resolve(true);
        else {
          api.resolve(false, teste[prim].msg);
          api.revealButton(() => {
            body._sgf.rezolva();
            marcheaza(teste.map(t => !!t.ok(D)));
            api.giveUp(Q.gata || 'așa arată gata: fișierul tău e în folder, cel al colegului e neatins, iar în editor e fișierul tău, deschis la loc.');
          });
        }
      }, 'Rulează testele');
    },
    rezolva(Q, body) { body._sgf.rezolva(); },
    gresit(Q, body) { body._sgf.reset(); }
  };

  window.SimScratchGestiune = {versiune: VERSIUNE, stil, rulare, respecta, monteaza, tipuri: {scratch: tipScratch, expunere: tipExpunere, fisier: tipFisier}};
})();
