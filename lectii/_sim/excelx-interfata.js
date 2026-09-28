/* lectii/_sim/excelx-interfata.js — extensia „interfața” a foii excelx (lecția VIII / M1 / nr. 2).
   PROPRIETAR: autorul lecției VIII/2. Nu schimbă excelx.js (al lecției 5) și nici motorul (_motor/tip-excel.js).
   ÎNCĂRCARE (după excelx.js): <script src="../../_sim/excelx-interfata.js"></script>, apoi tipuri:{excelx:ExcelI}.
   Faptele de mai jos sunt probate în Excel REAL (Microsoft 365, interfața în engleză, setări regionale românești), pe un
   desktop ascuns, cu tastele trimise ca taste (lectii/viii/m1-l02/_proba/proba_ascuns*.json, capturi3.json):
   - un registru nou are o singură foaie, Sheet1; foaia are 1.048.576 de rânduri și 16.384 de coloane (ultima: XFD);
   - Enter confirmă și coboară o celulă; Tab confirmă și merge la dreapta; săgețile confirmă și mută; Esc renunță
     (celula rămâne cum era); ce scrii înlocuiește tot ce era în celulă;
   - ENTER DUPĂ TAB: după un șir de Tab-uri, Enter te duce pe rândul următor, în coloana din care ai pornit șirul
     (A5 Elev ⇥ Nota ⇥ Clasa ↵ → A6; C10 a ⇥ b ↵ → C11; și fără să scrii: A13 ⇥ ⇥ ↵ → A14). O săgeată rupe șirul
     (A17 x ⇥ y → ↵ → C18). Foaia din motor cobora simplu (C5 ↵ → C6): aici e reparat;
   - bara de stare: „Ready” când stai, „Enter” cât scrii; zoom-ul: + urcă la următorul multiplu de 10 (100→110→120→130),
     − coboară la multiplul de 10 de dedesubt (112→110→100→90).
   CE ADAUGĂ (regula fidelității, jocuri/README.md §1):
   1. FILELE FOILOR, jos: Q.foi=[{nume, cells}], Q.foaie=indicele foii deschise la început (implicit o foaie, Sheet1).
      Clic pe filă = treci pe foaia aceea (fiecare foaie își ține conținutul și celula activă). Butonul +, dublu-clicul
      și clic dreapta pe filă (în Excel: foaie nouă, redenumire, meniul foii — lecția 3) spun pe ecran că nu le folosim.
      Cu mai multe foi, Anularea (Ctrl+Z, ↶) și Refacerea (Ctrl+Y, ↷) le ține extensia, pe tot registrul: anularea unei
      scrieri de pe altă foaie te duce întâi pe foaia aceea (ca stiva unică de anulare din Excel).
   2. ZOOM-UL, în dreapta barei de stare: −, glisorul (doar arată), +, procentul; Q.zoom = zoom-ul de pornire (100).
   3. ENTER DUPĂ TAB (vezi mai sus).
   4. „UNDE E…”: ultimul loc atins din fereastră (caseta de nume, bara de formule, o filă sau un grup al panglicii, fila
      unei foi, bara de stare, zoom-ul, litera unei coloane, numărul unui rând, o celulă).
   5. VERIFICAREA (câmpuri noi în Q.verifica, pe lângă cele ale foii): unde:'caseta'|'bara'|'fila:data'|'grup:Font'|
      'foaie:Excursie'|'stare'|'zoom'|… (sau o listă de variante), foaie:'Excursie' (foaia deschisă), zoom:120,
      fila:'data' (fila panglicii deschisă), activa:'A4' (celula activă; cu pe:'Foaie' = pe foaia aceea), valori + pe,
      neatinsa:'Note' (foaia a rămas cum era), doarTaste:true (fără clic în foaie, în afară de celula activă: doar tastele).
   6. TESTELE numite ale atelierului: teste:[{ce, foaie, zoom, fila, activa, valori, pe, neatinsa}], bifate pe loc.
   7. Q.start:'D5' = celula activă de la început; pe telefon, tastele Tab, Enter, săgețile și Esc sunt butoane sub foaie.
   8. Textul care nu încape în celulă e tăiat drept, fără „…” (Excel nu pune puncte de suspensie).
   REPARAȚII DUPĂ JUDECĂTOR (28.09.2026, lectii/viii/m1-l02/_verificare/judecator.md; probate în Excel real:
   lectii/viii/m1-l02/_proba/proba_reparatii.json):
   G1 clicul pe celula ACTIVĂ nu rupe șirul Tab–Enter (A12 x ⇥ clic B12 y ↵ → A13); clicul pe ALTĂ celulă îl rupe
      (A15 x ⇥ clic D15 y ↵ → D16); drumul de pe telefon (clic pe celulă, clic în bară, scrii, ⇥, clic pe celula activă,
      clic în bară, scrii, ↵) → rândul următor, coloana de pornire (A8 → A9);
   G2 pe telefon, butoanele de sub foaie merg în caseta de nume când ea are focusul (Enter = sari la adresă);
   M1 zoom-ul e al fiecărei foi (Excursie 120 %, Note 100 %, înapoi Excursie 120 %); verificarea `zoom` citește foaia
      din `pe`;
   M2 valorile le verifică extensia în toate exercițiile, cu mesajul ei („În A2 trebuie scris „Ana”, iar acum e „9”.”),
      nu cu al foii din motor (care vorbea de TEXT și zecimale, lecția 5);
   m1 clicul pe fila altei foi în timp ce scrii confirmă ce ai scris, fără mutare, și trece pe foaie (probat: E3 „Test”
      rămâne, Orar deschisă, Ready);
   m5 nota de telefon spune că, scriind în bara de formule, bara de stare arată Editare (Edit);
   m6 pe ecranele cu atingere: filele panglicii, ↶ ↷, celulele și antetele au cel puțin 32 px;
   m10 mesajele casetei de nume nu mai vorbesc de zone (lecția 4); un cuvânt scris în casetă devine în Excel un NUME
      pentru celula activă, fără niciun mesaj (probat: aici → =Excursie!$D$4, D4 goală).
   REPARAȚII DUPĂ JUDECATA 2 (28.09.2026, _verificare/judecator2.md):
   G-n1 cu `start` (celula activă de la început), foaia primește tastatura după desen (și după ce motorul termină de
      așezat pagina): elevul scrie direct, fără clic, ca în Excel;
   n1 ↶ apăsat CÂT SCRII nu mai atinge celula scrisă înainte: renunță la ce scrii, ca Esc. Probat în Excel real
      (lectii/viii/m1-l02/_proba/proba_undo_scriere.json): clic pe ↶ cât scrii „abc” în F6 → F5 „Elev” rămâne, textul
      din F6 dispare (Excel rămâne în modul Enter, cu celula goală; foaia de aici iese din scriere, ca după Esc).
   Compatibil cu Enter-după-Tab din motor (tip-excel.js, 28.09): motorul rupe șirul la orice clic pe celulă, extensia
      nu îl rupe la clicul pe celula activă și mută celula o singură dată (doar dacă motorul a coborât simplu).
   Global: window.ExcelI. */
(function(){
'use strict';
const X=window.ExcelX;
if(!X){window.ExcelI=null;return}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a||'').toUpperCase().match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const clona=o=>JSON.parse(JSON.stringify(o||{}));
const numarRo=v=>typeof v==='number'?String(v).replace('.',','):String(v);
const FILE={file:'File',home:'Pornire (Home)',insert:'Inserare (Insert)',pagelayout:'Aspect pagină (Page Layout)',formulas:'Formule (Formulas)',data:'Date (Data)',review:'Revizuire (Review)',view:'Vizualizare (View)'};
const CTX=new WeakMap();let ULTIM=null;
const CSS=`.xi-foi{display:flex;align-items:stretch;gap:2px;flex-wrap:nowrap;overflow-x:auto;padding:3px 6px 0;border:1px solid var(--line);border-top:0;background:var(--paper2);font-family:"Segoe UI",system-ui,sans-serif;font-size:.86rem}
.xi-foi .xi-sag{align-self:center;color:var(--ink2);padding:0 8px 0 2px;letter-spacing:6px;user-select:none}
.xi-foi button{border:0;background:transparent;color:var(--ink);font:inherit;padding:6px 14px 7px;min-height:32px;cursor:pointer;border-radius:0 0 6px 6px;flex:none;white-space:nowrap}
@media (max-width:480px){.xi-foi button{padding:6px 9px 7px}.xi-foi .xi-sag{padding:0 4px 0 0;letter-spacing:3px}}
.xi-foi button[data-xi-i].on{background:var(--paper);font-weight:700;color:#107C41;box-shadow:inset 0 -3px 0 #107C41}
.xi-foi button[data-xi-i]:not(.on):hover{background:var(--paper)}
.xi-foi .xi-plus{font-size:1.1rem;padding:2px 12px;color:var(--ink2)}
.xl .st{align-items:center}
.xi-zoom{display:inline-flex;align-items:center;gap:4px;margin-left:auto;white-space:nowrap}
.xi-zoom button{border:0;background:transparent;color:var(--ink);font:inherit;min-width:32px;min-height:32px;cursor:pointer;padding:0 4px;border-radius:4px}
.xi-zoom button:hover{background:var(--paper)}
.xi-zoom .xi-glis{position:relative;display:inline-block;width:84px;height:18px;cursor:default}
.xi-zoom .xi-glis::before{content:"";position:absolute;left:0;right:0;top:8px;height:2px;background:var(--ink2);opacity:.6}
.xi-zoom .xi-glis::after{content:"";position:absolute;left:50%;top:4px;width:1px;height:10px;background:var(--ink2);opacity:.6}
.xi-zoom .xi-cursor{position:absolute;top:1px;width:5px;height:16px;margin-left:-2px;background:var(--ink);border-radius:1px}
.xi-zoom .xi-proc{min-width:52px;text-align:right}
.xi-nota{margin:6px 0 0;padding:6px 10px;font-size:.88rem;border-radius:6px;background:var(--sel);color:var(--ink)}
.xi-nota:empty{display:none}
.xi-taste{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}
.xi-taste button{min-width:44px;min-height:40px;padding:4px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-weight:600}
.xi-taste .xi-lbl{align-self:center;font-size:.85rem;color:var(--ink2);margin-right:2px}
.xi-corp .xl td{text-overflow:clip}
@media (pointer:coarse){.xi-corp .xl .rb .tabs button{min-height:32px!important}.xi-corp .xl .qat button{min-width:32px!important;min-height:32px!important}
.xi-corp .xl .gw td,.xi-corp .xl .gw tbody th{height:32px!important;box-sizing:border-box}.xi-corp .xl .gw thead th{height:32px!important}}`;
function css(){if(!document.getElementById('xi-css')){const s=document.createElement('style');s.id='xi-css';s.textContent=CSS;document.head.appendChild(s)}}
const eAtingere=()=>{try{return matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0}catch(e){return false}};

/* ---------- starea ---------- */
const xl=ctx=>ctx.w&&ctx.w.querySelector('.xl');
const eGata=ctx=>{const s=ctx.w&&ctx.w.querySelector('.st span');return !s||/^Gata/.test(s.textContent)};
const eEditare=ctx=>{const s=ctx.w&&ctx.w.querySelector('.st span');return !!s&&/^Editare/.test(s.textContent)};
const activaDOM=ctx=>{const t=ctx.w&&ctx.w.querySelector('.gw td.act');return t?t.dataset.a:null};
const filaActiva=ctx=>{const b=ctx.w&&ctx.w.querySelector('.rb [data-tab].on');return b?b.dataset.tab:(ctx.w&&ctx.w.querySelector('.rb [data-tab]')?'home':null)};
const snap=ctx=>JSON.stringify({R:ctx.S.RAW,F:ctx.S.FMT});
const rawPe=(ctx,k)=>k===ctx.k?ctx.S.RAW:ctx.foi[k].RAW;
const activaPe=(ctx,k)=>k===ctx.k?activaDOM(ctx):ctx.foi[k].act;
const zoomPe=(ctx,k)=>k===ctx.k?ctx.zoom:ctx.foi[k].zoom;
const idxFoaie=(ctx,n)=>{if(n==null)return ctx.k;const i=ctx.foi.findIndex(f=>f.nume.toLowerCase()===String(n).toLowerCase());return i<0?ctx.k:i};
const celuleRaw=c=>{const o={};Object.entries(c||{}).forEach(([a,v])=>{if(v!==''&&v!=null)o[a]=numarRo(v)});return o};
function nota(ctx,html){const n=ctx.nota;if(n)n.innerHTML=html||''}
function eqVal(raw,v){if(raw==null||raw==='')return v===''||v==null;
  if(typeof v==='number'){const x=Number(String(raw).trim().replace(/^'/,'').replace(',','.'));return isFinite(x)&&Math.abs(x-v)<1e-9}
  return String(raw).trim().toLowerCase()===String(v).trim().toLowerCase()}

/* ---------- foile ---------- */
function comuta(ctx,i,forta){
  if(i===ctx.k||i<0||i>=ctx.foi.length)return true;
  if(!eGata(ctx)){   // Excel: clicul pe fila altei foi confirmă ce scrii, fără mutare, și trece pe foaie (probat); Ctrl+Enter = confirmă pe loc
    const fx=ctx.w.querySelector('#xfx');if(fx)fx.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',ctrlKey:true,bubbles:true,cancelable:true}));
    if(!eGata(ctx))return false;
    const s0=snap(ctx);if(ctx.multe&&ctx.ultim!=null&&s0!==ctx.ultim){ctx.jurnal.push({k:ctx.k,s:ctx.ultim});ctx.refa.length=0}ctx.ultim=s0}   // scrierea confirmată intră în anulare, pe foaia ei
  const S=ctx.S,cur=ctx.foi[ctx.k];cur.RAW=clona(S.RAW);cur.FMT=clona(S.FMT);cur.act=activaDOM(ctx)||cur.act||'A1';cur.zoom=ctx.zoom;
  const nou=ctx.foi[i];Object.keys(S.RAW).forEach(a=>delete S.RAW[a]);Object.assign(S.RAW,clona(nou.RAW));
  Object.keys(S.FMT).forEach(a=>delete S.FMT[a]);Object.assign(S.FMT,clona(nou.FMT));
  ctx.k=i;ctx.zoom=nou.zoom||100;ctx.tabStart=null;ctx.ignora=true;S.setAct(nou.act||'A1');S.draw();nota(ctx,'');return true}
/* anularea pe tot registrul (doar cu mai multe foi): jurnalul ține {foaia, starea ei dinainte} */
function anuleaza(ctx,refa){
  const din=refa?ctx.refa:ctx.jurnal,spre=refa?ctx.jurnal:ctx.refa;const e=din.pop();if(!e)return;
  if(e.k!==ctx.k)comuta(ctx,e.k,true);
  spre.push({k:e.k,s:snap(ctx)});const o=JSON.parse(e.s),S=ctx.S;
  Object.keys(S.RAW).forEach(a=>delete S.RAW[a]);Object.assign(S.RAW,o.R);Object.keys(S.FMT).forEach(a=>delete S.FMT[a]);Object.assign(S.FMT,o.F);
  ctx.ignora=true;S.draw();const g=ctx.w.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(x){}}

/* ---------- zoom ---------- */
const pasSus=z=>Math.min(400,Math.floor(z/10)*10+10),pasJos=z=>Math.max(10,Math.ceil(z/10)*10-10);
const cursorPoz=z=>z<=100?(z-10)/90*50:50+(z-100)/300*50;
function zoomHtml(z){return `<span class="xi-zoom" role="group" aria-label="Zoom"><button type="button" data-xi-z="-" aria-label="Micșorează (Zoom Out)" title="Zoom Out">−</button><span class="xi-glis" data-xi-z="glis" aria-hidden="true"><span class="xi-cursor" style="left:${cursorPoz(z).toFixed(1)}%"></span></span><button type="button" data-xi-z="+" aria-label="Mărește (Zoom In)" title="Zoom In">+</button><button type="button" class="xi-proc" data-xi-z="%" aria-label="Zoom ${z} %">${z} %</button></span>`}
function aplicaZoom(ctx){const t=ctx.w&&ctx.w.querySelector('.gw table');if(t)t.style.zoom=String(ctx.zoom/100)}

/* ---------- după fiecare desen al foii: jurnalul, filele foilor, zoom-ul, butoanele ↶ ↷ ---------- */
function dupaDesen(ctx){
  if(!ctx.w||!ctx.w.isConnected||!ctx.S)return;
  const s=snap(ctx);
  if(ctx.ignora){ctx.ignora=false}
  else if(ctx.multe&&ctx.ultim!=null&&s!==ctx.ultim){ctx.jurnal.push({k:ctx.k,s:ctx.ultim});if(ctx.jurnal.length>100)ctx.jurnal.shift();ctx.refa.length=0}
  ctx.ultim=s;
  const x=xl(ctx);if(!x)return;
  const gw=x.querySelector('.gw'),st=x.querySelector('.st');
  if(gw&&!x.querySelector('.xi-foi'))gw.insertAdjacentHTML('afterend',`<div class="xi-foi" role="tablist" aria-label="Filele foilor (sheet tabs)"><span class="xi-sag" aria-hidden="true">‹›</span>${ctx.foi.map((f,i)=>`<button type="button" role="tab" aria-selected="${i===ctx.k}" class="${i===ctx.k?'on':''}" data-xi-foaie="${esc(f.nume)}" data-xi-i="${i}">${esc(f.nume)}</button>`).join('')}<button type="button" class="xi-plus" data-xi-plus="1" aria-label="Butonul + (foaie nouă)" title="New sheet">+</button></div>`);
  if(st&&!st.querySelector('.xi-zoom'))st.insertAdjacentHTML('beforeend',zoomHtml(ctx.zoom));
  aplicaZoom(ctx);
  if(ctx.multe){const u=x.querySelector('[data-ud="undo"]'),r=x.querySelector('[data-ud="redo"]');if(u)u.disabled=!ctx.jurnal.length;if(r)r.disabled=!ctx.refa.length}
  if(ctx.teste)ctx.teste()}

/* ---------- ce loc din fereastră a fost atins ---------- */
function locDin(t){
  if(!t||!t.closest)return null;
  if(t.closest('.xi-zoom'))return 'zoom';
  const f=t.closest('[data-xi-foaie]');if(f)return 'foaie:'+f.dataset.xiFoaie;
  if(t.closest('.xi-foi'))return 'foi';
  if(t.closest('.nb')||t.closest('.xp-nb-in'))return 'caseta';
  if(t.closest('#xfx'))return 'bara';
  if(t.closest('.fxl'))return 'fx';
  const tb=t.closest('.rb [data-tab]');if(tb)return 'fila:'+tb.dataset.tab;
  if(t.closest('.pg-fisier'))return 'fila:file';
  if(t.closest('.qat'))return 'qat';
  const gr=t.closest('.pg-grup');if(gr)return 'grup:'+gr.getAttribute('aria-label');
  if(t.closest('.rb'))return 'panglica';
  const th=t.closest('.gw th');if(th){if(th.closest('thead')){const v=th.textContent.trim();return v?'coloana:'+v:'colt'}return 'rand:'+th.textContent.trim()}
  const td=t.closest('.gw td[data-a]');if(td)return 'celula:'+td.dataset.a;
  if(t.closest('.st'))return 'stare';
  return null}
function descrie(loc){if(!loc)return 'nimic încă';const i=loc.indexOf(':'),k=i<0?loc:loc.slice(0,i),v=i<0?'':loc.slice(i+1);
  return {caseta:'caseta de nume (Name Box)',bara:'bara de formule (Formula Bar)',fx:'semnul fx (el deschide altceva în Excel)',stare:'bara de stare',zoom:'zoom-ul',foi:'rândul cu filele foilor',
    panglica:'panglica',qat:'butoanele ↶ ↷ de deasupra',colt:'colțul dintre litere și numere',
    fila:`fila ${FILE[v]||v} a panglicii`,grup:`grupul ${v} al panglicii`,foaie:`fila foii ${v}`,coloana:`litera coloanei ${v}`,rand:`numărul rândului ${v}`,celula:`celula ${v}`}[k]||loc}
const potriveste=(loc,exp)=>[].concat(exp).some(e=>e===loc||(e.endsWith(':*')&&loc&&loc.startsWith(e.slice(0,-1))));

/* ---------- verificarea ---------- */
function probleme(ctx,V,toate){const out=[];if(!V)return out;
  const numeK=k=>ctx.foi[k].nume,multe=ctx.foi.length>1;
  if(V.unde&&!potriveste(ctx.loc,V.unde))out.push(ctx.loc?`Ai atins ${descrie(ctx.loc)}. Caută ${descrie([].concat(V.unde)[0].replace(/:\*$/,''))}.`:`Nu ai atins încă nimic din fereastră. Fă clic (sau atinge) pe ${descrie([].concat(V.unde)[0].replace(/:\*$/,''))}, apoi apasă Verifică.`);
  if(V.foaie&&numeK(ctx.k).toLowerCase()!==V.foaie.toLowerCase())out.push(`Acum ești pe foaia ${esc(numeK(ctx.k))}. Treci pe foaia ${esc(V.foaie)}: clic pe fila ei, jos, sub celule.`);
  if(V.fila&&filaActiva(ctx)!==V.fila)out.push(`Acum e deschisă fila ${FILE[filaActiva(ctx)]||'—'}. Deschide fila ${FILE[V.fila]}: clic pe numele ei, sus.`);
  const kv=idxFoaie(ctx,V.pe),R=rawPe(ctx,kv),pe=multe&&V.pe?` pe foaia ${esc(numeK(kv))}`:'';
  if(V.zoom!=null){const z=zoomPe(ctx,kv);if(z!==V.zoom)out.push(`Zoom-ul${pe} e acum ${z} %. Trebuie ${V.zoom} %: fiecare clic pe + urcă 10 %, fiecare clic pe − coboară 10 %.`+(()=>{const j=ctx.foi.findIndex((f,i)=>i!==kv&&zoomPe(ctx,i)===V.zoom);return pe&&j>=0?` Ai schimbat zoom-ul foii ${esc(numeK(j))}: fiecare foaie își ține zoom-ul ei.`:''})())}
  {for(const [a,v] of Object.entries(V.valori||{})){if(!eqVal(R[a],v)){
      const aici=kv!==ctx.k&&eqVal(ctx.S.RAW[a],v)?` Ai scris pe foaia ${esc(numeK(ctx.k))}; trece pe foaia ${esc(numeK(kv))} și scrie acolo.`:'';
      out.push(`${pe?pe[1].toUpperCase()+pe.slice(2)+', în':'În'} ${a} trebuie scris „${esc(numarRo(v))}”${R[a]?`, iar acum e „${esc(R[a])}”`:''}.${aici}`);break}}}
  if(V.neatinsa){const k=idxFoaie(ctx,V.neatinsa),R0=celuleRaw(ctx.Q.foi?ctx.Q.foi[k].cells:ctx.Q.cells),R1=rawPe(ctx,k);
    const dif=[...new Set([...Object.keys(R0),...Object.keys(R1)])].filter(a=>(R0[a]??'')!==(R1[a]??''));
    if(dif.length)out.push(`Pe foaia ${esc(numeK(k))} s-a schimbat ${dif.slice(0,3).join(', ')}: acolo nu trebuia scris nimic. Anulează cu butonul ↶ de sus, din stânga panglicii (ca în Word), până revine cum era, apoi scrie pe foaia cerută.`)}
  if(V.activa){const a=activaPe(ctx,kv);if(a!==V.activa)out.push(V.mesajActiva?V.mesajActiva.replace('{a}',a||'—'):`Celula activă${pe} e acum ${a||'—'}. Trebuie să fie ${V.activa}.`)}
  if(V.doarTaste&&ctx.clicInFoaie)out.push('De data asta, fără clic în foaie: te miști doar cu tastele (pe telefon, cu butoanele de sub foaie). Apasă „Arată-mi” sau reia exercițiul.');
  return out}
function solutie(ctx,V){if(!V)return '';const s=[];
  if(V.unde)s.push(`atingi ${descrie([].concat(V.unde)[0].replace(/:\*$/,''))}`);
  if(V.fila)s.push(`deschizi fila ${FILE[V.fila]}`);
  if(V.foaie)s.push(`treci pe foaia ${esc(V.foaie)} (clic pe fila ei, jos)`);
  const vs=Object.entries(V.valori||{});if(vs.length)s.push(`scrii ${vs.map(([a,v])=>`${esc(numarRo(v))} în ${a}`).join(', ')}`);
  if(V.activa)s.push(`la final celula activă e ${V.activa}`);
  if(V.zoom!=null)s.push(`duci zoom-ul${V.pe&&ctx.foi.length>1?' foii '+esc(V.pe):''} la ${V.zoom} % cu + și −`);
  return s.length?s.join('; ')+'.':''}

/* ---------- ascultătorii (o dată pe corp) ---------- */
function leaga(body){if(body._xi)return;body._xi=1;
  const ctxDe=()=>{const c=CTX.get(body);return c&&c.w&&c.w.isConnected?c:null};
  body.addEventListener('pointerdown',ev=>{const ctx=ctxDe();if(!ctx||!ctx.w.contains(ev.target))return;
    const l=locDin(ev.target);if(l){ctx.loc=l;if(l.startsWith('celula:')||l.startsWith('rand:')||l.startsWith('coloana:')||l==='colt'){
      if(l!=='celula:'+activaDOM(ctx)){ctx.tabStart=null;if(!ev._xp)ctx.clicInFoaie=true}}}},true);   // clicul pe celula ACTIVĂ nu rupe șirul Tab–Enter (probat în Excel) și nu contează la „fără clic”
  body.addEventListener('click',ev=>{const ctx=ctxDe();if(!ctx||!ctx.w.contains(ev.target))return;const t=ev.target;
    const f=t.closest&&t.closest('[data-xi-i]');if(f){ev.preventDefault();comuta(ctx,Number(f.dataset.xiI));return}
    if(t.closest&&t.closest('[data-xi-plus]')){nota(ctx,'Butonul + adaugă în Excel o foaie nouă. Cum lucrezi cu foile (foaie nouă, alt nume, altă ordine) înveți în lecția 3; aici folosești foile care sunt deja.');return}
    const z=t.closest&&t.closest('[data-xi-z]');if(z){const k=z.dataset.xiZ;
      if(k==='+'||k==='-'){ctx.zoom=k==='+'?pasSus(ctx.zoom):pasJos(ctx.zoom);const p=ctx.w.querySelector('.xi-zoom');if(p)p.outerHTML=zoomHtml(ctx.zoom);aplicaZoom(ctx);nota(ctx,'');if(ctx.teste)ctx.teste()}
      else if(k==='%')nota(ctx,'Clic pe procent deschide în Excel fereastra Zoom. Aici folosești butoanele − și +.');
      else nota(ctx,'În Excel poți trage și de glisor. Aici folosești butoanele − și + de lângă el.');return}
    if(t.closest&&t.closest('.pg-fisier'))nota(ctx,'Fila File deschide în Excel un ecran separat, cu fișierul întreg. Îl folosești în lecția 3.');
    {const u=t.closest&&t.closest('[data-ud]');
      if(u&&!eGata(ctx)){ev.preventDefault();ev.stopPropagation();   // n1: ↶ cât scrii = renunți la ce scrii (ca Esc); celula de dinainte rămâne
        const fx=ctx.w.querySelector('#xfx');if(fx)fx.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));return}
      if(u&&ctx.multe){ev.preventDefault();ev.stopPropagation();anuleaza(ctx,u.dataset.ud==='redo')}}
    if(t.closest&&t.closest('.rb [data-tab]'))setTimeout(()=>{if(ctx.teste)ctx.teste()},0)},true);
  body.addEventListener('dblclick',ev=>{const ctx=ctxDe();if(!ctx)return;if(ev.target.closest&&ev.target.closest('[data-xi-i]'))nota(ctx,'Dublu-clic pe fila foii îi schimbă în Excel numele. Asta înveți în lecția 3.')},true);
  body.addEventListener('contextmenu',ev=>{const ctx=ctxDe();if(!ctx)return;if(ev.target.closest&&ev.target.closest('.xi-foi')){ev.preventDefault();nota(ctx,'În Excel, aici se deschide meniul foii. Îl folosești în lecția 3.')}},true);
  body.addEventListener('keydown',ev=>{const ctx=ctxDe();if(!ctx)return;const t=ev.target;if(!t||!t.closest||!ctx.w.contains(t))return;
    const k=ev.key,ctrl=ev.ctrlKey||ev.metaKey,fx=ctx.w.querySelector('#xfx'),inFoaie=!!t.closest('.gw')||t===fx;
    if(ctx.multe&&ctrl&&!ev.altKey&&(k==='z'||k==='Z'||k==='y'||k==='Y')&&t.closest('.gw')&&eGata(ctx)){ev.preventDefault();ev.stopPropagation();anuleaza(ctx,k.toLowerCase()==='y');return}
    if(!inFoaie)return;
    if(k==='Tab'&&!ctrl&&!ev.altKey){
      if(ev.shiftKey){ctx.tabStart=null;return}
      if(t===fx&&ctx.w.querySelector('.fx .pop [data-fn]'))return;   // lista de funcții: Tab o completează (lecțiile următoare)
      if(ctx.tabStart==null){const a=activaDOM(ctx),p=pos(a);if(p)ctx.tabStart=p.c}return}
    if(k==='Enter'&&!ev.shiftKey&&!ctrl&&!ev.altKey){
      const c0=ctx.tabStart;ctx.tabStart=null;if(c0==null)return;const a0=activaDOM(ctx);
      setTimeout(()=>{const a1=activaDOM(ctx),p0=pos(a0),p1=pos(a1);
        if(p0&&p1&&p1.r===p0.r+1&&p1.c===p0.c&&p0.c!==c0){ctx.S.setAct(adr(c0,p1.r));ctx.S.draw();const g=ctx.w.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(x){}}},0);
      return}
    if(/^(Arrow|Home$|End$|Page)/.test(k)&&!eEditare(ctx))ctx.tabStart=null},true)}

/* ---------- tastele de pe ecran (telefon) ---------- */
function tasteEcran(ctx){if(!eAtingere())return;
  const d=document.createElement('div');d.className='xi-taste';d.setAttribute('role','group');d.setAttribute('aria-label','Tastele de pe ecran');
  const T=[['Tab','Tab ⇥'],['Enter','Enter ↵'],['ArrowLeft','←'],['ArrowUp','↑'],['ArrowDown','↓'],['ArrowRight','→'],['Escape','Esc']];
  d.innerHTML='<span class="xi-lbl">Tastele:</span>'+T.map(([k,e])=>`<button type="button" data-xi-k="${k}" aria-label="${k==='Escape'?'Esc':k.replace('Arrow','Săgeata ')}">${e}</button>`).join('');
  ctx.w.after(d);
  d.querySelectorAll('button').forEach(b=>{b.addEventListener('pointerdown',ev=>ev.preventDefault());   // tastatura telefonului rămâne deschisă
    b.addEventListener('click',()=>{const fx=ctx.w.querySelector('#xfx'),g=ctx.w.querySelector('#xgw'),nb=ctx.w.querySelector('.xp-nb-in');
      const tinta=nb&&document.activeElement===nb?nb:(document.activeElement===fx||!eGata(ctx))?fx:g;if(!tinta)return;if(tinta===g)try{g.focus({preventScroll:true})}catch(x){}   // caseta de nume primește ea tasta (Enter = sari la adresă)
      tinta.dispatchEvent(new KeyboardEvent('keydown',{key:b.dataset.xiK,bubbles:true,cancelable:true}))})});
  return d}

/* ---------- m10: caseta de nume, fără zone (lecția 4) ---------- */
function casetaFaraZone(ctx){const b=ctx.body;
  b.querySelectorAll('.xp-nb-in').forEach(i=>{if(/B2:C4/.test(i.getAttribute('aria-label')||''))i.setAttribute('aria-label','Caseta de nume: scrie o adresă, de exemplu B2, și apasă Enter')});
  b.querySelectorAll('.xp-nota').forEach(n=>{const h=n.innerHTML;if(!/B2:C4/.test(h))return;
    n.innerHTML=/NUME/.test(h)?'În Excel, un cuvânt scris în caseta de nume nu te duce la o celulă: devine, fără niciun mesaj, un nume pentru celula activă, iar celula rămâne goală. Ca să sari la o celulă, scrie în casetă adresa ei: întâi litera coloanei, apoi numărul rândului, de exemplu <b>B2</b>. Ca să scrii în celula activă, nu face clic în casetă: scrie direct.'
      :'Excel nu primește asta: scrie întâi litera coloanei, apoi numărul rândului, de exemplu <b>B2</b>.'})}

/* ---------- testele numite ---------- */
function teste(ctx,Q){const box=document.createElement('div');box.className='xp-teste';box.setAttribute('aria-live','polite');ctx.body.insertBefore(box,ctx.w);
  const ok=T=>probleme(ctx,T,true).length===0;
  ctx.teste=()=>{const rez=Q.teste.map(T=>({ce:T.ce,ok:ok(T)})),n=rez.filter(x=>x.ok).length;
    box.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xp-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`};
  new MutationObserver(()=>ctx.teste()).observe(ctx.w,{childList:true,subtree:true,characterData:true});ctx.teste()}

/* ---------- render / rezolva / gresit ---------- */
const MELE=['unde','foaie','fila','zoom','activa','pe','neatinsa','doarTaste','mesajActiva'];
function bazaV(Q,multe){const V=Object.assign({},Q.verifica||{});MELE.forEach(k=>delete V[k]);delete V.valori;if(multe)delete V.gol;return V}   // valorile: extensia (M2)
function render(Q,body,api){css();
  const foi=(Q.foi&&Q.foi.length?Q.foi:[{nume:Q.numeFoaie||'Sheet1',cells:Q.cells||{}}]),k0=Math.min(Q.foaie||0,foi.length-1),multe=foi.length>1;
  const Q2=Object.assign({},Q,{cells:foi[k0].cells||{},verifica:bazaV(Q,multe)});delete Q2.teste;
  const ctx={Q,Q2,body,foi:foi.map((f,i)=>({nume:f.nume,RAW:celuleRaw(f.cells),FMT:{},act:'A1',zoom:i===k0?(Q.zoom||100):100})),k:k0,multe,zoom:Q.zoom||100,jurnal:[],refa:[],loc:null,tabStart:null,clicInFoaie:false,ultim:null,ignora:false};
  const V=Q.verifica||{},areMele=MELE.some(k=>k in V)||multe||!!V.valori;
  const laFoaie=()=>{const g=ctx.w&&ctx.w.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(e){}};
  const apiW=Object.assign({},api,{
    resolve:(ok,msg)=>{if(ok&&!Q.o&&areMele){const p=probleme(ctx,V);if(p.length){api.resolve(false,p.slice(0,2).join(' '));api.revealButton(()=>api.giveUp(solutie(ctx,V)));laFoaie();return}}
      api.resolve(ok,msg)},
    giveUp:html=>api.giveUp([html&&html!=='.'?html:'',areMele?solutie(ctx,V):''].filter(Boolean).join(' '))});
  X.render(Q2,body,apiW);
  ctx.S=window.JocExcel&&window.JocExcel.render._stare;ctx.w=body.querySelector('#xwrap');
  if(!ctx.S||!ctx.w)return;
  body.classList.add('xi-corp');CTX.set(body,ctx);ULTIM=ctx;leaga(body);
  const tel=body.querySelector('.xp-tel');   // nota de telefon a foii comune vorbește de zone și de clic dreapta (lecția 4): aici, doar ce știi
  if(tel)tel.innerHTML='Pe telefon: <b>atingi</b> o celulă ca s-o alegi. Ca să <b>scrii</b> în ea, o atingi, apoi atingi bara de formule (câmpul lung de lângă <i>fx</i>) și scrii. Tastele <b>Tab</b>, <b>Enter</b>, săgețile și <b>Esc</b> sunt butoanele de sub foaie. Cât scrii în bara de formule, bara de stare de jos arată <b>Editare (Edit)</b>.';
  ctx.nota=document.createElement('p');ctx.nota.className='xi-nota';ctx.nota.setAttribute('role','status');ctx.w.after(ctx.nota);
  tasteEcran(ctx);
  if(Q.start){ctx.S.setAct(Q.start);ctx.ignora=true;ctx.S.draw();
    /* G-n1: foaia primește tastatura (ca fereastra Excel), ca elevul să scrie direct în celula activă; de trei ori,
       pentru că motorul mai mută focusul după ce așază exercițiul (butonul „Încă un exercițiu”) */
    const laFoaieStart=()=>{const g=ctx.w&&ctx.w.isConnected&&ctx.w.querySelector('#xgw'),a=document.activeElement;
      if(g&&a!==g&&!(a&&a.closest&&a.closest('input,textarea,select,.xp-nb-in')))try{g.focus({preventScroll:true})}catch(e){}};
    laFoaieStart();setTimeout(laFoaieStart,0);setTimeout(laFoaieStart,200)}
  new MutationObserver(()=>dupaDesen(ctx)).observe(ctx.w,{childList:true});
  new MutationObserver(()=>casetaFaraZone(ctx)).observe(body,{childList:true,subtree:true,characterData:true});
  ctx.ultim=snap(ctx);dupaDesen(ctx);
  if(Q.teste)teste(ctx,Q)}
function ctxPt(body){const c=CTX.get(body);return c&&c.w&&c.w.isConnected?c:ULTIM}
function rezolva(Q,body,api){const ctx=ctxPt(body);const V=Q.verifica||{};
  if(ctx&&!Q.o){
    if(V.foaie)comuta(ctx,idxFoaie(ctx,V.foaie),true);
    if(V.fila){const b=ctx.w.querySelector(`.rb [data-tab="${V.fila}"]`);if(b)b.click()}
    if(V.zoom!=null){const k=idxFoaie(ctx,V.pe);if(k===ctx.k){ctx.zoom=V.zoom;const p=ctx.w.querySelector('.xi-zoom');if(p)p.outerHTML=zoomHtml(ctx.zoom);aplicaZoom(ctx)}else ctx.foi[k].zoom=V.zoom}
    {const k=idxFoaie(ctx,V.pe),R=rawPe(ctx,k);Object.entries(V.valori||{}).forEach(([a,v])=>R[a]=numarRo(v))}
    if(V.activa){const k=idxFoaie(ctx,V.pe);if(k===ctx.k)ctx.S.setAct(V.activa);else ctx.foi[k].act=V.activa}
    ctx.clicInFoaie=false;
  }
  const r=X.rezolva(ctx?ctx.Q2:Q,body,api);
  if(ctx&&!Q.o&&V.unde)ctx.loc=[].concat(V.unde)[0].replace(/:\*$/,':x');
  if(ctx&&!Q.o&&V.activa&&idxFoaie(ctx,V.pe)===ctx.k){ctx.S.setAct(V.activa);ctx.S.draw()}
  return r}
function gresit(Q,body,api){const ctx=ctxPt(body);const V=Q.verifica||{};
  if(ctx&&!Q.o){
    if(V.unde)ctx.loc=potriveste('celula:A1',V.unde)?'caseta':'celula:A1';
    if(V.foaie){const i=idxFoaie(ctx,V.foaie);if(i===ctx.k)comuta(ctx,(i+1)%ctx.foi.length,true)}
    if(V.fila){const alta=V.fila==='home'?'insert':'home',b=ctx.w.querySelector(`.rb [data-tab="${alta}"]`);if(b)b.click()}
    if(V.zoom!=null){const k=idxFoaie(ctx,V.pe),z=V.zoom===100?90:100;if(k===ctx.k){ctx.zoom=z;const p=ctx.w.querySelector('.xi-zoom');if(p)p.outerHTML=zoomHtml(ctx.zoom);aplicaZoom(ctx)}else ctx.foi[k].zoom=z}
    {const k=idxFoaie(ctx,V.pe),R=rawPe(ctx,k);Object.keys(V.valori||{}).forEach(a=>R[a]='x')}
    if(V.activa){const k=idxFoaie(ctx,V.pe),gr=V.activa==='A1'?'B2':'A1';if(k===ctx.k)ctx.S.setAct(gr);else ctx.foi[k].act=gr}
  }
  const r=X.gresit(ctx?ctx.Q2:Q,body,api);
  if(ctx&&!Q.o&&V.activa&&idxFoaie(ctx,V.pe)===ctx.k){ctx.S.setAct(V.activa==='A1'?'B2':'A1');ctx.S.draw()}
  return r}
window.ExcelI={render,rezolva,gresit};
})();
