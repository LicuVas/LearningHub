/* fisiere.js — magazia de fișiere a bibliotecii (în memorie) + ferestrele Save As / Open / confirmare.
   Folosit de excel.js (File › Save As / Save / Open, F12, Browse din backstage). Se înregistrează ca modul
   „fisiere” (L._modul), deci excel.js îl ia din L._module.fisiere după ce L.gata s-a rezolvat.

   Magazia: dosare Desktop, Documente, Imagini, Descărcări (ca în lecția m1-l03: FOLDERE). Fiecare fișier:
   { n: 'nume.ext', tip: 'xlsx' | 'csv' | 'pdf' | 'png', cont, coleg }. cont: obiect (xlsx: {foi, fi} ca în excel.js),
   text (csv), șir PDF (pdf), null (png). Fișierele „coleg” sunt mostre (fără date ale elevilor).
   Numele nu țin cont de litere (ca Windows). Nimic nu se scrie pe disc: totul trăiește cât trăiește aplicația.

   Ferestrele: stil din aplicatii.css (variabilele --lh-ap-*), ca overlay peste rădăcina aplicației. Textele Excel
   (confirmările) sunt cele din lecția m1-l03 (registru-foi.js, MESAJE): cele în engleză, cu gloss românesc dedesubt.
   Unde Windows/Excel nu e implementat, cfg.nesimulat(eticheta) cere mesajul central (nimic tăcut). */
(function () {
  'use strict';
  const W = window;
  const L = W.LH && W.LH.aplicatii;
  if (!L) return;

  const DOSARE = ['Desktop', 'Documente', 'Imagini', 'Descărcări'];
  const INTERZISE = /[\\/:*?"<>|]/;
  const copie = x => (x == null ? x : (L._clona ? L._clona(x) : JSON.parse(JSON.stringify(x))));
  const cmp = (a, b) => a.n.localeCompare(b.n, 'ro', { sensitivity: 'base' });

  const TIPURI_SALVARE = [
    { cheie: 'xlsx', eticheta: 'Excel Workbook (*.xlsx)', ext: '.xlsx' },
    { cheie: 'csv', eticheta: 'CSV UTF-8 (Comma delimited) (*.csv)', ext: '.csv' },
    { cheie: 'pdf', eticheta: 'PDF (*.pdf)', ext: '.pdf' }
  ];
  const TIPURI_DESCHIDERE = [
    { cheie: 'excel', eticheta: 'All Excel Files (*.xlsx)', potriveste: e => e.tip === 'xlsx' },
    { cheie: 'text', eticheta: 'Text Files (*.csv)', potriveste: e => e.tip === 'csv' },
    { cheie: 'toate', eticheta: 'All Files (*.*)', potriveste: () => true }
  ];
  /* textele Excel din m1-l03 (registru-foi.js › MESAJE), în engleză cu gloss românesc */
  const MESAJ = {
    csv: 'The selected file type does not support workbooks that contain multiple sheets.\n\n• To save only the active sheet, click OK.\n• To save all sheets, save them individually using a different file name for each, or choose a file type that supports multiple sheets.',
    csvRo: 'Formatul ales nu poate ține mai multe foi. OK salvează doar foaia activă.',
    inlocuire: f => f + ' already exists.\nDo you want to replace it?',
    inlocuireRo: 'Fișierul există deja. Îl înlocuiești?',
    invalid: 'Numele nu e bun: nu pune caracterele \\ / : * ? " < > | și nu termina cu punct sau spațiu.',
    negasit: n => "Windows cannot find '" + n + "'. Check the spelling and try again.",
    negasitRo: 'Nu găsesc fișierul. Verifică numele.',
    nuSeDeschide: n => "Excel cannot open the file '" + n + "' because the file format or file extension is not valid.",
    nuSeDeschideRo: 'Excel nu deschide acest fel de fișier.'
  };

  /* ------------------------------------------------------------ nume, PDF, CSV (fără DOM) */
  function numeValid(n) {
    n = String(n == null ? '' : n);
    if (!n.trim() || INTERZISE.test(n) || /[. ]$/.test(n) || n.length > 255) return MESAJ.invalid;
    return null;
  }

  /* PDF minim, valid: catalog, pagini (60 de rânduri pe pagină), font Helvetica, tabelă xref cu offset-urile reale.
     Textul e ASCII: diacriticele devin „?” (Helvetica fără WinAnsi aici — [DEDUS], de făcut dacă e nevoie). */
  function pdfDinLinii(linii, titlu) {
    const esc = s => String(s).replace(/[^\x20-\x7e]/g, '?').replace(/[\\()]/g, m => '\\' + m);
    const pagini = [];
    const lista = linii && linii.length ? linii : [''];
    for (let i = 0; i < lista.length; i += 60) pagini.push(lista.slice(i, i + 60));
    const obiecte = [];
    obiecte[0] = '<< /Type /Catalog /Pages 2 0 R >>';
    obiecte[1] = '<< /Type /Pages /Kids [' + pagini.map((_, i) => (4 + 2 * i) + ' 0 R').join(' ') + '] /Count ' + pagini.length + ' >>';
    obiecte[2] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    pagini.forEach((p, i) => {
      obiecte[3 + 2 * i] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ' + (5 + 2 * i) + ' 0 R >>';
      const txt = ['BT', '/F1 10 Tf', '12 TL', '40 800 Td'].concat(p.map(l => '(' + esc(l) + ') Tj T*'), ['ET']).join('\n');
      obiecte[4 + 2 * i] = '<< /Length ' + txt.length + ' >>\nstream\n' + txt + '\nendstream';
    });
    let out = '%PDF-1.4\n';
    const offs = [];
    obiecte.forEach((o, i) => { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    const xref = out.length;
    out += 'xref\n0 ' + (obiecte.length + 1) + '\n0000000000 65535 f \n' + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
    out += 'trailer\n<< /Size ' + (obiecte.length + 1) + ' /Root 1 0 R /Info << /Title (' + esc(titlu || 'Document') + ') >> >>\nstartxref\n' + xref + '\n%%EOF\n';
    return out;
  }

  /* CSV: virgula ca separator, ghilimele unde e nevoie, UTF-8 cu BOM (ca „CSV UTF-8”) */
  function csvDinGrila(rows) {
    const c = v => {
      const s = v == null ? '' : String(v);
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    return '﻿' + rows.map(r => r.map(c).join(',')).join('\r\n') + '\r\n';
  }
  function citesteCsv(text) {
    const s = String(text || '').replace(/^﻿/, '');
    const rows = [];
    let row = [], cur = '', q = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (q) {
        if (ch === '"' && s[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && s[i + 1] === '\n') i++;
        row.push(cur); rows.push(row); row = []; cur = '';
      } else cur += ch;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  /* ------------------------------------------------------------ magazia */
  function gaseste(dosare, d, n) {
    const lista = dosare[d];
    if (!lista) return { lista: null, i: -1 };
    const k = String(n).toLowerCase();
    return { lista, i: lista.findIndex(x => x.n.toLowerCase() === k) };
  }
  function nouaMagazie() {
    const dosare = {};
    DOSARE.forEach(d => { dosare[d] = []; });
    const S = {
      dosare: () => DOSARE.slice(),
      lista(d, filtru) {
        return (dosare[d] || []).filter(x => !filtru || filtru(x)).map(x => ({ n: x.n, tip: x.tip, coleg: !!x.coleg })).sort(cmp);
      },
      exista(d, n) { return gaseste(dosare, d, n).i >= 0; },
      deschide(d, n) { const g = gaseste(dosare, d, n); return g.i >= 0 ? copie(g.lista[g.i]) : null; },
      salveaza(d, n, tip, cont) {
        const err = numeValid(n);
        if (err) throw new Error(err);
        const g = gaseste(dosare, d, n);
        if (!g.lista) throw new Error('dosar necunoscut: ' + d);
        const e = { n: String(n), tip, cont: copie(cont), coleg: false };
        if (g.i >= 0) g.lista[g.i] = e; else g.lista.push(e);
        return { n: e.n, tip, dosar: d };
      },
      stare() {
        const o = {};
        DOSARE.forEach(d => { o[d] = dosare[d].map(x => x.n).sort(); });
        return o;
      }
    };
    /* mostre de „colegi”: fișiere deja în magazie la pornire (fără date ale elevilor) */
    const foaie = (celule) => ({ foi: [{ nume: 'Sheet1', cel: celule, fmt: {}, merge: [], lat: {}, latSet: {}, bord: {}, culoare: null, sel: { activa: { r: 0, c: 0 }, zone: [{ r0: 0, c0: 0, r1: 0, c1: 0 }] } }], fi: 0 });
    const sem = [
      ['Documente', 'Note clasa.xlsx', 'xlsx', foaie({ A1: { v: 'Elev 1' }, B1: { v: 9 }, A2: { v: 'Elev 2' }, B2: { v: 7 } })],
      ['Documente', 'Buget excursie.xlsx', 'xlsx', foaie({ A1: { v: 'Cheltuială' }, B1: { v: 'Sumă' }, A2: { v: 'Transport' }, B2: { v: 350 } })],
      ['Descărcări', 'lista-clasei.csv', 'csv', 'Nume,Nota\r\nElev 1,9\r\nElev 2,7\r\n'],
      ['Descărcări', 'raport.pdf', 'pdf', pdfDinLinii(['Raport luna noiembrie'], 'raport')],
      ['Imagini', 'harta.png', 'png', null]
    ];
    sem.forEach(([d, n, tip, cont]) => { dosare[d].push({ n, tip, cont, coleg: true }); });
    return S;
  }

  /* ------------------------------------------------------------ ferestre (DOM) */
  const STIL = `
.lh-fis-ov{position:absolute;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.12);font:12px 'Segoe UI',system-ui,sans-serif;color:var(--lh-ap-text,#252423)}
.lh-fis-ov.lh-fis-sub{z-index:70}
.lh-fis-win{display:flex;flex-direction:column;width:min(560px,calc(100% - 16px));max-height:calc(100% - 16px);background:var(--lh-ap-panglica,#f9f9f9);border:1px solid var(--lh-ap-linie,#d6d6d6);box-shadow:0 8px 24px rgba(0,0,0,.25);border-radius:4px;overflow:hidden}
.lh-fis-cap{display:flex;align-items:center;gap:6px;padding:6px 8px 6px 12px;border-bottom:1px solid var(--lh-ap-linie,#d6d6d6);background:var(--lh-ap-fond,#f3f3f3)}
.lh-fis-cap b{font-weight:600}
.lh-fis-ro{color:var(--lh-ap-gri,#8a8886);font-size:11px}
.lh-fis-x{margin-left:auto;border:0;background:transparent;cursor:pointer;font-size:14px;padding:2px 6px;color:inherit}
.lh-fis-corp{display:flex;gap:8px;padding:8px;min-height:200px;flex:1 1 auto;overflow:hidden}
.lh-fis-nav{width:130px;flex:0 0 130px;border:1px solid var(--lh-ap-linie,#d6d6d6);background:var(--lh-ap-fond,#f3f3f3);overflow:auto;padding:4px 0;margin:0;list-style:none}
.lh-fis-nav li,.lh-fis-lista li{padding:4px 8px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-fis-nav li:hover,.lh-fis-lista li:hover{background:var(--lh-ap-hover,#e1dfdd)}
.lh-fis-nav li[aria-selected=true],.lh-fis-lista li[aria-selected=true]{background:var(--lh-ap-accent,#185abd);color:#fff}
.lh-fis-nav li.lh-fis-nes{color:var(--lh-ap-gri,#8a8886)}
.lh-fis-lista{flex:1 1 auto;margin:0;padding:0;list-style:none;border:1px solid var(--lh-ap-linie,#d6d6d6);background:var(--lh-ap-fundal,#fff);overflow:auto;min-width:0}
.lh-fis-lista li.lh-fis-col{color:var(--lh-ap-gri,#8a8886);font-size:11px;cursor:default;background:transparent}
.lh-fis-jos{display:grid;grid-template-columns:86px 1fr;gap:6px 8px;align-items:center;padding:0 8px 8px}
.lh-fis-jos input,.lh-fis-jos select{font:inherit;padding:3px 4px;border:1px solid var(--lh-ap-linie,#d6d6d6);background:var(--lh-ap-fundal,#fff);color:var(--lh-ap-text,#252423);min-width:0}
.lh-fis-bt{grid-column:1/3;display:flex;justify-content:flex-end;gap:6px;margin-top:4px}
.lh-fis-bt button{font:inherit;min-width:76px;padding:4px 12px;border:1px solid var(--lh-ap-linie,#d6d6d6);background:var(--lh-ap-fond,#f3f3f3);color:var(--lh-ap-text,#252423);cursor:pointer}
.lh-fis-bt button.pr{border-color:var(--lh-ap-accent,#185abd);background:var(--lh-ap-accent,#185abd);color:#fff}
.lh-fis-bt button.gl{margin-right:auto}
.lh-fis-msg{grid-column:1/3;white-space:pre-line;color:#a4262c;min-height:0}
.lh-fis-msg:empty{display:none}
.lh-fis-conf{padding:12px 14px;white-space:pre-line;display:flex;flex-direction:column;gap:6px}
.lh-fis-conf.verde b{color:#107c41;font-size:15px}
`;
  function stil() {
    if (document.getElementById('lh-fis-stil')) return;
    const s = document.createElement('style');
    s.id = 'lh-fis-stil';
    s.textContent = STIL;
    document.head.appendChild(s);
  }
  const TASTE = ['keydown', 'keyup', 'keypress', 'beforeinput', 'input', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'touchstart', 'touchend'];
  function el(tag, cls, attrs, ...kids) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    Object.entries(attrs || {}).forEach(([k, v]) => { if (v != null) e.setAttribute(k, v); });
    kids.forEach(k => { if (k == null) return; e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return e;
  }
  function overlay(host, nume, sub) {
    stil();
    const ov = el('div', 'lh-fis-ov' + (sub ? ' lh-fis-sub' : ''), { 'data-lh-fis': nume });
    TASTE.forEach(t => ov.addEventListener(t, e => e.stopPropagation()));
    host.appendChild(ov);
    return ov;
  }

  /* fereastra mică de confirmare / mesaj (Excel: „Confirm Save As”, „Microsoft Excel”): butoane în ordinea dată */
  function confirma(host, o) {
    const ov = overlay(host, 'confirmare', true);
    const bts = o.butoane.map((b, i) => {
      const x = el('button', i === 0 ? 'pr' : null, { type: 'button', 'data-lh-tinta': 'buton:' + b }, b);
      x.addEventListener('click', () => { ov.remove(); if (o.dupa) o.dupa(b); });
      return x;
    });
    ov.appendChild(el('div', 'lh-fis-win', { role: 'alertdialog', 'aria-label': o.titlu },
      el('div', 'lh-fis-cap', null, el('b', null, null, o.titlu)),
      el('div', 'lh-fis-conf' + (o.verde ? ' verde' : ''), null, el('b', null, null, o.verde ? o.titlu : ''), o.text, o.ro ? el('div', 'lh-fis-ro', null, o.ro) : null),
      el('div', 'lh-fis-bt', null, ...bts)));
    setTimeout(() => { const b = ov.querySelector('button.pr'); if (b) b.focus({ preventScroll: true }); }, 0);
    return ov;
  }

  function navigare(cfg, st, nav, aplica) {
    nav.innerHTML = '';
    cfg.magazie.dosare().forEach(d => {
      const li = el('li', null, { role: 'treeitem', 'data-lh-tinta': 'arbore:' + d, 'aria-selected': String(st.dosar === d) }, d);
      li.addEventListener('click', () => { st.dosar = d; aplica(); });
      nav.appendChild(li);
    });
    ['Acest PC', 'Rețea'].forEach(n => {
      const li = el('li', 'lh-fis-nes', { role: 'treeitem', 'aria-disabled': 'true', 'data-lh-tinta': 'arbore:' + n }, n);
      li.addEventListener('click', () => cfg.nesimulat && cfg.nesimulat(n));
      nav.appendChild(li);
    });
  }

  /* Save As: panou stânga = locuri, dreapta = fișierele tipului ales; caseta File name, Save as type, Save / Cancel */
  function salvareCa(host, cfg) {
    const S = cfg.magazie;
    const st = { dosar: cfg.dosar || 'Documente', tip: cfg.tip || 'xlsx' };
    const ov = overlay(host, 'salvare_ca');
    const tipCur = () => TIPURI_SALVARE.find(t => t.cheie === st.tip) || TIPURI_SALVARE[0];
    const nav = el('ul', 'lh-fis-nav', { role: 'tree', 'aria-label': 'Locuri' });
    const lista = el('ul', 'lh-fis-lista', { role: 'listbox', 'aria-label': 'Fișiere' });
    const inp = el('input', null, { type: 'text', 'aria-label': 'File name:', 'data-lh-tinta': 'camp:nume_fisier', value: cfg.nume || '' });
    const sel = el('select', null, { 'aria-label': 'Save as type:', 'data-lh-tinta': 'camp:tip_fisier' },
      ...TIPURI_SALVARE.map(t => el('option', null, { value: t.cheie }, t.eticheta)));
    sel.value = st.tip;
    const msg = el('div', 'lh-fis-msg', { role: 'alert' });
    const salveaza = el('button', 'pr', { type: 'button', 'data-lh-tinta': 'buton:Save' }, 'Save');
    const anuleaza = el('button', null, { type: 'button', 'data-lh-tinta': 'buton:Cancel' }, 'Cancel');
    const unelte = el('button', 'gl', { type: 'button', 'data-lh-tinta': 'buton:Tools' }, 'Tools ▾');
    const inchide = () => { ov.remove(); if (cfg.inchis) cfg.inchis(); };
    const arata = t => { msg.textContent = t || ''; };

    function reda() {
      navigare(cfg, st, nav, reda);
      const t = tipCur();
      lista.innerHTML = '';
      lista.appendChild(el('li', 'lh-fis-col', null, 'Nume'));
      S.lista(st.dosar, x => x.tip === t.cheie).forEach(x => {
        const li = el('li', null, { role: 'option', 'aria-selected': String(inp.value === x.n), 'data-lh-tinta': 'fisier:' + x.n }, x.n);
        li.addEventListener('click', () => { inp.value = x.n; reda(); });
        lista.appendChild(li);
      });
    }

    function scrie(nume) {
      if (S.exista(st.dosar, nume)) {
        confirma(ov, { titlu: 'Confirm Save As', text: MESAJ.inlocuire(nume), ro: MESAJ.inlocuireRo, butoane: ['Yes', 'No'],
          dupa: r => { if (r === 'Yes') gata(nume); } });
        return;
      }
      gata(nume);
    }
    function gata(nume) {
      inchide();
      if (cfg.salveaza) cfg.salveaza(st.dosar, nume, st.tip);
    }
    function incearca() {
      const brut = inp.value.trim();
      if (!brut) return;
      const err = numeValid(brut);
      if (err) return arata(err);
      const t = tipCur();
      const nume = brut.toLowerCase().endsWith(t.ext) ? brut : brut + t.ext;
      if (st.tip === 'csv' && cfg.nrFoi && cfg.nrFoi() > 1) {
        return confirma(ov, { titlu: 'Microsoft Excel', text: MESAJ.csv, ro: MESAJ.csvRo, butoane: ['OK', 'Cancel'],
          dupa: r => { if (r === 'OK') scrie(nume); } });
      }
      scrie(nume);
    }

    sel.addEventListener('change', () => { st.tip = sel.value; reda(); });
    inp.addEventListener('input', () => arata(''));
    salveaza.addEventListener('click', incearca);
    anuleaza.addEventListener('click', inchide);
    unelte.addEventListener('click', () => cfg.nesimulat && cfg.nesimulat('Tools ▾'));
    ov.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); inchide(); }
      else if (e.key === 'Enter' && e.target === inp) { e.preventDefault(); incearca(); }
    });
    const cap = el('div', 'lh-fis-cap', { 'data-lh-tip': 'TitleBar' }, el('b', null, null, 'Save As'), el('span', 'lh-fis-ro', null, '(Salvare ca)'),
      el('button', 'lh-fis-x', { type: 'button', 'aria-label': 'Close', 'data-lh-tinta': 'buton:Close' }, '✕'));
    cap.querySelector('button').addEventListener('click', inchide);
    ov.appendChild(el('div', 'lh-fis-win', { role: 'dialog', 'aria-label': 'Save As', 'aria-modal': 'true' },
      cap,
      el('div', 'lh-fis-corp', null, nav, lista),
      el('div', 'lh-fis-jos', null,
        el('label', null, null, 'File name:'), inp,
        el('label', null, null, 'Save as type:'), sel,
        msg,
        el('div', 'lh-fis-bt', null, unelte, salveaza, anuleaza))));
    reda();
    setTimeout(() => { try { inp.focus({ preventScroll: true }); inp.select(); } catch (e) { /* */ } }, 0);
    return { inchide, inp };
  }

  /* Open: aceleași locuri; „Files of type” filtrează; Open deschide fișierul ales (dublu clic = la fel) */
  function deschidere(host, cfg) {
    const S = cfg.magazie;
    const st = { dosar: cfg.dosar || 'Documente', tip: 'excel' };
    const ov = overlay(host, 'deschidere');
    const tipCur = () => TIPURI_DESCHIDERE.find(t => t.cheie === st.tip) || TIPURI_DESCHIDERE[0];
    const nav = el('ul', 'lh-fis-nav', { role: 'tree', 'aria-label': 'Locuri' });
    const lista = el('ul', 'lh-fis-lista', { role: 'listbox', 'aria-label': 'Fișiere' });
    const inp = el('input', null, { type: 'text', 'aria-label': 'File name:', 'data-lh-tinta': 'camp:nume_fisier' });
    const sel = el('select', null, { 'aria-label': 'Files of type:', 'data-lh-tinta': 'camp:tip_fisier' },
      ...TIPURI_DESCHIDERE.map(t => el('option', null, { value: t.cheie }, t.eticheta)));
    const msg = el('div', 'lh-fis-msg', { role: 'alert' });
    const deschide = el('button', 'pr', { type: 'button', 'data-lh-tinta': 'buton:Open' }, 'Open');
    const anuleaza = el('button', null, { type: 'button', 'data-lh-tinta': 'buton:Cancel' }, 'Cancel');
    const unelte = el('button', 'gl', { type: 'button', 'data-lh-tinta': 'buton:Tools' }, 'Tools ▾');
    const inchide = () => { ov.remove(); if (cfg.inchis) cfg.inchis(); };
    const arata = t => { msg.textContent = t || ''; };

    function reda() {
      navigare(cfg, st, nav, reda);
      const t = tipCur();
      lista.innerHTML = '';
      lista.appendChild(el('li', 'lh-fis-col', null, 'Nume'));
      S.lista(st.dosar, t.potriveste).forEach(x => {
        const li = el('li', null, { role: 'option', 'aria-selected': String(inp.value === x.n), 'data-lh-tinta': 'fisier:' + x.n }, x.n);
        li.addEventListener('click', () => { inp.value = x.n; arata(''); reda(); });
        li.addEventListener('dblclick', () => incearca(x.n));
        lista.appendChild(li);
      });
    }
    function incearca(numeDat) {
      const nume = String(numeDat != null ? numeDat : inp.value).trim();
      if (!nume) return;
      const e = S.deschide(st.dosar, nume);
      if (!e) return arata(MESAJ.negasit(nume) + '\n' + MESAJ.negasitRo);
      if (e.tip !== 'xlsx' && e.tip !== 'csv' && e.tip !== 'pdf') return arata(MESAJ.nuSeDeschide(nume) + '\n' + MESAJ.nuSeDeschideRo);
      inchide();
      if (cfg.deschis) cfg.deschis(st.dosar, e);
    }

    sel.addEventListener('change', () => { st.tip = sel.value; reda(); });
    inp.addEventListener('input', () => arata(''));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); incearca(); } });
    deschide.addEventListener('click', () => incearca());
    anuleaza.addEventListener('click', inchide);
    unelte.addEventListener('click', () => cfg.nesimulat && cfg.nesimulat('Tools ▾'));
    ov.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); inchide(); } });
    const cap = el('div', 'lh-fis-cap', { 'data-lh-tip': 'TitleBar' }, el('b', null, null, 'Open'), el('span', 'lh-fis-ro', null, '(Deschidere)'),
      el('button', 'lh-fis-x', { type: 'button', 'aria-label': 'Close', 'data-lh-tinta': 'buton:Close' }, '✕'));
    cap.querySelector('button').addEventListener('click', inchide);
    ov.appendChild(el('div', 'lh-fis-win', { role: 'dialog', 'aria-label': 'Open', 'aria-modal': 'true' },
      cap,
      el('div', 'lh-fis-corp', null, nav, lista),
      el('div', 'lh-fis-jos', null,
        el('label', null, null, 'File name:'), inp,
        el('label', null, null, 'Files of type:'), sel,
        msg,
        el('div', 'lh-fis-bt', null, unelte, deschide, anuleaza))));
    reda();
    setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) { /* */ } }, 0);
    return { inchide };
  }

  const MOD = {
    nou: nouaMagazie,
    numeValid,
    pdfDinLinii,
    csvDinGrila,
    citesteCsv,
    TIPURI_SALVARE,
    MESAJ,
    salvareCa,
    deschidere,
    confirma
  };
  L._modul('fisiere', MOD);
})();
