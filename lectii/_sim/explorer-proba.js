/* lectii/_sim/explorer-proba.js — PROBA DE ANTRENAMENT, cu punctaj pe părțile C / B / A, peste Explorer-ul simulat al
   clasei a V-a (lecția V · M2 · nr. 12, „Evaluare sumativă: sistemul de operare”, 12.10.2026). PROPRIETAR: autorul lecției V/12.
   Model: lectii/_sim/wordobj-proba.js (VII/10) și excelx-test.js (VIII/13): aceleași reguli de punctaj, aceeași legătură cu
   rezultat-elev.js. NU modifică motorul (jocuri/_motor/*), explorer-operatii.js (V/10), explorer-citire.js (V/9),
   explorer-organizare.js (V/11), rezultat-elev.js sau prezenta.js: învelește SimExplorerOperatii prin interfața lui publică
   (render / rezolva / gresit pe un element AL MEU, mânerul el._exo.s, window.ExplorerOperatii.model).

   ÎNCĂRCARE (după motor.js și explorer-operatii.js):
     <script src="../../_sim/rezultat-elev.js"></script> <script src="../../_sim/explorer-proba.js"></script>
     ExplorerProba.configureaza({cheie:'v-m2-l12-proba', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C',parte:'C',puncte:40},…]});
     tipuri:{probaexp:ExplorerProba.explorer, probaalege:ExplorerProba.alegere}

   EXERCIȚIUL Explorer (t:'probaexp'): configurația lui SimExplorerOperatii (fs, unitati, doc, start, cos, extensii…, solutie,
   gresit) FĂRĂ checks, plus:
     proba:'C'                   id-ul itemului din configureaza;
     teste:[{ce, ceInainte?, puncte, lectia?, paza?, <verificarea>}]   lista MEA de teste (nu cea a lui explorer-operatii, care
                                 nu deosebește copierea de mutare și compară numele fără majuscule):
       folderNou:cale            folderul există ȘI e făcut acum (id nou): un folder vechi redenumit nu trece; numele
                                 scris EXACT ca în cerință, cu literele mari ale ei (reparare J1-6, 12.10.2026: pasul 6 cere
                                 „literă cu literă”; Windows primește și „proiect”, dar la lucrare se verifică numele cerut);
       copiat:{din,in}           în folderul `in` e un fișier NOU cu numele lui `din` și cu aceeași dată și dimensiune;
       copiatSiPastrat:{din,in}  în `in` ȘI în `din` e câte un fișier cu numele, data și dimensiunea originalului, oricare ar
                                 fi id-ul (J1-7: „mut, apoi pun o copie înapoi” dă în Windows exact rezultatul copierii);
       mutat:{din,in}            în `in` e fișierul `din` (același id sau aceeași dată și dimensiune: copiat, apoi originalul
                                 șters = același rezultat), iar în locul vechi nu mai e (mutare, nu copiere);
       numit:{din,nou}           fișierul `din` are acum calea `nou` (la fel: același fișier, iar vechiul nume nu mai e; numele cu
                                 extensia lui: o extensie scrisă în plus, „x.png.png”, nu trece; numele scris EXACT, ca la folderNou);
       inCos:cale                chiar fișierul acela e în Coș și nu mai e în folder;
       neatins:cale              e la locul lui, același fișier ca la început;
       cosNeatins:true           fișierele altora au rămas în Coș;
       doar:{folder, ce:[căi]}   sub `folder` e exact lista (nimic în plus, nimic lipsă);
       nimicInPlus:{folder, foldere:[căi]}   sub `folder` nu e niciun folder în afara listei și niciun fișier de două ori
                                 (aceeași dată și dimensiune): prinde „Folder nou” uitat și copiile în plus, fără să pedepsească
                                 a doua oară ce lipsește sau un nume greșit (acelea au testele lor);
       cautat:{gasit:[căi]}      o căutare din caseta „Căutați în …” a găsit cel puțin una dintre căi;
       toate:[teste]             toate.
     Căile se caută FĂRĂ majuscule, ca în Windows (unde „Imagini” și „imagini” sunt același nume; doar numele scris de elev la
     folderNou / numit trebuie să fie exact cel cerut); dar „nou” înseamnă
     id nou, „copiat” cere originalul încă acolo, iar „mutat/numit” cer ca locul vechi să fie gol, deci nimic nu trece pe
     Explorer-ul de la început (schimbi doar majusculele, ștergi tot, faci de două ori: nu câștigi nimic).
     Proba: lectii/v/m2-l12/_proba/proba_logica.py (ultima linie 0).
     paza:true                   punctele lui se dau DOAR dacă a trecut și un test de lucru (cu puncte) al aceluiași exercițiu.
     pazaDupa:[i…]               (cu paza) doar dacă e FĂCUT lucrul unuia dintre testele cu indicii aceștia din `teste`
                                 (J1-5: „nimic în plus” nu se dă pentru că ai șters doar ciorna sau ai redenumit doar pisica).
                                 „Făcut” = testul trece fără cerința literelor mari (J2-7, 12.10.2026: Windows nu deosebește
                                 „proiect” de „Proiect”, deci folderul e făcut; numele greșit pierde punctele LUI, o singură dată,
                                 iar „nimic în plus”, bifat ✔, își dă punctele, ca în laborator: „doar dacă ai făcut și folderele”).
     ceInainte                   textul testului PÂNĂ la prima verificare, unde textul adevărat ar da răspunsul.
     solutieText                 ce spune „Arată-mi răspunsul”.
   EXERCIȚIUL alegere (t:'probaalege'): q, o:[…], ok, mesaje:{indice:'…'}, ce (rândul din „unde ai pierdut”), lectia, why.

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4.1-4.3; _campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md; spuse la
   clasa a V-a ca în lecția 1, pașii 6 și 8): C = De bază 40, B = Consolidat 30, A = Avansat 20, 10 din oficiu; nota =
   punctaj : 10, rotunjit după ultima cifră (0-4: numărul de zeci; 5-9: numărul de zeci + 1); nivelul se citește din notă
   (regula profesorului): 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate.

   CE FACE (ca wordobj-proba.js):
   1. Punctele unui exercițiu se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică”: suma testelor trecute atunci.
      Ce repară elevul după aceea e exercițiu. „Verifică” pe Explorer-ul NEATINS (fișierele și Coșul ca la început; doar te-ai
      plimbat sau ai căutat) nu socotește nimic și o spune.
   1b. (Reparare J1-1, 12.10.2026) Punctele primei verificări RĂMÂN, ca la lucrare, și după reîncărcarea paginii sau
      „Sunt alt elev / Încep din nou”: la fiecare exercițiu notat, starea probei în curs ({runda, scor, pierdute, complet}) se
      salvează prin RezultatElev pe cheia `<cheie>-curs` (pe numele elevului de pe scaun, după regulile componentei); la
      încărcare și la fiecare eveniment `rezultat-elev` / `prezenta`, o probă NEterminată a elevului de acum se pune la loc
      (ultima salvare a cheii). Cât așteaptă o întrebare „cine ești” (caseta componentei, #lh-rez-q, sau „Ești tot X?” din
      prezenta.js), „Verifică” NU socotește puncte: altfel o verificare făcută înainte de răspuns s-ar putea scrie peste
      prima. Rămâne posibil doar prin minciună („Nu, n-am dat-o eu”), ca în toate lecțiile cu rezultat-elev.js.
   1c. (Reparare J2-1, 12.10.2026) Ca în Windows, unde clicul în altă parte încheie redenumirea: la apăsarea pe „Verifică”
      (#chk, ascultat la CLIC, în faza de captură, deci înainte de verificare; și la începutul verificării probei), o casetă de
      nume deschisă (.exo-ren) se încheie ca la Enter (evenimentul keydown Enter pe casetă: chiar codul lui explorer-operatii.js,
      fără cele 120 ms de după blur). Se aplică la toate Explorer-ele din pagina care încarcă fișierul (și la „Încearcă”).
      Cât e deschisă o fereastră a Explorer-ului („Sigur modificați extensia?”, „Înlocuire sau omitere…”), punctele NU se
      socotesc: elevul răspunde întâi, apoi apasă iar „Verifică” (o operație neterminată nu e încă pe disc).
   2. Până la prima verificare nu se văd bifele și nici indiciul (la lucrare nu ai nici bife, nici indicii); lista rămâne ca
      „Ce se verifică”, cu textele `ceInainte`.
   3. Panoul probei, deasupra exercițiului: unde ești, punctele de până acum; la final punctajul pe părți, nota, nivelul și
      „unde ai pierdut puncte”, cu lecția de recitit; „E nota pe antrenament. Nota adevărată o dă profesorul.”
   4. Când toți itemii au puncte, rezultatul (cu un semn unic) se salvează O DATĂ prin RezultatElev.salveaza(cheie, …).
   5. Proba începe din nou de la primul item: la redeschiderea lui după o probă gata; cu „Sunt alt elev / Încep din nou”;
      când se schimbă elevul din caseta prezenta.js (regula 23). După 1b de mai sus: dacă elevul de pe scaun are o probă
      NEterminată salvată, ea se pune la loc (nu „începe din nou” cu puncte noi).
   PENTRU LECȚIA URMĂTOARE care vrea o probă pe Explorer: încarcă fișierul, configureaz-o cu cheia ei, folosește tipurile
   ExplorerProba.explorer / .alegere. Nu schimba aici numele claselor (.exp-*), cheia v-m2-l12-proba sau regulile 1-5.
   BARA DE ADRESĂ (J2-4, 12.10.2026): CSS-ul de mai jos (.exo .exo-bara, doar în paginile care încarcă fișierul) face ca
   ultimele două nume să nu se mai strângă, iar cele de la început să se strângă primele; ce nu încape se ascunde la ÎNCEPUT
   (ca în Windows); pe ecran îngust (sub 560 px) bara stă pe rândul ei, sub butoanele ← → ↑ și căutare, și ultimele TREI
   nume nu se strâng („… › Ex Pop Ana › Proiect › Imagini”, cum cere „Locul”).
   Global: window.ExplorerProba {configureaza, explorer, alegere, testeaza, puncte, nota, nivel, stare, gataNumele}.
     puncte(teste, s, M0) → {p, bife, facut}: punctele primei verificări pe starea s (aceeași funcție ca în probă; pentru probe). */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let CFG=null;
const ST={scor:{},pierdute:{},salvat:false,ultima:null,nota:'',laC1:false,runda:null};   // proba ÎN CURS (în memorie; salvată și prin RezultatElev, cheia <cheie>-curs)
let cineAcum;

const nota=p=>Math.min(10,Math.max(1,Math.floor(p/10+0.5)));
const nivel=n=>n>=9?'A · Avansat':n>=7?'B · Consolidat':n>=5?'C · De bază':n>=3?'În formare':'În dificultate';
const item=id=>CFG&&CFG.itemi.find(x=>x.id===id);
const primul=()=>CFG.itemi[0].id;
const completa=()=>!!CFG&&CFG.itemi.every(it=>ST.scor[it.id]!==undefined);
const inceputa=()=>!!CFG&&CFG.itemi.some(it=>ST.scor[it.id]!==undefined);
const pct=n=>n===1?'un punct':n<20?`${n} puncte`:`${n} de puncte`;
const golesteProba=()=>{ST.scor={};ST.pierdute={};ST.salvat=false;ST.ultima=null;ST.runda=null};
const semnNou=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
const CURS=()=>CFG.cheie+'-curs';   // proba ÎN CURS a elevului de pe scaun (regula 1b din capul fișierului)

function configureaza(c){CFG=c;css();
  const s=Object.keys(c.parti).reduce((a,k)=>a+c.parti[k].max,0)+c.oficiu;
  if(s!==100)console.warn('explorer-proba: părțile + oficiul fac',s,'nu 100');
  Object.keys(c.parti).forEach(k=>{const t=c.itemi.filter(it=>it.parte===k).reduce((a,it)=>a+it.puncte,0);
    if(t!==c.parti[k].max)console.warn('explorer-proba: partea',k,'are itemi de',t,'p, nu',c.parti[k].max)});
  try{cineAcum=JSON.stringify(window.Prezenta&&window.Prezenta.identitate?window.Prezenta.identitate():null)}catch(e){cineAcum='null'}
  try{if(window.RezultatElev){window.RezultatElev.citeste(c.cheie);window.RezultatElev.citeste(CURS())}}catch(e){}
  restaureaza();
}

/* ===== proba în curs: salvată la fiecare exercițiu notat, pusă la loc pentru elevul de pe scaun (J1-1) ===== */
function salveazaCurs(){
  if(!window.RezultatElev||!CFG)return;
  try{window.RezultatElev.salveaza(CURS(),{runda:ST.runda,scor:Object.assign({},ST.scor),pierdute:JSON.parse(JSON.stringify(ST.pierdute)),complet:completa()})}
  catch(e){console.warn('explorer-proba: salvarea probei în curs',e)}
}
function restaureaza(){
  if(!CFG||!window.RezultatElev||inceputa())return false;
  let r=null;try{r=window.RezultatElev.citeste(CURS())}catch(e){return false}
  const u=r&&(r.reincercare||r.rezultat);
  if(!u||u.complet||!u.scor||typeof u.scor!=='object')return false;
  const sc={},pi={};
  CFG.itemi.forEach(it=>{const v=u.scor[it.id];if(typeof v==='number'&&v>=0&&v<=it.puncte){sc[it.id]=v;
    pi[it.id]=u.pierdute&&Array.isArray(u.pierdute[it.id])?u.pierdute[it.id]:[]}});
  if(!Object.keys(sc).length)return false;
  ST.scor=sc;ST.pierdute=pi;ST.runda=typeof u.runda==='string'?u.runda:semnNou();ST.salvat=false;ST.ultima=null;ST.laC1=false;
  const ora=r.reincercare?r.oraReincercare:r.ora;
  ST.nota=`Proba ta e începută${ora?` (ultima verificare la ora ${esc(ora)})`:''}: punctele de la prima verificare au rămas, ca la lucrare. La exercițiile notate nu se mai socotește nimic; treci la cel următor cu <b>Încă un exercițiu</b> (apare după ce rezolvi exercițiul sau după „Arată-mi răspunsul”).`;
  return true;
}
/* cât așteaptă o întrebare „cine ești”, nu se socotește nimic (o verificare făcută înainte de răspuns s-ar putea scrie
   peste prima, la unirea făcută de rezultat-elev.js) */
function asteaptaCine(){
  try{if(document.getElementById('lh-rez-q'))return 'de pe ecran, despre cine ești (verificarea e a ta?)'}catch(e){}
  try{const c=window.RezultatElev&&window.RezultatElev.cine&&window.RezultatElev.cine();if(c&&c.stare==='intreaba')return '„Ești tot …?” din caseta cu numele tău'}catch(e){}
  return '';
}
const mesajCine=c=>`<strong>Răspunde întâi la întrebarea ${c}.</strong> Apoi apasă din nou „Verifică”: abia atunci se socotesc punctele, pe numele tău.`;

/* ================= testele, pe starea Explorer-ului ================= */
const lc=x=>String(x||'').toLocaleLowerCase('ro');
const isD=p=>p.endsWith('/');
const numeReal=p=>{const s=p.replace(/\/$/,'');return s.slice(s.lastIndexOf('/')+1)};
const sub=(p,d)=>p!==d&&p.startsWith(d);
const cheie=(M,p)=>{const t=lc(p);for(const k of M.f.keys())if(lc(k)===t)return k;return null};
const semnFis=i=>(i&&i.data||'')+'|'+(i&&i.dim||'');
const exact=(k,p)=>numeReal(k)===numeReal(p);   // numele scris de elev (ultimul nume din cale), cu literele mari ca în cerință
/* M0 = modelul de la început (aceleași id-uri ca starea de la început: modelul le dă în aceeași ordine) */
/* o.oriceLitere: fără cerința literelor mari la folderNou / numit (= lucrul e FĂCUT; pentru pazaDupa, J2-7) */
function testeaza(t,s,M0,o){
  const M=s.M,id0=p=>{const i=M0.f.get(p);return i?i.id:-1},ids0=new Set([...M0.f.values()].map(i=>i.id));
  const ex=(k,p)=>!!(o&&o.oriceLitere)||exact(k,p);
  if(t.toate)return t.toate.every(x=>testeaza(x,s,M0,o));
  if(t.folderNou){const k=cheie(M,t.folderNou);return !!k&&isD(k)&&!ids0.has(M.f.get(k).id)&&ex(k,t.folderNou)}
  if(t.copiat){const c=t.copiat,i0=M0.f.get(c.din);if(!i0)return false;
    const k=cheie(M,c.in+numeReal(c.din));return !!k&&!ids0.has(M.f.get(k).id)&&semnFis(M.f.get(k))===semnFis(i0)}
  /* copiat și păstrat: rezultatul văzut în Windows — fișierul (nume, dată, dimensiune) e în AMBELE locuri, oricare ar fi id-ul */
  if(t.copiatSiPastrat){const c=t.copiatSiPastrat,i0=M0.f.get(c.din);if(!i0)return false;
    const k=cheie(M,c.in+numeReal(c.din)),ko=cheie(M,c.din);
    return !!k&&!!ko&&k!==ko&&!isD(k)&&!isD(ko)&&semnFis(M.f.get(k))===semnFis(i0)&&semnFis(M.f.get(ko))===semnFis(i0)}
  /* mutat / numit: rezultatul se vede ca în Windows: fișierul e în locul nou (același fișier, sau unul cu aceeași dată și
     dimensiune: copiat și apoi originalul șters dă același rezultat), iar în locul vechi nu mai e */
  if(t.mutat){const i0=M0.f.get(t.mutat.din);if(!i0)return false;const k=cheie(M,t.mutat.in+numeReal(t.mutat.din));
    return !!k&&(M.f.get(k).id===i0.id||semnFis(M.f.get(k))===semnFis(i0))&&!cheie(M,t.mutat.din)}
  if(t.numit){const i0=M0.f.get(t.numit.din);if(!i0)return false;const k=cheie(M,t.numit.nou);
    return !!k&&(M.f.get(k).id===i0.id||semnFis(M.f.get(k))===semnFis(i0))&&!cheie(M,t.numit.din)&&ex(k,t.numit.nou)}
  if(t.inCos){const i0=id0(t.inCos);return !cheie(M,t.inCos)&&s.cos.some(e=>lc(e.orig)===lc(t.inCos)&&e.info&&e.info.id===i0)}
  if(t.neatins){const k=cheie(M,t.neatins);return !!k&&M.f.get(k).id===id0(t.neatins)}
  if(t.cosNeatins)return s.cos.filter(e=>e.alAltcuiva).length===s.cosInit;
  if(t.doar){const F=t.doar.folder,k=cheie(M,F);if(!k)return false;
    const are=[...M.f.keys()].filter(x=>sub(x,k)).map(lc).sort(),vrea=t.doar.ce.map(lc).sort();
    return are.length===vrea.length&&are.every((x,i)=>x===vrea[i])}
  if(t.nimicInPlus){const F=t.nimicInPlus.folder,k=cheie(M,F);if(!k)return false;
    const sub_=[...M.f.keys()].filter(x=>sub(x,k)),vrea=new Set(t.nimicInPlus.foldere.map(lc));
    if(sub_.some(x=>isD(x)&&!vrea.has(lc(x))))return false;          /* un folder în afara schemei („Folder nou”, unul pus greșit) */
    const sm=sub_.filter(x=>!isD(x)).map(x=>semnFis(M.f.get(x)));     /* același fișier de două ori (o copie în plus) */
    return new Set(sm).size===sm.length}
  if(t.cautat)return s.cautari.some(x=>x.rez.some(r=>t.cautat.gasit.some(g=>lc(g)===lc(r))));
  return false;
}
/* amprenta fișierelor și a Coșului: „neatins” = la fel ca la început (plimbarea și căutarea nu schimbă nimic) */
const amprenta=s=>{try{return JSON.stringify([[...s.M.f.entries()].map(([k,i])=>k+'#'+i.id).sort(),s.cos.map(e=>e.orig+'#'+(e.info&&e.info.id))])}catch(e){return null}};

/* lista testelor pe starea s: ok = trece; facut = trece fără cerința literelor mari (J2-7) */
const listaTeste=(teste,s,M0)=>(teste||[]).map(t=>{const ok=!!(s&&testeaza(t,s,M0));return {T:t,ok,facut:ok||!!(s&&testeaza(t,s,M0,{oriceLitere:true}))}});
/* punctele din lista de teste (testele-pază dau puncte doar împreună cu un test de lucru) */
function socotesteTeste(lista){
  let lucru=0,paza=0;const pierd=[],SUF=' (se socotește doar împreună cu lucrul cerut)';
  /* pazaDupa:[i…] = paza se dă doar dacă e FĂCUT lucrul unuia dintre testele cu indicii aceia (J1-5), orice litere (J2-7) */
  const legat=T=>!Array.isArray(T.pazaDupa)||T.pazaDupa.some(j=>lista[j]&&(lista[j].facut||lista[j].ok));
  lista.forEach(({T,ok})=>{const p=+T.puncte||0;if(!p)return;
    if(ok&&T.paza&&!legat(T)){pierd.push({ce:T.ce+SUF,puncte:p,lectia:T.lectia||''});return}
    if(ok){if(T.paza)paza+=p;else lucru+=p}else pierd.push({ce:T.ce,puncte:p,lectia:T.lectia||''})});
  const tot=lucru>0?lucru+paza:0;
  if(!lucru)lista.forEach(({T,ok})=>{if(ok&&T.paza&&legat(T)&&+T.puncte)pierd.push({ce:T.ce+SUF,puncte:+T.puncte,lectia:T.lectia||''})});
  return {tot,pierd};
}
const puncte=(teste,s,M0)=>{const L=listaTeste(teste,s,M0);return {p:socotesteTeste(L).tot,bife:L.map(x=>x.ok?1:0).join(''),facut:L.map(x=>x.facut?1:0).join('')}};
/* punctele unui exercițiu, la prima verificare */
function noteaza(it,lista){
  if(ST.laC1||ST.scor[it.id]!==undefined)return;
  const {tot,pierd}=socotesteTeste(lista);
  ST.scor[it.id]=Math.min(tot,it.puncte);ST.pierdute[it.id]=pierd;ST.nota='';
  if(!ST.runda)ST.runda=semnNou();
  salveazaCurs();salveazaDacaGata();
}
function noteazaTot(it,ok,Q){
  if(ST.laC1||ST.scor[it.id]!==undefined)return;
  ST.scor[it.id]=ok?it.puncte:0;ST.pierdute[it.id]=ok?[]:[{ce:Q.ce||Q.proba,puncte:it.puncte,lectia:Q.lectia||''}];ST.nota='';
  if(!ST.runda)ST.runda=semnNou();
  salveazaCurs();salveazaDacaGata();
}
function salveazaDacaGata(){
  if(completa()&&!ST.salvat){ST.salvat=true;const r=socoteste();ST.ultima=r;
    try{if(window.RezultatElev)window.RezultatElev.salveaza(CFG.cheie,r)}catch(e){console.warn('explorer-proba: salvarea',e)}}
}
function socoteste(){
  const parti={};Object.keys(CFG.parti).forEach(k=>parti[k]=0);
  CFG.itemi.forEach(it=>{parti[it.parte]+=ST.scor[it.id]});
  const p=Object.keys(parti).reduce((a,k)=>a+parti[k],0)+CFG.oficiu,n=nota(p);
  return {semn:semnNou(),puncte:p,nota:n,nivel:nivel(n),parti,
    itemi:Object.fromEntries(CFG.itemi.map(it=>[it.id,{p:ST.scor[it.id],max:it.puncte,pierdute:ST.pierdute[it.id]||[]}]))};
}
const REZ=()=>{try{return window.RezultatElev&&CFG?window.RezultatElev.citeste(CFG.cheie):null}catch(e){return null}};
const ASTEAPTA=()=>{try{return window.RezultatElev&&window.RezultatElev.asteaptaConfirmare&&CFG?window.RezultatElev.asteaptaConfirmare(CFG.cheie):null}catch(e){return null}};
function aLui(){
  if(!ST.ultima)return false;
  if(!window.RezultatElev)return true;
  const r=REZ(),s=ST.ultima.semn;if(!r)return false;
  return !!((r.rezultat&&r.rezultat.semn===s)||(r.reincercare&&r.reincercare.semn===s));
}

/* ================= stilul ================= */
const CSS=`.exp-panou{border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper);padding:10px 12px;margin:0 0 12px;font-size:.95rem}
.exp-panou .exp-sus{font-weight:700;margin:0 0 6px}
.exp-panou .exp-sus small{font-weight:400;color:var(--ink2)}
.exp-itemi{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0 0 6px;padding:0}
.exp-itemi li{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-family:var(--fm);font-size:.85rem;background:var(--paper2);white-space:nowrap}
.exp-itemi li.acum{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.exp-itemi li.gata{background:var(--okbg)}
.exp-panou p{margin:.35em 0}
.exp-panou .exp-final{border-top:1px dashed var(--line);margin-top:8px;padding-top:8px}
.exp-panou .exp-mare{font-size:1.05rem}
.exp-panou details{margin:.4em 0}
.exp-panou details summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-weight:600}
.exp-panou ul.exp-pierd{margin:.3em 0 .3em 1.1em;padding:0}
.exp-panou ul.exp-pierd li{margin:.2em 0}
.exp-panou .exp-salvat{background:var(--paper2);border-radius:6px;padding:6px 8px;margin:8px 0 6px}
.exp-panou .exp-alt{margin-top:4px;min-height:36px}
.exp-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.exp-teste .exp-cev{font-weight:700;font-size:.92rem;margin:0 0 4px}
.exp-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:5px}
.exp-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.92rem}
.exp-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:700;color:var(--ink2)}
.exp-teste li .pt{flex:none;margin-left:auto;font-family:var(--fm);font-size:.8rem;color:var(--ink2);white-space:nowrap;padding-left:6px}
.exp-teste li.ok .s{color:var(--ok)}
.exp-teste li.nu .s{color:var(--bad)}
.exp-reia{margin-top:8px;min-height:36px;padding:4px 12px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:.86rem;cursor:pointer}
.exp-opts{display:grid;gap:8px;margin:6px 0}
.exp-opts .opt{min-height:44px}
/* J2-4: bara de adresă a Explorer-ului din pagină — ultimele două nume întregi, începutul se strânge primul și, dacă tot nu
   încape, se ascunde la stânga (ca în Windows); bara primește mai mult loc decât căutarea; pe ecran îngust, pe rândul ei */
.exo .exo-adr .exo-bara{flex:3 1 240px;justify-content:flex-end}
.exo .exo-adr .exo-caut{flex:1 1 130px}
.exo .exo-bara .gol{flex:1 1 0;min-width:0}
.exo .exo-bara button.seg{flex:0 1 auto;min-width:24px}
.exo .exo-bara button.seg:nth-last-of-type(-n+2){flex-shrink:0;min-width:0}
@media (max-width:560px){.exo .exo-adr .exo-bara{order:3;flex:1 1 100%}
  .exo .exo-bara button.seg:nth-last-of-type(-n+3){flex-shrink:0;min-width:0}}`;
function css(){if(!document.getElementById('exp-css')){const s=document.createElement('style');s.id='exp-css';s.textContent=CSS;document.head.appendChild(s)}}

/* ================= panoul probei ================= */
const rotunjire=p=>{const z=Math.floor(p/10),u=p%10;return u>=5?`${p} are ${z} zeci, iar ultima cifră, ${u}, e de la 5 la 9: nota ${z} + 1 = <b>${z+1}</b>`:`${p} are ${z} zeci, iar ultima cifră, ${u}, e sub 5: nota <b>${z}</b>`};
const linieRez=r=>`<b>${pct(r.puncte)}</b>, nota <b>${r.nota}</b>, nivelul ${esc(r.nivel)}`;
function listaPierdute(itemi){
  if(!itemi)return '';
  const l=CFG.itemi.map(it=>({it,l:itemi[it.id]&&Array.isArray(itemi[it.id].pierdute)?itemi[it.id].pierdute:[]})).filter(x=>x.l.length);
  /* `lectia` e o legătură spre pasul de recitit (din configurația paginii); ce vine înapoi din rezultatul salvat trece
     doar dacă are chiar forma aceea, iar textul testului se scrie fără etichete */
  const leg=x=>/^<a href="\.\.\/m\d-l\d\d\/\?vezi=p\d+"( target="_blank")?( rel="noopener")?>[^<>]*<\/a>$/.test(String(x||''))?x:esc(x);
  return l.length?`<ul class="exp-pierd">${l.map(x=>x.l.map(t=>`<li><b>${esc(x.it.id)}</b>, ${pct(+t.puncte||0)}: ${esc(String(t.ce||'').replace(/<[^>]+>/g,''))}${t.lectia?`. Recitește ${leg(t.lectia)}.`:''}</li>`).join('')).join('')}</ul>`:'';
}
function textFinal(r){
  const P=Object.keys(CFG.parti).map(k=>`${k} ${r.parti[k]} din ${CFG.parti[k].max}`).join(' + ');
  const lista=listaPierdute(r.itemi);
  return `<div class="exp-final"><p class="exp-mare"><b>Punctajul probei:</b> ${P} + ${CFG.oficiu} din oficiu = <b>${pct(r.puncte)}</b>.</p>
<p>Nota: ${rotunjire(r.puncte)}. Nivelul, citit din notă după regula profesorului: <b>${esc(r.nivel)}</b>.</p>
${lista?`<details open><summary>Unde ai pierdut puncte și ce recitești</summary>${lista}</details>`:'<p>N-ai pierdut niciun punct.</p>'}
<p class="hint">E nota pe antrenament. Nota adevărată o dă profesorul, la lucrare.</p></div>`;
}
function textSalvat(){
  const r=REZ();
  if(r&&r.rezultat&&typeof r.rezultat.puncte==='number'){
    const re=r.reincercare&&typeof r.reincercare.puncte==='number'?r.reincercare:null;
    const eAcum=completa()&&ST.ultima&&r.rezultat.semn===ST.ultima.semn;
    const lista=eAcum?'':listaPierdute(r.rezultat.itemi);
    return `<div class="exp-salvat"><b>Prima ta probă${r.ora?`, de la ora ${esc(r.ora)}`:''}:</b> ${linieRez(r.rezultat)}. Ea rămâne punctul tău de pornire.${lista?`<details><summary>Unde ai pierdut puncte la prima probă</summary>${lista}</details>`:''}${re?`<br><b>Ultima reîncercare${r.oraReincercare?`, de la ora ${esc(r.oraReincercare)}`:''}:</b> ${linieRez(re)}.`:''}</div>`;
  }
  const a=ASTEAPTA();
  if(a)return `<div class="exp-salvat">Pe calculator e proba lui <b>${esc(a.elev)}</b>, de la ora <b>${esc(a.ora)}</b>. Dacă ești ${esc(a.elev)}, apasă sus „Da” ca s-o vezi.</div>`;
  return '';
}
function deseneaza(el,id){
  if(!el||!el.isConnected||!CFG)return;
  if(completa()&&ST.ultima&&!aLui()){golesteProba();
    ST.nota='Rezultatul probei nu se mai arată aici: pagina nu știe dacă ești tot elevul care a dat-o. Dacă ești tu, răspunde sus la întrebare și îl vezi mai jos, la „Prima ta probă”.'}
  const it=item(id),P=CFG.parti[it.parte],scorat=ST.scor[id]!==undefined;
  const chips=CFG.itemi.map(x=>{const s=ST.scor[x.id];return `<li class="${x.id===id?'acum':''}${s!==undefined?' gata':''}">${esc(x.id)} ${s!==undefined?s:'—'}/${x.puncte}</li>`}).join('');
  let h=`<p class="exp-sus">Proba de antrenament · ${esc(it.id)}: partea ${esc(it.parte)} · ${esc(P.nume)}, ${pct(it.puncte)} <small>(${CFG.itemi.length} exerciții: ${pct(Object.keys(CFG.parti).reduce((a,k)=>a+CFG.parti[k].max,0))} + ${CFG.oficiu} din oficiu)</small></p>
<ul class="exp-itemi" aria-label="Punctele pe exerciții">${chips}</ul>`;
  if(ST.nota)h+=`<p class="hint">${ST.nota}</p>`;
  if(ST.laC1&&id!==primul())h+=`<p><b>Proba nouă începe de la ${esc(primul())}.</b> Aici nu se socotesc puncte. Treci la ${esc(primul())} cu <b>Încă un exercițiu</b> (apare după ce rezolvi exercițiul sau după „Arată-mi răspunsul”).</p>`;
  else if(!scorat)h+=`<p>Fă toate cerințele, apoi apasă <b>Verifică</b>. Punctele se socotesc la <b>prima</b> apăsare. Abia după ea vezi bifele testelor și indiciul, ca la lucrare. Dacă apeși înainte să schimbi ceva, nu se socotește nimic.</p>`;
  else{const l=ST.pierdute[id]||[];
    h+=`<p>La ${esc(id)} ai primit <b>${ST.scor[id]} din ${it.puncte}</b>${l.length?'':' (tot)'}: socotite la prima verificare. Poți repara mai departe, dar punctele rămân.${!completa()?' Apoi treci la exercițiul următor.':''}</p>`}
  if(completa()&&ST.ultima)h+=textFinal(ST.ultima);
  h+=textSalvat();
  h+=`<div data-rezultat-elev-intrebare></div><button type="button" class="btn ghost sm exp-alt">Sunt alt elev / Încep din nou</button>`;
  el.innerHTML=h;
  el.querySelector('.exp-alt').onclick=()=>{
    try{if(window.RezultatElev){window.RezultatElev.golesteAlElevuluiDeAcum(CFG.cheie);window.RezultatElev.golesteAlElevuluiDeAcum(CURS())}}catch(e){}
    laInceput('Proba de pe ecran nu mai e a nimănui. Dacă ai o probă începută, răspunde la întrebarea despre cine ești: punctele ei se pun la loc. Altfel, proba începe de la primul exercițiu.');
    if(restaureaza())redeseneaza();
  };
}
let panouAcum=null;   // {el,id,refa,arata} — panoul exercițiului de pe ecran
const redeseneaza=()=>{if(panouAcum){deseneaza(panouAcum.el,panouAcum.id);if(panouAcum.refa)panouAcum.refa();
  if(panouAcum.arata&&ST.scor[panouAcum.id]!==undefined)panouAcum.arata()}};
const peEcran=()=>!!(panouAcum&&panouAcum.el&&panouAcum.el.isConnected);
function mergiLaC1(){
  try{const s=window.JocMotor&&JocMotor.test&&JocMotor.test.stare&&JocMotor.test.stare();
    if(s&&s.mode==='practice'&&peEcran())JocMotor.test.exercitiu(0)}catch(e){}
  if(peEcran()&&panouAcum.id===primul())return true;
  ST.nota=(ST.nota?ST.nota+' ':'')+'Pagina nu te-a putut duce singură la '+primul()+'.';redeseneaza();return false;
}
function laInceput(n){golesteProba();ST.nota=n;ST.laC1=true;if(peEcran())mergiLaC1()}
const cineE=()=>{try{return JSON.stringify(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}};
function elevNou(k){const inainte=cineAcum;cineAcum=k;
  if(!(CFG&&k!==inainte&&inceputa()&&(completa()||(inainte&&inainte!=='null'))))return false;
  if(k==='null'&&completa()){try{const s=window.Prezenta&&Prezenta.stare?Prezenta.stare():'';
    if(s!=='activ'&&s!=='intreaba'&&window.RezultatElev)window.RezultatElev.golesteAlElevuluiDeAcum(CFG.cheie)}catch(x){}}
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la primul exercițiu.');
  return true}
addEventListener('rezultat-elev',()=>{const sch=elevNou(cineE());if(restaureaza()||!sch)redeseneaza()});
addEventListener('prezenta',e=>{let k;try{k=JSON.stringify(e.detail||null)}catch(x){k='null'}const sch=elevNou(k);if(restaureaza()||!sch)redeseneaza()});

/* J2-1: caseta de nume deschisă se încheie ca la Enter (codul redenumirii din explorer-operatii.js, prin tasta lui);
   întoarce câte casete a încheiat */
function gataNumele(rad){
  let n=0;
  try{(rad||document).querySelectorAll('.exo-ren').forEach(i=>{if(!i.isConnected)return;n++;
    i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true,cancelable:true}))})}catch(e){}
  return n;
}
/* „Verifică” = clic în altă parte: în faza de captură, înainte de verificarea motorului sau a probei */
document.addEventListener('click',e=>{try{if(e.target&&e.target.closest&&e.target.closest('#chk'))gataNumele(document)}catch(x){}},true);
/* J3-1 (12.10.2026): la fel pentru orice clic / atingere ÎN Explorer (panou, bara de adresă, ↑, ←, Nou, Copiere, un rând, meniu…),
   în afara casetei de nume și a ferestrelor de dialog: numele scris se încheie ÎNTÂI ca la Enter (același drum ca „Verifică”),
   apoi gestul își face efectul (faza de captură, înaintea ascultătorilor din explorer-operatii.js, care ar anula redenumirea).
   Dacă încheierea a deschis o fereastră a Explorer-ului (nume deja folosit, extensie), gestul așteaptă: elevul răspunde întâi.
   J4-1 / J4-2 (12.10.2026, noaptea): încheierea REDESENEAZĂ Explorer-ul, deci elementul atins nu mai e în pagină (rândul vechi
   punea la loc calea veche „Folder nou”, butonul Nou vechi punea meniul în colț). Gestul vechi se oprește și se RETRIMITE
   elementului echivalent din Explorer-ul nou: același atribut (data-p, data-nav, data-c…), aceeași zonă (arbore, bară, comenzi,
   listă, meniu), același rang; calea rândului redenumit (și a celor din el) devine calea nouă.
   J4-3: același drum pentru clic dreapta cu MOUSE-ul (contextmenu). La ținut apăsat pe telefon meniul îl deschide tot
   explorer-operatii.js, iar textul scris rămâne (îl ținem în s.edit.val la fiecare literă, ca după „Nu” în fereastră); dacă
   elevul a ales între timp alt element (ținut apăsat pe el), încheierea numelui NU îi mută selecția pe folderul redenumit.
   J4-4: cât e deschisă caseta, apăsarea mouse-ului oriunde în Explorer (în afara casetei și a ferestrelor) nu mai mută
   focusul (preventDefault pe mousedown): încheierea de după blur (120 ms) nu mai redesenează înainte să ridici degetul, iar
   clicul, oricât de lung, ajunge aici. Dacă după apăsare nu vine niciun clic (tragere, buton ridicat în afara Explorer-ului),
   numele se încheie la ridicarea butonului, cu selecția pusă de tragere.
   J4-5: dacă ținta e caseta de căutare, după încheiere focusul trece în caseta de căutare nouă, cu cursorul la capăt. */
const ZONE_EXO=['.exo-mn','.exo-arb','.exo-bara','.exo-nav3','.exo-caut','.exo-cmd','.exo-lista','.exo-desk'];
const ATR_EXO=['data-p','data-cos','data-nav','data-exp','data-c','data-n','data-m','data-cos-desk'];
const gazdaExo=el=>{let b=el;while(b&&!b._exo)b=b.parentElement;return b};
function descrieTinta(t,ex){   /* ce a atins elevul, ca să-l regăsim după redesenare */
  let el=t.nodeType===1?t:t.parentElement,a=null;
  for(let x=el;x&&x!==ex;x=x.parentElement){const k=ATR_EXO.find(n=>x.hasAttribute(n));if(k){el=x;a=k;break}}
  if(!a){const ci=t.closest('.exo-ci');el=ci||(/(^|\s)exo-(lista|gol)(\s|$)/.test(el.className||'')?el:ex)}
  const z=ZONE_EXO.find(q=>{const r=el.closest(q);return r&&ex.contains(r)})||'',rad=z?el.closest(z):ex;
  if(!a){const c=el===ex?'':(el.classList.contains('exo-ci')?'.exo-ci':el.classList.contains('exo-gol')?'.exo-gol':'.exo-lista');return {z,a:null,c}}
  const v=el.getAttribute(a),L=[...rad.querySelectorAll('['+a+']')].filter(x=>x.getAttribute(a)===v);
  return {z,a,v,i:Math.max(0,L.indexOf(el))};
}
function gasesteTinta(nou,d,ren){
  const rad=d.z?nou.querySelector(d.z):nou;if(!rad)return null;
  if(!d.a)return !d.c?nou:(rad.matches(d.c)?rad:rad.querySelector(d.c));
  let v=d.v;
  if(ren&&/^data-(p|nav|exp)$/.test(d.a)&&(v===ren.from||(ren.from.endsWith('/')&&v.startsWith(ren.from))))v=ren.to+v.slice(ren.from.length);
  const L=[...rad.querySelectorAll('['+d.a+']')].filter(x=>x.getAttribute(d.a)===v);
  return L[Math.min(d.i,L.length-1)]||null;
}
function retrimite(e,el){
  const o={bubbles:true,cancelable:true,composed:true,view:window,detail:e.detail,screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,
    clientY:e.clientY,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,button:e.button,buttons:e.buttons};
  let n=null;
  try{if(window.PointerEvent&&e instanceof PointerEvent)n=new PointerEvent(e.type,Object.assign(o,{pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary}))}catch(x){}
  el.dispatchEvent(n||new MouseEvent(e.type,o));
}
/* încheie numele; dacă elevul a ales între timp ALT element (ținut apăsat pe el), selecția rămâne a lui */
function gataPastrand(ex,s){
  const p=s&&s.edit&&s.edit.p,v=s?s.sel:null;
  if(!p||v==null||v===p||(p.endsWith('/')&&String(v).startsWith(p))||!(String(v).startsWith('cos:')||(s.M&&s.M.f&&s.M.f.has(v))))return gataNumele(ex);
  Object.defineProperty(s,'sel',{configurable:true,enumerable:true,get:()=>v,set:()=>{}});
  try{return gataNumele(ex)}finally{delete s.sel;s.sel=v}
}
function inainteDeGest(e){
  const t=e.target,ex=t&&t.closest&&t.closest('.exo');
  if(!ex||t.closest('.exo-ren')||t.closest('.exo-dlg-fond'))return;
  if(!ex.querySelector('.exo-ren'))return;
  const b=gazdaExo(ex),s=b&&b._exo&&b._exo.s;   /* Explorer-ul se redesenează la Enter: starea o citim din părinte, nu din .exo vechi */
  const d=descrieTinta(t,ex),u0=s&&s.undo?s.undo.length:0;
  gataPastrand(ex,s);
  if(s&&s.dlg){e.stopPropagation();e.preventDefault();return}
  if(ex.isConnected||!b)return;   /* nu s-a redesenat nimic: gestul merge mai departe, ca înainte */
  e.stopPropagation();e.preventDefault();
  const u=s&&s.undo&&s.undo.length>u0?s.undo[s.undo.length-1]:null,nou=b.querySelector('.exo');
  const el=nou&&gasesteTinta(nou,d,u&&u.t==='ren'?u:null);
  if(!el||el.disabled)return;
  if(el.classList.contains('exo-ci')){el.focus({preventScroll:true});try{const n=el.value.length;el.setSelectionRange(n,n)}catch(x){}return}
  retrimite(e,el);
}
let ultimulIndicator='',apasare=null;
document.addEventListener('pointerdown',e=>{ultimulIndicator=e.pointerType||''},true);
document.addEventListener('click',e=>{try{inainteDeGest(e)}catch(x){}},true);
document.addEventListener('contextmenu',e=>{try{if(e.pointerType==='touch'||ultimulIndicator==='touch')return;inainteDeGest(e)}catch(x){}},true);
/* J4-4: apăsarea nu mută focusul din casetă; dacă nu urmează niciun clic în Explorer (tragere cu mouse-ul, butonul ridicat în
   afara Explorer-ului), numele se încheie la ridicarea butonului, ca în Windows, unde apăsarea în Explorer încheie redenumirea */
document.addEventListener('mousedown',e=>{try{const t=e.target,ex=t&&t.closest&&t.closest('.exo');
  if(!ex||t.closest('.exo-ren,.exo-dlg-fond')||!ex.querySelector('.exo-ren'))return;
  e.preventDefault();
  const b=gazdaExo(ex),s=b&&b._exo&&b._exo.s;apasare=s&&s.edit?{b,s,edit:s.edit}:null;
}catch(x){}},true);
document.addEventListener('mouseup',()=>{const a=apasare;apasare=null;if(!a)return;
  setTimeout(()=>{try{if(a.s.edit===a.edit&&!a.s.dlg&&a.b.isConnected&&a.b.querySelector('.exo-ren'))gataPastrand(a.b,a.s)}catch(x){}},0)},true);
document.addEventListener('input',e=>{try{const t=e.target;if(!t||!t.classList||!t.classList.contains('exo-ren'))return;
  const b=gazdaExo(t),s=b&&b._exo&&b._exo.s;if(s&&s.edit)s.edit.val=t.value}catch(x){}});
const MESAJ_FEREASTRA='<strong>Explorer-ul te întreabă ceva, în fereastra din el.</strong> Răspunde întâi acolo, apoi apasă din nou „Verifică”: abia atunci se socotesc punctele.';

/* începutul comun al unui exercițiu de probă: panoul deasupra, indiciul ascuns până la prima verificare */
function porneste(Q,body){
  const it=item(Q.proba);css();
  if(it.id===primul()){ST.laC1=false;if(completa()){golesteProba();ST.nota='Ai început o probă nouă. Prima probă rămâne salvată ca punct de pornire.'}}
  const el=document.createElement('div');el.className='exp-panou';el.setAttribute('aria-live','polite');
  return {it,el,scorat:()=>ST.scor[it.id]!==undefined};
}
const ajutorul=body=>body.parentNode?body.parentNode.querySelector(':scope > .ajutor'):null;

/* ================= exercițiul Explorer ================= */
const explorer={
  render(Q,body,api){
    const it=item(Q.proba),B=window.SimExplorerOperatii,EO=window.ExplorerOperatii;
    if(!it||!B||!EO){body.innerHTML='<p>Proba nu s-a putut încărca.</p>';return}
    const {el,scorat}=porneste(Q,body);
    const Qb=Object.assign({},Q,{checks:[]});
    const M0=EO.model(Qb);
    body.innerHTML='';body.appendChild(el);
    const inner=document.createElement('div');inner.className='exp-ex';body.appendChild(inner);
    const box=document.createElement('div');box.className='exp-teste';body.appendChild(box);
    const aj=ajutorul(body);
    const arata=()=>{if(aj)aj.hidden=false};
    if(!scorat()&&aj)aj.hidden=true;
    const T=Q.teste||[];
    let start=null,ultimeleBife=[];
    const stare=()=>inner._exo&&inner._exo.s;
    const lista=()=>listaTeste(T,stare(),M0);
    const testeHTML=()=>{const sc=scorat(),L=lista();ultimeleBife=L;
      return `<p class="exp-cev">${sc?'Testele (se bifează singure):':'Ce se verifică (bifele apar după prima apăsare pe „Verifică”):'}</p><ol>${L.map(({T:t,ok})=>
        `<li class="${sc?(ok?'ok':'nu'):''}"><span class="s" aria-hidden="true">${sc?(ok?'✔':'✘'):'○'}</span><span>${sc||!t.ceInainte?t.ce:t.ceInainte}${sc?`<span class="sr-only">${ok?' — trece':' — nu trece încă'}</span>`:''}</span><span class="pt">${t.puncte?pct(+t.puncte).replace(' de puncte',' p').replace(' puncte',' p').replace('un punct','1 p'):''}${t.paza?'*':''}</span></li>`).join('')}</ol>
${T.some(t=>t.paza)?'<p class="exo-mic" style="margin:6px 0 0">* se socotește doar împreună cu lucrul cerut.</p>':''}<button type="button" class="exp-reia">↺ Reîncep exercițiul</button>`};
    const refaLista=()=>{if(!box.isConnected)return;box.innerHTML=testeHTML();
      box.querySelector('.exp-reia').onclick=()=>{B.render(Qb,inner,api2);const s=stare();if(s){s.msg='Ai reînceput: Explorer-ul e ca la începutul exercițiului.';}refaLista();const f=inner.querySelector('.exo');if(f)f.focus({preventScroll:true})}};
    const verifica=()=>{
      gataNumele(inner);   /* J2-1: numele scris și neconfirmat se confirmă întâi (în Windows, clicul în altă parte îl încheie) */
      const s=stare();if(!s)return;
      const L=lista(),tot=L.every(x=>x.ok);
      if(ST.laC1&&it.id!==primul()){arata();refaLista();if(tot)api.resolve(true);else api.resolve(false,'Aici nu se socotesc puncte: proba nouă începe de la '+esc(primul())+'.');deseneaza(el,it.id);return}
      if(!scorat()){
        if(s.dlg){api.feedback('bad',MESAJ_FEREASTRA);const d=inner.querySelector('.exo-dlg .implicit');if(d)d.focus({preventScroll:true});return}
        if(start!==null&&amprenta(s)===start){api.feedback('bad','<strong>Explorer-ul e la fel ca la început.</strong> Punctele nu s-au socotit: fă cerințele, apoi apasă „Verifică”.');return}
        const c=asteaptaCine();if(c){api.feedback('bad',mesajCine(c));return}
        noteaza(it,L);arata();
      }
      refaLista();deseneaza(el,it.id);
      if(tot){api.resolve(true);return}
      const k=L.find(x=>!x.ok);
      api.resolve(false,`Testul care nu trece încă: ${k.T.ce}.<br><b>Puncte la ${esc(it.id)}: ${ST.scor[it.id]!==undefined?ST.scor[it.id]:0} din ${it.puncte}</b>, socotite la prima verificare. Poți repara mai departe, dar punctele rămân.`);
      const f=inner.querySelector('.exo');if(f)f.focus({preventScroll:true});
      api.revealButton(()=>{B.rezolva(Qb,inner,api2);const n=stare();if(n){n.msg='Așa arată la final: toate testele trec.';}refaLista();
        api.giveUp(Q.solutieText||'uită-te în Explorer și la testele de sub el: acum trec toate.')});
    };
    const api2=Object.assign({},api,{checkButton(fn,label){return api.checkButton(verifica,label)}});
    B.render(Qb,inner,api2);
    start=amprenta(stare());
    refaLista();
    /* lista se redesenează după fiecare desen al Explorer-ului (el își rescrie conținutul la fiecare gest) */
    try{new MutationObserver(()=>{const L=lista();if(L.some((x,i)=>!ultimeleBife[i]||x.ok!==ultimeleBife[i].ok))refaLista()}).observe(inner,{childList:true})}catch(e){}
    panouAcum={el,id:it.id,refa:refaLista,arata};deseneaza(el,it.id);
    body._exp={inner,Qb,M0,api2,refa:refaLista,teste:()=>lista()};
    if(ST.laC1&&it.id!==primul())setTimeout(()=>{if(ST.laC1&&peEcran()&&panouAcum.id===it.id)mergiLaC1()},0);
  },
  rezolva(Q,body,api){const h=body._exp;if(!h)return false;window.SimExplorerOperatii.rezolva(h.Qb,h.inner,h.api2);h.refa();return true},
  gresit(Q,body,api){const h=body._exp;if(!h)return false;window.SimExplorerOperatii.gresit(h.Qb,h.inner,h.api2);h.refa();return true}
};

/* ================= alegerea punctată (explicația de la partea A: „de ce?”) ================= */
const alegere={
  render(Q,body,api){
    const it=item(Q.proba);if(!it){body.innerHTML='<p>Proba nu s-a putut încărca.</p>';return}
    const {el,scorat}=porneste(Q,body);
    const aj=ajutorul(body);if(!scorat()&&aj)aj.hidden=true;
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.innerHTML=`<div class="exp-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
    body.insertBefore(el,body.firstChild);
    const bs=[...body.querySelectorAll('.opt')];
    const des=()=>bs.forEach(b=>{const on=+b.dataset.k===ales;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
    bs.forEach(b=>b.onclick=()=>{if(api.done())return;ales=+b.dataset.k;bs.forEach(x=>x.classList.remove('bad'));des()});
    const arataBun=()=>{bs.forEach(x=>x.disabled=true);const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.classList.add('ok')};
    const nav=api.checkButton(()=>{
      if(ales===null){api.feedback('bad','<strong>Alege întâi o variantă.</strong> Apoi apasă „Verifică”.');return}
      const ok=ales===Q.ok;
      if(!(ST.laC1&&it.id!==primul())&&!scorat()){const c=asteaptaCine();if(c){api.feedback('bad',mesajCine(c));return}noteazaTot(it,ok,Q)}
      if(aj)aj.hidden=false;
      deseneaza(el,it.id);
      if(ok){arataBun();nav.innerHTML='';api.resolve(true)}
      else{const b=body.querySelector(`.opt[data-k="${ales}"]`);if(b)b.classList.add('bad');
        api.resolve(false,((Q.mesaje&&Q.mesaje[ales])||'Varianta aleasă nu e cea bună.')+(ST.laC1&&it.id!==primul()?' <br><i>Aici nu se socotesc puncte: proba nouă începe de la '+esc(primul())+'.</i>':` <br><b>Puncte la ${esc(it.id)}: ${ST.scor[it.id]||0} din ${it.puncte}</b>, socotite la prima verificare.`));
        api.revealButton(()=>{ales=Q.ok;des();arataBun();nav.innerHTML='';api.giveUp(Q.html?Q.o[Q.ok]:esc(Q.o[Q.ok]))})}
    });
    panouAcum={el,id:it.id,refa:null,arata:()=>{if(aj)aj.hidden=false}};deseneaza(el,it.id);
    body._expAlege={pune:k=>{ales=k;des()}};
    if(ST.laC1&&it.id!==primul())setTimeout(()=>{if(ST.laC1&&peEcran()&&panouAcum.id===it.id)mergiLaC1()},0);
  },
  rezolva(Q,body){if(!body._expAlege)return false;body._expAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._expAlege)return false;body._expAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

window.ExplorerProba={configureaza,explorer,alegere,testeaza,puncte,nota,nivel,gataNumele,
  stare:()=>({scor:Object.assign({},ST.scor),completa:completa(),laC1:ST.laC1,ultima:ST.ultima?JSON.parse(JSON.stringify(ST.ultima)):null})};
})();
