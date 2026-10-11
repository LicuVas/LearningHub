/* lectii/_sim/wordobj-proba.js — „proba de antrenament cu punctaj” peste Word-urile simulate ale clasei a VII-a
   (lecția VII / M2 / nr. 10, „Evaluare sumativă: tehnoredactare”, 10-11.10.2026). PROPRIETAR: autorul lecției VII/10.
   Pornit din lectii/_sim/excelx-test.js (proprietar VIII/13, judecat de 4 ori pe 06.10.2026): aceleași reguli de punctaj,
   aceeași legătură cu rezultat-elev.js; schimbat doar ce ține de Word (lista testelor, documentul neatins, stilul).
   NU schimbă motorul (_motor/*), wordobj.js, wordobj-formatare.js, wordobj-pagina.js, wordobj-hartie.js,
   wordobj-tehnoredactare.js și nici componenta comună rezultat-elev.js: doar le ÎNVELEȘTE, prin interfața lor publică
   (render/rezolva/gresit, api-ul motorului, lista .wo-teste pe care o desenează fiecare și mânerul body._w*.stare()).

   ÎNCĂRCARE (după simulatoarele Word folosite și după rezultat-elev.js):
     <script src="../../_sim/rezultat-elev.js"></script> <script src="../../_sim/wordobj-proba.js"></script>
     WordProba.configureaza({cheie:'vii-m2-l10-proba', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:20},…]});
     tipuri:{probafmt:WordProba.punctat(TipWordFormat), probaobj:WordProba.punctat(TipWordObiecte), …,
             probaalege:WordProba.punctat(WordProba.alegere)}

   CÂMPURI pe exercițiu (pe lângă configurația simulatorului):
     proba:'C1'                       id-ul itemului;
     punctaj:[{puncte, lectia, ceInainte?}, …]
                                      câte unul pentru FIECARE test desenat de simulator, în ordinea lui (lista .wo-teste);
                                      sau, la simulatoarele cu `verif`, aceleași câmpuri direct pe fiecare verif[i]
                                      (puncte, lectia, ceInainte). Dacă numărul testelor de pe ecran nu se potrivește,
                                      se scrie un avertisment în consolă și punctele se dau doar pe „Corect”.
     ceInainte                        textul testului PÂNĂ la prima verificare, acolo unde textul adevărat ar spune ce e
                                      greșit (partea A, situația nouă). După prima verificare apare textul adevărat.
     ceInainteUnul:'…' (pe exercițiu) până la prima verificare lista are UN SINGUR rând, cu textul acesta (11.10.2026).
     paza:true (pe test)              test „n-ai stricat” (textul a rămas, nimic în plus): punctele lui se dau DOAR dacă
                                      a trecut și un test de lucru cu puncte (11.10.2026). Un test cu puncte:0 e doar bifă.
     conditie:{prag:N} (pe test)      ca mai sus, dar paza se oprește DOAR dacă diferența față de textul de pornire (Q.tinta) e
                                      de PESTE N litere și semne (fără spații: prefix și sufix comun tăiate, apoi cel mai lung
                                      rest) - o scăpare (un Backspace) nu mai costă tot exercițiul (judecata 4, J4-M1,
                                      11.10.2026). conditie:true = prag 0 (orice diferență oprește paza). Dacă diferența nu
                                      se poate măsura, se poartă ca la prag 0.
     conditie:true (pe test)          test-condiție („lucrul e încă acolo”, ex. literele și semnele au rămas): dacă pică,
                                      testele cu paza:true din același exercițiu NU primesc punctele, ca și cum lucrul ar
                                      lipsi (judecata 3, J2-M1, 11.10.2026). Se socotesc doar testele de lucru.
   Pentru `alegere`: q, o:[…], ok (indicele bun), mesaje:{indice:'…'}, ce, lectia, why.

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4.1-4.3; LearningHub/_campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md):
   partea C = De bază (40 p), B = Consolidat (30 p), A = Avansat (20 p), 10 din oficiu; nota = punctaj : 10, rotunjită la
   cel mai apropiat întreg, la ,5 în favoarea elevului (85 -> 9, 75 -> 8, 74 -> 7); nivelul se citește din notă:
   9-10 A · Avansat, 7-8 B · Consolidat, 5-6 C · De bază, 3-4 D1 · În formare, 1-2 D2 · În dificultate.

   CE FACE (ca excelx-test.js):
   1. Punctele unui exercițiu se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică”: suma punctelor testelor bifate
      în clipa aceea; „Corect” = toate punctele. Ce repară elevul după aceea e exercițiu, nu mai schimbă punctele (regula 23).
      „Verifică” pe un document NEATINS (același document ca la deschidere: textul, formatarea, foaia, poza, tabelul) nu
      socotește nimic: spune doar că documentul e neatins.
   2. Până la prima verificare, bifele testelor și indiciul („Am nevoie de un indiciu”) NU se văd: la lucrare nu ai nici
      bife, nici indicii. Lista testelor rămâne, ca „ce se verifică”, cu textele `ceInainte` acolo unde e cazul.
   3. Panoul probei, deasupra fiecărui exercițiu: unde ești, punctele de până acum; la final punctajul, nota, nivelul și
      „unde ai pierdut puncte”, cu lecția de recitit.
   4. Când TOȚI itemii au puncte, rezultatul (cu un semn unic) se salvează O DATĂ prin RezultatElev.salveaza(cheie, …).
      Panoul final se arată NUMAI dacă RezultatElev.citeste(cheie) întoarce chiar proba aceasta pentru elevul de acum.
   5. Proba începe din nou (de la primul item): la redeschiderea lui după o probă gata; cu „Sunt alt elev / Încep din nou”
      (RezultatElev.golesteAlElevuluiDeAcum); când elevul din caseta prezenta.js se schimbă. Întoarcerea la primul item
      folosește JocMotor.test.exercitiu(0) (motorul n-are altă cale publică); după ea se verifică dacă itemul e chiar pe ecran.
   PENTRU LECȚIA URMĂTOARE care vrea o probă pe Word: încarcă fișierul, configureaz-o cu cheia ei, învelește tipurile cu
   WordProba.punctat(...). Nu schimba aici numele claselor (.wpb-*), cheia de salvare a altei lecții sau regulile 1-5.
   Global: window.WordProba {configureaza, punctat, alegere, nota, nivel, stare}. */
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
  if(s!==100)console.warn('wordobj-proba: părțile + oficiul fac',s,'nu 100');
  Object.keys(c.parti).forEach(k=>{const t=c.itemi.filter(it=>it.parte===k).reduce((a,it)=>a+it.puncte,0);
    if(t!==c.parti[k].max)console.warn('wordobj-proba: partea',k,'are itemi de',t,'p, nu',c.parti[k].max)});
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
  if(!window.RezultatElev)return true;
  const r=REZ(),s=ST.ultima.semn;if(!r)return false;
  return !!((r.rezultat&&r.rezultat.semn===s)||(r.reincercare&&r.reincercare.semn===s));
}

/* lista testelor desenată de simulator: wordteh are lista lui (.wt-teste), restul .wo-teste */
const listaTeste=body=>{const u=body.querySelector('ul.wt-teste')||body.querySelector('ul.wu-teste')||body.querySelector('ul.wo-teste');return u?[...u.querySelectorAll(':scope > li')]:[]};
/* datele de punctaj ale testului i: Q.punctaj[i] sau Q.verif[i] */
const meta=(Q,i)=>(Array.isArray(Q.punctaj)&&Q.punctaj[i])||(Array.isArray(Q.verif)&&Q.verif[i])||{};
const nrTeste=Q=>Array.isArray(Q.punctaj)?Q.punctaj.length:Array.isArray(Q.verif)?Q.verif.length:0;

/* câte litere și semne (fără spații) diferă documentul de pe ecran de Q.tinta; Infinity dacă nu se poate măsura (J4-M1) */
function difLitere(Q,body){
  try{const WF=window.TipWordFormat,h=body._wf||body._wo||body._wp||body._wh;
    if(!WF||!h||!h.stare||!Q.tinta)return Infinity;
    const lit=d=>d.map(p=>p.t).join('').replace(/\s+/g,'');
    const a=lit(WF.mk(Q.tinta)),b=lit(h.stare().doc);
    let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;
    let j=0;while(j<a.length-i&&j<b.length-i&&a[a.length-1-j]===b[b.length-1-j])j++;
    return Math.max(a.length-i-j,b.length-i-j)}
  catch(e){return Infinity}
}

/* punctele unui exercițiu, la prima verificare */
function noteaza(Q,body,ok){
  const it=item(Q.proba);if(!it||ST.laC1||ST.scor[it.id]!==undefined)return;
  let p=0;const pierd=[];const n=nrTeste(Q);
  if(n){
    const lis=listaTeste(body),potrivite=lis.length===n;
    if(!potrivite)console.warn('wordobj-proba:',Q.proba,'are',n,'teste punctate, dar pe ecran sunt',lis.length);
    /* testele-pază (paza:true: „textul a rămas”, „nimic în plus”) dau punctele lor DOAR dacă elevul a câștigat ceva și la
       un test de lucru: altfel orice schimbare mică le-ar lua pe gratis (judecata 1, 11.10.2026, J1-M2). Testele cu 0 puncte
       nu intră în „unde ai pierdut puncte” (rămân doar ca bifă în listă). */
    let lucru=0,paza=0,condPica=false;
    for(let i=0;i<n;i++){const T=meta(Q,i);if(T.conditie&&!(ok||(potrivite&&lis[i].classList.contains('ok')))){
      const pr=typeof T.conditie==='object'?(+T.conditie.prag||0):0;if(!pr||difLitere(Q,body)>pr)condPica=true}}
    for(let i=0;i<n;i++){const T=meta(Q,i),bun=ok||(potrivite&&lis[i].classList.contains('ok'));
      if(bun){if(T.paza){if(condPica){if(T.puncte)pierd.push({ce:(T.ceDupa||T.ce)+' (nu se socotește: ai șters litere ori semne din anunț)',puncte:T.puncte,lectia:T.lectia||''})}else paza+=T.puncte||0}else lucru+=T.puncte||0}
      else if(T.puncte)pierd.push({ce:T.ceDupa||T.ce||Q.proba,puncte:T.puncte,lectia:T.lectia||''})}
    if(lucru>0)p=lucru+paza;
    else{p=0;for(let i=0;i<n&&!condPica;i++){const T=meta(Q,i);if(T.paza&&T.puncte&&!pierd.some(x=>x.ce===(T.ceDupa||T.ce)))
      pierd.push({ce:(T.ceDupa||T.ce)+' (se socotește doar împreună cu lucrul cerut)',puncte:T.puncte,lectia:T.lectia||''})}}
  }else if(ok)p=it.puncte;
  else pierd.push({ce:Q.ce||Q.proba,puncte:it.puncte,lectia:Q.lectia||''});
  ST.scor[it.id]=Math.min(p,it.puncte);ST.pierdute[it.id]=pierd;ST.nota='';
  if(completa()&&!ST.salvat){ST.salvat=true;const r=socoteste();ST.ultima=r;
    try{if(window.RezultatElev)window.RezultatElev.salveaza(CFG.cheie,r)}catch(e){console.warn('wordobj-proba: salvarea',e)}}
}

/* documentul neatins: starea documentului din mânerul simulatorului (body._wp / _wh / _wf / _wo), ca la deschidere */
const amprenta=body=>{const h=body._wp||body._wh||body._wf||body._wo;if(!h||!h.stare)return null;
  try{return JSON.stringify(h.stare().doc)}catch(e){return null}};

/* ---------- panoul probei ---------- */
const CSS=`.wpb-panou{border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper);padding:10px 12px;margin:0 0 12px;font-size:.95rem}
.wpb-panou .wpb-sus{font-weight:700;margin:0 0 6px}
.wpb-panou .wpb-sus small{font-weight:400;color:var(--ink2)}
.wpb-itemi{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0 0 6px;padding:0}
.wpb-itemi li{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-family:var(--fm);font-size:.85rem;background:var(--paper2);white-space:nowrap}
.wpb-itemi li.acum{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.wpb-itemi li.gata{background:var(--okbg)}
.wpb-panou p{margin:.35em 0}
.wpb-panou .wpb-final{border-top:1px dashed var(--line);margin-top:8px;padding-top:8px}
.wpb-panou .wpb-mare{font-size:1.05rem}
.wpb-panou details{margin:.4em 0}
.wpb-panou details summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-weight:600}
.wpb-panou ul.wpb-pierd{margin:.3em 0 .3em 1.1em;padding:0}
.wpb-panou ul.wpb-pierd li{margin:.2em 0}
.wpb-panou .wpb-salvat{background:var(--paper2);border-radius:6px;padding:6px 8px;margin:8px 0 6px}
.wpb-panou .wpb-alt{margin-top:4px;min-height:36px}
.wpb-ceverif{display:none;font-weight:700;font-size:.9rem;margin:10px 0 4px}
#body.wpb-ascuns .wpb-ceverif{display:block}
#body.wpb-ascuns .wo-teste li{border-color:var(--line)!important;background:var(--paper)!important;color:var(--ink2)!important}
#body.wpb-ascuns .wo-teste li .ic{visibility:hidden}
#body.wpb-ascuns .wo-teste li .sr-only{display:none}
#body.wpb-ascuns.wpb-unul ul.wo-teste > li:not(:first-child){display:none}
.wpb-opts{display:grid;gap:8px;margin:6px 0}
.wpb-opts .opt{min-height:44px}`;
function css(){if(!document.getElementById('wpb-css')){const s=document.createElement('style');s.id='wpb-css';s.textContent=CSS;document.head.appendChild(s)}}

const linieRez=r=>`<b>${pct(r.puncte)}</b> → nota <b>${r.nota}</b> · ${esc(r.nivel)}`;
/* „unde ai pierdut puncte”, din punctele salvate (r.itemi), deci la fel pe ecran și după reîncărcare */
function listaPierdute(itemi){
  if(!itemi)return '';
  const l=CFG.itemi.map(it=>({it,l:itemi[it.id]&&Array.isArray(itemi[it.id].pierdute)?itemi[it.id].pierdute:[]})).filter(x=>x.l.length);
  return l.length?`<ul class="wpb-pierd">${l.map(x=>x.l.map(t=>`<li><b>${esc(x.it.id)}</b>, ${pct(+t.puncte||0)}: ${esc(t.ce)}${t.lectia?` — recitește ${esc(t.lectia)}.`:''}</li>`).join('')).join('')}</ul>`:'';
}
function textFinal(r){
  const P=Object.keys(CFG.parti).map(k=>`${k} ${r.parti[k]} din ${CFG.parti[k].max}`).join(' + ');
  const imp=r.puncte/10,intreg=Number.isInteger(imp),jumate=!intreg&&Math.abs(imp*10%10)===5;
  const cum=intreg?'':jumate?' (la ,5 nota se rotunjește în favoarea ta)':' (rotunjit la cel mai apropiat număr întreg)';
  const lista=listaPierdute(r.itemi);
  return `<div class="wpb-final"><p class="wpb-mare"><b>Punctajul probei:</b> ${P} + ${CFG.oficiu} din oficiu = <b>${pct(r.puncte)}</b>.</p>
<p>Nota = ${r.puncte} : 10 = ${virgula(imp)} → <b>nota ${r.nota}</b>${cum}. Nivelul, citit din notă: <b>${esc(r.nivel)}</b>.</p>
${lista?`<details open><summary>Unde ai pierdut puncte și ce recitești</summary>${lista}</details>`:'<p>N-ai pierdut niciun punct la exerciții.</p>'}
<p class="hint">E nota pe antrenament. Nota adevărată o dă profesorul, la lucrare.</p></div>`;
}
function textSalvat(){
  const r=REZ();
  if(r&&r.rezultat&&typeof r.rezultat.puncte==='number'){
    const re=r.reincercare&&typeof r.reincercare.puncte==='number'?r.reincercare:null;
    const eAcum=completa()&&ST.ultima&&r.rezultat.semn===ST.ultima.semn;
    const lista=eAcum?'':listaPierdute(r.rezultat.itemi);
    return `<div class="wpb-salvat"><b>Prima ta probă${r.ora?`, de la ora ${esc(r.ora)}`:''}:</b> ${linieRez(r.rezultat)}. Ea rămâne punctul tău de pornire.${lista?`<details><summary>Unde ai pierdut puncte la prima probă</summary>${lista}</details>`:''}${re?`<br><b>Ultima reîncercare${r.oraReincercare?`, de la ora ${esc(r.oraReincercare)}`:''}:</b> ${linieRez(re)}.`:''}</div>`;
  }
  const a=ASTEAPTA();
  if(a)return `<div class="wpb-salvat">Pe calculator e proba lui <b>${esc(a.elev)}</b>, de la ora <b>${esc(a.ora)}</b>. Dacă ești ${esc(a.elev)}, apasă sus „Da” ca s-o vezi.</div>`;
  return '';
}
function deseneaza(el,id){
  if(!el||!el.isConnected||!CFG)return;
  if(completa()&&ST.ultima&&!aLui()){golesteProba();
    ST.nota='Rezultatul probei nu se mai arată aici: pagina nu știe dacă ești tot elevul care a dat-o. Dacă ești tu, răspunde sus la întrebare și îl vezi mai jos, la „Prima ta probă”.'}
  const it=item(id),P=CFG.parti[it.parte],scorat=ST.scor[id]!==undefined;
  const chips=CFG.itemi.map(x=>{const s=ST.scor[x.id];return `<li class="${x.id===id?'acum':''}${s!==undefined?' gata':''}">${esc(x.id)} ${s!==undefined?s:'—'}/${x.puncte}</li>`}).join('');
  let h=`<p class="wpb-sus">Proba de antrenament · ${esc(it.id)}: partea ${esc(it.parte)} · ${esc(P.nume)}, ${pct(it.puncte)} <small>(${CFG.itemi.length} exerciții, ${pct(Object.keys(CFG.parti).reduce((a,k)=>a+CFG.parti[k].max,0))} + ${CFG.oficiu} din oficiu)</small></p>
<ul class="wpb-itemi" aria-label="Punctele pe exerciții">${chips}</ul>`;
  if(ST.nota){h+=`<p class="hint">${ST.nota}</p>`}
  if(ST.laC1&&id!==primul())h+=`<p><b>Proba nouă începe de la ${esc(primul())}.</b> Aici nu se socotesc puncte. Treci la ${esc(primul())} cu <b>Încă un exercițiu</b> (apare după ce rezolvi exercițiul sau după „Arată-mi răspunsul”).</p>`;
  else if(!scorat)h+=`<p>Lucrează până termini tot exercițiul, apoi apasă <b>Verifică</b>. Punctele se socotesc la <b>prima</b> apăsare. Abia după ea vezi bifele testelor și indiciul, ca la lucrare. Dacă apeși pe documentul neatins, nu se socotește nimic.</p>`;
  else{const l=ST.pierdute[id]||[];
    h+=`<p>La ${esc(id)} ai primit <b>${ST.scor[id]} din ${it.puncte}</b>${l.length?'':' (tot)'}: socotite la prima verificare. Poți repara mai departe, dar punctele rămân.${!completa()?' Apoi treci la exercițiul următor.':''}</p>`}
  if(completa()&&ST.ultima)h+=textFinal(ST.ultima);
  h+=textSalvat();
  h+=`<div data-rezultat-elev-intrebare></div><button type="button" class="btn ghost sm wpb-alt">Sunt alt elev / Încep din nou</button>`;
  el.innerHTML=h;
  el.querySelector('.wpb-alt').onclick=()=>{
    try{if(window.RezultatElev)window.RezultatElev.golesteAlElevuluiDeAcum(CFG.cheie)}catch(e){}
    laInceput('Proba începe din nou, de la primul exercițiu.');
  };
}
let panouAcum=null;   // {el,id} — panoul exercițiului de pe ecran
const redeseneaza=()=>{if(panouAcum)deseneaza(panouAcum.el,panouAcum.id)};
const peEcran=()=>!!(panouAcum&&panouAcum.el&&panouAcum.el.isConnected);
function mergiLaC1(){
  try{const s=window.JocMotor&&JocMotor.test&&JocMotor.test.stare&&JocMotor.test.stare();
    if(s&&s.mode==='practice'&&peEcran())JocMotor.test.exercitiu(0)}catch(e){}
  if(peEcran()&&panouAcum.id===primul())return true;
  ST.nota=(ST.nota?ST.nota+' ':'')+'Pagina nu te-a putut duce singură la '+primul()+'.';redeseneaza();return false;
}
function laInceput(n){golesteProba();ST.nota=n;ST.laC1=true;
  if(peEcran())mergiLaC1();
}
const cineE=()=>{try{return JSON.stringify(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}};
function elevNou(k){const inainte=cineAcum;cineAcum=k;
  if(!(CFG&&k!==inainte&&inceputa()&&(completa()||(inainte&&inainte!=='null'))))return false;
  if(k==='null'&&completa()){try{const s=window.Prezenta&&Prezenta.stare?Prezenta.stare():'';
    if(s!=='activ'&&s!=='intreaba'&&window.RezultatElev)window.RezultatElev.golesteAlElevuluiDeAcum(CFG.cheie)}catch(x){}}
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la primul exercițiu.');
  return true}
addEventListener('rezultat-elev',()=>{if(!elevNou(cineE()))redeseneaza()});
addEventListener('prezenta',e=>{let k;try{k=JSON.stringify(e.detail||null)}catch(x){k='null'}if(!elevNou(k))redeseneaza()});

/* textul vizibil al unui test (al doilea <span> din <li>, fără „— gata”) */
function puneTextLi(li,text){const s=li.querySelector(':scope > span:not(.ic)');if(!s)return;
  const sr=s.querySelector('.sr-only');s.textContent=text;if(sr)s.appendChild(sr)}

/* ---------- învelitoarea: punctele la prima verificare ---------- */
function punctat(baza){
  return {
    render(Q,body,api){
      const it=item(Q.proba);
      if(!it){body.classList.remove('wpb-ascuns','wpb-unul');return baza.render(Q,body,api)}
      css();
      if(it.id===primul()){ST.laC1=false;if(completa()){golesteProba();ST.nota='Ai început o probă nouă. Prima probă rămâne salvată ca punct de pornire.'}}
      const scorat=()=>ST.scor[it.id]!==undefined;
      /* textele testelor până la prima verificare (ceInainte), ca lista să nu spună ce e greșit */
      /* ceInainteUnul (pe exercițiu): până la prima verificare lista arată UN SINGUR rând general (primul test, cu textul
         acesta; celelalte ascunse), ca să nu enumere categoriile greșelilor (judecata 1, ab_sonnet, 11.10.2026) */
      const unul=Array.isArray(Q.verif)&&Q.verif.length&&Q.ceInainteUnul?Q.ceInainteUnul:'';
      const cuInainte=Array.isArray(Q.verif)&&(!!unul||Q.verif.some(v=>v&&v.ceInainte));
      const Q2=!scorat()&&cuInainte?Object.assign({},Q,{verif:Q.verif.map((v,i)=>Object.assign({},v,{ce:(i===0&&unul)||v.ceInainte||v.ce,ceDupa:v.ce}))}):Q;
      const textAdevarat=()=>{if(Q2===Q)return;const lis=listaTeste(body);
        Q2.verif.forEach((v,i)=>{const real=Q.verif[i].ce;if(v.ce===real)return;v.ce=real;if(lis[i])puneTextLi(lis[i],real)})};
      const aj=body.parentNode?body.parentNode.querySelector(':scope > .ajutor'):null;
      const arata=()=>{body.classList.remove('wpb-ascuns','wpb-unul');if(aj)aj.hidden=false;textAdevarat()};
      if(scorat())arata();else{body.classList.add('wpb-ascuns');body.classList.toggle('wpb-unul',!!unul);if(aj)aj.hidden=true}
      let el=null,start=null;
      const dupa=()=>{if(el)deseneaza(el,it.id)};
      const api2=Object.assign({},api,{
        resolve(ok,msg){let m=msg||'';
          if(ST.laC1&&it.id!==primul()){arata();api.resolve(ok,m+' <br><i>Aici nu se socotesc puncte: proba nouă începe de la '+esc(primul())+'.</i>');dupa();return}
          if(!scorat()){
            const acum=amprenta(body);
            if(!ok&&start!==null&&acum!==null&&acum===start){
              api.feedback('bad','<strong>Documentul e la fel ca la început.</strong> Punctele nu s-au socotit: fă exercițiul, apoi apasă „Verifică”.');dupa();return}
            noteaza(Q2,body,!!ok);arata();if(!ok)m+=` <br><b>Puncte la ${esc(it.id)}: ${ST.scor[it.id]} din ${it.puncte}</b>, socotite acum, la prima verificare. Poți repara mai departe, dar punctele rămân.`}
          api.resolve(ok,m);dupa()},
        giveUp(html){if(!scorat()&&!ST.laC1){noteaza(Q2,body,false)}arata();api.giveUp(html);dupa()}
      });
      /* motorul refolosește același #body la fiecare exercițiu: mânerul simulatorului de dinainte (de ex. body._wp de la B1)
         ar rămâne pe el și „documentul neatins” s-ar citi din exercițiul vechi (găsit de proba_gesturi.py: B2 cu greșeli,
         pe telefon, judecat „la fel ca la început”). Le scoatem; simulatorul de acum își pune mânerul lui la render. */
      ['_wp','_wh','_wf','_wo','_wt','_wu'].forEach(k=>{try{delete body[k]}catch(e){}});
      baza.render(Q2,body,api2);
      start=amprenta(body);
      el=document.createElement('div');el.className='wpb-panou';el.setAttribute('aria-live','polite');
      body.insertBefore(el,body.firstChild);panouAcum={el,id:it.id};deseneaza(el,it.id);
      /* „ce se verifică”, deasupra listei de teste, cât bifele sunt ascunse */
      const lis=listaTeste(body),box=lis.length?lis[0].parentNode:null;
      if(box&&!body.querySelector('.wpb-ceverif')){const c=document.createElement('p');c.className='wpb-ceverif';
        c.textContent='Ce se verifică (bifele apar după prima apăsare pe „Verifică”):';box.parentNode.insertBefore(c,box)}
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
    body.innerHTML=`<div class="wpb-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
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
    body._wpbAlege={pune:k=>{ales=k;des()}};
  },
  rezolva(Q,body){if(!body._wpbAlege)return false;body._wpbAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._wpbAlege)return false;body._wpbAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

window.WordProba={configureaza,punctat,alegere,nota,nivel,
  stare:()=>({scor:Object.assign({},ST.scor),completa:completa(),laC1:ST.laC1,ultima:ST.ultima?JSON.parse(JSON.stringify(ST.ultima)):null})};
})();
