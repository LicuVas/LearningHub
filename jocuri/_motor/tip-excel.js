/* Tipul de întrebare „excel”: o foaie de calcul care se POARTĂ ca Excel-ul adevărat (25.09.2026, extins 25.09 seara).
   Regula fidelității (jocuri/README.md §1): elevul face în joc exact gesturile din Excel. Formulele le calculează
   motorul din tip-foaie.js, verificat cu oracolul Excel (_cercetare/oracol_excel).

   Ce face ca în Excel (Microsoft 365, interfața EN pe setări regionale RO sau EN):
   - clic = alegi celula; tragi = selectezi o zonă. Celula ACTIVĂ rămâne cea din care ai pornit (albă în zonă);
     caseta de nume arată doar adresa ei; cât tragi, arată mărimea zonei: „3R x 2C”. Shift+clic / Shift+săgeți extind.
   - bara de jos: modul (Gata / Introducere / Editare / Indicare = Ready / Enter / Edit / Point) și, pentru o zonă,
     Medie / Număr / Sumă.
   - scrii direct în celulă (modul Introducere: săgețile închid celula și te mută); F2 trece în Editare (săgețile
     merg prin text); clic în bara de formule = Editare; Enter jos, Tab dreapta, Shift = invers, Esc renunță.
   - în formulă: clic / săgeți / tragere pun adresa (Indicare); F4 ciclează $; lista de funcții apare când scrii
     =SU… și Tab o completează cu „SUM(”; sub bara fx, bula arată părțile funcției, cu ; sau , după setări;
     la Enter parantezele uitate se închid singure, iar numele funcțiilor și adresele devin cu litere mari.
   - Delete golește; Ctrl+D copiază în jos, Ctrl+R la dreapta; Ctrl+C / Ctrl+X / Ctrl+V (adresele se mută ca în
     Excel); Ctrl+Z / Ctrl+Y; Ctrl+Enter scrie același lucru în toată zona; Ctrl+săgeți sar la marginea datelor;
     Ctrl+Home = A1; Ctrl+A = tot; pătrățelul din colț (fill handle) se trage în jos sau la dreapta.
   - setări RO („;” și 12,5) / EN („,” și 12.5): un număr cu semnul greșit rămâne TEXT; separatorul greșit dă
     fereastra „There's a problem with this formula”.
   - „Copiază tabelul” pune foaia în clipboard (text + tabel), ca s-o lipești în Excel sau Google Sheets.

   Întrebare: {t:'excel', q, cols, rows, cells:{A1:'Nume',B2:8,...}, mod:'ro'|'en', variants:[{B2:4}],
     verifica:{ sel:'C4' | zona:'B2:D2' | valori:{A1:'Nume',B1:12.5} | formule:{D2:'=B2*C2'} |
                umplut:{D2:['D3','D4']} | gol:['B3'] | gest:['clic-adresa','umple','f4','tastat-in-celula','zona-mouse',
                'autocompletare','ctrl-d','copiere'] },
     o:[...], ok:k  -> „încearcă singur”: foaia e liberă (nu se notează), iar răspunsul se alege din variante,
     why} */
(function(){
'use strict';
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).replace(/\$/g,'').toUpperCase().match(/^([A-Z]+)(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const E=()=>window.JocFoaie;
const MODE_TXT={gata:'Gata (Ready)',enter:'Introducere (Enter)',edit:'Editare (Edit)',point:'Indicare (Point)'};

/* funcțiile, cu părțile lor exact cum le arată bula Excel-ului în engleză, și o descriere pentru elev */
const FUNC={
  SUM:[['number1','[number2]','…'],'adună numerele (suma)'],
  AVERAGE:[['number1','[number2]','…'],'media aritmetică'],
  MIN:[['number1','[number2]','…'],'cea mai mică valoare'],
  MAX:[['number1','[number2]','…'],'cea mai mare valoare'],
  COUNT:[['value1','[value2]','…'],'câte celule au NUMERE'],
  COUNTA:[['value1','[value2]','…'],'câte celule NU sunt goale'],
  COUNTBLANK:[['range'],'câte celule sunt goale'],
  COUNTIF:[['range','criteria'],'câte celule îndeplinesc o condiție'],
  SUMIF:[['range','criteria','[sum_range]'],'adună doar ce îndeplinește o condiție'],
  AVERAGEIF:[['range','criteria','[average_range]'],'media doar pentru ce îndeplinește o condiție'],
  IF:[['logical_test','[value_if_true]','[value_if_false]'],'alege între două rezultate după o condiție'],
  AND:[['logical1','[logical2]','…'],'TRUE dacă TOATE condițiile sunt adevărate'],
  OR:[['logical1','[logical2]','…'],'TRUE dacă MĂCAR o condiție e adevărată'],
  NOT:[['logical'],'întoarce pe dos: TRUE devine FALSE'],
  ROUND:[['number','num_digits'],'rotunjește la un număr de zecimale'],
  ROUNDUP:[['number','num_digits'],'rotunjește în sus'],
  ROUNDDOWN:[['number','num_digits'],'rotunjește în jos'],
  INT:[['number'],'partea întreagă (în jos)'],
  ABS:[['number'],'valoarea absolută (fără minus)'],
  MOD:[['number','divisor'],'restul împărțirii'],
  SQRT:[['number'],'rădăcina pătrată'],
  POWER:[['number','power'],'ridicarea la putere'],
  LEN:[['text'],'câte caractere are textul'],
  UPPER:[['text'],'textul cu litere MARI'],
  LOWER:[['text'],'textul cu litere mici'],
  LEFT:[['text','[num_chars]'],'primele caractere din stânga'],
  RIGHT:[['text','[num_chars]'],'ultimele caractere din dreapta'],
  MID:[['text','start_num','num_chars'],'caractere din mijlocul textului'],
  CONCATENATE:[['text1','[text2]','…'],'lipește mai multe texte'],
  TRIM:[['text'],'scoate spațiile în plus']
};

const CSS=`.xl{--xlg:#217346;font-family:"Segoe UI",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:manipulation;position:relative}
.xl .bara{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px;font-size:.85rem;color:var(--ink2)}
.xl .bara .mod{margin-left:auto;display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.xl .bara button{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:5px;padding:3px 8px;font:inherit;cursor:pointer}
.xl .bara button.on{background:var(--xlg);color:#fff;border-color:var(--xlg)}
.xl .fx{display:flex;border:1px solid var(--line);background:var(--paper);border-radius:4px 4px 0 0;overflow:visible;position:relative}
.xl .nb{width:5.6em;padding:6px 8px;border-right:1px solid var(--line);font-size:.9rem;background:var(--paper);white-space:nowrap}
.xl .fxl{padding:6px 8px;border-right:1px solid var(--line);color:var(--ink2);font-style:italic}
.xl .fxi{flex:1;min-width:0;border:0;padding:6px 8px;font:500 .95rem "Segoe UI",system-ui,sans-serif;background:var(--paper);color:var(--ink);user-select:text;-webkit-user-select:text}
.xl .fxi:focus{outline:2px solid var(--xlg);outline-offset:-2px}
.xl .pop{position:absolute;left:6.8em;top:100%;z-index:5;background:var(--paper);border:1px solid var(--line);box-shadow:0 4px 14px #0004;border-radius:4px;font-size:.88rem;min-width:15em;max-width:calc(100% - 7em)}
.xl .bula{padding:5px 9px;font-family:"Segoe UI",system-ui,sans-serif;color:var(--ink)}
.xl .bula b{font-weight:700;text-decoration:underline}
.xl .bula .ds{display:block;color:var(--ink2);font-size:.8rem;margin-top:2px}
.xl .lista div{padding:4px 9px;cursor:pointer;display:flex;gap:8px;justify-content:space-between}
.xl .lista div.on{background:color-mix(in srgb,var(--xlg) 20%,var(--paper))}
.xl .lista div span{color:var(--ink2);font-size:.78rem}
.xl .lista .pn{border-top:1px solid var(--line);color:var(--ink2);font-size:.75rem;cursor:default;display:block}
.xl .gw{overflow:auto;border:1px solid var(--line);border-top:0;max-width:100%;outline:none}
.xl table{border-collapse:collapse;font-size:.92rem;background:var(--paper)}
.xl th{background:var(--paper2);color:var(--ink2);font-weight:500;border:1px solid var(--line);padding:2px 6px;min-width:2.2em;font-size:.8rem}
.xl th.on{background:color-mix(in srgb,var(--xlg) 22%,var(--paper2));color:var(--ink)}
.xl td{border:1px solid var(--line);min-width:5.4em;max-width:9em;height:1.9em;padding:0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;cursor:cell;color:var(--ink)}
.xl td.n{text-align:right;font-variant-numeric:tabular-nums}
.xl td.e{text-align:center}
.xl td.er{color:var(--bad)}
.xl td.z{background:color-mix(in srgb,var(--xlg) 13%,var(--paper))}
.xl td.act{outline:2px solid var(--xlg);outline-offset:-2px;background:var(--paper)}
.xl td.pt{outline:2px dashed #2b6cd8;outline-offset:-3px}
.xl td.cp{outline:1px dashed var(--xlg);outline-offset:-3px}
.xl td.mq{outline:2px dashed var(--xlg);outline-offset:-3px}
.xl td .fh{position:absolute;right:-1px;bottom:-1px;width:9px;height:9px;background:var(--xlg);border:1px solid var(--paper);cursor:crosshair;touch-action:none;z-index:2}
.xl .st{display:flex;justify-content:space-between;gap:14px;font-size:.8rem;color:var(--ink2);padding:3px 6px;border:1px solid var(--line);border-top:0;background:var(--paper2);min-height:1.6em;flex-wrap:wrap}
.xl .st .sd{display:flex;gap:14px}
.xl .dlg{border:1px solid var(--line);border-left:4px solid var(--bad);background:var(--paper);padding:8px 10px;margin-top:6px;font-size:.9rem}
.xl .dlg b{display:block;margin-bottom:2px}
.xl .info{font-size:.82rem;color:var(--ink2);margin-top:6px}
.xl .rb{border:1px solid var(--line);border-bottom:0;background:var(--paper2);border-radius:4px 4px 0 0;font-size:.82rem}
.xl .rb .tabs{display:flex;gap:2px;padding:3px 4px 0}
.xl .rb .tabs button{border:0;background:none;color:var(--ink2);padding:4px 10px;border-radius:4px 4px 0 0;cursor:pointer;font:inherit}
.xl .rb .tabs button.on{background:var(--paper);color:var(--xlg);font-weight:600;box-shadow:inset 0 -2px 0 var(--xlg)}
.xl .rb .grup{display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:5px 6px;background:var(--paper);border-top:1px solid var(--line)}
.xl .rb .grup button,.xl .rb .grup select{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:4px;padding:3px 7px;font:inherit;cursor:pointer;min-height:28px}
.xl .rb .grup button:hover{border-color:var(--xlg)}
.xl .rb .sep{width:1px;height:22px;background:var(--line);margin:0 3px}
.xl .rb .tabs .qat{display:flex;gap:2px;align-items:center;margin-right:10px;padding-right:8px;border-right:1px solid var(--line)}
.xl .rb .tabs .qat button{padding:2px 8px;border-radius:4px;font-size:1.05rem;line-height:1;color:var(--ink)}
.xl .rb .tabs .qat button:hover:not(:disabled){background:var(--paper)}
.xl .rb .tabs .qat button:disabled{opacity:.35;cursor:default}
.xl .rb .meniu{position:relative;display:inline-block}
.xl .rb .meniu .m{position:absolute;top:100%;left:0;z-index:6;background:var(--paper);border:1px solid var(--line);box-shadow:0 4px 12px #0004;border-radius:4px;min-width:12em}
.xl .rb .meniu .m button{display:flex;gap:6px;align-items:center;width:100%;border:0;text-align:left;border-radius:0}
.xl .sw{display:inline-block;width:14px;height:14px;border:1px solid var(--line);border-radius:2px}
.xl .dlgs{border:1px solid var(--line);background:var(--paper);padding:10px 12px;margin-top:6px;font-size:.88rem;box-shadow:0 4px 14px #0003;border-radius:6px}
.xl .dlgs .niv{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:5px 0}
.xl .dlgs select,.xl .dlgs button{font:inherit;padding:3px 7px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink)}
.xl .dlgs .ok{background:var(--xlg);color:#fff;border-color:var(--xlg)}
.xl .graf{border:1px solid var(--line);background:var(--paper);margin-top:8px;padding:6px 8px;border-radius:4px;max-width:520px}
.xl .graf input{font:600 .95rem "Segoe UI",system-ui,sans-serif;border:1px dashed var(--line);background:transparent;color:var(--ink);text-align:center;width:100%;padding:3px}
.xl .graf svg{width:100%;height:auto;display:block}
.xl .graf .gbar{display:flex;justify-content:space-between;font-size:.78rem;color:var(--ink2)}
@media (max-width:520px){.xl td{min-width:4.2em}.xl .nb{width:4.2em}.xl .pop{left:0;max-width:100%}}`;

/* ---------------- EXERSEAZĂ PE VARIANTE (25.09.2026) ----------------
   Cercetarea (_cercetare/ritm_invatare_excel.md): după exemplu și pași ajutați, stăpânirea = 3 corecte LA RÂND pe
   variante DIFERITE; variantele schimbă numerele, numele, poziția tabelului (deci celulele-țintă), ca elevul să
   înțeleagă operația, nu să țină minte un răspuns. Verificarea e aceeași ca la sarcina de bază (pe rezultat). */
const NUME=['Andrei','Bianca','Cristi','Diana','Eric','Flavia','George','Ioana','Luca','Maria','Nicu','Oana','Radu','Sara','Tudor','Vlad'];
const rnd=n=>Math.floor(Math.random()*n);
/* Numele se schimbă DOAR în tabelele cu elevi (capul coloanei A = „Elev”/„Nume”) - produsele și cheltuielile
   (Caiet, Mâncare ...) rămân, altfel „TVA-ul caietului” cădea pe un rând „Luca” (26.09). Numele nou are același gen
   ca cel vechi, ca să se potrivească și formele din text: „notelor Anei” → „notelor Ioanei”, „lui Bogdan” → „lui Radu”
   (nu „lui Oana”). */
const MASC=new Set(['Andrei','Cristi','Eric','George','Luca','Nicu','Radu','Tudor','Vlad','Dan','Bogdan','Mihai','Matei','Ion']);
const esteFem=n=>!MASC.has(n)&&/(a|Carmen)$/.test(n);
const genitivFem=n=>/ca$/.test(n)?n.slice(0,-1)+'ăi':/a$/.test(n)?n.slice(0,-1)+'ei':n+'ei';
const CAP_ELEVI=/^(Elev|Elevul|Elevi|Nume|Numele)$/;
function mutaAdr(a,dr,dc){return String(a).replace(/(\$?)([A-Z]{1,2})(\$?)(\d+)/g,(m,d1,c,d2,r)=>{const ci=c.split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1+dc;return d1+COL(ci)+d2+(Number(r)+dr)})}
function mutaFormula(f,dr,dc){let out='',q=false,buf='';const flush=()=>{out+=buf.replace(/(^|[^A-Za-z])(\$?[A-Z]{1,2}\$?\d+)(?![A-Za-z(])/g,(m,pre,ref)=>pre+mutaAdr(ref,dr,dc));buf=''};
  for(const ch of f){if(ch==='"'){if(!q)flush();else{out+=buf;buf=''}q=!q;out+=ch;continue}buf+=ch}if(q)out+=buf;else flush();return out}
// deplasarea tabelului nu e niciodată 0,0 (altfel varianta repeta întrebarea, cuvânt cu cuvânt - raportat 26.09)
const DEPL=[[0,1],[1,0],[1,1],[2,0],[2,1]];
const colIdx=c=>c.split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1;
/* Rescrie adresele dintr-un text de sarcină: „B6”, dar și „coloana/coloanei B” și „rândul/rândului 6” (altfel textul
   rămânea B6 în timp ce verificarea aștepta celula mutată - „varianta corectă e marcată greșită”, 26.09).
   Nu atinge etichetele HTML și nici textul dintre <kbd> și </kbd> (e o tastă, ex. F4). */
function rescrieText(t,mA,mC,mR,nume){let kbd=false;return String(t||'').split(/(<[^>]*>)/).map(bucata=>{
  if(bucata.startsWith('<')){if(/^<kbd/i.test(bucata))kbd=true;else if(/^<\/kbd/i.test(bucata))kbd=false;return bucata}
  if(kbd)return bucata;
  return bucata.replace(/\$?\b[A-Z]{1,2}\$?\d{1,2}\b/g,r=>mA(r))
    .replace(/\b(coloan(?:a|ei|ele))(\s+)([A-Z]{1,2})\b/g,(m,w,s,c)=>w+s+mC(c))
    .replace(/(rând(?:ul|ului))(\s+)(\d+)\b/g,(m,w,s,n)=>w+s+mR(Number(n)))
    .replace(/[A-ZĂÂÎȘȚ][a-zăâîșț]+/g,w=>(nume&&nume[w])||w)}).join('')}
function varianta(Q){
  const [dr,dc]=DEPL[rnd(DEPL.length)],V=JSON.parse(JSON.stringify(Q.verifica||{}));
  const cells={},folosite=new Set(),nume={};
  // rândul capului „Elev”/„Nume” din coloana A; fără el, tabelul nu e cu elevi și numele nu se ating
  const capElevi=Object.entries(Q.cells||{}).filter(([a,v])=>/^A\d+$/.test(a)&&typeof v==='string'&&CAP_ELEVI.test(v.trim())).map(([a])=>Number(a.slice(1))).sort((x,y)=>x-y)[0];
  Object.entries(Q.cells||{}).forEach(([a,v])=>{let x=v;const p=a.match(/^([A-Z]+)(\d+)$/);
    if(typeof v==='number'){if(Number.isInteger(v)&&v>=1&&v<=10)x=1+rnd(10);else if(Number.isInteger(v))x=Math.max(1,Math.round(v*(0.5+Math.random())));else{const d=(String(v).split('.')[1]||'').length;x=Number((v*(0.6+Math.random()*0.8)).toFixed(d))}}
    else if(typeof v==='string'&&capElevi&&p[1]==='A'&&Number(p[2])>capElevi&&/^[A-ZĂÂÎȘȚ][a-zăâîșț]+$/.test(v)&&!/^(Suma|Media|Maxim|Minim|Total|Luni|Marți|Miercuri|Joi|Vineri|Sâmbătă|Duminică)$/.test(v)){
      if(!nume[v]){const f=esteFem(v),pool=NUME.filter(n=>esteFem(n)===f&&!folosite.has(n)),din=pool.length?pool:NUME.filter(n=>!folosite.has(n));
        const n=din[rnd(din.length)];folosite.add(n);nume[v]=n;
        if(f&&esteFem(n))nume[genitivFem(v)]=genitivFem(n)}   // „Anei” → „Ioanei”
      x=nume[v]}
    else if(typeof v==='string'&&v.startsWith('='))x=mutaFormula(v,dr,dc);
    cells[mutaAdr(a,dr,dc)]=x});
  const mA=a=>mutaAdr(a,dr,dc),mO=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k.includes(':')?k.split(':').map(mA).join(':'):mA(k),typeof v==='string'&&v.startsWith('=')?mutaFormula(v,dr,dc):v]));
  if(V.sel)V.sel=mA(V.sel);if(V.zona)V.zona=V.zona.split(':').map(mA).join(':');
  ['valori','formule','format'].forEach(k=>{if(V[k])V[k]=mO(V[k])});
  if(V.umplut)V.umplut=Object.fromEntries(Object.entries(V.umplut).map(([k,d])=>[mA(k),d.map(mA)]));
  if(V.gol)V.gol=V.gol.map(mA);if(V.imbinat)V.imbinat=V.imbinat.split(':').map(mA).join(':');
  if(V.sortat)V.sortat={...V.sortat,zona:V.sortat.zona.split(':').map(mA).join(':'),dupa:V.sortat.dupa.map(k=>({...k,col:mA(k.col+'1').replace(/\d+$/,'')}))};
  if(V.grafic)V.grafic={...V.grafic,zona:V.grafic.zona.split(':').map(mA).join(':')};
  // adresele (și în cuvinte) + numele se schimbă în tot textul sarcinii
  let q=rescrieText(Q.q,r=>mutaAdr(r,dr,dc),c=>COL(colIdx(c)+dc),n=>n+dr,nume);
  /* „Alege celula …”: mutarea tabelului păstrează aceeași celulă FAȚĂ DE TABEL, deci e aceeași întrebare.
     Varianta cere altă celulă din tabel, iar textul și verificarea se schimbă împreună. */
  if(Object.keys(V).length===1&&V.sel){
    const p=V.sel.match(/^([A-Z]+)(\d+)$/),poz=Object.keys(cells).map(a=>a.match(/^([A-Z]+)(\d+)$/)).filter(Boolean);
    if(p&&poz.length>1){
      const cs=poz.map(m=>colIdx(m[1])),rs=poz.map(m=>Number(m[2]));
      const c1=Math.min(...cs),c2=Math.max(...cs),r1=Math.min(...rs),r2=Math.max(...rs);
      // nici celula mutată, nici celula din întrebarea INIȚIALĂ (altfel textul ar ieși identic cu originalul)
      const orig=String((Q.verifica||{}).sel||'');let nc,nr,g=0;
      do{nc=c1+rnd(c2-c1+1);nr=r1+rnd(r2-r1+1);g++}
      while(g<200&&(COL(nc)+nr===V.sel||COL(nc)+nr===orig||(COL(nc)===p[1]||nr===Number(p[2]))&&rnd(3)));
      const nou=COL(nc)+nr,vc=p[1],vr=Number(p[2]);
      q=rescrieText(q,r=>r.replace(/\$/g,'')===V.sel?nou:r,c=>c===vc?COL(nc):c,n=>n===vr?nr:n,null);
      V.sel=nou;
    }
  }
  return {...Q,cells,verifica:V,q,cols:(Q.cols||6)+dc,rows:(Q.rows||8)+dr,variants:(Q.variants||[]).map(v=>mO(v))};
}
function cheiePractica(Q){let h=0;const t=(Q.q||'')+JSON.stringify(Q.verifica||{});for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;
  let p='';try{p=localStorage.getItem('learninghub_active_profile')||''}catch(e){}return 'lh_excel_exersat'+(p&&p!=='_guest'?'@'+p:'')+'|'+h.toString(36)}
function exerseaza(Q,loc,api){   // o variantă nouă, cu verificare proprie și seria de corecte
  const k=cheiePractica(Q);let st={serie:0,stapanit:false};try{st=JSON.parse(localStorage.getItem(k))||st}catch(e){}
  const Qv=varianta(Q);
  /* O singură foaie pe ecran (26.09: „nu ar trebui să se vadă și originalul și varianta - pagina devine lungă”):
     cât exersează, întrebarea și foaia sarcinii de bază stau ascunse; „Gata cu exersarea” le readuce. */
  /* 26.09 (r2): se ascund și mesajul sarcinii de bază (#fb, „Corect! +10 XP”) și „Mai departe” (#nav/#next) —
     altfel elevul vedea roșu la variantă și verde la original pe același ecran. */
  const corp=loc.parentElement,stiva=corp&&corp.closest('.stack');
  const frati=stiva?[...stiva.children].filter(x=>x!==corp&&!x.contains(loc)):[];
  const ascunse=[...(corp?corp.children:[])].filter(x=>x!==loc).concat(frati);
  ascunse.forEach(x=>{x.style.display='none'});
  loc.innerHTML=`<div class="xl-ex" style="margin-top:4px">
    <div class="row" style="justify-content:space-between;align-items:center"><div class="eyebrow">Exersează pe o variantă · serie: ${st.serie}/3 corecte la rând${st.stapanit?' · ✓ stăpânit':''}</div>
    <button class="btn ghost sm" type="button" data-exg="1">✕ Gata cu exersarea</button></div>
    <div class="q" style="margin:6px 0">${Qv.q}</div><div id="xexb"></div><div id="xexf" aria-live="polite"></div><div class="row" id="xexn"></div></div>`;
  loc.querySelector('[data-exg]').onclick=()=>{ascunse.forEach(x=>{x.style.display=''});if(loc._ofera)loc._ofera();else loc.innerHTML=''};
  try{loc.scrollIntoView({block:'start',behavior:'smooth'})}catch(e){}
  const fb=loc.querySelector('#xexf'),nav=loc.querySelector('#xexn');let gata=false;
  const apiP={esc:api.esc,shuffle:api.shuffle,done:()=>gata,attempts:()=>0,
    checkButton:fn=>{nav.innerHTML='<button class="btn primary" type="button" data-exv="1">Verifică varianta</button>';nav.querySelector('[data-exv]').onclick=()=>{if(!gata)fn()};return nav},
    resolve:(ok,msg)=>{if(ok){gata=true;st.serie++;if(st.serie>=3)st.stapanit=true;
        fb.innerHTML=`<div class="fb ok"><strong>Corect!</strong> Serie: ${st.serie}/3${st.serie>=3?' — <b>stăpânit ✓</b>. Poți merge mai departe sau mai exersa.':''}</div>`}
      else{st.serie=0;fb.innerHTML=`<div class="fb bad"><strong>Nu încă.</strong> ${msg||''} Seria o iei de la capăt.</div>`}
      try{localStorage.setItem(k,JSON.stringify(st))}catch(e){}
      if(ok){nav.innerHTML='<button class="btn" type="button" data-exa="1">🔁 Altă variantă</button>';nav.querySelector('[data-exa]').onclick=()=>exerseaza(Q,loc,api)}},
    revealButton:fn=>{if(!nav.querySelector('[data-exr]')){nav.insertAdjacentHTML('beforeend','<button class="btn ghost" type="button" data-exr="1">Arată-mi</button>');nav.querySelector('[data-exr]').onclick=fn}},
    giveUp:html=>{gata=true;st.serie=0;try{localStorage.setItem(k,JSON.stringify(st))}catch(e){}fb.innerHTML=`<div class="fb bad"><strong>Așa se face:</strong> ${html}</div>`;
      nav.innerHTML='<button class="btn" type="button" data-exa="1">🔁 Altă variantă</button>';nav.querySelector('[data-exa]').onclick=()=>exerseaza(Q,loc,api)},
    feedback:()=>{},nav:()=>nav};
  const sal=render._stare;render(Qv,loc.querySelector('#xexb'),apiP);exerseaza._stare={S:render._stare,Qv,loc};render._stare=sal;   // poarta de testare lucrează pe sarcina de bază
}

function render(Q,body,api){
  if(!document.getElementById('tip-excel-css')){const s=document.createElement('style');s.id='tip-excel-css';s.textContent=CSS;document.head.appendChild(s)}
  const cols=Q.cols||6,rows=Q.rows||8,liber=Array.isArray(Q.o);
  let mod=Q.mod||'ro';
  const RAW={};Object.entries(Q.cells||{}).forEach(([a,v])=>RAW[a]=typeof v==='number'?fmtNum(v):String(v));
  let act={c:0,r:0},fin={c:0,r:0};               // celula activă (albă) și celălalt colț al zonei
  let ed=null;                                     // editare: {mode:'enter'|'edit', pt:null|{start,end}}
  let curent='',lista=null,caret=0;                // textul în lucru; lista de funcții {items,idx,start}; poziția cursorului
  const gest=new Set(),undo=[],redo=[];
  let fillTo=null,dragSel=false,dragMutat=false,dragPt=null,ultimClic=null,apasat=null,clip=null;
  // PANGLICA (25.09.2026): formatare, sortare, grafice. FMT[adresă] = {b,i,u,fill,color,bd,al,nf,dec}
  const FMT={},MERGE=[];let GRAF=null,tab='home',meniu=null,sortDlg=null;const panglica=Q.panglica!==false;
  const CULORI={galben:'#FFE699',verde:'#C6E0B4',albastru:'#BDD7EE',portocaliu:'#F8CBAD'};
  const CULORI_TEXT={rosu:'#C00000',albastru:'#1F4E79',verde:'#375623'};

  function fmtNum(v){if(!isFinite(v))return String(v);let s=Number.isInteger(v)?String(v):String(Math.round(v*1e10)/1e10);return mod==='ro'?s.replace('.',','):s}
  function valoareScrisa(raw){
    if(raw==null||raw==='')return '';
    if(typeof raw==='number')return raw;
    if(raw.startsWith('='))return raw;
    const re=mod==='ro'?/^\s*-?\d+(,\d+)?\s*%?\s*$/:/^\s*-?\d+(\.\d+)?\s*%?\s*$/;
    if(re.test(raw)){const p=raw.includes('%');const n=Number(raw.replace('%','').replace(',','.').trim());return p?n/100:n}
    return raw;
  }
  function valoriCu(src){const memo={},stiva=new Set();const get=a=>{if(a in memo)return memo[a];const v=valoareScrisa(src[a]);
    if(typeof v==='string'&&v.startsWith('=')){if(stiva.has(a))throw Object.assign(new Error('Referință circulară'),{show:'0'});
      stiva.add(a);try{memo[a]=E().evaluate(v,get)}finally{stiva.delete(a)}return memo[a]}memo[a]=v;return v};return get}
  const valori=()=>valoriCu(RAW);
  function problemaSeparator(f){
    const fara=f.replace(/"[^"]*"/g,'""');
    if(mod==='ro'&&/[A-Za-z)\]]\s*,|,\s*[A-Za-z$"(]/.test(fara))return 'Pe setări românești, părțile unei funcții se despart cu ; (punct și virgulă), nu cu virgulă. Virgula e pentru zecimale: 12,5.';
    if(mod==='en'&&fara.includes(';'))return 'Pe setări englezești, părțile unei funcții se despart cu , (virgulă). Zecimalele se scriu cu punct: 12.5.';
    return '';
  }
  function fmtFormat(v,f){   // formatul de număr din panglică, ca în Excel (setările RO: virgulă zecimală, „lei”)
    const d=f.dec,fix=(x,k)=>{const t=x.toFixed(k);return mod==='ro'?t.replace('.',','):t};
    if(f.nf==='percent')return fix(v*100,d??0)+'%';
    if(f.nf==='currency')return mod==='ro'?fix(v,d??2)+' lei':(v<0?'-$':'$')+fix(Math.abs(v),d??2);
    if(f.nf==='number')return fix(v,d??2);
    if(d!=null)return fix(v,d);
    return fmtNum(v);
  }
  function afisat(a){
    const raw=RAW[a];if(raw==null||raw==='')return{t:'',k:''};
    try{const v=valori()(a);
      if(typeof v==='number')return{t:FMT[a]&&(FMT[a].nf||FMT[a].dec!=null)?fmtFormat(v,FMT[a]):fmtNum(v),k:'n'};
      if(typeof v==='boolean')return{t:v?'TRUE':'FALSE',k:'e'};
      return{t:String(v),k:''}}
    catch(e){return{t:e.show||'#VALUE!',k:'e er'}}
  }
  const zona=()=>({c1:Math.min(act.c,fin.c),c2:Math.max(act.c,fin.c),r1:Math.min(act.r,fin.r),r2:Math.max(act.r,fin.r)});
  const zonaTxt=()=>{const z=zona();return z.c1===z.c2&&z.r1===z.r2?adr(act.c,act.r):adr(z.c1,z.r1)+':'+adr(z.c2,z.r2)};
  // Anulare (Undo) ține toată foaia, ca Excel: conținut + formatare + îmbinări + grafic
  const instantaneu=()=>JSON.stringify({RAW,FMT,MERGE,GRAF});
  const salveaza=()=>{undo.push(instantaneu());if(undo.length>60)undo.shift();redo.length=0};
  const incarca=s=>{const o=JSON.parse(s);
    Object.keys(RAW).forEach(k=>delete RAW[k]);Object.assign(RAW,o.RAW);
    Object.keys(FMT).forEach(k=>delete FMT[k]);Object.assign(FMT,o.FMT);
    MERGE.length=0;MERGE.push(...o.MERGE);GRAF=o.GRAF};
  function anuleaza(){if(ed)termina(null);if(!undo.length)return;redo.push(instantaneu());incarca(undo.pop());gest.add('undo');meniu=null;draw()}
  function reface(){if(ed)termina(null);if(!redo.length)return;undo.push(instantaneu());incarca(redo.pop());gest.add('redo');meniu=null;draw()}

  // ---------------- desenarea ----------------
  function modAcum(){if(!ed)return 'gata';if(ed.pt||asteaptaAdresa())return 'point';return ed.mode}
  function draw(){
    const aveaFocus=document.activeElement&&document.activeElement.id==='xgw';
    const z=zona(),a=adr(act.c,act.r);
    const nume=dragSel&&dragMutat?`${z.r2-z.r1+1}R x ${z.c2-z.c1+1}C`:a;
    let h=`<div class="xl"><div class="bara"><span>Setările calculatorului:</span><span class="mod">
      <button type="button" data-mod="ro" class="${mod==='ro'?'on':''}" title="Windows în română: ; între părți, virgulă la zecimale">RO ( ; și 12,5 )</button>
      <button type="button" data-mod="en" class="${mod==='en'?'on':''}" title="Windows în engleză: , între părți, punct la zecimale">EN ( , și 12.5 )</button>
      <button type="button" data-copiaza="1" title="Copiază foaia, ca s-o lipești în Excel sau Google Sheets">📋 Copiază tabelul</button></span></div>
      ${panglica?ribbonHtml():`<div class="rb"><div class="tabs">${qatHtml()}</div></div>`}
      <div class="fx"><div class="nb" aria-label="Caseta de nume (Name Box)">${esc(nume)}</div><div class="fxl">fx</div>
      <input class="fxi" id="xfx" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Bara de formule" value="${esc(ed?curent:(RAW[a]??''))}">
      ${popHtml()}</div>
      <div class="gw" id="xgw" tabindex="0" aria-label="Foaia de calcul"><table><thead><tr><th></th>`;
    for(let c=0;c<cols;c++)h+=`<th class="${c>=z.c1&&c<=z.c2?'on':''}">${COL(c)}</th>`;
    h+='</tr></thead><tbody>';
    const ptZ=ptZona(),cz=clip&&clip.z;
    for(let r=0;r<rows;r++){h+=`<tr><th class="${r>=z.r1&&r<=z.r2?'on':''}">${r+1}</th>`;
      for(let c=0;c<cols;c++){const ad=adr(c,r);let s=afisat(ad);
        const mg=MERGE.find(m=>c>=m.c1&&c<=m.c2&&r>=m.r1&&r<=m.r2);
        if(mg&&!(c===mg.c1&&r===mg.r1))continue;
        if(ed&&c===act.c&&r===act.r)s={t:curent,k:''};
        const inZ=c>=z.c1&&c<=z.c2&&r>=z.r1&&r<=z.r2&&!(z.c1===z.c2&&z.r1===z.r2)&&!(c===act.c&&r===act.r);
        const inF=fillTo&&inFill(c,r),inP=ptZ&&c>=ptZ.c1&&c<=ptZ.c2&&r>=ptZ.r1&&r<=ptZ.r2;
        const inC=cz&&c>=cz.c1&&c<=cz.c2&&r>=cz.r1&&r<=cz.r2;
        const cls=[s.k,inZ?'z':'',c===act.c&&r===act.r?'act':'',inF?'cp':'',inP?'pt':'',inC?'mq':''].join(' ');
        const handle=!ed&&c===z.c2&&r===z.r2?'<span class="fh" data-fh="1" aria-label="Pătrățelul de umplere (trage-l)"></span>':'';
        h+=`<td class="${cls}" data-a="${ad}"${mg?` colspan="${mg.c2-mg.c1+1}" rowspan="${mg.r2-mg.r1+1}"`:''}${stil(ad,s,mg)}>${esc(s.t)}${handle}</td>`}
      h+='</tr>'}
    h+=`</tbody></table></div><div class="st" id="xst"><span>${MODE_TXT[modAcum()]}</span><span class="sd">${stare()}</span></div><div id="xdlg"></div>
      ${avertSort?`<div class="dlgs" role="dialog" aria-label="Avertisment de sortare"><b>Avertisment de sortare (Sort Warning)</b>
        Lângă selecție mai sunt date. Dacă sortezi doar ce ai selectat, rândurile se amestecă (un elev rămâne cu notele altuia).
        <div class="niv"><button class="ok" data-av="extinde">Extinde selecția (Expand the selection)</button><button data-av="curenta">Continuă cu selecția curentă (Continue with the current selection)</button><button data-av="anuleaza">Anulare</button></div></div>`:''}
      ${sortDlg?sortHtml():''}${GRAF?grafHtml():''}
      ${liber?'<div class="info">Foaia e a ta: încearcă ce vrei în ea (nu se notează), apoi alege răspunsul de mai jos.</div>':''}</div>`;
    body.querySelector('#xwrap').innerHTML=h;wire();
    if(aveaFocus&&!ed){const g=gw();if(g)g.focus({preventScroll:true})}
  }
  // ---------------- panglica ----------------
  function stil(a,s,mg){const f=FMT[a]||{};const st=[];
    if(f.b)st.push('font-weight:700');if(f.i)st.push('font-style:italic');if(f.u)st.push('text-decoration:underline');
    if(f.fill)st.push('background:'+f.fill);if(f.color)st.push('color:'+f.color);
    if(f.al||mg)st.push('text-align:'+(mg?'center':f.al));
    if(f.bd)st.push('border:1.5px solid var(--ink)');
    return st.length?` style="${st.join(';')}"`:''}
  // Bara de instrumente Acces rapid (Quick Access Toolbar): Anulare / Refacere, gri când nu ai ce anula
  function qatHtml(){return `<span class="qat" role="group" aria-label="Acces rapid (Quick Access)"><button type="button" data-ud="undo" title="Anulare (Undo) · Ctrl+Z" aria-label="Anulare (Undo)" ${undo.length?'':'disabled'}>↶</button><button type="button" data-ud="redo" title="Refacere (Redo) · Ctrl+Y" aria-label="Refacere (Redo)" ${redo.length?'':'disabled'}>↷</button></span>`}
  function ribbonHtml(){
    const T=[['home','Pornire (Home)'],['insert','Inserare (Insert)'],['data','Date (Data)']];
    let g='';
    if(tab==='home')g=`<button data-rb="b" title="Aldin (Bold) · Ctrl+B"><b>B</b></button><button data-rb="i" title="Cursiv (Italic) · Ctrl+I"><i>I</i></button><button data-rb="u" title="Subliniat (Underline) · Ctrl+U"><u>U</u></button><span class="sep"></span>
      <span class="meniu"><button data-mn="fill" title="Culoare de umplere (Fill Color)">🪣 Umplere ▾</button>${meniu==='fill'?`<div class="m">${Object.entries(CULORI).map(([n,c])=>`<button data-fill="${c}"><span class="sw" style="background:${c}"></span>${n}</button>`).join('')}<button data-fill="">Fără umplere (No Fill)</button></div>`:''}</span>
      <span class="meniu"><button data-mn="color" title="Culoarea fontului (Font Color)"><span style="text-decoration:underline;text-decoration-color:#C00000">A</span> ▾</button>${meniu==='color'?`<div class="m">${Object.entries(CULORI_TEXT).map(([n,c])=>`<button data-color="${c}"><span class="sw" style="background:${c}"></span>${n}</button>`).join('')}<button data-color="">Automat (Automatic)</button></div>`:''}</span>
      <span class="meniu"><button data-mn="bd" title="Borduri (Borders)">▦ Borduri ▾</button>${meniu==='bd'?`<div class="m"><button data-bd="all">Toate bordurile (All Borders)</button><button data-bd="">Fără borduri (No Border)</button></div>`:''}</span>
      <span class="sep"></span><button data-al="left" title="Aliniere la stânga (Align Left)">⯇≡</button><button data-al="center" title="Centrare (Center)">≡</button><button data-al="right" title="Aliniere la dreapta (Align Right)">≡⯈</button>
      <button data-rb="merge" title="Îmbinare și centrare (Merge &amp; Center)">⇔ Îmbină și centrează</button><span class="sep"></span>
      <select data-nf="1" title="Formatul numerelor (Number Format)" aria-label="Formatul numerelor"><option value="">General</option><option value="number">Număr (Number)</option><option value="currency">Monedă (Currency)</option><option value="percent">Procent (Percentage)</option></select>
      <button data-rb="dec+" title="Mai multe zecimale (Increase Decimal)">.0→.00</button><button data-rb="dec-" title="Mai puține zecimale (Decrease Decimal)">.00→.0</button>
      <span class="sep"></span><button data-rb="sum" title="Însumare automată (AutoSum)">Σ AutoSum</button>`;
    if(tab==='insert')g=`<span>Grafic din zona selectată:</span><button data-gr="column" title="Diagramă cu coloane (Column Chart)">📊 Coloane (Column)</button><button data-gr="line" title="Diagramă linie (Line Chart)">📈 Linie (Line)</button><button data-gr="pie" title="Diagramă radială (Pie Chart)">◔ Radială (Pie)</button>`;
    if(tab==='data')g=`<button data-so="asc" title="Sortare de la A la Z / de la mic la mare (Sort A to Z)">A→Z ↓</button><button data-so="desc" title="Sortare de la Z la A / de la mare la mic (Sort Z to A)">Z→A ↓</button><button data-so="dlg" title="Sortare particularizată (Custom Sort)">⇅ Sortare particularizată (Custom Sort)…</button>`;
    return `<div class="rb"><div class="tabs">${qatHtml()}${T.map(([k,t])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${t}</button>`).join('')}</div><div class="grup">${g}</div></div>`;
  }
  function peZona(fn){const z=zona();for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++){const a=adr(c,r);FMT[a]=FMT[a]||{};fn(FMT[a],a)}}
  function toate(prop){const z=zona();for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++)if(!(FMT[adr(c,r)]||{})[prop])return false;return true}
  function aplica(k,v){
    gest.add('panglica');
    if(k!=='sum')salveaza();   // AutoSum își salvează singur când se termină formula
    if(k==='b'||k==='i'||k==='u'){const on=!toate(k);peZona(f=>{if(on)f[k]=true;else delete f[k]})}
    else if(k==='fill'||k==='color'||k==='al'||k==='bd'){peZona(f=>{if(v)f[k]=v;else delete f[k]})}
    else if(k==='nf'){peZona(f=>{if(v)f.nf=v;else delete f.nf;delete f.dec})}
    else if(k==='dec+'||k==='dec-'){peZona((f,a)=>{let d=f.dec;if(d==null){const t=afisat(a).t;const m=t.match(/[.,](\d+)/);d=f.nf==='percent'?0:f.nf?2:(m?m[1].length:0)}
      d=Math.max(0,Math.min(10,d+(k==='dec+'?1:-1)));f.dec=d})}
    else if(k==='merge'){const z=zona();const i=MERGE.findIndex(m=>m.c1===z.c1&&m.r1===z.r1&&m.c2===z.c2&&m.r2===z.r2);
      if(i>=0)MERGE.splice(i,1);else if(!(z.c1===z.c2&&z.r1===z.r2)){for(let k2=MERGE.length-1;k2>=0;k2--){const m=MERGE[k2];if(!(m.c2<z.c1||m.c1>z.c2||m.r2<z.r1||m.r1>z.r2))MERGE.splice(k2,1)}MERGE.push({...z});act={c:z.c1,r:z.r1};fin={...act}}}
    else if(k==='sum'){autoSum();return}
    meniu=null;draw();
  }
  function autoSum(){   // Σ: sub o coloană de numere pune =SUM(zona de deasupra) și așteaptă Enter, ca Excel
    let r=act.r-1;const c=act.c;while(r>=0&&typeof valoareScrisa(RAW[adr(c,r)])!=='number'&&!(RAW[adr(c,r)]||'').startsWith('='))r--;
    let r2=r;while(r>=0&&(typeof valoareScrisa(RAW[adr(c,r)])==='number'||(RAW[adr(c,r)]||'').startsWith('=')))r--;
    const z=r2>=0?adr(c,r+1)+':'+adr(c,r2):'';gest.add('autosum');meniu=null;incepe('=SUM('+z+')','enter');
    if(z){ed.pt={start:5,end:5+z.length};draw();puneCursor(curent.length)}
  }
  // regiunea curentă (blocul de celule pline din jurul celulei active), ca la Sortare/Grafic în Excel
  function regiune(){const z=zona();if(!(z.c1===z.c2&&z.r1===z.r2))return z;
    let c1=act.c,c2=act.c,r1=act.r,r2=act.r,sch=true;const p=(c,r)=>c>=0&&r>=0&&c<cols&&r<rows&&plina(c,r);
    while(sch){sch=false;
      if(c1>0&&[...Array(r2-r1+1)].some((_,k)=>p(c1-1,r1+k))){c1--;sch=true}
      if(c2<cols-1&&[...Array(r2-r1+1)].some((_,k)=>p(c2+1,r1+k))){c2++;sch=true}
      if(r1>0&&[...Array(c2-c1+1)].some((_,k)=>p(c1+k,r1-1))){r1--;sch=true}
      if(r2<rows-1&&[...Array(c2-c1+1)].some((_,k)=>p(c1+k,r2+1))){r2++;sch=true}}
    return {c1,c2,r1,r2}}
  function regiuneCurenta(){const a=act,f=fin;const z0=zona();act={...a};fin={...a};const r=regiune();act=a;fin=f;return z0.c1===z0.c2&&z0.r1===z0.r2?r:r}
  let avertSort=null;   // {z (selecția), ord} cât e deschis „Sort Warning”
  function areAntet(z){const get=valori();let text=true,num=false;
    for(let c=z.c1;c<=z.c2;c++){const v=get(adr(c,z.r1));if(typeof v==='number')text=false;if(z.r2>z.r1&&typeof get(adr(c,z.r1+1))==='number')num=true}
    return text&&num}
  function sorteaza(z,chei,antet){   // chei: [{c, ord:'asc'|'desc'}]; rândurile se mută întregi (formulele cu adresele mutate)
    salveaza();const get=valori();const r0=antet?z.r1+1:z.r1;const rand=[];
    for(let r=r0;r<=z.r2;r++){const o={r,raw:{},v:{}};for(let c=z.c1;c<=z.c2;c++){o.raw[c]=RAW[adr(c,r)];let v;try{v=get(adr(c,r))}catch(e){v=''}o.v[c]=v}rand.push(o)}
    const cmp=(x,y)=>{if(x===y)return 0;if(x===''||x==null)return 1;if(y===''||y==null)return -1;
      if(typeof x==='number'&&typeof y==='number')return x-y;if(typeof x==='number')return -1;if(typeof y==='number')return 1;return String(x).localeCompare(String(y),'ro',{sensitivity:'base'})};
    rand.sort((a,b)=>{for(const k of chei){let d=cmp(a.v[k.c],b.v[k.c]);if(k.ord==='desc'&&!(a.v[k.c]===''||b.v[k.c]===''))d=-d;if(d)return d}return a.r-b.r});
    rand.forEach((o,i)=>{const r=r0+i;for(let c=z.c1;c<=z.c2;c++){const x=o.raw[c];const a=adr(c,r);
      if(x==null||x==='')delete RAW[a];else RAW[a]=typeof x==='string'&&x.startsWith('=')?E().shift(x,r-o.r,0):x}});
    gest.add('sortare');ultimaSortare={z,chei,antet};
  }
  let ultimaSortare=null;
  function sortHtml(){const z=sortDlg.z;const get=valori();
    const nume=c=>sortDlg.antet?`${String(get(adr(c,z.r1))??'')} (col. ${COL(c)})`:`Coloana ${COL(c)} (Column ${COL(c)})`;
    const opt=[];for(let c=z.c1;c<=z.c2;c++)opt.push(c);
    return `<div class="dlgs" role="dialog" aria-label="Sortare particularizată"><b>Sortare particularizată (Sort) — zona ${adr(z.c1,z.r1)}:${adr(z.c2,z.r2)}</b>
      <label style="display:block;margin:6px 0"><input type="checkbox" data-sd="antet" ${sortDlg.antet?'checked':''}> Datele mele au antet (My data has headers)</label>
      ${sortDlg.niv.map((n,i)=>`<div class="niv"><span>${i?'Apoi după (Then by)':'Sortare după (Sort by)'}</span>
        <select data-sd="col" data-i="${i}">${opt.map(c=>`<option value="${c}" ${n.c===c?'selected':''}>${esc(nume(c))}</option>`).join('')}</select>
        <select data-sd="ord" data-i="${i}"><option value="asc" ${n.ord==='asc'?'selected':''}>Crescător: A→Z, mic→mare (Smallest to Largest)</option><option value="desc" ${n.ord==='desc'?'selected':''}>Descrescător: Z→A, mare→mic (Largest to Smallest)</option></select>
        ${i?`<button data-sd="sterge" data-i="${i}">Șterge nivelul</button>`:''}</div>`).join('')}
      <div class="niv"><button data-sd="adauga">+ Adaugă nivel (Add Level)</button><span style="flex:1"></span><button class="ok" data-sd="ok">OK</button><button data-sd="anuleaza">Anulare (Cancel)</button></div></div>`}
  function grafHtml(){const d=dateGrafic(GRAF.zona);if(!d)return '';
    const W=460,H=250,P={l:36,r:10,t:10,b:44},cul=['#4472C4','#ED7D31','#A5A5A5','#FFC000'];let svg='';
    if(GRAF.tip==='pie'){const s=d.serii[0],tot=s.v.reduce((a,b)=>a+Math.max(0,b),0)||1;let u=-Math.PI/2;const cx=150,cy=H/2,R=95;
      s.v.forEach((v,i)=>{const a=Math.max(0,v)/tot*2*Math.PI;const x1=cx+R*Math.cos(u),y1=cy+R*Math.sin(u);u+=a;const x2=cx+R*Math.cos(u),y2=cy+R*Math.sin(u);
        svg+=`<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${a>Math.PI?1:0} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${['#4472C4','#ED7D31','#A5A5A5','#FFC000','#5B9BD5','#70AD47'][i%6]}" stroke="#fff"/>`;
        svg+=`<rect x="280" y="${20+i*20}" width="10" height="10" fill="${['#4472C4','#ED7D31','#A5A5A5','#FFC000','#5B9BD5','#70AD47'][i%6]}"/><text x="296" y="${29+i*20}" font-size="11" fill="currentColor">${esc(d.cat[i])}</text>`})}
    else{const toate=d.serii.flatMap(s=>s.v),mx=Math.max(1,...toate),mn=Math.min(0,...toate);const iw=W-P.l-P.r,ih=H-P.t-P.b,y=v=>P.t+ih-(v-mn)/(mx-mn)*ih;
      for(let k=0;k<=4;k++){const v=mn+(mx-mn)*k/4;svg+=`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="currentColor" stroke-opacity=".15"/><text x="${P.l-4}" y="${(y(v)+3).toFixed(1)}" font-size="10" text-anchor="end" fill="currentColor">${fmtNum(Math.round(v*10)/10)}</text>`}
      const n=d.cat.length,bw=iw/n;
      d.cat.forEach((c,i)=>svg+=`<text x="${(P.l+bw*i+bw/2).toFixed(1)}" y="${H-P.b+14}" font-size="10" text-anchor="middle" fill="currentColor">${esc(String(c).slice(0,10))}</text>`);
      d.serii.forEach((s,k)=>{
        if(GRAF.tip==='column'){const w=bw*0.7/d.serii.length;s.v.forEach((v,i)=>{const x=P.l+bw*i+bw*0.15+w*k;svg+=`<rect x="${x.toFixed(1)}" y="${Math.min(y(v),y(0)).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.abs(y(0)-y(v)).toFixed(1)}" fill="${cul[k%4]}"/>`})}
        else{svg+=`<polyline fill="none" stroke="${cul[k%4]}" stroke-width="2.5" points="${s.v.map((v,i)=>`${(P.l+bw*i+bw/2).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}"/>`+s.v.map((v,i)=>`<circle cx="${(P.l+bw*i+bw/2).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3" fill="${cul[k%4]}"/>`).join('')}});
      if(d.serii.length>1||d.serii[0].nume)svg+=d.serii.map((s,k)=>`<rect x="${P.l+k*110}" y="${H-16}" width="10" height="10" fill="${cul[k%4]}"/><text x="${P.l+k*110+14}" y="${H-7}" font-size="11" fill="currentColor">${esc(s.nume||'Seria '+(k+1))}</text>`).join('')}
    const nume={column:'Coloane (Column)',line:'Linie (Line)',pie:'Radială (Pie)'}[GRAF.tip];
    return `<div class="graf" aria-label="Grafic"><div class="gbar"><span>Grafic ${nume} · date: ${GRAF.zona}</span><button type="button" data-gr="sterge" style="font-size:.75rem">Șterge graficul</button></div>
      <input data-gt="1" value="${esc(GRAF.titlu)}" aria-label="Titlul graficului (Chart Title)" title="Scrie titlul graficului">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(GRAF.titlu)}">${svg}</svg></div>`}
  function dateGrafic(zt){const [a,b]=zt.split(':').map(pos);if(!a||!b)return null;const get=valori();const z={c1:a.c,c2:b.c,r1:a.r,r2:b.r};
    const antet=areAntet(z)||(typeof (()=>{try{return get(adr(z.c1+1<=z.c2?z.c1+1:z.c1,z.r1))}catch(e){return 0}})()==='string');
    const r0=antet?z.r1+1:z.r1;const cat=[],serii=[];
    for(let r=r0;r<=z.r2;r++){let v;try{v=get(adr(z.c1,r))}catch(e){v=''}cat.push(v===''?'':String(v))}
    for(let c=z.c1+1;c<=z.c2;c++){const s={nume:antet?String(get(adr(c,z.r1))??''):'',v:[]};for(let r=r0;r<=z.r2;r++){let v;try{v=get(adr(c,r))}catch(e){v=0}s.v.push(typeof v==='number'?v:0)}serii.push(s)}
    if(!serii.length)return null;return{cat,serii}}
  function faGrafic(tip){const z=regiune();if(z.c2===z.c1){arataDlg('Graficul are nevoie de două coloane','Selectează o coloană cu etichete (nume) și măcar o coloană cu numere, de exemplu A1:B6.');return}
    salveaza();GRAF={tip,zona:adr(z.c1,z.r1)+':'+adr(z.c2,z.r2),titlu:'Titlul diagramei (Chart Title)'};gest.add('grafic');draw()}

  function popHtml(){
    if(!ed||!curent.startsWith('='))return '';
    if(lista&&lista.items.length)return `<div class="pop lista" role="listbox" aria-label="Funcții">${lista.items.map((f,i)=>`<div class="${i===lista.idx?'on':''}" data-fn="${f}"><b>${f}</b><span>${esc(FUNC[f][1])}</span></div>`).join('')}<div class="pn">Tab = alege · ↑ ↓ = te miști în listă</div></div>`;
    const b=bula();if(!b)return '';
    const sep=mod==='ro'?'; ':', ';
    const parti=FUNC[b.f][0].map((p,i)=>i===Math.min(b.i,FUNC[b.f][0].length-1)&&p!=='…'?`<b>${p}</b>`:p).join(sep);
    return `<div class="pop bula" role="tooltip">${b.f}(${parti})<span class="ds">${esc(FUNC[b.f][1])} · pe setări ${mod.toUpperCase()} părțile se despart cu „${sep.trim()}”</span></div>`;
  }
  function bula(){   // funcția în care e cursorul și a câta parte se scrie acum
    // poziția cursorului o ținem noi (la redesenare, câmpul vechi încă are focusul și ar da poziția veche)
    const p=Math.min(caret,curent.length);const s=curent.slice(0,p);
    const st=[];let q=false,nume='';
    for(let k=0;k<s.length;k++){const ch=s[k];
      if(ch==='"'){q=!q;continue}if(q)continue;
      if(/[A-Za-z0-9_.]/.test(ch)){nume+=ch;continue}
      if(ch==='('){st.push({f:nume.toUpperCase(),i:0});nume='';continue}
      if(ch===')'){st.pop();nume='';continue}
      if((ch===','||ch===';')&&st.length){st[st.length-1].i++;nume='';continue}
      nume='';
    }
    for(let k=st.length-1;k>=0;k--)if(FUNC[st[k].f])return st[k];
    return null;
  }
  function stare(){const z=zona();if(z.c1===z.c2&&z.r1===z.r2)return '';
    const n=[];let cnt=0;for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++){let v;try{v=valori()(adr(c,r))}catch(e){v=null}if(v!==''&&v!=null)cnt++;if(typeof v==='number')n.push(v)}
    if(!cnt)return '';const s=n.reduce((a,b)=>a+b,0);
    return (n.length?`<span>Medie (Average): ${fmtNum(Math.round(s/n.length*1e4)/1e4)}</span>`:'')+`<span>Număr (Count): ${cnt}</span>`+(n.length?`<span>Sumă (Sum): ${fmtNum(Math.round(s*1e6)/1e6)}</span>`:'')}
  function inFill(c,r){const z=zona();if(!fillTo)return false;
    if(fillTo.r>z.r2)return c>=z.c1&&c<=z.c2&&r>z.r2&&r<=fillTo.r;
    if(fillTo.c>z.c2)return r>=z.r1&&r<=z.r2&&c>z.c2&&c<=fillTo.c;return false}
  function ptZona(){if(!ed||!ed.pt)return null;const m=curent.slice(ed.pt.start,ed.pt.end).split(':').map(pos);
    if(!m[0])return null;const b=m[1]||m[0];return{c1:Math.min(m[0].c,b.c),c2:Math.max(m[0].c,b.c),r1:Math.min(m[0].r,b.r),r2:Math.max(m[0].r,b.r)}}

  // ---------------- editarea ----------------
  const fx=()=>body.querySelector('#xfx'),gw=()=>body.querySelector('#xgw');
  function puneCursor(p){caret=p;const i=fx();if(!i)return;i.focus();try{i.setSelectionRange(p,p)}catch(e){}
    const w=body.querySelector('.fx');if(w&&ed){const v=w.querySelector('.pop');if(v)v.remove();w.insertAdjacentHTML('beforeend',popHtml());
      w.querySelectorAll('[data-fn]').forEach(x=>x.addEventListener('pointerdown',e2=>{e2.preventDefault();if(lista)alegeFunctia(x.dataset.fn)}))}}
  function incepe(text,mode){ultimClic=null;clip=null;ed={mode,pt:null};curent=text;lista=null;actualizeazaLista();draw();puneCursor(curent.length)}
  function asteaptaAdresa(){
    if(!ed||!curent.startsWith('=')||ed.mode==='edit')return false;const i=fx();const p=i?i.selectionStart:curent.length;
    if(ed.pt&&p===ed.pt.end)return true;
    const inainte=curent.slice(0,p).replace(/\s+$/,'');return /[=(+\-*/^&,;<>:]$/.test(inainte);
  }
  function punAdresa(txt){
    const i=fx();let p=i?i.selectionStart:curent.length,st=p;
    if(ed.pt&&p===ed.pt.end)st=ed.pt.start;
    curent=curent.slice(0,st)+txt+curent.slice(p);ed.pt={start:st,end:st+txt.length};lista=null;
    draw();puneCursor(ed.pt.end);
  }
  function actualizeazaLista(){
    lista=null;if(!ed||!curent.startsWith('='))return;
    const p=Math.min(caret,curent.length);const m=curent.slice(0,p).match(/(?:^=|[=(+\-*/^&,;<>:\s])([A-Za-z]+)$/);
    if(!m)return;const pre=m[1].toUpperCase();const items=Object.keys(FUNC).filter(f=>f.startsWith(pre)).slice(0,8);
    if(items.length&&!(items.length===1&&items[0]===pre&&curent[p]==='('))lista={items,idx:0,start:p-m[1].length,end:p};
  }
  function alegeFunctia(f){
    const t=curent.slice(0,lista.start)+f+'('+curent.slice(lista.end);const np=lista.start+f.length+1;
    curent=t;lista=null;gest.add('autocompletare');if(ed)ed.pt=null;draw();puneCursor(np);
  }
  // ca Excel la Enter: numele de funcții și adresele cu litere mari, parantezele uitate închise
  function curata(f){
    if(!f.startsWith('='))return f;
    let out='',q=false;for(const ch of f){if(ch==='"')q=!q;out+=q||ch==='"'?ch:ch.toUpperCase()}
    let d=0;q=false;for(const ch of out){if(ch==='"')q=!q;else if(!q){if(ch==='(')d++;else if(ch===')')d--}}
    if(d>0)out+=')'.repeat(d);return out;
  }
  function termina(dir,peZona){
    if(!ed)return true;
    let f=curent.trim();
    if(f.startsWith('=')){
      f=curata(f);
      const pb=problemaSeparator(f);
      if(pb){arataDlg('Există o problemă cu această formulă (There\'s a problem with this formula)',pb);return false}
      try{E().evaluate(f,()=>0)}catch(e){if(e.show==='⚠'){arataDlg('Există o problemă cu această formulă (There\'s a problem with this formula)',e.message);return false}}
    }
    salveaza();
    if(peZona){const z=zona();for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++){const t=f.startsWith('=')?E().shift(f,r-act.r,c-act.c):f;if(t==='')delete RAW[adr(c,r)];else RAW[adr(c,r)]=t}}
    else{const a=adr(act.c,act.r);if(f==='')delete RAW[a];else RAW[a]=f}
    ed=null;curent='';lista=null;if(!peZona)muta(dir);draw();gw().focus();return true;
  }
  function renunta(){ed=null;curent='';lista=null;draw();gw().focus()}
  function muta(dir,extinde){
    if(!dir)return;const d={jos:[0,1],sus:[0,-1],dreapta:[1,0],stanga:[-1,0]}[dir];
    if(extinde){fin={c:lim(fin.c+d[0],cols),r:lim(fin.r+d[1],rows)};return}
    act={c:lim(act.c+d[0],cols),r:lim(act.r+d[1],rows)};fin={...act};
  }
  const lim=(x,n)=>Math.max(0,Math.min(n-1,x));
  function arataDlg(t,m){const d=body.querySelector('#xdlg');if(d)d.innerHTML=`<div class="dlg" role="alert"><b>${esc(t)}</b>${esc(m)}</div>`}
  function f4(){
    const i=fx();const p=i.selectionStart;const re=/\$?[A-Za-z]{1,2}\$?\d+/g;let m,gasit=null;
    while((m=re.exec(curent))){if(m.index<=p&&p<=m.index+m[0].length){gasit=m;break}}
    if(!gasit)return;const g=gasit[0].match(/^(\$?)([A-Za-z]{1,2})(\$?)(\d+)$/);const st=(g[1]?2:0)+(g[3]?1:0);
    const urm={0:[1,1],3:[0,1],1:[1,0],2:[0,0]}[st];const nou=(urm[0]?'$':'')+g[2].toUpperCase()+(urm[1]?'$':'')+g[4];
    curent=curent.slice(0,gasit.index)+nou+curent.slice(gasit.index+gasit[0].length);gest.add('f4');
    const np=gasit.index+nou.length;if(ed.pt)ed.pt={start:gasit.index,end:np};draw();puneCursor(np);
  }

  // ---------------- copiere, umplere, sărituri ----------------
  function umpleDin(z,to){   // copiază zona z până la „to” (în jos sau la dreapta), adresele mutate ca în Excel
    const jos=to.r>z.r2,dr=to.c>z.c2;if(!jos&&!dr)return false;salveaza();
    for(let c=z.c1;c<=(dr?to.c:z.c2);c++)for(let r=z.r1;r<=(jos?to.r:z.r2);r++){
      if(c<=z.c2&&r<=z.r2)continue;
      const sc=dr?z.c1+((c-z.c1)%(z.c2-z.c1+1)):c,sr=jos?z.r1+((r-z.r1)%(z.r2-z.r1+1)):r;
      const src=RAW[adr(sc,sr)];if(src==null||src===''){delete RAW[adr(c,r)];continue}
      RAW[adr(c,r)]=src.startsWith('=')?E().shift(src,r-sr,c-sc):src;
    }
    return true;
  }
  function umple(){const z=zona();if(!fillTo)return;const to=fillTo;fillTo=null;
    if(umpleDin(z,to)){act={c:z.c1,r:z.r1};fin={c:to.c>z.c2?to.c:z.c2,r:to.r>z.r2?to.r:z.r2};gest.add('umple')}draw()}
  function ctrlD(jos){   // Ctrl+D: primul rând al zonei în restul zonei (o celulă singură: ia de deasupra); Ctrl+R: la dreapta
    let z=zona();
    if(z.c1===z.c2&&z.r1===z.r2){if(jos&&z.r1===0||!jos&&z.c1===0)return;z=jos?{...z,r1:z.r1-1}:{...z,c1:z.c1-1}}
    const src=jos?{c1:z.c1,c2:z.c2,r1:z.r1,r2:z.r1}:{c1:z.c1,c2:z.c1,r1:z.r1,r2:z.r2};
    if(umpleDin(src,jos?{c:z.c2,r:z.r2}:{c:z.c2,r:z.r2}))gest.add('ctrl-d');draw();
  }
  function copiaza(taie){const z=zona();clip={z,taie,date:{}};for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++)clip.date[adr(c-z.c1,r-z.r1)]=RAW[adr(c,r)]??'';
    gest.add('copiere');try{navigator.clipboard&&navigator.clipboard.writeText(tsv(z))}catch(e){}draw()}
  function lipeste(){if(!clip)return;salveaza();const z=clip.z,h=z.r2-z.r1+1,w=z.c2-z.c1+1;
    for(let dc=0;dc<w;dc++)for(let dr=0;dr<h;dr++){const v=clip.date[adr(dc,dr)];const c=act.c+dc,r=act.r+dr;if(c>=cols||r>=rows)continue;
      const t=v.startsWith('=')&&!clip.taie?E().shift(v,r-(z.r1+dr),c-(z.c1+dc)):v;if(t==='')delete RAW[adr(c,r)];else RAW[adr(c,r)]=t}
    if(clip.taie){for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++){const inDest=c>=act.c&&c<act.c+w&&r>=act.r&&r<act.r+h;if(!inDest)delete RAW[adr(c,r)]}clip=null}
    fin={c:lim(act.c+w-1,cols),r:lim(act.r+h-1,rows)};draw()}
  function plina(c,r){const v=RAW[adr(c,r)];return v!=null&&v!==''}
  function sari(dir,extinde){   // Ctrl+săgeată: până la marginea blocului de date, ca în Excel
    const d={jos:[0,1],sus:[0,-1],dreapta:[1,0],stanga:[-1,0]}[dir];let p=extinde?{...fin}:{...act};
    const urm=q=>({c:q.c+d[0],r:q.r+d[1]}),in_=q=>q.c>=0&&q.r>=0&&q.c<cols&&q.r<rows;
    let n=urm(p);if(!in_(n))return;
    if(plina(p.c,p.r)&&plina(n.c,n.r)){while(in_(urm(n))&&plina(urm(n).c,urm(n).r))n=urm(n)}
    else{while(in_(n)&&!plina(n.c,n.r)&&in_(urm(n)))n=urm(n)}
    if(extinde)fin=n;else{act=n;fin={...n}}
  }
  function tsv(z){   // textul pentru Excel/Sheets: formulele cu separatorul setării
    const L=[];for(let r=z.r1;r<=z.r2;r++){const rand=[];for(let c=z.c1;c<=z.c2;c++){const v=RAW[adr(c,r)]??'';rand.push(v.startsWith('=')&&mod==='ro'?peRO(v):v)}L.push(rand.join('\t'))}
    return L.join('\n');
  }
  function peRO(f){   // în afara ghilimelelor: „,” -> „;”, iar 0.19 -> 0,19
    let out='',q=false;for(let k=0;k<f.length;k++){const ch=f[k];if(ch==='"')q=!q;
      if(!q&&ch===',')out+=';';else if(!q&&ch==='.'&&/\d/.test(f[k-1]||'')&&/\d/.test(f[k+1]||''))out+=',';else out+=ch}
    return out;
  }
  async function copiazaTabelul(){
    let r2=0,c2=0;Object.keys(RAW).forEach(a=>{const p=pos(a);if(p&&RAW[a]!==''){r2=Math.max(r2,p.r);c2=Math.max(c2,p.c)}});
    const z={c1:0,r1:0,c2,r2},t=tsv(z);
    const html='<table>'+t.split('\n').map(l=>'<tr>'+l.split('\t').map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</table>';
    let ok=false;
    // întâi text + tabel (Sheets îl ia ca tabel), apoi doar text, apoi metoda veche - pe rând, până merge una
    try{if(navigator.clipboard&&window.ClipboardItem){await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([t],{type:'text/plain'}),'text/html':new Blob([html],{type:'text/html'})})]);ok=true}}catch(e){}
    if(!ok)try{if(navigator.clipboard){await navigator.clipboard.writeText(t);ok=true}}catch(e){}
    if(!ok){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{ok=document.execCommand('copy')}catch(e){}ta.remove()}
    const d=body.querySelector('#xdlg');if(d)d.innerHTML=`<div class="info">${ok?'Am copiat foaia. În Excel sau Google Sheets alege celula A1 și apasă Ctrl+V: vin și formulele.':'Nu am putut copia automat. Selectează celulele în Excel după ce le scrii de mână.'}</div>`;
  }

  // ---------------- evenimentele ----------------
  function celulaDin(ev){const t=(ev.target.closest?ev.target.closest('td[data-a]'):null)||document.elementFromPoint(ev.clientX,ev.clientY)?.closest?.('td[data-a]');return t?pos(t.dataset.a):null}
  function wire(){
    body.querySelectorAll('[data-mod]').forEach(b=>b.onclick=()=>{const vechi=mod;mod=b.dataset.mod;if(vechi!==mod)Object.keys(RAW).forEach(a=>{const v=convSetari(RAW[a],vechi);if(v!==null)RAW[a]=v});draw()});
    const cp=body.querySelector('[data-copiaza]');if(cp)cp.onclick=copiazaTabelul;
    const Q_=sel=>body.querySelectorAll(sel);
    // un clic în panglică între două clicuri pe aceeași celulă NU face dublu-clic (ca în Excel)
    Q_('.rb').forEach(r=>r.addEventListener('pointerdown',()=>{ultimClic=null}));
    Q_('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;meniu=null;draw()});
    Q_('[data-mn]').forEach(b=>b.onclick=()=>{meniu=meniu===b.dataset.mn?null:b.dataset.mn;draw()});
    Q_('[data-rb]').forEach(b=>b.onclick=()=>{if(ed)termina(null);aplica(b.dataset.rb)});
    Q_('[data-fill]').forEach(b=>b.onclick=()=>aplica('fill',b.dataset.fill));
    Q_('[data-color]').forEach(b=>b.onclick=()=>aplica('color',b.dataset.color));
    Q_('[data-bd]').forEach(b=>b.onclick=()=>aplica('bd',b.dataset.bd));
    Q_('[data-al]').forEach(b=>b.onclick=()=>aplica('al',b.dataset.al));
    Q_('[data-nf]').forEach(s=>{const f=FMT[adr(act.c,act.r)]||{};s.value=f.nf||'';s.onchange=()=>aplica('nf',s.value)});
    Q_('[data-gr]').forEach(b=>b.onclick=()=>{if(b.dataset.gr==='sterge'){salveaza();GRAF=null;draw()}else faGrafic(b.dataset.gr)});
    Q_('[data-ud]').forEach(b=>b.onclick=()=>{if(b.dataset.ud==='undo')anuleaza();else reface();gw().focus()});
    Q_('[data-gt]').forEach(x=>{x.addEventListener('input',()=>{if(GRAF)GRAF.titlu=x.value});x.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();gw().focus()}})});
    Q_('[data-so]').forEach(b=>b.onclick=()=>{const z=regiune();const antet=areAntet(z);
      // Excel: dacă ai selectat doar o parte dintr-un tabel (ex. o coloană) întreabă dacă extinde selecția
      const tot=regiuneCurenta();const sel=zona();
      if(b.dataset.so!=='dlg'&&!(sel.c1===sel.c2&&sel.r1===sel.r2)&&(tot.c1<sel.c1||tot.c2>sel.c2)){avertSort={z:sel,tot,ord:b.dataset.so};draw();return}
      if(b.dataset.so==='dlg'){sortDlg={z,antet,niv:[{c:act.c>=z.c1&&act.c<=z.c2?act.c:z.c1,ord:'asc'}]};draw();return}
      sorteaza(z,[{c:act.c,ord:b.dataset.so}],antet);draw()});
    Q_('[data-av]').forEach(b=>b.onclick=()=>{const a=avertSort;avertSort=null;if(!a)return draw();
      if(b.dataset.av==='extinde')sorteaza(a.tot,[{c:act.c,ord:a.ord}],areAntet(a.tot));
      else if(b.dataset.av==='curenta')sorteaza(a.z,[{c:act.c,ord:a.ord}],areAntet(a.z));draw()});
    Q_('[data-sd]').forEach(x=>{const k=x.dataset.sd,i=Number(x.dataset.i);
      if(k==='antet')x.onchange=()=>{sortDlg.antet=x.checked;draw()};
      if(k==='col')x.onchange=()=>{sortDlg.niv[i].c=Number(x.value)};
      if(k==='ord')x.onchange=()=>{sortDlg.niv[i].ord=x.value};
      if(k==='sterge')x.onclick=()=>{sortDlg.niv.splice(i,1);draw()};
      if(k==='adauga')x.onclick=()=>{sortDlg.niv.push({c:sortDlg.z.c1,ord:'asc'});draw()};
      if(k==='anuleaza')x.onclick=()=>{sortDlg=null;draw()};
      if(k==='ok')x.onclick=()=>{sorteaza(sortDlg.z,sortDlg.niv,sortDlg.antet);gest.add('sortare-dlg');sortDlg=null;draw()};});
    body.querySelectorAll('[data-fn]').forEach(x=>x.addEventListener('pointerdown',ev=>{ev.preventDefault();if(lista)alegeFunctia(x.dataset.fn)}));
    const g=gw(),i=fx();
    g.addEventListener('pointerdown',ev=>{if(api.done()&&!liber)return;ev.preventDefault();
      const fh=ev.target.closest&&ev.target.closest('[data-fh]');
      if(fh){fillTo={...fin};try{g.setPointerCapture(ev.pointerId)}catch(e){}return}
      const p=celulaDin(ev);if(!p)return;
      if(ed&&asteaptaAdresa()){dragPt=p;punAdresa(adr(p.c,p.r));gest.add('clic-adresa');return}
      if(ed&&!termina(null))return;
      const acum=Date.now(),dublu=ultimClic&&ultimClic.c===p.c&&ultimClic.r===p.r&&acum-ultimClic.t<450;
      ultimClic=null;apasat={c:p.c,r:p.r,t:acum};
      if(dublu&&!ev.shiftKey){act=p;fin=p;incepe(RAW[adr(p.c,p.r)]??'','edit');return}
      if(ev.shiftKey){fin=p}else{act=p;fin=p}dragSel=true;dragMutat=false;draw();gw().focus();
    });
    g.addEventListener('pointermove',ev=>{
      if(fillTo){const p=celulaDin(ev);if(p){const z=zona();fillTo=p.r-z.r2>=p.c-z.c2?{c:z.c2,r:Math.max(z.r2,p.r)}:{c:Math.max(z.c2,p.c),r:z.r2};draw()}return}
      if(dragPt&&ed){const p=celulaDin(ev);if(p&&(p.c!==dragPt.c||p.r!==dragPt.r)){punAdresa(adr(dragPt.c,dragPt.r)+':'+adr(p.c,p.r));gest.add('clic-adresa');gest.add('zona-mouse')}return}
      if(dragSel&&ev.buttons){const p=celulaDin(ev);if(p&&(p.c!==fin.c||p.r!==fin.r)){fin=p;dragMutat=true;apasat=null;draw()}}
    });
    const gata=()=>{const eraTras=dragSel&&dragMutat;if(fillTo)umple();dragSel=false;dragMutat=false;dragPt=null;
      if(apasat&&act.c===apasat.c&&act.r===apasat.r&&fin.c===apasat.c&&fin.r===apasat.r)ultimClic=apasat;apasat=null;
      if(eraTras)draw()};
    g.addEventListener('pointerup',gata);g.addEventListener('pointercancel',()=>{fillTo=null;dragSel=false;dragPt=null;draw()});
    g.addEventListener('keydown',ev=>{ultimClic=null;if((api.done()&&!liber)||ed)return;const k=ev.key,ctrl=ev.ctrlKey||ev.metaKey;
      if(ctrl){const kk=k.toLowerCase();
        if(kk==='d'||kk==='r'){ev.preventDefault();ctrlD(kk==='d');return}
        if(kk==='b'||kk==='i'||kk==='u'){ev.preventDefault();aplica(kk);return}
        if(kk==='c'||kk==='x'){ev.preventDefault();copiaza(kk==='x');return}
        if(kk==='v'){ev.preventDefault();lipeste();return}
        if(kk==='z'){ev.preventDefault();anuleaza();return}
        if(kk==='y'){ev.preventDefault();reface();return}
        if(kk==='a'){ev.preventDefault();act={c:0,r:0};fin={c:cols-1,r:rows-1};draw();return}
        if(k==='Home'){ev.preventDefault();act={c:0,r:0};fin={...act};draw();return}
        if(k==='End'){ev.preventDefault();let r2=0,c2=0;Object.keys(RAW).forEach(a=>{const p=pos(a);if(p&&RAW[a]!==''){r2=Math.max(r2,p.r);c2=Math.max(c2,p.c)}});act={c:c2,r:r2};fin={...act};draw();return}
        const dir={ArrowDown:'jos',ArrowUp:'sus',ArrowRight:'dreapta',ArrowLeft:'stanga'}[k];
        if(dir){ev.preventDefault();sari(dir,ev.shiftKey);draw();return}
      }
      const dir={ArrowDown:'jos',ArrowUp:'sus',ArrowRight:'dreapta',ArrowLeft:'stanga',Enter:ev.shiftKey?'sus':'jos',Tab:ev.shiftKey?'stanga':'dreapta'}[k];
      if(dir){ev.preventDefault();muta(dir,ev.shiftKey&&k.startsWith('Arrow'));draw();return}
      if(k==='Escape'){if(clip){clip=null;draw()}return}
      if(k==='Home'){ev.preventDefault();act={c:0,r:act.r};fin={...act};draw();return}
      if(k==='F2'){ev.preventDefault();incepe(RAW[adr(act.c,act.r)]??'','edit');return}
      if(k==='Delete'||k==='Backspace'){ev.preventDefault();salveaza();const z=zona();for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++)delete RAW[adr(c,r)];gest.add('delete');
        if(k==='Backspace'&&z.c1===z.c2&&z.r1===z.r2){incepe('','enter');return}draw();return}
      if(k.length===1&&!ctrl&&!ev.altKey){ev.preventDefault();gest.add('tastat-in-celula');incepe(k,'enter')}
    });
    i.addEventListener('click',()=>{if(ed)caret=i.selectionStart});
    i.addEventListener('focus',()=>{if(!ed&&!(api.done()&&!liber)){ed={mode:'edit',pt:null};curent=RAW[adr(act.c,act.r)]??'';caret=curent.length;lista=null;const s=body.querySelector('#xst span');if(s)s.textContent=MODE_TXT.edit}});
    i.addEventListener('input',()=>{curent=i.value;if(ed)ed.pt=null;const p=i.selectionStart;caret=p;actualizeazaLista();
      const cel=body.querySelector(`td[data-a="${adr(act.c,act.r)}"]`);if(cel)cel.textContent=curent;
      const w=body.querySelector('.fx');const vechi=w.querySelector('.pop');if(vechi)vechi.remove();w.insertAdjacentHTML('beforeend',popHtml());
      w.querySelectorAll('[data-fn]').forEach(x=>x.addEventListener('pointerdown',ev=>{ev.preventDefault();if(lista)alegeFunctia(x.dataset.fn)}));
      const s=body.querySelector('#xst span');if(s)s.textContent=MODE_TXT[modAcum()];
      const d=body.querySelector('#xdlg');if(d)d.innerHTML='';try{i.setSelectionRange(p,p)}catch(e){}});
    i.addEventListener('keyup',ev=>{if(ed)caret=i.selectionStart;if(ed&&/Arrow|Home|End/.test(ev.key)&&ed.mode==='edit'){const w=body.querySelector('.fx');const v=w.querySelector('.pop');if(v)v.remove();w.insertAdjacentHTML('beforeend',popHtml())}});
    i.addEventListener('keydown',ev=>{if(!ed)return;const k=ev.key;
      if(lista&&(k==='ArrowDown'||k==='ArrowUp')){ev.preventDefault();lista.idx=(lista.idx+(k==='ArrowDown'?1:lista.items.length-1))%lista.items.length;
        const w=body.querySelector('.fx');const v=w.querySelector('.pop');if(v)v.remove();w.insertAdjacentHTML('beforeend',popHtml());
        w.querySelectorAll('[data-fn]').forEach(x=>x.addEventListener('pointerdown',e2=>{e2.preventDefault();if(lista)alegeFunctia(x.dataset.fn)}));return}
      if(lista&&k==='Tab'){ev.preventDefault();alegeFunctia(lista.items[lista.idx]);return}
      if(k==='Escape'&&lista){ev.preventDefault();lista=null;draw();puneCursor(curent.length);return}
      if(k==='Enter'){ev.preventDefault();termina(ev.shiftKey?'sus':'jos',ev.ctrlKey);return}
      if(k==='Tab'){ev.preventDefault();termina(ev.shiftKey?'stanga':'dreapta');return}
      if(k==='Escape'){ev.preventDefault();renunta();return}
      if(k==='F4'){ev.preventDefault();f4();return}
      if(k==='F2'){ev.preventDefault();ed.mode=ed.mode==='edit'?'enter':'edit';ed.pt=null;const s=body.querySelector('#xst span');if(s)s.textContent=MODE_TXT[modAcum()];return}
      if(k.startsWith('Arrow')&&ed.mode==='enter'){
        const dir={ArrowDown:'jos',ArrowUp:'sus',ArrowRight:'dreapta',ArrowLeft:'stanga'}[k];
        if(asteaptaAdresa()){ev.preventDefault();
          const baza=ed.pt?pos(curent.slice(ed.pt.start,ed.pt.end).split(':')[0]):{...act};
          const d={jos:[0,1],sus:[0,-1],dreapta:[1,0],stanga:[-1,0]}[dir];const p={c:lim(baza.c+d[0],cols),r:lim(baza.r+d[1],rows)};
          punAdresa(adr(p.c,p.r));gest.add('clic-adresa');return}
        ev.preventDefault();termina(dir);
      }
    });
  }
  function convSetari(raw,din){if(typeof raw!=='string')return null;
    if(raw.startsWith('=')){   // formula scrisă pe cealaltă setare: separatorul se schimbă, ca la deschiderea fișierului pe alt PC
      let out='',q=false;for(const ch of raw){if(ch==='"')q=!q;if(!q&&din==='ro'&&ch===';')out+=',';else if(!q&&din==='en'&&ch===','&&mod==='ro')out+=';';else out+=ch}
      return out}
    const re=din==='ro'?/^-?\d+,\d+$/:/^-?\d+\.\d+$/;return re.test(raw)?raw.replace(/[.,]/,mod==='ro'?',':'.'):null}

  // ---------------- verificarea ----------------
  function probleme(){
    const V=Q.verifica||{},out=[];const cur=adr(act.c,act.r);
    if(V.sel&&cur!==V.sel)out.push(`Celula aleasă acum e ${cur}. Caută celula ${V.sel}: coloana ${V.sel.replace(/\d+/,'')}, rândul ${V.sel.replace(/\D+/,'')}.`);
    if(V.zona&&zonaTxt()!==V.zona)out.push(`Zona selectată e ${zonaTxt()}, nu ${V.zona}. Apasă pe primul colț și trage până la celălalt.`);
    const get=valori();
    Object.entries(V.valori||{}).forEach(([a,exp])=>{let v;try{v=get(a)}catch(e){v=null}
      if(typeof exp==='number'){if(typeof v!=='number'||Math.abs(v-exp)>1e-9)out.push(typeof v==='string'&&v!==''?`În ${a} ai scris „${v}”, dar Excel l-a luat ca TEXT (se vede la stânga). Pe setările ${mod.toUpperCase()} zecimalele se scriu cu ${mod==='ro'?'virgulă: '+fmtNum(exp):'punct: '+String(exp)}.`:`În ${a} trebuie numărul ${fmtNum(exp)}.`)}
      else if(String(v??'').trim().toLowerCase()!==String(exp).toLowerCase())out.push(`În ${a} trebuie scris „${exp}”.`)});
    (V.gol||[]).forEach(a=>{if(RAW[a]!=null&&RAW[a]!=='')out.push(`${a} nu e goală încă. Alege-o și apasă Delete.`)});
    const tinte=Object.assign({},V.formule||{});
    Object.entries(V.umplut||{}).forEach(([s,dest])=>dest.forEach(d=>{const a=pos(s),b=pos(d);tinte[d]=E().shift(V.formule[s],b.r-a.r,b.c-a.c)}));
    const variante=(Q.variants||[]).slice();const auto={};Object.entries(Q.cells||{}).forEach(([k,v],i)=>{if(typeof v==='number')auto[k]=v+(i%3+1)*3});variante.push(auto);
    for(const [a,tf] of Object.entries(tinte)){
      const raw=RAW[a];
      if(raw==null||raw===''){out.push(`${a} e goală.`);continue}
      if(!raw.startsWith('=')){out.push(`În ${a} ai scris ${esc(raw)}, nu o formulă: formula începe cu =.`);continue}
      if(!/\$?[A-Za-z]{1,2}\$?\d+/.test(raw)){out.push(`${a} are doar numere scrise de mână. Folosește adresele celulelor, ca rezultatul să se recalculeze.`);continue}
      let g,x;try{g=get(a)}catch(e){out.push(`${a} arată ${e.show||'o eroare'}: ${e.message}`);continue}
      const T={...RAW};Object.entries(tinte).forEach(([k,f])=>T[k]=f);
      try{x=valoriCu(T)(a)}catch(e){x=null}
      if(!la(g,x)){out.push(`${a} dă ${afis(g)}, dar ar trebui să dea ${afis(x)}.`);continue}
      for(const v of variante){const D={...RAW,...numere(v)},TD={...T,...numere(v)};let g2,x2;try{g2=valoriCu(D)(a)}catch(e){g2='#'}try{x2=valoriCu(TD)(a)}catch(e){x2='?'}
        if(!la(g2,x2)){out.push(`${a} dă rezultatul bun acum, dar greșește când se schimbă datele. Verifică adresele${V.umplut?' și semnul $':''}.`);break}}
    }
    // FORMATAREA: fiecare proprietate exact pe zona cerută (prea puțin = nu ai selectat tot; prea mult = ai formatat și în afară)
    if(V.format){const per={};Object.entries(V.format).forEach(([zt,pr])=>{const [a,b]=zt.split(':').map(pos);const B=b||a;
      for(let c=a.c;c<=B.c;c++)for(let r=a.r;r<=B.r;r++)Object.entries(pr).forEach(([k,v])=>{(per[k]=per[k]||{})[adr(c,r)]=v})});
      const NUME={b:'aldin (Bold)',i:'cursiv (Italic)',u:'subliniat',fill:'culoarea de umplere',color:'culoarea textului',bd:'bordurile',al:'alinierea',nf:'formatul numerelor',dec:'numărul de zecimale'};
      Object.entries(per).forEach(([k,cel])=>{const lipsa=[],plus=[];
        Object.entries(cel).forEach(([a,v])=>{const f=FMT[a]||{};const are=k==='dec'?(f.dec??(f.nf==='percent'?0:f.nf?2:null))===v:v===true?!!f[k]:f[k]===v;if(!are)lipsa.push(a)});
        if(['b','i','u','fill','bd'].includes(k))Object.entries(FMT).forEach(([a,f])=>{if(f[k]&&!(a in cel))plus.push(a)});
        if(lipsa.length)out.push(`${NUME[k]||k}: lipsește în ${lipsa.slice(0,4).join(', ')}${lipsa.length>4?'…':''}. Selectează toată zona cerută, apoi apasă butonul din panglică.`);
        else if(plus.length)out.push(`${NUME[k]||k} e pusă și în afara zonei cerute (${plus.slice(0,3).join(', ')}). Scoate-o de acolo sau selectează exact zona.`)});
      if(V.format.merge){}}
    if(V.imbinat&&!MERGE.some(m=>adr(m.c1,m.r1)+':'+adr(m.c2,m.r2)===V.imbinat))out.push(`Celulele ${V.imbinat} nu sunt îmbinate. Selectează-le și apasă „Îmbină și centrează” (Merge & Center).`);
    // SORTAREA: datele în ordinea cerută și rândurile rămase întregi (fiecare elev cu notele lui)
    if(V.sortat){const [a,b]=V.sortat.zona.split(':').map(pos);const r0=V.sortat.antet===false?a.r:a.r+1;const get2=valori();
      const rand=[];for(let r=r0;r<=b.r;r++){const o=[];for(let c=a.c;c<=b.c;c++){let v;try{v=get2(adr(c,r))}catch(e){v='?'}o.push(v)}rand.push(o)}
      const orig=[];const g0=valoriCu(Object.fromEntries(Object.entries(Q.cells||{}).map(([k,v])=>[k,typeof v==='number'?fmtNum(v):String(v)])));
      for(let r=r0;r<=b.r;r++){const o=[];for(let c=a.c;c<=b.c;c++){let v;try{v=g0(adr(c,r))}catch(e){v='?'}o.push(v)}orig.push(o)}
      const k=o=>o.map(x=>typeof x==='number'?x.toFixed(6):String(x)).join('|');
      const intregi=orig.map(k).sort().join('\n')===rand.map(k).sort().join('\n');
      const cmp=(x,y)=>typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'ro',{sensitivity:'base'});
      const bun=rand.every((o,i)=>{if(!i)return true;const p=rand[i-1];for(const kk of V.sortat.dupa){const c=pos(kk.col+'1').c-a.c;let d=cmp(p[c],o[c]);if(kk.ord==='desc')d=-d;if(d<0)return true;if(d>0)return false}return true});
      if(!intregi)out.push('Rândurile s-au amestecat: un elev a rămas cu datele altuia. La sortare selectezi TOT tabelul (sau doar o celulă din el), nu o singură coloană.');
      else if(!bun)out.push(`Tabelul nu e încă în ordinea cerută (${V.sortat.dupa.map(x=>'coloana '+x.col+' '+(x.ord==='desc'?'descrescător':'crescător')).join(', apoi ')}). Folosește Date (Data) → Sortare.`)}
    // GRAFICUL: tipul, zona de date, titlul
    if(V.grafic){const NG={column:'cu coloane (Column)',line:'linie (Line)',pie:'radial (Pie)'};
      if(!GRAF)out.push(`Nu există încă graficul. Selectează ${V.grafic.zona}, apoi Inserare (Insert) → ${NG[V.grafic.tip]}.`);
      else{if(GRAF.tip!==V.grafic.tip)out.push(`Graficul e ${NG[GRAF.tip]}, dar se cere ${NG[V.grafic.tip]}. Șterge-l și fă-l din nou.`);
        if(GRAF.zona!==V.grafic.zona)out.push(`Graficul ia datele din ${GRAF.zona}, dar trebuie din ${V.grafic.zona}. Selectează exact zona și refă graficul.`);
        if(V.grafic.titlu&&GRAF.titlu.trim().toLowerCase()!==V.grafic.titlu.toLowerCase())out.push(`Titlul graficului trebuie să fie „${V.grafic.titlu}”. Apasă pe titlu și scrie-l.`)}}
    (V.gest||[]).forEach(x=>{if(!gest.has(x))out.push({'clic-adresa':'De data asta pune adresele cu mouse-ul: după = (sau după +, *, ;) apasă pe celulă, nu o scrie de mână. Așa lucrezi repede și fără greșeli în Excel.',
      'umple':'Copiază formula TRĂGÂND de pătrățelul verde din colțul celulei (fill handle), ca în Excel, nu scriind-o din nou.',
      'f4':'Pune $ cu tasta F4: scrie adresa (sau apasă pe celulă) și apasă F4.','tastat-in-celula':'Alege celula și începe direct să scrii, fără să apeși în bara de formule.',
      'zona-mouse':'Selectează zona TRĂGÂND cu mouse-ul peste celule, cât scrii formula.',
      'autocompletare':'Scrie doar primele litere ale funcției (=SU) și apasă Tab: Excel o completează singur.',
      'ctrl-d':'Folosește scurtătura Ctrl+D: selectează celula cu formula și celulele de dedesubt, apoi Ctrl+D.',
      'copiere':'Copiază cu Ctrl+C și lipește cu Ctrl+V.','sortare-dlg':'Folosește fereastra Date (Data) → Sortare particularizată (Custom Sort), cu două niveluri.','autosum':'Folosește butonul Σ AutoSum din fila Pornire (Home).'}[x]||('Folosește gestul cerut: '+x))});
    return out;
  }
  const numere=v=>{const o={};Object.entries(v).forEach(([k,x])=>o[k]=typeof x==='number'?fmtNum(x):x);return o};
  const la=(a,b)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-6:String(a??'').trim().toLowerCase()===String(b??'').trim().toLowerCase();
  const afis=v=>typeof v==='number'?fmtNum(Math.round(v*1e6)/1e6):typeof v==='boolean'?(v?'TRUE':'FALSE'):(v===''||v==null?'nimic':'„'+v+'”');
  const roF=f=>mod==='ro'?peRO(f):f;
  function solutie(){const V=Q.verifica||{},s=[];
    if(V.sel)s.push(`alegi celula <b>${V.sel}</b>`);if(V.zona)s.push(`selectezi zona <b>${V.zona}</b>`);
    Object.entries(V.valori||{}).forEach(([a,v])=>s.push(`în ${a} scrii <code>${esc(typeof v==='number'?fmtNum(v):v)}</code>`));
    Object.entries(V.formule||{}).forEach(([a,f])=>s.push(`în ${a} scrii <code>${esc(roF(f))}</code>`));
    Object.entries(V.umplut||{}).forEach(([a,d])=>s.push(`tragi de colțul lui ${a} până la ${d[d.length-1]}`));
    (V.gol||[]).forEach(a=>s.push(`alegi ${a} și apeși Delete`));
    Object.entries(V.format||{}).forEach(([z,pr])=>s.push(`selectezi ${z} și pui ${Object.keys(pr).map(k=>({b:'aldin',i:'cursiv',u:'subliniat',fill:'culoare de umplere',color:'culoarea textului',bd:'toate bordurile',al:'alinierea '+pr.al,nf:'formatul '+pr.nf,dec:pr.dec+' zecimale'}[k])).join(', ')}`));
    if(V.imbinat)s.push(`selectezi ${V.imbinat} și apeși Îmbină și centrează`);
    if(V.sortat)s.push(`alegi o celulă din tabel și Date (Data) → Sortare după ${V.sortat.dupa.map(x=>'coloana '+x.col+' '+(x.ord==='desc'?'descrescător':'crescător')).join(', apoi ')}`);
    if(V.grafic)s.push(`selectezi ${V.grafic.zona} și Inserare (Insert) → grafic ${V.grafic.tip}${V.grafic.titlu?', cu titlul „'+V.grafic.titlu+'”':''}`);
    return s.join(', ')+'.'}

  // ---------------- pornirea ----------------
  body.innerHTML='<div id="xwrap"></div>'+(liber?'<div class="opts" id="xopts"></div>':'');
  draw();
  if(liber){   // „încearcă singur”: foaia liberă + variante de răspuns
    const ord=api.shuffle(Q.o.map((_,k)=>k));const o=body.querySelector('#xopts');
    o.innerHTML=ord.map(k=>`<button class="opt" type="button" data-k="${k}">${esc(Q.o[k])}</button>`).join('');
    o.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(api.done())return;const k=Number(b.dataset.k);
      if(k===Q.ok){b.classList.add('ok');api.resolve(true)}else{b.classList.add('bad');b.disabled=true;api.resolve(false,'Încearcă în foaia de mai sus și uită-te ce se întâmplă.');api.revealButton(()=>api.giveUp(esc(Q.o[Q.ok])))}});
  }else{
    api.checkButton(()=>{if(ed)termina(null);const p=probleme();
      if(!p.length){api.resolve(true);ofera()}else{api.resolve(false,p.slice(0,2).join(' '));api.revealButton(()=>api.giveUp(solutie()))}});
  }
  function ofera(){if(Q._practica)return;const loc=document.createElement('div');loc.className='xl-exloc';body.appendChild(loc);
    const k=cheiePractica(Q);
    loc._ofera=()=>{let st={};try{st=JSON.parse(localStorage.getItem(k))||{}}catch(e){}
      loc.innerHTML=`<button class="btn ghost" type="button" data-exs="1" style="margin-top:10px">🔁 Exersează pe variante${st.stapanit?' (✓ stăpânit)':' (3 la rând = stăpânit)'}</button>`;
      loc.querySelector('[data-exs]').onclick=()=>exerseaza({...Q,_practica:true},loc,api)};
    loc._ofera()}
  render._stare={FMT,MERGE,setGraf:g=>{GRAF=g},sorteaza:(zt,dupa,antet)=>{const [a,b]=zt.split(':').map(pos);sorteaza({c1:a.c,c2:b.c,r1:a.r,r2:b.r},dupa.map(k=>({c:pos(k.col+'1').c,ord:k.ord})),antet!==false)},peRO,RAW,gest,setAct:a=>{const p=pos(a);act=p;fin=p},setZona:z=>{const [x,y]=z.split(':').map(pos);act=x;fin=y},draw,mod:()=>mod,liber,Q};
}
function rezolva(Q,body,S0){
  const S=S0&&S0.RAW?S0:render._stare   // al treilea argument poate fi API-ul motorului
  ,V=Q.verifica||{};
  if(S.liber){const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.click();return}
  const ro=S.mod()==='ro';
  Object.entries(V.valori||{}).forEach(([a,v])=>S.RAW[a]=typeof v==='number'?(ro?String(v).replace('.',','):String(v)):v);
  Object.entries(V.formule||{}).forEach(([a,f])=>S.RAW[a]=ro?S.peRO(f):f);
  Object.entries(V.umplut||{}).forEach(([s,d])=>d.forEach(x=>{const a=s.match(/^([A-Z]+)(\d+)$/),b=x.match(/^([A-Z]+)(\d+)$/);
    const dc=b[1].charCodeAt(0)-a[1].charCodeAt(0),dr=Number(b[2])-Number(a[2]);S.RAW[x]=window.JocFoaie.shift(S.RAW[s],dr,dc)}));
  (V.gol||[]).forEach(a=>delete S.RAW[a]);
  (V.gest||[]).forEach(g=>S.gest.add(g));
  Object.entries(V.format||{}).forEach(([zt,pr])=>{const m=zt.split(':');const a=m[0].match(/^([A-Z]+)(\d+)$/),b=(m[1]||m[0]).match(/^([A-Z]+)(\d+)$/);
    for(let c=a[1].charCodeAt(0);c<=b[1].charCodeAt(0);c++)for(let r=Number(a[2]);r<=Number(b[2]);r++){const ad=String.fromCharCode(c)+r;S.FMT[ad]=Object.assign(S.FMT[ad]||{},pr)}});
  if(V.imbinat){const [a,b]=V.imbinat.split(':').map(x=>x.match(/^([A-Z]+)(\d+)$/));S.MERGE.push({c1:a[1].charCodeAt(0)-65,r1:Number(a[2])-1,c2:b[1].charCodeAt(0)-65,r2:Number(b[2])-1})}
  if(V.sortat)S.sorteaza(V.sortat.zona,V.sortat.dupa,V.sortat.antet);
  if(V.grafic)S.setGraf({tip:V.grafic.tip,zona:V.grafic.zona,titlu:V.grafic.titlu||'Titlul diagramei (Chart Title)'});
  if(V.sel)S.setAct(V.sel);if(V.zona)S.setZona(V.zona);
  S.draw();
}
function gresit(Q,body,S0){
  const S=S0&&S0.RAW?S0:render._stare   // al treilea argument poate fi API-ul motorului
  ,V=Q.verifica||{};
  if(S.liber){const b=body.querySelector(`.opt:not([data-k="${Q.ok}"])`);if(b)b.click();return}
  if(V.sel)S.setAct(V.sel==='A1'?'B2':'A1');
  if(V.zona)S.setAct('A1');
  Object.keys(V.valori||{}).forEach(a=>S.RAW[a]='x');
  Object.keys(V.formule||{}).forEach(a=>S.RAW[a]='=1');
  (V.gol||[]).forEach(a=>S.RAW[a]='x');
  if(V.format){const z=Object.keys(V.format)[0].split(':')[0];S.FMT['A1']={b:true};if(z==='A1')S.FMT['H9']={b:true,fill:'#FFE699',bd:'all'}}
  S.draw();
}
// pentru proba automată a exersării: rezolvă (sau greșește) varianta deschisă acum
const practica=()=>exerseaza._stare;
window.JocExcel={render,rezolva,gresit,FUNC,varianta,
  rezolvaPractica:()=>{const x=practica();rezolva(x.Qv,x.loc,x.S)},gresestePractica:()=>{const x=practica();gresit(x.Qv,x.loc,x.S)},
  practica:()=>{const x=practica();return x?{q:x.Qv.q,cells:x.Qv.cells,verifica:x.Qv.verifica}:null}};
})();
