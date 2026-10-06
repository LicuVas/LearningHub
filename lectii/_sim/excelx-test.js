/* lectii/_sim/excelx-test.js — „proba de antrenament cu punctaj” peste foile excelx (lecția VIII / M2 / nr. 13,
   „Evaluare sumativă: calcul tabelar”). PROPRIETAR: autorul lecției VIII/13.
   NU schimbă motorul (_motor/*), excelx.js, extensiile altor lecții (excelx-formule/-functii/-decizie/-sortare/-grafic)
   și nici componenta comună rezultat-elev.js: doar le ÎNVELEȘTE, prin interfața lor publică (render/rezolva/gresit și
   api-ul motorului).
   ÎNCĂRCARE (după foile folosite și după rezultat-elev.js):
     <script src="../../_sim/rezultat-elev.js"></script> <script src="../../_sim/excelx-test.js"></script>
     ExcelTest.configureaza({cheie:'viii-m2-l13-proba', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:20},…]});
     tipuri:{excelxf:ExcelTest.punctat(ExcelF), …, alegere:ExcelTest.punctat(ExcelTest.alegere)}
   CÂMPURI pe exercițiu: proba:'C1' (id-ul itemului); teste[i].puncte (punctele testului); teste[i].lectia (unde se
   recitește: „lecția 8, pasul «…»”); teste[i].ceInainte (textul testului PÂNĂ la prima verificare, când textul adevărat
   ar da răspunsul: „Graficul ia datele potrivite din tabel” în loc de „… fără rândul Total: A1:B5”);
   mesajZona:{rand, text} (foile cu grafic: dacă zona graficului ajunge la rândul `rand` sau mai jos, mesajul comun
   „… fără rânduri goale” se înlocuiește cu `text`, adevărat pentru greșeala făcută); mesajLimita:a=>'…' (foile cu IF:
   fraza comună „Scrie în foaie chiar numărul din regulă …” se înlocuiește cu ce scrii, în ce celule, pentru celula a).
   Pentru `alegere`: q, o:[…], ok (indicele bun), mesaje:{indice:'…'}, ce, lectia, why.

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4, regula profesorului; LearningHub/_campaign/notare_punctaj_2026_09_29/
   REGULA_NOUA.md): partea C = De bază (40 p), B = Consolidat (30 p), A = Avansat (20 p), 10 din oficiu; nota = punctaj : 10,
   rotunjită la cel mai apropiat întreg, la ,5 în favoarea elevului (85 -> 9, 75 -> 8, 74 -> 7); nivelul se citește din
   notă: 9-10 A · Avansat, 7-8 B · Consolidat, 5-6 C · De bază, 3-4 D1 · În formare, 1-2 D2 · În dificultate.
   CE FACE:
   1. Punctele unui exercițiu se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică” (ca la lucrare, unde predai o
      dată): suma punctelor testelor bifate în clipa aceea; dacă foaia a primit răspunsul („Corect”), toate punctele.
      Ce repară elevul după aceea e exercițiu, nu mai schimbă punctele (regula 23: prima încercare nu se șterge).
      „Verifică” pe o foaie NEATINSĂ (la fel ca la început, fără grafic nou) nu socotește nimic: spune doar că foaia e
      neatinsă (judecata 1, E: o apăsare din greșeală dădea 0 pe tot exercițiul).
   2. Până la prima verificare, bifele testelor și indiciul („Am nevoie de un indiciu”) NU se văd: la lucrare nu ai nici
      bife, nici indicii. Lista testelor rămâne, ca „ce se verifică”, cu textele `ceInainte` acolo unde textul adevărat
      ar da răspunsul (judecata 1, A). După prima verificare apar bifele, indiciul și textele adevărate.
   3. Panoul probei, deasupra fiecărui exercițiu: unde ești, punctele de până acum, iar la final punctajul, nota, nivelul
      și „unde ai pierdut puncte”, cu lecția de recitit.
   4. Când TOȚI itemii au puncte, rezultatul (cu un semn unic) se salvează O DATĂ prin RezultatElev.salveaza(cheie, …)
      (componenta comună: prima probă = diagnosticul, ce vine după = reîncercare; numele, „Ești X?”, „Sunt alt elev” le
      face ea). Panoul final (punctajul probei de pe ecran) se arată NUMAI dacă RezultatElev.citeste(cheie) întoarce chiar
      proba aceasta pentru elevul de acum (același semn). Altfel proba de pe ecran se golește, iar ce e salvat se vede în
      rândul „Prima ta probă”, cu lista „unde ai pierdut puncte” (citită din ce e salvat, deci rămâne și după reîncărcare).
   5. Proba începe din nou (de la C1): când deschizi primul item după o probă completă; cu butonul „Sunt alt elev / Încep
      din nou” (RezultatElev.golesteAlElevuluiDeAcum); când elevul din caseta prezenta.js se schimbă (Ana -> nimeni ->
      Dan) și proba e gata sau începută de cel dinainte (judecata 1, C). Cu caseta golită („Nu ești tu? Schimbă
      elevul”), o probă gata a celui dinainte, încă neconfirmată, e dată componentei ca „a cui?” (nu se șterge).
      Întoarcerea la C1 folosește JocMotor.test.exercitiu(0) (motorul nu are altă cale); după ea se verifică dacă C1 e
      chiar pe ecran. Dacă nu, panoul spune adevărul (treci cu „Încă un exercițiu”), iar până la C1 nu se socotesc puncte.
   Global: window.ExcelTest {configureaza, punctat, alegere, nota, nivel, stare}. */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let CFG=null;
const ST={scor:{},pierdute:{},salvat:false,ultima:null,nota:'',laC1:false};   // proba ÎN CURS, în încărcarea asta a paginii
let cineAcum;   // cheia identității din prezenta.js, ca să golim proba la schimbarea elevului

const nota=p=>Math.min(10,Math.max(1,Math.floor(p/10+0.5)));
const nivel=n=>n>=9?'A · Avansat':n>=7?'B · Consolidat':n>=5?'C · De bază':n>=3?'D1 · În formare':'D2 · În dificultate';
const item=id=>CFG&&CFG.itemi.find(x=>x.id===id);
const primul=()=>CFG.itemi[0].id;
const completa=()=>!!CFG&&CFG.itemi.every(it=>ST.scor[it.id]!==undefined);
const inceputa=()=>!!CFG&&CFG.itemi.some(it=>ST.scor[it.id]!==undefined);
const virgula=x=>String(x).replace('.',',');
const pct=n=>n===1?'un punct':n<20?`${n} puncte`:`${n} de puncte`;
const golesteProba=()=>{ST.scor={};ST.pierdute={};ST.salvat=false;ST.ultima=null};
const semnNou=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);

function configureaza(c){CFG=c;css();
  const s=Object.keys(c.parti).reduce((a,k)=>a+c.parti[k].max,0)+c.oficiu;
  if(s!==100)console.warn('excelx-test: părțile + oficiul fac',s,'nu 100');
  Object.keys(c.parti).forEach(k=>{const t=c.itemi.filter(it=>it.parte===k).reduce((a,it)=>a+it.puncte,0);
    if(t!==c.parti[k].max)console.warn('excelx-test: partea',k,'are itemi de',t,'p, nu',c.parti[k].max)});
  try{cineAcum=JSON.stringify(window.Prezenta&&window.Prezenta.identitate?window.Prezenta.identitate():null)}catch(e){cineAcum='null'}
  try{if(window.RezultatElev)window.RezultatElev.citeste(c.cheie)}catch(e){}   // componenta află cheia paginii („e a ta?”)
}

function socoteste(){
  const parti={};Object.keys(CFG.parti).forEach(k=>parti[k]=0);
  CFG.itemi.forEach(it=>{parti[it.parte]+=ST.scor[it.id]});
  const p=Object.keys(parti).reduce((a,k)=>a+parti[k],0)+CFG.oficiu,n=nota(p);
  return {semn:semnNou(),puncte:p,nota:n,nivel:nivel(n),parti,
    itemi:Object.fromEntries(CFG.itemi.map(it=>[it.id,{p:ST.scor[it.id],max:it.puncte,pierdute:ST.pierdute[it.id]||[]}]))};
}
const REZ=()=>{try{return window.RezultatElev&&CFG?window.RezultatElev.citeste(CFG.cheie):null}catch(e){return null}};
const ASTEAPTA=()=>{try{return window.RezultatElev&&window.RezultatElev.asteaptaConfirmare&&CFG?window.RezultatElev.asteaptaConfirmare(CFG.cheie):null}catch(e){return null}};
/* proba de pe ecran e a elevului de acum doar dacă RezultatElev i-o arată LUI (aceeași probă, după semn) */
function aLui(){
  if(!ST.ultima)return false;
  if(!window.RezultatElev)return true;   // fără componentă (pagina deschisă fără ea): nimic de comparat
  const r=REZ(),s=ST.ultima.semn;if(!r)return false;
  return !!((r.rezultat&&r.rezultat.semn===s)||(r.reincercare&&r.reincercare.semn===s));
}

/* punctele unui exercițiu, la prima verificare */
function noteaza(Q,body,ok){
  const it=item(Q.proba);if(!it||ST.laC1||ST.scor[it.id]!==undefined)return;
  let p=0;const pierd=[];
  if(Array.isArray(Q.teste)&&Q.teste.length){
    const lis=[...body.querySelectorAll('.xp-teste li, .xg-teste li, .xs-teste li')];
    const potrivite=lis.length===Q.teste.length;
    if(!potrivite)console.warn('excelx-test:',Q.proba,'are',Q.teste.length,'teste, dar pe ecran sunt',lis.length);
    Q.teste.forEach((T,i)=>{const bun=ok||(potrivite&&lis[i].classList.contains('ok'));
      if(bun)p+=T.puncte||0;else pierd.push({ce:T.ce,puncte:T.puncte||0,lectia:T.lectia||''})});
  }else if(ok)p=it.puncte;
  else pierd.push({ce:Q.ce||Q.proba,puncte:it.puncte,lectia:Q.lectia||''});
  ST.scor[it.id]=Math.min(p,it.puncte);ST.pierdute[it.id]=pierd;ST.nota='';
  if(completa()&&!ST.salvat){ST.salvat=true;const r=socoteste();ST.ultima=r;
    try{if(window.RezultatElev)window.RezultatElev.salveaza(CFG.cheie,r)}catch(e){console.warn('excelx-test: salvarea',e)}}
}

/* foaia neatinsă: aceleași texte în celule și același număr de grafice ca la deschidere */
const amprenta=body=>{const w=body.querySelector('#xwrap');if(!w)return null;
  const c=[...w.querySelectorAll('td[data-a]')];if(!c.length)return null;
  return c.map(t=>t.textContent).join('\u0001')+'\u0002'+body.querySelectorAll('.xg-ob').length};

/* mesajele comune ale foilor, înlocuite cu unele adevărate pentru exercițiul probei (fără a schimba foile) */
function mesaj(Q,ok,msg){let m=msg||'';if(ok||typeof m!=='string')return m;
  if(Q.mesajZona)m=m.replace(/^Graficul ia datele din [A-Z]+\d+:[A-Z]+(\d+), dar aici trebuie [\s\S]*$/,(s,r2)=>+r2>=Q.mesajZona.rand?Q.mesajZona.text:s);
  if(typeof Q.mesajLimita==='function')m=m.replace(/Scrie în foaie chiar numărul din regulă și uită-te ce arată ([A-Z]+\d+)\./,(s,a)=>Q.mesajLimita(a)||s);
  return m}

/* ---------- panoul probei ---------- */
/* ținte de cel puțin 32 px (regula 20) în paginile cu proba: linkul de descărcare devine buton (în lecție); aici,
   celulele și butoanele mici ale foilor, numai pe ecranele cu atingere și numai în paginile care încarcă extensia */
const CSS=`.xpb-panou{border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper);padding:10px 12px;margin:0 0 12px;font-size:.95rem}
.xpb-panou .xpb-sus{font-weight:700;margin:0 0 6px}
.xpb-panou .xpb-sus small{font-weight:400;color:var(--ink2)}
.xpb-itemi{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0 0 6px;padding:0}
.xpb-itemi li{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-family:var(--fm);font-size:.85rem;background:var(--paper2);white-space:nowrap}
.xpb-itemi li.acum{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.xpb-itemi li.gata{background:var(--okbg)}
.xpb-panou p{margin:.35em 0}
.xpb-panou .xpb-final{border-top:1px dashed var(--line);margin-top:8px;padding-top:8px}
.xpb-panou .xpb-mare{font-size:1.05rem}
.xpb-panou details{margin:.4em 0}
.xpb-panou details summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-weight:600}
.xpb-panou ul.xpb-pierd{margin:.3em 0 .3em 1.1em;padding:0}
.xpb-panou ul.xpb-pierd li{margin:.2em 0}
.xpb-panou .xpb-salvat{background:var(--paper2);border-radius:6px;padding:6px 8px;margin:8px 0 6px}
.xpb-panou .xpb-alt{margin-top:4px;min-height:36px}
.xpb-ceverif{display:none;font-weight:700;font-size:.9rem;margin:0 0 4px}
#body.xpb-ascuns .xpb-ceverif{display:block}
#body.xpb-ascuns .xp-teste .lbl,#body.xpb-ascuns .xg-teste .lbl,#body.xpb-ascuns .xs-teste .lbl,#body.xpb-ascuns .xp-sr,#body.xpb-ascuns .xs-sr,#body.xpb-ascuns .xg-sr{display:none}
#body.xpb-ascuns .xp-teste li,#body.xpb-ascuns .xg-teste li,#body.xpb-ascuns .xs-teste li{color:var(--ink2)!important;font-weight:400!important}
#body.xpb-ascuns .xp-teste li>span[aria-hidden],#body.xpb-ascuns .xg-teste li>span[aria-hidden],#body.xpb-ascuns .xs-teste li>span[aria-hidden]{visibility:hidden}
.xpb-opts{display:grid;gap:8px;margin:6px 0}
.xpb-opts .opt{min-height:44px}
@media (pointer:coarse){
  #body .xl .gw td[data-a]{min-width:32px}
  #body .xl .gw tbody tr th{min-width:32px;box-sizing:border-box}
  #body .xl .gw thead th{height:32px}
  #body .pg .pg-b{min-height:32px;min-width:32px}
  #body .pg .pg-camp,#body .pg .pg-camp select{min-height:32px!important;height:32px!important;max-height:none!important;box-sizing:border-box}
}`;
function css(){if(!document.getElementById('xpb-css')){const s=document.createElement('style');s.id='xpb-css';s.textContent=CSS;document.head.appendChild(s)}}

const linieRez=r=>`<b>${pct(r.puncte)}</b> → nota <b>${r.nota}</b> · ${esc(r.nivel)}`;
/* „unde ai pierdut puncte”, din punctele salvate (r.itemi), deci la fel pe ecran și după reîncărcare */
function listaPierdute(itemi){
  if(!itemi)return '';
  const l=CFG.itemi.map(it=>({it,l:itemi[it.id]&&Array.isArray(itemi[it.id].pierdute)?itemi[it.id].pierdute:[]})).filter(x=>x.l.length);
  return l.length?`<ul class="xpb-pierd">${l.map(x=>x.l.map(t=>`<li><b>${esc(x.it.id)}</b>, ${pct(+t.puncte||0)}: ${esc(t.ce)}${t.lectia?` — recitește ${esc(t.lectia)}.`:''}</li>`).join('')).join('')}</ul>`:'';
}
function textFinal(r){
  const P=Object.keys(CFG.parti).map(k=>`${k} ${r.parti[k]} din ${CFG.parti[k].max}`).join(' + ');
  const imp=r.puncte/10,intreg=Number.isInteger(imp),jumate=!intreg&&Math.abs(imp*10%10)===5;
  const cum=intreg?'':jumate?' (la ,5 nota se rotunjește în favoarea ta)':' (rotunjit la cel mai apropiat număr întreg)';
  const lista=listaPierdute(r.itemi);
  return `<div class="xpb-final"><p class="xpb-mare"><b>Punctajul probei:</b> ${P} + ${CFG.oficiu} din oficiu = <b>${pct(r.puncte)}</b>.</p>
<p>Nota = ${r.puncte} : 10 = ${virgula(imp)} → <b>nota ${r.nota}</b>${cum}. Nivelul, citit din notă: <b>${esc(r.nivel)}</b>.</p>
${lista?`<details open><summary>Unde ai pierdut puncte și ce recitești</summary>${lista}</details>`:'<p>N-ai pierdut niciun punct la exerciții.</p>'}
<p class="hint">E nota pe antrenament. Nota adevărată o dă profesorul, la lucrare.</p></div>`;
}
function textSalvat(){
  const r=REZ();
  if(r&&r.rezultat&&typeof r.rezultat.puncte==='number'){
    const re=r.reincercare&&typeof r.reincercare.puncte==='number'?r.reincercare:null;
    /* prima probă e chiar cea din panoul final: lista ei e deja acolo */
    const eAcum=completa()&&ST.ultima&&r.rezultat.semn===ST.ultima.semn;
    const lista=eAcum?'':listaPierdute(r.rezultat.itemi);
    return `<div class="xpb-salvat"><b>Prima ta probă${r.ora?`, de la ora ${esc(r.ora)}`:''}:</b> ${linieRez(r.rezultat)}. Ea rămâne punctul tău de pornire.${lista?`<details><summary>Unde ai pierdut puncte la prima probă</summary>${lista}</details>`:''}${re?`<br><b>Ultima reîncercare${r.oraReincercare?`, de la ora ${esc(r.oraReincercare)}`:''}:</b> ${linieRez(re)}.`:''}</div>`;
  }
  const a=ASTEAPTA();
  if(a)return `<div class="xpb-salvat">Pe calculator e proba lui <b>${esc(a.elev)}</b>, de la ora <b>${esc(a.ora)}</b>. Dacă ești ${esc(a.elev)}, apasă sus „Da” ca s-o vezi.</div>`;
  return '';
}
function deseneaza(el,id){
  if(!el||!el.isConnected||!CFG)return;
  /* proba gata de pe ecran, pe care RezultatElev n-o mai arată elevului de acum (alt elev, 8 minute fără atingere,
     „Ești X?” fără răspuns după o reîncărcare): nu se mai arată; ce e salvat rămâne la „Prima ta probă” */
  if(completa()&&ST.ultima&&!aLui()){golesteProba();
    ST.nota='Rezultatul probei nu se mai arată aici: pagina nu știe dacă ești tot elevul care a dat-o. Dacă ești tu, răspunde sus la întrebare și îl vezi mai jos, la „Prima ta probă”.'}
  const it=item(id),P=CFG.parti[it.parte],scorat=ST.scor[id]!==undefined;
  const chips=CFG.itemi.map(x=>{const s=ST.scor[x.id];return `<li class="${x.id===id?'acum':''}${s!==undefined?' gata':''}">${esc(x.id)} ${s!==undefined?s:'—'}/${x.puncte}</li>`}).join('');
  let h=`<p class="xpb-sus">Proba de antrenament · ${esc(it.id)}: partea ${esc(it.parte)} · ${esc(P.nume)}, ${pct(it.puncte)} <small>(${CFG.itemi.length} exerciții, ${pct(Object.keys(CFG.parti).reduce((a,k)=>a+CFG.parti[k].max,0))} + ${CFG.oficiu} din oficiu)</small></p>
<ul class="xpb-itemi" aria-label="Punctele pe exerciții">${chips}</ul>`;
  if(ST.nota){h+=`<p class="hint">${ST.nota}</p>`}
  if(ST.laC1&&id!==primul())h+=`<p><b>Proba nouă începe de la ${esc(primul())}.</b> Aici nu se socotesc puncte. Treci la ${esc(primul())} cu <b>Încă un exercițiu</b> (apare după ce rezolvi exercițiul sau după „Arată-mi răspunsul”).</p>`;
  else if(!scorat)h+=`<p>Lucrează până termini tot exercițiul, apoi apasă <b>Verifică</b>. Punctele se socotesc la <b>prima</b> apăsare. Abia după ea vezi bifele testelor și indiciul, ca la lucrare. Dacă apeși pe foaia neatinsă, nu se socotește nimic.</p>`;
  else{const l=ST.pierdute[id]||[];
    h+=`<p>La ${esc(id)} ai primit <b>${ST.scor[id]} din ${it.puncte}</b>${l.length?'':' (tot)'} — socotite la prima verificare. Poți repara mai departe, dar punctele rămân.${!completa()?' Apoi treci la exercițiul următor.':''}</p>`}
  if(completa()&&ST.ultima)h+=textFinal(ST.ultima);
  h+=textSalvat();
  h+=`<div data-rezultat-elev-intrebare></div><button type="button" class="btn ghost sm xpb-alt">Sunt alt elev / Încep din nou</button>`;
  el.innerHTML=h;
  el.querySelector('.xpb-alt').onclick=()=>{
    try{if(window.RezultatElev)window.RezultatElev.golesteAlElevuluiDeAcum(CFG.cheie)}catch(e){}
    laInceput('Proba începe din nou, de la primul exercițiu.');
  };
}
let panouAcum=null;   // {el,id} — panoul exercițiului de pe ecran
const redeseneaza=()=>{if(panouAcum)deseneaza(panouAcum.el,panouAcum.id)};
const peEcran=()=>!!(panouAcum&&panouAcum.el&&panouAcum.el.isConnected);
/* întoarcerea la C1: motorul n-are o cale publică, doar cârligul lui de test; după el verificăm că C1 e chiar pe ecran */
function mergiLaC1(){
  try{const s=window.JocMotor&&JocMotor.test&&JocMotor.test.stare&&JocMotor.test.stare();
    if(s&&s.mode==='practice'&&peEcran())JocMotor.test.exercitiu(0)}catch(e){}
  if(peEcran()&&panouAcum.id===primul())return true;
  ST.nota=(ST.nota?ST.nota+' ':'')+'Pagina nu te-a putut duce singură la '+primul()+'.';redeseneaza();return false;
}
function laInceput(n){golesteProba();ST.nota=n;ST.laC1=true;
  if(peEcran())mergiLaC1();   // altfel: la următorul exercițiu al probei deschis (vezi punctat.render)
}
/* schimbarea elevului din caseta prezenta.js. O vedem din oricare eveniment sosește întâi: componenta comună își
   are ascultătorul de `prezenta` înaintea noastră și trimite `rezultat-elev` înainte să ajungă `prezenta` la noi.
   Aceeași formă a cheii în ambele: e.detail ESTE Prezenta.identitate() (assets/js/prezenta.js). */
const cineE=()=>{try{return JSON.stringify(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}};
function elevNou(k){const inainte=cineAcum;cineAcum=k;
  if(!(CFG&&k!==inainte&&inceputa()&&(completa()||(inainte&&inainte!=='null'))))return false;
  /* caseta golită („Nu ești tu? Schimbă elevul”): o probă gata a celui dinainte, încă neconfirmată, devine „a cui?”
     în componentă (nu se șterge), ca să nu i se arate celui care vine */
  if(k==='null'&&completa()){try{const s=window.Prezenta&&Prezenta.stare?Prezenta.stare():'';
    if(s!=='activ'&&s!=='intreaba'&&window.RezultatElev)window.RezultatElev.golesteAlElevuluiDeAcum(CFG.cheie)}catch(x){}}
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la primul exercițiu.');
  return true}
addEventListener('rezultat-elev',()=>{if(!elevNou(cineE()))redeseneaza()});
addEventListener('prezenta',e=>{let k;try{k=JSON.stringify(e.detail||null)}catch(x){k='null'}if(!elevNou(k))redeseneaza()});

/* ---------- învelitoarea: punctele la prima verificare ---------- */
function punctat(baza){
  return {
    render(Q,body,api){
      const it=item(Q.proba);
      if(!it){body.classList.remove('xpb-ascuns');return baza.render(Q,body,api)}
      css();
      if(it.id===primul()){ST.laC1=false;if(completa()){golesteProba();ST.nota='Ai început o probă nouă. Prima probă rămâne salvată ca punct de pornire.'}}
      const scorat=()=>ST.scor[it.id]!==undefined;
      /* textele testelor până la prima verificare (ceInainte), ca lista să nu dea răspunsul */
      const Q2=!scorat()&&Array.isArray(Q.teste)&&Q.teste.some(T=>T.ceInainte)?Object.assign({},Q,{teste:Q.teste.map(T=>Object.assign({},T,{ce:T.ceInainte||T.ce}))}):Q;
      const textAdevarat=()=>{if(Q2===Q)return;
        Q2.teste.forEach((T,i)=>{const real=Q.teste[i].ce;if(T.ce===real)return;const vechi=T.ce;T.ce=real;
          body.querySelectorAll('.xp-teste li, .xg-teste li, .xs-teste li').forEach(li=>{if(li.innerHTML.includes(vechi))li.innerHTML=li.innerHTML.split(vechi).join(real)})})};
      const aj=body.parentNode?body.parentNode.querySelector(':scope > .ajutor'):null;
      const arata=()=>{body.classList.remove('xpb-ascuns');if(aj)aj.hidden=false;textAdevarat()};
      if(scorat())arata();else{body.classList.add('xpb-ascuns');if(aj)aj.hidden=true}
      let el=null,start=null;
      const dupa=()=>{if(el)deseneaza(el,it.id)};
      const focusFoaie=()=>setTimeout(()=>{const g=body.querySelector('#xgw')||body.querySelector('#xwrap');if(g)try{g.focus({preventScroll:true})}catch(e){}},0);
      const api2=Object.assign({},api,{
        resolve(ok,msg){let m=mesaj(Q,ok,msg);
          if(ST.laC1&&it.id!==primul()){arata();api.resolve(ok,m+' <br><i>Aici nu se socotesc puncte: proba nouă începe de la '+esc(primul())+'.</i>');dupa();return}
          if(!scorat()){
            const acum=amprenta(body);
            if(!ok&&start!==null&&acum!==null&&acum===start){
              api.feedback('bad','<strong>Foaia e la fel ca la început.</strong> Punctele nu s-au socotit: fă exercițiul, apoi apasă „Verifică”.');dupa();focusFoaie();return}
            noteaza(Q,body,!!ok);arata();if(!ok)m+=` <br><b>Puncte la ${esc(it.id)}: ${ST.scor[it.id]} din ${it.puncte}</b>, socotite acum, la prima verificare. Poți repara mai departe, dar punctele rămân.`}
          api.resolve(ok,m);dupa()},
        giveUp(html){if(!scorat()&&!ST.laC1){noteaza(Q,body,false)}arata();api.giveUp(html);dupa()}
      });
      baza.render(Q2,body,api2);
      start=amprenta(body);
      el=document.createElement('div');el.className='xpb-panou';el.setAttribute('aria-live','polite');
      body.insertBefore(el,body.firstChild);panouAcum={el,id:it.id};deseneaza(el,it.id);
      /* „ce se verifică”, deasupra listei de teste, cât bifele sunt ascunse */
      const box=body.querySelector('.xp-teste, .xg-teste, .xs-teste');
      if(box&&!body.querySelector('.xpb-ceverif')){const c=document.createElement('p');c.className='xpb-ceverif';
        c.textContent='Ce se verifică (bifele apar după prima apăsare pe „Verifică”):';box.parentNode.insertBefore(c,box)}
      /* proba a fost golită cât elevul era în altă parte a paginii: înapoi la C1 */
      if(ST.laC1&&it.id!==primul())setTimeout(()=>{if(ST.laC1&&peEcran()&&panouAcum.id===it.id)mergiLaC1()},0);
    },
    rezolva(Q,body,api){return baza.rezolva?baza.rezolva(Q,body,api):false},
    gresit(Q,body,api){return baza.gresit?baza.gresit(Q,body,api):false}
  };
}

/* ---------- alegerea punctată (explicația de la partea A: „de ce?”) ---------- */
const alegere={
  render(Q,body,api){
    css();
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.innerHTML=`<div class="xpb-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
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
    body._xtAlege={pune:k=>{ales=k;des()}};
  },
  rezolva(Q,body){if(!body._xtAlege)return false;body._xtAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._xtAlege)return false;body._xtAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

window.ExcelTest={configureaza,punctat,alegere,nota,nivel,
  stare:()=>({scor:Object.assign({},ST.scor),completa:completa(),laC1:ST.laC1,ultima:ST.ultima?JSON.parse(JSON.stringify(ST.ultima)):null})};
})();
