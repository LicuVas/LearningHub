/* lectii/_sim/scratch-traseu.js — ScratchTraseu: traseul de reprodus pe scena simulatorului Scratch.

   PROPRIETAR: lecția V/32 (lectii/v/m5-l32, „Implementez structura secvențială cu blocuri grafice”, 08.11.2026). Încarcă
   lectii/_sim/scratch.js (SimScratch 1.4) NEMODIFICAT: tot ce adaugă stă peste tipul `scratch`, prin API-ul lui public
   (creeaza/tipuri.scratch, inst.on, inst.program, inst.stare, SimScratch.urma, SimScratch.ajutor) și prin DOM-ul declarat
   (.ss-scena, .ss-sprite, .ss-sus, .ss-pasb). Granița: _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/v_l32.md.

   CE ADAUGĂ (toate, DOAR în pagină; în Scratch-ul adevărat NU există, iar lecția o spune):
     - pe scenă: pătrățele de 50 de pași, traseul de reprodus (linie groasă, cu start și puncte numerotate), linia
       portocalie a drumului făcut de pisică la ultima rulare;
     - sub scenă: „Blocuri în zona de cod: N”;
     - cu Q.pune_mijloc, butonul „Pune pisica în mijloc (doar aici)”, la exercițiile fără start în program;
     - când zona de cod e prea îngustă (telefon) și „mergi la” are alte numere decât startul, zona se derulează singură cât să i se vadă câmpurile (1.1).
   FIDELITATE: execuția e a lui SimScratch (probată în editorul viu: lectii/v/m5-l32/_proba/live_v32.json). Blocurile de
   mișcare sunt instantanee și în Scratch: pisica sare la capătul blocului; linia portocalie leagă locurile prin care a
   trecut, cu linii drepte (o linie „doar aici”; în Scratch nu rămâne nicio urmă).
   Nimic nu se salvează, nimic nu pleacă.
   Dacă lectii/_sim/scratch-interfata.js (V/31) e încărcat, tipul cheamă SimScratchInterfata.pazaPaleta(inst): o tragere pornită vertical din paletă spune de ce n-a pus nimic.

   API PUBLIC (window.ScratchTraseu) — stabil de la 08.11.2026; orice schimbare se trece în graniță, cu data:
     versiune
     tipuri.traseu             tipul pentru motor; câmpurile tipului `scratch` + Q.traseu = [[x, y], …] (primul = startul),
                               Q.fara_grila (opțional): fără pătrățele; Q.nr_blocuri: true = cu numărătoarea blocurilor;
                               Q.pune_mijloc: true = cu butonul care readuce pisica (doar la exerciții fără start în program);
                               fără Q.traseu: doar linia portocalie
     drum(U, o) → [[x, y], …]  locurile prin care trece pisica la rularea U (din evenimentele 'poz'), începând cu o = {x, y}
     judeca(traseu, drum) → {start, atinse, lipsa, iesit, capat}
                               start: drumul trece prin primul punct; se judecă numai de acolo încolo
                               atinse: câte puncte (cu startul) au fost atinse în ordine, până să iasă de pe linie; lipsa: indicele
                               primului punct neatins sau null; iesit: locul unde ajunge pisica după blocul care o scoate de pe
                               linie ([x, y]) sau null; capat: drumul se termină în ultimul punct
     teste(traseu, {maxBlocuri, numePunct, faraStart}) → teste pentru `scratch` (rezultat, nu drum: unde ajunge și pe unde
                               trece, nu CE blocuri), în ordinea: lipit · start · puncte · pe traseu · capăt · [blocuri] · final
     final(traseu, {buton}) → testul de la coadă (1.1), „Steag apăsat, pisica la capăt”: judecă scena, nu rularea din S, deci ce
                               vede elevul = ce judecă testul; buton: true = mesajul trimite la butonul lui Q.pune_mijloc
     minus(P) → propoziția despre numerele cu minus din blocuri (sau ''), pentru mesaje
     desen(traseu, {alt, lat, grila}) → HTML: traseul desenat de sine stătător (fișa din laborator, „Uite cum”)
     nrBlocuri(P) → câte blocuri sunt în zona de cod (cu tot cu cel galben și cu cele lăsate deoparte)
   NU SE SCHIMBĂ: forma lui Q, clasele st-*, regula „nimic nu se salvează, nimic nu pleacă”. Numele testelor: la fel, în afară de ultimul (1.1, în graniță).
   TOLERANȚA: 0,5 unități (rotunjiri); numerele le scrie elevul, de pe grilă, deci nu e nevoie de mai mult. */
(function () {
  'use strict';
  if (window.ScratchTraseu || !window.SimScratch) return;
  const VERSIUNE = '1.1 (09.11.2026)';
  const TOL = 0.5;
  const A = SimScratch.ajutor;

  /* ---------------- geometria (oracolul independent din _proba o reface separat, în Python) ---------------- */
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function distSegment(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    if (!l2) return dist(p, a);
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
    return dist(p, [a[0] + t * dx, a[1] + t * dy]);
  }
  const peTraseu = (p, tr) => tr.some((a, i) => i > 0 && distSegment(p, tr[i - 1], a) <= TOL);

  function drum(U, o) {
    const pts = [[o.x, o.y]];
    (U.evenimente || []).forEach(e => { if (e.tip === 'poz') pts.push([e.valoare[0], e.valoare[1]]); });
    return pts;
  }
  function judeca(tr, pts) {
    const prim = pts.findIndex(p => dist(p, tr[0]) <= TOL);
    if (prim < 0) return {start: false, atinse: 0, lipsa: 0, iesit: null, capat: false};
    const d = pts.slice(prim);
    let k = 1, iesit = null;
    /* iesit = locul unde ajunge pisica după blocul care o scoate de pe linie (ea sare acolo; punctele dintre sunt doar socoteala) */
    const vezi = (p, capSegment) => {
      if (!iesit && !peTraseu(p, tr)) iesit = capSegment;
      while (!iesit && k < tr.length && dist(p, tr[k]) <= TOL) k++;
    };
    vezi(d[0], d[0]);
    for (let i = 1; i < d.length; i++) {
      const a = d[i - 1], b = d[i], n = Math.max(1, Math.ceil(dist(a, b)));
      for (let s = 1; s <= n; s++) vezi([a[0] + (b[0] - a[0]) * s / n, a[1] + (b[1] - a[1]) * s / n], b);
    }
    return {start: true, atinse: k, lipsa: k < tr.length ? k : null, iesit, capat: dist(d[d.length - 1], tr[tr.length - 1]) <= TOL};
  }
  const nrBlocuri = (P) => A.toate(P).length;
  const r0 = (v) => Math.round(v) || 0;

  /* ---------------- testele (pe COMPORTAMENT) ---------------- */
  const ALTUNDE = {x: -150, y: 60, directie: 0};
  const ETICHETA = 'Pune pisica în mijloc (doar aici)';
  /* numerele cu minus nu sunt predate: scoase doar dacă programul chiar le are */
  const minus = (P) => (P || []).some(sc => sc.b.some(b => ['mergi', 'roteste_dr', 'roteste_st'].includes(b[0]) && Number(b[1]) < 0))
    ? 'Un număr cu minus o duce pe pisică invers (înapoi sau în cealaltă parte): scrie-l fără minus. ' : '';
  /* testul de la coadă: se uită la SCENĂ. Celelalte judecă programul din S; ăsta, unde e pisica acum (o vede și elevul). */
  function final(tr, o) {
    o = o || {};
    const C = tr[tr.length - 1];
    let m = '';
    return {ce: 'Steag apăsat, pisica la capăt', get msg() { return m; },
      ok: (U, P, S) => {
        if (!S.apasatSteag) { m = 'Apasă steagul verde, deasupra scenei, și privește pisica.'; return false; }
        if (dist([S.x, S.y], C) <= TOL) return true;
        const acum = 'Pe scenă, pisica stă la x ' + r0(S.x) + ', y ' + r0(S.y) + ', nu la capăt. ';
        m = acum + (o.buton && dist([S.x, S.y], tr[0]) > TOL ? 'Apasă „' + ETICHETA + '”, apoi steagul o dată.' : 'Apasă steagul o dată.');
        return false;
      }};
  }
  function teste(tr, o) {
    o = o || {};
    const num = o.numePunct || ((i) => i === tr.length - 1 ? 'capăt' : 'punctul ' + i);
    /* punctele, drumul și capătul se judecă mereu ca și cum pisica ar pleca din primul punct, spre dreapta (oriunde ar fi ea pe ecran) */
    const d0 = {x: tr[0][0], y: tr[0][1], directie: 90};
    const dupaStart = (U, oo) => { const p = drum(U, oo), i = p.findIndex(q => dist(q, tr[0]) <= TOL); return i < 0 ? null : p.slice(i); };
    const lipit = {ce: 'Totul e lipit sub blocul galben', msg: 'Un singur program: toate blocurile, lipite sub blocul galben. Ce e lăsat deoparte nu pornește la steag: lipește-l sau trage-l în paletă.',
      ok: (U, P) => P.length === 1 && A.cuSteag(P).length === 1 && A.libere(P).length === 0};
    let mStart = '';
    const start = {ce: 'Pleacă de la start', o: ALTUNDE,
      get msg() { return mStart; },
      ok: (U, P) => {
        const a = dupaStart(U, ALTUNDE);
        if (!a) {
          const sc = P.find(s => s.b[0] && s.b[0][0] === 'steag'), bl = sc && sc.b.find(q => q[0] === 'mergi_la_xy');
          mStart = bl
            ? '„mergi la” o duce pe pisică la x ' + bl[1] + ', y ' + bl[2] + ', nu la start. Scrie în el ' + tr[0][0] + ' și ' + tr[0][1] + '.'
            : 'Pisica pleacă de unde a rămas, nu de la start. Lasă „mergi la x … y: …” peste marginea de jos a blocului galben și scrie în el ' + tr[0][0] + ' și ' + tr[0][1] + '.';
          return false;
        }
        const b = dupaStart(SimScratch.urma(P, {x: 77, y: -33, directie: 90}), {x: 77, y: -33});
        if (!b || JSON.stringify(a.map(q => q.map(r0))) !== JSON.stringify(b.map(q => q.map(r0)))) { mStart = 'Pisica ajunge la start, dar pleacă de acolo în direcția în care privea înainte. Sub „mergi la x … y: …” lipește „orientează-te în direcția 90”.'; return false; }
        return true;
      }};
    let mPct = '';
    const puncte = {ce: 'Trece prin toate punctele, în ordine', o: d0, get msg() { return mPct; },
      ok: (U, P) => {
        const J = judeca(tr, drum(U, d0));
        if (J.lipsa == null) return true;
        mPct = minus(P) + (J.iesit
          ? 'Un bloc o duce pe pisică la x ' + r0(J.iesit[0]) + ', y ' + r0(J.iesit[1]) + ', pe lângă linia verde, înainte să ajungă la ' + num(J.lipsa) + '. Citește blocurile de sus în jos și urmărește linia portocalie: unde o ia altfel?'
          : 'Pisica rămâne pe traseu, dar nu ajunge la ' + num(J.lipsa) + '. Îi mai trebuie blocuri sau un număr mai mare.');
        return false;
      }};
    let mIes = '';
    const peDrum = {ce: 'Nu iese de pe traseu', o: d0, get msg() { return mIes; },
      ok: (U, P) => {
        const j = judeca(tr, drum(U, d0));
        if (!j.iesit) return true;
        mIes = minus(P) + 'Un bloc o duce pe pisică la x ' + r0(j.iesit[0]) + ', y ' + r0(j.iesit[1]) + ', pe lângă linia verde. Trebuie să treacă pe unde trece linia, nu doar să ajungă la capăt.';
        return false;
      }};
    const capat = {ce: 'Se oprește la capătul traseului', o: d0, msg: 'Pisica nu se oprește la capătul traseului. Citește numerele din blocurile „mergi”: de la ultimul punct mai are de mers sau a mers prea mult.',
      ok: (U) => judeca(tr, drum(U, d0)).capat};
    const lista = o.faraStart ? [lipit, puncte, peDrum, capat] : [lipit, start, puncte, peDrum, capat];
    if (o.maxBlocuri) lista.push({ce: 'Cel mult ' + o.maxBlocuri + ' blocuri în zona de cod', msg: 'Sunt prea multe blocuri. Două „mergi” lipite unul de altul se pot uni: unul singur, cu suma lor. La fel, două rotiri cu aceeași săgeată.',
      ok: (U, P) => nrBlocuri(P) <= o.maxBlocuri});
    lista.push(final(tr, {buton: o.faraStart}));
    return lista;
  }

  /* ---------------- stratul de pe scenă ---------------- */
  const CSS = `
.st-strat{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2}
.st-nr{font:600 13px/1.3 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#3D4458;background:#fff;border:1px solid #D9E3F2;border-radius:8px;padding:6px 9px;margin:0}
.st-nr b{font-size:15px}
.st-leg{font:400 12px/1.35 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#3D4458;background:#fff;border:1px solid #D9E3F2;border-radius:8px;padding:5px 9px;margin:0}
.st-leg i{display:inline-block;width:18px;height:0;border-top:4px solid #2E7D5B;vertical-align:middle;margin:0 4px 0 0;opacity:.7}
.st-leg i.st-o{border-top:3px solid #E8590C}
.st-leg i.st-g{border-top:1px solid #9FB3C8}
.st-mij{font:600 13px/1.25 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#1F4E8C;background:#fff;border:1px solid #9FB3C8;border-radius:8px;padding:6px 10px;min-height:36px;cursor:pointer;justify-self:start}
.st-mij:focus-visible{outline:2px solid #1F4E8C;outline-offset:1px}`;
  function stil() {
    if (document.getElementById('st-css')) return;
    const s = document.createElement('style');
    s.id = 'st-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  const NS = 'http://www.w3.org/2000/svg';
  const pctSvg = (p) => p[0] + ',' + (-p[1]);
  /* culorile stau și ca atribute: desenul se vede și în fereastra mică (acolo foaia de stil a paginii poate lipsi) */
  function strat(tr, grila) {
    const lin = [];
    if (grila !== false) {
      for (let x = -200; x <= 200; x += 50) lin.push(`<line class="st-gr" stroke="#C9D6E6" vector-effect="non-scaling-stroke" x1="${x}" y1="-180" x2="${x}" y2="180"/>`);
      for (let y = -150; y <= 150; y += 50) lin.push(`<line class="st-gr" stroke="#C9D6E6" vector-effect="non-scaling-stroke" x1="-240" y1="${y}" x2="240" y2="${y}"/>`);
    }
    const tx = 'font-family="Arial,sans-serif" font-weight="800" font-size="20" text-anchor="middle" dominant-baseline="central"';
    const puncte = tr.map((p, i) => {
      const eticheta = i === 0 ? 'S' : i === tr.length - 1 ? 'C' : String(i), plin = i === 0;
      return `<circle class="st-pt${plin ? ' st-s' : ''}" fill="${plin ? '#2E7D5B' : '#fff'}" stroke="#2E7D5B" stroke-width="2" vector-effect="non-scaling-stroke" cx="${p[0]}" cy="${-p[1]}" r="14"/><text class="st-tx${plin ? ' st-s' : ''}" fill="${plin ? '#fff' : '#14533A'}" ${tx} x="${p[0]}" y="${-p[1]}">${eticheta}</text>`;
    }).join('');
    return `<svg class="st-strat" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="-240 -180 480 360" preserveAspectRatio="none" aria-hidden="true">${lin.join('')}<polyline class="st-tr" fill="none" stroke="#2E7D5B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".62" vector-effect="non-scaling-stroke" points="${tr.map(pctSvg).join(' ')}"/><polyline class="st-ur" fill="none" stroke="#E8590C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" points=""/>${puncte}</svg>`;
  }
  /* desenul traseului, de sine stătător (pentru „Uite cum”, fișa din laborator): același strat, fără pisică */
  function desen(tr, o) {
    stil();
    o = o || {};
    const titlu = o.alt || 'Traseu pe o scenă cu pătrățele';
    return `<div class="st-fisa" role="img" aria-label="${titlu}" style="position:relative;width:100%;max-width:${o.lat || 360}px;aspect-ratio:4/3;background:#fff;border:1px solid #D9E3F2;border-radius:8px;overflow:hidden;margin:6px 0">${strat(tr, o.grila)}</div>`;
  }

  /* ---------------- tipul pentru motor ---------------- */
  const baza = SimScratch.tipuri.scratch;
  const tipTraseu = {
    render(Q, body, api) {
      stil();
      /* „Arată-mi răspunsul”, la exercițiile fără start: pisica revine în mijloc, ca steagul cerut de mesaj să ducă unde spune */
      const api2 = Q.pune_mijloc ? Object.assign({}, api, {revealButton: (fn) => api.revealButton(() => { readu(); fn(); })}) : api;
      let readu = () => {};
      baza.render(Q, body, api2);
      const inst = body._ss, sc = body.querySelector('.ss-scena'), sus = body.querySelector('.ss-sus');
      if (!inst || !sc) return;
      const tr = Q.traseu || [];
      if (tr.length) sc.insertAdjacentHTML('beforeend', strat(tr, Q.fara_grila ? false : true));
      else sc.insertAdjacentHTML('beforeend', `<svg class="st-strat" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="-240 -180 480 360" preserveAspectRatio="none" aria-hidden="true"><polyline class="st-ur" fill="none" stroke="#E8590C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" points=""/></svg>`);
      const ur = sc.querySelector('.st-ur'), sp = sc.querySelector('.ss-sprite');
      let urma = [], observa = false, ultimSi = null;
      /* săritura de la locul vechi până la start („mergi la”) nu se desenează: altfel apare o diagonală peste traseu la fiecare steag */
      const arata = () => {
        const i = tr.length ? urma.findIndex(p => dist(p, tr[0]) <= TOL) : 0;
        ur.setAttribute('points', (i > 0 ? urma.slice(i) : urma).map(pctSvg).join(' '));
      };
      const curata = () => { urma = []; observa = false; arata(); };
      const stare = () => { const s = inst.stare(); return {x: s.x, y: s.y, directie: s.directie}; };
      /* ce stivă a fost apăsată (clic pe program = îl rulează) */
      body.querySelector('.ss-panza').addEventListener('pointerdown', (e) => { const s = e.target.closest('.ss-script'); ultimSi = s ? +s.dataset.si : null; }, true);
      const pornit = (ev) => {
        const s0 = stare();
        if (ev.cum === 'steag' || ev.cum === 'clic') {
          let P = inst.program();
          if (ev.cum === 'clic') {
            const sc0 = ultimSi != null ? P[ultimSi] : null;
            if (!sc0) { urma = [[s0.x, s0.y]]; observa = true; arata(); return; }
            P = [{x: sc0.x, y: sc0.y, b: sc0.b[0] && sc0.b[0][0] === 'steag' ? sc0.b : [['steag']].concat(sc0.b)}];
          }
          urma = drum(SimScratch.urma(P, s0), s0);
          observa = false;
        } else { urma = [[s0.x, s0.y]]; observa = true; }
        arata();
      };
      inst.on('pornit', pornit);
      /* „Pas cu pas”: linia crește o dată cu fiecare bloc (locul se citește de pe scenă, după fiecare pas) */
      const pb = body.querySelector('.ss-pasb');
      if (pb) pb.addEventListener('click', () => { if (/^Pas cu pas/.test(pb.textContent) || !observa) { const s0 = stare(); urma = [[s0.x, s0.y]]; observa = true; arata(); } }, true);
      const adauga = () => {
        const s = stare(), u = urma[urma.length - 1];
        if (!u || Math.abs(u[0] - s.x) > .01 || Math.abs(u[1] - s.y) > .01) { urma.push([s.x, s.y]); arata(); }
      };
      new MutationObserver(() => { if (observa) adauga(); }).observe(sp, {attributes: true, attributeFilter: ['style']});
      /* la ultimul pas, „terminat” vine înaintea observatorului (care e asincron): locul de la capăt se ia chiar aici */
      inst.on('terminat', (ev) => { if (ev.pasCuPas && observa) { adauga(); observa = false; } });
      inst.on('schimbat', (ev) => { if (!ev.personaj || !observa) curata(); });
      /* butonul care readuce pisica (doar la exercițiile fără start în program; în Scratch nu există) */
      if (Q.pune_mijloc && sus) {
        const p0 = Q.personaj || {x: 0, y: 0, directie: 90};
        readu = () => {
          inst.punePersonaj({x: p0.x, y: p0.y, directie: p0.directie});
          curata();
          body.querySelectorAll('.ss-tst li').forEach(li => { li.className = ''; li.querySelector('.s').textContent = '○'; const m = li.querySelector('.m'); m.hidden = true; m.textContent = ''; });
          const nrr = body.querySelector('.ss-tst .nr');
          if (nrr) nrr.textContent = 'apasă „Rulează testele”';
        };
        const bt = document.createElement('button');
        bt.type = 'button';
        bt.className = 'st-mij';
        bt.textContent = ETICHETA;
        bt.addEventListener('click', () => readu());
        sus.appendChild(bt);
      }
      /* paza tragerii din paletă, cu degetul: a lui V/31 (extensia scratch-interfata.js), doar folosită */
      if (window.SimScratchInterfata && SimScratchInterfata.pazaPaleta) SimScratchInterfata.pazaPaleta(inst);
      /* zona de cod îngustă (telefon): „mergi la x … y: …” e mai lat decât ea, iar câmpul y ar rămâne tăiat. Cât numerele lui nu sunt cele de start, după fiecare redesenare
         (și după ce scratch.js întoarce zona la stânga), zona se derulează cât să i se vadă câmpurile. Când numerele sunt bune, zona revine la stânga: se văd începuturile blocurilor,
         iar „orientează-te”, al cărui număr nu se schimbă, nu mută nimic. Dacă totul încape, nu se mișcă. Nimic cât degetul e pe ecran sau caseta e deschisă. */
      const cod = body.querySelector('.ss-cod'), pz = body.querySelector('.ss-panza');
      if (cod && pz) {
        let jos = false, sarit = false;
        const t0 = tr.length ? tr[0] : [0, 0];
        const aliniaza = () => {
          if (jos || !cod.clientWidth || pz.querySelector('input')) return;
          const sc0 = inst.program().find(s => s.b[0] && s.b[0][0] === 'steag');
          const rele = !!sc0 && sc0.b.some(b => b[0] === 'mergi_la_xy' && (Number(b[1]) !== t0[0] || Number(b[2]) !== t0[1]));
          const se = [...pz.querySelectorAll('.ss-script')].find(s => s.querySelector('.ss-b[data-id="steag"]'));
          if (!se || !rele) { if (sarit) { cod.scrollLeft = 0; sarit = false; } return; }
          const dr = cod.getBoundingClientRect().left + cod.clientLeft + cod.clientWidth;
          let peste = 0;
          se.querySelectorAll('.ss-b[data-id="mergi_la_xy"] .ss-pill').forEach(p => { peste = Math.max(peste, p.getBoundingClientRect().right + 6 - dr); });
          if (peste > 0) { cod.scrollLeft += peste; sarit = true; }
        };
        const curand = () => requestAnimationFrame(aliniaza);
        body.addEventListener('pointerdown', () => { jos = true; }, true);
        const sus2 = () => { jos = false; curand(); };
        window.addEventListener('pointerup', sus2, true);
        window.addEventListener('pointercancel', sus2, true);
        new MutationObserver(curand).observe(pz, {childList: true});
        if (window.ResizeObserver) new ResizeObserver(curand).observe(cod);
        curand();
      }
      /* numărătoarea blocurilor (doar în pagină) */
      if (Q.nr_blocuri && sus) {
        const p = document.createElement('p');
        p.className = 'st-nr';
        const pune = () => { const n = nrBlocuri(inst.program()); p.innerHTML = `Blocuri în zona de cod: <b>${n}</b> <small>(numără pagina; cu tot cu cel galben)</small>`; };
        pune();
        inst.on('schimbat', pune);
        sus.appendChild(p);
      }
      if (tr.length && sus) {
        const l = document.createElement('p');
        l.className = 'st-leg';
        const sare = (Q.paleta || []).includes('mergi_la_xy') ? ' Săritura până la S nu lasă linie.' : '';
        l.innerHTML = `<i></i>traseul, de la S la C · <i class="st-g"></i>un pătrățel = 50 de pași · <i class="st-o"></i>pe unde a trecut pisica.${sare} Pătrățelele și liniile sunt doar aici, în pagină.`;
        sus.appendChild(l);
      }
    },
    /* rezolvarea automată (poarta test_joc): soluția, steagul, iar pisica ajunge unde o duce soluția, plecând de unde stă acum sau din mijloc */
    rezolva(Q, body, api) {
      const i = body._ss;
      if (Q.pune_mijloc) { const p0 = Q.personaj || {x: 0, y: 0, directie: 90}; i.punePersonaj({x: p0.x, y: p0.y, directie: p0.directie}); }
      const s = i.stare(), U = SimScratch.urma(Q.solutie, {x: s.x, y: s.y, directie: s.directie});
      baza.rezolva(Q, body, api);
      i.punePersonaj({x: U.x, y: U.y, directie: U.directie});
    },
    gresit: baza.gresit
  };

  window.ScratchTraseu = {versiune: VERSIUNE, drum, judeca, teste, final, minus, nrBlocuri, desen, stil, ALTUNDE, tipuri: {traseu: tipTraseu}};
})();
