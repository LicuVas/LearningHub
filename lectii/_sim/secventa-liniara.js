/* lectii/_sim/secventa-liniara.js — „Structura secvențială (liniară)”: un robot face pașii unui algoritm scris în limbaj
   natural, unul după altul, în ordinea în care sunt scriși, fiecare o singură dată; se OPREȘTE la primul pas pe care nu-l
   poate face și arată UNDE și DE CE. Plus tabelul de urmărire (ce e în fiecare cutie după fiecare pas).

   PROPRIETAR: lecția V/28 (lectii/v/m4-l28, „Structura secvențială (liniară). Descriere în limbaj natural”), 02.11.2026.
   Lecțiile următoare îl pot încărca întreg, NEMODIFICAT; ce le lipsește fac într-un fișier NOU
   (`lectii/_sim/secventa-liniara-<ceva>.js`) prin API-ul de mai jos. Granița: _campaign/…/m4_seara_02_11/granite/v_l28.md.

   DEPENDENȚE (încărcate de pagină ÎNAINTE, nemodificate):
     - lectii/_sim/evaluare-expresii.js (V/27): calculele pașilor „Calculează <expresie> și pune rezultatul în cutia «x».”
       se fac cu EvaluareExpresii.valoare, ca semnele + − * / % să însemne exact ce a predat V/27. OBLIGATORIE pentru lumea `cutii`.
     - lectii/_sim/cutii-variabile.js (V/26): opțional, doar CutiiVariabile.numar (citirea numerelor scrise în tabel:
       cifre, „doisprezece”, „3 * 5 = 15”); fără el, doar cifre.

   CE SIMULEAZĂ (nu o aplicație: e „colegul care execută exact” din activitatea profesorului, ca robotul lecției V/24):
     - Robotul face pașii de sus în jos, fiecare o dată. Nu ghicește, nu sare, nu se întoarce, nu schimbă ordinea.
     - Lumea `ghiozdan`: ghiozdanul (închis la început, cu cărțile și caietele de azi în el), biroul, orarul de mâine.
       Pasul care pune sau scoate ceva cere ghiozdanul deschis; pasul „pentru orele de mâine” cere orarul citit înainte;
       un pas neclar oprește robotul ÎNAINTEA lui.
     - Lumea `cutii`: datele de intrare (ce se dă), cutiile (variabilele V/26) și ce se afișează. „Citește «x».” pune în
       cutie valoarea dată pentru «x»; „Calculează E și pune rezultatul în cutia «x».” = atribuirea (valoarea veche se
       pierde); „Pune 5 în cutia «x».”; „Afișează «x».” arată valoarea (cutia rămâne cum era). Un pas care folosește o cutie
       GOALĂ oprește robotul la el.
     - Testele judecă REZULTATUL (starea de la sfârșit; în lumea `cutii` pe TOATE cazurile din Q.cazuri, deci un algoritm
       „cu numerele scrise de mână” nu trece), nu drumul — regula 29. Ordinea contează doar prin rezultat.
     - Nimic nu se salvează și nimic nu pleacă: 0 localStorage / sessionStorage / cookie, 0 cereri.

   API PUBLIC (window.SecventaLiniara), versiune '1.0 (02.11.2026)':
     text(pas)                       -> propoziția pasului (aceeași peste tot)
     ruleaza(lume, pasi, opt)        -> raport FĂRĂ DOM:
        {lume, ok, oprit:null|'inchis'|'orar'|'neclar'|'gol', pas:<indice de la 0 | -1>, mesaj,
         randuri:[{i, stare, afisat:null|număr}]  (starea DUPĂ fiecare pas făcut),
         final:<starea de la sfârșit>, afisate:[…]}
        opt ghiozdan: {azi:['istorie','desen'], maine:['romana','mate','engleza']}
        opt cutii:    {intrari:{caiete:3,'preț':5}, cutii:['caiete','preț','total']}
        starea ghiozdan: {deschis, orar:true|false, in:[…], birou:[…], inchisDe:<indice>|-1}
        starea cutii:    {cutii:{nume: număr|null}}
     tabel(pasi, intrari, {cutii, titlu})    -> HTML static: tabelul de urmărire completat (pentru „Uite cum”)
     imagine(Q, pasi, {legenda})             -> HTML static: algoritmul (pasul la care s-a oprit, cu roșu) + scena de la sfârșit
     OBIECTE, MATERII                        -> numele lucrurilor din lumea ghiozdan
     tipuri.secventa, tipuri.urmarire        -> {render, rezolva, gresit} pentru JocMotor
   PAȘII (obiecte; textul îl face text()):
     ghiozdan: {f:'orar'} „Citește în orar ce ore ai mâine.” · {f:'deschide'} · {f:'inchide'} ·
               {f:'scoate'} „Scoate din ghiozdan toate cărțile și caietele.” ·
               {f:'pune_maine'} „Pune în ghiozdan cărțile și caietele pentru orele de mâine.” ·
               {f:'pune', o:'penar'|<materie>} „Pune penarul în ghiozdan.” / „Pune în ghiozdan caietul și manualul de desen.” ·
               {f:'neclar', text:'Pune cărțile în ghiozdan.', de_ce:'nu scrie care cărți'}
     cutii:    {f:'citeste', c} · {f:'calc', e:'«caiete» * «preț»', c} · {f:'pune', v, c} · {f:'afiseaza', c}
   TIPUL „secventa”: {t:'secventa', lume, q, alg:[…] (algoritmul de la pornire), cartonase:[…] (atingi unul → se pune la
     capăt), muta:true (↑ ↓), sterge:true (✕, doar cu cartonașe), max:10, azi?, maine?, cazuri?:[intrari,…], cutii?,
     teste:[{k:'termina'|'ghiozdan'|'inchis'|'afisat', ce}], sol:[…], gresit:[…], ajutor, why}
   TIPUL „urmarire”: {t:'urmarire', q, pasi:[…] (lumea cutii), intrari, cutii:[…], teste?:[{k:'cutii'|'afisat', ce}],
     gresit?:'fara-copiere'|'veche', ajutor, why}. Elevul scrie în tabel ce e în fiecare cutie după fiecare pas (cutia
     goală = căsuța goală) și ce se afișează.
   EVENIMENT: după fiecare „Verifică”, pe window: CustomEvent('secventa-liniara', {detail:{tip, ok, bune, total}}).
   CE NU SE SCHIMBĂ: numele pașilor (f), textele lor, numele testelor (k), forma raportului, prefixul `sec-`, „nimic nu
   se salvează, nimic nu pleacă”. Lecția V/29 (decizia) NU e aici: „dacă … atunci” se face într-un fișier nou.
   1.1 (02.11.2026, reparația după judecata 1 a V/28; API-ul NESCHIMBAT, doar comportament):
     - animația robotului se oprește când exercițiul se schimbă (motorul refolosește #body): orice pas al animației
       verifică întâi că exercițiul lui e încă pe ecran (J1 M1);
     - tabelul primește cutia goală spusă în cuvinte („e goală”, „cutia e goală”, „nimic încă”, „nu are”, „- -”), iar într-o
       căsuță care trebuie să rămână goală mesajul e cel de cutie goală, nu „scrie numărul” (J1 m1);
     - un calcul fără rezultat („20 − 6”) nu mai e primit ca valoare: „în cutie stă rezultatul, nu calculul”;
       „20 − 6 = 14” și „14” rămân primite (J1 m2). */
(function () {
  'use strict';
  const VERS = '1.1 (02.11.2026)';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  /* ===================== lumea ghiozdan ===================== */
  const MATERII = {romana: 'română', mate: 'matematică', engleza: 'engleză', istorie: 'istorie', desen: 'desen', muzica: 'muzică', geografie: 'geografie', tic: 'TIC'};
  const OBIECTE = Object.assign({penar: 'penarul'}, MATERII);
  const AZI = ['istorie', 'desen'], MAINE = ['romana', 'mate', 'engleza'];
  const numeO = o => o === 'penar' ? 'penarul' : `caietul și manualul de ${MATERII[o] || o}`;

  /* ===================== textul pașilor ===================== */
  function text(p) {
    if (!p) return '';
    switch (p.f) {
      case 'orar': return 'Citește în orar ce ore ai mâine.';
      case 'deschide': return 'Deschide ghiozdanul.';
      case 'inchide': return 'Închide ghiozdanul.';
      case 'scoate': return 'Scoate din ghiozdan toate cărțile și caietele.';
      case 'pune_maine': return 'Pune în ghiozdan cărțile și caietele pentru orele de mâine.';
      case 'neclar': return p.text;
      case 'citeste': return `Citește «${p.c}».`;
      case 'calc': return `Calculează ${p.e} și pune rezultatul în cutia «${p.c}».`;
      case 'afiseaza': return `Afișează «${p.c}».`;
      case 'pune':
        if (p.c != null) return `Pune ${p.v} în cutia «${p.c}».`;
        return p.o === 'penar' ? 'Pune penarul în ghiozdan.' : `Pune în ghiozdan ${numeO(p.o)}.`;
    }
    return String(p.text || p.f);
  }
  const lumeA = pasi => (pasi || []).some(p => ['citeste', 'calc', 'afiseaza'].includes(p.f) || (p.f === 'pune' && p.c != null)) ? 'cutii' : 'ghiozdan';
  const nr = (k, sg, pl) => k === 1 ? sg : `${k} ${pl}`;

  function ruleazaGhiozdan(pasi, opt) {
    opt = opt || {};
    const azi = opt.azi || AZI, maine = opt.maine || MAINE;
    const toate = Array.from(new Set([...azi, ...maine, 'penar', ...((opt.birou) || [])]));
    const st = {deschis: false, orar: false, in: azi.slice(), birou: toate.filter(o => !azi.includes(o)), inchisDe: -1, puseDe: {}, scoaseDe: {}};
    const copie = () => ({deschis: st.deschis, orar: st.orar, in: st.in.slice(), birou: st.birou.slice(), inchisDe: st.inchisDe});
    const randuri = [];
    const dupa = (i, f) => { for (let j = i + 1; j < pasi.length; j++) if (f(pasi[j])) return j; return -1; };
    const coada = i => i < pasi.length - 1 ? ' Pașii de după el nu s-au mai făcut.' : '';
    const pune = (o, i) => { if (!st.in.includes(o)) { st.in.push(o); st.birou = st.birou.filter(x => x !== o); } st.puseDe[o] = i; };
    for (let i = 0; i < pasi.length; i++) {
      const p = pasi[i], n = i + 1;
      if (p.f === 'neclar') {
        return {lume: 'ghiozdan', ok: false, oprit: 'neclar', pas: i, randuri, final: copie(),
          mesaj: `Robotul s-a oprit înaintea pasului ${n}: „${p.text}” ${p.de_ce ? '— ' + p.de_ce + '. ' : ''}Robotul nu ghicește, deci nu l-a făcut.${coada(i)}`};
      }
      const cereDeschis = ['scoate', 'pune_maine', 'pune'].includes(p.f);
      if (cereDeschis && !st.deschis) {
        const j = dupa(i, x => x.f === 'deschide');
        const m = st.inchisDe >= 0 ? `ghiozdanul e închis: l-a închis pasul ${st.inchisDe + 1}.` : 'ghiozdanul e închis și niciun pas de mai sus nu l-a deschis.';
        return {lume: 'ghiozdan', ok: false, oprit: 'inchis', pas: i, randuri, final: copie(),
          mesaj: `Robotul s-a oprit la pasul ${n}: ${m}${j >= 0 ? ` Pasul care îl deschide (${j + 1}) vine abia după.` : ''}${coada(i)}`};
      }
      if (p.f === 'pune_maine' && !st.orar) {
        const j = dupa(i, x => x.f === 'orar');
        return {lume: 'ghiozdan', ok: false, oprit: 'orar', pas: i, randuri, final: copie(),
          mesaj: `Robotul s-a oprit la pasul ${n}: nu știe ce ore ai mâine, pentru că niciun pas de mai sus nu i-a spus să citească orarul.${j >= 0 ? ` Orarul îl citește abia la pasul ${j + 1}.` : ''}${coada(i)}`};
      }
      if (p.f === 'orar') st.orar = true;
      else if (p.f === 'deschide') st.deschis = true;
      else if (p.f === 'inchide') { if (st.deschis) st.inchisDe = i; st.deschis = false; }
      else if (p.f === 'scoate') { st.in.filter(o => o !== 'penar').forEach(o => { st.scoaseDe[o] = i; st.birou.push(o); }); st.in = st.in.filter(o => o === 'penar'); }
      else if (p.f === 'pune_maine') maine.forEach(o => pune(o, i));
      else if (p.f === 'pune') pune(p.o, i);
      randuri.push({i, stare: copie(), afisat: null});
    }
    return {lume: 'ghiozdan', ok: true, oprit: null, pas: -1, randuri, final: copie(), puseDe: st.puseDe, scoaseDe: st.scoaseDe, mesaj: ''};
  }

  /* ===================== lumea cutii ===================== */
  const cutiiDin = e => Array.from(String(e).matchAll(/«([^»]+)»/g), m => m[1]);
  function ruleazaCutii(pasi, opt) {
    opt = opt || {};
    const intrari = opt.intrari || {};
    const nume = (opt.cutii || []).slice();
    pasi.forEach(p => { [p.c, ...(p.f === 'calc' ? cutiiDin(p.e) : [])].forEach(c => { if (c != null && !nume.includes(c)) nume.push(c); }); });
    const C = {}; nume.forEach(c => { C[c] = null; });
    const randuri = [], afisate = [];
    const copie = () => ({cutii: Object.assign({}, C)});
    const dupa = (i, c) => { for (let j = i + 1; j < pasi.length; j++) { const q = pasi[j]; if (q.c === c && q.f !== 'afiseaza') return j; } return -1; };
    const coada = i => i < pasi.length - 1 ? ' Pașii de după el nu s-au mai făcut.' : '';
    const gol = (i, c, ce) => {
      const j = dupa(i, c);
      return {lume: 'cutii', ok: false, oprit: 'gol', pas: i, randuri, afisate, final: copie(),
        mesaj: `Robotul s-a oprit la pasul ${i + 1}: cutia «${c}» e goală, deci ${ce}. Niciun pas de mai sus n-a pus ceva în ea.${j >= 0 ? ` O umple abia pasul ${j + 1}.` : ''}${coada(i)}`};
    };
    for (let i = 0; i < pasi.length; i++) {
      const p = pasi[i];
      let af = null;
      if (p.f === 'citeste') {
        if (!(p.c in intrari)) throw new Error(`secventa-liniara: nu se dă nicio valoare pentru «${p.c}»`);
        C[p.c] = intrari[p.c];
      } else if (p.f === 'calc') {
        const lipsa = cutiiDin(p.e).find(c => C[c] == null);
        if (lipsa) return gol(i, lipsa, `nu poate calcula ${p.e}`);
        const v = {}; cutiiDin(p.e).forEach(c => { v[c] = C[c]; });
        if (!window.EvaluareExpresii) throw new Error('secventa-liniara: lipsește evaluare-expresii.js');
        C[p.c] = window.EvaluareExpresii.valoare({e: p.e, cutii: v});
      } else if (p.f === 'pune') {
        C[p.c] = p.v;
      } else if (p.f === 'afiseaza') {
        if (C[p.c] == null) return gol(i, p.c, 'n-are ce afișa');
        af = C[p.c]; afisate.push(af);
      }
      randuri.push({i, stare: copie(), afisat: af});
    }
    return {lume: 'cutii', ok: true, oprit: null, pas: -1, randuri, afisate, final: copie(), mesaj: ''};
  }
  function ruleaza(lume, pasi, opt) {
    pasi = pasi || [];
    return (lume || lumeA(pasi)) === 'cutii' ? ruleazaCutii(pasi, opt) : ruleazaGhiozdan(pasi, opt);
  }

  /* ===================== numerele scrise (tabelul) ===================== */
  /* 1.1 (J1 m1): cutia goală spusă în cuvinte. Primit ca „goală” doar un text făcut NUMAI din cuvintele de mai jos și care
     are cel puțin un cuvânt „de gol” (deci „e”, „cutia” singure nu; „goală 5” nu). Fără diacritice, fără semne. */
  const faraD = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const GOL_CUV = new Set(['e', 'este', 'cutia', 'cutie', 'casuta', 'goala', 'gol', 'goale', 'nimic', 'inca', 'nu', 'are', 'n-are',
    'nici', 'niciun', 'un', 'numar', 'se', 'afiseaza', 'afisat', 'ramane', 'tot', 'acolo', 'in', 'ea', 'ceva']);
  const GOL_SEMN = new Set(['goala', 'gol', 'goale', 'nimic', 'nu', 'n-are', 'niciun', 'nici']);
  function eGol(t) {
    const w = faraD(t).replace(/[–—−.,!?;:"'„”«»()]/g, ' ').replace(/(^|\s)-+(?=\s|$)/g, ' ').trim().split(/\s+/).filter(Boolean);
    if (!w.length) return /^[\s\-–—−]+$/.test(String(t));   // doar liniuțe = goală; „?”, „.” singure NU
    return w.every(x => GOL_CUV.has(x)) && w.some(x => GOL_SEMN.has(x));
  }
  /* 1.1 (J1 m2): un calcul fără „= rezultat” („20 − 6”, „20 minus 6”) nu e o valoare de cutie */
  const REZ = /(?:\(|→|->|\bface\b|\bfac\b|\beste\b|\be\b)\s*(\d+)\s*\)?\s*$/;   // dirijor după J3 N5: „20 − 6 (14)”, „20 − 6 face 14” = 14
  const eCalcul = t => { const n = faraD(t).replace(/[×·∙]/g, '*').replace(/[–—−]/g, '-'); return !n.includes('=') && !/^\s*\d+\s*\(/.test(n) && !REZ.test(n) && /\d\s*([+\-*\/:x%]|minus|plus|ori)\s*\d/.test(n); };
  function citesteNr(s) {
    const t = String(s == null ? '' : s).trim();
    if (!t || eGol(t)) return {ok: true, v: null};
    if (eCalcul(t)) return {ok: false, calc: true, m: `în cutie stă rezultatul, nu calculul: cât face ${t}?`};
    if (window.CutiiVariabile && typeof window.CutiiVariabile.numar === 'function') {
      const r = window.CutiiVariabile.numar((!t.includes('=') && REZ.exec(faraD(t).replace(/[–—−]/g, '-')) || [0, t.replace(/^(\d+)\s*\(.*$/, '$1')])[1]);   // T2 (J2 N2): „14 (20 − 6)” = 14; J3 N5: „20 − 6 (14)” = 14
      if (r.ok) return {ok: true, v: r.v};
      return {ok: false, m: r.motiv === 'multe' ? 'scrie un singur număr' : r.motiv === 'zecimal' ? 'numerele de aici sunt fără virgulă' : r.motiv === 'minus' ? 'numerele de aici sunt fără semnul minus' : 'nu înțeleg ce ai scris; scrie doar numărul, cu cifre'};
    }
    if (/^\d+$/.test(t)) return {ok: true, v: +t};
    return {ok: false, m: 'nu înțeleg ce ai scris; scrie doar numărul, cu cifre'};
  }
  const valTxt = v => v == null ? '' : String(v);
  const fin = s => /[.?!]$/.test(s) ? s : s + '.';

  /* ===================== stilul ===================== */
  function stil() {
    if (document.getElementById('sec-css')) return;
    const s = document.createElement('style');
    s.id = 'sec-css';
    s.textContent = `
.sec{--sec-cutie:#E9D3A8;--sec-cutieL:#B88B4A;--sec-cutieInk:#3B2A12;--sec-gh:#2F5D8C;--sec-ghbg:#E3EDF7;--sec-carte:#FFF3D6;--sec-carteL:#C9A24A}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .sec{--sec-cutie:#5A4527;--sec-cutieL:#C9A46A;--sec-cutieInk:#F6E9CF;--sec-gh:#8DB8E4;--sec-ghbg:#1B2A3A;--sec-carte:#3A3220;--sec-carteL:#C9A24A}}
:root[data-theme="dark"] .sec{--sec-cutie:#5A4527;--sec-cutieL:#C9A46A;--sec-cutieInk:#F6E9CF;--sec-gh:#8DB8E4;--sec-ghbg:#1B2A3A;--sec-carte:#3A3220;--sec-carteL:#C9A24A}
.sec{display:grid;gap:10px}
@media (min-width:760px){.sec.sec-lat{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);align-items:start}}
.sec-scena{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:8px 10px;display:grid;gap:8px;min-width:0}
.sec-scena .sec-lbl{font-family:var(--fd,inherit);font-weight:600;margin:0}
.sec-orar{border:1px dashed var(--line);border-radius:8px;padding:5px 8px;background:var(--paper2);font-size:.93rem}
.sec-orar b{font-weight:700}
.sec-gh{border:3px solid var(--sec-gh);border-radius:26px 26px 10px 10px;background:var(--sec-ghbg);padding:0 8px 8px;min-height:92px}
.sec-gh .sec-clapa{margin:0 -8px 6px;padding:5px 10px;border-radius:22px 22px 0 0;font-weight:700;font-size:.9rem;text-align:center;color:var(--ink)}
.sec-gh.inchis .sec-clapa{background:var(--sec-gh);color:#fff}
.sec-gh.deschis .sec-clapa{border-bottom:2px dashed var(--sec-gh)}
.sec-obs{display:flex;flex-wrap:wrap;gap:5px;min-height:30px;align-items:flex-start}
.sec-ob{border:1.5px solid var(--sec-carteL);background:var(--sec-carte);border-radius:5px;padding:2px 7px;font-size:.88rem;line-height:1.3;color:var(--ink)}
.sec-ob.penar{border-style:dashed}
.sec-ob.nou{outline:3px solid var(--mark);outline-offset:1px}
.sec-gol{color:var(--ink2);font-size:.88rem;font-style:italic}
.sec-birou{border-top:4px solid var(--ink2);padding-top:5px}
.sec-birou .sec-lbl{font-size:.9rem}
.sec-intrari{display:flex;flex-wrap:wrap;gap:6px;font-size:.93rem;align-items:center}
.sec-in{border:1px dashed var(--line);border-radius:6px;padding:2px 8px;background:var(--paper2)}
.sec-cutii{display:flex;flex-wrap:wrap;gap:10px}
.sec-cutie{min-width:76px;text-align:center}
.sec-cutie .sec-et{font-weight:700;font-size:.88rem;margin-bottom:2px}
.sec-cutie .sec-v{border:2px solid var(--sec-cutieL);background:var(--sec-cutie);color:var(--sec-cutieInk);border-radius:4px 4px 8px 8px;min-height:38px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;padding:2px 8px}
.sec-cutie .sec-v.gol{font-weight:400;font-style:italic;font-size:.82rem}
.sec-cutie.nou .sec-v{outline:3px solid var(--mark);outline-offset:1px}
.sec-ecran{border:2px solid var(--ink2);border-radius:6px;background:#10161c;color:#e8f0e4;padding:4px 10px;min-height:32px;font-family:var(--fm,monospace);display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center}
.sec-ecran .sec-gol{color:#b5c6ae}
.sec-mes{margin:0;font-size:.93rem;min-height:1.3em}
.sec-mes.rau{color:var(--bad);font-weight:600}
.sec-dr{display:grid;gap:10px;min-width:0}
.sec-alg{border:2px solid var(--accent);border-radius:10px;background:var(--paper2);padding:6px 8px}
.sec-alg>b,.sec-pal>b,.sec-teste>b{font-family:var(--fd,inherit);font-weight:600}
.sec-alg ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:5px}
.sec-alg li{display:flex;align-items:center;gap:6px;background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:3px 4px 3px 6px;min-height:40px}
.sec-alg li.sec-acum{outline:3px solid var(--mark);outline-offset:1px;background:var(--sel)}
.sec-alg li.sec-stop{border:2px solid var(--bad);background:var(--badbg)}
.sec-alg li.sec-facut .sec-nr::after{content:" ✓";color:var(--ok)}
.sec-alg li.sec-neclar .sec-tx{font-style:italic}
.sec-nr{flex:none;min-width:2.2em;font-weight:800;color:var(--accent);text-align:right}
.sec-tx{flex:1 1 auto;min-width:0;line-height:1.3}
.sec-bt{flex:none;display:flex;gap:3px}
.sec-bt button,.sec-cart,.sec-cmd button{font:inherit;cursor:pointer;border-radius:8px;border:1px solid var(--line);background:var(--paper2);color:var(--ink)}
.sec-bt button{min-width:36px;min-height:36px;padding:0 6px;font-weight:800}
.sec-bt button:disabled{opacity:.35;cursor:default}
@media (max-width:480px){.sec-alg li{flex-wrap:wrap;row-gap:2px}.sec-tx{flex:1 1 50%}.sec-bt{margin-left:auto}}
.sec-pal{border:1px dashed var(--line);border-radius:10px;padding:6px 8px;background:var(--paper)}
.sec .hint{font-size:.85rem;color:var(--ink2)}
.sec-carts{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.sec-cart{min-height:40px;padding:4px 10px;text-align:left;border:2px solid var(--line);background:var(--paper2);max-width:100%}
.sec-cmd{display:flex;flex-wrap:wrap;gap:8px}
.sec-cmd button{min-height:40px;padding:4px 12px;font-weight:700}
.sec-cmd .sec-run{background:var(--accent);color:var(--accentInk);border-color:var(--accent)}
.sec-acumtxt{margin:0;min-height:1.4em;font-size:.95rem}
.sec-acumtxt.rau{color:var(--bad)}
.sec-teste{border:1px solid var(--line);border-radius:8px;padding:8px 10px;background:var(--paper2)}
.sec-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.sec-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.sec-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.sec-teste li.ok .s{color:var(--ok)}.sec-teste li.rau .s{color:var(--bad)}
.sec-teste li .m{display:block;font-size:.88rem;color:var(--bad)}
.sec-algtxt{margin:4px 0 6px 0;padding:0;list-style:none}
.sec-algtxt li{margin:2px 0;line-height:1.4}
.sec-algtxt .sec-nr{display:inline-block;min-width:4.4em;text-align:left}
.sec-tab-w{overflow-x:auto;max-width:100%}
table.sec-tab{border-collapse:collapse;font-size:.93rem;margin:4px 0}
table.sec-tab th,table.sec-tab td{border:1px solid var(--line);padding:3px 3px;text-align:center;vertical-align:middle}
table.sec-tab th{background:var(--paper2);font-weight:700;font-size:.85rem;line-height:1.2}
table.sec-tab td.sec-pas{font-weight:800;color:var(--accent);white-space:nowrap}
table.sec-tab td.sec-gol{color:var(--ink2)}
table.sec-tab td.sec-schimb{background:var(--sel);font-weight:800}
table.sec-tab input{width:2.9em;min-height:36px;font:inherit;font-weight:700;text-align:center;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);padding:2px}
table.sec-tab input.rau{border:2px solid var(--bad);background:var(--badbg)}
table.sec-tab input.ok{border-color:var(--ok)}
table.sec-tab input:disabled{opacity:1;color:var(--ink)}
.sec-fig{margin:6px 0}
.sec-fig figcaption{font-size:.88rem;color:var(--ink2);margin-top:4px}
`;
    document.head.appendChild(s);
  }

  /* ===================== scena ===================== */
  function scenaGhiozdan(Q, st, opt) {
    opt = opt || {};
    const maine = Q.maine || MAINE;
    const nou = new Set(opt.nou || []);
    const ob = o => `<span class="sec-ob${o === 'penar' ? ' penar' : ''}${nou.has(o) ? ' nou' : ''}">${esc(o === 'penar' ? 'penarul' : MATERII[o] || o)}</span>`;
    return `<div class="sec-scena">
  <div class="sec-orar"><b>Orarul de mâine:</b> ${maine.map(o => esc(MATERII[o] || o)).join(', ')}. <span class="hint">Robotul ${st.orar ? 'a citit orarul.' : 'n-a citit încă orarul.'}</span></div>
  <div class="sec-gh ${st.deschis ? 'deschis' : 'inchis'}" role="group" aria-label="Ghiozdanul, ${st.deschis ? 'deschis' : 'închis'}"><div class="sec-clapa">Ghiozdanul: ${st.deschis ? 'deschis' : 'închis'}</div>
    <div class="sec-obs">${st.in.length ? st.in.map(ob).join('') : '<span class="sec-gol">gol</span>'}</div></div>
  <div class="sec-birou"><p class="sec-lbl">Pe birou</p><div class="sec-obs">${st.birou.length ? st.birou.map(ob).join('') : '<span class="sec-gol">nimic</span>'}</div></div>
  ${opt.static ? '' : '<p class="hint" style="margin:0">Fiecare carte de pe birou și din ghiozdan e caietul și manualul unei materii.</p>'}
</div>`;
  }
  function scenaCutii(Q, st, opt) {
    opt = opt || {};
    const intrari = opt.intrari || Q.intrari || {};
    const nume = Object.keys(st.cutii);
    const nou = new Set(opt.nou || []);
    const af = opt.afisate || [];
    return `<div class="sec-scena">
  <div class="sec-intrari"><b>Se dau</b> <span class="hint">(datele de intrare):</span> ${Object.keys(intrari).map(c => `<span class="sec-in"><b>${esc(intrari[c])}</b> pentru «${esc(c)}»</span>`).join(' și ')}.</div>
  <div><p class="sec-lbl">Cutiile</p><div class="sec-cutii">${nume.map(c => `<div class="sec-cutie${nou.has(c) ? ' nou' : ''}"><div class="sec-et">«${esc(c)}»</div><div class="sec-v${st.cutii[c] == null ? ' gol' : ''}">${st.cutii[c] == null ? 'goală' : esc(st.cutii[c])}</div></div>`).join('')}</div></div>
  <div><p class="sec-lbl">Pe ecran <span class="hint">(ce se afișează)</span></p><div class="sec-ecran" aria-live="polite">${af.length ? af.map(v => `<span>${esc(v)}</span>`).join('') : '<span class="sec-gol">nimic încă</span>'}</div></div>
</div>`;
  }
  function stareStart(Q) {
    const L = Q.lume || lumeA(Q.alg || Q.sol || Q.pasi);
    if (L === 'cutii') { const C = {}; (Q.cutii || []).forEach(c => { C[c] = null; }); return {cutii: C}; }
    return ruleazaGhiozdan([], {azi: Q.azi, maine: Q.maine, birou: Q.birou}).final;
  }

  /* ===================== testele tipului „secventa” ===================== */
  function optQ(Q, caz) { return (Q.lume || lumeA(Q.alg || Q.sol)) === 'cutii' ? {intrari: caz || (Q.cazuri || [Q.intrari || {}])[0], cutii: Q.cutii} : {azi: Q.azi, maine: Q.maine, birou: Q.birou}; }
  function evalueaza(Q, alg) {
    const L = Q.lume || lumeA(alg.length ? alg : Q.sol);
    const r = ruleaza(L, alg, optQ(Q));
    const T = Q.teste || [];
    return T.map((t, k) => {
      let ok = true, m = '';
      if (t.k === 'termina') { ok = r.ok; m = r.mesaj; }
      else if (t.k === 'ghiozdan') {
        const tr = (Q.trebuie || [...(Q.maine || MAINE), 'penar']);
        const ina = r.final.in;
        const lipsa = tr.filter(o => !ina.includes(o)), plus = ina.filter(o => !tr.includes(o));
        ok = !lipsa.length && !plus.length;
        if (!ok) {
          const lista = a => a.map(o => o === 'penar' ? 'penarul' : MATERII[o] || o).join(', ');
          const parti = [];
          if (lipsa.length) {
            let cauza = '';
            if (!r.ok) cauza = ` Robotul s-a oprit la pasul ${r.pas + 1}, înainte să termine.`;
            else {
              const scoase = lipsa.filter(o => r.scoaseDe && r.scoaseDe[o] != null && r.puseDe && r.puseDe[o] != null && r.puseDe[o] < r.scoaseDe[o]);
              if (scoase.length) cauza = ` ${scoase.length === lipsa.length ? 'Le' : lista(scoase).replace(/^./, c => c.toUpperCase()) + ': le'}-a pus pasul ${r.puseDe[scoase[0]] + 1}, dar pasul ${r.scoaseDe[scoase[0]] + 1}, de mai jos, le-a scos din nou.`;
            }
            parti.push(`În ghiozdan ${lipsa.length === 1 ? 'lipsește' : 'lipsesc'}: ${lista(lipsa)}.${cauza}`);
          }
          if (plus.length) parti.push(`În ghiozdan e și ce nu trebuie mâine: ${lista(plus)}.`);
          m = parti.join(' ');
        }
      }
      else if (t.k === 'inchis') {
        ok = r.ok && !r.final.deschis;
        if (!ok) m = !r.ok ? `Robotul s-a oprit la pasul ${r.pas + 1}, înainte să ajungă la ultimul pas.` : 'La sfârșit, ghiozdanul a rămas deschis: după ultimul pas făcut, nimic nu l-a închis.';
      }
      else if (t.k === 'afisat') {
        const cazuri = Q.cazuri || [Q.intrari || {}];
        for (const caz of cazuri) {
          const a = ruleaza('cutii', alg, {intrari: caz, cutii: Q.cutii}), b = ruleaza('cutii', Q.sol, {intrari: caz, cutii: Q.cutii});
          const date = Object.keys(caz).map(c => `«${c}»: ${caz[c]}`).join(', ');
          if (!a.ok) { ok = false; m = `Cu datele ${date}, robotul s-a oprit la pasul ${a.pas + 1} și n-a afișat ${a.afisate.length ? 'tot' : 'nimic'}.`; break; }
          if (a.afisate.join('|') !== b.afisate.join('|')) {
            ok = false;
            m = a.afisate.length ? `Cu datele ${date}, robotul a afișat ${a.afisate.join(', ')}, dar ${t.astept || 'rezultatul'} e ${b.afisate.join(', ')}.` : `Cu datele ${date}, robotul n-a afișat nimic: lipsește pasul care afișează.`;
            break;
          }
        }
      }
      return {ce: t.ce || t.k, ok, m};
    });
  }

  /* ===================== tipul „secventa” ===================== */
  function porneste(Q, body, api, alg) {
    stil();
    const L = Q.lume || lumeA(Q.sol || Q.alg);
    const S = {alg: (alg || []).map(x => Object.assign({}, x)), rap: null, timer: null, acum: -1, facute: -1};
    /* 1.1 (J1 M1): motorul refolosește #body; animația exercițiului de dinainte se oprește aici */
    if (body._sec && body._sec.timer) { clearInterval(body._sec.timer); body._sec.timer = null; }
    body._sec = S;
    const muta = Q.muta !== false, sterge = Q.sterge !== false && (Q.cartonase || []).length > 0, max = Q.max || 10;
    body.innerHTML = `<div class="sec sec-lat">
  <div class="sec-sc"></div>
  <div class="sec-dr">
    <div class="sec-alg"><b>Algoritmul</b> <span class="hint">· robotul face pașii de sus în jos, fiecare o dată</span><ol></ol></div>
    ${(Q.cartonase || []).length ? `<div class="sec-pal"><b>Cartonașele</b> <span class="hint">· atinge unul ca să-l pui la capătul algoritmului</span><div class="sec-carts">${Q.cartonase.map((c, k) => `<button type="button" class="sec-cart" data-c="${k}">${esc(text(c))}</button>`).join('')}</div></div>` : ''}
    <div class="sec-cmd"><button type="button" class="sec-run">▶ Pornește robotul</button><button type="button" class="sec-capat">Ia-o de la capăt</button></div>
    <p class="sec-acumtxt" aria-live="polite"></p>
  </div></div>
  ${(Q.teste || []).length ? `<div class="sec sec-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică”</span><ol></ol></div>` : ''}`;
    const $ = s => body.querySelector(s);
    /* 1.1 (J1 M1): exercițiul acesta e încă pe ecran? (altfel — o întrebare, alt exercițiu — animația se oprește, fără să scrie nimic) */
    const radacina = body.firstElementChild;
    const viu = () => body._sec === S && !!radacina && radacina.isConnected;
    const acum = (h, rau) => { const p = $('.sec-acumtxt'); p.innerHTML = h || ''; p.classList.toggle('rau', !!rau); };
    function scena(st, opt) {
      opt = opt || {};
      $('.sec-sc').innerHTML = (L === 'cutii' ? scenaCutii(Q, st, Object.assign({intrari: optQ(Q).intrari}, opt)) : scenaGhiozdan(Q, st, opt))
        + (opt.msg ? `<p class="sec-mes${opt.rau ? ' rau' : ''}">${opt.msg}</p>` : '');
    }
    function scrieAlg(focus) {
      const ol = $('.sec-alg ol'), n = S.alg.length;
      ol.innerHTML = n ? S.alg.map((p, i) => `<li data-i="${i}" class="${p.f === 'neclar' ? 'sec-neclar' : ''}${S.acum === i ? ' sec-acum' : ''}${S.acum < 0 && S.rap && !S.rap.ok && S.rap.pas === i ? ' sec-stop' : ''}${i <= S.facute && S.acum !== i ? ' sec-facut' : ''}"><span class="sec-nr">${i + 1}.</span><span class="sec-tx">${esc(text(p))}</span><span class="sec-bt">${muta ? `<button type="button" data-a="sus" aria-label="Mută pasul ${i + 1} mai sus" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" data-a="jos" aria-label="Mută pasul ${i + 1} mai jos" ${i === n - 1 ? 'disabled' : ''}>↓</button>` : ''}${sterge ? `<button type="button" data-a="sterge" aria-label="Scoate pasul ${i + 1}">✕</button>` : ''}</span></li>`).join('')
        : `<li class="sec-gol">Niciun pas încă. ${(Q.cartonase || []).length ? 'Atinge cartonașele de mai jos, în ordinea în care vrei să le facă robotul.' : ''}</li>`;
      if (focus) { const el = body.querySelector(focus); if (el && !el.disabled) el.focus({preventScroll: true}); }
    }
    function scrieTeste(arata) {
      const ol = $('.sec-teste ol'); if (!ol) return [];
      const T = arata ? evalueaza(Q, S.alg) : (Q.teste || []).map(t => ({ce: t.ce || t.k, ok: false, m: ''}));
      ol.innerHTML = T.map((t, k) => `<li class="${arata ? (t.ok ? 'ok' : 'rau') : ''}"><span class="s">${arata ? (t.ok ? '✓' : '✗') : '○'}</span><span>${k + 1}. ${t.ce}${arata && !t.ok && t.m ? `<span class="m">${esc(t.m)}</span>` : ''}</span></li>`).join('');
      return T;
    }
    function opreste() { if (S.timer) { clearInterval(S.timer); S.timer = null; } S.acum = -1; const r = $('.sec-run'); if (r) r.textContent = '▶ Pornește robotul'; }
    function schimbat(msg, focus) { opreste(); S.rap = null; S.facute = -1; scena(stareStart(Q)); scrieAlg(focus); scrieTeste(false); acum(msg || 'Algoritmul s-a schimbat. Apasă „▶ Pornește robotul” ca să vezi ce face acum.'); }
    function dupaRulare() {
      if (!viu()) { if (S.timer) { clearInterval(S.timer); S.timer = null; } return; }
      const r = S.rap; S.facute = r.ok ? S.alg.length - 1 : r.pas - 1; scrieAlg();
      const m = r.ok ? (S.alg.length === 1 ? 'Robotul a făcut singurul pas, exact cum e scris.' : `Robotul a făcut toți cei ${S.alg.length} pași, unul după altul, exact cum sunt scriși.`) : esc(r.mesaj);
      scena(r.final, {msg: m, rau: !r.ok, afisate: r.afisate});
      acum(m, !r.ok);
    }
    function anim() {
      if (S.timer) { opreste(); dupaRulare(); return; }
      if (!S.alg.length) { acum('Algoritmul n-are niciun pas: robotul n-are ce face.', true); return; }
      S.rap = ruleaza(L, S.alg, optQ(Q));
      const R = S.rap.randuri; let k = -1;
      $('.sec-run').textContent = '⏭ Arată tot';
      S.facute = -1; scena(stareStart(Q));
      if (window.innerWidth < 760) { const sc = $('.sec-sc'), b = sc.getBoundingClientRect(); if (b.top < 56 || b.bottom > window.innerHeight) sc.scrollIntoView({block: 'start', behavior: 'smooth'}); }
      const pas = () => {
        if (!viu()) { clearInterval(S.timer); S.timer = null; return; }
        k++;
        if (k >= R.length) { opreste(); dupaRulare(); return; }
        const rr = R[k], prev = k ? R[k - 1].stare : stareStart(Q);
        let nou = [];
        if (L === 'cutii') nou = Object.keys(rr.stare.cutii).filter(c => rr.stare.cutii[c] !== prev.cutii[c]);
        else nou = rr.stare.in.filter(o => !prev.in.includes(o));
        const m = `Robotul face pasul ${rr.i + 1}: „${esc(text(S.alg[rr.i]))}”`;
        S.acum = rr.i; S.facute = rr.i - 1; scrieAlg();
        scena(rr.stare, {msg: m, nou, afisate: R.slice(0, k + 1).map(x => x.afisat).filter(v => v != null)});
        acum(m);
      };
      if (!R.length) { opreste(); dupaRulare(); return; }
      S.timer = setInterval(pas, 700); pas();
    }
    body.querySelector('.sec-dr').addEventListener('click', e => {
      const t = e.target;
      if (t.closest('.sec-run')) { anim(); return; }
      if (t.closest('.sec-capat')) { opreste(); S.alg = (Q.alg || []).map(x => Object.assign({}, x)); schimbat('Totul e ca la început: algoritmul și ' + (L === 'cutii' ? 'cutiile.' : 'ghiozdanul.')); return; }
      if (api.done()) return;
      const btn = t.closest('.sec-bt button');
      if (btn) {
        const i = +btn.closest('li').dataset.i, a = btn.dataset.a;
        if (a === 'sus' && i > 0) { [S.alg[i - 1], S.alg[i]] = [S.alg[i], S.alg[i - 1]]; schimbat('', `li[data-i="${i - 1}"] [data-a="sus"]`); }
        else if (a === 'jos' && i < S.alg.length - 1) { [S.alg[i + 1], S.alg[i]] = [S.alg[i], S.alg[i + 1]]; schimbat('', `li[data-i="${i + 1}"] [data-a="jos"]`); }
        else if (a === 'sterge') { S.alg.splice(i, 1); schimbat('', S.alg.length ? `li[data-i="${Math.min(i, S.alg.length - 1)}"] [data-a="sterge"]` : '.sec-cart'); }
        return;
      }
      const c = t.closest('.sec-cart');
      if (c) {
        if (S.alg.length >= max) { acum(`Algoritmul are deja ${max} pași: scoate unul (✕) ca să pui altul.`, true); return; }
        S.alg.push(Object.assign({}, Q.cartonase[+c.dataset.c]));
        schimbat(`Ai pus pasul ${S.alg.length}: „${esc(text(S.alg[S.alg.length - 1]))}”.`);
        c.focus({preventScroll: true});
      }
    });
    const verifica = () => {
      opreste();
      if (!S.alg.length) { scrieTeste(true); api.resolve(false, 'Algoritmul n-are niciun pas încă.' + ((Q.cartonase || []).length ? ' Atinge cartonașele, în ordinea în care vrei să le facă robotul.' : '')); return; }
      S.rap = ruleaza(L, S.alg, optQ(Q)); dupaRulare();
      const T = scrieTeste(true), k = T.findIndex(x => !x.ok);
      try { window.dispatchEvent(new CustomEvent('secventa-liniara', {detail: {tip: 'secventa', ok: k < 0, bune: T.filter(x => x.ok).length, total: T.length}})); } catch (e) { /* fără evenimente */ }
      if (k < 0) {
        api.nav().innerHTML = ''; api.resolve(true);
        setTimeout(() => { const bb = ['inca', 'pas-next', 'go', 'next'].map(i => document.getElementById(i)).find(e => e && e.offsetParent !== null && !e.disabled); if (bb) bb.focus({preventScroll: true}); }, 0);
        return;
      }
      api.resolve(false, `${T.filter(x => x.ok).length} din ${T.length} teste trec. ${esc(T[k].m)}`);
      api.revealButton(() => {
        opreste(); S.alg = (Q.sol || []).map(x => Object.assign({}, x)); S.rap = ruleaza(L, S.alg, optQ(Q)); dupaRulare(); scrieTeste(true); api.nav().innerHTML = '';
        api.giveUp(Q.solutieText || ('robotul face acum pașii: ' + S.alg.map((x, j) => `${j + 1}. ${esc(text(x))}`).join(' ')));
      });
    };
    S.facute = -1; scena(stareStart(Q)); scrieAlg(); scrieTeste(false);
    acum(S.alg.length ? 'Apasă „▶ Pornește robotul” ca să vezi ce face.' : (Q.cartonase || []).length ? 'Atinge cartonașele, în ordinea în care vrei să le facă robotul.' : '');
    api.checkButton(verifica);
    return S;
  }
  const tipSecventa = {
    render(Q, body, api) { porneste(Q, body, api, Q.alg); },
    rezolva(Q, body, api) { porneste(Q, body, api, Q.sol); },
    gresit(Q, body, api) { porneste(Q, body, api, Q.gresit || Q.alg); }
  };

  /* ===================== tabelul de urmărire ===================== */
  function corect(Q) { return ruleazaCutii(Q.pasi, {intrari: Q.intrari, cutii: Q.cutii}); }
  function algHtml(pasi) { return `<ol class="sec-algtxt">${pasi.map((p, i) => `<li><span class="sec-nr">Pasul ${i + 1}.</span> ${esc(text(p))}</li>`).join('')}</ol>`; }
  function tabel(pasi, intrari, o) {
    stil(); o = o || {};
    const r = ruleazaCutii(pasi, {intrari, cutii: o.cutii});
    const nume = o.cutii && o.cutii.length ? o.cutii : Object.keys(r.final.cutii);
    let prev = {}; nume.forEach(c => { prev[c] = null; });
    const rows = r.randuri.map(rr => {
      const td = nume.map(c => { const v = rr.stare.cutii[c], sch = v !== prev[c]; return `<td class="${v == null ? 'sec-gol' : sch ? 'sec-schimb' : ''}">${v == null ? '–' : esc(v)}</td>`; }).join('');
      prev = rr.stare.cutii;
      return `<tr><td class="sec-pas">${rr.i + 1}</td>${td}<td class="${rr.afisat == null ? 'sec-gol' : 'sec-schimb'}">${rr.afisat == null ? '' : esc(rr.afisat)}</td></tr>`;
    }).join('');
    return `<figure class="sec sec-fig">${o.titlu ? `<figcaption style="margin:0 0 4px">${o.titlu}</figcaption>` : ''}<div class="sec-tab-w"><table class="sec-tab"><thead><tr><th scope="col">Pasul</th>${nume.map(c => `<th scope="col">«${esc(c)}»</th>`).join('')}<th scope="col">Se afișează</th></tr></thead><tbody>${rows}</tbody></table></div>${o.legenda ? `<figcaption>${o.legenda}</figcaption>` : ''}</figure>`;
  }
  function judecaTabel(Q, val) {
    /* val[r][c] = textul scris în căsuța rândului r, coloana c (cutiile, apoi „Se afișează” ca ultima coloană) */
    const r = corect(Q), nume = Q.cutii && Q.cutii.length ? Q.cutii : Object.keys(r.final.cutii);
    const rele = [], m = {cutii: '', afisat: ''};
    let prev = {}; nume.forEach(c => { prev[c] = null; });
    r.randuri.forEach((rr, ri) => {
      const p = Q.pasi[rr.i], n = rr.i + 1;
      nume.forEach((c, ci) => {
        const asteapta = rr.stare.cutii[c], citit = citesteNr((val[ri] || [])[ci]);
        if (citit.ok && citit.v === asteapta) return;
        rele.push([ri, ci]);
        if (m.cutii) return;
        const schimba = p.c === c && p.f !== 'afiseaza';
        /* 1.1 (J1 m1): căsuța care trebuie să rămână goală primește mesajul de cutie goală, oricare ar fi textul */
        if (asteapta == null) m.cutii = `Rândul pasului ${n}, cutia «${c}»: după pasul ${n}, cutia «${c}» e încă goală (niciun pas până aici n-a pus ceva în ea). Lasă căsuța goală.`;
        else if (!citit.ok) m.cutii = `Rândul pasului ${n}, cutia «${c}»: ${fin(citit.m)}`;
        else if (!schimba) m.cutii = `Rândul pasului ${n}, cutia «${c}»: pasul ${n} nu schimbă cutia «${c}», deci în ea a rămas ce era după pasul ${n - 1}. Scrie din nou acea valoare.`;
        else if (citit.v == null) m.cutii = `Rândul pasului ${n}, cutia «${c}»: pasul ${n} pune o valoare în «${c}». Scrie ce valoare.`;
        else if (p.f === 'citeste') m.cutii = `Rândul pasului ${n}, cutia «${c}»: pasul ${n} citește «${c}», deci în cutie intră valoarea dată pentru «${c}» (la „Se dau”).`;
        else if (p.f === 'pune') m.cutii = `Rândul pasului ${n}, cutia «${c}»: pasul ${n} pune ${p.v} în «${c}».`;
        else m.cutii = `Rândul pasului ${n}, cutia «${c}»: pasul ${n} pune în «${c}» rezultatul lui ${p.e}, calculat cu valorile din rândul de deasupra.${ri > 0 && citit.v === (r.randuri[ri - 1].stare.cutii[c]) ? ' Ce era înainte în cutie se pierde: rămâne doar valoarea nouă.' : ''}`;
      });
      const ca = nume.length, citA = citesteNr((val[ri] || [])[ca]);
      if (!(citA.ok && citA.v === rr.afisat)) {
        rele.push([ri, ca]);
        if (!m.afisat) {
          if (rr.afisat == null) m.afisat = `Rândul pasului ${n}: pasul ${n} nu afișează nimic. Lasă căsuța „Se afișează” goală.`;
          else if (!citA.ok) m.afisat = `Rândul pasului ${n}, „Se afișează”: ${citA.calc ? `pe ecran apare un număr, nu calculul: cât face ${String((val[ri] || [])[ca]).trim()}?` : fin(citA.m)}`;
          else m.afisat = `Rândul pasului ${n}: pasul ${n} afișează ce e în cutia «${p.c}» după pasul ${n}.`;
        }
      }
      prev = rr.stare.cutii;
    });
    const T = (Q.teste || [{k: 'cutii', ce: 'În fiecare rând: ce e în fiecare cutie după pasul acela'}, {k: 'afisat', ce: 'Coloana „Se afișează”: ce arată robotul și când'}]).map(t => {
      const ok = t.k === 'cutii' ? !rele.some(x => x[1] < nume.length) : !rele.some(x => x[1] === nume.length);
      return {ce: t.ce || t.k, ok, m: ok ? '' : m[t.k]};
    });
    return {T, rele, nume, r};
  }
  function valoriTabel(Q, fel) {
    const r = corect(Q), nume = Q.cutii && Q.cutii.length ? Q.cutii : Object.keys(r.final.cutii);
    return r.randuri.map((rr, ri) => {
      const p = Q.pasi[rr.i];
      const v = nume.map(c => {
        const x = rr.stare.cutii[c];
        if (fel === 'fara-copiere') return (p.c === c && p.f !== 'afiseaza') ? valTxt(x) : '';
        if (fel === 'veche') { const y = ri ? r.randuri[ri - 1].stare.cutii[c] : null; return (p.f === 'calc' && p.c === c && y != null) ? valTxt(y) : valTxt(x); }
        return valTxt(x);
      });
      v.push(valTxt(rr.afisat));
      return v;
    });
  }
  function pornesteTabel(Q, body, api, fel) {
    stil();
    const r = corect(Q), nume = Q.cutii && Q.cutii.length ? Q.cutii : Object.keys(r.final.cutii);
    const init = fel ? valoriTabel(Q, fel) : r.randuri.map(() => nume.concat(['']).map(() => ''));
    body.innerHTML = `<div class="sec">
  <div class="sec-scena"><p class="sec-lbl">Algoritmul</p>${algHtml(Q.pasi)}
  <div class="sec-intrari"><b>Se dau</b> <span class="hint">(datele de intrare):</span> ${Object.keys(Q.intrari).map(c => `<span class="sec-in"><b>${esc(Q.intrari[c])}</b> pentru «${esc(c)}»</span>`).join(' și ')}.</div></div>
  <div class="sec-tab-w"><table class="sec-tab"><caption class="hint" style="text-align:left;caption-side:top">Scrie ce e în fiecare cutie DUPĂ fiecare pas. Cutia goală: lași căsuța goală.</caption>
  <thead><tr><th scope="col">Pasul</th>${nume.map(c => `<th scope="col">«${esc(c)}»</th>`).join('')}<th scope="col">Se afișează</th></tr></thead>
  <tbody>${r.randuri.map((rr, ri) => `<tr><td class="sec-pas">${rr.i + 1}</td>${nume.concat(['__af']).map((c, ci) => `<td><input type="text" inputmode="numeric" autocomplete="off" data-r="${ri}" data-c="${ci}" aria-label="Pasul ${rr.i + 1}, ${c === '__af' ? 'se afișează' : 'cutia ' + esc(c)}" value="${esc(init[ri][ci])}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <div class="sec-cmd"><button type="button" class="sec-golire">Golește tabelul</button></div>
  ${`<div class="sec-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică”</span><ol></ol></div>`}
</div>`;
    const $ = s => body.querySelector(s), ins = () => Array.from(body.querySelectorAll('table.sec-tab input'));
    const citeste = () => { const v = r.randuri.map(() => []); ins().forEach(i => { v[+i.dataset.r][+i.dataset.c] = i.value; }); return v; };
    function scrieTeste(T) {
      const ol = $('.sec-teste ol');
      const L = T || (Q.teste || [{ce: 'În fiecare rând: ce e în fiecare cutie după pasul acela'}, {ce: 'Coloana „Se afișează”: ce arată robotul și când'}]).map(t => ({ce: t.ce, ok: false}));
      ol.innerHTML = L.map((t, k) => `<li class="${T ? (t.ok ? 'ok' : 'rau') : ''}"><span class="s">${T ? (t.ok ? '✓' : '✗') : '○'}</span><span>${k + 1}. ${t.ce}${T && !t.ok && t.m ? `<span class="m">${esc(t.m)}</span>` : ''}</span></li>`).join('');
    }
    body.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || !e.target.matches('table.sec-tab input')) return;
      e.preventDefault(); const a = ins(), k = a.indexOf(e.target); if (k >= 0 && k < a.length - 1) a[k + 1].focus();
    });
    body.addEventListener('input', e => { if (e.target.matches('table.sec-tab input')) e.target.classList.remove('rau', 'ok'); });
    $('.sec-golire').addEventListener('click', () => { if (api.done()) return; ins().forEach(i => { i.value = ''; i.classList.remove('rau', 'ok'); }); scrieTeste(); const f = ins()[0]; if (f) f.focus(); });
    const verifica = () => {
      const J = judecaTabel(Q, citeste()), rele = new Set(J.rele.map(x => x.join(',')));
      ins().forEach(i => { const bad = rele.has(i.dataset.r + ',' + i.dataset.c); i.classList.toggle('rau', bad); i.classList.toggle('ok', !bad); });
      scrieTeste(J.T);
      const k = J.T.findIndex(x => !x.ok);
      try { window.dispatchEvent(new CustomEvent('secventa-liniara', {detail: {tip: 'urmarire', ok: k < 0, bune: J.T.filter(x => x.ok).length, total: J.T.length}})); } catch (e) { /* fără evenimente */ }
      if (k < 0) {
        ins().forEach(i => { i.disabled = true; });
        api.nav().innerHTML = ''; api.resolve(true);
        setTimeout(() => { const bb = ['inca', 'pas-next', 'go', 'next'].map(i => document.getElementById(i)).find(e => e && e.offsetParent !== null && !e.disabled); if (bb) bb.focus({preventScroll: true}); }, 0);
        return;
      }
      api.resolve(false, `${J.T.filter(x => x.ok).length} din ${J.T.length} teste trec. ${esc(J.T[k].m)} Căsuțele greșite sunt cu roșu.`);
      const prima = ins().find(i => i.classList.contains('rau')); if (prima) prima.focus({preventScroll: true});
      api.revealButton(() => {
        const v = valoriTabel(Q, null); ins().forEach(i => { i.value = v[+i.dataset.r][+i.dataset.c]; i.classList.remove('rau'); i.classList.add('ok'); i.disabled = true; });
        scrieTeste(judecaTabel(Q, v).T); api.nav().innerHTML = '';
        api.giveUp(Q.solutieText || 'tabelul completat e mai sus: după fiecare pas, fiecare cutie are valoarea pusă de ultimul pas care a scris în ea.');
      });
    };
    scrieTeste();
    api.checkButton(verifica);
    return {citeste};
  }
  const tipUrmarire = {
    render(Q, body, api) { pornesteTabel(Q, body, api, null); },
    rezolva(Q, body, api) { pornesteTabel(Q, body, api, 'corect'); },
    gresit(Q, body, api) { pornesteTabel(Q, body, api, Q.gresit || 'fara-copiere'); }
  };

  /* ===================== imaginea unei rulări (pentru „Uite cum”) ===================== */
  function imagine(Q, pasi, o) {
    stil(); o = o || {};
    const L = Q.lume || lumeA(pasi), r = ruleaza(L, pasi, optQ(Q));
    const facute = r.ok ? pasi.length - 1 : r.pas - 1;
    const alg = `<div class="sec-alg"><b>Algoritmul</b><ol>${pasi.map((p, i) => `<li class="${!r.ok && r.pas === i ? 'sec-stop' : i <= facute ? 'sec-facut' : ''}${p.f === 'neclar' ? ' sec-neclar' : ''}"><span class="sec-nr">${i + 1}.</span><span class="sec-tx">${esc(text(p))}</span></li>`).join('')}</ol></div>`;
    const sc = L === 'cutii' ? scenaCutii(Q, r.final, {intrari: optQ(Q).intrari, afisate: r.afisate}) : scenaGhiozdan(Q, r.final, {static: true});
    const m = r.ok ? 'Robotul a făcut toți pașii, unul după altul.' : esc(r.mesaj);
    return `<figure class="sec sec-lat sec-fig" role="group" aria-label="${esc(o.aria || 'Algoritmul și ce a făcut robotul')}">${alg}<div>${sc}<p class="sec-mes${r.ok ? '' : ' rau'}">${m}</p></div>${o.legenda ? `<figcaption style="grid-column:1/-1">${o.legenda}</figcaption>` : ''}</figure>`;
  }

  window.SecventaLiniara = {versiune: VERS, text, ruleaza, tabel, imagine, OBIECTE, MATERII, citesteNr,
    tipuri: {secventa: tipSecventa, urmarire: tipUrmarire},
    _intern: {evalueaza, judecaTabel, valoriTabel, ruleazaGhiozdan, ruleazaCutii}};
})();
