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
  /* Layout › Line Spacing (lista.LineSpacingGallery din referință: „1,0 … 3,0”), Indent 1,25 cm (cerința lecțiilor vii/m1-l06 …),
     marginile din Margins (lista.PageMarginsGallery: Normal/Narrow/Moderate/Wide/Mirrored; valorile Word în cm) */
  const INTERLINII = [['1,0', 1], ['1,15', 1.15], ['1,5', 1.5], ['2,0', 2], ['2,5', 2.5], ['3,0', 3]];
  const PAS_RETRAGERE = 1.25;
  const MARGINI_WORD = {
    'Normal Margins': { sus: 2.54, jos: 2.54, stanga: 2.54, dreapta: 2.54 },
    'Narrow Margins': { sus: 1.27, jos: 1.27, stanga: 1.27, dreapta: 1.27 },
    'Moderate Margins': { sus: 2.54, jos: 2.54, stanga: 1.91, dreapta: 1.91 },
    'Wide Margins': { sus: 2.54, jos: 2.54, stanga: 5.08, dreapta: 5.08 },
    /* Mirrored: interior 3,18 / exterior 2,54. Modelul n-are pagini oglindite: interiorul e tratat ca stânga [presupus] */
    'Mirrored Margins': { sus: 2.54, jos: 2.54, stanga: 3.18, dreapta: 2.54 } };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const egal = (a, b) => a === b || (!!a && !!b && a.b === b.b && a.i === b.i && a.u === b.u && a.sz === b.sz);
  const ALINIERI = { left: 'stanga', center: 'centru', right: 'dreapta', justify: 'stanga-dreapta' };
  /* stilul propriu al lui Word (doar sub [data-lh-aplicatie="word"], ca explorer.js / windows.js; aplicatii.css rămâne comun):
     - copiii unei casete cu chenar din panglică (Font, Font Size: Edit + butonul ▾) se așază față de colțul casetei, nu față de
       interiorul chenarului de 1 px: erau la +1 / +1 față de casetă și +3 / +3 față de fereastră (critic 24, MINOR 1;
       referinte/uia_word.json › panglica.TabHome › Font: ComboBox [105,91], Edit [106,93], Open [216,92]);
     - antetul unui grup din meniu (Pictures › „Insert Picture From”, capturi_word_brut.json): bandă gri, text îngroșat
       [presupus] R28-2 (UI Automation dă doar numele grupului, nu aspectul) */
  const STIL_WORD = '[data-lh-aplicatie="word"] [data-lh-suprafata^="panglica."] .lh-ap-t-ComboBox>.lh-ap-n{margin:-1px 0 0 -1px}' +
    '[data-lh-aplicatie="word"] .lh-ap-meniu-antet{padding:4px 12px;margin-bottom:2px;background:#f3f2f1;color:#323130;font-weight:600;font-size:12px;cursor:default}' +
    /* banda C, runda 1c: bara Acces rapid în bara de titlu (word-F099/F100) și rândurile panourilor Clipboard / Styles (F102) [presupus aspectul] */
    '[data-lh-aplicatie="word"] .lh-ap-qat{position:absolute;left:44px;top:8px;height:32px;display:flex;gap:2px;align-items:center;z-index:2}' +
    '[data-lh-aplicatie="word"] .lh-ap-qat-btn{position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;color:#323130}' +
    '[data-lh-aplicatie="word"] .lh-ap-qat-btn:hover{background:rgba(0,0,0,.06)}' +
    '[data-lh-aplicatie="word"] .lh-ap-qat-btn[aria-disabled="true"]{color:#a19f9d;cursor:default}' +
    '[data-lh-aplicatie="word"] .lh-ap-panou-rand{position:relative;display:block;padding:5px 8px;font-size:12px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '[data-lh-aplicatie="word"] .lh-ap-panou-rand:hover,[data-lh-aplicatie="word"] .lh-ap-panou-rand.lh-ap-ales{background:#e1dfdd}' +
    '[data-lh-aplicatie="word"] .lh-ap-prev-foaie{background:#fff;color:#000;font:11pt Calibri,Carlito,sans-serif;box-shadow:0 0 0 1px #c6c6c6}' +
    '[data-lh-aplicatie="word"] .lh-ap-prev-foaie .lh-ap-par::after{content:none}' +
    '[data-lh-aplicatie="word"] .lh-ap-prev-nr{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px}' +
    '[data-lh-aplicatie="word"].lh-ap-in-backstage .lh-ap-loc-panglica,[data-lh-aplicatie="word"].lh-ap-in-backstage [data-lh-suprafata="file_panglicii"]{visibility:hidden}' +
    '[data-lh-aplicatie="word"] .lh-ap-bara-protejat{position:absolute;left:0;right:0;top:0;height:32px;z-index:3;display:flex;align-items:center;gap:10px;padding:0 12px;background:#fff4ce;border-bottom:1px solid #e1c870;font-size:12px;color:#323130;white-space:nowrap;overflow:hidden}' +
    '[data-lh-aplicatie="word"] .lh-ap-bara-protejat .lh-ap-text{overflow:hidden;text-overflow:ellipsis;flex:1}' +
    '[data-lh-aplicatie="word"] .lh-ap-bara-protejat-btn{position:relative;flex:none;padding:3px 10px;border:1px solid #8a8886;border-radius:2px;background:#fff;cursor:pointer}' +
    '[data-lh-aplicatie="word"].lh-ap-web .lh-ap-foaie{width:auto!important;min-height:0!important;box-shadow:none!important;margin:0!important}' +
    '[data-lh-aplicatie="word"].lh-ap-citire .lh-ap-loc-panglica,[data-lh-aplicatie="word"].lh-ap-citire [data-lh-suprafata="file_panglicii"]{visibility:hidden}' +
    '[data-lh-aplicatie="word"] .lh-ap-bara-citire{position:absolute;left:0;right:0;top:0;height:30px;z-index:3;display:flex;align-items:center;gap:4px;padding:0 8px;background:#fff;border-bottom:1px solid #e1dfdd;font-size:13px;color:#323130}' +
    '[data-lh-aplicatie="word"] .lh-ap-citire-btn{position:relative;padding:4px 10px;border-radius:2px;cursor:pointer}' +
    '[data-lh-aplicatie="word"] .lh-ap-citire-btn:hover{background:#f3f2f1}' +
    '[data-lh-aplicatie="word"].lh-ap-citire .lh-ap-zona-pane{top:30px}' +
    '[data-lh-aplicatie="word"] .lh-ap-rigla{position:absolute;z-index:2;background:#e1dfdd;pointer-events:auto}' +
    '[data-lh-aplicatie="word"] .lh-ap-rigla-o{top:0;left:18px;right:17px;height:18px;border-bottom:1px solid #c8c6c4}' +
    '[data-lh-aplicatie="word"] .lh-ap-rigla-v{left:0;top:18px;bottom:0;width:18px;border-right:1px solid #c8c6c4}' +
    '[data-lh-aplicatie="word"] .lh-ap-panou-gol{padding:8px;font-size:12px;color:#605e5c}' +
    '[data-lh-aplicatie="word"] [data-lh-tip="List"]:has(>.lh-ap-panou-rand),[data-lh-aplicatie="word"] [data-lh-tip="List"]:has(>.lh-ap-panou-gol){overflow:auto}';
  function stilWord() {
    if (document.getElementById('lh-ap-word-css')) return;
    const s = document.createElement('style');
    s.id = 'lh-ap-word-css';
    s.textContent = STIL_WORD;
    document.head.appendChild(s);
  }

  /* Ctrl+S pe un document nou (Word M365) = fereastra Office „Save this file”, desenată din referință (uia_word.json ›
     dialog.save_this_file: File name, Save as type, Choose a Location, More options…, Save, Cancel; runda `acoperire`
     18.11.2026 — închide abaterea A2-1). Ctrl+W / ✕ pe un document modificat = „Save your changes to this file?”
     (dialog.save_your_changes_to_this_file: More options…, Save, Don't Save, Cancel; scenarii_real/word-ctrl-w-*.json).
     Amândouă sunt NUIDialog: bara de titlu are doar ✕, textul mare e numele ferestrei interioare. */
  const SALVARE_NOUA = 'dialog.save_this_file';
  const INTREBARE_INCHIDERE = 'dialog.save_your_changes_to_this_file';
  const OFFICE_NUI = [SALVARE_NOUA, INTREBARE_INCHIDERE];

  function creeaza(I, c) {
    stilWord();
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
    /* ---- jurnalul gesturilor (stare().gesturi): fiecare acțiune reală a utilizatorului, în ordine. Tastarea consecutivă
       face o singură intrare (detalii = textul tastat); selecția curentă înlocuiește ultima intrare „selectie”. */
    const gesturi = [];
    function gest(tip, detalii, fuzioneaza) {
      const ultim = gesturi[gesturi.length - 1];
      if (fuzioneaza && ultim && ultim.tip === tip) ultim.detalii += String(detalii);
      else gesturi.push({ tip, detalii: String(detalii || '') });
    }
    function gestSelectie() {
      if (!areSel()) return;
      const txt = textIntre(selMin(), Math.min(selMax(), maxCaret()));
      const ultim = gesturi[gesturi.length - 1];
      if (ultim && ultim.tip === 'selectie') ultim.detalii = txt;
      else gesturi.push({ tip: 'selectie', detalii: txt });
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
      if (M.protejat) return undefined;   // PROTECTED VIEW: documentul nu se schimbă până la Enable Editing (word-F092)
      if (vedereDoc === 'Read Mode') return undefined;   // Read Mode: tastarea nu scrie (word-F093)
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
    /* Ctrl+Backspace / Ctrl+Delete: un cuvânt, cu aceleași granițe ca Ctrl+← / Ctrl+→ (muta1): înapoi până la începutul
       cuvântului dinainte (cu spațiile de după el), înainte până la începutul cuvântului următor. Cum tratează Word real
       punctuația și spațiile la aceste granițe n-avem real [presupus] R28-3. Cu selecție / în tabel: ca Backspace / Delete. */
    function stergeCuvant(dir) {
      const p = M.sel.f, tot = textIntre(0, lungime());
      let q = p;
      if (dir > 0) { while (q < maxCaret() && LIT.test(tot[q])) q++; while (q < maxCaret() && !LIT.test(tot[q]) && tot[q] !== '\r') q++; }
      else { while (q > 0 && !LIT.test(tot[q - 1]) && tot[q - 1] !== '\r') q--; while (q > 0 && LIT.test(tot[q - 1])) q--; }
      if (q === p) return dir > 0 ? del() : backspace();
      const a = Math.min(p, q), b = Math.max(p, q);
      schimba(dir > 0 ? 'stergere_inainte' : 'stergere_inapoi', () => { sterge(a, b); M.sel = { a, f: a }; });
      H.rupe();
      return 'stergere';
    }
    /* Ctrl+↑ / Ctrl+↓: începutul paragrafului curent (sau al celui dinainte, dacă ești deja la început) / al celui următor;
       la ultimul paragraf Ctrl+↓ duce la capătul lui. Regula „curent, apoi cel dinainte” [presupus] R28-3. */
    function mutaParagraf(dir, extinde) {
      const p = M.sel.f, l = loc(p), inceput = p - l.o;
      let q;
      if (dir < 0) q = l.o > 0 ? inceput : (l.i > 0 ? inceput - 1 - M.P[l.i - 1].t.length : 0);
      else q = l.i < M.P.length - 1 ? inceput + M.P[l.i].t.length + 1 : maxCaret();
      q = clamp(q);
      M.sel = { a: extinde ? M.sel.a : q, f: q };
      H.rupe();
      return extinde ? 'selectare' : 'cursor';
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
      gest('anulare', '');
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
    function marimeScrisa(inp) {
      const txt = String(inp.value).trim().replace(',', '.');
      return marimeLa(txt === '' ? NaN : Number(txt));
    }
    /* Mesajele casetei Font Size în Word (Microsoft: „Word: between 1 and 1638, in multiples of .5”): număr care nu e
       număr → „This is not a valid number.”; în afara 1…1638 → „The number must be between 1 and 1638.”. Un număr se rotunjește
       în jos la multiplul de 0,5 (13,3 → 13). Mesajul e o fereastră „Microsoft Word” cu OK; caseta rămâne cu textul scris. */
    function marimeLa(n) {
      let r = 'fara_efect';
      if (M.deschis) {
        if (!Number.isFinite(n)) return alerta('This is not a valid number.');
        if (n < 1 || n > 1638) return alerta('The number must be between 1 and 1638.');
        n = Math.floor(n * 2) / 2;
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
    /* fereastra de eroare a lui Word („Microsoft Word” + OK): Enter, Esc sau OK o închid; focusul se întoarce în document */
    function alerta(text) {
      inchideMeniu();
      const s = el('div', 'lh-ap-alerta', { role: 'alertdialog', 'aria-label': 'Microsoft Word' });
      s.style.cssText = 'position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:330px;background:#fff;border:1px solid #888;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.35);padding:14px 16px;font:13px Segoe UI,Arial,sans-serif;color:#000;z-index:60';
      s.innerHTML = '<div style="font-weight:600;margin-bottom:10px">Microsoft Word</div><div style="margin-bottom:16px">' + esc(text) +
        '</div><div style="text-align:right"><button type="button" class="lh-ap-alerta-ok" style="min-width:76px;padding:4px 10px">OK</button></div>';
      root.appendChild(s);
      const inchide = () => {
        document.removeEventListener('keydown', tasta, true);
        s.remove();
        try { I.focus(); } catch (x) { /* */ }
        actualizeaza();
      };
      const tasta = e => {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); inchide(); }
      };
      document.addEventListener('keydown', tasta, true);
      s.querySelector('.lh-ap-alerta-ok').addEventListener('click', e => { e.stopPropagation(); inchide(); });
      try { s.querySelector('.lh-ap-alerta-ok').focus(); } catch (x) { /* */ }
      return 'eroare_word';
    }
    /* ---- paragraful: retrageri (cm), spațiere înainte/după (pt), interlinie (multiplu) — par.pf, doar ce a fost setat explicit
       se desenează; valorile implicite sunt cele din Paragraph (Indents and Spacing: 0 / 0 / 0 / 8 pt / 1,08) */
    const pfDe = par => Object.assign({ il: 0, ir: 0, pl: 0, sb: 0, sa: 8, ls: 1.08 }, par.pf || {});
    function parAplica(fn) {
      const idx = paragrafeSel();
      schimba('format', () => { idx.forEach(i => { const f = pfDe(M.P[i]); M.P[i].pf = Object.assign({}, f, fn(f)); }); });
      H.rupe();
    }
    /* Increase / Decrease Indent: pas de 1,25 cm, fără retragere sub 0 */
    function indenteaza(pas) {
      parAplica(f => ({ il: Math.max(0, Math.round((f.il + pas) * 100) / 100) }));
      return pas > 0 ? 'marire_retragere' : 'micsorare_retragere';
    }
    /* Tab la începutul paragrafului = retragerea primei linii (fără selecție, cursorul în prima poziție) */
    function primaLinie() {
      parAplica(f => ({ pl: Math.round((f.pl + PAS_RETRAGERE) * 100) / 100 }));
      return 'retragere_prima_linie';
    }
    function interlinie(v) { parAplica(() => ({ ls: v })); return 'interlinie'; }
    /* Paragraph… : caseta se umple cu valorile primului paragraf selectat; OK le aplică tuturor paragrafelor selectate */
    /* câmpurile din referință au eticheta fără „:” (camp:Before text), cum o scriu și apelurile de mai jos */
    const campDialog = eticheta => {
      const x = dialog && dialog.el && dialog.el.querySelector('[data-lh-tinta="camp:' + eticheta.replace(/:$/, '') + '"] input');
      return x || null;
    };
    const fmtNumar = v => String(Math.round(v * 100) / 100).replace('.', ',');
    function paragrafDialog() {
      const idx = paragrafeSel(), f = pfDe(M.P[idx[0]] || { pf: null });
      if (!deschideDialog('dialog.ParagraphDialog')) return false;
      const pune = (eticheta, v) => { const x = campDialog(eticheta); if (x) x.value = v; };
      pune('Before text:', fmtNumar(f.il)); pune('After text:', fmtNumar(f.ir));
      pune('Special:', f.pl > 0 ? 'First line' : f.pl < 0 ? 'Hanging' : '(none)');
      pune('By:', fmtNumar(Math.abs(f.pl)));
      pune('Before:', fmtNumar(f.sb)); pune('After:', fmtNumar(f.sa));
      const ls = INTERLINII.find(x => x[1] === f.ls);
      pune('Line spacing:', f.ls === 1 ? 'Single' : f.ls === 2 ? 'Double' : f.ls === 1.5 ? '1.5 lines' : 'Multiple');
      pune('At:', fmtNumar(ls ? ls[1] : f.ls));
      return true;
    }
    function okParagraf() {
      const val = eticheta => { const x = campDialog(eticheta); return x ? x.value : ''; };
      const num = s => { const t = String(s).trim().replace(/[^\d,.-]/g, '').replace(',', '.'); const n = Number(t); return t !== '' && Number.isFinite(n) ? n : null; };
      const il = num(val('Before text:')), ir = num(val('After text:')), by = num(val('By:'));
      const sb = num(val('Before:')), sa = num(val('After:')), at = num(val('At:'));
      const sp = val('Special:').trim().toLowerCase(), ls = val('Line spacing:').trim().toLowerCase();
      const pl = by === null ? null : sp === 'first line' ? by : sp === 'hanging' ? -by : sp === '(none)' ? 0 : null;
      const lsNou = ls === 'single' ? 1 : ls === '1.5 lines' ? 1.5 : ls === 'double' ? 2 : ls === 'multiple' && at ? at : null;
      parAplica(f => {
        const o = {};
        if (il !== null && il >= 0) o.il = il;
        if (ir !== null && ir >= 0) o.ir = ir;
        if (pl !== null) o.pl = pl;
        if (sb !== null && sb >= 0) o.sb = sb;
        if (sa !== null && sa >= 0) o.sa = sa;
        if (lsNou !== null) o.ls = lsNou;
        return o;
      });
      inchideDialog();
      return 'ok_paragraf';
    }
    /* Margins: galeria (Normal/Narrow/Moderate/Wide/Mirrored) și Custom Margins (caseta Margins din Page Setup) */
    /* Page Setup (word-F070, F072, F073): filele Margins și Paper țin ce ai scris când treci de pe una pe alta (dialog.vp);
       OK verifică valorile ca Word-ul, cu mesajele lui (vechiul wordobj-hartie.js:49-52 și 234-241, probat în Word real —
       lectii/vii/m2-l09/surse.md:34): o măsură greșită = „This is not a valid measurement.”, marginile care nu lasă
       0,05 cm de text = mesajul sus/jos sau stânga/dreapta; după OK pe mesaj, fereastra rămâne deschisă */
    const CAMPURI_PAG = ['Top:', 'Bottom:', 'Left:', 'Right:', 'Width:', 'Height:'];
    const M_MASURA = 'This is not a valid measurement.';
    const M_SUS_JOS = 'The top/bottom margins are too large for the page height in some sections.';
    const M_ST_DR = 'Settings you chose for the left and right margins, column spacing, or paragraph indents are too large for the page width in some sections.';
    /* lista Size: primele 10 mărimi din Word-ul instalat (vin de la imprimantă; vechiul wordobj-hartie.js:44-46, ui_ascuns.json) */
    const HARTII = [['Letter', 21.59, 27.94], ['Legal', 21.59, 35.56], ['A4', 21, 29.7], ['A5', 14.8, 21], ['B5 (JIS)', 18.2, 25.7],
      ['Plic nr. 10', 10.48, 24.13], ['Plic DL', 11, 22], ['Carte poștală japoneză', 10, 14.8], ['A6', 10.5, 14.8], ['English Photo L', 8.89, 12.7]];
    const numeHartie = (lat, inalt) => {
      if (!(lat > 0 && inalt > 0)) return '';
      const a = Math.min(lat, inalt), b = Math.max(lat, inalt);
      const h = HARTII.find(x => Math.abs(x[1] - a) < 0.01 && Math.abs(x[2] - b) < 0.01);
      return h ? h[0] : 'Custom size';
    };
    /* o măsură scrisă: „2”, „2,5”, „2,5 cm”, „25 mm”, „72 pt”, „1"”; altceva (inclusiv „21 cm9”) = NaN.
       [DEDUS] „2.5” cu punct e primit (Word real cu setări românești îl refuză — vechiul wordobj-hartie.js:20; probele
       F068/F070 îl scriu cu punct: probe_contestate.md, runda 2c) */
    const masura = s => {
      const t = String(s == null ? '' : s).trim().toLowerCase();
      const x = /^(-?(?:\d+(?:[.,]\d*)?|[.,]\d+))\s*(cm|mm|pt|"|in)?$/.exec(t);
      if (!x) return NaN;
      const v = Number(x[1].replace(',', '.')), u = x[2] || 'cm';
      return u === 'mm' ? v / 10 : u === 'pt' ? v / 28.3465 : (u === '"' || u === 'in') ? v * 2.54 : v;
    };
    function pastreazaPagina() {
      if (!dialog || !dialog.vp) return;
      CAMPURI_PAG.forEach(k => { const x = campDialog(k); if (x) dialog.vp[k] = x.value; });
    }
    function umplePagina() {
      if (!dialog || !dialog.vp) return;
      CAMPURI_PAG.forEach(k => { const x = campDialog(k); if (x && dialog.vp[k] != null) x.value = dialog.vp[k]; });
      const ps = campDialog('Paper size:');
      if (ps) ps.value = numeHartie(masura(dialog.vp['Width:']), masura(dialog.vp['Height:']));
      /* fila Margins arată Landscape când foaia e mai lată decât înaltă (vechiul wordobj-hartie.js:16, probat) */
      const ved = masura(dialog.vp['Width:']) > masura(dialog.vp['Height:']) + 1e-9;
      if (dialog.el) dialog.el.querySelectorAll('[data-lh-tip="RadioButton"]').forEach(y => {
        const e = y.getAttribute('data-lh-eticheta');
        if (e !== 'Portrait' && e !== 'Landscape') return;
        const on = (e === 'Landscape') === ved;
        y.setAttribute('aria-checked', on ? 'true' : 'false');
        const c = y.querySelector('.lh-ap-caseta'); if (c) c.innerHTML = on ? pang.glif('punct', 12) : '';
      });
    }
    /* Page Setup › Margins › Portrait / Landscape: foaia și marginile din fereastră se rotesc ca la Layout › Orientation
       (vechiul wordobj-hartie.js:276); se aplică la OK */
    function orientarePagina(v) {
      pastreazaPagina();
      const vp = dialog.vp, w = masura(vp['Width:']), h = masura(vp['Height:']);
      if (w > 0 && h > 0 && (w > h + 1e-9) !== (v === 'Landscape')) {
        const s = vp['Top:'], j = vp['Bottom:'], st = vp['Left:'], dr = vp['Right:'];
        if (v === 'Landscape') Object.assign(vp, { 'Top:': st, 'Bottom:': dr, 'Left:': j, 'Right:': s });
        else Object.assign(vp, { 'Top:': dr, 'Bottom:': st, 'Left:': s, 'Right:': j });
        Object.assign(vp, { 'Width:': vp['Height:'], 'Height:': vp['Width:'] });
      }
      umplePagina();
      return 'alegere_optiune';
    }
    function paginaDialog(fila) {
      if (!deschideDialog('dialog.PageSetupDialog', fila || null)) return false;
      const m = M.pag.margini_cm;
      dialog.vp = { 'Top:': fmtNumar(m.sus), 'Bottom:': fmtNumar(m.jos), 'Left:': fmtNumar(m.stanga), 'Right:': fmtNumar(m.dreapta),
        'Width:': fmtNumar(M.pag.latime_cm), 'Height:': fmtNumar(M.pag.inaltime_cm) };
      umplePagina();
      return true;
    }
    function okPagina() {
      pastreazaPagina();
      const vp = dialog.vp || {}, v = {};
      for (const k of CAMPURI_PAG) {
        const n = masura(vp[k]);
        /* marginea poate fi 0, foaia nu (vechiul wordobj-hartie.js:232) */
        if (!(/^(Width|Height):$/.test(k) ? n > 0 : n >= 0)) return mesajPagina(M_MASURA, k);
        v[k] = Math.round(n * 1000) / 1000;
      }
      const lat = v['Width:'], inalt = v['Height:'];
      if (inalt - v['Top:'] - v['Bottom:'] < 0.05) return mesajPagina(M_SUS_JOS, null);
      if (lat - v['Left:'] - v['Right:'] < 0.05) return mesajPagina(M_ST_DR, null);
      inchideDialog();
      schimba('pagina', () => {
        M.pag = JSON.parse(JSON.stringify(M.pag));
        M.pag.margini_cm = { sus: v['Top:'], jos: v['Bottom:'], stanga: v['Left:'], dreapta: v['Right:'] };
        M.pag.latime_cm = lat; M.pag.inaltime_cm = inalt;
        M.pag.orientare = lat > inalt + 1e-9 ? 'vedere' : 'portret';
      });
      H.rupe();
      return 'ok_pagina';
    }
    /* Layout › Size › <mărime>: foaia își păstrează orientarea (A5 pe foaia culcată = 21 × 14,8), marginile nu se schimbă
       (vechiul wordobj-hartie.js:11-12, probat) — word-F071 */
    function marimeFoaie(w, h) {
      schimba('pagina', () => {
        M.pag = JSON.parse(JSON.stringify(M.pag));
        const ved = M.pag.orientare === 'vedere';
        M.pag.latime_cm = ved ? Math.max(w, h) : Math.min(w, h);
        M.pag.inaltime_cm = ved ? Math.min(w, h) : Math.max(w, h);
      });
      H.rupe();
      return 'marime_foaie';
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
    function copiaza(intern) {
      if (!areSel()) return 'fara_efect';
      const a = selMin(), b = Math.min(selMax(), maxCaret());
      M.clip = { text: textIntre(a, b), f: fmtIntre(a, b) };
      griComenzi();
      if (!intern) gest('copiere', '');   // decupeaza apelează copiaza(true): la decupare se notează doar „decupare”
      return 'copiere';
    }
    function decupeaza() {
      if (!areSel()) return 'fara_efect';
      copiaza(true);
      schimba('decupare', () => stergeSelectia(true));
      H.rupe();
      gest('decupare', '');
      return 'decupare';
    }
    /* „Smart cut and paste” (word365): la lipire, Word pune singur spațiul dinaintea textului lipit când acesta începe cu o
       literă / cifră și se lipește imediat după o literă, o cifră sau un semn de punctuație, la capăt de cuvânt
       (referinte/scenarii_real/word-copiere-lipire.json: „mere” lipit după „mere.” → „Ana are mere. mere”). La începutul
       paragrafului nu pune nimic, iar după textul lipit nu adaugă spațiu (word-decupare-lipire.json: „Plecăm luni.” lipit
       înaintea lui „Aduceți” → „Plecăm luni.Aduceți apă. ”). În mijlocul unui cuvânt, după spațiu sau după „(” nu se pune
       nimic: n-avem real pentru ele [presupus] R28-1. word2007 n-are real (R26O-5) → neschimbat. */
    const CAPAT_CUVANT = /[\p{L}\p{N}.,;:!?]/u;
    function spatiuInainte(pos, text) {
      if (p2007 || pos <= 0 || !LIT.test(String(text).charAt(0))) return false;
      const ina = textIntre(pos - 1, pos), dupa = pos < maxCaret() ? textIntre(pos, pos + 1) : '';
      return CAPAT_CUVANT.test(ina) && !LIT.test(dupa);
    }
    function lipeste(doarText) {
      if (!M.clip) return 'fara_efect';
      if (M.cel) return scrieCelula(M.clip.text.replace(/\r/g, ' '));
      schimba('lipire', () => {
        if (areSel()) stergeSelectia(false);
        const sp = spatiuInainte(M.sel.f, M.clip.text);
        if (sp) { const q = insereaza(M.sel.f, ' ', fmtLa(M.sel.f)); M.sel = { a: q, f: q }; }
        const pos = insereaza(M.sel.f, M.clip.text, doarText ? fmtLa(M.sel.f) : M.clip.f.map(f => f || DEF));
        M.sel = { a: pos, f: pos };
      });
      H.rupe();
      gest('lipire', M.clip.text);
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
      gest('mutare', text);
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
      const c = typeof m === 'number' ? { sus: m, jos: m, stanga: m, dreapta: m } : Object.assign({}, m);
      schimba('pagina', () => { M.pag = JSON.parse(JSON.stringify(M.pag)); M.pag.margini_cm = c; });
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
          /* marginile se rotesc cu foaia (vechiul wordobj-hartie.js:60-61, probat în Word real: sus 2, jos 1,5, stânga 3,
             dreapta 1 -> pe vedere sus 3, jos 1, stânga 1,5, dreapta 2; înapoi pe portret, invers) — word-F068 */
          const m = M.pag.margini_cm;
          M.pag.margini_cm = o === 'vedere' ? { sus: m.stanga, jos: m.dreapta, stanga: m.jos, dreapta: m.sus }
            : { sus: m.dreapta, jos: m.stanga, stanga: m.sus, dreapta: m.jos };
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
        /* jurnalul gesturilor, în ordine (copii: cine citește nu poate schimba jurnalul) */
        gesturi: gesturi.map(g => Object.assign({}, g)),
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
        tip_salvare_afisat: tipAfisatAcum(),
        /* chei noi, runda 2c (lot_6): vizualizarea (Print Layout / Web Layout / Read Mode), riglele, zoomul în % */
        vizualizare: vedereDoc,
        rigla: !!riglaVizibila,
        zoom: M.zoom
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
      text: (Array.isArray(f.text) ? f.text : [String(f.text == null ? '' : f.text)]).map(String), ...((f.internet || f.web) ? { internet: true } : {}) }; };
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
    /* documentele noi se numerotează pe sesiune: Document1, Document2, … și după ce s-au închis toate, numărul continuă (Word
       real prin COM, runde/5/critic_probe/com_r5.json › nou1_nume „Document1”, nou2_nume „Document2”,
       nou3_dupa_inchiderea_tuturor_nume „Document3”). Lecția care pornește cu un fișier salvat n-a făcut încă niciun document
       nou. Critic 5, GRAV S6 */
    let nrNou = (() => { const m = !M.salvat && /^Document(\d+)$/.exec(M.nume); return m ? +m[1] : 0; })();
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
    /* bara Acces rapid (Quick Access Toolbar): ascunsă în instanța de referință (uia_word.json › acces_rapid: afisat false);
       „Above the ribbon, on the title bar (default location)” și „Show / Hide Quick Access Toolbar” (surse_microsoft.md S3).
       Butoanele: Save, Undo, Redo / Repeat, cu numele din Word („Can't Undo”, „Can't Repeat” = uia_word.json, panglica Draw ›
       Undo; „Undo Typing” / „Redo Typing” / „Repeat Typing” = felie_a word-F100). Lot_5 word-F099 / word-F100. */
    let qatVizibil = !!date.acces_rapid_afisat;
    const QAT_ICO = {
      Save: '<path d="M4 3h10l3 3v11H4zm1.2 1.2v11.6h9.6V6.5L13.5 5.2V8H6.5V4.2zm2.5 0V6.8h4.6V4.2zM7 11h6v4H7z"/>',
      Undo: '<path d="M7.6 4.2 3.8 8l3.8 3.8.85-.85-2.35-2.35H12a3.4 3.4 0 0 1 0 6.8H9v1.2h3a4.6 4.6 0 0 0 0-9.2H6.1l2.35-2.35z"/>',
      Redo: '<path d="M12.4 4.2 16.2 8l-3.8 3.8-.85-.85 2.35-2.35H8a3.4 3.4 0 0 0 0 6.8h3v1.2H8a4.6 4.6 0 0 1 0-9.2h5.9l-2.35-2.35z"/>'
    };
    const qat = el('div', 'lh-ap-qat', { 'data-lh-tip': 'ToolBar', 'data-lh-eticheta': 'Quick Access Toolbar', role: 'toolbar', 'aria-label': 'Quick Access Toolbar' });
    const qatBtn = (cheie, fa) => {
      const b = el('div', 'lh-ap-n lh-ap-qat-btn', { 'data-lh-tip': 'Button', role: 'button', 'data-lh-qat': cheie });
      b.innerHTML = pang.svg(QAT_ICO[cheie], 16);
      b.__qat = fa;
      qat.appendChild(b);
      return b;
    };
    const QAT_SAVE = qatBtn('Save', () => (M.deschis ? (M.salvat ? salveazaPeLoc() : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Save'))) : 'indisponibil'));
    const QAT_UNDO = qatBtn('Undo', () => { const r = anuleaza(); actualizeaza(); return r; });
    const QAT_REDO = qatBtn('Redo', () => { const r = reface(); if (r && r !== 'fara_efect') gest('refacere', ''); actualizeaza(); return r; });
    qat.style.display = 'none';
    titlu.appendChild(qat);
    function numeQat(b, et) {
      b.setAttribute('data-lh-eticheta', et); b.setAttribute('aria-label', et); b.setAttribute('title', et);
      b.setAttribute('data-lh-tinta', 'bara_titlu:' + et);
    }
    function actualizeazaQat() {
      qat.style.display = qatVizibil ? '' : 'none';
      if (BTN_TITLU) BTN_TITLU.style.transform = qatVizibil ? 'translateX(112px)' : '';
      if (!qatVizibil) return;
      numeQat(QAT_SAVE, 'Save');
      /* [DEDUS] „Undo <acțiune>” doar pentru tastare (Typing); celelalte acțiuni = „Undo” simplu (de_capturat.md) */
      const tastare = H.ultimTip() === 'tastare';
      const poateU = M.deschis && H.poateAnula(), poateR = M.deschis && H.poateReface();
      numeQat(QAT_UNDO, poateU ? (tastare ? 'Undo Typing' : 'Undo') : "Can't Undo");
      numeQat(QAT_REDO, poateR ? (tastare ? 'Redo Typing' : 'Redo') : (M.deschis && M.ultima ? (M.ultima.fel === 'text' ? 'Repeat Typing' : 'Repeat') : "Can't Repeat"));
      QAT_UNDO.setAttribute('aria-disabled', poateU ? 'false' : 'true');
      QAT_REDO.setAttribute('aria-disabled', poateR || (M.deschis && M.ultima) ? 'false' : 'true');
      QAT_SAVE.setAttribute('aria-disabled', M.deschis ? 'false' : 'true');
    }
    function comutaQat() { qatVizibil = !qatVizibil; actualizeazaQat(); return qatVizibil ? 'acces_rapid_afisat' : 'acces_rapid_ascuns'; }
    const randQat = () => ({ tinta: qatVizibil ? 'Hide Quick Access Toolbar' : 'Show Quick Access Toolbar', text: qatVizibil ? 'Hide Quick Access Toolbar' : 'Show Quick Access Toolbar', fa: comutaQat });
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
    /* bara galbenă PROTECTED VIEW (lot_5 word-F092): fișierul venit de pe internet (conținutul lecției: fisiere[].internet /
       .web, ca vechiul wordfisier.js:175) se deschide doar de citit până la Enable Editing. Numele „Protected View” /
       „Enable Editing”: lectii/vi/m1-l03/surse.md:23 (aceeași bară Office, probată în PowerPoint); [DEDUS] textul din
       mijlocul barei și că Save nu salvează cât e bara (de_capturat.md) */
    const baraProt = el('div', 'lh-ap-bara-protejat', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'PROTECTED VIEW', role: 'region', 'aria-label': 'PROTECTED VIEW' });
    baraProt.innerHTML = '<b>PROTECTED VIEW</b><span class="lh-ap-text">Be careful—files from the Internet can contain viruses. Unless you need to edit, it’s safer to stay in Protected View.</span>';
    const btnProt = el('div', 'lh-ap-n lh-ap-bara-protejat-btn', { 'data-lh-tip': 'Button', 'data-lh-eticheta': 'Enable Editing', role: 'button', 'aria-label': 'Enable Editing', 'data-lh-tinta': 'bara_mesaj:Enable Editing' });
    btnProt.textContent = 'Enable Editing';
    baraProt.appendChild(btnProt);
    baraProt.style.display = 'none';
    zonaSup.appendChild(baraProt);
    /* ---- vizualizările (word-F093, F094): Print Layout (foaia), Web Layout (textul pe toată lățimea ferestrei, fără foaie),
       Read Mode (fără panglică, tastarea nu scrie, bara de sus File / Tools / View cu View › Edit Document; Esc = înapoi
       la Print Layout). Numele: lectii/vii/m1-l03/surse.md:51-53 (Read Mode, Web Layout, Edit Document; 2 pagini MS);
       [DEDUS] bara de sus a lui Read Mode (locul, File / Tools / View) — de_capturat.md, runda 2c. Vizualizarea e setare
       de vedere, nu schimbare de document: Ctrl+Z n-o vede */
    var vedereDoc = 'Print Layout';   // var: schimba() o citește și înainte de rândul ăsta (fără TDZ)
    const baraCitire = el('div', 'lh-ap-bara-citire', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'Read Mode', role: 'menubar', 'aria-label': 'Read Mode' });
    ['File', 'Tools', 'View'].forEach(n => {
      const b = el('div', 'lh-ap-n lh-ap-citire-btn', { 'data-lh-tip': 'MenuItem', 'data-lh-eticheta': n, role: 'menuitem', 'aria-label': n, 'data-lh-tinta': 'citire:' + n });
      b.textContent = n;
      baraCitire.appendChild(b);
    });
    baraCitire.style.display = 'none';
    zonaSup.appendChild(baraCitire);
    function vedere(v) {
      if (v === 'Read Mode' && !M.deschis) return 'fara_efect';
      vedereDoc = v;
      inchideMeniu();
      root.classList.toggle('lh-ap-web', v === 'Web Layout');
      root.classList.toggle('lh-ap-citire', v === 'Read Mode');
      baraCitire.style.display = v === 'Read Mode' ? '' : 'none';
      actualizeaza();
      return 'vedere';
    }
    function clicCitire(v, elx) {
      if (v === 'View') return (meniuLa(elx, [{ tinta: 'Edit Document', text: 'Edit Document', fa: () => vedere('Print Layout') }]), 'meniu_citire');
      if (v === 'File') { vedere('Print Layout'); deschideBackstage('Home'); return 'backstage'; }
      return I.nesimulat(v);
    }
    /* ---- riglele (word-F098, F103; hotărârea 5 din hotarari_dirijor.md): ascunse la pornire, View › Ruler le arată deasupra
       și la stânga documentului; a doua bifă le ascunde. Gradațiile în cm, cu zoomul, albe între margini (ca rigla
       vechiului wordobj-pagina.js:163-166). Clicul pe riglă nu face nimic: tab-urile puse cu clic pe riglă nu sunt simulate */
    var riglaVizibila = false;
    const RIGLA = 18;
    const riglaH = el('div', 'lh-ap-rigla lh-ap-rigla-o', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'Horizontal Ruler', 'aria-label': 'Horizontal Ruler' });
    const riglaV = el('div', 'lh-ap-rigla lh-ap-rigla-v', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'Vertical Ruler', 'aria-label': 'Vertical Ruler' });
    riglaH.style.display = riglaV.style.display = 'none';
    zonaSup.append(riglaH, riglaV);
    function deseneazaRigle() {
      const on = riglaVizibila && vedereDoc !== 'Read Mode' && M.deschis;
      riglaH.style.display = on ? '' : 'none';
      riglaV.style.display = on && vedereDoc === 'Print Layout' ? '' : 'none';
      zonaPane.style.top = on ? RIGLA + 'px' : '';
      zonaPane.style.left = on && vedereDoc === 'Print Layout' ? RIGLA + 'px' : '';
      if (!on) return;
      const zs = zonaSup.getBoundingClientRect(), fr = foaie.getBoundingClientRect(), cm = PX_CM * M.zoom / 100, m = M.pag.margini_cm;
      const web = vedereDoc === 'Web Layout', offH = web ? 0 : RIGLA;
      riglaH.style.left = offH + 'px';
      const x0 = fr.left - zs.left - offH, x1 = fr.right - zs.left - offH, a = x0 + (web ? 0 : m.stanga * cm), b = x1 - (web ? 0 : m.dreapta * cm);
      riglaH.style.background = 'repeating-linear-gradient(90deg,#8a8886 0 1px,transparent 1px ' + cm + 'px) ' + a + 'px 12px/100% 6px no-repeat,' +
        'linear-gradient(90deg,#e1dfdd ' + a + 'px,#fff ' + a + 'px ' + b + 'px,#e1dfdd ' + b + 'px)';
      const y0 = fr.top - zs.top - RIGLA, c = y0 + m.sus * cm, d = fr.bottom - zs.top - RIGLA - m.jos * cm;
      riglaV.style.background = 'repeating-linear-gradient(180deg,#8a8886 0 1px,transparent 1px ' + cm + 'px) 12px ' + c + 'px/6px 100% no-repeat,' +
        'linear-gradient(180deg,#e1dfdd ' + c + 'px,#fff ' + c + 'px ' + d + 'px,#e1dfdd ' + d + 'px)';
    }
    zona.addEventListener('scroll', () => { if (riglaVizibila) deseneazaRigle(); });
    /* glisorul zoomului se trage (word-F096): zoomul urmează mouse-ul / degetul cât ții apăsat, pe scara clicului (zoomClic);
       butoanele − / + din glisor rămân butoane */
    function legaGlisor(sld) {
      if (!sld || sld.__trage) return;
      sld.__trage = true;
      sld.style.touchAction = 'none';
      let trage = null;
      sld.addEventListener('pointerdown', ev => {
        if (ev.button > 0 || ev.target.closest('[data-lh-tip="Button"]')) return;
        trage = ev.pointerId;
        try { sld.setPointerCapture(ev.pointerId); } catch (x) { /* */ }
        zoomClic(sld, ev, '');
      });
      sld.addEventListener('pointermove', ev => { if (trage === ev.pointerId) zoomClic(sld, ev, ''); });
      const gata = ev => { if (trage === ev.pointerId) { trage = null; try { sld.releasePointerCapture(ev.pointerId); } catch (x) { /* */ } } };
      sld.addEventListener('pointerup', gata);
      sld.addEventListener('pointercancel', gata);
    }
    function comutaRigla() {
      riglaVizibila = !riglaVizibila;
      actualizeaza();
      return riglaVizibila ? 'rigla_aratata' : 'rigla_ascunsa';
    }

    const jos = el('div', 'lh-ap-jos'), josIn = el('div', 'lh-ap-jos-in');
    const stare = desen('bara_stare');
    pozitie(stare, SUP.bara_stare.r, [0, SUP.bara_stare.r[1]]);
    legaGlisor(stare.querySelector('[data-lh-tip="Slider"]'));   // word-F096
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
    /* retragerile și spațierea paragrafului (par.pf), numai dacă au fost setate; Heading 1 / Heading 2 în albastrul Word #2F5496 */
    function stilParagraf(par) {
      if (!par.pf) return '';
      const f = pfDe(par);
      return ' style="margin:' + (f.sb * PX_PT) + 'px 0 ' + (f.sa * PX_PT) + 'px;padding-left:0;margin-left:' + (f.il * PX_CM) +
        'px;margin-right:' + (f.ir * PX_CM) + 'px;text-indent:' + (f.pl * PX_CM) + 'px;line-height:' + (f.ls * 1.2).toFixed(2) + '"';
    }
    function spanuri(par, i) {
      if (!par.t.length) return '';
      const albastru = /^Heading [12]$/.test(par.stil) ? 'color:#2F5496;' : '';
      const s0 = inceput(i), a = selMin(), b = selMax(), cuSel = areSel() && !M.cel;
      let html = '', k = 0;
      while (k < par.t.length) {
        const f = par.f[k] || DEF, inS = cuSel && s0 + k >= a && s0 + k < b;
        let j = k + 1;
        while (j < par.t.length && egal(par.f[j] || DEF, f) && (cuSel && s0 + j >= a && s0 + j < b) === inS) j++;
        const cls = (f.b ? ' lh-ap-b' : '') + (f.i ? ' lh-ap-i' : '') + (f.u ? ' lh-ap-u' : '') + (inS ? ' lh-ap-sel' : '');
        html += '<span data-o="' + k + '" class="lh-ap-bucata' + cls + '"' + (f.sz || albastru ? ' style="' + (f.sz ? 'font-size:' + f.sz + 'pt;' : '') + albastru + '"' : '') + '>' + esc(par.t.slice(k, j)) + '</span>';
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
        h += '<div class="' + clasaPar(par) + '" data-lh-tinta="text" data-lh-id="' + (i + 1) + '"' + (sb ? ' data-simbol="' + esc(sb) + '"' : '') + stilParagraf(par) + '>' + imgs + spanuri(par, i) + '</div>';
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
        ParagraphMarks: !!M.semne, ViewPrintLayoutView: vedereDoc === 'Print Layout', ViewWebLayoutView: vedereDoc === 'Web Layout',
        ViewFullScreenReadingView: vedereDoc === 'Read Mode' };
      /* View › Ruler (CheckBox): bifa urmează riglele (word-F098); butoanele vizualizărilor din bara de stare, apăsate */
      root.querySelectorAll('[data-lh-id-mso="ViewRulerWord"]').forEach(e => {
        e.classList.toggle('lh-ap-bifat', riglaVizibila); e.setAttribute('aria-checked', riglaVizibila ? 'true' : 'false');
        const c = e.querySelector('.lh-ap-caseta'); if (c) c.innerHTML = riglaVizibila ? pang.glif('bifa', 12) : '';
      });
      ['Read Mode', 'Print Layout', 'Web Layout'].forEach(n => root.querySelectorAll('[data-lh-suprafata="bara_stare"] [data-lh-eticheta="' + n + '"]').forEach(e => {
        e.classList.toggle('lh-ap-apasat', vedereDoc === n); e.setAttribute('aria-pressed', vedereDoc === n ? 'true' : 'false'); }));
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
        /* cu text selectat: „X of N words” (cuvintele atinse de selecție; lot_5 word-F104, felie_a; vechiul
           wordobj-interfata) — [DEDUS] un cuvânt atins doar pe jumătate se numără întreg (de_capturat.md) */
        const ns = M.deschis && !M.cel && areSel() ? (textIntre(selMin(), Math.min(selMax(), maxCaret())).match(/\S+/g) || []).length : 0;
        const t = (ns ? ns + ' of ' : '') + s.cuvinte + ' words';
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
      const sl = root.querySelector('[data-lh-tip="Slider"] [data-lh-tip="Thumb"]');      if (sl) sl.style.left = Math.round(47 + (M.zoom <= 100 ? (M.zoom - 100) / 90 * 47 : (M.zoom - 100) / 400 * 47)) + 'px';
      /* butonul titlului: „<document>  -  Word”; fără document „Word” (scenarii_real/word-ctrl-w-nu-salva.json ›
         titlu_fereastra) — eticheta declarată = textul de pe ecran (§3) */
      if (BTN_TITLU) {
        const nume = titluFereastra() || '';
        BTN_TITLU.setAttribute('data-lh-eticheta', nume);
        const sp = BTN_TITLU.querySelector('.lh-ap-text');
        if (sp) sp.textContent = nume;
      }
      griFaraDocument();
      griComenzi();
      actualizeazaQat();
      baraProt.style.display = M.deschis && M.protejat ? '' : 'none';
    }
    /* Word fără document: comenzile panglicii sunt gri și fără efect; filele și File rămân active (Word real prin COM,
       runde/5/critic_probe/com_r5.json › activ_fara_document: Bold, Italic, FontSize, Paste, FileSave, FileSaveAs, FilePrint,
       FileClose = false; doar FileNewDefault și FileOpen = true, iar ele nu sunt pe panglică, ci Ctrl+N / Ctrl+O / Ctrl+F12).
       Restul comenzilor panglicii, gri ca la PowerPoint fără prezentare (powerpoint.js › actualizeazaPanglica) — de_verificat
       R16-4. Cu document, nimic nu se atinge (doar ce a fost făcut gri aici revine). Critic 5, GRAV T5 */
    const TIP_COMANDA = /^(Button|SplitButton|ComboBox|CheckBox|RadioButton|MenuItem|ListItem|Edit|Spinner|Hyperlink)$/;
    function griFaraDocument() {
      const fara = !M.deschis;
      loculPanglicii.querySelectorAll('[data-lh-tip]').forEach(x => {
        if (!x.__nod || !TIP_COMANDA.test(x.getAttribute('data-lh-tip') || '')) return;
        if (fara && !x.__griFara && x.getAttribute('aria-disabled') !== 'true') {
          x.__griFara = true;
          x.classList.add('lh-ap-gri');
          x.setAttribute('aria-disabled', 'true');
        } else if (!fara && x.__griFara) {
          x.__griFara = false;
          x.classList.remove('lh-ap-gri');
          x.removeAttribute('aria-disabled');
        }
      });
      loculPanglicii.querySelectorAll('input').forEach(i => {
        if (fara && !i.disabled) { i.disabled = true; i.__griFara = true; }
        else if (!fara && i.__griFara) { i.disabled = false; i.__griFara = false; }
      });
    }
    /* Cut / Copy sunt active doar cu selecție (copiaza/decupeaza nu fac nimic altfel); Paste doar cu clipboard-ul aplicației
       plin (lipeste). Starea din referință (Cut/Copy a=0 pe panglică) rămâne gri pe veci: aici se recalculează. Fără document
       decide griFaraDocument, deci nu se atinge. Se apelează din actualizeazaPanglica, din copiaza și din meniuContextual. */
    function griComenzi() {
      if (!M.deschis) return;
      const pune = (sel, on) => root.querySelectorAll(sel).forEach(x => {
        x.classList.toggle('lh-ap-gri', !on);
        if (on) x.removeAttribute('aria-disabled'); else x.setAttribute('aria-disabled', 'true');
      });
      pune('[data-lh-id-mso="Cut"], [data-lh-id-mso="Copy"], [data-lh-tip="MenuItem"][data-lh-eticheta="Cut"], [data-lh-tip="MenuItem"][data-lh-eticheta="Copy"]', areSel());
      pune('[data-lh-id-mso="Paste"], [data-lh-eticheta="Paste"]', !!M.clip);
    }
    function actualizeaza() {
      deseneazaDoc();
      actualizeazaPanglica();
      deseneazaRigle();
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
        /* antetul unui grup al meniului (Pictures › „Insert Picture From”): doar text, fără clic */
        if (it.antet) { const h = el('div', 'lh-ap-meniu-antet', { role: 'presentation' }); h.textContent = it.antet; m.appendChild(h); return; }
        const b = el('div', 'lh-ap-meniu-rand', { role: 'menuitem', 'data-lh-tinta': 'meniu:' + it.tinta, 'aria-label': it.tinta });
        b.innerHTML = it.html || '<span class="lh-ap-text">' + esc(it.text) + '</span>';
        b.__fa = it.fa;
        /* rândul cu tastă de acces din referință (ex. „Alt, N, P, D”): îl găsesc tastele de acces (ktTinte), ca pe comenzile panglicii */
        if (it.ta) { b.setAttribute('data-lh-tip', 'MenuItem'); b.__nod = { t: 'MenuItem', e: it.text, ta: it.ta }; }
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

    /* ---- panourile Clipboard și Styles (lansatorul ↘ al grupurilor Clipboard / Styles; Styles și cu Alt+Ctrl+Shift+S, tasta
       din referință › StylesPane.k). Lot_5 word-F102. În Word sunt panouri de activități (Clipboard în stânga, Styles în
       dreapta), nu ferestre; aici trec prin drumul ferestrelor (capcanele 1-4), deci au Esc, Tab și focus.
       [DEDUS] conținutul panourilor nu e în referința UIA (doar lansatoarele „Office Clipboard...” / „Styles...”): Paste All,
       Clear All, „Click an Item to Paste:”, Options; lista stilurilor = rândurile galeriei Styles din referință (de_capturat.md) */
    const PANOU_CLIP = 'dialog.panou_Clipboard', PANOU_STIL = 'dialog.panou_Styles';
    if (!SUP[PANOU_CLIP]) {
      const panou = (titlu, r, c) => ({ t: 'Window', e: titlu, r, c: [{ t: 'TitleBar', e: '', r: [r[0] + 1, r[1] + 1, r[2] - 2, 30],
        c: [{ t: 'Button', e: 'Close', r: [r[0] + r[2] - 34, r[1] + 2, 30, 28] }] }].concat(c) });
      const rc = [1, 180, 280, 560], rs = [1085, 180, 280, 560];
      SUP[PANOU_CLIP] = panou('Clipboard', rc, [
        { t: 'Button', e: 'Paste All', r: [rc[0] + 10, rc[1] + 40, 90, 26] },
        { t: 'Button', e: 'Clear All', r: [rc[0] + 108, rc[1] + 40, 90, 26] },
        { t: 'Text', e: 'Click an Item to Paste:', r: [rc[0] + 10, rc[1] + 76, rc[2] - 20, 20] },
        { t: 'List', e: 'Clipboard items', r: [rc[0] + 10, rc[1] + 100, rc[2] - 20, 410] },
        { t: 'Button', e: 'Options', r: [rc[0] + 10, rc[1] + rc[3] - 36, 80, 26] }]);
      SUP[PANOU_STIL] = panou('Styles', rs, [
        { t: 'List', e: 'Styles list', r: [rs[0] + 10, rs[1] + 40, rs[2] - 20, 430] },
        { t: 'Button', e: 'Options...', r: [rs[0] + rs[2] - 90, rs[1] + rs[3] - 36, 80, 26] }]);
      date.dialoguri[PANOU_CLIP] = { titlu: 'Clipboard', file: [{ s: PANOU_CLIP, fila: null }] };
      date.dialoguri[PANOU_STIL] = { titlu: 'Styles', file: [{ s: PANOU_STIL, fila: null }] };
    }
    const stiluriGalerie = () => { const o = []; (function cauta(n) { if (n.t === 'ListItem' && n.e) o.push(n.e.replace(/^¶\s*/, '')); (n.c || []).forEach(cauta); })(SUP['panglica.TabHome']); return o; };
    function umplePanou() {
      if (!dialog || !dialog.el) return;
      const ls = dialog.el.querySelector('[data-lh-tip="List"]');
      if (!ls) return;
      ls.querySelectorAll('.lh-ap-panou-rand, .lh-ap-panou-gol').forEach(x => x.remove());
      const rand = (et, ales) => {
        const b = el('div', 'lh-ap-n lh-ap-panou-rand' + (ales ? ' lh-ap-ales' : ''), { 'data-lh-tip': 'ListItem', 'data-lh-eticheta': et, role: 'option',
          'aria-label': et, 'aria-selected': ales ? 'true' : 'false', 'data-lh-tinta': 'lista:' + et });
        b.textContent = et;
        ls.appendChild(b);
      };
      if (dialog.baza === PANOU_CLIP) {
        if (M.clip && M.clip.text) rand(M.clip.text.replace(/\n/g, ' ').slice(0, 80), false);
        else { const g = el('div', 'lh-ap-panou-gol'); g.textContent = 'Clipboard empty. Copy or cut to collect items.'; ls.appendChild(g); }   // [DEDUS]
      } else {
        const cur = M.P[loc(M.sel.f).i].stil;
        stiluriGalerie().forEach(s => rand(s, s === cur));
      }
    }
    function panou(cheie) {
      if (!deschideDialog(cheie)) return I.nesimulat(cheie === PANOU_CLIP ? 'Office Clipboard...' : 'Styles...');
      umplePanou();
      return cheie === PANOU_CLIP ? 'panou_clipboard' : 'panou_stiluri';
    }
    /* clicurile din panouri: un rând din Clipboard = lipire, Paste All = lipire, Clear All = golește; un stil = stilul
       paragrafului (ca dala din galerie); Close / ✕ închide; restul = mesajul central */
    function clicPanou(fel, v, elx) {
      if (fel === 'fereastra' && /^(Close|Închidere|Cancel)$/.test(v)) { inchideDialog(); return 'anulare'; }
      if (dialog.baza === PANOU_CLIP) {
        if ((fel === 'lista' && elx.closest('.lh-ap-panou-rand')) || (fel === 'fereastra' && v === 'Paste All')) {
          if (!M.clip) return 'fara_efect';
          const r = lipeste(false); actualizeaza(); umplePanou(); return r;
        }
        if (fel === 'fereastra' && v === 'Clear All') { M.clip = null; griComenzi(); umplePanou(); return 'golire_clipboard'; }
      } else if (fel === 'lista' && elx.closest('.lh-ap-panou-rand')) {
        const r = stil(v); actualizeaza(); umplePanou(); return r;
      }
      return I.nesimulat(v);
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
    /* controlul ajuns cu Tab, dacă e în afara stratului ferestrei (fereastra mică, telefonul), e adus în vedere derulând
       DOAR stratul (nu pagina lecției). Critic 20, MINOR „Tab-ul pe Save nu-l aduce în fereastră” */
    function aduInVedere(x) {
      const st = dialog && dialog.strat;
      if (!st || !x || !st.contains(x)) return;
      const a = st.getBoundingClientRect(), b = x.getBoundingClientRect();
      if (b.bottom > a.bottom) st.scrollTop += b.bottom - a.bottom + 4; else if (b.top < a.top) st.scrollTop -= a.top - b.top + 4;
      if (b.right > a.right) st.scrollLeft += b.right - a.right + 4; else if (b.left < a.left) st.scrollLeft -= a.left - b.left + 4;
    }
    function inchideDialog() {
      if (!dialog) return;
      const tv = tipAfisatAcum();
      if (tv != null) M.tipAfisat = tv;
      dialog.strat.remove();
      /* o întrebare deschisă PESTE fereastra de salvare („already exists”, word-F080) o lasă pe aceea în față la închidere */
      dialog = dialog.sub || null;
      focusStrat();
    }
    function deschideDialog(baza, fila) {
      const info = date.dialoguri[baza];
      if (!info) return false;
      inchideMeniu();
      if (dialog) inchideDialog();
      const strat2 = stratNou('lh-ap-strat-dialog');
      /* Save As pe un document salvat pornește din folderul DOCUMENTULUI (Word real prin COM, runde/5/critic_probe/com_r5.json ›
         deschis_din_descarcari_propus_F12 = calea din Descărcări, la fel după o modificare; runde/4/critic_probe/com_f12.json ›
         salvat_propus_F12); documentul nou, din folderul ferestrei din referință („Adresă: Documente”). Critic 5, GRAV S2 */
      const folderDoc = baza === 'dialog.FileSaveAs' && M.deschis && M.salvat && M.folder ? M.folder : null;
      dialog = { baza, strat: strat2, fila: null, desen: baza, folder: folderDoc || folderAdresa(baza === 'dialog.open' ? 'dialog.open' : 'dialog.FileSaveAs') };
      if (baza === 'dialog.FileSaveAs' || baza === SALVARE_NOUA || baza === INTREBARE_INCHIDERE) {
        const prim = (M.P.find(p => p.t.trim()) || { t: '' }).t.trim();
        /* document deja salvat: numele fișierului (Word real, COM — runde/4/critic.md:104: după SaveAs2 dă „numele
           fișierului. După o modificare dă tot numele fișierului”); document nou: primul rând (word-salvare-ca-f12.json).
           Critic runda 4, GRAV T1 */
        /* documentul nou și GOL: Save As propune „Doc<n>” pentru „Document<n>” (Word real prin COM, runde/5/critic_probe/
           com_r5.json › nou1_gol_propus_F12 „Doc1.docx”, nou2_gol_propus_F12 „Doc2.docx”) — critic 5, GRAV S6 */
        const gol = baza === 'dialog.FileSaveAs' && !M.salvat && !prim && /^Document(\d+)$/.exec(M.nume);
        let propus = M.salvat ? faraExt(M.nume) : prim ? prim.replace(/[\\/:*?"<>|]/g, '').slice(0, 60) : gol ? 'Doc' + gol[1] : faraExt(M.nume);
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
      /* imaginile din fereastră (fundalul panourilor, Preview) sunt desenate peste controale și nu sunt controale: trec clicurile
         prin ele, ca un clic pe Before text / Top să ajungă la caseta de sub ele (în Word, imaginea nu primește clic) */
      s.querySelectorAll('[data-lh-tip="Image"]').forEach(x => { x.style.pointerEvents = 'none'; });
      /* casetele numerice ale Paragraph și Page Setup (Before text, Top, …) se pot scrie: în referință sunt „readonly”, dar
         Word le lasă editabile — altfel nu s-ar putea scrie nicio valoare în ele */
      if (dialog.baza === 'dialog.ParagraphDialog' || dialog.baza === 'dialog.PageSetupDialog') {
        s.querySelectorAll('[data-lh-tip="Spinner"] input, [data-lh-tip="ComboBox"] input').forEach(x => { x.readOnly = false; x.removeAttribute('tabindex'); });
      }
      const r = SUP[k].r, R = root.getBoundingClientRect();
      s.style.position = 'absolute';
      s.style.left = Math.max(0, Math.min(r[0], R.width - r[2])) + 'px';
      s.style.top = Math.max(0, Math.min(r[1], R.height - r[3])) + 'px';
      /* fereastra mică (laptopul la 125% în browser = 1093x526 css) e mai joasă decât fereastra din referință (Save As: 566 px):
         Save / Cancel cădeau sub marginea de jos (critic 16 și 20, MINOR „Fereastra mică”). Pe laptopul real fereastra încape
         (768 px la 125% = 614 css; bara browserului e cea care fură înălțimea), deci aici o micșorăm cât să încapă, cel mult
         până la 70% (sub atât rămâne derularea stratului + aduInVedere la Tab). Doar când e mai lată rădăcina decât
         fereastra (laptop, tablă), nu pe telefon; la 1366x768 și la tablă (fereastra încape) dreptunghiurile rămân ale
         referinței. Felul micșorării nu e în referință: [presupus] R24-3 */
      const kMic = R.height > 0 && R.height < r[3] && R.width >= r[2] ? Math.max(0.7, (R.height - 2) / r[3]) : 1;
      if (kMic < 1) { s.style.transformOrigin = '0 0'; s.style.transform = 'scale(' + kMic.toFixed(4) + ')'; }
      dialog.kMic = kMic;   // aceeași micșorare pentru lista deschisă a unei casete din fereastră (listaRef)
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
          if (nume === 'Acest PC') x.__pc = true;   // clic = își arată folderele (extindePC, word-F077)
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
      /* Enter în „already exists” = OK, butonul implicit (vechiul wordfisier.js: OK „pr”; [DEDUS] în Word real, de_capturat.md) */
      if (dialog.inlocuire) return clicInlocuire('fereastra', 'OK');
      if (dialog.odt) return clicOdt('fereastra', 'Yes');
      if (dialog.mesajW) return clicMesajW('fereastra');
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
      /* OK-ul din Paragraph / Page Setup schimbă modelul: desenul se face imediat (altfel până la următoarea tastă) */
      if (dialog.baza === 'dialog.ParagraphDialog') { const r = okParagraf(); actualizeaza(); return r; }
      if (dialog.baza === 'dialog.PageSetupDialog') { const r = okPagina(); actualizeaza(); return r; }
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
      if (v) { Object.assign(v, f); delete v.internet; } else M.fs.push(f);   // [DEDUS] fișierul scris de Word nu mai e „de pe internet”
      if (M.salvari.indexOf(nume) < 0) M.salvari.push(nume);
      /* documentul salvat urcă primul în lista Recent (NEVERIFICAT: AC-7) */
      if (!/\.pdf$/i.test(nume)) {
        M.recente = M.recente.filter(r => !(r.nume.toLowerCase() === nume.toLowerCase() && r.folder === folder));
        M.recente.unshift({ nume, folder });
      }
    }
    /* un nume cu semnele pe care Windows nu le primește (lecția m1-l03:156: „Windows nu primește în nume semnele \ / : * ? " < > |”)
       nu se salvează: Word real refuză (runde/5/critic_probe/com_r5.json › nume_interzise: SaveAs2 „This is not a valid file
       name.” / „Command failed”; os.open „OSError 22 Invalid argument”). Fereastra de eroare NU e în referință → elementul
       mesajului central (ca excel.js › mesajFormula), fără textul unei ferestre inventate; fereastra de salvare rămâne deschisă,
       nimic nu se scrie (de_verificat R16-1). Critic 5, GRAV S3 */
    const SEMNE_INTERZISE = /[\\/:*?"<>|]/;
    function numeInterzis() {
      root.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x => x.remove());
      const m = el('div', 'lh-ap-mesaj', { 'data-lh-nesimulat': 'nume_interzis', role: 'status' });
      m.textContent = 'Windows nu primește în numele fișierului semnele \\ / : * ? " < > |. În aplicația reală apare o fereastră de eroare (aici nu e simulată). Schimbă numele.';
      root.appendChild(m);
      clearTimeout(I._tMesaj);
      I._tMesaj = setTimeout(() => m.remove(), scenariu ? 60000 : 6000);
      return 'nume_interzis';
    }
    /* ---- „already exists” (lot_5 word-F080): numele există deja în folder → Word întreabă cu fereastra LUI („Microsoft
       Word”), peste fereastra de salvare. Probat de judecător în Word real (lectii/vii/m1-l03/surse.md:68, :83; vechiul
       lectii/_sim/wordfisier.js:14-16, :124-125, :526-536):
       - documentul: „The file <nume> already exists.” / „Do you want to:” cu „Replace existing file.” (ales), „Save changes
         with a different name.”, „Merge changes into existing file.”, OK / Cancel;
       - PDF-ul: „You already have a file named <nume>.pdf. Do you want to replace it with this one?”, OK / Cancel.
       OK cu Replace → fișierul e înlocuit; OK cu „different name” sau Cancel / Esc → înapoi în fereastra de salvare, cu același
       nume, fișierul neatins; Merge → mesajul central. [DEDUS] că „Save this file” / „Save your changes…” întreabă la fel ca
       Save As (judecătorul a probat F12) și locul controalelor (de_capturat.md) */
    const CONF_DOC = 'dialog.fisier_exista', CONF_PDF = 'dialog.pdf_exista';
    const RAND_INLOC = ['Replace existing file.', 'Save changes with a different name.', 'Merge changes into existing file.'];
    if (!SUP[CONF_DOC]) {
      const mesaj = (r, c) => ({ t: 'Window', e: 'Microsoft Word', r, c: [
        { t: 'TitleBar', e: '', r: [r[0] + 1, r[1] + 1, r[2] - 2, 30], c: [{ t: 'Button', e: 'Închidere', r: [r[0] + r[2] - 47, r[1], 46, 30] }] },
        { t: 'Text', e: '', r: [r[0] + 24, r[1] + 44, r[2] - 48, 40] }].concat(c) });
      SUP[CONF_DOC] = mesaj([443, 260, 480, 250], [
        { t: 'Group', e: 'Do you want to:', r: [467, 340, 430, 90], c: RAND_INLOC.map((e, i) => ({ t: 'RadioButton', e, r: [477, 346 + 28 * i, 400, 24], b: i === 0 ? 1 : 0 })) },
        { t: 'Button', e: 'OK', r: [713, 470, 90, 28] }, { t: 'Button', e: 'Cancel', r: [813, 470, 90, 28] }]);
      SUP[CONF_PDF] = mesaj([443, 300, 480, 170], [{ t: 'Button', e: 'OK', r: [713, 430, 90, 28] }, { t: 'Button', e: 'Cancel', r: [813, 430, 90, 28] }]);
      date.dialoguri[CONF_DOC] = { titlu: 'Microsoft Word', file: [{ s: CONF_DOC, fila: null }] };
      date.dialoguri[CONF_PDF] = { titlu: 'Microsoft Word', file: [{ s: CONF_PDF, fila: null }] };
    }
    function intreabaInlocuire(nume) {
      const sub = dialog, pdf = /\.pdf$/i.test(nume);
      const k = pdf ? CONF_PDF : CONF_DOC;
      const text = pdf ? 'You already have a file named ' + nume + '. Do you want to replace it with this one?' : 'The file ' + nume + ' already exists.\nDo you want to:';
      dialog = null;                       // fereastra de salvare rămâne pe ecran, sub întrebare
      if (!deschideDialog(k)) { dialog = sub; return I.nesimulat(nume + ' already exists'); }
      dialog.sub = sub;
      dialog.inlocuire = { nume, pdf, alegere: RAND_INLOC[0] };
      const tx = dialog.el.querySelector(':scope > [data-lh-tip="Text"], [data-lh-tip="Text"]');
      if (tx) { const sp = tx.querySelector('.lh-ap-text') || tx; sp.textContent = text; sp.style.whiteSpace = 'pre-line'; tx.setAttribute('data-lh-eticheta', text); }
      M.intrebare = { titlu: 'Microsoft Word', intrebare: text, butoane: pdf ? ['OK', 'Cancel'] : RAND_INLOC.concat(['OK', 'Cancel']), apasat: null };
      return 'intrebare_inlocuire';
    }
    function clicInlocuire(fel, v, elx) {
      if (fel !== 'fereastra') return 'fara_efect';
      const inl = dialog.inlocuire;
      if (RAND_INLOC.indexOf(v) >= 0) { inl.alegere = v; if (elx) comutaCaseta(elx, 'RadioButton'); return 'alegere_optiune'; }
      if (M.intrebare) M.intrebare.apasat = v === 'OK' && !inl.pdf ? inl.alegere : v;
      if (v === 'OK' && !inl.pdf && inl.alegere === RAND_INLOC[2]) return I.nesimulat(RAND_INLOC[2]);
      inchideDialog();                     // revine fereastra de salvare (dialog.sub)
      if (v === 'OK' && (inl.pdf || inl.alegere === RAND_INLOC[0])) {
        const laInchidere = dialog && dialog.baza === INTREBARE_INCHIDERE, cum = M.dupaInchidere;
        const r = salveaza(true);
        return laInchidere && r === 'salvare' ? inchideDocument(cum, 'salvare_si_inchidere') : r;
      }
      return 'anulare';
    }
    /* întrebarea .odt (word-F079): „<document> may contain features that are not compatible with this format. Do you want to
       continue to save in this format?”, bifa „Don't show this message again”, Yes / No (vechiul wordfisier.js:538-541, probat
       de judecător); Yes → salvează .odt, No → înapoi în fereastra de salvare [DEDUS: No și locul controalelor, de_capturat.md] */
    const CONF_ODT = 'dialog.odt_format';
    if (!SUP[CONF_ODT]) {
      const r = [433, 280, 500, 200];
      SUP[CONF_ODT] = { t: 'Window', e: 'Microsoft Word', r, c: [
        { t: 'TitleBar', e: '', r: [r[0] + 1, r[1] + 1, r[2] - 2, 30], c: [{ t: 'Button', e: 'Închidere', r: [r[0] + r[2] - 47, r[1], 46, 30] }] },
        { t: 'Text', e: '', r: [r[0] + 24, r[1] + 44, r[2] - 48, 60] },
        { t: 'CheckBox', e: "Don't show this message again", r: [r[0] + 24, r[1] + 112, 300, 24], b: 0 },
        { t: 'Button', e: 'Yes', r: [r[0] + r[2] - 210, r[1] + r[3] - 44, 90, 28] }, { t: 'Button', e: 'No', r: [r[0] + r[2] - 110, r[1] + r[3] - 44, 90, 28] }] };
      date.dialoguri[CONF_ODT] = { titlu: 'Microsoft Word', file: [{ s: CONF_ODT, fila: null }] };
    }
    /* mesajul lui Word peste Page Setup (word-F070, F073): titlul „Microsoft Word”, textul, OK; după OK fereastra de dedesubt
       rămâne deschisă, iar la „not a valid measurement” caseta greșită primește focusul cu tot textul selectat (vechiul
       wordobj-hartie.js:27, probat de judecător). [DEDUS] locul și mărimea ferestrei mesajului (de_capturat.md, runda 2c) */
    const MESAJ_W = 'dialog.mesaj_word';
    if (!SUP[MESAJ_W]) {
      const r = [483, 300, 400, 150];
      SUP[MESAJ_W] = { t: 'Window', e: 'Microsoft Word', r, c: [
        { t: 'TitleBar', e: '', r: [r[0] + 1, r[1] + 1, r[2] - 2, 30], c: [{ t: 'Button', e: 'Închidere', r: [r[0] + r[2] - 47, r[1], 46, 30] }] },
        { t: 'Text', e: '', r: [r[0] + 24, r[1] + 44, r[2] - 48, 56] },
        { t: 'Button', e: 'OK', r: [r[0] + r[2] - 100, r[1] + r[3] - 38, 75, 23] }] };
      date.dialoguri[MESAJ_W] = { titlu: 'Microsoft Word', file: [{ s: MESAJ_W, fila: null }] };
    }
    function mesajPagina(text, camp) {
      const sub = dialog;
      dialog = null;
      if (!deschideDialog(MESAJ_W)) { dialog = sub; return alerta(text); }
      dialog.sub = sub;
      dialog.mesajW = { camp };
      const tx = dialog.el.querySelector('[data-lh-tip="Text"]');
      if (tx) { const sp = tx.querySelector('.lh-ap-text') || tx; sp.textContent = text; sp.style.whiteSpace = 'normal'; tx.setAttribute('data-lh-eticheta', text); }
      return 'eroare_word';
    }
    function clicMesajW(fel) {
      if (fel !== 'fereastra') return 'fara_efect';
      const camp = dialog.mesajW.camp;
      inchideDialog();   // revine Page Setup (dialog.sub)
      if (camp && dialog && dialog.vp) {
        /* caseta greșită e pe altă filă: Word trece pe fila ei */
        if (!campDialog(camp)) { pastreazaPagina(); arataFilaDialog(/^(Width|Height):$/.test(camp) ? 'Paper' : null); umplePagina(); }
        const x = campDialog(camp);
        if (x) setTimeout(() => { try { x.focus({ preventScroll: true }); x.select(); } catch (e) { /* */ } }, 0);
      }
      return 'inchidere_mesaj';
    }
    function intreabaOdt() {
      const sub = dialog;
      const doc = M.nume;
      const text = doc + ' may contain features that are not compatible with this format. Do you want to continue to save in this format?';
      dialog = null;
      if (!deschideDialog(CONF_ODT)) { dialog = sub; return I.nesimulat('OpenDocument Text (*.odt)'); }
      dialog.sub = sub;
      dialog.odt = true;
      const tx = dialog.el.querySelector('[data-lh-tip="Text"]');
      if (tx) { const sp = tx.querySelector('.lh-ap-text') || tx; sp.textContent = text; sp.style.whiteSpace = 'normal'; tx.setAttribute('data-lh-eticheta', text); }
      M.intrebare = { titlu: 'Microsoft Word', intrebare: text, butoane: ['Yes', 'No'], apasat: null };
      return 'intrebare_format';
    }
    function clicOdt(fel, v, elx) {
      if (fel !== 'fereastra') return 'fara_efect';
      if (v === "Don't show this message again") return comutaCaseta(elx, 'CheckBox');
      if (M.intrebare) M.intrebare.apasat = v;
      inchideDialog();
      if (v === 'Yes') {
        const laInchidere = dialog && dialog.baza === INTREBARE_INCHIDERE, cum = M.dupaInchidere;
        const r = salveaza(true, true);
        return laInchidere && r === 'salvare' ? inchideDocument(cum, 'salvare_si_inchidere') : r;
      }
      return 'anulare';
    }
    function salveaza(inlocuieste, odtDa) {
      let v = valoareCamp('camp:nume_fisier').trim();
      if (!v) return 'fara_efect';
      if (SEMNE_INTERZISE.test(v)) return numeInterzis();
      /* „Save your changes…” pe un document deja salvat: în folderul lui (AC-5); altfel folderul ferestrei (referința) */
      const folder = dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat && M.folder ? M.folder : (dialog && dialog.folder) || folderSalvare();
      const tip = (dialog && dialog.tip) || TIPURI_SALVARE[0] || 'Word Document (*.docx)';
      let r = 'salvare';
      /* un fișier cu același nume există deja în folder: Word întreabă („The file … already exists”, lecția m1-l03:157-159);
         întrebarea = intreabaInlocuire (word-F080, mai sus; înainte: mesajul central), fișierul NU se atinge până la
         Yes / OK, fereastra de salvare rămâne deschisă sub întrebare (de_verificat.md R5-3). Excepție: „Save your changes…” pe documentul salvat = același fișier (AC-5).
         Critic runda 4, GRAV T2 */
      const exista = n => !!gasesteFisier(n, folder) && !(dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat &&
        n.toLowerCase() === String(M.nume).toLowerCase() && folder === M.folder);
      if (/\(\*\.pdf\)/.test(tip)) {
        /* Save as type „PDF (*.pdf)”: o copie PDF; documentul deschis rămâne cel de lucru, nesalvat
           (scenarii_real/word-salvare-pdf.json: fisiere_salvate ["Orar.pdf"], nume_fisier null) */
        const np = v.replace(/\.(docx?|pdf)$/i, '') + '.pdf';
        if (!inlocuieste && exista(np)) return intreabaInlocuire(np);
        scrieFisier(np, folder, tip);
        r = 'salvare_pdf';
      } else if (tip === TIPURI_SALVARE[0] || !TIPURI_SALVARE.length) {
        if (!/\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
        if (!inlocuieste && exista(v)) return intreabaInlocuire(v);
        M.nume = v;
        M.salvat = true;
        M.folder = folder;
        M.modificat = false;
        scrieFisier(v, folder, tip);
      } else if (/\(\*\.(odt|rtf)\)/.test(tip)) {
        /* .odt / .rtf (lot_5 word-F079): lucrezi mai departe în fișierul nou; la .odt Word întreabă întâi dacă păstrezi
           formatul (Yes / No), la .rtf nu — probat de judecător în Word real (lectii/vii/m1-l03/surse.md:68; vechiul
           wordfisier.js:19, :130-134, :538-541) */
        const ext = /\(\*\.(odt|rtf)\)/.exec(tip)[1];
        v = v.replace(/\.(docx?|odt|rtf|pdf)$/i, '') + '.' + ext;
        if (!inlocuieste && exista(v)) return intreabaInlocuire(v);
        if (ext === 'odt' && !odtDa) return intreabaOdt();
        M.nume = v;
        M.salvat = true;
        M.folder = folder;
        M.modificat = false;
        scrieFisier(v, folder, tip);
      } else {
        /* celelalte 13 tipuri ale listei: efectul lor nu e dovedit în referință (doar .docx, PDF, .odt, .rtf) → mesajul central (R12) */
        return I.nesimulat(tip);
      }
      /* mesajul de eroare al încercării de dinainte (nume interzis / „… already exists”) pleacă la salvarea reușită: în
         Windows fereastra de eroare se închide înainte să corectezi numele, deci nu stă peste documentul salvat (critic 20,
         MINOR „Mesajul de eroare rămâne după corectare”). Curățare explicită, într-un pas separat, pe care paza mesajului o
         respectă (aplicatii.js › nesimulat: „Un m.remove() singur … e respectat”); alte mesaje (Tools…) rămân */
      const curataEroarea = () => root.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x => {
        const t = x.getAttribute('data-lh-nesimulat') || '';
        if (t === 'nume_interzis' || / already exists$/.test(t)) x.remove();
      });
      setTimeout(curataEroarea, 0);
      inchideDialog();
      if (backstage) inchideBackstage();
      /* bara de titlu arată numele imediat, pe orice drum (Enter / Save; F12 / Ctrl+S) — critic runda 2, GRAV N1 */
      actualizeazaPanglica();
      return r;
    }
    /* Ctrl+S pe un document deja salvat: același fișier, fără ferestre (support.microsoft.com/en-us/office/keyboard-
       shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2: „Save the document. | Ctrl+S”); textul nou ajunge în fișier */
    function salveazaPeLoc() {
      if (M.protejat) return 'fara_efect';   // [DEDUS] în PROTECTED VIEW salvarea pe loc nu face nimic (word-F092)
      scrieFisier(M.nume, M.folder || folderSalvare(), tipDupaNume(M.nume) || TIPURI_SALVARE[0] || null);
      M.modificat = false;
      /* salvarea pe loc nu arată nicio fereastră: dialog_salvare (fereastra de salvare a ultimei salvări) se golește (word-F089) */
      M.dialogSalvare = null;
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
      umpleFolder(dialog.el);   // lista arată fișierele tipului ales (GRAV S5)
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
      /* lista unei casete din fereastra micșorată (laptopul la 125 %): aceeași micșorare ca fereastra, ca să rămână lată cât
         caseta și în fereastră (critic 24, MINOR 2: 814 px peste caseta de 755, ieșea cu 59 px din fereastră) */
      const kL = dialog && dialog.el && dialog.el.contains(caseta) && dialog.kMic < 1 ? dialog.kMic : 1;
      if (kL < 1) { s.style.transformOrigin = '0 0'; s.style.transform = 'scale(' + kL.toFixed(4) + ')'; }
      s.style.left = Math.max(0, r.left - R.left) + 'px';
      s.style.top = (r.bottom - R.top + (dy || 0) * kL) + 'px';
      const randuri = [...s.querySelectorAll('[data-lh-tip="ListItem"]')];
      randuri.forEach(x => { x.__fa = () => alege(x.getAttribute('data-lh-eticheta')); });
      s.__randuri = randuri;
      s.__anc = caseta;
      root.appendChild(s);
      /* lista unei casete din FEREASTRĂ (Save as type) ținută în ecran: pe fereastra mică rândul PDF cădea sub margine
         (critic 16 și 20, MINOR „Fereastra mică”) — se deschide deasupra casetei dacă acolo încape, altfel lipită de marginea
         de jos. Cât încape dedesubt (1366x768, tabla) nu se mișcă nimic. [presupus] R24-3 */
      if (dialog && dialog.el && dialog.el.contains(caseta)) {
        const hl = s.getBoundingClientRect().height, sus = r.top - R.top, jos = r.bottom - R.top + (dy || 0) * kL;
        if (jos + hl > R.height) s.style.top = Math.max(0, sus - hl >= 0 ? sus - hl : R.height - hl) + 'px';
      }
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
      root.classList.remove('lh-ap-in-backstage');
      I.focus();
    }
    function deschideBackstage(pagina) {
      inchideMeniu();
      if (!backstage) {
        const s = stratNou('lh-ap-strat-backstage');
        const inner = el('div', 'lh-ap-backstage-in');
        s.appendChild(inner);
        backstage = { strat: s, inner, pagina: null };
        /* Backstage acoperă panglica: filele și comenzile nu se mai văd și nu se mai pot apăsa (în Word real Backstage
           înlocuiește tot sub bara de titlu — uia_word.json › backstage.cadru; word-F105: „Ctrl+P deschide pagina Print”) */
        root.classList.add('lh-ap-in-backstage');
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
      if (pagina === 'Print') { prevPag = 1; umplePrevizualizare(p); }
      backstage.nav.querySelectorAll('[data-lh-tip="ListItem"]').forEach(x => x.classList.toggle('activ', x.getAttribute('data-lh-eticheta') === pagina));
      return true;
    }

    /* ---- previzualizarea din File › Print / Ctrl+P (lot_5 word-F105): paginile documentului cum ies pe hârtie, fără ¶,
       „<n> of <N>” sub ea, ◀ ▶ (Previous Page / Next Page) între pagini. Locul și controalele = referința (uia_word.json ›
       backstage.Print › Group „Print Preview”: Pane „Print Preview”, Previous Page, Current Page, Text „ of 1”, Next Page,
       „52 %” = foaia A4 cât panoul de înaltă). Paginile se taie după desenul documentului din zona de lucru (înălțimea
       paragrafelor, la 100 %), cu înălțimea utilă a paginii din M.pag (hârtia minus marginile sus / jos) — [DEDUS] tăierea
       la paragraf întreg (Word taie și în mijlocul paragrafului: Widow/Orphan control); de_capturat.md */
    let prevPag = 1;
    function paginiDoc() {
      const kids = [...corp.children];
      const fr = foaie.getBoundingClientRect();
      const ratio = fr.width > 0 ? fr.width / (M.pag.latime_cm * PX_CM) : 1;
      const m = M.pag.margini_cm, hUtil = (M.pag.inaltime_cm - m.sus - m.jos) * PX_CM;
      const pagini = [[]];
      let start = null;
      kids.forEach(k => {
        const r = k.getBoundingClientRect(), top = r.top / ratio, bot = r.bottom / ratio;
        if (start === null) start = top;
        if (bot - start > hUtil + 0.5 && pagini[pagini.length - 1].length) { pagini.push([]); start = top; }
        pagini[pagini.length - 1].push(k);
      });
      return pagini;
    }
    function umplePrevizualizare(p) {
      p = p || (backstage && backstage.pag);
      if (!p || !M.deschis) return;
      const pane = p.querySelector('[data-lh-tip="Pane"][data-lh-eticheta="Print Preview"]');
      if (!pane) return;
      const pagini = paginiDoc(), N = pagini.length;
      prevPag = Math.max(1, Math.min(prevPag, N));
      pane.querySelectorAll('.lh-ap-prev-foaie').forEach(x => x.remove());
      const m = M.pag.margini_cm, W = M.pag.latime_cm * PX_CM, Hh = M.pag.inaltime_cm * PX_CM;
      const sc = Math.max(0.05, Math.min((pane.offsetHeight - 16) / Hh, (pane.offsetWidth - 16) / W));
      const f = el('div', 'lh-ap-prev-foaie', { 'data-lh-tip': 'Custom', 'data-lh-eticheta': 'Page ' + prevPag });
      f.style.cssText = 'position:absolute;left:' + Math.max(0, (pane.offsetWidth - W * sc) / 2) + 'px;top:8px;width:' + W + 'px;height:' + Hh +
        'px;padding:' + (m.sus * PX_CM) + 'px ' + (m.dreapta * PX_CM) + 'px ' + (m.jos * PX_CM) + 'px ' + (m.stanga * PX_CM) +
        'px;box-sizing:border-box;transform:scale(' + sc.toFixed(4) + ');transform-origin:0 0;overflow:hidden;pointer-events:none';
      (pagini[prevPag - 1] || []).forEach(k => {
        const c = k.cloneNode(true);
        [c].concat([...c.querySelectorAll('*')]).forEach(x => {
          [...x.attributes].forEach(a => { if (/^data-(lh-|o$)/.test(a.name) || a.name === 'id') x.removeAttribute(a.name); });
          x.classList.remove('lh-ap-bucata');
        });
        f.appendChild(c);
      });
      pane.appendChild(f);
      const tx = [...p.querySelectorAll('[data-lh-tip="Text"]')].find(x => /^\s*of\s+\d+\s*$/.test(x.getAttribute('data-lh-eticheta') || ''));
      if (tx) { const t = ' of ' + N; tx.setAttribute('data-lh-eticheta', t); const sp = tx.querySelector('.lh-ap-text') || tx; sp.textContent = t; }
      /* numărul paginii arătate stă în caseta Current Page (în Word se poate și scrie: aici doar ◀ ▶) */
      const cp = p.querySelector('[data-lh-tip="Edit"][data-lh-eticheta="Current Page"]');
      if (cp) {
        const inp = cp.querySelector('input');
        if (inp) inp.style.display = 'none';
        let sp = cp.querySelector('.lh-ap-prev-nr');
        if (!sp) { sp = el('span', 'lh-ap-prev-nr'); cp.appendChild(sp); }
        sp.textContent = String(prevPag);
      }
      const bt = et => p.querySelector('[data-lh-tip="Button"][data-lh-eticheta="' + et + '"]');
      if (bt('Previous Page')) bt('Previous Page').setAttribute('aria-disabled', prevPag > 1 ? 'false' : 'true');
      if (bt('Next Page')) bt('Next Page').setAttribute('aria-disabled', prevPag < N ? 'false' : 'true');
    }
    function paginaPrevizualizare(d) {
      const N = paginiDoc().length, k = Math.max(1, Math.min(N, prevPag + d));
      if (k === prevPag) return 'fara_efect';
      prevPag = k;
      umplePrevizualizare();
      return 'pagina_previzualizare';
    }

    /* ============================================================ închiderea și deschiderea documentelor (critic runda 3, N4) */
    const instantaneuDoc = () => ({ P: M.P, tab: M.tab, img: M.img, pag: M.pag, sel: M.sel, cel: M.cel, nume: M.nume, salvat: M.salvat,
      folder: M.folder, modificat: M.modificat, protejat: !!M.protejat, H });
    function incarcaDoc(d) {
      M.P = d.P; M.tab = d.tab || []; M.img = d.img || []; M.pag = d.pag || paginaNoua(); M.sel = d.sel || { a: 0, f: 0 }; M.cel = d.cel || null;
      M.nume = d.nume; M.salvat = !!d.salvat; M.folder = d.folder || null; M.modificat = !!d.modificat;
      M.protejat = !!d.protejat;   // PROTECTED VIEW (word-F092)
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
      M.nume = 'Document1'; M.salvat = false; M.folder = null; M.modificat = false; M.fmtIns = null; M.ultima = null; M.protejat = false;
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
    /* același fișier, deja deschis (în față sau în altă fereastră): Word nu face al doilea document, ci aduce în față
       documentul existent, cu tot ce e scris în el (Word real prin COM, runde/5/critic_probe/com_r5.json › deschis_iar:
       documente_inainte 1, documente_dupa 1, acelasi_document true). Documentul modificat: fără referință pentru o întrebare
       („revert to saved?”) → rămâne munca elevului (de_verificat R16-3). Critic 5, GRAV S4 */
    const acelasiFisier = (d, f) => d && d.salvat && d.folder === f.folder && String(d.nume).toLowerCase() === f.nume.toLowerCase();
    function deschideFisier(ref) {
      const f = gasesteFisier(ref.nume, ref.folder);
      if (!f) return I.nesimulat(faraExt(ref.nume));
      if (M.deschis && acelasiFisier(M, f)) { inchideBackstage(); actualizeaza(); return 'deschidere'; }
      const k = M.altele.findIndex(d => acelasiFisier(d, f));
      if (k >= 0) {
        const d = M.altele.splice(k, 1)[0];
        if (M.deschis) M.altele.push(instantaneuDoc());
        inchideBackstage();
        incarcaDoc(d);
        return 'deschidere';
      }
      if (M.deschis && (M.salvat || M.modificat)) M.altele.push(instantaneuDoc());
      inchideBackstage();
      incarcaDoc({ P: f.text.map(t => parIn(t)), nume: f.nume, folder: f.folder, salvat: true, modificat: false, protejat: !!f.internet && !p2007 });
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
    /* „Acest PC” din panoul de navigare: folderele lui Windows (Desktop, Descărcări, Documente, Imagini, Muzică, Videoclipuri —
       numele implicite Windows 11 în română din referinte/acoperire_word_r3.py:57, NAV_IMPLICIT) apar sub el, câte un rând
       care se poate alege (navigheaza) — lot_5 word-F077; vechiul avea mereu Desktop, Descărcări, Documente, Imagini
       (wordfisier.js:37). [DEDUS] că un clic pe „Acest PC” îl și desface (în Windows desfacerea e pe săgeata ›); de_capturat.md */
    const FOLDERE_PC = ['Desktop', 'Descărcări', 'Documente', 'Imagini', 'Muzică', 'Videoclipuri'];
    function extindePC(rand) {
      const arb = rand.parentElement;
      if (rand.__desfacut) return 'fara_efect';
      rand.__desfacut = true;
      const are = new Set([...arb.querySelectorAll('.lh-ap-nav-rand')].map(x => x.getAttribute('data-lh-eticheta')));
      let dupa = rand;
      FOLDERE_PC.filter(n => !are.has(n)).forEach(nume => {
        const x = el('div', 'lh-ap-n lh-ap-t-TreeItem lh-ap-nav-rand', { 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': nume, role: 'treeitem',
          'data-lh-tinta': 'arbore:' + nume, 'aria-level': '2' });
        x.__folder = nume;
        x.style.left = '20px'; x.style.width = Math.max(40, parseFloat(rand.style.width) - 16) + 'px'; x.style.height = '22px';
        x.innerHTML = '<span class="lh-ap-text">' + esc(nume) + '</span>';
        dupa.after(x);
        dupa = x;
      });
      rand.setAttribute('aria-expanded', 'true');
      [...arb.querySelectorAll('.lh-ap-nav-rand')].forEach((x, i) => { x.style.top = (6 + 24 * i) + 'px'; });
      if (dialog && dialog.el) umpleFolder(dialog.el);
      return 'extindere';
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
      /* butonul folderului din bara de adrese e găsit O DATĂ pe desen (după eticheta din referință) și ținut minte: după prima
         navigare eticheta lui devine noul folder, iar căutarea după „Documente” nu-l mai găsea — bara rămânea pe primul folder
         ales (critic 5, GRAV S1; referința: uia_word.json › dialog.FileSaveAs / dialog.open › ToolBar „Adresă: Documente” =
         folderul ferestrei) */
      const adr = s.__adresa || (s.__adresa = [...s.querySelectorAll('[data-lh-tip="SplitButton"]')].find(x => x.getAttribute('data-lh-eticheta') === f0 && x.closest('[data-lh-eticheta^="Adres"]')) || null);
      if (adr && adr.getAttribute('data-lh-eticheta') !== dialog.folder) {
        adr.closest('[data-lh-eticheta^="Adres"]').setAttribute('data-lh-eticheta', 'Adresă: ' + dialog.folder);
        adr.setAttribute('data-lh-eticheta', dialog.folder);
        if (adr.hasAttribute('data-lh-tinta')) adr.setAttribute('data-lh-tinta', 'fereastra:' + dialog.folder);
        const t = adr.querySelector('.lh-ap-text');
        if (t) t.textContent = dialog.folder;
      }
      s.querySelectorAll('.lh-ap-nav-rand').forEach(x => x.toggleAttribute('data-lh-selectat', x.getAttribute('data-lh-eticheta') === dialog.folder));
      /* Save As: lista arată fișierele folderului, ca fereastra Open (uia_word.json › dialog.FileSaveAs › List „Vizualizare
         elemente”: 8 ListItem; lecția m1-l03:171-172 „nu da clic pe fișierul colegei”), doar cele de tipul din „Save as
         type” (*.docx / *.pdf, valoarea casetei din referință; filtrul = de_verificat R16-2). Critic 5, GRAV S5 */
      const ext = dialog.baza === 'dialog.open' ? [] : (String(dialog.tip || '').match(/\*\.[a-z0-9]+/gi) || []).map(x => x.slice(1).toLowerCase());
      const fis = M.fs.filter(f => f.folder === dialog.folder && (!ext.length || ext.some(x => f.nume.toLowerCase().endsWith(x))))
        .sort((a, b) => a.nume.localeCompare(b.nume));
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
       document. | Ctrl+N”; lecția m1-l03:116. Numele: Document2, Document3, … (com_r5.json, vezi `nrNou`; critic 5,
       GRAV S6). Critic runda 4, GRAV T5 */
    /* documentul k din spate (M.altele[k]) vine în față; cel din față trece în spate, la sfârșit (word-F087); k < 0 = cel din față */
    function aduInFata(k) {
      if (k < 0 || !M.altele[k]) return 'fara_efect';
      const d = M.altele.splice(k, 1)[0];
      if (M.deschis) M.altele.push(instantaneuDoc());
      incarcaDoc(d);
      return 'fereastra_document';
    }
    function documentNou() {
      if (M.inchisApp) return 'fara_efect';
      if (M.deschis) M.altele.push(instantaneuDoc());
      nrNou++;
      incarcaDoc({ P: [parIn('')], nume: 'Document' + nrNou, salvat: false, modificat: false });
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
      griComenzi();
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
      ParagraphDialog: () => (paragrafDialog() && 'dialog_paragraf'),
      PageSetupDialog: () => (paginaDialog() && 'dialog_pagina'),
      /* View › Window › Switch Windows (Alt, W, W): documentele deschise, numerotate, cel din față bifat; clic = documentul
         vine în față (lot_5 word-F087). [DEDUS] ordinea rândurilor (aici: după nume, deci stabilă când schimbi documentul)
         și forma „<n> <nume>” — de_capturat.md */
      WindowSwitchWindowsMenuWord: e => {
        const numeDoc = d => (d.salvat ? d.nume.replace(/\.docx$/i, '') : d.nume);
        const docs = M.altele.map((d, k) => ({ nume: d.nume, salvat: d.salvat, k })).concat(M.deschis ? [{ nume: M.nume, salvat: M.salvat, k: -1 }] : [])
          .sort((a, b) => numeDoc(a).localeCompare(numeDoc(b), undefined, { numeric: true }));
        meniuLa(e, docs.map((d, i) => ({ tinta: (i + 1) + ' ' + numeDoc(d), text: (i + 1) + ' ' + numeDoc(d) + (d.k < 0 ? '  ✓' : ''),
          fa: () => aduInFata(d.k) })));
        return 'meniu_ferestre';
      },
      /* lansatoarele Clipboard și Styles → panourile lor (word-F102) */
      ShowClipboard: () => panou(PANOU_CLIP), StylesPane: () => panou(PANOU_STIL),
      /* săgeata ⌄ Ribbon Display Options (Alt, Z R): rândul Show / Hide Quick Access Toolbar (word-F099; surse_microsoft.md S3
         citează rândul din meniul de clic dreapta al panglicii) — [DEDUS] că apare și aici, plus celelalte rânduri ale
         meniului (Full-screen mode / Show tabs only / Always show Ribbon) nescrise, fiindcă nu sunt în surse (de_capturat.md) */
      RibbonDisplayOptions: e => {
        const m = meniuLa(e, [randQat()]);
        const R = root.getBoundingClientRect(), q = m.getBoundingClientRect();
        if (q.right > R.right) m.style.left = Math.max(0, R.right - R.left - q.width - 4) + 'px';
        return 'meniu_afisare_panglica';
      },
      IndentIncreaseWord: () => indenteaza(PAS_RETRAGERE), IndentDecreaseWord: () => indenteaza(-PAS_RETRAGERE),
      /* Line and Paragraph Spacing (Home/Layout): 1,0 … 3,0 și Line Spacing Options… */
      LineSpacingGallery: e => { meniuLa(e, INTERLINII.map(([t, v]) => ({ tinta: t, text: t, fa: () => interlinie(v) }))
        .concat([{ tinta: 'Line Spacing Options…', text: 'Line Spacing Options…', fa: () => (paragrafDialog() && 'dialog_paragraf') }])); return 'meniu_interlinie'; },
      TableInsertGallery: e => { grilaTabel(e); return 'meniu_tabel'; },
      /* listele deschise NU sunt în referința UIA: doar rândurile citate — „Narrow Margins” (scenarii_real/word-margini-ingust.json),
         „Custom Margins”, „Portrait”/„Landscape” (support.microsoft.com/en-US/Word/training/change-document-layout),
         „This Device”, „Stock Images”, „Online Pictures” (support.microsoft.com/en-us/word/training/insert-pictures) */
      PageMarginsGallery: e => { meniuLa(e, Object.keys(MARGINI_WORD).map(nume => ({ tinta: nume, text: nume, fa: () => margini(MARGINI_WORD[nume]) }))
        .concat([{ tinta: 'Custom Margins', text: 'Custom Margins', fa: () => (paginaDialog() && 'dialog_pagina') }])); return 'meniu_margini'; },
      PageOrientationGallery: e => { meniuLa(e, [{ tinta: 'Portrait', text: 'Portrait', fa: () => orientare('portret') },
        { tinta: 'Landscape', text: 'Landscape', fa: () => orientare('vedere') }]); return 'meniu_orientare'; },
      /* Size ▾: lista HARTII + „More Paper Sizes...” = Page Setup pe fila Paper (lectii/vii/m2-l09/surse.md:34) — word-F071, F072 */
      PageSizeGallery: e => { meniuLa(e, HARTII.map(h => ({ tinta: h[0], text: h[0], fa: () => marimeFoaie(h[1], h[2]) }))
        .concat([{ tinta: 'More Paper Sizes...', text: 'More Paper Sizes...', fa: () => (paginaDialog('Paper') && 'dialog_pagina') }])); return 'meniu_marime'; },
      /* View › 100% (word-F097) */
      ZoomCurrent100: () => { M.zoom = 100; return 'zoom'; },
      /* View › Views și View › Show › Ruler (word-F093, F094, F098) */
      ViewPrintLayoutView: () => vedere('Print Layout'),
      ViewWebLayoutView: () => vedere('Web Layout'),
      ViewFullScreenReadingView: () => vedere('Read Mode'),
      ViewRulerWord: () => comutaRigla(),
      /* Pictures ▾: grupul „Insert Picture From” cu „This Device...” (Alt, N, P, D), „Stock Images...” (S), „Online
         Pictures...” (O) — etichetele reale, cu trei puncte (runde/26/acoperire_office/capturi_word_brut.json › randuri_meniu,
         etichete; A26O-3); „This Device...” deschide fereastra Insert Picture (› dupa_this_device: #32770 „Insert Picture”) */
      FlyoutAnchorInsertPictures: e => { meniuLa(e, [{ antet: 'Insert Picture From' },
        { tinta: 'This Device...', text: 'This Device...', ta: 'Alt, N, P, D', fa: () => (deschideDialog('dialog.PictureInsertFromFile') && 'dialog_imagine') },
        { tinta: 'Stock Images...', text: 'Stock Images...', ta: 'Alt, N, P, S', fa: () => I.nesimulat('Stock Images...') },
        { tinta: 'Online Pictures...', text: 'Online Pictures...', ta: 'Alt, N, P, O', fa: () => I.nesimulat('Online Pictures...') }]); return 'meniu_imagini'; }
    };
    const DUPA_NUME = { 'Bold': 'Bold', 'Italic': 'Italic', 'Underline': 'UnderlineGallery', 'Grow Font': 'FontSizeIncreaseWord',
      'Shrink Font': 'FontSizeDecreaseWord', 'Bullets': 'BulletsGalleryWord', 'Numbering': 'NumberingGalleryWord', 'Cut': 'Cut',
      'Copy': 'Copy', 'Font...': 'FontDialog', 'Paragraph...': 'ParagraphDialog', 'Ribbon Display Options': 'RibbonDisplayOptions' };
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
      gest('comanda', n.e || tinta.replace(/^[a-z_]+:/, ''));
      const id = idDe(elx);
      if (id && CMD[id]) {
        const r = CMD[id](elx);
        if (strat && strat.contextual && !meniuDeschisDe(elx)) inchideMeniuContextual();
        /* comanda a schimbat modelul (format, pagină, paragraf): desenul se face acum, nu la următoarea tastă */
        actualizeaza();
        return r;
      }
      /* galeria de stiluri din panglică: un stil = clic pe dala lui; săgeata „Styles” deschide galeria întreagă */
      if (/^meniu:/.test(tinta) && elx.closest('[data-lh-id-mso="QuickStylesGallery"]')) return stil(tinta.slice(6));
      if (n.t === 'Button' && n.e === 'Styles' && elx.closest('[data-lh-id-mso="QuickStylesGallery"]')) { galerieStiluri(elx); return 'galerie_stiluri'; }
      if (elx.__fa) { const r = elx.__fa(); inchideMeniu(); actualizeaza(); return r; }
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
      /* selecția făcută la apăsare (și la dublu clic, fără tragere: g e null) se notează la eliberare */
      if (j && j.fel === 'selectie') gestSelectie();
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
        if (backstage && backstage.pagina === 'Print' && /^(Previous|Next) Page$/.test(v)) return paginaPrevizualizare(v === 'Next Page' ? 1 : -1);
        /* File › Save As › Browse → fereastra Save As (support.microsoft.com/en-us/office/collab-files/save-your-files) */
        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat(v);
        /* File › Open › Browse → fereastra Windows Open (uia_word.json › dialog.open › deschis_prin: „Backstage › Open ›
           Browse deschide aceeași fereastră”) — critic runda 4, GRAV N4 */
        if (v === 'Browse' && backstage && backstage.pagina === 'Open' && !p2007) return deschideDialog('dialog.open') ? 'deschidere_fereastra_open' : I.nesimulat(v);
        /* File › Home / New › Blank document = document nou (lecția m1-l03:116; fapte.g_file_document_nou) — GRAV T5 */
        if (v === 'Blank document') { inchideBackstage(); return documentNou(); }
        if (elx.closest('[data-lh-suprafata="backstage.nav"],[data-lh-suprafata="backstage.cadru"]') && n2.t === 'ListItem') {
          if (n2.a === 0) return 'indisponibil';
          /* File › Save: documentul deja salvat se salvează pe loc și Word revine în document (la fel ca Ctrl+S, word-F089;
             lot_5); documentul nou merge la pagina Save As */
          if (v === 'Save' && M.deschis && M.salvat) { inchideBackstage(); return salveazaPeLoc(); }
          if (v === 'Save') return arataPaginaBackstage('Save As') ? 'pagina_backstage' : I.nesimulat(v);
          /* File › Close = același drum ca Ctrl+W: nemodificat → se închide, modificat → „Save your changes…” (word-F088) */
          if (v === 'Close') return cerereInchidere('ctrlw');
          return arataPaginaBackstage(v) ? 'pagina_backstage' : I.nesimulat(v);
        }
        return I.nesimulat(v);
      }
      if (dialog && dialog.inlocuire) return clicInlocuire(fel, v, elx);
      if (dialog && dialog.mesajW) return clicMesajW(fel);   // mesajul lui Word peste Page Setup (word-F070, F073)
      if (dialog && dialog.odt) return clicOdt(fel, v, elx);   // întrebarea .odt (word-F079)   // „already exists” (word-F080)
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
      if (dialog && (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === 'dialog.open') && fel === 'arbore' && elx.__pc) return extindePC(elx);
      if (dialog && dialog.baza === 'dialog.open') {
        if (fel === 'lista' && elx.__fisier) { alegeRandOpen(elx); return 'selectare'; }
        if (fel === 'arbore') return elx.__folder ? navigheaza(elx.__folder) : I.nesimulat(v);
        if (fel === 'fereastra' && v === 'Open') return deschideDinOpen(valoareCamp('camp:nume_fisier'));
        if (fel === 'fereastra' && /^(Cancel|Închidere)$/.test(v)) { inchideDialog(); return 'anulare'; }
        if (fel === 'camp' && v === 'nume_fisier') return 'camp';
        if (fel === 'camp') return I.nesimulat(v + ' ▾');
        return I.nesimulat(v || tinta);
      }
      if (dialog && (dialog.baza === PANOU_CLIP || dialog.baza === PANOU_STIL)) return clicPanou(fel, v, elx);
      if (fel === 'fila_dialog' && dialog) { dialog.cheiePlasa = null; pastreazaPagina(); arataFilaDialog(v === (date.dialoguri[dialog.baza].file[0].fila || null) ? null : (date.dialoguri[dialog.baza].file.some(f => f.fila === v) ? v : null)); umplePagina(); return 'fila_dialog'; }
      if (fel === 'dialog_salvare' && dialog) return v === 'Save' ? salveaza() : (inchideDialog(), 'anulare');
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && fel === 'arbore' && elx.__folder) return navigheaza(elx.__folder);
      /* clic pe un fișier din lista Save As = numele lui în File name (greșeala tipică din m1-l03:171-172: Save pe numele
         colegei → „already exists”, fișierul ei neatins — GRAV T2). Critic 5, GRAV S5 */
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && fel === 'lista' && elx.__fisier) { alegeRandOpen(elx); return 'selectare'; }
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
      if (fel === 'fereastra' && dialog && dialog.vp && /^(Portrait|Landscape)$/.test(v)) return orientarePagina(v);
      if (fel === 'fereastra' && dialog) {
        if (/^(OK|Insert)$/.test(v)) return implicitDialog();
        if (/^(Cancel|Închidere|Close)$/.test(v)) { inchideDialog(); return 'anulare'; }
        return I.nesimulat(v);
      }
      if (fel === 'camp') return 'camp';
      if (dialog && dialog.strat.contains(elx)) return I.nesimulat(v);
      if (fel === 'bara_mesaj' && v === 'Enable Editing') { M.protejat = false; actualizeaza(); I.focus(); return 'activare_editare'; }
      if (fel === 'bara_stare' && /^(Read Mode|Print Layout|Web Layout)$/.test(v)) return vedere(v);   // word-F093, F094
      if (fel === 'citire') return clicCitire(v, elx);
      if (fel === 'zoom') return zoomClic(elx, e, v);
      if (fel === 'bara_derulare') { zona.scrollBy({ top: v === 'Line up' ? -40 : v === 'Line down' ? 40 : zona.clientHeight * 0.9 }); return 'derulare'; }
      /* fără document, comenzile panglicii sunt gri în Word real (com_r5.json › activ_fara_document) → fără efect, fără
         mesajul „funcționează” (critic 5, GRAV T5; înainte: mesajul central, critic runda 4) */
      if (fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return M.deschis ? apasa(elx, tinta) : 'indisponibil';
      /* ✕ al ferestrei Word = Ctrl+W pe document (acoperire_r3.fapte.b_x_la_fel_ca_ctrl_w: true) — critic runda 3, GRAV N4 */
      if (fel === 'bara_titlu' && v === 'Close') return cerereInchidere('x');
      /* butoanele barei Acces rapid (word-F099 / word-F100): același drum ca Ctrl+S / Ctrl+Z / Ctrl+Y */
      if (fel === 'bara_titlu' && elx.__qat) {
        if (elx.getAttribute('aria-disabled') === 'true') return 'indisponibil';
        gest('comanda', v);
        return elx.__qat();
      }
      return I.nesimulat(v || tinta);
    };
    I.la.dublu = tinta => {
      /* dublu clic pe un fișier din fereastra Open = Open (rândul ales + butonul implicit) */
      if (dialog && dialog.baza === 'dialog.open' && /^lista:/.test(tinta || '')) return deschideDinOpen(tinta.slice(6));
      /* dublu clic pe un fișier din Save As = rândul ales + Save (butonul implicit) — GRAV S5 */
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && /^lista:/.test(tinta || '')) {
        const x = [...dialog.el.querySelectorAll('[data-lh-tinta^="lista:"]')].find(r => r.getAttribute('data-lh-tinta') === tinta && r.__fisier);
        if (x) { alegeRandOpen(x); return salveaza(); }
      }
      return /^text:|^document/.test(tinta || '') ? 'selectare_cuvant' : null;
    };
    I.la.dreapta = (tinta, e) => {
      if (dialog || backstage || !M.deschis) return null;
      if (eInDocument(e.target)) return meniuContextual(e.clientX, e.clientY);
      /* clic dreapta pe panglică → Show / Hide Quick Access Toolbar (surse_microsoft.md S3: „Right-click in the ribbon…”);
         [DEDUS] celelalte rânduri ale acestui meniu nu sunt în surse, deci doar rândul citat (de_capturat.md) */
      const tg = e.target;
      if ((loculPanglicii.contains(tg) || filePl.contains(tg)) && !tg.closest('input')) {
        const m = meniuLa(tg.closest('[data-lh-tinta]') || tg, [randQat()]);
        const R = root.getBoundingClientRect();
        m.style.left = Math.max(0, Math.min(e.clientX - R.left, R.width - m.offsetWidth - 4)) + 'px';
        m.style.top = (e.clientY - R.top + 2) + 'px';
        return 'meniu_contextual';
      }
      return null;
    };
    function zoomClic(elx, e, v) {
      /* țintele din bara de stare se numesc „Zoom Out (Ctrl -)” / „Zoom In (Ctrl +)” (uia_word.json › bara_stare), word-F095 */
      /* pasul: Word real, măsurat de judecător, „+ din bara de stare mută cu 8 % (100 → 108 → 116 → 124)”
         (lectii/vii/m1-l03/surse.md:68); sub 100 %, câte 2 % ca vechiul wordfisier.js:654-655 [DEDUS] (de_capturat.md,
         runda 2c). Proba F095 cere 10 %: probe_contestate.md */
      if (/^Zoom Out\b/.test(v)) M.zoom = M.zoom > 100 ? Math.max(100, M.zoom - 8) : Math.max(10, M.zoom - 2);
      else if (/^Zoom In\b/.test(v)) M.zoom = M.zoom < 100 ? Math.min(100, M.zoom + 2) : Math.min(500, M.zoom + 8);
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
    /* Ctrl+1 / Ctrl+2 / Ctrl+5 (interlinia 1,0 / 2,0 / 1,5): gestTasta din aplicatii.js dă gest numai pentru litere și
       semne, deci cifrele nu ajung la I.la.tasta; le luăm aici, înainte de aplicație (rădăcina, faza de captură) */
    root.addEventListener('keydown', e => {
      if (!e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || !M.deschis || dialog || backstage) return;
      const m = /^Digit([125])$/.exec(e.code || '');
      if (!m) return;
      e.preventDefault();
      e.stopPropagation();
      interlinie(m[1] === '1' ? 1 : m[1] === '2' ? 2 : 1.5);
      actualizeaza();
    }, true);
    I.la.tasta = (e, g, inCamp) => {
      /* Enter într-o fereastră apasă butonul ei implicit: Save (Save As, „Save this file”, „Save your changes…”) */
      const activatEnter = () => !dialog ? null : (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) ? 'dialog_salvare:Save' :
        dialog.baza === INTREBARE_INCHIDERE ? 'fereastra:Save' : dialog.baza === 'dialog.open' ? 'fereastra:Open' : null;
      /* o listă deschisă (Font Size, Save as type) ia săgețile, Enter și Esc înaintea casetei și a ferestrei */
      const rl = tastaLista(e);
      if (rl) return rl;
      /* Tab / Shift+Tab într-o fereastră (Save As, Open, „Save this file”, „Save your changes…”, Font…) trec prin controalele
         EI și nu ies din ea, oriunde ar fi focusul: cârligul comun aplicatii.js › I.tabFereastra (runda 14), chemat ca în
         powerpoint.js (T1, critic 13). Ordinea = ordinea nodurilor din referință ([presupus] R14-1 / R20-1): din File name,
         primul Tab ajunge pe Save as type (uia_word.json › dialog.FileSaveAs, nodul de imediat după). Lista deschisă a unei
         casete (Save as type ▾) se închide fără să schimbe tipul ([presupus] R20-2). Word NU dă I.la.fereastra(): Alt + litera
         are deja codul lui (mai jos, root keydown), iar cel comun ar mai da un eveniment pe aceeași tastă. Critic 16, GRAV K1 */
      if (dialog && dialog.el && e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (meniu) inchideMeniu();
        if (!inCamp && dialog.el.contains(document.activeElement) && document.activeElement !== dialog.el) I.tintaTasta = L._tintaDin(I, document.activeElement);
        const rt = I.tabFereastra ? I.tabFereastra(dialog.el, e.shiftKey) : 'fara_efect';
        aduInVedere(document.activeElement);
        return rt;
      }
      /* Alt+F4 într-o fereastră o închide, ca în Windows (support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-
         dcc61a57-8ff0-cffe-9796-cb9706c75eec, Windows 11: „Alt+F4 | Close the active window.”): același drum ca Esc (Cancel),
         mai jos; în „Save your changes…” = Cancel, ca Esc ([presupus] R20-3). Critic 20, MINOR „Alt+F4 într-o fereastră” */
      const altF4 = e.key === 'F4' && e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
      if (dialog && dialog.el && altF4) { e.preventDefault(); if (meniu) inchideMeniu(); }
      /* Esc într-o fereastră = Cancel (IDCANCEL: learn.microsoft.com/en-us/windows/win32/dlgbox/dlgbox-programming-considerations,
         sursa din api_biblioteca.md §4): același efect ca clicul pe Cancel — în „Save your changes…” documentul rămâne
         deschis, cu dialog.apasat „Cancel” (scenarii_real/word-x-nesalvat-cancel.json, făcut cu clic); evenimentul poartă
         `activat` = Cancel. Fără Cancel în fereastră: doar se închide. „Save your changes…” nu e #32770 → [presupus] R20-3 */
      /* Esc în „already exists” = Cancel: înapoi în fereastra de salvare, fișierul neatins (word-F080) */
      if (dialog && dialog.inlocuire && e.key === 'Escape') return clicInlocuire('fereastra', 'Cancel');
      if (dialog && dialog.odt && e.key === 'Escape') return clicOdt('fereastra', 'No');
      if (dialog && dialog.mesajW && e.key === 'Escape') return clicMesajW('fereastra');
      if (dialog && dialog.el && (e.key === 'Escape' || altF4)) {
        const cn =[...dialog.el.querySelectorAll('[data-lh-tip="Button"][data-lh-eticheta="Cancel"]')].find(x => L._vizibil(x));
        const tc = cn && (cn.hasAttribute('data-lh-tinta') ? cn : cn.querySelector('[data-lh-tinta]'));
        if (!inCamp && dialog.el.contains(document.activeElement) && document.activeElement !== dialog.el) I.tintaTasta = L._tintaDin(I, document.activeElement);
        if (!tc) { inchideDialog(); return 'anulare'; }
        const t = L._canon(tc);
        I.activat = t || null;
        const r = I.la.clic(t, { target: tc, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
          button: 0, detail: 0, preventDefault() {} }, 1);
        if (dialog) inchideDialog();
        return r || 'anulare';
      }
      /* Alt+↑ / Alt+← / Alt+→ / F5 în Save As / Open: tasta e scrisă chiar în eticheta butonului din referință
         (uia_word.json › dialog.FileSaveAs / dialog.open: „Până la "Desktop" (Alt + săgeată în sus)”, „Înapoi (Alt + săgeată
         la stânga)” activ:false, „Înainte (Alt + săgeată la dreapta)” activ:false, „Reîmprospătare "Documente" (F5)”) → apasă
         butonul, ca clicul (mesajul central); butonul gri → fără efect. Critic 16, MINOR „Alt+↑ și F5 tac” */
      const SEMN_TASTA = { ArrowUp: 'Alt + săgeată în sus', ArrowLeft: 'Alt + săgeată la stânga', ArrowRight: 'Alt + săgeată la dreapta' };
      const semn = !dialog || !dialog.el || e.ctrlKey || e.metaKey ? null : e.altKey ? SEMN_TASTA[e.key] : (e.key === 'F5' && !e.shiftKey ? '(F5)' : null);
      const bs = semn && [...dialog.el.querySelectorAll('[data-lh-tip="Button"][data-lh-eticheta]')].find(x => x.getAttribute('data-lh-eticheta').indexOf(semn) >= 0 && L._vizibil(x));
      if (bs) {
        e.preventDefault();
        if (!inCamp && dialog.el.contains(document.activeElement) && document.activeElement !== dialog.el) I.tintaTasta = L._tintaDin(I, document.activeElement);
        const tb = bs.hasAttribute('data-lh-tinta') ? bs : bs.querySelector('[data-lh-tinta]');
        if (bs.getAttribute('aria-disabled') === 'true' || !tb) return 'fara_efect';
        const t = L._canon(tb);
        I.activat = t || null;
        return I.la.clic(t, { target: tb, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
          button: 0, detail: 0, preventDefault() {} }, 1) || 'fara_efect';
      }
      if (inCamp) {
        if (dialog && e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return marimeScrisa(e.target); }
        /* Alt+↓ deschide lista casetei (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-
           afb2-f762f663ceb2: „Open the menu for the selected button. | Alt+Down arrow key”); rândurile ei: uia_word.json ›
           lista.FontSize. În Save As, caseta Save as type are același gest (referința: Button „Deschidere”, tasta_acces
           „Alt+Săgeată în jos”) — critic runda 3, GRAV 3 / A1 */
        /* Alt+↓ APASĂ săgeata ▾ a casetei (Button „Open” / „Deschidere” în referință): același efect ca clicul pe ea, iar
           evenimentul poartă `activat` = ținta săgeții, ca asistentul și verificarea să vadă același pas ca la mouse
           (api_biblioteca.md §4 „activat”: butonul pe care TASTA l-a apăsat fără să fie ținta focusului). Pe orice casetă cu
           ▾ a lui Word: Font Size, Font, Save as type, File name, Files of type, Choose a Location; o casetă fără săgeată
           proprie (Save as type din „Save this file”) = clicul pe casetă. Critic 5, GRAV T6 (unghiul gest_tastatura) */
        if (e.key === 'ArrowDown' && e.altKey && e.target.closest) {
          const cb = e.target.closest('[data-lh-tip="ComboBox"]');
          const sag = cb && root.contains(cb) ? ([...cb.querySelectorAll('[data-lh-tip="Button"][data-lh-tinta]')][0] || (cb.hasAttribute('data-lh-tinta') ? cb : null)) : null;
          if (sag) {
            e.preventDefault();
            const t = L._canon(sag);
            I.activat = sag === cb ? null : t || null;
            return I.la.clic(t, { target: sag, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
              button: 0, detail: 0, preventDefault() {} }, 1) || 'alt_sageti';
          }
        }
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
        /* Enter pe un buton cu focusul (ajuns acolo cu Tab) îl apasă pe ACELA; Space apasă butonul / bifează caseta cu focusul;
           Enter în rest = butonul implicit (dlgbox-programming-considerations; ca powerpoint.js, T1). Fără asta, Tab până la
           Cancel + Enter ar salva. Ținta = focusul din momentul tastei (§4). Critic 16, GRAV K1 */
        const fx = document.activeElement && dialog.el.contains(document.activeElement) && document.activeElement !== dialog.el ? document.activeElement : null;
        const cx = fx && fx.closest('[data-lh-tip]'), tcx = cx && dialog.el.contains(cx) ? cx.getAttribute('data-lh-tip') : '';
        if (fx) I.tintaTasta = L._tintaDin(I, fx);
        const tx = tcx && (cx.hasAttribute('data-lh-tinta') ? cx : cx.querySelector('[data-lh-tinta]'));
        if (tx && ((e.key === 'Enter' && /^(Button|SplitButton)$/.test(tcx)) || (e.key === ' ' && /^(Button|SplitButton|CheckBox|RadioButton)$/.test(tcx)))) {
          e.preventDefault();
          const r = I.la.clic(L._canon(tx), { target: tx, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
            button: 0, detail: 0, preventDefault() {} }, 1);
          actualizeaza();
          return r || 'fara_efect';
        }
        if (e.key === 'Enter') { e.preventDefault(); if (activatEnter()) I.activat = activatEnter(); return implicitDialog(); }
        return 'fara_efect';
      }
      if (meniu && e.key === 'Escape') { inchideMeniu(); return 'inchidere_meniu'; }
      if (strat && strat.contextual && e.key === 'Escape') { inchideMeniuContextual(); return 'inchidere_meniu'; }
      if (backstage) { if (e.key === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }
      if (vedereDoc === 'Read Mode' && e.key === 'Escape') return vedere('Print Layout');   // Read Mode: Esc = Print Layout (word-F093)
      /* fără document (Ctrl+W → Don't Save) tastele nu au unde scrie; Ctrl+O deschide pagina Open */
      /* fără document (Ctrl+W → Don't Save): tastarea și navigarea n-au unde ajunge; Ctrl+O, Ctrl+N, Ctrl+F12 merg ca de
         obicei (com_r5.json › activ_fara_document: FileNewDefault, FileOpen = true); comenzile de document (Ctrl+B, F12,
         Ctrl+S, Shift+F12, Ctrl+W, Ctrl+P…) sunt dezactivate în Word real (Bold … FileClose = false) → fără efect, fără
         mesajul „funcționează” (critic 5, GRAV T5) */
      if (!M.deschis && g !== 'ctrl_o' && g !== 'ctrl_n' && !(g === 'tasta_f12' && e.ctrlKey)) {
        actualizeaza();
        if (M.inchisApp || /^(tastare|sageti|alt_sageti|tasta_(enter|backspace|delete|tab|home_end|pagina|esc|windows))$/.test(g)) return 'fara_efect';
        return 'indisponibil';
      }
      let r = null;
      const sh = e.shiftKey;
      switch (g) {
        case 'tastare': e.preventDefault(); r = scrie(e.key, true); gest('tastare', e.key, true); break;
        case 'tasta_enter': e.preventDefault(); r = e.ctrlKey ? I.nesimulat('Ctrl+Enter') : enter(); break;
        /* support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2 (citit 21.11.2026),
           „Edit text and graphics”: „Delete one word to the left. | Ctrl+Backspace”, „Delete one word to the right. | Ctrl+Delete”
           (runda 28, unghiul gest_tastatura: Ctrl+Backspace ștergea o literă) */
        case 'tasta_backspace': e.preventDefault(); r = e.ctrlKey && !M.cel && !areSel() ? stergeCuvant(-1) : backspace(); if (r && r !== 'fara_efect') gest('sters', 'inainte'); break;
        case 'tasta_delete': e.preventDefault(); r = e.ctrlKey && !M.cel && !areSel() ? stergeCuvant(1) : del(); if (r && r !== 'fara_efect') gest('sters', 'dupa'); break;
        case 'tasta_tab': {
          e.preventDefault();
          /* Tab la începutul paragrafului (fără selecție, nu în tabel): retragerea primei linii, nu un caracter Tab */
          const l0 = !M.cel && !areSel() && !sh && M.deschis ? loc(M.sel.f) : null;
          r = M.cel ? tabInTabel(sh) : l0 && l0.o === 0 ? primaLinie() : scrie('\t', false);
          break;
        }
        case 'sageti':
          e.preventDefault();
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') r = muta1(e.key === 'ArrowLeft' ? -1 : 1, sh, e.ctrlKey);
          /* „Navigate the document”: „Move the cursor up by one paragraph. | Ctrl+Up arrow key”, „… down by one paragraph. |
             Ctrl+Down arrow key” (aceeași pagină; runda 28: Ctrl+↑/↓ mutau un rând) */
          else if (e.ctrlKey && !M.cel) r = mutaParagraf(e.key === 'ArrowUp' ? -1 : 1, sh);
          else r = M.cel ? 'cursor' : mutaRand(e.key === 'ArrowUp' ? -1 : 1, sh);
          if (sh) gestSelectie();
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
        case 'ctrl_a': M.cel = null; M.sel = { a: 0, f: lungime() }; H.rupe(); r = 'selectare_tot'; gestSelectie(); break;
        case 'ctrl_b': r = comuta('b'); break;
        case 'ctrl_i': r = comuta('i'); break;
        case 'ctrl_u': r = comuta('u'); break;
        case 'ctrl_e': r = aliniaza('centru'); break;
        case 'ctrl_l': r = aliniaza('stanga'); break;
        case 'ctrl_r': r = aliniaza('dreapta'); break;
        case 'ctrl_j': r = aliniaza('stanga-dreapta'); break;
        /* Ctrl+P = File › Print, cu previzualizarea (word-F105; support.microsoft.com keyboard-shortcuts-in-word: „Print the
           document. | Ctrl+P”); Word 2007: Ctrl+P deschide fereastra Print (fără referință) → mesajul central */
        case 'ctrl_p': if (M.inchisApp || !M.deschis) r = 'fara_efect'; else if (p2007) r = I.nesimulat('Ctrl+P'); else { deschideBackstage('Print'); r = 'backstage'; } break;
        case 'ctrl_z': r = anuleaza(); break;
        case 'ctrl_y': r = reface(); if (r && r !== 'fara_efect') gest('refacere', ''); break;
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
      gest('tastare', v, true);
      actualizeaza();
      return r;
    };
    I.la.sterge = g => {
      if (dialog || backstage || !M.deschis) return 'fara_efect';
      const r = g === 'tasta_backspace' ? backspace() : del();
      if (r && r !== 'fara_efect') gest('sters', g === 'tasta_backspace' ? 'inainte' : 'dupa');
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
      /* T3: Alt+E/A/M/O în zona PDF; N4: Alt+O = Open; MenuItem: Alt+L = Tools (uia_word.json › dialog.FileSaveAs / dialog.open ›
         MenuItem „Tools” tasta_acces „Alt+l”), ca clicul pe el — critic 16, MINOR „Alt+L fără eveniment” */
      const APASA = ['Button', 'SplitButton', 'CheckBox', 'RadioButton', 'MenuItem'];
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
        /* caseta gri (Word fără document, GRAV T5): tasta n-are efect */
        if (camp && camp.disabled) { ktIesi(); I.tastaFaraClic('indisponibil', exact.x); return true; }
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
