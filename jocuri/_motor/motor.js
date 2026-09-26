/* Motorul lecțiilor-joc (LearningHub/jocuri). Specificația completă: README.md din acest folder.
   Un joc = index.html cu tema lui + JocMotor.porneste({...configurație...}).
   Tipuri de întrebări incluse: choice, tf, order, classify, match, hunt, pick.
   Tipuri noi (simulatoare) vin prin config.tipuri = { nume: { render(Q, body, api), rezolva(Q, body, api) } }. */
(function(){
'use strict';
/* de unde s-a încărcat motorul: diplome-date.js, qrcode.min.js și pagina diploma/ stau lângă el */
const MOTOR_URL=(document.currentScript&&document.currentScript.src)||location.href;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const L=i=>String.fromCharCode(65+i);
function expandRange(a,b){
  const pa=a.match(/^([A-Z])(\d+)$/),pb=(b||a).match(/^([A-Z])(\d+)$/),out=[];
  const c1=Math.min(pa[1].charCodeAt(0),pb[1].charCodeAt(0)),c2=Math.max(pa[1].charCodeAt(0),pb[1].charCodeAt(0));
  const r1=Math.min(+pa[2],+pb[2]),r2=Math.max(+pa[2],+pb[2]);
  for(let c=c1;c<=c2;c++)for(let r=r1;r<=r2;r++)out.push(String.fromCharCode(c)+r);
  return out;
}

let C,S,R=null,app,hud;
const TIPURI={};          // tipurile incluse + cele din config
const REZOLVA={};         // pentru testul automat: pune răspunsul corect în pagină
const GRESIT={};          // pentru testul automat: pune un răspuns greșit tipic (simulatoare)

/* ---------------- stare ---------------- */
/* PROGRES PE ELEV (25.09.2026, el: „să poată continua fiecare de unde a rămas” pe calculatorul comun):
   progresul jocului stă pe PROFILUL activ al calculatorului (learninghub_active_profile), același pe care îl
   folosesc și lecțiile; prezenta.js pune profilul elevului înscris. Fără profil (sau „_guest”) = cheia veche.
   Prima dată pe un profil nou: dacă pe cheia veche e progresul ACESTUI elev (același nume) sau al nimănui
   (fără nume), îl mută la el - așa nu se pierde nimic la trecere. */
function profilActiv(){try{const p=localStorage.getItem('learninghub_active_profile');return p&&p!=='_guest'?p:''}catch(e){return ''}}
function cheieJoc(){const p=profilActiv();return p?C.cheie+'@'+p:C.cheie}
const normNume=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').sort().join(' ');
function citesteJoc(k){try{const s=JSON.parse(localStorage.getItem(k));return s&&typeof s==='object'?s:null}catch(e){return null}}
function load(){
  const k=cheieJoc();let s=citesteJoc(k);
  if(!s&&k!==C.cheie){const b=citesteJoc(C.cheie);let eu=null;try{eu=JSON.parse(localStorage.getItem('lh_prezenta'))}catch(e){}
    if(b&&(!b.nume||(eu&&eu.nume&&normNume(b.nume)===normNume(eu.nume)))){s=b;try{localStorage.setItem(k,JSON.stringify(b));localStorage.removeItem(C.cheie)}catch(e){}}}
  if(!s)s={nume:'',lv:{}};if(!s.lv)s.lv={};return s}
function save(){try{localStorage.setItem(cheieJoc(),JSON.stringify(S))}catch(e){}}
function totals(){let st=0,xp=0;for(const k in S.lv){st+=S.lv[k].stars||0;xp+=S.lv[k].xp||0}return{st,xp}}
const unlocked=i=>i===0||!!S.lv[i-1];
const starsHtml=n=>[0,1,2].map(i=>i<n?'<span class="on">★</span>':'<span>☆</span>').join('');

function setHud(){
  const t=totals();
  if(R){
    const Lv=C.nivele[R.li];
    const nb=`${C.mod==='antrenament'?'Runda':'Nivelul'} ${R.li+1} din ${C.nivele.length}`;
    const txt=R.phase==='q'?`${Lv.pasi?'Verificarea':'Întrebarea'} ${R.qi+1} din ${Lv.qs.length} · ${R.xp} XP`:R.phase==='read'?`Citire · ${esc(Lv.t)}`
      :R.phase==='learn'?`Învață · pasul ${R.si+1} din ${Lv.pasi.length}`:R.phase==='atelier'?'Atelier · fă-o ca în aplicația reală':`Nivel terminat · ${R.xp} XP`;
    hud.innerHTML=`<span class="nb">${nb}</span><span class="fv">${txt}${R.streak>=2?` <span class="hot">serie ×${R.streak}</span>`:''}</span>`;
  }else hud.innerHTML=`<span class="nb">TOTAL</span><span class="fv">★ ${t.st}/${C.nivele.length*3} · ${t.xp} XP</span>`;
}
function shell(inner,tabs){
  app.innerHTML=`<div class="book"><div class="banda" aria-hidden="true">${C.banda||''}</div><div class="foaie">${inner}</div>${tabs?`<nav class="tabs" aria-label="Pașii nivelului">${tabs}</nav>`:''}</div>`;
  setHud();setCrumbs();wireTabs();window.scrollTo({top:0});
}
/* breadcrumb: 🏠 LearningHub › Jocuri TIC › Clasa › Jocul [› Nivelul N]. Căile sunt relative la jocuri/<slug>/index.html. */
function setCrumbs(){
  const nav=document.getElementById('crumbs');if(!nav)return;
  const m=String(C.clasa).match(/([IVX]+)/),cls=m?m[1]:'';
  const sep='<span class="sep" aria-hidden="true">›</span>';
  /* C.acasa (opțional, ex. site-ul de bac): {href,text} înlocuiește legătura spre LearningHub; C.eticheta înlocuiește „Jocuri TIC” */
  const acasa=C.acasa||{href:'../../hub/index.html',text:'LearningHub'};
  const parts=[`<a href="${esc(acasa.href)}">🏠 ${esc(acasa.text)}</a>`,`<a href="../index.html">${esc(C.eticheta||'Jocuri TIC')}</a>`];
  if(cls)parts.push(`<a href="../index.html#clasa-${cls}">Clasa ${esc(C.clasa)}</a>`);
  if(R){parts.push(`<button type="button" class="crumb-btn" id="crumb-game">${esc(C.titlu)}</button>`);parts.push(`<span class="cur" aria-current="page">${nivelEticheta(R.li)}</span>`)}
  else parts.push(`<span class="cur" aria-current="page">${esc(C.titlu)}</span>`);
  nav.innerHTML=parts.join(sep);
  const g=document.getElementById('crumb-game');if(g)g.onclick=home;
}
/* „Nivelul 3 din 7”, „Nivelul final (7 din 7)” - elevii întreabă câte niveluri sunt */
function nivelEticheta(i){const n=C.nivele.length,w=C.mod==='antrenament'?'Runda':'Nivelul';return C.nivele[i].final?`${w} finală (${i+1} din ${n})`.replace('Nivelul finală','Nivelul final'):`${w} ${i+1} din ${n}`}
/* Bara de jos: pașii prin care ai trecut deja sunt butoane - te poți întoarce la ei (și înainte, până unde
   ajunseseși). Un pas refăcut nu mai dă XP a doua oară (R.punctat), iar încercările greșite se țin minte
   (R.atts), ca „du-te înapoi și revino” să nu șteargă greșelile. */
function tabsFor(){
  const Lv=C.nivele[R.li],inNivel=R.phase!=='end';
  let t;
  if(Lv.pasi){
    /* nivel pe pași: P1..Pn (învățarea), Atelier, apoi Î1..Qn (verificarea). Toți pașii de învățare se pot
       deschide oricând: elevul care știe deja poate sări, cel care s-a pierdut se poate întoarce. */
    t=Lv.pasi.map((p,k)=>{const acum=R.phase==='learn'&&R.si===k;
      return inNivel&&!acum?`<button type="button" class="${R.vazutPas[k]?'done':''}" data-pas="p${k}" title="${esc(p.t)}">P${k+1}</button>`:`<span class="${acum?'now':'done'}">P${k+1}</span>`}).join('');
    if(Lv.atelier){const acum=R.phase==='atelier';
      t+=inNivel&&!acum?`<button type="button" class="${R.atelierGata?'done':''}" data-pas="atelier" title="Atelier: fă-o ca în aplicația reală">Atelier</button>`:`<span class="${acum?'now':'done'}">Atelier</span>`}
  }else{
    const cit=Lv.bazin?'Pregătire':'Citire';
    t=inNivel&&R.phase!=='read'?`<button type="button" class="done" data-pas="citire" title="Înapoi la pagina de citit">${cit}</button>`
      :`<span class="${R.phase==='read'?'now':'done'}">${cit}</span>`;
  }
  return t+Lv.qs.map((_,k)=>{
    const acum=R.phase==='q'&&k===R.qi,vazut=k<=R.max;
    const cls=R.phase==='end'||R.punctat[k]?'done':(acum?'now':'');
    if(inNivel&&vazut&&!acum)return `<button type="button" class="${cls}" data-pas="${k}" title="Mergi la întrebarea ${k+1}">Î${k+1}</button>`;
    return `<span class="${cls}${acum?' now':''}">Î${k+1}</span>`}).join('');
}
function mergiLa(k){
  if(k==='citire'){if(C.nivele[R.li].pasi){R.si=0;R.phase='learn';learnPage()}else{R.phase='read';readPage()}return}
  if(/^p\d+$/.test(k)){R.si=+k.slice(1);R.phase='learn';learnPage();return}
  if(k==='atelier'){R.phase='atelier';atelierPage();return}
  R.qi=Number(k);R.phase='q';question();
}
function wireTabs(){app.querySelectorAll('.tabs [data-pas]').forEach(b=>b.onclick=()=>mergiLa(b.dataset.pas))}

/* ---------------- cuprins ---------------- */
function home(){
  R=null;
  const allDone=C.nivele.every((_,i)=>S.lv[i]);
  const rows=C.nivele.map((Lv,i)=>{const d=S.lv[i],u=unlocked(i);
    const drum=Lv.pasi?`<span class="drum">${Lv.pasi.length} pași de învățat${Lv.atelier?' · atelier':''} · ${Lv.qs.length} întrebări de verificare</span>`:'';
    return `<button class="lvl" type="button" data-l="${i}" ${u?'':'disabled'}><span class="n">${i+1} din ${C.nivele.length}${Lv.final?' · final':''}</span><span class="t">${esc(Lv.t)}${drum}</span><span class="s">${d?starsHtml(d.stars):u?'începe →':'blocat'}</span></button>`}).join('');
  shell(`
    <div class="eyebrow">${esc(C.eticheta?C.eticheta.replace(/^Jocuri\s*/,''):'TIC')} · clasa ${esc(C.clasa)} · ${esc(C.unitateTitlu)}</div>
    <h1 style="margin-top:8px">${C.h1||esc(C.titlu)}</h1>
    <div class="lede">${C.intro}</div>
    <div class="ancora">${C.ancoraText?esc(C.ancoraText):`Programa: ${esc(C.competente.join(', '))} · unitatea ${esc(C.unitate)}${C.lectii?` · lecțiile ${esc(C.lectii)}`:''}`}</div>
    <div id="cine-lucreaza"></div>
    <div class="namerow"><label for="nume">Numele tău, pentru diplomă</label><input id="nume" type="text" autocomplete="off" maxlength="40" value="${esc(S.nume)}" placeholder="ex. Ana Popescu"></div>
    ${C.cum?`<div class="cum-inveti">${C.cum}</div>`:''}
    <div class="toc-h">${C.mod==='antrenament'?`${C.nivele.length} runde · De bază → Consolidat → Avansat · întrebări noi la fiecare reluare`:`${C.nivele.length} niveluri · se deblochează pe rând · ultimul e nivelul final`}</div>
    <nav class="toc" aria-label="Nivelurile">${rows}</nav>
    <div class="row" style="margin-top:22px">
      ${allDone?'<button class="btn primary" id="dipl" type="button">Vezi diploma</button>':''}
      ${Object.keys(S.lv).length?'<button class="btn ghost" id="reset" type="button">Ia-o de la capăt</button>':''}
      <a class="btn ghost" href="../index.html">Toate jocurile</a>
    </div>`);
  const inp=document.getElementById('nume');inp.addEventListener('input',()=>{S.nume=inp.value.trim();save()});
  app.querySelectorAll('.lvl').forEach(b=>b.addEventListener('click',()=>startLevel(+b.dataset.l)));
  const dp=document.getElementById('dipl');if(dp)dp.onclick=diploma;
  const rs=document.getElementById('reset');
  if(rs)rs.onclick=()=>{if(rs.dataset.sure){S.lv={};save();home()}else{rs.dataset.sure=1;rs.textContent='Sigur? Apasă din nou'}};
  cineLucreaza();
}
/* CINE LUCREAZĂ (26.09.2026, el: „să permitem continuarea nivelurilor fără să mai ștergem progresul individual”).
   Butonul vechi „Sunt alt elev, încep de la zero” ștergea progresul. Acum: elevul își alege numele din lista
   calculatorului (prezenta.js) și fiecare continuă de unde a rămas; cu codul lui, și pe alt aparat. */
function cineLucreaza(){
  const el=document.getElementById('cine-lucreaza');if(!el||R)return;
  const P=window.Prezenta,e=P&&P.identitate&&P.identitate(),n=Object.keys(S.lv).length;
  const cat=n?` · ${n} din ${C.nivele.length} ${C.mod==='antrenament'?'runde':'niveluri'} făcute`:'';
  if(e){
    el.innerHTML=`<div class="alt-elev"><span>Lucrezi ca <b>${esc(e.nume)}</b> (${esc(e.clasa)})${cat}.${P.areCod&&!P.areCod()?' <br><small>Progresul tău e doar pe calculatorul ăsta.</small>':' <br><small>☁ Progresul tău te urmează pe orice calculator.</small>'}</span>
      <span class="row" style="gap:6px">${P.areCod&&!P.areCod()?'<button class="btn" id="pastreaza" type="button">Păstrează-l online</button>':''}<button class="btn ghost" id="alt-elev" type="button">Nu ești tu? Alege-te din listă</button></span></div>`;
  }else if(S.nume||n){
    el.innerHTML=`<div class="alt-elev"><span>Pe calculatorul ăsta a lucrat ${S.nume?`<b>${esc(S.nume)}</b>`:'cineva'}${cat}. Nu ești tu?</span><button class="btn" id="alt-elev" type="button">${P?'Alege-te din listă sau înscrie-te':'Sunt alt elev, încep de la zero'}</button></div>`;
  }else{el.innerHTML='';return}
  const alt=document.getElementById('alt-elev'),ps=document.getElementById('pastreaza');
  if(ps)ps.onclick=()=>P.cereCod();
  alt.onclick=()=>{
    if(window.Prezenta&&window.Prezenta.alege){window.Prezenta.alege();return}
    // fără prezenta.js (offline): ca înainte, două apăsări și jocul pornește curat
    if(alt.dataset.sure){S={nume:'',lv:{}};save();home();const nm=document.getElementById('nume');if(nm)nm.focus()}else{alt.dataset.sure=1;alt.textContent='Sigur? Se șterge tot ce e mai sus - apasă din nou'}};
}

/* ---------------- nivel ---------------- */
/* ANTRENAMENT (stratul 2 al repetiției): un nivel cu `bazin:[întrebări]` și `cate:N` primește la fiecare pornire N întrebări
   trase la întâmplare, întâi cele nevăzute la reluările anterioare. Așa elevul reia aceleași lucruri, dar nu aceleași întrebări. */
let TEST_TOATE=false;
const vazutKey=i=>C.cheie+'_vazut_'+i;
function citesteVazut(i){try{return JSON.parse(localStorage.getItem(vazutKey(i)))||[]}catch(e){return []}}
/* Tragerea e echilibrată pe lecții: dacă întrebările au `lectii:[n]`, se ia pe rând câte una din fiecare lecție
   (întâi cele nevăzute), ca o rundă de 6 să nu sară lecții întregi (observat la pilotul Word, 15.09.2026). */
function trage(Lv,i){
  if(TEST_TOATE)return {qs:Lv.bazin.slice(),pick:[]};
  const n=Math.min(Lv.cate||5,Lv.bazin.length),seen=citesteVazut(i);
  const idx=Lv.bazin.map((_,k)=>k);
  const lesson=k=>{const q=Lv.bazin[k];return q.lectii&&q.lectii.length?q.lectii[0]:'?'};
  const rr=(list,key)=>{   // câte unul din fiecare grup, pe rând
    const groups={};list.forEach(k=>{(groups[key(k)]=groups[key(k)]||[]).push(k)});
    const order=shuffle(Object.keys(groups)),out=[];
    while(out.length<list.length)order.forEach(g=>{if(groups[g].length)out.push(groups[g].shift())});
    return out;
  };
  /* echilibrat pe lecții; în recapitulare (întrebări cu `grup` = unitatea) întâi pe unități, apoi pe lecții în fiecare unitate */
  const roundRobin=list=>{
    const byLesson=rr(shuffle(list),lesson);
    if(!byLesson.some(k=>Lv.bazin[k].grup))return byLesson;
    return rr(byLesson,k=>Lv.bazin[k].grup||'?');
  };
  const pick=roundRobin(idx.filter(k=>!seen.includes(k))).concat(roundRobin(idx.filter(k=>seen.includes(k)))).slice(0,n);
  return {qs:shuffle(pick).map(k=>Lv.bazin[k]),pick};
}
/* „văzut” se scrie abia când runda e TERMINATĂ: o rundă deschisă și abandonată nu consumă întrebările */
function marcheazaVazut(i,pick){
  if(!pick||!pick.length)return;
  const Lv=C.nivele[i],idx=Lv.bazin.map((_,k)=>k);
  let next=citesteVazut(i).filter(k=>!pick.includes(k)).concat(pick);
  if(idx.every(k=>next.includes(k)))next=pick;   // a văzut tot bazinul: ciclul o ia de la capăt
  try{localStorage.setItem(vazutKey(i),JSON.stringify(next))}catch(e){}
}
function startLevel(i){
  const Lv=C.nivele[i];let pick=null;
  if(Lv.bazin){const t=trage(Lv,i);Lv.qs=t.qs;pick=t.pick}
  R={li:i,qi:0,max:0,punctat:{},atts:{},xp:0,first:0,streak:0,phase:Lv.pasi?'learn':'read',pick,si:0,vazutPas:{},pv:{},indiciu:{},mode:'test'};
  if(Lv.pasi)learnPage();else readPage();
}
/* textul întreg al nivelului (pentru „Recitește”): la nivelurile pe pași, toți pașii unul după altul */
function textNivel(Lv){
  if(!Lv.pasi)return Lv.text||'';
  return Lv.pasi.map(p=>`<h3 class="pas-h">${esc(p.t)}</h3>${p.text||''}${p.exemplu?`<div class="exemplu"><div class="lbl">Uite cum</div>${p.exemplu}</div>`:''}`).join('');
}

/* ---------------- ÎNVAȚĂ, pas cu pas (26.09.2026) ----------------
   El: „informația e prea condensată - nu e beginner friendly - e mai mult test decât asistență de învățare.
   Vreau ca aceste misiuni să îl conducă pe fiecare de la novice la expertiză. Să ofere informații și sarcini
   simple (cu variante reale pentru consolidare - la cerere) și posibilitatea efectivă a exersării - simulare
   a aplicației adevărate.” Un nivel cu `pasi:[…]` se învață întâi: o idee pe pagină, un exemplu lucrat,
   o explicație altfel la cerere, un exercițiu mic cu indiciu (fără puncte, fără stele) și „încă unul” cât vrea.
   Apoi atelierul (aplicația simulată, cu teste), apoi verificarea — doar pe ce s-a predat în pași. */
function learnPage(){
  const Lv=C.nivele[R.li],n=Lv.pasi.length,P=Lv.pasi[R.si];R.vazutPas[R.si]=true;
  const ultim=R.si===n-1,urm=ultim?(Lv.atelier?'La atelier →':'La verificare →'):'Pasul următor →';
  const ex=practiceList(P);
  shell(`
    <div class="row" style="justify-content:space-between"><div class="eyebrow">${nivelEticheta(R.li)} · învață · pasul ${R.si+1} din ${n}</div>
    <button class="btn ghost sm" id="go" type="button" title="Dacă știi deja tot ce e în pași, poți trece direct la verificare">Știu deja — la verificare</button></div>
    <h2 style="margin:8px 0 6px">${esc(P.t)}</h2>
    ${R.si===0&&Lv.obiectiv?`<p class="obiectiv"><b>La finalul nivelului:</b> ${Lv.obiectiv}</p>`:''}
    <div class="reading">${P.text||''}</div>
    ${P.exemplu?`<div class="exemplu"><div class="lbl">Uite cum</div>${P.exemplu}</div>`:''}
    ${P.altfel?`<button class="btn ghost sm" id="altfel" type="button" aria-expanded="false">Nu am înțeles — explică-mi altfel</button><div class="altfel reading" id="altfel-t" hidden>${P.altfel}</div>`:''}
    ${ex.length?`<section class="incearca" aria-label="Încearcă tu"><div class="lbl">Încearcă tu <span class="hint">· fără puncte, doar exersezi${ex.length>1?` · ${ex.length} exerciții la dispoziție`:''}</span></div>
      <div class="q" id="pq"></div><div id="body"></div><div id="fb" aria-live="polite"></div><div class="row" id="nav"></div></section>`:''}
    <div class="row pas-nav" style="margin-top:22px">
      <button class="btn" id="pas-prev" type="button">${R.si?'← Pasul anterior':'← Cuprins'}</button>
      <button class="btn primary" id="pas-next" type="button">${urm}</button>
    </div>`,tabsFor());
  const af=document.getElementById('altfel');
  if(af)af.onclick=()=>{const t=document.getElementById('altfel-t');t.hidden=!t.hidden;af.setAttribute('aria-expanded',String(!t.hidden));af.textContent=t.hidden?'Nu am înțeles — explică-mi altfel':'Ascunde explicația'};
  document.getElementById('go').onclick=()=>{R.mode='test';R.phase='q';question()};
  document.getElementById('pas-prev').onclick=()=>{if(R.si){R.si--;learnPage()}else home()};
  document.getElementById('pas-next').onclick=()=>{R.mode='test';if(!ultim){R.si++;learnPage()}else if(Lv.atelier){R.phase='atelier';atelierPage()}else{R.phase='q';question()}};
  if(ex.length)renderPractice(ex,'p'+R.si);
}
function practiceList(P){return [P.incearca].concat(P.inca||[]).filter(Boolean)}
/* un exercițiu fără scor, în #pq/#body/#fb/#nav; „Încă un exercițiu” trece la următorul din listă */
function renderPractice(list,key){
  const k=(R.pv[key]||0)%list.length,Q=list[k];
  R.mode='practice';R.pQ=Q;R.pKey=key;R.pList=list;R.done=false;R.att=0;
  document.getElementById('pq').innerHTML=(list.length>1?`<span class="nr-ex">Exercițiul ${k+1} din ${list.length}</span> `:'')+Q.q;
  document.getElementById('fb').innerHTML='';document.getElementById('nav').innerHTML='';
  const body=document.getElementById('body');body.innerHTML='';
  document.querySelectorAll('.ajutor').forEach(x=>x.remove());
  if(Q.ajutor)ajutorButon(Q,body);
  const t=TIPURI[Q.t];if(!t){body.innerHTML=`<p class="toast">Tip de exercițiu necunoscut: ${esc(Q.t)}</p>`;return}
  t(Q,body,API);
}
/* „Am nevoie de un indiciu”: în exersare e gratis; la verificare, răspunsul nu mai e „din prima” (2 stele max.) */
function ajutorButon(Q,body){
  const w=document.createElement('div');w.className='ajutor';
  w.innerHTML=`<button class="btn ghost sm" type="button">Am nevoie de un indiciu</button><div class="ajutor-t" hidden>${Q.ajutor}</div>`;
  body.parentNode.insertBefore(w,body);
  const b=w.querySelector('button'),t=w.querySelector('.ajutor-t');
  b.onclick=()=>{t.hidden=false;b.remove();if(R.mode==='test')R.indiciu[R.qi]=true};
}
/* ATELIERUL: aplicația simulată (tip-html, tip-foaie…), fără puncte; testele simulatorului arată ce e gata */
function atelierPage(){
  const Lv=C.nivele[R.li],A=Lv.atelier;
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · atelier</div>
    <h2 style="margin:8px 0 6px">${esc(A.titlu||'Fă-o ca în aplicația reală')}</h2>
    ${A.intro?`<div class="reading">${A.intro}</div>`:''}
    <section class="incearca atelier"><div class="q" id="pq"></div><div id="body"></div><div id="fb" aria-live="polite"></div><div class="row" id="nav"></div></section>
    <div class="row pas-nav" style="margin-top:22px">
      <button class="btn" id="pas-prev" type="button">← Înapoi la pași</button>
      <button class="btn primary" id="go" type="button">La verificare →</button>
    </div>`,tabsFor());
  document.getElementById('pas-prev').onclick=()=>{R.si=Lv.pasi.length-1;R.phase='learn';learnPage()};
  document.getElementById('go').onclick=()=>{R.mode='test';R.phase='q';question()};
  renderPractice([A].concat(A.inca||[]),'atelier');
}
function readPage(){
  const Lv=C.nivele[R.li];
  const intro=Lv.bazin
    ?`<p class="lede" style="margin:0 0 14px">${Lv.qs.length} întrebări alese la întâmplare din ${Lv.bazin.length}. La fiecare reluare primești altele, pe aceleași lucruri din lecții.</p>${Lv.text?`<div class="peek reading" style="display:block"><div class="lbl">Amintește-ți</div>${Lv.text}</div>`:''}`
    :`<div class="reading">${Lv.text}</div>`;
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · ${Lv.bazin?'pregătire':'pagina de citit'}</div>
    <h2 style="margin:8px 0 18px">${esc(Lv.t)}</h2>
    ${intro}
    <div class="row" style="margin-top:10px"><button class="btn primary" id="go" type="button">${Lv.bazin?'Încep runda →':'Am citit — la întrebări →'}</button>
    <span class="hint">${Lv.qs.length} întrebări${Lv.text?' · pagina se poate reciti oricând':''}</span></div>`,tabsFor());
  document.getElementById('go').onclick=()=>{R.phase='q';question()};
}
function question(){
  const Lv=C.nivele[R.li],Q=Lv.qs[R.qi];R.mode='test';R.att=R.atts[R.qi]||0;R.done=false;R.max=Math.max(R.max,R.qi);
  const tn=textNivel(Lv),inapoiLa=R.qi?String(R.qi-1):Lv.pasi?(Lv.atelier?'atelier':'p'+(Lv.pasi.length-1)):'citire';
  shell(`
    <div class="row" style="justify-content:space-between"><div class="eyebrow">${nivelEticheta(R.li)} · ${Lv.pasi?'verificare · ':''}${esc(Lv.t)}</div>
    <span class="row" style="gap:6px"><button class="btn ghost sm" id="inapoi" type="button" title="${R.qi?`Înapoi la întrebarea ${R.qi}`:'Înapoi'}">← Pasul anterior</button>
    <button class="btn ghost sm" id="peekb" type="button" aria-expanded="false" ${tn?'':'hidden'}>${Lv.bazin?'Amintește-ți':Lv.pasi?'Recitește pașii':'Recitește pagina'}</button></span></div>
    ${R.qi===0&&Lv.pasi?'<p class="hint" style="margin:6px 0 0">Acum verifici ce ai învățat în pași. Primești stele pentru răspunsurile corecte din prima; poți cere oricând un indiciu sau reciti pașii.</p>':''}
    ${R.punctat[R.qi]?'<p class="hint" style="margin:6px 0 0">Refaci un pas deja rezolvat: exersezi, dar punctele le-ai primit deja.</p>':''}
    <div class="peek reading" id="peek" hidden>${tn}</div>
    <div class="stack" style="margin-top:14px">
      <div class="q">${Q.q}</div>
      <div id="body"></div>
      <div id="fb" aria-live="polite"></div>
      <div class="row" id="nav"></div>
    </div>`,tabsFor());
  document.getElementById('inapoi').onclick=()=>mergiLa(inapoiLa);
  const pb=document.getElementById('peekb'),pk=document.getElementById('peek');
  pb.onclick=()=>{pk.hidden=!pk.hidden;pb.setAttribute('aria-expanded',String(!pk.hidden));pb.textContent=pk.hidden?(Lv.bazin?'Amintește-ți':Lv.pasi?'Recitește pașii':'Recitește pagina'):'Ascunde'};
  const t=TIPURI[Q.t];
  if(!t){document.getElementById('body').innerHTML=`<p class="toast">Tip de întrebare necunoscut: ${esc(Q.t)}</p>`;return}
  const body=document.getElementById('body');
  if(Q.ajutor&&!R.punctat[R.qi])ajutorButon(Q,body);
  t(Q,body,API);
}
function feedback(kind,html){document.getElementById('fb').innerHTML=`<div class="fb ${kind}">${html}</div>`}
/* exersarea (pași, atelier): fără puncte; după o greșeală apare singur indiciul, după corect „încă unul” */
function resolvePractice(correct,msg){
  const Q=R.pQ;if(R.done)return;
  if(correct){R.done=true;feedback('ok',`<strong>Corect!</strong>${Q.why?'<br>'+Q.why:''}`);practiceNext()}
  else{R.att++;
    const w=document.querySelector('.ajutor .ajutor-t');
    if(w&&w.hidden&&R.att>=1){w.hidden=false;const b=document.querySelector('.ajutor button');if(b)b.remove()}
    feedback('bad',`<strong>Nu încă.</strong> ${msg||''}${Q.ajutor&&R.att===1?' <em>Uită-te la indiciul de mai sus.</em>':''}`)}
}
function practiceNext(){
  const n=R.pList.length,k=(R.pv[R.pKey]||0)%n,nav=document.getElementById('nav');
  if(n>1){nav.insertAdjacentHTML('beforeend',`<button class="btn" id="inca" type="button">Încă un exercițiu (${k+1<n?`${n-k-1} ${n-k-1===1?'rămas':'rămase'}`:'o iei de la primul'})</button>`);
    document.getElementById('inca').onclick=()=>{R.pv[R.pKey]=k+1;renderPractice(R.pList,R.pKey);document.getElementById('pq').scrollIntoView({behavior:'smooth',block:'center'})}}
  if(R.pKey==='atelier')R.atelierGata=true;
}
function resolve(correct,msg){
  if(R.mode==='practice')return resolvePractice(correct,msg);
  const Q=C.nivele[R.li].qs[R.qi];
  if(R.done)return;
  if(R.punctat[R.qi]){   // pas refăcut după „Pasul anterior”: doar exercițiu, fără XP a doua oară
    if(correct){R.done=true;feedback('ok',`<strong>Corect!</strong> (punctele pentru pasul ăsta le-ai primit deja)<br>${Q.why}`);showNext()}
    else{R.att++;feedback('bad',`<strong>Nu încă.</strong> ${msg||''}`)}
    setHud();return;
  }
  if(correct){
    R.punctat[R.qi]=true;
    const dinPrima=R.att===0&&!R.indiciu[R.qi];
    let pts=dinPrima?10:R.att===0?7:4;
    if(dinPrima){R.first++;R.streak++;if(R.streak>=3)pts+=2}else R.streak=0;
    R.xp+=pts;R.done=true;
    feedback('ok',`<strong>Corect! +${pts} XP${dinPrima&&R.streak>=3?' (cu bonus de serie)':''}${!dinPrima&&R.att===0?' (cu indiciu)':''}</strong><br>${Q.why}`);
    showNext();
  }else{R.att++;R.atts[R.qi]=R.att;R.streak=0;feedback('bad',`<strong>Nu încă.</strong> ${msg||''}`)}
  setHud();
}
function giveUp(html){
  if(R.mode==='practice'){R.done=true;feedback('bad',`<strong>Uite răspunsul:</strong> ${html}${R.pQ.why?'<br>'+R.pQ.why:''}<br><em>Încearcă și exercițiul următor, ca să vezi dacă ai prins ideea.</em>`);practiceNext();return}
  const Q=C.nivele[R.li].qs[R.qi];R.done=true;if(!R.punctat[R.qi]){R.punctat[R.qi]=true;R.streak=0};feedback('bad',`<strong>Răspunsul corect:</strong> ${html}<br>${Q.why}`);showNext();setHud()}
function showNext(){
  if(R.mode==='practice')return;
  const last=R.qi===C.nivele[R.li].qs.length-1;
  document.getElementById('nav').innerHTML=`<button class="btn primary" id="next" type="button">${last?'Termină nivelul':'Mai departe →'}</button>`;
  const n=document.getElementById('next');n.focus({preventScroll:true});
  n.onclick=()=>{if(last)endLevel();else{R.qi++;question()}};
}
function revealButton(fn){
  const nav=document.getElementById('nav');
  if(R.att>=2&&!R.done&&!document.getElementById('reveal')){
    const b=document.createElement('button');b.className='btn ghost';b.id='reveal';b.type='button';b.textContent='Arată-mi răspunsul';b.onclick=fn;nav.appendChild(b);
  }
}
function checkButton(fn,label){
  const nav=document.getElementById('nav');
  nav.innerHTML=`<button class="btn primary" id="chk" type="button">${label||'Verifică'}</button>`;
  document.getElementById('chk').onclick=()=>{if(!R.done)fn()};
  return nav;
}
const API={esc,resolve,giveUp,revealButton,checkButton,feedback,shuffle,expandRange,
  done:()=>!!(R&&R.done),attempts:()=>R?R.att:0,nav:()=>document.getElementById('nav')};

/* ---------------- tipurile incluse ---------------- */
TIPURI.choice=function(Q,body){
  const order=Q.amesteca===false?Q.o.map((_,k)=>k):shuffle(Q.o.map((_,k)=>k));
  body.innerHTML=`<div class="opts">${order.map(k=>`<button class="opt" type="button" data-k="${k}">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
  const bs=[...body.querySelectorAll('.opt')];
  bs.forEach(b=>b.onclick=()=>{
    if(R.done)return;const k=+b.dataset.k;
    if(k===Q.ok){b.classList.add('ok');bs.forEach(x=>x.disabled=true);resolve(true)}
    else{b.classList.add('bad');b.disabled=true;resolve(false,'Mai încearcă. Dacă ai nevoie, recitește pagina.');
      if(R.att>=2){bs.forEach(x=>x.disabled=true);body.querySelector(`.opt[data-k="${Q.ok}"]`).classList.add('ok');giveUp(Q.html?Q.o[Q.ok]:esc(Q.o[Q.ok]))}}
  });
};
REZOLVA.choice=(Q,body)=>body.querySelector(`.opt[data-k="${Q.ok}"]`).click();
TIPURI.tf=(Q,body)=>TIPURI.choice({...Q,o:['Adevărat','Fals'],ok:Q.ok?0:1,amesteca:false},body);
REZOLVA.tf=(Q,body)=>body.querySelector(`.opt[data-k="${Q.ok?0:1}"]`).click();

TIPURI.order=function(Q,body){
  const n=Q.items.length;let pool=shuffle(Q.items.map((_,k)=>k));
  if(pool.every((v,k)=>v===k))pool.reverse();
  let picked=[];
  function draw(){
    body.innerHTML=`<div class="twocol">
      <div><div class="lbl">Pașii amestecați · apasă-i în ordine</div><div class="pool">${pool.filter(k=>!picked.includes(k)).map(k=>`<button class="opt" type="button" data-k="${k}">${esc(Q.items[k])}</button>`).join('')||'<span class="hint">Ai folosit toți pașii.</span>'}</div></div>
      <div><div class="lbl">Ordinea ta</div><div class="slots">${Array.from({length:n},(_,i)=>`<div class="slot ${picked[i]!==undefined?'full':''}"><b>${i+1}</b>${picked[i]!==undefined?esc(Q.items[picked[i]]):'—'}</div>`).join('')}</div></div>
    </div>`;
    body.querySelectorAll('.pool .opt').forEach(b=>b.onclick=()=>{if(R.done)return;picked.push(+b.dataset.k);draw()});
    if(R.done)return;
    const nav=document.getElementById('nav');
    nav.innerHTML=`<button class="btn primary" id="chk" type="button" ${picked.length<n?'disabled':''}>Verifică</button><button class="btn ghost" id="clr" type="button">Golește</button>`;
    document.getElementById('clr').onclick=()=>{picked=[];draw()};
    document.getElementById('chk').onclick=()=>{
      const good=picked.filter((v,i)=>v===i).length;
      if(good===n)resolve(true);else{resolve(false,`${good} din ${n} pași sunt la locul lor.`);picked=[];draw()}
    };
    revealButton(()=>{picked=Q.items.map((_,k)=>k);giveUp(Q.items.map(esc).join(' → '));draw()});
  }
  draw();
};
REZOLVA.order=(Q,body)=>{for(let k=0;k<Q.items.length;k++)body.querySelector(`.pool .opt[data-k="${k}"]`).click()};

TIPURI.classify=function(Q,body){
  const choice=Q.items.map(()=>null);
  body.innerHTML=`<div class="cls">${Q.items.map((it,k)=>`<div class="cls-row" data-k="${k}"><span class="val">${esc(it[0])}</span><span class="seg" role="group" aria-label="Categoria pentru ${esc(it[0])}">${Q.cats.map((c,ci)=>`<button type="button" data-c="${ci}" aria-pressed="false">${esc(c)}</button>`).join('')}</span></div>`).join('')}</div>`;
  body.querySelectorAll('.cls-row').forEach(row=>{
    const k=+row.dataset.k;
    row.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      if(R.done)return;choice[k]=+b.dataset.c;
      row.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      row.classList.remove('wrong','right');
    });
  });
  const nav=checkButton(()=>{
    if(choice.some(c=>c===null)){feedback('bad','<strong>Mai ai rânduri fără categorie.</strong> Alege câte una pentru fiecare.');return}
    let bad=0;
    body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k,ok=choice[k]===Q.items[k][1];row.classList.toggle('wrong',!ok);row.classList.toggle('right',ok);if(!ok)bad++});
    if(!bad){nav.innerHTML='';resolve(true)}
    else{resolve(false,`${bad} ${bad===1?'rând are':'rânduri au'} categoria greșită (marcate cu roșu).`);
      revealButton(()=>{body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k;row.classList.remove('wrong');row.classList.add('right');row.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.c===Q.items[k][1]))});nav.innerHTML='';giveUp('categoriile corecte sunt marcate acum.')})}
  });
};
REZOLVA.classify=(Q,body)=>Q.items.forEach((it,k)=>body.querySelector(`.cls-row[data-k="${k}"] button[data-c="${it[1]}"]`).click());

TIPURI.match=function(Q,body){
  const n=Q.pairs.length,left=shuffle(Q.pairs.map((_,k)=>k)),right=shuffle(Q.pairs.map((_,k)=>k));
  const link={};let sel=null;
  function draw(){
    const used=new Set(Object.values(link));
    body.innerHTML=`<div class="twocol match">
      <div><div class="lbl">Apasă întâi aici…</div><div class="pool">${left.map(k=>`<button class="opt ${sel===k?'on':''} ${k in link?'paired':''}" type="button" data-l="${k}">${k in link?`<span class="tag">${right.indexOf(link[k])+1}</span>`:''}${esc(Q.pairs[k][0])}</button>`).join('')}</div></div>
      <div><div class="lbl">…apoi perechea</div><div class="pool">${right.map((k,i)=>`<button class="opt ${used.has(k)?'paired':''}" type="button" data-r="${k}"><span class="tag">${i+1}</span>${esc(Q.pairs[k][1])}</button>`).join('')}</div></div>
    </div><p class="hint" style="margin:6px 0 0">Ai făcut ${Object.keys(link).length} din ${n} perechi. Apasă din nou pe un element din stânga ca să schimbi perechea.</p>`;
    body.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{if(R.done)return;const k=+b.dataset.l;if(k in link&&sel!==k){delete link[k]}sel=k;draw()});
    body.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{if(R.done||sel===null)return;const r=+b.dataset.r;for(const x in link)if(link[x]===r)delete link[x];link[sel]=r;sel=null;draw()});
  }
  draw();
  const nav=checkButton(()=>{
    if(Object.keys(link).length<n){feedback('bad',`<strong>Mai ai perechi de făcut.</strong> Leagă toate cele ${n} elemente.`);return}
    const bad=Object.keys(link).filter(k=>+k!==link[k]).length;
    if(!bad){nav.innerHTML='';resolve(true)}
    else{resolve(false,`${bad} ${bad===1?'pereche e greșită':'perechi sunt greșite'}. Schimbă-le și verifică din nou.`);
      revealButton(()=>{Q.pairs.forEach((_,k)=>link[k]=k);sel=null;draw();nav.innerHTML='';giveUp(Q.pairs.map(p=>`${esc(p[0])} → ${esc(p[1])}`).join('; '))})}
  });
};
REZOLVA.match=(Q,body)=>{for(let k=0;k<Q.pairs.length;k++){body.querySelector(`[data-l="${k}"]`).click();body.querySelector(`[data-r="${k}"]`).click()}};

/* hunt cu `cod:true` (26.09.2026, el: „ar trebui indentare și aliniere la stânga”): codul se arată ca în editor,
   pe rânduri, cu indentarea păstrată; `corect:'…'` = codul fără greșeli, arătat alături după răspuns. */
function huntCod(Q,body){
  const T=[],re=/\[\[([\s\S]*?)\|([\s\S]*?)\]\]/g;let last=0,m;
  const plain=s=>s.split(/(\s+)/).forEach(p=>{if(p!=='')T.push(/^\s+$/.test(p)?{x:p,ws:true,err:false}:{x:p,err:false})});
  while((m=re.exec(Q.src))){plain(Q.src.slice(last,m.index));T.push({x:m[1],err:true,why:m[2]});last=re.lastIndex}
  plain(Q.src.slice(last));
  HUNT_T=T;
  const total=T.filter(t=>t.err).length;
  // o greșeală cu spații (<a src="x">) se desenează cuvânt cu cuvânt, ca restul codului: un buton lung ar trăda răspunsul
  const btn=(k,x)=>`<button type="button" class="tk" data-k="${k}">${esc(x)}</button>`;
  body.innerHTML=`<pre class="hunt cod">${T.map((t,k)=>t.ws?esc(t.x):t.err&&/\s/.test(t.x)?t.x.split(/(\s+)/).filter(p=>p!=='').map(p=>/^\s+$/.test(p)?esc(p):btn(k,p)).join(''):btn(k,t.x)).join('')}</pre>
    <p class="hint" style="margin:6px 0 0">Ai marcat <span id="cnt">0</span> din ${total}. Apasă din nou ca să scoți un marcaj.</p>`;
  const marked=new Set();
  body.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{if(R.done)return;const k=+b.dataset.k,on=!marked.has(k);on?marked.add(k):marked.delete(k);body.querySelectorAll(`.tk[data-k="${k}"]`).forEach(x=>x.classList.toggle('marked',on));document.getElementById('cnt').textContent=marked.size});
  const list=()=>`<ul style="margin:.4em 0 0;padding-left:1.2em">${T.map(t=>t.err?`<li><span class="code">${esc(t.x)}</span> — ${esc(t.why)}</li>`:'').join('')}</ul>`
    +(Q.corect?`<div class="cod-corect"><div class="lbl">Codul corect</div><pre class="hunt cod">${esc(Q.corect)}</pre></div>`:'');
  const showFound=()=>{body.querySelectorAll('.tk').forEach(b=>{b.classList.remove('marked');if(T[+b.dataset.k].err)b.classList.add('found')})};
  const nav=checkButton(()=>{
    const hit=[...marked].filter(k=>T[k].err).length,wrong=marked.size-hit;
    if(hit===total&&wrong===0){showFound();nav.innerHTML='';resolve(true);document.querySelector('#fb .fb').insertAdjacentHTML('beforeend',list())}
    else{resolve(false,`Ai găsit ${hit} din ${total}${wrong?`, iar ${wrong} ${wrong===1?'marcaj e':'marcaje sunt'} pe cod corect`:''}.${Q.indiciu?' '+esc(Q.indiciu):''}`);
      revealButton(()=>{showFound();nav.innerHTML='';giveUp(`toate cele ${total} sunt marcate cu verde.`+list())})}
  });
}
TIPURI.hunt=function(Q,body){
  if(Q.cod)return huntCod(Q,body);
  const toks=[],re=/\[\[(.*?)\|(.*?)\]\]/g;let last=0,m;
  const plain=s=>s.split(/( )/).forEach(p=>{if(p!=='')toks.push({x:p,err:false})});
  while((m=re.exec(Q.src))){plain(Q.src.slice(last,m.index));toks.push({x:m[1],err:true,why:m[2]});last=re.lastIndex}
  plain(Q.src.slice(last));
  const T=[];toks.forEach(t=>{
    if(t.err&&t.x.trim()&&t.x!==t.x.trim()){const lead=t.x.match(/^ */)[0].length,trail=t.x.match(/ *$/)[0].length;
      for(let i=0;i<lead;i++)T.push({x:' ',err:false});T.push({x:t.x.trim(),err:true,why:t.why});for(let i=0;i<trail;i++)T.push({x:' ',err:false});}
    else T.push(t);
  });
  HUNT_T=T;
  const total=T.filter(t=>t.err).length,dots=!!Q.spatii;
  /* O greșeală cu mai multe cuvinte se desenează tot cuvânt cu cuvânt, ca textul corect: un buton lung ar trăda
     răspunsul prin lungime (semnalat de evaluator, 15.09.2026). Toate cuvintele ei au același data-k și se marchează împreună. */
  const btn=(k,x,sp)=>`<button type="button" class="tk ${sp?'sp':''}" data-k="${k}" aria-label="${sp?(x.length>1?'spațiu dublu':'spațiu'):esc(x)}">${sp?x.replace(/ /g,'·'):esc(x)}</button>`;
  body.innerHTML=`<div class="hunt">${T.map((t,k)=>{const sp=!t.x.trim();
    if(sp&&!t.err&&!dots)return ' ';
    if(sp||!t.err||!/ /.test(t.x))return btn(k,t.x,sp);
    return t.x.split(/( )/).filter(p=>p!=='').map(p=>p===' '?(dots?btn(k,p,true):' '):btn(k,p,false)).join('');
  }).join('')}</div>
    <p class="hint" style="margin:6px 0 0">Ai marcat <span id="cnt">0</span> din ${total}. Apasă din nou ca să scoți un marcaj.</p>`;
  const marked=new Set();
  body.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{if(R.done)return;const k=+b.dataset.k;const on=!marked.has(k);on?marked.add(k):marked.delete(k);
    body.querySelectorAll(`.tk[data-k="${k}"]`).forEach(x=>x.classList.toggle('marked',on));document.getElementById('cnt').textContent=marked.size});
  const list=()=>`<ul style="margin:.4em 0 0;padding-left:1.2em">${T.map(t=>t.err?`<li><span class="code">${t.x.trim()?esc(t.x):t.x.replace(/ /g,'·')}</span> — ${esc(t.why)}</li>`:'').join('')}</ul>`;
  const showFound=()=>{body.querySelectorAll('.tk').forEach(b=>{b.classList.remove('marked');if(T[+b.dataset.k].err)b.classList.add('found')})};
  const nav=checkButton(()=>{
    const hit=[...marked].filter(k=>T[k].err).length,wrong=marked.size-hit;
    if(hit===total&&wrong===0){showFound();nav.innerHTML='';resolve(true);document.querySelector('#fb .fb').insertAdjacentHTML('beforeend',list())}
    else{resolve(false,`Ai găsit ${hit} din ${total}${wrong?`, iar ${wrong} ${wrong===1?'marcaj e':'marcaje sunt'} pe text corect`:''}.${Q.indiciu?' '+esc(Q.indiciu):''}`);
      revealButton(()=>{showFound();nav.innerHTML='';giveUp(`toate cele ${total} sunt marcate cu verde.`+list())})}
  });
};
let HUNT_T=[];
REZOLVA.hunt=(Q,body)=>{const seen=new Set();body.querySelectorAll('.tk').forEach(b=>{const k=+b.dataset.k;if(HUNT_T[k].err&&!seen.has(k)){seen.add(k);b.click()}})};

TIPURI.pick=function(Q,body){
  let a=null,b=null;
  const label=()=>{if(!a)return '—';if(!Q.range||!b)return a;const r=expandRange(a,b);return r[0]+':'+r[r.length-1]};
  const inSel=ad=>a&&(!b?ad===a:expandRange(a,b).includes(ad));
  function draw(){
    let h=`<div class="gridwrap"><table class="g"><thead><tr><th></th>`;
    for(let c=0;c<Q.cols;c++)h+=`<th>${L(c)}</th>`;
    h+='</tr></thead><tbody>';
    for(let r=1;r<=Q.rows;r++){h+=`<tr><th>${r}</th>`;for(let c=0;c<Q.cols;c++){const ad=L(c)+r,txt=Q.cells&&Q.cells[ad]!=null?esc(Q.cells[ad]):'';h+=`<td class="${inSel(ad)?(ad===a&&!b?'pick':'inr'):''}"><button type="button" data-a="${ad}" aria-label="Celula ${ad}">${txt}</button></td>`}h+='</tr>'}
    body.innerHTML=`<p class="hint" style="margin:0 0 6px">Ai ales: <strong class="code">${label()}</strong></p>`+h+'</tbody></table></div>'+(Q.range?'<p class="hint" style="margin:6px 0 0">Primul clic = un colț, al doilea = colțul opus. Al treilea clic o ia de la capăt.</p>':'');
    body.querySelectorAll('.g button').forEach(x=>x.onclick=()=>{if(R.done)return;const ad=x.dataset.a;if(!Q.range||!a||b){a=ad;b=null}else b=ad;draw()});
  }
  draw();
  const nav=checkButton(()=>{
    const got=label();
    if(got===Q.ans){nav.innerHTML='';resolve(true)}
    else{resolve(false,got==='—'?'Nu ai ales nimic încă.':`Ai ales ${got}. Caută întâi coloana (litera de sus), apoi rândul (numărul din stânga).`);
      revealButton(()=>{const p=Q.ans.split(':');a=p[0];b=p[1]||null;draw();nav.innerHTML='';giveUp(Q.ans)})}
  });
};
REZOLVA.pick=(Q,body)=>{const p=Q.ans.split(':');body.querySelector(`.g button[data-a="${p[0]}"]`).click();if(p[1])body.querySelector(`.g button[data-a="${p[1]}"]`).click()};

/* ---------------- final de nivel + diplomă ---------------- */
function endLevel(){
  const Lv=C.nivele[R.li],n=Lv.qs.length,ratio=R.first/n,stars=ratio===1?3:ratio>=.6?2:1;
  const prev=S.lv[R.li];
  S.lv[R.li]={stars:Math.max(stars,prev?prev.stars:0),xp:Math.max(R.xp,prev?prev.xp:0)};
  save();R.phase='end';
  if(C.nivele[R.li].bazin)marcheazaVazut(R.li,R.pick);
  const next=R.li+1<C.nivele.length;
  raporteaza({tip:'nivel',nivel:R.li+1,stele:S.lv[R.li].stars,max:3});
  try{if(window.Prezenta&&window.Prezenta.salveaza)window.Prezenta.salveaza()}catch(x){}
  if(!prev&&C.nivele.every((_,i)=>S.lv[i]))raporteaza({tip:'joc-gata',stele:totals().st,max:C.nivele.length*3});
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · terminat${(()=>{const rest=C.nivele.length-R.li-1,a=C.mod==='antrenament';return next?` · ${rest===1?(a?'mai e o rundă':'mai e un nivel'):`mai sunt ${rest} ${a?'runde':'niveluri'}`}`:` · ai terminat toate ${a?'rundele':'nivelurile'}`})()}</div>
    <div class="end-stars" style="margin:14px 0 6px" aria-label="${stars===1?'o stea':stars+' stele'} din 3">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div>
    <h2>${stars===3?'Perfect, toate din prima!':stars===2?'Foarte bine!':(C.mod==='antrenament'?'Rundă trecută. Poți lua mai multe stele.':'Nivel trecut. Poți lua mai multe stele.')}</h2>
    <p class="lede">${R.first} din ${n} răspunsuri corecte din prima · ${R.xp} XP.${stars<3?(C.mod==='antrenament'?' Reia runda: primești alte întrebări pe aceleași lucruri.':' Recitește pagina și reia nivelul pentru 3 stele.'):''}</p>
    <div class="row" style="margin-top:20px">
      ${next?`<button class="btn primary" id="nx" type="button">${C.mod==='antrenament'?'Runda următoare':'Nivelul următor'} →</button>`:'<button class="btn primary" id="dp" type="button">Vezi diploma</button>'}
      <button class="btn" id="again" type="button">${C.mod==='antrenament'?'Reia runda (alte întrebări)':'Reia nivelul'}</button>
      <button class="btn ghost" id="toc" type="button">Cuprins</button>
    </div>`,tabsFor());
  const nx=document.getElementById('nx');if(nx)nx.onclick=()=>startLevel(R.li+1);
  const dp=document.getElementById('dp');if(dp)dp.onclick=diploma;
  document.getElementById('again').onclick=()=>startLevel(R.li);
  document.getElementById('toc').onclick=home;
}
function diploma(){
  R=null;const t=totals(),d=new Date(),D=C.diploma;
  const data=`${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  shell(`
    <div class="diploma">
      <div class="eyebrow">Diplomă</div>
      <h2 style="margin-top:6px">${esc(D.titlu)}</h2>
      <div class="nm">${esc(S.nume||'Elevul fără nume')}</div>
      <p style="margin:0 auto 14px;max-width:46ch">a trecut toate cele ${C.nivele.length} ${C.mod==='antrenament'?'runde ale antrenamentului':'niveluri ale jocului'} „${esc(C.titlu)}”: ${esc(D.rezumat)}.</p>
      <div class="facts"><span>★ ${t.st}/${C.nivele.length*3}</span><span>${t.xp} XP</span><span>${data}</span></div>
    </div>
    ${trimiteHtml()}
    <h3 style="margin-top:28px">Provocarea din ${esc(D.aplicatie)}</h3>
    <p class="hint" style="margin:4px 0 10px">Arată-i profesorului diploma, apoi fă asta pe bune:</p>
    <ol class="check">${D.provocare.map(x=>`<li>${x}</li>`).join('')}</ol>
    ${ghidButoane()}
    <div class="row" style="margin-top:16px"><button class="btn" id="toc" type="button">Înapoi la cuprins</button><a class="btn ghost" href="../index.html">Toate jocurile</a></div>`);
  document.getElementById('toc').onclick=home;
  wireGhid();
  wireTrimite(t,data);
}

/* ---------------- diploma pe telefon + trimisă profesorului (24.09.2026) ----------------
   Calculatoarele din laborator sunt comune: nimeni nu se conectează acolo la e-mail sau WhatsApp.
   (1) Codul QR duce diploma pe TELEFONUL elevului (../diploma/#d=…): totul stă după „#”, deci
       nu trece prin niciun server; de acolo o salvează sau o trimite oriunde.
   (2) „Trimite-o profesorului”: școala + clasa + numele CRIPTAT cu cheia publică a profesorului
       (diplome-date.js, generat de C:\00\AI_0\tools\diplome.py) -> serverul testelor. Profesorul
       le descarcă cu `diplome.py descarca`, pe școli / clase / nume. */
function incarcaScript(nume){
  return new Promise((ok,nu)=>{const s=document.createElement('script');s.src=new URL(nume,MOTOR_URL).href;s.onload=ok;s.onerror=nu;document.head.appendChild(s)});
}
function trimiteHtml(){
  return `<div class="dipl-plus">
      <label for="d-nume">Numele tău, așa cum vrei să apară pe diplomă</label>
      <input id="d-nume" type="text" maxlength="40" autocomplete="off" value="${esc(S.nume)}" placeholder="ex. Ana Popescu">
      <div class="dipl-cols">
        <section class="dipl-qr"><h3>Ia diploma pe telefon</h3>
          <div id="d-qr" class="qr" aria-label="Cod QR pentru diplomă"></div>
          <p class="hint">Scanează codul cu camera telefonului. Diploma se deschide pe telefonul tău, de unde o salvezi sau o trimiți pe WhatsApp. <a id="d-link" href="#" target="_blank" rel="noopener">Sau deschide-o aici.</a></p>
        </section>
        <section class="dipl-prof"><h3>Trimite-o profesorului</h3>
          <label for="d-scoala">Școala</label><select id="d-scoala"><option value="">— alege —</option></select>
          <label for="d-clasa">Clasa</label><select id="d-clasa" disabled><option value="">— alege școala întâi —</option></select>
          <button class="btn primary" id="d-trimite" type="button" disabled>Trimite diploma</button>
          <p class="hint" id="d-stare" aria-live="polite"></p>
        </section>
      </div>
    </div>`;
}
function b64url(obj){const b=new TextEncoder().encode(JSON.stringify(obj));let s='';b.forEach(x=>s+=String.fromCharCode(x));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function wireTrimite(t,data){
  const $=id=>document.getElementById(id),D=C.diploma,inp=$('d-nume');if(!inp)return;
  let trimisa=false;
  const nume=()=>inp.value.trim();
  const payload=()=>({n:nume(),t:D.titlu,j:C.titlu,u:C.mod==='antrenament'?'runde':'niveluri',v:C.nivele.length,s:t.st,m:C.nivele.length*3,x:t.xp,d:data,c:String(C.clasa)});
  const linkTel=()=>new URL('../diploma/',MOTOR_URL).href+'#d='+b64url(payload());
  function qr(){
    const u=linkTel();$('d-link').href=u;
    if(!window.qrcode)return;
    try{const q=qrcode(0,'M');q.addData(u);q.make();$('d-qr').innerHTML=q.createSvgTag({cellSize:4,margin:2,scalable:true})}catch(e){$('d-qr').textContent='Codul QR nu s-a putut face - folosește „deschide-o aici”.'}
  }
  function poateTrimite(){$('d-trimite').disabled=trimisa||!(nume().split(/\s+/).length>=2&&$('d-clasa').value)}
  inp.addEventListener('input',()=>{S.nume=nume();save();const nm=app.querySelector('.diploma .nm');if(nm)nm.textContent=S.nume||'Elevul fără nume';qr();poateTrimite()});
  incarcaScript('qrcode.min.js').then(qr).catch(()=>qr());
  qr();
  incarcaScript('diplome-date.js').then(()=>{
    const Z=window.DIPLOME;if(!Z||!Z.scoli)throw 0;
    $('d-scoala').insertAdjacentHTML('beforeend',Z.scoli.map(x=>`<option value="${esc(x.key)}">${esc(x.nume)}</option>`).join(''));
    $('d-scoala').onchange=()=>{const sc=Z.scoli.find(x=>x.key===$('d-scoala').value),cl=$('d-clasa');
      cl.innerHTML=sc?'<option value="">— alege —</option>'+sc.clase.map(c=>`<option>${esc(c)}</option>`).join(''):'<option value="">— alege școala întâi —</option>';
      cl.disabled=!sc;poateTrimite()};
    $('d-clasa').onchange=poateTrimite;
    $('d-trimite').onclick=async()=>{
      const st=$('d-stare'),bt=$('d-trimite');
      if(nume().split(/\s+/).length<2){st.textContent='Scrie numele și prenumele.';return}
      bt.disabled=true;st.textContent='Se trimite…';
      try{
        const k=await crypto.subtle.importKey('jwk',Z.cheie,{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);
        const enc=new Uint8Array(await crypto.subtle.encrypt({name:'RSA-OAEP'},k,new TextEncoder().encode(nume())));
        let bin='';enc.forEach(x=>bin+=String.fromCharCode(x));
        const r=await fetch(Z.server,{method:'POST',body:JSON.stringify({scoala:$('d-scoala').value,clasa:$('d-clasa').value,joc:C.cheie,
          titluJoc:C.titlu,titlu:D.titlu,clasaJoc:String(C.clasa),stele:t.st,max:C.nivele.length*3,xp:t.xp,nivele:C.nivele.length,data,numeEnc:btoa(bin)})});
        const j=await r.json().catch(()=>({}));
        if(!r.ok||!j.ok)throw new Error(j.eroare||('HTTP '+r.status));
        trimisa=true;st.innerHTML='<b>✓ Trimisă.</b> Domnul profesor o primește în folderul clasei tale.';
      }catch(e){bt.disabled=false;st.textContent='Nu s-a trimis ('+(e.message||'fără internet')+'). Mai apasă o dată.'}
    };
  }).catch(()=>{$('d-stare').textContent='Lista claselor nu s-a încărcat. Reîncarcă pagina.'});
}

/* ---------------- ghidurile „n-am calculator, am telefon” ----------------
   Un ghid = drumul pas cu pas prin aplicația reală, cu o captură la fiecare pas.
   Capturile se fac pe un Android emulat (_motor\ghid_telefon.py) și stau în
   jocuri\_ghiduri\<id>\, ca să le folosească toate jocurile care cer același lucru.
   Jocul declară `ghiduri:['cont-drive','docs']` și încarcă fișierele lor de pași. */
const GHIDURI={};
function inregistreazaGhid(id,def){GHIDURI[id]=Object.assign({id},def)}
function ghidListaJoc(){return (C.ghiduri||[]).map(id=>GHIDURI[id]).filter(Boolean)}
function ghidButoane(){
  const g=ghidListaJoc();if(!g.length)return '';
  return `<div class="ghid-oferta">
    <p class="hint" style="margin:0 0 8px">Nu ai calculator acasă? Se poate și de pe telefon — îți arăt fiecare pas, cu poze de pe ecran:</p>
    <div class="row">${g.map(x=>`<button class="btn" type="button" data-ghid="${esc(x.id)}">${esc(x.buton||('Cum fac în '+x.app))} →</button>`).join('')}</div>
  </div>`;
}
function wireGhid(){app.querySelectorAll('[data-ghid]').forEach(b=>b.onclick=()=>ghidDeschide(b.dataset.ghid,0))}
function ghidDeschide(id,i){
  const G=GHIDURI[id];if(!G)return;
  R=null;const n=G.pasi.length;i=Math.max(0,Math.min(i,n-1));const P=G.pasi[i];
  shell(`
    <div class="eyebrow">Ghid pas cu pas · ${esc(G.app)}</div>
    <h2 style="margin-top:6px">${esc(G.titlu)}</h2>
    ${i===0&&G.intro?`<div class="lede" style="margin:10px 0 0">${G.intro}</div>`:''}
    <div class="ghid">
      <div class="telefon"><div class="telefon-ecran">
        <img src="${esc(P.img)}" alt="${esc(P.alt||P.t)}" width="${P.w||360}" height="${P.h||780}" loading="eager">
      </div></div>
      <div class="ghid-text">
        <div class="ghid-nr">Pasul ${i+1} din ${n}</div>
        <h3>${P.t}</h3>
        ${P.d?`<div class="reading" style="margin-top:8px">${P.d}</div>`:''}
        ${P.atentie?`<div class="fb bad" style="margin-top:10px"><strong>Atenție:</strong> ${P.atentie}</div>`:''}
        <div class="row" style="margin-top:16px">
          <button class="btn" id="g-prev" type="button" ${i===0?'disabled':''}>← Înapoi</button>
          ${i<n-1?'<button class="btn primary" id="g-next" type="button">Următorul pas →</button>':'<button class="btn primary" id="g-gata" type="button">Gata, am terminat</button>'}
        </div>
      </div>
    </div>
    <div class="ghid-pasi" aria-label="Toți pașii">${G.pasi.map((p,k)=>`<button type="button" class="gp${k===i?' on':''}" data-p="${k}"><span class="n">${k+1}</span><span class="t">${esc(p.t.replace(/<[^>]+>/g,''))}</span></button>`).join('')}</div>
    <div class="row" style="margin-top:18px"><button class="btn ghost" id="g-inapoi" type="button">Înapoi la diplomă</button></div>`);
  const prev=document.getElementById('g-prev');if(prev)prev.onclick=()=>ghidDeschide(id,i-1);
  const next=document.getElementById('g-next');if(next)next.onclick=()=>ghidDeschide(id,i+1);
  const gata=document.getElementById('g-gata');if(gata)gata.onclick=diploma;
  document.getElementById('g-inapoi').onclick=diploma;
  app.querySelectorAll('.gp').forEach(b=>b.onclick=()=>ghidDeschide(id,+b.dataset.p));
}

/* ---------------- bara de sus care se restrânge (mobil; revenire DOAR manuală) ---------------- */
function wireHeader(){
  const narrow=matchMedia('(max-width:600px)'),bar=document.querySelector('.hud-in'),cls=document.body.classList;
  let last=window.scrollY,acc=0;
  window.addEventListener('scroll',()=>{const y=window.scrollY,dd=y-last;last=y;if(!narrow.matches||dd<=0){acc=0;return}acc+=dd;if(acc>24&&y>80)cls.add('hdr-collapsed')},{passive:true});
  document.getElementById('hdr-pull').onclick=()=>cls.remove('hdr-collapsed');
  let startY=null,captured=false;
  bar.addEventListener('pointerdown',e=>{if(cls.contains('hdr-collapsed')){startY=e.clientY;captured=false}});
  bar.addEventListener('pointermove',e=>{if(startY===null)return;const dy=e.clientY-startY;if(!captured&&dy>10){try{bar.setPointerCapture(e.pointerId)}catch(_){}captured=true}if(dy>28){cls.remove('hdr-collapsed');startY=null}});
  bar.addEventListener('pointerup',()=>{startY=null});
  bar.addEventListener('pointercancel',()=>{startY=null});
}

/* ---------------- evidența activității (24.09.2026) ----------------
   assets/js/prezenta.js (același pe tot LearningHub-ul) numără timpul lucrat și îl trimite profesorului.
   Jocul îi spune în plus ce nivel s-a terminat și cu câte stele. Numele: dacă elevul s-a înscris deja pe site,
   îl punem și pe diplomă; „Sunt alt elev” șterge și înscrierea, ca pe calculatorul comun să nu rămână colegul. */
function prezenta(){
  if(!document.getElementById('lh-prezenta')){
    const s=document.createElement('script');s.id='lh-prezenta';s.defer=true;
    s.src=new URL('../../assets/js/prezenta.js',MOTOR_URL).href;document.head.appendChild(s);
  }
  const iaNumele=()=>{const e=window.Prezenta&&window.Prezenta.identitate();if(e&&!S.nume){S.nume=e.nume;save();const n=document.getElementById('nume');if(n&&!n.value)n.value=e.nume}};
  /* 25.09.2026 (Filip: „sunt la nivelul 4 demult”, panoul arăta 1): nivelurile terminate ÎNAINTE de înscriere
     (sau cât stătea pe ecran „Ești tot…?”) nu plecau niciodată. La deschidere și la fiecare înscriere/„Da”
     trimitem tot ce e deja făcut (serverul păstrează maximul de stele, deci nu se dublează nimic) - DOAR dacă
     numele din joc e al elevului înscris, ca pe calculatorul comun să nu primească nivelurile colegului. */
  const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').sort().join(' ');
  const sincron=()=>{const e=window.Prezenta&&window.Prezenta.identitate();if(!e||!S.nume||norm(S.nume)!==norm(e.nume))return;
    const facute=Object.keys(S.lv);if(!facute.length)return;
    facute.forEach(i=>raporteaza({tip:'nivel',nivel:+i+1,stele:S.lv[i].stars||0,max:3}));
    if(C.nivele.every((_,i)=>S.lv[i]))raporteaza({tip:'joc-gata',stele:totals().st,max:C.nivele.length*3});};
  addEventListener('prezenta',()=>{iaNumele();sincron();cineLucreaza()});
  addEventListener('load',()=>{iaNumele();sincron();cineLucreaza()});
  // progres venit de pe alt aparat (prezenta.js l-a scris deja în localStorage): cuprinsul se redesenează
  addEventListener('lh-progres',()=>{S=load();if(!R)home()});
}
/* jocul = numele FOLDERULUI (excel-viii), nu C.cheie: jurnalul și panoul fac legătura spre /jocuri/<folder>/ */
const jocSlug=()=>{const m=location.pathname.match(/\/jocuri\/([a-z0-9_-]+)\//i);return m?m[1]:C.cheie};
function raporteaza(e){try{if(window.Prezenta)window.Prezenta.eveniment(Object.assign({joc:jocSlug(),titlu:C.titlu,din:C.nivele.length},e))}catch(x){}}

/* ---------------- pornire ---------------- */
/* simulatoarele reutilizabile din _motor (tip-html.js…) se înregistrează singure, înainte de porneste() */
const EXT={};
function tipNou(nume,def){EXT[nume]=def}
function porneste(config){
  C=config;
  ['cheie','titlu','clasa','unitate','unitateTitlu','competente','intro','nivele','diploma'].forEach(k=>{if(C[k]==null)throw new Error('JocMotor: lipsește „'+k+'” din configurație')});
  Object.entries(Object.assign({},EXT,C.tipuri||{})).forEach(([k,v])=>{TIPURI[k]=v.render;if(v.rezolva)REZOLVA[k]=v.rezolva;if(v.gresit)GRESIT[k]=v.gresit});
  S=load();
  prezenta();
  document.body.insertAdjacentHTML('afterbegin',`<header class="hud"><div class="hud-in">
    <button class="brand" id="go-home" type="button">${C.marca||esc(C.titlu)}</button>
    <div class="fbar" id="hud" aria-live="polite"></div>
    <button class="pulldown" id="hdr-pull" type="button" aria-label="Arată bara de sus" title="Arată bara de sus">▾</button>
  </div></header><main><nav class="crumbs" id="crumbs" aria-label="Unde ești"></nav><div id="app"></div></main>`);
  app=document.getElementById('app');hud=document.getElementById('hud');
  document.getElementById('go-home').onclick=home;
  wireHeader();
  home();
}

/* ---------------- pentru poarta de testare (test_joc.py) ---------------- */
const testHooks={
  config:()=>C,
  stare:()=>R?{li:R.li,qi:R.qi,phase:R.phase,done:R.done,mode:R.mode,si:R.si,nEx:R.pList?R.pList.length:0}:null,
  deblocheaza:()=>{C.nivele.forEach((_,i)=>S.lv[i]=S.lv[i]||{stars:1,xp:0});save()},
  toateIntrebarile:()=>{TEST_TOATE=true},   // antrenament: poarta joacă tot bazinul, nu doar ce iese la tragere
  /* nivelurile pe pași: poarta deschide fiecare pas și fiecare exercițiu („încă unul”), apoi atelierul */
  tipuri:()=>Object.keys(TIPURI),
  pas:k=>{R.si=k;R.phase='learn';learnPage()},
  atelier:()=>{R.phase='atelier';atelierPage()},
  exercitiu:k=>{R.pv[R.pKey]=k;renderPractice(R.pList,R.pKey)},
  rezolva:()=>{
    const Q=R.mode==='practice'?R.pQ:C.nivele[R.li].qs[R.qi],body=document.getElementById('body');
    if(!REZOLVA[Q.t])return false;
    REZOLVA[Q.t](Q,body,API);return true;
  },
  /* pune în pagină un răspuns GREȘIT tipic (doar simulatoarele care declară gresit); poarta verifică apoi că e respins */
  gresit:()=>{
    const Q=R.mode==='practice'?R.pQ:C.nivele[R.li].qs[R.qi],body=document.getElementById('body');
    if(!GRESIT[Q.t])return false;
    GRESIT[Q.t](Q,body,API);return true;
  }
};
window.JocMotor={porneste,ghid:inregistreazaGhid,tip:tipNou,test:testHooks,esc,expandRange};
})();
