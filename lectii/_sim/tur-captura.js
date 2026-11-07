/* tur-captura.js — PREZENTAREA PE ZONE peste o captură REALĂ (07.11.2026).
   Cererea lui: „ca un powerpoint în care căsuțele sunt prezentate și ilustrate pe rând… pan and zoom peste imagine…
   click pe filele panglicii să se vadă cum se schimbă butoanele și grupurile”.
   Contract: C:\00\AI_0\SECRETARY_V3\docs\contracte\2026-11-07_prezentare_zone_excel\contract.md

   FOLOSIRE (fără cod nou; o a doua lecție aduce doar JSON-ul și imaginile ei):
     <div class="tur-captura" data-tur="../m1-l02/img/tur.json" data-mod="zone">       (sau data-mod="panglica")
       <figure class="captura">…imaginea statică…</figure>      ← rămâne dacă datele nu se încarcă și la tipărire
     </div>
   Componenta pornește singură (MutationObserver) oriunde apare elementul, și în textul refăcut de motor.
   LISTA ZONELOR (opțional, modul zone): un <ol data-tc-zone> pus CHIAR înaintea elementului; al k-lea <li> = zona k.
   Cuvintele <mark> (galbene) din el devin butoane care fac exact ce face butonul k de sub imagine (cererea lui, 07.11).
   Un nume de zonă care NU e termen nou (deci fără <mark>) se leagă cu <span data-tc-leg>: e galben doar cât merge prezentarea.
   Fără prezentare (date lipsă, tipar), lista rămâne text simplu.

   DATELE (JSON; dreptunghiurile [x,y,l,h] în pixelii capturii, MĂSURATE în Excel prin UI Automation, nu din ochi):
     baza:{src,w,h,alt}                         captura întreagă (căile, relative la JSON)
     ansamblu:{titlu,text}                      „toată fereastra” (pasul 0)
     zone:[{id,nr,r,titlu,en,text,detaliu?,focus?,nr_la?}]  pașii, în ordine. detaliu = al doilea chenar, punctat; focus = unde
                                                se uită camera, când zona e prea lată ca să se vadă mărită întreagă (bara de
                                                formule, bara de stare); nr_la = [x,y] unde stă cercul cu numărul.
                                                Zona cu id:"panglica" e SPECIALĂ: doar la ea se pot apăsa filele (imagine + rând
                                                de butoane), iar textul spune ce filă e deschisă.
     final:"…"                                  rândul de după ultimul pas (unde e „Încearcă tu”)
     panglica:{r,vedere,activa,nota,
       file:[{id,en,ro,r,src|null,plin?,grupuri:[{en,ro,r}]}]   src = banda panglicii pe fila aceea (mărimea lui r) sau,
                                                            cu plin:true, fereastra întreagă (panglica filei e mai înaltă/joasă)
       fisier:{id,en,ro,r,src,inapoi,text}}               fila File: ecranul ei peste toată fereastra + săgeata de ieșire
     grupuri[].strans = grupul e strâns într-un singur buton (numele e pe buton, nu jos)
     texte:{…}                                  înlocuiește propozițiile scrise în cod (cheile: vezi T_IMPLICIT mai jos),
                                                de exemplu pentru o aplicație fără nume de grup scrise jos
   MODURI: „zone” = pașii 0..N peste fereastră (filele panglicii se pot apăsa, fără grupuri: grupul se predă la pasul
   panglicii); „panglica” = doar panglica (vedere), grupurile filei deschise încadrate și prezentate pe rând.
   CLIC ÎN IMAGINE (la fel în ambele moduri): pe o zonă / un grup, sau pe cercul lui cu număr = îl vezi de aproape; încă
   un clic pe cel ales = înapoi la tot. Filele panglicii stau deasupra zonei panglicii. O tragere nu e clic.
   STAREA pentru probe: element.tcStare + atributele data-* de pe .tc (pas, fila, fisier, grup, scara). */
(function(){
'use strict';
if(window.TurCaptura)return;
const ROSU='#E4002B';   // roșul chenarelor din ghid (IV.1 §5)
/* PLAFONUL DE MĂRIRE: până la 3 px de ecran pe pixel de captură, dar cel puțin 2× față de vederea întreagă (videoproiector).
   Pe calculator ≈ 6,7×, pe telefon ≈ 13× (contract, decizia 07.11, după judecător: 2 px/px lăsa caseta de nume la 35%). */
const CLAR=3;
const T_IMPLICIT={toataFereastra:'Toată fereastra',toataPanglica:'Toată panglica',inapoi:'◀ Înapoi',inainte:'Înainte ▶',
  grupAnterior:'◀ Grupul anterior',grupUrmator:'Grupul următor ▶',iesiFisier:'Ieși din File',
  numeJos:'Numele fiecărui grup e scris jos, sub butoanele lui.',numeJosStrans:'Un grup strâns într-un singur buton are numele pe buton ({lista}).',
  grupStrans:'Grupul e strâns într-un singur buton: numele lui e pe buton, nu jos.',
  apasaGrup:'Apasă pe un grup (sau pe „Grupul următor”) ca să-l vezi de aproape; apasă pe altă filă ca să vezi cum se schimbă grupurile.',
  tragePanglica:'Trage de imagine spre stânga ca să vezi restul panglicii.',acumFila:'Acum e deschisă fila {fila}.',
  eroareFila:'Captura filei nu s-a încărcat; arăt fila de pornire.'};
const CSS=`
.tur-captura.tc-pornit>.captura{display:none}
.tc{margin:.4em 0 1em;max-width:100%}
.tc-cadru{position:relative;overflow:hidden;border:1px solid var(--line,#CFD9D2);border-radius:6px;background:#fff;touch-action:pan-y;cursor:grab;
  user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;box-shadow:var(--shadow,none)}
.tc-cadru.tc-marit{touch-action:none}
.tc-cadru.tc-trage{cursor:grabbing}
.tc-cadru:focus-visible{outline:3px solid var(--accent,#107C41);outline-offset:2px}
.tc-scena{position:absolute;left:0;top:0;transform-origin:0 0}
.tc-scena.tc-anim{transition:transform .55s cubic-bezier(.2,.7,.2,1)}
.tc-scena img{position:absolute;left:0;top:0;display:block;max-width:none;max-height:none;border:0;border-radius:0;box-shadow:none;pointer-events:none;-webkit-user-drag:none}
.tc-svg{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.tc-masca{fill:rgba(12,18,14,.55);fill-rule:evenodd}
.tc-rama{fill:none;stroke:${ROSU};stroke-width:calc(3px * var(--inv,1))}
.tc-rama.slab{stroke-width:calc(2px * var(--inv,1))}
.tc-rama.punct{stroke-dasharray:calc(6px * var(--inv,1)) calc(4px * var(--inv,1))}
.tc-halou{fill:none;stroke:#fff;stroke-width:calc(5px * var(--inv,1));opacity:.85}   /* grosimea în px de ECRAN: vector-effect nu vede scale() din CSS */
.tc-nr{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:${ROSU};color:#fff;font:700 15px/26px "Figtree","Segoe UI",system-ui,sans-serif;
  text-align:center;transform:scale(var(--inv,1));box-shadow:0 0 0 2px #fff;pointer-events:none}
.tc[data-ingust] .tc-nr{width:20px;height:20px;margin:-10px 0 0 -10px;font-size:12px;line-height:20px}
.tc-nr.tc-nr-hot{pointer-events:auto;cursor:pointer}
.tc-nr.tc-nr-hot::before{content:"";position:absolute;inset:-8px;border-radius:50%}   /* ținta degetului: 36-42 px de ecran */
.tc-nr.tc-nr-hot:hover{box-shadow:0 0 0 2px #fff,0 0 0 4px ${ROSU}}
.tc-hot{position:absolute;padding:0;margin:0;border:0;background:transparent;cursor:pointer;border-radius:3px;min-width:0;min-height:0}
.tc-hot:hover{background:rgba(228,0,43,.10);box-shadow:inset 0 0 0 2px rgba(228,0,43,.75)}
.tc-hot.tc-hot-acum:hover{background:transparent;box-shadow:none}   /* zona aleasă are deja chenarul; umbrită ar acoperi tot cadrul */
.tc-leg{cursor:pointer;border-radius:3px}
span.tc-leg{background:var(--mark,#FFE38A);color:var(--markInk,#15201A);padding:0 .15em}
.tc-leg:hover,.tc-leg:focus-visible{outline:2px solid ${ROSU};outline-offset:1px}
.tc-leg[aria-current="step"]{box-shadow:0 0 0 2px ${ROSU}}
.tc-bara{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}
.tc-bara .tc-gol{flex:1 1 0;min-width:0}
.tc button.tc-b{min-height:36px;min-width:36px;padding:4px 10px;border:1px solid var(--line,#CFD9D2);border-radius:8px;background:var(--paper,#fff);color:var(--ink,#15201A);
  font:600 .92rem "Figtree","Segoe UI",system-ui,sans-serif;cursor:pointer;line-height:1.1}
.tc button.tc-b:hover:not(:disabled){border-color:var(--accent,#107C41)}
.tc button.tc-b[aria-current="step"],.tc button.tc-b[aria-pressed="true"]{background:var(--accent,#107C41);color:var(--accentInk,#fff);border-color:var(--accent,#107C41)}
.tc button.tc-b:disabled{opacity:.45;cursor:default}
.tc .tc-pasi{display:flex;flex-wrap:wrap;gap:4px}
.tc .tc-unelte{display:flex;gap:4px;margin-left:auto}
.tc .tc-inapoi{order:1}.tc .tc-pasi{order:2}.tc .tc-inainte{order:3}.tc .tc-gol{order:4}.tc .tc-unelte{order:5}
.tc[data-ingust] .tc-inapoi,.tc[data-ingust] .tc-inainte{flex:1 1 40%}
.tc[data-ingust] .tc-gol{display:none}
.tc[data-ingust][data-mod="zone"] .tc-pasi{order:4;flex-basis:100%}
.tc[data-ingust][data-mod="panglica"] .tc-pasi{order:4}
.tc-file{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center}
.tc-file .tc-et{font-size:.85rem;color:var(--ink2,#546358);margin-right:2px}
.tc-file[hidden]{display:none}
.tc-text{margin-top:8px;padding:9px 12px;border-left:4px solid ${ROSU};background:var(--paper2,#EEF3EF);border-radius:0 6px 6px 0;line-height:1.5;color:var(--ink,#15201A)}
.tc-text p{margin:.15em 0}
.tc-text .tc-cap{font-weight:700}
.tc-text .tc-sub{color:var(--ink2,#546358);font-size:.9rem}
.tc:fullscreen{background:var(--paper,#fff);padding:12px;display:flex;flex-direction:column;overflow:auto;box-sizing:border-box}
.tc:fullscreen .tc-cadru{flex:1 1 auto;aspect-ratio:auto!important;height:auto!important;min-height:0}
.tc:fullscreen .tc-text{font-size:1.15rem}
@media (prefers-reduced-motion:reduce){.tc-scena.tc-anim{transition:none}}
@media print{.tur-captura.tc-pornit>.captura{display:block}.tur-captura .tc{display:none}.tc-leg{box-shadow:none!important;outline:none!important}span.tc-leg{background:none;color:inherit;padding:0}}
`;
function css(){if(document.getElementById('tc-css'))return;const s=document.createElement('style');s.id='tc-css';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R4=a=>({x:a[0],y:a[1],w:a[2],h:a[3]});
const nume=o=>o.ro&&o.ro!==o.en?`${esc(o.ro)} (${esc(o.en)})`:esc(o.en||o.ro||'');
const redus=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const cache={};
function date(url){return cache[url]||(cache[url]=fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
  .catch(e=>{delete cache[url];throw e}))}   // o cădere de rețea nu rămâne ținută minte: la pasul următor se reîncearcă

function monteaza(el){
  if(el.dataset.tcGata)return;el.dataset.tcGata='1';
  let url;try{url=new URL(el.dataset.tur,document.baseURI).href}catch(e){el.dataset.tcEroare='adresă';return}
  date(url).then(D=>{try{construieste(el,D,url)}catch(e){el.dataset.tcEroare=String(e&&e.message||e);el.classList.remove('tc-pornit');const t=el.querySelector('.tc');if(t)t.remove();if(el.tcDezleaga)el.tcDezleaga()}})
    .catch(e=>{el.dataset.tcEroare=String(e&&e.message||e)});   // rămâne figura statică
}

function construieste(el,D,url){
  css();
  const rel=s=>s?new URL(s,url).href:null;
  const B=D.baza,PG=D.panglica||null,Z=D.zone||[],T=Object.assign({},T_IMPLICIT,D.texte||{});
  const mod=el.dataset.mod==='panglica'&&PG?'panglica':'zone';
  const lumeMod=mod==='panglica'&&PG.vedere?R4(PG.vedere):{x:0,y:0,w:B.w,h:B.h};
  const lumeTot={x:0,y:0,w:B.w,h:B.h};
  const st={mod,pas:0,fila:PG?PG.activa:null,fisier:false,grup:null,cam:{s:1,tx:0,ty:0},fit:1,tinta:null};
  const lume=()=>st.fisier?lumeTot:lumeMod;
  const fila=()=>PG&&PG.file.find(f=>f.id===st.fila);
  const grupuri=()=>{const f=fila();return f&&f.grupuri||[]};
  const legate=[];   // cuvintele galbene din lista zonelor, legate de pași (vezi LISTA ZONELOR, sus)

  /* ---------- DOM ---------- */
  const tc=document.createElement('div');tc.className='tc';tc.dataset.mod=mod;
  const eticheta=mod==='panglica'?'Panglica Excel, captură reală: apasă pe file și pe grupuri':(B.alt||'Captură');
  tc.innerHTML=`
   <div class="tc-cadru" tabindex="0" role="group" aria-roledescription="prezentare" aria-label="${esc(eticheta)}">
     <div class="tc-scena">
       <img class="tc-baza" src="${esc(rel(B.src))}" width="${B.w}" height="${B.h}" alt="${esc(B.alt||'')}" draggable="false" decoding="async">
       <img class="tc-banda" alt="" hidden draggable="false" decoding="async">
       <img class="tc-fis" alt="" hidden draggable="false" decoding="async">
       <svg class="tc-svg" width="${B.w}" height="${B.h}" viewBox="0 0 ${B.w} ${B.h}" aria-hidden="true"><path class="tc-masca" d=""/><g class="tc-rame"></g></svg>
       <div class="tc-puncte"></div>
     </div>
   </div>
   <div class="tc-file" role="toolbar" aria-label="Filele panglicii" hidden></div>
   <div class="tc-bara">
     <button type="button" class="tc-b tc-inapoi">◀ Înapoi</button>
     <div class="tc-pasi"></div>
     <button type="button" class="tc-b tc-inainte">Înainte ▶</button>
     <span class="tc-gol"></span>
     <span class="tc-unelte">
       <button type="button" class="tc-b tc-zm" aria-label="Micșorează imaginea" title="Micșorează imaginea">−</button>
       <button type="button" class="tc-b tc-zp" aria-label="Mărește imaginea" title="Mărește imaginea">+</button>
       <button type="button" class="tc-b tc-z0" aria-label="Potrivește imaginea în cadru" title="Potrivește imaginea în cadru">⤢</button>
       <button type="button" class="tc-b tc-fs" aria-label="Pe tot ecranul" title="Pe tot ecranul">⛶</button>
     </span>
   </div>
   <div class="tc-text" aria-live="polite"></div>`;
  el.appendChild(tc);el.classList.add('tc-pornit');
  const $=s=>tc.querySelector(s);
  const cadru=$('.tc-cadru'),scena=$('.tc-scena'),banda=$('.tc-banda'),fis=$('.tc-fis'),masca=$('.tc-masca'),rame=$('.tc-rame'),
        puncte=$('.tc-puncte'),rand=$('.tc-file'),pasi=$('.tc-pasi'),txt=$('.tc-text'),bIn=$('.tc-inapoi'),bUrm=$('.tc-inainte');
  scena.style.width=B.w+'px';scena.style.height=B.h+'px';
  $('.tc-baza').addEventListener('error',()=>{el.dataset.tcEroare='imaginea de bază';el.classList.remove('tc-pornit');tc.remove();dezleaga()});
  const fsOk=!!(document.fullscreenEnabled&&tc.requestFullscreen);if(!fsOk)$('.tc-fs').hidden=true;

  /* rândul filelor (pe telefon, numele din captură sunt prea mici de apăsat) */
  if(PG){
    const toate=(PG.fisier?[PG.fisier]:[]).concat(PG.file);
    rand.innerHTML=`<span class="tc-et">Filele:</span>`+toate.map(f=>`<button type="button" class="tc-b" data-fila="${esc(f.id)}" title="${nume(f).replace(/<[^>]+>/g,'')}">${esc(f.en)}</button>`).join('');
    rand.addEventListener('click',e=>{const b=e.target.closest('button[data-fila]');if(!b)return;alegeFila(b.dataset.fila)});
    const pre=()=>{toate.forEach(f=>{if(f.src){const i=new Image();i.decoding='async';i.src=rel(f.src)}})};
    if(window.IntersectionObserver){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect();pre()}},{rootMargin:'200px'});io.observe(tc)}
    else setTimeout(pre,1500);
  }

  /* ---------- camera (pan & zoom) ---------- */
  const V=()=>({w:cadru.clientWidth||1,h:cadru.clientHeight||1});
  function potrivire(){const v=V(),L=lume();return Math.min(v.w/L.w,v.h/L.h)}
  const smax=()=>Math.max(st.fit*2,CLAR);
  const sus0=()=>mod==='panglica'&&!st.fisier;   // modul panglica: banda stă sus, dedesubt se vede (estompat) restul ferestrei
  function limiteaza(c){
    const v=V(),L=lume();st.fit=potrivire();
    c.s=Math.max(st.fit,Math.min(smax(),c.s));
    const lw=L.w*c.s,lh=L.h*c.s;
    c.tx=lw<=v.w+0.5?(v.w-lw)/2-L.x*c.s:Math.min(-L.x*c.s,Math.max(v.w-(L.x+L.w)*c.s,c.tx));
    c.ty=lh<=v.h+0.5?(sus0()?-L.y*c.s:(v.h-lh)/2-L.y*c.s):Math.min(-L.y*c.s,Math.max(v.h-(L.y+L.h)*c.s,c.ty));
    return c;
  }
  function aplica(c,anim){
    st.cam=limiteaza(c);
    scena.classList.toggle('tc-anim',!!anim&&!redus());
    scena.style.transform=`translate(${st.cam.tx}px,${st.cam.ty}px) scale(${st.cam.s})`;
    scena.style.setProperty('--inv',String(1/st.cam.s));
    cadru.classList.toggle('tc-marit',st.cam.s>st.fit*1.01);
    tc.dataset.scara=(st.cam.s/st.fit).toFixed(2);
    pozNumere();pozTinte();stare();
  }
  function tintaPe(r,pad){   // centrează dreptunghiul r, cât de mare încape (cu margine), până la plafonul de claritate
    const v=V();pad=pad||1.3;st.fit=potrivire();
    const s=Math.max(st.fit,Math.min(smax(),v.w/(r.w*pad),v.h/(r.h*pad)));
    return {s,tx:v.w/2-(r.x+r.w/2)*s,ty:v.h/2-(r.y+r.h/2)*s};
  }
  function tintaToata(){st.fit=potrivire();const v=V(),L=lume(),s=Math.max(st.fit,sus0()&&tc.dataset.ingust?v.h/L.h:0);return {s,tx:-L.x*s,ty:-L.y*s}}
  function laTinta(anim){aplica(st.tinta?tintaPe(st.tinta,st.tintaPad):tintaToata(),anim)}
  function zoomLa(f,px,py){
    const c=st.cam,s2=Math.max(st.fit,Math.min(smax(),c.s*f));
    const wx=(px-c.tx)/c.s,wy=(py-c.ty)/c.s;
    aplica({s:s2,tx:px-wx*s2,ty:py-wy*s2},false);
  }
  const centru=()=>{const v=V(),c=st.cam,z=mod==='zone'&&!st.fisier&&Z[st.pas-1],t=z&&z.detaliu?R4(z.detaliu):st.tinta;
    if(t){const x=(t.x+t.w/2)*c.s+c.tx,y=(t.y+t.h/2)*c.s+c.ty;if(x>=0&&x<=v.w&&y>=0&&y<=v.h)return [x,y]}
    return [v.w/2,v.h/2]};
  function zoomPas(f){   // la un pas (sau la un grup ales), „+” / „−” măresc și țin SUBIECTUL în mijloc: chenarul punctat, focusul, zona
    const z=mod==='zone'&&!st.fisier&&Z[st.pas-1],t=z&&z.detaliu?R4(z.detaliu):(st.fisier?null:st.tinta);
    if(!t){zoomLa(f,...centru());return}
    const v=V(),s2=Math.max(st.fit,Math.min(smax(),st.cam.s*f));
    aplica({s:s2,tx:v.w/2-(t.x+t.w/2)*s2,ty:v.h/2-(t.y+t.h/2)*s2},false);
  }
  $('.tc-zp').onclick=()=>zoomPas(1.4);
  $('.tc-zm').onclick=()=>zoomPas(1/1.4);
  $('.tc-z0').onclick=()=>aplica(tintaToata(),true);
  $('.tc-fs').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else tc.requestFullscreen().catch(()=>{})};
  document.addEventListener('fullscreenchange',()=>{if(!tc.isConnected)return;const pe=document.fullscreenElement===tc;
    $('.tc-fs').setAttribute('aria-label',pe?'Ieși din tot ecranul':'Pe tot ecranul');$('.tc-fs').title=pe?'Ieși din tot ecranul':'Pe tot ecranul';
    cadru.classList.toggle('tc-marit',pe||st.cam.s>st.fit*1.01);requestAnimationFrame(()=>laTinta(false))});

  /* tragere cu mouse-ul / degetul, ciupire cu două degete, Ctrl + rotiță */
  const pts=new Map();let st0=null,mutat=false,taieClic=0;
  cadru.addEventListener('pointerdown',e=>{
    if(e.button!==0&&e.pointerType==='mouse')return;
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const p=[...pts.values()];
    st0={cam:{...st.cam},p:p.map(q=>({...q})),d:p.length>1?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0};
    if(pts.size>1){mutat=true;try{p.length&&cadru.setPointerCapture(e.pointerId)}catch(_){}}
  });
  cadru.addEventListener('pointermove',e=>{
    if(!pts.has(e.pointerId)||!st0)return;
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const p=[...pts.values()],r=cadru.getBoundingClientRect();
    if(p.length===1&&st0.p.length===1){
      const dx=p[0].x-st0.p[0].x,dy=p[0].y-st0.p[0].y;
      if(!mutat&&Math.hypot(dx,dy)>6){mutat=true;try{cadru.setPointerCapture(e.pointerId)}catch(_){};cadru.classList.add('tc-trage')}
      if(mutat)aplica({s:st0.cam.s,tx:st0.cam.tx+dx,ty:st0.cam.ty+dy},false);
    }else if(p.length===2&&st0.d){
      const d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),cx=(p[0].x+p[1].x)/2-r.left,cy=(p[0].y+p[1].y)/2-r.top;
      const c=st0.cam,s2=Math.max(st.fit,Math.min(smax(),c.s*d/st0.d));
      const ox=(st0.p[0].x+st0.p[1].x)/2-r.left,oy=(st0.p[0].y+st0.p[1].y)/2-r.top,wx=(ox-c.tx)/c.s,wy=(oy-c.ty)/c.s;
      aplica({s:s2,tx:cx-wx*s2,ty:cy-wy*s2},false);
      if(e.cancelable)e.preventDefault();
    }
  });
  const sus=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);cadru.classList.remove('tc-trage');
    if(mutat)taieClic=Date.now();
    if(pts.size===0){mutat=false;st0=null}else{const p=[...pts.values()];st0={cam:{...st.cam},p:p.map(q=>({...q})),d:0}}};
  cadru.addEventListener('pointerup',sus);cadru.addEventListener('pointercancel',sus);
  cadru.addEventListener('click',e=>{if(Date.now()-taieClic<350){e.stopPropagation();e.preventDefault()}},true);   // o tragere nu e și clic
  cadru.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();const r=cadru.getBoundingClientRect();
    zoomLa(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top)},{passive:false});   // rotița simplă derulează pagina
  tc.addEventListener('keydown',e=>{
    if(e.target.closest('input,textarea,select'))return;
    const k=e.key;let ok=true;
    if(k==='ArrowRight'||k==='PageDown')urmator();
    else if(k==='ArrowLeft'||k==='PageUp')anterior();
    else if(k==='Home')mergi(0);
    else if(k==='+'||k==='=')zoomPas(1.4);
    else if(k==='-')zoomPas(1/1.4);
    else if(k==='0')aplica(tintaToata(),true);
    else if(k==='Escape'&&st.fisier)inchideFisier();
    else ok=false;
    if(ok){e.preventDefault();e.stopPropagation()}
  });
  if(window.ResizeObserver){let lat=0;const ro=new ResizeObserver(()=>{if(!tc.isConnected){ro.disconnect();return}const w=cadru.clientWidth;if(w!==lat){lat=w;forma()}laTinta(false)});ro.observe(cadru)}

  /* ---------- desen: chenare, mască, numere, zonele apăsabile ---------- */
  const NS='http://www.w3.org/2000/svg';
  function dreptunghi(r,cls){const e=document.createElementNS(NS,'rect');e.setAttribute('x',r.x);e.setAttribute('y',r.y);e.setAttribute('width',r.w);e.setAttribute('height',r.h);e.setAttribute('rx',3);e.setAttribute('class',cls);return e}
  function rama(r,cls){rame.appendChild(dreptunghi(r,'tc-halou'));rame.appendChild(dreptunghi(r,'tc-rama '+(cls||'')))}
  function gaura(r){if(!r){masca.setAttribute('d','');return}
    const p=4;masca.setAttribute('d',`M0 0H${B.w}V${B.h}H0Z M${r.x-p} ${r.y-p}V${r.y+r.h+p}H${r.x+r.w+p}V${r.y-p}Z`)}
  function numar(n,r,la,fn,eticheta){const s=document.createElement('span');s.className='tc-nr';s.textContent=n;s.dataset.ax=la?la[0]:r.x+r.w;s.dataset.ay=la?la[1]:r.y+r.h/2;
    if(fn){s.classList.add('tc-nr-hot');s.title=eticheta||'';s.onclick=e=>{e.stopPropagation();fn()}}
    puncte.appendChild(s);pozNumere()}
  function pozNumere(){   // centrul cercului = mijlocul laturii din dreapta a chenarului, mutat înăuntru cât să nu iasă din imagine
    const s=st.cam.s||1,ing=!!tc.dataset.ingust;   // cercul apăsabil: înăuntru cât îi încape toată ținta (36 / 42 px)
    puncte.querySelectorAll('.tc-nr').forEach(e=>{const k=(e.classList.contains('tc-nr-hot')?(ing?18:21):(ing?11:14))/s;
      const x=Math.min(+e.dataset.ax,B.w-k),y=Math.min(Math.max(+e.dataset.ay,k),B.h-k);e.style.left=x+'px';e.style.top=y+'px'})}
  function buton(r,eticheta,fn,cls,min){const b=document.createElement('button');b.type='button';b.className='tc-hot '+(cls||'');b.tabIndex=-1;b.setAttribute('aria-hidden','true');
    b.title=eticheta;Object.assign(b.dataset,{x:r.x,y:r.y,w:r.w,h:r.h,min:min||''});b.onclick=e=>{e.stopPropagation();fn()};puncte.appendChild(b);pozTinte();return b}
  function pozTinte(){   // „h” = cel puțin 32 px de ecran pe înălțime (filele: pe lățime s-ar călca între ele); „hw” = pe ambele
    const m=32/(st.cam.s||1);
    puncte.querySelectorAll('.tc-hot').forEach(b=>{let x=+b.dataset.x,y=+b.dataset.y,w=+b.dataset.w,h=+b.dataset.h;const k=b.dataset.min;
      if(k&&h<m){y-=(m-h)/2;h=m}if(k==='hw'&&w<m){x-=(m-w)/2;w=m}
      Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'})})}

  const filePermise=()=>PG&&(mod==='panglica'||(Z[st.pas-1]&&Z[st.pas-1].id==='panglica'));
  function asteapta(img,src){   // true = imaginea e gata; altfel desenul se reia la încărcare, iar la eroare revine fila de pornire
    if(img.getAttribute('src')!==src){img.src=src}
    if(img.complete&&img.naturalWidth>0)return true;
    img.onload=()=>{img.onload=img.onerror=null;if(tc.isConnected)actualizeaza(false)};
    img.onerror=()=>{img.onload=img.onerror=null;st.eroare=T.eroareFila;st.fisier=false;st.fila=PG.activa;st.grup=null;st.tinta=null;if(tc.isConnected)actualizeaza(false)};
    return false;
  }
  function deseneaza(){
    rame.textContent='';puncte.textContent='';gaura(null);
    const f=fila();let gata=true;st.incarca=false;
    banda.hidden=st.fisier||!f||!f.src;
    if(!banda.hidden){const r=f.plin?{x:0,y:0,w:B.w,h:B.h}:R4(PG.r);gata=asteapta(banda,rel(f.src));st.incarca=!gata;Object.assign(banda.style,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'})}
    fis.hidden=!st.fisier;
    if(st.fisier){fis.style.width=B.w+'px';fis.style.height=B.h+'px';
      if(asteapta(fis,rel(PG.fisier.src))&&PG.fisier.inapoi){const r=R4(PG.fisier.inapoi);rama(r,'slab');buton(r,'Înapoi (ieși din fila File)',inchideFisier,'','hw')}
      return}
    if(mod==='zone')Z.forEach((z,i)=>{const acum=st.pas===i+1;   // ca grupurile din modul panglica: clic = de aproape; pe cea aleasă = toată fereastra
      buton(R4(z.r),acum?T.toataFereastra:`${z.nr}. ${z.titlu}`,()=>mergi(acum?0:i+1),'tc-hot-zona'+(acum?' tc-hot-acum':''))});
    if(filePermise()){   // filele panglicii, apăsabile în imagine (în modul zone: doar la pasul panglicii)
      PG.file.forEach(x=>buton(R4(x.r),nume(x).replace(/<[^>]+>/g,''),()=>alegeFila(x.id),'tc-hot-fila','h'));
      if(PG.fisier&&PG.fisier.r)buton(R4(PG.fisier.r),'Fișier (File)',deschideFisier,'tc-hot-fila','h');
    }
    if(mod==='zone'){
      if(st.pas===0)Z.forEach((z,i)=>{const r=R4(z.r);rama(r,'slab');numar(z.nr,r,z.nr_la,()=>mergi(i+1),`${z.nr}. ${z.titlu}`)});
      else{const z=Z[st.pas-1],r=R4(z.r);gaura(r);rama(r);numar(z.nr,r,z.nr_la,()=>mergi(0),T.toataFereastra);if(z.detaliu)rama(R4(z.detaliu),'punct')}
    }else{
      if(!gata)return;   // chenarele grupurilor doar peste banda lor (nu peste fila de dinainte, cât se încarcă)
      const G=grupuri();
      G.forEach((g,i)=>{const r=R4(g.r);if(st.grup===null||st.grup===i)rama(r,st.grup===i?'':'slab');
        buton(r,'Grupul '+nume(g).replace(/<[^>]+>/g,''),()=>alegeGrup(st.grup===i?null:i),'tc-hot-grup')});
      if(st.grup!==null&&G[st.grup]){const r=R4(G[st.grup].r);gaura(r);numar(st.grup+1,r)}
      else gaura(lumeMod);   // „Toată panglica”: restul ferestrei, estompat
    }
  }

  /* ---------- textul de sub imagine și butoanele de mers ---------- */
  function scrie(){
    const f=fila();let h='';
    if(st.fisier){const F=PG.fisier;h=`<p class="tc-cap">${nume(F)}</p><p>${F.text||''}</p>`}
    else if(st.eroare)h=`<p class="tc-sub">${esc(st.eroare)}</p>`;
    else if(st.incarca&&f)h=`<p class="tc-sub">Se încarcă fila ${nume(f)}…</p>`;
    else if(mod==='zone'){
      if(st.pas===0)h=`<p class="tc-cap">${esc((D.ansamblu||{}).titlu||T.toataFereastra)}</p><p>${(D.ansamblu||{}).text||''}</p>`;
      else{const z=Z[st.pas-1];h=`<p class="tc-cap">${z.nr} din ${Z.length} · ${esc(z.titlu)}${z.en?` (${esc(z.en)})`:''}</p><p>${z.text||''}</p>`;
        if(z.id==='panglica'&&f)h+=`<p class="tc-sub">${esc(T.acumFila).replace('{fila}',nume(f))}</p>`;
        if(st.pas===Z.length&&D.final)h+=`<p class="tc-sub">${D.final}</p>`}
    }else{
      const G=grupuri();
      const S=G.filter(g=>g.strans);
      if(st.grup===null)h=`<p class="tc-cap">Fila ${nume(f)}</p><p>Butoanele ei sunt strânse în ${G.length} grupuri: ${G.map(g=>nume(g)).join(', ')}. ${esc(T.numeJos)}`+
        `${S.length?' '+esc(T.numeJosStrans).replace('{lista}',S.map(g=>esc(g.en)).join(', ')):''}</p>`+
        `<p class="tc-sub">${esc(T.apasaGrup)}${tc.dataset.ingust?' '+esc(T.tragePanglica):''}${PG.nota?' '+PG.nota:''}</p>`;
      else{const g=G[st.grup];h=`<p class="tc-cap">Grupul ${nume(g)} · ${st.grup+1} din ${G.length}</p><p>Pe fila ${nume(f)}. ${esc(g.strans?T.grupStrans:T.numeJos.replace('fiecărui grup','grupului'))}</p>`}
    }
    txt.innerHTML=h;
    // butoanele de mers
    if(mod==='zone'){
      pasi.innerHTML=`<button type="button" class="tc-b" data-pas="0"${st.pas===0?' aria-current="step"':''}>${esc(T.toataFereastra)}</button>`+
        Z.map((z,i)=>`<button type="button" class="tc-b" data-pas="${i+1}" aria-label="${esc(z.nr+'. '+z.titlu)}" title="${esc(z.titlu)}"${st.pas===i+1?' aria-current="step"':''}>${z.nr}</button>`).join('');
      bIn.disabled=st.pas===0&&!st.fisier;bUrm.disabled=st.pas===Z.length&&!st.fisier;
      bIn.textContent=T.inapoi;bUrm.textContent=T.inainte;
    }else{
      const G=grupuri();
      pasi.innerHTML=`<button type="button" class="tc-b" data-pas="0"${st.grup===null?' aria-current="step"':''}>${esc(T.toataPanglica)}</button>`;
      bIn.disabled=st.grup===null&&!st.fisier;bUrm.disabled=(st.grup===G.length-1||!G.length)&&!st.fisier;
      bIn.textContent=T.grupAnterior;bUrm.textContent=T.grupUrmator;
    }
    if(st.fisier){bIn.textContent='◀ '+T.iesiFisier;bUrm.textContent=T.iesiFisier+' ▶'}
    cadru.setAttribute('aria-label',`${eticheta}${f&&!st.fisier?' — fila '+(f.ro||f.en)+' deschisă':''}${st.fisier?' — ecranul filei File':''}`);
    // rândul filelor: la pasul panglicii (modul zone) sau mereu (modul panglica)
    const zArat=filePermise()||st.fisier;
    rand.hidden=!PG||!zArat;
    legate.forEach(m=>{if(+m.dataset.tcPas===st.pas&&!st.fisier)m.setAttribute('aria-current','step');else m.removeAttribute('aria-current')});
    rand.querySelectorAll('button[data-fila]').forEach(b=>b.setAttribute('aria-pressed',String(st.fisier?b.dataset.fila===PG.fisier.id:(!st.fisier&&b.dataset.fila===st.fila))));
  }
  pasi.addEventListener('click',e=>{const b=e.target.closest('button[data-pas]');if(!b)return;mergi(+b.dataset.pas)});
  bIn.onclick=anterior;bUrm.onclick=urmator;

  /* ---------- acțiuni ---------- */
  // modul panglica: cadrul are forma benzii (vederea); cu fila File deschisă, forma ferestrei întregi
  function forma(){const L=lume(),w=cadru.clientWidth||600;
    if(w<560)tc.dataset.ingust='1';else delete tc.dataset.ingust;
    const MINH=tc.dataset.ingust?160:200;
    if(sus0()&&w*L.h/L.w<MINH){cadru.style.aspectRatio='auto';cadru.style.height=MINH+'px'}
    else{cadru.style.height='';cadru.style.aspectRatio=`${L.w} / ${L.h}`}}
  const tintaZ=z=>R4(z.focus||z.r);   // focus = unde se uită camera, dacă nu e chiar chenarul (bara de stare: capătul cu zoom-ul)
  function actualizeaza(anim){forma();deseneaza();scrie();laTinta(anim)}
  function mergi(n){
    if(st.fisier)st.fisier=false;
    st.eroare=null;
    if(mod==='zone'){st.pas=Math.max(0,Math.min(Z.length,n));st.tinta=st.pas?tintaZ(Z[st.pas-1]):null;st.tintaPad=1.3;
      if(PG&&!filePermise())st.fila=PG.activa}
    else{st.grup=n>0?Math.min(grupuri().length,n)-1:null;st.tinta=st.grup===null?null:R4(grupuri()[st.grup].r);st.tintaPad=1.25}
    actualizeaza(true);
  }
  function urmator(){if(st.fisier){inchideFisier();return}if(mod==='zone')mergi(st.pas+1);else mergi((st.grup===null?0:st.grup+1)+1)}
  function anterior(){if(st.fisier){inchideFisier();return}if(mod==='zone')mergi(st.pas-1);else mergi(st.grup===null?0:st.grup)}
  function alegeGrup(i){mergi(i===null?0:i+1)}
  function alegeFila(id){
    if(PG.fisier&&id===PG.fisier.id){deschideFisier();return}
    const era=st.fisier;st.fisier=false;st.fila=id;st.eroare=null;
    if(mod==='panglica'){st.grup=null;st.tinta=null}
    actualizeaza(era||mod==='panglica');
  }
  function deschideFisier(){if(!PG||!PG.fisier)return;st.fisier=true;st.tinta=null;actualizeaza(false)}
  function inchideFisier(){st.fisier=false;st.tinta=mod==='zone'&&st.pas?tintaZ(Z[st.pas-1]):null;actualizeaza(false)}
  function stare(){
    tc.dataset.pas=String(st.pas);tc.dataset.fila=st.fila||'';tc.dataset.fisier=st.fisier?'1':'';tc.dataset.grup=st.grup===null?'':String(st.grup);
    el.tcStare={mod,pas:st.pas,fila:st.fila,fisier:st.fisier,grup:st.grup,cam:{...st.cam},fit:st.fit,cadru:V(),
      banda:banda.hidden?null:banda.getAttribute('src'),lume:lume()};
  }
  function spre(n){   // la fel ca butonul n de sub imagine; dacă imaginea nu se vede (telefon), pagina se mută la ea
    mergi(n);const r=cadru.getBoundingClientRect();
    if(r.top<0||r.bottom>(window.innerHeight||document.documentElement.clientHeight))tc.scrollIntoView({block:'nearest',behavior:redus()?'auto':'smooth'})}
  const lista=mod==='zone'&&el.previousElementSibling&&el.previousElementSibling.matches('ol[data-tc-zone]')?el.previousElementSibling:null;
  if(lista){
    [...lista.children].filter(x=>x.tagName==='LI').forEach((li,i)=>{if(!Z[i])return;
      li.querySelectorAll('mark,[data-tc-leg]').forEach(m=>{m.classList.add('tc-leg');m.setAttribute('role','button');m.tabIndex=0;
        m.title=`Arată în imagine: ${Z[i].nr}. ${Z[i].titlu}`;m.dataset.tcPas=String(i+1);legate.push(m)})});
    lista.addEventListener('click',clicLista);lista.addEventListener('keydown',tastaLista);
  }
  function clicLista(e){const m=e.target.closest&&e.target.closest('.tc-leg');if(m)spre(+m.dataset.tcPas)}
  function tastaLista(e){const m=e.target.closest&&e.target.closest('.tc-leg');if(!m||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();spre(+m.dataset.tcPas)}
  function dezleaga(){   // prezentarea a căzut: lista redevine text simplu
    legate.forEach(m=>{m.classList.remove('tc-leg');m.removeAttribute('role');m.removeAttribute('tabindex');m.removeAttribute('title');m.removeAttribute('aria-current');delete m.dataset.tcPas});
    legate.length=0;if(lista){lista.removeEventListener('click',clicLista);lista.removeEventListener('keydown',tastaLista)}}
  el.tcDezleaga=dezleaga;
  actualizeaza(false);
  el.dispatchEvent(new CustomEvent('tc:gata',{bubbles:true}));
}

function cauta(rad){(rad||document).querySelectorAll('.tur-captura[data-tur]:not([data-tc-gata])').forEach(monteaza)}
function porneste(){cauta();try{new MutationObserver(()=>cauta()).observe(document.body,{childList:true,subtree:true})}catch(e){}}
window.TurCaptura={cauta,versiune:'2026-11-07b'};
if(document.body)porneste();else document.addEventListener('DOMContentLoaded',porneste);
})();
