/* ======================================================================================================
   lectii/_sim/simppt-proba.js — PROBA DE ANTRENAMENT peste PowerPoint-ul simulat (lecția VI · M2 · nr. 10, „Evaluare
   sumativă: prezentări digitale”). PROPRIETAR: autorul lecției VI/10.
   NU modifică motorul (jocuri/_motor/*), simppt.js, simppt-formatare.js, simppt-animatii.js, simppt-interfata.js,
   simppt-proiect.js, rezultat-elev.js sau prezenta.js: le ÎNVELEȘTE prin interfața lor publică (render / rezolva / gresit,
   body._sp / body._sa / body._spi .stare(), api-ul motorului, JocMotor.test.exercitiu) și prin DOM-ul pe care îl desenează
   (lista testelor .sp-teste / .sa-teste / .spi-teste, eticheta .lbl de deasupra ei, mesajul .sp-msg / .sa-msg / .spi-msg).

   ÎNCĂRCARE (după simulatoarele folosite):
     <script src="../../_sim/simppt-proba.js"></script>
     SimPPTProba.configureaza({titlu:'Proba de antrenament „Soarele”', bucati:[{id:'A1',nume:'Diapozitivele'},…]});
     tipuri:{probappt:SimPPTProba.proba(SimPPTFormatare), probaanim:SimPPTProba.proba(SimPPTAnim),
             probaint:SimPPTProba.proba(SimPPTInt), probaalege:SimPPTProba.proba(SimPPTProba.alegere)}
   CÂMPURI pe exercițiu: proba:'A1' (id-ul bucății, din configureaza); teste[i].lectia (unde recitești, HTML: de preferat
   legătura directă la pas, `<a href="../m1-l04/?vezi=p3">lecția 4, pasul „…”</a>`); teste[i].ceInainte (textul testului PÂNĂ la prima verificare, dacă textul adevărat ar da răspunsul).
   Pentru `alegere`: q, o:[…], ok (indicele bun), amesteca?, mesaje:{indice:'…'}, ce (rândul din rezumat), lectia, why.

   CE FACE:
   1. Ca la proba reală, unde nu ai bife: până la PRIMA apăsare pe „Verifică” a unei bucăți nu se văd bifele testelor,
      butonul „Am nevoie de un indiciu” și mesajul simulatorului „Toate testele sunt bifate”. Lista rămâne, cu titlul
      „Ce se verifică (bifele apar după prima verificare)”; textele `ceInainte` stau în locul celor adevărate.
   2. Prima apăsare pe „Verifică” pe o prezentare LUCRATĂ = prima încercare a bucății: se notează ce teste treceau atunci.
      Apoi apar bifele, indiciul și textele adevărate; ce repari după aceea e exercițiu și nu schimbă ce s-a notat.
      „Verifică” pe prezentarea NEATINSĂ (la fel ca la început) nu se socotește și mesajul o spune (modelul VIII/13, m1).
   3. Panoul probei, deasupra fiecărei bucăți: „bucata k din N” și ce ai îndeplinit din prima la bucățile verificate;
      după ultima: totalul și lista „Ce n-a ieșit din prima și unde recitești” (câmpul `lectia`). Fără puncte și fără
      notă: proba e antrenament; nota o dă profesorul, cu grila lui.
   4. Nimic nu se scrie în localStorage, sessionStorage sau pe server: totul stă în memoria paginii deschise. Proba se
      golește și se reia de la prima bucată (JocMotor.test.exercitiu(0); după el se verifică dacă prima bucată e chiar pe
      ecran, altfel panoul spune adevărul) la butonul „Sunt alt elev / Încep din nou” și când se schimbă elevul din
      caseta prezenta.js (evenimentul `prezenta` cu altă identitate): ce a lucrat cel dinainte nu rămâne pe ecran pentru
      următorul (regula 23 a standardului; modelul VIII/13, M3).
   Global: window.SimPPTProba {configureaza, proba, alegere, stare, goleste}.
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let CFG={titlu:'Proba de antrenament',bucati:[]};
/* prima[id] = {teste:[{ce, lectia, ok}], ok:true|false}  — prima verificare a fiecărei bucăți, doar în memorie */
const ST={prima:{},nota:'',reluata:false};
let curent=null;   // bucata de pe ecran: {id, body, redeseneaza}

/* ---------------- stilul (prefixul spb-) ---------------- */
function css(){
  if(document.getElementById('spb-css'))return;
  const s=document.createElement('style');s.id='spb-css';
  s.textContent=`
.spb-panou{border:2px dashed var(--accent);border-radius:8px;padding:8px 12px;margin:6px 0 10px;background:var(--paper2)}
.spb-panou p{margin:.25em 0}
.spb-panou .spb-cap{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}
.spb-panou .spb-et{display:inline-block;font-weight:700;color:var(--accent)}
.spb-panou ul{margin:.3em 0 .3em 1.2em;padding:0}
.spb-panou li{margin:.2em 0}
.spb-panou a{color:var(--accent)}
.spb-panou details summary{min-height:32px;display:flex;align-items:center;cursor:pointer;color:var(--accent);font-weight:600}
.spb-panou .spb-nota{border-left:4px solid var(--accent);padding:4px 8px;margin:6px 0;background:var(--paper)}
.spb-ascuns .sp-teste li.ok,.spb-ascuns .sa-teste li.ok,.spb-ascuns .spi-teste li.ok{color:var(--ink2);font-weight:400}
.spb-ascuns .sp-teste li.ok::marker,.spb-ascuns .sa-teste li.ok::marker,.spb-ascuns .spi-teste li.ok::marker{content:counter(list-item) ".  "}
.spb-opts{display:grid;gap:8px;margin:6px 0}
.spb-opts .opt{min-height:44px}`;
  document.head.appendChild(s);
}

/* ---------------- starea probei ---------------- */
const ids=()=>CFG.bucati.map(b=>b.id);
const primul=()=>ids()[0];
const inceputa=()=>Object.keys(ST.prima).length>0;
const completa=()=>ids().length>0&&ids().every(id=>ST.prima[id]);
function goleste(nota){Object.keys(ST.prima).forEach(k=>delete ST.prima[k]);ST.nota=nota||'';ST.reluata=true}
const numeBucata=id=>{const b=CFG.bucati.find(x=>x.id===id);return b?b.nume:id};
const nrBucata=id=>ids().indexOf(id)+1;

/* amprenta prezentării: ce a lucrat elevul (nu ce a ales sau ce mesaj e pe ecran) */
function stareSim(body){const h=body._sp||body._sa||body._spi;try{return h&&h.stare?h.stare():null}catch(e){return null}}
function amprenta(body,tip){
  if(body._spbAlege)return body._spbAlege.ales();
  const S=stareSim(body);if(!S)return null;
  try{return JSON.stringify(S.slides)+JSON.stringify(S.ev||{})}catch(e){return null}   // ev: expunerea pornită e lucru (repetiția)
}
/* lista de pe ecran: testele bifate de simulator (li.ok), în ordinea din Q.teste */
function liste(body){return [...body.querySelectorAll('.sp-teste li, .sa-teste li, .spi-teste li')]}

/* ---------------- panoul ---------------- */
function rezumat(){
  let tot=0,ok=0;const rate=[];
  for(const id of ids()){const p=ST.prima[id];if(!p)continue;
    p.teste.forEach(t=>{tot++;if(t.ok)ok++;else rate.push({id,ce:t.ce,lectia:t.lectia})})}
  return {tot,ok,rate};
}
/* rezumatul probei, pus și SUB răspunsul ultimei bucăți verificate (pe telefon, panoul de sus nu se mai vede) */
function rezumatHTML(){
  const r=rezumat();
  let h=`<p><b>Ai verificat toate cele 5 bucăți.</b> Din prima ai îndeplinit <b>${r.ok} din ${r.tot}</b> cerințe. Nu e o notă: e lista ta de lucru.</p>`;
  h+=r.rate.length?`<details open><summary>Ce n-a ieșit din prima și unde recitești</summary><ul>${r.rate.map(x=>`<li>Bucata ${nrBucata(x.id)}: ${x.ce}${x.lectia?` — recitește ${x.lectia}`:''}.</li>`).join('')}</ul></details>`
    :`<p>Toate cerințele au ieșit din prima.</p>`;
  return h+`<p>Acum fă proba de antrenament în PowerPoint-ul adevărat, la pasul următor, și verifică-te cu grila profesorului.</p>`;
}
function finalJos(){
  document.querySelectorAll('.spb-final').forEach(x=>x.remove());
  if(!completa())return;
  const fb=document.getElementById('fb');if(!fb||!fb.parentNode)return;
  const el=document.createElement('div');el.className='spb-panou spb-final';el.setAttribute('role','status');el.innerHTML=rezumatHTML();
  fb.parentNode.insertBefore(el,fb.nextSibling);
}
function panouHTML(id){
  const k=nrBucata(id),N=ids().length;
  let h=`<div class="spb-cap"><p><span class="spb-et">${esc(CFG.titlu)}</span> · nu se notează · bucata ${k} din ${N}: ${esc(numeBucata(id))}</p>
<button type="button" class="btn ghost sm spb-alt">Sunt alt elev / Încep din nou</button></div>`;
  if(ST.nota)h+=`<p class="spb-nota">${esc(ST.nota)}</p>`;
  const facute=ids().filter(x=>ST.prima[x]);
  if(!facute.length){
    h+=`<p>Lucrează toată bucata după cerință, apoi apasă <b>Verifică</b>. Abia atunci vezi ce ai îndeplinit: la proba adevărată nu ai bife care să se aprindă singure.</p>`;
  }else{
    h+=`<p>Din prima: ${facute.map(x=>{const p=ST.prima[x];const n=p.teste.filter(t=>t.ok).length;return `bucata ${nrBucata(x)}, ${n} din ${p.teste.length}`}).join(' · ')}.</p>`;
  }
  if(completa())h+=rezumatHTML();
  return h;
}
function panou(id,body){
  document.querySelectorAll('.spb-panou').forEach(x=>x.remove());
  const el=document.createElement('div');el.className='spb-panou spb-sus';el.setAttribute('role','region');el.setAttribute('aria-label','Proba de antrenament');
  el.innerHTML=panouHTML(id);
  if(body.parentNode)body.parentNode.insertBefore(el,body);
  el.querySelector('.spb-alt').onclick=()=>laInceput('Proba începe din nou, de la bucata 1. Ce era pe ecran s-a golit.');
  return el;
}
function redeseneaza(){if(!completa())document.querySelectorAll('.spb-final').forEach(x=>x.remove());if(!curent)return;const el=document.querySelector('.spb-sus');if(el){el.innerHTML=panouHTML(curent.id);el.querySelector('.spb-alt').onclick=()=>laInceput('Proba începe din nou, de la bucata 1. Ce era pe ecran s-a golit.')}}

/* înapoi la prima bucată, cu tot ce era pe ecran golit */
const peEcran=()=>!!(curent&&curent.body&&document.body.contains(curent.body)&&document.querySelector('.spb-sus'));
function laInceput(nota){
  goleste(nota);
  if(!peEcran())return;   // proba nu e pe ecran (elevul e la pași sau la întrebări): s-a golit; o reia de unde o deschide
  let dus=false;
  try{if(window.JocMotor&&JocMotor.test&&typeof JocMotor.test.exercitiu==='function'){JocMotor.test.exercitiu(0);dus=true}}catch(e){dus=false}
  if(!dus||!peEcran()||curent.id!==primul()){
    ST.nota=nota+' Pagina nu te-a putut duce singură la bucata 1: apasă „Încă un exercițiu” până ajungi la ea.';
  }
  redeseneaza();
}

/* schimbarea elevului din caseta prezenta.js (e.detail = Prezenta.identitate(): {nume, scoala, clasa} sau null) */
const cheieDe=x=>{try{return JSON.stringify(x||null)}catch(e){return 'null'}};
let cineAcum=(()=>{try{return cheieDe(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}})();
addEventListener('prezenta',e=>{
  const k=cheieDe(e&&e.detail),inainte=cineAcum;cineAcum=k;
  if(k===inainte||!inceputa())return;
  /* cine se înscrie abia acum, după ce a lucrat fără nume, își păstrează proba (dacă nu e deja gata) */
  if(inainte==='null'&&!completa())return;
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la bucata 1.');
});

/* ---------------- învelișul ---------------- */
function proba(baza){
  return {
    render(Q,body,api){
      css();
      const id=Q.proba;
      if(!id||!ids().includes(id)){body.classList.remove('spb-ascuns');return baza.render(Q,body,api)}
      const verificat=()=>!!ST.prima[id];
      /* textele de până la prima verificare (ceInainte) — pe o copie a testelor, ca simulatorul să le deseneze */
      const Q2=Array.isArray(Q.teste)&&Q.teste.some(T=>T.ceInainte)&&!verificat()?Object.assign({},Q,{teste:Q.teste.map(T=>Object.assign({},T,{ce:T.ceInainte||T.ce}))}):Q;
      const textAdevarat=()=>{if(Q2===Q)return;Q2.teste.forEach((T,i)=>{const real=Q.teste[i].ce;if(T.ce===real)return;const vechi=T.ce;T.ce=real;
        liste(body).forEach(li=>{if(li.innerHTML.includes(vechi))li.innerHTML=li.innerHTML.split(vechi).join(real)})})};
      let amprenta0=null,mesajObs=null;
      const lbl=()=>{const ol=body.querySelector('.sp-teste, .sa-teste, .spi-teste');const l=ol&&ol.previousElementSibling;return l&&l.classList.contains('lbl')?l:null};
      const mesaj=()=>body.querySelector('.sp-msg, .sa-msg, .spi-msg');
      const NEUTRU='Lucrează după cerință. Când crezi că ai terminat bucata, apasă „Verifică”.';
      const TRADA=/^(Toate testele sunt bifate|Lucrează în fereastră; testele se bifează singure)/;
      const ascunde=()=>{body.classList.add('spb-ascuns');const l=lbl();if(l)l.textContent='Ce se verifică (bifele apar după prima verificare)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=true;
        const m=mesaj();if(m){if(TRADA.test(m.textContent.trim()))m.textContent=NEUTRU;
          if(!mesajObs){mesajObs=new MutationObserver(()=>{if(!body.classList.contains('spb-ascuns'))return;const t=m.textContent.trim();if(TRADA.test(t)&&t!==NEUTRU)m.textContent=NEUTRU});
            mesajObs.observe(m,{childList:true,characterData:true,subtree:true})}}};
      const arata=()=>{body.classList.remove('spb-ascuns');const l=lbl();if(l)l.textContent='Testele tale (se bifează singure)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=false;textAdevarat()};
      const noteaza=ok=>{
        const lis=liste(body),potrivite=Array.isArray(Q.teste)&&lis.length===Q.teste.length;
        const teste=Array.isArray(Q.teste)&&Q.teste.length?Q.teste.map((T,i)=>({ce:T.ce,lectia:T.lectia||'',ok:!!ok||(potrivite&&lis[i].classList.contains('ok'))}))
          :[{ce:Q.ce||'răspunsul',lectia:Q.lectia||'',ok:!!ok}];
        ST.prima[id]={teste,ok:!!ok};ST.nota='';
      };
      const api2=Object.assign({},api,{
        resolve(ok,msg){
          let m=msg;
          if(!verificat()){
            const acum=amprenta(body);
            if(!ok&&amprenta0!==null&&acum===amprenta0){
              /* feedback, nu resolve: nu e o încercare, iar motorul n-adaugă „Uită-te la indiciul de mai sus” (indiciul e încă ascuns) */
              api.feedback('bad','<strong>Nu încă.</strong> Prezentarea e la fel ca la început: nu s-a socotit nimic. Lucrează bucata după cerință, apoi apasă „Verifică”.');
              redeseneaza();return}
            noteaza(ok);
          }
          if(Q2!==Q&&typeof m==='string')Q2.teste.forEach((T,i)=>{if(T.ce!==Q.teste[i].ce)m=m.split(T.ce).join(Q.teste[i].ce)});
          arata();api.resolve(ok,m);redeseneaza();finalJos()},
        giveUp(html){if(!verificat())noteaza(false);arata();api.giveUp(html);redeseneaza();finalJos()},
        revealButton(fn){if(!verificat())return;api.revealButton(fn)}
      });
      curent={id,body};
      panou(id,body);
      /* judecata 1 (11.10.2026, GRAV): motorul folosește ACELAȘI #body pentru toate bucățile, iar simulatoarele își lasă
         mânerul pe el. Fără ștergere, la bucata 3 (ppta) amprenta se citea din _sp-ul bucății 2, iar la bucata 5 din
         _spbAlege-ul bucății 4: „la fel ca la început” fals, bife ascunse, rezumat umflat. Simulatorul de acum își pune
         mânerul lui în baza.render. */
      delete body._sp;delete body._sa;delete body._spi;delete body._spbAlege;
      baza.render(Q2,body,api2);
      amprenta0=amprenta(body);
      if(verificat())arata();else ascunde();
    },
    rezolva(Q,body){return baza.rezolva?baza.rezolva(Q,body):false},
    gresit(Q,body){return baza.gresit?baza.gresit(Q,body):false}
  };
}

/* ---------------- alegerea („de ce?”) ---------------- */
const alegere={
  render(Q,body,api){
    css();
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.innerHTML=`<div class="spb-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
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
    body._spbAlege={pune:k=>{ales=k;des()},ales:()=>ales===null?'nimic':String(ales)};
  },
  rezolva(Q,body){if(!body._spbAlege)return false;body._spbAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._spbAlege)return false;body._spbAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

function configureaza(c){CFG=Object.assign({titlu:'Proba de antrenament',bucati:[]},c||{})}
window.SimPPTProba={configureaza,proba,alegere,goleste:()=>{goleste('');redeseneaza()},
  stare:()=>({prima:JSON.parse(JSON.stringify(ST.prima)),completa:completa(),nota:ST.nota,curent:curent&&curent.id})};
})();
