/* lectii/_sim/excelx-sortare.js — extensia „sortarea datelor” a foii excelx (lecția VIII / M2 / nr. 10).
   PROPRIETAR: autorul lecției VIII/10. Nu schimbă excelx.js (lecția 5), extensiile altor lecții și nici motorul
   (_motor/tip-foaie.js, tip-excel.js). ÎNCĂRCARE, în ordine: motor.js, tip-foaie.js, tip-excel.js, ../../_sim/excelx.js,
   ../../_sim/excelx-sortare.js; apoi tipuri:{excelx:ExcelS}.
   Faptele de mai jos sunt PROBATE în Excel REAL (Microsoft 365, build 20326, interfața în engleză, setări regionale
   românești ro-RO), pe un desktop ascuns, cu datele tastate literă cu literă și butoanele panglicii apăsate prin UI
   Automation: lectii/viii/m2-l10/_proba/proba_excel*.json (rezumat în lectii/viii/m2-l10/surse.md).

   CE ÎNLOCUIEȘTE din foaia motorului (regula fidelității, jocuri/README.md §1) — butoanele de sortare sunt prinse
   înaintea motorului (clic în faza de captură):
   1. ORDINEA: alfabetul românesc (A < Ă < Â < B …, I < Î, S < Ș, T < Ț), fără diferență între litere mari și mici, iar
      rândurile egale își păstrează ordinea dintre ele, și la crescător, și la descrescător (Intl.Collator('ro') dă exact
      ordinea Excel-ului pe cele 23 de cuvinte probate). Crescător: numerele, apoi textul (și numerele păstrate ca text,
      sortate ca text: „10” < „100” < „9”), apoi celulele goale; descrescător: textul, apoi numerele, apoi celulele
      goale (goalele rămân mereu la sfârșit). Datele calendaristice sunt numere: de la cea mai veche la cea mai nouă.
   2. FORMA MERGE CU RÂNDUL: aldinul, umplerea etc. ale unei celule se mută odată cu rândul ei (motorul muta doar valorile).
   3. FEREASTRA „Sort Warning”: când selecția are mai multe celule și lângă ea (stânga/dreapta) mai sunt date, ca în
      Excel: două butoane radio, „Expand the selection” ales de la început, „Continue with the current selection”, și
      butoanele Sort / Cancel (motorul avea trei butoane). La „Continue…” se sortează DOAR selecția: rândurile se
      desperechează. Fereastra apare doar când e selectată O SINGURĂ coloană (cu antet sau fără, sau toată coloana, clic
      pe literă); cu două coloane selectate dintr-un tabel de trei, Excel sortează doar selecția, FĂRĂ întrebare; la rânduri
      întregi din tabel, la fel. Excel NU ține minte „Continue…”: data următoare e iar ales „Expand” (toate probate).
   4. RÂNDUL DE ANTET ghicit ca Excel: vezi antetGhicit() (probat pe 8 tabele).
   5. FEREASTRA „Sort” (Date › Sortare / Pornire › Sortare și filtrare › Sortare particularizată): Add Level / Delete
      Level / Copy Level, „My data has headers”, coloanele Column / Sort On / Order, „Sort by” și „Then by”, ordinea
      după tipul coloanei (A to Z, Smallest to Largest, Oldest to Newest), mesajele de eroare probate.
   6. PORNIRE (Home) › Editare (Editing) › Sortare și filtrare (Sort & Filter): meniul, cu numele care se schimbă după
      tipul celulei active (Sort A to Z / Sort Smallest to Largest / Sort Oldest to Newest).
   7. TESTELE numite ale atelierului: teste:[{ce, intregi:true} | {ce, antet:true} | {ce, ordonat:[{col,ord}…]}], pe zona
      din verifica.sortat (sau T.zona), bifate după ce e acum în foaie.
   NU face (spus în lectii/viii/m2-l10/surse.md): Sort On altceva decât valorile, Custom List, Options (sortarea de la
   stânga la dreapta, litere mari/mici), filtrele, sortarea în Tabel (Format as Table); setările englezești.
   REPARARE 1 (06.10.2026, după registru_j1.md, punctele A-R):
   A. pe ecran îngust, bara cu file și panglica nu mai sar la început după fiecare desen al foii (derularea lor se ține
      minte); la prima foaie a exercițiului, bara cu file arată fila Date (Data); când deschizi fila Date (Data), panglica
      se derulează singură până la grupul Sort & Filter; nota de sub panglică spune asta (nu mai numește grupuri din Pornire).
   B. pe ecranul cu deget (regula 20): ↶ / ↷ de 40 × 40 px, cu 8 px între ele, și lipite în stânga barei cu file (nu
      fug când derulezi filele); filele de cel puțin 34 px; celulele, numerele rândurilor și literele coloanelor de 33 px
      (nu mai mult: foaia de 20 de rânduri ar ieși prea lungă pe telefon); butoanele din jurul foii de cel puțin 36 px.
   C. mesajul de la „Verifică”: când rândurile sunt toate întregi, dar titlul a ajuns printre date, spune asta (antetul
      nerecunoscut), nu „rândurile s-au amestecat”; la desperecherea adevărată, mesajul nu mai vorbește de „elev”.
   D. Enter în Sort Warning = Sort, Enter în fereastra Sort = OK (butoanele implicite; probat: _proba/r1_excel.json);
      fereastra Sort primește focusul la deschidere.
   H. numele RO nesigure nu mai apar ca nume: butonul „Sort” din Sort Warning, „Cell Values”, „Move Up / Move Down”
      (descrierea românească doar în title).
   R. titlurile butoanelor de sortare după datele din selecție, nu după celula activă: cu C1:C6 (antet inclus) sau cu
      toată coloana C, „Sort Smallest to Largest” (probat de judecătorul ab_sonnet: _verificare/ab_sonnet/p4_excel_3.json).
   Global: window.ExcelS (tipul), window.ExcelSortare (compara, ordoneaza — pentru probe). */
(function(){
'use strict';
if(!window.ExcelX||!window.ExcelTipuri){console.error('excelx-sortare.js: încarcă întâi lectii/_sim/excelx.js');return}
const XT=window.ExcelTipuri;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).toUpperCase().match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const COLL=new Intl.Collator('ro',{sensitivity:'base'});
const RANG={num:0,text:1,bool:2,err:3};
const FDATA=/^(dd|mmm)/;

/* ---- valorile celulelor, ca le vede Excel (setări românești): {t:'num'|'text'|'bool'|'err'|'gol', v, data} ---- */
function valori(RAW){const memo={},stiva=new Set();
  const simplu=a=>{const x=get(a);return x.t==='gol'?'':x.v};
  function get(a){if(a in memo)return memo[a];const raw=RAW[a];let o;
    if(raw==null||raw==='')o={t:'gol'};
    else if(typeof raw==='number')o={t:'num',v:raw};
    else{const s=String(raw);
      if(s[0]==='='){if(stiva.has(a))o={t:'err',v:'#REF'};else{stiva.add(a);
          try{const v=window.JocFoaie.evaluate(s,simplu);o=typeof v==='number'?{t:'num',v}:typeof v==='boolean'?{t:'bool',v}:v===''||v==null?{t:'text',v:''}:{t:'text',v:String(v)}}
          catch(e){o={t:'err',v:e.show||'#VALUE!'}}finally{stiva.delete(a)}}}
      else{const p=XT.citeste(s);
        if(p.tip==='num')o={t:'num',v:p.v,data:FDATA.test(p.fmt||'')};
        else if(p.tip==='bool')o={t:'bool',v:p.v};
        else if(p.tip==='gol')o={t:'gol'};
        else o={t:'text',v:p.v==null?s:String(p.v)}}}
    memo[a]=o;return o}
  return get}
/* Excel: numere < text < TRUE/FALSE < erori; goalele la sfârșit în AMBELE ordini; textul după alfabetul românesc */
function compara(a,b,ord){const ga=a.t==='gol',gb=b.t==='gol';if(ga||gb)return ga&&gb?0:ga?1:-1;
  let d;if(a.t!==b.t)d=RANG[a.t]-RANG[b.t];else if(a.t==='num')d=a.v-b.v;else if(a.t==='text')d=COLL.compare(a.v,b.v);
  else if(a.t==='bool')d=(a.v?1:0)-(b.v?1:0);else d=0;return ord==='desc'?-d:d}

/* ---- starea foii ---- */
const CTX=new WeakMap();
const stareDe=body=>body._xlS||null;
function plina(S,c,r){const v=S.RAW[adr(c,r)];return v!=null&&v!==''}
function selectie(body){const g=body.querySelector('#xwrap .gw');if(!g)return null;const a=g.querySelector('td.act');if(!a)return null;
  const act=pos(a.dataset.a);let c1=act.c,c2=act.c,r1=act.r,r2=act.r;
  g.querySelectorAll('td.z').forEach(t=>{const p=pos(t.dataset.a);if(!p)return;c1=Math.min(c1,p.c);c2=Math.max(c2,p.c);r1=Math.min(r1,p.r);r2=Math.max(r2,p.r)});
  return {act,c1,c2,r1,r2,una:c1===c2&&r1===r2}}
/* regiunea curentă (CurrentRegion): blocul de celule pline din jurul unei zone, cu vecinii și pe diagonală */
function regiune(S,z){const D=S.dim();let {c1,c2,r1,r2}=z,sch=true;
  const p=(c,r)=>c>=0&&r>=0&&c<D.cols&&r<D.rows&&plina(S,c,r);
  while(sch){sch=false;
    for(let r=r1-1;r<=r2+1;r++){if(c1>0&&p(c1-1,r)){c1--;sch=true;break}}
    for(let r=r1-1;r<=r2+1;r++){if(c2<D.cols-1&&p(c2+1,r)){c2++;sch=true;break}}
    for(let c=c1-1;c<=c2+1;c++){if(r1>0&&p(c,r1-1)){r1--;sch=true;break}}
    for(let c=c1-1;c<=c2+1;c++){if(r2<D.rows-1&&p(c,r2+1)){r2++;sch=true;break}}}
  /* rândurile și coloanele goale de la margini nu intră (o coloană întreagă selectată se strânge la tabel) */
  const randGol=r=>{for(let c=c1;c<=c2;c++)if(plina(S,c,r))return false;return true},colGoala=c=>{for(let r=r1;r<=r2;r++)if(plina(S,c,r))return false;return true};
  while(r2>r1&&randGol(r2))r2--;while(r1<r2&&randGol(r1))r1++;while(c2>c1&&colGoala(c2))c2--;while(c1<c2&&colGoala(c1))c1++;
  return {c1,c2,r1,r2}}
/* Excel întreabă („Sort Warning”) când selecția e O coloană (mai multe celule) și lângă ea, la stânga sau la dreapta, pe
   rândurile ei, mai sunt date. Două coloane din trei sau rânduri pe toată lățimea: fără întrebare (probat). */
function areDateAlaturi(S,z){const D=S.dim();
  for(let r=z.r1;r<=Math.min(z.r2,D.rows-1);r++){if(z.c1>0&&plina(S,z.c1-1,r))return true;if(z.c2<D.cols-1&&plina(S,z.c2+1,r))return true}
  return false}
/* rândul de antet, ghicit ca în Excel (probat pe 8 tabele: _proba/proba_excel_2.json, etapa „antet”): primul rând e antet
   dacă, într-o coloană a zonei, el e text, iar dedesubt e un număr sau o dată (Elev/Media, Punctaj/70); sau dacă e scris
   numai cu MAJUSCULE, iar dedesubt nu (NUME peste Ana); sau dacă e scris altfel (aldin, cursiv, subliniat, altă umplere sau
   culoare) decât rândul de dedesubt (Nume îngroșat). O listă numai de texte, fără nimic din toate astea, NU are antet:
   „Nume” peste Radu, Ana… și „Elev, Clasa” peste nume și clase se sortează printre date (probat). */
const majuscule=t=>/\p{L}/u.test(t)&&t===t.toLocaleUpperCase('ro')&&t!==t.toLocaleLowerCase('ro');
function antetGhicit(S,z){if(z.r2<=z.r1)return false;const get=valori(S.RAW);
  for(let c=z.c1;c<=z.c2;c++){const a=get(adr(c,z.r1)),b=get(adr(c,z.r1+1));if(a.t==='text'&&a.v!==''&&(b.t==='num'))return true;
    if(a.t==='text'&&b.t==='text'&&majuscule(a.v)&&!majuscule(b.v))return true}
  const F=S.FMT||{},sem=f=>f?[f.b,f.i,f.u,f.fill,f.color].map(x=>x||'').join('|'):'||||';
  for(let c=z.c1;c<=z.c2;c++){if(sem(F[adr(c,z.r1)])!==sem(F[adr(c,z.r1+1)]))return true}
  return false}

/* ---- sortarea: rândurile întregi (valori + formă), formulele mutate cu rândul lor (ca o copiere), stabilă ---- */
function snap(body){const b=body.querySelector('button[data-rb="xs:snap"]');if(b&&b.onclick)b.onclick()}
function ordoneaza(S,z,chei,antet){const get=valori(S.RAW),r0=antet?z.r1+1:z.r1,rand=[];
  for(let r=r0;r<=z.r2;r++){const o={r,raw:{},fmt:{},v:{}};for(let c=z.c1;c<=z.c2;c++){const a=adr(c,r);o.raw[c]=S.RAW[a];o.fmt[c]=S.FMT[a];o.v[c]=get(a)}rand.push(o)}
  rand.sort((x,y)=>{for(const k of chei){const d=compara(x.v[k.c],y.v[k.c],k.ord);if(d)return d}return x.r-y.r});
  return {r0,rand}}
function scrieRanduri(S,z,r0,rand){
  rand.forEach((o,i)=>{const r=r0+i;for(let c=z.c1;c<=z.c2;c++){const a=adr(c,r),x=o.raw[c];
    if(x==null||x==='')delete S.RAW[a];else S.RAW[a]=typeof x==='string'&&x.startsWith('=')?window.JocFoaie.shift(x,r-o.r,0):x;
    if(o.fmt[c])S.FMT[a]=JSON.parse(JSON.stringify(o.fmt[c]));else delete S.FMT[a]}})}
function sorteaza(body,z,chei,antet,cum){const S=stareDe(body);if(!S)return;snap(body);
  const {r0,rand}=ordoneaza(S,z,chei,antet);scrieRanduri(S,z,r0,rand);
  S.gest.add('sortare');if(cum==='dlg')S.gest.add('sortare-dlg');
  const ctx=CTX.get(body);if(ctx)ctx.ultima={z,chei,antet,cum,niveluri:chei.length};
  S.draw();laFoaie(body)}
const laFoaie=body=>{const g=body.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(e){}};

/* ---- tipul coloanei (pentru numele butoanelor și ordinea din fereastra Sort) ---- */
function tipColoana(S,c,z,antet){const get=valori(S.RAW);for(let r=antet?z.r1+1:z.r1;r<=z.r2;r++){const x=get(adr(c,r));if(x.t==='gol')continue;return x.t==='num'?(x.data?'data':'num'):'text'}return 'text'}
const NUME_ORD={text:[['A to Z','De la A la Z'],['Z to A','De la Z la A']],num:[['Smallest to Largest','De la cel mai mic la cel mai mare'],['Largest to Smallest','De la cel mai mare la cel mai mic']],
  data:[['Oldest to Newest','De la cel mai vechi la cel mai nou'],['Newest to Oldest','De la cel mai nou la cel mai vechi']]};
const NUME_BUTON={text:[['Sort A to Z','Sortare de la A la Z'],['Sort Z to A','Sortare de la Z la A']],num:[['Sort Smallest to Largest','Sortare de la cel mai mic la cel mai mare'],['Sort Largest to Smallest','Sortare de la cel mai mare la cel mai mic']],
  data:[['Sort Oldest to Newest','Sortare de la cel mai vechi la cel mai nou'],['Sort Newest to Oldest','Sortare de la cel mai nou la cel mai vechi']]};
function tipActiva(S,sel){const get=valori(S.RAW);const x=get(adr(sel.act.c,sel.act.r));return x.t==='num'?(x.data?'data':'num'):'text'}
/* R: la o selecție de mai multe celule, Excel numește butoanele după DATELE din coloana celulei active, fără antet: C1:C6
   (Punctaj peste numere) sau toată coloana C dau „Sort Smallest to Largest”; B1:B6 / B2:B6 (texte) dau „Sort A to Z”
   (probat: _verificare/ab_sonnet/p4_excel_3.json). La o singură celulă, după celula însăși (probat de autorul 1). */
function tipSelectie(S,sel){if(sel.una)return tipActiva(S,sel);
  const z={c1:sel.c1,c2:sel.c2,r1:sel.r1,r2:ultimulRand(S,sel)};return tipColoana(S,sel.act.c,z,antetGhicit(S,z))}

/* ---- ferestrele (în pagină, sub foaie, ca ferestrele foii din motor) ---- */
const CSS=`.xs-dlg{margin:10px 0;padding:12px 14px;border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--ink);font-family:var(--fb);max-width:640px;box-shadow:0 6px 18px rgba(0,0,0,.14)}
.xs-dlg .xs-tit{display:flex;align-items:center;gap:8px;font-weight:700;margin-bottom:6px}.xs-dlg .xs-tit span{flex:1}
.xs-dlg .xs-ro{color:var(--ink2);font-weight:400;font-size:.9em}
.xs-dlg p{margin:.35em 0}.xs-dlg label{display:flex;align-items:center;gap:8px;min-height:36px;cursor:pointer}
.xs-dlg input[type=radio],.xs-dlg input[type=checkbox]{width:20px;height:20px;margin:0;flex:none}
.xs-dlg button,.xs-meniu button{min-height:36px;min-width:36px;padding:4px 12px;border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);font:inherit;cursor:pointer}
.xs-dlg button.ok{background:var(--accent);color:var(--accentInk);border-color:var(--accent);font-weight:700}
.xs-dlg button:disabled{opacity:.45;cursor:default}
.xs-dlg .xs-bt{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:10px}
.xs-dlg .xs-bara{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0 8px}
.xs-dlg .xs-cap{display:grid;grid-template-columns:1.25fr 1fr 1.25fr;gap:6px;font-size:.85rem;color:var(--ink2);padding:0 0 2px 4px}
.xs-dlg .xs-niv{display:grid;grid-template-columns:1.25fr 1fr 1.25fr;gap:6px;align-items:center;padding:6px 4px;border:2px solid transparent;border-radius:6px}
.xs-dlg .xs-niv.ales{border-color:var(--accent);background:var(--sel)}
.xs-dlg .xs-niv .xs-et{grid-column:1/-1;font-size:.85rem;font-weight:600}
.xs-dlg select{min-height:36px;width:100%;min-width:0;max-width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;padding:2px 4px}
.xs-dlg .xs-niv>*{min-width:0}
.xs-dlg .xs-on{font-size:.9rem;color:var(--ink2)}
.xs-dlg .xs-err{border:1px solid var(--bad);background:var(--badbg);color:var(--bad);border-radius:6px;padding:6px 8px;margin:6px 0}
@media (max-width:560px){.xs-dlg .xs-cap{display:none}.xs-dlg .xs-niv{grid-template-columns:1fr}.xs-dlg .xs-niv .xs-on::before{content:"Sort On: "}}
.xs-meniu{position:fixed;z-index:80;min-width:250px;max-width:94vw;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:8px;box-shadow:0 10px 28px rgba(0,0,0,.28);padding:4px 0;font-family:var(--fb);font-size:.92rem}
.xs-meniu button{display:block;width:100%;text-align:left;border:0;border-radius:0;background:none;padding:6px 14px}
.xs-meniu button:hover:not(:disabled),.xs-meniu button:focus{background:var(--sel)}
.xs-meniu button:disabled{opacity:.5}.xs-meniu hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.xs-nota{margin:6px 0;padding:6px 10px;border-radius:6px;background:var(--paper2);color:var(--ink2);font-size:.9rem}
.xs-teste{margin:0 0 10px;padding:10px 12px;border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper)}
.xs-teste .lbl{font-weight:700;font-size:.9rem;margin-bottom:4px}.xs-teste ul{list-style:none;margin:0;padding:0}
.xs-teste li{padding:3px 0;color:var(--ink2)}.xs-teste li.ok{color:var(--ok);font-weight:600}.xs-teste li span[aria-hidden]{display:inline-block;width:1.3em}
.xs-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
/* B (regula 20): pe ecranul cu deget (clasa xs-deget pe #body), țintele foii au cel puțin 32 px. ↶ / ↷ stau lipite în
   stânga barei cu file (position:sticky), ca să nu fugă din ecran când derulezi filele spre fila Date (Data). */
.xs-deget .xl .rb .tabs .qat{position:sticky;left:0;z-index:3;align-self:stretch;gap:8px;background:var(--paper2);box-shadow:-6px 0 0 var(--paper2)}
.xs-deget .xl .rb .tabs .qat button{min-width:40px;min-height:40px}
.xs-deget .xl .rb .tabs [data-tab]{min-height:34px}
.xs-deget .xl .gw td,.xs-deget .xl .gw tbody th{height:33px}
.xs-deget .xl .gw thead th{height:33px}
.xs-deget .xl .gw tbody th{min-width:34px}
.xs-deget .xl .bara button,.xs-deget .xl .cr button{min-height:36px}`;
function css(){if(!document.getElementById('xs-css')){const s=document.createElement('style');s.id='xs-css';s.textContent=CSS;document.head.appendChild(s)}}
function locDialog(body){let d=body.querySelector('.xs-loc');if(!d){d=document.createElement('div');d.className='xs-loc';const w=body.querySelector('#xwrap');if(w)w.after(d);else body.appendChild(d)}return d}
function inchideDialog(body){const d=body.querySelector('.xs-loc');if(d)d.innerHTML='';const ctx=CTX.get(body);if(ctx)ctx.dlg=null;laFoaie(body)}
function nota(body,html){const d=locDialog(body);d.innerHTML=html?`<div class="xs-nota" role="status">${html}</div>`:''}

/* 3. Sort Warning */
function avertisment(body,sel,ord){const ctx=CTX.get(body);const S=stareDe(body);const d=locDialog(body);
  const ext=true;   // Excel pornește mereu cu „Expand the selection” (nu ține minte „Continue…”, probat)
  d.innerHTML=`<div class="xs-dlg" role="dialog" aria-label="Sort Warning (avertisment de sortare)">
   <div class="xs-tit"><span>Sort Warning <span class="xs-ro">(avertisment de sortare)</span></span><button type="button" data-xs="x" aria-label="Închidere (Close)" title="Închidere (Close)">✕</button></div>
   <p>Microsoft Excel found data next to your selection. Since you have not selected this data, it will not be sorted.</p>
   <p class="xs-ro">Excel a găsit date lângă selecția ta. Pe cele pe care nu le-ai selectat nu le va sorta.</p>
   <p>What do you want to do? <span class="xs-ro">(Ce vrei să faci?)</span></p>
   <label><input type="radio" name="xs-av" value="extinde" ${ext?'checked':''}> <span>Expand the selection <span class="xs-ro">(Extindeți selecția)</span></span></label>
   <label><input type="radio" name="xs-av" value="curenta" ${ext?'':'checked'}> <span>Continue with the current selection <span class="xs-ro">(Continuați cu selecția curentă)</span></span></label>
   <div class="xs-bt"><button type="button" class="ok" data-xs="sort">Sort</button><button type="button" data-xs="cancel">Cancel (Anulare)</button></div></div>`;
  ctx.dlg='avert';
  const r=()=>{const x=d.querySelector('input[name="xs-av"]:checked');return x?x.value:'extinde'};
  d.querySelector('[data-xs="sort"]').onclick=()=>{const alege=r();inchideDialog(body);
    if(alege==='extinde'){const z=regiune(S,sel);sorteaza(body,z,[{c:sel.act.c,ord}],antetGhicit(S,z),'buton')}
    else{const z={c1:sel.c1,c2:sel.c2,r1:sel.r1,r2:Math.min(sel.r2,ultimulRand(S,sel))};sorteaza(body,z,[{c:sel.act.c,ord}],antetGhicit(S,z),'curenta')}};
  d.querySelector('[data-xs="cancel"]').onclick=()=>inchideDialog(body);
  d.querySelector('[data-xs="x"]').onclick=()=>inchideDialog(body);
  /* D: Sort e butonul implicit (chenarul albastru din Excel): Enter, cu focusul pe o variantă, sortează; Esc = Cancel */
  d.onkeydown=ev=>{if(ev.key==='Escape'){ev.preventDefault();inchideDialog(body)}
    else if(ev.key==='Enter'&&!(ev.target&&ev.target.closest&&ev.target.closest('button'))){ev.preventDefault();ev.stopPropagation();d.querySelector('[data-xs="sort"]').click()}};
  const f=d.querySelector('input[name="xs-av"]:checked');if(f)try{f.focus({preventScroll:true})}catch(e){}
  try{d.scrollIntoView({block:'nearest'})}catch(e){}}
/* o coloană întreagă selectată: rândurile goale de jos nu contează */
function ultimulRand(S,z){for(let r=z.r2;r>=z.r1;r--)for(let c=z.c1;c<=z.c2;c++)if(plina(S,c,r))return r;return z.r1}

/* butoanele A→Z / Z→A (fila Date și meniul din Pornire) */
function butonSort(body,ord){const S=stareDe(body),sel=selectie(body);if(!S||!sel)return;
  if(!sel.una&&sel.c1===sel.c2&&areDateAlaturi(S,sel))return avertisment(body,sel,ord);
  if(sel.una){if(!plina(S,sel.act.c,sel.act.r)&&!vecinPlin(S,sel))return eroareGoala(body);
    const z=regiune(S,sel);return sorteaza(body,z,[{c:sel.act.c,ord}],antetGhicit(S,z),'buton')}
  const z={c1:sel.c1,c2:sel.c2,r1:sel.r1,r2:ultimulRand(S,sel)};sorteaza(body,z,[{c:sel.act.c,ord}],antetGhicit(S,z),'buton')}
function vecinPlin(S,sel){for(let dc=-1;dc<=1;dc++)for(let dr=-1;dr<=1;dr++){const c=sel.act.c+dc,r=sel.act.r+dr;if(c>=0&&r>=0&&plina(S,c,r))return true}return false}
/* celulă goală, fără date în jur: Excel spune „This can't be applied to the selected range. Select a single cell in a range
   and try again.” (probat la Sort... pe o foaie goală, _proba/proba_excel_b.json › dialog2) */
function eroareGoala(body){nota(body,'Microsoft Excel: <i>This can\'t be applied to the selected range. Select a single cell in a range and try again.</i> Celula aleasă e goală și nu are date în jur: fă clic pe o celulă din tabel, apoi apasă din nou butonul.')}
/* cât elevul scrie într-o celulă, foaia nu sortează: îi cere întâi Enter (cum se poartă Excel aici NU e probat: tastarea pe
   desktopul ascuns n-a intrat în celulă când panglica avea focusul, _proba/proba_excel_b_6.json) */
function inScriere(body){const s=body.querySelector('#xwrap .st span');return !!s&&!/^Gata/.test(s.textContent)}

/* 5. fereastra Sort */
function deschideSort(body){const ctx=CTX.get(body),S=stareDe(body),sel=selectie(body);if(!S||!sel)return;
  if(sel.una&&!plina(S,sel.act.c,sel.act.r)&&!vecinPlin(S,sel))return eroareGoala(body);
  const z=sel.una?regiune(S,sel):{c1:sel.c1,c2:sel.c2,r1:sel.r1,r2:ultimulRand(S,sel)};
  /* „Sort by” pornește GOL la un tabel cu mai multe coloane și cu coloana aleasă la o listă de o coloană (probat). Dacă
     tabelul a mai fost sortat, fereastra arată ultima sortare (Punctaj, Largest to Smallest după butonul de descrescător;
     cele două niveluri după o sortare pe două criterii — probat), cu bifa de antet de atunci. */
  const u=ctx.ultima,acelasi=u&&u.z.c1===z.c1&&u.z.c2===z.c2&&u.z.r1===z.r1&&u.z.r2===z.r2;
  ctx.sd=acelasi?{z,antet:u.antet,niv:u.chei.map(k=>({c:k.c,ord:k.ord})),ales:0,err:''}
    :{z,antet:antetGhicit(S,z),niv:[{c:z.c1===z.c2?z.c1:null,ord:'asc'}],ales:0,err:''};deseneazaSort(body);
  /* D: la deschidere, focusul intră în fereastră (pe lista Sort by), ca Enter / Esc să lucreze ca în Excel */
  const prima=locDialog(body).querySelector('[data-sd="col"]');if(prima)try{prima.focus({preventScroll:true})}catch(e){}}
function deseneazaSort(body){const ctx=CTX.get(body),S=stareDe(body),sd=ctx.sd,get=valori(S.RAW),d=locDialog(body);ctx.dlg='sort';
  /* D: fereastra se redesenează la bifă, la Add/Delete/Copy Level, la ▲▼; focusul rămâne în ea (pe același control sau pe
     Sort by), altfel Enter / Esc n-ar mai ajunge la fereastră */
  const fa=document.activeElement,fk=fa&&d.contains(fa)&&fa.dataset&&fa.dataset.sd?{sd:fa.dataset.sd,i:fa.dataset.i}:null;
  const z=sd.z,numeCol=c=>sd.antet?(String(get(adr(c,z.r1)).v??'')||`Column ${COL(c)}`):`Column ${COL(c)}`;
  const opt=[];for(let c=z.c1;c<=z.c2;c++)opt.push(c);
  const nivel=(n,i)=>{const tip=n.c==null?'text':tipColoana(S,n.c,z,sd.antet),O=NUME_ORD[tip];
    return `<div class="xs-niv ${i===sd.ales?'ales':''}" data-niv="${i}"><span class="xs-et">${i?'Then by <span class="xs-ro">(Apoi după)</span>':'Sort by <span class="xs-ro">(Sortare după)</span>'}</span>
      <select data-sd="col" data-i="${i}" aria-label="${i?'Then by (Apoi după)':'Sort by (Sortare după)'}: coloana">${n.c==null?'<option value="" selected></option>':''}${opt.map(c=>`<option value="${c}" ${n.c===c?'selected':''}>${esc(numeCol(c))}</option>`).join('')}</select>
      <span class="xs-on" title="Cell Values: sortezi după valorile din celule (textul, numerele, datele)">Cell Values</span>
      <select data-sd="ord" data-i="${i}" aria-label="Order (Ordine)"><option value="asc" ${n.ord==='asc'?'selected':''}>${O[0][0]} (${O[0][1]})</option><option value="desc" ${n.ord==='desc'?'selected':''}>${O[1][0]} (${O[1][1]})</option><option value="lista" disabled>Custom List... (azi nu-l folosim)</option></select></div>`};
  d.innerHTML=`<div class="xs-dlg" role="dialog" aria-label="Sort (fereastra Sortare)">
   <div class="xs-tit"><span>Sort <span class="xs-ro">(Sortare)</span></span><button type="button" data-sd="x" aria-label="Închidere (Close)" title="Închidere (Close)">✕</button></div>
   <div class="xs-bara"><button type="button" data-sd="adauga">+ Add Level <span class="xs-ro">(Adăugare nivel)</span></button>
    <button type="button" data-sd="sterge" ${sd.niv.length?'':'disabled'}>✕ Delete Level <span class="xs-ro">(Ștergere nivel)</span></button>
    <button type="button" data-sd="copiaza" ${sd.niv.length?'':'disabled'}>Copy Level <span class="xs-ro">(Copiere nivel)</span></button>
    <button type="button" data-sd="sus" ${sd.ales>0?'':'disabled'} aria-label="Move Up" title="Move Up: urcă nivelul ales cu un loc">▲</button><button type="button" data-sd="jos" ${sd.ales<sd.niv.length-1?'':'disabled'} aria-label="Move Down" title="Move Down: coboară nivelul ales cu un loc">▼</button>
    <button type="button" data-sd="optiuni">Options… <span class="xs-ro">(Opțiuni)</span></button>
    <label style="margin-left:auto"><input type="checkbox" data-sd="antet" ${sd.antet?'checked':''}> <span>My data has headers <span class="xs-ro">(Datele mele au anteturi)</span></span></label></div>
   <div class="xs-cap"><span>Column <span class="xs-ro">(Coloană)</span></span><span>Sort On <span class="xs-ro">(Sortare pe baza)</span></span><span>Order <span class="xs-ro">(Ordine)</span></span></div>
   ${sd.niv.map(nivel).join('')}
   ${sd.err?`<div class="xs-err" role="alert">${sd.err}</div>`:''}${sd.info?`<div class="xs-nota" role="status">${sd.info}</div>`:''}
   <div class="xs-bt"><button type="button" class="ok" data-sd="ok">OK</button><button type="button" data-sd="cancel">Cancel (Anulare)</button></div></div>`;
  const Q=s=>d.querySelectorAll(s);
  Q('[data-niv]').forEach(x=>x.addEventListener('pointerdown',()=>{const i=Number(x.dataset.niv);if(sd.ales!==i){sd.ales=i;x.parentElement.querySelectorAll('.xs-niv').forEach(y=>y.classList.toggle('ales',Number(y.dataset.niv)===i))}}));
  Q('[data-sd="col"]').forEach(x=>x.onchange=()=>{const i=Number(x.dataset.i);sd.niv[i].c=x.value===''?null:Number(x.value);   /* sensul rămâne (crescător/descrescător), doar numele lui se schimbă după tipul coloanei — NEPROBAT, vezi surse.md */
sd.ales=i;sd.err='';deseneazaSort(body);const n=d.querySelector(`[data-sd="col"][data-i="${i}"]`);if(n)n.focus({preventScroll:true})});
  Q('[data-sd="ord"]').forEach(x=>x.onchange=()=>{const i=Number(x.dataset.i);sd.niv[i].ord=x.value;sd.ales=i});
  d.querySelector('[data-sd="antet"]').onchange=ev=>{sd.antet=ev.target.checked;sd.err='';deseneazaSort(body)};
  d.querySelector('[data-sd="adauga"]').onclick=()=>{sd.niv.push({c:null,ord:'asc'});sd.ales=sd.niv.length-1;sd.err='';deseneazaSort(body);const n=d.querySelector(`[data-sd="col"][data-i="${sd.ales}"]`);if(n)n.focus({preventScroll:true})};
  d.querySelector('[data-sd="sterge"]').onclick=()=>{if(!sd.niv.length)return;sd.niv.splice(sd.ales,1);sd.ales=Math.max(0,Math.min(sd.ales,sd.niv.length-1));sd.err='';deseneazaSort(body)};
  const muta=k=>{const i=sd.ales,j=i+k;if(j<0||j>=sd.niv.length)return;const t=sd.niv[i];sd.niv[i]=sd.niv[j];sd.niv[j]=t;sd.ales=j;sd.err='';deseneazaSort(body)};
  d.querySelector('[data-sd="sus"]').onclick=()=>muta(-1);d.querySelector('[data-sd="jos"]').onclick=()=>muta(1);
  d.querySelector('[data-sd="optiuni"]').onclick=()=>{sd.err='';sd.info='„Options…” (Opțiuni) e și în Excel: sortarea de la stânga la dreapta și cea după litere mari/mici. Azi nu le folosim.';deseneazaSort(body)};
  d.querySelector('[data-sd="copiaza"]').onclick=()=>{if(!sd.niv.length)return;sd.niv.splice(sd.ales+1,0,{...sd.niv[sd.ales]});sd.ales++;sd.err='';deseneazaSort(body)};
  const anul=()=>{ctx.sd=null;inchideDialog(body)};
  d.querySelector('[data-sd="cancel"]').onclick=anul;d.querySelector('[data-sd="x"]').onclick=anul;
  d.querySelector('[data-sd="ok"]').onclick=()=>{
    if(!sd.niv.length){anul();return}
    if(sd.niv.some(n=>n.c==null)){sd.err='Microsoft Excel: All sort criteria must have a column or row specified. Check the selected sort criteria and try again. <span class="xs-ro">(Fiecare nivel trebuie să aibă o coloană aleasă.)</span>';deseneazaSort(body);return}
    const dub=sd.niv.find((n,i)=>sd.niv.findIndex(m=>m.c===n.c)!==i);
    if(dub){sd.err=`„${esc(numeCol(dub.c))}” is being sorted by values more than once. Delete the duplicate sort condition and try again. <span class="xs-ro">(Aceeași coloană apare la două niveluri: șterge unul.)</span>`;deseneazaSort(body);return}
    const chei=sd.niv.map(n=>({c:n.c,ord:n.ord}));ctx.sd=null;inchideDialog(body);sorteaza(body,z,chei,sd.antet,'dlg')};
  /* D: OK e butonul implicit al ferestrei Sort: Enter (cu focusul pe o listă sau pe bifă) apasă OK, ca în Excel
     (probat: _proba/r1_excel.json › sort_dialog_enter); Esc = Cancel */
  d.onkeydown=ev=>{if(ev.key==='Escape'){ev.preventDefault();anul()}
    else if(ev.key==='Enter'&&!(ev.target&&ev.target.closest&&ev.target.closest('button'))){ev.preventDefault();ev.stopPropagation();d.querySelector('[data-sd="ok"]').click()}};
  if(fk){const n=d.querySelector(`[data-sd="${fk.sd}"]${fk.i!=null?`[data-i="${fk.i}"]`:''}:not(:disabled)`)||d.querySelector('[data-sd="col"]');if(n)try{n.focus({preventScroll:true})}catch(e){}}
  try{d.scrollIntoView({block:'nearest'})}catch(e){}}

/* 6. meniul Pornire › Sortare și filtrare */
let M=null;
function inchideMeniu(){if(M){M.remove();M=null}}
function meniuHome(body,btn){const S=stareDe(body),sel=selectie(body);if(!S||!sel)return;css();inchideMeniu();
  const tip=tipSelectie(S,sel),B=NUME_BUTON[tip];
  const m=document.createElement('div');m.className='xs-meniu';m.setAttribute('role','menu');
  m.innerHTML=`<button type="button" role="menuitem" data-m="asc">${B[0][1]} (${B[0][0]})</button><button type="button" role="menuitem" data-m="desc">${B[1][1]} (${B[1][0]})</button>
    <button type="button" role="menuitem" data-m="dlg">Sortare particularizată… (Custom Sort…)</button><hr>
    <button type="button" role="menuitem" data-m="nesim">Filtru (Filter)</button><button type="button" role="menuitem" disabled>Golire (Clear)</button><button type="button" role="menuitem" disabled>Reaplicare (Reapply)</button>`;
  document.body.appendChild(m);M=m;const r=btn.getBoundingClientRect();
  const W=Math.min(300,innerWidth-8);m.style.left=Math.max(4,Math.min(r.left,innerWidth-W-4))+'px';m.style.top=Math.min(r.bottom+2,innerHeight-m.offsetHeight-4)+'px';
  m.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(!b)return;ev.stopPropagation();const k=b.dataset.m;inchideMeniu();
    if(k==='asc'||k==='desc')butonSort(body,k);else if(k==='dlg')deschideSort(body);else nota(body,'„Filtru (Filter)” e și în Excel, dar în lecția de azi nu-l folosim.')});
  const prim=m.querySelector('button');if(prim)try{prim.focus({preventScroll:true})}catch(e){}}
let globale=false;
function leagaGlobale(){if(globale)return;globale=true;
  document.addEventListener('pointerdown',ev=>{if(M&&!M.contains(ev.target)&&!ev.target.closest('[data-nesim="SortFilterMenu"]'))inchideMeniu()},true);
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&M){inchideMeniu()}},true);
  addEventListener('resize',inchideMeniu)}

/* butoanele panglicii: titlurile după tipul celulei active, ca în Excel (Sort Smallest to Largest pe un număr) */
function titluri(body){const S=stareDe(body),sel=selectie(body);if(!S||!sel)return;const B=NUME_BUTON[tipSelectie(S,sel)];
  const a=body.querySelector('#xwrap [data-so="asc"]'),d=body.querySelector('#xwrap [data-so="desc"]'),s=body.querySelector('#xwrap [data-so="dlg"]');
  if(a){a.title=`${B[0][1]} (${B[0][0]})`;a.setAttribute('aria-label',`${B[0][1]} (${B[0][0]})`)}
  if(d){d.title=`${B[1][1]} (${B[1][0]})`;d.setAttribute('aria-label',`${B[1][1]} (${B[1][0]})`)}
  if(s){s.title='Sortare (Sort)…';s.setAttribute('aria-label','Sortare (Sort)')}
  mareste(body);derulari(body)}
function eDeget(){try{return matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0}catch(e){return false}}
/* A (registru_j1.md): pe ecran îngust (telefon: bara cu file are ~280 px, conținutul ~560 px), bara cu file și panglica
   se derulează în lateral. Motorul rescrie panglica la fiecare desen al foii (o atingere pe o celulă), deci derularea lor
   revenea la 0: elevul nu mai vedea fila deschisă și trebuia să caute din nou grupul. Aici:
   - derularea ambelor se ține minte (ctx.der, actualizată la fiecare glisare) și se pune la loc după fiecare desen;
   - la prima foaie a exercițiului, bara cu file se derulează cât să se vadă fila Date (Data) (orice sortare pornește de acolo);
   - când se deschide fila Date (Data), panglica se derulează până la grupul Sort & Filter (cu butoanele A→Z, Z→A, Sort);
   - nota de sub panglică (vizibilă doar pe ecran îngust) spune asta, după fila deschisă.
   Pe ecranul lat nimic nu se derulează (totul încape), deci funcția nu schimbă nimic acolo. */
const TXT_DATA='Panglica se glisează în lateral. Pe fila Date (Data), foaia o derulează singură până la grupul Sortare și filtrare (Sort & Filter).';
const TXT_ALTA='Bara cu file și panglica se glisează în lateral. Fila Date (Data) e în bara cu file, imediat după Formule (Formulas).';
function inVedere(cont,el,stanga){const cb=cont.getBoundingClientRect(),eb=el.getBoundingClientRect();
  const q=cont.querySelector('.qat'),lip=q&&getComputedStyle(q).position==='sticky'?q.getBoundingClientRect().right-cb.left:0;   // ↶ ↷ lipite în stânga acoperă începutul
  if(stanga){cont.scrollLeft+=Math.round(eb.left-cb.left-lip-6);return}
  if(eb.right>cb.right-4)cont.scrollLeft+=Math.ceil(eb.right-cb.right)+8;else if(eb.left<cb.left+lip)cont.scrollLeft-=Math.ceil(cb.left+lip-eb.left)+8}
function derulari(body){const ctx=CTX.get(body),w=body.querySelector('#xwrap');if(!ctx||!w)return;
  const D=ctx.der||(ctx.der={tabs:null,banda:{},fila:null});
  const tabs=w.querySelector('.rb .tabs'),banda=w.querySelector('.pg-banda'),on=w.querySelector('.rb .tabs [data-tab].on'),fila=on?on.dataset.tab:'';
  if(tabs){if(D.tabs==null){const t=tabs.querySelector('[data-tab="data"]');if(t)inVedere(tabs,t)}else tabs.scrollLeft=D.tabs;D.tabs=tabs.scrollLeft}
  if(banda){if(fila==='data'&&D.fila!=='data'){const b=banda.querySelector('[data-so="asc"]'),g=b&&b.closest('.pg-grup');if(g)inVedere(banda,g,true)}
    else if(D.banda[fila]!=null)banda.scrollLeft=D.banda[fila];
    D.banda[fila]=banda.scrollLeft}
  D.fila=fila;
  const ing=w.querySelector('.pg-ingust');if(ing){const t=fila==='data'?TXT_DATA:TXT_ALTA;if(ing.textContent!==t)ing.textContent=t}}
/* regula 20 (ținte de cel puțin 32 px pe telefon): în panglica foii (scalată), butoanele mici A→Z / Z→A au 20 px. Pe
   ecranul cu deget le facem 34 × 34, unul sub altul, în aceeași ordine ca în Excel, și împingem restul grupului
   Sort & Filter cu 14 px spre dreapta (grupul se lățește). Pe ecranul cu mouse rămân ca în Excel. */
function mareste(body){if(!eDeget())return;
  const a=body.querySelector('#xwrap [data-so="asc"]');const g=a&&a.closest('.pg-grup');if(!g||g.dataset.xsMare)return;g.dataset.xsMare='1';
  const slot=k=>{const b=g.querySelector(`[data-so="${k}"]`);return b?b.parentElement:null};
  const pune=(el,l,t,w,h)=>{if(!el)return;el.style.left=l+'px';el.style.top=t+'px';el.style.width=w+'px';el.style.height=h+'px';const b=el.firstElementChild;if(b){b.style.width='100%';b.style.height='100%'}};
  const sa=slot('asc'),sd=slot('desc'),sg=slot('dlg');
  g.querySelectorAll('.pg-slot').forEach(x=>{if(x===sa||x===sd||x===sg)return;const l=parseFloat(x.style.left)||0;x.style.left=(l+14)+'px'});
  pune(sa,4,2,34,34);pune(sd,4,40,34,34);if(sg)sg.style.left=((parseFloat(sg.style.left)||0)+14)+'px';
  const W=parseFloat(g.style.width)||0;if(W)g.style.width=(W+14)+'px'}

function leaga(body){
  /* butonul ascuns al instantaneului (Anulare): motorul îl leagă la fiecare desen (Q_('[data-rb]') -> aplica -> salveaza);
     #body se golește la fiecare exercițiu nou, deci butonul se pune din nou la fiecare foaie */
  if(!body.querySelector('button[data-rb="xs:snap"]')){const sb=document.createElement('button');sb.type='button';sb.hidden=true;sb.dataset.rb='xs:snap';sb.tabIndex=-1;sb.setAttribute('aria-hidden','true');body.appendChild(sb)}
  if(body._xs)return;body._xs=1;leagaGlobale();
  /* A: glisarea elevului pe bara cu file / pe panglică se ține minte (evenimentul scroll nu urcă, dar se prinde la captură) */
  body.addEventListener('scroll',ev=>{const t=ev.target,ctx=CTX.get(body);if(!ctx||!ctx.der||!t||!t.matches)return;
    if(t.matches('#xwrap .rb .tabs'))ctx.der.tabs=t.scrollLeft;else if(t.matches('#xwrap .pg-banda'))ctx.der.banda[ctx.der.fila||'']=t.scrollLeft},true);
  body.addEventListener('click',ev=>{const t=ev.target;if(!t||!t.closest)return;const ctx=CTX.get(body);if(!ctx||ctx.inchis)return;
    const so=t.closest('#xwrap [data-so]');
    const hm=t.closest('#xwrap [data-nesim="SortFilterMenu"]');
    if((so||hm)&&inScriere(body)){ev.stopPropagation();ev.preventDefault();nota(body,'Termină întâi scrierea în celulă: apasă Enter (sau Esc), apoi butonul de sortare.');return}
    if(so){ev.stopPropagation();ev.preventDefault();const k=so.dataset.so;if(k==='dlg')deschideSort(body);else butonSort(body,k);return}
    if(hm){ev.stopPropagation();ev.preventDefault();if(M)inchideMeniu();else meniuHome(body,hm)}},true)}

/* 7. testele numite */
function rand(S,get,z,r){const o=[];for(let c=z.c1;c<=z.c2;c++){const x=get(adr(c,r));o.push(x.t==='gol'?'':x.t==='num'?x.v.toFixed(6):String(x.v).toLowerCase())}return o.join('|')}
function zonaTest(Q,T){const zt=(T&&T.zona)||((Q.verifica||{}).sortat||{}).zona;if(!zt)return null;const [a,b]=zt.split(':').map(pos);return {c1:a.c,r1:a.r,c2:b.c,r2:b.r}}
function testOk(S,Q,T){const z=zonaTest(Q,T);if(!z)return false;const get=valori(S.RAW),g0=valori(Object.assign({},Q.cells||{}));
  const antet=((Q.verifica||{}).sortat||{}).antet!==false,r0=antet?z.r1+1:z.r1;
  if(T.antet)return S.gest.has('sortare')&&rand(S,get,z,z.r1)===rand(S,g0,z,z.r1);   // bifat abia după o sortare
  if(T.intregi&&!T._intern&&!S.gest.has('sortare'))return false;   // bifat abia după o sortare
  if(T.intregi){const acum=[],ini=[];for(let r=r0;r<=z.r2;r++){acum.push(rand(S,get,z,r));ini.push(rand(S,g0,z,r))}
    return acum.sort().join('\n')===ini.sort().join('\n')}
  if(T.ordonat){const chei=T.ordonat.map(k=>({c:pos(k.col+'1').c,ord:k.ord}));
    for(let r=r0+1;r<=z.r2;r++){for(const k of chei){const d=compara(get(adr(k.c,r-1)),get(adr(k.c,r)),k.ord);if(d<0)break;if(d>0)return false}}
    /* și nu „ordonat” pe un tabel stricat: rândurile trebuie să fie tot cele de la început */
    return testOk(S,Q,{intregi:true,zona:T.zona,_intern:true})}
  return false}
function teste(body,Q,w){const box=document.createElement('div');box.className='xs-teste';box.setAttribute('aria-live','polite');body.insertBefore(box,w);
  const f=()=>{const S=stareDe(body);if(!S)return;const rez=Q.teste.map(T=>({ce:T.ce,ok:testOk(S,Q,T)}));const n=rez.filter(x=>x.ok).length;
    box.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xs-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`};
  f();new MutationObserver(f).observe(w,{childList:true,subtree:true,characterData:true})}

/* C (registru_j1.md): motorul (tip-excel.js, neatins) spune la „Verifică” aceeași frază pentru orice tabel ale cărui rânduri
   de sub antet nu mai sunt cele de la început. Dar la o listă al cărei titlu Excel nu l-a recunoscut (lista „Nume”,
   „Carte, Autor”), rândurile sunt toate întregi: doar titlul a ajuns printre date. Aici fraza se înlocuiește cu cauza
   adevărată, aflată din foaie; la desperecherea adevărată rămâne o frază fără „elev” (la lista de cărți nu sunt elevi). */
const MSG_MOTOR='Rândurile s-au amestecat: un elev a rămas cu datele altuia. La sortare selectezi TOT tabelul (sau doar o celulă din el), nu o singură coloană.';
function mesajSortare(body,Q){const S=stareDe(body),V=(Q.verifica||{}).sortat;if(!S||!V)return null;
  const [a,b]=V.zona.split(':').map(pos);if(!a||!b)return null;const z={c1:a.c,c2:b.c,r1:a.r,r2:b.r};
  const get=valori(S.RAW),g0=valori(Object.assign({},Q.cells||{})),acum=[],ini=[];
  for(let r=z.r1;r<=z.r2;r++){acum.push(rand(S,get,z,r));ini.push(rand(S,g0,z,r))}
  const intregi=acum.slice().sort().join('\n')===ini.slice().sort().join('\n');
  if(intregi&&V.antet!==false&&acum[0]!==ini[0]){const t=[];for(let c=z.c1;c<=z.c2;c++){const x=g0(adr(c,z.r1));if(x.t!=='gol')t.push(String(x.v))}
    return `Titlul de pe rândul ${z.r1+1} („${esc(t.join(', '))}”) a ajuns printre date: Excel nu l-a recunoscut ca rând de antet. Rândurile în sine sunt întregi. Apasă Ctrl+Z (pe telefon, ↶), apoi fila Date (Data) › butonul mare Sortare (Sort) și bifează My data has headers (Datele mele au anteturi).`}
  return 'Rândurile s-au desperecheat: unele valori au ajuns pe rândul altuia. Apasă Ctrl+Z (pe telefon, ↶). Dacă ai ales Continue with the current selection, repetă sortarea din coloana selectată: când apare Sort Warning, alege Expand the selection. Altfel, fă clic pe o singură celulă din tabel și sortează din nou. Dacă selectezi doar unele coloane, Excel le mută numai pe ele.'}

const ExcelS={
  render(Q,body,api){css();const ctx={Q,alegere:'extinde',dlg:null,sd:null,ultima:null,inchis:false,der:null};CTX.set(body,ctx);
    if(eDeget())body.classList.add('xs-deget');
    const areT=Array.isArray(Q.teste)&&Q.teste.some(T=>T.intregi||T.antet||T.ordonat);
    const api2=Object.assign({},api,{resolve:(ok,msg)=>{if(ok){ctx.inchis=true;inchideMeniu();const d=body.querySelector('.xs-loc');if(d)d.innerHTML=''}
      else if(typeof msg==='string'&&msg.includes(MSG_MOTOR)){const m=mesajSortare(body,Q);if(m)msg=msg.replace(MSG_MOTOR,m)}
      return api.resolve(ok,msg)}});
    window.ExcelX.render(areT?Object.assign({},Q,{teste:undefined}):Q,body,api2);
    const w=body.querySelector('#xwrap');if(!w)return;leaga(body);{const S=stareDe(body);if(S)S.draw()}   // desenul leagă butonul ascuns
    if(areT)teste(body,Q,w);
    titluri(body);new MutationObserver(()=>titluri(body)).observe(w,{childList:true})},
  rezolva(Q,body,api){const ctx=CTX.get(body);if(ctx){ctx.sd=null;const d=body.querySelector('.xs-loc');if(d)d.innerHTML=''}return window.ExcelX.rezolva(Q,body,api)},
  /* greșeala tipică: sortată DOAR coloana-criteriu (rândurile se desperechează); la o listă de o coloană, antetul sortat printre nume */
  gresit(Q,body,api){const S=stareDe(body),V=(Q.verifica||{}).sortat;
    if(S&&V){const [a,b]=V.zona.split(':').map(pos);const k=V.dupa[0];const c=pos(k.col+'1').c;
      if(a.c===b.c){const z={c1:a.c,c2:b.c,r1:a.r,r2:b.r};const {r0,rand}=ordoneaza(S,z,[{c,ord:k.ord}],false);scrieRanduri(S,z,r0,rand)}
      else{const z={c1:c,c2:c,r1:a.r+1,r2:b.r};const {r0,rand}=ordoneaza(S,z,[{c,ord:k.ord}],false);scrieRanduri(S,z,r0,rand)}
      S.draw();return}
    return window.ExcelX.gresit(Q,body,api)}
};
window.ExcelS=ExcelS;
window.ExcelSortare={compara,valori,ordoneaza,antetGhicit,regiune};
})();
