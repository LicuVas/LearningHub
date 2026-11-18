/* JUCĂRIA — o bibliotecă FALSĂ, mică, care respectă contractul din ../../api_biblioteca.md (16.11.2026, Etapa 0).
   NU e biblioteca și nu e fidelă: e dublura de test a oracolelor O4 (oracol_comportament), O5 (oracol_evenimente) și
   O9 (oracol_asistare). Cu ea arată fiecare oracol, în --autotest, că (a) o bibliotecă care respectă contractul scoate
   numărul JOS și (b) o greșeală plantată aici (o înlocuire de text, pe o copie temporară) îl URCĂ.
   Rândurile cu un comentariu „M:<nume>” sunt locurile în care autotestele plantează greșeli: nu le schimba fără să schimbi și
   tabelele MUTANTI din oracole. Faptele din Explorer (numele copiilor, ferestrele) sunt cele din
   ../../referinte/scenarii_real/*.json (rezultatele reale); restul aplicațiilor sunt doar schelete cu ținte. */
(function(){
'use strict';
const L={versiune:'jucarie-2026-11-16'};
const EV=[];window.__lhAplicatieEv=EV;
const INST={};
const clona=o=>JSON.parse(JSON.stringify(o===undefined?null:o));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const STIL_CSS=`
[data-lh-aplicatie]{position:relative;isolation:isolate;font:13px 'Segoe UI',system-ui,sans-serif;border:1px solid #bbb;background:#fff;color:#111;margin:6px;outline:none;min-height:260px}
[data-lh-aplicatie] button{font:inherit;min-height:28px;margin:1px;cursor:pointer}
.j-rand{display:flex;flex-wrap:wrap;gap:2px;padding:3px;border-bottom:1px solid #ddd;align-items:center}
.j-zona{min-height:150px;padding:6px;position:relative}
.j-it{display:block;width:100%;text-align:left;border:1px solid transparent;background:none;padding:4px}
.j-it[data-lh-selectat]{background:#cce4ff}
.j-on{font-weight:700}
.j-grila{display:grid;grid-template-columns:repeat(3,80px);gap:1px}
.j-grila>div{border:1px solid #ccc;min-height:24px;position:relative}
.j-grila>div[data-lh-selectat]{outline:2px solid #217346}
[data-lh-tinta="maner_umplere"]{position:absolute;right:-4px;bottom:-4px;width:8px;height:8px;background:#217346;cursor:crosshair}
.j-mn{position:absolute;z-index:3;background:#fff;border:1px solid #888;box-shadow:0 4px 10px rgba(0,0,0,.2);display:flex;flex-direction:column}
.j-dlg-fond{position:absolute;inset:0;z-index:4;background:rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center}
.j-dlg{background:#fff;border:1px solid #888;padding:8px;min-width:280px}
.j-dlg .j-bt{display:flex;flex-direction:column;gap:2px}
[data-lh-evidentiat]{outline:3px solid #e8a400 !important;outline-offset:1px}
[data-lh-indiciu]{position:absolute;z-index:5;max-width:240px;background:#fff8d6;border:1px solid #c9a227;border-radius:6px;padding:6px 8px;font-size:12px;box-shadow:0 3px 10px rgba(0,0,0,.2)}
.j-panza{width:300px;height:160px;border:1px solid #999;background:#fff}
`;
function stil(){if(document.getElementById('j-css'))return;const s=document.createElement('style');s.id='j-css';s.textContent=STIL_CSS;document.head.appendChild(s)}

/* ---------------- evenimentul standard (§4) ---------------- */
function emite(I,gest,actiune,tinta,inainte){
  if(I.app==='__niciuna__')return;   /*M:aplicatie-muta*/
  const d={aplicatie:I.app,actiune,gest,tinta:tinta||I.zonaTinta,inainte,dupa:clona(I.stare()),ts:Date.now()};   /*M:camp*/
  EV.push(d);if(EV.length>500)EV.shift();
  try{window.dispatchEvent(new CustomEvent('lh-aplicatie',{detail:d}))}catch(e){}
  return d;
}
L.asculta=fn=>{const h=e=>fn(e.detail);window.addEventListener('lh-aplicatie',h);return ()=>window.removeEventListener('lh-aplicatie',h)};

/* ---------------- gestul fizic -> numele lui din suprafete.json ---------------- */
const TASTE={Delete:'tasta_delete',Backspace:'tasta_backspace',Enter:'tasta_enter',Escape:'tasta_esc',Tab:'tasta_tab',   /*M:taste*/
  Home:'tasta_home_end',End:'tasta_home_end',PageUp:'tasta_pagina',PageDown:'tasta_pagina',Meta:'tasta_windows',OS:'tasta_windows'};
function gestTasta(e){
  const k=e.key,c=e.ctrlKey||(e.metaKey&&k!=='Meta');
  if(/^Arrow/.test(k))return e.altKey?'alt_sageti':'sageti';
  if(/^F\d{1,2}$/.test(k))return 'tasta_'+k.toLowerCase();
  if(c&&k.length===1)return (c?'ctrl_':'')+(e.shiftKey?'shift_':'')+k.toLowerCase();   /*M:ctrl*/
  if(k in TASTE)return TASTE[k];
  if(k.length===1&&!c&&!e.altKey)return 'tastare';
  return null;
}
function gestClic(t,e){
  if(e.shiftKey)return 'shift_clic';
  if(e.ctrlKey||e.metaKey)return 'ctrl_clic';
  if(!t)return 'clic';
  if(t==='fila:File'||t==='fila_file')return 'fila_file';
  const p=t.split(':')[0];
  return {fila:'clic_fila',panglica:'clic_comanda_panglica',mso:'clic_comanda_panglica',lansator:'lansator_grup',meniu_derulant:'meniu_derulant',
    acces_rapid:'acces_rapid',zoom:'zoom'}[p]||'clic';
}
/* ținta canonică (api_biblioteca.md §3): data-lh-tinta + „:” + data-lh-id; jucăria folosește ambele forme (Explorer scrie
   ținta întreagă în data-lh-tinta, Word și PowerPoint o despart), ca oracolele să fie probate pe amândouă */
const canon=e=>{const t=e.getAttribute('data-lh-tinta')||'',id=e.getAttribute('data-lh-id');return t.includes(':')||id==null||id===''?t:t+':'+id};
const tintaDin=(I,el)=>{const x=el&&el.closest&&el.closest('[data-lh-tinta]');return x&&I.root.contains(x)?canon(x):I.zonaTinta};

function leagaGesturi(I){
  const r=I.root;let jos=null,faraClic=0;
  r.addEventListener('pointerdown',e=>{if(!e.target.closest('input'))try{r.focus({preventScroll:true})}catch(x){}
    jos={x:e.clientX,y:e.clientY,t:tintaDin(I,e.target),sel:!!(e.target.closest('[data-lh-selectat]'))}});
  r.addEventListener('pointerup',e=>{const j=jos;jos=null;if(!j)return;
    if(Math.hypot(e.clientX-j.x,e.clientY-j.y)>6){faraClic=Date.now();const ina=clona(I.stare());
      const g=j.t==='maner_umplere'?'umplere_tragere':I.felTragere?I.felTragere():j.sel?'tragere':'selectie';
      if(I.trage)I.trage(g,j.t,tintaDin(I,document.elementFromPoint(e.clientX,e.clientY)));
      emite(I,g,g,j.t,ina)}});
  let ultim=null;
  r.addEventListener('click',e=>{if(Date.now()-faraClic<300)return;const t=tintaDin(I,e.target),ina=clona(I.stare());
    const g=gestClic(t,e);if(I.clic)I.clic(t,e,g);emite(I,g,I.ultimaActiune||'clic',t,ina);I.ultimaActiune=null;
    const acum=Date.now(),dublu=ultim&&acum-ultim.ts<500&&Math.hypot(e.clientX-ultim.x,e.clientY-ultim.y)<6&&e.detail!==3;
    if(dublu){const ina2=clona(I.stare());if(I.dublu)I.dublu(t,e);emite(I,'dublu_clic','deschidere',t,ina2);ultim=null}
    else ultim={ts:acum,x:e.clientX,y:e.clientY}});
  r.addEventListener('contextmenu',e=>{e.preventDefault();const t=tintaDin(I,e.target),ina=clona(I.stare());if(I.dreapta)I.dreapta(t,e);emite(I,'clic_dreapta','meniu_contextual',t,ina)});
  r.addEventListener('wheel',e=>{const ina=clona(I.stare());if(e.ctrlKey)e.preventDefault();emite(I,e.ctrlKey?'zoom':'rotita',e.ctrlKey?'zoom':'derulare',tintaDin(I,e.target),ina)},{passive:false});
  r.addEventListener('keydown',e=>{const g=gestTasta(e);if(!g)return;const ina=clona(I.stare());
    const inInput=!!e.target.closest('input');
    if(!inInput&&(e.ctrlKey||e.metaKey||e.altKey||/^F\d/.test(e.key)||e.key==='Tab'))e.preventDefault();
    if(I.tasta)I.tasta(e,g,inInput);
    emite(I,g,I.ultimaActiune||g,inInput?I.zonaTinta:(document.activeElement&&r.contains(document.activeElement)?tintaDin(I,document.activeElement):I.zonaTinta),ina);I.ultimaActiune=null});
}

/* ---------------- scheletul comun Office ---------------- */
function officeSus(app,titlu){
  return `<div class="j-rand"><button data-lh-tinta="acces_rapid:Undo" data-lh-id-mso="Undo">↶</button><button data-lh-tinta="acces_rapid:Save" data-lh-id-mso="FileSave">💾</button> ${esc(titlu)}</div>
  <div class="j-rand" role="tablist"><button data-lh-tinta="fila:File">File</button><button data-lh-tinta="fila:Home" class="j-on">Home</button><button data-lh-tinta="fila:Insert" data-lh-id-mso="TabInsert">Insert</button></div>
  <div class="j-rand"><button data-lh-tinta="panglica:Home/Clipboard/Paste" data-lh-id-mso="Paste">Paste</button><button data-lh-tinta="panglica:Home/Font/Bold" data-lh-id-mso="Bold"><b>B</b></button><button data-lh-tinta="panglica:Home/Font/Italic" data-lh-id-mso="Italic"><i>I</i></button>
  <button data-lh-tinta="meniu_derulant:Home/Font/Font Color" data-lh-id-mso="FontColorPicker">A ▾</button><button data-lh-tinta="lansator:Home/Font" aria-label="Font Settings">↘</button></div>`;
}
const stareJos=`<div class="j-rand"><button data-lh-tinta="zoom">100%</button></div>`;

/* ---------------- aplicațiile-jucărie ---------------- */
const APP={};
APP.word=(I,c)=>{
  I.M={paragrafe:(c&&c.paragrafe)||['Ana are mere.','Al doilea paragraf.'],aldin:false,sel:null};
  I.zonaTinta='document';
  /* text = LISTA paragrafelor (§5; 17.11.2026 — înainte un șir unit cu \n) */
  I.stare=()=>({text:I.M.paragrafe.slice(),paragrafe:I.M.paragrafe.slice(),formatare_pe_caractere:[{de_la:0,pana_la:I.M.paragrafe.join('\n').length,aldin:I.M.aldin}],selectie:I.M.sel});
  I.desen=()=>{I.root.innerHTML=officeSus('word','Document1 - Word')+`<div class="j-zona" data-lh-zona data-lh-tinta="document">${I.M.paragrafe.map((p,k)=>`<p data-lh-tinta="text" data-lh-id="${k+1}" ${I.M.sel===k+1?'data-lh-selectat':''}>${esc(p)}</p>`).join('')}</div>`+stareJos};
  I.clic=t=>{if(t==='mso:Bold'||t==='panglica:Home/Font/Bold'){I.M.aldin=!I.M.aldin;I.ultimaActiune='aldin'}};
  I.dublu=t=>{const m=/^text:(\d+)/.exec(t||'');if(m){I.M.sel=+m[1];I.desen()}};
  I.tasta=(e,g)=>{if(g==='tastare'){I.M.paragrafe[I.M.paragrafe.length-1]+=e.key;I.ultimaActiune='scriere';I.desen()}
    else if(g==='ctrl_b'){I.M.aldin=!I.M.aldin;I.ultimaActiune='aldin'}};
};
APP.excel=(I,c)=>{
  const cel={A1:'5',B1:'7',A2:'3'};Object.assign(cel,(c&&c.celule)||{});
  I.M={cel,act:'A1',ales:false};I.zonaTinta='grila';
  /* celule[A1].text = textul afișat în celulă (§5, regula „ecranul = starea”, verificată de O4) */
  I.stare=()=>({celule:Object.fromEntries(Object.entries(I.M.cel).map(([k,v])=>[k,{valoare:v,text:v}])),celula_activa:I.M.act});
  I.desen=()=>{const ids=['A1','B1','C1','A2','B2','C2','A3','B3','C3'];
    I.root.innerHTML=officeSus('excel','Book1 - Excel')+`<div class="j-zona" data-lh-zona data-lh-tinta="grila"><div class="j-grila">${ids.map(a=>`<div data-lh-tinta="celula:${a}" ${I.M.ales&&I.M.act===a?'data-lh-selectat':''}>${esc(I.M.cel[a]||'')}${I.M.act===a?'<span data-lh-tinta="maner_umplere" aria-hidden="true"></span>':''}</div>`).join('')}</div></div>`+stareJos};
  I.clic=t=>{const m=/^celula:(\w+)/.exec(t||'');if(m){I.M.act=m[1];I.M.ales=true;I.desen()}};
  I.tasta=(e,g)=>{if(g==='tastare'){I.M.cel[I.M.act]=(I.M.cel[I.M.act]||'')+e.key;I.ultimaActiune='scriere';I.desen()}};
};
APP.powerpoint=(I,c)=>{
  I.M={diap:[{titlu:'Titlul meu'},{titlu:'Al doilea'}],cur:1};I.zonaTinta='diapozitiv';
  I.stare=()=>({diapozitive:I.M.diap.map((d,k)=>({index:k+1,obiecte:[{tip:'titlu',text:d.titlu}]})),diapozitiv_curent:I.M.cur});
  I.desen=()=>{I.root.innerHTML=officeSus('powerpoint','Presentation1 - PowerPoint')+`<div class="j-rand">${I.M.diap.map((d,k)=>`<button data-lh-tinta="miniatura:${k+1}">${k+1}</button>`).join('')}</div>
    <div class="j-zona" data-lh-zona data-lh-tinta="diapozitiv"><div class="j-it" data-lh-tinta="forma" data-lh-id="${I.M.cur}/1" ${I.selObj?'data-lh-selectat':''}>${esc(I.M.diap[I.M.cur-1].titlu)}</div></div>`+stareJos};
  I.clic=t=>{const m=/^miniatura:(\d+)/.exec(t||'');if(m){I.M.cur=+m[1];I.desen()}else if(/^forma:/.test(t||'')){I.selObj=true;I.desen()}};
  I.dublu=t=>{if(/^forma:/.test(t||'')){I.selObj=true;I.desen()}};
  I.tasta=(e,g)=>{if(g==='tastare'){I.M.diap[I.M.cur-1].titlu+=e.key;I.ultimaActiune='scriere';I.desen()}};
};
APP.windows=(I,c)=>{
  I.M={start:false,ferestre:[{aplicatie:'setari',titlu:'Setări',stare:'normal'}],sel:null};I.zonaTinta='desktop';
  I.stare=()=>({ferestre:clona(I.M.ferestre),meniu_start_deschis:I.M.start});
  I.desen=()=>{I.root.innerHTML=`<div class="j-zona" data-lh-zona data-lh-tinta="desktop">
      <button class="j-it" data-lh-tinta="desktop:Coș de reciclare" ${I.M.sel==='cos'?'data-lh-selectat':''}>Coș de reciclare</button><button class="j-it" data-lh-tinta="desktop:Calculator">Calculator</button>
      <div style="border:1px solid #888;margin-top:6px"><div class="j-rand">Setări</div><div class="j-rand" role="tablist"><button data-lh-tinta="fila:Sistem">Sistem</button><button data-lh-tinta="fila:Bluetooth și dispozitive">Bluetooth și dispozitive</button></div>
      <div class="j-rand"><button data-lh-tinta="meniu_derulant:Mod de alimentare">Echilibrat ▾</button><button data-lh-tinta="lansator:Proprietăți">…</button></div></div>
      ${I.M.start?'<div class="j-mn" style="left:4px;bottom:40px"><button data-lh-tinta="start:Setări">Setări</button></div>':''}</div>
    <div class="j-rand"><button data-lh-tinta="bara_activitati:Start">⊞</button><button data-lh-tinta="bara_activitati:Setări">Setări</button></div>`};
  I.clic=t=>{if(t==='bara_activitati:Start'){I.M.start=!I.M.start;I.desen()}else if(t==='desktop:Coș de reciclare'){I.M.sel='cos';I.desen()}};
  I.tasta=(e,g)=>{if(g==='tasta_windows'){I.M.start=!I.M.start;I.desen()}};
};
APP.paint=(I,c)=>{
  I.M={unealta:'Creion',linii:0};I.zonaTinta='panza';
  I.stare=()=>({unealta:I.M.unealta,linii:I.M.linii});
  I.desen=()=>{I.root.innerHTML=`<div class="j-rand"><button data-lh-tinta="fila:File">Fișier</button><button data-lh-tinta="fila:Vizualizare">Vizualizare</button><button data-lh-tinta="acces_rapid:Anulare">↶</button></div>
    <div class="j-rand"><button data-lh-tinta="unealta:Selectare">Selectare</button><button data-lh-tinta="unealta:Creion">Creion</button><button data-lh-tinta="unealta:Radieră">Radieră</button><button data-lh-tinta="meniu_derulant:Forme">Forme ▾</button><button data-lh-tinta="lansator:Culori">…</button></div>
    <div class="j-zona"><canvas class="j-panza" data-lh-zona data-lh-tinta="panza" width="300" height="160"></canvas></div>`+stareJos};
  I.clic=t=>{const m=/^unealta:(.+)/.exec(t||'');if(m){I.M.unealta=m[1]}};
  I.trage=()=>{I.M.linii++};
  I.felTragere=()=>I.M.unealta==='Selectare'?'selectie':'tragere';
};

/* Explorer-jucărie: doar cât cer scenariile din ../../scenarii/explorer (faptele: ../../referinte/scenarii_real) */
const COL=new Intl.Collator('ro',{numeric:true,sensitivity:'base'});
const ext=n=>{const i=n.lastIndexOf('.');return i>0?n.slice(i+1):''};
const baza=n=>{const i=n.lastIndexOf('.');return i>0?n.slice(0,i):n};
APP.explorer=(I,c)=>{
  c=c||{};const set=c.setari||{};
  const F=new Map();const W=(c.folder||'Exercitii')+'/';
  const pune=(dir,arb,cont)=>{F.set(dir,{});(arb||[]).forEach(n=>F.set(dir+n,{continut:cont&&cont[n]}))};
  pune(W,c.arbore||['a.txt','b.txt','Sub/'],c.continut);
  if(c.sursa_lipirii)pune(c.sursa_lipirii.folder+'/',c.sursa_lipirii.arbore,c.sursa_lipirii.continut);
  I.M={F,W,cur:W,sel:null,clip:null,cos:[],mn:null,dlg:null,dialog:null,edit:null,ext:!!set.extensii_vizibile};
  I.zonaTinta='lista';
  const M=I.M,par=p=>{const q=p.replace(/\/$/,'');const i=q.lastIndexOf('/');return i<0?'':q.slice(0,i+1)},num=p=>{const q=p.replace(/\/$/,'');return q.slice(q.lastIndexOf('/')+1)};
  const copii=d=>{const k=[...M.F.keys()].filter(p=>p!==d&&par(p)===d);const f=k.filter(p=>p.endsWith('/')),x=k.filter(p=>!p.endsWith('/'));
    const cmp=(a,b)=>COL.compare(num(a),num(b));return f.sort(cmp).concat(x.sort(cmp))};
  const radacini=()=>[...M.F.keys()].filter(p=>par(p)==='');
  const liber=(d,n,folder)=>{const b=folder?n:baza(n),e=folder||!ext(n)?'':'.'+ext(n);let x=b+e,i=2;while(M.F.has(d+x+(folder?'/':'')))x=b+' ('+(i++)+')'+e;return x};
  const copie=(d,n,folder)=>{const b=folder?n:baza(n),e=folder||!ext(n)?'':'.'+ext(n);let x=b+' - Copie'+e,i=2;while(M.F.has(d+x+(folder?'/':'')))x=b+' - Copie ('+(i++)+')'+e;return x};   /*M:copie*/
  const afis=p=>{const n=num(p);return p.endsWith('/')||M.ext||!ext(n)?n:baza(n)};
  const dialog=(titlu,intrebare,butoane,fa)=>{M.dlg={titlu,intrebare,butoane,fa};M.dialog={titlu,intrebare,butoane,apasat:null}};
  I.stare=()=>({nume_fisiere:copii(M.W).map(p=>num(p)+(p.endsWith('/')?'/':'')),ordine_afisata:copii(M.W).map(p=>num(p)+(p.endsWith('/')?'/':'')),
    in_cos:M.cos.filter(e=>par(e.p)===M.W).map(e=>num(e.p)+(e.p.endsWith('/')?'/':'')),
    continut_fisiere:Object.fromEntries(copii(M.W).filter(p=>M.F.get(p).continut!==undefined).map(p=>[num(p),M.F.get(p).continut])),
    dialog:M.dialog?clona(M.dialog):null,cale_curenta:M.cur,selectie:M.sel?[num(M.sel)]:[]});
  I.desen=()=>{
    const lista=M.cur==='COS'?M.cos.map(e=>`<button class="j-it" data-lh-tinta="cos:${esc(num(e.p))}" ${M.sel==='cos:'+e.p?'data-lh-selectat':''}>${esc(afis(e.p))}</button>`).join('')
      :copii(M.cur).map(p=>M.edit===p?`<input class="j-ren" data-lh-tinta="lista:${esc(num(p))}" value="${esc(afis(p))}">`:`<button class="j-it" data-lh-tinta="lista:${esc(num(p))}" ${M.sel===p?'data-lh-selectat':''}>${esc(afis(p))}</button>`).join('');
    I.root.innerHTML=`<div class="j-rand">${esc(M.cur==='COS'?'Coș de reciclare':num(M.cur))} — Explorer</div>
      <div class="j-rand" role="tablist"><button data-lh-tinta="fila:${esc(M.cur==='COS'?'Coș de reciclare':num(M.cur))}">${esc(M.cur==='COS'?'Coș de reciclare':num(M.cur))}</button><button data-lh-tinta="nav:sus">↑</button></div>
      <div class="j-rand" role="toolbar"><button data-lh-tinta="bara_comenzi:Nou">Nou ▾</button><button data-lh-tinta="meniu_derulant:Sortare">Sortare ▾</button><button data-lh-tinta="bara_comenzi:Copiere">Copiere</button><button data-lh-tinta="bara_comenzi:Lipire">Lipire</button><button data-lh-tinta="bara_comenzi:Ștergere">Ștergere</button></div>
      <div style="display:flex"><div style="width:30%">${radacini().map(p=>`<button class="j-it" data-lh-tinta="arbore:${esc(num(p))}">${esc(num(p))}</button>`).join('')}</div>
      <div class="j-zona" data-lh-zona data-lh-tinta="lista" style="flex:1">${lista||'<i>Acest folder este gol.</i>'}</div></div>
      <div class="j-rand"><button data-lh-tinta="desktop:Coș de reciclare">Coș de reciclare</button></div>
      ${M.mn?`<div class="j-mn" style="left:60px;top:60px">${M.mn.map(x=>`<button data-lh-tinta="meniu:${esc(x)}">${esc(x)}</button>`).join('')}</div>`:''}
      ${M.dlg?`<div class="j-dlg-fond"><div class="j-dlg" role="dialog"><b>${esc(M.dlg.titlu)}</b><p data-lh-dialog-intrebare>${esc(M.dlg.intrebare)}</p><div class="j-bt">${M.dlg.butoane.map(b=>`<button data-lh-tinta="fereastra:${esc(b)}">${esc(b)}</button>`).join('')}</div></div></div>`:''}`;
    const inp=I.root.querySelector('.j-ren');if(inp){inp.focus();const v=inp.value,e=M.ext&&ext(v)?v.lastIndexOf('.'):v.length;inp.setSelectionRange(0,e)}
  };
  const lipeste=()=>{if(!M.clip||M.cur==='COS')return;const src=M.clip,n=num(src),d=M.cur;
    if(par(src)===d){const nn=copie(d,n,src.endsWith('/'));M.F.set(d+nn,Object.assign({},M.F.get(src)));M.sel=d+nn;return}
    if(M.F.has(d+n)){dialog('Înlocuire sau omitere fișiere','Destinația are deja un fișier cu numele „'+n+'”',
      ['Mai puține detalii','Înlocuire fișier de la destinație','Se omite acest fișier','Comparați informațiile pentru ambele fișiere'],
      b=>{if(b==='Înlocuire fișier de la destinație')M.F.set(d+n,Object.assign({},M.F.get(src)))});return}
    M.F.set(d+n,Object.assign({},M.F.get(src)))};
  const redenumeste=(p,v)=>{v=v.trim();if(!v)return;let nou=M.ext||!ext(num(p))?v:v+'.'+ext(num(p));if(nou===num(p))return;const d=par(p);
    const fa=x=>{const i=M.F.get(p);M.F.delete(p);M.F.set(d+x,i);M.sel=d+x};
    const pasul2=()=>{if(M.F.has(d+nou)){const pr=liber(d,nou,false);dialog('Redenumire fișier','Redenumiți "'+num(p)+'" ca "'+pr+'"?',['Da','Nu'],b=>{if(b==='Da')fa(pr)})}else fa(nou)};
    if(M.ext&&ext(nou)!==ext(num(p))){dialog('Redenumire','Dacă modificați extensia unui fișier, acesta poate deveni inutilizabil.\n\nSigur modificați extensia?',['Da','Nu'],b=>{if(b==='Da')pasul2()});return}
    pasul2()};
  const laCos=p=>{if(!p||!M.F.has(p))return;M.cos.push({p,i:M.F.get(p)});M.F.delete(p);M.sel=null};
  I.clic=t=>{t=t||'';const [k,...r]=t.split(':'),v=r.join(':');
    if(k==='fereastra'&&M.dlg){const d=M.dlg;M.dlg=null;M.dialog.apasat=v;d.fa(v);I.ultimaActiune='raspuns';I.desen();return}
    if(k==='lista'&&M.cur!=='COS'){M.sel=M.cur+v+(M.F.has(M.cur+v+'/')?'/':'');M.mn=null;I.ultimaActiune='selectare';I.desen();return}
    if(k==='arbore'){M.cur=v+'/';M.sel=null;I.ultimaActiune='navigare';I.desen();return}
    if(t==='nav:sus'){M.cur=par(M.cur)||M.cur;I.ultimaActiune='navigare';I.desen();return}
    if(k==='cos'){const e=M.cos.find(x=>num(x.p)===v);M.sel=e?'cos:'+e.p:null;I.desen();return}
    if(t==='bara_comenzi:Nou'){M.mn=['Folder'];I.desen();return}
    if(t==='meniu:Folder'){M.mn=null;const n=liber(M.cur,'Folder nou',true);M.F.set(M.cur+n+'/',{});M.edit=M.cur+n+'/';M.sel=M.edit;I.ultimaActiune='folder_nou';I.desen();return}
    if(t==='meniu:Restaurare'){M.mn=null;const p=String(M.sel||'').replace(/^cos:/,''),k2=M.cos.findIndex(e=>e.p===p);if(k2>=0){const e=M.cos.splice(k2,1)[0];M.F.set(e.p,e.i)}I.ultimaActiune='restaurare';I.desen();return}
    if(t==='bara_comenzi:Copiere'&&M.sel){M.clip=M.sel;return}
    if(t==='bara_comenzi:Lipire'){lipeste();I.desen();return}
    if(t==='bara_comenzi:Ștergere'){laCos(M.sel);I.desen()}
  };
  I.dublu=t=>{t=t||'';if(t==='desktop:Coș de reciclare'){M.cur='COS';M.sel=null;I.desen();return}
    const m=/^(lista|arbore):(.+)$/.exec(t);if(m&&M.F.has((m[1]==='arbore'?'':M.cur)+m[2]+'/')){M.cur=(m[1]==='arbore'?'':M.cur)+m[2]+'/';M.sel=null;I.desen()}};
  I.dreapta=t=>{t=t||'';if(t.startsWith('cos:')){const e=M.cos.find(x=>num(x.p)===t.slice(4));M.sel=e?'cos:'+e.p:null;M.mn=['Restaurare','Ștergere'];I.desen()}
    else if(t.startsWith('lista:')){M.mn=['Deschidere','Copiere','Redenumire'];I.desen()}};
  I.tasta=(e,g,inInput)=>{
    if(inInput){if(e.key==='Enter'){e.preventDefault();const inp=e.target,p=M.edit;M.edit=null;if(p)redenumeste(p,inp.value);I.ultimaActiune='redenumire';I.desen()}
      else if(e.key==='Escape'){M.edit=null;I.desen()}return}
    if(g==='ctrl_c'&&M.sel){M.clip=M.sel;I.ultimaActiune='copiere'}
    else if(g==='ctrl_v'){lipeste();I.ultimaActiune='lipire';I.desen()}
    else if(g==='tasta_delete'&&e.shiftKey&&M.sel){const p=M.sel;dialog('Ștergere fișier','Sigur ștergeți definitiv acest fișier?',['Da','Nu'],b=>{if(b==='Da'){M.F.delete(p);M.sel=null}});I.desen()}
    else if(g==='tasta_delete'&&M.sel){laCos(M.sel);I.ultimaActiune='stergere';I.desen()}
    else if(g==='tasta_f2'&&M.sel&&!String(M.sel).startsWith('cos:')){M.edit=M.sel;I.desen()}
  };
};

/* ---------------- deschide / element / stare (§2, §5) ---------------- */
L.gata=Promise.resolve(true);
L.deschide=(nume,opt)=>{
  opt=opt||{};stil();
  if(!APP[nume])return Promise.reject(new Error('aplicație necunoscută: '+nume));
  const loc=opt.loc||document.querySelector('[data-lh-aplicatie-loc]')||document.body.appendChild(document.createElement('div'));
  if(INST[nume])L.inchide(nume);
  const root=document.createElement('div');root.setAttribute('data-lh-aplicatie',nume);root.setAttribute('data-lh-profil',opt.profil||nume+'-implicit');
  root.setAttribute('data-lh-versiune',L.versiune);root.tabIndex=-1;loc.appendChild(root);
  const I={app:nume,root};APP[nume](I,opt.continut);
  /* redesenarea înlocuiește elementul care avea focusul: focusul rămâne în aplicație (altfel tastele ar pleca în pagină) */
  const d0=I.desen;I.desen=()=>{const f=root.contains(document.activeElement);d0();if(f&&!root.contains(document.activeElement))root.focus({preventScroll:true})};
  I.desen();leagaGesturi(I);INST[nume]=I;
  if(opt.focus)try{root.focus({preventScroll:true})}catch(e){}
  I.api={aplicatie:nume,radacina:root,stare:()=>clona(I.stare()),element:t=>L.element(nume,t),inchide:()=>L.inchide(nume)};
  /* §1/§6.3: deschide(nume, {asistent}) pornește asistentul prin funcția PUBLICĂ (window.LH.aplicatii.asistent), nu printr-o
     referință internă — O9 (cazul F) înfășoară obiectul public ca să vadă ce a cerut lecția */
  if(opt.asistent){const P=(window.LH&&window.LH.aplicatii)||window.LHAplicatii||L;I.asist=P.asistent(nume,opt.asistent)}
  return Promise.resolve(I.api);
};
L.inchide=nume=>{const I=INST[nume];if(!I)return;if(I.asist)try{I.asist.opreste()}catch(e){}I.root.remove();delete INST[nume]};
L.element=(nume,t)=>{
  const I=INST[nume];if(!I||!t)return null;
  const v=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0};
  if(t.startsWith('mso:'))return [...I.root.querySelectorAll('[data-lh-id-mso="'+CSS.escape(t.slice(4))+'"]')].find(v)||null;
  return [...I.root.querySelectorAll('[data-lh-tinta]')].find(e=>canon(e)===t&&v(e))||null;
};
L.stare=nume=>{const I=INST[nume];return I?clona(I.stare()):null};
const DEMO={paint:{selectie:{pregatire:['unealta:Selectare']},tragere:{pregatire:['unealta:Creion']}},
  word:{tragere:{pregatire:[{gest:'dublu_clic',tinta:'text:1'}]}}};
L.demonstratie=(nume,gest)=>(DEMO[nume]||{})[gest]||null;
L.tinte=nume=>{const I=INST[nume];return I?[...I.root.querySelectorAll('[data-lh-tinta]')].map(canon):[]};
/* §1 (reparația 8): registrul rădăcinilor create de bibliotecă; O1 acceptă un [data-lh-aplicatie] doar dacă e aici */
L.radacini=()=>Object.keys(INST).map(n=>INST[n].root).filter(r=>r&&r.isConnected);

/* ---------------- asistarea (§6) ---------------- */
const aplicatiaDe=t=>Object.keys(INST).find(n=>L.element(n,t))||null;
L.ascunde=()=>{document.querySelectorAll('[data-lh-indiciu]').forEach(x=>x.remove());document.querySelectorAll('[data-lh-evidentiat]').forEach(x=>x.removeAttribute('data-lh-evidentiat'))};
L.evidentiaza=(t,o)=>{const n=(o&&o.aplicatie)||aplicatiaDe(t),e=n&&L.element(n,t);if(!e)return null;
  e.setAttribute('data-lh-evidentiat','');   /*M:evid*/
  try{e.scrollIntoView({block:'nearest',inline:'nearest'})}catch(x){}
  return e;/*M:evid-sfarsit*/};
L.indiciu=(t,text,o)=>{const n=(o&&o.aplicatie)||aplicatiaDe(t),e=n&&L.element(n,t);if(!e)return null;
  document.querySelectorAll('[data-lh-indiciu]').forEach(x=>x.remove());
  const R=INST[n].root.getBoundingClientRect(),r=e.getBoundingClientRect(),b=document.createElement('div');
  b.setAttribute('data-lh-indiciu','');b.setAttribute('data-lh-pentru',t);b.setAttribute('role','status');b.textContent=text;
  b.style.left=Math.max(0,r.left-R.left)+'px';b.style.top=`${r.bottom-R.top+6}px`;   /*M:loc*/
  INST[n].root.appendChild(b);return b};
const NEGRESELI=new Set(['rotita','sageti','tasta_home_end','tasta_pagina']);
L.asistent=(nume,cfg)=>{
  let k=0,gres=0,timer=0;const pas=()=>cfg.pasi[k];
  const arata=()=>{const p=pas();if(!p)return;L.evidentiaza(p.tinta,{aplicatie:nume});L.indiciu(p.tinta,p.indiciu||'Aici',{aplicatie:nume})};
  const porneste=()=>{clearTimeout(timer);if(!pas())return;timer=setTimeout(arata,(cfg.dupaSecunde||30)*1000)};   /*M:timp*/
  const off=L.asculta(ev=>{const p=pas();if(!p||ev.aplicatie!==nume)return;
    const el=L.element(nume,p.tinta),canon=el&&el.getAttribute('data-lh-tinta');   /* aliasul mso:Bold -> ținta canonică */
    const bun=p.asteapta?p.asteapta(ev):(ev.tinta===p.tinta||(!!canon&&ev.tinta===canon));
    if(bun){L.ascunde();k++;gres=0;porneste();return}   /*M:progres*/
    if(NEGRESELI.has(ev.gest))return;
    gres++;if(gres>=(cfg.dupaGreseli||2))arata()});   /*M:greseli*/
  const lp=()=>porneste();window.addEventListener('lh-pas',lp);
  porneste();
  return {opreste(){off();clearTimeout(timer);window.removeEventListener('lh-pas',lp);L.ascunde()},pas:()=>k};
};

window.LH=window.LH||{};window.LH.aplicatii=L;window.LHAplicatii=L;
})();
