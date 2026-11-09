/* lectii/_sim/fisa-niveluri.js — FisaNiveluri: fișa de niveluri a elevului, pentru lecțiile „Recapitulare finală și feedback de progres”.

   PROPRIETAR: lecția V/36 (lectii/v/m5-l36, 09.11.2026). Componentă NOUĂ; nu schimbă motorul, prezenta.js, rezultat-elev.js sau alt simulator.
   Granița și ce se schimbă pe clasă: _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/v_l36.md („Forma pentru VI/36, VII/36, VIII/35”).
   Totul e condus de date: lista competențelor, descriptorii, dovezile și lecțiile vin din pagină. Aici nu scrie nimic despre o clasă anume.

   CE FACE: elevul apasă, pe fiecare rând (o competență), litera la care crede că e. Vede ce înseamnă litera la rândul acela. Vede la sfârșit
   rândul de copiat în caiet. Testul judecă doar FORMA: pe fiecare rând e ales ceva. Nu există literă „bună”, nu există scor, nu există notă.

   CE NU FACE (regulile 23 și 27, partea cea mai importantă a componentei):
     - nu ține minte nimic: literele stau în memorie, în acest element. Niciun localStorage, sessionStorage, cookie, IndexedDB;
     - nu trimite nimic: niciun fetch, sendBeacon, XMLHttpRequest. Motorul nu primește literele (api.resolve primește doar da/nu);
     - fără <input>, <textarea>, <form>: nimic de tastat, deci nimic de scăpat. Dovada, propozițiile și obiectivul se scriu în caiet;
     - literele dispar la: alt exercițiu (motorul golește #body), plecarea de pe pagină (pagehide, inclusiv întoarcerea din bfcache),
       alt elev în caseta de jos (evenimentul `prezenta` cu altă identitate), butonul „Golește fișa”.
   Proba: lectii/v/m5-l36/_proba/proba_fisa.py (stocarea și cererile, cu și fără litere, două scaune la rând).

   ÎNCĂRCARE (după motor.js):
     <script src="../../_sim/fisa-niveluri.js"></script>
     FisaNiveluri.stil();
     tipuri: {'fisa-niveluri': FisaNiveluri.tipuri['fisa-niveluri']}

   API PUBLIC (window.FisaNiveluri), stabil de la 09.11.2026; orice schimbare se trece în graniță, cu data:
     versiune
     stil()                           pune stilul (o dată; id fn-css; clasele au prefixul fn-)
     harta(randuri, eticheta?) → HTML harta „predat unde”: câte un rând pe competență, cu lecțiile (legături);
                                      eticheta '' = fără cuvântul „Lecțiile:” pe fiecare rând (1.1)
     lectii(lista, eticheta) → HTML   rândul de legături spre lecții (ținte ≥ 36 px); eticheta '' = fără etichetă (1.1)
     coduri(randuri, titlu?) → HTML   (1.1) un <details> cu fiecare cod, numele lui și ce poți arăta (pentru laborator)
     sari(n)               → HTML     (1.1) butoanele „Sari la exercițiul: 1 … n” (pentru intro-ul atelierului). Merg prin
                                      JocMotor.test.exercitiu(k), singura cale a motorului spre un exercițiu anume (ghidul,
                                      „Legături ascunse”: așa fac și excelx-test.js, simppt-proba.js). Fără ea: '' (niciun buton).
     curat(tipuri)         → tipuri   (1.1) aceleași tipuri, dar fiecare exercițiu din atelier primește un #body NOU (gol, fără
                                      mânere), ca la schimbarea paginii. Motivul: motorul refolosește #body între exerciții, iar
                                      urmarire-decizie.js lasă pe el un mâner de clic care, după tabel, redesenează tabelul peste
                                      exercițiul următor (judecata 1, V/36, A). Se pune pe TOATE tipurile atelierului.
     tipuri['fisa-niveluri']          tipul pentru motor (render, rezolva, gresit)

   FORMA DATELOR:
     rand = {cod:'CS.1.2', nume:'…(câteva cuvinte, pentru hartă)', oficial:'…(întocmai din fișa de niveluri)', scurt:'…(cuvintele fișei cu criteriile)',
             lectii:[{nr:10, href:'../m2-l10/?vezi=p2'}, …], c:'…', b:'…', a:'…' (descriptorii, în cuvinte de copil),
             dovezi:['…', '…'], ex:'…' (opțional: exercițiul din atelier al rândului)}
     Q = {t:'fisa-niveluri', q, randuri:[rand…],
          litere:[{l:'C', nume:'De bază'}, …] (opțional; implicit cele cinci din fișa oficială, în ordinea ei: C, B, A, D1, D2),
          sens:{D1:'…', D2:'…'} (ce înseamnă literele fără descriptori pe competență; aceleași pe toate rândurile),
          neatins:{buton:'…', text:'…'} (opțional: un buton care NU e literă, pentru rândul la care elevul n-a lucrat),
          nota:'…' (sus: ce se întâmplă cu literele), caiet:'…' (titlul rândului de copiat), ajutor, why,
          gata:'…' (1.1, opțional: ce scrie în locul lui „Corect!” când fișa e completă; implicit „Ai ales ceva pe fiecare rând.”)}
     „Corect!” nu apare la fișă (1.1): fișa se judecă pe formă, nu pe litere, deci mesajul spune doar atât. Focusul trece apoi
     pe „Încă un exercițiu” (sau pe mesaj), nu cade pe pagină (regula 14).

   NU SE SCHIMBĂ: clasele fn-*, forma lui Q, regula „nimic nu se păstrează, nimic nu pleacă”.

   Atingerile: butoanele au ≥ 44 px (regula 20), legăturile ≥ 36 px. Apăsarea nu redesenează rândurile, deci focusul și derularea rămân. */
(function () {
  const VERSIUNE = '1.1';
  const LITERE = [{l: 'C', nume: 'De bază'}, {l: 'B', nume: 'Consolidat'}, {l: 'A', nume: 'Avansat'}, {l: 'D1', nume: 'În formare'}, {l: 'D2', nume: 'În dificultate'}];
  const NEATINS = '-';
  let opresteVechi = null;   /* scoate mânerele (pagehide, prezenta) ale fișei desenate ultima oară */

  function stil() {
    if (document.getElementById('fn-css')) return;
    const s = document.createElement('style');
    s.id = 'fn-css';
    s.textContent = `
.fn-nota{border-left:4px solid var(--accent);background:var(--paper2);padding:6px 10px;margin:0 0 10px;border-radius:0 6px 6px 0}
.fn-test{display:flex;gap:8px;align-items:baseline;margin:10px 0 0;font-weight:600}
.fn-test .s{flex:none}
.fn-test.ok{color:var(--ok)}
.fn-rand{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:8px 10px;margin:8px 0}
.fn-titlu{margin:0 0 6px;font-size:1rem;font-weight:400;line-height:1.3}
.fn-cod{font-family:var(--fm,Consolas,monospace);font-weight:700;white-space:nowrap}
.fn-lit{display:flex;flex-wrap:wrap;gap:6px;align-items:stretch}
.fn-b{min-width:44px;min-height:44px;padding:4px 8px;border:2px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:700;cursor:pointer;touch-action:manipulation}
.fn-b.fn-alt{font-weight:400;font-size:.9rem;line-height:1.2;max-width:170px}
.fn-b[aria-pressed="true"]{background:var(--accent);color:var(--accentInk);border-color:var(--accent)}
.fn-b:focus-visible,.fn-nr:focus-visible{outline:3px solid var(--mark);outline-offset:2px}
.fn-sens{margin:6px 0 0;min-height:0}
.fn-sens:empty{display:none}
.fn-pl{margin:6px 0 0}
.fn-pl summary{cursor:pointer;color:var(--accent);font-weight:600;min-height:32px;display:flex;align-items:center}
.fn-pl p{margin:.35em 0}
.fn-pl ul{margin:.2em 0 .2em 1.2em;padding:0}
.fn-lk{display:flex;flex-wrap:wrap;gap:4px 5px;align-items:center;margin:.3em 0}
.fn-nr{display:inline-flex;align-items:center;justify-content:center;min-width:36px;min-height:36px;padding:0 4px;border:1px solid var(--accent);border-radius:7px;color:var(--accent);background:var(--paper);font-weight:700;text-decoration:none;touch-action:manipulation}
.fn-h{margin:6px 0}
.fn-hr{border-top:1px solid var(--line);padding:6px 0}
.fn-hr:first-child{border-top:0}
.fn-hr p{margin:0}
.fn-un{color:var(--ink2);font-size:.9rem}
.fn-rez{border:2px dashed var(--accent);border-radius:10px;background:var(--paper2);padding:8px 10px;margin:10px 0 0}
.fn-rez p{margin:.2em 0}
.fn-rez .fn-lin{font-family:var(--fm,Consolas,monospace);overflow-wrap:anywhere}
.fn-gol{margin:8px 0 0;min-height:44px}
.fn-sari{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:.4em 0}
.fn-sari button{min-width:44px;min-height:44px;padding:4px 8px;border:2px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--accent);font:inherit;font-weight:700;cursor:pointer;touch-action:manipulation}
.fn-sari button[aria-current="step"]{background:var(--accent);color:var(--accentInk)}
.fn-sari button:focus-visible{outline:3px solid var(--mark);outline-offset:2px}
.fn-cd summary{min-height:32px;cursor:pointer}
.fn-cd p{margin:.3em 0}
`;
    document.head.appendChild(s);
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  function lectii(lista, eticheta) {
    const et = eticheta == null ? 'Lecțiile:' : eticheta;
    return `<div class="fn-lk">${et ? `<span>${et}</span>` : ''}${lista.map(x => `<a class="fn-nr" href="${esc(x.href)}" target="_blank" rel="noopener" aria-label="Lecția ${x.nr}">${x.nr}</a>`).join('')}</div>`;
  }

  function harta(randuri, eticheta) {
    return `<div class="fn-h">${randuri.map(r => `<div class="fn-hr"><p><span class="fn-cod">${esc(r.cod)}</span> · ${esc(r.nume)}</p>${lectii(r.lectii, eticheta)}</div>`).join('')}</div>`;
  }

  /* laboratorul: ce înseamnă fiecare cod și ce poți arăta (din aceleași date) */
  function coduri(randuri, titlu) {
    return `<details class="verif fn-cd"><summary>${esc(titlu || 'Ce înseamnă codurile și ce poți arăta')}</summary>${randuri.map(r => `<p><span class="fn-cod">${esc(r.cod)}</span> · ${esc(r.nume)}: ${r.dovezi.join(' ')}</p>`).join('')}</details>`;
  }

  /* saltul la un exercițiu din atelier: motorul n-are altă cale decât cârligul porții (vezi capul fișierului) */
  const poateSari = () => !!(window.JocMotor && JocMotor.test && typeof JocMotor.test.exercitiu === 'function');
  const butoaneSari = n => Array.from({length: n}, (_, k) => `<button type="button" data-fn-sari="${k}" aria-label="Exercițiul ${k + 1}">${k + 1}</button>`).join('');
  /* fără n: butoanele se pun la primul desen, după „Exercițiul k din N” (numărul se ia din motor, nu se scrie de mână) */
  function sari(n) {
    if (!poateSari()) return '';
    return `<div class="fn-sari" role="group" aria-label="Sari la exercițiul"><span>Sari la exercițiul:</span>${n ? butoaneSari(n) : ''}</div>`;
  }
  /* butonul exercițiului de acum: din „Exercițiul k din N” pe care motorul îl scrie în #pq înainte de desen */
  function marcheazaSari() {
    const q = document.getElementById('pq'), m = q && /Exercițiul (\d+) din (\d+)/.exec(q.textContent);
    document.querySelectorAll('.fn-sari').forEach(g => { if (m && !g.querySelector('[data-fn-sari]')) g.insertAdjacentHTML('beforeend', butoaneSari(+m[2])); });
    document.querySelectorAll('[data-fn-sari]').forEach(b => {
      if (m && +b.dataset.fnSari === +m[1] - 1) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }
  document.addEventListener('click', e => {
    const b = e.target && e.target.closest && e.target.closest('[data-fn-sari]');
    if (!b || !poateSari() || !document.getElementById('body')) return;
    JocMotor.test.exercitiu(+b.dataset.fnSari);
    const q = document.getElementById('pq');
    if (q) { q.setAttribute('tabindex', '-1'); q.focus({preventScroll: true}); q.scrollIntoView({behavior: 'smooth', block: 'center'}); }
  });

  /* fiecare exercițiu din atelier primește un #body nou: mânerele lăsate pe #body de exercițiul de dinainte nu-l mai ating */
  function curat(tipuri) {
    const o = {};
    Object.keys(tipuri).forEach(k => {
      const t = tipuri[k];
      o[k] = Object.assign({}, t, {render(Q, body, api) {
        let b = body;
        if (body && body.id === 'body' && body.parentNode && body.isConnected) {
          b = body.cloneNode(false);
          body.replaceWith(b);
        }
        t.render(Q, b, api);
        marcheazaSari();
      }});
    });
    return o;
  }

  function render(Q, body, api) {
    stil();
    const lit = Q.litere || LITERE, R = Q.randuri, ales = {};
    const sensLit = (r, l) => {
      if (l === NEATINS) return (Q.neatins && Q.neatins.text) || '';
      const m = {C: r.c, B: r.b, A: r.a}[l] || (Q.sens && Q.sens[l]) || '';
      const n = (lit.find(x => x.l === l) || {}).nume || '';
      return `<b>${esc(l)}${n ? ' · ' + esc(n) : ''}:</b> ${m}`;
    };
    body.innerHTML = `<div class="fn">
      ${Q.nota ? `<p class="fn-nota">${Q.nota}</p>` : ''}
      ${R.map((r, i) => `<section class="fn-rand" data-i="${i}" aria-label="Rândul ${esc(r.cod)}">
        <p class="fn-titlu"><span class="fn-cod">${esc(r.cod)}</span> ${esc(r.scurt)}</p>
        <div class="fn-lit" role="group" aria-label="Litera ta la ${esc(r.cod)}">
          ${lit.map(x => `<button type="button" class="fn-b" data-l="${esc(x.l)}" aria-pressed="false" title="${esc(x.nume)}">${esc(x.l)}</button>`).join('')}
          ${Q.neatins ? `<button type="button" class="fn-b fn-alt" data-l="${NEATINS}" aria-pressed="false">${esc(Q.neatins.buton)}</button>` : ''}
        </div>
        <p class="fn-sens" aria-live="polite"></p>
        <details class="fn-pl"><summary>Cum recunosc literele și ce pot arăta</summary>
          <p><b>C:</b> ${r.c}</p><p><b>B:</b> ${r.b}</p><p><b>A:</b> ${r.a}</p>
          <p><b>Ce poți arăta (ce ai, nu tot):</b></p><ul>${r.dovezi.map(d => `<li>${d}</li>`).join('')}</ul>
          ${r.ex ? `<p>${r.ex}</p>` : ''}
          ${lectii(r.lectii, 'Recitește:')}
          <p class="fn-un">Numele oficial: ${esc(r.oficial)}</p>
        </details>
      </section>`).join('')}
      <p class="fn-test"><span class="s">○</span><span>Ai ales ceva pe fiecare rând (<span class="fn-c">0</span> din ${R.length})</span></p>
      <div class="fn-rez" hidden><p><b>${esc(Q.caiet || 'De scris în caiet')}</b></p><p class="fn-lin"></p></div>
      <button type="button" class="btn ghost sm fn-gol">Golește fișa</button>
    </div>`;
    const rand = i => body.querySelector(`.fn-rand[data-i="${i}"]`);
    function arata() {
      const n = Object.keys(ales).length;
      body.querySelector('.fn-c').textContent = String(n);
      const t = body.querySelector('.fn-test');
      t.classList.toggle('ok', n === R.length);
      t.querySelector('.s').textContent = n === R.length ? '✓' : '○';
      const z = body.querySelector('.fn-rez');
      z.hidden = !n;
      z.querySelector('.fn-lin').textContent = R.filter((r, i) => ales[i]).map(r => {
        const i = R.indexOf(r), l = ales[i];
        return `${r.cod}: ${l === NEATINS ? 'încă nu' : l}`;
      }).join(' · ');
    }
    function pune(i, l) {
      ales[i] = l;
      const e = rand(i);
      e.querySelectorAll('.fn-b').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === l)));
      e.querySelector('.fn-sens').innerHTML = sensLit(R[i], l);
    }
    function goleste() {
      Object.keys(ales).forEach(k => delete ales[k]);
      body.querySelectorAll('.fn-b').forEach(b => b.setAttribute('aria-pressed', 'false'));
      body.querySelectorAll('.fn-sens').forEach(p => { p.innerHTML = ''; });
      body.querySelectorAll('details.fn-pl').forEach(d => { d.open = false; });
      arata();
    }
    body.querySelectorAll('.fn-rand').forEach(e => {
      const i = +e.dataset.i;
      e.querySelectorAll('.fn-b').forEach(b => { b.onclick = () => { pune(i, b.dataset.l); arata(); }; });
    });
    body.querySelector('.fn-gol').onclick = goleste;

    /* plecarea de pe pagină și alt elev: fișa se golește (regula 23). Mânerele vechi se scot la fiecare desen (opresteVechi,
       ținut în componentă, nu pe #body, care se poate schimba) și singure, când fișa nu mai e în pagină (alt exercițiu):
       atunci literele au plecat deja odată cu fișa, iar mânerul doar se scoate (judecata 1, V/36, H). */
    if (opresteVechi) opresteVechi();
    const rad = body.querySelector('.fn');
    const idDe = e => (e ? [e.scoala, e.clasa, e.nume].join('|') : '');   /* Prezenta.identitate(): {nume, scoala, clasa} sau null */
    let cine = null;
    try { if (window.Prezenta && Prezenta.identitate) cine = idDe(Prezenta.identitate()); } catch (x) { cine = null; }
    const plecata = () => { if (rad.isConnected) return false; opreste(); return true; };
    const laPlecare = () => { if (!plecata()) goleste(); };
    const laPrezenta = e => {
      if (plecata()) return;
      const c = idDe(e && e.detail);
      if (cine !== null && c !== cine) goleste();
      cine = c;
    };
    window.addEventListener('pagehide', laPlecare);
    window.addEventListener('prezenta', laPrezenta);
    const opreste = () => {
      window.removeEventListener('pagehide', laPlecare); window.removeEventListener('prezenta', laPrezenta);
      if (opresteVechi === opreste) opresteVechi = null;
    };
    opresteVechi = opreste;

    const nav = api.checkButton(() => {
      const lipsa = R.filter((r, i) => !ales[i]).map(r => r.cod);
      if (lipsa.length) {
        api.resolve(false, `${lipsa.length === 1 ? 'Rândul ' + lipsa[0] + ' n-are' : 'Rândurile ' + lipsa.join(', ') + ' n-au'} nimic ales. Apasă o literă${Q.neatins ? ' sau „' + esc(Q.neatins.buton) + '”' : ''}, apoi din nou „Verifică fișa”.`);
        return;
      }
      nav.innerHTML = '';
      api.resolve(true);
      /* fără „Corect!”: fișa se judecă pe formă (ceva ales pe fiecare rând), nu pe litere */
      const fb = document.getElementById('fb'), cuv = fb && fb.querySelector('strong');
      if (cuv) cuv.textContent = Q.gata || 'Ai ales ceva pe fiecare rând.';
      const dupa = document.getElementById('inca');
      if (dupa) dupa.focus({preventScroll: true});
      else if (fb) { fb.setAttribute('tabindex', '-1'); fb.focus({preventScroll: true}); }
    }, 'Verifică fișa');
    body._fn = {pune, goleste, arata, ales};
    arata();
  }

  /* pentru poartă: rezolva = câte o literă pe fiecare rând (oricare e bună); gresit = un singur rând */
  const prima = Q => (Q.litere || LITERE)[0].l;
  function rezolva(Q, body) { Q.randuri.forEach((r, i) => body._fn.pune(i, prima(Q))); body._fn.arata(); }
  function gresit(Q, body) { body._fn.goleste(); body._fn.pune(0, prima(Q)); body._fn.arata(); }

  window.FisaNiveluri = {versiune: VERSIUNE, stil, harta, lectii, coduri, sari, curat, tipuri: {'fisa-niveluri': {render, rezolva, gresit}}};
})();
