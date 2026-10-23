/* ======================================================================================================
   lectii/_sim/eval-internet-vi.js — PROBA DE ANTRENAMENT, cu punctaj pe părțile C / B / A, peste căsuța Gmail simulată
   (lecția VI · M3 · nr. 16, „Evaluare sumativă: comunicarea prin Internet”, 19.10.2026). PROPRIETAR: autorul lecției VI/16.
   Modele: lectii/_sim/simppt-proba.js (VI/10: învelișul, bifele ascunse, „Sunt alt elev”) și explorer-proba.js (V/12:
   punctele pe părți, nota, nivelul, „unde ai pierdut puncte”).
   NU modifică motorul (jocuri/_motor/*), posta-gmail.js (VI/13), posta-gmail-scrie.js (VI/14), posta-gmail-dosare.js
   (VI/15), rezultat-elev.js sau prezenta.js: învelește SimPostaGmailDosare.tip prin interfața lui publică (render /
   rezolva / gresit, mânerul body._inst(), SimPostaGmailDosare.testeDin, SimPostaGmailScrie.potriveste) și prin DOM-ul
   pe care îl desenează (lista testelor .pg-teste li, cu li.ok și .m; eticheta .pg-teste .lbl; câmpurile fișei .pg-fisa input).

   ÎNCĂRCARE (după motor.js, posta-gmail.js, posta-gmail-scrie.js, posta-gmail-dosare.js):
     <script src="../../_sim/eval-internet-vi.js"></script>
     EvalInternet.configureaza({titlu:'Proba de antrenament „Excursia”', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',nume:'…',puncte:5},…]});
     tipuri:{probaposta:EvalInternet.posta, probaalege:EvalInternet.alegere}

   EXERCIȚIUL căsuță (t:'probaposta'): forma lui Q de la tipul `dosare` (sim, teste, fisa, drum, gresit, mesaj), plus:
     proba:'C3'                 id-ul itemului din configureaza;
     teste[i].puncte            punctele testului (suma lor = punctele itemului);
     teste[i].ceInainte         textul testului PÂNĂ la prima verificare, dacă textul adevărat ar da răspunsul;
     teste[i].cePuncte          textul testului în blocul „Punctele … de la prima verificare” și în „unde ai pierdut” (dacă
                                regula punctelor diferă de bifa simulatorului: `trimis` — vezi 2);
     teste[i].doarCu:'etichetat'  punctele testului se dau doar dacă trece MĂCAR UNUL din testele cu acel `c` din aceeași
                                cerință (de ex. `neetichetat` nu se punctează la cine n-a etichetat nimic; cu câte un test
                                `etichetat` pe mesaj, eticheta pe un singur mesaj bun nu e pedepsită de două ori — reparația T);
     teste[i].lectia            unde recitești (HTML, legătura directă la pas: `<a href="../m2-l14/?vezi=p4">…</a>`);
     teste[i].altNume:true      (doar la `eticheta`) dacă eticheta cerută lipsește, dar elevul a făcut EXACT o etichetă,
                                testele `etichetat` / `neetichetat` / `vazutEticheta` cu numele cerut se judecă pe eticheta
                                LUI (SimPostaGmailDosare.evalueaza pe o copie a lui Q); se pierd doar punctele numelui, iar
                                blocul spune de ce (reparația AB, judecata 3: „Excursia” în loc de „Excursie” dădea 0 din 15).
   EXERCIȚIUL alegere (t:'probaalege'): q, o:[…], ok, amesteca?, mesaje:{indice:'…'}, puncte, ce (rândul din „unde ai
     pierdut”), lectia, why, ajutor. (Pentru răspunsurile „ce faci și de ce”: verificarea pe cuvinte a simulatorului nu
     ține cont de negație — „Nu-l deschide aici, deschide-l acasă” ar trece — deci partea A se notează ca ALEGERE.)

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4.1-4.3; _campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md; spuse
   la clasa a VI-a în lecția 1, pașii „Lucrarea și nota ei” și „Nivelul se citește din notă”): C = De bază 40, B =
   Consolidat 30, A = Avansat 20, 10 din oficiu; nota = punctaj : 10, la ,5 în favoarea elevului (85 → 9, 84 → 8);
   nivelul se citește din notă: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate.
   Punctele pe CERINȚE sunt ale paginii (antrenament), nu ale profesorului: panoul o spune.

   CE FACE:
   1. Punctele unui item se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică”. Ce repară elevul după aceea e
      exercițiu și nu schimbă punctele. „Verifică” pe căsuța NEATINSĂ (nimic scris, trimis, deschis, etichetat; fișa goală)
      nu socotește nimic și o spune; la alegere, fără variantă aleasă, la fel.
   2. Testele de CONȚINUT ale unui mesaj (Către, subiect, salut, semnătură, atașament, conținut, formula, majusculele…)
      primesc puncte DOAR pe un mesaj TRIMIS de tipul cerut (`mesaj` / `pe`): un mesaj netrimis nu ajunge la nimeni. Au
      plecat mai multe? Se punctează CEL MAI BUN, întreg (la egalitate, cel mai nou), iar blocul spune câte au plecat, care
      s-a punctat și că lista vie de deasupra arată ULTIMUL mesaj trimis (testele ei de conținut judecă fereastra deschisă
      sau ultimul mesaj trimis) — reparația W, judecata 2; judecata 3: mesajele se numără și când ultimul trece tot, deci și
      la „întâi greșit, apoi bine”. Testul `trimis` primește punctele lui dacă a plecat un mesaj de tipul cerut, oricum ar fi el (o greșeală nu se
      pedepsește de două ori: o pierde doar testul ei) — de aceea textul lui de punctare e `cePuncte`. Celelalte teste
      (conectat, nesalvata, iesit, eticheta, etichetat, neetichetat, fisa, neredirectionat…) = bifa simulatorului (li.ok) la
      prima verificare, cu `doarCu` dacă e dat.
   3. Până la prima verificare nu se văd bifele, mesajele de sub ✗, numărătoarea „x din y trec” și butonul „Am nevoie de
      un indiciu” (la lucrare nu ai bife); lista rămâne ca „Ce se verifică”, cu textele `ceInainte`.
   4. DUPĂ prima verificare (reparația M1, judecata 1, 19.10.2026): sub teste apare blocul „Punctele cerinței X, de la prima
      verificare”, cu fiecare test: ✓ +p sau ✗ 0 din p și motivul (de ex. „Scris bine, dar mesajul n-a plecat.”; cauza —
      „n-ai apăsat Trimite” / „cerința cere Scrie” — stă o dată, în rândul roșu de sus). Lista simulatorului rămâne VIE, pentru exercițiu („Testele sarcinii, acum”). Un mesaj netrimis (sau
      trimis cu alt buton) dă un singur rând în blocul de sus și în „unde ai pierdut puncte”: „Mesajul n-a plecat… (17 p)”.
      În lista vie, sub ✗, „Încă n-ai deschis fereastra de scriere” (scris de posta-gmail-dosare.js și când fereastra a
      fost deschisă cu alt buton) e înlocuit cu motivul dat de SimPostaGmailScrie.altTip (reparația X, judecata 2).
      Aceeași corectură și în exercițiile obișnuite ale paginii (nu de probă), prin tipul EvalInternet.dosare =
      SimPostaGmailDosare.tip + corectura vie, la exercițiile cu `mesaj` (reparația AA, judecata 3: P4 „Încă 1” făcut cu
      Răspunde, Î2 făcut cu Redirecționează); o singură trecere: EvalInternet.corecteaza(Q, body).
   5. Panoul probei, deasupra itemului: unde ești, punctele de până acum; după ultimul item: punctele pe părți, oficiul,
      punctajul, nota, nivelul și „unde ai pierdut puncte”, cu lecția de recitit; același rezumat și sub ultimul răspuns.
   6. Nimic din probă nu se scrie în localStorage, sessionStorage sau pe server: totul stă în memoria paginii deschise (la
      reîncărcare, proba e goală — pagina o spune). Singura excepție e un SEMN fără date, sessionStorage
      'evi_proba_golita' = '1', lăsat la plecarea paginii cu proba începută și șters la pornire, ca panoul să spună că
      proba s-a golit (înscrierea în caseta de jos repornește pagina — reparația V, judecata 2). Proba se golește și se reia de la primul item la „Sunt alt elev / Încep
      din nou” și când se schimbă elevul din caseta prezenta.js, ca la VI/10 (regula 23). Elevul de la prima verificare
      (ST.cine) se compară cu cel din casetă la evenimentul `prezenta` ȘI la fiecare „Verifică” (caseta nu anunță mereu
      înscrierea printr-un eveniment). Cine se ÎNSCRIE după o probă începută fără nume e întrebat în panou „E a ta?” (Da →
      o păstrează; Nu → începe din nou); până răspunde, „Verifică” nu socotește nimic (reparația m6 a judecății sonnet,
      19.10.2026). Alt elev înscris decât cel de la început → proba începe din nou.
   Global: window.EvalInternet {configureaza, posta, alegere, dosare, corecteaza, stare, goleste, nota, nivel}.
     tipuri:{dosare:EvalInternet.dosare, …}   (în locul lui SimPostaGmailDosare.tip; fără `mesaj`, exercițiul e neschimbat)
   Proba: lectii/vi/m3-l16/_proba/proba_gesturi.py, proba_mutanti.py și proba_reparatii.py (ultima linie 0).
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const txt=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');
const mare=s=>{s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1)};
let CFG={titlu:'Proba de antrenament',oficiu:10,parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},itemi:[]};
/* prima[id] = {teste:[{c, ce, puncte, ok, lectia, fel, motiv}], ok, netrimis, motivNetrimis, lectiaTrimis} — prima verificare
   a fiecărui item, doar în memorie; ora = ora primei verificări; intreaba = {ora} cât timp elevul înscris abia acum n-a
   spus dacă proba începută fără nume e a lui */
const ST={prima:{},nota:'',ora:'',intreaba:null,cine:''};   // cine = elevul din caseta prezenta.js la prima verificare ('null' = fără nume)
let curent=null;   // itemul de pe ecran: {id, body}

/* ---------------- stilul (prefixul evi-) ---------------- */
function css(){
  if(document.getElementById('evi-css'))return;
  const s=document.createElement('style');s.id='evi-css';
  s.textContent=`
.evi-panou{border:2px dashed var(--accent);border-radius:8px;padding:8px 12px;margin:6px 0 10px;background:var(--paper2)}
.evi-panou p{margin:.25em 0}
.evi-panou .evi-cap{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}
.evi-panou .evi-et{font-weight:700;color:var(--accent)}
.evi-panou ul{margin:.3em 0 .3em 1.2em;padding:0}
.evi-panou li{margin:.2em 0}
.evi-panou a{color:var(--accent)}
.evi-panou details summary{min-height:32px;display:flex;align-items:center;cursor:pointer;color:var(--accent);font-weight:600}
.evi-panou .evi-nota{border-left:4px solid var(--accent);padding:4px 8px;margin:6px 0;background:var(--paper)}
.evi-panou table{border-collapse:collapse;margin:.3em 0}
.evi-panou td,.evi-panou th{border:1px solid var(--line);padding:3px 8px;text-align:left}
.evi-intreb{border:2px solid var(--bad);border-radius:8px;padding:6px 10px;margin:6px 0;background:var(--paper)}
.evi-intreb .btn{min-height:36px;margin:2px 4px 2px 0}
.evi-puncte{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:6px 10px;margin:8px 0;background:var(--paper)}
.evi-puncte p{margin:.25em 0}
.evi-puncte ul{list-style:none;margin:.3em 0;padding:0}
.evi-puncte li{margin:.25em 0}
.evi-puncte li.ok .s{color:var(--ok);font-weight:700}
.evi-puncte li.rau .s{color:var(--bad);font-weight:700}
.evi-puncte .evi-de{color:var(--ink2)}
.evi-puncte .evi-netr{color:var(--bad);font-weight:700}
.evi-puncte .evi-mai{color:var(--ink2)}
.evi-ascuns .pg-teste li .s{visibility:hidden}
.evi-ascuns .pg-teste li .m{display:none}
.evi-ascuns .pg-teste li.ok,.evi-ascuns .pg-teste li.rau{color:inherit}
.evi-opts{display:grid;gap:8px;margin:6px 0}
.evi-opts .opt{min-height:44px;text-align:left}`;
  document.head.appendChild(s);
}

/* ---------------- starea probei ---------------- */
const ids=()=>CFG.itemi.map(b=>b.id);
const primul=()=>ids()[0];
const item=id=>CFG.itemi.find(x=>x.id===id)||{id,nume:id,parte:'?',puncte:0};
const inceputa=()=>Object.keys(ST.prima).length>0;
const completa=()=>ids().length>0&&ids().every(id=>ST.prima[id]);
function goleste(nota){Object.keys(ST.prima).forEach(k=>delete ST.prima[k]);ST.nota=nota||'';ST.ora='';ST.intreaba=null;ST.cine=''}
const nrItem=id=>ids().indexOf(id)+1;
const luate=id=>{const p=ST.prima[id];return p?p.teste.reduce((s,t)=>s+(t.ok?t.puncte:0),0):0};
const oraAcum=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
function pune(id,rez){ST.prima[id]=rez;ST.nota='';if(!ST.ora)ST.ora=oraAcum();if(!ST.cine)ST.cine=cineE()}
function peParti(){const r={};Object.keys(CFG.parti).forEach(k=>{r[k]={luat:0,verificat:0,max:CFG.parti[k].max}});
  ids().forEach(id=>{const it=item(id),p=r[it.parte];if(!p||!ST.prima[id])return;p.luat+=luate(id);p.verificat+=it.puncte||0});return r}
/* nota = punctaj : 10, la ,5 în favoarea elevului; nivelul din notă (regula profesorului) */
const nota=punctaj=>Math.max(1,Math.min(10,Math.floor((punctaj+5)/10)));
const nivel=n=>n>=9?'Avansat':n>=7?'Consolidat':n>=5?'De bază':n>=3?'În formare':'În dificultate';
const deMesaj=t=>t.fel==='continut'||t.fel==='trimis';

/* ---------------- panoul ---------------- */
/* rândurile „unde ai pierdut puncte”: un mesaj netrimis = UN rând (cu punctele tuturor testelor lui de mesaj) */
function pierdute(){
  const rate=[];
  ids().forEach(id=>{const p=ST.prima[id];if(!p)return;
    if(p.netrimis){const n=p.teste.filter(t=>!t.ok&&t.puncte&&deMesaj(t)).reduce((s,t)=>s+t.puncte,0);
      if(n)rate.push({id,ce:esc(mare(p.motivNetrimis))+': ce era scris în el nu s-a punctat',puncte:n,lectia:p.lectiaTrimis})}
    p.teste.forEach(t=>{if(t.ok||!t.puncte||(p.netrimis&&deMesaj(t)))return;rate.push({id,ce:t.ce,puncte:t.puncte,lectia:t.lectia})})});
  return rate;
}
function rezumatHTML(){
  const P=peParti(),ord=['C','B','A'].filter(k=>P[k]);
  const tot=ord.reduce((s,k)=>s+P[k].luat,0)+CFG.oficiu,n=nota(tot);
  let h=`<p><b>Ai verificat toate cele ${ids().length} cerințe ale probei de antrenament.</b></p>
<table><tr><th>Partea</th><th>Puncte</th></tr>${ord.map(k=>`<tr><td>${k} · ${esc(CFG.parti[k].nume)}</td><td>${P[k].luat} din ${P[k].max}</td></tr>`).join('')}<tr><td>din oficiu</td><td>${CFG.oficiu}</td></tr><tr><th>Punctajul</th><th>${tot} din 100</th></tr></table>
<p>Nota pe antrenament: ${tot} : 10 = ${String(tot/10).replace('.',',')} → <b>${n}</b>. Nivelul, din notă: <b>${nivel(n)}</b>.</p>`;
  const rate=pierdute();
  if(rate.length){
    const pierd=ord.map(k=>({k,p:P[k].max-P[k].luat})).sort((a,b)=>b.p-a.p);
    h+=`<p>Cele mai multe puncte le-ai pierdut la partea <b>${pierd[0].k}</b> (${pierd[0].p} din ${P[pierd[0].k].max}).</p>
<details open><summary>Unde ai pierdut puncte și ce recitești</summary><ul>${rate.map(x=>`<li>${esc(x.id)}: ${x.ce} (${x.puncte} p)${x.lectia?` — recitește ${x.lectia}`:''}.</li>`).join('')}</ul></details>`;
  }else h+=`<p>Ai luat toate punctele din prima.</p>`;
  return h+`<p class="evi-nota">E nota pe antrenament: cerințele și punctele pe cerințe sunt ale paginii. Nota adevărată o dă profesorul, la lucrare.</p>`;
}
function finalJos(){
  document.querySelectorAll('.evi-final').forEach(x=>x.remove());
  if(!completa())return;
  const fb=document.getElementById('fb');if(!fb||!fb.parentNode)return;
  const el=document.createElement('div');el.className='evi-panou evi-final';el.setAttribute('role','status');el.innerHTML=rezumatHTML();
  fb.parentNode.insertBefore(el,fb.nextSibling);
}
function panouHTML(id){
  const it=item(id),k=nrItem(id),N=ids().length;
  let h=`<div class="evi-cap"><p><span class="evi-et">${esc(CFG.titlu)}</span> · nu intră în catalog · cerința ${k} din ${N}: ${esc(id)}, partea ${esc(it.parte)} (${it.puncte} p)</p>
<button type="button" class="btn ghost sm evi-alt">Sunt alt elev / Încep din nou</button></div>`;
  if(ST.intreaba)h+=`<div class="evi-intreb" role="alert"><p><b>Proba de pe ecran a fost începută de cineva fără nume${ST.intreaba.ora?`, la ora ${esc(ST.intreaba.ora)}`:''}. E a ta?</b> Până răspunzi, „Verifică” nu socotește nimic.</p>
<p><button type="button" class="btn sm evi-da">Da, e a mea</button><button type="button" class="btn ghost sm evi-nu">Nu, încep din nou</button></p></div>`;
  if(ST.nota)h+=`<p class="evi-nota">${esc(ST.nota)}</p>`;
  const facute=ids().filter(x=>ST.prima[x]);
  if(!facute.length)h+=`<p>Lucrează toată cerința, apoi apasă <b>Verifică</b>. Punctele se socotesc la prima apăsare, ca la lucrare. Bifele și punctele fiecărui test le vezi abia atunci.</p>`;
  else h+=`<p>Din prima: ${facute.map(x=>`${esc(x)} ${luate(x)} din ${item(x).puncte} p`).join(' · ')}.</p>`;
  if(completa())h+=rezumatHTML();
  return h;
}
const leagaAlt=el=>{const b=el.querySelector('.evi-alt');if(b)b.onclick=()=>laInceput('Proba începe din nou, de la prima cerință. Ce era pe ecran s-a golit.');
  const da=el.querySelector('.evi-da');if(da)da.onclick=()=>{ST.intreaba=null;ST.cine=cineE();ST.nota='Bine: proba rămâne a ta. Continuă de unde ai rămas.';redeseneaza()};
  const nu=el.querySelector('.evi-nu');if(nu)nu.onclick=()=>laInceput('Proba începe din nou, de la prima cerință: cea începută fără nume s-a golit.')};
function panou(id,body){
  document.querySelectorAll('.evi-panou').forEach(x=>x.remove());
  const el=document.createElement('div');el.className='evi-panou evi-sus';el.setAttribute('role','region');el.setAttribute('aria-label','Proba de antrenament');
  el.innerHTML=panouHTML(id);
  if(body.parentNode)body.parentNode.insertBefore(el,body);
  leagaAlt(el);return el;
}
function redeseneaza(){if(!completa())document.querySelectorAll('.evi-final').forEach(x=>x.remove());if(!curent)return;const el=document.querySelector('.evi-sus');if(el){el.innerHTML=panouHTML(curent.id);leagaAlt(el)}}
/* înainte de orice socotire: e tot elevul care a început proba? (caseta prezenta.js nu anunță mereu înscrierea printr-un
   eveniment, deci se întreabă și aici). Cât timp elevul înscris abia acum n-a spus dacă proba e a lui, nu se socotește nimic. */
function asteapta(api){
  if(!ST.intreaba&&schimbatElevul(cineE())&&!ST.intreaba){
    api.feedback('bad','<strong>S-a schimbat elevul din caseta de jos.</strong> Proba a început din nou, de la prima cerință.');return true}
  if(!ST.intreaba)return false;
  api.feedback('bad','<strong>Întâi răspunde sus:</strong> proba de pe ecran e a ta? Până atunci nu se socotește nimic.');
  redeseneaza();const q=document.querySelector('.evi-intreb');if(q&&q.scrollIntoView)q.scrollIntoView({block:'center'});return true}

const peEcran=()=>!!(curent&&curent.body&&document.body.contains(curent.body)&&document.querySelector('.evi-sus'));
function laInceput(n){
  goleste(n);
  if(!peEcran()){redeseneaza();return}   // proba nu e pe ecran: s-a golit; o reia de unde o deschide
  let dus=false;
  try{if(window.JocMotor&&JocMotor.test&&typeof JocMotor.test.exercitiu==='function'){JocMotor.test.exercitiu(0);dus=true}}catch(e){dus=false}
  if(!dus||!peEcran()||curent.id!==primul())ST.nota=n+' Pagina nu te-a putut duce singură la prima cerință: apasă „Încă un exercițiu” până ajungi la ea.';
  redeseneaza();
}
/* schimbarea elevului din caseta prezenta.js (e.detail = identitatea sau null) */
const cheieDe=x=>{try{return JSON.stringify(x||null)}catch(e){return 'null'}};
function cineE(){try{return cheieDe(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}}
/* k = elevul de acum; comparat cu cel de la prima verificare (ST.cine). Fără nume → înscris: „E a ta?”; alt elev: proba
   începe din nou. Întoarce true dacă a oprit socotirea. */
function schimbatElevul(k){
  if(!inceputa()||!ST.cine||k===ST.cine)return false;
  if(ST.cine==='null'&&k!=='null'){if(!ST.intreaba){ST.intreaba={ora:ST.ora};ST.nota='';redeseneaza()}return true}
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la prima cerință.');return true}
addEventListener('prezenta',e=>{schimbatElevul(cheieDe(e&&e.detail))});
/* V (judecata 2, 19.10.2026): înscrierea în caseta de jos (prezenta.js) REPORNEȘTE pagina, iar proba, ținută doar în memorie,
   se pierde. La plecarea paginii cu proba începută se lasă un SEMN fără date (nici nume, nici răspunsuri, nici puncte):
   sessionStorage 'evi_proba_golita' = '1'. La pornire semnul se citește o dată și se șterge, iar panoul probei spune ce s-a
   întâmplat. (prezenta.js folosește la fel sessionStorage pentru semnul reîncărcării.) */
const SEMN='evi_proba_golita';
addEventListener('pagehide',e=>{try{if(inceputa()&&!(e&&e.persisted))sessionStorage.setItem(SEMN,'1')}catch(x){}});
try{if(sessionStorage.getItem(SEMN)){sessionStorage.removeItem(SEMN);
  ST.nota='Pagina a pornit din nou (după înscrierea în caseta de jos sau după o reîncărcare), iar proba de antrenament începută s-a golit: nimic nu se păstrează. Începe de la C1.'}}catch(e){}

/* ---------------- căsuța: amprenta și punctele ---------------- */
function instDe(body){try{return body._inst?body._inst():null}catch(e){return null}}
function amprenta(body){
  if(body._eviAlege)return body._eviAlege.ales();
  const i=instDe(body);if(!i)return null;
  try{const s=i.stare(),x=i.stareScrie(),d=i.stareDosare?i.stareDosare():{};
    const fisa=[...body.querySelectorAll('.pg-fisa input')].map(z=>z.value.trim());
    return JSON.stringify([s.conectat,s.iesit,s.parolaSalvata,s.bulaInchisa,s.deschise,s.parti,x.compune,(x.trimise||[]).length,x.ciorne,x.renuntate,x.anulate,d.etichete,d.et,d.agenda,fisa]);
  }catch(e){return null}
}
const liste=body=>[...body.querySelectorAll('.pg-teste li')];
const BUTON={nou:'Scrie',raspuns:'Răspunde',tuturor:'Răspunde tuturor',redir:'Redirecționează'};
function puncteCasuta(Q,body,okTot){
  const i=instDe(body),lis=liste(body),D=window.SimPostaGmailDosare,Sc=window.SimPostaGmailScrie;
  let l=null,x=null;try{l=D&&D.testeDin?D.testeDin(Q):null;x=i?i.stareScrie():null}catch(e){l=null}
  const trimise=(x&&x.trimise)||[];
  const trimisPe=pe=>{const tr=trimise.filter(r=>!Sc||!Sc.potriveste||Sc.potriveste(r,pe));return tr.length?tr[tr.length-1]:null};
  const liOk=k=>!!(lis[k]&&lis[k].classList.contains('ok'));
  const liMsg=k=>{const m=lis[k]&&lis[k].querySelector('.m');return m?m.textContent.trim():''};
  /* de ce n-a plecat mesajul cerut: nimic trimis, sau alt fel de mesaj (alt buton / alt mesaj) */
  const deCeNu=pe=>{if(!trimise.length)return 'mesajul n-a plecat (n-ai apăsat Trimite)';
    const b=pe&&pe.tip?[].concat(pe.tip).map(t=>BUTON[t]||t).join(' sau '):'';
    return 'a plecat alt mesaj decât cel cerut'+(b?` (cerința cere ${b}${pe.la?', la mesajul ei':''})`:'')};
  /* W (judecata 2, 19.10.2026): au plecat MAI MULTE mesaje de felul cerut → se punctează CEL MAI BUN dintre ele, întreg (un
     singur mesaj, nu testele luate de la mesaje diferite); la egalitate, cel mai nou. Lista vie a simulatorului dă ✓ dacă
     ORICARE mesaj trimis trece (`trimise.some`), deci blocul punctelor și lista spun același lucru; blocul spune care s-a punctat. */
  const cheie=pe=>{try{return JSON.stringify(pe||null)}catch(e){return ''}};
  const ales={};
  const celMaiBun=pe=>{const kp=cheie(pe);if(ales[kp])return ales[kp].m;
    const c=trimise.filter(m=>!Sc||!Sc.potriveste||Sc.potriveste(m,pe));let b=null,bk=-1,bs=-1;
    c.forEach((m,j)=>{let s=0;(Q.teste||[]).forEach((T,z)=>{const u=l&&l[z];if(!u||u.fel!=='continut'||cheie(u.pe)!==kp)return;
      try{if(u.T.f(m,u.v,Q))s+=(+T.puncte||0)}catch(e){}});
      if(s>=bs){bs=s;b=m;bk=j}});
    ales[kp]={m:b,k:bk+1,n:c.length,pe};return b};
  /* W (judecata 3): mesajele plecate se numără ÎNAINTE de scurtătura okTot — și când ultimul mesaj trece tot („întâi greșit,
     apoi bine”), blocul spune că au plecat mai multe și că trimiți unul singur */
  if(l)l.forEach(u=>{if(u.fel==='continut')celMaiBun(u.pe)});
  const altEt=etichetaAltNume(Q,i);   // AB (judecata 3): eticheta făcută cu alt nume
  let netrimis=false,motivNetrimis='',lectiaTrimis='';
  const r=(Q.teste||[]).map((T,k)=>{
    const t=l&&l[k],fel=t?t.fel:'';
    let ok=!!okTot||liOk(k),motiv='',ce=T.cePuncte||T.ce||(t&&t.ce)||'';
    if(!okTot&&t){
      if(fel==='continut'){const m=celMaiBun(t.pe);
        if(!m){ok=false;const alt=trimise.length>0;   // cauza stă o dată, în rândul roșu de sus; aici, scurt
          motiv=liOk(k)?(alt?'Scris bine, dar în alt mesaj decât cel cerut.':'Scris bine, dar mesajul n-a plecat.'):(alt?'Alt mesaj decât cel cerut.':'Mesajul n-a plecat.')}
        else{try{ok=!!t.T.f(m,t.v,Q)}catch(e){ok=false}
          if(!ok){try{motiv=t.T.m?txt(t.T.m(m,t.v,Q)):''}catch(e){motiv=''}}}}
      else if(fel==='trimis'){ok=!!trimisPe(t.pe);if(!ok){netrimis=true;motivNetrimis=deCeNu(t.pe);lectiaTrimis=T.lectia||'';motiv=mare(motivNetrimis)+'.'}}
      else if(altEt&&k===altEt.ke){ok=false;motiv=`Ai făcut eticheta „${altEt.al}”; cerința cere numele exact „${altEt.cerut}”.`}
      else if(altEt&&altEt.ks.indexOf(k)>=0){const z=altEt.r[k]||{};ok=!!z.ok;motiv=ok?'':txt(z.m||'');
        ce=String(ce).split('„'+altEt.cerut+'”').join('„'+esc(altEt.al)+'”')}
      else if(!ok)motiv=liMsg(k);
    }
    return {c:T.c,ce,puncte:+T.puncte||0,ok,lectia:T.lectia||'',fel,motiv};
  });
  /* doarCu: testul se punctează doar dacă trece MĂCAR UNUL din testele cu acel `c` (reparația T, judecata 2: B2 are câte un
     test `etichetat` pe fiecare mesaj bun; cu „toate”, eticheta pe un singur mesaj bun era pedepsită de două ori) */
  (Q.teste||[]).forEach((T,k)=>{if(!T.doarCu||!r[k].ok)return;const js=(Q.teste||[]).map((z,j)=>z.c===T.doarCu&&j!==k?j:-1).filter(j=>j>=0);
    if(js.length&&!js.some(j=>r[j].ok)){r[k].ok=false;
      r[k].motiv=js.length===1?`Se punctează doar împreună cu: ${txt(r[js[0]].ce)}.`:`Se punctează doar împreună cu măcar unul dintre: ${js.map(j=>txt(r[j].ce)).join(' / ')}.`}});
  const mai=Object.values(ales).find(a=>a.n>1&&a.m);
  const ORD=['primul','al doilea','al treilea','al patrulea','al cincilea'];
  /* lista vie: testele ei de conținut judecă fereastra deschisă de felul cerut sau, altfel, ULTIMUL mesaj trimis */
  const deschisAcum=!!(mai&&x&&x.compune&&(!Sc||!Sc.potriveste||Sc.potriveste(x.compune,mai.pe)));
  const deMaiMulte=mai?{n:mai.n,al:ORD[mai.k-1]||`al ${mai.k}-lea`,subiect:String(mai.m.subiect||'').trim(),deschisAcum}:null;
  const numeAlt=altEt?{cerut:altEt.cerut,al:altEt.al,puncte:altEt.puncte}:null;
  return {teste:r,netrimis,motivNetrimis,lectiaTrimis,deMaiMulte,numeAlt};
}
/* AB (judecata 3): testul `eticheta` cu altNume:true. Eticheta cerută lipsește, dar elevul a făcut EXACT o etichetă (căsuța
   pornește fără etichete) → testele cu numele cerut (etichetat / neetichetat: v.et; vazutEticheta: v) se judecă pe eticheta
   lui, cu evaluarea simulatorului pe o copie a lui Q. Întoarce {ke, cerut, al, ks, r, puncte} sau null. */
function etichetaAltNume(Q,i){
  const D=window.SimPostaGmailDosare,te=Q.teste||[],ke=te.findIndex(T=>T.c==='eticheta'&&T.altNume);
  if(ke<0||!D||typeof D.evalueaza!=='function'||!i)return null;
  let d,r0;try{d=i.stareDosare();r0=D.evalueaza(Q,i,{})}catch(e){return null}
  const et=(d&&d.etichete)||[];
  if(!r0[ke]||r0[ke].ok||et.length!==1)return null;
  const cerut=te[ke].v,al=et[0],ks=[];
  const Q2=Object.assign({},Q,{teste:te.map((T,k)=>{
    if((T.c==='etichetat'||T.c==='neetichetat')&&T.v&&T.v.et===cerut){ks.push(k);return Object.assign({},T,{v:Object.assign({},T.v,{et:al})})}
    if(T.c==='vazutEticheta'&&T.v===cerut){ks.push(k);return Object.assign({},T,{v:al})}
    return T})});
  let r1;try{r1=D.evalueaza(Q2,i,{})}catch(e){return null}
  return {ke,cerut,al,ks,r:r1,puncte:+te[ke].puncte||0};
}
/* X (judecata 2): lista VIE a simulatorului comun (posta-gmail-dosare.js, evalueaza) scrie la testele de conținut
   „Încă n-ai deschis fereastra de scriere…” și atunci când elevul a deschis fereastra cu ALT buton (Răspunde în loc de
   Scrie). Simulatorul nu se schimbă (e al lecției 15): extensia pune, sub ✗, motivul adevărat dat de funcția lui publică
   SimPostaGmailScrie.altTip (ca evalueaza din posta-gmail-scrie.js). Doar textul de sub ✗; bifele rămân ale simulatorului. */
function corecteazaLista(Q,body){
  const Sc=window.SimPostaGmailScrie,D=window.SimPostaGmailDosare,i=instDe(body),lis=liste(body);
  if(!lis.length||!Sc||typeof Sc.altTip!=='function'||!D||!D.testeDin||!i)return;
  let l,x,M;try{l=D.testeDin(Q);x=i.stareScrie();M=i.mesaje?i.mesaje():[]}catch(e){return}
  const tp=[];l.forEach(t=>{if(t.pe&&!tp.some(p=>JSON.stringify(p)===JSON.stringify(t.pe)))tp.push(t.pe)});
  lis.forEach((li,k)=>{const t=l[k];if(!t||li.classList.contains('ok')||(t.fel!=='continut'&&t.fel!=='trimis'))return;
    const m=li.querySelector('.m');if(!m||!m.textContent)return;
    let a='';try{a=Sc.altTip(x,t.pe,M,tp)||''}catch(e){a=''}
    if(a&&m.textContent!==a)m.textContent=a});
}
/* X / AA: după fiecare redesenare a listei vii, motivul de sub ✗ e corectat (corecteazaLista e idempotentă). Paza: lista e a
   acestui exercițiu cât timp mânerul body._inst e cel pus acum de simulator (alt exercițiu pune altul sau îl șterge). */
function corecteazaViu(Q,body){
  if(body._eviOb){try{body._eviOb.disconnect()}catch(e){}body._eviOb=null}
  const instFn=body._inst;
  if(!window.MutationObserver||!instFn)return;
  const ob=new MutationObserver(()=>{if(body._inst!==instFn){ob.disconnect();return}corecteazaLista(Q,body)});
  ob.observe(body,{childList:true,subtree:true,characterData:true});body._eviOb=ob;corecteazaLista(Q,body);
}
/* AA (judecata 3): exercițiile obișnuite ale paginii (P4 Încearcă / Încă 1, Î2) folosesc tipul simulatorului comun, a cărui
   listă scrie „Încă n-ai deschis fereastra de scriere” și după Răspunde / Redirecționează. Tipul de mai jos = același tip,
   neschimbat, plus corectura vie, doar la exercițiile care cer un mesaj (Q.mesaj sau teste cu `pe`). */
const cereMesaj=Q=>!!(Q&&(Q.mesaj||(Q.teste||[]).some(T=>T&&T.pe)));
const dosare={
  render(Q,body,api){
    const b=window.SimPostaGmailDosare&&SimPostaGmailDosare.tip;
    body.classList.remove('evi-ascuns');
    if(body._eviOb){try{body._eviOb.disconnect()}catch(e){}body._eviOb=null}
    if(!b){body.innerHTML='<p class="toast">Lipsește căsuța simulată (posta-gmail-dosare.js).</p>';return}
    const rez=b.render(Q,body,api);
    if(cereMesaj(Q))corecteazaViu(Q,body);
    return rez;
  },
  rezolva(Q,body){const b=window.SimPostaGmailDosare&&SimPostaGmailDosare.tip;return b?b.rezolva(Q,body):false},
  gresit(Q,body){const b=window.SimPostaGmailDosare&&SimPostaGmailDosare.tip;return b?b.gresit(Q,body):false}
};
/* blocul „Punctele cerinței X, de la prima verificare”, sub lista vie a simulatorului */
function blocPuncte(id,body){
  body.querySelectorAll('.evi-puncte').forEach(z=>z.remove());
  const p=ST.prima[id],box=body.querySelector('.pg-teste');if(!p||!box||!box.parentNode)return;
  const el=document.createElement('div');el.className='evi-puncte';el.setAttribute('role','status');
  el.innerHTML=`<p><b>Punctele cerinței ${esc(id)}, de la prima verificare: ${luate(id)} din ${item(id).puncte} p.</b> Rămân așa; ce repari de acum e exercițiu.</p>`
    +(p.netrimis?`<p class="evi-netr">✗ ${esc(mare(p.motivNetrimis))}: ce era scris în mesaj nu s-a punctat.</p>`:'')
    +(p.deMaiMulte?`<p class="evi-mai">Au plecat ${p.deMaiMulte.n} mesaje de felul cerut. S-a punctat cel mai bun dintre ele, întreg: ${esc(p.deMaiMulte.al)} trimis${p.deMaiMulte.subiect?`, cu subiectul „${esc(p.deMaiMulte.subiect)}”`:', fără subiect'}. La lucrare, verifici mesajul înainte de Trimite și trimiți unul singur. ${p.deMaiMulte.deschisAcum?'Lista de mai sus arată mesajul din fereastra de scriere deschisă acum, nu unul trimis.':'Lista de mai sus arată ultimul mesaj trimis.'}</p>`:'')
    +(p.numeAlt?`<p class="evi-mai">Eticheta ta se numește „${esc(p.numeAlt.al)}”, nu „${esc(p.numeAlt.cerut)}”: pierzi doar punctele numelui (${p.numeAlt.puncte} p). Celelalte teste s-au judecat pe eticheta ta. Lista de mai sus caută numele exact „${esc(p.numeAlt.cerut)}”.</p>`:'')
    +`<ul>${p.teste.map(t=>`<li class="${t.ok?'ok':'rau'}"><span class="s">${t.ok?'✓':'✗'}</span> <b>${t.ok?'+'+t.puncte+' p':'0 din '+t.puncte+' p'}</b> · ${t.ce}${!t.ok&&t.motiv?` <span class="evi-de">— ${esc(t.motiv)}</span>`:''}</li>`).join('')}</ul>`;
  box.parentNode.insertBefore(el,box.nextSibling);
}

/* ---------------- învelișul căsuței ---------------- */
function posta(){
  return {
    render(Q,body,api){
      css();
      const baza=window.SimPostaGmailDosare&&SimPostaGmailDosare.tip;
      if(!baza){body.innerHTML='<p class="toast">Lipsește căsuța simulată (posta-gmail-dosare.js).</p>';return}
      const id=Q.proba;
      if(!id||!ids().includes(id)){body.classList.remove('evi-ascuns');return baza.render(Q,body,api)}
      const verificat=()=>!!ST.prima[id];
      const Q2=Array.isArray(Q.teste)&&Q.teste.some(T=>T.ceInainte)&&!verificat()?Object.assign({},Q,{teste:Q.teste.map(T=>Object.assign({},T,{ce:T.ceInainte||T.ce}))}):Q;
      const textAdevarat=()=>{if(Q2===Q)return;Q2.teste.forEach((T,k)=>{const real=Q.teste[k].ce;if(!real||T.ce===real)return;const li=liste(body)[k];
        if(li){const sp=li.querySelector('span:not(.s):not(.m)');if(sp&&sp.firstChild&&sp.firstChild.nodeType===3)sp.firstChild.nodeValue=real}T.ce=real})};
      const lbl=()=>body.querySelector('.pg-teste .lbl');
      const ascunde=()=>{body.classList.add('evi-ascuns');const l=lbl();if(l)l.textContent='Ce se verifică (bifele și punctele apar după prima verificare)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=true};
      const arata=()=>{body.classList.remove('evi-ascuns');const l=lbl();
        if(l){const n=liste(body),ok=n.filter(z=>z.classList.contains('ok')).length;l.innerHTML=`Testele sarcinii, acum (pentru exercițiu) · <span class="nr">${ok} din ${n.length} trec</span>`}
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=false;textAdevarat();blocPuncte(id,body)};
      let amprenta0=null;
      const noteaza=ok=>{const r=puncteCasuta(Q,body,ok);pune(id,{teste:r.teste,ok:!!ok,netrimis:r.netrimis,motivNetrimis:r.motivNetrimis,lectiaTrimis:r.lectiaTrimis,deMaiMulte:r.deMaiMulte,numeAlt:r.numeAlt})};
      const api2=Object.assign({},api,{
        resolve(ok,msg,...rest){
          if(!verificat()){
            if(asteapta(api))return;
            const acum=amprenta(body);
            if(!ok&&amprenta0!==null&&acum===amprenta0){
              api.feedback('bad','<strong>Nu încă.</strong> Căsuța e la fel ca la început: nu s-a socotit nimic. Lucrează cerința, apoi apasă „Verifică”.');
              redeseneaza();return}
            noteaza(ok);
          }
          let m=msg;
          if(Q2!==Q&&typeof m==='string')Q2.teste.forEach((T,k)=>{if(T.ce&&T.ce!==Q.teste[k].ce&&Q.teste[k].ce)m=m.split(T.ce).join(Q.teste[k].ce)});
          arata();api.resolve(ok,m,...rest);redeseneaza();finalJos()},
        giveUp(html){if(!verificat())noteaza(false);arata();api.giveUp(html);redeseneaza();finalJos()},
        revealButton(fn){if(!verificat())return;api.revealButton(fn)}
      });
      curent={id,body};
      panou(id,body);
      delete body._rezolva;delete body._gresit;delete body._inst;delete body._eviAlege;   // motorul folosește același #body pentru toate itemii
      baza.render(Q2,body,api2);
      amprenta0=amprenta(body);
      if(verificat())arata();else ascunde();
      corecteazaViu(Q,body);   // X: lista vie fără „Încă n-ai deschis fereastra” când a fost deschisă cu alt buton
    },
    rezolva(Q,body){const b=window.SimPostaGmailDosare&&SimPostaGmailDosare.tip;return b?b.rezolva(Q,body):false},
    gresit(Q,body){const b=window.SimPostaGmailDosare&&SimPostaGmailDosare.tip;return b?b.gresit(Q,body):false}
  };
}

/* ---------------- alegerea (întrebări scurte; „ce faci și de ce?”) ---------------- */
const alegere={
  render(Q,body,api){
    css();
    const id=Q.proba,inProba=!!id&&ids().includes(id),verificat=()=>!!(inProba&&ST.prima[id]);
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.classList.remove('evi-ascuns');
    if(body._eviOb){try{body._eviOb.disconnect()}catch(e){}body._eviOb=null}
    body.innerHTML=`<div class="evi-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
    const bs=[...body.querySelectorAll('.opt')];
    const des=()=>bs.forEach(b=>{const on=+b.dataset.k===ales;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
    bs.forEach(b=>b.onclick=()=>{if(api.done())return;ales=+b.dataset.k;bs.forEach(z=>z.classList.remove('bad'));des()});
    const arataBun=()=>{bs.forEach(z=>z.disabled=true);const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.classList.add('ok')};
    const noteaza=ok=>{if(!inProba||verificat())return;pune(id,{teste:[{c:'alegere',ce:Q.ce||'răspunsul',puncte:+Q.puncte||0,ok:!!ok,lectia:Q.lectia||'',fel:'alegere',motiv:''}],ok:!!ok,netrimis:false})};
    const aj=()=>document.querySelector('.ajutor');
    if(inProba){curent={id,body};panou(id,body);if(!verificat()&&aj())aj().hidden=true}
    const gata=()=>{if(aj())aj().hidden=false;if(inProba){redeseneaza();finalJos()}};
    const nav=api.checkButton(()=>{
      if(ales===null){api.feedback('bad','<strong>Alege întâi o variantă.</strong> Apoi apasă „Verifică”.');return}
      if(inProba&&!verificat()&&asteapta(api))return;
      if(ales===Q.ok){noteaza(true);arataBun();nav.innerHTML='';api.resolve(true);gata()}
      else{noteaza(false);const b=body.querySelector(`.opt[data-k="${ales}"]`);if(b)b.classList.add('bad');
        api.resolve(false,(Q.mesaje&&Q.mesaje[ales])||'Varianta aleasă nu e cea bună.');gata();
        api.revealButton(()=>{ales=Q.ok;des();arataBun();nav.innerHTML='';api.giveUp(Q.html?Q.o[Q.ok]:esc(Q.o[Q.ok]))})}
    });
    delete body._rezolva;delete body._gresit;delete body._inst;
    body._eviAlege={pune:k=>{ales=k;des()},ales:()=>ales===null?'nimic':String(ales)};
  },
  rezolva(Q,body){if(!body._eviAlege)return false;body._eviAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._eviAlege)return false;body._eviAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

function configureaza(c){CFG=Object.assign({titlu:'Proba de antrenament',oficiu:10,parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},itemi:[]},c||{});
  const P={};CFG.itemi.forEach(it=>{P[it.parte]=(P[it.parte]||0)+(+it.puncte||0)});
  Object.keys(CFG.parti).forEach(k=>{if((P[k]||0)!==CFG.parti[k].max)console.warn('eval-internet-vi: partea '+k+' are '+(P[k]||0)+' p în itemi, nu '+CFG.parti[k].max)})}
window.EvalInternet={configureaza,posta:posta(),alegere,dosare,corecteaza:(Q,body)=>corecteazaLista(Q,body),nota,nivel,goleste:()=>{goleste('');redeseneaza()},
  stare:()=>({prima:JSON.parse(JSON.stringify(ST.prima)),completa:completa(),nota:ST.nota,curent:curent&&curent.id,parti:peParti(),
    intreaba:ST.intreaba?Object.assign({},ST.intreaba):null,ora:ST.ora})};
})();
