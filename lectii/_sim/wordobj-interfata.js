/* lectii/_sim/wordobj-interfata.js — FEREASTRA Word simulată: bara de titlu cu bara Acces rapid, panglica, riglele,
   pagina, bara de defilare, bara de stare (pagina, cuvintele, zoomul) și semnele ¶ (LearningHub, 28.09.2026).

   PROPRIETAR: autorul lecției VII · M1 · 2 („Interfața aplicației de realizare a documentelor. Instrumente de bază”).
   SE ÎNCARCĂ DUPĂ lectii/_sim/wordobj.js (Word-ul simulat al lecției 5, care NU se modifică) și după
   jocuri/_motor/ui-panglica.js + panglica-word.js (panglica reală a Word-ului instalat).
   Tipul de exercițiu: `wordui` -> tipuri:{wordui:TipWordInterfata}.

   CUM E FĂCUT: documentul din mijloc e chiar simulatorul `wordobj` (tastare, Enter, ⌫, Delete, selectare cu mouse-ul,
   cu degetul și cu Shift+săgeți, Ctrl+Z, spațiile potrivite ca în Word — probat în lecția 5). Aici se adaugă, în jurul
   lui, restul ferestrei. Faptele, probate în Word-ul REAL (Word 16.0, build 20326, instanțe noi, invizibile sau pe
   desktopul ascuns; lectii/vii/m1-l02/_proba/rezultate_*.json):
   - Bara Acces rapid, când e afișată, stă în bara de titlu, în stânga: AutoSave, Save, Undo (▾), butonul Redo/Repeat,
     ▾ Customize. Butonul al doilea își schimbă numele: „Can't Repeat” (document gol), „Repeat Typing” (după tastare),
     „Redo Typing” (după Ctrl+Z). Se afișează/ascunde din săgeata din dreapta-jos a panglicii (Ribbon Display Options)
     › Show / Hide Quick Access Toolbar. În Word-ul de pe calculatorul de probă e ASCUNSĂ (setarea implicită nouă).
   - Ctrl+Y cu ceva anulat = Refacere; FĂRĂ o anulare înainte = Repetare: după tastarea „abc” mai scrie „abc”; după ⌫
     mai șterge o literă; după Delete, la fel; după Enter mai pune un Enter. După o refacere, încă un Ctrl+Y nu mai face
     nimic. (Simulatorul lecției 5 doar reface; aici se adaugă repetarea.)
   - Un ⌫ apăsat în mijlocul tastării rupe tastarea în două operații: „merr”, ⌫, „e.” -> un Ctrl+Z scoate doar „e.”.
     (În simulatorul lecției 5, ⌫ corecta textul încă netrimis în document și Ctrl+Z scotea tot; aici ⌫ închide întâi
     tastarea, ca în Word.) Fiecare ⌫ și fiecare Delete e câte o operație (3 × ⌫ -> 3 × Ctrl+Z).
   - Butonul ¶ („Show All”, grupul Paragraph de pe Home) pornește/oprește semnele: ¶ la capătul fiecărui paragraf,
     · pentru fiecare spațiu. Textul nu se schimbă.
   - Bara de stare: „Page 1 of 1”, „N words” (numără tot ce e despărțit de spații, și „-” sau „.” singure: probat),
     cu o selecție „X of N words”; zoomul: − și + câte 10 % (100 -> 110 -> 100 -> 90 -> 80, probat), procentul.
     Zoomul mărește pagina întreagă, deci rândurile se rup la aceleași cuvinte.
   - Fila View › bifa Ruler arată/ascunde riglele (probat: ViewRulerWord comută DisplayRulers).
   - Lansatorul ↘ din colțul grupului (Paragraph...: „Paragraph Settings”) deschide fereastra grupului.
   - (28.09, după judecător) Ctrl+Z încheie întâi tastarea în curs: în wordobj.js, anularea unei tastări neîncheiate punea
     în lista de refacere documentul fără textul tastat, deci Ctrl+Y nu-l mai aducea (J2; Word: tastarea e o operație).
     Repetarea tastării merge ca tastare, nu prin W.proba.apasa („z”, „c”, „v”, „x” erau luate drept Ctrl+…; J8), iar
     mutarea cursorului nu mai uită ultima operație („abc”, ←, Ctrl+Y = „ababcc”, ca în Word).
   - (28.09) Dublu-clicul ia cuvântul CU spațiul de după; tastezi peste el și Word păstrează spațiul („Plecăm joi la
     bunici.”; judecătorul, dublu-clic real, J1). wordobj.js înlocuiește tot; aici, la prima literă, selecția de
     dublu-clic pierde spațiile de la capăt. Selecția trasă sau cu Shift+→ se înlocuiește întreagă, ca în Word.
   SEMNALAT PROPRIETARULUI wordobj.js (lecția 5): anuleaza() pe o tastare neîncheiată; tastarea peste o selecție de
   dublu-clic nu păstrează spațiul; Ctrl+Y fără anulare nu repetă.
   ABATERI SPUSE PE ECRAN: ferestrele deschise de lansatoare sunt goale (au doar titlul și OK / Cancel); fila File nu se
   deschide; glisorul zoomului nu se trage (se folosesc − și +); modurile de vizualizare nu se schimbă (lecția 3).

   CONFIGURAȚIA: {t:'wordui', q, start:['paragraf', …], unelte?:[…] (ale wordobj; implicit text, stergere, anulare),
     tinta?, verif? (testele wordobj: selectat, text/de, par…), tipic?, tipicSel?,
     ui?:{fila, pil, rigle, zoom, qat (implicit ascunsă), inaltime (px: documentul lung se derulează)}, taste?:['y','shift','sageti'],
     jos?: textul de sub fereastră ('' = nimic; implicit cel din wordobj), focus?: cursorul în document de la început,
     zoomLectie?: ce spune pagina la clic pe − / + (de ex. „Zoomul îl înveți în lecția 3.”),
     teste:[{ce, cum?, pil|rigle|zoom|qat|fila|lans|zona|cursorFinal|cursorPar|cuvinte|foloseste}],
     solutie?:{pil, rigle, zoom, qat, fila, lans:[…], zona, cursor:'fin'|N, log:[…]}, gresitUi?:{…}}
   foloseste: 'shift' (Shift+săgeată), 'sageti', 'anulare' (Ctrl+Z care a schimbat ceva), 'refacere', 'repetare'. */
(function(G){
'use strict';
const WO=G.TipWordObiecte;
if(!WO&&G.console)console.warn('wordobj-interfata.js: lipsește lectii/_sim/wordobj.js (se încarcă înainte)');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clone=d=>JSON.parse(JSON.stringify(d));
/* numele ferestrelor/panourilor deschise de lansatoare (eticheta din panglică, fără „...”) */
const LANS_RO={ParagraphDialog:['Paragraph','Paragraf','fereastra'],FontDialog:['Font','Font','fereastra'],
  ShowClipboard:['Clipboard','Clipboard','panoul'],StylesPane:['Styles','Stiluri','panoul']};
const ZONE={titlu:'bara de titlu',qat:'bara Acces rapid',panglica:'panglica',rigla:'riglă',pagina:'pagina',derulare:'bara de defilare',stare:'bara de stare'};
const cuvinte=t=>(String(t).match(/\S+/g)||[]).length;
const curat=t=>String(t||'').replace(/[-]/g,'');   // pozele din wordobj sunt caractere din zona privată
/* glisorul zoomului din Word: 10–100 % pe jumătatea stângă, 100–500 % pe cea dreaptă */
const pozZoom=z=>z<=100?(z-10)/90*50:50+(z-100)/400*50;

const CSS=`
.wu .wo-pag{border:0;border-radius:0;padding:10px;overflow:auto;scrollbar-width:none;background:#E4E7EB}
.wu .wo-pag::-webkit-scrollbar{display:none}
.wu .wo-pag.fara-rb{border:0;border-radius:0}
.wu-fer{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--paper)}
.wu-titlu{display:flex;align-items:center;gap:6px;min-height:36px;padding:2px 6px;background:var(--paper2);border-bottom:1px solid var(--line);font-family:'Segoe UI',system-ui,sans-serif;font-size:.8rem;color:var(--ink)}
.wu-w{flex:none;width:20px;height:20px;border-radius:4px;background:#2B579A;color:#fff;font-weight:700;font-size:.72rem;display:grid;place-items:center}
.wu-qat{display:flex;align-items:center;gap:2px}
.wu-qat button,.wu-ctl button{min-width:32px;min-height:32px;border:1px solid transparent;border-radius:4px;background:none;color:var(--ink);font:inherit;cursor:default;padding:0 4px}
.wu-qat button:hover,.wu-qat button:focus-visible,.wu-ctl button:hover{border-color:#2B579A;background:var(--sel)}
.wu-qat .wu-gri{opacity:.4}
.wu-qat .wu-ic{font-size:1.05rem;line-height:1}
.wu-as{font-size:.72rem}
.wu-nume{flex:1;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.wu-ctl{display:flex;gap:0}
.wu-legq{margin:0;padding:3px 8px;font-size:.76rem;background:var(--paper2);border-bottom:1px solid var(--line)}
.wu-rb{position:relative}
.wu-rb .rb.pg{--xlg:var(--accent)}
.wu .pg .pg-b,.wu .rb.pg .tabs button{cursor:default}
.wu .pg .pg-camp{overflow:visible}
.wu-cb{display:inline-flex;align-items:center;gap:3px;height:100%;padding:0 3px;border:1px solid transparent;border-radius:3px;background:var(--paper);color:var(--ink);font-family:'Segoe UI',system-ui,sans-serif;font-size:.72rem;white-space:nowrap;cursor:default;width:max-content}
.wu-cb:hover,.wu-cb:focus-visible{border-color:#2B579A;background:var(--sel)}
.wu-rdo{position:sticky;right:0;align-self:flex-end;flex:none;z-index:3;min-width:32px;min-height:32px;margin:0 2px 2px auto;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);cursor:default;font-size:.9rem;line-height:1}
.wu-leg{margin:0;padding:4px 8px;font-size:.76rem;border-top:1px solid var(--line);background:var(--paper2)}
.wu-dlg:empty{display:none}
.wu-dlg .wo-win{margin:6px}
.wu-meniu button{display:block;width:100%;text-align:left;min-height:34px;padding:4px 10px;border:1px solid transparent;border-radius:4px;background:none;color:var(--ink);font:inherit;font-size:.85rem;cursor:default}
.wu-meniu button:hover,.wu-meniu button:focus-visible{border-color:#2B579A;background:var(--sel)}
.wu-mij{display:flex;align-items:stretch;border-top:1px solid var(--line)}
.wu-slot{flex:1;min-width:0}
.wu-zoom{display:grid;grid-template-columns:16px minmax(0,1fr);grid-template-rows:auto auto;gap:0}
.wu-farar .wu-zoom{grid-template-columns:minmax(0,1fr)}
.wu-farar .wu-rh,.wu-farar .wu-rv,.wu-farar .wu-colt{display:none}
.wu-colt{background:#E4E7EB}
.wu-rh{position:sticky;top:-10px;z-index:1;height:16px;margin-bottom:4px;background:linear-gradient(90deg,#C9CDD3 0 12.1%,#fff 12.1% 87.9%,#C9CDD3 87.9%);border:1px solid #B5BCC4;font:9px/14px 'Segoe UI',system-ui,sans-serif;color:#444;overflow:hidden}
.wu-rv{position:relative;width:14px;margin-right:2px;border:1px solid #B5BCC4;background:#fff;font:9px/1 'Segoe UI',system-ui,sans-serif;color:#444;overflow:hidden}
.wu-rv .wu-mv{position:absolute;left:0;right:0;top:0;background:#C9CDD3}
.wu-rh span,.wu-rv span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.wu-rv span{left:50%;transform:translate(-50%,-50%)}
.wu .wo-doc{padding:6% 12.1%}
.wu-bara{flex:none;width:18px;display:flex;flex-direction:column;background:var(--paper2);border-left:1px solid var(--line)}
.wu-bara button{flex:none;height:32px;border:0;background:none;color:var(--ink2);font-size:.7rem;cursor:default;padding:0}
.wu-bara button:hover{background:var(--sel)}
.wu-pista{position:relative;flex:1;min-height:40px}
.wu-deget{position:absolute;left:4px;right:4px;min-height:24px;border-radius:5px;background:#9AA3AD;touch-action:none}
.wu-oriz{display:none;justify-content:space-between;background:var(--paper2);border-top:1px solid var(--line)}
.wu-oriz.on{display:flex}
.wu-oriz button{min-width:32px;min-height:28px;border:0;background:none;color:var(--ink2);cursor:default}
.wu-stare{display:flex;flex-wrap:wrap;align-items:center;gap:2px 8px;padding:2px 6px;border-top:1px solid var(--line);background:var(--paper2);font-family:'Segoe UI',system-ui,sans-serif;font-size:.74rem;color:var(--ink)}
.wu-stare button{min-height:32px;min-width:32px;padding:0 5px;border:1px solid transparent;border-radius:3px;background:none;color:var(--ink);font:inherit;cursor:default}
.wu-stare button:hover,.wu-stare button:focus-visible{border-color:#2B579A;background:var(--sel)}
.wu-sp1{flex:1}
.wu-zm{display:flex;align-items:center;gap:0}
.wu-gl{position:relative;width:90px;height:32px;cursor:default}
.wu-gl::before{content:"";position:absolute;left:0;right:0;top:15px;height:2px;background:#8A94A3}
.wu-gl::after{content:"";position:absolute;left:50%;top:10px;width:1px;height:12px;background:#8A94A3}
.wu-gl i{position:absolute;top:9px;width:6px;height:14px;margin-left:-3px;background:var(--ink);border-radius:2px}
.wu-pil .wu-sp{position:relative}
.wu-pil .wu-sp::after{content:"·";position:absolute;left:0;right:0;top:0;text-align:center;color:#4A7FC1;pointer-events:none}
.wu-pm{color:#4A7FC1;pointer-events:none}
.wu-pil .wo-pm{display:none}
.wu-pm.wo-sl{background:#C8C8C8}
.wu-teste{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:4px}
.wu-extra{display:contents}
/* pe telefon: fiecare țintă cerută de lecție are cel puțin 32 × 32 px (regula 20; judecătorul, J7): butonul ¶ crește
   peste marginile lui (deasupra vecinilor), bifa Ruler, filele, bara de defilare */
@media (max-width:760px),(pointer:coarse){
  .wu .pg-slot:has(> [data-wu="pil"]){z-index:3}
  .wu .pg [data-wu="pil"]{inset:auto!important;left:50%!important;top:50%!important;width:32px!important;height:32px!important;transform:translate(-50%,-50%);background:var(--paper);border-color:var(--line)}
  .wu .pg [data-wu="pil"].pg-on{background:var(--sel)}
  .wu .wu-cb{min-height:32px;min-width:48px;position:relative;top:50%;transform:translateY(-50%)}
  .wu .rb.pg .tabs button,.wu .rb.pg .tabs .pg-fisier{min-height:32px}
  .wu-bara{width:33px}   /* 32 px de atins + marginea din stânga */
}
/* pe telefon săgeata ⌄ nu stă peste butoane: e la capătul din dreapta al benzii (derulezi banda până la ea) */
@media (max-width:760px),(pointer:coarse){.wu-rdo{position:static}}
@media (max-width:520px){.wu-titlu .wu-nume{font-size:.72rem}.wu-gl{width:60px}.wu-ctl button+button{display:none}.wu-as .wu-ast{display:none}.wu-rh span:nth-child(even){display:none}}
`;
function stil(){if(typeof document==='undefined'||document.getElementById('wordui-css'))return;const s=document.createElement('style');s.id='wordui-css';s.textContent=CSS;document.head.appendChild(s)}

function render(Q,body,api){
  stil();
  const U=Q.ui||{},PW=G.PANGLICA_WORD,UP=G.UiPanglica;
  const TASTE=Q.taste||['y','shift','sageti'];
  const init=()=>({fila:U.fila||'TabHome',pil:!!U.pil,rigle:U.rigle!==false,zoom:U.zoom||100,qat:!!U.qat,zona:null,lans:[],
    dlg:null,log:[],redo:0,last:null});
  let S=init();
  const Q2={unelte:Q.unelte||['text','stergere','anulare'],start:Q.start||[''],tinta:Q.tinta,verif:Q.verif,tipic:Q.tipic,
    tintaCe:Q.tintaCe,tintaDupa:Q.tintaDupa,tipicSel:Q.tipicSel};
  body.innerHTML='<div class="wu"><div class="wu-in"></div></div>';
  const wu=body.querySelector('.wu'),inBody=body.querySelector('.wu-in');
  /* simulatorul lecției 5 desenează documentul; verificarea o face acest fișier (cu testele lui și cu ale ferestrei) */
  const nimic=()=>{};
  const api2=Object.assign({},api,{checkButton:()=>document.createElement('div'),resolve:nimic,revealButton:nimic,giveUp:nimic});
  WO.render(Q2,inBody,api2);
  const W=inBody._wo,woEl=inBody.querySelector('.wo'),pag=inBody.querySelector('.wo-pag'),docEl=inBody.querySelector('.wo-doc'),
    inp=inBody.querySelector('.wo-in'),kbd=inBody.querySelector('.wo-kbd'),testeIn=inBody.querySelector('.wo-teste'),notaIn=inBody.querySelector('.wo-nota');
  testeIn.style.display='none';
  if(Q.jos!=null){const h=inBody.querySelector('.wo-jos .hint');if(h){if(Q.jos)h.innerHTML=Q.jos;else h.remove()}}
  // lista testelor: aceeași înfățișare ca lista din wordobj (clasa wo-teste), pusă în locul ei
  const testeEl=document.createElement('ul');testeEl.className='wo-teste wu-teste';
  testeEl.setAttribute('aria-label','Testele sarcinii');testeIn.after(testeEl);
  /* fereastra, în jurul paginii */
  const fer=document.createElement('div');fer.className='wu-fer';
  fer.innerHTML=`<div class="wu-titlu" data-zona="titlu"><span class="wu-w" aria-hidden="true">W</span><span class="wu-qat" data-zona="qat"></span>
      <span class="wu-nume">Document1 - Word</span><span class="wu-ctl"><button type="button" data-wu="ctl" aria-label="Minimize (Minimizare)">—</button><button type="button" data-wu="ctl" aria-label="Maximize (Maximizare)">▢</button><button type="button" data-wu="ctl" aria-label="Close (Închidere)">✕</button></span></div>
    <p class="wu-legq hint"></p>
    <div class="wu-rb" data-zona="panglica"></div>
    <p class="wu-leg hint">Panglica din simulator e în engleză. Dacă Word-ul tău e în română, numele românești le găsești în textul pașilor, lângă cele englezești. Pe calculator, ține mouse-ul pe un buton ca să-i vezi numele.</p>
    <div class="wu-dlg"></div>
    <div class="wu-mij"><div class="wu-slot"></div><div class="wu-bara" data-zona="derulare" role="group" aria-label="Bara de defilare"><button type="button" data-wu="sus" aria-label="Derulează în sus">▲</button><div class="wu-pista" data-wu="pista"><span class="wu-deget"></span></div><button type="button" data-wu="jos" aria-label="Derulează în jos">▼</button></div></div>
    <div class="wu-oriz" data-zona="derulare"><button type="button" data-wu="st-o" aria-label="Derulează spre stânga">◀</button><button type="button" data-wu="dr-o" aria-label="Derulează spre dreapta">▶</button></div>
    <div class="wu-stare" data-zona="stare" role="status" aria-label="Bara de stare"></div>`;
  woEl.insertBefore(fer,pag);
  fer.querySelector('.wu-slot').appendChild(pag);
  pag.dataset.zona='pagina';
  if(U.inaltime)pag.style.maxHeight=U.inaltime+'px';
  /* riglele și pagina, în același „zoom” (Word mărește toată pagina, deci și rigla) */
  const zoomEl=document.createElement('div');zoomEl.className='wu-zoom';
  zoomEl.innerHTML='<span class="wu-colt" aria-hidden="true"></span><div class="wu-rh" data-zona="rigla" aria-label="Rigla orizontală"></div><div class="wu-rv" data-zona="rigla" aria-label="Rigla verticală"><span class="wu-mv"></span></div>';
  pag.insertBefore(zoomEl,docEl);zoomEl.appendChild(docEl);
  const rh=zoomEl.querySelector('.wu-rh'),rv=zoomEl.querySelector('.wu-rv');
  let rhHtml='';for(let k=1;k<=15;k++)rhHtml+=`<span style="left:${(12.1+k*75.8/15.92).toFixed(2)}%">${k}</span>`;
  rh.innerHTML=rhHtml;
  /* tastele în plus (pe telefon nu ai Ctrl, Shift și săgeți) */
  const extra=[];
  if(TASTE.includes('y'))extra.push('<button type="button" class="wo-k" data-wu="y" aria-label="Ctrl+Y, refacere sau repetare">Ctrl+Y</button>');
  if(TASTE.includes('sageti'))extra.push('<button type="button" class="wo-k" data-wu="k-st" aria-label="Săgeata stânga">←</button>','<button type="button" class="wo-k" data-wu="k-dr" aria-label="Săgeata dreapta">→</button>');
  if(TASTE.includes('shift'))extra.push('<button type="button" class="wo-k" data-wu="k-sst" aria-label="Shift+săgeata stânga: selecția crește spre stânga">Shift+←</button>','<button type="button" class="wo-k" data-wu="k-sdr" aria-label="Shift+săgeata dreapta: selecția crește spre dreapta">Shift+→</button>');
  if(extra.length&&kbd){
    const hk=kbd.querySelector('.wo-kh');
    const sp=document.createElement('span');sp.className='wu-extra';sp.innerHTML=extra.join('');
    if(hk)kbd.insertBefore(sp,hk);else kbd.appendChild(sp);
    if(!hk){const h=document.createElement('span');h.className='hint wo-kh';const nt=['Ctrl'].concat(TASTE.includes('shift')?['Shift']:[],TASTE.includes('sageti')?['săgețile']:[]);h.textContent=`Pe calculator merg și tastele adevărate (${nt.join(', ')}). Pe telefon nu le ai: atingi butoanele.`;kbd.appendChild(h)}
    if(kbd.classList.contains('wo-ascuns')){kbd.classList.remove('wo-ascuns');kbd.removeAttribute('aria-hidden')}
  }

  const spune=h=>{notaIn.innerHTML=h||''};
  let ultimulPointer='mouse';
  const focus=()=>{if(ultimulPointer==='mouse')inp.focus({preventScroll:true})};
  const st=()=>W.stare();
  function vdoc(s){
    s=s||st();const d=clone(s.doc);
    if(s.pend&&s.cur&&d[s.cur.b]){const b=d[s.cur.b];if(s.cur.r!=null){b.c[s.cur.r][s.cur.c]=b.c[s.cur.r][s.cur.c].slice(0,s.cur.o)+s.pend+b.c[s.cur.r][s.cur.c].slice(s.cur.o)}else b.t=b.t.slice(0,s.cur.o)+s.pend+b.t.slice(s.cur.o)}
    return d;
  }
  const textDoc=d=>d.map(b=>b.k==='p'?curat(b.t):b.c.map(r=>r.join(' ')).join(' ')).join('\n');
  const sig=()=>JSON.stringify(vdoc());   // ce se vede în document (tastarea încheiată arată la fel ca cea în curs)
  const log=x=>{S.log.push(x)};

  /* ---------------- desenul ferestrei ---------------- */
  function drawTitlu(){
    const q=fer.querySelector('.wu-qat'),lq=fer.querySelector('.wu-legq');
    if(!S.qat){q.innerHTML='';lq.hidden=true;return}
    const s=st(),poateRef=S.redo>0,rep=!poateRef&&(S.last||s.pend);
    const t2=poateRef?'Refacere (Redo) · Ctrl+Y':rep?'Repetare (Repeat) · Ctrl+Y':'Nu se poate repeta (Can\'t Repeat)';
    q.innerHTML=`<button type="button" data-wu="autosave" class="wu-as" aria-label="AutoSave"><span class="wu-ast">AutoSave </span>○</button>
      <button type="button" data-wu="save" title="Salvare (Save)" aria-label="Salvare (Save)"><span class="wu-ic" aria-hidden="true">💾</span></button>
      <button type="button" data-wu="undo" title="Anulare (Undo) · Ctrl+Z" aria-label="Anulare (Undo), Ctrl+Z"><span class="wu-ic" aria-hidden="true">↶</span></button>
      <button type="button" data-wu="y" class="${poateRef||rep?'':'wu-gri'}" title="${t2}" aria-label="${t2}"><span class="wu-ic" aria-hidden="true">${poateRef?'↷':'↻'}</span></button>
      <button type="button" data-wu="custqat" aria-label="Customize Quick Access Toolbar">⌄</button>`;
    lq.hidden=false;
    lq.innerHTML=`Bara <b>Acces rapid</b> (Quick Access Toolbar): ↶ <b>Anulare (Undo)</b>, ${poateRef?'↷ <b>Refacere (Redo)</b>':'↻ <b>Repetare (Repeat)</b>; după o anulare, butonul devine ↷ <b>Refacere (Redo)</b>'}.`;
  }
  function drawRb(){
    const rb=fer.querySelector('.wu-rb');
    if(!(PW&&UP)){rb.innerHTML='<p class="hint" style="padding:6px">Panglica nu s-a încărcat.</p>';return}
    UP.stil();
    const L={};
    PW.file.forEach(f=>f.grupuri.forEach(g=>g.butoane.forEach(b=>{
      if(b.lansator){const r=LANS_RO[b.id],n=r?r[0]:g.eticheta;L[b.id]={attr:`data-wu="lans" data-id="${esc(b.id)}" data-n="${esc(n)}"`,title:`Lansatorul casetei de dialog: deschide ${r&&r[2]==='panoul'?'panoul':'fereastra'} ${n}${r&&r[1]!==r[0]?` (${r[1]})`:''}`}}
    })));
    L.ParagraphMarks={attr:'data-wu="pil"',title:'Afișare/Ascundere ¶ (Show All)',clasa:S.pil?'pg-on':''};
    L.ViewRulerWord={html:`<button type="button" class="wu-cb" data-wu="rigla" role="checkbox" aria-checked="${S.rigle}" aria-label="Riglă (Ruler)">${S.rigle?'☑':'☐'} Ruler</button>`,title:'Riglă (Ruler)'};
    rb.innerHTML=UP.html(PW,{fila:S.fila,legaturi:L,fisier:'<button type="button" class="pg-fisier" data-wu="fisier">File</button>'});
    const banda=rb.querySelector('.pg-banda');
    if(banda)banda.insertAdjacentHTML('beforeend',`<button type="button" class="wu-rdo" data-wu="rdo" title="Opțiuni afișare panglică (Ribbon Display Options)" aria-label="Opțiuni afișare panglică (Ribbon Display Options)" aria-expanded="${S.dlg==='rdo'}">⌄</button>`);
  }
  function drawDlg(){
    const el=fer.querySelector('.wu-dlg'),D=S.dlg;
    if(!D){el.innerHTML='';return}
    if(D==='rdo'){el.innerHTML=`<div class="wo-win wu-meniu" role="menu" aria-label="Opțiuni afișare panglică (Ribbon Display Options)">
        <button type="button" role="menuitem" data-wu="nesim-m" data-n="Full-screen mode">Full-screen mode</button>
        <button type="button" role="menuitem" data-wu="nesim-m" data-n="Show tabs only">Show tabs only</button>
        <button type="button" role="menuitem" data-wu="nesim-m" data-n="Always show Ribbon">Always show Ribbon</button>
        <button type="button" role="menuitem" data-wu="qat">${S.qat?'Hide Quick Access Toolbar<span class="wo-ro">Ascundere bară de instrumente Acces rapid</span>':'Show Quick Access Toolbar<span class="wo-ro">Afișare bară de instrumente Acces rapid</span>'}</button></div>`;return}
    if(D==='fisier'){el.innerHTML=`<div class="wo-win" role="dialog" aria-label="Fila Fișier (File)"><div class="wo-wt"><span>File (Fișier)</span><button type="button" data-wu="x" aria-label="Închide">✕</button></div>
        <p class="wo-wp">În Word, fila <b>Fișier (File)</b> deschide o pagină cu comenzile pentru tot documentul: <b>New (Nou)</b>, <b>Open (Deschidere)</b>, <b>Save As (Salvare ca)</b>, <b>Print (Imprimare)</b>. O folosești în lecția 3. În simulator pagina nu se deschide.</p></div>`;return}
    const r=LANS_RO[D.id],n=D.n,panou=r&&r[2]==='panoul';
    el.innerHTML=`<div class="wo-win" role="dialog" aria-label="${panou?'Panoul':'Fereastra'} ${esc(n)}"><div class="wo-wt"><span>${esc(n)}${r&&r[1]!==r[0]?` <span class="wo-ro" style="display:inline">(${esc(r[1])})</span>`:''}</span><button type="button" data-wu="x" aria-label="Închide">✕</button></div>
      <p class="wo-wp">${panou?`În Word se deschide <b>panoul ${esc(n)}</b>, lângă pagină`:`În Word se deschide <b>fereastra ${esc(n)}</b>, cu toate opțiunile grupului, și cele care nu încap pe panglică`}. În simulator ${panou?'panoul':'fereastra'} e ${panou?'gol':'goală'}: ${panou?'îl':'o'} închizi cu ${panou?'✕':'OK sau Cancel (Anulare)'}.</p>
      <div class="wo-wb"><button type="button" class="wo-bt pr" data-wu="x">OK</button><button type="button" class="wo-bt" data-wu="x">Cancel</button></div></div>`;
  }
  function drawRigle(){
    fer.classList.toggle('wu-farar',!S.rigle);
    if(!S.rigle)return;
    const w=docEl.offsetWidth||300,cm=w/21,h=docEl.offsetHeight||200;
    const mv=rv.querySelector('.wu-mv');mv.style.height=(w*0.06)+'px';   // marginea de sus = spațiul de sus al paginii (6 % din lățime)
    let s='';const top=w*0.06;for(let k=1;top+k*cm<h-6;k++)s+=`<span style="top:${(top+k*cm).toFixed(1)}px">${k}</span>`;
    rv.querySelectorAll('span:not(.wu-mv)').forEach(x=>x.remove());rv.insertAdjacentHTML('beforeend',s);
  }
  function aplicaZoom(){zoomEl.style.zoom=String(S.zoom/100)}
  function drawStare(){
    const s=st(),d=vdoc(s),n=cuvinte(textDoc(d)),sel=s.sel?cuvinte(curat(s.sel)):0;
    const cw=sel?`${sel} of ${n} words`:`${n} ${n===1?'word':'words'}`;
    fer.querySelector('.wu-stare').innerHTML=`<button type="button" data-wu="pagina" aria-label="Page Number: Page 1 of 1">Page 1 of 1</button><span class="wu-cw" aria-label="Word Count: ${cw}">${cw}</span><span class="wu-sp1"></span>
      <button type="button" data-wu="vedere" aria-label="Read Mode" title="Read Mode">📖</button><button type="button" data-wu="vedere" aria-label="Print Layout" title="Print Layout" aria-pressed="true">📄</button><button type="button" data-wu="vedere" aria-label="Web Layout" title="Web Layout">🌐</button>
      <span class="wu-zm"><button type="button" data-wu="zoom-" aria-label="Zoom Out (micșorezi cu 10 %)" title="Zoom Out">−</button><span class="wu-gl" data-wu="glisor" role="img" aria-label="Glisorul zoomului"><i style="left:${pozZoom(S.zoom).toFixed(1)}%"></i></span><button type="button" data-wu="zoom+" aria-label="Zoom In (mărești cu 10 %)" title="Zoom In">+</button><button type="button" data-wu="zoom%" aria-label="Zoom ${S.zoom} %">${S.zoom} %</button></span>`;
  }
  function drawBara(){
    const pista=fer.querySelector('.wu-pista'),deget=pista.querySelector('.wu-deget');
    const h=pag.scrollHeight,v=pag.clientHeight,ph=pista.clientHeight||60;
    const th=Math.max(24,Math.min(ph,ph*v/Math.max(h,1)));
    deget.style.height=th+'px';deget.style.top=(h>v?(ph-th)*pag.scrollTop/(h-v):0)+'px';
    fer.querySelector('.wu-oriz').classList.toggle('on',pag.scrollWidth>pag.clientWidth+2);
  }
  /* semnele ¶ și ·: puse peste documentul desenat de wordobj, fără să-i schimbe textul */
  let obs=null;
  function marks(){
    docEl.classList.toggle('wu-pil',S.pil);
    docEl.querySelectorAll('.wu-pm').forEach(x=>x.remove());
    if(!S.pil){docEl.querySelectorAll('.wu-sp').forEach(x=>x.classList.remove('wu-sp'));return}
    docEl.querySelectorAll('.wo-p').forEach(p=>{
      p.querySelectorAll(':scope > [data-o]').forEach(c=>{if(c.textContent===' ')c.classList.add('wu-sp')});
      const sel=!!p.querySelector(':scope > .wo-pm');
      p.insertAdjacentHTML('beforeend',`<span class="wu-pm${sel?' wo-sl':''}" aria-hidden="true">¶</span>`);
    });
  }
  function toateTestele(){
    const s=st(),d=vdoc(s),T=[];
    if(Q.tinta||(Q.verif&&Q.verif.length))WO.teste(Q2,d,{sel:s.sel,log:s.log}).forEach(t=>T.push(t));
    const pars=d.filter(b=>b.k==='p');
    (Q.teste||[]).forEach(t=>{
      let ok=false,cum=t.cum||'';
      if('pil' in t){ok=S.pil===t.pil;cum=cum||(t.pil?'Semnele nu se văd încă. Pe fila Home (Pornire), în grupul Paragraph (Paragraf), apasă butonul ¶.':'Semnele se văd încă. Apasă din nou butonul ¶.')}
      else if('rigle' in t){ok=S.rigle===t.rigle;cum=cum||'Deschide fila View (Vizualizare) și dă clic pe bifa Ruler (Riglă).'}
      else if('zoom' in t){ok=S.zoom===t.zoom;cum=cum||`Zoomul e acum ${S.zoom} %. Butoanele − și + din dreapta barei de stare îl schimbă cu câte 10 %.`}
      else if('qat' in t){ok=S.qat===t.qat;cum=cum||'Săgeata ⌄ din dreapta-jos a panglicii › Show Quick Access Toolbar (Afișare bară de instrumente Acces rapid).'}
      else if('fila' in t){ok=S.fila===t.fila;cum=cum||'Dă clic pe numele filei, pe rândul de sus al panglicii.'}
      else if('lans' in t){ok=S.lans.includes(t.lans);cum=cum||'Caută săgeata mică ↘ din colțul din dreapta-jos al grupului și dă clic pe ea.'}
      else if('zona' in t){ok=S.zona===t.zona;cum=cum||(S.zona?`Ai dat clic pe ${ZONE[S.zona]||S.zona}. Caută ${ZONE[t.zona]||t.zona}.`:`Dă clic pe ${ZONE[t.zona]||t.zona}.`)}
      else if('cursorFinal' in t){const u=pars.length-1,c=s.cur;ok=!s.sel&&!s.pend&&c&&c.r==null&&c.b===d.lastIndexOf(pars[u])&&c.o===pars[u].t.length;cum=cum||'Derulează până jos și dă clic chiar după ultimul cuvânt.'}
      else if('cursorPar' in t){const c=s.cur;ok=!s.sel&&c&&c.r==null&&c.b===t.cursorPar-1;cum=cum||'Dă un clic pe rândul cerut.'}
      else if('cuvinte' in t){const n=cuvinte(textDoc(d));ok=n===t.cuvinte;cum=cum||`Bara de stare arată acum ${n} words. Compară textul cu sarcina.`}
      else if('foloseste' in t){ok=S.log.includes(t.foloseste);cum=cum||({shift:'Selectează ținând apăsată tasta Shift și apăsând săgeata (pe telefon: butoanele Shift+← / Shift+→).',
        sageti:'Mută cursorul cu săgețile ← → (pe telefon: butoanele ← și →).',anulare:'Apasă Ctrl+Z după ce ai făcut operația cerută.',
        refacere:'După Ctrl+Z, apasă Ctrl+Y: ce ai anulat revine.',repetare:'Apasă Ctrl+Y fără să fi anulat ceva înainte.'})[t.foloseste]||''}
      T.push({ce:t.ce,ok:!!ok,cum});
    });
    return T;
  }
  function drawTeste(){testeEl.innerHTML=toateTestele().map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('')}
  function drawChrome(){drawTitlu();drawRb();drawDlg();aplicaZoom();drawRigle();drawStare();drawBara();drawTeste();marks()}
  function dupaDoc(){if(obs)obs.disconnect();marks();drawRigle();drawStare();drawBara();drawTeste();drawTitlu();if(obs)obs.observe(docEl,{childList:true,subtree:true,characterData:true})}
  obs=new MutationObserver(()=>dupaDoc());

  /* ---------------- tastele: Ctrl+Z / Ctrl+Y / ⌫ ca în Word ---------------- */
  let trecY=false,inainte=null,actiune=null;
  function tasta(key,o){inp.dispatchEvent(new KeyboardEvent('keydown',Object.assign({key,bubbles:true,cancelable:true},o||{})))}
  /* încheie tastarea în curs (textul rămâne cum se vede): în wordobj.js, Ctrl+Z pe o tastare neîncheiată punea în lista de
     refacere documentul FĂRĂ textul tastat, deci Ctrl+Y nu-l mai aducea (judecătorul, J2). Word: tastarea e o operație încheiată. */
  function inchideTastarea(){const s=st();if(s.pend&&s.cur){const c=Object.assign({},s.cur,{o:s.cur.o+s.pend.length});W.proba.selecteaza(c,c)}}
  function ctrlY(){
    const s=st();
    if(S.redo>0){const pre=sig();trecY=true;tasta('y',{ctrlKey:true});trecY=false;if(sig()!==pre){S.redo--;S.last=null;log('refacere')}dupaDoc();return}
    let L=S.last;if(s.pend)L={t:'tip',text:s.pend};
    if(!L){spune('Nu e nimic de refăcut sau de repetat. În Word, butonul arată atunci „Can\'t Repeat” (gri).');return}
    // tastarea se repetă ca tastare (W.proba.apasa ar lua „z” drept Ctrl+Z, „c” drept Ctrl+C…): o operație nouă, separată
    if(L.t==='tip'){inchideTastarea();inp.value=L.text;inp.dispatchEvent(new Event('input'));inchideTastarea()}else W.proba.apasa(L.t);
    S.last=L;S.redo=0;log('repetare');spune('');dupaDoc();
  }
  body.addEventListener('pointerdown',e=>{ultimulPointer=e.pointerType||'mouse';const z=e.target.closest&&e.target.closest('[data-zona]');if(z&&fer.contains(z)){S.zona=z.dataset.zona}},true);
  body.addEventListener('keydown',e=>{
    if(e.target!==inp||api.done())return;
    const k=e.key,ctrl=(e.ctrlKey||e.metaKey)&&!e.altKey,kl=k&&k.length===1?k.toLowerCase():k;
    if(ctrl&&kl==='y'&&!trecY){e.preventDefault();e.stopImmediatePropagation();ctrlY();return}
    if(trecY)return;
    if(k&&k.length!==1)dublu=false;
    if(/^Arrow/.test(k))log(e.shiftKey?'shift':'sageti');
    if(ctrl&&kl==='z')inchideTastarea();
    if(k==='Backspace'&&!ctrl&&inp.value){   // ⌫ în mijlocul tastării: întâi tastarea devine o operație, apoi ⌫ (ca în Word)
      e.preventDefault();e.stopImmediatePropagation();W.proba.apasa('bs');S.redo=0;S.last={t:'bs'};spune('');dupaDoc();return}
    inainte=sig();actiune=ctrl&&kl==='z'?'z':k==='Backspace'?'bs':k==='Delete'?'del':k==='Enter'?'enter':ctrl?'ctrl':'alt';
  },true);
  body.addEventListener('keydown',e=>{
    if(e.target!==inp||inainte==null||trecY)return;
    const post=sig(),a=actiune;inainte!==post&&schimbat(a);inainte=null;actiune=null;dupaDoc();
  });
  function schimbat(a){
    if(a==='z'){S.redo++;S.last=null;log('anulare');return}
    S.redo=0;
    if(a==='bs'||a==='del'||a==='enter')S.last={t:a};else if(a!=='mutare')S.last=null;
  }
  body.addEventListener('input',e=>{if(e.target===inp){S.redo=0;if(inp.value)S.last={t:'tip',text:inp.value};dupaDoc()}});
  let preClick=null,preK=null;
  body.addEventListener('click',e=>{const k=e.target.closest('[data-k]');if(k&&inBody.contains(k)){if(k.dataset.k==='z')inchideTastarea();preClick=sig();preK=k.dataset.k}},true);
  body.addEventListener('click',e=>{
    if(preClick!=null){const post=sig();if(post!==preClick)schimbat(preK==='z'?'z':preK==='bs'?'bs':preK==='del'?'del':preK==='enter'?'enter':'alt');
      if(preK==='reset'){S=init();drawChrome()}preClick=null;preK=null;dupaDoc()}
  });
  let prePtr=null,ultimClic={t:0,x:0,y:0,n:0},dublu=false;
  docEl.addEventListener('pointerdown',e=>{prePtr=sig();
    const now=Date.now(),tol=e.pointerType==='mouse'?2:26;
    const n=(now-ultimClic.t<500&&Math.abs(e.clientX-ultimClic.x)<=tol&&Math.abs(e.clientY-ultimClic.y)<=tol)?Math.min(ultimClic.n+1,3):1;
    ultimClic={t:now,x:e.clientX,y:e.clientY,n};dublu=n===2&&!e.shiftKey},true);
  /* Word (Smart cut and paste, pornit implicit): dublu-clicul ia cuvântul CU spațiul de după, dar când tastezi peste el
     spațiul rămâne („Plecăm joi la bunici.”; probat de judecător cu dublu-clic real, J1). wordobj.js înlocuiește tot, deci
     la prima literă tastată peste o selecție de dublu-clic scot spațiile de la capătul selecției. Selecția făcută altfel
     (trăgând, Shift+→) se înlocuiește întreagă, ca în Word. */
  body.addEventListener('input',e=>{
    if(e.target!==inp||!dublu)return;dublu=false;
    const s=st();if(!s.sel||s.pend||!s.ank||!s.cur)return;
    const [x,y]=(s.ank.b<s.cur.b||(s.ank.b===s.cur.b&&s.ank.o<=s.cur.o))?[s.ank,s.cur]:[s.cur,s.ank];
    if(x.r!=null||y.r!=null||x.b!==y.b||!s.doc[y.b]||s.doc[y.b].k!=='p')return;
    const t=s.doc[y.b].t;let o=y.o;while(o>x.o&&t[o-1]===' ')o--;
    if(o>x.o&&o<y.o)W.proba.selecteaza(x,Object.assign({},y,{o}));
  },true);
  body.addEventListener('pointerup',()=>{if(prePtr!=null){if(sig()!==prePtr)schimbat('alt');prePtr=null}});
  // pe telefon, după două atingeri pe cuvânt atingi caseta „Tastatura”: asta nu anulează dublu-clicul
  body.addEventListener('pointerdown',e=>{if(!docEl.contains(e.target)&&e.target!==inp)dublu=false},true);

  /* ---------------- clicurile pe fereastră ---------------- */
  function spuneNesim(n){spune(`„${esc(n)}” e și în Word, dar în lecția asta nu-l folosim.`)}
  body.addEventListener('click',e=>{
    const b=e.target.closest('button,[data-wu]');if(!b||!body.contains(b))return;
    if(b.dataset.k)return;   // tastele wordobj
    const w=b.dataset.wu;
    if(api.done()&&w!=='sus'&&w!=='jos'&&w!=='st-o'&&w!=='dr-o')return;
    if(b.dataset.tab&&fer.contains(b)){S.fila=b.dataset.tab;if(S.dlg==='fisier')S.dlg=null;drawRb();drawDlg();spune('');focus();return}
    if(b.dataset.nesim&&fer.contains(b)){spuneNesim(b.getAttribute('aria-label')||b.dataset.nesim);focus();return}
    if(!w)return;
    const pre=sig();
    switch(w){
      case 'y':ctrlY();break;
      case 'undo':tasta('z',{ctrlKey:true});break;
      case 'k-st':tasta('ArrowLeft');break;
      case 'k-dr':tasta('ArrowRight');break;
      case 'k-sst':tasta('ArrowLeft',{shiftKey:true});break;
      case 'k-sdr':tasta('ArrowRight',{shiftKey:true});break;
      case 'pil':S.pil=!S.pil;spune(S.pil?'Semnele sunt afișate: ¶ la capătul fiecărui paragraf, · pentru fiecare spațiu.':'Semnele s-au ascuns. Textul e același.');break;
      case 'rigla':S.rigle=!S.rigle;spune(S.rigle?'Riglele se văd: sus și în stânga paginii.':'Riglele s-au ascuns.');break;
      case 'lans':S.dlg={id:b.dataset.id,n:b.dataset.n};if(!S.lans.includes(b.dataset.id))S.lans.push(b.dataset.id);spune('');break;
      case 'fisier':S.dlg=S.dlg==='fisier'?null:'fisier';spune('');break;
      case 'rdo':S.dlg=S.dlg==='rdo'?null:'rdo';spune('');break;
      case 'qat':S.qat=!S.qat;S.dlg=null;spune(S.qat?'Bara Acces rapid se vede acum sus, în stânga, în bara de titlu.':'Bara Acces rapid s-a ascuns.');break;
      case 'x':S.dlg=null;spune('');break;
      case 'nesim-m':S.dlg=null;spuneNesim(b.dataset.n);break;
      case 'zoom+':S.zoom=Math.min(500,Math.floor(S.zoom/10)*10+10);spune(Q.zoomLectie||'');break;
      case 'zoom-':S.zoom=Math.max(10,Math.ceil(S.zoom/10)*10-10);spune(Q.zoomLectie||'');break;
      case 'zoom%':spune('În Word, un clic pe procent deschide fereastra Zoom. Aici schimbi zoomul cu − și +.'+(Q.zoomLectie?' '+Q.zoomLectie:''));break;
      case 'glisor':spune('În Word tragi de glisor. În simulator schimbi zoomul cu − și +, câte 10 %.'+(Q.zoomLectie?' '+Q.zoomLectie:''));break;
      case 'vedere':spune('Modurile de vizualizare (Read Mode, Print Layout, Web Layout) le înveți în lecția 3.');break;
      case 'pagina':spune('În Word, un clic aici deschide panoul Navigare (Navigation), cu paginile documentului. În lecția asta doar citești: pagina pe care ești și câte pagini sunt.');break;
      case 'save':spune('În simulator nu se salvează nimic. Salvarea o înveți în lecția 3.');break;
      case 'autosave':spuneNesim('AutoSave');break;
      case 'custqat':spuneNesim('Customize Quick Access Toolbar');break;
      case 'ctl':spune('Butoanele ferestrei (micșorare, mărire, închidere) le știi din clasa a V-a. În simulator nu închidem fereastra.');break;
      case 'sus':pag.scrollBy({top:-60});break;
      case 'jos':pag.scrollBy({top:60});break;
      case 'st-o':pag.scrollBy({left:-60});break;
      case 'dr-o':pag.scrollBy({left:60});break;
      case 'pista':{const r=b.getBoundingClientRect(),dg=b.querySelector('.wu-deget').getBoundingClientRect();pag.scrollBy({top:(e.clientY<dg.top?-1:1)*pag.clientHeight*0.9});break}
      default:return;
    }
    if(!['y','undo','k-st','k-dr','k-sst','k-sdr'].includes(w)&&sig()!==pre)schimbat('alt');
    drawChrome();focus();
  });
  /* degetul barei de defilare se trage */
  const deget=fer.querySelector('.wu-deget');let trag=null;
  deget.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();trag={y:e.clientY,top:pag.scrollTop};try{deget.setPointerCapture(e.pointerId)}catch(_){}});
  deget.addEventListener('pointermove',e=>{if(!trag)return;const ph=fer.querySelector('.wu-pista').clientHeight,th=deget.offsetHeight,h=pag.scrollHeight,v=pag.clientHeight;if(ph>th)pag.scrollTop=trag.top+(e.clientY-trag.y)*(h-v)/(ph-th)});
  deget.addEventListener('pointerup',()=>{trag=null});
  pag.addEventListener('scroll',drawBara,{passive:true});
  if(G.addEventListener){const laRedim=()=>{if(!body.isConnected){G.removeEventListener('resize',laRedim);return}drawRigle();drawBara()};G.addEventListener('resize',laRedim)}

  /* ---------------- verificarea ---------------- */
  function aplica(stareUi,cuSolutie){
    S=Object.assign(init(),stareUi||{});S.lans=(stareUi&&stareUi.lans||[]).slice();S.log=(stareUi&&stareUi.log||[]).slice();
    if(cuSolutie){const c=stareUi&&stareUi.cursor;const s=st(),d=s.doc;
      if(c==='fin'){const u=d.length-1;W.proba.selecteaza({b:u,o:d[u].t.length},{b:u,o:d[u].t.length})}
      else if(typeof c==='number')W.proba.selecteaza({b:c-1,o:0},{b:c-1,o:0});
      if(stareUi&&stareUi.zona)S.zona=stareUi.zona}
    drawChrome();
  }
  const nav=api.checkButton(()=>{
    const T=toateTestele(),bad=T.filter(t=>!t.ok);
    drawTeste();
    if(!bad.length){nav.innerHTML='';api.resolve(true);focus();return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum||''}`);
    api.revealButton(()=>{rezolva();nav.innerHTML='';api.giveUp(Q.arata||'fereastra arată acum ca în sarcină: uită-te ce s-a schimbat și citește testele bifate.')});
    focus();
  });
  function rezolva(){WO.rezolva(Q2,inBody);aplica(Q.solutie||{},true)}
  function gresit(){WO.gresit(Q2,inBody);aplica(Q.gresitUi||{},false)}
  body._wu={rezolva,gresit,stare:()=>({ui:clone(Object.assign({},S,{dlg:S.dlg&&(S.dlg.id||S.dlg)})),doc:st(),teste:toateTestele(),cuvinte:cuvinte(textDoc(vdoc()))})};
  drawChrome();
  obs.observe(docEl,{childList:true,subtree:true,characterData:true});
  /* documentul nou din Word are cursorul deja în pagină: la exercițiile cu `focus:true`, pe calculator (mouse), cursorul
     se pune la capătul documentului și tastele merg direct acolo (judecătorul, J15) */
  if(Q.focus&&G.matchMedia&&G.matchMedia('(pointer:fine)').matches){const d=st().doc,u=d.length-1;if(d[u]&&d[u].k==='p'){W.proba.selecteaza({b:u,o:d[u].t.length},{b:u,o:d[u].t.length});inp.focus({preventScroll:true})}}
  requestAnimationFrame(()=>{drawRigle();drawBara()});
}
G.TipWordInterfata={
  render,
  rezolva(Q,body){body._wu.rezolva()},
  gresit(Q,body){body._wu.gresit()},
  cuvinte
};
})(typeof window!=='undefined'?window:globalThis);
