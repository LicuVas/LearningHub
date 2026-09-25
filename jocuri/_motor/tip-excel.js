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
@media (max-width:520px){.xl td{min-width:4.2em}.xl .nb{width:4.2em}.xl .pop{left:0;max-width:100%}}`;

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
  function afisat(a){
    const raw=RAW[a];if(raw==null||raw==='')return{t:'',k:''};
    try{const v=valori()(a);
      if(typeof v==='number')return{t:fmtNum(v),k:'n'};
      if(typeof v==='boolean')return{t:v?'TRUE':'FALSE',k:'e'};
      return{t:String(v),k:''}}
    catch(e){return{t:e.show||'#VALUE!',k:'e er'}}
  }
  const zona=()=>({c1:Math.min(act.c,fin.c),c2:Math.max(act.c,fin.c),r1:Math.min(act.r,fin.r),r2:Math.max(act.r,fin.r)});
  const zonaTxt=()=>{const z=zona();return z.c1===z.c2&&z.r1===z.r2?adr(act.c,act.r):adr(z.c1,z.r1)+':'+adr(z.c2,z.r2)};
  const salveaza=()=>{undo.push(JSON.stringify(RAW));if(undo.length>60)undo.shift();redo.length=0};
  const incarca=s=>{Object.keys(RAW).forEach(k=>delete RAW[k]);Object.assign(RAW,JSON.parse(s))};

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
      <div class="fx"><div class="nb" aria-label="Caseta de nume (Name Box)">${esc(nume)}</div><div class="fxl">fx</div>
      <input class="fxi" id="xfx" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Bara de formule" value="${esc(ed?curent:(RAW[a]??''))}">
      ${popHtml()}</div>
      <div class="gw" id="xgw" tabindex="0" aria-label="Foaia de calcul"><table><thead><tr><th></th>`;
    for(let c=0;c<cols;c++)h+=`<th class="${c>=z.c1&&c<=z.c2?'on':''}">${COL(c)}</th>`;
    h+='</tr></thead><tbody>';
    const ptZ=ptZona(),cz=clip&&clip.z;
    for(let r=0;r<rows;r++){h+=`<tr><th class="${r>=z.r1&&r<=z.r2?'on':''}">${r+1}</th>`;
      for(let c=0;c<cols;c++){const ad=adr(c,r);let s=afisat(ad);
        if(ed&&c===act.c&&r===act.r)s={t:curent,k:''};
        const inZ=c>=z.c1&&c<=z.c2&&r>=z.r1&&r<=z.r2&&!(z.c1===z.c2&&z.r1===z.r2)&&!(c===act.c&&r===act.r);
        const inF=fillTo&&inFill(c,r),inP=ptZ&&c>=ptZ.c1&&c<=ptZ.c2&&r>=ptZ.r1&&r<=ptZ.r2;
        const inC=cz&&c>=cz.c1&&c<=cz.c2&&r>=cz.r1&&r<=cz.r2;
        const cls=[s.k,inZ?'z':'',c===act.c&&r===act.r?'act':'',inF?'cp':'',inP?'pt':'',inC?'mq':''].join(' ');
        const handle=!ed&&c===z.c2&&r===z.r2?'<span class="fh" data-fh="1" aria-label="Pătrățelul de umplere (trage-l)"></span>':'';
        h+=`<td class="${cls}" data-a="${ad}">${esc(s.t)}${handle}</td>`}
      h+='</tr>'}
    h+=`</tbody></table></div><div class="st" id="xst"><span>${MODE_TXT[modAcum()]}</span><span class="sd">${stare()}</span></div><div id="xdlg"></div>
      ${liber?'<div class="info">Foaia e a ta: încearcă ce vrei în ea (nu se notează), apoi alege răspunsul de mai jos.</div>':''}</div>`;
    body.querySelector('#xwrap').innerHTML=h;wire();
    if(aveaFocus&&!ed){const g=gw();if(g)g.focus({preventScroll:true})}
  }
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
        if(kk==='c'||kk==='x'){ev.preventDefault();copiaza(kk==='x');return}
        if(kk==='v'){ev.preventDefault();lipeste();return}
        if(kk==='z'){ev.preventDefault();if(undo.length){redo.push(JSON.stringify(RAW));incarca(undo.pop());draw()}return}
        if(kk==='y'){ev.preventDefault();if(redo.length){undo.push(JSON.stringify(RAW));incarca(redo.pop());draw()}return}
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
    (V.gest||[]).forEach(x=>{if(!gest.has(x))out.push({'clic-adresa':'De data asta pune adresele cu mouse-ul: după = (sau după +, *, ;) apasă pe celulă, nu o scrie de mână. Așa lucrezi repede și fără greșeli în Excel.',
      'umple':'Copiază formula TRĂGÂND de pătrățelul verde din colțul celulei (fill handle), ca în Excel, nu scriind-o din nou.',
      'f4':'Pune $ cu tasta F4: scrie adresa (sau apasă pe celulă) și apasă F4.','tastat-in-celula':'Alege celula și începe direct să scrii, fără să apeși în bara de formule.',
      'zona-mouse':'Selectează zona TRĂGÂND cu mouse-ul peste celule, cât scrii formula.',
      'autocompletare':'Scrie doar primele litere ale funcției (=SU) și apasă Tab: Excel o completează singur.',
      'ctrl-d':'Folosește scurtătura Ctrl+D: selectează celula cu formula și celulele de dedesubt, apoi Ctrl+D.',
      'copiere':'Copiază cu Ctrl+C și lipește cu Ctrl+V.'}[x]||('Folosește gestul cerut: '+x))});
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
    (V.gol||[]).forEach(a=>s.push(`alegi ${a} și apeși Delete`));return s.join(', ')+'.'}

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
      if(!p.length)api.resolve(true);else{api.resolve(false,p.slice(0,2).join(' '));api.revealButton(()=>api.giveUp(solutie()))}});
  }
  render._stare={peRO,RAW,gest,setAct:a=>{const p=pos(a);act=p;fin=p},setZona:z=>{const [x,y]=z.split(':').map(pos);act=x;fin=y},draw,mod:()=>mod,liber,Q};
}
function rezolva(Q,body){
  const S=render._stare,V=Q.verifica||{};
  if(S.liber){const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.click();return}
  const ro=S.mod()==='ro';
  Object.entries(V.valori||{}).forEach(([a,v])=>S.RAW[a]=typeof v==='number'?(ro?String(v).replace('.',','):String(v)):v);
  Object.entries(V.formule||{}).forEach(([a,f])=>S.RAW[a]=ro?S.peRO(f):f);
  Object.entries(V.umplut||{}).forEach(([s,d])=>d.forEach(x=>{const a=s.match(/^([A-Z]+)(\d+)$/),b=x.match(/^([A-Z]+)(\d+)$/);
    const dc=b[1].charCodeAt(0)-a[1].charCodeAt(0),dr=Number(b[2])-Number(a[2]);S.RAW[x]=window.JocFoaie.shift(S.RAW[s],dr,dc)}));
  (V.gol||[]).forEach(a=>delete S.RAW[a]);
  (V.gest||[]).forEach(g=>S.gest.add(g));
  if(V.sel)S.setAct(V.sel);if(V.zona)S.setZona(V.zona);
  S.draw();
}
function gresit(Q,body){
  const S=render._stare,V=Q.verifica||{};
  if(S.liber){const b=body.querySelector(`.opt:not([data-k="${Q.ok}"])`);if(b)b.click();return}
  if(V.sel)S.setAct(V.sel==='A1'?'B2':'A1');
  if(V.zona)S.setAct('A1');
  Object.keys(V.valori||{}).forEach(a=>S.RAW[a]='x');
  Object.keys(V.formule||{}).forEach(a=>S.RAW[a]='=1');
  (V.gol||[]).forEach(a=>S.RAW[a]='x');
  S.draw();
}
window.JocExcel={render,rezolva,gresit,FUNC};
})();
