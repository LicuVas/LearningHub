/* lectii/_sim/evaluare-expresii.js — „Evaluarea expresiilor, pas cu pas” și „adevărat sau fals, și de ce”, pentru o lecție
   FĂRĂ profesor (ora simultană), cu degetul pe telefon (390 px) sau cu mouse-ul.

   PROPRIETAR: lecția V/27 (lectii/v/m4-l27, „Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”),
   02.11.2026. Lecțiile următoare îl pot încărca întreg, NEMODIFICAT; ce le lipsește fac într-un fișier NOU
   (`lectii/_sim/evaluare-expresii-<ceva>.js`). Nu depinde de alt simulator; dacă pagina a încărcat ÎNAINTE și
   `cutii-variabile.js` (V/26), numerele scrise de elev se citesc cu `CutiiVariabile.numar` (cifre, „doisprezece”,
   „3 * 4 = 12”); fără el, doar cu cifre.

   FIDELITATE (nu simulează o aplicație; e fișa de exerciții de pe tablă / din caiet, ca în manualele de clasa a V-a):
     - Operatorii: aritmetici + − * / % (restul împărțirii), relaționali = ≠ < > ≤ ≥ (se primesc și <>, <=, >= în
       configurație), logici „și”, „sau”, „nu”; valorile logice „adevărat” și „fals”. Operanzii: numere naturale, valorile
       adevărat / fals și cutii (variabilele lecției V/26), scrise «nume».
     - Ordinea (REGULA PAGINII, întocmai — de la 1.1, 02.11.2026, după judecata 1, J1-A / J1-J): simulatorul primește ca
       „se face acum” EXACT ce scrie pagina, nici mai mult, nici mai puțin:
         1. ce e în paranteze, întâi paranteza dinăuntru; cât timp un operator are în grupul lui (aceeași paranteză sau
            în afara tuturor) o paranteză neterminată, el așteaptă (2 * 3 + (4 + 1): întâi 4 + 1). Două paranteze
            separate (nu una în alta): oricare întâi.
         2. în grupul fără paranteze: *, / și % de la stânga la dreapta; DOAR bucățile cu *, / sau % despărțite de ALT operator
            (+, −, o comparație, „și”, „sau”) se pot face în orice ordine — rezultatul e același (3 * 4 + 10 / 5: oricare;
            2 * 3 > 4 * 1: oricare; 20 − 12 / 4 * 2: întâi 12 / 4). [J2-O, 02.11: V/27 arată doar cazul cu + / −; o lecție
            care are calcule de ambele părți ale unei comparații spune asta în pagina ei.]
         3. apoi + și −, STRICT de la stânga la dreapta (8 − 2 − 3 + 1: întâi 8 − 2; 10 − 2 + 3 * 4: întâi 3 * 4);
         4. apoi comparațiile; apoi „nu”; apoi „și”; apoi „sau”.
       O cutie se înlocuiește oricând cu valoarea ei de ACUM, dar înaintea operatorului de lângă ea.
       „nu” se scrie MEREU cu paranteză după el: `nu (4 > 7)`; `jetoane()` refuză „nu 4 > 7” (ordinea ar fi ambiguă).
     - Mesajele (regula 28): orice refuz venit după un pas greșit (făcut prea devreme sau cu rezultat greșit) numește
       pasul acela, de ce, de câte ori apeși „Înapoi un pas” și ce atingi acolo — urmat întocmai, duce la „Corect”.
     - % = restul de la matematică (17 = 5 · 3 + 2; restul e între 0 și împărțitor); lecțiile n-au numere negative.
     - Împărțirea „/” se face doar când iese exact; dacă nu iese exact sau e la 0, pagina spune asta și NU face pasul.
     - Ca pe hârtie: elevul alege operatorul și scrie rezultatul; expresia se rescrie cu ce a scris EL (și o greșeală merge
       mai departe). Testele de la „Verifică” judecă FIECARE PAS: ordinea (operatorul ales se făcea atunci?), calculul
       (rezultatul scris e al operației alese?) și valoarea de la sfârșit. Ordinea e chiar ce se predă: excepție spusă de
       la „rezultat, nu drum” (regula 29).
     - Nimic nu se salvează și nimic nu pleacă: 0 scrieri în localStorage / sessionStorage / cookie, 0 cereri.

   API PUBLIC (window.EvaluareExpresii):
     versiune                     '1.1 (02.11.2026)'  (1.1: ordinea = regula paginii întocmai; „nu” doar cu paranteză;
                                  mesajele numesc pasul greșit; % = restul de la matematică — vezi granița v_l27)
     jetoane(text)                -> lista de jetoane a expresiei (aruncă eroare dacă textul nu e o expresie)
     text(E | jetoane)            -> textul expresiei, cu «» la cutii
     ruleaza(E)                   -> {pasi:[{sub, rez, rand}], valoare}  evaluarea corectă, pas cu pas
     valoare(E)                   -> valoarea (număr sau true/false)
     urma(E, {titlu?})            -> HTML static: evaluarea pas cu pas, rând sub rând (pentru „Uite cum”)
     cutiiHtml(E)                 -> HTML static: cutiile expresiei cu valorile lor de acum
     tipuri['expresie-pas'], tipuri['adevarat-fals']   {render, rezolva, gresit} pentru JocMotor

   EXPRESIA E: {e:'«bani» − «preț» * 2', cutii?:{bani:20, 'preț':6} (valorile de ACUM), inainte?:['Pune 10 în cutia «bani».', …]
     (dacă există, pagina arată pașii algoritmului de dinainte, NU și valorile: elevul le află din pași)}
   TIPUL „expresie-pas”:
     {t:'expresie-pas', q, expresii:[E, …], teste?:[{k:'ordine'|'calcule'|'valoare', e:indice, ce}] (implicit: câte trei
      pe expresie), gresit?:{e:indice} (expresia pe care `gresit` o face „de la stânga la dreapta”), ajutor, why}
     Mai multe expresii = file „Expresia 1, 2, …”. Elevul atinge un operator (sau o cutie) din rândul de jos, scrie
     rezultatul (la comparații și la „și / sau / nu”: butoanele „adevărat” / „fals”), apoi rândul nou apare dedesubt.
     „Înapoi un pas” șterge ultimul rând; „Ia-o de la capăt” pornește expresia din nou.
   TIPUL „adevarat-fals”:
     {t:'adevarat-fals', q, afirmatii:[{e, cutii?, motive:['…', …], m:indicele motivului bun}], teste? (implicit unul pe
      expresie: {k:'af', i, ce}), gresit?:indice}
     Valoarea bună (adevărat / fals) o calculează simulatorul din expresie; elevul alege valoarea și motivul (variante-soră).
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('evaluare-expresii', {detail:{tip, bune, total, ok}}).

   CE NU SE SCHIMBĂ (lecțiile următoare se sprijină pe ele): numele tipurilor și ale testelor (k), forma lui E, semnele
   operatorilor și regulile de ordine de mai sus, clasele CSS cu prefixul `ee-`, id-ul stilului `ee-css`, regula „nimic
   nu se salvează, nimic nu pleacă”.
*/
(function () {
  'use strict';
  const VERSIUNE = '1.1 (02.11.2026)';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const NOTA_GATA = 'Exercițiul e încheiat, de aceea nu se mai schimbă nimic. Ca să-l faci din nou, apasă „Ia-o de la capăt”.';
  const NOTA_DIN_NOU = 'O încercare nouă, doar ca să exersezi: exercițiul e deja încheiat. Testele se bifează iar la „Verifică”.';

  /* ===================== jetoanele ===================== */
  const PR = {'*': 5, '/': 5, '%': 5, '+': 4, '−': 4, '=': 3, '≠': 3, '<': 3, '>': 3, '≤': 3, '≥': 3, 'și': 2, 'sau': 1};
  const ARIT = ['*', '/', '%', '+', '−'], REL = ['=', '≠', '<', '>', '≤', '≥'], LOG = ['și', 'sau'];
  const SEMN = {'<>': '≠', '<=': '≤', '>=': '≥', '-': '−', '–': '−'};
  function jetoane(s) {
    const re = /\s*(\d+|«[^»]+»|adevărat|fals|și|sau|nu|<>|<=|>=|≠|≤|≥|[-−–+*\/%=<>()])/y;
    const tk = []; let m; re.lastIndex = 0;
    while (re.lastIndex < s.length && (m = re.exec(s))) {
      const x = m[1];
      if (/^\d+$/.test(x)) tk.push({k: 'n', v: parseInt(x, 10)});
      else if (x[0] === '«') tk.push({k: 'v', n: x.slice(1, -1)});
      else if (x === 'adevărat' || x === 'fals') tk.push({k: 'b', v: x === 'adevărat'});
      else if (x === 'nu') tk.push({k: 'u', o: 'nu'});
      else if (x === '(' || x === ')') tk.push({k: x});
      else tk.push({k: 'o', o: SEMN[x] || x});
    }
    if (s.slice(re.lastIndex).trim()) throw new Error('evaluare-expresii: nu înțeleg „' + s + '”');
    tk.forEach((t, i) => { if (t.k === 'u' && !(tk[i + 1] && tk[i + 1].k === '(')) throw new Error('evaluare-expresii: după „nu” vine mereu o paranteză: „' + s + '”'); });
    parse(tk);
    return tk;
  }
  const valTxt = v => v === true ? 'adevărat' : v === false ? 'fals' : String(v);
  function textJ(tk) {
    let s = '';
    tk.forEach((t, i) => {
      const p = t.k === 'n' || t.k === 'b' ? valTxt(t.v) : t.k === 'v' ? '«' + t.n + '»' : t.k === 'o' || t.k === 'u' ? t.o : t.k;
      if (i && !(t.k === ')') && !(tk[i - 1].k === '(')) s += ' ';
      s += p;
    });
    return s;
  }
  const text = E => textJ(Array.isArray(E) ? E : jetoane(E.e));

  /* arborele (doar ca să știm ce operator „se face acum”); nodurile țin indicele jetonului */
  function parse(tk) {
    let p = 0;
    const err = () => { throw new Error('evaluare-expresii: expresie greșită „' + textJ(tk) + '”'); };
    function prim() {
      const t = tk[p];
      if (!t) err();
      if (t.k === '(') { const i0 = p; p++; const a = expr(0); if (!tk[p] || tk[p].k !== ')') err(); p++; return {t: 'par', a, i0}; }
      if (t.k === 'u') { const i = p; p++; return {t: 'nu', a: prim(), i}; }
      if (t.k === 'n' || t.k === 'b' || t.k === 'v') { p++; return {t: 'lit', i: p - 1}; }
      return err();
    }
    function expr(min) {
      let a = prim();
      while (tk[p] && tk[p].k === 'o' && PR[tk[p].o] >= min) { const i = p, o = tk[p].o; p++; const b = expr(PR[o] + 1); a = {t: 'op', o, a, b, i}; }
      return a;
    }
    const r = expr(0);
    if (p !== tk.length) err();
    return r;
  }
  const eV = t => !!t && (t.k === 'n' || t.k === 'b');
  /* ===== ce se face ACUM = REGULA PAGINII (capul fișierului, 1-4), fără arbore: pe grupuri =====
     grupul unui operator = paranteza cea mai dinăuntru care îl conține (-1 = în afara parantezelor) */
  const HI = ['*', '/', '%'], LO = ['+', '−'];
  const opDe = (tk, j) => tk[j].k === 'u' ? 'nu' : tk[j].o;
  function grupuri(tk) {
    const st = [], per = {}, gr = new Map();
    tk.forEach((t, i) => {
      if (t.k === '(') st.push(i);
      else if (t.k === ')') per[st.pop()] = i;
      else if (t.k === 'o' || t.k === 'u') { const g = st.length ? st[st.length - 1] : -1; if (!gr.has(g)) gr.set(g, []); gr.get(g).push(i); }
    });
    return [...gr.entries()].map(([g, ops]) => {
      const z = g >= 0 ? per[g] : tk.length;
      let cuPar = false; for (let j = g + 1; j < z; j++) if (tk[j].k === '(') { cuPar = true; break; }
      return {g, ops, cuPar};
    });
  }
  /* într-un grup fără paranteze: operatorii pe care regula îi lasă acum (înainte de a cere valori lângă ei) */
  function treapta(tk, ops) {
    const o = j => opDe(tk, j);
    if (ops.some(j => HI.includes(o(j)))) {   // capul fiecărei bucăți cu * / % (bucățile sunt despărțite de alți operatori)
      const r = []; let prev = false;
      ops.forEach(j => { const h = HI.includes(o(j)); if (h && !prev) r.push(j); prev = h; });
      return {fel: 'H', r};
    }
    if (ops.some(j => LO.includes(o(j)))) return {fel: 'L', r: [ops.find(j => LO.includes(o(j)))]};
    if (ops.some(j => REL.includes(o(j)))) return {fel: 'R', r: ops.filter(j => REL.includes(o(j)))};
    if (ops.some(j => o(j) === 'nu')) return {fel: 'U', r: ops.filter(j => o(j) === 'nu')};
    if (ops.some(j => o(j) === 'și')) return {fel: 'S', r: [ops.find(j => o(j) === 'și')]};
    return {fel: 'O', r: ops.filter(j => o(j) === 'sau').slice(0, 1)};
  }
  /* indicii operatorilor care se fac ACUM (regula paginii + valori lângă ei) */
  function gata(tk) {
    const r = new Set();
    grupuri(tk).forEach(G => { if (!G.cuPar) treapta(tk, G.ops).r.forEach(j => r.add(j)); });
    return new Set([...r].filter(j => tk[j].k === 'u' ? eV(tk[j + 1]) : eV(tk[j - 1]) && eV(tk[j + 1])));
  }
  /* de ce operatorul i NU se face acum (îl poate alege, dar e o greșeală de ordine) — aceeași regulă ca gata() */
  function motiv(tk, i) {
    const G = grupuri(tk).find(x => x.ops.includes(i)); if (!G) return 'nu se face acum';
    const o = opDe(tk, i), on = LOG.includes(o) || o === 'nu' ? `„${o}”` : o;
    if (G.cuPar) return 'întâi termini ce e în paranteză';
    const T = treapta(tk, G.ops), cap = T.r.length ? opDe(tk, T.r[0]) : '';
    if (LOG.includes(o) && (T.fel === 'H' || T.fel === 'L' || T.fel === 'R')) return `întâi afli ce dă fiecare parte a lui ${on} (adevărat sau fals)`;
    if (o === 'nu' && (T.fel === 'H' || T.fel === 'L' || T.fel === 'R')) return 'întâi faci ce e în paranteza de după „nu”';
    if (REL.includes(o) && (T.fel === 'H' || T.fel === 'L')) return 'întâi faci calculele, apoi compari';
    if (T.fel === 'H') return HI.includes(o) ? 'la operatori de același fel (*, / și %), întâi îl faci pe cel din stânga' : `${cap} se face înaintea lui ${on}`;
    if (T.fel === 'L') return 'la operatori de același fel (+ și −), întâi îl faci pe cel din stânga';
    if (T.fel === 'U') return `„nu” se face înaintea lui ${on}`;
    if (T.fel === 'S') return '„și” se face înaintea lui „sau”';
    return 'nu se face acum';
  }
  const deNori = n => n === 1 ? 'o dată' : `de ${n} ori`;
  /* ce atingi pe rândul tk, după regula paginii (pentru mesaje): „* (din 3 * 4) sau / (din 10 / 5)” / „cutia «x»” */
  function deFacut(tk) {
    const g = [...gata(tk)].sort((a, b) => a - b);
    if (g.length) return g.map(j => { const o = opDe(tk, j); return `${LOG.includes(o) || o === 'nu' ? `„${o}”` : o} (din ${subTxt(tk, j)})`; }).join(' sau ');
    const c = tk.findIndex(t => t.k === 'v');
    return c >= 0 ? `cutia «${tk[c].n}»` : '';
  }
  const primulRau = s => s.pasi.findIndex(p => !p.corect || p.scris !== p.adev);
  /* J1-B: mesajul care scoate din greșeală când greșeala e cu câțiva pași mai sus */
  function mesajPasRau(s, k) {
    const p = s.pasi[k], n = s.pasi.length - k;
    const ce = !p.corect ? `s-a făcut prea devreme: ${p.motiv}` : p.cutie ? `are valoarea greșită: în cutia «${p.cutie}» nu e ${valTxt(p.scris)}` : `are rezultatul greșit: ${p.sub} nu dă ${valTxt(p.scris)}`;
    const acolo = !p.corect ? deFacut(p.inainte) : '';
    return `Greșeala e mai sus: pasul ${k + 1} (${p.sub}) ${ce}. Apasă „Înapoi un pas” ${deNori(n)}, până la el${acolo ? `; acolo atingi întâi ${acolo}` : p.cutie ? '; acolo scrii din nou ce e în cutie' : '; acolo scrii din nou rezultatul'}.`;
  }
  /* refuzul unui operator: după un pas greșit numește pasul acela; altfel spune ce se face acum */
  function refuz(s, j, nu) {
    const k = primulRau(s);
    if (k >= 0) return mesajPasRau(s, k);
    const L = s.tk[j - 1], R = s.tk[j + 1];
    if ([L, R].some(x => x && (x.k === 'v' || x.k === '(' || x.k === ')'))) return nu;   // „întâi cutia / paranteza”: spune deja ce faci
    if (!gata(s.tk).has(j)) { const d = deFacut(s.tk), o = opDe(s.tk, j); return `Operatorul ${LOG.includes(o) || o === 'nu' ? `„${o}”` : o} nu se face acum: ${motiv(s.tk, j)}.${d ? ` Atinge întâi ${d}.` : ''}`; }
    return nu;
  }
  /* poate fi ales? (lângă el stau valori de felul cerut) -> null sau mesajul */
  function nuSePoate(tk, i) {
    const t = tk[i], L = tk[i - 1], R = tk[i + 1];
    const desc = x => !x ? '' : x.k === '(' || x.k === ')' ? 'o paranteză' : x.k === 'v' ? `cutia «${x.n}»` : x.k === 'o' || x.k === 'u' ? 'un alt operator' : '';
    if (t.k === 'u') {
      if (R && R.k === 'b') return null;
      if (R && R.k === '(') return 'După „nu” e o paranteză: întâi termini ce e în ea.';
      return 'După „nu” trebuie să stea adevărat sau fals.';
    }
    const vecin = [L, R].find(x => !x || (x.k !== 'n' && x.k !== 'b'));
    if (vecin !== undefined) {
      const d = desc(vecin), op = LOG.includes(t.o) ? `„${t.o}”` : t.o;
      if (vecin && vecin.k === 'v') return `Lângă ${op} e ${d}: întâi atinge cutia și scrie valoarea ei de acum.`;
      if (vecin && (vecin.k === '(' || vecin.k === ')')) return `Lângă ${op} e ${d}: întâi termini ce e în paranteză.`;
      return `Lângă ${op} trebuie să stea două valori.`;
    }
    if (LOG.includes(t.o) && (L.k !== 'b' || R.k !== 'b')) return `Lângă „${t.o}” trebuie să stea adevărat sau fals: întâi faci comparațiile.`;
    if (!LOG.includes(t.o) && (L.k !== 'n' || R.k !== 'n')) return `Lângă ${t.o} trebuie să stea numere.`;
    if (t.o === '/' && R.v === 0) return 'Nu se împarte la 0.';
    if (t.o === '%' && R.v === 0) return 'Restul împărțirii la 0 nu există.';
    if (t.o === '/' && L.v % R.v !== 0) return `${L.v} / ${R.v} nu iese exact; în lecția asta împărțirile ies exact.`;
    return null;
  }
  function calc(o, a, b) {
    switch (o) {
      case '+': return a + b; case '−': return a - b; case '*': return a * b; case '/': return a / b; case '%': return ((a % b) + b) % b;   // restul de la matematică (0 ≤ rest < împărțitor); diferă de % din JS doar la numere negative
      case '=': return a === b; case '≠': return a !== b; case '<': return a < b; case '>': return a > b; case '≤': return a <= b; case '≥': return a >= b;
      case 'și': return a && b; case 'sau': return a || b; case 'nu': return !a;
    }
    return null;
  }
  const subTxt = (tk, i) => tk[i].k === 'v' ? '«' + tk[i].n + '»' : tk[i].k === 'u' ? 'nu ' + valTxt(tk[i + 1].v) : `${valTxt(tk[i - 1].v)} ${tk[i].o} ${valTxt(tk[i + 1].v)}`;
  const adevaratLa = (tk, i, E) => tk[i].k === 'v' ? valCutie(E, tk[i].n) : tk[i].k === 'u' ? calc('nu', tk[i + 1].v) : calc(tk[i].o, tk[i - 1].v, tk[i + 1].v);
  function valCutie(E, n) { const c = E.cutii || {}; if (!(n in c)) throw new Error('evaluare-expresii: cutia «' + n + '» n-are valoare'); return c[n]; }
  /* face pasul i cu valoarea scrisă v -> jetoanele noi */
  function aplica(tk, i, v) {
    const lit = typeof v === 'boolean' ? {k: 'b', v} : {k: 'n', v};
    let r;
    if (tk[i].k === 'v') r = tk.slice(0, i).concat([lit], tk.slice(i + 1));
    else if (tk[i].k === 'u') r = tk.slice(0, i).concat([lit], tk.slice(i + 2));
    else r = tk.slice(0, i - 1).concat([lit], tk.slice(i + 2));
    for (let j = 0; j + 2 < r.length;) {   // „(12)” devine „12”
      if (r[j].k === '(' && (r[j + 1].k === 'n' || r[j + 1].k === 'b') && r[j + 2].k === ')') { r.splice(j, 3, r[j + 1]); j = Math.max(0, j - 1); } else j++;
    }
    return r;
  }
  const terminat = tk => tk.length === 1 && (tk[0].k === 'n' || tk[0].k === 'b');
  /* evaluarea corectă: întâi cutiile (de la stânga), apoi primul operator gata, de la stânga */
  function ruleaza(E) {
    let tk = jetoane(E.e); const pasi = [];
    let paza = 0;
    while (!terminat(tk) && paza++ < 200) {
      let i = tk.findIndex(t => t.k === 'v');
      if (i < 0) i = Math.min(...gata(tk));
      const rez = adevaratLa(tk, i, E);
      pasi.push({sub: subTxt(tk, i), rez, rand: textJ(tk), i});
      tk = aplica(tk, i, rez);
    }
    return {pasi, valoare: tk[0].v};
  }
  const valoare = E => ruleaza(E).valoare;

  /* ===================== citirea numărului scris ===================== */
  function citeste(s) {
    const t = String(s == null ? '' : s).trim();
    if (!t) return {ok: false, m: 'Scrie întâi rezultatul.'};
    const MINUS = 'Rezultatele din lecție sunt fără semnul minus în față.';
    if (window.CutiiVariabile && typeof window.CutiiVariabile.numar === 'function') {
      const r = window.CutiiVariabile.numar(t);
      if (r.ok) return {ok: true, v: r.v};
      return {ok: false, minus: r.motiv === 'minus', m: r.motiv === 'multe' ? 'Scrie un singur număr: rezultatul.' : r.motiv === 'zecimal' ? 'Rezultatele din lecție sunt numere fără virgulă: scrie numărul doar cu cifre.' : r.motiv === 'minus' ? MINUS : `Nu înțeleg „${t}”. Scrie rezultatul cu cifre.`};
    }
    const m = t.match(/^(\d+)\.?$/);
    if (!m && /^[-−–]\s*\d/.test(t)) return {ok: false, minus: true, m: MINUS};
    return m ? {ok: true, v: parseInt(m[1], 10)} : {ok: false, m: `Nu înțeleg „${t}”. Scrie rezultatul cu cifre.`};
  }

  /* ===================== stilul ===================== */
  function stil() {
    if (document.getElementById('ee-css')) return;
    const st = document.createElement('style');
    st.id = 'ee-css';
    st.textContent = `
.ee{--ee-ok:var(--ok,#1E7A46);--ee-bad:var(--bad,#B8362E)}
.ee-file{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.ee-file button{min-height:40px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:600;cursor:pointer}
.ee-file button.on{border:2px solid var(--accent);background:var(--paper)}
.ee-file button.ok{border-color:var(--ee-ok)}
.ee-file button.no{border-color:var(--ee-bad)}
.ee-card{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:10px 12px}
.ee-lbl{font-weight:700;margin:10px 0 4px}
.ee-lbl2{font-size:.9rem;color:var(--ink2);margin:4px 0}
.ee-alg{margin:4px 0 8px 1.3em;padding:0}
.ee-alg li{margin:2px 0;line-height:1.4}
.ee-cutii{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 8px}
.ee-cutie{display:inline-flex;flex-direction:column;align-items:center;min-width:72px}
.ee-et{padding:1px 8px;border:1px solid var(--line);border-bottom:0;border-radius:6px 6px 0 0;background:var(--paper);font-size:.85rem;font-weight:700}
.ee-cut{min-width:64px;padding:4px 8px;border:2px solid var(--accent);border-radius:4px 4px 8px 8px;background:var(--paper2);font-family:var(--fm,monospace);font-weight:700;font-size:1.15rem;text-align:center}
.ee-randuri{display:flex;flex-direction:column;gap:2px}
.ee-rand{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;padding:6px 8px;border-radius:8px;font-family:var(--fm,monospace);font-size:1.12rem;line-height:1.3}
.ee-rand.vechi{background:var(--paper2);opacity:.95}
.ee-rand.acum{border:2px dashed var(--accent);background:var(--paper)}
.ee-rand .ee-j{padding:2px 1px;overflow-wrap:anywhere}
.ee-rand .ee-j.sub{background:var(--sel);text-decoration:underline;text-decoration-thickness:3px;text-decoration-color:var(--accent);text-underline-offset:5px}
.ee-rand button.ee-j{min-width:44px;min-height:44px;padding:4px 8px;border:2px solid var(--accent);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:700;cursor:pointer}
.ee-rand button.ee-v{min-width:44px}
.ee-rand button.ee-j.ales{background:var(--mark);color:var(--markInk)}
.ee-nota{font-family:var(--fb,inherit);font-size:.88rem;color:var(--ink2);padding:0 8px 4px 22px}
.ee-nota.no{color:var(--ee-bad)}
.ee-gata{font-family:var(--fb,inherit);font-weight:700;padding:4px 8px}
.ee-ed{margin:6px 0;padding:8px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 8px 8px 0}
.ee-ed label,.ee-ed .ee-ed-t{display:block;font-weight:700;margin-bottom:4px}
.ee-ed .ee-r{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.ee-ed input{font:inherit;font-size:16px;min-height:44px;width:7em;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.ee-ed .ee-err{color:var(--ee-bad);font-size:.9rem;margin-top:4px}
.ee-msg{min-height:1.4em;margin:6px 0;padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);line-height:1.4}
.ee-bara{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.ee-bara button,.ee-ed button{min-height:44px}
.ee-teste{margin:0;padding-left:1.2em}
.ee-teste li{margin:2px 0}
.ee-teste li.ok{color:var(--ee-ok)}
.ee-teste li.ok::marker{content:'✓ '}
.ee-teste li.no{color:var(--ee-bad)}
.ee-teste li.no::marker{content:'✗ '}
.ee-static{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:8px 10px;margin:6px 0}
.ee-af{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:8px 10px;margin:0 0 10px}
.ee-af.no{border-color:var(--ee-bad)}
.ee-af.ok{border-color:var(--ee-ok)}
.ee-af-e{font-family:var(--fm,monospace);font-size:1.12rem;font-weight:700;margin:2px 0 6px;overflow-wrap:anywhere}
.ee-af-v{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0}
.ee-af-v button{min-height:44px;min-width:96px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:700;cursor:pointer}
.ee-af-m{display:flex;flex-direction:column;gap:6px;margin:4px 0}
.ee-af-m button{min-height:44px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;text-align:left;line-height:1.35;cursor:pointer}
.ee-af button[aria-pressed="true"]{border:2px solid var(--accent);background:var(--sel)}
`;
    document.head.appendChild(st);
  }
  function cutiiHtml(E) {
    const c = E.cutii || {};
    const n = Object.keys(c); if (!n.length || E.inainte) return '';
    return `<div class="ee-lbl2">Cutiile, acum:</div><div class="ee-cutii">${n.map(k => `<span class="ee-cutie"><span class="ee-et">${esc(k)}</span><span class="ee-cut">${esc(valTxt(c[k]))}</span></span>`).join('')}</div>`;
  }
  const inainteHtml = E => E.inainte ? `<div class="ee-lbl2">Algoritmul a făcut deja acești pași:</div><ol class="ee-alg">${E.inainte.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';
  /* un rând static, cu bucata făcută la pasul următor subliniată */
  function randStatic(tk, i, cls) {
    const sub = i == null ? [] : tk[i].k === 'v' ? [i] : tk[i].k === 'u' ? [i, i + 1] : [i - 1, i, i + 1];
    return `<div class="ee-rand ${cls || 'vechi'}">${tk.map((t, j) => `<span class="ee-j${sub.includes(j) ? ' sub' : ''}">${esc(textJ([t]))}</span>`).join('')}</div>`;
  }
  function urma(E, o) {
    stil(); o = o || {};
    const r = ruleaza(E); let tk = jetoane(E.e);
    let h = '';
    r.pasi.forEach((p, k) => {
      h += randStatic(tk, p.i) + `<div class="ee-nota">pasul ${k + 1}: ${esc(p.sub)} → <b>${esc(valTxt(p.rez))}</b></div>`;
      tk = aplica(tk, p.i, p.rez);
    });
    h += `<div class="ee-gata">Valoarea expresiei: ${esc(valTxt(r.valoare))}</div>`;
    return `<div class="ee ee-static">${o.titlu ? `<div class="ee-lbl2">${o.titlu}</div>` : ''}${inainteHtml(E)}${cutiiHtml(E)}<div class="ee-randuri">${h}</div></div>`;
  }
  const focUrmator = () => setTimeout(() => { const bb = ['inca', 'pas-next', 'go', 'next'].map(i => document.getElementById(i)).find(e => e && e.offsetParent !== null && !e.disabled); if (bb) bb.focus({preventScroll: true}); }, 0);
  /* același #body trece de la un tip la altul („Încă un exercițiu”): ascultătorii vechi ai ORICĂRUI tip de aici pleacă */
  function curata(body) {
    ['_eeClick', '_eeafClick'].forEach(k => { if (body[k]) { body.removeEventListener('click', body[k]); body[k] = null; } });
    if (body._eeKey) { body.removeEventListener('keydown', body._eeKey); body._eeKey = null; }
    body._ee = null; body._eeaf = null;
  }
  const anunta = (tip, bune, total) => { try { window.dispatchEvent(new CustomEvent('evaluare-expresii', {detail: {tip, bune, total, ok: bune === total}})); } catch (e) { /* fără eveniment */ } };

  /* ===================== tipul „expresie-pas” ===================== */
  function testeImplicite(Q) {
    const n = Q.expresii.length, pre = e => n > 1 ? `Expresia ${e + 1}: ` : '';
    return Q.expresii.flatMap((_, e) => [
      {k: 'ordine', e, ce: pre(e) + 'la fiecare pas, ordinea operatorilor e bună'},
      {k: 'calcule', e, ce: pre(e) + 'la fiecare pas, rezultatul scris e bun'},
      {k: 'valoare', e, ce: pre(e) + 'valoarea de la sfârșit e bună'}]);
  }
  function stareNoua(E) { return {tk: jetoane(E.e), pasi: [], ales: null, err: ''}; }
  function testeaza(Q, S, t) {
    const E = Q.expresii[t.e || 0], s = S[t.e || 0], pre = Q.expresii.length > 1 ? `Expresia ${(t.e || 0) + 1}, ` : '';
    const fin = terminat(s.tk);
    if (t.k === 'ordine') {
      const k = s.pasi.findIndex(p => !p.corect);
      if (k >= 0) { const d = deFacut(s.pasi[k].inainte); return {ok: false, m: `${pre}pasul ${k + 1}: ai făcut ${s.pasi[k].sub}, dar ${s.pasi[k].motiv}. Apasă „Înapoi un pas” ${deNori(s.pasi.length - k)}, până la el${d ? `; acolo atingi întâi ${d}` : ''}.`}; }
      return fin ? {ok: true} : {ok: false, m: `${pre}expresia nu e gata: mai ai de făcut operatori (sau cutii).`};
    }
    if (t.k === 'calcule') {
      const k = s.pasi.findIndex(p => p.scris !== p.adev);
      if (k >= 0) {
        const p = s.pasi[k], inap = ` Apasă „Înapoi un pas” ${deNori(s.pasi.length - k)}, până la el, și scrie din nou.`;
        return {ok: false, m: p.cutie ? `${pre}pasul ${k + 1}: în cutia «${p.cutie}» nu e acum ${valTxt(p.scris)}.${E.inainte ? ' Care e ultimul pas care pune ceva în ea?' : ''}${inap}` : `${pre}pasul ${k + 1}: ${p.sub} nu dă ${valTxt(p.scris)}.${inap}`};
      }
      return fin ? {ok: true} : {ok: false, m: `${pre}expresia nu e gata: mai ai de făcut operatori (sau cutii).`};
    }
    if (t.k === 'valoare') {
      if (!fin) return {ok: false, m: `${pre}expresia nu e gata: mai ai de făcut operatori (sau cutii).`};
      return s.tk[0].v === valoare(E) ? {ok: true} : {ok: false, m: `${pre}valoarea de la sfârșit nu e bună. Uită-te la testele de mai sus.`};
    }
    return {ok: false, m: 'Test necunoscut.'};
  }
  const PAS = {
    render(Q, body, api) {
      stil();
      if (!Q.teste) Q.teste = testeImplicite(Q);
      curata(body);
      const st = {tab: 0, S: Q.expresii.map(stareNoua), msg: '', verificat: false, gata: false};
      body._ee = {Q, st};
      const proaspat = () => { if (!st.verificat || api.done()) return; const fb = document.getElementById('fb'); if (fb) fb.innerHTML = ''; marcheaza(); };
      const draw = foc => {
        const E = Q.expresii[st.tab], s = st.S[st.tab];
        let rows = '', tk = jetoane(E.e);
        s.pasi.forEach((p, k) => {
          rows += randStatic(tk, p.i) + `<div class="ee-nota">pasul ${k + 1}: ${esc(p.sub)} → <b>${esc(valTxt(p.scris))}</b></div>`;
          tk = p.dupa;
        });
        let cur;
        if (terminat(s.tk)) cur = `<div class="ee-gata">Valoarea expresiei: ${esc(valTxt(s.tk[0].v))}</div>`;
        else cur = `<div class="ee-rand acum">${s.tk.map((t, j) => (t.k === 'o' || t.k === 'u' || t.k === 'v')
          ? `<button type="button" class="ee-j${t.k === 'v' ? ' ee-v' : ''}${s.ales === j ? ' ales' : ''}" data-j="${j}" aria-label="${esc(t.k === 'v' ? 'cutia ' + t.n : 'operatorul ' + t.o)}">${esc(textJ([t]))}</button>`
          : `<span class="ee-j">${esc(textJ([t]))}</span>`).join('')}</div>`;
        let ed = '';
        if (s.ales != null) {
          const t = s.tk[s.ales], sub = subTxt(s.tk, s.ales);
          const bool = t.k === 'u' || (t.k === 'o' && (REL.includes(t.o) || LOG.includes(t.o)));
          ed = bool
            ? `<div class="ee-ed"><span class="ee-ed-t">Ce dă ${esc(sub)}?</span><div class="ee-r"><button type="button" class="btn" data-x="adevarat">adevărat</button><button type="button" class="btn" data-x="fals">fals</button><button type="button" class="btn ghost" data-x="renunta">Renunță</button></div></div>`
            : `<div class="ee-ed"><label for="ee-in">${t.k === 'v' ? `Ce e acum în cutia «${esc(t.n)}»?` : `Cât dă ${esc(sub)}?`}</label><div class="ee-r"><input id="ee-in" type="text" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="ee-err"><button type="button" class="btn" data-x="scrie">Scrie</button><button type="button" class="btn ghost" data-x="renunta">Renunță</button></div><div class="ee-err" id="ee-err" aria-live="polite">${esc(s.err)}</div></div>`;
        }
        const file = Q.expresii.length > 1 ? `<div class="ee-file" role="tablist">${Q.expresii.map((_, k) => {
          const stare = st.verificat ? (Q.teste.filter(t => (t.e || 0) === k).every(t => testeaza(Q, st.S, t).ok) ? ' ok' : ' no') : '';
          return `<button type="button" role="tab" aria-selected="${k === st.tab}" class="${k === st.tab ? 'on' : ''}${stare}" data-tab="${k}">Expresia ${k + 1}</button>`;
        }).join('')}</div>` : '';
        body.innerHTML = `<div class="ee">${file}<div class="ee-card">${inainteHtml(E)}${cutiiHtml(E)}
          <div class="ee-lbl2">${terminat(s.tk) ? 'Gata: expresia a ajuns la o singură valoare.' : 'Atinge în rândul de jos operatorul care se face ACUM' + (s.tk.some(t => t.k === 'v') ? ' (sau o cutie)' : '') + ', apoi scrie ce dă.'}</div>
          <div class="ee-randuri">${rows}${cur}</div>${ed}
          <div class="ee-msg" aria-live="polite">${st.msg || '&nbsp;'}</div>
          <div class="ee-bara"><button type="button" class="btn ghost" data-x="inapoi"${s.pasi.length ? '' : ' disabled'}>Înapoi un pas</button><button type="button" class="btn ghost" data-x="capat">Ia-o de la capăt</button></div></div>
          <div class="ee-lbl">${multe ? `Testele expresiei ${st.tab + 1} (ale celorlalte, pe filele lor)` : 'Testele'}</div><ul class="ee-teste">${Q.teste.map((t, k) => multe && (t.e || 0) !== st.tab ? '' : `<li data-t="${k}">${esc(t.ce || 'Testul ' + (k + 1))}</li>`).join('')}</ul></div>`;
        if (st.verificat) marcheaza();
        if (foc) { const e = body.querySelector(foc); if (e) e.focus({preventScroll: true}); }
      };
      const multe = Q.expresii.length > 1;   // pe telefon: doar testele filei deschise (12 rânduri erau prea multe)
      body._draw = draw;
      const marcheaza = () => {
        let bune = 0; const motive = [];
        Q.teste.forEach((t, k) => {
          const r = testeaza(Q, st.S, t), li = body.querySelector(`li[data-t="${k}"]`);
          if (r.ok) bune++; else motive.push(r.m);
          if (li) li.className = r.ok ? 'ok' : 'no';
        });
        return {bune, motive};
      };
      const scrie = v => {   // v: număr sau true/false
        const E = Q.expresii[st.tab], s = st.S[st.tab], i = s.ales;
        if (i == null) return;
        const t = s.tk[i];
        const adev = adevaratLa(s.tk, i, E);
        const corect = t.k === 'v' ? true : gata(s.tk).has(i);
        const pas = {i, sub: subTxt(s.tk, i), adev, scris: v, corect, motiv: corect ? '' : motiv(s.tk, i), cutie: t.k === 'v' ? t.n : null, inainte: s.tk};
        pas.dupa = aplica(s.tk, i, v);
        s.pasi.push(pas); s.tk = pas.dupa; s.ales = null; s.err = '';
        st.msg = `Pasul ${s.pasi.length}: ${esc(pas.sub)} → <b>${esc(valTxt(v))}</b>. ${terminat(s.tk) ? 'Expresia a ajuns la o singură valoare: apasă „Verifică”.' : 'Rândul nou e dedesubt.'}`;
        draw(terminat(s.tk) ? '[data-x="capat"]' : '.ee-rand.acum button'); proaspat();
      };
      const scrieNr = () => {
        const s = st.S[st.tab], inp = body.querySelector('#ee-in');
        if (!inp || s.ales == null) return;
        const r = citeste(inp.value);
        if (!r.ok && r.minus) {   // J1-B: un minus vine dintr-o greșeală mai sus sau din operatorul ales acum
          const k = primulRau(s), j = s.ales, t = s.tk[j];
          if (k >= 0) r.m = mesajPasRau(s, k);
          else if (t.k !== 'v' && !gata(s.tk).has(j)) { const d = deFacut(s.tk), o = opDe(s.tk, j); r.m = `Operatorul ${LOG.includes(o) || o === 'nu' ? `„${o}”` : o} nu se face acum: ${motiv(s.tk, j)}. Apasă „Renunță”${d ? ` și atinge ${d}` : ''}.`; }
        }
        if (!r.ok) { s.err = r.m; const e = body.querySelector('#ee-err'); if (e) e.textContent = r.m; inp.focus(); return; }
        scrie(r.v);
      };
      body._eeClick = ev => {
        const b = ev.target.closest('button');
        if (!b || !body.contains(b)) return;
        const s = st.S[st.tab];
        if (b.dataset.tab != null) { st.tab = +b.dataset.tab; st.msg = ''; draw(`[data-tab="${st.tab}"]`); return; }
        if (st.gata && b.dataset.x !== 'capat') { st.msg = esc(NOTA_GATA); draw(); return; }
        if (b.dataset.j != null) {
          const j = +b.dataset.j, t = s.tk[j];
          if (s.ales === j) { s.ales = null; s.err = ''; st.msg = ''; draw(`[data-j="${j}"]`); return; }
          if (t.k !== 'v') { const nu = nuSePoate(s.tk, j); if (nu) { s.ales = null; st.msg = esc(refuz(s, j, nu)); draw(`[data-j="${j}"]`); return; } }
          s.ales = j; s.err = ''; st.msg = '';
          draw(t.k === 'u' || (t.k === 'o' && !ARIT.includes(t.o)) ? '[data-x="adevarat"]' : '#ee-in'); return;
        }
        if (b.dataset.x === 'scrie') { scrieNr(); return; }
        if (b.dataset.x === 'adevarat' || b.dataset.x === 'fals') { scrie(b.dataset.x === 'adevarat'); return; }
        if (b.dataset.x === 'renunta') { const j = s.ales; s.ales = null; s.err = ''; draw(j != null ? `[data-j="${j}"]` : null); return; }
        if (b.dataset.x === 'inapoi') {
          if (!s.pasi.length) return;
          const p = s.pasi.pop(); s.tk = p.inainte; s.ales = null; s.err = '';
          st.msg = `Am șters pasul ${s.pasi.length + 1}. Rândul de jos e cel de dinaintea lui.`;
          draw(`[data-j="${p.i}"]`); proaspat(); return;
        }
        if (b.dataset.x === 'capat') {
          const reluare = st.gata; if (reluare) st.verificat = false;
          st.S[st.tab] = stareNoua(Q.expresii[st.tab]); st.gata = false;
          st.msg = 'Expresia e ca la început.' + (reluare ? ' ' + esc(NOTA_DIN_NOU) : '');
          if (reluare) st.S = Q.expresii.map(stareNoua);
          draw('[data-x="capat"]'); proaspat();
        }
      };
      body.addEventListener('click', body._eeClick);
      body._eeKey = ev => {
        if (ev.target && ev.target.id === 'ee-in' && ev.key === 'Enter') { ev.preventDefault(); scrieNr(); return; }
        const s = st.S[st.tab];
        if (ev.key === 'Escape' && s.ales != null) { const j = s.ales; s.ales = null; s.err = ''; draw(`[data-j="${j}"]`); ev.preventDefault(); }
      };
      body.addEventListener('keydown', body._eeKey);
      draw();
      const nav = api.checkButton(() => {
        st.verificat = true;
        Q.expresii.forEach((_, k) => { st.S[k].ales = null; st.S[k].err = ''; });
        draw();
        const {bune, motive} = marcheaza(), total = Q.teste.length;
        anunta('expresie-pas', bune, total);
        if (bune === total) { st.gata = true; nav.innerHTML = ''; api.resolve(true); focUrmator(); }
        else {
          const m0 = motive[0] || '';
          const k0 = Q.teste.findIndex(t => !testeaza(Q, st.S, t).ok);
          if (k0 >= 0 && Q.expresii.length > 1 && (Q.teste[k0].e || 0) !== st.tab) { st.tab = Q.teste[k0].e || 0; draw(); }
          api.resolve(false, `${bune} din ${total} teste trec. ${esc(m0.charAt(0).toUpperCase() + m0.slice(1))}`);
          api.revealButton(() => { PAS.rezolva(Q, body); st.gata = true; nav.innerHTML = ''; api.giveUp('fiecare expresie e acum evaluată pas cu pas, în ordinea bună.'); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) {
      const d = body._ee; if (!d) return;
      d.st.S = d.Q.expresii.map(E => joaca(E, 'bun'));
      d.st.msg = 'Fiecare pas e făcut la timpul lui, cu rezultatul bun.';
      body._draw();
    },
    gresit(Q, body) {
      const d = body._ee; if (!d) return;
      const g = (d.Q.gresit && d.Q.gresit.e) || 0;
      d.st.S = d.Q.expresii.map((E, k) => joaca(E, k === g ? 'stanga' : 'bun'));
      d.st.tab = g;
      body._draw();
    }
  };
  /* joacă o expresie: 'bun' = ordinea bună; 'stanga' = greșeala tipică (primul operator posibil, de la stânga, fără
     prioritate); dacă și așa iese bine, ultimul rezultat scris e greșit (cu 1 mai mare / valoarea opusă) */
  function joaca(E, cum) {
    const s = stareNoua(E); let paza = 0;
    while (!terminat(s.tk) && paza++ < 200) {
      let i = s.tk.findIndex(t => t.k === 'v');
      if (i < 0) {
        if (cum === 'bun') i = Math.min(...gata(s.tk));
        else { i = s.tk.findIndex((t, j) => (t.k === 'o' || t.k === 'u') && !nuSePoate(s.tk, j)); if (i < 0) break; }   // blocat: rămâne neterminată
      }
      const t = s.tk[i], adev = adevaratLa(s.tk, i, E), corect = t.k === 'v' || gata(s.tk).has(i);
      const p = {i, sub: subTxt(s.tk, i), adev, scris: adev, corect, motiv: corect ? '' : motiv(s.tk, i), cutie: t.k === 'v' ? t.n : null, inainte: s.tk};
      p.dupa = aplica(s.tk, i, adev); s.pasi.push(p); s.tk = p.dupa;
    }
    if (cum !== 'bun' && terminat(s.tk) && s.pasi.every(p => p.corect)) {
      const p = s.pasi[s.pasi.length - 1];
      p.scris = typeof p.adev === 'boolean' ? !p.adev : p.adev + 1;
      p.dupa = aplica(p.inainte, p.i, p.scris); s.tk = p.dupa;
    }
    return s;
  }

  /* ===================== tipul „adevarat-fals” ===================== */
  function testeAF(Q) { return Q.afirmatii.map((_, i) => ({k: 'af', i, ce: `Expresia ${i + 1}: valoarea (adevărat sau fals) și motivul`})); }
  function testeazaAF(Q, st, t) {
    const A = Q.afirmatii[t.i], a = st.a[t.i], v = valoare(A), n = `Expresia ${t.i + 1}`;
    if (a.v == null) return {ok: false, m: `${n}: alege adevărat sau fals.`};
    if (a.v !== v) return {ok: false, m: `${n} nu e ${a.v ? 'adevărată' : 'falsă'}. ${A.e.includes('(') ? 'Fă întâi fiecare paranteză, pe rând.' : 'Evaluează-o pas cu pas: cutiile, calculele, apoi comparația.'}`};
    if (a.m == null) return {ok: false, m: `${n}: alege și motivul (de ce).`};
    if (a.m !== A.m) return {ok: false, m: `${n}: valoarea e bună, dar motivul ales nu spune ce se întâmplă în expresia asta. Citește fiecare motiv și caută-l pe cel adevărat.`};
    return {ok: true};
  }
  const AF = {
    render(Q, body, api) {
      stil();
      if (!Q.teste) Q.teste = testeAF(Q);
      Q.afirmatii.forEach(A => valoare(A));   // verifică expresiile la încărcare
      curata(body);
      const st = {a: Q.afirmatii.map(() => ({v: null, m: null})), verificat: false, gata: false, msg: ''};
      body._eeaf = {Q, st};
      const proaspat = () => { if (!st.verificat || api.done()) return; const fb = document.getElementById('fb'); if (fb) fb.innerHTML = ''; marcheaza(); };
      const draw = foc => {
        body.innerHTML = `<div class="ee">${Q.afirmatii.map((A, i) => {
          const a = st.a[i], r = st.verificat ? (testeazaAF(Q, st, {i}).ok ? ' ok' : ' no') : '';
          return `<div class="ee-af${r}" data-i="${i}"><div class="ee-lbl2">Expresia ${i + 1}</div>${inainteHtml(A)}${cutiiHtml(A)}<div class="ee-af-e">${esc(text(A))}</div>
            <div class="ee-af-v" role="group" aria-label="Valoarea expresiei ${i + 1}"><button type="button" data-i="${i}" data-v="1" aria-pressed="${a.v === true}">adevărat</button><button type="button" data-i="${i}" data-v="0" aria-pressed="${a.v === false}">fals</button></div>
            <div class="ee-lbl2">De ce?</div><div class="ee-af-m" role="group" aria-label="Motivul, la expresia ${i + 1}">${A.motive.map((m, k) => `<button type="button" data-i="${i}" data-m="${k}" aria-pressed="${a.m === k}">${esc(m)}</button>`).join('')}</div></div>`;
        }).join('')}<div class="ee-msg" aria-live="polite">${st.msg || '&nbsp;'}</div>
          <div class="ee-bara"><button type="button" class="btn ghost" data-x="capat">Ia-o de la capăt</button></div>
          <div class="ee-lbl">Testele</div><ul class="ee-teste">${Q.teste.map((t, k) => `<li data-t="${k}">${esc(t.ce || 'Testul ' + (k + 1))}</li>`).join('')}</ul></div>`;
        if (st.verificat) marcheaza();
        if (foc) { const e = body.querySelector(foc); if (e) e.focus({preventScroll: true}); }
      };
      body._draw = draw;
      const marcheaza = () => {
        let bune = 0; const motive = [];
        Q.teste.forEach((t, k) => {
          const r = testeazaAF(Q, st, t), li = body.querySelector(`li[data-t="${k}"]`);
          if (r.ok) bune++; else motive.push(r.m);
          if (li) li.className = r.ok ? 'ok' : 'no';
        });
        return {bune, motive};
      };
      body._eeafClick = ev => {
        const b = ev.target.closest('button');
        if (!b || !body.contains(b)) return;
        if (st.gata && b.dataset.x !== 'capat') { st.msg = esc(NOTA_GATA); draw(); return; }
        if (b.dataset.v != null) { const i = +b.dataset.i; st.a[i].v = b.dataset.v === '1'; st.msg = ''; draw(`[data-i="${i}"][data-v="${b.dataset.v}"]`); proaspat(); return; }
        if (b.dataset.m != null) { const i = +b.dataset.i; st.a[i].m = +b.dataset.m; st.msg = ''; draw(`[data-i="${i}"][data-m="${b.dataset.m}"]`); proaspat(); return; }
        if (b.dataset.x === 'capat') {
          const reluare = st.gata; if (reluare) st.verificat = false;
          st.a = Q.afirmatii.map(() => ({v: null, m: null})); st.gata = false;
          st.msg = 'Totul e ca la început.' + (reluare ? ' ' + esc(NOTA_DIN_NOU) : '');
          draw('[data-x="capat"]'); proaspat();
        }
      };
      body.addEventListener('click', body._eeafClick);
      draw();
      const nav = api.checkButton(() => {
        st.verificat = true; draw();
        const {bune, motive} = marcheaza(), total = Q.teste.length;
        anunta('adevarat-fals', bune, total);
        if (bune === total) { st.gata = true; nav.innerHTML = ''; api.resolve(true); focUrmator(); }
        else {
          const m0 = motive[0] || '';
          api.resolve(false, `${bune} din ${total} teste trec. ${esc(m0)}`);
          api.revealButton(() => { AF.rezolva(Q, body); st.gata = true; nav.innerHTML = ''; api.giveUp('valorile și motivele bune sunt alese acum.'); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) {
      const d = body._eeaf; if (!d) return;
      d.st.a = d.Q.afirmatii.map(A => ({v: valoare(A), m: A.m}));
      body._draw();
    },
    gresit(Q, body) {
      const d = body._eeaf; if (!d) return;
      const g = typeof d.Q.gresit === 'number' ? d.Q.gresit : 0;
      d.st.a = d.Q.afirmatii.map((A, k) => ({v: k === g ? !valoare(A) : valoare(A), m: A.m}));
      body._draw();
    }
  };

  window.EvaluareExpresii = {
    versiune: VERSIUNE, jetoane, text, ruleaza, valoare, urma, cutiiHtml,
    tipuri: {'expresie-pas': PAS, 'adevarat-fals': AF},
    _intern: {parse, gata, motiv, nuSePoate, aplica, joaca, testeaza, testeazaAF, citeste, refuz, deFacut, mesajPasRau}
  };
})();
