/* powerpoint.js — PowerPoint în biblioteca centrală (api_biblioteca.md §1-§8, CONVENTIE_ARBORE.md). Runda 11 (B-powerpoint).
   Interfața (bara de titlu cu Acces rapid, rândul filelor, panglica fiecărei file, bara de stare, File/Backstage, meniurile de
   clic dreapta, ferestrele, panourile) se desenează din date/powerpoint.json (GENERAT de _unelte/genereaza_powerpoint.py din
   referinte/uia_powerpoint.json) prin motorul comun panglica.js — nicio etichetă de interfață scrisă aici.
   Diapozitivul și miniaturile NU sunt în UI Automation (README_referinte.md): le desenez simplu, din scenarii; ce nu e dovedit
   e notat în de_verificat.md (R11-*). Starea (§5): diapozitive, formatare_text, tema, tranzitie_galerie, animatie_galerie,
   nume_fisier + diapozitiv_activ, panou, selectie_text (§7.1). Ecranul se redesenează din model după fiecare gest. */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;
  const SL = { w: 960, h: 540 };   // diapozitivul 16:9 în puncte (13,333 × 7,5 in); zoomul real implicit = 70 % (bara_stare › „Zoom 70 %”)
  /* casetele aspectelor, în puncte (Office Theme 16:9) — [NEVERIFICAT] R11-2: UIA nu le expune; numele aspectelor DOAR din
     scenariile reale (powerpoint-ctrl-m, powerpoint-aspect-title-only: Title Slide, Title and Content, Title Only) */
  const ASPECTE = {
    'Title Slide': [{ tip: 'titlu', x: 120, y: 88.4, w: 720, h: 188, marime: 60, centru: 1 }, { tip: 'subtitlu', x: 120, y: 283.6, w: 720, h: 130.4, marime: 24, centru: 1 }],
    'Title and Content': [{ tip: 'titlu', x: 66, y: 28.8, w: 828, h: 104.4, marime: 44 }, { tip: 'continut', x: 66, y: 144, w: 828, h: 342.6, marime: 28 }],
    'Title Only': [{ tip: 'titlu', x: 66, y: 28.8, w: 828, h: 104.4, marime: 44 }]
  };
  const NUME_ASPECTE = Object.keys(ASPECTE);
  /* codurile dovedite: scenarii_real/powerpoint-tranzitie-fade.json (Fade = 3849), powerpoint-animatie-fly-in.json (Fly In = 2);
     celelalte efecte au cod null (R11-3) */
  const COD_TRANZITIE = { Fade: 3849 }, COD_ANIMATIE = { 'Fly In': 2 };
  /* pașii Increase/Decrease Font Size: 60 → 66 dovedit (powerpoint-mareste-font.json); restul listei [NEVERIFICAT] R11-4 */
  const MARIMI = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96];
  const GALERII = { SlideThemesGallery: 'tema', AnimationTransitionGallery: 'tranzitie', AnimationGallery: 'animatie' };

  function creeaza(I, c) {
    const root = I.root, date = I.date, pang = L._module.panglica, esc = pang.esc, clona = L._clona;
    const SUP = date.suprafete, ZR = ((date.zona || {}).desktop || {}).r || [1, 181, 1364, 564];
    const scenariu = !!I.opt.scenariu;
    const H = L._module.stare.istoric((a, b) => a === b && a === 'tastare');
    const el = (tag, cls, at) => { const e = document.createElement(tag); if (cls) e.className = cls; Object.entries(at || {}).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
    const pozitie = (e, r) => { e.style.position = 'absolute'; e.style.left = r[0] + 'px'; e.style.top = r[1] + 'px'; };

    /* ============================================================ modelul */
    const M = { dia: [], activ: 0, tema: 'Office Theme', nume: null, panou: 'diapozitiv', clip: null, citita: null, expunere: null };
    let sel = null;   // {d, s, edit, a, b, ins}: forma s a diapozitivului d — edit = cursorul în text (a..b = selecția), altfel forma aleasă ca obiect; ins = formatul de scriere ales cu cursorul strâns
    /* textul unei casete = un șir + formatul FIECĂRUI caracter (fm[k] = {b, i, u, m}; m = null: mărimea casetei, deci schimbarea
       aspectului o schimbă) + proprietățile FIECĂRUI paragraf (par[p] = {al, ina, dupa, linie, ind}; paragrafele = bucățile
       dintre „\n”). bold/italic/underline/marime ale casetei = formatul textului gol (ce primește tastarea într-o casetă goală).
       Valorile de pornire ale paragrafului: dialog.PowerPointParagraphDialog din referință (titlul Title Slide: Centered,
       Before text 0 cm, Before 0 pt, After 0 pt, Multiple 0,9); celelalte casete: aceleași, aliniate la stânga (R11-12). */
    const parNou = centru => ({ al: centru ? 'Centered' : 'Left', ina: 0, dupa: 0, linie: 0.9, ind: 0 });
    function formaNoua(p, text) {
      const t = text || '';
      return { tip: p.tip, text: t, fm: Array.from({ length: t.length }, () => ({ b: false, i: false, u: false, m: null })), par: t.split('\n').map(() => parNou(p.centru)),
        bold: false, italic: false, underline: false, marime: p.marime, x: p.x, y: p.y, w: p.w, h: p.h, centru: !!p.centru };
    }
    const fmDef = f => ({ b: !!f.bold, i: !!f.italic, u: !!f.underline, m: null });
    const fmLa = (f, k) => (f.fm && f.fm[k]) || fmDef(f);
    const marimeLa = (f, x) => (x.m == null ? f.marime : x.m);
    const parLa = (f, p) => (f.par && f.par[p]) || parNou(f.centru);
    function parIdx(t, k) { let n = 0; for (let i = 0; i < k && i < t.length; i++) if (t[i] === '\n') n++; return n; }
    /* înlocuiește text[a..b) cu t: caracterele noi primesc formatul fmt (sau fms[k]); paragrafele se despart / se unesc odată cu „\n” */
    function inlocuieste(f, a, b, t, fmt, fms) {
      if (!f.fm) f.fm = Array.from({ length: f.text.length }, () => fmDef(f));
      if (!f.par) f.par = f.text.split('\n').map(() => parNou(f.centru));
      const pa = parIdx(f.text, a), kR = (f.text.slice(a, b).match(/\n/g) || []).length, kI = (t.match(/\n/g) || []).length;
      const p0 = Object.assign({}, parLa(f, pa));
      f.par.splice(pa + 1, kR);
      for (let i = 0; i < kI; i++) f.par.splice(pa + 1, 0, Object.assign({}, p0));
      f.fm.splice(a, b - a, ...Array.from({ length: t.length }, (_, k) => Object.assign({}, (fms && fms[k]) || fmt)));
      f.text = f.text.slice(0, a) + t + f.text.slice(b);
    }
    /* formatul cu care se scrie la poziția a: al caracterului dinainte în același paragraf, altfel al celui de după, altfel al casetei */
    function fmtScriere(f, a) {
      const t = f.text;
      if (a > 0 && t[a - 1] !== '\n') return fmLa(f, a - 1);
      if (a < t.length) return fmLa(f, a);
      if (a > 0) return fmLa(f, a - 1);
      return fmDef(f);
    }
    function diaNou(aspect, texte) {
      const P = ASPECTE[aspect] || ASPECTE['Title and Content'];
      return { aspect, forme: P.map((p, i) => formaNoua(p, (texte || [])[i])), tranzitie: null, animatii: [] };
    }
    const D = () => M.dia[M.activ];
    const forma = (d, s) => (M.dia[d] || { forme: [] }).forme[s] || null;
    const formaSel = () => sel && forma(sel.d, sel.s);
    const textual = f => f && f.tip !== 'tabel' && f.tip !== 'imagine';
    const inst = () => clona({ dia: M.dia, activ: M.activ, tema: M.tema });
    function puneInst(x) { M.dia = x.dia; M.activ = Math.min(x.activ, M.dia.length - 1); M.tema = x.tema; sel = null; }
    function schimba(tip, fn) { H.inainte(tip, inst()); fn(); M.salvat = false; deseneaza(); }

    (function incarca(c) {
      const ds = Array.isArray(c.diapozitive) && c.diapozitive.length ? c.diapozitive : [{ aspect: 'Title Slide' }];
      M.dia = ds.map(d => diaNou(d.aspect || 'Title and Content', d.texte));
      const lim = n => Math.max(0, Math.min(M.dia.length - 1, n));
      M.activ = lim((+c.diapozitiv_activ || 1) - 1);
      M.panou = c.panou === 'miniaturi' ? 'miniaturi' : 'diapozitiv';
      if (Array.isArray(c.selectie_forma)) { M.activ = lim(c.selectie_forma[0] - 1); if (forma(M.activ, c.selectie_forma[1] - 1)) sel = { d: M.activ, s: c.selectie_forma[1] - 1, edit: false }; }
      /* selectie_text: „tot textul casetei selectat” (powerpoint-bold-text), caseta goală = cursorul în ea (powerpoint-tastare-titlu) */
      if (Array.isArray(c.selectie_text)) {
        M.activ = lim(c.selectie_text[0] - 1);
        const f = forma(M.activ, c.selectie_text[1] - 1);
        if (textual(f)) { sel = { d: M.activ, s: c.selectie_text[1] - 1, edit: true, a: 0, b: f.text.length }; M.panou = 'diapozitiv'; }
      }
      if (Array.isArray(c.forma_citita)) M.citita = [c.forma_citita[0] - 1, c.forma_citita[1] - 1];
      if (c.tema) M.tema = String(c.tema);
      if (c.nume_fisier) M.nume = String(c.nume_fisier);
    })(c || {});
    M.salvat = true;

    /* ============================================================ starea (§5, §7.1) */
    function stareDia(d) {
      const o = { aspect: d.aspect, texte: d.forme.filter(f => textual(f) && f.text).map(f => f.text), forme: d.forme.length };
      if (d.tranzitie) o.tranzitie_cod = COD_TRANZITIE[d.tranzitie] != null ? COD_TRANZITIE[d.tranzitie] : null;
      if (d.animatii.length) o.animatii_cod = d.animatii.map(a => COD_ANIMATIE[a.efect] != null ? COD_ANIMATIE[a.efect] : null);
      return o;
    }
    /* formatare_text = ce citește ruleaza_real.py prin COM: TextRange.Font.Bold → bool (msoTriStateMixed = -2 dă true, deci „bold”
       = măcar un caracter aldin) și Font.Size (la mărimi amestecate: a primului caracter — R11-11, [NEVERIFICAT]) */
    function fmtText(f) {
      const v = [];
      for (let p = 0; p < f.text.length; p++) if (f.text[p] !== '\n') v.push(fmLa(f, p));
      if (!v.length) v.push(fmDef(f));
      return { text: f.text, bold: v.some(x => x.b), marime: marimeLa(f, v[0]) };
    }
    /* bucățile de text cu același format, la rând (ca formatare_pe_caractere din Word) */
    function bucati(f) {
      const r = [];
      for (let p = 0; p < f.text.length; p++) {
        const x = fmLa(f, p), o = { bold: !!x.b, italic: !!x.i, underline: !!x.u, marime: marimeLa(f, x) }, u = r[r.length - 1];
        if (u && u.bold === o.bold && u.italic === o.italic && u.underline === o.underline && u.marime === o.marime) u.text += f.text[p];
        else r.push(Object.assign({ text: f.text[p] }, o));
      }
      return r;
    }
    I.stare = () => {
      const fc = M.citita ? forma(M.citita[0], M.citita[1]) : (formaSel() || (D() && D().forme[0]));
      const fs = formaSel();
      const anim = fs && sel ? (M.dia[sel.d].animatii.find(a => a.s === sel.s) || null) : null;
      return {
        diapozitive: M.dia.map(stareDia),
        formatare_text: textual(fc) ? fmtText(fc) : null,
        formatare_pe_caractere: textual(fc) ? bucati(fc) : null,
        paragrafe_text: textual(fc) ? fc.text.split('\n').map((t, p) => { const P = parLa(fc, p); return { text: t, aliniere: P.al, inainte: P.ina, dupa: P.dupa, interlinie: P.linie, indent_cm: P.ind }; }) : null,
        modificat: !M.salvat,
        tema: M.tema,
        tranzitie_galerie: D() && D().tranzitie ? D().tranzitie : 'None',
        animatie_galerie: fs ? (anim ? anim.efect : 'None') : null,
        nume_fisier: M.nume,
        diapozitiv_activ: M.activ + 1,
        panou: M.panou,
        selectie_text: sel && sel.edit && formaSel() ? { diapozitiv: sel.d + 1, forma: sel.s + 1, de_la: Math.min(sel.a, sel.b), pana_la: Math.max(sel.a, sel.b),
          text: formaSel().text.slice(Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)) } : null,
        selectie_forma: sel && !sel.edit ? [sel.d + 1, sel.s + 1] : null,
        backstage: backstage ? backstage.pagina : null,
        dialog: dialog ? { titlu: (date.dialoguri[dialog.baza] || {}).titlu || dialog.baza } : null,
        expunere: M.expunere ? M.expunere.i + 1 : null
      };
    };

    /* ============================================================ fereastra (din date/powerpoint.json) */
    root.innerHTML = '';
    let filaActiva = 'TabHome', meniu = null, dialog = null, backstage = null, panouLat = null, contextFile = [];
    const QAT = new Set();
    (function u(n, inQ) { if (!n) return; const q = inQ || (n.t === 'ToolBar' && n.e === 'Quick Access Toolbar'); if (q) QAT.add(n); (n.c || []).forEach(x => u(x, q)); })(SUP.bara_titlu, false);
    let elTitlu = null, elIndicator = null, elZoom = null;
    const titlu = () => (M.nume ? M.nume.replace(/\.pptx$/i, '') : 'Presentation1') + '  -  PowerPoint';
    const OPT = {
      tinta(n, ctx) {
        if (QAT.has(n) && ctx.cheie === 'bara_titlu') {
          if (n.t === 'ToolBar' || n.t === 'SplitButton') return null;
          if (n.t === 'MenuItem' && /More Options/.test(n.e || '')) return 'meniu_derulant:Quick Access Toolbar/' + ((ctx.parinteUnit || {}).e || '');
          if (n.t === 'MenuItem') return 'meniu_derulant:' + n.e;
          return 'acces_rapid:' + ((ctx.parinteUnit && ctx.parinteUnit.t === 'SplitButton') ? ctx.parinteUnit.e : n.e);
        }
        if (/^panglica/.test(ctx.cheie || '') && ctx.inGalerie && n.t === 'Button') return 'meniu_derulant:' + [ctx.fila, ctx.grup, n.e].filter(Boolean).join('/');
        if (ctx.cheie === 'dialog.FileSaveAs') {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^File name:?$/.test(n.e)) return null;
          if (n.t === 'ComboBox' && /^Save as type:?$/.test(n.e)) return 'camp:tip_fisier';
          if (n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }
        return undefined;
      },
      la(n, e, ctx) {
        if (ctx.cheie === 'bara_titlu' && n.t === 'ToolBar' && QAT.has(n)) e.setAttribute('data-lh-suprafata', 'acces_rapid');
        if (ctx.cheie === 'bara_titlu' && n.t === 'TitleBar' && /\s-\s/.test(n.e || '')) { e.innerHTML = '<span class="lh-ap-text lh-ap-x-titlu"></span>'; elTitlu = e; }
        /* galeriile din panglică: toate rândurile rămân în DOM, derulabile în caseta lor (în referință rândurile 2+ sunt
           „vizibil:false” = în afara casetei, nu inexistente); clicul pe un rând aplică elementul */
        if (ctx.inGalerie && n.ascuns) e.style.display = '';
        if (ctx.inGalerie && n.t === 'ListItem') { e.innerHTML = '<span class="lh-ap-p-gal" aria-hidden="true"></span>'; e.classList.add('lh-ap-p-galerie-el'); }
        if (/^panglica/.test(ctx.cheie || '') && n.t === 'Pane' && ctx.inGalerie) e.classList.add('lh-ap-p-galerie-caseta');
        if (ctx.cheie === 'bara_stare' && n.t === 'Text' && /^View Indicator/.test(n.e || '')) { e.innerHTML = '<span class="lh-ap-text"></span>'; elIndicator = e; }
        if (ctx.cheie === 'bara_stare' && n.t === 'Button' && /^Zoom \d/.test(n.e || '')) elZoom = e;
        if (ctx.cheie === 'bara_stare' && n.t === 'Button' && n.e === 'Normal') e.classList.add('lh-ap-apasat');
      },
      /* câmpurile în care se scrie: File name (Save As), Font Size (Home), Size (Font), coloanele / rândurile (Insert Table),
         indentul și spațierile (Paragraph) — toate Edit în referință */
      editabil(n, ctx) {
        if (n.t !== 'Edit') return false;
        if (ctx.cheie === 'dialog.FileSaveAs') return /^File name/.test(n.e);
        if (ctx.cheie === 'panglica.TabHome') return n.e === 'Font Size';
        if (ctx.cheie === 'dialog.FontDialogPowerPoint') return n.e === 'Size';
        if (ctx.cheie === 'dialog.TableInsertDialog') return /^Number of (columns|rows)$/.test(n.e);
        if (ctx.cheie === 'dialog.PowerPointParagraphDialog') return /^(Before text|Before|After|At)$/.test(n.e);
        return false;
      }
    };
    const desen = (cheie, extra) => pang.deseneaza(I, cheie, Object.assign({}, OPT, extra || {}));
    const sus = el('div', 'lh-ap-sus'), susIn = el('div', 'lh-ap-sus-in');
    sus.appendChild(susIn);
    const titluEl = desen('bara_titlu'); pozitie(titluEl, SUP.bara_titlu.r);
    const filePl = desen('file_panglicii'); pozitie(filePl, SUP.file_panglicii.r);
    const loculPanglicii = el('div', 'lh-ap-loc-panglica');
    susIn.append(titluEl, filePl, loculPanglicii);
    const RAND_FILE = filePl.querySelector('[data-lh-eticheta="Ribbon Tabs"]') || filePl;

    /* ---- zona de lucru (uia_powerpoint.json › zona_document › „Desktop” [1,181,1364,564]): miniaturile + diapozitivul */
    const zonaSup = el('div', 'lh-ap-p-zona', { 'data-lh-suprafata': 'zona_document', 'data-lh-tip': 'Pane', 'data-lh-eticheta': '' });
    const mini = el('div', 'lh-ap-p-miniaturi', { role: 'listbox', 'aria-label': 'Slides' });
    const pane = el('div', 'lh-ap-p-pane', { 'data-lh-zona': '' });
    const slide = el('div', 'lh-ap-p-slide');
    const intrare = el('textarea', 'lh-ap-intrare', { 'data-lh-intrare-document': '', 'aria-label': 'Slide', autocomplete: 'off', autocorrect: 'off',
      autocapitalize: 'off', spellcheck: 'false', rows: '1' });
    pane.append(slide);
    zonaSup.append(mini, pane, intrare);
    I.intrare = intrare;
    const jos = el('div', 'lh-ap-jos'), josIn = el('div', 'lh-ap-jos-in');
    const stareEl = desen('bara_stare');
    pozitie(stareEl, [SUP.bara_stare.r[0], 0]);
    josIn.appendChild(stareEl);
    jos.appendChild(josIn);
    root.append(sus, zonaSup, jos);
    I.focus = () => { try { intrare.focus({ preventScroll: true }); } catch (e) { /* */ } };
    I.zonaTinta = 'diapozitiv';

    /* ---- geometria diapozitivului: zoomul „potrivit la fereastră” (Zoom to Fit), 70 % la 1366×768 */
    let Z = 0.7 * 96 / 72;
    I.pxPePunct = () => Z;
    function geometrie() {
      const w = pane.clientWidth || (ZR[2] - 186), h = pane.clientHeight || ZR[3];
      Z = Math.max(0.15, Math.min(0.7 * 96 / 72, (w - 24) / SL.w, (h - 24) / SL.h));
      slide.style.width = SL.w * Z + 'px';
      slide.style.height = SL.h * Z + 'px';
      slide.style.left = Math.max(12, (w - SL.w * Z) / 2) + 'px';
      slide.style.top = Math.max(12, (h - SL.h * Z) / 2) + 'px';
    }

    /* ============================================================ desenul */
    /* fiecare paragraf = un bloc .lh-ap-p-par (aliniere, spațiere, interlinie, indent); în el, bucățile cu același format = <span>.
       Cursorul și umplutura paragrafului gol sunt aria-hidden (nu sunt text al documentului, §3). */
    const stilFmt = (f, x, z) => 'font-size:' + marimeLa(f, x) * z + 'px;' + (x.b ? 'font-weight:700;' : 'font-weight:400;') +
      (x.i ? 'font-style:italic;' : '') + (x.u ? 'text-decoration:underline;' : '');
    const AL_CSS = { Left: 'left', Centered: 'center', Right: 'right', Justified: 'justify', Distributed: 'justify' };
    function htmlText(f, cuSel, z) {
      const t = f.text, a = cuSel ? Math.min(sel.a, sel.b) : -1, b = cuSel ? Math.max(sel.a, sel.b) : -1, c = cuSel ? sel.b : -1;
      const caret = x => '<span class="lh-ap-p-caret" aria-hidden="true" style="font-size:' + marimeLa(f, x) * z + 'px"></span>';
      let h = '', st = 0;
      t.split('\n').forEach((s, p) => {
        const P = parLa(f, p), PT = 4 / 3 * z;
        h += '<div class="lh-ap-p-par" style="text-align:' + (AL_CSS[P.al] || 'left') + ';line-height:' + (1.2 * P.linie).toFixed(3) + ';margin:' +
          P.ina * PT + 'px 0 ' + P.dupa * PT + 'px ' + P.ind * 28.3465 * PT + 'px">';
        let run = '', cheie = null;
        const scoate = () => { if (run) h += '<span' + cheie + '>' + esc(run) + '</span>'; run = ''; };
        for (let k = st; k <= st + s.length; k++) {
          if (k === c) { scoate(); h += caret(sel.ins || fmtScriere(f, k)); }
          if (k === st + s.length) break;
          const x = fmLa(f, k), ch = ' style="' + stilFmt(f, x, z) + '"' + (k >= a && k < b ? ' class="lh-ap-p-ales"' : '');
          if (ch !== cheie) { scoate(); cheie = ch; }
          run += t[k];
        }
        scoate();
        if (!s.length) h += '<span aria-hidden="true" style="font-size:' + marimeLa(f, fmLa(f, st < t.length ? st : st - 1)) * z + 'px">​</span>';
        h += '</div>';
        st += s.length + 1;
      });
      return h;
    }
    function stilForma(f, z) { return 'left:' + f.x * z + 'px;top:' + f.y * z + 'px;width:' + f.w * z + 'px;height:' + f.h * z + 'px'; }
    function continutForma(f, z, cuSel) {
      if (f.tip === 'tabel') {
        let h = '<table class="lh-ap-p-tabel" aria-hidden="true">';
        for (let r = 0; r < f.randuri; r++) { h += '<tr>'; for (let k = 0; k < f.coloane; k++) h += '<td></td>'; h += '</tr>'; }
        return h + '</table>';
      }
      if (f.tip === 'imagine') return '<span class="lh-ap-p-imagine" aria-hidden="true"></span>';
      const st = 'font-size:' + f.marime * z + 'px;' + (f.centru ? 'justify-content:center;' : '');
      return '<div class="lh-ap-p-text' + (f.tip === 'titlu' ? ' lh-ap-p-titlu' : '') + '" style="' + st + '">' + htmlText(f, cuSel, z) + '</div>';
    }
    function deseneazaDiapozitiv() {
      geometrie();
      slide.innerHTML = '';
      slide.setAttribute('data-lh-tema', M.tema);
      const d = D();
      if (!d) return;
      d.forme.forEach((f, s) => {
        const ales = sel && sel.d === M.activ && sel.s === s;
        const e = el('div', 'lh-ap-p-forma' + (f.text || !textual(f) ? '' : ' lh-ap-p-goala') + (ales ? (sel.edit ? ' lh-ap-p-editare' : ' lh-ap-p-obiect') : ''),
          { 'data-lh-tinta': 'forma', 'data-lh-id': (M.activ + 1) + '/' + (s + 1), style: stilForma(f, Z) });
        if (ales) e.setAttribute('data-lh-selectat', '');
        e.innerHTML = continutForma(f, Z, ales && sel.edit);
        if (ales || s === 0) {
          /* marginea casetei: clicul pe ea alege caseta ca OBIECT (chenar plin), de unde tragerea o mută (R11-5) */
          ['sus', 'jos', 'st', 'dr'].forEach(k => e.appendChild(el('div', 'lh-ap-p-margine lh-ap-p-m-' + k, { 'data-lh-tinta': 'margine_forma', 'data-lh-id': (M.activ + 1) + '/' + (s + 1), 'aria-hidden': 'true' })));
        }
        slide.appendChild(e);
      });
      /* fundalul diapozitivului: DUPĂ forme în DOM (prima țintă a zonei = prima casetă), dedesubt pe ecran */
      slide.appendChild(el('div', 'lh-ap-p-fundal', { 'data-lh-tinta': 'diapozitiv', 'data-lh-id': String(M.activ + 1) }));
    }
    function deseneazaMiniaturi() {
      mini.innerHTML = '';
      const lat = Math.max(60, mini.clientWidth - 34), z = lat / SL.w;
      M.dia.forEach((d, i) => {
        const r = el('div', 'lh-ap-p-mini-rand');
        r.appendChild(el('span', 'lh-ap-p-mini-nr', { 'aria-hidden': 'true' })).textContent = String(i + 1);
        const m = el('div', 'lh-ap-p-mini' + (i === M.activ ? ' lh-ap-p-mini-activ' + (M.panou === 'miniaturi' ? ' lh-ap-p-mini-focus' : '') : ''),
          { 'data-lh-tinta': 'miniatura', 'data-lh-id': String(i + 1), role: 'option', 'aria-selected': i === M.activ ? 'true' : 'false', 'aria-label': 'Slide ' + (i + 1),
            'data-lh-tema': M.tema, style: 'width:' + lat + 'px;height:' + SL.h * z + 'px' });
        if (i === M.activ) m.setAttribute('data-lh-selectat', '');
        if (d.tranzitie) r.appendChild(el('span', 'lh-ap-p-mini-stea', { 'aria-hidden': 'true' }));
        const in2 = el('div', 'lh-ap-p-mini-in', { 'aria-hidden': 'true' });
        d.forme.forEach(f => { const x = el('div', 'lh-ap-p-forma', { style: stilForma(f, z) }); x.innerHTML = continutForma(f, z, false); in2.appendChild(x); });
        m.appendChild(in2);
        r.appendChild(m);
        mini.appendChild(r);
      });
    }
    function actualizeazaBare() {
      if (elTitlu) { elTitlu.firstChild.textContent = titlu(); elTitlu.setAttribute('data-lh-eticheta', titlu()); }
      if (elIndicator) { const t = 'Slide ' + (M.activ + 1) + ' of ' + M.dia.length; elIndicator.firstChild.textContent = t; elIndicator.setAttribute('data-lh-eticheta', 'View Indicator ' + t); }
    }
    /* comenzile gri în referință (activ:false — „starea DE LA DUMP”, cu nimic ales: README_referinte.md) devin active când e o
       casetă aleasă / un text în editare; la Transitions, când diapozitivul are o tranziție (R11-6, [presupus]) */
    function actualizeazaPanglica() {
      const areSel = !!formaSel(), areTr = !!(D() && D().tranzitie);
      loculPanglicii.querySelectorAll('[data-lh-tip]').forEach(e => {
        const n = e.__nod;
        if (!n || n.a !== 0) return;
        const pe = filaActiva === 'TabTransitions' ? areTr : areSel;
        e.classList.toggle('lh-ap-gri', !pe);
        if (pe) e.removeAttribute('aria-disabled'); else e.setAttribute('aria-disabled', 'true');
      });
      loculPanglicii.querySelectorAll('.lh-ap-p-galerie-el').forEach(e => e.classList.remove('lh-ap-p-gal-ales'));
      const g = filaActiva === 'TabTransitions' ? (D() && D().tranzitie) || 'None' : filaActiva === 'TabDesign' ? M.tema :
        filaActiva === 'TabAnimations' && formaSel() ? ((D().animatii.find(a => a.s === sel.s) || {}).efect || 'None') : null;
      if (g) { const x = loculPanglicii.querySelector('.lh-ap-p-galerie-el[data-lh-eticheta="' + CSS.escape(g) + '"]'); if (x) x.classList.add('lh-ap-p-gal-ales'); }
      /* Bold / Italic / Underline apăsate și caseta Font Size = formatul textului ales (ecranul = starea) */
      const fx = formatAfisat();
      [['Bold', 'b'], ['Italic', 'i'], ['Underline', 'u']].forEach(([id, k]) => loculPanglicii.querySelectorAll('[data-lh-id-mso="' + id + '"]').forEach(e => {
        e.classList.toggle('lh-ap-apasat', !!(fx && fx[k]));
        e.setAttribute('aria-pressed', fx && fx[k] ? 'true' : 'false');
      }));
      const mf = loculPanglicii.querySelector('[data-lh-id-mso="FontSize"] [data-lh-tip="Edit"] input');
      if (mf) { mf.readOnly = !fx; if (document.activeElement !== mf) mf.value = fx && fx.m != null ? numarRo(fx.m) : ''; }
      const redo = titluEl.querySelector('[data-lh-id-mso="RedoOrRepeat"]');
      if (redo) { redo.classList.toggle('lh-ap-gri', !H.poateReface()); if (H.poateReface()) redo.removeAttribute('aria-disabled'); else redo.setAttribute('aria-disabled', 'true'); }
    }
    /* filele contextuale (CONVENTIE_ARBORE.md §4.5): caseta → Shape Format; tabelul → Table Design, Table Layout; imaginea → Picture Format */
    function actualizeazaContext() {
      const f = formaSel();
      const fel = !f ? null : f.tip === 'tabel' ? 'tabel' : f.tip === 'imagine' ? 'imagine' : 'forma';
      const lista = (fel && date.context[fel]) || [];
      const chei = lista.map(x => x.id).join(',');
      if (RAND_FILE.__ctx === chei) return;
      RAND_FILE.__ctx = chei;
      contextFile.forEach(x => x.remove());
      contextFile = [];
      const help = RAND_FILE.querySelector('[data-lh-id-mso="HelpTab"]');
      let x0 = help ? parseFloat(help.style.left) + parseFloat(help.style.width) + 1 : 692;
      lista.forEach(k => {
        const t = el('div', 'lh-ap-n lh-ap-t-TabItem lh-ap-p-ctx', { 'data-lh-tip': 'TabItem', 'data-lh-eticheta': k.e, 'data-lh-id-mso': k.id, role: 'tab',
          'data-lh-tinta': 'fila:' + k.e, 'aria-selected': 'false' });
        t.style.cssText = 'left:' + x0 + 'px;top:0;width:' + (k.e.length * 7 + 22) + 'px;height:30px';
        t.innerHTML = '<span class="lh-ap-text">' + esc(k.e) + '</span>';
        x0 += k.e.length * 7 + 23;
        RAND_FILE.appendChild(t);
        contextFile.push(t);
      });
      if (/^Ctx_/.test(filaActiva) && !lista.some(k => k.id === filaActiva)) activeazaFila('TabHome');
    }
    function deseneaza() {
      deseneazaMiniaturi();
      deseneazaDiapozitiv();
      actualizeazaBare();
      actualizeazaContext();
      actualizeazaPanglica();
      if (panouLat && panouLat.cheie === 'panou.AnimationCustom') randuriAnimatii();
      I.zonaTinta = sel ? 'forma:' + (sel.d + 1) + '/' + (sel.s + 1) : M.panou === 'miniaturi' ? 'miniatura:' + (M.activ + 1) : 'diapozitiv';
    }
    function activeazaFila(id) {
      const cheie = (/^Ctx_/.test(id) ? 'panglica_context.' : 'panglica.') + id;
      if (!SUP[cheie]) return false;
      const fila = (date.file.find(f => f.id === id) || (SUP[cheie]._fila) || {}).e;
      loculPanglicii.innerHTML = '';
      const p = desen(cheie, { fila });
      pozitie(p, SUP[cheie].r);
      loculPanglicii.appendChild(p);
      filaActiva = id;
      filePl.querySelectorAll('[data-lh-tip="TabItem"]').forEach(t => {
        const a = t.getAttribute('data-lh-id-mso') === id;
        t.classList.toggle('activ', a);
        t.setAttribute('aria-selected', a ? 'true' : 'false');
      });
      actualizeazaPanglica();
      return true;
    }

    /* ============================================================ meniurile, listele, ferestrele, Backstage */
    function strat(cls) { const s = el('div', 'lh-ap-strat ' + (cls || '')); root.appendChild(s); return s; }
    function inchideMeniu() { if (meniu) { meniu.remove(); meniu = null; } }
    function laPunct(e, x, y) {
      const R = root.getBoundingClientRect();
      const w = e.offsetWidth, h = e.offsetHeight;
      e.style.left = Math.max(0, Math.min(x - R.left, root.clientWidth - w - 2)) + 'px';
      e.style.top = Math.max(0, Math.min(y - R.top, root.clientHeight - h - 2)) + 'px';
    }
    function meniuContextual(cheie, x, y) {
      inchideMeniu();
      const s = SUP['meniu_contextual.' + cheie];
      if (!s) return false;
      const m = desen('meniu_contextual.' + cheie);
      m.style.position = 'absolute';
      m.style.width = s.r[2] + 'px';
      m.style.height = s.r[3] + 'px';
      m.classList.add('lh-ap-p-meniu');
      root.appendChild(m);
      laPunct(m, x, y);
      meniu = m;
      return true;
    }
    /* listele ▾ care NU sunt în referință („Necapturate: listele derulante”, README_referinte.md): doar rândurile dovedite de
       scenariile reale (aspectele) și grila tabelului (powerpoint-tabel: 3×2) — R11-1 */
    function listaAspecte(anc, scop) {
      inchideMeniu();
      const m = el('div', 'lh-ap-meniu lh-ap-p-lista', { role: 'menu', 'data-lh-lista': scop });
      NUME_ASPECTE.forEach(a => {
        const r = el('div', 'lh-ap-meniu-rand lh-ap-p-lista-rand', { role: 'menuitem', 'data-lh-tinta': 'meniu:' + a });
        r.innerHTML = '<span class="lh-ap-p-aspect" aria-hidden="true">' + ASPECTE[a].map(p => '<i style="' + stilForma(p, 0.08) + '"></i>').join('') + '</span><span class="lh-ap-text">' + esc(a) + '</span>';
        m.appendChild(r);
      });
      root.appendChild(m);
      const b = anc.getBoundingClientRect();
      laPunct(m, b.left, b.bottom + 2);
      meniu = m;
      return 'lista_aspecte';
    }
    function grilaTabel(anc) {
      inchideMeniu();
      const m = el('div', 'lh-ap-meniu lh-ap-grila', { role: 'menu', 'data-lh-lista': 'tabel' });
      for (let r = 1; r <= 8; r++) for (let k = 1; k <= 10; k++) {
        const x = el('div', 'lh-ap-meniu-rand', { role: 'menuitem', 'data-lh-tinta': 'meniu:' + k + 'x' + r + ' Table', 'aria-label': k + 'x' + r + ' Table' });
        x.addEventListener('pointerenter', () => m.querySelectorAll('.lh-ap-meniu-rand[aria-label]').forEach(c => { const [kk, rr] = c.getAttribute('aria-label').split(' ')[0].split('x').map(Number); c.classList.toggle('lh-ap-ales', kk <= k && rr <= r); }));
        m.appendChild(x);
      }
      /* sub grilă, comanda TableInsert: lista Microsoft a comenzilor (surse_microsoft.md S11, powerpointcontrols.xlsx: TableInsert,
         button, „Parent Control” = TableInsertGallery) → fereastra „Insert Table” din referință (dialog.TableInsertDialog).
         Eticheta „Insert Table...” = titlul ferestrei + „...” ([presupus], lista ▾ necapturată: R11-1) */
      const ti = el('div', 'lh-ap-meniu-rand', { role: 'menuitem', 'data-lh-tinta': 'meniu:Insert Table...', 'data-lh-id-mso': 'TableInsert',
        style: 'grid-column:1/-1;width:auto;height:auto;min-height:32px;padding:4px 6px;border:0;background:none;display:flex;align-items:center' });
      ti.innerHTML = '<span class="lh-ap-text">Insert Table...</span>';
      m.appendChild(ti);
      root.appendChild(m);
      const b = anc.getBoundingClientRect();
      laPunct(m, b.left, b.bottom + 2);
      meniu = m;
      return 'grila_tabel';
    }
    function inchideDialog() { if (dialog) { dialog.strat.remove(); dialog = null; I.focus(); } }
    function deschideDialog(baza) {
      if (!SUP[baza]) return false;
      inchideMeniu();
      inchideDialog();
      const s = strat('lh-ap-strat-dialog');
      const d = desen(baza);
      const r = SUP[baza].r;
      d.style.position = 'absolute';
      d.style.left = Math.max(0, Math.min(r[0], root.clientWidth - r[2])) + 'px';
      d.style.top = Math.max(0, Math.min(r[1], root.clientHeight - r[3])) + 'px';
      s.appendChild(d);
      dialog = { baza, strat: s, el: d, init: umpleDialog(baza, d) };
      const camp = d.querySelector('[data-lh-tinta="camp:nume_fisier"] input, input[aria-label^="File name"]');
      /* focusul în File name imediat după gest (microtask: evenimentul gestului își ia ținta din focusul de la tastă, §4), ca tastele
         apăsate imediat după F12 să ajungă în casetă, ca în Windows; și încă o dată după gest */
      const fo = () => { if (!dialog || !dialog.el.contains(camp) || document.activeElement === camp) return; try { camp.focus(); camp.select(); } catch (e) { /* */ } };
      if (camp) { camp.removeAttribute('readonly'); camp.value = M.nume ? M.nume.replace(/\.pptx$/i, '') : 'Presentation1'; Promise.resolve().then(fo); setTimeout(fo, 0); }
      return true;
    }
    /* ferestrele Font / Paragraph / Insert Table arată starea textului ales; OK aplică doar ce s-a schimbat față de ce arătau,
       Cancel / Închidere / Esc nu schimbă nimic. Câmpurile și valorile de pornire = referința (dialog.* din uia_powerpoint.json);
       numele valorilor în afară de cele din referință (Bold / Italic / Bold Italic, Left / Right…) sunt [presupus] (R11-12). */
    const campD = (d, et, tip) => [...d.querySelectorAll('[data-lh-tip="' + (tip || 'Edit') + '"][data-lh-eticheta="' + et + '"] input' +
      (tip ? '' : ', [data-lh-tip="Spinner"][data-lh-eticheta="' + et + '"] > input'))];
    function puneCamp(d, et, v, tip) { const xs = campD(d, et, tip); xs.forEach(x => { x.value = v; }); return v; }
    function citesteCamp(d, et) { const x = d.querySelector('[data-lh-tip="Edit"][data-lh-eticheta="' + et + '"] input') || campD(d, et)[0]; return x ? x.value : ''; }
    function paragrafeAlese() {
      const f = formaSel();
      if (!sel || !textual(f)) return null;
      const n = f.text.split('\n').length;
      if (!sel.edit) return { f, a: 0, b: n - 1 };
      return { f, a: parIdx(f.text, Math.min(sel.a, sel.b)), b: parIdx(f.text, Math.max(sel.a, sel.b)) };
    }
    function umpleDialog(baza, d) {
      const init = {};
      if (baza === 'dialog.FontDialogPowerPoint') {
        const fx = formatAfisat();
        if (!fx) return init;
        init.Size = puneCamp(d, 'Size', fx.m != null ? numarRo(fx.m) : '');
        puneCamp(d, 'Font style', fx.amestec ? '' : fx.b && fx.i ? 'Bold Italic' : fx.b ? 'Bold' : fx.i ? 'Italic' : 'Regular', 'ComboBox');
        puneCamp(d, 'Underline style', fx.u || fx.amestecU ? '' : '(none)', 'ComboBox');
      }
      if (baza === 'dialog.PowerPointParagraphDialog') {
        const pa = paragrafeAlese();
        if (!pa) return init;
        const Ps = [];
        for (let p = pa.a; p <= pa.b; p++) Ps.push(parLa(pa.f, p));
        const una = (k, fn) => (Ps.every(P => P[k] === Ps[0][k]) ? fn(Ps[0][k]) : '');
        puneCamp(d, 'Alignment', una('al', v => v), 'ComboBox');
        init['Before text'] = puneCamp(d, 'Before text', una('ind', v => numarRo(v) + ' cm'));
        init.Before = puneCamp(d, 'Before', una('ina', v => numarRo(v) + ' pt'));
        init.After = puneCamp(d, 'After', una('dupa', v => numarRo(v) + ' pt'));
        init.At = puneCamp(d, 'At', una('linie', v => numarRo(v)));
      }
      return init;
    }
    /* OK (sau Enter într-un câmp) */
    function okDialog() {
      if (!dialog) return 'fara_efect';
      const { baza, el: d, init } = dialog;
      const v = {};
      ['Size', 'Number of columns', 'Number of rows', 'Before text', 'Before', 'After', 'At'].forEach(k => { v[k] = citesteCamp(d, k); });
      if (baza === 'dialog.TableInsertDialog') {
        const k = Math.round(citesteNumar(v['Number of columns'])), r = Math.round(citesteNumar(v['Number of rows']));
        /* limitele 1..75 [presupus] (R11-12): în afara lor fereastra rămâne deschisă */
        if (!(k >= 1 && k <= 75 && r >= 1 && r <= 75)) return 'fara_efect';
        inchideDialog();
        return insereazaTabel(k, r);
      }
      inchideDialog();
      if (baza === 'dialog.FontDialogPowerPoint') {
        if (v.Size.trim() !== String(init.Size || '').trim()) { const r = puneMarime(citesteNumar(v.Size)); return r === 'fara_efect' ? 'ok' : r; }
        return 'ok';
      }
      if (baza === 'dialog.PowerPointParagraphDialog') {
        const pa = paragrafeAlese();
        if (!pa) return 'ok';
        const sch = {};
        [['Before text', 'ind', 0, 400], ['Before', 'ina', 0, 1584], ['After', 'dupa', 0, 1584], ['At', 'linie', 0, 9.99]].forEach(([et, k, lo, hi]) => {
          if (v[et].trim() === String(init[et] || '').trim()) return;
          const n = citesteNumar(v[et]);
          if (n >= lo && n <= hi) sch[k] = Math.round(n * 100) / 100;
        });
        if (!Object.keys(sch).length) return 'ok';
        schimba('paragraf', () => { for (let p = pa.a; p <= pa.b; p++) { const f = pa.f; if (!f.par) f.par = f.text.split('\n').map(() => parNou(f.centru)); f.par[p] = Object.assign({}, parLa(f, p), sch); } });
        return 'paragraf';
      }
      return 'ok';
    }
    /* săgețile More / Less ale casetelor Number of columns / rows: ±1 (spinner întreg) */
    function spinDialog(elx, dir) {
      const sp = elx.closest('[data-lh-tip="Spinner"]');
      const et = sp && sp.getAttribute('data-lh-eticheta');
      if (!dialog || dialog.baza !== 'dialog.TableInsertDialog' || !/^Number of (columns|rows)$/.test(et || '')) return I.nesimulat(dir > 0 ? 'More' : 'Less');
      const n = Math.round(citesteNumar(citesteCamp(dialog.el, et))) || 1;
      puneCamp(dialog.el, et, String(Math.max(1, Math.min(75, n + dir))));
      return 'camp';
    }
    function salveazaDinDialog() {
      const camp = dialog && dialog.el.querySelector('input[aria-label^="File name"]');
      let v = camp ? camp.value.trim() : '';
      if (!v) return 'fara_efect';
      if (!/\.pptx$/i.test(v)) v += '.pptx';
      M.nume = v;
      M.salvat = true;
      inchideDialog();
      if (backstage) inchideBackstage();
      actualizeazaBare();
      return 'salvare';
    }
    function inchideBackstage() { if (!backstage) return; backstage.strat.remove(); backstage = null; I.focus(); }
    function deschideBackstage(pagina) {
      inchideMeniu();
      if (!backstage) {
        const s = strat('lh-ap-strat-backstage');
        backstage = { strat: s, pagina: null };
        if (SUP['backstage.cadru']) { const c = desen('backstage.cadru'); pozitie(c, SUP['backstage.cadru'].r); c.classList.add('lh-ap-cadru'); s.appendChild(c); }
        const nav = desen('backstage.nav'); pozitie(nav, SUP['backstage.nav'].r); s.appendChild(nav);
        backstage.nav = nav;
      }
      return arataPaginaBackstage(pagina) ? 'backstage' : 'backstage';
    }
    function arataPaginaBackstage(pagina) {
      if (!backstage || !SUP['backstage.' + pagina]) return false;
      if (backstage.pag) backstage.pag.remove();
      const p = desen('backstage.' + pagina);
      pozitie(p, SUP['backstage.' + pagina].r);
      backstage.strat.appendChild(p);
      backstage.pag = p;
      backstage.pagina = pagina;
      backstage.nav.querySelectorAll('[data-lh-tip="ListItem"]').forEach(x => x.classList.toggle('activ', x.getAttribute('data-lh-eticheta') === pagina));
      return true;
    }
    function panouLateral(cheie) {
      if (panouLat) { const era = panouLat.cheie; panouLat.el.remove(); panouLat = null; if (era === cheie) return 'inchidere_panou'; }
      const s = SUP[cheie];
      if (!s) return I.nesimulat(cheie);
      const p = desen(cheie);
      p.style.position = 'absolute';
      p.style.left = 'auto';
      p.style.right = '2px';
      p.style.top = '2px';
      p.style.width = s.r[2] + 'px';
      p.style.height = Math.min(s.r[3], ZR[3] - 4) + 'px';
      p.classList.add('lh-ap-p-panou');
      zonaSup.appendChild(p);
      panouLat = { cheie, el: p };
      if (cheie === 'panou.AnimationCustom') randuriAnimatii();
      return 'panou';
    }
    /* Animation Pane: rândurile = animațiile diapozitivului activ, în ordine (numărul + efectul) */
    function randuriAnimatii() {
      const lst = panouLat && panouLat.el.querySelector('[data-lh-tip="List"]');
      if (!lst) return;
      lst.querySelectorAll('.lh-ap-p-anim-rand').forEach(x => x.remove());
      (D() ? D().animatii : []).forEach((a, i) => {
        const r = el('div', 'lh-ap-p-anim-rand', { 'aria-hidden': 'true' });
        r.style.top = (6 + i * 26) + 'px';
        r.textContent = (i + 1) + '  ' + a.efect;
        lst.appendChild(r);
      });
    }

    /* ============================================================ comenzile */
    function diapozitivNou(aspect) {
      const a = aspect || (D() && D().aspect === 'Title Slide' ? 'Title and Content' : (D() ? D().aspect : 'Title and Content'));
      schimba('diapozitiv_nou', () => { M.dia.splice(M.activ + 1, 0, diaNou(a)); M.activ++; sel = null; });
      return 'diapozitiv_nou';
    }
    function dubleaza() { schimba('dublare', () => { M.dia.splice(M.activ + 1, 0, clona(D())); M.activ++; sel = null; }); return 'dublare_diapozitiv'; }
    function stergeDiapozitiv() {
      if (M.dia.length <= 0) return 'fara_efect';
      schimba('stergere_diapozitiv', () => { M.dia.splice(M.activ, 1); M.activ = Math.max(0, Math.min(M.activ, M.dia.length - 1)); sel = null; });
      return 'stergere_diapozitiv';
    }
    /* Layout: casetele noului aspect primesc textele după fel (titlul → titlu, restul în ordine); casetele goale fără loc dispar,
       cele cu text rămân (powerpoint-aspect-title-only: conținutul gol dispare, forme 2 → 1); tabelele / imaginile rămân */
    function schimbaAspect(a) {
      schimba('aspect', () => {
        const d = D(), vechi = d.forme.filter(textual), alte = d.forme.filter(f => !textual(f));
        const noi = (ASPECTE[a] || []).map(p => formaNoua(p));
        const titluV = vechi.find(f => f.tip === 'titlu'), restV = vechi.filter(f => f !== titluV);
        noi.forEach(f => {
          const src = f.tip === 'titlu' ? titluV : restV.shift();
          if (src) {
            f.text = src.text; f.bold = src.bold; f.italic = src.italic; f.underline = src.underline;
            f.fm = clona(src.fm || []);
            f.par = (src.par || []).map(P => Object.assign({}, P, { al: P.al === parNou(src.centru).al ? parNou(f.centru).al : P.al }));
            if (src.marime !== (ASPECTE[d.aspect] || []).find(p => p.tip === src.tip)?.marime) f.marime = src.marime;
            src.__mutat = 1;
          }
        });
        const ramase = vechi.filter(f => !f.__mutat && f.text);
        d.forme = noi.concat(ramase, alte).map(f => { delete f.__mutat; return f; });
        d.aspect = a;
        sel = null;
      });
      return 'aspect';
    }
    /* PE CE se aplică formatarea:
       - caseta aleasă ca OBIECT (chenar plin) → tot textul ei + formatul casetei goale (powerpoint-bold-text: tot titlul);
       - text ales → doar bucata aleasă;
       - cursor strâns ÎN cuvânt → tot cuvântul ([presupus] ca în Word, scenarii_real/word-ctrl-b-fara-selectie.json; R11-11);
       - cursor strâns în afara unui cuvânt → doar formatul cu care se scrie de acum (sel.ins), documentul nu se schimbă. */
    function intervalFormat() {
      const f = formaSel();
      if (!sel || !textual(f)) return null;
      if (!sel.edit) return { a: 0, b: f.text.length, tot: true };
      const a = Math.min(sel.a, sel.b), b = Math.max(sel.a, sel.b);
      if (a !== b) return { a, b };
      const lit = ch => /[\p{L}\p{N}]/u.test(ch || '');
      if (a > 0 && lit(f.text[a - 1]) && lit(f.text[a])) {
        let x = a, y = a;
        while (x > 0 && lit(f.text[x - 1])) x--;
        while (y < f.text.length && lit(f.text[y])) y++;
        return { a: x, b: y };
      }
      return null;
    }
    function formateFolosite(f, iv) {
      if (!iv) return [sel.ins || fmtScriere(f, sel.b)];
      const v = [];
      for (let p = iv.a; p < iv.b; p++) if (f.text[p] !== '\n') v.push(fmLa(f, p));
      return v.length ? v : [fmDef(f)];
    }
    function aplicaFormat(fn) {
      const f = formaSel();
      if (!sel || !textual(f)) return null;
      const iv = intervalFormat();
      if (!iv) { const x = Object.assign({}, sel.ins || fmtScriere(f, sel.b)); fn(x, f); sel.ins = x; deseneaza(); return 'format_la_scriere'; }
      schimba('formatare', () => {
        for (let p = iv.a; p < iv.b; p++) { const x = Object.assign({}, fmLa(f, p)); fn(x, f); f.fm[p] = x; }
        if (iv.tot) { const x = fmDef(f); x.m = f.marime; fn(x, f); f.bold = x.b; f.italic = x.i; f.underline = x.u; f.marime = x.m; }
      });
      return 'ok';
    }
    const pasMarime = (m, dir) => {
      const i = MARIMI.findIndex(x => x >= m);
      return dir > 0 ? (MARIMI[m === MARIMI[i] ? i + 1 : i] || m + 10) : (MARIMI[(i < 0 ? MARIMI.length : i) - 1] || m);
    };
    function formatare(k) {
      const f = formaSel();
      if (!sel || !textual(f)) return 'fara_efect';
      const camp = { bold: 'b', italic: 'i', underline: 'u' }[k];
      let r;
      if (camp) {
        const v = !formateFolosite(f, intervalFormat()).every(x => x[camp]);
        r = aplicaFormat(x => { x[camp] = v; });
      } else r = aplicaFormat((x, ff) => { x.m = pasMarime(marimeLa(ff, x), k === 'mare' ? 1 : -1); });
      if (r === 'format_la_scriere') return r;
      return { bold: 'aldin', italic: 'cursiv', underline: 'subliniat', mare: 'marire_font', mic: 'micsorare_font' }[k];
    }
    /* o mărime scrisă (caseta Font Size din Home, Size din fereastra Font): 1-4000 pt, pași de 0,1 ([presupus] R11-11) */
    function citesteNumar(s) { const n = Number(String(s || '').replace(/[^\d,.\-]/g, '').replace(',', '.')); return String(s || '').trim() && Number.isFinite(n) ? n : NaN; }
    function puneMarime(n) {
      if (!(n >= 1 && n <= 4000)) return 'fara_efect';
      n = Math.round(n * 10) / 10;
      return aplicaFormat(x => { x.m = n; }) === 'format_la_scriere' ? 'format_la_scriere' : 'marime_font';
    }
    const numarRo = n => String(Math.round(n * 100) / 100).replace('.', ',');
    /* formatul arătat de panglică: toată bucata aleasă (Bold apăsat = toată aldină; mărimea = una singură, altfel caseta goală) */
    function formatAfisat() {
      const f = formaSel();
      if (!sel || !textual(f)) return null;
      const iv = sel.edit ? (sel.a !== sel.b ? { a: Math.min(sel.a, sel.b), b: Math.max(sel.a, sel.b) } : null) : { a: 0, b: f.text.length };
      const v = formateFolosite(f, iv), m = v.map(x => marimeLa(f, x));
      return { b: v.every(x => x.b), i: v.every(x => x.i), u: v.every(x => x.u), m: m.every(x => x === m[0]) ? m[0] : null,
        amestec: v.some(x => x.b) !== v.every(x => x.b) || v.some(x => x.i) !== v.every(x => x.i), amestecU: v.some(x => x.u) !== v.every(x => x.u) };
    }
    function aplicaGalerie(fel, v) {
      if (fel === 'tema') { schimba('tema', () => { M.tema = v; }); return 'tema'; }
      if (fel === 'tranzitie') { schimba('tranzitie', () => { D().tranzitie = v === 'None' ? null : v; }); return 'tranzitie'; }
      if (fel === 'animatie') {
        if (!formaSel()) return 'fara_efect';
        /* galeria Animations ÎNLOCUIEȘTE efectul casetei (Add Animation adaugă) — R11-7 */
        schimba('animatie', () => { const d = M.dia[sel.d]; d.animatii = d.animatii.filter(a => a.s !== sel.s); if (v !== 'None') d.animatii.push({ s: sel.s, efect: v }); });
        return 'animatie';
      }
      return 'fara_efect';
    }
    function insereazaTabel(k, r) {
      schimba('tabel', () => {
        const w = Math.min(828, k * 120), h = r * 40;
        D().forme.push({ tip: 'tabel', randuri: r, coloane: k, text: '', x: (SL.w - w) / 2, y: (SL.h - h) / 2, w, h });
        sel = { d: M.activ, s: D().forme.length - 1, edit: false };
      });
      return 'tabel';
    }
    function salveaza() {
      if (M.nume) { M.salvat = true; return 'salvare'; }
      deschideBackstage('Save As');
      return 'pagina_backstage';
    }
    function anuleaza() { const x = H.anuleaza(inst()); if (!x) return 'fara_efect'; puneInst(x); deseneaza(); return 'anulare'; }
    function reface() { const x = H.reface(inst()); if (!x) return 'fara_efect'; puneInst(x); deseneaza(); return 'refacere'; }
    /* expunerea (F5 / From Beginning): diapozitivele pe tot ecranul aplicației; clic / → / Spațiu = următorul, Esc = ieșire */
    function expunere(de) {
      inchideMeniu();
      M.expunere = { i: de, el: strat('lh-ap-p-expunere') };
      arataExpunere();
      return 'expunere';
    }
    function arataExpunere() {
      const x = M.expunere;
      if (!x) return;
      if (x.i >= M.dia.length) { x.el.innerHTML = ''; return; }
      const z = Math.min(root.clientWidth / SL.w, root.clientHeight / SL.h), d = M.dia[x.i];
      x.el.innerHTML = '<div class="lh-ap-p-slide lh-ap-p-slide-exp" data-lh-tema="' + esc(M.tema) + '" style="width:' + SL.w * z + 'px;height:' + SL.h * z + 'px"></div>';
      const s = x.el.firstChild;
      d.forme.forEach(f => { const e = el('div', 'lh-ap-p-forma', { style: stilForma(f, z) }); e.innerHTML = continutForma(f, z, false); s.appendChild(e); });
    }
    function pasExpunere(k) {
      const x = M.expunere;
      if (!x) return 'fara_efect';
      if (k < 0) { x.i = Math.max(0, x.i - 1); arataExpunere(); return 'diapozitiv_anterior'; }
      if (x.i >= M.dia.length) return iesiExpunere();
      x.i++;
      arataExpunere();
      return 'diapozitiv_urmator';
    }
    function iesiExpunere() { if (!M.expunere) return 'fara_efect'; M.expunere.el.remove(); M.expunere = null; I.focus(); return 'iesire_expunere'; }

    function idDin(elx) { const x = elx.closest('[data-lh-id-mso]'); return x ? x.getAttribute('data-lh-id-mso') : null; }
    function apasaComanda(elx, tinta, v) {
      inchideMeniu();
      const idm = idDin(elx), n = elx.__nod || {};
      if (elx.getAttribute('aria-disabled') === 'true') return 'indisponibil';
      const gal = elx.closest('[data-lh-id-mso]') && GALERII[idm];
      if (gal) {
        if (n.t === 'ListItem') return aplicaGalerie(gal, n.e);
        if (n.t === 'Button') { const c = elx.closest('[data-lh-id-mso]').querySelector('.lh-ap-p-galerie-caseta'); if (c) c.classList.toggle('lh-ap-p-galerie-deschisa'); return 'galerie'; }
        return 'fara_efect';
      }
      switch (idm) {
        case 'FileSave': return salveaza();
        case 'Undo': return anuleaza();
        case 'Undo_Dropdown': return I.nesimulat('Undo ▾');
        case 'RedoOrRepeat': return reface();
        case 'SlideShowFromBeginning': return expunere(0);
        case 'SlideShowFromCurrent': return expunere(M.activ);
        case 'SlideNewGallery': case 'SlideNewGalleryInsert': return diapozitivNou();
        case 'SlideNewGallery_Dropdown': return listaAspecte(elx, 'diapozitiv_nou');
        case 'SlideLayoutGallery': return listaAspecte(elx, 'aspect');
        case 'Bold': return formatare('bold');
        case 'Italic': return formatare('italic');
        case 'Underline': return formatare('underline');
        case 'FontSizeIncrease': return formatare('mare');
        case 'FontSizeDecrease': return formatare('mic');
        case 'TableInsertGallery': return grilaTabel(elx);
        case 'FontSize': {
          /* clic în caseta Font Size = textul ei ales, gata de scris; săgeata ▾ = lista mărimilor, NEcapturată (R11-1) */
          const inp = tgClic && tgClic.closest && tgClic.closest('input');
          if (inp && !inp.readOnly) { try { inp.focus(); inp.select(); } catch (e) { /* */ } return 'camp'; }
          return I.nesimulat('Font Size');
        }
        case 'SlideTransitionApplyToAll': {
          const t = D() && D().tranzitie;
          schimba('tranzitie_toate', () => M.dia.forEach(d => { d.tranzitie = t; }));
          return 'tranzitie_toate';
        }
        case 'TransitionPreview': case 'AnimationPreview': return 'previzualizare';
        case 'AnimationCustom': return panouLateral('panou.AnimationCustom');
        default: break;
      }
      if (idm && date.lansatoare[idm]) return deschideDialog(date.lansatoare[idm]) ? 'fereastra' : I.nesimulat(v);
      return I.nesimulat(n.e || v || tinta);
    }
    function apasaMeniu(elx, v) {
      const lista = meniu && meniu.getAttribute('data-lh-lista');
      inchideMeniu();
      if (lista === 'aspect') return schimbaAspect(v);
      if (lista === 'diapozitiv_nou') return diapozitivNou(v);
      if (lista === 'tabel') {
        if (v === 'Insert Table...') return deschideDialog('dialog.TableInsertDialog') ? 'fereastra' : I.nesimulat(v);
        const m = /^(\d+)x(\d+) Table$/.exec(v);
        return m ? insereazaTabel(+m[1], +m[2]) : 'fara_efect';
      }
      switch (v) {
        case 'New Slide': return diapozitivNou();
        case 'Duplicate Slide': return dubleaza();
        case 'Delete Slide': return stergeDiapozitiv();
        case 'Format Background...': return panouLateral('panou.LaunchFormatBackground');
        case 'Font...': return deschideDialog('dialog.FontDialogPowerPoint') ? 'fereastra' : I.nesimulat(v);
        case 'Paragraph...': return deschideDialog('dialog.PowerPointParagraphDialog') ? 'fereastra' : I.nesimulat(v);
        default: return I.nesimulat(v);
      }
    }

    /* ============================================================ textul casetelor */
    function offsetDin(fe, x, y) {
      const tx = fe.querySelector('.lh-ap-p-text');
      const f = forma(M.activ, sel ? sel.s : 0);
      if (!tx || !f) return 0;
      let r = null;
      try { r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null; } catch (e) { r = null; }
      /* paragraful apăsat (blocurile .lh-ap-p-par), apoi caracterele de text din el până la punct; în afara textului = capătul
         paragrafului de la înălțimea punctului */
      const pars = [...tx.querySelectorAll('.lh-ap-p-par')];
      const inceput = i => f.text.split('\n').slice(0, i).reduce((s, x) => s + x.length + 1, 0);
      const lung = i => (f.text.split('\n')[i] || '').length;
      let pd = r && tx.contains(r.startContainer) ? (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement).closest('.lh-ap-p-par') : null;
      if (!pd || !tx.contains(pd)) {
        let i = pars.findIndex(p => y < p.getBoundingClientRect().bottom);
        if (i < 0) i = pars.length - 1;
        return i < 0 ? f.text.length : inceput(i) + lung(i);
      }
      const i = pars.indexOf(pd);
      const tinta = r.startContainer.nodeType === 1 ? r.startContainer.childNodes[r.startOffset] || null : r.startContainer;
      let k = 0, gasit = false;
      const umbla = n => {
        if (n === tinta) { if (n.nodeType === 3) k += r.startOffset; return true; }
        if (n.nodeType === 3) { k += n.nodeValue.length; return false; }
        if (n.getAttribute && n.getAttribute('aria-hidden') === 'true') return false;
        for (const c of n.childNodes) if (umbla(c)) return true;
        return n === r.startContainer;   // punctul = după ultimul copil al elementului
      };
      gasit = umbla(pd);
      if (!gasit && r.startContainer === pd) k = Math.min(k, lung(i));
      return Math.max(0, Math.min(f.text.length, inceput(i) + Math.min(k, lung(i))));
    }
    function scrie(t, fms) {
      const f = formaSel();
      if (!sel || !textual(f)) return 'fara_efect';
      if (!sel.edit) { sel.edit = true; sel.a = sel.b = f.text.length; sel.ins = null; }
      schimba('tastare', () => {
        const a = Math.min(sel.a, sel.b), b = Math.max(sel.a, sel.b);
        /* textul scris peste o bucată aleasă ia formatul primului ei caracter */
        const fmt = sel.ins || (a !== b ? fmLa(f, a) : fmtScriere(f, a));
        inlocuieste(f, a, b, t, fmt, fms);
        sel.a = sel.b = a + t.length;
        sel.ins = null;
      });
      return 'scriere';
    }
    function sterge(inapoi) {
      const f = formaSel();
      if (!sel) return M.panou === 'miniaturi' ? stergeDiapozitiv() : 'fara_efect';
      if (!sel.edit) {   // caseta aleasă ca obiect: Delete o șterge (o casetă de aspect goală rămâne — R11-8, [NEVERIFICAT])
        schimba('stergere_forma', () => { M.dia[sel.d].forme.splice(sel.s, 1); M.dia[sel.d].animatii = M.dia[sel.d].animatii.filter(x => x.s !== sel.s).map(x => (x.s > sel.s ? { s: x.s - 1, efect: x.efect } : x)); sel = null; });
        return 'stergere_forma';
      }
      let a = Math.min(sel.a, sel.b), b = Math.max(sel.a, sel.b);
      if (a === b) { if (inapoi) a = Math.max(0, a - 1); else b = Math.min(f.text.length, b + 1); }
      if (a === b) return 'fara_efect';
      schimba('tastare', () => { inlocuieste(f, a, b, ''); sel.a = sel.b = a; sel.ins = null; });
      return inapoi ? 'stergere_inapoi' : 'stergere_inainte';
    }

    /* ============================================================ gesturile (aplicatii.js › leagaGesturi le cheamă) */
    I.la = {};
    let ancora = null;
    const inZona = t => !!(t && t.closest && t.closest('.lh-ap-p-zona'));
    I.la.jos = (e, tinta) => {
      const tg = e.target;
      if (meniu && !meniu.contains(tg) && !(tg.closest && tg.closest('[data-lh-id-mso="SlideLayoutGallery"],[data-lh-id-mso="TableInsertGallery"],[data-lh-id-mso="SlideNewGallery"]'))) inchideMeniu();
      ancora = null;
      if (M.expunere || dialog || backstage) return null;
      const deTinut = () => setTimeout(() => { if (!dialog && !backstage) I.focus(); }, 0);
      if (!inZona(tg)) { if (!(tg.closest && tg.closest('input,textarea,select'))) deTinut(); return null; }
      /* apăsarea în zonă redesenează diapozitivul: elementul apăsat iese din DOM, iar focusul implicit al lui mousedown ar
         cădea pe <body> — prima literă tastată imediat după clic s-ar pierde (proba_powerpoint, „Lava” → „ava”). Fără
         mousedown-ul de compatibilitate, focusul rămâne în intrarea documentului, pus ACUM. */
      if (e.preventDefault) e.preventDefault();
      I.focus();
      deTinut();
      const [fel, v] = [(tinta || '').split(':')[0], (tinta || '').slice((tinta || '').indexOf(':') + 1)];
      H.rupe();
      if (fel === 'miniatura') {
        M.activ = +v - 1; M.panou = 'miniaturi'; sel = null; deseneaza();
        ancora = { mini: M.activ, y0: e.clientY };
        return 'tragere';
      }
      M.panou = 'diapozitiv';
      if (fel === 'margine_forma' || fel === 'forma') {
        const [d, s] = v.split('/').map(x => +x - 1);
        const f = forma(d, s);
        if (!f) return null;
        if (fel === 'margine_forma' || (sel && sel.d === d && sel.s === s && !sel.edit) || !textual(f)) {
          sel = { d, s, edit: false };
          ancora = { muta: true, x0: e.clientX, y0: e.clientY, fx: f.x, fy: f.y, ina: inst() };
          deseneaza();
          return 'tragere';
        }
        const nou = !(sel && sel.d === d && sel.s === s && sel.edit);
        sel = { d, s, edit: true, a: 0, b: 0 };
        if (nou) deseneaza();
        const fe = slide.querySelector('[data-lh-tinta="forma"][data-lh-id="' + (d + 1) + '/' + (s + 1) + '"]');
        const k = fe ? offsetDin(fe, e.clientX, e.clientY) : f.text.length;
        sel.a = sel.b = (e.shiftKey && !nou) ? sel.a : k;
        sel.b = k;
        deseneaza();
        ancora = { text: true };
        return 'selectie';
      }
      sel = null;
      deseneaza();
      return null;
    };
    I.la.misca = (e) => {
      if (!ancora) return;
      if (ancora.muta) {
        const f = formaSel();
        if (!f) return;
        f.x = ancora.fx + (e.clientX - ancora.x0) / Z;
        f.y = ancora.fy + (e.clientY - ancora.y0) / Z;
        ancora.mutat = true;
        deseneazaDiapozitiv();
        return;
      }
      if (ancora.text && sel && sel.edit) {
        const fe = slide.querySelector('.lh-ap-p-editare');
        if (fe) { sel.b = offsetDin(fe, e.clientX, e.clientY); deseneazaDiapozitiv(); }
      }
    };
    I.la.sus = (e, j, g) => {
      const an = ancora;
      ancora = null;
      if (!g || !an) return null;
      if (an.muta) {
        if (!an.mutat) return 'fara_efect';
        H.inainte('mutare_forma', an.ina);
        M.salvat = false;
        deseneaza();
        return 'mutare_forma';
      }
      if (an.text) { deseneaza(); return 'selectare_text'; }
      if (an.mini != null) {
        const rs = [...mini.querySelectorAll('.lh-ap-p-mini')];
        let k = rs.findIndex(r => { const b = r.getBoundingClientRect(); return e.clientY < b.top + b.height / 2; });
        if (k < 0) k = rs.length;
        if (k > an.mini) k--;
        if (k === an.mini) return 'fara_efect';
        schimba('mutare_diapozitiv', () => { const [d] = M.dia.splice(an.mini, 1); M.dia.splice(k, 0, d); M.activ = k; });
        return 'mutare_diapozitiv';
      }
      return null;
    };
    let tgClic = null;
    I.la.clic = (tinta, e, n, g) => {
      const tg = e.target;
      tgClic = tg;
      const elx = tg && tg.closest ? tg.closest('[data-lh-tinta]') : null;
      if (M.expunere) return pasExpunere(1);
      if (!tinta) return null;
      const fel = tinta.split(':')[0], v = tinta.slice(fel.length + 1);
      if (fel === 'miniatura') { if (isNaN(e.clientX)) { M.activ = +v - 1; M.panou = 'miniaturi'; sel = null; deseneaza(); } return 'alegere_diapozitiv'; }
      if (fel === 'margine_forma') return 'alegere_forma';
      if (fel === 'forma') return sel && sel.edit ? 'cursor_text' : 'alegere_forma';
      if (fel === 'diapozitiv') return 'deselectare';
      if (!elx || !root.contains(elx)) return null;
      if (fel === 'fila') {
        if (v === 'File') return deschideBackstage('Home');
        if (backstage) inchideBackstage();
        return activeazaFila(elx.getAttribute('data-lh-id-mso')) ? 'fila' : I.nesimulat(v);
      }
      if (fel === 'backstage') {
        const nb = elx.__nod || {};
        if (nb.id === 'FileTabButton' || v === 'Back') { inchideBackstage(); return 'inapoi'; }
        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat(v);
        if (elx.closest('[data-lh-suprafata="backstage.nav"]') && nb.t === 'ListItem') {
          if (nb.a === 0) return 'indisponibil';
          if (v === 'Save') return M.nume ? (M.salvat = true, inchideBackstage(), 'salvare') : (arataPaginaBackstage('Save As') ? 'pagina_backstage' : I.nesimulat(v));
          return arataPaginaBackstage(v) ? 'pagina_backstage' : I.nesimulat(v);
        }
        return I.nesimulat(v);
      }
      if (fel === 'dialog_salvare' && dialog) return v === 'Save' ? salveazaDinDialog() : (inchideDialog(), 'anulare');
      if (fel === 'camp') return 'camp';
      if (fel === 'fereastra' && dialog) {
        if (v === 'OK') return okDialog();
        if (v === 'More' || v === 'Less') return spinDialog(elx, v === 'More' ? 1 : -1);
        if (v === 'Insert') { inchideDialog(); return 'ok'; }
        if (/^(Cancel|Închidere|Close)$/.test(v)) { inchideDialog(); return 'anulare'; }
        return I.nesimulat(v);
      }
      if (dialog && dialog.strat.contains(elx)) return I.nesimulat(v);
      if (panouLat && panouLat.el.contains(elx)) return /Close|Închidere/.test(v) ? panouLateral(panouLat.cheie) : I.nesimulat(v);
      if (fel === 'meniu' && meniu && meniu.contains(elx)) return apasaMeniu(elx, v);
      if (fel === 'acces_rapid' || fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return apasaComanda(elx, tinta, v);
      if (fel === 'zoom' || fel === 'bara_stare' || fel === 'bara_titlu' || fel === 'cautare' || fel === 'buton') return I.nesimulat((elx.__nod || {}).e || v || tinta);
      return I.nesimulat(v || tinta);
    };
    /* dublu clic în text = cuvântul ales */
    I.la.dublu = (tinta) => {
      const f = formaSel();
      if (!/^forma:/.test(tinta || '') || !sel || !sel.edit || !textual(f)) return null;
      const t = f.text, k = sel.b;
      let a = k, b = k;
      while (a > 0 && /[\p{L}\p{N}]/u.test(t[a - 1])) a--;
      while (b < t.length && /[\p{L}\p{N}]/u.test(t[b])) b++;
      sel.a = a; sel.b = b; sel.ins = null;
      deseneaza();
      return 'selectare_cuvant';
    };
    I.la.dreapta = (tinta, e) => {
      const fel = (tinta || '').split(':')[0], v = (tinta || '').slice(fel.length + 1);
      if (M.expunere || dialog || backstage) return 'fara_efect';
      if (fel === 'miniatura') { M.activ = +v - 1; M.panou = 'miniaturi'; sel = null; deseneaza(); return meniuContextual('miniatura', e.clientX, e.clientY) ? 'meniu_contextual' : 'fara_efect'; }
      if (fel === 'forma' || fel === 'margine_forma') {
        const [d, s] = v.split('/').map(x => +x - 1);
        if (!(sel && sel.d === d && sel.s === s)) { const f = forma(d, s); sel = { d, s, edit: textual(f), a: f ? f.text.length : 0, b: f ? f.text.length : 0 }; }
        M.panou = 'diapozitiv';
        deseneaza();
        return meniuContextual(textual(formaSel()) ? 'text' : 'diapozitiv', e.clientX, e.clientY) ? 'meniu_contextual' : 'fara_efect';
      }
      if (fel === 'diapozitiv' || inZona(e.target)) { sel = null; M.panou = 'diapozitiv'; deseneaza(); return meniuContextual('diapozitiv', e.clientX, e.clientY) ? 'meniu_contextual' : 'fara_efect'; }
      return 'fara_efect';
    };
    I.la.tasta = (e, g, inCamp) => {
      const k = e.key, ctrl = e.ctrlKey || e.metaKey;
      if (M.expunere) {
        if (k === 'Escape') return iesiExpunere();
        if (/^(ArrowRight|ArrowDown|PageDown|Enter| |n)$/.test(k)) { e.preventDefault(); return pasExpunere(1); }
        if (/^(ArrowLeft|ArrowUp|PageUp|Backspace|p)$/.test(k)) { e.preventDefault(); return pasExpunere(-1); }
        return 'fara_efect';
      }
      if (inCamp) {
        if (dialog && k === 'Escape') { inchideDialog(); return 'anulare'; }
        if (dialog && k === 'Enter' && dialog.baza === 'dialog.FileSaveAs') { e.preventDefault(); I.activat = 'dialog_salvare:Save'; return salveazaDinDialog(); }
        /* Enter într-un câmp al ferestrei = butonul implicit OK (api §4 › activat) */
        if (dialog && k === 'Enter' && /^dialog\.(FontDialogPowerPoint|PowerPointParagraphDialog|TableInsertDialog)$/.test(dialog.baza)) { e.preventDefault(); I.activat = 'fereastra:OK'; return okDialog(); }
        /* caseta Font Size din Home: o mărime + Enter se aplică pe textul ales; Esc renunță; focusul se întoarce în diapozitiv */
        const cfs = e.target && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]');
        if (cfs && k === 'Enter') { e.preventDefault(); const r = puneMarime(citesteNumar(e.target.value)); I.focus(); actualizeazaPanglica(); return r; }
        if (cfs && k === 'Escape') { e.preventDefault(); I.focus(); actualizeazaPanglica(); return 'anulare'; }
        return null;
      }
      if (meniu && k === 'Escape') { inchideMeniu(); return 'inchidere_meniu'; }
      if (dialog) {
        if (k === 'Escape') { inchideDialog(); return 'anulare'; }
        if (k === 'Enter' && /^dialog\.(FontDialogPowerPoint|PowerPointParagraphDialog|TableInsertDialog)$/.test(dialog.baza)) { e.preventDefault(); I.activat = 'fereastra:OK'; return okDialog(); }
        return 'fara_efect';
      }
      if (backstage) { if (k === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }
      if (g === 'tasta_f5') { e.preventDefault(); return expunere(e.shiftKey ? M.activ : 0); }
      if (g === 'tasta_f12') { e.preventDefault(); return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat('Save As'); }
      if (ctrl) {
        switch (g) {
          case 'ctrl_z': return anuleaza();
          case 'ctrl_y': return reface();
          case 'ctrl_m': return diapozitivNou();
          case 'ctrl_d': return M.panou === 'miniaturi' || !sel ? dubleaza() : I.nesimulat('Duplicate (Ctrl+D)');
          case 'ctrl_b': return formatare('bold');
          case 'ctrl_i': return formatare('italic');
          case 'ctrl_u': return formatare('underline');
          case 'ctrl_s': return salveaza();
          case 'ctrl_a':
            if (sel && sel.edit && formaSel()) { sel.a = 0; sel.b = formaSel().text.length; deseneaza(); return 'selectare_tot'; }
            return I.nesimulat('Select All (Ctrl+A)');
          case 'ctrl_c': case 'ctrl_x': {
            const f = formaSel();
            if (sel && sel.edit && f && sel.a !== sel.b) {
              const a = Math.min(sel.a, sel.b), b = Math.max(sel.a, sel.b);
              M.clip = { text: f.text.slice(a, b), fm: clona(Array.from({ length: b - a }, (_, k) => fmLa(f, a + k))) };
              return g === 'ctrl_x' ? sterge(true) && 'decupare' : 'copiere';
            }
            if (M.panou === 'miniaturi' && D()) { M.clip = { dia: clona(D()) }; return g === 'ctrl_x' ? (stergeDiapozitiv(), 'decupare') : 'copiere'; }
            return 'fara_efect';
          }
          case 'ctrl_v':
            if (!M.clip) return 'fara_efect';
            if (M.clip.text != null && sel) return scrie(M.clip.text, M.clip.fm);
            if (M.clip.dia) { schimba('lipire', () => { M.dia.splice(M.activ + 1, 0, clona(M.clip.dia)); M.activ++; sel = null; }); return 'lipire'; }
            return 'fara_efect';
          default: return g && /^ctrl_/.test(g) ? I.nesimulat('Ctrl+' + g.slice(-1).toUpperCase()) : null;
        }
      }
      if (g === 'tasta_esc') {
        if (sel && sel.edit) { sel.edit = false; deseneaza(); return 'alegere_forma'; }
        if (sel) { sel = null; deseneaza(); return 'deselectare'; }
        return 'fara_efect';
      }
      if (g === 'tasta_delete' || g === 'tasta_backspace') { e.preventDefault(); return sterge(g === 'tasta_backspace'); }
      if (g === 'tasta_enter') {
        e.preventDefault();
        if (sel && sel.edit) return scrie('\n');
        if (M.panou === 'miniaturi') return diapozitivNou();
        if (sel && textual(formaSel())) { sel.edit = true; sel.a = 0; sel.b = formaSel().text.length; deseneaza(); return 'editare_text'; }
        return 'fara_efect';
      }
      if (g === 'sageti') {
        e.preventDefault();
        if (sel && sel.edit && formaSel()) {
          const t = formaSel().text, dr = /Right|Down/.test(k) ? 1 : -1;
          const p = Math.max(0, Math.min(t.length, sel.b + dr));
          sel.b = p; if (!e.shiftKey) sel.a = p;
          sel.ins = null;
          deseneaza();
          return 'cursor';
        }
        if (M.panou === 'miniaturi') { const i = Math.max(0, Math.min(M.dia.length - 1, M.activ + (/Down|Right/.test(k) ? 1 : -1))); if (i === M.activ) return 'fara_efect'; M.activ = i; deseneaza(); return 'alegere_diapozitiv'; }
        return 'fara_efect';
      }
      if (g === 'tasta_home_end' && sel && sel.edit && formaSel()) { e.preventDefault(); const p = k === 'Home' ? 0 : formaSel().text.length; sel.b = p; if (!e.shiftKey) sel.a = p; sel.ins = null; deseneaza(); return 'cursor'; }
      if (g === 'tastare') {
        e.preventDefault();
        if (sel && textual(formaSel())) return scrie(k);
        return 'fara_efect';
      }
      return null;
    };
    I.la.text = v => (dialog || backstage || M.expunere) ? 'fara_efect' : scrie(v);
    I.la.sterge = g => (dialog || backstage || M.expunere) ? 'fara_efect' : sterge(g === 'tasta_backspace');

    /* plasa oracolelor (CONVENTIE_ARBORE.md §4.6): deschide o suprafață fără gest */
    I.deschideSuprafata = cheie => {
      if (/^panglica(_context)?\./.test(cheie)) return activeazaFila(cheie.split('.')[1]);
      if (cheie === 'backstage.nav' || cheie === 'backstage.cadru') return !!deschideBackstage('Home');
      if (/^backstage\./.test(cheie)) { deschideBackstage('Home'); return arataPaginaBackstage(cheie.slice(10)); }
      if (/^meniu_contextual\./.test(cheie)) { const b = root.getBoundingClientRect(); return meniuContextual(cheie.split('.')[1], b.left + 300, b.top + 220); }
      if (/^dialog\./.test(cheie)) return deschideDialog(cheie.split('#')[0]);
      if (/^panou\./.test(cheie)) return panouLateral(cheie) === 'panou';
      return false;
    };
    I.distruge = () => { if (I._ro) try { I._ro.disconnect(); } catch (e) { /* */ } };
    if (typeof ResizeObserver === 'function') { I._ro = new ResizeObserver(() => { if (root.isConnected) { deseneazaDiapozitiv(); deseneazaMiniaturi(); } }); I._ro.observe(pane); }
    activeazaFila('TabHome');
    deseneaza();
    if (!scenariu) requestAnimationFrame(() => { if (root.isConnected) deseneaza(); });
  }

  L._modul('powerpoint', {
    creeaza,
    /* O5 › tragere (§4.4): caseta aleasă ca obiect (clic pe marginea ei), apoi tragerea din interior o mută */
    demonstratie: { tragere: { pregatire: ['forma:1/1', 'margine_forma:1/1'] } }
  });
})();
