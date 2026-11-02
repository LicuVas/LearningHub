/* schema-logica.js — simulatorul de SCHEMĂ LOGICĂ (proprietar: lecția VI/24, „Reprezentarea algoritmilor prin blocuri grafice”)
 * Versiunea 1.1 (02.11.2026, reparația după judecata 1). Fișier NOU; nu atinge motorul și nici alte simulatoare.
 *   1.1 — API NESCHIMBAT; comportament: (a) la construire, atingerea unui loc îl ALEGE mereu (înainte, atingerea locului deja
 *         ales îl deselecta, iar blocul atins după primea „Atinge întâi un loc…”); (b) fiecare loc din desen are o zonă de
 *         atingere transparentă (`rect.sl-hit`, cel puțin 56 de unități în înălțime ≈ 40 px la 390 px); (c) la `urmareste`,
 *         „Verifică urmărirea” trece doar dacă drumul s-a făcut FĂRĂ greșeli (testul nou „…fără nicio greșeală”; mesajul
 *         spune câte greșeli și unde a fost prima, apoi trimite la „Ia-o de la capăt”); (d) căsuța valorii primește orice
 *         scriere a aceluiași număr („110”, „110,0”, „110.0”) și refuză, fără să socotească greșeală, un text cu spații
 *         între cifre („1 10”) sau care nu e număr.
 *
 * CE FACE
 *   - desenează o schemă logică (SVG) din blocuri: ovalul START / STOP, paralelogramul (citire / afișare),
 *     dreptunghiul (calcul / atribuire „←” / o acțiune), rombul (condiție, ieșirile DA și NU), săgețile;
 *   - EXECUTĂ schema pe un set de date de intrare, pas cu pas (unde ești, ce valori au datele, ce s-a afișat);
 *   - tipul de exercițiu `schema` pentru motor, cu trei moduri:
 *       mod:'construieste'  locuri goale + cărți-bloc: atingi locul, apoi blocul (fără tragere);
 *       mod:'coleg'         schema „unui coleg”, cu o greșeală: o rulezi pe seturi de valori, schimbi blocul greșit;
 *       mod:'urmareste'     urmărești schema pas cu pas: la romb alegi DA / NU, la dreptunghi scrii valoarea nouă.
 *     Testele judecă ce FACE schema când o execuți (ieșirea pe 2-3 seturi de valori), nu forma desenului.
 *
 * API PUBLIC (stabil; schimbările doar prin ADĂUGIRI, cu data, aici și în granița vi_l24.md):
 *   SchemaLogica.versiune                      '1.1' (1.0 până la 02.11.2026)
 *   SchemaLogica.compileaza(bloc)              -> {ok, tip, ...} sau {ok:false, mesaj}
 *   SchemaLogica.executa(schema, intrari, opt) -> {pasi:[{id, tip, valori, iesire, cond}], iesire:[...], gata, eroare, idEroare}
 *        opt.maxPasi (implicit 400) — peste: eroare „schema nu se oprește”.
 *   SchemaLogica.svg(schema, opt)              -> șir SVG (desen static; opt.acum = id-ul blocului curent, opt.ales, opt.numere)
 *   SchemaLogica.creeaza(el, cfg, gazda)       -> controlorul unui exercițiu (folosit de tipul `schema`)
 *   Forma schemei: {start:'id', blocuri:[{id, tip:'start'|'stop'|'citire'|'afisare'|'calcul'|'decizie', text,
 *        c:coloana(0..), r:rândul(0..), urm:'id' | da:'id', nu:'id', iesDa:'jos'|'stanga'|'dreapta', iesNu:…,
 *        gol:true (loc de completat), schimba:true (bloc pe care elevul îl poate înlocui)}]}
 *   Cărțile: [{id, tip, text}] — o carte dă forma ȘI textul blocului pus în loc.
 *
 * NOTAȚIA (cea a lecțiilor publicate VI/17, VI/20-22): „Citește a, b”, „Afișează x” / „Afișează „text””, „x ← x * 2”,
 *   comparații < > ≤ ≥ = ≠, legături ȘI / SAU. În romb se scrie doar condiția, fără „?” (ca în manuale; jocul algoritmi-vi pune „?”).
 *
 * CE NU SE SCHIMBĂ (pentru lecțiile care folosesc fișierul): numele tipului `schema`, forma schemei și a cărților,
 *   prefixul claselor `.sl-`, id-ul stilului `#sl-css`, regula „nimic nu se salvează, nimic nu pleacă” (0 cereri, 0 stocare).
 *
 * FIDELITATE: schema logică NU e o aplicație — e un desen pe caiet; simulatorul o desenează și o execută după regulile
 *   lecției (o săgeată din fiecare bloc, două din romb, DA și NU). Nu există „aplicația reală” de copiat; regulile sunt
 *   ale convenției școlare (sursa și variantele din manuale: lectii/vi/m4-l24/surse.md).
 */
(function () {
  'use strict';
  var VERS = '1.1';

  /* ---------------------------------------------------------------- expresii */
  var DIA = { 'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't', 'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ş': 'S', 'Ț': 'T', 'Ţ': 'T' };
  function faraDia(s) { return String(s).replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, function (c) { return DIA[c]; }); }

  function tokeni(src) {
    var t = [], i = 0, s = String(src);
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9]/.test(c)) {
        var j = i; while (j < s.length && /[0-9]/.test(s[j])) j++;
        if (s[j] === ',' && /[0-9]/.test(s[j + 1] || '') && false) { /* zecimale cu virgulă: neprevăzute în lecție */ }
        t.push({ k: 'num', v: parseInt(s.slice(i, j), 10) }); i = j; continue;
      }
      if (c === '„' || c === '"' || c === '“') {
        var inch = c === '„' ? /[”"“]/ : (c === '“' ? /[”"]/ : /["”]/), k = i + 1;
        while (k < s.length && !inch.test(s[k])) k++;
        if (k >= s.length) return { eroare: 'Un text început cu ghilimele nu e închis.' };
        t.push({ k: 'str', v: s.slice(i + 1, k) }); i = k + 1; continue;
      }
      if (/[A-Za-zĂÂÎȘŞȚŢăâîșşțţ_]/.test(c)) {
        var m = i; while (m < s.length && /[A-Za-z0-9ĂÂÎȘŞȚŢăâîșşțţ_]/.test(s[m])) m++;
        var w = s.slice(i, m), wf = faraDia(w).toUpperCase();
        if (wf === 'SI') t.push({ k: 'op', v: 'SI' });
        else if (wf === 'SAU') t.push({ k: 'op', v: 'SAU' });
        else if (wf === 'NU') t.push({ k: 'op', v: 'NU' });
        else t.push({ k: 'id', v: w });
        i = m; continue;
      }
      var doi = s.slice(i, i + 2);
      if (doi === '<=' || doi === '>=' || doi === '!=' || doi === '<>' || doi === '==') {
        if (doi === '==') return { eroare: 'În schemă egalitatea se scrie cu un singur semn: „=”.' };
        t.push({ k: 'op', v: doi === '<=' ? '≤' : doi === '>=' ? '≥' : '≠' }); i += 2; continue;
      }
      if ('+-−*×/%()<>≤≥=≠'.indexOf(c) >= 0) {
        t.push({ k: 'op', v: c === '−' ? '-' : c === '×' ? '*' : c }); i++; continue;
      }
      if (c === '←') return { eroare: 'Săgeata „←” (atribuirea) se scrie doar într-un dreptunghi, după numele datei.' };
      return { eroare: 'Semnul „' + c + '” nu face parte din notația lecției.' };
    }
    return { t: t };
  }

  function parser(t) {
    var p = 0;
    function vezi() { return t[p]; }
    function ia() { return t[p++]; }
    function e(op) { var x = t[p]; return x && x.k === 'op' && x.v === op; }
    function expr() { return sau(); }
    function sau() { var a = si(); while (e('SAU')) { ia(); var b = si(); a = { o: 'SAU', a: a, b: b }; } return a; }
    function si() { var a = nu(); while (e('SI')) { ia(); var b = nu(); a = { o: 'SI', a: a, b: b }; } return a; }
    function nu() { if (e('NU')) { ia(); return { o: 'NU', a: nu() }; } return cmp(); }
    function cmp() {
      var a = adun();
      var x = vezi();
      if (x && x.k === 'op' && '<>≤≥=≠'.indexOf(x.v) >= 0) {
        ia(); var b = adun();
        var y = vezi();
        if (y && y.k === 'op' && '<>≤≥=≠'.indexOf(y.v) >= 0) throw new Error('Două comparații lipite. Scrie-le separat, legate cu ȘI.');
        return { o: x.v, a: a, b: b };
      }
      return a;
    }
    function adun() { var a = inm(); while (e('+') || e('-')) { var o = ia().v; var b = inm(); a = { o: o, a: a, b: b }; } return a; }
    function inm() { var a = un(); while (e('*') || e('/') || e('%')) { var o = ia().v; var b = un(); a = { o: o, a: a, b: b }; } return a; }
    function un() { if (e('-')) { ia(); return { o: 'neg', a: un() }; } return prim(); }
    function prim() {
      var x = ia();
      if (!x) throw new Error('Expresia se termină prea devreme.');
      if (x.k === 'num') return { o: 'num', v: x.v };
      if (x.k === 'str') return { o: 'str', v: x.v };
      if (x.k === 'id') return { o: 'var', v: x.v };
      if (x.k === 'op' && x.v === '(') { var a = expr(); if (!e(')')) throw new Error('Lipsește paranteza „)”.'); ia(); return a; }
      throw new Error('Nu înțeleg „' + x.v + '” în locul acesta.');
    }
    var r = expr();
    if (p < t.length) throw new Error('Nu înțeleg ce urmează după „' + (t[p - 1] ? t[p - 1].v : '') + '”.');
    return r;
  }

  function compExpr(src) {
    var tk = tokeni(src);
    if (tk.eroare) return { ok: false, mesaj: tk.eroare };
    if (!tk.t.length) return { ok: false, mesaj: 'Blocul e gol.' };
    try { return { ok: true, ast: parser(tk.t) }; } catch (er) { return { ok: false, mesaj: er.message }; }
  }

  function areComparatie(a) {
    if (!a) return false;
    if ('<>≤≥=≠'.indexOf(a.o) >= 0 && a.o.length === 1) return true;
    if (a.o === 'SI' || a.o === 'SAU') return areComparatie(a.a) && areComparatie(a.b);
    if (a.o === 'NU') return areComparatie(a.a);
    return false;
  }

  function evalua(a, val) {
    switch (a.o) {
      case 'num': return a.v;
      case 'str': return a.v;
      case 'var':
        if (!Object.prototype.hasOwnProperty.call(val, a.v)) throw new Error('„' + a.v + '” nu are încă nicio valoare în acest moment. Înaintea acestui bloc trebuie un bloc care îi dă o valoare (o citire sau o atribuire).');
        return val[a.v];
      case 'neg': return -num(evalua(a.a, val));
      case '+': {
        var x = evalua(a.a, val), y = evalua(a.b, val);
        if (typeof x === 'string' || typeof y === 'string') return String(fmt(x)) + String(fmt(y));
        return x + y;
      }
      case '-': return num(evalua(a.a, val)) - num(evalua(a.b, val));
      case '*': return num(evalua(a.a, val)) * num(evalua(a.b, val));
      case '/': { var d = num(evalua(a.b, val)); if (d === 0) throw new Error('Împărțire la 0: nu se poate.'); return num(evalua(a.a, val)) / d; }
      case '%': { var d2 = num(evalua(a.b, val)); if (d2 === 0) throw new Error('Împărțire la 0: nu se poate.'); return num(evalua(a.a, val)) % d2; }
      case '<': return num(evalua(a.a, val)) < num(evalua(a.b, val));
      case '>': return num(evalua(a.a, val)) > num(evalua(a.b, val));
      case '≤': return num(evalua(a.a, val)) <= num(evalua(a.b, val));
      case '≥': return num(evalua(a.a, val)) >= num(evalua(a.b, val));
      case '=': return evalua(a.a, val) === evalua(a.b, val);
      case '≠': return evalua(a.a, val) !== evalua(a.b, val);
      case 'SI': return !!evalua(a.a, val) && !!evalua(a.b, val);
      case 'SAU': return !!evalua(a.a, val) || !!evalua(a.b, val);
      case 'NU': return !evalua(a.a, val);
    }
    throw new Error('Expresie necunoscută.');
  }
  function num(x) { if (typeof x !== 'number') throw new Error('Aici trebuie un număr, nu un text.'); return x; }
  function fmt(x) {
    if (typeof x === 'number') { var r = Math.round(x * 1000) / 1000; return String(r).replace('.', ','); }
    if (x === true) return 'adevărat'; if (x === false) return 'fals';
    return String(x);
  }

  function imparteVirgule(s) {
    var out = [], cur = '', q = false;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '„' || c === '“') q = true; else if (c === '”') q = false; else if (c === '"') q = !q;
      if (c === ',' && !q) { out.push(cur); cur = ''; } else cur += c;
    }
    out.push(cur);
    return out.map(function (x) { return x.trim(); }).filter(function (x) { return x.length; });
  }

  /* compilează textul unui bloc, după forma lui; mesajele spun ce e greșit, nu răspunsul */
  var RE_CIT = /^\s*cite[sș]te\s+(.+)$/i, RE_AFIS = /^\s*(afi[sș]eaz[aă]|scrie)\s+(.+)$/i, RE_ATR = /^\s*([A-Za-zĂÂÎȘŞȚŢăâîșşțţ_][A-Za-z0-9ĂÂÎȘŞȚŢăâîșşțţ_]*)\s*←\s*(.+)$/;
  function compileaza(b) {
    var tip = b.tip, text = String(b.text || '').replace(/ /g, ' ').trim();
    if (tip === 'start' || tip === 'stop') return { ok: true, tip: tip };
    if (tip === 'citire') {
      if (RE_AFIS.test(text)) return { ok: false, mesaj: 'În paralelogramul acesta scrie „' + text + '”: e o afișare, nu o citire. Verifică dacă așa cere algoritmul.', tipCorect: 'afisare' };
      var mc = text.match(RE_CIT);
      if (!mc) return { ok: false, mesaj: 'Într-un paralelogram scrii o citire („Citește …”) sau o afișare („Afișează …”).' };
      var nume = imparteVirgule(mc[1]);
      for (var i = 0; i < nume.length; i++) if (!/^[A-Za-zĂÂÎȘŞȚŢăâîșşțţ_][A-Za-z0-9ĂÂÎȘŞȚŢăâîșşțţ_]*$/.test(nume[i])) return { ok: false, mesaj: 'După „Citește” vin doar nume de date, despărțite prin virgulă.' };
      return { ok: true, tip: 'citire', nume: nume };
    }
    if (tip === 'afisare') {
      var ma = text.match(RE_AFIS);
      if (!ma) {
        if (RE_CIT.test(text)) return { ok: true, tip: 'citire', nume: imparteVirgule(text.match(RE_CIT)[1]) };
        return { ok: false, mesaj: 'Într-un paralelogram scrii o citire („Citește …”) sau o afișare („Afișează …”).' };
      }
      var parti = imparteVirgule(ma[2]), asts = [];
      for (var k = 0; k < parti.length; k++) { var ce = compExpr(parti[k]); if (!ce.ok) return { ok: false, mesaj: ce.mesaj }; asts.push(ce.ast); }
      return { ok: true, tip: 'afisare', exprs: asts };
    }
    if (tip === 'calcul') {
      if (RE_CIT.test(text) || RE_AFIS.test(text)) return { ok: false, mesaj: '„' + text + '” stă într-un dreptunghi. Citirea și afișarea se desenează într-un paralelogram.' };
      var atr = imparteVirgule(text), lista = [];
      for (var q = 0; q < atr.length; q++) {
        var mt = atr[q].match(RE_ATR);
        if (!mt) {
          var cx = compExpr(atr[q]);
          if (cx.ok && areComparatie(cx.ast)) return { ok: false, mesaj: '„' + atr[q] + '” e o condiție (are răspuns adevărat sau fals). O condiție se desenează într-un romb, cu ieșirile DA și NU.' };
          return { ok: false, mesaj: 'Într-un dreptunghi scrii o atribuire: numele datei, săgeata „←” și valoarea nouă (de exemplu „x ← 5”).' };
        }
        var ex = compExpr(mt[2]); if (!ex.ok) return { ok: false, mesaj: ex.mesaj };
        lista.push({ nume: mt[1], ast: ex.ast });
      }
      return { ok: true, tip: 'calcul', atr: lista };
    }
    if (tip === 'decizie') {
      var t2 = text.replace(/\?\s*$/, '').trim();
      if (RE_CIT.test(t2) || RE_AFIS.test(t2)) return { ok: false, mesaj: '„' + t2 + '” e o citire sau o afișare: se desenează într-un paralelogram, nu într-un romb.' };
      if (RE_ATR.test(t2)) return { ok: false, mesaj: '„' + t2 + '” e o atribuire: se desenează într-un dreptunghi. În romb scrii o condiție (cu <, >, =…).' };
      var cd = compExpr(t2); if (!cd.ok) return { ok: false, mesaj: cd.mesaj };
      if (!areComparatie(cd.ast)) return { ok: false, mesaj: 'În romb scrii o condiție (cu <, >, =, ≤, ≥, ≠), care e adevărată sau falsă.' };
      return { ok: true, tip: 'decizie', ast: cd.ast };
    }
    return { ok: false, mesaj: 'Bloc necunoscut.' };
  }

  /* ---------------------------------------------------------------- execuția */
  function harta(schema) { var h = {}; (schema.blocuri || []).forEach(function (b) { h[b.id] = b; }); return h; }
  function copie(o) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; }
  function iesiri(b) { return b.tip === 'decizie' ? 2 : (b.tip === 'stop' ? 0 : 1); }

  function executa(schema, intrari, opt) {
    opt = opt || {};
    var max = opt.maxPasi || 400, h = harta(schema), val = {}, iesire = [], pasi = [], id = schema.start, n = 0;
    intrari = intrari || {};
    var coada = {}; for (var k in intrari) coada[k] = Array.isArray(intrari[k]) ? intrari[k].slice() : [intrari[k]];
    function rez(eroare, idE) { return { pasi: pasi, iesire: iesire, gata: !eroare, eroare: eroare || null, idEroare: idE || null, valori: val }; }
    while (true) {
      var b = h[id];
      if (!b) return rez('O săgeată nu duce nicăieri.', id);
      if (b.gol && !b.tip) return rez('Locul ' + (b.nr || '') + ' e încă gol.', b.id);
      var leg = schema.blocuri && b.legaturi ? b.legaturi : null; // rezervat
      var c = compileaza(b);
      if (!c.ok) return rez(c.mesaj, b.id);
      var pas = { id: b.id, tip: c.tip };
      try {
        if (c.tip === 'start') { if (b.da || b.nu) return rez('Din START iese o singură săgeată.', b.id); id = b.urm; }
        else if (c.tip === 'stop') { pas.valori = copie(val); pas.iesire = iesire.slice(); pasi.push(pas); return rez(null); }
        else if (c.tip === 'citire') {
          if (b.da || b.nu) return rez('Din blocul „' + b.text + '” ies două săgeți (DA și NU), deci acolo trebuie un romb.', b.id);
          c.nume.forEach(function (nm) {
            if (!coada[nm] || !coada[nm].length) throw new Error('Pentru „' + nm + '” nu am primit nicio valoare de citit.');
            val[nm] = coada[nm].shift();
          });
          id = b.urm;
        } else if (c.tip === 'afisare') {
          if (b.da || b.nu) return rez('Din blocul „' + b.text + '” ies două săgeți (DA și NU), deci acolo trebuie un romb.', b.id);
          iesire.push(c.exprs.map(function (a) { return fmt(evalua(a, val)); }).join(' '));
          id = b.urm;
        } else if (c.tip === 'calcul') {
          if (b.da || b.nu) return rez('Din blocul „' + b.text + '” ies două săgeți (DA și NU), deci acolo trebuie un romb.', b.id);
          c.atr.forEach(function (a) { val[a.nume] = evalua(a.ast, val); });
          id = b.urm;
        } else if (c.tip === 'decizie') {
          if (!b.da || !b.nu) return rez('Din romb ies două drumuri, DA și NU, dar aici e o singură săgeată. Condiția stă în romb doar unde schema se desparte în două.', b.id);
          var r = !!evalua(c.ast, val);
          pas.cond = r; id = r ? b.da : b.nu;
        }
      } catch (er) { return rez(er.message, b.id); }
      pas.valori = copie(val); pas.iesire = iesire.slice();
      pasi.push(pas);
      if (++n > max) return rez('Schema nu se oprește: după ' + max + ' de pași tot n-a ajuns la STOP. Verifică dacă se schimbă ceva în condiția rombului.', b.id);
    }
  }

  /* ---------------------------------------------------------------- desenul */
  var CW = 160, RH = 74, PADX = 34, PADY = 14, BH = 40, RW = 128, RHh = 56, nrSvg = 0;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* textul lung (peste 16 semne) se rupe pe două rânduri, la un spațiu cât mai aproape de mijloc */
  function randuri(t) {
    if (t.length <= 16) return [t];
    var mij = t.length / 2, best = -1;
    for (var i = 1; i < t.length - 1; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mij) < Math.abs(best - mij))) best = i;
    return best < 0 ? [t] : [t.slice(0, best), t.slice(best + 1)];
  }
  function latBloc(b) {
    var r = randuri(textAfisat(b)), lung = Math.max.apply(null, r.map(function (x) { return x.length; }));
    var w = Math.max(96, lung * 7.8 + 24 + ((b.tip === 'citire' || b.tip === 'afisare') ? 22 : 0));
    return Math.min(w, CW + 30);
  }
  function textAfisat(b) {
    if (b.tip === 'start') return 'START';
    if (b.tip === 'stop') return 'STOP';
    if (b.gol && !b.tip) return '';
    var t = String(b.text || '');
    if (b.tip === 'decizie') t = t.replace(/\?\s*$/, '').trim();
    return t;
  }
  function geom(b, x0) {
    var cx = x0 + PADX + b.c * CW + CW / 2, top = PADY + b.r * RH;
    var h = (b.tip === 'decizie') ? RHh : (randuri(textAfisat(b)).length > 1 ? 54 : BH), w = (b.tip === 'decizie') ? Math.max(RW, textAfisat(b).length * 7.8 + 56) : latBloc(b);
    if (b.gol && !b.tip) { w = 104; h = BH; }
    var cy = top + h / 2;
    return { cx: cx, cy: cy, top: top, bot: top + h, l: cx - w / 2, rr: cx + w / 2, w: w, h: h };
  }
  function forma(b, g, cls) {
    var s = '';
    if (b.gol && !b.tip) {
      s = '<rect class="sl-f sl-golf" x="' + g.l + '" y="' + g.top + '" width="' + g.w + '" height="' + g.h + '" rx="6"/>';
    } else if (b.tip === 'start' || b.tip === 'stop') {
      s = '<rect class="sl-f" x="' + (g.cx - 44) + '" y="' + g.top + '" width="88" height="' + g.h + '" rx="20"/>';
    } else if (b.tip === 'citire' || b.tip === 'afisare') {
      var k = 12;
      s = '<polygon class="sl-f" points="' + (g.l + k) + ',' + g.top + ' ' + (g.rr + k / 2) + ',' + g.top + ' ' + (g.rr - k) + ',' + g.bot + ' ' + (g.l - k / 2) + ',' + g.bot + '"/>';
    } else if (b.tip === 'calcul') {
      s = '<rect class="sl-f" x="' + g.l + '" y="' + g.top + '" width="' + g.w + '" height="' + g.h + '"/>';
    } else if (b.tip === 'decizie') {
      s = '<polygon class="sl-f" points="' + g.cx + ',' + g.top + ' ' + g.rr + ',' + g.cy + ' ' + g.cx + ',' + g.bot + ' ' + g.l + ',' + g.cy + '"/>';
    }
    return s;
  }
  function punctIesire(g, b, lat) {
    if (lat === 'stanga') return { x: g.l, y: g.cy };
    if (lat === 'dreapta') return { x: g.rr, y: g.cy };
    return { x: g.cx, y: g.bot };
  }
  function svg(schema, opt) {
    opt = opt || {};
    stil();   /* desenele statice din text (fără exercițiu) au nevoie și ele de stil: altfel formele ies negre și late */
    var h = harta(schema), bl = schema.blocuri || [], id = 'sl' + (++nrSvg) + '_' + Math.floor(Math.random() * 1e6);
    var maxC = 0, maxR = 0, minC = 99;
    bl.forEach(function (b) { maxC = Math.max(maxC, b.c || 0); maxR = Math.max(maxR, b.r || 0); minC = Math.min(minC, b.c || 0); });
    var G = {}; bl.forEach(function (b) { G[b.id] = geom(b, 0); });
    var W = PADX * 2 + (maxC + 1) * CW, H = PADY * 2 + (maxR + 1) * RH - (RH - RHh) + 8;
    var cai = [], etich = [], nrBucla = 0;
    var canStanga = PADX - 8, canDreapta = W - PADX + 8;
    bl.forEach(function (b) {
      var g = G[b.id];
      var ies = [];
      if (b.tip === 'decizie' || b.da || b.nu) {
        if (b.da) ies.push({ la: b.da, lat: b.iesDa || 'jos', et: 'DA' });
        if (b.nu) ies.push({ la: b.nu, lat: b.iesNu || 'dreapta', et: 'NU' });
      } else if (b.urm) ies.push({ la: b.urm, lat: 'jos' });
      ies.forEach(function (e) {
        var d = h[e.la]; if (!d) return;
        var gd = G[d.id], p = punctIesire(g, b, e.lat), pts = [[p.x, p.y]];
        if (d.r > b.r) {
          if (e.lat === 'jos') {
            if (d.c === b.c) pts.push([p.x, gd.top]);
            else { var my = g.bot + 14; pts.push([p.x, my], [gd.cx, my], [gd.cx, gd.top]); }
          } else {
            var spre = e.lat === 'dreapta' ? 1 : -1;
            if ((spre > 0 && d.c > b.c) || (spre < 0 && d.c < b.c)) pts.push([gd.cx, p.y], [gd.cx, gd.top]);
            else {
              /* ieșirea din repetiție spre un bloc de sub ea, în aceeași coloană: pe lângă corp, intră în blocul-țintă din lateral */
              var xc = spre > 0 ? Math.max(g.rr, gd.rr) + 18 : Math.min(g.l, gd.l) - 18;
              pts.push([xc, p.y], [xc, gd.cy], [spre > 0 ? gd.rr - (gd.tip === 'citire' || gd.tip === 'afisare' ? 6 : 0) : gd.l + (gd.tip === 'citire' || gd.tip === 'afisare' ? 6 : 0), gd.cy]);
            }
          }
        } else {
          nrBucla++;
          var stg = e.lat !== 'dreapta';
          var xcan = stg ? Math.min(g.l, gd.l) - 16 - 8 * (nrBucla - 1) : Math.max(g.rr, gd.rr) + 16 + 8 * (nrBucla - 1);
          if (e.lat === 'jos') pts.push([p.x, p.y + 12], [xcan, p.y + 12]); else pts.push([xcan, p.y]);
          pts.push([xcan, gd.cy], [stg ? (gd.tip === 'decizie' ? gd.l : gd.l - (gd.tip === 'citire' || gd.tip === 'afisare' ? 4 : 0)) : gd.rr, gd.cy]);
        }
        cai.push('<path class="sl-s" d="M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + '" marker-end="url(#' + id + 'a)"/>');
        if (e.et) {
          var lx = e.lat === 'jos' ? p.x + 6 : (e.lat === 'dreapta' ? p.x + 4 : p.x - 15), ly = e.lat === 'jos' ? p.y + 14 : p.y - 6;
          etich.push('<text class="sl-et ' + (e.et === 'DA' ? 'sl-da' : 'sl-nu') + '" x="' + lx + '" y="' + ly + '">' + e.et + '</text>');
        }
      });
    });
    var forme = bl.map(function (b) {
      var g = G[b.id], cls = 'sl-b' + (opt.acum === b.id ? ' sl-acum' : '') + (opt.ales === b.id ? ' sl-ales' : '') + (b.gol ? ' sl-gol' : '') + (opt.eroare === b.id ? ' sl-err' : '') + (b.schimba ? ' sl-schimba' : '');
      var t = textAfisat(b), txt = '';
      if (t) {
        var rr = b.tip === 'decizie' ? [t] : randuri(t);
        txt = rr.map(function (linie, k) { return '<text class="sl-t" x="' + g.cx + '" y="' + (g.cy + 4.5 + (k - (rr.length - 1) / 2) * 16) + '" text-anchor="middle">' + esc(linie) + '</text>'; }).join('');
      }
      else if (b.gol) txt = '<text class="sl-t sl-tgol" x="' + g.cx + '" y="' + (g.cy + 5) + '" text-anchor="middle">' + esc(opt.numere === false ? '?' : ('locul ' + (b.nr || '?'))) + '</text>';
      if (b.gol && b.tip && opt.numere !== false) txt += '<text class="sl-nr" x="' + (g.l - 2) + '" y="' + (g.top - 3) + '">' + (b.nr || '') + '</text>';
      /* 1.1: zona de atingere a unui loc (transparentă, sub formă): cel puțin 56 de unități în înălțime, ca locul desenat să fie
         o țintă ≥ 32 px și pe telefon (la 390 px, 40 de unități ies ~29 px) */
      var hh = Math.max(g.h + 16, 56), hit = (b.gol || b.schimba) ? '<rect class="sl-hit" x="' + (g.l - 8) + '" y="' + (g.cy - hh / 2) + '" width="' + (g.w + 16) + '" height="' + hh + '" fill="transparent"/>' : '';
      return '<g class="' + cls + '" data-id="' + esc(b.id) + '">' + hit + forma(b, g) + txt + '</g>';
    }).join('');
    var aria = opt.aria || ('Schemă logică: ' + ordineText(schema));
    return '<svg class="sl-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" style="max-width:' + Math.round(W * 1.12) + 'px" role="img" aria-label="' + esc(aria) + '">' +
      '<defs><marker id="' + id + 'a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>' +
      cai.join('') + forme + etich.join('') + '</svg>';
  }
  function ordineText(schema) {
    return (schema.blocuri || []).slice().sort(function (a, b) { return (a.r - b.r) || (a.c - b.c); }).map(function (b) {
      var t = textAfisat(b) || ('locul ' + (b.nr || '') + ' gol'), f = { start: 'oval', stop: 'oval', citire: 'paralelogram', afisare: 'paralelogram', calcul: 'dreptunghi', decizie: 'romb' }[b.tip] || 'loc';
      return f + ' „' + t + '”';
    }).join(', ');
  }

  /* ---------------------------------------------------------------- ajutoare pentru pagină (exemple calculate, nu scrise de mână) */
  function dateText(intrari) {
    var p = []; for (var k in intrari) p.push(k + ' = ' + (Array.isArray(intrari[k]) ? intrari[k].join(', ') : fmt(intrari[k])));
    return p.join(', ');
  }
  /* tabelul de urmărire al unei execuții: un rând pe fiecare bloc executat (fără START/STOP) */
  function tabel(schema, intrari, opt) {
    opt = opt || {};
    var r = executa(schema, intrari), h = harta(schema), nume = [];
    r.pasi.forEach(function (p) { for (var k in p.valori || {}) if (nume.indexOf(k) < 0) nume.push(k); });
    if (opt.coloane) nume = opt.coloane;
    var rows = r.pasi.filter(function (p) { return p.tip !== 'start' && p.tip !== 'stop'; }).map(function (p, i) {
      var b = h[p.id], ce = textAfisat(b);
      var cel = nume.map(function (n) { return '<td>' + (p.valori && Object.prototype.hasOwnProperty.call(p.valori, n) ? esc(fmt(p.valori[n])) : '') + '</td>'; }).join('');
      var dupa = p.tip === 'decizie' ? (p.cond ? 'DA' : 'NU') : (p.tip === 'afisare' ? 'apare ' + esc(p.iesire[p.iesire.length - 1]) : '');
      return '<tr><td>' + (i + 1) + '</td><td>' + esc(ce) + '</td>' + cel + '<td>' + dupa + '</td></tr>';
    }).join('');
    return '<div class="sl-tabwrap"><table class="sl-tab"><thead><tr><th>Pas</th><th>Blocul</th>' + nume.map(function (n) { return '<th>' + esc(n) + '</th>'; }).join('') + '<th>Ce se întâmplă</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function figura(schema, opt) {
    opt = opt || {};
    return '<figure class="sl-fig">' + svg(schema, opt) + (opt.legenda ? '<figcaption>' + opt.legenda + '</figcaption>' : '') + '</figure>';
  }
  /* umple locurile goale cu cărțile alese: {idLoc: idCarte} */
  function cuCarti(schema, carti, alegeri) {
    var hc = {}; (carti || []).forEach(function (c) { hc[c.id] = c; });
    return {
      start: schema.start,
      blocuri: schema.blocuri.map(function (b) {
        var n = copie(b), a = alegeri && alegeri[b.id];
        if (a && hc[a]) { n.tip = hc[a].tip; n.text = hc[a].text; n.carte = a; }
        else if (b.gol) { delete n.tip; delete n.text; }
        return n;
      })
    };
  }
  function iesireSet(schema, set) {
    var r = executa(schema, set.intrari || {});
    return { iesire: r.iesire, eroare: r.eroare, idEroare: r.idEroare, gata: r.gata };
  }
  function laFel(a, b) { return a.length === b.length && a.every(function (x, i) { return String(x) === String(b[i]); }); }

  /* ---------------------------------------------------------------- stilul */
  function stil() {
    if (typeof document === 'undefined' || document.getElementById('sl-css')) return;
    var e = document.createElement('style'); e.id = 'sl-css';
    e.textContent = [
      '.sl-wrap{display:flex;flex-direction:column;gap:.6em}',
      '.sl-fig{margin:.4em auto .8em;max-width:420px;text-align:center}',
      '.sl-fig figcaption{font-size:.9em;color:var(--ink2,#555);margin-top:.3em}',
      '.sl-svg{display:block;width:100%;max-width:420px;height:auto;margin:0 auto;color:var(--ink,#222)}',
      '.sl-svg .sl-f{fill:var(--paper2,#f4f4f4);stroke:currentColor;stroke-width:1.6}',
      '.sl-svg .sl-s{fill:none;stroke:currentColor;stroke-width:1.6}',
      '.sl-svg .sl-t{font-family:var(--fm,monospace);font-size:13.5px;fill:currentColor}',
      '.sl-svg .sl-tgol{fill:var(--ink2,#666);font-style:italic}',
      '.sl-svg .sl-nr{font-family:var(--fm,monospace);font-size:12px;font-weight:700;fill:var(--accent,#1565c0)}',
      '.sl-svg .sl-et{font-family:var(--fm,monospace);font-size:12.5px;font-weight:700}',
      '.sl-svg .sl-da{fill:var(--ok,#2e7d32)} .sl-svg .sl-nu{fill:var(--bad,#c62828)}',
      '.sl-svg .sl-golf{fill:none;stroke-dasharray:6 4;stroke:var(--accent,#1565c0)}',
      '.sl-svg .sl-acum .sl-f{fill:var(--okbg,#e3f6e5);stroke:var(--ok,#2e7d32);stroke-width:3.2}',
      '.sl-svg .sl-ales .sl-f{stroke:var(--accent,#1565c0);stroke-width:3.4}',
      '.sl-svg .sl-err .sl-f{fill:var(--badbg,#fde7e7);stroke:var(--bad,#c62828);stroke-width:3}',
      '.sl-svg .sl-schimba,.sl-svg .sl-gol{cursor:pointer}',
      '.sl-svg .sl-hit{fill:transparent;stroke:none}',
      '.sl-lbl{font-weight:700;margin-top:.2em}',
      '.sl-rand{display:flex;flex-wrap:wrap;gap:.4em;align-items:center}',
      '.sl-btn{min-height:40px;min-width:44px;padding:.35em .7em;border:1.5px solid var(--line,#bbb);border-radius:10px;background:var(--paper,#fff);color:var(--ink,#222);font:inherit;cursor:pointer;touch-action:manipulation}',
      '.sl-btn[aria-pressed="true"],.sl-btn.sl-pe{border-color:var(--accent,#1565c0);box-shadow:0 0 0 2px var(--accent,#1565c0) inset}',
      '.sl-btn:disabled{opacity:.55;cursor:default}',
      '.sl-carte{display:inline-flex;align-items:center;gap:.4em;font-family:var(--fm,monospace)}',
      '.sl-carte svg{width:34px;height:24px;flex:none;color:var(--ink,#222)}',
      '.sl-carte svg .sl-f{fill:var(--paper2,#f4f4f4);stroke:currentColor;stroke-width:1.6}',
      '.sl-panou{border:1px solid var(--line,#ccc);border-radius:10px;padding:.5em .7em;background:var(--paper,#fff)}',
      '.sl-val{font-family:var(--fm,monospace)}',
      '.sl-iesire{font-family:var(--fm,monospace);font-weight:700}',
      '.sl-msg{margin:.3em 0 0}',
      '.sl-msg.sl-rau{color:var(--bad,#c62828)} .sl-msg.sl-bun{color:var(--ok,#2e7d32)}',
      '.sl-teste{list-style:none;padding-left:0;margin:.2em 0}',
      '.sl-teste li{padding:.25em 0 .25em 1.6em;position:relative}',
      '.sl-teste li::before{content:"○";position:absolute;left:.2em}',
      '.sl-teste li.ok::before{content:"✓";color:var(--ok,#2e7d32);font-weight:700}',
      '.sl-teste li.no::before{content:"✗";color:var(--bad,#c62828);font-weight:700}',
      '.sl-teste li .sl-motiv{display:block;font-size:.92em;color:var(--bad,#c62828)}',
      '.sl-in{min-height:40px;width:6.5em;font:inherit;font-size:16px;padding:.2em .4em;border:1.5px solid var(--line,#bbb);border-radius:8px;background:var(--paper,#fff);color:var(--ink,#222)}',
      '.sl-tabwrap{overflow-x:auto;max-width:100%}',
      '.sl-tab{border-collapse:collapse;font-family:var(--fm,monospace);font-size:.92em;margin:.4em 0}',
      '.sl-tab th,.sl-tab td{border:1px solid var(--line,#ccc);padding:.2em .45em;text-align:center}',
      '@media (max-width:560px){.sl-svg .sl-t{font-size:14px}.sl-btn{min-height:42px}}'
    ].join('\n');
    document.head.appendChild(e);
  }

  /* desenul mic al formei, pentru cărți */
  function formaMica(tip) {
    var f = '';
    if (tip === 'start' || tip === 'stop') f = '<rect class="sl-f" x="2" y="4" width="30" height="16" rx="8"/>';
    else if (tip === 'citire' || tip === 'afisare') f = '<polygon class="sl-f" points="7,4 33,4 27,20 1,20"/>';
    else if (tip === 'calcul') f = '<rect class="sl-f" x="2" y="4" width="30" height="16"/>';
    else if (tip === 'decizie') f = '<polygon class="sl-f" points="17,1 33,12 17,23 1,12"/>';
    var nume = { start: 'oval', stop: 'oval', citire: 'paralelogram', afisare: 'paralelogram', calcul: 'dreptunghi', decizie: 'romb' }[tip] || '';
    return '<svg viewBox="0 0 34 24" role="img" aria-label="' + nume + '">' + f + '</svg>';
  }

  /* ---------------------------------------------------------------- tipul de exercițiu `schema` */
  function anunta(d) { try { document.dispatchEvent(new CustomEvent('schema-logica', { detail: d })); } catch (e) { /* fără eveniment */ } }

  function render(Q, body, api) {
    stil();
    var mod = Q.mod || 'construieste';
    if (mod === 'urmareste') return renderUrmareste(Q, body, api);
    var carti = Q.carti || [], S = { alegeri: {}, ales: null, set: 0, pas: null };
    if (Q.start) for (var k0 in Q.start) S.alegeri[k0] = Q.start[k0];
    var locuri = Q.schema.blocuri.filter(function (b) { return b.gol || b.schimba; });
    var sol = cuCarti(Q.schema, carti, Object.assign({}, Q.start || {}, Q.solutie || {}));
    var seturi = (Q.seturi || []).map(function (s) { var o = iesireSet(sol, s); return { intrari: s.intrari, asteptat: o.iesire, ce: s.ce }; });
    body.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'sl-wrap'; body.appendChild(wrap);
    wrap.innerHTML =
      '<div class="sl-desen"></div>' +
      '<div class="sl-lbl">' + (mod === 'coleg' ? 'Blocurile pe care le poți schimba' : 'Locurile de completat') + '</div><div class="sl-rand sl-locuri"></div>' +
      '<div class="sl-lbl">Blocurile de pus <span class="sl-mic">(atinge întâi locul, apoi blocul)</span></div><div class="sl-rand sl-carti"></div>' +
      '<div class="sl-panou"><div class="sl-lbl">Rulează schema</div><div class="sl-rand sl-seturi"></div>' +
      '<div class="sl-rand"><button type="button" class="sl-btn sl-pasb">▶ Pasul următor</button><button type="button" class="sl-btn sl-totb">⏭ Până la STOP</button></div>' +
      '<div class="sl-stare"></div></div>' +
      '<div class="sl-lbl">Testele</div><ul class="sl-teste"></ul>' +
      '<div class="sl-rand"><button type="button" class="sl-btn sl-reset">Ia-o de la capăt</button></div>';
    var eDesen = wrap.querySelector('.sl-desen'), eLoc = wrap.querySelector('.sl-locuri'), eCarti = wrap.querySelector('.sl-carti'),
      eSet = wrap.querySelector('.sl-seturi'), eStare = wrap.querySelector('.sl-stare'), eTeste = wrap.querySelector('.sl-teste');
    var teste = seturi.map(function (s) {
      return { ce: s.ce || ('Pentru ' + dateText(s.intrari) + ', schema afișează ' + (s.asteptat.length ? s.asteptat.join(', ') : 'nimic')) };
    });
    teste.push({ ce: 'Schema ajunge la STOP pentru fiecare set de date' });
    eTeste.innerHTML = teste.map(function (t, i) { return '<li data-t="' + i + '">' + esc(t.ce) + '</li>'; }).join('');

    function schemaAcum() { return cuCarti(Q.schema, carti, S.alegeri); }
    function desen() {
      var sc = schemaAcum();
      sc.blocuri.forEach(function (b) { if (b.gol || b.schimba) b.nr = locuri.indexOf(locuri.filter(function (x) { return x.id === b.id; })[0]) + 1; });
      eDesen.innerHTML = svg(sc, { acum: S.pas ? S.pas.id : null, ales: S.ales, eroare: S.idEroare });
      Array.prototype.forEach.call(eDesen.querySelectorAll('g.sl-gol,g.sl-schimba'), function (g) {
        g.addEventListener('click', function () { alegeLoc(g.getAttribute('data-id')); });
      });
      eLoc.innerHTML = locuri.map(function (b, i) {
        var a = S.alegeri[b.id], c = carti.filter(function (x) { return x.id === a; })[0], txt = c ? c.text : (b.schimba ? b.text : 'gol');
        return '<button type="button" class="sl-btn" data-loc="' + esc(b.id) + '" aria-pressed="' + (S.ales === b.id) + '">Locul ' + (i + 1) + ': ' + esc(txt) + '</button>';
      }).join('');
      Array.prototype.forEach.call(eLoc.querySelectorAll('[data-loc]'), function (bt) { bt.addEventListener('click', function () { alegeLoc(bt.getAttribute('data-loc')); }); });
      var folosite = {}; for (var k in S.alegeri) folosite[S.alegeri[k]] = k;
      eCarti.innerHTML = carti.map(function (c) {
        return '<button type="button" class="sl-btn sl-carte" data-c="' + esc(c.id) + '"' + (folosite[c.id] ? ' aria-pressed="true"' : '') + '>' + formaMica(c.tip) + '<span>' + esc(c.text) + '</span></button>';
      }).join('');
      Array.prototype.forEach.call(eCarti.querySelectorAll('[data-c]'), function (bt) { bt.addEventListener('click', function () { punCarte(bt.getAttribute('data-c')); }); });
    }
    /* 1.1: atingerea ALEGE mereu locul (nu-l mai comută): locul următor e ales singur după fiecare bloc pus, iar copilul care
       face exact ce scrie („atinge întâi locul, apoi blocul”) atinge chiar locul deja ales */
    function alegeLoc(id) { S.ales = id; S.pas = null; S.idEroare = null; desen(); stare(); }
    function punCarte(cid) {
      if (!S.ales) { stare('Atinge întâi un loc din schemă (sau un buton „Locul …”), apoi blocul pe care îl pui acolo.'); return; }
      for (var k in S.alegeri) if (S.alegeri[k] === cid && k !== S.ales) delete S.alegeri[k];
      S.alegeri[S.ales] = cid;
      var urm = locuri.filter(function (b) { return b.gol && !S.alegeri[b.id]; })[0];
      S.ales = urm ? urm.id : null; S.pas = null; S.idEroare = null;
      marcheaza(null); desen(); stare();
    }
    function seturiBut() {
      eSet.innerHTML = seturi.map(function (s, i) { return '<button type="button" class="sl-btn" data-s="' + i + '" aria-pressed="' + (S.set === i) + '">' + esc(dateText(s.intrari) || 'fără date') + '</button>'; }).join('');
      Array.prototype.forEach.call(eSet.querySelectorAll('[data-s]'), function (bt) { bt.addEventListener('click', function () { S.set = +bt.getAttribute('data-s'); S.pas = null; S.idEroare = null; seturiBut(); desen(); stare(); }); });
    }
    function stare(msg) {
      var s = seturi[S.set] || { intrari: {} }, h = '';
      if (S.pas) {
        h += '<div class="sl-val">Valori: ' + esc(dateText(S.pas.valori) || '—') + '</div><div class="sl-iesire">Afișat: ' + esc(S.pas.iesire.join(', ') || '—') + '</div>';
        if (S.pas.tip === 'decizie') h += '<div>Condiția e ' + (S.pas.cond ? 'adevărată: drumul DA.' : 'falsă: drumul NU.') + '</div>';
        if (S.pas.tip === 'stop') h += '<div>Gata: schema a ajuns la STOP.</div>';
      } else h += '<div class="sl-val">Date de intrare: ' + esc(dateText(s.intrari) || '—') + '</div>';
      if (mod === 'coleg' && s.asteptat) h += '<div>Ar trebui să afișeze: <b>' + esc(s.asteptat.join(', ') || 'nimic') + '</b></div>';
      if (S.err) h += '<p class="sl-msg sl-rau">' + esc(S.err) + '</p>';
      if (msg) h += '<p class="sl-msg">' + esc(msg) + '</p>';
      eStare.innerHTML = h;
    }
    var exec = null, iPas = 0;
    function pornesteExec() { exec = executa(schemaAcum(), (seturi[S.set] || {}).intrari || {}); iPas = 0; }
    wrap.querySelector('.sl-pasb').addEventListener('click', function () {
      if (!S.pas) pornesteExec();
      S.err = null;
      if (iPas < exec.pasi.length) { S.pas = exec.pasi[iPas++]; S.idEroare = null; }
      else if (exec.eroare) { S.err = exec.eroare; S.idEroare = exec.idEroare; S.pas = S.pas || { valori: {}, iesire: exec.iesire }; }
      desen(); stare();
    });
    wrap.querySelector('.sl-totb').addEventListener('click', function () {
      pornesteExec(); S.err = null;
      if (exec.pasi.length) S.pas = exec.pasi[exec.pasi.length - 1]; else S.pas = { valori: {}, iesire: [] };
      if (exec.eroare) { S.err = exec.eroare; S.idEroare = exec.idEroare; } else S.idEroare = null;
      iPas = exec.pasi.length; desen(); stare();
    });
    wrap.querySelector('.sl-reset').addEventListener('click', function () {
      S.alegeri = {}; if (Q.start) for (var k in Q.start) S.alegeri[k] = Q.start[k];
      S.ales = null; S.pas = null; S.err = null; S.idEroare = null; marcheaza(null); desen(); stare();
    });
    function evalueaza() {
      var sc = schemaAcum(), rez = [], gol = locuri.filter(function (b) { return b.gol && !S.alegeri[b.id]; });
      var toate = true;
      seturi.forEach(function (s, i) {
        var o = iesireSet(sc, s), ok = !gol.length && o.gata && laFel(o.iesire, s.asteptat), motiv = '';
        if (gol.length) motiv = 'Locul ' + (locuri.indexOf(gol[0]) + 1) + ' e încă gol.';
        else if (!o.gata) motiv = o.eroare;
        else if (!ok) motiv = 'Pentru ' + dateText(s.intrari) + ' schema ta afișează ' + (o.iesire.length ? o.iesire.join(', ') : 'nimic') + '.';
        if (!o.gata) toate = false;
        rez.push({ ok: ok, motiv: motiv, idE: o.idEroare });
      });
      rez.push({ ok: !gol.length && toate, motiv: gol.length ? 'Mai sunt locuri goale.' : (toate ? '' : 'Pentru un set de date schema nu ajunge la STOP.') });
      if (mod === 'coleg' && Q.trebuieSchimbat) {
        var schimbat = Q.trebuieSchimbat.some(function (id) { return S.alegeri[id] && S.alegeri[id] !== (Q.start || {})[id]; });
        if (!schimbat) rez.forEach(function (r) { if (r.ok) { r.ok = false; r.motiv = 'Schema colegului e încă neschimbată.'; } });
      }
      return rez;
    }
    function marcheaza(rez) {
      Array.prototype.forEach.call(eTeste.querySelectorAll('li'), function (li, i) {
        li.className = rez ? (rez[i].ok ? 'ok' : 'no') : '';
        var m = li.querySelector('.sl-motiv'); if (m) m.remove();
        if (rez && !rez[i].ok && rez[i].motiv) { var sp = document.createElement('span'); sp.className = 'sl-motiv'; sp.textContent = rez[i].motiv; li.appendChild(sp); }
      });
    }
    body._sl = { S: S, Q: Q, umple: function (al) { S.alegeri = Object.assign({}, Q.start || {}, al); S.ales = null; S.pas = null; desen(); stare(); }, evalueaza: evalueaza };
    seturiBut(); desen(); stare();
    if (locuri.length && mod !== 'coleg') { S.ales = locuri[0].id; desen(); }
    var nav = api.checkButton(function () {
      var rez = evalueaza(), bune = rez.filter(function (r) { return r.ok; }).length, ok = bune === rez.length;
      marcheaza(rez);
      var prim = rez.filter(function (r) { return !r.ok; })[0];
      if (prim && prim.idE) { S.idEroare = prim.idE; desen(); }
      anunta({ tip: 'schema', mod: mod, bune: bune, total: rez.length, ok: ok });
      if (ok) { nav.innerHTML = ''; api.resolve(true); }
      else {
        api.resolve(false, bune + ' din ' + rez.length + ' teste trec. ' + esc(prim.motiv || ''));
        api.revealButton(function () { body._sl.umple(Q.solutie || {}); marcheaza(evalueaza()); nav.innerHTML = ''; api.giveUp('schema bună e acum desenată. Rulează-o pas cu pas, cu fiecare set de date.'); });
      }
    }, 'Verifică schema');
  }

  /* modul „urmăreste”: elevul execută schema; la romb alege DA / NU, la dreptunghi scrie valoarea nouă */
  function renderUrmareste(Q, body, api) {
    var sc = Q.schema, h = harta(sc), intrari = Q.intrari || {}, cere = Q.cere || ['decizie', 'calcul'];
    var R = executa(sc, intrari);
    /* 1.1: S.prima = unde a fost prima greșeală (pentru mesajul de la „Verifică”); testul 2 cere drumul fără greșeli */
    var S = { i: 0, gresite: 0, incercari: 0, gata: false, prima: null };
    body.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'sl-wrap'; body.appendChild(wrap);
    wrap.innerHTML = '<div class="sl-desen"></div><div class="sl-panou"><div class="sl-val sl-date"></div><div class="sl-val sl-valori"></div><div class="sl-iesire sl-afis"></div><div class="sl-intreb"></div><div class="sl-msgz"></div></div>' +
      '<div class="sl-lbl">Testele</div><ul class="sl-teste"><li data-t="0">Ai urmărit schema până la STOP</li><li data-t="1">Ai răspuns bine la toate întrebările, fără nicio greșeală</li></ul>' +
      '<div class="sl-rand"><button type="button" class="sl-btn sl-reset">Ia-o de la capăt</button></div>';
    var eD = wrap.querySelector('.sl-desen'), eV = wrap.querySelector('.sl-valori'), eA = wrap.querySelector('.sl-afis'), eI = wrap.querySelector('.sl-intreb'), eM = wrap.querySelector('.sl-msgz'),
      eT = wrap.querySelector('.sl-teste li[data-t="0"]'), eT1 = wrap.querySelector('.sl-teste li[data-t="1"]');
    function deOri(n) { return n === 1 ? 'o dată' : 'de ' + n + ((n % 100 === 0 || n % 100 >= 20) ? ' de' : '') + ' ori'; }
    wrap.querySelector('.sl-date').textContent = 'Date de intrare: ' + (dateText(intrari) || '—');
    function pasCurent() { return R.pasi[S.i]; }
    function valoriInainte() { return S.i > 0 ? R.pasi[S.i - 1].valori : {}; }
    function afisInainte() { return S.i > 0 ? R.pasi[S.i - 1].iesire : []; }
    function arata(msg, cls) {
      var p = pasCurent(), b = p ? h[p.id] : null;
      eD.innerHTML = svg(sc, { acum: S.gata ? null : (p ? p.id : null) });
      eV.textContent = 'Valori acum: ' + (dateText(S.gata ? R.valori : valoriInainte()) || '—');
      eA.textContent = 'Afișat: ' + ((S.gata ? R.iesire : afisInainte()).join(', ') || '—');
      eM.innerHTML = msg ? '<p class="sl-msg ' + (cls || '') + '">' + msg + '</p>' : '';
      if (S.gata || !p) { eI.innerHTML = '<p><b>Ai ajuns la STOP.</b> Apasă „Verifică urmărirea”.</p>'; return; }
      var t = textAfisat(b), q = '';
      if (p.tip === 'decizie' && cere.indexOf('decizie') >= 0) {
        q = '<p>Ești la rombul <b>' + esc(t) + '</b>. Cu valorile de acum, condiția e adevărată sau falsă?</p><div class="sl-rand"><button type="button" class="sl-btn" data-r="da">DA (adevărată)</button><button type="button" class="sl-btn" data-r="nu">NU (falsă)</button></div>';
      } else if (p.tip === 'calcul' && cere.indexOf('calcul') >= 0 && p.valori) {
        var c = compileaza(b), nm = c.ok ? c.atr[c.atr.length - 1].nume : '';
        q = '<p>Ești la dreptunghiul <b>' + esc(t) + '</b>. Ce valoare are <b>' + esc(nm) + '</b> după acest bloc?</p><div class="sl-rand"><input class="sl-in" inputmode="text" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="valoarea nouă a lui ' + esc(nm) + '"><button type="button" class="sl-btn sl-ok">Gata</button></div>';
      } else {
        var ce = p.tip === 'start' ? 'Începi de la START și mergi pe săgeată.' : p.tip === 'citire' ? 'Blocul „' + esc(t) + '” citește datele: ' + esc(dateText(p.valori)) + '.' :
          p.tip === 'afisare' ? 'Blocul „' + esc(t) + '” afișează: ' + esc(p.iesire[p.iesire.length - 1]) + '.' :
          p.tip === 'stop' ? 'Ai ajuns la STOP.' : 'Blocul „' + esc(t) + '”.';
        q = '<p>' + ce + '</p><div class="sl-rand"><button type="button" class="sl-btn sl-urm">▶ Pasul următor</button></div>';
      }
      eI.innerHTML = q;
      var bu = eI.querySelector('.sl-urm'); if (bu) bu.addEventListener('click', inainte);
      Array.prototype.forEach.call(eI.querySelectorAll('[data-r]'), function (x) { x.addEventListener('click', function () { raspunde(x.getAttribute('data-r') === 'da'); }); });
      var ok = eI.querySelector('.sl-ok'), inp = eI.querySelector('.sl-in');
      if (ok) { ok.addEventListener('click', function () { valoare(inp.value); }); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); valoare(inp.value); } }); }
    }
    function inainte() {
      var p = pasCurent();
      if (p && p.tip === 'stop') { S.gata = true; S.i++; arata(); return; }
      S.i++; S.incercari = 0;
      if (S.i >= R.pasi.length) { S.gata = true; }
      arata();
    }
    function raspunde(daAles) {
      var p = pasCurent(), b = h[p.id];
      if (daAles === p.cond) { S.incercari = 0; S.i++; arata('Bine: condiția e ' + (p.cond ? 'adevărată, mergi pe DA.' : 'falsă, mergi pe NU.'), 'sl-bun'); return; }
      S.gresite++; S.incercari++;
      if (!S.prima) S.prima = 'la rombul „' + textAfisat(b) + '”';
      var c = compileaza(b);
      if (S.incercari < 2) arata('Nu încă. Pune în condiție valorile de acum (' + esc(dateText(valoriInainte())) + ') și verifică din nou.', 'sl-rau');
      else { S.incercari = 0; S.i++; arata('Cu valorile ' + esc(dateText(valoriInainte())) + ', condiția „' + esc(String(b.text).replace(/\?\s*$/, '')) + '” e ' + (p.cond ? 'adevărată: drumul DA.' : 'falsă: drumul NU.'), 'sl-rau'); }
    }
    function valoare(txt) {
      var p = pasCurent(), b = h[p.id], c = compileaza(b), nm = c.atr[c.atr.length - 1].nume, corect = p.valori[nm];
      /* 1.1: orice scriere a aceluiași număr e primită („110”, „110,0”, „110.0”); un text cu spații între cifre („1 10”) sau
         care nu e număr primește un mesaj și NU se socotește greșeală */
      var v = String(txt).trim().replace(/−/g, '-');
      if (v === '') { arata('Scrie un număr în căsuță.', 'sl-rau'); return; }
      /* 1.1 (02.11, J2-O): mesajul cu spațiile doar când, fără spații, rămân numai cifre („1 10”); „110 lei”, „preț = 110” → mesajul de mai jos */
      if (/\s/.test(v) && /^[-+]?[0-9][0-9\s]*([.,][0-9]+)?$/.test(v)) { arata('În căsuță scrii un singur număr, fără spații între cifre.', 'sl-rau'); return; }
      if (!/^[-+]?[0-9]+([.,][0-9]+)?$/.test(v)) { arata('Scrie în căsuță doar numărul, din cifre.', 'sl-rau'); return; }
      if (fmt(parseFloat(v.replace(',', '.'))) === fmt(corect)) { S.incercari = 0; S.i++; arata('Bine: ' + esc(nm) + ' devine ' + esc(fmt(corect)) + '.', 'sl-bun'); return; }
      S.gresite++; S.incercari++;
      if (!S.prima) S.prima = 'la dreptunghiul „' + textAfisat(b) + '”';
      var acum = dateText(valoriInainte());
      if (S.incercari < 2) arata(acum ? 'Nu încă. Calculează partea din dreapta săgeții „←” cu valorile de acum (' + esc(acum) + ').' : 'Nu încă. Uită-te în dreapta săgeții „←”: acolo e valoarea pe care o primește ' + esc(nm) + '.', 'sl-rau');
      else { S.incercari = 0; S.i++; arata(esc(nm) + ' devine ' + esc(fmt(corect)) + ': partea din dreapta săgeții, calculată cu valorile de dinainte.', 'sl-rau'); }
    }
    wrap.querySelector('.sl-reset').addEventListener('click', function () { S.i = 0; S.gresite = 0; S.incercari = 0; S.gata = false; S.prima = null; eT.className = ''; eT1.className = ''; arata(); });
    body._sl = { umple: function () { S.i = R.pasi.length; S.gata = true; arata(); }, gata: function () { return S.gata; }, pas: function () { var p = pasCurent(); return p ? { tip: p.tip, cond: p.cond, valori: p.valori, id: p.id } : null; }, gresite: function () { return S.gresite; }, prima: function () { return S.prima; } };
    if (R.eroare) { eI.innerHTML = '<p class="sl-msg sl-rau">Schema exercițiului are o problemă: ' + esc(R.eroare) + '</p>'; }
    arata();
    var nav = api.checkButton(function () {
      /* 1.1: testul judecă RĂSPUNSURILE elevului, nu doar că a ajuns la STOP (după 2 greșeli simulatorul dă singur răspunsul
         și merge mai departe, deci orice drum ajunge la STOP); primul test care pică numește greșeala */
      var ajuns = S.gata, curat = S.gresite === 0, ok = ajuns && curat;
      eT.className = ajuns ? 'ok' : 'no';
      eT1.className = !curat ? 'no' : (ajuns ? 'ok' : '');
      anunta({ tip: 'schema', mod: 'urmareste', bune: (ajuns ? 1 : 0) + (ok ? 1 : 0), total: 2, ok: ok, gresite: S.gresite });
      if (ok) { nav.innerHTML = ''; api.resolve(true); }
      else {
        var p = pasCurent();
        if (!ajuns) api.resolve(false, 'Încă n-ai ajuns la STOP: ești la blocul „' + esc(textAfisat(h[p.id])) + '”. Răspunde la întrebarea de sub schemă.');
        else api.resolve(false, 'Ai ajuns la STOP, dar ai greșit ' + deOri(S.gresite) + ' (' + (S.gresite > 1 ? 'prima dată ' : '') + esc(S.prima || '') + '). Apasă „Ia-o de la capăt” și urmărește din nou schema, fără greșeli.');
        api.revealButton(function () { body._sl.umple(); eT.className = 'ok'; nav.innerHTML = ''; api.giveUp('urmărirea e completă; recitește tabelul valorilor: ' + esc(dateText(R.valori)) + ', afișat: ' + esc(R.iesire.join(', ') || 'nimic') + '.'); });
      }
    }, 'Verifică urmărirea');
  }

  var TIP_SCHEMA = {
    render: render,
    rezolva: function (Q, body) {
      if (!body._sl) return;
      if ((Q.mod || 'construieste') === 'urmareste') body._sl.umple(); else body._sl.umple(Q.solutie || {});
    },
    gresit: function (Q, body) {
      if (!body._sl) return;
      if ((Q.mod || 'construieste') === 'urmareste') return; /* rămâne la START: „Verifică” trebuie să respingă */
      body._sl.umple(Q.gresit || {});
    }
  };

  var API = { versiune: VERS, compileaza: compileaza, executa: executa, svg: svg, figura: figura, tabel: tabel, cuCarti: cuCarti, dateText: dateText,
    fmt: fmt, faraDia: faraDia, iesiri: iesiri, stil: stil, tipuri: { schema: TIP_SCHEMA }, _expr: compExpr, _eval: evalua };
  if (typeof window !== 'undefined') window.SchemaLogica = Object.assign(window.SchemaLogica || {}, API);
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
