/* lectii/_sim/excelx-proiect.js — extensia „mini-proiect: lanțul tabel → formule → sortare → grafic” a foii excelx
   (lecția VIII / M2 / nr. 12). PROPRIETAR: autorul lecției VIII/12. Fișier NOU: nu schimbă excelx.js (lecția 5),
   excelx-formule.js (7), excelx-functii.js (8), excelx-decizie.js (9), excelx-sortare.js (10), excelx-grafic.js (11)
   și nici motorul. Le FOLOSEȘTE, întregi, prin încărcare.
   ÎNCĂRCARE, în ordine: motor.js, tip-foaie.js, tip-excel.js, ../../_sim/excelx.js, excelx-formule.js, excelx-functii.js,
   excelx-decizie.js, excelx-sortare.js, excelx-grafic.js, excelx-proiect.js; apoi tipuri:{proiect:ExcelP}.

   CE FACE: un atelier în TREI ETAPE pe aceeași foaie, fiecare desenată de tipul care o știe deja, nemodificat:
     1. Formulele  -> ExcelFn (lecția 8: Σ Însumare automată fidelă; operatorii din lecția 7 și IF din lecția 9 sunt
                      în calculul foii, pentru că extensiile lor învelesc JocFoaie.evaluate la încărcare);
     2. Sortarea   -> ExcelS  (lecția 10: butoanele din fila Date (Data), Sort Warning, fereastra Sort);
     3. Graficul   -> ExcelG  (lecția 11: Inserare (Insert) › Diagrame (Charts), Proiectare diagramă, butonul +).
   Foaia (RAW: valorile și formulele; FMT: formatarea, aldin, borduri, culori, forma numerelor) trece întreagă de la o
   etapă la alta; graficul făcut în etapa 3 se ține minte și se desenează din nou la întoarcere (Q.start al lui ExcelG).
   ABATEREA, spusă pe ecran: în Excel toate filele sunt deodată pe panglică; aici fiecare etapă are filele ei, iar
   Anularea (Ctrl+Z, ↶) merge doar în etapa în care ești.
   REPARARE 1 (06.10.2026, registrul j1 al lecției 12): G formatarea trece între etape (FMT dus mai departe);
   H pe ecranele cu atingere filele și antetele foii au cel puțin 32 px, panglica e mărită de 1,75 ori (ca în
   excelx-formatare.js), iar pătrățelul de umplere are o zonă de atingere de 32 px; etapa 1 spune ce faci pe telefon dacă nu prinzi pătrățelul; P după „Verifică”
   focusul se întoarce pe foaie; Q mesajul spune câte teste MAI AI de făcut.
   TESTELE numite ale lanțului stau deasupra și se bifează singure, pe COMPORTAMENT:
     {ce, formule:{D2:'=B2*C2',…}, variante?}  celula are o formulă cu adrese care dă ce dă referința, și pe datele schimbate
                                               (ExcelDecizie.eFormulaBuna, a lecției 9);
     {ce, functii:{D8:'SUM',…}}                celula folosește funcția cerută (ExcelFunctii.areFunctia, a lecției 8);
     {ce, sortat:{zona:'A1:E6', dupa:{col:'D',ord:'desc'}, legate:['A','B','C']}}
                                               rândurile de date sunt în ordinea cerută, iar fiecare rând are aceleași valori
                                               în coloanele legate ca la început (rândurile nu s-au desperecheat);
     {ce, grafic:{zona,tip,titlu,…}}           ExcelGrafic.verifica (a lecției 11) pe graficul din etapa 3.
   Rezolvarea pentru poartă (rezolva): formulele de referință, tabelul sortat, graficul cerut. Greșeala tipică (gresit):
   încasările calculate „de mână”, scrise ca numere, nu ca formule.
   Global: window.ExcelP (tipul), window.ExcelProiect (stare, mergiLa — pentru probe). */
(function(){
'use strict';
const LIPSA=['ExcelX','ExcelFn','ExcelS','ExcelG','ExcelSortare','ExcelGrafic','ExcelDecizie','ExcelFunctii','ExcelFormule'].filter(n=>!window[n]);
if(LIPSA.length){console.error('excelx-proiect.js: încarcă întâi '+LIPSA.join(', '));return}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).toUpperCase().match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const PE_TEL=()=>{try{return matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0}catch(e){return false}};

const CSS=`.xpj-etape{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.xpj-etape button{flex:1 1 30%;min-width:96px;min-height:40px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-weight:600;font-size:.9rem;padding:6px 8px;cursor:pointer;text-align:center}
.xpj-etape button[aria-current="step"]{background:var(--accent);color:var(--accentInk);border-color:var(--accent)}
.xpj-etape button .xpj-b{display:inline-block;width:1.2em}
.xpj-unde{margin:0 0 8px;padding:8px 10px;border-radius:8px;background:var(--sel);color:var(--ink);font-size:.9rem}
.xpj-unde b{font-weight:700}
.xpj-abatere{margin:0 0 8px;font-size:.84rem;color:var(--ink2)}
.xpj-teste{margin:0 0 10px;padding:10px 12px;border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper)}
.xpj-teste .lbl{font-weight:700;font-size:.9rem;margin-bottom:4px}
.xpj-teste ul{list-style:none;margin:0;padding:0}
.xpj-teste li{padding:3px 0;color:var(--ink2)}
.xpj-teste li.ok{color:var(--ok);font-weight:600}
.xpj-teste li span[aria-hidden]{display:inline-block;width:1.3em}
.xpj-teste li small{display:block;margin-left:1.3em;font-weight:400;color:var(--ink2);font-size:.8rem}
.xpj-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.xpj-urm{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 0}
.xpj-urm .btn{min-height:40px}
@media (pointer:coarse){
.xpj .rb .tabs button{min-height:32px}
.xpj .pg .pg-banda{zoom:1.75}
.xpj thead th,.xpj tbody th{min-width:32px;height:32px}
.xpj td:has(> .fh){overflow:visible}
.xpj .fh::after{content:"";position:absolute;left:-12px;top:-12px;width:32px;height:32px}
}`;
function css(){if(!document.getElementById('xpj-css')){const s=document.createElement('style');s.id='xpj-css';s.textContent=CSS;document.head.appendChild(s)}}

const ETAPE=[
  {nume:'Formulele',tip:()=>window.ExcelFn,
   unde:'<b>Etapa 1, formulele.</b> Scrii formulele în celule sau în bara de formule. Funcțiile le scrii tu sau le iei cu butonul Σ, <b>Însumare automată (AutoSum)</b>: fila <b>Formule (Formulas)</b>, la început, sau fila <b>Pornire (Home)</b>, în dreapta.',
   tel:' <b>Pe telefon:</b> pătrățelul de umplere îl tragi cu degetul, pornind chiar din colțul celulei. Dacă nu-l prinzi, scrii formula în fiecare celulă, pe rând, cu adresele rândului ei (în D3 cu B3 și C3, în D4 cu B4 și C4 și așa mai departe): testele o primesc la fel.'},
  {nume:'Sortarea',tip:()=>window.ExcelS,
   unde:'<b>Etapa 2, sortarea.</b> Butoanele de sortare sunt pe fila <b>Date (Data)</b>, în grupul <b>Sortare și filtrare (Sort &amp; Filter)</b>.'},
  {nume:'Graficul',tip:()=>window.ExcelG,
   unde:'<b>Etapa 3, graficul.</b> Selectezi zona, apoi fila <b>Inserare (Insert)</b> › grupul <b>Diagrame (Charts)</b>. Titlul îl schimbi cu clic pe el.'}];
const ABATERE='În Excel, toate filele sunt deodată pe panglică. Aici foaia trece prin trei etape, fiecare cu filele ei. Ce ai scris și formatarea (aldin, borduri, culori) rămân când treci de la o etapă la alta; anularea (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, ↶) merge doar în etapa în care ești.';

const P=new WeakMap();   // starea atelierului, pe corpul întrebării
const foaie=()=>window.JocExcel&&window.JocExcel.render._stare;
function copie(R){const o={};Object.keys(R||{}).forEach(k=>{const v=R[k];if(v!=null&&v!=='')o[k]=v});return o}
function numere(R){const o={};Object.entries(R).forEach(([k,v])=>{if(typeof v==='number')o[k]=v;else if(typeof v==='string'&&/^\s*-?\d+(,\d+)?\s*$/.test(v))o[k]=Number(v.trim().replace(',','.'))});return o}
const val=R=>{const g=window.ExcelSortare.valori(R);return a=>g(a)};

/* ---- testele, pe ce e ACUM în foaie (și pe graficul ținut minte) ---- */
function graficOk(st,T){const sub=st.sub;
  if(st.etapa===2){const s=window.ExcelGrafic.stare(sub),G=s&&s.G;if(!G)return false;
    const d=window.ExcelGrafic.date(sub),z=sub.querySelector('.xg-zona'),W=z&&z.clientWidth||340,g=val(st.RAW);
    const ok=!window.ExcelGrafic.verifica(T.grafic,G,d,W,a=>{const x=g(a);return x.t==='num'?x.v:null});st.gOk[T.ce]=ok;return ok}
  return !!st.gOk[T.ce]}
function sortatOk(st,T){const V=T.sortat,[a,b]=V.zona.split(':').map(pos),g=val(st.RAW),g0=val(st.cells0);
  const k=pos(V.dupa.col+'1').c,leg=(V.legate||[]).map(c=>pos(c+'1').c),r0=a.r+1,ord=V.dupa.ord==='asc'?1:-1;
  const cheie=(gg,r)=>leg.map(c=>{const x=gg(adr(c,r));return x.t==='gol'?'':String(x.v)}).join('\u0001');
  const acum=[],ini=[];for(let r=r0;r<=b.r;r++){acum.push(cheie(g,r));ini.push(cheie(g0,r))}
  if(acum.slice().sort().join('\n')!==ini.slice().sort().join('\n'))return false;   // rânduri desperecheate sau schimbate
  let ant=null;for(let r=r0;r<=b.r;r++){const x=g(adr(k,r));if(x.t!=='num')return false;if(ant!=null&&(x.v-ant)*ord<0)return false;ant=x.v}
  return true}
function testOk(st,T){const R=st.RAW;
  if(T.grafic)return graficOk(st,T);
  if(T.sortat&&!sortatOk(st,T))return false;
  if(T.formule&&!Object.entries(T.formule).every(([a,f])=>window.ExcelDecizie.eFormulaBuna(R,{cells:numere(R)},a,f,T.variante)))return false;
  if(T.functii&&!Object.entries(T.functii).every(([a,fn])=>window.ExcelFunctii.areFunctia(R[a],fn)))return false;
  return !!(T.sortat||T.formule||T.functii)}
function rezultate(st){const S=foaie();if(S&&S.RAW)st.RAW=copie(S.RAW);return st.Q.teste.map(T=>({T,ok:testOk(st,T)}))}
function deseneazaTeste(st){const rez=rezultate(st),n=rez.filter(x=>x.ok).length;
  st.box.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.T.ce}<small>etapa ${x.T.etapa||1}</small><span class="xpj-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`;
  st.nav.querySelectorAll('button[data-xpj]').forEach(b=>{const k=+b.dataset.xpj,ale=rez.filter(x=>(x.T.etapa||1)===k+1);const gata=ale.length&&ale.every(x=>x.ok);
    b.querySelector('.xpj-b').textContent=gata?'✔':'';b.setAttribute('aria-label',`Etapa ${k+1}: ${ETAPE[k].nume}${gata?', gata':''}`)});
  return rez}

/* ---- o etapă: tipul ei desenează foaia în st.sub, cu foaia dusă mai departe ---- */
function startDin(G){const s={zona:G.zona,tip:G.tip,plot:G.plot,leg:G.leg};if(G.titlu&&G.titlu.mod==='tau')s.titlu=G.titlu.text;if(G.et)s.et=G.et;return s}
/* G: formatarea (FMT, pe adrese) trece și ea; sortarea foii o mută odată cu rândurile, deci copia e după foaia de acum */
const copieFmt=F=>{try{return JSON.parse(JSON.stringify(F||{}))}catch(e){return {}}};
function puneFmt(st){const S=foaie();if(!S||!S.FMT||!st.FMT||!Object.keys(st.FMT).length)return;
  Object.keys(S.FMT).forEach(k=>delete S.FMT[k]);Object.assign(S.FMT,copieFmt(st.FMT));try{S.draw()}catch(e){}}
function tine(st){const S=foaie();if(S&&S.RAW&&st.sub.querySelector('#xwrap')){st.RAW=copie(S.RAW);st.FMT=copieFmt(S.FMT)}
  if(st.etapa===2){const s=window.ExcelGrafic.stare(st.sub);st.G=s&&s.G?s.G:null;st.Q.teste.forEach(T=>{if(T.grafic)graficOk(st,T)})}}
function deseneaza(st,k,focus){
  st.etapa=k;st.sub.innerHTML='';if(st.obs)st.obs.disconnect();
  st.nav.querySelectorAll('button[data-xpj]').forEach(b=>b.setAttribute('aria-current',+b.dataset.xpj===k?'step':'false'));
  const E=ETAPE[k];st.unde.innerHTML=E.unde+(E.tel&&PE_TEL()?E.tel:'');
  const Qi={cols:st.Q.cols,rows:st.Q.rows,cells:copie(st.RAW),panglica:true,_proiect:true};
  if(k===2){if(st.G)Qi.start=startDin(st.G);else Qi.cuGrafic=true}
  E.tip().render(Qi,st.sub,st.apiI);puneFmt(st);
  st.urm.innerHTML=(k>0?`<button class="btn" type="button" data-xpj-mergi="${k-1}">← Etapa ${k}: ${ETAPE[k-1].nume.toLowerCase()}</button>`:'')+(k<2?`<button class="btn" type="button" data-xpj-mergi="${k+1}">Etapa ${k+2}: ${ETAPE[k+1].nume.toLowerCase()} →</button>`:'');
  deseneazaTeste(st);
  st.obs=new MutationObserver(()=>{clearTimeout(st.t);st.t=setTimeout(()=>deseneazaTeste(st),60)});
  st.obs.observe(st.sub,{childList:true,subtree:true,characterData:true});
  if(focus){const b=st.nav.querySelector(`button[data-xpj="${k}"]`);if(b)try{b.focus({preventScroll:true})}catch(e){}}}
/* la trecerea pe altă etapă, un „Nu încă” vechi (de la un Verifică de dinainte) nu mai spune adevărul: îl scot */
function mergi(st,k){if(k===st.etapa)return;tine(st);const fb=document.getElementById('fb');if(fb&&fb.querySelector('.fb.bad'))fb.innerHTML='';deseneaza(st,k,true)}

/* ---- rezolvarea de referință: formulele, sortarea (formulele mutate cu rândul lor), graficul ---- */
function solutie(Q){const S=Q.solutie,R=copie(Q.cells),[a,b]=S.zona.split(':').map(pos);
  Object.entries(S.rand||{}).forEach(([c,f])=>{for(let r=a.r+1;r<=b.r;r++)R[c+(r+1)]=f.split('{r}').join(String(r+1))});
  Object.entries(S.celule||{}).forEach(([x,f])=>R[x]=f);
  const g=window.ExcelFormule.valoare,k=S.dupa.col,ord=S.dupa.ord==='asc'?1:-1;
  const rows=[];for(let r=a.r+1;r<=b.r;r++){const o={};for(let c=a.c;c<=b.c;c++)o[COL(c)]=R[adr(c,r)];rows.push({o,v:Number(g(R,k+(r+1)))||0,i:r})}
  rows.sort((x,y)=>(x.v-y.v)*ord||x.i-y.i);
  rows.forEach((x,j)=>{const r=a.r+1+j;Object.entries(x.o).forEach(([c,v])=>{const f=(S.rand||{})[c];const nou=f?f.split('{r}').join(String(r+1)):v;if(nou==null)delete R[c+(r+1)];else R[c+(r+1)]=nou})});
  return R}

function render(Q,body,api){css();
  if(!window.JocExcel){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
  const st={Q,body,etapa:0,RAW:copie(Q.cells),cells0:copie(Q.cells),G:null,gOk:{},chk:null};P.set(body,st);
  const wrap=document.createElement('div');wrap.className='xpj';
  wrap.innerHTML=`<p class="xpj-abatere">${ABATERE}</p><div class="xpj-teste" aria-live="polite"></div><div class="xpj-etape" role="group" aria-label="Etapele atelierului">${ETAPE.map((E,k)=>`<button type="button" data-xpj="${k}" aria-current="false"><span class="xpj-b" aria-hidden="true"></span>${k+1}. ${E.nume}</button>`).join('')}</div><p class="xpj-unde"></p><div class="xpj-foaie"></div><div class="xpj-urm"></div>`;
  body.appendChild(wrap);
  st.box=wrap.querySelector('.xpj-teste');st.nav=wrap.querySelector('.xpj-etape');st.unde=wrap.querySelector('.xpj-unde');st.sub=wrap.querySelector('.xpj-foaie');st.urm=wrap.querySelector('.xpj-urm');
  /* tipurile etapelor își pun propriul „Verifică”: îl țin deoparte; butonul atelierului e unul singur, al lanțului */
  st.apiI=Object.assign({},api,{checkButton:()=>document.createElement('div'),resolve:()=>{},revealButton:()=>{},giveUp:()=>{},done:()=>false});
  wrap.addEventListener('click',ev=>{const b=ev.target.closest('button[data-xpj],button[data-xpj-mergi]');if(!b||!wrap.contains(b))return;
    if(b.closest('.xpj-foaie'))return;mergi(st,+(b.dataset.xpj??b.dataset.xpjMergi))});
  deseneaza(st,0,false);
  /* P: după „Verifică”, focusul se întoarce pe foaie (regula 14), ca tastele cerute de mesaj să meargă */
  const peFoaie=()=>{const g=st.sub.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(e){}};
  api.checkButton(()=>{tine(st);const rez=deseneazaTeste(st),rau=rez.filter(x=>!x.ok);
    if(!rau.length){api.resolve(true);peFoaie();return}
    /* Q: câte teste MAI AI de făcut, fără „Încă nu…” după „Nu încă.” al motorului */
    const n=rau.length,t=rez.length,gata=t-n,p=rau[0].T;
    const cate=n===t?`Mai ai de făcut toate cele ${t} teste.`:`Mai ai de făcut ${n} din ${t} teste (${gata} ${gata===1?'e gata':'sunt gata'}).`;
    api.resolve(false,`${cate} Primul nefăcut: „${p.ce}” (etapa ${p.etapa||1}).${p.sfat?' '+p.sfat:''}`);
    api.revealButton(()=>{aplica(st,solutie(Q),true);api.giveUp(Q.solutieText||'produsul corect e acum în foaie: formulele, tabelul sortat și graficul.')});
    peFoaie()});
}
/* pune o foaie întreagă și (dacă e cerut) graficul de referință, apoi trece pe etapa 3 */
function aplica(st,R,cuGrafic){st.RAW=R;st.G=null;st.gOk={};st.FMT={};   // rezolvarea pornește de la o foaie fără formatare
  const gs=st.Q.teste.filter(T=>T.grafic).map(T=>T.grafic),sp=gs.length?Object.assign({},...gs):null;   // toate cerințele despre grafic, împreună
  if(cuGrafic&&sp&&sp.zona){st.etapa=-1;st.RAW=R;
    const Qi={cols:st.Q.cols,rows:st.Q.rows,cells:copie(R),panglica:true,start:{zona:sp.zona,tip:[].concat(sp.tip||'column')[0]}};if(sp.titlu)Qi.start.titlu=sp.titlu;
    st.sub.innerHTML='';window.ExcelG.render(Qi,st.sub,st.apiI);const s=window.ExcelGrafic.stare(st.sub);st.G=s&&s.G;deseneaza(st,2,false);return}
  deseneaza(st,0,false)}
function rezolva(Q,body){const st=P.get(body);if(!st)return;aplica(st,solutie(Q),true);return true}
/* greșeala tipică: rezultatele calculate „de mână” și scrise ca numere în coloana formulelor (restul e bun) */
function gresit(Q,body){const st=P.get(body);if(!st)return;const R=solutie(Q),[a,b]=Q.solutie.zona.split(':').map(pos),g=window.ExcelFormule.valoare;
  const c=Object.keys(Q.solutie.rand||{})[0];if(!c)return;
  for(let r=a.r+1;r<=b.r;r++){const x=c+(r+1);R[x]=String(g(R,x)).replace('.',',')}
  aplica(st,R,true);return true}

const ExcelP={render,rezolva,gresit};
window.ExcelP=ExcelP;
window.ExcelProiect={stare:body=>{const st=P.get(body);return st?{etapa:st.etapa,teste:rezultate(st).map(x=>x.ok),RAW:copie(st.RAW),G:st.G}:null},
  mergiLa:(body,k)=>{const st=P.get(body);if(st)mergi(st,k)},solutie};
})();
