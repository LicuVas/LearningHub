/* Simulatorul „fotografie” pentru lecțiile LearningHub — fișier comun (lectii/_sim/fotografie.js).
   PROPRIETAR: autorul lecției V · M1 · nr. 5 până la 27.09.2026 seara; de atunci autorul lecției V · M1 · nr. 6 (predat de dirijor).
   Copiat pe 27.09.2026 din lectii/v/m1-l04/index.html, DUPĂ lectii/v/m1-l04/_verificare/reparatii.md
   (cu reparațiile judecătorului: M1 „placa de bază pe o bucată liberă”, m10 „Mărește fotografia”).
   Lecția 4 rămâne deocamdată cu copia ei din pagină.
   27.09.2026 (lecția V/6, judecătorul): zone ROTUNDE (z.c), mărire aleasă de lecție (Q.marire),
   iar numele care încep cu o prescurtare („CD-ul”, „DVD-ul”) nu mai primesc literă mică („cD-ul”).
   Probat pe V/5 (LIVE) și V/6: test_joc TRECUT + atelierul cu atingeri; lecțiile fără z.c / Q.marire merg exact ca înainte.

   Folosire în pagină (după motor.js):
     <script src="../../_sim/fotografie.js"></script>
     JocMotor.porneste({ …, tipuri:{fotografie:SimFotografie} })
   Stilul (CSS) se pune singur în pagină, o singură dată; folosește jetoanele motorului (--line, --accent, --sel…).

   DOUĂ MODURI (aceeași fotografie reală, fără marcaje; coordonatele sunt în procente din lățimea/înălțimea ei):

   1) ETICHETE (ca în lecția 4): fiecare etichetă merge pe UN loc din fotografie.
      Q.img, Q.w, Q.h, Q.alt, Q.credit
      Q.tinte:[{id, et, test?}]      etichetele; `test` = numele testului (implicit „„et” stă pe <nume>”)
      Q.zone:[{id, r:[[x1,y1,x2,y2],…]}]   în ORDINEA priorității (piesele mici înaintea plăcii pe care stau)
      Q.nume:{id:'cum se cheamă locul'}      pentru mesajul „Acum stă pe …”
      Q.punct:{idTinta:[x,y]}         locul corect (pentru „Arată-mi răspunsul” și poartă)
      Q.gresit:{idTinta:[x,y]}        etichete puse greșit, ca un copil (poarta verifică respingerea)
      Q.pePlaca:[id…], Q.suport?      (lecția 4) mesaj special când eticheta suportului cade pe o piesă prinsă de el
      Q.nimic?                        mesajul când eticheta nu stă pe niciun loc din zone

   2) CATEGORII (nou, lecția 5): elevul alege o etichetă-GRUPĂ și atinge dispozitivele din fotografie;
      pe fiecare dispozitiv atins apare cercul cu numărul grupei. Eticheta aleasă rămâne aleasă (mai multe
      dispozitive pot fi din aceeași grupă). Un dispozitiv are o singură etichetă: atins din nou, o primește pe cea nouă.
      Q.categorii:[{id, et}]          grupele (butoanele de deasupra fotografiei, numerotate 1, 2, 3…)
      Q.obiecte:[{id, nume, unde?, cat, pl?, test?}]   dispozitivele de etichetat (câte un test fiecare); `cat` = grupa corectă;
                                      `pl:true` = nume la plural („Boxele … au”); `test` = alt text al testului
      Q.zone:[{id, r:[…]}]            ca mai sus; pot fi și zone care NU sunt de etichetat (vezi Q.alte)
      Q.alte:{idZona:'mesaj'}         ce spune pagina când elevul atinge o zonă care nu e în listă (unitatea centrală…)
      Q.punct:{idObiect:[x,y]}        unde se pune cercul la „Arată-mi răspunsul” / poartă
      Q.gresit:{idObiect:'idCategorieGreșită'}   greșelile tipice (poarta verifică respingerea)

   COMUNE ambelor moduri (27.09.2026, lecția V/6):
      Q.zone:[{id, c:[[cx,cy,r],…]}]  zone ROTUNDE (discuri, obiecte rotunde): cx, cy în procente din lățime/înălțime,
                                      r în procente din LĂȚIMEA imaginii (cercul e cerc pe imagine; se folosesc Q.w/Q.h).
                                      O zonă poate avea și r (dreptunghiuri), și c (cercuri); ordinea zonelor = prioritatea.
      Q.marire?                       cât de mult se mărește fotografia la „Mărește fotografia” (procente; implicit 190).
                                      Pentru fotografii cu multe lucruri mici (atelierul V/6: 280).

   Fidelitate: nu există „aplicație” de imitat; fidelitatea = zonele cad pe lucrurile reale din fotografie
   (verificate cu grila și suprapunerea din _proba/ a fiecărei lecții). */
(function(){
'use strict';
const CSS=`
.foto-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.foto-chips button{font:inherit;font-size:.9rem;padding:6px 11px;border-radius:999px;border:2px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer;text-align:left}
.foto-chips button.activ{border-color:var(--accent);background:var(--sel);font-weight:800}
.foto-chips button.pus::after{content:" ✓";color:var(--ok);font-weight:800}
.foto-scroll{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
.foto-wrap{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:6px;line-height:0;cursor:crosshair;touch-action:manipulation;max-width:620px}
.foto-scroll.mare .foto-wrap{width:190%;max-width:1100px}
.foto-zoom{margin-right:6px;vertical-align:middle}
.foto-wrap img{display:block;width:100%;height:auto;user-select:none;-webkit-user-select:none}
.foto-pin{position:absolute;pointer-events:none;line-height:1.15}
.foto-pin i{position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:50%;background:#E4002B;border:2px solid #fff;box-shadow:0 0 0 1px #000;color:#fff;font:800 .8rem/20px var(--fb,system-ui);text-align:center;font-style:normal}
.foto-chips .nr,.foto-teste .nr{display:inline-block;width:1.5em;height:1.5em;line-height:1.5em;border-radius:50%;background:#E4002B;color:#fff;font-weight:800;font-size:.78rem;text-align:center;margin-right:5px;vertical-align:.05em}
.foto-pin i.c1,.foto-chips .nr.c1{background:#1565C0}
.foto-pin i.c2,.foto-chips .nr.c2{background:#C62828}
.foto-pin i.c3,.foto-chips .nr.c3{background:#6A1B9A}
.foto-pin i.c4,.foto-chips .nr.c4{background:#2E7D32}
.foto-credit{font-size:.8rem;color:var(--ink2);margin:4px 0 0;line-height:1.35}
.foto-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.foto-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.foto-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.foto-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.foto-teste li.ok .s{color:var(--ok)}.foto-teste li.rau .s{color:var(--bad)}
.foto-teste li .m{display:block;font-size:.85rem;color:var(--bad)}
.foto-teste li .unde{color:var(--ink2)}
`;
function stil(){
  if(document.getElementById('sim-fotografie-css'))return;
  const s=document.createElement('style');s.id='sim-fotografie-css';s.textContent=CSS;document.head.appendChild(s);
}
/* cerc pe imagine: dy e trecut în procente din lățime (× h/w), ca raza să fie aceeași pe orizontală și pe verticală */
const inCerc=(Q,c,x,y)=>{const k=(Q.h||1)/(Q.w||1),dx=x-c[0],dy=(y-c[1])*k;return dx*dx+dy*dy<=c[2]*c[2]};
const zonaLa=(Q,x,y)=>{for(const z of Q.zone){if((z.r||[]).some(r=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3])||(z.c||[]).some(c=>inCerc(Q,c,x,y)))return z.id}return null};
/* prima literă mică, dar nu la prescurtări („CD-ul”, „DVD-ul”, „USB”) */
const mic=s=>s&&!/^[A-ZĂÂÎȘȚ]{2}/.test(s)?s[0].toLowerCase()+s.slice(1):s;
/* partea comună: fotografia, butonul de mărire, coordonatele atingerii în procente */
function fotografie(Q,api){
  return `<div class="foto-scroll"><div class="foto-wrap"><img src="img/${Q.img}" width="${Q.w}" height="${Q.h}" alt="${api.esc(Q.alt)}" draggable="false"><div class="foto-pins"></div></div></div>
      <p class="foto-credit"><button class="btn ghost sm foto-zoom" type="button" aria-pressed="false">Mărește fotografia</button> ${Q.credit}</p>`;
}
function leaga(body,onTap,Q){
  const wrap=body.querySelector('.foto-wrap'),img=wrap.querySelector('img'),sc=body.querySelector('.foto-scroll'),zb=body.querySelector('.foto-zoom');
  /* pe telefon, lucrurile mici sunt greu de nimerit: fotografia se mărește și se derulează în lateral.
     Q.marire (opțional) = cât se mărește; fără el, 190% (clasa .mare), exact ca înainte. */
  zb.onclick=()=>{const m=sc.classList.toggle('mare');
    if(Q&&Q.marire){wrap.style.width=m?Q.marire+'%':'';wrap.style.maxWidth=m?Math.round((Q.w||1000)*1.4)+'px':''}
    zb.textContent=m?'Micșorează fotografia':'Mărește fotografia';zb.setAttribute('aria-pressed',String(m))};
  wrap.addEventListener('click',e=>{
    const r=img.getBoundingClientRect();
    onTap(Math.round((e.clientX-r.left)/r.width*1000)/10,Math.round((e.clientY-r.top)/r.height*1000)/10);
  });
}

/* ---------- modul 1: ETICHETE (codul lecției 4, după reparații) ---------- */
function renderEtichete(Q,body,api){
  const T=Q.tinte,st={puse:{},activ:T[0].id},sup=Q.suport||'placa';
  body.innerHTML=`<div class="foto-chips" role="group" aria-label="Etichetele de pus pe fotografie">${T.map((t,n)=>`<button type="button" data-id="${t.id}"><span class="nr">${n+1}</span>${api.esc(t.et)}</button>`).join('')}</div>
      <p class="hint foto-acum" aria-live="polite" style="margin:0 0 6px"></p>
      ${fotografie(Q,api)}
      <div class="foto-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică etichetele”</span><ol>${T.map((t,n)=>`<li data-id="${t.id}"><span class="s">○</span><span><span class="nr">${n+1}</span>${t.test?api.esc(t.test):`„${api.esc(t.et)}” stă pe ${api.esc(Q.nume[t.id])}`}<span class="m"></span></span></li>`).join('')}</ol></div>`;
  function draw(){
    body.querySelectorAll('.foto-chips button').forEach(b=>{b.classList.toggle('activ',b.dataset.id===st.activ);b.classList.toggle('pus',!!st.puse[b.dataset.id])});
    const a=T.find(t=>t.id===st.activ);
    const na=a?T.indexOf(a)+1:0;
    body.querySelector('.foto-acum').innerHTML=a?`Acum pui eticheta <b>${na} · ${api.esc(a.et)}</b>: atinge locul ei pe fotografie. Pe fotografie apare cercul roșu cu numărul ${na}.`:'Toate etichetele sunt pe fotografie. Apasă „Verifică etichetele”. Ca să muți una, apasă-i numele, apoi atinge alt loc.';
    body.querySelector('.foto-pins').innerHTML=T.map((t,n)=>{if(!st.puse[t.id])return '';const [x,y]=st.puse[t.id];
      return `<span class="foto-pin" style="left:${x}%;top:${y}%" title="${api.esc(t.et)}"><i>${n+1}</i></span>`}).join('');
  }
  body.querySelectorAll('.foto-chips button').forEach(b=>b.onclick=()=>{if(api.done())return;st.activ=b.dataset.id;draw()});
  leaga(body,(x,y)=>{
    if(api.done())return;
    if(!st.activ){body.querySelector('.foto-acum').innerHTML='Întâi apasă numele unei etichete, de deasupra fotografiei.';return}
    st.puse[st.activ]=[x,y];
    const urm=T.find(t=>!st.puse[t.id]);st.activ=urm?urm.id:null;draw();
  },Q);
  function marcheaza(){
    let ok=0;
    T.forEach(t=>{const li=body.querySelector(`.foto-teste li[data-id="${t.id}"]`),p=st.puse[t.id],w=p?zonaLa(Q,p[0],p[1]):null,bun=w===t.id;
      li.classList.toggle('ok',bun);li.classList.toggle('rau',!bun);li.querySelector('.s').textContent=bun?'✓':'✗';
      li.querySelector('.m').textContent=bun?'':!p?'Încă n-ai pus-o pe fotografie.'
        :w&&t.id===sup&&(Q.pePlaca||[]).includes(w)?(Q.mesajSuport||`Acum stă pe ${Q.nume[w]}. Piesa aceea e prinsă de placa de bază, dar eticheta plăcii merge pe o bucată liberă a ei.`)
        :w?`Acum stă pe ${Q.nume[w]}.`:(Q.nimic||'Acum nu stă pe niciun loc din listă.');
      if(bun)ok++});
    return ok;
  }
  const nav=api.checkButton(()=>{
    const ok=marcheaza();
    if(ok===T.length){nav.innerHTML='';api.resolve(true)}
    else{api.resolve(false,`${ok} din ${T.length} teste trecute. Mută etichetele cu ✗: apasă-le numele, apoi atinge alt loc.`);
      api.revealButton(()=>{T.forEach(t=>st.puse[t.id]=Q.punct[t.id].slice());st.activ=null;draw();marcheaza();nav.innerHTML='';api.giveUp('fiecare etichetă stă acum la locul ei, în fotografie.')})}
  },'Verifică etichetele');
  body._foto={pune(p){T.forEach(t=>{if(p[t.id])st.puse[t.id]=p[t.id].slice()});st.activ=null;draw()}};
  draw();
}

/* ---------- modul 2: CATEGORII (lecția 5: intrare / ieșire / intrare-ieșire pe o fotografie reală) ---------- */
function renderCategorii(Q,body,api){
  const K=Q.categorii,O=Q.obiecte,st={puse:{},cat:K[0].id};
  const nrc=id=>K.findIndex(k=>k.id===id)+1,etc=id=>(K.find(k=>k.id===id)||{}).et||'',ob=id=>O.find(o=>o.id===id);
  body.innerHTML=`<div class="foto-chips" role="group" aria-label="Etichetele: grupele">${K.map((k,n)=>`<button type="button" data-cat="${k.id}" aria-pressed="false"><span class="nr c${n+1}">${n+1}</span>${api.esc(k.et)}</button>`).join('')}</div>
      <p class="hint foto-acum" aria-live="polite" style="margin:0 0 6px"></p>
      ${fotografie(Q,api)}
      <div class="foto-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică etichetele”</span><ol>${O.map(o=>`<li data-id="${o.id}"><span class="s">○</span><span>${o.test?api.esc(o.test):`${api.esc(o.nume)}${o.unde?` <span class="unde">(${api.esc(o.unde)})</span>`:''} ${o.pl?'au':'are'} eticheta potrivită`}<span class="m"></span></span></li>`).join('')}</ol></div>`;
  const acum=body.querySelector('.foto-acum');
  function draw(){
    body.querySelectorAll('.foto-chips button').forEach(b=>{const a=b.dataset.cat===st.cat;b.classList.toggle('activ',a);b.setAttribute('aria-pressed',String(a))});
    body.querySelector('.foto-pins').innerHTML=O.map(o=>{const p=st.puse[o.id];if(!p)return '';
      return `<span class="foto-pin" style="left:${p.x}%;top:${p.y}%" title="${api.esc(o.nume)}: ${api.esc(etc(p.cat))}"><i class="c${nrc(p.cat)}">${nrc(p.cat)}</i></span>`}).join('');
  }
  const ales=()=>`<b>${nrc(st.cat)} · ${api.esc(etc(st.cat))}</b>`;
  const mesajStart=()=>`Eticheta aleasă acum: ${ales()}. Atinge pe fotografie un dispozitiv din lista testelor. Pe el apare cercul cu numărul ${nrc(st.cat)}.`;
  body.querySelectorAll('.foto-chips button').forEach(b=>b.onclick=()=>{if(api.done())return;st.cat=b.dataset.cat;draw();acum.innerHTML=mesajStart()});
  leaga(body,(x,y)=>{
    if(api.done())return;
    const w=zonaLa(Q,x,y),o=w?ob(w):null;
    if(o){
      st.puse[o.id]={cat:st.cat,x,y};draw();
      const rest=O.filter(q=>!st.puse[q.id]).length;
      acum.innerHTML=`Ai pus ${ales()} pe: ${api.esc(mic(o.nume))}. `+(rest?`Mai ai ${rest===1?'un dispozitiv':rest+' dispozitive'} fără etichetă. Ca să schimbi o etichetă, alegi alta și atingi din nou dispozitivul.`:'Toate dispozitivele din listă au o etichetă. Apasă „Verifică etichetele”.');
    }else acum.innerHTML=w&&Q.alte&&Q.alte[w]?Q.alte[w]:'Acolo nu e niciun dispozitiv din lista testelor. Atinge chiar dispozitivul.';
  },Q);
  function marcheaza(){
    let ok=0;
    O.forEach(o=>{const li=body.querySelector(`.foto-teste li[data-id="${o.id}"]`),p=st.puse[o.id],bun=!!p&&p.cat===o.cat;
      li.classList.toggle('ok',bun);li.classList.toggle('rau',!bun);li.querySelector('.s').textContent=bun?'✓':'✗';
      li.querySelector('.m').textContent=bun?'':!p?'Încă n-are nicio etichetă.':`Acum are eticheta „${etc(p.cat)}”.`;
      if(bun)ok++});
    return ok;
  }
  const pune=cats=>{O.forEach(o=>{if(cats[o.id]){const p=Q.punct[o.id];st.puse[o.id]={cat:cats[o.id],x:p[0],y:p[1]}}});draw()};
  const corecte=()=>Object.fromEntries(O.map(o=>[o.id,o.cat]));
  const nav=api.checkButton(()=>{
    const ok=marcheaza();
    if(ok===O.length){nav.innerHTML='';acum.innerHTML='Toate testele au trecut: fiecare dispozitiv are eticheta potrivită.';api.resolve(true)}
    else{api.resolve(false,`${ok} din ${O.length} teste trecute. La cele cu ✗: alege eticheta potrivită, apoi atinge din nou dispozitivul.`);
      api.revealButton(()=>{pune(corecte());marcheaza();nav.innerHTML='';acum.innerHTML='Acum fiecare dispozitiv are eticheta potrivită. Uită-te la culori și la numere.';api.giveUp('fiecare dispozitiv are acum, în fotografie, eticheta grupei lui.')})}
  },'Verifică etichetele');
  body._foto={pune,corecte};
  draw();acum.innerHTML=mesajStart();
}

window.SimFotografie={
  render(Q,body,api){stil();return Q.categorii?renderCategorii(Q,body,api):renderEtichete(Q,body,api)},
  rezolva(Q,body){body._foto.pune(Q.categorii?body._foto.corecte():Q.punct)},
  gresit(Q,body){body._foto.pune(Q.categorii?Object.assign(body._foto.corecte(),Q.gresit):Object.assign({},Q.punct,Q.gresit))}
};
})();
