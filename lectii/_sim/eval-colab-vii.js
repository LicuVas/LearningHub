/* ======================================================================================================
   lectii/_sim/eval-colab-vii.js — PROBA DE ANTRENAMENT, cu punctaj pe părțile C / B / A, peste simulatoarele Google ale
   clasei a VII-a (lecția VII · M4 · nr. 22, „Evaluare sumativă: lucrul colaborativ (produs de echipă + contribuție
   individuală)”, 26.10.2026). PROPRIETAR: autorul lecției VII/22.
   Modele: lectii/_sim/eval-internet-v.js (V/17) și eval-internet-vi.js (VI/16): punctele în memorie, la PRIMA verificare,
   bifele ascunse până atunci, panoul de sus, rezumatul de la final, „Sunt alt elev / Încep din nou”, schimbarea elevului.

   NU modifică motorul (jocuri/_motor/*), colab-google.js (VII/18), colab-google-echipa.js (VII/19),
   colab-google-istoric.js (VII/20), etica-colab.js (VII/21), rezultat-elev.js sau prezenta.js. Folosește DOAR ce desenează
   și ce expun ele public:
     - tipurile lor pentru motor (render / rezolva / gresit): SimColabGoogle.colab, SimColabEchipa.echipa,
       SimColabIstoric.colabIstoric, SimEticaColab.docEchipa;
     - lista testelor pe care o desenează fiecare: `.cg-teste li[data-i]` (colab, echipa, colabIstoric) sau
       `.ec-teste li[data-i]` (docEchipa), cu clasa `ok` pe testul care trece — după verificarea simulatorului;
     - butonul lor „Ia-o de la capăt” (`[data-cg="reset"]`, `[data-a="reset"]`);
     - api.checkButton al motorului: îl învelesc ca să socotesc punctele la PRIMA apăsare pe „Verifică”.

   ÎNCĂRCARE (după motor.js și simulatoarele folosite):
     <script src="../../_sim/eval-colab-vii.js"></script>
     EvalColabVII.configureaza({titlu:'Proba de antrenament', oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:20},…]});
     tipuri:{probacolab:EvalColabVII.colab, probaechipa:EvalColabVII.echipa, probaistoric:EvalColabVII.istoric,
             probadoc:EvalColabVII.docEchipa, probaalege:EvalColabVII.alegere}

   TIPURI CU PUNCTE (forma lui Q = a tipului de bază, plus):
     proba:'C1'             id-ul cerinței din configureaza (fără el sau cu un id necunoscut: tipul de bază, neschimbat);
     puncte pe teste        la tipurile colab / echipa / colabIstoric: Q.teste[i].puncte (testele fără `puncte` = doar bifă,
                            nu se punctează); la docEchipa (Q.teste = nume): Q.puncte = [p0, p1, …], pe ordinea listei;
     paza                   Q.teste[i].paza = true (sau, la docEchipa, Q.paza = [indici]): testul care trece și pe starea de
                            pornire („n-ai schimbat textul colegului”) primește punctele lui DOAR dacă a trecut și un test de
                            lucru cu puncte al aceleiași cerințe (ghidul, IV.2 §7: nimic nu se punctează pe starea de pornire);
                            un test de pază care PICĂ își pierde punctele și apare la „Unde ai pierdut puncte”;
     obligatoriu            (versiunea 2, 26.10.2026) Q.teste[i].obligatoriu = true (sau, la docEchipa, Q.obligatorii =
                            [indici]): dacă testul acesta pică la prima verificare, TOATĂ cerința ia 0 (ex. ai schimbat textul
                            colegei: comentariul bun nu mai aduce puncte); celelalte teste apar cu motivul;
     oDataCu                (versiunea 2) Q.teste[i].oDataCu = [indici], doar la un test de pază: dacă el pică ÎMPREUNĂ cu unul
                            din testele de lucru numite (aceeași greșeală, ex. ai ales „Radu Enescu” în loc de „Radu Ene”: Radu
                            lipsește ȘI un străin e în listă), pierderea se socotește o singură dată, la testul de lucru;
                            (versiunea 3) la tipul echipa, doar când FIECARE adresă din afara echipei ține locul unui coleg
                            numit care lipsește din listă (primele 4 semne dinainte de @, ca în motivul simulatorului VII/19);
                            altfel sunt două greșeli și două pierderi (ex. profesorul Cititor + un străin în plus);
     lectia                 Q.teste[i].lectia sau Q.lectia: unde recitești (HTML, legătura directă la pas: `../m3-l20/?vezi=p4`);
     dupaRezolva(inst,body) opțional: pași în plus după rezolvarea automată (pentru poartă / probe), prin API-ul public al
                            simulatorului (body._inst()).
     probaalege             q, o:[…], ok, amesteca?, mesaje:{indice:'…'}, puncte, ce, lectia, why, ajutor. Punctele = PRIMA
                            alegere (ca la lucrare); apoi ca alegerea motorului: greșit → încă o încercare; după două, răspunsul.

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4.1-4.3; _campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md; spuse
   la clasa a VII-a în lecția 1, pașii „Din puncte, nota” și „Din notă, nivelul”): C = De bază 40, B = Consolidat 30,
   A = Avansat 20, 10 din oficiu; nota = punctaj : 10, rotunjită la cel mai apropiat întreg, la ,5 în favoarea elevului
   (85 → 9, 84 → 8); nivelul se citește din notă: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare,
   1-2 În dificultate. Punctele pe CERINȚE sunt ale paginii (antrenament), nu ale profesorului: panoul o spune.

   CE FACE
   1. Punctele unei cerințe se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică” (la alegere: prima variantă aleasă):
      întâi verifică simulatorul (lista lui de teste primește ✓ / ✗), apoi citesc din listă ce a trecut. Ce repară elevul
      după aceea e exercițiu și nu schimbă punctele. Fiecare test își are punctele lui: o greșeală pierde doar punctele ei.
   2. „Verifică” pe simulatorul NEATINS (niciun clic, nicio atingere, nicio tastă în simulator de la pornire sau de la
      „Ia-o de la capăt”) nu socotește nimic și o spune. Rezolvarea automată (rezolva / gresit, „Arată-mi”) contează ca lucru.
   3. Până la prima verificare nu se văd bifele, numărătoarea „x din y trec” și butonul „Am nevoie de un indiciu” (la lucrare
      nu ai nici bife, nici indicii); lista rămâne, cu titlul „Ce se verifică”. După prima verificare: blocul „Punctele
      cerinței X, de la prima verificare” (doar testele pierdute, ✗ 0 din p) și lista vie a simulatorului, pentru exercițiu.
   4. Panoul probei, deasupra cerinței: unde ești, punctele de până acum, „Sunt alt elev / Încep din nou”; după ultima
      cerință: punctele pe părți, oficiul, punctajul, nota, nivelul și „unde ai pierdut puncte”, cu lecția de recitit.
   5. Nimic din probă nu se scrie în localStorage, sessionStorage sau pe server: totul stă în memoria paginii (la reîncărcare,
      proba e goală, iar pagina o spune). Singura excepție: un SEMN fără date, sessionStorage 'ecv7_proba_golita' = '1', lăsat
      la plecarea paginii cu proba începută și șters la pornire, ca panoul să spună că proba s-a golit. Proba se golește și se
      reia de la C1 la „Sunt alt elev / Încep din nou” și când se schimbă elevul din caseta prezenta.js (evenimentul
      `prezenta` și, ca plasă, la fiecare „Verifică”), ca la VI/16 și V/17 (regula 23).
   Global: window.EvalColabVII {configureaza, colab, echipa, istoric, docEchipa, alegere, stare, goleste, nota, nivel, puncte}.
   Probele: lectii/vii/m4-l22/_proba/ (ultima linie 0).
   SCHIMBAT 26.10.2026 (versiunea 2), reparația după judecata 1 a lecției VII/22 (`_verificare/registru_j1.md`, A și B): câmpurile
   noi `obligatoriu` / `obligatorii` și `oDataCu` (mai sus); testele de pază pot avea puncte (le dă pagina); la „Unde ai pierdut
   puncte” un test care a trecut în simulator, dar n-a primit puncte (pază fără lucru, cerință anulată), își spune motivul; panoul
   de sus e mai scurt („C1 (1 din 6) · partea C, 20 p · nu intră în catalog”; titlul probei stă în titlul cerinței). Forma lui
   Q de până acum rămâne valabilă.
   SCHIMBAT 26.10.2026 (versiunea 3), după judecata 2 a lecției VII/22 (`_verificare/registru_j1.md`, R): `oDataCu` iartă
   străinul doar când el ține locul colegului numit (vezi mai sus); se citește prin API-ul public inst.echipa (stare, persoana).
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const txt=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');

/* ---------------- configurația și starea probei (doar în memorie) ---------------- */
let CFG={titlu:'Proba de antrenament',oficiu:10,parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},itemi:[]};
/* prima[id] = {teste:[{ce, puncte, ok, lectia, motiv}]}; ora = ora primei verificări; cine = elevul din caseta prezenta.js */
const ST={prima:{},nota:'',ora:'',cine:''};
let curent=null;   // cerința de pe ecran: {id, body, ascunde}

function css(){
  if(document.getElementById('ecv-css'))return;
  const s=document.createElement('style');s.id='ecv-css';
  s.textContent=`
.ecv-panou{border:2px dashed var(--accent);border-radius:8px;padding:8px 12px;margin:6px 0 10px;background:var(--paper2);text-align:left}
.ecv-panou p{margin:.3em 0}
.ecv-panou .ecv-cap{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;justify-content:space-between}
.ecv-panou .ecv-et{font-weight:700;color:var(--accent)}
.ecv-panou ul{margin:.3em 0 .3em 1.2em;padding:0}
.ecv-panou li{margin:.25em 0}
.ecv-panou a{color:var(--accent)}
.ecv-panou details summary{min-height:32px;display:flex;align-items:center;cursor:pointer;color:var(--accent);font-weight:600}
.ecv-panou .ecv-nota{border-left:4px solid var(--accent);padding:4px 8px;margin:6px 0;background:var(--paper)}
.ecv-panou table{border-collapse:collapse;margin:.3em 0;max-width:100%}
.ecv-panou td,.ecv-panou th{border:1px solid var(--line);padding:3px 8px;text-align:left}
.ecv-panou .btn{min-height:36px}
.ecv-puncte{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:6px 10px;margin:8px 0;background:var(--paper);text-align:left}
.ecv-puncte p{margin:.25em 0}
.ecv-puncte ul{list-style:none;margin:.3em 0;padding:0}
.ecv-puncte li{margin:.3em 0}
.ecv-puncte li.rau .s{color:var(--bad);font-weight:700}
.ecv-puncte .ecv-de{color:var(--ink2)}
.ecv-ce{font-size:.85rem;font-weight:700;margin:0 0 2px}
.ecv-ascuns .cg-teste .lbl,.ecv-ascuns .ec-teste .ec-lbl{display:none}
.ecv-ascuns .cg-teste li,.ecv-ascuns .ec-teste li{color:inherit}
.ecv-ascuns .cg-teste li .s,.ecv-ascuns .ec-teste li .s{color:var(--ink2)!important;font-size:0}
.ecv-ascuns .cg-teste li .s::after,.ecv-ascuns .ec-teste li .s::after{content:"○";font-size:.93rem}
.ecv-ascuns .cg-teste li .m,.ecv-ascuns .ec-teste li .m{display:none}
.fb.ecv-info{background:var(--paper2);color:var(--ink);border:1px solid var(--line);border-left:4px solid var(--accent)}`;
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
/* nota = punctaj : 10, rotunjită la cel mai apropiat întreg; la ,5 în favoarea elevului (punctajul e întreg) */
const nota=punctaj=>Math.max(1,Math.min(10,Math.floor((punctaj+5)/10)));
const nivel=n=>n>=9?'Avansat':n>=7?'Consolidat':n>=5?'De bază':n>=3?'În formare':'În dificultate';
const virgula=x=>String(x).replace('.',',');

/* ---------------- elevul de pe scaun (caseta prezenta.js) ---------------- */
const cheieDe=x=>{try{return JSON.stringify(x||null)}catch(e){return 'null'}};
function cineE(){try{return cheieDe(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}}
const peEcran=()=>!!(curent&&curent.body&&document.body.contains(curent.body)&&document.querySelector('.ecv-sus'));
function laInceput(n){
  goleste(n);
  if(!peEcran()){redeseneaza();return}
  let dus=false;
  try{if(window.JocMotor&&JocMotor.test&&typeof JocMotor.test.exercitiu==='function'){JocMotor.test.exercitiu(0);dus=true}}catch(e){dus=false}
  if(!dus||!peEcran()||curent.id!==primul())ST.nota=n+' Pagina nu te-a putut duce singură la prima cerință: apasă „Încă un exercițiu” până ajungi la C1.';
  redeseneaza();
}
function schimbatElevul(k){
  if(!inceputa()||!ST.cine||k===ST.cine)return false;
  laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe din nou, de la C1.');return true}
addEventListener('prezenta',e=>{schimbatElevul(cheieDe(e&&e.detail))});
const SEMN='ecv7_proba_golita';
addEventListener('pagehide',e=>{try{if(inceputa()&&!(e&&e.persisted))sessionStorage.setItem(SEMN,'1')}catch(x){}});
try{if(sessionStorage.getItem(SEMN)){sessionStorage.removeItem(SEMN);
  ST.nota='Pagina a pornit din nou (după înscrierea în caseta de jos sau după o reîncărcare), iar proba de antrenament începută s-a golit: nimic nu se păstrează. Începe de la C1.'}}catch(e){}
function elevulAcelasi(api){
  if(schimbatElevul(cineE())){api.feedback('bad','<strong>S-a schimbat elevul din caseta de jos.</strong> Proba a început din nou, de la C1.');return false}
  return true}

/* ---------------- panoul de sus și rezumatul de la final ---------------- */
function pierdute(){
  const rate=[];
  ids().forEach(id=>{const p=ST.prima[id];if(!p)return;p.teste.forEach(t=>{if(!t.ok&&t.puncte)rate.push({id,ce:t.ce,puncte:t.puncte,lectia:t.lectia,de:t.fortat?t.motiv:''})})});
  return rate;
}
function rezumatHTML(){
  const P=peParti(),ord=['C','B','A'].filter(k=>P[k]);
  const tot=ord.reduce((s,k)=>s+P[k].luat,0)+CFG.oficiu,n=nota(tot);
  const imp=tot%10?`${tot} : 10 = ${virgula(tot/10)}, rotunjit: <b>${n}</b>`:`${tot} : 10 = <b>${n}</b>`;
  let h=`<p><b>Ai verificat toate cele ${ids().length} cerințe ale probei de antrenament.</b></p>
<table><tr><th>Partea</th><th>Puncte</th></tr>${ord.map(k=>`<tr><td>${k} · ${esc(CFG.parti[k].nume)}</td><td>${P[k].luat} din ${P[k].max}</td></tr>`).join('')}<tr><td>din oficiu</td><td>${CFG.oficiu}</td></tr><tr><th>Punctajul</th><th>${tot} din 100</th></tr></table>
<p>Nota pe antrenament: ${imp}. Nivelul, din notă: <b>${nivel(n)}</b> (9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate).</p>`;
  const rate=pierdute();
  if(rate.length){
    const pierd=ord.map(k=>({k,p:P[k].max-P[k].luat})).sort((a,b)=>b.p-a.p);
    h+=`<p>Cele mai multe puncte le-ai pierdut la partea <b>${pierd[0].k}</b> (${pierd[0].p} din ${P[pierd[0].k].max}).</p>
<details open><summary>Unde ai pierdut puncte și ce recitești</summary><p>Testele de mai jos <b>n-au trecut</b> la prima verificare:</p><ul>${rate.map(x=>`<li>${esc(x.id)} · ✗ ${x.ce} (0 din ${x.puncte} p${x.de?`: ${esc(x.de)}`:''})${x.lectia?` — recitește ${x.lectia}`:''}.</li>`).join('')}</ul></details>`;
  }else h+=`<p>Ai luat toate punctele din prima.</p>`;
  return h+`<p class="ecv-nota">E nota pe antrenament: cerințele și punctele lor sunt ale paginii. Nota adevărată o dă profesorul.</p>`;
}
function finalJos(){
  document.querySelectorAll('.ecv-final').forEach(x=>x.remove());
  if(!completa())return;
  const fb=document.getElementById('fb');if(!fb||!fb.parentNode)return;
  const el=document.createElement('div');el.className='ecv-panou ecv-final';el.setAttribute('role','status');el.innerHTML=rezumatHTML();
  fb.parentNode.insertBefore(el,fb.nextSibling);
}
function panouHTML(id){
  const it=item(id),k=nrItem(id),N=ids().length;
  let h=`<div class="ecv-cap"><p><span class="ecv-et">${esc(id)}</span> (${k} din ${N}) · partea ${esc(it.parte)}, ${it.puncte} p · nu intră în catalog</p>
<button type="button" class="btn ghost sm ecv-alt">Sunt alt elev / Încep din nou</button></div>`;
  if(ST.nota)h+=`<p class="ecv-nota">${esc(ST.nota)}</p>`;
  const facute=ids().filter(x=>ST.prima[x]);
  if(facute.length&&!completa()){const l=facute.reduce((s,x)=>s+luate(x),0),m=facute.reduce((s,x)=>s+item(x).puncte,0);
    h+=`<p>Până acum (${facute.length} din ${N} cerințe): ${l} din ${m} p.</p>`}
  if(completa())h+=`<p><b>Ai verificat toate cele ${N} cerințe.</b> Punctele pe părți, nota pe antrenament și ce recitești sunt mai jos, sub ultima cerință.</p>`;
  return h;
}
const leagaAlt=el=>{const b=el.querySelector('.ecv-alt');if(b)b.onclick=()=>laInceput('Proba începe din nou, de la C1. Ce era pe ecran s-a golit.')};
function panou(id,body){
  css();
  document.querySelectorAll('.ecv-sus').forEach(x=>x.remove());
  const el=document.createElement('div');el.className='ecv-panou ecv-sus';el.setAttribute('role','region');el.setAttribute('aria-label','Proba de antrenament');
  el.innerHTML=panouHTML(id);
  if(body.parentNode)body.parentNode.insertBefore(el,body);
  leagaAlt(el);finalJos();return el;
}
function redeseneaza(){
  if(!completa())document.querySelectorAll('.ecv-final').forEach(x=>x.remove());
  if(!curent)return;const el=document.querySelector('.ecv-sus');if(el){el.innerHTML=panouHTML(curent.id);leagaAlt(el)}
  if(curent.body&&document.body.contains(curent.body)&&!ST.prima[curent.id]){
    curent.body.querySelectorAll('.ecv-puncte').forEach(x=>x.remove());
    if(curent.ascunde)curent.ascunde()}
  finalJos();
}
/* blocul „Punctele cerinței X, de la prima verificare”: doar testele pierdute; cele trecute se văd bifate în listă */
function blocPuncte(id,body,dupa){
  body.querySelectorAll('.ecv-puncte').forEach(z=>z.remove());
  const p=ST.prima[id];if(!p||!dupa||!dupa.parentNode)return;
  const el=document.createElement('div');el.className='ecv-puncte';el.setAttribute('role','status');
  const rai=p.teste.filter(t=>!t.ok&&t.puncte);
  el.innerHTML=`<p><b>Punctele cerinței ${esc(id)}, de la prima verificare: ${luate(id)} din ${item(id).puncte} p.</b>${rai.length?' Rămân așa; ce repari acum e exercițiu.':''}</p>`
    +(rai.length?`<ul>${rai.map(t=>`<li class="rau"><span class="s">✗</span> <b>0 din ${t.puncte} p</b> · ${t.ce}${t.motiv?` <span class="ecv-de">— ${esc(t.motiv)}</span>`:''}</li>`).join('')}</ul>`:'');
  dupa.parentNode.insertBefore(el,dupa.nextSibling);
}

/* ---------------- învelișul simulatoarelor Google (colab, echipa, colabIstoric, docEchipa) ---------------- */
const LISTA='.cg-teste,.ec-teste';
const RESET='[data-cg="reset"],[data-a="reset"]';
const TASTE_LUCRU=k=>k.length===1||['Enter','Backspace','Delete',' '].includes(k);
/* punctele, pe ordinea listei desenate de simulator (li[data-i]) */
function punctePe(Q,i){const t=(Q.teste||[])[i];if(t&&typeof t==='object'&&t.puncte!=null)return +t.puncte||0;return +((Q.puncte||[])[i])||0}
function pazaPe(Q,i){const t=(Q.teste||[])[i];if(t&&typeof t==='object'&&t.paza)return true;return (Q.paza||[]).indexOf(i)>=0}
function obligPe(Q,i){const t=(Q.teste||[])[i];if(t&&typeof t==='object'&&t.obligatoriu)return true;return (Q.obligatorii||[]).indexOf(i)>=0}
function oDataPe(Q,i){const t=(Q.teste||[])[i];return (t&&typeof t==='object'&&Array.isArray(t.oDataCu))?t.oDataCu:[]}
function lectiaPe(Q,i){const t=(Q.teste||[])[i];return (t&&typeof t==='object'&&t.lectia)||Q.lectia||''}
const ceSimplu=s=>txt(s).replace(/\s+/g,' ').trim();
/* versiunea 3: testul de pază x (picat) e iertat doar dacă fiecare adresă din afara echipei ține locul unui coleg numit în
   oDataCu, al cărui test a picat și care NU e în listă (o adresă greșită = o greșeală); fără API-ul echipei: ca în versiunea 2 */
function iertat(Q,x,r,body){
  const picate=x.odata.map(j=>r.find(y=>y.i===j)).filter(w=>w&&!w.ok);
  if(!picate.length)return false;
  const inst=body&&typeof body._inst==='function'?body._inst():null,E=inst&&inst.echipa;
  if(!E||typeof E.stare!=='function'||typeof E.persoana!=='function')return true;
  const adr=k=>{const p=E.persoana(k);return String((p&&p.adresa)||k)};
  const cap=a=>String(a).split('@')[0].slice(0,4);
  const t=(Q.teste||[])[x.i];const echipa=((t&&t.v)||[]).map(adr);
  const acc=[];Object.values(E.stare()).filter(m=>m.rolMeu==='proprietar'||m.rolMeu==='editor')
    .forEach(m=>(m.acc||[]).forEach(a=>{if(acc.indexOf(a.adresa)<0)acc.push(a.adresa)}));
  const locuri=picate.map(w=>{const tw=(Q.teste||[])[w.i];const a=tw&&tw.v&&tw.v.cine?adr(tw.v.cine):null;return a&&acc.indexOf(a)<0?cap(a):null}).filter(Boolean);
  const straini=acc.filter(a=>echipa.indexOf(a)<0);
  if(!straini.length)return false;
  return straini.every(s=>{const k=locuri.indexOf(cap(s));if(k<0)return false;locuri.splice(k,1);return true});
}
function citeste(Q,body){
  const box=body.querySelector(LISTA);const r=[];
  if(!box)return {teste:r};
  box.querySelectorAll('li[data-i]').forEach(li=>{const i=+li.dataset.i,p=punctePe(Q,i);
    const sp=li.children[1],m=li.querySelector('.m');
    let ce='';if(sp){const c=sp.cloneNode(true);c.querySelectorAll('.m').forEach(x=>x.remove());ce=c.innerHTML.trim()}
    r.push({i,ce,puncte:p,ok:li.classList.contains('ok'),paza:pazaPe(Q,i),oblig:obligPe(Q,i),odata:oDataPe(Q,i),lectia:lectiaPe(Q,i),motiv:(!li.classList.contains('ok')&&m)?txt(m.textContent).trim():''})});
  /* o greșeală socotită o singură dată: testul de pază picat odată cu testul de lucru numit în oDataCu nu mai pierde puncte */
  r.forEach(x=>{if(x.paza&&!x.ok&&iertat(Q,x,r,body)){x.ok=true;x.iertat=true}});
  const lucru=r.some(x=>!x.paza&&x.ok&&x.puncte>0);
  r.forEach(x=>{if(x.paza&&x.ok&&!lucru&&x.puncte){x.ok=false;x.fortat=true;x.motiv='se punctează doar împreună cu lucrul cerut, iar din el n-a trecut nimic'}});
  /* testul obligatoriu picat anulează toată cerința (ex. textul colegei schimbat: comentariul bun nu mai aduce puncte) */
  const rupt=r.find(x=>x.oblig&&!x.ok);
  if(rupt)r.forEach(x=>{if(x!==rupt&&x.ok&&x.puncte){x.ok=false;x.fortat=true;x.motiv=`trece, dar cerința ia 0, pentru că n-a trecut „${ceSimplu(rupt.ce)}”`}});
  return {teste:r.filter(x=>x.puncte>0).map(({paza,oblig,odata,iertat,i,...x})=>x)};
}
function invelis(baza){
  if(!baza)return null;
  return {
    render(Q,body,api){
      css();
      const id=Q.proba;
      if(!cunoscut(id)){body.__ecvId=null;return baza.render(Q,body,api)}
      curent={id,body,ascunde:null};
      body.__ecvLucrat=false;body.__ecvId=id;
      const api2=Object.assign({},api,{
        checkButton:(fn,label)=>api.checkButton(()=>{
          if(!elevulAcelasi(api))return;
          if(!ST.prima[id]){
            if(!body.__ecvLucrat){api.feedback('bad','<strong>Încă n-ai lucrat nimic la cerința asta.</strong> Fă ce cere, apoi apasă „Verifică”. Punctele se socotesc la prima verificare.');return}
            fn();
            pune(id,citeste(Q,body));
            arata();redeseneaza();
            blocPuncte(id,body,body.querySelector(LISTA));
            return;
          }
          fn();
          blocPuncte(id,body,body.querySelector(LISTA));
        },label)});
      baza.render(Q,body,api2);
      /* gesturile elevului în simulator: lucrat = cel puțin un clic / o atingere / o tastă de scris, de la pornire sau de la
         „Ia-o de la capăt”. Ascultătorii stau o singură dată pe corpul exercițiului (motorul îl refolosește). */
      if(!body.__ecvAsc){body.__ecvAsc=true;
        const marcheaza=e=>{const t=e.target;if(!t||!t.closest||!body.__ecvId)return;
          if(t.closest(RESET)||t.closest('.ecv-puncte,.ecv-ce,'+LISTA))return;
          body.__ecvLucrat=true};
        body.addEventListener('pointerdown',marcheaza,true);
        body.addEventListener('keydown',e=>{if(TASTE_LUCRU(e.key))marcheaza(e)},true);
        body.addEventListener('input',marcheaza,true);
        body.addEventListener('click',e=>{const t=e.target;if(t&&t.closest&&t.closest(RESET))setTimeout(()=>{body.__ecvLucrat=false},0)},true);
      }
      const lista=()=>body.querySelector(LISTA);
      function ascunde(){const l=lista();if(!l||!l.parentNode)return;const r=l.parentNode;r.classList.add('ecv-ascuns');
        if(!l.querySelector('.ecv-ce')){const p=document.createElement('p');p.className='ecv-ce';p.textContent='Ce se verifică (bifele și punctele apar după prima verificare)';l.insertBefore(p,l.firstChild)}
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=true}
      function arata(){const l=lista();if(!l)return;const r=l.parentNode;if(r)r.classList.remove('ecv-ascuns');l.querySelectorAll('.ecv-ce').forEach(x=>x.remove());
        const aj=document.querySelector('.ajutor');if(aj)aj.hidden=false}
      curent.ascunde=ascunde;body.__ecvAscunde=ascunde;
      /* unele simulatoare își redesenează lista (la „Ia-o de la capăt”, la rezolvare): până la prima verificare, bifele rămân ascunse */
      if(!body.__ecvOb){body.__ecvOb=new MutationObserver(()=>{
          const i=body.__ecvId,sus=body.previousElementSibling;
          if(!i||!cunoscut(i)||ST.prima[i]||!curent||curent.body!==body||curent.id!==i||!sus||!sus.classList.contains('ecv-sus'))return;
          const l=body.querySelector(LISTA);if(l&&l.parentNode&&(!l.parentNode.classList.contains('ecv-ascuns')||!l.querySelector('.ecv-ce'))&&body.__ecvAscunde)body.__ecvAscunde()});
        body.__ecvOb.observe(body,{childList:true,subtree:true})}
      panou(id,body);
      if(ST.prima[id]){arata();blocPuncte(id,body,lista())}else ascunde();
    },
    rezolva(Q,body,api){const r=baza.rezolva(Q,body,api);body.__ecvLucrat=true;
      if(typeof Q.dupaRezolva==='function'&&body._inst){try{Q.dupaRezolva(body._inst(),body)}catch(e){}}return r},
    gresit(Q,body,api){const r=baza.gresit(Q,body,api);body.__ecvLucrat=true;return r}
  };
}

/* ---------------- alegerea cu puncte (probaalege) ---------------- */
const alegere={
  render(Q,body,api){
    css();body.__ecvId=null;
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

window.EvalColabVII={
  versiune:3,
  configureaza(c){CFG=Object.assign({},CFG,c||{});return CFG},
  colab:window.SimColabGoogle?invelis(SimColabGoogle.colab):null,
  echipa:window.SimColabEchipa?invelis(SimColabEchipa.echipa):null,
  istoric:window.SimColabIstoric?invelis(SimColabIstoric.colabIstoric):null,
  docEchipa:window.SimEticaColab?invelis(SimEticaColab.docEchipa):null,
  alegere,
  stare:()=>JSON.parse(JSON.stringify({prima:ST.prima,ora:ST.ora,cine:ST.cine,completa:completa(),parti:peParti()})),
  goleste:()=>laInceput('Proba începe din nou, de la C1.'),
  nota,nivel,
  puncte:id=>luate(id)
};
})();
