/* Extensia „paint-selectie” pentru simulatorul Paint din lecții (lectii/_sim/paint-selectie.js).
   PROPRIETAR: autorul lecției V · M3 · nr. 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”), 24.10.2026.
   Se încarcă DUPĂ paint.js (al lecției V/18, pe care NU îl modifică) și îl extinde prin API-ul lui (PaintSim.creeaza):
     <script src="../../_sim/paint.js"></script><script src="../../_sim/paint-selectie.js"></script>
     JocMotor.porneste({ …, tipuri:{paintw:SimPaintSel} })
   Lecțiile 20-22 o folosesc așa: const SimX=PaintSelectie.creeaza([extensiaTa]); tipuri:{paintw:SimX}. Extensia ta primește
   aceleași cârlige ca la PaintSim.creeaza (unelte, verifica, op, actiune, panou); a mea rulează ÎNTÂI.

   CE ADAUGĂ (peste paint.js): grupul Selecție (buton de scindare: Dreptunghi, Formă liberă, Selectați tot, Ștergere), meniul
   Editare (Decupare, Copiere, Lipire), tastele Ctrl+A / Ctrl+C / Ctrl+X / Ctrl+V / Delete / Esc, mutarea selecției prin tragere,
   Pensule (buton de scindare cu tipurile), Radieră, Forme (galeria), cursorul Dimensiune din stânga pânzei (Creion, Pensule,
   Radieră), mărimea selecției în bara de stare, desenul pânzei cu alb (radiera, ștergerea), forme și bucăți lipite.

   FIDELITATE (Paint 11.2605 din Windows 11, în română; Paint NU a fost pornit — aplicație din Magazin):
   DIN CAPTURI REALE (jocuri/grafica-v/img, Paint RO, 20.09.2026):
     · meniul instrumentului Selectare: Dreptunghi · Formă liberă · Selectați tot (Ctrl+A) · Inversare selecție · Selecție
       transparentă · Ștergere (del) — selectie-meniu.webp; selecția = chenar punctat cu mânere — selectie-soare.webp;
     · după Ctrl+C și Ctrl+V, copia trasă în alt loc, originalul rămas; bucata lipită e OPACĂ (acoperă ce e sub ea) — copiere-lipire.webp;
     · bara: Creion, Umplere, Text / Radieră, Selector de culoare, Lupă; Pensule (cu ⌄); galeria Forme (ordinea de mai jos);
       Contur formă / Umplere formă — instrumente-bara.webp, pipeta-stil.webp.
   DIN UI AUTOMATION pe Paint-ul real (judecătorul V/8, lectii/v/m2-l08/_verificare/paint_ascuns2.json): grupul „Selecție” cu
     butonul de scindare „Selectare”; „Pensule” = buton de scindare; cursoarele „Dimensiune” și „Opacitate”; în grupul Imagine,
     butonul „Decupare” (AutomationId CropButton) = TĂIEREA MARGINILOR imaginii (lecția 20), alt lucru decât Decupare = Ctrl+X.
   DIN DOCUMENTAȚIA MICROSOFT (Windows Insider Blog): 13.03.2024 — cursorul de mărime pentru creion, pensule și radieră apare
     în STÂNGA pânzei, cu previzualizarea mărimii pe pânză; „Copy (Ctrl + C)”; fundalul pânzei are o culoare (implicit, alb);
     18.09.2023 — radiera șterge cu adevărat (transparent), deci se vede fundalul; 17.09.2025 — cursorul Opacitate (creion,
     pensule). 28.09.2021 — meniul Pensule are pictograma pensulei alese.
   DIN RESURSE (resources.pri al pachetului, lectii/v/m3-l18/_proba/pri_ro.txt): numele RO: Selecție, Selectare, Dreptunghi,
     Formă liberă, Selectați tot, Inversare selecție, Selecție transparentă, Decupare („Decupat în clipboard”), Copiere, Lipire
     („Lipit din clipboard”), Editare, Pensulă, Pensulă caligrafică, Stilou caligrafie, Aerograf, Pensulă de ulei, Marker, Creion
     natural, Pensulă în acuarelă, Dimensiune, Radieră, Forme, Contur formă, Umplere formă și numele formelor.
   PRESUPUS (de fotografiat în laborator — lectii/v/m3-l19/capturi_lipsa.json):
     · Ctrl+X și Ctrl+V în Paint (convenția Windows, pagina Microsoft „Comenzi rapide de la tastatură în Windows”);
     · lipirea apare în colțul din stânga-sus al pânzei, selectată, iar unealta devine Selectare;
     · mutarea și ștergerea lasă în urmă fundalul (de obicei alb); Ctrl+Z anulează mutarea întreagă;
     · Delete / Ctrl+X pe o bucată ÎNCĂ selectată după lipire sau după mutare: aici se albește tot dreptunghiul ei, deci și ce era
       SUB ea (traseul 'alb' peste 'bloc' / 'muta'); în Paint-ul clasic bucata „plutitoare” se arunca, iar dedesubt rămânea
       desenul. În Paint 11, nefotografiat (capturi_lipsa L10). Nicio lecție nu cere un gest care depinde de el (reparațiile J1, 24.10);
     · meniul Editare: Decupare, Copiere, Lipire (ordinea și scurtăturile din meniu);
     · ordinea tipurilor din lista Pensule; numele RO al pensulei „Crayon” (lipsă din resurse: nu e în listă);
     · capătul de sus al cursorului Dimensiune = mai gros (cursor vertical Windows); valorile 1-50 px și cele de la început;
     · forma abia desenată rămâne cu chenar punctat până la un clic în afară (aici se pune pe pânză imediat);
     · Shift ține forma pătrată / rotundă și linia la 45°.
   ABATERI, spuse pe ecran sau în lecție: Curbă, Poligon și Explicațiile nu se desenează aici (spun de ce); culoarea e mereu
     neagră (lecția 21); fără Opacitate; fără butonul de grosime a formelor; desenele pensulelor sunt doar asemănătoare.

   TASTELE (reparația J1-E, 24.10): Ctrl+A / C / X / V / Z / Y și Delete ajung la Paint-ul din pagină din fereastra lui sau, cu
     focusul pe pagină, NUMAI dacă ultimul pointerdown din pagină a fost în acest Paint (.pt) sau pe Verifică (#chk); după un clic
     pe textul lecției, tastele rămân ale browserului (ca în Windows: tastele merg la fereastra cu ultimul clic). Casetele de scris,
     ocolite mereu. Ctrl+S / Ctrl+O din afara Paint-ului rămân ale lui paint.js (V/18, neschimbat).

   API (pentru lecțiile 20-22; NU schimba ce e aici fără să treci în granița ta):
   window.PaintSelectie = {versiune:1, ext, creeaza(alte?), randeaza(desen,{pref}), parse(u), scena(desen), BLOCURI, FORME, PENSULE, DIM0}
   window.SimPaintSel = PaintSelectie.creeaza()
   Desenul (S.desen) rămâne o listă de trasee {u, p} — paint.js păstrează DOAR u și p la salvare / deschidere:
     'creion' (mărimea de la început) | 'creion|<dim>' · 'pensula' (vechi, paint.js) | 'pensula|<tip>|<dim>' · 'radiera|<dim>' ·
     'forma|<fel>|<dim>' (p = colțul de start și colțul opus; Shift aplicat deja) · 'alb|r' (p = două colțuri) | 'alb|p' (poligon) ·
     'bloc|<id>' (o lipire; p=[[x,y]] colțul stânga-sus) · 'muta|<id>' (o mutare: alb la locul vechi + bucata la p[0]).
     Orice traseu poate avea la capăt '#<eticheta>' (de ex. 'forma|oval|3#soare'): testele numără obiectele după etichetă.
     CULOAREA (pentru lecția 21; lecția 19 n-o folosește): câmpurile 'c=<hex>' (linia / conturul) și 'f=<hex>' (umplerea formei),
     înainte de '#eticheta' (de ex. 'forma|oval|3|c=d62828|f=fff200#soare'); gesturile le pun singure când S.ps.c1 / S.ps.umplere
     sunt setate (implicit null = negru / fără umplere). Radiera rămâne albă.
   Starea extensiei: S.ps = {sel:{r:[x,y,w,h], poli, plut}|null, clip:id|null, dim:{creion,pensula,radiera,forma}, tip, fel, selMod, c1, umplere}.
   Q.ps (opțional) = {dim:{…}, tip, fel, c1, umplere, model:'<cheie din PaintSim.DESENE>'} — model = „Modelul”, desenat sub Paint.
   Desene noi în PaintSim.DESENE: ps_casa, ps_casa_copac, ps_parc, ps_parc_model, ps_nor, ps_flori (vezi DESENE_NOI).
     24.10 (reparațiile J1-B, J1-C): ps_nor și ps_parc au alte coordonate (norul la ≥ 100 de unități de vecini; soarele din ps_parc
     scos din colțul în care apare lipirea; mâzgălitura mutată). Numele, etichetele și restul desenelor, neschimbate.
   Evenimente noi pe 'paint-sim': selectie, copiat, decupat, lipit, sters, mutat, forma, radiera; 'anulat' (Ctrl+Z de la tastatură) și 'dimensiune' (cursorul) se scriu doar în S.ev, nu pe 'paint-sim' (butonul ↶ trimite 'anulat').
   Teste noi (checks[].k): selectat{tot?} · selectie{tag, fara?:[…]} · obiect{tag, min?, max?, zona?:[x,y,w,h]} ·
     original{tag} · sters{tag} · mutat{tag, zona} · forma{fel?, min?, zona?, in?:'<tag>'} · peste{sus:'<fel>', jos:'<fel>'} ·
     pensula{tip?, dimMin?, min?} · radiera{peste?:'pensula'|'<tag>'} · ev{tip, dupa?:'<tip>'}
     (un obiect e „întreg” dacă se vede ≥ 90 % din el și „șters” dacă se vede ≤ 10 %).
   Operații noi (sol / gresit): ['unealta',id] · ['pensula',tip] · ['forma',fel] · ['mod','dreptunghi'|'libera'] · ['dim',unealta,n] ·
     ['trage',[[x,y],…],shift?] (gestul pe pânză cu unealta aleasă: desen, selecție sau mutarea selecției) · ['tot'] · ['copiaza'] ·
     ['decupeaza'] · ['lipeste'] · ['sterge'] · ['deselect'] · ['anuleaza'].
   Pânza o desenează extensia (cârligul panou), peste ce a pus paint.js; tragerea se previzualizează tot de aici. */
(function(){
'use strict';
const PS=window.PaintSim;
if(!PS||!PS.creeaza){if(window.console)console.error('paint-selectie.js: încarcă întâi ../../_sim/paint.js');return}
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DIM0={creion:2,pensula:10,radiera:20,forma:3};
const DIMMAX=50;
const BLOCURI=[];
const CACHE_SC={};
const INST=new WeakMap();
let NR=0;

/* ---- formele: ordinea din captura instrumente-bara.webp; numele din resursele Paint RO ---- */
const ROT=(n,r1,r2,a0)=>{const p=[];for(let i=0;i<n*2;i++){const r=i%2?r2:r1,a=a0+i*Math.PI/n;p.push([.5+r*Math.cos(a),.5+r*Math.sin(a)])}return p};
const INIMA=(()=>{const p=[];for(let i=0;i<40;i++){const t=i/40*2*Math.PI,x=16*Math.pow(Math.sin(t),3),y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);p.push([.5+x/34,.42-y/30])}
  const ys=p.map(q=>q[1]),y0=Math.min(...ys),y1=Math.max(...ys);return p.map(q=>[q[0],(q[1]-y0)/(y1-y0)])})();
const UNIT={
  triunghi:[[.5,0],[1,1],[0,1]], triunghiD:[[0,0],[0,1],[1,1]], romb:[[.5,0],[1,.5],[.5,1],[0,.5]],
  pentagon:[[.5,0],[1,.38],[.81,1],[.19,1],[0,.38]], hexagon:[[.25,0],[.75,0],[1,.5],[.75,1],[.25,1],[0,.5]],
  sageataD:[[0,.3],[.6,.3],[.6,0],[1,.5],[.6,1],[.6,.7],[0,.7]], sageataS:[[1,.3],[.4,.3],[.4,0],[0,.5],[.4,1],[.4,.7],[1,.7]],
  sageataSus:[[.3,1],[.3,.4],[0,.4],[.5,0],[1,.4],[.7,.4],[.7,1]], sageataJos:[[.3,0],[.3,.6],[0,.6],[.5,1],[1,.6],[.7,.6],[.7,0]],
  stea4:ROT(4,.5,.17,-Math.PI/2), stea5:ROT(5,.5,.2,-Math.PI/2), stea6:ROT(6,.5,.26,-Math.PI/2),
  fulger:[[.38,0],[.72,0],[.55,.38],[.85,.38],[.28,1],[.42,.55],[.15,.55]], inima:INIMA
};
const FORME=[
  {id:'linie',nume:'Linie'},{id:'curba',nume:'Curbă',nu:'Curba se face din mai multe gesturi (tragi, apoi o îndoi)'},{id:'oval',nume:'Oval'},{id:'dreptunghi',nume:'Dreptunghi'},
  {id:'dreptunghiR',nume:'Dreptunghi rotunjit'},{id:'poligon',nume:'Poligon',nu:'Poligonul se face din mai multe clicuri, latură cu latură'},{id:'triunghi',nume:'Triunghi'},
  {id:'triunghiD',nume:'Triunghi dreptunghic'},{id:'romb',nume:'Romb'},{id:'pentagon',nume:'Pentagon'},{id:'hexagon',nume:'Hexagon'},
  {id:'sageataD',nume:'Săgeată la dreapta'},{id:'sageataS',nume:'Săgeată la stânga'},{id:'sageataSus',nume:'Săgeată în sus'},
  {id:'sageataJos',nume:'Săgeată în jos'},{id:'stea4',nume:'Stea cu 4 colțuri'},{id:'stea5',nume:'Stea cu 5 colțuri'},{id:'stea6',nume:'Stea cu 6 colțuri'},
  {id:'explicD',nume:'Explicație în dreptunghi rotunjit',nu:'Explicațiile (bulele de vorbire) primesc text: textul îl înveți la lecția 22'},
  {id:'explicO',nume:'Explicație oval',nu:'Explicațiile (bulele de vorbire) primesc text: textul îl înveți la lecția 22'},
  {id:'explicN',nume:'Explicație nor',nu:'Explicațiile (bulele de vorbire) primesc text: textul îl înveți la lecția 22'},
  {id:'inima',nume:'Inimă'},{id:'fulger',nume:'Fulger'}
];
const PENSULE=[
  {id:'pensula',nume:'Pensulă'},{id:'caligrafica',nume:'Pensulă caligrafică'},{id:'stilou',nume:'Stilou caligrafie'},{id:'aerograf',nume:'Aerograf'},
  {id:'ulei',nume:'Pensulă de ulei'},{id:'marker',nume:'Marker'},{id:'natural',nume:'Creion natural'},{id:'acuarela',nume:'Pensulă în acuarelă'}
];
const numeForma=f=>{const x=FORME.find(y=>y.id===f);return x?x.nume:f};
const numePensula=t=>{const x=PENSULE.find(y=>y.id===t);return x?x.nume:t};

/* ---- desenele noi (cu etichete), puse în PaintSim.DESENE ---- */
const F=(fel,x1,y1,x2,y2,tag)=>({u:'forma|'+fel+'|3'+(tag?'#'+tag:''),p:[[x1,y1],[x2,y2]]});
const CASA=[F('dreptunghi',120,330,380,560,'casa'),F('triunghi',100,190,400,330,'casa')];
const COPAC=(dx)=>[F('dreptunghi',560+dx,470,590+dx,560,'trunchi'),F('oval',515+dx,330,635+dx,470,'copac')];
/* mâzgălitura: aceeași linie frântă (175 × 65), pusă cu colțul stânga-sus în (x, y), micșorată cu k */
const MZ=[[0,40],[25,0],[50,60],[75,5],[100,65],[125,10],[150,58],[175,20]];
const MAZGA_LA=(x,y,k)=>({u:'creion#mazga',p:MZ.map(([a,b])=>[x+Math.round(a*(k||1)),y+Math.round(b*(k||1))])});
const DESENE_NOI={
  ps_casa:CASA.concat([F('oval',820,60,940,180,'soare')]),
  /* 24.10 (J1-C): soarele departe de colțul din stânga-sus, unde apare lipirea (o copie lăsată acolo nu-l mai acoperă);
     mâzgălitura mai mică, între soare și locul soarelui din Model, la ≥ 60 de unități de copaci și de casă */
  ps_parc:CASA.concat(COPAC(0),[F('oval',440,90,550,200,'soare'),MAZGA_LA(650,195,.7)]),
  ps_parc_model:CASA.concat([F('dreptunghi',225,450,285,560)],COPAC(0),COPAC(150),COPAC(300),[F('oval',860,90,970,200,'soare')]),
  ps_casa_copac:CASA.concat(COPAC(0),[F('oval',820,40,930,150,'soare')]),
  /* 24.10 (J1-B): norul la ≥ 100 de unități de soare, de acoperiș, de copac și de mâzgălitură (pe telefon, ≥ 24 px), cu 90 de
     unități deasupra (degetul pornește selecția în pânză); mâzgălitura jos-dreapta (760-935 × 380-445), la ≥ 120 de unități
     de copac și sub locul unde ajunge norul cu tot chenarul selecției lui (altfel tragerea pentru mâzgălitură mută iar norul) */
  ps_nor:CASA.concat(COPAC(0),[F('oval',60,40,170,150,'soare'),F('oval',380,90,580,170,'nor'),MAZGA_LA(760,380)]),
  ps_flori:[F('stea5',140,80,240,180,'stea'),F('oval',620,380,720,480,'floare'),F('linie',670,480,670,600,'floare'),F('oval',820,70,960,160,'nor')]
};
Object.keys(DESENE_NOI).forEach(k=>{if(PS.DESENE&&!PS.DESENE[k])PS.DESENE[k]=DESENE_NOI[k]});

/* ---- geometrie ---- */
function parse(u){u=String(u||'');const h=u.indexOf('#');const tag=h>=0?u.slice(h+1):'';const m0=(h>=0?u.slice(0,h):u).split('|');const o={t:m0[0],tag};
  const m=m0.filter((x,i)=>{if(i&&/^c=[0-9a-f]{6}$/i.test(x)){o.c='#'+x.slice(2);return false}if(i&&/^f=[0-9a-f]{6}$/i.test(x)){o.f='#'+x.slice(2);return false}return true});const t=o.t;
  if(t==='creion'){o.simplu=m.length<2;o.dim=+m[1]||DIM0.creion}
  else if(t==='pensula'){o.simplu=m.length<2;o.tip=m[1]||'pensula';o.dim=+m[2]||DIM0.pensula}
  else if(t==='radiera'){o.dim=+m[1]||DIM0.radiera}
  else if(t==='forma'){o.fel=m[1]||'dreptunghi';o.dim=+m[2]||DIM0.forma}
  else if(t==='alb'){o.fel=m[1]==='p'?'p':'r'}
  else if(t==='bloc'||t==='muta'){o.id=+m[1]}
  return o}
const rectDin=(a,b)=>[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])];
const inR=(q,r)=>q[0]>=r[0]&&q[0]<=r[0]+r[2]&&q[1]>=r[1]&&q[1]<=r[1]+r[3];
function inPoli(q,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>q[1])!==(yj>q[1]))&&(q[0]<(xj-xi)*(q[1]-yi)/((yj-yi)||1e-9)+xi))c=!c}return c}
const TOL_IN=30; /* 24.10 (J2-U): ușa desenată pe linia de jos a casei (ca în Model) trece; toleranță în jos, în unități de pânză */
function bbox(P){const xs=P.map(q=>q[0]),ys=P.map(q=>q[1]),x=Math.min(...xs),y=Math.min(...ys);return [x,y,Math.max(...xs)-x,Math.max(...ys)-y]}
function distSeg(q,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let t=L?((q[0]-a[0])*dx+(q[1]-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));return Math.hypot(q[0]-a[0]-t*dx,q[1]-a[1]-t*dy)}
function distPoli(q,P){if(P.length===1)return Math.hypot(q[0]-P[0][0],q[1]-P[0][1]);let d=1e9;for(let i=1;i<P.length;i++)d=Math.min(d,distSeg(q,P[i-1],P[i]));return d}
function deasa(P,inchis,pas){pas=pas||4;const L=inchis?P.concat([P[0]]):P;if(L.length===1)return [L[0].slice()];const o=[];
  for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/pas));for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}
  if(!inchis)o.push(L[L.length-1].slice());return o}
/* conturul unei forme: {inchis, pts} în coordonatele pânzei */
function contur(fel,p){const a=p[0],b=p[p.length-1];const X=Math.min(a[0],b[0]),Y=Math.min(a[1],b[1]),w=Math.abs(b[0]-a[0]),h=Math.abs(b[1]-a[1]);
  if(fel==='linie')return {inchis:false,pts:[a.slice(),b.slice()]};
  if(UNIT[fel])return {inchis:true,pts:UNIT[fel].map(([u,v])=>[X+u*w,Y+v*h])};
  if(fel==='oval'){const q=[];for(let i=0;i<48;i++){const t=i/48*2*Math.PI;q.push([X+w/2+w/2*Math.cos(t),Y+h/2+h/2*Math.sin(t)])}return {inchis:true,pts:q}}
  if(fel==='dreptunghiR'){const r=Math.min(w,h)*.18,q=[];[[X+w-r,Y+r,-90],[X+w-r,Y+h-r,0],[X+r,Y+h-r,90],[X+r,Y+r,180]].forEach(([cx,cy,a0])=>{for(let i=0;i<=6;i++){const t=(a0+i*15)*Math.PI/180;q.push([cx+r*Math.cos(t),cy+r*Math.sin(t)])}});return {inchis:true,pts:q}}
  return {inchis:true,pts:[[X,Y],[X+w,Y],[X+w,Y+h],[X,Y+h]]}}
/* Shift: pătrat / cerc; linia la 0°, 45°, 90° */
function cuShift(fel,a,b){if(fel==='linie'){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),u=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4);return [a[0]+Math.round(L*Math.cos(u)),a[1]+Math.round(L*Math.sin(u))]}
  const d=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));return [a[0]+(b[0]>=a[0]?d:-d),a[1]+(b[1]>=a[1]?d:-d)]}
const pstr=P=>P.map(q=>Math.round(q[0]*10)/10+','+Math.round(q[1]*10)/10).join(' ');
function cloneD(d){return (d||[]).map(s=>({u:s.u,p:s.p.map(q=>[q[0],q[1]])}))}

/* ---- desenul pânzei (SVG) ---- */
function linie(P,w,extra){return P.length===1?`<circle cx="${P[0][0]}" cy="${P[0][1]}" r="${Math.max(1.5,w/2)}" fill="${extra&&extra.c||'#000'}"${extra&&extra.op?` opacity="${extra.op}"`:''}/>`:
  `<polyline points="${pstr(P)}" fill="none" stroke="${extra&&extra.c||'#000'}" stroke-width="${w}" stroke-linecap="${extra&&extra.cap||'round'}" stroke-linejoin="round"${extra&&extra.op?` opacity="${extra.op}"`:''}${extra&&extra.da?` stroke-dasharray="${extra.da}"`:''}${extra&&extra.ns?' vector-effect="non-scaling-stroke"':''}/>`}
function trasatura(o,P){const c=o.c||'#000';
  if(o.t==='creion')return o.simplu&&!o.c?(P.length===1?`<circle cx="${P[0][0]}" cy="${P[0][1]}" r="3" fill="#000"/>`:linie(P,1.6,{ns:1})):linie(P,o.simplu?2:o.dim,{c});
  if(o.t==='radiera')return P.length===1?`<rect x="${P[0][0]-o.dim/2}" y="${P[0][1]-o.dim/2}" width="${o.dim}" height="${o.dim}" fill="#fff"/>`:linie(P,o.dim,{c:'#fff',cap:'square'});
  if(o.t==='pensula'){
    if(o.simplu)return P.length===1?`<circle cx="${P[0][0]}" cy="${P[0][1]}" r="7" fill="${c}"/>`:linie(P,6,{ns:1,c});
    const d=o.dim;
    switch(o.tip){
      case 'caligrafica':case 'stilou':{const k=o.tip==='stilou'?.6:1,n=5,out=[];for(let i=0;i<n;i++){const t=(i/(n-1)-.5)*d*k*.8;out.push(linie(P.map(q=>[q[0]+t*.7,q[1]-t*.7]),Math.max(1,d*k*.22),{cap:'butt',c}))}return out.join('')}
      case 'aerograf':{const off=[[0,0],[d*.25,-d*.2],[-d*.22,d*.18],[d*.12,d*.28]];return off.map(([x,y])=>linie(P.map(q=>[q[0]+x,q[1]+y]),Math.max(1,d*.16),{da:`0 ${Math.max(2,d*.45)}`,c})).join('')}
      case 'ulei':return linie(P,d,{op:.75,c})+linie(P.map(q=>[q[0]+d*.15,q[1]+d*.1]),d*.45,{op:.5,c});
      case 'marker':return linie(P,d,{cap:'square',op:.55,c});
      case 'natural':return linie(P,Math.max(1.2,d*.35),{op:.8,da:'3 1',c});
      case 'acuarela':return linie(P,d*1.3,{op:.3,c});
      default:return linie(P,d,{c});
    }}
  if(o.t==='forma'){const k=contur(o.fel,P);return k.inchis?`<polygon points="${pstr(k.pts)}" fill="${o.f||'none'}" stroke="${c}" stroke-width="${o.dim}" stroke-linejoin="round"/>`:linie(k.pts,o.dim,{c})}
  return linie(P,1.6,{ns:1});
}
function regiune(f){return f.p?`<polygon points="${pstr(f.p)}" fill="#fff"/>`:`<rect x="${f.r[0]}" y="${f.r[1]}" width="${f.r[2]}" height="${f.r[3]}" fill="#fff"/>`}
function randeazaLista(desen,ctr){return (desen||[]).map(s=>randeazaUnul(s,ctr)).join('')}
function randeazaUnul(s,ctr){const o=parse(s.u);
  if(o.t==='alb')return o.fel==='p'?`<polygon points="${pstr(s.p)}" fill="#fff"/>`:(r=>`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="#fff"/>`)(rectDin(s.p[0],s.p[1]));
  if(o.t==='bloc'||o.t==='muta'){const B=BLOCURI[o.id];if(!B)return '';const r=B.f.r,T=s.p[0],dx=T[0]-r[0],dy=T[1]-r[1],cid=ctr.pref+'c'+(ctr.n++);
    const forma=B.f.p?`<polygon points="${pstr(B.f.p)}"/>`:`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}"/>`;
    return (o.t==='muta'?regiune(B.f):'')+`<g transform="translate(${dx} ${dy})"><clipPath id="${cid}">${forma}</clipPath><g clip-path="url(#${cid})">${regiune(B.f)}${randeazaLista(B.desen,ctr)}</g></g>`}
  return trasatura(o,s.p)}
function randeaza(desen,opt){return randeazaLista(desen,{pref:(opt&&opt.pref)||'psr',n:0})}

/* ---- scena: ce obiecte (cu etichetă) se văd și cât din ele (pentru teste) ---- */
function esantion(o,P){if(o.t==='forma'){const c=contur(o.fel,P);return deasa(c.pts,c.inchis,4)}return deasa(P,false,4)}
function ascunde(L,f){L.forEach(I=>I.pts.forEach((q,j)=>{if(I.vis[j]&&f(q))I.vis[j]=0}))}
function scenaBloc(id){if(!CACHE_SC[id]){const B=BLOCURI[id];CACHE_SC[id]=B?scena(B.desen):[]}return CACHE_SC[id]}
function scena(desen){const L=[];(desen||[]).forEach((s,k)=>{const o=parse(s.u);
  if(o.t==='radiera'){ascunde(L,q=>distPoli(q,s.p)<=o.dim/2+1);return}
  if(o.t==='alb'){const r=o.fel==='p'?null:rectDin(s.p[0],s.p[1]);ascunde(L,q=>r?inR(q,r):inPoli(q,s.p));return}
  if(o.t==='bloc'||o.t==='muta'){const B=BLOCURI[o.id];if(!B)return;const r=B.f.r,inS=q=>B.f.p?inPoli(q,B.f.p):inR(q,r);
    if(o.t==='muta')ascunde(L,inS);
    const dx=s.p[0][0]-r[0],dy=s.p[0][1]-r[1];ascunde(L,q=>inS([q[0]-dx,q[1]-dy]));
    scenaBloc(o.id).forEach(I=>{const pts=[];I.pts.forEach((q,j)=>{if(I.vis[j]&&inS(q))pts.push([q[0]+dx,q[1]+dy])});
      if(pts.length)L.push({tag:I.tag,u:I.u,o:I.o,pts,vis:pts.map(()=>1),n0:I.n0,src:'copie',k})});return}
  const pts=esantion(o,s.p);L.push({tag:o.tag,u:s.u,o,pts,vis:pts.map(()=>1),n0:pts.length,src:'desen',k})});
  return L}
const frac=I=>I.vis.reduce((a,b)=>a+b,0)/(I.n0||I.pts.length||1);
const vizibile=I=>I.pts.filter((q,j)=>I.vis[j]);

/* ---- starea extensiei pe S ---- */
function st(S,Q){if(!S.ps){const q=(Q&&Q.ps)||{};S.ps={dim:Object.assign({},DIM0,q.dim||{}),tip:q.tip||'pensula',fel:q.fel||'dreptunghi',selMod:'dreptunghi',sel:null,clip:null,focus:false,previz:0,c1:q.c1||null,umplere:q.umplere||null}}return S.ps}
function nouBloc(desen,sel){BLOCURI.push({desen:cloneD(desen),f:{r:sel.r.slice(),p:sel.poli?sel.poli.map(q=>q.slice()):null}});return BLOCURI.length-1}
function regAlb(sel){return sel.poli?{u:'alb|p',p:sel.poli.map(q=>q.slice())}:{u:'alb|r',p:[[sel.r[0],sel.r[1]],[sel.r[0]+sel.r[2],sel.r[1]+sel.r[3]]]}}
function schimbat(S,c,tip,d){S.refa=[];S.modificat=true;c.ev(tip,d||{});c.ev('desen',{u:tip,puncte:0})}
function alege(S,P,id,c){S.unealta=id;S.pop=null;S.meniu=null;if(id!=='selectie')P.sel=null;c.msg(
  id==='pensula'?`Ai ales <b>${E(numePensula(P.tip))}</b> (Pensule). Grosimea o schimbi din <b>Dimensiune</b>, cursorul din stânga pânzei.`:
  id==='radiera'?'Ai ales <b>Radieră</b>: trage peste ce vrei să ștergi. Grosimea: <b>Dimensiune</b>, în stânga pânzei.':
  id==='forma'?`Ai ales forma <b>${E(numeForma(P.fel))}</b>: apasă într-un colț, trage în diagonală, apoi ridică degetul / lasă butonul.`:
  id==='selectie'?(P.selMod==='libera'?'<b>Selectare › Formă liberă</b>: ține apăsat și înconjoară zona, ca și cum ai încercui-o cu creionul.':'<b>Selectare › Dreptunghi</b>: trage un dreptunghi peste ce vrei să alegi.'):'');
  c.ev('unealta',{u:id});P.focus=true}
function copiaza(S,P,c,tacut){if(!P.sel){c.msg('Întâi selectează o parte din desen (grupul <b>Selecție</b>), apoi copiezi.',true);return false}
  P.clip=nouBloc(S.desen,P.sel);if(!tacut){c.ev('copiat',{});c.msg('Ai copiat zona selectată în memorie. Originalul a rămas pe loc.')}return true}
function stergeSel(S,P,c,tip){if(!P.sel){c.msg('Întâi selectează ce vrei să ștergi.',true);return false}S.desen.push(regAlb(P.sel));P.sel=null;schimbat(S,c,tip||'sters');return true}
function decupeaza(S,P,c){if(!copiaza(S,P,c,true))return false;stergeSel(S,P,c,'decupat');c.msg('Ai decupat zona: a dispărut de pe pânză și e în memorie. O pui înapoi cu <kbd>Ctrl</kbd>+<kbd>V</kbd>.');return true}
function lipeste(S,P,c){if(P.clip==null||!BLOCURI[P.clip]){c.msg('În memorie nu e nimic de lipit: întâi copiezi (<kbd>Ctrl</kbd>+<kbd>C</kbd>) sau decupezi (<kbd>Ctrl</kbd>+<kbd>X</kbd>).',true);return false}
  const B=BLOCURI[P.clip],r=B.f.r;S.desen.push({u:'bloc|'+P.clip,p:[[0,0]]});
  P.sel={r:[0,0,r[2],r[3]],poli:B.f.p?B.f.p.map(q=>[q[0]-r[0],q[1]-r[1]]):null,plut:S.desen.length-1,desen:S.desen};
  S.unealta='selectie';schimbat(S,c,'lipit');c.msg('Copia a apărut sus, în stânga pânzei, selectată. Trage-o de mijloc unde vrei, apoi un clic în afara ei.');return true}
function tot(S,P,c){P.sel={r:[0,0,S.w,S.h],poli:null,plut:null,desen:S.desen};S.unealta='selectie';S.pop=null;c.ev('selectie',{tot:true});c.msg('<b>Selectați tot</b>: e selectată toată pânza.')}
function mutaSel(S,P,c,dx,dy,bloc){const sel=P.sel;
  const ult=S.desen.length-1,it=S.desen[ult];
  if(sel.plut===ult&&it&&/^(bloc|muta)\|/.test(it.u))it.p=[[it.p[0][0]+dx,it.p[0][1]+dy]];
  else{const id=bloc!=null?bloc:nouBloc(S.desen,sel);S.desen.push({u:'muta|'+id,p:[[sel.r[0]+dx,sel.r[1]+dy]]});sel.plut=S.desen.length-1}
  sel.r=[sel.r[0]+dx,sel.r[1]+dy,sel.r[2],sel.r[3]];if(sel.poli)sel.poli=sel.poli.map(q=>[q[0]+dx,q[1]+dy]);sel.desen=S.desen;
  c.ev('mutat',{dx,dy});return true}
/* gestul pe pânză (pointer sau operația 'trage'): întoarce true dacă s-a schimbat desenul */
function gest(S,P,c,u,p,info){info=info||{};
  const cu=P.c1?'|c='+String(P.c1).replace('#',''):'';
  if(u==='creion'){S.desen.push({u:(P.dim.creion===DIM0.creion&&!cu?'creion':'creion|'+P.dim.creion)+cu,p});return true}
  if(u==='pensula'){S.desen.push({u:'pensula|'+P.tip+'|'+P.dim.pensula+cu,p});return true}
  if(u==='radiera'){S.desen.push({u:'radiera|'+P.dim.radiera,p});c.ev('radiera',{});return true}
  if(u==='forma'){if(p.length<2)return false;let a=p[0],b=p[p.length-1];if(info.shift)b=cuShift(P.fel,a,b);
    if(Math.abs(b[0]-a[0])<4&&Math.abs(b[1]-a[1])<4)return false;S.desen.push({u:'forma|'+P.fel+'|'+P.dim.forma+cu+(P.umplere?'|f='+String(P.umplere).replace('#',''):''),p:[a.slice(),b.slice()]});c.ev('forma',{fel:P.fel});return true}
  if(u==='selectie'){const a=p[0],b=p[p.length-1];
    if(P.sel&&inR(a,P.sel.r)){const dx=b[0]-a[0],dy=b[1]-a[1];if(Math.abs(dx)<1&&Math.abs(dy)<1)return false;return mutaSel(S,P,c,dx,dy,info.bloc)}
    P.sel=null;
    if(P.selMod==='libera'){if(p.length<3)return false;const q=p.map(x=>[Math.max(0,Math.min(S.w,x[0])),Math.max(0,Math.min(S.h,x[1]))]),r=bbox(q);if(r[2]<4||r[3]<4)return false;
      P.sel={r,poli:q,plut:null,desen:S.desen};c.ev('selectie',{libera:true});return false}
    const A=[Math.max(0,Math.min(S.w,a[0])),Math.max(0,Math.min(S.h,a[1]))],B=[Math.max(0,Math.min(S.w,b[0])),Math.max(0,Math.min(S.h,b[1]))],r=rectDin(A,B);
    if(r[2]<4||r[3]<4)return false;P.sel={r,poli:null,plut:null,desen:S.desen};c.ev('selectie',{});return false}
  return false}

/* ---- testele ---- */
function verifica(t,c){const S=c.S,P=st(S,c.Q);
  const sc=()=>scena(S.desen),inst=tag=>sc().filter(I=>I.tag===tag);
  const inZ=(I,z)=>vizibile(I).every(q=>inR(q,z));
  switch(t.k){
    case 'selectat':return S.pornit&&!!P.sel&&(!t.tot||(P.sel.r[0]<=0&&P.sel.r[1]<=0&&P.sel.r[2]>=S.w&&P.sel.r[3]>=S.h));
    case 'selectie':{if(!P.sel)return false;const inS=q=>P.sel.poli?inPoli(q,P.sel.poli):inR(q,P.sel.r),L=sc();
      const ok=L.some(I=>I.tag===t.tag&&frac(I)>=.9&&vizibile(I).every(inS));
      const fara=[].concat(t.fara||[]).every(g=>!L.some(I=>I.tag===g&&vizibile(I).some(inS)));return ok&&fara}
    case 'obiect':{const n=inst(t.tag).filter(I=>frac(I)>=.9&&(!t.zona||inZ(I,t.zona))).length;return n>=(t.min!=null?t.min:1)&&(t.max==null||n<=t.max)}
    case 'original':return inst(t.tag).some(I=>I.src==='desen'&&frac(I)>=.9);
    case 'sters':{const L=inst(t.tag);return L.length>0&&L.every(I=>frac(I)<=.1)}
    case 'mutat':{const L=inst(t.tag);return L.some(I=>I.src==='desen')&&L.filter(I=>I.src==='desen').every(I=>frac(I)<=.1)&&L.some(I=>I.src==='copie'&&frac(I)>=.9&&inZ(I,t.zona))}
    case 'forma':{const L=sc().filter(I=>I.o.t==='forma'&&!I.tag&&(!t.fel||I.o.fel===t.fel)&&frac(I)>=.9);
      const zona=t.in?(()=>{const C=sc().filter(I=>I.tag===t.in&&I.o.t==='forma'&&I.o.fel==='dreptunghi'&&frac(I)>=.9);if(!C.length)return null;const z=bbox(vizibile(C[0]));z[3]+=TOL_IN;return z})():t.zona;
      const n=L.filter(I=>!zona||inZ(I,zona)).length;return n>=(t.min!=null?t.min:1)&&(t.max==null||n<=t.max)}
    case 'peste':{const L=sc().filter(I=>I.o.t==='forma'&&!I.tag&&frac(I)>=.9);const sus=L.filter(I=>I.o.fel===t.sus),jos=L.filter(I=>I.o.fel===t.jos);
      return sus.some(A=>jos.some(B=>{const a=bbox(vizibile(A)),b=bbox(vizibile(B)),sx=Math.min(a[0]+a[2],b[0]+b[2])-Math.max(a[0],b[0]);
        return a[1]+a[3]<=b[1]+40&&a[1]+a[3]>=b[1]-60&&sx>=.5*Math.min(a[2],b[2])}))}
    case 'pensula':return sc().filter(I=>I.o.t==='pensula'&&!I.o.simplu&&!I.tag&&(!t.tip||I.o.tip===t.tip)&&I.o.dim>=(t.dimMin||0)&&I.pts.length>=8&&frac(I)>=.3).length>=(t.min!=null?t.min:1);
    case 'radiera':{if(!S.desen.some(s=>parse(s.u).t==='radiera'))return false;if(!t.peste)return true;
      const L=sc().filter(I=>t.peste==='pensula'?(I.o.t==='pensula'&&!I.tag):I.tag===t.peste);return L.some(I=>I.vis.filter(v=>!v).length>=3)}   /* cel puțin 3 puncte (≈12 px) șterse din ea */
    case 'ev':{const i=S.ev.map(x=>x.tip).lastIndexOf(t.tip);if(i<0)return false;if(!t.dupa)return true;return S.ev.slice(0,i).some(x=>x.tip===t.dupa)}
  }
  return null}

/* ---- operațiile pentru soluții (Arată-mi, poarta) ---- */
function op(o,c){const S=c.S,P=st(S,c.Q),[k,a,b,d]=o;
  switch(k){
    case 'unealta':alege(S,P,a,c);return true;
    case 'pensula':P.tip=a;alege(S,P,'pensula',c);return true;
    case 'forma':P.fel=a;alege(S,P,'forma',c);return true;
    case 'mod':P.selMod=a==='libera'?'libera':'dreptunghi';alege(S,P,'selectie',c);return true;
    case 'dim':P.dim[a]=Math.max(1,Math.min(DIMMAX,+b||1));c.ev('dimensiune',{u:a,v:P.dim[a]});return true;
    case 'trage':{if(!S.pornit)return true;if(S.unealta!=='selectie')P.sel=null;if(gest(S,P,c,S.unealta,a.map(q=>[q[0],q[1]]),{shift:!!b})){S.refa=[];S.modificat=true;c.ev('desen',{u:S.unealta,puncte:a.length})}return true}
    case 'tot':tot(S,P,c);return true;
    case 'copiaza':copiaza(S,P,c);return true;
    case 'decupeaza':decupeaza(S,P,c);return true;
    case 'lipeste':lipeste(S,P,c);return true;
    case 'sterge':stergeSel(S,P,c);return true;
    case 'deselect':P.sel=null;return true;
    case 'anuleaza':P.sel=null;if(S.desen.length){S.refa.push(S.desen.pop());S.modificat=true;c.ev('anulat',{})}return true;
  }
  return false}

/* ---- butoanele și meniurile ---- */
const SVG_SEL='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" fill="none" stroke="#333" stroke-width="1.6" stroke-dasharray="3 2.4"/></svg>';
const SVG_LIB='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 8c2-5 12-5 13 1s-6 9-10 8-5-5-3-9z" fill="none" stroke="#333" stroke-width="1.6" stroke-dasharray="3 2.4"/></svg>';
function svgPensula(t){const g={pensula:'<path d="M9 3h6v8l-3 3-3-3z" fill="#bbb" stroke="#444" stroke-width="1.2"/><path d="M10 14h4l-1 7h-2z" fill="#6b4f2a"/>',
  caligrafica:'<path d="M8 3h8l-2 9h-4z" fill="#bbb" stroke="#444" stroke-width="1.2"/><path d="M10 12h4l-2 9z" fill="#333"/>',stilou:'<path d="M12 2l4 9-4 11-4-11z" fill="#9ab" stroke="#444" stroke-width="1.2"/><circle cx="12" cy="11" r="1.4" fill="#fff"/>',
  aerograf:'<rect x="9" y="8" width="7" height="12" rx="2" fill="#bbb" stroke="#444" stroke-width="1.2"/><path d="M10 8V5h5v3" stroke="#444" fill="none"/><circle cx="5" cy="5" r="1" fill="#333"/><circle cx="4" cy="9" r="1" fill="#333"/><circle cx="7" cy="3" r="1" fill="#333"/>',
  ulei:'<path d="M8 3h8v7l-2 3h-4l-2-3z" fill="#d9b38c" stroke="#444" stroke-width="1.2"/><path d="M10 13h4v8h-4z" fill="#6b4f2a"/>',marker:'<rect x="8" y="3" width="8" height="12" rx="2" fill="#555"/><path d="M9 15h6l-1 6h-4z" fill="#222"/>',
  natural:'<path d="M5 20l1.2-4.4L15.6 5.2a2 2 0 012.8 0l.4.4a2 2 0 010 2.8L8.4 18.8z" fill="#c9a36b" stroke="#333" stroke-width="1.2"/>',acuarela:'<path d="M9 3h6v8l-3 3-3-3z" fill="#9cc7e8" stroke="#446" stroke-width="1.2"/><path d="M10 14h4l-1 7h-2z" fill="#6b4f2a"/><circle cx="18" cy="18" r="2.5" fill="#9cc7e8" opacity=".7"/>'}[t]||'';
  return `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${g}</svg>`}
function svgForma(f){const P=[[3,3],[21,21]];if(f==='curba')return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 18C8 2 14 22 21 6" fill="none" stroke="#333" stroke-width="1.6"/></svg>';
  if(f==='poligon')return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 20L7 5l12 3-2 12z" fill="none" stroke="#333" stroke-width="1.6"/></svg>';
  if(/^explic/.test(f))return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">${f==='explicN'?'<path d="M6 16a4 4 0 010-8 5 5 0 019-1 4 4 0 013 8z" fill="none" stroke="#333" stroke-width="1.5"/><circle cx="7" cy="19" r="1.2" fill="#333"/>':f==='explicO'?'<ellipse cx="12" cy="10" rx="9" ry="6" fill="none" stroke="#333" stroke-width="1.5"/><path d="M8 15l-2 5 5-4" fill="none" stroke="#333" stroke-width="1.5"/>':'<rect x="3" y="4" width="18" height="12" rx="3" fill="none" stroke="#333" stroke-width="1.5"/><path d="M8 16l-1 5 5-5" fill="none" stroke="#333" stroke-width="1.5"/>'}</svg>`;
  const c=contur(f,P);return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">${c.inchis?`<polygon points="${pstr(c.pts)}" fill="none" stroke="#333" stroke-width="1.5" stroke-linejoin="round"/>`:`<polyline points="${pstr(c.pts)}" fill="none" stroke="#333" stroke-width="1.6"/>`}</svg>`}
const CHEV='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5l4 4 4-4" fill="none" stroke="#333" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CSS=`
.ps-split{display:flex;flex-direction:column;align-items:center;gap:0}
.ps-split .pt-big{height:40px}
.ps-svg polyline[data-viu]{display:none}
.ps-arr{width:44px;min-height:32px;border:1px solid transparent;background:transparent;border-radius:4px;cursor:pointer;font:inherit;font-size:13px;line-height:1;color:#1a1a1a;padding:0}
.ps-arr:hover,.ps-arr.on{background:#e6e6e6}
.ps-gal{display:grid;grid-template-columns:repeat(8,32px);gap:1px}
.ps-gal button,.ps-stil button{width:32px;height:32px;border:1px solid transparent;border-radius:4px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;color:#1a1a1a}
.ps-gal button:hover,.ps-stil button:hover{background:#e6e6e6}.ps-gal button.on{background:#e0eefc;border-color:#9cc3ef}
.ps-gal button.nu{opacity:.55}
.ps-stil{display:flex;flex-direction:column;gap:2px;margin-left:4px}
.ps-stil button{width:auto;min-width:44px;padding:0 4px;color:#9a9a9a;font-size:11px;gap:2px}
.ps-pop{min-width:200px}
.ps-pop .ps-it{display:flex;align-items:center;gap:8px;width:100%;border:0;background:transparent;font:inherit;font-size:13px;color:#1a1a1a;text-align:left;padding:3px 8px;min-height:34px;border-radius:4px;cursor:pointer}
.ps-pop .ps-it:hover{background:#ececec}.ps-pop .ps-it.on{background:#e0eefc}
.ps-pop .ps-it .sc{margin-left:auto;color:#6b6b6b;font-size:12px}
.ps-pop .ps-it.gri{color:#8a8a8a}
.ps-pop hr{border:0;border-top:1px solid #e5e5e5;margin:3px 2px}
.ps-pop .ps-gal{margin:2px 0 4px}
.pt-wrap.ps-cudim{padding-left:58px;min-height:206px}
.ps-arr svg{width:14px;height:14px;display:block;margin:0 auto}
.ps-dimp{position:absolute;left:6px;top:12px;width:44px;display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;border:1px solid #d6d6d6;border-radius:8px;padding:6px 0 4px;box-shadow:0 1px 3px rgba(0,0,0,.12);z-index:2}
.ps-dimp .ic{font-size:11px;color:#5c5c5c;text-align:center;line-height:1.1}
.ps-dimp input{writing-mode:vertical-lr;direction:rtl;width:32px;height:120px;margin:4px 0;cursor:pointer;accent-color:#0067c0}
.ps-dimp .v{font-size:11px;color:#3b3b3b}
.ps-model{margin-top:8px}
.ps-model svg{display:block;width:100%;max-width:360px;height:auto;background:#fff;border:1px solid var(--line);border-radius:6px}
`;
let cssPus=false;function css(){if(cssPus)return;cssPus=true;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s)}

function pozPop(win,el,lat){const tl=win.querySelector('.pt-tools');if(!tl)return 'left:6px;top:150px';const W=win.clientWidth||600,wr=win.getBoundingClientRect(),tr=tl.getBoundingClientRect(),t=Math.round(tr.bottom-wr.top-win.clientTop);
  let x=el?Math.round(el.getBoundingClientRect().left-wr.left-win.clientLeft):6;x=Math.max(4,Math.min(x,W-(lat||230)-6));return `left:${x}px;top:${t}px`}
function galerie(P,S){return `<div class="ps-gal" role="group" aria-label="Forme">${FORME.map(f=>`<button type="button" class="${S.unealta==='forma'&&P.fel===f.id?'on':''}${f.nu?' nu':''}" data-act="ps:forma" data-v="${f.id}" aria-label="${E(f.nume)}" title="${E(f.nume)}">${svgForma(f.id)}</button>`).join('')}</div>`}
const STIL=`<div class="ps-stil"><button type="button" data-act="ps:stil" aria-label="Contur formă" title="Contur formă">✎ ⌄</button><button type="button" data-act="ps:stil" aria-label="Umplere formă" title="Umplere formă">◧ ⌄</button></div>`;
function bara(win,S,P){
  const tl=win.querySelector('.pt-tools');if(!tl)return;const G=tl.children;if(G.length<5)return;
  /* Selecție: buton de scindare (Selectare + ⌄) */
  const gs=G[0].querySelector('.pt-gc');
  if(gs)gs.innerHTML=`<div class="ps-split"><button type="button" class="pt-t pt-big${S.unealta==='selectie'?' on':''}" data-act="ps:unealta" data-v="selectie" aria-label="Selectare" title="Selectare">${P.selMod==='libera'?SVG_LIB:SVG_SEL}</button><button type="button" class="ps-arr${S.pop==='ps-sel'?' on':''}" data-act="ps:pop" data-v="ps-sel" aria-label="Selectare: opțiuni" title="Dreptunghi, Formă liberă, Selectați tot">${CHEV}</button></div>`;
  /* Pensule: buton de scindare, cu pictograma pensulei alese */
  const gp=G[3].querySelector('.pt-gc');
  if(gp)gp.innerHTML=`<div class="ps-split"><button type="button" class="pt-t pt-big${S.unealta==='pensula'?' on':''}" data-act="ps:unealta" data-v="pensula" aria-label="Pensule" title="Pensule: ${E(numePensula(P.tip))}">${svgPensula(P.tip)}</button><button type="button" class="ps-arr${S.pop==='ps-pens'?' on':''}" data-act="ps:pop" data-v="ps-pens" aria-label="Pensule: tipurile" title="Tipurile de pensule">${CHEV}</button></div>`;
  /* Forme: galeria (lată) sau butonul strâns */
  const gf=G[4],gfc=gf.querySelector('.pt-gc');
  if(gfc)gfc.innerHTML=galerie(P,S)+STIL;
  else{const b=gf.querySelector('[data-act="grup"]');if(b){b.setAttribute('data-act','ps:pop');b.setAttribute('data-v','ps-forme');if(S.unealta==='forma')b.classList.add('on')}}
}
function popup(win,S,P){
  const tl=win.querySelector('.pt-tools');const G=tl?tl.children:[];let h='';
  if(S.pop==='ps-sel')h=`<div class="pt-pop ps-pop" role="menu" aria-label="Selectare" style="${pozPop(win,G[0],230)}">
    <button type="button" class="ps-it${P.selMod==='dreptunghi'?' on':''}" role="menuitem" data-act="ps:selmod" data-v="dreptunghi">${SVG_SEL} Dreptunghi</button>
    <button type="button" class="ps-it${P.selMod==='libera'?' on':''}" role="menuitem" data-act="ps:selmod" data-v="libera">${SVG_LIB} Formă liberă</button><hr>
    <button type="button" class="ps-it" role="menuitem" data-act="ps:tot">Selectați tot<span class="sc">Ctrl+A</span></button>
    <button type="button" class="ps-it gri" role="menuitem" data-act="ps:nu" data-v="inversare">Inversare selecție</button>
    <button type="button" class="ps-it" role="menuitem" data-act="ps:nu" data-v="transparenta">Selecție transparentă</button>
    <button type="button" class="ps-it${P.sel?'':' gri'}" role="menuitem" data-act="ps:stergere">Ștergere<span class="sc">del</span></button></div>`;
  else if(S.pop==='ps-pens')h=`<div class="pt-pop ps-pop" role="menu" aria-label="Pensule" style="${pozPop(win,G[3],220)}">${PENSULE.map(x=>`<button type="button" class="ps-it${P.tip===x.id&&S.unealta==='pensula'?' on':''}" role="menuitem" data-act="ps:pensula" data-v="${x.id}">${svgPensula(x.id)} ${E(x.nume)}</button>`).join('')}</div>`;
  else if(S.pop==='ps-forme')h=`<div class="pt-pop ps-pop" role="menu" aria-label="Forme" style="${pozPop(win,G[4],250)}">${galerie(P,S)}<div class="pt-gn">Forme</div>${STIL.replace('ps-stil','ps-stil" style="flex-direction:row;margin:4px 0 0')}</div>`;
  if(S.meniu==='editare'){const mb=win.querySelector('.pt-mb [data-v="editare"]'),wr=win.getBoundingClientRect(),br=mb?mb.getBoundingClientRect():null,x=br?Math.round(br.left-wr.left-win.clientLeft):60,y=br?Math.round(br.bottom-wr.top-win.clientTop+2):34;
    h+=`<div class="pt-menu" role="menu" aria-label="Editare" style="left:${Math.max(4,Math.min(x,(win.clientWidth||600)-256))}px;top:${y}px">
      <button type="button" role="menuitem" data-act="ps:ed" data-v="decupare"><span>Decupare</span><span class="sc">Ctrl+X</span></button>
      <button type="button" role="menuitem" data-act="ps:ed" data-v="copiere"><span>Copiere</span><span class="sc">Ctrl+C</span></button>
      <button type="button" role="menuitem" data-act="ps:ed" data-v="lipire"><span>Lipire</span><span class="sc">Ctrl+V</span></button></div>`}
  if(h)win.insertAdjacentHTML('beforeend',h);
  const mbE=win.querySelector('.pt-mb [data-v="editare"]');if(mbE){mbE.classList.toggle('on',S.meniu==='editare');mbE.setAttribute('aria-haspopup','menu');mbE.setAttribute('aria-expanded',String(S.meniu==='editare'))}
}
const CU_DIM=['creion','pensula','radiera'];
function dimensiune(win,S,P){const w=win.querySelector('.pt-wrap');if(!w)return;
  if(!CU_DIM.includes(S.unealta)){w.classList.remove('ps-cudim');return}
  w.classList.add('ps-cudim');const v=P.dim[S.unealta];
  w.insertAdjacentHTML('afterbegin',`<div class="ps-dimp" data-z="panza"><span class="ic">${S.unealta==='radiera'?'Radieră':S.unealta==='creion'?'Creion':'Pensule'}</span><input type="range" class="ps-dim" min="1" max="${DIMMAX}" step="1" value="${v}" aria-label="Dimensiune" title="Dimensiune"><span class="v">${v}px</span></div>`)}
function stareSel(win,P){const sb=win.querySelector('.pt-sb');if(!sb)return;const sp=sb.children[1];
  const h=P.sel?`<span title="Mărimea selecției">⬚ ${Math.round(P.sel.r[2])} × ${Math.round(P.sel.r[3])}px</span>`:'';if(h&&sp)sp.insertAdjacentHTML('beforebegin',h)}
function overlay(svg,S,P,extra){let h='';const sc=svg.getBoundingClientRect().width/S.w||0.6,m=8/sc;
  if(P.sel){const r=P.sel.r;
    if(P.sel.poli)h+=`<polygon points="${pstr(P.sel.poli)}" fill="none" stroke="#444" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`;
    h+=`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="none" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke"/><rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="none" stroke="#222" stroke-width="1" stroke-dasharray="5 4" vector-effect="non-scaling-stroke" data-sel="1"/>`;
    [[0,0],[.5,0],[1,0],[0,.5],[1,.5],[0,1],[.5,1],[1,1]].forEach(([a,b])=>{h+=`<rect x="${r[0]+a*r[2]-m/2}" y="${r[1]+b*r[3]-m/2}" width="${m}" height="${m}" fill="#fff" stroke="#444" stroke-width="1" vector-effect="non-scaling-stroke"/>`})}
  if(P.previz&&CU_DIM.includes(S.unealta)){const d=P.dim[S.unealta];h+=`<circle cx="${S.w/2}" cy="${S.h/2}" r="${Math.max(1,d/2)}" fill="${S.unealta==='radiera'?'#fff':'#000'}" stroke="#888" stroke-width="1" vector-effect="non-scaling-stroke"/>`}
  return h+(extra||'')}
function pinteaza(inst,S,P,lista,extra){const svg=inst.body.querySelector('.pt-svg');if(!svg)return;svg.classList.add('ps-svg');
  svg.innerHTML=randeaza(lista||S.desen,{pref:inst.pref})+overlay(svg,S,P,extra)}
function modelHtml(Q){const m=Q.ps&&Q.ps.model;if(!m||!PS.DESENE[m])return '';
  return `<div class="pt-panou ps-model"><div class="lbl">Modelul (desenul la care trebuie să ajungi)</div><svg viewBox="0 0 1038 648" role="img" aria-label="Modelul: desenul la care trebuie să ajungi">${randeaza(PS.DESENE[m],{pref:'psm'})}</svg></div>`}

function panou(c){const S=c.S,P=st(S,c.Q),inst=INST.get(c.Q);if(!inst)return modelHtml(c.Q);const win=inst.body.querySelector('.pt-win');if(!win)return '';
  if(P.sel&&(P.sel.desen!==S.desen||(P.sel.plut!=null&&P.sel.plut>=S.desen.length)))P.sel=null;
  if(!S.pornit){P.sel=null;return modelHtml(c.Q)}
  bara(win,S,P);popup(win,S,P);dimensiune(win,S,P);stareSel(win,P);pinteaza(inst,S,P);
  if(P.focus&&!S.dlg&&!S.intreb){const m=P.focus==='meniu'?win.querySelector('.pt-menu[aria-label="Editare"] button'):null;P.focus=false;(m||win).focus({preventScroll:true})}
  return modelHtml(c.Q)}

function actiune(a,v,c){const S=c.S,P=st(S,c.Q);
  if(!a.startsWith('ps:')){
    if(S.pop&&String(S.pop).startsWith('ps-'))S.pop=null;
    if(a==='meniu'&&v==='editare'){S.meniu=S.meniu==='editare'?null:'editare';S.sub=null;S.pop=null;c.msg('');if(S.meniu)c.ev('meniu',{m:'editare'});P.focus=S.meniu?'meniu':true;return true}
    if(S.meniu==='editare'&&!(a==='meniu'&&v==='fisier'))S.meniu=null;
    if(a==='meniu'&&v==='fisier'&&S.meniu==='editare')S.meniu=null;
    if(a==='unealta'&&v==='radiera'){c.msg('');alege(S,P,'radiera',c);return true}
    if(a==='unealta'){P.sel=null;P.focus=true}
    if(a==='undo'||a==='redo'){P.sel=null;if(a==='undo'&&S.desen.length)c.ev('anulat',{})}
    if(a==='grup'&&v==='forme'){S.pop=S.pop==='ps-forme'?null:'ps-forme';S.meniu=null;return true}
    return false}
  c.msg('');
  switch(a){
    case 'ps:unealta':alege(S,P,v,c);break;
    case 'ps:pop':S.pop=S.pop===v?null:v;S.meniu=null;break;
    case 'ps:selmod':P.selMod=v==='libera'?'libera':'dreptunghi';alege(S,P,'selectie',c);break;
    case 'ps:tot':tot(S,P,c);break;
    case 'ps:stergere':S.pop=null;stergeSel(S,P,c);break;
    case 'ps:nu':S.pop=null;c.msg(v==='inversare'?'<b>Inversare selecție</b>: n-o folosim azi.':'<b>Selecție transparentă</b>: n-o folosim azi. Fără ea, bucata selectată acoperă ce e sub ea.');break;
    case 'ps:pensula':P.tip=v;alege(S,P,'pensula',c);break;
    case 'ps:forma':{const f=FORME.find(x=>x.id===v);if(f&&f.nu){S.pop=null;c.msg(`<b>${E(f.nume)}</b>: ${E(f.nu)}. Azi alege altă formă.`)}else{P.fel=v;alege(S,P,'forma',c)}break}
    case 'ps:stil':S.pop=null;c.msg('<b>Contur formă</b> și <b>Umplere formă</b> le înveți la lecția 21. Azi formele ies cu contur negru, fără umplere.');break;
    case 'ps:ed':S.meniu=null;if(v==='copiere')copiaza(S,P,c);else if(v==='decupare')decupeaza(S,P,c);else lipeste(S,P,c);break;
  }
  P.focus=true;return true}

/* ---- gesturile (ascultătorii mei, după cei din paint.js) ---- */
function leaga(Q,body){
  const inst=INST.get(Q),win=body.querySelector('.pt-win'),root=body.querySelector('.pt');if(!win||!root)return;
  const nota=root.querySelector('.pt-nota'),rb=nota&&nota.querySelector('[data-reset]');
  if(nota&&rb&&!Q.explorare){nota.innerHTML=NOTA;nota.appendChild(document.createTextNode(' '));nota.appendChild(rb)}
  const sim=()=>body._sim,S=()=>sim().stare(),P=()=>st(S(),Q);
  const redraw=ops=>sim().run(ops||[]);
  const pct=(svg,e)=>{const r=svg.getBoundingClientRect(),s=S();return [Math.max(0,Math.min(s.w,Math.round((e.clientX-r.left)/r.width*s.w))),Math.max(0,Math.min(s.h,Math.round((e.clientY-r.top)/r.height*s.h)))]};
  const UNE=['creion','pensula','radiera','forma','selectie'];
  let pre=null;
  win.addEventListener('pointerdown',()=>{const s=S();pre={meniu:s.meniu,pop:s.pop}},true);
  win.addEventListener('pointerdown',e=>{
    inst.drag=null;const svg=e.target.closest('.pt-svg'),s=S();if(!svg||Q.explorare||s.dlg||s.intreb||!s.pornit)return;
    if(pre&&(pre.meniu||pre.pop))return;
    if(!UNE.includes(s.unealta))return;
    const p=P(),a=pct(svg,e);
    if(s.unealta!=='selectie'&&p.sel){p.sel=null}
    const mod=s.unealta==='selectie'?(p.sel&&inR(a,p.sel.r)?'muta':'nou'):'desen';
    inst.drag={u:s.unealta,pts:[a],shift:e.shiftKey,mod,svg,bloc:null};
    pinteaza(inst,s,p);
  });
  win.addEventListener('pointermove',e=>{const D=inst.drag;if(!D)return;const s=S(),p=P(),q=pct(D.svg,e),l=D.pts[D.pts.length-1];D.shift=e.shiftKey;
    if(Math.hypot(q[0]-l[0],q[1]-l[1])>=2)D.pts.push(q);else if(D.u!=='forma'&&D.mod!=='muta'&&D.mod!=='nou')return;
    const a=D.pts[0],z=q;let lista=s.desen,extra='';
    if(D.u==='forma'){let b=z;if(D.shift)b=cuShift(p.fel,a,b);lista=s.desen.concat([{u:'forma|'+p.fel+'|'+p.dim.forma,p:[a,b]}])}
    else if(D.u==='pensula')lista=s.desen.concat([{u:'pensula|'+p.tip+'|'+p.dim.pensula,p:D.pts}]);
    else if(D.u==='radiera')lista=s.desen.concat([{u:'radiera|'+p.dim.radiera,p:D.pts}]);
    else if(D.u==='creion')lista=s.desen.concat([{u:p.dim.creion===DIM0.creion?'creion':'creion|'+p.dim.creion,p:D.pts}]);
    else if(D.mod==='muta'&&p.sel){const dx=z[0]-a[0],dy=z[1]-a[1],ult=s.desen.length-1,it=s.desen[ult];
      if(p.sel.plut===ult&&it&&/^(bloc|muta)\|/.test(it.u)){lista=s.desen.slice(0,ult).concat([{u:it.u,p:[[it.p[0][0]+dx,it.p[0][1]+dy]]}])}
      else{if(D.bloc==null)D.bloc=nouBloc(s.desen,p.sel);lista=s.desen.concat([{u:'muta|'+D.bloc,p:[[p.sel.r[0]+dx,p.sel.r[1]+dy]]}])}
      const r=p.sel.r;extra=`<rect x="${r[0]+dx}" y="${r[1]+dy}" width="${r[2]}" height="${r[3]}" fill="none" stroke="#222" stroke-width="1" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`;
      const sel0=p.sel;p.sel=null;pinteaza(inst,s,p,lista,extra);p.sel=sel0;return}
    else if(D.mod==='nou'){if(p.selMod==='libera')extra=`<polyline points="${pstr(D.pts)}" fill="none" stroke="#222" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`;
      else{const r=rectDin(a,z);extra=`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="none" stroke="#222" stroke-width="1" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`}
      const sel0=p.sel;p.sel=null;pinteaza(inst,s,p,lista,extra);p.sel=sel0;return}
    pinteaza(inst,s,p,lista,extra)});
  const gataMeu=()=>{inst.drag=null};
  win.addEventListener('pointerup',gataMeu);win.addEventListener('pointercancel',gataMeu);
  /* cursorul Dimensiune */
  win.addEventListener('input',e=>{if(!e.target.classList||!e.target.classList.contains('ps-dim'))return;const s=S(),p=P(),v=+e.target.value;p.dim[s.unealta]=v;p.previz=1;
    const l=e.target.parentNode.querySelector('.v');if(l)l.textContent=v+'px';pinteaza(inst,s,p)});
  win.addEventListener('change',e=>{if(!e.target.classList||!e.target.classList.contains('ps-dim'))return;const s=S(),p=P();p.previz=0;
    s.ev.push({tip:'dimensiune',u:s.unealta,v:p.dim[s.unealta]});pinteaza(inst,s,p);win.focus({preventScroll:true})});
  /* tastele: în Paint-ul din pagină (focus în fereastră) și, ca la Ctrl+S în paint.js, când focusul nu e în nicio casetă de scris */
  const taste=(e,dinAfara)=>{const s=S();if(!s.pornit||s.dlg||s.intreb||Q.explorare)return false;
    const k=String(e.key),kl=k.toLowerCase();
    if(e.ctrlKey&&!e.altKey&&!e.metaKey&&!e.shiftKey){
      const m={c:'copiaza',x:'decupeaza',v:'lipeste',a:'tot'}[kl];
      if(m&&dinAfara&&((m!=='lipeste'&&m!=='tot'&&!P().sel)||(m==='lipeste'&&P().clip==null)))return false;   /* din afara Paint-ului: tacut, ca Paint-ul cand n-are ce face */
      if(m){e.preventDefault();s.meniu=null;s.pop=null;redraw([[m]]);if(!s.dlg)win.focus({preventScroll:true});return true}
      if(kl==='z'||kl==='y'){P().sel=null;if(kl==='z'&&s.desen.length)s.ev.push({tip:'anulat'});if(dinAfara){e.preventDefault();redraw([['ctrl',kl]]);win.focus({preventScroll:true});return true}return false}
    }
    if(k==='Delete'&&!e.ctrlKey&&!e.altKey){if(dinAfara&&!P().sel)return false;e.preventDefault();redraw([['sterge']]);win.focus({preventScroll:true});return true}
    if(k==='Escape'&&P().sel&&!s.meniu&&!s.pop){e.preventDefault();P().sel=null;redraw();return true}
    return false};
  win.addEventListener('keydown',e=>{const t=e.target;if(t&&t.tagName==='INPUT'&&!t.classList.contains('ps-dim'))return;if(t&&(t.tagName==='SELECT'||t.tagName==='TEXTAREA'))return;taste(e,false)});
  const doc=e=>{
    if(!document.body.contains(root)){document.removeEventListener('keydown',doc,true);return}
    const t=e.target;if(root.contains(t))return;
    if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||'')))return;
    if(t&&t.closest&&t.closest('.pt'))return;
    if(!root.offsetParent)return;
    if(!ULTIM.inPaint)return;   /* J1-E: ultimul clic a fost pe textul lecției (sau încă niciunul): tastele rămân ale browserului */
    if(document.querySelectorAll('.pt').length>1&&ULTIM.el!==root)return;
    taste(e,true)};
  document.addEventListener('keydown',doc,true);
  root.addEventListener('pointerdown',()=>{ULTIM.el=root},true);
}
/* ULTIM.inPaint: ultimul pointerdown din pagină a fost într-un Paint din pagină (.pt) sau pe Verifică (#chk, după care focusul
   se întoarce în Paint — regula 14). Un singur ascultător pe document, pus o dată. */
const ULTIM={el:null,inPaint:false};
document.addEventListener('pointerdown',e=>{const t=e.target;ULTIM.inPaint=!!(t&&t.closest&&(t.closest('.pt')||t.closest('#chk')))},true);
const NOTA='Un Paint mic, desenat în pagină, după Paint-ul din Windows 11. Aici desenezi cu negru: Creion, Pensule, Radieră, Forme; merg selecția, meniul <b>Editare</b> și tastele <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>X</kbd>, <kbd>V</kbd>, <kbd>Z</kbd>, <kbd>S</kbd> și <kbd>Delete</kbd>. Culorile, textul și grupul Imagine îți spun la ce lecție le înveți. Pentru <b>Nou</b> folosești meniul <b>Fișier</b>. Pe telefon: meniul <b>Editare</b>, săgeata de sub <b>Selectare</b> și săgeata ↶ (Anulați).';

const EXT={
  unelte:['creion','pensula','radiera','forma','selectie'].map(id=>({id,nume:id,grup:'',lectie:19,deseneaza(S,tr,c){const inst=INST.get(c.Q),D=inst&&inst.drag;return gest(S,st(S,c.Q),c,id,tr.p,D?{shift:D.shift,bloc:D.bloc}:{})}})),
  verifica, op, actiune, panou
};
function creeaza(alte){
  const baza=PS.creeaza({extensii:[EXT].concat(alte||[])});
  return {
    render(Q,body,api){css();const inst={body,pref:'ps'+(++NR)+'_',drag:null};INST.set(Q,inst);baza.render(Q,body,api);leaga(Q,body)},
    rezolva(Q,body,api){return baza.rezolva(Q,body,api)},
    gresit(Q,body,api){return baza.gresit(Q,body,api)}
  };
}
window.PaintSelectie={versiune:1,ext:EXT,creeaza,randeaza,parse,scena,BLOCURI,FORME,PENSULE,DIM0,DESENE:DESENE_NOI};
window.SimPaintSel=creeaza();
})();
