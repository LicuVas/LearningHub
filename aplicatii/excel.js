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
    if (/e/i.test(s) || s.replace('-', '').length > 11) {
      if (Math.abs(n) >= 1e11 || Math.abs(n) < 1e-9) s = n.toExponential(5).replace(/\.?0+e/, 'e').replace('e', 'E').replace(/E([+-])(\d)$/, 'E$10$2');
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
      let m = /^(\$?[A-Za-z]{1,3}\$?\d+)(:\$?[A-Za-z]{1,3}\$?\d+)?(?![A-Za-z0-9_(])/.exec(r);
      if (m && pa(m[1]) && (!m[2] || pa(m[2].slice(1)))) { out.push({ t: m[2] ? 'zona' : 'ref', s: m[0] }); i += m[0].length; continue; }
      m = /^([A-Za-z][A-Za-z0-9_.]*)\s*\(/.exec(r);
      if (m) { out.push({ t: 'fn', v: m[1].toUpperCase(), s: m[1].toUpperCase() + '(' }); i += m[0].length; continue; }
      m = /^(TRUE|FALSE)(?![A-Za-z0-9_(])/i.exec(r);
      if (m) { out.push({ t: 'bool', v: m[1].toUpperCase() === 'TRUE', s: m[1].toUpperCase() }); i += m[0].length; continue; }
      m = reNum.exec(r);
      if (m) { out.push({ t: 'num', v: parseFloat(m[0].replace(',', '.')), s: m[0] }); i += m[0].length; continue; }
      m = /^(<>|<=|>=|[-+*/^&=<>%()])/.exec(r);
      if (m) { out.push({ t: 'op', s: m[0] }); i += m[0].length; continue; }
      if (ch === sep) { out.push({ t: 'sep', s: sep }); i++; continue; }
      m = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(r);
      if (m) { out.push({ t: 'nume', v: m[0].toUpperCase(), s: m[0] }); i += m[0].length; continue; }
      throw new Error('caracter');
    }
    return out;
  }
  /* funcțiile simulate: [minim, maxim de argumente]; un nume necunoscut dă #NAME? (ca în Excel) */
  const FN = {
    ABS: [1, 1], AND: [1, 255], AVERAGE: [1, 255], AVERAGEIF: [2, 3], CONCAT: [1, 255], CONCATENATE: [1, 255], COUNT: [1, 255],
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
    const H = L._module.stare.istoric(() => false);   // fiecare confirmare = o unitate (scenarii_real/excel-ctrl-z-celula)
    const SUP = date.suprafete, Z = date.zona || {};
    const scenariu = !!I.opt.scenariu;
    const clona = L._clona;

    /* ============================================================ modelul */
    const M = { foi: [], fi: 0, nume: null, salvat: false, edit: null, clip: null, tabCol: null, zoom: 100, mesaj: null };
    function foaieNoua(nume) { return { nume, cel: {}, fmt: {}, merge: [], sel: { activa: { r: 0, c: 0 }, zone: [{ r0: 0, c0: 0, r1: 0, c1: 0 }] } }; }
    const F = () => M.foi[M.fi];
    function puneStart(f, celule, format) {
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
    if (Array.isArray(c.foi) && c.foi.length) c.foi.forEach((x, i) => { const f = foaieNoua(String(x.nume || 'Sheet' + (i + 1))); puneStart(f, x.celule, x.format); M.foi.push(f); });
    else { const tab = ((Z.file_foi || {}).c || []).find(x => x.t === 'TabItem'); M.foi.push(foaieNoua(tab ? tab.e : 'Sheet1')); puneStart(M.foi[0], c.celule, c.format); }
    if (c.selectie) {
      const parti = String(c.selectie).split(',').map(zonaDin).filter(Boolean);
      if (parti.length) F().sel = { activa: { r: parti[0].r0, c: parti[0].c0 }, zone: parti };
    }
    if (c.nume) { M.nume = /\.[a-z0-9]{2,5}$/i.test(c.nume) ? String(c.nume) : c.nume + '.xlsx'; M.salvat = true; }
    const BOOK = (Z.registru || {}).e || 'Book1';

    /* ---- valorile (recalculare la cerere, cu ciclu → 0) */
    let cache = null;
    function valoare(f, r, c0) {
      const a = adr(r, c0), x = f.cel[a];
      if (!x) return null;
      if (!x.f) return x.v;
      if (!cache) cache = new Map();
      const k = f.nume + '!' + a;
      if (cache.has(k)) { const v = cache.get(k); return v === CICLU ? 0 : v; }
      cache.set(k, CICLU);
      let v;
      try { v = evalua(f, arbore(jetoane(x.f.slice(1), 'en'))); } catch (e) { v = eErr(e) ? e : ERR('#NAME?'); }
      if (v && v.zona) v = v.vals.length ? v.vals[0] : null;
      if (v === null) v = 0;
      cache.set(k, v);
      return v;
    }
    const CICLU = {};
    const invalid = () => { cache = null; };
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
        case 'neg': return -num(un(f, n.a));
        case 'pct': return num(un(f, n.a)) / 100;
        case 'op': {
          const a = un(f, n.a), b = un(f, n.b);
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
    const textCelula = (f, r, c0) => { const a = adr(r, c0), x = f.cel[a]; if (!x) return ''; return afisat(valoare(f, r, c0), fmtDe(f, a).format_numar); };
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
        const o = { valoare: eErr(v) ? v.e : v, text: afisat(v, fmtDe(f, a).format_numar) };
        if (x.f) o.formula = x.f;
        cel[a] = o;
      });
      /* celula în editare: pe ecran e textul tastat (§3 „ecranul = starea”), deci și aici; `editare` spune că nu e încă primit */
      if (M.edit) cel[M.edit.a] = { valoare: M.edit.text, text: M.edit.text, editare: true };
      if (M.edit && M.edit.text === '') delete cel[M.edit.a];
      Object.keys(f.fmt).forEach(a => {
        const o = {}, x = f.fmt[a];
        ['bold', 'italic', 'underline'].forEach(k => { if (x[k]) o[k] = true; });
        if (x.aliniere) o.aliniere = x.aliniere;
        if (x.imbinat) o.imbinat = x.imbinat;
        if (x.format_numar && x.format_numar !== 'General') o.format_numar = x.format_numar;
        if (Object.keys(o).length) fmt[a] = o;
      });
      return { celule: cel, format_celule: fmt, selectie: selectieStare(), nume_fisier: M.nume, fereastra_mesaj: M.mesaj,
        ramane_in_editare: !!M.edit, foi: M.foi.map(x => x.nume), foaie_activa: F().nume, dialog: dialog ? { titlu: (date.dialoguri[dialog.baza] || {}).titlu || '' } : null,
        pagina_backstage: backstage ? backstage.pagina : null, titlu_fereastra: titlu() };
    };
    const titlu = () => (M.nume ? M.nume.replace(/\.[a-z0-9]{2,5}$/i, '') : BOOK) + '  -  Excel';
    const instantaneu = () => ({ foi: clona(M.foi), fi: M.fi });
    function schimba(tip, fn) {
      H.inainte(tip, instantaneu());
      fn();
      M.salvat = false;
      invalid();
    }

    /* ============================================================ fereastra (din date/excel.json) */
    let filaActiva = 'TabHome', strat = null, meniu = null, dialog = null, backstage = null;
    root.innerHTML = '';
    const el = (tag, cls, attrs) => { const e = document.createElement(tag); if (cls) e.className = cls; Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
    const pozitie = (e, r, baza) => { e.style.position = 'absolute'; e.style.left = (r[0] - (baza ? baza[0] : 0)) + 'px'; e.style.top = (r[1] - (baza ? baza[1] : 0)) + 'px'; };
    const sus = el('div', 'lh-ap-sus'), susIn = el('div', 'lh-ap-sus-in');
    sus.appendChild(susIn);
    /* Acces rapid: în Excel bara e afișată (uia_excel.json › acces_rapid.afisat = True) și stă în bara de titlu */
    const QAT = new Set();
    (function u(n, inQ) { if (!n) return; const q = inQ || (n.t === 'ToolBar' && n.e === 'Quick Access Toolbar'); if (q) QAT.add(n); (n.c || []).forEach(x => u(x, q)); })(SUP.bara_titlu, false);
    const LANSATOR = { ShowClipboard: null, FormatCellsFontDialog: 'Font', CellAlignmentOptions: 'Alignment', FormatCellsNumberDialog: 'Number' };
    let elMod = null, elZoomText = null, elTitlu = null;
    const OPT = {
      tinta(n, ctx) {
        if (QAT.has(n) && ctx.cheie === 'bara_titlu') {
          if (n.t === 'ToolBar' || n.t === 'SplitButton') return null;
          if (n.t === 'MenuItem' && /More Options/.test(n.e || '')) return 'meniu_derulant:Quick Access Toolbar/' + ((ctx.parinteUnit || {}).e || '');
          if (n.t === 'MenuItem') return 'meniu_derulant:' + n.e;
          return 'acces_rapid:' + ((ctx.parinteUnit && ctx.parinteUnit.t === 'SplitButton') ? ctx.parinteUnit.e : n.e);
        }
        if (/^panglica/.test(ctx.cheie || '') && n.t === 'Button' && n.id && n.id in LANSATOR) return 'lansator:' + [ctx.fila, ctx.grup].filter(Boolean).join('/');
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
      },
      editabil(n, ctx) { return ctx.cheie === 'dialog.FileSaveAs' && n.t === 'Edit' && /^File name/.test(n.e); }
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
    paneFoaie.appendChild(paneReg);
    zonaSup.append(randF, paneFoaie);
    const intrare = el('textarea', 'lh-ap-intrare', { 'data-lh-intrare-document': '', 'aria-label': 'Grid', autocomplete: 'off', autocorrect: 'off',
      autocapitalize: 'off', spellcheck: 'false', rows: '1' });
    I.intrare = intrare;

    const jos = el('div', 'lh-ap-jos'), josIn = el('div', 'lh-ap-jos-in');
    const stareEl = desen('bara_stare');
    pozitie(stareEl, SUP.bara_stare.r, [0, SUP.bara_stare.r[1]]);
    josIn.appendChild(stareEl);
    jos.appendChild(josIn);
    root.append(sus, zonaSup, jos);

    /* ---- filele panglicii */
    function deseneazaFile() {
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
    const z = () => M.zoom / 100;
    const LC = () => 64 * z(), HR = () => 19 * z(), HA = () => 20 * z(), LA = () => 26 * z();
    let NR = 0, NC = 0, celEl = {};
    function intindere() {
      const f = F(), u = ultim(f), a = f.sel.activa;
      let r = Math.max(u.r, a.r), c0 = Math.max(u.c, a.c);
      f.sel.zone.forEach(x => { if (x.r1 < MAXR - 1) r = Math.max(r, x.r1); if (x.c1 < MAXC - 1) c0 = Math.max(c0, x.c1); });
      return { r: Math.max(40, r + 12), c: Math.max(26, c0 + 6) };
    }
    function mergeLa(f, r, c0) { for (const m of f.merge) { const q = zonaDin(m); if (q && inZona(q, r, c0)) return q; } return null; }
    function deseneazaGrila() {
      const f = F(), x = intindere();
      /* tastatura stă în celula activă: redesenarea n-are voie să-i ia focusul (altfel tastele de după Enter se pierd) */
      const aveaFocus = document.activeElement === intrare;
      if (intrare.parentNode) intrare.parentNode.removeChild(intrare);
      NR = x.r; NC = x.c;
      const lc = LC(), hr = HR();
      root.style.setProperty('--lh-ap-x-z', String(z()));
      colt.style.width = LA() + 'px'; colt.style.height = HA() + 'px';
      antC.style.left = LA() + 'px'; antC.style.height = HA() + 'px';
      antR.style.top = HA() + 'px'; antR.style.width = LA() + 'px';
      corp.style.left = LA() + 'px'; corp.style.top = HA() + 'px';
      corpIn.style.width = (NC * lc) + 'px'; corpIn.style.height = (NR * hr) + 'px';
      antCin.style.width = (NC * lc + 40) + 'px'; antRin.style.height = (NR * hr + 40) + 'px';
      antCin.innerHTML = ''; antRin.innerHTML = ''; corpIn.innerHTML = ''; celEl = {};
      for (let c0 = 0; c0 < NC; c0++) {
        const h = el('div', 'lh-ap-x-ant lh-ap-x-ant-col', { 'data-lh-tip': 'DataItem', 'data-lh-eticheta': colNume(c0), 'data-lh-tinta': 'antet_coloana', 'data-lh-id': colNume(c0) });
        h.style.left = (c0 * lc) + 'px'; h.style.width = lc + 'px'; h.style.height = HA() + 'px';
        h.textContent = colNume(c0);
        antCin.appendChild(h);
      }
      for (let r = 0; r < NR; r++) {
        const h = el('div', 'lh-ap-x-ant lh-ap-x-ant-rand', { 'data-lh-tip': 'DataItem', 'data-lh-eticheta': String(r + 1), 'data-lh-tinta': 'antet_rand', 'data-lh-id': String(r + 1) });
        h.style.top = (r * hr) + 'px'; h.style.height = hr + 'px'; h.style.width = LA() + 'px';
        h.textContent = String(r + 1);
        antRin.appendChild(h);
      }
      const frag = document.createDocumentFragment();
      for (let r = 0; r < NR; r++) {
        for (let c0 = 0; c0 < NC; c0++) {
          const a = adr(r, c0), m = mergeLa(f, r, c0);
          const d = el('div', 'lh-ap-x-c', { 'data-lh-tinta': 'celula', 'data-lh-id': a });
          let w = lc, h = hr;
          if (m) {
            if (m.r0 !== r || m.c0 !== c0) { d.style.display = 'none'; frag.appendChild(d); celEl[a] = d; continue; }
            w = (m.c1 - m.c0 + 1) * lc; h = (m.r1 - m.r0 + 1) * hr;
            d.classList.add('lh-ap-x-imbinat');
          }
          d.style.left = (c0 * lc) + 'px'; d.style.top = (r * hr) + 'px'; d.style.width = w + 'px'; d.style.height = h + 'px';
          const x2 = f.cel[a];
          if (x2) {
            const v = valoare(f, r, c0), fm = fmtDe(f, a);
            const s = el('span', 'lh-ap-x-t');
            s.textContent = afisat(v, fm.format_numar);
            const al = fm.aliniere || (typeof v === 'number' ? 'dreapta' : typeof v === 'boolean' || eErr(v) ? 'centru' : 'stanga');
            d.classList.add('lh-ap-x-al-' + al);
            if (fm.bold) s.style.fontWeight = '700';
            if (fm.italic) s.style.fontStyle = 'italic';
            if (fm.underline) s.style.textDecoration = 'underline';
            /* textul mai lung decât celula trece peste vecinul din dreapta GOL (ca în Excel); numerele nu */
            if (al === 'stanga' && typeof v === 'string' && !m) {
              let k = c0 + 1;
              while (k < NC && !f.cel[adr(r, k)] && !mergeLa(f, r, k)) k++;
              d.style.setProperty('--lh-ap-x-max', ((k - c0) * lc) + 'px');
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
      corpIn.append(selStrat, clipStrat, maner);
      deseneazaSelectia();
      if (aveaFocus) I.focus();
      sincronDerulare();
    }
    function sincronDerulare() {
      antCin.style.transform = 'translateX(' + (-corp.scrollLeft) + 'px)';
      antRin.style.transform = 'translateY(' + (-corp.scrollTop) + 'px)';
    }
    corp.addEventListener('scroll', sincronDerulare, { passive: true });

    /* ---- selecția, chenarul copierii, pătrățelul de umplere, editarea */
    const selStrat = el('div', 'lh-ap-x-sel-strat', { 'aria-hidden': 'true' });
    const clipStrat = el('div', 'lh-ap-x-clip', { 'aria-hidden': 'true' });
    const maner = el('div', 'lh-ap-x-maner', { 'data-lh-tinta': 'maner_umplere', 'aria-label': 'Fill Handle' });
    const dr = q => { const lc = LC(), hr = HR(); return { x: q.c0 * lc, y: q.r0 * hr, w: (Math.min(q.c1, NC - 1) - q.c0 + 1) * lc, h: (Math.min(q.r1, NR - 1) - q.r0 + 1) * hr }; };
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
      antCin.querySelectorAll('.lh-ap-x-ant').forEach((h, k) => h.classList.toggle('lh-ap-x-ant-sel', s.zone.some(q => k >= q.c0 && k <= q.c1)));
      antRin.querySelectorAll('.lh-ap-x-ant').forEach((h, k) => h.classList.toggle('lh-ap-x-ant-sel', s.zone.some(q => k >= q.r0 && k <= q.r1)));
      const a = adr(s.activa.r, s.activa.c);
      I.zonaTinta = 'celula:' + a;
      /* tastatura stă în celula activă (ținta focusului la taste, §4) */
      const ce = celEl[a];
      if (ce && intrare.parentNode !== ce) {
        const aveaFocus = document.activeElement === intrare;
        ce.appendChild(intrare);
        if (aveaFocus) try { intrare.focus({ preventScroll: true }); } catch (e) { /* */ }
      }
      deseneazaEditarea();
      actualizeazaBare();
    }
    let edEl = null, caretEl = null;
    const masura = document.createElement('canvas').getContext('2d');
    function latimeText(s) { masura.font = (14.667 * z()) + 'px Calibri, Carlito, "Segoe UI", sans-serif'; return masura.measureText(s).width; }
    function deseneazaEditarea() {
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
    }
    function vedeCelula(r, c0) {
      const lc = LC(), hr = HR(), x = c0 * lc, y = r * hr;
      if (x < corp.scrollLeft) corp.scrollLeft = x;
      else if (x + lc > corp.scrollLeft + corp.clientWidth) corp.scrollLeft = x + lc - corp.clientWidth;
      if (y < corp.scrollTop) corp.scrollTop = y;
      else if (y + hr > corp.scrollTop + corp.clientHeight) corp.scrollTop = y + hr - corp.clientHeight;
    }

    /* ---- barele: Name Box, bara de formule, modul celulei (bara de stare), titlul, Undo/Redo gri */
    function actualizeazaBare() {
      const f = F(), s = f.sel, a = adr(s.activa.r, s.activa.c);
      if (document.activeElement !== inNume) inNume.value = M.trageInfo || a;
      inF.value = M.edit ? M.edit.text : textEditare(f, a);
      const mod = M.edit ? (M.edit.punct ? 'Point' : M.edit.mod) : 'Ready';
      if (elMod) { elMod.firstChild.textContent = mod; elMod.setAttribute('data-lh-eticheta', 'Cell Mode ' + mod); }
      if (elZoomText) { const t = elZoomText.querySelector('.lh-ap-text') || elZoomText; t.textContent = M.zoom + ' %'; elZoomText.setAttribute('data-lh-eticheta', 'Zoom ' + M.zoom + ' %'); }
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
    function foileFile() {
      const sem = M.foi.map(x => x.nume).join('|') + '#' + M.fi;
      if (tabFoi.__sem === sem) return;
      tabFoi.__sem = sem;
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
      const need = intindere();
      if (need.r > NR || need.c > NC) deseneazaGrila(); else deseneazaSelectia();
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
      const plin = (r2, c2) => !!f.cel[adr(r2, c2)];
      const max = { r: Math.max(ultim(f).r + 1, NR - 1), c: Math.max(ultim(f).c + 1, NC - 1) };
      const ok = (r2, c2) => r2 >= 0 && c2 >= 0 && r2 <= max.r && c2 <= max.c;
      if (ok(r + dr0, c0 + dc0) && plin(r, c0) && plin(r + dr0, c0 + dc0)) { while (ok(r + dr0, c0 + dc0) && plin(r + dr0, c0 + dc0)) { r += dr0; c0 += dc0; } }
      else { r += dr0; c0 += dc0; while (ok(r, c0) && !plin(r, c0) && ok(r + dr0, c0 + dc0)) { r += dr0; c0 += dc0; } }
      r = Math.max(0, Math.min(r, max.r)); c0 = Math.max(0, Math.min(c0, max.c));
      if (extinde) { alege(r, c0, true); } else alege(r, c0);
    }

    /* ============================================================ editarea celulei */
    function porneste(a, text, mod, poz) {
      M.edit = { a, text, mod, poz: poz == null ? text.length : poz, original: text };
      deseneazaSelectia();
      I.focus();
    }
    function insereaza(s) {
      const e = M.edit;
      e.text = e.text.slice(0, e.poz) + s + e.text.slice(e.poz);
      e.poz += s.length;
      e.punct = false;
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
      if (!ok) return false;
      M.edit = null;
      schimba('scriere', () => {
        if (nou) f.cel[e.a] = nou; else delete f.cel[e.a];
        if (fn) { f.fmt[e.a] = Object.assign({}, f.fmt[e.a] || {}, { format_numar: fn }); }
      });
      f.sel.activa = { r: p.r, c: p.c };
      deseneazaGrila();
      return true;
    }
    function renunta() { M.edit = null; deseneazaSelectia(); }
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
    /* Tab în timp ce Excel arată lista funcțiilor (după „=SU”): completează prima funcție din listă, cu „(” */
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
    function autoSum() {
      const f = F(), s = f.sel;
      if (!unaSingura()) {
        const q = s.zone[s.zone.length - 1];
        const tinta2 = q.r1 + 1 < MAXR ? { r: q.r1 + 1, c: q.c0 } : null;
        if (!tinta2) return 'fara_efect';
        schimba('scriere', () => { for (let c0 = q.c0; c0 <= q.c1; c0++) f.cel[adr(q.r1 + 1, c0)] = { f: '=SUM(' + adr(q.r0, c0) + ':' + adr(q.r1, c0) + ')' }; });
        actualizeaza();
        return 'suma_automata';
      }
      const a = s.activa, nr = (r, c0) => r >= 0 && c0 >= 0 && typeof valoare(f, r, c0) === 'number';
      let zona = '';
      if (nr(a.r - 1, a.c)) { let r = a.r - 1; while (nr(r - 1, a.c)) r--; zona = adr(r, a.c) + ':' + adr(a.r - 1, a.c); }
      else if (nr(a.r, a.c - 1)) { let c0 = a.c - 1; while (nr(a.r, c0 - 1)) c0--; zona = adr(a.r, c0) + ':' + adr(a.r, a.c - 1); }
      const t = '=SUM(' + zona + ')';
      porneste(adr(a.r, a.c), t, 'Enter', zona ? t.length : t.length - 1);
      return 'suma_automata';
    }
    /* Sort A to Z / Z to A (excel-sortare-a-z): zona curentă în jurul celulei active; primul rând = antet dacă e text
       deasupra unor numere (Excel îl recunoaște singur) */
    function zonaCurenta(f, r, c0) {
      if (!f.cel[adr(r, c0)]) return null;
      let q = { r0: r, c0: c0, r1: r, c1: c0 }, schimbat = true;
      const plin = (r2, c2) => r2 >= 0 && c2 >= 0 && !!f.cel[adr(r2, c2)];
      while (schimbat) {
        schimbat = false;
        for (let c2 = q.c0 - 1; c2 <= q.c1 + 1; c2++) { if (plin(q.r0 - 1, c2)) { q.r0--; schimbat = true; break; } if (plin(q.r1 + 1, c2)) { q.r1++; schimbat = true; break; } }
        for (let r2 = q.r0 - 1; r2 <= q.r1 + 1; r2++) { if (plin(r2, q.c0 - 1)) { q.c0--; schimbat = true; break; } if (plin(r2, q.c1 + 1)) { q.c1++; schimbat = true; break; } }
      }
      return q;
    }
    function sorteaza(desc) {
      const f = F(), a = f.sel.activa;
      const q = unaSingura() ? zonaCurenta(f, a.r, a.c) : f.sel.zone[0];
      if (!q) return I.nesimulat(desc ? 'Sort Z to A' : 'Sort A to Z');
      let antet = false;
      for (let c0 = q.c0; c0 <= q.c1 && !antet; c0++) {
        const v0 = valoare(f, q.r0, c0);
        if (typeof v0 === 'string') for (let r = q.r0 + 1; r <= q.r1; r++) if (typeof valoare(f, r, c0) === 'number') { antet = true; break; }
      }
      if (fmtDe(f, adr(q.r0, q.c0)).bold && !fmtDe(f, adr(q.r0 + 1, q.c0)).bold) antet = true;
      const r0 = antet ? q.r0 + 1 : q.r0, col = Math.max(q.c0, Math.min(q.c1, a.c));
      const randuri = [];
      for (let r = r0; r <= q.r1; r++) {
        const o = { k: valoare(f, r, col), cel: [], fmt: [] };
        for (let c0 = q.c0; c0 <= q.c1; c0++) { o.cel.push(f.cel[adr(r, c0)]); o.fmt.push(f.fmt[adr(r, c0)]); }
        randuri.push(o);
      }
      const cmp = (x, y) => { if (x.k == null) return y.k == null ? 0 : 1; if (y.k == null) return -1; return compara(x.k, y.k); };
      randuri.sort((x, y) => desc ? (x.k == null ? 1 : y.k == null ? -1 : -compara(x.k, y.k)) : cmp(x, y));
      schimba('sortare', () => randuri.forEach((o, i) => o.cel.forEach((x, k) => {
        const ad = adr(r0 + i, q.c0 + k);
        if (x) f.cel[ad] = x; else delete f.cel[ad];
        if (o.fmt[k]) f.fmt[ad] = o.fmt[k]; else delete f.fmt[ad];
      })));
      actualizeaza();
      return desc ? 'sortare_descrescatoare' : 'sortare_crescatoare';
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
    function focusStrat() {
      const s = dialog ? dialog.el : backstage ? backstage.strat : null;
      if (!s) { I.focus(); return; }
      if (s.contains(document.activeElement)) return;
      if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '-1');
      try { s.focus({ preventScroll: true }); } catch (e) { /* */ }
    }
    function inchideDialog() { if (!dialog) return; dialog.strat.remove(); dialog = null; focusStrat(); }
    function deschideDialog(baza, fila) {
      const info = date.dialoguri[baza];
      if (!info) return false;
      inchideMeniu();
      if (dialog) inchideDialog();
      dialog = { baza, strat: stratNou('lh-ap-strat-dialog'), fila: null };
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
      const nf = s.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      if (nf) { nf.value = (M.nume ? M.nume : BOOK + '.xlsx'); setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0); }
      else { s.setAttribute('tabindex', '-1'); setTimeout(() => { if (dialog && dialog.el === s) focusStrat(); }, 0); }
    }
    function salveazaDinDialog() {
      const x = dialog && dialog.el.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      const v = String(x ? x.value : '').trim().replace(/[\\/:*?"<>|]/g, '');
      if (!v) return 'fara_efect';
      M.nume = /\.[a-z0-9]{2,5}$/i.test(v) ? v : v + '.xlsx';
      M.salvat = true;
      inchideDialog();
      if (backstage) inchideBackstage();
      actualizeazaBare();
      return 'salvare';
    }
    function implicitDialog() {
      if (!dialog) return null;
      if (dialog.baza === 'dialog.FileSaveAs') return salveazaDinDialog();
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
    /* Ctrl+S pe un registru nesalvat: pagina File › Save As (de_verificat R6-4); F12: fereastra Save As (dialog.FileSaveAs) */
    function salveaza() {
      if (M.edit && !confirma()) return 'fara_efect';
      if (M.nume) { M.salvat = true; actualizeazaBare(); return 'salvare'; }
      deschideBackstage('Save As');
      return 'pagina_backstage';
    }

    /* ============================================================ comenzile panglicii (după idMso) */
    const LANSATOR_FILA = LANSATOR;
    function apasa(elx, tinta) {
      const id = elx.getAttribute('data-lh-id-mso') || (elx.closest('[data-lh-id-mso]') || { getAttribute: () => null }).getAttribute('data-lh-id-mso');
      const n = elx.__nod || {}, nume = String(n.e || tinta.replace(/^.*\//, ''));
      if (elx.getAttribute('aria-disabled') === 'true' || (elx.closest('[aria-disabled="true"]') && root.contains(elx.closest('[aria-disabled="true"]')))) return 'indisponibil';
      if (M.edit && !/^(AutoSum)$/.test(id || '') && !confirma()) return 'fara_efect';
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
        case 'Copy': return copiaza(false);
        case 'Cut': return copiaza(true);
        case 'Paste': return lipeste();
        case 'FileSave': return salveaza();
        case 'Undo': return anuleaza();
        case 'Redo': return reface();
      }
      if (id && id in LANSATOR_FILA) return LANSATOR_FILA[id] ? (deschideDialog('dialog.FormatCellsDialog', LANSATOR_FILA[id] === 'Number' ? null : LANSATOR_FILA[id]) ? 'fereastra' : I.nesimulat(nume)) : I.nesimulat(nume);
      if (id && date.lansatoare[id]) return deschideDialog(date.lansatoare[id]) ? 'fereastra' : I.nesimulat(nume);
      return I.nesimulat(nume);
    }

    /* ============================================================ gesturile (aplicatii.js le cheamă; §4) */
    const celulaDin = t => { const m = /^celula:([A-Z]+\d+)$/.exec(t || ''); return m ? pa(m[1]) : null; };
    function celulaLa(x, y) {
      const b = corp.getBoundingClientRect();
      const cx = x - b.left + corp.scrollLeft, cy = y - b.top + corp.scrollTop;
      return { r: Math.max(0, Math.min(NR - 1, Math.floor(cy / HR()))), c: Math.max(0, Math.min(NC - 1, Math.floor(cx / LC()))) };
    }
    const inGrila = tg => corp.contains(tg) || antC.contains(tg) || antR.contains(tg) || colt.contains(tg);
    I.la = {};
    let ancora = null, josFacut = false;
    I.la.jos = (e, tinta) => {
      const tg = e.target;
      if (meniu && !meniu.contains(tg)) inchideMeniu();
      josFacut = false;
      if (dialog || backstage || !inGrila(tg) || tg === maner || tg.closest('.lh-ap-x-maner')) {
        if (tg === maner) { ancora = { umplere: true }; return 'umplere'; }
        ancora = null;
        if (!dialog && !backstage && !tg.closest('input,textarea,select')) setTimeout(() => { if (!dialog && !backstage && document.activeElement !== inNume) I.focus(); }, 0);
        return null;
      }
      const p = celulaDin(tinta);
      if (p) {
        josFacut = true;
        if (M.edit) {
          if (M.edit.a === adr(p.r, p.c)) { ancora = null; return 'selectie'; }
          if (poatePuncta()) { insereaza(adr(p.r, p.c)); M.edit.punct = true; ancora = { punct: true, de: p }; I.focus(); return 'selectie'; }
          if (!confirma()) { ancora = null; return 'selectie'; }
        }
        M.tabCol = null;
        alege(p.r, p.c, e.shiftKey, (e.ctrlKey || e.metaKey) && !e.shiftKey);
        ancora = { de: p };
        I.focus();
        return 'selectie';
      }
      const ac = /^antet_coloana:([A-Z]+)$/.exec(tinta || ''), ar = /^antet_rand:(\d+)$/.exec(tinta || '');
      if (ac || ar || tinta === 'selecteaza_tot') {
        if (M.edit && !confirma()) return null;
        const s = F().sel;
        const q = ac ? { r0: 0, c0: colIdx(ac[1]), r1: MAXR - 1, c1: colIdx(ac[1]) } : ar ? { r0: +ar[1] - 1, c0: 0, r1: +ar[1] - 1, c1: MAXC - 1 } : { r0: 0, c0: 0, r1: MAXR - 1, c1: MAXC - 1 };
        s.zone = [q]; s.activa = { r: ac ? corp.scrollTop / HR() | 0 : q.r0, c: ar ? corp.scrollLeft / LC() | 0 : q.c0 };
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
    };
    I.la.misca = (e, j) => {
      if (!ancora) return;
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
        const a0 = adr(ancora.de.r, ancora.de.c), z2 = p.r === ancora.de.r && p.c === ancora.de.c ? a0 : zonaText({ r0: Math.min(p.r, ancora.de.r), c0: Math.min(p.c, ancora.de.c), r1: Math.max(p.r, ancora.de.r), c1: Math.max(p.c, ancora.de.c) });
        const i = e2.text.lastIndexOf(ancora.ultim || a0, e2.poz);
        if (i >= 0) { const u = ancora.ultim || a0; e2.text = e2.text.slice(0, i) + z2 + e2.text.slice(i + u.length); e2.poz = i + z2.length; ancora.ultim = z2; deseneazaSelectia(); }
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
      if (!g) return null;
      if (g === 'umplere_tragere' && an && an.umplere) { const p = celulaLa(e.clientX, e.clientY); return umple(p.r, p.c); }
      if (g === 'selectie') { deseneazaSelectia(); return an && an.punct ? 'referinta' : 'selectare'; }
      return null;
    };
    I.la.clic = (tinta, e, n, g) => {
      const tg = e.target;
      const elx = tg && tg.closest ? tg.closest('[data-lh-tinta]') : null;
      if (!tinta) return null;
      const [fel] = tinta.split(':');
      const v = tinta.slice(fel.length + 1);
      const p = celulaDin(tinta);
      if (p && !dialog && !backstage) {
        if (!josFacut) { if (M.edit && !confirma()) return 'fara_efect'; alege(p.r, p.c, e.shiftKey, e.ctrlKey || e.metaKey); }
        josFacut = false;
        if (M.edit && M.edit.punct) return 'referinta';
        return e.shiftKey ? 'extindere_selectie' : (e.ctrlKey || e.metaKey) ? 'adaugare_selectie' : 'selectare_celula';
      }
      josFacut = false;
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
        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat(v);
        if (elx.closest('[data-lh-suprafata="backstage.nav"]') && n2.t === 'ListItem') {
          if (n2.a === 0) return 'indisponibil';
          if (v === 'Save') { if (M.nume) { M.salvat = true; inchideBackstage(); return 'salvare'; } return arataPaginaBackstage('Save As') ? 'pagina_backstage' : I.nesimulat(v); }
          return arataPaginaBackstage(v) ? 'pagina_backstage' : I.nesimulat(v);
        }
        return I.nesimulat(v);
      }
      if (fel === 'fila_dialog' && dialog) { arataFilaDialog((date.dialoguri[dialog.baza].file.some(x => x.fila === v) && v !== date.dialoguri[dialog.baza].file[0].fila) ? v : null); return 'fila_dialog'; }
      if (fel === 'dialog_salvare' && dialog) return v === 'Save' ? salveazaDinDialog() : (inchideDialog(), 'anulare');
      if (fel === 'fereastra' && dialog) {
        if (/^(OK|Insert)$/.test(v)) return implicitDialog();
        if (/^(Cancel|Închidere|Close)$/.test(v)) { inchideDialog(); return 'anulare'; }
        return I.nesimulat(v);
      }
      if (fel === 'camp') return 'camp';
      if (dialog && dialog.strat.contains(elx)) return I.nesimulat(v);
      if (fel === 'meniu' && meniu && meniu.contains(elx)) {
        inchideMeniu();
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
      if (fel === 'acces_rapid' || fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return apasa(elx, tinta);
      return I.nesimulat(v || tinta);
    };
    I.la.dublu = tinta => {
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
      if (/^antet_coloana:/.test(tinta || '')) return meniuContextual('meniu_contextual.antet_coloana', e.clientX, e.clientY);
      if (/^antet_rand:/.test(tinta || '')) return meniuContextual('meniu_contextual.antet_rand', e.clientX, e.clientY);
      if (/^fila_foii:/.test(tinta || '')) return meniuContextual('meniu_contextual.fila_foii', e.clientX, e.clientY);
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
        if (e.target === inNume) {
          if (k === 'Enter') { e.preventDefault(); const q = zonaDin(inNume.value); inNume.blur(); if (q) { F().sel = { activa: { r: q.r0, c: q.c0 }, zone: [q] }; actualizeaza(); vedeCelula(q.r0, q.c0); I.focus(); return 'salt_la_adresa'; } inNume.value = adr(F().sel.activa.r, F().sel.activa.c); I.focus(); return 'fara_efect'; }
          if (k === 'Escape') { inNume.blur(); actualizeazaBare(); I.focus(); return 'anulare'; }
          return null;
        }
        if (dialog && k === 'Escape') { inchideDialog(); return 'anulare'; }
        if (dialog && k === 'Enter' && dialog.strat.contains(e.target)) {
          e.preventDefault();
          if (dialog.baza === 'dialog.FileSaveAs') I.activat = 'dialog_salvare:Save';
          return implicitDialog();
        }
        return null;
      }
      if (dialog) {
        if (k === 'Escape') { inchideDialog(); return 'anulare'; }
        if (k === 'Enter') { e.preventDefault(); return implicitDialog(); }
        return 'fara_efect';
      }
      if (meniu && k === 'Escape') { inchideMeniu(); return 'inchidere_meniu'; }
      if (backstage) { if (k === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }
      const ctrl = e.ctrlKey || e.metaKey;
      if (g === 'tasta_f12') { e.preventDefault(); if (M.edit && !confirma()) return 'fara_efect'; return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat('Save As'); }
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
        if (g === 'tasta_f2') { ed.mod = ed.mod === 'Edit' ? 'Enter' : 'Edit'; deseneazaSelectia(); return 'mod_editare'; }
        if (g === 'tasta_f4') { e.preventDefault(); return f4(); }
        if (k === 'Backspace') { e.preventDefault(); if (ed.poz > 0) { ed.text = ed.text.slice(0, ed.poz - 1) + ed.text.slice(ed.poz); ed.poz--; } deseneazaSelectia(); return 'stergere_inapoi'; }
        if (k === 'Delete') { e.preventDefault(); ed.text = ed.text.slice(0, ed.poz) + ed.text.slice(ed.poz + 1); deseneazaSelectia(); return 'stergere_inainte'; }
        if (/^Arrow/.test(k)) {
          e.preventDefault();
          if (ed.mod === 'Edit' && (k === 'ArrowLeft' || k === 'ArrowRight')) { ed.poz = Math.max(0, Math.min(ed.text.length, ed.poz + (k === 'ArrowLeft' ? -1 : 1))); deseneazaSelectia(); return 'mutare_cursor'; }
          if (ed.mod === 'Edit') return 'fara_efect';
          /* modul Enter: săgeata primește conținutul și mută (excel-sageata-confirma) */
          const a = pa(ed.a);
          if (!confirma()) { deseneazaSelectia(); return 'formula_neprimita'; }
          M.tabCol = null;
          const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
          alege(a.r + d[0], a.c + d[1]);
          return 'confirmare';
        }
        if (k === 'Home' || k === 'End') { e.preventDefault(); ed.poz = k === 'Home' ? 0 : ed.text.length; deseneazaSelectia(); return 'mutare_cursor'; }
        if (ctrl && g === 'ctrl_z') { renunta(); return 'anulare'; }
        if (ctrl && g === 'ctrl_a') { e.preventDefault(); return 'fara_efect'; }
        return 'fara_efect';
      }
      /* ------------------------------------------------ fără editare */
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
      if (k === 'PageDown' || k === 'PageUp') { e.preventDefault(); const n = Math.max(1, Math.floor(corp.clientHeight / HR()) - 1); alege(a.r + (k === 'PageDown' ? n : -n), a.c, e.shiftKey); return 'mutare'; }
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
      if (dialog || backstage) return 'fara_efect';
      if (!M.edit) { const a = F().sel.activa; porneste(adr(a.r, a.c), v, 'Enter'); return 'scriere'; }
      insereaza(v);
      return 'scriere';
    };
    I.la.sterge = g => {
      if (M.edit) { const ed = M.edit; if (g === 'tasta_backspace') { if (ed.poz > 0) { ed.text = ed.text.slice(0, ed.poz - 1) + ed.text.slice(ed.poz); ed.poz--; } } else ed.text = ed.text.slice(0, ed.poz) + ed.text.slice(ed.poz + 1); deseneazaSelectia(); return g === 'tasta_backspace' ? 'stergere_inapoi' : 'stergere_inainte'; }
      if (g === 'tasta_backspace') { const a = F().sel.activa; porneste(adr(a.r, a.c), '', 'Enter'); return 'editare'; }
      return golesteContinut();
    };
    /* plasa oracolelor (CONVENTIE_ARBORE.md §4.6): deschide o suprafață fără gestul ei */
    I.deschideSuprafata = cheie => {
      if (/^panglica\./.test(cheie)) return activeazaFila(cheie.slice(9));
      if (/^backstage\./.test(cheie)) { const p = cheie.slice(10); deschideBackstage(p === 'nav' || p === 'cadru' ? 'Home' : p); return true; }
      if (/^dialog\./.test(cheie)) { const [b, fl] = cheie.split('#'); return deschideDialog(b, fl || null); }
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
