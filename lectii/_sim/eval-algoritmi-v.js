/* ======================================================================================================
   lectii/_sim/eval-algoritmi-v.js — PROBA DE ANTRENAMENT, cu punctaj pe părțile C / B / A, peste simulatoarele PUBLICATE ale
   unității V-U5, plus „scriu algoritmul din cartonașe”, cu DECIZIE (lecția V · M5 · nr. 30, „Evaluare sumativă: algoritmi în
   limbaj natural”, 08.11.2026). PROPRIETAR: autorul lecției V/30.
   Granița: _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/v_l30.md.
   Modele (mecanismul, nu codul): paint-proba.js (V/23: panoul, rezumatul „după ultima cifră”), eval-repetitii-vi.js (VI/26:
   punctele la prima verificare, „o scăpare se pedepsește o singură dată” la tabel).

   NU modifică motorul, cutii-variabile.js (V/26), evaluare-expresii.js (V/27), secventa-liniara.js (V/28),
   urmarire-decizie.js (V/29), rezultat-elev.js, prezenta.js. Le folosește DOAR prin ce expun:
     - tipurile lor pentru motor (render / rezolva / gresit);
     - CutiiVariabile.numar; EvaluareExpresii.valoare; UrmarireDecizie.numeroteaza / textPas / ruleaza / _intern.curatText;
     - body._cvd.st (date-rol: loc, val), body._ud.st (tabel-urmarire: S), căsuțele `table.sec-tab input[data-r][data-c]` (urmarire);
     - api.resolve / api.giveUp ale motorului: le învelesc ca să socotesc punctele la PRIMA verificare.

   ÎNCĂRCARE (după motor.js și, în ordine, cutii-variabile.js, evaluare-expresii.js, secventa-liniara.js, urmarire-decizie.js):
     <script src="../../_sim/eval-algoritmi-v.js"></script>
     EvalAlgoritmiV.configureaza({titlu:'Proba de antrenament',oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:12},…],dupaFinal?:'HTML'});
     tipuri:{scrie:EvalAlgoritmiV.scrie,                                      // fără puncte (pașii lecției)
             probascrie:EvalAlgoritmiV.punctat(EvalAlgoritmiV.scrie,'scrie'),
             probadate:EvalAlgoritmiV.punctat(CutiiVariabile.tipuri['date-rol'],'date'),
             probaurm:EvalAlgoritmiV.punctat(SecventaLiniara.tipuri.urmarire,'urmarire'),
             probatabel:EvalAlgoritmiV.punctat(UrmarireDecizie.tipuri['tabel-urmarire'],'tabel'),
             probaalege:EvalAlgoritmiV.punctat(EvalAlgoritmiV.alegere,'alege')}

   TIPUL „scrie” — elevul alcătuiește algoritmul din cartonașe, iar robotul îl face. Testele judecă REZULTATUL (regula 29):
   ce se afișează pe MAI MULTE seturi de date, deci orice algoritm care dă rezultatele cerute e primit (condiția scrisă pe
   dos, cu ramurile schimbate; „Afișează” în fiecare ramură sau sub decizie; două decizii una după alta), iar unul greșit
   nu trece doar pentru că a nimerit un set (_proba/enumerare.js le încearcă pe toate).
     {t:'scrie', q, cutii:[…], cazuri:[{intrari:{…}, asteapta:[…]}, …], alg:[P…] (pornirea), cartonase:[P…] (atingi unul → se pune
      la capătul algoritmului; se pot folosi de mai multe ori), teste:[…], sol:[P…], gresit:[P…], max?:14, ajutor, why}
     P = forma lui UrmarireDecizie: {citeste:'x'} · {pune:5,in:'x'} · {calc:'«a» − 5',in:'x'} · {afis:'x'} · {afisText:'…'} ·
         {daca:'«x» < 14',atunci:[P…],altfel:[P…]}. Cartonașul cu decizie aduce decizia cu ramurile goale.
     GESTURILE: ↑ ↓ ✕, ca la V/28. Un pas trece prin ramuri: ↑ de sub decizie îl duce la capătul ramurii „altfel”, încă ↑ în
     ramura „atunci”, încă ↑ deasupra deciziei (↓ la fel, invers). Pe rândul deciziei, ↑ ↓ mută decizia întreagă, iar ✕
     scoate decizia și lasă pașii ramurilor în algoritm. Decizie în decizie NU se poate (nepredată, V/29).
     TESTELE (t.ce = numele vizibil; t.puncte; t.paza = punctele doar împreună cu un test de lucru trecut; t.lectia; t.sfat):
       {k:'termina'}                  robotul face toți pașii, pe toate seturile;
       {k:'afis',cazuri:[i…],cuDecizie?:true}  pe seturile i se afișează exact `asteapta` (cuDecizie: cere și o decizie în algoritm);
       {k:'ordine',inainte:['x'…],de:'y'|'__afis'}  în algoritm, pașii care pun x stau deasupra pasului care pune y / care afișează.
     RUBRICA (1.1, B1 și A1): testele de mai jos se judecă pe robotul IERTAT (iertat(): intrările sunt deja în cutii, ce nu se
     poate face se sare), ca o scăpare să coste doar punctele ei; bifele = punctele. „Corect” rămâne verdictul robotului adevărat:
     cu un test 'rez' în Q.teste, judeca() dă toate testele bune dacă și numai dacă robotul face toate seturile (enumerare.js).
       {k:'citire'}                   fiecare dată de intrare e citită, înainte de a fi folosită;
       {k:'decizia'}                  o decizie cu cel puțin un pas într-o ramură;
       {k:'rez',cazuri:[i…],in?:'x'}  pe seturile i, cutia x (fără in: ce se afișează) are ce trebuie; se socotește doar dacă o decizie
                                      schimbă chiar rezultatul (conteaza()), altfel un algoritm fără decizie ar lua punctele ramurii lui;
       {k:'afisrez',in:'x'}           la sfârșit se afișează doar ce e în x, o singură dată.
     Robotul se oprește la un pas care folosește o cutie goală, cu mesajul lui V/28. „Se dau” se poate schimba: elevul își
     încearcă algoritmul pe ce date vrea (nu schimbă testele).

   PUNCTELE (punctat): la PRIMA verificare a fiecărei cerințe, în memorie; „Verifică” pe simulatorul neatins nu socotește nimic și
   lasă bifele închise; sub jumătate din lucru, „Verifică” întreabă o dată. Testele și indiciul sunt ascunse până la prima verificare.
   Elevul lent (1.1): panoul are „Nu termini?” (treci la cerința următoare, sari la oricare, nota pe ce ai lucrat, cu 0 p la cerințele
   neverificate); proba rămâne în memorie, deci data viitoare sare la cerința lui și adună punctele din caiet.
     - fel 'scrie': Q.teste;
     - fel 'date' (date-rol, o problemă): Q.puncte={coloana:p,valoare:p} — pe fiecare dată; valoarea se judecă oriunde există casetă,
       iar în coloana fără casetă („Ce se dă”) nu se pierde a doua oară (pază); o valoare scrisă se judecă și față
       de ce a aflat elevul pe parcurs: d.din=(v)=>… (o scăpare se pedepsește o singură dată);
     - fel 'urmarire' (tabelul V/28): Q.puncte={citire:p,calcule:[p…],duse:p,afis:p}; fiecare rând se judecă și față de rândul
       ELEVULUI de deasupra; `duse` (valorile neschimbate) e pază: doar împreună cu un rând bun;
     - fel 'tabel' (tabelul V/29, un set): Q.puncte={citire:p,calcule:p,conditie:p,traseu:p,afis:p}; condiția, calculul și afișarea
       se judecă pe valorile ELEVULUI, iar traseul pe condiția LUI (sau pe cea bună); o greșeală costă doar punctele ei;
       ultimul rând uitat costă doar afișarea (traseul de până atunci e bun);
     - fel 'alege': Q.ce, punctele cerinței, pe prima variantă verificată.

   REGULILE: SISTEM_EVALUARE.md §4; REGULA_NOUA.md; ghidul IV.2 §6-7. C 40 + B 30 + A 20 + 10 din oficiu; nota = punctaj : 10, la clasa
   a V-a „după ultima cifră” (lecția 1, pasul „Lucrarea: trei părți și nota ta”). Cerințele și punctele pe cerințe sunt ale PAGINII.
   Nimic nu se scrie în localStorage sau pe server. Singura urmă: semnul fără date, sessionStorage 'eav_proba_golita', ca panoul
   să spună, la redeschidere, că proba s-a golit. Proba se golește la „Sunt alt elev / Încep din nou” și la schimbarea elevului.
   Global: window.EvalAlgoritmiV {versiune, configureaza, scrie, alegere, punctat, testeAscunse, nota, nivel, stare, goleste, executa, _intern}.
   Probele: lectii/v/m5-l30/_proba/ (ultima linie 0).
   ====================================================================================================== */
(function(){
'use strict';
const VERSIUNE='1.2 (09.11.2026)';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nota=p=>Math.min(10,Math.max(1,Math.floor((p+5)/10)));
const nivel=n=>n>=9?'Avansat':n>=7?'Consolidat':n>=5?'De bază':n>=3?'În formare':'În dificultate';
const UD=()=>window.UrmarireDecizie;

/* ===================================== stilul ===================================== */
const CSS=`.ea{--ea-ok:var(--ok,#1E7A46);--ea-bad:var(--bad,#B8362E)}
.ea-sec{border:1px solid var(--line);border-radius:8px;background:var(--paper2);padding:8px 10px;margin:8px 0}
.ea-sec>b{font-family:var(--fd,inherit);font-weight:600}
.ea .hint{font-size:.88rem;color:var(--ink2)}
.ea-date{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin-top:4px}
.ea-date label{display:inline-flex;gap:4px;align-items:center}
.ea-date input{width:4.4em;min-height:36px;padding:2px 6px;font:inherit;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.ea-rl{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:3px}
.ea-r{display:flex;gap:6px;align-items:center;background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:3px 6px;min-height:40px}
.ea-r.n1{margin-left:16px;border-left:3px solid var(--accent)}
.ea-r.daca .ea-tx,.ea-r.altfel .ea-tx{font-weight:700}
.ea-r.altfel,.ea-r.gol{min-height:30px;border-style:dashed;background:transparent}
.ea-r.gol{color:var(--ink2);font-style:italic;font-size:.9rem}
.ea-r.facut{background:var(--okbg,#E0F2E6)}
.ea-r.stop{background:var(--badbg,#FAE4E2);border-color:var(--ea-bad)}
.ea-nr{flex:none;min-width:1.5em;font-family:var(--fm,monospace);font-size:.88rem;color:var(--ink2)}
.ea-tx{flex:1 1 auto;min-width:0;font-family:var(--fm,monospace);font-size:.86rem;line-height:1.35;overflow-wrap:anywhere}
.ea-bt{flex:none;display:flex;gap:2px}
.ea-bt button{min-width:34px;min-height:36px;padding:0 4px;border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);font:inherit;cursor:pointer}
.ea-bt button:disabled{opacity:.35;cursor:default}
.ea-carts{display:grid;gap:5px;margin-top:6px}
@media (max-width:480px){.ea-r{flex-wrap:wrap}.ea-tx{flex:1 1 calc(100% - 2.4em)}.ea-bt{margin-left:auto}}
.ea-cart{min-height:40px;padding:5px 8px;text-align:left;border:1px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--ink);font-family:var(--fm,monospace);font-size:.86rem;line-height:1.3;cursor:pointer}
.ea-cmd{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 4px}
.ea-cmd button{min-height:40px;padding:6px 12px;border:1px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-weight:600;cursor:pointer}
.ea-rez{margin:4px 0;min-height:1.3em}
.ea-rez.rau{color:var(--ea-bad)}
.ea-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.ea-teste li{display:flex;gap:6px;font-size:.93rem;line-height:1.35}
.ea-teste li .s{flex:none;width:1.3em;text-align:center;font-weight:800}
.ea-teste li.ok .s{color:var(--ea-ok)}.ea-teste li.rau .s{color:var(--ea-bad)}
.ea-teste li .m{display:block;font-size:.88rem;color:var(--ea-bad)}
.ea-panou{border:2px dashed var(--accent);border-radius:8px;padding:8px 12px;margin:6px 0 10px;background:var(--paper2);text-align:left}
.ea-panou p{margin:.3em 0}
.ea-cap{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;justify-content:space-between}
.ea-et{font-weight:700;color:var(--accent)}
.ea-panou ul{margin:.3em 0 .3em 1.2em;padding:0}
.ea-panou li{margin:.25em 0}
.ea-panou a,.ea-puncte a{color:var(--accent);display:inline-block;padding:6px 0}
.ea-nota{border-left:4px solid var(--accent);padding:4px 8px;margin:6px 0;background:var(--paper)}
.ea-panou table{border-collapse:collapse;margin:.3em 0;max-width:100%}
.ea-panou td,.ea-panou th{border:1px solid var(--line);padding:3px 8px;text-align:left}
.ea-panou details summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-weight:600}
.ea-puncte{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:6px 10px;margin:8px 0;background:var(--paper);text-align:left}
.ea-puncte p{margin:.25em 0}
.ea-puncte ul{list-style:none;margin:.3em 0;padding:0}
.ea-puncte li{margin:.3em 0}
.ea-puncte .rau{color:var(--ea-bad)}
.ea-puncte .bun{color:var(--ea-ok)}
.ea-opts{display:grid;gap:8px;margin:6px 0}
.ea-opts .opt{min-height:44px;text-align:left}
#body.ea-ascuns .ea-teste,#body.ea-ascuns .cv>.cv-lbl,#body.ea-ascuns .cv-teste,#body.ea-ascuns .sec-teste,#body.ea-ascuns .ud-card>.ud-lbl,#body.ea-ascuns .ud-teste{display:none}
.ea-panou .ea-lent summary{display:inline-flex;gap:6px;padding:2px 10px;border:1px solid var(--accent);border-radius:8px;color:var(--accent);list-style:none}
.ea-lent summary::-webkit-details-marker{display:none}
.ea-lent summary::before{content:'▸'}
.ea-lent[open] summary::before{content:'▾'}
.ea-lent p{margin:.45em 0}
.ea-lent .btn,.ea-urm{min-height:36px}
.ea-sari{min-width:44px;margin:0 2px 4px 0}`;
function css(){if(!document.getElementById('ea-css')){const s=document.createElement('style');s.id='ea-css';s.textContent=CSS;document.head.appendChild(s)}}

/* ===================================== robotul ===================================== */
const NUME=e=>{const r=[];String(e).replace(/«([^»]+)»/g,(_,x)=>{r.push(x);return ''});return r};
const clona=L=>L.map(P=>P.daca!=null?{daca:P.daca,atunci:clona(P.atunci||[]),altfel:clona(P.altfel||[])}:Object.assign({},P));
const egalA=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
function numere(alg){const M=new Map();let n=0;const u=L=>L.forEach(P=>{M.set(P,++n);if(P.daca!=null){u(P.atunci);u(P.altfel)}});u(alg);return M}
const dePus=P=>P.citeste!=null?P.citeste:(P.pune!=null||P.calc!=null)?P.in:null;
const dupaEaLista=alg=>{const o=[];const u=L=>L.forEach(P=>{o.push(P);if(P.daca!=null){u(P.atunci);u(P.altfel)}});u(alg);return o};
const areDecizie=alg=>alg.some(P=>P.daca!=null);
/* robotul face pașii de sus în jos; la decizie, doar ramura aleasă; se oprește la un pas care folosește o cutie goală */
function executa(alg,intrari,cutii){
  const c={};(cutii||[]).forEach(x=>{c[x]=null});
  const M=numere(alg),toti=dupaEaLista(alg),traseu=[],afisari=[];let oprit=null;
  const opreste=(P,x,ce)=>{const n=M.get(P);const j=toti.findIndex(q=>dePus(q)===x);
    oprit={pas:n,mesaj:`Robotul s-a oprit la pasul ${n}: cutia «${x}» e goală, deci ${ce}. Niciun pas de mai sus n-a pus ceva în ea.${j>=0&&M.get(toti[j])>n?` O umple abia pasul ${M.get(toti[j])}.`:''}`}};
  const val=e=>window.EvaluareExpresii.valoare({e,cutii:c});
  const pas=P=>{ if(oprit)return;
    if(P.citeste!=null){if(!(P.citeste in intrari)){oprit={pas:M.get(P),mesaj:`Robotul s-a oprit la pasul ${M.get(P)}: nu are de unde citi «${P.citeste}».`};return}c[P.citeste]=intrari[P.citeste];traseu.push(M.get(P))}
    else if(P.pune!=null){c[P.in]=P.pune;traseu.push(M.get(P))}
    else if(P.calc!=null){const g=NUME(P.calc).find(x=>c[x]==null);if(g!==undefined){opreste(P,g,'nu poate calcula');return}c[P.in]=val(P.calc);traseu.push(M.get(P))}
    else if(P.afis!=null){if(c[P.afis]==null){opreste(P,P.afis,'nu are ce să afișeze');return}afisari.push(c[P.afis]);traseu.push(M.get(P))}
    else if(P.afisText!=null){afisari.push(P.afisText);traseu.push(M.get(P))}
    else if(P.daca!=null){const g=NUME(P.daca).find(x=>c[x]==null);if(g!==undefined){opreste(P,g,'nu poate socoti condiția');return}
      const v=!!val(P.daca);traseu.push(M.get(P));(v?P.atunci:P.altfel).forEach(pas)}
  };
  alg.forEach(pas);
  return {ok:!oprit,oprit,traseu,afisari,cutii:c};
}
/* robotul IERTAT, doar pentru puncte (1.1): intrările sunt deja în cutii, iar ce nu se poate face se sare, ca o scăpare să coste
   doar punctele ei („Citește” uitat, „Afișează” prea sus). rau = prima intrare folosită înainte de citire. faraRamuri: decizia nu face nimic. */
function iertat(alg,intrari,cutii,faraRamuri){
  const c={};(cutii||[]).forEach(x=>{c[x]=null});Object.assign(c,intrari);
  const citit={},af=[];let rau=null;
  const val=e=>window.EvaluareExpresii.valoare({e,cutii:c});
  const cere=e=>NUME(e).forEach(x=>{if(rau==null&&x in intrari&&!citit[x])rau=x});
  const poate=e=>NUME(e).every(x=>c[x]!=null);
  const pas=P=>{
    if(P.citeste!=null)citit[P.citeste]=true;
    else if(P.pune!=null)c[P.in]=P.pune;
    else if(P.calc!=null){cere(P.calc);if(poate(P.calc))c[P.in]=val(P.calc)}
    else if(P.afis!=null){cere('«'+P.afis+'»');if(c[P.afis]!=null)af.push(c[P.afis])}
    else if(P.afisText!=null)af.push(P.afisText);
    else if(P.daca!=null){cere(P.daca);if(!faraRamuri&&poate(P.daca))(val(P.daca)?P.atunci:P.altfel).forEach(pas)}
  };
  alg.forEach(pas);
  return {c,af,citit,rau};
}
const rezIertat=(r,ce)=>ce?r.c[ce]:JSON.stringify(r.af);
/* o decizie schimbă chiar rezultatul, pe măcar un set: fără ea, un algoritm cu un singur calcul ar lua punctele unei ramuri.
   1.2 (J2): rezultatul depinde de datele din condiția ei; altfel și o decizie care nu decide lua punctele (același „mereu −12”: 6 p sub decizie, 12 în ambele ramuri) */
/* R = rezultatele unei verificări: aceeași rulare nu se face de două ori (oracolele judecă sute de mii de programe) */
const iertatR=(R,Q,alg,c,fara)=>{const m=R._ier||(R._ier=new Map());let e=m.get(c);if(!e){e={};m.set(c,e)}const k=fara?'f':'b';return e[k]||(e[k]=iertat(alg,c.intrari,Q.cutii,fara))};
const conteaza=(Q,alg,ce)=>{if(!areDecizie(alg))return false;const din=[];dupaEaLista(alg).forEach(P=>{if(P.daca!=null)NUME(P.daca).forEach(x=>{if(!din.includes(x))din.push(x)})});const baza=Q.cazuri[0].intrari,rez=x=>{const i=Object.assign({},baza);din.forEach(n=>{if(n in x.intrari)i[n]=x.intrari[n]});return rezIertat(iertat(alg,i,Q.cutii),ce)};const r0=rez(Q.cazuri[0]);return Q.cazuri.some(x=>rez(x)!==r0)};

/* ===================================== mutările ===================================== */
function gaseste(alg,id){
  for(let i=0;i<alg.length;i++){const P=alg[i];if(P._id===id)return{P,L:alg,i,d:null,cine:null};
    if(P.daca!=null)for(const cine of ['atunci','altfel']){const j=P[cine].findIndex(x=>x._id===id);if(j>=0)return{P:P[cine][j],L:P[cine],i:j,d:P,cine}}}
  return null;
}
function muta(alg,id,dir){
  const g=gaseste(alg,id);if(!g)return false;const {P,L,i,d,cine}=g;
  const schimba=j=>{[L[i],L[j]]=[L[j],L[i]];return true};
  if(P.daca!=null){const j=i+dir;return j>=0&&j<alg.length?schimba(j):false}
  if(dir<0){
    if(i>0&&!(L===alg&&alg[i-1].daca!=null))return schimba(i-1);
    if(L===alg){if(i===0)return false;const prev=alg[i-1];alg.splice(i,1);prev.altfel.push(P);return true}
    L.splice(i,1);
    if(cine==='altfel')d.atunci.push(P);else alg.splice(alg.indexOf(d),0,P);
    return true;
  }
  if(i<L.length-1&&!(L===alg&&alg[i+1].daca!=null))return schimba(i+1);
  if(L===alg){if(i===L.length-1)return false;const urm=alg[i+1];alg.splice(i,1);urm.atunci.unshift(P);return true}
  L.splice(i,1);
  if(cine==='atunci')d.altfel.unshift(P);else alg.splice(alg.indexOf(d)+1,0,P);
  return true;
}
function scoate(alg,id){
  const g=gaseste(alg,id);if(!g)return false;
  if(g.P.daca!=null)alg.splice(g.i,1,...g.P.atunci,...g.P.altfel);else g.L.splice(g.i,1);
  return true;
}

/* ===================================== testele tipului „scrie” ===================================== */
const datele=x=>Object.keys(x).map(k=>`${x[k]} pentru «${k}»`).join(' și ');
const listaAf=a=>a.length?a.map(v=>typeof v==='string'?`„${v}”`:v).join(', '):'nimic';
function testeaza(t,Q,alg,R){
  if(t.k==='termina'){const k=R.findIndex(r=>!r.ok);return k<0?{ok:!!alg.length}:{ok:false,m:`Cu ${datele(Q.cazuri[k].intrari)}: ${R[k].oprit.mesaj}`}}
  if(t.k==='afis'){
    if(t.cuDecizie&&!areDecizie(alg))return{ok:false,m:'Algoritmul n-are încă o decizie: aici răspunsul depinde de date. Adu cartonașul care începe cu „Dacă” și pune pașii în ramurile lui.'};
    for(const i of t.cazuri){const c=Q.cazuri[i],r=R[i];
      if(!r.ok)return{ok:false,m:`Cu ${datele(c.intrari)}: ${r.oprit.mesaj}`};
      if(!egalA(r.afisari,c.asteapta))return{ok:false,m:`Cu ${datele(c.intrari)}, traseul tău e ${r.traseu.join(', ')} și se afișează ${listaAf(r.afisari)}; trebuie să se afișeze ${listaAf(c.asteapta)}.${t.sfat?' '+t.sfat:''}`}}
    return{ok:true};
  }
  if(t.k==='ordine'){
    const L=dupaEaLista(alg),loc=x=>x==='__afis'?L.findIndex(P=>P.afis!=null||P.afisText!=null):L.findIndex(P=>dePus(P)===x);
    const de=loc(t.de),ok=de>=0&&t.inainte.every(x=>{const j=loc(x);return j>=0&&j<de});
    return{ok,m:t.m||''};
  }
  if(t.k==='citire'){
    for(const c of Q.cazuri){const r=iertatR(R,Q,alg,c),x=r.rau!=null?r.rau:Object.keys(c.intrari).find(k=>!r.citit[k]);
      if(x!=null)return{ok:false,m:`Cu ${datele(c.intrari)}, robotul ${r.rau!=null?`folosește cutia «${x}» înainte s-o citească`:`nu citește cutia «${x}»`}. Pasul „Citește «${x}».” stă deasupra pasului care o folosește.`}}
    return{ok:!!alg.length};
  }
  if(t.k==='decizia')return alg.some(P=>P.daca!=null&&(P.atunci.length||P.altfel.length))?{ok:true}:{ok:false,m:'Algoritmul n-are încă o decizie cu pași în ramuri: aici răspunsul depinde de date. Adu cartonașul care începe cu „Dacă” și du pașii în ramurile lui, cu ↑.'};
  if(t.k==='rez'){
    const cc=R._cont||(R._cont={}),ck=t.in||'';if(!(ck in cc))cc[ck]=conteaza(Q,alg,t.in,R);
    if(!cc[ck])return{ok:false,m:areDecizie(alg)?'Testul acesta se socotește când o decizie schimbă chiar rezultatul. Acum decizia nu schimbă nimic: uită-te la condiție și la pașii din ramuri.':'Testul acesta se socotește când o decizie schimbă chiar rezultatul: pune pașii care diferă în ramurile ei.'};
    for(const i of t.cazuri){const c=Q.cazuri[i],r=iertatR(R,Q,alg,c);
      if(t.in){const v=r.c[t.in];if(v!==c.asteapta[0])return{ok:false,m:`Cu ${datele(c.intrari)}, în cutia «${t.in}» ar ajunge ${v==null?'nimic':v}; trebuie să ajungă ${c.asteapta[0]}.${t.sfat?' '+t.sfat:''}`}}
      else if(!egalA(r.af,c.asteapta))return{ok:false,m:`Cu ${datele(c.intrari)}, s-ar afișa ${listaAf(r.af)}; trebuie să se afișeze ${listaAf(c.asteapta)}.${t.sfat?' '+t.sfat:''}`}}
    return{ok:true};
  }
  if(t.k==='afisrez'){
    let unul=false;
    for(const c of Q.cazuri){const r=iertatR(R,Q,alg,c),v=r.c[t.in];if(v==null)continue;unul=true;
      if(!egalA(r.af,[v]))return{ok:false,m:`Cu ${datele(c.intrari)}, s-ar afișa ${listaAf(r.af)}; trebuie să se afișeze doar ce e în cutia «${t.in}», o singură dată. Pasul „Afișează «${t.in}».” stă sub pașii care pun ceva în «${t.in}».`}}
    return unul?{ok:true}:{ok:false,m:`Niciun pas nu pune încă ceva în cutia «${t.in}»: robotul n-are ce să afișeze.`};
  }
  return{ok:false,m:'Test necunoscut.'};
}
/* „Corect” = robotul adevărat face toate seturile. Cu rubrică (test 'rez'): robotul adevărat bun ⇒ toate testele bune; toate bune ⇒ robotul adevărat bun (plasa; enumerare.js numără 0 abateri). */
const judeca=(Q,alg)=>{const R=Q.cazuri.map(c=>executa(alg,c.intrari,Q.cutii)),T=Q.teste.map(t=>testeaza(t,Q,alg,R));
  if(Q.teste.some(t=>t.k==='rez')){const bun=Q.cazuri.every((c,i)=>R[i].ok&&egalA(R[i].afisari,c.asteapta));
    if(bun)T.forEach(x=>{x.ok=true;x.m=''});
    else if(T.every(x=>x.ok))T[T.length-1]={ok:false,m:'Pornește robotul: nu face încă toți pașii pe toate datele.'}}
  return T};

/* ===================================== tipul „scrie” ===================================== */
/* Motorul refolosește #body între „Încă un exercițiu”. urmarire-decizie.js (V/29) și cutii-variabile.js (V/26) își lasă ascultătorii pe #body până la
   următoarea lor desenare: un clic în alt exercițiu ar redesena tabelul lor peste el (găsit la B2 → A1, _proba/parcurge.py). Îi scot aici, prin mânerele lor. */
function curataStrain(body){
  [['_udClick','click'],['_udKey','keydown'],['_cvClick','click'],['_cvInput','input'],['_cvKey','keydown']].forEach(([k,ev])=>{
    if(body[k]){body.removeEventListener(ev,body[k]);body[k]=null}});
  body._ud=null;body._cvd=null;
}
let urmId=1;
const cuId=L=>{L.forEach(P=>{P._id=urmId++;if(P.daca!=null){cuId(P.atunci);cuId(P.altfel)}});return L};
const faraId=L=>JSON.stringify(L,(k,v)=>k==='_id'?undefined:v);
function textP(P){return UD().textPas(P)}
function porneste(Q,body,api,start){
  css();curataStrain(body);
  const S={alg:cuId(clona(start||[])),rap:null,verificat:false};
  body._ea=S;S.Q=Q;
  const cart=Q.cartonase||[],max=Q.max||14,sterge=cart.length>0;
  const dateStart=Q.cazuri[0].intrari,cheie=Object.keys(dateStart);
  body.innerHTML=`<div class="ea">
  <div class="ea-sec"><b>Se dau</b> <span class="hint">(le poți schimba)</span><div class="ea-date">${cheie.map((k,i)=>`<label>«${esc(k)}» <input type="text" inputmode="numeric" autocomplete="off" data-in="${i}" value="${esc(dateStart[k])}" aria-label="Valoarea pentru ${esc(k)}"></label>`).join('')}</div></div>
  <div class="ea-sec ea-alg"><b>Algoritmul</b><ol class="ea-rl"></ol></div>
  ${cart.length?`<div class="ea-sec ea-pal"><b>Cartonașele</b> <span class="hint">· atinge unul: se pune la capăt</span><div class="ea-carts">${cart.map((c,k)=>`<button type="button" class="ea-cart" data-c="${k}">${esc(textP(c))}</button>`).join('')}</div></div>`:''}
  <div class="ea-cmd"><button type="button" class="ea-run">▶ Pornește robotul</button><button type="button" class="ea-capat">Ia-o de la capăt</button></div>
  <p class="ea-rez" aria-live="polite"></p>
  <div class="ea-sec ea-teste" hidden><b>Testele</b><ol></ol></div></div>`;
  const $=s=>body.querySelector(s);
  const rez=(h,rau)=>{const p=$('.ea-rez');p.innerHTML=h||'';p.classList.toggle('rau',!!rau)};
  function scrieAlg(foc){
    const M=numere(S.alg),rows=[];
    const rand=(P,nv,sus,jos)=>{const n=M.get(P),fac=S.rap&&S.rap.traseu.includes(n),st=S.rap&&S.rap.oprit&&S.rap.oprit.pas===n;
      rows.push(`<li class="ea-r n${nv}${P.daca!=null?' daca':''}${fac?' facut':''}${st?' stop':''}" data-id="${P._id}"><span class="ea-nr">${n}.</span><span class="ea-tx">${esc(textP(P))}</span><span class="ea-bt"><button type="button" data-a="sus" aria-label="Mută pasul ${n} mai sus"${sus?'':' disabled'}>↑</button><button type="button" data-a="jos" aria-label="Mută pasul ${n} mai jos"${jos?'':' disabled'}>↓</button>${sterge?`<button type="button" data-a="sterge" aria-label="Scoate pasul ${n}">✕</button>`:''}</span></li>`)};
    const gol=()=>rows.push('<li class="ea-r n1 gol"><span class="ea-tx">niciun pas încă în ramura asta</span></li>');
    S.alg.forEach((P,i)=>{
      const sus=i>0,jos=i<S.alg.length-1;
      rand(P,0,sus,jos);
      if(P.daca!=null){
        if(P.atunci.length)P.atunci.forEach(x=>rand(x,1,true,true));else gol();
        rows.push('<li class="ea-r altfel"><span class="ea-nr"></span><span class="ea-tx">altfel</span></li>');
        if(P.altfel.length)P.altfel.forEach(x=>rand(x,1,true,true));else gol();
      }
    });
    $('.ea-rl').innerHTML=rows.join('')||`<li class="ea-r gol"><span class="ea-tx">Niciun pas încă.${cart.length?' Atinge cartonașele de mai jos.':''}</span></li>`;
    if(foc){const el=body.querySelector(foc);if(el&&!el.disabled)el.focus({preventScroll:true})}
  }
  function scrieTeste(T){
    $('.ea-teste').hidden=!T;   /* 1.1: testele apar la prima verificare (mai puțin de citit; numele lor nu sunt indicii) */
    $('.ea-teste ol').innerHTML=Q.teste.map((t,k)=>{const r=T&&T[k];
      return `<li class="${r?(r.ok?'ok':'rau'):''}"><span class="s">${r?(r.ok?'✓':'✗'):'○'}</span><span>${k+1}. ${t.ce}${r&&!r.ok&&r.m?`<span class="m">${r.m}</span>`:''}</span></li>`}).join('');
  }
  const proaspat=()=>{S.rap=null;if(S.verificat&&!api.done()){const fb=document.getElementById('fb');if(fb)fb.innerHTML=''}scrieTeste(S.verificat?judeca(Q,S.alg):null)};
  function citesteDate(){
    const o={};let rau=null;
    body.querySelectorAll('.ea-date input').forEach((inp,i)=>{const k=cheie[i],t=inp.value.trim();
      const r=window.CutiiVariabile?window.CutiiVariabile.numar(t):{ok:/^\d+$/.test(t),v:+t};
      if(!t||!r.ok){if(!rau)rau=k}else o[k]=r.v});
    return{o,rau};
  }
  function porneste1(){
    if(!S.alg.length){rez('Algoritmul n-are niciun pas: robotul n-are ce face.',true);return}
    const d=citesteDate();
    if(d.rau!=null){rez(`La «${esc(d.rau)}», sus, scrie un număr, doar cu cifre.`,true);return}
    S.rap=executa(S.alg,d.o,Q.cutii);scrieAlg();
    if(S.rap.ok)rez(`Traseul: ${S.rap.traseu.join(', ')}. Se afișează: ${esc(listaAf(S.rap.afisari))}.`);
    else rez(esc(S.rap.oprit.mesaj),true);
  }
  body.querySelector('.ea').addEventListener('click',e=>{
    const t=e.target;
    if(t.closest('.ea-run')){porneste1();return}
    /* 1.1: după „Corect”, „Ia-o de la capăt” chiar reia (motorul redeschide exercițiul, ca la V/26 și V/28) */
    if(api.done()&&!t.closest('.ea-capat')){if(t.closest('.ea-bt button,.ea-cart'))rez('Exercițiul e încheiat, de aceea nu se mai schimbă nimic. Îl mai faci o dată cu „Ia-o de la capăt”, sau mergi mai departe.');return}
    if(t.closest('.ea-capat')){S.alg=cuId(clona(Q.alg||[]));S.rap=null;S.verificat=false;scrieAlg();scrieTeste(null);rez('Algoritmul e ca la început.'+(Q.proba&&ST.prima[Q.proba]?' Punctele rămân cele de la prima verificare: acum doar exersezi.':''));return}
    const b=t.closest('.ea-bt button');
    if(b){const li=b.closest('li'),id=+li.dataset.id,a=b.dataset.a;
      if(a==='sterge'){scoate(S.alg,id);proaspat();rez('');scrieAlg(S.alg.length?'.ea-bt [data-a="sterge"]':'.ea-cart');return}
      if(muta(S.alg,id,a==='sus'?-1:1)){proaspat();rez('');scrieAlg(`li[data-id="${id}"] [data-a="${a}"]`)}
      return}
    const c=t.closest('.ea-cart');
    if(c){
      if(dupaEaLista(S.alg).length>=max){rez(`Algoritmul are deja ${max} pași: scoate unul (✕) ca să pui altul.`,true);return}
      const P=clona([cart[+c.dataset.c]])[0];cuId([P]);S.alg.push(P);proaspat();
      rez(P.daca!=null?'Ai pus decizia, cu ramurile goale. Pune pașii cartonașelor, apoi du-i în ramuri cu ↑.':'Ai pus pasul la capătul algoritmului.');scrieAlg();
    }
  });
  body.querySelector('.ea').addEventListener('input',e=>{if(e.target.matches('.ea-date input')){S.rap=null;scrieAlg();rez('')}});
  /* Enter într-o casetă cu date pornește robotul, nu „Verifică” (ca să nu consume prima verificare) */
  body.querySelector('.ea').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.ea-date input')){e.preventDefault();porneste1()}});
  const verifica=()=>{
    S.verificat=true;S.rap=null;scrieAlg();
    if(!S.alg.length){scrieTeste(judeca(Q,S.alg));api.resolve(false,'Algoritmul n-are niciun pas încă.'+(cart.length?' Atinge cartonașele, în ordinea în care vrei să le facă robotul.':''));return}
    const T=judeca(Q,S.alg),k=T.findIndex(x=>!x.ok);scrieTeste(T);
    const bune=T.filter(x=>x.ok).length;
    if(k<0){api.nav().innerHTML='';api.resolve(true);
      setTimeout(()=>{const bb=['inca','pas-next','go','next'].map(i=>document.getElementById(i)).find(e=>e&&e.offsetParent!==null&&!e.disabled);if(bb)bb.focus({preventScroll:true})},0);return}
    api.resolve(false,`${bune} din ${T.length} teste trec. ${T[k].m||''}`);
    api.revealButton(()=>{S.alg=cuId(clona(Q.sol||[]));S.rap=null;scrieAlg();scrieTeste(judeca(Q,S.alg));api.nav().innerHTML='';
      api.giveUp(Q.solutieText||'algoritmul de mai sus face toate testele. Pornește robotul și uită-te la traseu.')});
  };
  S.draw=scrieAlg;S.ascunde=()=>scrieTeste(null);
  scrieAlg();scrieTeste(null);rez('');
  api.checkButton(verifica);
  return S;
}
const scrie={
  render(Q,body,api){porneste(Q,body,api,Q.alg)},
  rezolva(Q,body,api){porneste(Q,body,api,Q.sol)},
  gresit(Q,body,api){porneste(Q,body,api,Q.gresit||Q.alg)}
};

/* ===================================== alegerea (explicația de la partea A) ===================================== */
const alegere={
  render(Q,body,api){
    css();
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.innerHTML=`<div class="ea-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
    const bs=[...body.querySelectorAll('.opt')];
    const des=()=>bs.forEach(b=>{const on=+b.dataset.k===ales;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
    bs.forEach(b=>b.onclick=()=>{if(api.done())return;ales=+b.dataset.k;bs.forEach(x=>x.classList.remove('bad'));des()});
    const arataBun=()=>{bs.forEach(x=>x.disabled=true);const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.classList.add('ok')};
    const nav=api.checkButton(()=>{
      if(ales===null){api.feedback('bad','<strong>Alege întâi o variantă.</strong> Apoi apasă „Verifică”.');return}
      if(ales===Q.ok){arataBun();nav.innerHTML='';api.resolve(true)}
      else{const b=body.querySelector(`.opt[data-k="${ales}"]`);if(b)b.classList.add('bad');
        api.resolve(false,(Q.mesaje&&Q.mesaje[ales])||'Varianta aleasă nu e cea bună.');
        api.revealButton(()=>{ales=Q.ok;des();arataBun();nav.innerHTML='';api.giveUp(Q.html?Q.o[Q.ok]:esc(Q.o[Q.ok]))})}
    });
    body._eaAlege={pune:k=>{ales=k;des()}};
  },
  rezolva(Q,body){if(!body._eaAlege)return false;body._eaAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._eaAlege)return false;body._eaAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

/* ===================================== citirea numerelor scrise ===================================== */
const fara=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const eGol=t=>/^(-|–|—|- -|gol|goala|e goala|cutia e goala|nimic|nimic inca|nu are)$/.test(fara(t).trim());
function citNr(s){
  const t=String(s==null?'':s).trim();
  if(!t||eGol(t))return null;
  const r=window.CutiiVariabile?window.CutiiVariabile.numar(t):{ok:/^\d+$/.test(t),v:+t};
  return r.ok?r.v:NaN;
}

/* ===================================== punctele, pe fiecare fel de cerință ===================================== */
/* date-rol, o problemă: fiecare dată în coloana ei + valorile aflate (și față de ce a aflat elevul pe parcurs) */
function scorDate(Q,body){
  const st=body._cvd.st,P=Q.probleme[0],loc=st.loc[0],val=st.val[0],pc=Q.puncte||{coloana:1,valoare:1},r=[];
  P.date.forEach((d,i)=>{r.push({ce:`«${d.t}» e în coloana ei`,puncte:pc.coloana,ok:loc[i]===d.rol})});
  /* 1.1: caseta valorii există în „Ce se cere” și „Pe parcurs”: numărul se judecă oriunde e casetă. În „Ce se dă” nu există casetă:
     scăparea s-a plătit deja la coloană, deci nu se plătește a doua oară (pază: doar împreună cu un lucru făcut; 1.2: și doar dacă alt număr e scris, altfel „n-am aflat nimic” lua 2 p de numere) */
  const scris=i=>(loc[i]==='cere'||loc[i]==='parcurs')?citNr(val[i]):null;
  P.date.forEach((d,i)=>{if(d.val==null)return;
    const ce=`Cât e «${d.t}»: numărul bun`;
    if(loc[i]==='da'){const alta=P.date.some((x,j)=>j!==i&&x.val!=null&&(loc[j]==='cere'||loc[j]==='parcurs')&&Number.isFinite(citNr(val[j])));r.push({ce,puncte:pc.valoare,ok:alta,paza:true,motiv:alta?'în „Ce se dă” nu ai unde scrie un număr, deci scăparea se plătește o singură dată, la coloană':''});return}
    const v=scris(i);let ok=v===d.val;
    if(!ok&&typeof d.din==='function'){const p=P.date.findIndex(x=>x.rol==='parcurs'),o=p>=0?scris(p):null;
      if(o!=null&&!Number.isNaN(o)&&v===d.din(o))ok=true}
    r.push({ce,puncte:pc.valoare,ok})});
  return r;
}
/* tabelul V/28: fiecare rând, judecat și față de rândul ELEVULUI de deasupra */
function scorUrmarire(Q,body){
  const pc=Q.puncte,nume=Q.cutii,val=[];
  body.querySelectorAll('table.sec-tab input').forEach(i=>{(val[+i.dataset.r]=val[+i.dataset.r]||[])[+i.dataset.c]=i.value});
  const ev=(e,c)=>{try{if(NUME(e).some(x=>c[x]==null))return NaN;return window.EvaluareExpresii.valoare({e,cutii:c})}catch(x){return NaN}};
  const adev={},eu={};nume.forEach(c=>{adev[c]=null;eu[c]=null});
  let citire=true,duse=true,afis=true,bun=0;const calcule=[];
  Q.pasi.forEach((p,r)=>{
    const v=val[r]||[];
    const nou=p.f==='afiseaza'?null:p.c;
    let at=null,ae=null;
    if(p.f==='citeste'){at=ae=Q.intrari[p.c]}
    else if(p.f==='pune'){at=ae=p.v}
    else if(p.f==='calc'){at=ev(p.e,adev);ae=ev(p.e,eu)}
    nume.forEach((c,ci)=>{const s=citNr(v[ci]);
      if(c===nou){const ok=s===at||s===ae;
        if(p.f==='calc')calcule.push(ok);else if(!ok)citire=false;
        if(ok)bun++;
        adev[c]=at;if(s!=null&&!Number.isNaN(s))eu[c]=s;else eu[c]=ae;
      }else if(s!==eu[c]&&s!==adev[c])duse=false;
    });
    const sa=citNr(v[nume.length]);
    if(p.f==='afiseaza'){if(sa!==eu[p.c]&&sa!==adev[p.c])afis=false}
    else if(sa!=null)afis=false;
  });
  const r=[{ce:'Rândurile care citesc: în cutie intră valoarea dată la „Se dau”',puncte:pc.citire,ok:citire}];
  calcule.forEach((ok,i)=>r.push({ce:`Calculul ${i+1}: rezultatul pus în cutie`,puncte:pc.calcule[i]||0,ok}));
  r.push({ce:'Cutiile pe care pasul nu le schimbă păstrează valoarea de deasupra',puncte:pc.duse,ok:duse,paza:true});
  r.push({ce:'Coloana „Se afișează”',puncte:pc.afis,ok:afis,paza:true});
  return r;
}
/* tabelul V/29, un set: condiția, calculul și afișarea pe valorile ELEVULUI, traseul pe condiția LUI sau pe cea bună */
function drum(A,conds){
  const o=[],nr=UD().numeroteaza(A),nDe=new Map(nr.map(r=>[r.P,r.n]));
  const u=L=>L.forEach(P=>{o.push(nDe.get(P));if(P.daca!=null){const c=conds(nDe.get(P));u(c?(P.atunci||[]):(P.altfel||[]))}});
  u(A.pasi);return o;
}
function scorTabel(Q,body){
  const A=Q.alg,intr=Q.seturi[0].intrari,S=(body._ud.st.S[0]||[]).filter(s=>s.gata),pc=Q.puncte;
  const nr=UD().numeroteaza(A),pasDe=n=>{const r=nr.find(x=>x.n===n);return r?r.P:null};
  const ad=UD().ruleaza(A,intr),adRow=new Map(ad.randuri.map(r=>[r.n,r]));
  const eu={};(A.cutii||[]).forEach(c=>{eu[c]=null});
  const ev=e=>{try{if(NUME(e).some(x=>eu[x]==null))return NaN;return window.EvaluareExpresii.valoare({e,cutii:eu})}catch(x){return NaN}};
  const ct=UD()._intern.curatText;
  let citire=true,calcule=true,conditie=null,afis=null;const conds=new Map();
  S.forEach(s=>{const P=pasDe(s.n);if(!P)return;const T=adRow.get(s.n);
    if(P.citeste!=null){if(s.val!==intr[P.citeste])citire=false;eu[P.citeste]=s.val}
    else if(P.pune!=null){if(s.val!==P.pune)citire=false;eu[P.in]=s.val}
    else if(P.calc!=null){const e=ev(P.calc);if(s.val!==e&&!(T&&s.val===T.cutii[P.in]))calcule=false;eu[P.in]=s.val}
    else if(P.daca!=null){const e=!!ev(P.daca),ok=s.cond===e||(T&&s.cond===T.cond);conditie=conditie===null?ok:(conditie&&ok);conds.set(s.n,s.cond)}
    else if(P.afis!=null){const ok=s.afis===eu[P.afis]||(T&&s.afis===T.afis);afis=afis===null?ok:(afis&&ok)}
    else if(P.afisText!=null){const ok=ct(s.afis)===ct(P.afisText);afis=afis===null?ok:(afis&&ok)}
  });
  const facute=S.map(s=>s.n);
  const adv=n=>{const r=adRow.get(n);return r?r.cond:true};
  const cale1=drum(A,n=>conds.has(n)?conds.get(n):adv(n));
  /* 1.1: ultimul rând uitat costă doar afișarea (dubla penalizare de la 1.0: traseu + afișare = 7 din 15) */
  const faraUltim=L=>L.slice(0,-1);
  const traseu=egalA(facute,cale1)||egalA(facute,ad.traseu)||(facute.length>0&&(egalA(facute,faraUltim(ad.traseu))||egalA(facute,faraUltim(cale1))));
  /* ce lipsește din tabel nu e bun: citirile, calculele și afișările cerute trebuie să aibă rândul lor */
  const maiSunt=(f)=>ad.randuri.filter(r=>f(r.P)).every(r=>facute.includes(r.n));
  if(!maiSunt(P=>P.citeste!=null||P.pune!=null))citire=false;
  const calcSus=A.pasi.filter(P=>P.calc!=null);
  const nDe=new Map(nr.map(r=>[r.P,r.n]));
  if(!calcSus.every(P=>facute.includes(nDe.get(P))))calcule=false;
  const cale=egalA(facute,ad.traseu)?ad.traseu:cale1;
  const cereAfis=cale.filter(n=>{const P=pasDe(n);return P&&(P.afis!=null||P.afisText!=null)});
  if(!cereAfis.every(n=>facute.includes(n)))afis=false;
  return [{ce:'Ce intră în cutii când se citește',puncte:pc.citire,ok:citire},
    {ce:'Rezultatul calculului, pus în cutie',puncte:pc.calcule,ok:calcule},
    {ce:'Condiția: adevărat sau fals',puncte:pc.conditie,ok:conditie===true},
    {ce:'Pașii, în ordinea în care se fac',puncte:pc.traseu,ok:traseu},
    {ce:'Ce se afișează',puncte:pc.afis,ok:afis===true}];
}
function amprenta(body,fel){
  try{
    if(fel==='scrie')return 'S\u0001'+faraId(body._ea.alg);
    if(fel==='date')return 'D\u0001'+JSON.stringify([body._cvd.st.loc,body._cvd.st.val]);
    if(fel==='urmarire')return 'U\u0001'+[...body.querySelectorAll('table.sec-tab input')].map(e=>e.value).join('\u0002');
    if(fel==='tabel')return 'T\u0001'+JSON.stringify(body._ud.st.S);
  }catch(e){}
  return null;
}

/* ===================================== starea probei, panoul, rezumatul ===================================== */
let CFG=null,curent=null;
const ST={prima:{},nota:'',cine:null,cereNota:false};
const ids=()=>CFG?CFG.itemi.map(x=>x.id):[];
const item=id=>CFG&&CFG.itemi.find(x=>x.id===id);
const primul=()=>ids()[0];
const completa=()=>!!CFG&&ids().every(id=>ST.prima[id]);
const inceputa=()=>!!CFG&&ids().some(id=>ST.prima[id]);
const luate=id=>{const p=ST.prima[id];return p?Math.min(p.teste.reduce((s,t)=>s+(t.ok?t.puncte:0),0),item(id).puncte):0};
const SEMN='eav_proba_golita';
const cheieDe=x=>{try{return JSON.stringify(x||null)}catch(e){return 'null'}};
const cineE=()=>{try{return cheieDe(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}};
function goleste(n){ST.prima={};ST.nota=n||'';ST.cine=null;ST.cereNota=false;try{sessionStorage.removeItem(SEMN)}catch(e){}}
function configureaza(c){CFG=c;
  const s=Object.keys(c.parti).reduce((a,k)=>a+c.parti[k].max,0)+c.oficiu;
  if(s!==100)console.warn('eval-algoritmi-v: părțile + oficiul fac',s,'nu 100');
  Object.keys(c.parti).forEach(k=>{const t=c.itemi.filter(it=>it.parte===k).reduce((a,it)=>a+it.puncte,0);
    if(t!==c.parti[k].max)console.warn('eval-algoritmi-v: partea',k,'are cerințe de',t,'p, nu',c.parti[k].max)});
  try{if(sessionStorage.getItem(SEMN)){sessionStorage.removeItem(SEMN);
    ST.nota='Pagina a pornit din nou (după înscrierea în caseta de jos sau după o reîncărcare), iar proba de antrenament începută s-a golit: nimic nu se păstrează. Începe de la C1 sau, de la „Nu termini?”, sari la cerința ta.'}}catch(e){}
}
addEventListener('pagehide',e=>{try{if(inceputa()&&!(e&&e.persisted))sessionStorage.setItem(SEMN,'1')}catch(x){}});
const peEcran=()=>!!(curent&&curent.body&&document.body.contains(curent.body)&&document.querySelector('.ea-sus'));
function laInceput(n){
  goleste(n);
  if(!peEcran()){redeseneaza();return}
  let dus=false;
  try{if(window.JocMotor&&JocMotor.test&&typeof JocMotor.test.exercitiu==='function'){JocMotor.test.exercitiu(0);dus=true}}catch(e){dus=false}
  if(!dus||!peEcran()||curent.id!==primul())ST.nota=n+' Pagina nu te-a putut duce singură la prima cerință: apasă butonul Atelier, din bara de sus a lecției.';
  redeseneaza();
}
function schimbatElevul(k){
  if(!inceputa()||!ST.cine||k===ST.cine)return false;
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe din nou, de la '+primul()+'.');return true}
addEventListener('prezenta',e=>{schimbatElevul(cheieDe(e&&e.detail))});

function peParti(){const P={};Object.keys(CFG.parti).forEach(k=>{P[k]={luat:0,max:CFG.parti[k].max}});
  CFG.itemi.forEach(it=>{P[it.parte].luat+=luate(it.id)});return P}
const deP=t=>t<20?t+' puncte':t+' de puncte';
function pierdute(){const rate=[];ids().forEach(id=>{const p=ST.prima[id];if(!p)return;p.teste.forEach(t=>{if(!t.ok&&t.puncte)rate.push({id,ce:t.ce,puncte:t.puncte,lectia:t.lectia})})});return rate}
function rezumatHTML(){
  const P=peParti(),ord=['C','B','A'].filter(k=>P[k]);
  const tot=ord.reduce((s,k)=>s+P[k].luat,0)+CFG.oficiu,n=nota(tot),zeci=Math.floor(tot/10),u=tot%10;
  const gata=completa(),nev=ids().filter(x=>!ST.prima[x]);
  let h=`<p><b>${gata?'Rezumatul probei':'Nota pe ce ai lucrat'}</b></p>
<table><tr><th>Partea</th><th>Puncte</th></tr>${ord.map(k=>`<tr><td>${k} · ${esc(CFG.parti[k].nume)}</td><td>${P[k].luat} din ${P[k].max}</td></tr>`).join('')}<tr><td>din oficiu</td><td>${CFG.oficiu}</td></tr><tr><th>Punctajul</th><th>${tot} din 100</th></tr></table>
${gata?'':`<p>Ai verificat ${ids().length-nev.length} din ${ids().length} cerințe. Cerințele neverificate (${nev.map(esc).join(', ')}) au 0 p, ca la o lucrare predată neterminată. Dacă le faci acum, punctajul și nota de aici se refac.</p>`}
<p>Nota pe antrenament${gata?'':', dacă te oprești aici'}: ${deP(tot)} au ${zeci===1?'o zece':zeci+' zeci'}, iar ultima cifră e ${u}${u>=5?`, de la 5 la 9: nota ${zeci} + 1 = <b>${n}</b>`:`, sub 5: nota <b>${n}</b>`}.${gata?` Nivelul, după regula profesorului tău: <b>${nivel(n)}</b>. Cele cinci niveluri: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate.`:''}</p>
${gata?'':'<p>Ai în caiet puncte de data trecută? Adună-le la punctajul de aici și citește nota după aceeași regulă. Cele 10 din oficiu se pun o singură dată.</p>'}`;
  const rate=pierdute();
  if(rate.length){
    h+=`<details open><summary>Unde ai pierdut puncte și ce recitești</summary><ul>${rate.map(x=>`<li>${esc(x.id)} · ${x.ce} (${x.puncte} p)${x.lectia?`. Recitește: ${x.lectia}`:'.'}</li>`).join('')}</ul></details>`;
  }else h+=`<p>La ce ai verificat, ai luat toate punctele din prima.</p>`;
  return h+`<p class="ea-nota">E nota pe antrenament: cerințele și punctele lor sunt ale paginii. Nota adevărată o dă profesorul, la lucrare. ${gata?'Scrie în caiet punctajul și nota: pe calculator nu rămân.':`Scrie în caiet ${tot-CFG.oficiu} p (fără oficiu) și la ce cerință ai ajuns: pe calculator nu rămân.`}</p>`+(CFG.dupaFinal?String(CFG.dupaFinal):'');
}
function finalJos(){
  document.querySelectorAll('.ea-final').forEach(x=>x.remove());
  if(!completa()&&!(ST.cereNota&&inceputa()))return;
  const fb=document.getElementById('fb');if(!fb||!fb.parentNode)return;
  const el=document.createElement('div');el.className='ea-panou ea-final';el.setAttribute('role','status');el.innerHTML=rezumatHTML();
  fb.parentNode.insertBefore(el,fb.nextSibling);
}
function panouHTML(id){
  const N=ids().length;
  let h=`<div class="ea-cap"><p><span class="ea-et">${esc(CFG.titlu)}</span> · cerința ${esc(id)}</p>
<button type="button" class="btn ghost sm ea-alt">Sunt alt elev / Încep din nou</button></div>`;
  if(ST.nota)h+=`<p class="ea-nota">${esc(ST.nota)}</p>`;
  const facute=ids().filter(x=>ST.prima[x]);
  if(!facute.length){if(id===primul())h+=`<p>Fă toată cerința, apoi apasă <b>Verifică</b>.</p>`}
  else if(!completa()){const l=facute.reduce((s,x)=>s+luate(x),0),m=facute.reduce((s,x)=>s+item(x).puncte,0);h+=`<p>Până acum: ${l} din ${m} p.</p>`}
  if(completa()){const P=peParti(),tot=['C','B','A'].reduce((s,k)=>s+(P[k]?P[k].luat:0),0)+CFG.oficiu,n=nota(tot);
    h+=`<p>Ai verificat toate cele ${N} cerințe: <b>${deP(tot)} din 100</b>, nota pe antrenament <b>${n}</b>. Rezumatul întreg, cu nivelul, cu punctele pe părți și ce recitești, e mai jos.</p>`}
  else h+=lentHTML(id);
  return h;
}
/* ELEVUL LENT (1.1): „Nu termini?”, pliat, ca să nu încarce cerința: treci mai departe, sari, ceri nota pe ce ai lucrat; pagina spune ce se întâmplă cu ce n-ai verificat */
function lentHTML(id){
  const L=ids(),urm=L[L.indexOf(id)+1];
  return `<details class="ea-lent"><summary>Nu termini?</summary>
<p>${urm?`<button type="button" class="btn ghost sm ea-urm" data-id="${esc(urm)}">Treci la ${esc(urm)}${ST.prima[id]?'':`, fără puncte la ${esc(id)}`}</button> `:''}<button type="button" class="btn ghost sm ea-cere-nota">Arată-mi nota pe ce am lucrat</button></p>
<p>Sari la: ${L.map(x=>`<button type="button" class="btn ghost sm ea-sari" data-id="${esc(x)}"${x===id?' disabled':''}>${esc(x)}${ST.prima[x]?` · ${luate(x)} p`:''}</button>`).join('')}</p>
<p>O cerință neverificată are 0 p, iar ce ai lucrat la ea se golește când pleci de la ea. Pe calculator nu rămâne nimic: scrie în caiet punctele și la ce cerință ai ajuns. Data viitoare sari la cerința ta și aduni punctele din caiet.</p><p>Mai sunt 10 minute din oră? Scrie punctele în caiet, apoi, jos, „Acum la calculator →” și „La verificare →”: treci la întrebări.</p></details>`;
}
/* la altă cerință, prin mânerul motorului (ca laInceput); punctele rămân, cerința se deschide curată */
function mergiLa(id){
  const k=ids().indexOf(id);if(k<0)return;
  try{JocMotor.test.exercitiu(k);const q=document.getElementById('pq');if(q)q.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}
}
function leagaAlt(el){
  const b=el.querySelector('.ea-alt');if(b)b.onclick=()=>laInceput('Proba începe din nou, de la '+primul()+'. Ce era pe ecran s-a golit.');
  el.querySelectorAll('.ea-urm,.ea-sari').forEach(x=>{x.onclick=()=>mergiLa(x.dataset.id)});
  const c=el.querySelector('.ea-cere-nota');if(c)c.onclick=()=>{
    if(!inceputa()){ST.nota='Nu ai verificat încă nicio cerință, deci n-ai ce nota: lucrează o cerință și apasă „Verifică”.';redeseneaza();return}
    ST.cereNota=true;redeseneaza();const f=document.querySelector('.ea-final');if(f)f.scrollIntoView({behavior:'smooth',block:'start'})};
}
function redeseneaza(){
  if(!completa()&&!ST.cereNota)document.querySelectorAll('.ea-final').forEach(x=>x.remove());
  if(!curent)return;const el=document.querySelector('.ea-sus');if(el){el.innerHTML=panouHTML(curent.id);leagaAlt(el)}
  if(curent.body&&document.body.contains(curent.body)&&!ST.prima[curent.id])document.querySelectorAll('.ea-puncte').forEach(x=>x.remove());
  finalJos();
}
/* impaca: chiar acum, sus sunt ✗ (bifele simulatorului, față de răspunsul bun), iar aici puncte: o propoziție le împacă. La „scrie”, bifele sunt chiar punctele. */
function blocPuncte(id,body,impaca){
  document.querySelectorAll('.ea-puncte').forEach(z=>z.remove());
  const p=ST.prima[id];if(!p||!body.parentNode)return;
  const el=document.createElement('div');el.className='ea-puncte';el.setAttribute('role','status');
  const lista=p.teste.filter(t=>t.puncte),urm=ids()[ids().indexOf(id)+1];
  const deImpacat=impaca&&(p.fel==='date'||p.fel==='urmarire'||p.fel==='tabel')&&lista.some(t=>t.ok);
  el.innerHTML=`<p><b>Punctele cerinței ${esc(id)}, de la prima verificare: ${luate(id)} din ${item(id).puncte} p.</b>${lista.some(t=>!t.ok)?' Rămân așa; ce repari acum e exercițiu.':''}</p>
<ul>${lista.map(t=>`<li class="${t.ok?'bun':'rau'}">${t.ok?'✓':'✗'} <b>${t.ok?t.puncte:0} din ${t.puncte} p</b> · ${t.ce}${t.motiv?` (${esc(t.motiv)})`:''}</li>`).join('')}</ul>${p.dus?`<p>${esc(p.dus)}</p>`:''}${deImpacat?'<p class="ea-impaca"><b>De ce vezi și ✗, și puncte?</b> ✗ de la „Testele” arată ce mai e de reparat față de răspunsul bun. Punctele se dau pe bucăți, iar o greșeală se plătește o singură dată. Ai greșit un număr și ai mers mai departe cu el? Ce ai făcut bine după aceea primește puncte.</p>':''}${urm?`<p><button type="button" class="btn sm ea-urm" data-id="${esc(urm)}">Treci la ${esc(urm)} →</button></p>`:''}`;
  body.parentNode.insertBefore(el,body.nextSibling);
  leagaAlt(el);
}
/* „Verifică” care nu socotește: bifele și căsuțele roșii ale simulatoarelor se închid la loc (fără asta, rămâneau vii, iar C2 se rezolva după ✓/✗) */
function inchideBife(body,fel){
  if(fel==='scrie'&&body._ea){body._ea.verificat=false;body._ea.ascunde()}
  if(fel==='date'&&body._cvd){body._cvd.st.verificat=false;body._cvd.st.rele={};body._draw()}
  if(fel==='tabel'&&body._ud){body._ud.st.verificat=false;body._draw()}
  if(fel==='urmarire')body.querySelectorAll('table.sec-tab input').forEach(i=>i.classList.remove('rau','ok'));
}
/* sub jumătate din lucru? (un cartonaș din 6, o dată din 5, un rând din 4; la ordinea pașilor: o singură mutare) */
function putin(fel,Q,body){
  try{
    if(fel==='scrie'){const A=body._ea.alg;
      if(Q.cartonase&&Q.cartonase.length)return dupaEaLista(A).length*2<dupaEaLista(Q.sol).length;
      const a=JSON.parse(faraId(A)).map(x=>JSON.stringify(x)),b=JSON.parse(faraId(Q.alg)).map(x=>JSON.stringify(x));
      return a.filter((x,i)=>x!==b[i]).length<=2}
    if(fel==='date'){const l=body._cvd.st.loc[0];return l.filter(Boolean).length*2<l.length}
    if(fel==='urmarire'){const v={};body.querySelectorAll('table.sec-tab input').forEach(i=>{if(i.value.trim())v[i.dataset.r]=1});return Object.keys(v).length*2<Q.pasi.length}
    if(fel==='tabel')return (body._ud.st.S[0]||[]).filter(x=>x.gata).length*2<UD().ruleaza(Q.alg,Q.seturi[0].intrari).randuri.length;
  }catch(e){}
  return false;
}

/* ===================================== învelitoarea: punctele la prima verificare ===================================== */
function noteaza(Q,body,ok,zero,fel){
  const it=item(Q.proba);if(!it||ST.prima[it.id])return;
  let t;
  if(zero)t=[{ce:Q.ce||('Cerința '+it.id+': ai cerut răspunsul înainte de prima verificare'),puncte:it.puncte,ok:false,lectia:Q.lectia||''}];
  else if(fel==='alege')t=[{ce:Q.ce||it.id,puncte:it.puncte,ok:!!ok,lectia:Q.lectia||''}];
  else{
    const sc=fel==='scrie'?(()=>{const T=judeca(Q,body._ea.alg);return Q.teste.map((x,i)=>({ce:x.ce,puncte:x.puncte||0,ok:T[i].ok,paza:!!x.paza,lectia:x.lectia||''}))})()
      :fel==='date'?scorDate(Q,body):fel==='urmarire'?scorUrmarire(Q,body):scorTabel(Q,body);
    sc.forEach(x=>{if(!x.lectia)x.lectia=Q.lectia||'';if(ok)x.ok=true});
    const lucru=sc.some(x=>!x.paza&&x.ok&&x.puncte>0);
    sc.forEach(x=>{if(x.paza&&x.ok&&!lucru){x.ok=false;x.motiv='se punctează doar împreună cu restul cerinței'}});
    t=sc;
  }
  ST.prima[it.id]={teste:t,fel};ST.nota='';
  if(Q.greseala&&!ok)ST.prima[it.id].dus=Q.greseala;
  if(!ST.cine)ST.cine=cineE();
}
/* exercițiile pașilor, fără puncte: testele simulatoarelor V/26, V/29 apar la prima verificare, ca în probă (mai puțin de citit) */
function testeAscunse(baza){
  return {
    render(Q,body,api){css();body.classList.add('ea-ascuns');
      const arata=()=>body.classList.remove('ea-ascuns');
      return baza.render(Q,body,Object.assign({},api,{resolve(ok,m){arata();api.resolve(ok,m)},giveUp(h){arata();api.giveUp(h)}}))},
    rezolva(Q,body,api){return baza.rezolva?baza.rezolva(Q,body,api):false},
    gresit(Q,body,api){return baza.gresit?baza.gresit(Q,body,api):false}
  };
}
function punctat(baza,fel){
  return {
    render(Q,body,api){
      document.querySelectorAll('.ea-sus,.ea-puncte').forEach(x=>x.remove());
      curataStrain(body);
      const it=item(Q.proba);
      delete body._ea;body._eaAlege=null;
      /* mesajul unui „Verifică” care n-a socotit pleacă la primul gest (nu mai e adevărat); #body se refolosește, deci mânerul se schimbă */
      if(body._eaGest){body.removeEventListener('click',body._eaGest);body.removeEventListener('input',body._eaGest)}
      body._eaGest=()=>{const fb=document.getElementById('fb');if(fb&&fb.querySelector('.ea-msg'))fb.innerHTML=''};
      body.addEventListener('click',body._eaGest);body.addEventListener('input',body._eaGest);
      if(!it){body.classList.remove('ea-ascuns');curent=null;document.querySelectorAll('.ea-final').forEach(x=>x.remove());return baza.render(Q,body,api)}
      css();
      const aj=body.parentNode?body.parentNode.querySelector(':scope > .ajutor'):null;
      const arata=()=>{body.classList.remove('ea-ascuns');if(aj)aj.hidden=false};
      if(ST.prima[it.id])arata();else{body.classList.add('ea-ascuns');if(aj)aj.hidden=true}
      let start=null,avertizat=null;
      const dupa=()=>{
        if(it.id===ids()[ids().length-1]&&!completa())ST.cereNota=true;   // a ajuns la capăt cu cerințe sărite: nota pe ce a lucrat apare singură
        redeseneaza();blocPuncte(it.id,body,!api.done())};
      const api2=Object.assign({},api,{
        resolve(ok,msg){let m=msg||'';
          if(!ST.prima[it.id]){
            if(schimbatElevul(cineE())){api.feedback('bad','<strong>S-a schimbat elevul din caseta de jos.</strong> Proba a început din nou, de la '+esc(primul())+'.');return}
            const acum=amprenta(body,fel);
            if(!ok&&start!==null&&acum!==null&&acum===start){
              inchideBife(body,fel);
              api.feedback('bad',`<span class="ea-msg"></span><strong>${fel==='scrie'?'Algoritmul e la fel ca la început.':fel==='date'?'Tabelul de analiză e la fel ca la început.':'Tabelul e la fel ca la început.'}</strong> Punctele nu s-au socotit: lucrează cerința, apoi apasă „Verifică”.`);
              redeseneaza();return}
            if(!ok&&acum!==null&&acum!==avertizat&&putin(fel,Q,body)){
              avertizat=acum;inchideBife(body,fel);
              api.feedback('bad','<span class="ea-msg"></span><strong>Ai lucrat doar o parte din cerință.</strong> Punctele se dau la prima verificare și apoi nu se mai schimbă. Mai lucrezi? Dacă vrei să se socotească așa, apasă încă o dată „Verifică”.');
              redeseneaza();return}
            noteaza(Q,body,!!ok,false,fel);arata();
            if(!ok)m+=` <br><b>Puncte la ${esc(it.id)}: ${luate(it.id)} din ${it.puncte}</b>, de la prima verificare.`}
          api.resolve(ok,m);dupa()},
        giveUp(html){if(!ST.prima[it.id])noteaza(Q,body,false,true,fel);arata();api.giveUp(html);dupa()}
      });
      baza.render(Q,body,api2);
      start=amprenta(body,fel);
      const el=document.createElement('div');el.className='ea-panou ea-sus';el.setAttribute('role','region');el.setAttribute('aria-label','Proba de antrenament');
      curent={id:it.id,body};
      el.innerHTML=panouHTML(it.id);
      if(body.parentNode)body.parentNode.insertBefore(el,aj||body);
      leagaAlt(el);finalJos();blocPuncte(it.id,body,false);
    },
    rezolva(Q,body,api){return baza.rezolva?baza.rezolva(Q,body,api):false},
    gresit(Q,body,api){return baza.gresit?baza.gresit(Q,body,api):false}
  };
}

window.EvalAlgoritmiV={versiune:VERSIUNE,configureaza,scrie,alegere,punctat,testeAscunse,nota,nivel,executa,goleste,
  stare:()=>({prima:JSON.parse(JSON.stringify(ST.prima)),completa:completa(),puncte:CFG?ids().reduce((s,id)=>s+luate(id),0)+CFG.oficiu:null,cine:ST.cine}),
  _intern:{muta,scoate,clona,judeca,testeaza,scorDate,scorUrmarire,scorTabel,drum,citNr,cuId,faraId,dupaEaLista,areDecizie,numere,NUME,iertat,conteaza,putin}};
})();
