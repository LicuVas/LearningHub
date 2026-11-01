/* Extensia „paint-text” pentru simulatorul Paint din lecții (lectii/_sim/paint-text.js).
   PROPRIETAR: autorul lecției V · M4 · nr. 22 („Inserarea și formatarea textului. Realizez o felicitare / un afiș”), 26.10.2026.
   Se încarcă DUPĂ paint.js (V/18), paint-selectie.js (V/19) și paint-culori.js (V/21), pe care NU le modifică:
     <script src="../../_sim/paint.js"></script><script src="../../_sim/paint-selectie.js"></script>
     <script src="../../_sim/paint-culori.js"></script><script src="../../_sim/paint-text.js"></script>
     JocMotor.porneste({ …, tipuri:{paintw:SimPaintText} })
   O lecție următoare: const SimX=PaintText.creeaza([extensiaTa]); (lanțul: paint-selectie → paint-culori → paint-text → a ta).

   CE ADAUGĂ: instrumentul Text (litera A, grupul Instrumente): un clic pe pânză deschide caseta de text (o tragere îi alege
   mărimea), scrii în ea; deasupra pânzei apare bara casetei (Familie de fonturi, Dimensiune font, Aldin, Cursiv, Subliniere,
   Tăiere cu o linie, alinierile, Umplere fundal); un clic pe pânză în afara casetei „lipește” textul de desen.

   FIDELITATE (Paint 11.2605.81.0 din Windows 11, în română; Paint NU a fost pornit — aplicație din Magazin):
   DIN CAPTURI REALE (jocuri/grafica-v/img, Paint RO, 20.09.2026):
     · caseta-text.webp: caseta deschisă = chenar punctat cu mânere, textul în ea se rupe pe rânduri după lățimea casetei;
       deasupra pânzei, bara casetei: fontul (Calibri ⌄), mărimea (36 ⌄), B, I, U, S, trei alinieri, caseta de bifat
       „Umplere fundal”; bara-caseta-text.webp (aceeași bară); felicitare-model.webp (textul pus pe un desen colorat).
   DIN RESURSE (resources.pri al pachetului de limbă ro, citit ca fișier — lectii/v/m4-l22/_proba/pri_text_ro*.txt):
     Text, Casetă de editare text, Se deschide caseta de editare text, Bara de instrumente de text, Familie de fonturi,
     Dimensiune font, Aldin, Cursiv, Subliniere, Tăiere cu o linie, Aliniere la stânga, Aliniere la centru, Aliniere la dreapta,
     Umplere fundal, „Aplicați pe pânză”. (EN, din pri_main.txt al lecției V/18: Text toolbar, Text edit box, Font family,
     Font size, Bold, Italic, Underline, Strikethrough, Left align, Centre align, Right align, Apply to canvas.)
   DIN DOCUMENTAȚIA MICROSOFT: microsoft.com/windows/paint (FAQ, citit 26.10.2026): „Click on the canvas where you want to add
     text, and a text box will appear. Type your text in the box, customize the font, then select a size and color using the
     options in the toolbar.” · Windows Insider Blog 28.09.2021: noul instrument Text, „click on the “A” icon in the toolbar”.
   PRESUPUS (de fotografiat în laborator — lectii/v/m4-l22/capturi_lipsa.json):
     · culoarea literelor = Culoare 1 (Paint-ul clasic); o culoare aleasă cât caseta e deschisă schimbă textul din ea;
     · „Umplere fundal” bifată: dreptunghiul casetei se umple cu Culoare 2 (Paint-ul clasic, „Opac”);
     · un clic pe pânză în afara casetei „lipește” textul de desen (nu mai e text de schimbat; forumul Microsoft Q&A, Paint din
       Windows 7: „Paint … does not support re-selecting a text box to edit the contents”); același clic NU deschide o casetă nouă;
     · Ctrl+Z după lipire: AICI scoate tot textul pus (în Paint 11 NEPROBAT: poate scoate textul sau poate readuce caseta) —
       lecția dă drumul care merge în ambele cazuri;
     · mărimea și stilul alese se aplică la TOT textul din casetă (în Paint 11 poate se aplică doar textului selectat: lecția spune
       „alege înainte să scrii, sau selectează textul din casetă”); mărimea în puncte (pe pânză: mărime × 4/3 pixeli);
     · lista mărimilor 8…72 (ca în Windows); caseta crește în jos cât scrii;
     · alt instrument, meniul Fișier, ↶, Ctrl+S „lipesc” și ele textul.
   ABATERI, spuse pe ecran (nota de sub Paint + mesajul de după ↶): fonturile din listă sunt doar câteva; caseta nu se mută, nu se
     rotește și nu se mărește trăgând de margini; ↶ / Ctrl+Z din afara casetei, cu caseta deschisă, lipește textul și apoi îl scoate
     (tot; ↷ îl aduce înapoi, lipit). Butonul „Păstrează … (imagine)” de sub Paint (doar cu opțiunea Q.descarca) NU e al lui Paint:
     e al paginii, pentru telefon (descarcă pânza ca PNG, local; nimic nu pleacă spre un server).
   REPARAȚIILE DUPĂ JUDECATA 1 (26.10.2026, autor proaspăt; registrul lectii/v/m4-l22/_verificare/registru_j1.md):
     J1-A testul sus = marginea de sus a LITERELOR VĂZUTE e în jumătatea de sus a pânzei (nu mijlocul casetei în treimea de sus);
       opțiunea msgJos: mesajul când titlul există, dar e prea jos · J1-B al doilea clic al unui dublu-clic (≤ 600 ms) nu lipește
       caseta goală, ci pune cursorul în ea; când apare / dispare bara casetei, pagina se derulează cu înălțimea ei (pânza rămâne sub
       mouse / deget) · J1-C un text dus de o bucată mutată / lipită cu Selectare (V/19) e văzut de teste la locul nou ·
     J1-L culoarea literelor și cât din ele se vede se citesc din PIXELI: o literă se vede dacă se deosebește de ce e lângă ea
       (contrast local), deci litere recolorate cu găleata au culoarea nouă, iar litere acoperite / șterse nu se mai văd ·
     J1-G mesajul de după ↶ cu caseta deschisă · J1-E opțiunea Q.descarca (butonul „Păstrează … (imagine)”).
   REPARAȚIILE DUPĂ JUDECATA 2 (26.10.2026; același registru, literele W-AA):
     J2-W clasele barei casetei au prefixul extensiei (ptx-g, ptx-sep, ptx-f, ptx-m, ptx-fd): clasa scurtă „g” era lovită de regula
       motorului .g{…width:100%} (jocuri/_motor/motor.css, grila celulelor) și bara avea 5 rânduri la 1280; acum un rând ·
     J2-X opțiunea celMaiMare a testului text (judecă doar textul cel mai mare, adică titlul) · J2-Y opțiunea alteCuvinte a testului
       texte (textul mai mic are alte cuvinte decât cel mare) și testul text{sus} refuză un text „rupt” (o parte mutată sus cu
       Selectare, altă parte rămasă jos), cu mesajul msgRupt.
   REPARAȚIILE DUPĂ JUDECATA 3 (26.10.2026, DECIZIE STRUCTURALĂ a dirijorului; același registru, literele AB-AE):
     a treia rundă cu aceeași familie (testele ghiceau din MĂRIME și POZIȚIE care text e titlul și care e ziua) → mecanism nou:
     textele se recunosc după CUVINTE (opțiunea are, cu textul normalizat), apoi fiecare se judecă pe pixelii de acum:
     J3-AB/AC testul nou textSub (textul cu cuvintele lui, sub titlul cu cuvintele lui: mai mic, SUB literele titlului, literele
       celor două nu se ating, o singură dată, nu în caseta titlului; și niciun alt text nu stă peste altul) · J3-AD opțiunea unic
       (+ msgDouaOri) a testului text · J3-AE contrastul se măsoară față de culoarea de ACUM din jurul literelor (vecinii citiți
       de vede), nu față de pânza de dinaintea textului; mesajele msgFundal (fundalul s-a schimbat după ce ai scris) și msgInchis
       (fundal închis: o culoare deschisă) · mesajele după ordinea din istoric (↶ scoate întâi ce s-a pus ultimul): refaZi doar
       când ziua se poate scoate fără titlu, altfel refaTot.
   REPARAȚIILE DUPĂ JUDECATA 4 (26.10.2026, autor proaspăt; același registru, literele AF-AH; versiunea 5, ADITIV — nicio opțiune veche
     nu și-a schimbat sensul, în afară de condiția lui msgInchis):
     J4-AF un text greșit lăsat pe afiș nu mai e invizibil pentru teste: textSub{msgAlt, refaAlt} (orice alt text văzut în afară de titlu
       și zi, numit întocmai), textSub{msgZiAproape} și text{aproape, msgAproape, refaUltim, refaTot} (un text cu o parte din cuvintele
       cerute: „Vineri, 12”, „Concurs de desn”) · J4-AG text{msgCuloareFundal} (literele au culoarea fundalului de dinaintea lor: de
       câte ori ↶, numărat din istoric) și text{pornire, msgPornire} (desenul dat la început e încă pe pânză) · J4-AH msgInchis când
       albul se vede mai bine decât negrul pe fundalul de acum; text{culori} + {tip} / {culori} în mesaje (sfatul numește doar culori
       care trec pe fundalul de acum).

   API (pentru lecțiile următoare; NU schimba fără să treci în granița ta, m4_26_10/granite/v_l22.md):
   window.PaintText = {versiune:4, ext, creeaza(alte?), FONTURI, MARIMI, TEXTE, randeaza(T,c1,c2), vizibil(S,k), vede(S,it),
     contrast(a,b), texte(S), atinge(a,b), DESENE}   (versiunea 2, 26.10.2026: vede, sus pe litere, msgJos, descarca, textele din
     bucăți; versiunea 3, 26.10.2026, aditiv: celMaiMare, msgRupt, alteCuvinte, „rupt” în sus; clasele barei cu prefixul ptx-;
     versiunea 4, 26.10.2026: textSub, unic, msgDouaOri, msgFundal, msgInchis, msgAscuns, vede → și r, fd; SENS SCHIMBAT: contrast pe
     pixelii de acum; versiunea 5, 26.10.2026, aditiv: msgAlt, refaAlt, msgZiAproape, aproape, msgAproape, refaUltim, msgCuloareFundal,
     pornire, msgPornire, culori; SENS SCHIMBAT: condiția lui msgInchis)
   window.SimPaintText = PaintText.creeaza()
   Textul lipit = un traseu al lui V/21: 'umplere|<n>|c=<hex>' cu p=[[x+n·1e-7, y]] și imaginea textului în PaintCulori.FILL[n]
     (cu .text=true, .mg = masca literelor, .ng = câți pixeli au literele); n de la 800001 (V/21 numără umplerile de la 1, iar
     desenele ei au 990001+). Așa textul intră în pânza din memorie: găleata se oprește la litere, pipeta ia culoarea literelor,
     testele pe pixeli îl văd, selecția îl copiază / mută, Ctrl+Z îl scoate întreg. Datele textului: PaintText.TEXTE[n] =
     {text, font, marime, b, i, u, s, al, fundal, c, c2, x, y, w, h}.
   PaintText.texte(S) = [{k (traseul de pe pânză), n, T, F, dx, dy (cât l-a dus o bucată mutată / lipită), tai (zonele bucăților)}];
     PaintText.vede(S,it) = {v (cât din litere se vede, 0-1), c (culoarea lor de acum, '#rrggbb'), sus (y-ul de sus al literelor
     văzute), r ([x0,y0,x1,y1], dreptunghiul literelor văzute — v4), fd (culoarea cea mai des întâlnită lângă literele văzute,
     în afara lor: fundalul de ACUM — v4)}; PaintText.vizibil(S,k) = v-ul primului text de pe traseul k (ca în versiunea 1);
     PaintText.atinge(a,b) = literele a două texte (din texte(S), cu r din vede) au cel puțin un pixel comun (v4).
   Starea: S.ptx = {box:null|{x,y,w,h,text}, font, marime, b, i, u, s, al:'stanga'|'centru'|'dreapta', fundal:bool, puse:n};
     Q.ptx (opțional) = {font, marime, b, i, u, s, al, fundal}; Q.descarca (opțional) = {eticheta, fisier, gata} — butonul de sub
     Paint care descarcă pânza ca PNG (eticheta butonului, numele fișierului, mesajul de după).
   Evenimente ('paint-sim'): caseta {x,y,w,h} · text {n, text, marime} (la lipire; după el vine și 'desen') · descarcat {fisier}.
   Teste (checks[].k):
     text{are?:'cuvinte'|[…], cuvinte?:N, marime?:min, b?, i?, u?, s?, fam?|grup?|hex? (culoarea literelor, din pixeli), fundal?:bool,
       contrast?:min (WCAG, față de culoarea de ACUM din jurul literelor văzute — v4; înainte: pânza de dinaintea textului),
       msgFundal?:'…' (cu contrast: mesajul când contrastul trecea pe fundalul de dinainte, iar fundalul din jurul literelor s-a
       schimbat după ce au fost scrise — doar text lipit direct, fără Umplere fundal — v4), msgInchis?:'…' (cu contrast: mesajul
       când pe fundalul de acum albul se vede mai bine decât negrul — v5; în v4: când nici negrul n-ar ajunge la min),
       culori?:{inchise:[[nume,hex]…], deschise:[[nume,hex]…]} (v5: în mesajele testului, {tip} → „închisă” / „deschisă” după
       fundalul de acum — „deschisă” când albul se vede mai bine decât negrul —, iar {culori} → numele culorilor din lista
       potrivită care au contrast ≥ contrast (3) pe acel fundal; fundalul = în jurul textului cerut, sub textul nevăzut, altfel
       culoarea cea mai des întâlnită pe pânză), pornire?:true + msgPornire?:'…' (v5: desenul dat la început, Q.start.desen, e încă
       primul pe pânză — ↶ din pagină coboară și sub el; altfel testul pică cu msgPornire), msgCuloareFundal?:'…' (v5, cu msgAscuns:
       textul cerut, lipit pe loc, nu se vede pentru că literele au culoarea fundalului de dinaintea lor; {ori} → „o dată” / „de N
       ori” = câte ↶ îl scot, numărate din istoric; {dupa} → „, împreună cu ce ai pus după el” când N > 1), aproape?:N (implicit 2) +
       msgAproape?:'…{t}…' + refaUltim / refaTot (v5: niciun text nu trece, iar sus (cu sus) e un text văzut care are cel puțin N din
       cuvintele cerute, dar nu pe toate; {t} = textul lui, întocmai; refaUltim când niciun alt text văzut nu vine după el în istoric),
       unic?:true (cu are: textul cu aceste
       cuvinte apare o singură dată pe pânză — bucățile unui text mutat cu Selectare se adună; caseta deschisă se numără —, altfel
       mesajul msgDouaOri — v4), msgAscuns?:'…' (textul cu cuvintele cerute e lipit, dar nu se vede — șters, acoperit, de culoarea
       fundalului —, iar niciun alt mesaj nu se potrivește — v4), sus?:true (marginea de sus a literelor văzute în jumătatea de sus
       a pânzei; un text „rupt” nu trece: se vede sub 90 % din el aici, iar altă parte a lui, cu ≥ 25 % din litere, începe în
       jumătatea de jos — v3), msgJos?:'…' (cu sus: mesajul când un text îndeplinește tot în afară de „sus”; msgJosMarime?:N =
       doar dacă acel text are cel puțin mărimea N, adică arată a titlu, nu a rândului mic de dedesubt), msgRupt?:'…' (cu sus:
       mesajul când textul e rupt, o parte sus și alta jos; bate msgJos — v3), celMaiMare?:true (se uită doar la textul / textele
       cu mărimea cea mai mare dintre cele vizibile, adică la titlu; și la partea de sus a unui text rupt — v3), sauCaseta?:true (ia în seamă și caseta încă deschisă)}
       — trece dacă UN text lipit și vizibil (≥ 60 % din litere se văd), sau (cu sauCaseta) textul din caseta deschisă, le
       îndeplinește pe toate;
     fisierNume{folder:'Documente', re:'^pop_ana_5a_afis\\d*$', ext?:'png'} — un fișier din folder are numele (fără extensie,
       litere mici, fără diacritice) potrivit cu re (liniuța de jos contează, spre deosebire de testul salvat{nume} din paint.js);
     textNu{are} — niciun text lipit și încă vizibil (≥ 30 %) nu conține cuvintele (greșeala a fost scoasă sau acoperită);
     casetaInchisa — nu e nicio casetă deschisă, iar pe pânză e cel puțin un text lipit;
     texte{min, mic?:true, alteCuvinte?:true} — cel puțin min texte lipite și vizibile; mic: unul are mărimea mai mică decât
       altul; alteCuvinte (cu mic, v3): textul mai mic are cel puțin un cuvânt care nu e în cel mai mare (titlul scris de două
       ori, mic și mare, nu ține loc de ziua și ora);
     textSub{titlu:'cuvintele titlului', are:'cuvintele textului de sub el', msg, msgCaseta?, msgNeintreg?, msgAceeasi, msgDouaOri, msgPeste,
       msgMare, msgSus, msgPesteAlt, refaZi, refaTot} (v4) — textul cu cuvintele are (văzut ≥ 60 %) e o singură dată pe pânză, nu e
       în aceeași casetă cu titlul, are mărimea mai mică decât a titlului, literele lor nu au niciun pixel comun, iar marginea lui de
       sus e sub marginea de jos a literelor titlului; în plus, niciun text nu are litere peste ale altui text (≥ 30 % văzute).
       Mesajul = problema (msgAceeasi / msgDouaOri / msgPeste / msgMare / msgSus / msgPesteAlt) + ce faci: refaZi când toate
       intrările textului de jos (și mutările lui) vin în istoric DUPĂ ale titlului (↶ îl scoate fără să scoată titlul), altfel
       refaTot; msg = lipsește textul de jos (msgCaseta: titlul sau textul de jos e încă în caseta deschisă; msgNeintreg + refa…:
       textul de jos e pe pânză, dar se vede sub 60 % — rupt de o selecție mutată, acoperit, șters); v5: msgZiAproape?:'…{t}…' (lipsește
       textul de jos, dar e văzut un text, nu titlul, cu cel puțin aproape (2) din cuvintele lui: numit întocmai + refaZi / refaTot),
       msgAlt?:'…{t}…' + refaAlt (la sfârșit: niciun alt text văzut ≥ 30 % în afară de titlu și textul de jos; altfel primul din
       istoric e numit întocmai + refaAlt când toate intrările lui vin după ale titlului și ale textului de jos, altfel refaTot);
     caseta{are?} — o casetă e deschisă (cu cuvintele cerute în ea).
   Operații (sol / gresit): ['caseta',x1,y1,x2?,y2?] (Text + clic / tragere pe pânză) · ['scrie','…'] (textul din casetă) ·
     ['marime',n] · ['font','Calibri'] · ['stil','b'|'i'|'u'|'s'] (comutare) · ['aliniere','stanga'|'centru'|'dreapta'] ·
     ['fundalText',true|false] · ['fixeaza'] (clic pe pânză, în afara casetei).
   NU schimba: numele din bara casetei (resurse), formatul traseului de text, numele testelor. */
(function(){
'use strict';
const PS=window.PaintSim,PSel=window.PaintSelectie,PC=window.PaintCulori;
if(!PS||!PSel||!PC||!PC.creeaza){if(window.console)console.error('paint-text.js: încarcă întâi paint.js, paint-selectie.js și paint-culori.js');return}
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FONTURI=['Calibri','Arial','Comic Sans MS','Georgia','Times New Roman','Verdana'];
const MARIMI=[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const PAD=4;          /* marginea din casetă, în unități de pânză */
const LH=1.2;         /* înălțimea rândului, din mărimea literelor */
const PX=m=>m*4/3;    /* puncte → pixeli (96 dpi) */
const TEXTE={};
let NRT=800000;
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const cuvinte=s=>norm(s).split(' ').filter(Boolean);
const hexN=h=>{h=String(h||'').trim().toLowerCase();return /^#[0-9a-f]{6}$/.test(h)?h:/^[0-9a-f]{6}$/.test(h)?'#'+h:null};
const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function lum(h){return rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)}
function contrast(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
const fontCss=(T,px)=>`${T.i?'italic ':''}${T.b?'bold ':''}${px}px "${T.font}", "Segoe UI", Arial, sans-serif`;

/* ---- rândurile: exact cum le rupe browserul într-o casetă de lățimea dată (o copie ascunsă a casetei) ---- */
let OGL=null;
function randuri(T,w){
  const px=PX(T.marime);
  if(!OGL){OGL=document.createElement('div');OGL.setAttribute('aria-hidden','true');OGL.style.cssText='position:absolute;left:-99999px;top:0;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;word-break:normal;box-sizing:border-box;border:0;margin:0';document.body.appendChild(OGL)}
  OGL.style.width=w+'px';OGL.style.padding=PAD+'px';OGL.style.font=fontCss(T,px);OGL.style.lineHeight=(px*LH)+'px';OGL.style.textAlign='left';
  const t=String(T.text||'');OGL.textContent=t||' ';
  const nod=OGL.firstChild,out=[];let cur='',top=null;
  if(!t)return [''];
  const r=document.createRange();
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(ch==='\n'){out.push(cur);cur='';top=null;continue}
    r.setStart(nod,i);r.setEnd(nod,i+1);const rs=r.getClientRects();const y=rs.length?rs[0].top:top;
    if(top!==null&&y!=null&&y>top+px*.5&&cur.length){out.push(cur);cur=ch===' '?'':ch;top=y;continue}
    if(top===null)top=y;cur+=ch}
  out.push(cur);return out}
function inaltime(T,w){return Math.round(randuri(T,w).length*PX(T.marime)*LH+2*PAD)}

/* ---- textul pe pixeli (canvas), ca în caseta deschisă ---- */
function randeaza(T,c1,c2){
  const w=Math.max(8,Math.round(T.w)),h=Math.max(8,Math.round(Math.max(T.h,inaltime(T,T.w))));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d',{willReadFrequently:true});
  if(T.fundal){x.fillStyle=c2;x.fillRect(0,0,w,h)}
  const px=PX(T.marime),lh=px*LH,L=randuri(T,w);
  x.font=fontCss(T,px);x.fillStyle=c1;x.strokeStyle=c1;x.textBaseline='top';
  const gros=Math.max(1,Math.round(px/14));
  L.forEach((ln,k)=>{const s=ln.replace(/\s+$/,''),tw=x.measureText(s).width,y=PAD+k*lh+(lh-px)/2;
    const x0=T.al==='centru'?(w-tw)/2:T.al==='dreapta'?w-PAD-tw:PAD;
    x.fillText(s,x0,y);
    if(s&&T.u)x.fillRect(x0,y+px*.92,tw,gros);
    if(s&&T.s)x.fillRect(x0,y+px*.55,tw,gros)});
  /* masca literelor: pixelii apropiați de culoarea literelor (cu fundal plin) sau destul de opaci (fără fundal) */
  const d=x.getImageData(0,0,w,h).data,mg=new Uint8Array(w*h),C=rgb(c1);let ng=0;
  for(let j=0;j<w*h;j++){const k=j*4;const ok=T.fundal?(Math.abs(d[k]-C[0])+Math.abs(d[k+1]-C[1])+Math.abs(d[k+2]-C[2])<60):d[k+3]>200;if(ok){mg[j]=1;ng++}}
  let url='';try{url=cv.toDataURL('image/png')}catch(e){}
  return {cv,w,h,url,mg,ng}}
function pune(S,T,c1,c2){
  const R=randeaza(T,c1,c2),n=++NRT,bx=Math.round(T.x),by=Math.round(T.y);
  PC.FILL[n]={cv:R.cv,bx,by,w:R.w,h:R.h,url:R.url,c:c1,n:0,margine:false,text:true,mg:R.mg,ng:R.ng};
  TEXTE[n]={text:T.text,font:T.font,marime:T.marime,b:!!T.b,i:!!T.i,u:!!T.u,s:!!T.s,al:T.al,fundal:!!T.fundal,c:c1,c2,x:bx,y:by,w:R.w,h:R.h};
  return {u:'umplere|'+n+'|c='+c1.slice(1),p:[[bx+n*1e-7,by]],n}}

/* ---- textele de pe pânză ---- */
const serial=u=>{const m=String(u).split('|');return +m[1]||0};
const inPoli=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
const inF=(f,x,y)=>f.p?inPoli(x,y,f.p):(x>=f.r[0]&&y>=f.r[1]&&x<f.r[0]+f.r[2]&&y<f.r[1]+f.r[3]);
/* textele lipite direct și cele duse de o bucată mutată / lipită cu Selectare (V/19: 'muta|id', 'bloc|id'; reparația J1-C):
   dx, dy = cât a dus-o bucata; tai = zonele bucăților, în coordonatele pânzei de acum (în afara lor, literele copiei nu se văd) */
function texte(S){const out=[],BL=PSel.BLOCURI||[];
  const umbla=(desen,k0,dx,dy,tai,ad)=>{(desen||[]).forEach((s,k)=>{const o=PSel.parse(s.u),kk=k0<0?k:k0;
    if(o.t==='umplere'){const n=serial(s.u);if(TEXTE[n]&&PC.FILL[n]&&PC.FILL[n].text)out.push({k:kk,n,T:TEXTE[n],F:PC.FILL[n],dx,dy,tai});return}
    if((o.t==='bloc'||o.t==='muta')&&ad<8){const B=BL[o.id];if(!B||!B.f||!B.f.r||!s.p||!s.p[0])return;
      const ex=dx+s.p[0][0]-B.f.r[0],ey=dy+s.p[0][1]-B.f.r[1];umbla(B.desen,kk,ex,ey,tai.concat([{f:B.f,dx:ex,dy:ey}]),ad+1)}})};
  umbla(S.desen,-1,0,0,[],0);return out}
/* cât din litere se vede, ce culoare au ACUM și unde încep (reparațiile J1-A, J1-C, J1-L): totul din pixelii pânzei.
   O literă (un pixel al măștii) se vede dacă se deosebește de ce e lângă ea: în fiecare din cele 4 direcții, primul pixel din afara
   literelor (sărind marginea netezită) — cel puțin jumătate din vecinii găsiți au altă culoare (diferența > 60). Acoperită de o
   formă sau ștearsă cu Radiera: are culoarea vecinilor, deci nu se vede. Recolorată cu găleata: se vede, cu culoarea nouă. */
const DIR=[[1,0],[-1,0],[0,1],[0,-1]],VC=new Map();
/* R2: cheia memoriei are și ZONA fiecărei bucăți (nu doar deplasarea): două bucăți ale aceluiași text, mutate cu aceeași deplasare
   (ex. rândurile titlului, mutate pe rând cu 380 px în sus), primeau același rezultat */
const FID=new WeakMap();let NFID=0;const fid=f=>{if(!FID.has(f))FID.set(f,++NFID);return FID.get(f)};
/* R3: parcurgerea literelor VĂZUTE (regula de mai sus) pe un raster R: pentru fiecare pixel al măștii care se vede,
   cb(X, Y, i, J, nj) — i = indicele lui în R.d, J[0..nj-1] = indicii vecinilor din afara literelor care au ALTĂ culoare decât el
   (ce e în jurul literei ACUM; din ei vine fundalul de acum, J3-AE) */
function scan(R,it,cb){const F=it.F,W=R.w,H=R.h,d=R.d,mg=F.mg,fw=F.w,fh=F.h,ox=F.bx+(it.dx||0),oy=F.by+(it.dy||0),tai=it.tai||[];
  const inM=(x,y)=>x>=0&&y>=0&&x<fw&&y<fh&&mg[y*fw+x]===1;
  const inT=(X,Y)=>{for(const t of tai)if(!inF(t.f,X-t.dx,Y-t.dy))return false;return true};
  const J=[0,0,0,0];
  for(let y=0;y<fh;y++)for(let x=0;x<fw;x++){if(mg[y*fw+x]!==1)continue;const X=ox+x,Y=oy+y;
    if(X<0||Y<0||X>=W||Y>=H||(tai.length&&!inT(X,Y)))continue;
    const i=(Y*W+X)*4,r=d[i],g=d[i+1],b=d[i+2];let gas=0,nj=0;
    for(const u of DIR){let s=1;while(s<=16&&inM(x+u[0]*s,y+u[1]*s))s++;if(s>16)continue;
      if(!inM(x+u[0]*(s+1),y+u[1]*(s+1)))s++;
      const XX=X+u[0]*s,YY=Y+u[1]*s;if(XX<0||YY<0||XX>=W||YY>=H)continue;
      const j=(YY*W+XX)*4;gas++;if(Math.abs(d[j]-r)+Math.abs(d[j+1]-g)+Math.abs(d[j+2]-b)>60)J[nj++]=j}
    if(gas&&nj*2>=gas)cb(X,Y,i,J,nj)}}
const majoritar=m=>{let b=null,bn=0;m.forEach((v,h)=>{if(v>bn){bn=v;b=h}});return b==null?null:'#'+b.toString(16).padStart(6,'0')};
function vede(S,it){const F=it&&it.F;if(!F||!F.ng||!F.mg)return {v:0,c:null,sus:null,r:null,fd:null};
  const R=PC.raster(S),dx=it.dx||0,dy=it.dy||0,tai=it.tai||[],cheie=R.k+'|'+it.n+'|'+dx+'|'+dy+'|'+tai.map(t=>fid(t.f)+':'+t.dx+','+t.dy).join(';');
  if(VC.has(cheie))return VC.get(cheie);
  const d=R.d,cnt=new Map(),cf=new Map();let n=0,sus=Infinity,jos=-1,st=Infinity,dr=-1;
  scan(R,it,(X,Y,i,J,nj)=>{n++;if(Y<sus)sus=Y;if(Y>jos)jos=Y;if(X<st)st=X;if(X>dr)dr=X;
    const h=(d[i]<<16)|(d[i+1]<<8)|d[i+2];cnt.set(h,(cnt.get(h)||0)+1);
    for(let q=0;q<nj;q++){const j=J[q],hf=(d[j]<<16)|(d[j+1]<<8)|d[j+2];cf.set(hf,(cf.get(hf)||0)+1)}});
  const rez={v:n/F.ng,c:majoritar(cnt),sus:sus===Infinity?null:sus,r:n?[st,sus,dr+1,jos+1]:null,fd:majoritar(cf)};
  VC.set(cheie,rez);if(VC.size>300)VC.delete(VC.keys().next().value);
  return rez}
function vizibil(S,k){const it=texte(S).find(x=>x.k===k);return it?vede(S,it).v:0}
/* R3 (J3-AB/AC): literele a două texte au cel puțin un pixel comun (măștile, la locul lor de acum, în zonele bucăților);
   se caută doar în dreptunghiul comun al literelor văzute (r, din vede) */
function inMasca(it,X,Y){const F=it.F,x=X-F.bx-(it.dx||0),y=Y-F.by-(it.dy||0);if(x<0||y<0||x>=F.w||y>=F.h||F.mg[y*F.w+x]!==1)return false;
  for(const t of it.tai||[])if(!inF(t.f,X-t.dx,Y-t.dy))return false;return true}
function atinge(a,b){const A=a&&a.r,B=b&&b.r;if(!A||!B||!a.F.mg||!b.F.mg)return false;
  const x0=Math.max(A[0],B[0]),y0=Math.max(A[1],B[1]),x1=Math.min(A[2],B[2]),y1=Math.min(A[3],B[3]);if(x0>=x1||y0>=y1)return false;
  for(let Y=y0;Y<y1;Y++)for(let X=x0;X<x1;X++)if(inMasca(a,X,Y)&&inMasca(b,X,Y))return true;return false}
/* R3 (J3-AE): fundalul de ACUM al unui text = culoarea cea mai des întâlnită lângă literele lui văzute (fd din vede); pentru caseta
   încă deschisă (fără mască), ce e acum pe pânză sub ea */
const fundalAcum=(S,it)=>it.F&&it.F.mg?(it.fd||fundalSub(S,it)):fundalSub(S,it);
/* R3 (J3-AE): fundalul de DINAINTEA textului, citit în ACELEAȘI puncte (vecinii literelor văzute de acum), pe pânza de dinaintea lui */
function fundalInainte(S,it){if(!it.F||!it.F.mg)return fundalSub(S,it);
  const R=PC.raster(S),Rb=PC.raster({desen:(S.desen||[]).slice(0,it.k),w:S.w,h:S.h});if(Rb.w!==R.w||Rb.h!==R.h)return fundalSub(S,it);
  const db=Rb.d,cf=new Map();
  scan(R,it,(X,Y,i,J,nj)=>{for(let q=0;q<nj;q++){const j=J[q],h=(db[j]<<16)|(db[j+1]<<8)|db[j+2];cf.set(h,(cf.get(h)||0)+1)}});
  return majoritar(cf)||fundalSub(S,it)}
/* de câte ori apare un text pe pânză: bucățile aceluiași text (n, dus de mutări) se adună; caseta deschisă = încă o dată */
function instante(A){const g=new Map();let n=0;A.forEach(it=>{if(it.n==null){n++;return}g.set(it.n,(g.get(it.n)||0)+(it.v||0))});g.forEach(v=>{n+=Math.round(v)});return n}
/* ce era în spatele literelor: culoarea cea mai des întâlnită în casetă (la locul ei de acum), pe pânza de dinaintea textului
   (sau a bucății care l-a dus); cu Umplere fundal, Culoare 2. R3: pentru textele lipite, contrastul folosește fundalAcum */
function fundalSub(S,it){if(it.T.fundal)return it.T.c2;
  const R=PC.raster({desen:(S.desen||[]).slice(0,it.k),w:S.w,h:S.h}),cnt={},ox=it.F.bx+(it.dx||0),oy=it.F.by+(it.dy||0);let best=null,bn=0;
  for(let a=0;a<14;a++)for(let b=0;b<8;b++){const X=Math.round(ox+(a+.5)*it.F.w/14),Y=Math.round(oy+(b+.5)*it.F.h/8);if(X<0||Y<0||X>=R.w||Y>=R.h)continue;
    const i=(Y*R.w+X)*4,h='#'+[R.d[i],R.d[i+1],R.d[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('');cnt[h]=(cnt[h]||0)+1;if(cnt[h]>bn){bn=cnt[h];best=h}}
  return best||'#ffffff'}
const potrivesteCul=(hex,cer)=>{if(cer==null)return true;const L=[].concat(cer);
  return L.some(x=>x==='calde'||x==='reci'?PC.grup(hex)===x:/^#/.test(x)?hexN(x)===hexN(hex):PC.familie(hex)===x)};
function are(text,cer){if(!cer)return true;const w=cuvinte(text),L=Array.isArray(cer)?cer.map(norm):cuvinte(cer);return L.every(c=>w.includes(c))}
/* ---- R4 (după judecata 4: AF, AG, AH) ---- */
/* textul elevului, numit întocmai într-un mesaj (un rând, cel mult 40 de semne, fără HTML) */
const numeText=s=>{const x=String(s||'').replace(/\s+/g,' ').trim();return E(x.length>40?x.slice(0,40)+'…':x)};
const difCul=(a,b)=>{a=hexN(a);b=hexN(b);if(!a||!b)return 999;const p=rgb(a),q=rgb(b);return Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2])};
/* J4-AH: pe fundalul f, albul se vede mai bine decât negrul (atunci sfatul e „o culoare deschisă”) */
const albMaiBun=f=>{f=hexN(f)||'#ffffff';return contrast('#ffffff',f)>contrast('#000000',f)};
/* J4-AG: desenul dat la început (Q.start.desen, în PaintSim.DESENE) e încă primul pe pânză (nu l-a scos ↶, nu s-a început o pânză nouă) */
function pornireIntacta(S,Q){const nm=Q&&Q.start&&Q.start.desen,D=nm&&PS.DESENE&&PS.DESENE[nm];if(!D||!D.length)return true;
  const L=S.desen||[];if(L.length<D.length)return false;for(let i=0;i<D.length;i++)if(!L[i]||L[i].u!==D[i].u)return false;return true}
/* culoarea cea mai des întâlnită pe pânza de ACUM (o grilă de 26 × 16 puncte) */
function fundalPanza(S){const R=PC.raster(S),cnt=new Map();
  for(let a=0;a<26;a++)for(let b=0;b<16;b++){const X=Math.round((a+.5)*R.w/26),Y=Math.round((b+.5)*R.h/16),i=(Y*R.w+X)*4,h=(R.d[i]<<16)|(R.d[i+1]<<8)|R.d[i+2];cnt.set(h,(cnt.get(h)||0)+1)}
  return majoritar(cnt)||'#ffffff'}
/* fundalul pe care se dă sfatul de culoare: în jurul textului cerut (cel care trece în afară de contrast, apoi orice text cu cuvintele
   cerute, văzut), sub textul cerut nevăzut (pânza de dinaintea lui), altfel culoarea cea mai des întâlnită pe pânză */
function bgSfat(S,cand,bunFaraContrast,textOk){const v=cand.filter(it=>it.v>=.6&&it.F&&it.F.mg),b=v.find(bunFaraContrast)||v.find(textOk);if(b)return fundalAcum(S,b);
  const h=cand.find(it=>it.F&&it.F.mg&&textOk(it));return h?fundalSub(S,h):fundalPanza(S)}
/* {tip} → „închisă” / „deschisă”; {culori} → numele culorilor din t.culori.inchise / .deschise care au contrast ≥ t.contrast (3) pe fundalul f */
function sfat(t,f){const m=String(t.msg||'');if(m.indexOf('{tip}')<0&&m.indexOf('{culori}')<0)return m;
  const d=albMaiBun(f),L=((d?t.culori.deschise:t.culori.inchise)||[]).filter(x=>contrast(hexN(x[1])||'#000000',hexN(f)||'#ffffff')>=(t.contrast||3));
  const nume=(L.length?L:[d?['alb','#ffffff']:['negru','#000000']]).map(x=>x[0]).join(', ');
  return m.split('{tip}').join(d?'deschisă':'închisă').split('{culori}').join(nume)}

/* ---- starea ---- */
function st(S,Q){if(!S.ptx){const q=(Q&&Q.ptx)||{};S.ptx={box:null,font:q.font||'Calibri',marime:+q.marime||36,b:!!q.b,i:!!q.i,u:!!q.u,s:!!q.s,al:q.al||'stanga',fundal:!!q.fundal,puse:0}}return S.ptx}
const C1=S=>(S.pc&&S.pc.c1)||'#000000',C2=S=>(S.pc&&S.pc.c2)||'#ffffff';
function tBox(P){const b=P.box;return {text:b.text,font:P.font,marime:P.marime,b:P.b,i:P.i,u:P.u,s:P.s,al:P.al,fundal:P.fundal,x:b.x,y:b.y,w:b.w,h:b.h}}
const MSG_UNDO='Caseta era încă deschisă: în pagină, ↶ a scos tot textul din ea. O literă greșită o ștergi chiar în casetă, cu tasta de ștergere ⌫ (Backspace), înainte de clicul în afară.';
function deschide(S,P,c,a,b){
  let x,y,w,h;const lh=PX(P.marime)*LH+2*PAD;
  if(b&&Math.abs(b[0]-a[0])>=20&&Math.abs(b[1]-a[1])>=10){x=Math.min(a[0],b[0]);y=Math.min(a[1],b[1]);w=Math.abs(b[0]-a[0]);h=Math.max(Math.abs(b[1]-a[1]),lh)}
  else{x=a[0];y=a[1];w=Math.min(420,S.w-a[0]);h=lh}
  w=Math.max(60,Math.min(w,S.w-x));if(x+w>S.w)x=Math.max(0,S.w-w);y=Math.max(0,Math.min(y,S.h-lh));
  P.box={x:Math.round(x),y:Math.round(y),w:Math.round(w),h:Math.round(h),text:''};S.unealta='text';
  c.ev('caseta',{x:P.box.x,y:P.box.y,w:P.box.w,h:P.box.h});
  c.msg('A apărut <b>caseta de text</b> (chenarul punctat) și, deasupra pânzei, bara ei. Scrie în casetă. Ai terminat? Un clic pe pânză, în afara casetei.');
  return true}
function fixeaza(S,P,c,tacut){const B=P.box;if(!B)return false;P.box=null;
  if(!String(B.text).trim()){if(!tacut)c.msg('Caseta era goală: pe pânză n-a rămas nimic.');return false}
  const T=tBox(Object.assign({},P,{box:B}));T.h=Math.max(B.h,inaltime(T,B.w));
  const tr=pune(S,T,C1(S),C2(S));S.desen.push({u:tr.u,p:tr.p});S.refa=[];S.modificat=true;P.puse++;
  c.ev('text',{n:tr.n,text:B.text,marime:P.marime});c.ev('desen',{u:'text',puncte:1});
  if(!tacut)c.msg('Textul s-a lipit de desen: caseta a dispărut și literele sunt acum o parte din desen. Greșeală? În pagină, <b>↶</b> (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) îl scoate; apoi îl scrii din nou.');
  return true}

/* ---- testele ---- */
function verifica(t,c){const S=c.S,P=st(S,c.Q);
  /* R2 (J2-Y): un text e „rupt” când aici se vede sub 90 % din el, iar altă parte a LUI (≥ 25 % din litere, dusă sau lăsată de o
     bucată mutată cu Selectare) începe în jumătatea de jos a pânzei: „Concurs de” sus, „desen” jos nu e un titlu sus */
  const L=()=>{const A=texte(S).map(it=>{const z=vede(S,it);return Object.assign(it,{v:z.v,c:z.c||it.T.c,sus:z.sus,r:z.r,fd:z.fd})});
    A.forEach(it=>{it.rupt=it.v<.9&&A.some(o=>o!==it&&o.n===it.n&&o.v>=.25&&o.sus!=null&&o.sus>=S.h/2)});return A};
  /* R3: mesajele care se schimbă după starea de ACUM pornesc de fiecare dată de la mesajul de bază (msg0) */
  if(t.msg0==null&&(t.msgJos||t.msgRupt||t.msgDouaOri||t.msgFundal||t.msgInchis||t.msgAscuns||t.msgPornire||t.msgAproape||t.msgCuloareFundal||t.culori||t.k==='textSub'))t.msg0=t.msg;
  if(t.msg0!=null)t.msg=t.msg0;
  switch(t.k){
    case 'text':{if(!S.pornit)return false;
      /* R4 (J4-AG): pornire = desenul dat la început (Q.start.desen) e încă pe pânză (↶ din pagină coboară și sub el: paint.js) */
      if(t.pornire&&!pornireIntacta(S,c.Q)){if(t.msgPornire)t.msg=t.msgPornire;return false}
      let cand=L();
      /* sauCaseta: și textul din caseta încă deschisă (cu ce e ales acum în bară și în Culori) */
      if(t.sauCaseta&&P.box&&String(P.box.text).trim()){const B=P.box,T=Object.assign(tBox(P),{c:C1(S),c2:C2(S)});T.h=Math.max(B.h,inaltime(T,B.w));
        cand.push({k:S.desen.length,T,F:{bx:B.x,by:B.y,w:B.w,h:T.h},dx:0,dy:0,tai:[],v:1,c:C1(S),sus:B.y+PAD})}
      /* R2 (J2-X): celMaiMare = testul judecă titlul, adică textul (textele) cu mărimea cea mai mare dintre cele vizibile; un titlu
         alb pe galben nu mai trece pentru că ziua de sub el e neagră */
      if(t.celMaiMare){const vz=cand.filter(it=>it.v>=.6||(it.rupt&&it.v>=.25));   /* și partea de sus a unui titlu rupt (msgRupt) */const mx=vz.length?Math.max(...vz.map(it=>it.T.marime)):0;cand=vz.filter(it=>it.T.marime===mx)}
      const textOk=it=>are(it.T.text,t.are)&&!(t.cuvinte&&cuvinte(it.T.text).length<t.cuvinte);
      /* fara = {sus, contrast}: ce NU se judecă (pentru alegerea mesajului) */
      const potriv=(it,fara)=>{const T=it.T;fara=fara||{};if(!fara.v&&it.v<.6)return false;
        if(!are(T.text,t.are))return false;if(t.cuvinte&&cuvinte(T.text).length<t.cuvinte)return false;
        if(t.marime&&T.marime<t.marime)return false;
        for(const k of ['b','i','u','s'])if(t[k]!=null&&!!T[k]!==!!t[k])return false;
        if(t.fundal!=null&&!!T.fundal!==!!t.fundal)return false;
        if(!potrivesteCul(it.c,t.hex||t.fam||t.grup))return false;   /* J1-L: culoarea literelor de ACUM, din pixeli */
        if(t.contrast&&!fara.contrast&&contrast(it.c,fundalAcum(S,it))<t.contrast)return false;   /* R3 (J3-AE): fundalul de ACUM */
        /* J1-A: „sus” = marginea de sus a literelor văzute e în jumătatea de sus a pânzei (cum vede copilul, nu mijlocul casetei) */
        if(t.sus&&!fara.sus&&(it.rupt||!(it.sus!=null&&it.sus<S.h/2)))return false;   /* R2 (J2-Y): nici rupt */
        return true};
      /* R3 (J3-AD, decizia structurală): textul cu cuvintele cerute apare o singură dată (titlul de două ori nu e un afiș curat) */
      if(t.unic&&t.are&&instante(cand.filter(it=>are(it.T.text,t.are)))>1){if(t.msgDouaOri)t.msg=t.msgDouaOri;return false}
      if(cand.some(it=>potriv(it)))return true;
      /* mesajul spune ce e adevărat ACUM (regula 28): textul e rupt (o parte sus, alta jos) → msgRupt; titlul există și e bun, dar
         e prea jos → msgJos; altfel mesajul de bază */
      if(t.sus&&(t.msgJos||t.msgRupt)){
        t.msg=t.msgRupt&&cand.some(it=>it.rupt&&it.v>=.25&&it.sus!=null&&it.sus<S.h/2&&textOk(it))?t.msgRupt
          :t.msgJos&&cand.some(it=>potriv(it,{sus:true})&&(!t.msgJosMarime||it.T.marime>=t.msgJosMarime))?t.msgJos:t.msg0}
      /* R3 (J3-AE): textul e bun în afară de contrast — fundalul s-a schimbat DUPĂ ce a fost scris (text lipit direct, fără Umplere
         fundal: pe pânza de dinainte, în aceleași puncte, contrastul trecea) → msgFundal; fundalul de acum e atât de închis încât nici
         negrul nu trece → msgInchis (o culoare deschisă) */
      if(t.contrast&&(t.msgFundal||t.msgInchis)){const bune=cand.filter(it=>potriv(it,{contrast:true,v:true})),vb=bune.filter(it=>it.v>=.6);
        /* fundal închis: textul (văzut; dacă nu se vede deloc, cel lipit pe loc — litere de culoarea fundalului) stă pe un fundal pe care
           albul se vede mai bine decât negrul (R4, J4-AH: înainte „nici negrul nu ajunge la min” — pe Indigo negrul are 3,01 și sfatul
           „o culoare închisă” se repeta) */
        const pe=vb.length?vb:bune.filter(it=>!it.dx&&!it.dy&&!(it.tai||[]).length);
        if(t.msgFundal&&vb.some(it=>it.F.mg&&!it.T.fundal&&!it.dx&&!it.dy&&!(it.tai||[]).length&&contrast(it.c,fundalInainte(S,it))>=t.contrast))t.msg=t.msgFundal;
        else if(t.msgInchis&&pe.length&&pe.every(it=>albMaiBun(fundalAcum(S,it))))t.msg=t.msgInchis}
      /* R3: textul cu cuvintele cerute e lipit pe pânză, dar nu se vede (șters, acoperit, de culoarea fundalului) → msgAscuns
         (doar dacă niciun alt mesaj de mai sus nu s-a potrivit; „Scrie titlul” ar duce la încă un text nevăzut, la nesfârșit) */
      let bgS=null;
      if(t.msgAscuns&&t.msg===t.msg0&&!cand.some(it=>it.v>=.6&&textOk(it))&&cand.some(it=>it.F.mg&&textOk(it))){t.msg=t.msgAscuns;
        /* R4 (J4-AG): literele (lipite pe loc) au culoarea fundalului de dinaintea lor — scrise cu culoarea fundalului: „↶ până se vede iar”
           nu e adevărat (↶ scoate titlul, apoi și desenul dat). Mesajul spune de câte ori ↶ (numărat din istoric: titlul și tot ce e după
           el; o casetă deschisă cu text mai cere un ↶) și o culoare care se vede ({tip} / {culori}, pe fundalul de sub titlu) */
        const sc=t.msgCuloareFundal&&cand.find(it=>it.F.mg&&textOk(it)&&it.v<.6&&!it.dx&&!it.dy&&!(it.tai||[]).length&&difCul(it.T.c,fundalSub(S,it))<=60);
        if(sc){const n=S.desen.length-sc.k+(P.box&&String(P.box.text).trim()?1:0);bgS=fundalSub(S,sc);
          t.msg=t.msgCuloareFundal.replace('{ori}',n<=1?'o dată':n<20?'de '+n+' ori':'de '+n+' de ori').replace('{dupa}',n<=1?'':', împreună cu ce ai pus după el')}}
      /* R4 (J4-AF): sus e un text cu o parte din cuvintele cerute (o greșeală de tastare, „Concurs de desn”) → îl numesc întocmai, apoi ce
         faci: ↶ până dispare (dacă nu e niciun alt text văzut după el în istoric), altfel ↶ până dispar toate textele */
      if(t.msgAproape&&t.msg===t.msg0){const cw=cuvinte(t.are),com=it=>{const w=cuvinte(it.T.text);return cw.filter(x=>w.includes(x)).length};
        const ap=cand.filter(it=>it.F.mg&&it.v>=.6&&it.r&&!are(it.T.text,t.are)&&com(it)>=(t.aproape||2)&&(!t.sus||(it.sus!=null&&it.sus<S.h/2)));
        if(ap.length){const a=ap.slice().sort((x,y)=>x.k-y.k)[0],kA=Math.min(...cand.filter(it=>it.n===a.n).map(it=>it.k));
          const ultim=cand.filter(it=>it.F.mg&&it.n!==a.n&&it.v>=.3).every(it=>it.k<kA);
          t.msg=t.msgAproape.replace('{t}',()=>numeText(a.T.text))+' '+((ultim?t.refaUltim:t.refaTot)||'')}}
      /* R4 (J4-AH): sfatul de culoare numește doar culori care trec pe fundalul de ACUM ({tip} = închisă / deschisă, {culori} = numele) */
      if(t.culori)t.msg=sfat(t,bgS||bgSfat(S,cand,it=>potriv(it,{contrast:true}),textOk));
      return false}
    case 'fisierNume':{const dir=String(t.folder||'Documente').replace(/\\/g,'/').replace(/\/$/,''),re=new RegExp(t.re,'i');
      return [...S.fs.f.keys()].some(k=>{const d=k.split('/').slice(0,-1).join('/'),n=k.split('/').pop(),m=/^(.*)\.([a-z0-9]+)$/i.exec(n);
        if(d!==dir||!m)return false;if(t.ext&&m[2].toLowerCase()!==t.ext)return false;
        return re.test(m[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim())})}
    case 'textNu':return S.pornit&&!L().some(it=>it.v>=.3&&are(it.T.text,t.are));
    case 'casetaInchisa':return S.pornit&&!P.box&&texte(S).length>0;
    case 'texte':{const V=L().filter(it=>it.v>=.6);if(V.length<(t.min||1))return false;if(!t.mic)return true;
      /* R2 (J2-Y): alteCuvinte = textul mai mic are cel puțin un cuvânt care nu e în cel mare (nu titlul scris încă o dată, mai mic) */
      if(t.alteCuvinte)return V.some(a=>V.some(b=>a.T.marime<b.T.marime&&cuvinte(a.T.text).some(w=>!cuvinte(b.T.text).includes(w))));
      const m=V.map(it=>it.T.marime);return Math.min(...m)<Math.max(...m)}
    /* R3 (DECIZIA STRUCTURALĂ după judecata 3, J3-AB/AC/AD): textul de sub titlu se recunoaște după CUVINTE (nu după mărime sau
       poziție), apoi se judecă față de titlul recunoscut tot după cuvinte. Mesajul spune problema de ACUM și ce faci; „↶ până nu se
       mai vede ziua” doar când ↶ o scoate fără să scoată titlul (toate intrările ei vin în istoric după ale titlului) */
    case 'textSub':{if(!S.pornit)return false;const A=L(),eT=it=>are(it.T.text,t.titlu),eZ=it=>are(it.T.text,t.are);
      const tit=A.filter(it=>eT(it)&&it.v>=.25&&it.r),zi=A.filter(it=>eZ(it)&&it.v>=.6&&it.r);
      const inCaseta=c=>t.msgCaseta&&P.box&&String(P.box.text).trim()&&are(P.box.text,c);
      if(!A.some(it=>eT(it)&&it.v>=.6)){if(inCaseta(t.titlu))t.msg=t.msgCaseta;return false}
      const nT=new Set(A.filter(eT).map(it=>it.n)),nZ=new Set(A.filter(eZ).map(it=>it.n));
      const kT=Math.max(...A.filter(it=>nT.has(it.n)).map(it=>it.k)),kZ=nZ.size?Math.min(...A.filter(it=>nZ.has(it.n)).map(it=>it.k)):Infinity;
      const spune=(p,doarZi)=>{t.msg=(p?p+' ':'')+((doarZi?t.refaZi:t.refaTot)||'')},doarZi=kZ>kT;
      if(!zi.length){if(inCaseta(t.are))t.msg=t.msgCaseta;
        /* textul de jos e pe pânză, dar nu se vede întreg (rupt de o selecție mutată, acoperit, șters): „încă o casetă” l-ar dubla */
        else if(t.msgNeintreg&&A.filter(eZ).reduce((s,it)=>s+(it.v||0),0)>=.25)spune(t.msgNeintreg,doarZi);
        /* R4 (J4-AF): un text (nu titlul) cu o parte din cuvintele cerute („Vineri, 12”, fără „ora”) → îl numesc întocmai; ce faci după
           istoric (↶ până nu se mai vede, titlul rămâne, doar dacă toate intrările lui vin după ale titlului) */
        else if(t.msgZiAproape){const cw=cuvinte(t.are),ap=A.filter(it=>!eT(it)&&it.v>=.6&&it.r&&(w=>cw.filter(x=>w.includes(x)).length)(cuvinte(it.T.text))>=(t.aproape||2));
          if(ap.length){const a=ap.slice().sort((x,y)=>x.k-y.k)[0],kA=Math.min(...A.filter(it=>it.n===a.n).map(it=>it.k));spune(t.msgZiAproape.replace('{t}',()=>numeText(a.T.text)),kA>kT)}}
        return false}
      if(zi.some(eT)){spune(t.msgAceeasi,false);return false}                      /* ziua scrisă în caseta titlului */
      if(instante(A.filter(eZ))>1){spune(t.msgDouaOri,doarZi);return false}       /* J3-AD: ziua de două ori */
      if(tit.some(a=>zi.some(b=>atinge(a,b)))){spune(t.msgPeste,doarZi);return false}   /* J3-AB: literele se ating */
      const mT=Math.max(...tit.map(it=>it.T.marime));
      if(zi.some(it=>it.T.marime>=mT)){spune(t.msgMare,doarZi);return false}      /* J3-AC: ziua nu e mai mică */
      const rT=[Math.min(...tit.map(it=>it.r[0])),Math.min(...tit.map(it=>it.r[1])),Math.max(...tit.map(it=>it.r[2])),Math.max(...tit.map(it=>it.r[3]))];
      if(Math.min(...zi.map(it=>it.r[1]))<rT[3]-1){spune(t.msgSus,doarZi);return false}   /* ziua începe deasupra marginii de jos a titlului */
      /* niciun alt text (de exemplu un titlu greșit lăsat pe afiș) nu are litere peste ale altui text */
      const V=A.filter(it=>it.v>=.3&&it.r);
      if(V.some(a=>V.some(b=>a.n<b.n&&atinge(a,b)))){spune(t.msgPesteAlt,false);return false}
      /* R4 (J4-AF): pe afiș nu mai e niciun alt text văzut (≥ 30 %) în afară de titlu și zi (un titlu greșit lăsat lângă cel bun, ziua
         fără „ora”): îl numesc întocmai (primul din istoric); refaAlt („↶ până dispare; titlul și ziua rămân”) doar când toate intrările
         lui vin după ale titlului și ale zilei, altfel refaTot */
      if(t.msgAlt){const alt=V.filter(it=>!eT(it)&&!eZ(it));
        if(alt.length){const kmin=n=>Math.min(...A.filter(it=>it.n===n).map(it=>it.k)),a=alt.slice().sort((x,y)=>kmin(x.n)-kmin(y.n))[0];
          const kTZ=Math.max(...A.filter(it=>nT.has(it.n)||nZ.has(it.n)).map(it=>it.k));
          t.msg=t.msgAlt.replace('{t}',()=>numeText(a.T.text))+' '+((kmin(a.n)>kTZ?t.refaAlt:t.refaTot)||'');return false}}
      return true}
    case 'caseta':return S.pornit&&!!P.box&&are(P.box.text,t.are);
  }
  return null}

/* ---- operațiile (sol / gresit) ---- */
function op(o,c){const S=c.S,P=st(S,c.Q),[k,a,b,d,e]=o;
  switch(k){
    case 'caseta':if(!S.pornit)return true;if(P.box)fixeaza(S,P,c,true);if(S.ps)S.ps.sel=null;deschide(S,P,c,[a,b],d!=null?[d,e]:null);return true;
    case 'scrie':if(P.box)P.box.text=String(a);return true;
    case 'marime':P.marime=+a||P.marime;return true;
    case 'font':if(FONTURI.includes(a))P.font=a;return true;
    case 'stil':if(['b','i','u','s'].includes(a))P[a]=!P[a];return true;
    case 'aliniere':if(['stanga','centru','dreapta'].includes(a))P.al=a;return true;
    case 'fundalText':P.fundal=!!a;return true;
    case 'fixeaza':fixeaza(S,P,c);return true;
  }
  return false}

/* ---- bara casetei și caseta deschisă ---- */
const CSS=`
.ptx-bar{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;padding:4px 8px;background:#fbfbfb;border-bottom:1px solid #e3e3e3;font-size:13px}
.ptx-bar select{font:inherit;font-size:13px;min-height:34px;border:1px solid #c9c9c9;border-radius:4px;background:#fff;color:#1a1a1a;padding:0 4px}
.ptx-bar select.ptx-f{width:9.5em;max-width:46vw}
.ptx-bar .ptx-g{display:flex;gap:2px;align-items:center}
.ptx-bar .ptx-sep{width:1px;height:22px;background:#ddd}
.ptx-bar button{min-width:34px;min-height:34px;border:1px solid transparent;border-radius:4px;background:transparent;cursor:pointer;color:#1a1a1a;font:inherit;font-size:15px;padding:0 4px}
.ptx-bar button:hover{background:#e6e6e6}.ptx-bar button.on{background:#e0eefc;border-color:#9cc3ef}
.ptx-bar label{display:flex;align-items:center;gap:6px;min-height:34px;cursor:pointer;padding:0 4px}
.ptx-bar input[type=checkbox]{width:22px;height:22px;margin:0}
@media (max-width:520px){.ptx-bar .ptx-sep{display:none}.ptx-bar{gap:4px 4px}}
.ptx-box{position:absolute;z-index:3;transform-origin:0 0;outline:1px dashed #333;box-shadow:0 0 0 1px rgba(255,255,255,.9)}
.ptx-box textarea{display:block;box-sizing:border-box;border:0;margin:0;resize:none;overflow:hidden;background:transparent;white-space:pre-wrap;overflow-wrap:break-word;word-break:normal;outline:none;caret-color:currentColor}
.ptx-box i{position:absolute;width:8px;height:8px;background:#fff;border:1px solid #444;pointer-events:none}
.ptx-prev{position:absolute;z-index:3;border:1px dashed #333;pointer-events:none}
.ptx-desc{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:8px 0}
.ptx-desc-b{min-height:38px;padding:4px 14px;border:1px solid var(--line,#c9c9c9);border-radius:8px;background:var(--paper,#fff);color:var(--ink,#1a1a1a);font:inherit;font-weight:700;cursor:pointer}
.ptx-desc-m{font-size:.92em;color:var(--ink2,#4e5d6e)}
`;
let cssPus=false;function css(){if(cssPus)return;cssPus=true;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s)}
const INST=new WeakMap();
function bara(P){
  const bt=(st,lit,nume,on,stilT)=>`<button type="button" class="${on?'on':''}" data-act="ptx:stil" data-v="${st}" aria-label="${nume}" aria-pressed="${!!on}" title="${nume}" style="${stilT}">${lit}</button>`;
  const al=(v,nume,svg)=>`<button type="button" class="${P.al===v?'on':''}" data-act="ptx:al" data-v="${v}" aria-label="${nume}" aria-pressed="${P.al===v}" title="${nume}"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">${svg}</svg></button>`;
  const lin=a=>a.map(([x1,x2,y])=>`<path d="M${x1} ${y}H${x2}" stroke="#333" stroke-width="1.5"/>`).join('');
  /* R2 (J2-W): clasele cu prefixul extensiei; „g” singur era lovit de .g{…width:100%} din motor.css (bara pe 5 rânduri) */
  return `<div class="ptx-bar" role="toolbar" aria-label="Bara de instrumente de text">
    <select class="ptx-f" aria-label="Familie de fonturi" title="Familie de fonturi">${FONTURI.map(f=>`<option${P.font===f?' selected':''}>${f}</option>`).join('')}</select>
    <select class="ptx-m" aria-label="Dimensiune font" title="Dimensiune font">${(MARIMI.includes(P.marime)?MARIMI:MARIMI.concat([P.marime]).sort((a,b)=>a-b)).map(m=>`<option${P.marime===m?' selected':''}>${m}</option>`).join('')}</select>
    <span class="ptx-sep" aria-hidden="true"></span>
    <span class="ptx-g">${bt('b','B','Aldin',P.b,'font-weight:700')}${bt('i','I','Cursiv',P.i,'font-style:italic;font-family:Georgia,serif')}${bt('u','U','Subliniere',P.u,'text-decoration:underline')}${bt('s','S','Tăiere cu o linie',P.s,'text-decoration:line-through')}</span>
    <span class="ptx-sep" aria-hidden="true"></span>
    <span class="ptx-g">${al('stanga','Aliniere la stânga',lin([[2,14,4],[2,10,8],[2,13,12]]))}${al('centru','Aliniere la centru',lin([[2,14,4],[4,12,8],[3,13,12]]))}${al('dreapta','Aliniere la dreapta',lin([[2,14,4],[6,14,8],[3,14,12]]))}</span>
    <span class="ptx-sep" aria-hidden="true"></span>
    <label><input type="checkbox" class="ptx-fd"${P.fundal?' checked':''}>Umplere fundal</label>
  </div>`}
function stilTa(ta,S,P){const px=PX(P.marime);ta.style.font=fontCss(P,px);ta.style.lineHeight=(px*LH)+'px';ta.style.padding=PAD+'px';
  ta.style.color=C1(S);ta.style.textAlign=P.al==='centru'?'center':P.al==='dreapta'?'right':'left';
  ta.style.textDecoration=[P.u?'underline':'',P.s?'line-through':''].filter(Boolean).join(' ')||'none';
  ta.style.background=P.fundal?C2(S):'transparent'}
function aseaza(inst,S,P){const win=inst.body.querySelector('.pt-win'),wrap=win&&win.querySelector('.pt-wrap'),svg=wrap&&wrap.querySelector('.pt-svg');
  const B=P.box,box=inst.box;
  if(!B||!svg||!S.pornit){if(box.parentNode)box.remove();return false}
  if(box.parentNode!==wrap)wrap.appendChild(box);
  const wr=wrap.getBoundingClientRect(),sr=svg.getBoundingClientRect(),k=sr.width/S.w||1;
  const ta=inst.ta;if(ta.value!==B.text)ta.value=B.text;stilTa(ta,S,P);
  ta.style.width=B.w+'px';ta.style.height='auto';const hh=Math.max(B.h,ta.scrollHeight);ta.style.height=hh+'px';
  box.style.left=(sr.left-wr.left+B.x*k)+'px';box.style.top=(sr.top-wr.top+B.y*k)+'px';box.style.width=B.w+'px';box.style.height=hh+'px';
  box.style.transform=`scale(${k})`;box.style.outlineWidth=(1/k)+'px';
  const m=8/k;box.querySelectorAll('i').forEach((h,j)=>{const a=[0,.5,1,0,1,0,.5,1][j],b=[0,0,0,.5,.5,1,1,1][j];h.style.width=m+'px';h.style.height=m+'px';h.style.left=(a*B.w-m/2)+'px';h.style.top=(b*hh-m/2)+'px';h.style.borderWidth=(1/k)+'px'});
  return true}
function panou(c){const S=c.S,P=st(S,c.Q),inst=INST.get(c.Q);if(!inst)return '';const win=inst.body.querySelector('.pt-win');if(!win)return '';
  if(!S.pornit){P.box=null;if(inst.box.parentNode)inst.box.remove();inst.bara=false;return ''}
  /* bara casetei: deasupra pânzei, cât caseta e deschisă */
  const svg=win.querySelector('.pt-svg'),y0=svg?svg.getBoundingClientRect().top:0;
  if(P.box){const tl=win.querySelector('.pt-tools-w');if(tl)tl.insertAdjacentHTML('afterend',bara(P))}
  /* J1-B: când bara apare sau dispare, pânza s-ar muta cu înălțimea ei (pe telefon, ~3 rânduri), iar al doilea clic al unui
     dublu-clic ar cădea în afara casetei sau pe bară; pagina se derulează cu aceeași înălțime, ca pânza să rămână sub mouse / deget */
  const cuBara=!!(P.box&&win.querySelector('.ptx-bar')),y1=svg?svg.getBoundingClientRect().top:0;
  if(svg&&inst.bara!=null&&inst.bara!==cuBara){const dy=cuBara?y1-y0:-(inst.hBara||0);
    if(Math.abs(dy)>1){window.scrollBy(0,dy);if(cuBara&&Math.abs(svg.getBoundingClientRect().top-y0)>2)inst.necomp=Date.now()}}   /* pagina n-a putut derula (e la capăt): bara a rămas sub deget */
  if(cuBara)inst.hBara=y1-y0;inst.bara=cuBara;
  const are=aseaza(inst,S,P);
  if(are&&inst.refocus){inst.refocus=false;try{inst.ta.focus({preventScroll:true});const n=inst.ta.value.length;if(inst.sel){inst.ta.setSelectionRange(inst.sel[0],inst.sel[1])}else inst.ta.setSelectionRange(n,n)}catch(e){}}
  return ''}
function actiune(a,v,c){const S=c.S,P=st(S,c.Q),inst=INST.get(c.Q);
  if(a.startsWith('ptx:')){
    if(a==='ptx:stil'&&['b','i','u','s'].includes(v)){P[v]=!P[v];c.msg('')}
    else if(a==='ptx:al'&&['stanga','centru','dreapta'].includes(v)){P.al=v;c.msg('')}
    if(inst)inst.refocus=true;return true}
  /* J1-G: ↶ cu caseta deschisă (clicul a lipit-o deja, vezi ascultătorul „click”): ↶ scoate textul abia lipit și spune asta */
  if(a==='undo'&&inst&&inst.undoCaseta){inst.undoCaseta=false;if(S.desen.length){S.refa.push(S.desen.pop());S.modificat=true}c.msg(MSG_UNDO);return true}
  if(a==='unealta'&&v==='text'){if(S.ps)S.ps.sel=null;S.unealta='text';S.pop=null;c.ev('unealta',{u:'text'});
    c.msg('Ai ales <b>Text</b>: un clic pe pânză, acolo unde vrei textul, și apare caseta în care scrii.');return true}
  if(a==='grup'&&v==='imagine'){c.msg('Grupul <b>Imagine</b> (lecția 20) nu e în Paint-ul din pagină: azi nu-ți trebuie.');return true}
  if(a==='unealta'&&v==='lupa'){c.msg('<b>Lupa</b> (lecția 20) nu e în Paint-ul din pagină: azi nu-ți trebuie.');return true}
  if(a==='zoom'){c.msg('Zoomul (lecția 20) nu merge în Paint-ul din pagină: pânza rămâne la 100 %.');return true}
  if(a==='meniu'&&v==='viz'){c.msg('Meniul <b>Vizualizați</b> (riglele, zoomul) nu-l folosim azi.');return true}
  return false}

/* ---- gestul pe pânză cu Text (paint.js cheamă deseneaza la ridicarea degetului / butonului) ---- */
const UNELTE=[{id:'text',nume:'Text',grup:'',lectie:22,deseneaza(S,tr,c){const P=st(S,c.Q);if(P.box){fixeaza(S,P,c);return true}
  const a=tr.p[0],b=tr.p[tr.p.length-1];deschide(S,P,c,a,b);const inst=INST.get(c.Q);if(inst){inst.refocus=true;inst.deschisLa=Date.now()}return false}}];
const EXT={unelte:UNELTE,verifica,op,actiune,panou};

/* ---- ascultătorii (o dată pe exercițiu) ---- */
function leaga(Q,body){const root=body.querySelector('.pt'),win=body.querySelector('.pt-win');if(!root||!win)return;
  const inst=INST.get(Q),sim=()=>body._sim,S=()=>sim().stare(),P=()=>st(S(),Q);
  const nota=root.querySelector('.pt-nota'),rb=nota&&nota.querySelector('[data-reset]');
  if(nota&&rb&&!Q.explorare){nota.innerHTML=NOTA;nota.appendChild(document.createTextNode(' '));nota.appendChild(rb)}
  const ta=inst.ta;
  ta.addEventListener('input',()=>{const p=P();if(!p.box)return;p.box.text=ta.value;aseaza(inst,S(),p);
    if(sim()&&sim().test){const L=root.querySelector('.pt-teste');if(L)L.innerHTML=(Q.checks||[]).map(x=>`<li class="${sim().test(x)?'ok':''}">${x.ce}</li>`).join('')}});
  ta.addEventListener('keydown',e=>{e.stopPropagation();const kl=String(e.key).toLowerCase();
    if((e.ctrlKey||e.metaKey)&&!e.altKey&&['s','o'].includes(kl)){e.preventDefault();const s=S(),p=P();fixeaza(s,p,ctx(),true);sim().run([['ctrl',kl]]);return}});
  const ctx=()=>({S:S(),Q,draw:()=>sim().run([]),msg:(t,r)=>{const s=S();s.msg=t;s.rau=!!r},ev:(tip,d)=>{const s=S(),x=Object.assign({tip},d||{});s.ev.push(x);try{body.dispatchEvent(new CustomEvent('paint-sim',{bubbles:true,detail:x}))}catch(er){}}});
  const sigur=t=>!!(t&&t.closest&&(t.closest('.ptx-bar')||t.closest('.ptx-box')||t.closest('.pt-g[data-z="culori"]')||t.closest('.pc-pop')||t.closest('.pc-ov')||t.closest('[data-reset]')));
  /* clic / atingere pe pânză, în afara casetei: textul se lipește; același clic nu deschide altă casetă și nu desenează */
  /* J1-B: al doilea clic / a doua atingere a unui dublu-clic (≤ 600 ms de la deschiderea casetei) nu lipește caseta goală și nu
     deschide lista de pe bară: cursorul rămâne în casetă (în Paint, al doilea clic cade în caseta abia deschisă) */
  const dublu=e=>{const a=inst.josPrev;return Date.now()-(inst.deschisLa||0)<=600&&!!a&&Math.hypot(e.clientX-a.x,e.clientY-a.y)<=30};
  /* pe bară, doar când pagina n-a putut ține pânza pe loc (altfel un clic adevărat pe B, venit repede, s-ar pierde) */
  const dubluBara=e=>dublu(e)&&Date.now()-(inst.necomp||0)<=600&&!!e.target.closest&&!!e.target.closest('.ptx-bar');
  const inCaseta=e=>{e.stopPropagation();e.preventDefault();inst.refocus=true;inst.sel=null;try{ta.focus({preventScroll:true});const n=ta.value.length;ta.setSelectionRange(n,n)}catch(x){}};
  win.addEventListener('pointerdown',e=>{const p=P(),s=S();inst.sel=null;inst.josPrev=inst.jos;inst.jos={x:e.clientX,y:e.clientY};
    if(p.box&&dubluBara(e)){inCaseta(e);return}
    if(sigur(e.target)){if(p.box&&!e.target.closest('.ptx-box')){try{inst.sel=[ta.selectionStart,ta.selectionEnd]}catch(x){}inst.refocus=true}return}
    if(!p.box||s.dlg||s.intreb)return;
    if(e.target.closest&&e.target.closest('.pt-svg')){if(dublu(e)){inCaseta(e);return}
      e.stopPropagation();e.preventDefault();fixeaza(s,p,ctx());sim().run([]);win.focus({preventScroll:true})}},true);
  /* orice alt clic în fereastra Paint (alt instrument, Fișier, ↶ …): întâi textul se lipește, apoi se face ce ai apăsat;
     ↶ cu text în casetă: actiune() scoate textul abia lipit și spune asta (J1-G) */
  win.addEventListener('click',e=>{const p=P();if(p.box&&dubluBara(e)){inCaseta(e);return}
    if(!p.box||sigur(e.target))return;const b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;
    const cuText=!!String(p.box.text).trim();fixeaza(S(),p,ctx(),true);if(b.dataset.act==='undo'&&cuText)inst.undoCaseta=true},true);
  /* tastele Ctrl+S / O / N / Z / Y din afara casetei, cu caseta deschisă: textul se lipește întâi (Ctrl+Z îl scoate apoi: mesajul J1-G) */
  const tasteW=e=>{if(!document.body.contains(root)){window.removeEventListener('keydown',tasteW,true);return}
    const p=P();if(!p.box||e.target===ta)return;if(!(e.ctrlKey||e.metaKey)||e.altKey)return;
    const kl=String(e.key).toLowerCase();if(!['s','o','n','z','y'].includes(kl))return;
    const t=e.target;if(t&&t!==win&&!root.contains(t)&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||'')))return;
    const cuText=!!String(p.box.text).trim();fixeaza(S(),p,ctx(),true);if(kl==='z'&&cuText)ctx().msg(MSG_UNDO)};
  window.addEventListener('keydown',tasteW,true);
  /* listele și caseta de bifat din bară */
  win.addEventListener('change',e=>{const t=e.target,p=P();if(!t.closest||!t.closest('.ptx-bar'))return;
    if(t.classList.contains('ptx-f')&&FONTURI.includes(t.value))p.font=t.value;
    else if(t.classList.contains('ptx-m'))p.marime=+t.value||p.marime;
    else if(t.classList.contains('ptx-fd'))p.fundal=!!t.checked;
    inst.refocus=true;sim().run([])});
  /* cât tragi cu Text: chenarul punctat al casetei viitoare */
  let tr=null;const prev=document.createElement('div');prev.className='ptx-prev';
  win.addEventListener('pointerdown',e=>{const s=S();tr=null;if(s.unealta!=='text'||P().box||s.dlg||s.intreb)return;const svg=e.target.closest&&e.target.closest('.pt-svg');if(!svg)return;tr={x:e.clientX,y:e.clientY,svg}});
  win.addEventListener('pointermove',e=>{if(!tr)return;const wrap=tr.svg.parentNode;if(!wrap)return;const wr=wrap.getBoundingClientRect();
    if(Math.abs(e.clientX-tr.x)<6&&Math.abs(e.clientY-tr.y)<6)return;if(prev.parentNode!==wrap)wrap.appendChild(prev);
    prev.style.left=(Math.min(e.clientX,tr.x)-wr.left)+'px';prev.style.top=(Math.min(e.clientY,tr.y)-wr.top)+'px';prev.style.width=Math.abs(e.clientX-tr.x)+'px';prev.style.height=Math.abs(e.clientY-tr.y)+'px'});
  const gata=()=>{tr=null;if(prev.parentNode)prev.remove()};win.addEventListener('pointerup',gata);win.addEventListener('pointercancel',gata);
  if(window.ResizeObserver){let w0=0;new ResizeObserver(()=>{const w=root.clientWidth;if(Math.abs(w-w0)>2){w0=w;aseaza(inst,S(),P())}}).observe(root)}
  /* telefonul: tastatura de pe ecran acoperă jumătatea de jos; caseta în care scrii rămâne la vedere (deasupra tastaturii) */
  const laVedere=()=>{if(document.activeElement!==ta||!inst.box.parentNode)return;const vv=window.visualViewport,r=inst.box.getBoundingClientRect(),H=vv?vv.height:innerHeight,T=vv?vv.offsetTop:0;
    if(r.top<T+4||r.bottom>T+H-4){const dy=r.top-T-Math.max(8,(H-r.height)/3);window.scrollBy(0,dy)}};
  let cuMouse=true;try{cuMouse=matchMedia('(pointer:fine)').matches}catch(x){}
  /* R1 (J1-B, derularea): la fiecare focus (și după un clic pe B, pe mărime…) doar pe telefon; cu mouse, pagina nu mai sare sub
     cursor la 0,35 s după un clic pe bară (browserul aduce singur caseta la vedere când scrii) */
  ta.addEventListener('focus',()=>{if(!cuMouse)setTimeout(laVedere,350)});
  if(window.visualViewport){const vr=()=>{if(!document.body.contains(root)){window.visualViewport.removeEventListener('resize',vr);return}laVedere()};window.visualViewport.addEventListener('resize',vr)}
  /* J1-E: pe telefon (Dumbrava) nu e Paint și nici fișier: butonul de sub Paint (doar cu Q.descarca) descarcă pânza ca imagine
     PNG, în browser (un link cu imaginea în el; nimic nu pleacă spre un server). Caseta deschisă se lipește întâi.
     Doar fără mouse (telefon, tabletă): pe calculatorul comun din laborator nu lăsăm fișiere în Descărcări (regula 23). */
  if(Q.descarca&&!Q.explorare&&!cuMouse){const o=Q.descarca,w=document.createElement('div');w.className='ptx-desc';
    w.innerHTML=`<button type="button" class="ptx-desc-b">${o.eticheta||'Păstrează desenul (imagine)'}</button><span class="ptx-desc-m" aria-live="polite"></span>`;
    root.insertBefore(w,nota||root.querySelector('.pt-ext'));const m=w.querySelector('.ptx-desc-m');
    w.querySelector('button').addEventListener('click',()=>{const s=S(),p=P();if(!s.pornit){m.textContent='Paint e închis: pornește-l și desenează întâi.';return}
      if(p.box)fixeaza(s,p,ctx(),true);sim().run([]);
      const R=PC.raster(s);let url='';try{url=R.cv.toDataURL('image/png')}catch(x){}
      if(!url){m.textContent='Browserul n-a putut face imaginea: arat-o profesorului pe ecran.';return}
      const nume=o.fisier||'desen.png',a=document.createElement('a');a.href=url;a.download=nume;a.style.display='none';document.body.appendChild(a);a.click();a.remove();
      ctx().ev('descarcat',{fisier:nume});m.innerHTML=o.gata||('Gata: imaginea <b>'+E(nume)+'</b>.')})}
}
const NOTA='Un Paint mic, desenat în pagină, după Paint-ul din Windows 11. Aici merge și <b>Text</b> (litera A, grupul <b>Instrumente</b>): un clic pe pânză deschide caseta, iar deasupra pânzei apare bara ei. În pagină, caseta nu se mută și nu se mărește trăgând de ea; mărimea și stilul se schimbă pentru tot textul din casetă; sunt doar câteva fonturi. Merg și culorile, <b>Umplere</b>, <b>Forme</b>, <b>Pensule</b>, selecția și tastele <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>. Cu caseta deschisă, ↶ scoate tot textul din ea: o literă greșită o ștergi în casetă, cu ⌫ (Backspace). Pe telefon: atinge caseta ca să-ți apară tastatura; ↶ (Anulați) e sus.';

function creeaza(alte){
  const baza=PC.creeaza([EXT].concat(alte||[]));
  return {
    render(Q,body,api){css();
      const box=document.createElement('div');box.className='ptx-box';
      const ta=document.createElement('textarea');ta.setAttribute('aria-label','Casetă de editare text');ta.setAttribute('autocomplete','off');ta.setAttribute('autocorrect','off');ta.setAttribute('autocapitalize','off');ta.setAttribute('spellcheck','false');ta.rows=1;
      box.appendChild(ta);for(let j=0;j<8;j++)box.appendChild(document.createElement('i'));
      INST.set(Q,{body,box,ta,refocus:false,sel:null});
      baza.render(Q,body,api);leaga(Q,body);if(body._sim)body._sim.run([])},
    rezolva(Q,body,api){return baza.rezolva(Q,body,api)},
    gresit(Q,body,api){return baza.gresit(Q,body,api)}
  };
}

/* ---- desenele lecției 22 (în PaintSim.DESENE) ---- */
const F=(fel,x1,y1,x2,y2,c,f,tag)=>({u:'forma|'+fel+'|3'+(c?'|c='+c:'')+(f?'|f='+f:'')+(tag?'#'+tag:''),p:[[x1,y1],[x2,y2]]});
const U=(n,x,y,hex)=>({u:'umplere|'+n+'|c='+hex,p:[[x+n*1e-7,y]]});
function T0(text,x,y,w,o){const T=Object.assign({text,font:'Calibri',marime:48,b:true,i:false,u:false,s:false,al:'stanga',fundal:false,x,y,w,h:0},o||{});T.h=inaltime(T,w);const tr=pune({},T,o&&o.c||'#3f48cc','#ffffff');return {u:tr.u,p:tr.p}}
const DESENE_NOI={};
function desene(){
  /* afișul de la atelier: fundal galben deschis, o stea roșie; titlul îl pune elevul */
  DESENE_NOI.ptx_afis=[U(880001,10,10,'efe4b0'),F('stea5',70,250,290,470,'ed1c24','ed1c24','stea')];
  /* felicitarea: fundal turcoaz deschis, o inimă roșie (Încearcă, „Încă un exercițiu”) */
  DESENE_NOI.ptx_felicitare=[U(880002,10,10,'99d9ea'),F('inima',760,360,960,560,'ed1c24','ed1c24','inima')];
  /* afișul cu titlul greșit („desn”), abia lipit (P4) */
  DESENE_NOI.ptx_greseala=[U(880003,10,10,'efe4b0'),F('stea5',760,330,960,530,'ff7f27','ff7f27','stea'),T0('Concurs de desn',120,90,760,{marime:48,b:true,c:'#3f48cc'})];
  Object.keys(DESENE_NOI).forEach(k=>{if(PS.DESENE)PS.DESENE[k]=DESENE_NOI[k]});
}
if(document.body)desene();else document.addEventListener('DOMContentLoaded',desene);

window.PaintText={versiune:5,ext:EXT,creeaza,FONTURI,MARIMI,TEXTE,randeaza,vizibil,vede,contrast,texte,atinge,DESENE:DESENE_NOI};
window.SimPaintText=creeaza();
})();
