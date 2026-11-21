/* excel-registru-foi-adapter.js — tipul „registru” al motorului de lecții, pe biblioteca aplicatii/ (excel.js).
   Înlocuiește lectii/_sim/registru-foi.js (SimRegistru) DOAR pentru exercițiile care cer `lib:true` în Q (primul exercițiu
   din lectii/viii/m1-l03/index.html). Celelalte exerciții rămân pe simulatorul vechi (SimRegistru), neatinse.
   Folosire (după aplicatii/aplicatii.js și registru-foi.js, înainte de JocMotor.porneste):
     <script src="../../../aplicatii/aplicatii.js"></script>
     <script src="../../_sim/registru-foi.js"></script>
     <script src="../../../aplicatii/adapters/excel-registru-foi-adapter.js"></script>
     JocMotor.porneste({ …, tipuri:{registru:TipRegistruExcel} })

   Verdictul vine din LH.aplicatii stare() (inst.stare()) după gesturile elevului:
   - nouFacut  registru_activ e deschis și nu s-a deschis niciun fișier în sesiune (deschideri === 0)
   - salvat    magazia Documente are un fișier care se potrivește cu model/ext, fără fișierele colegilor
   - colegi    fișierele colegilor din magazie au același conținut ca la pornire (citit din magazia reținută)
   Pornirea: magazia primește fișierele colegilor (COLEGI, Robotica_8A) înainte de montare, prin învelișul lui
   fisiere.nou; apoi se închide Book1-ul de pornire (Ctrl+W, neschimbat), ca lecția să pornească fără registru.
   Limite (spuse și aici): „Arată-mi răspunsul” nu construiește registrul; `rezolvare`/`greseala` nu se execută pe
   biblioteca nouă (rămân pe simulatorul vechi). */
(function () {
  'use strict';
  const W = window;
  const L = W.LH && W.LH.aplicatii;
  if (!L) throw new Error('excel-registru-foi-adapter: biblioteca aplicatii/ nu e încărcată (aplicatii.js înainte de adaptor)');

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fara = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  /* fișierele „colegilor” din laboratorul simulat (aceleași ca în lectia m1-l03: COLEGI și Robotica_8A) */
  const LUNA = (n, a2) => ({ n, d: { A1: 'Elev', B1: 'Prezent', A2: a2 || 'Ana', B2: 'da' } });
  const COLEGI = [
    { n: 'Ionescu_Maria_8A_lectia3.xlsx', foi: [{ n: 'Sheet1', d: { A1: 'Tema Mariei' } }] },
    { n: 'lectia3.xlsx', foi: [{ n: 'Sheet1', d: { A1: 'Tema lui Dan' } }] }
  ];
  const ROBOTICA = { n: 'Robotica_8A.xlsx', foi: [LUNA('Septembrie')] };
  const NUME_COLEGI = COLEGI.map(x => x.n);

  /* conținutul unui registru în forma magaziei (xlsx ca în excel.js: {foi:[{nume, cel, …}], fi}) */
  function registru(foi) {
    return {
      foi: foi.map(x => ({
        nume: x.n, cel: Object.fromEntries(Object.entries(x.d).map(([a, v]) => [a, { v }])), fmt: {}, merge: [], lat: {}, latSet: {},
        bord: {}, culoare: null, sel: { activa: { r: 0, c: 0 }, zone: [{ r0: 0, c0: 0, r1: 0, c1: 0 }] }
      })),
      fi: 0
    };
  }
  const SEMNATURA = {};   // nume fișier colegi -> JSON-ul conținutului la pornire (pentru testul „colegi”)
  COLEGI.concat([ROBOTICA]).forEach(x => { SEMNATURA[x.n] = JSON.stringify(registru(x.foi)); });

  /* magazia reținută: ultima magazie creată de biblioteca excel (una per instanță) */
  let MAGAZIE = null;
  let invelit = false;
  function invelisFisiere() {
    const M = L._module.fisiere;
    if (!M || typeof M.nou !== 'function' || invelit) return;
    invelit = true;
    const nou0 = M.nou;
    M.nou = function () {
      const S = nou0();
      COLEGI.concat([ROBOTICA]).forEach(x => S.salveaza('Documente', x.n, 'xlsx', registru(x.foi)));
      MAGAZIE = S;
      return S;
    };
  }

  /* „model” ca în registru-foi.js: Prenume_Nume_8A_lectia3(_2).xlsx, cu orice ordine a părților de dinainte */
  function potriveste(nume, model, ext) {
    const re = new RegExp('^[^_\\s.]+_[^_\\s.]+_[^a-z0-9]*[a-z0-9].*?_' + model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(_?\\d{1,2})?\\.' + ext + '$', 'i');
    return re.test(fara(nume));
  }

  let css_ok = false;
  function css() {
    if (css_ok) return; css_ok = true;
    const s = document.createElement('style');
    s.id = 'rel-css';
    s.textContent = `
.rel-cum{margin:0 0 8px;font-size:.88rem;color:var(--ink2)}
.rel-host{min-height:0}
.rel-teste{margin:8px 0;font-size:.9rem}
.rel-teste .lbl{font-weight:700;color:var(--accent)}
.rel-teste ol{list-style:none;padding:0;margin:4px 0}
.rel-teste li{display:flex;gap:8px;margin:2px 0;color:var(--ink2)}
.rel-teste li.ok{color:var(--ok)}`;
    document.head.appendChild(s);
  }

  /* verdictul pe fiecare test: {ok, ce} în ordinea din Q.teste */
  function verifica(Q, s) {
    return (Q.teste || []).map(t => {
      let ok = false;
      if (t.nouFacut) ok = !!s && s.registru_activ !== null && s.deschideri === 0;
      else if (t.salvat) {
        const c = t.salvat;
        const nume = ((s && s.fisiere && s.fisiere[c.folder || 'Documente']) || []).filter(n => !NUME_COLEGI.includes(n));
        ok = nume.some(n => (c.ext || 'xlsx') === n.split('.').pop().toLowerCase() && (c.model ? potriveste(n, c.model, c.ext || 'xlsx') : true));
      } else if (t.colegi) {
        ok = !!MAGAZIE && COLEGI.every(x => {
          const e = MAGAZIE.deschide('Documente', x.n);
          return !!e && JSON.stringify(e.cont) === SEMNATURA[x.n];
        });
      }
      if (!ok && !t.nouFacut && !t.salvat && !t.colegi) W.console.warn('excel-registru-foi-adapter: test necunoscut pe biblioteca nouă', t);
      return { ok, ce: t.ce };
    });
  }

  function randeaza(Q, body, api) {
    css();
    body.innerHTML = `<p class="rel-cum">Lucrezi în Excel-ul adevărat (biblioteca de aplicații). Fă pașii cu mouse-ul și tastatura, apoi apasă <b>Verifică</b>.</p>
<div class="rel-host"></div>
<div class="rel-teste"></div>`;
    const host = body.querySelector('.rel-host');
    const tes = body.querySelector('.rel-teste');
    const st = { inst: null, root: null, s: null };
    let pornit = false;

    function refresh() {
      if (!tes) return;
      const r = verifica(Q, st.s);
      tes.innerHTML = r.length ? `<div class="lbl">Testele sarcinii · ${r.filter(x => x.ok).length} din ${r.length} trec</div><ol>${r.map(x => `<li class="${x.ok ? 'ok' : ''}"><span>${x.ok ? '✓' : '○'}</span><span>${x.ce}</span></li>`).join('')}</ol>` : '';
    }
    const ascultator = setInterval(() => {
      if (!host.isConnected) { clearInterval(ascultator); return; }
      if (!st.inst) return;
      try { st.s = st.inst.stare(); } catch (e) { st.s = null; }
      refresh();
    }, 150);

    /* magazia (fisiere.js) se încarcă în fundal: învelișul trebuie pus înainte de prima magazie a instanței */
    L.gata.then(() => L._script('fisiere.js'))
      .then(() => { invelisFisiere(); return L.deschide('excel', { loc: host, continut: {}, focus: false }); })
      .then(inst => {
        st.inst = inst;
        st.root = host.querySelector('[data-lh-aplicatie="excel"]');
        /* pornirea fără registru (ca Excel deschis gol): Ctrl+W pe Book1 nemodificat; nu e o acțiune a elevului */
        if (st.root) st.root.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', ctrlKey: true, bubbles: true, cancelable: true }));
        pornit = true;
        st.s = inst.stare();
        refresh();
      })
      .catch(e => { if (tes) tes.textContent = 'Excel nu s-a încărcat: ' + (e && e.message ? e.message : e); });

    api.checkButton(() => {
      if (!pornit || !st.inst) { api.resolve(false, 'Excel încă se încarcă. Așteaptă un moment și apasă din nou.'); return; }
      const r = verifica(Q, st.inst.stare());
      const rau = r.find(x => !x.ok);
      if (!rau) api.resolve(true);
      else {
        api.resolve(false, `Încă nu: <b>${esc(rau.ce)}</b>.`);
        api.revealButton(() => api.giveUp(Q.raspuns || 'Fă pașii în Excel: registru nou, salvare în Documente cu numele tău, apoi Save.'));
      }
    });
  }

  /* contractul tipului (ca SimRegistru): render / rezolva / gresit / stare. Exercițiile fără `lib:true` merg pe SimRegistru. */
  const TipRegistruExcel = {
    render(Q, body, api) {
      if (Q && Q.lib === true) return randeaza(Q, body, api);
      return W.SimRegistru.render(Q, body, api);
    },
    rezolva(Q, body, api) {
      if (Q && Q.lib === true) return randeaza(Q, body, api);
      return W.SimRegistru.rezolva(Q, body, api);
    },
    gresit(Q, body, api) {
      if (Q && Q.lib === true) { randeaza(Q, body, api); return true; }
      return W.SimRegistru.gresit(Q, body, api);
    },
    stare(body) { return W.SimRegistru.stare(body); }
  };
  W.TipRegistruExcel = TipRegistruExcel;
})();
