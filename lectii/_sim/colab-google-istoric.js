/* Extensia „Sugerare, istoricul versiunilor, publicarea” pentru simulatorul Google al lecțiilor VII (lectii/_sim/colab-google.js)
   — fișier comun (lectii/_sim/colab-google-istoric.js).
   PROPRIETAR: autorul lecției VII · M3 · nr. 20 („Publicare și modificare de conținut. Istoricul editării și contribuția
   fiecăruia”), 24.10.2026. NU schimbă colab-google.js (al lecției 18) și nici extensia lecției 19: se înregistrează cu
   SimColabGoogle.extensie('istoric', fn) și desenează doar în sloturile lui ('doc-pagina', 'doc-lateral', 'doc-bara') și în
   fereastra lui (arataPanou). Se încarcă DUPĂ colab-google.js. Granița: m3_noapte_23_10/granite/vii_l20.md.

   CE SIMULEAZĂ (un DESEN, nu Documentele Google adevărate; numele din ajutorul Google în română, lectii/vii/m3-l20/surse.md):
     - modul de lucru, dreapta sus: Editare (Editing) / Sugerare (Suggesting) / Vizualizare (Viewing). Pe Sugerare, ce scrii
       apare colorat, iar ce ștergi apare tăiat; textul colegului rămâne până hotărăște un Editor;
     - sugestiile, în dreapta documentului: cine a propus, ce schimbă, ✓ Acceptă / ✕ Respinge (doar Editorul sau proprietarul;
       Comentatorul doar sugerează, Cititorul nici atât — ajutorul Google, „Trimiteți fișierele din Google Drive”);
     - istoricul versiunilor: butonul cu ceas din dreapta sus („Ultima modificare”, pictograma „Istoricul versiunilor”) sau
       Fișier → Istoricul versiunilor → Vezi istoricul versiunilor; lista versiunilor (data, numele celor care au scris, cu
       culoarea fiecăruia; schimbările versiunii alese au în text aceeași culoare), Mai multe (⋮) → Denumește această versiune,
       Restabilește această versiune → Restabilește, Înapoi. Istoricul îl vede doar cine are drept de Editor (sau proprietarul);
     - publicarea: Permite accesul (fereastra MEA, simplă: adresa, rolul Cititor / Comentator / Editor, Trimite),
       Fișier → Descarcă → Document PDF (.pdf) (pe calculatorul adevărat fișierul ajunge în Descărcări), Fișier → Trimite →
       Publică pe web (se poate apăsa, ca în aplicație; testul `nepublicat` pică și pagina spune de ce).
   Editarea unui paragraf: în desen apeși pe paragraf și îl scrii într-o casetă (Enter sau „Gata” = gata). În Documentele
   adevărate scrii direct în pagină. Pagina lecției o spune.

   SIGURANȚA (ca colab-google.js): nimic din ce tastează elevul nu se scrie în localStorage / sessionStorage / cookie și nu
   pleacă în rețea; câmpurile sunt <input type="text"> / <textarea> fără <form>, fără `name`, cu autocomplete oprit.

   API
     Date, în opțiunile lui SimColabGoogle.creeaza (sim:{…}): istoric:{
       eu:'ana'                       cheia contului elevului (din `autori`)
       rol:'editor'|'comentator'|'cititor'   implicit 'editor' (proprietar = cel din `proprietar`)
       proprietar:'ana'               cine are documentul (implicit `eu`)
       mod:'editare'|'sugerare'|'vizualizare'   modul la start (implicit: editare; comentator → sugerare; cititor → vizualizare)
       autori:{cheie:{nume, c (culoare pe fond deschis), cd (pe fond închis)}}   implicit AUTORI (ana, radu, ioana, mihai, maria)
       versiuni:[{id, cand:'joi, 11 februarie, 17:05', autori:['ana'], par:[{id, autor, de?, text}], nume?}]   de la cea mai veche;
                 ultima = documentul de acum ( `de` = cine a schimbat ultima oară paragraful; implicit `autor`)
       sugestii:[{id, par, de, nou:'textul nou al paragrafului'}]   sugestiile deschise la start
       profesor:{adresa, nume}        adresa (inventată) a profesorului, pentru partajare
       acces:[{adresa, nume, rol}]    cine are deja acces (lista din fereastra Permite accesul)
     }
     Documentul deschis e fișierul `deschis` (start:'doc'); textul lui = paragrafele ultimei versiuni.
     inst.istoric (după creare):
       stare()  — copie: {eu, rol, mod, par[], sug[], vers[], ist{deschis, ales, vazute[], fostDeschis}, decizii{}, directe[],
                  sugerate[], moduri[], numite[{v, nume}], restabilite[], partajari[{adresa, rol}], publicatWeb, descarcat, info}
       seteazaMod(m)  sugereaza(parId, textNou)  editeaza(parId, textNou)  accepta(sugId)  respinge(sugId)
       deschideIstoric()  alegeVersiune(id)  denumeste(id, nume)  restabileste(id)  inchideIstoric()
       partajeaza(adresa, rol)  publicaWeb()  opresteWeb()  descarca(tip)  on(nume, fn)
     Evenimente (inst.istoric.on): 'mod', 'sugestie', 'editare', 'decizie', 'istoric', 'versiune', 'denumita', 'restabilita',
       'partajat', 'publicat', 'descarcat'. Orice schimbare redesenează simulatorul (colab-google emite 'schimbare').
   TIPUL pentru motor: tipuri:{colabIstoric:SimColabIstoric.colabIstoric}
     Q {sim:{…opțiunile lui colab-google + istoric:{…}}, teste:[{c, v?, d?, ce?, m?}], intrebare?:{q, o:[…], ok},
        solutie?:{text, adresa, rol, nume}, gresit?:{sari:'test' | direct:{par, text} | decizii:{sugId:'accepta'|'respinge'} |
        restabileste:'v1' | rol:'editor' | publica:true | descarca:'docx' | raspuns:indice | nume:'…'}, arata?, buton?}
     Testele (SimColabIstoric.TESTE): mod {v}, sugerat {v:{par, contine?, lipseste?, exact?}}, neatins {v:[par]}, decis {v:{sugId:'accepta'|'respinge'}},
       istoric, vazut {v:versiune}, raspuns, numita {v:'nume'}, inapoi, restabilit {v:versiune}, nerestabilit,
       partajat {v:{adresa, roluri:['cititor',…]}}, nepublicat, descarcat {v:'pdf'}, nedescarcat;
       plus orice test din SimColabGoogle.TESTE (de exemplu iesit).
   NU SCHIMBAȚI (VII/22 și lecțiile următoare se pot sprijini pe ele): numele testelor, forma lui Q, numele din interfață
   (vin din ajutorul Google; cele NESIGURE sunt în lectii/vii/m3-l20/surse.md), regula „nimic nu se salvează, nimic nu pleacă”.
   Un lucru nou = extensie nouă, cu nume nou. Clasele CSS au prefixul cgi- (motor.css are .foaie, .doc etc.).

   SCHIMBAT 24.10.2026, reparația după judecata 1 (proprietarul, VII/20; API-ul și numele testelor NESCHIMBATE, doar adaosuri):
     - `sugerat`: în paragraful ALTUIA, sugestia elevului trebuie să fie încă DESCHISĂ (dacă a apăsat el ✓ sau ✕ pe ea, testul pică și
       spune de ce: decizia e a celui care a scris textul); câmp nou opțional `exact` (textul întreg cerut al paragrafului, sau o listă) —
       orice altă schimbare în paragraful colegului (o propoziție ștearsă, un cuvânt în plus) = ✗, cu ce schimbă în plus;
     - Editare: caseta paragrafului pornește de la textul ADEVĂRAT (nu de la sugestia ta deschisă), iar o casetă neschimbată nu face nimic;
     - Vizualizare: doar citești — textul fără marcajele sugestiilor, casetele sugestiilor fără ✓ / ✕ (o notă spune unde treci);
     - mesajele după ✓ / ✕ pe propria sugestie din paragraful altuia spun ce s-a întâmplat cu textul lui.
   SCHIMBAT 24.10.2026, reparația 2 (judecata 2; API-ul și numele testelor NESCHIMBATE): mesajele spun „autorul” / „propusă de <nume>”,
     nu „el” / „lui <nume>” (acord corect și pentru nume de fată); etichetele testelor mod, decis, istoric, raspuns, nerestabilit, mai scurte. */
(function(){
'use strict';
if(!window.SimColabGoogle){console.error('colab-google-istoric.js: încarcă întâi colab-google.js');return}
const G=window.SimColabGoogle;
const CSS=`
.cgi-wrap{position:relative;flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.cgi-bar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:2px 0}
.cgi-bar .sp{flex:1}
.cgi-b{min-height:36px;min-width:36px;padding:4px 12px;border:1px solid var(--line);border-radius:18px;background:var(--paper);color:var(--ink);cursor:pointer;font:inherit;font-size:.9rem}
.cgi-b:hover{background:var(--sel)}
.cgi-b[aria-expanded="true"]{background:var(--sel);border-color:var(--accent)}
.cgi-b.mod{font-weight:700}
.cgi-b small{font-weight:400;color:var(--ink2)}
.cgi-pop{position:absolute;z-index:6;top:42px;min-width:230px;max-width:calc(100% - 8px);border:1px solid var(--line);border-radius:10px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.22);padding:6px}
.cgi-pop.st{left:0}.cgi-pop.dr{right:0}
.cgi-pop .ti{font-size:.78rem;color:var(--ink2);padding:2px 10px}
.cgi-pop button{display:flex;flex-direction:column;align-items:flex-start;gap:0;width:100%;min-height:38px;padding:5px 12px;border:0;border-radius:6px;background:transparent;color:var(--ink);cursor:pointer;text-align:left;font:inherit;font-size:.92rem}
.cgi-pop button:hover,.cgi-pop button.on{background:var(--sel)}
.cgi-pop button small{font-size:.78rem;color:var(--ink2)}
.cgi-pop button[disabled]{opacity:.55;cursor:not-allowed}
.cgi-pop hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.cgi-info{margin:0;padding:8px 10px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 6px 6px 0;font-size:.88rem}
.cgi-nota{font-size:.8rem;color:var(--ink2);margin:6px 0 0}
.cgi-pag{flex:1;max-width:620px;width:100%;margin:0 auto;background:var(--paper);border:1px solid var(--line);box-shadow:0 1px 4px rgba(0,0,0,.12);min-height:200px;padding:16px 18px;box-sizing:border-box}
.cgi-p{position:relative;margin:0 0 10px;padding:4px 6px;border-radius:6px;line-height:1.55;cursor:text;outline:none}
.cgi-p:hover{background:var(--paper2)}
.cgi-p:focus-visible{box-shadow:0 0 0 2px var(--accent)}
.cgi-p.ro{cursor:default}
.cgi-p.ro:hover{background:transparent}
[style*="--ca"]{--k:var(--ca)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) [style*="--ca"]{--k:var(--cad)}}
:root[data-theme="dark"] [style*="--ca"]{--k:var(--cad)}
.cgi-ins{color:var(--k);text-decoration:underline;text-decoration-color:var(--k);background:transparent}
.cgi-del{color:var(--k);text-decoration:line-through;text-decoration-color:var(--k);background:transparent}
.cgi-hl{background:var(--ch);box-shadow:inset 0 -2px 0 var(--k);border-radius:3px}
.cgi-hl-del{text-decoration:line-through;text-decoration-color:var(--k);background:var(--ch);border-radius:3px}
.cgi-ed{display:block;width:100%;min-height:84px;padding:6px 8px;border:2px solid var(--accent);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:1rem;line-height:1.5;box-sizing:border-box;resize:vertical}
.cgi-ed-r{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px}
.cgi-ed-r .cgi-nota{margin:0}
.cgi-card{border:1px solid var(--line);border-left:4px solid var(--k);border-radius:8px;background:var(--paper);padding:8px 10px;margin:0 0 8px;font-size:.88rem}
.cgi-card .cine{display:flex;align-items:center;gap:6px;font-weight:700}
.cgi-card .ce{margin:4px 0 6px;word-break:break-word}
.cgi-card .bt{display:flex;gap:8px}
.cgi-card .bt button{min-width:44px;min-height:40px;border:1px solid var(--line);border-radius:20px;background:var(--paper);color:var(--ink);cursor:pointer;font-size:1.05rem;font-weight:700}
.cgi-card .bt button:hover{background:var(--sel)}
.cgi-card .bt button span{font-size:.8rem;font-weight:600;margin-left:4px}
.cgi-pct{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--k);flex:none}
.cgi-ceas{display:inline-grid;place-items:center;min-width:40px;min-height:40px;border:0;border-radius:20px;background:transparent;color:var(--ink);cursor:pointer}
.cgi-ceas:hover,.cgi-ceas[aria-pressed="true"]{background:var(--sel)}
.cgi-ceas svg{width:22px;height:22px}
.cgi-ist{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}
.cgi-ist .cgi-pag{flex:1 1 300px}
.cgi-ist-sus{display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--paper)}
.cgi-ist-sus .t{flex:1;min-width:140px;font-weight:700}
.cgi-vers{flex:0 1 250px;min-width:220px;border:1px solid var(--line);border-radius:8px;background:var(--paper);padding:6px;position:relative}
.cgi-vers .t{font-weight:700;padding:2px 6px 6px}
.cgi-v{display:flex;align-items:flex-start;gap:2px;border-radius:8px}
.cgi-v.on{background:var(--sel)}
.cgi-v-b{flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:44px;padding:6px 8px;border:0;border-radius:8px;background:transparent;color:var(--ink);cursor:pointer;text-align:left;font:inherit;font-size:.88rem}
.cgi-v-b .nm{font-weight:800}
.cgi-v-b .ac{font-size:.78rem;color:var(--ink2);font-style:italic}
.cgi-v-b .au{display:flex;align-items:center;gap:5px;font-size:.84rem}
.cgi-v-m{min-width:36px;min-height:40px;border:0;border-radius:18px;background:transparent;color:var(--ink);cursor:pointer;font-size:1.1rem;font-weight:800}
.cgi-v-m:hover{background:var(--paper2)}
.cgi-v-in{width:100%;min-height:36px;padding:2px 8px;border:2px solid var(--accent);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;box-sizing:border-box}
.cgi-pan label{display:block;font-size:.85rem;margin:6px 0 2px}
.cgi-pan input[type=text],.cgi-pan select{width:100%;min-height:38px;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;box-sizing:border-box}
.cgi-pan .lst{margin:8px 0;padding:0;list-style:none;font-size:.86rem}
.cgi-pan .lst li{display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid var(--line)}
.cgi-pan .lst li span:last-child{color:var(--ink2)}
.cgi-pan .bt{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:8px}
.cgi-pan .err{color:var(--bad);font-size:.86rem;margin:4px 0 0}
.cgi-intr{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--paper2)}
.cgi-intr .q{font-weight:700;margin-bottom:6px}
.cgi-intr .o{display:flex;gap:8px;flex-wrap:wrap}
.cgi-intr .o button{min-height:40px;padding:6px 14px;border:1px solid var(--line);border-radius:20px;background:var(--paper);color:var(--ink);cursor:pointer;font:inherit}
.cgi-intr .o button[aria-pressed="true"]{border-color:var(--accent);background:var(--sel);font-weight:700}
@media (max-width:560px){
 .cg-drpt{flex-wrap:wrap;justify-content:flex-end;gap:4px}
 .cgi-pag{padding:10px}
 .cgi-ist-sus{order:-3}
 .cgi-ist>.cgi-info{order:-2}
 .cgi-vers{flex-basis:100%;min-width:0;order:-1}
 .cgi-v-b{flex-direction:row;flex-wrap:wrap;align-items:center;gap:0 8px;min-height:40px;padding:4px 8px}
 .cgi-v-b .ac{flex-basis:100%}
 .cgi-pop{left:0!important;right:auto!important;min-width:0;width:calc(100% - 8px)}
}
`;
function stil(){if(document.getElementById('cgi-stil'))return;const s=document.createElement('style');s.id='cgi-stil';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const norm=s=>G.faraDiacritice(String(s==null?'':s)).toLowerCase().replace(/\s+/g,' ').trim();
const spatii=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';
const ATINGERE=()=>('ontouchstart' in window)||(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches);
const clona=o=>JSON.parse(JSON.stringify(o));
const D=G.DOMENIU;
/* persoane INVENTATE; culorile: pe fond deschis (c) și pe fond închis (cd), contrast bun cu textul */
const AUTORI={
  ana:{nume:'Ana Pop',adresa:'ana.pop@'+D,c:'#137333',cd:'#81C995'},
  radu:{nume:'Radu Ene',adresa:'radu.ene@'+D,c:'#B3261E',cd:'#F28B82'},
  ioana:{nume:'Ioana Rusu',adresa:'ioana.rusu@'+D,c:'#7B1FA2',cd:'#D7AEFB'},
  mihai:{nume:'Mihai Stan',adresa:'mihai.stan@'+D,c:'#0B57D0',cd:'#8AB4F8'},
  maria:{nume:'Maria Lazăr',adresa:'maria.lazar@'+D,c:'#8D4E00',cd:'#FDD663'}};
const PROFESOR={nume:'Profesorul de TIC',adresa:'profesor.tic@'+D};
const MODURI=[
  {id:'editare',nume:'Editare',en:'Editing',ce:'scrii direct în document'},
  {id:'sugerare',nume:'Sugerare',en:'Suggesting',ce:'ce scrii devine sugestie'},
  {id:'vizualizare',nume:'Vizualizare',en:'Viewing',ce:'doar citești'}];
const ROLURI=[{id:'cititor',nume:'Cititor',en:'Viewer'},{id:'comentator',nume:'Comentator',en:'Commenter'},{id:'editor',nume:'Editor',en:'Editor'}];
const numeRol=id=>(ROLURI.find(r=>r.id===id)||{}).nume||id;
const CEAS='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4.5 8.5A8.5 8.5 0 1 1 3.5 12"/><path fill="currentColor" d="M2 6.2l1.2 4.6 4.4-1.6z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 7.5V12l3.2 2.2"/></svg>';

/* diferența pe cuvinte (cel mai lung șir comun): [{t:'eq'|'del'|'ins', s}] */
function diferenta(a,b){
  /* bucăți: spații, cuvinte (litere, cifre, cratimă), câte un semn de punctuație — ca „etajul.” → „etajul întâi.” să fie doar „ întâi” adăugat */
  const T=t=>String(t||'').match(/\s+|[\p{L}\p{N}-]+|[^\s\p{L}\p{N}-]/gu)||[];
  const A=T(a),B=T(b);
  const n=A.length,m=B.length,L=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
  const out=[];const pune=(t,s)=>{const u=out[out.length-1];if(u&&u.t===t)u.s+=s;else out.push({t,s})};
  let i=0,j=0;
  while(i<n&&j<m){if(A[i]===B[j]){pune('eq',A[i]);i++;j++}else if(L[i+1][j]>=L[i][j+1]){pune('del',A[i]);i++}else{pune('ins',B[j]);j++}}
  while(i<n){pune('del',A[i]);i++}while(j<m){pune('ins',B[j]);j++}
  /* spațiile singure dintre două schimbări de același fel se lipesc de ele */
  return out}
function rezumat(a,b){const d=diferenta(a,b);
  const ins=d.filter(x=>x.t==='ins').map(x=>x.s.trim()).filter(Boolean).join(' '),del=d.filter(x=>x.t==='del').map(x=>x.s.trim()).filter(Boolean).join(' ');
  if(ins&&del)return `Înlocuiește „${esc(del)}” cu „${esc(ins)}”`;if(ins)return `Adaugă: „${esc(ins)}”`;if(del)return `Șterge: „${esc(del)}”`;return 'Nicio schimbare'}
/* aceeași comparație, fără diacritice / majuscule / spații în plus (și fără spațiul dinaintea punctuației): pentru testul `sugerat`, câmpul `exact` */
const egalText=(a,b)=>{const n=s=>norm(s).replace(/\s+([.,;:!?])/g,'$1');return n(a)===n(b)};

/* ---------------- extensia ---------------- */
G.extensie('istoric',(inst,O)=>{
  stil();
  const I=O.istoric||{};
  const AU=Object.assign({},AUTORI,I.autori||{});
  const eu=I.eu||'ana',prop=I.proprietar||eu,rol=I.rol||'editor';
  const poateEdita=rol==='editor',poateSugera=rol==='editor'||rol==='comentator';
  const X={eu,rol,prop,mod:I.mod||(rol==='cititor'?'vizualizare':rol==='comentator'?'sugerare':'editare'),
    vers:clona(I.versiuni||[]).map((v,k)=>Object.assign({id:'v'+(k+1),autori:[],par:[],nume:''},v,{par:(v.par||[]).map(p=>Object.assign({de:p.autor},p))})),
    sug:clona(I.sugestii||[]).map((s,k)=>Object.assign({id:'s'+(k+1),stare:'deschisa'},s)),
    ist:{deschis:false,ales:null,vazute:[],fostDeschis:false,meniu:null,redenumeste:null,confirma:null},
    meniu:null,editez:null,info:'',decizii:{},directe:[],sugerate:[],moduri:[],numite:[],restabilite:[],
    partajari:[],acces:clona(I.acces||[]),publicatWeb:false,descarcat:null,focus:null,nr:0};
  if(!X.vers.length)X.vers.push({id:'v1',cand:'acum',autori:[eu],par:[{id:'p1',autor:eu,de:eu,text:''}],nume:''});
  const ultima=()=>X.vers[X.vers.length-1];
  X.par=clona(ultima().par);
  const asc={};
  const emite=(n,d)=>(asc[n]||[]).concat(asc['*']||[]).forEach(f=>{try{f(n,d||{})}catch(e){}});
  const cul=k=>{const a=AU[k]||{c:'#5F6368',cd:'#BDC1C6'};return `--ca:${a.c};--cad:${a.cd};--ch:${a.c}1F`};
  const nume=k=>(AU[k]||{}).nume||k;
  const cand=()=>'acum';
  const redes=focus=>{X.focus=focus||null;inst.redeseneaza()};
  inst.on('desenat',()=>{if(!X.focus)return;const f=inst.root.querySelector(X.focus);X.focus=null;if(f)try{f.focus({preventScroll:true});if(f.select&&f.classList.contains('cgi-v-in'))f.select()}catch(e){}});
  const docId=()=>{const s=inst.stare();return s.fila&&s.fila.ecran==='doc'?s.fila.doc:null};
  const sincron=()=>{const id=docId()||O.deschis;if(id)inst.modificaFisier(id,{text:X.par.map(p=>p.text).join('\n'),modificat:'acum'})};
  function versiuneNoua(autori){X.vers.push({id:'v'+(X.vers.length+1)+'n'+(++X.nr),cand:cand(),autori:autori.slice(),par:clona(X.par),nume:''})}

  /* --- acțiunile --- */
  function seteazaMod(m){if(!MODURI.some(x=>x.id===m))return false;X.meniu=null;
    if(m==='editare'&&!poateEdita){X.info=rol==='comentator'?'Ai rolul Comentator: nu poți scrie direct. Poți doar să sugerezi (Sugerare) sau să comentezi.':'Ai rolul Cititor: doar citești documentul.';redes('[data-ci="mod"]');return false}
    if(m==='sugerare'&&!poateSugera){X.info='Ai rolul Cititor: nu poți face sugestii. Doar citești documentul.';redes('[data-ci="mod"]');return false}
    X.mod=m;if(X.moduri.indexOf(m)<0)X.moduri.push(m);X.editez=null;
    X.info=m==='sugerare'?'Acum ești pe <b>Sugerare</b>: ce scrii sau ștergi devine o sugestie, colorată. Textul colegului rămâne până hotărăște autorul.':m==='editare'?'Acum ești pe <b>Editare</b>: ce scrii intră direct în document.':'Acum ești pe <b>Vizualizare</b>: doar citești; sugestiile nu se văd.';
    emite('mod',{mod:m});redes('[data-ci="mod"]');return true}
  function deschideEditare(pid){if(X.ist.deschis)return;
    if(X.mod==='vizualizare'){X.info='Ești pe <b>Vizualizare</b>: doar citești. Ca să schimbi ceva, alege sus, în dreapta, Editare sau Sugerare.';redes('[data-ci="mod"]');return}
    X.editez=pid;X.info='';redes('.cgi-ed')}
  function comite(pid,text){
    const p=X.par.find(x=>x.id===pid);X.editez=null;if(!p){redes();return false}
    const nou=spatii(text);
    const deschisaMea=X.sug.find(s=>s.par===pid&&s.de===eu&&s.stare==='deschisa');
    const baza=p.text;
    if(X.mod==='sugerare'){
      if(nou===baza){if(deschisaMea){deschisaMea.stare='retrasa'}X.info=deschisaMea?'Ți-ai retras sugestia: textul a rămas cum era.':'N-ai schimbat nimic în paragraf.';redes();return false}
      if(deschisaMea)deschisaMea.nou=nou;else X.sug.push({id:'s'+(X.sug.length+1)+'e'+(++X.nr),par:pid,de:eu,nou,stare:'deschisa'});
      if(X.sugerate.indexOf(pid)<0)X.sugerate.push(pid);
      X.info=p.autor===eu?'Sugestia ta e colorată. O poți accepta tu sau un coleg Editor.':`Sugestia ta e colorată, în paragraful scris de ${esc(nume(p.autor))}. Textul a rămas; hotărăște autorul. Pe sugestia ta nu apeși tu ✓ sau ✕: decizia e a celui care a scris textul. Ce ai șters apare tăiat.`;
      emite('sugestie',{par:pid,nou});sincron();redes();return true}
    if(X.mod==='editare'){
      if(nou===baza){redes();return false}
      p.text=nou;p.de=eu;if(p.autor!==eu&&X.directe.indexOf(pid)<0)X.directe.push(pid);
      versiuneNoua([eu]);
      X.info=p.autor!==eu?`Ai schimbat direct textul scris de ${esc(nume(p.autor))}: pe Editare, schimbarea intră pe loc, fără să întrebe pe nimeni. Ca să hotărască autorul, treci pe Sugerare.`:'Ai schimbat paragraful tău direct (Editare).';
      emite('editare',{par:pid,nou});sincron();redes();return true}
    redes();return false}
  function decide(sid,cum){const s=X.sug.find(x=>x.id===sid&&x.stare==='deschisa');if(!s)return false;
    if(!poateEdita){X.info='Doar cine are rolul Editor (sau proprietarul documentului) acceptă sau respinge sugestiile. Tu poți lăsa un comentariu.';redes();return false}
    if(X.mod==='vizualizare'){X.info='Ești pe <b>Vizualizare</b>: doar citești. Ca să hotărăști sugestiile, alege sus, în dreapta, Editare.';redes('[data-ci="mod"]');return false}
    const p=X.par.find(x=>x.id===s.par);
    /* propria sugestie, în paragraful altuia: aplicația o lasă (Editorul acceptă / respinge sugestii), dar decizia nu era a ta — spun ce s-a întâmplat */
    const aMeaLaAltul=s.de===eu&&p&&p.autor!==eu;
    if(cum==='accepta'){s.stare='acceptata';if(p){p.text=s.nou;p.de=s.de}versiuneNoua([s.de]);
      X.info=aMeaLaAltul?`Ai acceptat chiar tu sugestia ta: schimbarea a intrat în textul scris de ${esc(nume(p.autor))}, fără să hotărască autorul. Decizia era a celui care a scris textul.`:`Ai acceptat sugestia propusă de ${esc(nume(s.de))}: schimbarea a intrat în text.`}
    else{s.stare='respinsa';
      X.info=aMeaLaAltul?`Ai respins chiar tu sugestia ta: a dispărut, iar ${esc(nume(p.autor))} n-o mai poate hotărî. Decizia era a celui care a scris textul.`:`Ai respins sugestia propusă de ${esc(nume(s.de))}: textul a rămas cum era. Poți să-i lași un comentariu cu motivul.`}
    X.decizii[sid]=cum;emite('decizie',{sug:sid,decizie:cum});sincron();redes('.cgi-card .bt button');return true}
  function deschideIstoric(){X.meniu=null;X.editez=null;
    if(!poateEdita){X.info='Istoricul versiunilor îl vede doar cine are dreptul de Editor (sau proprietarul). Cu rolul tău de '+esc(numeRol(rol))+' nu se deschide.';redes('[data-ci="ceas"]');return false}
    X.ist.deschis=true;X.ist.fostDeschis=true;X.ist.ales=ultima().id;if(X.ist.vazute.indexOf(X.ist.ales)<0)X.ist.vazute.push(X.ist.ales);X.ist.meniu=null;X.ist.confirma=null;X.info='';
    emite('istoric',{deschis:true});redes('[data-v="'+X.ist.ales+'"]');return true}
  function inchideIstoric(){if(!X.ist.deschis)return false;X.ist.deschis=false;X.ist.meniu=null;X.ist.redenumeste=null;X.ist.confirma=null;X.info='Ai ieșit din istoric: ești din nou în document.';emite('istoric',{deschis:false});redes('[data-ci="ceas"]');return true}
  function alegeVersiune(id){const v=X.vers.find(x=>x.id===id);if(!v||!X.ist.deschis)return false;X.ist.ales=id;X.ist.meniu=null;X.ist.confirma=null;if(X.ist.vazute.indexOf(id)<0)X.ist.vazute.push(id);emite('versiune',{id});redes('[data-v="'+id+'"]');return true}
  function denumeste(id,n){const v=X.vers.find(x=>x.id===id);if(!v)return false;const t=spatii(n);X.ist.redenumeste=null;X.ist.meniu=null;
    if(!t){redes();return false}v.nume=t;X.numite.push({v:id,nume:t,par:JSON.stringify(v.par.map(p=>p.text))});X.info=`Versiunea are acum numele „${esc(t)}”. O găsești ușor în listă.`;emite('denumita',{id,nume:t});redes('[data-v="'+id+'"]');return true}
  function restabileste(id){const v=X.vers.find(x=>x.id===id);if(!v)return false;X.ist.confirma=null;
    X.par=clona(v.par);versiuneNoua([eu]);X.restabilite.push(id);X.ist.ales=ultima().id;if(X.ist.vazute.indexOf(X.ist.ales)<0)X.ist.vazute.push(X.ist.ales);
    X.info=`Ai restabilit versiunea din ${esc(v.cand)}. Documentul s-a schimbat pentru toți cei din echipă: așa îl văd acum și ei.`;
    emite('restabilita',{id});sincron();redes();return true}
  function partajeaza(adresa,r){const a=spatii(adresa).toLowerCase();if(!a||a.indexOf('@')<1)return false;r=ROLURI.some(x=>x.id===r)?r:'editor';
    X.partajari.push({adresa:a,rol:r});const ex=X.acces.find(x=>x.adresa===a);if(ex)ex.rol=r;else X.acces.push({adresa:a,nume:a===PROF().adresa?PROF().nume:'',rol:r});
    X.info=`Ai permis accesul pentru ${esc(a)}, cu rolul ${esc(numeRol(r))}.`+(r==='editor'?' Cu rolul Editor poate și schimba documentul.':r==='cititor'?' Poate doar să-l citească.':' Poate citi, comenta și sugera, dar nu schimbă textul.');
    emite('partajat',{adresa:a,rol:r});inst.inchidePanou();X.focus='[data-a="partajare"]';return true}
  const PROF=()=>I.profesor||PROFESOR;
  function publicaWeb(){X.publicatWeb=true;X.info='Ai apăsat <b>Publică</b>: pe un document adevărat, oricine are adresa nouă l-ar putea citi, fără cont (sau toată școala, după setările contului). În lecție NU publicăm pe web: lucrarea are numele voastre și rămâne publică până o oprește cineva. Oprești din același loc: Publică pe web, Conținut publicat și setări, Oprește publicarea.';emite('publicat',{web:true});inst.inchidePanou();return true}
  function opresteWeb(){X.publicatWeb=false;X.info='Ai oprit publicarea pe web.';emite('publicat',{web:false});inst.inchidePanou();return true}
  function descarca(tip){X.descarcat=tip;X.meniu=null;const f=inst.fisier(docId()||O.deschis)||{titlu:'documentul'};
    X.info=`Pe un calculator adevărat, „${esc(f.titlu)}.${tip==='docx'?'docx':tip==='txt'?'txt':'pdf'}” s-ar fi descărcat pe calculator, în dosarul Descărcări (Downloads). Pe calculatorul comun din laborator nu descarci: fișierul ar rămâne acolo pentru următorul elev.`;
    emite('descarcat',{tip});redes('[data-ci="fisier"]');return true}

  /* --- fereastra Permite accesul (simplă; desen) --- */
  function panouPartajare(){const f=inst.fisier(docId()||O.deschis)||{titlu:''};
    const el=document.createElement('div');el.className='cgi-pan';
    const lista=[{adresa:AU[prop]?AU[prop].adresa:'',nume:nume(prop),rol:'proprietar'}].concat(X.acces);
    el.innerHTML=`<p class="cgi-nota" style="margin-top:0">Desen simplu al ferestrei „Permite accesul” pentru „${esc(f.titlu)}”.</p>
      <label for="cgi-adr">Adaugă persoane (adresa de e-mail)</label><input type="text" id="cgi-adr" ${ATR} placeholder="nume.prenume@scoala…">
      <label for="cgi-rol">Rolul</label><select id="cgi-rol">${ROLURI.map(r=>`<option value="${r.id}"${r.id==='editor'?' selected':''}>${r.nume} (${r.en})</option>`).join('')}</select>
      <p class="err" aria-live="polite"></p>
      <div class="cgi-nota">Persoane cu acces:</div><ul class="lst">${lista.map(p=>`<li><span>${esc(p.nume||p.adresa)}</span><span>${p.rol==='proprietar'?'Proprietar':esc(numeRol(p.rol))}</span></li>`).join('')}</ul>
      <div class="cgi-nota">Acces general: <b>Restricționat</b> (doar persoanele de mai sus deschid documentul).</div>
      <div class="bt"><button type="button" class="cg-sec" data-cp="x">Anulează</button><button type="button" class="cg-prim" data-cp="trimite">Trimite</button></div>`;
    const adr=el.querySelector('#cgi-adr'),sel=el.querySelector('#cgi-rol'),err=el.querySelector('.err');
    const trimite=()=>{const a=spatii(adr.value);if(!a){err.textContent='Scrie întâi adresa de e-mail.';adr.focus();return}
      if(a.indexOf('@')<1||/\s/.test(a)){err.textContent='Adresa nu e întreagă: nume, @ și domeniul școlii, fără spații.';adr.focus();return}
      partajeaza(a,sel.value)};
    adr.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();trimite()}});
    el.querySelector('[data-cp="trimite"]').addEventListener('click',trimite);
    el.querySelector('[data-cp="x"]').addEventListener('click',()=>{inst.inchidePanou()});
    inst.arataPanou(el,'Permite accesul');setTimeout(()=>{try{adr.focus({preventScroll:true})}catch(e){}},0)}
  function panouWeb(){
    const el=document.createElement('div');el.className='cgi-pan';
    el.innerHTML=X.publicatWeb?`<p style="margin-top:0">Documentul e <b>publicat pe web</b>: oricine are adresa lui îl poate citi.</p><p class="cgi-nota">Conținut publicat și setări</p><div class="bt"><button type="button" class="cg-sec" data-cp="x">Închide</button><button type="button" class="cg-prim" data-cp="opreste">Oprește publicarea</button></div>`
      :`<p style="margin-top:0">„Publică pe web” face documentul vizibil pe internet, la o adresă nouă: pentru toți utilizatorii de pe web sau pentru toți cei din organizație (școală), după setările contului (ajutorul Google).</p>
        <p class="cgi-nota">Atenție: lucrarea are numele, clasa și școala voastre. Rămâne publică până când cineva oprește publicarea.</p>
        <div class="bt"><button type="button" class="cg-sec" data-cp="x">Închide</button><button type="button" class="cg-prim" data-cp="publica">Publică</button></div>`;
    const b=el.querySelector('[data-cp="publica"]');if(b)b.addEventListener('click',publicaWeb);
    const o=el.querySelector('[data-cp="opreste"]');if(o)o.addEventListener('click',opresteWeb);
    el.querySelector('[data-cp="x"]').addEventListener('click',()=>inst.inchidePanou());
    X.meniu=null;inst.arataPanou(el,'Publică pe web')}
  function panouNumeActual(){
    const el=document.createElement('div');el.className='cgi-pan';
    el.innerHTML=`<label for="cgi-vnume">Denumește versiunea actuală</label><input type="text" id="cgi-vnume" ${ATR} placeholder="Numele versiunii">
      <div class="bt"><button type="button" class="cg-sec" data-cp="x">Anulează</button><button type="button" class="cg-prim" data-cp="salveaza">Salvează</button></div>`;
    const inp=el.querySelector('#cgi-vnume');
    const gata=()=>{if(!spatii(inp.value)){inp.focus();return}inst.inchidePanou();denumeste(ultima().id,inp.value)};
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();gata()}});
    el.querySelector('[data-cp="salveaza"]').addEventListener('click',gata);
    el.querySelector('[data-cp="x"]').addEventListener('click',()=>inst.inchidePanou());
    X.meniu=null;inst.arataPanou(el,'Denumește versiunea actuală');setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},0)}

  /* --- desenul: documentul (paragrafele, sugestiile deschise) --- */
  function hPar(p){
    const s=X.sug.filter(x=>x.par===p.id&&x.stare==='deschisa');
    if(X.editez===p.id){
      /* pe Sugerare caseta pornește de la sugestia ta deschisă (o continui); pe Editare, de la textul ADEVĂRAT al paragrafului
         (reparația C, 24.10): o casetă lăsată neschimbată nu face nimic */
      const mea=X.mod==='sugerare'?s.find(x=>x.de===eu):null;
      return `<div class="cgi-p" data-p="${esc(p.id)}"><textarea class="cgi-ed" aria-label="Textul paragrafului (${X.mod==='sugerare'?'pe Sugerare: ce schimbi devine sugestie':'pe Editare: ce schimbi intră direct'})" ${ATR}>${esc(mea?mea.nou:p.text)}</textarea>
        <div class="cgi-ed-r"><button type="button" class="cg-prim" data-ci="gata">Gata</button><span class="cgi-nota">Enter sau „Gata” = gata. În Documentele adevărate scrii direct în pagină, fără casetă.</span></div></div>`}
    let h;
    const ro=X.mod==='vizualizare';
    /* pe Vizualizare doar citești: textul de acum, fără marcajele sugestiilor (reparația G, 24.10) */
    if(s.length&&!ro){const x=s[s.length-1];h=diferenta(p.text,x.nou).map(o=>o.t==='eq'?esc(o.s):o.t==='ins'?`<ins class="cgi-ins" style="${cul(x.de)}">${esc(o.s)}</ins>`:`<del class="cgi-del" style="${cul(x.de)}">${esc(o.s)}</del>`).join('')}
    else h=esc(p.text)||'&nbsp;';
    return `<div class="cgi-p${ro?' ro':''}" data-p="${esc(p.id)}" role="button" tabindex="0" aria-label="Paragraf: ${esc(p.text.slice(0,60))}${ro?'':' (apasă ca să-l schimbi)'}">${h}</div>`}
  function hMeniuMod(){
    return `<div class="cgi-pop dr" role="menu" aria-label="Modul de lucru">${MODURI.map(m=>{const off=(m.id==='editare'&&!poateEdita)||(m.id==='sugerare'&&!poateSugera);
      return `<button type="button" role="menuitemradio" aria-checked="${X.mod===m.id}" class="${X.mod===m.id?'on':''}" data-mod="${m.id}"${off?' aria-disabled="true"':''}><span>${X.mod===m.id?'✓ ':''}<b>${m.nume}</b> (${m.en})</span><small>${m.ce}</small></button>`}).join('')}</div>`}
  function hMeniuFisier(){
    const sub=X.meniu;
    const r=(a,t,en,extra)=>`<button type="button" data-fm="${a}">${t} <small>(${en})${extra||''}</small></button>`;
    if(sub==='f-trimite')return `<div class="cgi-pop st" role="menu" aria-label="Fișier, Trimite"><div class="ti">Fișier › Trimite (Share)</div>${r('partajare','Permite accesul altor persoane','Share with others')}${r('web','Publică pe web','Publish to web')}<hr>${r('inapoi-f','‹ Înapoi la Fișier','Back')}</div>`;
    if(sub==='f-descarca')return `<div class="cgi-pop st" role="menu" aria-label="Fișier, Descarcă"><div class="ti">Fișier › Descarcă (Download)</div>${r('d-docx','Microsoft Word (.docx)','Word')}${r('d-pdf','Document PDF (.pdf)','PDF Document')}${r('d-txt','Text simplu (.txt)','Plain text')}<hr>${r('inapoi-f','‹ Înapoi la Fișier','Back')}</div>`;
    if(sub==='f-istoric')return `<div class="cgi-pop st" role="menu" aria-label="Fișier, Istoricul versiunilor"><div class="ti">Fișier › Istoricul versiunilor (Version history)</div>${r('numeste','Denumește versiunea actuală','Name current version')}${r('vezi','Vezi istoricul versiunilor','See version history')}<hr>${r('inapoi-f','‹ Înapoi la Fișier','Back')}</div>`;
    return `<div class="cgi-pop st" role="menu" aria-label="Fișier"><div class="ti">Fișier (File) — doar ce folosim azi</div>${r('f-trimite','Trimite ›','Share')}${r('f-descarca','Descarcă ›','Download')}${r('f-istoric','Istoricul versiunilor ›','Version history')}<hr>${r('fx','Închide meniul','Close')}</div>`}
  function hCard(s){const p=X.par.find(x=>x.id===s.par);const al=s.de===eu;
    const bt=poateEdita?`<div class="bt"><button type="button" data-acc="${esc(s.id)}" aria-label="Acceptă sugestia (✓)" title="Acceptă">✓<span>Acceptă</span></button><button type="button" data-res="${esc(s.id)}" aria-label="Respinge sugestia (✕)" title="Respinge">✕<span>Respinge</span></button></div>`
      :'<p class="cgi-nota">Hotărăște un Editor (sau proprietarul documentului).</p>';
    return `<div class="cgi-card" style="${cul(s.de)}"><div class="cine"><span class="cgi-pct" aria-hidden="true"></span>${al?'Sugestia ta':esc(nume(s.de))}</div><div class="ce">${rezumat(p?p.text:'',s.nou)}</div>${bt}</div>`}

  /* --- desenul: istoricul --- */
  function hIstoric(){
    const k=X.vers.findIndex(v=>v.id===X.ist.ales),v=X.vers[k],ant=k>0?X.vers[k-1]:null,act=k===X.vers.length-1;
    const pag=v.par.map(p=>{const a=ant&&ant.par.find(x=>x.id===p.id);
      if(!a)return `<p class="cgi-p ro"><span class="cgi-hl" style="${cul(p.de||p.autor)}">${esc(p.text)}</span></p>`;
      if(a.text===p.text)return `<p class="cgi-p ro">${esc(p.text)}</p>`;
      return `<p class="cgi-p ro">${diferenta(a.text,p.text).map(o=>o.t==='eq'?esc(o.s):o.t==='ins'?`<span class="cgi-hl" style="${cul(p.de||p.autor)}">${esc(o.s)}</span>`:`<span class="cgi-hl-del" style="${cul(p.de||p.autor)}">${esc(o.s)}</span>`).join('')}</p>`}).join('')
      +(ant?ant.par.filter(a=>!v.par.some(p=>p.id===a.id)).map(a=>`<p class="cgi-p ro"><span class="cgi-hl-del" style="${cul((v.autori||[])[0])}">${esc(a.text)}</span></p>`).join(''):'');
    const titlu=v.nume?esc(v.nume):esc(v.cand);
    const sus=`<div class="cgi-ist-sus"><button type="button" class="cgi-b" data-ci="inapoi" aria-label="Înapoi (săgeata din stânga sus): ieși din istoric">← Înapoi</button><span class="t">${titlu}${act?' · versiunea actuală':''}</span>${act?'':`<button type="button" class="cg-prim" data-ci="restabileste">Restabilește această versiune</button>`}</div>`;
    const conf=X.ist.confirma?`<div class="cgi-info" role="dialog" aria-label="Restabilești versiunea?"><b>Restabilești versiunea din ${esc(v.cand)}?</b> Documentul se schimbă pentru toată echipa: toți vor vedea textul acestei versiuni. (Desen: pe ecranul adevărat cuvintele pot fi altele.)<div class="cgi-ed-r" style="margin-top:6px"><button type="button" class="cg-sec" data-ci="anuleaza-r">Anulează</button><button type="button" class="cg-prim" data-ci="restabileste-da">Restabilește</button></div></div>`:'';
    const lista=X.vers.slice().reverse().map(x=>{const on=x.id===X.ist.ales;const ult=x.id===ultima().id;
      const red=X.ist.redenumeste===x.id?`<input type="text" class="cgi-v-in" data-vin="${esc(x.id)}" aria-label="Numele versiunii (scrie și apasă Enter)" value="${esc(x.nume||x.cand)}" ${ATR}>`:'';
      return `<div class="cgi-v${on?' on':''}">${red||`<button type="button" class="cgi-v-b" data-v="${esc(x.id)}" aria-pressed="${on}">${x.nume?`<span class="nm">${esc(x.nume)}</span>`:''}<span>${esc(x.cand)}</span>${ult?'<span class="ac">Versiunea actuală</span>':''}${(x.autori||[]).map(a=>`<span class="au" style="${cul(a)}"><span class="cgi-pct" aria-hidden="true"></span>${esc(nume(a))}</span>`).join('')}</button>`}
        <button type="button" class="cgi-v-m" data-vm="${esc(x.id)}" aria-label="Mai multe (⋮) pentru versiunea din ${esc(x.cand)}" aria-expanded="${X.ist.meniu===x.id}">⋮</button></div>
        ${X.ist.meniu===x.id?`<div class="cgi-pop dr" style="position:relative;top:0" role="menu" aria-label="Mai multe"><button type="button" data-vn="${esc(x.id)}">Denumește această versiune <small>(Name this version)</small></button><button type="button" data-vc="${esc(x.id)}">Fă o copie <small>(Make a copy)</small></button><button type="button" data-vmx="1">Închide meniul</button></div>`:''}`}).join('');
    return `<div class="cgi-wrap"><div class="cgi-ist">${sus}${X.info?`<p class="cgi-info" aria-live="polite" style="width:100%">${X.info}</p>`:''}${conf}<div class="cgi-pag" aria-label="Textul versiunii alese">${pag||'<p class="cgi-p ro">(document gol)</p>'}<p class="cgi-nota">Textul colorat = ce s-a schimbat în versiunea aleasă, cu culoarea celui care a scris. Ce s-a șters apare tăiat.</p></div>
      <div class="cgi-vers"><div class="t">Istoricul versiunilor</div>${lista}<p class="cgi-nota">Apasă pe o versiune ca s-o vezi${ATINGERE()?' (textul ei e sub listă)':''}. Lângă fiecare: cine a scris, cu culoarea lui.</p></div></div></div>`}

  /* --- sloturile --- */
  inst.slot('doc-bara',()=>`<button type="button" class="cgi-ceas" data-ci="ceas" aria-label="Istoricul versiunilor (Ultima modificare): ceasul cu săgeată" title="Ultima modificare (istoricul versiunilor)" aria-pressed="${X.ist.deschis}">${CEAS}</button>`);
  inst.slot('doc-pagina',f=>{
    if(X.ist.deschis)return hIstoric();
    const m=MODURI.find(x=>x.id===X.mod);
    const bar=`<div class="cgi-bar"><button type="button" class="cgi-b" data-ci="fisier" aria-haspopup="menu" aria-expanded="${!!X.meniu&&X.meniu!=='mod'}">Fișier <small>(File)</small></button><span class="sp"></span>
      <button type="button" class="cgi-b mod" data-ci="mod" aria-haspopup="menu" aria-expanded="${X.meniu==='mod'}" aria-label="Modul de lucru: ${m.nume} (${m.en}). Apasă ca să-l schimbi">${X.mod==='vizualizare'?'':'✎ '}${m.nume} ▾</button></div>`;
    const men=X.meniu==='mod'?hMeniuMod():X.meniu?hMeniuFisier():'';
    return `<div class="cgi-wrap">${bar}${men}${X.info?`<p class="cgi-info" aria-live="polite">${X.info}</p>`:''}<div class="cgi-pag" aria-label="Pagina documentului">${X.par.map(hPar).join('')}</div>
      <p class="cgi-nota">${X.mod==='vizualizare'?'Pe Vizualizare doar citești.':ATINGERE()?'Atinge un paragraf ca să-l schimbi.':'Clic pe un paragraf ca să-l schimbi.'} Modul de lucru: sus, în dreapta (${esc(m.nume)}).</p></div>`});
  inst.slot('doc-lateral',()=>{if(X.ist.deschis)return null;const s=X.sug.filter(x=>x.stare==='deschisa');if(!s.length)return null;
    if(X.mod==='vizualizare')return `<div class="cgi-nota" style="margin:0 0 6px"><b>Sugestii</b></div><p class="cgi-nota">Pe Vizualizare (Viewing) doar citești textul de acum; sugestiile nu se văd. Ca să le hotărăști, alege sus, în dreapta, Editare.</p>`;
    return `<div class="cgi-nota" style="margin:0 0 6px"><b>Sugestii</b></div>${s.map(hCard).join('')}`});

  /* --- legăturile (după fiecare desen) --- */
  inst.on('desenat',()=>{const R=inst.root;
    const q=(s,f)=>R.querySelectorAll(s).forEach(f);
    /* un meniu deschis se închide la un clic alături sau cu Esc (ca în aplicație); clicul acela doar închide meniul */
    const w=R.querySelector('.cgi-wrap');
    if(w&&(X.meniu||X.ist.meniu)){
      w.addEventListener('click',e=>{if(e.target.closest('.cgi-pop,[data-ci="mod"],[data-ci="fisier"],[data-vm]'))return;e.stopPropagation();e.preventDefault();
        const era=X.meniu==='mod'?'[data-ci="mod"]':X.meniu?'[data-ci="fisier"]':'[data-vm="'+X.ist.meniu+'"]';X.meniu=null;X.ist.meniu=null;redes(era)},true);
      w.addEventListener('keydown',e=>{if(e.key!=='Escape')return;e.preventDefault();const era=X.meniu==='mod'?'[data-ci="mod"]':X.meniu?'[data-ci="fisier"]':'[data-vm="'+X.ist.meniu+'"]';X.meniu=null;X.ist.meniu=null;redes(era)})}
    q('[data-ci]',b=>b.addEventListener('click',e=>{const a=b.dataset.ci;
      if(a==='ceas'){X.ist.deschis?inchideIstoric():deschideIstoric()}
      else if(a==='mod'){X.meniu=X.meniu==='mod'?null:'mod';redes(X.meniu?'[data-mod="'+X.mod+'"]':'[data-ci="mod"]')}
      else if(a==='fisier'){X.meniu=X.meniu&&X.meniu!=='mod'?null:'f';redes(X.meniu?'[data-fm]':'[data-ci="fisier"]')}
      else if(a==='gata'){const t=R.querySelector('.cgi-ed');if(t)comite(t.closest('[data-p]').dataset.p,t.value)}
      else if(a==='inapoi')inchideIstoric();
      else if(a==='restabileste'){X.ist.confirma=X.ist.ales;redes('[data-ci="anuleaza-r"]')}
      else if(a==='anuleaza-r'){X.ist.confirma=null;redes('[data-ci="restabileste"]')}
      else if(a==='restabileste-da')restabileste(X.ist.ales)}));
    q('[data-mod]',b=>b.addEventListener('click',()=>seteazaMod(b.dataset.mod)));
    q('[data-fm]',b=>b.addEventListener('click',()=>{const a=b.dataset.fm;
      if(a==='f-trimite'||a==='f-descarca'||a==='f-istoric'){X.meniu=a;redes('[data-fm]')}
      else if(a==='inapoi-f'){X.meniu='f';redes('[data-fm]')}
      else if(a==='fx'){X.meniu=null;redes('[data-ci="fisier"]')}
      else if(a==='partajare'){X.meniu=null;inst.redeseneaza();if(O.partajare)O.partajare(inst,inst.fisier(docId()))}
      else if(a==='web'){panouWeb()}
      else if(a==='d-pdf')descarca('pdf');else if(a==='d-docx')descarca('docx');else if(a==='d-txt')descarca('txt');
      else if(a==='numeste'){if(!poateEdita){X.meniu=null;X.info='Doar cine are dreptul de Editor numește versiunile.';redes();return}panouNumeActual()}
      else if(a==='vezi')deschideIstoric()}));
    q('.cgi-p[data-p][role="button"]',el=>{el.addEventListener('click',()=>deschideEditare(el.dataset.p));
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();deschideEditare(el.dataset.p)}})});
    const ed=R.querySelector('.cgi-ed');
    if(ed){const pid=ed.closest('[data-p]').dataset.p;let gata=false;
      ed.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();gata=true;comite(pid,ed.value)}else if(e.key==='Escape'){e.preventDefault();gata=true;X.editez=null;redes('[data-p="'+pid+'"]')}});
      ed.addEventListener('blur',e=>{if(gata)return;const spre=e.relatedTarget;if(spre&&spre.dataset&&spre.dataset.ci==='gata')return;gata=true;setTimeout(()=>{if(X.editez===pid)comite(pid,ed.value)},0)});
      try{const n=ed.value.length;ed.setSelectionRange(n,n)}catch(e){}}
    q('[data-acc]',b=>b.addEventListener('click',()=>decide(b.dataset.acc,'accepta')));
    q('[data-res]',b=>b.addEventListener('click',()=>decide(b.dataset.res,'respinge')));
    q('[data-v]',b=>b.addEventListener('click',()=>alegeVersiune(b.dataset.v)));
    q('[data-vm]',b=>b.addEventListener('click',()=>{X.ist.meniu=X.ist.meniu===b.dataset.vm?null:b.dataset.vm;redes(X.ist.meniu?'[data-vn]':'[data-vm="'+b.dataset.vm+'"]')}));
    q('[data-vmx]',b=>b.addEventListener('click',()=>{const id=X.ist.meniu;X.ist.meniu=null;redes('[data-vm="'+id+'"]')}));
    q('[data-vn]',b=>b.addEventListener('click',()=>{X.ist.redenumeste=b.dataset.vn;X.ist.meniu=null;redes('.cgi-v-in')}));
    q('[data-vc]',b=>b.addEventListener('click',()=>{X.ist.meniu=null;X.info='„Fă o copie” nu o folosim azi.';redes()}));
    const vin=R.querySelector('.cgi-v-in');
    if(vin){const id=vin.dataset.vin;let gata=false;
      vin.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();gata=true;denumeste(id,vin.value)}else if(e.key==='Escape'){e.preventDefault();gata=true;X.ist.redenumeste=null;redes('[data-vm="'+id+'"]')}});
      vin.addEventListener('blur',()=>{if(gata)return;gata=true;setTimeout(()=>{if(X.ist.redenumeste===id){const v=X.vers.find(x=>x.id===id);if(spatii(vin.value)&&spatii(vin.value)!==(v&&(v.nume||v.cand)))denumeste(id,vin.value);else{X.ist.redenumeste=null;redes()}}},0)})}
  });
  /* partajarea: butonul „Permite accesul” al simulatorului (colab-google) deschide fereastra mea, dacă lecția nu dă alta */
  if(!O.partajare)O.partajare=()=>panouPartajare();

  inst.istoric={
    stare:()=>{const s=clona({eu:X.eu,rol:X.rol,mod:X.mod,par:X.par,sug:X.sug,vers:X.vers,ist:X.ist,decizii:X.decizii,directe:X.directe,sugerate:X.sugerate,moduri:X.moduri,
      numite:X.numite,restabilite:X.restabilite,partajari:X.partajari,publicatWeb:X.publicatWeb,descarcat:X.descarcat,info:X.info});s.ultima=ultima().id;return s},
    seteazaMod,
    sugereaza(pid,text){if(X.mod!=='sugerare'&&!seteazaMod('sugerare'))return false;return comite(pid,text)},
    editeaza(pid,text){if(X.mod!=='editare'&&!seteazaMod('editare'))return false;return comite(pid,text)},
    accepta:id=>decide(id,'accepta'),respinge:id=>decide(id,'respinge'),
    deschideIstoric,alegeVersiune,denumeste,restabileste,inchideIstoric,
    partajeaza,publicaWeb,opresteWeb,descarca,ultima:()=>ultima().id,
    profesor:()=>clona(PROF()),autori:()=>clona(AU),
    on(n,f){(asc[n]=asc[n]||[]).push(f);return ()=>{asc[n]=asc[n].filter(x=>x!==f)}}};
});

/* ---------------- verificările (pe stare) ---------------- */
const TESTE={
  mod:{ce:(Q,v)=>v==='sugerare'?'Ai trecut pe Sugerare':v==='editare'?'Ai trecut înapoi pe Editare':'Ai trecut pe '+v,
    f:(x,v)=>x.moduri.indexOf(v||'sugerare')>=0,m:(x,v)=>`Sus, în dreapta paginii, apasă butonul modului (acum: ${x.mod}) și alege ${v==='editare'?'Editare':'Sugerare'}.`},
  /* sugerat (reparația 24.10): în paragraful ALTUIA sugestia trebuie să fie încă deschisă (o hotărăște autorul), iar cu `exact`
     paragraful propus trebuie să fie exact cel cerut (nimic șters sau adăugat în afara bucății cerute) */
  sugerat:{ce:(Q,v,d)=>`Ai propus o schimbare în ${d||'paragraful cerut'}, ca sugestie`,
    f:(x,v)=>{const pid=v&&v.par,p=x.par.find(q=>q.id===pid),altuia=!!p&&p.autor!==x.eu;
      return x.sug.some(s=>s.de===x.eu&&s.par===pid&&s.stare!=='retrasa'&&(!altuia||s.stare==='deschisa')
        &&(!(v&&v.contine)||[].concat(v.contine).some(c=>norm(s.nou).indexOf(norm(c))>=0))&&(!(v&&v.lipseste)||norm(s.nou).indexOf(norm(v.lipseste))<0)
        &&(!(v&&v.exact)||[].concat(v.exact).some(e=>egalText(s.nou,e))))},
    m:(x,v,Q,inst)=>{const pid=v&&v.par,p=x.par.find(q=>q.id===pid),altuia=!!p&&p.autor!==x.eu;
      const ale=x.sug.filter(s=>s.de===x.eu&&s.par===pid&&s.stare!=='retrasa'),mea=ale.filter(s=>s.stare==='deschisa').slice(-1)[0];
      if(x.directe.indexOf(pid)>=0&&!ale.length)return 'Ai scris direct în text (Editare), deci nu e o sugestie. Apasă „Ia-o de la capăt”, treci întâi pe Sugerare, apoi scrie.';
      if(altuia&&ale.length&&!mea){const a=ale[ale.length-1],AA=(inst&&inst.istoric&&inst.istoric.autori())||AUTORI,cine=(AA[p.autor]||{}).nume||p.autor;
        return `Ai apăsat chiar tu ${a.stare==='acceptata'?'✓ (Acceptă)':'✕ (Respinge)'} pe sugestia ta: ${a.stare==='acceptata'?`schimbarea a intrat în textul scris de ${cine}, fără să hotărască autorul`:'sugestia a dispărut'}. Decizia e a celui care a scris textul. Apasă „Ia-o de la capăt” și lasă sugestia deschisă.`}
      if(!mea)return x.mod!=='sugerare'?'Treci întâi pe Sugerare (sus, în dreapta), apoi apasă pe paragraf și scrie schimbarea.':'Apasă pe paragraful cerut, scrie schimbarea și apasă Enter (sau „Gata”).';
      const faceCerut=(!(v&&v.contine)||[].concat(v.contine).some(c=>norm(mea.nou).indexOf(norm(c))>=0))&&(!(v&&v.lipseste)||norm(mea.nou).indexOf(norm(v.lipseste))<0);
      if(!faceCerut)return 'Sugestia ta nu face schimbarea cerută. Apasă din nou pe paragraf și scrie-o, apoi Enter.';
      /* comparat cu paragraful CERUT (exact): ce lipsește din el = ce șterge în plus, ce e nou față de el = ce adaugă în plus */
      const d=diferenta(v&&v.exact?[].concat(v.exact)[0]:(p?p.text:''),mea.nou),bucati=t=>d.filter(o=>o.t===t).map(o=>o.s.replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g,'')).filter(Boolean).join(' … '),scurt=s=>s.length>70?s.slice(0,70)+'…':s;
      const del=bucati('del'),ins=bucati('ins');
      return `Sugestia ta schimbă și alt text din paragraful ${altuia?'colegului':'cerut'}${del?`: șterge „${scurt(del)}”`:ins?`: adaugă „${scurt(ins)}”`:''}. Schimbă doar ce se cere; restul rămâne cum l-a scris autorul. Apasă din nou pe paragraf, repară sugestia și apasă Enter.`}},
  neatins:{ce:(Q,v,d)=>`N-ai schimbat direct textul ${d||'colegilor'}`,f:(x,v)=>!(v||[]).some(p=>x.directe.indexOf(p)>=0),
    m:()=>'Ai scris direct în textul colegului, pe Editare: schimbarea a intrat fără să hotărască autorul. Apasă „Ia-o de la capăt” și lucrează pe Sugerare.'},
  decis:{ce:(Q,v,d)=>d||'Ai hotărât fiecare sugestie: ✓ ce îmbunătățește textul, ✕ ce îl strică',
    f:(x,v)=>Object.keys(v||{}).every(k=>x.decizii[k]===v[k]),
    m:(x,v)=>{const lipsa=Object.keys(v||{}).filter(k=>!x.decizii[k]).length,gres=Object.keys(v||{}).filter(k=>x.decizii[k]&&x.decizii[k]!==v[k]).length;
      return gres?`${gres===1?'O sugestie are':gres+' sugestii au'} hotărârea greșită. Întreabă-te: face textul mai bun sau strică munca cuiva? Apasă „Ia-o de la capăt”.`:`Mai ai ${lipsa===1?'o sugestie':lipsa+' sugestii'} fără răspuns: ✓ sau ✕ în caseta din dreapta (pe telefon, sub pagină).`}},
  istoric:{ce:()=>'Ai deschis istoricul versiunilor (ceasul cu săgeată)',f:x=>x.ist.fostDeschis,m:()=>'Apasă ceasul cu săgeată de lângă butonul „Permite accesul” (sau Fișier → Istoricul versiunilor → Vezi istoricul versiunilor).'},
  vazut:{ce:(Q,v,d)=>d||'Ai ales în listă versiunea care arată schimbarea căutată',f:(x,v)=>x.ist.vazute.indexOf(v)>=0,m:()=>'În istoric, apasă pe versiuni, una câte una, și uită-te la textul colorat.'},
  raspuns:{ce:()=>'Ai ales răspunsul potrivit, sub simulator',f:(x,v,Q,inst,extra)=>!!(extra&&Q.intrebare&&extra.raspuns===Q.intrebare.ok),
    m:(x,v,Q,inst,extra)=>extra&&extra.raspuns!=null?'Răspunsul nu se potrivește cu istoricul. Uită-te din nou: textul colorat și numele cu aceeași culoare.':'Alege răspunsul de sub simulator, după ce te uiți în istoric.'},
  numita:{ce:(Q,v)=>`Versiunea de acum are numele „${v}”`,f:(x,v)=>{const cur=JSON.stringify(x.par.map(p=>p.text));return x.numite.some(n=>norm(n.nume)===norm(v)&&n.par===cur)&&x.vers.some(w=>norm(w.nume)===norm(v))},
    m:(x,v)=>x.numite.some(n=>norm(n.nume)===norm(v))?'Ai numit o versiune, dar documentul s-a schimbat după aceea (sau ai numit alta). Numește versiunea cea mai nouă, de sus.':x.numite.length?`Numele scris nu e „${v}”. Scrie-l semn cu semn.`:'În istoric: ⋮ (Mai multe) lângă versiunea de sus, apoi Denumește această versiune; scrii numele și Enter.'},
  inapoi:{ce:()=>'Ai ieșit din istoric cu Înapoi',f:x=>x.ist.fostDeschis&&!x.ist.deschis,m:x=>x.ist.deschis?'Apasă „← Înapoi”, sus în stânga istoricului.':'Întâi deschizi istoricul.'},
  restabilit:{ce:(Q,v,d)=>d||'Ai restabilit cea mai nouă versiune bună',f:(x,v)=>x.restabilite.length>0&&x.restabilite[x.restabilite.length-1]===v,
    m:(x,v)=>x.restabilite.length?'Ai restabilit altă versiune. Caut-o pe cea mai nouă care are tot ce trebuie (citește textul fiecăreia). Apasă „Ia-o de la capăt”.':'În istoric alege versiunea bună, apoi „Restabilește această versiune” și „Restabilește”.'},
  nerestabilit:{ce:()=>'N-ai restabilit nicio versiune',f:x=>!x.restabilite.length,m:()=>'Ai apăsat Restabilește: documentul s-a schimbat pentru toată echipa. Aici nu era nevoie. Apasă „Ia-o de la capăt”.'},
  partajat:{ce:(Q,v,d)=>d||`Ai permis accesul profesorului (${v&&v.adresa}) cu rolul ${(v&&v.roluri||['cititor']).map(numeRol).join(' sau ')}`,
    f:(x,v)=>{const a=(v&&v.adresa||'').toLowerCase(),R=(v&&v.roluri)||['cititor'];const ult=x.partajari.filter(p=>p.adresa===a).slice(-1)[0];return !!ult&&R.indexOf(ult.rol)>=0},
    m:(x,v)=>{const a=(v&&v.adresa||'').toLowerCase(),R=(v&&v.roluri)||['cititor'];const ult=x.partajari.filter(p=>p.adresa===a).slice(-1)[0];
      if(ult)return `Profesorul are rolul ${numeRol(ult.rol)}. Rolul cerut: ${R.map(numeRol).join(' sau ')}. Deschide din nou Permite accesul, scrie adresa și alege rolul bun.`;
      if(x.partajari.length)return 'Ai trimis altcuiva. Adresa profesorului: '+a+' (copiaz-o semn cu semn).';
      return 'Apasă „Permite accesul”, scrie adresa profesorului, alege rolul, apoi Trimite.'}},
  nepublicat:{ce:()=>'N-ai publicat documentul pe web',f:x=>!x.publicatWeb,m:()=>'Documentul e publicat pe web. Fișier → Trimite → Publică pe web → Oprește publicarea; în lecție nu-l publicăm.'},
  descarcat:{ce:(Q,v)=>`Ai descărcat documentul ca ${v==='docx'?'Word (.docx)':'PDF (.pdf)'}`,f:(x,v)=>x.descarcat===(v||'pdf'),m:(x,v)=>x.descarcat?'Ai ales alt tip de fișier. Fișier → Descarcă → Document PDF (.pdf).':'Fișier (sus, în stânga paginii) → Descarcă → Document PDF (.pdf).'},
  nedescarcat:{ce:()=>'N-ai descărcat nimic pe calculatorul comun',f:x=>!x.descarcat,m:()=>'Ai descărcat documentul: pe calculatorul comun ar rămâne în Descărcări. Apasă „Ia-o de la capăt”.'}};

/* ---------------- tipul „colabIstoric” ---------------- */
function testeDin(Q){return (Q.teste||[]).map((t,i)=>{const T=TESTE[t.c]||G.TESTE[t.c];if(!T)throw new Error('colab-google-istoric: test necunoscut '+t.c);
  return {c:t.c,v:t.v,i,ce:t.ce||T.ce(Q,t.v,t.d),mm:t.m,T,al:!!TESTE[t.c]}})}
function evalueaza(Q,inst,extra){const s=inst.stare(),x=inst.istoric.stare();
  return testeDin(Q).map(t=>{const ok=t.al?!!t.T.f(x,t.v,Q,inst,extra):!!t.T.f(s,t.v,Q,inst);return {c:t.c,ce:t.ce,ok,m:ok?'':(t.mm||(t.T.m?(t.al?t.T.m(x,t.v,Q,inst,extra):t.T.m(s,t.v,Q,inst)):''))}})}
function hTeste(lista,titlu){return `<div class="cg-teste"><div class="lbl">${titlu} · <span class="nr">0 din ${lista.length} trec</span></div><ol>${lista.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(box,rez,arata){rez.forEach((r,i)=>{const li=box.querySelector(`.cg-teste li[data-i="${i}"]`);if(!li)return;
  li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');li.querySelector('.m').textContent=!r.ok&&arata?r.m:''});
  const n=box.querySelector('.cg-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
/* soluția (și greșeala tipică) prin API, nu prin clicuri: poarta merge la fel pe telefon */
function solutie(Q,inst,extra,gr){
  const T=Q.teste||[],sari=gr&&gr.sari,S=Q.solutie||{};const H=inst.istoric;
  const are=c=>T.some(t=>t.c===c)&&c!==sari,val=c=>(T.find(t=>t.c===c)||{}).v;
  if(gr&&gr.direct){H.seteazaMod('editare');H.editeaza(gr.direct.par,gr.direct.text)}
  if(are('mod')&&val('mod')!=='editare')H.seteazaMod(val('mod')||'sugerare');
  if(are('sugerat')&&!(gr&&gr.direct)){const v=val('sugerat');H.sugereaza(v.par,S.text!=null?S.text:'(sugestie)')}
  if(are('decis')||(gr&&gr.decizii)){const v=Object.assign({},val('decis')||{},gr&&gr.decizii||{});if(H.stare().mod==='vizualizare')H.seteazaMod('editare');Object.keys(v).forEach(k=>v[k]==='accepta'?H.accepta(k):H.respinge(k))}
  if(are('mod')&&val('mod')==='editare')H.seteazaMod('editare');
  if(are('istoric')||are('vazut')||are('numita')||are('restabilit')||are('inapoi')||(gr&&gr.restabileste))H.deschideIstoric();
  if(are('vazut'))H.alegeVersiune(val('vazut'));
  if(Q.intrebare&&(are('raspuns')||(gr&&gr.raspuns!=null)))extra.raspuns=gr&&gr.raspuns!=null?gr.raspuns:Q.intrebare.ok;
  if(gr&&gr.restabileste){H.alegeVersiune(gr.restabileste);H.restabileste(gr.restabileste)}
  else if(are('restabilit')){H.alegeVersiune(val('restabilit'));H.restabileste(val('restabilit'))}
  if(are('numita')||(gr&&gr.nume))H.denumeste(H.ultima(),gr&&gr.nume||val('numita'));
  if(are('inapoi'))H.inchideIstoric();
  if(are('partajat')||(gr&&gr.rol)){const v=val('partajat')||{};H.partajeaza(v.adresa||H.profesor().adresa,gr&&gr.rol||(v.roluri||['cititor'])[0])}
  if(gr&&gr.publica)H.publicaWeb();
  if(are('descarcat')||(gr&&gr.descarca))H.descarca(gr&&gr.descarca||val('descarcat')||'pdf');
  if(are('iesit')&&inst.stare().conectat)inst.deconecteaza()}
const colabIstoric={
  render(Q,body,api){
    const lista=testeDin(Q);let extra={raspuns:null};
    const iq=Q.intrebare;
    body.innerHTML=`<div class="cg-sarcina"><div class="cg-loc"></div>${iq?`<div class="cgi-intr" role="group" aria-label="Răspunsul tău"><div class="q">${iq.q}</div><div class="o">${iq.o.map((o,i)=>`<button type="button" data-ro="${i}" aria-pressed="false">${esc(o)}</button>`).join('')}</div></div>`:''}${hTeste(lista,'Testele sarcinii')}<button type="button" class="cg-reset" data-cg="reset">Ia-o de la capăt</button></div>`;
    stil();
    const loc=body.querySelector('.cg-loc');
    let inst;
    const deseneazaRasp=()=>body.querySelectorAll('[data-ro]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.ro===extra.raspuns)));
    const upd=arata=>{const r=evalueaza(Q,inst,extra);bifeaza(body,r,arata);return r};
    const sim=()=>Object.assign({start:'doc',extensii:['istoric']},Q.sim||{},{extensii:['istoric'].concat(((Q.sim||{}).extensii||[]).filter(n=>n!=='istoric'))});
    const porneste=()=>{if(inst)inst.distruge();extra={raspuns:null};deseneazaRasp();inst=G.creeaza(loc,sim());inst.on('schimbare',()=>upd(false));upd(false)};
    porneste();
    body.querySelectorAll('[data-ro]').forEach(b=>b.addEventListener('click',()=>{extra.raspuns=+b.dataset.ro;deseneazaRasp();upd(false)}));
    body.querySelector('[data-cg="reset"]').onclick=()=>{porneste();const u=loc.querySelector('[data-ci="mod"],[data-ci="ceas"]');if(u)u.focus({preventScroll:true})};
    body._rezolva=()=>{porneste();solutie(Q,inst,extra,null);deseneazaRasp();upd(false)};
    body._gresit=()=>{porneste();solutie(Q,inst,extra,Q.gresit||{sari:(Q.teste||[]).slice(-1)[0].c});deseneazaRasp();upd(false)};
    body._inst=()=>inst;
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce). Continuă de unde ai rămas și apasă din nou.`,r.every(x=>!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(Q.arata||'am făcut pașii în simulatorul de mai sus: citește-i în ordine și uită-te la teste.')})}
      if(rau){const f=loc.querySelector('[data-ci="mod"],[data-ci="ceas"],.cgi-v-b');if(f)f.focus({preventScroll:true})}},Q.buton||'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};
window.SimColabIstoric={TESTE,colabIstoric,AUTORI,PROFESOR,MODURI,ROLURI,diferenta};
})();
