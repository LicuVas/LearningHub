# -*- coding: utf-8 -*-
"""Reparațiile rundei 2 (cele 6 GRAV din runde/1/critic.md) ca înlocuiri exacte; fiecare bucată veche trebuie să apară
O SINGURĂ dată, altfel scriptul se oprește fără să scrie nimic.
    python repara_r2.py <dosarul aplicatii/>
"""
import sys
from pathlib import Path

R = []   # (fișier, vechi, nou)

# ---------------------------------------------------------------- aplicatii.js
R.append(("aplicatii.js", """    /* textul venit fără keydown utilizabil (telefon, IME, diacritice): evenimentul „input” pe intrarea documentului */
    if (I.intrare) {
      I.intrare.addEventListener('beforeinput', e => {
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
          e.preventDefault();
          const ina = st();
          const g = e.inputType === 'deleteContentBackward' ? 'tasta_backspace' : 'tasta_delete';
          const act = I.la && I.la.sterge ? I.la.sterge(g) : g;
          emite(I, g, act, I.zonaTinta, ina);
        }
      });
      I.intrare.addEventListener('input', () => {
        const v = I.intrare.value;
        I.intrare.value = '';
        if (!v) return;
        const ina = st();
        const act = I.la && I.la.text ? I.la.text(v) : 'scriere';
        emite(I, 'tastare', act, I.zonaTinta, ina);
      });
    }
  }""", """    /* textul venit fără keydown utilizabil (telefon, IME, diacritice): evenimentul „input” pe intrarea documentului.
       Tastaturile care COMPUN cuvântul (Gboard, Samsung Keyboard, IME) trimit „input” cu isComposing la fiecare literă:
       cât compun, caseta NU se golește și documentul nu se schimbă; textul compus pleacă O SINGURĂ dată, la sfârșitul
       compunerii, oricare ar fi ordinea „input” / „compositionend” (Chrome, Safari). Cuvântul în lucru se vede la cursor
       (clasa lh-ap-compune). Critic runda 1, GRAV 1. */
    if (I.intrare) {
      const X = I.intrare;
      let compune = false;
      const trimite = tip => {
        const v = X.value;
        X.value = '';
        if (!v) return;
        const ina = st();
        const act = I.la && I.la.text ? I.la.text(v, { tip: tip || '' }) : 'scriere';
        emite(I, 'tastare', act || 'fara_efect', I.zonaTinta, ina);
      };
      const latime = () => { X.style.width = compune ? Math.max(1, [...X.value].length + 1) + 'ch' : ''; };
      X.addEventListener('compositionstart', () => { compune = true; r.classList.add('lh-ap-compune'); latime(); });
      X.addEventListener('compositionend', () => {
        compune = false;
        r.classList.remove('lh-ap-compune');
        latime();
        setTimeout(() => { if (!compune) trimite('insertFromComposition'); }, 0);
      });
      X.addEventListener('beforeinput', e => {
        if (compune || e.isComposing) return;   // ștergerile din timpul compunerii sunt ale casetei, nu ale documentului
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
          e.preventDefault();
          const ina = st();
          const g = e.inputType === 'deleteContentBackward' ? 'tasta_backspace' : 'tasta_delete';
          const act = I.la && I.la.sterge ? I.la.sterge(g) : g;
          emite(I, g, act, I.zonaTinta, ina);
        }
      });
      X.addEventListener('input', e => {
        if (compune || e.isComposing) { latime(); return; }
        trimite(e.inputType);
      });
    }
    /* tastele de acces (KeyTips): gestul elevului e o TASTĂ (§4), nu un clic. Efectul clicului pe element, fără
       MouseEvent sintetic și fără detectorul de dublu clic de mai sus (critic runda 1, GRAV 5). */
    I.activeazaTasta = (el, tasta) => {
      const t = tintaDin(I, el), ina = st();
      I.ultimaActiune = null;
      const ev = { target: el, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
        button: 0, detail: 0, tasta, preventDefault() {} };
      let act = null;
      if (I.la && I.la.clic) act = I.la.clic(t, ev, 1, 'tasta_acces');
      return emite(I, 'tasta_acces', act || I.ultimaActiune || 'tasta_acces', t, ina);
    };
    I.tastaFaraClic = (actiune, el) => emite(I, 'tasta_acces', actiune, tintaDin(I, el || document.activeElement), st());
  }"""))

R.append(("aplicatii.js", """  const NEGRESELI = new Set(['rotita', 'sageti', 'tasta_home_end', 'tasta_pagina']);""",
          """  const NEGRESELI = new Set(['rotita', 'sageti', 'tasta_home_end', 'tasta_pagina']);
  /* tastele de acces care doar ARATĂ literele sau așteaptă a doua literă nu schimbă nimic (ca săgețile): nu sunt greșeli;
     activarea unei comenzi prin tastă rămâne greșeală dacă nu e ținta pasului */
  const NAVIGARE_TA = new Set(['arata_taste_acces', 'prefix_tasta_acces']);"""))
R.append(("aplicatii.js", """      if (NEGRESELI.has(ev.gest)) return;""",
          """      if (NEGRESELI.has(ev.gest) || (ev.gest === 'tasta_acces' && NAVIGARE_TA.has(ev.actiune))) return;"""))

# ---------------------------------------------------------------- aplicatii.css
R.append(("aplicatii.css", """  font-size:16px;caret-color:transparent;color:transparent;background:transparent;z-index:-1}""",
          """  font-size:16px;caret-color:transparent;color:transparent;background:transparent;z-index:-1}
/* cuvântul în compunere (tastatura telefonului, IME) se vede la cursor până pleacă în document */
.lh-ap-compune .lh-ap-intrare{opacity:1;color:var(--lh-ap-text,#111);background:var(--lh-ap-fundal,#fff);z-index:3;
  text-decoration:underline;white-space:pre;height:1.4em}"""))

# ---------------------------------------------------------------- word.js
R.append(("word.js", """  const ALINIERI = { left: 'stanga', center: 'centru', right: 'dreapta', justify: 'stanga-dreapta' };
""", """  const ALINIERI = { left: 'stanga', center: 'centru', right: 'dreapta', justify: 'stanga-dreapta' };

  /* „Save this file” (Ctrl+S pe un document nou, Word M365). NU e în referința UIA: elementele vin DOAR din paginile
     Microsoft citate în runde/2/diferente.md D7 — „press CTRL+S to open the Save this file dialog box”
     (support.microsoft.com/en-US/Office/collab-files/save-office-files-to-your-favorite-folder); „enter a file name in the
     File name box” · „Click Save.” (support.microsoft.com/en-au/word/word-for-new-users); „the Location drop-down” · „open
     the full Save As window by selecting More save options” (support.microsoft.com/en-au/topic/a7f0a209-ad22-4212-bb53-
     6cd8e801a6fb). Locul „Documente” = folderul în care se deschide fereastra Save As a referinței (uia_word.json ›
     dialog.FileSaveAs). Geometria e a noastră: abatere propusă (de_aprobat.md A2-1), captura cerută (de_verificat.md R2-2). */
  const SALVARE_NOUA = 'dialog.SaveThisFile';
  function cuSalvareNoua(d) {
    if (!d || !d.suprafete || d.suprafete[SALVARE_NOUA]) return d;
    const x = 380, y = 170;
    const nod = { t: 'Window', e: 'Save this file', r: [x, y, 520, 236], c: [
      { t: 'TitleBar', e: 'Save this file', r: [x, y, 520, 40] },
      { t: 'Text', e: 'File name', r: [x + 24, y + 50, 472, 20] },
      { t: 'Edit', e: 'File name', v: '', r: [x + 24, y + 72, 472, 28] },
      { t: 'Text', e: 'Location', r: [x + 24, y + 110, 472, 20] },
      { t: 'ComboBox', e: 'Location', v: 'Documente', r: [x + 24, y + 132, 472, 28] },
      { t: 'Hyperlink', e: 'More save options', r: [x + 24, y + 190, 160, 26] },
      { t: 'Button', e: 'Save', r: [x + 408, y + 186, 88, 32] }] };
    return Object.assign({}, d, {
      suprafete: Object.assign({}, d.suprafete, { [SALVARE_NOUA]: nod }),
      dialoguri: Object.assign({}, d.dialoguri, { [SALVARE_NOUA]: { titlu: 'Save this file', file: [{ s: SALVARE_NOUA, fila: null }] } })
    });
  }
"""))
R.append(("word.js", """    const date = I.date, root = I.root;""",
          """    I.date = cuSalvareNoua(I.date);
    const date = I.date, root = I.root;"""))

# scrierea pe calea „input” (telefon): AutoCorect ca la tastatura fizică; cu un strat deschis documentul nu se schimbă
R.append(("word.js", """    I.la.text = v => { const r = scrie(v, false); actualizeaza(); return r; };
    I.la.sterge = g => { const r = g === 'tasta_backspace' ? backspace() : del(); actualizeaza(); return r; };""",
          """    /* textul venit pe calea „input” (telefon, IME): același AutoCorect ca pe tastatura fizică (scenarii_real/
       word-tastare-majuscula-automata.json), mai puțin lipirea / plasarea (critic runda 1, GRAV 6). Cu Backstage sau o
       fereastră deschisă, documentul nu se vede și nu se schimbă (GRAV 2). */
    I.la.text = (v, info) => {
      if (dialog || backstage) return 'fara_efect';
      const r = scrie(v, !/^insertFrom(Paste|Drop)/.test((info && info.tip) || ''));
      actualizeaza();
      return r;
    };
    I.la.sterge = g => {
      if (dialog || backstage) return 'fara_efect';
      const r = g === 'tasta_backspace' ? backspace() : del();
      actualizeaza();
      return r;
    };"""))

# focusul: straturile (dialog, Backstage) iau tastatura
R.append(("word.js", """    function inchideDialog() {
      if (!dialog) return;
      dialog.strat.remove();
      dialog = null;
      I.focus();
    }""", """    /* cu Backstage sau o fereastră deschisă, tastatura e a lor, nu a documentului (uia_word.json › backstage.nav și
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
      dialog.strat.remove();
      dialog = null;
      focusStrat();
    }"""))
R.append(("word.js", """      if (baza === 'dialog.FileSaveAs') {
        const prim = (M.P.find(p => p.t.trim()) || { t: '' }).t.trim();
        const propus = (prim ? prim.replace(/[\\\\/:*?"<>|]/g, '').slice(0, 60) : M.nume.replace(/\\.docx$/i, '')) + '.docx';
        M.dialogSalvare = { titlu: date.dialoguri[baza].titlu, nume_propus: propus, tip_propus: 'Word Document (*.docx)' };""",
          """      if (baza === 'dialog.FileSaveAs' || baza === SALVARE_NOUA) {
        const prim = (M.P.find(p => p.t.trim()) || { t: '' }).t.trim();
        const propus = (prim ? prim.replace(/[\\\\/:*?"<>|]/g, '').slice(0, 60) : M.nume.replace(/\\.docx$/i, '')) + '.docx';
        M.dialogSalvare = { titlu: date.dialoguri[baza].titlu, nume_propus: propus,
          tip_propus: baza === SALVARE_NOUA ? null : 'Word Document (*.docx)' };"""))
R.append(("word.js", """        if (dialog.baza === 'dialog.FileSaveAs') nf.value = dialog.propus;
        setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0);
      } else setTimeout(() => { try { s.focus && s.focus({ preventScroll: true }); } catch (e) { /* */ } }, 0);""",
          """        if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) nf.value = dialog.propus;
        setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0);
      } else {
        s.setAttribute('tabindex', '-1');
        setTimeout(() => { if (dialog && dialog.el === s) focusStrat(); }, 0);
      }"""))
R.append(("word.js", """      if (dialog.baza === 'dialog.FileSaveAs') return salveaza();""",
          """      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveaza();"""))
R.append(("word.js", """        backstage.nav = nav;
      }
      arataPaginaBackstage(pagina || 'Home');
    }""", """        backstage.nav = nav;
        s.setAttribute('tabindex', '-1');
      }
      arataPaginaBackstage(pagina || 'Home');
      focusStrat();
    }"""))

# OPT: câmpurile ferestrei noi + caseta Font Size editabilă
R.append(("word.js", """        if (ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile') {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^File name:?$/.test(n.e)) return null;
          if (ctx.cheie === 'dialog.FileSaveAs' && n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }""", """        if (ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA) {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^File name:?$/.test(n.e)) return null;
          if (ctx.cheie !== 'dialog.PictureInsertFromFile' && n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }"""))
R.append(("word.js", """        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile') && n.t === 'Edit' && /^File name/.test(n.e)) return true;""",
          """        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA) && n.t === 'Edit' && /^File name/.test(n.e)) return true;
        /* caseta Font Size: „type the size you want in the Font Size box” (support.microsoft.com/en-US/Office/fonts/change-the-font-size) */
        if (/^panglica/.test(ctx.cheie || '') && n.t === 'Edit' && n.e === 'Font Size') return true;"""))

# panglica: caseta Font Size nu e suprascrisă cât scrie elevul în ea
R.append(("word.js", """      if (mf) mf.value = String(marime(par, f0));""",
          """      if (mf && document.activeElement !== mf) mf.value = String(marime(par, f0));"""))

# CMD: clicul pe caseta Font Size = cursorul în casetă (nu mesajul „nesimulat”)
R.append(("word.js", """      FontSizeIncreaseWord: () => marimeFont(1), FontSizeDecreaseWord: () => marimeFont(-1),""",
          """      FontSizeIncreaseWord: () => marimeFont(1), FontSizeDecreaseWord: () => marimeFont(-1),
      FontSize: elx => { const c = elx.querySelector('input'); if (c && document.activeElement !== c) try { c.focus({ preventScroll: true }); } catch (x) { /* */ } return 'camp'; },"""))

# mărimea scrisă în casetă
R.append(("word.js", """    function comuta(camp) {""", """    /* caseta Font Size: o mărime scrisă + Enter se aplică pe selecție (fără selecție: pe cuvântul cursorului, ca Grow/Shrink,
       altfel pe ce se tastează de acum). Limitele: „Word: between 1 and 1638, in multiples of .5 (such as 10.5 or 105.5)”
       (support.microsoft.com/en-US/Office/fonts/change-the-font-size). Enter nu ajunge în document; focusul se întoarce în
       document. O valoare în afara limitelor nu schimbă nimic (mesajul lui Word: NEVERIFICAT, de_verificat.md R2-5). */
    function marimeScrisa(inp) {
      const n = Number(String(inp.value).trim().replace(',', '.'));
      let r = 'fara_efect';
      if (Number.isFinite(n) && n >= 1 && n <= 1638 && Number.isInteger(n * 2)) {
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
    function comuta(camp) {"""))

# tastele: Enter în Font Size; straturile nu lasă tastele să treacă; Ctrl+S pe document nou
R.append(("word.js", """      if (inCamp) {
        if (dialog && e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        return null;
      }
      if (dialog) {
        if (e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter') { e.preventDefault(); return implicitDialog(); }
        return null;
      }""", """      if (inCamp) {
        if (dialog && e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return marimeScrisa(e.target); }
        return null;
      }
      if (dialog) {
        if (e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter') { e.preventDefault(); return implicitDialog(); }
        return 'fara_efect';
      }"""))
R.append(("word.js", """      if (backstage) { if (e.key === 'Escape') { inchideBackstage(); return 'inapoi'; } return null; }""",
          """      if (backstage) { if (e.key === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }"""))
R.append(("word.js", """        /* un document deja salvat se salvează sub numele lui, fără alți pași; la prima salvare fereastra depinde de versiune
           („the Save As or Save this file window appears”, support.microsoft.com/en-au/word/word-for-new-users) — nedovedit aici */
        case 'ctrl_s': r = M.salvat ? 'salvare' : I.nesimulat('Ctrl+S'); break;""",
          """        /* un document deja salvat se salvează sub numele lui, fără alți pași; la prima salvare: „depending on the Word version,
           the Save As or Save this file window appears” (support.microsoft.com/en-au/word/word-for-new-users); în Word M365
           „press CTRL+S to open the Save this file dialog box” (support.microsoft.com/en-US/Office/collab-files/
           save-office-files-to-your-favorite-folder). Profilul word2007 (Word 2007 nu are „Save this file”) → Save As. */
        case 'ctrl_s': r = M.salvat ? 'salvare' : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Ctrl+S')); break;"""))

# clicurile în „Save this file”
R.append(("word.js", """      if (fel === 'fila_dialog' && dialog) {""",
          """      if (dialog && dialog.baza === SALVARE_NOUA) {
        /* „More save options” → fereastra Save As întreagă (din referință), cu numele scris de elev */
        if (v === 'More save options') {
          const scris = valoareCamp('camp:nume_fisier').trim();
          if (!deschideDialog('dialog.FileSaveAs')) return I.nesimulat(v);
          const nf = dialog.el.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
          if (scris && nf) { dialog.propus = scris; nf.value = scris; }
          return 'salvare_ca';
        }
        if (fel === 'camp' && v === 'Location') return I.nesimulat('Location ▾');   // rândurile listei: NEVERIFICAT (R2-2)
      }
      if (fel === 'fila_dialog' && dialog) {"""))

# tastele de acces: N niveluri (Alt, F, A, O), fără clicuri sintetice, cu evenimente de tastă
R.append(("word.js", """    const kt = { activ: false, fila: null, prefix: '', insigne: [] };
    function ktCurata() { kt.insigne.forEach(x => x.remove()); kt.insigne = []; }
    function ktIesi() { ktCurata(); kt.activ = false; kt.fila = null; kt.prefix = ''; }
    function ktTinte() {
      const R = root.getBoundingClientRect(), out = [];
      root.querySelectorAll('[data-lh-tip]').forEach(x => {
        const n = x.__nod;
        if (!n || !n.ta || !L._vizibil(x)) return;
        const p = String(n.ta).split(',').map(s => s.trim());
        if (p[0] !== 'Alt') return;
        if (!kt.fila && p.length === 2) out.push({ x, cheie: p[1].replace(/\\s+/g, '') });
        else if (kt.fila && p.length === 3 && p[1].replace(/\\s+/g, '') === kt.fila) out.push({ x, cheie: p[2].replace(/\\s+/g, '') });
      });""", """    /* kt.cale = literele apăsate deja (ex. ['F', 'A'] după Alt, F, A); fiecare nivel arată tastele elementelor care au
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
        const p = String(n.ta).split(',').map(s => s.replace(/\\s+/g, ''));
        if (p[0] !== 'Alt' || p.length !== cale.length + 2) return;
        for (let i = 0; i < cale.length; i++) if (p[i + 1] !== cale[i]) return;
        out.push({ x, cheie: p[p.length - 1] });
      });"""))
R.append(("word.js", """    function ktLitera(e) {
      if (!/^[a-z0-9]$/i.test(e.key)) return false;
      kt.prefix += e.key.toUpperCase();
      const { out } = ktTinte();
      const exact = out.find(o => o.cheie === kt.prefix);
      if (exact) {
        const fila = exact.x.getAttribute('data-lh-tip') === 'TabItem' ? kt.prefix : null;
        kt.prefix = '';
        exact.x.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        if (fila) { kt.fila = fila; ktArata(); } else ktIesi();
      } else if (out.some(o => o.cheie.indexOf(kt.prefix) === 0)) ktArata();
      else kt.prefix = kt.prefix.slice(0, -1);
      return true;
    }""", """    function ktLitera(e) {
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
    }"""))
R.append(("word.js", """      if (e.key === 'Escape') { if (kt.fila) { kt.fila = null; kt.prefix = ''; ktArata(); } else ktIesi(); return; }""",
          """      if (e.key === 'Escape') {
        /* Esc urcă un nivel; din Backstage (sau de pe primul nivel) iese din tastele de acces */
        if (kt.cale.length && !(backstage && kt.cale.length <= 1)) { kt.cale = kt.cale.slice(0, -1); kt.prefix = ''; ktArata(); }
        else ktIesi();
        I.tastaFaraClic('iesire_taste_acces');
        return;
      }"""))
R.append(("word.js", """      if (kt.activ) { ktIesi(); return; }
      if (dialog || backstage) return;
      kt.activ = true;
      ktArata();""", """      if (kt.activ) { ktIesi(); I.tastaFaraClic('iesire_taste_acces'); return; }
      if (dialog || backstage) return;
      kt.activ = true;
      ktArata();
      I.tastaFaraClic('arata_taste_acces');"""))


def main():
    d = Path(sys.argv[1])
    texte = {}
    for f, vechi, nou in R:
        t = texte.setdefault(f, (d / f).read_bytes().decode("utf-8"))
        n = t.count(vechi)
        if n != 1:
            print("NU SE POTRIVESTE (%d) in %s:\n%s" % (n, f, vechi[:200]))
            sys.exit(1)
        texte[f] = t.replace(vechi, nou)
    for f, t in texte.items():
        (d / f).write_bytes(t.encode("utf-8"))
    print("aplicat:", len(R), "inlocuiri in", sorted(texte))


if __name__ == "__main__":
    main()
