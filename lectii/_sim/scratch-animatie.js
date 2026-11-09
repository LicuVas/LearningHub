/* lectii/_sim/scratch-animatie.js — SimScratchAnimatie 1.1 (09.11.2026; 1.0 → 1.1 la R1: Ctrl+Z / Ctrl+Shift+Z în fila Costume, capul de mai jos): ce-i lipsește Scratch-ului simulat ca să predai APLICAȚIA DE ANIMAȚIE.
   PROPRIETAR: lecția VI/27 (lectii/vi/m4-l27). Se încarcă DUPĂ scratch.js, scratch-control.js și scratch-interfata.js, pe care NU le schimbă.
   Nu se încarcă pe aceeași pagină cu `scratch-gestiune.js` (VI/28): amândouă definesc «costumul următor»; prima încărcată câștigă.
   Granița: _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/vi_l27.md.

   Ce adaugă:
   (1) blocul 'costum_urmator' („costumul următor”, Aspect);
   (2) tipul de exercițiu `anim` = tipul `scena` din scratch-interfata.js + „repetă” (scratch-control.js) + filele Cod / Costume / Sunete, două costume, un editor grafic mic;
   (3) tipul de exercițiu `notare` = o captură reală cu numere pe ea; elevul alege numele fiecărui număr.

   FIDELITATEA (probat în editorul VIU, Chromium headless, fără cont, 09.11.2026: lectii/vi/m4-l27/_proba/live_v27.py, live_v27b.py, live_v27c.py → live_v27*.json):
     - filele: Cod, Costume, Sunete; cu panoul Scenă selectat: Cod, Decoruri, Sunete; alegerea unui decor nu schimbă fila și nici selecția;
     - costumele pisicii: costume1, costume2 (numele rămân așa și în română); apăsat pe unul, pisica de pe scenă îl îmbracă; fila rămâne;
     - „costumul următor”: după ultimul revine la primul (0 → 1 → 0); apăsat în paletă, se face o dată; în gura lui „repetă 10”, cu „mergi 10 pași”: 10 schimbări și x + 100, în ~0,4 s; steagul nu readuce costumul;
     - instrumentele: Selectează, Remodelează, Pensulă, Radieră, Umplere, Text, Linie, Cerc, Dreptunghi; Cerc rămâne ales după desen; desenul se vede pe scenă și în lista costumelor și stă doar pe costumul ales;
     - Umplere pe o parte a pisicii o face mov (culoarea de la început); pe locul gol nu schimbă nimic;
     - la schimbarea costumului, Anulează și Refă se sting;
     - cu fila Costume deschisă, Ctrl+Z = Anulează și Ctrl+Shift+Z = Refă, și când butonul Anulează e stins (VIU: _proba/r1_live.json G_taste; judecătorul opus, _verificare/j1_live.json i_doua_cercuri);
     - sunetul pisicii: Meow (prima deschidere, în engleză) sau Miau (proiect nou în română); Redare devine Stop cât se aude (0,85 s), apoi iar Redare; cu scena selectată, sunetul e pop.
   ABATERI (spuse în `NOTA`, pe ecran, sau în `surse.md` al lecției):
     - doar două instrumente merg (Cerc, Umplere); celelalte spun asta; instrumentele au nume sub desen (în Scratch doar desenul, numele la trecerea mouse-ului);
     - Anulează merge mereu după un desen; în Scratch, după PRIMUL desen pe un costum, butonul a fost stins în 3 rulări din 4 ale autorului (live_v27b.json, live_v27c.json, live_lab.json), în 2 din 2 ale judecătorului opus și în 1 din 1 la R1 (r1_live.json), dar aprins în 2 din 2 ale judecătorului sonnet: variază; după al doilea desen s-a aprins;
     - nu se aude nimic; pisica e desenată mai simplu; editorul decorurilor nu e simulat (doar lista lor);
     - doar 6 decoruri (din scratch-interfata.js).

   API (window.SimScratchAnimatie) — stabil; o schimbare se trece în graniță, cu ora:
     versiune · stil() · NUME_COSTUME · nrSchimbari(U) (de câte ori s-a schimbat costumul într-o urmă) · urma(P, o) (ca SimScratch.urma, fără să atingă costumul de pe ecran)
     monteaza(inst, C, o) → A   (C = ce întoarce SimScratchInterfata.monteaza; o: {fila, costum})
        A.fila(), A.setFila('cod'|'costume'|'sunete'), A.costum(), A.setCostum(i), A.stareTeste(), A.reset(o), A.aplica(s), A.on(fn)
     tipuri.anim (în `tipuri` din JocMotor.porneste) — câmpurile tipului `scena` (paleta, program, personaj, teste, solutie, gresit, nota, decor, selectat, solutieDecor, solutiePoz) +
        fila ('cod' implicit) · costum (0 implicit) · solutieAnim: {fila?, costum?, cercuri?:[n0, n1], cap?:[bool, bool], ascultat?, vazutScena?}.
        Testele primesc în al treilea argument, pe lângă cele din `scena`: S.fila, S.costum, S.cercuri ([n0, n1]), S.cap ([bool, bool]: capul e mov), S.ascultat, S.vazutScena.
     tipuri.notare — Q = {q, img, w, h, alt, numere:[{n, nume}], variante:[nume…], ajutor, why}: fiecare număr are o listă; „Verifică” judecă toate; mesajul numește numărul greșit, nu răspunsul.
*/
(function () {
  'use strict';
  if (window.SimScratchAnimatie) return;
  if (!window.SimScratch) throw new Error('scratch-animatie.js: încarcă întâi lectii/_sim/scratch.js');
  if (!window.SimScratchControl) throw new Error('scratch-animatie.js: încarcă întâi lectii/_sim/scratch-control.js');
  if (!window.SimScratchInterfata) throw new Error('scratch-animatie.js: încarcă întâi lectii/_sim/scratch-interfata.js');
  const SS = window.SimScratch, SC = window.SimScratchControl, SI = window.SimScratchInterfata;
  const VERSIUNE = '1.1 (09.11.2026)';
  const NUME = ['costume1', 'costume2'];
  const MOV = '#9966FF', PORT = '#F7A21B', CONTUR = '#8a5300';
  const NOTA = 'Aici sunt doar blocurile de azi și 6 decoruri, iar pisica e desenată mai simplu. În Scratch, butonul Alege un Decor e rotund, instrumentele au doar un desen, iar sunetul se aude.';
  const UNELTE = [
    ['selecteaza', 'Selectează', '<path d="M5 3l12 10-5 1 3 6-3 1-3-6-4 4z" fill="currentColor"/>'],
    ['remodeleaza', 'Remodelează', '<path d="M8 5l9 8-4 1 2 5-2 1-2-5-3 3z" fill="currentColor"/><circle cx="4" cy="4" r="2" fill="currentColor"/>'],
    ['pensula', 'Pensulă', '<path d="M4 20c3 0 5-2 5-4l-2-2c-2 0-3 3-3 6zM9 13l9-9 2 2-9 9z" fill="currentColor"/>'],
    ['radiera', 'Radieră', '<path d="M13 4l7 7-8 8H7l-4-4z" fill="currentColor"/>'],
    ['umplere', 'Umplere', '<path d="M11 3l8 8-7 7-8-8zM20 15c1 2 2 3 2 4a2 2 0 01-4 0c0-1 1-2 2-4z" fill="currentColor"/>'],
    ['text', 'Text', '<path d="M4 4h16v4h-2V6h-5v13h2v2H9v-2h2V6H6v2H4z" fill="currentColor"/>'],
    ['linie', 'Linie', '<path d="M4 20L20 4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'],
    ['cerc', 'Cerc', '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.6"/>'],
    ['dreptunghi', 'Dreptunghi', '<rect x="4" y="5" width="16" height="14" fill="none" stroke="currentColor" stroke-width="2.6"/>']
  ];

  function stil() {
    if (document.getElementById('sa-css')) return;
    const s = document.createElement('style');
    s.id = 'sa-css';
    s.textContent = `
.sa-file{display:flex;gap:2px;margin:0 0 -1px;padding:0 4px;flex-wrap:wrap}
.sa-fila{min-height:40px;min-width:72px;padding:4px 12px;font:600 13px "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;background:#E9EEF2;border:1px solid #D9E3F2;border-bottom:none;border-radius:10px 10px 0 0;cursor:pointer;touch-action:manipulation}
.sa-fila[aria-selected="true"]{background:#fff;color:#855CD6;border-color:#855CD6}
.ss.sa .ss-lucru{isolation:isolate}
.ss.sa .ss-lucru.sa-des{height:640px;position:relative}
.ss.lat.sa .ss-lucru.sa-des{height:470px}
.sa-pan{position:absolute;inset:0;z-index:22;background:#fff;display:flex;gap:8px;padding:8px;box-sizing:border-box;overflow:auto;font:500 13px/1.3 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75}
.sa-lista{display:flex;flex-direction:column;gap:8px;flex:0 0 86px}
.sa-c{width:84px;min-height:84px;padding:4px;background:#fff;border:2px solid #D9E3F2;border-radius:8px;cursor:pointer;font:600 12px/1.2 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;display:flex;flex-direction:column;align-items:center;gap:2px;touch-action:manipulation}
.sa-c svg{width:44px;height:50px;display:block;pointer-events:none}
.sa-c[aria-pressed="true"]{border-color:#855CD6;background:#F1ECFB;color:#4B2F96}
.sa-ed{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:8px}
.sa-bara{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sa-bara b{color:#4B2F96}
.sa-und{width:44px;height:40px;font:600 18px/1 "Helvetica Neue","Segoe UI",Arial,sans-serif;background:#fff;color:#855CD6;border:1px solid #D9E3F2;border-radius:8px;cursor:pointer;touch-action:manipulation}
.sa-und:disabled{color:#BFC7D5;cursor:default}
.sa-culoare{display:inline-flex;align-items:center;gap:4px}
.sa-culoare i{display:inline-block;width:20px;height:20px;border-radius:4px;background:${MOV};border:1px solid #6A47B8}
.sa-lucrare{display:flex;gap:8px;min-height:0}
.sa-unelte{display:grid;grid-template-columns:repeat(2,58px);gap:4px;align-content:start;flex:none}
.sa-u{width:58px;min-height:48px;padding:2px;background:#fff;color:#575E75;border:1px solid #D9E3F2;border-radius:6px;cursor:pointer;font:500 9.5px/1.1 "Helvetica Neue","Segoe UI",Arial,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:manipulation}
.sa-u svg{width:20px;height:20px;display:block;pointer-events:none}
.sa-u[aria-pressed="true"]{background:#855CD6;color:#fff;border-color:#6A47B8}
.sa-pz{flex:1 1 auto;min-width:0;max-width:340px;border:1px solid #D9E3F2;border-radius:6px;background:#fff;background-image:linear-gradient(45deg,#F1F5FB 25%,transparent 25%,transparent 75%,#F1F5FB 75%),linear-gradient(45deg,#F1F5FB 25%,transparent 25%,transparent 75%,#F1F5FB 75%);background-size:20px 20px;background-position:0 0,10px 10px}
.sa-svg{display:block;width:100%;height:auto;aspect-ratio:1/1;touch-action:none;cursor:crosshair}
.sa-mes{min-height:1.3em;margin:0;font-weight:600;color:#4B2F96}
.sa-sun{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:10px}
.sa-unda{display:block;width:100%;height:96px;border:1px solid #E5C6E5;border-radius:6px;background:#F8E9F8}
.sa-red{min-height:48px;min-width:96px;padding:4px 14px;background:#CF63CF;color:#fff;border:none;border-radius:24px;font:600 14px "Helvetica Neue","Segoe UI",Arial,sans-serif;cursor:pointer;touch-action:manipulation;align-self:flex-start}
@media (max-width:559px){
  .sa-pan{flex-direction:column}
  .sa-lista{flex:none;flex-direction:row}
  .sa-c{flex-direction:row;width:auto;flex:1 1 0;min-height:60px;justify-content:center}
  .sa-c svg{width:38px;height:44px}
  .sa-lucrare{flex-direction:column}
  .sa-unelte{grid-template-columns:repeat(3,minmax(0,1fr))}
  .sa-u{width:auto;flex-direction:row;gap:4px;font-size:11px;min-height:44px}
  .sa-pz{max-width:300px;width:100%;margin:0 auto}
}
.sa-n-fig{margin:0 0 8px}
.sa-n-fig img{display:block;width:100%;max-width:760px;height:auto;border:1px solid var(--line,#ccc);border-radius:6px}
.sa-n-fig figcaption{font-size:.85em;margin-top:4px}
.sa-n-lista{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.sa-n-rand{display:flex;align-items:center;gap:8px}
.sa-n-nr{flex:none;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#C2410C;color:#fff;font-weight:700}
.sa-n-rand select{flex:1 1 auto;min-width:0;min-height:44px;font-size:16px;padding:4px 6px;border:1px solid var(--line,#999);border-radius:6px;background:var(--paper,#fff);color:var(--ink,#222)}
.sa-n-rand.no select{border-color:var(--bad,#B8362E);border-width:2px}
.sa-n-rand.ok select{border-color:var(--ok,#1E7A46);border-width:2px}
`;
    document.head.appendChild(s);
  }

  /* desenul costumului: aceeași pisică din scratch.js (capul), cu corp și picioare. Coordonatele costumului: 60 × 74 (cercurile pot ieși din ele). */
  function arta(i, c) {
    const cap = (c && c.cap) ? MOV : PORT;
    const picioare = i === 0
      ? '<path d="M24 60 L15 71 M36 60 L45 71" stroke="' + PORT + '" stroke-width="6" stroke-linecap="round" fill="none" data-p="corp"/>'
      : '<path d="M27 61 L25 72 M33 61 L35 72" stroke="' + PORT + '" stroke-width="6" stroke-linecap="round" fill="none" data-p="corp"/>';
    return picioare +
      '<ellipse cx="30" cy="55" rx="11" ry="9" fill="' + PORT + '" stroke="' + CONTUR + '" stroke-width="1.6" data-p="corp"/>' +
      '<path d="M13 24 L15 5 L27 17 Z M47 24 L45 5 L33 17 Z" fill="' + cap + '" stroke="' + CONTUR + '" stroke-width="2" stroke-linejoin="round" data-p="cap"/>' +
      '<ellipse cx="30" cy="33" rx="21" ry="18" fill="' + cap + '" stroke="' + CONTUR + '" stroke-width="2" data-p="cap"/>' +
      '<ellipse cx="30" cy="40" rx="11" ry="7" fill="#fff" data-p="fata"/><circle cx="23" cy="29" r="4.5" fill="#fff" stroke="' + CONTUR + '" data-p="fata"/><circle cx="37" cy="29" r="4.5" fill="#fff" stroke="' + CONTUR + '" data-p="fata"/><circle cx="24.5" cy="29.5" r="2" fill="#222" data-p="fata"/><circle cx="38.5" cy="29.5" r="2" fill="#222" data-p="fata"/><path d="M24 41 Q30 46 36 41" stroke="#5a3500" stroke-width="2" fill="none" data-p="fata"/>' +
      ((c && c.cercuri) || []).map(e => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}" fill="${MOV}" stroke="#000" stroke-width="1.5" data-p="cerc"/>`).join('');
  }
  const svgCostum = (i, c) => `<svg viewBox="0 0 60 74" aria-hidden="true" style="overflow:visible">${arta(i, c)}</svg>`;

  /* ---------------- blocul: unde stă costumul curent, pe ecran sau într-o rulare de test ---------------- */
  const LEG = new WeakMap();
  let FORTAT = null, ACTIV = null;
  /* 1.1: tastele editorului grafic. Le primește instanța atinsă ultima (TASTE); cât e deschisă altă filă decât Cod,
     Ctrl+Z / Ctrl+Y nu mai ajung la zona de cod (scratch.js ar anula, nevăzut, programul). */
  let TASTE = null;
  document.addEventListener('keydown', (e) => { if (TASTE && TASTE(e)) { e.preventDefault(); e.stopPropagation(); } }, true);
  function dep(ctx) {
    let d = LEG.get(ctx);
    if (d) return d;
    if (FORTAT) d = {cur: FORTAT.cur || 0};
    else d = ACTIV || {cur: 0};
    LEG.set(ctx, d);
    return d;
  }
  if (!SS.def('costum_urmator')) SS.bloc('costum_urmator', {cat: 'aspect', text: 'costumul următor', en: 'next costume', *executa(ctx) {
    const d = dep(ctx);
    d.cur = (d.cur + 1) % NUME.length;
    ctx.noteaza('costum', d.cur);
    if (d.dupa) d.dupa();
  }});
  const nrSchimbari = (U) => (U && U.evenimente ? U.evenimente.filter(e => e.tip === 'costum').length : 0);
  function urma(P, o) {
    const v = FORTAT;
    FORTAT = {cur: (o && o.costum) || 0};
    try { return SS.urma(P, o); } finally { FORTAT = v; }
  }

  /* ---------------- filele și panourile ---------------- */
  const radacina = (inst) => inst.element.querySelector('.ss');
  function monteaza(inst, C, o) {
    o = o || {};
    stil();
    const root = radacina(inst);
    root.classList.add('sa');
    const lucru = root.querySelector('.ss-lucru');
    const sprite = root.querySelector('.ss-sprite');
    const asc = [];
    const nou = () => ({cercuri: [], cap: false});
    const St = {fila: o.fila || 'cod', costume: [nou(), nou()], ascultat: false, vazutScena: C.selectat() === 'scena', unealta: 'selecteaza', istoric: [], viitor: [], mes: ''};
    const depozit = {cur: o.costum || 0, dupa: null};
    let tRedare = null, redare = false;

    lucru.insertAdjacentHTML('beforebegin', `<div class="sa-file" role="tablist" aria-label="Filele editorului">
      <button type="button" class="sa-fila" role="tab" data-f="cod">Cod</button><button type="button" class="sa-fila" role="tab" data-f="costume">Costume</button><button type="button" class="sa-fila" role="tab" data-f="sunete">Sunete</button></div>`);
    const file = root.querySelector('.sa-file');

    const anunta = () => asc.forEach(f => { try { f(); } catch (e) { /* ascultător greșit */ } });
    function scena() {
      const c = St.costume[depozit.cur];
      const svg = sprite.querySelector('svg');
      svg.setAttribute('viewBox', '0 0 60 74');
      svg.style.overflow = 'visible';
      svg.innerHTML = arta(depozit.cur, c);
      const t = root.querySelector('.ssi-sprite svg');
      if (t) { t.setAttribute('viewBox', '0 0 60 74'); t.style.overflow = 'visible'; t.innerHTML = arta(depozit.cur, c); }
    }
    const cereScena = () => C.selectat() === 'scena';
    function fileStare() {
      file.querySelectorAll('.sa-fila').forEach(b => {
        b.setAttribute('aria-selected', b.dataset.f === St.fila ? 'true' : 'false');
        if (b.dataset.f === 'costume') b.textContent = cereScena() ? 'Decoruri' : 'Costume';
      });
    }
    /* panoul Costume */
    function htmlCostume() {
      return `<div class="sa-lista">${NUME.map((n, i) => `<button type="button" class="sa-c" data-c="${i}" aria-pressed="${i === depozit.cur}">${svgCostum(i, St.costume[i])}<span>${n}</span></button>`).join('')}</div>
      <div class="sa-ed">
        <div class="sa-bara"><span>Costum <b class="sa-nume">${NUME[depozit.cur]}</b></span>
          <button type="button" class="sa-und sa-undo" aria-label="Anulează ultima modificare" title="Anulează ultima modificare" ${St.istoric.length ? '' : 'disabled'}>↶</button>
          <button type="button" class="sa-und sa-redo" aria-label="Refă acțiunea anulată" title="Refă acțiunea anulată" ${St.viitor.length ? '' : 'disabled'}>↷</button>
          <span class="sa-culoare">Umplere <i></i></span></div>
        <div class="sa-lucrare">
          <div class="sa-unelte">${UNELTE.map(u => `<button type="button" class="sa-u" data-u="${u[0]}" title="${u[1]}" aria-pressed="${St.unealta === u[0]}"><svg viewBox="0 0 24 24" aria-hidden="true">${u[2]}</svg>${u[1]}</button>`).join('')}</div>
          <div class="sa-pz"><svg class="sa-svg" viewBox="-30 -24 120 120" role="img" aria-label="Pânza: costumul ales"><g class="sa-g">${arta(depozit.cur, St.costume[depozit.cur])}</g></svg></div>
        </div>
        <p class="sa-mes" role="status">${St.mes}</p>
      </div>`;
    }
    function htmlDecoruri() {
      const d = C.decor();
      return `<div class="sa-lista"><button type="button" class="sa-c" disabled aria-pressed="${!d}"><span>backdrop1</span></button>${d ? `<button type="button" class="sa-c" disabled aria-pressed="true"><span>${d}</span></button>` : ''}</div>
      <div class="sa-ed"><p class="sa-mes">Scena are decoruri, așa cum personajul are costume. Aici vezi doar lista lor: desenul lor nu se schimbă în pagină. Apasă pe Sprite1, sub scenă, ca să revii la costumele pisicii.</p></div>`;
    }
    function htmlSunete() {
      const n = cereScena() ? 'pop' : 'Miau';
      return `<div class="sa-lista"><button type="button" class="sa-c" disabled aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9zM15 8q3 4 0 8M18 5q5 7 0 14" fill="none" stroke="#575E75" stroke-width="2"/></svg><span>${n}</span></button></div>
      <div class="sa-sun"><div class="sa-bara"><span>Sunet <b>${n}</b></span></div>
        <svg class="sa-unda" viewBox="0 0 300 96" preserveAspectRatio="none" aria-hidden="true"><path d="M0 48 Q10 8 40 10 T130 14 T170 26 T240 30 T300 48 Q270 70 240 66 T170 72 T130 84 T40 88 T0 48Z" fill="#DE8FDE" stroke="#CF63CF"/></svg>
        <button type="button" class="sa-red" aria-label="${redare ? 'Stop' : 'Redare'}">${redare ? '■ Stop' : '▶ Redare'}</button>
        <p class="sa-mes" role="status">Aici nu se aude nimic. În Scratch se aude, dacă ai căști sau boxe.</p></div>`;
    }
    function panou() {
      let p = lucru.querySelector('.sa-pan');
      if (St.fila === 'cod') { if (p) p.remove(); lucru.classList.remove('sa-des'); return; }
      lucru.classList.add('sa-des');
      if (!p) { lucru.insertAdjacentHTML('beforeend', '<div class="sa-pan" role="tabpanel"></div>'); p = lucru.querySelector('.sa-pan'); }
      p.innerHTML = St.fila === 'sunete' ? htmlSunete() : (cereScena() ? htmlDecoruri() : htmlCostume());
      leagaPanou(p);
    }
    const instantaneu = () => JSON.stringify(St.costume[depozit.cur]);
    function schimbaDesen(fn) {
      St.istoric.push(instantaneu()); St.viitor = [];
      fn(St.costume[depozit.cur]);
      redesen();
    }
    function redesen() {
      St.mes = St.fila === 'costume' ? St.mes : '';
      scena(); panou(); anunta();
    }
    function anuleazaDesen() { if (!St.istoric.length) return; St.viitor.push(instantaneu()); St.costume[depozit.cur] = JSON.parse(St.istoric.pop()); redesen(); }
    function refaDesen() { if (!St.viitor.length) return; St.istoric.push(instantaneu()); St.costume[depozit.cur] = JSON.parse(St.viitor.pop()); redesen(); }
    /* întoarce true dacă tasta e a filei deschise (atunci nu mai merge mai departe, spre zona de cod) */
    function tasta(e) {
      if (!root.isConnected || St.fila === 'cod' || !(e.ctrlKey || e.metaKey)) return false;
      const k = (e.key || '').toLowerCase();
      if (k !== 'z' && k !== 'y') return false;
      if (e.target && e.target.closest && e.target.closest('input, textarea, select')) return false;
      if (St.fila === 'costume' && !cereScena()) { if (k === 'z' && !e.shiftKey) anuleazaDesen(); else if (k === 'z') refaDesen(); }
      return true;
    }
    function leagaPanou(p) {
      p.querySelectorAll('.sa-c[data-c]').forEach(b => b.addEventListener('click', () => A.setCostum(+b.dataset.c)));
      p.querySelectorAll('.sa-u').forEach(b => b.addEventListener('click', () => {
        St.unealta = b.dataset.u;
        St.mes = (b.dataset.u === 'cerc' || b.dataset.u === 'umplere') ? '' : 'Aici merg doar Cerc și Umplere. În Scratch merg toate.';
        panou();
      }));
      const u = p.querySelector('.sa-undo'), r = p.querySelector('.sa-redo');
      if (u) u.addEventListener('click', anuleazaDesen);
      if (r) r.addEventListener('click', refaDesen);
      const red = p.querySelector('.sa-red');
      if (red) red.addEventListener('click', () => {
        if (redare) { clearTimeout(tRedare); redare = false; panou(); return; }
        redare = true; St.ascultat = true; panou(); anunta();
        tRedare = setTimeout(() => { redare = false; if (St.fila === 'sunete') panou(); }, 850);
      });
      const svg = p.querySelector('.sa-svg');
      if (svg) legaPanza(svg);
    }
    function legaPanza(svg) {
      const coord = (e) => { const m = svg.getScreenCTM(); return m ? {x: (e.clientX - m.e) / m.a, y: (e.clientY - m.f) / m.d} : {x: 0, y: 0}; };
      const g = svg.querySelector('.sa-g');
      let t = null, tmp = null;
      svg.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (St.unealta === 'cerc') {
          const q = coord(e);
          t = {id: e.pointerId, x0: q.x, y0: q.y};
          try { svg.setPointerCapture(e.pointerId); } catch (er) { /* fără captură */ }
        } else if (St.unealta === 'umplere') {
          const el = document.elementFromPoint(e.clientX, e.clientY);
          t = {id: e.pointerId, p: el && el.getAttribute ? el.getAttribute('data-p') : null};
        } else { t = null; St.mes = 'Alege întâi un instrument: aici merg Cerc și Umplere.'; const m = svg.closest('.sa-pan').querySelector('.sa-mes'); if (m) m.textContent = St.mes; }
      });
      svg.addEventListener('pointermove', (e) => {
        if (!t || t.id !== e.pointerId || St.unealta !== 'cerc') return;
        const q = coord(e);
        if (!tmp) { tmp = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); tmp.setAttribute('fill', MOV); tmp.setAttribute('stroke', '#000'); tmp.setAttribute('stroke-width', '1.5'); g.appendChild(tmp); }
        tmp.setAttribute('cx', (t.x0 + q.x) / 2); tmp.setAttribute('cy', (t.y0 + q.y) / 2);
        tmp.setAttribute('rx', Math.abs(q.x - t.x0) / 2); tmp.setAttribute('ry', Math.abs(q.y - t.y0) / 2);
      });
      const gata = (e, anulat) => {
        if (!t || t.id !== e.pointerId) return;
        const d = t; t = null;
        if (St.unealta === 'cerc' && d.x0 != null) {
          const q = coord(e), w = Math.abs(q.x - d.x0), h = Math.abs(q.y - d.y0);
          if (tmp) { tmp.remove(); tmp = null; }
          if (anulat) return;
          if (w < 4 || h < 4) { St.mes = 'Cercul se desenează trăgând: apasă pe pânză, ține apăsat, du mai departe, apoi lasă.'; const m = svg.closest('.sa-pan').querySelector('.sa-mes'); if (m) m.textContent = St.mes; return; }
          St.mes = '';
          setTimeout(() => schimbaDesen(c => c.cercuri.push({cx: +((d.x0 + q.x) / 2).toFixed(1), cy: +((d.y0 + q.y) / 2).toFixed(1), rx: +(w / 2).toFixed(1), ry: +(h / 2).toFixed(1)})), 0);
        } else if (St.unealta === 'umplere' && !anulat) {
          if (d.p === 'cap') { St.mes = ''; setTimeout(() => schimbaDesen(c => { c.cap = true; }), 0); }
          else if (d.p === 'corp' || d.p === 'fata' || d.p === 'cerc') { St.mes = 'Aici, în pagină, se umple doar capul pisicii. În Scratch, orice formă pe care apeși.'; const m = svg.closest('.sa-pan').querySelector('.sa-mes'); if (m) m.textContent = St.mes; }
          else { St.mes = 'Aici nu e nicio formă: nu se schimbă nimic.'; const m = svg.closest('.sa-pan').querySelector('.sa-mes'); if (m) m.textContent = St.mes; }
        }
      };
      svg.addEventListener('pointerup', (e) => gata(e, false));
      svg.addEventListener('pointercancel', (e) => gata(e, true));
      svg.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); }, {passive: false});
    }

    const A = {
      fila: () => St.fila,
      setFila(f) { St.fila = f; St.mes = ''; fileStare(); panou(); anunta(); },
      costum: () => depozit.cur,
      setCostum(i) { depozit.cur = i; St.istoric = []; St.viitor = []; St.mes = ''; scena(); panou(); anunta(); },
      stareTeste: () => ({fila: St.fila, costum: depozit.cur, cercuri: St.costume.map(c => c.cercuri.length), cap: St.costume.map(c => c.cap), ascultat: St.ascultat, vazutScena: St.vazutScena}),
      reset(oo) {
        oo = oo || {};
        St.fila = oo.fila || 'cod'; St.costume = [nou(), nou()]; St.ascultat = false; St.vazutScena = C.selectat() === 'scena'; St.unealta = 'selecteaza'; St.istoric = []; St.viitor = []; St.mes = '';
        depozit.cur = oo.costum || 0;
        fileStare(); scena(); panou(); anunta();
      },
      aplica(s) {
        s = s || {};
        if (s.costum != null) depozit.cur = s.costum;
        (s.cercuri || []).forEach((n, i) => { const c = St.costume[i]; while (c.cercuri.length < n) c.cercuri.push({cx: 66, cy: 8 + c.cercuri.length * 22, rx: 9, ry: 9}); });
        (s.cap || []).forEach((v, i) => { if (v) St.costume[i].cap = true; });
        if (s.ascultat) St.ascultat = true;
        if (s.vazutScena) St.vazutScena = true;
        if (s.fila) St.fila = s.fila;
        St.istoric = []; St.viitor = [];
        fileStare(); scena(); panou(); anunta();
      },
      on(f) { asc.push(f); }
    };

    /* live: programul pornit pe ecran schimbă costumul de aici */
    depozit.dupa = () => { scena(); if (St.fila === 'costume') panou(); };
    inst.on('pornit', () => { ACTIV = depozit; });
    inst.element.addEventListener('pointerdown', () => { ACTIV = depozit; TASTE = tasta; }, true);
    TASTE = tasta;
    /* „Rulează testele”: rulările de test nu ating costumul de pe ecran */
    const v0 = inst.verifica;
    inst.verifica = function () {
      const v = FORTAT;
      FORTAT = {cur: depozit.cur};
      /* 1.1: mesajul poate fi un obiect „viu” (lecția îl scrie la fiecare rulare, cu toString): spre motor pleacă text */
      try { const r = v0.apply(inst, arguments); if (r && r.msg != null && typeof r.msg !== 'string') r.msg = String(r.msg); return r; } finally { FORTAT = v; }
    };
    file.addEventListener('click', (e) => { const b = e.target.closest('.sa-fila'); if (b) A.setFila(b.dataset.f); });
    C.on(() => { if (C.selectat() === 'scena') St.vazutScena = true; fileStare(); if (St.fila !== 'cod') panou(); });
    fileStare(); scena(); panou();
    return A;
  }

  /* ---------------- tipul `anim` ---------------- */
  const curataTeste = (body) => body.querySelectorAll('.ss-tst li').forEach(li => {
    li.className = '';
    const s = li.querySelector('.s'), m = li.querySelector('.m');
    if (s) s.textContent = '○';
    if (m) { m.hidden = true; m.textContent = ''; }
  });
  const tipAnim = {
    render(Q, body, api) {
      stil();
      const extra = () => (body._anim ? body._anim.stareTeste() : {});
      const teste = (Q.teste || []).map(t => Object.assign({}, t, {ok: (U, P, S) => t.ok(U, P, Object.assign({}, S, extra()))}));
      const apiP = Object.assign({}, api, {revealButton(fn) { api.revealButton(() => { if (body._anim) body._anim.aplica(Q.solutieAnim); fn(); }); }});
      SI.tipuri.scena.render(Object.assign({}, Q, {teste, nota: Q.nota || NOTA}), body, apiP);
      SC.infasoara(body._ss);
      body._anim = monteaza(body._ss, body._ssi, {fila: Q.fila, costum: Q.costum});
      body._anim.on(() => curataTeste(body));
    },
    rezolva(Q, body) {
      SI.tipuri.scena.rezolva(Q, body);
      body._anim.aplica(Q.solutieAnim);
    },
    gresit(Q, body) {
      SI.tipuri.scena.gresit(Q, body);
      body._anim.reset({fila: Q.fila, costum: Q.costum});
    }
  };

  /* ---------------- tipul `notare`: numerele de pe captură primesc nume ---------------- */
  const tipNotare = {
    render(Q, body, api) {
      stil();
      const opt = ['<option value="">alege…</option>'].concat(Q.variante.map(v => `<option value="${v}">${v}</option>`)).join('');
      body.innerHTML = `<figure class="sa-n-fig"><a href="${Q.img}" target="_blank"><img src="${Q.img}" width="${Q.w}" height="${Q.h}" alt="${Q.alt}"></a><figcaption>Numerele le-am pus noi. Pe telefon, apasă poza ca s-o vezi mare.</figcaption></figure>
        <div class="sa-n-lista">${Q.numere.map(x => `<div class="sa-n-rand" data-n="${x.n}"><span class="sa-n-nr" aria-hidden="true">${x.n}</span><select aria-label="Numărul ${x.n}">${opt}</select></div>`).join('')}</div>`;
      const rand = (n) => body.querySelector(`.sa-n-rand[data-n="${n}"]`);
      const curat = () => body.querySelectorAll('.sa-n-rand').forEach(r => r.classList.remove('ok', 'no'));
      body.querySelectorAll('select').forEach(s => s.addEventListener('change', curat));
      const judeca = () => {
        curat();
        const gol = [], rau = [];
        Q.numere.forEach(x => { const r = rand(x.n), v = r.querySelector('select').value; if (!v) gol.push(x.n); else if (v !== x.nume) { rau.push(x.n); r.classList.add('no'); } else r.classList.add('ok'); });
        return {gol, rau};
      };
      const toate = () => Q.numere.forEach(x => { rand(x.n).querySelector('select').value = x.nume; });
      body._notare = {toate, nimic() { body.querySelectorAll('select').forEach(s => { s.selectedIndex = 1; }); curat(); }};
      api.checkButton(() => {
        const r = judeca();
        if (!r.gol.length && !r.rau.length) { api.resolve(true); return; }
        const msg = r.rau.length ? `La ${r.rau.length === 1 ? 'numărul' : 'numerele'} ${r.rau.join(', ')} nu e ce ai ales. Uită-te pe captură unde stă numărul.` : `Mai ai de ales la: ${r.gol.join(', ')}.`;
        api.resolve(false, msg);
        api.revealButton(() => { toate(); judeca(); api.giveUp('numele bune sunt acum alese în listă.'); });
      }, 'Verifică');
    },
    rezolva(Q, body) { body._notare.toate(); },
    gresit(Q, body) { body._notare.nimic(); }
  };

  window.SimScratchAnimatie = {versiune: VERSIUNE, stil, NUME_COSTUME: NUME, nrSchimbari, urma, monteaza, tipuri: {anim: tipAnim, notare: tipNotare}};
})();
