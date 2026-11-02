/* lectii/_sim/urmarire-decizie.js — „Urmăresc algoritmul pas cu pas”: tabelul de urmărire al unui algoritm cu DECIZIE
   (Dacă … atunci … altfel …), completat rând cu rând de elev, pe unul sau mai multe seturi de date de intrare, plus
   compararea traseelor. Pentru o lecție FĂRĂ profesor (ora simultană), cu degetul pe telefon (390 px) sau cu mouse-ul.

   PROPRIETAR: lecția V/29 (lectii/v/m4-l29, „Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”),
   02.11.2026. Granița: _campaign/revizuire_completa_2026_09/m4_seara_02_11/granite/v_l29.md. Lecțiile următoare îl pot
   încărca întreg, NEMODIFICAT; ce le lipsește fac într-un fișier NOU (`lectii/_sim/urmarire-decizie-<ceva>.js`).

   DEPENDENȚE (încărcate ÎNAINTE, nemodificate): `evaluare-expresii.js` (V/27) — condițiile și calculele se evaluează cu
   `EvaluareExpresii.valoare`, deci semnele și ordinea operațiilor înseamnă exact ce a predat V/27; `cutii-variabile.js`
   (V/26) — numerele scrise de elev se citesc cu `CutiiVariabile.numar` (fără el: doar cifre).

   NOTAȚIA (forma pașilor din granița V/28 + decizia din manualele de clasa a V-a; vezi lectii/v/m4-l29/surse.md):
       Pasul 1. Citește «vârsta».
       Pasul 2. Dacă «vârsta» < 14 atunci
       Pasul 3.     Calculează «bani» − 5 și pune rezultatul în cutia «rest».
                altfel
       Pasul 4.     Pune 0 în cutia «rest».
       Pasul 5. Afișează «rest».
   Fiecare rând cu număr e un pas; pașii unei ramuri stau MAI LA DREAPTA; „altfel” stă singur pe rând, fără număr.
   Fără „Sfârșit dacă” (sfârșitul deciziei = primul pas de pe marginea din stânga). Fiecare decizie are AMBELE ramuri.

   FIDELITATE (nu simulează o aplicație; e fișa cu tabelul de urmărire, ca pe hârtie):
     - Tabelul: un rând pe pas FĂCUT, în ordinea în care se face; coloanele: Pasul | câte una pe cutie | Condiția |
       Se afișează. În celulele cutiilor stă ce e în fiecare cutie DUPĂ pasul acela (cutia goală: „–” în tabelele gata
       făcute, căsuță goală în exerciții — ca la V/28); valorile
       neschimbate se duc singure mai departe (gri), elevul scrie doar ce pune pasul. La rândul deciziei, Condiția =
       adevărat / fals (valoarea de ACUM a condiției). Se afișează = doar la pașii „Afișează”.
     - Elevul alege numărul pasului care se face (orice număr, ca pe hârtie), apoi răspunde la întrebarea rândului:
       valoarea pusă în cutie, adevărat / fals, ce se afișează. Greșelile merg mai departe (rândurile următoare se
       socotesc cu ce a scris EL); „Înapoi un rând” șterge ultimul rând, „Ia-o de la capăt” golește tabelul.
     - Testele (regula 29: judecă tabelul, nu drumul gesturilor; formularea nu contează): pe fiecare set, `valori` (ce
       intră în cutii), `conditie` (adevărat / fals la fiecare decizie), `traseu` (pașii, în ordinea în care se fac —
       ordinea e chiar ce se predă), `afis` (ce se afișează); plus `compara` (alegerea de la „Compară traseele”).
       Mesajul principal numește PRIMUL rând greșit, de ce, și de câte ori apeși „Înapoi un rând” (regula 28).
     - Răspunsurile scrise, primite în toate formele corecte (regula 23): numerele ca la V/26 („15”, „15 lei”,
       „cincisprezece”, „20 − 5 = 15”); textul afișat fără diacritice, fără ghilimele, cu litere mari sau mici, cu
       „Afișează” în față sau fără, cu punct sau fără. Numele cutiei în loc de valoare („rest”) e respins, cu mesaj.
     - Nimic nu se salvează și nimic nu pleacă: 0 scrieri în localStorage / sessionStorage / cookie, 0 cereri.

   API PUBLIC (window.UrmarireDecizie):
     versiune
     numeroteaza(A)               -> lista pașilor, în ordinea scrierii: [{n, P, nivel, ramura:null|{d, cine:'atunci'|'altfel'}}]
     textPas(P)                   -> textul pasului („Citește «vârsta».”, „Dacă «vârsta» < 14 atunci”)
     ruleaza(A, intrari)          -> {randuri:[{n, P, cutii:{…după pas}, cond:true|false|null, afis:null|text|număr,
                                      scrie:null|nume}], traseu:[n…], afisari:[…]}
     algoritmHtml(A, {titlu?})    -> HTML static: algoritmul, cu numerele pașilor și ramurile mai la dreapta
     tabelHtml(A, intrari, {titlu?, explica?:[text pe rând]}) -> HTML static: tabelul COMPLETAT (pentru „Uite cum”)
     traseuText(A, intrari)       -> „1, 2, 4, 5”
     tipuri['tabel-urmarire']     {render, rezolva, gresit} pentru JocMotor
   ALGORITMUL A: {cutii:['vârsta','bani','rest'], pasi:[P…]}; P este unul dintre:
     {citeste:'vârsta'} · {pune:5, in:'preț'} · {calc:'«bani» − 5', in:'rest'} · {afis:'rest'} (valoarea din cutie) ·
     {afisText:'Nivel trecut'} · {daca:'«vârsta» < 14', atunci:[P…], altfel:[P…]} (condiția: o expresie V/27).
   TIPUL „tabel-urmarire”:
     {t:'tabel-urmarire', q, alg:A, seturi:[{intrari:{vârsta:11, bani:20}, nume?}], compara?:{q, o:[…], ok},
      teste?:[{k:'valori'|'conditie'|'traseu'|'afis', s:indice} | {k:'compara'}] (implicit: toate, pe fiecare set),
      gresit?:{s:indice, cum?:'ambele'|'opus'} (greșeala tipică pentru poartă: implicit „ambele” = face și pașii
      ramurii nealese, ca la o secvență), ajutor, why}
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('urmarire-decizie', {detail:{bune, total, ok}}).

   1.1 (02.11.2026, reparațiile după judecata 1; API-ul NESCHIMBAT, doar adăugiri compatibile):
     - „Compară traseele”: variantele se arată în ordine AMESTECATĂ, o dată la fiecare desenare a exercițiului (ca la
       întrebările motorului); `data-k` rămâne indicele din `compara.o`, iar `compara.ok` rămâne indicele variantei bune.
       Opțional `compara.amesteca:false` = ordinea scrisă (adăugire).
     - În tabelul de completat (exercițiile), cutia încă goală are căsuța GOALĂ, ca la V/28; „–” rămâne doar în tabelele
       gata făcute (`tabelHtml`). Valorile duse singure mai departe: gri mai deschis + ÎNCLINAT (contrast ≥ 4,5:1 pe fond,
       în ambele teme), ca să se deosebească de ce scrie elevul (îngroșat, negru).
     - Telefon (≤ 420 px): textul tabelelor .8rem (era .74rem); ca tabelul de 6 coloane să încapă la 390 px, celulele
       n-au spațiu lateral, iar tabelul din exercițiu folosește toată lățimea casetei (măsurat: _proba/r1_s8_variante.txt).

   1.1, T2 (02.11.2026, după judecata 2; doar TEXTE, API și teste neschimbate): datele de intrare se scriu ca la V/28,
     „Se dau (datele de intrare): 40 pentru «puncte».” (era „Datele de intrare: «puncte» = 40.”: „=” rămâne doar în
     condiții, unde înseamnă „sunt egale?”, ca la V/27); mesajul de la „Citește” trimite la „Se dau”.

   CE NU SE SCHIMBĂ (lecțiile următoare se sprijină pe ele): numele tipului și ale testelor (k), forma lui A și a lui P,
   coloanele tabelului, clasele CSS cu prefixul `ud-`, id-ul stilului `ud-css`, „nimic nu se salvează, nimic nu pleacă”.
*/
(function () {
  'use strict';
  const VERSIUNE = '1.1 (02.11.2026)';
  const amesteca = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const MAX_RANDURI = 14;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const NOTA_GATA = 'Exercițiul e încheiat, de aceea nu se mai schimbă nimic. Ca să-l faci din nou, apasă „Ia-o de la capăt”.';
  const NOTA_DIN_NOU = 'O încercare nouă, doar ca să exersezi: exercițiul e deja încheiat. Testele se bifează iar la „Verifică”.';
  const deNori = k => k === 1 ? 'o dată' : k === 2 ? 'de două ori' : `de ${k} ori`;
  const valTxt = v => v === true ? 'adevărat' : v === false ? 'fals' : v == null ? '–' : String(v);

  /* ===================== algoritmul ===================== */
  function numeroteaza(A) {
    const out = [];
    const umbla = (lista, nivel, ramura) => lista.forEach(P => {
      const r = {n: out.length + 1, P, nivel, ramura};
      out.push(r);
      if (P.daca != null) {
        umbla(P.atunci || [], nivel + 1, {d: r.n, cine: 'atunci'});
        umbla(P.altfel || [], nivel + 1, {d: r.n, cine: 'altfel'});
      }
    });
    umbla(A.pasi, 0, null);
    return out;
  }
  function textPas(P) {
    if (P.citeste != null) return `Citește «${P.citeste}».`;
    if (P.pune != null) return `Pune ${P.pune} în cutia «${P.in}».`;
    if (P.calc != null) return `Calculează ${P.calc} și pune rezultatul în cutia «${P.in}».`;
    if (P.afis != null) return `Afișează «${P.afis}».`;
    if (P.afisText != null) return `Afișează „${P.afisText}”.`;
    if (P.daca != null) return `Dacă ${P.daca} atunci`;
    return '?';
  }
  const scrieIn = P => P.citeste != null ? P.citeste : (P.pune != null || P.calc != null) ? P.in : null;
  function evalueaza(e, cutii) {
    if (!window.EvaluareExpresii) throw new Error('urmarire-decizie.js: lipsește evaluare-expresii.js (V/27), încărcat înainte');
    return window.EvaluareExpresii.valoare({e, cutii});
  }
  /* execuția corectă: pașii de pe marginea stângă unul după altul; la decizie, doar ramura aleasă */
  function ruleaza(A, intrari) {
    const nr = numeroteaza(A), dupaP = new Map(nr.map(r => [r.P, r.n]));
    const cutii = {}; (A.cutii || []).forEach(c => { cutii[c] = null; });
    const randuri = [], afisari = [];
    const pas = P => {
      const n = dupaP.get(P), rand = {n, P, cond: null, afis: null, scrie: scrieIn(P)};
      if (P.citeste != null) {
        if (!(P.citeste in intrari)) throw new Error(`urmarire-decizie.js: setul nu are valoare pentru «${P.citeste}»`);
        cutii[P.citeste] = intrari[P.citeste];
      } else if (P.pune != null) cutii[P.in] = P.pune;
      else if (P.calc != null) cutii[P.in] = evalueaza(P.calc, cutii);
      else if (P.afis != null) { rand.afis = cutii[P.afis]; afisari.push(rand.afis); }
      else if (P.afisText != null) { rand.afis = P.afisText; afisari.push(rand.afis); }
      else if (P.daca != null) rand.cond = !!evalueaza(P.daca, cutii);
      rand.cutii = Object.assign({}, cutii);
      randuri.push(rand);
      if (P.daca != null) (rand.cond ? (P.atunci || []) : (P.altfel || [])).forEach(pas);
    };
    A.pasi.forEach(pas);
    return {randuri, traseu: randuri.map(r => r.n), afisari};
  }
  const traseuText = (A, intrari) => ruleaza(A, intrari).traseu.join(', ');

  /* ===================== HTML static ===================== */
  function algoritmHtml(A, o) {
    o = o || {};
    const nr = numeroteaza(A);
    let h = '';
    const rand = (eticheta, text, nivel, cls) => `<div class="ud-l${cls ? ' ' + cls : ''}"><span class="ud-n">${eticheta}</span><span class="ud-t" style="padding-left:${nivel * 1.6}em">${text}</span></div>`;
    nr.forEach(r => {
      if (r.ramura && r.ramura.cine === 'altfel') {
        const prim = nr.find(x => x.ramura && x.ramura.d === r.ramura.d && x.ramura.cine === 'altfel');
        if (prim === r) h += rand('', 'altfel', r.nivel - 1, 'ud-altfel');
      }
      h += rand(`Pasul ${r.n}.`, esc(textPas(r.P)), r.nivel, r.P.daca != null ? 'ud-daca' : '');
    });
    return `<div class="ud ud-static">${o.titlu ? `<div class="ud-lbl2">${o.titlu}</div>` : ''}<div class="ud-alg" role="list">${h}</div></div>`;
  }
  function antet(A) {
    return `<tr><th scope="col">Pasul</th>${(A.cutii || []).map(c => `<th scope="col">«${esc(c)}»</th>`).join('')}<th scope="col">Condiția</th><th scope="col">Se afișează</th></tr>`;
  }
  const hint = A => (A.cutii || []).length >= 3 ? '<div class="ud-hint">Pe un ecran îngust, trage tabelul spre stânga ca să vezi toate coloanele.</div>' : '';
  function intrariHtml(A, intrari) {
    const k = Object.keys(intrari);
    const v = k.map(c => `${esc(intrari[c])} pentru «${esc(c)}»`);
    return `<div class="ud-date"><b>Se dau</b> (datele de intrare): ${v.length > 1 ? v.slice(0, -1).join(', ') + ' și ' + v[v.length - 1] : v.join('')}.</div>`;
  }
  function tabelHtml(A, intrari, o) {
    o = o || {};
    const r = ruleaza(A, intrari);
    const rows = r.randuri.map((x, i) => {
      const cel = (A.cutii || []).map(c => {
        const nou = x.scrie === c, v = x.cutii[c];
        return `<td class="${nou ? 'ud-nou' : 'ud-dus'}">${esc(valTxt(v))}</td>`;
      }).join('');
      const ex = o.explica && o.explica[i] ? `<tr class="ud-ex"><td colspan="${(A.cutii || []).length + 3}">${o.explica[i]}</td></tr>` : '';
      return `<tr><th scope="row">${x.n}</th>${cel}<td class="ud-c">${x.cond == null ? '' : valTxt(x.cond)}</td><td class="ud-a">${x.afis == null ? '' : esc(x.afis)}</td></tr>${ex}`;
    }).join('');
    return `<div class="ud ud-static">${o.titlu ? `<div class="ud-lbl2">${o.titlu}</div>` : ''}${intrariHtml(A, intrari)}${hint(A)}<div class="ud-tw"><table class="ud-tab"><thead>${antet(A)}</thead><tbody>${rows}</tbody></table></div>${o.traseu === false ? '' : `<div class="ud-lbl2">Traseul (pașii făcuți, în ordine): ${r.traseu.join(', ')}.</div>`}</div>`;
  }

  /* ===================== citirea răspunsurilor scrise ===================== */
  const fara = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ş/g, 's').replace(/ţ/g, 't');
  function citesteNr(s) {
    const t = String(s == null ? '' : s).trim();
    if (!t) return {ok: false, m: 'Scrie întâi numărul.'};
    if (window.CutiiVariabile && typeof window.CutiiVariabile.numar === 'function') {
      const r = window.CutiiVariabile.numar(t);
      if (r.ok) return {ok: true, v: r.v};
      return {ok: false, m: r.motiv === 'multe' ? 'Scrie un singur număr: ce e acum în cutie.' : r.motiv === 'zecimal' ? 'Numerele din lecție sunt fără virgulă: scrie numărul doar cu cifre.' : r.motiv === 'minus' ? 'Numerele din lecție sunt fără semnul minus în față.' : `Nu înțeleg „${t}”. Scrie numărul cu cifre.`};
    }
    const m = t.match(/^(\d+)\.?$/);
    return m ? {ok: true, v: parseInt(m[1], 10)} : {ok: false, m: `Nu înțeleg „${t}”. Scrie numărul cu cifre.`};
  }
  const curatText = s => fara(s).replace(/[„”"“'«»‚’`.!?,;:()]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(se )?afiseaza /, '').trim();

  /* ===================== stilul ===================== */
  function stil() {
    if (document.getElementById('ud-css')) return;
    const st = document.createElement('style');
    st.id = 'ud-css';
    st.textContent = `
.ud{--ud-ok:var(--ok,#1E7A46);--ud-bad:var(--bad,#B8362E);--ud-dus:#636D5D}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .ud{--ud-dus:#8F9C89}}
:root[data-theme="dark"] .ud{--ud-dus:#8F9C89}
.ud-alg{font-family:var(--fm,Consolas,monospace);font-size:.86rem;line-height:1.45;background:var(--paper2);border:1px solid var(--line);border-radius:8px;padding:6px 8px;margin:4px 0 8px;overflow-x:auto}
.ud-l{display:flex;gap:.5em;align-items:baseline}
.ud-n{flex:0 0 4.6em;color:var(--ink2);white-space:nowrap}
.ud-t{flex:1 1 auto;min-width:0}
.ud-daca .ud-t{font-weight:700}
.ud-altfel .ud-t{font-weight:700}
.ud-lbl{font-weight:700;margin:10px 0 4px}
.ud-lbl2{font-size:.9rem;color:var(--ink2);margin:4px 0}
.ud-date{margin:4px 0 6px}
.ud-tw{overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch;margin:4px 0}
.ud-tab{border-collapse:collapse;font-size:.86rem;min-width:100%}
.ud-tab th,.ud-tab td{border:1px solid var(--line);padding:4px 5px;text-align:center;vertical-align:middle}
.ud-tab thead th{background:var(--paper2);font-weight:700;font-size:.8rem}
.ud-tab tbody th{background:var(--paper2);position:sticky;left:0}
.ud-tab td.ud-dus{color:var(--ud-dus);font-style:italic;font-weight:400}
.ud-tab td.ud-nou{font-weight:700}
.ud-tab td.ud-c{font-weight:700}
.ud-tab tr.ud-ex td{text-align:left;font-size:.84rem;color:var(--ink2);background:var(--paper)}
.ud-tab tr.ud-act th,.ud-tab tr.ud-act td{outline:2px solid var(--accent);outline-offset:-2px}
.ud-tab td.ud-gol{color:var(--ink2);font-style:italic}
.ud-file{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 8px}
.ud-file button{min-height:40px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:600;cursor:pointer}
.ud-file button.on{border:2px solid var(--accent);background:var(--paper)}
.ud-file button.ok{border-color:var(--ud-ok)}
.ud-file button.no{border-color:var(--ud-bad)}
.ud-card{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:10px 12px}
.ud-ed{border:1px dashed var(--accent);border-radius:8px;padding:8px 10px;margin:8px 0;background:var(--paper2)}
.ud-ed label,.ud-ed .ud-intr{display:block;font-weight:600;margin-bottom:6px}
.ud-r{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.ud-r input{flex:1 1 9em;min-width:0;min-height:40px;font-size:16px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink)}
.ud .btn{min-height:40px}
.ud-pasi{display:flex;flex-wrap:wrap;gap:6px}
.ud-pasi button{min-width:44px;min-height:44px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-weight:700;cursor:pointer}
.ud-pasi button:focus-visible,.ud-file button:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
.ud-af{display:flex;gap:8px;flex-wrap:wrap}
.ud-af button{min-height:44px;min-width:96px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-weight:700;cursor:pointer}
.ud-err{color:var(--ud-bad);min-height:1.2em;font-size:.9rem;margin-top:4px}
.ud-unelte{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.ud-msg{min-height:1.3em;margin:6px 0;font-size:.95rem}
.ud-cmp{margin:10px 0 4px}
.ud-cmp .ud-q{font-weight:600;margin-bottom:6px}
.ud-opt{display:block;width:100%;text-align:left;min-height:44px;margin:5px 0;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;cursor:pointer}
.ud-opt.on{border:2px solid var(--accent);background:var(--sel,var(--paper2))}
.ud-teste{margin:0;padding-left:1.2em}
.ud-teste li{margin:2px 0}
.ud-teste li.ok{color:var(--ud-ok)}
.ud-teste li.ok::marker{content:'✓ '}
.ud-teste li.no{color:var(--ud-bad)}
.ud-teste li.no::marker{content:'✗ '}
.ud-hint{display:none;font-size:.8rem;color:var(--ink2);margin:2px 0}
@media (max-width:380px){.ud-hint{display:block}}
@media (max-width:420px){.ud-card{padding:8px 5px}.ud-card .ud-tw{margin:4px -5px;max-width:none}.ud-tab{font-size:.8rem;min-width:0}.ud-tab th,.ud-tab td{padding:3px 0}.ud-tab thead th{font-size:.8rem;white-space:normal}.ud-alg{font-size:.78rem}.ud-n{flex-basis:4.1em}}
`;
    document.head.appendChild(st);
  }

  /* ===================== comparația cu tabelul corect ===================== */
  /* S = rândurile elevului: [{n, val, cond, afis, gata}] ; T = ruleaza(...).randuri */
  function analiza(A, T, S) {
    const nr = numeroteaza(A), info = n => nr.find(r => r.n === n);
    const err = [];   // {i, k:'valori'|'conditie'|'traseu'|'afis', m}
    const inapoi = i => `Apasă „Înapoi un rând” ${deNori(S.length - i)}, până dispare rândul ${i + 1}`;
    const L = Math.max(S.length, T.length);
    for (let i = 0; i < L; i++) {
      const s = S[i], t = T[i];
      if (!s) {
        const ult = S.length ? `după pasul ${S[S.length - 1].n} algoritmul mai are pași de făcut` : 'algoritmul începe cu un pas, iar tabelul e gol';
        err.push({i, k: 'traseu', m: `tabelul nu e gata: ${ult}. Atinge numărul pasului care urmează.`, lipsa: true});
        break;
      }
      if (!s.gata) { err.push({i, k: 'traseu', m: `rândul ${i + 1} nu e completat: răspunde la întrebarea de sub tabel.`, lipsa: true}); break; }
      if (!t) {
        err.push({i, k: 'traseu', m: `rândul ${i + 1} e în plus: algoritmul se termină după pasul ${T[T.length - 1].n}, ultimul pas care se face. ${inapoi(i)}.`});
        break;
      }
      if (s.n !== t.n) {
        let de;
        const p = T[i - 1], ps = info(s.n);
        if (i === 0) de = 'algoritmul începe cu pasul 1';
        else if (p && p.P.daca != null) {
          const cine = p.cond ? 'atunci' : 'altfel';
          de = ps && ps.ramura && ps.ramura.d === p.n && ps.ramura.cine !== cine
            ? `el e pe ramura „${ps.ramura.cine}”, iar condiția din rândul ${i} e ${p.cond ? 'adevărată' : 'falsă'}, deci se face ramura „${cine}”`
            : `după decizie (rândul ${i}), condiția fiind ${p.cond ? 'adevărată' : 'falsă'}, urmează primul pas al ramurii „${cine}”`;
        } else if (ps && ps.ramura && T.slice(0, i).every(x => x.n !== ps.ramura.d)) {
          de = `el e pe o ramură, iar decizia ei încă nu s-a făcut`;
        } else if (ps && ps.ramura && T.slice(0, i).some(x => x.n === ps.ramura.d) && (() => { const d = T.find(x => x.n === ps.ramura.d); return (d.cond ? 'atunci' : 'altfel') !== ps.ramura.cine; })()) {
          const d = T.find(x => x.n === ps.ramura.d);
          de = `el e pe ramura „${ps.ramura.cine}”, iar condiția pasului ${d.n} a fost ${d.cond ? 'adevărată' : 'falsă'}: ramura „${ps.ramura.cine}” se sare`;
        } else {
          const pi = p ? info(p.n) : null, ti = info(t.n);
          const aceeasi = pi && pi.ramura && ti && ti.ramura && ti.ramura.d === pi.ramura.d && ti.ramura.cine === pi.ramura.cine;
          de = pi && pi.ramura && !aceeasi ? `după ultimul pas al ramurii, algoritmul sare peste cealaltă ramură și merge la pasul de sub decizie, de pe marginea din stânga`
            : `pașii se fac unul după altul: după pasul ${p ? p.n : '?'} vine pasul scris sub el`;
        }
        err.push({i, k: 'traseu', m: `rândul ${i + 1} are pasul ${s.n}, dar ${de}. ${inapoi(i)}, apoi atinge alt pas.`});
        break;
      }
      const P = t.P, cine = `rândul ${i + 1} (pasul ${t.n})`;
      if (t.scrie != null && s.val !== t.cutii[t.scrie]) {
        const m = P.citeste != null ? `${cine}: „Citește «${P.citeste}»” pune în cutie valoarea dată pentru «${P.citeste}» (la „Se dau”)`
          : P.pune != null ? `${cine}: pasul pune în cutia «${P.in}» numărul scris în el`
            : `${cine}: ${P.calc}, cu valorile de acum din cutii, nu dă ${valTxt(s.val)}`;
        err.push({i, k: 'valori', m: `${m}. ${inapoi(i)}, apoi alege din nou pasul ${t.n} și scrie din nou.`});
      }
      if (P.daca != null && s.cond !== t.cond) {
        err.push({i, k: 'conditie', m: `${cine}: condiția ${P.daca}, cu valorile de acum din cutii, nu e ${s.cond ? 'adevărată' : 'falsă'}. ${inapoi(i)}, apoi alege din nou pasul ${t.n}.`});
      }
      if (t.afis != null) {
        const bun = typeof t.afis === 'number' ? s.afis === t.afis : curatText(s.afis) === curatText(t.afis);
        if (!bun) {
          const numeCutie = P.afis != null && typeof s.afis === 'string' && curatText(s.afis) === curatText(P.afis);
          const m = numeCutie ? `${cine}: „Afișează «${P.afis}»” arată ce e ÎN cutie, nu numele ei`
            : P.afis != null ? `${cine}: „Afișează «${P.afis}»” arată ce e acum în cutia «${P.afis}»`
              : `${cine}: „Afișează „${P.afisText}”” arată exact textul dintre ghilimele`;
          err.push({i, k: 'afis', m: `${m}. ${inapoi(i)}, apoi alege din nou pasul ${t.n} și scrie din nou.`});
        }
      }
      if (err.length) break;
    }
    return err;
  }
  /* un test e bun dacă tabelul elevului are, pe locul lor, toate rândurile de felul lui, la fel ca tabelul bun */
  function testSet(k, T, S, err) {
    if (k === 'traseu') return S.length === T.length && S.every((s, i) => s.gata && s.n === T[i].n);
    const are = t => k === 'valori' ? t.scrie != null : k === 'conditie' ? t.P.daca != null : t.afis != null;
    return T.every((t, i) => {
      if (!are(t)) return true;
      const s = S[i];
      if (!s || !s.gata || s.n !== t.n) return false;
      if (k === 'valori') return s.val === t.cutii[t.scrie];
      if (k === 'conditie') return s.cond === t.cond;
      return typeof t.afis === 'number' ? s.afis === t.afis : curatText(s.afis) === curatText(t.afis);
    });
  }

  /* ===================== tipul „tabel-urmarire” ===================== */
  const NUME_T = {valori: 'ce intră în cutii', conditie: 'condiția (adevărat sau fals)', traseu: 'pașii, în ordinea în care se fac', afis: 'ce se afișează'};
  function testeImplicite(Q) {
    const n = Q.seturi.length, pre = s => n > 1 ? `Setul ${s + 1}: ` : '';
    const t = Q.seturi.flatMap((_, s) => ['valori', 'conditie', 'traseu', 'afis'].map(k => ({k, s, ce: pre(s) + NUME_T[k]})));
    if (Q.compara) t.push({k: 'compara', ce: 'Compararea traseelor'});
    return t;
  }
  function curata(body) {
    if (body._udClick) { body.removeEventListener('click', body._udClick); body._udClick = null; }
    if (body._udKey) { body.removeEventListener('keydown', body._udKey); body._udKey = null; }
    body._ud = null;
  }
  const anunta = (bune, total) => { try { window.dispatchEvent(new CustomEvent('urmarire-decizie', {detail: {bune, total, ok: bune === total}})); } catch (e) { /* fără eveniment */ } };
  const focUrmator = () => setTimeout(() => { const bb = ['inca', 'pas-next', 'go', 'next'].map(i => document.getElementById(i)).find(e => e && e.offsetParent !== null && !e.disabled); if (bb) bb.focus({preventScroll: true}); }, 0);

  /* valorile din cutii DUPĂ fiecare rând al elevului (greșelile lui merg mai departe) */
  function cutiiElev(A, S) {
    const nr = numeroteaza(A), c = {}; (A.cutii || []).forEach(x => { c[x] = null; });
    return S.map(s => { const r = nr.find(x => x.n === s.n); const w = r ? scrieIn(r.P) : null; if (w != null && s.gata && s.val != null) c[w] = s.val; return {cutii: Object.assign({}, c), scrie: w}; });
  }
  /* completarea „bună” sau greșeala tipică (pentru rezolva / gresit și pentru probe) */
  function joaca(A, intrari, cum) {
    const T = ruleaza(A, intrari).randuri;
    const S = T.map(t => ({n: t.n, val: t.scrie != null ? t.cutii[t.scrie] : null, cond: t.cond, afis: t.afis, gata: true}));
    if (cum === 'ambele' || cum === 'opus') {
      /* „ambele”: după fiecare decizie face și pașii ramurii nealese (ca la o secvență); „opus”: condiția răsturnată */
      const nr = numeroteaza(A), cutii = {}; (A.cutii || []).forEach(c => { cutii[c] = null; });
      const out = [];
      const pas = P => {
        const r = nr.find(x => x.P === P), s = {n: r.n, val: null, cond: null, afis: null, gata: true};
        if (P.citeste != null) { cutii[P.citeste] = intrari[P.citeste]; s.val = cutii[P.citeste]; }
        else if (P.pune != null) { cutii[P.in] = P.pune; s.val = P.pune; }
        else if (P.calc != null) { const v = evalueaza(P.calc, cutii); cutii[P.in] = v; s.val = v; }
        else if (P.afis != null) s.afis = cutii[P.afis];
        else if (P.afisText != null) s.afis = P.afisText;
        else if (P.daca != null) s.cond = !!evalueaza(P.daca, cutii);
        out.push(s);
        if (P.daca != null) {
          if (cum === 'ambele') { (P.atunci || []).forEach(pas); (P.altfel || []).forEach(pas); }
          else { s.cond = !s.cond; (s.cond ? (P.atunci || []) : (P.altfel || [])).forEach(pas); }
        }
      };
      A.pasi.forEach(pas);
      return out;
    }
    return S;
  }

  const TIP = {
    render(Q, body, api) {
      stil();
      if (!Q.teste) Q.teste = testeImplicite(Q);
      curata(body);
      const A = Q.alg;
      const T = Q.seturi.map(s => ruleaza(A, s.intrari).randuri);
      const st = {tab: 0, S: Q.seturi.map(() => []), err: '', msg: '', cmp: null, verificat: false, gata: false};
      body._ud = {Q, st};
      const multe = Q.seturi.length > 1;
      const nr = numeroteaza(A);
      /* B (1.1): ordinea variantelor de la „Compară traseele”, amestecată o dată pe desenare; data-k = indicele din compara.o */
      const ordCmp = Q.compara ? (Q.compara.amesteca === false ? Q.compara.o.map((_, k) => k) : amesteca(Q.compara.o.map((_, k) => k))) : [];
      const proaspat = () => { if (!st.verificat || api.done()) return; const fb = document.getElementById('fb'); if (fb) fb.innerHTML = ''; marcheaza(); };
      const rezultate = () => Q.teste.map(t => {
        if (t.k === 'compara') return {ok: st.cmp === Q.compara.ok, m: st.cmp == null ? 'la „Compară traseele” nu ai ales încă un răspuns.' : 'la „Compară traseele”, uită-te în coloanele Pasul și Condiția ale fiecărui set: pe ce ramură a mers fiecare și de ce?'};
        const s = t.s || 0, e = analiza(A, T[s], st.S[s]);
        const ok = testSet(t.k, T[s], st.S[s], e);
        const pre = multe ? `Setul ${s + 1}, ` : '';
        return {ok, m: e.length ? pre + e[0].m : pre + 'verifică tabelul.'};
      });
      function marcheaza() {
        const r = rezultate();
        body.querySelectorAll('.ud-teste li').forEach(li => { const k = +li.dataset.t; li.classList.toggle('ok', r[k].ok); li.classList.toggle('no', !r[k].ok); });
        if (multe) body.querySelectorAll('.ud-file button').forEach(b => { const s = +b.dataset.s; const toate = Q.teste.map((t, k) => [t, k]).filter(([t]) => t.k !== 'compara' && (t.s || 0) === s); const ok = toate.every(([, k]) => r[k].ok); b.classList.toggle('ok', ok); b.classList.toggle('no', !ok); });
        return r;
      }
      const draw = foc => {
        const s = st.tab, S = st.S[s], C = cutiiElev(A, S);
        const rows = S.map((x, i) => {
          const r = nr.find(y => y.n === x.n), P = r ? r.P : {};
          const cel = (A.cutii || []).map(c => { const v = C[i].cutii[c]; const nou = C[i].scrie === c && x.gata; return `<td class="${nou ? 'ud-nou' : 'ud-dus'}">${v == null ? '' : esc(valTxt(v))}</td>`; }).join('');
          const cond = P.daca != null ? (x.gata ? valTxt(x.cond) : '…') : '';
          const af = (P.afis != null || P.afisText != null) ? (x.gata ? esc(x.afis) : '…') : '';
          return `<tr class="${x.gata ? '' : 'ud-act'}"><th scope="row">${x.n}</th>${cel}<td class="ud-c">${cond}</td><td class="ud-a">${af}</td></tr>`;
        }).join('') || `<tr><td class="ud-gol" colspan="${(A.cutii || []).length + 3}">Tabelul e gol: atinge numărul primului pas.</td></tr>`;
        let ed;
        const ult = S[S.length - 1];
        if (st.gata) ed = `<div class="ud-ed"><span class="ud-intr">${esc(NOTA_GATA)}</span></div>`;
        else if (ult && !ult.gata) {
          const r = nr.find(y => y.n === ult.n), P = r.P, eti = `Pasul ${r.n}: ${esc(textPas(P))}`;
          if (P.daca != null) ed = `<div class="ud-ed"><span class="ud-intr">${eti}<br>Cu valorile de acum din cutii, condiția e adevărată sau falsă?</span><div class="ud-af"><button type="button" data-x="cond" data-v="1">adevărat</button><button type="button" data-x="cond" data-v="0">fals</button></div><div class="ud-err" aria-live="polite">${esc(st.err)}</div></div>`;
          else {
            const w = scrieIn(P), intreb = w != null ? `Ce e acum în cutia «${esc(w)}»?` : 'Ce se afișează?';
            const mod = w != null ? 'numeric' : 'text';
            ed = `<div class="ud-ed"><label for="ud-in">${eti}<br>${intreb}</label><div class="ud-r"><input id="ud-in" type="text" inputmode="${mod === 'numeric' ? 'numeric' : 'text'}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="ud-err"><button type="button" class="btn" data-x="scrie">Scrie</button></div><div class="ud-err" id="ud-err" aria-live="polite">${esc(st.err)}</div></div>`;
          }
        } else {
          ed = `<div class="ud-ed"><span class="ud-intr">${S.length ? `Rândul ${S.length + 1}: ce pas se face acum? Atinge-i numărul.` : 'Rândul 1: ce pas se face primul? Atinge-i numărul.'} Dacă algoritmul s-a terminat, apasă „Verifică”.</span><div class="ud-pasi" role="group" aria-label="Numărul pasului">${nr.map(r => `<button type="button" data-x="pas" data-n="${r.n}" aria-label="Pasul ${r.n}">${r.n}</button>`).join('')}</div><div class="ud-err" aria-live="polite">${esc(st.err)}</div></div>`;
        }
        const cmp = Q.compara ? `<div class="ud-cmp"><div class="ud-lbl">Compară traseele</div><div class="ud-q">${Q.compara.q}</div>${ordCmp.map(k => `<button type="button" class="ud-opt${st.cmp === k ? ' on' : ''}" data-x="cmp" data-k="${k}" aria-pressed="${st.cmp === k}">${Q.compara.o[k]}</button>`).join('')}</div>` : '';
        body.innerHTML = `<div class="ud"><div class="ud-card">
          ${algoritmHtml(A, {titlu: 'Algoritmul:'})}
          ${multe ? `<div class="ud-file" role="tablist">${Q.seturi.map((x, k) => `<button type="button" role="tab" data-x="tab" data-s="${k}" class="${k === s ? 'on' : ''}" aria-selected="${k === s}">${esc(x.nume || 'Setul ' + (k + 1))}</button>`).join('')}</div>` : ''}
          ${intrariHtml(A, Q.seturi[s].intrari)}${hint(A)}
          <div class="ud-tw"><table class="ud-tab"><caption class="ud-lbl2" style="caption-side:top;text-align:left">Tabelul de urmărire${multe ? ` (${esc(Q.seturi[s].nume || 'setul ' + (s + 1))})` : ''}</caption><thead>${antet(A)}</thead><tbody>${rows}</tbody></table></div>
          ${ed}
          <div class="ud-unelte"><button type="button" class="btn ghost" data-x="inapoi"${S.length && !st.gata ? '' : ' disabled'}>Înapoi un rând</button><button type="button" class="btn ghost" data-x="capat">Ia-o de la capăt</button></div>
          <div class="ud-msg" aria-live="polite">${st.msg || '&nbsp;'}</div>
          ${cmp}
          <div class="ud-lbl">${multe ? 'Testele (fiecare set are filele lui)' : 'Testele'}</div><ul class="ud-teste">${Q.teste.map((t, k) => `<li data-t="${k}">${esc(t.ce || 'Testul ' + (k + 1))}</li>`).join('')}</ul></div></div>`;
        if (st.verificat) marcheaza();
        if (foc) { const el = body.querySelector(foc); if (el) el.focus({preventScroll: true}); }
      };
      body._draw = draw;
      const scrieRand = () => {
        const S = st.S[st.tab], ult = S[S.length - 1]; if (!ult || ult.gata) return;
        const r = nr.find(y => y.n === ult.n), P = r.P, w = scrieIn(P);
        const inp = body.querySelector('#ud-in'), v = inp ? inp.value : '';
        if (w != null) {
          const c = citesteNr(v);
          if (!c.ok) { st.err = c.m; draw('#ud-in'); const i2 = body.querySelector('#ud-in'); if (i2) i2.value = v; return; }
          ult.val = c.v;
        } else {
          if (!String(v).trim()) { st.err = 'Scrie întâi ce se afișează.'; draw('#ud-in'); return; }
          if (P.afis != null) { const c = citesteNr(v); ult.afis = c.ok ? c.v : String(v).trim(); }
          else ult.afis = String(v).trim();
        }
        ult.gata = true; st.err = '';
        st.msg = `Rândul ${S.length} e completat.`;
        draw('[data-x="pas"]'); proaspat();
      };
      body._udClick = ev => {
        const b = ev.target.closest('button'); if (!b || !body.contains(b) || b.disabled) return;
        const x = b.dataset.x, S = st.S[st.tab];
        if (x === 'tab') { st.tab = +b.dataset.s; st.err = ''; st.msg = ''; draw(`[data-x="tab"][data-s="${st.tab}"]`); return; }
        if (x === 'capat') {
          const reluare = st.gata; if (reluare) { st.verificat = false; st.S = Q.seturi.map(() => []); st.cmp = null; }
          else st.S[st.tab] = [];
          st.gata = false; st.err = '';
          st.msg = (multe && !reluare ? 'Tabelul setului e gol, ca la început.' : 'Tabelul e gol, ca la început.') + (reluare ? ' ' + esc(NOTA_DIN_NOU) : '');
          draw('[data-x="capat"]'); proaspat(); return;
        }
        if (st.gata) { st.msg = esc(NOTA_GATA); draw(); return; }
        if (x === 'pas') {
          if (S.length >= MAX_RANDURI) { st.err = `Tabelul are deja ${MAX_RANDURI} rânduri, mai multe decât pașii algoritmului. Apasă „Înapoi un rând”.`; draw(); return; }
          S.push({n: +b.dataset.n, val: null, cond: null, afis: null, gata: false});
          st.err = ''; st.msg = `Rândul ${S.length}: pasul ${b.dataset.n}.`;
          const r = nr.find(y => y.n === +b.dataset.n);
          draw(r.P.daca != null ? '[data-x="cond"]' : '#ud-in'); proaspat(); return;
        }
        if (x === 'cond') {
          const ult = S[S.length - 1]; if (!ult || ult.gata) return;
          ult.cond = b.dataset.v === '1'; ult.gata = true; st.err = '';
          st.msg = `Rândul ${S.length} e completat: condiția e ${valTxt(ult.cond)}.`;
          draw('[data-x="pas"]'); proaspat(); return;
        }
        if (x === 'scrie') { scrieRand(); return; }
        if (x === 'inapoi') {
          if (!S.length) return;
          S.pop(); st.err = ''; st.msg = S.length ? `Am șters ultimul rând. Acum tabelul are ${S.length === 1 ? 'un rând' : S.length + ' rânduri'}.` : 'Am șters ultimul rând. Tabelul e gol.';
          draw(S.length ? '[data-x="inapoi"]' : '[data-x="pas"]'); proaspat(); return;
        }
        if (x === 'cmp') { st.cmp = +b.dataset.k; draw(`[data-x="cmp"][data-k="${st.cmp}"]`); proaspat(); }
      };
      body.addEventListener('click', body._udClick);
      body._udKey = ev => { if (ev.target && ev.target.id === 'ud-in' && ev.key === 'Enter') { ev.preventDefault(); scrieRand(); } };
      body.addEventListener('keydown', body._udKey);
      draw();
      const navb = api.checkButton(() => {
        st.verificat = true; st.err = '';
        draw();
        const r = marcheaza(), bune = r.filter(x => x.ok).length, total = r.length;
        anunta(bune, total);
        if (bune === total) { st.gata = true; navb.innerHTML = ''; draw(); api.resolve(true); focUrmator(); }
        else {
          const k0 = r.findIndex(x => !x.ok);
          /* mesajul principal: primul rând greșit al primului set cu un test picat */
          const t0 = Q.teste[k0];
          if (multe && t0.k !== 'compara' && (t0.s || 0) !== st.tab) { st.tab = t0.s || 0; draw(); }
          const m0 = r[k0].m;
          api.resolve(false, `${bune} din ${total} teste trec. ${esc(m0.charAt(0).toUpperCase() + m0.slice(1))}`);
          api.revealButton(() => { TIP.rezolva(Q, body); st.gata = true; navb.innerHTML = ''; api.giveUp('tabelul fiecărui set e acum completat, rând cu rând.'); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) {
      const d = body._ud; if (!d) return;
      d.st.S = d.Q.seturi.map(s => joaca(d.Q.alg, s.intrari, 'bun'));
      if (d.Q.compara) d.st.cmp = d.Q.compara.ok;
      d.st.err = ''; d.st.msg = 'Fiecare rând e completat, în ordinea în care se fac pașii.';
      body._draw();
    },
    gresit(Q, body) {
      const d = body._ud; if (!d) return;
      const g = (d.Q.gresit && d.Q.gresit.s) || 0, cum = (d.Q.gresit && d.Q.gresit.cum) || 'ambele';
      d.st.S = d.Q.seturi.map((s, k) => joaca(d.Q.alg, s.intrari, k === g ? cum : 'bun'));
      if (d.Q.compara) d.st.cmp = d.Q.compara.ok;
      d.st.tab = g; d.st.err = '';
      body._draw();
    }
  };

  window.UrmarireDecizie = {
    versiune: VERSIUNE, numeroteaza, textPas, ruleaza, algoritmHtml, tabelHtml, traseuText,
    tipuri: {'tabel-urmarire': TIP},
    _intern: {analiza, testSet, joaca, citesteNr, curatText, cutiiElev}
  };
})();
