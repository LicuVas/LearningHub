/* ======================================================================================================
   lectii/_sim/eval-repetitii-vi.js — PROBA DE ANTRENAMENT, cu punctaj pe părțile C / B / A, peste simulatoarele PUBLICATE
   ale unității VI-U3 (lecția VI · M4 · nr. 26, „Evaluare sumativă: structuri repetitive”, 02.11.2026).
   PROPRIETAR: autorul lecției VI/26. Granița: _campaign/revizuire_completa_2026_09/m4_noapte_01_11/granite/vi_l26.md.
   Modele: lectii/_sim/editorweb-proba.js (VIII/22: învelitoarea punctat(), ceInainte, pazaDupa, panoul, finalul) și
   eval-colab-vii.js (VII/22) / eval-internet-vi.js (VI/16): punctele în memorie, la PRIMA verificare, „Sunt alt elev”.

   NU modifică motorul (jocuri/_motor/*), urmarire-algoritm*.js (VI/17, VI/20-22), scratch.js (VI/18),
   scratch-control.js (VI/20), scratch-conditie.js (VI/21), scratch-variabile.js (VI/25), rezultat-elev.js, prezenta.js.
   Folosește DOAR ce desenează și ce expun ele public:
     - tipurile lor pentru motor (render / rezolva / gresit);
     - lista testelor: `.ss-tst li[data-i]` (scratch, clasa `ok` pe testul care trece) și `.ua-teste li[data-t]`
       (tabelul de urmărire: un test pe rând — trecere / test — și „fin”, clasa `ok`);
     - body._ss (instanța Scratch: .program()) și body._ua.ck (căsuțele tabelului: {id, k, col, tip}), câmpurile
       `[data-i="<id>"]` ale tabelului; UrmarireAlgoritm.evalueaza / format / potriveste;
     - api.resolve / api.giveUp ale motorului: le învelesc ca să socotesc punctele la PRIMA verificare.

   ÎNCĂRCARE (după motor.js și simulatoarele folosite):
     <script src="../../_sim/eval-repetitii-vi.js"></script>
     EvalRepetitiiVI.configureaza({oficiu:10,
       parti:{C:{nume:'De bază',max:40},B:{nume:'Consolidat',max:30},A:{nume:'Avansat',max:20}},
       itemi:[{id:'C1',parte:'C',puncte:20},…]});
     tipuri:{probatabel:EvalRepetitiiVI.punctat(UrmarireAlgoritm.tipuri.urmarire,'tabel'),
             probascratch:EvalRepetitiiVI.punctat(SimScratchControl.tipuri.scratch,'scratch'),
             probavar:EvalRepetitiiVI.punctat(SimScratchVariabile.tipuri.scratch,'scratch'),
             probaalege:EvalRepetitiiVI.punctat(EvalRepetitiiVI.alegere,'alege')}

   FORMA LUI Q = a tipului de bază, plus:
     proba:'C1'          id-ul cerinței (fără el sau cu un id necunoscut: tipul de bază, neschimbat, fără puncte);
     la 'scratch':       Q.teste[i].puncte (fără = doar bifă), .ceInainte (textul până la prima verificare: testul nu-și
                         spune răspunsul), .pazaDupa:N (testul „n-ai stricat”: dacă pică, ia min(N, câștigate)),
                         .lectia (HTML: unde recitești);
     la 'tabel':         Q.puncte = {<k>: p, fin: p} (pe rândurile tabelului: trecerea / testul k și „La final”);
                         Q.urmareste = {mod:'treceri'|'teste'|'pana', inainte:{…}, corp:['s ← s - i', …],
                                        cond:'n ≥ 4' (teste / pana), contor:'i' (treceri), fin:'s'}
                         = cum se calculează un rând din rândul de deasupra (pentru „o scăpare se pedepsește o
                         singură dată”, mai jos); Q.lectia = unde recitești;
     la 'alege':         q, o:[…], ok, mesaje:{indice:'…'}, ce, lectia, why, ajutor; punctele = PRIMA variantă verificată.

   REGULILE (Info_Gimnaziu_2026/SISTEM_EVALUARE.md §4; _campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md; ghidul IV.2;
   spuse la clasa a VI-a în lecția 1, pasul „Lucrarea și nota ei”): C = De bază 40, B = Consolidat 30, A = Avansat 20,
   10 din oficiu; nota = punctaj : 10, rotunjită la cel mai apropiat întreg, la ,5 în favoarea elevului (85 → 9, 84 → 8);
   nivelul se citește din notă: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate.
   Cerințele și punctele pe cerințe sunt ale PAGINII (antrenament), nu ale profesorului: panoul o spune.

   CE FACE
   1. Punctele unei cerințe se socotesc O SINGURĂ DATĂ, la PRIMA apăsare pe „Verifică” / „Rulează testele”: întâi verifică
      simulatorul (lista lui primește ✓ / ✗), apoi citesc din listă ce a trecut. Ce repară elevul după aceea e exercițiu.
   2. „Verifică” pe simulatorul NEATINS (programul sau tabelul ca la pornire) nu socotește nimic și o spune.
      „Arată-mi răspunsul” înainte de prima verificare = 0 la cerința aceea.
   3. Până la prima verificare nu se văd bifele, numărătoarea „x din y trec”, motivele și „Am nevoie de un indiciu”.
   4. TABELUL: „o scăpare se pedepsește o singură dată” (ghidul IV.2 §7) — O SINGURĂ regulă, pe toate drumurile (1.1):
      greșeala de pe un rând (un calcul, o oprire prea devreme, o oprire prea târziu = o continuare după testul care
      oprește) costă doar punctele rândului ei. Rândurile de după și „La final” se judecă și față de rândul ELEVULUI de deasupra (drumul lui: valorile lui,
      oprirea lui, continuarea lui): făcute bine din el, își primesc punctele, iar panoul spune de ce. Gardul împotriva
      tabelului scris la întâmplare: acest credit „din rândul tău” se dă doar dacă tabelul are MĂCAR UN RÂND BUN (un rând
      cu puncte, bun față de algoritm sau calculat bine din rândul de deasupra; rândurile lăsate goale după oprirea
      elevului nu se socotesc aici). Fără niciun rând bun, contează doar ce e bun față de algoritm (ex. „La final” corect).
      Pagina o spune elevului o singură dată, în pasul „Urmărirea pas cu pas” (VI/26, pasul 3).
   5. Panoul probei, deasupra cerinței: unde ești, punctele pe cerințe, „Sunt alt elev / Încep din nou”; după ultima cerință:
      punctele pe părți, oficiul, punctajul, nota, nivelul și „Unde ai pierdut puncte și ce recitești”.
   6. Nimic din probă nu se scrie în localStorage sau pe server: totul stă în memoria paginii. Singura urmă: un SEMN fără
      date, sessionStorage 'erv6_proba_golita' = '1', pus la prima cerință notată și șters la golire, ca la redeschiderea
      paginii panoul să spună că proba a început din nou. Proba se golește la „Sunt alt elev / Încep din nou” și la
      schimbarea elevului din caseta prezenta.js (evenimentul `prezenta`), ca la VI/16 (regula 23).
   7. SCRATCH (1.1): contează DOAR scripturile care încep cu „când se dă click pe ⚑” — ca în Scratch, unde blocurile
      lăsate libere în zona de cod nu rulează la steag. `laSteag(P)` le întoarce; `cuStart` schimbă „mergi la x … y”
      doar în ele, deci un „mergi la” rătăcit sau programul tras în alt loc al zonei de cod nu mai schimbă testele.
   Global: window.EvalRepetitiiVI {configureaza, punctat, alegere, nota, nivel, stare, laSteag, cuStart, ruleazaDin, _intern}.
   Probele: lectii/vi/m4-l26/_proba/ (ultima linie 0).
   1.1 (02.11.2026, reparația după judecata 1 a VI/26 — lectii/vi/m4-l26/_verificare/registru_j1.md, punctele A, B, G):
     - NOU `laSteag(P)`; `cuStart` / `ruleazaDin` schimbă „mergi la” doar în scripturile cu steag (până la 1.0: PRIMUL
       „mergi la” din toată lista, chiar și unul lăsat liber — un program corect era respins, cu mesaj fals: punctul A);
     - tabelul: oprirea prea devreme nu mai costă și rândurile de după (până la 1.0: le pierdea, deși pasul 3 spunea
       altfel — punctul B; acum: oprirea prea devreme și cea prea târziu costă la fel); gardul pentru „La final” = „măcar un rând bun” (până la 1.0: unul din ultimele două rânduri
       bun, deci două greșeli de calcul la rând pierdeau și „La final” făcut bine din rândul elevului — punctul G);
     - `_intern.dusMaiDeparte` întoarce {k: bun, fin: bun, pasiv:{k: true}} (până la 1.0: `dupa` în loc de `pasiv`).
     Restul API-ului (configureaza, punctat, alegere, nota, nivel, stare, cuStart, ruleazaDin, forma lui Q) NESCHIMBAT.
   ====================================================================================================== */
(function(){
'use strict';
const VERSIUNE='1.1 (02.11.2026)';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let CFG=null;
const ST={scor:{},pierdute:{},dus:{},ultima:null,nota:'',laC1:false};
const SEMN='erv6_proba_golita';
let cineAcum='null';

const nota=p=>Math.min(10,Math.max(1,Math.floor((p+5)/10)));
const nivel=n=>n>=9?'Avansat':n>=7?'Consolidat':n>=5?'De bază':n>=3?'În formare':'În dificultate';
const item=id=>CFG&&CFG.itemi.find(x=>x.id===id);
const primul=()=>CFG.itemi[0].id;
const completa=()=>!!CFG&&CFG.itemi.every(it=>ST.scor[it.id]!==undefined);
const inceputa=()=>!!CFG&&CFG.itemi.some(it=>ST.scor[it.id]!==undefined);
const virgula=x=>String(x).replace('.',',');
const pct=n=>n===1?'un punct':(n===0||(n%100>=1&&n%100<=19))?`${n} puncte`:`${n} de puncte`;
const semn=v=>{try{if(v)sessionStorage.setItem(SEMN,'1');else sessionStorage.removeItem(SEMN)}catch(e){}};
const areSemn=()=>{try{return sessionStorage.getItem(SEMN)==='1'}catch(e){return false}};
const golesteProba=()=>{ST.scor={};ST.pierdute={};ST.dus={};ST.ultima=null;semn(false)};
const cineE=()=>{try{return JSON.stringify(window.Prezenta&&Prezenta.identitate?Prezenta.identitate():null)}catch(e){return 'null'}};

function configureaza(c){CFG=c;css();
  const s=Object.keys(c.parti).reduce((a,k)=>a+c.parti[k].max,0)+c.oficiu;
  if(s!==100)console.warn('eval-repetitii-vi: părțile + oficiul fac',s,'nu 100');
  Object.keys(c.parti).forEach(k=>{const t=c.itemi.filter(it=>it.parte===k).reduce((a,it)=>a+it.puncte,0);
    if(t!==c.parti[k].max)console.warn('eval-repetitii-vi: partea',k,'are cerințe de',t,'p, nu',c.parti[k].max)});
  cineAcum=cineE();
  if(areSemn()){semn(false);ST.nota='Pagina s-a deschis din nou, deci proba de antrenament începe de la capăt: pe calculator nu se păstrează nimic din ea.'}
}

function socoteste(){
  const parti={};Object.keys(CFG.parti).forEach(k=>parti[k]=0);
  CFG.itemi.forEach(it=>{parti[it.parte]+=ST.scor[it.id]});
  const p=Object.keys(parti).reduce((a,k)=>a+parti[k],0)+CFG.oficiu,n=nota(p);
  return {puncte:p,nota:n,nivel:nivel(n),parti,
    itemi:Object.fromEntries(CFG.itemi.map(it=>[it.id,{p:ST.scor[it.id],max:it.puncte,pierdute:ST.pierdute[it.id]||[]}]))};
}

/* ---------- tabelul: „o scăpare se pedepsește o singură dată” (rândul judecat și din rândul elevului de deasupra) ---------- */
const UA=()=>window.UrmarireAlgoritm;
/* numărul scris de elev („7”, „7,5”, „s = 4 + 3 = 7”: numărul de după ultimul „=”) sau null */
function valoareScrisa(s){
  const t=String(s==null?'':s).trim();if(!t)return null;
  const u=t.split('=').pop().trim().replace(/\s+/g,'').replace(',','.');
  return /^[-−]?\d+(\.\d+)?$/.test(u)?parseFloat(u.replace('−','-')):null;
}
const golScris=s=>{const t=String(s==null?'':s).trim().toLowerCase();return t===''||t==='-'||t==='—'||/se opre/.test(t)||/nu se execut/.test(t)};
/* aplică rândurile corpului („nume ← expresie”), în ordine, pe valorile v */
function aplica(corp,v){
  const w=Object.assign({},v);
  (corp||[]).forEach(r=>{const m=String(r).match(/^\s*([A-Za-zĂÂÎȘȚăâîșț_]\w*)\s*(?:←|<-)\s*(.+)$/);if(!m)return;
    w[m[1]]=UA().evalueaza(m[2],w)});
  return w;
}
/* întoarce {k: true|false, fin: true|false, pasiv:{k: true}}: rândurile făcute bine din rândul ELEVULUI de deasupra
   (drumul lui: valorile lui, oprirea lui, continuarea lui); `pasiv` = rândurile de după oprirea ELEVULUI (corectă sau
   prea devreme), judecate „rămân goale”: urmează din alegerea lui, dar nu arată muncă (nu intră în „măcar un rând bun”) */
function dusMaiDeparte(Q,body){
  const U=body._ua,R=Q.urmareste,out={pasiv:{}};if(!U||!R||!UA())return out;
  const ck=U.ck||[],rand={};
  ck.forEach(c=>{if(c.k==='fin')return;(rand[c.k]=rand[c.k]||[]).push(c)});
  const ks=Object.keys(rand).map(Number).sort((a,b)=>a-b);
  const max=ks.length?ks[ks.length-1]:0;
  const val=id=>{const e=body.querySelector(`[data-i="${id}"]`);return e?e.value:''};
  const bun=(scris,v)=>{try{return UA().potriveste(scris,UA().format(v))}catch(e){return false}};
  const teste=R.mod==='teste',pana=R.mod==='pana';
  let prev=Object.assign({},R.inainte||{}),oprit=false,opritGresit=false;
  try{
    for(let k=1;k<=max;k++){
      const cells=rand[k]||[];
      let ex=null,exCond=null,gol=false;
      if(oprit)gol=true;
      else if(teste){exCond=!!UA().evalueaza(R.cond,prev);if(exCond)ex=aplica(R.corp,prev);else gol=true}
      else if(pana){ex=aplica(R.corp,prev);exCond=!!UA().evalueaza(R.cond,ex)}
      else{const p=Object.assign({},prev);p[R.contor]=k;ex=aplica(R.corp,p);ex[R.contor]=k}
      const trebuiaOprire=!oprit&&(teste?exCond===false:pana?exCond===true:false);
      if(!cells.length){if(ex)prev=ex;if(trebuiaOprire)oprit=true;continue}   // rând completat dinainte (facut)
      let ok=true,toateScrise=true,condScrisa='';const scrise={};
      cells.forEach(c=>{const s=val(c.id);
        if(c.tip==='cond'){condScrisa=s;
          if(oprit)ok=ok&&s==='';
          else ok=ok&&s===(exCond?'adevărat':'fals')}
        else if(c.tip==='set'){
          const v=valoareScrisa(s);if(v===null)toateScrise=false;else scrise[c.col]=v;
          if(gol)ok=ok&&golScris(s);
          else ok=ok&&bun(s,ex[c.col])}
        else if(c.tip==='afis'){
          if(gol)ok=ok&&golScris(s);
          else ok=ok&&(c.exp===''||bun(s,c.exp))}});
      out[k]=ok;
      if(oprit){out.pasiv[k]=true;continue}                                  // după oprirea lui: rândul trebuie să rămână gol
      /* ce a hotărât ELEVUL pe rândul acesta, și de unde pornește rândul următor */
      const zisOprire=teste?condScrisa==='fals':pana?condScrisa==='adevărat':false;
      const zisContinua=teste?condScrisa==='adevărat':pana?condScrisa==='fals':false;
      if(zisOprire){
        if(!trebuiaOprire)opritGresit=true;
        oprit=true;
        if(pana&&ex)prev=toateScrise?Object.assign({},ex,scrise):ex;      // la până când, corpul s-a făcut pe rândul acesta
      }else if(zisContinua&&trebuiaOprire){                                  // a continuat după oprire, pe valorile lui
        if(toateScrise)prev=Object.assign({},prev,ex||{},scrise);
      }else if(!condScrisa&&trebuiaOprire){oprit=true}                       // n-a ales nimic la condiție: drumul bun
      else if(!gol&&ex)prev=toateScrise?Object.assign({},ex,scrise):ex;
    }
    const fin=ck.find(c=>c.k==='fin');
    if(fin&&R.fin)out.fin=bun(val(fin.id),prev[R.fin]);
  }catch(e){return out}
  return out;
}

/* ---------- punctele unei cerințe, la prima verificare ---------- */
const SEL={scratch:'.ss-tst li',tabel:'.ua-teste li'};
function noteaza(Q,body,ok,zero,fel){
  const it=item(Q.proba);if(!it||ST.laC1||ST.scor[it.id]!==undefined)return;
  let p=0;const pierd=[],dus=[];
  if(zero){pierd.push({ce:Q.ce||'Cerința '+Q.proba+' (ai cerut răspunsul înainte de prima verificare)',puncte:it.puncte,lectia:Q.lectia||''})}
  else if(fel==='scratch'&&Array.isArray(Q.teste)&&Q.teste.length){
    const lis=[...body.querySelectorAll(SEL.scratch)];
    const potrivite=lis.length===Q.teste.length;
    if(!potrivite)console.warn('eval-repetitii-vi:',Q.proba,'are',Q.teste.length,'teste, dar pe ecran sunt',lis.length);
    const trece=i=>ok||(potrivite&&lis[i].classList.contains('ok'));
    Q.teste.forEach((T,i)=>{const pt=T.puncte||0;if(!pt)return;
      if(trece(i))p+=pt;else pierd.push({ce:T.ce,puncte:pt,lectia:T.lectia||''})});
    Q.teste.forEach((T,i)=>{const n=+T.pazaDupa||0;if(!n||p<=0||trece(i))return;
      const ia=Math.min(n,p);p-=ia;pierd.push({ce:T.ce,puncte:ia,lectia:T.lectia||''})});
  }
  else if(fel==='tabel'&&Q.puncte&&typeof Q.puncte==='object'){
    const lis=[...body.querySelectorAll(SEL.tabel)],d=ok?{pasiv:{}}:dusMaiDeparte(Q,body);
    /* O SINGURĂ regulă (antetul, punctul 4): bun = bifat de tabel SAU făcut bine din rândul elevului de deasupra (drumul
       lui), iar creditul „din rândul tău” se dă doar dacă tabelul are măcar un rând bun cu puncte (fără rândurile goale
       de după oprirea lui): un tabel scris la întâmplare nu ia puncte doar copiind ultima valoare sau oprindu-se la
       primul rând */
    const rs=lis.map(li=>{const k=li.dataset.t,kk=k==='fin'?'fin':+k;
      return {kk,pt:+Q.puncte[k]||0,eticheta:li.textContent.replace(/^[○✓✗]\s*/,'').trim(),
        tabel:!!ok||li.classList.contains('ok'),drum:kk==='fin'?!!d.fin:!!d[kk],pasiv:kk!=='fin'&&!!(d.pasiv&&d.pasiv[kk])}});
    const unRandBun=rs.some(r=>r.kk!=='fin'&&r.pt>0&&!r.pasiv&&(r.tabel||r.drum));
    rs.forEach(r=>{let bun=r.tabel;
      if(!bun&&unRandBun&&r.drum){bun=true;if(r.pt)dus.push({e:r.eticheta,cum:r.kk==='fin'?'fin':r.pasiv?'pasiv':'dus'})}
      if(r.pt){if(bun)p+=r.pt;else pierd.push({ce:r.eticheta,puncte:r.pt,lectia:Q.lectia||''})}});
  }
  else if(ok)p=it.puncte;
  else pierd.push({ce:Q.ce||Q.proba,puncte:it.puncte,lectia:Q.lectia||''});
  ST.scor[it.id]=Math.min(p,it.puncte);ST.pierdute[it.id]=pierd;ST.dus[it.id]=dus;ST.nota='';semn(true);
  if(completa())ST.ultima=socoteste();
}

/* simulatorul neatins: programul din zona de cod / căsuțele tabelului, ca la pornire */
const amprenta=(body,fel)=>{
  try{
    if(fel==='scratch')return body._ss?'S\u0001'+JSON.stringify(body._ss.program()):null;
    if(fel==='tabel')return 'T\u0001'+[...body.querySelectorAll('[data-i]')].map(e=>e.value).join('\u0002');
  }catch(e){}
  return null;
};

/* ---------- panoul probei ---------- */
const CSS=`.erv-panou{border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper);padding:10px 12px;margin:0 0 12px;font-size:.95rem}
.erv-panou .erv-sus{font-weight:700;margin:0 0 6px}
.erv-itemi{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0 0 6px;padding:0}
.erv-itemi li{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-family:var(--fm);font-size:.85rem;background:var(--paper2);white-space:nowrap}
.erv-itemi li.acum{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.erv-itemi li.gata{background:var(--okbg)}
.erv-panou p{margin:.35em 0}
.erv-panou .erv-final{border-top:1px dashed var(--line);margin-top:8px;padding-top:8px}
.erv-panou .erv-mare{font-size:1.05rem}
.erv-panou details{margin:.4em 0}
.erv-panou details summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-weight:600}
.erv-panou ul.erv-pierd{margin:.3em 0 .3em 1.1em;padding:0}
.erv-panou ul.erv-pierd li{margin:.2em 0}
.erv-panou ul.erv-pierd a{display:inline-block;padding:6px 0}
.erv-panou .erv-alt{margin-top:4px;min-height:36px}
#body.erv-ascuns .ss-tst li .s{visibility:hidden}
#body.erv-ascuns .ss-tst .nr,#body.erv-ascuns .ss-tst li .m{display:none!important}
#body.erv-ascuns .ss-tst li,#body.erv-ascuns .ss-tst li.ok,#body.erv-ascuns .ss-tst li.no{color:var(--ink2)!important;font-weight:400!important}
#body.erv-ascuns .ua-teste li::before{content:"○ "!important;color:var(--ink2)!important;font-weight:400!important}
.erv-opts{display:grid;gap:8px;margin:6px 0}
.erv-opts .opt{min-height:44px;text-align:left}
.erv-dus{font-size:.92rem;margin:.5em 0 0}`;
function css(){if(!document.getElementById('erv-css')){const s=document.createElement('style');s.id='erv-css';s.textContent=CSS;document.head.appendChild(s)}}

function listaPierdute(itemi){
  if(!itemi)return '';
  const l=CFG.itemi.map(it=>({it,l:itemi[it.id]&&Array.isArray(itemi[it.id].pierdute)?itemi[it.id].pierdute:[]})).filter(x=>x.l.length);
  /* legătura stă la sfârșitul rândului, fără punct după ea (pe telefon punctul ar rămâne singur pe rând) */
  return l.length?`<ul class="erv-pierd">${l.map(x=>x.l.map(t=>`<li><b>${esc(x.it.id)}</b>, ${pct(+t.puncte||0)}: ${t.ce}.${t.lectia?` Recitește ${t.lectia}`:''}</li>`).join('')).join('')}</ul>`:'';
}
function textFinal(r){
  const P=Object.keys(CFG.parti).map(k=>`${k} ${r.parti[k]} din ${CFG.parti[k].max}`).join(' + ');
  const imp=r.puncte/10,intreg=Number.isInteger(imp),jumate=!intreg&&Math.round(imp*10)%10===5;
  const cum=intreg?'':jumate?' (la ,5 nota se rotunjește în favoarea ta)':' (rotunjită la cel mai apropiat număr întreg)';
  const lista=listaPierdute(r.itemi);
  return `<div class="erv-final"><p class="erv-mare"><b>Punctajul probei:</b> ${P} + ${CFG.oficiu} din oficiu = <b>${pct(r.puncte)}</b>.</p>
<p>Nota = ${r.puncte} : 10 = ${virgula(imp)} → <b>nota ${r.nota}</b>${cum}. Nivelul, citit din notă: <b>${esc(r.nivel)}</b>.</p>
${lista?`<details open><summary>Unde ai pierdut puncte și ce recitești</summary>${lista}</details>`:'<p>N-ai pierdut niciun punct la cerințe.</p>'}
<p class="hint">E nota pe antrenament: cerințele și punctele pe cerințe sunt ale paginii. Nota adevărată o dă profesorul, la lucrare. Scrie în caiet punctajul și nota: pe calculator nu rămân.</p></div>`;
}
function deseneaza(el,id){
  if(!el||!el.isConnected||!CFG)return;
  const it=item(id),P=CFG.parti[it.parte],scorat=ST.scor[id]!==undefined;
  const chips=CFG.itemi.map(x=>{const s=ST.scor[x.id];return `<li class="${x.id===id?'acum':''}${s!==undefined?' gata':''}">${esc(x.id)} ${s!==undefined?s:'—'}/${x.puncte}</li>`}).join('');
  let h=`<p class="erv-sus">Proba de antrenament · ${esc(it.id)}: partea ${esc(it.parte)}, ${esc(P.nume)} · ${pct(it.puncte)} · nu intră în catalog</p>
<ul class="erv-itemi" aria-label="Punctele pe cerințe">${chips}</ul>`;
  if(ST.nota)h+=`<p class="hint">${ST.nota}</p>`;
  if(ST.laC1&&id!==primul())h+=`<p><b>Proba nouă începe de la ${esc(primul())}.</b> Aici nu se socotesc puncte. Mergi la ${esc(primul())}: apasă butonul „Atelier” din bara de sus a lecției.</p>`;
  else if(!scorat&&id===primul())h+=`<p>Lucrezi toată cerința, apoi apeși butonul de verificare de sub ea: punctele se socotesc la <b>prima</b> apăsare; abia atunci apar bifele și indiciul. Ce repari după aceea nu le mai schimbă.</p>`;
  else if(scorat){const l=ST.pierdute[id]||[],d=ST.dus[id]||[];
    h+=`<p>La ${esc(id)}: <b>${ST.scor[id]} din ${it.puncte}</b>${l.length?'':' (tot)'}, de la prima verificare.</p>`;
    if(d.length){const de=c=>d.filter(x=>x.cum===c).map(x=>esc(x.e)),un=a=>a.length===1,f=[];
      const a=de('dus'),b=de('pasiv');
      if(a.length)f.push(`${a.join('; ')}: ${un(a)?'rândul e greșit':'rândurile sunt greșite'} față de algoritm, dar ${un(a)?'l-ai':'le-ai'} calculat bine din rândul tău de deasupra, deci ${un(a)?'își primește':'își primesc'} punctele.`);
      if(b.length)f.push(`${b.join('; ')}: ${un(b)?'rândul e gol':'rândurile sunt goale'}, pentru că te-ai oprit mai sus; asta urmează din alegerea ta, deci ${un(b)?'își primește':'își primesc'} punctele.`);
      if(d.some(x=>x.cum==='fin'))f.push('„La final” e valoarea din ultimul tău rând, deci își primește punctele.');
      h+=`<p class="erv-dus">${f.join(' ')} Greșeala o pierzi o singură dată, acolo unde ai făcut-o.</p>`}}
  if(completa()&&ST.ultima)h+=textFinal(ST.ultima);
  h+=`<button type="button" class="btn ghost sm erv-alt">Sunt alt elev / Încep din nou</button>`;
  el.innerHTML=h;
  el.querySelector('.erv-alt').onclick=()=>laInceput('Proba începe din nou, de la '+primul()+'.');
}
let panouAcum=null;
const redeseneaza=()=>{if(panouAcum)deseneaza(panouAcum.el,panouAcum.id)};
const peEcran=()=>!!(panouAcum&&panouAcum.el&&panouAcum.el.isConnected);
function mergiLaC1(){
  try{const s=window.JocMotor&&JocMotor.test&&JocMotor.test.stare&&JocMotor.test.stare();
    if(s&&s.mode==='practice'&&peEcran())JocMotor.test.exercitiu(0)}catch(e){}
  if(peEcran()&&panouAcum.id===primul())return true;
  ST.nota=(ST.nota?ST.nota+' ':'')+'Pagina nu te-a putut duce singură la '+primul()+'.';redeseneaza();return false;
}
function laInceput(n){golesteProba();ST.nota=n;ST.laC1=true;
  if(peEcran())mergiLaC1();else redeseneaza();
}
addEventListener('prezenta',e=>{let k;try{k=JSON.stringify(e.detail||null)}catch(x){k='null'}
  const inainte=cineAcum;cineAcum=k;
  if(CFG&&k!==inainte&&inceputa())laInceput('S-a schimbat elevul din caseta de jos: proba de pe ecran nu mai e a ta. Proba începe de la '+primul()+'.');
  else redeseneaza()});

/* ---------- învelitoarea: punctele la prima verificare ---------- */
function punctat(baza,fel){
  return {
    render(Q,body,api){
      document.querySelectorAll('.erv-panou').forEach(x=>x.remove());
      body.querySelectorAll('.erv-dus-tabel').forEach(x=>x.remove());
      const it=item(Q.proba);
      delete body._ss;delete body._ua;body._ervAlege=null;
      if(!it){body.classList.remove('erv-ascuns');panouAcum=null;return baza.render(Q,body,api)}
      css();
      if(it.id===primul()){ST.laC1=false;if(completa()){golesteProba();ST.nota='Ai început o probă nouă.'}}
      const scorat=()=>ST.scor[it.id]!==undefined;
      const are=Array.isArray(Q.teste)&&Q.teste.some(T=>T&&T.ceInainte);
      const Q2=!scorat()&&are?Object.assign({},Q,{teste:Q.teste.map(T=>T.ceInainte?Object.assign(Object.create(T),{ce:T.ceInainte}):T)}):Q;
      const textAdevarat=()=>{if(Q2===Q)return;
        Q2.teste.forEach((T,i)=>{const real=Q.teste[i].ce;if(T.ce===real)return;const vechi=T.ce;T.ce=real;
          const li=body.querySelector(`.ss-tst li[data-i="${i}"]`);if(li&&li.innerHTML.includes(vechi))li.innerHTML=li.innerHTML.split(vechi).join(real)})};
      const aj=body.parentNode?body.parentNode.querySelector(':scope > .ajutor'):null;
      const arata=()=>{body.classList.remove('erv-ascuns');if(aj)aj.hidden=false;textAdevarat()};
      if(scorat())arata();else{body.classList.add('erv-ascuns');if(aj)aj.hidden=true}
      let el=null,start=null;
      const dupa=()=>{if(el)deseneaza(el,it.id)};
      const api2=Object.assign({},api,{
        resolve(ok,msg){let m=msg||'';
          if(ST.laC1&&it.id!==primul()){arata();api.resolve(ok,m+' <br><i>Aici nu se socotesc puncte: proba nouă începe de la '+esc(primul())+'.</i>');dupa();return}
          if(!scorat()){
            const acum=amprenta(body,fel);
            if(!ok&&start!==null&&acum!==null&&acum===start){
              api.feedback('bad',fel==='tabel'?'<strong>Tabelul e gol, ca la început.</strong> Punctele nu s-au socotit: completează-l, apoi apasă „Verifică”.'
                :'<strong>Programul e la fel ca la început.</strong> Punctele nu s-au socotit: fă programul, apoi apasă „Rulează testele”.');
              dupa();return}
            noteaza(Q,body,!!ok,false,fel);arata();
            if(!ok)m+=` <br><b>Puncte la ${esc(it.id)}: ${ST.scor[it.id]} din ${it.puncte}</b>, de la prima verificare.`}
          api.resolve(ok,m);dupa()},
        giveUp(html){if(!scorat()&&!ST.laC1)noteaza(Q,body,false,true,fel);arata();api.giveUp(html);dupa()}
      });
      baza.render(Q2,body,api2);
      start=amprenta(body,fel);
      el=document.createElement('div');el.className='erv-panou';el.setAttribute('aria-live','polite');
      body.parentNode.insertBefore(el,aj||body);panouAcum={el,id:it.id};deseneaza(el,it.id);
      if(ST.laC1&&it.id!==primul())setTimeout(()=>{if(ST.laC1&&peEcran()&&panouAcum.id===it.id)mergiLaC1()},0);
    },
    rezolva(Q,body,api){return baza.rezolva?baza.rezolva(Q,body,api):false},
    gresit(Q,body,api){return baza.gresit?baza.gresit(Q,body,api):false}
  };
}

/* ---------- alegerea (explicația de la partea A: „de ce?”), ca în editorweb-proba.js ---------- */
const alegere={
  render(Q,body,api){
    css();
    const ord=Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k));let ales=null;
    body.innerHTML=`<div class="erv-opts" role="group" aria-label="Variantele de răspuns">${ord.map(k=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${Q.html?Q.o[k]:esc(Q.o[k])}</button>`).join('')}</div>`;
    const bs=[...body.querySelectorAll('.opt')];
    const des=()=>bs.forEach(b=>{const on=+b.dataset.k===ales;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
    bs.forEach(b=>b.onclick=()=>{if(api.done())return;ales=+b.dataset.k;bs.forEach(x=>x.classList.remove('bad'));des()});
    const arataBun=()=>{bs.forEach(x=>x.disabled=true);const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.classList.add('ok')};
    const nav=api.checkButton(()=>{
      if(ales===null){api.feedback('bad','<strong>Alege întâi o variantă.</strong> Apoi apasă „Verifică”.');return}
      if(ales===Q.ok){arataBun();nav.innerHTML='';api.resolve(true)}
      else{const b=body.querySelector(`.opt[data-k="${ales}"]`);if(b)b.classList.add('bad');
        api.resolve(false,(Q.mesaje&&Q.mesaje[ales])||'Varianta aleasă nu e cea bună.');
        api.revealButton(()=>{ales=Q.ok;des();arataBun();nav.innerHTML='';api.giveUp(Q.html?Q.o[Q.ok]:esc(Q.o[Q.ok]))})}
    });
    body._ervAlege={pune:k=>{ales=k;des()}};
  },
  rezolva(Q,body){if(!body._ervAlege)return false;body._ervAlege.pune(Q.ok);return true},
  gresit(Q,body){if(!body._ervAlege)return false;body._ervAlege.pune(Q.o.findIndex((_,k)=>k!==Q.ok));return true}
};

/* ---------- ajutoare pentru testele paginii (programul elevului rulat din alt loc de pornire) ---------- */
const copie=o=>JSON.parse(JSON.stringify(o));
/* scripturile care pornesc la steag: încep cu „când se dă click pe ⚑” (ca în Scratch, blocurile libere nu rulează) */
const laSteag=P=>(Array.isArray(P)?P:[]).filter(s=>s&&Array.isArray(s.b)&&Array.isArray(s.b[0])&&s.b[0][0]==='steag');
/* copie a programului în care, în FIECARE script cu steag, primul „mergi la x … y: …” are alt x (ca elevul care schimbă
   numărul din programul lui și apasă steagul); blocurile libere rămân cum sunt (1.1, punctul A). Fără „mergi la”,
   programul rămâne același, iar ruleazaDin pune pisica acolo înainte de steag */
function cuStart(P,x){
  const Q=copie(P||[]);
  laSteag(Q).forEach(s=>{let gata=false;
    const umbla=l=>{(l||[]).forEach(b=>{if(gata||!Array.isArray(b))return;
      const o=b[b.length-1],ob=o&&typeof o==='object'&&!Array.isArray(o)?o:null;
      if(b[0]==='mergi_la_xy'){b[1]=x;if(ob&&ob.s&&ob.s[0])delete ob.s[0];gata=true;return}
      if(ob&&Array.isArray(ob.guri))ob.guri.forEach(umbla)})};
    umbla(s.b)});
  return Q;
}
/* rulează programul de la steag, cu pisica pornită din x (și cu „mergi la” schimbat), fără să atingă ecranul */
function ruleazaDin(P,x,o){
  o=o||{};const pers={x,y:0,directie:90};
  if(window.SimScratchVariabile&&SimScratchVariabile.ruleaza){
    const r=SimScratchVariabile.ruleaza(cuStart(P,x),{variabile:o.variabile||{},cadre:o.cadre||900,personaj:pers});
    return {x:r.U.x,y:r.U.y,spuse:r.U.spuse||[],variabile:r.variabile||{},terminat:r.terminat,U:r.U};
  }
  const U=SimScratch.urma(cuStart(P,x),Object.assign({},pers,{cadre:o.cadre||900}));
  return {x:U.x,y:U.y,spuse:U.spuse||[],variabile:{},terminat:U.terminat,U};
}

window.EvalRepetitiiVI={versiune:VERSIUNE,configureaza,punctat,alegere,nota,nivel,laSteag,cuStart,ruleazaDin,
  stare:()=>({scor:Object.assign({},ST.scor),completa:completa(),laC1:ST.laC1,ultima:ST.ultima?JSON.parse(JSON.stringify(ST.ultima)):null}),
  _intern:{valoareScrisa,golScris,aplica,dusMaiDeparte}};
})();
