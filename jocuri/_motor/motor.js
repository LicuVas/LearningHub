/* Motorul lecțiilor-joc (LearningHub/jocuri). Specificația completă: README.md din acest folder.
   Un joc = index.html cu tema lui + JocMotor.porneste({...configurație...}).
   Tipuri de întrebări incluse: choice, tf, order, classify, match, hunt, pick.
   Tipuri noi (simulatoare) vin prin config.tipuri = { nume: { render(Q, body, api), rezolva(Q, body, api) } }. */
(function(){
'use strict';
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
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(C.cheie))}catch(e){}if(!s||typeof s!=='object')s={nume:'',lv:{}};if(!s.lv)s.lv={};return s}
function save(){try{localStorage.setItem(C.cheie,JSON.stringify(S))}catch(e){}}
function totals(){let st=0,xp=0;for(const k in S.lv){st+=S.lv[k].stars||0;xp+=S.lv[k].xp||0}return{st,xp}}
const unlocked=i=>i===0||!!S.lv[i-1];
const starsHtml=n=>[0,1,2].map(i=>i<n?'<span class="on">★</span>':'<span>☆</span>').join('');

function setHud(){
  const t=totals();
  if(R){
    const Lv=C.nivele[R.li];
    const nb=`Nivelul ${R.li+1} din ${C.nivele.length}`;
    const txt=R.phase==='q'?`Întrebarea ${R.qi+1} din ${Lv.qs.length} · ${R.xp} XP`:R.phase==='read'?`Citire · ${esc(Lv.t)}`:`Nivel terminat · ${R.xp} XP`;
    hud.innerHTML=`<span class="nb">${nb}</span><span class="fv">${txt}${R.streak>=2?` <span class="hot">serie ×${R.streak}</span>`:''}</span>`;
  }else hud.innerHTML=`<span class="nb">TOTAL</span><span class="fv">★ ${t.st}/${C.nivele.length*3} · ${t.xp} XP</span>`;
}
function shell(inner,tabs){
  app.innerHTML=`<div class="book"><div class="banda" aria-hidden="true">${C.banda||''}</div><div class="foaie">${inner}</div>${tabs?`<div class="tabs" aria-hidden="true">${tabs}</div>`:''}</div>`;
  setHud();setCrumbs();window.scrollTo({top:0});
}
/* breadcrumb: 🏠 LearningHub › Jocuri TIC › Clasa › Jocul [› Nivelul N]. Căile sunt relative la jocuri/<slug>/index.html. */
function setCrumbs(){
  const nav=document.getElementById('crumbs');if(!nav)return;
  const m=String(C.clasa).match(/([IVX]+)/),cls=m?m[1]:'';
  const sep='<span class="sep" aria-hidden="true">›</span>';
  const parts=[`<a href="../../hub/index.html">🏠 LearningHub</a>`,`<a href="../index.html">Jocuri TIC</a>`];
  if(cls)parts.push(`<a href="../index.html#clasa-${cls}">Clasa ${esc(C.clasa)}</a>`);
  if(R){parts.push(`<button type="button" class="crumb-btn" id="crumb-game">${esc(C.titlu)}</button>`);parts.push(`<span class="cur" aria-current="page">${nivelEticheta(R.li)}</span>`)}
  else parts.push(`<span class="cur" aria-current="page">${esc(C.titlu)}</span>`);
  nav.innerHTML=parts.join(sep);
  const g=document.getElementById('crumb-game');if(g)g.onclick=home;
}
/* „Nivelul 3 din 7”, „Nivelul final (7 din 7)” - elevii întreabă câte niveluri sunt */
function nivelEticheta(i){const n=C.nivele.length;return C.nivele[i].final?`Nivelul final (${i+1} din ${n})`:`Nivelul ${i+1} din ${n}`}
function tabsFor(){
  const Lv=C.nivele[R.li];
  return `<span class="${R.phase==='read'?'now':'done'}">Citire</span>`+Lv.qs.map((_,k)=>{
    const cls=R.phase==='end'||(R.phase==='q'&&k<R.qi)?'done':(R.phase==='q'&&k===R.qi?'now':'');
    return `<span class="${cls}">Î${k+1}</span>`}).join('');
}

/* ---------------- cuprins ---------------- */
function home(){
  R=null;
  const allDone=C.nivele.every((_,i)=>S.lv[i]);
  const rows=C.nivele.map((Lv,i)=>{const d=S.lv[i],u=unlocked(i);
    return `<button class="lvl" type="button" data-l="${i}" ${u?'':'disabled'}><span class="n">${i+1} din ${C.nivele.length}${Lv.final?' · final':''}</span><span class="t">${esc(Lv.t)}</span><span class="s">${d?starsHtml(d.stars):u?'începe →':'blocat'}</span></button>`}).join('');
  shell(`
    <div class="eyebrow">TIC · clasa ${esc(C.clasa)} · ${esc(C.unitateTitlu)}</div>
    <h1 style="margin-top:8px">${C.h1||esc(C.titlu)}</h1>
    <div class="lede">${C.intro}</div>
    <div class="ancora">Programa: ${esc(C.competente.join(', '))} · unitatea ${esc(C.unitate)}${C.lectii?` · lecțiile ${esc(C.lectii)}`:''}</div>
    <div class="namerow"><label for="nume">Numele tău, pentru diplomă</label><input id="nume" type="text" autocomplete="off" maxlength="40" value="${esc(S.nume)}" placeholder="ex. Ana Popescu"></div>
    <div class="toc-h">${C.nivele.length} niveluri · se deblochează pe rând · ultimul e nivelul final</div>
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
}

/* ---------------- nivel ---------------- */
function startLevel(i){R={li:i,qi:0,xp:0,first:0,streak:0,phase:'read'};readPage()}
function readPage(){
  const Lv=C.nivele[R.li];
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · pagina de citit</div>
    <h2 style="margin:8px 0 18px">${esc(Lv.t)}</h2>
    <div class="reading">${Lv.text}</div>
    <div class="row" style="margin-top:10px"><button class="btn primary" id="go" type="button">Am citit — la întrebări →</button>
    <span class="hint">${Lv.qs.length} întrebări · pagina se poate reciti oricând</span></div>`,tabsFor());
  document.getElementById('go').onclick=()=>{R.phase='q';question()};
}
function question(){
  const Lv=C.nivele[R.li],Q=Lv.qs[R.qi];R.att=0;R.done=false;
  shell(`
    <div class="row" style="justify-content:space-between"><div class="eyebrow">${nivelEticheta(R.li)} · ${esc(Lv.t)}</div>
    <button class="btn ghost sm" id="peekb" type="button" aria-expanded="false">Recitește pagina</button></div>
    <div class="peek reading" id="peek" hidden>${Lv.text}</div>
    <div class="stack" style="margin-top:14px">
      <p class="q">${Q.q}</p>
      <div id="body"></div>
      <div id="fb" aria-live="polite"></div>
      <div class="row" id="nav"></div>
    </div>`,tabsFor());
  const pb=document.getElementById('peekb'),pk=document.getElementById('peek');
  pb.onclick=()=>{pk.hidden=!pk.hidden;pb.setAttribute('aria-expanded',String(!pk.hidden));pb.textContent=pk.hidden?'Recitește pagina':'Ascunde pagina'};
  const t=TIPURI[Q.t];
  if(!t){document.getElementById('body').innerHTML=`<p class="toast">Tip de întrebare necunoscut: ${esc(Q.t)}</p>`;return}
  t(Q,document.getElementById('body'),API);
}
function feedback(kind,html){document.getElementById('fb').innerHTML=`<div class="fb ${kind}">${html}</div>`}
function resolve(correct,msg){
  const Q=C.nivele[R.li].qs[R.qi];
  if(R.done)return;
  if(correct){
    let pts=R.att===0?10:4;
    if(R.att===0){R.first++;R.streak++;if(R.streak>=3)pts+=2}else R.streak=0;
    R.xp+=pts;R.done=true;
    feedback('ok',`<strong>Corect! +${pts} XP${R.att===0&&R.streak>=3?' (cu bonus de serie)':''}</strong><br>${Q.why}`);
    showNext();
  }else{R.att++;R.streak=0;feedback('bad',`<strong>Nu încă.</strong> ${msg||''}`)}
  setHud();
}
function giveUp(html){const Q=C.nivele[R.li].qs[R.qi];R.done=true;R.streak=0;feedback('bad',`<strong>Răspunsul corect:</strong> ${html}<br>${Q.why}`);showNext();setHud()}
function showNext(){
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

TIPURI.hunt=function(Q,body){
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
  const next=R.li+1<C.nivele.length;
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · terminat${next?` · ${C.nivele.length-R.li-1===1?'mai e un nivel':'mai sunt '+(C.nivele.length-R.li-1)+' niveluri'}`:' · ai terminat toate nivelurile'}</div>
    <div class="end-stars" style="margin:14px 0 6px" aria-label="${stars===1?'o stea':stars+' stele'} din 3">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div>
    <h2>${stars===3?'Perfect, toate din prima!':stars===2?'Foarte bine!':'Nivel trecut. Poți lua mai multe stele.'}</h2>
    <p class="lede">${R.first} din ${n} răspunsuri corecte din prima · ${R.xp} XP.${stars<3?' Recitește pagina și reia nivelul pentru 3 stele.':''}</p>
    <div class="row" style="margin-top:20px">
      ${next?'<button class="btn primary" id="nx" type="button">Nivelul următor →</button>':'<button class="btn primary" id="dp" type="button">Vezi diploma</button>'}
      <button class="btn" id="again" type="button">Reia nivelul</button>
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
      <p style="margin:0 auto 14px;max-width:46ch">a trecut toate cele ${C.nivele.length} niveluri ale jocului „${esc(C.titlu)}”: ${esc(D.rezumat)}.</p>
      <div class="facts"><span>★ ${t.st}/${C.nivele.length*3}</span><span>${t.xp} XP</span><span>${data}</span></div>
    </div>
    <h3 style="margin-top:28px">Provocarea din ${esc(D.aplicatie)}</h3>
    <p class="hint" style="margin:4px 0 10px">Arată-i profesorului diploma, apoi fă asta pe bune:</p>
    <ol class="check">${D.provocare.map(x=>`<li>${x}</li>`).join('')}</ol>
    <div class="row" style="margin-top:16px"><button class="btn" id="toc" type="button">Înapoi la cuprins</button><a class="btn ghost" href="../index.html">Toate jocurile</a></div>`);
  document.getElementById('toc').onclick=home;
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

/* ---------------- pornire ---------------- */
function porneste(config){
  C=config;
  ['cheie','titlu','clasa','unitate','unitateTitlu','competente','intro','nivele','diploma'].forEach(k=>{if(C[k]==null)throw new Error('JocMotor: lipsește „'+k+'” din configurație')});
  Object.entries(C.tipuri||{}).forEach(([k,v])=>{TIPURI[k]=v.render;if(v.rezolva)REZOLVA[k]=v.rezolva;if(v.gresit)GRESIT[k]=v.gresit});
  S=load();
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
  stare:()=>R?{li:R.li,qi:R.qi,phase:R.phase,done:R.done}:null,
  deblocheaza:()=>{C.nivele.forEach((_,i)=>S.lv[i]=S.lv[i]||{stars:1,xp:0});save()},
  rezolva:()=>{
    const Q=C.nivele[R.li].qs[R.qi],body=document.getElementById('body');
    if(!REZOLVA[Q.t])return false;
    REZOLVA[Q.t](Q,body,API);return true;
  },
  /* pune în pagină un răspuns GREȘIT tipic (doar simulatoarele care declară gresit); poarta verifică apoi că e respins */
  gresit:()=>{
    const Q=C.nivele[R.li].qs[R.qi],body=document.getElementById('body');
    if(!GRESIT[Q.t])return false;
    GRESIT[Q.t](Q,body,API);return true;
  }
};
window.JocMotor={porneste,test:testHooks,esc,expandRange};
})();
