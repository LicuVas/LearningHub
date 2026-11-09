/* lectii/_sim/scratch-evenimente.js — SimScratchEvenimente 1.0 (09.11.2026): evenimentul „apăs pe personaj”, decizia „dacă” și coliziunea cu un alt personaj, pentru SimScratch.
   PROPRIETAR: lecția V/33 (lectii/v/m5-l33, „Implementez structura alternativă. Evenimente și coliziuni”). Se încarcă DUPĂ scratch.js, scratch-conditie.js și
   scratch-interfata.js, pe care NU le schimbă. V/34 îl poate încărca nemodificat. Granița: _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/v_l33.md.

   Ce adaugă:
   (1) blocurile: 'cand_personaj' (Evenimente), 'daca' și 'daca_altfel' (Control; 'daca' are aceeași definiție ca în scratch-variabile.js), 'atinge_ob' (Detectare, cu al doilea personaj în listă);
   (2) tipul de exercițiu `eveniment` = tipul `scratch` + apăsarea pe pisică + Mingea + o întrebare cu alegere, în aceeași sarcină;
   (3) serie(P, n, o): ce face programul la n apăsări pe pisică, fără ecran (pentru teste: judecă rezultatul, nu drumul, regula 29).

   FIDELITATEA (probat în editorul VIU, Chromium headless, fără cont, 09.11.2026: lectii/v/m5-l33/_proba/live_v33.py → live_v33.json, live_lab.py → live_lab.json):
     - „când se dă click pe acest personaj” pornește programul la APĂSARE, nu la ridicare (x crește cu butonul încă apăsat); steagul nu-l pornește; un clic pe locul gol al scenei nu-l pornește;
     - o apăsare cât programul rulează îl ia de la capăt (la „spune … pentru 2 secunde”: x crește iar, un singur fir);
     - pisica cu un astfel de program, apăsată cu 50 de pași, fuge de sub mouse, deci nu se trage (tragerea începe de la locul apăsării); aici: cât are program la apăsare, pisica nu se trage (ABATERE, la pași mici: în Scratch s-ar putea trage);
     - „dacă” se verifică o singură dată, când programul ajunge la el; locașul gol = fals, gura nu se face niciodată;
     - „atinge marginea?”: de la scratch-conditie.js (praguri măsurate: x ≥ 194 / x ≤ −193, y ≥ 131 / y ≤ −130);
     - „atinge Minge?”: în Scratch, pe pixeli. Aici, TABEL măsurat viu (pisica, direcția 90, mingea de 60 × 60 cu cerc): pentru fiecare diferență de y, de la ce diferență de x se ating. La altă direcție,
       diferența se rotește cu pisica (mingea e rotundă). Eroare: cel mult ~5 unități, nu contează la pași de 50;
     - ABATERE (doar la deget): 16 px în jurul pisicii se socotesc tot pisică, ca să poți apăsa fâșia rămasă când e aproape ieșită din scenă (regula 20).
     - lista din „atinge … ?” are, în ordine: cursorul mouse-ului, marginea, Minge; „atinge cursorul mouse-ului?” e fals în pagină (ca în scratch-conditie.js).
     - Mingea se trage cu mouse-ul sau cu degetul; lăsată în afara scenei, revine. ABATERE spusă pe pagină: în Scratch, după ce o tragi, zona de cod arată programul ei, gol, până apeși Sprite1 sub scenă; aici rămâne programul pisicii.
     - ABATERI MICI, găsite de judecata 1 cu programe noi (_verificare/j1_d.txt, j1_i2.txt, j1_k.txt), niciuna nu dă un verdict fals: mingea la x 150, y 75: în Scratch se atinge la x 150, aici nu (rasă, peste eroarea tabelului);
       marginea oblic, Direcția 45: în Scratch la a 4-a apăsare, aici la a 3-a (aproximarea din scratch-conditie.js); condiție adevărată căzută în cerculețul lui „mergi”: în Scratch 1 pas (x 1, 2, 3), și cu „atinge Minge?”, aici 0 pași;
       „sub mergi” se prinde în Scratch cu vârful blocului de la −14 la +3 (scalat), aici cam de la −16 la −6; condiția lăsată puțin mai sus de locaș: în Scratch cade în cerculeț în 7 din 15 încercări, aici în 1 din 25 (textul de la „Coliziunea: atinge marginea?” o spune); al doilea „dacă”, lăsat cu cursorul pe marginea de jos a primului: în Scratch intră sub el (de la 10 px deasupra marginii în jos), aici intră în gură (sub el abia de la 6 px sub margine; ajutorul atelierului o spune).

   API (window.SimScratchEvenimente) — stabil; o schimbare se trece în graniță, cu ora:
     versiune · stil() · MINGE_SVG (desenul mingii, același ca în .sb3) · atingeMinge({x, y, directie}, {x, y}) → bool (tabelul)
     serie(P, n, {x?, y?, directie?, minge?}) → [{x, y, directie, spuse}, …]  după fiecare apăsare, pornind din {x, y, directie}; minge = {x, y} sau null (implicit: mingea exercițiului deschis)
     dacaDin(P) → [{cond: text („atinge marginea?”, '' dacă locașul e gol), gura: [id…], gura2: [id…]}, …]  din programele cu „când se dă click pe acest personaj”
     tipuri.eveniment — câmpurile tipului `scratch` (paleta, program, personaj, teste, solutie, gresit, nota) +
         minge: {nume:'Minge', x, y} (fără el, nu e minge pe scenă) · clicuri: de câte ori apasă `rezolva` · alegere: {q, o:[…], ok:0} (variantele se amestecă la afișare).
         Testele primesc în al treilea argument, pe lângă stare(): S.clicuri (apăsări de la ultima schimbare a programului), S.ales (textul variantei alese sau null), S.minge ({x, y}).
         pasCuPas e oprit: „Pas cu pas” merge numai de la steag.
*/
(function () {
  'use strict';
  if (window.SimScratchEvenimente) return;
  if (!window.SimScratch) throw new Error('scratch-evenimente.js: încarcă întâi lectii/_sim/scratch.js');
  if (!window.SimScratchConditie) throw new Error('scratch-evenimente.js: încarcă întâi lectii/_sim/scratch-conditie.js');
  if (!window.SimScratchInterfata) throw new Error('scratch-evenimente.js: încarcă întâi lectii/_sim/scratch-interfata.js');
  const SS = window.SimScratch, SC = window.SimScratchConditie, SI = window.SimScratchInterfata;
  const VERSIUNE = '1.0 (09.11.2026)';
  const MINGE_SVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="28" fill="#F2682A" stroke="#B5451A" stroke-width="4"/><path d="M6 22 Q30 34 54 22 M6 38 Q30 26 54 38" fill="none" stroke="#B5451A" stroke-width="3"/></svg>';

  /* [y-ul pisicii față de minge, cel mai mic x față de minge care atinge, cel mai mare] — live_v33.json, H_harta (pas: 10 pe y, 5 pe x) */
  const TABEL = [[-80, -20, -10], [-70, -35, 45], [-60, -40, 50], [-50, -50, 55], [-40, -65, 55], [-30, -75, 60], [-20, -75, 65], [-10, -75, 70], [0, -75, 75], [10, -70, 75], [20, -55, 75], [30, -55, 75], [40, -55, 70], [50, -55, 70], [60, -55, 60], [70, -45, 55], [80, -30, 40]];
  function atingeMinge(p, m) {
    if (!m) return false;
    const a = ((Number(p.directie) - 90) % 360 + 360) % 360 * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const vx = Number(p.x) - m.x, vy = Number(p.y) - m.y;
    const lx = vx * c - vy * s, ly = vx * s + vy * c;
    if (ly < -84 || ly > 84) return false;
    const r = TABEL.reduce((b, t) => (Math.abs(t[0] - ly) < Math.abs(b[0] - ly) ? t : b));
    return lx >= r[1] && lx <= r[2];
  }

  let ALTUL = null;   // mingea exercițiului deschis (ultimul atins); blocurile n-au acces la instanță
  SS.bloc('cand_personaj', {cat: 'evenimente', forma: 'palarie', text: 'când se dă click pe acest personaj', en: 'when this sprite clicked'});
  if (!SS.def('daca')) SS.bloc('daca', {cat: 'control', forma: 'c', text: 'dacă [b] atunci', en: 'if %1 then', *executa(ctx, v, nod) {
    if (SC.laBool(v[0])) yield* ctx.ruleaza((nod.guri && nod.guri[0]) || []);
  }});
  if (!SS.def('daca_altfel')) SS.bloc('daca_altfel', {cat: 'control', forma: 'c', text: 'dacă [b] atunci | altfel', en: 'if %1 then else', *executa(ctx, v, nod) {
    yield* ctx.ruleaza((nod.guri && nod.guri[SC.laBool(v[0]) ? 0 : 1]) || []);
  }});
  SS.bloc('atinge_ob', {cat: 'detectare', forma: 'boolean', text: 'atinge [m:cursorul mouse-ului|marginea|Minge]?', en: 'touching %1?',
    valoare(ctx, v) { return v[0] === 'marginea' ? SC.atingeMarginea(ctx.personaj) : v[0] === 'Minge' ? atingeMinge(ctx.personaj, ALTUL) : false; }});

  /* ---- fără ecran ---- */
  function serie(P, n, o) {
    o = o || {};
    const fire = (P || []).filter(sc => sc.b[0] && sc.b[0][0] === 'cand_personaj').map(sc => ({x: 0, y: 0, b: [['steag']].concat(sc.b.slice(1))}));
    const v = ALTUL;
    if ('minge' in o) ALTUL = o.minge;
    let p = {x: o.x != null ? o.x : 0, y: o.y != null ? o.y : 0, directie: o.directie != null ? o.directie : 90};
    const out = [];
    try {
      for (let k = 0; k < n; k++) {
        const U = SS.urma(fire, p);
        p = {x: U.x, y: U.y, directie: U.directie};
        out.push({x: U.x, y: U.y, directie: U.directie, spuse: U.spuse.slice()});
      }
    } finally { ALTUL = v; }
    return out;
  }
  const ext = (b) => { const e = b[b.length - 1]; return e && typeof e === 'object' && !Array.isArray(e) ? e : null; };
  function dacaDin(P) {
    const out = [];
    const umbla = (lista) => lista.forEach(b => {
      const e = ext(b);
      if (b[0] === 'daca' || b[0] === 'daca_altfel') {
        const c = e && e.s && e.s[0];
        out.push({cond: c ? SS.text(c).replace(/\s+/g, ' ').replace(/ \?/g, '?').trim() : '', gura: e && e.guri && e.guri[0] ? e.guri[0].map(x => x[0]) : [], gura2: e && e.guri && e.guri[1] ? e.guri[1].map(x => x[0]) : []});
      }
      if (e && e.guri) e.guri.forEach(umbla);
    });
    (P || []).filter(sc => sc.b[0] && sc.b[0][0] === 'cand_personaj').forEach(sc => umbla(sc.b));
    return out;
  }

  /* ---- ecran ---- */
  let stilPus = false;
  function stil() {
    SS.stil();
    if (stilPus) return;
    stilPus = true;
    const s = document.createElement('style');
    s.textContent = `.sse-minge{position:absolute;width:12.5%;transform:translate(-50%,-50%);touch-action:none;cursor:grab;z-index:1}
.sse-minge svg{display:block;width:100%;height:auto;pointer-events:none}
.sse-al{margin:10px 0 2px;padding:8px 10px;border:1px solid var(--line,#CFDDEC);border-radius:10px;background:var(--paper2,#F1F6FC)}
.sse-al .q{margin:0 0 6px;font-weight:700}
.sse-al label{display:flex;gap:8px;align-items:center;min-height:44px;padding:4px 6px;border-radius:8px;cursor:pointer}
.sse-al label:hover{background:var(--sel,#DCE9F8)}
.sse-al input{width:20px;height:20px;flex:none;margin:0}`;
    document.head.appendChild(s);
  }
  const amesteca = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  function leaga(Q, body) {
    const inst = body._ss, root = inst.element.classList && inst.element.classList.contains('ss') ? inst.element : body.querySelector('.ss');
    let clicuri = 0;
    let minge = Q.minge ? {x: Q.minge.x, y: Q.minge.y} : null;
    const activ = () => { ALTUL = minge; };
    activ();
    const scena = root.querySelector('.ss-scena'), sprite = root.querySelector('.ss-sprite');
    /* apăsarea pe pisică: la pointerdown, ca în Scratch; dacă programul are pălăria, tragerea nu mai pornește */
    const fire = () => inst.program().map((sc, i) => (sc.b[0] && sc.b[0][0] === 'cand_personaj' ? i : -1)).filter(i => i >= 0);
    const apasa = () => {
      activ();
      clicuri++;
      fire().forEach(i => {
        const rula = inst.stare().ruleaza;
        inst.ruleazaClic(i);
        if (rula && !inst.stare().ruleaza) inst.ruleazaClic(i);   // rula doar el: clicul l-a oprit; îl pornim de la capăt
      });
    };
    root.addEventListener('pointerdown', (e) => {
      activ();
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!sprite.contains(e.target)) {
        /* cu degetul: pisica aproape ieșită din scenă lasă pe ecran o fâșie îngustă; 16 px în jurul ei se socotesc tot pisică (regula 20) */
        if (e.pointerType === 'mouse' || !scena.contains(e.target) || e.target.closest('.sse-minge')) return;
        const r = sprite.getBoundingClientRect();
        if (e.clientX < r.left - 16 || e.clientX > r.right + 16 || e.clientY < r.top - 16 || e.clientY > r.bottom + 16) return;
      }
      if (!fire().length) return;
      e.stopPropagation();
      e.preventDefault();
      apasa();
    }, true);
    /* mingea */
    if (minge) {
      const el = document.createElement('div');
      el.className = 'sse-minge';
      el.setAttribute('aria-label', 'Mingea');
      el.innerHTML = MINGE_SVG;
      scena.appendChild(el);
      const pune = () => { el.style.left = ((minge.x + 240) / 480 * 100) + '%'; el.style.top = ((180 - minge.y) / 360 * 100) + '%'; };
      pune();
      let tr = null;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        tr = {id: e.pointerId, x0: minge.x, y0: minge.y};
        try { el.setPointerCapture(e.pointerId); } catch (er) { /* fără captură */ }
      });
      const laXY = (e) => { const r = scena.getBoundingClientRect(); return {x: Math.round((e.clientX - r.left) / r.width * 480 - 240), y: Math.round(180 - (e.clientY - r.top) / r.height * 360), afara: e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom}; };
      el.addEventListener('pointermove', (e) => {
        if (!tr || e.pointerId !== tr.id) return;
        const p = laXY(e);
        minge.x = Math.max(-240, Math.min(240, p.x)); minge.y = Math.max(-180, Math.min(180, p.y));
        pune();
      });
      const gata = (e) => {
        if (!tr || e.pointerId !== tr.id) return;
        if (laXY(e).afara || e.type === 'pointercancel') { minge.x = tr.x0; minge.y = tr.y0; pune(); }
        tr = null;
      };
      el.addEventListener('pointerup', gata);
      el.addEventListener('pointercancel', gata);
    }
    inst.on('schimbat', (e) => { if (!(e && e.personaj)) clicuri = 0; });
    const st0 = inst.stare.bind(inst);
    inst.stare = () => Object.assign(st0(), {clicuri, ales: body._sseAles ? body._sseAles() : null, minge: minge ? {x: minge.x, y: minge.y} : null});
    const v0 = inst.verifica.bind(inst);
    inst.verifica = () => { activ(); return v0(); };
    body._sse = {apasa, activ};
    return inst;
  }

  const tipEveniment = {
    render(Q, body, api) {
      stil();
      const Q2 = Object.assign({}, Q, {pasCuPas: false});
      SI.tipuri.scratch.render(Q2, body, api);
      /* render-ul a legat deja butonul de inst.verifica; leaga() o înlocuiește pe proprietate, iar el o cheamă prin inst.verifica() */
      leaga(Q, body);
      if (Q.alegere) {
        const nume = 'sse' + Math.random().toString(36).slice(2, 9);
        const box = document.createElement('div');
        box.className = 'sse-al';
        box.innerHTML = `<p class="q">${Q.alegere.q}</p>${amesteca(Q.alegere.o).map(t => `<label><input type="radio" name="${nume}"><span>${t}</span></label>`).join('')}`;
        const tst = body.querySelector('.ss-tst');
        if (tst) tst.parentNode.insertBefore(box, tst); else body.appendChild(box);
        body._sseAles = () => { const i = box.querySelector('input:checked'); return i ? i.parentNode.querySelector('span').innerHTML : null; };
        body._sseAlege = (t) => { box.querySelectorAll('label').forEach(l => { if (l.querySelector('span').innerHTML === t) l.querySelector('input').checked = true; }); };
      }
    },
    rezolva(Q, body) {
      const i = body._ss;
      i.seteaza(Q.solutie);
      body._sse.activ();
      for (let k = 0; k < (Q.clicuri || 0); k++) body._sse.apasa();
      i.opreste();
      if (Q.alegere && body._sseAlege) { const d = document.createElement('div'); d.innerHTML = Q.alegere.o[Q.alegere.ok]; body._sseAlege(d.innerHTML); }
    },
    gresit(Q, body) { body._ss.seteaza(Q.gresit || Q.program || []); }
  };

  window.SimScratchEvenimente = {versiune: VERSIUNE, stil, MINGE_SVG, atingeMinge, serie, dacaDin, tipuri: {eveniment: tipEveniment}};
})();
