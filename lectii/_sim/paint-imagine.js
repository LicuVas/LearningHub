/* Extensia „paint-imagine” pentru simulatorul Paint din lecții (lectii/_sim/paint-imagine.js).
   PROPRIETAR: autorul lecției V · M3 · nr. 20 („Redimensionare, trunchiere, rotație, panoramare”), 24.10.2026.
   Se încarcă DUPĂ paint.js (V/18) și paint-selectie.js (V/19), pe care NU le modifică:
     <script src="../../_sim/paint.js"></script><script src="../../_sim/paint-selectie.js"></script><script src="../../_sim/paint-imagine.js"></script>
     JocMotor.porneste({ …, tipuri:{paintw:SimPaintImg} })
   O lecție următoare: const SimX=PaintImagine.creeaza([extensiaTa]) (= PaintSelectie.creeaza([PaintImagine.ext, extensiaTa])).

   CE ADAUGĂ (peste paint.js + paint-selectie.js): grupul Imagine (Decupare = tăierea marginilor, Eliminați fundalul, Rotiți ⌄,
   Răsturnare ⌄, Redimensionați și înclinați), meniurile Rotiți / Răsturnare, fereastra „Redimensionare și înclinare”, panoramarea
   (Zoom) din colțul drept al barei de stare (Potrivire la fereastră, procentul cu ⌄, Micșorare, bara cu buton, Mărire; Ctrl + rotița
   pe pânză), pierderea de calitate la mărire, pixelii văzuți la zoom mare.

   FIDELITATE (Paint 11.2605 din Windows 11, în română; Paint NU a fost pornit — aplicație din Magazin):
   DIN UI AUTOMATION pe Paint-ul real (judecătorul V/8, lectii/v/m2-l08/_verificare/paint_ascuns2.json):
     · grupul „Imagine”: Decupare (CropButton) · Eliminați fundalul · Rotiți (RotateDropdown) · Răsturnare (Flip) · Redimensionați și
       înclinați; la ~1230 px grupul e un buton strâns, care se deschide;
     · meniul Rotiți: Rotire la dreapta 90º · Rotire la stânga 90º · Rotire cu 180º · Rotire personalizată;
     · bara de stare, la dreapta: Potrivire la fereastră (buton) · Zoom (casetă combo EDITABILĂ) · Micșorare (buton) · Zoom (cursor) ·
       Mărire (buton).
   DIN CAPTURI REALE (jocuri/grafica-v/img, Paint RO, 20.09.2026): rotire.webp (meniul Rotiți), redimensionare.webp (fereastra
     „Redimensionare și înclinare”: Redimensionați · Procent (ales) / Pixeli · Orizontal 100 · butonul-lanț ALBASTRU · Vertical 100 ·
     Oblic: Orizontal 0° / Vertical 0° · OK / Anulare), trunchiere.webp (selecția și butonul Decupare din grupul Imagine, apăsabil),
     fereastra-paint.webp (fără selecție, Decupare e GRI), panoramare.webp (146 % ⌄, lupa cu −, bara, lupa cu +).
   DIN RESURSE (resources.pri, lectii/v/m3-l18/_proba/pri_ro.txt): Răsturnare verticală, Răsturnare orizontală, Redimensionați,
     Procent, Pixeli, Orizontal, Vertical, Oblic, Mențineți raportul de aspect (= butonul-lanț), Imagine trunchiată, Rotit, Zoom,
     Mărire, Micșorare, Potrivire la fereastră, Lupă, „Introduceți un număr valid.”.
   DIN DOCUMENTAȚIA MICROSOFT (microsoft.com/windows/paint, FAQ, citită la V/19 — lectii/v/m3-l19/_proba/doc/ms_paint.txt): „resize …
     in pixels or as a percentage of the original size”; „crop … selecting the portion of the image you want to keep using the Select
     tool and then clicking the Crop button … This will remove the unselected portion of the image”; „Zoom: To zoom in and out of your canvas”.
   PRESUPUS (de fotografiat în laborator — lectii/v/m3-l20/capturi_lipsa.json):
     · cu lanțul albastru, ce scrii la Orizontal se pune singur și la Vertical (procente: același număr; pixeli: păstrând proporția);
     · Pixeli arată la început mărimea imaginii; Procent arată 100 / 100; procentele 1-500, pixelii 1-8000 (altfel „Introduceți un
       număr valid.”);
     · ordinea din meniul Răsturnare (verticală, apoi orizontală); Răsturnare orizontală = stânga ↔ dreapta;
     · după Decupare, selecția dispare; Decupare pe o selecție „Formă liberă” taie la dreptunghiul din jurul ei;
     · lista procentelor de zoom (12,5 … 800 %), pașii butoanelor Mărire / Micșorare, Ctrl + rotița mouse-ului; zoomul se întoarce la
       potrivirea la fereastră când deschizi alt fișier; zoomul nu intră la Ctrl+Z;
     · mărirea unei imagini o face neclară (pixelii se întind) — aici, o estompare; la zoom mare se văd pixelii — aici, o copie a pânzei
       desenată pe pixeli (image-rendering: pixelated).
   ABATERI, spuse pe ecran: fereastra Paint-ului din pagină e îngustă (~670 px și pe calculator), deci grupul Imagine e MEREU un
     buton strâns, care se deschide ca listă cu numele butoanelor (în Paint, pictogramele; pe telefon nu există „ține mouse-ul pe
     buton”) — nota de sub Paint o spune pentru orice ecran; cu o bucată selectată (nu toată pânza), Paint-ul adevărat schimbă de
     obicei doar bucata; aici Rotiți / Răsturnare / Redimensionați lucrează doar pe toată imaginea și cer întâi un clic în afara
     selecției (sau Esc). Rotire personalizată, Oblic, Eliminați fundalul, Lupa și meniul Vizualizați spun „n-o folosim azi”.
     Formele asimetrice rotite / răsturnate devin linii (aceeași formă pe ecran; umplerea lor se pierde — lecția 20 nu are
     umplere). Liniile desenate PESTE o imagine mărită și apoi transformate se estompează și ele (rar). Mesajele de lecție (nu sunt
     ale Paint-ului): un număr lipit de cel vechi în fereastră („10050”), Ctrl+Z fără nimic de anulat, Decupare pe toată pânza,
     o atingere pe marginea gri din jurul pânzei cu Selectare.

   REPARAȚII DUPĂ JUDECATA 1 (24.10.2026, lectii/v/m3-l20/_verificare/registru_j1.md):
     · Ctrl+Z / ↶ NU mai coboară sub starea de la deschidere (paint.js scotea și trasee din poza abia deschisă): pe cele trei
       drumuri — butonul ↶ (actiune), tasta în Paint-ul din pagină (keydown în captură pe fereastră) și tasta din afara lui
       (paint-selectie.js → run([['ctrl','z']]), prins de run-ul îmbrăcat). Starea de pornire: S.pi.n0 = {ref: S.desen, n}, pusă la
       prima desenare și la fiecare deschis / nou / pornit / închis (evenimentul 'paint-sim'). paint.js NEATINS.
     · taiat{tag, prin?}: obiectul trebuie să EXISTE în desen (nu mai trece „vacuu” când lipsește); cu prin:'trunchiere',
       Decuparea însăși l-a scos (vizibil înainte, nevăzut după: TRANSF[id].vaz = {inainte, dupa}).
     · Decupare pe o selecție cât toată pânza: nu taie nimic și spune asta (nu mai „coace” un bloc, testul trunchiere nu trece).
     · Un clic / o atingere în afara Paint-ului din pagină închide meniul / lista deschisă (Rotiți, Răsturnare, Imagine, Zoom,
       Fișier, Editare…), ca în Paint (un defect comun: paint.js / paint-selectie.js nu închideau; oprit de aici).
     · Desenul cu deget (pi_deget, pi_atelier) are degetul mai la stânga, casa și copacul mai la dreapta, soarele mai jos: locul
       de pornire a chenarului are 200 × 150 de unități (≈ 49 × 37 px la 390 px). Desen nou: pi_culcat_dr (culcat spre dreapta).

   REPARAȚII DUPĂ JUDECATA 2 (24.10.2026, lectii/v/m3-l20/_verificare/registru_j1.md, literele V-Z):
     · V: taiat{prin:'trunchiere'} judecă REZULTATUL, geometric: la fiecare Decupare, TRANSF[id].geo = {inainte, dupa} = cât din
       fiecare etichetă stă (ca loc, oricine l-ar acoperi: alb de la Ctrl+X / Delete, radieră, o lipire) pe pânza de dinainte și în
       dreptunghiul păstrat. Trece dacă o Decupare a lăsat obiectul în afară (era pe pânză, nu mai e), obiectul e în desen și nu se vede.
       Înainte (vaz = ce SE VEDEA) respingea tăierea bună făcută după Ctrl+X / Delete pe deget, cu un mesaj fals. vaz rămâne (API).
     · W: mesajul marginii gri vine doar la RIDICAREA unei apăsări pornite pe marginea gri propriu-zisă (nu pe barele de derulare ale
       pânzei mărite, nu când pagina s-a derulat sub deget — pointercancel), fără redesenare (aceea înlocuia zona derulabilă și bara
       nu se mai putea trage); textul spune doar ce face pagina.
     · X: mesajele de după tăiere / micșorare / mărire, mai scurte.
     · Z: în fereastra Redimensionare, fiecare casetă ține minte cât a rămas în față din numărul de la deschidere (D.hr / D.vr); un număr
       respins cu o bucată din cel vechi în față („10050”, dar și „1050”, după un singur Backspace) primește explicația lecției.

   REPARAȚII DUPĂ JUDECATA 3 (24.10.2026, lectii/v/m3-l20/_verificare/registru_j1.md, literele AA, AB):
     · AA: testul trunchierii judecă NUMAI starea finală a pânzei, ca un profesor care se uită la poza salvată (regula dirijorului):
       testul nou taiere{parte:'deget'|'intregi'|'marime', …} (vezi „Teste noi”). Cum a ajuns elevul acolo (Ctrl+X, Delete, degetul
       tras afară, o copie lipită și pusă la loc) nu contează: o poză identică cu cea bună trece mereu. Mesajul de respingere se scrie
       la fiecare verificare din starea de ACUM (unde se vede degetul, ce s-a tăiat, cât e pânza) și, urmat întocmai, duce la „Corect”.
       taiat{prin:'trunchiere'} rămâne în API (nu-l mai folosește lecția); geoPuncte păstrează acum, la o mutare, și locul vechi.
     · AB: în fereastra Redimensionare, la o respingere, explicația bucății vechi din față apare pentru ORICE casetă care o are, și
       când numărul ei e sub limită (cu lanțul: „6216” la Vertical a pus 9957 la Orizontal). Limita de 8000 px nu e afirmată nicăieri.

   REPARAȚII DUPĂ JUDECATA 4 (24.10.2026, lectii/v/m3-l20/_verificare/registru_j1.md, literele AC-AG):
     · AC: taiere{parte:'intregi'} nu mai socotește procente („90 % din contur” lăsa să treacă acoperișul tăiat 7-22 px și soarele
       tăiat 3-5 px): în cadrul găsit, FIECARE punct al conturului modelului (casa, acoperișul, copacul, soarele, plus ușa și trunchiul)
       stă pe pânză cu tot conturul lui de 3 px (jumătatea grosimii, 1,5 unități, la scara de acum) și se vede (un punct văzut al
       aceleiași etichete la cel mult ~3 px). Așa iese exact intervalul lecției (x de la 243, y de la 148, până la 991 / 561), aceeași
       regulă pentru x0 = 244 și pentru x0 = 250…265: „Ai tăiat și din acoperiș…”.
     · AD: o latură a unui obiect la cel mult 5 unități de marginea pânzei e „lipită” (conturul e eșantionat din 4 în 4: la 1 unitate,
       verdictul sărea după un pixel); scara se ia doar din laturile libere, separat pe orizontală și pe verticală. Dacă cadrul tot nu
       iese, caut o poziție DREAPTĂ (nerotită, nerăsturnată, aceeași scară pe ambele direcții) în care cel puțin 90 % din conturul văzut
       stă pe conturul modelului; mesajul „ai rotit-o, ai răsturnat-o, ai redimensionat-o…” apare NUMAI când nu există așa ceva.
     · AE: Decupare pe o selecție cât toată pânza nu taie nimic și SCOATE selecția (ca după orice Decupare; un clic pe pânză n-o scotea:
       toată pânza era în ea, iar tragerea de după muta toată poza); mesajul spune exact asta.
     · AF: nimic în plus pe pânza de la sfârșit: o copie lipită sau o bucată mutată a unui obiect (alt loc decât conturul lui din model)
       și un desen fără etichetă (Creion, Pensule, Forme) peste poză resping „întregi”, cu locul lor (sus / jos, stânga / mijloc / dreapta).
     · AG: cu un zoom ales (nu „Potrivire la fereastră”), orice mesaj al testului taiere începe cu „(Întâi
       Potrivire la fereastră…)”: pe telefon, o tragere cu un deget face chenar, nu plimbă pânza, deci colțul îndepărtat nu se poate atinge.
     · „Pânza e încă prea lată: în stânga a rămas locul degetului” și când fereastra începe la x = 46 (cerneala degetului ține până
       la 46,5; înainte cerea < 45 și dădea mesajul general „taie mai mult din margini”).

   CUM E FĂCUT (pentru lecțiile următoare): o transformare (rotire, răsturnare, trunchiere, redimensionare) „coace” tot ce se vede
     într-un bloc nou (PaintSelectie.BLOCURI, tipul lui V/19), transformat, cu fundal alb, peste toată pânza nouă: traseul
     {u:'bloc|<id>', p:[[0,0]]}. paint-selectie.js îl desenează ca pe orice lipire (și cât tragi cu mouse-ul / degetul); Ctrl+Z îl
     scoate (paint.js), iar extensia pune la loc mărimea pânzei. Registrul: PaintImagine.TRANSF[id] = {op, inainte:[w,h], dupa:[w,h], ps}.
     Pierderea de calitate: blocul unei imagini mărite are ca prim traseu un marcaj {u:'alb|r', p:[[-9,-9],[-8,-9+nivel]]} (un
     dreptunghi alb de 1 × nivel, în afara pânzei: nu se vede, nu ascunde nimic), după care CSS-ul de aici estompează grupul blocului.
     Fiecare bloc de transformare începe cu marcajul {u:'alb|r', p:[[-7,-7],[-6,-6]]}: CSS-ul de aici nu mai desenează ce e ÎNAINTEA
     blocului (e acoperit oricum; altfel, la marginea pânzei, netezirea lăsa să se vadă câte un pixel din desenul vechi).

   API: window.PaintImagine = {versiune:1, ext, creeaza(alte?), TRANSF, coace(desen, op, w, h, arg?), DESENE, PRESET,
        judecaTaiere(S, t) (judecata 3: {ok:{deget,intregi,marime}, msg:{…}, cadru:{s,ox,oy,win}|null})}
        window.SimPaintImg = PaintImagine.creeaza()
   Starea: S.pi = {zoom:null|procent, zmax, fitPct, baza, dlg, …}. Q.pi (opțional) = {marimi:[[cale,w,h],…] (mărimea fișierelor
     din Q.fs care nu au 1038 × 648), model:{desen,w,h} („Modelul”, desenat sub Paint)}.
   Evenimente noi pe 'paint-sim': rotit{op}, rasturnat{op}, trunchiat{w,h}, redimensionat{w,h,w0,h0}; 'zoom'{z} se scrie doar în S.ev.
   Teste noi (checks[].k): marime{w,h,tol?} · pozitie{c:[[tagA,'sus'|'jos'|'stanga'|'dreapta',tagB],…], model?} (judecata 3: cu
     model, o relație cu un obiect tăiat de tot nu mai respinge o poză dreaptă — dreaptă = cel puțin două obiecte întregi la locul lor
     față de model, în același cadru) · intreg{tag} ·
     taiat{tag, max?, prin?} (prin:'trunchiere' = o Decupare din grupul Imagine l-a lăsat în afara pânzei; geometric, vezi V) ·
     transformat{op} ('rotd'|'rots'|'rot180'|'rasto'|'rastv'|'trunchiere'|'redim'; după Ctrl+Z nu mai trece) ·
     redim{w?, h?, tol?, pastrat?} (ultima redimensionare; pastrat = proporțiile păstrate) · zoom{min?, acum?} ·
     taiere{parte, model:'pi_deget', mw?, mh? (1038 × 648), scoate:'deget', pastreaza:[…], w:[min,max], h:[min,max], fereastra?, max?}
       (judecata 3, AA; DOAR starea finală): parte 'deget' = nicio bucată din obiectul „scoate” nu se vede (≤ max, implicit 2 %);
       'intregi' = (judecata 4) fiecare punct al obiectelor „pastreaza” (+ ușa, trunchiul) e pe pânză și se vede, la locul lui, poza
       nerotită, nerăsturnată (și nemărită, fără fereastra), nimic în plus (copii, bucăți mutate, desene); 'marime' = pânza (cu fereastra: bucata din model pe care o arată pânza, dacă poza a fost apoi micșorată cu lanțul)
       are w × h în intervalele date. Cadrul (scara, deplasarea) se află din obiectele întregi, comparate cu modelul; t.msg se scrie
       la fiecare verificare, din starea de acum (textele vorbesc de poza lecției 20: degetul, casa, copacul, soarele, acoperișul).
   Operații noi (sol / gresit): ['rot','d'|'s'|'180'] · ['rast','o'|'v'] · ['trunchiaza'] (Decupare din grupul Imagine, pe selecția de
     acum) · ['redim','procent'|'pixeli',orizontal,vertical] · ['zoom',procent|'fit'].
   Desene noi în PaintSim.DESENE (etichete: casa, acoperis, usa, copac, trunchi, soare, iarba, deget): pi_scena, pi_deget (cu un
     deget pe marginea din stânga; casa și copacul mai la dreapta, soarele mai jos), pi_culcat (pi_scena rotită spre stânga,
     648 × 1038), pi_culcat_dr (pi_scena rotită spre dreapta, 648 × 1038), pi_invers (cu susul în jos), pi_oglinda (răsturnată
     orizontal), pi_atelier (pi_deget rotită spre stânga, 648 × 1038). */
(function(){
'use strict';
const PS=window.PaintSim,PSL=window.PaintSelectie;
if(!PS||!PSL||!PSL.creeaza){if(window.console)console.error('paint-imagine.js: încarcă întâi ../../_sim/paint.js și ../../_sim/paint-selectie.js');return}
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BLOCURI=PSL.BLOCURI,parse=PSL.parse,randeaza=PSL.randeaza,scena=PSL.scena;
const TRANSF={};
const INST=new WeakMap();
const PRESET=[12.5,25,50,100,200,300,400,500,600,700,800],ZMIN=12.5,ZMAX=800,ZPIX=300;

/* ---- geometria formelor: aceleași formule ca în paint-selectie.js (copie, ca să pot transforma conturul) ---- */
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
function contur(fel,p){const a=p[0],b=p[p.length-1];const X=Math.min(a[0],b[0]),Y=Math.min(a[1],b[1]),w=Math.abs(b[0]-a[0]),h=Math.abs(b[1]-a[1]);
  if(fel==='linie')return {inchis:false,pts:[a.slice(),b.slice()]};
  if(UNIT[fel])return {inchis:true,pts:UNIT[fel].map(([u,v])=>[X+u*w,Y+v*h])};
  if(fel==='oval'){const q=[];for(let i=0;i<48;i++){const t=i/48*2*Math.PI;q.push([X+w/2+w/2*Math.cos(t),Y+h/2+h/2*Math.sin(t)])}return {inchis:true,pts:q}}
  if(fel==='dreptunghiR'){const r=Math.min(w,h)*.18,q=[];[[X+w-r,Y+r,-90],[X+w-r,Y+h-r,0],[X+r,Y+h-r,90],[X+r,Y+r,180]].forEach(([cx,cy,a0])=>{for(let i=0;i<=6;i++){const t=(a0+i*15)*Math.PI/180;q.push([cx+r*Math.cos(t),cy+r*Math.sin(t)])}});return {inchis:true,pts:q}}
  return {inchis:true,pts:[[X,Y],[X+w,Y],[X+w,Y+h],[X,Y+h]]}}
const r2=v=>Math.round(v*100)/100;
const ap=(M,q)=>[r2(M[0]*q[0]+M[2]*q[1]+M[4]),r2(M[1]*q[0]+M[3]*q[1]+M[5])];
const rectDin=(a,b)=>[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])];

/* ---- transformările: matricea (x' = a·x + c·y + e, y' = b·x + d·y + f) și mărimea nouă ---- */
function matrice(op,W,H,arg){
  switch(op){
    case 'rotd':return {M:[0,1,-1,0,H,0],w:H,h:W};          /* la dreapta 90° (ca acele ceasului): (x,y) → (H−y, x) */
    case 'rots':return {M:[0,-1,1,0,0,W],w:H,h:W};          /* la stânga 90°: (x,y) → (y, W−x) */
    case 'rot180':return {M:[-1,0,0,-1,W,H],w:W,h:H};
    case 'rasto':return {M:[-1,0,0,1,W,0],w:W,h:H};         /* răsturnare orizontală: stânga ↔ dreapta */
    case 'rastv':return {M:[1,0,0,-1,0,H],w:W,h:H};         /* răsturnare verticală: sus ↔ jos */
    case 'trunchiere':{const r=arg;return {M:[1,0,0,1,-r[0],-r[1]],w:r[2],h:r[3]}}
    case 'redim':{const w=arg[0],h=arg[1];return {M:[w/W,0,0,h/H,0,0],w,h}}
  }
  return null}
/* ce forme rămân forme (cu alt nume, la săgeți) după o rotire / răsturnare; restul devin linii pe contur */
const SIM_TOT=['linie','oval','dreptunghi','dreptunghiR','romb','stea4'];
const SIM_O=['triunghi','pentagon','stea5','stea6','hexagon','inima','sageataSus','sageataJos'];
const SIM_V=['hexagon','stea6','sageataD','sageataS'];
const SCHIMB={rasto:{sageataD:'sageataS',sageataS:'sageataD'},rastv:{sageataSus:'sageataJos',sageataJos:'sageataSus'},
  rot180:{sageataD:'sageataS',sageataS:'sageataD',sageataSus:'sageataJos',sageataJos:'sageataSus'},
  rotd:{sageataSus:'sageataD',sageataD:'sageataJos',sageataJos:'sageataS',sageataS:'sageataSus'},
  rots:{sageataSus:'sageataS',sageataS:'sageataJos',sageataJos:'sageataD',sageataD:'sageataSus'}};
function felNou(fel,op){
  if(op==='trunchiere'||op==='redim'||SIM_TOT.includes(fel))return fel;
  if(SCHIMB[op]&&SCHIMB[op][fel])return SCHIMB[op][fel];
  if(op==='rasto'&&SIM_O.includes(fel))return fel;
  if(op==='rastv'&&SIM_V.includes(fel))return fel;
  if(op==='rot180'&&(fel==='hexagon'||fel==='stea6'))return fel;
  return null}

/* ---- marcajul pierderii de calitate (vezi capul fișierului) ---- */
const NIV=[0,1.5,2,3,4,6,8,12,16];
const nivel=ps=>{let b=1;for(let i=1;i<NIV.length;i++)if(Math.abs(NIV[i]-ps)<Math.abs(NIV[b]-ps))b=i;return b};
const marcaj=ps=>({u:'alb|r',p:[[-9,-9],[-8,-9+nivel(ps)]]});
const esMarcaj=s=>!!s&&s.u==='alb|r'&&s.p.length===2&&s.p[0][0]===-9&&s.p[0][1]===-9&&s.p[1][0]===-8;
const psMarcaj=s=>NIV[Math.round(s.p[1][1]+9)]||1;
/* marcajul blocului de transformare: tot ce e desenat ÎNAINTEA lui e acoperit (CSS-ul de mai jos nu-l mai desenează: altfel, la
   marginea pânzei, câte un pixel din desenul vechi trecea prin netezirea marginii) */
const marcajT=()=>({u:'alb|r',p:[[-7,-7],[-6,-6]]});
const esMarcajT=s=>!!s&&s.u==='alb|r'&&s.p.length===2&&s.p[0][0]===-7&&s.p[0][1]===-7&&s.p[1][0]===-6;

/* ---- coacerea: un traseu / o listă, transformate cu T = {M, k (grosimi), kmax (calitate), op} ---- */
const sufix=o=>(o.c?'|c='+o.c.slice(1):'')+(o.f?'|f='+o.f.slice(1):'')+(o.tag?'#'+o.tag:'');
function coaceUnul(s,T){
  if(esMarcaj(s)){const ps=psMarcaj(s)*T.kmax;return ps>1.25?marcaj(ps):null}
  if(esMarcajT(s))return {u:s.u,p:s.p.map(q=>q.slice())};
  const o=parse(s.u),M=T.M,P=s.p.map(q=>ap(M,q)),dim=d=>Math.max(1,Math.round(d*T.k));
  switch(o.t){
    case 'creion':return {u:(o.simplu?'creion':'creion|'+dim(o.dim))+sufix(o),p:P};
    case 'pensula':return {u:(o.simplu?'pensula':'pensula|'+o.tip+'|'+dim(o.dim))+sufix(o),p:P};
    case 'radiera':return {u:'radiera|'+dim(o.dim),p:P};
    case 'alb':return {u:s.u,p:P};
    case 'forma':{const f2=felNou(o.fel,T.op);
      if(f2)return {u:'forma|'+f2+'|'+dim(o.dim)+sufix(o),p:[P[0],P[P.length-1]]};
      const k=contur(o.fel,s.p),pts=k.pts.concat(k.inchis?[k.pts[0]]:[]).map(q=>ap(M,q));
      return {u:'creion|'+dim(o.dim)+(o.c?'|c='+o.c.slice(1):'')+(o.tag?'#'+o.tag:''),p:pts}}
    case 'bloc':case 'muta':{const B=BLOCURI[o.id];if(!B)return {u:s.u,p:P};
      const nd=coaceLista(B.desen,T),r=B.f.r,R=rectDin(ap(M,[r[0],r[1]]),ap(M,[r[0]+r[2],r[1]+r[3]]));
      BLOCURI.push({desen:nd,f:{r:R,p:B.f.p?B.f.p.map(q=>ap(M,q)):null}});const id=BLOCURI.length-1;
      const d=[s.p[0][0]-r[0],s.p[0][1]-r[1]],Ad=[M[0]*d[0]+M[2]*d[1],M[1]*d[0]+M[3]*d[1]];
      return {u:o.t+'|'+id+(o.tag?'#'+o.tag:''),p:[[r2(R[0]+Ad[0]),r2(R[1]+Ad[1])]]}}
  }
  return {u:s.u,p:P}}
function coaceLista(L,T){const o=[];(L||[]).forEach(s=>{const x=coaceUnul(s,T);if(x)o.push(x)});return o}
function TDin(op,W,H,arg){const m=matrice(op,W,H,arg);if(!m)return null;const M=m.M,det=Math.abs(M[0]*M[3]-M[1]*M[2]);
  return {m,T:{M,k:Math.sqrt(det),op,kmax:op==='redim'?Math.max(Math.abs(M[0]),Math.abs(M[3])):1}}}
/* pentru desene gata făcute (DESENE): lista transformată, fără blocuri */
function coace(desen,op,W,H,arg){const x=TDin(op,W||1038,H||648,arg);return x?coaceLista(desen,x.T):[]}

/* ---- blocurile transformărilor din desenul de acum ---- */
const idT=s=>{if(!s||!/^bloc\|\d+$/.test(s.u)||!s.p[0]||s.p[0][0]!==0||s.p[0][1]!==0)return -1;const id=+s.u.slice(5);return TRANSF[id]?id:-1};
function ultimT(d){for(let i=d.length-1;i>=0;i--)if(idT(d[i])>=0)return i;return -1}
function primT(d){for(let i=0;i<d.length;i++)if(idT(d[i])>=0)return i;return -1}
const transformari=S=>S.desen.map(idT).filter(id=>id>=0).map(id=>TRANSF[id]);
function asiguraBaza(S,P){if(P.baza.ref===S.desen)return;const i=primT(S.desen);const t=i>=0?TRANSF[idT(S.desen[i])]:null;
  P.baza={ref:S.desen,w:t?t.inainte[0]:S.w,h:t?t.inainte[1]:S.h}}
function marimeDorita(S,P){asiguraBaza(S,P);const i=ultimT(S.desen);return i>=0?TRANSF[idT(S.desen[i])].dupa:[P.baza.w,P.baza.h]}
/* ---- judecata 2, V: UNDE stă fiecare etichetă, oricine ar acoperi-o (alb de la Ctrl+X / Delete, radieră, o lipire peste ea) ----
   aceleași puncte ca scena() din paint-selectie.js (conturul formelor, des, la 4 unități), dar fără „ascunderi”; doar o bucată MUTATĂ
   cu selecția nu mai e la locul ei (ca acolo). Pentru taiat{prin:'trunchiere'}: Decuparea judecată după rezultat, nu după istorie. */
const inRg=(q,r)=>q[0]>=r[0]&&q[0]<=r[0]+r[2]&&q[1]>=r[1]&&q[1]<=r[1]+r[3];
function inPolig(q,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>q[1])!==(yj>q[1]))&&(q[0]<(xj-xi)*(q[1]-yi)/((yj-yi)||1e-9)+xi))c=!c}return c}
function deasaG(P,inchis){const L=inchis?P.concat([P[0]]):P;if(L.length===1)return [L[0].slice()];const o=[];
  for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4));for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}
  if(!inchis)o.push(L[L.length-1].slice());return o}
function geoPuncte(L,ad){const out=[];if(ad>30)return out;
  (L||[]).forEach(s=>{const o=parse(s.u);
    if(o.t==='bloc'||o.t==='muta'){const B=BLOCURI[o.id];if(!B)return;const r=B.f.r,inS=q=>B.f.p?inPolig(q,B.f.p):inRg(q,r);
      /* judecata 3, AA: la o mutare, locul vechi („locul lui”) rămâne socotit; copia se adaugă unde a ajuns (înainte: punctele
         degetului tras afară din pânză dispăreau, iar tăierea bună de după era respinsă) */
      const dx=s.p[0][0]-r[0],dy=s.p[0][1]-r[1];
      geoPuncte(B.desen,ad+1).forEach(x=>{if(inS(x.q))out.push({tag:x.tag,q:[x.q[0]+dx,x.q[1]+dy]})});return}
    if(!o.tag||o.t==='alb'||o.t==='radiera'||!s.p||!s.p.length)return;
    const k=o.t==='forma'?contur(o.fel,s.p):{inchis:false,pts:s.p};
    deasaG(k.pts,k.inchis).forEach(q=>out.push({tag:o.tag,q}))});
  return out}
/* cât din fiecare etichetă stă într-un dreptunghi [x, y, w, h] (fracția punctelor ei) */
function geoFractii(G,r){const n={},a={};G.forEach(x=>{n[x.tag]=(n[x.tag]||0)+1;if(inRg(x.q,r))a[x.tag]=(a[x.tag]||0)+1});
  const o={};Object.keys(n).forEach(t=>{o[t]=Math.round(1000*(a[t]||0)/n[t])/1000});return o}
function coaceTot(S,P,op,arg){
  asiguraBaza(S,P);
  const W=S.w,H=S.h,x=TDin(op,W,H,arg);if(!x)return -1;
  const i0=ultimT(S.desen);let L=S.desen,ps0=1;
  if(i0>=0){const id=idT(S.desen[i0]);ps0=TRANSF[id].ps||1;L=BLOCURI[id].desen.filter(s=>!esMarcaj(s)&&!esMarcajT(s)).concat(S.desen.slice(i0+1))}
  const ps=op==='redim'?Math.max(1,ps0*x.T.kmax):ps0;
  const vazInainte=op==='trunchiere'?fractii(S):null;   /* ce se vedea chiar înainte de tăiere (API, din judecata 1) */
  let geo=null;if(op==='trunchiere'){const G=geoPuncte(L,0);geo={inainte:geoFractii(G,[0,0,W,H]),dupa:geoFractii(G,arg)}}   /* judecata 2, V */
  const desen=[marcajT()].concat(ps>1.25?[marcaj(ps)]:[],coaceLista(L,x.T));
  BLOCURI.push({desen,f:{r:[0,0,x.m.w,x.m.h],p:null}});const id=BLOCURI.length-1;
  TRANSF[id]={op,inainte:[W,H],dupa:[x.m.w,x.m.h],ps};
  S.desen.push({u:'bloc|'+id,p:[[0,0]]});S.w=x.m.w;S.h=x.m.h;S.refa=[];S.modificat=true;if(S.ps)S.ps.sel=null;
  if(vazInainte)TRANSF[id].vaz={inainte:vazInainte,dupa:fractii(S)};
  if(geo)TRANSF[id].geo=geo;
  return id}

/* ---- desenele lecției (1038 × 648; cele culcate, 648 × 1038) ---- */
const F=(fel,x1,y1,x2,y2,tag)=>({u:'forma|'+fel+'|3'+(tag?'#'+tag:''),p:[[x1,y1],[x2,y2]]});
const SCENA=[F('linie',0,560,1038,560,'iarba'),F('dreptunghi',190,330,450,560,'casa'),F('triunghi',170,190,470,330,'acoperis'),
  F('dreptunghi',290,450,350,560,'usa'),F('dreptunghi',655,450,685,560,'trunchi'),F('oval',600,300,740,450,'copac'),F('oval',850,60,960,170,'soare')];
/* poza cu deget (judecata 1, M3): degetul până la x = 45, acoperișul de la x = 245, soarele de la y = 150 — locul de pornire a
   chenarului (între deget și acoperiș, deasupra soarelui) are 200 × 150 de unități: ≈ 49 × 37 px la 390 px (era 90 × 60 ≈ 22 × 15) */
const SCENA_D=[F('linie',0,560,1038,560,'iarba'),F('dreptunghi',265,330,525,560,'casa'),F('triunghi',245,190,545,330,'acoperis'),
  F('dreptunghi',365,450,425,560,'usa'),F('dreptunghi',730,450,760,560,'trunchi'),F('oval',675,300,815,450,'copac'),F('oval',880,150,990,260,'soare')];
const DEGET=SCENA_D.concat([F('oval',-100,360,45,700,'deget')]);
const DESENE={pi_scena:SCENA,pi_deget:DEGET,pi_culcat:coace(SCENA,'rots'),pi_culcat_dr:coace(SCENA,'rotd'),pi_invers:coace(SCENA,'rot180'),
  pi_oglinda:coace(SCENA,'rasto'),pi_atelier:coace(DEGET,'rots')};
Object.keys(DESENE).forEach(k=>{if(PS.DESENE&&!PS.DESENE[k])PS.DESENE[k]=DESENE[k]});

/* ---- starea mea pe S ---- */
function st(S,Q){if(!S.pi){const q=(Q&&Q.pi)||{};
  S.pi={zoom:null,zmax:0,fitPct:100,baza:{ref:null,w:S.w,h:S.h},dlg:null,evI:0,scroll:null,centru:null,focus:false,ultim:null};
  (q.marimi||[]).forEach(([cale,w,h])=>{const f=S.fs&&S.fs.f.get(cale);if(f&&!f.rev){f.w=w;f.h=h}})}
  return S.pi}
const zAcum=P=>P.zoom!=null?P.zoom:P.fitPct;
const fmtZ=z=>(Math.abs(z-Math.round(z))<.05?String(Math.round(z)):String(Math.round(z*10)/10).replace('.',','))+' %';
function setZoom(P,z){P.zoom=Math.max(ZMIN,Math.min(ZMAX,Math.round(z*10)/10));P.zmax=Math.max(P.zmax,P.zoom)}
function zoomPas(P,dir){const z=zAcum(P);const n=dir>0?PRESET.find(x=>x>z+.05):PRESET.slice().reverse().find(x=>x<z-.05);if(n!=null)setZoom(P,n)}
const slider2z=v=>ZMIN*Math.pow(ZMAX/ZMIN,v/100),z2slider=z=>Math.round(100*Math.log(z/ZMIN)/Math.log(ZMAX/ZMIN));
function centru(inst,P){const sc=inst&&inst.body.querySelector('.pi-scroll');if(sc&&sc.scrollWidth)P.centru=[(sc.scrollLeft+sc.clientWidth/2)/sc.scrollWidth,(sc.scrollTop+sc.clientHeight/2)/sc.scrollHeight]}
function zoomEv(S,P){S.ev.push({tip:'zoom',z:zAcum(P),fit:P.zoom==null})}

/* ---- Ctrl+Z nu desface deschiderea (judecata 1, M4): câte trasee avea desenul la deschidere / pornire ---- */
function baza0(S,P,minus){if(!P.n0||P.n0.ref!==S.desen)P.n0={ref:S.desen,n:Math.max(0,S.desen.length-(minus||0))};return P.n0.n}
const laBaza=(S,P)=>S.desen.length<=baza0(S,P);
const MSG_BAZA='Nu mai ai ce anula: imaginea e cum era la început. Vrei s-o iei de la capăt? Apasă <b>Ia-o de la capăt</b>, sub Paint.';
function opresteAnularea(S){if(S.ps)S.ps.sel=null;S.msg=MSG_BAZA;S.rau=false}

/* ---- operațiile cu imaginea ---- */
const NUME_OP={rotd:'Rotire la dreapta 90°',rots:'Rotire la stânga 90°',rot180:'Rotire cu 180°',rasto:'Răsturnare orizontală',rastv:'Răsturnare verticală'};
const OPROT={d:'rotd',s:'rots','180':'rot180'};
function selPartiala(S){const s=S.ps&&S.ps.sel;if(!s)return false;const r=s.r;return !!s.poli||!(r[0]<=.5&&r[1]<=.5&&r[0]+r[2]>=S.w-.5&&r[1]+r[3]>=S.h-.5)}
const MSG_SEL='Ai o bucată selectată. Paint-ul adevărat ar schimba, de obicei, doar bucata; aici schimbi doar toată imaginea. Dă un clic pe pânză, în afara selecției (sau apasă <kbd>Esc</kbd>), apoi încearcă din nou.';
function transforma(S,P,c,op,arg){
  if(!S.pornit)return false;
  if(op==='trunchiere'){const s=S.ps&&S.ps.sel;
    if(!s){c.msg('Butonul <b>Decupare</b> e gri: întâi selectezi ce vrei să păstrezi (<b>Selectare</b> › <b>Dreptunghi</b>), apoi îl apeși.',true);return false}
    const x0=Math.max(0,Math.round(s.r[0])),y0=Math.max(0,Math.round(s.r[1])),x1=Math.min(S.w,Math.round(s.r[0]+s.r[2])),y1=Math.min(S.h,Math.round(s.r[1]+s.r[3]));
    if(x1-x0<2||y1-y0<2)return false;
    /* selecția cuprinde toată pânza: n-ai ce tăia (judecata 1, sonnet M-9b — înainte spunea „Ai tăiat marginile”) */
    /* judecata 4, AE: și selecția dispare (ca după orice Decupare): un clic pe pânză n-o scotea, iar tragerea de după muta toată poza */
    if(x0<=0&&y0<=0&&x1>=S.w&&y1>=S.h){S.ps.sel=null;c.msg('Selecția cuprindea toată imaginea, deci <b>Decupare</b> n-a avut ce tăia, iar selecția a dispărut. Acum trage chenarul doar peste ce vrei să PĂSTREZI, apoi iar <b>Decupare</b>.',true);return false}
    arg=[x0,y0,x1-x0,y1-y0]}
  else if(selPartiala(S)){c.msg(MSG_SEL,true);return false}
  const W=S.w,H=S.h;
  if(coaceTot(S,P,op,arg)<0)return false;
  const m=`${S.w} × ${S.h} px`;
  /* judecata 2, X: mesajele, mai scurte */
  if(op==='trunchiere'){c.ev('trunchiat',{w:S.w,h:S.h});c.msg(`Ai tăiat marginile. Bara de stare: <b>${m}</b>. Greșit? <kbd>Ctrl</kbd>+<kbd>Z</kbd> (pe telefon, ↶).`)}
  else if(op==='redim'){c.ev('redimensionat',{w:S.w,h:S.h,w0:W,h0:H});
    c.msg(S.w*S.h<W*H?`Ai micșorat imaginea: <b>${m}</b>. A pierdut pixeli.`
      :`Ai mărit imaginea: <b>${m}</b>. Pixelii s-au întins: e mai neclară. Greșit? <kbd>Ctrl</kbd>+<kbd>Z</kbd> (pe telefon, ↶).`)}
  else if(op.startsWith('rot')){c.ev('rotit',{op});c.msg(`<b>${NUME_OP[op]}</b>. Bara de stare: <b>${m}</b>.`)}
  else {c.ev('rasturnat',{op});c.msg(`<b>${NUME_OP[op]}</b>: imaginea s-a oglindit (${op==='rasto'?'stânga a trecut în dreapta':'sus a trecut jos'}).`)}
  c.ev('desen',{u:op,puncte:0});
  P.ultim={id:S.desen.length-1,u:S.desen[S.desen.length-1].u,msg:S.msg};   /* după Ctrl+Z, mesajul transformării nu mai e adevărat: îl scot */
  return true}
function deschideRedim(S,P,c){if(!S.pornit)return;if(selPartiala(S)){c.msg(MSG_SEL,true);return}
  P.dlg={mod:'procent',lant:true,h:'100',v:'100',h0:'100',v0:'100',oh:'0°',ov:'0°',err:''};S.pop=null;S.meniu=null;P.focus='dlg';c.ev('dialog',{fel:'redimensionare'})}
/* un număr respins cu o bucată din numărul de la deschidere încă în față — judecata 1, M1 („100” + „50” = „10050”) și judecata 2, Z
   („10” + „50” = „1050”, după un singur Backspace). D.hr / D.vr = câte caractere din numărul de la deschidere au rămas, neatinse, la
   începutul casetei (urmărite la fiecare schimbare, în ascultătorul 'input' din leaga()). Paint-ul adevărat spune doar „Introduceți
   un număr valid.” (resursele); explicația de dedesubt e a lecției și spune doar ce e sigur: ce scrie în casetă și ce a rămas în față. */
const ramas=(D,k)=>D[k+'r']!=null?D[k+'r']:String(D[k+'0']||'').length;
function lipit(D,max){const ram=k=>{const x=String(D[k]==null?'':D[k]),o=String(D[k+'0']||''),r=Math.min(ramas(D,k),o.length);
    return o&&r>0&&x.length>r&&x.slice(0,r)===o.slice(0,r)?{x:x.trim(),o,r}:null};
  /* judecata 3, AB: orice casetă cu o bucată veche în față, și când numărul ei e sub limită — întâi cea al cărei număr e respins,
     apoi cealaltă (cu lanțul, „6216” la Vertical a pus 9957 la Orizontal: vina e a bucății „6”). Se cheamă doar la o respingere. */
  const bun=k=>{const n=numar(D[k]);return n>0&&n<=max};
  const k=[['h','Orizontal'],['v','Vertical']].filter(([k])=>ram(k)).sort((a,b)=>bun(a[0])-bun(b[0]))[0];if(!k)return '';const {x,o,r}=ram(k[0]);
  const ce=r>=o.length?`cifrele tale s-au adăugat după numărul vechi (${E(o)})`:`în față a rămas <b>${E(o.slice(0,r))}</b>, o bucată din numărul vechi (${E(o)})`;
  return `<div class="pi-expl">În caseta <b>${k[1]}</b> scrie <b>${E(x)}</b>: ${ce}. Apasă <kbd>Backspace</kbd> până se golește caseta, apoi scrie doar numărul tău.</div>`}
const numar=x=>{const s=String(x==null?'':x).trim().replace(',','.').replace(/\s*(%|px)$/i,'');return /^\d+(\.\d+)?$/.test(s)?+s:NaN};
function legat(D,din,S){const x=numar(din==='h'?D.h:D.v);if(!(x>0))return din==='h'?D.v:D.h;
  if(D.mod==='procent')return String(Math.round(x*100)/100);
  return din==='h'?String(Math.max(1,Math.round(x*S.h/S.w))):String(Math.max(1,Math.round(x*S.w/S.h)))}
function okRedim(S,P,c){const D=P.dlg;if(!D)return;
  const h=numar(D.h),v=numar(D.v),oh=String(D.oh).replace(/[°º\s]/g,''),ov=String(D.ov).replace(/[°º\s]/g,'');
  const max=D.mod==='procent'?500:8000;
  if(!(h>0)||!(v>0)||h>max||v>max){D.err='Introduceți un număr valid.'+lipit(D,max);return}
  if((oh&&+oh!==0)||(ov&&+ov!==0)){D.err='<b>Oblic</b> (înclinarea) n-o folosim azi: lasă 0°.';return}
  const w2=D.mod==='procent'?Math.max(1,Math.round(S.w*h/100)):Math.round(h),h2=D.mod==='procent'?Math.max(1,Math.round(S.h*v/100)):Math.round(v);
  P.dlg=null;P.focus=true;
  if(w2===S.w&&h2===S.h){c.msg(`Mărimea a rămas aceeași: <b>${S.w} × ${S.h} px</b>.`);return}
  transforma(S,P,c,'redim',[w2,h2])}

/* ---- testele ---- */
function obiecte(S){const i=ultimT(S.desen),L=scena(i>=0?S.desen.slice(i):S.desen);
  return L.map(I=>{const pts=I.pts.filter((q,j)=>I.vis[j]&&q[0]>=-.5&&q[0]<=S.w+.5&&q[1]>=-.5&&q[1]<=S.h+.5);return {tag:I.tag,pts,frac:pts.length/(I.n0||I.pts.length||1)}})}
/* un traseu cu eticheta asta e în desen (și în blocurile lipite / coapte din el)? */
function areTag(L,tag,ad){if((ad||0)>30)return false;return (L||[]).some(s=>{const o=parse(s.u);if(o.tag===tag)return true;
  return (o.t==='bloc'||o.t==='muta')&&BLOCURI[o.id]?areTag(BLOCURI[o.id].desen,tag,(ad||0)+1):false})}
/* cât se vede din fiecare etichetă (cea mai mare fracție), pentru TRANSF[id].vaz */
function fractii(S){const o={};obiecte(S).forEach(I=>{if(I.tag)o[I.tag]=Math.max(o[I.tag]||0,I.frac)});return o}
function cutie(L,tag){const pts=[].concat(...L.filter(I=>I.tag===tag&&I.frac>=.5).map(I=>I.pts));if(!pts.length)return null;
  const xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]),x0=Math.min(...xs),y0=Math.min(...ys),x1=Math.max(...xs),y1=Math.max(...ys);return {x0,y0,x1,y1,cx:(x0+x1)/2,cy:(y0+y1)/2,w:x1-x0,h:y1-y0}}
/* ---- judecata 3, AA: testul trunchierii judecă NUMAI starea finală a pânzei (vezi capul fișierului, „taiere”) ---- */
const NUME_O={casa:['casă','Casa','întreagă','ei'],acoperis:['acoperiș','Acoperișul','întreg','lui'],copac:['copac','Copacul','întreg','lui'],
  soare:['soare','Soarele','întreg','lui'],usa:['ușă','Ușa','întreagă','ei'],trunchi:['trunchi','Trunchiul','întreg','lui'],iarba:['iarbă','Iarba','întreagă','ei']};
const MODEL={};
const cadru=P=>{if(!P||!P.length)return null;let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
  P.forEach(q=>{if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1]});return [x0,y0,x1,y1]};
const mediana=a=>{const b=a.slice().sort((x,y)=>x-y),n=b.length;return n?(n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2):NaN};
/* distanța de la un punct la conturul unei etichete din model (lista segmentelor lui) */
function dSeg(q,L){let m=Infinity;for(let i=0;i<L.length;i++){const a=L[i][0],b=L[i][1],vx=b[0]-a[0],vy=b[1]-a[1],l2=vx*vx+vy*vy;
  let u=l2?((q[0]-a[0])*vx+(q[1]-a[1])*vy)/l2:0;u=u<0?0:u>1?1:u;const dx=q[0]-a[0]-u*vx,dy=q[1]-a[1]-u*vy,d=dx*dx+dy*dy;if(d<m)m=d}return Math.sqrt(m)}
/* modelul (poza de la început, dreaptă): punctele fiecărei etichete pe pânza lui, cadrul lor, câte puncte are tot conturul și
   (judecata 4) segmentele conturului: „la locul lui” și „în plus” se măsoară față de contur, nu în procente */
function modelGeo(id,mw,mh){const key=id+'|'+mw+'|'+mh;if(MODEL[key])return MODEL[key];const d=PS.DESENE[id];if(!d)return null;
  const inC=q=>q[0]>=-.5&&q[0]<=mw+.5&&q[1]>=-.5&&q[1]<=mh+.5,o={w:mw,h:mh,pts:{},bb:{},n0:{},seg:{}};
  scena(d).forEach(I=>{if(!I.tag)return;(o.pts[I.tag]=o.pts[I.tag]||[]).push(...I.pts.filter((q,j)=>I.vis[j]&&inC(q)));o.n0[I.tag]=(o.n0[I.tag]||0)+(I.n0||I.pts.length)});
  d.forEach(s=>{const x=parse(s.u);if(!x.tag||x.t==='alb'||x.t==='radiera'||x.t==='bloc'||x.t==='muta'||!s.p||!s.p.length)return;
    const k=x.t==='forma'?contur(x.fel,s.p):{inchis:false,pts:s.p},P=k.inchis?k.pts.concat([k.pts[0]]):k.pts,Lg=o.seg[x.tag]=o.seg[x.tag]||[];
    if(P.length===1)Lg.push([P[0],P[0]]);for(let i=1;i<P.length;i++)Lg.push([P[i-1],P[i]])});
  Object.keys(o.pts).forEach(t=>{o.bb[t]=cadru(o.pts[t])});return MODEL[key]=o}
/* unde e o pată de puncte pe pânză, cu treimi, ca un om care se uită: sus / jos, în stânga / la mijloc / în dreapta */
function locTreimi(P,W,H){const b=cadru(P),cx=(b[0]+b[2])/2/W,cy=(b[1]+b[3])/2/H;
  const oriz=cx<.34?'în stânga':cx>.66?'în dreapta':'la mijloc',vert=cy<.34?'sus':cy>.66?'jos':'';
  return vert?`${vert}, ${oriz}`:oriz==='la mijloc'?'în mijlocul pozei':oriz}
const LIPIT=5;   /* judecata 4, AD: conturul e eșantionat din 4 în 4 unități — o latură la ≤ 5 unități de marginea pânzei poate fi tăiată */
function judecaTaiere(S,t){
  const mw=t.mw||1038,mh=t.mh||648,M=modelGeo(t.model||'pi_deget',mw,mh),scoate=t.scoate||'deget',pastreaza=t.pastreaza||['casa','acoperis','copac','soare'];
  const ok={},msg={};if(!M){ok.deget=ok.intregi=ok.marime=false;return {ok,msg}}
  const W=S.w,H=S.h,i=ultimT(S.desen),L=scena(i>=0?S.desen.slice(i):S.desen),inC=q=>q[0]>=-.5&&q[0]<=W+.5&&q[1]>=-.5&&q[1]<=H+.5;
  const vazut=I=>I.pts.filter((q,j)=>I.vis[j]&&inC(q)),cel=tag=>{let b=null,bf=-1;L.forEach(I=>{if(I.tag!==tag)return;const v=vazut(I),f=v.length/(I.n0||I.pts.length||1);if(f>bf){bf=f;b={v,f}}});return b||{v:[],f:0}};
  /* tot ce se vede acum pe pânză, pe etichete ('' = desenat de elev, fără etichetă) */
  const V={};L.forEach(I=>{const v=vazut(I);if(v.length){const g=I.tag||'';(V[g]=V[g]||[]).push(...v)}});
  /* cadrul: din obiectele mari (nu linia ierbii, nu degetul) care se văd întregi — aceeași scară pe orizontală și pe verticală */
  const mari=Object.keys(M.bb).filter(g=>g!==scoate&&M.bb[g]&&M.bb[g][2]-M.bb[g][0]>=20&&M.bb[g][3]-M.bb[g][1]>=20);
  const intregi={};mari.concat(pastreaza.filter(g=>!mari.includes(g))).forEach(g=>{const c=cel(g);intregi[g]=c.f>=.9?cadru(c.v):null});
  const cand=mari.filter(g=>intregi[g]);let F=null,potriv={};
  /* o latură lipită de marginea pânzei (≤ 5 unități) poate fi tăiată: nu se compară și nu dă scara */
  const lat=b=>[b[0]>LIPIT,b[1]>LIPIT,b[2]<W-LIPIT,b[3]<H-LIPIT];
  const mk=(sx,sy,ox,oy)=>({sx,sy,s:(sx+sy)/2,ox,oy,win:[-ox/sx,-oy/sy,W/sx,H/sy]});
  const dreapta=(sx,sy)=>isFinite(sx)&&isFinite(sy)&&sx>0&&sy>0&&Math.abs(sx/sy-1)<=.03&&(!!t.fereastra||(Math.abs(sx-1)<=.03&&Math.abs(sy-1)<=.03));
  const potrivDin=Fr=>{const o={},e=2+4*Fr.s;cand.forEach(g=>{const b=intregi[g],m=M.bb[g],l=lat(b),x=[Fr.sx*m[0]+Fr.ox,Fr.sy*m[1]+Fr.oy,Fr.sx*m[2]+Fr.ox,Fr.sy*m[3]+Fr.oy];
    o[g]=[0,1,2,3].every(k=>!l[k]||Math.abs(b[k]-x[k])<=e)});return o};
  if(cand.length){const rx=[],ry=[];
    cand.forEach(g=>{const b=intregi[g],m=M.bb[g],l=lat(b);if(l[0]&&l[2]&&m[2]>m[0])rx.push((b[2]-b[0])/(m[2]-m[0]));if(l[1]&&l[3]&&m[3]>m[1])ry.push((b[3]-b[1])/(m[3]-m[1]))});
    let sx=mediana(rx),sy=mediana(ry);if(!isFinite(sx))sx=sy;if(!isFinite(sy))sy=sx;if(!isFinite(sx)&&!t.fereastra)sx=sy=1;
    const ox=mediana([].concat(...cand.map(g=>{const b=intregi[g],m=M.bb[g],l=lat(b);return [l[0]?b[0]-sx*m[0]:null,l[2]?b[2]-sx*m[2]:null].filter(v=>v!=null)}))),
      oy=mediana([].concat(...cand.map(g=>{const b=intregi[g],m=M.bb[g],l=lat(b);return [l[1]?b[1]-sy*m[1]:null,l[3]?b[3]-sy*m[3]:null].filter(v=>v!=null)})));
    if(dreapta(sx,sy)&&isFinite(ox)&&isFinite(oy)){const Fr=mk(sx,sy,ox,oy);potriv=potrivDin(Fr);if(cand.every(g=>potriv[g]))F=Fr}}
  /* judecata 4, AD: dacă nu s-a găsit (o latură ștearsă, un obiect mutat), caut o poziție DREAPTĂ — nerotită, nerăsturnată, cu aceeași
     scară pe ambele direcții — în care cel puțin 90 % din conturul văzut al obiectelor mari stă pe conturul modelului */
  const dPlus=s=>1+3*s;   /* mai departe de atât de conturul modelului (la scara de acum), un punct e „în plus” (conturul are 3 px) */
  const pePotr=(Fr,v,g)=>dSeg([(v[0]-Fr.ox)/Fr.sx,(v[1]-Fr.oy)/Fr.sy],M.seg[g])*Fr.s<=dPlus(Fr.s);
  if(!F&&cand.length){const sc=[];
    if(!t.fereastra)sc.push(1);
    else cand.forEach(g=>{const b=intregi[g],m=M.bb[g];if(lat(b).every(Boolean)&&m[2]>m[0]&&m[3]>m[1]){const a=(b[2]-b[0])/(m[2]-m[0]),c=(b[3]-b[1])/(m[3]-m[1]);if(Math.abs(a/c-1)<=.03&&!sc.some(x=>Math.abs(x-(a+c)/2)<.005))sc.push((a+c)/2)}});
    const P=[];mari.forEach(g=>{if(M.seg[g])(V[g]||[]).forEach((v,k)=>{if(k%2===0)P.push([g,v])})});
    let best=null;
    if(P.length>=12)sc.forEach(s=>{const OX=[],OY=[],pune=(A,v)=>{if(isFinite(v)&&A.length<14&&!A.some(x=>Math.abs(x-v)<1))A.push(v)};
      mari.forEach(g=>{const c=cel(g);if(!c.v.length)return;const b=cadru(c.v),m=M.bb[g],l=lat(b);
        if(l[0])pune(OX,b[0]-s*m[0]);if(l[2])pune(OX,b[2]-s*m[2]);if(l[1])pune(OY,b[1]-s*m[1]);if(l[3])pune(OY,b[3]-s*m[3])});
      OX.forEach(ox=>OY.forEach(oy=>{const Fr=mk(s,s,ox,oy);let k=0;P.forEach(([g,v])=>{if(pePotr(Fr,v,g))k++});const sco=k/P.length;if(!best||sco>best.sco)best={Fr,sco}}))});
    if(best&&best.sco>=.9){F=best.Fr;potriv=potrivDin(F)}}
  const nCadru=F?cand.filter(g=>potriv[g]).length:cand.length;
  const tot=F&&F.win[2]>=mw-2&&F.win[3]>=mh-2;   /* pânza arată toată poza: nimic tăiat */
  const inapoi=q=>F?[F.sx*q[0]+F.ox,F.sy*q[1]+F.oy]:q;
  /* (2) degetul: câte puncte din el (din toate copiile) se văd acum pe pânză */
  const vd=[].concat(...L.filter(I=>I.tag===scoate).map(vazut)),n0d=M.n0[scoate]||1;
  ok.deget=vd.length<=(t.max!=null?t.max:.02)*n0d;
  if(!ok.deget){const loc=locTreimi(vd,W,H);
    const ref=F?(M.pts[scoate]||[]).map(inapoi):[],d=F?2+4*F.s:0;
    const laLoc=F&&vd.filter(q=>ref.some(r=>Math.abs(r[0]-q[0])<=d&&Math.abs(r[1]-q[1])<=d)).length>=.8*vd.length;
    msg.deget=!F?`Degetul se vede încă, ${loc}. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt; apoi taie marginea din locul gol dintre deget și acoperiș.`
      :!laLoc?`Degetul se vede încă, ${loc}, dar nu la locul lui: l-ai mutat sau lipit acolo. Ctrl+Z (pe telefon, ↶) până se vede doar în stânga, la locul lui, sau Ia-o de la capăt; apoi taie marginea din locul gol dintre deget și acoperiș.`
      :tot?`Degetul se vede încă, ${loc}. Selectare › Dreptunghi din locul gol dintre deget și acoperiș (pe alb, mai sus decât soarele) până în colțul din dreapta-jos, apoi Imagine › Decupare.`
      :`Degetul se vede încă, ${loc}: chenarul l-a cuprins și pe el. Ctrl+Z (pe telefon, ↶), apoi pornește chenarul mai la dreapta, în locul gol dintre deget și acoperiș.`}
  /* (3) restul pozei — judecata 4, AC + AF: în cadrul găsit, FIECARE punct al conturului modelului (casa, acoperișul, copacul, soarele,
     plus ușa și trunchiul) stă pe pânză cu tot conturul lui (jumătate din grosime, 1,5 unități la scara 1) și se vede (un punct văzut al
     aceleiași etichete la cel mult ~3 px); nimic nu se vede în plus: o copie lipită, o bucată mutată, un desen fără etichetă */
  const verif=pastreaza.length?pastreaza.concat(['usa','trunchi'].filter(g=>M.pts[g]&&!pastreaza.includes(g))):[];
  const taiate=[],lipsa=[],plus=[],dir=new Set();let mazgalit=null;
  if(F){const hs=Math.max(1,Math.round(3*F.s))/2,ep=Math.abs(F.s-1)<=.03?.05:.5,dM=2.5+.5*F.s,d2=dM*dM;
    verif.forEach(g=>{const P=(M.pts[g]||[]).map(inapoi);if(!P.length)return;let afara=false;
      P.forEach(q=>{if(q[0]-hs<-ep){afara=true;dir.add('spre stânga')}if(q[0]+hs>W+ep){afara=true;dir.add('spre dreapta')}
        if(q[1]-hs<-ep){afara=true;dir.add('spre sus')}if(q[1]+hs>H+ep){afara=true;dir.add('în jos')}});
      if(afara){taiate.push(g);return}
      const v=V[g]||[];if(P.some(q=>!v.some(x=>(x[0]-q[0])*(x[0]-q[0])+(x[1]-q[1])*(x[1]-q[1])<=d2)))lipsa.push(g)});
    Object.keys(V).forEach(g=>{if(g===scoate)return;const v=V[g];
      if(!g){if(v.length>=3)mazgalit=v;return}
      if(!M.seg[g]){plus.push([g,v]);return}
      const x=v.filter(q=>!pePotr(F,q,g));if(x.length)plus.push([g,x])})}
  ok.intregi=!!F&&!taiate.length&&!lipsa.length&&!plus.length&&!mazgalit&&pastreaza.every(g=>M.pts[g]);
  if(!ok.intregi){const nume=g=>(NUME_O[g]||[g])[0];
    if(!cand.length)msg.intregi='Casa, copacul și soarele nu se mai văd întregi. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt; chenarul tăierii trebuie să le cuprindă pe toate.';
    else if(!F)msg.intregi='Poza nu mai e ca la început: ai rotit-o, ai răsturnat-o, ai redimensionat-o sau ai mutat ori ai lipit ceva în ea. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt.';
    else if(taiate.length){const n=taiate.filter(g=>pastreaza.includes(g)),ord=['spre sus','spre stânga','spre dreapta','în jos'].filter(x=>dir.has(x));
      msg.intregi=`Ai tăiat și din ${(n.length?n:taiate).map(nume).join(' și din ')}. Ctrl+Z (pe telefon, ↶) până apare la loc ce ai tăiat (sau Ia-o de la capăt), apoi trage chenarul din nou, mai mare ${ord.join(' și ')||'spre margini'}: casa, copacul și soarele trebuie să fie întregi în el.`}
    else if(plus.length){const [g,x]=plus[0],n=NUME_O[g]||[g,g];
      msg.intregi=`${n[1]} se vede și ${locTreimi(x,W,H)}, unde n-ar trebui: acolo e o copie lipită sau o bucată mutată. Ctrl+Z (pe telefon, ↶) până dispare de acolo, sau Ia-o de la capăt; apoi taie marginea din locul gol dintre deget și acoperiș.`}
    else if(lipsa.length){const g=lipsa.find(x=>pastreaza.includes(x))||lipsa[0],n=NUME_O[g]||[g,g,'întreg','lui'];
      msg.intregi=`${n[1]} nu mai e ${n[2]} la locul ${n[3]}. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt.`}
    else if(mazgalit)msg.intregi=`Pe poză e ceva desenat în plus, ${locTreimi(mazgalit,W,H)}. Ctrl+Z (pe telefon, ↶) până dispare, sau Ia-o de la capăt; apoi taie marginea din locul gol dintre deget și acoperiș.`;
    else msg.intregi='Casa, copacul și soarele nu se mai văd întregi. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt.'}
  /* (1) mărimea: a pânzei (sau, cu fereastra, a bucății din model pe care o arată pânza) */
  const ww=t.fereastra?(F?F.win[2]:NaN):W,hh=t.fereastra?(F?F.win[3]:NaN):H,wr=t.w||[1,mw],hr=t.h||[1,mh];
  ok.marime=ww>=wr[0]-.5&&ww<=wr[1]+.5&&hh>=hr[0]-.5&&hh<=hr[1]+.5;
  if(!ok.marime){const fx=(M.bb[scoate]||[0,0,0,0])[2];
    msg.marime=!F?'Poza nu mai e ca la început. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt.'
      :tot?`N-ai tăiat marginile: pânza are ${W} × ${H} px, cât toată poza. (Editare › Decupare doar scoate bucata.) Selectare › Dreptunghi din stânga-sus, mai aproape de acoperiș decât de marginea din stânga, până în colțul din dreapta-jos, apoi Imagine › Decupare.`
      :ww>wr[1]+.5?(F.win[0]<fx+1.5?'Pânza e încă prea lată: în stânga a rămas locul degetului. Ctrl+Z (pe telefon, ↶), apoi pornește chenarul mai la dreapta, mai aproape de acoperiș decât de marginea din stânga.'
        :'Pânza e încă prea lată. Ctrl+Z (pe telefon, ↶) și taie mai mult din margini, fără să tai din casă, copac sau soare.')
      :ww<wr[0]-.5||hh<hr[0]-.5?'Pânza e prea mică: ai tăiat prea mult. Ctrl+Z (pe telefon, ↶); chenarul trebuie să cuprindă casa, copacul și soarele.'
      :'Pânza e prea mare. Ctrl+Z (pe telefon, ↶) de câte ori trebuie, sau Ia-o de la capăt.'}
  return {ok,msg,cadru:F,nCadru}}
/* judecata 4, AG: pânza mărită nu încape în zona ei (zoomul peste „Potrivire la fereastră”) — pe telefon, o tragere cu un deget face
   chenar, nu plimbă pânza, iar colțul îndepărtat nu se poate atinge: mesajul spune întâi ieșirea. Cu ORICE zoom ales (nu doar când
   pânza de acum nu încape): după o tăiere făcută doar pe bucata văzută, pânza mică încape, dar după Ctrl+Z (cerut de mesaj) nu mai încape */
const MSG_ZOOM='(Întâi Potrivire la fereastră: butonul din stânga procentului zoomului, în bara de stare.) ',
  MSG_ZOOM_NU='(Întâi Potrivire la fereastră: butonul din stânga procentului zoomului, în bara de stare. Acum pânza nu încape toată pe ecran.) ';
function nuIncape(c){const P=c.S.pi,inst=INST.get(c.Q),sc=inst&&inst.body.querySelector('.pi-scroll');
  return !!(P&&P.zoom!=null&&sc&&(sc.scrollWidth>sc.clientWidth+2||sc.scrollHeight>sc.clientHeight+2))}
const prefixZoom=c=>c.S.pi&&c.S.pi.zoom!=null?(nuIncape(c)?MSG_ZOOM_NU:MSG_ZOOM):'';
function verifica(t,c){const S=c.S,P=st(S,c.Q);
  const lang=(a,b,tol)=>Math.abs(a-b)<=(tol!=null?tol:1);
  switch(t.k){
    case 'marime':return S.pornit&&(t.w==null||lang(S.w,t.w,t.tol))&&(t.h==null||lang(S.h,t.h,t.tol));
    case 'pozitie':{if(!S.pornit)return false;const L=obiecte(S);let lipsa=false;
      const bun=(t.c||[]).every(([a,rel,b])=>{const A=cutie(L,a),B=cutie(L,b);if(!A||!B){lipsa=true;return true}
        const m=.15*Math.min(rel==='sus'||rel==='jos'?A.h+B.h:A.w+B.w);
        return rel==='sus'?A.cy+m<B.cy:rel==='jos'?A.cy>B.cy+m:rel==='stanga'?A.cx+m<B.cx:rel==='dreapta'?A.cx>B.cx+m:false});
      if(!bun||!lipsa)return bun;
      /* judecata 3: un obiect al unei relații lipsește (l-a tăiat chenarul) — fără model, nu se poate spune că poza stă dreaptă; cu
         model, stă dreaptă dacă cel puțin două obiecte întregi sunt la locul lor față de model, în același cadru (altfel mesajul „rotește”
         ar fi fals pentru o poză dreaptă, tăiată prea mult) */
      if(!t.model)return false;const r=judecaTaiere(S,{model:t.model,mw:t.mw,mh:t.mh,fereastra:true,pastreaza:[]});return !!r.cadru&&r.nCadru>=2}
    case 'intreg':return S.pornit&&obiecte(S).some(I=>I.tag===t.tag&&I.frac>=.9);
    case 'taiat':{if(!S.pornit)return false;const max=t.max!=null?t.max:.02,L=obiecte(S).filter(I=>I.tag===t.tag);
      /* judecata 1, M4: obiectul trebuie să fie în desen (nu trece când lipsește cu totul, de pildă scos cu Ctrl+Z);
         judecata 2, V: cu prin:'trunchiere', o Decupare l-a lăsat în AFARA pânzei — geometric (TRANSF[id].geo): era pe pânză, iar
         dreptunghiul păstrat nu-l mai cuprinde, oricine l-ar fi acoperit înainte (Ctrl+X / Delete pe deget, apoi tăierea bună = trece) */
      if(!L.every(I=>I.frac<=max))return false;
      {const i=ultimT(S.desen);if(!areTag(i>=0?S.desen.slice(i):S.desen,t.tag))return false}   /* scena() nu mai întoarce obiectul tăiat de tot: caut traseul */
      if(!t.prin)return true;
      return transformari(S).some(x=>x.op===t.prin&&x.geo&&(x.geo.inainte[t.tag]||0)>max&&(x.geo.dupa[t.tag]||0)<=max)}
    case 'transformat':return S.pornit&&transformari(S).some(x=>!t.op||x.op===t.op);
    case 'redim':{if(!S.pornit)return false;const R=transformari(S).filter(x=>x.op==='redim').pop();if(!R)return false;
      if(t.w!=null&&!lang(S.w,t.w,t.tol))return false;if(t.h!=null&&!lang(S.h,t.h,t.tol))return false;
      return !t.pastrat||Math.abs(R.dupa[0]/R.dupa[1]-R.inainte[0]/R.inainte[1])<=.02*R.inainte[0]/R.inainte[1]}
    case 'zoom':return S.pornit&&(t.min==null||P.zmax>=t.min-.05)&&(t.acum==null||(P.zoom!=null&&Math.abs(P.zoom-t.acum)<.5));
    /* judecata 3, AA: starea finală; mesajul de respingere (t.msg, citit de paint.js după test) e scris din starea de acum */
    case 'taiere':{if(!S.pornit)return false;const r=judecaTaiere(S,t),p=t.parte||'deget';if(!r.ok[p]&&r.msg[p])t.msg=prefixZoom(c)+r.msg[p];return !!r.ok[p]}
  }
  return null}

/* ---- operațiile pentru soluții (Arată-mi, poarta) ---- */
function op(o,c){const S=c.S,P=st(S,c.Q),[k,a,b,d]=o;
  switch(k){
    case 'rot':transforma(S,P,c,OPROT[a]||'rotd');return true;
    case 'rast':transforma(S,P,c,a==='v'?'rastv':'rasto');return true;
    case 'trunchiaza':transforma(S,P,c,'trunchiere');return true;
    case 'redim':if(selPartiala(S))return true;P.dlg={mod:a==='pixeli'?'pixeli':'procent',lant:false,h:String(b),v:String(d),oh:'0',ov:'0',err:''};okRedim(S,P,c);P.dlg=null;return true;
    case 'zoom':if(a==='fit')P.zoom=null;else setZoom(P,+a);zoomEv(S,P);return true;
  }
  return false}

/* ---- desenul: grupul Imagine, meniurile, fereastra, bara de stare, zoomul ---- */
const CHEV='<svg class="ch" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5l4 4 4-4" fill="none" stroke="#333" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const I=(d,w)=>`<svg viewBox="0 0 24 24" width="${w||20}" height="${w||20}" aria-hidden="true">${d}</svg>`;
const SVG={
  crop:I('<path d="M7 2v15h15" fill="none" stroke="#333" stroke-width="1.7"/><path d="M2 7h15v15" fill="none" stroke="#333" stroke-width="1.7"/>'),
  fundal:I('<rect x="3" y="3" width="18" height="18" fill="none" stroke="#888" stroke-width="1.2" stroke-dasharray="2 2"/><circle cx="12" cy="10" r="3" fill="#0b62c4"/><path d="M6 20c1-4 11-4 12 0" fill="#0b62c4"/>'),
  rot:I('<path d="M4 20h15L4 10z" fill="#0b62c4"/><path d="M9 6.5a7 7 0 0 1 10 3" fill="none" stroke="#333" stroke-width="1.5"/><path d="M19.5 4.5v5h-5" fill="none" stroke="#333" stroke-width="1.5"/>'),
  rast:I('<path d="M11 4v16H3z" fill="#0b62c4"/><path d="M13 4v16h8z" fill="none" stroke="#0b62c4" stroke-width="1.4"/><path d="M12 1v22" stroke="#333" stroke-width="1" stroke-dasharray="2 2"/>'),
  redim:I('<rect x="3" y="6" width="15" height="15" fill="none" stroke="#0b62c4" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M7 17l3-4 2 2 2-3 3 5z" fill="#0b62c4"/><path d="M14 2h8v8M22 2l-7 7" fill="none" stroke="#333" stroke-width="1.5"/>',24),
  rotd:I('<path d="M5 19h12L5 9z" fill="#0b62c4"/><path d="M9 6a7 7 0 0 1 10 3" fill="none" stroke="#333" stroke-width="1.5"/><path d="M19.5 4v5h-5" fill="none" stroke="#333" stroke-width="1.5"/>'),
  rots:I('<path d="M19 19H7l12-10z" fill="#0b62c4"/><path d="M15 6a7 7 0 0 0-10 3" fill="none" stroke="#333" stroke-width="1.5"/><path d="M4.5 4v5h5" fill="none" stroke="#333" stroke-width="1.5"/>'),
  rot180:I('<path d="M4 5h12L4 15z" fill="#0b62c4"/><path d="M20 9v8a3 3 0 0 1-3 3h-7" fill="none" stroke="#333" stroke-width="1.5"/><path d="M13 23l-3-3 3-3" fill="none" stroke="#333" stroke-width="1.5"/>'),
  pers:I('<circle cx="12" cy="12" r="8" fill="none" stroke="#333" stroke-width="1.5"/><path d="M12 12l5-5" stroke="#0b62c4" stroke-width="2"/>'),
  rastv:I('<path d="M4 11h16L4 3z" fill="#0b62c4"/><path d="M4 13h16L4 21z" fill="none" stroke="#0b62c4" stroke-width="1.4"/><path d="M1 12h22" stroke="#333" stroke-dasharray="2 2"/>'),
  rasto:I('<path d="M11 4v16H3z" fill="#0b62c4"/><path d="M13 4v16h8z" fill="none" stroke="#0b62c4" stroke-width="1.4"/><path d="M12 1v22" stroke="#333" stroke-dasharray="2 2"/>'),
  fit:I('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="#333" stroke-width="1.6"/>',18),
  zm:I('<circle cx="10" cy="10" r="6" fill="none" stroke="#333" stroke-width="1.6"/><path d="M14.5 14.5L20 20" stroke="#333" stroke-width="1.8"/><path d="M7 10h6" stroke="#333" stroke-width="1.6"/>',18),
  zp:I('<circle cx="10" cy="10" r="6" fill="none" stroke="#333" stroke-width="1.6"/><path d="M14.5 14.5L20 20" stroke="#333" stroke-width="1.8"/><path d="M7 10h6M10 7v6" stroke="#333" stroke-width="1.6"/>',18),
  lant:I('<path d="M10 14a3.5 3.5 0 0 1 0-5l2.5-2.5a3.5 3.5 0 0 1 5 5L16 13" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 10a3.5 3.5 0 0 1 0 5l-2.5 2.5a3.5 3.5 0 0 1-5-5L8 11" fill="none" stroke="currentColor" stroke-width="1.8"/>',18)
};
const FILTRE=NIV.map((ps,i)=>i?`<filter id="pi-b${i}" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${(.42*ps).toFixed(2)}"/></filter>`:'').join('');
const CSS_BLUR=NIV.map((ps,i)=>i?`g[clip-path]:has(> rect[x="-9"][y="-9"][width="1"][height="${i}"]){filter:url(#pi-b${i})}`:'').filter(Boolean).join('\n');
const CSS_ACOPERIT=':has(~ g > g[clip-path] > rect[x="-7"][y="-7"][width="1"][height="1"]){display:none}';
const CSS=`
.pi-gi{display:grid;grid-template-columns:32px 46px 46px;grid-template-rows:32px 32px;gap:2px;align-items:center}
.pi-gi .pt-t{width:100%;min-width:32px}
.pi-gi .pi-big{grid-row:span 2;height:66px}
.pi-gri svg{opacity:.32}
.pi-dd{display:flex;align-items:center;justify-content:center;gap:0}
.pi-dd .ch{width:11px;height:11px}
.pi-pop .ps-it svg{flex:none}
.pi-pop .pi-gi{margin:2px}
.pi-dlg.pt-dlg{max-width:340px;padding:14px 16px 12px;box-sizing:border-box;margin-top:8px}
.pi-dlg h4{margin:0 0 10px;font-family:"Segoe UI",system-ui,sans-serif;font-size:17px;font-weight:600}
.pi-dlg .sect{font-size:13px;font-weight:600;margin:8px 0 4px}
.pi-rad{display:flex;gap:14px;flex-wrap:wrap}
.pi-rad button{display:flex;align-items:center;gap:7px;border:0;background:transparent;font:inherit;font-size:13px;color:#1a1a1a;min-height:32px;padding:0 4px;cursor:pointer;border-radius:4px}
.pi-rad button .o{width:16px;height:16px;border-radius:50%;border:1.5px solid #6b6b6b;box-sizing:border-box;display:inline-block}
.pi-rad button[aria-checked="true"] .o{border:5px solid #0067c0}
.pi-row{display:grid;grid-template-columns:1fr 38px 1fr;gap:8px;align-items:end}
.pi-row.oblic{grid-template-columns:1fr 1fr}
.pi-row label{display:flex;flex-direction:column;gap:3px;font-size:12.5px}
.pi-row input{font:inherit;font-size:14px;min-height:32px;border:1px solid #8a8a8a;border-bottom-width:2px;border-radius:4px;padding:3px 8px;width:100%;box-sizing:border-box;background:#fff;color:#1a1a1a;min-width:0}
.pi-lant{width:38px;height:32px;border:1px solid #c4c4c4;border-radius:4px;background:#fdfdfd;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.pi-lant[aria-pressed="true"]{background:#0067c0;border-color:#0067c0;color:#fff}
.pi-dlg .pt-err{margin:8px 0 0}
.pi-dlg .pi-expl{margin-top:5px;font-size:12.5px;line-height:1.35;color:#1a1a1a;font-weight:400}
.pi-dlg .pt-bt{padding:14px 0 0;justify-content:stretch}.pi-dlg .pt-bt button{flex:1}
.pt-sb .pi-zc{display:inline-flex;align-items:center;border:1px solid #cfcfcf;border-radius:4px;background:#fff}
.pt-sb .pi-zin{width:58px;border:0;font:inherit;font-size:11.5px;text-align:center;min-height:32px;background:transparent;color:#1a1a1a;padding:0 2px;box-sizing:border-box}
.pt-sb .pi-zc button{min-width:32px}
.pt-sb .pi-zs{width:96px;height:32px;margin:0 2px;accent-color:#0067c0;cursor:pointer}
.pt-sb .z{flex-wrap:nowrap}
.pi-zl{max-height:260px;overflow-y:auto}
.pi-scroll{position:relative;max-width:100%;min-width:0;flex:0 1 auto;overflow:auto;overscroll-behavior:contain}
.pi-scroll.pi-z{max-height:min(62vh,520px);box-shadow:inset 0 0 0 1px #d6d6d6;background:#e8e8e8}
.pi-scroll .pt-svg{max-width:none}
.pi-px{position:absolute;pointer-events:none;image-rendering:pixelated;image-rendering:crisp-edges}
.pi-model{margin-top:8px}
.pi-model svg{display:block;max-width:100%;height:auto;background:#fff;border:1px solid var(--line);border-radius:6px}
@media (max-width:520px){.pt-sb .pi-zs{width:64px}.pi-dlg.pt-dlg{padding:12px}}
.pt-svg ${CSS_BLUR.split('\n').join('\n.pt-svg ')}
.pt-svg > ${CSS_ACOPERIT}
.pt-svg g[clip-path] > ${CSS_ACOPERIT}
`;
let cssPus=false;
function css(){if(cssPus)return;cssPus=true;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s);
  const d=document.createElement('div');d.setAttribute('aria-hidden','true');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML=`<svg width="0" height="0" focusable="false"><defs>${FILTRE}</defs></svg>`;document.body.appendChild(d)}

function pozPop(win,el,lat){const W=win.clientWidth||600,wr=win.getBoundingClientRect(),tl=win.querySelector('.pt-tools');
  const t=tl?Math.round(tl.getBoundingClientRect().bottom-wr.top-win.clientTop):150;
  let x=el?Math.round(el.getBoundingClientRect().left-wr.left-win.clientLeft):6;x=Math.max(4,Math.min(x,W-(lat||230)-6));return `left:${x}px;top:${t}px`}
function butoaneImagine(S){const sel=!!(S.ps&&S.ps.sel),pr=v=>S.pop===v;
  return `<div class="pi-gi" role="group" aria-label="Imagine">
    <button type="button" class="pt-t${sel?'':' pi-gri'}" data-act="pi:crop" aria-label="Decupare" title="Decupare: tai marginile, rămâne doar selecția"${sel?'':' aria-disabled="true"'}>${SVG.crop}</button>
    <button type="button" class="pt-t pi-dd${pr('pi-rot')?' on':''}" data-act="pi:pop" data-v="pi-rot" aria-label="Rotiți" title="Rotiți" aria-haspopup="menu" aria-expanded="${pr('pi-rot')}">${SVG.rot}${CHEV}</button>
    <button type="button" class="pt-t pi-big" data-act="pi:redim" aria-label="Redimensionați și înclinați" title="Redimensionați și înclinați">${SVG.redim}</button>
    <button type="button" class="pt-t" data-act="pi:fundal" aria-label="Eliminați fundalul" title="Eliminați fundalul">${SVG.fundal}</button>
    <button type="button" class="pt-t pi-dd${pr('pi-rast')?' on':''}" data-act="pi:pop" data-v="pi-rast" aria-label="Răsturnare" title="Răsturnare" aria-haspopup="menu" aria-expanded="${pr('pi-rast')}">${SVG.rast}${CHEV}</button></div>`}
function grup(win,S){const tl=win.querySelector('.pt-tools');if(!tl)return;const g=tl.children[1];if(!g)return;
  const gc=g.querySelector('.pt-gc');
  if(gc)gc.innerHTML=butoaneImagine(S);
  else{const b=g.querySelector('[data-act="grup"]');if(b){b.setAttribute('data-act','pi:pop');b.setAttribute('data-v','pi-img');b.setAttribute('aria-haspopup','menu');b.setAttribute('aria-expanded',String(S.pop==='pi-img'));if(S.pop&&String(S.pop).startsWith('pi-')&&S.pop!=='pi-zl')b.classList.add('on')}}}
function popup(win,S){const tl=win.querySelector('.pt-tools'),g=tl?tl.children[1]:null;let h='';
  const it=(act,v,ic,t)=>`<button type="button" class="ps-it" role="menuitem" data-act="${act}" data-v="${v}">${ic} ${t}</button>`;
  /* grupul strâns (în pagină, fereastra are ~670 px și pe calculator) se deschide ca listă CU NUME: pe telefon nu poți ține degetul
     „deasupra” unui buton (regula 20); abaterea e spusă în nota de sub Paint, pentru orice ecran (judecata 1, m9 / sonnet M-8) */
  if(S.pop==='pi-img'){const sel=!!(S.ps&&S.ps.sel);
    h=`<div class="pt-pop ps-pop pi-pop" role="menu" aria-label="Imagine" style="${pozPop(win,g,250)}"><button type="button" class="ps-it${sel?'':' gri'}" role="menuitem" data-act="pi:crop"${sel?'':' aria-disabled="true"'}>${SVG.crop} Decupare</button>${it('pi:fundal','',SVG.fundal,'Eliminați fundalul')}${it('pi:pop','pi-rot',SVG.rot,'Rotiți ⌄')}${it('pi:pop','pi-rast',SVG.rast,'Răsturnare ⌄')}${it('pi:redim','',SVG.redim,'Redimensionați și înclinați')}<div class="pt-gn">Imagine</div></div>`}
  else if(S.pop==='pi-rot')h=`<div class="pt-pop ps-pop pi-pop" role="menu" aria-label="Rotiți" style="${pozPop(win,g,250)}">${it('pi:rot','d',SVG.rotd,'Rotire la dreapta 90°')}${it('pi:rot','s',SVG.rots,'Rotire la stânga 90°')}${it('pi:rot','180',SVG.rot180,'Rotire cu 180°')}<hr>${it('pi:rot','pers',SVG.pers,'Rotire personalizată')}</div>`;
  else if(S.pop==='pi-rast')h=`<div class="pt-pop ps-pop pi-pop" role="menu" aria-label="Răsturnare" style="${pozPop(win,g,250)}">${it('pi:rast','v',SVG.rastv,'Răsturnare verticală')}${it('pi:rast','o',SVG.rasto,'Răsturnare orizontală')}</div>`;
  else if(S.pop==='pi-zl'){const sb=win.querySelector('.pt-sb'),wr=win.getBoundingClientRect(),br=sb?sb.getBoundingClientRect():null;const jos=br?Math.max(4,Math.round(wr.bottom-br.top+2)):40;
    h=`<div class="pt-pop ps-pop pi-pop pi-zl" role="menu" aria-label="Zoom" style="right:8px;bottom:${jos}px">${PRESET.slice().reverse().map(z=>`<button type="button" class="ps-it" role="menuitem" data-act="pi:zval" data-v="${z}">${fmtZ(z)}</button>`).join('')}</div>`}
  if(h)win.insertAdjacentHTML('beforeend',h)}
function dialog(win,S,P){const D=P.dlg;if(!D)return;
  const rad=(v,t)=>`<button type="button" role="radio" aria-checked="${D.mod===v}" data-act="pi:d-mod" data-v="${v}"><span class="o" aria-hidden="true"></span>${t}</button>`;
  win.insertAdjacentHTML('beforeend',`<div class="pt-ov pi-ov"><div class="pt-dlg pi-dlg" role="dialog" aria-label="Redimensionare și înclinare">
    <h4>Redimensionare și înclinare</h4>
    <div class="sect">Redimensionați</div>
    <div class="pi-rad" role="radiogroup" aria-label="Redimensionați">${rad('procent','Procent')}${rad('pixeli','Pixeli')}</div>
    <div class="pi-row"><label>Orizontal<input id="pi-h" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${E(D.h)}"></label>
      <button type="button" class="pi-lant" data-act="pi:d-lant" aria-pressed="${D.lant}" aria-label="Mențineți raportul de aspect" title="Mențineți raportul de aspect">${SVG.lant}</button>
      <label>Vertical<input id="pi-v" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${E(D.v)}"></label></div>
    <div class="sect">Oblic</div>
    <div class="pi-row oblic"><label>Orizontal<input id="pi-oh" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${E(D.oh)}"></label><label>Vertical<input id="pi-ov" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${E(D.ov)}"></label></div>
    ${D.err?`<div class="pt-err" role="alert">${D.err}</div>`:''}
    <div class="pt-bt"><button type="button" class="imp" data-act="pi:d-ok">OK</button><button type="button" data-act="pi:d-anul">Anulare</button></div></div></div>`)}
function stareZoom(win,P){const z=win.querySelector('.pt-sb .z');if(!z)return;const cur=zAcum(P);
  z.innerHTML=`<button type="button" data-act="pi:zfit" aria-label="Potrivire la fereastră" title="Potrivire la fereastră">${SVG.fit}</button>`+
    `<span class="pi-zc"><input class="pi-zin" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="Zoom" title="Zoom" value="${fmtZ(cur)}"><button type="button" data-act="pi:zlista" aria-label="Zoom: alege procentul" title="Alege procentul" aria-haspopup="menu">${CHEV}</button></span>`+
    `<button type="button" data-act="pi:zminus" aria-label="Micșorare" title="Micșorare">${SVG.zm}</button>`+
    `<input type="range" class="pi-zs" min="0" max="100" step="1" value="${z2slider(Math.max(ZMIN,Math.min(ZMAX,cur)))}" aria-label="Zoom (bara cu buton)" title="Zoom">`+
    `<button type="button" data-act="pi:zplus" aria-label="Mărire" title="Mărire">${SVG.zp}</button>`}
/* mărimea pânzei pe ecran: Potrivire la fereastră (zoom null) sau procentul ales; peste 300 %, pixelii */
function aplicaZoom(inst,S,P){const win=inst.body.querySelector('.pt-win'),svg=win&&win.querySelector('.pt-svg'),wrap=win&&win.querySelector('.pt-wrap');if(!svg||!wrap)return;
  let sc=wrap.querySelector(':scope > .pi-scroll');
  if(!sc){sc=document.createElement('div');sc.className='pi-scroll';wrap.appendChild(sc)}
  if(svg.parentNode!==sc)sc.appendChild(svg);
  const cs=getComputedStyle(wrap),avail=Math.max(160,(wrap.clientWidth||660)-parseFloat(cs.paddingLeft||0)-parseFloat(cs.paddingRight||0));
  const fit=Math.min(Math.min(avail,640)/S.w,420/S.h);P.fitPct=Math.round(fit*1000)/10;
  const s=P.zoom!=null?P.zoom/100:fit;
  svg.style.width=Math.max(1,Math.round(S.w*s))+'px';svg.style.height='auto';svg.setAttribute('preserveAspectRatio','none');   /* înălțimea din viewBox; fără fâșie în afara pânzei la rotunjirea pixelilor */
  sc.classList.toggle('pi-z',P.zoom!=null);sc.style.maxWidth=P.zoom!=null?Math.floor(avail)+'px':'';
  const zin=win.querySelector('.pi-zin');if(zin&&document.activeElement!==zin)zin.value=fmtZ(zAcum(P));
  const zs=win.querySelector('.pi-zs');if(zs)zs.value=String(z2slider(Math.max(ZMIN,Math.min(ZMAX,zAcum(P)))));
  if(P.centru&&sc.scrollWidth){sc.scrollLeft=P.centru[0]*sc.scrollWidth-sc.clientWidth/2;sc.scrollTop=P.centru[1]*sc.scrollHeight-sc.clientHeight/2;P.centru=null}
  else if(P.scroll&&P.zoom!=null){sc.scrollLeft=P.scroll[0];sc.scrollTop=P.scroll[1]}
  pixeli(inst,S,P,sc,svg)}
function pixeli(inst,S,P,sc,svg){let cv=sc.querySelector('canvas.pi-px');
  if(!(P.zoom!=null&&P.zoom>=ZPIX)||(S.ps&&S.ps.sel)||P.dlg){if(cv)cv.remove();return}
  const tok=++inst.tok,w=S.w,h=S.h,i=ultimT(S.desen),lista=i>=0?S.desen.slice(i):S.desen;
  const str=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>${CSS_BLUR}</style><defs>${FILTRE}</defs><rect width="${w}" height="${h}" fill="#fff"/>${randeaza(lista,{pref:'pix'+tok+'_'})}</svg>`;
  const img=new Image();
  img.onload=()=>{if(tok!==inst.tok||!document.body.contains(svg))return;const c=document.createElement('canvas');c.width=w;c.height=h;
    try{c.getContext('2d').drawImage(img,0,0,w,h)}catch(e){return}
    const rs=svg.getBoundingClientRect(),rc=sc.getBoundingClientRect();
    c.className='pi-px';c.setAttribute('aria-hidden','true');c.style.left=Math.round(rs.left-rc.left-sc.clientLeft+sc.scrollLeft)+'px';c.style.top=Math.round(rs.top-rc.top-sc.clientTop+sc.scrollTop)+'px';c.style.width=rs.width+'px';c.style.height=rs.height+'px';
    const vechi=sc.querySelector('canvas.pi-px');if(vechi)vechi.replaceWith(c);else sc.appendChild(c)};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(str)}
function modelHtml(Q){const m=Q.pi&&Q.pi.model;if(!m||!PS.DESENE[m.desen])return '';const w=m.w||1038,h=m.h||648;
  return `<div class="pt-panou pi-model"><div class="lbl">Modelul (la ce trebuie să ajungi)</div><svg viewBox="0 0 ${w} ${h}" width="${Math.round(w*(m.scara||.3))}" role="img" aria-label="Modelul: imaginea la care trebuie să ajungi">${randeaza(PS.DESENE[m.desen],{pref:'pim'})}</svg></div>`}

function panou(c){const S=c.S,P=st(S,c.Q),inst=INST.get(c.Q);baza0(S,P);if(!inst)return modelHtml(c.Q);const win=inst.body.querySelector('.pt-win');if(!win)return modelHtml(c.Q);
  for(;P.evI<S.ev.length;P.evI++){const x=S.ev[P.evI];if(['deschis','nou','pornit','inchis'].includes(x.tip)){P.zoom=null;P.dlg=null;P.scroll=null;P.centru=null}}
  if(!S.pornit){P.dlg=null;return modelHtml(c.Q)}
  const [w,h]=marimeDorita(S,P);if(w!==S.w||h!==S.h){S.w=w;S.h=h}
  if(P.ultim&&!(S.desen[P.ultim.id]&&S.desen[P.ultim.id].u===P.ultim.u)){if(S.msg===P.ultim.msg){S.msg='';const me=inst.body.querySelector('.pt-msgz');if(me)me.innerHTML=''}P.ultim=null}
  const svg=win.querySelector('.pt-svg');if(svg)svg.setAttribute('viewBox',`0 0 ${S.w} ${S.h}`);
  const sz=win.querySelector('.pt-sb [title="Mărimea pânzei"]');if(sz)sz.textContent=`▢ ${S.w} × ${S.h}px`;
  if(S.pop&&String(S.pop).startsWith('pi-')&&P.dlg)S.pop=null;
  grup(win,S);stareZoom(win,P);popup(win,S);dialog(win,S,P);aplicaZoom(inst,S,P);
  if(P.focus&&!S.dlg&&!S.intreb){const f=P.focus;P.focus=false;
    if(f==='dlg'){const i=win.querySelector('#pi-h');if(i){i.focus({preventScroll:true});try{i.select()}catch(e){}}}
    else if(f==='pop'){const b=win.querySelector('.pi-pop button');if(b)b.focus({preventScroll:true})}
    else win.focus({preventScroll:true})}
  return modelHtml(c.Q)}

function actiune(a,v,c){const S=c.S,P=st(S,c.Q),inst=INST.get(c.Q);
  if(!a.startsWith('pi:')){
    if(S.pop&&String(S.pop).startsWith('pi-'))S.pop=null;
    if(a==='undo'&&S.pornit&&laBaza(S,P)){opresteAnularea(S);return true}   /* ↶ pe poza abia deschisă: nimic de anulat */
    if(a==='unealta'&&v==='lupa'){c.msg('<b>Lupă</b>: n-o folosim azi. Mărești și micșorezi din colțul din dreapta al barei de stare (lupa cu + și lupa cu −).');return true}
    if(a==='meniu'&&v==='viz'){S.meniu=null;c.msg('Meniul <b>Vizualizați</b> nu-l folosim azi. Panoramarea (în Paint scrie <b>Zoom</b>) o schimbi din colțul din dreapta al barei de stare.');return true}
    if(a==='grup'&&v==='imagine'){S.meniu=null;S.pop=S.pop==='pi-img'?null:'pi-img';P.focus=S.pop?'pop':true;return true}
    if(a==='zoom'){c.msg('Panoramarea o schimbi din colțul din dreapta al barei de stare.');return true}
    return false}
  c.msg('');
  switch(a){
    case 'pi:pop':S.pop=S.pop===v?null:v;S.meniu=null;P.focus=S.pop?'pop':true;return true;
    case 'pi:rot':S.pop=null;if(v==='pers')c.msg('<b>Rotire personalizată</b> (un unghi oarecare) n-o folosim azi: alegi 90° sau 180°.');else transforma(S,P,c,OPROT[v]);break;
    case 'pi:rast':S.pop=null;transforma(S,P,c,v==='v'?'rastv':'rasto');break;
    case 'pi:crop':S.pop=null;transforma(S,P,c,'trunchiere');break;
    case 'pi:fundal':S.pop=null;c.msg('<b>Eliminați fundalul</b> folosește inteligența artificială: nu-l folosim la ore.');break;
    case 'pi:redim':S.pop=null;deschideRedim(S,P,c);return true;
    case 'pi:d-mod':if(P.dlg&&P.dlg.mod!==v){P.dlg.mod=v;P.dlg.err='';if(v==='pixeli'){P.dlg.h=String(S.w);P.dlg.v=String(S.h)}else{P.dlg.h='100';P.dlg.v='100'}P.dlg.h0=P.dlg.h;P.dlg.v0=P.dlg.v;delete P.dlg.hr;delete P.dlg.vr}P.focus='dlg';return true;
    case 'pi:d-lant':if(P.dlg)P.dlg.lant=!P.dlg.lant;return true;
    case 'pi:d-ok':okRedim(S,P,c);if(P.dlg)P.focus='dlg';return true;
    case 'pi:d-anul':P.dlg=null;break;
    case 'pi:zfit':centru(inst,P);P.zoom=null;zoomEv(S,P);break;
    case 'pi:zplus':case 'pi:zminus':centru(inst,P);zoomPas(P,a==='pi:zplus'?1:-1);zoomEv(S,P);break;
    case 'pi:zlista':S.pop=S.pop==='pi-zl'?null:'pi-zl';P.focus=S.pop?'pop':true;return true;
    case 'pi:zval':S.pop=null;centru(inst,P);setZoom(P,+v);zoomEv(S,P);break;
  }
  P.focus=true;return true}

/* ---- gesturile mele (după ascultătorii din paint.js și paint-selectie.js) ---- */
const NOTA='Un Paint mic, desenat în pagină, după Paint-ul din Windows 11. Merg grupul <b>Imagine</b> (Decupare, Rotiți, Răsturnare, Redimensionați și înclinați), panoramarea din colțul din dreapta al barei de stare (lupa cu −, bara cu buton, lupa cu +, procentul; pe pânză, <kbd>Ctrl</kbd> + rotița mouse-ului), selecția, Creion, Pensule, Radieră, Forme și tastele <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>. Culorile și textul îți spun la ce lecție le înveți. Pentru <b>Nou</b> folosești meniul <b>Fișier</b>; pe telefon, în loc de <kbd>Ctrl</kbd>+<kbd>Z</kbd>, săgeata ↶ de sus. În pagină, grupul <b>Imagine</b> e un singur buton, care se deschide ca listă cu nume; în Paint-ul adevărat vezi butoanele cu pictograme (ține mouse-ul pe unul ca să-i afli numele).';
function leaga(Q,body){
  const inst=INST.get(Q),win=body.querySelector('.pt-win'),root=body.querySelector('.pt');if(!win||!root)return;
  const nota=root.querySelector('.pt-nota'),rb=nota&&nota.querySelector('[data-reset]');
  if(nota&&rb&&!Q.explorare){nota.innerHTML=NOTA;nota.appendChild(document.createTextNode(' '));nota.appendChild(rb)}
  const sim=()=>body._sim,S=()=>sim().stare(),P=()=>st(S(),Q),redraw=ops=>sim().run(ops||[]);
  /* ---- judecata 1, M4: Ctrl+Z nu coboară sub starea de la deschidere ----
     (1) starea de pornire, la fiecare deschidere / document nou / pornire / închidere (și, prima oară, la primul traseu) */
  if(body._piEv)body.removeEventListener('paint-sim',body._piEv);   /* același #body primește exercițiu după exercițiu */
  body._piEv=e=>{const x=e.detail||{},s=sim()&&S();if(!s)return;const nou=!s.pi,p=P();
    if(['deschis','nou','pornit','inchis'].includes(x.tip))p.n0={ref:s.desen,n:s.desen.length};
    else baza0(s,p,nou&&x.tip==='desen'?1:0)};
  body.addEventListener('paint-sim',body._piEv);
  /* (2) tasta din afara Paint-ului din pagină: paint-selectie.js o trece prin run([['ctrl','z']]) — run-ul îmbrăcat o oprește */
  if(body._sim&&!body._sim.piRun){const run0=body._sim.run;
    body._sim.run=(ops,fresh)=>{if(fresh||!ops||!ops.some(o=>(o[0]==='ctrl'&&String(o[1]).toLowerCase()==='z')||o[0]==='anuleaza'))return run0(ops,fresh);
      ops.forEach(o=>{const s=S(),p=P();if(((o[0]==='ctrl'&&String(o[1]).toLowerCase()==='z')||o[0]==='anuleaza')&&s.pornit&&laBaza(s,p)){opresteAnularea(s);run0([])}else run0([o])})};
    body._sim.piRun=true}
  /* (3) tasta în Paint-ul din pagină (paint.js o ia în ascultătorul lui de pe .pt): o opresc înaintea lui, în captură */
  win.addEventListener('keydown',e=>{const s=S(),p=P(),t=e.target;
    if(!e.ctrlKey||e.altKey||e.metaKey||e.shiftKey||String(e.key).toLowerCase()!=='z')return;
    if(!s.pornit||s.dlg||s.intreb||p.dlg||Q.explorare||(t&&/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName||'')))return;
    if(!laBaza(s,p))return;
    e.preventDefault();e.stopImmediatePropagation();opresteAnularea(s);redraw();win.focus({preventScroll:true})},true);
  /* ---- judecata 1 (sonnet): un clic / o atingere în afara Paint-ului din pagină închide meniul sau lista deschisă ---- */
  const afara=e=>{if(!document.body.contains(win)){document.removeEventListener('pointerdown',afara,true);return}
    const s=sim()&&S();if(!s||s.dlg||s.intreb||win.contains(e.target))return;
    if(s.pop||s.meniu){s.pop=null;s.meniu=null;s.sub=null;redraw()}};
  document.addEventListener('pointerdown',afara,true);
  /* ---- judecata 1, M3 + judecata 2, W: o apăsare pe marginea gri din jurul pânzei, cu Selectare, nu pornește nicio selecție; aici
     spun de ce, dar: (1) NUMAI pe marginea gri propriu-zisă — nu pe barele de derulare ale pânzei mărite (merg cu orice unealtă);
     (2) NUMAI la ridicare, dacă pagina nu s-a derulat (pe telefon, o glisare pornită de acolo derulează pagina: pointercancel → nimic);
     (3) FĂRĂ redesenare (aceea înlocuia zona derulabilă, iar bara nu se mai putea trage): mesajul se scrie direct în .pt-msgz și în
     S.msg (pentru redesenările următoare); (4) textul spune ce face pagina (Paint-ul adevărat, la o tragere pornită pe gri, nu e probat) */
  const MSG_GRI='Ai apăsat pe marginea gri: aici selecția pornește doar de pe pânza albă. Pune degetul (sau mouse-ul) puțin mai înăuntru și trage de acolo.';
  const peBara=(sc,e)=>{const r=sc.getBoundingClientRect();return e.clientX-r.left-sc.clientLeft>=sc.clientWidth||e.clientY-r.top-sc.clientTop>=sc.clientHeight};
  const poateGri=s=>!!s&&s.pornit&&!s.dlg&&!s.intreb&&!Q.explorare&&!s.meniu&&!s.pop&&s.unealta==='selectie'&&!P().dlg;
  const selDe=s=>JSON.stringify((s.ps&&s.ps.sel)||null);
  win.addEventListener('pointerdown',e=>{const t=e.target;if(!t||!t.closest||!t.closest('.pt-wrap')||t.closest('.pt-svg')||t.closest('button,input,canvas'))return;
    const sc=t.closest('.pi-scroll');if(sc&&peBara(sc,e))return;
    if(e.button>0||!poateGri(S()))return;
    const id=e.pointerId,x0=window.scrollX,y0=window.scrollY,sel0=selDe(S());
    const gata=ev=>{if(ev.pointerId!==id)return;document.removeEventListener('pointerup',gata,true);document.removeEventListener('pointercancel',gata,true);
      if(ev.type!=='pointerup'||Math.abs(window.scrollX-x0)>1||Math.abs(window.scrollY-y0)>1||!document.body.contains(win))return;
      const s=S();if(!poateGri(s)||selDe(s)!==sel0)return;
      s.msg=MSG_GRI;s.rau=false;const me=body.querySelector('.pt-msgz');if(me)me.innerHTML=`<div class="pt-msg">${MSG_GRI}</div>`};
    document.addEventListener('pointerup',gata,true);document.addEventListener('pointercancel',gata,true)});
  /* cât tragi pe pânză, se vede pânza vie (fără pixelii de la zoom mare) */
  win.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('.pt-svg')){const cv=win.querySelector('canvas.pi-px');if(cv)cv.style.visibility='hidden'}},true);
  /* fereastra Redimensionare și înclinare: lanțul leagă casetele */
  win.addEventListener('input',e=>{const t=e.target;if(!t||!t.id||!/^pi-(h|v|oh|ov)$/.test(t.id))return;const s=S(),D=P().dlg;if(!D)return;
    const k=t.id.slice(3);
    /* judecata 2, Z: cât a rămas în față din numărul de la deschidere = prefixul comun cu valoarea de dinainte (nu mai crește) */
    if(k==='h'||k==='v'){const pv=String(D[k]==null?'':D[k]),nv=String(t.value);let c=0;while(c<pv.length&&c<nv.length&&pv[c]===nv[c])c++;D[k+'r']=Math.min(ramas(D,k),c)}
    D[k]=t.value;
    if(D.lant&&(k==='h'||k==='v')){const alt=k==='h'?'v':'h';D[alt]=legat(D,k,s);D[alt+'r']=0;const o=win.querySelector('#pi-'+alt);if(o)o.value=D[alt]}
    if(D.err){D.err='';const er=win.querySelector('.pi-dlg .pt-err');if(er)er.remove()}});
  /* bara cu buton a zoomului: cât o tragi, doar pânza își schimbă mărimea; la sfârșit, redesenarea */
  win.addEventListener('input',e=>{const t=e.target;if(!t||!t.classList||!t.classList.contains('pi-zs'))return;const s=S(),p=P();
    if(!p.centru)centru(inst,p);setZoom(p,slider2z(+t.value));const zin=win.querySelector('.pi-zin');if(zin)zin.value=fmtZ(p.zoom);aplicaZoom(inst,s,p)});
  win.addEventListener('change',e=>{const t=e.target;if(!t||!t.classList||!t.classList.contains('pi-zs'))return;const s=S(),p=P();p.centru=null;zoomEv(s,p);redraw()});
  /* derularea pânzei mărite se păstrează la redesenare */
  win.addEventListener('scroll',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('pi-scroll')&&t.classList.contains('pi-z'))P().scroll=[t.scrollLeft,t.scrollTop]},true);
  /* tastele: fereastra mea e modală; Enter = OK, Esc = Anulare; caseta procentului: Enter */
  win.addEventListener('keydown',e=>{const s=S(),p=P(),t=e.target;
    if(p.dlg){
      if(e.key==='Enter'&&!(t&&t.tagName==='BUTTON')){e.preventDefault();e.stopPropagation();redraw([['pi-ok']]);return}
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();p.dlg=null;p.focus=true;redraw();return}
      if(!(t&&t.tagName==='INPUT')&&(e.ctrlKey||e.metaKey||e.key==='Delete')){e.preventDefault();e.stopPropagation()}   /* în casete, Ctrl+A / C / V și Delete merg ca în orice casetă */
      return}
    if(t&&t.classList&&t.classList.contains('pi-zin')){
      if(e.key==='Enter'){e.preventDefault();e.stopPropagation();const z=numar(t.value);if(z>0){centru(inst,p);setZoom(p,z);zoomEv(s,p)}p.focus=true;redraw();return}
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();t.value=fmtZ(zAcum(p));win.focus({preventScroll:true});return}}
  },true);
  /* Ctrl + rotița mouse-ului pe pânză (PRESUPUS: ca în multe programe) */
  win.addEventListener('wheel',e=>{if(!e.ctrlKey)return;const w=e.target.closest&&e.target.closest('.pt-wrap');if(!w)return;e.preventDefault();
    const s=S(),p=P();if(!s.pornit||p.dlg||s.dlg||s.intreb)return;centru(inst,p);zoomPas(p,e.deltaY<0?1:-1);zoomEv(s,p);redraw()},{passive:false});
}
/* Enter în fereastra mea, trecut prin run() ca să se redeseneze ca orice gest */
const EXT={verifica,op:(o,c)=>{if(o[0]==='pi-ok'){okRedim(c.S,st(c.S,c.Q),c);return true}return op(o,c)},actiune,panou};
function creeaza(alte){
  const baza=PSL.creeaza([EXT].concat(alte||[]));
  return {
    render(Q,body,api){css();INST.set(Q,{body,tok:0});baza.render(Q,body,api);leaga(Q,body)},
    rezolva(Q,body,api){return baza.rezolva(Q,body,api)},
    gresit(Q,body,api){return baza.gresit(Q,body,api)}
  }}
window.PaintImagine={versiune:1,ext:EXT,creeaza,TRANSF,coace,DESENE,PRESET,judecaTaiere};
window.SimPaintImg=creeaza();
})();
