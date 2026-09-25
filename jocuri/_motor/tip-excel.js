/* Tipul de întrebare „excel”: o foaie de calcul care se POARTĂ ca Excel-ul adevărat (25.09.2026).
   Regula fidelității (jocuri/README.md §1): elevul face în joc exact gesturile din Excel, ca să le poată face
   apoi pe calculator. Formulele le calculează motorul din tip-foaie.js, verificat cu oracolul Excel
   (_cercetare/oracol_excel: 189 din 190 de formule dau exact ce dă Excel; singura diferență ține de setările PC-ului).

   Ce face ca în Excel:
   - clic pe celulă = o selectezi (caseta de nume arată adresa); tragi cu mouse-ul = selectezi o zonă (B2:D2);
     Shift + clic = extinzi zona; bara de jos arată Medie / Număr / Sumă pentru zona selectată;
   - scrii direct: începi să tastezi și conținutul celulei se înlocuiește; Enter = jos, Shift+Enter = sus,
     Tab = dreapta, săgețile mută, F2 (sau dublu-clic) = modifici ce e deja scris, Esc = renunți, Delete = golești;
   - în timp ce scrii o formulă, clic pe o celulă îi pune ADRESA în formulă, tragerea pune o zonă, F4 pune $;
   - pătrățelul din colțul celulei alese (fill handle) se trage în jos / la dreapta și copiază formula,
     mutând adresele fără $ (A2 -> A3), exact ca în Excel;
   - setări RO / EN, ca pe calculatoarele din laborator: RO = părțile funcției cu „;” și zecimale cu virgulă
     (12,5); EN = „,” și punct (12.5). Un număr scris cu semnul greșit rămâne TEXT (aliniat la stânga), ca în Excel.

   Întrebare: {t:'excel', q, cols, rows, cells:{A1:'Nume',B2:8,...}, mod:'ro'|'en' (implicit ro), variants:[{B2:4}],
     verifica:{ sel:'C4' | zona:'B2:D2' | valori:{A1:'Nume',B1:12.5} | formule:{D2:'=B2*C2'} |
                umplut:{D2:['D3','D4']} | gol:['B3'] | gest:['clic-adresa','umple','f4','tastat-in-celula'] },
     why}
   Formulele din `formule` se verifică pe rezultat (pe datele date și pe date schimbate), nu pe text, ca la tip-foaie. */
(function(){
'use strict';
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).match(/^([A-Z]+)(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const E=()=>window.JocFoaie;   // motorul de formule (tip-foaie.js)

const CSS=`.xl{--xlg:#217346;font-family:"Segoe UI",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.xl .bara{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px;font-size:.85rem;color:var(--ink2)}
.xl .bara .mod{margin-left:auto;display:flex;gap:4px;align-items:center}
.xl .bara .mod button{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:5px;padding:3px 8px;font:inherit;cursor:pointer}
.xl .bara .mod button.on{background:var(--xlg);color:#fff;border-color:var(--xlg)}
.xl .fx{display:flex;border:1px solid var(--line);background:var(--paper);border-radius:4px 4px 0 0;overflow:hidden}
.xl .nb{width:5.2em;padding:6px 8px;border-right:1px solid var(--line);font-size:.9rem;background:var(--paper)}
.xl .fxl{padding:6px 8px;border-right:1px solid var(--line);color:var(--ink2);font-style:italic}
.xl .fxi{flex:1;min-width:0;border:0;padding:6px 8px;font:500 .95rem "Segoe UI",system-ui,sans-serif;background:var(--paper);color:var(--ink);user-select:text;-webkit-user-select:text}
.xl .fxi:focus{outline:2px solid var(--xlg);outline-offset:-2px}
.xl .gw{overflow:auto;border:1px solid var(--line);border-top:0;max-width:100%;outline:none}
.xl table{border-collapse:collapse;font-size:.92rem;background:var(--paper)}
.xl th{background:var(--paper2);color:var(--ink2);font-weight:500;border:1px solid var(--line);padding:2px 6px;min-width:2.2em;font-size:.8rem}
.xl th.on{background:color-mix(in srgb,var(--xlg) 22%,var(--paper2));color:var(--ink)}
.xl td{border:1px solid var(--line);min-width:5.4em;max-width:9em;height:1.9em;padding:0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;cursor:cell;color:var(--ink)}
.xl td.n{text-align:right;font-variant-numeric:tabular-nums}
.xl td.e{text-align:center;color:var(--bad)}
.xl td.z{background:color-mix(in srgb,var(--xlg) 13%,var(--paper))}
.xl td.act{outline:2px solid var(--xlg);outline-offset:-2px;background:var(--paper)}
.xl td.pt{outline:2px dashed #2b6cd8;outline-offset:-3px}
.xl td.cp{outline:1px dashed var(--xlg);outline-offset:-3px}
.xl td .fh{position:absolute;right:-1px;bottom:-1px;width:9px;height:9px;background:var(--xlg);border:1px solid var(--paper);cursor:crosshair;touch-action:none;z-index:2}
.xl .st{display:flex;justify-content:flex-end;gap:14px;font-size:.8rem;color:var(--ink2);padding:3px 6px;border:1px solid var(--line);border-top:0;background:var(--paper2);min-height:1.6em}
.xl .dlg{border:1px solid var(--line);border-left:4px solid var(--bad);background:var(--paper);padding:8px 10px;margin-top:6px;font-size:.9rem}
.xl .dlg b{display:block;margin-bottom:2px}
@media (max-width:520px){.xl td{min-width:4.2em}.xl .nb{width:4em}}`;

function render(Q,body,api){
  if(!document.getElementById('tip-excel-css')){const s=document.createElement('style');s.id='tip-excel-css';s.textContent=CSS;document.head.appendChild(s)}
  const cols=Q.cols||6,rows=Q.rows||8;
  let mod=Q.mod||'ro';
  // RAW = ce e SCRIS în celulă (ca în bara de formule); valorile se calculează din el
  const RAW={};Object.entries(Q.cells||{}).forEach(([a,v])=>RAW[a]=typeof v==='number'?fmtNum(v):String(v));
  let act={c:0,r:0},anc={c:0,r:0};              // celula activă și colțul zonei selectate
  let ed=null;                                   // editare: {mode:'enter'|'edit', pt:null|{start,end}}
  const gest=new Set();                          // gesturile făcute (pentru sarcinile care le cer)
  let fillTo=null,dragSel=false,dragPt=null,ultimClic=null,apasat=null;

  function fmtNum(v){if(!isFinite(v))return String(v);let s=Number.isInteger(v)?String(v):String(Math.round(v*1e10)/1e10);return mod==='ro'?s.replace('.',','):s}
  // ce devine un text tastat: număr (după setări), formulă sau text; exact ca Excel
  function valoareScrisa(raw){
    if(raw==null||raw==='')return '';
    if(raw.startsWith('='))return raw;
    const re=mod==='ro'?/^\s*-?\d+(,\d+)?\s*%?\s*$/:/^\s*-?\d+(\.\d+)?\s*%?\s*$/;
    if(re.test(raw)){const p=raw.includes('%');const n=Number(raw.replace('%','').replace(',','.').trim());return p?n/100:n}
    return raw;
  }
  function valori(extra){   // getter pentru motor: valorile tuturor celulelor (formulele calculate, cu paza de buclă)
    const memo={},stiva=new Set(),src={...RAW,...(extra||{})};
    const get=a=>{if(a in memo)return memo[a];const r=src[a];const v=valoareScrisa(typeof r==='number'?fmtNum(r):r);
      if(typeof v==='string'&&v.startsWith('=')){if(stiva.has(a))throw Object.assign(new Error('Referință circulară'),{show:'0'});
        stiva.add(a);try{memo[a]=E().evaluate(normal(v),get)}finally{stiva.delete(a)}return memo[a]}
      memo[a]=v;return v};
    return get;
  }
  // setările: RO cere „;” între părți, EN cere „,”. Semnul greșit = fereastra de eroare a Excel-ului
  function problemaSeparator(f){
    const fara=f.replace(/"[^"]*"/g,'""');
    if(mod==='ro'&&/[A-Za-z)\]]\s*,|,\s*[A-Za-z$"(]/.test(fara))return 'Pe setări românești, părțile unei funcții se despart cu ; (punct și virgulă), nu cu virgulă. Virgula e pentru zecimale: 12,5.';
    if(mod==='en'&&fara.includes(';'))return 'Pe setări englezești, părțile unei funcții se despart cu , (virgulă). Zecimalele se scriu cu punct: 12.5.';
    return '';
  }
  const normal=f=>f;   // motorul înțelege ambele scrieri; setările le verifică problemaSeparator
  function afisat(a){
    const raw=RAW[a];if(raw==null||raw==='')return{t:'',k:''};
    try{const v=valori()(a);
      if(typeof v==='number')return{t:fmtNum(v),k:'n'};
      if(typeof v==='boolean')return{t:v?'TRUE':'FALSE',k:'e'};
      return{t:String(v),k:''}}
    catch(e){return{t:e.show||'#VALUE!',k:'e'}}
  }
  const zona=()=>({c1:Math.min(act.c,anc.c),c2:Math.max(act.c,anc.c),r1:Math.min(act.r,anc.r),r2:Math.max(act.r,anc.r)});
  const zonaTxt=()=>{const z=zona();return z.c1===z.c2&&z.r1===z.r2?adr(act.c,act.r):adr(z.c1,z.r1)+':'+adr(z.c2,z.r2)};

  function draw(){
    // foaia se reconstruiește: dacă avea focusul (tastatura), i-l dăm înapoi, altfel Shift+săgeată, Delete, tastarea
    // după o tragere n-ar mai ajunge nicăieri
    const aveaFocus=document.activeElement&&document.activeElement.id==='xgw';
    const z=zona(),a=adr(act.c,act.r);
    let h=`<div class="xl"><div class="bara"><span>Setările calculatorului:</span><span class="mod">
      <button type="button" data-mod="ro" class="${mod==='ro'?'on':''}" title="Windows în română: ; între părți, virgulă la zecimale">RO ( ; și 12,5 )</button>
      <button type="button" data-mod="en" class="${mod==='en'?'on':''}" title="Windows în engleză: , între părți, punct la zecimale">EN ( , și 12.5 )</button></span></div>
      <div class="fx"><div class="nb" aria-label="Caseta de nume (Name Box)">${esc(zonaTxt())}</div><div class="fxl">fx</div>
      <input class="fxi" id="xfx" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Bara de formule" value="${esc(ed?curent:(RAW[a]??''))}"></div>
      <div class="gw" id="xgw" tabindex="0" aria-label="Foaia de calcul"><table><thead><tr><th></th>`;
    for(let c=0;c<cols;c++)h+=`<th class="${c>=z.c1&&c<=z.c2?'on':''}">${COL(c)}</th>`;
    h+='</tr></thead><tbody>';
    const ptZ=ptZona();
    for(let r=0;r<rows;r++){h+=`<tr><th class="${r>=z.r1&&r<=z.r2?'on':''}">${r+1}</th>`;
      for(let c=0;c<cols;c++){const ad=adr(c,r);let s=afisat(ad);
        if(ed&&c===act.c&&r===act.r)s={t:curent,k:''};
        const inZ=c>=z.c1&&c<=z.c2&&r>=z.r1&&r<=z.r2&&!(z.c1===z.c2&&z.r1===z.r2);
        const inF=fillTo&&inFill(c,r);
        const inP=ptZ&&c>=ptZ.c1&&c<=ptZ.c2&&r>=ptZ.r1&&r<=ptZ.r2;
        const cls=[s.k,inZ?'z':'',c===act.c&&r===act.r?'act':'',inF?'cp':'',inP?'pt':''].join(' ');
        const handle=!ed&&c===z.c2&&r===z.r2?'<span class="fh" data-fh="1" aria-label="Pătrățelul de umplere (trage-l)"></span>':'';
        h+=`<td class="${cls}" data-a="${ad}">${esc(s.t)}${handle}</td>`}
      h+='</tr>'}
    h+=`</tbody></table></div><div class="st" id="xst">${stare()}</div><div id="xdlg"></div></div>`;
    body.innerHTML=h;wire();
    if(aveaFocus&&!ed){const g=gw();if(g)g.focus({preventScroll:true})}
  }
  let curent='';     // textul în curs de scriere
  function stare(){const z=zona();if(z.c1===z.c2&&z.r1===z.r2)return '';
    const n=[];let cnt=0;for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++){let v;try{v=valori()(adr(c,r))}catch(e){v=null}if(v!==''&&v!=null)cnt++;if(typeof v==='number')n.push(v)}
    if(!cnt)return '';const s=n.reduce((a,b)=>a+b,0);
    return (n.length?`<span>Medie (Average): ${fmtNum(Math.round(s/n.length*1e4)/1e4)}</span>`:'')+`<span>Număr (Count): ${cnt}</span>`+(n.length?`<span>Sumă (Sum): ${fmtNum(Math.round(s*1e6)/1e6)}</span>`:'')}
  function inFill(c,r){const z=zona();if(!fillTo)return false;
    if(fillTo.r>z.r2)return c>=z.c1&&c<=z.c2&&r>z.r2&&r<=fillTo.r;
    if(fillTo.c>z.c2)return r>=z.r1&&r<=z.r2&&c>z.c2&&c<=fillTo.c;return false}
  function ptZona(){if(!ed||!ed.pt)return null;const t=curent.slice(ed.pt.start,ed.pt.end).replace(/\$/g,'');const m=t.split(':').map(pos);
    if(!m[0])return null;const b=m[1]||m[0];return{c1:Math.min(m[0].c,b.c),c2:Math.max(m[0].c,b.c),r1:Math.min(m[0].r,b.r),r2:Math.max(m[0].r,b.r)}}

  // ---------------- editarea ----------------
  const fx=()=>body.querySelector('#xfx'),gw=()=>body.querySelector('#xgw');
  function incepe(text,mode){ultimClic=null;ed={mode,pt:null};curent=text;draw();const i=fx();i.focus();try{i.setSelectionRange(curent.length,curent.length)}catch(e){}}
  function asteaptaAdresa(){   // formula așteaptă o adresă: după =, (, operator sau separator
    if(!ed||!curent.startsWith('='))return false;const i=fx();const p=i?i.selectionStart:curent.length;
    if(ed.pt&&p===ed.pt.end)return true;
    const inainte=curent.slice(0,p).replace(/\s+$/,'');return /[=(+\-*/^&,;<>:]$/.test(inainte);
  }
  function punAdresa(txt){   // pune (sau înlocuiește) adresa indicată cu mouse-ul, ca „modul de indicare” din Excel
    const i=fx();let p=i?i.selectionStart:curent.length,st=p;
    if(ed.pt&&p===ed.pt.end){st=ed.pt.start}
    curent=curent.slice(0,st)+txt+curent.slice(p);ed.pt={start:st,end:st+txt.length};
    draw();const j=fx();j.focus();try{j.setSelectionRange(ed.pt.end,ed.pt.end)}catch(e){}
  }
  function termina(dir){
    if(!ed)return;
    const f=curent.trim();
    if(f.startsWith('=')){
      const pb=problemaSeparator(f);
      if(pb){arataDlg('Există o problemă cu această formulă (There\'s a problem with this formula)',pb);return false}
      try{E().evaluate(f,()=>0)}catch(e){if(e.show==='⚠'){arataDlg('Există o problemă cu această formulă (There\'s a problem with this formula)',e.message);return false}}
    }
    const a=adr(act.c,act.r);if(f==='')delete RAW[a];else RAW[a]=f;
    ed=null;curent='';muta(dir);draw();gw().focus();return true;
  }
  function renunta(){ed=null;curent='';draw();gw().focus()}
  function muta(dir,extinde){
    if(!dir)return;const d={jos:[0,1],sus:[0,-1],dreapta:[1,0],stanga:[-1,0]}[dir];
    act={c:Math.max(0,Math.min(cols-1,act.c+d[0])),r:Math.max(0,Math.min(rows-1,act.r+d[1]))};if(!extinde)anc={...act};
  }
  function arataDlg(t,m){const d=body.querySelector('#xdlg');if(d)d.innerHTML=`<div class="dlg" role="alert"><b>${esc(t)}</b>${esc(m)}</div>`}
  function f4(){   // F4: A1 -> $A$1 -> A$1 -> $A1 -> A1 pe adresa de lângă cursor
    const i=fx();const p=i.selectionStart;const re=/\$?[A-Za-z]{1,2}\$?\d+/g;let m,gasit=null;
    while((m=re.exec(curent))){if(m.index<=p&&p<=m.index+m[0].length){gasit=m;break}}
    if(!gasit)return;const g=gasit[0].match(/^(\$?)([A-Za-z]{1,2})(\$?)(\d+)$/);const st=(g[1]?2:0)+(g[3]?1:0);
    const urm={0:[1,1],3:[0,1],1:[1,0],2:[0,0]}[st];const nou=(urm[0]?'$':'')+g[2].toUpperCase()+(urm[1]?'$':'')+g[4];
    curent=curent.slice(0,gasit.index)+nou+curent.slice(gasit.index+gasit[0].length);gest.add('f4');
    const np=gasit.index+nou.length;if(ed.pt)ed.pt={start:gasit.index,end:np};draw();const j=fx();j.focus();try{j.setSelectionRange(np,np)}catch(e){}
  }

  // ---------------- umplerea (fill handle) ----------------
  function umple(){
    const z=zona();if(!fillTo)return;const to=fillTo;fillTo=null;
    const jos=to.r>z.r2,dr=to.c>z.c2;if(!jos&&!dr){draw();return}
    for(let c=z.c1;c<=(dr?to.c:z.c2);c++)for(let r=z.r1;r<=(jos?to.r:z.r2);r++){
      if(c<=z.c2&&r<=z.r2)continue;
      const sc=dr?z.c1+((c-z.c1)%(z.c2-z.c1+1)):c,sr=jos?z.r1+((r-z.r1)%(z.r2-z.r1+1)):r;
      const src=RAW[adr(sc,sr)];if(src==null||src===''){delete RAW[adr(c,r)];continue}
      RAW[adr(c,r)]=src.startsWith('=')?E().shift(src,r-sr,c-sc):src;
    }
    anc={c:z.c1,r:z.r1};act={c:dr?to.c:z.c2,r:jos?to.r:z.r2};gest.add('umple');draw();
  }

  // ---------------- evenimentele ----------------
  function celulaDin(ev){const t=(ev.target.closest?ev.target.closest('td[data-a]'):null)||document.elementFromPoint(ev.clientX,ev.clientY)?.closest?.('td[data-a]');return t?pos(t.dataset.a):null}
  function wire(){
    body.querySelectorAll('[data-mod]').forEach(b=>b.onclick=()=>{mod=b.dataset.mod;
      Object.keys(RAW).forEach(a=>{const v=valoareScrisaAlt(RAW[a]);if(v!==null)RAW[a]=v});draw()});
    const g=gw(),i=fx();
    // preventDefault: altfel browserul mută focusul după clic (foaia tocmai s-a redesenat) și tastele ajung în
    // altă parte (prins de proba cu gesturi reale: Enter apăsa butonul din antet și ieșea din joc)
    g.addEventListener('pointerdown',ev=>{if(api.done())return;ev.preventDefault();
      const fh=ev.target.closest&&ev.target.closest('[data-fh]');
      if(fh){fillTo={...act};try{g.setPointerCapture(ev.pointerId)}catch(e){}return}
      const p=celulaDin(ev);if(!p)return;
      if(ed&&asteaptaAdresa()){dragPt=p;punAdresa(adr(p.c,p.r));gest.add('clic-adresa');return}
      if(ed&&!termina(null))return;
      // dublu-clic (îl numărăm noi: cu preventDefault, browserul nu mai trimite dblclick) = modifici celula.
      // Ca în Excel: contează doar două clicuri SIMPLE la rând pe aceeași celulă, fără nimic între ele
      // (ultimClic se șterge la orice tastă, tragere sau editare)
      const acum=Date.now(),dublu=ultimClic&&ultimClic.c===p.c&&ultimClic.r===p.r&&acum-ultimClic.t<450;
      ultimClic=null;apasat={c:p.c,r:p.r,t:acum};
      if(dublu&&!ev.shiftKey){act=p;anc=p;incepe(RAW[adr(p.c,p.r)]??'','edit');return}
      if(ev.shiftKey){act=p}else{act=p;anc=p}dragSel=true;draw();gw().focus();
    });
    g.addEventListener('pointermove',ev=>{
      if(fillTo){const p=celulaDin(ev);if(p){const z=zona();fillTo=p.r-z.r2>=p.c-z.c2?{c:z.c2,r:Math.max(z.r2,p.r)}:{c:Math.max(z.c2,p.c),r:z.r2};draw()}return}
      if(dragPt&&ed){const p=celulaDin(ev);if(p&&(p.c!==dragPt.c||p.r!==dragPt.r)){const a=adr(dragPt.c,dragPt.r),b=adr(p.c,p.r);punAdresa(a+':'+b);gest.add('clic-adresa');gest.add('zona-mouse')}return}
      if(dragSel&&ev.buttons){const p=celulaDin(ev);if(p&&(p.c!==act.c||p.r!==act.r)){act=p;apasat=null;draw()}}
    });
    const gata=()=>{if(fillTo)umple();dragSel=false;dragPt=null;
      if(apasat&&act.c===apasat.c&&act.r===apasat.r&&anc.c===apasat.c&&anc.r===apasat.r)ultimClic=apasat;apasat=null};
    g.addEventListener('pointerup',gata);g.addEventListener('pointercancel',()=>{fillTo=null;dragSel=false;dragPt=null;draw()});
    g.addEventListener('keydown',ev=>{ultimClic=null;if(api.done()||ed)return;const k=ev.key;
      const dir={ArrowDown:'jos',ArrowUp:'sus',ArrowRight:'dreapta',ArrowLeft:'stanga',Enter:ev.shiftKey?'sus':'jos',Tab:ev.shiftKey?'stanga':'dreapta'}[k];
      if(dir){ev.preventDefault();muta(dir,ev.shiftKey&&k.startsWith('Arrow'));draw();gw().focus();return}
      if(k==='F2'){ev.preventDefault();incepe(RAW[adr(act.c,act.r)]??'','edit');return}
      if(k==='Delete'||k==='Backspace'){ev.preventDefault();const z=zona();for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++)delete RAW[adr(c,r)];gest.add('delete');draw();gw().focus();return}
      if(k.length===1&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ev.preventDefault();gest.add('tastat-in-celula');anc={...act};incepe(k,'enter')}
    });
    i.addEventListener('focus',()=>{if(!ed&&!api.done()){ed={mode:'edit',pt:null};curent=RAW[adr(act.c,act.r)]??''}});
    i.addEventListener('input',()=>{curent=i.value;if(ed)ed.pt=null;const cel=body.querySelector(`td[data-a="${adr(act.c,act.r)}"]`);if(cel)cel.textContent=curent;const d=body.querySelector('#xdlg');if(d)d.innerHTML=''});
    i.addEventListener('keydown',ev=>{if(!ed)return;const k=ev.key;
      if(k==='Enter'){ev.preventDefault();termina(ev.shiftKey?'sus':'jos');return}
      if(k==='Tab'){ev.preventDefault();termina(ev.shiftKey?'stanga':'dreapta');return}
      if(k==='Escape'){ev.preventDefault();renunta();return}
      if(k==='F4'){ev.preventDefault();f4();return}
      if(k.startsWith('Arrow')&&ed.mode==='enter'){
        const dir={ArrowDown:'jos',ArrowUp:'sus',ArrowRight:'dreapta',ArrowLeft:'stanga'}[k];
        if(asteaptaAdresa()){ev.preventDefault();   // indicare cu săgețile, ca în Excel
          const baza=ed.pt?pos(curent.slice(ed.pt.start,ed.pt.end).split(':')[0].replace(/\$/g,'')):{...act};
          const d={jos:[0,1],sus:[0,-1],dreapta:[1,0],stanga:[-1,0]}[dir];const p={c:Math.max(0,Math.min(cols-1,baza.c+d[0])),r:Math.max(0,Math.min(rows-1,baza.r+d[1]))};
          punAdresa(adr(p.c,p.r));gest.add('clic-adresa');return}
        ev.preventDefault();termina(dir);
      }
    });
  }
  // la schimbarea setărilor, numerele deja scrise își schimbă semnul zecimal (12,5 <-> 12.5), ca pe alt PC
  function valoareScrisaAlt(raw){if(typeof raw!=='string'||raw.startsWith('='))return null;
    const din=mod==='ro'?/^-?\d+\.\d+$/:/^-?\d+,\d+$/;return din.test(raw)?raw.replace(/[.,]/,mod==='ro'?',':'.'):null}

  // ---------------- verificarea ----------------
  function probleme(){
    const V=Q.verifica||{},out=[];const cur=adr(act.c,act.r);
    if(V.sel&&cur!==V.sel)out.push(`Celula aleasă acum e ${zonaTxt()}. Caută celula ${V.sel}: coloana ${V.sel.replace(/\d+/,'')}, rândul ${V.sel.replace(/\D+/,'')}.`);
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
      'zona-mouse':'Selectează zona TRĂGÂND cu mouse-ul peste celule, cât scrii formula.'}[x]||('Folosește gestul cerut: '+x))});
    return out;
  }
  const numere=v=>{const o={};Object.entries(v).forEach(([k,x])=>o[k]=typeof x==='number'?fmtNum(x):x);return o};
  function valoriCu(src){const memo={},stiva=new Set();const get=a=>{if(a in memo)return memo[a];const v=valoareScrisa(src[a]);
    if(typeof v==='string'&&v.startsWith('=')){if(stiva.has(a))throw new Error('circ');stiva.add(a);try{memo[a]=E().evaluate(v,get)}finally{stiva.delete(a)}return memo[a]}memo[a]=v;return v};return get}
  const la=(a,b)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-6:String(a??'').trim().toLowerCase()===String(b??'').trim().toLowerCase();
  const afis=v=>typeof v==='number'?fmtNum(Math.round(v*1e6)/1e6):typeof v==='boolean'?(v?'TRUE':'FALSE'):(v===''||v==null?'nimic':'„'+v+'”');

  draw();
  api.checkButton(()=>{if(ed)termina(null);const p=probleme();
    if(!p.length)api.resolve(true);else{api.resolve(false,p.slice(0,2).join(' '));api.revealButton(()=>api.giveUp(solutie()))}});
  function solutie(){const V=Q.verifica||{},s=[];
    if(V.sel)s.push(`alegi celula <b>${V.sel}</b>`);if(V.zona)s.push(`selectezi zona <b>${V.zona}</b>`);
    Object.entries(V.valori||{}).forEach(([a,v])=>s.push(`în ${a} scrii <code>${esc(typeof v==='number'?fmtNum(v):v)}</code>`));
    Object.entries(V.formule||{}).forEach(([a,f])=>s.push(`în ${a} scrii <code>${esc(mod==='ro'?f.replace(/,/g,';'):f)}</code>`));
    Object.entries(V.umplut||{}).forEach(([a,d])=>s.push(`tragi de colțul lui ${a} până la ${d[d.length-1]}`));
    (V.gol||[]).forEach(a=>s.push(`alegi ${a} și apeși Delete`));return s.join(', ')+'.'}
  // pentru poarta de testare: soluția pusă direct (gesturile se consideră făcute)
  render._stare={RAW,gest,setAct:(a)=>{const p=pos(a);act=p;anc=p},setZona:(z)=>{const [x,y]=z.split(':').map(pos);anc=x;act=y},draw,mod:()=>mod};
}
function rezolva(Q,body){
  const S=render._stare,V=Q.verifica||{};
  Object.entries(V.valori||{}).forEach(([a,v])=>S.RAW[a]=typeof v==='number'?(S.mod()==='ro'?String(v).replace('.',','):String(v)):v);
  Object.entries(V.formule||{}).forEach(([a,f])=>S.RAW[a]=S.mod()==='ro'?f.replace(/,/g,';'):f);
  Object.entries(V.umplut||{}).forEach(([s,d])=>d.forEach(x=>{const a=s.match(/^([A-Z]+)(\d+)$/),b=x.match(/^([A-Z]+)(\d+)$/);
    const dc=b[1].charCodeAt(0)-a[1].charCodeAt(0),dr=Number(b[2])-Number(a[2]);S.RAW[x]=window.JocFoaie.shift(S.RAW[s],dr,dc)}));
  (V.gol||[]).forEach(a=>delete S.RAW[a]);
  (V.gest||[]).forEach(g=>S.gest.add(g));
  if(V.sel)S.setAct(V.sel);if(V.zona)S.setZona(V.zona);
  S.draw();
}
function gresit(Q,body){
  const S=render._stare,V=Q.verifica||{};
  if(V.sel)S.setAct(V.sel==='A1'?'B2':'A1');
  if(V.zona)S.setAct('A1');
  Object.keys(V.valori||{}).forEach(a=>S.RAW[a]='x');
  Object.keys(V.formule||{}).forEach(a=>S.RAW[a]='=1');
  (V.gol||[]).forEach(a=>S.RAW[a]='x');
  S.draw();
}
window.JocExcel={render,rezolva,gresit};
})();
