/* excel-registru-foi-adapter.js — tipul „registru” al motorului de lecții, pe biblioteca aplicatii/ (excel.js).
   Înlocuiește lectii/_sim/registru-foi.js (SimRegistru) pentru lecția care îl încarcă: toate exercițiile de tip „registru”
   rulează în Excel-ul adevărat (biblioteca), nu în simulator.
   Folosire (în lecție, după motor.js):
     <script src="../../../aplicatii/aplicatii.js"></script>
     <script src="../../../aplicatii/adapters/excel-registru-foi-adapter.js"></script>
     JocMotor.porneste({ …, tipuri:{registru:SimRegistru} })
   Adaptorul pune W.SimRegistru = TipRegistruExcel, deci lecția nu-și schimbă datele: tipuri:{registru:SimRegistru} ia
   tipul de pe bibliotecă (registru-foi.js NU se mai încarcă în lecția care folosește adaptorul).

   Verdictul vine din LH.aplicatii stare() (inst.stare()) și din magazia Documente/Desktop/… (fisiere.js) după gesturile elevului.
   Testele (Q.teste), fiecare cu toate cheile pe care le are (ȘI între chei):
   - nouFacut          registru_activ e deschis și nu s-a deschis niciun fișier în sesiune (deschideri === 0)
   - salvat            {folder, fisier|model, ext, foi, culoare}: un fișier nou sau modificat în folder, cu acel nume/model/format,
                       cu foile (în ordine) și culorile cerute
   - colegi            fișierele colegilor (și cele din start marcate coleg) au același conținut ca la pornire
   - neschimbat        ['Dosar/Nume', …]: fișierele au același conținut ca la pornire
   - redeschis         registrul a fost închis și apoi deschis din nou în sesiune
   - deschisDin        {folder, fisier|model, ext}: registrul activ e fișierul din acel folder
   - foi               lista foilor, în ordine (Name Box-ul de foi)
   - activa            foaia activă
   - culoare           {Foaie: 'verde'|'orice'|'nu'|'#RRGGBB'}: culoarea filei (pe registrul deschis)
   - date              {Foaie: {A2: 'Ana'}}: valorile din celule pe registrul deschis
   - nuAreFoi          [nume]: foile care NU mai există
   - inchis            nu e niciun registru deschis
   Start (Q.start): gol, registru {nume|fisier, foi, a, m}, fisiere {Dosar: [{n, foi, coleg}]}, locPropus.
   Opțiuni (Q.o, Q.ok): întrebare cu răspunsuri; răspunsul corect se alege cu clic.
   „Arată-mi răspunsul” (noaptea 27-28.11.2026, ca registru-foi.js care rula Q.rezolvare în fereastră): pașii din Q.rezolvare se
   joacă pe un MODEL (registrul + fișierele din magazie), apoi Excel-ul se redeschide în același loc în starea de la capăt, prin
   parametrii de conținut ai bibliotecii (deschide(…, {continut}), api_biblioteca §1), iar fișierele salvate se scriu în magazie.
   Textul spune „am făcut pașii” DOAR dacă după asta testele exercițiului chiar trec. Altfel (un pas pe care modelul nu-l știe,
   CSV/PDF, testul `redeschis`, care cere închidere + deschidere în sesiune) fereastra rămâne a elevului, iar textul îi spune
   pașii exercițiului de față, ca să-i facă el; nu afirmă nimic despre fereastră.
   Limite: „greșeala” (gresit) și rezolva (testul automat al motorului) doar redesenează, nu joacă pașii. */
(function () {
  'use strict';
  const W = window;
  const L = W.LH && W.LH.aplicatii;
  if (!L) throw new Error('excel-registru-foi-adapter: biblioteca aplicatii/ nu e încărcată (aplicatii.js înainte de adaptor)');

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fara = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const extDe = n => String(n || '').split('.').pop().toLowerCase();
  const VERZI = ['#00B050', '#008000', '#00FF00'];

  /* fișierele „colegilor” din laboratorul simulat (lectia m1-l03) */
  const LUNA = (n, a2) => ({ n, d: { A1: 'Elev', B1: 'Prezent', A2: a2 || 'Ana', B2: 'da' } });
  const COLEGI = [
    { n: 'Ionescu_Maria_8A_lectia3.xlsx', coleg: true, foi: [{ n: 'Sheet1', d: { A1: 'Tema Mariei' } }] },
    { n: 'lectia3.xlsx', coleg: true, foi: [{ n: 'Sheet1', d: { A1: 'Tema lui Dan' } }] }
  ];
  const NUME_COLEGI = COLEGI.map(x => x.n);

  /* conținutul unui registru în forma magaziei (xlsx ca în excel.js: {foi:[{nume, cel, …}], fi}) */
  function registru(foi) {
    return {
      foi: foi.map(x => ({
        nume: x.n, cel: Object.fromEntries(Object.entries(x.d || {}).map(([a, v]) => [a, { v }])), fmt: {}, merge: [], lat: {}, latSet: {},
        bord: {}, culoare: x.c || null, sel: { activa: { r: 0, c: 0 }, zone: [{ r0: 0, c0: 0, r1: 0, c1: 0 }] }
      })),
      fi: 0
    };
  }

  /* starea magaziei la pornirea exercițiului curent: SEMINTE (lista), SNAP ('Dosar/Nume' -> JSON la pornire), MAGAZIE (instanța) */
  let SEMINTE = [];
  let SNAP = {};
  let MAGAZIE = null;
  let invelit = false;
  const cheie = (d, n) => d + '/' + n;

  /* fișierele care există la pornirea exercițiului: din Q.start.fisiere (sau colegii, dacă nu e dat nimic), plus registrul
     deschis din fișier (dacă nu e deja în fisiere) */
  function seminteDe(Q) {
    const st = (Q && Q.start) || {};
    const f = st.fisiere || (st.registru ? {} : { Documente: COLEGI });
    const lista = [];
    Object.keys(f).forEach(d => f[d].forEach(x => lista.push({ d, n: x.n, foi: x.foi || [{ n: 'Sheet1', d: {} }], coleg: !!x.coleg || NUME_COLEGI.indexOf(x.n) >= 0 })));
    const r = st.registru;
    if (r && r.fisier) {
      const [d, n] = r.fisier.split('/');
      if (!lista.some(x => x.d === d && x.n === n)) lista.push({ d, n, foi: r.foi || [], coleg: false });
    }
    return lista;
  }

  function invelisFisiere() {
    const M = L._module.fisiere;
    if (!M || typeof M.nou !== 'function' || invelit) return;
    invelit = true;
    const nou0 = M.nou;
    M.nou = function () {
      const S = nou0();
      SNAP = {};
      SEMINTE.forEach(x => {
        S.salveaza(x.d, x.n, 'xlsx', registru(x.foi));
        SNAP[cheie(x.d, x.n)] = JSON.stringify(registru(x.foi));
      });
      MAGAZIE = S;
      return S;
    };
  }

  /* „model” ca în registru-foi.js: Prenume_Nume_8A_lectia3(_2).xlsx, cu orice ordine a părților de dinainte */
  function potriveste(nume, model, ext) {
    const re = new RegExp('^[^_\\s.]+_[^_\\s.]+_[^a-z0-9]*[a-z0-9].*?_' + model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(_?\\d{1,2})?\\.' + ext + '$', 'i');
    return re.test(fara(nume));
  }

  /* o magazie: intrarea (dosar, nume) și dacă a fost schimbată față de pornire */
  const intrare = (d, n) => (MAGAZIE ? MAGAZIE.deschide(d, n) : null);
  const seminta = (d, n) => SNAP[cheie(d, n)] !== undefined;
  const schimbat = (d, n) => { const e = intrare(d, n); return !!e && JSON.stringify(e.cont) !== SNAP[cheie(d, n)]; };
  const esteAlFelDeCeaDinStart = (d, n) => !seminta(d, n) || schimbat(d, n);

  /* culoarea unei file cerută de test: 'verde' = una din VERZI, 'orice' = are culoare, 'nu' = fără, altfel hex exact */
  function culoareOk(lista, cer) {
    return Object.keys(cer).every(nume => {
      const f = lista.find(x => fara(x.nume) === fara(nume));
      const c = f && f.culoare ? String(f.culoare).toUpperCase() : null;
      const v = cer[nume];
      if (v === 'orice') return !!c;
      if (v === 'nu') return !c;
      if (v === 'verde') return !!c && VERZI.indexOf(c) >= 0;
      return !!c && c === String(v).toUpperCase();
    });
  }
  const potriveFisier = (n, c) => (!c.fisier || fara(n) === fara(c.fisier)) && (!c.model || potriveste(n, c.model, c.ext || 'xlsx'));

  /* fiecare test: toate cheile prezente trebuie să fie adevărate; cheie necunoscută = nu trece (și se semnalează) */
  const CHEI = ['nouFacut', 'salvat', 'colegi', 'neschimbat', 'redeschis', 'deschisDin', 'foi', 'activa', 'culoare', 'date', 'nuAreFoi', 'inchis'];

  function unTest(t, s) {
    const toate = { };
    CHEI.forEach(k => { if (t[k] !== undefined) toate[k] = t[k]; });
    const cheiStr = Object.keys(t).filter(k => k !== 'ce' && CHEI.indexOf(k) < 0);
    if (!Object.keys(toate).length || cheiStr.length) { W.console.warn('excel-registru-foi-adapter: test necunoscut', t); return false; }
    const foiLive = s && Array.isArray(s.foi) ? s.foi : [];
    const listaLive = foiLive.map(n => ({ nume: n, culoare: s.culori_file ? s.culori_file[n] || null : null }));
    return Object.keys(toate).every(k => {
      const v = toate[k];
      if (k === 'nouFacut') return !!s && s.registru_activ !== null && s.deschideri === 0;
      if (k === 'inchis') return !!s && s.registru_activ === null;
      if (k === 'redeschis') return !!s && s.inchideri >= 1 && s.deschideri >= 1 && s.registru_activ !== null;
      if (k === 'deschisDin') {
        if (!s || s.registru_activ === null) return false;
        const d = v.folder || 'Documente';
        return s.dosar_fisier === d && potriveFisier(s.nume_fisier || '', v);
      }
      if (k === 'salvat') {
        const d = v.folder || 'Documente', e = v.ext || 'xlsx';
        if (!MAGAZIE) return false;
        return ((s && s.fisiere && s.fisiere[d]) || []).some(n => {
          if (extDe(n) !== e || !potriveFisier(n, Object.assign({}, v, { ext: e }))) return false;
          if (!esteAlFelDeCeaDinStart(d, n)) return false;
          const en = intrare(d, n);
          if (e !== 'xlsx') return true;
          const foi = en && en.cont && Array.isArray(en.cont.foi) ? en.cont.foi : null;
          if (!foi) return false;
          if (v.foi && !(foi.length === v.foi.length && foi.every((f, i) => fara(f.nume) === fara(v.foi[i])))) return false;
          if (v.culoare && !culoareOk(foi.map(f => ({ nume: f.nume, culoare: f.culoare })), v.culoare)) return false;
          return true;
        });
      }
      if (k === 'colegi') {
        if (!MAGAZIE) return false;
        return SEMINTE.filter(x => x.coleg).every(x => !!intrare(x.d, x.n) && !schimbat(x.d, x.n));
      }
      if (k === 'neschimbat') {
        return v.every(p => { const i = p.indexOf('/'); const d = p.slice(0, i), n = p.slice(i + 1); return seminta(d, n) && !!intrare(d, n) && !schimbat(d, n); });
      }
      if (k === 'foi') return !!s && foiLive.length === v.length && foiLive.every((n, i) => fara(n) === fara(v[i]));
      if (k === 'activa') return !!s && fara(s.foaie_activa) === fara(v);
      if (k === 'culoare') return !!s && culoareOk(listaLive, v);
      if (k === 'date') {
        return !!s && Object.keys(v).every(foaie => {
          const celule = (s.foi_celule || {})[foaie] || {};
          return Object.keys(v[foaie]).every(a => { const x = celule[a]; const val = x && typeof x === 'object' ? (x.valoare != null ? x.valoare : x.text) : x; return String(val == null ? '' : val) === String(v[foaie][a]); });
        });
      }
      if (k === 'nuAreFoi') return !!s && v.every(nume => !foiLive.some(n => fara(n) === fara(nume)));
      return false;
    });
  }

  /* verdictul pe fiecare test: {ok, ce} în ordinea din Q.teste */
  function verifica(Q, s) {
    return (Q.teste || []).map(t => ({ ok: unTest(t, s), ce: t.ce }));
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
.rel-teste li.ok{color:var(--ok)}
.rel-opts{display:flex;flex-direction:column;gap:6px;margin:10px 0}
.rel-opts .rel-opt{text-align:left;padding:8px 10px;border:1px solid #c8c8c8;border-radius:6px;background:#fff;color:#111;font:inherit;cursor:pointer;min-height:36px}
.rel-opts .rel-opt:hover:not(:disabled){background:#eaf4ee}
.rel-opts .rel-opt.ok{border-color:#2e7d32;background:#e8f5e9}
.rel-opts .rel-opt.bad{border-color:#b71c1c;background:#ffebee}
.rel-opts .rel-opt:disabled{cursor:default;opacity:.85}`;
    document.head.appendChild(s);
  }

  /* starea de pornire a registrului (Q.start.registru) ca parametri de conținut ai bibliotecii; null = Excel gol (Book1 închis) */
  function continutDe(Q) {
    const st = (Q && Q.start) || {};
    const r = st.registru;
    if (!r) return {};
    const c = { foi: (r.foi || []).map(x => ({ nume: x.n, celule: x.d || {} })), fi: r.a || 0, modificat: !!r.m };
    if (r.fisier) { const [d, n] = r.fisier.split('/'); c.nume = n; c.dosar = d; }
    if (st.locPropus) c.locPropus = st.locPropus;
    return c;
  }

  /* ——— „Arată-mi răspunsul”: modelul pe care se joacă Q.rezolvare (aceleași reguli ca registru-foi.js › ruleaza) ——— */
  const copieJ = o => JSON.parse(JSON.stringify(o));
  const CULORI = { '#FFFF00': 'Yellow', '#00B050': 'Green', '#FF0000': 'Red', '#FFC000': 'Orange', '#0070C0': 'Blue', '#00B0F0': 'Light Blue', '#7030A0': 'Purple', '#92D050': 'Light Green', '#C00000': 'Dark Red', '#002060': 'Dark Blue' };
  /* modelul la pornirea exercițiului: wb = registrul deschis ({foi:[{n, d, c}], a, m, nume, dosar}) sau null; fis = magazia */
  function modelDe(Q) {
    const st = (Q && Q.start) || {};
    const fis = {};
    seminteDe(Q).forEach(x => { (fis[x.d] = fis[x.d] || {})[x.n] = { foi: copieJ(x.foi) }; });
    const r = st.registru;
    let wb = null;
    if (r) {
      wb = { foi: copieJ(r.foi || []), a: r.a || 0, m: !!r.m, nume: null, dosar: null };
      if (r.fisier) { const [d, n] = r.fisier.split('/'); wb.nume = n; wb.dosar = d; }
    }
    return { wb, fis, scrise: {} };
  }
  const numeFis = (v, e) => { let n = String(v || '').trim().replace(/[\\/:*?"<>|]/g, ''); if (n && !new RegExp('\\.' + e + '$', 'i').test(n)) n += '.' + e; return n; };
  /* joacă pașii pe model; false = un pas pe care modelul nu-l poate juca (atunci fereastra nu se atinge) */
  function joaca(M, ops) {
    const idx = n => M.wb.foi.findIndex(f => fara(f.n) === fara(n));
    const numeNou = () => { const R = M.wb; let k = R.cnt || R.foi.length + 1; while (R.foi.some(f => fara(f.n) === fara('Sheet' + k))) k++; R.cnt = k + 1; return 'Sheet' + k; };
    const salveazaLa = (d, n) => {
      (M.fis[d] = M.fis[d] || {})[n] = { foi: copieJ(M.wb.foi) };
      M.scrise[cheie(d, n)] = true;
      M.wb.nume = n; M.wb.dosar = d; M.wb.m = false;
    };
    const salveazaNou = o => {
      const e = o.tip || 'xlsx', d = o.folder || 'Documente', n = numeFis(o.nume, e);
      if (e !== 'xlsx' || !n) return false;                       /* CSV / PDF: nu le joacă modelul */
      if (M.fis[d] && Object.keys(M.fis[d]).some(x => fara(x) === fara(n)) && !o.inlocuieste) return false;
      salveazaLa(d, n); return true;
    };
    for (const [op, ...a] of (ops || [])) {
      if (op === 'nou') { if (M.wb) return false; M.wb = { foi: [{ n: 'Sheet1', d: {} }], a: 0, m: false, nume: null, dosar: null, cnt: 2 }; continue; }
      if (op === 'deschide') {
        if (M.wb) return false;
        const [d, n] = String(a[0]).split('/');
        const f = M.fis[d] && M.fis[d][n];
        if (!f) return false;
        M.wb = { foi: copieJ(f.foi), a: 0, m: false, nume: n, dosar: d };
        continue;
      }
      const R = M.wb;
      if (!R) return false;
      if (op === 'plus') { R.foi.splice(R.a + 1, 0, { n: numeNou(), d: {} }); R.a++; R.m = true; }
      else if (op === 'inserareInainte') { R.foi.splice(R.a, 0, { n: numeNou(), d: {} }); R.m = true; }
      else if (op === 'activeaza') { const i = idx(a[0]); if (i < 0) return false; R.a = i; }
      else if (op === 'redenumeste') { const i = idx(a[0]); if (i < 0) return false; R.foi[i].n = String(a[1]); R.m = true; }
      else if (op === 'culoare') { const i = idx(a[0]); if (i < 0) return false; R.foi[i].c = a[1] ? String(a[1]).toUpperCase() : null; R.m = true; }
      else if (op === 'sterge') {
        const i = idx(a[0]); if (i < 0) return false;
        if (R.foi.length > 1) { R.foi.splice(i, 1); if (R.a >= R.foi.length) R.a = R.foi.length - 1; else if (R.a > i) R.a--; R.m = true; }
      } else if (op === 'muta' || op === 'copiaza') {
        const i = idx(a[0]); let j = a[1] == null ? R.foi.length : idx(a[1]);
        if (i < 0 || j < 0) return false;
        if (op === 'copiaza') {
          const f = copieJ(R.foi[i]), b = f.n.replace(/ \(\d+\)$/, '');
          let k = 2, x; do { x = b + ' (' + (k++) + ')'; } while (R.foi.some(g => fara(g.n) === fara(x)));
          f.n = x.slice(0, 31); R.foi.splice(j, 0, f); R.a = j; R.m = true;
        } else if (j !== i && j !== i + 1) { const [f] = R.foi.splice(i, 1); if (j > i) j--; R.foi.splice(j, 0, f); R.a = j; R.m = true; }
      } else if (op === 'scrie') {
        const i = idx(a[0]); if (i < 0) return false;
        if (String(a[2]) === '') delete R.foi[i].d[a[1]]; else R.foi[i].d[a[1]] = String(a[2]);
        R.m = true;
      } else if (op === 'salveaza') {
        if (R.nume && R.dosar && extDe(R.nume) === 'xlsx') salveazaLa(R.dosar, R.nume);
        else if (!salveazaNou(a[0] || {})) return false;
      } else if (op === 'salveazaCa') { if (!salveazaNou(a[0] || {})) return false; }
      else if (op === 'inchide') {
        if (R.m && a[0] === 'da') { if (!(R.nume && R.dosar)) return false; salveazaLa(R.dosar, R.nume); }
        M.wb = null;
      } else return false;
    }
    return true;
  }
  /* registrul din model ca parametri de conținut ai bibliotecii (foile, culorile filelor, foaia activă, fișierul) */
  function continutModel(wb) {
    const c = { foi: wb.foi.map(f => { const x = { nume: f.n, celule: f.d || {} }; if (f.c) x.culoare = f.c; return x; }), fi: wb.a || 0, modificat: !!wb.m };
    if (wb.nume && wb.dosar) { c.nume = wb.nume; c.dosar = wb.dosar; }
    return c;
  }
  /* pașii exercițiului de față, în cuvinte (din Q.rezolvare) */
  function pasiText(ops) {
    const b = x => '<b>' + esc(x) + '</b>';
    const unul = ([op, ...a]) => {
      if (op === 'nou') return 'registru nou (<kbd>Ctrl</kbd>+<kbd>N</kbd>)';
      if (op === 'plus') return 'o foaie nouă, cu butonul <b>+</b>';
      if (op === 'inserareInainte') return 'o foaie nouă înaintea celei active (clic dreapta pe filă › <b>Insert</b>)';
      if (op === 'activeaza') return 'clic pe fila ' + b(a[0]);
      if (op === 'redenumeste') return 'fila ' + b(a[0]) + ' redenumită ' + b(a[1]) + ' (dublu-clic pe filă)';
      if (op === 'culoare') return 'fila ' + b(a[0]) + ' colorată cu ' + b(CULORI[String(a[1]).toUpperCase()] || a[1]) + ' (clic dreapta pe filă › <b>Tab Color</b>)';
      if (op === 'sterge') return 'fila ' + b(a[0]) + ' ștearsă (clic dreapta pe filă › <b>Delete</b>)';
      if (op === 'muta') return 'fila ' + b(a[0]) + (a[1] == null ? ' mutată la sfârșit' : ' mutată înaintea filei ' + b(a[1])) + ' (o tragi cu mouse-ul)';
      if (op === 'copiaza') return 'o copie a foii ' + b(a[0]) + (a[1] == null ? ', pusă la sfârșit' : ', pusă înaintea foii ' + b(a[1])) + ' (clic dreapta › <b>Move or Copy</b> › <b>Create a copy</b>)';
      if (op === 'scrie') return 'în foaia ' + b(a[0]) + ', în celula ' + b(a[1]) + ': ' + b(a[2]);
      if (op === 'salveaza') { const o = a[0] || {}; return o.nume ? '<b>Save</b> (<kbd>Ctrl</kbd>+<kbd>S</kbd>) în ' + b(o.folder || 'Documente') + ', cu numele ' + b(o.nume) : '<b>Save</b> (<kbd>Ctrl</kbd>+<kbd>S</kbd>)'; }
      if (op === 'salveazaCa') { const o = a[0] || {}; return '<b>Save As</b> (<kbd>F12</kbd>) în ' + b(o.folder || 'Documente') + ', cu numele ' + b(o.nume) + (o.tip && o.tip !== 'xlsx' ? ', tipul ' + b(String(o.tip).toUpperCase()) : ''); }
      if (op === 'inchide') return a[0] === 'da' ? '<kbd>Ctrl</kbd>+<kbd>W</kbd>, apoi <b>Save</b> (păstrezi schimbarea)' : '<kbd>Ctrl</kbd>+<kbd>W</kbd>, apoi <b>Don\'t Save</b>';
      if (op === 'deschide') { const [d, n] = String(a[0]).split('/'); return '<kbd>Ctrl</kbd>+<kbd>O</kbd>, apoi ' + b(n) + ' din ' + b(d); }
      return '';
    };
    return (ops || []).map(unul).filter(Boolean).map((t, i) => (i + 1) + ') ' + t).join('; ');
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

    /* opțiunile (Q.o): răspunsul corect se alege cu clic; a doua greșeală arată răspunsul */
    if (Q.o) {
      const ord = Q.amesteca === false ? Q.o.map((_, k) => k) : api.shuffle(Q.o.map((_, k) => k));
      const box = document.createElement('div');
      box.className = 'rel-opts';
      box.innerHTML = ord.map(k => `<button class="rel-opt" type="button" data-k="${k}">${esc(Q.o[k])}</button>`).join('');
      body.appendChild(box);
      body.querySelectorAll('.rel-opt').forEach(b => b.onclick = () => {
        if (api.done()) return;
        const k = +b.dataset.k;
        if (k === Q.ok) {
          b.classList.add('ok');
          body.querySelectorAll('.rel-opt').forEach(x => { x.disabled = true; });
          api.resolve(true);
        } else {
          b.classList.add('bad');
          b.disabled = true;
          api.resolve(false, 'Mai încearcă. Fă întâi pașii în fereastra de mai sus și uită-te ce se întâmplă.');
          if (api.attempts() >= 2) {
            body.querySelectorAll('.rel-opt').forEach(x => { x.disabled = true; });
            const ok = body.querySelector(`.rel-opt[data-k="${Q.ok}"]`);
            if (ok) ok.classList.add('ok');
            api.giveUp(esc(Q.o[Q.ok]));
          }
        }
      });
    }

    /* deschide Excel-ul bibliotecii în locul exercițiului (al doilea deschide în același loc înlocuiește instanța veche);
       gol = fără registru (ca Excel deschis gol): Ctrl+W pe Book1 nemodificat; nu e o acțiune a elevului */
    function deschideExcel(continut, gol) {
      return L.deschide('excel', { loc: host, continut, focus: false }).then(inst => {
        st.inst = inst;
        st.root = host.querySelector('[data-lh-aplicatie="excel"]');
        if (st.root && gol) st.root.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', ctrlKey: true, bubbles: true, cancelable: true }));
        return inst;
      });
    }

    /* magazia (fisiere.js) se încarcă în fundal: învelișul trebuie pus înainte de prima magazie a instanței */
    SEMINTE = seminteDe(Q);
    L.gata.then(() => L._script('fisiere.js'))
      .then(() => { invelisFisiere(); return deschideExcel(continutDe(Q), !(Q.start && Q.start.registru)); })
      .then(inst => {
        pornit = true;
        st.s = inst.stare();
        refresh();
      })
      .catch(e => { if (tes) tes.textContent = 'Excel nu s-a încărcat: ' + (e && e.message ? e.message : e); });

    /* „Arată-mi răspunsul”: joacă Q.rezolvare pe model, redeschide Excel-ul în starea de la capăt, scrie fișierele salvate în
       magazie și citește testele. {facut, incercat, n}: facut = toate testele trec acum (abia atunci textul spune că pașii s-au făcut) */
    async function joacaRaspunsul() {
      const M = modelDe(Q);
      const merge = pornit && (Q.rezolvare || []).length && joaca(M, Q.rezolvare) && !(Q.teste || []).some(t => t.redeschis !== undefined);
      if (!merge) return { facut: false, incercat: false };
      try {
        const inst = await deschideExcel(M.wb ? continutModel(M.wb) : {}, !M.wb);
        inst.stare();   /* magazia instanței noi, semănată cu fișierele de la pornire (învelișul) */
        Object.keys(M.scrise).forEach(k => { const i = k.indexOf('/'), d = k.slice(0, i), n = k.slice(i + 1); MAGAZIE.salveaza(d, n, 'xlsx', registru(M.fis[d][n].foi)); });
        st.s = inst.stare();
        refresh();
        const r = verifica(Q, st.s);
        return { facut: r.length > 0 && r.every(x => x.ok), incercat: true, n: r.length };
      } catch (e) { return { facut: false, incercat: true }; }
    }
    let arataPornit = false;
    async function arataRaspunsul() {
      if (arataPornit || api.done()) return;
      arataPornit = true;
      const nav = api.nav && api.nav();
      if (nav) nav.querySelectorAll('button').forEach(b => { b.disabled = true; });
      const rez = await joacaRaspunsul();
      const pasi = pasiText(Q.rezolvare);
      if (rez.facut) {
        api.giveUp(`am făcut eu pașii în Excel-ul de mai sus: ${pasi}. Uită-te în fereastră: testele de sub ea trec acum (${rez.n} din ${rez.n}).`);
        return;
      }
      const ce = pasi || (Q.raspuns ? String(Q.raspuns) : '');
      const cum = Q.ajutor ? ` Cum: ${Q.ajutor}` : '';
      api.giveUp(`${rez.incercat ? 'n-am reușit să fac pașii în fereastră. Fă-i tu' : 'fă tu pașii'} în Excel-ul de mai sus${ce ? ': ' + ce + '.' : '.'}${cum} Testele de sub fereastră se bifează pe rând, cât lucrezi. Când trec toate:`);
    }

    if (!Q.o) {
      api.checkButton(() => {
        if (!pornit || !st.inst) { api.resolve(false, 'Excel încă se încarcă. Așteaptă un moment și apasă din nou.'); return; }
        const r = verifica(Q, st.inst.stare());
        const rau = r.find(x => !x.ok);
        if (!rau) api.resolve(true);
        else {
          api.resolve(false, `Încă nu: <b>${esc(rau.ce)}</b>.`);
          api.revealButton(() => { arataRaspunsul(); });
        }
      });
    }
  }

  /* contractul tipului (ca SimRegistru): render / rezolva / gresit / stare. Toate exercițiile de registru sunt pe bibliotecă. */
  const TipRegistruExcel = {
    render(Q, body, api) { return randeaza(Q, body, api); },
    rezolva(Q, body, api) { return randeaza(Q, body, api); },
    gresit(Q, body, api) { randeaza(Q, body, api); return true; },
    stare() { return null; }
  };
  W.TipRegistruExcel = TipRegistruExcel;
  /* numele pe care îl folosesc lecțiile (tipuri:{registru:SimRegistru}): o declarație de script, deci vizibilă tuturor scripturilor */
  W.SimRegistru = TipRegistruExcel;
})();
