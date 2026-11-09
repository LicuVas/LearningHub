/* lectii/_sim/scratch-interfata.js — SimScratchInterfata 1.2 (09.11.2026; 1.0 = 08.11.2026): ce-i lipsește lui scratch.js ca să predai INTERFAȚA.
   PROPRIETAR: lecția V/31 (lectii/v/m5-l31). Se încarcă DUPĂ scratch.js, pe care NU îl schimbă. V/32-35 îl pot încărca nemodificat.

   Ce adaugă:
   (1) tipul de exercițiu `scena` = tipul `scratch` + panoul de sub scenă: dala personajului (Sprite1), dala „Scenă” (Decoruri N)
       și butonul „Alege un Decor”, cu o listă de 6 decoruri; decorul ales se vede pe scenă, în spatele pisicii.
   (2) tipul de exercițiu `zone` = o captură fără nume pe ea; elevul atinge zonele cerute, pe rând.
   (3) monteaza(inst, optiuni): același panou, peste o instanță făcută cu SimScratch.creeaza.
   (4) 1.1: pazaPaleta(inst) + tipuri.scratch: tragerea din paletă cu degetul, când pornește în sus sau în jos, spune de ce nu s-a pus niciun bloc.

   FIDELITATEA (probat în editorul VIU, Chromium headless, fără cont, 08.11.2026: lectii/v/m5-l31/_proba/live_v31.py → live/rezultat.json):
     - în Scratch, fundalul scenei se numește „Decor”: panoul „Scenă”, „Decoruri” + un număr; butonul „Alege un Decor”; lista „Alege un
       decor”, cu „Înapoi” sus; numele din listă sunt în engleză (Arctic, Blue Sky, Castle 1, Desert, Farm, Forest);
     - proiectul nou are 1 decor (alb); alegerea unui decor îl ADAUGĂ (Decoruri 2) și îl pune pe scenă; personajul rămâne selectat,
       fila rămâne Cod, pisica rămâne unde era;
     - apăsarea pe panoul „Scenă” selectează scena: la Mișcare, paleta scrie „Scena selectată: fără blocuri de mișcare”, iar fila Costume
       devine Decoruri; apăsarea pe Sprite1, sub scenă, readuce blocurile;
     - 1.1: pisica lăsată în afara scenei revine unde era (viu, de două ori: 60, 30; simulatorul o lăsa la x 272, y -214, scena părea goală);
       pisica trasă cu scena selectată se mută și redevine selectată (viu: filele revin la Cod, Costume, Sunete); o atingere fără mutare nu schimbă selecția;
   ABATERI (spuse în nota de sub paletă sau în `surse.md` al lecției): doar 6 decoruri, desenate mai simplu, fără căutare și fără filtre;
     butonul are numele scris pe el (în Scratch e o pictogramă rotundă, cu numele la trecerea mouse-ului), fără meniul cu Încarcă /
     Surpriză / Desenează; cu scena selectată, paleta și zona de cod sunt acoperite de un mesaj (în Scratch rămân blocurile scenei, alte
     blocuri decât Mișcare); filele Cod / Costume / Sunete nu sunt desenate.

   API (window.SimScratchInterfata) — stabil; o schimbare se trece în granița _campaign/.../m5_noapte_08_11/granite/v_l31.md, cu ora:
     versiune · DECORURI: [{nume, fundal}] · stil() · pazaPaleta(inst)
     monteaza(inst, {decor?, selectat?}) → C = {decor() → numele sau null, setDecor(nume|null), nDecoruri(), selectat() → 'personaj'|'scena',
         selecteaza('personaj'|'scena'), trasa() → {x, y} la ultima lăsare a pisicii cu mâna, sau null, setTrasa(o), on(fn)}
     tipuri.scena  (în `tipuri` din JocMotor.porneste) — câmpurile tipului `scratch` (paleta, program, personaj, teste, solutie, gresit, nota) +
         decor (cel de la început; implicit alb) · selectat ('scena' = pornește cu scena selectată) · solutieDecor · solutiePoz {x, y} ·
         testele primesc în al treilea argument, pe lângă stare(): S.decor, S.nDecoruri, S.selectat, S.trasa.
     tipuri.zone   (Q = {q, img, w, h, alt, zone:[{id, nume, l, t, lat, ina, dreapta?, ed?}], cereri:[id…], ajutor, why}):
         l, t, lat, ina sunt în % din captură; zona are cel puțin 32 × 32 px (dreapta:true = crește spre stânga; ed:true = eticheta în dreapta zonei;
         zonele înguste, lat < 8, arată doar ✓ și stau deasupra vecinelor). La ultima zonă găsită, exercițiul se încheie singur (fără Verifică).
         1.1: contează TOATE zonele de sub deget (elementsFromPoint): dacă zona cerută e printre ele, e corect. Mesajul „Aici e altceva: …” numește zona
         în care chiar a căzut atingerea (după l, t, lat, ina), nu zona mărită de deasupra. O zonă poate lipsi din `cereri` (se poate apăsa, dar nu se cere).
         1.2: o atingere pe captură, în afara oricărei zone, primește mesajul „Aici nu e niciuna dintre zone. Caută: …”.
     tipuri.scratch (1.1) — tipul `scratch` din scratch.js, neschimbat, plus pazaPaleta și paza pisicii (lăsată în afara scenei, revine). tipuri.scena are și el amândouă.
     Fără bloc pentru decor: lecția V/31 îl schimbă cu mâna. Cine îl vrea în program scrie blocul într-un fișier nou și cheamă C.setDecor.
*/
(function () {
  'use strict';
  if (window.SimScratchInterfata) return;
  const VERSIUNE = '1.2 (09.11.2026)';
  const uri = (s) => 'url("data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" preserveAspectRatio="none">${s}</svg>`) + '")';
  /* desene ale autorului, făcute cu cod; numele sunt cele din lista reală */
  const DECORURI = [
    {nume: 'Arctic', fundal: uri('<rect width="480" height="360" fill="#DDF0FF"/><path d="M0 170 90 90 170 150 260 70 360 150 480 100V360H0Z" fill="#fff"/><path d="M0 250 480 215V360H0Z" fill="#A9D3F5"/>')},
    {nume: 'Blue Sky', fundal: uri('<rect width="480" height="360" fill="#99FFFF"/><path d="M0 330V270Q50 220 110 262 170 215 240 258 300 215 370 258 430 225 480 268V330Z" fill="#00CC44"/><rect y="330" width="480" height="30" fill="#663300"/>')},
    {nume: 'Castle 1', fundal: uri('<rect width="480" height="360" fill="#6E6A66"/><path d="M90 300V100Q240-10 390 100V300Z" fill="#8E1B24"/><path d="M240 40V300" stroke="#E9C46A" stroke-width="6"/><rect y="300" width="480" height="60" fill="#8A5A2B"/>')},
    {nume: 'Desert', fundal: uri('<rect width="480" height="360" fill="#BFE7F5"/><path d="M0 200 120 160 200 195 330 140 480 190V360H0Z" fill="#D9945A"/><path d="M0 260Q240 215 480 265V360H0Z" fill="#F4D06F"/><path d="M90 290V195M90 240H62V210M90 225H118V198" stroke="#2E8B57" stroke-width="12" fill="none" stroke-linecap="round"/>')},
    {nume: 'Farm', fundal: uri('<rect width="480" height="360" fill="#F7E7B4"/><path d="M0 230Q240 170 480 235V360H0Z" fill="#E8A92E"/><path d="M60 300V190L130 140 200 190V300Z" fill="#B23A2E"/><rect x="105" y="225" width="50" height="75" fill="#3A1F14"/>')},
    {nume: 'Forest', fundal: uri('<rect width="480" height="360" fill="#CFE8C8"/><rect y="290" width="480" height="70" fill="#5B8C3A"/><g fill="#2F6B3A"><path d="M70 300 120 90 170 300Z"/><path d="M190 300 250 60 310 300Z"/><path d="M330 300 390 110 450 300Z"/></g>')}
  ];
  const NOTA = 'Aici sunt doar blocurile de azi și 6 decoruri, mai simple. În Scratch, butonul Alege un Decor e rotund, doar cu un desen.';
  const SFAT = 'N-ai luat niciun bloc: degetul a pornit în sus sau în jos. Ca să iei un bloc, du-l întâi puțin spre dreapta, apoi unde vrei.';
  const radacina = (inst) => (inst.element && inst.element.querySelector && inst.element.querySelector('.ss')) || (inst.element && inst.element.closest && inst.element.closest('.ss')) || inst.element;

  function stil() {
    if (document.getElementById('ssi-css')) return;
    const s = document.createElement('style');
    s.id = 'ssi-css';
    s.textContent = `
.ss.ssi{position:relative}
.ss.ssi .ss-lucru{position:relative}
.ssi-panou{display:flex;gap:8px;margin-top:8px;align-items:stretch}
.ssi-sprite,.ssi-scenab,.ssi-alege{font:600 12px/1.2 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;background:#fff;border:2px solid #D9E3F2;border-radius:8px;cursor:pointer;touch-action:manipulation}
.ssi-sprite{flex:0 0 78px;min-height:44px;padding:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.ssi-sprite svg{width:34px;height:auto;display:block;pointer-events:none}
.ssi-sprite[aria-pressed="true"],.ssi-scenab[aria-pressed="true"]{border-color:#855CD6;background:#F1ECFB;color:#4B2F96}
.ssi-sc{flex:1 1 auto;min-width:0;display:flex;gap:6px;flex-wrap:wrap}
.ssi-scenab{flex:1 1 90px;min-height:44px;padding:4px 8px;text-align:center}
.ssi-scenab b{display:block;font-size:12px}
.ssi-alege{flex:1 1 118px;min-height:44px;padding:4px 8px;background:#855CD6;border-color:#6A47B8;color:#fff}
.ssi-bib{position:absolute;inset:0;z-index:30;background:#E9F1FC;border-radius:8px;overflow:auto;display:flex;flex-direction:column;min-height:300px}
.ssi-bibcap{display:flex;align-items:center;gap:10px;background:#855CD6;color:#fff;padding:6px 10px;position:sticky;top:0;z-index:1}
.ssi-bibcap b{flex:1;text-align:center;font:600 14px "Helvetica Neue","Segoe UI",Arial,sans-serif}
.ssi-inapoi{min-height:36px;min-width:64px;padding:4px 10px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.6);border-radius:6px;font:600 13px "Helvetica Neue","Segoe UI",Arial,sans-serif;cursor:pointer}
.ssi-grila{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;padding:10px}
.ssi-dec{background:#fff;border:2px solid #D9E3F2;border-radius:8px;padding:5px;cursor:pointer;font:400 12px "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;touch-action:manipulation}
.ssi-dec i{display:block;aspect-ratio:4/3;background-size:100% 100%;border-radius:4px;margin-bottom:3px}
.ssi-dec:hover,.ssi-dec:focus-visible{border-color:#855CD6}
.ssi-acop{position:absolute;inset:0;z-index:20;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;font:600 14px/1.35 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;border-radius:8px}
.ssi-z-cer{margin:0 0 6px}
.ssi-z-mes{min-height:1.4em;margin:6px 0 0;font-weight:600}
.ssi-z-mes.no{color:var(--bad,#B8362E)}.ssi-z-mes.ok{color:var(--ok,#1E7A46)}
.ssi-cap{position:relative;max-width:640px;margin:0 auto;line-height:0;border:1px solid var(--line,#ccc);border-radius:6px;overflow:hidden}
.ssi-cap img{display:block;width:100%;height:auto}
.ssi-z{position:absolute;min-width:32px;min-height:32px;padding:0;background:transparent;border:2px solid transparent;border-radius:6px;cursor:pointer;touch-action:manipulation;line-height:1.1}
.ssi-z:hover,.ssi-z:focus-visible{border-color:#FFB300;outline:none}
.ssi-z.bun{background:rgba(30,122,70,.20);border-color:#1E7A46}
.ssi-z.rau{background:rgba(184,54,46,.20);border-color:#B8362E}
.ssi-z span{display:none;position:absolute;left:2px;top:2px;background:#1E7A46;color:#fff;font:600 10px/1.15 "Helvetica Neue","Segoe UI",Arial,sans-serif;padding:1px 4px;border-radius:4px;text-align:left;max-width:calc(100% - 4px)}
.ssi-z.bun span{display:block}
.ssi-z.dr span{left:auto;right:2px}
.ss.ssp .ss-lucru{position:relative}
.ssi-sfat{position:absolute;left:6px;right:6px;bottom:6px;z-index:25;pointer-events:none;background:#FFF4CC;border:1px solid #E0B400;border-radius:8px;padding:6px 8px;font:600 13px/1.3 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#3A2A00}
`;
    document.head.appendChild(s);
  }

  /* ---------------- paza pisicii (1.1) ---------------- */
  /* Ca în Scratch: lăsată în afara scenei, pisica revine unde era. „În afara” = degetul sau mouse-ul, la ridicare, nu mai e pe scenă; ascultătorii stau pe
     capturare, deci vin înaintea celor din scratch.js. dupa(st, d) se cheamă când pisica a rămas pe scenă (d = de unde a pornit tragerea, sau null dacă x, y s-au scris). */
  function pazaPisica(inst, dupa) {
    const root = radacina(inst), scena = root.querySelector('.ss-scena'), sprite = root.querySelector('.ss-sprite');
    let drag = null;
    const inScena = (e) => { const r = scena.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
    const urmeaza = (e) => { if (drag && e.pointerId === drag.id) drag.afara = !inScena(e); };
    root.addEventListener('pointerdown', (e) => { if (sprite.contains(e.target)) { const st = inst.stare(); drag = {id: e.pointerId, x: st.x, y: st.y, afara: false}; } }, true);
    root.addEventListener('pointermove', urmeaza, true);
    root.addEventListener('pointerup', urmeaza, true);
    inst.on('schimbat', (e) => {
      if (!(e && e.personaj)) return;
      const st = inst.stare(), d = drag;
      drag = null;
      if (d && d.afara) { inst.punePersonaj({x: d.x, y: d.y}); return; }
      if (dupa) dupa(st, d);
    });
  }

  /* ---------------- panoul de sub scenă ---------------- */
  function monteaza(inst, o) {
    o = o || {};
    stil();
    const root = radacina(inst);
    root.classList.add('ssi');
    const scena = root.querySelector('.ss-scena');
    const lucru = root.querySelector('.ss-lucru');
    const pisica = root.querySelector('.ss-sprite svg');
    let decor = o.decor || null, nD = o.decor ? 2 : 1, sel = o.selectat === 'scena' ? 'scena' : 'personaj', trasa = null;
    const asc = [];
    root.querySelector('.ss-info').insertAdjacentHTML('afterend', `<div class="ssi-panou">
      <button type="button" class="ssi-sprite" aria-label="Personajul Sprite1: pisica"></button>
      <div class="ssi-sc"><button type="button" class="ssi-scenab" aria-label="Panoul Scenă"><b>Scenă</b>Decoruri <span class="nr"></span></button>
      <button type="button" class="ssi-alege">Alege un Decor</button></div></div>`);
    const bSp = root.querySelector('.ssi-sprite'), bSc = root.querySelector('.ssi-scenab'), bAl = root.querySelector('.ssi-alege');
    bSp.appendChild(pisica.cloneNode(true));
    bSp.insertAdjacentHTML('beforeend', '<span>Sprite1</span>');
    const anunta = () => asc.forEach(f => { try { f(); } catch (e) { /* ascultător greșit */ } });
    function deseneaza() {
      const d = DECORURI.find(x => x.nume === decor);
      scena.style.backgroundImage = d ? d.fundal : 'none';
      scena.style.backgroundSize = '100% 100%';
      bSc.querySelector('.nr').textContent = nD;
      bSp.setAttribute('aria-pressed', sel === 'personaj');
      bSc.setAttribute('aria-pressed', sel === 'scena');
      let a = lucru.querySelector('.ssi-acop');
      if (sel === 'scena' && !a) {
        lucru.insertAdjacentHTML('beforeend', '<div class="ssi-acop" role="status">Scena selectată: fără blocuri de mișcare. Apasă pe Sprite1 (pisica), sub scenă, ca să ai din nou blocurile.</div>');
      } else if (sel !== 'scena' && a) a.remove();
    }
    function inchideBib() { const b = root.querySelector('.ssi-bib'); if (b) b.remove(); }
    function deschideBib() {
      inchideBib();
      root.insertAdjacentHTML('beforeend', `<div class="ssi-bib" role="dialog" aria-label="Alege un decor"><div class="ssi-bibcap"><button type="button" class="ssi-inapoi">← Înapoi</button><b>Alege un decor</b></div>
        <div class="ssi-grila">${DECORURI.map(d => `<button type="button" class="ssi-dec" data-d="${d.nume}"><i style='background-image:${d.fundal}'></i>${d.nume}</button>`).join('')}</div></div>`);
      const b = root.querySelector('.ssi-bib');
      b.querySelector('.ssi-inapoi').addEventListener('click', inchideBib);
      b.querySelectorAll('.ssi-dec').forEach(x => x.addEventListener('click', () => { C.setDecor(x.dataset.d, true); inchideBib(); }));
      b.querySelector('.ssi-inapoi').focus();
    }
    const C = {
      decor: () => decor,
      setDecor(n, adauga) { decor = n; if (adauga) nD++; else nD = n ? Math.max(nD, 2) : 1; deseneaza(); anunta(); },
      nDecoruri: () => nD,
      selectat: () => sel,
      selecteaza(s) { sel = s === 'scena' ? 'scena' : 'personaj'; deseneaza(); anunta(); },
      trasa: () => trasa,
      setTrasa(p) { trasa = p; },
      on(f) { asc.push(f); }
    };
    bSp.addEventListener('click', () => C.selecteaza('personaj'));
    bSc.addEventListener('click', () => C.selecteaza('scena'));
    bAl.addEventListener('click', deschideBib);
    pazaPisica(inst, (st, d) => {
      trasa = {x: st.x, y: st.y};
      if (d && (st.x !== d.x || st.y !== d.y) && sel === 'scena') C.selecteaza('personaj');
    });
    deseneaza();
    return C;
  }

  /* ---------------- paza tragerii din paletă, cu degetul (1.1) ---------------- */
  /* În scratch.js (neschimbat), degetul care pornește în sus sau în jos de pe un bloc din paletă derulează (touch-action: pan-y) și nu ia blocul.
     Mesajul apare doar când s-a întâmplat sigur: atingere cu degetul, pornită pe un bloc din paletă, anulată de derulare sau ridicată după o mișcare
     verticală (același prag ca în scratch.js), iar numărul de blocuri din program a rămas același. Mouse-ul nu intră aici. Mesajul nu oprește nimic
     (pointer-events: none) și pleacă la următoarea apăsare în simulator. */
  function pazaPaleta(inst) {
    stil();
    const root = radacina(inst);
    if (root._ssiPaza) return;
    root._ssiPaza = true;
    root.classList.add('ssp');
    const lucru = root.querySelector('.ss-lucru');
    const nr = () => inst.program().reduce((n, sc) => n + sc.b.length, 0);
    const ascunde = () => { const a = lucru.querySelector('.ssi-sfat'); if (a) a.remove(); };
    const arata = () => { if (!lucru.querySelector('.ssi-sfat')) lucru.insertAdjacentHTML('beforeend', `<div class="ssi-sfat" role="status">${SFAT}</div>`); };
    let t = null;
    const gata = (e, derulat) => {
      if (!t || e.pointerId !== t.id) return;
      const n0 = t.n, v = t.vertical || derulat;
      t = null;
      if (v) setTimeout(() => { if (nr() === n0) arata(); }, 0);
    };
    root.addEventListener('pointerdown', (e) => {
      ascunde();
      t = null;
      if (e.pointerType === 'mouse' || e.target.closest('input') || !e.target.closest('.ss-lista .ss-b')) return;
      t = {id: e.pointerId, x0: e.clientX, y0: e.clientY, n: nr(), vertical: false, decis: false};
    }, true);
    root.addEventListener('pointermove', (e) => {
      if (!t || e.pointerId !== t.id || t.decis) return;
      const dx = e.clientX - t.x0, dy = e.clientY - t.y0;
      if (Math.hypot(dx, dy) < 9) return;
      t.decis = true;
      t.vertical = Math.abs(dy) > Math.abs(dx) * 1.2;
    }, true);
    root.addEventListener('pointerup', (e) => gata(e, false), true);
    root.addEventListener('pointercancel', (e) => gata(e, true), true);
    inst.on('schimbat', ascunde);
  }
  const tipScratchPaza = {
    render(Q, body, api) { window.SimScratch.tipuri.scratch.render(Q, body, api); pazaPaleta(body._ss); pazaPisica(body._ss); },
    rezolva(Q, body) { window.SimScratch.tipuri.scratch.rezolva(Q, body); },
    gresit(Q, body) { window.SimScratch.tipuri.scratch.gresit(Q, body); }
  };

  /* ---------------- tipul `scena` ---------------- */
  const curataTeste = (body) => body.querySelectorAll('.ss-tst li').forEach(li => {
    li.className = '';
    const s = li.querySelector('.s'), m = li.querySelector('.m');
    if (s) s.textContent = '○';
    if (m) { m.hidden = true; m.textContent = ''; }
  });
  function aplicaSolutia(Q, body) {
    const C = body._ssi, inst = body._ss;
    C.selecteaza('personaj');
    if (Q.solutieDecor !== undefined) C.setDecor(Q.solutieDecor);
    if (Q.solutiePoz) { inst.punePersonaj(Object.assign({directie: 90}, Q.solutiePoz)); C.setTrasa({x: Q.solutiePoz.x, y: Q.solutiePoz.y}); }
  }
  const tipScena = {
    render(Q, body, api) {
      const baza = window.SimScratch.tipuri.scratch;
      const extra = () => { const C = body._ssi; return C ? {decor: C.decor(), nDecoruri: C.nDecoruri(), selectat: C.selectat(), trasa: C.trasa()} : {}; };
      const teste = (Q.teste || []).map(t => Object.assign({}, t, {ok: (U, P, S) => t.ok(U, P, Object.assign({}, S, extra()))}));
      const apiP = Object.assign({}, api, {revealButton(fn) { api.revealButton(() => { aplicaSolutia(Q, body); fn(); }); }});
      baza.render(Object.assign({}, Q, {teste, pasCuPas: false, nota: Q.nota || NOTA}), body, apiP);
      body._ssi = monteaza(body._ss, {decor: Q.decor, selectat: Q.selectat});
      body._ssi.on(() => curataTeste(body));
      pazaPaleta(body._ss);
    },
    rezolva(Q, body) {
      const baza = window.SimScratch.tipuri.scratch;
      baza.rezolva(Q, body);
      aplicaSolutia(Q, body);
    },
    gresit(Q, body) {
      const baza = window.SimScratch.tipuri.scratch;
      baza.gresit(Q, body);
      body._ssi.setDecor(Q.decor || null);
      body._ssi.selecteaza(Q.selectat === 'scena' ? 'scena' : 'personaj');
    }
  };

  /* ---------------- tipul `zone`: captura fără nume; ceri zonele pe rând ---------------- */
  const tipZone = {
    render(Q, body, api) {
      stil();
      const dupa = (id) => Q.zone.find(z => z.id === id);
      let i = 0;
      body.innerHTML = `<div class="ssi-zone"><p class="ssi-z-cer" aria-live="polite"></p>
        <div class="ssi-cap"><img src="${Q.img}" width="${Q.w}" height="${Q.h}" alt="${Q.alt}">${Q.zone.map((z, k) => `<button type="button" class="ssi-z${z.dreapta || z.ed ? ' dr' : ''}" data-id="${z.id}" aria-label="Zona ${k + 1}" style="top:${z.t}%;height:${z.ina}%;${z.dreapta ? `right:${100 - z.l - z.lat}%` : `left:${z.l}%`};width:${z.lat}%;z-index:${z.lat < 8 ? 2 : 1}"><span>${z.lat < 8 ? '✓' : z.nume}</span></button>`).join('')}</div>
        <p class="ssi-z-mes" aria-live="polite"></p></div>`;
      const cer = body.querySelector('.ssi-z-cer'), mes = body.querySelector('.ssi-z-mes');
      const scrie = () => {
        cer.innerHTML = i < Q.cereri.length ? `Apasă pe captură (pe telefon: atinge): <b>${dupa(Q.cereri[i]).nume}</b> <small>(${i + 1} din ${Q.cereri.length})</small>` : '<b>Le-ai găsit pe toate.</b> Apasă Verifică.';
      };
      const gaseste = (id, k) => { const b = body.querySelector(`.ssi-z[data-id="${id}"]`); if (b) { b.classList.remove('rau'); b.classList.add('bun'); } return k; };
      body._zone = {
        toate() { Q.cereri.forEach(id => gaseste(id)); i = Q.cereri.length; scrie(); mes.textContent = ''; },
        nimic() { body.querySelectorAll('.ssi-z').forEach(b => b.classList.remove('bun', 'rau')); i = 0; scrie(); mes.textContent = ''; },
        gata: () => i >= Q.cereri.length
      };
      const capEl = body.querySelector('.ssi-cap');
      capEl.addEventListener('click', (e) => { if (e.target.closest('.ssi-z') || i >= Q.cereri.length) return; mes.className = 'ssi-z-mes no'; mes.textContent = `Aici nu e niciuna dintre zone. Caută: ${dupa(Q.cereri[i]).nume}.`; });
      /* 1.1: la 390 px zonele înguste, mărite la 32 px, acoperă vecinele. Toate zonele de sub deget contează; de la tastatură (fără coordonate), doar butonul. */
      const subDeget = (e, b) => {
        if (!(e.clientX || e.clientY)) return [b.dataset.id];
        const ids = document.elementsFromPoint(e.clientX, e.clientY).map(x => x.closest && x.closest('.ssi-z')).filter(x => x && body.contains(x)).map(x => x.dataset.id);
        return ids.concat(b.dataset.id);
      };
      /* zona în care a căzut atingerea, după desenul ei, nu după ținta mărită */
      const zonaReala = (e, b) => {
        const r = capEl.getBoundingClientRect();
        if (!(e.clientX || e.clientY) || !r.width) return b.dataset.id;
        const px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100;
        const z = Q.zone.find(q => px >= q.l && px <= q.l + q.lat && py >= q.t && py <= q.t + q.ina);
        return z ? z.id : b.dataset.id;
      };
      body.querySelectorAll('.ssi-z').forEach(b => b.addEventListener('click', (e) => {
        if (i >= Q.cereri.length) return;
        body.querySelectorAll('.ssi-z.rau').forEach(x => x.classList.remove('rau'));
        const cerut = Q.cereri[i];
        if (subDeget(e, b).includes(cerut)) {
          gaseste(cerut); i++; mes.className = 'ssi-z-mes ok'; mes.textContent = 'Da, acolo e.'; scrie();
          if (i >= Q.cereri.length) { cer.innerHTML = '<b>Le-ai găsit pe toate.</b>'; mes.textContent = ''; if (nav) nav.innerHTML = ''; api.resolve(true); }
        }
        else {
          const id = zonaReala(e, b), el = body.querySelector(`.ssi-z[data-id="${id}"]`);
          if (el.classList.contains('bun')) { mes.className = 'ssi-z-mes no'; mes.textContent = `Pe aceasta ai găsit-o deja. Acum caută: ${dupa(cerut).nume}.`; }
          else { el.classList.add('rau'); mes.className = 'ssi-z-mes no'; mes.textContent = `Aici e altceva: ${dupa(id).nume}. Caută: ${dupa(cerut).nume}.`; }
        }
      }));
      scrie();
      const nav = api.checkButton(() => {
        if (i >= Q.cereri.length) api.resolve(true);
        else {
          api.resolve(false, `Mai ai de găsit: ${Q.cereri.slice(i).map(id => dupa(id).nume).join(', ')}.`);
          api.revealButton(() => { body._zone.toate(); api.giveUp('zonele sunt acum colorate și numite pe captură.'); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) { body._zone.toate(); },
    gresit(Q, body) { body._zone.nimic(); }
  };

  window.SimScratchInterfata = {versiune: VERSIUNE, DECORURI, stil, monteaza, pazaPaleta, tipuri: {scratch: tipScratchPaza, scena: tipScena, zone: tipZone}};
})();
