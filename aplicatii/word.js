/* word.js — Word în biblioteca centrală (api_biblioteca.md §1-§8). Interfața NU e scrisă aici: o desenează panglica.js din
   date/word.json (generat din referința UI Automation a lui Word real). Aici stau doar documentul (modelul din §5,
   „ecranul = starea” din §3) și comportamentul comenzilor. Ce face Word real vine din referințele înghețate
   (_campaign/aplicatii_fidele_2026_11/referinte/scenarii_real/word-*.json); o comandă afișată al cărei efect nu e încă
   dovedit dă mesajul central standard (R12), nu un efect inventat. Profilurile: word365 (implicit) și word2007
   (Ctrl+Z literă cu literă, contract I4) — profilul schimbă comportamentul, nu interfața (R2). */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;
  const PX_CM = 96 / 2.54;
  const PX_PT = 96 / 72;
  /* Grow Font / Shrink Font: 11 -> 12 și 11 -> 10 (scenarii_real/word-mareste-font.json, word-micsoreaza-font.json) */
  const MARIMI = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  /* mărimea literelor fiecărui stil (Normal 11 — referința: caseta Font Size „11”); restul doar pentru desen */
  const STILURI = { 'Normal': 11, 'No Spacing': 11, 'Heading 1': 16, 'Heading 2': 13, 'Title': 28, 'Subtitle': 11, 'Subtle Emphasis': 11,
    'Emphasis': 11, 'Intense Emphasis': 11, 'Strong': 11, 'Quote': 11, 'Intense Quote': 11, 'Subtle Reference': 11,
    'Intense Reference': 11, 'Book Title': 11, 'List Paragraph': 11 };
  const LIT = /[\p{L}\p{N}]/u;
  const DEF = Object.freeze({ b: false, i: false, u: false, sz: null });
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const egal = (a, b) => a === b || (!!a && !!b && a.b === b.b && a.i === b.i && a.u === b.u && a.sz === b.sz);
  const ALINIERI = { left: 'stanga', center: 'centru', right: 'dreapta', justify: 'stanga-dreapta' };

  /* Ctrl+S pe un document nou (Word M365) = fereastra Office „Save this file”, desenată din referință (uia_word.json ›
     dialog.save_this_file: File name, Save as type, Choose a Location, More options…, Save, Cancel; runda `acoperire`
     18.11.2026 — închide abaterea A2-1). Ctrl+W / ✕ pe un document modificat = „Save your changes to this file?”
     (dialog.save_your_changes_to_this_file: More options…, Save, Don't Save, Cancel; scenarii_real/word-ctrl-w-*.json).
     Amândouă sunt NUIDialog: bara de titlu are doar ✕, textul mare e numele ferestrei interioare. */
  const SALVARE_NOUA = 'dialog.save_this_file';
  const INTREBARE_INCHIDERE = 'dialog.save_your_changes_to_this_file';
  const OFFICE_NUI = [SALVARE_NOUA, INTREBARE_INCHIDERE];

  function creeaza(I, c) {
    const PG = window.LH.aplicatii; // obiectul public (pentru mesaje / asistent)
    const pang = modul('panglica'), st = modul('stare');
    const date = I.date, root = I.root;
    const scenariu = !!I.opt.scenariu;
    const p2007 = I.profil.id === 'word2007';

    /* ============================================================ modelul documentului (§5) */
    const parIn = (t, al) => ({ t: String(t || ''), f: Array(String(t || '').length).fill(DEF), al: ALINIERI[al] || al || 'stanga',
      stil: 'Normal', lista: null });
    const paginaNoua = () => ({ orientare: 'portret', latime_cm: 21.0, inaltime_cm: 29.7, margini_cm: { sus: 2.5, jos: 2.5, stanga: 2.5, dreapta: 2.5 } });
    const M = {
      P: (Array.isArray(c.paragrafe) && c.paragrafe.length ? c.paragrafe : ['']).map((t, k) => parIn(t, (c.aliniere || [])[k])),
      tab: [], img: [],
      pag: paginaNoua(),
      sel: { a: 0, f: 0 }, cel: null, fmtIns: null, nume: 'Document1', salvat: false, dialogSalvare: null, zoom: 100,
      folder: null, salvari: [], fs: [], recente: [], deschis: true, inchisApp: false, modificat: false, altele: [],
      tipAfisat: null, intrebare: null, dupaInchidere: null,
      semne: false, clip: null, ultima: null
    };
    if (c.tabel && c.tabel.randuri && c.tabel.coloane) {
      if (M.P[M.P.length - 1].t !== '' || M.P.length < 2) M.P.push(parIn(''));
      const cel = [];
      for (let r = 0; r < c.tabel.randuri; r++) {
        cel.push([]);
        for (let k = 0; k < c.tabel.coloane; k++) cel[r].push(String(((c.tabel.celule || [])[r] || [])[k] || ''));
      }
      M.tab.push({ la: M.P.length - 1, randuri: c.tabel.randuri, coloane: c.tabel.coloane, celule: cel });
    }
    if (Array.isArray(c.cursor_in_celula) && M.tab.length) {
      M.cel = { t: 0, r: Math.max(0, c.cursor_in_celula[0] - 1), c: Math.max(0, c.cursor_in_celula[1] - 1), a: 0, f: 0 };
    } else if (c.selectie && typeof c.selectie.de_la === 'number') {
      M.sel = { a: c.selectie.de_la, f: typeof c.selectie.pana_la === 'number' ? c.selectie.pana_la : c.selectie.de_la };
    } else if (typeof c.cursor === 'number') M.sel = { a: c.cursor, f: c.cursor };

    const lungime = () => M.P.reduce((s, p) => s + p.t.length + 1, 0);
    const inceput = i => { let s = 0; for (let k = 0; k < i; k++) s += M.P[k].t.length + 1; return s; };
    const loc = pos => {
      let s = 0;
      for (let i = 0; i < M.P.length; i++) {
        const n = M.P[i].t.length;
        if (pos <= s + n) return { i, o: Math.max(0, pos - s) };
        s += n + 1;
      }
      const u = M.P.length - 1;
      return { i: u, o: M.P[u].t.length };
    };
    const maxCaret = () => lungime() - 1;
    const clamp = p => Math.max(0, Math.min(maxCaret(), p));
    /* fără cursor / selecție în conținut: cursorul la capătul documentului, ca rulatorul real (referinte/ruleaza_real.py:
       „d.Range(d.Content.End - 1, d.Content.End - 1).Select()”; scenarii_real/word-x-nesalvat-cancel.json: „ azi” ajunge
       la capăt → „Ana are mere azi”) */
    if (!M.cel && !(c.selectie && typeof c.selectie.de_la === 'number') && typeof c.cursor !== 'number') {
      const capat = maxCaret();
      M.sel = { a: capat, f: capat };
    }
    const selMin = () => Math.min(M.sel.a, M.sel.f), selMax = () => Math.max(M.sel.a, M.sel.f);
    const areSel = () => M.sel.a !== M.sel.f;
    function textIntre(a, b) {
      let out = '';
      for (let p = a; p < b;) {
        const l = loc(p), par = M.P[l.i];
        if (l.o >= par.t.length) { out += '\r'; p++; continue; }
        const lim = Math.min(par.t.length, l.o + (b - p));
        out += par.t.slice(l.o, lim);
        p += lim - l.o;
      }
      return out;
    }
    function fmtIntre(a, b) {   // formatul fiecărui caracter (null la capetele de paragraf)
      const out = [];
      for (let p = a; p < b; p++) { const l = loc(p), par = M.P[l.i]; out.push(l.o < par.t.length ? par.f[l.o] : null); }
      return out;
    }
    function sterge(a, b) {
      if (b <= a) return;
      const la = loc(a), lb = loc(b);
      const pa = M.P[la.i], pb = M.P[lb.i];
      if (la.i === lb.i) {
        pa.t = pa.t.slice(0, la.o) + pa.t.slice(lb.o);
        pa.f = pa.f.slice(0, la.o).concat(pa.f.slice(lb.o));
        return;
      }
      pa.t = pa.t.slice(0, la.o) + pb.t.slice(lb.o);
      pa.f = pa.f.slice(0, la.o).concat(pb.f.slice(lb.o));
      if (la.o === 0 && pa.t === pb.t.slice(lb.o)) { pa.al = pb.al; pa.stil = pb.stil; pa.lista = pb.lista; }
      M.P.splice(la.i + 1, lb.i - la.i);
      M.tab.forEach(t => { if (t.la > la.i) t.la = Math.max(la.i + 1, t.la - (lb.i - la.i)); });
    }
    /* inserează text (cu \r sau \n = paragraf nou) la poziția pos; fmts = formatul fiecărui caracter (sau unul pentru toate) */
    function insereaza(pos, text, fmts) {
      let l = loc(pos);
      let k = 0;
      for (const ch of String(text)) {
        const f = Array.isArray(fmts) ? (fmts[k] || DEF) : (fmts || DEF);
        k++;
        const par = M.P[l.i];
        if (ch === '\n' || ch === '\r') {
          const nou = { t: par.t.slice(l.o), f: par.f.slice(l.o), al: par.al, stil: /^Heading|^Title/.test(par.stil) && l.o >= par.t.length ? 'Normal' : par.stil,
            lista: par.lista ? Object.assign({}, par.lista) : null };
          par.t = par.t.slice(0, l.o);
          par.f = par.f.slice(0, l.o);
          M.P.splice(l.i + 1, 0, nou);
          M.tab.forEach(t => { if (t.la > l.i) t.la++; });
          l = { i: l.i + 1, o: 0 };
        } else {
          par.t = par.t.slice(0, l.o) + ch + par.t.slice(l.o);
          par.f.splice(l.o, 0, f);
          l = { i: l.i, o: l.o + ch.length };
        }
      }
      return inceput(l.i) + l.o;
    }
    function fmtLa(pos) {     // formatul cu care se scrie la poziția pos (al caracterului dinainte, ca în Word)
      if (M.fmtIns) return M.fmtIns;
      const l = loc(pos), par = M.P[l.i];
      if (l.o > 0) return par.f[l.o - 1] || DEF;
      return par.f[0] || DEF;
    }
    const marimeStil = par => STILURI[par.stil] || 11;
    const marime = (par, f) => (f && f.sz) || marimeStil(par);

    /* cuvântul din jurul unei poziții (pentru dublu clic și pentru Ctrl+B fără selecție) */
    function cuvantLa(pos) {
      const l = loc(pos), t = M.P[l.i].t, s0 = inceput(l.i);
      let o = l.o;
      if (!t.length) return null;
      if (o >= t.length || !LIT.test(t[o])) { if (o > 0 && LIT.test(t[o - 1])) o--; }
      if (o >= t.length) return null;
      if (!LIT.test(t[o])) return { a: s0 + o, b: s0 + o + 1, simplu: true };
      let a = o, b = o;
      while (a > 0 && LIT.test(t[a - 1])) a--;
      while (b < t.length && LIT.test(t[b])) b++;
      return { a: s0 + a, b: s0 + b };
    }
    function cuvantCuSpatii(pos) {   // dublu clic: cuvântul + spațiile de după („mere ” — scenarii_real/word-dublu-clic-cuvant.json)
      const l = loc(pos), t = M.P[l.i].t, s0 = inceput(l.i);
      if (!t.length) return { a: s0, b: s0 + 1 };     // paragraf gol: semnul de paragraf
      const w = cuvantLa(pos);
      if (!w) return { a: s0 + t.length, b: s0 + t.length + 1 };
      let b = w.b - s0;
      if (!w.simplu) while (b < t.length && t[b] === ' ') b++;
      return { a: w.a, b: s0 + b };
    }
    const inCuvant = pos => { const l = loc(pos), t = M.P[l.i].t; return l.o > 0 && l.o < t.length && LIT.test(t[l.o - 1]) && LIT.test(t[l.o]); };
    function paragrafeSel() {
      const a = selMin(), b = selMax();
      const i0 = loc(a).i;
      let i1 = loc(b).i;
      if (b > a && loc(b).o === 0 && i1 > i0) i1--;
      const out = [];
      for (let i = i0; i <= i1; i++) out.push(i);
      return out;
    }

    /* ============================================================ istoricul (Ctrl+Z / Ctrl+Y) */
    const grupeaza = (vechi, nou) => !p2007 && vechi === nou && (nou === 'tastare' || nou === 'stergere_inapoi' || nou === 'stergere_inainte');
    let H = st.istoric(grupeaza);
    const instantaneu = () => ({ P: M.P, tab: M.tab, img: M.img, pag: M.pag, sel: M.sel, cel: M.cel });
    const pune = s => { M.P = s.P; M.tab = s.tab; M.img = s.img; M.pag = s.pag; M.sel = s.sel; M.cel = s.cel; M.fmtIns = null; M.modificat = true; };
    function schimba(tip, fn) {
      H.inainte(tip, instantaneu());
      M.modificat = true;
      const r = fn();
      if (tip !== 'tastare') M.ultima = null;
      return r;
    }

    /* ============================================================ editarea */
    function stergeSelectia(inteligent) {
      let a = selMin(), b = selMax();
      if (b > maxCaret()) b = maxCaret();          // semnul de paragraf de la capăt nu se șterge
      if (inteligent) {
        /* Word: „Este |foarte| frumos” → Delete → „Este frumos” (un singur spațiu; scenarii_real/word-delete-selectie.json) */
        const ta = textIntre(Math.max(0, a - 1), a), tb = textIntre(b, Math.min(lungime(), b + 1));
        const sel = textIntre(a, b);
        if (ta === ' ' && tb === ' ' && sel && LIT.test(sel[0]) && LIT.test(sel[sel.length - 1])) b++;
      }
      sterge(a, b);
      M.sel = { a, f: a };
    }
    function scrie(text, dinTastatura) {
      if (M.cel) return scrieCelula(text);
      const tip = 'tastare';
      schimba(tip, () => {
        if (areSel()) stergeSelectia(false);
        let pos = M.sel.f;
        const f = fmtLa(pos);
        for (const ch of String(text)) {
          if (ch === '\n' || ch === '\r') {
            if (dinTastatura) autoMajuscula(pos);
            pos = insereaza(pos, '\n', f);
          } else {
            if (dinTastatura && /[ .,;:!?]/.test(ch)) autoMajuscula(pos);
            pos = insereaza(pos, ch, f);
          }
        }
        M.sel = { a: pos, f: pos };
      });
      M.fmtIns = null;
      if (!/\n|\r/.test(text)) {
        if (M.ultima && M.ultima.fel === 'text' && H.ultimTip() === 'tastare' && !p2007) M.ultima.text += text;
        else M.ultima = { fel: 'text', text };
      } else M.ultima = null;
      return 'scriere';
    }
    function enter() {
      if (M.cel) return 'fara_efect';
      schimba('enter', () => {
        if (areSel()) stergeSelectia(false);
        autoMajuscula(M.sel.f);
        const pos = insereaza(M.sel.f, '\n', fmtLa(M.sel.f));
        M.sel = { a: pos, f: pos };
      });
      H.rupe();
      return 'paragraf_nou';
    }
    /* AutoCorect: prima literă a propoziției devine mare când se termină cuvântul („ana are mere. el” → „Ana are mere. El”,
       scenarii_real/word-tastare-majuscula-automata.json) */
    function autoMajuscula(pos) {
      const l = loc(pos), par = M.P[l.i], t = par.t;
      let s = l.o;
      while (s > 0 && LIT.test(t[s - 1])) s--;
      if (s === l.o) return;
      const cuv = t.slice(s, l.o);
      if (!/^\p{Ll}/u.test(cuv)) return;
      const inainte = t.slice(0, s).replace(/\s+$/, '');
      if (inainte && !/[.!?]$/.test(inainte)) return;
      par.t = t.slice(0, s) + cuv[0].toUpperCase() + t.slice(s + 1);
    }
    function backspace() {
      if (M.cel) return stergeCelula(-1);
      if (areSel()) { schimba('stergere', () => stergeSelectia(true)); H.rupe(); return 'stergere'; }
      const p = M.sel.f;
      if (p <= 0) return 'fara_efect';
      schimba('stergere_inapoi', () => {
        const l = loc(p);
        /* Backspace la începutul unui paragraf GOL îl unește cu cel dinainte (scenarii_real/word-backspace-rand-gol.json) */
        sterge(p - 1, p);
        if (l.o === 0) { /* paragraful de după rămâne cu formatul lui */ }
        M.sel = { a: p - 1, f: p - 1 };
      });
      return 'stergere';
    }
    function del() {
      if (M.cel) return stergeCelula(1);
      if (areSel()) { schimba('stergere', () => stergeSelectia(true)); H.rupe(); return 'stergere'; }
      const p = M.sel.f;
      if (p >= maxCaret()) return 'fara_efect';
      schimba('stergere_inainte', () => { sterge(p, p + 1); M.sel = { a: p, f: p }; });
      return 'stergere';
    }
    function anuleaza() {
      const s = H.anuleaza(instantaneu());
      if (!s) return 'fara_efect';
      pune(s);
      M.ultima = null;
      return 'anulare';
    }
    function reface() {
      const s = H.reface(instantaneu());
      if (s) { pune(s); return 'refacere'; }
      /* Ctrl+Y fără nimic de refăcut REPETĂ ultima tastare („ha” + Ctrl+Y → „haha”, scenarii_real/word-ctrl-y-repeta.json) */
      if (M.ultima && M.ultima.fel === 'text') {
        const t = M.ultima.text;
        H.rupe();
        schimba('repetare', () => {
          if (areSel()) stergeSelectia(false);
          const pos = insereaza(M.sel.f, t, fmtLa(M.sel.f));
          M.sel = { a: pos, f: pos };
        });
        H.rupe();
        M.ultima = { fel: 'text', text: t };
        return 'repetare';
      }
      if (M.ultima && M.ultima.fel === 'comanda') { M.ultima.fn(); return 'repetare'; }
      return 'fara_efect';
    }

    /* ---- formatarea caracterelor (Ctrl+B/I/U, Bold/Italic/Underline; Grow/Shrink Font) */
    function intervalFormat() {
      if (areSel()) return { a: selMin(), b: Math.min(selMax(), maxCaret()) };
      /* fără selecție, cu cursorul ÎN cuvânt: tot cuvântul (scenarii_real/word-ctrl-b-fara-selectie.json: „mere”) */
      if (inCuvant(M.sel.f)) { const w = cuvantLa(M.sel.f); return { a: w.a, b: w.b }; }
      return null;
    }
    /* caseta Font Size: o mărime scrisă + Enter se aplică pe selecție (fără selecție: pe cuvântul cursorului, ca Grow/Shrink,
       altfel pe ce se tastează de acum). Limitele: „Word: between 1 and 1638, in multiples of .5 (such as 10.5 or 105.5)”
       (support.microsoft.com/en-US/Office/fonts/change-the-font-size). Enter nu ajunge în document; focusul se întoarce în
       document. O valoare în afara limitelor nu schimbă nimic (mesajul lui Word: NEVERIFICAT, de_verificat.md R2-5). */
    function marimeScrisa(inp) { return marimeLa(Number(String(inp.value).trim().replace(',', '.'))); }
    function marimeLa(n) {
      let r = 'fara_efect';
      if (M.deschis && Number.isFinite(n) && n >= 1 && n <= 1638 && Number.isInteger(n * 2)) {
        const iv = intervalFormat();
        if (!iv) M.fmtIns = Object.freeze(Object.assign({}, fmtLa(M.sel.f), { sz: n }));
        else { schimba('format', () => aplica(iv.a, iv.b, f => Object.freeze(Object.assign({}, f, { sz: n })))); H.rupe(); }
        r = 'marime_font';
      }
      const ins = M.fmtIns;
      I.focus();
      actualizeaza();
      M.fmtIns = ins;
      return r;
    }
    function comuta(camp) {
      const r = intervalFormat();
      const fn = () => {
        const rr = intervalFormat();
        if (!rr) { const f = Object.assign({}, fmtLa(M.sel.f)); f[camp] = !f[camp]; M.fmtIns = Object.freeze(f); return; }
        schimba('format', () => {
          const fm = fmtIntre(rr.a, rr.b).filter(Boolean);
          const toate = fm.length && fm.every(f => f[camp]);
          aplica(rr.a, rr.b, f => Object.freeze(Object.assign({}, f, { [camp]: !toate })));
        });
      };
      fn();
      M.ultima = { fel: 'comanda', fn };
      H.rupe();
      return r ? ({ b: 'aldin', i: 'cursiv', u: 'subliniat' })[camp] : 'format_la_scriere';
    }
    function aplica(a, b, fn) {
      for (let p = a; p < b; p++) {
        const l = loc(p), par = M.P[l.i];
        if (l.o < par.t.length) par.f[l.o] = fn(par.f[l.o] || DEF, par);
      }
    }
    function marimeFont(dir) {
      const r = intervalFormat();
      if (!r) return 'fara_efect';
      schimba('format', () => aplica(r.a, r.b, (f, par) => {
        const m = marime(par, f);
        let k = MARIMI.findIndex(x => x >= m);
        if (k < 0) k = MARIMI.length - 1;
        let n;
        if (dir > 0) n = MARIMI[MARIMI[k] === m ? Math.min(MARIMI.length - 1, k + 1) : k];
        else n = MARIMI[Math.max(0, (MARIMI[k] === m || MARIMI[k] > m ? k - 1 : k))];
        return Object.freeze(Object.assign({}, f, { sz: n }));
      }));
      H.rupe();
      return dir > 0 ? 'marire_font' : 'micsorare_font';
    }
    /* ---- alinierea (Ctrl+E/L/R/J și butoanele): a doua apăsare întoarce la stânga; Ctrl+L pe un paragraf deja la stânga
       îl face „stanga-dreapta” (scenarii_real/word-ctrl-e-de-doua-ori.json, word-ctrl-l-pe-paragraf-la-stanga.json) */
    function aliniaza(al) {
      const idx = paragrafeSel();
      schimba('format', () => {
        const toate = idx.every(i => M.P[i].al === al);
        let nou = al;
        if (toate) nou = al === 'stanga' ? 'stanga-dreapta' : 'stanga';
        idx.forEach(i => { M.P[i].al = nou; });
      });
      H.rupe();
      return 'aliniere_' + al;
    }
    /* ---- listele (Bullets / Numbering: scenarii_real/word-lista-marcatori.json, word-lista-numerotata.json) */
    function lista(tip) {
      const idx = paragrafeSel();
      schimba('format', () => {
        const toate = idx.every(i => M.P[i].lista && M.P[i].lista.tip === tip);
        idx.forEach(i => { M.P[i].lista = toate ? null : { tip }; });
      });
      H.rupe();
      return tip === 'marcatori' ? 'lista_marcatori' : 'lista_numerotata';
    }
    function stil(nume) {
      const idx = paragrafeSel();
      schimba('format', () => idx.forEach(i => { M.P[i].stil = nume; }));
      H.rupe();
      return 'stil';
    }
    /* ---- clipboard-ul aplicației (nu cel al calculatorului) */
    function copiaza() {
      if (!areSel()) return 'fara_efect';
      const a = selMin(), b = Math.min(selMax(), maxCaret());
      M.clip = { text: textIntre(a, b), f: fmtIntre(a, b) };
      return 'copiere';
    }
    function decupeaza() {
      if (!areSel()) return 'fara_efect';
      copiaza();
      schimba('decupare', () => stergeSelectia(true));
      H.rupe();
      return 'decupare';
    }
    function lipeste(doarText) {
      if (!M.clip) return 'fara_efect';
      if (M.cel) return scrieCelula(M.clip.text.replace(/\r/g, ' '));
      schimba('lipire', () => {
        if (areSel()) stergeSelectia(false);
        const pos = insereaza(M.sel.f, M.clip.text, doarText ? fmtLa(M.sel.f) : M.clip.f.map(f => f || DEF));
        M.sel = { a: pos, f: pos };
      });
      H.rupe();
      return 'lipire';
    }
    function muta(dest) {      // tragerea textului selectat
      const a = selMin(), b = Math.min(selMax(), maxCaret());
      if (dest >= a && dest <= b) return 'fara_efect';
      const text = textIntre(a, b), f = fmtIntre(a, b).map(x => x || DEF);
      schimba('mutare', () => {
        sterge(a, b);
        const d = dest > b ? dest - (b - a) : dest;
        const fin = insereaza(d, text, f);
        M.sel = { a: d, f: fin };
      });
      H.rupe();
      return 'mutare';
    }

    /* ---- tabelele */
    function insereazaTabel(randuri, coloane) {
      schimba('tabel', () => {
        const l = loc(M.sel.f);
        let la = l.i;
        if (M.P[l.i].t !== '') {           // în mijlocul unui paragraf: tabelul vine după el, cu un paragraf gol după tabel
          M.P.splice(l.i + 1, 0, parIn(''));
          M.tab.forEach(t => { if (t.la > l.i) t.la++; });
          la = l.i + 1;
        }
        const cel = [];
        for (let r = 0; r < randuri; r++) { cel.push([]); for (let k = 0; k < coloane; k++) cel[r].push(''); }
        M.tab.push({ la, randuri, coloane, celule: cel });
        M.tab.sort((x, y) => x.la - y.la);
        M.cel = { t: M.tab.findIndex(t => t.celule === cel), r: 0, c: 0, a: 0, f: 0 };
      });
      H.rupe();
      contextActiv = 'tabel';
      return 'inserare_tabel';
    }
    function celulaText() { const t = M.tab[M.cel.t]; return t.celule[M.cel.r][M.cel.c]; }
    function puneCelula(v) { const t = M.tab[M.cel.t]; t.celule[M.cel.r][M.cel.c] = v; }
    function scrieCelula(text) {
      schimba('tastare', () => {
        M.tab = JSON.parse(JSON.stringify(M.tab));
        const v = celulaText(), a = Math.min(M.cel.a, M.cel.f), b = Math.max(M.cel.a, M.cel.f);
        puneCelula(v.slice(0, a) + text + v.slice(b));
        M.cel = Object.assign({}, M.cel, { a: a + text.length, f: a + text.length });
      });
      return 'scriere';
    }
    function stergeCelula(dir) {
      const v = celulaText(), a = Math.min(M.cel.a, M.cel.f), b = Math.max(M.cel.a, M.cel.f);
      if (a === b && ((dir < 0 && a === 0) || (dir > 0 && a >= v.length))) return 'fara_efect';
      schimba('stergere', () => {
        M.tab = JSON.parse(JSON.stringify(M.tab));
        const x = a !== b ? a : (dir < 0 ? a - 1 : a), y = a !== b ? b : (dir < 0 ? a : a + 1);
        puneCelula(v.slice(0, x) + v.slice(y));
        M.cel = Object.assign({}, M.cel, { a: x, f: x });
      });
      return 'stergere';
    }
    /* Tab în tabel: celula următoare, cu textul ei selectat; în ultima celulă adaugă un rând
       (scenarii_real/word-tab-celula-urmatoare.json, word-tab-ultima-celula.json) */
    function tabInTabel(inapoi) {
      const t = M.tab[M.cel.t];
      let r = M.cel.r, k = M.cel.c + (inapoi ? -1 : 1);
      if (k >= t.coloane) { k = 0; r++; }
      if (k < 0) { k = t.coloane - 1; r--; }
      if (r < 0) return 'fara_efect';
      if (r >= t.randuri) {
        schimba('tabel', () => {
          M.tab = JSON.parse(JSON.stringify(M.tab));
          const tt = M.tab[M.cel.t];
          tt.celule.push(Array(tt.coloane).fill(''));
          tt.randuri++;
          M.cel = { t: M.cel.t, r, c: 0, a: 0, f: 0 };
        });
        H.rupe();
        return 'rand_nou';
      }
      const v = t.celule[r][k];
      M.cel = { t: M.cel.t, r, c: k, a: 0, f: v.length };
      H.rupe();
      return 'celula_urmatoare';
    }

    /* ---- pagina (Layout › Margins › Narrow; Orientation › Landscape — scenarii_real/word-margini-ingust.json,
       word-orientare-vedere.json) */
    function margini(m) {
      schimba('pagina', () => { M.pag = JSON.parse(JSON.stringify(M.pag)); M.pag.margini_cm = { sus: m, jos: m, stanga: m, dreapta: m }; });
      H.rupe();
      return 'margini';
    }
    function orientare(o) {
      schimba('pagina', () => {
        M.pag = JSON.parse(JSON.stringify(M.pag));
        if (M.pag.orientare !== o) {
          const w = M.pag.latime_cm;
          M.pag.latime_cm = M.pag.inaltime_cm;
          M.pag.inaltime_cm = w;
          M.pag.orientare = o;
        }
      });
      H.rupe();
      return 'orientare';
    }

    /* ============================================================ starea (§5) */
    function formatare() {
      const out = [];
      M.P.forEach((par, i) => {
        const bucati = [];
        for (let o = 0; o < par.t.length; o++) bucati.push([par.t[o], par.f[o] || DEF]);
        if (i < M.P.length - 1) bucati.push(['\r', par.f[par.t.length - 1] || DEF]);
        bucati.forEach(([ch, f]) => {
          const x = { text: ch, bold: !!f.b, italic: !!f.i, underline: !!f.u, marime: marime(par, f) };
          const u = out[out.length - 1];
          if (u && u.bold === x.bold && u.italic === x.italic && u.underline === x.underline && u.marime === x.marime) u.text += ch;
          else out.push(x);
        });
      });
      return out;
    }
    function liste() {
      let n = 0;
      return M.P.map(par => {
        if (!par.lista) { n = 0; return null; }
        if (par.lista.tip === 'marcatori') { n = 0; return { tip: 'marcatori', simbol: '', simbol_cod: 'U+F0B7' }; }
        n++;
        return { tip: 'numerotare', simbol: n + '.' };
      });
    }
    const cuvinte = () => M.P.reduce((s, p) => s + (p.t.match(/\S+/g) || []).length, 0) +
      M.tab.reduce((s, t) => s + t.celule.reduce((x, r) => x + r.reduce((y, v) => y + (v.match(/\S+/g) || []).length, 0), 0), 0);
    I.stare = () => {
      const a = selMin(), b = selMax();
      return {
        text: M.deschis ? M.P.map(p => p.t) : [],
        formatare_pe_caractere: formatare(),
        selectie: { de_la: a, pana_la: b, text: textIntre(a, b) },
        aliniere_paragrafe: M.P.map(p => p.al),
        stil_paragrafe: M.P.map(p => p.stil),
        liste: liste(),
        tabele: M.tab.map(t => ({ randuri: t.randuri, coloane: t.coloane, celule: t.celule.map(r => r.slice()) })),
        imagini: { in_linie: M.img.length, flotante: 0 },
        pagina: JSON.parse(JSON.stringify(M.pag)),
        cuvinte: cuvinte(),
        /* nume_fisier: null cât documentul n-a fost salvat niciodată (scenarii_real/word-salvare-pdf.json) */
        nume_fisier: M.deschis && M.salvat ? M.nume : null,
        dialog_salvare: M.dialogSalvare ? Object.assign({}, M.dialogSalvare) : null,
        /* chei în plus (§5 le permite): folderul documentului salvat (lecția m1-l03) și TOATE fișierele din foldere, cu
           textul lor (cele din conținut + cele salvate), plus lista Recent */
        folder_fisier: M.deschis && M.salvat ? M.folder : null,
        fisiere: M.fs.map(f => ({ nume: f.nume, folder: f.folder, tip: f.tip, text: f.text.slice() })),
        recente: M.recente.map(r => ({ nume: r.nume, folder: r.folder })),
        /* cheile rundei `acoperire` (§5; sensul în descrierea scenariilor word-ctrl-*, word-salvare-pdf, word-x-*):
           fisiere_salvate = numele fișierelor scrise de Save, ordonate; dialog = ultima fereastră care a întrebat;
           documente_deschise; titlu_fereastra; pagina_backstage; tip_salvare_afisat = ce ARATĂ caseta Save as type */
        fisiere_salvate: M.salvari.slice().sort(),
        dialog: M.intrebare ? Object.assign({}, M.intrebare, { butoane: M.intrebare.butoane.slice() }) : null,
        documente_deschise: M.inchisApp ? 0 : (M.deschis ? 1 : 0) + M.altele.length,
        titlu_fereastra: titluFereastra(),
        pagina_backstage: backstage ? backstage.pagina : null,
        tip_salvare_afisat: tipAfisatAcum()
      };
    };
    I.pxPePunct = () => PX_PT * M.zoom / 100;

    /* ============================================================ fereastra (interfața, din date/word.json) */
    let filaActiva = 'TabHome', contextActiv = null, strat = null, meniu = null, dialog = null, backstage = null;
    root.innerHTML = '';
    const el = (tag, cls, attrs) => { const e = document.createElement(tag); if (cls) e.className = cls; Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
    const sus = el('div', 'lh-ap-sus'), susIn = el('div', 'lh-ap-sus-in');
    sus.appendChild(susIn);
    const SUP = date.suprafete;
    /* rândurile listelor din referință (uia_word.json › lista.*), în ordinea lor */
    const randuriLista = cheie => { const o = []; (function u(n) { if (!n) return; if (n.t === 'ListItem' && n.e) o.push(n.e); (n.c || []).forEach(u); })(SUP[cheie]); return o; };
    const TIPURI_SALVARE = randuriLista('lista.FileSaveAs_tip');
    const tipDupaNume = nume => { const m = /\.([a-z0-9]+)$/i.exec(nume || ''); return m ? (TIPURI_SALVARE.find(t => new RegExp('\\*\\.' + m[1] + '[;)]', 'i').test(t)) || null) : null; };
    const numeCuExt = n => (/\.[a-z0-9]{2,5}$/i.test(n) ? n : n + '.docx');
    const faraExt = n => String(n || '').replace(/\.[a-z0-9]{2,5}$/i, '');
    const FOLDER0 = folderSalvare();
    const fisierNou = f => { const nume = numeCuExt(String(f.nume)); return { nume, folder: f.folder || FOLDER0, tip: tipDupaNume(nume),
      text: (Array.isArray(f.text) ? f.text : [String(f.text == null ? '' : f.text)]).map(String) }; };
    /* parametrii de CONȚINUT (lecția alege documentul și fișierele, nu interfața — prompt, pasul 6): documentul poate porni
       deja salvat (`nume`, `folder`, `salvat`, `modificat`); `fisiere: [{nume, folder?, text}]` = fișierele din foldere
       (pentru Recent și pentru verificare); `recente: [{nume, folder?}]` = lista Recent din File › Open. Folderul implicit =
       cel al ferestrei Save As din referință („Documente”). Critic runda 3, GRAV N4. */
    M.fs = (Array.isArray(c.fisiere) ? c.fisiere : []).filter(f => f && f.nume).map(fisierNou);
    M.recente = (Array.isArray(c.recente) ? c.recente : []).filter(f => f && f.nume).map(f => ({ nume: numeCuExt(String(f.nume)), folder: f.folder || FOLDER0 }));
    if (c.nume) {
      M.nume = numeCuExt(String(c.nume));
      M.folder = c.folder || FOLDER0;
      M.salvat = c.salvat !== false;
      if (M.salvat && !gasesteFisier(M.nume, M.folder)) M.fs.push(fisierNou({ nume: M.nume, folder: M.folder, text: M.P.map(p => p.t) }));
    }
    /* „modificat”: conținutul pus la pornire într-un document nesalvat contează ca modificare (Word real, conținut pus prin
       COM: acoperire_r3.fapte.b_ctrl_w_modificat.document_saved_inainte = false); lecția îl poate spune explicit */
    M.modificat = typeof c.modificat === 'boolean' ? c.modificat : (!M.salvat && (M.P.some(p => p.t !== '') || M.tab.length > 0));
    const pozitie = (e, r, baza) => { e.style.position = 'absolute'; e.style.left = (r[0] - (baza ? baza[0] : 0)) + 'px'; e.style.top = (r[1] - (baza ? baza[1] : 0)) + 'px'; };
    const OPT = {
      tinta(n, ctx) {
        if (ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.FileSaveAs_pdf' || ctx.cheie === 'dialog.open' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^File name:?$/.test(n.e)) return null;
          /* caseta Save as type = camp:tip_fisier (api_biblioteca.md §3; scenariul word-salvare-pdf, pasul 2) */
          if (n.t === 'ComboBox' && /^Save as type:?$/.test(n.e)) return 'camp:tip_fisier';
          if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.FileSaveAs_pdf' || ctx.cheie === SALVARE_NOUA) && n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }
        /* rândurile unei liste deschise (uia_word.json › lista.*) = meniu:<rând> (§3) */
        if (/^lista\./.test(ctx.cheie || '')) return n.t === 'ListItem' && n.e ? 'meniu:' + n.e : null;
        return undefined;
      },
      /* ferestrele Office (NUIDialog): bara de titlu fără text (scenariile: dialog.titlu = ""); textul mare = numele
         ferestrei interioare (în UI Automation nu e nod Text, deci locul lui e al nostru — diferente.md D25) */
      la(n, e, ctx) {
        /* zona PDF: eticheta grupului „Optimize for:” stă în stânga butoanelor radio (uia_word.json › dialog.FileSaveAs_pdf ›
           Group „Optimize for:” [43,476,250,67], radiourile de la x = 159); grupurile „Rând metadate” n-au text pe ecran — GRAV T3 */
        if (ctx.cheie === 'dialog.FileSaveAs_pdf' && n.t === 'Group' && /:$/.test(n.e || '')) {
          const q = document.createElement('span');
          q.className = 'lh-ap-grup-eticheta';
          q.textContent = n.e;
          e.appendChild(q);
        }
        if (OFFICE_NUI.indexOf(ctx.cheie) < 0) return;
        if (n.t === 'TitleBar') e.querySelectorAll('.lh-ap-titlu-dialog').forEach(x => x.remove());
        if (n.t === 'Window' && ctx.adancime === 2 && n.e) {
          const q = document.createElement('div');
          q.className = 'lh-ap-office-titlu';
          q.setAttribute('data-lh-dialog-intrebare', '');
          q.textContent = n.e;
          e.appendChild(q);
        }
      },
      editabil(n, ctx) {
        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.FileSaveAs_pdf' || ctx.cheie === 'dialog.open' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) && n.t === 'Edit' && /^File name/.test(n.e)) return true;
        /* caseta Font Size: „type the size you want in the Font Size box” (support.microsoft.com/en-US/Office/fonts/change-the-font-size) */
        if (/^panglica/.test(ctx.cheie || '') && n.t === 'Edit' && n.e === 'Font Size') return true;
        if (ctx.cheie === 'dialog.TableInsertDialogWord' && n.t === 'Spinner' && /^Number of/.test(n.e)) return true;
        return false;
      }
    };
    const desen = (cheie, extra) => pang.deseneaza(I, cheie, Object.assign({}, OPT, extra || {}));
    const titlu = desen('bara_titlu');
    pozitie(titlu, SUP.bara_titlu.r);
    const BTN_TITLU = [...titlu.querySelectorAll('[data-lh-tinta^="bara_titlu:"][data-lh-tip="Button"]')]
      .find(b => /\s-\s/.test(b.getAttribute('data-lh-eticheta') || '')) || null;
    const filePl = desen('file_panglicii');
    pozitie(filePl, SUP.file_panglicii.r);
    const loculPanglicii = el('div', 'lh-ap-loc-panglica');
    susIn.append(titlu, filePl, loculPanglicii);
    const RAND_FILE = filePl.querySelector('[data-lh-eticheta="Ribbon Tabs"]') || filePl;

    /* zona documentului (zona_document din referință: Document › Page 1 › Page 1 content) */
    const zonaSup = el('div', 'lh-ap-zona-sup', { 'data-lh-suprafata': 'zona_document', 'data-lh-tip': 'Pane',
      'data-lh-eticheta': SUP.zona_document ? SUP.zona_document.e : 'zona documentului' });
    const zonaPane = el('div', 'lh-ap-zona-pane', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'Document1' });
    const zona = el('div', 'lh-ap-zona', { 'data-lh-zona': '', 'data-lh-tinta': 'document', 'data-lh-tip': 'Document', 'data-lh-eticheta': 'Document1' });
    const foaie = el('div', 'lh-ap-foaie', { 'data-lh-tip': 'Custom', 'data-lh-eticheta': 'Page 1', 'data-lh-id-mso': 'UIA_AutomationId_Word_Page_1' });
    const corp = el('div', 'lh-ap-corp', { 'data-lh-tip': 'Edit', 'data-lh-eticheta': 'Page 1 content', 'data-lh-id-mso': 'Body' });
    foaie.appendChild(corp);
    const caret = el('div', 'lh-ap-caret', { 'aria-hidden': 'true' });
    const intrare = el('textarea', 'lh-ap-intrare', { 'data-lh-intrare-document': '', 'aria-label': 'Document1', autocomplete: 'off',
      autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', rows: '1' });
    zona.append(foaie, caret, intrare);
    I.intrare = intrare;
    /* bara de derulare verticală a lui Word (Line up / Page down / Line down din referință) */
    const derulare = el('div', 'lh-ap-derulare', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'Vertical' });
    const bara = el('div', 'lh-ap-derulare-bara', { 'data-lh-tip': 'ScrollBar', 'data-lh-eticheta': '' });
    const btnDer = (et, g, cls) => { const b = el('div', 'lh-ap-n lh-ap-der ' + cls, { 'data-lh-tip': 'Button', 'data-lh-eticheta': et, role: 'button', 'aria-label': et, 'data-lh-tinta': 'bara_derulare:' + et }); b.innerHTML = g ? pang.glif(g, 12) : ''; return b; };
    const sLineUp = btnDer('Line up', 'sus', 'lh-ap-der-sus'), sPageDown = btnDer('Page down', null, 'lh-ap-der-pagina'), sLineDown = btnDer('Line down', 'sageata', 'lh-ap-der-jos');
    const sThumb = el('div', 'lh-ap-der-cursor', { 'data-lh-tip': 'Thumb', 'data-lh-eticheta': '' });
    bara.append(sLineUp, sThumb, sPageDown, sLineDown);
    derulare.appendChild(bara);
    zonaPane.append(zona, derulare);
    zonaSup.appendChild(zonaPane);

    const jos = el('div', 'lh-ap-jos'), josIn = el('div', 'lh-ap-jos-in');
    const stare = desen('bara_stare');
    pozitie(stare, SUP.bara_stare.r, [0, SUP.bara_stare.r[1]]);
    josIn.appendChild(stare);
    jos.appendChild(josIn);
    root.append(sus, zonaSup, jos);

    /* ---- filele panglicii */
    const FILE = date.file;
    function deseneazaFile() {
      RAND_FILE.querySelectorAll('[data-lh-context]').forEach(x => x.remove());
      if (contextActiv && date.context[contextActiv]) {
        let x = 0;
        const ultima = [...RAND_FILE.querySelectorAll('[data-lh-tip="TabItem"]')].pop();
        const r0 = ultima ? ultima.offsetLeft + ultima.offsetWidth + 1 : 0;
        date.context[contextActiv].forEach(cx => {
          const t = el('div', 'lh-ap-n lh-ap-t-TabItem lh-ap-context', { 'data-lh-tip': 'TabItem', 'data-lh-eticheta': cx.e, 'data-lh-id-mso': cx.id,
            'data-lh-tinta': 'fila:' + cx.e, role: 'tab', 'data-lh-context': contextActiv });
          t.innerHTML = '<span class="lh-ap-text">' + esc(cx.e) + '</span>';
          t.style.left = (r0 + x) + 'px';
          t.style.top = '0px';
          t.style.width = (cx.e.length * 7 + 22) + 'px';
          t.style.height = '30px';
          x += cx.e.length * 7 + 23;
          RAND_FILE.appendChild(t);
        });
      }
      RAND_FILE.querySelectorAll('[data-lh-tip="TabItem"]').forEach(t => {
        const on = t.getAttribute('data-lh-id-mso') === filaActiva;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.classList.toggle('activ', on);
      });
    }
    function cheieFila(id) {
      if (SUP['panglica.' + id]) return 'panglica.' + id;
      if (SUP['panglica_context.' + id]) return 'panglica_context.' + id;
      return null;
    }
    function deseneazaPanglica() {
      loculPanglicii.innerHTML = '';
      const k = cheieFila(filaActiva);
      if (!k) return;
      const s = desen(k);
      pozitie(s, SUP[k].r);
      loculPanglicii.appendChild(s);
      actualizeazaPanglica();
    }
    function activeazaFila(id) {
      if (!cheieFila(id)) return false;
      filaActiva = id;
      deseneazaFile();
      deseneazaPanglica();
      return true;
    }

    /* ============================================================ desenul documentului („ecranul = starea”, §3) */
    function clasaPar(par) {
      return 'lh-ap-par lh-ap-al-' + par.al + ' lh-ap-stil-' + par.stil.replace(/\s+/g, '-').toLowerCase() + (par.lista ? ' lh-ap-lista' : '');
    }
    function spanuri(par, i) {
      if (!par.t.length) return '';
      const s0 = inceput(i), a = selMin(), b = selMax(), cuSel = areSel() && !M.cel;
      let html = '', k = 0;
      while (k < par.t.length) {
        const f = par.f[k] || DEF, inS = cuSel && s0 + k >= a && s0 + k < b;
        let j = k + 1;
        while (j < par.t.length && egal(par.f[j] || DEF, f) && (cuSel && s0 + j >= a && s0 + j < b) === inS) j++;
        const cls = (f.b ? ' lh-ap-b' : '') + (f.i ? ' lh-ap-i' : '') + (f.u ? ' lh-ap-u' : '') + (inS ? ' lh-ap-sel' : '');
        html += '<span data-o="' + k + '" class="lh-ap-bucata' + cls + '"' + (f.sz ? ' style="font-size:' + f.sz + 'pt"' : '') + '>' + esc(par.t.slice(k, j)) + '</span>';
        k = j;
      }
      return html;
    }
    function deseneazaTabel(t, ti) {
      let h = '<table class="lh-ap-tabel" data-lh-tinta="tabel" data-lh-id="' + (ti + 1) + '"><tbody>';
      t.celule.forEach((r, ri) => {
        h += '<tr>';
        r.forEach((v, ci) => {
          const act = M.cel && M.cel.t === ti && M.cel.r === ri && M.cel.c === ci;
          let inner = esc(v);
          if (act && M.cel.a !== M.cel.f) {
            const a = Math.min(M.cel.a, M.cel.f), b = Math.max(M.cel.a, M.cel.f);
            inner = esc(v.slice(0, a)) + '<span class="lh-ap-sel">' + esc(v.slice(a, b)) + '</span>' + esc(v.slice(b));
          }
          h += '<td data-r="' + ri + '" data-c="' + ci + '"' + (act ? ' class="lh-ap-celula-act"' : '') + '><div class="lh-ap-celula">' + inner + '</div></td>';
        });
        h += '</tr>';
      });
      return h + '</tbody></table>';
    }
    function deseneazaDoc() {
      const lst = liste();
      let h = '';
      M.P.forEach((par, i) => {
        M.tab.forEach((t, ti) => { if (t.la === i) h += deseneazaTabel(t, ti); });
        const imgs = M.img.filter(x => x.p === i).map((x, k) => '<span class="lh-ap-imagine" data-lh-tinta="imagine" data-lh-id="' + (M.img.indexOf(x) + 1) + '" aria-hidden="true"></span>').join('');
        const sb = lst[i] ? (lst[i].tip === 'marcatori' ? '•' : lst[i].simbol) : '';
        h += '<div class="' + clasaPar(par) + '" data-lh-tinta="text" data-lh-id="' + (i + 1) + '"' + (sb ? ' data-simbol="' + esc(sb) + '"' : '') + '>' + imgs + spanuri(par, i) + '</div>';
      });
      corp.innerHTML = h;
      const m = M.pag.margini_cm;
      foaie.style.width = (M.pag.latime_cm * PX_CM) + 'px';
      foaie.style.minHeight = (M.pag.inaltime_cm * PX_CM) + 'px';
      foaie.style.padding = (m.sus * PX_CM) + 'px ' + (m.dreapta * PX_CM) + 'px ' + (m.jos * PX_CM) + 'px ' + (m.stanga * PX_CM) + 'px';
      foaie.style.zoom = String(M.zoom / 100);
      root.classList.toggle('lh-ap-semne', !!M.semne);
    }
    function rectPozitie(pos) {
      const l = loc(pos), pe = corp.querySelector('[data-lh-tinta="text"][data-lh-id="' + (l.i + 1) + '"]');
      if (!pe) return null;
      const sp = [...pe.querySelectorAll('.lh-ap-bucata')];
      for (let k = 0; k < sp.length; k++) {
        const o0 = +sp[k].getAttribute('data-o'), n = sp[k].firstChild ? sp[k].firstChild.data.length : 0;
        if (l.o >= o0 && l.o <= o0 + n && (l.o < o0 + n || k === sp.length - 1 || l.o === o0 + n)) {
          if (l.o === o0 + n && k < sp.length - 1) continue;
          const rg = document.createRange();
          rg.setStart(sp[k].firstChild, l.o - o0);
          rg.setEnd(sp[k].firstChild, l.o - o0);
          const r = rg.getClientRects()[0] || rg.getBoundingClientRect();
          if (r && (r.height > 0)) return { x: r.left, y: r.top, h: r.height };
        }
      }
      const r = pe.getBoundingClientRect(), cs = getComputedStyle(pe);
      const lh = parseFloat(cs.lineHeight) * (M.zoom / 100) || 18;
      const pl = parseFloat(cs.paddingLeft) * (M.zoom / 100) || 0;
      let x = r.left + pl;
      if (par0(l.i).al === 'centru') x = r.left + r.width / 2;
      else if (par0(l.i).al === 'dreapta') x = r.right;
      return { x, y: r.top, h: Math.min(lh, r.height || lh) };
    }
    const par0 = i => M.P[i];
    function pozitioneazaCaret() {
      const vizibil = !areSel() && !M.cel && document.activeElement === intrare;
      const z = zona.getBoundingClientRect();
      let rr = null;
      if (M.cel) {
        const td = corp.querySelector('.lh-ap-celula-act .lh-ap-celula');
        if (td) { const r = td.getBoundingClientRect(); rr = { x: r.left + 2, y: r.top, h: r.height || 18 }; }
      } else rr = rectPozitie(M.sel.f);
      if (!rr) { caret.style.display = 'none'; return; }
      const x = rr.x - z.left + zona.scrollLeft, y = rr.y - z.top + zona.scrollTop;
      caret.style.left = x + 'px';
      caret.style.top = y + 'px';
      caret.style.height = rr.h + 'px';
      caret.style.display = vizibil ? '' : 'none';
      intrare.style.left = x + 'px';
      intrare.style.top = y + 'px';
    }

    /* ---- poziția din punctul ecranului (clicul în document) */
    function dinNod(n, off) {
      const sp = n && (n.nodeType === 3 ? n.parentElement : n);
      const bucata = sp && sp.closest && sp.closest('.lh-ap-bucata');
      const pe = sp && sp.closest && sp.closest('[data-lh-tinta="text"]');
      if (!pe || !corp.contains(pe)) return null;
      const i = +pe.getAttribute('data-lh-id') - 1;
      if (bucata && n.nodeType === 3) return inceput(i) + +bucata.getAttribute('data-o') + off;
      if (bucata) return inceput(i) + +bucata.getAttribute('data-o') + (off > 0 ? (bucata.textContent || '').length : 0);
      /* nodul e paragraful însuși: off = indicele copilului */
      const copii = [...pe.childNodes];
      let o = 0;
      for (let k = 0; k < Math.min(off, copii.length); k++) if (copii[k].classList && copii[k].classList.contains('lh-ap-bucata')) o += copii[k].textContent.length;
      return inceput(i) + o;
    }
    function caretDinPunct(x, y) {
      if (document.caretPositionFromPoint) {
        const p = document.caretPositionFromPoint(x, y);
        return p ? { n: p.offsetNode, o: p.offset } : null;
      }
      if (document.caretRangeFromPoint) {
        const r = document.caretRangeFromPoint(x, y);
        return r ? { n: r.startContainer, o: r.startOffset } : null;
      }
      return null;
    }
    function pozDinPunct(x, y) {
      const pars = [...corp.querySelectorAll('[data-lh-tinta="text"]')];
      if (!pars.length) return 0;
      let tinta = null;
      for (const pe of pars) {
        const r = pe.getBoundingClientRect();
        if (y >= r.top && y < r.bottom) { tinta = pe; break; }
      }
      if (!tinta) {
        const r0 = pars[0].getBoundingClientRect(), rn = pars[pars.length - 1].getBoundingClientRect();
        if (y < r0.top) tinta = pars[0];
        else if (y >= rn.bottom) tinta = pars[pars.length - 1];
        else tinta = pars.reduce((best, pe) => { const r = pe.getBoundingClientRect(); const d = Math.min(Math.abs(y - r.top), Math.abs(y - r.bottom)); return !best || d < best.d ? { pe, d } : best; }, null).pe;
      }
      const r = tinta.getBoundingClientRect();
      const yy = Math.max(r.top + 1, Math.min(r.bottom - 1, y));
      const xx = Math.max(r.left + 1, Math.min(r.right - 1, x));
      const i = +tinta.getAttribute('data-lh-id') - 1;
      if (!M.P[i].t.length) return inceput(i);
      const cp = caretDinPunct(xx, yy);
      const p = cp && dinNod(cp.n, cp.o);
      if (p != null && loc(p).i === i) return p;
      return x < r.left + r.width / 2 ? inceput(i) : inceput(i) + M.P[i].t.length;
    }

    /* ============================================================ actualizarea ecranului */
    function actualizeazaPanglica() {
      const s = I.stare();
      const f0 = (() => { if (M.cel) return DEF; const l = loc(areSel() ? selMin() : Math.max(0, M.sel.f - (M.sel.f > 0 && !inCuvant(M.sel.f) ? 1 : 0))); const par = M.P[l.i]; return par.f[Math.min(l.o, par.t.length - 1)] || DEF; })();
      const par = M.P[loc(M.sel.f).i];
      const bif = { Bold: f0.b, Italic: f0.i, UnderlineGallery: f0.u, AlignLeft: par.al === 'stanga', AlignCenter: par.al === 'centru',
        AlignRight: par.al === 'dreapta', AlignJustifyMenu: par.al === 'stanga-dreapta',
        BulletsGalleryWord: !!(par.lista && par.lista.tip === 'marcatori'), NumberingGalleryWord: !!(par.lista && par.lista.tip === 'numerotare'),
        ParagraphMarks: !!M.semne };
      Object.keys(bif).forEach(id => root.querySelectorAll('[data-lh-id-mso="' + id + '"]').forEach(e => {
        e.classList.toggle('lh-ap-apasat', !!bif[id]);
        e.setAttribute('aria-pressed', bif[id] ? 'true' : 'false');
      }));
      const mf = root.querySelector('[data-lh-id-mso="FontSize"] input');
      if (mf && document.activeElement !== mf) mf.value = String(marime(par, f0));
      const ff = root.querySelector('[data-lh-id-mso="Font"] input');
      if (ff) ff.value = /^Heading|^Title/.test(par.stil) ? 'Calibri Light (Headings)' : 'Calibri (Body)';
      /* bara de stare: numărul de cuvinte și zoom-ul (eticheta declarată = textul de pe ecran) */
      const wc = root.querySelector('[data-lh-suprafata="bara_stare"] [data-lh-eticheta^="Word Count"]');
      if (wc) {
        const t = s.cuvinte + ' words';
        wc.setAttribute('data-lh-eticheta', 'Word Count ' + t);
        const sp = wc.querySelector('.lh-ap-text');
        if (sp) sp.textContent = t;
      }
      const zb = root.querySelector('[data-lh-tinta="zoom:Zoom"]');
      if (zb) {
        const t = M.zoom + ' %';
        zb.setAttribute('data-lh-eticheta', 'Zoom ' + t);
        const sp = zb.querySelector('.lh-ap-text');
        if (sp) sp.textContent = t;
      }
      const sl = root.querySelector('[data-lh-tip="Slider"] [data-lh-tip="Thumb"]');
      if (sl) sl.style.left = Math.round(47 + (M.zoom <= 100 ? (M.zoom - 100) / 90 * 47 : (M.zoom - 100) / 400 * 47)) + 'px';
      /* butonul titlului: „<document>  -  Word”; fără document „Word” (scenarii_real/word-ctrl-w-nu-salva.json ›
         titlu_fereastra) — eticheta declarată = textul de pe ecran (§3) */
      if (BTN_TITLU) {
        const nume = titluFereastra() || '';
        BTN_TITLU.setAttribute('data-lh-eticheta', nume);
        const sp = BTN_TITLU.querySelector('.lh-ap-text');
        if (sp) sp.textContent = nume;
      }
    }
    function actualizeaza() {
      deseneazaDoc();
      actualizeazaPanglica();
      const ctx = M.cel ? 'tabel' : (contextActiv === 'imagine' ? 'imagine' : null);
      if (ctx !== contextActiv) {
        contextActiv = ctx;
        if (!contextActiv && /^Ctx_/.test(filaActiva)) filaActiva = 'TabHome';
        deseneazaFile();
        deseneazaPanglica();
      }
      pozitioneazaCaret();
    }
    I.focus = () => { try { intrare.focus({ preventScroll: true }); } catch (e) { /* */ } pozitioneazaCaret(); };
    intrare.addEventListener('focus', pozitioneazaCaret);
    intrare.addEventListener('blur', () => { caret.style.display = 'none'; });

    /* ============================================================ straturile: meniuri, dialoguri, Backstage */
    function stratNou(cls) {
      const s = el('div', 'lh-ap-strat ' + (cls || ''));
      root.appendChild(s);
      return s;
    }
    function inchideMeniu() { if (meniu) { meniu.remove(); meniu = null; } }
    function meniuLa(anc, itemi, cls) {
      inchideMeniu();
      const R = root.getBoundingClientRect(), r = anc.getBoundingClientRect();
      const m = el('div', 'lh-ap-meniu ' + (cls || ''), { role: 'menu' });
      itemi.forEach(it => {
        const b = el('div', 'lh-ap-meniu-rand', { role: 'menuitem', 'data-lh-tinta': 'meniu:' + it.tinta, 'aria-label': it.tinta });
        b.innerHTML = it.html || '<span class="lh-ap-text">' + esc(it.text) + '</span>';
        b.__fa = it.fa;
        m.appendChild(b);
      });
      m.style.left = Math.max(0, r.left - R.left) + 'px';
      m.style.top = (r.bottom - R.top + 2) + 'px';
      root.appendChild(m);
      meniu = m;
      return m;
    }
    function grilaTabel(anc) {
      const it = [];
      for (let r = 1; r <= 8; r++) for (let k = 1; k <= 10; k++) it.push({ tinta: k + 'x' + r + ' Table', html: '', fa: () => insereazaTabel(r, k) });
      const m = meniuLa(anc, it, 'lh-ap-grila');
      m.addEventListener('pointerover', e => {
        const x = e.target.closest('.lh-ap-meniu-rand');
        if (!x) return;
        const [k, r] = x.getAttribute('aria-label').split(' ')[0].split('x').map(Number);
        m.querySelectorAll('.lh-ap-meniu-rand').forEach(y => { const [k2, r2] = y.getAttribute('aria-label').split(' ')[0].split('x').map(Number); y.classList.toggle('lh-ap-ales', k2 <= k && r2 <= r); });
      });
    }
    function galerieStiluri(anc) {
      const lista = [];
      (function cauta(n) { if (n.t === 'ListItem' && n.e) lista.push(n.e.replace(/^¶\s*/, '')); (n.c || []).forEach(cauta); })(SUP['panglica.TabHome']);
      meniuLa(anc, lista.map(s => ({ tinta: s, html: '<span class="lh-ap-prev lh-ap-stil-' + s.replace(/\s+/g, '-').toLowerCase() + '" aria-hidden="true">AaBbCcDd</span><span class="lh-ap-text">' + esc(s) + '</span>', fa: () => stil(s) })), 'lh-ap-galerie');
    }

    /* cu Backstage sau o fereastră deschisă, tastatura e a lor, nu a documentului (uia_word.json › backstage.nav și
       dialog.FontDialog au tastele lor; critic runda 1, GRAV 2) */
    function focusStrat() {
      const s = dialog ? dialog.el : backstage ? backstage.strat : null;
      if (!s) { I.focus(); return; }
      if (s.contains(document.activeElement) && document.activeElement !== intrare) return;
      if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '-1');
      try { s.focus({ preventScroll: true }); } catch (e) { /* */ }
    }
    function inchideDialog() {
      if (!dialog) return;
      const tv = tipAfisatAcum();
      if (tv != null) M.tipAfisat = tv;
      dialog.strat.remove();
      dialog = null;
      focusStrat();
    }
    function deschideDialog(baza, fila) {
      const info = date.dialoguri[baza];
      if (!info) return false;
      inchideMeniu();
      if (dialog) inchideDialog();
      const strat2 = stratNou('lh-ap-strat-dialog');
      dialog = { baza, strat: strat2, fila: null, desen: baza, folder: folderAdresa(baza === 'dialog.open' ? 'dialog.open' : 'dialog.FileSaveAs') };
      if (baza === 'dialog.FileSaveAs' || baza === SALVARE_NOUA || baza === INTREBARE_INCHIDERE) {
        const prim = (M.P.find(p => p.t.trim()) || { t: '' }).t.trim();
        /* document deja salvat: numele fișierului (Word real, COM — runde/4/critic.md:104: după SaveAs2 dă „numele
           fișierului. După o modificare dă tot numele fișierului”); document nou: primul rând (word-salvare-ca-f12.json).
           Critic runda 4, GRAV T1 */
        let propus = M.salvat ? faraExt(M.nume) : prim ? prim.replace(/[\\/:*?"<>|]/g, '').slice(0, 60) : faraExt(M.nume);
        /* „Save your changes…” pe un document deja salvat: numele lui (fără referință — AC-5) */
        if (baza === INTREBARE_INCHIDERE && M.salvat) propus = faraExt(M.nume);
        /* fereastra Save As propune numele CU extensia („Tema mea de azi.docx”), ferestrele Office FĂRĂ („Poezia mea”):
           scenarii_real/word-salvare-ca-f12.json, word-ctrl-s-document-nou.json */
        if (baza === 'dialog.FileSaveAs') propus += '.docx';
        dialog.propus = propus;
        dialog.tip = tipCaseta(baza);
        if (baza === INTREBARE_INCHIDERE) M.intrebare = { titlu: '', intrebare: date.dialoguri[baza].titlu, butoane: butoaneJos(baza), apasat: null };
        else M.dialogSalvare = { titlu: date.dialoguri[baza].titlu, nume_propus: propus, tip_propus: dialog.tip };
      }
      arataFilaDialog(fila || null);
      return true;
    }
    function arataFilaDialog(fila) {
      const info = date.dialoguri[dialog.baza];
      /* Save As cu „PDF (*.pdf)” ales = altă fereastră în referință (uia_word.json › dialog.FileSaveAs_pdf: Optimize for,
         Options..., Open file after publishing; fără Save Thumbnail) — critic runda 4, GRAV T3 */
      const k = dialog.desen && dialog.desen !== dialog.baza && SUP[dialog.desen] ? dialog.desen : (info.file.find(f => f.fila === fila) || info.file[0]).s;
      dialog.fila = fila;
      dialog.strat.innerHTML = '';
      const s = desen(k);
      /* suprafața dialogului poartă cheia de BAZĂ pe orice filă (oracolul apasă filele și compune singur „#<filă>”,
         CONVENTIE_ARBORE.md §4.3); doar deschisă prin plasa cu o cheie „#…” poartă cheia întreagă */
      s.setAttribute('data-lh-suprafata', dialog.cheiePlasa || (k === 'dialog.FileSaveAs_pdf' ? k : dialog.baza));
      const r = SUP[k].r, R = root.getBoundingClientRect();
      s.style.position = 'absolute';
      s.style.left = Math.max(0, Math.min(r[0], R.width - r[2])) + 'px';
      s.style.top = Math.max(0, Math.min(r[1], R.height - r[3])) + 'px';
      dialog.strat.appendChild(s);
      dialog.el = s;
      /* panoul din stânga al ferestrei Save As: elementele IMPLICITE Windows 11 din referință (uia_word.json ›
         lista.FileSaveAs_navigare; cele 19 personale au fost scoase). În captură erau în afara ecranului, deci locul
         rândurilor (unul sub altul, la 24 px) e al nostru — AC-6. Critic runda 3, GRAV A2 */
      const arb = (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === 'dialog.open') && s.querySelector('[data-lh-tip="Tree"][data-lh-eticheta="Panou de navigare"]');
      if (arb && SUP['lista.FileSaveAs_navigare']) {
        /* + câte un rând pentru fiecare folder din CONȚINUT (fișierele lecției și folderul ferestrei), în ordinea numelor
           implicite Windows 11 din referinte/acoperire_word_r3.py:57 (NAV_IMPLICIT: Acasă, Galerie, Desktop, Descărcări,
           Documente, …, Acest PC, Rețea); locul rândurilor nu e în referință — de_verificat.md R5-1. Fereastra Open are
           același panou Windows (dialog.open › Tree „Panou de navigare”). Critic runda 4, GRAV N4 */
        const impl = (SUP['lista.FileSaveAs_navigare'].c || []).filter(n => n.t === 'TreeItem' && n.e).map(n => n.e);
        const ORD = ['Acasă', 'Galerie', 'Desktop', 'Descărcări', 'Documente', 'Imagini', 'Muzică', 'Videoclipuri', 'Acest PC', 'Rețea'];
        const poz = x => { const i = ORD.indexOf(x); return i < 0 ? 7.5 : i; };
        const fold = [...new Set(M.fs.map(f => f.folder).concat([dialog.folder]).filter(x => x && impl.indexOf(x) < 0))];
        const tot = impl.concat(fold).sort((a, b) => poz(a) - poz(b) || a.localeCompare(b));
        const lat = Math.max(60, Math.min(200, arb.getBoundingClientRect().width - 24));
        tot.forEach((nume, i) => {
          const x = el('div', 'lh-ap-n lh-ap-t-TreeItem lh-ap-nav-rand', { 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': nume, role: 'treeitem',
            'data-lh-tinta': 'arbore:' + nume });
          if (fold.indexOf(nume) >= 0) x.__folder = nume;
          x.style.left = '4px'; x.style.top = (6 + 24 * i) + 'px'; x.style.width = lat + 'px'; x.style.height = '22px';
          x.innerHTML = '<span class="lh-ap-text">' + esc(nume) + '</span>';
          arb.appendChild(x);
        });
      }
      umpleFolder(s);
      /* fila dialogului: TabItem-ul ales e marcat */
      s.querySelectorAll('[data-lh-tip="TabItem"]').forEach((t, i) => {
        const on = fila ? t.getAttribute('data-lh-eticheta') === fila : i === 0;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.classList.toggle('activ', on);
      });
      const nf = s.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      if (nf) {
        /* numele propus de bibliotecă (valoarea din referință e textul capturii, ex. „Ana are mere”) */
        if (dialog.numeAcum != null) nf.value = dialog.numeAcum;
        else if (dialog.propus != null) nf.value = dialog.propus;
        const ti = dialog.focusTip && s.querySelector('[data-lh-tinta="camp:tip_fisier"] input');
        /* redesenată după alegerea tipului (T3): focusul rămâne în caseta Save as type, ca Enter să fie tot Save */
        if (ti) { try { ti.focus({ preventScroll: true }); } catch (e) { /* */ } }
        else setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0);
      } else {
        s.setAttribute('tabindex', '-1');
        setTimeout(() => { if (dialog && dialog.el === s) focusStrat(); }, 0);
      }
    }
    function implicitDialog() {
      if (!dialog) return null;
      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveaza();
      if (dialog.baza === 'dialog.open') return deschideDinOpen(valoareCamp('camp:nume_fisier'));
      /* Enter în „Save your changes…” = Save, ca în „Save this file” (butonul apăsat de Enter: NEVERIFICAT, AC-3) */
      if (dialog.baza === INTREBARE_INCHIDERE) {
        if (M.intrebare) M.intrebare.apasat = 'Save';
        const cum = M.dupaInchidere, r = salveaza();
        return r === 'salvare' ? inchideDocument(cum, 'salvare_si_inchidere') : r;
      }
      if (dialog.baza === 'dialog.PictureInsertFromFile') return insereazaImagine();
      if (dialog.baza === 'dialog.TableInsertDialogWord') return okTabel();
      inchideDialog();
      return 'ok';
    }
    function valoareCamp(tinta) {
      const x = dialog && dialog.el.querySelector('[data-lh-tinta="' + tinta + '"] input');
      return x ? x.value : '';
    }
    /* folderul în care se deschide fereastra Save As = bara ei de adrese în referință (uia_word.json › dialog.FileSaveAs ›
       ToolBar „Adresă: Documente”); „Save this file” are același loc (Location, A2-1) */
    function folderAdresa(cheie) {
      let f = null;
      (function cauta(n) { if (!n || f) return; const m = /^Adres[ăa]: (.+)$/.exec(n.e || ''); if (m) { f = m[1]; return; } (n.c || []).forEach(cauta); })(SUP[cheie]);
      return f || 'Documente';
    }
    function folderSalvare() { return folderAdresa('dialog.FileSaveAs'); }
    /* ---- fișierele din foldere (conținutul lecției + ce salvează elevul), cu textul lor */
    function gasesteFisier(nume, folder) {
      return M.fs.find(f => f.nume.toLowerCase() === String(nume).toLowerCase() && f.folder === folder) || null;
    }
    function scrieFisier(nume, folder, tip) {
      const f = { nume, folder, tip, text: M.P.map(p => p.t) };
      const v = gasesteFisier(nume, folder);
      if (v) Object.assign(v, f); else M.fs.push(f);
      if (M.salvari.indexOf(nume) < 0) M.salvari.push(nume);
      /* documentul salvat urcă primul în lista Recent (NEVERIFICAT: AC-7) */
      if (!/\.pdf$/i.test(nume)) {
        M.recente = M.recente.filter(r => !(r.nume.toLowerCase() === nume.toLowerCase() && r.folder === folder));
        M.recente.unshift({ nume, folder });
      }
    }
    function salveaza() {
      let v = valoareCamp('camp:nume_fisier').trim();
      if (!v) return 'fara_efect';
      /* „Save your changes…” pe un document deja salvat: în folderul lui (AC-5); altfel folderul ferestrei (referința) */
      const folder = dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat && M.folder ? M.folder : (dialog && dialog.folder) || folderSalvare();
      const tip = (dialog && dialog.tip) || TIPURI_SALVARE[0] || 'Word Document (*.docx)';
      let r = 'salvare';
      /* un fișier cu același nume există deja în folder: Word întreabă („The file … already exists”, lecția m1-l03:157-159);
         fereastra întrebării NU e în referință → mesajul central, fișierul NU se atinge, fereastra de salvare rămâne
         deschisă (de_verificat.md R5-3). Excepție: „Save your changes…” pe documentul salvat = același fișier (AC-5).
         Critic runda 4, GRAV T2 */
      const exista = n => !!gasesteFisier(n, folder) && !(dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat &&
        n.toLowerCase() === String(M.nume).toLowerCase() && folder === M.folder);
      if (/\(\*\.pdf\)/.test(tip)) {
        /* Save as type „PDF (*.pdf)”: o copie PDF; documentul deschis rămâne cel de lucru, nesalvat
           (scenarii_real/word-salvare-pdf.json: fisiere_salvate ["Orar.pdf"], nume_fisier null) */
        const np = v.replace(/\.(docx?|pdf)$/i, '') + '.pdf';
        if (exista(np)) return I.nesimulat(np + ' already exists');
        scrieFisier(np, folder, tip);
        r = 'salvare_pdf';
      } else if (tip === TIPURI_SALVARE[0] || !TIPURI_SALVARE.length) {
        if (!/\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
        if (exista(v)) return I.nesimulat(v + ' already exists');
        M.nume = v;
        M.salvat = true;
        M.folder = folder;
        M.modificat = false;
        scrieFisier(v, folder, tip);
      } else {
        /* celelalte 15 tipuri ale listei: efectul lor nu e dovedit în referință (doar .docx și PDF) → mesajul central (R12) */
        return I.nesimulat(tip);
      }
      inchideDialog();
      if (backstage) inchideBackstage();
      /* bara de titlu arată numele imediat, pe orice drum (Enter / Save; F12 / Ctrl+S) — critic runda 2, GRAV N1 */
      actualizeazaPanglica();
      return r;
    }
    /* Ctrl+S pe un document deja salvat: același fișier, fără ferestre (support.microsoft.com/en-us/office/keyboard-
       shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2: „Save the document. | Ctrl+S”); textul nou ajunge în fișier */
    function salveazaPeLoc() {
      scrieFisier(M.nume, M.folder || folderSalvare(), tipDupaNume(M.nume) || TIPURI_SALVARE[0] || null);
      M.modificat = false;
      return 'salvare';
    }
    /* Save As › „Save as type:” — rândul ales se vede în casetă (acoperire_r3.fapte.e_dupa_pdf.save_as_type_arata:
       „PDF (*.pdf)”; critic runda 3, GRAV A1) */
    function alegeTip(cb, tip) {
      if (!dialog) return 'fara_efect';
      dialog.tip = tip;
      /* PDF ↔ celelalte tipuri: fereastra se redesenează din referința ei (dialog.FileSaveAs_pdf / dialog.FileSaveAs), cu
         numele scris și folderul păstrate — critic runda 4, GRAV T3 */
      const vrut = dialog.baza === 'dialog.FileSaveAs' && /\(\*\.pdf\)/.test(tip) && SUP['dialog.FileSaveAs_pdf'] ? 'dialog.FileSaveAs_pdf' : dialog.baza;
      if (dialog.baza === 'dialog.FileSaveAs' && vrut !== dialog.desen) {
        dialog.numeAcum = valoareCamp('camp:nume_fisier');
        dialog.desen = vrut;
        dialog.focusTip = true;
        arataFilaDialog(dialog.fila);
        dialog.focusTip = false;
        cb = dialog.el.querySelector('[data-lh-tinta="camp:tip_fisier"]') || cb;
      }
      const inp = cb.querySelector('input');
      if (inp) inp.value = tip;
      cb.querySelectorAll('[data-lh-tip="Text"]').forEach(x => { const sp = x.querySelector('.lh-ap-text') || x; sp.textContent = tip; });
      return 'tip_fisier';
    }
    /* valoarea casetei Save as type a unei ferestre, din referință (dialog.FileSaveAs / dialog.save_this_file: „Word
       Document (*.docx)”) */
    function tipCaseta(baza) {
      let v = null;
      (function u(n) { if (!n || v) return; if (n.t === 'ComboBox' && /^Save as type/.test(n.e || '')) { v = n.v || null; return; } (n.c || []).forEach(u); })(SUP[baza]);
      return v;
    }
    /* butoanele de pe rândul de JOS al ferestrei, de la stânga la dreapta (descrierea scenariilor word-ctrl-w-*) */
    function butoaneJos(baza) {
      const b = [];
      (function u(n, inTitlu) { if (!n) return; if (n.t === 'Button' && !inTitlu && n.r) b.push(n); (n.c || []).forEach(c => u(c, inTitlu || n.t === 'TitleBar')); })(SUP[baza], false);
      if (!b.length) return [];
      const jos = Math.max(...b.map(n => n.r[1] + n.r[3]));
      return b.filter(n => n.r[1] + n.r[3] >= jos - 10).sort((x, y) => x.r[0] - y.r[0]).map(n => n.e);
    }
    /* ce ARATĂ acum caseta Save as type (fereastra deschisă) sau ce arăta când s-a închis */
    function tipAfisatAcum() {
      const x = dialog && dialog.el && dialog.el.querySelector('[data-lh-tinta="camp:tip_fisier"] input');
      return x ? x.value : M.tipAfisat;
    }
    function titluFereastra() {
      if (M.inchisApp) return null;
      if (!M.deschis) return 'Word';
      return (M.salvat ? M.nume.replace(/\.docx$/i, '') : M.nume) + '  -  Word';
    }

    /* ---- lista deschisă a unei casete, desenată din referință (uia_word.json › lista.<…>): rândurile, ordinea și mărimea
       lor. Colțul din stânga sus = sub casetă: lista.FontSize [232,115] sub caseta Font Size [232,91,43,24]; lista
       Save as type [134,430] sub caseta [134,407,815,22] a aceleiași capturi (dialog.FileSaveAs_pdf), deci +1 px. Rândul ales
       cu tastatura poartă clasa lh-ap-ales. Al doilea clic pe aceeași casetă închide lista. */
    let inchisLa = null;
    function listaRef(cheie, caseta, alege, dy, curent) {
      if (inchisLa && inchisLa.anc === caseta && Date.now() - inchisLa.t < 400) { inchisLa = null; return 'inchidere_meniu'; }
      inchisLa = null;
      inchideMeniu();
      const s = desen(cheie);
      if (!s) return I.nesimulat((caseta.getAttribute('data-lh-eticheta') || '') + ' ▾');
      const R = root.getBoundingClientRect(), r = caseta.getBoundingClientRect();
      s.classList.add('lh-ap-lista-ref');
      /* rolul după tipul real al ferestrei-listă: Menu (Font Size) / List (Save as type) */
      if (!s.getAttribute('role')) s.setAttribute('role', SUP[cheie].t === 'Menu' ? 'menu' : 'listbox');
      s.style.position = 'absolute';
      s.style.left = Math.max(0, r.left - R.left) + 'px';
      s.style.top = (r.bottom - R.top + (dy || 0)) + 'px';
      const randuri = [...s.querySelectorAll('[data-lh-tip="ListItem"]')];
      randuri.forEach(x => { x.__fa = () => alege(x.getAttribute('data-lh-eticheta')); });
      s.__randuri = randuri;
      s.__anc = caseta;
      root.appendChild(s);
      meniu = s;
      marcheaza(randuri.findIndex(x => x.getAttribute('data-lh-eticheta') === String(curent)));
      return null;
    }
    function marcheaza(k) {
      if (!meniu || !meniu.__randuri) return;
      meniu.__randuri.forEach((x, i) => x.classList.toggle('lh-ap-ales', i === k));
      meniu.__ales = k;
    }
    /* tastele pe o listă deschisă (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-
       f762f663ceb2: „When a menu or submenu is open, move to the next command. | Down arrow key”; „Activate the selected
       button. | Spacebar or Enter”; „Cancel a command. | Esc”) — critic runda 3, GRAV 3, unghiul gest_tastatura */
    function tastaLista(e) {
      if (!meniu || !meniu.__randuri) return null;
      const n = meniu.__randuri.length, k = meniu.__ales == null ? -1 : meniu.__ales;
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !e.altKey) {
        e.preventDefault();
        marcheaza(e.key === 'ArrowDown' ? Math.min(n - 1, k + 1) : Math.max(0, k - 1));
        return 'mutare_in_lista';
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const x = meniu.__randuri[k];
        if (!x) { inchideMeniu(); return 'inchidere_meniu'; }
        /* Enter apasă rândul marcat, deși focusul rămâne în casetă: evenimentul poartă `activat` = ținta rândului, ca
           asistentul să vadă același pas ca la clic (api_biblioteca.md §4 „activat”, §6.3) — critic runda 4, GRAV T6 */
        try { I.activat = L._canon(x) || null; } catch (z) { I.activat = null; }
        const r = x.__fa();
        inchideMeniu();
        return r;
      }
      if (e.key === 'Escape') { e.preventDefault(); inchideMeniu(); return 'inchidere_meniu'; }
      return null;
    }
    function listaTip(cb) {
      const i = cb.querySelector('input');
      return listaRef('lista.FileSaveAs_tip', cb, tip => alegeTip(cb, tip), 1, i ? i.value : (dialog && dialog.tip));
    }
    /* lista Font Size: rândul ales = mărimea pe selecție (scenarii_real/word-font-size-lista.json: „20” → „are” 20) */
    function listaMarimi(cb) {
      const i = cb.querySelector('input');
      return listaRef('lista.FontSize', cb, v => marimeLa(Number(v)), 0, i ? i.value : null);
    }
    function insereazaImagine() {
      const v = valoareCamp('camp:nume_fisier').trim();
      if (!v) return 'fara_efect';
      schimba('imagine', () => { M.img = M.img.concat([{ p: loc(M.sel.f).i, fisier: v.replace(/^.*[\\/]/, '') }]); });
      H.rupe();
      inchideDialog();
      return 'inserare_imagine';
    }
    function okTabel() {
      const k = parseInt(valoareCamp('camp:Number of columns'), 10), r = parseInt(valoareCamp('camp:Number of rows'), 10);
      inchideDialog();
      if (!(k > 0 && r > 0)) return 'fara_efect';
      return insereazaTabel(Math.min(r, 32767), Math.min(k, 63));
    }

    function inchideBackstage() {
      if (!backstage) return;
      backstage.strat.remove();
      backstage = null;
      I.focus();
    }
    function deschideBackstage(pagina) {
      inchideMeniu();
      if (!backstage) {
        const s = stratNou('lh-ap-strat-backstage');
        const inner = el('div', 'lh-ap-backstage-in');
        s.appendChild(inner);
        backstage = { strat: s, inner, pagina: null };
        if (SUP['backstage.cadru']) { const c0 = desen('backstage.cadru'); pozitie(c0, SUP['backstage.cadru'].r); c0.classList.add('lh-ap-cadru'); const tb = c0.querySelector('[data-lh-tip="TitleBar"]'); if (tb) { const t = el('span', 'lh-ap-titlu-dialog'); t.textContent = tb.getAttribute('data-lh-eticheta'); tb.appendChild(t); } inner.appendChild(c0); }
        const nav = desen('backstage.nav');
        pozitie(nav, SUP['backstage.nav'].r);
        inner.appendChild(nav);
        backstage.nav = nav;
        s.setAttribute('tabindex', '-1');
      }
      arataPaginaBackstage(pagina || 'Home');
      focusStrat();
    }
    function arataPaginaBackstage(pagina) {
      const k = 'backstage.' + pagina;
      if (!SUP[k]) return false;
      if (backstage.pag) backstage.pag.remove();
      const p = desen(k);
      pozitie(p, SUP[k].r);
      backstage.inner.appendChild(p);
      backstage.pag = p;
      backstage.pagina = pagina;
      if (pagina === 'Open') umpleRecente(p);
      backstage.nav.querySelectorAll('[data-lh-tip="ListItem"]').forEach(x => x.classList.toggle('activ', x.getAttribute('data-lh-eticheta') === pagina));
      return true;
    }

    /* ============================================================ închiderea și deschiderea documentelor (critic runda 3, N4) */
    const instantaneuDoc = () => ({ P: M.P, tab: M.tab, img: M.img, pag: M.pag, sel: M.sel, cel: M.cel, nume: M.nume, salvat: M.salvat,
      folder: M.folder, modificat: M.modificat, H });
    function incarcaDoc(d) {
      M.P = d.P; M.tab = d.tab || []; M.img = d.img || []; M.pag = d.pag || paginaNoua(); M.sel = d.sel || { a: 0, f: 0 }; M.cel = d.cel || null;
      M.nume = d.nume; M.salvat = !!d.salvat; M.folder = d.folder || null; M.modificat = !!d.modificat;
      M.fmtIns = null; M.ultima = null;
      H = d.H || st.istoric(grupeaza);
      M.deschis = true;
      root.classList.remove('lh-ap-fara-document');
      actualizeaza();
    }
    /* Ctrl+W / ✕: documentul NEmodificat se închide fără întrebare (support.microsoft.com/en-US/Support/known-issues/
       users-are-prompted-to-save-locally-saved-documents-after-being-idle-with-no-edits-made: întrebarea fără modificări e
       un defect; AC-4); cel modificat întreabă „Save your changes to this file?” (uia_word.json ›
       dialog.save_your_changes_to_this_file; scenarii_real/word-ctrl-w-nesalvat.json; ✕ = aceeași fereastră:
       word-x-nesalvat-cancel.json). Profilul word2007 n-are referință pentru asta → mesajul central. */
    function cerereInchidere(cum) {
      if (M.inchisApp) return 'fara_efect';
      if (p2007) return I.nesimulat(cum === 'x' ? 'Close' : 'Ctrl+W');
      if (!M.deschis) { if (cum === 'x') { inchideAplicatia(); return 'inchidere_aplicatie'; } return 'fara_efect'; }
      if (backstage) inchideBackstage();
      if (!M.modificat) return inchideDocument(cum, 'inchidere_document');
      M.dupaInchidere = cum;
      return deschideDialog(INTREBARE_INCHIDERE) ? 'intrebare_salvare' : I.nesimulat(cum === 'x' ? 'Close' : 'Ctrl+W');
    }
    /* documentul se închide; Word rămâne deschis, gol, cu titlul „Word” (scenarii_real/word-ctrl-w-nu-salva.json:
       documente_deschise 0, titlu_fereastra „Word”). Alt document deschis (din Recent) vine în față. ✕ pe ultimul document
       închide tot Word-ul (lecția m1-l03:207; fără referință — AC-5). */
    function inchideDocument(cum, actiune) {
      if (M.altele.length) { incarcaDoc(M.altele.pop()); return actiune; }
      if (cum === 'x') { inchideAplicatia(); return actiune; }
      M.deschis = false;
      M.P = [parIn('')]; M.tab = []; M.img = []; M.pag = paginaNoua(); M.sel = { a: 0, f: 0 }; M.cel = null;
      M.nume = 'Document1'; M.salvat = false; M.folder = null; M.modificat = false; M.fmtIns = null; M.ultima = null;
      H = st.istoric(grupeaza);
      root.classList.add('lh-ap-fara-document');
      actualizeaza();
      return actiune;
    }
    function inchideAplicatia() {
      M.deschis = false;
      M.inchisApp = true;
      M.altele = [];
      inchideMeniu();
      if (backstage) inchideBackstage();
      root.classList.add('lh-ap-fara-document', 'lh-ap-inchisa');
      actualizeaza();
    }
    /* un rând din Recent deschide fișierul (din `fisiere` sau salvat de elev); un document în lucru rămâne deschis în
       fereastra lui (documente_deschise crește) — NEVERIFICAT: AC-7 */
    function deschideFisier(ref) {
      const f = gasesteFisier(ref.nume, ref.folder);
      if (!f) return I.nesimulat(faraExt(ref.nume));
      if (M.deschis && (M.salvat || M.modificat)) M.altele.push(instantaneuDoc());
      inchideBackstage();
      incarcaDoc({ P: f.text.map(t => parIn(t)), nume: f.nume, folder: f.folder, salvat: true, modificat: false });
      return 'deschidere';
    }
    /* fereastra Open: numele ales sau scris, din folderul ferestrei; fișierul se deschide ca din Recent. Un PDF (Files of
       type le arată și pe ele) și un nume negăsit n-au efect dovedit în referință → mesajul central. Critic runda 4, N4 */
    function deschideDinOpen(v) {
      v = String(v || '').trim().replace(/^"|"$/g, '');
      if (!v || !dialog) return 'fara_efect';
      const c = M.fs.filter(x => x.folder === dialog.folder && (x.nume.toLowerCase() === v.toLowerCase() || faraExt(x.nume).toLowerCase() === v.toLowerCase()));
      const f = c.find(x => !/\.pdf$/i.test(x.nume)) || c[0];
      if (!f || /\.pdf$/i.test(f.nume)) return I.nesimulat(f ? f.nume : v);
      inchideDialog();
      return deschideFisier({ nume: f.nume, folder: f.folder });
    }
    function alegeRandOpen(x) {
      dialog.el.querySelectorAll('[data-lh-tinta^="lista:"]').forEach(r => r.toggleAttribute('data-lh-selectat', r === x));
      const nf = dialog.el.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      if (nf) nf.value = faraExt(x.__fisier.nume);
    }
    function navigheaza(folder) {
      dialog.folder = folder;
      umpleFolder(dialog.el);
      return 'navigare';
    }
    /* bara de adrese și lista ferestrei = folderul curent (dialog.folder); în Open, rândurile listei = fișierele lui din
       CONȚINUT (uia_word.json › dialog.open › List „Vizualizare elemente”: 8 ListItem, texte redactate); pe ecran numele
       fără extensie, ca la Recent (AC-7); ținta lista:<nume.ext> (api §3). Critic runda 4, GRAV N4 */
    function umpleFolder(s) {
      if (!dialog || !(dialog.baza === 'dialog.FileSaveAs' || dialog.baza === 'dialog.open')) return;
      const f0 = folderAdresa(dialog.baza === 'dialog.open' ? 'dialog.open' : 'dialog.FileSaveAs');
      const adr = [...s.querySelectorAll('[data-lh-tip="SplitButton"]')].find(x => x.getAttribute('data-lh-eticheta') === f0 && x.closest('[data-lh-eticheta^="Adres"]'));
      if (adr && dialog.folder !== f0) {
        adr.closest('[data-lh-eticheta^="Adres"]').setAttribute('data-lh-eticheta', 'Adresă: ' + dialog.folder);
        adr.setAttribute('data-lh-eticheta', dialog.folder);
        if (adr.hasAttribute('data-lh-tinta')) adr.setAttribute('data-lh-tinta', 'fereastra:' + dialog.folder);
        const t = adr.querySelector('.lh-ap-text');
        if (t) t.textContent = dialog.folder;
      }
      s.querySelectorAll('.lh-ap-nav-rand').forEach(x => x.toggleAttribute('data-lh-selectat', x.getAttribute('data-lh-eticheta') === dialog.folder));
      if (dialog.baza !== 'dialog.open') return;
      const fis = M.fs.filter(f => f.folder === dialog.folder).sort((a, b) => a.nume.localeCompare(b.nume));
      const randuri = s.__randuriOpen || (s.__randuriOpen = [...s.querySelectorAll('[data-lh-tip="List"][data-lh-eticheta="Vizualizare elemente"] [data-lh-tip="ListItem"]')]);
      randuri.forEach((x, k) => {
        const f = fis[k];
        x.__fisier = f || null;
        x.removeAttribute('data-lh-selectat');
        if (!f) { x.style.display = 'none'; return; }
        x.style.display = '';
        x.setAttribute('data-lh-eticheta', faraExt(f.nume));
        x.setAttribute('data-lh-tinta', 'lista:' + f.nume);
        x.innerHTML = '<span class="lh-ap-text">' + esc(faraExt(f.nume)) + '</span>';
      });
    }
    /* Ctrl+N / File › Blank document: un document nou, gol; cel deschis rămâne în fereastra lui (documente_deschise crește).
       support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2: „Create a new
       document. | Ctrl+N”; lecția m1-l03:116. Numele „Document1”: numerotarea nu e în referință (de_verificat R5-2).
       Critic runda 4, GRAV T5 */
    function documentNou() {
      if (M.inchisApp) return 'fara_efect';
      if (M.deschis) M.altele.push(instantaneuDoc());
      incarcaDoc({ P: [parIn('')], nume: 'Document1', salvat: false, modificat: false });
      return 'document_nou';
    }
    /* zona PDF (uia_word.json › dialog.FileSaveAs_pdf): bifa „Open file after publishing” (fapte.e_dupa_pdf.bife = 0) și
       butoanele radio „Optimize for:” își schimbă starea ca orice CheckBox / RadioButton — critic runda 4, GRAV T3 */
    function comutaCaseta(x, tn) {
      const pune = (y, on) => {
        y.setAttribute('aria-checked', on ? 'true' : 'false');
        const c = y.querySelector('.lh-ap-caseta');
        if (c) c.innerHTML = on ? pang.glif(tn === 'RadioButton' ? 'punct' : 'bifa', 12) : '';
      };
      if (tn === 'CheckBox') { const on = x.getAttribute('aria-checked') !== 'true'; pune(x, on); return on ? 'bifare' : 'debifare'; }
      (x.closest('[data-lh-tip="Group"]') || dialog.el).querySelectorAll('[data-lh-tip="RadioButton"]').forEach(y => pune(y, y === x));
      return 'alegere_optiune';
    }
    const numeTasta = e => (e.ctrlKey ? 'Ctrl+' : '') + (e.altKey ? 'Alt+' : '') + (e.shiftKey ? 'Shift+' : '') + (String(e.key || '').length === 1 ? String(e.key).toUpperCase() : e.key);
    /* File › Open › Recent: rândurile = lista Recent din conținut (+ documentele salvate); forma rândului din
       uia_word.json › backstage.Open_rand_recent (ListItem 753×61, Alt, F, O, Y 3…). Fără `recente`, rândurile rămân ale
       referinței (goale: textele lor sunt personale). Pe rând: numele fără extensie, ca în bara de titlu (AC-7). */
    function umpleRecente(p) {
      if (!M.recente.length) return;
      const randuri = [...p.querySelectorAll('[data-lh-id-mso="GroupRecentDocuments"] [data-lh-tip="List"] [data-lh-tip="ListItem"]')];
      randuri.forEach((x, k) => {
        const f = M.recente[k];
        if (!f) { x.style.display = 'none'; x.__fisier = null; return; }
        const et = faraExt(f.nume);
        x.style.display = '';
        x.setAttribute('data-lh-eticheta', et);
        x.setAttribute('data-lh-tinta', 'backstage:' + et);
        x.innerHTML = '<span class="lh-ap-text">' + esc(et) + '</span>';
        x.__fisier = f;
      });
    }

    function inchideMeniuContextual() { if (strat && strat.contextual) { strat.remove(); strat = null; } }
    function meniuContextual(x, y) {
      inchideMeniu();
      inchideMeniuContextual();
      const k = areSel() ? 'meniu_contextual.text_selectat' : 'meniu_contextual.text';
      if (!SUP[k]) return null;
      const s = desen(k);
      const r = SUP[k].r, R = root.getBoundingClientRect();
      const meniuR = (SUP[k].c && SUP[k].c[0] && SUP[k].c[0].r) || r;
      const dy = meniuR[1] - r[1];
      s.style.position = 'absolute';
      s.style.left = Math.max(0, Math.min(x - R.left, R.width - r[2])) + 'px';
      s.style.top = Math.max(0, Math.min(y - R.top - dy, R.height - r[3])) + 'px';
      s.contextual = true;
      root.appendChild(s);
      strat = s;
      return 'meniu_contextual';
    }

    /* ============================================================ comenzile (după idMso; mini-bara și meniul după nume) */
    const CMD = {
      Bold: () => comuta('b'), Italic: () => comuta('i'), UnderlineGallery: () => comuta('u'),
      FontSizeIncreaseWord: () => marimeFont(1), FontSizeDecreaseWord: () => marimeFont(-1),
      FontSize: elx => {
        const c = elx.querySelector('input');
        /* săgeata ▾ (Button „Open” al casetei în referință) → lista mărimilor din referință (uia_word.json › lista.FontSize:
           8 … 72, 16 rânduri; scenarii_real/word-font-size-lista.json) — critic runda 3, GRAV 3 */
        if (!c) return listaMarimi(elx.closest('[data-lh-id-mso="FontSize"]') || elx) || 'lista_marimi';
        if (document.activeElement !== c) try { c.focus({ preventScroll: true }); } catch (x) { /* */ }
        return 'camp';
      },
      AlignLeft: () => aliniaza('stanga'), AlignCenter: () => aliniaza('centru'), AlignRight: () => aliniaza('dreapta'),
      AlignJustifyMenu: () => aliniaza('stanga-dreapta'),
      BulletsGalleryWord: () => lista('marcatori'), NumberingGalleryWord: () => lista('numerotare'),
      Paste: () => lipeste(false), Cut: () => decupeaza(), Copy: () => copiaza(),
      FontDialog: () => (deschideDialog('dialog.FontDialog') && 'dialog_font'),
      ParagraphDialog: () => (deschideDialog('dialog.ParagraphDialog') && 'dialog_paragraf'),
      PageSetupDialog: () => (deschideDialog('dialog.PageSetupDialog') && 'dialog_pagina'),
      TableInsertGallery: e => { grilaTabel(e); return 'meniu_tabel'; },
      /* listele deschise NU sunt în referința UIA: doar rândurile citate — „Narrow Margins” (scenarii_real/word-margini-ingust.json),
         „Custom Margins”, „Portrait”/„Landscape” (support.microsoft.com/en-US/Word/training/change-document-layout),
         „This Device”, „Stock Images”, „Online Pictures” (support.microsoft.com/en-us/word/training/insert-pictures) */
      PageMarginsGallery: e => { meniuLa(e, [{ tinta: 'Narrow Margins', text: 'Narrow Margins', fa: () => margini(1.27) },
        { tinta: 'Custom Margins', text: 'Custom Margins', fa: () => (deschideDialog('dialog.PageSetupDialog') && 'dialog_pagina') }]); return 'meniu_margini'; },
      PageOrientationGallery: e => { meniuLa(e, [{ tinta: 'Portrait', text: 'Portrait', fa: () => orientare('portret') },
        { tinta: 'Landscape', text: 'Landscape', fa: () => orientare('vedere') }]); return 'meniu_orientare'; },
      FlyoutAnchorInsertPictures: e => { meniuLa(e, [{ tinta: 'This Device', text: 'This Device', fa: () => (deschideDialog('dialog.PictureInsertFromFile') && 'dialog_imagine') },
        { tinta: 'Stock Images', text: 'Stock Images', fa: () => I.nesimulat('Stock Images') },
        { tinta: 'Online Pictures', text: 'Online Pictures', fa: () => I.nesimulat('Online Pictures') }]); return 'meniu_imagini'; }
    };
    const DUPA_NUME = { 'Bold': 'Bold', 'Italic': 'Italic', 'Underline': 'UnderlineGallery', 'Grow Font': 'FontSizeIncreaseWord',
      'Shrink Font': 'FontSizeDecreaseWord', 'Bullets': 'BulletsGalleryWord', 'Numbering': 'NumberingGalleryWord', 'Cut': 'Cut',
      'Copy': 'Copy', 'Font...': 'FontDialog', 'Paragraph...': 'ParagraphDialog' };
    function idDe(elx) {
      const n = elx.__nod || {};
      if (n.id && !/_Dropdown$/.test(n.id)) return n.id;
      if (n.id && /_Dropdown$/.test(n.id)) return n.id;
      const sb = elx.parentElement && elx.parentElement.closest('[data-lh-tip="SplitButton"],[data-lh-tip="ComboBox"]');
      if (sb && sb.__nod && sb.__nod.id && !/More Options/.test(n.e || '')) return sb.__nod.id;
      return DUPA_NUME[n.e] || null;
    }
    function apasa(elx, tinta) {
      const n = elx.__nod || {};
      if (elx.getAttribute('aria-disabled') === 'true') return 'indisponibil';
      const id = idDe(elx);
      if (id && CMD[id]) { const r = CMD[id](elx); if (strat && strat.contextual && !meniuDeschisDe(elx)) inchideMeniuContextual(); return r; }
      /* galeria de stiluri din panglică: un stil = clic pe dala lui; săgeata „Styles” deschide galeria întreagă */
      if (/^meniu:/.test(tinta) && elx.closest('[data-lh-id-mso="QuickStylesGallery"]')) return stil(tinta.slice(6));
      if (n.t === 'Button' && n.e === 'Styles' && elx.closest('[data-lh-id-mso="QuickStylesGallery"]')) { galerieStiluri(elx); return 'galerie_stiluri'; }
      if (elx.__fa) { const r = elx.__fa(); inchideMeniu(); return r; }
      if (strat && strat.contextual && strat.contains(elx)) {
        if (n.e === 'Keep Text Only') { inchideMeniuContextual(); return lipeste(true); }
      }
      let et = String(n.e || tinta.replace(/^[a-z_]+:/, '')).replace(/^.*\//, '');
      if (/^(Open|More Options)$/.test(n.e || '')) {     // săgeata unei liste: mesajul numește comanda, nu „More Options”
        const u = elx.parentElement && elx.parentElement.closest('[data-lh-tip="SplitButton"],[data-lh-tip="ComboBox"]');
        if (u && u.getAttribute('data-lh-eticheta')) et = u.getAttribute('data-lh-eticheta') + ' ▾';
      }
      if (strat && strat.contextual && strat.contains(elx)) inchideMeniuContextual();
      return I.nesimulat(et);
    }
    const meniuDeschisDe = () => false;

    /* ---- clicurile (le emite aplicatii.js; aici doar efectul) */
    function eInDocument(t) { return zona.contains(t) && !t.closest('.lh-ap-derulare'); }
    I.la = {};
    let numarClic = 0, ultimJos = null, ancora = null;
    I.la.jos = (e, tinta) => {
      const tg = e.target;
      if (meniu && !meniu.contains(tg)) { if (meniu.__anc && meniu.__anc.contains(tg)) inchisLa = { anc: meniu.__anc, t: Date.now() }; inchideMeniu(); }
      if (strat && strat.contextual && !strat.contains(tg)) inchideMeniuContextual();
      if (!eInDocument(tg) || dialog || backstage || !M.deschis) {
        ultimJos = null;
        /* un clic pe panglică / bara de stare lasă tastatura în document, ca în Word */
        if (!dialog && !backstage && !tg.closest('input,textarea,select') && document.activeElement !== intrare) I.focus();
        return null;
      }
      const acum = Date.now();
      numarClic = ultimJos && acum - ultimJos.t < 500 && Math.hypot(e.clientX - ultimJos.x, e.clientY - ultimJos.y) < 6 ? Math.min(3, ultimJos.n + 1) : 1;
      ultimJos = { t: acum, x: e.clientX, y: e.clientY, n: numarClic };
      I.focus();
      /* clic într-o celulă de tabel */
      const td = tg.closest('td[data-r]');
      if (td) {
        const tb = td.closest('table'), ti = +tb.getAttribute('data-lh-id') - 1;
        const v = M.tab[ti].celule[+td.getAttribute('data-r')][+td.getAttribute('data-c')];
        M.cel = { t: ti, r: +td.getAttribute('data-r'), c: +td.getAttribute('data-c'), a: numarClic > 1 ? 0 : v.length, f: v.length };
        H.rupe();
        actualizeaza();
        return 'selectie';
      }
      /* clic pe o imagine: imaginea aleasă aduce fila contextuală Picture Format (CONVENTIE_ARBORE.md §4.5) */
      if (tg.closest('[data-lh-tinta="imagine"]')) { contextActiv = 'imagine'; M.cel = null; deseneazaFile(); actualizeaza(); return 'selectie'; }
      if (contextActiv === 'imagine') contextActiv = null;
      const pos = clamp(pozDinPunct(e.clientX, e.clientY));
      if (M.cel) M.cel = null;
      H.rupe();
      M.fmtIns = null;
      if (numarClic === 1 && e.shiftKey) { M.sel = { a: M.sel.a, f: pos }; actualizeaza(); ancora = null; return 'selectie'; }
      if (numarClic === 1 && areSel()) {
        const a = selMin(), b = selMax();
        if ((pos >= a && pos < b) || (a === b - 1 && pos === a)) { ancora = { mutare: true }; return 'tragere'; }
      }
      if (numarClic === 2) { const w = cuvantCuSpatii(pos); M.sel = { a: w.a, f: w.b }; ancora = { cuvant: w }; }
      else if (numarClic === 3) { const i = loc(pos).i, s0 = inceput(i); M.sel = { a: s0, f: s0 + M.P[i].t.length + 1 }; ancora = null; }
      else { M.sel = { a: pos, f: pos }; ancora = { pos }; }
      actualizeaza();
      return 'selectie';
    };
    I.la.misca = (e, j) => {
      if (j.fel !== 'selectie' || !ancora || ancora.mutare || M.cel) return;
      const pos = clamp(pozDinPunct(e.clientX, e.clientY));
      if (ancora.cuvant) {
        const w = ancora.cuvant, x = cuvantCuSpatii(pos);
        M.sel = pos >= w.a ? { a: w.a, f: Math.max(w.b, x.b) } : { a: w.b, f: x.a };
      } else {
        const p0 = ancora.pos;
        const w0 = cuvantLa(p0), w1 = cuvantLa(pos);
        /* Word selectează cuvinte întregi când tragerea trece de primul cuvânt (opțiunea implicită „automatically select entire word”) */
        if (w0 && w1 && w0.a !== w1.a && !w0.simplu && !w1.simplu) {
          if (pos > p0) { const x = cuvantCuSpatii(pos); M.sel = { a: w0.a, f: x.b }; }
          else M.sel = { a: w0.b, f: w1.a };
        } else M.sel = { a: p0, f: pos };
      }
      actualizeaza();
    };
    I.la.sus = (e, j, g) => {
      if (g === 'tragere' && ancora && ancora.mutare) {
        ancora = null;
        if (!eInDocument(document.elementFromPoint(e.clientX, e.clientY) || zona)) return 'fara_efect';
        const r = muta(clamp(pozDinPunct(e.clientX, e.clientY)));
        actualizeaza();
        return r;
      }
      if (j && j.fel === 'tragere' && ancora && ancora.mutare && !g) {   // apăsare în selecție fără tragere: cursorul acolo
        ancora = null;
        const pos = clamp(pozDinPunct(e.clientX, e.clientY));
        M.sel = { a: pos, f: pos };
        actualizeaza();
      }
      if (g === 'selectie') return 'selectare';
      return null;
    };
    I.la.clic = (tinta, e, n) => {
      const tg = e.target;
      if (eInDocument(tg) && !dialog && !backstage && !M.deschis) return 'fara_efect';
      if (eInDocument(tg) && !dialog && !backstage) return numarClic >= 3 ? 'selectare_paragraf' : numarClic === 2 ? 'selectare_cuvant' : 'pozitionare';
      const elx = tg.closest('[data-lh-tinta]');
      if (!elx || !root.contains(elx)) return null;
      const [fel] = tinta.split(':');
      const v = tinta.slice(fel.length + 1);
      if (fel === 'fila') {
        if (v === 'File') { deschideBackstage('Home'); return 'backstage'; }
        const id = elx.getAttribute('data-lh-id-mso');
        if (backstage) inchideBackstage();
        return activeazaFila(id) ? 'fila' : I.nesimulat(v);
      }
      if (fel === 'backstage') {
        const n2 = elx.__nod || {};
        if (elx.__fisier) return deschideFisier(elx.__fisier);
        if (n2.id === 'FileTabButton' || v === 'Back') { inchideBackstage(); return 'inapoi'; }
        /* File › Save As › Browse → fereastra Save As (support.microsoft.com/en-us/office/collab-files/save-your-files) */
        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat(v);
        /* File › Open › Browse → fereastra Windows Open (uia_word.json › dialog.open › deschis_prin: „Backstage › Open ›
           Browse deschide aceeași fereastră”) — critic runda 4, GRAV N4 */
        if (v === 'Browse' && backstage && backstage.pagina === 'Open' && !p2007) return deschideDialog('dialog.open') ? 'deschidere_fereastra_open' : I.nesimulat(v);
        /* File › Home / New › Blank document = document nou (lecția m1-l03:116; fapte.g_file_document_nou) — GRAV T5 */
        if (v === 'Blank document') { inchideBackstage(); return documentNou(); }
        if (elx.closest('[data-lh-suprafata="backstage.nav"],[data-lh-suprafata="backstage.cadru"]') && n2.t === 'ListItem') {
          if (n2.a === 0) return 'indisponibil';
          if (v === 'Save') return arataPaginaBackstage('Save As') ? 'pagina_backstage' : I.nesimulat(v);
          return arataPaginaBackstage(v) ? 'pagina_backstage' : I.nesimulat(v);
        }
        return I.nesimulat(v);
      }
      if (dialog && (dialog.baza === SALVARE_NOUA || dialog.baza === INTREBARE_INCHIDERE)) {
        if (dialog.baza === INTREBARE_INCHIDERE && fel === 'fereastra' && M.intrebare) M.intrebare.apasat = v;
        /* „More options…” → pagina File › Save As (acoperire_r3.fapte.a_ctrl_s_document_nou.more_save_options.backstage) */
        if (v === 'More options…' && dialog.baza === SALVARE_NOUA) { inchideDialog(); deschideBackstage('Save As'); return 'pagina_backstage'; }
        /* „Choose a Location” ▾ și caseta mică Save as type: rândurile listelor lor nu sunt în referință → mesajul central */
        if (fel === 'fereastra' && v === 'Open') return I.nesimulat('Choose a Location ▾');
        if (fel === 'camp' && v === 'tip_fisier') return I.nesimulat('Save as type ▾');
        if (dialog.baza === INTREBARE_INCHIDERE && fel === 'fereastra') {
          /* scenarii_real/word-x-nesalvat-cancel.json: Cancel → documentul rămâne; word-ctrl-w-nu-salva.json: Don't Save →
             documentul se închide nesalvat; Save → salvat, apoi închis (numele din File name) */
          if (v === 'Cancel' || v === 'Închidere') { inchideDialog(); return 'anulare'; }
          if (v === "Don't Save") { const cum = M.dupaInchidere; inchideDialog(); return inchideDocument(cum, 'inchidere_fara_salvare'); }
          if (v === 'Save') { const cum = M.dupaInchidere, r = salveaza(); return r === 'salvare' ? inchideDocument(cum, 'salvare_si_inchidere') : r; }
          return I.nesimulat(v);   // More options… aici: efectul nu e în referință (AC-5)
        }
      }
      /* fereastra Open (uia_word.json › dialog.open; Ctrl+F12 / File › Open › Browse) — critic runda 4, GRAV N4 + T4 */
      if (dialog && dialog.baza === 'dialog.open') {
        if (fel === 'lista' && elx.__fisier) { alegeRandOpen(elx); return 'selectare'; }
        if (fel === 'arbore') return elx.__folder ? navigheaza(elx.__folder) : I.nesimulat(v);
        if (fel === 'fereastra' && v === 'Open') return deschideDinOpen(valoareCamp('camp:nume_fisier'));
        if (fel === 'fereastra' && /^(Cancel|Închidere)$/.test(v)) { inchideDialog(); return 'anulare'; }
        if (fel === 'camp' && v === 'nume_fisier') return 'camp';
        if (fel === 'camp') return I.nesimulat(v + ' ▾');
        return I.nesimulat(v || tinta);
      }
      if (fel === 'fila_dialog' && dialog) { dialog.cheiePlasa = null; arataFilaDialog(v === (date.dialoguri[dialog.baza].file[0].fila || null) ? null : (date.dialoguri[dialog.baza].file.some(f => f.fila === v) ? v : null)); return 'fila_dialog'; }
      if (fel === 'dialog_salvare' && dialog) return v === 'Save' ? salveaza() : (inchideDialog(), 'anulare');
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && fel === 'arbore' && elx.__folder) return navigheaza(elx.__folder);
      if (dialog && dialog.desen === 'dialog.FileSaveAs_pdf' && fel === 'fereastra') {
        const tn = (elx.__nod || {}).t;
        if (tn === 'CheckBox' || tn === 'RadioButton') return comutaCaseta(elx, tn);
      }
      /* caseta „Save as type:” (camp:tip_fisier) sau săgeata ei → lista din referință (uia_word.json › lista.FileSaveAs_tip:
         17 rânduri, sub casetă, cât ea de lată) — critic runda 3, GRAV A1 */
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && (fel === 'fereastra' || fel === 'meniu_derulant' || fel === 'camp')) {
        const cb = elx.closest('[data-lh-tip="ComboBox"]');
        if (cb && /^Save as type/.test(cb.getAttribute('data-lh-eticheta') || '')) return listaTip(cb) || 'meniu_tip_fisier';
      }
      if (fel === 'fereastra' && dialog) {
        if (/^(OK|Insert)$/.test(v)) return implicitDialog();
        if (/^(Cancel|Închidere|Close)$/.test(v)) { inchideDialog(); return 'anulare'; }
        return I.nesimulat(v);
      }
      if (fel === 'camp') return 'camp';
      if (dialog && dialog.strat.contains(elx)) return I.nesimulat(v);
      if (fel === 'zoom') return zoomClic(elx, e, v);
      if (fel === 'bara_derulare') { zona.scrollBy({ top: v === 'Line up' ? -40 : v === 'Line down' ? 40 : zona.clientHeight * 0.9 }); return 'derulare'; }
      /* fără document, comenzile panglicii n-au pe ce lucra: mesajul central, nu tăcere (R12; critic runda 4, GRAV T5) */
      if (fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return M.deschis ? apasa(elx, tinta) : I.nesimulat(String((elx.__nod || {}).e || v).replace(/^.*\//, '') || tinta);
      /* ✕ al ferestrei Word = Ctrl+W pe document (acoperire_r3.fapte.b_x_la_fel_ca_ctrl_w: true) — critic runda 3, GRAV N4 */
      if (fel === 'bara_titlu' && v === 'Close') return cerereInchidere('x');
      return I.nesimulat(v || tinta);
    };
    I.la.dublu = tinta => {
      /* dublu clic pe un fișier din fereastra Open = Open (rândul ales + butonul implicit) */
      if (dialog && dialog.baza === 'dialog.open' && /^lista:/.test(tinta || '')) return deschideDinOpen(tinta.slice(6));
      return /^text:|^document/.test(tinta || '') ? 'selectare_cuvant' : null;
    };
    I.la.dreapta = (tinta, e) => {
      if (dialog || backstage || !M.deschis) return null;
      if (eInDocument(e.target)) return meniuContextual(e.clientX, e.clientY);
      return null;
    };
    function zoomClic(elx, e, v) {
      if (v === 'Zoom Out') M.zoom = Math.max(10, M.zoom - 10);
      else if (v === 'Zoom In') M.zoom = Math.min(500, M.zoom + 10);
      else if (elx.getAttribute('data-lh-tip') === 'Slider' || elx.closest('[data-lh-tip="Slider"]')) {
        const s = elx.closest('[data-lh-tip="Slider"]') || elx, r = s.getBoundingClientRect();
        const f = (e.clientX - r.left) / r.width;
        M.zoom = Math.round(f <= 0.5 ? 10 + f * 2 * 90 : 100 + (f - 0.5) * 2 * 400);
        if (Math.abs(M.zoom - 100) < 8) M.zoom = 100;
      } else return I.nesimulat('Zoom');
      actualizeaza();
      return 'zoom';
    }
    I.la.zoomRotita = e => { M.zoom = Math.max(10, Math.min(500, M.zoom + (e.deltaY < 0 ? 10 : -10))); actualizeaza(); return 'zoom'; };

    /* ---- tastele */
    function muta1(dir, extinde, cuvant) {
      if (M.cel) {
        const v = celulaText();
        let p = Math.max(0, Math.min(v.length, M.cel.f + dir));
        M.cel = Object.assign({}, M.cel, { f: p, a: extinde ? M.cel.a : p });
        return 'cursor';
      }
      let p;
      if (!extinde && areSel()) p = dir < 0 ? selMin() : Math.min(selMax(), maxCaret());
      else if (cuvant) {
        p = M.sel.f;
        const tot = textIntre(0, lungime());
        if (dir > 0) { while (p < maxCaret() && LIT.test(tot[p])) p++; while (p < maxCaret() && !LIT.test(tot[p])) p++; }
        else { while (p > 0 && !LIT.test(tot[p - 1])) p--; while (p > 0 && LIT.test(tot[p - 1])) p--; }
      } else p = clamp(M.sel.f + dir);
      M.sel = { a: extinde ? M.sel.a : p, f: p };
      H.rupe();
      return extinde ? 'selectare' : 'cursor';
    }
    function mutaRand(dir, extinde) {
      const r = rectPozitie(M.sel.f);
      if (!r) return 'cursor';
      /* rândul de dedesubt / deasupra: caut în jos (sau în sus) până găsesc altă poziție (sare și peste spațiul dintre paragrafe) */
      let p = M.sel.f;
      for (const k of [0.6, 1.2, 1.9, 2.7, 3.6]) {
        const q = clamp(pozDinPunct(r.x + 1, dir < 0 ? r.y - r.h * k : r.y + r.h * (1 + k)));
        if (dir < 0 ? q < M.sel.f : q > M.sel.f) { p = q; break; }
      }
      M.sel = { a: extinde ? M.sel.a : p, f: p };
      H.rupe();
      return 'cursor';
    }
    function capRand(fin, extinde) {
      const l = loc(M.sel.f), s0 = inceput(l.i);
      const r = rectPozitie(M.sel.f), pe = corp.querySelector('[data-lh-tinta="text"][data-lh-id="' + (l.i + 1) + '"]');
      let p = fin ? s0 + M.P[l.i].t.length : s0;
      if (r && pe && M.P[l.i].t.length) {
        const pr = pe.getBoundingClientRect();
        const q = pozDinPunct(fin ? pr.right - 2 : pr.left + 1, r.y + r.h / 2);
        if (loc(q).i === l.i) p = q;
      }
      M.sel = { a: extinde ? M.sel.a : p, f: p };
      H.rupe();
      return 'cursor';
    }
    const NESIM_TASTE = { ctrl_f: 'Ctrl+F', ctrl_h: 'Ctrl+H', ctrl_m: 'Ctrl+M', ctrl_o: 'Ctrl+O',
      ctrl_p: 'Ctrl+P', ctrl_q: 'Ctrl+Q', ctrl_shift_m: 'Ctrl+Shift+M' };
    I.la.tasta = (e, g, inCamp) => {
      /* Enter într-o fereastră apasă butonul ei implicit: Save (Save As, „Save this file”, „Save your changes…”) */
      const activatEnter = () => !dialog ? null : (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) ? 'dialog_salvare:Save' :
        dialog.baza === INTREBARE_INCHIDERE ? 'fereastra:Save' : dialog.baza === 'dialog.open' ? 'fereastra:Open' : null;
      /* o listă deschisă (Font Size, Save as type) ia săgețile, Enter și Esc înaintea casetei și a ferestrei */
      const rl = tastaLista(e);
      if (rl) return rl;
      if (inCamp) {
        if (dialog && e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return marimeScrisa(e.target); }
        /* Alt+↓ deschide lista casetei (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-
           afb2-f762f663ceb2: „Open the menu for the selected button. | Alt+Down arrow key”); rândurile ei: uia_word.json ›
           lista.FontSize. În Save As, caseta Save as type are același gest (referința: Button „Deschidere”, tasta_acces
           „Alt+Săgeată în jos”) — critic runda 3, GRAV 3 / A1 */
        if (e.key === 'ArrowDown' && e.altKey && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return listaMarimi(e.target.closest('[data-lh-id-mso="FontSize"]')) || 'lista_marimi'; }
        if (e.key === 'ArrowDown' && e.altKey && dialog && dialog.baza === 'dialog.FileSaveAs' && e.target.closest && e.target.closest('[data-lh-tinta="camp:tip_fisier"]')) { e.preventDefault(); return listaTip(e.target.closest('[data-lh-tinta="camp:tip_fisier"]')) || 'meniu_tip_fisier'; }
        /* Enter într-un câmp al ferestrei = butonul ei implicit (Save: uia_word.json › dialog.FileSaveAs, Button „Save”
           id_win32 1 = IDOK); evenimentul spune ce s-a apăsat (activat), ținta rămâne focusul (§4) — critic runda 2, N2 */
        if (dialog && e.key === 'Enter' && dialog.strat.contains(e.target)) {
          e.preventDefault();
          if (activatEnter()) I.activat = activatEnter();
          return implicitDialog();
        }
        return null;
      }
      if (dialog) {
        if (e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter') { e.preventDefault(); if (activatEnter()) I.activat = activatEnter(); return implicitDialog(); }
        return 'fara_efect';
      }
      if (meniu && e.key === 'Escape') { inchideMeniu(); return 'inchidere_meniu'; }
      if (strat && strat.contextual && e.key === 'Escape') { inchideMeniuContextual(); return 'inchidere_meniu'; }
      if (backstage) { if (e.key === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }
      /* fără document (Ctrl+W → Don't Save) tastele nu au unde scrie; Ctrl+O deschide pagina Open */
      /* fără document (Ctrl+W → Don't Save): tastarea și navigarea n-au unde ajunge; Ctrl+O, Ctrl+N, Ctrl+F12 merg ca de
         obicei; celelalte comenzi dau mesajul central, nu tac (R12; critic runda 4, GRAV T5) */
      if (!M.deschis && g !== 'ctrl_o' && g !== 'ctrl_n' && !(g === 'tasta_f12' && e.ctrlKey)) {
        actualizeaza();
        if (M.inchisApp || /^(tastare|sageti|alt_sageti|tasta_(enter|backspace|delete|tab|home_end|pagina|esc|windows))$/.test(g)) return 'fara_efect';
        return I.nesimulat(numeTasta(e));
      }
      let r = null;
      const sh = e.shiftKey;
      switch (g) {
        case 'tastare': e.preventDefault(); r = scrie(e.key, true); break;
        case 'tasta_enter': e.preventDefault(); r = e.ctrlKey ? I.nesimulat('Ctrl+Enter') : enter(); break;
        case 'tasta_backspace': e.preventDefault(); r = backspace(); break;
        case 'tasta_delete': e.preventDefault(); r = del(); break;
        case 'tasta_tab': e.preventDefault(); r = M.cel ? tabInTabel(sh) : scrie('\t', false); break;
        case 'sageti':
          e.preventDefault();
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') r = muta1(e.key === 'ArrowLeft' ? -1 : 1, sh, e.ctrlKey);
          else r = M.cel ? 'cursor' : mutaRand(e.key === 'ArrowUp' ? -1 : 1, sh);
          break;
        case 'tasta_home_end':
          e.preventDefault();
          if (e.ctrlKey && !M.cel) { const q = e.key === 'Home' ? 0 : maxCaret(); M.sel = { a: sh ? M.sel.a : q, f: q }; H.rupe(); r = 'cursor'; }
          else r = M.cel ? muta1(e.key === 'Home' ? -999 : 999, sh) : capRand(e.key === 'End', sh);
          break;
        case 'tasta_pagina': e.preventDefault(); zona.scrollBy({ top: (e.key === 'PageUp' ? -1 : 1) * zona.clientHeight * 0.9 }); r = 'derulare'; break;
        /* support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2 (citit 19.11.2026):
           „Ctrl+F12: displays the Open dialog box.” (= uia_word.json › acoperire_r3.fapte.d_ctrl_f12, titlul „Open”);
           „Shift+F12: saves the document.”; „F12 alone: displays the Save As dialog box.” — critic runda 4, GRAV T4 */
        case 'tasta_f12':
          e.preventDefault();
          if (e.ctrlKey) r = M.inchisApp ? 'fara_efect' : p2007 ? I.nesimulat('Ctrl+F12') : deschideDialog('dialog.open') ? 'deschidere_fereastra_open' : I.nesimulat('Ctrl+F12');
          else if (e.shiftKey) r = M.salvat ? salveazaPeLoc() : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Shift+F12'));
          else r = deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : null;
          break;
        case 'ctrl_a': M.cel = null; M.sel = { a: 0, f: lungime() }; H.rupe(); r = 'selectare_tot'; break;
        case 'ctrl_b': r = comuta('b'); break;
        case 'ctrl_i': r = comuta('i'); break;
        case 'ctrl_u': r = comuta('u'); break;
        case 'ctrl_e': r = aliniaza('centru'); break;
        case 'ctrl_l': r = aliniaza('stanga'); break;
        case 'ctrl_r': r = aliniaza('dreapta'); break;
        case 'ctrl_j': r = aliniaza('stanga-dreapta'); break;
        case 'ctrl_z': r = anuleaza(); break;
        case 'ctrl_y': r = reface(); break;
        case 'ctrl_c': r = copiaza(); break;
        case 'ctrl_x': r = decupeaza(); break;
        case 'ctrl_v': r = lipeste(false); break;
        /* support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2:
           Ctrl+D „Display the Font dialog box.”, Ctrl+Shift+V „Paste text only.”, Ctrl+S „Save the document.” */
        case 'ctrl_d': r = deschideDialog('dialog.FontDialog') ? 'dialog_font' : null; break;
        case 'ctrl_shift_v': r = lipeste(true); break;
        /* un document deja salvat se salvează sub numele lui, fără alți pași; la prima salvare: „depending on the Word version,
           the Save As or Save this file window appears” (support.microsoft.com/en-au/word/word-for-new-users); în Word M365
           „press CTRL+S to open the Save this file dialog box” (support.microsoft.com/en-US/Office/collab-files/
           save-office-files-to-your-favorite-folder). Profilul word2007 (Word 2007 nu are „Save this file”) → Save As. */
        case 'ctrl_s': r = M.salvat ? salveazaPeLoc() : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Ctrl+S')); break;
        /* support.microsoft.com/en-us/office/open-files-from-the-file-menu-97f087d8-3136-4485-8e86-c5b12a8c4176: „select
           File > Open, select the Open icon, or press CTRL+O” → pagina Open din Backstage (uia_word.json › backstage.Open).
           Word 2007 n-are Backstage, iar fereastra Open nu are referință → mesajul central (critic runda 2, GRAV N4) */
        case 'ctrl_o': if (p2007) r = I.nesimulat('Ctrl+O'); else { deschideBackstage('Open'); r = 'backstage'; } break;
        /* Ctrl+W: „Close the document. | Ctrl+W” (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-
           7142-4b50-afb2-f762f663ceb2); modificat → „Save your changes to this file?” (scenarii_real/word-ctrl-w-nesalvat.json) */
        case 'ctrl_n': r = documentNou(); break;
        case 'ctrl_w': r = cerereInchidere('ctrlw'); break;
        case 'tasta_esc': r = 'fara_efect'; break;
        case 'tasta_windows': r = 'fara_efect'; break;
        default:
          if (NESIM_TASTE[g]) r = I.nesimulat(NESIM_TASTE[g]);
          else if (/^ctrl_/.test(g)) r = 'fara_efect';
      }
      actualizeaza();
      return r;
    };
    /* textul venit pe calea „input” (telefon, IME): același AutoCorect ca pe tastatura fizică (scenarii_real/
       word-tastare-majuscula-automata.json), mai puțin lipirea / plasarea (critic runda 1, GRAV 6). Cu Backstage sau o
       fereastră deschisă, documentul nu se vede și nu se schimbă (GRAV 2). */
    I.la.text = (v, info) => {
      if (dialog || backstage || !M.deschis) return 'fara_efect';
      const r = scrie(v, !/^insertFrom(Paste|Drop)/.test((info && info.tip) || ''));
      actualizeaza();
      return r;
    };
    I.la.sterge = g => {
      if (dialog || backstage || !M.deschis) return 'fara_efect';
      const r = g === 'tasta_backspace' ? backspace() : del();
      actualizeaza();
      return r;
    };

    /* ---- tastele de acces ale ferestrelor (Alt + litera): din referință (tasta_acces) — „Save your changes…”: Save „ALT+S”,
       Don't Save „ALT+n”; „Save this file”: Save „ALT+S”; Save As: File name „ALT+n”, Save as type „ALT+t”, Save „Alt+s”.
       Butonul se apasă (ca la clic), caseta primește focusul. Un eveniment tasta_acces (§4) cu ținta comenzii. Unghiul
       gest_tastatura, runda 4. */
    root.addEventListener('keydown', e => {
      if (!dialog || !dialog.el || !e.altKey || e.ctrlKey || e.metaKey || !/^Key[A-Z]$/.test(e.code || '')) return;
      const re = new RegExp('^alt\\+' + e.code.slice(3) + '$', 'i');
      const cand = [...dialog.el.querySelectorAll('*')].filter(x => x.__nod && re.test(x.__nod.ta || '') && L._vizibil(x));
      const APASA = ['Button', 'SplitButton', 'CheckBox', 'RadioButton'];   // T3: Alt+E/A/M/O în zona PDF; N4: Alt+O = Open
      const x = cand.find(c => APASA.indexOf(c.__nod.t) >= 0) || cand.find(c => c.__nod.t === 'ComboBox' || c.__nod.t === 'Edit');
      if (!x) return;
      e.preventDefault();
      e.stopPropagation();
      const ina = I.stare();
      let act, t;
      if (APASA.indexOf(x.__nod.t) >= 0) {
        t = L._canon(x);
        act = I.la.clic(t, { target: x, clientX: 0, clientY: 0, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, button: 0, preventDefault() {} }, 1);
        actualizeaza();
      } else {
        const i = x.querySelector('input');
        const tx = (i || x).closest('[data-lh-tinta]');
        t = tx ? L._canon(tx) : 'fereastra_app:word';
        if (i) { try { i.focus({ preventScroll: true }); i.select(); } catch (z) { /* */ } }
        act = 'focus_camp';
      }
      I.emite('tasta_acces', act || 'tasta_acces', t, ina);
    }, true);
    /* ---- tastele de acces (KeyTips): Alt apăsat și eliberat arată literele de pe file, apoi pe comenzile filei.
       Literele vin din referință (uia_word.json › tasta_acces, ex. Home „Alt, H”, Bold „Alt, H, 1”). */
    /* kt.cale = literele apăsate deja (ex. ['F', 'A'] după Alt, F, A); fiecare nivel arată tastele elementelor care au
       aceeași cale în referință (Home „Alt, H”, Bold „Alt, H, 1”, Save As „Alt, F, A”, Browse „Alt, F, A, O”) */
    const kt = { activ: false, cale: [], prefix: '', insigne: [] };
    function ktCurata() { kt.insigne.forEach(x => x.remove()); kt.insigne = []; }
    function ktIesi() { ktCurata(); kt.activ = false; kt.cale = []; kt.prefix = ''; }
    function ktTinte(cale) {
      cale = cale || kt.cale;
      const R = root.getBoundingClientRect(), out = [];
      /* cu Backstage deschis, doar elementele lui se văd și se pot atinge; cadrul lui (backstage.cadru) are o copie a listei
         din stânga, acoperită de lista adevărată (backstage.nav) — copia nu primește taste */
      (backstage ? backstage.strat : root).querySelectorAll('[data-lh-tip]').forEach(x => {
        const n = x.__nod;
        if (!n || !n.ta || !L._vizibil(x) || x.closest('.lh-ap-cadru')) return;
        const p = String(n.ta).split(',').map(s => s.replace(/\s+/g, ''));
        if (p[0] !== 'Alt' || p.length !== cale.length + 2) return;
        for (let i = 0; i < cale.length; i++) if (p[i + 1] !== cale[i]) return;
        out.push({ x, cheie: p[p.length - 1] });
      });
      /* o singură insignă pe literă: un buton împărțit și partea lui apăsabilă poartă aceeași tastă */
      const unic = new Map();
      out.forEach(o => { const v = unic.get(o.cheie); if (!v || (!v.x.hasAttribute('data-lh-tinta') && o.x.hasAttribute('data-lh-tinta'))) unic.set(o.cheie, o); });
      return { R, out: [...unic.values()] };
    }
    function ktArata() {
      ktCurata();
      const { R, out } = ktTinte();
      out.forEach(o => {
        if (kt.prefix && o.cheie.indexOf(kt.prefix) !== 0) return;
        const r = o.x.getBoundingClientRect(), b = el('span', 'lh-ap-keytip', { 'aria-hidden': 'true' });
        b.textContent = o.cheie;
        b.style.left = (r.left - R.left + r.width / 2) + 'px';
        b.style.top = (r.bottom - R.top - 6) + 'px';
        root.appendChild(b);
        kt.insigne.push(b);
      });
      return out;
    }
    function ktLitera(e) {
      if (!/^[a-z0-9]$/i.test(e.key)) return false;
      kt.prefix += e.key.toUpperCase();
      const { out } = ktTinte();
      const exact = out.find(o => o.cheie === kt.prefix);
      if (exact) {
        const cheie = kt.prefix;
        kt.prefix = '';
        ktCurata();
        /* o casetă (Font Size „Alt, H, F S”): tasta pune cursorul în ea, cu valoarea selectată (NEVERIFICAT: R2-5) */
        const camp = exact.x.matches('input:not([readonly])') ? exact.x : exact.x.querySelector('input:not([readonly])');
        if (camp) {
          ktIesi();
          try { camp.focus({ preventScroll: true }); camp.select(); } catch (x) { /* */ }
          I.tastaFaraClic('camp', exact.x);
          return true;
        }
        I.activeazaTasta(exact.x, cheie);
        /* nivelul următor: ce s-a deschis are la rândul lui taste (fila Home, File → Backstage, pagina Save As) */
        const cale = kt.cale.concat([cheie]);
        if (kt.activ && ktTinte(cale).out.length) { kt.cale = cale; ktArata(); } else ktIesi();
      } else if (out.some(o => o.cheie.indexOf(kt.prefix) === 0)) { ktArata(); I.tastaFaraClic('prefix_tasta_acces'); }
      else { kt.prefix = kt.prefix.slice(0, -1); I.tastaFaraClic('fara_efect'); }
      return true;
    }
    let altSingur = false;
    root.addEventListener('keydown', e => {
      if (e.key === 'Alt') { altSingur = true; return; }
      altSingur = false;
      if (!kt.activ) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        /* Esc urcă un nivel; din Backstage (sau de pe primul nivel) iese din tastele de acces */
        if (kt.cale.length && !(backstage && kt.cale.length <= 1)) { kt.cale = kt.cale.slice(0, -1); kt.prefix = ''; ktArata(); }
        else ktIesi();
        I.tastaFaraClic('iesire_taste_acces');
        return;
      }
      ktLitera(e);
    }, true);
    root.addEventListener('keyup', e => {
      if (e.key !== 'Alt' || !altSingur) return;
      altSingur = false;
      e.preventDefault();
      if (kt.activ) { ktIesi(); I.tastaFaraClic('iesire_taste_acces'); return; }
      if (dialog || backstage) return;
      kt.activ = true;
      ktArata();
      I.tastaFaraClic('arata_taste_acces');
    });
    root.addEventListener('pointerdown', () => { if (kt.activ) ktIesi(); }, true);

    /* focusul rămâne în document când se apasă panglica (ca în Word); câmpurile dialogurilor își iau focusul */
    root.addEventListener('mousedown', e => {
      if (e.target.closest('input,textarea,select')) return;
      e.preventDefault();
    });

    /* ---- plasa oracolelor (CONVENTIE_ARBORE.md §4.6): deschide o suprafață fără gest încă */
    I.deschideSuprafata = cheie => {
      cheie = String(cheie);
      if (cheie.startsWith('panglica.')) return activeazaFila(cheie.slice(9));
      if (cheie.startsWith('panglica_context.')) {
        const id = cheie.slice(17);
        const ctx = Object.keys(date.context).find(k => date.context[k].some(x => x.id === id));
        if (!ctx) return false;
        contextActiv = ctx;
        deseneazaFile();
        return activeazaFila(id);
      }
      if (cheie.startsWith('backstage.')) { deschideBackstage(cheie === 'backstage.nav' || cheie === 'backstage.cadru' ? 'Home' : cheie.slice(10)); return true; }
      if (cheie.startsWith('dialog.') || cheie.startsWith('panou.')) {
        const [b, f] = cheie.split('#');
        const ok = deschideDialog(b, f || null);
        if (ok && f && dialog) { dialog.cheiePlasa = cheie; arataFilaDialog(f); }
        return ok;
      }
      if (cheie.startsWith('meniu_contextual.')) {
        if (cheie.endsWith('text_selectat') && !areSel()) { M.sel = { a: 0, f: Math.max(1, Math.min(M.P[0].t.length, 3)) }; actualizeaza(); }
        if (cheie.endsWith('.text') && areSel()) { M.sel = { a: 0, f: 0 }; actualizeaza(); }
        const p = corp.querySelector('[data-lh-tinta="text"]').getBoundingClientRect();
        return !!meniuContextual(p.left + 20, p.top + 8);
      }
      return false;
    };
    I.distruge = () => { inchideMeniu(); };

    deseneazaFile();
    deseneazaPanglica();
    actualizeaza();
    /* ecran îngust (telefon, I1): zoom-ul pornește la „lățimea paginii”, ca pagina să se vadă întreagă; restul interfeței
       rămâne aceeași și se derulează lateral */
    if (!scenariu) requestAnimationFrame(() => {
      const w = zona.clientWidth, pw = M.pag.latime_cm * PX_CM;
      if (w > 0 && w < pw + 48) { M.zoom = Math.max(10, Math.floor((w - 20) / pw * 100)); actualizeaza(); }
    });
  }
  function modul(n) {
    return window.LH.aplicatii._module[n];
  }
  L._modul('word', {
    creeaza,
    /* §4.4: tragerea are sens doar pe text selectat — dublu clic pe paragraful 1, apoi un clic neutru (fila deja activă),
       ca apăsarea tragerii să nu fie numărată drept al treilea clic */
    demonstratie: { tragere: { pregatire: [{ gest: 'dublu_clic', tinta: 'text:1' }, 'fila:Home'] } }
  });
})();
