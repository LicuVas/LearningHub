/* Motorul lecțiilor-joc (LearningHub/jocuri). Specificația completă: README.md din acest folder.
   Un joc = index.html cu tema lui + JocMotor.porneste({...configurație...}).
   Tipuri de întrebări incluse: choice, tf, order, classify, match, hunt, pick.
   Tipuri noi (simulatoare) vin prin config.tipuri = { nume: { render(Q, body, api), rezolva(Q, body, api) } }. */
(function(){
'use strict';
/* de unde s-a încărcat motorul: diplome-date.js, qrcode.min.js și pagina diploma/ stau lângă el */
const MOTOR_URL=(document.currentScript&&document.currentScript.src)||location.href;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const L=i=>String.fromCharCode(65+i);
function expandRange(a,b){
  const pa=a.match(/^([A-Z])(\d+)$/),pb=(b||a).match(/^([A-Z])(\d+)$/),out=[];
  const c1=Math.min(pa[1].charCodeAt(0),pb[1].charCodeAt(0)),c2=Math.max(pa[1].charCodeAt(0),pb[1].charCodeAt(0));
  const r1=Math.min(+pa[2],+pb[2]),r2=Math.max(+pa[2],+pb[2]);
  for(let c=c1;c<=c2;c++)for(let r=r1;r<=r2;r++)out.push(String.fromCharCode(c)+r);
  return out;
}

let C,S,R=null,app,hud;
const TIPURI={};          // tipurile incluse + cele din config
const REZOLVA={};         // pentru testul automat: pune răspunsul corect în pagină
const GRESIT={};          // pentru testul automat: pune un răspuns greșit tipic (simulatoare)

/* ---------------- stare ---------------- */
/* PROGRES PE ELEV (25.09.2026, el: „să poată continua fiecare de unde a rămas” pe calculatorul comun):
   progresul jocului stă pe PROFILUL activ al calculatorului (learninghub_active_profile), același pe care îl
   folosesc și lecțiile; prezenta.js pune profilul elevului înscris. Fără profil (sau „_guest”) = cheia veche.
   Prima dată pe un profil nou: dacă pe cheia veche e progresul ACESTUI elev (același nume) sau al nimănui
   (fără nume), îl mută la el - așa nu se pierde nimic la trecere. */
function profilActiv(){try{const p=localStorage.getItem('learninghub_active_profile');return p&&p!=='_guest'?p:''}catch(e){return ''}}
function cheieJoc(){const p=profilActiv();return p?C.cheie+'@'+p:C.cheie}
/* FARA DIACRITICE (01.10.2026): si literele fara forma "fara semn" in Unicode (i fara punct, l taiat, o taiat, ss...;
   "Isik" scris cu i turcesc iesea "is k"), ca in prezenta.js si AI_0\tools\litere.py (sursa); oracolul care compara
   toate copiile: AI_0\tools\tests\litere_proba.py */
const LITERE_FARA={'\u0131':'i','\u0130':'I','\u0142':'l','\u0141':'L','\u00f8':'o','\u00d8':'O','\u0111':'d','\u0110':'D','\u00f0':'d','\u00d0':'D','\u00fe':'th','\u00de':'Th','\u00df':'ss','\u00e6':'ae','\u00c6':'Ae','\u0153':'oe','\u0152':'Oe','\u0127':'h','\u0126':'H','\u0167':'t','\u0166':'T'};
const faraDiacritice=s=>String(s||'').replace(/[\u0131\u0130\u0142\u0141\u00f8\u00d8\u0111\u0110\u00f0\u00d0\u00fe\u00de\u00df\u00e6\u00c6\u0153\u0152\u0127\u0126\u0167\u0166]/g,c=>LITERE_FARA[c]).normalize('NFKD').replace(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g,'');
const normNume=s=>faraDiacritice(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').sort().join(' ');
function citesteJoc(k){try{const s=JSON.parse(localStorage.getItem(k));return s&&typeof s==='object'?s:null}catch(e){return null}}
let SK='';   // cheia din care s-a încărcat S (dacă profilul se schimbă sub joc, S se reîncarcă)
let RECITIRE=null;   // ?recitire=N (textul parametrului) cât pagina e deschisă DOAR pentru recitire; null = jocul obișnuit
function load(){
  const k=cheieJoc();SK=k;let s=citesteJoc(k);
  if(!s&&k!==C.cheie&&RECITIRE===null){   // recitirea nu mută nimic între sertare: doar citește
    const b=citesteJoc(C.cheie);let eu=null;try{eu=JSON.parse(localStorage.getItem('lh_prezenta'))}catch(e){}
    if(b&&(!b.nume||(eu&&eu.nume&&normNume(b.nume)===normNume(eu.nume)))){s=b;try{localStorage.setItem(k,JSON.stringify(b));localStorage.removeItem(C.cheie)}catch(e){}}}
  if(!s)s={nume:'',lv:{}};if(!s.lv)s.lv={};return s}
/* „Ești tot X?” pe ecran (26.09.2026, T1): la calculatorul comun poate lucra deja ALT elev. Nivelurile terminate
   cât stă întrebarea NU intră în sertarul lui X: se țin DEOPARTE în <cheie>@_tinut (doar ce e nou față de sertar).
   „Da” le trece la X (prezenta.js mutaTinut), „Nu” le dă celui care se alege (prin @_neinscris). Nici „Ia-o de la
   capăt” apăsat atunci nu atinge sertarul lui X. */
function inAsteptare(){try{return !!(window.Prezenta&&window.Prezenta.stare&&window.Prezenta.stare()==='intreaba')}catch(e){return false}}
/* TERMINAT = are stele (endLevel dă cel puțin una; „deblochează” la fel). De la 01.10.2026 o intrare FĂRĂ stele în S.lv
   înseamnă „văzut, dar neterminat” (vezi „CE FACE ELEVUL PE NIVEL” mai jos), deci nimic nu mai judecă după existența
   intrării: nici deblocarea nivelului următor, nici „toate gata”, nici numărătorile de pe ecran. */
const facut=l=>!!l&&(l.stars||0)>0;
const ordonat=o=>Object.keys(o).sort().reduce((r,k)=>(r[k]=o[k],r),{});
/* UNIREA a două intrări ale ACELUIAȘI nivel (01.10.2026): aceeași regulă ca unesteNivel din assets/js/prezenta.js și
   din teste-elevi netlify/lib/unire.mjs (proba_instrumentare.py le compară pe toate trei): stars, xp, ind, ara, sec, pn,
   at, v, fp = maximul; p1 și t0 = cel mai vechi; t1 = cel mai nou; ps = reuniunea. Cheile ies în ordine alfabetică. */
const numar=x=>typeof x==='number'&&isFinite(x)&&x>=0?x:0;
const p1Bun=p=>!!p&&typeof p==='object'&&typeof p.b==='number'&&typeof p.t==='number';
function p1Vechi(x,y){if(!p1Bun(x))return p1Bun(y)?y:null;if(!p1Bun(y))return x;return (numar(y.c)||Infinity)<(numar(x.c)||Infinity)?y:x}
function pasiUniti(a,b){const v={};[a,b].forEach(l=>{if(Array.isArray(l))l.forEach(x=>{if(typeof x==='number'&&x%1===0&&x>=0&&x<500)v[x]=1})});
  return Object.keys(v).map(Number).sort((x,y)=>x-y)}
/* 10.10.2026 (bara pașilor, pe elev): și re, qm = maximul; ul = de la intrarea mai nouă (aici: memoria, l). */
function uneNivel(p,l){
  if(!p||typeof p!=='object')return l;if(!l||typeof l!=='object')return p;
  const o=Object.assign({},p,l);
  if(p.stars!=null||l.stars!=null)o.stars=Math.max(p.stars||0,l.stars||0);
  if(p.xp!=null||l.xp!=null)o.xp=Math.max(p.xp||0,l.xp||0);
  ['ind','ara','sec','pn','at','v','fp','re','qm'].forEach(k=>{if(p[k]!=null||l[k]!=null)o[k]=Math.max(numar(p[k]),numar(l[k]))});
  const t0=[p.t0,l.t0].filter(x=>numar(x)>0),t1=[p.t1,l.t1].filter(x=>numar(x)>0);
  if(t0.length)o.t0=Math.min(...t0);else delete o.t0;
  if(t1.length)o.t1=Math.max(...t1);else delete o.t1;
  if(p.ps!=null||l.ps!=null)o.ps=pasiUniti(p.ps,l.ps);
  const p1=p1Vechi(p.p1,l.p1);if(p1)o.p1=p1;else delete o.p1;
  return ordonat(o)}
/* DOUĂ FILE CU ACELAȘI JOC (poarta de lansare, 01.10.2026): fila A, deschisă de mai demult, are în memorie (S) un
   sertar VECHI; în fila B elevul termină între timp un nivel. Dacă fila A rescrie tot sertarul din memorie, nivelul
   din fila B dispare. De aceea: save() UNEȘTE memoria cu ce e pe disc în clipa scrierii (stelele nu coboară, niciun
   nivel de pe disc nu se pierde) și ia rezultatul și în memorie; notele noi (noteaza) se scriu doar pe INTRAREA
   nivelului, citită de pe disc (scrieIn). Singurele scrieri care pot șterge sunt cerute anume: „Ia-o de la capăt” și
   „Sunt alt elev, încep de la zero” (fără prezenta.js) -> scrieBrut(). */
function scrieBrut(){if(RECITIRE!==null)return;try{localStorage.setItem(cheieJoc(),JSON.stringify(S))}catch(e){}}
function save(){if(RECITIRE!==null)return;try{   // recitirea nu scrie nimic (vezi „RECITIRE” mai jos)
  if(inAsteptare()){
    const baza=(citesteJoc(cheieJoc())||{}).lv||{},kt=C.cheie+'@_tinut',t=citesteJoc(kt)||{nume:'',lv:{}};if(!t.lv)t.lv={};
    let nou=false;
    /* aici trec doar stelele și punctele nivelurilor TERMINATE acum; restul (indicii, secunde, prima încercare…) e
       scris direct în @_tinut de noteaza(), ca diferență, și rămâne lângă ele (Object.assign păstrează ce e deja acolo) */
    for(const i in S.lv){const a=S.lv[i]||{},b=baza[i],p=t.lv[i];
      if(!facut(a))continue;
      if(b&&(a.stars||0)<=(b.stars||0)&&(a.xp||0)<=(b.xp||0))continue;
      if(p&&(a.stars||0)<=(p.stars||0)&&(a.xp||0)<=(p.xp||0))continue;
      t.lv[i]=p?ordonat(Object.assign({},p,{stars:Math.max(p.stars||0,a.stars||0),xp:Math.max(p.xp||0,a.xp||0)})):{stars:a.stars||0,xp:a.xp||0};nou=true}
    if(nou){t.u=Date.now();localStorage.setItem(kt,JSON.stringify(t))}
    return}
  const k=cheieJoc(),d=citesteJoc(k);
  if(d&&d.lv&&typeof d.lv==='object'){const lv=Object.assign({},d.lv);for(const i in S.lv)lv[i]=uneNivel(d.lv[i],S.lv[i]);S.lv=lv}   // vezi „DOUĂ FILE”
  localStorage.setItem(k,JSON.stringify(S))}catch(e){}}
function totals(lv){lv=lv||S.lv;let st=0,xp=0;for(const k in lv){st+=lv[k].stars||0;xp+=lv[k].xp||0}return{st,xp}}

/* ---------------- CE FACE ELEVUL PE NIVEL (01.10.2026, fișa elevului, R11) ----------------
   El: „să vedem la fiecare exact ce activitate are [...] cât de bine se descurcă, cât a stat, peste ce a sărit”.
   Până acum sertarul ținea pe nivel doar {stars, xp}, și doar la nivelurile terminate. Acum intrarea S.lv[i] poate avea și
   (toate opționale; sertarele vechi rămân valide și se arată exact ca înainte):
     v:1         nivelul a fost deschis. Intrare fără stars = VĂZUT, NETERMINAT; terminat = stars>0 (facut()).
     ind         de câte ori a cerut „Am nevoie de un indiciu” (în pași, în atelier și la verificare)
     ara         de câte ori a apăsat „Arată-mi răspunsul”
     p1:{b,t,c}  PRIMA verificare terminată a nivelului: b răspunsuri bune din prima, din t întrebări; c = când (ms).
                 Nu se mai schimbă (nici la reluare, nici la „Ia-o de la capăt”). Lipsește la nivelurile terminate
                 înainte de 01.10.2026: reluarea lor NU e o primă încercare (nici după „Ia-o de la capăt”, vezi fp).
     fp:1        nivelul fusese terminat FĂRĂ p1 (înainte de 01.10.2026) și a fost apoi șters cu „Ia-o de la capăt”:
                 când îl reface, nu primește p1. Pus doar de istoric().
     sec         secunde LUCRATE pe nivel, cu regula din prezenta.js: pagina în față ȘI mișcare în ultimele 2 minute
     t0, t1      prima și ultima atingere a nivelului (ms)
     ps, pn      pașii de învățat deschiși (numerele lor, de la 0) și câți pași are nivelul: pas lipsă din ps = sărit
                 (ex. „Știu deja — la verificare” de la pasul 1)
     at          0 = nivelul are atelier, nedeschis încă; 1 = atelierul a fost deschis (lipsește dacă nivelul n-are atelier)
     re          1 = pasul „Acum în aplicația adevărată” a fost văzut (10.10.2026, bara pașilor pe elev)
     qm          cea mai mare întrebare de verificare atinsă (Î1 = 1); lipsă = niciuna (10.10.2026)
     ul          ultimul pas afișat: "p3", "atelier", "real", "q2", "citire", "gata" (10.10.2026; doar informativ)
   Cheile intrării sunt scrise în ordine alfabetică (ordonat()), ca unirea din prezenta.js / unire.mjs să dea același
   text pentru același conținut (altfel fiecare tragere din nor ar părea o schimbare și ar redesena cuprinsul).
   Cât stă „Ești tot X?” pe ecran, TOT ce se notează merge în <cheie>@_tinut ca DIFERENȚĂ (indiciile și secundele de
   acum), nu în sertarul lui X: „Da” le ADUNĂ la X, „Nu” le dă celui care se alege (prezenta.js mutaJoc). Recitirea
   nu notează nimic. Cine citește datele: panoul profesorului (fișa elevului, admin.mjs) și /jurnal/. */
function puneNota(l,fn,t){if(fn(l)===false)return false;l.v=1;if(!l.t0)l.t0=t;l.t1=t;return true}
function scrieIn(k,i,fn,t,cuU){   // doar INTRAREA nivelului i din sertarul k, citit acum de pe disc; cuU: și `u` (@_tinut)
  const s=citesteJoc(k)||{nume:'',lv:{}};if(!s.lv||typeof s.lv!=='object')s.lv={};
  const l=Object.assign({},s.lv[i]);if(!puneNota(l,fn,t))return null;
  s.lv[i]=ordonat(l);if(cuU)s.u=t;localStorage.setItem(k,JSON.stringify(s));return s.lv[i]}
/* fn(l) schimbă intrarea nivelului i (întoarce false = nimic de schimbat); v, t0 și t1 se pun aici. Se scrie pe
   intrarea de pe DISC (vezi „DOUĂ FILE”), iar memoria primește intrarea scrisă (cu ce a pus între timp altă filă). */
function noteaza(i,fn){
  if(RECITIRE!==null||!C||i==null||i<0)return;
  const t=Date.now();
  try{
    if(inAsteptare()){scrieIn(C.cheie+'@_tinut',i,fn,t,true);   // `u` = când s-a lucrat ultima oară deoparte (prezenta.js)
      eraAsteptare=true;return}   // la răspuns, S se recitește din sertar (altfel o salvare de după ar șterge ce s-a mutat)
    const e=scrieIn(SK,i,fn,t);   // SK = sertarul din care e S (dacă profilul s-a schimbat sub joc, nota e tot a lui)
    if(e&&cheieJoc()===SK)S.lv[i]=e;
  }catch(e){}
}
/* SECUNDELE PE NIVEL: o bătaie la 5 s; se numără doar cu un nivel deschis (R), pagina în față și o mișcare în ultimele
   2 minute (ca prezenta.js). Se adună în memorie și intră în sertar la cel mult 3 minute, la schimbarea nivelului, la
   cuprins, la diplomă și când pagina se ascunde sau se închide (înaintea trimiterii din prezenta.js, care vine după).
   Cât stă „Ești tot X?” pe ecran, fiecare bătaie merge pe loc în @_tinut; ce era adunat dinainte e al lui X. */
let miscare=Date.now(),mutare=0,secBuf=0,secLi=-1,secScurs=Date.now();
['pointerdown','keydown','wheel','touchstart','scroll'].forEach(e=>addEventListener(e,()=>{miscare=Date.now()},{passive:true,capture:true}));
addEventListener('mousemove',()=>{const t=Date.now();if(t-mutare>2000){mutare=t;miscare=t}},{passive:true});
function scurge(alCeluiDinainte){
  if(!secBuf||secLi<0){secBuf=0;return}
  const s=secBuf,i=secLi,f=l=>{l.sec=(l.sec||0)+s};secBuf=0;secScurs=Date.now();
  if(!alCeluiDinainte&&!inAsteptare()){noteaza(i,f);return}
  /* adunate cât elevul era confirmat, dar scrise acum, când întrebarea e pe ecran sau elevul s-a schimbat (altă filă):
     sunt ale celui din care s-a încărcat S (SK), deci intră direct acolo și în S */
  if(RECITIRE!==null)return;
  try{const e=scrieIn(SK,i,f,Date.now());if(e)S.lv[i]=e}catch(e){}
}
setInterval(()=>{
  if(!C||RECITIRE!==null)return;
  if(R&&document.visibilityState==='visible'&&document.hasFocus()&&Date.now()-miscare<=120000&&cheieJoc()===SK){
    if(inAsteptare()){scurge(true);noteaza(R.li,l=>{l.sec=(l.sec||0)+5})}
    else{if(secLi!==R.li)scurge();secLi=R.li;secBuf+=5}
  }
  if(secBuf&&Date.now()-secScurs>=180000)scurge();
},5000);
addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')scurge()});
addEventListener('pagehide',()=>scurge());
/* „Ia-o de la capăt”: stelele și punctele pleacă (cuprinsul arată ca la început, ca înainte), dar ISTORICUL rămâne
   (indiciile, „Arată-mi”, prima încercare, secundele, pașii văzuți): e munca lui, iar fișa profesorului trebuie să
   spună cinstit că a mai trecut pe aici, iar p1 rămâne prima încercare, nu cea de după reluare. Un nivel terminat
   fără p1 (vechi, doar {stars, xp}) rămâne {v:1, fp:1}: pe ecran e tot „începe →”, ca înainte, dar când îl reface
   nu primește p1 (nu mai e o primă încercare). Pornește de la sertarul de PE DISC unit cu memoria (altă filă poate
   avea istoric pe care fila asta nu-l știe) și se scrie ca atare (scrieBrut), fiindcă aici stelele trebuie să plece.
   (Cu codul, maximul de stele din nor revine la următoarea tragere, tot ca înainte.) */
function istoric(lv){const o={};for(const i in lv){const l=Object.assign({},lv[i]),era=facut(l);delete l.stars;delete l.xp;
  if(era&&!p1Bun(l.p1))l.fp=1;
  if(Object.keys(l).length){l.v=1;o[i]=ordonat(l)}}return o}
function iaDeLaCapat(){
  if(inAsteptare()){S.lv=istoric(S.lv);save();return}   // cât stă „Ești tot X?”: nimic în sertarul lui X (ca înainte)
  const d=citesteJoc(cheieJoc()),lv=Object.assign({},d&&d.lv&&typeof d.lv==='object'?d.lv:{});
  for(const i in S.lv)lv[i]=uneNivel(lv[i],S.lv[i]);
  S.lv=istoric(lv);scrieBrut()}
/* CÂT STĂ „Ești tot X?” (28.09.2026, judecătorul V/1: diploma ieșea pe „Pop Ana”, cu „Trimite diploma”, iar cuprinsul
   spunea „lecția e terminată” cu 3 stele, deși lucra ALT elev). Ce se arată ca FĂCUT e doar ce e în sertarul lui X;
   ce se lucrează acum stă deoparte și se vede ca atare; diploma nu poartă numele lui X și nu se trimite până nu răspunde.
   La răspuns (evenimentul „prezenta”), S se recitește din sertar: „Da” + „Da, eu am lucrat” -> munca e acum a lui X;
   „Nu, a lucrat altcineva” / „Nu, sunt alt elev” -> munca merge la „neînscris” (prezenta.js). */
const sertarLv=()=>inAsteptare()?((citesteJoc(cheieJoc())||{}).lv||{}):S.lv;
function tinutAici(i){if(!inAsteptare())return false;const a=S.lv[i],b=sertarLv()[i];return facut(a)&&(!facut(b)||(a.stars||0)>(b.stars||0)||(a.xp||0)>(b.xp||0))}
function numeIntrebat(){try{const e=window.Prezenta&&window.Prezenta.identitate();return e?e.nume:''}catch(x){return ''}}
let eraAsteptare=false;   // s-a desenat ceva cât stătea întrebarea: la răspuns, S se recitește
const unlocked=i=>i===0||facut(S.lv[i-1]);
const starsHtml=n=>[0,1,2].map(i=>i<n?'<span class="on">★</span>':'<span>☆</span>').join('');

/* ---------------- MODUL LECȚIE (27.09.2026) ----------------
   Situl se reface: o lecție din plan = o pagină în lectii/<clasa>/m1-lNN/ = UN nivel pe pași pe motorul ăsta.
   `mod:'lectie'` în configurație schimbă DOAR ce ar spune „joc”: firimiturile (LearningHub › Lecții › Clasa a VII-a ›
   Lecția 4) și butoanele duc la pagina clasei (../index.html, „Toate lecțiile clasei”), textele spun „Lecția 4” în loc
   de „Nivelul 1 din 1”, iar după atelier vine pasul „Acum în aplicația adevărată”, ÎNAINTE de verificare (standardul
   lecției, 05_STANDARD_LECTIE.md). Conținutul lui: `aplicatieReala:{aplicatie, titlu?, intro?, pasi:[…]}` (în
   configurație sau pe nivel); fără el, `diploma.aplicatie` + `diploma.provocare`. Diploma îl repetă pe scurt.
   Opționale: `clasaSlug:'vii'` (implicit din cale /lectii/<clasa>/, apoi din `clasa`), `lectiaNr:4` (implicit din
   cheia `…_lNN`, apoi din cale, apoi din `lectii`). Fără `mod:'lectie'` nimic de aici nu se folosește. */
const eLectie=()=>!!C&&C.mod==='lectie';
function lectieInfo(){
  const pm=location.pathname.match(/\/lectii\/([a-z]+)\/m(\d+)-l(\d+)\//i),cm=String(C.clasa||'').match(/([IVX]+)/);
  const km=String(C.cheie||'').match(/_m(\d+)_l(\d+)$/);
  const slug=String(C.clasaSlug||(pm?pm[1]:cm?cm[1]:'')).toLowerCase();
  const nr=C.lectiaNr!=null?+C.lectiaNr:km?+km[2]:pm?+pm[3]:(parseInt(C.lectii,10)||'');
  return {slug,nr,modul:pm?+pm[2]:km?+km[1]:1,pm};
}
/* „Pasul 2”, „Atelier”… : unde e elevul în lecție (ultima firimitură) */
function etapaLectie(){
  const n=C.nivele.length,pre=n>1?`Partea ${R.li+1} · `:'';
  const e=R.phase==='learn'?`Pasul ${R.si+1} din ${C.nivele[R.li].pasi.length}`:R.phase==='atelier'?'Atelier':R.phase==='real'?esc(numeReal(C.nivele[R.li],'În aplicația adevărată'))
    :R.phase==='q'?'Verificare':R.phase==='end'?'Gata':'Citire';
  return pre+e;
}
/* pasul „Acum în aplicația adevărată” (doar în modul lecție și doar dacă are pași) */
function aplicatieReala(Lv){
  if(!eLectie()||!Lv)return null;
  const A=Lv.aplicatieReala||C.aplicatieReala||{},D=C.diploma||{},pasi=A.pasi||D.provocare||[];
  if(!pasi.length)return null;
  return {aplicatie:A.aplicatie||D.aplicatie||'',titlu:A.titlu||'',scurt:A.scurt||'',intro:A.intro||'',pasi};
}
/* PE TELEFON (06.10.2026, profesorul: „la fisierul xlsx care se descarca pentru a fi editat - in general nu merge editarea
   pe telefon”; o elevă vedea registrul, dar nu putea scrie în el = era deschis într-o previzualizare). Pasul „în aplicația
   adevărată” care dă un fișier de descărcat (.xlsx/.docx/.pptx) spune, pentru telefon, ce aplicație gratuită îl modifică,
   de unde se instalează și cum îl deschizi cu ea. Linkurile magazinelor verificate pe 06.10.2026 (200, titlul aplicației);
   „atinge de două ori” = ca în ghidurile cu capturi (jocuri/_ghiduri/sheets, slides). */
const APP_TEL={
  xlsx:{f:'Excel',n:'Foi de calcul Google',en:'Google Sheets',play:'com.google.android.apps.docs.editors.sheets',ios:'842849113',scrii:'Atinge <b>de două ori</b> o celulă ca să scrii în ea.'},
  docx:{f:'Word',n:'Documente Google',en:'Google Docs',play:'com.google.android.apps.docs.editors.docs',ios:'842842640',scrii:'Atinge textul ca să scrii în document (dacă vezi jos un creion, atinge-l întâi).'},
  pptx:{f:'PowerPoint',n:'Prezentări Google',en:'Google Slides',play:'com.google.android.apps.docs.editors.slides',ios:'879478102',scrii:'Atinge <b>de două ori</b> o casetă ca să scrii în ea.'}};
/* 06.10.2026, cititorul-începător (8 blocaje la prima variantă): pasul din lecție spune „deschide-l în Excel”, deci caseta spune
   deschis că PE TELEFON deschiderea se face altfel; dosarul are poza lui (captura reală, încercuită); „previzualizare” și
   „Descărcări” sunt explicate la prima folosire. */
function telefonFisier(A){
  const fis=[];String(A.pasi.join(' ')).replace(/href="([^"#?]+\.(xlsx|docx|pptx))"/gi,(m,f,x)=>{f=f.split('/').pop();if(!fis.some(e=>e.f===f))fis.push({f,x:x.toLowerCase()});return m});
  if(!fis.length)return '';
  const ghid=new URL('../ghiduri/#instalare',MOTOR_URL).href,poza=new URL('../_ghiduri/instalare/01-dosar.webp',MOTOR_URL).href;
  return fis.filter((e,i)=>fis.findIndex(o=>o.x===e.x)===i).map(e=>{const a=APP_TEL[e.x],nume=fis.filter(o=>o.x===e.x).map(o=>`<b>${esc(o.f)}</b>`).join(', ');
    return `<div class="peek reading tel-fisier" style="display:block;margin:0 0 12px"><div class="lbl">📱 Lucrezi pe telefon?</div>
<p>Pe telefon, fișierul ${a.f} ${nume} se poate <b>modifica</b> doar cu aplicația gratuită <b>${a.n}</b> <i>(${a.en})</i>. Fără ea, telefonul ți-l arată doar într-o <b>previzualizare</b>: îl vezi, dar nu poți scrie în el. Pașii de mai jos sunt pentru calculator; <b>pe telefon, fișierul îl deschizi așa:</b></p>
<ol><li>Instalează aplicația: <a href="https://play.google.com/store/apps/details?id=${a.play}" target="_blank" rel="noopener">Magazin Play</a> (Android) sau <a href="https://apps.apple.com/app/id${a.ios}" target="_blank" rel="noopener">App Store</a> (iPhone). Sub nume trebuie să scrie <b>Google LLC</b>.</li>
<li>Atinge numele fișierului, în pașii de mai jos: telefonul îl descarcă în dosarul <b>Descărcări</b> <i>(Downloads)</i>, unde ajung fișierele luate de pe internet. Dacă telefonul îl deschide singur și nu poți scrie în el, închide-l.</li>
<li>Deschide aplicația <b>${a.n}</b>. Sus, în bara „Caută în …” <i>(Search)</i>, atinge <b>dosarul</b> din dreapta (încercuit în poză) și alege fișierul din Descărcări.
<img src="${esc(poza)}" width="360" height="80" alt="Bara de sus a aplicației: Caută în Foi de calcul, cu dosarul din dreapta încercuit cu roșu" loading="lazy" style="display:block;width:100%;max-width:360px;height:auto;margin:6px 0 0;border:1px solid var(--line);border-radius:8px"></li>
<li>${a.scrii} Butoanele stau în alte locuri decât pe calculator: ce nu găsești pe telefon faci la școală.</li></ol>
<p style="margin:6px 0 0"><a href="${esc(ghid)}">Ghidul pas cu pas: cum instalezi aplicația și cum deschizi fișierul</a></p></div>`}).join('');
}
/* Numele pasului (27.09.2026, judecătorul lecției V/4: „aplicația adevărată” într-o lecție care tocmai a predat că
   aplicație = program, deși pasul se face la calculatorul din laborator): dacă `aplicatieReala.titlu` există, EL e
   textul pe buton, în titlu, în firimituri, în bara de sus, pe diplomă și în cuprins; `aplicatieReala.scurt` e
   eticheta filei (implicit „Aplicația”). Fără `titlu`, textele implicite de mai jos. Întoarce text simplu (nu HTML). */
function numeReal(Lv,implicit){const A=aplicatieReala(Lv);return A&&A.titlu?A.titlu:implicit}
/* Bara atelierului (27.09.2026, dirijorul): „fă-o ca în aplicația reală” e fals unde nu e nicio aplicație (clasa a V-a:
   atelierul e pe fotografii). În modul lecție, dacă `aplicatieReala.titlu` există și NU conține cuvântul „aplicația”,
   bara spune ceva neutru; altfel (și în jocuri) rămâne textul vechi. */
function atelierBara(Lv){const A=aplicatieReala(Lv);return A&&A.titlu&&!/aplicația/i.test(A.titlu)?'Atelier: exersezi aici, în pagină':'Atelier · fă-o ca în aplicația reală'}
/* numele din panoul profesorului și din jurnalul elevului: să se vadă că e o lecție, nu un joc */
function titluRaport(){
  if(!eLectie())return C.titlu;
  const I=lectieInfo();return `Lecția ${I.nr} (clasa ${C.clasa}): ${C.titlu}`;
}

function setHud(){
  const t=totals();
  if(R){
    const Lv=C.nivele[R.li];
    const nb=eLectie()?nivelEticheta(R.li):`${C.mod==='antrenament'?'Runda':'Nivelul'} ${R.li+1} din ${C.nivele.length}`;
    const txt=R.phase==='q'?`${Lv.pasi?'Verificarea':'Întrebarea'} ${R.qi+1} din ${Lv.qs.length} · ${R.xp} XP`:R.phase==='read'?`Citire · ${esc(Lv.t)}`
      :R.phase==='learn'?`${R.recitire?'Recitire':'Învață'} · pasul ${R.si+1} din ${Lv.pasi.length}`:R.phase==='atelier'?atelierBara(Lv)
      :R.phase==='real'?esc(numeReal(Lv,'Acum în aplicația adevărată')):`${eLectie()?'Lecție terminată':'Nivel terminat'} · ${R.xp} XP`;
    hud.innerHTML=`<span class="nb">${nb}</span><span class="fv">${txt}${R.streak>=2?` <span class="hot">serie ×${R.streak}</span>`:''}</span>`;
  }else{const s=inAsteptare()?totals(sertarLv()):t;   // cât stă „Ești tot X?”: doar ce e al lui X
    hud.innerHTML=`<span class="nb">TOTAL</span><span class="fv">★ ${s.st}/${C.nivele.length*3} · ${s.xp} XP</span>`}
}
function shell(inner,tabs){
  if(inAsteptare())eraAsteptare=true;
  app.innerHTML=`<div class="book"><div class="banda" aria-hidden="true">${C.banda||''}</div><div class="foaie">${inner}</div>${tabs?`<nav class="tabs" aria-label="Pașii nivelului">${tabs}</nav>`:''}</div>`;
  setHud();setCrumbs();wireTabs();window.scrollTo({top:0});
  anuntaPas();
}
/* SEMNALUL PASULUI (10.10.2026), pentru restul sitului (prezenta.js îl citește): la fiecare schimbare a pasului afișat,
   window.__lhPas = detail și evenimentul „lh-pas” pe window. detail = {cheie (C.cheie), joc (ca în jurnal), nivel (de la
   0; null pe cuprins și pe diplomă), pas: 'cuprins' | 'p3' | 'atelier' | 'real' | 'q2' | 'citire' | 'gata', eticheta
   ('P3', 'Atelier', 'Aplicația', 'Î2', 'Cuprins', 'Gata', 'Diploma'), titlu (al nivelului; pe cuprins și pe diplomă al
   jocului), real: true doar pe pasul în care elevul e trimis în aplicația adevărată}. Același pas redesenat nu se
   anunță a doua oară. Recitirea nu anunță nimic (nu e progres). */
let pasAnuntat='';
function anuntaPas(){
  if(RECITIRE!==null||!C)return;
  const b={cheie:C.cheie,joc:jocSlug()};let d;
  if(R&&!R.recitire){const id=pasAcum(),e=pasiNivel(R.li).find(x=>x.id===id);
    d=Object.assign(b,{nivel:R.li,pas:id,eticheta:id==='gata'?'Gata':e?e.et:id,titlu:C.nivele[R.li].t,real:id==='real'})}
  else if(app.querySelector('.diploma,.ghid'))d=Object.assign(b,{nivel:null,pas:'gata',eticheta:'Diploma',titlu:C.titlu,real:false});
  else d=Object.assign(b,{nivel:null,pas:'cuprins',eticheta:'Cuprins',titlu:C.titlu,real:false});
  const semn=d.nivel+'|'+d.pas;if(semn===pasAnuntat)return;pasAnuntat=semn;
  window.__lhPas=d;
  try{window.dispatchEvent(new CustomEvent('lh-pas',{detail:d}))}catch(e){}
}
/* breadcrumb: 🏠 LearningHub › Jocuri TIC › Clasa › Jocul [› Nivelul N]. Căile sunt relative la jocuri/<slug>/index.html. */
function setCrumbs(){
  const nav=document.getElementById('crumbs');if(!nav)return;
  const m=String(C.clasa).match(/([IVX]+)/),cls=m?m[1]:'';
  const sep='<span class="sep" aria-hidden="true">›</span>';
  /* LECȚIE: 🏠 LearningHub › Lecții › Clasa a VII-a › Lecția 4 [› Pasul 2 din 5]. Căile sunt relative la lectii/<clasa>/m1-lNN/index.html. */
  if(eLectie()){
    const acasa=C.acasa||{href:'../../../hub/index.html',text:'LearningHub'},nume=`Lecția ${lectieInfo().nr}`;
    const parts=[`<a href="${esc(acasa.href)}">🏠 ${esc(acasa.text)}</a>`,'<a href="../../index.html">Lecții</a>',`<a href="../index.html">Clasa ${esc(C.clasa)}</a>`];
    if(R){parts.push(`<button type="button" class="crumb-btn" id="crumb-game" title="${esc(C.titlu)}">${nume}</button>`);parts.push(`<span class="cur" aria-current="page">${etapaLectie()}</span>`)}
    else parts.push(`<span class="cur" aria-current="page">${nume}</span>`);
    nav.innerHTML=parts.join(sep);
    const g=document.getElementById('crumb-game');if(g)g.onclick=home;
    return;
  }
  /* C.acasa (opțional, ex. site-ul de bac): {href,text} înlocuiește legătura spre LearningHub; C.eticheta înlocuiește „Jocuri TIC” */
  const acasa=C.acasa||{href:'../../hub/index.html',text:'LearningHub'};
  const parts=[`<a href="${esc(acasa.href)}">🏠 ${esc(acasa.text)}</a>`,`<a href="../index.html">${esc(C.eticheta||'Jocuri TIC')}</a>`];
  if(cls)parts.push(`<a href="../index.html#clasa-${cls}">Clasa ${esc(C.clasa)}</a>`);
  if(R){parts.push(`<button type="button" class="crumb-btn" id="crumb-game">${esc(C.titlu)}</button>`);parts.push(`<span class="cur" aria-current="page">${nivelEticheta(R.li)}</span>`)}
  else parts.push(`<span class="cur" aria-current="page">${esc(C.titlu)}</span>`);
  nav.innerHTML=parts.join(sep);
  const g=document.getElementById('crumb-game');if(g)g.onclick=home;
}
/* „Nivelul 3 din 7”, „Nivelul final (7 din 7)” - elevii întreabă câte niveluri sunt */
function nivelEticheta(i){
  if(eLectie()){const n=C.nivele.length,nr=lectieInfo().nr;return n>1?`Lecția ${nr} · partea ${i+1} din ${n}`:`Lecția ${nr}`}
  const n=C.nivele.length,w=C.mod==='antrenament'?'Runda':'Nivelul';return C.nivele[i].final?`${w} finală (${i+1} din ${n})`.replace('Nivelul finală','Nivelul final'):`${w} ${i+1} din ${n}`}
/* Bara de jos: pașii prin care ai trecut deja sunt butoane - te poți întoarce la ei (și înainte, până unde
   ajunseseși). Un pas refăcut nu mai dă XP a doua oară (R.punctat), iar încercările greșite se țin minte
   (R.atts), ca „du-te înapoi și revino” să nu șteargă greșelile. */
/* BARA PE ELEV (10.10.2026). Profesorul (08.10.2026): „meniul lecțiilor parcurse să aibă pentru fiecare dintre ei -
   clickabile itemurile pe care le-au parcurs și neclickabile cele pe care nu le-au parcurs încă. Astfel la o privire în
   meniul de jos elevul să știe clar unde a rămas data trecută - dar trebuie să se reflecte per elev”. Până acum bara se
   făcea doar din R (de la zero la fiecare deschidere): P1..Pn, Atelier și Aplicația se puteau apăsa oricând, iar Î1 de
   la prima secundă (vazut=k<=R.max, cu max pornit de la 0).
   Acum ordinea nivelului e P1..Pn → Atelier → Aplicația (pasul „real”) → Î1..Îk (fără pași: Citire → Î1..Îk), iar un
   element e BUTON doar dacă elevul ACESTA l-a văzut: în sertarul lui (S.lv[i], pe profil; unit și cu celălalt aparat)
   sau în deschiderea de acum (R). Din sertar: ps (pașii P văzuți), at:1, re:1, qm (vezi „CE FACE ELEVUL PE NIVEL”).
   Nivel terminat (stele) = toate butoane. Cele nevăzute sunt stinse (span.blocat, cu titlul „Ajungi aici…”), iar primul
   nevăzut de după cel mai îndepărtat atins poartă semnul „următorul” (span.urm). La antrenament (bazin) întrebările se
   trag din nou la fiecare rundă, deci acolo Î-urile vin doar din runda de acum. */
function pasiNivel(i){   /* elementele barei, în ordine: id (în ?pas=, în ul și în lh-pas), la (pentru mergiLa), et, t */
  const Lv=C.nivele[i],o=[];
  if(Lv.pasi){
    Lv.pasi.forEach((p,k)=>o.push({id:'p'+(k+1),la:'p'+k,et:'P'+(k+1),t:p.t}));
    if(Lv.atelier)o.push({id:'atelier',la:'atelier',et:'Atelier',t:atelierBara(Lv).replace(' · ',': ')});
    const AR=aplicatieReala(Lv);
    if(AR)o.push({id:'real',la:'real',et:AR.scurt||'Aplicația',t:AR.titlu||'Acum în aplicația adevărată'});
  }else o.push({id:'citire',la:'citire',et:Lv.bazin?'Pregătire':'Citire',t:'Înapoi la pagina de citit'});
  (Lv.qs||[]).forEach((_,k)=>o.push({id:'q'+(k+1),la:String(k),et:'Î'+(k+1),t:`Mergi la întrebarea ${k+1}`}));
  return o;
}
/* pentru fiecare element din pasiNivel(i): l-a văzut elevul acesta? */
function atins(i){
  const Lv=C.nivele[i],l=sertarLv()[i]||{},gata=facut(l),aici=R&&R.li===i&&!R.recitire?R:null;
  const ps={};(Array.isArray(l.ps)?l.ps:[]).forEach(k=>{ps[k]=1});if(aici)Object.keys(aici.vazutPas).forEach(k=>{ps[k]=1});
  const qm=Lv.bazin?numar(aici&&aici.qm):Math.max(numar(l.qm),numar(aici&&aici.qm));
  return pasiNivel(i).map((e,x)=>gata||(e.id==='citire'?!!(l.v||aici):e.id==='atelier'?l.at===1||!!(aici&&aici.atelierVazut)
    :e.id==='real'?l.re===1||!!(aici&&aici.realVazut):e.id[0]==='q'?qm>=+e.id.slice(1):!!ps[+e.id.slice(1)-1]));
}
/* pasul afișat acum, cu id-ul din pasiNivel ('gata' = ecranul de final al nivelului) */
function pasAcum(){
  if(!R)return null;
  return R.phase==='learn'?'p'+(R.si+1):R.phase==='q'?'q'+(R.qi+1):R.phase==='read'?'citire':R.phase==='end'?'gata':R.phase;
}
/* Pașii prin care ai trecut sunt butoane (te întorci la ei sau sari înainte până unde ajunseseși). Un pas refăcut nu mai
   dă XP a doua oară (R.punctat), iar încercările greșite se țin minte (R.atts), ca „du-te înapoi și revino” să nu
   șteargă greșelile. Verde (done): pașii de învățare văzuți; întrebările punctate acum sau la final. */
function tabsFor(){
  const E=pasiNivel(R.li),A=atins(R.li),acum=pasAcum(),urm=A.lastIndexOf(true)+1;
  return E.map((e,x)=>{
    const cls=e.id[0]==='q'?(R.phase==='end'||R.punctat[+e.la]?'done':''):'done';
    if(e.id===acum)return `<span class="${cls?cls+' ':''}now" aria-current="step">${esc(e.et)}</span>`;
    if(A[x])return `<button type="button" class="${cls}" data-pas="${e.la}" title="${esc(e.t)}">${esc(e.et)}</button>`;
    return `<span class="blocat${x===urm?' urm':''}" title="${x===urm?'Următorul. ':''}Ajungi aici după ce termini pașii de dinainte">${esc(e.et)}</span>`}).join('');
}
function mergiLa(k){
  if(k==='citire'){if(C.nivele[R.li].pasi){R.si=0;R.phase='learn';learnPage()}else{R.phase='read';readPage()}return}
  if(/^p\d+$/.test(k)){R.si=+k.slice(1);R.phase='learn';learnPage();return}
  if(k==='atelier'){R.phase='atelier';atelierPage();return}
  if(k==='real'){R.phase='real';realPage();return}
  R.qi=Number(k);R.phase='q';question();
}
function wireTabs(){app.querySelectorAll('.tabs [data-pas]').forEach(b=>b.onclick=()=>mergiLa(b.dataset.pas))}
/* o notă scurtă deasupra paginii abia desenate (legăturile directe, mai jos); pleacă la următorul desen */
function arataNota(t){const f=t&&app.querySelector('.foaie');if(f)f.insertAdjacentHTML('afterbegin',`<p class="nota-pas" role="status">${esc(t)}</p>`)}
/* „CONTINUĂ DE UNDE AI RĂMAS” (10.10.2026): nivelul neterminat atins cel mai recent (t1; lecția: nivelul ei), la cel mai
   îndepărtat pas atins. Doar dacă elevul a trecut de primul pas; nu la antrenament (întrebările se trag din nou) și nu la
   un nivel reluat după „Ia-o de la capăt” (p1/fp: drumul vechi rămâne în ps/qm, iar bara îl arată apăsabil oricum). */
function deContinuat(){
  let b=null;
  C.nivele.forEach((Lv,i)=>{const s=sertarLv()[i];if(Lv.bazin||!s||facut(s)||s.p1||s.fp||!unlocked(i))return;
    const f=atins(i).lastIndexOf(true);if(f<1)return;
    if(!b||numar(s.t1)>b.t)b={i,f,t:numar(s.t1)}});
  if(!b)return null;
  const e=pasiNivel(b.i)[b.f],n=C.nivele.length>1?(eLectie()?`partea ${b.i+1}, `:`${C.mod==='antrenament'?'runda':'nivelul'} ${b.i+1}, `):'';
  return {i:b.i,e,unde:n+e.et};
}
/* LEGĂTURI DIRECTE (10.10.2026): ?pas=p3|atelier|real|q2|citire deschide nivelul (lecția: nivelul ei; jocul: &nivel=N,
   de la 1, altfel nivelul de continuat) direct la pasul cerut, DACĂ elevul l-a atins; altfel la cel mai îndepărtat pas
   atins, cu o notă scurtă. ?continua=1 = la cel mai îndepărtat pas atins (ca butonul „Continuă de unde ai rămas”); la un
   nivel terminat rămâne cuprinsul. Drumul e cel obișnuit: startLevel(i, pas) -> mergiLa. Parametrii se scot din adresă
   după folosire, ca o reîncărcare să nu-l mute iar. ?recitire=N nu ajunge aici (porneste() iese înainte). */
function legaturaDirecta(){
  let q;try{q=new URLSearchParams(location.search)}catch(e){return}
  const pas=String(q.get('pas')||'').trim().toLowerCase(),cont=q.get('continua'),nv=parseInt(q.get('nivel'),10);
  if(!pas&&cont==null)return;
  ['pas','continua','nivel'].forEach(k=>q.delete(k));
  try{const s=q.toString();history.replaceState(history.state,'',location.pathname+(s?'?'+s:'')+location.hash)}catch(e){}
  const n=C.nivele.length,DC=deContinuat();
  const i=nv>=1&&nv<=n?nv-1:n===1?0:DC?DC.i:Math.max(0,C.nivele.findIndex((_,k)=>unlocked(k)&&!facut(sertarLv()[k])));
  const fel=eLectie()?'partea':C.mod==='antrenament'?'runda':'nivelul';
  if(!unlocked(i))return arataNota(`${fel[0].toUpperCase()+fel.slice(1)} ${i+1} nu s-a deschis încă: termină întâi ${fel} ${i}.`);
  if(C.nivele[i].bazin)return startLevel(i);
  if(!pas&&facut(sertarLv()[i]))return arataNota(eLectie()&&n===1?'Ai terminat deja lecția.':`Ai terminat deja ${fel} ${i+1}.`);
  const E=pasiNivel(i),A=atins(i),f=A.lastIndexOf(true);
  let x=-1,nota='';
  if(pas){x=E.findIndex(e=>e.id===pas);
    if(x<0)nota=`Pasul „${pas}” nu există aici.`;
    else if(!A[x]){nota=`Încă n-ai ajuns la ${E[x].et}.`;x=-1}}
  if(x<0){x=Math.max(f,0);if(nota)nota+=f>=0?` Te-am dus unde ai rămas: ${E[x].et}.`:` Începi cu ${E[x].et}.`}
  startLevel(i,E[x].la,nota);
}

/* ---------------- cuprins ---------------- */
function home(){
  scurge();R=null;
  const allDone=C.nivele.every((_,i)=>facut(S.lv[i]));
  const LE=eLectie(),nrL=LE?lectieInfo().nr:'';
  const B=sertarLv();   // = S.lv, în afară de cât stă „Ești tot X?” (atunci: doar sertarul lui X)
  const rows=C.nivele.map((Lv,i)=>{const d=facut(B[i])?B[i]:null,u=unlocked(i),tin=tinutAici(i);
    const drum=Lv.pasi?`<span class="drum">${Lv.pasi.length} pași de învățat${Lv.atelier?' · atelier':''}${aplicatieReala(Lv)?' · '+esc(numeReal(Lv,'în aplicația adevărată')):''} · ${Lv.qs.length} întrebări de verificare</span>`:'';
    const nr=LE?(C.nivele.length>1?`Partea ${i+1}`:`Lecția ${nrL}`):`${i+1} din ${C.nivele.length}${Lv.final?' · final':''}`;
    return `<button class="lvl" type="button" data-l="${i}" ${u?'':'disabled'}><span class="n">${nr}</span><span class="t">${esc(Lv.t)}${drum}</span><span class="s">${d?starsHtml(d.stars)+(tin?' <small>· acum: ținut deoparte</small>':''):tin?'<small>făcut acum · ținut deoparte</small>':u?'începe →':'blocat'}</span></button>`}).join('');
  const DC=inAsteptare()?null:deContinuat();   /* cât stă „Ești tot X?” nu trimitem pe nimeni pe drumul lui X */
  shell(`
    <div class="eyebrow">${LE?`Lecția ${nrL}`:esc(C.eticheta?C.eticheta.replace(/^Jocuri\s*/,''):'TIC')} · clasa ${esc(C.clasa)} · ${esc(C.unitateTitlu)}</div>
    <h1 style="margin-top:8px">${C.h1||esc(C.titlu)}</h1>
    <div class="lede">${C.intro}</div>
    <div class="ancora">${C.ancoraText?esc(C.ancoraText):`Programa: ${esc(C.competente.join(', '))} · unitatea ${esc(C.unitate)}${C.lectii?` · lecțiile ${esc(C.lectii)}`:''}`}</div>
    <div id="cine-lucreaza"></div>
    <div class="namerow"><label for="nume">Numele tău, pentru diplomă</label><input id="nume" type="text" autocomplete="off" maxlength="40" value="${esc(inAsteptare()?'':S.nume)}" placeholder="ex. Ana Popescu"></div>
    ${C.cum?`<div class="cum-inveti">${C.cum}</div>`:''}
    ${DC?`<div class="row continua-rand"><button class="btn primary" id="continua" type="button">Continuă de unde ai rămas: ${esc(DC.unde)}</button></div>`:''}
    <div class="toc-h">${LE?(C.nivele.length>1?`Lecția are ${C.nivele.length} părți · se deschid pe rând`:numeReal(C.nivele[0],'')?`Drumul lecției: pașii → ${C.nivele[0].atelier?'atelierul → ':''}${esc(numeReal(C.nivele[0],''))} → verificarea`:'Drumul lecției: înveți pe pași, exersezi, o faci în aplicația adevărată, apoi verifici'):C.mod==='antrenament'?`${C.nivele.length} runde · De bază → Consolidat → Avansat · întrebări noi la fiecare reluare`:`${C.nivele.length} niveluri · se deblochează pe rând · ultimul e nivelul final`}</div>
    <nav class="toc" aria-label="${LE?'Lecția':'Nivelurile'}">${rows}</nav>
    <div class="row" style="margin-top:22px">
      ${allDone?'<button class="btn primary" id="dipl" type="button">Vezi diploma</button>':''}
      ${Object.keys(S.lv).some(i=>facut(S.lv[i]))?'<button class="btn ghost" id="reset" type="button">Ia-o de la capăt</button>':''}
      ${LE?'<a class="btn ghost" href="../index.html">Toate lecțiile clasei</a>':'<a class="btn ghost" href="../index.html">Toate jocurile</a>'}
    </div>`);
  const inp=document.getElementById('nume');inp.addEventListener('input',()=>{S.nume=inp.value.trim();save()});
  app.querySelectorAll('.lvl').forEach(b=>b.addEventListener('click',()=>startLevel(+b.dataset.l)));
  const ct=document.getElementById('continua');if(ct)ct.onclick=()=>startLevel(DC.i,DC.e.la);
  const dp=document.getElementById('dipl');if(dp)dp.onclick=diploma;
  const rs=document.getElementById('reset');
  if(rs)rs.onclick=()=>{if(rs.dataset.sure){iaDeLaCapat();home()}else{rs.dataset.sure=1;rs.textContent='Sigur? Apasă din nou'}};   // vezi „Ia-o de la capăt” sus
  cineLucreaza();
}
/* CINE LUCREAZĂ (26.09.2026, el: „să permitem continuarea nivelurilor fără să mai ștergem progresul individual”).
   Butonul vechi „Sunt alt elev, încep de la zero” ștergea progresul. Acum: elevul își alege numele din lista
   calculatorului (prezenta.js) și fiecare continuă de unde a rămas; cu codul lui, și pe alt aparat. */
function cineLucreaza(){
  const el=document.getElementById('cine-lucreaza');if(!el||R)return;
  const P=window.Prezenta,e=P&&P.identitate&&P.identitate(),n=Object.keys(S.lv).filter(i=>facut(S.lv[i])).length;
  if(inAsteptare()){   // „Ești tot X?” jos: nimic nu se arată ca făcut pe numele lui X până nu răspunde
    const k=C.nivele.filter((_,i)=>tinutAici(i)).length,a=C.mod==='antrenament';
    const ce=!k?'':eLectie()&&C.nivele.length===1?' (acum ai făcut lecția)':` (acum ${k===1?(a?'o rundă făcută':'un nivel făcut'):`${k} ${a?'runde':'niveluri'} făcute`})`;
    el.innerHTML=`<div class="alt-elev"><span>Jos, calculatorul întreabă: <b>ești tu ${esc(e?e.nume:'')}?</b> Până răspunzi, ce lucrezi acum stă deoparte${ce} și nu intră pe numele nimănui.</span></div>`;
    return}
  const cat=!n?'':eLectie()?(C.nivele.length>1?` · ${n} din ${C.nivele.length} părți făcute`:' · lecția e terminată')
    :` · ${n} din ${C.nivele.length} ${C.mod==='antrenament'?'runde':'niveluri'} făcute`;
  if(e){
    el.innerHTML=`<div class="alt-elev"><span>Lucrezi ca <b>${esc(e.nume)}</b> (${esc(e.clasa)})${cat}.${P.areCod&&!P.areCod()?' <br><small>Progresul tău e doar pe calculatorul ăsta.</small>':' <br><small>☁ Progresul tău te urmează pe orice calculator.</small>'}</span>
      <span class="row" style="gap:6px">${P.areCod&&!P.areCod()?'<button class="btn" id="pastreaza" type="button">Păstrează-l online</button>':''}<button class="btn ghost" id="alt-elev" type="button">Nu ești tu? Alege-te din listă</button></span></div>`;
  }else if(S.nume||n){
    el.innerHTML=`<div class="alt-elev"><span>Pe calculatorul ăsta a lucrat ${S.nume?`<b>${esc(S.nume)}</b>`:'cineva'}${cat}. Nu ești tu?</span><button class="btn" id="alt-elev" type="button">${P?'Alege-te din listă sau înscrie-te':'Sunt alt elev, încep de la zero'}</button></div>`;
  }else{el.innerHTML='';return}
  const alt=document.getElementById('alt-elev'),ps=document.getElementById('pastreaza');
  if(ps)ps.onclick=()=>P.cereCod();
  alt.onclick=()=>{
    if(window.Prezenta&&window.Prezenta.alege){window.Prezenta.alege();return}
    // fără prezenta.js (offline): ca înainte, două apăsări și jocul pornește curat
    if(alt.dataset.sure){S={nume:'',lv:{}};scrieBrut();home();const nm=document.getElementById('nume');if(nm)nm.focus()}else{alt.dataset.sure=1;alt.textContent='Sigur? Se șterge tot ce e mai sus - apasă din nou'}};
}

/* ---------------- nivel ---------------- */
/* ANTRENAMENT (stratul 2 al repetiției): un nivel cu `bazin:[întrebări]` și `cate:N` primește la fiecare pornire N întrebări
   trase la întâmplare, întâi cele nevăzute la reluările anterioare. Așa elevul reia aceleași lucruri, dar nu aceleași întrebări. */
let TEST_TOATE=false;
const vazutKey=i=>C.cheie+'_vazut_'+i;
function citesteVazut(i){try{return JSON.parse(localStorage.getItem(vazutKey(i)))||[]}catch(e){return []}}
/* Tragerea e echilibrată pe lecții: dacă întrebările au `lectii:[n]`, se ia pe rând câte una din fiecare lecție
   (întâi cele nevăzute), ca o rundă de 6 să nu sară lecții întregi (observat la pilotul Word, 15.09.2026). */
function trage(Lv,i){
  if(TEST_TOATE)return {qs:Lv.bazin.slice(),pick:[]};
  const n=Math.min(Lv.cate||5,Lv.bazin.length),seen=citesteVazut(i);
  const idx=Lv.bazin.map((_,k)=>k);
  const lesson=k=>{const q=Lv.bazin[k];return q.lectii&&q.lectii.length?q.lectii[0]:'?'};
  const rr=(list,key)=>{   // câte unul din fiecare grup, pe rând
    const groups={};list.forEach(k=>{(groups[key(k)]=groups[key(k)]||[]).push(k)});
    const order=shuffle(Object.keys(groups)),out=[];
    while(out.length<list.length)order.forEach(g=>{if(groups[g].length)out.push(groups[g].shift())});
    return out;
  };
  /* echilibrat pe lecții; în recapitulare (întrebări cu `grup` = unitatea) întâi pe unități, apoi pe lecții în fiecare unitate */
  const roundRobin=list=>{
    const byLesson=rr(shuffle(list),lesson);
    if(!byLesson.some(k=>Lv.bazin[k].grup))return byLesson;
    return rr(byLesson,k=>Lv.bazin[k].grup||'?');
  };
  const pick=roundRobin(idx.filter(k=>!seen.includes(k))).concat(roundRobin(idx.filter(k=>seen.includes(k)))).slice(0,n);
  return {qs:shuffle(pick).map(k=>Lv.bazin[k]),pick};
}
/* „văzut” se scrie abia când runda e TERMINATĂ: o rundă deschisă și abandonată nu consumă întrebările */
function marcheazaVazut(i,pick){
  if(!pick||!pick.length)return;
  const Lv=C.nivele[i],idx=Lv.bazin.map((_,k)=>k);
  let next=citesteVazut(i).filter(k=>!pick.includes(k)).concat(pick);
  if(idx.every(k=>next.includes(k)))next=pick;   // a văzut tot bazinul: ciclul o ia de la capăt
  try{localStorage.setItem(vazutKey(i),JSON.stringify(next))}catch(e){}
}
/* la (opțional): pasul de deschis direct, ca în bară ('p3' = P4, 'atelier', 'real', '1' = Î2), cu o notă deasupra
   (legăturile directe și „Continuă de unde ai rămas”); fără el, nivelul începe cu primul pas, ca înainte */
function startLevel(i,la,nota){
  const Lv=C.nivele[i];let pick=null;
  if(Lv.bazin){const t=trage(Lv,i);Lv.qs=t.qs;pick=t.pick}
  scurge();   // secundele nivelului de dinainte intră la el
  /* tq/tr/qm0: CRONOMETRUL PE ÎNTREBARE (vezi „RĂSPUNSURI PREA RAPIDE” la question); qm0 = cea mai mare întrebare atinsă
     ÎNAINTE de deschiderea asta (din sertar, unit și cu celelalte aparate) - cele până la ea nu se cronometrează */
  R={li:i,qi:0,max:0,qm:0,punctat:{},atts:{},xp:0,first:0,streak:0,phase:Lv.pasi?'learn':'read',pick,si:0,vazutPas:{},pv:{},indiciu:{},mode:'test',
    tq:{},tr:{},qm0:numar((sertarLv()[i]||{}).qm)};
  noteaza(i,l=>{if(Lv.pasi)l.pn=Lv.pasi.length;if(Lv.atelier&&l.at==null)l.at=0});   // văzut (v), t0/t1
  if(la!=null){mergiLa(la);arataNota(nota);return}
  if(Lv.pasi)learnPage();else readPage();
}
/* textul întreg al nivelului (pentru „Recitește”): la nivelurile pe pași, toți pașii unul după altul */
function textNivel(Lv){
  if(!Lv.pasi)return Lv.text||'';
  return Lv.pasi.map(p=>`<h3 class="pas-h">${esc(p.t)}</h3>${p.text||''}${p.exemplu?`<div class="exemplu"><div class="lbl">Uite cum</div>${p.exemplu}</div>`:''}`).join('');
}

/* ---------------- ÎNVAȚĂ, pas cu pas (26.09.2026) ----------------
   El: „informația e prea condensată - nu e beginner friendly - e mai mult test decât asistență de învățare.
   Vreau ca aceste misiuni să îl conducă pe fiecare de la novice la expertiză. Să ofere informații și sarcini
   simple (cu variante reale pentru consolidare - la cerere) și posibilitatea efectivă a exersării - simulare
   a aplicației adevărate.” Un nivel cu `pasi:[…]` se învață întâi: o idee pe pagină, un exemplu lucrat,
   o explicație altfel la cerere, un exercițiu mic cu indiciu (fără puncte, fără stele) și „încă unul” cât vrea.
   Apoi atelierul (aplicația simulată, cu teste), apoi verificarea — doar pe ce s-a predat în pași. */
/* Blocul „Ce trebuie să știi” (26.09.2026): ce presupune nivelul din jocurile de DINAINTE (programa V→VIII), cu
   fraza-amintire și locul unde se învață. Harta = prerechizite.js, generată de _tests/prereq_jocuri.py --scrie.
   Restrâns (un rând); se deschide la clic. Fără hartă sau fără prerechizite: nimic. */
function blocPrereq(){
  const H=(window.JOCURI_PREREQ||{})[jocSlug()]||{},Q=H[String(R.li+1)]||[];
  if(!Q.length)return '';
  return `<details class="prereq"><summary>Ce trebuie să știi dinainte (${Q.length})</summary><ul>${Q.map(e=>
    `<li><b>${esc(e.termen)}</b>${e.amintire?` — ${esc(e.amintire)}`:''}<br><span class="unde">Dacă nu-ți amintești: <a href="${eLectie()?esc(new URL('../'+encodeURIComponent(e.joc)+'/',MOTOR_URL).href):`../${encodeURIComponent(e.joc)}/`}">${esc(e.joc_titlu)}</a>, nivelul ${esc(e.nivel)}${e.nivel_titlu?` („${esc(e.nivel_titlu)}”)`:''}</span></li>`).join('')}</ul></details>`;
}
function learnPage(){
  const Lv=C.nivele[R.li],n=Lv.pasi.length,P=Lv.pasi[R.si];R.vazutPas[R.si]=true;
  const si=R.si;noteaza(R.li,l=>{const ps=Array.isArray(l.ps)?l.ps.slice():[],ul='p'+(si+1);if(ps.includes(si)&&l.ul===ul)return false;   /* pasul deschis (ps), ultimul pas (ul) */
    if(!ps.includes(si)){ps.push(si);l.ps=ps.sort((a,b)=>a-b)}l.pn=n;l.ul=ul});
  const AR=aplicatieReala(Lv);   // doar în modul lecție: fără atelier, după ultimul pas vine „Acum în aplicația adevărată”
  const ultim=R.si===n-1,urm=ultim?(Lv.atelier?'La atelier →':AR?esc(numeReal(Lv,'Acum în aplicația adevărată'))+' →':'La verificare →'):'Pasul următor →';
  const ex=practiceList(P);
  shell(`
    <div class="row" style="justify-content:space-between"><div class="eyebrow">${nivelEticheta(R.li)} · învață · pasul ${R.si+1} din ${n}</div>
    <button class="btn ghost sm" id="go" type="button" title="Dacă știi deja tot ce e în pași, poți trece direct la verificare">Știu deja — la verificare</button></div>
    <h2 style="margin:8px 0 6px">${esc(P.t)}</h2>
    ${R.si===0&&Lv.obiectiv?`<p class="obiectiv"><b>${eLectie()?'La finalul lecției:':'La finalul nivelului:'}</b> ${Lv.obiectiv}</p>`:''}
    ${R.si===0?blocPrereq():''}
    <div class="reading">${P.text||''}</div>
    ${P.exemplu?`<div class="exemplu"><div class="lbl">Uite cum</div>${P.exemplu}</div>`:''}
    ${P.altfel?`<button class="btn ghost sm" id="altfel" type="button" aria-expanded="false">Nu am înțeles — explică-mi altfel</button><div class="altfel reading" id="altfel-t" hidden>${P.altfel}</div>`:''}
    ${ex.length?`<section class="incearca" aria-label="Încearcă tu"><div class="lbl">Încearcă tu <span class="hint">· fără puncte, doar exersezi${ex.length>1?` · ${ex.length} exerciții la dispoziție`:''}</span></div>
      <div class="q" id="pq"></div><div id="body"></div><div id="fb" aria-live="polite"></div><div class="row" id="nav"></div></section>`:''}
    <div class="row pas-nav" style="margin-top:22px">
      <button class="btn" id="pas-prev" type="button">${R.si?'← Pasul anterior':'← Cuprins'}</button>
      <button class="btn primary" id="pas-next" type="button">${urm}</button>
    </div>`,tabsFor());
  const af=document.getElementById('altfel');
  if(af)af.onclick=()=>{const t=document.getElementById('altfel-t');t.hidden=!t.hidden;af.setAttribute('aria-expanded',String(!t.hidden));af.textContent=t.hidden?'Nu am înțeles — explică-mi altfel':'Ascunde explicația'};
  document.getElementById('go').onclick=()=>{R.mode='test';R.phase='q';question()};
  document.getElementById('pas-prev').onclick=()=>{if(R.si){R.si--;learnPage()}else home()};
  document.getElementById('pas-next').onclick=()=>{R.mode='test';if(!ultim){R.si++;learnPage()}else if(Lv.atelier){R.phase='atelier';atelierPage()}else if(AR){R.phase='real';realPage()}else{R.phase='q';question()}};
  if(ex.length)renderPractice(ex,'p'+R.si);
}
function practiceList(P){return [P.incearca].concat(P.inca||[]).filter(Boolean)}

/* ---------------- RECITIRE (27.09.2026) ----------------
   De ce: evaluarea inițială (lecțiile nr. 1) îi spune elevului „Recitește: jocul X, nivelul 5”, dar pe un profil nou
   nivelurile se deschid doar pe rând (unlocked), deci legătura ducea la un nivel blocat. Legătura
   jocuri/<slug>/?recitire=N (N de la 1, ca pe ecran) deschide DIRECT pașii de învățat ai nivelului N, oricare ar fi
   deblocarea. Doar citire: fără verificare și fără atelier, fără puncte; S, progresul, jurnalul și diploma rămân
   neatinse (save() nu scrie nimic, load() nu mută nimic între sertare, prezenta.js nu se încarcă). „Încearcă tu” din
   pași rămâne, fără puncte, ca în jocul obișnuit. Cuprinsul = aceeași pagină FĂRĂ parametru (încărcare obișnuită).
   Doctrina rămâne: nivelurile se DESCHID tot pe rând; recitirea doar citește. Pe o lecție (mod:'lectie') parametrul
   e ignorat: lecția are un singur nivel, iar pașii ei se deschid oricum liber. */
const urlCuprins=()=>location.pathname;
function paramRecitire(){try{return new URLSearchParams(location.search).get('recitire')}catch(e){return null}}
function recitireBanda(){return `<div class="recitire-banda" role="note"><span><b>Recitire</b> — nu se notează și nu deschide nivelul</span><a class="btn ghost sm" href="${esc(urlCuprins())}">Cuprinsul jocului</a></div>`}
function recitireStart(){
  const t=String(RECITIRE).trim(),n=C.nivele.length,N=/^\d+$/.test(t)?Number(t):NaN,Lv=N>=1&&N<=n?C.nivele[N-1]:null;
  if(!Lv)return recitireMesaj(`Nivelul „${esc(t)}” nu există în acest joc`,`Jocul are ${n} niveluri, numerotate de la 1 la ${n}. Verifică legătura sau deschide cuprinsul jocului.`);
  if(!Lv.pasi||!Lv.pasi.length)return recitireMesaj(`Nivelul ${N} nu are pași de recitit`,
    `Nivelul ${N} („${esc(Lv.t)}”) este ${Lv.bazin?'o rundă de antrenament: întrebări alese la întâmplare, fără pagini de citit':'o pagină de citit urmată de întrebări, fără pași'}. Deschide-l din cuprinsul jocului.`);
  R={li:N-1,si:0,phase:'learn',recitire:true,qi:0,max:0,punctat:{},atts:{},xp:0,first:0,streak:0,vazutPas:{},pv:{},indiciu:{},mode:'practice'};
  recitirePas(false);
}
function recitireMesaj(titlu,text){
  R=null;
  shell(`${recitireBanda()}
    <h2 style="margin:8px 0 6px" tabindex="-1" id="rec-h">${titlu}</h2>
    <p class="lede">${text}</p>
    <div class="row" style="margin-top:18px"><a class="btn primary" href="${esc(urlCuprins())}">Cuprinsul jocului</a></div>`);
}
function recitirePas(focus){
  const Lv=C.nivele[R.li],n=Lv.pasi.length,P=Lv.pasi[R.si],ex=practiceList(P),ultim=R.si===n-1;R.vazutPas[R.si]=true;R.phase='learn';
  const tabs=Lv.pasi.map((p,k)=>k===R.si?`<span class="now" aria-current="step">P${k+1}</span>`
    :`<button type="button" class="${R.vazutPas[k]?'done':''}" data-rpas="${k}" title="${esc(p.t)}">P${k+1}</button>`).join('');
  /* pașii se schimbă și de SUS, înaintea conținutului: tastatura ajunge la ei fără să treacă prin simulator
     (foaia Excel păstrează Tab pentru celule, ca Excel-ul, deci Tab nu iese din ea) */
  shell(`${recitireBanda()}
    <nav class="row rec-nav" aria-label="Pașii nivelului">
      <button class="btn ghost sm" id="rec-prev" type="button" ${R.si?'':'disabled'}>← Pasul anterior</button>
      <button class="btn ghost sm" id="rec-next" type="button" ${ultim?'disabled':''}>Pasul următor →</button>
    </nav>
    <div class="eyebrow">${nivelEticheta(R.li)} · recitire · pasul ${R.si+1} din ${n}</div>
    <h2 style="margin:8px 0 6px" tabindex="-1" id="rec-h">${esc(P.t)}</h2>
    ${R.si===0&&Lv.obiectiv?`<p class="obiectiv"><b>La finalul nivelului:</b> ${Lv.obiectiv}</p>`:''}
    ${R.si===0?blocPrereq():''}
    <div class="reading">${P.text||''}</div>
    ${P.exemplu?`<div class="exemplu"><div class="lbl">Uite cum</div>${P.exemplu}</div>`:''}
    ${P.altfel?`<button class="btn ghost sm" id="altfel" type="button" aria-expanded="false">Nu am înțeles — explică-mi altfel</button><div class="altfel reading" id="altfel-t" hidden>${P.altfel}</div>`:''}
    ${ex.length?`<section class="incearca" aria-label="Încearcă tu"><div class="lbl">Încearcă tu <span class="hint">· fără puncte, doar exersezi${ex.length>1?` · ${ex.length} exerciții la dispoziție`:''}</span></div>
      <div class="q" id="pq"></div><div id="body"></div><div id="fb" aria-live="polite"></div><div class="row" id="nav"></div></section>`:''}
    <div class="row pas-nav" style="margin-top:22px">
      ${R.si?'<button class="btn" id="pas-prev" type="button">← Pasul anterior</button>':`<a class="btn" href="${esc(urlCuprins())}">← Cuprinsul jocului</a>`}
      ${ultim?`<a class="btn primary" id="pas-gata" href="${esc(urlCuprins())}">Gata — la cuprinsul jocului</a>`:'<button class="btn primary" id="pas-next" type="button">Pasul următor →</button>'}
    </div>`,tabs);
  const af=document.getElementById('altfel');
  if(af)af.onclick=()=>{const t=document.getElementById('altfel-t');t.hidden=!t.hidden;af.setAttribute('aria-expanded',String(!t.hidden));af.textContent=t.hidden?'Nu am înțeles — explică-mi altfel':'Ascunde explicația'};
  const pr=document.getElementById('pas-prev'),nx=document.getElementById('pas-next');
  if(pr)pr.onclick=()=>{R.si--;recitirePas(true)};
  if(nx)nx.onclick=()=>{R.si++;recitirePas(true)};
  // de la butoanele de SUS, focusul rămâne pe același buton (Enter, Enter… parcurge pașii); când nu mai e voie, pe titlu
  const reFocus=id=>{const b=document.getElementById(id);if(b&&!b.disabled)b.focus({preventScroll:true})};
  document.getElementById('rec-prev').onclick=()=>{if(R.si){R.si--;recitirePas(true);reFocus('rec-prev')}};
  document.getElementById('rec-next').onclick=()=>{if(!ultim){R.si++;recitirePas(true);reFocus('rec-next')}};
  app.querySelectorAll('.tabs [data-rpas]').forEach(b=>b.onclick=()=>{R.si=+b.dataset.rpas;recitirePas(true)});
  const g=document.getElementById('crumb-game');if(g)g.onclick=()=>{location.href=urlCuprins()};   // numele jocului din firimituri -> cuprinsul
  if(ex.length)renderPractice(ex,'r'+R.si);
  if(focus){const h=document.getElementById('rec-h');if(h)h.focus({preventScroll:true})}   // tastatura: pasul nou începe de la titlul lui
}
/* un exercițiu fără scor, în #pq/#body/#fb/#nav; „Încă un exercițiu” trece la următorul din listă */
function renderPractice(list,key){
  const k=(R.pv[key]||0)%list.length,Q=list[k];
  R.mode='practice';R.pQ=Q;R.pKey=key;R.pList=list;R.done=false;R.att=0;
  document.getElementById('pq').innerHTML=(list.length>1?`<span class="nr-ex">Exercițiul ${k+1} din ${list.length}</span> `:'')+Q.q;
  document.getElementById('fb').innerHTML='';document.getElementById('nav').innerHTML='';
  const body=document.getElementById('body');body.innerHTML='';
  document.querySelectorAll('.ajutor').forEach(x=>x.remove());
  if(Q.ajutor)ajutorButon(Q,body);
  const t=TIPURI[Q.t];if(!t){body.innerHTML=`<p class="toast">Tip de exercițiu necunoscut: ${esc(Q.t)}</p>`;return}
  t(Q,body,API);
}
/* „Am nevoie de un indiciu”: în exersare e gratis; la verificare, răspunsul nu mai e „din prima” (2 stele max.) */
function ajutorButon(Q,body){
  const w=document.createElement('div');w.className='ajutor';
  w.innerHTML=`<button class="btn ghost sm" type="button">Am nevoie de un indiciu</button><div class="ajutor-t" hidden>${Q.ajutor}</div>`;
  body.parentNode.insertBefore(w,body);
  const b=w.querySelector('button'),t=w.querySelector('.ajutor-t');
  b.onclick=()=>{t.hidden=false;b.remove();if(R.mode==='test')R.indiciu[R.qi]=true;noteaza(R.li,l=>{l.ind=(l.ind||0)+1})};   // ind: indicii CERUTE (nu și cele deschise singure după o greșeală)
}
/* ATELIERUL: aplicația simulată (tip-html, tip-foaie…), fără puncte; testele simulatorului arată ce e gata */
function atelierPage(){
  const Lv=C.nivele[R.li],A=Lv.atelier,AR=aplicatieReala(Lv);R.atelierVazut=true;
  noteaza(R.li,l=>{if(l.at===1&&l.ul==='atelier')return false;l.at=1;l.ul='atelier'});   /* atelierul deschis (at), ultimul pas (ul) */
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · atelier</div>
    <h2 style="margin:8px 0 6px">${esc(A.titlu||'Fă-o ca în aplicația reală')}</h2>
    ${A.intro?`<div class="reading">${A.intro}</div>`:''}
    <section class="incearca atelier"><div class="q" id="pq"></div><div id="body"></div><div id="fb" aria-live="polite"></div><div class="row" id="nav"></div></section>
    <div class="row pas-nav" style="margin-top:22px">
      <button class="btn" id="pas-prev" type="button">← Înapoi la pași</button>
      <button class="btn primary" id="go" type="button">${AR?esc(numeReal(Lv,'Acum în aplicația adevărată'))+' →':'La verificare →'}</button>
    </div>`,tabsFor());
  document.getElementById('pas-prev').onclick=()=>{R.si=Lv.pasi.length-1;R.phase='learn';learnPage()};
  document.getElementById('go').onclick=()=>{R.mode='test';if(AR){R.phase='real';realPage()}else{R.phase='q';question()}};
  renderPractice([A].concat(A.inca||[]),'atelier');
}
/* MODUL LECȚIE: „Acum în aplicația adevărată” - după atelier, înainte de verificare (standardul lecției, 27.09.2026).
   Pașii sunt cei din `aplicatieReala.pasi` (sau `diploma.provocare`); fără puncte, elevul îi face în aplicația reală. */
function realPage(){
  const Lv=C.nivele[R.li],A=aplicatieReala(Lv);
  if(!A){R.phase='q';question();return}
  R.realVazut=true;noteaza(R.li,l=>{if(l.re===1&&l.ul==='real')return false;l.re=1;l.ul='real'});   /* Aplicația văzută (re), ultimul pas (ul) */
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · ${esc(A.titlu||'în aplicația adevărată')}</div>
    <h2 style="margin:8px 0 6px">${esc(A.titlu||'Acum în aplicația adevărată')}</h2>
    <div class="reading">${A.intro||(A.titlu?'<p>Ai exersat în simulator. Acum faci același lucru pe bune. Urmează pașii de mai jos, unul câte unul.</p>':'<p>Ai exersat în simulator. Acum faci același lucru pe bune, în aplicația adevărată. Urmează pașii de mai jos, unul câte unul.</p>')}</div>
    ${A.aplicatie?`<p class="hint" style="margin:0 0 6px">Unde lucrezi: <b>${esc(A.aplicatie)}</b></p>`:''}
    ${telefonFisier(A)}
    <ol class="check aplicatie-reala">${A.pasi.map(x=>`<li>${x}</li>`).join('')}</ol>
    <p class="hint">Nu ai acum calculatorul în față? Treci la verificare; pașii îi găsești din nou pe diplomă.</p>
    <div class="row pas-nav" style="margin-top:22px">
      <button class="btn" id="pas-prev" type="button">${Lv.atelier?'← Înapoi la atelier':'← Înapoi la pași'}</button>
      <button class="btn primary" id="go" type="button">La verificare →</button>
    </div>`,tabsFor());
  document.getElementById('pas-prev').onclick=()=>{if(Lv.atelier){R.phase='atelier';atelierPage()}else{R.si=Lv.pasi.length-1;R.phase='learn';learnPage()}};
  document.getElementById('go').onclick=()=>{R.mode='test';R.phase='q';question()};
}
function readPage(){
  const Lv=C.nivele[R.li];
  noteaza(R.li,l=>{if(l.ul==='citire')return false;l.ul='citire'});   /* ultimul pas (ul) */
  const intro=Lv.bazin
    ?`<p class="lede" style="margin:0 0 14px">${Lv.qs.length} întrebări alese la întâmplare din ${Lv.bazin.length}. La fiecare reluare primești altele, pe aceleași lucruri din lecții.</p>${Lv.text?`<div class="peek reading" style="display:block"><div class="lbl">Amintește-ți</div>${Lv.text}</div>`:''}`
    :`<div class="reading">${Lv.text}</div>`;
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · ${Lv.bazin?'pregătire':'pagina de citit'}</div>
    <h2 style="margin:8px 0 18px">${esc(Lv.t)}</h2>
    ${intro}
    <div class="row" style="margin-top:10px"><button class="btn primary" id="go" type="button">${Lv.bazin?'Încep runda →':'Am citit — la întrebări →'}</button>
    <span class="hint">${Lv.qs.length} întrebări${Lv.text?' · pagina se poate reciti oricând':''}</span></div>`,tabsFor());
  document.getElementById('go').onclick=()=>{R.phase='q';question()};
}
function question(){
  const Lv=C.nivele[R.li],Q=Lv.qs[R.qi];R.mode='test';R.att=R.atts[R.qi]||0;R.done=false;R.max=Math.max(R.max,R.qi);
  const qn=R.qi+1;R.qm=Math.max(R.qm||0,qn);R.proaspat=!R.punctat[R.qi];   /* proaspăt = nerezolvată încă în deschiderea asta */
  /* RĂSPUNSURI PREA RAPIDE (10.10.2026, contramăsura P5 din pacaleli_si_contramasuri.md): cronometrul pornește la PRIMA
     afișare a întrebării în deschiderea asta și se oprește la primul răspuns (resolve). Se cronometrează DOAR întrebările pe
     care elevul nu le atinsese niciodată (peste qm0): una deja văzută (reîncărcare, „Pasul anterior”, alt aparat cu cod,
     reluare) poate primi un răspuns rapid cinstit, din memorie. endLevel trimite câte au fost sub 3 s, din câte. */
  if(R.tq&&qn>R.qm0&&!R.punctat[R.qi]&&R.tq[R.qi]==null)R.tq[R.qi]=Date.now();
  noteaza(R.li,l=>{const ul='q'+qn;if(numar(l.qm)>=qn&&l.ul===ul)return false;   /* cea mai mare întrebare atinsă (qm), ultimul pas (ul) */
    l.qm=Math.max(numar(l.qm),qn);l.ul=ul});
  const sarite=R.proaspat&&Lv.qs.some((_,k)=>k<R.qi&&!R.punctat[k]);   /* a intrat direct aici (bara, „Continuă”): vezi showNext */
  const tn=textNivel(Lv),inapoiLa=R.qi?String(R.qi-1):Lv.pasi?(aplicatieReala(Lv)?'real':Lv.atelier?'atelier':'p'+(Lv.pasi.length-1)):'citire';
  shell(`
    <div class="row" style="justify-content:space-between"><div class="eyebrow">${nivelEticheta(R.li)} · ${Lv.pasi?'verificare · ':''}${esc(Lv.t)}</div>
    <span class="row" style="gap:6px"><button class="btn ghost sm" id="inapoi" type="button" title="${R.qi?`Înapoi la întrebarea ${R.qi}`:'Înapoi'}">← Pasul anterior</button>
    <button class="btn ghost sm" id="peekb" type="button" aria-expanded="false" ${tn?'':'hidden'}>${Lv.bazin?'Amintește-ți':Lv.pasi?'Recitește pașii':'Recitește pagina'}</button></span></div>
    ${R.qi===0&&Lv.pasi?'<p class="hint" style="margin:6px 0 0">Acum verifici ce ai învățat în pași. Primești stele pentru răspunsurile corecte din prima; poți cere oricând un indiciu sau reciti pașii.</p>':''}
    ${R.punctat[R.qi]?'<p class="hint" style="margin:6px 0 0">Refaci un pas deja rezolvat: exersezi, dar punctele le-ai primit deja.</p>':''}
    ${sarite?'<p class="hint" style="margin:6px 0 0">Întrebările de dinainte le rezolvi și pe ele înainte de final: stelele se dau pe toate.</p>':''}
    <div class="peek reading" id="peek" hidden>${tn}</div>
    <div class="stack" style="margin-top:14px">
      <div class="q">${Q.q}</div>
      <div id="body"></div>
      <div id="fb" aria-live="polite"></div>
      <div class="row" id="nav"></div>
    </div>`,tabsFor());
  document.getElementById('inapoi').onclick=()=>mergiLa(inapoiLa);
  const pb=document.getElementById('peekb'),pk=document.getElementById('peek');
  pb.onclick=()=>{pk.hidden=!pk.hidden;pb.setAttribute('aria-expanded',String(!pk.hidden));pb.textContent=pk.hidden?(Lv.bazin?'Amintește-ți':Lv.pasi?'Recitește pașii':'Recitește pagina'):'Ascunde'};
  const t=TIPURI[Q.t];
  if(!t){document.getElementById('body').innerHTML=`<p class="toast">Tip de întrebare necunoscut: ${esc(Q.t)}</p>`;return}
  const body=document.getElementById('body');
  if(Q.ajutor&&!R.punctat[R.qi])ajutorButon(Q,body);
  t(Q,body,API);
}
function feedback(kind,html){document.getElementById('fb').innerHTML=`<div class="fb ${kind}">${html}</div>`}
/* exersarea (pași, atelier): fără puncte; după o greșeală apare singur indiciul, după corect „încă unul” */
function resolvePractice(correct,msg){
  const Q=R.pQ;if(R.done)return;
  if(correct){R.done=true;feedback('ok',`<strong>Corect!</strong>${Q.why?'<br>'+Q.why:''}`);practiceNext()}
  else{R.att++;
    const w=document.querySelector('.ajutor .ajutor-t');
    if(w&&w.hidden&&R.att>=1){w.hidden=false;const b=document.querySelector('.ajutor button');if(b)b.remove()}
    feedback('bad',`<strong>Nu încă.</strong> ${msg||''}${Q.ajutor&&R.att===1?' <em>Uită-te la indiciul de mai sus.</em>':''}`)}
}
function practiceNext(){
  const n=R.pList.length,k=(R.pv[R.pKey]||0)%n,nav=document.getElementById('nav');
  if(n>1){nav.insertAdjacentHTML('beforeend',`<button class="btn" id="inca" type="button">Încă un exercițiu (${k+1<n?`${n-k-1} ${n-k-1===1?'rămas':'rămase'}`:'o iei de la primul'})</button>`);
    document.getElementById('inca').onclick=()=>{R.pv[R.pKey]=k+1;renderPractice(R.pList,R.pKey);document.getElementById('pq').scrollIntoView({behavior:'smooth',block:'center'})}}
  if(R.pKey==='atelier')R.atelierGata=true;
}
function resolve(correct,msg){
  if(R.mode==='practice')return resolvePractice(correct,msg);
  const Q=C.nivele[R.li].qs[R.qi];
  if(R.done)return;
  /* primul răspuns la o întrebare cronometrată (vezi „RĂSPUNSURI PREA RAPIDE” la question): cât a trecut de la afișare */
  if(R.tq&&R.tq[R.qi]!=null&&R.tr[R.qi]==null&&!R.punctat[R.qi])R.tr[R.qi]=Math.max(0,Date.now()-R.tq[R.qi]);
  if(R.punctat[R.qi]){   // pas refăcut după „Pasul anterior”: doar exercițiu, fără XP a doua oară
    if(correct){R.done=true;feedback('ok',`<strong>Corect!</strong> (punctele pentru pasul ăsta le-ai primit deja)<br>${Q.why}`);showNext()}
    else{R.att++;feedback('bad',`<strong>Nu încă.</strong> ${msg||''}`)}
    setHud();return;
  }
  if(correct){
    R.punctat[R.qi]=true;
    const dinPrima=R.att===0&&!R.indiciu[R.qi];
    let pts=dinPrima?10:R.att===0?7:4;
    if(dinPrima){R.first++;R.streak++;if(R.streak>=3)pts+=2}else R.streak=0;
    R.xp+=pts;R.done=true;
    feedback('ok',`<strong>Corect! +${pts} XP${dinPrima&&R.streak>=3?' (cu bonus de serie)':''}${!dinPrima&&R.att===0?' (cu indiciu)':''}</strong><br>${Q.why}`);
    showNext();
  }else{R.att++;R.atts[R.qi]=R.att;R.streak=0;feedback('bad',`<strong>Nu încă.</strong> ${msg||''}`)}
  setHud();
}
function giveUp(html){
  if(R.mode==='practice'){R.done=true;feedback('bad',`<strong>Uite răspunsul:</strong> ${html}${R.pQ.why?'<br>'+R.pQ.why:''}<br><em>Încearcă și exercițiul următor, ca să vezi dacă ai prins ideea.</em>`);practiceNext();return}
  const Q=C.nivele[R.li].qs[R.qi];R.done=true;if(!R.punctat[R.qi]){R.punctat[R.qi]=true;R.streak=0};feedback('bad',`<strong>Răspunsul corect:</strong> ${html}<br>${Q.why}`);showNext();setHud()}
/* SĂRITE (10.10.2026): bara ține minte întrebările atinse, deci elevul poate intra direct la Î3 (din bară, din „Continuă
   de unde ai rămas”, din ?pas=q3). Cele de dinainte nu sunt rezolvate în deschiderea asta, iar stelele și prima
   încercare (p1) se socotesc pe toate: la ultima întrebare butonul îl duce întâi la prima nerezolvată, iar când nu mai
   e niciuna, „Termină nivelul”. Pe drumul obișnuit (Î1, Î2… la rând) totul e ca înainte. */
function showNext(){
  if(R.mode==='practice')return;
  const qs=C.nivele[R.li].qs,last=R.qi===qs.length-1,lipsa=qs.findIndex((_,k)=>!R.punctat[k]),gata=lipsa<0&&(last||R.proaspat);
  document.getElementById('nav').innerHTML=`<button class="btn primary" id="next" type="button">${gata?'Termină nivelul':last?`Mai ai de rezolvat: Î${lipsa+1} →`:'Mai departe →'}</button>`;
  const n=document.getElementById('next');n.focus({preventScroll:true});
  n.onclick=()=>{if(gata)endLevel();else if(last){R.qi=lipsa;question()}else{R.qi++;question()}};
}
function revealButton(fn){
  const nav=document.getElementById('nav');
  if(R.att>=2&&!R.done&&!document.getElementById('reveal')){
    const b=document.createElement('button');b.className='btn ghost';b.id='reveal';b.type='button';b.textContent='Arată-mi răspunsul';
    b.onclick=()=>{if(R)noteaza(R.li,l=>{l.ara=(l.ara||0)+1});fn()};nav.appendChild(b);   // ara: de câte ori a cerut răspunsul
  }
}
function checkButton(fn,label){
  const nav=document.getElementById('nav');
  nav.innerHTML=`<button class="btn primary" id="chk" type="button">${label||'Verifică'}</button>`;
  document.getElementById('chk').onclick=()=>{if(!R.done)fn()};
  return nav;
}
const API={esc,resolve,giveUp,revealButton,checkButton,feedback,shuffle,expandRange,
  done:()=>!!(R&&R.done),attempts:()=>R?R.att:0,nav:()=>document.getElementById('nav')};

/* ---------------- tipurile incluse ---------------- */
TIPURI.choice=function(Q,body){
  const order=Q.amesteca===false?Q.o.map((_,k)=>k):shuffle(Q.o.map((_,k)=>k));
  body.innerHTML=`<div class="opts">${order.map(k=>`<button class="opt" type="button" data-k="${k}">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
  const bs=[...body.querySelectorAll('.opt')];
  bs.forEach(b=>b.onclick=()=>{
    if(R.done)return;const k=+b.dataset.k;
    if(k===Q.ok){b.classList.add('ok');bs.forEach(x=>x.disabled=true);resolve(true)}
    else{b.classList.add('bad');b.disabled=true;resolve(false,'Mai încearcă. Dacă ai nevoie, recitește pagina.');
      if(R.att>=2){bs.forEach(x=>x.disabled=true);body.querySelector(`.opt[data-k="${Q.ok}"]`).classList.add('ok');giveUp(Q.html?Q.o[Q.ok]:esc(Q.o[Q.ok]))}}
  });
};
REZOLVA.choice=(Q,body)=>body.querySelector(`.opt[data-k="${Q.ok}"]`).click();
TIPURI.tf=(Q,body)=>TIPURI.choice({...Q,o:['Adevărat','Fals'],ok:Q.ok?0:1,amesteca:false},body);
REZOLVA.tf=(Q,body)=>body.querySelector(`.opt[data-k="${Q.ok?0:1}"]`).click();

TIPURI.order=function(Q,body){
  const n=Q.items.length;let pool=shuffle(Q.items.map((_,k)=>k));
  if(pool.every((v,k)=>v===k))pool.reverse();
  let picked=[];
  function draw(){
    body.innerHTML=`<div class="twocol">
      <div><div class="lbl">Pașii amestecați · apasă-i în ordine</div><div class="pool">${pool.filter(k=>!picked.includes(k)).map(k=>`<button class="opt" type="button" data-k="${k}">${esc(Q.items[k])}</button>`).join('')||'<span class="hint">Ai folosit toți pașii.</span>'}</div></div>
      <div><div class="lbl">Ordinea ta</div><div class="slots">${Array.from({length:n},(_,i)=>`<div class="slot ${picked[i]!==undefined?'full':''}"><b>${i+1}</b>${picked[i]!==undefined?esc(Q.items[picked[i]]):'—'}</div>`).join('')}</div></div>
    </div>`;
    body.querySelectorAll('.pool .opt').forEach(b=>b.onclick=()=>{if(R.done)return;picked.push(+b.dataset.k);draw()});
    if(R.done)return;
    const nav=document.getElementById('nav');
    nav.innerHTML=`<button class="btn primary" id="chk" type="button" ${picked.length<n?'disabled':''}>Verifică</button><button class="btn ghost" id="clr" type="button">Golește</button>`;
    document.getElementById('clr').onclick=()=>{picked=[];draw()};
    document.getElementById('chk').onclick=()=>{
      const good=picked.filter((v,i)=>v===i).length;
      if(good===n)resolve(true);else{resolve(false,`${good} din ${n} pași sunt la locul lor.`);picked=[];draw()}
    };
    revealButton(()=>{picked=Q.items.map((_,k)=>k);giveUp(Q.items.map(esc).join(' → '));draw()});
  }
  draw();
};
REZOLVA.order=(Q,body)=>{for(let k=0;k<Q.items.length;k++)body.querySelector(`.pool .opt[data-k="${k}"]`).click()};

TIPURI.classify=function(Q,body){
  const choice=Q.items.map(()=>null);
  body.innerHTML=`<div class="cls">${Q.items.map((it,k)=>`<div class="cls-row" data-k="${k}"><span class="val">${esc(it[0])}</span><span class="seg" role="group" aria-label="Categoria pentru ${esc(it[0])}">${Q.cats.map((c,ci)=>`<button type="button" data-c="${ci}" aria-pressed="false">${esc(c)}</button>`).join('')}</span></div>`).join('')}</div>`;
  body.querySelectorAll('.cls-row').forEach(row=>{
    const k=+row.dataset.k;
    row.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      if(R.done)return;choice[k]=+b.dataset.c;
      row.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});
      row.classList.remove('wrong','right');
    });
  });
  const nav=checkButton(()=>{
    if(choice.some(c=>c===null)){feedback('bad','<strong>Mai ai rânduri fără categorie.</strong> Alege câte una pentru fiecare.');return}
    let bad=0;
    body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k,ok=choice[k]===Q.items[k][1];row.classList.toggle('wrong',!ok);row.classList.toggle('right',ok);if(!ok)bad++});
    if(!bad){nav.innerHTML='';resolve(true)}
    else{resolve(false,`${bad} ${bad===1?'rând are':'rânduri au'} categoria greșită (marcate cu roșu).`);
      revealButton(()=>{body.querySelectorAll('.cls-row').forEach(row=>{const k=+row.dataset.k;row.classList.remove('wrong');row.classList.add('right');row.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.c===Q.items[k][1]))});nav.innerHTML='';giveUp('categoriile corecte sunt marcate acum.')})}
  });
};
REZOLVA.classify=(Q,body)=>Q.items.forEach((it,k)=>body.querySelector(`.cls-row[data-k="${k}"] button[data-c="${it[1]}"]`).click());

TIPURI.match=function(Q,body){
  const n=Q.pairs.length,left=shuffle(Q.pairs.map((_,k)=>k)),right=shuffle(Q.pairs.map((_,k)=>k));
  const link={};let sel=null;
  function draw(){
    const used=new Set(Object.values(link));
    body.innerHTML=`<div class="twocol match">
      <div><div class="lbl">Apasă întâi aici…</div><div class="pool">${left.map(k=>`<button class="opt ${sel===k?'on':''} ${k in link?'paired':''}" type="button" data-l="${k}">${k in link?`<span class="tag">${right.indexOf(link[k])+1}</span>`:''}${esc(Q.pairs[k][0])}</button>`).join('')}</div></div>
      <div><div class="lbl">…apoi perechea</div><div class="pool">${right.map((k,i)=>`<button class="opt ${used.has(k)?'paired':''}" type="button" data-r="${k}"><span class="tag">${i+1}</span>${esc(Q.pairs[k][1])}</button>`).join('')}</div></div>
    </div><p class="hint" style="margin:6px 0 0">Ai făcut ${Object.keys(link).length} din ${n} perechi. Apasă din nou pe un element din stânga ca să schimbi perechea.</p>`;
    body.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{if(R.done)return;const k=+b.dataset.l;if(k in link&&sel!==k){delete link[k]}sel=k;draw()});
    body.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{if(R.done||sel===null)return;const r=+b.dataset.r;for(const x in link)if(link[x]===r)delete link[x];link[sel]=r;sel=null;draw()});
  }
  draw();
  const nav=checkButton(()=>{
    if(Object.keys(link).length<n){feedback('bad',`<strong>Mai ai perechi de făcut.</strong> Leagă toate cele ${n} elemente.`);return}
    const bad=Object.keys(link).filter(k=>+k!==link[k]).length;
    if(!bad){nav.innerHTML='';resolve(true)}
    else{resolve(false,`${bad} ${bad===1?'pereche e greșită':'perechi sunt greșite'}. Schimbă-le și verifică din nou.`);
      revealButton(()=>{Q.pairs.forEach((_,k)=>link[k]=k);sel=null;draw();nav.innerHTML='';giveUp(Q.pairs.map(p=>`${esc(p[0])} → ${esc(p[1])}`).join('; '))})}
  });
};
REZOLVA.match=(Q,body)=>{for(let k=0;k<Q.pairs.length;k++){body.querySelector(`[data-l="${k}"]`).click();body.querySelector(`[data-r="${k}"]`).click()}};

/* hunt cu `cod:true` (26.09.2026, el: „ar trebui indentare și aliniere la stânga”): codul se arată ca în editor,
   pe rânduri, cu indentarea păstrată; `corect:'…'` = codul fără greșeli, arătat alături după răspuns. */
function huntCod(Q,body){
  const T=[],re=/\[\[([\s\S]*?)\|([\s\S]*?)\]\]/g;let last=0,m;
  const plain=s=>s.split(/(\s+)/).forEach(p=>{if(p!=='')T.push(/^\s+$/.test(p)?{x:p,ws:true,err:false}:{x:p,err:false})});
  while((m=re.exec(Q.src))){plain(Q.src.slice(last,m.index));T.push({x:m[1],err:true,why:m[2]});last=re.lastIndex}
  plain(Q.src.slice(last));
  HUNT_T=T;
  const total=T.filter(t=>t.err).length;
  // o greșeală cu spații (<a src="x">) se desenează cuvânt cu cuvânt, ca restul codului: un buton lung ar trăda răspunsul
  const btn=(k,x)=>`<button type="button" class="tk" data-k="${k}">${esc(x)}</button>`;
  body.innerHTML=`<pre class="hunt cod">${T.map((t,k)=>t.ws?esc(t.x):t.err&&/\s/.test(t.x)?t.x.split(/(\s+)/).filter(p=>p!=='').map(p=>/^\s+$/.test(p)?esc(p):btn(k,p)).join(''):btn(k,t.x)).join('')}</pre>
    <p class="hint" style="margin:6px 0 0">Ai marcat <span id="cnt">0</span> din ${total}. Apasă din nou ca să scoți un marcaj.</p>`;
  const marked=new Set();
  body.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{if(R.done)return;const k=+b.dataset.k,on=!marked.has(k);on?marked.add(k):marked.delete(k);body.querySelectorAll(`.tk[data-k="${k}"]`).forEach(x=>x.classList.toggle('marked',on));document.getElementById('cnt').textContent=marked.size});
  const list=()=>`<ul style="margin:.4em 0 0;padding-left:1.2em">${T.map(t=>t.err?`<li><span class="code">${esc(t.x)}</span> — ${esc(t.why)}</li>`:'').join('')}</ul>`
    +(Q.corect?`<div class="cod-corect"><div class="lbl">Codul corect</div><pre class="hunt cod">${esc(Q.corect)}</pre></div>`:'');
  const showFound=()=>{body.querySelectorAll('.tk').forEach(b=>{b.classList.remove('marked');if(T[+b.dataset.k].err)b.classList.add('found')})};
  const nav=checkButton(()=>{
    const hit=[...marked].filter(k=>T[k].err).length,wrong=marked.size-hit;
    if(hit===total&&wrong===0){showFound();nav.innerHTML='';resolve(true);document.querySelector('#fb .fb').insertAdjacentHTML('beforeend',list())}
    else{resolve(false,`Ai găsit ${hit} din ${total}${wrong?`, iar ${wrong} ${wrong===1?'marcaj e':'marcaje sunt'} pe cod corect`:''}.${Q.indiciu?' '+esc(Q.indiciu):''}`);
      revealButton(()=>{showFound();nav.innerHTML='';giveUp(`toate cele ${total} sunt marcate cu verde.`+list())})}
  });
}
TIPURI.hunt=function(Q,body){
  if(Q.cod)return huntCod(Q,body);
  const toks=[],re=/\[\[(.*?)\|(.*?)\]\]/g;let last=0,m;
  const plain=s=>s.split(/( )/).forEach(p=>{if(p!=='')toks.push({x:p,err:false})});
  while((m=re.exec(Q.src))){plain(Q.src.slice(last,m.index));toks.push({x:m[1],err:true,why:m[2]});last=re.lastIndex}
  plain(Q.src.slice(last));
  const T=[];toks.forEach(t=>{
    if(t.err&&t.x.trim()&&t.x!==t.x.trim()){const lead=t.x.match(/^ */)[0].length,trail=t.x.match(/ *$/)[0].length;
      for(let i=0;i<lead;i++)T.push({x:' ',err:false});T.push({x:t.x.trim(),err:true,why:t.why});for(let i=0;i<trail;i++)T.push({x:' ',err:false});}
    else T.push(t);
  });
  HUNT_T=T;
  const total=T.filter(t=>t.err).length,dots=!!Q.spatii;
  /* O greșeală cu mai multe cuvinte se desenează tot cuvânt cu cuvânt, ca textul corect: un buton lung ar trăda
     răspunsul prin lungime (semnalat de evaluator, 15.09.2026). Toate cuvintele ei au același data-k și se marchează împreună. */
  const btn=(k,x,sp)=>`<button type="button" class="tk ${sp?'sp':''}" data-k="${k}" aria-label="${sp?(x.length>1?'spațiu dublu':'spațiu'):esc(x)}">${sp?x.replace(/ /g,'·'):esc(x)}</button>`;
  body.innerHTML=`<div class="hunt">${T.map((t,k)=>{const sp=!t.x.trim();
    if(sp&&!t.err&&!dots)return ' ';
    if(sp||!t.err||!/ /.test(t.x))return btn(k,t.x,sp);
    return t.x.split(/( )/).filter(p=>p!=='').map(p=>p===' '?(dots?btn(k,p,true):' '):btn(k,p,false)).join('');
  }).join('')}</div>
    <p class="hint" style="margin:6px 0 0">Ai marcat <span id="cnt">0</span> din ${total}. Apasă din nou ca să scoți un marcaj.</p>`;
  const marked=new Set();
  body.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{if(R.done)return;const k=+b.dataset.k;const on=!marked.has(k);on?marked.add(k):marked.delete(k);
    body.querySelectorAll(`.tk[data-k="${k}"]`).forEach(x=>x.classList.toggle('marked',on));document.getElementById('cnt').textContent=marked.size});
  const list=()=>`<ul style="margin:.4em 0 0;padding-left:1.2em">${T.map(t=>t.err?`<li><span class="code">${t.x.trim()?esc(t.x):t.x.replace(/ /g,'·')}</span> — ${esc(t.why)}</li>`:'').join('')}</ul>`;
  const showFound=()=>{body.querySelectorAll('.tk').forEach(b=>{b.classList.remove('marked');if(T[+b.dataset.k].err)b.classList.add('found')})};
  const nav=checkButton(()=>{
    const hit=[...marked].filter(k=>T[k].err).length,wrong=marked.size-hit;
    if(hit===total&&wrong===0){showFound();nav.innerHTML='';resolve(true);document.querySelector('#fb .fb').insertAdjacentHTML('beforeend',list())}
    else{resolve(false,`Ai găsit ${hit} din ${total}${wrong?`, iar ${wrong} ${wrong===1?'marcaj e':'marcaje sunt'} pe text corect`:''}.${Q.indiciu?' '+esc(Q.indiciu):''}`);
      revealButton(()=>{showFound();nav.innerHTML='';giveUp(`toate cele ${total} sunt marcate cu verde.`+list())})}
  });
};
let HUNT_T=[];
REZOLVA.hunt=(Q,body)=>{const seen=new Set();body.querySelectorAll('.tk').forEach(b=>{const k=+b.dataset.k;if(HUNT_T[k].err&&!seen.has(k)){seen.add(k);b.click()}})};

TIPURI.pick=function(Q,body){
  let a=null,b=null;
  const label=()=>{if(!a)return '—';if(!Q.range||!b)return a;const r=expandRange(a,b);return r[0]+':'+r[r.length-1]};
  const inSel=ad=>a&&(!b?ad===a:expandRange(a,b).includes(ad));
  function draw(){
    let h=`<div class="gridwrap"><table class="g"><thead><tr><th></th>`;
    for(let c=0;c<Q.cols;c++)h+=`<th>${L(c)}</th>`;
    h+='</tr></thead><tbody>';
    for(let r=1;r<=Q.rows;r++){h+=`<tr><th>${r}</th>`;for(let c=0;c<Q.cols;c++){const ad=L(c)+r,txt=Q.cells&&Q.cells[ad]!=null?esc(Q.cells[ad]):'';h+=`<td class="${inSel(ad)?(ad===a&&!b?'pick':'inr'):''}"><button type="button" data-a="${ad}" aria-label="Celula ${ad}">${txt}</button></td>`}h+='</tr>'}
    body.innerHTML=`<p class="hint" style="margin:0 0 6px">Ai ales: <strong class="code">${label()}</strong></p>`+h+'</tbody></table></div>'+(Q.range?'<p class="hint" style="margin:6px 0 0">Primul clic = un colț, al doilea = colțul opus. Al treilea clic o ia de la capăt.</p>':'');
    body.querySelectorAll('.g button').forEach(x=>x.onclick=()=>{if(R.done)return;const ad=x.dataset.a;if(!Q.range||!a||b){a=ad;b=null}else b=ad;draw()});
  }
  draw();
  const nav=checkButton(()=>{
    const got=label();
    if(got===Q.ans){nav.innerHTML='';resolve(true)}
    else{resolve(false,got==='—'?'Nu ai ales nimic încă.':`Ai ales ${got}. Caută întâi coloana (litera de sus), apoi rândul (numărul din stânga).`);
      revealButton(()=>{const p=Q.ans.split(':');a=p[0];b=p[1]||null;draw();nav.innerHTML='';giveUp(Q.ans)})}
  });
};
REZOLVA.pick=(Q,body)=>{const p=Q.ans.split(':');body.querySelector(`.g button[data-a="${p[0]}"]`).click();if(p[1])body.querySelector(`.g button[data-a="${p[1]}"]`).click()};

/* ---------------- final de nivel + diplomă ---------------- */
function endLevel(){
  const Lv=C.nivele[R.li],n=Lv.qs.length,ratio=R.first/n,stars=ratio===1?3:ratio>=.6?2:1;
  scurge();   // secundele nivelului, înainte de notele de final
  const prev=S.lv[R.li],dinainte=facut(prev);   // prev poate fi și o intrare „văzut” (fără stele), cu istoricul ei
  const deoparte=inAsteptare(),peDisc=deoparte?null:((citesteJoc(SK)||{}).lv||{})[R.li];   // altă filă îl poate fi terminat
  const terminatInainte=dinainte||facut(peDisc);
  S.lv[R.li]=ordonat(Object.assign({},prev,{stars:Math.max(stars,dinainte?prev.stars:0),xp:Math.max(R.xp,(prev&&prev.xp)||0)}));
  save();R.phase='end';
  /* PRIMA încercare (p1): doar la primul final al nivelului (nici în memorie, nici pe disc nu era terminat, iar fp nu
     spune că a fost terminat înainte de „Ia-o de la capăt”); cât stă „Ești tot X?”, merge în @_tinut și prezenta.js
     (mutaJoc) n-o dă lui X dacă X terminase deja nivelul */
  const bune=R.first;
  let primaTerminare=false;
  noteaza(R.li,l=>{l.ul='gata';if(!l.p1&&(deoparte||(!terminatInainte&&!l.fp))){l.p1={b:bune,t:n,c:Date.now()};primaTerminare=true}});
  if(C.nivele[R.li].bazin)marcheazaVazut(R.li,R.pick);
  const next=R.li+1<C.nivele.length;
  /* P5: câte întrebări cronometrate au avut primul răspuns sub 3 s (rap), din câte (rq); rel = nu e prima terminare a nivelului
     (reluarea nu dă semnul în panou: răspunsurile se știu). Fără nicio întrebare cronometrată, nivelul pleacă exact ca înainte. */
  const tr=Object.values(R.tr||{}),rapid=tr.length?{rap:tr.filter(x=>x<3000).length,rq:tr.length,...(primaTerminare&&!terminatInainte?{}:{rel:1})}:{};
  raporteaza({tip:'nivel',nivel:R.li+1,stele:S.lv[R.li].stars,max:3,...rapid});
  try{if(window.Prezenta&&window.Prezenta.salveaza)window.Prezenta.salveaza()}catch(x){}
  if(!dinainte&&C.nivele.every((_,i)=>facut(S.lv[i])))raporteaza({tip:'joc-gata',stele:totals().st,max:C.nivele.length*3});
  const LE=eLectie();
  shell(`
    <div class="eyebrow">${nivelEticheta(R.li)} · ${LE?`terminată${next?` · ${C.nivele.length-R.li-1===1?'mai e o parte':`mai sunt ${C.nivele.length-R.li-1} părți`}`:''}`:`terminat${(()=>{const rest=C.nivele.length-R.li-1,a=C.mod==='antrenament';return next?` · ${rest===1?(a?'mai e o rundă':'mai e un nivel'):`mai sunt ${rest} ${a?'runde':'niveluri'}`}`:` · ai terminat toate ${a?'rundele':'nivelurile'}`})()}`}</div>
    <div class="end-stars" style="margin:14px 0 6px" aria-label="${stars===1?'o stea':stars+' stele'} din 3">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div>
    <h2>${stars===3?'Perfect, toate din prima!':stars===2?'Foarte bine!':(C.mod==='antrenament'?'Rundă trecută. Poți lua mai multe stele.':LE?'Ai terminat lecția. Poți lua mai multe stele.':'Nivel trecut. Poți lua mai multe stele.')}</h2>
    <p class="lede">${R.first} din ${n} răspunsuri corecte din prima · ${R.xp} XP.${stars<3?(C.mod==='antrenament'?' Reia runda: primești alte întrebări pe aceleași lucruri.':LE?' Recitește pașii și reia lecția pentru 3 stele.':' Recitește pagina și reia nivelul pentru 3 stele.'):''}</p>
    <div class="row" style="margin-top:20px">
      ${next?`<button class="btn primary" id="nx" type="button">${C.mod==='antrenament'?'Runda următoare':LE?'Partea următoare':'Nivelul următor'} →</button>`:'<button class="btn primary" id="dp" type="button">Vezi diploma</button>'}
      <button class="btn" id="again" type="button">${C.mod==='antrenament'?'Reia runda (alte întrebări)':LE?'Reia lecția':'Reia nivelul'}</button>
      <button class="btn ghost" id="toc" type="button">${LE?'Începutul lecției':'Cuprins'}</button>
    </div>`,tabsFor());
  const nx=document.getElementById('nx');if(nx)nx.onclick=()=>startLevel(R.li+1);
  const dp=document.getElementById('dp');if(dp)dp.onclick=diploma;
  document.getElementById('again').onclick=()=>startLevel(R.li);
  document.getElementById('toc').onclick=home;
}
function diploma(){
  scurge();R=null;const t=totals(),d=new Date(),D=C.diploma;
  const data=`${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  /* modul lecție: „a terminat lecția 4”, iar pașii din aplicația adevărată (făcuți ÎNAINTE de verificare) se repetă pe scurt, restrânși */
  const LE=eLectie(),AR=LE?aplicatieReala(C.nivele[C.nivele.length-1]):null;
  const cePrin=LE?`a terminat lecția ${esc(lectieInfo().nr)}, „${esc(C.titlu)}”: ${esc(D.rezumat)}.`
    :`a trecut toate cele ${C.nivele.length} ${C.mod==='antrenament'?'runde ale antrenamentului':'niveluri ale jocului'} „${esc(C.titlu)}”: ${esc(D.rezumat)}.`;
  const provocare=!LE?`<h3 style="margin-top:28px">Provocarea din ${esc(D.aplicatie)}</h3>
    <p class="hint" style="margin:4px 0 10px">Arată-i profesorului diploma, apoi fă asta pe bune:</p>
    <ol class="check">${D.provocare.map(x=>`<li>${x}</li>`).join('')}</ol>`
    :AR?`<h3 style="margin-top:28px">${esc(AR.titlu||'Acum în aplicația adevărată')}</h3>
    <p class="hint" style="margin:4px 0 10px">Ai văzut pașii înainte de verificare. Dacă nu i-ai făcut încă${AR.aplicatie?` (${esc(AR.aplicatie)})`:''}, fă-i acum și verifică-i singur cu lista de la ultimul pas.</p>
    <details class="real-recap"><summary>Pașii, încă o dată (${AR.pasi.length})</summary><ol class="check">${AR.pasi.map(x=>`<li>${x}</li>`).join('')}</ol></details>`:'';
  shell(`
    <div class="diploma">
      <div class="eyebrow">Diplomă</div>
      <h2 style="margin-top:6px">${esc(D.titlu)}</h2>
      <div class="nm">${esc(inAsteptare()?'— răspunde întâi jos —':(S.nume||'Elevul fără nume'))}</div>
      <p style="margin:0 auto 14px;max-width:46ch">${cePrin}</p>
      <div class="facts"><span>★ ${t.st}/${C.nivele.length*3}</span><span>${t.xp} XP</span><span>${data}</span></div>
    </div>
    ${trimiteHtml()}
    ${provocare}
    ${ghidButoane()}
    <div class="row" style="margin-top:16px"><button class="btn" id="toc" type="button">${LE?'Înapoi la începutul lecției':'Înapoi la cuprins'}</button><a class="btn ghost" href="../index.html">${LE?'Toate lecțiile clasei':'Toate jocurile'}</a></div>`);
  document.getElementById('toc').onclick=home;
  wireGhid();
  wireTrimite(t,data);
}

/* ---------------- diploma pe telefon + trimisă profesorului (24.09.2026) ----------------
   Calculatoarele din laborator sunt comune: nimeni nu se conectează acolo la e-mail sau WhatsApp.
   (1) Codul QR duce diploma pe TELEFONUL elevului (../diploma/#d=…): totul stă după „#”, deci
       nu trece prin niciun server; de acolo o salvează sau o trimite oriunde.
   (2) „Trimite-o profesorului”: școala + clasa + numele CRIPTAT cu cheia publică a profesorului
       (diplome-date.js, generat de C:\00\AI_0\tools\diplome.py) -> serverul testelor. Profesorul
       le descarcă cu `diplome.py descarca`, pe școli / clase / nume. */
function incarcaScript(nume){
  return new Promise((ok,nu)=>{const s=document.createElement('script');s.src=new URL(nume,MOTOR_URL).href;s.onload=ok;s.onerror=nu;document.head.appendChild(s)});
}
function trimiteHtml(){
  return `<div class="dipl-plus">
      <label for="d-nume">Numele tău, așa cum vrei să apară pe diplomă</label>
      <input id="d-nume" type="text" maxlength="40" autocomplete="off" value="${esc(inAsteptare()?'':S.nume)}" placeholder="ex. Ana Popescu">
      <div class="dipl-cols">
        <section class="dipl-qr"><h3>Ia diploma pe telefon</h3>
          <div id="d-qr" class="qr" aria-label="Cod QR pentru diplomă"></div>
          <p class="hint">Scanează codul cu camera telefonului. Diploma se deschide pe telefonul tău, de unde o salvezi sau o trimiți pe WhatsApp. <a id="d-link" href="#" target="_blank" rel="noopener">Sau deschide-o aici.</a></p>
        </section>
        <section class="dipl-prof"><h3>Trimite-o profesorului</h3>
          <label for="d-scoala">Școala</label><select id="d-scoala"><option value="">— alege —</option></select>
          <label for="d-clasa">Clasa</label><select id="d-clasa" disabled><option value="">— alege școala întâi —</option></select>
          <button class="btn primary" id="d-trimite" type="button" disabled>Trimite diploma</button>
          <p class="hint" id="d-stare" aria-live="polite"></p>
        </section>
      </div>
    </div>`;
}
function b64url(obj){const b=new TextEncoder().encode(JSON.stringify(obj));let s='';b.forEach(x=>s+=String.fromCharCode(x));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function wireTrimite(t,data){
  const $=id=>document.getElementById(id),D=C.diploma,inp=$('d-nume');if(!inp)return;
  let trimisa=false;
  const nume=()=>inp.value.trim();
  /* modul lecție: k:'lectie' + l:<nr>, ca pagina diploma/ să poată scrie „a terminat lecția 4” (azi le ignoră) */
  const payload=()=>Object.assign({n:nume(),t:D.titlu,j:C.titlu,u:C.mod==='antrenament'?'runde':'niveluri',v:C.nivele.length,s:t.st,m:C.nivele.length*3,x:t.xp,d:data,c:String(C.clasa)},
    eLectie()?{k:'lectie',l:lectieInfo().nr}:{});
  const linkTel=()=>new URL('../diploma/',MOTOR_URL).href+'#d='+b64url(payload());
  function qr(){
    const u=linkTel();$('d-link').href=u;
    if(!window.qrcode)return;
    try{const q=qrcode(0,'M');q.addData(u);q.make();$('d-qr').innerHTML=q.createSvgTag({cellSize:4,margin:2,scalable:true})}catch(e){$('d-qr').textContent='Codul QR nu s-a putut face - folosește „deschide-o aici”.'}
  }
  // cât stă „Ești tot X?”, diploma nu pleacă la profesor (ar pleca pe numele cui?): butonul e oprit, cu motivul scris
  const intreaba=()=>{if(!inAsteptare())return false;$('d-stare').textContent=`Răspunde întâi jos: ești tu ${numeIntrebat()}?`;return true};
  function poateTrimite(){$('d-trimite').disabled=trimisa||intreaba()||!(nume().split(/\s+/).length>=2&&$('d-clasa').value)}
  inp.addEventListener('input',()=>{S.nume=nume();save();const nm=app.querySelector('.diploma .nm');if(nm)nm.textContent=S.nume||'Elevul fără nume';qr();poateTrimite()});
  incarcaScript('qrcode.min.js').then(qr).catch(()=>qr());
  qr();intreaba();
  incarcaScript('diplome-date.js').then(()=>{
    const Z=window.DIPLOME;if(!Z||!Z.scoli)throw 0;
    $('d-scoala').insertAdjacentHTML('beforeend',Z.scoli.map(x=>`<option value="${esc(x.key)}">${esc(x.nume)}</option>`).join(''));
    $('d-scoala').onchange=()=>{const sc=Z.scoli.find(x=>x.key===$('d-scoala').value),cl=$('d-clasa');
      cl.innerHTML=sc?'<option value="">— alege —</option>'+sc.clase.map(c=>`<option>${esc(c)}</option>`).join(''):'<option value="">— alege școala întâi —</option>';
      cl.disabled=!sc;poateTrimite()};
    $('d-clasa').onchange=poateTrimite;
    $('d-trimite').onclick=async()=>{
      const st=$('d-stare'),bt=$('d-trimite');
      if(intreaba()){bt.disabled=true;return}
      if(nume().split(/\s+/).length<2){st.textContent='Scrie numele și prenumele.';return}
      bt.disabled=true;st.textContent='Se trimite…';
      try{
        const k=await crypto.subtle.importKey('jwk',Z.cheie,{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);
        const enc=new Uint8Array(await crypto.subtle.encrypt({name:'RSA-OAEP'},k,new TextEncoder().encode(nume())));
        let bin='';enc.forEach(x=>bin+=String.fromCharCode(x));
        const r=await fetch(Z.server,{method:'POST',body:JSON.stringify({scoala:$('d-scoala').value,clasa:$('d-clasa').value,joc:C.cheie,
          titluJoc:C.titlu,titlu:D.titlu,clasaJoc:String(C.clasa),stele:t.st,max:C.nivele.length*3,xp:t.xp,nivele:C.nivele.length,data,numeEnc:btoa(bin)})});
        const j=await r.json().catch(()=>({}));
        if(!r.ok||!j.ok)throw new Error(j.eroare||('HTTP '+r.status));
        trimisa=true;st.innerHTML='<b>✓ Trimisă.</b> Domnul profesor o primește în folderul clasei tale.';
      }catch(e){bt.disabled=false;st.textContent='Nu s-a trimis ('+(e.message||'fără internet')+'). Mai apasă o dată.'}
    };
  }).catch(()=>{if(!intreaba())$('d-stare').textContent='Lista claselor nu s-a încărcat. Reîncarcă pagina.'});
}

/* ---------------- ghidurile „n-am calculator, am telefon” ----------------
   Un ghid = drumul pas cu pas prin aplicația reală, cu o captură la fiecare pas.
   Capturile se fac pe un Android emulat (_motor\ghid_telefon.py) și stau în
   jocuri\_ghiduri\<id>\, ca să le folosească toate jocurile care cer același lucru.
   Jocul declară `ghiduri:['cont-drive','docs']` și încarcă fișierele lor de pași. */
const GHIDURI={};
function inregistreazaGhid(id,def){GHIDURI[id]=Object.assign({id},def)}
function ghidListaJoc(){return (C.ghiduri||[]).map(id=>GHIDURI[id]).filter(Boolean)}
function ghidButoane(){
  const g=ghidListaJoc();if(!g.length)return '';
  return `<div class="ghid-oferta">
    <p class="hint" style="margin:0 0 8px">Nu ai calculator acasă? Se poate și de pe telefon — îți arăt fiecare pas, cu poze de pe ecran:</p>
    <div class="row">${g.map(x=>`<button class="btn" type="button" data-ghid="${esc(x.id)}">${esc(x.buton||('Cum fac în '+x.app))} →</button>`).join('')}</div>
  </div>`;
}
function wireGhid(){app.querySelectorAll('[data-ghid]').forEach(b=>b.onclick=()=>ghidDeschide(b.dataset.ghid,0))}
function ghidDeschide(id,i){
  const G=GHIDURI[id];if(!G)return;
  R=null;const n=G.pasi.length;i=Math.max(0,Math.min(i,n-1));const P=G.pasi[i];
  shell(`
    <div class="eyebrow">Ghid pas cu pas · ${esc(G.app)}</div>
    <h2 style="margin-top:6px">${esc(G.titlu)}</h2>
    ${i===0&&G.intro?`<div class="lede" style="margin:10px 0 0">${G.intro}</div>`:''}
    <div class="ghid">
      <div class="telefon"><div class="telefon-ecran">
        <img src="${esc(P.img)}" alt="${esc(P.alt||P.t)}" width="${P.w||360}" height="${P.h||780}" loading="eager">
      </div></div>
      <div class="ghid-text">
        <div class="ghid-nr">Pasul ${i+1} din ${n}</div>
        <h3>${P.t}</h3>
        ${P.d?`<div class="reading" style="margin-top:8px">${P.d}</div>`:''}
        ${P.atentie?`<div class="fb bad" style="margin-top:10px"><strong>Atenție:</strong> ${P.atentie}</div>`:''}
        <div class="row" style="margin-top:16px">
          <button class="btn" id="g-prev" type="button" ${i===0?'disabled':''}>← Înapoi</button>
          ${i<n-1?'<button class="btn primary" id="g-next" type="button">Următorul pas →</button>':'<button class="btn primary" id="g-gata" type="button">Gata, am terminat</button>'}
        </div>
      </div>
    </div>
    <div class="ghid-pasi" aria-label="Toți pașii">${G.pasi.map((p,k)=>`<button type="button" class="gp${k===i?' on':''}" data-p="${k}"><span class="n">${k+1}</span><span class="t">${esc(p.t.replace(/<[^>]+>/g,''))}</span></button>`).join('')}</div>
    <div class="row" style="margin-top:18px"><button class="btn ghost" id="g-inapoi" type="button">Înapoi la diplomă</button></div>`);
  const prev=document.getElementById('g-prev');if(prev)prev.onclick=()=>ghidDeschide(id,i-1);
  const next=document.getElementById('g-next');if(next)next.onclick=()=>ghidDeschide(id,i+1);
  const gata=document.getElementById('g-gata');if(gata)gata.onclick=diploma;
  document.getElementById('g-inapoi').onclick=diploma;
  app.querySelectorAll('.gp').forEach(b=>b.onclick=()=>ghidDeschide(id,+b.dataset.p));
}

/* ---------------- bara de sus care se restrânge (mobil; revenire DOAR manuală) ---------------- */
function wireHeader(){
  const narrow=matchMedia('(max-width:600px)'),bar=document.querySelector('.hud-in'),cls=document.body.classList;
  let last=window.scrollY,acc=0;
  window.addEventListener('scroll',()=>{const y=window.scrollY,dd=y-last;last=y;if(!narrow.matches||dd<=0){acc=0;return}acc+=dd;if(acc>24&&y>80)cls.add('hdr-collapsed')},{passive:true});
  document.getElementById('hdr-pull').onclick=()=>cls.remove('hdr-collapsed');
  let startY=null,captured=false;
  bar.addEventListener('pointerdown',e=>{if(cls.contains('hdr-collapsed')){startY=e.clientY;captured=false}});
  bar.addEventListener('pointermove',e=>{if(startY===null)return;const dy=e.clientY-startY;if(!captured&&dy>10){try{bar.setPointerCapture(e.pointerId)}catch(_){}captured=true}if(dy>28){cls.remove('hdr-collapsed');startY=null}});
  bar.addEventListener('pointerup',()=>{startY=null});
  bar.addEventListener('pointercancel',()=>{startY=null});
}

/* ---------------- galeria de imagini (30.09.2026) ----------------
   assets/js/galerie.js (componentă comună, ca prezenta.js): capturile (șablonul fig) se deschid mari PE ACEEAȘI
   PAGINĂ, în mod galerie, nu într-o filă nouă. Se încarcă ÎNTOTDEAUNA, și în recitire (unde prezenta.js nu vine). */
function galerie(){
  if(document.getElementById('lh-galerie'))return;
  const s=document.createElement('script');s.id='lh-galerie';s.defer=true;
  s.src=new URL('../../assets/js/galerie.js',MOTOR_URL).href;document.head.appendChild(s);
}

/* ---------------- evidența activității (24.09.2026) ----------------
   assets/js/prezenta.js (același pe tot LearningHub-ul) numără timpul lucrat și îl trimite profesorului.
   Jocul îi spune în plus ce nivel s-a terminat și cu câte stele. Numele: dacă elevul s-a înscris deja pe site,
   îl punem și pe diplomă; „Sunt alt elev” șterge și înscrierea, ca pe calculatorul comun să nu rămână colegul. */
function prezenta(){
  if(!document.getElementById('lh-prezenta')){
    const s=document.createElement('script');s.id='lh-prezenta';s.defer=true;
    s.src=new URL('../../assets/js/prezenta.js',MOTOR_URL).href;document.head.appendChild(s);
  }
  const iaNumele=()=>{const e=window.Prezenta&&window.Prezenta.identitate();if(e&&!S.nume){S.nume=e.nume;save();const n=document.getElementById('nume');if(n&&!n.value)n.value=e.nume}};
  /* 25.09.2026 (Filip: „sunt la nivelul 4 demult”, panoul arăta 1): nivelurile terminate ÎNAINTE de înscriere
     (sau cât stătea pe ecran „Ești tot…?”) nu plecau niciodată. La deschidere și la fiecare înscriere/„Da”
     trimitem tot ce e deja făcut (serverul păstrează maximul de stele, deci nu se dublează nimic) - DOAR dacă
     numele din joc e al elevului înscris, ca pe calculatorul comun să nu primească nivelurile colegului. */
  const norm=normNume;   // aceeași regulă (01.10.2026)
  /* sinc:1 (bucla 10.10.2026, T1): trimiterile de aici REPETĂ niveluri terminate cândva (la fiecare deschidere de pagină),
     deci nu sunt progres de azi. Panoul (semnul „timp fără progres”) nu le socotește; serverul le păstrează ca înainte
     (maximul de stele). Un nivel terminat de-adevărat pleacă din endLevel(), fără sinc. */
  const sincron=()=>{const e=window.Prezenta&&window.Prezenta.identitate();if(!e||!S.nume||norm(S.nume)!==norm(e.nume))return;
    const facute=Object.keys(S.lv).filter(i=>facut(S.lv[i]));if(!facute.length)return;   // nivelurile doar văzute nu pleacă
    facute.forEach(i=>raporteaza({tip:'nivel',nivel:+i+1,stele:S.lv[i].stars||0,max:3,sinc:1}));
    if(C.nivele.every((_,i)=>facut(S.lv[i])))raporteaza({tip:'joc-gata',stele:totals().st,max:C.nivele.length*3,sinc:1});};
  /* profilul s-a schimbat sub joc (ex. „Nu ești tu?” + „Mai târziu” -> @_neinscris): S nu mai ține nivelurile
     celui plecat, iar ce lucrează noul elev ajunge în sertarul lui (26.09.2026, T1) */
  /* răspunsul la „Ești tot X?” (28.09.2026): profilul rămâne același, dar munca ținută deoparte a plecat (la X sau la
     „neînscris”): S se recitește din sertar, iar pagina deschisă (cuprinsul sau diploma) se redesenează */
  addEventListener('prezenta',()=>{const raspuns=eraAsteptare&&!inAsteptare();
    scurge(true);   // secundele adunate până acum sunt ale celui din SK (sertarul din care e S), oricine stă acum pe scaun
    if(cheieJoc()!==SK){S=load();if(!R)home()}
    else if(raspuns){S=load();if(!R){if(app.querySelector('.diploma'))diploma();else home()}}
    if(raspuns)eraAsteptare=false;
    iaNumele();sincron();cineLucreaza()});
  // prezenta.js vine după primul desen: dacă întreabă „Ești tot X?”, cuprinsul se redesenează fără munca ținută deoparte
  addEventListener('load',()=>{iaNumele();sincron();if(!R&&inAsteptare()&&!app.querySelector('.diploma'))home();else cineLucreaza()});
  // progres venit de pe alt aparat (prezenta.js l-a scris deja în localStorage): cuprinsul se redesenează
  addEventListener('lh-progres',()=>{S=load();if(!R)home()});
}
/* jocul = numele FOLDERULUI (excel-viii), nu C.cheie: jurnalul și panoul fac legătura spre /jocuri/<folder>/ */
/* modul lecție: cheia vine din CALE (lectii/vii/m1-l04/ -> lectie_vii_m1_l04), aceeași formă pe care jurnal/ o duce
   înapoi la /lectii/vii/m1-l04/; în afara căii standard, cheia din configurație */
const jocSlug=()=>{
  if(eLectie()){const p=lectieInfo().pm;return p?`lectie_${p[1].toLowerCase()}_m${p[2]}_l${p[3]}`:C.cheie}
  const m=location.pathname.match(/\/jocuri\/([a-z0-9_-]+)\//i);return m?m[1]:C.cheie};
function raporteaza(e){try{if(window.Prezenta)window.Prezenta.eveniment(Object.assign({joc:jocSlug(),titlu:titluRaport(),din:C.nivele.length},e))}catch(x){}}

/* ---------------- pornire ---------------- */
/* simulatoarele reutilizabile din _motor (tip-html.js…) se înregistrează singure, înainte de porneste() */
const EXT={};
function tipNou(nume,def){EXT[nume]=def}
function porneste(config){
  C=config;
  if(!window.JOCURI_PREREQ)incarcaScript('prerechizite.js').catch(()=>{});   // blocul „Ce trebuie să știi”; primul pas vine după un clic
  ['cheie','titlu','clasa','unitate','unitateTitlu','competente','intro','nivele','diploma'].forEach(k=>{if(C[k]==null)throw new Error('JocMotor: lipsește „'+k+'” din configurație')});
  Object.entries(Object.assign({},EXT,C.tipuri||{})).forEach(([k,v])=>{TIPURI[k]=v.render;if(v.rezolva)REZOLVA[k]=v.rezolva;if(v.gresit)GRESIT[k]=v.gresit});
  RECITIRE=eLectie()?null:paramRecitire();   // ?recitire=N: doar citire (vezi „RECITIRE”); pe lecții se ignoră
  S=load();
  galerie();   // capturile se deschid pe aceeași pagină (și în recitire)
  if(RECITIRE===null)prezenta();   // recitirea nu intră în jurnal și nu cere înscrierea
  document.body.insertAdjacentHTML('afterbegin',`<header class="hud"><div class="hud-in">
    <button class="brand" id="go-home" type="button">${C.marca||esc(C.titlu)}</button>
    <div class="fbar" id="hud" aria-live="polite"></div>
    <button class="pulldown" id="hdr-pull" type="button" aria-label="Arată bara de sus" title="Arată bara de sus">▾</button>
  </div></header><main><nav class="crumbs" id="crumbs" aria-label="Unde ești"></nav><div id="app"></div></main>`);
  app=document.getElementById('app');hud=document.getElementById('hud');
  if(RECITIRE!==null){document.getElementById('go-home').onclick=()=>{location.href=urlCuprins()};wireHeader();recitireStart();return}
  document.getElementById('go-home').onclick=home;
  wireHeader();
  home();
  legaturaDirecta();   /* ?pas=… / ?continua=1 (vezi „LEGĂTURI DIRECTE”) */
}

/* ---------------- pentru poarta de testare (test_joc.py) ---------------- */
const testHooks={
  config:()=>C,
  stare:()=>R?{li:R.li,qi:R.qi,phase:R.phase,done:R.done,mode:R.mode,si:R.si,nEx:R.pList?R.pList.length:0}:null,
  /* pana (opțional, 10.10.2026): deblochează doar nivelurile de dinaintea lui (de la 0), ca nivelul `pana` să rămână
     neterminat: un nivel terminat are toată bara apăsabilă (vezi „BARA PE ELEV”) */
  deblocheaza:pana=>{C.nivele.forEach((_,i)=>{if(pana!=null&&i>=pana)return;if(!facut(S.lv[i]))S.lv[i]=ordonat(Object.assign({},S.lv[i],{stars:1,xp:(S.lv[i]&&S.lv[i].xp)||0}))});save()},
  scurge:()=>scurge(),   // probele: secundele adunate intră acum în sertar (proba_instrumentare.py)
  toateIntrebarile:()=>{TEST_TOATE=true},   // antrenament: poarta joacă tot bazinul, nu doar ce iese la tragere
  /* nivelurile pe pași: poarta deschide fiecare pas și fiecare exercițiu („încă unul”), apoi atelierul */
  tipuri:()=>Object.keys(TIPURI),
  pas:k=>{R.si=k;R.phase='learn';learnPage()},
  atelier:()=>{R.phase='atelier';atelierPage()},
  real:()=>{R.phase='real';realPage()},                     // modul lecție: pasul „Acum în aplicația adevărată”
  lectie:()=>eLectie()?Object.assign(lectieInfo(),{pm:undefined,cheieActivitate:jocSlug(),titluPanou:titluRaport()}):null,
  exercitiu:k=>{R.pv[R.pKey]=k;renderPractice(R.pList,R.pKey)},
  rezolva:()=>{
    const Q=R.mode==='practice'?R.pQ:C.nivele[R.li].qs[R.qi],body=document.getElementById('body');
    if(!REZOLVA[Q.t])return false;
    REZOLVA[Q.t](Q,body,API);return true;
  },
  /* pune în pagină un răspuns GREȘIT tipic (doar simulatoarele care declară gresit); poarta verifică apoi că e respins */
  gresit:()=>{
    const Q=R.mode==='practice'?R.pQ:C.nivele[R.li].qs[R.qi],body=document.getElementById('body');
    if(!GRESIT[Q.t])return false;
    GRESIT[Q.t](Q,body,API);return true;
  }
};
window.JocMotor={porneste,ghid:inregistreazaGhid,tip:tipNou,test:testHooks,esc,expandRange,
  recitire:()=>RECITIRE!==null};   // simulatoarele (tip-excel) nu scriu nimic cât pagina e doar pentru recitire
})();
