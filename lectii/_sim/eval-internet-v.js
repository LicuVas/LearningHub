/* ======================================================================================================
   lectii/_sim/eval-internet-v.js — PROBA DE ANTRENAMENT, cu punctaj pe părțile C / B / A, peste browserele simulate ale
   clasei a V-a (lecția V · M3 · nr. 17, „Evaluare sumativă: Internet și documentare”, 24.10.2026). PROPRIETAR: autorul
   lecției V/17. Modele: lectii/_sim/eval-internet-vi.js (VI/16: punctele în memorie, bifele ascunse până la prima
   verificare, „Sunt alt elev”, schimbarea elevului) și explorer-proba.js (V/12: părțile, nota, nivelul, „unde ai pierdut”).

   NU modifică motorul (jocuri/_motor/*), browser-web.js (V/14), browser-salvare.js (V/15), browser-siguranta.js (V/16),
   bilete-servicii.js (V/13), rezultat-elev.js sau prezenta.js. Folosește DOAR interfețele lor publice:
     - BrowserSiguranta.creeaza(site) → un tip nou de browser, cu paginile acestui fișier (fila lecției 17, ursul iarna,
       vulpea) peste lumea V/14 + V/16; testele lor (tastat, link, inapoi, cautare, dinRezultate, raspuns, vazut, fisa,
       faraCapcane, filaLectiei…) rămân ale lor;
     - SimBrowserSalvare (V/15), cu paginile și fotografiile lui (urs în pădure, Natura Exemplu);
     - mânerul pe care browser-web.js îl pune pe exercițiu: body._sim = {run, stare(), test(c)};
     - api.checkButton al motorului: îl învelesc ca să socotesc punctele ÎNAINTE de verificarea simulatorului.

   ÎNCĂRCARE (după motor.js, browser-web.js, browser-salvare.js, browser-siguranta.js):
     <script src="../../_sim/eval-internet-v.js"></script>
     EvalInternetV.configureaza({titlu:'Proba de antrenament', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:8},…]});
     tipuri:{browserEv:EvalInternetV.browser, probaweb:EvalInternetV.probaBrowser, probasalv:EvalInternetV.probaSalvare,
             probaalege:EvalInternetV.alegere, probaclasa:EvalInternetV.clasare}

   TIPURI
   - browserEv (FĂRĂ puncte): browserul lecției 17 = BrowserSiguranta.creeaza(EvalInternetV.SITE). Pentru exercițiile pașilor.
   - probaweb / probasalv (CU puncte): Q-ul tipului de bază (start, checks, sol, gresit, raspuns, notepad, foldere…), plus:
       proba:'C2'          id-ul cerinței din configureaza (fără el sau cu un id necunoscut: tipul de bază, neschimbat);
       checks[i].puncte    punctele testului (suma = punctele cerinței); testele fără `puncte` nu se punctează;
       checks[i].ceInainte textul testului PÂNĂ la prima verificare (când textul adevărat ar da răspunsul: „pagina muzeului”);
       checks[i].paza      punctele lui doar dacă a trecut și un test de lucru (fără paza) al aceleiași cerințe
                           („fila lecției e tot deschisă” e adevărat și dacă n-ai făcut nimic);
       checks[i].lectia    unde recitești (HTML: legătura directă la pas, `../m2-l14/?vezi=p4`);
       checks[i].forme     (versiunea 2, 24.10.2026, reparația J1) DOAR la testele pe text scris: k:'raspuns' (caseta de sub
                           browser), k:'np' (Notepad) și k:'fisa' (V/16; acolo doar `fara`, care poate OPRI testul de bază:
                           lista `a` a paginilor permise devine goală). {toate:[[re,…],…], fara:[re,…]}: fiecare grup din `toate` are cel
                           puțin o expresie care se potrivește, iar niciuna din `fara` nu se potrivește. Textul se compară
                           normalizat: litere mici, fără diacritice, orice altceva decât litere/cifre/@ = un spațiu, cu un
                           spațiu la început și la sfârșit („04.02.2026” → „ 04 02 2026 ”). În copia testelor, `are` devine
                           calculat din `forme` (textul de ACUM al casetei / Notepad-ului), ca simulatorul de bază, bifele și
                           punctele să judece la fel. Proba: _proba/proba_reparatii.py (20+ forme bune, 20+ greșite pe test).
   - probaalege (CU puncte): q, o:[…], ok, amesteca?, mesaje:{indice:'…'}, puncte, ce, lectia, why, ajutor.
       Punctele = PRIMA alegere (ca la lucrare). Apoi ca alegerea motorului: greșit → încă o încercare; după două, răspunsul.
   - probaclasa (CU puncte): q, cats:[…], items:[[text, indiceCategorie],…], puncteRand, lectia, why, ajutor.
       Punctele = rândurile bune la PRIMA verificare (puncteRand pe rând). Aceleași clase ca „classify” din motor (cls-row).

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4.1-4.3; _campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md; spuse la
   clasa a V-a în lecția 1, pasul „Lucrarea: trei părți și nota ta”): C = De bază 40, B = Consolidat 30, A = Avansat 20,
   10 din oficiu; nota = punctaj : 10, rotunjit după ultima cifră (0-4: numărul de zeci; 5-9: numărul de zeci + 1);
   nivelul se citește din notă: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate.
   Punctele pe CERINȚE sunt ale paginii (antrenament), nu ale profesorului: panoul o spune.

   CE FACE
   1. Punctele unei cerințe se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică” (la alegere: prima variantă aleasă).
      Ce repară elevul după aceea e exercițiu și nu schimbă punctele. Fiecare test își are punctele lui: o greșeală pierde
      doar punctele testului ei (nicio dublă penalizare; tabelul combinațiilor: lectii/v/m3-l17/surse.md).
   2. „Verifică” pe browserul NEATINS (filele, căutările, caseta, Notepad-ul și fișierele ca la pornire; „Ia-o de la capăt”
      readuce pornirea) nu socotește nimic și o spune. Cât e deschis meniul imaginii sau fereastra „Salvare ca”, nu se
      socotește nimic: elevul termină salvarea (Salvare) sau o închide (Anulare), apoi apasă iar „Verifică”.
   3. Până la prima verificare nu se văd bifele și nici „Am nevoie de un indiciu” (la lucrare nu ai nici bife, nici indicii);
      lista rămâne „Ce se verifică”, cu textele `ceInainte`. După prima verificare: blocul „Punctele cerinței X, de la prima
      verificare” (✓ +p / ✗ 0 din p) și lista vie a simulatorului, pentru exercițiu.
   4. Panoul probei, deasupra cerinței: unde ești, punctele de până acum, „Sunt alt elev / Încep din nou”; după ultima
      cerință: punctele pe părți, oficiul, punctajul, nota, nivelul și „unde ai pierdut puncte”, cu lecția de recitit.
   5. Nimic din probă nu se scrie în localStorage, sessionStorage sau pe server: totul stă în memoria paginii (la
      reîncărcare, proba e goală, iar pagina o spune). Singura excepție: un SEMN fără date, sessionStorage
      'ev5_proba_golita' = '1', lăsat la plecarea paginii cu proba începută și șters la pornire, ca panoul să spună că proba
      s-a golit (înscrierea în caseta de jos, prezenta.js, repornește pagina). Proba se golește și se reia de la C1 la „Sunt
      alt elev / Încep din nou” și când se schimbă elevul din caseta prezenta.js (evenimentul `prezenta` și, ca plasă, la
      fiecare „Verifică”), ca la VI/10 și VI/16 (regula 23).
   6. (versiunea 2) Enter în caseta de răspuns a unei cerințe cu puncte NU verifică (în browser-web.js, Enter acolo apasă
      „Verifică”, iar la probă asta ar fi fost prima verificare, cu punctaj, făcută din greșeală): îl opresc în faza de
      captură, pe corpul exercițiului, și spun „apasă butonul Verifică”. browser-web.js rămâne neatins.
   7. (versiunea 2) Blocul punctelor arată doar testele pierdute (✗) și totalul; bifele vii rămân în lista simulatorului.
   8. (versiunea 3, 24.10.2026, reparația 2) La `fisa` cu parte 'ambele': o dată cu luna prescurtată pe care testul V/16 n-o
      știe („2 nov 2025”, el caută „noi”) o verific aici (LUNI_PRESC, pe pagina de pe ecran); testul de bază verifică
      atunci doar autorul. browser-siguranta.js rămâne neatins (defectul e notat în surse.md, „Pentru componenta comună”).
      Panoul de dinaintea primei verificări spune doar „Fă toată cerința, apoi apasă Verifică.” (regula e în intro).
   9. (versiunea 4, 24.10.2026, reparația 3, judecata 3 W/X) ALEGEREA sub browser, în locul casetei de răspuns:
      probaweb cu Q.alege = {eticheta, o:[4 texte], ok:indice, motive:[un motiv pe variantă], amesteca?} și FĂRĂ Q.raspuns.
      Sub browser apar variantele (butoane .opt în .ev5-alege, aria-pressed). Varianta apăsată intră în starea browserului
      ca răspuns, prin API-ul public: body._sim.run([['raspuns', textul variantei]]) — deci testul de bază
      {k:'raspuns', are:[textul variantei bune]} o judecă, iar `sol` / `gresit` scriu tot ['raspuns', o[k]]. Se poate
      schimba până la prima verificare (ca pe foaie, până predai); punctele se socotesc la PRIMA verificare, cu varianta
      aleasă atunci. Motivul variantei alese se arată DUPĂ prima verificare (înainte, elevul ar afla dacă e bună și ar
      schimba-o fără să piardă puncte); după ea, la fiecare schimbare (exercițiu). „Ia-o de la capăt”, „Arată-mi” și
      rezolva/gresit golesc / pun alegerea din starea browserului. Folosit la B1 (lecția 17): lista de forme libere
      greșea în ambele sensuri a treia rundă la rând (judecățile 1-3), iar o notă reală nu poate depinde de ea.
   Global: window.EvalInternetV {configureaza, SITE, L17, browser, probaBrowser, probaSalvare, alegere, clasare, stare,
     goleste, nota, nivel, puncte, test(c), forme(text, forme)}. test(c) = testul c pe exercițiul de pe ecran, cu `forme`
     (pentru probele care trimit copii JSON ale testelor). Probele: lectii/v/m3-l17/_proba/proba_eval.py și
     proba_reparatii.py (ultima linie 0).
   ====================================================================================================== */
(function(){
'use strict';
const BSig=window.BrowserSiguranta,SimBS=window.SimBrowserSalvare;
if(!window.BrowserWeb||!BSig){console.error('eval-internet-v.js: încarcă întâi browser-web.js și browser-siguranta.js');return}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const txt=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');

/* ---------------- lumea lecției 17 (INVENTATĂ, locală; nimic nu pleacă spre Internet) ---------------- */
const L17='learninghub-8z6.pages.dev/lectii/v/m3-l17';
const SITE=Object.freeze({
 [L17]:{titlu:'Lecția 17 · LearningHub',site:'LearningHub',ascunsa:true,lectie:true,
  text:['Aici e lecția ta. Ca s-o păstrezi deschisă, lucrezi într-o filă nouă: apasă +, sus, lângă file.']},
 /* ursul brun iarna (cerința B1): două pagini de încredere, un forum greșit; reclama „Urs de pluș” e din lumea V/14 */
 'www.muzeu-exemplu.ro/ursul-brun-iarna':{titlu:'Ce face ursul brun iarna',site:'Muzeul de Științe Naturale Exemplu',
  autor:'Victor Lazăr, biolog',data:'15 ianuarie 2026',dataN:[15,1,2026],cheiAutor:['lazar','muzeu*'],
  text:['Iarna, ursul brun doarme în bârlog: o peșteră sau o groapă ascunsă în pădure. Se trezește primăvara.','Puii se nasc iarna, chiar în bârlog.'],
  sursaInfo:'De unde știm: cercetătorii muzeului urmăresc urșii din munți în fiecare iarnă.',credibila:true,
  cuv:'urs ursul ursii brun bruni iarna doarme dorm barlog muzeu pui'},
 'www.parc-exemplu.ro/ursul-iarna':{titlu:'Urșii din parc, iarna',site:'Parcul Natural Exemplu',
  autor:'Ion Vasilescu, pădurar',data:'20 decembrie 2025',dataN:[20,12,2025],cheiAutor:['vasilescu','parcul natural*'],
  text:['De la sfârșitul toamnei până primăvara, urșii bruni din parc dorm în bârloguri.'],   /* v3: fraza a doua scoasă (durata, J2 S) */
  sursaInfo:'De unde știm: pădurarii parcului știu unde e fiecare bârlog și îl urmăresc de departe.',credibila:true,
  cuv:'urs ursul ursii urși brun bruni iarna dorm doarme barlog barloguri parc'},
 'www.forum-exemplu.ro/ursi-iarna':{titlu:'ursii pleaca iarna in alte tari??',site:'Forum Exemplu',
  text:['cred ca ursii pleaca iarna la cald, ca berzele. asa mi-a zis un coleg'],cuv:'urs ursul ursii brun iarna pleaca forum'},
 /* vulpea (cerința A1, situația nouă): două pagini de încredere, o pagină-capcană, o reclamă ascunsă, un forum, o reclamă */
 'www.muzeu-exemplu.ro/vulpea':{titlu:'Vulpea roșcată: ce mănâncă',site:'Muzeul de Științe Naturale Exemplu',
  autor:'dr. Ioana Stan, biologă',data:'8 martie 2026',dataN:[8,3,2026],cheiAutor:['stan','muzeu*'],
  text:['Vulpea roșcată mănâncă mai ales șoareci. Mai prinde iepuri și păsări, iar vara mănâncă și insecte și fructe.'],
  sursaInfo:'De unde știm: din observațiile făcute în fiecare an de cercetătorii muzeului.',credibila:true,
  cuv:'vulpe vulpea vulpi roscata hrana mananca hraneste soareci muzeu'},
 'www.enciclopedie-exemplu.ro/vulpe':{titlu:'Vulpea – Enciclopedia Exemplu pentru copii',site:'Enciclopedia Exemplu',
  autor:'echipa Enciclopediei Exemplu',data:'2 noiembrie 2025',dataN:[2,11,2025],cheiAutor:['enciclopedi*','echipa'],
  text:['Vulpea trăiește în păduri și pe câmpii.','Hrana ei: șoareci, iepuri, păsări, insecte și fructe de pădure.'],
  sursaInfo:'Surse: cărțile despre animale ale muzeelor și atlasul animalelor din România.',credibila:true,
  cuv:'vulpe vulpea vulpi hrana mananca hraneste enciclopedie soareci'},
 'www.super-stiri-exemplu.ro/vulpea-pizza':{titlu:'INCREDIBIL!!! O vulpe mănâncă doar pizza!',site:'Super Știri Exemplu',falsa:true,
  text:['Nu o să crezi!!! O vulpe vine în fiecare seară la pizzerie și nu mănâncă nimic altceva. Vezi pozele ȘOCANTE!!!'],
  popup:{titlu:'Felicitări! Ai câștigat o tabletă!',text:'Ești câștigătorul zilei. Apasă REVENDICĂ în 20 de secunde și scrie-ți numele și adresa.',buton:'REVENDICĂ'},
  cuv:'vulpe vulpea vulpi mananca hrana incredibil pizza'},
 'www.aparate-foto-exemplu.ro/totul-despre-vulpi':{titlu:'Tot ce trebuie să știi despre vulpi',site:'Aparate Foto Exemplu',
  text:['Vulpile sunt animale frumoase, greu de văzut în pădure.','Ca să fotografiezi orice vulpe de aproape, îți trebuie aparatul Super Foto! Doar azi, la jumătate de preț.'],
  vinde:'Comandă acum, -50%!',cuv:'vulpe vulpea vulpi despre tot hrana mananca aparat foto'},
 'www.forum-exemplu.ro/vulpi':{titlu:'ce mananca vulpile???',site:'Forum Exemplu',
  text:['vulpile mananca doar struguri, asa e in poveste. stie toata lumea'],cuv:'vulpe vulpea vulpi mananca hrana forum struguri'},
 'www.magazin-exemplu.ro/vulpe-plus':{titlu:'Vulpe de pluș – reducere 40%! Cumpără acum',site:'Magazin Exemplu',reclama:true,
  text:['Vulpea de pluș, cadoul perfect pentru iarnă.'],cuv:'vulpe vulpea vulpi plus jucarie hrana mananca'}
});
const BrowserEv0=BSig.creeaza(SITE);

/* ---------------- stilul simulatoarelor V/15 și V/16 (versiunea 2, 24.10.2026) ----------------
   browser-salvare.js (V/15) și browser-siguranta.js (V/16) își pun AMÂNDOUĂ stilul în <style id="bs-css"> și nu-l mai pun
   dacă id-ul există deja. Pagina lecției 17 e prima care le încarcă pe amândouă: al doilea simulator rămânea fără stil
   (după un browser V/16, fereastra „Salvare ca”, meniul imaginii și Notepad-ul V/15 erau fără stilul lor — de aici țintele
   de 28-30 px găsite de judecătorul 1, J1-9; invers, fereastra falsă V/16 ar fi rămas fără stil). Fișierele comune rămân
   neatinse: după fiecare desenare, mut stilul pus sub alt id (bs-css-salvare / bs-css-siguranta), ca locul să fie liber
   pentru celălalt; o copie identică se scoate. Când le am pe amândouă, pun un <style id="bs-css"> gol, ca să nu se mai
   adauge nimic. Proba: _proba/proba_reparatii.py, [K]. */
function stilBS(){
  const el=document.getElementById('bs-css');
  if(el&&!el.hasAttribute('data-ev5-gol')){
    const t=el.textContent||'',n=t.includes('.bs-dlg{')?'salvare':t.includes('.bs-pop{')?'siguranta':'';
    if(n){if(document.getElementById('bs-css-'+n))el.remove();else el.id='bs-css-'+n}}
  const ambele=!!document.getElementById('bs-css-siguranta')&&(!SimBS||!!document.getElementById('bs-css-salvare'));
  if(ambele&&!document.getElementById('bs-css')){const g=document.createElement('style');g.id='bs-css';g.setAttribute('data-ev5-gol','');document.head.appendChild(g)}
}
const cuStil=baza=>({render(Q,body,api){stilBS();const r=baza.render(Q,body,api);stilBS();return r},
  rezolva:(Q,body)=>baza.rezolva(Q,body),gresit:(Q,body)=>baza.gresit(Q,body)});
const BrowserEv=cuStil(BrowserEv0);

/* ---------------- configurația și starea probei (doar în memorie) ---------------- */
let CFG={titlu:'Proba de antrenament',oficiu:10,parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},itemi:[]};
/* prima[id] = {teste:[{ce, puncte, ok, lectia, motiv}]} — prima verificare a fiecărei cerințe; ora = ora primei verificări;
   cine = elevul din caseta prezenta.js la prima verificare ('null' = fără nume); nota = un rând de spus în panou */
const ST={prima:{},nota:'',ora:'',cine:''};
let curent=null;   // cerința de pe ecran: {id, body}

function css(){
  if(document.getElementById('ev5-css'))return;
  const s=document.createElement('style');s.id='ev5-css';
  s.textContent=`
.ev5-panou{border:2px dashed var(--accent);border-radius:8px;padding:8px 12px;margin:6px 0 10px;background:var(--paper2);text-align:left}
.ev5-panou p{margin:.3em 0}
.ev5-panou .ev5-cap{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;justify-content:space-between}
.ev5-panou .ev5-et{font-weight:700;color:var(--accent)}
.ev5-panou ul{margin:.3em 0 .3em 1.2em;padding:0}
.ev5-panou li{margin:.25em 0}
.ev5-panou a{color:var(--accent)}
.ev5-panou details summary{min-height:32px;display:flex;align-items:center;cursor:pointer;color:var(--accent);font-weight:600}
.ev5-panou .ev5-nota{border-left:4px solid var(--accent);padding:4px 8px;margin:6px 0;background:var(--paper)}
.ev5-panou table{border-collapse:collapse;margin:.3em 0;max-width:100%}
.ev5-panou td,.ev5-panou th{border:1px solid var(--line);padding:3px 8px;text-align:left}
.ev5-panou .btn{min-height:36px}
.ev5-puncte{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:6px 10px;margin:8px 0;background:var(--paper);text-align:left}
.ev5-puncte p{margin:.25em 0}
.ev5-puncte ul{list-style:none;margin:.3em 0;padding:0}
.ev5-puncte li{margin:.3em 0}
.ev5-puncte li.ok .s{color:var(--ok);font-weight:700}
.ev5-puncte li.rau .s{color:var(--bad);font-weight:700}
.ev5-puncte .ev5-de{color:var(--ink2)}
.ev5-ascuns .bw-teste li.ok{color:inherit}
.ev5-ascuns .bw-teste li.ok::before{border-color:var(--ink2);background:none}
.ev5-ascuns .bw-teste li.ok::after{display:none}
.fb.ev5-info{background:var(--paper2);color:var(--ink);border:1px solid var(--line);border-left:4px solid var(--accent)}
.ev5-alege .opts{display:grid;gap:8px;margin:6px 0}
.ev5-alege .opt{min-height:40px;width:100%;font:inherit;color:inherit;cursor:pointer}
.ev5-alege .ev5-motiv{margin:6px 0 2px;padding:6px 10px;border-radius:6px;border:1px solid var(--line);border-left:4px solid var(--accent);background:var(--paper)}
.ev5-alege .ev5-motiv.ok{border-left-color:var(--ok)}
.ev5-alege .ev5-motiv.rau{border-left-color:var(--bad)}`;
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
const oraAcum=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
function goleste(nota){Object.keys(ST.prima).forEach(k=>delete ST.prima[k]);ST.nota=nota||'';ST.ora='';ST.cine=''}
function pune(id,rez){ST.prima[id]=rez;ST.nota='';if(!ST.ora)ST.ora=oraAcum();if(!ST.cine)ST.cine=cineE()}
function peParti(){const r={};Object.keys(CFG.parti).forEach(k=>{r[k]={luat:0,max:CFG.parti[k].max}});
  ids().forEach(id=>{const p=r[item(id).parte];if(p&&ST.prima[id])p.luat+=luate(id)});return r}
/* nota = punctaj : 10, rotunjit după ultima cifră (0-4: zecile; 5-9: zecile + 1); nivelul din notă (regula profesorului) */
const nota=punctaj=>Math.max(1,Math.min(10,Math.floor((punctaj+5)/10)));
const nivel=n=>n>=9?'Avansat':n>=7?'Consolidat':n>=5?'De bază':n>=3?'În formare':'În dificultate';

/* ---------------- elevul de pe scaun (caseta prezenta.js) ---------------- */
const cheieDe=x=>{try{return JSON.stringify(x||null)}catch(e){return 'null'}};
function cineE(){try{return cheieDe(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}}
const peEcran=()=>!!(curent&&curent.body&&document.body.contains(curent.body)&&document.querySelector('.ev5-sus'));
function laInceput(n){
  goleste(n);
  if(!peEcran()){redeseneaza();return}
  let dus=false;
  try{if(window.JocMotor&&JocMotor.test&&typeof JocMotor.test.exercitiu==='function'){JocMotor.test.exercitiu(0);dus=true}}catch(e){dus=false}
  if(!dus||!peEcran()||curent.id!==primul())ST.nota=n+' Pagina nu te-a putut duce singură la prima cerință: apasă „Încă un exercițiu” până ajungi la C1.';
  redeseneaza();
}
/* elevul s-a schimbat față de cel de la prima verificare? atunci proba începe din nou (întoarce true dacă a golit-o) */
function schimbatElevul(k){
  if(!inceputa()||!ST.cine||k===ST.cine)return false;
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe din nou, de la C1.');return true}
addEventListener('prezenta',e=>{schimbatElevul(cheieDe(e&&e.detail))});
const SEMN='ev5_proba_golita';
addEventListener('pagehide',e=>{try{if(inceputa()&&!(e&&e.persisted))sessionStorage.setItem(SEMN,'1')}catch(x){}});
try{if(sessionStorage.getItem(SEMN)){sessionStorage.removeItem(SEMN);
  ST.nota='Pagina a pornit din nou (după înscrierea în caseta de jos sau după o reîncărcare), iar proba de antrenament începută s-a golit: nimic nu se păstrează. Începe de la C1.'}}catch(e){}
function elevulAcelasi(api){
  if(schimbatElevul(cineE())){api.feedback('bad','<strong>S-a schimbat elevul din caseta de jos.</strong> Proba a început din nou, de la C1.');return false}
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
  let h=`<p><b>Ai verificat toate cele ${ids().length} cerințe ale probei de antrenament.</b></p>
<table><tr><th>Partea</th><th>Puncte</th></tr>${ord.map(k=>`<tr><td>${k} · ${esc(CFG.parti[k].nume)}</td><td>${P[k].luat} din ${P[k].max}</td></tr>`).join('')}<tr><td>din oficiu</td><td>${CFG.oficiu}</td></tr><tr><th>Punctajul</th><th>${tot} din 100</th></tr></table>
<p>Nota pe antrenament: ${tot<20?tot+' puncte':tot+' de puncte'} au ${zeci===1?'o zece':zeci+' zeci'}, iar ultima cifră e ${u}${u>=5?`, de la 5 la 9: nota ${zeci} + 1 = <b>${n}</b>`:`, sub 5: nota <b>${n}</b>`}. Nivelul, din notă: <b>${nivel(n)}</b>.</p>`;
  const rate=pierdute();
  if(rate.length){
    const pierd=ord.map(k=>({k,p:P[k].max-P[k].luat})).sort((a,b)=>b.p-a.p);
    h+=`<p>Cele mai multe puncte le-ai pierdut la partea <b>${pierd[0].k}</b> (${pierd[0].p} din ${P[pierd[0].k].max}).</p>
<details open><summary>Unde ai pierdut puncte și ce recitești</summary><p>Testele de mai jos <b>n-au trecut</b> la prima verificare:</p><ul>${rate.map(x=>`<li>${esc(x.id)} · ✗ ${x.ce} (0 din ${x.puncte} p)${x.lectia?` — recitește ${x.lectia}`:''}.</li>`).join('')}</ul></details>`;
  }else h+=`<p>Ai luat toate punctele din prima.</p>`;
  return h+`<p class="ev5-nota">E nota pe antrenament: cerințele și punctele lor sunt ale paginii. Nota adevărată o dă profesorul, la lucrare.</p>`;
}
function finalJos(){
  document.querySelectorAll('.ev5-final').forEach(x=>x.remove());
  if(!completa())return;
  const fb=document.getElementById('fb');if(!fb||!fb.parentNode)return;
  const el=document.createElement('div');el.className='ev5-panou ev5-final';el.setAttribute('role','status');el.innerHTML=rezumatHTML();
  fb.parentNode.insertBefore(el,fb.nextSibling);
}
function panouHTML(id){
  const it=item(id),k=nrItem(id),N=ids().length;
  let h=`<div class="ev5-cap"><p><span class="ev5-et">${esc(CFG.titlu)}</span> · nu intră în catalog · cerința ${k} din ${N}: ${esc(id)}, partea ${esc(it.parte)} (${it.puncte} p)</p>
<button type="button" class="btn ghost sm ev5-alt">Sunt alt elev / Încep din nou</button></div>`;
  if(ST.nota)h+=`<p class="ev5-nota">${esc(ST.nota)}</p>`;
  const facute=ids().filter(x=>ST.prima[x]);
  if(!facute.length)h+=`<p>Fă toată cerința, apoi apasă <b>Verifică</b>.</p>`;   // v3: mai scurt (durata, J2 S); regula e în intro
  else if(!completa()){const l=facute.reduce((s,x)=>s+luate(x),0),m=facute.reduce((s,x)=>s+item(x).puncte,0);
    h+=`<p>Până acum (${facute.length} din ${N} cerințe): ${l} din ${m} p.</p>`}   // v2: doar suma (durata, J1-5); pe cerințe, în rezumatul final
  if(completa())h+=rezumatHTML();
  return h;
}
const leagaAlt=el=>{const b=el.querySelector('.ev5-alt');if(b)b.onclick=()=>laInceput('Proba începe din nou, de la C1. Ce era pe ecran s-a golit.')};
function panou(id,body){
  css();
  document.querySelectorAll('.ev5-sus').forEach(x=>x.remove());
  const el=document.createElement('div');el.className='ev5-panou ev5-sus';el.setAttribute('role','region');el.setAttribute('aria-label','Proba de antrenament');
  el.innerHTML=panouHTML(id);
  if(body.parentNode)body.parentNode.insertBefore(el,body);
  leagaAlt(el);finalJos();return el;
}
function redeseneaza(){
  if(!completa())document.querySelectorAll('.ev5-final').forEach(x=>x.remove());
  if(!curent)return;const el=document.querySelector('.ev5-sus');if(el){el.innerHTML=panouHTML(curent.id);leagaAlt(el)}
  if(curent.body&&document.body.contains(curent.body)&&!ST.prima[curent.id]){
    curent.body.querySelectorAll('.ev5-puncte').forEach(x=>x.remove());
    const r=curent.body.querySelector('.bw');if(r&&curent.ascunde)curent.ascunde()}
  finalJos();
}
/* blocul „Punctele cerinței X, de la prima verificare”, sub lista testelor (sau sub variante) */
function blocPuncte(id,body,dupa){
  body.querySelectorAll('.ev5-puncte').forEach(z=>z.remove());
  const p=ST.prima[id];if(!p||!dupa||!dupa.parentNode)return;
  const el=document.createElement('div');el.className='ev5-puncte';el.setAttribute('role','status');
  /* versiunea 2 (durata, J1-5): doar testele pierdute; cele trecute se văd bifate în lista de dedesubt */
  const rai=p.teste.filter(t=>!t.ok);
  el.innerHTML=`<p><b>Punctele cerinței ${esc(id)}, de la prima verificare: ${luate(id)} din ${item(id).puncte} p.</b>${rai.length?' Rămân așa; ce repari acum e exercițiu.':''}</p>`
    +(rai.length?`<ul>${rai.map(t=>`<li class="rau"><span class="s">✗</span> <b>0 din ${t.puncte} p</b> · ${t.ce}${t.motiv?` <span class="ev5-de">— ${esc(t.motiv)}</span>`:''}</li>`).join('')}</ul>`:'');
  dupa.parentNode.insertBefore(el,dupa.nextSibling);
}

/* ---------------- formele răspunsurilor scrise (versiunea 2: J1-2, M-3 — un răspuns corect scris altfel nu pierde puncte,
   iar un răspuns fals nu le ia) ---------------- */
const FN=s=>' '+String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9@]+/g,' ').trim()+' ';
const RE={};const re=x=>RE[x]||(RE[x]=new RegExp(x));
function potriveste(text,f){
  const t=FN(text);if(!t.trim()||!f)return false;
  if(!(f.toate||[]).every(g=>[].concat(g).some(x=>re(x).test(t))))return false;
  return !(f.fara||[]).some(x=>re(x).test(t));
}
const NICIUNA='zzqnicioformabunazzq';   // nu apare în niciun text normalizat al elevului care răspunde la cerință
/* prescurtările obișnuite ale lunilor pe care BrowserSiguranta.potrivesteData (V/16, primele 3 litere ale numelui) nu le
   prinde: noiembrie → „nov”. Aceeași formă ca acolo: ziua (cu 0 în față sau nu), luna (prefixul + orice litere), anul. */
const LUNI_PRESC={11:['nov']};
function dataPrescurtata(text,dn){
  if(!dn)return false;const [z,l,a]=dn,alt=LUNI_PRESC[l];if(!alt)return false;
  const t=FN(text);return alt.some(p=>new RegExp(' 0?'+z+' '+p+'[a-z]* '+a+' ').test(t));
}
/* în COPIA unui test cu `forme`, `are` se calculează din textul de acum (caseta / Notepad), în forma cerută de simulatorul
   de bază: la 'raspuns' — o listă de bucăți (trece dacă una e în casetă); la 'np' — o listă de grupuri (trece dacă toate) */
function cuForme(c,body){
  if(!c||!c.forme||(c.k!=='raspuns'&&c.k!=='np'&&c.k!=='fisa'))return c;
  const textul=()=>{try{const S=body._sim.stare();return c.k==='np'?(((S.bs||{}).np||{}).text||''):(S.rasp||'')}catch(e){return ''}};
  /* 'fisa' (browser-siguranta.js, V/16: autorul și data paginii de pe ecran, în caseta de răspuns): testul de bază rămâne
     întreg; `forme` (de obicei doar `fara`) îl mai poate opri: lista paginilor permise, `a`, devine goală dacă textul are o
     formă interzisă (ex. „Ion Stan”, fotograful de la C3, în loc de „Ioana Stan”) */
  if(c.k==='fisa'){const a0=c.a,p0=c.parte||'ambele';Object.defineProperty(c,'a',{configurable:true,enumerable:true,get(){
    const t=textul();return (!String(t).trim()||potriveste(t,Object.assign({toate:[]},c.forme)))?a0:[NICIUNA]}});
    /* versiunea 3 (reparația 2, judecata 2 U): data cu luna prescurtată pe care BrowserSiguranta.potrivesteData n-o știe
       („2 nov 2025”: el caută „noi…”) — data o verific eu (dataPrescurtata), iar testul de bază verifică atunci doar autorul */
    if(p0==='ambele')Object.defineProperty(c,'parte',{configurable:true,enumerable:true,get(){
      try{const S=body._sim.stare(),f=S.tabs[S.act],p=f&&S.W?S.W[f.h[f.p]]:null,r=S.rasp||'';
        if(p&&p.dataN&&!BSig.potrivesteData(r,p.dataN)&&dataPrescurtata(r,p.dataN))return 'autor'}catch(e){}
      return p0}});
    return c}
  Object.defineProperty(c,'are',{configurable:true,enumerable:true,get(){
    const t=textul(),ok=potriveste(t,c.forme);
    return c.k==='raspuns'?(ok?[t]:[NICIUNA]):(ok?[]:[[NICIUNA]]);
  }});
  return c;
}

/* ---------------- învelișul browserelor (probaweb, probasalv) ---------------- */
function amprenta(body){
  const sim=body._sim;if(!sim)return null;let S;try{S=sim.stare()}catch(e){return null}
  const b=S.bs||{},np=b.np||{};
  try{return JSON.stringify([S.tabs.map(t=>t.h.slice(0,t.p+1)),S.act,S.inchisa,S.cautari,S.rasp,S.inchise,S.capcane||0,S.inchiseFalse||0,
    (b.salvate||[]).length,np.text||'',np.fisier||'',S.inapoi,S.inainte,S.reimp,Object.keys(S.filtru||{}).length])}catch(e){return null}
}
function deschisa(body){try{const b=body._sim.stare().bs;return !!(b&&(b.dlg||b.conf||b.meniu))}catch(e){return false}}
function puncteBrowser(checks,body){
  const sim=body._sim;
  const r=checks.filter(c=>c.puncte!=null).map(c=>{let ok=false;try{ok=!!sim.test(c)}catch(e){ok=false}
    return {ce:c._ce||c.ce,puncte:+c.puncte||0,ok,paza:!!c.paza,lectia:c.lectia||'',motiv:''}});
  const lucru=r.some(x=>!x.paza&&x.ok&&x.puncte>0);
  r.forEach(x=>{if(x.paza&&x.ok&&!lucru){x.ok=false;x.motiv='se punctează doar împreună cu restul cerinței, iar din ea n-a trecut încă nimic'}});
  return {teste:r.map(({paza,...x})=>x)};
}
/* versiunea 4 (reparația 3): ALEGEREA sub browser (Q.alege). Întoarce funcția care pune pe ecran alegerea din starea
   browserului (S.rasp = textul variantei) și, după prima verificare, motivul ei. */
function alegeSub(Q,body,api,id){
  const A=Q.alege,root=body.querySelector('.bw');if(!A||!root||!(A.o||[]).length)return null;
  const idx=A.o.map((_,k)=>k),ord=A.amesteca===false||!api.shuffle?idx:api.shuffle(idx);
  const el=document.createElement('div');el.className='bw-panou ev5-alege';
  el.innerHTML=`<p class="lbl" id="ev5-al-${esc(id)}">${esc(A.eticheta||'Alege varianta:')}</p>
<div class="opts" role="group" aria-labelledby="ev5-al-${esc(id)}">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${esc(A.o[k])}</button>`).join('')}</div>
<p class="ev5-motiv" role="status" hidden></p>`;
  root.insertBefore(el,root.querySelector('.bw-ext'));
  const ales=()=>{let r='';try{r=body._sim.stare().rasp||''}catch(e){r=''}return A.o.indexOf(r)};
  function sync(){
    if(!document.body.contains(el))return;
    const k=ales();
    el.querySelectorAll('.opt').forEach(b=>{const on=+b.dataset.k===k;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
    const m=el.querySelector('.ev5-motiv'),arat=!!ST.prima[id]&&k>=0;
    m.hidden=!arat;m.className='ev5-motiv'+(arat?(k===A.ok?' ok':' rau'):'');
    m.innerHTML=arat?`<b>${k===A.ok?'✓':'✗'}</b> ${esc((A.motive||[])[k]||'')}`:'';
  }
  el.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||!el.contains(b)||api.done&&api.done())return;
    try{body._sim.run([['raspuns',A.o[+b.dataset.k]]],false)}catch(x){}
    sync();try{b.focus({preventScroll:true})}catch(x){}});
  /* „Ia-o de la capăt” (browser-web.js golește starea, deci și răspunsul) */
  root.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-reset]'))setTimeout(sync,0)});
  sync();return sync;
}
function invelis(baza){
  return {
    render(Q,body,api){
      css();
      const id=Q.proba;
      if(!cunoscut(id))return baza.render(Q,body,api);
      curent={id,body};
      /* o copie a lui Q, cu textele `ceInainte` până la prima verificare (testele rămân aceleași obiecte de verificat) */
      const checks=(Q.checks||[]).map(c=>cuForme(Object.assign({},c,{_ce:c.ce,ce:(!ST.prima[id]&&c.ceInainte)?c.ceInainte:c.ce}),body));
      const Q2=Object.assign({},Q,{checks});
      let a0=null,syncAl=null;
      const api2=Object.assign({},api,{
       revealButton:fn=>api.revealButton(()=>{fn();if(syncAl)syncAl()}),
       checkButton:(fn,label)=>api.checkButton(()=>{
        if(!elevulAcelasi(api))return;
        if(!ST.prima[id]){
          if(deschisa(body)){api.feedback('bad','<strong>Meniul imaginii sau fereastra „Salvare ca” e încă deschisă.</strong> Termină salvarea (Salvare) sau închide fereastra (Anulare), apoi apasă din nou „Verifică”. Abia atunci se socotesc punctele.');return}
          if(amprenta(body)===a0){api.feedback('bad','<strong>Încă n-ai lucrat nimic la cerința asta.</strong> Fă ce cere, apoi apasă „Verifică”. Punctele se socotesc la prima verificare.');return}
          pune(id,puncteBrowser(checks,body));
          checks.forEach(c=>{c.ce=c._ce});   // de acum, textele adevărate
          arata();redeseneaza();
        }
        fn();
        blocPuncte(id,body,lista()&&lista().closest('.bw-panou'));
        if(syncAl)syncAl();   // v4: după prima verificare, motivul variantei alese
      },label)});
      baza.render(Q2,body,api2);
      a0=amprenta(body);
      syncAl=Q.alege?alegeSub(Q,body,api,id):null;body.__ev5Sync=syncAl;
      /* Enter în caseta de răspuns: NU verifică (J1-3). Ascultătorul stă pe corpul exercițiului, în faza de captură, deci
         ajunge înaintea celui din browser-web.js (pe .bw, la ridicare în sus); îl pun o singură dată pe element. */
      const rad=body.querySelector('.bw');if(rad)rad.setAttribute('data-ev5-proba',id);
      if(!body.__ev5Enter){body.__ev5Enter=true;
        body.addEventListener('keydown',e=>{
          const t=e.target;if(e.key!=='Enter'||!t||!t.classList||!t.classList.contains('bw-rasp'))return;
          if(!(t.closest&&t.closest('.bw[data-ev5-proba]')))return;
          e.preventDefault();e.stopPropagation();
          api.feedback('ev5-info','<strong>Enter nu verifică aici.</strong> Când ai făcut toată cerința, apasă butonul <b>Verifică</b>, de sub browser.');
        },true)}
      const root=()=>body.querySelector('.bw'),lista=()=>body.querySelector('.bw-teste');
      const lbl=()=>{const l=lista();return l&&l.parentNode?l.parentNode.querySelector('.lbl'):null};
      function ascunde(){const r=root();if(r)r.classList.add('ev5-ascuns');const l=lbl();if(l)l.textContent='Ce se verifică (bifele și punctele apar după prima verificare)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=true}
      function arata(){const r=root();if(r)r.classList.remove('ev5-ascuns');const l=lbl();if(l)l.textContent='Testele cerinței, acum (pentru exercițiu: punctele nu se mai schimbă)';
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=false}
      curent.ascunde=ascunde;
      panou(id,body);
      if(ST.prima[id]){arata();blocPuncte(id,body,lista()&&lista().closest('.bw-panou'))}else ascunde();
    },
    rezolva(Q,body){const r=baza.rezolva(Q,body);if(body.__ev5Sync)body.__ev5Sync();return r},
    gresit(Q,body){const r=baza.gresit(Q,body);if(body.__ev5Sync)body.__ev5Sync();return r}
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

/* ---------------- clasarea cu puncte pe rânduri (probaclasa) ---------------- */
const clasare={
  render(Q,body,api){
    css();
    const id=cunoscut(Q.proba)?Q.proba:null,pr=+Q.puncteRand||0;
    if(id){curent={id,body,ascunde:null};panou(id,body)}
    const alese=Q.items.map(()=>null);
    body.innerHTML=`<div class="cls">${Q.items.map((it,k)=>`<div class="cls-row" data-k="${k}"><span class="val">${esc(it[0])}</span><span class="seg" role="group" aria-label="Răspunsul pentru: ${esc(it[0])}">${Q.cats.map((c,ci)=>`<button type="button" data-c="${ci}" aria-pressed="false">${esc(c)}</button>`).join('')}</span></div>`).join('')}</div>`;
    const aj=document.querySelector('.ajutor');if(aj&&id&&!ST.prima[id])aj.hidden=true;
    body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k;
      row.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(api.done())return;alese[k]=+b.dataset.c;
        row.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});row.classList.remove('wrong','right')})});
    if(id&&ST.prima[id])blocPuncte(id,body,body.querySelector('.cls'));
    const nav=api.checkButton(()=>{
      if(id&&!elevulAcelasi(api))return;
      if(alese.some(c=>c===null)){api.feedback('bad','<strong>Mai ai rânduri fără răspuns.</strong> Alege câte unul pe fiecare rând, apoi apasă „Verifică”.');return}
      if(id&&!ST.prima[id]){
        pune(id,{teste:Q.items.map((it,k)=>({ce:'„'+esc(it[0])+'”',puncte:pr,ok:alese[k]===it[1],lectia:Q.lectia||'',motiv:''}))});
        const a=document.querySelector('.ajutor');if(a)a.hidden=false;
        redeseneaza();
      }
      let rai=0;
      body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k,ok=alese[k]===Q.items[k][1];row.classList.toggle('wrong',!ok);row.classList.toggle('right',ok);if(!ok)rai++});
      if(id)blocPuncte(id,body,body.querySelector('.cls'));
      if(!rai){nav.innerHTML='';api.resolve(true);return}
      api.resolve(false,`${rai} ${rai===1?'rând are':'rânduri au'} răspunsul greșit (marcate cu roșu). Schimbă-l și apasă din nou „Verifică”.`);
      api.revealButton(()=>{body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k;row.classList.remove('wrong');row.classList.add('right');
        row.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.c===Q.items[k][1]))});nav.innerHTML='';api.giveUp('răspunsurile bune sunt marcate acum.')});
    });
  },
  rezolva(Q,body){Q.items.forEach((it,k)=>{const b=body.querySelector(`.cls-row[data-k="${k}"] button[data-c="${it[1]}"]`);if(b)b.click()});return true},
  gresit(Q,body){Q.items.forEach((it,k)=>{const c=k===0?(it[1]+1)%Q.cats.length:it[1];const b=body.querySelector(`.cls-row[data-k="${k}"] button[data-c="${c}"]`);if(b)b.click()});return true}
};

window.EvalInternetV={
  versiune:4,SITE,L17,
  test(c){const body=(curent&&curent.body)||document.getElementById('body');if(!body||!body._sim||!c)return null;
    try{return !!body._sim.test(cuForme(Object.assign({},c),body))}catch(e){return null}},
  forme:(text,f)=>potriveste(text,f),
  configureaza(c){CFG=Object.assign({},CFG,c||{});return CFG},
  browser:BrowserEv,
  probaBrowser:invelis(BrowserEv),
  probaSalvare:SimBS?invelis(cuStil(SimBS)):null,
  alegere,clasare,
  stare:()=>JSON.parse(JSON.stringify({prima:ST.prima,ora:ST.ora,cine:ST.cine,completa:completa(),parti:peParti()})),
  goleste:()=>laInceput('Proba începe din nou, de la C1.'),
  nota,nivel,
  puncte:id=>luate(id)
};
})();
