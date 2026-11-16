/* lectii/_sim/scenariu-casute.js — ScenariuCasute 1.1 (09.11.2026): căsuțele de storyboard, desenate cu cod, și exercițiile pe ele.
   PROPRIETAR: lecția VI/29 (lectii/vi/m4-l29, „Scenariul unei animații: compoziție, cadre, obiecte animate”).
   Granița: _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/vi_l29.md. Nu depinde de nimic în afară de motor.

   Ce face: desenele sunt ale autorului (SVG făcut cu cod, ca pe o foaie: fundal deschis, chiar și în tema întunecată), nimic nu se încarcă, nimic nu se
   salvează, nimic nu pleacă. Pagina NU judecă desenul din caietul elevului: exercițiile de aici sunt pe storyboarduri-exemplu.
   Exercițiile judecă REZULTATUL (regula 29): ordinea finală, locul final al obiectelor, alegerea finală. Mesajele spun doar starea de acum.

   API (window.ScenariuCasute) — stabil; o schimbare se trece în graniță, cu ora:
     versiune · stil()
     desen(spec) → șirul <svg>. spec = {f:'parc'|'lac'|'alb', ob:[[nume, x, y, {s?, flip?, laba?, brate?, dx?, dy?, t?}], …], alt:'…'}
        nume: pisica, omulet, fluture, pasare, copac, soare, nor, barca, munte, casa, minge, floare, samanta, frunza, ploaie, sageata, balon. viewBox 160 × 110; (x, y) = mijlocul de jos al obiectului.
     banda(casute, {coloane?, fara_numere?}) → șirul HTML al căsuțelor, în ordine: casute = [{desen: spec, text: 'propoziția de sub căsuță'}, …]
     tipuri.casute_ordine      Q = {q, casute: [{id, desen, text}…], start: [id…] (ordinea de la început), ordine: [id…] (cea bună), alte?: [[id…]…], prim?: 'mesajul pentru locul 1', ajutor, why}
                               Gest: atingi o căsuță, apoi locul ei; cele două își schimbă locul. Fără tragere, deci la fel cu degetul și cu mouse-ul.
     tipuri.casute_compozitie  Q = {q, f, obiecte: [{id, o, nume, s?}…], teste: [{ce, msg, ok(S)}…], solutie: {id: [c, r]}, gresit: {id: [c, r]}, ajutor, why}
                               Gest: atingi numele obiectului, apoi un loc din cele 9 (3 × 3). Un loc = un obiect: ce era acolo iese din cadru și se pune din nou.
                               S = {loc: {id: {c, r}}, nr}: c = coloana 0-2 (stânga → dreapta), r = rândul 0-2 (sus → jos). Testele merg în ordine; primul care pică dă mesajul.
     tipuri.casute_obiect      Q = {q, a, b (spec), ta?, tb?, optiuni?: [{v, t}…], obiecte: [{id, nume, ok: v}…], gresit: {id: v}, ajutor, why}
                               Implicit, optiunile sunt: pe_loc „Stă la fel”, mutat „S-a mutat”, altfel „Arată altfel”. Se alege câte una pe fiecare rând.
     tipuri.casute_neclar      Q = {q, casute: [{id, desen, text}…], ok: id, dece: {id: 'de ce se înțelege'}, ajutor, why}. Se alege o singură căsuță.
   NU SE SCHIMBĂ: numele tipurilor, forma lui Q, clasele sc-*, regula „nimic nu se salvează, nimic nu pleacă”.
   1.1 (09.11.2026, R1 după judecata 1): doar desenul pisicii cu {laba:true} (laba se vede: după cap, în afara lui); pisica
   fără labă ridicată arată ca în 1.0. API-ul și forma lui Q neschimbate. Proba: lectii/vi/m4-l29/_proba/proba_laba.py. */
(function () {
  'use strict';
  if (window.ScenariuCasute) return;
  const VERSIUNE = '1.1 (09.11.2026)';
  const CSS = `
.sc-banda{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0}
.sc-banda.c2{grid-template-columns:repeat(2,minmax(0,1fr));max-width:520px}
@media (max-width:560px){.sc-banda{grid-template-columns:repeat(2,minmax(0,1fr))}}
.sc-c{position:relative;display:block;margin:0;padding:4px;border:2px solid var(--line,#ccc);border-radius:8px;background:var(--paper,#fff);color:var(--ink,#222);font:inherit;text-align:left;min-width:0}
button.sc-c{cursor:pointer;width:100%;touch-action:manipulation}
button.sc-c:hover{border-color:var(--accent,#a50)}
.sc-c.ales{border-color:var(--accent,#a50);box-shadow:0 0 0 3px var(--sel,#fe8)}
.sc-c svg{display:block;width:100%;height:auto;border-radius:4px}
.sc-c figcaption,.sc-c .sc-t{display:block;font-size:.84rem;line-height:1.25;padding:4px 2px 2px;min-height:2.5em}
.sc-nr{position:absolute;left:8px;top:8px;min-width:20px;height:20px;padding:0 4px;border-radius:10px;background:#333;color:#fff;font-size:.74rem;font-weight:700;line-height:20px;text-align:center}
.sc-mes{min-height:1.4em;margin:6px 0 2px}
.sc-cadru{position:relative;max-width:480px;margin:6px auto;border:2px solid var(--line,#ccc);border-radius:8px;overflow:hidden;background:#fff}
.sc-cadru svg{display:block;width:100%;height:auto}
.sc-grila{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr)}
.sc-loc{margin:0;padding:0;background:transparent;border:1px dashed rgba(70,70,70,.32);cursor:pointer;touch-action:manipulation;min-height:32px}
.sc-loc:hover,.sc-loc:focus-visible{background:rgba(255,200,60,.28)}
.sc-obs{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0}
.sc-ob{min-height:40px;padding:4px 12px;border:2px solid var(--line,#ccc);border-radius:20px;background:var(--paper,#fff);color:var(--ink,#222);font:inherit;cursor:pointer;touch-action:manipulation}
.sc-ob.ales{border-color:var(--accent,#a50);box-shadow:0 0 0 3px var(--sel,#fe8);font-weight:700}
.sc-ob .sc-pus{font-size:.8em;opacity:.8}
.sc-tab{display:grid;gap:6px;margin:8px 0}
.sc-rand{display:grid;grid-template-columns:minmax(84px,auto) 1fr;gap:6px;align-items:center;border-top:1px solid var(--line,#ccc);padding-top:6px}
.sc-rand b{font-size:.95rem}
.sc-opt{display:flex;flex-wrap:wrap;gap:4px}
.sc-opt button{flex:1 1 84px;min-height:40px;padding:3px 6px;border:2px solid var(--line,#ccc);border-radius:8px;background:var(--paper,#fff);color:var(--ink,#222);font:inherit;font-size:.86rem;cursor:pointer;touch-action:manipulation}
.sc-opt button[aria-pressed="true"]{border-color:var(--accent,#a50);background:var(--sel,#fe8);font-weight:700}
@media (max-width:420px){.sc-rand{grid-template-columns:1fr}}
`;
  function stil() {
    if (document.getElementById('sc-css')) return;
    const s = document.createElement('style');
    s.id = 'sc-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const L = 'stroke="#2a2118" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

  /* desenele: (x, y) = mijlocul de jos; s = mărimea; flip = privește spre stânga */
  const OB = {
    pisica(o) {
      /* 1.1 (R1, judecata 1, G1): laba ridicată se desenează DUPĂ cap și ÎN AFARA lui (în 1.0 stătea sub cerc: nu se vedea).
         Piciorul ridicat iese din piept, ocolește capul prin față și urcă până la urechi: portocaliu, cu contur, laba rotundă.
         Fără ${L} pe liniile groase: un al doilea stroke-width, pus după cel din L, e ignorat de HTML (rămânea 1,6). */
      const laba = o.laba
        ? `<path d="M9 -10 Q27 -10 26 -26" fill="none" stroke="#2a2118" stroke-width="5" stroke-linecap="round"/><path d="M9 -10 Q27 -10 26 -26" fill="none" stroke="#F2A33A" stroke-width="3" stroke-linecap="round"/><circle cx="26" cy="-28" r="3.4" fill="#F2A33A" ${L}/>`
        : `<path d="M9 -8 L12 0" fill="none" ${L} stroke-width="2.4"/>`;
      return `<path d="M-13 -6 Q-22 -8 -19 -19" fill="none" stroke="#2a2118" stroke-width="2.6" stroke-linecap="round"/>
<ellipse cx="0" cy="-8" rx="12" ry="8" fill="#F2A33A" ${L}/><path d="M-8 -3 L-9 0 M-2 -2 L-2 0" ${L} fill="none" stroke-width="2.4"/>
<path d="M3 -26 L1 -35 L8 -29 L14 -29 L21 -35 L19 -26 Z" fill="#F2A33A" ${L}/><circle cx="11" cy="-23" r="9.5" fill="#F2A33A" ${L}/>
<circle cx="8" cy="-25" r="1.5" fill="#2a2118"/><circle cx="14.5" cy="-25" r="1.5" fill="#2a2118"/><path d="M8.5 -20 Q11 -18 14 -20" fill="none" ${L}/>${laba}`;
    },
    omulet(o) {
      const b = o.brate === 'sus' ? 'M0 -20 L-9 -30 M0 -20 L9 -30' : 'M0 -20 L-9 -12 M0 -20 L9 -12';
      return `<circle cx="0" cy="-30" r="5.5" fill="#fff" ${L}/><path d="M0 -24.5 L0 -11 M0 -11 L-7 0 M0 -11 L7 0 ${b}" fill="none" ${L} stroke-width="2"/>`;
    },
    fluture() { return `<path d="M0 -6 Q-11 -17 -11 -6 Q-11 2 0 -6 Q11 -17 11 -6 Q11 2 0 -6 Z" fill="#E36AA6" ${L}/><path d="M0 -11 L0 0" ${L} stroke-width="2"/>`; },
    pasare() { return `<path d="M-11 -9 Q-5 -15 0 -7 Q5 -15 11 -9" fill="none" ${L} stroke-width="2.4"/>`; },
    copac() { return `<rect x="-4" y="-22" width="8" height="22" fill="#8B5A2B" ${L}/><path d="M-19 -22 Q-23 -38 -11 -41 Q-8 -54 4 -50 Q19 -52 18 -39 Q26 -28 15 -21 Q0 -16 -19 -22 Z" fill="#5FAE4F" ${L}/>`; },
    soare() { return `<circle cx="0" cy="-12" r="8" fill="#F7D13D" ${L}/><path d="M0 -24 V-21 M0 -3 V0 M-12 -12 H-9 M9 -12 H12 M-8.5 -20.5 L-6.5 -18.5 M8.5 -20.5 L6.5 -18.5 M-8.5 -3.5 L-6.5 -5.5 M8.5 -3.5 L6.5 -5.5" ${L} fill="none"/>`; },
    nor(o) { return `<path d="M-20 -4 Q-27 -12 -16 -15 Q-13 -25 -2 -20 Q9 -27 13 -16 Q24 -13 19 -4 Z" fill="${o.gri ? '#AEB6BF' : '#F4F8FC'}" ${L}/>`; },
    barca() { return `<path d="M-20 -8 L20 -8 L13 0 L-13 0 Z" fill="#B5651D" ${L}/><path d="M0 -8 L0 -32 L16 -12 Z" fill="#fff" ${L}/>`; },
    munte() { return `<path d="M-30 0 L-4 -40 L4 -28 L12 -36 L32 0 Z" fill="#AEB6BF" ${L}/><path d="M-11 -29 L-4 -40 L4 -28 L0 -26 L-4 -30 Z" fill="#fff" ${L}/>`; },
    casa() { return `<rect x="-18" y="-24" width="36" height="24" fill="#F6E3C5" ${L}/><path d="M-23 -24 L0 -42 L23 -24 Z" fill="#C8553D" ${L}/><rect x="-5" y="-14" width="10" height="14" fill="#8B5A2B" ${L}/>`; },
    minge() { return `<circle cx="0" cy="-7" r="7" fill="#E55B3C" ${L}/><path d="M-6 -9 Q0 -4 6 -9" fill="none" ${L}/>`; },
    floare(o) { return `<path d="M0 0 V-16" ${L} stroke="#3F8F3A" stroke-width="2.4" fill="none"/><circle cx="0" cy="-20" r="${o.s2 || 4}" fill="#F7D13D" ${L}/><circle cx="-7" cy="-20" r="3.6" fill="#E36AA6" ${L}/><circle cx="7" cy="-20" r="3.6" fill="#E36AA6" ${L}/><circle cx="0" cy="-27" r="3.6" fill="#E36AA6" ${L}/><circle cx="0" cy="-13" r="3.6" fill="#E36AA6" ${L}/>`; },
    samanta() { return `<ellipse cx="0" cy="-2.5" rx="5" ry="3" fill="#8B5A2B" ${L}/>`; },
    frunza() { return `<path d="M0 0 V-8" stroke="#3F8F3A" stroke-width="2.4" fill="none"/><path d="M0 -8 Q9 -18 15 -12 Q10 -4 0 -8 Z" fill="#5FAE4F" ${L}/>`; },
    ploaie() { return `<path d="M-16 -14 L-19 -6 M-6 -14 L-9 -6 M4 -14 L1 -6 M14 -14 L11 -6 M-11 -6 L-14 2 M-1 -6 L-4 2 M9 -6 L6 2" stroke="#3B7DBF" stroke-width="2" stroke-linecap="round" fill="none"/>`; },
    sageata(o) { const dx = o.dx || 30, dy = o.dy || 0, a = Math.atan2(dy, dx), c = (u) => [Math.cos(a + u), Math.sin(a + u)], [x1, y1] = c(2.6), [x2, y2] = c(-2.6); return `<path d="M0 0 L${dx} ${dy} M${dx} ${dy} l${(x1 * 8).toFixed(1)} ${(y1 * 8).toFixed(1)} M${dx} ${dy} l${(x2 * 8).toFixed(1)} ${(y2 * 8).toFixed(1)}" fill="none" stroke="#B8362E" stroke-width="2.6" stroke-linecap="round"/>`; },
    balon(o) { const t = esc(o.t || ''), w = Math.max(30, t.length * 5.2 + 10); return `<rect x="${-w / 2}" y="-24" width="${w}" height="17" rx="7" fill="#fff" ${L}/><path d="M-4 -7.5 L-8 0 L3 -7.5" fill="#fff" ${L}/><text x="0" y="-12" font-size="9" font-family="Segoe UI,Arial,sans-serif" text-anchor="middle" fill="#2a2118">${t}</text>`; }
  };
  const FUNDAL = {
    alb: '<rect width="160" height="110" fill="#fff"/>',
    parc: '<rect width="160" height="110" fill="#E5F3FB"/><rect y="84" width="160" height="26" fill="#CBE8B5"/><path d="M0 84 H160" stroke="#2a2118" stroke-width="1"/>',
    lac: '<rect width="160" height="110" fill="#E5F3FB"/><rect y="68" width="160" height="42" fill="#BFDDF2"/><path d="M0 68 H160" stroke="#2a2118" stroke-width="1"/><path d="M12 82 q5 -4 10 0 M60 92 q5 -4 10 0 M118 80 q5 -4 10 0 M92 100 q5 -4 10 0" fill="none" stroke="#6FA6CE" stroke-width="1.2"/>'
  };
  function desen(spec) {
    stil();
    const f = FUNDAL[(spec && spec.f) || 'alb'] || FUNDAL.alb;
    const ob = ((spec && spec.ob) || []).map(([n, x, y, o]) => {
      o = o || {};
      const fn = OB[n];
      if (!fn) throw new Error('scenariu-casute.js: nu am desenul „' + n + '”');
      return `<g data-ob="${n}" transform="translate(${x} ${y}) scale(${o.flip ? -(o.s || 1) : (o.s || 1)} ${o.s || 1})">${fn(o)}</g>`;
    }).join('');
    return `<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc((spec && spec.alt) || 'Căsuță de storyboard')}">${f}${ob}</svg>`;
  }
  function banda(casute, o) {
    stil();
    o = o || {};
    return `<div class="sc-banda${o.coloane === 2 ? ' c2' : ''}">${casute.map((c, i) => `<figure class="sc-c">${o.fara_numere ? '' : `<span class="sc-nr">${i + 1}</span>`}${desen(c.desen)}${c.text ? `<figcaption>${c.text}</figcaption>` : ''}</figure>`).join('')}</div>`;
  }

  /* ---- ordinea căsuțelor ---- */
  const tipOrdine = {
    render(Q, body, api) {
      stil();
      let ord = (Q.start || Q.casute.map(c => c.id)).slice(), ales = null;
      body.innerHTML = '<div class="sc-banda"></div><p class="sc-mes" aria-live="polite"></p>';
      const gr = body.querySelector('.sc-banda'), mes = body.querySelector('.sc-mes');
      const dupa = (id) => Q.casute.find(c => c.id === id);
      const desena = (focus) => {
        gr.innerHTML = ord.map((id, i) => { const c = dupa(id); return `<button type="button" class="sc-c${ales === id ? ' ales' : ''}" data-id="${id}" aria-pressed="${ales === id}" aria-label="Locul ${i + 1}: ${esc(c.text)}"><span class="sc-nr">${i + 1}</span>${desen(c.desen)}<span class="sc-t">${c.text}</span></button>`; }).join('');
        if (focus) { const b = gr.querySelector(`[data-id="${focus}"]`); if (b) b.focus({preventScroll: true}); }
      };
      gr.addEventListener('click', (e) => {
        const b = e.target.closest('.sc-c');
        if (!b) return;
        const id = b.dataset.id;
        if (ales === null) { ales = id; mes.textContent = 'Acum atinge locul unde o vrei: cele două își schimbă locul.'; }
        else if (ales === id) { ales = null; mes.textContent = ''; }
        else {
          const i = ord.indexOf(ales), j = ord.indexOf(id);
          ord[i] = id; ord[j] = ales; ales = null; mes.textContent = '';
        }
        desena(id);
      });
      desena();
      body._ord = {pune(o) { ord = o.slice(); ales = null; mes.textContent = ''; desena(); }, ia: () => ord.slice()};
      api.checkButton(() => {
        const bune = [Q.ordine].concat(Q.alte || []);
        if (bune.some(o => o.every((id, i) => id === ord[i]))) { mes.textContent = ''; api.resolve(true); return; }
        const r = Q.ordine, k = ord.findIndex((id, i) => id !== r[i]);
        const pre = k === 0 ? '' : (k === 1 ? 'Prima căsuță e la locul ei. ' : `Primele ${k} căsuțe sunt la locul lor. `);
        const m = k === 0 ? (Q.prim || 'Pe locul 1 trebuie altă căsuță: aceea în care povestea abia începe.')
          : `Pe locul ${k + 1} trebuie altă căsuță: aceea care se întâmplă chiar după locul ${k}.`;
        api.resolve(false, pre + m);
        api.revealButton(() => { body._ord.pune(Q.ordine); api.giveUp('căsuțele sunt acum în ordine.'); });
      }, 'Verifică');
    },
    rezolva(Q, body) { body._ord.pune(Q.ordine); },
    gresit(Q, body) { const o = Q.ordine.slice(); const t = o[0]; o[0] = o[1]; o[1] = t; body._ord.pune(o); }
  };

  /* ---- compoziția: pui obiectele într-un cadru ---- */
  const COL = ['stânga', 'mijloc', 'dreapta'], RAND = ['sus', 'la mijloc', 'jos'];
  const XC = [28, 80, 132], YR = [36, 70, 104];
  const tipCompozitie = {
    render(Q, body, api) {
      stil();
      let loc = {}, ales = null;
      body.innerHTML = `<div class="sc-obs"></div><div class="sc-cadru"><div class="sc-desen"></div><div class="sc-grila">${RAND.map((rn, r) => COL.map((cn, c) => `<button type="button" class="sc-loc" data-c="${c}" data-r="${r}" aria-label="Locul: ${rn}, ${cn}"></button>`).join('')).join('')}</div></div><p class="sc-mes" aria-live="polite"></p>`;
      const obs = body.querySelector('.sc-obs'), des = body.querySelector('.sc-desen'), mes = body.querySelector('.sc-mes');
      const numeLoc = (l) => `${RAND[l.r]}, ${COL[l.c]}`;
      const desena = () => {
        obs.innerHTML = Q.obiecte.map(o => `<button type="button" class="sc-ob${ales === o.id ? ' ales' : ''}" data-id="${o.id}" aria-pressed="${ales === o.id}">${o.nume}${loc[o.id] ? ` <span class="sc-pus">(${numeLoc(loc[o.id])})</span>` : ''}</button>`).join('');
        des.innerHTML = desen({f: Q.f, alt: 'Cadrul tău: ' + (Q.obiecte.filter(o => loc[o.id]).map(o => `${o.nume}: ${numeLoc(loc[o.id])}`).join('; ') || 'încă nimic pus'),
          ob: Q.obiecte.filter(o => loc[o.id]).map(o => [o.o, XC[loc[o.id].c], YR[loc[o.id].r], {s: o.s || 1}])});
      };
      obs.addEventListener('click', (e) => {
        const b = e.target.closest('.sc-ob');
        if (!b) return;
        ales = ales === b.dataset.id ? null : b.dataset.id;
        mes.textContent = ales ? 'Acum atinge locul din cadru.' : '';
        desena();
        const n = obs.querySelector(`[data-id="${b.dataset.id}"]`); if (n) n.focus({preventScroll: true});
      });
      body.querySelector('.sc-grila').addEventListener('click', (e) => {
        const b = e.target.closest('.sc-loc');
        if (!b) return;
        if (!ales) { mes.textContent = 'Atinge întâi numele unui obiect, deasupra cadrului.'; return; }
        const c = +b.dataset.c, r = +b.dataset.r;
        const altul = Object.keys(loc).find(id => id !== ales && loc[id].c === c && loc[id].r === r);
        let txt = '';
        if (altul) { txt = `${Q.obiecte.find(o => o.id === altul).nume} a ieșit din cadru: pune-l în alt loc.`; delete loc[altul]; }
        loc[ales] = {c, r}; ales = null; mes.textContent = txt;
        desena();
      });
      desena();
      const pune = (s) => { loc = {}; Object.keys(s || {}).forEach(id => { loc[id] = {c: s[id][0], r: s[id][1]}; }); ales = null; mes.textContent = ''; desena(); };
      body._cmp = {pune, stare: () => ({loc: JSON.parse(JSON.stringify(loc)), nr: Object.keys(loc).length})};
      api.checkButton(() => {
        const S = body._cmp.stare();
        const lipsa = Q.obiecte.filter(o => !S.loc[o.id]);
        if (lipsa.length) {
          api.resolve(false, `În cadru lipsește: ${lipsa.map(o => o.nume).join(', ')}. Atinge numele, apoi locul.`);
        } else {
          const t = Q.teste.find(x => !x.ok(S));
          if (!t) { mes.textContent = ''; api.resolve(true); return; }
          api.resolve(false, t.msg);
        }
        api.revealButton(() => { pune(Q.solutie); api.giveUp('obiectele sunt acum la locurile cerute.'); });
      }, 'Verifică');
    },
    rezolva(Q, body) { body._cmp.pune(Q.solutie); },
    gresit(Q, body) { body._cmp.pune(Q.gresit); }
  };

  /* ---- ce s-a schimbat între două căsuțe ---- */
  const OPT_IMPLICIT = [{v: 'pe_loc', t: 'Stă la fel'}, {v: 'mutat', t: 'S-a mutat'}, {v: 'altfel', t: 'Arată altfel'}];
  const tipObiect = {
    render(Q, body, api) {
      stil();
      const opt = Q.optiuni || OPT_IMPLICIT;
      let ales = {};
      body.innerHTML = `<div class="sc-banda c2"><figure class="sc-c"><span class="sc-nr">1</span>${desen(Q.a)}${Q.ta ? `<figcaption>${Q.ta}</figcaption>` : ''}</figure><figure class="sc-c"><span class="sc-nr">2</span>${desen(Q.b)}${Q.tb ? `<figcaption>${Q.tb}</figcaption>` : ''}</figure></div>
<div class="sc-tab">${Q.obiecte.map(o => `<div class="sc-rand" data-id="${o.id}" role="group" aria-label="${esc(o.nume)}"><b>${o.nume}</b><div class="sc-opt">${opt.map(p => `<button type="button" data-v="${p.v}" aria-pressed="false">${p.t}</button>`).join('')}</div></div>`).join('')}</div><p class="sc-mes" aria-live="polite"></p>`;
      const pinteaza = () => body.querySelectorAll('.sc-rand').forEach(r => r.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(ales[r.dataset.id] === b.dataset.v))));
      body.querySelector('.sc-tab').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        ales[b.closest('.sc-rand').dataset.id] = b.dataset.v;
        pinteaza();
      });
      body._obj = {pune(s) { ales = Object.assign({}, s); pinteaza(); }, ia: () => Object.assign({}, ales)};
      api.checkButton(() => {
        const lipsa = Q.obiecte.filter(o => !ales[o.id]);
        if (lipsa.length) api.resolve(false, `Mai ai de ales la: ${lipsa.map(o => o.nume).join(', ')}.`);
        else {
          const r = Q.obiecte.find(o => ales[o.id] !== o.ok);
          if (!r) { api.resolve(true); return; }
          api.resolve(false, `Mai uită-te la rândul „${r.nume}”: în ce loc e în căsuța 1, în ce loc e în căsuța 2 și dacă arată la fel în amândouă.`);
        }
        api.revealButton(() => { const s = {}; Q.obiecte.forEach(o => { s[o.id] = o.ok; }); body._obj.pune(s); api.giveUp('alegerile bune sunt acum apăsate.'); });
      }, 'Verifică');
    },
    rezolva(Q, body) { const s = {}; Q.obiecte.forEach(o => { s[o.id] = o.ok; }); body._obj.pune(s); },
    gresit(Q, body) { body._obj.pune(Q.gresit); }
  };

  /* ---- căsuța greu de înțeles ---- */
  const tipNeclar = {
    render(Q, body, api) {
      stil();
      let ales = null;
      body.innerHTML = `<div class="sc-banda">${Q.casute.map((c, i) => `<button type="button" class="sc-c" data-id="${c.id}" aria-pressed="false" aria-label="Căsuța ${i + 1}: ${esc(c.text)}"><span class="sc-nr">${i + 1}</span>${desen(c.desen)}<span class="sc-t">${c.text}</span></button>`).join('')}</div><p class="sc-mes" aria-live="polite"></p>`;
      const pinteaza = () => body.querySelectorAll('.sc-c').forEach(b => { const a = b.dataset.id === ales; b.classList.toggle('ales', a); b.setAttribute('aria-pressed', String(a)); });
      body.querySelector('.sc-banda').addEventListener('click', (e) => {
        const b = e.target.closest('.sc-c');
        if (!b) return;
        ales = b.dataset.id; pinteaza();
      });
      body._ncl = {pune(id) { ales = id; pinteaza(); }};
      api.checkButton(() => {
        if (ales === Q.ok) { api.resolve(true); return; }
        api.resolve(false, ales === null ? 'Atinge căsuța la care te-ai opri, apoi Verifică.' : (Q.dece && Q.dece[ales]) || 'Asta se înțelege din căsuța de dinainte. Caută căsuța la care nu știi cum s-a ajuns acolo.');
        api.revealButton(() => { body._ncl.pune(Q.ok); api.giveUp('căsuța greu de înțeles e acum aleasă.'); });
      }, 'Verifică');
    },
    rezolva(Q, body) { body._ncl.pune(Q.ok); },
    gresit(Q, body) { body._ncl.pune(Q.casute.find(c => c.id !== Q.ok).id); }
  };

  window.ScenariuCasute = {versiune: VERSIUNE, stil, desen, banda, tipuri: {casute_ordine: tipOrdine, casute_compozitie: tipCompozitie, casute_obiect: tipObiect, casute_neclar: tipNeclar}};
})();
