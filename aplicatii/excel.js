/* excel.js — Excel în biblioteca centrală (api_biblioteca.md §1-§8; contract R1-R12).
   Interfața (bara de titlu + Acces rapid, filele, panglica, File/Backstage, meniurile de clic dreapta, ferestrele, bara de
   stare) o desenează motorul comun panglica.js din date/excel.json, GENERAT din referinte/uia_excel.json (Excel real,
   1366×768, 100% DPI). Zona foii (Name Box, bara de formule, antetele A, B, C… / 1, 2, 3…, filele foilor) se așază la
   coordonatele din date/excel.json › zona, cu numele de acolo. Comportamentul urmează referinte/scenarii_real/excel-*.json:
   setările regionale românești ale PC-ului profesorului (separatorul de listă „;”, cel zecimal „,”: excel-separator-punct-
   si-virgula, excel-zecimale-virgula, excel-zecimale-punct), Enter/Tab/săgeți, F2, F4, umplerea, AutoSum, sortarea, Ctrl+Z.
   Formula din stare e cea pe care o dă Excel prin COM (engleză, cu „,”: =SUM(A1,A2)); pe ecran se scrie ca în Excel-ul
   românesc (=SUM(A1;A2)). Starea (§5): celule, format_celule, selectie, nume_fisier, fereastra_mesaj, ramane_in_editare. */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;
  /* magazia de fișiere și ferestrele Save As / Open (fisiere.js) — încărcate în fundal; Save As/Open se deschid doar din
     acțiunea elevului, deci modulul e gata până atunci. Fără el, comenzile rămân mesajul central „nesimulat”. */
  L.gata.then(() => L._script('fisiere.js')).catch(() => { /* */ });

  /* ============================================================ adrese */
  const MAXR = 1048576, MAXC = 16384;
  const colNume = c => { let s = ''; c += 1; while (c > 0) { const m = (c - 1) % 26; s = String.fromCharCode(65 + m) + s; c = Math.floor((c - 1) / 26); } return s; };
  const colIdx = s => { let n = 0; for (const ch of String(s).toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; };
  const adr = (r, c) => colNume(c) + (r + 1);
  const pa = a => { const m = /^\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(String(a || '').trim()); if (!m) return null; const r = +m[2] - 1, c = colIdx(m[1]); return r >= 0 && r < MAXR && c >= 0 && c < MAXC ? { r, c } : null; };
  function zonaDin(s) {
    s = String(s || '').trim().replace(/\$/g, '').toUpperCase();
    let m = /^([A-Z]{1,3}):([A-Z]{1,3})$/.exec(s);
    if (m) { const a = colIdx(m[1]), b = colIdx(m[2]); return { r0: 0, c0: Math.min(a, b), r1: MAXR - 1, c1: Math.max(a, b) }; }
    m = /^(\d+):(\d+)$/.exec(s);
    if (m) { const a = +m[1] - 1, b = +m[2] - 1; return { r0: Math.min(a, b), c0: 0, r1: Math.max(a, b), c1: MAXC - 1 }; }
    const [x, y] = s.split(':'), p = pa(x), q = pa(y || x);
    if (!p || !q) return null;
    return { r0: Math.min(p.r, q.r), c0: Math.min(p.c, q.c), r1: Math.max(p.r, q.r), c1: Math.max(p.c, q.c) };
  }
  function zonaText(z) {
    if (z.r0 === 0 && z.r1 === MAXR - 1) return colNume(z.c0) + ':' + colNume(z.c1);
    if (z.c0 === 0 && z.c1 === MAXC - 1) return (z.r0 + 1) + ':' + (z.r1 + 1);
    return z.r0 === z.r1 && z.c0 === z.c1 ? adr(z.r0, z.c0) : adr(z.r0, z.c0) + ':' + adr(z.r1, z.c1);
  }
  const inZona = (z, r, c) => r >= z.r0 && r <= z.r1 && c >= z.c0 && c <= z.c1;

  /* ============================================================ numere și texte (setările regionale românești) */
  const LUNI = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sept', 'oct', 'nov', 'dec'];   // doar „mai” probat (de_verificat R6-3)
  const serial = (y, m, d) => Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 864e5);
  const dinSerial = s => { const t = new Date(Date.UTC(1899, 11, 30) + s * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; };
  const doi = n => (n < 10 ? '0' : '') + n;
  function general(n) {
    if (!isFinite(n)) return '#NUM!';
    if (Number.isInteger(n) && Math.abs(n) < 1e11) return String(n);
    let s = String(+n.toPrecision(10));
    /* runda 25: sub 0,0001 General e științific (excel-numere-afisare: =1/30000 → „3,33333E-05”, =1/7000000 → „1,42857E-07”;
       pragul 1e-9 de dinainte lăsa „1,4e-7”, textul lui String() din JavaScript); același prag ca în inLatime */
    if (/e/i.test(s) || s.replace('-', '').length > 11 || Math.abs(n) < 1e-4) {
      if (Math.abs(n) >= 1e11 || Math.abs(n) < 1e-4) s = n.toExponential(5).replace(/\.?0+e/, 'e').replace('e', 'E').replace(/E([+-])(\d)$/, 'E$10$2');
      else { const i = String(Math.trunc(Math.abs(n))).length; s = String(+n.toFixed(Math.max(0, 9 - i))); }
    }
    return s.replace('.', ',');
  }
  /* textul afișat al unei valori, după formatul celulei (General; „dd.mmm” = data scrisă cu punct: excel-zecimale-punct) */
  function afisat(v, fn) {
    if (v == null) return '';
    if (typeof v === 'object' && v.e) return v.e;
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (typeof v === 'number') {
      if (fn === 'dd.mmm') { const d = dinSerial(Math.floor(v)); return doi(d.d) + '.' + LUNI[d.m - 1]; }
      if (fn === 'dd.mm.yyyy') { const d = dinSerial(Math.floor(v)); return doi(d.d) + '.' + doi(d.m) + '.' + d.y; }
      if (fn === '0%') return general(Math.round(v * 100)) + '%';
      const m = /^0(?:\.(0+))?$/.exec(fn || '');
      if (m) return (m[1] ? v.toFixed(m[1].length) : String(Math.round(v))).replace('.', ',');
      return general(v);
    }
    return String(v);
  }
  /* ---- ce ÎNCAPE în celulă (critic 6, GRAV X1). Lățimea textului în „cifre” Calibri 11 (cifra = 1); coloana de w px (100 %)
     are loc pentru (3·w − 16) / 22 cifre: 64 px → 8. Calibrat pe Excel real (runde/6/critic_probe/com_r6.json, Range.Text):
     64 px: „8,333333”, „66,66667”, „0,333333”, „1,23E+09”, „1,23E+11”, „########” (data 12.03.2026), „-3,25”, „07.mai”;
     coloana de 3,56 caractere (≈ 30,7 px): „76” (75,5), „8,3” (=25/3), „###” (1234), „###” (data). Nu taie niciodată o cifră:
     numărul în format General se rotunjește, apoi trece în notație științifică, apoi „#”; celelalte formate → „#”. */
  const LAT_CAR = { ',': 0.5, '.': 0.5, 'E': 0.96, '+': 1, '-': 0.6, '#': 1, '%': 1.41, ':': 0.53, ' ': 0.45, '/': 0.75,
    m: 1.58, w: 1.41, i: 0.46, l: 0.46, j: 0.47, t: 0.66, r: 0.69, f: 0.6, s: 0.77, c: 0.83, z: 0.78 };
  const latCifre = t => { let n = 0; for (const ch of String(t)) n += /\d/.test(ch) ? 1 : (LAT_CAR[ch] != null ? LAT_CAR[ch] : 0.95); return n; };
  const unitatiDin = px => (3 * px - 16) / 22;
  const pxDin = u => Math.ceil((22 * u + 16) / 3);
  /* runda 25: lățimea pe care o ia coloana când Excel o lățește singur pentru un număr TASTAT: 7 px pe caracter + 9
     (scenarii_real/excel-numere-afisare: „1234567890” → 79, „1,23457E+13” / „3,33333E-05” / „1,42857E-07” → 86; alte lungimi
     nu sunt capturate: de_verificat R25-3) */
  const latTastat = t => 7 * [...String(t)].length + 9;
  const diezi = u => '#'.repeat(Math.max(0, Math.floor(u + 1e-9)));
  const virgula = t => t.replace('.', ',');
  function rotunjit(n, d) { const a = Math.abs(n), f = Math.pow(10, d); return (n < 0 ? -1 : 1) * Math.round(a * f + 1e-9 * a * f) / f; }
  function stiintific(n, d) {
    let t = n.toExponential(d);   // ex. 1.23e+9
    let [mant, ex] = t.split('e');
    if (mant.indexOf('.') >= 0) mant = mant.replace(/0+$/, '').replace(/\.$/, '');
    const sg = ex.charAt(0) === '-' ? '-' : '+', e2 = ex.replace(/^[+-]/, '');
    return virgula(mant) + 'E' + sg + (e2.length < 2 ? '0' : '') + e2;
  }
  function inLatime(v, fn, u) {
    const t = afisat(v, fn);
    if (u == null || typeof v !== 'number' || latCifre(t) <= u + 1e-9) return t;
    if (fn && fn !== 'General') return diezi(u);
    if (!isFinite(v)) return t;
    const a = Math.abs(v);
    if (a >= 1e-4 || a === 0) {
      const intreg = String(Math.round(a)).length + (v < 0 ? 0.6 : 0);
      if (intreg <= u + 1e-9 && a < 1e11) {
        for (let d = 9; d >= 0; d--) {
          const x = rotunjit(v, d);
          if (x === 0 && v !== 0) break;
          const t2 = virgula(String(x));
          if (/e/i.test(t2)) break;
          if (latCifre(t2) <= u + 1e-9) return t2;
        }
      }
    }
    for (let d = 5; d >= 0; d--) { const t2 = stiintific(v, d); if (latCifre(t2) <= u + 1e-9) return t2; }
    return diezi(u);
  }
  /* o constantă tastată într-o celulă (nu formulă): ce face din ea Excel cu setările românești */
  function constanta(s) {
    if (s.charAt(0) === "'") return { v: s.slice(1), ap: true };
    const t = s.trim();
    if (/^[+-]?\d+(,\d+)?$/.test(t)) return { v: parseFloat(t.replace(',', '.')) };
    if (/^[+-]?,\d+$/.test(t)) return { v: parseFloat(t.replace(',', '.')) };
    let m = /^(\d{1,2})\.(\d{1,2})$/.exec(t);
    if (m) { const d = +m[1], l = +m[2], y = new Date().getFullYear(); if (l >= 1 && l <= 12 && d >= 1 && d <= new Date(y, l, 0).getDate()) return { v: serial(y, l, d), fn: 'dd.mmm' }; }
    m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(t);
    if (m) { const d = +m[1], l = +m[2], y = +m[3]; if (l >= 1 && l <= 12 && d >= 1 && d <= new Date(y, l, 0).getDate()) return { v: serial(y, l, d), fn: 'dd.mm.yyyy' }; }
    if (/^(TRUE|FALSE)$/i.test(t)) return { v: /^TRUE$/i.test(t) };
    return { v: s };
  }
  const textNumeric = s => { const t = String(s).trim(); return /^[+-]?(\d+(,\d*)?|,\d+)$/.test(t) ? parseFloat(t.replace(',', '.')) : null; };

  /* ============================================================ formulele */
  const ERR = e => ({ e });
  const eErr = v => !!(v && typeof v === 'object' && v.e);
  /* sep = separatorul de argumente, dec = cel zecimal: „ro” (ce tastează elevul: ; ,) sau „en” (forma din COM: , .) */
  const LOC = { ro: { sep: ';', dec: ',' }, en: { sep: ',', dec: '.' } };
  function jetoane(s, loc) {
    const { sep, dec } = LOC[loc], out = [];
    const reNum = dec === ',' ? /^(\d+(,\d*)?|,\d+)([eE][+-]?\d+)?/ : /^(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?/;
    let i = 0;
    while (i < s.length) {
      const r = s.slice(i), ch = s[i];
      if (ch === ' ') { out.push({ t: 'sp', s: ' ' }); i++; continue; }
      if (ch === '"') {
        let j = i + 1, v = '';
        for (;;) {
          if (j >= s.length) throw new Error('ghilimele');
          if (s[j] === '"') { if (s[j + 1] === '"') { v += '"'; j += 2; continue; } break; }
          v += s[j++];
        }
        out.push({ t: 'str', v, s: s.slice(i, j + 1) }); i = j + 1; continue;
      }
      let m = /^(\$?[A-Za-z]{1,3}\$?\d+)(:\$?[A-Za-z]{1,3}\$?\d+)?(?![A-Za-z0-9_(À-ɏ])/.exec(r);
      if (m && pa(m[1]) && (!m[2] || pa(m[2].slice(1)))) { out.push({ t: m[2] ? 'zona' : 'ref', s: m[0] }); i += m[0].length; continue; }
      /* numele de funcții pot avea diacritice (=DACĂ(…) e primită și dă #NAME?: runde/6/critic_probe/com_r6b.json › D3, D5) */
      m = /^([A-Za-zÀ-ɏ][A-Za-z0-9_.À-ɏ]*)\s*\(/.exec(r);
      if (m) { out.push({ t: 'fn', v: m[1].toUpperCase(), s: m[1].toUpperCase() + '(' }); i += m[0].length; continue; }
      m = /^(TRUE|FALSE)(?![A-Za-z0-9_(])/i.exec(r);
      if (m) { out.push({ t: 'bool', v: m[1].toUpperCase() === 'TRUE', s: m[1].toUpperCase() }); i += m[0].length; continue; }
      m = reNum.exec(r);
      if (m) { out.push({ t: 'num', v: parseFloat(m[0].replace(',', '.')), s: m[0] }); i += m[0].length; continue; }
      m = /^(<>|<=|>=|[-+*/^&=<>%()])/.exec(r);
      if (m) { out.push({ t: 'op', s: m[0] }); i += m[0].length; continue; }
      if (ch === sep) { out.push({ t: 'sep', s: sep }); i++; continue; }
      m = /^[A-Za-z_À-ɏ][A-Za-z0-9_.À-ɏ]*/.exec(r);
      if (m) { out.push({ t: 'nume', v: m[0].toUpperCase(), s: m[0] }); i += m[0].length; continue; }
      throw new Error('caracter');
    }
    return out;
  }
  /* funcțiile simulate: [minim, maxim de argumente]; un nume necunoscut dă #NAME? (ca în Excel) */
  const FN = {
    ABS: [1, 1], AND: [1, 255], AVEDEV: [1, 255], AVERAGE: [1, 255], AVERAGEIF: [2, 3], CONCAT: [1, 255], CONCATENATE: [1, 255], COUNT: [1, 255],
    COUNTA: [1, 255], COUNTBLANK: [1, 1], COUNTIF: [2, 2], IF: [2, 3], IFERROR: [2, 2], INT: [1, 1], LEFT: [1, 2], LEN: [1, 1],
    LOWER: [1, 1], MAX: [1, 255], MEDIAN: [1, 255], MID: [3, 3], MIN: [1, 255], MOD: [2, 2], NOT: [1, 1], OR: [1, 255],
    POWER: [2, 2], PRODUCT: [1, 255], PROPER: [1, 1], RIGHT: [1, 2], ROUND: [2, 2], ROUNDDOWN: [2, 2], ROUNDUP: [2, 2],
    SQRT: [1, 1], SUBSTITUTE: [3, 4], SUM: [1, 255], SUMIF: [2, 3], TRIM: [1, 1], UPPER: [1, 1]
  };
  const NUME_FN = Object.keys(FN).sort();
  function arbore(tok) {
    const T = tok.filter(t => t.t !== 'sp');
    let i = 0;
    const vezi = () => T[i], ia = () => T[i++];
    const e = s => { const t = vezi(); return t && t.t === 'op' && t.s === s; };
    function comp() { let a = concat(); while (vezi() && vezi().t === 'op' && /^(=|<>|<|>|<=|>=)$/.test(vezi().s)) { const o = ia().s; a = { k: 'op', o, a, b: concat() }; } return a; }
    function concat() { let a = adun(); while (e('&')) { ia(); a = { k: 'op', o: '&', a, b: adun() }; } return a; }
    function adun() { let a = inm(); while (e('+') || e('-')) { const o = ia().s; a = { k: 'op', o, a, b: inm() }; } return a; }
    function inm() { let a = put(); while (e('*') || e('/')) { const o = ia().s; a = { k: 'op', o, a, b: put() }; } return a; }
    function put() { let a = unar(); while (e('^')) { ia(); a = { k: 'op', o: '^', a, b: unar() }; } return a; }
    function unar() { if (e('-')) { ia(); return { k: 'neg', a: unar() }; } if (e('+')) { ia(); return unar(); } return proc(); }
    function proc() { let a = prim(); while (e('%')) { ia(); a = { k: 'pct', a }; } return a; }
    function prim() {
      const t = ia();
      if (!t) throw new Error('lipsa');
      if (t.t === 'num') return { k: 'v', v: t.v };
      if (t.t === 'str') return { k: 'v', v: t.v };
      if (t.t === 'bool') return { k: 'v', v: t.v };
      if (t.t === 'ref') { const p = pa(t.s); return { k: 'ref', r: p.r, c: p.c }; }
      if (t.t === 'zona') { const z = zonaDin(t.s); return { k: 'zona', z }; }
      if (t.t === 'nume') return { k: 'v', v: ERR('#NAME?') };
      if (t.t === 'op' && t.s === '(') { const a = comp(); if (!e(')')) throw new Error('paranteza'); ia(); return a; }
      if (t.t === 'fn') {
        const args = [];
        if (e(')')) ia();
        else {
          for (;;) {
            if (vezi() && (vezi().t === 'sep' || (vezi().t === 'op' && vezi().s === ')'))) args.push({ k: 'gol' });
            else args.push(comp());
            if (vezi() && vezi().t === 'sep') { ia(); continue; }
            if (e(')')) { ia(); break; }
            throw new Error('paranteza');
          }
        }
        const def = FN[t.v];
        /* prea puține argumente: Excel NU primește formula și rămâne în editare (scenarii_real/excel-autocompletare-tab:
           ramane_in_editare true — rezultat neprobat, de_verificat R6-2) */
        if (def && (args.length < def[0] || args.length > def[1])) throw new Error('argumente');
        return { k: 'fn', f: t.v, args, cunoscut: !!def };
      }
      throw new Error('neasteptat');
    }
    const a = comp();
    if (i < T.length) throw new Error('rest');
    return a;
  }
  /* „=SUM(A1;A2)” tastat → forma engleză din COM „=SUM(A1,A2)”; null = formula nu e primită (rămâne în editare) */
  function laForma(text, din, spre) {
    try {
      const tok = jetoane(text.slice(1), din);
      arbore(tok);
      return '=' + tok.map(t => t.t === 'sep' ? LOC[spre].sep : t.t === 'num' ? t.s.replace(LOC[din].dec, LOC[spre].dec)
        : (t.t === 'ref' || t.t === 'zona') ? t.s.toUpperCase() : t.s).join('');
    } catch (e) { return null; }
  }
  /* mută referințele relative ale unei formule (engleză) cu dr rânduri și dc coloane; peste margine = #REF! */
  function mutaFormula(f, dr, dc, filtru) {
    let tok;
    try { tok = jetoane(f.slice(1), 'en'); } catch (e) { return f; }
    const muta = s => {
      const m = /^(\$?)([A-Za-z]{1,3})(\$?)(\d+)$/.exec(s);
      const r0 = +m[4] - 1, c0 = colIdx(m[2]);
      if (filtru && !filtru(r0, c0)) return s;
      const c = m[1] ? c0 : c0 + dc, r = m[3] ? r0 : r0 + dr;
      if (r < 0 || c < 0 || r >= MAXR || c >= MAXC) return '#REF!';
      return m[1] + colNume(c) + m[3] + (r + 1);
    };
    return '=' + tok.map(t => t.t === 'ref' ? muta(t.s) : t.t === 'zona' ? t.s.split(':').map(muta).join(':') : t.s).join('');
  }

  function creeaza(I, c) {
    const root = I.root, date = I.date, pang = L._module.panglica, esc = pang.esc;
    let H = L._module.stare.istoric(() => false);   // fiecare confirmare = o unitate (scenarii_real/excel-ctrl-z-celula)
    const SUP = date.suprafete, Z = date.zona || {};
    /* X3: pictogramele barei Acces rapid lipsesc din date (date/excel.json › fara_icoana: FileSave, Undo, Redo), iar desenul de rezervă al
       barei de titlu era lupa → Fluent UI System Icons (Microsoft, MIT), @fluentui/svg-icons@1.1.343 (save, arrow_undo, arrow_redo;
       aceeași sursă și versiune ca _cercetare/office_comenzi/icoane_build.py) */
    const ICO_QAT = {"FileSave": ["M3 5c0-1.1.9-2 2-2h8.38a2 2 0 0 1 1.41.59l1.62 1.62A2 2 0 0 1 17 6.62V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1v-4.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5V16a1 1 0 0 0 1-1V6.62a1 1 0 0 0-.3-.7L14.1 4.28a1 1 0 0 0-.71-.29H13v2.5c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 6 6.5V4zm2 0v2.5c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5V4zm7 12v-4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V16z"], "Undo": ["M5 2.5a.5.5 0 0 0-1 0v4.9c0 .33.27.6.6.6h4.9a.5.5 0 0 0 0-1H5.9l3.48-3.02a4 4 0 0 1 5.25 6.04l-8.17 7.1a.5.5 0 0 0 .65.76l8.17-7.1a5 5 0 0 0-6.56-7.55L5 6.46z"], "Redo": ["M15 2.5a.5.5 0 0 1 1 0v4.9a.6.6 0 0 1-.6.6h-4.9a.5.5 0 0 1 0-1h3.6l-3.48-3.02a4 4 0 1 0-5.24 6.04l8.17 7.1a.5.5 0 1 1-.66.76l-8.17-7.1a5 5 0 1 1 6.56-7.55L15 6.46z"]};
    const ICO_CHEVRON = '<path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0"/>';
    date.icoane = date.icoane || {};
    Object.keys(ICO_QAT).forEach(k => { if (!date.icoane[k]) date.icoane[k] = ICO_QAT[k]; });
    const scenariu = !!I.opt.scenariu;
    const clona = L._clona;

    /* ============================================================ modelul */
    const M = { foi: [], fi: 0, nume: null, salvat: false, edit: null, clip: null, tabCol: null, zoom: 100, mesaj: null, mod: false, dosar: null, avertisment: null };
    /* magazia de fișiere (fisiere.js): creată la prima nevoie; dosar = folderul registrului salvat (null = nesalvat) */
    let magaz = null;
    /* registrele deschise (X8, m1-l03): cel activ stă în M; alte = cele din spate; nr = ultimul BookN dat (com_r7c.json › registre_noi:
       Book2, Book3, Book4 — numerele nu se refolosesc); gol = Excel deschis fără niciun registru (m1-l03:59) */
    const REG = { alte: [], nr: 1, gol: false };
    /* lat = lățimile coloanelor (px la 100 %; lipsă = 64, uia_excel.json › zona_document), latSet = puse de elev / lecție */
    /* bord = bordurile, ca MUCHII comune între celule (Excel real: No Border pe B2 șterge și B1.jos, A2.dreapta — com_r7c.json ›
       none_border): 'h,r,c' = linia de SUS a celulei (r, c), 'v,r,c' = linia din STÂNGA ei; valoarea: subtire | groasa | dubla */
    /* culoare = culoarea filei (Tab Color, runda 29: '#RRGGBB' sau null) */
    function foaieNoua(nume) { return { nume, cel: {}, fmt: {}, merge: [], lat: {}, latSet: {}, bord: {}, culoare: null, sel: { activa: { r: 0, c: 0 }, zone: [{ r0: 0, c0: 0, r1: 0, c1: 0 }] } }; }
    const F = () => M.foi[M.fi];
    function puneStart(f, celule, format, latimi) {
      /* latimi (CONȚINUT, opțional): { A: 120, C: 90 } = lățimea coloanei în px la 100 % */
      Object.entries(latimi || {}).forEach(([k, px]) => { const c0 = colIdx(k); if (c0 >= 0 && c0 < MAXC && isFinite(+px) && +px >= 0) { f.lat[c0] = +px; f.latSet[c0] = true; } });
      Object.entries(celule || {}).forEach(([a, v]) => {
        const p = pa(a);
        if (!p || v == null || v === '') return;
        if (typeof v === 'string' && v.charAt(0) === '=' && v.length > 1) {
          const en = laForma(v, 'en', 'en') || laForma(v, 'ro', 'en');
          f.cel[adr(p.r, p.c)] = en ? { f: en } : { v };
        } else if (typeof v === 'string') { const k = constanta(v); f.cel[adr(p.r, p.c)] = { v: k.v, ap: k.ap }; if (k.fn) (f.fmt[adr(p.r, p.c)] = f.fmt[adr(p.r, p.c)] || {}).format_numar = k.fn; }
        else f.cel[adr(p.r, p.c)] = { v };
      });
      Object.entries(format || {}).forEach(([a, o]) => {
        const p = pa(a);
        if (p && o && typeof o === 'object') f.fmt[adr(p.r, p.c)] = Object.assign({}, f.fmt[adr(p.r, p.c)] || {}, o);
        if (p && o && o.imbinat && f.merge.indexOf(o.imbinat) < 0) f.merge.push(o.imbinat);
      });
    }
    /* parametrii de CONȚINUT (lecția alege foaia, nu interfața): celule, selectie, format (formatul `start` al scenariilor),
       plus foi: [{nume, celule, format}] și nume (registrul deja salvat) */
    if (Array.isArray(c.foi) && c.foi.length) c.foi.forEach((x, i) => { const f = foaieNoua(String(x.nume || 'Sheet' + (i + 1))); puneStart(f, x.celule, x.format, x.latimi); if (/^#?[0-9a-f]{6}$/i.test(String(x.culoare || ''))) f.culoare = '#' + String(x.culoare).replace('#', '').toUpperCase(); M.foi.push(f); });
    else { const tab = ((Z.file_foi || {}).c || []).find(x => x.t === 'TabItem'); M.foi.push(foaieNoua(tab ? tab.e : 'Sheet1')); puneStart(M.foi[0], c.celule, c.format, c.latimi); }
    if (c.selectie) {
      const parti = String(c.selectie).split(',').map(zonaDin).filter(Boolean);
      if (parti.length) F().sel = { activa: { r: parti[0].r0, c: parti[0].c0 }, zone: parti };
    }
    if (c.nume) { M.nume = /\.[a-z0-9]{2,5}$/i.test(c.nume) ? String(c.nume) : c.nume + '.xlsx'; M.salvat = true; }
    /* „modificat”: conținutul pus la pornire într-un registru nou, nesalvat, contează ca modificare (Excel real, conținut pus
       prin COM: uia_excel.json › acoperire_r7.fapte.b_ctrl_w_modificat.registru_saved_inainte = false; scenariul
       excel-ctrl-w-modificat pornește cu A1 = „x” și Excel întreabă); lecția îl poate spune explicit (ca la Word) */
    M.mod = typeof c.modificat === 'boolean' ? c.modificat : (!M.nume && M.foi.some(f => Object.keys(f.cel).length > 0));
    /* ferestrele de salvare ale Office (X8, m1-l03): Ctrl+S pe registru nou și întrebarea de la închidere */
    const SALVARE_NOUA = 'dialog.save_this_file', INTREBARE_INCHIDERE = 'dialog.save_your_changes_to_this_file';
    let BOOK = (Z.registru || {}).e || 'Book1';
    /* runda 29 (G25-1): întrebarea la ștergerea unei foi cu date și refuzul la singura foaie. NU sunt în uia_excel.json:
       DLG_STERGE e desenată după captura lecției viii/m1-l03 › img/confirma-stergerea.webp (titlul verde „Microsoft Excel”,
       triunghiul de avertizare, textul pe două rânduri, Delete — butonul cu focusul — și Cancel jos-dreapta; locurile = pixelii
       capturii, fereastra centrată la 1366×768); DLG_REFUZ are textul mesajului Excel, fără captură [DEDUS]. Forma arborelui
       = a ferestrelor „Microsoft Excel” din referință (dialog.eroare_formula). Capturile reale: de_verificat R29-1, R29-2 */
    /* DLG_NUME (unghiul stare_finala_erori): redenumirea cu numele altei foi (m1-l03:226-229: „Încearcă în fereastră și citește
       mesajul”; răspunsul lecției: „Că numele e deja luat de altă foaie”) — textul mesajului Excel 365, fără captură [DEDUS: R29-7] */
    const DLG_STERGE = 'dialog.sterge_foaia', DLG_REFUZ = 'dialog.foaie_unica', DLG_NUME = 'dialog.nume_foaie_existent';
    const TEXT_NUME = 'That name is already taken. Try a different one.';
    const TEXT_STERGE = 'Microsoft Excel will permanently delete this sheet.\nDo you want to continue?';
    const TEXT_REFUZ = 'A workbook must contain at least one visible worksheet.\n\nTo hide, delete, or move the selected sheet(s), you must first insert a new sheet or unhide a sheet that is already hidden.';
    function mesajExcel(r, text, rt, butoane) {
      const ix = r[0] + 7, iy = r[1] + 30, iw = r[2] - 14, ih = r[3] - 38;
      return { t: 'Window', e: 'Microsoft Excel', r, c: [
        { t: 'Pane', e: '', r: [ix, iy, iw, ih], c: [{ t: 'Window', e: 'Microsoft Excel', r: [ix, iy, iw, ih], c: [
          { t: 'Text', e: 'Microsoft Excel', r: [r[0] + 31, r[1] + 38, 160, 28] },
          { t: 'Image', e: 'Warning Icon', r: [r[0] + 40, r[1] + 98, 34, 34] },
          { t: 'Text', e: text, r: rt }].concat(butoane) }] },
        { t: 'TitleBar', e: '', r: [ix, r[1] + 2, iw, 28], c: [{ t: 'Button', e: 'Închidere', r: [r[0] + r[2] - 42, r[1], 35, 30] }] }] };
    }
    if (!SUP[DLG_STERGE]) {
      SUP[DLG_STERGE] = mesajExcel([455, 270, 456, 214], TEXT_STERGE, [545, 366, 330, 42],
        [{ t: 'Button', e: 'Delete', ta: 'ALT+D', r: [714, 435, 79, 27] }, { t: 'Button', e: 'Cancel', r: [805, 435, 79, 27] }]);
      SUP[DLG_REFUZ] = mesajExcel([418, 262, 530, 236], TEXT_REFUZ, [508, 360, 400, 80],
        [{ t: 'Button', e: 'OK', r: [839, 448, 79, 27] }]);
      SUP[DLG_NUME] = mesajExcel([470, 290, 426, 180], TEXT_NUME, [555, 392, 310, 22],
        [{ t: 'Button', e: 'OK', r: [787, 432, 79, 27] }]);
      [DLG_STERGE, DLG_REFUZ, DLG_NUME].forEach(k => { date.dialoguri[k] = { titlu: 'Microsoft Excel', file: [{ s: k, fila: null }] }; });
    }
    const MESAJ_FOAIE = { [DLG_STERGE]: TEXT_STERGE, [DLG_REFUZ]: TEXT_REFUZ, [DLG_NUME]: TEXT_NUME };
    /* triunghiul de avertizare al ferestrelor de mai sus (desen propriu, nu o resursă Microsoft — I7) */
    const SVG_AVERT = '<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true"><path d="M17 3.5 31.5 30h-29z" fill="#fcd77e" stroke="#c98a1b" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.6 12h2.8l-.5 10h-1.8z" fill="#3b3b3b"/><circle cx="17" cy="25.3" r="1.6" fill="#3b3b3b"/></svg>';

    /* ---- valorile (recalculare la cerere, cu ciclu → 0) */
    let cache = null, matC = null, vcache = null;
    function valoare(f, r, c0) {
      const a = adr(r, c0), x = f.cel[a];
      if (!x) { const sv = varsat(f, r, c0); return sv ? (sv.v == null ? 0 : sv.v) : null; }
      if (!x.f) return x.v;
      if (!cache) cache = new Map();
      const k = f.nume + '!' + a;
      if (cache.has(k)) { const v = cache.get(k); return v === CICLU ? 0 : v; }
      cache.set(k, CICLU);
      let v;
      try { v = evalua(f, arbore(jetoane(x.f.slice(1), 'en'))); } catch (e) { v = eErr(e) ? e : ERR('#NAME?'); }
      /* rezultat-zonă (E5): ancora ia primul element, restul se varsă în celulele de sub / din dreapta (varsat) dacă sunt
         goale; ocupate = #SPILL! (runda 17; uia_excel.json › acoperire_r14.fapte.v_varsare_com.a_ocupat: D2 „#SPILL!”, CVErr
         2045, golirea lui D4 readuce vărsarea). O zonă simplă de mai multe celule (=B2:B6) se varsă la fel (fapte.c_simple:
         D2:D6 = 9, 7, 8, 10, 6; celula goală din zonă = 0, ca în Excel 365) */
      if (v && v.zona && !v.mat && multi(v)) v = zonaMat(f, v) || v;
      if (v && v.mat && v.vals.length > 1) { (matC || (matC = new Map())).set(k, v); v = liber(f, r, c0, v) ? v.vals[0] : ERR('#SPILL!'); }
      else if (v && v.zona) v = v.vals.length ? v.vals[0] : null;
      if (v === null) v = 0;
      cache.set(k, v);
      return v;
    }
    const CICLU = {};
    const invalid = () => { cache = null; matC = null; vcache = null; };
    /* ---- E5, vărsarea. Excel real (runde/8/critic_probe/com_r8.json): =SUM(B2:B7)*B2:B6 în D2 → D2:D6 = 432, 336, 384, 480,
       288, HasSpill, formula doar în D2 (D3 Formula2 = ""). O operație aritmetică (+ − * / ^, minus, %) cu o zonă de mai multe
       celule dă un rezultat-zonă (mat), element cu element; un număr se aplică pe toată zona, iar zonele de mărimi diferite
       dau #N/A în afara celei mici. Doar aritmetica: =B2:B6 simplu, &, comparațiile și funcțiile de zonă rămân ca înainte
       (de_verificat R10-3) */
    const LIM_MAT = 5000;
    const dimZ = v => (v.mat ? [v.rows, v.cols] : [v.z.r1 - v.z.r0 + 1, v.z.c1 - v.z.c0 + 1]);
    const multi = v => !!(v && v.zona) && dimZ(v)[0] * dimZ(v)[1] > 1;
    const unV = v => (v && v.zona ? (v.vals.length === 1 ? v.vals[0] : ERR('#VALUE!')) : v);
    function elem(f, v, i, j) {
      if (!(v && v.zona)) return v;
      const [R, C] = dimZ(v), ii = R === 1 ? 0 : i, jj = C === 1 ? 0 : j;
      if (ii >= R || jj >= C) return ERR('#N/A');
      return v.mat ? v.vals[ii * v.cols + jj] : valoare(f, v.z.r0 + ii, v.z.c0 + jj);
    }
    function aritm(o, x, y) {
      if (o === '+') return x + y;
      if (o === '-') return x - y;
      if (o === '*') return x * y;
      if (o === '/') { if (y === 0) throw ERR('#DIV/0!'); return x / y; }
      if (o === '^') return Math.pow(x, y);
      if (o === 'neg') return -x;
      return x / 100;
    }
    /* o zonă de celule ca rezultat-zonă (vărsarea lui =B2:B6); prea mare = null (rămâne primul element, ca înainte) */
    function zonaMat(f, v) {
      const [R, C] = dimZ(v);
      if (R * C > LIM_MAT) return null;
      const vals = [];
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) { const x = valoare(f, v.z.r0 + i, v.z.c0 + j); vals.push(x == null || x === '' ? 0 : x); }
      return { zona: true, mat: true, rows: R, cols: C, vals, z: { r0: 0, c0: 0, r1: R - 1, c1: C - 1 } };
    }
    /* runda 17: & și comparațiile merg element cu element pe o zonă (fapte.c_simple: =B2:B6&"x" → 9x, 7x…; =B2:B6>8 → TRUE,
       FALSE…), ca aritmetica */
    const CMP = { '=': x => x === 0, '<>': x => x !== 0, '<': x => x < 0, '>': x => x > 0, '<=': x => x <= 0, '>=': x => x >= 0 };
    function opElem(o, x, y) {
      if (o === '&' || CMP[o]) {
        if (eErr(x)) throw x;
        if (eErr(y)) throw y;
        return o === '&' ? txt(x) + txt(y) : CMP[o](compara(x, y));
      }
      return aritm(o, num(x), y === undefined ? 0 : num(y));
    }
    function opMat(f, o, A, B) {
      const [ra, ca] = A && A.zona ? dimZ(A) : [1, 1], [rb, cb] = B && B.zona ? dimZ(B) : [1, 1];
      const R = Math.max(ra, rb), C = Math.max(ca, cb);
      if (R * C > LIM_MAT) throw ERR('#VALUE!');
      const vals = [];
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
        try { vals.push(opElem(o, elem(f, A, i, j), B === undefined ? undefined : elem(f, B, i, j))); } catch (e) { vals.push(eErr(e) ? e : ERR('#VALUE!')); }
      }
      return { zona: true, mat: true, rows: R, cols: C, vals, z: { r0: 0, c0: 0, r1: R - 1, c1: C - 1 } };
    }
    /* locul vărsării e liber: nicio celulă cu conținut în zonă (afară de ancoră) și zona încape în foaie */
    function liber(f, r, c0, m) {
      if (r + m.rows > MAXR || c0 + m.cols > MAXC) return false;
      for (let i = 0; i < m.rows; i++) for (let j = 0; j < m.cols; j++) if ((i || j) && f.cel[adr(r + i, c0 + j)]) return false;
      return true;
    }
    /* ancorele posibile = formulele cu o zonă (au „:”) */
    function ancore(f) {
      if (!vcache) vcache = new Map();
      const k = f.nume + '#ancore';
      if (!vcache.has(k)) vcache.set(k, Object.keys(f.cel).filter(a => f.cel[a].f && f.cel[a].f.indexOf(':') >= 0));
      return vcache.get(k);
    }
    /* celula goală (r, c0) primește o valoare vărsată? → {v, ancora} sau null */
    function varsat(f, r, c0) {
      const lista = ancore(f);
      if (!lista.length) return null;
      const k = f.nume + '!' + r + ',' + c0;
      if (vcache.has(k)) return vcache.get(k);
      vcache.set(k, null);
      let rez = null;
      for (const a of lista) {
        const p = pa(a);
        if (!p || p.r > r || p.c > c0 || (p.r === r && p.c === c0)) continue;
        valoare(f, p.r, p.c);
        const m = matC && matC.get(f.nume + '!' + a);
        if (!m || r - p.r >= m.rows || c0 - p.c >= m.cols || !liber(f, p.r, p.c, m)) continue;
        rez = { v: m.vals[(r - p.r) * m.cols + (c0 - p.c)], ancora: a };
        break;
      }
      vcache.set(k, rez);
      return rez;
    }
    /* toate celulele vărsate ale foii: [[adresă, r, c0]] */
    function toateVarsate(f) {
      const o = [];
      ancore(f).forEach(a => {
        const p = pa(a); if (!p) return;
        valoare(f, p.r, p.c);
        const m = matC && matC.get(f.nume + '!' + a);
        if (!m || !liber(f, p.r, p.c, m)) return;
        for (let i = 0; i < m.rows; i++) for (let j = 0; j < m.cols; j++) if (i || j) o.push([adr(p.r + i, p.c + j), p.r + i, p.c + j]);
      });
      return o;
    }
    function num(v) {
      if (eErr(v)) throw v;
      if (v == null) return 0;
      if (typeof v === 'boolean') return v ? 1 : 0;
      if (typeof v === 'number') return v;
      const n = textNumeric(v);
      if (n == null) throw ERR('#VALUE!');
      return n;
    }
    const txt = v => { if (eErr(v)) throw v; return v == null ? '' : typeof v === 'number' ? general(v) : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : String(v); };
    function compara(a, b) {
      const tip = v => typeof v === 'number' ? 0 : typeof v === 'string' ? 1 : typeof v === 'boolean' ? 2 : 0;
      if (a == null) a = typeof b === 'string' ? '' : typeof b === 'boolean' ? false : 0;
      if (b == null) b = typeof a === 'string' ? '' : typeof a === 'boolean' ? false : 0;
      if (tip(a) !== tip(b)) return tip(a) - tip(b);
      if (typeof a === 'string') return a.localeCompare(b, 'ro', { sensitivity: 'base' });
      return a === b ? 0 : a < b ? -1 : 1;
    }
    function criteriu(cr) {
      if (typeof cr === 'number' || typeof cr === 'boolean') return v => compara(v, cr) === 0 && typeof v === typeof cr;
      const m = /^(<>|<=|>=|=|<|>)?(.*)$/.exec(String(cr == null ? '' : cr));
      const o = m[1] || '=', s = m[2], n = textNumeric(s);
      const w = /[*?]/.test(s) && n == null ? new RegExp('^' + s.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i') : null;
      return v => {
        const x = n != null && typeof v === 'number' ? compara(v, n) : n != null ? NaN : w ? (w.test(v == null ? '' : String(v)) ? 0 : 1) : compara(v == null ? '' : String(v), s);
        if (isNaN(x)) return o === '<>';
        return o === '=' ? x === 0 : o === '<>' ? x !== 0 : o === '<' ? x < 0 : o === '>' ? x > 0 : o === '<=' ? x <= 0 : x >= 0;
      };
    }
    function evalua(f, n) {
      switch (n.k) {
        case 'v': return n.v;
        case 'gol': return null;
        case 'ref': return valoare(f, n.r, n.c);
        case 'zona': { const vals = []; const z = n.z, r1 = Math.min(z.r1, ultim(f).r + 1), c1 = Math.min(z.c1, ultim(f).c + 1); for (let r = z.r0; r <= r1; r++) for (let c0 = z.c0; c0 <= c1; c0++) vals.push(valoare(f, r, c0)); return { zona: true, vals, z }; }
        case 'neg': case 'pct': { const A = evalua(f, n.a); if (multi(A)) return opMat(f, n.k, A); const x = num(unV(A)); return n.k === 'neg' ? -x : x / 100; }
        case 'op': {
          const A = evalua(f, n.a), B = evalua(f, n.b);
          if ((/^[-+*/^&]$/.test(n.o) || CMP[n.o]) && (multi(A) || multi(B))) return opMat(f, n.o, A, B);
          const a = unV(A), b = unV(B);
          if (n.o === '&') return txt(a) + txt(b);
          if (/^(=|<>|<|>|<=|>=)$/.test(n.o)) { if (eErr(a)) throw a; if (eErr(b)) throw b; const x = compara(a, b); return { '=': x === 0, '<>': x !== 0, '<': x < 0, '>': x > 0, '<=': x <= 0, '>=': x >= 0 }[n.o]; }
          const x = num(a), y = num(b);
          if (n.o === '+') return x + y;
          if (n.o === '-') return x - y;
          if (n.o === '*') return x * y;
          if (n.o === '/') { if (y === 0) throw ERR('#DIV/0!'); return x / y; }
          if (n.o === '^') return Math.pow(x, y);
          break;
        }
        case 'fn': return functie(f, n);
      }
      throw ERR('#VALUE!');
    }
    const un = (f, n) => { const v = evalua(f, n); if (v && v.zona) return v.vals.length === 1 ? v.vals[0] : ERR('#VALUE!'); return v; };
    function functie(f, n) {
      const F2 = n.f, A = n.args;
      if (!n.cunoscut) throw ERR('#NAME?');
      if (F2 === 'IF') { const c0 = un(f, A[0]); if (eErr(c0)) throw c0; return num(c0) ? un(f, A[1]) : (A[2] ? un(f, A[2]) : false); }
      if (F2 === 'IFERROR') { try { const v = un(f, A[0]); if (eErr(v)) throw v; return v; } catch (e) { if (eErr(e)) return un(f, A[1]); throw e; } }
      const V = A.map(a => evalua(f, a));
      const toate = (doarNum) => { const o = []; V.forEach(v => { if (v && v.zona) v.vals.forEach(x => { if (eErr(x)) throw x; if (typeof x === 'number') o.push(x); }); else if (v != null) o.push(doarNum ? num(v) : v); }); return o; };
      const s1 = () => un(f, A[0]);
      switch (F2) {
        case 'SUM': return toate(true).reduce((s, x) => s + x, 0);
        case 'PRODUCT': return toate(true).reduce((s, x) => s * x, 1);
        /* AVEDEV = media abaterilor absolute de la medie (scenarii_real/excel-av-tab.json: 9, 7, 8 → 0,666667) */
        case 'AVEDEV': { const o = toate(true); if (!o.length) throw ERR('#NUM!'); const m = o.reduce((s, x) => s + x, 0) / o.length; return o.reduce((s, x) => s + Math.abs(x - m), 0) / o.length; }
        case 'AVERAGE': { const o = toate(true); if (!o.length) throw ERR('#DIV/0!'); return o.reduce((s, x) => s + x, 0) / o.length; }
        case 'MIN': { const o = toate(true); return o.length ? Math.min(...o) : 0; }
        case 'MAX': { const o = toate(true); return o.length ? Math.max(...o) : 0; }
        case 'MEDIAN': { const o = toate(true).sort((a, b) => a - b); if (!o.length) throw ERR('#NUM!'); const k = o.length >> 1; return o.length % 2 ? o[k] : (o[k - 1] + o[k]) / 2; }
        case 'COUNT': { let k = 0; V.forEach(v => { if (v && v.zona) v.vals.forEach(x => { if (typeof x === 'number') k++; }); else if (typeof v === 'number' || (typeof v === 'string' && textNumeric(v) != null)) k++; }); return k; }
        case 'COUNTA': { let k = 0; V.forEach(v => { if (v && v.zona) v.vals.forEach(x => { if (x != null && x !== '') k++; }); else k++; }); return k; }
        case 'COUNTBLANK': { const v = V[0]; if (!(v && v.zona)) throw ERR('#VALUE!'); const z = v.z; const tot = (Math.min(z.r1, MAXR) - z.r0 + 1) * (z.c1 - z.c0 + 1); return tot - v.vals.filter(x => x != null && x !== '').length; }
        case 'COUNTIF': { const v = V[0]; if (!(v && v.zona)) throw ERR('#VALUE!'); const t = criteriu(un(f, A[1])); return v.vals.filter(t).length; }
        case 'SUMIF': case 'AVERAGEIF': {
          const v = V[0]; if (!(v && v.zona)) throw ERR('#VALUE!');
          const t = criteriu(un(f, A[1])), s = A[2] ? V[2] : v;
          let sum = 0, k = 0;
          v.vals.forEach((x, i) => { if (t(x)) { const y = s.vals ? s.vals[i] : null; if (typeof y === 'number') { sum += y; k++; } } });
          if (F2 === 'SUMIF') return sum;
          if (!k) throw ERR('#DIV/0!');
          return sum / k;
        }
        case 'AND': case 'OR': { const o = []; V.forEach(v => { if (v && v.zona) v.vals.forEach(x => { if (typeof x === 'number' || typeof x === 'boolean') o.push(!!x); }); else o.push(!!num(v)); }); if (!o.length) throw ERR('#VALUE!'); return F2 === 'AND' ? o.every(Boolean) : o.some(Boolean); }
        case 'NOT': return !num(s1());
        case 'ABS': return Math.abs(num(s1()));
        case 'INT': return Math.floor(num(s1()));
        case 'SQRT': { const x = num(s1()); if (x < 0) throw ERR('#NUM!'); return Math.sqrt(x); }
        case 'POWER': return Math.pow(num(s1()), num(un(f, A[1])));
        case 'MOD': { const x = num(s1()), y = num(un(f, A[1])); if (y === 0) throw ERR('#DIV/0!'); return x - y * Math.floor(x / y); }
        case 'ROUND': case 'ROUNDUP': case 'ROUNDDOWN': {
          const x = num(s1()), d = Math.trunc(num(un(f, A[1]))), p = Math.pow(10, d), y = Math.abs(x) * p;
          const r = F2 === 'ROUND' ? Math.round(+y.toPrecision(15)) : F2 === 'ROUNDUP' ? Math.ceil(+y.toPrecision(15)) : Math.floor(+y.toPrecision(15));
          return Math.sign(x) * r / p;
        }
        case 'LEN': return txt(s1()).length;
        case 'UPPER': return txt(s1()).toUpperCase();
        case 'LOWER': return txt(s1()).toLowerCase();
        case 'PROPER': return txt(s1()).toLowerCase().replace(/(^|[^\p{L}])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
        case 'TRIM': return txt(s1()).replace(/ +/g, ' ').trim();
        case 'LEFT': return txt(s1()).slice(0, A[1] ? num(un(f, A[1])) : 1);
        case 'RIGHT': { const s = txt(s1()), k = A[1] ? num(un(f, A[1])) : 1; return k ? s.slice(-k) : ''; }
        case 'MID': { const s = txt(s1()), a = num(un(f, A[1])), k = num(un(f, A[2])); if (a < 1 || k < 0) throw ERR('#VALUE!'); return s.substr(a - 1, k); }
        case 'CONCAT': case 'CONCATENATE': { let s = ''; V.forEach(v => { if (v && v.zona) v.vals.forEach(x => { s += txt(x); }); else s += txt(v); }); return s; }
        case 'SUBSTITUTE': { const s = txt(s1()), a = txt(un(f, A[1])), b = txt(un(f, A[2])); if (!a) return s; if (A[3]) { let k = num(un(f, A[3])), i = -1; while (k-- > 0) { i = s.indexOf(a, i + 1); if (i < 0) return s; } return s.slice(0, i) + b + s.slice(i + a.length); } return s.split(a).join(b); }
      }
      throw ERR('#NAME?');
    }
    function ultim(f) {
      let r = 0, c0 = 0;
      Object.keys(f.cel).forEach(a => { const p = pa(a); if (p) { r = Math.max(r, p.r); c0 = Math.max(c0, p.c); } });
      return { r, c: c0 };
    }
    const fmtDe = (f, a) => f.fmt[a] || {};
    const latPx = (f, c0) => (f.lat && f.lat[c0] != null ? f.lat[c0] : 64);
    /* câte cifre încap în celulă (celula îmbinată = toate coloanele ei) */
    function unitati(f, r, c0) {
      const m = mergeLa(f, r, c0);
      let px = 0;
      if (m) for (let k = m.c0; k <= m.c1; k++) px += latPx(f, k); else px = latPx(f, c0);
      return unitatiDin(px);
    }
    const textCelula = (f, r, c0) => { const a = adr(r, c0), x = f.cel[a]; if (!x && !varsat(f, r, c0)) return ''; return inLatime(valoare(f, r, c0), fmtDe(f, a).format_numar, unitati(f, r, c0)); };
    /* ce se scrie în bara de formule / în celulă la F2: formula pe românește, numărul cu virgulă, textul cu apostroful lui */
    function textEditare(f, a) {
      const x = f.cel[a];
      if (!x) return '';
      if (x.f) return laForma(x.f, 'en', 'ro') || x.f;
      if (typeof x.v === 'number') { const fn = fmtDe(f, a).format_numar; return fn === 'dd.mmm' || fn === 'dd.mm.yyyy' ? afisat(x.v, 'dd.mm.yyyy') : general(x.v); }
      if (typeof x.v === 'boolean') return x.v ? 'TRUE' : 'FALSE';
      return (x.ap ? "'" : '') + String(x.v);
    }

    /* ============================================================ starea (§5) */
    function selectieStare() {
      const s = F().sel;
      return { activa: adr(s.activa.r, s.activa.c), zona: s.zone.map(zonaText).join(',') };
    }
    I.stare = () => {
      const f = F(), cel = {}, fmt = {};
      Object.keys(f.cel).forEach(a => {
        const p = pa(a), x = f.cel[a];
        let v = valoare(f, p.r, p.c);
        const o = { valoare: eErr(v) ? v.e : v, text: inLatime(v, fmtDe(f, a).format_numar, unitati(f, p.r, p.c)) };
        if (x.f) o.formula = x.f;
        cel[a] = o;
      });
      /* celulele vărsate (E5): valoarea și textul, fără formulă (com_r8.json › 2_D3_formula2 = "") */
      toateVarsate(f).forEach(([a, r, c0]) => { const v = valoare(f, r, c0); cel[a] = { valoare: eErr(v) ? v.e : v, text: inLatime(v, fmtDe(f, a).format_numar, unitati(f, r, c0)) }; });
      /* celula în editare: pe ecran e textul tastat (§3 „ecranul = starea”), deci și aici; `editare` spune că nu e încă primit */
      if (M.edit) cel[M.edit.a] = { valoare: M.edit.text, text: M.edit.text, editare: true };
      if (M.edit && M.edit.text === '') delete cel[M.edit.a];
      Object.keys(f.fmt).forEach(a => {
        const o = {}, x = f.fmt[a];
        ['bold', 'italic', 'underline'].forEach(k => { if (x[k]) o[k] = true; });
        if (x.aliniere) o.aliniere = x.aliniere;
        if (x.imbinat) o.imbinat = x.imbinat;
        if (x.format_numar && x.format_numar !== 'General') o.format_numar = x.format_numar;
        if (x.umplere) o.umplere = x.umplere;
        if (x.incadrare) o.incadrare = true;
        if (Object.keys(o).length) fmt[a] = o;
      });
      /* bordurile pe celulă, ca Range.Borders din Excel real: muchia comună apare la ambele celule (com_r7c.json › all_borders) */
      Object.keys(f.bord || {}).forEach(k => {
        const [t, r, c0] = k.split(','), R = +r, C = +c0, v = f.bord[k];
        const pune = (rr, cc, latura) => { if (rr < 0 || cc < 0) return; const a = adr(rr, cc); fmt[a] = fmt[a] || {}; (fmt[a].borduri = fmt[a].borduri || {})[latura] = v; };
        if (t === 'h') { pune(R, C, 'sus'); pune(R - 1, C, 'jos'); } else { pune(R, C, 'stanga'); pune(R, C - 1, 'dreapta'); }
      });
      const latimi = {}, inaltimi = {};
      Object.keys(f.lat || {}).forEach(k => { latimi[colNume(+k)] = f.lat[k]; });
      Object.keys(INALT).forEach(r => { inaltimi[String(+r + 1)] = INALT[r]; });
      return { celule: cel, format_celule: fmt, latimi_coloane: latimi, inaltimi_randuri: inaltimi, selectie: selectieStare(), nume_fisier: M.nume, fereastra_mesaj: M.mesaj,
        ramane_in_editare: !!M.edit, foi: M.foi.map(x => x.nume), foaie_activa: F().nume, culori_file: culoriFile(), dialog: dialogStare(),
        pagina_backstage: backstage ? backstage.pagina : null, titlu_fereastra: titlu(),
        grafice: stareGrafice(), grafic_activ: !!M.gr, grafic_element_ales: M.gr ? (M.gr.parte === 'titlu' ? 'Chart Title' : 'Chart Area') : null,
        ...stareGraficPrim(),
        fisiere: magazie() ? magazie().stare() : null, dosar_fisier: M.dosar, avertisment_fisier: M.avertisment,
        registru_activ: REG.gol ? null : numeRegistru(), registre: REG.alte.map(r => r.nume ? r.nume.replace(/\.[a-z0-9]{2,5}$/i, '') : r.book).concat(REG.gol ? [] : [numeRegistru()]) };
    };
    /* `dialog` (§5): fereastra deschisă; „Save your changes to this file?” = fereastra care ÎNTREABĂ, în forma din
       scenarii_real/excel-ctrl-w-modificat.json: {titlu: '' (bara de titlu goală), intrebare, butoane: rândul de jos, de la
       stânga la dreapta (uia_excel.json › dialog.save_your_changes_to_this_file), apasat: null cât e deschisă} */
    function dialogStare() {
      if (!dialog) return null;
      if (dialog.baza === INTREBARE_INCHIDERE) return { titlu: '', intrebare: (date.dialoguri[dialog.baza] || {}).titlu || '', butoane: butoaneJos(dialog.baza), apasat: null };
      /* runda 29: întrebarea ștergerii foii și refuzul la singura foaie = ferestre „Microsoft Excel” care întreabă / anunță */
      if (MESAJ_FOAIE[dialog.baza]) return { titlu: 'Microsoft Excel', intrebare: MESAJ_FOAIE[dialog.baza], butoane: butoaneJos(dialog.baza), apasat: null };
      return { titlu: (date.dialoguri[dialog.baza] || {}).titlu || '' };
    }
    /* `culori_file` (runda 29): {foaie: '#RRGGBB'} doar pentru filele colorate (Tab Color); {} = nicio filă colorată */
    function culoriFile() { const o = {}; M.foi.forEach(f => { if (f.culoare) o[f.nume] = f.culoare; }); return o; }
    function butoaneJos(baza) {
      const b = [];
      (function u(n, inTitlu) { if (!n) return; if (n.t === 'Button' && !inTitlu && n.r) b.push(n); (n.c || []).forEach(c => u(c, inTitlu || n.t === 'TitleBar')); })(SUP[baza], false);
      if (!b.length) return [];
      const jos = Math.max(...b.map(n => n.r[1] + n.r[3]));
      return b.filter(n => n.r[1] + n.r[3] >= jos - 10).sort((x, y) => x.r[0] - y.r[0]).map(n => n.e);
    }
    const numeRegistru = () => (M.nume ? M.nume.replace(/\.[a-z0-9]{2,5}$/i, '') : BOOK);
    const titlu = () => REG.gol ? 'Excel' : numeRegistru() + '  -  Excel';
    const instantaneu = () => ({ foi: clona(M.foi), fi: M.fi });
    function schimba(tip, fn) {
      H.inainte(tip, instantaneu());
      fn();
      M.salvat = false;
      M.mod = true;
      invalid();
    }

    /* ============================================================ fereastra (din date/excel.json) */
    let filaActiva = 'TabHome', strat = null, meniu = null, dialog = null, backstage = null;
    /* graficele (X10; codul în secțiunea „graficele”, mai jos): constantele stau aici, înaintea primului desen */
    const GR_TIP = { 'Clustered Column': 'col', 'Clustered Bar': 'bar', 'Line': 'line', 'Pie': 'pie' };
    const GR_FAMILIE = { 'Clustered Column': 'Column', 'Clustered Bar': 'Bar', 'Line': 'Line', 'Pie': 'Pie' };
    const GR_DIN_STANGA = { Column: 'Clustered Column', Bar: 'Clustered Bar', Line: 'Line', Pie: 'Pie' };
    /* subtipurile din dreapta ferestrei: Column = rândul din referință; Bar = rândurile 2-D / 3-D Bar din lista ▾ (aceeași referință) */
    const GR_SUB_BAR = ['Clustered Bar', 'Stacked Bar', '100% Stacked Bar', '3-D Clustered Bar', '3-D Stacked Bar', '3-D 100% Stacked Bar'];
    const GR_CUL = ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'];
    let contextActiv = null;
    M.gr = null;        // graficul ales: { i, parte: 'grafic' | 'titlu' }
    M.grTitlu = null;   // textul tastat pe titlul ales, încă nepus (se vede în bara de formule, ca în Excel)
    /* critic runda 10, GRAV T1: ținta textului venit FĂRĂ keydown (telefon, IME; aplicatii.js › trimite / beforeinput emit cu
       I.zonaTinta) = ținta focusului (§4): cu graficul sau titlul lui ales, focusul e graficul / titlul (ca tastaGrafic pe
       calculator), altfel celula activă. Getter, ca powerpoint.js:400; aplicatii.js (comun) nu se schimbă. */
    let zonaCel = 'celula:A1';
    Object.defineProperty(I, 'zonaTinta', { configurable: true,
      get: () => (M.gr && !M.edit && !dialog && !backstage ? 'grafic:' + (M.gr.i + 1) + (M.gr.parte === 'titlu' ? '/titlu' : '') : zonaCel),
      set: v => { zonaCel = v; } });
    /* X10 (runda 17): Add Chart Element › Data Labels ▸ — lista depinde de tipul graficului ales (uia_excel.json ›
       lista.AddChartElementMenu#Data Labels = Line; …#Data Labels#Clustered Column = coloane). Bar / Pie n-au referință
       (de_verificat R17-2): acolo Data Labels rămâne mesajul central. */
    const GR_ETICHETE = { 'Line': 'lista.AddChartElementMenu#Data Labels', 'Clustered Column': 'lista.AddChartElementMenu#Data Labels#Clustered Column' };
    const grafice = () => (F().grafice || (F().grafice = []));
    const gNum = (k, n) => Array.from({ length: Math.max(0, n) }, (x, j) => k + j);
    root.innerHTML = '';
    const el = (tag, cls, attrs) => { const e = document.createElement(tag); if (cls) e.className = cls; Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
    const pozitie = (e, r, baza) => { e.style.position = 'absolute'; e.style.left = (r[0] - (baza ? baza[0] : 0)) + 'px'; e.style.top = (r[1] - (baza ? baza[1] : 0)) + 'px'; };
    const sus = el('div', 'lh-ap-sus'), susIn = el('div', 'lh-ap-sus-in');
    /* runda 25 (MINOR 5 al criticului 21): în Excel panglica se termină la y 179 (uia_excel.json › panglica.TabHome › Lower Ribbon
       [9, 79, 1320, 100]), iar zona foii începe acolo (zona_document › Pane [1, 179, 239, 41], Grid [1, 220, 1342, 493]); cu înălțimea
       comună de 180 px (aplicatii.css › .lh-ap, rândul de sus al grilei) grila stătea cu 2 px mai jos și era cu 3 px mai scurtă.
       Doar la Excel, fără să schimb codul comun: zona foii urcă 2 px peste marginea de jos a panglicii (zonaSup.style.marginTop) */
    sus.appendChild(susIn);
    /* Acces rapid: în Excel bara e afișată (uia_excel.json › acces_rapid.afisat = True) și stă în bara de titlu */
    const QAT = new Set();
    (function u(n, inQ) { if (!n) return; const q = inQ || (n.t === 'ToolBar' && n.e === 'Quick Access Toolbar'); if (q) QAT.add(n); (n.c || []).forEach(x => u(x, q)); })(SUP.bara_titlu, false);
    const LANSATOR = { ShowClipboard: null, FormatCellsFontDialog: 'Font', CellAlignmentOptions: 'Alignment', FormatCellsNumberDialog: 'Number' };
    let elMod = null, elZoomText = null, elTitlu = null, elAfisare = null;
    const OPT = {
      tinta(n, ctx) {
        if (QAT.has(n) && ctx.cheie === 'bara_titlu') {
          if (n.t === 'ToolBar' || n.t === 'SplitButton') return null;
          if (n.t === 'MenuItem' && /More Options/.test(n.e || '')) return 'meniu_derulant:Quick Access Toolbar/' + ((ctx.parinteUnit || {}).e || '');
          if (n.t === 'MenuItem') return 'meniu_derulant:' + n.e;
          return 'acces_rapid:' + ((ctx.parinteUnit && ctx.parinteUnit.t === 'SplitButton') ? ctx.parinteUnit.e : n.e);
        }
        if (/^panglica/.test(ctx.cheie || '') && n.t === 'Button' && n.id && n.id in LANSATOR) return 'lansator:' + [ctx.fila, ctx.grup].filter(Boolean).join('/');
        /* rândurile unei liste ▾ desenate din referință (lista.AutoSum, lista.Borders) = meniu:<rând> (§3) */
        if (/^lista\./.test(ctx.cheie || '')) return (n.t === 'MenuItem' || n.t === 'ListItem') && n.e ? 'meniu:' + n.e : null;
        if (ctx.cheie === 'dialog.ColumnWidth' && n.t === 'Edit') return 'camp:latime_coloana';
        if (ctx.cheie === 'dialog.FileSaveAs') {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^File name:?$/.test(n.e)) return null;
          if (n.t === 'ComboBox' && /^Save as type:?$/.test(n.e)) return 'camp:tip_fisier';
          if (n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }
        /* „Save this file” / „Save your changes to this file?” (uia_excel.json › suprafete): caseta File name, caseta mică Save
           as type; Save / Cancel din „Save this file” = ca în Save As; butoanele întrebării rămân fereastra:<buton> */
        if (ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^Save as type:?$/.test(n.e)) return 'camp:tip_fisier';
          if (ctx.cheie === SALVARE_NOUA && n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }
        return undefined;
      },
      la(n, e, ctx) {
        if (ctx.cheie === 'bara_titlu' && n.t === 'ToolBar' && QAT.has(n)) e.setAttribute('data-lh-suprafata', 'acces_rapid');
        if (ctx.cheie === 'bara_titlu' && QAT.has(n) && n.t === 'MenuItem' && /^Customize Quick Access Toolbar$/.test(n.e || '')) e.innerHTML = pang.svg(ICO_CHEVRON, 12);   // ▾ în loc de lupă (Fluent chevron_down)
        if (ctx.cheie === 'bara_titlu' && n.t === 'TitleBar' && /\s-\s/.test(n.e || '')) {
          const t = el('span', 'lh-ap-text lh-ap-x-titlu');
          t.textContent = titlu();
          e.appendChild(t);
          e.setAttribute('data-lh-eticheta', titlu());
          elTitlu = e;
        }
        if (/^panglica/.test(ctx.cheie || '') && n.t === 'Button' && n.id && n.id in LANSATOR) e.innerHTML = pang.glif('lansator', 12);
        if (ctx.cheie === 'bara_stare' && n.t === 'Text' && /^Cell Mode /.test(n.e || '')) { e.innerHTML = '<span class="lh-ap-text"></span>'; elMod = e; }
        if (ctx.cheie === 'bara_stare' && n.t === 'Text' && /^Zoom \d/.test(n.e || '')) elZoomText = e;
        if (ctx.cheie === 'bara_stare' && n.t === 'Button' && n.e === 'Normal') e.classList.add('lh-ap-apasat');
        if (ctx.cheie === 'bara_stare' && n.t === 'Button' && /^Display Settings/.test(n.e || '')) elAfisare = e;
        /* lista Borders din referință n-are idMso pe rânduri: idMso-ul (pentru efect și pictogramă) vine din BORD_LISTA, după etichetă */
        /* lista ▾ a graficelor (uia_excel.json › lista.ChartTypeColumnInsertGallery): titlul fiecărui grup (2-D Column…) în banda
           de sus a grupului (29,6 px până la primul rând) și o pictogramă desenată pe rânduri (referința nu dă pictogramele) */
        /* la fel lista Line (lista.ChartTypeLineInsertGallery, runda 17): 2-D Line, 3-D Line, 2-D Area, 3-D Area */
        if (ctx.cheie === 'lista.ChartTypeColumnInsertGallery' || ctx.cheie === 'lista.ChartTypeLineInsertGallery') {
          if (n.t === 'Group' && (n.e || '').trim()) { const h = el('div', 'lh-ap-x-gr-grup'); h.textContent = n.e; e.appendChild(h); }
          if (n.t === 'ListItem') e.innerHTML = pictogramaGrafic(n.e, 32);
        }
        /* submeniul Data Labels ▸: rândurile galeriei (None, Center, Right…) au numele scris pe ecran; locul lui e lângă rândul
           „Data Labels” al listei-părinte (referința: x 159 = marginea dreaptă a rândului, y 245 = sus-ul rândului) */
        if (/^lista\.AddChartElementMenu#/.test(ctx.cheie || '') && n.t === 'ListItem') e.classList.add('lh-ap-x-dl-rand');
        /* Chart Design › Quick Styles: rândurile Style 1…16 din referință n-au imagine; se desenează graficul ales, mic */
        if (ctx.cheie === 'panglica_context.Ctx_ChartDesign' && n.t === 'ListItem' && /^Style \d+$/.test(n.e || '')) { const g0 = M.gr && grafice()[M.gr.i]; e.innerHTML = pictogramaGrafic(g0 ? g0.tip : 'Clustered Column', 40); }
        if (ctx.cheie === 'lista.Borders' && n.t === 'MenuItem') {
          const bl = BORD_LISTA.find(x => x[1] === n.e);
          if (bl) { e.setAttribute('data-lh-id-mso', bl[0]); const ic = pang.icoana(I, bl[0], 16); if (ic && /^<svg|^<span/.test(ic)) e.insertAdjacentHTML('afterbegin', ic); }
        }
      },
      editabil(n, ctx) { return (/^dialog\.(FileSaveAs|save_this_file|save_your_changes_to_this_file)$/.test(ctx.cheie || '') && n.t === 'Edit' && /^File name/.test(n.e)) || (ctx.cheie === 'dialog.ColumnWidth' && n.t === 'Edit'); }
    };
    const desen = (cheie, extra) => pang.deseneaza(I, cheie, Object.assign({}, OPT, extra || {}));
    const titluEl = desen('bara_titlu');
    pozitie(titluEl, SUP.bara_titlu.r);
    const filePl = desen('file_panglicii');
    pozitie(filePl, SUP.file_panglicii.r);
    const loculPanglicii = el('div', 'lh-ap-loc-panglica');
    susIn.append(titluEl, filePl, loculPanglicii);
    const RAND_FILE = filePl.querySelector('[data-lh-eticheta="Ribbon Tabs"]') || filePl;

    /* ---- zona foii (uia_excel.json › zona_document): Name Box, bara de formule, grila, filele foilor */
    const RZ = k => (Z[k] && Z[k].r) || null;
    const zonaSup = el('div', 'lh-ap-zona-sup lh-ap-x-zona', { 'data-lh-suprafata': 'zona_document', 'data-lh-tip': 'Pane', 'data-lh-eticheta': '' });
    const randF = el('div', 'lh-ap-x-rand-formule');
    const paneNume = el('div', 'lh-ap-x-pane-nume', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': '' });
    const cn = Z.caseta_nume || { e: 'Name Box', r: [10, 188, 131, 24] };
    const comboNume = el('div', 'lh-ap-x-nume', { 'data-lh-tip': 'ComboBox', 'data-lh-eticheta': cn.e, role: 'combobox' });
    const inNume = el('input', 'lh-ap-x-nume-in', { 'data-lh-tip': 'Edit', 'data-lh-eticheta': (Z.caseta_nume_edit || cn).e, 'aria-label': cn.e, spellcheck: 'false', autocomplete: 'off', 'data-lh-tinta': 'camp:Name Box' });
    const bn = Z.caseta_nume_buton || { e: 'Deschidere', id: 'DropDown' };
    const btnNume = el('div', 'lh-ap-n lh-ap-x-nume-btn', { 'data-lh-tip': 'Button', 'data-lh-eticheta': bn.e, 'data-lh-id-mso': bn.id || 'DropDown', role: 'button', 'aria-label': bn.e, 'data-lh-tinta': 'meniu_derulant:Name Box' });
    btnNume.innerHTML = pang.glif('sageata', 12);
    comboNume.append(inNume, btnNume);
    /* cele trei butoane dintre Name Box și bara de formule (Cancel, Enter, Insert Function) NU sunt în arborele UI Automation
       al referinței (zona_document › Pane [1,179,239,41] are doar Name Box): se desenează fără marcaj de arbore, doar fx are
       efect (fereastra Insert Function = dialog.FunctionWizard din referință) */
    const deco = el('div', 'lh-ap-x-deco', { 'aria-hidden': 'true' });
    deco.innerHTML = '<span class="lh-ap-x-puncte"></span><span class="lh-ap-x-x">' + pang.glif('inchide', 14) + '</span><span class="lh-ap-x-v">' + pang.glif('bifa', 14) + '</span>';
    const btnFx = el('div', 'lh-ap-x-fx', { role: 'button', 'aria-label': 'Insert Function', 'data-lh-tinta': 'bara_formule:Insert Function' });
    btnFx.innerHTML = '<svg aria-hidden="true" width="18" height="14" viewBox="0 0 18 14"><text x="1" y="11" font-family="Cambria,Times New Roman,serif" font-style="italic" font-size="12" fill="currentColor">f</text><text x="7" y="11" font-family="Cambria,Times New Roman,serif" font-style="italic" font-size="10" fill="currentColor">x</text></svg>';
    paneNume.append(comboNume, deco, btnFx);
    const bf = Z.bara_formule || { e: 'Formula Bar', id: 'FormulaBar' };
    const baraF = el('div', 'lh-ap-x-bara-formule', { 'data-lh-tip': 'Edit', 'data-lh-eticheta': bf.e, 'data-lh-id-mso': bf.id || 'FormulaBar', 'data-lh-tinta': 'bara_formule' });
    const inF = el('input', 'lh-ap-x-bara-in', { readonly: '', tabindex: '-1', 'aria-label': bf.e, spellcheck: 'false' });
    baraF.appendChild(inF);
    randF.append(paneNume, baraF);

    const paneFoaie = el('div', 'lh-ap-x-pane-foaie', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': '' });
    const reg = Z.registru || { e: 'Book1', id: 'Book1' };
    const paneReg = el('div', 'lh-ap-x-registru', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': reg.e, 'data-lh-id-mso': reg.id });
    const paneSh = el('div', 'lh-ap-x-foaie', { 'data-lh-tip': 'Pane' });
    const gr = Z.grila || { e: 'Grid', id: 'Grid' };
    const grila = el('div', 'lh-ap-x-grila', { 'data-lh-tip': 'DataGrid', 'data-lh-eticheta': gr.e, 'data-lh-id-mso': gr.id });
    const colt = el('div', 'lh-ap-x-colt', { 'data-lh-tip': 'HeaderItem', 'data-lh-eticheta': (Z.colt || {}).e || 'Select All', role: 'button', 'aria-label': (Z.colt || {}).e || 'Select All', 'data-lh-tinta': 'selecteaza_tot' });
    colt.innerHTML = '<span class="lh-ap-x-colt-tri" aria-hidden="true"></span>';
    const antC = el('div', 'lh-ap-x-ant-c'), antCin = el('div', 'lh-ap-x-ant-in');
    antC.appendChild(antCin);
    const antR = el('div', 'lh-ap-x-ant-r'), antRin = el('div', 'lh-ap-x-ant-in');
    antR.appendChild(antRin);
    const corp = el('div', 'lh-ap-x-corp', { 'data-lh-zona': '', 'data-lh-tinta': 'grila' });
    const corpIn = el('div', 'lh-ap-x-corp-in');
    corp.appendChild(corpIn);
    grila.append(colt, antC, antR, corp);
    paneSh.appendChild(grila);
    const ff = Z.file_foi || { e: 'Book1', id: 'Book1', r: [1, 713, 805, 32], c: [] };
    const tabFoi = el('div', 'lh-ap-x-file-foi', { 'data-lh-tip': 'Tab', 'data-lh-eticheta': ff.e, 'data-lh-id-mso': ff.id });
    paneReg.append(tabFoi, paneSh);
    /* ---- X4: banda de sub foaie după uia_excel.json › zona_document (1366 × 768): filele [1,713,805,32], despărțitorul Pane ''
       [806,714,32,31], bara orizontală Pane 'Horizontal' [838,720,508,17] PE ACELAȘI RÂND, la dreapta; bara verticală Pane
       'Vertical' [1346,220,17,496] de la rândul antetelor. Barele lui Chrome de pe grilă sunt ascunse (CSS), ca să nu mai stea
       deasupra filelor și peste rândul 25 (critic 6, X4); barele desenate derulează grila. */
    const banda = el('div', 'lh-ap-x-banda', { 'aria-hidden': 'true' });
    const desp = el('div', 'lh-ap-x-desp', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': '' });
    /* runda 25: cât e tras cursorul unei bare, întinderea ei rămâne cea de la apăsare (cursorul stă sub mouse cât se mută fereastra) */
    let tragere = null;
    function baraDerulare(vert) {
      const pane = el('div', 'lh-ap-x-db ' + (vert ? 'lh-ap-x-db-v' : 'lh-ap-x-db-h'), { 'data-lh-tip': 'Pane', 'data-lh-eticheta': vert ? 'Vertical' : 'Horizontal' });
      const sb = el('div', 'lh-ap-x-sb', { 'data-lh-tip': 'ScrollBar', 'data-lh-eticheta': '' });
      const buton = (et, gl) => { const x = el('div', 'lh-ap-x-sb-btn', { 'data-lh-tip': 'Button', 'data-lh-eticheta': et, role: 'button', 'aria-label': et, 'data-lh-tinta': 'derulare:' + et }); x.innerHTML = pang.glif(gl, 10); return x; };
      const pista = el('div', 'lh-ap-x-sb-pista', { 'data-lh-tinta': 'derulare:' + (vert ? 'pagina_v' : 'pagina_h') });
      const cursor = el('div', 'lh-ap-x-sb-cursor', { 'data-lh-tip': 'Thumb', 'data-lh-eticheta': '' });
      /* runda 25 (MINOR 6 al criticului 21): bucățile barelor cu numele din referință (uia_excel.json › zona_document: Vertical =
         Line up · Page up · Thumb · Page down · Line down; Horizontal = Column left · Page left · Thumb · Page right · Column right).
         „Page up / down” sunt pista de deasupra / de sub cursor; cea de lungime 0 nu se vede (în referință: dreptunghi gol) */
      const pagina = et => { const x = el('div', 'lh-ap-x-sb-pag', { 'data-lh-tip': 'Button', 'data-lh-eticheta': et, role: 'button', 'aria-label': et, 'data-lh-tinta': 'derulare:' + et });
        x.style.position = 'absolute'; if (vert) { x.style.left = '0'; x.style.right = '0'; } else { x.style.top = '0'; x.style.bottom = '0'; } return x; };
      const pInainte = pagina(vert ? 'Page up' : 'Page left'), pDupa = pagina(vert ? 'Page down' : 'Page right');
      pista.append(pInainte, cursor, pDupa);
      sb.append(buton(vert ? 'Line up' : 'Column left', 'sus'), pista, buton(vert ? 'Line down' : 'Column right', 'sageata'));
      pane.appendChild(sb);
      /* tragerea cursorului barei (pointer capturat pe cursor; nu trece prin gesturile foii). Runda 25 (R21-2): locul e socotit în
         toată foaia (px de la A1), nu în fereastră: trasă peste marginea ferestrei, vederea merge mai departe (laLoc), până la rândul 1 */
      cursor.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        e.stopPropagation(); e.preventDefault();
        const st = vert ? e.clientY : e.clientX, v0 = vert ? OY + corp.scrollTop : OX + corp.scrollLeft;
        const cursa = Math.max(1, vert ? pista.clientHeight - cursor.offsetHeight : pista.clientWidth - cursor.offsetWidth);
        const tot = vert ? OY + corp.scrollHeight : OX + corp.scrollWidth;
        const max = Math.max(0, tot - (vert ? corp.clientHeight : corp.clientWidth));
        tragere = { vert, tot };
        try { cursor.setPointerCapture(e.pointerId); } catch (x) { /* */ }
        const misca = ev => laLoc(vert, Math.max(0, Math.min(max, v0 + ((vert ? ev.clientY : ev.clientX) - st) * max / cursa)));
        const gata = () => { tragere = null; aseazaCursoare(); cursor.removeEventListener('pointermove', misca); cursor.removeEventListener('pointerup', gata); cursor.removeEventListener('pointercancel', gata); };
        cursor.addEventListener('pointermove', misca); cursor.addEventListener('pointerup', gata); cursor.addEventListener('pointercancel', gata);
      });
      return { pane, pista, cursor, pInainte, pDupa };
    }
    const barV = baraDerulare(true), barH = baraDerulare(false);
    paneReg.insertBefore(banda, tabFoi);
    paneReg.append(desp, barH.pane, barV.pane);
    function aseazaBanda() {
      const W = paneReg.clientWidth || 1366;
      /* la 1366 px: filele 805, despărțitorul 32, bara până la 20 px de margine; mai îngust: aceeași proporție, filele cel puțin 260 px */
      const tw = Math.max(Math.min(805, Math.round((W - 53) * 805 / 1313)), Math.min(260, W - 93));
      tabFoi.style.width = tw + 'px';
      desp.style.left = (tw + 1) + 'px';
      barH.pane.style.left = (tw + 33) + 'px';
      barH.pane.style.width = Math.max(0, W - 20 - tw - 33) + 'px';
      aseazaCursoare();
    }
    function aseazaCursoare() {
      [[barV, true], [barH, false]].forEach(([b, vert]) => {
        const lung = vert ? b.pista.clientHeight : b.pista.clientWidth;
        /* runda 25: locul și întinderea în toată foaia (în grila normală OX = OY = 0, deci ca înainte) */
        const vede = vert ? corp.clientHeight : corp.clientWidth, poz = vert ? OY + corp.scrollTop : OX + corp.scrollLeft;
        const tot = tragere && tragere.vert === vert ? tragere.tot : vert ? OY + corp.scrollHeight : OX + corp.scrollWidth;
        if (!lung || !tot) return;
        const m = Math.max(Math.min(17, lung), Math.round(lung * Math.min(1, vede / tot)));
        const x = tot > vede ? Math.max(0, Math.min(lung - m, Math.round((lung - m) * poz / (tot - vede)))) : 0;
        if (vert) Object.assign(b.cursor.style, { top: x + 'px', height: m + 'px' }); else Object.assign(b.cursor.style, { left: x + 'px', width: m + 'px' });
        const pune = (p, de, cat) => { p.style.display = cat >= 1 ? '' : 'none'; if (vert) { p.style.top = de + 'px'; p.style.height = cat + 'px'; } else { p.style.left = de + 'px'; p.style.width = cat + 'px'; } };
        pune(b.pInainte, 0, x); pune(b.pDupa, x + m, lung - x - m);
      });
    }
    function derulare(v, e) {
      /* runda 25 (R21-2): la marginea ferestrei, întâi fereastra se mută (altfel „Line up” de acolo nu mai urcă) */
      margineFereastra();
      const r = randLa(corp.scrollTop), c0 = colLa(corp.scrollLeft);
      if (v === 'Line down') corp.scrollTop = yRand(r + 1);
      else if (v === 'Line up') corp.scrollTop = yRand(Math.max(0, corp.scrollTop > yRand(r) ? r : r - 1));
      else if (v === 'Column right' || v === 'Line right') corp.scrollLeft = xCol(c0 + 1);
      else if (v === 'Column left' || v === 'Line left') corp.scrollLeft = xCol(Math.max(0, corp.scrollLeft > xCol(c0) ? c0 : c0 - 1));
      else if (v === 'Page down' || v === 'Page up') corp.scrollTop += (v === 'Page down' ? 1 : -1) * Math.max(HR(), corp.clientHeight - HR());
      else if (v === 'Page right' || v === 'Page left') corp.scrollLeft += (v === 'Page right' ? 1 : -1) * Math.max(LC(), corp.clientWidth - LC());
      else if (v === 'pagina_v' || v === 'pagina_h') {
        const vert = v === 'pagina_v', b = (vert ? barV : barH).cursor.getBoundingClientRect();
        const inainte = vert ? e.clientY > b.bottom : e.clientX > b.right;
        if (vert) corp.scrollTop += (inainte ? 1 : -1) * Math.max(HR(), corp.clientHeight - HR());
        else corp.scrollLeft += (inainte ? 1 : -1) * Math.max(LC(), corp.clientWidth - LC());
      } else return 'fara_efect';
      sincronDerulare();
      return 'derulare';
    }
    if (typeof ResizeObserver === 'function') { try { new ResizeObserver(() => aseazaBanda()).observe(paneReg); } catch (e) { /* */ } }
    paneFoaie.appendChild(paneReg);
    zonaSup.append(randF, paneFoaie);
    const golEl = el('div', 'lh-ap-x-gol', { 'data-lh-tip': 'Pane', 'data-lh-eticheta': 'Excel' });
    golEl.style.display = 'none';
    zonaSup.appendChild(golEl);
    zonaSup.style.marginTop = '-2px';   // runda 25, MINOR 5 (vezi la susIn): grila de la y 220, cu 493 px, ca în referință
    const intrare = el('textarea', 'lh-ap-intrare', { 'data-lh-intrare-document': '', 'aria-label': 'Grid', autocomplete: 'off', autocorrect: 'off',
      autocapitalize: 'off', spellcheck: 'false', rows: '1' });
    I.intrare = intrare;

    const jos = el('div', 'lh-ap-jos'), josIn = el('div', 'lh-ap-jos-in');
    const stareEl = desen('bara_stare');
    pozitie(stareEl, SUP.bara_stare.r, [0, SUP.bara_stare.r[1]]);
    josIn.appendChild(stareEl);
    jos.appendChild(josIn);
    /* A2 (runda 10): rezumatul selecției în bara de stare. Referința uia_excel.json › bara_stare#selectie_numere (B2:C4 = 9, 7 /
       8, 10 / 6, 5): „Average 7,5” [859,2; 74,4], „Count 6” [933,6; 55,2], „Sum 45” [988,8; 53,6], lipite, Sum se termină la
       1042,4, sus 746,4, înalte 20,8; Display Settings nu apare. Lățimea unui buton = textul + marginea lui din referință;
       butoanele există doar cât se arată. Cazurile pe care referința nu le dă (o celulă, text, goluri, erori, grafic ales)
       = de_verificat R10-2 */
    const REZ_REF = ((SUP['bara_stare#selectie_numere'] || {}).c || []).filter(n => n.t === 'Button' && /^(Average|Count|Sum) /.test(n.e || ''));
    let rezLat = null, rezEl = [];
    function latBara(t) {
      if (!rezLat) { const c = document.createElement('canvas').getContext('2d'); const cs = elAfisare && elAfisare.isConnected ? getComputedStyle(elAfisare) : null; c.font = cs ? cs.fontSize + ' ' + cs.fontFamily : '12px "Segoe UI", sans-serif'; rezLat = c; }
      return rezLat.measureText(t).width;
    }
    function rezumatSelectie() {
      rezEl.forEach(x => x.remove()); rezEl = [];
      if (!REZ_REF.length || !elAfisare) return;
      const f = F(), s = f.sel, u = ultim(f), vazut = new Set();
      let n = 0, nr = 0, suma = 0, err = false, celule = 0;
      if (!M.gr) s.zone.forEach(q => {
        celule += (q.r1 - q.r0 + 1) * (q.c1 - q.c0 + 1);
        for (let r = q.r0; r <= Math.min(q.r1, u.r); r++) for (let c0 = q.c0; c0 <= Math.min(q.c1, u.c); c0++) {
          const a = adr(r, c0);
          if (vazut.has(a) || !(f.cel[a] || varsat(f, r, c0))) continue;
          vazut.add(a); n++;
          const v = valoare(f, r, c0);
          if (eErr(v)) err = true; else if (typeof v === 'number') { nr++; suma += v; }
        }
      });
      const arata = celule > 1 && n >= 2;
      elAfisare.style.display = arata ? 'none' : '';
      if (!arata) return;
      const et = (nr && !err ? [['Average', general(suma / nr)], ['Count', String(n)], ['Sum', general(suma)]] : [['Count', String(n)]]);
      const R0 = SUP.bara_stare.r, dr = REZ_REF[REZ_REF.length - 1].r;
      const buc = et.map(([nume, val]) => {
        const ref = REZ_REF.find(n => n.e.split(' ')[0] === nume), t = nume + ' ' + val;
        return { nume, t, ref, w: Math.round((latBara(t) + ref.r[2] - latBara(ref.e)) * 10) / 10 };
      });
      let x = dr[0] + dr[2] - R0[0] - buc.reduce((a, b) => a + b.w, 0);
      buc.forEach(({ nume, t, ref, w }) => {
        const b = el('div', 'lh-ap-n lh-ap-t-Button', { 'data-lh-tip': 'Button', 'data-lh-eticheta': t, role: 'button', 'data-lh-tinta': 'bara_stare:' + nume });
        b.innerHTML = '<span class="lh-ap-text"></span>'; b.firstChild.textContent = t;
        Object.assign(b.style, { left: Math.round(x * 10) / 10 + 'px', top: (ref.r[1] - R0[1]) + 'px', width: w + 'px', height: ref.r[3] + 'px' });
        elAfisare.parentNode.insertBefore(b, elAfisare);
        rezEl.push(b);
        x += w;
      });
    }
    root.append(sus, zonaSup, jos);

    /* ---- filele panglicii */
    function deseneazaFile() {
      /* filele contextuale (graficul ales): după Help, în ordinea din date/excel.json › context.grafic (= h_grafic.file_dupa
         „… Help, Chart Design, Format”); locul și lățimea ca word.js:712-737; tasta de acces = a grupului filei din referință */
      RAND_FILE.querySelectorAll('[data-lh-context]').forEach(x => x.remove());
      if (contextActiv && (date.context || {})[contextActiv]) {
        const ultima = [...RAND_FILE.querySelectorAll('[data-lh-tip="TabItem"]')].pop();
        let x = ultima ? ultima.offsetLeft + ultima.offsetWidth + 1 : 0;
        date.context[contextActiv].forEach(cx => {
          const t = el('div', 'lh-ap-n lh-ap-t-TabItem lh-ap-context', { 'data-lh-tip': 'TabItem', 'data-lh-eticheta': cx.e, 'data-lh-id-mso': cx.id,
            'data-lh-tinta': 'fila:' + cx.e, role: 'tab', 'data-lh-context': contextActiv });
          const gr = ((SUP[cx.s] || {}).c || [])[0] || {};
          t.__nod = { t: 'TabItem', e: cx.e, id: cx.id, ta: gr.ta || null };
          t.innerHTML = '<span class="lh-ap-text">' + esc(cx.e) + '</span>';
          const w = cx.e.length * 7 + 22;
          Object.assign(t.style, { left: x + 'px', top: '0px', width: w + 'px', height: '30px' });
          x += w + 1;
          RAND_FILE.appendChild(t);
        });
      }
      RAND_FILE.querySelectorAll('[data-lh-tip="TabItem"]').forEach(t => {
        const on = t.getAttribute('data-lh-id-mso') === filaActiva;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.classList.toggle('activ', on);
      });
    }
    const cheieFila = id => SUP['panglica.' + id] ? 'panglica.' + id : SUP['panglica_context.' + id] ? 'panglica_context.' + id : null;
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

    /* ============================================================ grila („ecranul = starea”, §3) */
    /* telefonul (I1, api_biblioteca §I1 regula 4: zone de atins >= 32 px): la <= 480 px grila se desenează de 1,7 ori mai mare
       (rândul 19 → 32,3 px), ca panglica (aplicatii.css: zoom 1,34); zoomul afișat rămâne al registrului. Pe calculator = 1. */
    const ingust = window.matchMedia ? window.matchMedia('(max-width:480px)') : null;
    const tel = () => (ingust && ingust.matches ? 1.7 : 1);
    const z = () => M.zoom / 100 * tel();
    /* graficele păstrează mărimea lor (480 × 288 px la zoomul registrului) și pe telefon: mărirea de 1,7 e doar pentru degete pe
       celule; ancora (x, y) rămâne în px de grilă, deci graficul stă pe aceeași celulă (runda 10, A1; diferente.md D-A1-3) */
    const kg = () => M.zoom / 100;
    const LC = () => 64 * z(), HR = () => 19 * z(), HA = () => 20 * z(), LA = () => latAntetRand() * z();
    let NR = 0, NC = 0, celEl = {}, PX = [0];
    /* runda 21 (critic 17, G17-1): ORIGINEA grilei desenate. Grila normală începe în A1 (R0 = C0 = 0: formulele de mai jos sunt
       exact cele dinainte). Când celula activă iese din ea (Ctrl+↓ până la A1048576, Ctrl+→ până la XFD7, Name Box), se desenează
       o FEREASTRĂ de rânduri / coloane în jurul ei (intindere), cu numerele și literele adevărate; OX / OY = px pe ecran de la A1
       până la colțul ferestrei (graficele, ancorate în px de grilă, se desenează mutate cu atât) */
    let R0 = 0, C0 = 0, OX = 0, OY = 0;
    /* runda 25 (R21-2 al criticului 21): vederea mutată de DERULARE (rotița, cursorul barei, „Line up / down”, degetul) peste
       marginea ferestrei: VR = { r0, n, a } (primul rând, câte rânduri, celula activă de atunci), VC la fel pe coloane. Ține cât
       timp celula activă nu se mută în afara ei (intindere); null = fereastra stă în jurul celulei active, ca în runda 21 */
    let VR = null, VC = null;
    /* antetul rândurilor: 26 px (uia_excel.json › zona_document, DataItem „1” [1, 240, 26, 19]) până la 3 cifre, ca până acum;
       numerele mai lungi (1000…1048576) încap întregi (lățimea lui Excel la 7 cifre nu e capturată: de_verificat R21-1) */
    function latAntetRand() { const n = String(R0 + Math.max(NR, 1)); return n.length <= 3 ? 26 : Math.max(26, Math.ceil(latimeText(n) / z() + 8)); }
    /* marginile coloanelor (px pe ecran, de la stânga grilei desenate): PX[k] = x-ul coloanei C0 + k */
    function geomCol() {
      const f = F(); PX = [0]; for (let k = 0; k < NC; k++) PX.push(PX[k] + latPx(f, C0 + k) * z());
      OX = 0; for (let c0 = 0; c0 < C0; c0++) OX += latPx(f, c0) * z();
    }
    const xCol = c0 => { const k = c0 - C0; return k < 0 ? k * LC() : k <= NC ? PX[k] : PX[NC] + (k - NC) * LC(); };
    const wCol = c0 => latPx(F(), c0) * z();
    function colLa(x) { let k = 0; while (k < NC - 1 && PX[k + 1] <= x) k++; return C0 + k; }
    /* rândurile: 19 px, afară de cele cu text încadrat (Wrap Text), care cresc singure cu câte 19 px pe rând de text
       (com_r7c.json › wrap: 14,4 pt → 72 pt = 5 rânduri, coloana de 64 px; „Situația notelor la informatică” → 57,6 pt = 4) */
    let PY = [0], INALT = {};
    const latIncadrare = px => px - 9;   // lățimea pe care se așază textul încadrat (calibrată pe com_r7c: 5 și 4 rânduri la 64 px)
    function liniiIncadrate(t, px) {
      const w = latIncadrare(px), sp = latimeText(' ') / z();
      let n = 0;
      String(t).split('\n').forEach(par => {
        let lin = -1;
        n++;
        par.split(/ +/).forEach(cuv => {
          const lc = latimeText(cuv) / z();
          if (lin < 0) { lin = lc; return; }
          if (lin + sp + lc <= w) lin += sp + lc; else { n++; lin = lc; }
        });
      });
      return Math.max(1, n);
    }
    function inaltimiAuto(f) {
      const o = {};
      Object.keys(f.fmt).forEach(a => {
        if (!f.fmt[a].incadrare || !f.cel[a]) return;
        const p = pa(a);
        if (!p || mergeLa(f, p.r, p.c)) return;
        const t = inLatime(valoare(f, p.r, p.c), f.fmt[a].format_numar, unitati(f, p.r, p.c));
        const h = liniiIncadrate(t, latPx(f, p.c)) * 19;
        if (h > 19) o[p.r] = Math.max(o[p.r] || 0, h);
      });
      return o;
    }
    function geomRand() {
      const f = F(); INALT = inaltimiAuto(f); PY = [0]; for (let k = 0; k < NR; k++) PY.push(PY[k] + (INALT[R0 + k] || 19) * z());
      OY = R0 * 19 * z(); Object.keys(INALT).forEach(r => { if (+r < R0) OY += (INALT[r] - 19) * z(); });
    }
    const yRand = r => { const k = r - R0; return k < 0 ? k * HR() : k <= NR ? PY[k] : PY[NR] + (k - NR) * HR(); };
    const hRand = r => (INALT[r] || 19) * z();
    function randLa(y) { let lo = 0, hi = NR - 1; if (y <= 0) return R0; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (PY[m] <= y) lo = m; else hi = m - 1; } return R0 + lo; }
    /* grila normală: plafonul 3000 de rânduri / 300 de coloane; fereastra: 150 de rânduri / 30 de coloane */
    const GR_R = 3000, GR_C = 300, FE_R = 150, FE_C = 30;
    function intindere() {
      const f = F(), a = f.sel.activa;
      /* runda 17: Ctrl+↓ / Ctrl+→ duc celula activă la marginea foii (A1048576, XFD7). Grila normală e desenată întreagă în DOM,
         deci nu crește până acolo (1.048.576 × 16.384 celule ar îngheța pagina): peste ultimele date + 2000 de rânduri / 200 de
         coloane nu se mai lungește. Runda 21 (G17-1): acolo se desenează FEREASTRA din jurul celulei active (mai jos), iar grila
         normală se socotește doar din datele de pe ea (o valoare scrisă în A1048576 nu o mai lungește la 3000 × 26 de celule) */
      let ur = 0, uc = 0;
      Object.keys(f.cel).forEach(k => { const p = pa(k); if (p && p.r < GR_R && p.c < GR_C) { ur = Math.max(ur, p.r); uc = Math.max(uc, p.c); } });
      const LR = ur + 2000, LC0 = uc + 200;
      let r = Math.max(ur, a.r <= LR ? a.r : 0), c0 = Math.max(uc, a.c <= LC0 ? a.c : 0);
      f.sel.zone.forEach(x => { if (x.r1 < MAXR - 1 && x.r1 <= LR) r = Math.max(r, x.r1); if (x.c1 < MAXC - 1 && x.c1 <= LC0) c0 = Math.max(c0, x.c1); });
      const n = { r0: 0, r: Math.min(GR_R, Math.max(40, r + 12)), c0: 0, c: Math.min(GR_C, Math.max(26, c0 + 6)) };
      const nr0 = n.r, nc0 = n.c;
      /* celula activă în afara grilei normale → fereastra în jurul ei (celula activă jos / la dreapta, ca după orice ↓ / →); fereastra
         rămâne pe loc cât celula activă se mișcă în ea și se mută abia când celula iese */
      if (a.r >= n.r) {
        if (R0 > 0 && a.r >= R0 && a.r < R0 + NR) { n.r0 = R0; n.r = NR; }
        else { n.r0 = Math.max(0, Math.min(a.r - 100, MAXR - FE_R)); n.r = Math.min(FE_R, MAXR - n.r0); }
      }
      if (a.c >= n.c) {
        if (C0 > 0 && a.c >= C0 && a.c < C0 + NC) { n.c0 = C0; n.c = NC; }
        else { n.c0 = Math.max(0, Math.min(a.c - 20, MAXC - FE_C)); n.c = Math.min(FE_C, MAXC - n.c0); }
      }
      /* runda 25: vederea mutată de derulare are întâietate cât timp celula activă e cea de atunci sau e în ea; altfel se
         anulează și fereastra se întoarce la celula activă (ca în Excel: o tastă după derulare aduce vederea la celulă) */
      const ak = a.r + ',' + a.c;
      if (VR && VR.a !== ak && (a.r < VR.r0 || a.r >= VR.r0 + VR.n)) VR = null;
      if (VC && VC.a !== ak && (a.c < VC.c0 || a.c >= VC.c0 + VC.n)) VC = null;
      if (VR) { VR.a = ak; n.r0 = VR.r0; n.r = VR.r0 === 0 ? Math.max(nr0, VR.n) : VR.n; }
      if (VC) { VC.a = ak; n.c0 = VC.c0; n.c = VC.c0 === 0 ? Math.max(nc0, VC.n) : VC.n; }
      return n;
    }
    function mergeLa(f, r, c0) { for (const m of f.merge) { const q = zonaDin(m); if (q && inZona(q, r, c0)) return q; } return null; }
    function deseneazaGrila() {
      const f = F(), x = intindere();
      /* tastatura stă în celula activă: redesenarea n-are voie să-i ia focusul (altfel tastele de după Enter se pierd) */
      const aveaFocus = document.activeElement === intrare;
      if (intrare.parentNode) intrare.parentNode.removeChild(intrare);
      /* runda 25 (R21-2, MINOR 1-2 ale criticului 21): locul vederii în toată foaia (px de la A1), ca rândurile de pe ecran să nu
         sară când fereastra își schimbă originea (scrollTop += OY_vechi − OY_nou) */
      const vy0 = OY + corp.scrollTop, vx0 = OX + corp.scrollLeft, r00 = R0, c00 = C0;
      R0 = x.r0; C0 = x.c0; NR = x.r; NC = x.c;
      geomCol();
      geomRand();
      const lc = LC(), hr = HR();
      root.style.setProperty('--lh-ap-x-z', String(z()));
      colt.style.width = LA() + 'px'; colt.style.height = HA() + 'px';
      antC.style.left = LA() + 'px'; antC.style.height = HA() + 'px';
      antR.style.top = HA() + 'px'; antR.style.width = LA() + 'px';
      corp.style.left = LA() + 'px'; corp.style.top = HA() + 'px';
      void lc;
      /* runda 21: în fereastra de la marginea foii (… XFD) grila se lungește cu lățimea barei verticale desenate peste ea, ca XFD să
         poată sta întreagă la stânga barei (uia_excel.json › zona_document: Grid [1, 220, 1342, 493], bara Vertical [1346, 220, 17, 496]) */
      corpIn.style.width = (PX[NC] + (C0 > 0 && C0 + NC >= MAXC ? subBara() : 0)) + 'px'; corpIn.style.height = PY[NR] + 'px';
      /* runda 25 (MINOR 3 al criticului 21): sub rândul 1048576 / după XFD nu mai e nimic de derulat; zona de apucat a
         pătrățelului de umplere (31 × 31 px) lungea grila cu 16 px albi */
      corpIn.style.overflowY = R0 + NR >= MAXR ? 'clip' : '';
      corpIn.style.overflowX = C0 + NC >= MAXC ? 'clip' : '';
      aseazaBanda();
      antCin.style.width = (PX[NC] + 40) + 'px'; antRin.style.height = (PY[NR] + 40) + 'px';
      antCin.innerHTML = ''; antRin.innerHTML = ''; corpIn.innerHTML = ''; celEl = {};
      for (let c0 = C0; c0 < C0 + NC; c0++) {
        const h = el('div', 'lh-ap-x-ant lh-ap-x-ant-col', { 'data-lh-tip': 'DataItem', 'data-lh-eticheta': colNume(c0), 'data-lh-tinta': 'antet_coloana', 'data-lh-id': colNume(c0) });
        h.style.left = xCol(c0) + 'px'; h.style.width = wCol(c0) + 'px'; h.style.height = HA() + 'px';
        h.textContent = colNume(c0);
        /* linia dintre litere: săgeata dublă ↔; tragerea schimbă lățimea, dublul clic o potrivește (lecția m1-l06:79, :111) */
        const mg = el('div', 'lh-ap-x-ant-margine', { 'data-lh-tinta': 'antet_coloana_margine', 'data-lh-id': colNume(c0), 'aria-hidden': 'true' });
        h.appendChild(mg);
        antCin.appendChild(h);
      }
      for (let r = R0; r < R0 + NR; r++) {
        const h = el('div', 'lh-ap-x-ant lh-ap-x-ant-rand', { 'data-lh-tip': 'DataItem', 'data-lh-eticheta': String(r + 1), 'data-lh-tinta': 'antet_rand', 'data-lh-id': String(r + 1) });
        h.style.top = yRand(r) + 'px'; h.style.height = hRand(r) + 'px'; h.style.width = LA() + 'px';
        h.textContent = String(r + 1);
        antRin.appendChild(h);
      }
      const frag = document.createDocumentFragment();
      for (let r = R0; r < R0 + NR; r++) {
        for (let c0 = C0; c0 < C0 + NC; c0++) {
          const a = adr(r, c0), m = mergeLa(f, r, c0);
          const d = el('div', 'lh-ap-x-c', { 'data-lh-tinta': 'celula', 'data-lh-id': a });
          let w = wCol(c0), h = hRand(r);
          if (m) {
            if (m.r0 !== r || m.c0 !== c0) { d.style.display = 'none'; frag.appendChild(d); celEl[a] = d; continue; }
            w = xCol(Math.min(m.c1, C0 + NC - 1) + 1) - xCol(m.c0); h = yRand(Math.min(m.r1, R0 + NR - 1) + 1) - yRand(m.r0);
            d.classList.add('lh-ap-x-imbinat');
          }
          d.style.left = xCol(c0) + 'px'; d.style.top = yRand(r) + 'px'; d.style.width = w + 'px'; d.style.height = h + 'px';
          const fm0 = f.fmt[a] || {};
          if (fm0.umplere) d.style.background = '#' + fm0.umplere;
          bordStil(f, d, r, c0, m);
          const x2 = f.cel[a] || varsat(f, r, c0);
          if (x2) {
            const v = valoare(f, r, c0), fm = fmtDe(f, a);
            const s = el('span', 'lh-ap-x-t');
            s.textContent = inLatime(v, fm.format_numar, unitati(f, r, c0));
            const al = fm.aliniere || (typeof v === 'number' ? 'dreapta' : typeof v === 'boolean' || eErr(v) ? 'centru' : 'stanga');
            d.classList.add('lh-ap-x-al-' + al);
            if (fm.bold) s.style.fontWeight = '700';
            if (fm.italic) s.style.fontStyle = 'italic';
            if (fm.underline) s.style.textDecoration = 'underline';
            /* Wrap Text: textul se așază pe rânduri în celulă (rândul a crescut în geomRand), jos, ca alinierea implicită */
            if (fm.incadrare && !m) { d.classList.add('lh-ap-x-incadrat'); s.style.width = latIncadrare(latPx(f, c0)) * z() + 'px'; s.style.lineHeight = HR() + 'px'; }
            /* textul mai lung decât celula trece peste vecinul din dreapta GOL (ca în Excel); numerele nu */
            else if (al === 'stanga' && typeof v === 'string' && !m) {
              if (fm.umplere) s.style.background = '#' + fm.umplere;
              let k = c0 + 1;
              while (k < C0 + NC && !f.cel[adr(r, k)] && !varsat(f, r, k) && !mergeLa(f, r, k)) k++;
              d.style.setProperty('--lh-ap-x-max', (xCol(k) - xCol(c0)) + 'px');
              d.classList.add('lh-ap-x-curge');
            }
            d.appendChild(s);
          } else {
            const fm = f.fmt[a];
            if (fm && fm.aliniere) d.classList.add('lh-ap-x-al-' + fm.aliniere);
          }
          frag.appendChild(d);
          celEl[a] = d;
        }
      }
      corpIn.appendChild(frag);
      corpIn.append(selStrat, clipStrat, propEl, maner);
      deseneazaGrafice(true);
      deseneazaSelectia();
      if (R0 !== r00) corp.scrollTop = Math.max(0, vy0 - OY);
      if (C0 !== c00) corp.scrollLeft = Math.max(0, vx0 - OX);
      if (aveaFocus) I.focus();
      sincronDerulare();
    }
    function sincronDerulare() {
      antCin.style.transform = 'translateX(' + (-corp.scrollLeft) + 'px)';
      antRin.style.transform = 'translateY(' + (-corp.scrollTop) + 'px)';
      aseazaCursoare();
    }
    corp.addEventListener('scroll', () => { sincronDerulare(); margineFereastra(); }, { passive: true });
    /* runda 25 (R21-2, MINOR 1-3 ale criticului 21): fereastra de la marginea foii se mută cu DERULAREA. Când vederea ajunge
       aproape de marginea ferestrei desenate (rotița, cursorul barei, „Line up / down”, degetul), fereastra se redesenează cu
       vederea la mijloc, iar scrollTop trece pe noua origine (deseneazaGrila), deci rândurile de pe ecran nu se mișcă. Grila
       normală (R0 = C0 = 0, fără vedere mutată) nu se mută: rămâne exact cea dinainte. */
    let mutaVedere = false;
    const vizR = () => Math.max(1, Math.ceil(corp.clientHeight / HR())), vizC = () => Math.max(1, Math.ceil(corp.clientWidth / LC()));
    const lungR = () => Math.max(FE_R, 2 * vizR() + 8), lungC = () => Math.max(FE_C, 2 * vizC() + 4);
    function redeseneazaVederea() { mutaVedere = true; try { deseneazaGrila(); } finally { mutaVedere = false; } }
    function margineFereastra() {
      if (mutaVedere || !corp.clientHeight || !NR) return false;
      const a = F().sel.activa, ak = a.r + ',' + a.c;
      let r0 = null, c0 = null;
      if (R0 > 0 || VR) {
        const n = lungR(), m = Math.max(2, Math.floor((n - vizR()) / 4)) * HR();
        if ((corp.scrollTop < m && R0 > 0) || (corp.scrollTop + corp.clientHeight > PY[NR] - m && R0 + NR < MAXR)) {
          r0 = Math.max(0, Math.min(MAXR - n, randLa(corp.scrollTop) - Math.floor((n - vizR()) / 2)));
          if (r0 === R0) r0 = null;
        }
      }
      if (C0 > 0 || VC) {
        const n = lungC(), m = Math.max(1, Math.floor((n - vizC()) / 4)) * LC();
        if ((corp.scrollLeft < m && C0 > 0) || (corp.scrollLeft + corp.clientWidth > PX[NC] - m && C0 + NC < MAXC)) {
          c0 = Math.max(0, Math.min(MAXC - n, colLa(corp.scrollLeft) - Math.floor((n - vizC()) / 2)));
          if (c0 === C0) c0 = null;
        }
      }
      if (r0 == null && c0 == null) return false;
      if (r0 != null) VR = { r0, n: Math.min(lungR(), MAXR - r0), a: ak };
      if (c0 != null) VC = { c0, n: Math.min(lungC(), MAXC - c0), a: ak };
      redeseneazaVederea();
      return true;
    }
    /* vederea dusă la locul v (px de la A1, în toată foaia): în fereastră doar se derulează; în afara ei fereastra se mută acolo
       (cursorul barei tras peste marginea ferestrei, până la rândul 1) */
    function laLoc(vert, v) {
      const max = vert ? corp.scrollHeight - corp.clientHeight : corp.scrollWidth - corp.clientWidth, o = vert ? OY : OX;
      if ((vert ? R0 > 0 || VR : C0 > 0 || VC) && (v < o - 0.5 || v - o > max + 0.5)) {
        const a = F().sel.activa, ak = a.r + ',' + a.c;
        if (vert) { const n = lungR(), r0 = Math.max(0, Math.min(MAXR - n, Math.floor(v / HR()) - Math.floor((n - vizR()) / 2))); VR = { r0, n: Math.min(n, MAXR - r0), a: ak }; }
        else { const n = lungC(), c0 = Math.max(0, Math.min(MAXC - n, Math.floor(v / LC()) - Math.floor((n - vizC()) / 2))); VC = { c0, n: Math.min(n, MAXC - c0), a: ak }; }
        redeseneazaVederea();
      }
      if (vert) corp.scrollTop = Math.max(0, v - OY); else corp.scrollLeft = Math.max(0, v - OX);
    }

    /* ---- selecția, chenarul copierii, pătrățelul de umplere, editarea */
    const selStrat = el('div', 'lh-ap-x-sel-strat', { 'aria-hidden': 'true' });
    const clipStrat = el('div', 'lh-ap-x-clip', { 'aria-hidden': 'true' });
    const maner = el('div', 'lh-ap-x-maner', { 'data-lh-tinta': 'maner_umplere', 'aria-label': 'Fill Handle' });
    const propEl = el('div', 'lh-ap-x-propus', { 'aria-hidden': 'true' });
    propEl.style.display = 'none';
    /* runda 21: o zonă care începe deasupra / la stânga ferestrei se desenează de la marginea ferestrei (nu de la −20 de milioane de px) */
    const dr = q => {
      const r0 = Math.max(q.r0, R0 - 1), c0 = Math.max(q.c0, C0 - 1);
      return { x: xCol(c0), y: yRand(r0), w: xCol(Math.min(q.c1, C0 + NC - 1) + 1) - xCol(c0), h: yRand(Math.min(q.r1, R0 + NR - 1) + 1) - yRand(r0) };
    };
    function deseneazaSelectia() {
      const f = F(), s = f.sel;
      selStrat.innerHTML = '';
      const multe = s.zone.length > 1 || s.zone.some(q => q.r0 !== q.r1 || q.c0 !== q.c1);
      s.zone.forEach(q => {
        const m = mergeLa(f, q.r0, q.c0);
        const q2 = m && q.r0 === q.r1 && q.c0 === q.c1 ? m : q;
        const b = dr(q2), x = el('div', 'lh-ap-x-sel' + (multe ? ' lh-ap-x-sel-zona' : ''));
        Object.assign(x.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
        selStrat.appendChild(x);
      });
      const ma = mergeLa(f, s.activa.r, s.activa.c) || { r0: s.activa.r, c0: s.activa.c, r1: s.activa.r, c1: s.activa.c };
      const ba = dr(ma), act = el('div', 'lh-ap-x-activa');
      Object.assign(act.style, { left: ba.x + 'px', top: ba.y + 'px', width: ba.w + 'px', height: ba.h + 'px' });
      selStrat.appendChild(act);
      const ult = s.zone[s.zone.length - 1], bu = dr(ult);
      maner.style.display = M.edit || s.zone.length > 1 ? 'none' : '';
      maner.style.left = (bu.x + bu.w - 4) + 'px';
      maner.style.top = (bu.y + bu.h - 4) + 'px';
      if (M.clip && M.clip.fi === M.fi) {
        const bc = dr(M.clip.z);
        Object.assign(clipStrat.style, { display: '', left: bc.x + 'px', top: bc.y + 'px', width: bc.w + 'px', height: bc.h + 'px' });
      } else clipStrat.style.display = 'none';
      /* antetele rândurilor și coloanelor selectate (ca în Excel: colorate) */
      antCin.querySelectorAll('.lh-ap-x-ant').forEach((h, k) => h.classList.toggle('lh-ap-x-ant-sel', s.zone.some(q => C0 + k >= q.c0 && C0 + k <= q.c1)));
      antRin.querySelectorAll('.lh-ap-x-ant').forEach((h, k) => h.classList.toggle('lh-ap-x-ant-sel', s.zone.some(q => R0 + k >= q.r0 && R0 + k <= q.r1)));
      const a = adr(s.activa.r, s.activa.c);
      I.zonaTinta = 'celula:' + a;
      /* tastatura stă în celula activă (ținta focusului la taste, §4) */
      const ce = celEl[a];
      if (ce && intrare.parentNode !== ce) {
        const aveaFocus = document.activeElement === intrare;
        ce.appendChild(intrare);
        if (aveaFocus) try { intrare.focus({ preventScroll: true }); } catch (e) { /* */ }
      } else if (!ce && !intrare.parentNode) corpIn.appendChild(intrare);   // runda 21 (G17-1), plasă: focusul nu iese din aplicație
      deseneazaEditarea();
      actualizeazaBare();
    }
    let edEl = null, caretEl = null;
    const masura = document.createElement('canvas').getContext('2d');
    /* lățimea (px la 100 %) în care încape un număr: după modelul lui Excel și după cifrele desenate pe ecran (marginile celulei 2+2 px + linia) */
    const latNecesar = t => Math.max(pxDin(latCifre(t)), Math.ceil(latimeText(t) / z() + 6));
    function latimeText(s, px) { masura.font = ((px || 14.667) * z()) + 'px Calibri, Carlito, "Segoe UI", sans-serif'; return masura.measureText(s).width; }
    function deseneazaEditarea() {
      propEl.style.display = 'none';
      if (edEl) { edEl.remove(); edEl = null; }
      if (caretEl) { caretEl.remove(); caretEl = null; }
      Object.values(celEl).forEach(x => x.classList.remove('lh-ap-x-ined'));
      if (!M.edit) return;
      const ce = celEl[M.edit.a];
      if (!ce) return;
      ce.classList.add('lh-ap-x-ined');
      edEl = el('input', 'lh-ap-x-ed', { readonly: '', tabindex: '-1', spellcheck: 'false', 'aria-label': M.edit.a });
      edEl.value = M.edit.text;
      edEl.style.width = Math.max(ce.offsetWidth, latimeText(M.edit.text) + 10) + 'px';
      ce.appendChild(edEl);
      caretEl = el('span', 'lh-ap-x-caret', { 'aria-hidden': 'true' });
      caretEl.style.left = (3 + latimeText(M.edit.text.slice(0, M.edit.poz))) + 'px';
      ce.appendChild(caretEl);
      if (M.edit.ales) {
        const [a0, a1] = M.edit.ales, sp = el('span', 'lh-ap-x-ed-sel', { 'aria-hidden': 'true' });
        sp.textContent = M.edit.text.slice(a0, a1);
        sp.style.left = (3 + latimeText(M.edit.text.slice(0, a0))) + 'px';
        ce.appendChild(sp);
        caretEl.style.display = 'none';
      }
      if (M.edit.propus) {
        const b = dr(M.edit.propus);
        Object.assign(propEl.style, { display: '', left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
      }
    }
    /* cât din dreapta grilei stă sub bara verticală desenată (px); 0 dacă bara nu se vede */
    function subBara() { const b = barV.pane.getBoundingClientRect(), c = corp.getBoundingClientRect(); return b.width ? Math.max(0, Math.round(c.right - b.left)) : 0; }
    function vedeCelula(r, c0) {
      const lc = wCol(c0), hr = hRand(r), x = xCol(c0), y = yRand(r);
      /* runda 21: în fereastra pe coloane celula se aduce la stânga barei verticale (pe grila normală, ca înainte) */
      const lat = corp.clientWidth - (C0 > 0 ? subBara() : 0);
      if (x < corp.scrollLeft) corp.scrollLeft = x;
      else if (x + lc > corp.scrollLeft + lat) corp.scrollLeft = x + lc - lat;
      if (y < corp.scrollTop) corp.scrollTop = y;
      else if (y + hr > corp.scrollTop + corp.clientHeight) corp.scrollTop = y + hr - corp.clientHeight;
    }

    /* ---- barele: Name Box, bara de formule, modul celulei (bara de stare), titlul, Undo/Redo gri */
    function actualizeazaBare() {
      const f = F(), s = f.sel, a = adr(s.activa.r, s.activa.c);
      if (document.activeElement !== inNume) inNume.value = M.gr ? 'Chart ' + (M.gr.i + 1) : (M.trageInfo || a);
      inF.value = M.gr ? (M.grTitlu || '') : M.edit ? M.edit.text : textEditare(f, a);
      const mod = M.edit ? (M.edit.punct ? 'Point' : M.edit.mod) : 'Ready';
      if (elMod) { elMod.firstChild.textContent = mod; elMod.setAttribute('data-lh-eticheta', 'Cell Mode ' + mod); }
      if (elZoomText) { const t = elZoomText.querySelector('.lh-ap-text') || elZoomText; t.textContent = M.zoom + ' %'; elZoomText.setAttribute('data-lh-eticheta', 'Zoom ' + M.zoom + ' %'); }
      rezumatSelectie();
      if (elTitlu) { const t = elTitlu.querySelector('.lh-ap-x-titlu'); if (t) t.textContent = titlu(); elTitlu.setAttribute('data-lh-eticheta', titlu()); }
      const gri = (sel, on) => root.querySelectorAll(sel).forEach(x => { x.classList.toggle('lh-ap-gri', !on); if (on) x.removeAttribute('aria-disabled'); else x.setAttribute('aria-disabled', 'true'); });
      gri('[data-lh-suprafata="acces_rapid"] [data-lh-id-mso="Undo"], [data-lh-suprafata="acces_rapid"] [data-lh-id-mso="Undo"] *', H.poateAnula());
      gri('[data-lh-suprafata="acces_rapid"] [data-lh-id-mso="Redo"], [data-lh-suprafata="acces_rapid"] [data-lh-id-mso="Redo"] *', H.poateReface());
      foileFile();
      actualizeazaPanglica();
    }
    function actualizeazaPanglica() {
      const f = F(), a = adr(f.sel.activa.r, f.sel.activa.c), fm = fmtDe(f, a);
      const ap = (id, on) => loculPanglicii.querySelectorAll('[data-lh-id-mso="' + id + '"]').forEach(x => x.classList.toggle('lh-ap-apasat', !!on));
      ap('Bold', fm.bold); ap('Italic', fm.italic); ap('Underline', fm.underline);
      ap('AlignLeft', fm.aliniere === 'stanga'); ap('AlignCenter', fm.aliniere === 'centru'); ap('AlignRight', fm.aliniere === 'dreapta');
      ap('MergeCenter', !!fm.imbinat);
    }
    /* ---- filele foilor (Book1 › Tab: Scroll Left/Right gri, filele, Add Sheet — poziții din referință) */
    /* culoarea filei (runda 29; m1-l03:204 + img/file-colorate.webp: „Când nu e activă, fila e plină de culoare”; activă = albă,
       cu dunga de jos în culoarea ei). Stil în linie: aplicatii.css e comun. Literele: negre pe culori deschise, albe pe închise */
    function stilFila(t, fo, on) {
      if (!fo || !fo.culoare) { t.style.background = ''; t.style.color = ''; t.style.boxShadow = ''; return; }
      const h = fo.culoare, lum = (0.299 * parseInt(h.slice(1, 3), 16) + 0.587 * parseInt(h.slice(3, 5), 16) + 0.114 * parseInt(h.slice(5, 7), 16)) / 255;
      t.style.background = on ? '' : h;
      t.style.color = on ? '' : (lum < 0.5 ? '#fff' : '#000');
      t.style.boxShadow = on ? 'inset 0 -2px 0 ' + h : 'none';
    }
    function foileFile() {
      const sem = M.foi.map(x => x.nume + ':' + (x.culoare || '')).join('|') + '#' + M.fi, semN = M.foi.map(x => x.nume + ':' + (x.culoare || '')).join('|');
      if (tabFoi.__sem === sem) return;
      /* la schimbarea foii active doar marcajul: elementele rămân, ca dublul clic să nimerească fila */
      if (tabFoi.__nume === semN && !redenumire) {
        tabFoi.__sem = sem;
        tabFoi.querySelectorAll('[data-lh-tinta="fila_foii"]').forEach(t => { const on = t.getAttribute('data-lh-id') === M.foi[M.fi].nume; t.classList.toggle('activ', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); stilFila(t, M.foi.find(x => x.nume === t.getAttribute('data-lh-id')), on); });
        return;
      }
      tabFoi.__sem = sem;
      tabFoi.__nume = semN;
      tabFoi.innerHTML = '';
      const r0 = ff.r || [1, 713, 805, 32];
      tabFoi.style.width = r0[2] + 'px';
      const tab0 = (ff.c || []).find(x => x.t === 'TabItem') || { r: [113, 713, 66, 32], id: 'SheetTab' };
      let x = tab0.r[0] - r0[0];
      (ff.c || []).filter(b => b.t === 'Button' && /^Scroll/.test(b.e)).forEach(b => {
        const e = el('div', 'lh-ap-n lh-ap-x-ff-btn lh-ap-gri', { 'data-lh-tip': 'Button', 'data-lh-eticheta': b.e, 'data-lh-id-mso': b.id, role: 'button', 'aria-label': b.e, 'aria-disabled': 'true', 'data-lh-tinta': 'fila_foii_buton:' + b.e });
        e.innerHTML = pang.glif(/Left/.test(b.e) ? 'sageata' : 'sageata', 12);
        e.classList.add(/Left/.test(b.e) ? 'lh-ap-x-st' : 'lh-ap-x-dr');
        Object.assign(e.style, { left: (b.r[0] - r0[0]) + 'px', top: '0px', width: b.r[2] + 'px', height: b.r[3] + 'px' });
        tabFoi.appendChild(e);
      });
      M.foi.forEach((fo, i) => {
        const w = Math.max(tab0.r[2], Math.round(latimeText(fo.nume) * 0.85 + 26));
        const e = el('div', 'lh-ap-n lh-ap-t-TabItem lh-ap-x-ff', { 'data-lh-tip': 'TabItem', 'data-lh-eticheta': fo.nume, 'data-lh-id-mso': tab0.id, role: 'tab',
          'aria-selected': i === M.fi ? 'true' : 'false', 'data-lh-tinta': 'fila_foii', 'data-lh-id': fo.nume });
        e.innerHTML = '<span class="lh-ap-text">' + esc(fo.nume) + '</span>';
        e.classList.toggle('activ', i === M.fi);
        Object.assign(e.style, { left: x + 'px', top: '0px', width: w + 'px', height: tab0.r[3] + 'px' });
        stilFila(e, fo, i === M.fi);
        x += w + 1;
        tabFoi.appendChild(e);
      });
      const add = (ff.c || []).find(b => /Add Sheet/.test(b.e));
      if (add) {
        const dx = add.r[0] - (tab0.r[0] + tab0.r[2]);
        const e = el('div', 'lh-ap-n lh-ap-x-ff-btn', { 'data-lh-tip': 'Button', 'data-lh-eticheta': add.e, 'data-lh-id-mso': add.id, role: 'button', 'aria-label': add.e, 'data-lh-tinta': 'fila_foii_buton:' + add.e });
        e.innerHTML = pang.glif('plus', 14);
        Object.assign(e.style, { left: (x - 1 + dx) + 'px', top: '0px', width: add.r[2] + 'px', height: add.r[3] + 'px' });
        tabFoi.appendChild(e);
      }
    }

    function actualizeaza() { invalid(); deseneazaGrila(); }
    I.focus = () => { try { intrare.focus({ preventScroll: true }); } catch (e) { /* */ } };
    if (ingust) { const laSchimbare = () => { if (!root.isConnected) { try { ingust.removeEventListener('change', laSchimbare); } catch (e) { /* */ } return; } actualizeaza(); }; try { ingust.addEventListener('change', laSchimbare); } catch (e) { /* */ } }
    /* focusul rămâne în caseta de intrare a celulei când se apasă grila, panglica sau barele (ca în word.js): altfel apăsarea
       mută focusul pe rădăcină, iar tastatura telefonului / cea care compune nu mai are unde scrie (critic 6, GRAV X9).
       Tot așa nu mai apare selecția albastră a browserului peste celule la tragere. Câmpurile (Name Box, ferestre) își iau focusul. */
    root.addEventListener('mousedown', e => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      e.preventDefault();
    });
    I.pxPePunct = () => 96 / 72 * M.zoom / 100;
    activeazaFila('TabHome');
    actualizeaza();

    /* ============================================================ selecția și mutarea */
    function alege(r, c0, extinde, adauga) {
      const f = F(), s = f.sel;
      r = Math.max(0, Math.min(MAXR - 1, r)); c0 = Math.max(0, Math.min(MAXC - 1, c0));
      if (extinde) {
        const a = s.activa, q = { r0: Math.min(a.r, r), c0: Math.min(a.c, c0), r1: Math.max(a.r, r), c1: Math.max(a.c, c0) };
        s.zone[s.zone.length - 1] = q;
        s.capat = { r, c: c0 };
      } else if (adauga) {
        s.zone.push({ r0: r, c0: c0, r1: r, c1: c0 });
        s.activa = { r, c: c0 };
        s.capat = null;
      } else {
        s.zone = [{ r0: r, c0: c0, r1: r, c1: c0 }];
        s.activa = { r, c: c0 };
        s.capat = null;
      }
      /* runda 25: o tastă / un clic care duce celula activă (sau capătul selecției) în afara vederii mutate de derulare o anulează */
      if (VR && (r < VR.r0 || r >= VR.r0 + VR.n)) VR = null;
      if (VC && (c0 < VC.c0 || c0 >= VC.c0 + VC.n)) VC = null;
      const need = intindere();
      if (need.r > NR || need.c > NC || need.r0 !== R0 || need.c0 !== C0) deseneazaGrila(); else deseneazaSelectia();
      vedeCelula(r, c0);
    }
    const unaSingura = () => { const s = F().sel; return s.zone.length === 1 && s.zone[0].r0 === s.zone[0].r1 && s.zone[0].c0 === s.zone[0].c1; };
    /* Enter / Tab ÎN zona aleasă se mută doar în ea (comportamentul Excel cu o zonă selectată) */
    function inainteaza(dr0, dc0) {
      const f = F(), s = f.sel;
      if (unaSingura()) {
        const m = mergeLa(f, s.activa.r, s.activa.c);
        let r = s.activa.r + dr0, c0 = s.activa.c + dc0;
        if (m && dr0 > 0) r = m.r1 + 1;
        if (m && dc0 > 0) c0 = m.c1 + 1;
        alege(r, c0);
        return;
      }
      const q = s.zone[s.zone.length - 1];
      let r = s.activa.r, c0 = s.activa.c;
      if (dr0) { r += dr0; if (r > q.r1) { r = q.r0; c0++; if (c0 > q.c1) c0 = q.c0; } if (r < q.r0) { r = q.r1; c0--; if (c0 < q.c0) c0 = q.c1; } }
      else { c0 += dc0; if (c0 > q.c1) { c0 = q.c0; r++; if (r > q.r1) r = q.r0; } if (c0 < q.c0) { c0 = q.c1; r--; if (r < q.r0) r = q.r1; } }
      s.activa = { r, c: c0 };
      deseneazaSelectia();
      vedeCelula(r, c0);
    }
    function sari(dr0, dc0, extinde) {
      /* Ctrl+săgeată: marginea blocului de date */
      const f = F(), s = f.sel, p = extinde && s.capat ? s.capat : s.activa;
      let r = p.r, c0 = p.c;
      /* runda 17 (uia_excel.json › acoperire_r14.fapte.v_varsare_com.r10_5 și scenariile excel-varsare-ctrl-*, excel-ctrl-*):
         celulele VĂRSATE sunt pline (D2 End(xlDown) = D6, D7 End(xlUp) = D6); după ultimul bloc tasta merge până la marginea
         FOII (A7 End(xlDown) = A1048576, C7 End(xlToRight) = XFD7), nu a grilei desenate. Celulele pline de pe linie se adună
         o dată (nu se trece celulă cu celulă prin 1.048.576 de rânduri). */
      const pline = new Set(Object.keys(f.cel));
      toateVarsate(f).forEach(([a]) => pline.add(a));
      const plin = (r2, c2) => r2 >= 0 && c2 >= 0 && r2 < MAXR && c2 < MAXC && pline.has(adr(r2, c2));
      const d = dr0 || dc0, cur = dr0 ? r : c0, lim = dr0 ? MAXR - 1 : MAXC - 1, la = t => (dr0 ? plin(t, c0) : plin(r, t));
      let t = cur;
      if (cur + d >= 0 && cur + d <= lim) {
        if (la(cur) && la(cur + d)) { while (t + d >= 0 && t + d <= lim && la(t + d)) t += d; }
        else {
          const pe = [...pline].map(pa).filter(q => q && (dr0 ? q.c === c0 : q.r === r)).map(q => (dr0 ? q.r : q.c)).filter(x => (d > 0 ? x > cur : x < cur));
          t = pe.length ? (d > 0 ? Math.min(...pe) : Math.max(...pe)) : (d > 0 ? lim : 0);
        }
      }
      if (dr0) r = t; else c0 = t;
      if (extinde) { alege(r, c0, true); } else alege(r, c0);
    }

    /* ============================================================ editarea celulei */
    function porneste(a, text, mod, poz, ales, propus) {
      M.edit = { a, text, mod, poz: poz == null ? text.length : poz, original: text, ales: ales || null, propus: propus || null };
      /* runda 25: tastarea într-o celulă activă rămasă în afara vederii mutate de derulare aduce vederea înapoi la ea (Excel) */
      if ((VR || VC) && !celEl[a]) { VR = VC = null; const q = pa(a); deseneazaGrila(); if (q) vedeCelula(q.r, q.c); }
      deseneazaSelectia();
      I.focus();
    }
    /* textul ales (zona propusă de Σ, lecția m2-l08:181/196/201 „scrie B2:B6 peste zona propusă”) se înlocuiește cu ce scrie
       elevul; fără text ales, se inserează la cursor */
    function stergeAles(e) {
      if (!e || !e.ales) return false;
      e.text = e.text.slice(0, e.ales[0]) + e.text.slice(e.ales[1]);
      e.poz = e.ales[0];
      e.ales = null;
      return true;
    }
    function insereaza(s) {
      const e = M.edit;
      stergeAles(e);
      e.text = e.text.slice(0, e.poz) + s + e.text.slice(e.poz);
      e.poz += s.length;
      e.punct = false;
      e.propus = null;
      e.pk = null;
      deseneazaSelectia();
    }
    /* Enter: Excel primește conținutul; o formulă greșită NU e primită (rămâne în editare — de_verificat R6-2) */
    function confirma() {
      const e = M.edit;
      if (!e) return true;
      const f = F(), p = pa(e.a), s = e.text;
      let nou = null, fn = null, ok = true;
      if (s.charAt(0) === '=' && s.length > 1) {
        const en = laForma(s, 'ro', 'en');
        if (!en) ok = false;
        else nou = { f: en };
      } else if (s === '=') ok = false;
      else if (s !== '') { const k = constanta(s); nou = { v: k.v }; if (k.ap) nou.ap = true; fn = k.fn || null; }
      if (!ok) { if (!fereastraEroare(s)) mesajFormula(); return false; }
      M.edit = null;
      schimba('scriere', () => {
        if (nou) f.cel[e.a] = nou; else delete f.cel[e.a];
        if (fn) { f.fmt[e.a] = Object.assign({}, f.fmt[e.a] || {}, { format_numar: fn }); }
        /* un număr TASTAT care nu încape lățește coloana (Excel real, gest: excel-zero-in-fata → „741234567” întreg, 9 cifre;
           excel-numere-afisare: 1234567890 → 79 px, 12345678901234 → „1,23457E+13”, 86 px). Runda 25: și rezultatul TASTAT al
           unei formule, când în General e științific (excel-numere-afisare: =1/30000 → „3,33333E-05”, =1/7000000 → „1,42857E-07”,
           86 px; =25/3 → „8,333333” rămâne la 64 px). Lățimea = 7 px pe caracter + 9 (cele patru lățimi reale de mai sus).
           Conținutul de pornire și valorile puse prin model nu lățesc (com_r6.json: „1,23E+09”, „8,333333”) */
        if (nou && !fn && !f.latSet[p.c] && !mergeLa(f, p.r, p.c)) {
          const v = nou.f ? valoare(f, p.r, p.c) : nou.v;
          const fm = (fmtDe(f, e.a).format_numar) || 'General', t = typeof v === 'number' ? afisat(v, fm) : '';
          if (t && fm === 'General' && (!nou.f || /E/.test(t)) && latCifre(t) > unitatiDin(latPx(f, p.c)) + 1e-9) f.lat[p.c] = latTastat(t);
        }
      });
      f.sel.activa = { r: p.r, c: p.c };
      deseneazaGrila();
      return true;
    }
    function renunta() { M.edit = null; deseneazaSelectia(); }
    /* ferestrele reale de eroare a formulei (uia_excel.json › dialog.eroare_formula*, runda acoperire după runda 7), în locul
       mesajului central, DOAR pe cazurile capturate:
       - „=SUM(A1,A2)” (virgula, separatorul englez, pe Excel românesc) → dialog.eroare_formula_2 „There's a problem with this
         formula.” (scenarii_real/excel-separator-virgula.json: OK, ramane_in_editare true);
       - prea puține argumente („=SU” + Tab + „A1:A3)” → SUBSTITUTE) → dialog.eroare_formula_3 „You've entered too few arguments
         for this function.” (scenarii_real/excel-autocompletare-tab.json);
       - o referință lipită de „)” („=SUM(B2:B7)B2:B6”) → dialog.eroare_formula „We found a typo … =SUM(B2:B7)*B2:B6 … accept
         this correction?” (Yes cu focusul, No).
       Altfel (ex. „=” singur, paranteză lipsă): mesajul central, ca înainte (fără referință). */
    function motivFormula(text) { try { arbore(jetoane(text.slice(1), 'ro')); return null; } catch (e) { return (e && e.message) || 'alta'; } }
    function fereastraEroare(text) {
      const mo = motivFormula(text);
      if (!mo) return false;
      let cheie = null, corectat = null;
      if (mo === 'argumente') cheie = 'dialog.eroare_formula_3';
      else if (mo === 'rest') {
        const re = /\)\s*(?=\$?[A-Za-z]{1,3}\$?\d)/g;
        let m;
        while (!corectat && (m = re.exec(text))) { const c = text.slice(0, m.index + 1) + '*' + text.slice(m.index + 1).replace(/^\s+/, ''); if (!motivFormula(c)) corectat = c; }
        if (corectat) cheie = 'dialog.eroare_formula';
      } else if (/,/.test(text.replace(/"[^"]*"/g, ''))) cheie = 'dialog.eroare_formula_2';
      if (!cheie || !SUP[cheie] || !deschideDialog(cheie)) return false;
      if (corectat) {
        /* textul ferestrei arată formula corectată a elevului, nu pe cea din captură (=SUM(B2:B7)*B2:B6) */
        dialog.corectat = corectat;
        dialog.el.querySelectorAll('[data-lh-tip="Text"]').forEach(x => {
          const t0 = x.getAttribute('data-lh-eticheta') || '';
          if (!/typo/.test(t0)) return;
          const nou = t0.replace(/\u202d=[^\n]*/, '\u202d' + corectat);
          x.setAttribute('data-lh-eticheta', nou);
          const sp = x.querySelector('.lh-ap-text') || x;
          sp.textContent = nou;
        });
      }
      const texte = [], butoane = [];
      dialog.el.querySelectorAll('[data-lh-tip="Text"],[data-lh-tip="Button"]').forEach(x => {
        if (x.closest('[data-lh-tip="TitleBar"]')) return;
        (x.getAttribute('data-lh-tip') === 'Button' ? butoane : texte).push(x.getAttribute('data-lh-eticheta') || '');
      });
      M.mesaj = { titlu: 'Microsoft Excel', texte, butoane };
      return true;
    }
    function mesajFormula() {
      root.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x => x.remove());
      const m = el('div', 'lh-ap-mesaj', { 'data-lh-nesimulat': 'formula', role: 'status' });
      m.textContent = 'Excel nu primește formula așa cum e scrisă. În aplicația reală apare o fereastră de eroare (aici nu e simulată). Corectează formula sau apasă Esc.';
      root.appendChild(m);
      clearTimeout(I._tMesaj);
      I._tMesaj = setTimeout(() => m.remove(), scenariu ? 60000 : 6000);
    }
    /* F4 pe referința de la cursor: A1 → $A$1 → A$1 → $A1 → A1 (excel-f4-adresa-fixa, excel-f4-de-doua-ori) */
    function f4() {
      const e = M.edit;
      if (!e || e.text.charAt(0) !== '=') return 'fara_efect';
      const re = /\$?[A-Za-z]{1,3}\$?\d+/g;
      let m, gasit = null;
      while ((m = re.exec(e.text))) { const a = m.index, b = a + m[0].length; if (e.poz >= a && e.poz <= b) gasit = { a, b, s: m[0] }; }
      if (!gasit) return 'fara_efect';
      const x = /^(\$?)([A-Za-z]{1,3})(\$?)(\d+)$/.exec(gasit.s);
      const st = (x[1] ? 1 : 0) + (x[3] ? 2 : 0);
      const urm = { 0: [1, 1], 3: [0, 1], 2: [1, 0], 1: [0, 0] }[st];
      const nou = (urm[0] ? '$' : '') + x[2].toUpperCase() + (urm[1] ? '$' : '') + x[4];
      e.text = e.text.slice(0, gasit.a) + nou + e.text.slice(gasit.b);
      e.poz = gasit.a + nou.length;
      deseneazaSelectia();
      return 'adresa_fixa';
    }
    /* Tab în timp ce Excel arată lista funcțiilor (după „=SU”): completează prima funcție din listă, cu „(”. Lista vizibilă nu
       e capturată (de_verificat); prima funcție = prima în ordine alfabetică dintre cele simulate, ceea ce dă exact rezultatele
       din Excel real: „=AV” → AVEDEV (scenarii_real/excel-av-tab.json), „=AVER” → AVERAGE (excel-aver-tab.json), „=SU” →
       SUBSTITUTE (excel-autocompletare-tab.json). Critic runda 7, GRAV K4. */
    function completare() {
      const e = M.edit;
      if (!e || e.text.charAt(0) !== '=') return null;
      const m = /(^|[=+\-*/^&(;<>\s])([A-Za-z][A-Za-z0-9.]*)$/.exec(e.text.slice(0, e.poz));
      if (!m) return null;
      const pref = m[2].toUpperCase(), fn = NUME_FN.find(n => n.indexOf(pref) === 0);
      if (!fn) return null;
      const a = e.poz - m[2].length;
      e.text = e.text.slice(0, a) + fn + '(' + e.text.slice(e.poz);
      e.poz = a + fn.length + 1;
      deseneazaSelectia();
      return 'completare_functie';
    }
    /* modul „Point”: în timpul unei formule, după un operator, clicul pe o celulă scrie referința ei */
    function poatePuncta() { const e = M.edit; return e && e.text.charAt(0) === '=' && /[=+\-*/^&(;<>:]$/.test(e.text.slice(0, e.poz)); }

    /* ============================================================ comenzile */
    function celuleZone(f, cuGoale) {
      const out = [], u = ultim(f);
      f.sel.zone.forEach(q => {
        const r1 = Math.min(q.r1, cuGoale ? Math.max(u.r, NR - 1) : u.r), c1 = Math.min(q.c1, cuGoale ? Math.max(u.c, NC - 1) : u.c);
        for (let r = q.r0; r <= r1; r++) for (let c0 = q.c0; c0 <= c1; c0++) out.push(adr(r, c0));
      });
      return out;
    }
    function comutaFormat(k) {
      const f = F(), a = adr(f.sel.activa.r, f.sel.activa.c), on = !fmtDe(f, a)[k];
      schimba('format', () => celuleZone(f, true).forEach(x => { f.fmt[x] = Object.assign({}, f.fmt[x] || {}); if (on) f.fmt[x][k] = true; else delete f.fmt[x][k]; }));
      actualizeaza();
      return k === 'bold' ? 'aldin' : k === 'italic' ? 'cursiv' : 'subliniat';
    }
    function aliniaza(al) {
      const f = F(), a = adr(f.sel.activa.r, f.sel.activa.c), deja = fmtDe(f, a).aliniere === al;
      schimba('format', () => celuleZone(f, true).forEach(x => { f.fmt[x] = Object.assign({}, f.fmt[x] || {}); if (deja) delete f.fmt[x].aliniere; else f.fmt[x].aliniere = al; }));
      actualizeaza();
      return 'aliniere';
    }
    /* ---- runda 7 (critic 6: X7) — Fill Color, Borders, Percent Style, Wrap Text (lecția m1-l06:76, :77, :177, :255) */
    /* Fill Color (butonul): culoarea din eticheta lui, „Fill Color RGB(255, 255, 0)” (uia_excel.json › panglica.TabHome);
       Excel real: Interior.Color = 65535 (com_r7c.json › fill) */
    function umpleCuloare(hex) {
      const f = F();
      schimba('format', () => celuleZone(f, true).forEach(x => { f.fmt[x] = Object.assign({}, f.fmt[x] || {}); if (hex) f.fmt[x].umplere = hex; else delete f.fmt[x].umplere; }));
      actualizeaza();
      return 'umplere_culoare';
    }
    /* Percent Style: formatul „0%” (com_r7c.json › percent: 0,1 → 10%, 0,125 → 13%, 9 → 900%; valoarea rămâne) */
    function procent() {
      const f = F();
      schimba('format', () => celuleZone(f, true).forEach(x => { f.fmt[x] = Object.assign({}, f.fmt[x] || {}, { format_numar: '0%' }); }));
      actualizeaza();
      return 'format_numar';
    }
    /* Wrap Text: comutator (lista Microsoft S11: WrapText = toggleButton); rândul crește singur (geomRand) */
    function incadreaza() {
      const f = F(), a = f.sel.activa, on = !fmtDe(f, adr(a.r, a.c)).incadrare;
      schimba('format', () => celuleZone(f, true).forEach(x => { f.fmt[x] = Object.assign({}, f.fmt[x] || {}); if (on) f.fmt[x].incadrare = true; else delete f.fmt[x].incadrare; }));
      actualizeaza();
      return 'incadrare_text';
    }
    /* Borders: lista = BordersGallery din lista Microsoft a comenzilor Excel (surse_microsoft.md S11, în ordinea de acolo);
       etichetele = CommandBars.GetLabelMso din Excel real (com_r7c.json › etichete); efectul pe muchii = com_r7c.json
       (all_borders, bottom_border, outside_border, none_border). Butonul principal = Bottom Border (uia_excel.json). */
    const BORD_LISTA = [['BorderBottomNoToggle', 'Bottom Border'], ['BorderTopNoToggle', 'Top Border'], ['BorderLeftNoToggle', 'Left Border'],
      ['BorderRightNoToggle', 'Right Border'], ['BorderNone', 'No Border'], ['BordersAll', 'All Borders'], ['BorderOutside', 'Outside Borders'],
      ['BorderThickOutside', 'Thick Outside Borders'], ['BorderDoubleBottom', 'Bottom Double Border'], ['BorderThickBottom', 'Thick Bottom Border'],
      ['BorderTopAndBottom', 'Top and Bottom Border'], ['BorderTopAndThickBottom', 'Top and Thick Bottom Border'],
      ['BorderTopAndDoubleBottom', 'Top and Double Bottom Border'], ['BorderDrawLine', 'Draw Border'], ['BorderDrawGrid', 'Draw Border Grid'],
      ['BorderErase', 'Erase Border'], ['BorderColorPickerExcel', 'Line Color'], ['BorderStyle', 'Line Style'], ['BordersMoreDialog', 'More Borders...']];
    const BORD_EFECT = new Set(BORD_LISTA.slice(0, 13).map(x => x[0]));
    const LIN = { subtire: '1px solid #000', groasa: '2px solid #000', dubla: '3px double #000' };
    function bordStil(f, d, r, c0, m) {
      const B = f.bord || {}, r1 = m ? m.r1 : r, c1 = m ? m.c1 : c0;
      const jos = B['h,' + (r1 + 1) + ',' + c0], dr2 = B['v,' + r + ',' + (c1 + 1)];
      if (jos) d.style.borderBottom = LIN[jos];
      if (dr2) d.style.borderRight = LIN[dr2];
      const sh = [];
      if (r === 0 && B['h,0,' + c0]) sh.push('inset 0 1px 0 #000');
      if (c0 === 0 && B['v,' + r + ',0']) sh.push('inset 1px 0 0 #000');
      if (sh.length) d.style.boxShadow = sh.join(',');
    }
    function borduri(id) {
      const f = F();
      if (!f.bord) f.bord = {};
      schimba('format', () => f.sel.zone.forEach(q0 => {
        const B = f.bord, q = { r0: q0.r0, c0: q0.c0, r1: Math.min(q0.r1, NR - 1), c1: Math.min(q0.c1, NC - 1) };
        const H_ = (r, c0, v) => { const k = 'h,' + r + ',' + c0; if (v) B[k] = v; else delete B[k]; };
        const V_ = (r, c0, v) => { const k = 'v,' + r + ',' + c0; if (v) B[k] = v; else delete B[k]; };
        const sus = v => { for (let c0 = q.c0; c0 <= q.c1; c0++) H_(q.r0, c0, v); };
        const jos = v => { for (let c0 = q.c0; c0 <= q.c1; c0++) H_(q.r1 + 1, c0, v); };
        const st = v => { for (let r = q.r0; r <= q.r1; r++) V_(r, q.c0, v); };
        const dr2 = v => { for (let r = q.r0; r <= q.r1; r++) V_(r, q.c1 + 1, v); };
        const tot = v => { for (let r = q.r0; r <= q.r1 + 1; r++) for (let c0 = q.c0; c0 <= q.c1; c0++) H_(r, c0, v); for (let r = q.r0; r <= q.r1; r++) for (let c0 = q.c0; c0 <= q.c1 + 1; c0++) V_(r, c0, v); };
        const contur = v => { sus(v); jos(v); st(v); dr2(v); };
        ({ BorderBottomNoToggle: () => jos('subtire'), BorderTopNoToggle: () => sus('subtire'), BorderLeftNoToggle: () => st('subtire'),
          BorderRightNoToggle: () => dr2('subtire'), BorderNone: () => tot(null), BordersAll: () => tot('subtire'), BorderOutside: () => contur('subtire'),
          BorderThickOutside: () => contur('groasa'), BorderDoubleBottom: () => jos('dubla'), BorderThickBottom: () => jos('groasa'),
          BorderTopAndBottom: () => { sus('subtire'); jos('subtire'); }, BorderTopAndThickBottom: () => { sus('subtire'); jos('groasa'); },
          BorderTopAndDoubleBottom: () => { sus('subtire'); jos('dubla'); } })[id]();
      }));
      actualizeaza();
      return 'borduri';
    }
    /* lista Borders ▾: sub săgeată, ca meniurile panglicii; aspectul exact (titlurile „Borders” / „Draw Borders”, pictogramele)
       nu e în referință → de_verificat RUNDA7-EXCEL R7-9 */
    function meniuBorduri(elx) {
      inchideMeniu();
      const m = el('div', 'lh-ap-x-meniu lh-ap-x-meniu-borduri', { role: 'menu', 'data-lh-suprafata': 'meniu.BordersGallery', 'aria-label': 'Borders' });
      BORD_LISTA.forEach(([id, e]) => {
        const it = el('div', 'lh-ap-n lh-ap-t-MenuItem', { role: 'menuitem', 'data-lh-tip': 'MenuItem', 'data-lh-eticheta': e, 'data-lh-id-mso': id, 'data-lh-tinta': 'meniu:' + e });
        const ic = pang.icoana(I, id, 16);
        it.innerHTML = (ic && /^<svg|^<span/.test(ic) ? ic : '<span class="lh-ap-x-mi-gol" aria-hidden="true"></span>') + '<span class="lh-ap-text">' + esc(e) + '</span>';
        m.appendChild(it);
      });
      const R = root.getBoundingClientRect(), b = (elx.closest('[data-lh-tip="SplitButton"]') || elx).getBoundingClientRect();
      m.style.left = Math.max(0, Math.min(b.left - R.left, R.width - 240)) + 'px';
      m.style.top = (b.bottom - R.top + 1) + 'px';
      root.appendChild(m);
      meniu = m;
      return 'meniu_derulant';
    }
    function golesteContinut() {
      const f = F();
      schimba('stergere', () => celuleZone(f, false).forEach(x => { delete f.cel[x]; }));
      actualizeaza();
      return 'golire';
    }
    /* Merge & Center (excel-imbina-centreaza): fiecare celulă a zonei are aliniere „centru” și imbinat = zona */
    function imbina() {
      const f = F(), q = f.sel.zone[f.sel.zone.length - 1];
      const m = mergeLa(f, f.sel.activa.r, f.sel.activa.c);
      if (m) {
        const t = zonaText(m);
        schimba('format', () => { f.merge = f.merge.filter(x => x !== t); for (let r = m.r0; r <= m.r1; r++) for (let c0 = m.c0; c0 <= m.c1; c0++) { const a = adr(r, c0); if (f.fmt[a]) { delete f.fmt[a].imbinat; delete f.fmt[a].aliniere; } } });
        actualizeaza();
        return 'anulare_imbinare';
      }
      if (q.r0 === q.r1 && q.c0 === q.c1) return 'fara_efect';
      const t = zonaText(q);
      schimba('format', () => {
        for (let r = q.r0; r <= q.r1; r++) for (let c0 = q.c0; c0 <= q.c1; c0++) {
          const a = adr(r, c0);
          if ((r !== q.r0 || c0 !== q.c0)) delete f.cel[a];
          f.fmt[a] = Object.assign({}, f.fmt[a] || {}, { aliniere: 'centru', imbinat: t });
        }
        f.merge.push(t);
      });
      f.sel.activa = { r: q.r0, c: q.c0 };
      actualizeaza();
      return 'imbinare_centrare';
    }
    /* AutoSum (excel-autosum-buton): =SUM(numerele de deasupra; altfel din stânga), în editare — Enter îl primește */
    const SIGMA_FN = { Sum: 'SUM', Average: 'AVERAGE', 'Count Numbers': 'COUNT', Max: 'MAX', Min: 'MIN' };
    function autoSum(fnx) {
      const FX = fnx || 'SUM';
      const f = F(), s = f.sel;
      if (!unaSingura()) {
        const q = s.zone[s.zone.length - 1];
        const tinta2 = q.r1 + 1 < MAXR ? { r: q.r1 + 1, c: q.c0 } : null;
        if (!tinta2) return 'fara_efect';
        schimba('scriere', () => { for (let c0 = q.c0; c0 <= q.c1; c0++) f.cel[adr(q.r1 + 1, c0)] = { f: '=' + FX + '(' + adr(q.r0, c0) + ':' + adr(q.r1, c0) + ')' }; });
        actualizeaza();
        return 'suma_automata';
      }
      const a = s.activa, nr = (r, c0) => r >= 0 && c0 >= 0 && typeof valoare(f, r, c0) === 'number';
      let zona = '';
      if (nr(a.r - 1, a.c)) { let r = a.r - 1; while (nr(r - 1, a.c)) r--; zona = adr(r, a.c) + ':' + adr(a.r - 1, a.c); }
      else if (nr(a.r, a.c - 1)) { let c0 = a.c - 1; while (nr(a.r, c0 - 1)) c0--; zona = adr(a.r, c0) + ':' + adr(a.r, a.c - 1); }
      const t = '=' + FX + '(' + zona + ')';
      /* zona propusă e aleasă (scrisul sau tragerea elevului o înlocuiește) și încadrată punctat (lecția m2-l08:181);
         cursorul stă înaintea parantezei; Enter o primește (scenarii_real/excel-autosum-buton) */
      porneste(adr(a.r, a.c), t, 'Enter', t.length - 1, zona ? [t.length - 1 - zona.length, t.length - 1] : null, zona ? zonaDin(zona) : null);
      /* critic runda 8, GRAV E3: cu zona propusă, celula e în modul Point (uia_excel.json › acoperire_r7.fapte.c_autosum:
         mod_dupa_sigma / mod_dupa_average „Cell Mode Point”); o săgeată înlocuiește zona cu o referință (mecanismul K5,
         pornit din celula editată), nu primește formula */
      if (zona) { M.edit.punct = true; M.edit.pk = { i: t.length - 1 - zona.length, j: t.length - 1, r: a.r, c: a.c }; deseneazaSelectia(); }
      return 'suma_automata';
    }
    /* Sort A to Z / Z to A (excel-sortare-a-z): zona curentă în jurul celulei active; primul rând = antet dacă e text
       deasupra unor numere (Excel îl recunoaște singur) */
    function zonaCurenta(f, r, c0) {
      /* celulele vărsate fac parte din zonă (runda 17: D3 CurrentRegion = D2:D6, fapte.v_varsare_com.r10_5) */
      const plin = (r2, c2) => r2 >= 0 && c2 >= 0 && r2 < MAXR && c2 < MAXC && (!!f.cel[adr(r2, c2)] || !!varsat(f, r2, c2));
      if (!plin(r, c0)) return null;
      let q = { r0: r, c0: c0, r1: r, c1: c0 }, schimbat = true;
      while (schimbat) {
        schimbat = false;
        for (let c2 = q.c0 - 1; c2 <= q.c1 + 1; c2++) { if (plin(q.r0 - 1, c2)) { q.r0--; schimbat = true; break; } if (plin(q.r1 + 1, c2)) { q.r1++; schimbat = true; break; } }
        for (let r2 = q.r0 - 1; r2 <= q.r1 + 1; r2++) { if (plin(r2, q.c0 - 1)) { q.c0--; schimbat = true; break; } if (plin(r2, q.c1 + 1)) { q.c1++; schimbat = true; break; } }
      }
      return q;
    }
    /* rândul de antet: text deasupra unor numere sau antet îngroșat (Excel îl recunoaște singur; „My data has headers”) */
    function areAntet(f, q) {
      let antet = false;
      for (let c0 = q.c0; c0 <= q.c1 && !antet; c0++) {
        const v0 = valoare(f, q.r0, c0);
        if (typeof v0 === 'string') for (let r = q.r0 + 1; r <= q.r1; r++) if (typeof valoare(f, r, c0) === 'number') { antet = true; break; }
      }
      if (fmtDe(f, adr(q.r0, q.c0)).bold && !fmtDe(f, adr(q.r0 + 1, q.c0)).bold) antet = true;
      return antet;
    }
    /* sortarea pe NIVELURI (m2-l10:63; Excel real: com_r7c.json › sortare_doua_niveluri): niv = [{c, desc}], primul contează
       cel mai mult; celulele goale ajung la coadă în ambele ordini; la egalitate rândurile își păstrează ordinea */
    function sorteazaZona(f, q, antet, niv) {
      const r0 = antet ? q.r0 + 1 : q.r0, randuri = [];
      for (let r = r0; r <= q.r1; r++) {
        const o = { r, k: niv.map(n => valoare(f, r, n.c)), cel: [], fmt: [] };
        for (let c0 = q.c0; c0 <= q.c1; c0++) { o.cel.push(f.cel[adr(r, c0)]); o.fmt.push(f.fmt[adr(r, c0)]); }
        randuri.push(o);
      }
      const una = (a, b, desc) => { if (a == null || a === '') return (b == null || b === '') ? 0 : 1; if (b == null || b === '') return -1; return desc ? -compara(a, b) : compara(a, b); };
      randuri.sort((x, y) => { for (let i = 0; i < niv.length; i++) { const d = una(x.k[i], y.k[i], niv[i].desc); if (d) return d; } return 0; });
      schimba('sortare', () => {
        randuri.forEach((o, i) => o.cel.forEach((x, k) => {
          const ad = adr(r0 + i, q.c0 + k);
          /* formulele se mută ca la copiere: referințele relative se deplasează cu rândul (=A3*10 mutat din rândul 3 în 1 devine =A1*10);
             altfel formula ar arăta spre celula greșită după sortare */
          if (x && x.f && r0 + i !== o.r) f.cel[ad] = Object.assign(clona(x), { f: mutaFormula(x.f, r0 + i - o.r, 0) });
          else if (x) f.cel[ad] = x; else delete f.cel[ad];
          if (o.fmt[k]) f.fmt[ad] = o.fmt[k]; else delete f.fmt[ad];
        }));
        f.sortare = niv.map(n => ({ c: n.c, desc: !!n.desc }));
      });
    }
    /* zona din jurul selecției (Sort Warning: „Microsoft Excel found data next to your selection”) */
    function zonaLarga(f, q) {
      const z0 = zonaCurenta(f, q.r0, q.c0);
      return z0 ? { r0: Math.min(z0.r0, q.r0), c0: Math.min(z0.c0, q.c0), r1: Math.max(z0.r1, q.r1), c1: Math.max(z0.c1, q.c1) } : null;
    }
    /* o singură zonă de mai multe celule, cu date lângă ea (alte coloane) → fereastra Sort Warning (uia_excel.json › dialog.SortWarning) */
    function cereAvertizare(f) {
      if (unaSingura() || f.sel.zone.length !== 1) return null;
      const q = f.sel.zone[0];
      if (q.r1 >= MAXR - 1 || q.c1 >= MAXC - 1) return null;
      const reg = zonaLarga(f, q);
      return reg && (reg.c0 < q.c0 || reg.c1 > q.c1) ? { q: Object.assign({}, q), reg } : null;
    }
    let avertPend = null, sortPend = null;
    function sorteaza(desc) {
      const f = F(), a = f.sel.activa;
      const av = cereAvertizare(f);
      if (av) { avertPend = Object.assign(av, { buton: true, desc }); return deschideDialog('dialog.SortWarning') ? 'fereastra' : I.nesimulat(desc ? 'Sort Z to A' : 'Sort A to Z'); }
      const q = unaSingura() ? zonaCurenta(f, a.r, a.c) : f.sel.zone[0];
      if (!q) return I.nesimulat(desc ? 'Sort Z to A' : 'Sort A to Z');
      sorteazaZona(f, q, areAntet(f, q), [{ c: Math.max(q.c0, Math.min(q.c1, a.c)), desc }]);
      actualizeaza();
      return desc ? 'sortare_descrescatoare' : 'sortare_crescatoare';
    }
    /* Data › Sort: fereastra Sort pe zona curentă (sau Sort Warning întâi, ca în referință: dialog.SortWarning, deschis_prin SortDialog) */
    function dialogSortare() {
      const f = F(), a = f.sel.activa;
      const av = cereAvertizare(f);
      if (av) { avertPend = Object.assign(av, { buton: false }); return deschideDialog('dialog.SortWarning') ? 'fereastra' : I.nesimulat('Sort'); }
      const q = unaSingura() ? zonaCurenta(f, a.r, a.c) : f.sel.zone[0];
      if (!q) return I.nesimulat('Sort');
      sortPend = q;
      return deschideDialog('dialog.SortDialog') ? 'fereastra' : I.nesimulat('Sort');
    }
    const numericaCol = (f, q, antet, c0) => { let n = 0; for (let r = antet ? q.r0 + 1 : q.r0; r <= q.r1; r++) { const v = valoare(f, r, c0); if (v == null || v === '') continue; if (typeof v !== 'number') return false; n++; } return n > 0; };
    /* etichetele ordinii: „A to Z” e în referință (dialog.SortDialog › Order); celelalte din lecția m2-l10:63 și din butoanele
       panglicii (Sort Largest to Smallest) — de_verificat R7-12 */
    function ordineEt(S0, n) {
      const num = n.c != null && numericaCol(F(), S0.q, S0.antet, n.c);
      return num ? (n.desc ? 'Largest to Smallest' : 'Smallest to Largest') : (n.desc ? 'Z to A' : 'A to Z');
    }
    function numeColoana(S0, c0) {
      const t = S0.antet ? textCelula(F(), S0.q.r0, c0) : '';
      return t || 'Column ' + colNume(c0);
    }
    function bifeaza(e, on, radio) {
      if (!e) return;
      e.classList.toggle('lh-ap-bifat', on);
      e.setAttribute('aria-checked', on ? 'true' : 'false');
      const c = e.querySelector('.lh-ap-caseta');
      if (c) c.innerHTML = on ? pang.glif(radio ? 'punct' : 'bifa', 12) : '';
    }
    /* fereastra Sort: rândul „Sort Field” din referință e nivelul 0; Add Level adaugă rânduri sub el, la 22 px (DataGrid) */
    function pregatesteSort(s) {
      if (!dialog.sort) {
        const f = F(), a = f.sel.activa;
        const q = sortPend || (unaSingura() ? zonaCurenta(f, a.r, a.c) : f.sel.zone[0]) || { r0: a.r, c0: a.c, r1: a.r, c1: a.c };
        sortPend = null;
        const antet = areAntet(f, q);
        const vechi = (f.sortare || []).filter(n => n.c >= q.c0 && n.c <= q.c1);
        dialog.sort = { q, antet, niv: vechi.length ? vechi.map(n => ({ c: n.c, desc: n.desc })) : [{ c: null, desc: false }], ales: 0 };
      }
      s.classList.add('lh-ap-x-sort');
      s.querySelectorAll('[data-lh-tip="HeaderItem"]').forEach(h => { if (!h.textContent.trim()) h.innerHTML = '<span class="lh-ap-text">' + esc(h.getAttribute('data-lh-eticheta') || '') + '</span>'; });
      dialog.sort.li0 = s.querySelector('[data-lh-tip="ListItem"][data-lh-eticheta="Sort Field"]');
      bifeaza(s.querySelector('[data-lh-tip="CheckBox"][data-lh-eticheta="My data has headers"]'), dialog.sort.antet, false);
      deseneazaNiveluri();
    }
    function deseneazaNiveluri() {
      const S0 = dialog.sort, li0 = S0.li0;
      if (!li0) return;
      inchideListaSort();
      /* critic runda 8, GRAV K1: rândurile 2+ se redesenează; focusul care era pe un control al lor trece pe echivalentul
         lui din rândul nou (același nivel, aceeași casetă), ca să nu cadă din fereastră */
      const a0 = document.activeElement, r0 = a0 && dialog.el.contains(a0) ? a0.closest('.lh-ap-x-nivel-copie') : null;
      const fNiv = r0 ? r0.getAttribute('data-lh-nivel') : null, fc = r0 && a0.closest('[data-lh-camp]');
      const fCamp = fc ? fc.getAttribute('data-lh-camp') : 'coloana';
      li0.parentNode.querySelectorAll('.lh-ap-x-nivel-copie').forEach(x => x.remove());
      li0.style.display = S0.niv.length ? '' : 'none';
      const top0 = parseFloat(li0.style.top) || 22;
      S0.niv.forEach((n, i) => {
        const r = i ? li0.cloneNode(true) : li0;
        if (i) { r.classList.add('lh-ap-x-nivel-copie'); r.style.top = (top0 + 22 * i) + 'px'; li0.parentNode.appendChild(r); }
        r.setAttribute('data-lh-nivel', String(i));
        r.classList.toggle('lh-ap-x-nivel-ales', i === S0.ales);
        const et = i ? 'Then by' : 'Sort by';
        const lab = r.querySelector('[data-lh-tip="DataItem"] > [data-lh-tip="Text"]');
        if (lab) { lab.classList.add('lh-ap-x-nivel-et'); lab.innerHTML = '<span class="lh-ap-text">' + et + '</span>'; lab.style.width = 'auto'; lab.setAttribute('data-lh-eticheta', et); }
        const di = r.querySelector('[data-lh-tip="DataItem"]');
        if (di) di.setAttribute('data-lh-eticheta', et);
        const cb = [...r.querySelectorAll('[data-lh-tip="ComboBox"]')];
        const val = [n.c == null ? '' : numeColoana(S0, n.c), 'Cell Values', ordineEt(S0, n)];
        ['coloana', 'pe', 'ordine'].forEach((camp, k) => {
          const e = cb[k];
          if (!e) return;
          e.setAttribute('data-lh-camp', camp);
          /* rândurile 2+ sunt clone ale rândului „Sort by”: eticheta ȘI ținta casetei devin „Then by” (§4 „la taste: ținta
             focusului”; MINOR criticul 9: Esc pe Then by dădea camp:Sort by) */
          if (camp === 'coloana') { e.setAttribute('data-lh-eticheta', et); if (e.hasAttribute('data-lh-tinta')) e.setAttribute('data-lh-tinta', 'camp:' + et); }
          /* runda 25: „Sort On” / „Order” de pe rândul i + 1 au ținta „camp:Order#2”… (scenariul excel-sortare-doua-niveluri, pasul 7),
             ca să nu fie aceeași cu a rândului „Sort by” (ținta focusului la taste, §4) */
          else if (i && e.hasAttribute('data-lh-tinta')) e.setAttribute('data-lh-tinta', e.getAttribute('data-lh-tinta').replace(/#\d+$/, '') + '#' + (i + 1));
          const inp = e.querySelector('input');
          if (inp) inp.value = val[k];
          e.setAttribute('data-lh-valoare', val[k]);
        });
      });
      if (fNiv != null) focusNivel(+fNiv, fCamp);
    }
    function focusNivel(i, camp) {
      if (!dialog || !dialog.el || !dialog.sort) return;
      const n = Math.max(0, Math.min(dialog.sort.niv.length - 1, i));
      focusControl(dialog.el.querySelector('[data-lh-nivel="' + n + '"] [data-lh-camp="' + camp + '"]'));
    }
    function inchideListaSort() { if (dialog && dialog.sort && dialog.sort.lista) { dialog.sort.lista.el.remove(); dialog.sort.lista = null; } }
    function deschideListaSort(i, camp, cb) {
      const S0 = dialog.sort, n = S0.niv[i];
      inchideListaSort();
      let el0 = [];
      if (camp === 'coloana') for (let c0 = S0.q.c0; c0 <= S0.q.c1; c0++) el0.push({ e: numeColoana(S0, c0), c: c0 });
      else if (camp === 'ordine') { const a0 = ordineEt(S0, { c: n.c, desc: false }), d0 = ordineEt(S0, { c: n.c, desc: true }); el0 = [{ e: a0, desc: false }, { e: d0, desc: true }, { e: 'Custom List...' }]; }
      else el0 = [{ e: 'Cell Values' }];
      const R = dialog.el.getBoundingClientRect(), b = cb.getBoundingClientRect(), k = (R.width / dialog.el.offsetWidth) || 1;
      const l = el('div', 'lh-ap-x-lista-combo', { role: 'listbox', 'data-lh-tip': 'List', 'data-lh-eticheta': cb.getAttribute('data-lh-eticheta') || camp });
      Object.assign(l.style, { left: ((b.left - R.left) / k) + 'px', top: ((b.bottom - R.top) / k) + 'px', width: (b.width / k) + 'px' });
      el0.forEach(x => {
        const it = el('div', 'lh-ap-x-lista-el', { role: 'option', 'data-lh-tip': 'ListItem', 'data-lh-eticheta': x.e, 'data-lh-tinta': 'meniu:' + x.e });   // runda 25: ținta listelor, ca la celelalte liste (scenariul excel-sortare-doua-niveluri: „meniu:Clasa”)
        it.textContent = x.e;
        it.__alege = x;
        l.appendChild(it);
      });
      dialog.el.appendChild(l);
      S0.lista = { el: l, i, camp };
      return 'lista';
    }
    function clicSortare(elx, v) {
      if (dialog.baza === 'dialog.SortWarning') {
        const A = dialog.avert;
        if (!A) return null;
        if (/^(Expand the selection|Continue with the current selection)$/.test(v)) { A.extinde = v === 'Expand the selection'; radioAvertizare(); return 'alegere'; }
        if (v === 'Sort...') return sortDinAvertizare();
        return null;
      }
      const S0 = dialog.sort;
      if (!S0) return null;
      const it = elx.closest('.lh-ap-x-lista-el');
      if (it && S0.lista) {
        const x = it.__alege || {}, L0 = S0.lista, n = S0.niv[L0.i];
        inchideListaSort();
        if (L0.camp === 'coloana' && x.c != null) n.c = x.c;
        else if (L0.camp === 'ordine') { if (x.desc == null) return I.nesimulat('Custom List...'); n.desc = x.desc; }
        deseneazaNiveluri();
        focusNivel(L0.i, L0.camp);
        return 'alegere';
      }
      inchideListaSort();
      const rand = elx.closest('[data-lh-nivel]'), cb = elx.closest('[data-lh-camp]');
      if (rand) {
        S0.ales = +rand.getAttribute('data-lh-nivel');
        deseneazaNiveluri();
        const cb2 = cb && dialog.el.querySelector('[data-lh-nivel="' + S0.ales + '"] [data-lh-camp="' + cb.getAttribute('data-lh-camp') + '"]');
        if (cb2) focusControl(cb2);
        return cb2 ? deschideListaSort(S0.ales, cb2.getAttribute('data-lh-camp'), cb2) : 'alegere_nivel';
      }
      if (v === 'Add Level') { if (S0.niv.length >= 64) return 'fara_efect'; S0.niv.push({ c: null, desc: false }); S0.ales = S0.niv.length - 1; deseneazaNiveluri(); return 'nivel_nou'; }
      if (v === 'Delete Level') { if (!S0.niv.length) return 'fara_efect'; S0.niv.splice(S0.ales, 1); S0.ales = Math.max(0, Math.min(S0.ales, S0.niv.length - 1)); deseneazaNiveluri(); return 'stergere_nivel'; }
      if (v === 'Copy Level') { if (!S0.niv.length) return 'fara_efect'; S0.niv.splice(S0.ales + 1, 0, Object.assign({}, S0.niv[S0.ales])); S0.ales += 1; deseneazaNiveluri(); return 'copiere_nivel'; }
      if (v === 'My data has headers') { S0.antet = !S0.antet; bifeaza(elx.closest('[data-lh-tip="CheckBox"]') || elx, S0.antet, false); deseneazaNiveluri(); return 'bifare'; }
      return null;
    }
    /* OK în fereastra Sort: sortarea pe niveluri; un nivel fără coloană = mesajul central (fereastra de eroare nu e în referință) */
    function sortDinDialog() {
      const S0 = dialog.sort;
      if (!S0) { inchideDialog(); return I.nesimulat('Sort'); }
      /* un nivel fără coloană: fereastra de eroare peste Sort (uia_excel.json › dialog.SortDialog_eroare_nivel_gol: „All sort
         criteria must have a column or row specified…”, OK cu focusul); Sort rămâne deschisă */
      if (S0.niv.some(n => n.c == null)) return deschideDialog('dialog.SortDialog_eroare_nivel_gol', null, true) ? 'eroare_sortare' : I.nesimulat('Sort');
      inchideDialog();
      if (!S0.niv.length) return 'anulare';
      sorteazaZona(F(), S0.q, S0.antet, S0.niv);
      actualizeaza();
      return 'sortare';
    }
    function radioAvertizare() {
      const A = dialog.avert;
      bifeaza(dialog.el.querySelector('[data-lh-tip="RadioButton"][data-lh-eticheta="Expand the selection"]'), A.extinde, true);
      bifeaza(dialog.el.querySelector('[data-lh-tip="RadioButton"][data-lh-eticheta="Continue with the current selection"]'), !A.extinde, true);
    }
    function pregatesteAvertizare() {
      if (!dialog.avert) {
        const f = F(), q = Object.assign({}, f.sel.zone[0]);
        dialog.avert = avertPend || { q, reg: zonaLarga(f, q) || q, buton: false };
        avertPend = null;
        dialog.avert.extinde = true;   // „Expand the selection (Extindeți selecția), aleasă de la început” — m2-l10:149
      }
      radioAvertizare();
    }
    /* Sort... în Sort Warning: Expand = zona întreagă, rânduri întregi; Continue = doar selecția (capcana lecției m2-l10:62) */
    function sortDinAvertizare() {
      const A = dialog.avert, f = F(), a = f.sel.activa;
      inchideDialog();
      const q = A.extinde ? A.reg : A.q;
      if (!A.buton) { sortPend = q; return deschideDialog('dialog.SortDialog') ? 'fereastra' : I.nesimulat('Sort'); }
      sorteazaZona(f, q, areAntet(f, q), [{ c: Math.max(q.c0, Math.min(q.c1, a.c)), desc: A.desc }]);
      actualizeaza();
      return A.desc ? 'sortare_descrescatoare' : 'sortare_crescatoare';
    }
    /* copierea / decuparea / lipirea (excel-copiere-lipire, excel-decupare-lipire) */
    function copiaza(decupat) {
      const f = F();
      if (f.sel.zone.length > 1) return I.nesimulat(decupat ? 'Cut' : 'Copy');
      const q = Object.assign({}, f.sel.zone[0]), u = ultim(f);
      q.r1 = Math.min(q.r1, u.r); q.c1 = Math.min(q.c1, u.c);
      const cel = {}, fmt = {};
      for (let r = q.r0; r <= q.r1; r++) for (let c0 = q.c0; c0 <= q.c1; c0++) { const a = adr(r, c0); if (f.cel[a]) cel[(r - q.r0) + ',' + (c0 - q.c0)] = clona(f.cel[a]); if (f.fmt[a]) fmt[(r - q.r0) + ',' + (c0 - q.c0)] = clona(f.fmt[a]); }
      M.clip = { z: q, fi: M.fi, cel, fmt, decupat };
      deseneazaSelectia();
      try { if (navigator.clipboard && !scenariu) navigator.clipboard.writeText(celuleText(f, q)).catch(() => {}); } catch (e) { /* */ }
      return decupat ? 'decupare' : 'copiere';
    }
    const celuleText = (f, q) => { const o = []; for (let r = q.r0; r <= q.r1; r++) { const l = []; for (let c0 = q.c0; c0 <= q.c1; c0++) l.push(textCelula(f, r, c0)); o.push(l.join('\t')); } return o.join('\n'); };
    function lipeste() {
      if (!M.clip) return 'fara_efect';
      const f = F(), C = M.clip, src = M.foi[C.fi], a = f.sel.activa, q = C.z;
      const dr0 = a.r - q.r0, dc0 = a.c - q.c0, h = q.r1 - q.r0, w = q.c1 - q.c0;
      schimba('lipire', () => {
        if (C.decupat) {
          for (let r = q.r0; r <= q.r1; r++) for (let c0 = q.c0; c0 <= q.c1; c0++) { const x = adr(r, c0); delete src.cel[x]; delete src.fmt[x]; }
          /* formulele care arătau spre zona mutată o urmează (D1 =B1*2 → =B3*2) */
          M.foi.forEach(fo => Object.keys(fo.cel).forEach(x => { const o = fo.cel[x]; if (o && o.f) o.f = mutaFormula(o.f, dr0, dc0, (r, c0) => fo === src && inZona(q, r, c0)); }));
        }
        for (let r = 0; r <= h; r++) for (let c0 = 0; c0 <= w; c0++) {
          const x = adr(a.r + r, a.c + c0), o = C.cel[r + ',' + c0], fm = C.fmt[r + ',' + c0];
          if (o) { const n = clona(o); if (n.f && !C.decupat) n.f = mutaFormula(n.f, dr0, dc0); f.cel[x] = n; } else delete f.cel[x];
          if (fm) f.fmt[x] = clona(fm); else delete f.fmt[x];
        }
      });
      f.sel.zone = [{ r0: a.r, c0: a.c, r1: a.r + h, c1: a.c + w }];
      if (C.decupat) M.clip = null;
      actualizeaza();
      return 'lipire';
    }
    /* Ctrl+D / Ctrl+R (excel-ctrl-d): rândul de sus (coloana din stânga) copiat în toată zona; formulele se mută relativ */
    function umpleCu(jos0) {
      const f = F(), q0 = f.sel.zone[f.sel.zone.length - 1], q = Object.assign({}, q0);
      if (q.r0 === q.r1 && q.c0 === q.c1) { if (jos0) q.r0 = Math.max(0, q.r0 - 1); else q.c0 = Math.max(0, q.c0 - 1); }
      if (jos0 && q.r0 === q.r1) return 'fara_efect';
      if (!jos0 && q.c0 === q.c1) return 'fara_efect';
      schimba('umplere', () => {
        for (let r = q.r0; r <= q.r1; r++) for (let c0 = q.c0; c0 <= q.c1; c0++) {
          const sr = jos0 ? q.r0 : r, sc = jos0 ? c0 : q.c0;
          if (sr === r && sc === c0) continue;
          copieCelula(f, sr, sc, r, c0);
        }
      });
      actualizeaza();
      return jos0 ? 'umplere_jos' : 'umplere_dreapta';
    }
    function copieCelula(f, sr, sc, r, c0) {
      const s = f.cel[adr(sr, sc)], fm = f.fmt[adr(sr, sc)], a = adr(r, c0);
      if (s) { const n = clona(s); if (n.f) n.f = mutaFormula(n.f, r - sr, c0 - sc); f.cel[a] = n; } else delete f.cel[a];
      if (fm) f.fmt[a] = clona(fm); else delete f.fmt[a];
    }
    /* pătrățelul de umplere (excel-umplere-serie / -un-numar / -text-cu-numar / -formula) */
    function umple(r, c0) {
      const f = F(), q = f.sel.zone[f.sel.zone.length - 1];
      let dir = null, pana = 0;
      if (r > q.r1) { dir = 'jos'; pana = r; } else if (r < q.r0) { dir = 'sus'; pana = r; }
      else if (c0 > q.c1) { dir = 'dreapta'; pana = c0; } else if (c0 < q.c0) { dir = 'stanga'; pana = c0; }
      if (!dir) return 'fara_efect';
      const vert = dir === 'jos' || dir === 'sus', inv = dir === 'sus' || dir === 'stanga';
      const lin = vert ? [q.c0, q.c1] : [q.r0, q.r1];
      schimba('umplere', () => {
        for (let k = lin[0]; k <= lin[1]; k++) {
          const src = [];
          if (vert) for (let r2 = q.r0; r2 <= q.r1; r2++) src.push({ r: r2, c: k });
          else for (let c2 = q.c0; c2 <= q.c1; c2++) src.push({ r: k, c: c2 });
          if (inv) src.reverse();
          const vals = src.map(p => f.cel[adr(p.r, p.c)]);
          const numere = vals.every(x => x && !x.f && typeof x.v === 'number');
          const tn = vals.map(x => x && !x.f && typeof x.v === 'string' ? /^(.*?)(\d+)$/.exec(x.v) : null);
          let pas = 0;
          if (numere && vals.length >= 2) {
            const n = vals.length, xs = vals.map((_, i) => i), ys = vals.map(x => x.v), mx = (n - 1) / 2, my = ys.reduce((s, y) => s + y, 0) / n;
            const num0 = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0), den = xs.reduce((s, x) => s + (x - mx) * (x - mx), 0);
            pas = num0 / den;
          }
          const count = vert ? Math.abs(pana - (inv ? q.r0 : q.r1)) : Math.abs(pana - (inv ? q.c0 : q.c1));
          for (let i = 1; i <= count; i++) {
            const idx = (i - 1) % src.length, sursa = src[idx], ciclu = Math.floor((i - 1) / src.length) + 1;
            const tr = vert ? (inv ? q.r0 - i : q.r1 + i) : k, tc = vert ? k : (inv ? q.c0 - i : q.c1 + i);
            const a = adr(tr, tc), sv = vals[idx];
            if (numere && vals.length >= 2) {
              const n = vals.length, v = vals[n - 1].v + pas * i;
              f.cel[a] = { v: +v.toPrecision(15) };
              const fm = f.fmt[adr(src[idx].r, src[idx].c)]; if (fm) f.fmt[a] = clona(fm); else delete f.fmt[a];
            } else if (tn[idx] && src.length === 1) {
              const m = tn[idx], nr = +m[2] + (inv ? -i : i);
              f.cel[a] = { v: m[1] + (nr < 0 ? '' : String(nr).padStart(m[2].length, '0')) };
              const fm = f.fmt[adr(sursa.r, sursa.c)]; if (fm) f.fmt[a] = clona(fm); else delete f.fmt[a];
            } else if (tn.every(Boolean) && src.length > 1) {
              const m = tn[idx], nr = +m[2] + ciclu * src.length * (inv ? -1 : 1);
              f.cel[a] = { v: m[1] + String(nr) };
            } else copieCelula(f, sursa.r, sursa.c, tr, tc);
            void sv;
          }
        }
        const nq = Object.assign({}, q);
        if (dir === 'jos') nq.r1 = pana; else if (dir === 'sus') nq.r0 = pana; else if (dir === 'dreapta') nq.c1 = pana; else nq.c0 = pana;
        f.sel.zone[f.sel.zone.length - 1] = nq;
      });
      actualizeaza();
      return 'umplere';
    }
    function anuleaza() {
      if (M.edit) { renunta(); return 'anulare'; }
      const s = H.anuleaza(instantaneu());
      if (!s) return 'fara_efect';
      M.foi = s.foi; M.fi = s.fi; actualizeaza();
      return 'anulare';
    }
    function reface() {
      const s = H.reface(instantaneu());
      if (!s) return 'fara_efect';
      M.foi = s.foi; M.fi = s.fi; actualizeaza();
      return 'refacere';
    }
    function adaugaFoaie() {
      let k = M.foi.length + 1;
      while (M.foi.some(x => x.nume === 'Sheet' + k)) k++;
      schimba('foaie', () => { M.foi.splice(M.fi + 1, 0, foaieNoua('Sheet' + k)); M.fi += 1; });
      actualizeaza();
      return 'foaie_noua';
    }
    function alegeFoaia(nume) {
      const i = M.foi.findIndex(x => x.nume === nume);
      if (i < 0 || i === M.fi) return i < 0 ? 'fara_efect' : 'fila_foii';
      if (M.edit && !confirma()) return 'fara_efect';
      M.fi = i; M.clip = M.clip && M.clip.fi === i ? M.clip : M.clip;
      actualizeaza();
      return 'fila_foii';
    }
    /* ============================================================ foile: ștergere, mutare, copiere, culoare (runda 29, G25-1)
       Lecția viii/m1-l03:238-:244, :266, :312 (+ capturile din Excel real img/confirma-stergerea.webp, mutare-sau-copiere.webp,
       file-colorate.webp, file-dupa-copie.webp) și referința uia_excel.json › meniu_contextual.fila_foii, dialog.SheetMoveOrCopy:
       - Delete: foaia goală dispare direct (:243, :321); cu date, Excel întreabă întâi (DLG_STERGE: Delete / Cancel, :238);
         singura foaie e refuzată (DLG_REFUZ, :266). Cele două ferestre NU sunt în referință (de_verificat R29-1, R29-2);
       - ștergerea nu se anulează (:239, :312): istoricul Ctrl+Z se golește; la fel la mutare și copiere, ca instantaneele
         istoricului să nu readucă ordinea veche (contra.md; de_verificat R29-3);
       - Move or Copy: lista Before sheet = foile registrului + „(move to end)”; OK mută; Create a copy face „Nume (2)”, activă;
       - tragerea filei mută foaia, Ctrl + tragere o copiază (:240, :244); Tab Color › o culoare (:202, :220). */
    const foaieGoala = f => !Object.keys(f.cel).length && !Object.keys(f.fmt).length && !(f.merge || []).length && !Object.keys(f.bord || {}).length && !Object.keys(f.latSet || {}).length && !(f.grafice || []).length;
    function dupaFoi() {
      H = istoricNou(); M.clip = null; M.mod = true; M.salvat = false;
      if (M.gr) { M.gr = null; M.grTitlu = null; }
      invalid(); tabFoi.__sem = null; tabFoi.__nume = null; actualizeaza(); actualizeazaBare(); I.focus();
    }
    function deschideMesajFoaie(baza) {
      if (!deschideDialog(baza)) return false;
      const texte = [], butoane = [];
      dialog.el.querySelectorAll('[data-lh-tip="Text"],[data-lh-tip="Button"]').forEach(x => {
        if (x.closest('[data-lh-tip="TitleBar"]')) return;
        (x.getAttribute('data-lh-tip') === 'Button' ? butoane : texte).push(x.getAttribute('data-lh-eticheta') || '');
      });
      M.mesaj = { titlu: 'Microsoft Excel', texte, butoane };
      return true;
    }
    function stergeFoaia(i) {
      if (REG.gol || i < 0 || i >= M.foi.length) return 'fara_efect';
      if (M.edit && !confirma()) return 'fara_efect';
      inchideMeniu();
      if (M.foi.length === 1) return deschideMesajFoaie(DLG_REFUZ) ? 'refuz_stergere' : I.nesimulat('Delete');
      if (!foaieGoala(M.foi[i])) { if (!deschideMesajFoaie(DLG_STERGE)) return I.nesimulat('Delete'); dialog.foaie = i; return 'intrebare_stergere'; }
      return stergeAcum(i);
    }
    /* foaia activă după ștergere: cea din dreapta ei, iar la ultima, cea din stânga [DEDUS: de_verificat R29-3] */
    function stergeAcum(i) {
      if (dialog && dialog.baza === DLG_STERGE) inchideDialog();
      if (i == null || i < 0 || i >= M.foi.length || M.foi.length < 2) return 'fara_efect';
      M.foi.splice(i, 1);
      if (M.fi > i) M.fi -= 1; else if (M.fi === i) M.fi = Math.min(i, M.foi.length - 1);
      dupaFoi();
      return 'stergere_foaie';
    }
    /* numele copiei: „Septembrie” → „Septembrie (2)”, iar copia copiei → „Septembrie (3)” (m1-l03:244, img/file-dupa-copie.webp) */
    function numeCopie(nume) {
      const b = String(nume).replace(/ \(\d+\)$/, '');
      let k = 2;
      while (M.foi.some(x => x.nume.toLowerCase() === (b + ' (' + k + ')').toLowerCase())) k++;
      return (b.slice(0, 31 - String(k).length - 3)) + ' (' + k + ')';
    }
    /* mută (copie = false) sau copiază foaia i ÎNAINTEA poziției k din ordinea de acum (k = M.foi.length → la sfârșit); foaia
       mutată / copia devine activă (img/file-dupa-copie.webp: „copia Septembrie (2), activă”) */
    function mutaFoaia(i, k, copie) {
      if (REG.gol || i < 0 || i >= M.foi.length || k < 0 || k > M.foi.length) return 'fara_efect';
      if (M.edit && !confirma()) return 'fara_efect';
      if (copie) {
        const f = clona(M.foi[i]);
        f.nume = numeCopie(M.foi[i].nume);
        M.foi.splice(k, 0, f); M.fi = k;
        dupaFoi();
        return 'copiere_foaie';
      }
      if (k === i || k === i + 1) { if (M.fi !== i) { M.fi = i; actualizeaza(); } return 'fara_efect'; }
      const f = M.foi.splice(i, 1)[0], j = k > i ? k - 1 : k;
      M.foi.splice(j, 0, f); M.fi = j;
      dupaFoi();
      return 'mutare_foaie';
    }
    /* ---- Move or Copy (uia_excel.json › dialog.SheetMoveOrCopy): rândurile listei Before sheet = foile registrului + „(move to
       end)”, cu pasul de 24 px al referinței (ListItem [1022,583,288,24] și [1022,607,…]); pe un registru cu Sheet1 lista rămâne
       exact cea din referință. Rândul ales la deschidere = foaia activă [DEDUS: de_verificat R29-4] */
    function etichetaRand(x, n) {
      if (x.getAttribute('data-lh-eticheta') === n) return;
      [x, ...x.querySelectorAll('[data-lh-eticheta]')].forEach(y => {
        y.setAttribute('data-lh-eticheta', n);
        if (y.hasAttribute('aria-label')) y.setAttribute('aria-label', n);
        if (/^fereastra:/.test(y.getAttribute('data-lh-tinta') || '')) y.setAttribute('data-lh-tinta', 'fereastra:' + n);
      });
      /* rândul are textul lui (eticheta ListItem-ului) și, dedesubt, nodul Text al referinței: amândouă primesc numele nou */
      const sps = [...x.querySelectorAll('.lh-ap-text')];
      if (sps.length) sps.forEach(sp => { sp.textContent = n; }); else x.textContent = n;
      const t = x.querySelector('[data-lh-tip="Text"]');
      if (t) { t.style.width = 'auto'; t.style.whiteSpace = 'nowrap'; }
    }
    function randuriMutare() {
      const lst = dialog && dialog.el && dialog.el.querySelector('[data-lh-tip="List"]');
      return lst ? [...lst.children].filter(x => x.getAttribute('data-lh-tip') === 'ListItem') : [];
    }
    function pregatesteMutare(s) {
      const lst = s.querySelector('[data-lh-tip="List"]');
      const its = lst ? [...lst.children].filter(x => x.getAttribute('data-lh-tip') === 'ListItem') : [];
      if (!its.length) return;
      const nume = M.foi.map(x => x.nume).concat(['(move to end)']);
      const t0 = parseFloat(its[0].style.top) || 0, pas = its[1] ? (parseFloat(its[1].style.top) - t0) || 24 : 24;
      nume.forEach((n, i) => {
        let x = its[i];
        if (!x) { x = its[0].cloneNode(true); x.style.top = (t0 + pas * i) + 'px'; lst.appendChild(x); }
        etichetaRand(x, n);
      });
      its.slice(nume.length).forEach(x => x.remove());
      dialog.mc = { sursa: M.fi, inainte: M.fi, copie: false };
      marcheazaMutare();
    }
    function marcheazaMutare() {
      randuriMutare().forEach((x, i) => {
        const on = !!dialog.mc && i === dialog.mc.inainte;
        x.toggleAttribute('data-lh-selectat', on);
        x.style.background = on ? '#cce8ff' : '';
        x.style.outline = on ? '1px solid #000' : '';
        x.style.outlineOffset = on ? '-1px' : '';
      });
    }
    function alegeInMutare(li) {
      const i = randuriMutare().indexOf(li);
      if (i < 0 || !dialog.mc) return 'fara_efect';
      dialog.mc.inainte = i;
      marcheazaMutare();
      return 'alegere';
    }
    function aplicaMutare() {
      const mc = dialog.mc;
      inchideDialog();
      return mutaFoaia(mc.sursa, mc.inainte, mc.copie);
    }
    /* ---- Tab Color: paleta = galeria de culori a Office din referință (uia_excel.json › lista.CellFillColorPicker: Theme Colors,
       Standard Colors, More Colors…), deschisă ca submeniu lângă rândul Tab Color, cu „No Color” în loc de „No Fill” [DEDUS:
       de_verificat R29-5]. Culorile: Standard Colors = valorile din powerpoint.js › STANDARD (Green #00B050, Red #FF0000,
       Yellow #FFFF00 — aceleași ca în testele lecției m1-l03:223, :292, :308); tema Office și nuanțele Lighter / Darker =
       [presupus], ca la powerpoint.js (de_verificat R12-3) */
    const CUL_STD = { 'Dark Red': '#C00000', Red: '#FF0000', Orange: '#FFC000', Yellow: '#FFFF00', 'Light Green': '#92D050',
      Green: '#00B050', 'Light Blue': '#00B0F0', Blue: '#0070C0', 'Dark Blue': '#002060', Purple: '#7030A0' };
    const CUL_TEMA = { 'White, Background 1': '#FFFFFF', 'Black, Text 1': '#000000', 'Light Gray, Background 2': '#E7E6E6',
      'Blue-Gray, Text 2': '#44546A', 'Blue, Accent 1': '#4472C4', 'Orange, Accent 2': '#ED7D31', 'Gray, Accent 3': '#A5A5A5',
      'Gold, Accent 4': '#FFC000', 'Blue, Accent 5': '#5B9BD5', 'Green, Accent 6': '#70AD47' };
    function hexCuloare(v) {
      if (CUL_STD[v]) return CUL_STD[v];
      if (CUL_TEMA[v]) return CUL_TEMA[v];
      const m = /^(.+?),\s*(Lighter|Darker)\s+(\d+)%$/.exec(String(v || ''));
      if (!m || !CUL_TEMA[m[1]]) return null;
      const h0 = CUL_TEMA[m[1]], k = +m[3] / 100;
      return '#' + [1, 3, 5].map(j => { const c = parseInt(h0.slice(j, j + 2), 16); return Math.round(m[2] === 'Darker' ? c * (1 - k) : c + (255 - c) * k).toString(16).padStart(2, '0'); }).join('').toUpperCase();
    }
    function submeniuCuloare(rand) {
      const cheie = 'lista.CellFillColorPicker';
      if (!meniu || !SUP[cheie]) { inchideMeniu(); return I.nesimulat('Tab Color'); }
      const vechi = meniu.querySelector('[data-lh-submeniu]');
      if (vechi) vechi.remove();
      const m = desen(cheie);
      m.setAttribute('data-lh-suprafata', 'lista.TabColor');
      m.setAttribute('data-lh-submeniu', '');
      m.setAttribute('role', 'menu');
      m.classList.add('lh-ap-x-meniu', 'lh-ap-x-ref');
      m.querySelectorAll('[data-lh-eticheta="No Fill"]').forEach(x => etichetaRand(x, 'No Color'));
      m.querySelectorAll('[data-lh-eticheta="No Color"]').forEach(x => { if (x.getAttribute('data-lh-tinta') === 'meniu:No Fill') x.setAttribute('data-lh-tinta', 'meniu:No Color'); });
      m.querySelectorAll('[data-lh-tip="ListItem"]').forEach(x => {
        const h = hexCuloare(x.getAttribute('data-lh-eticheta'));
        if (!h) return;
        Object.assign(x.style, { backgroundColor: h, backgroundClip: 'content-box', padding: '5px 7px', boxSizing: 'border-box' });
        x.querySelectorAll('.lh-ap-text').forEach(sp => { sp.style.display = 'none'; });
        if (!x.hasAttribute('title')) x.setAttribute('title', x.getAttribute('data-lh-eticheta'));
      });
      const P = meniu.getBoundingClientRect(), q = rand.getBoundingClientRect(), R = root.getBoundingClientRect(), w = SUP[cheie].r[2], h = SUP[cheie].r[3];
      const st = q.right + w > R.right - 2 ? Math.max(R.left, q.left - w) : q.right, su = Math.max(R.top, Math.min(q.top, R.bottom - h - 2));
      m.style.left = (st - P.left - meniu.clientLeft) + 'px';
      m.style.top = (su - P.top - meniu.clientTop) + 'px';
      meniu.appendChild(m);
      marcheazaRand(null);
      return 'submeniu';
    }
    function coloreazaFila(v) {
      const f = F();
      if (v === 'No Color') { if (!f.culoare) return 'fara_efect'; schimba('foaie', () => { f.culoare = null; }); actualizeaza(); return 'culoare_fila'; }
      const h = hexCuloare(v);
      if (!h) return I.nesimulat(v);
      if (f.culoare === h) return 'fara_efect';
      schimba('foaie', () => { f.culoare = h; });
      actualizeaza();
      return 'culoare_fila';
    }
    /* ---- Home › Cells › Delete ▾ (SplitButton Delete › More Options, TableDeleteRowsAndColumnsMenu_Dropdown): lista NU e în
       referință (de_verificat R29-6); rândurile = cele din Excel 365 (Delete Cells…, Delete Sheet Rows, Delete Sheet Columns,
       Delete Sheet). Delete Sheet = același drum ca meniul filei; Delete Cells… = fereastra din referință; restul = mesajul central */
    const LISTA_STERGERE = ['Delete Cells...', 'Delete Sheet Rows', 'Delete Sheet Columns', 'Delete Sheet'];
    function listaStergere(anc) {
      inchideMeniu();
      const m = el('div', 'lh-ap-n lh-ap-t-Menu lh-ap-x-meniu lh-ap-x-ref', { 'data-lh-tip': 'Menu', 'data-lh-eticheta': 'Delete', 'data-lh-suprafata': 'lista.TableDeleteRowsAndColumnsMenu', role: 'menu' });
      const w = 182, hr = 28;
      LISTA_STERGERE.forEach((v, i) => {
        const x = el('div', 'lh-ap-n lh-ap-t-MenuItem', { 'data-lh-tip': 'MenuItem', 'data-lh-eticheta': v, role: 'menuitem', 'data-lh-tinta': 'meniu:' + v });
        x.innerHTML = '<span class="lh-ap-text">' + esc(v) + '</span>';
        Object.assign(x.style, { position: 'absolute', left: '2px', top: (2 + hr * i) + 'px', width: (w - 4) + 'px', height: hr + 'px', paddingLeft: '36px', boxSizing: 'border-box', display: 'flex', alignItems: 'center' });
        m.appendChild(x);
      });
      const R = root.getBoundingClientRect(), b = (anc.closest('[data-lh-tip="SplitButton"]') || anc).getBoundingClientRect(), h = 4 + hr * LISTA_STERGERE.length;
      Object.assign(m.style, { position: 'absolute', width: w + 'px', height: h + 'px' });
      m.style.left = Math.max(0, Math.min(b.left - R.left, R.width - w - 2)) + 'px';
      m.style.top = Math.max(0, Math.min(b.bottom - R.top, R.height - h - 2)) + 'px';
      root.appendChild(m);
      meniu = m;
      return 'meniu_derulant';
    }
    /* ---- tragerea filei (m1-l03:240, :244): locul = înaintea filei peste a cărei jumătate stângă e mouse-ul, altfel la sfârșit;
       în timpul tragerii, un triunghi negru arată locul; Ctrl ținut la eliberare = copie */
    function locFila(x) {
      const ts = [...tabFoi.querySelectorAll('[data-lh-tinta="fila_foii"]')];
      for (let k = 0; k < ts.length; k++) { const b = ts[k].getBoundingClientRect(); if (x < b.left + b.width / 2) return { k, x: b.left }; }
      const u = ts[ts.length - 1];
      return { k: ts.length, x: u ? u.getBoundingClientRect().right : 0 };
    }
    function marcajFila(x) {
      let mk = tabFoi.querySelector('.lh-ap-x-ff-loc');
      if (x == null) { if (mk) mk.remove(); return; }
      if (!mk) { mk = el('div', 'lh-ap-x-ff-loc', { 'aria-hidden': 'true' }); Object.assign(mk.style, { position: 'absolute', top: '0px', width: '0px', height: '0px', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #000', pointerEvents: 'none', zIndex: 3 }); tabFoi.appendChild(mk); }
      mk.style.left = (locFila(x).x - tabFoi.getBoundingClientRect().left - 5) + 'px';
    }
    /* ---- registrele (X8, m1-l03:58-59, :110): Ctrl+N / File › New › Blank workbook = BookN nou, gol, cu Sheet1; Ctrl+W / File › Close
       = închiderea registrului activ (rămâne cel din spate, altfel Excel deschis, gol). Cu modificări nesalvate Excel întreabă
       „Save your changes” — fereastra NU e în referința Excel: mesajul central standard (de_verificat R7-15) */
    const istoricNou = () => L._module.stare.istoric(() => false);
    const registruActiv = () => ({ foi: M.foi, fi: M.fi, nume: M.nume, salvat: M.salvat, mod: M.mod, H, book: BOOK, dosar: M.dosar, avertisment: M.avertisment });
    function incarcaRegistru(r) { M.foi = r.foi; M.fi = r.fi; M.nume = r.nume; M.salvat = r.salvat; M.mod = r.mod; H = r.H; BOOK = r.book; M.clip = null; M.dosar = r.dosar || null; M.avertisment = r.avertisment || null; }
    function dupaRegistru() { if (backstage) inchideBackstage(); arataGol(); tabFoi.__sem = null; tabFoi.__nume = null; actualizeaza(); actualizeazaBare(); I.focus(); }
    function registruNou() {
      if (M.edit && !confirma()) return 'fara_efect';
      inchideMeniu();
      if (dialog) inchideDialog();
      if (!REG.gol) REG.alte.push(registruActiv());
      REG.nr += 1;
      const tab = ((Z.file_foi || {}).c || []).find(x => x.t === 'TabItem');
      incarcaRegistru({ foi: [foaieNoua(tab ? tab.e : 'Sheet1')], fi: 0, nume: null, salvat: false, mod: false, H: istoricNou(), book: 'Book' + REG.nr });
      REG.gol = false;
      dupaRegistru();
      return 'registru_nou';
    }
    /* registrul modificat: Excel întreabă „Save your changes to this file?” (uia_excel.json ›
       dialog.save_your_changes_to_this_file; scenarii_real/excel-ctrl-w-modificat.json: dialog {titlu '', intrebare,
       butoane [More options…, Save, Don't Save, Cancel]}, registru_activ Book1 — registrul rămâne deschis cât întreabă).
       Același drum pentru Ctrl+W și File › Close (în Chrome Ctrl+W nu ajunge la pagină). */
    function inchideRegistru() {
      if (REG.gol) return 'fara_efect';
      if (M.edit && !confirma()) return 'fara_efect';
      if (M.mod) { inchideMeniu(); if (backstage) inchideBackstage(); return deschideDialog(INTREBARE_INCHIDERE) ? 'intrebare_salvare' : I.nesimulat('Close (Ctrl+W)'); }
      return inchideRegistruAcum('inchidere_registru');
    }
    function inchideRegistruAcum(actiune) {
      inchideMeniu();
      if (dialog) inchideDialog();
      if (REG.alte.length) incarcaRegistru(REG.alte.pop());
      else { REG.gol = true; incarcaRegistru({ foi: [foaieNoua('Sheet1')], fi: 0, nume: null, salvat: false, mod: false, H: istoricNou(), book: BOOK }); }
      dupaRegistru();
      return actiune;
    }
    /* răspunsul la „Save your changes to this file?”: Cancel / ✕ = registrul rămâne (acoperire_r7.fapte.b_ctrl_w_modificat:
       registre_dupa_cancel 1); Don't Save = se închide nesalvat; Save = salvat cu numele din caseta File name a ACESTEI
       ferestre (fereastra are caseta ei, v „Book1”, cu focusul: uia_excel.json), apoi închis — ca word.js (Save → salvat,
       apoi închis). More options… și Choose a Location ▾: efectul nu e în referință → mesajul central */
    function raspunsInchidere(v) {
      if (v === 'Cancel' || v === 'Închidere') { inchideDialog(); return 'anulare'; }
      if (v === "Don't Save") { inchideDialog(); return inchideRegistruAcum('inchidere_fara_salvare'); }
      if (v === 'Save') return salveazaDinDialog(() => inchideRegistruAcum('salvare_si_inchidere'));
      if (v === 'Open') return I.nesimulat('Choose a Location ▾');
      return I.nesimulat(v);
    }
    /* Excel fără registru: zona documentului goală, gri, fără celule (aspectul NU e în referință — de_verificat R7-16) */
    function arataGol() { golEl.style.display = REG.gol ? '' : 'none'; }
    /* ---- redenumirea foii (m1-l03:285: „dublu clic pe filă, scrii, Enter”; și clic dreapta › Rename): caseta stă pe filă,
       textul NU ajunge în celulă; Enter / clic în altă parte = numele nou, Esc = renunți */
    let redenumire = null;
    function pornesteRedenumire(nume) {
      const i = M.foi.findIndex(x => x.nume === nume);
      if (i < 0) return 'fara_efect';
      if (M.edit && !confirma()) return 'fara_efect';
      if (redenumire) terminaRedenumire(true);
      if (i !== M.fi) { M.fi = i; actualizeaza(); }
      foileFile();
      const t = [...tabFoi.querySelectorAll('[data-lh-tinta="fila_foii"]')].find(x => x.getAttribute('data-lh-id') === nume);
      if (!t) return 'fara_efect';
      const inp = el('input', 'lh-ap-x-ff-in', { 'data-lh-tip': 'Edit', 'aria-label': nume, spellcheck: 'false', autocomplete: 'off', maxlength: '31' });
      inp.value = nume;
      t.appendChild(inp);
      redenumire = { i, inp, vechi: nume };
      inp.addEventListener('blur', () => { if (redenumire && redenumire.inp === inp) terminaRedenumire(true); });
      try { inp.focus({ preventScroll: true }); inp.select(); } catch (e) { /* */ }
      return 'redenumire';
    }
    function terminaRedenumire(ok) {
      const R0 = redenumire;
      if (!R0) return;
      redenumire = null;
      const v = String(R0.inp.value || '').trim();
      R0.inp.remove();
      const luat = M.foi.some((x, k) => k !== R0.i && x.nume.toLowerCase() === v.toLowerCase());
      const bun = v && v.length <= 31 && !/[\\/?*[\]:]/.test(v) && !/^'|'$/.test(v) && !luat;
      if (ok && bun && v !== R0.vechi && M.foi[R0.i]) { M.foi[R0.i].nume = v; M.mod = true; M.salvat = false; }
      tabFoi.__sem = null; tabFoi.__nume = null;
      foileFile();
      /* runda 29 (stare_finala_erori): numele altei foi → mesajul Excel; fila nu se redenumește, iar după OK revine în redenumire */
      if (ok && v && luat && M.foi[R0.i] && deschideMesajFoaie(DLG_NUME)) { dialog.redenumire = { nume: M.foi[R0.i].nume, text: v }; return 'nume_existent'; }
      I.focus();
      return ok ? 'redenumire_foaie' : 'anulare';
    }
    function reiaRedenumire(rd) {
      if (pornesteRedenumire(rd.nume) !== 'redenumire' || !redenumire) return;
      redenumire.inp.value = rd.text;
      try { redenumire.inp.select(); } catch (e) { /* */ }
    }

    /* ============================================================ meniuri, ferestre, Backstage */
    function stratNou(cls) { const s = el('div', 'lh-ap-strat ' + (cls || '')); root.appendChild(s); return s; }
    function inchideMeniu() { if (meniu) { meniu.remove(); meniu = null; } }
    function meniuContextual(cheie, x, y) {
      inchideMeniu();
      if (!SUP[cheie]) return null;
      const m = desen(cheie);
      const R = root.getBoundingClientRect(), w = SUP[cheie].r[2], h = SUP[cheie].r[3];
      const l = Math.max(0, Math.min(x - R.left + 1, R.width - w - 2)), t = Math.max(0, Math.min(y - R.top + 1, R.height - h - 2));
      m.style.left = l + 'px'; m.style.top = t + 'px';
      m.classList.add('lh-ap-x-meniu');
      root.appendChild(m);
      meniu = m;
      return 'meniu_contextual';
    }
    /* ---- o listă ▾ a panglicii desenată din referință (uia_excel.json › lista.<…>: lista.AutoSum, lista.Borders), sub
       butonul ei: lista.AutoSum [1048,106.4] sub SplitButton AutoSum [1053,83,48,24] → 5 px la stânga, lipită dedesubt */
    function listaRef(cheie, anc) {
      inchideMeniu();
      if (!SUP[cheie]) return null;
      const m = desen(cheie);
      const R = root.getBoundingClientRect(), b = (anc.closest('[data-lh-tip="SplitButton"]') || anc).getBoundingClientRect();
      const w = SUP[cheie].r[2], h = SUP[cheie].r[3];
      m.setAttribute('data-lh-suprafata', cheie);
      m.setAttribute('role', 'menu');
      m.classList.add('lh-ap-x-meniu', 'lh-ap-x-ref');
      if (cheie === 'lista.Borders') m.classList.add('lh-ap-x-meniu-borduri');
      /* listele rundei 17 (Line, Add Chart Element): locul față de butonul lor e cel din referință (lista.ChartTypeLineInsertGallery
         [599,133] sub butonul [599,109,40,24]; lista.AddChartElementMenu [21,159] sub butonul [21,83,59,76]); celelalte ca înainte */
      const an = (anc.closest('[data-lh-tip="SplitButton"]') || anc).__nod, nou = LISTE_R17.has(cheie) && an && an.r;
      const dx = nou ? SUP[cheie].r[0] - an.r[0] : -5, dy = nou ? SUP[cheie].r[1] - (an.r[1] + an.r[3]) : 0;
      m.style.left = Math.max(0, Math.min(b.left - R.left + dx, R.width - w - 2)) + 'px';
      m.style.top = Math.max(0, Math.min(b.bottom - R.top + dy, R.height - h - 2)) + 'px';
      root.appendChild(m);
      meniu = m;
      return 'meniu_derulant';
    }
    const LISTE_R17 = new Set(['lista.ChartTypeLineInsertGallery', 'lista.AddChartElementMenu']);
    /* Add Chart Element › Data Labels ▸ (X10, runda 17): submeniul stă ÎN lista-părinte (închiderea, clicul în afară și tastele
       le iau pe amândouă), lângă rândul Data Labels, cu lista tipului de grafic ales (GR_ETICHETE). Referința: submeniul
       [159,245,204,…] lângă rândul [23,245,136,28] → stânga = marginea dreaptă a rândului, sus = sus-ul rândului */
    function submeniuEtichete(rand) {
      const g = M.gr && grafice()[M.gr.i], cheie = g && GR_ETICHETE[g.tip];
      if (!meniu || !cheie || !SUP[cheie]) { inchideMeniu(); return I.nesimulat('Data Labels'); }
      const vechi = meniu.querySelector('[data-lh-submeniu]');
      if (vechi) vechi.remove();
      const m = desen(cheie);
      m.setAttribute('data-lh-suprafata', cheie);
      m.setAttribute('data-lh-submeniu', '');
      m.setAttribute('role', 'menu');
      m.classList.add('lh-ap-x-meniu', 'lh-ap-x-ref');
      const P = meniu.getBoundingClientRect(), q = rand.getBoundingClientRect(), R = root.getBoundingClientRect(), w = SUP[cheie].r[2], h = SUP[cheie].r[3];
      const st = Math.min(q.right, R.right - w - 2), su = Math.max(R.top, Math.min(q.top, R.bottom - h - 2));
      m.style.left = (st - P.left - meniu.clientLeft) + 'px';
      m.style.top = (su - P.top - meniu.clientTop) + 'px';
      meniu.appendChild(m);
      marcheazaRand(null);
      return 'submeniu';
    }
    const subMeniu = () => (meniu ? meniu.querySelector('[data-lh-submeniu]') : null);
    /* etichetele de date ale graficului ales (stare: etichete_date; uia_excel.json › acoperire_r14.fapte.y_data_labels_line:
       Right pe toate seriile, ShowValue; z_data_labels_coloana: Outside End). None = fără etichete. */
    function puneEtichete(v) {
      const i = M.gr ? M.gr.i : -1;
      if (!grafice()[i]) return 'indisponibil';
      const nou = v === 'None' ? null : v;
      if ((grafice()[i].etichete || null) !== nou) schimba('grafic', () => { grafice()[i].etichete = nou; });
      M.gr.parte = 'grafic';
      deseneazaGrafice();
      return 'etichete_date';
    }
    /* ---- tastele cu un meniu sau o listă deschisă (critic runda 7, GRAV K3). Regula Office pentru meniuri (support.microsoft.com
       „Keyboard shortcuts in Excel”, aceeași ca în word.js › tastaLista): ↓/↑ mută alegerea, Enter apasă rândul ales, Esc
       închide; litera de acces a rândului (uia_excel.json › meniu_contextual.* / lista.*: AccessKey, ultima literă a șirului
       „Alt, H, U, A”) îl apasă. Orice altă tastă e fără efect: nu ajunge în foaia din spate. Enter / litera emit evenimentul
       cu ținta rândului și `activat` = rândul (§4), ca asistentul să vadă același pas ca la clic. */
    function randuriMeniu() {
      if (!meniu) return [];
      /* cu submeniul Data Labels deschis, tastele merg în el (regula meniurilor: ultimul nivel deschis) */
      const sub = subMeniu();
      return [...(sub || meniu).querySelectorAll('[data-lh-tip="MenuItem"][data-lh-tinta],[data-lh-tip="ListItem"][data-lh-tinta]')]
        .filter(x => (sub || !x.closest('[data-lh-submeniu]')) && L._vizibil(x) && !(x.__nod && x.__nod.a === 0) && x.getAttribute('aria-disabled') !== 'true');
    }
    function marcheazaRand(x) {
      if (!meniu) return;
      meniu.querySelectorAll('.lh-ap-ales').forEach(y => y.classList.remove('lh-ap-ales'));
      if (x) x.classList.add('lh-ap-ales');
      meniu.__ales = x || null;
    }
    /* rândurile galeriei Data Labels au AccessKey „ALT+R”, „ALT+N”… (uia_excel.json › lista.AddChartElementMenu#Data Labels):
       în meniul deschis litera se apasă fără Alt (citirea rundei 17, diferente.md) */
    const literaRand = x => { const s0 = String((x.__nod && x.__nod.ta) || '').trim(), am = /^ALT\+(\S)$/i.exec(s0); if (am) return am[1].toUpperCase(); const ta = s0.split(',').pop().replace(/\s+/g, ''); return ta.length === 1 ? ta.toUpperCase() : null; };
    function apasaRand(x) {
      const t = L._canon(x);
      I.activat = t;
      I.tintaTasta = t;
      return I.la.clic(t, { target: x, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, button: 0, preventDefault() {} }, 1, 'tasta');
    }
    function tastaMeniu(e, g) {
      const k = e.key, rs = randuriMeniu();
      e.preventDefault();
      /* submeniul Data Labels: Esc / ← îl închid și lasă lista-părinte; → pe rândul Data Labels îl deschide */
      const sub = subMeniu();
      if (sub && (k === 'Escape' || k === 'ArrowLeft')) { sub.remove(); const dl = [...meniu.querySelectorAll('[data-lh-tip="MenuItem"]')].find(x => x.getAttribute('data-lh-eticheta') === 'Data Labels'); marcheazaRand(dl || null); if (dl) I.tintaTasta = L._canon(dl); return 'inchidere_meniu'; }
      if (!sub && k === 'ArrowRight' && meniu.__ales && meniu.__ales.getAttribute('data-lh-eticheta') === 'Data Labels' && meniu.getAttribute('data-lh-suprafata') === 'lista.AddChartElementMenu') { I.tintaTasta = L._canon(meniu.__ales); return submeniuEtichete(meniu.__ales); }
      if (k === 'Escape') { inchideMeniu(); I.focus(); return 'inchidere_meniu'; }
      if ((k === 'ArrowDown' || k === 'ArrowUp') && !e.altKey) {
        const i = rs.indexOf(meniu.__ales);
        marcheazaRand(rs[k === 'ArrowDown' ? Math.min(rs.length - 1, i + 1) : Math.max(0, i - 1)]);
        if (meniu.__ales) I.tintaTasta = L._canon(meniu.__ales);
        return 'mutare_in_meniu';
      }
      if (k === 'Enter' || k === ' ') {
        const x = meniu.__ales;
        if (!x) { inchideMeniu(); I.focus(); return 'inchidere_meniu'; }
        return apasaRand(x);
      }
      if (g === 'tastare' && !e.ctrlKey && !e.metaKey && /^[a-z0-9]$/i.test(k)) {
        const x = rs.find(r => literaRand(r) === k.toUpperCase());
        if (x) return apasaRand(x);
      }
      return 'fara_efect';
    }
    function focusStrat() {
      const s = dialog ? dialog.el : backstage ? backstage.strat : null;
      if (!s) { I.focus(); return; }
      if (s.contains(document.activeElement)) return;
      if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '-1');
      try { s.focus({ preventScroll: true }); } catch (e) { /* */ }
    }
    /* o fereastră deschisă PESTE alta (eroarea „All sort criteria…” peste Sort) o ține minte în `sub`; închiderea ei o readuce */
    function inchideDialog() {
      if (!dialog) return;
      if (/^dialog\.eroare_formula/.test(dialog.baza) || MESAJ_FOAIE[dialog.baza]) M.mesaj = null;
      /* după „That name is already taken” (OK, ✕, Enter sau Esc) fila revine în redenumire, cu textul tastat ales [DEDUS: R29-7] */
      const rd = dialog.baza === DLG_NUME ? dialog.redenumire : null;
      if (rd) setTimeout(() => { if (!dialog && !redenumire) reiaRedenumire(rd); }, 0);
      /* critic runda 8, GRAV E4: după „We found a typo…” închisă fără Yes (No / Esc / Închidere), celula trece în modul Edit
         (uia_excel.json › acoperire_r7.fapte.e_sum_lipit.mod_dupa_inchidere „Cell Mode Edit”): săgețile mută cursorul în
         formulă. Celelalte două ferestre de eroare rămân cum erau (de_verificat R8-14). */
      const edit = dialog.baza === 'dialog.eroare_formula' && M.edit;
      if (edit) { M.edit.mod = 'Edit'; M.edit.punct = false; M.edit.pk = null; M.edit.ales = null; }
      const sub = dialog.sub || null; dialog.strat.remove(); dialog = sub; focusStrat();
      if (edit) deseneazaSelectia();
    }
    function deschideDialog(baza, fila, peste) {
      const info = date.dialoguri[baza];
      if (!info) return false;
      inchideMeniu();
      const sub = peste && dialog ? dialog : null;
      if (dialog && !sub) inchideDialog();
      dialog = { baza, strat: stratNou('lh-ap-strat-dialog'), fila: null, sub };
      arataFilaDialog(fila || null);
      return true;
    }
    function arataFilaDialog(fila) {
      const info = date.dialoguri[dialog.baza];
      const k = (info.file.find(x => x.fila === fila) || info.file[0]).s;
      dialog.fila = fila;
      dialog.strat.innerHTML = '';
      const s = desen(k);
      s.setAttribute('data-lh-suprafata', dialog.baza);
      const r = SUP[k].r, R = root.getBoundingClientRect();
      s.style.position = 'absolute';
      s.style.left = Math.max(0, Math.min(r[0], R.width - r[2])) + 'px';
      s.style.top = Math.max(0, Math.min(r[1], R.height - r[3])) + 'px';
      dialog.strat.appendChild(s);
      dialog.el = s;
      s.querySelectorAll('[data-lh-tip="TabItem"]').forEach((t, i) => { const on = fila ? t.getAttribute('data-lh-eticheta') === fila : i === 0; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.classList.toggle('activ', on); });
      if (dialog.baza === 'dialog.SortDialog') pregatesteSort(s);
      if (dialog.baza === 'dialog.SortWarning') pregatesteAvertizare(s);
      if (dialog.baza === 'dialog.ChartChangeType') pregatesteTipGrafic(s);
      if (dialog.baza === 'dialog.SheetMoveOrCopy') pregatesteMutare(s);
      if (MESAJ_FOAIE[dialog.baza]) {
        /* img/confirma-stergerea.webp: titlul „Microsoft Excel” verde, mare; mesajul pe rânduri (\n) */
        s.querySelectorAll('[data-lh-tip="Image"][data-lh-eticheta="Warning Icon"]').forEach(x => { x.innerHTML = SVG_AVERT; });
        s.querySelectorAll('[data-lh-tip="Text"]').forEach((x, i) => {
          [x, ...x.querySelectorAll('.lh-ap-text')].forEach(y => { y.style.whiteSpace = 'pre-line'; y.style.overflow = 'visible'; y.style.textOverflow = 'clip'; });
          if (i === 0) Object.assign(x.style, { color: '#107c41', fontSize: '20px', fontWeight: '600', lineHeight: '28px' });
        });
        /* pe telefon (rădăcina mai îngustă decât fereastra, ex. 375 < 456 px) fereastra se micșorează întreagă, ca Delete /
           Cancel să rămână pe ecran (proba/telefon.py: Cancel ieșea la x 350-429) */
        if (R.width && R.width < r[2] + 4) { s.style.transformOrigin = '0 0'; s.style.transform = 'scale(' + ((R.width - 4) / r[2]).toFixed(3) + ')'; s.style.left = '2px'; }
      }
      const lc = s.querySelector('[data-lh-tinta="camp:latime_coloana"] input');
      if (lc) {
        const c0 = F().sel.zone[F().sel.zone.length - 1].c0;
        lc.value = String(Math.round(caractereDin(latPx(F(), c0)) * 100) / 100).replace('.', ',');
        setTimeout(() => { try { lc.focus({ preventScroll: true }); lc.select(); } catch (e) { /* */ } }, 0);
        return;
      }
      const arb = dialog.baza === 'dialog.FileSaveAs' && s.querySelector('[data-lh-tip="Tree"][data-lh-eticheta="Panou de navigare"]');
      if (arb) {
        /* panoul din stânga: fereastra Save As e fereastra comună Windows (#32770 și în uia_excel.json, și în uia_word.json); în
           referința Excel rândurile sunt „[element de listă, nesalvat]”, deci numele implicite Windows 11 vin din uia_word.json ›
           lista.FileSaveAs_navigare (Acasă, Galerie, Acest PC, Rețea), plus Documente, folderul lecției m1-l03:58 („alege
           Documente”), în ordinea din word.js (NAV_IMPLICIT). Locul rândurilor (24 px) e cel din Word — de_verificat R7-17 */
        const lat = Math.max(60, Math.min(200, (parseFloat(arb.style.width) || 234) - 24));
        ['Acasă', 'Galerie', 'Documente', 'Acest PC', 'Rețea'].forEach((nume, i) => {
          const x = el('div', 'lh-ap-n lh-ap-t-TreeItem lh-ap-nav-rand', { 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': nume, role: 'treeitem', 'data-lh-tinta': 'arbore:' + nume });
          Object.assign(x.style, { left: '4px', top: (6 + 24 * i) + 'px', width: lat + 'px', height: '22px' });
          x.innerHTML = '<span class="lh-ap-text">' + esc(nume) + '</span>';
          arb.appendChild(x);
        });
        if (dialog.folder == null) dialog.folder = M.folder || null;
        marcheazaFolder();
      }
      const nf = s.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      /* Save As propune numele CU extensia; „Save this file” / „Save your changes” FĂRĂ (uia_excel.json › Edit File name v „Book1”) */
      if (nf) { nf.value = dialog.baza === SALVARE_NOUA || dialog.baza === INTREBARE_INCHIDERE ? numeRegistru() : (M.nume ? M.nume : BOOK + '.xlsx'); setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0); }
      else { s.setAttribute('tabindex', '-1'); if (!focusInitial(s)) setTimeout(() => { if (dialog && dialog.el === s) focusStrat(); }, 0); }
    }
    function marcheazaFolder() {
      if (!dialog || !dialog.el) return;
      dialog.el.querySelectorAll('.lh-ap-nav-rand').forEach(x => { const on = x.getAttribute('data-lh-eticheta') === dialog.folder; x.toggleAttribute('data-lh-selectat', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
    }
    /* Save din „Save this file” / „Save your changes”: scrie în magazie (fisiere.js); dacă numele există, întâi
       „Confirm Save As”. dupaExtra (ex. închiderea registrului) rulează după salvare; returnează acțiunea. */
    function salveazaDinDialog(dupaExtra) {
      const x = dialog && dialog.el.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      const v = String(x ? x.value : '').trim().replace(/[\\/:*?"<>|]/g, '');
      if (!v) return 'fara_efect';
      const nume = /\.[a-z0-9]{2,5}$/i.test(v) ? v : v + '.xlsx';
      const dosar = (dialog && dialog.folder) || M.dosar || 'Documente';
      let fin = null;
      const dupa = () => { inchideDialog(); if (dupaExtra) fin = dupaExtra(); };
      const r = scrieSalvare(dosar, nume, 'xlsx', dupa);
      if (r === 'indisponibil') return I.nesimulat('Save');
      return r === 'salvare' ? (fin || 'salvare') : r;
    }
    /* lățimea în caractere, cum o arată fereastra Column Width (64 px = 8,11: uia_excel.json › dialog.ColumnWidth › Edit) */
    const caractereDin = px => Math.max(0, (px - 5.33) / 7.234);
    const pxDinCaractere = n => Math.round(n * 7.234 + 5.33);
    function latimeDinDialog() {
      const x = dialog && dialog.el.querySelector('[data-lh-tinta="camp:latime_coloana"] input');
      const n = parseFloat(String(x ? x.value : '').trim().replace(',', '.'));
      if (!isFinite(n) || n < 0 || n > 255) return 'fara_efect';
      const f = F(), cols = new Set();
      f.sel.zone.forEach(q => { for (let c0 = q.c0; c0 <= Math.min(q.c1, NC - 1); c0++) cols.add(c0); });
      inchideDialog();
      schimba('format', () => cols.forEach(c0 => { f.lat[c0] = n === 0 ? 0 : pxDinCaractere(n); f.latSet[c0] = true; }));
      actualizeaza();
      return 'latime_coloana';
    }
    /* ---- tastatura în ferestre (critic runda 7, GRAV K1 + K2) ----
       Focusul la deschidere, din referință: Sort → OK (uia_excel.json › acoperire_r7.fapte.d_sort.focus_la_deschidere);
       ferestrele de eroare → Yes / OK și „Save this file” / „Save your changes” → File name (uia_excel.json › suprafete.<cheie>.focus).
       Tab / Shift+Tab: prin controalele ferestrei, în ordinea arborelui UIA din referință (fără bara de titlu; un grup de butoane
       radio = o singură oprire, pe cel ales); ordinea Tab a Excel-ului real NU e capturată separat (contra.md). Enter = butonul cu
       focusul, altfel butonul implicit (OK / Save / Sort... / Yes); Space = controlul cu focusul; ↑/↓ mută alegerea într-un
       grup radio; Alt+↓ deschide lista casetei din Sort (ComboBox › Open „Alt+Down Arrow”), ↑/↓ o parcurg, Enter alege, Esc o
       închide. Enter / Space trec prin ACELAȘI drum ca clicul și pun `activat` = ținta butonului (§4), iar ținta evenimentului
       = focusul din momentul tastei (cârligul I.tintaTasta din aplicatii.js). */
    const FOCUS0 = { 'dialog.SortDialog': 'OK', 'dialog.SortDialog_eroare_nivel_gol': 'OK', 'dialog.eroare_formula': 'Yes',
      'dialog.eroare_formula_2': 'OK', 'dialog.eroare_formula_3': 'OK', 'dialog.sterge_foaia': 'Delete', 'dialog.foaie_unica': 'OK',
      'dialog.nume_foaie_existent': 'OK' };
    const IMPLICIT = ['OK', 'Save', 'Sort...', 'Yes', 'Insert'];
    const esteButon = x => !!x && /^(Button|CheckBox|RadioButton)$/.test(x.getAttribute('data-lh-tip') || '');
    function controaleDialog() {
      if (!dialog || !dialog.el) return [];
      return [...dialog.el.querySelectorAll('[data-lh-tip]')].filter(x => {
        const t = x.getAttribute('data-lh-tip');
        if (!/^(Button|CheckBox|RadioButton|ComboBox|Edit|TabItem)$/.test(t) || x.closest('[data-lh-tip="TitleBar"]') || !L._vizibil(x)) return false;
        if (x.__nod && x.__nod.a === 0) return false;
        const p = x.parentElement && x.parentElement.closest('[data-lh-tip="ComboBox"]');
        if (p && dialog.el.contains(p)) return false;
        if (t === 'Button' && !x.getAttribute('data-lh-eticheta')) return false;
        if (t === 'RadioButton') {
          const fr = [...x.parentElement.children].filter(y => y.getAttribute('data-lh-tip') === 'RadioButton');
          const ales = fr.find(y => y.getAttribute('aria-checked') === 'true');
          if (ales && ales !== x) return false;
          if (!ales && fr[0] !== x) return false;
        }
        return true;
      });
    }
    function focusControl(x) {
      if (!x) return;
      const t = x.querySelector('input:not([readonly])') || x;
      if (t === x && !x.hasAttribute('tabindex')) x.setAttribute('tabindex', '-1');
      try { t.focus({ preventScroll: true }); if (t.tagName === 'INPUT' && t.select) t.select(); } catch (z) { /* */ }
    }
    function focusInitial(s0) {
      const et = FOCUS0[dialog.baza];
      const x = et && [...s0.querySelectorAll('[data-lh-tip="Button"]')].find(b => b.getAttribute('data-lh-eticheta') === et && !b.closest('[data-lh-tip="TitleBar"]'));
      if (x) { setTimeout(() => { if (dialog && dialog.el === s0) focusControl(x); }, 0); return true; }
      return false;
    }
    function tabDialog(inapoi) {
      const cs = controaleDialog();
      if (!cs.length) return 'fara_efect';
      const a = document.activeElement;
      let i = cs.findIndex(x => x === a || x.contains(a));
      i = i < 0 ? (inapoi ? cs.length - 1 : 0) : (i + (inapoi ? -1 : 1) + cs.length) % cs.length;
      focusControl(cs[i]);
      return 'mutare_focus';
    }
    function butonImplicit() {
      const bs = [...dialog.el.querySelectorAll('[data-lh-tip="Button"]')].filter(x => !x.closest('[data-lh-tip="TitleBar"]') && L._vizibil(x) && x.closest('[data-lh-tinta]'));
      for (const n of IMPLICIT) { const b = bs.find(x => x.getAttribute('data-lh-eticheta') === n); if (b) return b; }
      return null;
    }
    const evFals = x => ({ target: x, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, button: 0, preventDefault() {} });
    function apasaInDialog(x) {
      const t = L._canon(x.closest('[data-lh-tinta]') || x);
      I.activat = t;
      return I.la.clic(t, evFals(x), 1, 'tasta') || 'fara_efect';
    }
    function tastaDialog(e, g, inCamp) {
      const k = e.key, a = document.activeElement;
      const fx = a && dialog.el && dialog.el.contains(a) ? a : null;
      const ctl = fx && fx.closest('[data-lh-tip]');
      if (fx && !inCamp) I.tintaTasta = L._tintaDin(I, fx);
      /* lista deschisă a unei casete din Sort */
      const LS = dialog.sort && dialog.sort.lista;
      if (LS) {
        const its = [...LS.el.querySelectorAll('.lh-ap-x-lista-el')];
        let i = its.findIndex(x => x.classList.contains('lh-ap-ales'));
        if (k === 'ArrowDown' || k === 'ArrowUp') {
          e.preventDefault();
          i = k === 'ArrowDown' ? Math.min(its.length - 1, i + 1) : Math.max(0, i - 1);
          its.forEach((x, j) => x.classList.toggle('lh-ap-ales', j === i));
          return 'mutare_in_lista';
        }
        if (k === 'Enter') { e.preventDefault(); if (its[i]) { I.activat = L._canon(its[i].closest('[data-lh-tinta]') || its[i]); return I.la.clic(I.activat, evFals(its[i]), 1, 'tasta') || 'alegere'; } inchideListaSort(); return 'inchidere_meniu'; }
        if (k === 'Escape') { e.preventDefault(); inchideListaSort(); return 'inchidere_meniu'; }
      }
      if (k === 'Escape') { inchideDialog(); return 'anulare'; }
      if (k === 'Tab') { e.preventDefault(); return tabDialog(e.shiftKey); }
      if (k === 'Enter' || (k === ' ' && esteButon(ctl))) {
        e.preventDefault();
        /* critic runda 8, GRAV E2: Enter apasă butonul cu focusul doar dacă e buton de apăsat (push button); pe o casetă de
           bifat sau un buton radio apasă butonul implicit (§4 `activat`: ENTER = „IDOK or control identifier of the default
           push button”). Space comută în continuare caseta / alege butonul radio. */
        const b = (k === 'Enter' ? !!ctl && ctl.getAttribute('data-lh-tip') === 'Button' : esteButon(ctl)) ? ctl : butonImplicit();
        return b ? apasaInDialog(b) : implicitDialog();
      }
      if (/^Arrow/.test(k)) {
        if (e.altKey && (k === 'ArrowDown' || k === 'ArrowUp') && ctl && ctl.getAttribute('data-lh-tip') === 'ComboBox' && dialog.sort && ctl.closest('[data-lh-nivel]')) {
          e.preventDefault();
          const niv = +ctl.closest('[data-lh-nivel]').getAttribute('data-lh-nivel');
          dialog.sort.ales = niv;
          return deschideListaSort(niv, ctl.getAttribute('data-lh-camp'), ctl);
        }
        if (ctl && ctl.getAttribute('data-lh-tip') === 'RadioButton') {
          e.preventDefault();
          const fr = [...ctl.parentElement.children].filter(y => y.getAttribute('data-lh-tip') === 'RadioButton');
          const j = fr.indexOf(ctl) + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : -1);
          const x = fr[Math.max(0, Math.min(fr.length - 1, j))];
          const r = I.la.clic(L._canon(x.closest('[data-lh-tinta]') || x), evFals(x), 1, 'tasta');
          focusControl(x);
          return r || 'alegere';
        }
        return inCamp ? null : 'fara_efect';
      }
      return inCamp ? null : 'fara_efect';
    }
    /* răspunsul la o fereastră de eroare a formulei: OK / Închidere / No = înapoi în editare, cu formula neschimbată
       (excel-separator-virgula / excel-autocompletare-tab: ramane_in_editare true); Yes = corectura primită, ca la Enter
       (ce face No și unde merge celula după Yes: de_verificat RUNDA8 R8-1) */
    function raspunsEroare(v) {
      const corectat = dialog && dialog.corectat;
      inchideDialog();
      if (v !== 'Yes' || !corectat || !M.edit) { deseneazaSelectia(); return 'anulare'; }
      const a = pa(M.edit.a);
      M.edit.text = corectat; M.edit.poz = corectat.length; M.edit.pk = null;
      if (!confirma()) { deseneazaSelectia(); return 'formula_neprimita'; }
      alege(a.r + 1, a.c);
      return 'confirmare';
    }
    function implicitDialog() {
      if (!dialog) return null;
      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveazaDinDialog();
      if (dialog.baza === INTREBARE_INCHIDERE) return raspunsInchidere('Save');
      if (dialog.baza === 'dialog.ColumnWidth') return latimeDinDialog();
      if (dialog.baza === 'dialog.SortDialog') return sortDinDialog();
      if (dialog.baza === 'dialog.SortWarning') return sortDinAvertizare();
      if (/^dialog\.eroare_formula/.test(dialog.baza)) return raspunsEroare(dialog.baza === 'dialog.eroare_formula' ? 'Yes' : 'OK');
      if (dialog.baza === 'dialog.SortDialog_eroare_nivel_gol') { inchideDialog(); return 'inchidere'; }
      if (dialog.baza === 'dialog.ChartChangeType') return aplicaTipGrafic();
      if (dialog.baza === 'dialog.SheetMoveOrCopy' && dialog.mc) return aplicaMutare();
      if (dialog.baza === DLG_STERGE) return stergeAcum(dialog.foaie);
      if (dialog.baza === DLG_REFUZ || dialog.baza === DLG_NUME) { inchideDialog(); return 'inchidere'; }
      const b = dialog.baza.replace(/^dialog\./, '');
      inchideDialog();
      return I.nesimulat((date.dialoguri['dialog.' + b] || {}).titlu || b);
    }
    function inchideBackstage() { if (!backstage) return; backstage.strat.remove(); backstage = null; I.focus(); }
    function deschideBackstage(pagina) {
      inchideMeniu();
      if (M.edit && !confirma()) return 'fara_efect';
      if (!backstage) {
        const s = stratNou('lh-ap-strat-backstage');
        const inner = el('div', 'lh-ap-backstage-in');
        s.appendChild(inner);
        backstage = { strat: s, inner, pagina: null };
        if (SUP['backstage.cadru']) { const c0 = desen('backstage.cadru'); pozitie(c0, SUP['backstage.cadru'].r); c0.classList.add('lh-ap-cadru'); inner.appendChild(c0); }
        const nav = desen('backstage.nav');
        pozitie(nav, SUP['backstage.nav'].r);
        inner.appendChild(nav);
        backstage.nav = nav;
        s.setAttribute('tabindex', '-1');
      }
      arataPaginaBackstage(pagina || 'Home');
      focusStrat();
      return 'backstage';
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
      backstage.nav.querySelectorAll('[data-lh-tip="ListItem"]').forEach(x => x.classList.toggle('activ', x.getAttribute('data-lh-eticheta') === pagina));
      return true;
    }
    /* Ctrl+S / Save din Acces rapid pe un registru nesalvat: fereastra „Save this file” (uia_excel.json ›
       acoperire_r7.fapte.a_ctrl_s_registru_nou: cheie dialog.save_this_file, backstage null, focus în File name); F12: fereastra
       Save As (dialog.FileSaveAs) */
    function salveaza() {
      if (M.edit && !confirma()) return 'fara_efect';
      if (M.nume) { fixeaza(M.dosar || 'Documente', M.nume, /\.csv$/i.test(M.nume) ? 'csv' : 'xlsx'); return 'salvare'; }
      if (backstage) inchideBackstage();
      if (deschideDialog(SALVARE_NOUA)) return 'salvare_ca';
      deschideBackstage('Save As');
      return 'pagina_backstage';
    }

    /* ---- fișiere (fisiere.js): magazia, Save As / Save / Open ---- */
    function FIS() { return (L._module && L._module.fisiere) || null; }
    function magazie() { if (!magaz) { const F0 = FIS(); if (F0) magaz = F0.nou(); } return magaz; }
    /* ce scrie fiecare tip: xlsx = foile (ca obiect); csv = foaia ACTIVĂ, doar valorile (formula → rezultatul ei); pdf = foaia
       activă din domeniul folosit, un rând pe linie (text, nu grilă) */
    function continutPentru(tip) {
      if (tip === 'xlsx') return clona({ foi: M.foi, fi: M.fi });
      const F0 = F(), u = ultim(F0), rows = [];
      const sv = (r, c0) => { try { return txt(valoare(F0, r, c0)); } catch (e) { return e && e.e ? e.e : '#VALUE!'; } };
      for (let r = 0; r <= u.r; r++) { const row = []; for (let c0 = 0; c0 <= u.c; c0++) row.push(sv(r, c0)); rows.push(row); }
      if (tip === 'csv') return FIS().csvDinGrila(rows);
      return FIS().pdfDinLinii(rows.map(row => row.join('  ')), M.nume || F0.nume);
    }
    /* scrie în magazie și pune registrul în starea „salvat”. CSV: doar foaia activă, redenumită după fișier (ca în Excel);
       PDF: registrul rămâne cel de dinainte (numele nu se schimbă) */
    function fixeaza(dosar, nume, tip) {
      const FS = magazie();
      if (FS) FS.salveaza(dosar, nume, tip, continutPentru(tip));
      if (tip === 'pdf') return 'salvare_pdf';
      if (tip === 'csv') { const f = clona(F()); f.nume = nume.replace(/\.csv$/i, ''); M.foi = [f]; M.fi = 0; M.avertisment = 'POSSIBLE DATA LOSS'; }
      else M.avertisment = null;
      M.nume = nume; M.dosar = dosar; M.salvat = true; M.mod = false;
      if (backstage) inchideBackstage();
      actualizeaza();
      actualizeazaBare();
      return 'salvare';
    }
    /* numele existent → „Confirm Save As” [Yes][No]; Yes scrie, No lasă fereastra de salvare deschisă */
    function scrieSalvare(dosar, nume, tip, dupa) {
      const F0 = FIS(), FS = magazie();
      if (!F0 || !FS) return 'indisponibil';
      if (FS.exista(dosar, nume)) {
        F0.confirma(root, { titlu: 'Confirm Save As', text: F0.MESAJ.inlocuire(nume), ro: F0.MESAJ.inlocuireRo, butoane: ['Yes', 'No'],
          dupa: r => { if (r === 'Yes') { fixeaza(dosar, nume, tip); if (dupa) dupa(); } } });
        return 'confirmare';
      }
      fixeaza(dosar, nume, tip);
      if (dupa) dupa();
      return 'salvare';
    }
    /* Save As (F12, backstage › Save As › Browse): fereastra din fisiere.js; nimic altceva decât alegerea elevului scrie */
    function deschideSalvareCa() {
      const F0 = FIS(), FS = magazie();
      if (!F0 || !FS) return false;
      inchideMeniu();
      F0.salvareCa(root, {
        magazie: FS, dosar: M.dosar || 'Documente', nume: M.nume || (BOOK + '.xlsx'), tip: 'xlsx',
        nrFoi: () => M.foi.length,
        salveaza: (dosar, nume, tip) => { fixeaza(dosar, nume, tip); },
        nesimulat: v => I.nesimulat(v),
        inchis: () => I.focus()
      });
      return true;
    }
    /* Open (backstage › Open › Browse): fișierul ales devine registrul activ; registrul deschis până acum rămâne în spate */
    function deschideDeschidere() {
      const F0 = FIS(), FS = magazie();
      if (!F0 || !FS) return false;
      inchideMeniu();
      F0.deschidere(root, {
        magazie: FS, dosar: M.dosar || 'Documente', nesimulat: v => I.nesimulat(v),
        deschis: (dosar, e) => deschisDinMagazie(dosar, e), inchis: () => I.focus()
      });
      return true;
    }
    function deschisDinMagazie(dosar, e) {
      const F0 = FIS();
      let foi, fi;
      if (e.tip === 'xlsx') {
        const c = clona(e.cont);
        if (!c || !Array.isArray(c.foi) || !c.foi.length) return false;
        foi = c.foi; fi = Math.min(c.fi || 0, c.foi.length - 1);
      } else if (e.tip === 'csv') {
        const f = foaieNoua(e.n.replace(/\.csv$/i, ''));
        F0.citesteCsv(e.cont).forEach((row, r) => row.forEach((s, c0) => {
          if (s === '') return;
          f.cel[adr(r, c0)] = { v: /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : s };
        }));
        foi = [f]; fi = 0;
      } else {
        /* PDF: Excel îl deschide ca text brut; primul rând (%PDF-…) apare în A1 (lecția m1-l03, „Open”) */
        const f = foaieNoua(e.n.replace(/\.pdf$/i, ''));
        f.cel.A1 = { v: String(e.cont || '').split('\n')[0] };
        foi = [f]; fi = 0;
      }
      if (!REG.gol) REG.alte.push(registruActiv());
      REG.gol = false;
      incarcaRegistru({ foi, fi, nume: e.n, salvat: true, mod: false, H: istoricNou(), book: e.n.replace(/\.[a-z0-9]{2,5}$/i, ''), dosar, avertisment: null });
      dupaRegistru();
      return true;
    }

    /* ============================================================ comenzile panglicii (după idMso) */
    const LANSATOR_FILA = LANSATOR;
    function apasa(elx, tinta) {
      const id = elx.getAttribute('data-lh-id-mso') || (elx.closest('[data-lh-id-mso]') || { getAttribute: () => null }).getAttribute('data-lh-id-mso');
      const n = elx.__nod || {}, nume = String(n.e || tinta.replace(/^.*\//, ''));
      if (elx.getAttribute('aria-disabled') === 'true' || (elx.closest('[aria-disabled="true"]') && root.contains(elx.closest('[aria-disabled="true"]')))) return 'indisponibil';
      if (M.edit && !/^(AutoSum)$/.test(id || '') && !confirma()) return 'fara_efect';
      if (M.grTitlu != null) { M.grTitlu = null; actualizeazaBare(); }
      if (REG.gol) return 'indisponibil';
      switch (id) {
        case 'Bold': return comutaFormat('bold');
        case 'Italic': return comutaFormat('italic');
        case 'Underline': return comutaFormat('underline');
        case 'AlignLeft': return aliniaza('stanga');
        case 'AlignCenter': return aliniaza('centru');
        case 'AlignRight': return aliniaza('dreapta');
        case 'MergeCenter': return imbina();
        case 'AutoSum': return M.edit ? 'fara_efect' : autoSum();
        case 'SortAscendingExcel': return sorteaza(false);
        case 'SortDescendingExcel': return sorteaza(true);
        case 'SortDialog': return dialogSortare();
        case 'Copy': return copiaza(false);
        case 'Cut': return copiaza(true);
        case 'Paste': return lipeste();
        case 'FileSave': return salveaza();
        case 'Undo': return anuleaza();
        case 'Redo': return reface();
        case 'CellFillColorPicker': return umpleCuloare('FFFF00');
        case 'BordersGallery_Dropdown': return SUP['lista.Borders'] ? listaRef('lista.Borders', elx) : meniuBorduri(elx);
        case 'TableDeleteRowsAndColumnsMenu_Dropdown': return listaStergere(elx);
        case 'AutoSumMenu_Dropdown': return listaRef('lista.AutoSum', elx) || I.nesimulat('AutoSum');
        case 'ChartTypeColumnInsertGallery': return listaRef('lista.ChartTypeColumnInsertGallery', elx) || I.nesimulat(nume);
        case 'ChartTypeLineInsertGallery': return listaRef('lista.ChartTypeLineInsertGallery', elx) || I.nesimulat(nume);
        case 'AddChartElementMenu': return M.gr ? (listaRef('lista.AddChartElementMenu', elx) || I.nesimulat(nume)) : 'indisponibil';
        case 'ChartChangeType': return M.gr ? dialogTipGrafic() : 'indisponibil';
        case 'ChartSwitchRowColumn': return M.gr ? comutaRandColoana() : 'indisponibil';
        case 'PercentStyle': return procent();
        case 'WrapText': return incadreaza();
      }
      if (id && BORD_EFECT.has(id)) return borduri(id);
      /* mesajul central numește comanda cum o vede elevul (MINOR critic 6): săgeata „More Options” poartă numele butonului ei */
      if (/^More Options$/.test(nume)) { const sp = elx.closest('[data-lh-tip="SplitButton"]'); if (sp && sp.getAttribute('data-lh-eticheta')) return I.nesimulat(sp.getAttribute('data-lh-eticheta')); }
      if (id && id in LANSATOR_FILA) return LANSATOR_FILA[id] ? (deschideDialog('dialog.FormatCellsDialog', LANSATOR_FILA[id] === 'Number' ? null : LANSATOR_FILA[id]) ? 'fereastra' : I.nesimulat(nume)) : I.nesimulat(nume);
      if (id && date.lansatoare[id]) return deschideDialog(date.lansatoare[id]) ? 'fereastra' : I.nesimulat(nume);
      return I.nesimulat(nume);
    }

    /* ============================================================ graficele (critic runda 8, GRAV X10; lecția m2-l11)
       Referința: uia_excel.json › lista.ChartTypeColumnInsertGallery (lista ▾ a lui Insert › Insert Column or Bar Chart),
       acoperire_r7.fapte.h_grafic (după Clustered Column: filele „… Help, Chart Design, Format”, Chart Design aleasă cu
       „Style 1”, grafice_pe_foaie 1, grafic_activ), panglica_context.Ctx_ChartDesign / Ctx_Format, dialog.ChartChangeType
       (+ #All Charts). Desenul e SIMPLU (bare / linii / felii din date, titlu, axe, legendă): referința nu dă pixelii
       graficului, deci nu se pretinde fidelitate de pixel acolo (diferente.md, runda 9). Simulate: Clustered Column,
       Clustered Bar (din listă), Line și Pie (din Change Chart Type); celelalte rânduri = mesajul central (R12).
       Graficul stă în foaie (f.grafice), deci Ctrl+Z îl ia cu instantaneul; valorile se citesc din celule la fiecare desen
       (graficul e legat de tabel, m2-l11). Geometria e în px la 100 %. */
    function dateGrafic(g) {
      const f = F(), q = zonaDin(g.zona) || { r0: 0, c0: 0, r1: 0, c1: 0 };
      const v = (r, c0) => valoare(f, r, c0), gol = x => x == null || x === '', nr = x => typeof x === 'number';
      const colt = v(q.r0, q.c0);
      /* numele: antetul (rândul de sus) și prima coloană intră ca nume doar dacă sunt TEXT (m2-l11: „Drept nume ia doar textul”;
         colțul gol le face nume oricum — capcana anilor) */
      const antet = q.r1 > q.r0 && gNum(q.c0 + 1, q.c1 - q.c0).concat(gol(colt) ? [] : [q.c0]).every(c => !nr(v(q.r0, c))) && gNum(q.c0, q.c1 - q.c0 + 1).some(c => typeof v(q.r0, c) === 'string' && v(q.r0, c) !== '');
      const cat = q.c1 > q.c0 && (gol(colt) || gNum(q.r0 + (antet ? 1 : 0), q.r1 - q.r0 + (antet ? 0 : 1)).every(r => !nr(v(r, q.c0))));
      const r0 = q.r0 + (antet ? 1 : 0), c0 = q.c0 + (cat ? 1 : 0), nR = q.r1 - r0 + 1, nC = q.c1 - c0 + 1;
      const val = (r, c) => { const x = v(r, c); return nr(x) ? x : gol(x) ? null : 0; };
      const numeCol = k => antet ? textCelula(f, q.r0, c0 + k) : '';
      const numeRand = k => cat ? textCelula(f, r0 + k, q.c0) : '';
      /* seriile: pe coloane dacă valorile ocupă mai multe rânduri decât coloane, altfel (și la egalitate) pe rânduri (m2-l11) */
      let peCol = nR > nC;
      if (g.comutat) peCol = !peCol;
      const o = peCol
        ? { serii: gNum(0, nC).map(k => numeCol(k) || 'Series' + (k + 1)), categorii: gNum(0, nR).map(k => cat ? numeRand(k) : String(k + 1)), valori: gNum(0, nC).map(k => gNum(0, nR).map(j => val(r0 + j, c0 + k))), dinAntet: antet }
        : { serii: gNum(0, nR).map(k => numeRand(k) || 'Series' + (k + 1)), categorii: gNum(0, nC).map(k => antet ? numeCol(k) : String(k + 1)), valori: gNum(0, nR).map(k => gNum(0, nC).map(j => val(r0 + k, c0 + j))), dinAntet: cat };
      o.tip = GR_TIP[g.tip] || 'col';
      if (o.tip === 'pie') { o.serii = o.serii.slice(0, 1); o.valori = o.valori.slice(0, 1); }
      o.legenda = o.tip === 'pie' ? o.categorii.slice() : (o.serii.length > 1 ? o.serii.slice() : []);
      o.et = g.etichete || null;
      return o;
    }
    /* eticheta de date a unui punct (X10, runda 17): valoarea, cu virgula zecimală (ca bara de stare, „Average 7,5”), în SVG,
       cu data-lh-eticheta-date = seria. Locul după numele din Add Chart Element › Data Labels (Right = în dreapta punctului…);
       un nume care nu e în lista tipului (de_verificat R17-3, după Change Chart Type) se desenează ca primul loc al listei
       tipului, dar starea păstrează numele ales */
    function gEticheta(x, y, val, serie, loc, k) {
      const t = String(Math.round(val * 1e6) / 1e6).replace('.', ',');
      const L0 = { Right: [6, 4, 'start'], Left: [-6, 4, 'end'], Above: [0, -8, 'middle'], Below: [0, 16, 'middle'], Center: [0, 4, 'middle'], 'Data Callout': [0, -10, 'middle'],
        'Outside End': [0, -4, 'middle'], 'Inside End': [0, 14, 'middle'], 'Inside Base': [0, -4, 'middle'] }[loc] || [0, -4, 'middle'];
      return '<text data-lh-eticheta-date="' + esc(serie) + '" x="' + (x + L0[0] * k).toFixed(1) + '" y="' + (y + L0[1] * k).toFixed(1) + '" text-anchor="' + L0[2] + '" font-size="' + (12 * k).toFixed(1) + '" fill="#404040">' + esc(t) + '</text>';
    }
    function titluGrafic(g, d) {
      if (g.faraTitlu) return null;
      if (g.titlu != null) return g.titlu;
      return d.serii.length === 1 && d.dinAntet ? d.serii[0] : 'Chart Title';
    }
    /* axa valorilor (MINOR criticul 9). Excel real prin COM (runde/9/critic_probe/com_r9.json › axa): CARTI max 9 → 0–10 din 1;
       după B4 = 20 → 0–25 din 5; LUNI max 25 → 0–30 din 5. Regula potrivită pe aceste 3 cazuri: deasupra maximului (sub minimul
       negativ) se lasă 5 % din interval, apoi pasul = cel mai mic dintre 1, 2, 5, 10 × 10^k cu cel mult 10 diviziuni
       (alte cazuri = de_verificat R10-4) */
    function scaraGrafic(min, max) {
      if (max <= min) max = min + 1;
      const d = max - min, sus = max > 0 ? max + 0.05 * d : max, jos = min < 0 ? min - 0.05 * d : min;
      const p0 = Math.pow(10, Math.floor(Math.log10((sus - jos) / 10)));
      let pas = p0;
      for (const m of [1, 2, 5, 10]) { pas = m * p0; if ((sus - jos) / pas <= 10 + 1e-9) break; }
      return { min: Math.floor(jos / pas + 1e-9) * pas, max: Math.ceil(sus / pas - 1e-9) * pas, pas };
    }
    const gTxt = (x, y, s, cls, anc, k) => '<text class="' + cls + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '" font-size="' + (12 * k).toFixed(1) + '" fill="#595959">' + esc(String(s)) + '</text>';
    function desenAxe(d, P, k) {
      const toate = [].concat(...d.valori).filter(x => x != null), sc = scaraGrafic(Math.min(0, ...toate), Math.max(0, ...toate));
      const et = []; for (let x = sc.min; x <= sc.max + sc.pas / 2; x += sc.pas) et.push(Math.round(x * 1e6) / 1e6);
      const lat = Math.max(...et.map(x => String(x).length)) * 7 * k + 10 * k, bar = d.tip === 'bar';
      const latCat = bar ? Math.max(...d.categorii.map(x => String(x).length), 1) * 6.5 * k + 10 * k : 0;
      const A = { x: P.x + (bar ? latCat : lat), y: P.y, w: P.w - (bar ? latCat : lat) - 12 * k, h: P.h - 20 * k };
      const nc = Math.max(1, d.categorii.length), ns = Math.max(1, d.serii.length);
      const poz = x => (x - sc.min) / (sc.max - sc.min);
      let s = '';
      et.forEach(x => {
        if (bar) { const px = A.x + poz(x) * A.w; s += '<line x1="' + px + '" y1="' + A.y + '" x2="' + px + '" y2="' + (A.y + A.h) + '" stroke="#d9d9d9"/>' + gTxt(px, A.y + A.h + 14 * k, x, 'lh-ap-x-gr-val', 'middle', k); }
        else { const py = A.y + A.h - poz(x) * A.h; s += '<line x1="' + A.x + '" y1="' + py + '" x2="' + (A.x + A.w) + '" y2="' + py + '" stroke="#d9d9d9"/>' + gTxt(A.x - 6 * k, py + 4 * k, x, 'lh-ap-x-gr-val', 'end', k); }
      });
      const band = (bar ? A.h : A.w) / nc, bw = band / (ns + 2.19), zero = poz(0);
      d.categorii.forEach((c, j) => {
        /* la bare, prima categorie e JOS (m2-l11: „Primul nume, Ana, e jos”) */
        if (bar) s += gTxt(A.x - 6 * k, A.y + A.h - band * (j + 0.5) + 4 * k, c, 'lh-ap-x-gr-cat', 'end', k);
        else s += gTxt(A.x + band * (j + 0.5), A.y + A.h + 14 * k, c, 'lh-ap-x-gr-cat', 'middle', k);
      });
      d.valori.forEach((serie, i) => {
        const cul = GR_CUL[i % GR_CUL.length];
        if (d.tip === 'line') {
          const pts = serie.map((x, j) => x == null ? null : [A.x + band * (j + 0.5), A.y + A.h - poz(x) * A.h]);
          s += '<polyline class="lh-ap-x-gr-linie" fill="none" stroke="' + cul + '" stroke-width="' + (3 * k).toFixed(1) + '" stroke-linejoin="round" points="' + pts.filter(Boolean).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '"/>';
          pts.forEach((p, j) => { if (p) s += '<circle data-lh-valoare="' + serie[j] + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="0.1" fill="none"/>'; });
          if (d.et) pts.forEach((p, j) => { if (p) s += gEticheta(p[0], p[1], serie[j], d.serii[i], d.et, k); });
          return;
        }
        serie.forEach((x, j) => {
          if (x == null) return;
          const a = Math.min(zero, poz(x)), b = Math.abs(poz(x) - zero), o = band * j + (band - ns * bw) / 2 + i * bw;
          const r = bar ? [A.x + a * A.w, A.y + A.h - o - bw, b * A.w, bw] : [A.x + o, A.y + A.h - (a + b) * A.h, bw, b * A.h];
          s += '<rect class="lh-ap-x-gr-bara" data-lh-valoare="' + x + '" x="' + r[0].toFixed(1) + '" y="' + r[1].toFixed(1) + '" width="' + Math.max(0, r[2]).toFixed(1) + '" height="' + Math.max(0, r[3]).toFixed(1) + '" fill="' + cul + '"/>';
          if (d.et) {
            /* coloane: capătul = vârful coloanei (Outside End deasupra, Inside End sub vârf, Inside Base la bază, Center la mijloc);
               bare (fără referință): în dreapta capătului */
            if (bar) s += gEticheta(r[0] + r[2], r[1] + r[3] / 2, x, d.serii[i], 'Right', k);
            else { const cx = r[0] + r[2] / 2, varf = x >= 0 ? r[1] : r[1] + r[3], baza = x >= 0 ? r[1] + r[3] : r[1];
              s += gEticheta(cx, d.et === 'Inside Base' ? baza : d.et === 'Center' ? r[1] + r[3] / 2 : varf, x, d.serii[i], d.et === 'Inside Base' || d.et === 'Center' || d.et === 'Inside End' || d.et === 'Outside End' ? d.et : 'Outside End', k); }
          }
        });
      });
      s += bar ? '<line x1="' + (A.x + zero * A.w) + '" y1="' + A.y + '" x2="' + (A.x + zero * A.w) + '" y2="' + (A.y + A.h) + '" stroke="#bfbfbf"/>'
        : '<line x1="' + A.x + '" y1="' + (A.y + A.h - zero * A.h) + '" x2="' + (A.x + A.w) + '" y2="' + (A.y + A.h - zero * A.h) + '" stroke="#bfbfbf"/>';
      return s;
    }
    function desenPlacinta(d, P, k) {
      const vals = (d.valori[0] || []).map(x => Math.max(0, x || 0)), tot = vals.reduce((a, b) => a + b, 0);
      const cx = P.x + P.w / 2, cy = P.y + P.h / 2, r = Math.max(4, Math.min(P.w, P.h) / 2 - 4 * k);
      let s = '', u = -Math.PI / 2;
      vals.forEach((x, j) => {
        const f = tot ? x / tot : 0, u2 = u + f * 2 * Math.PI, cul = GR_CUL[j % GR_CUL.length];
        const pt = a => (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
        const dd = f >= 0.9999 ? 'M ' + pt(u) + ' A ' + r + ' ' + r + ' 0 1 1 ' + pt(u + Math.PI) + ' A ' + r + ' ' + r + ' 0 1 1 ' + pt(u) + ' Z'
          : 'M ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' L ' + pt(u) + ' A ' + r + ' ' + r + ' 0 ' + (f > 0.5 ? 1 : 0) + ' 1 ' + pt(u2) + ' Z';
        s += '<path class="lh-ap-x-gr-felie" data-lh-valoare="' + x + '" d="' + dd + '" fill="' + cul + '" stroke="#fff" stroke-width="1"/>';
        if (d.et) { const um = (u + u2) / 2; s += gEticheta(cx + r * 0.6 * Math.cos(um), cy + r * 0.6 * Math.sin(um), x, d.serii[0] || '', 'Center', k); }
        u = u2;
      });
      return s;
    }
    function desenGrafic(g, i) {
      const d = dateGrafic(g), k = kg(), W = g.w * k, Hh = g.h * k, ales = !!(M.gr && M.gr.i === i);
      const box = el('div', 'lh-ap-x-grafic' + (ales ? ' lh-ap-x-gr-ales' : ''), { 'data-lh-tinta': 'grafic', 'data-lh-id': String(i + 1), 'aria-label': 'Chart ' + (i + 1) });
      /* critic runda 10, GRAV A1: pe telefon atingerea pornită pe grafic e a graficului (mutare / mărire, ca tragerea unui obiect în
         Excel), nu derularea paginii: fără touch-action:none, browserul o preia ca derulare după ~15 px (pointercancel) */
      Object.assign(box.style, { left: (g.x * z() - OX) + 'px', top: (g.y * z() - OY) + 'px', width: W + 'px', height: Hh + 'px', touchAction: 'none' });
      /* runda 21: în fereastra de la A1048576 / XFD7 un grafic ancorat departe nu se vede (și nu primește poziții de milioane de px);
         pe grila normală, la fel doar un grafic pus în fereastră (la milioane de px), ca să nu lungească derularea grilei */
      const gl = g.x * z() - OX, gs = g.y * z() - OY, dep = OX || OY ? 2000 : 1e6;
      if (gl + W < -dep || gs + Hh < -dep || gl > PX[NC] + dep || gs > PY[NR] + dep) box.style.display = 'none';
      const t = titluGrafic(g, d);
      let sus = 10 * k;
      if (t != null) {
        const te = el('div', 'lh-ap-x-gr-titlu' + (ales && M.gr.parte === 'titlu' ? ' lh-ap-x-gr-titlu-ales' : ''), { 'data-lh-tinta': 'grafic:' + (i + 1) + '/titlu' });
        te.textContent = t; te.style.fontSize = (18.67 * k) + 'px'; te.style.top = (6 * k) + 'px';
        box.appendChild(te);
        sus = 42 * k;
      }
      const josLeg = d.legenda.length ? 26 * k : 6 * k;
      const P = { x: 8 * k, y: sus, w: W - 16 * k, h: Math.max(10, Hh - sus - josLeg) };
      /* desenul și legenda nu sunt ținte (un clic pe ele alege graficul): fără evenimente proprii, atingerea pornește pe cutia
         graficului, care rămâne aceeași în timpul tragerii (mutaGrafic o actualizează pe loc) */
      box.insertAdjacentHTML('beforeend', '<svg class="lh-ap-x-gr-svg" aria-hidden="true" style="pointer-events:none" width="' + W + '" height="' + Hh + '">' + (d.tip === 'pie' ? desenPlacinta(d, P, k) : desenAxe(d, P, k)) + '</svg>');
      if (d.legenda.length) {
        const lg = el('div', 'lh-ap-x-gr-leg');
        lg.style.pointerEvents = 'none';
        lg.style.bottom = (6 * k) + 'px'; lg.style.fontSize = (12 * k) + 'px';
        d.legenda.forEach((n, j) => { const x = el('span', 'lh-ap-x-gr-leg-el'), m = el('i', d.tip === 'line' ? 'lh-ap-x-gr-leg-linie' : ''), tx = el('span', 'lh-ap-x-gr-leg-text'); m.style.background = GR_CUL[j % GR_CUL.length]; tx.textContent = n; x.append(m, tx); lg.appendChild(x); });
        box.appendChild(lg);
      }
      if (ales && M.gr.parte === 'grafic') {
        [['ss', 0, 0], ['sm', 0.5, 0], ['sd', 1, 0], ['ms', 0, 0.5], ['md', 1, 0.5], ['js', 0, 1], ['jm', 0.5, 1], ['jd', 1, 1]].forEach(([c, fx, fy]) => {
          const m = el('div', 'lh-ap-x-gr-maner', { 'data-lh-tinta': 'grafic:' + (i + 1) + '/maner', 'data-lh-colt': c });
          m.style.left = (fx * W) + 'px'; m.style.top = (fy * Hh) + 'px';
          box.appendChild(m);
        });
      }
      return box;
    }
    function deseneazaGrafice(faraBare) {
      corpIn.querySelectorAll('.lh-ap-x-grafic').forEach(x => x.remove());
      if (M.gr && !grafice()[M.gr.i]) { M.gr = null; M.grTitlu = null; }
      grafice().forEach((g, i) => corpIn.appendChild(desenGrafic(g, i)));
      contextGrafic();
      if (!faraBare) actualizeazaBare();
    }
    /* filele contextuale Chart Design / Format cât e ales un grafic (date/excel.json › context.grafic); fără grafic ales, o filă
       contextuală aleasă lasă locul lui Home (ca word.js › actualizeaza; de_verificat R9-2) */
    function contextGrafic() {
      const ctx = M.gr ? 'grafic' : null;
      if (ctx === contextActiv) return;
      contextActiv = ctx;
      if (!ctx && /^Ctx_/.test(filaActiva)) filaActiva = 'TabHome';
      deseneazaFile();
      deseneazaPanglica();
    }
    function deselecteazaGrafic() { if (!M.gr) return; M.gr = null; M.grTitlu = null; deseneazaGrafice(); }
    function insereazaGrafic(tip) {
      if (M.edit && !confirma()) return 'fara_efect';
      if (M.gr && grafice()[M.gr.i]) {
        /* cu graficul ales, butonul altui tip îi schimbă tipul, nu face încă un grafic (m2-l11; de_verificat R9-3) */
        const i = M.gr.i;
        if (grafice()[i].tip !== tip) schimba('grafic', () => { grafice()[i].tip = tip; });
        M.gr.parte = 'grafic';
        deseneazaGrafice();
        return 'schimbare_tip_grafic';
      }
      const f = F(), q0 = f.sel.zone[f.sel.zone.length - 1], u = ultim(f);
      let q = q0.r0 === q0.r1 && q0.c0 === q0.c1 ? (zonaCurenta(f, q0.r0, q0.c0) || q0) : q0;
      q = { r0: q.r0, c0: q.c0, r1: Math.max(q.r0, Math.min(q.r1, u.r)), c1: Math.max(q.c0, Math.min(q.c1, u.c)) };
      /* locul (Excel real, runde/10/probe/com_r10_b.json + com_r10_c.json, 9 mărimi de fereastră; com_r9 › carti): graficul nou
         stă în mijlocul zonei vizibile a grilei, puțin spre stânga-sus, oricare ar fi tabelul: left = (UsableWidth − 360)/2 −
         10,2 pt, top = (UsableHeight − 216)/2 − 7,2 pt, cel puțin 0 (fereastră mai îngustă / mai joasă decât graficul = lipit
         de marginea stângă / de sus a zonei vizibile, iar restul iese în dreapta / jos, cu grila derulabilă); mărimea rămâne
         360 × 216 pt = 480 × 288 px (Ctx_Format 12,7 × 7,62 cm). În px pe ecran: pt × 4/3 × zoomul graficului. Raportarea la
         derulare: de_verificat R10-1 */
      const kz = kg(), lx = Math.max(0, (corp.clientWidth - 480 * kz) / 2 - 13.6 * kz), ty = Math.max(0, (corp.clientHeight - 288 * kz) / 2 - 9.6 * kz);
      const x = (corp.scrollLeft + OX + lx) / z(), y = (corp.scrollTop + OY + ty) / z();
      schimba('grafic', () => { grafice().push({ tip, zona: zonaText(q), x, y, w: 480, h: 288 }); });
      M.gr = { i: grafice().length - 1, parte: 'grafic' }; M.grTitlu = null;
      deseneazaGrafice();
      activeazaFila('Ctx_ChartDesign');
      return 'inserare_grafic';
    }
    function comutaRandColoana() {
      const i = M.gr.i;
      schimba('grafic', () => { const g = grafice()[i]; g.comutat = !g.comutat; });
      deseneazaGrafice();
      return 'comutare_rand_coloana';
    }
    /* Change Chart Type (dialog.ChartChangeType, deschisă pe All Charts): stânga = familiile din referință, dreapta = subtipurile
       familiei alese, numele subtipului ales și previzualizarea. Line / Pie: referința nu are rândul lor de subtipuri, deci
       se scrie doar numele (de_verificat R9-5) */
    function pictogramaGrafic(nume, px) {
      const bar = /Bar$/.test(nume), d3 = /^3-D/.test(nume), st = /Stacked/.test(nume), p100 = /100%/.test(nume), plin = nume === '3-D Column';
      const H2 = [[9, 6], [14, 10], [11, 15]];
      let r = [];
      H2.forEach(([a, b], j) => {
        if (plin) { r.push([3 + j * 7, 22 - a, 4, a, 0], [3 + j * 7 + 2, 22 - a - b / 3 - 4, 3, b / 3, 1]); return; }
        if (p100) { const t = a + b; r.push([4 + j * 7, 22 - 18 * a / t, 4, 18 * a / t, 0], [4 + j * 7, 4, 4, 18 * b / t, 1]); return; }
        if (st) { r.push([4 + j * 7, 22 - a, 4, a, 0], [4 + j * 7, 22 - a - b * 0.6, 4, b * 0.6, 1]); return; }
        r.push([3 + j * 7, 22 - a, 3, a, 0], [6 + j * 7, 22 - b, 3, b, 1]);
      });
      if (/Line/.test(nume)) return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" aria-hidden="true"><polyline points="2,18 8,12 14,15 22,6" fill="none" stroke="#4472c4" stroke-width="1.6"/><polyline points="2,20 8,17 14,10 22,12" fill="none" stroke="#ed7d31" stroke-width="1.6"/>' + (/Markers/.test(nume) ? '<circle cx="8" cy="12" r="1.4" fill="#4472c4"/><circle cx="14" cy="15" r="1.4" fill="#4472c4"/>' : '') + '</svg>';
      if (/Area/.test(nume)) return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 22 L2 14 L8 9 L14 13 L22 6 L22 22 Z" fill="#4472c4"/><path d="M2 22 L2 19 L8 17 L14 18 L22 15 L22 22 Z" fill="#ed7d31"/></svg>';
      if (nume === 'Pie') return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12 L12 3 A9 9 0 0 1 20.5 15 Z" fill="#ed7d31"/><path d="M12 12 L20.5 15 A9 9 0 1 1 12 3 Z" fill="#4472c4"/></svg>';
      /* barele culcate pornesc din axa din stânga (x = 2): coloana [x, y, w, h] cu baza la 22 devine bara [24 - y - h, x, h, w] */
      if (bar) r = r.map(([x, y, w, h, s]) => [24 - y - h, x, h, w, s]);
      const cul = ['#4472c4', '#ed7d31'], adanc = ['#2f5597', '#c55a11'];
      let s = bar ? '<line x1="1.5" y1="2" x2="1.5" y2="23" stroke="#a6a6a6" stroke-width=".8"/>' : '<line x1="2" y1="22.5" x2="22" y2="22.5" stroke="#a6a6a6" stroke-width=".8"/>';
      r.forEach(([x, y, w, h, i]) => {
        if (d3) s += '<path d="M' + x + ' ' + y + ' l1.5 -1.5 h' + w + ' v' + h + ' l-1.5 1.5 Z" fill="' + adanc[i] + '"/>';
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + cul[i] + '"/>';
      });
      return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" aria-hidden="true">' + s + '</svg>';
    }
    function pregatesteTipGrafic(s) {
      if (!dialog.fam) { const g = M.gr && grafice()[M.gr.i]; dialog.fam = g ? GR_FAMILIE[g.tip] : 'Column'; dialog.subtip = g ? g.tip : 'Clustered Column'; }
      const st = s.querySelector('[data-lh-tip="Menu"][data-lh-eticheta="Chart Types"]');
      if (st) st.querySelectorAll('[data-lh-tip="ListItem"]').forEach(x => { const on = x.getAttribute('data-lh-eticheta') === dialog.fam; x.classList.toggle('lh-ap-ales', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
      const meniuri = [...s.querySelectorAll('[data-lh-tip="Menu"]')].filter(m => m !== st && !m.contains(st) && m.querySelector('[data-lh-tip="ListItem"]'));
      const [randSub, previz] = meniuri;
      if (randSub) {
        if (!randSub.__ref) randSub.__ref = [...randSub.querySelectorAll('[data-lh-tip="ListItem"]')].map(x => x.getAttribute('data-lh-eticheta'));
        const nume = dialog.fam === 'Column' ? randSub.__ref : dialog.fam === 'Bar' ? GR_SUB_BAR : [];
        randSub.querySelectorAll('[data-lh-tip="ListItem"]').forEach((x, j) => {
          const n = nume[j];
          x.style.visibility = n ? '' : 'hidden';
          if (!n) return;
          x.setAttribute('data-lh-eticheta', n); x.setAttribute('data-lh-tinta', 'fereastra:' + n);
          x.innerHTML = pictogramaGrafic(n, 40);
          const on = n === dialog.subtip; x.classList.toggle('lh-ap-ales', on); x.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      const tx = [...s.querySelectorAll('[data-lh-tip="Text"]')].find(x => x.getClientRects().length && (x.__nod || {}).e);
      if (tx) {
        tx.classList.add('lh-ap-x-ctt-nume');
        const nm = dialog.fam === 'Column' || dialog.fam === 'Bar' ? dialog.subtip : dialog.fam;
        (tx.querySelector('.lh-ap-text') || tx).textContent = nm; tx.setAttribute('data-lh-eticheta', nm);
      }
      if (previz) previz.querySelectorAll('[data-lh-tip="ListItem"]').forEach((x, j) => {
        x.style.visibility = j === 0 ? '' : 'hidden';
        x.setAttribute('data-lh-eticheta', dialog.subtip); x.setAttribute('data-lh-tinta', 'fereastra:' + dialog.subtip);
        x.innerHTML = pictogramaGrafic(dialog.subtip, 110);
      });
    }
    function dialogTipGrafic() {
      if (!deschideDialog('dialog.ChartChangeType', 'All Charts')) return I.nesimulat('Change Chart Type');
      return 'fereastra';
    }
    function clicTipGrafic(elx, v) {
      if (elx.closest('[data-lh-eticheta="Chart Types"]')) {
        if (!GR_DIN_STANGA[v]) return I.nesimulat(v);
        if (dialog.fam !== v) { dialog.fam = v; dialog.subtip = GR_DIN_STANGA[v]; }
        pregatesteTipGrafic(dialog.el);
        return 'alegere_tip_grafic';
      }
      if (GR_TIP[v]) { dialog.subtip = v; pregatesteTipGrafic(dialog.el); return 'alegere_tip_grafic'; }
      return I.nesimulat(v);
    }
    function aplicaTipGrafic() {
      const tip = dialog.subtip, i = M.gr ? M.gr.i : -1;
      inchideDialog();
      if (!GR_TIP[tip] || !grafice()[i]) { I.focus(); return 'anulare'; }
      if (grafice()[i].tip !== tip) schimba('grafic', () => { grafice()[i].tip = tip; });
      M.gr.parte = 'grafic';
      deseneazaGrafice();
      I.focus();
      return 'schimbare_tip_grafic';
    }
    /* apăsarea pe grafic: alege graficul (marginea, suprafața) sau titlul; tragerea mută graficul, mânerele îl măresc */
    function josGrafic(e, tinta, gx) {
      if (M.edit && !confirma()) return null;
      const i = +gx.getAttribute('data-lh-id') - 1, g = grafice()[i];
      if (!g) return null;
      const mn = /\/maner$/.test(tinta) && e.target.closest ? e.target.closest('[data-lh-colt]') : null;
      const parte = !mn && /\/titlu$/.test(tinta) ? 'titlu' : 'grafic';
      if (!(M.gr && M.gr.i === i && M.gr.parte === parte)) { M.gr = { i, parte }; M.grTitlu = null; deseneazaGrafice(); }
      ancora = { grafic: i, colt: mn ? mn.getAttribute('data-lh-colt') : null, fix: parte === 'titlu', x0: e.clientX, y0: e.clientY, g0: { x: g.x, y: g.y, w: g.w, h: g.h }, ina: instantaneu() };
      josFacut = true;
      I.focus();
      return 'tragere';
    }
    function mutaGrafic(e) {
      const a = ancora, g = grafice()[a.grafic];
      if (!g || a.fix) return;
      /* mutarea în px de grilă (z), mărirea în px de grafic (kg): pe telefon diferă (1,7 / 1), pe calculator sunt egale */
      const k = z(), q = kg() / k, dx = (e.clientX - a.x0) / k, dy = (e.clientY - a.y0) / k, mx = dx / q, my = dy / q, o = a.g0, c = a.colt;
      if (!c) { g.x = Math.max(0, o.x + dx); g.y = Math.max(0, o.y + dy); }
      else {
        if (c[1] === 'd') g.w = Math.max(40, o.w + mx);
        if (c[1] === 's') { g.w = Math.max(40, o.w - mx); g.x = o.x + (o.w - g.w) * q; }
        if (c[0] === 'j') g.h = Math.max(30, o.h + my);
        if (c[0] === 's') { g.h = Math.max(30, o.h - my); g.y = o.y + (o.h - g.h) * q; }
      }
      a.schimbat = true;
      const x = corpIn.querySelector('.lh-ap-x-grafic[data-lh-id="' + (a.grafic + 1) + '"]');
      if (!x) return;
      /* critic runda 10, GRAV A1: elementul atins rămâne în pagină (atingerea e „capturată” de el: un element înlocuit nu mai
         primește pointermove, iar tragerea cu degetul se oprea după primul pas). Se schimbă doar locul, mărimea și desenul. */
      const nou = desenGrafic(g, a.grafic), mn = x.querySelectorAll(':scope > .lh-ap-x-gr-maner'), vechi = {};
      mn.forEach(m => { vechi[m.getAttribute('data-lh-colt')] = m; });
      x.className = nou.className; x.style.cssText = nou.style.cssText;
      [...x.childNodes].forEach(c => { if (!(c.classList && c.classList.contains('lh-ap-x-gr-maner'))) c.remove(); });
      const prim = x.firstChild;
      [...nou.childNodes].forEach(c => {
        const m = c.classList && c.classList.contains('lh-ap-x-gr-maner') ? vechi[c.getAttribute('data-lh-colt')] : null;
        if (m) { m.style.left = c.style.left; m.style.top = c.style.top; } else x.insertBefore(c, prim);
      });
    }
    function susGrafic(an) {
      if (!an.schimbat) return 'fara_efect';
      H.inainte('grafic', an.ina);
      M.salvat = false; M.mod = true; invalid();
      deseneazaGrafice();
      return an.colt ? 'redimensionare_grafic' : 'mutare_grafic';
    }
    /* tastele cu un grafic ales: Delete îl șterge; pe titlul ales, ce scrii (în bara de formule) devine titlul la Enter
       (m2-l11: „scrie … și apasă Enter. Titlul vechi dispare”); Esc renunță */
    /* §4 „la taste: ținta focusului”: cu graficul sau titlul lui ales, focusul e graficul / titlul, deci ținta tastei e aceeași ca
       a clicului pe el (grafic:N, grafic:N/titlu), nu celula activă (MINOR criticul 9, runda 10) */
    function tastaGrafic(e, g, ctrl) {
      const tg = 'grafic:' + (M.gr.i + 1) + (M.gr.parte === 'titlu' ? '/titlu' : '');
      const r = tastaGrafic0(e, g, ctrl);
      if (r) I.tintaTasta = tg;
      return r;
    }
    function tastaGrafic0(e, g, ctrl) {
      const k = e.key, i = M.gr.i;
      if (M.gr.parte === 'titlu') {
        if (g === 'tastare' && !ctrl) { e.preventDefault(); M.grTitlu = (M.grTitlu || '') + k; actualizeazaBare(); return 'scriere'; }
        if (k === 'Backspace' && M.grTitlu != null) { e.preventDefault(); M.grTitlu = M.grTitlu.slice(0, -1); actualizeazaBare(); return 'stergere_inapoi'; }
        if (k === 'Enter' && M.grTitlu != null) { e.preventDefault(); const t = M.grTitlu; M.grTitlu = null; schimba('grafic', () => { const x = grafice()[i]; x.titlu = t; x.faraTitlu = false; }); deseneazaGrafice(); return 'titlu_grafic'; }
        if (k === 'Escape') { e.preventDefault(); if (M.grTitlu != null) { M.grTitlu = null; actualizeazaBare(); return 'anulare'; } M.gr.parte = 'grafic'; deseneazaGrafice(); return 'anulare'; }
        if (k === 'Delete') { e.preventDefault(); schimba('grafic', () => { grafice()[i].faraTitlu = true; }); M.gr.parte = 'grafic'; deseneazaGrafice(); return 'stergere_titlu_grafic'; }
      }
      if (k === 'Delete') { e.preventDefault(); schimba('grafic', () => { grafice().splice(i, 1); }); M.gr = null; deseneazaGrafice(); return 'stergere_grafic'; }
      if ((g === 'tastare' && !ctrl) || /^Arrow|^Enter$|^Escape$|^Backspace$/.test(k)) { e.preventDefault(); return 'fara_efect'; }
      return null;
    }
    function stareGrafice() {
      return (F().grafice || []).map(g => {
        const d = dateGrafic(g);
        return { tip: g.tip, zona: g.zona, titlu: titluGrafic(g, d), serii: d.serii, categorii: d.categorii, valori: d.valori, legenda: d.legenda,
          pozitie: { x: Math.round(g.x), y: Math.round(g.y), w: Math.round(g.w), h: Math.round(g.h) }, etichete: g.etichete || null };
      });
    }
    /* §5 (runda `acoperire` după runda 14): tip_grafic / serii_grafic / categorii_grafic / etichete_date ale PRIMULUI grafic de pe
       foaie (scenarii/excel/excel-grafic-*.json › descriere); fără grafic: null */
    function stareGraficPrim() {
      const g = (F().grafice || [])[0];
      if (!g) return { tip_grafic: null, serii_grafic: null, categorii_grafic: null, etichete_date: null };
      const d = dateGrafic(g), et = {};
      d.serii.forEach(n => { et[n] = g.etichete || null; });
      return { tip_grafic: g.tip, serii_grafic: d.serii.slice(), categorii_grafic: d.categorii.map(String), etichete_date: et };
    }

    /* ============================================================ gesturile (aplicatii.js le cheamă; §4) */
    const celulaDin = t => { const m = /^celula:([A-Z]+\d+)$/.exec(t || ''); return m ? pa(m[1]) : null; };
    function celulaLa(x, y) {
      const b = corp.getBoundingClientRect();
      const cx = x - b.left + corp.scrollLeft, cy = y - b.top + corp.scrollTop;
      return { r: Math.max(R0, Math.min(R0 + NR - 1, randLa(cy))), c: Math.max(C0, Math.min(C0 + NC - 1, colLa(cx))) };
    }
    const inGrila = tg => corp.contains(tg) || antC.contains(tg) || antR.contains(tg) || colt.contains(tg);
    I.la = {};
    let ancora = null, josFacut = false, atingere = null;
    /* runda 21 (critic 17, G17-2): pe ecranul tactil degetul pus pe o celulă / un antet poate porni o DERULARE a grilei; browserul o
       preia și trimite pointercancel, deci nu mai vine ridicarea care emite evenimentul. Apăsarea degetului nu alege nimic (nici nu
       deselectează graficul): ce făcea apăsarea se face la ATINGEREA scurtă (ridicarea fără tragere → I.la.clic, cu evenimentul
       clic / selectare_celula), iar derularea nu schimbă starea. Mouse-ul și creionul rămân ca înainte. */
    const amanat = (e, tinta, tg) => e.pointerType === 'touch' && !dialog && !backstage && inGrila(tg) && tg !== maner && !tg.closest('.lh-ap-x-maner') &&
      (!!celulaDin(tinta) || /^antet_(coloana|rand):/.test(tinta || '') || tinta === 'selecteaza_tot');
    I.la.jos = (e, tinta) => {
      const tg = e.target;
      if (meniu && !meniu.contains(tg)) inchideMeniu();
      josFacut = false;
      atingere = null;
      const gx = !dialog && !backstage && /^grafic(:|$)/.test(tinta || '') && tg.closest ? tg.closest('.lh-ap-x-grafic') : null;
      if (gx) return josGrafic(e, tinta, gx);
      /* runda 29: apăsarea pe o filă poate deveni tragerea ei (mutare / copiere); fără mișcare rămâne clicul de alegere */
      if (!dialog && !backstage && !REG.gol && !redenumire && /^fila_foii:/.test(tinta || '')) { ancora = { fila: tinta.slice(10) }; return 'tragere'; }
      if (amanat(e, tinta, tg)) { atingere = tinta; ancora = null; return null; }
      return josGrila(e, tinta, tg);
    };
    function josGrila(e, tinta, tg) {
      if (M.gr && !dialog && !backstage && inGrila(tg)) deselecteazaGrafic();
      if (dialog || backstage || !inGrila(tg) || tg === maner || tg.closest('.lh-ap-x-maner')) {
        if (tg === maner) { ancora = { umplere: true }; return 'umplere'; }
        ancora = null;
        if (!dialog && !backstage && !tg.closest('input,textarea,select')) setTimeout(() => { if (!dialog && !backstage && document.activeElement !== inNume && !redenumire) I.focus(); }, 0);
        return null;
      }
      const p = celulaDin(tinta);
      if (p) {
        josFacut = true;
        if (M.edit) {
          if (M.edit.a === adr(p.r, p.c)) { ancora = null; return 'selectie'; }
          if (poatePuncta() || (M.edit.ales && M.edit.text.charAt(0) === '=')) { insereaza(adr(p.r, p.c)); M.edit.punct = true; M.edit.pk = { i: M.edit.poz - adr(p.r, p.c).length, j: M.edit.poz, r: p.r, c: p.c }; M.edit.propus = { r0: p.r, c0: p.c, r1: p.r, c1: p.c }; ancora = { punct: true, de: p }; deseneazaSelectia(); I.focus(); return 'selectie'; }
          if (!confirma()) { ancora = null; return 'selectie'; }
        }
        M.tabCol = null;
        alege(p.r, p.c, e.shiftKey, (e.ctrlKey || e.metaKey) && !e.shiftKey);
        ancora = { de: p };
        I.focus();
        return 'selectie';
      }
      const am = /^antet_coloana_margine:([A-Z]+)$/.exec(tinta || '');
      if (am) {
        if (M.edit && !confirma()) return null;
        const c0 = colIdx(am[1]);
        ancora = { latime: c0, x0: e.clientX, w0: latPx(F(), c0), ina: instantaneu() };
        josFacut = true;
        return 'tragere';
      }
      const ac = /^antet_coloana:([A-Z]+)$/.exec(tinta || ''), ar = /^antet_rand:(\d+)$/.exec(tinta || '');
      if (ac || ar || tinta === 'selecteaza_tot') {
        if (M.edit && !confirma()) return null;
        const s = F().sel;
        const q = ac ? { r0: 0, c0: colIdx(ac[1]), r1: MAXR - 1, c1: colIdx(ac[1]) } : ar ? { r0: +ar[1] - 1, c0: 0, r1: +ar[1] - 1, c1: MAXC - 1 } : { r0: 0, c0: 0, r1: MAXR - 1, c1: MAXC - 1 };
        s.zone = [q]; s.activa = { r: ac ? randLa(corp.scrollTop) : q.r0, c: ar ? colLa(corp.scrollLeft) : q.c0 };
        if (tinta === 'selecteaza_tot') s.activa = { r: 0, c: 0 };
        ancora = { antet: ac ? 'c' : ar ? 'r' : null, q };
        josFacut = true;
        deseneazaSelectia();
        I.focus();
        return 'selectie';
      }
      ancora = null;
      I.focus();
      return null;
    }
    I.la.misca = (e, j) => {
      if (!ancora) return;
      if (ancora.grafic != null) { mutaGrafic(e); return; }
      if (ancora.fila != null) { marcajFila(e.clientX); return; }
      if (ancora.latime != null) {
        const f = F(), w = Math.max(0, Math.round(ancora.w0 + (e.clientX - ancora.x0) / z()));
        if (f.lat[ancora.latime] !== w) { f.lat[ancora.latime] = w; ancora.schimbat = true; deseneazaGrila(); }
        M.trageInfo = null;
        return;
      }
      const p = celulaLa(e.clientX, e.clientY);
      if (ancora.umplere) {
        const q = F().sel.zone[F().sel.zone.length - 1];
        const dr0 = p.r > q.r1 ? p.r - q.r1 : p.r < q.r0 ? p.r - q.r0 : 0, dc0 = p.c > q.c1 ? p.c - q.c1 : p.c < q.c0 ? p.c - q.c0 : 0;
        const vert = Math.abs(dr0) >= Math.abs(dc0);
        const b = dr({ r0: Math.min(q.r0, vert ? p.r : q.r0), c0: Math.min(q.c0, vert ? q.c0 : p.c), r1: Math.max(q.r1, vert ? p.r : q.r1), c1: Math.max(q.c1, vert ? q.c1 : p.c) });
        let g = selStrat.querySelector('.lh-ap-x-umple');
        if (!g) { g = el('div', 'lh-ap-x-umple'); selStrat.appendChild(g); }
        Object.assign(g.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
        return;
      }
      if (ancora.punct) {
        const e2 = M.edit;
        if (!e2) return;
        e2.pk = null;
        const a0 = adr(ancora.de.r, ancora.de.c), z2 = p.r === ancora.de.r && p.c === ancora.de.c ? a0 : zonaText({ r0: Math.min(p.r, ancora.de.r), c0: Math.min(p.c, ancora.de.c), r1: Math.max(p.r, ancora.de.r), c1: Math.max(p.c, ancora.de.c) });
        const i = e2.text.lastIndexOf(ancora.ultim || a0, e2.poz);
        if (i >= 0) { const u = ancora.ultim || a0; e2.text = e2.text.slice(0, i) + z2 + e2.text.slice(i + u.length); e2.poz = i + z2.length; ancora.ultim = z2; e2.propus = zonaDin(z2); deseneazaSelectia(); }
        return;
      }
      if (ancora.antet) {
        const s = F().sel, q = ancora.q;
        s.zone = [ancora.antet === 'c' ? { r0: 0, c0: Math.min(q.c0, p.c), r1: MAXR - 1, c1: Math.max(q.c0, p.c) } : { r0: Math.min(q.r0, p.r), c0: 0, r1: Math.max(q.r0, p.r), c1: MAXC - 1 }];
        deseneazaSelectia();
        return;
      }
      if (ancora.de && !M.edit) {
        const s = F().sel, a = s.activa;
        s.zone[s.zone.length - 1] = { r0: Math.min(a.r, p.r), c0: Math.min(a.c, p.c), r1: Math.max(a.r, p.r), c1: Math.max(a.c, p.c) };
        M.trageInfo = (Math.abs(p.r - a.r) + 1) + 'R x ' + (Math.abs(p.c - a.c) + 1) + 'C';
        deseneazaSelectia();
      }
    };
    I.la.sus = (e, j, g) => {
      const an = ancora;
      ancora = null;
      M.trageInfo = null;
      if (an && an.fila != null) marcajFila(null);
      if (!g) return null;
      if (an && an.grafic != null) return susGrafic(an);
      if (an && an.fila != null) { const i = M.foi.findIndex(x => x.nume === an.fila); return i < 0 ? 'fara_efect' : mutaFoaia(i, locFila(e.clientX).k, !!(e.ctrlKey || e.metaKey)); }
      if (g === 'umplere_tragere' && an && an.umplere) { const p = celulaLa(e.clientX, e.clientY); return umple(p.r, p.c); }
      if (an && an.latime != null) {
        if (!an.schimbat) return 'fara_efect';
        H.inainte('format', an.ina);
        F().latSet[an.latime] = true;
        M.salvat = false;
        M.mod = true;
        invalid();
        actualizeaza();
        return 'latime_coloana';
      }
      if (g === 'selectie') { deseneazaSelectia(); return an && an.punct ? 'referinta' : 'selectare'; }
      return null;
    };
    I.la.clic = (tinta, e, n, g) => {
      const tg = e.target;
      const elx = tg && tg.closest ? tg.closest('[data-lh-tinta]') : null;
      if (!tinta) return null;
      /* runda 21 (G17-2): atingerea scurtă cu degetul face acum ce făcea apăsarea (alegerea celulei / a rândului / a coloanei),
         apoi clicul obișnuit de mai jos dă acțiunea evenimentului */
      if (atingere && atingere === tinta && !dialog && !backstage) { atingere = null; josGrila(e, tinta, tg); ancora = null; }
      const [fel] = tinta.split(':');
      const v = tinta.slice(fel.length + 1);
      if (fel === 'grafic' && !dialog && !backstage) { josFacut = false; return M.gr && M.gr.parte === 'titlu' ? 'alegere_titlu_grafic' : 'alegere_grafic'; }
      const p = celulaDin(tinta);
      if (p && !dialog && !backstage) {
        if (!josFacut) { if (M.edit && !confirma()) return 'fara_efect'; alege(p.r, p.c, e.shiftKey, e.ctrlKey || e.metaKey); }
        josFacut = false;
        if (!M.edit || !M.edit.punct) I.focus();
        if (M.edit && M.edit.punct) return 'referinta';
        return e.shiftKey ? 'extindere_selectie' : (e.ctrlKey || e.metaKey) ? 'adaugare_selectie' : 'selectare_celula';
      }
      josFacut = false;
      if (fel === 'antet_coloana_margine') return 'fara_efect';
      if (/^antet_(coloana|rand)$/.test(fel) || tinta === 'selecteaza_tot') return fel === 'antet_coloana' ? 'selectare_coloana' : fel === 'antet_rand' ? 'selectare_rand' : 'selectare_tot';
      if (tinta === 'grila' || tinta === 'maner_umplere') return 'fara_efect';
      if (!elx || !root.contains(elx)) return null;
      if (fel === 'fila') {
        if (v === 'File') return deschideBackstage('Home');
        if (backstage) inchideBackstage();
        return activeazaFila(elx.getAttribute('data-lh-id-mso')) ? 'fila' : I.nesimulat(v);
      }
      if (fel === 'backstage') {
        const n2 = elx.__nod || {};
        if (n2.id === 'FileTabButton' || v === 'Back') { inchideBackstage(); return 'inapoi'; }
        if (v === 'Blank workbook' && backstage && backstage.pagina === 'New') return registruNou();
        if (v === 'Close' && elx.closest('[data-lh-suprafata="backstage.nav"]')) { inchideBackstage(); return inchideRegistru(); }
        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideSalvareCa() ? 'salvare_ca' : I.nesimulat(v);
        if (v === 'Browse' && backstage && backstage.pagina === 'Open') return deschideDeschidere() ? 'deschidere' : I.nesimulat(v);
        if (elx.closest('[data-lh-suprafata="backstage.nav"]') && n2.t === 'ListItem') {
          if (n2.a === 0) return 'indisponibil';
          if (v === 'Save') { if (M.nume) return salveaza(); return arataPaginaBackstage('Save As') ? 'pagina_backstage' : I.nesimulat(v); }
          return arataPaginaBackstage(v) ? 'pagina_backstage' : I.nesimulat(v);
        }
        return I.nesimulat(v);
      }
      if (dialog && elx && dialog.el && dialog.el.contains(elx) && /^dialog\.Sort(Dialog|Warning)$/.test(dialog.baza)) { const r = clicSortare(elx, v); if (r) return r; }
      if (fel === 'arbore' && dialog && dialog.baza === 'dialog.FileSaveAs') { dialog.folder = v; M.folder = v; marcheazaFolder(); return 'folder'; }
      if (fel === 'fila_dialog' && dialog) { arataFilaDialog((date.dialoguri[dialog.baza].file.some(x => x.fila === v) && v !== date.dialoguri[dialog.baza].file[0].fila) ? v : null); return 'fila_dialog'; }
      if (fel === 'dialog_salvare' && dialog) return v === 'Save' ? salveazaDinDialog() : (inchideDialog(), 'anulare');
      if (fel === 'fereastra' && dialog && /^dialog\.eroare_formula/.test(dialog.baza)) return raspunsEroare(v);
      if (fel === 'fereastra' && dialog && dialog.baza === INTREBARE_INCHIDERE) return raspunsInchidere(v);
      if (dialog && (dialog.baza === SALVARE_NOUA || dialog.baza === INTREBARE_INCHIDERE)) {
        /* More options… → pagina File › Save As (acoperire_r7.fapte.a_ctrl_s_registru_nou.more_options.backstage „Save As”) */
        if (fel === 'fereastra' && v === 'More options…') { inchideDialog(); deschideBackstage('Save As'); return 'pagina_backstage'; }
        if (fel === 'fereastra' && /^(Cancel|Închidere)$/.test(v)) { inchideDialog(); return 'anulare'; }
        /* rândurile listelor Choose a Location ▾ și Save as type ▾ nu sunt în referință → mesajul central (ca word.js) */
        if (fel === 'fereastra' && v === 'Open') return I.nesimulat('Choose a Location ▾');
        if (fel === 'camp' && v === 'tip_fisier') return I.nesimulat('Save as type ▾');
      }
      /* runda 29 (G25-1): întrebarea ștergerii (Delete / Cancel / ✕), refuzul (OK / ✕), Move or Copy (rândul listei, Create a copy) */
      if (fel === 'fereastra' && dialog && dialog.baza === DLG_STERGE) { if (v === 'Delete') return stergeAcum(dialog.foaie); inchideDialog(); return 'anulare'; }
      if (fel === 'fereastra' && dialog && (dialog.baza === DLG_REFUZ || dialog.baza === DLG_NUME)) { inchideDialog(); return v === 'OK' ? 'inchidere' : 'anulare'; }
      if (fel === 'fereastra' && dialog && dialog.baza === 'dialog.SheetMoveOrCopy' && dialog.mc) {
        const li = elx.closest('[data-lh-tip="ListItem"]');
        if (li && dialog.el.contains(li)) return alegeInMutare(li);
        if (v === 'Create a copy') { dialog.mc.copie = !dialog.mc.copie; bifeaza(elx.closest('[data-lh-tip="CheckBox"]') || elx, dialog.mc.copie, false); return 'bifare'; }
      }
      if (fel === 'fereastra' && dialog && dialog.baza === 'dialog.ChartChangeType' && elx.getAttribute('data-lh-tip') === 'ListItem') return clicTipGrafic(elx, v);
      if (fel === 'fereastra' && dialog) {
        if (/^(OK|Insert)$/.test(v)) return implicitDialog();
        if (/^(Cancel|Închidere|Close)$/.test(v)) { inchideDialog(); return 'anulare'; }
        return I.nesimulat(v);
      }
      if (fel === 'camp') return 'camp';
      if (dialog && dialog.strat.contains(elx)) return I.nesimulat(v);
      if (fel === 'meniu' && meniu && meniu.contains(elx)) {
        const idm = elx.getAttribute('data-lh-id-mso'), supEl = elx.closest('[data-lh-suprafata]'), lista = supEl ? supEl.getAttribute('data-lh-suprafata') : meniu.getAttribute('data-lh-suprafata');
        /* X10 (runda 17): Add Chart Element › Data Labels ▸ deschide submeniul (lista rămâne); rândul lui pune etichetele */
        if (lista === 'lista.AddChartElementMenu' && v === 'Data Labels') return submeniuEtichete(elx);
        if (lista === 'meniu_contextual.fila_foii' && v === 'Tab Color') return submeniuCuloare(elx);
        inchideMeniu();
        /* runda 29 (G25-1): culoarea filei, Home › Delete ▾, Delete din meniul filei */
        if (lista === 'lista.TabColor') return coloreazaFila(v);
        if (lista === 'lista.TableDeleteRowsAndColumnsMenu') return v === 'Delete Sheet' ? stergeFoaia(M.fi) : v === 'Delete Cells...' ? (deschideDialog('dialog.CellsDelete') ? 'fereastra' : I.nesimulat(v)) : I.nesimulat(v);
        if (lista === 'meniu_contextual.fila_foii' && v === 'Delete') return stergeFoaia(M.fi);
        if (lista === 'lista.ChartTypeLineInsertGallery') return GR_TIP[v] ? insereazaGrafic(v) : I.nesimulat(v);
        if (/^lista\.AddChartElementMenu#Data Labels/.test(lista || '')) return v === 'More Data Label Options...' ? I.nesimulat(v) : puneEtichete(v);
        if (lista === 'lista.AddChartElementMenu') return I.nesimulat(v);
        /* lista ▾ a lui Σ (uia_excel.json › lista.AutoSum; acoperire_r7.fapte: Average pe B8 → =AVERAGE(B2:B7)): funcția
           rândului, cu zona propusă aleasă, ca la Σ; More Functions... = mesajul central */
        if (lista === 'lista.ChartTypeColumnInsertGallery') return GR_TIP[v] ? insereazaGrafic(v) : I.nesimulat(v);
        if (lista === 'lista.AutoSum') return SIGMA_FN[v] ? (M.edit ? 'fara_efect' : autoSum(SIGMA_FN[v])) : I.nesimulat(v);
        if (idm && BORD_EFECT.has(idm)) return borduri(idm);
        if (/^Cut$/.test(v)) return copiaza(true);
        if (/^Copy$/.test(v)) return copiaza(false);
        if (/^(Paste|Keep Text Only)$/.test(v)) return lipeste();
        if (v === 'Clear Contents') return golesteContinut();
        if (v === 'Bold') return comutaFormat('bold');
        if (v === 'Italic') return comutaFormat('italic');
        if (v === 'Center') return aliniaza('centru');
        if (v === 'Merge & Center') return imbina();
        if (v === 'Format Cells...') return deschideDialog('dialog.FormatCellsDialog') ? 'fereastra' : I.nesimulat(v);
        if (v === 'Insert...' && meniu) return deschideDialog('dialog.CellsInsertDialog') ? 'fereastra' : I.nesimulat(v);
        if (v === 'Delete...') return deschideDialog('dialog.CellsDelete') ? 'fereastra' : I.nesimulat(v);
        if (v === 'Column Width...') return deschideDialog('dialog.ColumnWidth') ? 'fereastra' : I.nesimulat(v);
        if (v === 'Row Height...') return deschideDialog('dialog.RowHeight') ? 'fereastra' : I.nesimulat(v);
        if (v === 'Move or Copy...') return deschideDialog('dialog.SheetMoveOrCopy') ? 'fereastra' : I.nesimulat(v);
        if (v === 'Rename') return pornesteRedenumire(F().nume);
        return I.nesimulat(v);
      }
      if (fel === 'fila_foii') return alegeFoaia(v);
      if (fel === 'fila_foii_buton') return v === 'Add Sheet' ? adaugaFoaie() : 'indisponibil';
      if (fel === 'bara_formule') {
        if (v === 'Insert Function') return deschideDialog('dialog.FunctionWizard') ? 'fereastra' : I.nesimulat(v);
        const f = F(), a = adr(f.sel.activa.r, f.sel.activa.c);
        if (!M.edit) porneste(a, textEditare(f, a), 'Edit');
        return 'editare';
      }
      if (fel === 'zoom') return zoomClic(elx, e, v);
      if (fel === 'derulare') return derulare(v, e);
      if (fel === 'acces_rapid' || fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return apasa(elx, tinta);
      return I.nesimulat(v || tinta);
    };
    /* potrivirea automată a lățimii (dublu clic pe linia dintre litere): cea mai lată valoare din coloană */
    function potriveste(c0) {
      const f = F();
      let px = 0;
      Object.keys(f.cel).forEach(a => {
        const q = pa(a);
        if (!q || q.c !== c0 || mergeLa(f, q.r, q.c)) return;
        const v = valoare(f, q.r, q.c), fm = fmtDe(f, a);
        const t = afisat(v, fm.format_numar);
        /* runda 25: textul se măsoară la 15 px (11 pt la 96 dpi, înălțimea rotunjită la pixel, ca fontul lui Excel), + 5 px marginea
           celulei (scenarii_real/excel-autofit-latime: „Situația notelor la informatică” → 186 px; înainte, 14,667 px + 7 = 184).
           Un singur text capturat: celelalte lungimi = de_verificat R25-4 */
        const w = typeof v === 'number' ? latNecesar(t) : Math.ceil(latimeText(t, 15) / z() + 5 + (fm.bold ? 1 : 0));
        px = Math.max(px, w);
      });
      if (!px || px === latPx(f, c0)) return 'fara_efect';
      schimba('format', () => { f.lat[c0] = px; f.latSet[c0] = true; });
      actualizeaza();
      return 'potrivire_latime';
    }
    I.la.dublu = tinta => {
      const fm = /^fila_foii:(.+)$/.exec(tinta || '');
      if (fm && !dialog && !backstage && !REG.gol) return pornesteRedenumire(fm[1]);
      const am = /^antet_coloana_margine:([A-Z]+)$/.exec(tinta || '');
      if (am && !dialog && !backstage) return potriveste(colIdx(am[1]));
      const p = celulaDin(tinta);
      if (p && !dialog && !backstage) {
        const f = F(), a = adr(p.r, p.c);
        if (M.edit && M.edit.a === a) return 'editare';
        porneste(a, textEditare(f, a), 'Edit');
        return 'editare';
      }
      return null;
    };
    I.la.dreapta = (tinta, e) => {
      if (dialog || backstage) return null;
      const p = celulaDin(tinta);
      if (p) {
        if (M.edit && !confirma()) return null;
        const s = F().sel;
        if (!s.zone.some(q => inZona(q, p.r, p.c))) alege(p.r, p.c);
        return meniuContextual('meniu_contextual.celula', e.clientX, e.clientY);
      }
      /* clic dreapta pe o literă / un număr din afara selecției alege coloana / rândul (meniul e al lor: Column Width…) */
      const ac = /^antet_coloana:([A-Z]+)$/.exec(tinta || ''), ar = /^antet_rand:(\d+)$/.exec(tinta || '');
      if (ac || ar) {
        if (M.edit && !confirma()) return null;
        const s = F().sel, c0 = ac ? colIdx(ac[1]) : 0, r = ar ? +ar[1] - 1 : 0;
        const deja = s.zone.some(q => ac ? (q.r0 === 0 && q.r1 === MAXR - 1 && c0 >= q.c0 && c0 <= q.c1) : (q.c0 === 0 && q.c1 === MAXC - 1 && r >= q.r0 && r <= q.r1));
        if (!deja) {
          const q = ac ? { r0: 0, c0, r1: MAXR - 1, c1: c0 } : { r0: r, c0: 0, r1: r, c1: MAXC - 1 };
          s.zone = [q]; s.activa = { r: ac ? randLa(corp.scrollTop) : r, c: ac ? c0 : colLa(corp.scrollLeft) };
          deseneazaSelectia();
        }
        return meniuContextual(ac ? 'meniu_contextual.antet_coloana' : 'meniu_contextual.antet_rand', e.clientX, e.clientY);
      }
      if (/^fila_foii:/.test(tinta || '')) { if (REG.gol) return null; alegeFoaia(tinta.slice(10)); return meniuContextual('meniu_contextual.fila_foii', e.clientX, e.clientY); }
      return null;
    };
    function zoomClic(elx, e, v) {
      if (v === 'Zoom Out') M.zoom = Math.max(10, M.zoom - 10);
      else if (v === 'Zoom In') M.zoom = Math.min(400, M.zoom + 10);
      else if (elx.getAttribute('data-lh-tip') === 'Slider' || elx.closest('[data-lh-tip="Slider"]')) {
        const s = elx.closest('[data-lh-tip="Slider"]') || elx, r = s.getBoundingClientRect(), k = (e.clientX - r.left) / r.width;
        if (isFinite(k)) M.zoom = Math.max(10, Math.min(400, Math.round(k <= 0.5 ? 10 + k * 2 * 90 : 100 + (k - 0.5) * 2 * 300)));
      } else return I.nesimulat('Zoom');
      actualizeaza();
      return 'zoom';
    }
    I.la.zoomRotita = e => { M.zoom = Math.max(10, Math.min(400, M.zoom + (e.deltaY < 0 ? 10 : -10))); actualizeaza(); return 'zoom'; };

    const NUME_TASTE = { ctrl_e: 'Flash Fill (Ctrl+E)', ctrl_n: 'New (Ctrl+N)', ctrl_w: 'Close (Ctrl+W)', ctrl_p: 'Print (Ctrl+P)', ctrl_f: 'Find (Ctrl+F)', ctrl_h: 'Replace (Ctrl+H)', ctrl_k: 'Link (Ctrl+K)' };
    I.la.tasta = (e, g, inCamp) => {
      const k = e.key;
      if (inCamp) {
        if (redenumire && e.target === redenumire.inp) {
          if (k === 'Enter') { e.preventDefault(); return terminaRedenumire(true) || 'redenumire_foaie'; }
          if (k === 'Escape') { e.preventDefault(); terminaRedenumire(false); return 'anulare'; }
          return null;
        }
        if (e.target === inNume) {
          if (k === 'Enter') { e.preventDefault(); const q = zonaDin(inNume.value); inNume.blur(); if (q) { F().sel = { activa: { r: q.r0, c: q.c0 }, zone: [q] }; actualizeaza(); vedeCelula(q.r0, q.c0); I.focus(); return 'salt_la_adresa'; } inNume.value = adr(F().sel.activa.r, F().sel.activa.c); I.focus(); return 'fara_efect'; }
          if (k === 'Escape') { inNume.blur(); actualizeazaBare(); I.focus(); return 'anulare'; }
          return null;
        }
        if (dialog && dialog.strat.contains(e.target)) return tastaDialog(e, g, true);
        return null;
      }
      if (dialog) return tastaDialog(e, g, false);
      if (meniu) return tastaMeniu(e, g);
      if (backstage) { if (k === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }
      const ctrl = e.ctrlKey || e.metaKey;
      if (REG.gol) {
        if (ctrl && g === 'ctrl_n') { e.preventDefault(); return registruNou(); }
        if (ctrl && g === 'ctrl_o') { e.preventDefault(); return deschideBackstage('Open'); }
        return 'fara_efect';
      }
      if (g === 'tasta_f12') { e.preventDefault(); if (M.edit && !confirma()) return 'fara_efect'; return deschideSalvareCa() ? 'salvare_ca' : I.nesimulat('Save As'); }
      /* ------------------------------------------------ în editare */
      if (M.edit) {
        const ed = M.edit;
        if (g === 'tastare' && !ctrl) { e.preventDefault(); insereaza(k); return 'scriere'; }
        if (k === 'Enter') {
          e.preventDefault();
          const col = M.tabCol, a = pa(ed.a);
          if (!confirma()) { deseneazaSelectia(); return 'formula_neprimita'; }
          M.tabCol = null;
          if (e.altKey) return 'scriere';
          if (unaSingura() || true) {
            if (!unaSingura()) { inainteaza(e.shiftKey ? -1 : 1, 0); return 'confirmare'; }
            alege(a.r + (e.shiftKey ? -1 : 1), !e.shiftKey && col != null ? col : a.c);
          }
          return 'confirmare';
        }
        if (k === 'Tab') {
          e.preventDefault();
          if (completare()) return 'completare_functie';
          const a = pa(ed.a);
          if (!confirma()) { deseneazaSelectia(); return 'formula_neprimita'; }
          if (M.tabCol == null) M.tabCol = a.c;
          if (!unaSingura()) { inainteaza(0, e.shiftKey ? -1 : 1); return 'confirmare'; }
          alege(a.r, a.c + (e.shiftKey ? -1 : 1));
          return 'confirmare';
        }
        if (k === 'Escape') { renunta(); return 'anulare'; }
        if (g === 'tasta_f2') { ed.mod = ed.mod === 'Edit' ? 'Enter' : 'Edit'; ed.pk = null; ed.punct = false; deseneazaSelectia(); return 'mod_editare'; }
        if (g === 'tasta_f4') { e.preventDefault(); return f4(); }
        if (k === 'Backspace') { e.preventDefault(); ed.pk = null; ed.punct = false; if (stergeAles(ed)) ed.propus = null; else if (ed.poz > 0) { ed.text = ed.text.slice(0, ed.poz - 1) + ed.text.slice(ed.poz); ed.poz--; } deseneazaSelectia(); return 'stergere_inapoi'; }
        if (k === 'Delete') { e.preventDefault(); ed.pk = null; ed.punct = false; if (stergeAles(ed)) ed.propus = null; else ed.text = ed.text.slice(0, ed.poz) + ed.text.slice(ed.poz + 1); deseneazaSelectia(); return 'stergere_inainte'; }
        if (/^Arrow/.test(k)) {
          e.preventDefault();
          if (ed.mod === 'Edit' && (k === 'ArrowLeft' || k === 'ArrowRight')) { ed.ales = null; ed.poz = Math.max(0, Math.min(ed.text.length, ed.poz + (k === 'ArrowLeft' ? -1 : 1))); deseneazaSelectia(); return 'mutare_cursor'; }
          if (ed.mod === 'Edit') return 'fara_efect';
          /* modul Point (critic runda 7, GRAV K5): într-o formulă, după un operator (= + - * / ( ; …), săgeata scrie adresa
             celulei vecine celei editate; apăsările următoare o mută (scenarii_real/excel-point-egal-sus.json: „=” + ↑ + Enter →
             B5 = „=B4”; excel-point-plus-dreapta.json: „=B2+” + → + Enter → „=B2+E2”). Bara de stare: „Point”. */
          if (!ctrl && !e.shiftKey && ed.text.charAt(0) === '=' && (ed.pk || poatePuncta())) {
            const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
            const b0 = ed.pk || pa(ed.a);
            const r = Math.max(0, Math.min(MAXR - 1, b0.r + d[0])), c0 = Math.max(0, Math.min(MAXC - 1, b0.c + d[1])), s2 = adr(r, c0);
            if (ed.pk) { ed.text = ed.text.slice(0, ed.pk.i) + s2 + ed.text.slice(ed.pk.j); ed.ales = null; }
            else { stergeAles(ed); ed.pk = { i: ed.poz }; ed.text = ed.text.slice(0, ed.poz) + s2 + ed.text.slice(ed.poz); }
            Object.assign(ed.pk, { j: ed.pk.i + s2.length, r, c: c0 });
            ed.poz = ed.pk.j;
            ed.punct = true;
            ed.propus = { r0: r, c0, r1: r, c1: c0 };
            vedeCelula(r, c0);
            deseneazaSelectia();
            return 'referinta';
          }
          /* modul Enter: săgeata primește conținutul și mută (excel-sageata-confirma) */
          const a = pa(ed.a);
          if (!confirma()) { deseneazaSelectia(); return 'formula_neprimita'; }
          M.tabCol = null;
          const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
          alege(a.r + d[0], a.c + d[1]);
          return 'confirmare';
        }
        if (k === 'Home' || k === 'End') { e.preventDefault(); ed.pk = null; ed.punct = false; ed.ales = null; ed.poz = k === 'Home' ? 0 : ed.text.length; deseneazaSelectia(); return 'mutare_cursor'; }
        if (ctrl && g === 'ctrl_z') { renunta(); return 'anulare'; }
        if (ctrl && g === 'ctrl_a') { e.preventDefault(); return 'fara_efect'; }
        return 'fara_efect';
      }
      /* ------------------------------------------------ fără editare */
      if (M.gr) { const rg = tastaGrafic(e, g, ctrl); if (rg) return rg; }
      const f = F(), s = f.sel, a = s.activa;
      if (g === 'tastare' && !ctrl) { e.preventDefault(); M.clip = M.clip && !M.clip.decupat ? M.clip : M.clip; porneste(adr(a.r, a.c), k, 'Enter'); return 'scriere'; }
      if (g === 'tasta_f2') { e.preventDefault(); porneste(adr(a.r, a.c), textEditare(f, adr(a.r, a.c)), 'Edit'); return 'editare'; }
      if (k === 'Backspace') { e.preventDefault(); porneste(adr(a.r, a.c), '', 'Enter'); return 'editare'; }
      if (k === 'Delete') { e.preventDefault(); return golesteContinut(); }
      if (k === 'Enter') { e.preventDefault(); if (M.tabCol != null && unaSingura() && !e.shiftKey) { const c0 = M.tabCol; M.tabCol = null; alege(a.r + 1, c0); return 'mutare'; } inainteaza(e.shiftKey ? -1 : 1, 0); return 'mutare'; }
      if (k === 'Tab') { e.preventDefault(); if (M.tabCol == null) M.tabCol = a.c; inainteaza(0, e.shiftKey ? -1 : 1); return 'mutare'; }
      if (k === 'Escape') { if (M.clip) { M.clip = null; deseneazaSelectia(); return 'anulare_copiere'; } return 'fara_efect'; }
      if (/^Arrow/.test(k)) {
        e.preventDefault();
        M.tabCol = null;
        const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
        if (ctrl) { sari(d[0], d[1], e.shiftKey); return 'mutare'; }
        if (e.shiftKey) { const p = s.capat || a; alege(p.r + d[0], p.c + d[1], true); return 'extindere_selectie'; }
        const m = mergeLa(f, a.r, a.c);
        alege(m && d[0] > 0 ? m.r1 + 1 : m && d[1] > 0 ? m.r0 : a.r + d[0], m && d[1] > 0 ? m.c1 + 1 : m && d[0] > 0 ? m.c0 : a.c + d[1]);
        return 'mutare';
      }
      if (k === 'Home') { e.preventDefault(); if (ctrl) alege(0, 0, e.shiftKey); else alege(a.r, 0, e.shiftKey); return 'mutare'; }
      if (k === 'End') { e.preventDefault(); if (ctrl) { const u = ultim(f); alege(u.r, u.c, e.shiftKey); return 'mutare'; } return 'fara_efect'; }
      /* runda 29 (R25-7; m1-l03:197, :230): Ctrl+PageDown / Ctrl+PageUp = foaia din dreapta / din stânga; la capăt rămâi pe loc */
      if ((k === 'PageDown' || k === 'PageUp') && ctrl && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const j = M.fi + (k === 'PageDown' ? 1 : -1);
        if (j < 0 || j >= M.foi.length) return 'fara_efect';
        return alegeFoaia(M.foi[j].nume) === 'fila_foii' ? (k === 'PageDown' ? 'foaie_urmatoare' : 'foaie_anterioara') : 'fara_efect';
      }
      if (k === 'PageDown' || k === 'PageUp') { e.preventDefault(); const n =Math.max(1, Math.floor(corp.clientHeight / HR()) - 1); alege(a.r + (k === 'PageDown' ? n : -n), a.c, e.shiftKey); return 'mutare'; }
      if (ctrl) {
        switch (g) {
          case 'ctrl_b': return comutaFormat('bold');
          case 'ctrl_i': return comutaFormat('italic');
          case 'ctrl_u': return comutaFormat('underline');
          case 'ctrl_c': return copiaza(false);
          case 'ctrl_x': return copiaza(true);
          case 'ctrl_v': return lipeste();
          case 'ctrl_z': return anuleaza();
          case 'ctrl_y': return reface();
          case 'ctrl_d': return umpleCu(true);
          case 'ctrl_r': return umpleCu(false);
          case 'ctrl_s': return salveaza();
          case 'ctrl_n': e.preventDefault(); return registruNou();
          case 'ctrl_w': e.preventDefault(); return inchideRegistru();
          case 'ctrl_o': return deschideBackstage('Open');
          case 'ctrl_a': {
            const q = zonaCurenta(f, a.r, a.c);
            const tot = { r0: 0, c0: 0, r1: MAXR - 1, c1: MAXC - 1 };
            s.zone = [q && zonaText(q) !== zonaText(s.zone[0]) ? q : tot];
            deseneazaSelectia();
            return 'selectare_tot';
          }
        }
        if (NUME_TASTE[g]) return I.nesimulat(NUME_TASTE[g]);
        if (g && /^ctrl_/.test(g)) return I.nesimulat(g.replace(/^ctrl_shift_/, 'Ctrl+Shift+').replace(/^ctrl_/, 'Ctrl+').toUpperCase().replace('CTRL', 'Ctrl').replace('SHIFT', 'Shift'));
      }
      return 'fara_efect';
    };
    /* textul venit fără keydown utilizabil (telefon, IME): ca tastarea */
    I.la.text = v => {
      if (dialog || backstage || REG.gol) return 'fara_efect';
      if (M.gr && !M.edit) { if (M.gr.parte !== 'titlu') return 'fara_efect'; M.grTitlu = (M.grTitlu || '') + v; actualizeazaBare(); return 'scriere'; }
      if (!M.edit) { const a = F().sel.activa; porneste(adr(a.r, a.c), v, 'Enter'); return 'scriere'; }
      insereaza(v);
      return 'scriere';
    };
    I.la.sterge = g => {
      if (REG.gol) return 'fara_efect';
      if (M.gr && !M.edit) return tastaGrafic({ key: g === 'tasta_backspace' ? 'Backspace' : 'Delete', preventDefault() {} }, g, false) || 'fara_efect';
      if (M.edit) { const ed = M.edit; if (stergeAles(ed)) { ed.propus = null; deseneazaSelectia(); return g === 'tasta_backspace' ? 'stergere_inapoi' : 'stergere_inainte'; } if (g === 'tasta_backspace') { if (ed.poz > 0) { ed.text = ed.text.slice(0, ed.poz - 1) + ed.text.slice(ed.poz); ed.poz--; } } else ed.text = ed.text.slice(0, ed.poz) + ed.text.slice(ed.poz + 1); deseneazaSelectia(); return g === 'tasta_backspace' ? 'stergere_inapoi' : 'stergere_inainte'; }
      if (g === 'tasta_backspace') { const a = F().sel.activa; porneste(adr(a.r, a.c), '', 'Enter'); return 'editare'; }
      return golesteContinut();
    };
    /* ---- Alt + literă într-o fereastră (critic runda 7, GRAV K1): tasta de acces din referință (uia_excel.json › dialog.* ›
       AccessKey: Sort Add Level „ALT+A”, Delete Level „ALT+D”, Copy Level „ALT+C”, Options „ALT+O”, My data has headers „ALT+h”;
       Sort Warning Sort... „Alt+S”, Expand „Alt+E”, Continue „Alt+C”; Column Width „ALT+C”; Save As File name „ALT+n”, Save as
       type „ALT+t”, Save „Alt+s”). Butonul / caseta de bifat / butonul radio se apasă ca la clic; caseta primește focusul. Un
       eveniment tasta_acces (§4) cu ținta comenzii; fără potrivire: tasta_acces „fara_efect”. Același mecanism ca word.js. */
    root.addEventListener('keydown', e => {
      if (!dialog || !dialog.el || !e.altKey || e.ctrlKey || e.metaKey || !/^Key[A-Z]$/.test(e.code || '')) return;
      e.preventDefault();
      /* critic runda 8, GRAV E1: litera consumată aici e tot o tastă apăsată cât Alt e ținut, deci Alt nu mai e „singur”
         (KeyTips apar doar la Alt apăsat și eliberat singur; referința: Save „Alt+s”, cu „+”, față de filele „Alt, H”) */
      altSingur = false;
      e.stopImmediatePropagation();
      const re = new RegExp('^alt\\+' + e.code.slice(3) + '$', 'i');
      const cand = [...dialog.el.querySelectorAll('[data-lh-tip]')].filter(x => x.__nod && re.test(String(x.__nod.ta || '').replace(/\s+/g, '')) && L._vizibil(x));
      const x = cand.find(c => esteButon(c)) || cand.find(c => /^(ComboBox|Edit)$/.test(c.getAttribute('data-lh-tip')));
      const ina = I.stare();
      if (!x) { I.emite('tasta_acces', 'fara_efect', L._tintaDin(I, document.activeElement), ina); return; }
      let act, t;
      if (esteButon(x)) {
        t = L._canon(x.closest('[data-lh-tinta]') || x);
        act = I.la.clic(t, evFals(x), 1, 'tasta_acces');
        if (dialog && dialog.el && dialog.el.contains(x)) focusControl(x);
      } else {
        focusControl(x);
        t = L._tintaDin(I, x.querySelector('input') || x);
        act = 'focus_camp';
      }
      I.emite('tasta_acces', act || 'tasta_acces', t, ina);
    }, true);
    /* ---- tastele de acces ale panglicii (KeyTips; critic runda 7, GRAV K6) — același mecanism ca word.js:1981-2071: Alt
       apăsat și eliberat arată literele filelor, apoi ale comenzilor filei. Literele vin din referință (uia_excel.json →
       date/excel.json › `ta`: Home „Alt, H”, Insert „Alt, N”, Data „Alt, A”, Bold „Alt, H, 1”, AutoSum ▾ „Alt, H, U”, rândurile
       listei AutoSum „Alt, H, U, S”…). Fiecare tastă emite tasta_acces (§4); o tastă care duce la capăt șirul apasă comanda
       prin același drum ca clicul (I.activeazaTasta, partea comună). Word nu e atins: codul e copiat, nu mutat. */
    const kt = { activ: false, cale: [], prefix: '', insigne: [] };
    function ktCurata() { kt.insigne.forEach(x => x.remove()); kt.insigne = []; }
    function ktIesi() { ktCurata(); kt.activ = false; kt.cale = []; kt.prefix = ''; }
    function ktTinte(cale) {
      cale = cale || kt.cale;
      const R = root.getBoundingClientRect(), out = [];
      (backstage ? backstage.strat : root).querySelectorAll('[data-lh-tip]').forEach(x => {
        const n = x.__nod;
        if (!n || !n.ta || !L._vizibil(x) || x.closest('.lh-ap-cadru')) return;
        /* rândurile galeriei Data Labels (AccessKey „ALT+R”…, runda 17): litera lor e nivelul următor cât lista e deschisă */
        const am = /^ALT\+(\S)$/i.exec(String(n.ta).trim());
        if (am) { const sub = subMeniu(); if (sub && sub.contains(x)) out.push({ x, cheie: am[1].toUpperCase() }); return; }
        const p = String(n.ta).split(',').map(s => s.replace(/\s+/g, ''));
        if (p[0] !== 'Alt' || p.length !== cale.length + 2) return;
        for (let i = 0; i < cale.length; i++) if (p[i + 1] !== cale[i]) return;
        out.push({ x, cheie: p[p.length - 1] });
      });
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
      if (!/^[a-z0-9]$/i.test(e.key)) { I.tastaFaraClic('fara_efect'); return false; }
      kt.prefix += e.key.toUpperCase();
      const { out } = ktTinte();
      const exact = out.find(o => o.cheie === kt.prefix);
      if (exact) {
        const cheie = kt.prefix;
        kt.prefix = '';
        ktCurata();
        const camp = exact.x.matches('input:not([readonly])') ? exact.x : exact.x.querySelector('input:not([readonly])');
        if (camp) {
          ktIesi();
          try { camp.focus({ preventScroll: true }); camp.select(); } catch (x) { /* */ }
          I.tastaFaraClic('camp', exact.x);
          return true;
        }
        I.activeazaTasta(exact.x, cheie);
        /* nivelul următor: ce s-a deschis are la rândul lui taste (fila Home, lista AutoSum ▾, File → Backstage) */
        const cale = kt.cale.concat([cheie]);
        if (kt.activ && ktTinte(cale).out.length) { kt.cale = cale; ktArata(); } else ktIesi();
      } else if (out.some(o => o.cheie.indexOf(kt.prefix) === 0)) { ktArata(); I.tastaFaraClic('prefix_tasta_acces'); }
      else { kt.prefix = kt.prefix.slice(0, -1); I.tastaFaraClic('fara_efect'); }
      return true;
    }
    /* Alt+= = Sum (uia_excel.json › panglica.TabHome › Button „Sum”, AccessKey „Alt+=”; scenarii_real/excel-alt-egal.json:
       B5 „=SUM(B2:B4)” = 24 după Enter) și Ctrl+Shift+% = Percent Style (panglica.TabHome › Percent Style, scurtătura
       „Ctrl+Shift+%”). Partea comună (gestTasta) nu dă gest pentru Alt+caracter și Ctrl+Shift+cifră, deci Excel le prinde
       aici și emite singur: tasta_acces cu ținta comenzii Sum (§4: tasta e AccessKey-ul ei), ctrl_shift_5 cu ținta comenzii
       Percent Style. Cu o fereastră, Backstage sau un meniu deschis, ori în editare: fara_efect. */
    const tintaCmd = id => { const x = root.querySelector('[data-lh-suprafata="panglica.TabHome"] [data-lh-id-mso="' + id + '"]'); return x ? L._tintaDin(I, x) : 'panglica:Home/' + id; };
    function scurtaturaPanglica(e) {
      const sum = e.altKey && !e.ctrlKey && !e.metaKey && (e.code === 'Equal' || e.key === '=');
      const pr = (e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey && (e.code === 'Digit5' || e.key === '%');
      if (!sum && !pr) return false;
      e.preventDefault();
      e.stopPropagation();
      const ina = I.stare();
      const liber = !dialog && !backstage && !meniu && !REG.gol && !redenumire;
      let act = 'fara_efect';
      if (sum && liber && !M.edit) act = autoSum();
      if (pr && liber && !M.edit) act = procent();
      I.emite(sum ? 'tasta_acces' : 'ctrl_shift_5', act || 'fara_efect', sum ? tintaCmd('AutoSum') : tintaCmd('PercentStyle'), ina);
      return true;
    }
    let altSingur = false;
    root.addEventListener('keydown', e => {
      if (e.key === 'Alt') { altSingur = true; return; }
      altSingur = false;
      if (!kt.activ) { scurtaturaPanglica(e); return; }
      /* o listă deschisă din taste (Alt, N, C → lista graficelor, unde doar More Column Charts... are literă, „Alt, N, C, M”):
         săgețile și Enter merg în listă (regula meniurilor din tastaMeniu); literele rămân ale tastelor de acces */
      if (meniu && /^(ArrowDown|ArrowUp|Enter)$/.test(e.key)) { ktIesi(); return; }
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        /* Esc urcă un nivel (o listă deschisă de o tastă se închide); de pe primul nivel iese din tastele de acces */
        if (meniu) inchideMeniu();
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
      /* MINOR 1 critic 25: Alt singur într-o fereastră / în Backstage = tot un gest cu eveniment (în Excel subliniază literele de
         acces ale ferestrei); literele panglicii nu apar peste fereastră */
      if (dialog || backstage) { I.tastaFaraClic('arata_taste_acces'); return; }
      kt.activ = true;
      ktArata();
      I.tastaFaraClic('arata_taste_acces');
    });
    root.addEventListener('pointerdown', () => { if (kt.activ) ktIesi(); }, true);
    /* plasa oracolelor (CONVENTIE_ARBORE.md §4.6): deschide o suprafață fără gestul ei */
    I.deschideSuprafata = cheie => {
      if (/^panglica\./.test(cheie)) return activeazaFila(cheie.slice(9));
      if (/^backstage\./.test(cheie)) { const p = cheie.slice(10); deschideBackstage(p === 'nav' || p === 'cadru' ? 'Home' : p); return true; }
      if (/^dialog\./.test(cheie)) { const [b, fl] = cheie.split('#'); return deschideDialog(b, fl || null); }
      if (cheie === 'lista.ChartTypeColumnInsertGallery' || cheie === 'lista.ChartTypeLineInsertGallery') {
        if (!activeazaFila('TabInsert')) return false;
        const x = root.querySelector('[data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso="' + cheie.slice(6) + '"]');
        return !!(x && listaRef(cheie, x));
      }
      /* runda 17: Add Chart Element ▾ (graficul ales) și submeniul Data Labels ▸ al tipului cerut (#Data Labels = Line,
         #Data Labels#Clustered Column = coloane), ca în capturile referinței */
      if (/^lista\.AddChartElementMenu/.test(cheie)) {
        const tip = cheie === 'lista.AddChartElementMenu' ? null : Object.keys(GR_ETICHETE).find(t => GR_ETICHETE[t] === cheie);
        if (cheie !== 'lista.AddChartElementMenu' && !tip) return false;
        if (!grafice().length) { if (insereazaGrafic(tip || 'Clustered Column') !== 'inserare_grafic') return false; }
        M.gr = { i: 0, parte: 'grafic' };
        if (tip && grafice()[0].tip !== tip) grafice()[0].tip = tip;
        deseneazaGrafice();
        if (!activeazaFila('Ctx_ChartDesign')) return false;
        const x = [...root.querySelectorAll('[data-lh-id-mso="AddChartElementMenu"]')].find(y => L._vizibil(y));
        if (!(x && listaRef('lista.AddChartElementMenu', x))) return false;
        if (!tip) return true;
        const dl = [...meniu.querySelectorAll('[data-lh-tip="MenuItem"]')].find(y => y.getAttribute('data-lh-eticheta') === 'Data Labels');
        return !!(dl && submeniuEtichete(dl) === 'submeniu');
      }
      if (/^panglica_context\./.test(cheie)) {
        if (!grafice().length) { if (insereazaGrafic('Clustered Column') !== 'inserare_grafic') return false; } else { M.gr = { i: 0, parte: 'grafic' }; deseneazaGrafice(); }
        return activeazaFila(cheie.slice(17));
      }
      if (/^lista\./.test(cheie)) {
        const anc = { 'lista.AutoSum': 'AutoSumMenu_Dropdown', 'lista.Borders': 'BordersGallery_Dropdown' }[cheie];
        if (!anc || !activeazaFila('TabHome')) return false;
        const x = root.querySelector('[data-lh-suprafata="panglica.TabHome"] [data-lh-id-mso="' + anc + '"]');
        return !!(x && listaRef(cheie, x));
      }
      if (/^meniu_contextual\./.test(cheie)) { const R = celEl.B2 ? celEl.B2.getBoundingClientRect() : root.getBoundingClientRect(); return !!meniuContextual(cheie, R.left + 4, R.top + 4); }
      return false;
    };
    I.distruge = () => { inchideMeniu(); };
    /* ecran îngust (telefon, I1): totul rămâne și se derulează; grila are zona ei de derulare */
    void scenariu;
  }

  L._modul('excel', {
    creeaza,
    /* §4.4: tragerea (mutarea zonei) are sens pe o zonă aleasă; umplerea pornește de pe pătrățelul celulei alese */
    demonstratie: {}
  });
})();
