/* ======================================================================================================
   lectii/_sim/paint-proba.js — PROBA DE ANTRENAMENT cu punctaj pe părțile C / B / A, peste Paint-ul din lecții (clasa a V-a,
   lecția V · M4 · nr. 23, „Evaluare sumativă: editor grafic (produs digital)”, 01.11.2026). PROPRIETAR: autorul lecției V/23.
   Model (mecanismul, nu codul): lectii/_sim/eval-internet-v.js (V/17): punctele în memorie, la PRIMA verificare a fiecărei
   cerințe; bifele ascunse până atunci; panoul de sus cu „Sunt alt elev / Încep din nou”; rezumatul cu părțile, oficiul,
   punctajul, nota „după ultima cifră”, nivelul și „unde ai pierdut puncte”; proba se golește la schimbarea elevului.

   NU modifică motorul (jocuri/_motor/*), paint.js (V/18), paint-selectie.js (V/19), paint-imagine.js (V/20), paint-culori.js
   (V/21), paint-text.js (V/22), rezultat-elev.js sau prezenta.js. Folosește DOAR interfețele lor publice:
     - PaintText.creeaza([ext]) (lanțul selecție → culori → text → al meu), PaintImagine.creeaza() (lanțul selecție → imagine);
     - mânerul pe care paint.js îl pune pe exercițiu: body._sim = {run, stare(), test(c)};
     - PaintText.texte(S), PaintText.vede(S,it) (literele văzute: v = cât se vede, r = [x1,y1,x2,y2]); PaintSelectie.scena(desen);
     - api.checkButton al motorului: îl învelesc ca să socotesc punctele ÎNAINTE de verificarea simulatorului.
   De ce două lanțuri: paint-imagine.js (Redimensionați și înclinați) își ține starea ferestrei într-un INST privat, pus doar de
   PaintImagine.creeaza().render, deci nu se poate lega în același Paint cu paint-culori / paint-text fără să le schimb. Proba din
   lecția 23 e de aceea PE CERINȚE, fiecare pe pânza ei (ca la V/17): C1 pe Paint-ul lecției 20, restul pe Paint-ul lecției 22.

   ÎNCĂRCARE (după motor.js și paint.js, paint-selectie.js, paint-imagine.js, paint-culori.js, paint-text.js):
     <script src="../../_sim/paint-proba.js"></script>
     PaintProba.configureaza({titlu:'Proba de antrenament', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:12},…]});
     tipuri:{paintw:PaintProba.sim, paintimg:PaintProba.img, probapaint:PaintProba.proba, probaimg:PaintProba.probaImg,
             probaalege:PaintProba.alegere, afisproba:PaintProba.afis}

   TIPURI
   - paintw  (FĂRĂ puncte) = PaintText.creeaza([PaintProba.ext]): Paint-ul lecției 22 + testele de mai jos. Pentru pașii lecției.
   - paintimg (FĂRĂ puncte) = PaintImagine.creeaza(): Paint-ul lecției 20 (Redimensionați și înclinați), neschimbat.
   - probapaint / probaimg (CU puncte) = aceleași, învelite. Q-ul tipului de bază (start, checks, sol, gresit, fs, folderElev,
     descarca…), plus:
       proba:'C2'          id-ul cerinței din configureaza (fără el sau cu un id necunoscut: tipul de bază, neschimbat);
       checks[i].puncte    punctele testului (suma = punctele cerinței); testele fără `puncte` nu se punctează (doar bifă);
       checks[i].ceInainte textul testului PÂNĂ la prima verificare (când textul adevărat ar da răspunsul);
       checks[i].paza      punctele lui doar dacă a trecut și un test de lucru (fără paza) al aceleiași cerințe
                           („fișierul colegului a rămas neatins” e adevărat și dacă n-ai făcut nimic);
       checks[i].lectia    unde recitești (HTML: legătura directă la pas, `../m3-l20/?vezi=p4`).
   - probaalege (CU puncte): q, o:[…], ok, amesteca?, mesaje:{indice:'…'}, puncte, ce, lectia, why, ajutor.
       Punctele = PRIMA alegere (ca la lucrare). Apoi ca alegerea motorului: greșit → încă o încercare; după două, răspunsul.
   - afisproba (FĂRĂ puncte; versiunea 2, 02.11.2026, după judecata 1, punctul E) = Paint-ul lecției 22 + testele de mai jos, ca
       ultim „Încă un exercițiu” al probei: tot produsul pe o singură pânză. Scoate panoul probei și rezumatul de pe ecran și pune
       în locul lor un rând „fără puncte” (cu punctajul probei, dacă e gata). Q-ul tipului de bază.

   CONFIGURAȚIA (configureaza): titlu, oficiu, parti, itemi (ca mai sus) + dupaFinal?:'HTML' (v2: un paragraf adăugat la sfârșitul
     rezumatului, de exemplu ce urmează pe telefon și ce urmează la calculator).

   TESTE NOI (checks[].k), în PaintProba.ext.verifica (orice alt test rămâne al lanțului):
   - ppFisier{folder?, re?, ext?, nou?} — un fișier de pe discul simulat: în folderul dat (fără folder: în ORICE folder), cu
       extensia dată ('png' | 'jpg'; 'jpg' primește și .jpeg / .jpe / .jfif, ca „Salvare cu tipul” JPEG din paint.js), cu numele
       (fără extensie, litere mici, fără diacritice, fără spații la capete) potrivit cu re, salvat de elev (nou: rev > 0). Așa,
       o greșeală de folder și una de nume se judecă SEPARAT (fiecare își pierde doar punctele ei).
   - ppSub{are, min} — textul cu cuvintele `are` e lipit, o singură dată, se vede aproape întreg (≥ 95 % din litere: nimic nu-l
       acoperă) și SUB marginea de jos a literelor lui văzute (toleranță 4 unități) stau cel puțin `min` forme ale elevului
       (din Forme, fără etichetă, cel puțin 90 % văzute). Mesajele (t.msg) le scrie testul, din starea de ACUM:
       msgFaraText / msgDeDouaOri / msgAcoperit / msgPutine — fiecare o propoziție a lecției.
       v2 (J1-A, o scăpare se pedepsește o singură dată): oriceText?:true = formele se judecă sub textul CEL MAI DE SUS al elevului
       (orice ar scrie în el; cuvântul îl judecă alt test), fără msgDeDouaOri; (sonnet M-4) două forme care stau aproape una peste
       alta (dreptunghiurile lor se suprapun pe mai mult de jumătate din cel mai mare) se numără ca una, cu msgSuprapuse?.
   TESTE NOI în versiunea 2 (02.11.2026, după judecata 1):
   - ppText{…opțiunile testului text din paint-text.js…, aproapeLitere?:N} — testul `text` al lui paint-text.js, neschimbat (îl
       cheamă prin PaintText.ext.verifica), plus: când textul cerut lipsește și niciun mesaj mai precis nu s-a ales, iar sus (cu
       sus) e un text văzut ale cărui litere (fără spații, litere mici, fără diacritice) diferă de cele cerute prin cel mult N
       litere (una lipsă / în plus / schimbată = 1) → msgAproape cu {t} = textul lui, întocmai, + refaUltim (după el nu mai e
       nimic în istoric: ↶ îl scoate doar pe el) sau refaTot (după el mai e ceva: pleacă și acela).
   - ppSingur{are, msg:'…{t}…', refaUltim, refaTot} — pe pânză nu e niciun text văzut (≥ 30 %) fără cuvintele `are`: un titlu
       greșit rămas lângă cel bun oprește „Corect” și e numit întocmai (primul din istoric); refaUltim / refaTot ca mai sus.
   - ppColorat{msgLinii?} — cel puțin o formă ÎNCHISĂ a elevului (din Forme, fără etichetă; nu Linie, nu Curbă) e colorată pe
       dinăuntru: umplerea formei e alta decât albul (#ffffff) sau pixelul din mijlocul ei nu e alb și nici culoarea din jurul
       formei (fundalul); orice culoare din paletă trece (J1-C: Lavandă #c8bfe7 era socotită „alb” de familie()). msgLinii: pe
       pânză sunt doar linii / curbe.
   - ppFundal{maxAlb?:0.5} — fundalul pânzei nu mai e alb: din 26 × 16 puncte ale pânzei, cel mult maxAlb sunt albe.
   VERSIUNEA 3 (02.11.2026, după judecata 2; schimbările de comportament sunt în granița m4_noapte_01_11\granite\v_l23.md):
   - ppColorat (J2-X): pixelul din mijlocul dreptunghiului formei cădea, la Triunghi dreptunghic, pe ipotenuză (pe contur), deci o
       formă goală ieșea „colorată”. Acum se judecă INTERIORUL formei: o grilă de 14 × 14 puncte în dreptunghiul ei, din care rămân
       doar cele dinăuntrul conturului (PaintSelectie.scena), la cel puțin 5 unități de orice contur sau urmă de pe pânză (conturul
       nu se citește, oricare i-ar fi culoarea), în afara literelor văzute și a formelor închise mai mici puse peste ea (fereastra
       unei case); forma e colorată dacă cel puțin jumătate din punctele rămase nu sunt albe și nici culoarea din jurul ei.
   - ppText{titlu:'ziua cartii', titluLitere?:N, …opțiunile testului text…} (J2-AB): testul text din paint-text.js judecă TITLUL
       recunoscut după cuvinte: un text văzut cu cuvintele lui `titlu` (sau, cu titluLitere, unul ale cărui litere diferă prin cel
       mult N, ca „Ziua cărți” — IV.2 §7: celelalte teste se judecă pe textul scris de elev); fără niciunul, ca înainte
       (celMaiMare: textul cel mai mare). Un text în plus, mai mare, nu mai ia punctele titlului; îl numește ppSingur.
   - rezumatul (J2-Z, IV.2 §7): după nivelul elevului, toate cele cinci niveluri, din notă.
   VERSIUNEA 4 (02.11.2026, după judecata 3, punctul AC; ADITIVĂ: fără opțiunea nouă, totul merge ca în versiunea 3):
   - ppSub{…, sauCaseta?:true} (J3-AC): și textul din caseta de text ÎNCĂ DESCHISĂ intră printre textele judecate, cu literele
       lui exact unde le lipește clicul în afară (PaintText.randeaza, cu fontul, mărimea și stilul din bara casetei; caseta stă
       deasupra desenului, deci se vede întreagă). Ca la testul text{sauCaseta} din paint-text.js: caseta lăsată deschisă se
       judecă o singură dată, de testul casetaInchisa (0 p), nu și de ppSub; msgFaraText rămâne doar pentru pânza fără niciun
       text, nici lipit, nici în casetă.
   VERSIUNEA 5 (02.11.2026, după judecata 4, punctele AD și AE; fără funcții noi; schimbările de comportament sunt în granița):
   - caseta încă deschisă se judecă după literele ei VĂZUTE, ca un text lipit (J4-AD): casetaText pune imaginea casetei peste pânza
       de acum, exact cum o pune clicul în afară, și numără literele care se văd după regula lui PaintText.vede (v = cât se vede,
       r = dreptunghiul literelor văzute, sub = culoarea de sub litere). Cu sauCaseta, ppSub și ppText iau caseta în seamă doar
       cu v ≥ 0,6 (litere albe pe alb nu mai iau puncte); ppText{sauCaseta, msgCuloareFundal, culori?}: caseta are litere care nu
       se văd și niciun mesaj mai precis nu s-a ales → msgCuloareFundal, cu {ori} = „o dată” (↶ cu caseta deschisă scoate tot textul
       din ea), {dupa} = „” și {tip} / {culori} pe culoarea de sub litere, ca sfatul din paint-text.js.
   - ppSub (J4-AE): formele se judecă după ce SE VEDE acum — punctele unei forme aflate în dreptunghiul unui text cu „Umplere
       fundal” lipit DUPĂ ea (sau, cu sauCaseta, al casetei încă deschise cu „Umplere fundal”) sunt acoperite (ca la `alb` în
       PaintSelectie.scena); mesajul rămâne msgPutine.

   CE FACE (ca V/17)
   1. Punctele unei cerințe se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică” (la alegere: prima variantă aleasă).
      Ce repară elevul după aceea e exercițiu și nu schimbă punctele. Fiecare test își are punctele lui.
   2. „Verifică” pe Paint-ul NEATINS (desenul, mărimea pânzei, fișierele și caseta de text ca la pornire) nu socotește nimic și o
      spune. Cât e deschisă o fereastră (Salvare ca, „există deja”, „Salvați lucrul?”, Redimensionare și înclinare), nu se socotește
      nimic: elevul o termină sau o închide, apoi apasă iar „Verifică”.
   3. Până la prima verificare nu se văd bifele și nici „Am nevoie de un indiciu”; lista rămâne „Ce se verifică”, cu textele
      `ceInainte`. După prima verificare: blocul „Punctele cerinței X, de la prima verificare” (doar testele pierdute) și lista vie.
   4. Panoul probei, deasupra cerinței: unde ești, punctele de până acum, „Sunt alt elev / Încep din nou”; după ultima cerință:
      părțile, oficiul, punctajul, nota, nivelul și „unde ai pierdut puncte”, cu lecția de recitit.
   5. Nimic din probă nu se scrie în localStorage, sessionStorage sau pe server: totul stă în memoria paginii. Singura excepție:
      un SEMN fără date, sessionStorage 'v23_proba_golita' = '1', lăsat la plecarea paginii cu proba începută și șters la pornire,
      ca panoul să spună că proba s-a golit. Proba se golește și se reia de la prima cerință la „Sunt alt elev / Încep din nou”
      și când se schimbă elevul din caseta prezenta.js (evenimentul `prezenta` și, ca plasă, la fiecare „Verifică”) — regula 23.
   Global: window.PaintProba {versiune, configureaza, ext, sim, img, proba, probaImg, alegere, afis (v2), stare, goleste, nota,
     nivel, puncte(id), DESENE}. Versiunea 2 (02.11.2026) e ADITIVĂ: ce exista în versiunea 1 merge la fel, în afară de rezumat,
     unde nivelul e atribuit („Nivelul, după regula profesorului tău: …”, ghidul IV.2 §2). Desenele lecției (în PaintSim.DESENE, prefixul pp_): pp_afis (pânza 800 × 499: fundal crem, o carte =
     dreptunghi albastru, un soare = oval galben, etichetate carte / soare, deci NU sunt numărate de `forma` ca forme ale elevului).
   Stilul: <style id="pp-css">, clasele cu prefixul pp-.
   ====================================================================================================== */
(function(){
'use strict';
const PS=window.PaintSim,PSel=window.PaintSelectie,PT=window.PaintText,PI=window.PaintImagine,PC=window.PaintCulori;
if(!PS||!PSel||!PT||!PT.creeaza){if(window.console)console.error('paint-proba.js: încarcă întâi paint.js, paint-selectie.js, paint-culori.js și paint-text.js');return}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const txt=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const cuvinte=s=>norm(s).split(' ').filter(Boolean);
const areCuv=(text,cer)=>{const w=cuvinte(text);return cuvinte(cer).every(c=>w.includes(c))};

/* ---------------- desenele lecției 23 (pânza 800 × 499, ca după Pixeli · Orizontal 800 cu lanțul albastru) ---------------- */
const F=(fel,x1,y1,x2,y2,c,f,tag)=>({u:'forma|'+fel+'|3'+(c?'|c='+c:'')+(f?'|f='+f:'')+(tag?'#'+tag:''),p:[[x1,y1],[x2,y2]]});
const U=(n,x,y,hex)=>({u:'umplere|'+n+'|c='+hex,p:[[x+n*1e-7,y]]});
const DESENE_NOI={
  /* afișul de la C3, B1, B2: fundal crem (Umplere), o carte (dreptunghi albastru, contur albastru închis) și un soare (oval galben,
     contur portocaliu), jos, ca să rămână loc sus pentru titlu */
  pp_afis:[U(990301,6,6,'efe4b0'),F('dreptunghi',110,270,330,450,'3f48cc','99d9ea','carte'),F('oval',540,280,700,440,'ff7f27','fff200','soare')]
};
Object.keys(DESENE_NOI).forEach(k=>{if(PS.DESENE)PS.DESENE[k]=DESENE_NOI[k]});

/* ---------------- testele noi (în lanțul Paint-ului lecției 22) ---------------- */
const EXT_JPG=['jpg','jpeg','jpe','jfif'];
const extOk=(e,cer)=>{e=String(e||'').toLowerCase();cer=String(cer||'').toLowerCase();return cer==='jpg'?EXT_JPG.includes(e):e===cer};
function fisiere(S){return [...S.fs.f.entries()].map(([k,f])=>{const d=k.split('/').slice(0,-1).join('/'),n=k.split('/').pop(),m=/^(.*)\.([a-z0-9]+)$/i.exec(n);
  return {cale:k,dir:d,baza:m?m[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim():n.toLowerCase(),ext:m?m[2].toLowerCase():'',rev:f.rev||0}})}
/* toate textele lipite, cu ce se vede din ele acum (v = cât se vede, r = [x1,y1,x2,y2] ale literelor văzute, sus) */
const toateTextele=S=>PT.texte(S).map(it=>Object.assign({},it,PT.vede(S,it)));
function textul(S,are){return toateTextele(S).filter(it=>it.v>=.6&&areCuv(it.T.text,are))}
/* v2: textul elevului numit întocmai într-un mesaj (un rând, cel mult 40 de semne, fără HTML) — ca numeText din paint-text.js */
const numeT=s=>{const x=String(s||'').replace(/\s+/g,' ').trim();return esc(x.length>40?x.slice(0,40)+'…':x)};
const litere=s=>norm(s).replace(/ /g,'');
/* v2: câte litere lipsesc / sunt în plus / sunt schimbate de la a la b (distanța de editare; peste 3 nu mai contează) */
function dist(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>3)return 9;let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const q=[i];for(let j=1;j<=n;j++)q[j]=Math.min(p[j]+1,q[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=q}return p[n]}
/* v2: textul n e ULTIMUL lucru din istoric — tot ce e în desen de la prima lui intrare încolo ține de el (↶ îl scoate doar pe el) */
function ultimul(S,L,n){const kn=new Set(L.filter(it=>it.n===n).map(it=>it.k));if(!kn.size)return false;
  for(let k=Math.min(...kn);k<(S.desen||[]).length;k++)if(!kn.has(k))return false;return true}
const hx=v=>{v=String(v||'').trim().toLowerCase().replace(/^#/,'');return v.length===3?v.split('').map(z=>z+z).join(''):v};
const DESCHISE=['linie','curba'];
/* culoarea din jurul unei forme: cea mai des întâlnită în 8 puncte la 6 unități în afara dreptunghiului ei (pe pânză) */
function inJur(S,a,b){const x1=Math.min(a[0],b[0])-6,x2=Math.max(a[0],b[0])+6,y1=Math.min(a[1],b[1])-6,y2=Math.max(a[1],b[1])+6,cx=(x1+x2)/2,cy=(y1+y2)/2;
  const w=S.w||1038,h=S.h||648,cnt={};let best=null,bn=0;
  [[x1,y1],[cx,y1],[x2,y1],[x1,cy],[x2,cy],[x1,y2],[cx,y2],[x2,y2]].forEach(([x,y])=>{if(x<0||y<0||x>=w||y>=h)return;
    const k=hx(PC.pixel(S,[x,y]));cnt[k]=(cnt[k]||0)+1;if(cnt[k]>bn){bn=cnt[k];best=k}});
  return best||'ffffff'}
/* v3 (J2-X): forma e colorată pe dinăuntru — punctele judecate sunt în INTERIORUL ei, departe de orice contur (vezi capul fișierului) */
function inPoli(q,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const xi=P[i][0],yi=P[i][1],xj=P[j][0],yj=P[j][1];
  if(((yi>q[1])!==(yj>q[1]))&&(q[0]<(xj-xi)*(q[1]-yi)/((yj-yi)||1e-9)+xi))c=!c}return c}
const cutie=P=>{const xs=P.map(q=>q[0]),ys=P.map(q=>q[1]);return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]};
const arieC=r=>(r[2]-r[0])*(r[3]-r[1]);
function colorataInauntru(S,I,sc,lit){
  const P=I.pts,R=cutie(P),ar=arieC(R);
  if(Math.min(R[2]-R[0],R[3]-R[1])<12)return false;
  const urme=[];sc.forEach(J=>{if(J.o&&J.o.t!=='umplere')J.pts.forEach(q=>urme.push(q))});
  const peste=sc.filter(J=>J!==I&&J.o&&J.o.t==='forma'&&!DESCHISE.includes(J.o.fel)&&J.pts.length>2&&arieC(cutie(J.pts))<ar);
  const jur=inJur(S,[R[0],R[1]],[R[2],R[3]]);
  for(const [N,M] of [[14,5],[30,3]]){let n=0,col=0;
    for(let a=0;a<N;a++)for(let b=0;b<N;b++){const q=[R[0]+(a+.5)*(R[2]-R[0])/N,R[1]+(b+.5)*(R[3]-R[1])/N];
      if(!inPoli(q,P))continue;
      if(urme.some(u=>(u[0]-q[0])*(u[0]-q[0])+(u[1]-q[1])*(u[1]-q[1])<M*M))continue;
      if(lit.some(r=>q[0]>=r[0]-3&&q[0]<=r[2]+3&&q[1]>=r[1]-3&&q[1]<=r[3]+3))continue;
      if(peste.some(J=>inPoli(q,J.pts)))continue;
      n++;const m=hx(PC.pixel(S,q));if(m!=='ffffff'&&m!==jur)col++}
    if(n)return col*2>=n}
  return false}
/* v3 (J2-AB): cuvintele titlului scris de elev — `titlu` dacă un text văzut (sau caseta deschisă, cu sauCaseta) le are; altfel,
   cu titluLitere, cuvintele textului văzut cel mai vechi ale cărui litere diferă prin cel mult titluLitere; altfel null */
function titlulScris(S,t){
  const L=toateTextele(S).filter(it=>it.v>=.6&&it.T&&String(it.T.text||'').trim());
  const box=t.sauCaseta&&S.ptx&&S.ptx.box&&String(S.ptx.box.text||'').trim()?String(S.ptx.box.text):'';
  if(L.some(it=>areCuv(it.T.text,t.titlu))||(box&&areCuv(box,t.titlu)))return t.titlu;
  if(t.titluLitere){const cer=litere(t.titlu),ap=L.filter(it=>dist(litere(it.T.text),cer)<=t.titluLitere);
    if(ap.length)return norm(ap.slice().sort((x,y)=>x.k-y.k)[0].T.text);
    if(box&&dist(litere(box),cer)<=t.titluLitere)return norm(box)}
  return null}
/* v4 (J3-AC): textul din caseta încă deschisă, ca după clicul în afară (fixeaza din paint-text.js: aceleași litere, la locul
   casetei): r = dreptunghiul literelor; null fără casetă sau cu caseta goală.
   v5 (J4-AD): v = cât din litere SE VĂD, ca la un text lipit (înainte: mereu 1, deci și litere albe pe alb „se vedeau”): pânza de
   acum, cu imaginea casetei pusă peste ea exact cum o pune clicul în afară (PaintText.randeaza, la colțul casetei), judecată cu
   regula lui PaintText.vede (o literă se vede dacă cel puțin jumătate din vecinii ei din afara literelor, în cele 4 direcții, au
   altă culoare decât ea: diferența > 60); r = dreptunghiul literelor văzute (ca la vede); sub = culoarea de sub litere (cu
   „Umplere fundal”: Culoare 2; altfel cea mai des întâlnită pe pânză sub ele); plin (J4-AE) = dreptunghiul imaginii casetei cu
   „Umplere fundal” (după clicul în afară acoperă tot ce e sub el), altfel null */
let CB_K='',CB_R=null,CB_X=null,CB_V=null;
const DIR4=[[1,0],[-1,0],[0,1],[0,-1]];
function vedeCaseta(Rp,X,bx,by){
  const W=Rp.w,H=Rp.h,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d',{willReadFrequently:true});
  g.drawImage(Rp.cv,0,0);g.drawImage(X.cv,bx,by);
  const d=g.getImageData(0,0,W,H).data,d0=Rp.d,mg=X.mg,fw=X.w,fh=X.h,cnt=new Map();
  const inM=(x,y)=>x>=0&&y>=0&&x<fw&&y<fh&&mg[y*fw+x]===1;
  let n=0,st=Infinity,sus=Infinity,dr=-1,jos=-1;
  for(let y=0;y<fh;y++)for(let x=0;x<fw;x++){if(mg[y*fw+x]!==1)continue;const X0=bx+x,Y0=by+y;if(X0<0||Y0<0||X0>=W||Y0>=H)continue;
    const i=(Y0*W+X0)*4,h0=(d0[i]<<16)|(d0[i+1]<<8)|d0[i+2];cnt.set(h0,(cnt.get(h0)||0)+1);
    let gas=0,nj=0;
    for(const u of DIR4){let s=1;while(s<=16&&inM(x+u[0]*s,y+u[1]*s))s++;if(s>16)continue;
      if(!inM(x+u[0]*(s+1),y+u[1]*(s+1)))s++;
      const XX=X0+u[0]*s,YY=Y0+u[1]*s;if(XX<0||YY<0||XX>=W||YY>=H)continue;
      const j=(YY*W+XX)*4;gas++;if(Math.abs(d[j]-d[i])+Math.abs(d[j+1]-d[i+1])+Math.abs(d[j+2]-d[i+2])>60)nj++}
    if(gas&&nj*2>=gas){n++;if(X0<st)st=X0;if(X0>dr)dr=X0;if(Y0<sus)sus=Y0;if(Y0>jos)jos=Y0}}
  let b=null,bn=0;cnt.forEach((v,h)=>{if(v>bn){bn=v;b=h}});
  return {v:X.ng?n/X.ng:0,r:n?[st,sus,dr+1,jos+1]:null,sub:b==null?null:'#'+b.toString(16).padStart(6,'0')}}
function casetaText(S){const P=S.ptx,B=P&&P.box;if(!B||!String(B.text||'').trim())return null;
  const T={text:String(B.text),font:P.font,marime:P.marime,b:!!P.b,i:!!P.i,u:!!P.u,s:!!P.s,al:P.al,fundal:!!P.fundal,x:B.x,y:B.y,w:B.w,h:B.h};
  const c1=(S.pc&&S.pc.c1)||'#000000',c2=(S.pc&&S.pc.c2)||'#ffffff',k=JSON.stringify([T,c1,c2]);
  if(k!==CB_K){CB_K=k;CB_R=null;CB_X=null;CB_V=null;
    try{if(typeof PT.randeaza==='function'){const R=PT.randeaza(T,c1,c2),bx=Math.round(B.x),by=Math.round(B.y);let x0=Infinity,y0=Infinity,x1=-1,y1=-1;
      for(let y=0;y<R.h;y++)for(let x=0;x<R.w;x++)if(R.mg[y*R.w+x]===1){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
      if(x1>=0)CB_R=[bx+x0,by+y0,bx+x1+1,by+y1+1];CB_X={R,bx,by}}}catch(e){CB_R=null;CB_X=null}}
  /* v5 (J4-AD, J4-AE): ce se vede din litere, culoarea de sub ele și dreptunghiul plin (Umplere fundal) */
  let v=1,r=CB_R||[B.x,B.y,B.x+B.w,B.y+B.h],sub=T.fundal?c2:null,plin=null;
  if(CB_X){const X=CB_X.R;if(T.fundal)plin=[CB_X.bx,CB_X.by,CB_X.bx+X.w,CB_X.by+X.h];
    try{const Rp=PC.raster(S);if(!CB_V||CB_V.k!==Rp.k)CB_V=Object.assign({k:Rp.k},vedeCaseta(Rp,X,CB_X.bx,CB_X.by));
      v=CB_V.v;if(CB_V.r)r=CB_V.r;if(!T.fundal)sub=CB_V.sub}catch(e){v=1}}
  return {caseta:true,T,v,r,sub:sub||'#ffffff',plin}}
/* v5 (J4-AE): dreptunghiurile pline ale textelor cu „Umplere fundal” (Culoare 2 peste tot dreptunghiul imaginii lor): k = locul lor
   în istoric (acoperă doar ce e desenat ÎNAINTE de ele), z = zonele bucăților mutate cu Selectare care le-au dus (în afara lor nu
   acoperă); caseta încă deschisă cu „Umplere fundal” (doar cu sauCaseta) acoperă tot desenul de acum */
function pline(S,cb){const L=[];
  PT.texte(S).forEach(it=>{if(!it.T||!it.T.fundal||!it.F)return;const x=it.F.bx+(it.dx||0),y=it.F.by+(it.dy||0);
    L.push({k:it.k,r:[x,y,x+it.F.w,y+it.F.h],z:it.tai||[]})});
  if(cb&&cb.plin)L.push({k:Infinity,r:cb.plin,z:[]});
  return L}
const inZona=(t,q)=>{const f=t.f,a=q[0]-t.dx,b=q[1]-t.dy;return f.p?inPoli([a,b],f.p):(a>=f.r[0]&&b>=f.r[1]&&a<f.r[0]+f.r[2]&&b<f.r[1]+f.r[3])};
const acoperit=(L,q,k)=>L.some(p=>p.k>k&&q[0]>=p.r[0]&&q[0]<p.r[2]&&q[1]>=p.r[1]&&q[1]<p.r[3]&&p.z.every(t=>inZona(t,q)));
function verifica(t,c){const S=c.S;
  switch(t.k){
    case 'ppFisier':{const re=t.re?new RegExp(t.re,'i'):null,dir=t.folder?String(t.folder).replace(/\\/g,'/').replace(/\/$/,''):null;
      return fisiere(S).some(f=>(!dir||f.dir===dir)&&(!t.ext||extOk(f.ext,t.ext))&&(!t.nou||f.rev>0)&&(!re||re.test(f.baza)))}
    case 'ppSub':{if(!S.pornit)return false;
      if(t.msg0==null)t.msg0=t.msg||'';t.msg=t.msg0;
      let T;const cb=t.sauCaseta?casetaText(S):null;   /* v4 (J3-AC): și textul casetei încă deschise */
      const cbV=cb&&cb.v>=.6?cb:null;   /* v5 (J4-AD): caseta intră printre texte doar cu literele văzute (≥ 60 %), ca un text lipit */
      if(t.oriceText){   /* v2 (J1-A): sub textul cel mai de sus al elevului, orice ar scrie în el */
        const A=toateTextele(S).filter(it=>it.v>=.6&&it.r);if(cbV)A.push(cbV);
        if(!A.length){if(t.msgFaraText)t.msg=t.msgFaraText;return false}
        T=A.slice().sort((x,y)=>x.r[1]-y.r[1])[0];
      }else{
        const A=textul(S,t.are);if(cbV&&areCuv(cbV.T.text,t.are))A.push(cbV);
        if(!A.length){if(t.msgFaraText)t.msg=t.msgFaraText;return false}
        if(A.length>1){if(t.msgDeDouaOri)t.msg=t.msgDeDouaOri;return false}
        T=A[0]}
      if(T.v<.95||!T.r){if(t.msgAcoperit)t.msg=t.msgAcoperit;return false}
      const jos=T.r[3]-4;
      /* v5 (J4-AE): ce acoperă un text cu „Umplere fundal” (lipit după formă sau în caseta deschisă) nu se mai vede */
      const PL=pline(S,cb);
      const sub=PSel.scena(S.desen).filter(I=>I.o&&I.o.t==='forma'&&!I.tag).filter(I=>{
        const vz=PL.length?I.vis.map((z,j)=>z&&!acoperit(PL,I.pts[j],I.k)?1:0):I.vis;
        const vis=I.pts.filter((q,j)=>vz[j]),fr=vz.reduce((a,b)=>a+b,0)/(I.n0||I.pts.length||1);
        if(!vis.length||fr<.9)return false;return Math.min(...vis.map(q=>q[1]))>=jos});
      /* v2 (sonnet M-4): două forme aproape una peste alta se numără ca una (suprapunerea > jumătate din dreptunghiul celei mai mari) */
      const R=I=>{const xs=I.pts.map(q=>q[0]),ys=I.pts.map(q=>q[1]);return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]};
      const arie=r=>Math.max(1,(r[2]-r[0])*(r[3]-r[1]));
      const peste=(a,b)=>Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0]))*Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]))>.5*Math.max(arie(a),arie(b));
      const puse=[];sub.forEach(I=>{const r=R(I);if(!puse.some(p=>peste(p,r)))puse.push(r)});
      if(puse.length>=(t.min||2))return true;
      if(t.msgSuprapuse&&sub.length>=(t.min||2))t.msg=t.msgSuprapuse;else if(t.msgPutine)t.msg=t.msgPutine;return false}
    /* v2 (J1-A/B): testul text din paint-text.js, neschimbat, + numirea unui text cu o literă greșită (cuvântul de la A1) */
    case 'ppText':{
      /* v5 (J4-AD): cu sauCaseta, caseta deschisă intră în testul text din paint-text.js doar dacă literele ei SE VĂD (casetaText:
         v ≥ 0,6), ca un text lipit — acolo caseta e socotită mereu văzută */
      const cb=t.sauCaseta?casetaText(S):null,cbV=!cb||cb.v>=.6;
      /* v3 (J2-AB): cu `titlu`, testul judecă titlul recunoscut după cuvinte (sau aproape, cu titluLitere); altfel, ca t (celMaiMare) */
      if(t.titlu){if(t._msgB==null)t._msgB=t.msg||'';
        const are=titlulScris(S,cbV?t:Object.assign({},t,{sauCaseta:false}));
        const J=Object.assign({},t,{k:'text',msg:t._msgB,msg0:undefined,titlu:undefined,_msgB:undefined,sauCaseta:!!t.sauCaseta&&cbV},are?{are,celMaiMare:false}:{});
        const r=PT.ext.verifica(J,c);t.msg=J.msg;return !!r}
      const I=t._in||(t._in=Object.assign({},t,{k:'text'}));I.sauCaseta=!!t.sauCaseta&&cbV;
      const r=PT.ext.verifica(I,c);t.msg=I.msg;
      if(r)return true;
      if(t.aproapeLitere&&t.msgAproape&&t.are&&(I.msg0==null||I.msg===I.msg0)){
        const L=toateTextele(S),cer=litere(t.are);
        const ap=L.filter(it=>it.F&&it.F.mg&&it.v>=.6&&it.r&&!areCuv(it.T.text,t.are)&&(!t.sus||(it.sus!=null&&it.sus<S.h/2))&&dist(litere(it.T.text),cer)<=t.aproapeLitere);
        if(ap.length){const a=ap.slice().sort((x,y)=>x.k-y.k)[0];
          t.msg=t.msgAproape.replace('{t}',()=>numeT(a.T.text))+' '+((ultimul(S,L,a.n)?t.refaUltim:t.refaTot)||'')}}
      /* v5 (J4-AD): caseta deschisă are litere care nu se văd (au culoarea a ce e sub ele) și niciun mesaj mai precis nu s-a ales →
         msgCuloareFundal: {ori} = „o dată” (↶ cu caseta deschisă scoate tot textul din ea, paint-text.js J1-G), {dupa} = „”,
         {tip} / {culori} pe culoarea de sub litere, ca sfatul din paint-text.js (culorile din t.culori cu contrast ≥ t.contrast sau 3) */
      if(cb&&!cbV&&t.msgCuloareFundal&&t.msg===I.msg0){const f=cb.sub,alb=PT.contrast('#ffffff',f)>PT.contrast('#000000',f);
        const L=((t.culori&&(alb?t.culori.deschise:t.culori.inchise))||[]).filter(x=>PT.contrast(x[1],f)>=(t.contrast||3));
        const nume=(L.length?L:[alb?['alb','#ffffff']:['negru','#000000']]).map(x=>x[0]).join(', ');
        t.msg=t.msgCuloareFundal.replace('{ori}','o dată').replace('{dupa}','').split('{tip}').join(alb?'deschisă':'închisă').split('{culori}').join(nume)}
      return false}
    /* v2 (J1-B, ca textSub{msgAlt} de la V/22): pe pânză nu mai e niciun text văzut fără cuvintele cerute */
    case 'ppSingur':{if(!S.pornit)return false;
      if(t.msg0==null)t.msg0=t.msg||'';t.msg=t.msg0;
      const L=toateTextele(S),alt=L.filter(it=>it.v>=.3&&it.r&&!areCuv(it.T.text,t.are));
      if(!alt.length)return true;
      const kmin=n=>Math.min(...L.filter(it=>it.n===n).map(it=>it.k)),a=alt.slice().sort((x,y)=>kmin(x.n)-kmin(y.n))[0];
      t.msg=t.msg0.replace('{t}',()=>numeT(a.T.text))+' '+((ultimul(S,L,a.n)?t.refaUltim:t.refaTot)||'');return false}
    /* v2 (J1-C, sonnet M-3): o formă închisă a elevului e colorată pe dinăuntru — orice culoare în afară de alb și de fundalul ei */
    case 'ppColorat':{if(!S.pornit)return false;
      if(t.msg0==null)t.msg0=t.msg||'';t.msg=t.msg0;
      let inchise=0,deschise=0,ok=false;
      (S.desen||[]).forEach(s=>{const o=PSel.parse(s.u);if(o.t!=='forma'||o.tag||!s.p||!s.p.length)return;
        if(DESCHISE.includes(o.fel)){deschise++;return}inchise++;
        if(o.f&&hx(o.f)!=='ffffff')ok=true});
      /* v3 (J2-X): interiorul real al formelor (al celor din desen și al copiilor mutate cu Selectare), nu mijlocul dreptunghiului lor */
      if(!ok&&inchise){const sc=PSel.scena(S.desen),lit=toateTextele(S).filter(it=>it.v>0&&it.r).map(it=>it.r);
        ok=sc.some(I=>I.o&&I.o.t==='forma'&&!I.tag&&!DESCHISE.includes(I.o.fel)&&I.pts.length>2&&
          I.vis.reduce((a,b)=>a+b,0)>=.5*I.pts.length&&colorataInauntru(S,I,sc,lit))}
      if(!ok&&!inchise&&deschise&&t.msgLinii)t.msg=t.msgLinii;
      return ok}
    /* v2 (J1-E): fundalul pânzei nu mai e alb */
    case 'ppFundal':{if(!S.pornit)return false;const R=PC.raster(S);let alb=0,tot=0;
      for(let a=0;a<26;a++)for(let b=0;b<16;b++){const X=Math.round((a+.5)*R.w/26),Y=Math.round((b+.5)*R.h/16),i=(Y*R.w+X)*4;tot++;if(R.d[i]===255&&R.d[i+1]===255&&R.d[i+2]===255)alb++}
      return alb/tot<=(t.maxAlb==null?.5:t.maxAlb)}
  }
  return null;
}
const EXT={verifica};

/* ---------------- configurația și starea probei (doar în memorie) ---------------- */
let CFG={titlu:'Proba de antrenament',oficiu:10,parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},itemi:[]};
/* prima[id] = {teste:[{ce, puncte, ok, lectia, motiv}]} — prima verificare a fiecărei cerințe; cine = elevul din caseta
   prezenta.js la prima verificare ('null' = fără nume); nota = un rând de spus în panou */
const ST={prima:{},nota:'',cine:''};
let curent=null;   // cerința de pe ecran: {id, body, ascunde}

function css(){
  if(document.getElementById('pp-css'))return;
  const s=document.createElement('style');s.id='pp-css';
  s.textContent=`
.pp-panou{border:2px dashed var(--accent);border-radius:8px;padding:8px 12px;margin:6px 0 10px;background:var(--paper2);text-align:left}
.pp-panou p{margin:.3em 0}
.pp-panou .pp-cap{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;justify-content:space-between}
.pp-panou .pp-et{font-weight:700;color:var(--accent)}
.pp-panou ul{margin:.3em 0 .3em 1.2em;padding:0}
.pp-panou li{margin:.25em 0}
.pp-panou a{color:var(--accent);display:inline-block;padding:4px 0}
.pp-panou details summary{min-height:32px;display:flex;align-items:center;cursor:pointer;color:var(--accent);font-weight:600}
.pp-panou .pp-nota{border-left:4px solid var(--accent);padding:4px 8px;margin:6px 0;background:var(--paper)}
.pp-panou table{border-collapse:collapse;margin:.3em 0;max-width:100%}
.pp-panou td,.pp-panou th{border:1px solid var(--line);padding:3px 8px;text-align:left}
.pp-panou .btn{min-height:36px}
.pp-puncte{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:6px 10px;margin:8px 0;background:var(--paper);text-align:left}
.pp-puncte p{margin:.25em 0}
.pp-puncte ul{list-style:none;margin:.3em 0;padding:0}
.pp-puncte li{margin:.3em 0}
.pp-puncte li.rau .s{color:var(--bad);font-weight:700}
.pp-puncte .pp-de{color:var(--ink2)}
.pp-ascuns .pt-teste li.ok{color:var(--ink)}
.pp-ascuns .pt-teste li.ok::marker{content:"• "}
.fb.pp-info{background:var(--paper2);color:var(--ink);border:1px solid var(--line);border-left:4px solid var(--accent)}`;
  document.head.appendChild(s);
}

const ids=()=>CFG.itemi.map(b=>b.id);
const primul=()=>ids()[0];
const cunoscut=id=>!!id&&ids().includes(id);
const item=id=>CFG.itemi.find(x=>x.id===id)||{id,parte:'?',puncte:0};
const inceputa=()=>Object.keys(ST.prima).length>0;
const completa=()=>ids().length>0&&ids().every(id=>ST.prima[id]);
const nrItem=id=>ids().indexOf(id)+1;
const luate=id=>{const p=ST.prima[id];return p?p.teste.reduce((s,t)=>s+(t.ok?t.puncte:0),0):0};
function goleste(nota){Object.keys(ST.prima).forEach(k=>delete ST.prima[k]);ST.nota=nota||'';ST.cine=''}
function pune(id,rez){ST.prima[id]=rez;ST.nota='';if(!ST.cine)ST.cine=cineE()}
function peParti(){const r={};Object.keys(CFG.parti).forEach(k=>{r[k]={luat:0,max:CFG.parti[k].max}});
  ids().forEach(id=>{const p=r[item(id).parte];if(p&&ST.prima[id])p.luat+=luate(id)});return r}
/* nota = punctaj : 10, rotunjit după ultima cifră (0-4: zecile; 5-9: zecile + 1); nivelul din notă (regula profesorului) */
const nota=punctaj=>Math.max(1,Math.min(10,Math.floor((punctaj+5)/10)));
const nivel=n=>n>=9?'Avansat':n>=7?'Consolidat':n>=5?'De bază':n>=3?'În formare':'În dificultate';

/* ---------------- elevul de pe scaun (caseta prezenta.js) ---------------- */
const cheieDe=x=>{try{return JSON.stringify(x||null)}catch(e){return 'null'}};
function cineE(){try{return cheieDe(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}}
const peEcran=()=>!!(curent&&curent.body&&document.body.contains(curent.body)&&document.querySelector('.pp-sus'));
function laInceput(n){
  goleste(n);
  if(!peEcran()){redeseneaza();return}
  let dus=false;
  try{if(window.JocMotor&&JocMotor.test&&typeof JocMotor.test.exercitiu==='function'){JocMotor.test.exercitiu(0);dus=true}}catch(e){dus=false}
  if(!dus||!peEcran()||curent.id!==primul())ST.nota=n+' Pagina nu te-a putut duce singură la prima cerință: apasă butonul Atelier, din bara de sus a lecției.';
  redeseneaza();
}
function schimbatElevul(k){
  if(!inceputa()||!ST.cine||k===ST.cine)return false;
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe din nou, de la '+primul()+'.');return true}
addEventListener('prezenta',e=>{schimbatElevul(cheieDe(e&&e.detail))});
const SEMN='v23_proba_golita';
addEventListener('pagehide',e=>{try{if(inceputa()&&!(e&&e.persisted))sessionStorage.setItem(SEMN,'1')}catch(x){}});
try{if(sessionStorage.getItem(SEMN)){sessionStorage.removeItem(SEMN);
  ST.nota='Pagina a pornit din nou (după înscrierea în caseta de jos sau după o reîncărcare), iar proba de antrenament începută s-a golit: nimic nu se păstrează. Începe de la prima cerință.'}}catch(e){}
function elevulAcelasi(api){
  if(schimbatElevul(cineE())){api.feedback('bad','<strong>S-a schimbat elevul din caseta de jos.</strong> Proba a început din nou, de la '+esc(primul())+'.');return false}
  return true}

/* ---------------- panoul de sus și rezumatul de la final ---------------- */
function pierdute(){
  const rate=[];
  ids().forEach(id=>{const p=ST.prima[id];if(!p)return;p.teste.forEach(t=>{if(!t.ok&&t.puncte)rate.push({id,ce:t.ce,puncte:t.puncte,lectia:t.lectia})})});
  return rate;
}
function rezumatHTML(){
  const P=peParti(),ord=['C','B','A'].filter(k=>P[k]);
  const tot=ord.reduce((s,k)=>s+P[k].luat,0)+CFG.oficiu,n=nota(tot),zeci=Math.floor(tot/10),u=tot%10;
  /* v3 (T2, durata): titlul scurt — „Ai verificat toate cele N cerințe” îl spune deja panoul de sus */
  let h=`<p><b>Rezumatul probei</b></p>
<table><tr><th>Partea</th><th>Puncte</th></tr>${ord.map(k=>`<tr><td>${k} · ${esc(CFG.parti[k].nume)}</td><td>${P[k].luat} din ${P[k].max}</td></tr>`).join('')}<tr><td>din oficiu</td><td>${CFG.oficiu}</td></tr><tr><th>Punctajul</th><th>${tot} din 100</th></tr></table>
<p>Nota pe antrenament: ${tot<20?tot+' puncte':tot+' de puncte'} au ${zeci===1?'o zece':zeci+' zeci'}, iar ultima cifră e ${u}${u>=5?`, de la 5 la 9: nota ${zeci} + 1 = <b>${n}</b>`:`, sub 5: nota <b>${n}</b>`}. Nivelul, după regula profesorului tău: <b>${nivel(n)}</b>. Cele cinci niveluri: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate.</p>`;
  const rate=pierdute();
  if(rate.length){
    const pierd=ord.map(k=>({k,p:P[k].max-P[k].luat})).sort((a,b)=>b.p-a.p);
    h+=`<p>Cele mai multe puncte le-ai pierdut la partea <b>${pierd[0].k}</b> (${pierd[0].p} din ${P[pierd[0].k].max}).</p>
<details open><summary>Unde ai pierdut puncte și ce recitești</summary><p>Testele de mai jos <b>n-au trecut</b> la prima verificare:</p><ul>${rate.map(x=>`<li>${esc(x.id)} · ✗ ${x.ce} (0 din ${x.puncte} p)${x.lectia?`. Recitește: ${x.lectia}`:'.'}</li>`).join('')}</ul></details>`;
  }else h+=`<p>Ai luat toate punctele din prima.</p>`;
  return h+`<p class="pp-nota">E nota pe antrenament: cerințele și punctele lor sunt ale paginii. Nota adevărată o dă profesorul, la proba lui.</p>`+(CFG.dupaFinal?String(CFG.dupaFinal):'');
}
function finalJos(){
  document.querySelectorAll('.pp-final').forEach(x=>x.remove());
  if(!completa())return;
  const fb=document.getElementById('fb');if(!fb||!fb.parentNode)return;
  const el=document.createElement('div');el.className='pp-panou pp-final';el.setAttribute('role','status');el.innerHTML=rezumatHTML();
  fb.parentNode.insertBefore(el,fb.nextSibling);
}
function panouHTML(id){
  const it=item(id),k=nrItem(id),N=ids().length;
  /* v3 (T2, durata): fără „partea X (N p)” și fără „(k din N cerințe)” — enunțul cerinței începe cu ele („C3 · Salvarea (14 p)”),
     iar „cerința k din N” e chiar deasupra; panoul se citește la fiecare cerință */
  let h=`<div class="pp-cap"><p><span class="pp-et">${esc(CFG.titlu)}</span> · nu intră în catalog · cerința ${k} din ${N}: ${esc(id)}</p>
<button type="button" class="btn ghost sm pp-alt">Sunt alt elev / Încep din nou</button></div>`;
  if(ST.nota)h+=`<p class="pp-nota">${esc(ST.nota)}</p>`;
  const facute=ids().filter(x=>ST.prima[x]);
  if(!facute.length)h+=`<p>Fă toată cerința, apoi apasă <b>Verifică</b>.</p>`;
  else if(!completa()){const l=facute.reduce((s,x)=>s+luate(x),0),m=facute.reduce((s,x)=>s+item(x).puncte,0);
    h+=`<p>Până acum: ${l} din ${m} p.</p>`}
  /* la final, sus doar un rând (rezumatul întreg e o singură dată, sub „Verifică”: pe telefon era de două ori, ~2500 px fiecare) */
  if(completa()){const P=peParti(),tot=['C','B','A'].reduce((s,k)=>s+(P[k]?P[k].luat:0),0)+CFG.oficiu,n=nota(tot);
    h+=`<p>Ai verificat toate cele ${N} cerințe: <b>${tot<20?tot+' puncte':tot+' de puncte'} din 100</b>, nota pe antrenament <b>${n}</b>. Rezumatul întreg, cu nivelul, cu punctele pe părți și ce recitești, e mai jos, sub butoane.</p>`}
  return h;
}
const leagaAlt=el=>{const b=el.querySelector('.pp-alt');if(b)b.onclick=()=>laInceput('Proba începe din nou, de la '+primul()+'. Ce era pe ecran s-a golit.')};
function panou(id,body){
  css();
  document.querySelectorAll('.pp-sus,.pp-afis').forEach(x=>x.remove());
  const el=document.createElement('div');el.className='pp-panou pp-sus';el.setAttribute('role','region');el.setAttribute('aria-label','Proba de antrenament');
  el.innerHTML=panouHTML(id);
  if(body.parentNode)body.parentNode.insertBefore(el,body);
  leagaAlt(el);finalJos();return el;
}
function redeseneaza(){
  if(!completa())document.querySelectorAll('.pp-final').forEach(x=>x.remove());
  if(!curent)return;const el=document.querySelector('.pp-sus');if(el){el.innerHTML=panouHTML(curent.id);leagaAlt(el)}
  if(curent.body&&document.body.contains(curent.body)&&!ST.prima[curent.id]){
    curent.body.querySelectorAll('.pp-puncte').forEach(x=>x.remove());
    if(curent.ascunde)curent.ascunde()}
  finalJos();
}
/* blocul „Punctele cerinței X, de la prima verificare”, sub lista testelor (sau sub variante) */
function blocPuncte(id,body,dupa){
  body.querySelectorAll('.pp-puncte').forEach(z=>z.remove());
  const p=ST.prima[id];if(!p||!dupa||!dupa.parentNode)return;
  const el=document.createElement('div');el.className='pp-puncte';el.setAttribute('role','status');
  const rai=p.teste.filter(t=>!t.ok);
  el.innerHTML=`<p><b>Punctele cerinței ${esc(id)}, de la prima verificare: ${luate(id)} din ${item(id).puncte} p.</b>${rai.length?' Rămân așa; ce repari acum e exercițiu.':''}</p>`
    +(rai.length?`<ul>${rai.map(t=>`<li class="rau"><span class="s">✗</span> <b>0 din ${t.puncte} p</b> · ${t.ce}${t.motiv?` <span class="pp-de">— ${esc(t.motiv)}</span>`:''}</li>`).join('')}</ul>`:'');
  dupa.parentNode.insertBefore(el,dupa.nextSibling);
}

/* ---------------- proba pe Paint: amprenta, ferestrele deschise, punctele ---------------- */
function amprenta(body){
  const sim=body._sim;if(!sim)return null;let S;try{S=sim.stare()}catch(e){return null}
  try{return JSON.stringify([S.pornit,S.w,S.h,(S.desen||[]).map(s=>s.u+':'+((s.p||[]).length)),[...S.fs.f.entries()].map(([k,f])=>k+':'+f.rev),
    S.ptx&&S.ptx.box?'casetă:'+(S.ptx.box.text||''):''])}catch(e){return null}
}
function deschisa(body){try{const S=body._sim.stare();return !!(S.dlg||S.intreb||(S.pi&&S.pi.dlg))}catch(e){return false}}
function puncteProba(checks,body){
  const sim=body._sim;
  const r=checks.filter(c=>c.puncte!=null).map(c=>{let ok=false;try{ok=!!sim.test(c)}catch(e){ok=false}
    return {ce:c._ce||c.ce,puncte:+c.puncte||0,ok,paza:!!c.paza,lectia:c.lectia||'',motiv:''}});
  const lucru=r.some(x=>!x.paza&&x.ok&&x.puncte>0);
  r.forEach(x=>{if(x.paza&&x.ok&&!lucru){x.ok=false;x.motiv='se punctează doar împreună cu restul cerinței, iar din ea n-a trecut încă nimic'}});
  return {teste:r.map(({paza,...x})=>x)};
}
function invelis(baza){
  if(!baza)return null;
  return {
    render(Q,body,api){
      css();
      const id=Q.proba;
      if(!cunoscut(id))return baza.render(Q,body,api);
      curent={id,body,ascunde:null};
      /* o copie a lui Q, cu textele `ceInainte` până la prima verificare */
      const checks=(Q.checks||[]).map(c=>Object.assign({},c,{_ce:c.ce,ce:(!ST.prima[id]&&c.ceInainte)?c.ceInainte:c.ce}));
      const Q2=Object.assign({},Q,{checks});
      let a0=null;
      const lista=()=>body.querySelector('.pt-teste'),panouT=()=>{const l=lista();return l?l.closest('.pt-panou'):null};
      const lbl=()=>{const p=panouT();return p?p.querySelector('.lbl'):null};
      function ascunde(){const r=body.querySelector('.pt');if(r)r.classList.add('pp-ascuns');const l=lbl();if(l)l.textContent='Ce se verifică (bifele și punctele apar după prima verificare)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=true}
      function arata(){const r=body.querySelector('.pt');if(r)r.classList.remove('pp-ascuns');const l=lbl();if(l)l.textContent='Testele cerinței, acum (pentru exercițiu: punctele nu se mai schimbă)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=false}
      const api2=Object.assign({},api,{
       checkButton:(fn,label)=>api.checkButton(()=>{
        if(!elevulAcelasi(api))return;
        if(!ST.prima[id]){
          if(deschisa(body)){api.feedback('bad','<strong>O fereastră e încă deschisă în Paint-ul din pagină</strong> (Salvare ca, „există deja”, Redimensionare și înclinare sau „Salvați lucrul?”). Termină ce ai început în ea sau închide-o, apoi apasă din nou „Verifică”. Abia atunci se socotesc punctele.');return}
          if(amprenta(body)===a0){api.feedback('bad','<strong>Încă n-ai lucrat nimic la cerința asta.</strong> Fă ce cere, apoi apasă „Verifică”. Punctele se socotesc la prima verificare.');return}
          pune(id,puncteProba(checks,body));
          checks.forEach(c=>{c.ce=c._ce});   // de acum, textele adevărate
          arata();redeseneaza();
        }
        fn();
        blocPuncte(id,body,panouT());
      },label)});
      baza.render(Q2,body,api2);
      a0=amprenta(body);
      curent.ascunde=ascunde;
      panou(id,body);
      if(ST.prima[id]){arata();blocPuncte(id,body,panouT())}else ascunde();
    },
    rezolva(Q,body,api){return baza.rezolva(Q,body,api)},
    gresit(Q,body,api){return baza.gresit(Q,body,api)}
  };
}

/* ---------------- alegerea cu puncte (probaalege) ---------------- */
const alegere={
  render(Q,body,api){
    css();
    const id=cunoscut(Q.proba)?Q.proba:null;
    if(id){curent={id,body,ascunde:null};panou(id,body)}
    const idx=Q.o.map((_,k)=>k),ord=Q.amesteca===false?idx:api.shuffle(idx);
    body.innerHTML=`<div class="opts">${ord.map(k=>`<button class="opt" type="button" data-k="${k}">${esc(Q.o[k])}</button>`).join('')}</div>`;
    const bs=[...body.querySelectorAll('.opt')];
    const aj=document.querySelector('.ajutor');if(aj&&id&&!ST.prima[id])aj.hidden=true;
    if(id&&ST.prima[id])blocPuncte(id,body,body.querySelector('.opts'));
    bs.forEach(b=>b.onclick=()=>{
      if(api.done()||b.disabled)return;
      if(id&&!elevulAcelasi(api))return;
      const k=+b.dataset.k,ok=k===Q.ok;
      if(id&&!ST.prima[id]){
        pune(id,{teste:[{ce:Q.ce||'Varianta bună',puncte:+Q.puncte||0,ok,lectia:Q.lectia||'',motiv:ok?'':txt((Q.mesaje&&Q.mesaje[k])||'')}]});
        const a=document.querySelector('.ajutor');if(a)a.hidden=false;
        redeseneaza();
      }
      if(ok){b.classList.add('ok');bs.forEach(x=>x.disabled=true);api.resolve(true)}
      else{b.classList.add('bad');b.disabled=true;api.resolve(false,(Q.mesaje&&Q.mesaje[k])||'Mai încearcă. Dacă ai nevoie, recitește pașii.');
        if(api.attempts()>=2){bs.forEach(x=>x.disabled=true);const g=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(g)g.classList.add('ok');api.giveUp(esc(Q.o[Q.ok]))}}
      if(id)blocPuncte(id,body,body.querySelector('.opts'));
    });
  },
  rezolva(Q,body){const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.click();return true},
  gresit(Q,body){const w=Q.o.findIndex((_,k)=>k!==Q.ok);const b=body.querySelector(`.opt[data-k="${w}"]`);if(b)b.click();return true}
};

const SIM=PT.creeaza([EXT]);
/* ---------------- v2 (J1-E): afișul întreg, pe o singură pânză, FĂRĂ puncte, după ultima cerință ---------------- */
const afis={
  render(Q,body,api){
    css();curent=null;
    document.querySelectorAll('.pp-sus,.pp-final,.pp-afis').forEach(x=>x.remove());
    SIM.render(Q,body,api);
    const el=document.createElement('div');el.className='pp-panou pp-afis';el.setAttribute('role','note');
    let h=`<p><span class="pp-et">${esc(Q.titluAfis||'Afișul tău, pe o singură pânză')}</span> · fără puncte: punctele sunt ale probei (${esc(ids().join(', '))}).</p>`;
    if(completa()){const P=peParti(),tot=['C','B','A'].reduce((s,k)=>s+(P[k]?P[k].luat:0),0)+CFG.oficiu,n=nota(tot);
      h+=`<p>Proba ta: <b>${tot<20?tot+' puncte':tot+' de puncte'} din 100</b>, nota pe antrenament <b>${n}</b>. Rezumatul ei îl vezi din nou la ${esc(primul())}, cu <b>Încă un exercițiu</b>.</p>`}
    el.innerHTML=h;if(body.parentNode)body.parentNode.insertBefore(el,body);
  },
  rezolva(Q,body,api){return SIM.rezolva(Q,body,api)},
  gresit(Q,body,api){return SIM.gresit(Q,body,api)}
};
const IMG=PI&&PI.creeaza?PI.creeaza():null;
window.PaintProba={
  versiune:'5 (02.11.2026)',
  configureaza(c){CFG=Object.assign({},CFG,c||{});return CFG},
  ext:EXT,sim:SIM,img:IMG,proba:invelis(SIM),probaImg:invelis(IMG),alegere,afis,
  stare:()=>JSON.parse(JSON.stringify({prima:ST.prima,cine:ST.cine,completa:completa(),parti:peParti()})),
  goleste:()=>laInceput('Proba începe din nou, de la '+primul()+'.'),
  nota,nivel,puncte:id=>luate(id),DESENE:DESENE_NOI
};
})();
