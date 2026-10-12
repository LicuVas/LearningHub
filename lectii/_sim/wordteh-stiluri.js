/* lectii/_sim/wordteh-stiluri.js — Word-ul simulat, STILURILE din galeria Styles (Stiluri): Titlu 1 (Heading 1) și
   vecinii lui, pe fila Home (Pornire) (LearningHub, 12.10.2026).
   PROPRIETAR: autorul lecției VII · M2 · 8 („Reguli de tehnoredactare și estetică a paginii tipărite”, pasul 4).
   SE ÎNCARCĂ DUPĂ lectii/_sim/wordobj.js, wordobj-formatare.js, wordobj-tehnoredactare.js (editorul și fereastra, toate
   NESCHIMBATE) și după jocuri/_motor/ui-panglica.js + panglica-word.js (panglica reală: grupul Styles cu dalele
   ¶ Normal, ¶ No Spacing, Heading 1, Heading 2, Title, Subtitle, Subtle Emphasis, Emphasis). Tipul: `wordstil` ->
   tipuri:{wordstil:TipWordStiluri}.
   CE FACE, CA ÎN WORD (probat în Word 16.0.20326 real, instanță nouă invizibilă, lectii/vii/m2-l08/_proba/
   proba_stiluri_word.py -> rezultate_stiluri.json; culorile din PDF-ul făcut de Word: fa_docx_stiluri.py):
   - clic pe o dală cu cursorul în paragraf, FĂRĂ selecție: TOT paragraful primește stilul; celelalte nu se schimbă;
   - formatarea pusă de mână pe (aproape) tot paragraful dispare (aldin 14 -> Calibri Light 20, fără aldin; Comic Sans
     20 aldin -> la fel), iar alinierea pusă înainte (Center) se pierde: paragraful vine la stânga; o bucată mică
     formatată de mână (un cuvânt aldin) rămâne aldină. Aici: pe fiecare proprietate, dacă cel puțin jumătate din
     litere au altă valoare decât stilul vechi, se scoate de peste tot; altfel rămâne doar pe literele acelea;
   - Heading 1, Heading 2 și Title sunt stiluri „legate”: dacă selectezi doar o bucată dintr-un paragraf, doar bucata ia
     forma stilului (font, mărime, culoare), iar paragraful rămâne cum era (probat: „Partea” din „Partea întâi”);
     tot textul paragrafului (cu sau fără ¶) = tot paragraful. O selecție peste mai multe paragrafe le schimbă pe toate
     (NEPROBAT pe mai multe paragrafe: e regula paragrafelor atinse a editorului, ca la aliniere);
   - Ctrl+Z (tasta sau butonul de sub fereastră) anulează stilul dintr-o dată, cu formatarea de dinainte (probat: Undo 1);
   - dala stilului paragrafului în care stă cursorul e aprinsă (ca în Word); stilurile au forma din documentul de lucru
     al lecției (tema Office cu Calibri): Normal = Calibri (Body) 11, 0/8 pt; No Spacing = la fel, 0/0, rând simplu;
     Heading 1 = Calibri Light (Headings) 20, albastru #2F5496, 18 pt înainte / 4 după; Heading 2 = Calibri Light 16,
     #2F5496, 8/4; Title = Calibri Light 28, negru, 0/4, rând simplu (probate). Subtitle, Subtle Emphasis, Emphasis și
     Styles... spun pe ecran că nu sunt folosite în lecție.
   - Enter la CAPĂTUL unui paragraf cu stil: paragraful nou e Normal (probat: B12); Ctrl+Z îl anulează. Enter în mijlocul
     lui îl rupe în două paragrafe cu același stil (editorul; NEPROBAT în Word). Banda panglicii pornește derulată la
     grupul Styles și își păstrează derularea (în Word, grupul se vede fără derulare).
   ABATERI SPUSE PE ECRAN: meniul de la clic dreapta pe dală (Modify, Update…) și Styles... nu sunt simulate; ⌫/Delete care
   unește un titlu cu paragraful vecin ține regula editorului: în Word textul unit ia forma paragrafului de SUS (titlu unit cu
   cel de sub el: tot Heading 1, Calibri Light 20; titlu unit cu cel de deasupra: tot Normal, Calibri 11; probat de judecător),
   aici literele aduse își păstrează forma; abaterea e spusă în legenda de sub fereastră. Pătrățelul
   negru de lângă titlu cu ¶ pornit (Keep with next) NU e desenat: neprobat vizual (vezi surse.md). Ctrl+Alt+1 nu e simulat (pe
   tastatura Română (standard), Ctrl+Alt+1 = AltGr+1 = „¡”; tastele postate în Word-ul invizibil n-au făcut nimic:
   neconcludent) și nici nu e predat.
   CONFIGURAȚIA: {t:'wordstil', q, start:[par…], tinta:[par…], tipic?:[par…], verif:[test…], ajutor, why}
     par = 'text' sau {t, al?, f?:{font, sz, b}, stil?:'Heading 1'|'Normal'|…} (stil = cum îl pune galeria).
   TESTE: {ce, stil:{text, nume}} (paragraful cu textul exact are stilul) | {ce, restul:{nume, afara:[texte]}} (toate
     celelalte paragrafe au stilul `nume`) | {ce, textPastrat:true} | orice test din wordobj-tehnoredactare.js.
   API: render(Q, body, api), rezolva(Q, body), gresit(Q, body); STILURI, aplica(doc, sel, nume) (pentru probe). */
(function(G){
'use strict';
const WT=G.TipWordTehno,WF=G.TipWordFormat;
if((!WT||!WF)&&G.console)console.warn('wordteh-stiluri.js: lipsesc wordobj-formatare.js / wordobj-tehnoredactare.js (se încarcă înainte)');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clone=d=>JSON.parse(JSON.stringify(d));
const CAR=['b','i','u','font','sz','col'];
/* forma stilurilor (rezultate_stiluri.json „A_stiluri” + culoarea din PDF: Heading 1 = 2F5496) */
const NORMAL_F={font:'Calibri (Body)',sz:11,b:0,i:0,u:0,col:null};
const STILURI={
  'Normal':{ro:'Normal',f:NORMAL_F,pf:{inainte:0,dupa:8,rand:1.08,rt:'multiplu'},legat:false},
  'No Spacing':{ro:'Fără spațiere',f:NORMAL_F,pf:{inainte:0,dupa:0,rand:1,rt:'simplu'},legat:false},
  'Heading 1':{ro:'Titlu 1',f:{font:'Calibri Light (Headings)',sz:20,b:0,i:0,u:0,col:'2F5496'},pf:{inainte:18,dupa:4,rand:1.08,rt:'multiplu'},legat:true},
  'Heading 2':{ro:'Titlu 2',f:{font:'Calibri Light (Headings)',sz:16,b:0,i:0,u:0,col:'2F5496'},pf:{inainte:8,dupa:4,rand:1.08,rt:'multiplu'},legat:true},
  'Title':{ro:null,f:{font:'Calibri Light (Headings)',sz:28,b:0,i:0,u:0,col:null},pf:{inainte:0,dupa:4,rand:1,rt:'simplu'},legat:true}
};
/* numele din galerie (dump-ul panglicii) -> stilul; „¶ Normal” are semnul ¶ în față, ca în Word */
const DALA={'¶ Normal':'Normal','¶ No Spacing':'No Spacing','Heading 1':'Heading 1','Heading 2':'Heading 2','Title':'Title'};
const numeStil=n=>{const s=STILURI[n];return s&&s.ro&&s.ro!==n?`${n} (${s.ro})`:n};
const stilDe=p=>p.pf.stil||'Normal';
const fp=d=>JSON.stringify(d.map(p=>[p.t,p.pf,p.f,p.mf]));

/* stilul pe paragraful întreg: pe fiecare proprietate, regula „jumătății” (vezi capul fișierului) */
function peParagraf(p,nume){
  const S=STILURI[nume],V=STILURI[stilDe(p)]||STILURI.Normal,n=p.t.length;
  CAR.forEach(k=>{
    const dif=p.f.filter(f=>(f[k]==null?null:f[k])!==(V.f[k]==null?null:V.f[k])).length;
    const scoate=n===0||dif*2>=n;
    p.f.forEach(f=>{if(scoate||(f[k]==null?null:f[k])===(V.f[k]==null?null:V.f[k]))f[k]=S.f[k]});
    p.mf[k]=S.f[k];
  });
  Object.assign(p.pf,{al:'left',st:0,dr:0,prim:0},S.pf,{stil:nume});
}
/* aplică stilul `nume` pe selecția {cur, ank} (ca în Word): întoarce documentul nou */
function aplica(doc,sel,nume){
  const d=clone(doc),S=STILURI[nume];if(!S)return d;
  const c=sel.cur,a=sel.ank,areSel=!(c.b===a.b&&c.o===a.o);
  const [s,e]=(a.b<c.b||(a.b===c.b&&a.o<=c.o))?[a,c]:[c,a];
  const ultim=Math.min(d.length-1,s.b);
  if(areSel&&S.legat&&s.b===e.b&&s.b<d.length){
    const p=d[s.b],tot=s.o===0&&e.o>=p.t.length;
    if(!tot){for(let k=s.o;k<Math.min(e.o,p.t.length);k++)['font','sz','col'].forEach(q=>{p.f[k][q]=S.f[q]});return d}   // doar bucata
  }
  let z=Math.min(e.b,d.length-1);if(areSel&&e.o===0&&e.b>s.b)z=Math.min(e.b-1,d.length-1);
  for(let b=ultim;b<=z;b++)peParagraf(d[b],nume);
  return d;
}
/* documentul din configurație, cu stilurile puse ca de galerie */
function mk(spec){
  const d=WF.mk(spec);
  (spec||[]).forEach((x,i)=>{if(x&&typeof x==='object'&&x.stil&&d[i])peParagraf(d[i],x.stil)});
  return d;
}
const litere=d=>d.map(p=>p.t).join('').replace(/\s+/g,'');
const scurt=t=>'„'+String(t).trim()+'”';

function testeaza(Q,doc,X){
  const T=[],add=(ce,ok,cum)=>T.push({ce,ok:!!ok,cum:cum||''});
  const tinta=Q.tinta?mk(Q.tinta):null;
  (Q.verif||[]).forEach(v=>{
    if(v.stil){const o=v.stil,p=doc.find(q=>q.t.trim()===o.text);
      if(!p){add(v.ce,false,v.cum||`Nu găsesc paragraful ${scurt(o.text)} scris exact așa. Te-ai încurcat? Ctrl+Z sau „Ia-o de la capăt”.`);return}
      const are=stilDe(p);if(are===o.nume){add(v.ce,true);return}
      const S=STILURI[o.nume],bucata=S&&p.f.some(f=>f.font===S.f.font&&f.sz===S.f.sz)&&p.f.some(f=>!(f.font===S.f.font&&f.sz===S.f.sz));
      let m;
      if(are==='Title'&&o.nume==='Heading 1')m=`${scurt(o.text)} are stilul <b>Title</b>, cel fără cifră, mult mai mare. Dă un clic în el și alege <b>Heading 1</b> (Titlu 1), cu cifra 1.`;
      else if(bucata)m=`Doar o bucată din ${scurt(o.text)} arată ca un titlu: ai selectat-o înainte să alegi stilul. Dă doar un clic în ${scurt(o.text)}, fără să selectezi nimic, apoi <b>${esc(numeStil(o.nume))}</b>. Sau Ctrl+Z.`;
      else m=`${scurt(o.text)} are încă stilul <b>${esc(numeStil(are))}</b>. Dă un clic oriunde în el, apoi fila <b>Home</b> (Pornire), grupul <b>Styles</b> (Stiluri): <b>${esc(numeStil(o.nume))}</b>.`;
      add(v.ce,false,v.cum||m);return}
    if(v.restul){const o=v.restul,afara=new Set(o.afara||[]),p=doc.find(q=>q.t.trim()&&!afara.has(q.t.trim())&&stilDe(q)!==o.nume);
      add(v.ce,!p,v.cum||(p?`${scurt(p.t)} are stilul <b>${esc(numeStil(stilDe(p)))}</b>, dar nu e un titlu de parte. Dă un clic în el și alege <b>¶ Normal</b> din galerie (sau Ctrl+Z).`:''));return}
    if(v.textPastrat){add(v.ce,!tinta||litere(doc)===litere(tinta),v.cum||'Ai șters sau ai adăugat litere: azi pui doar stilul. Apasă Ctrl+Z sau „Ia-o de la capăt”.');return}
    const t=WT.teste(Object.assign({},Q,{verif:[v]}),doc,X)[0];if(t)T.push(t);
  });
  return T;
}

let STIL_CSS=false;
function stil(){if(STIL_CSS||typeof document==='undefined')return;STIL_CSS=true;const s=document.createElement('style');s.textContent=`
.ws .pg .ws-dala{justify-content:space-between;padding-top:2px}
.ws .pg .ws-prev{display:block;line-height:1.1;white-space:nowrap;overflow:hidden;max-width:100%;pointer-events:none}
.ws .ws-ascuns{display:none!important}
.ws-leg{margin:0;padding:4px 10px;border:1px solid var(--line);border-top:0;background:var(--paper2);font-size:.86rem}
`;document.head.appendChild(s)}

function render(Q,body,api){
  stil();
  let nav=null;
  /* fereastra de bază (wordobj-tehnoredactare.js, fără teste și fără previzualizare); butonul „Verifică” e al nostru */
  const Q2=Object.assign({},Q,{t:'wordteh',verif:[],previz:false,tinta:null,start:Q.start});
  WT.render(Q2,body,Object.assign({},api,{checkButton:()=>{nav=api.checkButton(verifica);return nav}}));
  const wo=body.querySelector('.wo');wo.classList.add('ws');
  const inp=wo.querySelector('.wo-in'),rb=wo.querySelector('.wo-rb');
  const leg=document.createElement('p');leg.className='hint ws-leg';
  leg.innerHTML='Grupul <b>Styles</b> (Stiluri) e pe fila <b>Home</b> (Pornire). Aici panglica e derulată chiar la el; în Word îl vezi fără derulare. Dă un clic în paragraf, apoi pe stil. Azi doar pui stiluri; ai greșit? Ctrl+Z. Nu uni un titlu cu paragraful de deasupra sau de dedesubt (⌫ sau Delete pe semnul ¶ dintre ele): în Word, textul unit ia forma paragrafului de sus; aici nu. S-a întâmplat? Ctrl+Z.';
  const l0=wo.querySelector('.wt-leg')||wo.querySelector('.wo-leg');if(l0)l0.after(leg);
  /* lista de teste a ferestrei de bază rămâne goală (verif:[]) și se ascunde; a noastră are aceleași clase (aspectul) */
  const t0=wo.querySelector('.wt-teste')||wo.querySelector('.wo-teste');t0.classList.add('ws-ascuns');
  const teste=document.createElement('ul');teste.className='wo-teste wt-teste ws-teste';teste.setAttribute('aria-label','Testele sarcinii');
  t0.after(teste);
  const nota=h=>{const n=wo.querySelector('.wo-nota');if(n)n.innerHTML=h||''};
  const X={get pil(){return !!body._wf.stare().pil},previz:null,pagini:()=>1};
  let stiva=[],sl=null,ultimPtr='mouse';
  wo.addEventListener('pointerdown',e=>{ultimPtr=e.pointerType||'mouse'},true);

  function desenTeste(){const st=body._wf.stare();const T=testeaza(Q,docEfectiv(st),X);
    teste.innerHTML=T.map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('')}
  function docEfectiv(st){if(!st.pend)return st.doc;const d=clone(st.doc),p=d[Math.min(st.cur.b,d.length-1)],o=Math.min(st.cur.o,p.t.length);
    const F=Object.assign({},o>0?p.f[o-1]:p.t.length?p.f[0]:p.mf);p.t=p.t.slice(0,o)+st.pend+p.t.slice(o);p.f.splice(o,0,...Array.from({length:st.pend.length},()=>Object.assign({},F)));return d}
  /* dalele galeriei: numele românesc în sfat, dala aprinsă, mostra „AaBbCcDc” în forma stilului */
  function decoreaza(){
    const st=body._wf.stare(),b=Math.min(st.cur.b,st.doc.length-1),acum=st.doc[b]?stilDe(st.doc[b]):'Normal';
    const sel=!(st.cur.b===st.ank.b&&st.cur.o===st.ank.o),mai=sel&&st.cur.b!==st.ank.b&&new Set(st.doc.slice(Math.min(st.cur.b,st.ank.b),Math.max(st.cur.b,st.ank.b)+1).map(stilDe)).size>1;
    rb.querySelectorAll('[data-nesim^="galerie:"]').forEach(d=>{
      const et=d.dataset.nesim.slice(8),n=DALA[et];
      d.classList.add('ws-dala');
      if(n){d.title=STILURI[n].ro&&STILURI[n].ro!==n?`${STILURI[n].ro} (${n})`:n;d.setAttribute('aria-label',`Stilul ${n}${STILURI[n].ro&&STILURI[n].ro!==n?', în română '+STILURI[n].ro:''}`);
        d.classList.toggle('pg-on',!mai&&n===acum);d.setAttribute('aria-pressed',String(!mai&&n===acum));
        if(!d.querySelector('.ws-prev')){const S=STILURI[n].f,sp=document.createElement('span');sp.className='ws-prev';sp.setAttribute('aria-hidden','true');sp.textContent='AaBbCcDc';
          sp.style.cssText=`font-family:${S.font.startsWith('Calibri Light')?"'Calibri Light',Calibri,Carlito,sans-serif":"Calibri,Carlito,sans-serif"};font-size:${Math.min(13,Math.max(8,S.sz*0.5)).toFixed(1)}px;${S.col?'color:#'+S.col:''}`;d.prepend(sp)}}
    });
    /* banda panglicii e mai lată decât fereastra: pornește derulată la grupul Styles (în Word se vede fără derulare) și
       își păstrează derularea la fiecare redesenare a editorului (altfel sărea înapoi la Clipboard după fiecare clic) */
    const bd=rb.querySelector('.pg-banda');if(bd&&!bd.dataset.ws){bd.dataset.ws='1';
      if(sl==null){const g=bd.querySelector('.pg-grup[aria-label="Styles"]');sl=g?Math.max(0,g.offsetLeft-8):0}
      bd.scrollLeft=sl;bd.addEventListener('scroll',()=>{sl=bd.scrollLeft},{passive:true})}
  }
  let raf=0;const programeaza=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;decoreaza();desenTeste()})};
  const obs=new MutationObserver(programeaza);
  obs.observe(rb,{childList:true,subtree:true});obs.observe(wo.querySelector('.wo-doc'),{childList:true,subtree:true,characterData:true});

  /* cursorul și selecția puse la loc după set() (care le duce la început): săgeți ca de la tastatură */
  const pasi=(d,p)=>{let n=0;for(let b=0;b<p.b&&b<d.length;b++)n+=d[b].t.length+1;return n+p.o};
  const sageata=(shift)=>inp.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:!!shift,bubbles:true,cancelable:true}));
  function puneSelectia(d,cur,ank){for(let k=pasi(d,ank);k>0;k--)sageata(false);for(let k=pasi(d,cur)-pasi(d,ank);k>0;k--)sageata(true);
    if(pasi(d,cur)<pasi(d,ank)){for(let k=pasi(d,cur);k>0;k--)sageata(false);for(let k=pasi(d,ank)-pasi(d,cur);k>0;k--)sageata(true)}}
  function inlocuieste(doc,cur,ank,log){body._wf.set(doc,{log:log||[]});puneSelectia(doc,cur,ank);programeaza()}
  /* trimite literele tastate încă netrimise (în editor: orice săgeată întâi le trimite), apoi citește starea */
  function stareCurata(){let st=body._wf.stare();if(st.pend){const c={b:st.cur.b,o:st.cur.o+st.pend.length};inp.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true}));st=body._wf.stare();st.cur=c;st.ank=c}return st}

  function aplicaStil(nume){
    const st=stareCurata(),d=aplica(st.doc,{cur:st.cur,ank:st.ank},nume);
    if(fp(d)===fp(st.doc)){programeaza();return}
    stiva.push({doc:st.doc,cur:st.cur,ank:st.ank,dupa:fp(d),log:st.log});
    inlocuieste(d,st.cur,st.ank,st.log.concat([{op:'stil',nume}]));nota('');
    if(ultimPtr==='mouse'&&inp&&!api.done())inp.focus({preventScroll:true});
  }
  /* Ctrl+Z: dacă ultima schimbare e un stil, îl anulează aici (editorul nu-l știe); altfel lucrează editorul */
  function anuleazaStil(){const st=body._wf.stare();if(!stiva.length||st.pend||fp(st.doc)!==stiva[stiva.length-1].dupa)return false;
    const s=stiva.pop();inlocuieste(s.doc,s.cur,s.ank,s.log);return true}
  /* Enter la CAPĂTUL unui paragraf cu stil (Titlu 1…): în Word, paragraful nou e Normal (probat, B12: „Text nou” = Normal,
     Calibri 11). Editorul ar copia stilul în paragraful nou, deci aici îl facem noi; Ctrl+Z îl anulează. În mijlocul
     paragrafului, Enter îl rupe în două paragrafe cu același stil (îl lasă editorului). */
  function enterDupaStil(){
    const st=stareCurata(),c=st.cur;if(c.b!==st.ank.b||c.o!==st.ank.o)return false;
    const p=st.doc[c.b];if(!p||stilDe(p)==='Normal'||c.o!==p.t.length)return false;
    const d=clone(st.doc),N=STILURI.Normal,nou={t:'',f:[],pf:Object.assign({},p.pf,{al:'left',st:0,dr:0,prim:0},N.pf,{stil:'Normal'}),mf:Object.assign({},N.f)};
    d.splice(c.b+1,0,nou);
    stiva.push({doc:st.doc,cur:st.cur,ank:st.ank,dupa:fp(d),log:st.log});
    const q={b:c.b+1,o:0};inlocuieste(d,q,q,st.log.concat([{op:'enter'}]));return true}
  wo.addEventListener('keydown',e=>{
    if(api.done()||e.target!==inp)return;
    if((e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&(e.key==='z'||e.key==='Z'||e.code==='KeyZ')&&anuleazaStil()){e.preventDefault();e.stopPropagation();return}
    if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&enterDupaStil()){e.preventDefault();e.stopPropagation()}
  },true);
  wo.addEventListener('click',e=>{
    const k=e.target.closest('[data-k]');
    if(k&&k.dataset.k==='reset'){stiva=[];return}
    if(k&&k.dataset.k==='z'){if(!api.done()&&anuleazaStil()){e.preventDefault();e.stopPropagation()}return}
    if(k&&k.dataset.k==='enter'){if(!api.done()&&enterDupaStil()){e.preventDefault();e.stopPropagation()}return}
    const d=e.target.closest('[data-nesim^="galerie:"]');if(!d||!rb.contains(d))return;
    e.preventDefault();e.stopPropagation();if(api.done())return;
    const et=d.dataset.nesim.slice(8),n=DALA[et];
    if(n)aplicaStil(n);else nota(`„${esc(et)}” e aici și în Word, dar în lecția asta nu-l folosim. Titlurile primesc <b>Heading 1</b> (Titlu 1).`);
  },true);

  function verifica(){
    const st=stareCurata(),T=testeaza(Q,st.doc,X),bad=T.filter(t=>!t.ok);desenTeste();
    if(!bad.length){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum}`);
    if(ultimPtr==='mouse'&&inp)inp.focus({preventScroll:true});   // regula 14: focusul înapoi în document
    api.revealButton(()=>{stiva=[];body._wf.set(mk(Q.tinta),{log:[]});nav.innerHTML='';programeaza();
      api.giveUp('cele două titluri au acum stilul din sarcină. Uită-te la dala aprinsă din galerie când dai clic în ele.')});
  }
  body._ws={aplicaStil,stiva:()=>stiva.length,teste:()=>testeaza(Q,body._wf.stare().doc,X)};
  decoreaza();desenTeste();
}
function pune(body,Q,bun){body._wf.set(mk(bun?(Q.tinta||Q.start):(Q.tipic||Q.start)),{log:[]})}
G.TipWordStiluri={
  render,
  rezolva(Q,body){pune(body,Q,true)},
  gresit(Q,body){pune(body,Q,false)},
  teste:testeaza,STILURI,aplica,mk
};
})(typeof window!=='undefined'?window:globalThis);
