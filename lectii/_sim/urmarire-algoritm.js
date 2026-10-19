/* lectii/_sim/urmarire-algoritm.js — „Execuți algoritmul ca un calculator”: tabelul de urmărire pas cu pas și
   completarea unui algoritm, cu verificare pe COMPORTAMENT (algoritmul e chiar textul afișat, interpretat aici).

   PROPRIETAR: lecția VI/17 (lectii/vi/m3-l17, „Recapitulăm: algoritm, date, secvență, decizie”, 19.10.2026).
   Lecțiile următoare (VI/19-23, repetiția) îl EXTIND cu fișiere NOI (`lectii/_sim/urmarire-algoritm-<ceva>.js`), prin
   `UrmarireAlgoritm.instructiune(...)` și `UrmarireAlgoritm.mod(...)`; NU îl rescriu și NU schimbă ce e scris mai jos.

   NOTAȚIA (a clasei a V-a: jocul jocuri/algoritmi-v și testul inițial al profesorului, Info_Gimnaziu_2026/materiale/
   continut/teste_initiale.json — „Citesc a și b. Dacă a > b atunci afișez a, altfel afișez b.”, „S ← 0”):
       Început                         capetele (rând fără nimic de completat)
       Citește a, b                    datele de intrare (și „Citește a și b”); valorile vin din `date`
       s ← a + b                       atribuirea (și „Calculează s ← a + b”); punctul de la capăt e voie
       Dacă s ≥ 10 atunci              decizia; rândurile unei ramuri stau MAI LA DREAPTA (spații)
          Afișează „mare”
       altfel
          Afișează s                   (și „Afișează „text””)
       Sfârșit
   Rândurile se numără ca într-un editor (1 = primul rând, și Început), cu numere care NU se copiază (CSS ::before):
   elevul poate copia algoritmul din pagină în Notepad fără numere.
   Expresii: numere întregi, + - * / % ( ), comparațiile < ≤ > ≥ = ≠, logicele ȘI SAU NU (și fără diacritice: SI).
   Ordinea: parantezele; * / %; + -; comparațiile; NU; ȘI; SAU (ca în jocul algoritmi-v: „logicele la urmă”).
   „/” e împărțirea adevărată (7 / 2 = 3,5), „%” restul (17 % 5 = 2). La SCRIS se primesc și <= >= <> != (devin ≤ ≥ ≠),
   iar o literă fără diacritice în numele unei date („varsta”) se citește ca data (vârsta) — și i se spune elevului.
   NU se primesc (cu mesaj pe ecran): ==, =>, =<, „mod”, „x” sau „×” pentru înmulțire, „:” pentru împărțire, două
   comparații lipite (5 < a < 9: „leagă-le cu ȘI”), o dată folosită înainte să aibă valoare.

   API PUBLIC (window.UrmarireAlgoritm):
     versiune                             '1.1 (19.10.2026, după judecata 1)' — 1.1 schimbă doar COMPORTAMENTUL lui
                                          potriveste() și mesajele (API-ul, numele și câmpurile sunt aceleași ca la 1.0):
                                          pe ramura neexecutată se primește și „nu se execută”; la texte nu contează
                                          . ! ? … de la capăt; la două tabele, mesajul spune „tabelul N, rândul …”;
                                          pe telefon (sub 560 px) și tabelele-exemplu stau pe rânduri.
                                          '1.2 (19.10.2026, după judecata 2)' — tot fără schimbare de API: la numere se
                                          primește și calculul scris („3 + 5 * 2 = 13”, „b = 6 + 12 = 18”) dacă numărul de
                                          după ultimul „=” e corect și fiecare calcul din stânga îl dă (cu nume de date: nu,
                                          cu mesajul „pune numerele de ACUM…”); sub 560 px un rând lung al listării trece
                                          dedesubt (white-space:pre-wrap), nu iese din chenar.
     analizeaza(prog)                     -> {randuri:[{i,raw,ind,s,tip,...}], arbore} ; aruncă Error la un rând neînțeles
     ruleaza(prog, date)                  -> {randuri:[{i,tip,exec,val,nume}], valori, afisari, jurnal:[{i,tip,val,nume}]}
                                             aruncă {mesaj, rand} (rand = indicele rândului, de la 0) la o greșeală de execuție
     evalueaza(expr, valori)              -> număr / adevărat-fals / text ; aruncă {mesaj}
     format(v)                            -> 'adevărat' | 'fals' | '5,5' | text
     potriveste(raspuns, asteptat)        -> bool (aceeași regulă ca la verificare; '' = căsuță goală)
     listare(prog)                        -> HTML: algoritmul cu numerele rândurilor (pentru pașii lecției)
     tabel(prog, date)                    -> HTML: tabelul de urmărire COMPLETAT, calculat de motorul de aici (exemple)
     tipuri.urmarire / tipuri.completeaza -> {render, rezolva, gresit} pentru JocMotor (`tipuri:{urmarire:…}`)
     instructiune(def)                    -> EXTINDERE: un rând nou (vezi „Pentru lecția următoare” în surse.md VI/17)
     mod(nume, fn)                        -> EXTINDERE: alt fel de tabel (ex. un rând pe pas EXECUTAT, pentru repetiții)

   TIPUL „urmarire” (tabelul):  {t:'urmarire', q, prog:[rânduri], date:[{a:4},{a:7}…], dateLaPrag?:[…], seturi?:1|2,
       ajutor, why, inca?}
     Calculatorul alege datele (altele la fiecare deschidere); elevul completează, pe fiecare rând care face ceva, noua
     valoare (atribuire), adevărat/fals (condiție) sau ce se afișează. Pe o ramură care NU se execută, căsuța rămâne
     GOALĂ (se primește și „nu se execută” sau „-”; orice valoare scrisă acolo e respinsă). Cu `dateLaPrag`, al doilea
     tabel are date exact la prag. Testele numite se bifează la „Verifică tabelul”.
   TIPUL „completeaza” (scrii o bucată din algoritm): {t:'completeaza', q, prog:[rânduri cu {?}], solutie:['…'],
       gresit:['…'], teste:[{date:{…}, ce?:'…'}], ajutor, why}
     Elevul scrie în căsuțele {?}; „Verifică algoritmul” rulează algoritmul LUI și pe cel cu `solutie` pe fiecare test
     și compară ce se afișează. Orice scriere care dă același rezultat pe toate testele trece (vârsta < 12 și
     vârsta ≤ 11); cea care greșește la prag e prinsă de testul de la prag. Butoane pentru ≤ ≥ ≠ (nu sunt pe tastatură).
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('urmarire-algoritm', {detail:{tip, bune, total, ok}}).
*/
(function () {
  'use strict';
  const VERSIUNE = '1.2 (19.10.2026, după judecata 2)';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const faraDiacritice = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T');
  const cheie = s => faraDiacritice(s).toLowerCase();
  function Greseala(mesaj, rand) { return {mesaj, rand, greseala: true}; }

  /* ===================== 1. EXPRESII ===================== */
  const CUV = {si: 'SI', sau: 'SAU', nu: 'NU'};
  function tokeni(expr) {
    const t = [], s = String(expr);
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/\d/.test(c)) {
        let j = i; while (j < s.length && /\d/.test(s[j])) j++;
        if (s[j] === '.' && /\d/.test(s[j + 1] || '')) throw Greseala('numerele cu virgulă nu se folosesc aici; scrie numere întregi.');
        t.push({k: 'num', v: parseInt(s.slice(i, j), 10)}); i = j; continue;
      }
      if (c === '„' || c === '"' || c === '“') {
        const inchis = c === '„' ? /[”"“]/ : /["”]/;
        let j = i + 1; while (j < s.length && !inchis.test(s[j])) j++;
        if (j >= s.length) throw Greseala('ghilimelele nu sunt închise.');
        t.push({k: 'txt', v: s.slice(i + 1, j)}); i = j + 1; continue;
      }
      const m = s.slice(i).match(/^[\p{L}_][\p{L}\p{M}\d_]*/u);
      if (m) {
        const w = m[0], k = cheie(w);
        if (CUV[k]) t.push({k: 'op', v: CUV[k]});
        else if (k === 'mod') throw Greseala('restul împărțirii se scrie cu %, de exemplu 17 % 5.');
        else t.push({k: 'id', v: w});
        i += w.length; continue;
      }
      const doi = s.slice(i, i + 2);
      if (doi === '<=') { t.push({k: 'op', v: '≤'}); i += 2; continue; }
      if (doi === '>=') { t.push({k: 'op', v: '≥'}); i += 2; continue; }
      if (doi === '<>' || doi === '!=') { t.push({k: 'op', v: '≠'}); i += 2; continue; }
      if (doi === '==') throw Greseala('„egal” se scrie cu un singur =, de exemplu a = 5.');
      if (doi === '=>' || doi === '=<') throw Greseala(`„${doi}” nu e un semn: scrie ${doi === '=>' ? '≥ (sau >=)' : '≤ (sau <=)'}.`);
      if ('+-*/%()<>=≤≥≠'.includes(c)) { t.push({k: 'op', v: c}); i++; continue; }
      if (c === '×' || c === '·') throw Greseala('înmulțirea se scrie cu *, de exemplu 3 * 4.');
      if (c === ':') throw Greseala('împărțirea se scrie cu /, de exemplu 12 / 4.');
      if (c === '←') throw Greseala('săgeata ← stă doar o dată pe rând, între variabilă și calcul.');
      if (c === ',') throw Greseala('virgula nu are ce căuta în calcul.');
      throw Greseala(`semnul „${c}” nu e folosit în algoritmii noștri.`);
    }
    return t;
  }
  const REL = new Set(['<', '>', '=', '≤', '≥', '≠']);
  const BP = {SAU: 1, SI: 2, '<': 4, '>': 4, '=': 4, '≤': 4, '≥': 4, '≠': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6};
  function parseaza(expr) {
    const t = tokeni(expr);
    if (!t.length) throw Greseala('căsuța e goală.');
    let p = 0;
    const urm = () => t[p], ia = () => t[p++];
    function nud() {
      const x = ia();
      if (!x) throw Greseala('calculul se termină prea devreme: lipsește ceva după ultimul semn.');
      if (x.k === 'num') return {k: 'num', v: x.v};
      if (x.k === 'txt') return {k: 'txt', v: x.v};
      if (x.k === 'id') return {k: 'id', v: x.v};
      if (x.k === 'op' && x.v === '(') {
        const e = expr_(0);
        const y = ia();
        if (!y || y.v !== ')') throw Greseala('o paranteză deschisă nu e închisă.');
        return e;
      }
      if (x.k === 'op' && x.v === '-') return {k: 'neg', a: expr_(7)};
      if (x.k === 'op' && x.v === 'NU') return {k: 'nu', a: expr_(3)};
      if (x.k === 'op' && x.v === ')') throw Greseala('o paranteză se închide fără să fi fost deschisă.');
      throw Greseala(`„${x.v}” nu poate sta aici: înainte de el lipsește un număr sau o dată.`);
    }
    function expr_(rbp) {
      let st = nud();
      for (;;) {
        const x = urm();
        if (!x) break;
        if (x.k !== 'op' || !(x.v in BP)) {
          if (x.k === 'op' && x.v === ')') break;
          throw Greseala(`lipsește un semn între „${afisTok(t[p - 1])}” și „${afisTok(x)}”.`);
        }
        const bp = BP[x.v];
        if (bp <= rbp) break;
        ia();
        const dr = expr_(bp);
        if (REL.has(x.v) && urm() && REL.has(urm().v)) throw Greseala('două comparații la rând: leagă-le cu ȘI, de exemplu a > 5 ȘI a < 9.');
        st = {k: 'bin', op: x.v, a: st, b: dr};
      }
      return st;
    }
    const e = expr_(0);
    if (p < t.length) {
      const x = t[p];
      if (x.k === 'op' && x.v === ')') throw Greseala('o paranteză se închide fără să fi fost deschisă.');
      throw Greseala(`nu înțeleg ce vine după „${afisTok(t[p - 1])}”.`);
    }
    return e;
  }
  const afisTok = x => !x ? '' : x.k === 'txt' ? `„${x.v}”` : x.v === 'SI' ? 'ȘI' : String(x.v);
  function caut(v, nume) {
    if (Object.prototype.hasOwnProperty.call(v, nume)) return nume;
    const k = cheie(nume);
    return Object.keys(v).find(n => cheie(n) === k) || null;
  }
  function calc(n, v, ctx) {
    switch (n.k) {
      case 'num': case 'txt': return n.v;
      case 'id': {
        const g = caut(v, n.v);
        if (g === null) {
          if (/^[x×]$/i.test(n.v)) throw Greseala('„x” nu e o dată a algoritmului; înmulțirea se scrie cu *.');
          throw Greseala(`„${n.v}” nu are încă nicio valoare: o dată se citește sau se calculează ÎNAINTE să fie folosită.`);
        }
        if (g !== n.v && ctx) ctx.citit = ctx.citit || [n.v, g];
        return v[g];
      }
      case 'neg': { const a = calc(n.a, v, ctx); if (typeof a !== 'number') throw Greseala('semnul minus stă doar în fața unui număr.'); return -a; }
      case 'nu': { const a = calc(n.a, v, ctx); if (typeof a !== 'boolean') throw Greseala('NU se pune în fața unei condiții (ceva adevărat sau fals), de exemplu NU (a > 5).'); return !a; }
      case 'bin': {
        const a = calc(n.a, v, ctx), b = calc(n.b, v, ctx), op = n.op;
        if (op === 'SI' || op === 'SAU') {
          if (typeof a !== 'boolean' || typeof b !== 'boolean') throw Greseala(`${op === 'SI' ? 'ȘI' : 'SAU'} leagă două condiții (adevărat sau fals), nu numere.`);
          return op === 'SI' ? (a && b) : (a || b);
        }
        if (REL.has(op)) {
          if (typeof a === 'boolean' || typeof b === 'boolean') throw Greseala('compari două numere (sau două texte), nu o condiție.');
          if (typeof a !== typeof b) throw Greseala('compari un număr cu un text.');
          const x = typeof a === 'string' ? cheie(a) : a, y = typeof b === 'string' ? cheie(b) : b;
          return op === '<' ? x < y : op === '>' ? x > y : op === '≤' ? x <= y : op === '≥' ? x >= y : op === '=' ? x === y : x !== y;
        }
        if (typeof a !== 'number' || typeof b !== 'number') throw Greseala(`„${op}” calculează cu numere, nu cu ${typeof a === 'boolean' || typeof b === 'boolean' ? 'adevărat sau fals' : 'texte'}.`);
        if ((op === '/' || op === '%') && b === 0) throw Greseala('împărțire la 0: nu se poate.');
        const r = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? a / b : a % b;
        return Math.round(r * 1e9) / 1e9;
      }
    }
    throw Greseala('calcul neînțeles.');
  }
  function evalueaza(expr, valori, ctx) { return calc(parseaza(expr), valori || {}, ctx); }

  /* ===================== 2. PROGRAMUL ===================== */
  const NUME = String.raw`[\p{L}_][\p{L}\p{M}\d_]*`;
  const INSTR = [   // ordinea contează; extensiile se pun ÎNAINTE (instructiune())
    {tip: 'inceput', re: /^început\.?$/iu},
    {tip: 'sfarsit', re: /^sfârșit\.?$/iu},
    {tip: 'altfel', re: /^altfel$/iu},
    {tip: 'daca', re: /^dacă\s+(.+?)\s+atunci$/iu, bloc: true, prinde: m => ({cond: m[1]})},
    {tip: 'cit', re: /^citește\s+(.+?)\.?$/iu, prinde: m => ({nume: m[1].split(/\s*,\s*|\s+și\s+|\s+si\s+/u).filter(Boolean)})},
    {tip: 'afis', re: /^afișează\s+(.+?)\.?$/iu, prinde: m => ({expr: m[1]})},
    {tip: 'set', re: new RegExp(String.raw`^(?:calculează\s+)?(${NUME})\s*←\s*(.+?)\.?$`, 'iu'), prinde: m => ({nume: m[1], expr: m[2]})}
  ];
  function normRand(s) { return faraDiacritice(s).toLowerCase(); }
  function potrivesteInstr(s) {
    for (const d of INSTR) {
      const m = s.match(d.re) || normRand(s).match(new RegExp(faraDiacritice(d.re.source), d.re.flags));
      if (m) return {d, m};
    }
    return null;
  }
  function analizeaza(prog) {
    if (!Array.isArray(prog)) throw new Error('UrmarireAlgoritm: prog trebuie să fie o listă de rânduri');
    const randuri = prog.map((raw, i) => {
      const ind = (String(raw).match(/^\s*/) || [''])[0].replace(/\t/g, '    ').length, s = String(raw).trim();
      const r = {i, raw: String(raw), ind, s, tip: 'gol'};
      if (!s) return r;
      const p = potrivesteInstr(s);
      if (!p) { r.tip = 'necunoscut'; return r; }
      r.tip = p.d.tip; r.def = p.d;
      if (p.d.prinde) {
        const m2 = s.match(p.d.re);   // capturile din forma ORIGINALĂ (cu diacritice), dacă se potrivește
        Object.assign(r, p.d.prinde(m2 || p.m));
      }
      return r;
    });
    const rr = randuri.filter(r => r.tip !== 'gol');
    let k = 0;
    function bloc(minInd) {
      const noduri = [];
      while (k < rr.length) {
        const r = rr[k];
        if (r.ind <= minInd && minInd >= 0) break;
        if (r.tip === 'altfel') break;
        k++;
        if (r.tip === 'necunoscut') throw Object.assign(new Error(`rândul ${r.i + 1} nu e înțeles: „${r.s}”`), {rand: r.i});
        const nod = {r, copii: null, altfel: null};
        if (r.def && r.def.bloc) {
          nod.copii = bloc(r.ind);
          if (r.tip === 'daca' && k < rr.length && rr[k].tip === 'altfel' && rr[k].ind >= r.ind) {   // „altfel” sub „Dacă” (ca în clasa a V-a) sau puțin mai la dreapta
            nod.rAltfel = rr[k]; k++;
            nod.altfel = bloc(r.ind);
          }
          if (r.def.dupaBloc) r.def.dupaBloc(nod, rr, () => k, x => { k = x; });
        }
        noduri.push(nod);
      }
      return noduri;
    }
    const arbore = bloc(-1);
    if (k < rr.length) throw Object.assign(new Error(`rândul ${rr[k].i + 1} („${rr[k].s}”) nu are o decizie deasupra lui`), {rand: rr[k].i});
    return {randuri, arbore};
  }
  const MAX_PASI = 2000;   // finitudinea: un algoritm care nu se oprește e oprit de noi, cu mesaj
  function ruleaza(prog, date) {
    const A = typeof prog === 'object' && prog.arbore ? prog : analizeaza(prog);
    const v = {}, afisari = [], jurnal = [];
    const st = A.randuri.map(r => ({i: r.i, tip: r.tip, exec: false, val: '', nume: r.nume}));
    const ctx = {
      v, date: date || {}, afisari, jurnal, st, pasi: 0,
      noteaza(r, val, extra) {
        if (++ctx.pasi > MAX_PASI) throw Greseala('algoritmul nu se oprește (finitudinea!).', r.i);
        st[r.i].exec = true; if (val !== undefined) st[r.i].val = val;
        jurnal.push(Object.assign({i: r.i, tip: r.tip, val, nume: r.nume}, extra || {}));
      },
      evalueaza(expr, r) {
        try { return evalueaza(expr, v, ctx); } catch (e) { if (e && e.greseala) { e.rand = r.i; throw e; } throw e; }
      },
      executa(noduri) { noduri.forEach(n => executaNod(n)); }
    };
    function executaNod(n) {
      const r = n.r;
      if (r.def && r.def.executa) return r.def.executa(n, ctx);
      switch (r.tip) {
        case 'inceput': case 'sfarsit': ctx.noteaza(r); return;
        case 'cit': {
          const lip = r.nume.filter(x => !(x in ctx.date));
          if (lip.length) throw Greseala(`lipsesc datele de intrare: ${lip.join(', ')}.`, r.i);
          r.nume.forEach(x => { v[x] = ctx.date[x]; });
          ctx.noteaza(r, r.nume.map(x => `${x} = ${format(v[x])}`).join(', ')); return;
        }
        case 'set': { const val = ctx.evalueaza(r.expr, r); v[r.nume] = val; ctx.noteaza(r, val); return; }
        case 'afis': { const val = ctx.evalueaza(r.expr, r); afisari.push(val); ctx.noteaza(r, val); return; }
        case 'daca': {
          const c = ctx.evalueaza(r.cond, r);
          if (typeof c !== 'boolean') throw Greseala('după „Dacă” vine o condiție: o comparație care dă adevărat sau fals.', r.i);
          ctx.noteaza(r, c);
          if (n.rAltfel) st[n.rAltfel.i].exec = true;
          ctx.executa(c ? n.copii : (n.altfel || []));
          return;
        }
      }
      throw Greseala(`rândul „${r.s}” nu poate fi executat.`, r.i);
    }
    ctx.executa(A.arbore);
    return {randuri: st, valori: v, afisari, jurnal, citit: ctx.citit || null};
  }

  /* ===================== 3. AFIȘARE ȘI POTRIVIRE ===================== */
  function format(x) {
    if (x === true) return 'adevărat';
    if (x === false) return 'fals';
    if (typeof x === 'number') return String(Math.round(x * 1000) / 1000).replace('.', ',');
    return x == null ? '' : String(x);
  }
  /* J1 (19.10.2026): pe ramura neexecutată se primește și „nu se execută” (forma arătată de tabelele din pași); la texte,
     semnele de la capăt (. ! ? …) nu contează: „Felicitari” = „Felicitări!”, „Traseul Mare.” = „traseul mare”. */
  const NU_SE_EXECUTA = new Set(['', '-', '—', '–', 'nu se executa', 'nu se executa.', '(nu se executa)']);
  const faraSemnLaCapat = s => s.replace(/[\s.!?…]+$/u, '');
  const curat = inp => cheie(String(inp == null ? '' : inp)).trim().replace(/[„”"“]/g, '').replace(/\s+/g, ' ');
  const acelasi = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-6;
  /* J2 (19.10.2026, 1.2): calculul scris ca în tabelul-exemplu („3 + 5 * 2 = 13”, „b = 6 + 12 = 18”) e primit dacă numărul
     de după ULTIMUL „=” e cel corect ȘI fiecare calcul dinaintea lui dă chiar acel număr (fără nume de date: nu le știm
     valorile aici). Întoarce null (nu e un calcul scris) sau {k:'bun'|'rezultat'|'fara'|'nume'|'calcul', mesaj?}. */
  function calculScris(s, exp) {
    const t = s.replace(/^[\p{L}_][\p{L}\d_]*\s*=\s*/u, '');   // „b = …”: numele variabilei din stânga săgeții
    if (!t.includes('=')) return null;
    const parti = t.split('=').map(x => x.trim()), m = parti.pop().match(/^(-?\d+(?:[.,]\d+)?)\s*[\p{L}.]*$/u);
    if (!m) return {k: 'fara'};
    if (!acelasi(parseFloat(m[1].replace(',', '.')), exp)) return {k: 'rezultat'};
    for (const p of parti.filter(Boolean)) {
      if (/\d\s*x\s*[\d(]/.test(p)) return {k: 'calcul', mesaj: 'înmulțirea se scrie cu *, de exemplu 3 * 4.'};   // „3 x 5”
      if (/\p{L}/u.test(p)) return {k: 'nume'};
      let v; try { v = evalueaza(p, {}); } catch (e) { return {k: 'calcul', mesaj: e && e.mesaj}; }   // „3 × 5”, „12 : 4”
      if (!acelasi(v, parseFloat(m[1].replace(',', '.')))) return {k: 'calcul'};
    }
    return {k: 'bun'};
  }
  function potriveste(inp, exp) {
    const s = curat(inp);
    if (exp === '' || exp == null) return NU_SE_EXECUTA.has(s);
    if (typeof exp === 'boolean') return exp ? s === 'adevarat' : s === 'fals';
    if (typeof exp === 'number') {
      const m = s.match(/^(?:[\p{L}_][\p{L}\d_]*\s*=\s*)?(-?\d+(?:[.,]\d+)?)\s*[\p{L}.]*$/u);
      if (m) return acelasi(parseFloat(m[1].replace(',', '.')), exp);
      const c = calculScris(s, exp);
      return !!c && c.k === 'bun';
    }
    return faraSemnLaCapat(s) === faraSemnLaCapat(cheie(String(exp)).trim().replace(/[„”"“]/g, '').replace(/\s+/g, ' '));
  }

  /* stilul, o singură dată (folosește jetoanele temei: --paper --paper2 --line --ink --ink2 --accent --ok --okbg --bad --badbg --fm) */
  function stil() {
    if (document.getElementById('ua-stil')) return;
    const e = document.createElement('style'); e.id = 'ua-stil';
    e.textContent = `
.ua-alg{counter-reset:ua;font-family:var(--fm,Consolas,monospace);font-size:.9rem;line-height:1.6;white-space:pre;overflow-x:auto;background:var(--paper2);border:1px solid var(--line);border-radius:8px;padding:.45em .7em;margin:.5em 0;color:var(--ink);tab-size:4}
.ua-alg .ua-l{counter-increment:ua}
.ua-alg .ua-l::before{content:counter(ua);display:inline-block;width:1.7em;margin-right:.6em;text-align:right;color:var(--ink2);border-right:1px solid var(--line);padding-right:.35em;user-select:none;-webkit-user-select:none}
.ua-alg input{font:inherit;font-family:var(--fm,Consolas,monospace);min-width:9ch;width:14ch;max-width:62vw;min-height:32px;padding:2px 6px;border:1.5px solid var(--accent);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.ua-tw{overflow-x:auto;margin:.5em 0}
.ua-t{border-collapse:collapse;font-size:.92rem;width:100%}
.ua-t th,.ua-t td{border:1px solid var(--line);padding:5px 7px;text-align:left;vertical-align:middle}
.ua-t th{background:var(--paper2);font-weight:700}
.ua-t td.nr{color:var(--ink2);font-family:var(--fm,monospace);width:2.2em;text-align:center}
.ua-t code.pl{font-family:var(--fm,monospace);white-space:pre;background:none;border:0;padding:0;font-size:.95em;color:var(--ink)}
.ua-t td.ok{background:var(--okbg)} .ua-t td.no{background:var(--badbg)}
.ua-t input,.ua-t select{font:inherit;font-family:var(--fm,monospace);width:6.5em;max-width:100%;min-height:34px;padding:3px 6px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.ua-t select{width:auto}
.ua-t .gol{color:var(--ink2);font-style:italic}
.ua-dat{font-family:var(--fm,monospace);font-weight:700;background:var(--sel,var(--paper2));border-radius:6px;padding:4px 8px;display:inline-block;margin:.3em 0 .4em}
.ua-teste{list-style:none;padding:0;margin:.6em 0 0;font-size:.9rem}
.ua-teste li{padding:2px 0}
.ua-teste li::before{content:"○ ";color:var(--ink2)}
.ua-teste li.ok::before{content:"✓ ";color:var(--ok);font-weight:700}
.ua-teste li.no::before{content:"✗ ";color:var(--bad);font-weight:700}
.ua-sim{display:flex;flex-wrap:wrap;gap:6px;margin:.4em 0}
.ua-sim button{min-width:40px;min-height:36px;font-family:var(--fm,monospace);font-size:1rem;border:1.5px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);cursor:pointer}
.ua-nota{font-size:.88rem;color:var(--ink2);margin:.3em 0}
.ua-lbl{font-weight:700;margin-top:.6em}
@media (max-width:560px){
  .ua-alg{font-size:.82rem}
  /* J2 (19.10.2026): un rând lung („Afișează cam cât face total”) trece dedesubt, nu iese din chenar; la copiere rămâne un
     rând. „body pre.ua-alg” ca să treacă peste „.exemplu pre{white-space:pre}” din motor.css (în pași, listarea stă în .exemplu) */
  body pre.ua-alg{white-space:pre-wrap}
  /* continuarea rândului rupt stă sub textul lui, nu sub coloana cu numere (altfel pare un rând fără număr) */
  body pre.ua-alg .ua-l{display:inline-block;vertical-align:top;max-width:100%;box-sizing:border-box;padding-left:calc(2.65em + 1px);text-indent:calc(-2.65em - 1px)}
  body pre.ua-alg .ua-l::before,body pre.ua-alg .ua-l input{text-indent:0}
  .ua-t.sim thead{display:none}
  .ua-t.sim tr{display:grid;grid-template-columns:2.2em 1fr;border-bottom:1px solid var(--line)}
  .ua-t.sim td{border:0;padding:4px 6px}
  .ua-t.sim td[data-c]{grid-column:2;padding-top:0}
  .ua-t.sim td[data-c]:empty{display:none}
  /* J1 (19.10.2026): și tabelele-exemplu (completate) stau pe rânduri pe telefon: „Ce se întâmplă” sub „Ce scrie”, nu tăiată */
  .ua-t:not(.sim){font-size:.85rem}
  .ua-t:not(.sim) thead{display:none}
  .ua-t:not(.sim) tr{display:grid;grid-template-columns:2.2em 1fr;border-bottom:1px solid var(--line)}
  .ua-t:not(.sim) td{border:0;padding:3px 6px}
  .ua-t:not(.sim) td:nth-child(3){grid-column:2;padding-top:0}
  .ua-t:not(.sim) td:nth-child(3):not(:empty)::before{content:"→ ";color:var(--ink2)}
  .ua-t:not(.sim) td:nth-child(3):empty{display:none}
}`;
    document.head.appendChild(e);
  }
  function listare(prog, cuGoluri) {
    stil();
    let g = 0;
    const linii = prog.map(raw => {
      const html = esc(raw).replace(/\{\?\}/g, () => cuGoluri ? cuGoluri(g++) : '___');
      return `<span class="ua-l">${html}</span>`;
    });
    return `<pre class="ua-alg">${linii.join('\n')}</pre>`;
  }
  /* dreapta săgeții (sau condiția) cu valorile de ACUM: „b - a” cu a = 6, b = 14 -> „14 - 6” */
  function inlocuieste(expr, valori) {
    const t = tokeni(expr);
    let out = '';
    t.forEach((x, k) => {
      let s;
      if (x.k === 'num') s = String(x.v);
      else if (x.k === 'txt') s = `„${x.v}”`;
      else if (x.k === 'id') { const g = caut(valori, x.v); s = g === null ? x.v : (typeof valori[g] === 'string' ? `„${valori[g]}”` : format(valori[g])); }
      else s = x.v === 'SI' ? 'ȘI' : x.v;
      const prev = t[k - 1];
      const lipit = k === 0 || (prev && prev.k === 'op' && prev.v === '(') || (x.k === 'op' && x.v === ')') ||
        (prev && prev.k === 'op' && prev.v === '-' && (k === 1 || (t[k - 2].k === 'op' && t[k - 2].v !== ')')));
      out += (lipit ? '' : ' ') + s;
    });
    return out;
  }
  /* tabelul de urmărire completat (exemplele din pași): coloanele Rândul / Ce scrie / Ce se întâmplă.
     opt.calcul = true: arată și calculul cu valorile de acum („b = 6 + 4 * 2 = 14”). */
  function tabel(prog, date, opt) {
    stil();
    const A = analizeaza(prog), R = ruleaza(A, date), calc = {};
    if (opt && opt.calcul) {
      const v = {};
      R.jurnal.forEach(e => {
        const r = A.randuri[e.i];
        if (r.tip === 'cit') r.nume.forEach(n => { v[n] = date[n]; });
        else if (r.tip === 'set') { calc[e.i] = inlocuieste(r.expr, v); v[r.nume] = e.val; }
        else if (r.tip === 'daca') calc[e.i] = inlocuieste(r.cond, v);
        else if (r.tip === 'afis') calc[e.i] = inlocuieste(r.expr, v);
      });
    }
    const simplu = s => /^„?[^\s]*”?$/.test(s);
    const ce = (r, s) => {
      if (r.tip === 'cit') return esc(s.val);
      if (!s.exec && ['set', 'afis', 'daca'].includes(r.tip)) return '<span class="gol">nu se execută</span>';
      const c = calc[r.i];
      if (r.tip === 'set') return `${esc(r.nume)} = ${c && !simplu(c) ? esc(c) + ' = ' : ''}${esc(format(s.val))}`;
      if (r.tip === 'daca') return `${c ? esc(c) + ': ' : 'condiția e '}${esc(format(s.val))}`;
      if (r.tip === 'afis') return `se afișează ${esc(format(s.val))}`;
      return '';
    };
    const rows = A.randuri.filter(r => r.tip !== 'gol').map(r => `<tr><td class="nr">${r.i + 1}</td><td><code class="pl">${esc(r.raw)}</code></td><td>${ce(r, R.randuri[r.i])}</td></tr>`).join('');
    return `<div class="ua-tw"><table class="ua-t"><thead><tr><th>Rândul</th><th>Ce scrie</th><th>Ce se întâmplă</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  const afv = x => typeof x === 'string' ? `„${x}”` : format(x);   // ce se afișează: textul între ghilimele, numărul fără
  const dateText = d => Object.entries(d).map(([k, x]) => `${k} = ${format(x)}`).join(', ');
  const anunta = detail => { try { window.dispatchEvent(new CustomEvent('urmarire-algoritm', {detail})); } catch (e) { /* fără eveniment */ } };
  const MODURI = {};

  /* ===================== 4. TIPUL „urmarire” ===================== */
  function alegeDate(Q) {
    const ia = (lista, fara) => {
      const l = lista.filter(d => d !== fara);
      return (l.length ? l : lista)[Math.floor(Math.random() * (l.length ? l.length : lista.length))];
    };
    const sets = [ia(Q.date, Q._ultimele && Q._ultimele[0])];
    if (Q.dateLaPrag && Q.dateLaPrag.length) sets.push(ia(Q.dateLaPrag, Q._ultimele && Q._ultimele[1]));
    else if ((Q.seturi || 1) > 1) sets.push(ia(Q.date.filter(d => d !== sets[0]), null));
    Q._ultimele = sets;   // „Încă o dată” nu primește aceleași date de două ori la rând (când se poate)
    return sets;
  }
  const URMARIRE = {
    render(Q, body, api) {
      stil();
      if (Q.mod && MODURI[Q.mod]) return MODURI[Q.mod].render(Q, body, api);
      const A = analizeaza(Q.prog), seturi = alegeDate(Q);
      const tabele = seturi.map((d, si) => {
        const R = ruleaza(A, d);
        const ck = [];
        const rows = A.randuri.filter(r => r.tip !== 'gol').map(r => {
          const s = R.randuri[r.i], id = `${si}-${r.i}`;
          let cell = '';
          if (r.tip === 'cit') cell = `<span class="ua-dat" style="margin:0">${esc(s.val)}</span>`;
          else if (r.tip === 'daca') {
            const exp = s.exec ? s.val : '';
            ck.push({id, i: r.i, tip: r.tip, exp, et: `Rândul ${r.i + 1}: condiția ${s.exec ? 'e adevărată sau falsă?' : 'nu se mai verifică (e pe ramura care nu se execută): rămâne „alege…”'}`});
            cell = `<select data-i="${id}" aria-label="Rândul ${r.i + 1}: condiția"><option value="">alege…</option><option value="adevărat">adevărat</option><option value="fals">fals</option></select>`;
          } else if (r.tip === 'set' || r.tip === 'afis') {
            const exp = s.exec ? s.val : '';
            const ind = r.ind > 0;
            ck.push({id, i: r.i, tip: r.tip, exp, ind, et: r.tip === 'set'
              ? `Rândul ${r.i + 1}: ce valoare primește ${esc(r.nume)}${ind ? ' (sau gol, dacă ramura nu se execută)' : ''}`
              : `Rândul ${r.i + 1}: ce se afișează${ind ? ' (sau gol, dacă ramura nu se execută)' : ''}`});
            cell = r.tip === 'set'
              ? `<label>${esc(r.nume)} = <input data-i="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="Rândul ${r.i + 1}: noua valoare a lui ${esc(r.nume)}"></label>`
              : `<label>se afișează: <input data-i="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Rândul ${r.i + 1}: ce se afișează"></label>`;
          }
          return `<tr><td class="nr">${r.i + 1}</td><td><code class="pl">${esc(r.raw)}</code></td><td data-c="${id}">${cell}</td></tr>`;
        }).join('');
        const titlu = seturi.length > 1 ? `<div class="ua-lbl">Tabelul ${si + 1}${si === 1 && Q.dateLaPrag ? ' (date exact la prag)' : ''}</div>` : '';
        return {ck, html: `${titlu}<div class="ua-dat">Datele de intrare: ${esc(dateText(d))}</div>
          <div class="ua-tw"><table class="ua-t sim"><thead><tr><th>Rândul</th><th>Ce scrie</th><th>Ce se întâmplă (completezi)</th></tr></thead><tbody>${rows}</tbody></table></div>`};
      });
      const ck = tabele.flatMap(t => t.ck);
      const nrT = tabele.length > 1;
      body.innerHTML = tabele.map(t => t.html).join('') +
        `<p class="ua-nota">Scrie doar numărul (de exemplu 12) sau textul afișat (fără ghilimele).${A.randuri.some(r => r.tip === 'daca') ? ' Pe o ramură care <b>nu</b> se execută, lași căsuța goală (sau scrii „nu se execută”).' : ''}</p>
        <div class="ua-lbl">Testele</div><ul class="ua-teste">${ck.map(c => `<li data-t="${c.id}">${nrT ? `Tabelul ${+c.id.split('-')[0] + 1}, r` : 'R'}${c.et.slice(1)}</li>`).join('')}</ul>`;
      body._ua = {ck, Q};
      const el = id => body.querySelector(`[data-i="${id}"]`);
      const inputs = [...body.querySelectorAll('[data-i]')];
      inputs.forEach((e, k) => e.addEventListener('keydown', ev => {   // Enter = căsuța următoare, ca pe caiet (nu trimite nimic)
        if (ev.key === 'Enter') { ev.preventDefault(); const n = inputs[k + 1]; if (n) n.focus(); else { const b = document.getElementById('chk'); if (b) b.focus(); } }
      }));
      const marcheaza = () => {
        let bune = 0, cs; const motive = [];
        // J1 (19.10.2026): la două tabele, mesajul spune și care tabel („tabelul 2, rândul 7: …”)
        const rn = c => `${nrT ? `tabelul ${+c.id.split('-')[0] + 1}, ` : ''}rândul ${c.i + 1}`;
        ck.forEach(c => {
          const e = el(c.id), val = e ? e.value : '';
          const ok = c.tip === 'daca' ? (c.exp === '' ? val === '' : potriveste(val, c.exp)) : potriveste(val, c.exp);
          if (ok) bune++;
          else if (c.exp === '' && val.trim() !== '') motive.push(`${rn(c)} e pe ramura care NU se execută: căsuța lui rămâne goală (sau scrii „nu se execută”)`);
          else if (c.exp !== '' && val.trim() === '') motive.push(`${rn(c)} se execută: completează-l`);
          else if (c.tip === 'daca') motive.push(`${rn(c)}: pune în condiție valorile de ACUM și compară din nou`);
          else if (typeof c.exp === 'number' && (cs = calculScris(curat(val), c.exp)) && ['nume', 'calcul'].includes(cs.k))   // J2: rezultatul e cel bun, calculul din stânga nu
            motive.push(cs.k === 'nume' ? `${rn(c)}: în calcul pune numerele de ACUM în locul numelor (ca în tabelul-exemplu) sau scrie doar rezultatul`
              : `${rn(c)}: ${cs.mesaj ? cs.mesaj.replace(/\.$/, '') : 'calculul dinainte de „=” nu dă numărul scris după el'}; corectează calculul sau scrie doar rezultatul`);
          else if (c.tip === 'set') motive.push(`${rn(c)}: calculează dreapta săgeții cu valorile de ACUM`);
          else if (typeof c.exp === 'string') motive.push(`${rn(c)}: scrie textul dintre ghilimele, așa cum e în algoritm`);
          else motive.push(`${rn(c)}: se afișează valoarea de ACUM`);
          body.querySelector(`td[data-c="${c.id}"]`).className = ok ? 'ok' : 'no';
          body.querySelector(`li[data-t="${c.id}"]`).className = ok ? 'ok' : 'no';
        });
        return {bune, motive};
      };
      const umple = () => ck.forEach(c => { const e = el(c.id); if (e) e.value = c.exp === '' ? '' : format(c.exp); });
      body._umple = umple;
      const nav = api.checkButton(() => {
        const {bune, motive} = marcheaza(), ok = bune === ck.length;
        anunta({tip: 'urmarire', bune, total: ck.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          api.resolve(false, `${bune} din ${ck.length} teste trec. ${motive.slice(0, 2).map(m => m[0].toUpperCase() + m.slice(1)).join('. ')}.`);
          api.revealButton(() => { umple(); marcheaza(); nav.innerHTML = ''; api.giveUp('valorile corecte sunt acum în tabel, cu verde. Parcurge-le rând cu rând.'); });
        }
      }, 'Verifică tabelul');
    },
    rezolva(Q, body) { if (body._umple) body._umple(); },
    gresit(Q, body) {
      body._umple();
      const ck = body._ua.ck, c = [...ck].reverse().find(x => x.exp !== '');
      const e = body.querySelector(`[data-i="${c.id}"]`);
      if (c.tip === 'daca') e.value = c.exp ? 'fals' : 'adevărat';
      else if (typeof c.exp === 'number') e.value = String(c.exp + 1);
      else e.value = 'altceva';
    }
  };

  /* ===================== 5. TIPUL „completeaza” ===================== */
  const umpleGoluri = (prog, bucati) => { let g = 0; return prog.map(l => l.replace(/\{\?\}/g, () => bucati[g++] == null ? '' : bucati[g - 1])); };
  const COMPLETEAZA = {
    render(Q, body, api) {
      stil();
      const ref = umpleGoluri(Q.prog, Q.solutie), Aref = analizeaza(ref);
      const teste = Q.teste.map(t => {
        const R = ruleaza(Aref, t.date);
        return {date: t.date, asteptat: R.afisari, ce: t.ce || `${dateText(t.date)} → se afișează ${R.afisari.map(afv).join(', ')}`};
      });
      body.innerHTML = listare(Q.prog, g => `<input data-g="${g}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Căsuța ${g + 1} din algoritm">`) +
        `<div class="ua-sim" role="group" aria-label="Semne care nu sunt pe tastatură">${['≤', '≥', '≠', '<', '>', '='].map(c => `<button type="button" data-s="${c}" aria-label="Scrie semnul ${c}">${c}</button>`).join('')}</div>
        <p class="ua-nota">Semnele ≤ ≥ ≠ le pui cu butoanele de mai sus (sau scrii &lt;= &gt;= &lt;&gt;). Verificarea rulează algoritmul tău pe datele de mai jos.</p>
        <div class="ua-lbl">Testele</div><ul class="ua-teste">${teste.map((t, k) => `<li data-t="${k}">${esc(t.ce)}</li>`).join('')}</ul><p class="ua-nota" data-mesaj aria-live="polite"></p>`;
      const goluri = [...body.querySelectorAll('input[data-g]')];
      let ultim = goluri[0];
      goluri.forEach((e, k) => {
        e.addEventListener('focus', () => { ultim = e; });
        e.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const n = goluri[k + 1]; if (n) n.focus(); else { const b = document.getElementById('chk'); if (b) b.click(); } } });
      });
      body.querySelectorAll('[data-s]').forEach(b => {
        b.addEventListener('mousedown', ev => ev.preventDefault());   // căsuța nu pierde cursorul
        b.addEventListener('click', () => {
          const e = ultim || goluri[0]; if (!e) return;
          const a = e.selectionStart == null ? e.value.length : e.selectionStart, z = e.selectionEnd == null ? a : e.selectionEnd, c = b.dataset.s;
          const sp = (a > 0 && e.value[a - 1] !== ' ' ? ' ' : '') + c + ' ';
          e.value = e.value.slice(0, a) + sp + e.value.slice(z); e.focus(); const p = a + sp.length; try { e.setSelectionRange(p, p); } catch (x) { /* unele tipuri nu au cursor */ }
        });
      });
      const mesaj = body.querySelector('[data-mesaj]');
      const verifica = () => {
        const buc = goluri.map(e => e.value.trim());
        const li = k => body.querySelector(`li[data-t="${k}"]`);
        if (buc.some(x => !x)) return {bune: 0, mesaj: 'Mai ai o căsuță goală în algoritm.', toate: teste.map(() => false)};
        let A;
        try { A = analizeaza(umpleGoluri(Q.prog, buc)); } catch (e) { return {bune: 0, mesaj: `Algoritmul nu se înțelege: ${e.message}.`, toate: teste.map(() => false)}; }
        let bune = 0, prim = '', citit = null;
        const toate = teste.map((t, k) => {
          let R;
          try { R = ruleaza(A, t.date); } catch (e) {
            if (!prim) prim = `Rândul ${(e.rand || 0) + 1}: ${e.mesaj || e.message}`;
            li(k).className = 'no'; return false;
          }
          if (R.citit) citit = R.citit;
          const ok = R.afisari.length === t.asteptat.length && R.afisari.every((x, j) => potriveste(format(x), t.asteptat[j]));
          li(k).className = ok ? 'ok' : 'no';
          if (ok) bune++;
          else if (!prim) prim = `Pentru ${dateText(t.date)}, algoritmul tău afișează ${R.afisari.length ? R.afisari.map(afv).join(', ') : 'nimic'}, dar trebuia ${t.asteptat.map(afv).join(', ')}.`;
          return ok;
        });
        let m = prim;
        if (citit) m = (m ? m + ' ' : '') + `(Am citit „${citit[0]}” ca „${citit[1]}”.)`;
        return {bune, mesaj: m, toate};
      };
      body._verifica = verifica;
      const nav = api.checkButton(() => {
        const r = verifica(), ok = r.bune === teste.length;
        mesaj.textContent = ok ? (r.mesaj || '') : '';
        anunta({tip: 'completeaza', bune: r.bune, total: teste.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          api.resolve(false, `${r.bune} din ${teste.length} teste trec. ${esc(r.mesaj || '')}`);
          api.revealButton(() => { goluri.forEach((e, k) => { e.value = Q.solutie[k]; }); verifica(); nav.innerHTML = ''; api.giveUp(`<code>${esc(Q.solutie.join(' · '))}</code>`); });
        }
      }, 'Verifică algoritmul');
    },
    rezolva(Q, body) { body.querySelectorAll('input[data-g]').forEach((e, k) => { e.value = Q.solutie[k]; }); },
    gresit(Q, body) { body.querySelectorAll('input[data-g]').forEach((e, k) => { e.value = (Q.gresit || [])[k] || ''; }); }
  };

  /* ===================== 6. EXTINDERE (pentru lecțiile următoare) ===================== */
  /* def = {tip:'nume', re:/^…$/iu, bloc?:true, prinde?(m)->{…}, executa(nod, ctx), dupaBloc?(nod, rr, getK, setK)}
     executa primește nodul ({r, copii}) și ctx = {v (valorile), date, noteaza(r, val, extra), evalueaza(expr, r),
     executa(noduri), pasi}. ctx.noteaza numără pașii; peste 2000, algoritmul e oprit cu mesajul de finitudine. */
  function instructiune(def) {
    if (!def || !def.tip || !(def.re instanceof RegExp) || typeof def.executa !== 'function') throw new Error('UrmarireAlgoritm.instructiune: {tip, re, executa} sunt obligatorii');
    INSTR.unshift(def);
  }
  /* mod(nume, {render(Q, body, api)}) — alt fel de tabel pentru tipul „urmarire” (Q.mod = nume), de exemplu un rând pe
     fiecare pas EXECUTAT (din ruleaza(...).jurnal), pentru algoritmii în care un rând se execută de mai multe ori. */
  function mod(nume, def) { MODURI[nume] = def; }

  window.UrmarireAlgoritm = {
    versiune: VERSIUNE, analizeaza, ruleaza, evalueaza: (e, v) => evalueaza(e, v), format, potriveste, listare: p => listare(p), tabel,
    tipuri: {urmarire: URMARIRE, completeaza: COMPLETEAZA}, instructiune, mod, _intern: {esc, stil, dateText, anunta, alegeDate, umpleGoluri}
  };
})();
