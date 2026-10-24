/* Extensia „paint-culori” pentru simulatorul Paint din lecții (lectii/_sim/paint-culori.js).
   PROPRIETAR: autorul lecției V · M3 · nr. 21 („Culori și stiluri de umplere. Culori personalizate”), 24.10.2026.
   Se încarcă DUPĂ paint.js (V/18) și paint-selectie.js (V/19), pe care NU le modifică:
     <script src="../../_sim/paint.js"></script><script src="../../_sim/paint-selectie.js"></script><script src="../../_sim/paint-culori.js"></script>
     JocMotor.porneste({ …, tipuri:{paintw:SimPaintCul} })
   O lecție următoare: const SimX=PaintCulori.creeaza([extensiaTa]); (lanțul: paint-selectie → paint-culori → a ta).

   CE ADAUGĂ: grupul Culori (Culoare 1 / Culoare 2, paleta, rândul culorilor tale, Editare culori), desenul cu Culoare 1 (Creion,
   Pensule, conturul formelor), Umplere (găleata) — umplere pe PIXELI a zonei de aceeași culoare, pe pânza desenată în memorie —,
   Selector de culoare (pipeta), Contur formă / Umplere formă (Fără contur, Contur compact / Fără umplere, Umplere solidă = Culoare 2),
   fereastra Editare culori (spectrul, cursorul de luminozitate, codul #, Roșu / Verde / Albastru, Culori de bază, Culori particularizate, +).

   FIDELITATE (Paint 11.2605 din Windows 11, în română; Paint NU a fost pornit — aplicație din Magazin):
   DIN CAPTURI REALE (jocuri/grafica-v/img, Paint RO, 20.09.2026):
     · culoare-1-2.webp: în grupul Culori, două cercuri — sus Culoare 1 (cu inel = cel ales), jos Culoare 2 —, paleta de 20 de culori
       (2 rânduri × 10; culorile de mai jos sunt citite din pixelii capturii), un al treilea rând de cercuri goale și butonul
       Editare culori (cercul curcubeu cu +);
     · editare-culori.webp: fereastra „Editare culori”: pătratul colorat (nuanța pe orizontală, spre alb în jos), o bară verticală
       (de la culoare la negru = luminozitatea), previzualizarea, codul „#B5E61D”, lista „RGB”, câmpurile Roșu / Verde / Albastru,
       „Culori de bază” (4 × 12, culorile citite din captură), „Culori particularizate” cu „+”, OK / Anulare;
     · pipeta-stil.webp: Selector de culoare în grupul Instrumente; Contur formă (sus) și Umplere formă (jos), cu ⌄, în dreapta
       formelor — gri (par neapăsabile) cât nu e aleasă o formă;
     · desen-forme.webp: forme umplute cu culoare (Umplere).
   DIN RESURSE (lectii/v/m3-l18/_proba/pri_ro.txt; perechile EN din pri_main.txt): Culori, Culoare 1: {0}, Culoare 2: {0}, Umplere,
     Umplere cu culoare, Selector de culoare, Culoare preluată cu succes, Editare culori, Culori de bază, Culori particularizate,
     Adăugați o culoare, Culoare adăugată, Contur formă, Umplere formă, Fără contur (No outline), Contur compact (Solid outline),
     Fără umplere (No fill), Umplere solidă (Solid fill).
   DIN DOCUMENTAȚIA MICROSOFT: microsoft.com/windows/paint — „Fill with color: To fill closed areas with a selected color”;
     „Create a new color or use hexadecimal, RGB, or HSV color codes”; Windows Insider Blog 30.11.2021 — fereastra Edit Color nouă;
     „Shift-click on a color swatch will now select that color as your secondary color” (Shift+clic = Culoare 2).
   PRESUPUS (convenția Paint-ului clasic + jocul grafica-v; de fotografiat — lectii/v/m3-l21/capturi_lipsa.json):
     · un clic pe cercul Culoare 2 îl alege (inelul trece la el), iar următoarea culoare din paletă merge acolo, până alegi iar Culoare 1;
     · Creionul, Pensulele, conturul formelor, găleata folosesc Culoare 1; Umplere solidă folosește Culoare 2;
     · pipeta pune culoarea în Culoare 1 (aici rămâne aleasă pipeta după clic; Paint-ul clasic se întorcea la instrumentul de dinainte);
     · OK în Editare culori pune culoarea în cercul ales și în rândul de jos al paletei; „+” o pune în Culori particularizate;
     · toleranța umplerii (aici: diferență ≤ 32 pe fiecare canal, 4 vecini) — Paint umple doar pixelii de aceeași culoare;
     · Contur formă / Umplere formă se apasă doar cu o formă aleasă; „Fără contur” + „Fără umplere” n-o permitem (forma n-ar avea
       nimic de arătat; nefotografiat — capturi_lipsa L11);
     · dacă Paint păstrează culorile tale după închidere (pentru clasa următoare): NEȘTIUT.
   (reparațiile după judecata 1, 24.10.2026 — registrul lectii/v/m3-l21/_verificare/registru_j1.md)
     · forma abia desenată rămâne ACTIVĂ (resursele: „Apăsați CTRL + bara de spațiu pentru a aplica la planșă”, „Culoare de contur
       modificată”, „Culoare de umplere modificată”): Culoare 1 / 2 și stilul alese imediat după desen o schimbă și pe ea; un clic pe
       pânză, alt instrument, altă formă, Salvare / Deschidere / Nou o „lasă” pe pânză (PRESUPUS, L10);
     · clic DREAPTA pe pânză (convenția Paint-ului clasic, PRESUPUS, L12): găleata umple cu Culoare 2, pipeta pune culoarea în
       Culoare 2, Creionul / Pensulele desenează cu Culoare 2, forma are conturul Culoare 2 și interiorul (la Umplere solidă) Culoare 1;
       meniul browserului nu apare pe pânză;
     · Editare culori pornită de la negru: un clic în pătrat schimbă nuanța, dar culoarea rămâne neagră până urci bara (bara stă jos;
       PRESUPUS, L9) — înainte de 24.10 bara urca singură.
   ABATERI, spuse pe ecran sau în lecție: „Alte stiluri” de contur / umplere (ca pensulele) nu se folosesc azi; lista RGB nu trece pe
     HSV; numele culorii nu apare la trecerea mouse-ului; previzualizarea formei / liniei cât tragi se recolorează aici; sub cercuri
     scrie „Culoare 1” / „Culoare 2”, iar pe butoanele de stil scrie „Contur formă” / „Umplere formă” (pe telefon nu există „ține
     mouse-ul pe el”); pe un ecran îngust paleta e pe mai multe rânduri; Culori particularizate are 12 locuri.

   API (pentru lecțiile următoare; NU schimba fără să treci în granița ta, m3_noapte_23_10/granite/v_l21.md):
   window.PaintCulori = {versiune:2, ext, creeaza(alte?), PALETA, BAZA, familie(hex), grup(hex), raster(S), pixel(S,[x,y]), FILL,
     DESENE, hsv, dinHsv, curs(S,a,b)}   (versiune 2 = 24.10.2026: forma activă, clic dreapta, testul separat, curs(); nimic scos;
     reparația 2, tot 24.10: câmpul umplut.iesit și avertismentul despre gaură doar pentru un clic ÎNĂUNTRUL unei forme — aditiv)
   window.SimPaintCul = PaintCulori.creeaza()
   Starea: S.pc = {c1, c2, activ:1|2, contur:'solid'|'fara', umplere:'fara'|'solid', pers:[hex…], facute:[hex…] (din Editare culori, OK),
     dlg:null|{h,s,v}, activa:traseu|null (forma abia desenată), dreapta:bool (ultimul gest pe pânză, cu butonul drept)};
     Q.pc (opțional) = {c1, c2, activ, contur, umplere, pers}. Extensia ține S.ps.c1 / S.ps.umplere (V/19) la zi.
   Traseu nou: 'umplere|<nr>|c=<hex>' cu p=[[x+nr·1e-7, y]] (clicul găleții). Masca se socotește O DATĂ, la clic, pe pânza de atunci
     (PaintCulori.FILL[nr]); randeaza-ul V/19 îl desenează ca un punct (cerc r=1.5), pe care extensia îl înlocuiește la loc cu imaginea
     umplerii (aceeași ordine a traseelor; merge și în bucăți copiate / mutate și în „Modelul”).
   Evenimente (S.ev și 'paint-sim'): culoare {nr, hex, din:'paleta'|'pipeta'|'editare'} · umplut {hex, margine, iesit, nr} · stil {ce, v} ·
     editare {deschis|ok|anulat}. (umplut: margine = umplerea a atins marginea pânzei; iesit = clicul era ÎNĂUNTRUL unei forme închise
     și umplerea a ieșit din ea — numai atunci apare avertismentul despre gaură; câmpul iesit e nou din 24.10, judecata 2, Y)
   Teste (checks[].k): culoare{nr, fam?|grup?|hex?} · pixel{la:[x,y], fam?|grup?|hex?|ca?:[x,y]|difera?:[x,y]|personal?} ·
     linieCul{tip?, fam?|grup?, dimMin?} · formaCul{fel?, contur?:fam|grup|'oricare', umplere?:fam|grup|'oricare'|'fara', faraContur?} ·
     personal{fam?, inchis?, folosit?} · separat{la:[x,y], de:[x,y]} (la e colorat și culoarea lui NU vine dintr-o singură umplere
     care a acoperit și punctul de — „culoarea n-a trecut prin gaură”; PaintCulori.curs(S,la,de) = invers)
     (fam: negru, alb, gri, rosu, roz, portocaliu, maro, galben, verde, albastru, violet;
     grup: calde = roșu, roz, portocaliu, maro, galben; reci = verde, albastru, violet).
   Operații (sol / gresit): ['culoare',hex|nume,nr?] · ['activ',1|2] · ['umple',x,y] · ['pipeta',x,y] · ['contur','solid'|'fara'] ·
     ['umplereForma','solid'|'fara'] · ['editare',hex,plus?] (deschide, alege, OK). Uneltele: ['unealta','umplere'|'pipeta'] (V/19). */
(function(){
'use strict';
const PS=window.PaintSim,PSel=window.PaintSelectie;
if(!PS||!PSel||!PSel.creeaza){if(window.console)console.error('paint-culori.js: încarcă întâi ../../_sim/paint.js și ../../_sim/paint-selectie.js');return}
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SVGNS='http://www.w3.org/2000/svg';

/* ---- culorile: paleta (culoare-1-2.webp: 2 rânduri × 10) și „Culori de bază” (editare-culori.webp: 4 × 12), citite din pixeli ---- */
const PALETA=[['#000000','Negru'],['#7f7f7f','Gri'],['#880015','Roșu închis'],['#ed1c24','Roșu'],['#ff7f27','Portocaliu'],['#fff200','Galben'],['#22b14c','Verde'],['#00a2e8','Albastru'],['#3f48cc','Indigo'],['#a349a4','Violet'],
  ['#ffffff','Alb'],['#c3c3c3','Gri deschis'],['#b97a57','Maro'],['#ffaec9','Roz'],['#ffc90e','Auriu'],['#efe4b0','Galben deschis'],['#b5e61d','Verde gălbui'],['#99d9ea','Turcoaz deschis'],['#7092be','Albastru-gri'],['#c8bfe7','Lavandă']];
const BAZA=['#f78685','#ec3324','#774343','#91403b','#380605','#a0fefe','#76fcfe','#2e87f6','#0424f4','#00129b','#17427c','#010c83',
  '#ffff91','#fffb57','#ef9c5d','#f08850','#784511','#7f8025','#7e84f6','#702df8','#3582bf','#00023b','#581260','#3b073d',
  '#a1fb91','#a2f94f','#76fa4e','#77fb66','#77fb8f','#82824b','#ed8abe','#ee8cf8','#ec3ff4','#e93781','#8383ba','#75153f',
  '#387e22','#3b7e4a','#367e81','#4d7f80','#193f0b','#15403f','#751d7d','#38137b','#010103','#818181','#c0c0c0','#ffffff'];
const NR_PERS=12;
const hexN=h=>{h=String(h||'').trim().toLowerCase();if(/^#?[0-9a-f]{6}$/.test(h))return h[0]==='#'?h:'#'+h;if(/^#?[0-9a-f]{3}$/.test(h)){h=h.replace('#','');return '#'+h.split('').map(c=>c+c).join('')}
  const p=PALETA.find(x=>x[1].toLowerCase()===h);return p?p[0]:null};
const rgbDin=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const hexDin=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
function hsv(h){const [r,g,b]=rgbDin(h).map(v=>v/255),M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let H=0;
  if(d){H=M===r?60*(((g-b)/d)%6):M===g?60*((b-r)/d+2):60*((r-g)/d+4)}if(H<0)H+=360;return {h:H,s:M?d/M:0,v:M}}
function dinHsv(H,s,v){const c=v*s,x=c*(1-Math.abs((H/60)%2-1)),m=v-c;let r=0,g=0,b=0;
  if(H<60){r=c;g=x}else if(H<120){r=x;g=c}else if(H<180){g=c;b=x}else if(H<240){g=x;b=c}else if(H<300){r=x;b=c}else{r=c;b=x}
  return hexDin((r+m)*255,(g+m)*255,(b+m)*255)}
function familie(hex){const {h,s,v}=hsv(hex);
  if(v<.18)return 'negru';if(s<.18)return v>.9?'alb':'gri';
  if(h>=330||h<15)return (s<.5&&v>.75)?'roz':'rosu';
  if(h<45)return (v<.8&&s>.35)?'maro':'portocaliu';
  if(h<70)return 'galben';if(h<165)return 'verde';if(h<250)return 'albastru';
  return (h>=300&&s<.5&&v>.75)?'roz':'violet'}
const CALDE=['rosu','roz','portocaliu','maro','galben'],RECI=['verde','albastru','violet'];
const grup=hex=>{const f=familie(hex);return CALDE.includes(f)?'calde':RECI.includes(f)?'reci':''};
const potriveste=(hex,cer)=>{if(!hex)return false;if(cer==null||cer==='oricare')return true;const L=[].concat(cer);
  return L.some(x=>x==='calde'||x==='reci'?grup(hex)===x:/^#/.test(x)?hexN(x)===hexN(hex):familie(hex)===x)};
const inPaleta=h=>PALETA.some(p=>p[0]===hexN(h));
function numeCul(h){h=hexN(h);const p=PALETA.find(x=>x[0]===h);return p?p[1]:'culoarea ta ('+h.toUpperCase()+')'}

/* ---- pânza în memorie (canvas): aceleași trasee ca randeaza-ul V/19, desenate pe pixeli ---- */
const FILL={};let NRF=0;
function serialDin(u){const m=String(u).split('|');return +m[1]||0}
function semnPunct(cx){const v=parseFloat(cx);if(!isFinite(v))return 0;const f=(v-Math.floor(v))*1e7,n=Math.round(f);return n>0&&Math.abs(f-n)<.05?n:0}
function linieC(x,P,w,o){o=o||{};x.save();x.globalAlpha=o.op||1;x.strokeStyle=o.c||'#000';x.fillStyle=o.c||'#000';x.lineWidth=w;x.lineCap=o.cap||'round';x.lineJoin='round';
  if(P.length===1){x.beginPath();x.arc(P[0][0],P[0][1],Math.max(1.5,w/2),0,Math.PI*2);x.fill();x.restore();return}
  if(o.da)x.setLineDash(o.da);x.beginPath();x.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)x.lineTo(P[i][0],P[i][1]);x.stroke();x.restore()}
function poli(x,P){x.beginPath();x.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)x.lineTo(P[i][0],P[i][1]);x.closePath()}
function trasaturaC(x,o,s){const P=s.p,c=o.c||'#000';
  if(o.t==='creion'){if(o.simplu&&!o.c){if(P.length===1){x.fillStyle='#000';x.beginPath();x.arc(P[0][0],P[0][1],3,0,Math.PI*2);x.fill()}else linieC(x,P,2)}else linieC(x,P,o.simplu?2:o.dim,{c});return}
  if(o.t==='radiera'){if(P.length===1){x.fillStyle='#fff';x.fillRect(P[0][0]-o.dim/2,P[0][1]-o.dim/2,o.dim,o.dim)}else linieC(x,P,o.dim,{c:'#fff',cap:'square'});return}
  if(o.t==='pensula'){if(o.simplu){if(P.length===1){x.fillStyle=c;x.beginPath();x.arc(P[0][0],P[0][1],7,0,Math.PI*2);x.fill()}else linieC(x,P,6,{c})}else{const d=o.dim;
    switch(o.tip){
      case 'caligrafica':case 'stilou':{const k=o.tip==='stilou'?.6:1,n=5;for(let i=0;i<n;i++){const t=(i/(n-1)-.5)*d*k*.8;linieC(x,P.map(q=>[q[0]+t*.7,q[1]-t*.7]),Math.max(1,d*k*.22),{cap:'butt',c})}break}
      case 'aerograf':[[0,0],[d*.25,-d*.2],[-d*.22,d*.18],[d*.12,d*.28]].forEach(([a,b])=>linieC(x,P.map(q=>[q[0]+a,q[1]+b]),Math.max(1,d*.16),{da:[0,Math.max(2,d*.45)],c}));break;
      case 'ulei':linieC(x,P,d,{op:.75,c});linieC(x,P.map(q=>[q[0]+d*.15,q[1]+d*.1]),d*.45,{op:.5,c});break;
      case 'marker':linieC(x,P,d,{cap:'square',op:.55,c});break;
      case 'natural':linieC(x,P,Math.max(1.2,d*.35),{op:.8,da:[3,1],c});break;
      case 'acuarela':linieC(x,P,d*1.3,{op:.3,c});break;
      default:linieC(x,P,d,{c})}}return}
  if(o.t==='forma'){const sc=PSel.scena([{u:o.fel?('forma|'+o.fel+'|'+o.dim):s.u,p:P}]),I=sc[0];if(!I||!I.pts.length)return;
    if(o.fel==='linie'){linieC(x,I.pts,o.dim,{c});return}
    x.save();poli(x,I.pts);if(o.f){x.fillStyle=o.f;x.fill()}x.strokeStyle=c;x.lineWidth=o.dim;x.lineJoin='round';x.stroke();x.restore();return}
  if(o.t==='umplere')return;
  /* tip necunoscut: ca randeaza-ul V/19 (o linie subțire neagră) */
  linieC(x,P,1.6);
}
function regiuneC(x,f){x.fillStyle='#fff';if(f.p){poli(x,f.p);x.fill()}else x.fillRect(f.r[0],f.r[1],f.r[2],f.r[3])}
function deseneazaLista(x,L,ad,w,h){
  for(let k=0;k<(L||[]).length;k++){const s=L[k],o=PSel.parse(s.u);
    if(o.t==='alb'){x.fillStyle='#fff';if(o.fel==='p'){poli(x,s.p);x.fill()}else{const a=s.p[0],b=s.p[1];x.fillRect(Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))}continue}
    if(o.t==='bloc'||o.t==='muta'){const B=PSel.BLOCURI[o.id];if(!B)continue;const r=B.f.r,T=s.p[0],dx=T[0]-r[0],dy=T[1]-r[1];
      if(o.t==='muta')regiuneC(x,B.f);
      x.save();x.translate(dx,dy);x.beginPath();if(B.f.p){poli(x,B.f.p)}else x.rect(r[0],r[1],r[2],r[3]);x.clip();regiuneC(x,B.f);deseneazaLista(x,B.desen,ad+1,w,h);x.restore();continue}
    if(o.t==='umplere'){const n=serialDin(s.u);let F=FILL[n];
      if(!F){const P=s.p[0],sx=Math.floor(P[0]),sy=Math.round(P[1]);
        if(ad===0)F=calcUmplere(x.getImageData(0,0,w,h),w,h,sx,sy,hexN(o.c)||'#000000');
        else{const R=rasterLista(L.slice(0,k),w,h);F=calcUmplere(R.x.getImageData(0,0,w,h),w,h,sx,sy,hexN(o.c)||'#000000')}
        FILL[n]=F||{gol:true}}
      if(F&&!F.gol)x.drawImage(F.cv,F.bx,F.by);continue}
    trasaturaC(x,o,s)}
}
function rasterLista(L,w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d',{willReadFrequently:true});x.fillStyle='#fff';x.fillRect(0,0,w,h);deseneazaLista(x,L,0,w,h);return {cv,x}}
function semn(L,w,h){let a=2166136261>>>0;const add=v=>{a^=v;a=Math.imul(a,16777619)>>>0};add(w);add(h);
  (L||[]).forEach(s=>{const u=String(s.u);for(let i=0;i<u.length;i++)add(u.charCodeAt(i));(s.p||[]).forEach(q=>{add(Math.round(q[0]*1e3));add(Math.round(q[1]*1e3))});add(0x2f)});return (L||[]).length+':'+a}
const CACHE=[];
function raster(S){const w=S.w||1038,h=S.h||648,k=semn(S.desen,w,h);let R=CACHE.find(c=>c.k===k);
  if(!R){const r=rasterLista(S.desen,w,h);R={k,w,h,cv:r.cv,d:r.x.getImageData(0,0,w,h).data};CACHE.unshift(R);if(CACHE.length>3)CACHE.pop()}return R}
function pixel(S,pt){const R=raster(S),x=Math.max(0,Math.min(R.w-1,Math.round(pt[0]))),y=Math.max(0,Math.min(R.h-1,Math.round(pt[1]))),i=(y*R.w+x)*4;return hexDin(R.d[i],R.d[i+1],R.d[i+2])}
/* umplerea: zona de 4 vecini cu aceeași culoare (toleranță 32 pe canal) în jurul clicului; întoarce null dacă nu s-ar schimba nimic */
const TOL=32;
function calcUmplere(img,w,h,sx,sy,hex){sx=Math.max(0,Math.min(w-1,sx));sy=Math.max(0,Math.min(h-1,sy));const d=img.data,i0=(sy*w+sx)*4,r0=d[i0],g0=d[i0+1],b0=d[i0+2],[R,G,B]=rgbDin(hex);
  if(r0===R&&g0===G&&b0===B)return null;
  const m=new Uint8Array(w*h),st=new Int32Array(w*h);let top=0,n=0,x0=sx,x1=sx,y0=sy,y1=sy,marg=false;
  const ok=j=>{const k=j*4;return Math.abs(d[k]-r0)<=TOL&&Math.abs(d[k+1]-g0)<=TOL&&Math.abs(d[k+2]-b0)<=TOL};
  m[sy*w+sx]=1;st[top++]=sy*w+sx;
  while(top){const j=st[--top];n++;const x=j%w,y=(j-x)/w;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;if(x===0||y===0||x===w-1||y===h-1)marg=true;
    if(x>0&&!m[j-1]&&ok(j-1)){m[j-1]=1;st[top++]=j-1}if(x<w-1&&!m[j+1]&&ok(j+1)){m[j+1]=1;st[top++]=j+1}
    if(y>0&&!m[j-w]&&ok(j-w)){m[j-w]=1;st[top++]=j-w}if(y<h-1&&!m[j+w]&&ok(j+w)){m[j+w]=1;st[top++]=j+w}}
  const bw=x1-x0+1,bh=y1-y0+1,cv=document.createElement('canvas');cv.width=bw;cv.height=bh;const cx=cv.getContext('2d'),id=cx.createImageData(bw,bh),q=id.data,mm=new Uint8Array(bw*bh);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(m[y*w+x]){const j=(y-y0)*bw+(x-x0),k=j*4;mm[j]=1;q[k]=R;q[k+1]=G;q[k+2]=B;q[k+3]=255}}
  cx.putImageData(id,0,0);let url='';try{url=cv.toDataURL('image/png')}catch(e){}
  return {cv,bx:x0,by:y0,w:bw,h:bh,url,c:hex,n,margine:marg,mm}}   /* mm = masca (în dreptunghiul ei), pentru testul „separat” */
/* în SVG: punctul (cerc r=1.5) pe care randeaza-ul V/19 îl pune pentru 'umplere' devine imaginea umplerii, la același loc în ordine */
function asigura(n,liste,w,h){if(FILL[n])return FILL[n];
  for(const L of liste){const k=(L||[]).findIndex(s=>PSel.parse(s.u).t==='umplere'&&serialDin(s.u)===n);if(k<0)continue;
    rasterLista(L.slice(0,k+1),w,h);if(FILL[n])return FILL[n]}
  return null}
function inlocuieste(root,S){if(!root)return;const cs=root.querySelectorAll('circle[r="1.5"]');if(!cs.length)return;
  const w=(S&&S.w)||1038,h=(S&&S.h)||648;
  cs.forEach(ci=>{const n=semnPunct(ci.getAttribute('cx'));if(!n)return;
    const F=asigura(n,[S?S.desen:[]].concat(Object.keys(PS.DESENE||{}).map(k=>PS.DESENE[k]),PSel.BLOCURI.map(B=>B&&B.desen)),w,h);
    if(!F||F.gol||!F.url){ci.remove();return}
    const im=document.createElementNS(SVGNS,'image');im.setAttribute('href',F.url);im.setAttribute('x',F.bx);im.setAttribute('y',F.by);im.setAttribute('width',F.w);im.setAttribute('height',F.h);
    im.setAttribute('preserveAspectRatio','none');im.setAttribute('data-umplere',n);ci.replaceWith(im)})}

/* ---- starea ---- */
function st(S,Q){if(!S.pc){const q=(Q&&Q.pc)||{};S.pc={c1:hexN(q.c1)||'#000000',c2:hexN(q.c2)||'#ffffff',activ:q.activ===2?2:1,contur:q.contur==='fara'?'fara':'solid',umplere:q.umplere==='solid'?'solid':'fara',
  pers:(q.pers||[]).map(hexN).filter(Boolean).slice(0,NR_PERS),facute:[],dlg:null,shift:false}}return S.pc}
function sincron(S,Q){const C=st(S,Q),P=S.ps;if(!P)return;P.c1=C.c1==='#000000'?null:C.c1;P.umplere=C.umplere==='solid'?C.c2:null}
/* forma abia desenată rămâne ACTIVĂ (Paint 11; resursele: „Apăsați CTRL + bara de spațiu pentru a aplica la planșă”, „Culoare de
   contur modificată”, „Culoare de umplere modificată”): culorile și stilul alese imediat după desen o schimbă și pe ea. Se „lasă” pe
   pânză la un clic pe pânză, alt instrument, altă formă, Salvare / Deschidere / Nou, sau dacă după ea vine alt traseu. (PRESUPUS, L10) */
function activa(S,C){const t=C.activa;if(!t||S.unealta!=='forma')return null;const L=S.desen||[];if(L[L.length-1]!==t)return null;
  const o=PSel.parse(t.u);if(o.t!=='forma'||(S.ps&&S.ps.fel&&o.fel!==S.ps.fel))return null;return t}
function recoloreazaForma(t,C){const dr=!!C.activaDr,a1=dr?C.c2:C.c1,a2=dr?C.c1:C.c2,h=t.u.indexOf('#'),cap=h>=0?t.u.slice(h):'';
  const baz=(h>=0?t.u.slice(0,h):t.u).split('|').filter((x,i)=>!(i&&/^[cf]=[0-9a-f]{6}$/i.test(x))),fara=C.contur==='fara'&&C.umplere==='solid',cc=fara?a2:a1;
  if(fara||cc!=='#000000')baz.push('c='+cc.slice(1));
  if(C.umplere==='solid')baz.push('f='+a2.slice(1));
  t.u=baz.join('|')+cap}
function aplicaActiva(S,C){const t=activa(S,C);if(!t)return false;const u0=t.u;recoloreazaForma(t,C);if(t.u===u0)return false;S.modificat=true;S.refa=[];return true}
const ACTIVA_MSG=' Forma abia desenată e încă aleasă: s-a schimbat și ea.';
function puneCuloare(S,C,c,hex,nr,din){hex=hexN(hex);if(!hex)return;nr=nr||C.activ;C['c'+nr]=hex;c.ev('culoare',{nr,hex,din});const fa=aplicaActiva(S,C);
  c.msg(`<b>Culoare ${nr}</b>: <b>${E(numeCul(hex))}</b>.`+(nr===2&&din==='paleta'?' Cercul ales e acum <b>Culoare 2</b>: ca să schimbi iar culoarea cu care desenezi, dă întâi un clic pe <b>Culoare 1</b>.':'')+(fa?ACTIVA_MSG:''))}
function adaugaPers(C,hex){hex=hexN(hex);if(!hex||C.pers.includes(hex))return;C.pers.push(hex);if(C.pers.length>NR_PERS)C.pers.shift()}
function umpleLa(S,C,c,pt){if(!S.pornit)return false;const w=S.w||1038,h=S.h||648,R=raster(S),sx=Math.max(0,Math.min(w-1,Math.round(pt[0]))),sy=Math.max(0,Math.min(h-1,Math.round(pt[1])));
  const nr=C.dreapta?2:1,cul=C['c'+nr];   /* clic dreapta = Culoare 2 (Paint-ul clasic; PRESUPUS, L12) */
  const F=calcUmplere({data:R.d},w,h,sx,sy,cul);
  if(!F){c.msg(`Zona aceasta are deja culoarea <b>${E(numeCul(cul))}</b>: nu s-a schimbat nimic. Alege altă culoare (Culoare ${nr}) sau altă zonă.`);return false}
  const ies=!!F.margine&&iesitDinForma(S,R,F,sx,sy);   /* judecata 3, AC (dirijorul): doar când umplerea a ajuns la marginea pânzei — o gaură adevărată duce culoarea în cer, până la margine; linia groasă recolorată nu. Judecata 2, Y: avertismentul NUMAI când e sigur (vezi iesitDinForma) */
  const n=++NRF;FILL[n]=F;S.desen.push({u:'umplere|'+n+'|c='+cul.slice(1),p:[[sx+n*1e-7,sy]]});
  c.ev('umplut',{hex:cul,margine:F.margine,iesit:ies,nr});
  c.msg(`Ai umplut cu <b>${E(numeCul(cul))}</b>`+(nr===2?' (clic dreapta: <b>Culoare 2</b>)':'')+'.'+(ies?' Culoarea a ieșit din formă: marginea ei are o gaură. <kbd>Ctrl</kbd>+<kbd>Z</kbd> (pe telefon, săgeata ↶), închizi gaura, apoi umpli din nou.':''));
  return true}
/* „culoarea a ieșit din formă” (judecata 2, Y, 24.10.2026): mesajul spune numai ce e sigur adevărat. Avertismentul apare NUMAI dacă
   clicul a fost ÎNĂUNTRUL unei forme închise — o formă din Forme (dreptunghi, oval, triunghi…, poligonul ei întreg, și cu bucăți șterse)
   sau liniile cu aceeași etichetă dintr-un desen al lecției (acoperișul cu gaură din pc_casa_gaura: învelitoarea capetelor lor) —, cu
   marginea încă vizibilă cel puțin pe jumătate și de altă culoare decât locul clicului (altfel marginea n-ar opri culoarea), iar umplerea
   a ieșit din dreptunghiul formei (cu jumătate de grosime + 2 de toleranță). Din mai multe forme care conțin clicul se ia cea mai mică.
   Un clic pe fundal (cerul) nu-l dă niciodată, chiar dacă umplerea ajunge la marginea pânzei. Cazurile nesigure (formă copiată / mutată,
   contur desenat cu Pensule) nu dau avertisment: „Ai umplut cu …” e mereu adevărat. */
function inPoliC(q,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const xi=P[i][0],yi=P[i][1],xj=P[j][0],yj=P[j][1];if(((yi>q[1])!==(yj>q[1]))&&(q[0]<(xj-xi)*(q[1]-yi)/((yj-yi)||1e-9)+xi))c=!c}return c}
function infasoara(P){const L=P.map(q=>[q[0],q[1]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],hi=[];
  for(const q of L){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}
  for(let i=L.length-1;i>=0;i--){const q=L[i];while(hi.length>=2&&cr(hi[hi.length-2],hi[hi.length-1],q)<=0)hi.pop();hi.push(q)}
  return lo.slice(0,-1).concat(hi.slice(0,-1))}
function formeInchise(S){const out=[],gr={};
  PSel.scena(S.desen||[]).forEach(I=>{if(I.src!=='desen'||!I.o||I.o.t!=='forma'||!I.pts.length)return;const n=I.n0||I.pts.length,vz=I.vis.reduce((a,b)=>a+b,0);
    if(I.o.fel==='linie'){if(!I.tag)return;const g=gr[I.tag]||(gr[I.tag]={pts:[],vz:0,n:0,c:I.o.c,dim:I.o.dim});g.pts.push(I.pts[0],I.pts[I.pts.length-1]);g.vz+=vz;g.n+=n;return}
    if(I.pts.length>=3)out.push({pts:I.pts,vz:vz/n,c:hexN(I.o.c)||'#000000',dim:I.o.dim||3})});
  Object.keys(gr).forEach(k=>{const g=gr[k],h=infasoara(g.pts);if(h.length>=3)out.push({pts:h,vz:g.vz/(g.n||1),c:hexN(g.c)||'#000000',dim:g.dim||3})});
  return out}
function iesitDinForma(S,R,F,sx,sy){const i0=(sy*R.w+sx)*4,c0=[R.d[i0],R.d[i0+1],R.d[i0+2]];
  const bb=P=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;P.forEach(q=>{x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])});return [x0,y0,x1,y1]};
  const L=formeInchise(S).filter(f=>f.vz>=.5&&inPoliC([sx,sy],f.pts)&&rgbDin(f.c).some((v,k)=>Math.abs(v-c0[k])>TOL)).map(f=>({f,b:bb(f.pts)}));
  if(!L.length)return false;
  L.sort((a,b)=>(a.b[2]-a.b[0])*(a.b[3]-a.b[1])-(b.b[2]-b.b[0])*(b.b[3]-b.b[1]));
  const b=L[0].b,m=L[0].f.dim/2+2;
  return F.bx<b[0]-m||F.by<b[1]-m||F.bx+F.w-1>b[2]+m||F.by+F.h-1>b[3]+m}
function pipeta(S,C,c,pt){if(!S.pornit)return false;const hex=pixel(S,pt),nr=C.dreapta?2:1;C['c'+nr]=hex;c.ev('culoare',{nr,hex,din:'pipeta'});
  c.msg(`Selectorul de culoare a luat <b>${E(numeCul(hex))}</b> și a pus-o în <b>Culoare ${nr}</b>`+(nr===2?' (clic dreapta)':'')+'. Acum alege instrumentul cu care colorezi (de exemplu, Umplere).');return false}
/* „curs”: culoarea punctului a (aceeași ca în b) vine dintr-o SINGURĂ umplere care le-a acoperit pe amândouă (a trecut printr-o gaură) */
function inMasca(F,pt){const x=Math.round(pt[0])-F.bx,y=Math.round(pt[1])-F.by;if(x<0||y<0||x>=F.w||y>=F.h||!F.mm)return false;return F.mm[y*F.w+x]===1}
function curs(S,a,b){const ha=pixel(S,a),hb=pixel(S,b);if(ha!==hb)return false;
  return (S.desen||[]).some(s=>{const o=PSel.parse(s.u);if(o.t!=='umplere')return false;const F=FILL[serialDin(s.u)];
    return !!F&&!F.gol&&hexN(F.c)===ha&&inMasca(F,a)&&inMasca(F,b)})}
function alegeU(S,C,id,c){S.unealta=id;S.pop=null;if(S.ps)S.ps.sel=null;c.ev('unealta',{u:id});
  c.msg(id==='umplere'?`Ai ales <b>Umplere</b> (găleata): un clic într-o zonă o umple cu <b>Culoare 1</b> (acum: ${E(numeCul(C.c1))}).`:`Ai ales <b>Selector de culoare</b> (pipeta): un clic pe o culoare din desen o pune în <b>Culoare 1</b>.`)}
function stil(S,C,c,ce,v){
  if(ce==='contur'&&v==='fara'&&C.umplere==='fara'){c.msg('Cu <b>Fără contur</b> și <b>Fără umplere</b>, forma n-ar avea nimic de arătat. Alege întâi <b>Umplere formă</b> › <b>Umplere solidă</b>.',true);return false}
  if(ce==='umplere'&&v==='fara'&&C.contur==='fara'){c.msg('Cu <b>Fără umplere</b> și <b>Fără contur</b>, forma n-ar avea nimic de arătat. Alege întâi <b>Contur formă</b> › <b>Contur compact</b>.',true);return false}
  C[ce]=v;c.ev('stil',{ce,v});const fa=aplicaActiva(S,C);
  c.msg((ce==='contur'?(v==='fara'?'<b>Contur formă</b> › <b>Fără contur</b>: forma nouă nu are margine.':'<b>Contur formă</b> › <b>Contur compact</b>: marginea formei are <b>Culoare 1</b>.'):
    (v==='solid'?'<b>Umplere formă</b> › <b>Umplere solidă</b>: interiorul formei noi are <b>Culoare 2</b>.':'<b>Umplere formă</b> › <b>Fără umplere</b>: interiorul formei noi rămâne cum era.'))+(fa?ACTIVA_MSG:''));return true}
function deschideDlg(S,C,c){const x=hsv(C['c'+C.activ]);C.dlg={h:x.h,s:x.s,v:x.v};S.pop=null;c.ev('editare',{m:'deschis'});c.msg('')}
const dlgHex=D=>dinHsv(D.h,D.s,D.v);
function okDlg(S,C,c){const hex=dlgHex(C.dlg);C.dlg=null;adaugaPers(C,hex);if(!C.facute.includes(hex))C.facute.push(hex);puneCuloare(S,C,c,hex,C.activ,'editare');c.ev('editare',{m:'ok',hex})}

/* ---- testele ---- */
function verifica(t,c){const S=c.S,C=st(S,c.Q);
  switch(t.k){
    case 'culoare':return potriveste(C['c'+(t.nr||1)],t.hex||t.fam||t.grup);
    case 'pixel':{if(!S.pornit)return false;const h=pixel(S,t.la);
      if(t.ca)return h===pixel(S,t.ca);if(t.difera&&h===pixel(S,t.difera))return false;
      if(t.personal&&!(C.facute.includes(h)&&!inPaleta(h)))return false;
      return potriveste(h,t.hex||t.fam||t.grup)}
    case 'linieCul':return S.desen.some(s=>{const o=PSel.parse(s.u);return o.t==='pensula'&&!o.simplu&&!o.tag&&(!t.tip||o.tip===t.tip)&&o.dim>=(t.dimMin||0)&&s.p.length>=3&&potriveste(o.c||'#000000',t.fam||t.grup)});
    case 'formaCul':return S.desen.some(s=>{const o=PSel.parse(s.u);if(o.t!=='forma'||o.tag||(t.fel&&o.fel!==t.fel))return false;
      const fc=!!(o.f&&o.c&&hexN(o.c)===hexN(o.f));
      if(t.faraContur&&!fc)return false;
      if(t.contur&&(fc||!potriveste(o.c||'#000000',t.contur)))return false;
      if(t.umplere==='fara')return !o.f;
      if(t.umplere){if(o.f)return potriveste(o.f,t.umplere);
        /* sauPixel: interiorul umplut după aceea cu găleata (Paint acceptă și drumul acesta): pixelul din mijlocul formei */
        if(t.sauPixel){const a=s.p[0],b=s.p[s.p.length-1];return potriveste(pixel(S,[(a[0]+b[0])/2,(a[1]+b[1])/2]),t.umplere)}return false}
      return true});
    case 'personal':return C.facute.some(h=>!inPaleta(h)&&potriveste(h,t.fam)&&(!t.inchis||hsv(h).v<.66)&&(!t.folosit||S.desen.some(s=>{const o=PSel.parse(s.u);return hexN(o.c)===h||hexN(o.f)===h})));
    case 'separat':{if(!S.pornit)return false;if(pixel(S,t.la)==='#ffffff')return false;return !curs(S,t.la,t.de)}
  }
  return null}

/* ---- operațiile (sol / gresit) ---- */
function op(o,c){const S=c.S,C=st(S,c.Q),[k,a,b,d]=o;let r=true;C.dreapta=false;
  switch(k){
    case 'culoare':{if(b===1||b===2)C.activ=b;const h=hexN(a);if(h)puneCuloare(S,C,c,h,C.activ,'paleta');break}
    case 'activ':C.activ=a===2?2:1;break;
    case 'umple':alegeU(S,C,'umplere',c);if(umpleLa(S,C,c,[a,b])){S.refa=[];S.modificat=true;c.ev('desen',{u:'umplere',puncte:1})}break;
    case 'pipeta':alegeU(S,C,'pipeta',c);pipeta(S,C,c,[a,b]);break;
    case 'contur':stil(S,C,c,'contur',a==='fara'?'fara':'solid');break;
    case 'umplereForma':stil(S,C,c,'umplere',a==='solid'?'solid':'fara');break;
    case 'editare':{deschideDlg(S,C,c);const h=hexN(a);if(h){const x=hsv(h);C.dlg.h=x.h;C.dlg.s=x.s;C.dlg.v=x.v;if(b){const hh=dlgHex(C.dlg);adaugaPers(C,hh)}}okDlg(S,C,c);break}
    default:r=false}
  sincron(S,c.Q);return r}

/* ---- butoanele, meniurile, fereastra Editare culori ---- */
const INST=new WeakMap();
const CSS=`
.pc-cc{display:inline-block;width:20px;height:20px;border-radius:50%;border:2px solid #4a4a4a;vertical-align:middle}
.pc-pop{min-width:180px;max-width:calc(100% - 10px)}
.pc-gr{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:flex-start}
.pc-12{display:flex;gap:6px}
.pc-12 button{display:flex;flex-direction:column;align-items:center;gap:1px;border:0;background:transparent;cursor:pointer;padding:2px;min-width:44px;min-height:44px;font:inherit;font-size:10px;color:#3b3b3b;border-radius:6px}
.pc-12 button i{display:block;width:28px;height:28px;border-radius:50%;border:1px solid #9a9a9a;box-shadow:inset 0 0 0 2px #fff}
.pc-12 button.on i{outline:2px solid #0067c0;outline-offset:2px}
.pc-pal{display:grid;grid-template-columns:repeat(10,32px);gap:1px;max-width:100%}
.pc-pal button,.pc-pal span{width:32px;height:32px;border:0;background:transparent;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px}
.pc-pal button:hover{background:#e6e6e6}
.pc-pal button i,.pc-pal span i{display:block;width:20px;height:20px;border-radius:50%;border:1px solid #b5b5b5}
.pc-pal span i{border:1px dashed #b5b5b5;background:transparent}
.pc-ed{width:44px;height:44px;border:0;background:transparent;border-radius:6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;font:inherit;font-size:10px;color:#3b3b3b}
.pc-ed:hover{background:#e6e6e6}
.pc-ed b{display:block;width:24px;height:24px;border-radius:50%;background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red);position:relative}
.pc-ed b:after{content:"+";position:absolute;right:-5px;bottom:-5px;width:13px;height:13px;border-radius:50%;background:#fff;border:1px solid #888;font-size:11px;line-height:12px;text-align:center;color:#333}
.pc-stil{display:flex;flex-direction:column;gap:2px;margin-left:4px}
.ps-stil button[data-act="pc:stil"]{color:#1a1a1a}
.ps-stil button[data-act="pc:stil"].pc-gri{color:#9a9a9a}
.ps-stil button[data-act="pc:stil"] small{font-size:10px}
.pc-sp .ps-it .bif{width:14px;display:inline-block;text-align:center}
.pc-ov{position:absolute;inset:0;z-index:9;background:rgba(0,0,0,.28);display:flex;align-items:flex-start;justify-content:center;padding:8px 4px;overflow:auto}
.pc-dlg{background:#fff;color:#1a1a1a;border:1px solid #9a9a9a;border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.3);width:100%;max-width:560px;font-size:13px;padding:10px 12px}
.pc-dlg h4{margin:0 0 8px;font-size:16px;font-weight:600}
.pc-sus{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}
.pc-spec{position:relative;width:220px;max-width:100%;height:150px;border-radius:4px;cursor:crosshair;touch-action:none;flex:none;
  background:linear-gradient(to bottom,rgba(255,255,255,0),#fff),linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)}
.pc-spec i{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;border:2px solid #222;border-radius:50%;box-shadow:0 0 0 1px #fff;pointer-events:none}
.pc-prev{width:34px;height:150px;border-radius:4px;border:1px solid #ccc;flex:none}
.pc-lum{writing-mode:vertical-lr;direction:rtl;width:32px;height:150px;margin:0;cursor:pointer;flex:none;-webkit-appearance:none;appearance:none;border:1px solid #c9c9c9;border-radius:16px;touch-action:none}
.pc-lum::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid #333;box-shadow:0 0 0 1px #fff}
.pc-lum::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid #333}
.pc-camp{display:flex;flex-direction:column;gap:6px;min-width:140px}
.pc-camp input{font:inherit;font-size:13px;width:84px;min-height:32px;border:1px solid #c9c9c9;border-radius:4px;padding:2px 6px;box-sizing:border-box}
.pc-camp .pc-hex{width:110px}
.pc-camp label{display:flex;align-items:center;gap:8px}
.pc-camp .pc-mod{width:110px;min-height:32px;border:1px solid #c9c9c9;border-radius:4px;padding:6px;box-sizing:border-box;color:#333;background:#fafafa}
.pc-jos{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px}
.pc-jos .pc-lbl{font-size:13px;margin-bottom:4px;display:flex;align-items:center;gap:8px;min-height:32px}
.pc-baza,.pc-persd{display:grid;grid-template-columns:repeat(12,32px);gap:0}
.pc-persd{grid-template-columns:repeat(6,32px)}
.pc-baza button,.pc-persd button,.pc-persd span{width:32px;height:32px;border:0;background:transparent;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%}
.pc-baza button i,.pc-persd button i,.pc-persd span i{display:block;width:20px;height:20px;border-radius:50%;border:1px solid #b5b5b5}
.pc-persd span i{border-style:dashed}
.pc-plus{width:32px;height:32px;border:1px solid #c9c9c9;background:#fff;border-radius:4px;cursor:pointer;font-size:18px;line-height:1}
.pc-btn{display:flex;gap:8px;margin:12px -12px -10px;padding:8px 12px 10px;position:sticky;bottom:-10px;background:#fff;border-top:1px solid #eee;border-radius:0 0 8px 8px}   /* OK / Anulare se văd mereu, și pe telefon (fereastra se derulează) */
.pc-btn button{flex:1;min-height:34px;border:1px solid #c9c9c9;background:#fbfbfb;border-radius:4px;font:inherit;cursor:pointer}
.pc-btn button.imp{background:#0067c0;border-color:#0067c0;color:#fff}
@media (max-width:520px){.pc-pal{grid-template-columns:repeat(5,32px)}.pc-baza{grid-template-columns:repeat(7,32px)}.pc-spec{width:100%;height:120px}.pc-prev,.pc-lum{height:120px}.pc-dlg{padding:8px}.pc-btn{margin:10px -8px -8px;padding:8px;bottom:-8px}}
`;
let cssPus=false;function css(){if(cssPus)return;cssPus=true;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s)}
function pozitie(win,el,lat){const tl=win.querySelector('.pt-tools'),wr=win.getBoundingClientRect(),W=win.clientWidth||600;
  const t=tl?Math.round(tl.getBoundingClientRect().bottom-wr.top-win.clientTop):150;
  let x=el?Math.round(el.getBoundingClientRect().left-wr.left-win.clientLeft):6;x=Math.max(4,Math.min(x,W-(lat||200)-6));return `left:${x}px;top:${t}px`}
function grupCulori(S,C){const sw=PALETA.map(([h,n])=>`<button type="button" data-act="pc:cul" data-v="${h}" aria-label="${E(n)}" title="${E(n)}"><i style="background:${h}"></i></button>`).join('');
  const pr=[];for(let i=0;i<10;i++){const h=C.pers[i];pr.push(h?`<button type="button" data-act="pc:cul" data-v="${h}" aria-label="Culoarea ta ${h.toUpperCase()}" title="Culoarea ta ${h.toUpperCase()}"><i style="background:${h}"></i></button>`:'<span aria-hidden="true"><i></i></span>')}
  return `<div class="pc-gr"><div class="pc-12"><button type="button" class="${C.activ===1?'on':''}" data-act="pc:activ" data-v="1" aria-label="Culoare 1" title="Culoare 1"><i style="background:${C.c1}"></i>Culoare 1</button>
    <button type="button" class="${C.activ===2?'on':''}" data-act="pc:activ" data-v="2" aria-label="Culoare 2" title="Culoare 2"><i style="background:${C.c2}"></i>Culoare 2</button></div>
    <div class="pc-pal" role="group" aria-label="Paleta de culori">${sw}${pr.join('')}</div>
    <button type="button" class="pc-ed" data-act="pc:edit" aria-label="Editare culori" title="Editare culori"><b></b>Editare</button></div>`}
function dialogHtml(C){const D=C.dlg,hex=dlgHex(D),rgb=rgbDin(hex),full=dinHsv(D.h,D.s,1);
  const pr=[];for(let i=0;i<NR_PERS;i++){const h=C.pers[i];pr.push(h?`<button type="button" data-act="pc:persd" data-v="${h}" aria-label="Culoarea ta ${h.toUpperCase()}"><i style="background:${h}"></i></button>`:'<span aria-hidden="true"><i></i></span>')}
  return `<div class="pc-ov"><div class="pc-dlg" role="dialog" aria-label="Editare culori"><h4>Editare culori</h4>
   <div class="pc-sus"><div class="pc-spec" data-pc="spec" role="slider" aria-label="Nuanța: clic sau trage în pătratul colorat" aria-valuenow="${Math.round(D.h)}"><i style="left:${(D.h/360*100).toFixed(2)}%;top:${((1-D.s)*100).toFixed(2)}%"></i></div>
    <div class="pc-prev" style="background:${hex}" title="Culoarea aleasă"></div>
    <input type="range" class="pc-lum" min="0" max="100" step="1" value="${Math.round(D.v*100)}" aria-label="Luminozitate" title="Luminozitate" style="background:linear-gradient(to bottom,${full},#000)">
    <div class="pc-camp"><input type="text" class="pc-hex" value="${hex.toUpperCase()}" aria-label="Codul culorii" spellcheck="false" autocomplete="off"><div class="pc-mod" aria-label="RGB">RGB ⌄</div>
     ${['Roșu','Verde','Albastru'].map((n,i)=>`<label><input type="number" class="pc-rgb" data-i="${i}" min="0" max="255" value="${rgb[i]}" aria-label="${n}">${n}</label>`).join('')}</div></div>
   <div class="pc-jos"><div><div class="pc-lbl">Culori de bază</div><div class="pc-baza">${BAZA.map(h=>`<button type="button" data-act="pc:baza" data-v="${h}" aria-label="${h.toUpperCase()}"><i style="background:${h}"></i></button>`).join('')}</div></div>
    <div><div class="pc-lbl">Culori particularizate <button type="button" class="pc-plus" data-act="pc:plus" aria-label="Adăugați o culoare" title="Adăugați o culoare">+</button></div><div class="pc-persd">${pr.join('')}</div></div></div>
   <div class="pc-btn"><button type="button" class="imp" data-act="pc:ok">OK</button><button type="button" data-act="pc:anul">Anulare</button></div></div></div>`}
function stilPop(win,S,C){const ce=S.pop==='pc-contur'?'contur':'umplere',el=win.querySelector(`[data-act="pc:stil"][data-v="${ce}"]`)||win.querySelector('.pt-tools .pt-g:nth-child(5)');
  const it=(v,t)=>`<button type="button" class="ps-it${C[ce]===v?' on':''}" role="menuitemradio" aria-checked="${C[ce]===v}" data-act="pc:sc" data-v="${ce}:${v}"><span class="bif">${C[ce]===v?'✓':''}</span>${t}</button>`;
  return `<div class="pt-pop ps-pop pc-sp" role="menu" aria-label="${ce==='contur'?'Contur formă':'Umplere formă'}" style="${pozitie(win,el,220)}">
    ${ce==='contur'?it('fara','Fără contur')+it('solid','Contur compact'):it('fara','Fără umplere')+it('solid','Umplere solidă')}<hr>
    <button type="button" class="ps-it gri" role="menuitem" data-act="pc:nu" data-v="${ce}">Alte stiluri (ca pensulele)</button></div>`}
function panou(c){const S=c.S,C=st(S,c.Q),inst=INST.get(c.Q);sincron(S,c.Q);if(!inst||!S.pornit)return '';const win=inst.body.querySelector('.pt-win');if(!win)return '';
  /* grupul Culori: întins (fereastră lată) sau buton strâns (îngustă) */
  const gC=win.querySelector('.pt-g[data-z="culori"]');
  if(gC){const gc=gC.querySelector('.pt-gc');if(gc)gc.innerHTML=grupCulori(S,C);
    const b=gC.querySelector('[data-act="grup"][data-v="culori"]');if(b){const cc=b.querySelector('.pt-cc');if(cc)cc.style.background=C.c1;b.classList.toggle('on',S.pop==='pc-culori');b.setAttribute('aria-expanded',String(S.pop==='pc-culori'))}}
  /* Contur formă / Umplere formă (V/19 le lasă pe „lecția 21”): devin ale mele */
  win.querySelectorAll('[data-act="ps:stil"]').forEach(b=>{const ce=/Umplere/.test(b.getAttribute('aria-label')||'')?'umplere':'contur';b.setAttribute('data-act','pc:stil');b.setAttribute('data-v',ce);
    b.innerHTML=(ce==='contur'?'✎':'◧')+` <small>${ce==='contur'?'Contur formă':'Umplere formă'}</small> ⌄`;b.classList.toggle('pc-gri',S.unealta!=='forma');
    b.title=ce==='contur'?'Contur formă':'Umplere formă';b.setAttribute('aria-disabled',String(S.unealta!=='forma'))});
  let h='';
  if(S.pop==='pc-culori'&&gC)h+=`<div class="pt-pop pc-pop" role="group" aria-label="Culori" style="${pozitie(win,gC,340)}">${grupCulori(S,C)}<div class="pt-gn">Culori</div></div>`;
  if(S.pop==='pc-contur'||S.pop==='pc-umplere')h+=stilPop(win,S,C);
  if(C.dlg)h+=dialogHtml(C);
  if(h)win.insertAdjacentHTML('beforeend',h);
  inlocuieste(win,S);
  if(C.focus){C.focus=false;const f=C.dlg?win.querySelector('.pc-dlg [data-act="pc:ok"]'):null;(f||win).focus({preventScroll:true})}
  return ''}
function actiune(a,v,c){const S=c.S,C=st(S,c.Q);
  if(!a.startsWith('pc:')){
    if(a==='grup'&&v==='culori'){S.pop=S.pop==='pc-culori'?null:'pc-culori';S.meniu=null;c.msg('');return true}
    if(a==='unealta'&&(v==='umplere'||v==='pipeta')){alegeU(S,C,v,c);sincron(S,c.Q);return true}
    if(S.pop&&String(S.pop).startsWith('pc-'))S.pop=null;
    return false}
  c.msg('');
  switch(a){
    case 'pc:activ':C.activ=v==='2'?2:1;c.msg(`Ai ales cercul <b>Culoare ${C.activ}</b>: culoarea pe care o alegi acum din paletă merge în el.`);break;
    case 'pc:cul':{const nr=C.shift?2:C.activ;C.shift=false;puneCuloare(S,C,c,v,nr,'paleta');S.pop=null;break}
    case 'pc:edit':deschideDlg(S,C,c);C.focus=true;break;
    case 'pc:stil':if(S.unealta!=='forma'){S.pop=null;c.msg(`<b>${v==='contur'?'Contur formă':'Umplere formă'}</b> se poate apăsa după ce alegi o formă (grupul <b>Forme</b>).`,true)}else S.pop=S.pop==='pc-'+v?null:'pc-'+v;break;
    case 'pc:sc':{const [ce,val]=String(v).split(':');S.pop=null;stil(S,C,c,ce,val);break}
    case 'pc:nu':S.pop=null;c.msg('Celelalte stiluri (ca pensulele) nu le folosim azi.');break;
    case 'pc:baza':case 'pc:persd':if(C.dlg){const x=hsv(hexN(v));C.dlg.h=x.h;C.dlg.s=x.s;C.dlg.v=x.v}break;
    case 'pc:plus':if(C.dlg){adaugaPers(C,dlgHex(C.dlg));c.ev('editare',{m:'plus'})}break;
    case 'pc:ok':if(C.dlg)okDlg(S,C,c);C.focus=true;break;
    case 'pc:anul':C.dlg=null;c.ev('editare',{m:'anulat'});C.focus=true;break;
  }
  sincron(S,c.Q);return true}

/* gesturile pe pânză: găleata și pipeta (paint.js cheamă deseneaza la ridicarea degetului / butonului) */
const UNELTE=[{id:'umplere',nume:'Umplere',grup:'',lectie:21,deseneaza(S,tr,c){const C=st(S,c.Q);return umpleLa(S,C,c,tr.p[0])}},
  {id:'pipeta',nume:'Selector de culoare',grup:'',lectie:21,deseneaza(S,tr,c){const C=st(S,c.Q);return pipeta(S,C,c,tr.p[0])}}];
const EXT={unelte:UNELTE,verifica,op,actiune,panou};

/* ---- ascultătorii (o dată pe exercițiu) ---- */
function leaga(Q,body){const root=body.querySelector('.pt'),win=body.querySelector('.pt-win');if(!root||!win)return;
  const S=()=>body._sim.stare(),C=()=>st(S(),Q);
  const nota=root.querySelector('.pt-nota'),rb=nota&&nota.querySelector('[data-reset]');
  if(nota&&rb&&!Q.explorare){nota.innerHTML=NOTA;nota.appendChild(document.createTextNode(' '));nota.appendChild(rb)}
  /* Shift+clic pe o culoare din paletă = Culoare 2 (Windows Insider Blog, 30.11.2021) */
  win.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('[data-act="pc:cul"]');C().shift=!!(b&&e.shiftKey)},true);
  /* pe pânză: orice apăsare „lasă” forma activă; butonul DREPT = Culoare 2 (Paint-ul clasic; PRESUPUS, L12) — înaintea lui paint.js
     (ascultător de captură), ca gestul V/19 să-și ia culoarea din S.ps.c1 / S.ps.umplere puse aici; draw → sincron le pune la loc */
  win.addEventListener('pointerdown',e=>{if(!(e.target.closest&&e.target.closest('.pt-svg')))return;const s=S(),c=st(s,Q);c.activa=null;c.dreapta=e.button===2;
    if(c.dreapta&&s.ps&&['creion','pensula','forma'].includes(s.unealta)){s.ps.c1=c.c2==='#000000'?null:c.c2;s.ps.umplere=c.umplere==='solid'?c.c1:null}},true);
  win.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.pt-svg'))e.preventDefault()});
  /* forma nouă: rămâne activă (vezi activa); „Fără contur”: conturul ia culoarea umplerii (forma se vede fără margine); clic dreapta:
     culorile inversate */
  body.addEventListener('paint-sim',e=>{const d=e.detail||{},s=S(),c=st(s,Q);
    if(['salvat','deschis','nou','inchis'].includes(d.tip)){c.activa=null;return}
    if(d.tip!=='forma')return;const t=s.desen[s.desen.length-1];if(!t||!/^forma\|/.test(t.u))return;
    c.activa=t;c.activaDr=!!c.dreapta;if((c.contur==='fara'&&c.umplere==='solid')||c.dreapta)recoloreazaForma(t,c)});
  /* fereastra Editare culori: pătratul colorat (tragere), luminozitatea, codul, Roșu / Verde / Albastru */
  const actual=()=>{const D=C().dlg;if(!D)return;const dl=win.querySelector('.pc-dlg');if(!dl)return;const hex=dlgHex(D),rgb=rgbDin(hex);
    const i=dl.querySelector('.pc-spec i');if(i){i.style.left=(D.h/360*100).toFixed(2)+'%';i.style.top=((1-D.s)*100).toFixed(2)+'%'}
    const pv=dl.querySelector('.pc-prev');if(pv)pv.style.background=hex;
    const l=dl.querySelector('.pc-lum');if(l){l.style.background=`linear-gradient(to bottom,${dinHsv(D.h,D.s,1)},#000)`;if(document.activeElement!==l)l.value=Math.round(D.v*100)}
    const hx=dl.querySelector('.pc-hex');if(hx&&document.activeElement!==hx)hx.value=hex.toUpperCase();
    dl.querySelectorAll('.pc-rgb').forEach(x=>{if(document.activeElement!==x)x.value=rgb[+x.dataset.i]})};
  let tr=null;
  const spec=e=>{const sp=tr||e.target.closest('.pc-spec');if(!sp)return;const r=sp.getBoundingClientRect(),D=C().dlg;if(!D||!r.width)return;
    D.h=Math.max(0,Math.min(359.9,(e.clientX-r.left)/r.width*360));D.s=Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height));actual()};   /* luminozitatea NU urcă singură (de la negru rămâi la negru până urci bara; J1-05) */
  win.addEventListener('pointerdown',e=>{const sp=e.target.closest&&e.target.closest('.pc-spec');if(!sp)return;e.preventDefault();tr=sp;try{sp.setPointerCapture(e.pointerId)}catch(x){}spec(e)});
  win.addEventListener('pointermove',e=>{if(tr)spec(e)});
  const gataSp=()=>{if(tr){tr=null;const D=C().dlg;if(D)S().ev.push({tip:'nuanta',h:Math.round(D.h)})}};
  win.addEventListener('pointerup',gataSp);win.addEventListener('pointercancel',gataSp);
  win.addEventListener('input',e=>{const t=e.target,D=C().dlg;if(!D||!t.closest||!t.closest('.pc-dlg'))return;
    if(t.classList.contains('pc-lum')){D.v=(+t.value)/100;actual()}
    else if(t.classList.contains('pc-rgb')){const rgb=rgbDin(dlgHex(D));rgb[+t.dataset.i]=Math.max(0,Math.min(255,+t.value||0));const x=hsv(hexDin(...rgb));D.h=x.h;D.s=x.s;D.v=x.v;actual()}
    else if(t.classList.contains('pc-hex')){const h=hexN(t.value);if(h){const x=hsv(h);D.h=x.h;D.s=x.s;D.v=x.v;actual()}}});
  win.addEventListener('change',e=>{const t=e.target;if(t.classList&&t.classList.contains('pc-lum'))S().ev.push({tip:'luminozitate',v:+t.value})});
  win.addEventListener('keydown',e=>{const c=C();if(!c.dlg)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();body._sim.run([['__pc_anul']]);return}
    if(e.ctrlKey&&!/^(INPUT|TEXTAREA)$/.test(e.target.tagName||'')){e.preventDefault();e.stopPropagation()}},true);
  /* umplerile: punctele din SVG devin imaginea umplerii, la fiecare redesenare (și cât tragi); previzualizarea liniei / formei cât
     tragi primește culoarea (V/19 o desenează neagră) */
  const D={on:false};
  win.addEventListener('pointerdown',e=>{const s=S();D.on=!!(e.target.closest&&e.target.closest('.pt-svg'))&&['creion','pensula','forma'].includes(s.unealta)&&!s.dlg&&!s.intreb},true);
  const off=()=>{D.on=false};win.addEventListener('pointerup',off);win.addEventListener('pointercancel',off);
  let nC={k:null,n:0};
  const recoloreaza=svg=>{const s=S(),c=st(s,Q),k=semn(s.desen,s.w,s.h);
    if(nC.k!==k){let n=0;try{const doc=new DOMParser().parseFromString(`<svg xmlns="${SVGNS}">${PSel.randeaza(s.desen,{pref:'pcnum'})}</svg>`,'image/svg+xml');n=doc.documentElement.childElementCount}catch(x){n=0}nC={k,n}}
    const a1=c.dreapta?c.c2:c.c1,a2=c.dreapta?c.c1:c.c2,L=[...svg.children].slice(nC.n),cont=s.unealta==='forma'&&c.contur==='fara'&&c.umplere==='solid'?a2:a1;
    L.forEach(el=>{if(el.getAttribute('stroke')==='#000')el.setAttribute('stroke',cont);if(el.getAttribute('fill')==='#000')el.setAttribute('fill',cont);
      if(s.unealta==='forma'&&el.tagName.toLowerCase()==='polygon'&&el.getAttribute('fill')==='none'&&c.umplere==='solid')el.setAttribute('fill',a2)})};
  let lucrez=false;
  const mo=new MutationObserver(()=>{if(lucrez)return;lucrez=true;try{const s=S();inlocuieste(root,s);if(D.on){const svg=root.querySelector('.pt-svg');if(svg)recoloreaza(svg)}}finally{mo.takeRecords();lucrez=false}});
  mo.observe(root,{childList:true,subtree:true});
}
const NOTA='Un Paint mic, desenat în pagină, după Paint-ul din Windows 11. Aici merg culorile: grupul <b>Culori</b> (Culoare 1, Culoare 2, paleta, <b>Editare culori</b>), <b>Umplere</b> și <b>Selector de culoare</b> (grupul <b>Instrumente</b>), <b>Contur formă</b> și <b>Umplere formă</b> (lângă <b>Forme</b>); merg și Creionul, Pensulele, Radiera, Formele, selecția, meniul <b>Editare</b> și tastele <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>S</kbd>. Textul și grupul Imagine îți spun la ce lecție le înveți. Pe telefon: săgeata ↶ (Anulați) și meniul <b>Fișier</b>.';

/* operația internă pentru Esc în Editare culori (ca butonul Anulare) */
const opBaza=EXT.op;EXT.op=function(o,c){if(o[0]==='__pc_anul'){const C=st(c.S,c.Q);C.dlg=null;c.ev('editare',{m:'anulat'});C.focus=true;return true}return opBaza(o,c)};

function creeaza(alte){
  const baza=PSel.creeaza([EXT].concat(alte||[]));
  return {
    render(Q,body,api){css();INST.set(Q,{body});baza.render(Q,body,api);leaga(Q,body);if(body._sim)body._sim.run([])},
    rezolva(Q,body,api){return baza.rezolva(Q,body,api)},
    gresit(Q,body,api){return baza.gresit(Q,body,api)}
  };
}

/* ---- desenele lecției 21 (în PaintSim.DESENE; contur negru, fără culori, ca un desen de colorat) ---- */
const F=(fel,x1,y1,x2,y2,tag)=>({u:'forma|'+fel+'|3'+(tag?'#'+tag:''),p:[[x1,y1],[x2,y2]]});
const Lin=(x1,y1,x2,y2,tag)=>({u:'forma|linie|3'+(tag?'#'+tag:''),p:[[x1,y1],[x2,y2]]});
const U=(n,x,y,hex)=>({u:'umplere|'+n+'|c='+hex.replace('#',''),p:[[x+n*1e-7,y]]});
const PERETE=F('dreptunghi',120,330,380,560,'casa'),ACOP=F('triunghi',100,190,400,330,'casa');
/* acoperișul cu o „gaură”: trei linii, iar pe latura din dreapta lipsește o bucată (de la (305,248) la (352,293), ~65 de unități) */
const ACOP_GAURA=[Lin(100,330,400,330,'acoperis'),Lin(100,330,250,190,'acoperis'),Lin(250,190,305,241,'acoperis'),Lin(352,285,400,330,'acoperis')];
const USA=F('dreptunghi',220,450,280,560,'usa'),COPAC=[F('dreptunghi',600,470,630,560,'trunchi'),F('oval',545,330,685,470,'copac')];
const SOARE=F('oval',820,60,940,180,'soare');
const DESENE_NOI={
  pc_casa_gaura:[PERETE].concat(ACOP_GAURA,[SOARE]),
  pc_cer:[PERETE,ACOP,SOARE,U(990001,520,80,'#5d9fd8')],   /* 24.10 (judecata 1, J1-11): fără ușă — P4 umple PERETELE (52 × 46 px pe telefon) */
  pc_cer_usa:[PERETE,ACOP,USA,F('dreptunghi',300,380,350,430,'fereastra'),U(990002,250,280,'#c0504d'),U(990003,250,505,'#8a5a3c')],
  pc_casa:[PERETE,ACOP],
  pc_copac:[PERETE,ACOP].concat(COPAC,[SOARE]),
  pc_atelier:[PERETE,ACOP,USA].concat(COPAC)   /* 24.10 (judecata 1, J1-09): fără gaură în acoperiș — gaura rămâne la P3 */
};
Object.keys(DESENE_NOI).forEach(k=>{if(PS.DESENE&&!PS.DESENE[k])PS.DESENE[k]=DESENE_NOI[k]});

window.PaintCulori={versiune:2,ext:EXT,creeaza,PALETA,BAZA,familie,grup,raster,pixel,FILL,DESENE:DESENE_NOI,hsv,dinHsv,curs};
window.SimPaintCul=creeaza();
})();
