/* lectii/_sim/excelx-grafic.js — extensia „grafice (diagrame)” a foii excelx (lecția VIII / M2 / nr. 11).
   PROPRIETAR: autorul lecției VIII/11. NU schimbă excelx.js (lecția 5), extensiile altor lecții și nici motorul
   (_motor/tip-foaie.js, tip-excel.js). ÎNCĂRCARE, în ordine: motor.js, tip-foaie.js, tip-excel.js, ../../_sim/excelx.js,
   ../../_sim/excelx-grafic.js; apoi tipuri:{excelx:ExcelG}. O folosesc și lecțiile VIII/12 (excelx-proiect.js) și VIII/13:
   interfața publică (ExcelG.render/rezolva/gresit, ExcelGrafic.analiza/date/stare/titlu/verifica/regiune, câmpurile
   start/grafic/teste/solutie) rămâne aceeași; ce s-a adăugat la reparare e compatibil înapoi.
   Graficul din tip-excel.js (GRAF) NU e folosit: lua mereu coloanele ca serii și prima coloană ca etichete, fără Comutare
   rând/coloană, fără legendă/etichete pornite-oprite, fără bară și fără schimbarea tipului.

   TOT CE FACE GRAFICUL E PROBAT ÎN EXCEL REAL (Microsoft 365, build 20326, interfața în engleză, setări regionale
   românești), pe o instanță nouă pe un desktop ascuns: lectii/viii/m2-l11/_proba/proba_grafic*.json (autorul 1),
   _proba/r1_excel*.json (reparare 1, clicuri de mouse și taste reale), _verificare/j1_*.json și ab_sonnet/arbitru_*.json
   (judecătorii). Pe scurt:
   1. Inserarea din panglică dă exact ce dă Shapes.AddChart2(..., NewLayout=True); după inserare graficul e ales și se
      deschide fila Chart Design. CU GRAFICUL ALES, un buton din Inserare NU face încă un grafic: îi schimbă tipul
      (j1_insert_ales.json). Doar cu graficul neales apare al doilea grafic (aici: îl înlocuiește, cu mesaj).
   2. ZONA: o singură celulă -> tot blocul de celule pline din jur; un rând gol inclus = o categorie goală; o celulă goală
      departe de date -> o diagramă goală. Coloane (sau rânduri) ÎNTREGI selectate -> Excel ia doar partea folosită a foii
      (arbitru_zone.json: A:C -> 8A și 8B pe luni; A:B -> Cărți citite pe nume).
   3. ETICHETELE: prima coloană (sub primul rând) e de nume dacă e TOATĂ text; primul rând e antet dacă e TOT text; dacă
      celula din colț e GOALĂ, primul rând și prima coloană sunt nume (și anii-numere). Anii-numere sub antetul „Anul”
      devin a doua serie (categoriile: 1, 2, 3, 4). Fără antet: „Series1”; fără coloana de nume: categoriile 1, 2, 3…
   4. SERIILE: dacă partea de DATE are mai multe rânduri decât coloane, fiecare coloană e o serie; altfel (și la egalitate)
      fiecare rând (r1_excel2.json: 4 clase × 3 zile -> zilele sunt serii; 3 × 3 note -> elevii sunt serii).
   5. CE APARE SINGUR: o serie cu nume -> titlul = numele seriei, fără legendă; o serie fără nume sau mai multe serii ->
      „Chart Title” și legenda jos; radialul -> titlul = numele PRIMEI serii, legenda jos (categoriile), doar prima serie.
   6. TITLUL (r1_excel.json › titlu_clicuri): UN clic îl alege; ce scrii apoi + Enter înlocuiește tot titlul. Al DOILEA
      clic pune cursorul în text: ce scrii se adaugă acolo („CharAbct Title”), Enter face un rând nou, Esc lasă textul
      scris; un clic pe o celulă îl păstrează, iar un singur clic pe titlu + scris îl înlocuiește iar tot.
   7. Comutare rând/coloană: seriile devin categorii și invers; încă o apăsare revine. O singură serie cu titlul pus
      automat: după comutare titlul dispare, la revenire apare iar.
   8. Schimbarea tipului: titlul tău, legenda și etichetele rămân; etichetele iau locul implicit al noului tip
      (coloane -> linie: Right; linie -> coloane: Outside End).
   9. Schimbi o valoare în tabel -> coloana/punctul și eticheta se schimbă singure; ștergi o valoare -> dispare.
   10. Bara (Clustered Bar) pune prima categorie JOS.
   11. CLICUL ALEGE O PARTE, iar Delete șterge DOAR partea aleasă (r1_excel.json › delete_dupa_clic, arbitru_delete.json):
      marginea albă -> tot graficul (Delete îl șterge); o coloană sau linia -> toată seria (Delete șterge seria); zona de
      desen -> nimic; titlul -> titlul; legenda -> legenda; numerele din stânga -> axa (Delete o șterge); o etichetă ->
      etichetele acelei serii. Comanda Undo după ștergerea unei serii o aduce înapoi, dar „Chart Title” dispare
      (r1_excel2.json). Graficul se MUTĂ doar trăgând de marginea albă; tras din mijloc nu se mișcă (j1_plus.json).
   12. AXA cu numere (j1_fapte, r1_excel2): pornește de la 0, afară de valorile apropiate ((max-min)/max < 1/6: min - (max-min)/2);
      sus: max + 5% din (max - min), rotunjit la pas; pasul = cel mai mic dintre 1, 2, 5 × 10^n cu cel mult 10 intervale
      (la bare, pe orizontală, cel mult 7). Ex.: 120…140 -> 110…145 din 5 în 5; 3…9 -> 0…10 din 1 în 1; la bare 0…10 din 2.
   13. Etichetele de date: Data Labels are alte locuri după tip (j1_submeniu.json): coloane None, Center, Inside End,
      Inside Base, Outside End, Data Callout; linie None, Center, Left, Right, Above, Below, Data Callout; radial None,
      Center, Inside End, Outside End, Best Fit, Data Callout. Bifa (SetElement 201) pune: coloane și bare Outside End,
      linie Right, radial Best Fit (r1_excel.json › eticheta_implicita). Bara: lista de la coloane (lista ei NEPROBATĂ).
   Numele din meniuri: Add Chart Element › Chart Title (None, Above Chart, Centered Overlay), Legend (None, Right, Top,
   Left, Bottom). Românește doar ce scrie Microsoft ro-ro (vezi lectii/viii/m2-l11/surse.md).
   ABATERI SPUSE PE ECRAN: graficul apare SUB foaie, nu peste ea; un al doilea grafic (făcut cu primul neales) îl
   înlocuiește pe primul; „Diagrame recomandate” și variantele 3-D/stratificate nu se fac aici; panoul „+” (Chart Elements)
   are doar cele trei bife ale lecției; pe telefon, tasta Delete e un buton sub grafic. NESPUSE, mici: etichetele de jos
   lungi se rup pe două rânduri, iar dacă un cuvânt nu încape se rotesc la 45°; locul cursorului la al doilea clic pe titlu e aproximat.

   CÂMPURI pe întrebare: start:{zona,tip,plot?,titlu?,et?,leg?,w?,x?,y?} (grafic deja făcut), grafic:{zona, tip (sau
   listă), serii:[nume…], categorii:[…], oSerie, titlu, etichete, legenda, latimeMin, mesajTip} = ce trebuie să fie la
   „Verifică”; teste:[{ce, grafic:{…o parte…}}] = testele numite, bifate pe loc; solutie:{gol:[…], valori:{…}} = ce
   schimbă rezolvarea în foaie înainte de grafic (ex. golește A1). Fără start/grafic, foaia e cea din excelx.js.
   STAREA unui grafic (G): tip, zona, plot, titlu{mod:'loc'|'auto'|'tau'|'ascuns',text}, leg, et, x, y, w, h, sel (ales),
   parte (ce e ales: 'grafic'|'titlu'|'trasare'|'leg'|'axaV'|'axaC'|'serie:<cheie>'|'et:<cheie>'), sterse:[cheie],
   etAscunse:[cheie], faraAxaV, faraAxaC; cheia unei serii = 'c'+coloana sau 'r'+rândul ei din foaie. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CUL=['#4F81BD','#C0504D','#9BBB59','#8064A2','#4BACC6','#F79646','#2C4D75','#772C2A','#5F7530'];
const LOC='Titlu diagramă (Chart Title)';
const IC={col:'<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true" style="vertical-align:-2px"><rect x="1" y="7" width="3" height="7" fill="#4F81BD"/><rect x="6" y="2" width="3" height="12" fill="#4F81BD"/><rect x="11" y="5" width="3" height="9" fill="#4F81BD"/></svg>',
  line:'<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true" style="vertical-align:-2px"><path d="M1 12 L6 6 L10 9 L15 2" fill="none" stroke="#4F81BD" stroke-width="2"/></svg>',
  pie:'<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style="vertical-align:-2px"><circle cx="7" cy="7" r="6" fill="#9BBB59"/><path d="M7 7 L7 1 A6 6 0 0 1 13 7 Z" fill="#4F81BD"/></svg>'};
const NUME={column:'cu coloane (Coloană grupată, Clustered Column)',bar:'cu bare (Clustered Bar)',line:'linie (Line)',pie:'radial (Pie)'};
const SCURT={column:'coloane',bar:'bare',line:'linie',pie:'radial'};
/* locurile etichetelor de date, după tip (j1_submeniu.json), și locul pus de bifă (r1_excel.json › eticheta_implicita) */
const ETP={column:['centru','int','baza','ext','bula'],bar:['centru','int','baza','ext','bula'],line:['centru','stanga','dreapta','sus','jos','bula'],pie:['centru','int','ext','potrivit','bula']};
const ETI={column:'ext',bar:'ext',line:'dreapta',pie:'potrivit'};
const ETN={centru:'Center',int:'Inside End',baza:'Inside Base',ext:'Capăt exterior (Outside End)',bula:'Data Callout',stanga:'Left',dreapta:'Right',sus:'Above',jos:'Below',potrivit:'Best Fit'};
const etPentru=(tip,et)=>!et?null:(ETP[tip]||ETP.column).includes(et)?et:(ETI[tip]||'ext');
const COL=i=>String.fromCharCode(65+i),adr=(c,r)=>COL(c)+(r+1);
function pz(z){const m=String(z||'').toUpperCase().replace(/\$/g,'').match(/^([A-Z])(\d+)(?::([A-Z])(\d+))?$/);if(!m)return null;
  const a={c:m[1].charCodeAt(0)-65,r:+m[2]-1},b=m[3]?{c:m[3].charCodeAt(0)-65,r:+m[4]-1}:a;
  return {c1:Math.min(a.c,b.c),c2:Math.max(a.c,b.c),r1:Math.min(a.r,b.r),r2:Math.max(a.r,b.r)}}
const zs=z=>adr(z.c1,z.r1)+':'+adr(z.c2,z.r2);
const norm=s=>String(s??'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”"“«»]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const fmt=v=>v==null?'':String(Math.round(v*100)/100).replace('.',',');
const numRO=t=>{const s=String(t).replace(/\s|lei|%/gi,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');return s===''?NaN:Number(s)};
const range=(a,b)=>{const o=[];for(let i=a;i<=b;i++)o.push(i);return o};
const PE_TEL=()=>{try{return matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0}catch(e){return false}};

let cssPus=false;
function css(){if(cssPus)return;cssPus=true;const s=document.createElement('style');s.textContent=`
.xg-pg{border:1px solid var(--line);border-bottom:0;background:var(--paper);border-radius:6px 6px 0 0;padding:4px 6px 2px;font-family:"Segoe UI",system-ui,sans-serif;position:relative}
.xg-file{display:flex;gap:2px;flex-wrap:wrap;border-bottom:1px solid var(--line);margin-bottom:4px}
.xg-file button{border:0;background:none;color:var(--ink);font:500 .86rem "Segoe UI",system-ui,sans-serif;padding:6px 9px;min-height:34px;cursor:pointer;border-bottom:3px solid transparent}
.xg-file button.on{border-bottom-color:#217346;color:#217346;font-weight:700}
.xg-file button.ctx{color:#217346}
.xg-rand{display:flex;gap:6px;flex-wrap:wrap;align-items:stretch}
.xg-grup{display:flex;flex-direction:column;border-right:1px solid var(--line);padding:0 6px 2px 0;min-width:0}
.xg-grup:last-child{border-right:0}
.xg-btns{display:flex;gap:4px;flex-wrap:wrap}
.xg-gn{font-size:.72rem;color:var(--ink2);text-align:center;margin-top:3px}
.xg-b{border:1px solid var(--line);background:var(--paper2);color:var(--ink);border-radius:5px;padding:4px 8px;min-height:36px;min-width:36px;font:500 .8rem/1.15 "Segoe UI",system-ui,sans-serif;cursor:pointer;text-align:left}
.xg-b small{display:block;color:var(--ink2);font-size:.68rem;font-weight:400}
.xg-b[aria-expanded="true"],.xg-b:hover{border-color:#217346}
.xg-b.stins{opacity:.6}
.xg-meniu{position:absolute;z-index:12;left:6px;right:6px;top:100%;background:var(--paper);border:1px solid var(--line);box-shadow:0 6px 18px #0005;border-radius:6px;padding:6px;max-height:70vh;overflow:auto;font-family:"Segoe UI",system-ui,sans-serif}
.xg-meniu h5{margin:6px 4px 3px;font-size:.78rem;color:var(--ink2)}
.xg-meniu button{display:block;width:100%;text-align:left;border:1px solid transparent;background:none;color:var(--ink);padding:7px 9px;min-height:36px;font:.86rem "Segoe UI",system-ui,sans-serif;cursor:pointer;border-radius:4px}
.xg-meniu button:hover,.xg-meniu button:focus{border-color:#217346;background:var(--paper2)}
.xg-meniu button.nu{color:var(--ink2)}
.xg-meniu .sub{margin-left:16px;border-left:2px solid var(--line);padding-left:4px}
.xg-meniu .nota{font-size:.76rem;color:var(--ink2);margin:6px 4px 2px}
.xg-zona{position:relative;border:1px solid var(--line);border-top:0;min-height:230px;background-color:var(--paper);
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:72px 24px;background-position:-1px -1px;overflow:hidden;touch-action:pan-y}
.xg-cap{font:.76rem "Segoe UI",system-ui,sans-serif;color:var(--ink2);margin:3px 2px 8px;line-height:1.35}
.xg-gol{position:absolute;left:0;right:0;top:40%;text-align:center;color:var(--ink2);font:.86rem "Segoe UI",system-ui,sans-serif;pointer-events:none}
.xg-ob{position:absolute;background:#fff;color:#404040;border:1px solid #d9d9d9;box-sizing:border-box;outline:none;touch-action:pan-y;cursor:move}
.xg-ob.sel{border:1px solid #8c8c8c;touch-action:none}
.xg-ob svg{position:absolute;left:0;top:0;width:100%;height:100%;display:block}
.xg-ob svg [data-p]{cursor:default}
.xg-t{position:absolute;left:50%;top:3px;transform:translateX(-50%);max-width:calc(100% - 24px);box-sizing:border-box;text-align:center;font:1.02rem/1.3 "Segoe UI",system-ui,sans-serif;color:#595959;cursor:text;padding:4px 8px;min-height:34px;white-space:pre;overflow:hidden;text-overflow:clip;z-index:2}
.xg-t.sel{outline:1px solid #8c8c8c}
.xg-h{position:absolute;width:32px;height:32px;margin:-16px 0 0 -16px;z-index:3;touch-action:none}
.xg-h::after{content:"";position:absolute;left:10px;top:10px;width:10px;height:10px;border:1.5px solid #4a7ebb;border-radius:50%;background:#fff}
.xg-h[data-h="nw"],.xg-h[data-h="se"]{cursor:nwse-resize}.xg-h[data-h="ne"],.xg-h[data-h="sw"]{cursor:nesw-resize}
.xg-plus{position:absolute;width:34px;height:34px;border:1px solid #bfbfbf;background:#fff;color:#217346;font:700 1.3rem/1 "Segoe UI",system-ui,sans-serif;border-radius:3px;cursor:pointer;z-index:4;padding:0}
.xg-elem{position:absolute;z-index:6;background:var(--paper);color:var(--ink);border:1px solid var(--line);box-shadow:0 6px 18px #0005;border-radius:6px;padding:8px 10px;font:.86rem "Segoe UI",system-ui,sans-serif;width:min(250px,calc(100% - 16px))}
.xg-elem b{display:block;margin-bottom:4px}
.xg-elem label{display:flex;gap:8px;align-items:center;min-height:34px;cursor:pointer}
.xg-elem input{width:20px;height:20px}
.xg-elem .nota{font-size:.74rem;color:var(--ink2)}
.xg-ales{position:absolute;z-index:5;display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-height:34px;font:.8rem "Segoe UI",system-ui,sans-serif;color:var(--ink);background:var(--paper);border-radius:4px;padding:0 4px}
.xg-ales button{min-height:34px;min-width:76px;border:1px solid var(--line);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer;font:600 .84rem "Segoe UI",system-ui,sans-serif}
.xg-fx{position:absolute;left:6px;right:6px;z-index:8;display:flex;gap:4px;align-items:center;background:var(--paper);border:1px solid #217346;border-radius:5px;padding:4px;font-family:"Segoe UI",system-ui,sans-serif;box-shadow:0 4px 12px #0004}
.xg-fx i{color:var(--ink2);padding:0 4px}
.xg-fx input,.xg-fx textarea{flex:1;min-width:0;border:1px solid var(--line);padding:7px;font:.95rem "Segoe UI",system-ui,sans-serif;background:var(--paper);color:var(--ink);resize:none}
.xg-fx button{min-width:36px;min-height:36px;border:1px solid var(--line);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer;font-size:1rem}
.xg-fx .nota{position:absolute;left:4px;right:4px;top:100%;margin-top:3px;font-size:.72rem;color:var(--ink2);background:var(--paper);padding:1px 4px;border-radius:3px}
.xg-dlg{position:absolute;z-index:9;left:50%;top:8px;transform:translateX(-50%);width:min(330px,calc(100% - 12px));background:var(--paper);color:var(--ink);border:1px solid var(--line);box-shadow:0 8px 24px #0006;border-radius:6px;padding:10px;font:.86rem "Segoe UI",system-ui,sans-serif}
.xg-dlg b{display:block;margin-bottom:2px}
.xg-dlg .fila{font-size:.76rem;color:var(--ink2);border-bottom:1px solid var(--line);padding-bottom:4px;margin-bottom:6px}
.xg-dlg .tipuri button{display:block;width:100%;text-align:left;border:1px solid transparent;background:none;color:var(--ink);padding:7px 9px;min-height:36px;font:inherit;cursor:pointer;border-radius:4px}
.xg-dlg .tipuri button.on{border-color:#217346;background:color-mix(in srgb,#217346 14%,var(--paper))}
.xg-dlg .nota{font-size:.74rem;color:var(--ink2);margin:6px 0}
.xg-dlg .jos{display:flex;gap:6px;justify-content:flex-end}
.xg-dlg .jos button{min-width:72px;min-height:36px;border:1px solid var(--line);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer;font:inherit}
.xg-dlg .jos button.ok{background:#217346;border-color:#217346;color:#fff}
.xg-teste{border:1px solid var(--line);border-radius:6px;padding:6px 10px;margin:0 0 8px;background:var(--paper2);font-size:.9rem}
.xg-teste .lbl{font-weight:700;margin-bottom:2px}
.xg-teste ul{margin:0;padding:0;list-style:none}
.xg-teste li{display:flex;gap:6px;padding:2px 0}
.xg-teste li.ok{color:var(--ok)}
.xg-sr{position:absolute;left:-9999px}
.xg-toast{position:absolute;left:8px;right:8px;top:8px;z-index:10;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-left:4px solid #217346;border-radius:5px;padding:8px 10px;font:.84rem "Segoe UI",system-ui,sans-serif;box-shadow:0 4px 12px #0004}
.xg-toast button{margin-top:6px;min-height:34px;min-width:60px;border:1px solid var(--line);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer}
/* regula 20 (ținte de cel puțin 32 px pe telefon), doar în întrebările cu grafic: ↶ ↷, „Copiază tabelul”, celulele */
.xg-host.xg-tel .xl .rb .tabs .qat button{min-width:34px;min-height:34px}
.xg-host.xg-tel [data-copiaza]{min-height:34px}
.xg-host.xg-tel .xl .gw td{height:32px}
`;document.head.appendChild(s)}

/* ================= datele din foaie ================= */
function foaie(body){return body._xlS||(window.JocExcel&&window.JocExcel.render._stare)}
function celula(body,S,a){
  const raw=S.RAW[a],td=body.querySelector(`#xwrap td[data-a="${a}"]`),txt=td?td.textContent.replace(/ /g,' ').trim():'';
  if(raw==null||raw==='')return {t:'gol',txt:''};
  const s=String(raw);
  if(s[0]==='='){if(td&&td.classList.contains('n')){const v=numRO(txt);return isNaN(v)?{t:'text',txt}:{t:'num',v,txt}}return txt?{t:'text',txt}:{t:'gol',txt:''}}
  const c=window.ExcelTipuri?window.ExcelTipuri.citeste(s):null;
  if(c&&c.tip==='num')return {t:'num',v:c.v,txt:txt||fmt(c.v)};
  if(c&&c.tip==='gol')return {t:'gol',txt:''};
  if(!c){const v=numRO(s);if(!isNaN(v))return {t:'num',v,txt:txt||s}}
  return {t:'text',txt:txt||(c&&c.v!=null?String(c.v):s)}}
/* selecția de acum a foii, din celulele colorate (zona) și din celula activă */
function selectia(body){const tds=[...body.querySelectorAll('#xwrap td.z[data-a], #xwrap td.act[data-a]')];if(!tds.length)return null;
  let z=null;tds.forEach(td=>{const p=pz(td.dataset.a);if(!p)return;z=z?{c1:Math.min(z.c1,p.c1),c2:Math.max(z.c2,p.c2),r1:Math.min(z.r1,p.r1),r2:Math.max(z.r2,p.r2)}:p});return z}
/* coloane (sau rânduri) ÎNTREGI selectate -> doar partea folosită a foii, ca în Excel (arbitru_zone.json) */
function intregi(body,S,z){if(!z)return z;const nr=body.querySelectorAll('#xwrap .gw tbody tr').length,nc=Math.max(0,body.querySelectorAll('#xwrap .gw thead th').length-1);
  const totR=nr>1&&z.r1===0&&z.r2>=nr-1,totC=nc>1&&z.c1===0&&z.c2>=nc-1;if(!totR&&!totC)return z;
  let r1=1e9,r2=-1,c1=1e9,c2=-1;Object.keys(S.RAW||{}).forEach(a=>{const p=pz(a);if(!p||S.RAW[a]==null||S.RAW[a]==='')return;r1=Math.min(r1,p.r1);r2=Math.max(r2,p.r2);c1=Math.min(c1,p.c1);c2=Math.max(c2,p.c2)});
  if(r2<0)return z;const o=Object.assign({},z);if(totR){o.r1=Math.max(z.r1,r1);o.r2=Math.min(z.r2,r2)}if(totC){o.c1=Math.max(z.c1,c1);o.c2=Math.min(z.c2,c2)}
  return o.r1>o.r2||o.c1>o.c2?z:o}
/* o singură celulă -> blocul de celule pline din jur (regiunea curentă, cu vecinii pe diagonală), fără margini goale */
function regiune(body,S,z){if(!z)return null;if(!(z.c1===z.c2&&z.r1===z.r2))return z;
  const dim=S.dim?S.dim():{cols:12,rows:30},plin=(c,r)=>c>=0&&r>=0&&c<dim.cols&&r<dim.rows&&celula(body,S,adr(c,r)).t!=='gol';
  let {c1,c2,r1,r2}=z,sch=true;const ban=(c,ra,rb)=>range(ra,rb).some(r=>plin(c,r)),banR=(r,ca,cb)=>range(ca,cb).some(c=>plin(c,r));
  while(sch){sch=false;
    if(ban(c1-1,r1-1,r2+1)){c1--;sch=true}
    if(ban(c2+1,r1-1,r2+1)){c2++;sch=true}
    if(banR(r1-1,c1-1,c2+1)){r1--;sch=true}
    if(banR(r2+1,c1-1,c2+1)){r2++;sch=true}
    c1=Math.max(0,c1);r1=Math.max(0,r1)}
  const golC=c=>!ban(c,r1,r2),golR=r=>!banR(r,c1,c2);
  if(!plin(z.c1,z.r1)&&(c2>c1||r2>r1)){while(c2>c1&&golC(c2))c2--;while(c1<c2&&golC(c1))c1++;while(r2>r1&&golR(r2))r2--;while(r1<r2&&golR(r1))r1++}
  return {c1,c2,r1,r2}}
/* cum citește Excel zona: rând de antet? coloană de etichete? seriile pe coloane sau pe rânduri? */
function analiza(body,S,z){const nr=z.r2-z.r1+1,nc=z.c2-z.c1+1,g=(c,r)=>celula(body,S,adr(c,r)),tl=g(z.c1,z.r1);
  const rand=nc===1?[tl]:range(z.c1+1,z.c2).map(c=>g(c,z.r1)),col=nr===1?[tl]:range(z.r1+1,z.r2).map(r=>g(z.c1,r));
  const tot=a=>{const p=a.filter(x=>x.t!=='gol');return p.length>0&&p.every(x=>x.t==='text')};
  let lr,lc;if(tl.t==='gol'&&nr>1&&nc>1){lr=true;lc=true}else{lr=nr>1&&tot(rand);lc=nc>1&&tot(col)}
  const dr=nr-(lr?1:0),dc=nc-(lc?1:0);return {lr,lc,dr,dc,implicit:dr>dc?'col':'row',gol:dr<=0||dc<=0||(nr===1&&nc===1&&tl.t==='gol')}}
/* seriile și categoriile de acum; o serie ștearsă (Delete pe ea) iese din grafic: cheia ei e coloana ('c3') sau rândul ('r2'),
   deci după Comutare rând/coloană iese din categorii */
function date(body,S,G){const z=pz(G.zona);if(!z)return {cats:[],serii:[]};const an=G.an||analiza(body,S,z);if(an.gol)return {cats:[],serii:[],an};
  const g=(c,r)=>celula(body,S,adr(c,r)),val=x=>x.t==='num'?x.v:x.t==='text'?0:null,serii=[],st=G.sterse||[];let cats;
  if(G.plot==='col'){const r0=z.r1+(an.lr?1:0),c0=z.c1+(an.lc?1:0),rs=range(r0,z.r2).filter(r=>!st.includes('r'+r));
    cats=rs.map(r=>an.lc?g(z.c1,r).txt:String(r-r0+1));
    range(c0,z.c2).filter(c=>!st.includes('c'+c)).forEach(c=>serii.push({nume:an.lr?g(c,z.r1).txt:'',cheie:'c'+c,nr:c-c0,v:rs.map(r=>val(g(c,r)))}))}
  else{const c0=z.c1+(an.lc?1:0),r0=z.r1+(an.lr?1:0),cs=range(c0,z.c2).filter(c=>!st.includes('c'+c));
    cats=cs.map(c=>an.lr?g(c,z.r1).txt:String(c-c0+1));
    range(r0,z.r2).filter(r=>!st.includes('r'+r)).forEach(r=>serii.push({nume:an.lc?g(z.c1,r).txt:'',cheie:'r'+r,nr:r-r0,v:cs.map(c=>val(g(c,r)))}))}
  return {cats,serii,an}}
const numeSerie=(s,k)=>s.nume||('Series'+(k+1));
function titluAfisat(G,d){const t=G.titlu||{mod:'loc'};if(t.mod==='ascuns')return null;if(t.mod==='tau')return t.text;if(t.mod==='loc')return LOC;
  const n=G.tip==='pie'?(d.serii[0]&&d.serii[0].nume):(d.serii.length===1?d.serii[0].nume:'');return n||null}
const cuEt=(G,s)=>!!G.et&&!(G.etAscunse||[]).includes(s.cheie);

/* ================= desenul (SVG), ca un grafic Excel cu stilul implicit ================= */
/* axa cu numere, ca în Excel (j1_fapte_rezumat.txt, r1_excel2.json): vezi punctul 12 din antet */
function scala(vals,maxN){maxN=maxN||10;if(!vals.length)return {bot:0,top:1,t:[0,1]};
  const lo=Math.min(...vals),hi=Math.max(...vals),span=hi-lo;
  let bot=Math.min(0,lo),top=Math.max(0,hi);
  if(lo>0&&span/hi<1/6)bot=lo-span/2;
  if(hi<0&&span/Math.abs(lo)<1/6)top=hi+span/2;
  if(hi>0)top=hi+0.05*span;if(lo<0)bot=Math.min(bot,lo-0.05*span);
  if(top<=bot){top=bot+Math.max(1,Math.abs(bot)*0.1)}
  const p0=Math.pow(10,Math.floor(Math.log10((top-bot)/maxN))-1);let k=p0,b,t;
  for(let e=0;e<12;e++){for(const m of [1,2,5]){k=m*p0*Math.pow(10,e);b=Math.floor(bot/k+1e-9)*k;t=Math.ceil(top/k-1e-9)*k;if((t-b)/k<=maxN+1e-9){e=99;break}}}
  const tk=[];for(let v=b;v<=t+k*1e-6;v+=k)tk.push(Math.round(v*1e6)/1e6);return {bot:b,top:t,t:tk}}
const lat=(s,f)=>String(s).length*f*0.56;
function taie(s,max,f){s=String(s);if(lat(s,f)<=max)return s;let o=s;while(o.length>1&&lat(o,f)>max)o=o.slice(0,-1);return o}
const f1=v=>Number(v).toFixed(1);
const tinta=(x,y,w,h,p,k)=>`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(1,w))}" height="${f1(Math.max(1,h))}" fill="#fff" fill-opacity="0" pointer-events="all" data-p="${p}"${k?` data-k="${k}"`:''}/>`;
const contur=(x,y,w,h)=>`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0,w))}" height="${f1(Math.max(0,h))}" fill="none" stroke="#7f7f7f" stroke-dasharray="3 2" pointer-events="none"/>`;
const manere=pts=>pts.map(([x,y])=>`<rect x="${f1(x-3)}" y="${f1(y-3)}" width="6" height="6" fill="#fff" stroke="#4a7ebb" stroke-width="1.2" pointer-events="none"/>`).join('');
function desenSVG(G,d,W,H,tH){
  let o='';const fs=W<330?9.5:11,legF=W<330?9.5:11;const ser=G.tip==='pie'?d.serii.slice(0,1):d.serii;
  const P=G.sel?(G.parte||'grafic'):'',ET=etPentru(G.tip,G.et);
  const legItems=!G.leg?[]:G.tip==='pie'?(d.cats.map((c,i)=>({t:c,cul:CUL[i%CUL.length]}))):ser.map((s,k)=>({t:numeSerie(s,k),cul:CUL[k%CUL.length]}));
  let L=10,R=W-10,T=tH?tH+4:14,B=H-8;
  if(G.leg&&legItems.length){let bx;
    if(G.leg==='jos'||G.leg==='sus'){const tot=legItems.reduce((a,x)=>a+lat(x.t,legF)+22,0);let x=Math.max(L,(W-tot)/2);const y=G.leg==='jos'?B-6:T+8;
      bx=[x-4,y-12,Math.min(tot,W-2*L)+4,16];let s='';
      legItems.forEach(it=>{s+=`<rect x="${f1(x)}" y="${f1(y-8)}" width="8" height="8" fill="${it.cul}" pointer-events="none"/><text x="${f1(x+11)}" y="${f1(y)}" font-size="${legF}" fill="#595959" pointer-events="none">${esc(it.t)}</text>`;x+=lat(it.t,legF)+22});
      o+=tinta(...bx,'leg')+s;
      if(G.leg==='jos')B-=22;else T+=22}
    else{const lw=Math.min(W*0.32,Math.max(...legItems.map(x=>lat(x.t,legF)))+20);const x=G.leg==='dreapta'?R-lw+4:L;let y=(T+B)/2-legItems.length*8;
      bx=[x-3,y-12,lw,legItems.length*16+4];let s='';
      legItems.forEach(it=>{s+=`<rect x="${f1(x)}" y="${f1(y-8)}" width="8" height="8" fill="${it.cul}" pointer-events="none"/><text x="${f1(x+11)}" y="${f1(y)}" font-size="${legF}" fill="#595959" pointer-events="none">${esc(taie(it.t,lw-14,legF))}</text>`;y+=16});
      o+=tinta(...bx,'leg')+s;
      if(G.leg==='dreapta')R-=lw;else L+=lw}
    if(P==='leg')o+=contur(...bx)}
  if(!ser.length)return o;
  const culS=(s,k)=>CUL[k%CUL.length];
  if(G.tip==='pie'){const s=ser[0],tot=s.v.reduce((a,b)=>a+Math.max(0,b||0),0);const cx=(L+R)/2,cy=(T+B)/2,Rr=Math.max(10,Math.min(R-L,B-T)/2-4);
    o+=tinta(cx-Rr-2,cy-Rr-2,2*Rr+4,2*Rr+4,'trasare');if(P==='trasare')o+=contur(cx-Rr-2,cy-Rr-2,2*Rr+4,2*Rr+4);
    if(tot<=0)return o;let u=-Math.PI/2;const sel=P==='serie:'+s.cheie,pts=[],et=[];
    s.v.forEach((v,i)=>{const a=Math.max(0,v||0)/tot*2*Math.PI;if(a<=0)return;const x1=cx+Rr*Math.cos(u),y1=cy+Rr*Math.sin(u),m=u+a/2;u+=a;const x2=cx+Rr*Math.cos(u),y2=cy+Rr*Math.sin(u);
      o+=a>=2*Math.PI-1e-6?`<circle cx="${cx}" cy="${cy}" r="${Rr}" fill="${CUL[i%CUL.length]}" data-p="serie" data-k="${s.cheie}"/>`:`<path d="M${f1(cx)},${f1(cy)} L${f1(x1)},${f1(y1)} A${f1(Rr)},${f1(Rr)} 0 ${a>Math.PI?1:0} 1 ${f1(x2)},${f1(y2)} Z" fill="${CUL[i%CUL.length]}" stroke="#fff" stroke-width="1.5" data-p="serie" data-k="${s.cheie}"/>`;
      pts.push([cx+Rr*0.6*Math.cos(m),cy+Rr*0.6*Math.sin(m)]);
      if(cuEt(G,s)){const k=ET==='ext'||ET==='bula'?1.12:ET==='centru'?0.5:ET==='int'?0.78:(a>0.5?0.65:1.12),tx=cx+Rr*k*Math.cos(m),ty=cy+Rr*k*Math.sin(m)+4;
        et.push([tx,ty]);o+=`<text x="${f1(tx)}" y="${f1(ty)}" font-size="${fs}" text-anchor="middle" fill="${k>1?'#404040':'#fff'}" font-weight="600" data-p="et" data-k="${s.cheie}">${fmt(v)}</text>`}});
    if(sel)o+=manere(pts);if(P==='et:'+s.cheie)et.forEach(([x,y])=>o+=contur(x-12,y-11,24,14));
    return o}
  const toate=ser.flatMap(s=>s.v.filter(v=>v!=null));const n=Math.max(1,d.cats.length);
  if(G.tip==='bar'){const sc=scala(toate,7);
    const catW=G.faraAxaC?6:Math.min(W*0.3,Math.max(...d.cats.map(c=>lat(c,fs)),8)+8);const x0=L+catW,x1=R-8,y0=T,y1=B-(G.faraAxaV?4:16);
    const X=v=>x0+(v-sc.bot)/(sc.top-sc.bot)*(x1-x0),bh=(y1-y0)/n;
    o+=tinta(x0,y0,x1-x0,y1-y0,'trasare');
    sc.t.forEach(v=>{o+=`<line x1="${f1(X(v))}" x2="${f1(X(v))}" y1="${y0}" y2="${y1}" stroke="#d9d9d9" pointer-events="none"/>`;
      if(!G.faraAxaV){const tw=lat(fmt(v),fs);o+=tinta(X(v)-tw/2-2,y1+2,tw+4,14,'axaV')+`<text x="${f1(X(v))}" y="${y1+13}" font-size="${fs}" text-anchor="middle" fill="#595959" pointer-events="none">${fmt(v)}</text>`}});
    if(!G.faraAxaC)d.cats.forEach((c,i)=>{const yc=y1-bh*i-bh/2,tx=taie(c,catW-6,fs);o+=tinta(x0-5-lat(tx,fs)-2,yc-8,lat(tx,fs)+4,15,'axaC')+`<text x="${x0-5}" y="${f1(yc+4)}" font-size="${fs}" text-anchor="end" fill="#595959" pointer-events="none">${esc(tx)}</text>`});
    if(P==='trasare')o+=contur(x0,y0,x1-x0,y1-y0);if(P==='axaV')o+=contur(x0-8,y1+1,x1-x0+16,15);if(P==='axaC')o+=contur(L,y0,catW-2,y1-y0);
    const w=bh*0.62/ser.length;
    ser.forEach((s,k)=>{const pts=[],et=[];s.v.forEach((v,i)=>{if(v==null)return;const yb=y1-bh*i-bh*0.19-w*(k+1);const xa=X(Math.min(0,v)),xb=X(Math.max(0,v));
      o+=`<rect x="${f1(xa)}" y="${f1(yb)}" width="${f1(Math.max(0,xb-xa))}" height="${f1(w)}" fill="${culS(s,k)}" data-p="serie" data-k="${s.cheie}"/>`;pts.push([xb,yb+w/2]);
      if(cuEt(G,s)){const xt=ET==='centru'?(xa+xb)/2:ET==='int'?xb-4:ET==='baza'?xa+4:xb+4,an=ET==='centru'?'middle':ET==='int'?'end':'start';et.push([xt,yb+w/2]);
        o+=`<text x="${f1(xt)}" y="${f1(yb+w/2+4)}" font-size="${fs}" text-anchor="${an}" fill="${ET==='ext'||ET==='bula'?'#404040':'#fff'}" data-p="et" data-k="${s.cheie}">${fmt(v)}</text>`}});
      if(P==='serie:'+s.cheie)o+=manere(pts);if(P==='et:'+s.cheie)et.forEach(([x,y])=>o+=contur(x-12,y-7,24,14))});
    return o}
  const sc=scala(toate,10);
  const yL=G.faraAxaV?4:Math.max(...sc.t.map(v=>lat(fmt(v),fs)))+6;const x0=L+yL,x1=R-4,bw=(x1-x0)/n;
  let rot=false,two=false,catH=G.faraAxaC?4:16;
  const dez=c=>{const w=String(c).split(' ');if(w.length<2)return [String(c)];let best=null;for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(' '),b=w.slice(i).join(' '),m=Math.max(lat(a,fs),lat(b,fs));if(!best||m<best.m)best={m,l:[a,b]}}return best.l};
  if(!G.faraAxaC){const mx=Math.max(0,...d.cats.map(c=>lat(c,fs)));if(mx>bw-2){
    if(d.cats.every(c=>Math.max(...dez(c).map(x=>lat(x,fs)))<=bw-2)){two=true;catH=30}   // ca Excel: eticheta lungă se rupe la spațiu pe două rânduri, întreagă (judecata 2, I)
    else{rot=true;catH=Math.min((B-T)*0.5,mx*0.72+12)}}}   // un cuvânt singur nu încape: se rotește, fără să se taie decât în ultimă instanță
  const y0=T+2,y1=B-catH;
  const Y=v=>y1-(v-sc.bot)/(sc.top-sc.bot)*(y1-y0);
  o+=tinta(x0,y0,x1-x0,y1-y0,'trasare');
  sc.t.forEach(v=>{o+=`<line x1="${x0}" x2="${x1}" y1="${f1(Y(v))}" y2="${f1(Y(v))}" stroke="#d9d9d9" pointer-events="none"/>`;
    if(!G.faraAxaV){const tw=lat(fmt(v),fs);o+=tinta(x0-6-tw,Y(v)-7,tw+4,14,'axaV')+`<text x="${x0-4}" y="${f1(Y(v)+4)}" font-size="${fs}" text-anchor="end" fill="#595959" pointer-events="none">${fmt(v)}</text>`}});
  if(!G.faraAxaC)d.cats.forEach((c,i)=>{const xc=x0+bw*i+bw/2;
    if(two){const ls=dez(c),tw=Math.max(...ls.map(x=>lat(x,fs)));o+=tinta(xc-tw/2-2,y1+2,tw+4,catH-2,'axaC')+`<text x="${f1(xc)}" y="${y1+13}" font-size="${fs}" text-anchor="middle" fill="#595959" pointer-events="none">${ls.map((x,j)=>`<tspan x="${f1(xc)}" dy="${j?12:0}">${esc(x)}</tspan>`).join('')}</text>`}
    else if(rot){const tx=taie(c,(catH-10)/0.72,fs),yy=y1+10;o+=tinta(xc-lat(tx,fs)*0.72-4,y1+2,lat(tx,fs)*0.72+8,catH-2,'axaC')+`<text x="${f1(xc)}" y="${f1(yy)}" font-size="${fs}" text-anchor="end" fill="#595959" transform="rotate(-45 ${f1(xc)} ${f1(yy)})" pointer-events="none">${esc(tx)}</text>`}
    else{const tx=taie(c,bw-2,fs),tw=lat(tx,fs);o+=tinta(xc-tw/2-2,y1+2,tw+4,14,'axaC')+`<text x="${f1(xc)}" y="${y1+13}" font-size="${fs}" text-anchor="middle" fill="#595959" pointer-events="none">${esc(tx)}</text>`}});
  if(P==='trasare')o+=contur(x0,y0,x1-x0,y1-y0);if(P==='axaV')o+=contur(L,y0-8,yL-2,y1-y0+16);if(P==='axaC')o+=contur(x0,y1+1,x1-x0,catH-2);
  if(G.tip==='column'){const w=bw*0.62/ser.length;
    ser.forEach((s,k)=>{const pts=[],et=[];s.v.forEach((v,i)=>{if(v==null)return;const x=x0+bw*i+bw*0.19+w*k,ya=Y(Math.max(0,v)),yb=Y(Math.min(0,v));
      o+=`<rect x="${f1(x)}" y="${f1(ya)}" width="${f1(w)}" height="${f1(Math.max(0,yb-ya))}" fill="${culS(s,k)}" data-p="serie" data-k="${s.cheie}"/>`;pts.push([x+w/2,ya]);
      if(cuEt(G,s)){const yt=ET==='centru'?(ya+yb)/2+4:ET==='int'?ya+12:ET==='baza'?yb-4:ya-4;et.push([x+w/2,yt-4]);
        o+=`<text x="${f1(x+w/2)}" y="${f1(yt)}" font-size="${fs}" text-anchor="middle" fill="${ET==='ext'||ET==='bula'?'#404040':'#fff'}" data-p="et" data-k="${s.cheie}">${fmt(v)}</text>`}});
      if(P==='serie:'+s.cheie)o+=manere(pts);if(P==='et:'+s.cheie)et.forEach(([x,y])=>o+=contur(x-12,y-7,24,14))})}
  else{ser.forEach((s,k)=>{let p='',prim=true;const pts=[],et=[];s.v.forEach((v,i)=>{if(v==null){prim=true;return}const x=x0+bw*i+bw/2,y=Y(v);p+=`${prim?'M':'L'}${f1(x)},${f1(y)} `;prim=false;pts.push([x,y])});
    o+=`<path d="${p}" fill="none" stroke="${culS(s,k)}" stroke-width="2.5" stroke-linejoin="round" pointer-events="none"/><path d="${p}" fill="none" stroke="#fff" stroke-opacity="0" stroke-width="14" pointer-events="stroke" data-p="serie" data-k="${s.cheie}"/>`;
    if(cuEt(G,s))s.v.forEach((v,i)=>{if(v==null)return;const xl=x0+bw*i+bw/2,yl=Y(v);
      const q=ET==='centru'?[xl,yl+4,'middle']:ET==='stanga'?[xl-6,yl+4,'end']:ET==='sus'?[xl,yl-7,'middle']:ET==='jos'?[xl,yl+15,'middle']:ET==='bula'?[xl,yl-10,'middle']:[xl+6,yl+4,'start'];
      et.push([q[2]==='end'?q[0]-10:q[2]==='start'?q[0]+10:q[0],q[1]-4]);
      o+=`<text x="${f1(q[0])}" y="${f1(q[1])}" font-size="${fs}" text-anchor="${q[2]}" fill="#404040" data-p="et" data-k="${s.cheie}">${fmt(v)}</text>`});
    if(P==='serie:'+s.cheie)o+=manere(pts);if(P==='et:'+s.cheie)et.forEach(([x,y])=>o+=contur(x-12,y-7,24,14))})}
  return o}

/* ================= verificarea (pe ce e ACUM în grafic și în foaie) ================= */
function verifica(sp,G,d,zonaW,val){
  if(!G)return 'Nu există încă un grafic. Selectează datele, apoi Inserare (Insert) › grupul Diagrame (Charts) și tipul de grafic.';
  if(sp.zona&&G.zona!==zs(pz(sp.zona)))return sp.mesajZona||`Graficul ia datele din ${G.zona}, dar aici trebuie ${zs(pz(sp.zona))}: antetul și valorile, fără rânduri goale. Alege graficul cu un clic pe marginea lui albă, apasă Delete, selectează zona și inserează-l din nou.`;
  if(sp.tip&&![].concat(sp.tip).includes(G.tip))return sp.mesajTip||`Graficul e ${NUME[G.tip]}. Gândește-te la întrebarea la care răspunde graficul și alege tipul potrivit.`;
  if(sp.oSerie&&d.serii.length!==1)return `Graficul are ${d.serii.length} serii (${d.serii.map(numeSerie).join(', ')||'niciuna'}), dar aici trebuie o singură serie: ${esc(sp.oSerie)}.`;
  if(sp.serii){const a=d.serii.map(numeSerie).map(norm),b=sp.serii.map(norm);if(a.join('|')!==b.join('|'))return `Seriile graficului sunt acum: ${d.serii.map(numeSerie).join(', ')||'niciuna'}. Aici trebuie să fie: ${sp.serii.join(', ')}. Uită-te la legendă.`}
  if(sp.categorii){const a=d.cats.map(norm),b=sp.categorii.map(norm);if(a.join('|')!==b.join('|'))return `Sub grafic (categoriile) scrie acum: ${d.cats.join(', ')||'nimic'}. Aici trebuie: ${sp.categorii.join(', ')}.`}
  if(sp.titlu){const t=titluAfisat(G,d);if(!t)return 'Graficul nu are titlu. Pornește-l: Proiectare diagramă (Chart Design) › Adăugare element de diagramă (Add Chart Element) › Titlu diagramă (Chart Title) › Above Chart (sau butonul + de lângă grafic, bifa Titlu diagramă).';
    if(norm(t)!==norm(sp.titlu))return `Titlul e acum „${esc(t)}”. Aici trebuie „${esc(sp.titlu)}”: un singur clic pe titlu, scrie, apoi Enter.`}
  if(sp.etichete===true){if(!G.et)return 'Lipsesc etichetele de date (numerele scrise pe grafic).';
    if(d.serii.some(s=>!cuEt(G,s)))return 'La o serie lipsesc etichetele de date. Pornește-le din nou: Adăugare element de diagramă (Add Chart Element) › Etichete de date (Data Labels).'}
  if(sp.etichete===false&&G.et&&d.serii.some(s=>cuEt(G,s)))return 'Aici graficul trebuie să fie fără etichete de date.';
  if(sp.legenda===true&&!G.leg)return 'Lipsește legenda (caseta care spune ce culoare are fiecare serie).';
  if(sp.legenda===false&&G.leg)return 'Aici graficul trebuie să fie fără legendă.';
  if(sp.latimeMin&&G.x+G.w<sp.latimeMin*zonaW-2)return 'Graficul nu ajunge încă la linia punctată. Alege-l cu un clic pe marginea lui albă și trage de cerculețul din colțul din dreapta-jos spre dreapta.';
  if(sp.valori&&val)for(const [a,v] of Object.entries(sp.valori)){if(val(a)!==v)return `În ${a} trebuie scris numărul ${fmt(v)}. Scrie-l în foaie, apoi apasă Enter.`}
  return null}

/* ================= tipul „excelx” cu grafice ================= */
const F=()=>window.ExcelX;
function render(Q,body,api){
  const baza=F();
  if(!baza||!window.JocExcel){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
  const cuGrafic=!!(Q.grafic||Q.start||Q.cuGrafic);
  body.classList.toggle('xg-host',cuGrafic);body.classList.toggle('xg-tel',cuGrafic&&PE_TEL());
  if(!cuGrafic)return baza.render(Q,body,api);
  css();
  const I={G:null,tab:'insert',meniu:null,plus:false,dlg:null,edT:null,ist:[],toast:null};body._xg=I;
  let S=null;
  const api2=Object.assign({},api,{
    done:()=>false,   // foaia și graficul rămân vii după „Corect!” (schimbi o valoare și vezi graficul cum se reface)
    checkButton:(fn,label)=>api.checkButton(()=>{const d=I.G?date(body,S,I.G):{cats:[],serii:[]};const m=verifica(Q.grafic||{},I.G,d,zonaW(),valNum);
      if(!m){api.resolve(true);return}
      api.resolve(false,m);api.revealButton(()=>{aplicaSolutia(Q,body);api.giveUp(Q.solutieText||'graficul corect e acum în pagină.')});
      setTimeout(()=>{const o=body.querySelector('.xg-ob');if(o)try{o.focus({preventScroll:true})}catch(e){}},0)},label)});
  baza.render(Object.assign({},Q,{panglica:false,teste:undefined,verifica:Q.verifica||{}}),body,api2);
  S=foaie(body);const w=body.querySelector('#xwrap');if(!w||!S)return;
  /* testele numite (atelier): deasupra panglicii */
  let tbox=null;if(Array.isArray(Q.teste)&&Q.teste.some(T=>T.grafic)){tbox=document.createElement('div');tbox.className='xg-teste';tbox.setAttribute('aria-live','polite');body.insertBefore(tbox,w)}
  const pg=document.createElement('div');pg.className='xg-pg';body.insertBefore(pg,w);
  const zona=document.createElement('div');zona.className='xg-zona';w.after(zona);
  const cap=document.createElement('p');cap.className='xg-cap';cap.innerHTML='Graficul apare aici, sub foaie (în Excel apare peste foaie, lângă tabel). Un grafic nou, făcut când cel vechi nu e ales, îl înlocuiește aici pe cel vechi (în Excel ar rămâne amândouă).'+(PE_TEL()?' Pe telefon: atingi marginea albă a graficului ca să-l alegi, apoi îl tragi cu degetul sau tragi de un cerculeț din colț. În loc de tasta Delete ai butonul <b>Delete</b> de sub grafic. O celulă o golești din bara de formule (ștergi textul, apoi ↵).':'');zona.after(cap);
  function zonaW(){return zona.clientWidth||340}
  function valNum(a){const c=celula(body,S,a);return c.t==='num'?c.v:null}
  const salveaza=tag=>{I.ist.push({g:JSON.stringify(I.G),tag:tag||''});if(I.ist.length>40)I.ist.shift()};
  function construieste(zt,tip,poz){const z=regiune(body,S,pz(zt)||{c1:0,c2:0,r1:0,r2:0});const G={tip,zona:zs(z),plot:'col',titlu:{mod:'loc'},leg:null,et:null};
    const an=analiza(body,S,z);G.plot=an.implicit;G.an={lr:an.lr,lc:an.lc,gol:an.gol};const d=date(body,S,G),n=d.serii.length;
    G.titlu={mod:(tip==='pie'?(n&&d.serii[0].nume):(n===1&&d.serii[0].nume))?'auto':'loc'};
    G.leg=!n?null:tip==='pie'||n>=2?'jos':null;
    const W=zonaW(),wd=Math.min(W-12,460);Object.assign(G,{w:wd,h:Math.round(wd*0.6),x:6,y:6},poz||{});return G}
  if(Q.start){const st=Q.start;I.G=construieste(st.zona,st.tip||'column',{});
    if(st.plot)I.G.plot=st.plot;if(st.titlu)I.G.titlu={mod:'tau',text:st.titlu};if(st.et)I.G.et=etPentru(I.G.tip,st.et);if('leg' in st)I.G.leg=st.leg;
    ['w','h','x','y'].forEach(k=>{if(st[k]!=null)I.G[k]=st[k]})}

  /* ---------- panglica ---------- */
  function panglica(){const G=I.G,sel=G&&G.sel;if(!sel&&I.tab==='design')I.tab='insert';
    let h=`<div class="xg-file" role="tablist"><button type="button" data-tab="insert" role="tab" aria-selected="${I.tab==='insert'}" class="${I.tab==='insert'?'on':''}">Inserare (Insert)</button>`;
    if(sel)h+=`<button type="button" data-tab="design" role="tab" aria-selected="${I.tab==='design'}" class="ctx ${I.tab==='design'?'on':''}">Proiectare diagramă (Chart Design)</button>`;
    h+=`</div><div class="xg-rand">`;
    if(I.tab==='insert'){
      h+=`<div class="xg-grup"><div class="xg-btns">
        <button type="button" class="xg-b" data-a="recom">Diagrame recomandate<small>Recommended Charts</small></button>
        <button type="button" class="xg-b" data-gal="col" aria-expanded="${I.meniu==='col'}" aria-label="Butonul cu coloane, cu săgeată: Insert Column or Bar Chart">${IC.col} Coloană sau bară ▾<small>Insert Column or Bar Chart</small></button>
        <button type="button" class="xg-b" data-gal="line" aria-expanded="${I.meniu==='line'}" aria-label="Butonul cu linie, cu săgeată: Insert Line or Area Chart">${IC.line} Linie ▾<small>Insert Line or Area Chart</small></button>
        <button type="button" class="xg-b" data-gal="pie" aria-expanded="${I.meniu==='pie'}" aria-label="Butonul rotund, cu săgeată: Insert Pie or Doughnut Chart">${IC.pie} Radială ▾<small>Insert Pie or Doughnut Chart</small></button>
        </div><span class="xg-gn">Diagrame (Charts)</span></div>`}
    else{
      h+=`<div class="xg-grup"><div class="xg-btns"><button type="button" class="xg-b" data-gal="ace" aria-expanded="${!!(I.meniu&&I.meniu.startsWith('ace'))}">Adăugare element de diagramă ▾<small>Add Chart Element</small></button></div><span class="xg-gn">Aspecte de diagrame (Chart Layouts)</span></div>
        <div class="xg-grup"><div class="xg-btns"><button type="button" class="xg-b" data-a="comuta">Comutare rând/coloană<small>Switch Row/Column</small></button><button type="button" class="xg-b stins" data-a="seldate">Selectare date<small>Select Data</small></button></div><span class="xg-gn">Date (Data)</span></div>
        <div class="xg-grup"><div class="xg-btns"><button type="button" class="xg-b" data-a="tip">Modificare tip diagramă<small>Change Chart Type</small></button></div><span class="xg-gn">Tip (Type)</span></div>`}
    h+=`</div>`;
    if(I.meniu)h+=meniuHtml();
    if(pg._h!==h){pg.innerHTML=h;pg._h=h}}
  function meniuHtml(){const m=I.meniu;
    const it=(tip,txt,nu)=>`<button type="button" ${nu?`class="nu" data-nu="${esc(nu)}"`:`data-ins="${tip}"`}>${txt}</button>`;
    if(m==='col')return `<div class="xg-meniu" role="menu" aria-label="Insert Column or Bar Chart"><h5>2-D Column</h5>${it('column','<b>Coloană grupată (Clustered Column)</b>')}${it('','Stacked Column',1)}${it('','100% Stacked Column',1)}<h5>2-D Bar</h5>${it('bar','<b>Clustered Bar</b> (bare grupate)')}${it('','Stacked Bar',1)}${it('','100% Stacked Bar',1)}<p class="nota">În Excel lista are și variantele 3-D (3-D Column, 3-D Bar). În lecție folosim prima din fiecare rând: cea grupată.</p></div>`;
    if(m==='line')return `<div class="xg-meniu" role="menu" aria-label="Insert Line or Area Chart"><h5>2-D Line</h5>${it('line','<b>Line</b> (linie)')}<p class="nota">În Excel lista are și alte variante (cu marcaje, stivuite, 3-D, arie). În lecție folosim prima: Line.</p></div>`;
    if(m==='pie')return `<div class="xg-meniu" role="menu" aria-label="Insert Pie or Doughnut Chart"><h5>2-D Pie</h5>${it('pie','<b>Pie</b> (radială)')}<p class="nota">În Excel lista are și variante 3-D și inelare (Doughnut). În lecție folosim prima: Pie.</p></div>`;
    if(m.startsWith('ace')){const sub=m.split(':')[1]||'',tip=I.G?I.G.tip:'column';
      const el=(k,txt)=>`<button type="button" data-ace="${k}" aria-expanded="${sub===k}">${txt} ›</button>`;
      const nu=t=>`<button type="button" class="nu" data-nu="1">${t} ›</button>`;
      const opt=(k,v,t)=>`<button type="button" data-opt="${k}:${v}">${t}</button>`;
      const subs={titlu:opt('titlu','nu','Fără (None)')+opt('titlu','sus','Above Chart')+opt('titlu','peste','Centered Overlay'),
        et:opt('et','nu','Fără (None)')+(ETP[tip]||ETP.column).map(v=>opt('et',v,ETN[v])).join(''),   // locurile depind de tip (j1_submeniu.json)
        leg:opt('leg','nu','Fără (None)')+opt('leg','dreapta','Right')+opt('leg','sus','Top')+opt('leg','stanga','Left')+opt('leg','jos','Bottom')};
      const bloc=k=>sub===k?`<div class="sub">${subs[k]}</div>`:'';
      return `<div class="xg-meniu" role="menu" aria-label="Add Chart Element">${nu('Axes')}${nu('Axis Titles')}${el('titlu','Titlu diagramă (Chart Title)')}${bloc('titlu')}${el('et','Etichete de date (Data Labels)')}${bloc('et')}${nu('Data Table')}${nu('Error Bars')}${nu('Gridlines')}${el('leg','Legendă (Legend)')}${bloc('leg')}${nu('Trendline')}<p class="nota">Cele cenușii există și în Excel, dar nu le folosim azi.</p></div>`}
    return ''}

  /* ---------- ce e ales acum (scris sub grafic) ---------- */
  function numeParte(G,d){const p=G.parte||'grafic',gs=k=>{const i=d.serii.findIndex(s=>s.cheie===k);return i<0?null:numeSerie(d.serii[i],i)};
    if(p==='titlu')return 'titlul';if(p==='trasare')return 'zona de desen (doar alegerea ei; Delete nu șterge nimic)';if(p==='leg')return 'legenda';
    if(p==='axaV')return G.tip==='bar'?'axa cu numere (jos)':'axa cu numere (din stânga)';if(p==='axaC')return G.tip==='bar'?'axa cu numele (din stânga)':'axa de jos, cu numele';
    if(p.startsWith('serie:')){const n=gs(p.slice(6));return n?`seria „${esc(n)}” (${G.tip==='line'?'toată linia':G.tip==='pie'?'toate feliile':'toate coloanele ei'})`:'tot graficul'}
    if(p.startsWith('et:')){const n=gs(p.slice(3));return n?`etichetele de date ale seriei „${esc(n)}”`:'tot graficul'}
    return 'tot graficul (marginea albă)'}
  /* ---------- zona graficului ---------- */
  function desen(){panglica();const G=I.G,W=zonaW();
    let h='';let refa=false;
    if(!G){h+=`<div class="xg-gol">Aici apare graficul (diagrama).</div>`;zona.style.height='';}
    else{const d=date(body,S,G);G.x=Math.max(0,Math.min(G.x,W-60));const t=titluAfisat(G,d),rand=t?String(t).split('\n').length:0,tH=t?34+18*(rand-1):0;
      const yR=G.y+G.h+6,yF=yR+(G.sel?(PE_TEL()?82:40):0),   /* pe telefon rândul „Ales acum” are și butonul Delete: două rânduri */
        yP=yF+(I.edT?(I.edT.in?78:56):0);
      zona.style.height=Math.max(230,yP+(I.plus?190:I.dlg?150:8))+'px';
      h+=`<div class="xg-ob${G.sel?' sel':''}" tabindex="0" role="group" aria-label="Graficul (diagrama) ${esc(SCURT[G.tip])}${t?', cu titlul '+esc(t):''}" style="left:${G.x}px;top:${G.y}px;width:${G.w}px;height:${G.h}px">
        <svg viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="${esc(SCURT[G.tip])}">${desenSVG(G,d,G.w,G.h,tH)}</svg>
        ${t?`<div class="xg-t${G.sel&&G.parte==='titlu'?' sel':''}" data-x="titlu" role="button" aria-label="Titlul graficului: ${esc(t)}. Un singur clic, apoi scrii titlul tău și Enter">${esc(t)}</div>`:''}
        ${G.sel?['nw','ne','sw','se'].map(k=>`<div class="xg-h" data-h="${k}" style="left:${k[1]==='w'?0:G.w}px;top:${k[0]==='n'?0:G.h}px" aria-hidden="true"></div>`).join(''):''}</div>`;
      if(G.sel){h+=`<div class="xg-ales" style="left:${G.x}px;top:${yR}px;max-width:${W-G.x-4}px" aria-live="polite"><span>Ales acum: <b>${numeParte(G,d)}</b></span>${PE_TEL()?'<button type="button" data-a="del" aria-label="Delete: șterge ce e ales acum">⌫ Delete</button>':''}</div>`;
        const px=G.x+G.w+4+34<=W?G.x+G.w+4:Math.max(0,G.x+G.w-38);const py=G.x+G.w+4+34<=W?G.y:G.y+4;
        h+=`<button type="button" class="xg-plus" data-a="plus" style="left:${px}px;top:${py}px" aria-label="Elemente diagramă (Chart Elements)" title="Elemente diagramă (Chart Elements)" aria-expanded="${I.plus}">+</button>`;
        if(I.plus){const afara=G.x+G.w+4+34<=W,lx=afara?Math.max(4,Math.min(px-200,W-258)):4,ly=afara?py+38:yP;
          h+=`<div class="xg-elem" style="left:${lx}px;top:${ly}px" role="dialog" aria-label="Elemente diagramă (Chart Elements)"><b>Elemente diagramă (Chart Elements)</b>
            <label><input type="checkbox" data-el="titlu" ${t?'checked':''}> Titlu diagramă (Chart Title)</label>
            <label><input type="checkbox" data-el="et" ${G.et&&d.serii.some(s=>cuEt(G,s))?'checked':''}> Etichete de date (Data Labels)</label>
            <label><input type="checkbox" data-el="leg" ${G.leg?'checked':''}> Legendă (Legend)</label>
            <div class="nota">În Excel lista are și alte bife (axe, linii de grilă…). Azi folosim doar aceste trei.</div></div>`}}
      if(I.edT){const nota=I.edT.in?'Cursorul e în textul titlului (ai dat al doilea clic): ce scrii se adaugă la titlul vechi, iar Enter începe un rând nou, ca în Excel. Ca să-l înlocuiești tot: clic pe o celulă, apoi un singur clic pe titlu.':'Scrie titlul, apoi Enter (pe telefon: ✓). În Excel, ce scrii apare în bara de formule și înlocuiește tot titlul.';
        h+=`<div class="xg-fx" style="top:${yF}px" role="group" aria-label="Titlul graficului"><i>fx</i>${I.edT.in?`<textarea data-x="fxt" rows="2" aria-label="Textul titlului, cu cursorul în el" autocomplete="off" autocorrect="off" spellcheck="false">${esc(I.edT.text)}</textarea>`:`<input type="text" data-x="fxt" value="${esc(I.edT.text)}" aria-label="Scrie titlul graficului" autocomplete="off" autocorrect="off" spellcheck="false">`}<button type="button" data-a="fxok" aria-label="${I.edT.in?'Gata (ca un clic pe o celulă)':'Enter (pune titlul)'}">✓</button>${I.edT.in?'':'<button type="button" data-a="fxno" aria-label="Anulare (Esc)">✗</button>'}<span class="nota">${nota}</span></div>`}
      if(I.dlg){const L=[['column','Coloană (Column)'],['line','Linie (Line)'],['pie','Radială (Pie)'],['bar','Bară (Bar)']];
        h+=`<div class="xg-dlg" role="dialog" aria-label="Modificare tip diagramă (Change Chart Type)"><b>Modificare tip diagramă (Change Chart Type)</b><div class="fila">Fila Toate diagramele (All Charts)</div>
          <div class="tipuri">${L.map(([k,n])=>`<button type="button" data-dt="${k}" class="${I.dlg.tip===k?'on':''}">${n}</button>`).join('')}</div>
          <p class="nota">În Excel lista are și alte tipuri (arie, XY…). Clic pe un tip alege prima lui variantă (cea grupată).</p>
          <div class="jos"><button type="button" class="ok" data-a="dlgok">OK</button><button type="button" data-a="dlgno">Anulare (Cancel)</button></div></div>`}}
    if(I.toast)h+=`<div class="xg-toast" role="status">${I.toast}<br><button type="button" data-a="toastok">Am înțeles</button></div>`;
    if(Q.grafic&&Q.grafic.latimeMin)h+=`<div aria-hidden="true" style="position:absolute;top:0;bottom:0;left:${Math.round(Q.grafic.latimeMin*W)}px;border-left:2px dashed #C0504D;pointer-events:none"></div>`;
    if(zona._h!==h){zona.innerHTML=h;zona._h=h;refa=true}
    if(I.edT&&refa){const i=zona.querySelector('[data-x="fxt"]');if(i){try{i.focus({preventScroll:true});const L=I.edT.in&&I.edT.poz!=null?Math.min(I.edT.poz,i.value.length):i.value.length;i.setSelectionRange(L,L)}catch(e){}}}
    teste()}
  function teste(){if(!tbox)return;const d=I.G?date(body,S,I.G):{cats:[],serii:[]};const W=zonaW();
    const rez=Q.teste.filter(T=>T.grafic).map(T=>({ce:T.ce,ok:!verifica(T.grafic,I.G,d,W,valNum)}));const n=rez.filter(x=>x.ok).length;
    tbox.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xg-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`}
  I.desen=desen;I.construieste=construieste;

  /* ---------- acțiunile ---------- */
  function insereaza(tip){
    if(I.G&&I.G.sel&&String(I.G.parte||'').startsWith('serie:')){I.toast='În Excel, cu o singură serie aleasă, butonul schimbă doar seria aceea. Alege întâi tot graficul (clic pe marginea albă).';I.meniu=null;I.plus=false;desen();focusOb();return}   // N3: fără grafic combinat în lecție
    if(I.G&&I.G.sel){schimbaTip(tip);I.meniu=null;I.plus=false;desen();focusOb();return}   // cu graficul ales: îi schimbă tipul, nu face altul (j1_insert_ales.json)
    const z0=intregi(body,S,selectia(body))||{c1:0,c2:0,r1:0,r2:0};salveaza();
    if(I.G)I.toast='În Excel ai avea acum <b>două</b> grafice: cel vechi a rămas pe foaie. Aici rămâne doar cel nou. În Excel, pe cel vechi îl alegi cu un clic pe marginea lui albă și apeși <kbd>Delete</kbd>.';
    const poz=I.G?{x:I.G.x+16,y:I.G.y+16}:{};const G=construieste(zs(z0),tip,poz);G.sel=true;G.parte='grafic';I.G=G;I.meniu=null;I.plus=false;I.tab='design';desen();focusOb()}
  function focusOb(){const o=zona.querySelector('.xg-ob');if(o)try{o.focus({preventScroll:true})}catch(e){}}
  function schimbaTip(tip){if(!I.G||I.G.tip===tip)return;salveaza();const d=date(body,S,I.G);
    if(I.G.titlu.mod==='loc'&&tip==='pie'&&d.serii[0]&&d.serii[0].nume)I.G.titlu={mod:'auto'};I.G.tip=tip;I.G.et=etPentru(tip,I.G.et);if(I.G.sel)I.G.parte='grafic'}
  function comuta(){if(!I.G)return;salveaza();I.G.plot=I.G.plot==='col'?'row':'col';if(I.G.sel)I.G.parte='grafic'}
  function opt(k,v){const G=I.G;if(!G)return;salveaza();const d=date(body,S,G);
    if(k==='titlu'){if(v==='nu')G.titlu={mod:'ascuns'};else if(!titluAfisat(G,d))G.titlu={mod:'loc'}}
    if(k==='et'){G.et=v==='nu'?null:etPentru(G.tip,v);G.etAscunse=[]}
    if(k==='leg')G.leg=v==='nu'?null:v}
  function bifa(k,on){const G=I.G;if(!G)return;salveaza();
    if(k==='titlu')G.titlu=on?{mod:'loc'}:{mod:'ascuns'};
    if(k==='et'){G.et=on?ETI[G.tip]||'ext':null;G.etAscunse=[]}
    if(k==='leg')G.leg=on?'dreapta':null}
  /* Delete: șterge DOAR ce e ales (r1_excel.json › delete_dupa_clic); după ștergere rămâne ales tot graficul */
  function sterge(){const G=I.G;if(!G||!G.sel)return;const p=G.parte||'grafic';
    if(p==='grafic'){salveaza();I.G=null;I.plus=false;I.edT=null;I.dlg=null;desen();const g=body.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(e){}return}
    if(p==='trasare')return;
    if(p.startsWith('serie:')){salveaza('serie');G.sterse=(G.sterse||[]).concat(p.slice(6))}
    else if(p.startsWith('et:')){salveaza();G.etAscunse=(G.etAscunse||[]).concat(p.slice(3))}
    else{salveaza();if(p==='titlu')G.titlu={mod:'ascuns'};if(p==='leg')G.leg=null;if(p==='axaV')G.faraAxaV=true;if(p==='axaC')G.faraAxaC=true}
    if(p.startsWith('serie:')&&G.titlu&&G.titlu.mod==='loc'){const d=date(body,S,G);if(d.serii.length===1&&d.serii[0].nume)G.titlu={mod:'auto'}}   // Excel: titlul pus singur devine numele seriei rămase (judecata 2, N4)
    G.parte='grafic';G.tsel=false;I.edT=null;desen();focusOb()}
  function anuleaza(){if(!I.ist.length)return false;const x=I.ist.pop(),g=JSON.parse(x.g);
    if(g&&x.tag==='serie'&&g.titlu&&g.titlu.mod==='loc')g.titlu={mod:'ascuns'};   // Excel: seria revine, dar „Chart Title” dispare (r1_excel2.json)
    I.G=g;if(I.G){I.G.sel=true;I.G.parte='grafic';I.G.tsel=false}I.plus=false;I.dlg=null;I.edT=null;desen();focusOb();return true}
  function puneTitluIn(){const i=zona.querySelector('[data-x="fxt"]');if(I.G&&I.edT&&I.edT.in){salveaza();I.G.titlu={mod:'tau',text:i?i.value:I.edT.text}}I.edT=null}
  function deselecteaza(){if(!I.G)return;if(I.edT&&I.edT.in)puneTitluIn();   // clicul pe o celulă păstrează ce ai scris în titlu (r1_excel2.json)
    if(I.G.sel||I.meniu||I.plus||I.dlg||I.edT){I.G.sel=false;I.G.tsel=false;I.G.parte=null;I.meniu=null;I.plus=false;I.dlg=null;I.edT=null;desen()}}
  function puneTitlu(){const i=zona.querySelector('[data-x="fxt"]');if(I.edT&&I.edT.in){puneTitluIn();I.G.parte='titlu';desen();focusOb();return}
    const t=i?i.value:'';if(t.trim()!==''){salveaza();I.G.titlu={mod:'tau',text:t}}I.edT=null;I.G.parte='titlu';I.G.tsel=true;desen();focusOb()}
  function alegeTitlu(ev,t){const G=I.G;if(!G||I.mut)return;
    if(G.sel&&G.parte==='titlu'&&!(I.edT&&I.edT.in)){   // al doilea clic: cursorul intră în text, acolo unde ai dat clic
      const txt=titluAfisat(G,date(body,S,G))||'',r=t.getBoundingClientRect(),f=r.width?Math.max(0,Math.min(1,(ev.clientX-r.left)/r.width)):1;
      I.edT={in:true,text:txt,poz:Math.round(f*txt.length)}}
    else if(!(I.edT&&I.edT.in)){if(!G.sel){I.tab='design';I.meniu=null}G.sel=true;G.parte='titlu';G.tsel=true;I.plus=false;I.edT={text:''}}
    desen()}

  pg.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;
    if(I.edT&&I.edT.in)puneTitluIn();
    if(b.dataset.tab){I.tab=b.dataset.tab;I.meniu=null;desen();return}
    if(b.dataset.gal){const g=b.dataset.gal;I.meniu=I.meniu&&I.meniu.split(':')[0]===g?null:g;desen();return}
    if(b.dataset.ins){insereaza(b.dataset.ins);return}
    if(b.dataset.nu){I.toast=b.dataset.nu==='1'?'Varianta asta există și în Excel, dar în lecție nu o folosim.':esc(b.dataset.nu);I.meniu=null;desen();return}
    if(b.dataset.ace){const k=b.dataset.ace;I.meniu=I.meniu==='ace:'+k?'ace':'ace:'+k;desen();return}
    if(b.dataset.opt){const [k,v]=b.dataset.opt.split(':');opt(k,v);I.meniu=null;desen();focusOb();return}
    const a=b.dataset.a;
    if(a==='recom'){I.toast='În Excel, <b>Diagrame recomandate (Recommended Charts)</b> deschide o fereastră cu propuneri. În lecție alegi tu tipul, din butoanele de alături.';I.meniu=null;desen();return}
    if(a==='comuta'){comuta();I.meniu=null;desen();focusOb();return}
    if(a==='seldate'){I.toast='În Excel, <b>Selectare date (Select Data)</b> deschide fereastra în care schimbi zona graficului. Azi, dacă ai greșit zona: alegi graficul cu un clic pe marginea lui albă, apeși Delete, selectezi din nou și inserezi graficul.';I.meniu=null;desen();return}
    if(a==='tip'){I.dlg={tip:I.G?I.G.tip:'column'};I.meniu=null;I.plus=false;desen();const x=zona.querySelector('.xg-dlg button.on');if(x)try{x.focus({preventScroll:true})}catch(e){}return}});
  zona.addEventListener('click',ev=>{const b=ev.target.closest('button');
    if(b){const a=b.dataset.a;
      if(a==='plus'){if(I.edT&&I.edT.in)puneTitluIn();I.plus=!I.plus;I.meniu=null;desen();return}
      if(a==='del'){sterge();return}
      if(a==='fxok'){puneTitlu();return}
      if(a==='fxno'){I.edT=null;desen();focusOb();return}
      if(b.dataset.dt){I.dlg.tip=b.dataset.dt;desen();const x=zona.querySelector('.xg-dlg button.on');if(x)try{x.focus({preventScroll:true})}catch(e){}return}
      if(a==='dlgok'){schimbaTip(I.dlg.tip);I.dlg=null;desen();focusOb();return}
      if(a==='dlgno'){I.dlg=null;desen();focusOb();return}
      if(a==='toastok'){I.toast=null;desen();return}}
    const t=ev.target.closest('.xg-t');if(t){alegeTitlu(ev,t);return}});
  zona.addEventListener('dblclick',ev=>{const t=ev.target.closest('.xg-t');if(t&&I.G&&!(I.edT&&I.edT.in)){I.G.sel=true;I.G.parte='titlu';alegeTitlu(ev,t)}});
  zona.addEventListener('change',ev=>{const c=ev.target.closest('input[data-el]');if(!c)return;bifa(c.dataset.el,c.checked);desen();
    const x=zona.querySelector(`input[data-el="${c.dataset.el}"]`);if(x)try{x.focus({preventScroll:true})}catch(e){}});
  zona.addEventListener('keydown',ev=>{
    if(ev.target.matches&&ev.target.matches('[data-x="fxt"]')){
      if(I.edT&&I.edT.in){if(ev.key==='Escape'){ev.preventDefault();puneTitluIn();I.G.parte='titlu';desen();focusOb()}return}   // Esc lasă textul scris (r1_excel.json); Enter = rând nou
      if(ev.key==='Enter'){ev.preventDefault();puneTitlu()}else if(ev.key==='Escape'){ev.preventDefault();I.edT=null;desen();focusOb()}return}
    if(I.dlg&&ev.key==='Escape'){I.dlg=null;desen();focusOb();return}
    const o=ev.target.closest&&ev.target.closest('.xg-ob');if(!o||!I.G)return;
    if((ev.ctrlKey||ev.metaKey)&&(ev.key==='z'||ev.key==='Z')){ev.preventDefault();anuleaza();return}
    if(ev.key==='Delete'){ev.preventDefault();sterge();return}
    if(ev.key==='Escape'){ev.preventDefault();if(I.G.parte&&I.G.parte!=='grafic'){I.G.parte='grafic';I.G.tsel=false;desen();focusOb()}else deselecteaza();return}
    if(I.G.sel&&I.G.parte==='titlu'&&ev.key.length===1&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ev.preventDefault();I.edT={text:ev.key};desen()}});
  pg.addEventListener('keydown',ev=>{if((ev.ctrlKey||ev.metaKey)&&(ev.key==='z'||ev.key==='Z')&&I.G){ev.preventDefault();anuleaza()}if(ev.key==='Escape'&&I.meniu){I.meniu=null;desen()}});
  /* ce parte a graficului e sub deget / sub mouse */
  function parteDin(el){const e=el.closest&&el.closest('[data-p]');if(!e||!zona.contains(e))return 'grafic';const p=e.dataset.p;return p==='serie'||p==='et'?p+':'+e.dataset.k:p}
  /* clicul alege o parte; graficul se mută și se mărește doar ales de margine (sau de un cerculeț din colț) */
  zona.addEventListener('pointerdown',ev=>{
    if(ev.target===zona){deselecteaza();return}   // clic pe foaia de sub grafic: graficul nu mai e ales
    const o=ev.target.closest('.xg-ob');if(!o||!I.G)return;
    if(ev.target.closest('.xg-t'))return;          // titlul se alege la „click”
    const atins=ev.pointerType==='touch';
    if(I.plus){I.plus=false;desen();if(atins)return}
    if(I.edT){if(I.edT.in)puneTitluIn();else I.edT=null}
    const h=ev.target.closest('.xg-h'),p=h?'grafic':parteDin(ev.target);
    const G=I.G,eraActiv=G.sel,eraParte=G.parte;
    G.sel=true;G.parte=p;G.tsel=false;if(!eraActiv){I.tab='design';I.meniu=null}
    if(!atins)ev.preventDefault();   // altfel clicul mută focusul de pe grafic, iar Delete nu mai ajunge la el
    if(p!=='grafic'){desen();focusOb();return}                                   // o serie, zona de desen, legenda…: doar se aleg
    if(atins&&!h&&!(eraActiv&&eraParte==='grafic')){desen();focusOb();return}   // pe telefon: prima atingere doar alege
    if(!eraActiv||eraParte!=='grafic')desen();focusOb();   // focusul se dă mereu: și la un nou clic pe marginea graficului deja ales, Delete / Ctrl+Z trebuie să ajungă la el (judecata 2, N1)
    const x0=ev.clientX,y0=ev.clientY,g0={x:G.x,y:G.y,w:G.w,h:G.h},W=zonaW();let mutat=false;const k=h?h.dataset.h:null;
    const el=zona.querySelector('.xg-ob');try{el.setPointerCapture(ev.pointerId)}catch(e){}
    ev.preventDefault();
    const mv=e=>{const dx=e.clientX-x0,dy=e.clientY-y0;if(!mutat&&Math.abs(dx)+Math.abs(dy)<4)return;if(!mutat){mutat=true;salveaza()}
      if(!k){G.x=Math.round(Math.max(0,Math.min(W-40,g0.x+dx)));G.y=Math.round(Math.max(0,g0.y+dy))}
      else{let {x,y,w,h:hh}=g0;if(k.includes('e'))w=g0.w+dx;if(k.includes('s'))hh=g0.h+dy;if(k.includes('w')){x=g0.x+dx;w=g0.w-dx}if(k.includes('n')){y=g0.y+dy;hh=g0.h-dy}
        w=Math.max(160,Math.min(w,W-Math.max(0,x)));hh=Math.max(110,hh);if(k.includes('w'))x=g0.x+g0.w-w;if(k.includes('n'))y=g0.y+g0.h-hh;
        G.x=Math.round(Math.max(0,x));G.y=Math.round(Math.max(0,y));G.w=Math.round(w);G.h=Math.round(hh)}
      const ob=zona.querySelector('.xg-ob');if(ob){ob.style.left=G.x+'px';ob.style.top=G.y+'px';ob.style.width=G.w+'px';ob.style.height=G.h+'px'}};
    const up=()=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);if(mutat){I.mut=true;desen();focusOb();setTimeout(()=>{I.mut=false},0)}};
    el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)});
  /* clic în foaie = graficul nu mai e ales (ca în Excel); orice schimbare în foaie redesenează graficul */
  w.addEventListener('pointerdown',()=>deselecteaza(),true);
  let rafP=0;new MutationObserver(()=>{if(rafP)return;rafP=requestAnimationFrame(()=>{rafP=0;if(I.edT)return teste();desen()})}).observe(w,{childList:true,subtree:true,characterData:true});
  addEventListener('resize',()=>{if(document.body.contains(zona)&&!I.edT)desen()});
  desen()}

/* rezolvarea porții (și „Arată-mi răspunsul”): foaia, apoi graficul cerut */
function aplicaSolutia(Q,body){const I=body._xg,S=foaie(body);if(!I||!S)return;const sp=Q.grafic||{},sol=Q.solutie||{};
  (sol.gol||[]).forEach(a=>delete S.RAW[a]);Object.entries(sol.valori||{}).forEach(([a,v])=>S.RAW[a]=String(v));S.draw();
  const zt=sp.zona||(Q.start&&Q.start.zona)||'A1';const tip=[].concat(sp.tip||(Q.start&&Q.start.tip)||'column')[0];
  const G=I.construieste(zt,tip,I.G?{x:I.G.x,y:I.G.y}:{});
  if(sp.serii){const d=date(body,S,G);if(d.serii.map(numeSerie).map(norm).join('|')!==sp.serii.map(norm).join('|'))G.plot=G.plot==='col'?'row':'col'}
  if(sp.titlu)G.titlu={mod:'tau',text:sp.titlu};
  if(sp.etichete===true)G.et=ETI[tip]||'ext';if(sp.etichete===false)G.et=null;
  if(sp.legenda===true&&!G.leg)G.leg='dreapta';if(sp.legenda===false)G.leg=null;
  if(sp.latimeMin){const W=body.querySelector('.xg-zona').clientWidth||340;G.x=0;G.w=Math.min(W,Math.ceil(sp.latimeMin*W)+4)}
  G.sel=true;G.parte='grafic';I.G=G;I.plus=false;I.dlg=null;I.edT=null;I.meniu=null;I.tab='design';try{S.setZona(G.zona);S.draw()}catch(e){}I.desen()}
const ExcelG={
  render,
  rezolva(Q,body,api){if(!(Q.grafic||Q.start||Q.cuGrafic))return F().rezolva(Q,body,api);aplicaSolutia(Q,body)},
  gresit(Q,body,api){if(!(Q.grafic||Q.start||Q.cuGrafic))return F().gresit(Q,body,api);const I=body._xg,sp=Q.grafic||{};if(!I)return;
    aplicaSolutia(Q,body);const G=I.G;
    if(sp.tip){const ok=[].concat(sp.tip);G.tip=['column','line','pie','bar'].find(t=>!ok.includes(t));G.et=etPentru(G.tip,G.et)}
    else if(sp.serii||sp.oSerie)G.plot=G.plot==='col'?'row':'col';
    else if(sp.titlu)G.titlu={mod:'loc'};
    else if(sp.etichete===true)G.et=null;
    else if(sp.latimeMin)G.w=160;
    else I.G=null;
    I.desen()}
};
window.ExcelG=ExcelG;
window.ExcelGrafic={analiza:(body,zt)=>analiza(body,foaie(body),pz(zt)),date:body=>{const I=body._xg;return I&&I.G?date(body,foaie(body),I.G):null},
  stare:body=>{const I=body._xg;return I?{G:I.G&&JSON.parse(JSON.stringify(I.G)),tab:I.tab,meniu:I.meniu,plus:I.plus,dlg:I.dlg,edT:I.edT}:null},
  titlu:body=>{const I=body._xg;return I&&I.G?titluAfisat(I.G,date(body,foaie(body),I.G)):null},verifica,regiune:(body,zt)=>zs(regiune(body,foaie(body),pz(zt))),
  scala};
})();
