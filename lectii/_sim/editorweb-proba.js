/* lectii/_sim/editorweb-proba.js — „proba de antrenament cu punctaj” peste simulatorul de pagini web (lecția VIII · M4 · nr. 22,
   „Evaluare sumativă: pagini web”, 26.10.2026). PROPRIETAR: autorul lecției VIII/22.
   Model: lectii/_sim/excelx-test.js (VIII/13): același înveliș (punctele la prima verificare, bifele ascunse până atunci,
   panoul cu părțile, nota și nivelul, „unde ai pierdut puncte”, „Sunt alt elev / Încep din nou”), adaptat la editorweb.
   NU schimbă motorul (jocuri/_motor/*), editorweb.js (VIII/14) și nici extensiile lui (-schelet VIII/15, -continut VIII/16,
   -tabele VIII/17, -legaturi VIII/18, -stil VIII/19, -verificare VIII/20, -proiect VIII/21), prezenta.js sau rezultat-elev.js:
   învelește tipul lor prin interfața publică (render / rezolva / gresit; mânerul body._ew = {S, verificat}; lista testelor
   pe care o desenează editorweb.js: .ew-teste li[data-i], cu li.ok când testul trece; zona de scris .np-ta în modul live).

   NIMIC SALVAT (regula 23, ghidul IV.2 §7, ca la evaluările M3: V/17, VI/16): proba stă DOAR în memoria paginii. Nu scrie în
   localStorage, nu trimite nimic și nu folosește rezultat-elev.js. În sessionStorage pune doar SEMNUL fără date
   „ewp_proba_golita” = '1' cât o probă e începută în fila asta, ca după o reîncărcare panoul să spună de ce proba e goală.

   ÎNCĂRCARE (după motor.js și după tipul învelit, de exemplu editorweb-continut.js):
     <script src="../../_sim/editorweb-proba.js"></script>
     EditorWebProba.configureaza({oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:20},…]});
     tipuri:{editorweb:EditorWebContinut.tip, probaew:EditorWebProba.punctat(EditorWebContinut.tip),
             probaalege:EditorWebProba.punctat(EditorWebProba.alegere)}
   CÂMPURI pe exercițiu: proba:'C1' (id-ul itemului); teste[i].puncte (punctele testului; un test fără puncte e doar bifă,
   „pază”, și nu apare la „unde ai pierdut puncte”); teste[i].lectia (unde se recitește; HTML, de obicei o legătură
   `<a href="../m3-l16/?vezi=p6" target="_blank" rel="noopener">lecția 16, pasul „…”</a>`); teste[i].ceInainte (textul testului
   PÂNĂ la prima verificare, când textul adevărat ar da răspunsul); teste[i].pazaDupa (NOU, 26.10.2026, reparația după
   judecata 1, m1: un test „n-ai stricat”, fără puncte, care pică la prima verificare ia N puncte din cele CÂȘTIGATE la acel
   exercițiu — ghidul IV.2 §7, „paza dă puncte doar împreună cu lucrul cerut”: nimic câștigat = 0, fără minus; fiecare pază o
   singură dată; apare la „unde ai pierdut puncte” cu punctele luate). Testele cu mesaj calculat (getter `msg`, ca T() din
   VIII/21) rămân vii: copia cu ceInainte moștenește testul (Object.create), nu-l copiază.
   Pentru `alegere`: q, o:[…], ok (indicele bun), amesteca?, mesaje:{indice:'…'}, ce (rândul din „unde ai pierdut”),
   lectia, why, ajutor; punctele = ale itemului (tot sau nimic, la prima verificare).

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md; _campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md; ghidul, regula 37):
   C = De bază 40, B = Consolidat 30, A = Avansat 20, 10 din oficiu; nota = punctaj : 10, rotunjită la cel mai apropiat
   întreg, la ,5 în favoarea elevului (85 → 9, 75 → 8, 74 → 7); nivelul se citește din notă: 9-10 Avansat, 7-8 Consolidat,
   5-6 De bază, 3-4 În formare, 1-2 În dificultate. Punctele pe CERINȚE sunt ale paginii (antrenament), nu ale profesorului.

   CE FACE:
   1. Punctele unui exercițiu se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică”: suma punctelor testelor bifate în
      clipa aceea (testele le judecă editorweb.js, pe TEXTUL paginii); dacă pagina a primit „Corect”, toate punctele. Ce
      repară elevul după aceea e exercițiu și nu schimbă punctele (prima încercare nu se șterge, regula 23).
      „Verifică” pe pagina NEATINSĂ (textul din zona de scris la fel ca la început) nu socotește nimic și o spune.
   2. Până la prima verificare nu se văd bifele testelor, numărătoarea „x din y trec” și indiciul: lista rămâne, ca „ce se
      verifică” (cu textele ceInainte). După prima verificare apar bifele, indiciul și textele adevărate.
   3. Panoul probei stă DEASUPRA exercițiului (în afara lui #body, pe care editorweb.js îl redesenează): unde ești, punctele
      de până acum, iar la final punctajul, nota, nivelul și „unde ai pierdut puncte”, cu lecția de recitit.
   4. Proba începe din nou (de la primul item): cu butonul „Sunt alt elev / Încep din nou”; când elevul din caseta
      prezenta.js se schimbă și proba e începută; când deschizi primul item după o probă completă. Întoarcerea la primul
      item folosește JocMotor.test.exercitiu(0) (motorul n-are altă cale, ca în excelx-test.js); după ea se verifică dacă
      primul item e chiar pe ecran, altfel panoul spune adevărul și până la el nu se socotesc puncte.
   Global: window.EditorWebProba {configureaza, punctat, alegere, nota, nivel, stare}. */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nl=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
let CFG=null;
const ST={scor:{},pierdute:{},ultima:null,nota:'',laC1:false};
const SEMN='ewp_proba_golita';
let cineAcum='null';

const nota=p=>Math.min(10,Math.max(1,Math.floor(p/10+0.5)));
const nivel=n=>n>=9?'A · Avansat':n>=7?'B · Consolidat':n>=5?'C · De bază':n>=3?'D1 · În formare':'D2 · În dificultate';
const item=id=>CFG&&CFG.itemi.find(x=>x.id===id);
const primul=()=>CFG.itemi[0].id;
const completa=()=>!!CFG&&CFG.itemi.every(it=>ST.scor[it.id]!==undefined);
const inceputa=()=>!!CFG&&CFG.itemi.some(it=>ST.scor[it.id]!==undefined);
const virgula=x=>String(x).replace('.',',');
const pct=n=>n===1?'un punct':(n===0||(n%100>=1&&n%100<=19))?`${n} puncte`:`${n} de puncte`;
const semn=v=>{try{if(v)sessionStorage.setItem(SEMN,'1');else sessionStorage.removeItem(SEMN)}catch(e){}};
const areSemn=()=>{try{return sessionStorage.getItem(SEMN)==='1'}catch(e){return false}};
const golesteProba=()=>{ST.scor={};ST.pierdute={};ST.ultima=null;semn(false)};
const cineE=()=>{try{return JSON.stringify(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}};

function configureaza(c){CFG=c;css();
  const s=Object.keys(c.parti).reduce((a,k)=>a+c.parti[k].max,0)+c.oficiu;
  if(s!==100)console.warn('editorweb-proba: părțile + oficiul fac',s,'nu 100');
  Object.keys(c.parti).forEach(k=>{const t=c.itemi.filter(it=>it.parte===k).reduce((a,it)=>a+it.puncte,0);
    if(t!==c.parti[k].max)console.warn('editorweb-proba: partea',k,'are itemi de',t,'p, nu',c.parti[k].max)});
  cineAcum=cineE();
  if(areSemn()){semn(false);ST.nota='Pagina s-a deschis din nou, deci proba de antrenament începe de la capăt: pe calculator nu se păstrează nimic din ea.'}
}

function socoteste(){
  const parti={};Object.keys(CFG.parti).forEach(k=>parti[k]=0);
  CFG.itemi.forEach(it=>{parti[it.parte]+=ST.scor[it.id]});
  const p=Object.keys(parti).reduce((a,k)=>a+parti[k],0)+CFG.oficiu,n=nota(p);
  return {puncte:p,nota:n,nivel:nivel(n),parti,
    itemi:Object.fromEntries(CFG.itemi.map(it=>[it.id,{p:ST.scor[it.id],max:it.puncte,pierdute:ST.pierdute[it.id]||[]}]))};
}

/* punctele unui exercițiu, la prima verificare: testele bifate de editorweb.js în clipa aceea (li.ok) */
function noteaza(Q,body,ok,zero){
  const it=item(Q.proba);if(!it||ST.laC1||ST.scor[it.id]!==undefined)return;
  let p=0;const pierd=[];
  if(!zero&&Array.isArray(Q.teste)&&Q.teste.length){
    const lis=[...body.querySelectorAll('.ew-teste li')];
    const potrivite=lis.length===Q.teste.length;
    if(!potrivite)console.warn('editorweb-proba:',Q.proba,'are',Q.teste.length,'teste, dar pe ecran sunt',lis.length);
    const trece=i=>ok||(potrivite&&lis[i].classList.contains('ok'));
    Q.teste.forEach((T,i)=>{const pt=T.puncte||0;if(!pt)return;
      if(trece(i))p+=pt;else pierd.push({ce:T.ce,puncte:pt,lectia:T.lectia||''})});
    /* paza după lucru (pazaDupa): ia din punctele câștigate, niciodată sub 0; pe pagina cu nimic bun nu se aplică */
    Q.teste.forEach((T,i)=>{const n=+T.pazaDupa||0;if(!n||p<=0||trece(i))return;
      const ia=Math.min(n,p);p-=ia;pierd.push({ce:T.ce,puncte:ia,lectia:T.lectia||''})});
  }else if(ok&&!zero)p=it.puncte;
  else pierd.push({ce:Q.ce||Q.proba,puncte:it.puncte,lectia:Q.lectia||''});
  ST.scor[it.id]=Math.min(p,it.puncte);ST.pierdute[it.id]=pierd;ST.nota='';semn(true);
  if(completa())ST.ultima=socoteste();
}

/* pagina neatinsă: în modul live, textul din zona de scris; în modul notepad, fișierele, filele și browserul */
const amprenta=body=>{const E=body._ew;if(!E||!E.S)return null;const S=E.S;
  if(S.mod==='live'){const ta=body.querySelector('.np-ta');return 'L\u0001'+nl(ta?ta.value:S.live.text)}
  try{return 'N\u0001'+JSON.stringify([Object.keys(S.fisiere).map(d=>(S.fisiere[d]||[]).map(f=>f.n+'\u0002'+nl(f.t))),(S.np.file||[]).map(f=>nl(f.text)),(S.br.file||[]).length])}catch(e){return null}};

/* ---------- panoul probei ---------- */
const CSS=`.ewp-panou{border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper);padding:10px 12px;margin:0 0 12px;font-size:.95rem}
.ewp-panou .ewp-sus{font-weight:700;margin:0 0 6px}
.ewp-panou .ewp-sus small{font-weight:400;color:var(--ink2)}
.ewp-itemi{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0 0 6px;padding:0}
.ewp-itemi li{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-family:var(--fm);font-size:.85rem;background:var(--paper2);white-space:nowrap}
.ewp-itemi li.acum{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.ewp-itemi li.gata{background:var(--okbg)}
.ewp-panou p{margin:.35em 0}
.ewp-panou .ewp-final{border-top:1px dashed var(--line);margin-top:8px;padding-top:8px}
.ewp-panou .ewp-mare{font-size:1.05rem}
.ewp-panou details{margin:.4em 0}
.ewp-panou details summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-weight:600}
.ewp-panou ul.ewp-pierd{margin:.3em 0 .3em 1.1em;padding:0}
.ewp-panou ul.ewp-pierd li{margin:.2em 0}
.ewp-panou ul.ewp-pierd a{display:inline-block;padding:6px 0}
.ewp-panou .ewp-alt{margin-top:4px;min-height:36px}
#body.ewp-ascuns .ew-teste li .s{visibility:hidden}
#body.ewp-ascuns .ew-teste .nr{display:none}
#body.ewp-ascuns .ew-teste li,#body.ewp-ascuns .ew-teste li.ok{color:var(--ink2)!important;font-weight:400!important}
.ewp-opts{display:grid;gap:8px;margin:6px 0}
.ewp-opts .opt{min-height:44px;text-align:left}`;
function css(){if(!document.getElementById('ewp-css')){const s=document.createElement('style');s.id='ewp-css';s.textContent=CSS;document.head.appendChild(s)}}

function listaPierdute(itemi){
  if(!itemi)return '';
  const l=CFG.itemi.map(it=>({it,l:itemi[it.id]&&Array.isArray(itemi[it.id].pierdute)?itemi[it.id].pierdute:[]})).filter(x=>x.l.length);
  /* `lectia` e HTML din configurația lecției (legătura la pasul de recitit); `ce` e textul testului, tot din configurație */
  /* legătura stă la sfârșitul rândului, fără punct după ea: pe telefon, legătura cu zona de atins mărită (inline-block) trece
     pe rândul următor, iar un punct rămas după ea ar sta singur pe un rând */
  return l.length?`<ul class="ewp-pierd">${l.map(x=>x.l.map(t=>`<li><b>${esc(x.it.id)}</b>, ${pct(+t.puncte||0)}: ${t.ce}.${t.lectia?` Recitește ${t.lectia}`:''}</li>`).join('')).join('')}</ul>`:'';
}
function textFinal(r){
  const P=Object.keys(CFG.parti).map(k=>`${k} ${r.parti[k]} din ${CFG.parti[k].max}`).join(' + ');
  const imp=r.puncte/10,intreg=Number.isInteger(imp),jumate=!intreg&&Math.round(imp*10)%10===5;
  const cum=intreg?'':jumate?' (la ,5 nota se rotunjește în favoarea ta)':' (rotunjită la cel mai apropiat număr întreg)';
  const lista=listaPierdute(r.itemi);
  return `<div class="ewp-final"><p class="ewp-mare"><b>Punctajul probei:</b> ${P} + ${CFG.oficiu} din oficiu = <b>${pct(r.puncte)}</b>.</p>
<p>Nota = ${r.puncte} : 10 = ${virgula(imp)} → <b>nota ${r.nota}</b>${cum}. Nivelul, citit din notă: <b>${esc(r.nivel)}</b>.</p>
${lista?`<details open><summary>Unde ai pierdut puncte și ce recitești</summary>${lista}</details>`:'<p>N-ai pierdut niciun punct la exerciții.</p>'}
<p class="hint">E nota pe antrenament. Nota adevărată o dă profesorul, la lucrare. Scrie în caiet punctajul și nota: pe calculator nu rămân.</p></div>`;
}
function deseneaza(el,id){
  if(!el||!el.isConnected||!CFG)return;
  const it=item(id),P=CFG.parti[it.parte],scorat=ST.scor[id]!==undefined;
  const chips=CFG.itemi.map(x=>{const s=ST.scor[x.id];return `<li class="${x.id===id?'acum':''}${s!==undefined?' gata':''}">${esc(x.id)} ${s!==undefined?s:'—'}/${x.puncte}</li>`}).join('');
  /* textele panoului, scurte (reparația după judecata 1, M3 — durata): paragraful lung doar la primul exercițiu */
  let h=`<p class="ewp-sus">Proba de antrenament · ${esc(it.id)}: partea ${esc(it.parte)}, ${esc(P.nume)} · ${pct(it.puncte)}</p>
<ul class="ewp-itemi" aria-label="Punctele pe exerciții">${chips}</ul>`;
  if(ST.nota)h+=`<p class="hint">${ST.nota}</p>`;
  if(ST.laC1&&id!==primul())h+=`<p><b>Proba nouă începe de la ${esc(primul())}.</b> Aici nu se socotesc puncte. Treci la ${esc(primul())} cu <b>Încă un exercițiu</b> (apare după ce rezolvi exercițiul sau după „Arată-mi răspunsul”).</p>`;
  /* la primul exercițiu, regula întreagă; la celelalte doar rândul de sus (regula e spusă în introducerea atelierului) */
  else if(!scorat&&id===primul())h+=`<p>Lucrezi tot exercițiul, apoi <b>Verifică</b>: punctele se socotesc la <b>prima</b> apăsare; abia atunci apar bifele și indiciul. Ce repari după aceea nu le mai schimbă.</p>`;
  else if(scorat){const l=ST.pierdute[id]||[];
    h+=`<p>La ${esc(id)}: <b>${ST.scor[id]} din ${it.puncte}</b>${l.length?'':' (tot)'}, de la prima verificare.</p>`}
  if(completa()&&ST.ultima)h+=textFinal(ST.ultima);
  h+=`<button type="button" class="btn ghost sm ewp-alt">Sunt alt elev / Încep din nou</button>`;
  el.innerHTML=h;
  el.querySelector('.ewp-alt').onclick=()=>laInceput('Proba începe din nou, de la primul exercițiu.');
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
  if(peEcran())mergiLaC1();else redeseneaza();
}
/* schimbarea elevului din caseta prezenta.js: proba de pe ecran nu mai e a lui */
addEventListener('prezenta',e=>{let k;try{k=JSON.stringify(e.detail||null)}catch(x){k='null'}
  const inainte=cineAcum;cineAcum=k;
  if(CFG&&k!==inainte&&inceputa())laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la primul exercițiu.');
  else redeseneaza()});

/* ---------- învelitoarea: punctele la prima verificare ---------- */
function punctat(baza){
  return {
    render(Q,body,api){
      document.querySelectorAll('.ewp-panou').forEach(x=>x.remove());
      const it=item(Q.proba);
      if(!it){body.classList.remove('ewp-ascuns');panouAcum=null;return baza.render(Q,body,api)}
      css();
      if(it.id===primul()){ST.laC1=false;if(completa()){golesteProba();ST.nota='Ai început o probă nouă.'}}
      const scorat=()=>ST.scor[it.id]!==undefined;
      /* textele testelor până la prima verificare (ceInainte): copii care MOȘTENESC testul (fn, msg calculat) */
      const are=Array.isArray(Q.teste)&&Q.teste.some(T=>T.ceInainte);
      const Q2=!scorat()&&are?Object.assign({},Q,{teste:Q.teste.map(T=>T.ceInainte?Object.assign(Object.create(T),{ce:T.ceInainte}):T)}):Q;
      const textAdevarat=()=>{if(Q2===Q)return;
        Q2.teste.forEach((T,i)=>{const real=Q.teste[i].ce;if(T.ce===real)return;const vechi=T.ce;T.ce=real;
          const li=body.querySelector(`.ew-teste li[data-i="${i}"]`);if(li&&li.innerHTML.includes(vechi))li.innerHTML=li.innerHTML.split(vechi).join(real)})};
      const aj=body.parentNode?body.parentNode.querySelector(':scope > .ajutor'):null;
      const arata=()=>{body.classList.remove('ewp-ascuns');if(aj)aj.hidden=false;textAdevarat()};
      if(scorat())arata();else{body.classList.add('ewp-ascuns');if(aj)aj.hidden=true}
      let el=null,start=null;
      const dupa=()=>{if(el)deseneaza(el,it.id)};
      const focusLucru=()=>setTimeout(()=>{const t=body.querySelector('.np-ta')||body.querySelector('.opt');if(t)try{t.focus({preventScroll:true})}catch(e){}},0);
      const api2=Object.assign({},api,{
        resolve(ok,msg){let m=msg||'';
          if(ST.laC1&&it.id!==primul()){arata();api.resolve(ok,m+' <br><i>Aici nu se socotesc puncte: proba nouă începe de la '+esc(primul())+'.</i>');dupa();return}
          if(!scorat()){
            const acum=amprenta(body);
            if(!ok&&start!==null&&acum!==null&&acum===start){
              api.feedback('bad','<strong>Pagina e la fel ca la început.</strong> Punctele nu s-au socotit: fă exercițiul, apoi apasă „Verifică”.');dupa();focusLucru();return}
            noteaza(Q,body,!!ok);arata();
            if(!ok)m+=` <br><b>Puncte la ${esc(it.id)}: ${ST.scor[it.id]} din ${it.puncte}</b>, de la prima verificare.`}
          api.resolve(ok,m);dupa()},
        giveUp(html){if(!scorat()&&!ST.laC1)noteaza(Q,body,false,true);arata();api.giveUp(html);dupa()}
      });
      /* motorul refolosește #body: starea simulatorului de la exercițiul de dinainte (body._ew) nu e a acestuia */
      body._ewpAlege=null;delete body._ew;
      baza.render(Q2,body,api2);
      start=amprenta(body);
      el=document.createElement('div');el.className='ewp-panou';el.setAttribute('aria-live','polite');
      body.parentNode.insertBefore(el,aj||body);panouAcum={el,id:it.id};deseneaza(el,it.id);
      if(ST.laC1&&it.id!==primul())setTimeout(()=>{if(ST.laC1&&peEcran()&&panouAcum.id===it.id)mergiLaC1()},0);
    },
    rezolva(Q,body,api){return baza.rezolva?baza.rezolva(Q,body,api):false},
    gresit(Q,body,api){return baza.gresit?baza.gresit(Q,body,api):false}
  };
}

/* ---------- alegerea punctată (explicația de la partea A: „de ce?”), ca în excelx-test.js ---------- */
const alegere={
  render(Q,body,api){
    css();
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.innerHTML=`<div class="ewp-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
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
    body._ewpAlege={pune:k=>{ales=k;des()}};
  },
  rezolva(Q,body){if(!body._ewpAlege)return false;body._ewpAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._ewpAlege)return false;body._ewpAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

window.EditorWebProba={configureaza,punctat,alegere,nota,nivel,
  stare:()=>({scor:Object.assign({},ST.scor),completa:completa(),laC1:ST.laC1,ultima:ST.ultima?JSON.parse(JSON.stringify(ST.ultima)):null})};
})();
