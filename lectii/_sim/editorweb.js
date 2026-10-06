/* editorweb.js — simulatorul „Notepad + browser” pentru paginile web (lecțiile VIII/14 și VIII/15).
   Proprietar: autorul lecției VIII/14 (06.10.2026). Interfața e documentată în lectii/viii/m2-l14/surse.md
   („Simulatorul editorweb.js — interfața pentru lecția 15”). Cine are nevoie de altceva scrie o extensie cu nume nou.

   Fidel cu aplicațiile REALE, probate pe Windows 11 în română (lectii/viii/m2-l14/_proba/):
     Notepad 11.2607 — file (tab-uri), meniul Fișier/Editare/Vizualizare cu scurtăturile lui, bara de stare,
       „Salvare ca” (Nume fișier, Salvare cu tipul, Codificare: UTF-8 implicit), regula numelui (.html cunoscut se
       păstrează, altfel se adaugă .txt, ORICARE ar fi tipul ales), „Confirmare Salvare ca … există deja. Îl înlocuiți?”
       (Da / Nu, Nu implicit), Ctrl+S pe un fișier salvat = salvare fără fereastră, punctul de pe filă = nesalvat,
       „Salvați modificările la …?” la închiderea filei, sesiunea păstrată la închiderea ferestrei cu X, F5 = oră/dată;
     Reparare 1 (06.10.2026, _proba/r1_np*.json, taste puse în coada Notepad-ului real): punctul ● e un STEAG — rămâne
       după „x” + Backspace și după Anulați până la textul salvat, se stinge doar la salvare; Anulați (Ctrl+Z) scoate
       câte UN caracter tastat, iar ora/data de la F5 dintr-o dată; fiecare filă își ține istoria anulării și când treci
       la alta; în „Confirmare Salvare ca” focusul e pe „Nu”, iar tasta Enter = Nu (fișierul existent rămâne neatins);
     Edge/Chrome 154 — fila arată <title> sau, fără el, numele fișierului; bara de adrese arată calea; pagina rămâne
       cea veche până la F5 / ⟳; Ctrl+U deschide o filă nouă view-source:…; un .txt se arată ca text, cu etichetele.
   Pagina elevului se desenează într-un iframe sandbox (fără scripturi, fără nicio cerere în afară: CSP default-src 'none').

   Folosire:  <script src="../../_sim/editorweb.js"></script>   apoi în configurație  tipuri:{editorweb:EditorWeb}
   și o întrebare / un exercițiu / atelierul  {t:'editorweb', mod:'live'|'notepad', start:{…}, teste:[…], rezolvare:[…], gresit:[…]}. */
(function(){
'use strict';
const ESC=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
/* sf\u00e2r\u0219itul de r\u00e2nd: fi\u0219ierele au CRLF, caseta de text d\u0103 LF \u2014 textele se compar\u0103 f\u0103r\u0103 \r */
const nl=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
/* extensii „cunoscute” (tipuri înregistrate în Windows): Notepad le păstrează; la orice altceva adaugă .txt (probat:
   pagina.html → pagina.html; pagina.HTML → pagina.HTML; pagina → pagina.txt; pagina.htnl → pagina.htnl.txt) */
const EXT_CUN=new Set('html htm txt css js json xml md csv log ini docx doc xlsx xls pptx ppt pdf rtf jpg jpeg png gif webp bmp svg ico mp3 wav mp4 avi zip rar exe bat'.split(' '));
const INTERZISE=/[\\/:*?"<>|]/;
const UTIL='Elev';
const DOSARE=['Desktop','Documente','Descărcări'];
const CALE_D={Desktop:'Desktop',Documente:'Documents','Descărcări':'Downloads'};
const CODARI=['ANSI','UTF-16 LE','UTF-16 BE','UTF-8','UTF-8 cu BOM'];
const TIPURI=[['txt','Documente text (*.txt)'],['toate','Toate fișierele (*.*)']];
/* textul real al avertizării din resursele Notepad-ului (ro), pentru ANSI cu litere care nu încap în ANSI */
const AVERT_ANSI='Acest fișier conține caractere în format Unicode care se vor pierde dacă salvați fișierul ca fișier text codificat ANSI. Pentru a menține informațiile Unicode, faceți clic pe Anulare și selectați una dintre opțiunile Unicode din lista verticală Codificare. Continuați?';
const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
const STIUTE=new Set(('html head title body meta link style script h1 h2 h3 h4 h5 h6 p br hr b i u strong em small mark sub sup span div '+
  'img a ul ol li table tr td th thead tbody tfoot caption header footer nav main section article aside figure figcaption blockquote pre code').split(' '));

const ext=n=>{const i=String(n).lastIndexOf('.');return i>0?String(n).slice(i+1).toLowerCase():''};
const numeFinal=s=>{s=String(s==null?'':s).trim();const e=ext(s);return e&&EXT_CUN.has(e)?s:s+'.txt'};
const numeFila=t=>{const l=String(t||'').split(/\r?\n/)[0]||'';return l.replace(/[<>\/\\:*?"|]/g,'').trim().slice(0,40)||'Fără titlu'};
const caractere=n=>n===1?'1 caracter':(n===0||(n%100>=1&&n%100<=19))?`${n} caractere`:`${n} de caractere`;
const caleWin=(d,n)=>`C:\\Users\\${UTIL}\\${CALE_D[d]||d}\\${n}`;
const caleBara=(d,n)=>`C:/Users/${UTIL}/${CALE_D[d]||d}/${n}`;
const eHtml=n=>['html','htm'].includes(ext(n));
const tipExplorer=n=>eHtml(n)?'Microsoft Edge HTML Document':ext(n)==='txt'?'Fișier TXT':ext(n)?'Fișier '+ext(n).toUpperCase():'Fișier';
const afisNume=(n,ascunse)=>ascunse&&EXT_CUN.has(ext(n))?n.slice(0,n.lastIndexOf('.')):n;
const pierdereAnsi=t=>String(t).replace(/[șțȘȚşţŞŢ]/g,'?');
const areNonAnsi=t=>/[șțȘȚ]/.test(String(t));
const parse=src=>new DOMParser().parseFromString(String(src||''),'text/html');
function titluPagina(src){const t=parse(src).querySelector('title');return t&&t.textContent.trim()||null}
function previewDoc(src){
  const doc=parse(src);
  doc.querySelectorAll('script,iframe,object,embed,link,meta[http-equiv],base,form').forEach(x=>x.remove());
  doc.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(a=>{if(/^on/i.test(a.name)||/^\s*javascript:/i.test(a.value))el.removeAttribute(a.name)}));
  const m=doc.createElement('meta');m.setAttribute('http-equiv','Content-Security-Policy');m.setAttribute('content',"default-src 'none'; style-src 'unsafe-inline'; img-src data:");
  doc.head.prepend(m);
  const s=doc.createElement('style');s.textContent='html{color-scheme:light}body{font-family:"Times New Roman",serif;margin:8px;background:#fff;color:#000}a{pointer-events:none}img{max-width:100%}';
  doc.head.insertBefore(s,m.nextSibling);
  return '<!doctype html>'+doc.documentElement.outerHTML;
}
/* corectorul simplu (aceeași idee ca la tip-html.js): etichete neînchise / închise greșit / necunoscute */
function corecteaza(src){
  const out=[],st=[],re=/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;let m;
  const rand=i=>String(src).slice(0,i).split('\n').length;
  while((m=re.exec(src))){
    if(!m[2])continue;
    const inc=m[1]==='/',n=m[2].toLowerCase(),r=rand(m.index);
    if(!STIUTE.has(n)){out.push({rand:r,text:`<code>&lt;${inc?'/':''}${ESC(m[2])}&gt;</code> nu e o etichetă cunoscută`});continue}
    if(VOID.has(n))continue;
    if(!inc){st.push({n,r});continue}
    const k=st.map(x=>x.n).lastIndexOf(n);
    if(k<0){out.push({rand:r,text:`<code>&lt;/${n}&gt;</code> închide o etichetă care nu a fost deschisă`});continue}
    for(let j=st.length-1;j>k;j--)out.push({rand:st[j].r,text:`<code>&lt;${st[j].n}&gt;</code> nu e închisă`});
    st.length=k;
  }
  st.forEach(x=>out.push({rand:x.r,text:`<code>&lt;${x.n}&gt;</code> nu e închisă: lipsește <code>&lt;/${x.n}&gt;</code>`}));
  if(/<\\[a-z]/i.test(src))out.push({rand:0,text:'bara de la închidere e <code>/</code>, nu <code>\\</code>'});
  return out;
}

/* ------------------------------ starea ------------------------------ */
let UID=1;
function stareInitiala(Q){
  const st=Q.start||{};
  const S={mod:Q.mod||'notepad',fisiere:{},orig:{},jurnal:[],msg:'',meniu:null,dialog:null,ctx:null,ts:0,
    np:{deschis:true,file:[],activa:0,sesiune:null},br:{file:[],activa:-1},
    ex:{dosar:(st.explorer&&st.explorer.dosar)||'Documente',ascunse:!(st.explorer&&st.explorer.extAscunse===false),sel:null},
    fer:st.ferestre||['notepad','explorer','browser'],activa:st.activa||'notepad',dreapta:st.dreapta||null,
    locPropus:st.locPropus||'Documente',live:null};
  DOSARE.forEach(d=>S.fisiere[d]=[]);
  Object.entries(st.fisiere||{}).forEach(([d,l])=>{S.fisiere[d]=(l||[]).map(f=>({n:f.n,t:f.t||'',cod:f.cod||'UTF-8',coleg:!!f.coleg,ts:0}))});
  Object.entries(S.fisiere).forEach(([d,l])=>l.forEach(f=>{S.orig[d+'/'+f.n]=f.t}));
  if(S.mod==='live'){S.live={text:st.text||'',fisier:st.fisier||'pagina.html'};return S}
  const np=st.notepad||{};
  (np.file||[{text:''}]).forEach(f=>{
    const din=f.n?(S.fisiere[f.dosar||'Documente']||[]).find(x=>x.n===f.n):null;
    const x={id:UID++,n:f.n||null,dosar:f.n?(f.dosar||'Documente'):null,cod:din?din.cod:'UTF-8',
      text:f.text!=null?f.text:(din?din.t:''),salvatText:din?din.t:null,hist:[]};
    x.murdar=schimbat(x);S.np.file.push(x);
  });
  S.np.activa=Math.max(0,Math.min(S.np.file.length-1,np.activa||0));
  if(np.inchis){S.np.deschis=false;S.np.sesiune=np.sesiune?S.np.file.slice():null;S.np.file=[]}
  ((st.browser&&st.browser.file)||[]).forEach(c=>deschideInBrowser(S,c,true));
  if(!S.dreapta)S.dreapta=S.fer.find(w=>w!=='notepad')||null;
  return S;
}
const fila=S=>S.np.file[S.np.activa];
/* schimbat = textul filei diferă de fișier (sau o filă nouă are text); murdar = punctul ● al Notepad-ului real:
   se aprinde la orice scriere și se stinge DOAR la salvare (probat: „x” + Backspace și Anulați îl lasă aprins) */
function schimbat(f){return !!f&&(f.n?nl(f.text)!==nl(f.salvatText):f.text!=='')}
const murdar=f=>!!(f&&f.murdar);
const filaNouaGoala=()=>({id:UID++,n:null,dosar:null,cod:'UTF-8',text:'',salvatText:null,murdar:false,hist:[]});
const log=(S,a,o)=>{S.jurnal.push(Object.assign({a,t:++S.ts},o||{}))};
const gaseste=(S,d,n)=>(S.fisiere[d]||[]).find(f=>f.n.toLowerCase()===String(n).toLowerCase());
function citeste(S,cale){const i=cale.indexOf('/'),f=gaseste(S,cale.slice(0,i),cale.slice(i+1));return f?f.t:null}
function scrieFisier(S,d,n,t,cod){
  const tt=cod==='ANSI'?pierdereAnsi(t):t;
  let f=gaseste(S,d,n);
  if(f){f.t=tt;f.cod=cod;f.ts=++S.ts}
  else{f={n,t:tt,cod,coleg:false,ts:++S.ts};S.fisiere[d].push(f)}
  return f;
}
function deschideInBrowser(S,cale,tacut){
  const t=citeste(S,cale);
  if(t==null)return false;
  S.br.file.push({id:UID++,cale,sursa:false,continut:t});
  S.br.activa=S.br.file.length-1;
  if(!tacut)log(S,'deschis',{cale});
  return true;
}
/* acțiunile (aceleași pentru elev și pentru rezolvare/greșit) */
const ACT={
  filaNoua(S){if(!S.np.deschis){S.np.deschis=true;S.np.file=[]}S.np.file.push(filaNouaGoala());S.np.activa=S.np.file.length-1;log(S,'fila_noua')},
  scrie(S,t){const f=fila(S);if(!f)return;if(String(t)!==f.text){(f.hist||(f.hist=[])).push({t:f.text,s:[0,0]});f.murdar=true}f.text=String(t);log(S,'scris')},
  /* o = {nume, tip:'txt'|'toate', cod, dosar, inlocuieste} ; fără o pe un fișier salvat = Ctrl+S fără fereastră */
  salveaza(S,o){const f=fila(S);if(!f)return{ok:false};if(f.n&&!o){scrieFisier(S,f.dosar,f.n,f.text,f.cod);f.salvatText=gaseste(S,f.dosar,f.n).t;f.text=f.salvatText;f.murdar=false;log(S,'salvat',{cale:f.dosar+'/'+f.n,fara_fereastra:true});return{ok:true}}return ACT.salveazaCa(S,o||{})},
  salveazaCa(S,o){
    const f=fila(S);if(!f)return{ok:false};
    const scris=String(o.nume==null?'':o.nume).trim();
    if(!scris)return{ok:false,gol:true};
    if(INTERZISE.test(scris))return{ok:false,interzis:true};
    const n=numeFinal(scris),d=o.dosar||S.locPropus||'Documente',cod=o.cod||'UTF-8';
    const ex=gaseste(S,d,n);
    if(ex&&!o.inlocuieste)return{ok:false,exista:true,n:ex.n};
    if(ex&&ex.coleg)log(S,'inlocuit_coleg',{cale:d+'/'+ex.n});
    const fs=scrieFisier(S,d,ex?ex.n:n,f.text,cod);
    f.n=fs.n;f.dosar=d;f.cod=cod;f.salvatText=fs.t;f.text=fs.t;f.murdar=false;
    log(S,'salvat',{cale:d+'/'+fs.n,cod});
    return{ok:true,n:fs.n};
  },
  deschide(S,cale){const d=cale.split('/')[0],n=cale.slice(d.length+1);if(eHtml(n)||ext(n)!=='txt'){deschideInBrowser(S,cale);S.activa='browser';S.dreapta='browser'}else ACT.deschideInNotepad(S,cale)},
  deschideInNotepad(S,cale){const d=cale.split('/')[0],n=cale.slice(d.length+1),f=gaseste(S,d,n);if(!f)return;if(!S.np.deschis){S.np.deschis=true;S.np.file=[]}
    const k=S.np.file.findIndex(x=>x.n===n&&x.dosar===d);if(k>=0)S.np.activa=k;else{S.np.file.push({id:UID++,n,dosar:d,cod:f.cod,text:f.t,salvatText:f.t,murdar:false,hist:[]});S.np.activa=S.np.file.length-1}
    S.activa='notepad';log(S,'deschis_notepad',{cale})},
  f5(S){const t=S.br.file[S.br.activa];if(!t)return;const c=citeste(S,t.cale);if(c!=null)t.continut=c;log(S,'f5',{cale:t.cale,sursa:t.sursa})},
  sursa(S){const t=S.br.file[S.br.activa];if(!t||t.sursa)return;S.br.file.push({id:UID++,cale:t.cale,sursa:true,continut:citeste(S,t.cale)||t.continut});S.br.activa=S.br.file.length-1;log(S,'sursa',{cale:t.cale})},
  inchideFilaBrowser(S,i){S.br.file.splice(i,1);S.br.activa=Math.min(S.br.activa,S.br.file.length-1);if(S.br.activa<0&&S.br.file.length)S.br.activa=0},
  /* închide fila din Notepad (fără întrebare: întrebarea o pune interfața înainte) */
  inchideFila(S,i){i=i==null?S.np.activa:i;S.np.file.splice(i,1);log(S,'fila_inchisa');if(!S.np.file.length){S.np.deschis=false;S.np.sesiune=null;log(S,'notepad_inchis',{cum:'fila'})}else S.np.activa=Math.min(i,S.np.file.length-1)},
  inchideFereastra(S){S.np.sesiune=S.np.file.slice();S.np.file=[];S.np.deschis=false;log(S,'notepad_inchis',{cum:'X'})},
  pornesteNotepad(S){S.np.deschis=true;if(S.np.sesiune&&S.np.sesiune.length){S.np.file=S.np.sesiune;S.np.activa=0;log(S,'notepad_pornit',{sesiune:true})}else{S.np.file=[filaNouaGoala()];S.np.activa=0;log(S,'notepad_pornit',{sesiune:false})}S.np.sesiune=null;S.activa='notepad'}
};
function aplica(S,pasi){
  (pasi||[]).forEach(([a,x])=>{
    if(a==='scrie'){if(S.mod==='live')S.live.text=String(x);else ACT.scrie(S,x)}
    else if(a==='salveaza'||a==='salveazaCa'){const r=ACT[a](S,x||undefined);if(r&&r.exista&&x&&x.siDaca==='inlocuieste')ACT[a](S,Object.assign({},x,{inlocuieste:true}))}
    else if(ACT[a])ACT[a](S,x);
  });
  return S;
}

/* ------------------------------ testele ------------------------------ */
function fisierElev(S,spec){
  spec=spec||{};const d=spec.dosar||'Documente';
  const re=spec.model?new RegExp('^([^_\\s]+_){'+(spec.elev===false?0:3)+',}'+String(spec.model).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(_?\\d+)?$','i'):null;
  const l=(S.fisiere[d]||[]).filter(f=>!f.coleg&&(!spec.ext||(f.n.lastIndexOf('.')>0&&ext(f.n)===spec.ext&&f.n.slice(0,f.n.lastIndexOf('.')).indexOf('.')<0))&&
    (spec.exact?f.n.toLowerCase()===spec.exact.toLowerCase():re?re.test(f.n.slice(0,f.n.lastIndexOf('.'))):true));
  return l.sort((a,b)=>b.ts-a.ts)[0]||null;
}
function tabBrowser(S,spec){
  const l=S.br.file.filter(t=>!t.sursa);
  if(!spec)return S.br.file[S.br.activa]&&!S.br.file[S.br.activa].sursa?S.br.file[S.br.activa]:l[l.length-1]||null;
  const f=fisierElev(S,spec);if(!f)return null;
  const d=spec.dosar||'Documente';
  return l.filter(t=>t.cale===d+'/'+f.n).pop()||null;
}
function verificaEl(src,c){
  const doc=parse(src);
  if(c.curat&&corecteaza(src).length)return false;
  if(c.are&&!new RegExp(c.are,'i').test(src))return false;
  if(c.absent&&new RegExp(c.absent,'i').test(src))return false;
  if(c.titlu!=null&&norm(titluPagina(src)||'')!==norm(c.titlu))return false;
  if(c.el){
    const els=[...doc.querySelectorAll(c.el)];
    const ok=els.some(el=>(c.text==null||norm(el.textContent)===norm(c.text))&&(!c.full||norm(el.textContent))&&(c.nu==null||norm(el.textContent)!==norm(c.nu)));
    if(!ok)return false;
  }
  return true;
}
function test(S,c){
  if(typeof c.fn==='function')return !!c.fn(S,UTIL_API);
  let src=null;
  if(S.mod==='live')src=S.live.text;
  if(c.fisier){const f=fisierElev(S,c.fisier);if(!f)return false;if(c.fisier.cod&&f.cod!==c.fisier.cod)return false;src=f.t}
  if(c.browser){const t=tabBrowser(S,c.browser===true?null:c.browser.fisier);if(!t)return false;src=t.continut;
    if(c.browser.txt===false&&!eHtml(t.cale))return false}
  if(c.laZi){const t=tabBrowser(S,c.laZi===true?null:c.laZi);if(!t||t.continut!==citeste(S,t.cale))return false}
  if(c.sursa){const sp=c.sursa===true?null:c.sursa;const f=sp?fisierElev(S,sp):null;if(!S.jurnal.some(j=>j.a==='sursa'&&(!f||j.cale===(sp.dosar||'Documente')+'/'+f.n)))return false}
  if(c.fila){const sp=c.fila,l=S.np.file.filter(f=>sp.nou?!f.n:f.n===sp.n);if(!l.length)return false;
    if(sp.text!=null&&!l.some(f=>norm(f.text)===norm(sp.text)))return false;
    if(sp.nemodificata&&l.some(f=>schimbat(f)))return false}   /* textul ca în fișier (punctul ● poate rămâne, ca în Notepad) */
  if(c.salvat&&S.np.file.some(f=>murdar(f)))return false;      /* nicio filă cu punctul ● */
  if(c.neatins&&c.neatins.some(k=>citeste(S,k)!==S.orig[k]))return false;
  if(c.npCurat&&(S.np.deschis||(S.np.sesiune&&S.np.sesiune.length)))return false;
  if(c.jurnal){let i=0;for(const j of S.jurnal)if(j.a===c.jurnal[i])i++;if(i<c.jurnal.length)return false}
  if(c.el||c.text!=null||c.are||c.absent||c.curat||c.titlu!=null){if(src==null)return false;if(!verificaEl(src,c))return false}
  return true;
}
const UTIL_API={numeFinal,numeFila,caractere,titluPagina,previewDoc,corecteaza,fisierElev,tabBrowser,citeste,test,stareInitiala,aplica,ACT};

/* ------------------------------ aspectul ------------------------------ */
const CSS=`.ew{container-type:inline-size;display:grid;gap:8px;--npbg:#f9f9f9;--npln:#e5e5e5;--npink:#1b1b1b;--npmut:#5d5d5d;--npacc:#005fb8}
.ew *{box-sizing:border-box}
.ew-teste{border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--paper2)}
.ew-teste ol{list-style:none;margin:4px 0 0;padding:0;display:grid;gap:3px}
.ew-teste li{display:flex;gap:8px;font-size:.93rem;align-items:flex-start}
.ew-teste li .s{flex:none;width:1.3em;text-align:center;font-weight:700}
.ew-teste li.ok .s{color:var(--ok)}
.ew-ecran{display:grid;gap:8px;grid-template-columns:minmax(0,1fr)}
.ew-win{display:none;flex-direction:column;border:1px solid #c8c8c8;border-radius:8px;overflow:hidden;background:var(--npbg);color:var(--npink);min-width:0;position:relative;font-family:"Segoe UI",system-ui,sans-serif;font-size:14px}
.ew-ecran[data-activa="notepad"] .ew-win[data-w="notepad"],.ew-ecran[data-activa="explorer"] .ew-win[data-w="explorer"],.ew-ecran[data-activa="browser"] .ew-win[data-w="browser"]{display:flex}
@container (min-width:860px){.ew-ecran.doua{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
 .ew-ecran.doua .ew-win[data-w="notepad"]{display:flex}
 .ew-ecran.doua[data-dreapta="explorer"] .ew-win[data-w="explorer"],.ew-ecran.doua[data-dreapta="browser"] .ew-win[data-w="browser"]{display:flex}
 .ew-ecran.doua[data-dreapta="explorer"] .ew-win[data-w="browser"],.ew-ecran.doua[data-dreapta="browser"] .ew-win[data-w="explorer"]{display:none}}
.ew button{font:inherit;color:inherit;cursor:pointer;min-height:32px;min-width:32px}
.np-file{display:flex;align-items:flex-end;gap:2px;background:#ebebeb;padding:6px 6px 0;overflow-x:auto;scrollbar-width:thin}
.np-ic,.br-ic{flex:none;width:18px;height:18px;margin:0 6px 7px 4px;border-radius:3px}
.np-ic{background:linear-gradient(#5fb2e6 0 22%,#fff 22% 100%);border:1px solid #2b7cb8}
.np-fila{display:flex;align-items:center;gap:6px;max-width:15em;min-width:6em;padding:4px 4px 4px 10px;border:0;border-radius:8px 8px 0 0;background:transparent;font-size:13px}
.np-fila.act{background:var(--npbg)}
.np-fila .fn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left}
.np-fila .x{flex:none;width:32px;height:28px;border:0;background:transparent;border-radius:4px;font-size:15px;line-height:1}
.np-fila .x:hover{background:#ddd}
.np-plus{border:0;background:transparent;font-size:18px;margin-bottom:2px;border-radius:4px}
.np-fx{margin-left:auto;display:flex;gap:2px;align-self:center}
.np-fx button{border:0;background:transparent;width:36px;border-radius:4px}
.np-fx .inch:hover{background:#c42b1c;color:#fff}
.np-meniu{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:2px 6px;border-bottom:1px solid var(--npln)}
.np-meniu>button{border:0;background:transparent;padding:4px 10px;border-radius:4px}
.np-meniu>button:hover,.np-meniu>button[aria-expanded="true"]{background:#e6e6e6}
.np-format{display:flex;gap:2px;margin-left:8px;opacity:.85}
.np-format button{border:0;background:transparent;font-weight:600;padding:2px 6px;border-radius:4px}
.np-drop{position:absolute;z-index:6;background:#fff;border:1px solid #d0d0d0;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:4px;min-width:15em;max-width:calc(100% - 12px)}
.np-drop button{display:flex;justify-content:space-between;gap:18px;width:100%;border:0;background:transparent;text-align:left;padding:5px 10px;border-radius:4px}
.np-drop button:hover,.np-drop button:focus-visible{background:#f0f0f0}
.np-drop .k{color:var(--npmut);font-size:12px;white-space:nowrap}
.np-drop hr{border:0;border-top:1px solid #e5e5e5;margin:3px 0}
.np-ta{flex:1;min-height:9.5em;border:0;outline:0;resize:vertical;background:var(--npbg);color:var(--npink);font-family:Consolas,"Cascadia Mono","JetBrains Mono",monospace;font-size:16px;line-height:1.45;padding:10px 12px;white-space:pre;overflow:auto;tab-size:4}
.np-ta:focus-visible{box-shadow:inset 0 0 0 2px var(--npacc)}
.np-stare{display:flex;flex-wrap:wrap;gap:0;border-top:1px solid var(--npln);font-size:12px;color:var(--npmut);background:#f3f3f3}
.np-stare span{padding:3px 12px;border-right:1px solid #ddd;white-space:nowrap}
.np-inchis{padding:22px 14px;text-align:center;display:grid;gap:10px;justify-items:center;color:var(--npmut)}
.ew .btnw{border:1px solid #bdbdbd;background:#fff;border-radius:4px;padding:4px 14px}
.ew .btnw.prim{background:var(--npacc);border-color:var(--npacc);color:#fff}
.ew .btnw:focus-visible{outline:2px solid #000;outline-offset:2px}
.ew-dlgfond{position:absolute;inset:0;z-index:8;background:rgba(0,0,0,.18);display:flex;align-items:flex-start;justify-content:center;padding:10px;overflow:auto}
.ew-dlg{background:#fff;color:#1b1b1b;border:1px solid #b8b8b8;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.25);width:min(100%,560px);display:flex;flex-direction:column}
.ew-dlg .t{padding:7px 12px;font-size:13px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}
.ew-dlg .cale{padding:6px 12px;font-size:13px;color:#333;border-bottom:1px solid #eee}
.ew-dlg .corp{display:grid;grid-template-columns:minmax(6.5em,9em) minmax(0,1fr);min-height:7.5em;border-bottom:1px solid #eee}
.ew-dlg nav{display:grid;align-content:start;border-right:1px solid #eee;padding:4px}
.ew-dlg nav button{border:0;background:transparent;text-align:left;padding:3px 8px;border-radius:4px;font-size:13px}
.ew-dlg nav button.act{background:#e5f1fb}
.ew-dlg .lista{list-style:none;margin:0;padding:4px;font-size:13px;overflow:auto;max-height:9.5em}
.ew-dlg .lista li button{border:0;background:transparent;width:100%;text-align:left;padding:3px 6px;border-radius:4px;display:flex;justify-content:space-between;gap:10px}
.ew-dlg .lista li button:hover{background:#f0f6fc}
.ew-dlg .lista .tip{color:#666;font-size:12px;white-space:nowrap}
.ew-dlg .gol{color:#666;padding:10px;text-align:center}
.ew-dlg .rand{display:grid;grid-template-columns:8.5em minmax(0,1fr);align-items:center;gap:6px;padding:4px 12px;font-size:13px}
.ew-dlg .rand label{text-align:right}
.ew-dlg input,.ew-dlg select{font:inherit;font-size:16px;min-height:32px;border:1px solid #9a9a9a;border-radius:4px;padding:2px 6px;background:#fff;color:#000;width:100%;min-width:0}
.ew-dlg .jos{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-end;padding:8px 12px;background:#f3f3f3;border-radius:0 0 8px 8px;font-size:13px}
.ew-dlg .jos .cod{display:flex;align-items:center;gap:6px;margin-right:auto}
.ew-dlg .jos .cod select{width:auto}
.ew-dlg .msgd{padding:6px 12px;color:#a4262c;font-size:13px}
.ew-dlg.mic{width:min(100%,430px)}
.ew-dlg .txt{display:flex;gap:12px;padding:14px 16px;font-size:14px;white-space:pre-line}
.ew-dlg .avert{flex:none;width:28px;height:26px;background:#f7c948;clip-path:polygon(50% 0,100% 100%,0 100%);position:relative}
.ew-dlg .avert::after{content:"!";position:absolute;left:0;right:0;bottom:2px;text-align:center;font-weight:700;color:#000;font-size:15px}
.ex-corp{display:grid;grid-template-columns:minmax(6.5em,9em) minmax(0,1fr);min-height:12em}
.ex-sus{display:flex;gap:6px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--npln);font-size:13px;background:#fff}
.ex-sus .bar{flex:1;border:1px solid #d6d6d6;border-radius:4px;padding:4px 8px;background:#fafafa;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.ex-nav{display:grid;align-content:start;padding:4px;border-right:1px solid var(--npln)}
.ex-nav button{border:0;background:transparent;text-align:left;padding:3px 8px;border-radius:4px;font-size:13px}
.ex-nav button.act{background:#e5f1fb}
.ex-tab{width:100%;border-collapse:collapse;font-size:13px}
.ex-tab th{font-weight:400;color:#555;text-align:left;padding:4px 8px;border-bottom:1px solid #eee}
.ex-tab td{padding:0}
.ex-tab td button{border:0;background:transparent;width:100%;text-align:left;padding:5px 8px;display:flex;align-items:center;gap:8px;border-radius:4px}
.ex-tab tr.sel button{background:#cce8ff}
.ex-tab .tipc{color:#555;padding:5px 8px;white-space:nowrap;font-size:12px}
.fi{flex:none;width:16px;height:19px;border-radius:2px;position:relative}
.fi.html{background:#fff;border:1px solid #0c59a4}.fi.html::after{content:"";position:absolute;inset:3px;border-radius:50%;border:2px solid #0f6cbd}
.fi.txt{background:#fff;border:1px solid #6a6a6a}.fi.txt::after{content:"";position:absolute;left:3px;right:3px;top:4px;height:9px;background:repeating-linear-gradient(#777 0 1px,transparent 1px 3px)}
.fi.alt{background:#e8e8e8;border:1px solid #888}
.br-file{display:flex;align-items:flex-end;gap:2px;background:#e8e8e8;padding:6px 6px 0;overflow-x:auto;scrollbar-width:thin}
.br-ic{border-radius:50%;border:2px solid #555;width:16px;height:16px;margin:0 6px 0 2px}
.br-fila{display:flex;align-items:center;gap:4px;max-width:14em;min-width:5em;padding:4px 4px 4px 8px;border:0;border-radius:8px 8px 0 0;background:transparent;font-size:12.5px}
.br-fila.act{background:#fff}
.br-fila .fn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left}
.br-fila .x{flex:none;width:30px;height:26px;border:0;background:transparent;border-radius:4px}
.br-bara{display:flex;align-items:center;gap:4px;padding:5px 8px;background:#fff;border-bottom:1px solid #e3e3e3}
.br-bara>button{border:0;background:transparent;border-radius:50%;width:34px;height:34px;font-size:17px}
.br-bara>button:hover{background:#eee}
.br-adr{flex:1;min-width:0;display:flex;align-items:center;gap:6px;border:1px solid #d6d6d6;border-radius:18px;padding:5px 12px;font-size:13px;background:#f7f7f7}
.br-adr .chip{color:#555;flex:none}
.br-adr .u{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.br-corp{position:relative;flex:1;min-height:12em;background:#fff;outline:0}
.br-corp:focus-visible{box-shadow:inset 0 0 0 2px var(--npacc)}
.br-corp iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.br-strat{position:absolute;inset:0;z-index:2}
.br-corp pre{margin:0;padding:8px;font-family:Consolas,monospace;font-size:13px;white-space:pre-wrap;word-break:break-word;color:#000}
.br-vs{font-family:Consolas,monospace;font-size:13px;color:#000}
.br-vs .inc{padding:4px 8px;border-bottom:1px solid #ddd;font-family:Consolas,monospace}
.br-vs table{border-collapse:collapse}
.br-vs td{padding:0 8px;vertical-align:top;white-space:pre-wrap;word-break:break-all}
.br-vs td.nr{color:#999;text-align:right;user-select:none;background:#f5f5f5;width:2.5em}
.br-vs .tg{color:#881280}
.br-goala{padding:20px;color:#555;font-size:14px;text-align:center}
.br-ctx{position:absolute;z-index:5;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.2);padding:4px;min-width:14em}
.br-ctx button{display:flex;justify-content:space-between;gap:16px;width:100%;border:0;background:transparent;text-align:left;padding:5px 10px;border-radius:4px;font-size:13px}
.br-ctx button:hover{background:#f0f0f0}
.ew-bara{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.ew-bara button{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:8px;padding:4px 12px;display:flex;align-items:center;gap:6px;font-size:.92rem}
.ew-bara button.act{border-color:var(--accent);box-shadow:inset 0 -3px 0 var(--accent)}
.ew-taste{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:.88rem;color:var(--ink2)}
.ew-taste button{border:1px solid var(--line);background:var(--paper2);color:var(--ink);border-radius:6px;padding:2px 10px;font-family:var(--fm)}
.ew-msg{margin:0;font-size:.95rem;min-height:1.3em}
.ew-msg.av{color:var(--bad)}
.ew-nota{margin:0;font-size:.82rem;color:var(--ink2)}
.ew-dlg .lista li button span:first-child,.ex-tab td button span:last-child{overflow-wrap:anywhere;min-width:0}
@container (max-width:600px){
 .ew-dlgfond{position:static;background:transparent;padding:6px 0 0}
 .ew-dlg{width:100%}
 .ew-dlg .corp,.ex-corp{grid-template-columns:minmax(0,1fr)}
 .ew-dlg nav,.ex-nav{display:flex;flex-wrap:wrap;gap:2px;border-right:0;border-bottom:1px solid #eee}
 .ew-dlg .rand{grid-template-columns:minmax(0,1fr);gap:2px}
 .ew-dlg .rand label{text-align:left}
 .ew-dlg .lista li button{flex-direction:column;gap:0}
 .ex-tab .tipc{white-space:normal}
 .np-ta{min-height:7em}
 .np-fx button[aria-hidden="true"]{display:none}
 .np-fila{min-width:8em}}
.lv{display:grid;gap:8px;grid-template-columns:minmax(0,1fr)}
@container (min-width:760px){.lv{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.lv .ew-win{display:flex}
.lv .np-ta{min-height:7em}
.lv-nota{font-size:12px;color:#555;padding:4px 10px;background:#fffbe6;border-bottom:1px solid #eee}
.lv .br-corp{min-height:9em}
.lv-cor{font-size:.9rem;border-radius:8px;padding:6px 10px;background:var(--badbg);border:1px solid var(--bad)}
.lv-cor.bun{background:var(--okbg);border-color:var(--ok)}`;
function css(){if(!document.getElementById('editorweb-css')){const s=document.createElement('style');s.id='editorweb-css';s.textContent=CSS;document.head.appendChild(s)}}
const tactil=()=>window.matchMedia&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:760px)').matches);

/* sursa în stil view-source: numere de rând + etichetele colorate */
function viewSource(t){
  const r=String(t).replace(/\r\n/g,'\n').split('\n');
  return `<div class="br-vs"><div class="inc">Încadrare linie <input type="checkbox" disabled aria-label="Încadrare linie"></div><table>${r.map((l,i)=>`<tr><td class="nr">${i+1}</td><td>${ESC(l).replace(/(&lt;\/?[a-zA-Z][^&]*?&gt;)/g,'<span class="tg">$1</span>')}</td></tr>`).join('')}</table></div>`;
}
function titluFilaBrowser(S,t){
  const n=t.cale.split('/').pop();
  if(t.sursa)return n;
  return eHtml(n)&&titluPagina(t.continut)||n;
}

/* ------------------------------ desenul ------------------------------ */
function deseneaza(Q,body,api){
  const E=body._ew,S=E.S;
  const teste=Q.teste||[];
  const vechi=body.querySelector('.np-ta');
  const caret=vechi&&document.activeElement===vechi?[vechi.selectionStart,vechi.selectionEnd]:null;
  const aveaFocus=body.contains(document.activeElement);
  let h='';
  if(teste.length)h+=`<div class="ew-teste"><div class="lbl">Testele · <span class="nr"></span></div><ol>${teste.map((c,i)=>`<li data-i="${i}"><span class="s">○</span><span>${c.ce}</span></li>`).join('')}</ol></div>`;
  if(S.mod==='live'){h+=deseneazaLive(Q,S);body.innerHTML=`<div class="ew" data-mod="live">${h}<p class="ew-msg" aria-live="polite"></p></div>`;legaLive(Q,body,api);actualizeaza(Q,body);return}
  const fer=S.fer;
  const lat=fer.includes('notepad')&&fer.length>1;
  h+=`<div class="ew-ecran ${lat?'doua':''}" data-activa="${S.activa}" data-dreapta="${S.dreapta||''}">`;
  if(fer.includes('notepad'))h+=deseneazaNotepad(Q,S);
  if(fer.includes('explorer'))h+=deseneazaExplorer(Q,S);
  if(fer.includes('browser'))h+=deseneazaBrowser(Q,S);
  h+='</div>';
  if(fer.length>1)h+=`<div class="ew-bara" role="group" aria-label="Bara de activități: alege fereastra">${fer.map(w=>`<button type="button" data-fer="${w}" class="${S.activa===w?'act':''}">${w==='notepad'?'<span class="np-ic" style="margin:0"></span> Notepad':w==='explorer'?'<span class="fi alt"></span> Documente (Explorer)':'<span class="br-ic" style="margin:0"></span> Browser'}</button>`).join('')}</div>`;
  if(tactil())h+=`<div class="ew-taste" role="group" aria-label="Taste pentru telefon">Pe telefon nu ai tastele: ${['Ctrl+S','F5','Ctrl+U'].map(k=>`<button type="button" data-tasta="${k}">${k}</button>`).join('')}</div>`;
  h+=`<p class="ew-msg ${S.msgAv?'av':''}" aria-live="polite">${S.msg||''}</p>`;
  if(!tactil())h+=`<p class="ew-nota">În pagina asta nu apăsa <kbd>Ctrl</kbd>+<kbd>W</kbd> sau <kbd>Ctrl</kbd>+<kbd>N</kbd>: le folosește browserul tău (ar închide lecția sau ar deschide o fereastră). Folosește meniul <b>Fișier</b>, <b>+</b> și <b>×</b>.</p>`;
  body.innerHTML=`<div class="ew" data-mod="notepad">${h}</div>`;
  lega(Q,body,api);
  actualizeaza(Q,body);
  const ta=body.querySelector('.np-ta');
  if(ta&&caret&&!S.dialog){ta.focus({preventScroll:true});try{ta.setSelectionRange(caret[0],caret[1])}catch(e){}}
  if(S.dialog){const f=body.querySelector('[data-focus]');if(f)f.focus({preventScroll:true});
    /* pe ecran îngust fereastra de dialog stă sub Notepad: o aduc în vedere dacă nu se vede toată */
    const dl=body.querySelector('.ew-dlg');if(dl&&getComputedStyle(dl.parentNode).position==='static'){const r=dl.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)dl.scrollIntoView({block:'nearest'})}}
  /* elementul cu focus a fost redesenat: focusul trece pe fereastra care se vede, nu cade pe pagina lecției
     (acolo F5 ar reîncărca LECȚIA, iar Ctrl+S ar salva-o) */
  if(aveaFocus&&!body.contains(document.activeElement))focusVizibil(body);
}
/* focusul pe fereastra din față (ca la calculator: tastele merg la fereastra activă) */
function focusVizibil(body){
  const S=body._ew&&body._ew.S;if(!S)return;
  const vede=el=>!!el&&el.getClientRects().length>0;
  let el=S.dialog?body.querySelector('[data-focus]'):null;
  if(!vede(el)){const p={notepad:'.np-ta,[data-act="porneste"]',browser:'.br-corp',explorer:'.ex-tab button,.ex-nav button.act'}[S.activa];el=p?[...body.querySelectorAll(p)].find(vede):null}
  if(!vede(el))el=[...body.querySelectorAll('.np-ta,.br-corp,.ex-tab button,[data-act="porneste"]')].find(vede)||null;
  if(!vede(el)){el=body.querySelector('.ew');if(el)el.setAttribute('tabindex','-1')}
  if(el)el.focus({preventScroll:true});
  if(el&&el.classList.contains('np-ta')){const f=fila(S),k=f&&f._caret;if(k&&k[1]<=el.value.length)try{el.setSelectionRange(k[0],k[1])}catch(e){}}
}
function deseneazaLive(Q,S){
  const t=S.live.text,ttl=titluPagina(t)||S.live.fisier;
  return `<div class="lv">
  <section class="ew-win" data-w="notepad" aria-label="Notepad"><div class="np-file"><span class="np-ic" aria-hidden="true"></span><span class="np-fila act"><span class="fn">${ESC(S.live.fisier)}</span></span></div>
   <textarea class="np-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Textul fișierului ${ESC(S.live.fisier)}">${ESC(t)}</textarea></section>
  <section class="ew-win" data-w="browser" aria-label="Browserul"><div class="br-file"><span class="br-fila act"><span class="br-ic" aria-hidden="true"></span><span class="fn">${ESC(ttl)}</span></span></div>
   <div class="lv-nota">${Q.notaLive||'Aici pagina se redesenează singură, cât scrii. La calculator o vezi abia după ce salvezi fișierul și reîmprospătezi pagina în browser.'}</div>
   <div class="br-corp"><iframe sandbox="" title="Pagina, așa cum o desenează browserul" srcdoc="${ESC(previewDoc(t))}"></iframe><div class="br-strat" tabindex="-1"></div></div></section>
  </div><div class="lv-cor" hidden></div>`;
}
function deseneazaNotepad(Q,S){
  if(!S.np.deschis)return `<section class="ew-win" data-w="notepad" aria-label="Notepad"><div class="np-inchis"><p>Notepad e închis.${S.np.sesiune&&S.np.sesiune.length?' La pornire își redeschide filele de data trecută.':''}</p><button type="button" class="btnw prim" data-act="porneste">Pornește Notepad</button><p style="font-size:12px">(la calculator: tasta Windows, scrii Notepad, Enter)</p></div></section>`;
  const f=fila(S);
  let h=`<section class="ew-win" data-w="notepad" aria-label="Notepad"><div class="np-file" role="tablist"><span class="np-ic" aria-hidden="true"></span>`;
  S.np.file.forEach((x,i)=>{const nm=x.n||numeFila(x.text),mod=murdar(x);
    h+=`<span class="np-fila ${i===S.np.activa?'act':''}" role="tab" aria-selected="${i===S.np.activa}"><button type="button" class="fn" data-fila="${i}" style="border:0;background:transparent;min-width:32px" title="${ESC(nm)}">${ESC(nm)}</button><button type="button" class="x" data-inchfila="${i}" aria-label="Închideți fila ${ESC(nm)}${mod?' (are modificări nesalvate)':''}" title="${mod?'Modificat: nesalvat':'Închideți fila'}">${mod?'●':'×'}</button></span>`});
  h+=`<button type="button" class="np-plus" data-act="filaNoua" aria-label="Adăugați o nouă filă" title="Adăugați o nouă filă">+</button><span class="np-fx"><button type="button" tabindex="-1" aria-hidden="true">–</button><button type="button" tabindex="-1" aria-hidden="true">▢</button><button type="button" class="inch" data-act="inchideFereastra" aria-label="Închidere (închide fereastra Notepad)" title="Închidere">✕</button></span></div>`;
  h+=`<div class="np-meniu"><button type="button" data-meniu="fisier" aria-expanded="${S.meniu==='fisier'}">Fișier</button><button type="button" data-meniu="editare" aria-expanded="${S.meniu==='editare'}">Editare</button><button type="button" data-meniu="viz" aria-expanded="${S.meniu==='viz'}">Vizualizare</button>`;
  if(f&&!f.n)h+=`<span class="np-format" aria-label="Butoanele de formatare ale Notepad-ului (nu le folosim)">${['H1 ▾','☰ ▾','B','I','S','…'].map(b=>`<button type="button" data-format="1" title="Formatare (nu o folosim azi)">${b}</button>`).join('')}</span>`;
  h+=`</div>`;
  if(S.meniu)h+=meniuNotepad(S);
  h+=`<textarea class="np-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Textul din fila ${ESC(f?f.n||numeFila(f.text):'')}">${ESC(f?f.text:'')}</textarea>`;
  h+=`<div class="np-stare" aria-label="Bara de stare a Notepad-ului"><span class="lc">Ln 1, Col 1</span><span class="nc">${caractere(f?f.text.replace(/\n/g,'').length:0)}</span><span>Text simplu</span><span>100%</span><span>Windows (CRLF)</span><span class="cd">${ESC(f?f.cod:'UTF-8')}</span></div>`;
  if(S.dialog)h+=deseneazaDialog(S);
  return h+'</section>';
}
const MENIU={
  fisier:[['filaNoua','Filă nouă','Ctrl+N'],['nu:fereastra','Fereastră nouă','Ctrl+Shift+N'],['nu:md','Filă nouă Markdown',''],['deschideti','Deschideți','Ctrl+O'],['nu:recente','Recente',''],'-',
    ['salvati','Salvați','Ctrl+S'],['salvatiCa','Salvați ca','Ctrl+Shift+S'],['nu:toate','Salvează toate','Ctrl+Alt+S'],'-',['nu:print','Configurare pagină',''],['nu:print','Imprimați','Ctrl+P'],'-',
    ['inchideFila','Închideți fila','Ctrl+W'],['inchideFereastra','Închideți fereastra','Ctrl+Shift+W'],['inchideFereastra','Ieșire','']],
  editare:[['undo','Anulați','Ctrl+Z'],'-',['nu:taste','Decupați','Ctrl+X'],['nu:taste','Copiați','Ctrl+C'],['nu:taste','Lipiți','Ctrl+V'],['nu:taste','Ștergeți','Del'],'-',['nu:cauta','Găsiți','Ctrl+F'],['nu:cauta','Înlocuiți','Ctrl+H'],'-',['selTot','Selectați tot','Ctrl+A'],['ora','Oră/dată','F5'],['nu:setari','Font','']],
  viz:[['nu:setari','Zoom',''],['nu:setari','Bară de stare',''],['nu:setari','Încadrare cuvânt',''],['nu:setari','Markdown','']]
};
function meniuNotepad(S){
  const st={fisier:'left:6px',editare:'left:62px',viz:'left:128px'}[S.meniu];
  return `<div class="np-drop" role="menu" style="top:84px;${st}">${MENIU[S.meniu].map(x=>x==='-'?'<hr>':`<button type="button" role="menuitem" data-cmd="${x[0]}"><span>${x[1]}</span><span class="k">${x[2]}</span></button>`).join('')}</div>`;
}
function listaDosar(S,d,tip){return(S.fisiere[d]||[]).filter(f=>tip==='toate'||ext(f.n)==='txt')}
function deseneazaDialog(S){
  const D=S.dialog;
  if(D.k==='salvare'||D.k==='deschidere'){
    const l=listaDosar(S,D.dosar,D.tip);
    const tl=D.k==='salvare'?'Salvare ca':'Deschidere';
    return `<div class="ew-dlgfond"><div class="ew-dlg" role="dialog" aria-modal="true" aria-label="${tl}"><div class="t"><span>${tl}</span><button type="button" class="btnw" data-dlg="anulare" aria-label="Închide fereastra ${tl}" style="border:0">✕</button></div>
     <div class="cale">› ${ESC(D.dosar)}</div>
     <div class="corp"><nav aria-label="Locuri">${DOSARE.map(d=>`<button type="button" data-loc="${d}" class="${d===D.dosar?'act':''}">${d}</button>`).join('')}</nav>
      <ul class="lista" aria-label="Fișierele din ${ESC(D.dosar)} (după tipul ales)">${l.length?l.map(f=>`<li><button type="button" data-alege="${ESC(f.n)}"><span>${ESC(f.n)}</span><span class="tip">${tipExplorer(f.n)}</span></button></li>`).join(''):`<li class="gol">Niciun element nu corespunde căutării.</li>`}</ul></div>
     <div class="rand"><label for="ewn">Nume fișier:</label><input id="ewn" class="dlg-nume" value="${ESC(D.nume)}" autocomplete="off" autocapitalize="off" spellcheck="false" data-focus="1"></div>
     <div class="rand"><label for="ewt">${D.k==='salvare'?'Salvare cu tipul:':'Tipul:'}</label><select id="ewt" class="dlg-tip">${TIPURI.map(([v,t])=>`<option value="${v}" ${v===D.tip?'selected':''}>${t}</option>`).join('')}</select></div>
     ${D.eroare?`<div class="msgd" role="alert">${D.eroare}</div>`:''}
     <div class="jos">${D.k==='salvare'?`<span class="cod"><label for="ewc">Codificare:</label><select id="ewc" class="dlg-cod">${CODARI.map(c=>`<option ${c===D.cod?'selected':''}>${c}</option>`).join('')}</select></span>`:''}<button type="button" class="btnw prim" data-dlg="ok">${D.k==='salvare'?'Salvare':'Deschidere'}</button><button type="button" class="btnw" data-dlg="anulare">Anulare</button></div></div></div>`;
  }
  if(D.k==='exista')return `<div class="ew-dlgfond"><div class="ew-dlg mic" role="alertdialog" aria-modal="true" aria-label="Confirmare Salvare ca"><div class="t"><span>Confirmare Salvare ca</span></div><div class="txt"><span class="avert" aria-hidden="true"></span><span>${ESC(D.n)} există deja.\nÎl înlocuiți?</span></div><div class="jos"><button type="button" class="btnw" data-dlg="da">Da</button><button type="button" class="btnw prim" data-dlg="nu" data-focus="1">Nu</button></div></div></div>`;
  if(D.k==='ansi')return `<div class="ew-dlgfond"><div class="ew-dlg mic" role="alertdialog" aria-modal="true" aria-label="Notepad"><div class="t"><span>Notepad</span></div><div class="txt"><span>${AVERT_ANSI}</span></div><div class="jos"><button type="button" class="btnw" data-dlg="ansiok">OK</button><button type="button" class="btnw prim" data-dlg="ansinu" data-focus="1">Anulare</button></div></div></div>`;
  if(D.k==='intreaba'){const x=S.np.file[D.i];const ce=x.n?caleWin(x.dosar,x.n):numeFila(x.text);
    return `<div class="ew-dlgfond"><div class="ew-dlg mic" role="alertdialog" aria-modal="true" aria-label="Notepad"><div class="t"><span>Notepad</span></div><div class="txt"><span>Salvați modificările la ${ESC(ce)}?</span></div><div class="jos"><button type="button" class="btnw prim" data-dlg="isalv" data-focus="1">Salvare</button><button type="button" class="btnw" data-dlg="inu">Nu salvați</button><button type="button" class="btnw" data-dlg="ianul">Anulare</button></div></div></div>`}
  return '';
}
function deseneazaExplorer(Q,S){
  const l=S.fisiere[S.ex.dosar]||[];
  return `<section class="ew-win" data-w="explorer" aria-label="Explorer: ${S.ex.dosar}"><div class="ex-sus"><span class="fi alt" aria-hidden="true"></span><span class="bar">› ${S.ex.dosar}</span></div>
   <div class="ex-corp"><nav class="ex-nav" aria-label="Panoul din stânga">${DOSARE.map(d=>`<button type="button" data-exloc="${d}" class="${d===S.ex.dosar?'act':''}">${d}</button>`).join('')}</nav>
   <div style="overflow:auto"><table class="ex-tab"><thead><tr><th>Nume</th><th>Tip</th></tr></thead><tbody>${l.length?l.map(f=>{const cl=eHtml(f.n)?'html':ext(f.n)==='txt'?'txt':'alt';
     return `<tr class="${S.ex.sel===f.n?'sel':''}"><td><button type="button" data-exf="${ESC(f.n)}" title="Dublu-clic: deschide"><span class="fi ${cl}" aria-hidden="true"></span><span>${ESC(afisNume(f.n,S.ex.ascunse))}</span></button></td><td class="tipc">${tipExplorer(f.n)}</td></tr>`}).join(''):'<tr><td colspan="2" style="padding:12px;color:#666">Acest folder este gol.</td></tr>'}</tbody></table></div></div>
   <p class="ew-nota" style="padding:4px 10px;color:#555">${S.ex.ascunse?'Ca în setarea de la început a Windows-ului, extensiile cunoscute (.html, .txt) nu se văd: te uiți la pictogramă și la coloana Tip. ':''}Dublu-clic (pe telefon: două atingeri) deschide fișierul.</p></section>`;
}
function deseneazaBrowser(Q,S){
  const t=S.br.file[S.br.activa];
  let h=`<section class="ew-win" data-w="browser" aria-label="Browserul"><div class="br-file" role="tablist">`;
  if(!S.br.file.length)h+=`<span class="br-fila act"><span class="br-ic" aria-hidden="true"></span><span class="fn">Filă nouă</span></span>`;
  S.br.file.forEach((x,i)=>{const tt=titluFilaBrowser(S,x);h+=`<span class="br-fila ${i===S.br.activa?'act':''}" role="tab" aria-selected="${i===S.br.activa}"><span class="br-ic" aria-hidden="true"></span><button type="button" class="fn" data-brfila="${i}" style="border:0;background:transparent;min-width:32px" title="${ESC(tt)}">${ESC(tt)}</button><button type="button" class="x" data-brinch="${i}" aria-label="Închide fila ${ESC(tt)}">×</button></span>`});
  const adr=t?(t.sursa?'view-source:file:///'+caleBara(...t.cale.split(/\/(.*)/s).slice(0,2)):caleBara(...t.cale.split(/\/(.*)/s).slice(0,2))):'';
  h+=`</div><div class="br-bara"><button type="button" tabindex="-1" aria-hidden="true" disabled>←</button><button type="button" data-act="f5" aria-label="Reîmprospătați această pagină (F5)" title="Reîmprospătați această pagină">⟳</button><div class="br-adr" aria-label="Bara de adrese și de căutare"><span class="chip">ⓘ ${t&&!t.sursa?'Fișier':''}</span><span class="u">${ESC(adr)}</span></div></div>`;
  h+=`<div class="br-corp" tabindex="0" aria-label="Pagina din browser (clic dreapta: meniul paginii)">`;
  if(!t)h+=`<div class="br-goala">Filă nouă. Deschide pagina ta din <b>Documente</b>: dublu-clic pe ea.</div>`;
  else if(t.sursa)h+=viewSource(t.continut);
  else if(eHtml(t.cale))h+=`<iframe sandbox="" title="Pagina ${ESC(t.cale.split('/').pop())}" srcdoc="${ESC(previewDoc(t.continut))}"></iframe><div class="br-strat"></div>`;
  else h+=`<pre>${ESC(t.continut)}</pre>`;
  if(S.ctx)h+=`<div class="br-ctx" role="menu" style="left:${S.ctx.x}px;top:${S.ctx.y}px"><button type="button" role="menuitem" data-ctx="f5"><span>Reîmprospătare</span><span class="k">F5</span></button><button type="button" role="menuitem" data-ctx="sursa"><span>Vizualizați sursa paginii</span><span class="k">Ctrl+U</span></button></div>`;
  return h+`</div></section>`;
}

/* ------------------------------ comportamentul ------------------------------ */
function mesaj(body,text,av){const S=body._ew.S;S.msg=text;S.msgAv=!!av;const m=body.querySelector('.ew-msg');if(m){m.innerHTML=text;m.classList.toggle('av',!!av)}}
function actualizeaza(Q,body){
  const E=body._ew,S=E.S,teste=Q.teste||[];
  if(teste.length){let n=0;teste.forEach((c,i)=>{const ok=test(S,c);if(ok)n++;const li=body.querySelector(`.ew-teste li[data-i="${i}"]`);if(li){li.classList.toggle('ok',ok);li.querySelector('.s').textContent=ok?'✓':'○'}});
    const nr=body.querySelector('.ew-teste .nr');if(nr)nr.textContent=`${n} din ${teste.length} trec`}
  const ta=body.querySelector('.np-ta');
  if(S.mod!=='live'&&ta){const v=ta.value.slice(0,ta.selectionStart),l=v.split('\n');const lc=body.querySelector('.np-stare .lc');if(lc)lc.textContent=`Ln ${l.length}, Col ${l[l.length-1].length+1}`}
}
function oraData(){const d=new Date(),z=x=>String(x).padStart(2,'0');return `${z(d.getHours())}:${z(d.getMinutes())} ${z(d.getDate())}.${z(d.getMonth()+1)}.${d.getFullYear()}`}
function legaLive(Q,body,api){
  const E=body._ew,S=E.S,ta=body.querySelector('.np-ta'),fr=body.querySelector('iframe'),tab=body.querySelector('.br-fila .fn'),cor=body.querySelector('.lv-cor');
  let tm=null;
  const upd=()=>{if(!ta.isConnected)return;S.live.text=ta.value;fr.srcdoc=previewDoc(ta.value);tab.textContent=titluPagina(ta.value)||S.live.fisier;
    if(E.verificat){const L=corecteaza(ta.value);cor.hidden=false;cor.className='lv-cor'+(L.length?'':' bun');cor.innerHTML=L.length?`<b>Etichetele:</b> ${L.slice(0,4).map(x=>x.text).join('; ')}.`:'<b>Etichetele</b> sunt scrise corect, fiecare cu perechea ei.'}
    actualizeaza(Q,body)};
  ta.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(upd,150)});
  ta.addEventListener('keydown',e=>{const k=e.key,c=e.ctrlKey||e.metaKey;
    if(k==='F5'||(c&&/^[sour]$/i.test(k))){e.preventDefault();mesaj(body,'Aici nu e nevoie: pagina se redesenează singură. La calculator salvezi fișierul în Notepad și reîmprospătezi pagina în browser.')}});
  body.querySelector('.br-strat').addEventListener('contextmenu',e=>e.preventDefault());
}
function lega(Q,body,api){
  const E=body._ew,S=E.S,re=()=>deseneaza(Q,body,api);
  const ta=body.querySelector('.np-ta');
  /* scurtăturile reale ale browserului tău sunt oprite cât lucrezi în simulator (F5 ar reîncărca LECȚIA, Ctrl+S ar salva-o) */
  body.querySelector('.ew').addEventListener('keydown',e=>{
    const k=e.key,c=e.ctrlKey||e.metaKey;
    if(k==='F5'||(c&&/^[sourp]$/i.test(k)))e.preventDefault();
    if(k==='Escape'&&(S.meniu||S.ctx)){S.meniu=null;S.ctx=null;re();const t=body.querySelector('.np-ta');if(t)t.focus({preventScroll:true})}
  },true);
  /* după orice schimbare a textului filei active: fila (nume, punct), bara de stare și testele — fără redesen */
  const dupaSchimbare=()=>{const f=fila(S);if(!f)return;
    const fl=body.querySelector('.np-fila.act');
    if(fl){const nm=f.n||numeFila(f.text),mod=murdar(f),fn=fl.querySelector('.fn'),x=fl.querySelector('.x');
      if(fn&&fn.textContent!==nm){fn.textContent=nm;fn.title=nm}
      if(x){x.textContent=mod?'●':'×';x.title=mod?'Modificat: nesalvat':'Închideți fila';x.setAttribute('aria-label',`Închideți fila ${nm}${mod?' (are modificări nesalvate)':''}`)}}
    const nc=body.querySelector('.np-stare .nc');if(nc)nc.textContent=caractere(nl(f.text).replace(/\n/g,'').length);actualizeaza(Q,body)};
  /* Anulați (Ctrl+Z), ca în Notepad-ul real: istoria e a FILEI (rămâne când treci la alta și după redesen), câte o
     scriere pe pas (un caracter tastat; ora/data de la F5 dintr-o dată); punctul ● rămâne aprins */
  const anuleaza=()=>{const f=fila(S),t=body.querySelector('.np-ta');if(!f||!f.hist||!f.hist.length)return;
    const h=f.hist.pop();f.text=h.t;f.murdar=true;
    if(t){t.value=h.t;const p=Math.min(h.s[0],t.value.length);t.focus({preventScroll:true});try{t.setSelectionRange(p,p)}catch(e){}}
    dupaSchimbare()};
  const insereazaOra=t=>{const f=fila(S);if(!f||!t)return;const a=t.selectionStart,b=t.selectionEnd;
    (f.hist||(f.hist=[])).push({t:f.text,s:[a,b]});t.setRangeText(oraData(),a,b,'end');f.text=t.value;f.murdar=true;dupaSchimbare()};
  if(ta){
    /* fără redesen la fiecare literă (pe telefon tastatura s-ar închide) */
    ta.addEventListener('beforeinput',()=>{const f=fila(S);if(f)f._sel=[ta.selectionStart,ta.selectionEnd]});
    ta.addEventListener('input',()=>{const f=fila(S);if(!f)return;
      if(nl(ta.value)!==nl(f.text)){(f.hist||(f.hist=[])).push({t:f.text,s:f._sel||[ta.selectionStart,ta.selectionStart]});if(f.hist.length>3000)f.hist.shift();f.murdar=true}
      f._sel=null;f.text=ta.value;dupaSchimbare()});
    ['keyup','click','select'].forEach(ev=>ta.addEventListener(ev,()=>actualizeaza(Q,body)));
    /* cursorul e al filei (ca în Notepad): îl țin minte, ca meniul (Oră/dată) să scrie unde era, nu la început */
    ['keyup','click','select','input'].forEach(ev=>ta.addEventListener(ev,()=>{const f=fila(S);if(f)f._caret=[ta.selectionStart,ta.selectionEnd]}));
    ta.addEventListener('keydown',e=>{const k=e.key,c=e.ctrlKey||e.metaKey;
      if(c&&e.shiftKey&&/^s$/i.test(k)){e.preventDefault();cmd('salvatiCa')}
      else if(c&&/^s$/i.test(k)){e.preventDefault();cmd('salvati')}
      else if(c&&!e.shiftKey&&/^z$/i.test(k)){e.preventDefault();anuleaza()}
      else if(c&&/^o$/i.test(k)){e.preventDefault();cmd('deschideti')}
      else if(c&&/^u$/i.test(k)){e.preventDefault();mesaj(body,'Ctrl+U merge în browser (sursa paginii). În Notepad nu face nimic.')}
      else if(k==='F5'){e.preventDefault();insereazaOra(ta);
        mesaj(body,'În Notepad, F5 scrie ora și data (Editare › Oră/dată). F5 care reîmprospătează pagina se apasă în <b>browser</b>. Șterge ce a apărut: Ctrl+Z o dată, sau Backspace.',true)}
    });
  }
  const cmd=c=>{
    S.meniu=null;const f=fila(S);
    if(c==='filaNoua'){ACT.filaNoua(S);mesaj(body,'');re();focusTa();return}
    if(c==='salvati'){if(f&&f.n){ACT.salveaza(S);mesaj(body,`Salvat în ${ESC(f.n)}. Notepad nu întreabă nimic: fișierul are deja nume.`);re();focusTa();return}c='salvatiCa'}
    if(c==='salvatiCa'){if(!f)return;S.dialog={k:'salvare',dosar:f.n?f.dosar:S.locPropus,nume:f.n?f.n:numeFila(f.text)+'.txt',tip:'txt',cod:f.cod||'UTF-8',inchideDupa:null};re();return}
    if(c==='deschideti'){S.dialog={k:'deschidere',dosar:'Documente',nume:'',tip:'txt'};re();return}
    if(c==='inchideFila'){incearcaInchideFila(S.np.activa);return}
    if(c==='inchideFereastra'){ACT.inchideFereastra(S);mesaj(body,'Ai închis fereastra cu X: Notepad își ține minte filele și le redeschide data viitoare, și colegului următor. Ca să nu rămână nimic, închide fila (Fișier › Închideți fila).',true);re();return}
    if(c==='selTot'){re();const t=body.querySelector('.np-ta');if(t){t.focus({preventScroll:true});t.select()}return}
    if(c==='undo'){re();anuleaza();return}
    if(c==='ora'){re();const t=body.querySelector('.np-ta');if(t){t.focus({preventScroll:true});const k=f&&f._caret;if(k)try{t.setSelectionRange(k[0],k[1])}catch(e){}insereazaOra(t)}return}
    const NU={'nu:fereastra':'O fereastră nouă de Notepad nu ne trebuie: lucrăm într-o filă.','nu:md':'Filele Markdown nu le folosim: pagina web e un fișier .html.','nu:recente':'Recente arată fișierele deschise de curând pe calculator, și pe ale colegilor. Nu le deschide.',
      'nu:toate':'Salvezi fila ta, cu Salvați (Ctrl+S).','nu:print':'Azi nu tipărim nimic.','nu:taste':'Folosește tastele (Ctrl+X, Ctrl+C, Ctrl+V, Delete).','nu:cauta':'Căutarea nu ne trebuie azi.','nu:setari':'Nu schimbăm setările Notepad-ului: calculatorul e comun.'};
    mesaj(body,NU[c]||'');re();
  };
  const focusTa=()=>{const t=body.querySelector('.np-ta');if(t&&!S.dialog){t.focus({preventScroll:true});const f=fila(S),k=f&&f._caret;if(k&&k[1]<=t.value.length)try{t.setSelectionRange(k[0],k[1])}catch(e){}}};
  const incearcaInchideFila=i=>{const x=S.np.file[i];if(!x)return;if(murdar(x)){S.np.activa=i;S.dialog={k:'intreaba',i};re();return}
    ACT.inchideFila(S,i);mesaj(body,S.np.deschis?'Fila s-a închis.':'Ai închis ultima filă: Notepad s-a închis și data viitoare pornește curat, cu o filă goală.');re()};
  const salveazaDinDialog=()=>{
    const D=S.dialog;const nume=(body.querySelector('.dlg-nume')||{}).value||'';D.nume=nume;D.tip=(body.querySelector('.dlg-tip')||{}).value||D.tip;D.cod=(body.querySelector('.dlg-cod')||{}).value||D.cod;
    if(D.k==='deschidere'){const fs=(S.fisiere[D.dosar]||[]).find(x=>x.n.toLowerCase()===nume.trim().toLowerCase())||(S.fisiere[D.dosar]||[]).find(x=>x.n.toLowerCase()===numeFinal(nume).toLowerCase());
      if(!fs){D.eroare='Nu găsesc fișierul în folderul ales. Verifică numele.';re();return}S.dialog=null;ACT.deschideInNotepad(S,D.dosar+'/'+fs.n);re();focusTa();return}
    if(!nume.trim()){D.eroare='Scrie numele fișierului la <b>Nume fișier</b>.';re();return}
    if(INTERZISE.test(nume)){D.eroare='Numele nu poate avea semnele \\ / : * ? " &lt; &gt; | (le-ai învățat în clasa a V-a). Schimbă numele.';re();return}
    if(D.cod==='ANSI'&&areNonAnsi(fila(S).text)&&!D.ansiOk){S.dialog=Object.assign({},D,{k:'ansi',dlgSalv:D});re();return}
    const r=ACT.salveazaCa(S,{nume,dosar:D.dosar,cod:D.cod});
    if(r.exista){S.dialog={k:'exista',n:r.n,dlgSalv:D};re();return}
    S.dialog=null;
    let m=`Salvat: <b>${ESC(r.n)}</b>, în ${ESC(D.dosar)}.`;
    if(ext(r.n)==='txt')m+=` Notepad a pus <b>.txt</b> la sfârșit${/\./.test(nume.trim())?' (după punct nu era o extensie cunoscută, ca .html)':' (numele nu se termina cu .html)'}: fișierul e text, nu pagină web.`;
    if(D.cod==='ANSI')m+=' Codificarea ANSI: literele ș și ț s-au pierdut.';
    mesaj(body,m,ext(r.n)==='txt'||D.cod==='ANSI');
    if(D.inchideDupa!=null){ACT.inchideFila(S,D.inchideDupa)}
    re();focusTa();
  };
  body.querySelectorAll('[data-fer]').forEach(b=>b.onclick=()=>{S.activa=b.dataset.fer;if(b.dataset.fer!=='notepad')S.dreapta=b.dataset.fer;S.meniu=null;S.ctx=null;re()});
  body.querySelectorAll('[data-fila]').forEach(b=>b.onclick=()=>{S.np.activa=+b.dataset.fila;S.activa='notepad';re();focusTa()});
  body.querySelectorAll('[data-inchfila]').forEach(b=>b.onclick=()=>incearcaInchideFila(+b.dataset.inchfila));
  body.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{const a=b.dataset.act;
    if(a==='filaNoua')return cmd('filaNoua');
    if(a==='inchideFereastra')return cmd('inchideFereastra');
    if(a==='porneste'){ACT.pornesteNotepad(S);mesaj(body,'');re();focusTa();return}
    if(a==='f5'){ACT.f5(S);S.activa='browser';mesaj(body,S.br.file.length?'Pagina s-a reîmprospătat: browserul a citit din nou fișierul salvat.':'');re();const bc=body.querySelector('.br-corp');if(bc)bc.focus({preventScroll:true})}});
  body.querySelectorAll('[data-meniu]').forEach(b=>b.onclick=()=>{S.meniu=S.meniu===b.dataset.meniu?null:b.dataset.meniu;S.activa='notepad';re();const p=body.querySelector('.np-drop button');if(p)p.focus({preventScroll:true})});
  body.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>cmd(b.dataset.cmd));
  body.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>mesaj(body,'Nu folosim butoanele de formatare ale Notepad-ului: în pagina web scrii etichetele tu, cu tastatura.'));
  /* dialogurile */
  body.querySelectorAll('[data-loc]').forEach(b=>b.onclick=()=>{const D=S.dialog;D.nume=body.querySelector('.dlg-nume').value;D.tip=body.querySelector('.dlg-tip').value;const c=body.querySelector('.dlg-cod');if(c)D.cod=c.value;D.dosar=b.dataset.loc;D.eroare='';re()});
  body.querySelectorAll('[data-alege]').forEach(b=>b.onclick=()=>{const i=body.querySelector('.dlg-nume');i.value=b.dataset.alege;i.focus({preventScroll:true})});
  const tipSel=body.querySelector('.dlg-tip');if(tipSel)tipSel.onchange=()=>{const D=S.dialog;D.nume=body.querySelector('.dlg-nume').value;D.tip=tipSel.value;const c=body.querySelector('.dlg-cod');if(c)D.cod=c.value;re()};
  /* meniul se deschide sub butonul lui */
  if(S.meniu){const mb=body.querySelector(`[data-meniu="${S.meniu}"]`),dr=body.querySelector('.np-drop'),w=body.querySelector('.ew-win[data-w="notepad"]');
    if(mb&&dr&&w){dr.style.top=(mb.offsetTop+mb.offsetHeight+2)+'px';dr.style.left=Math.max(6,Math.min(mb.offsetLeft,w.clientWidth-dr.offsetWidth-6))+'px'}}
  const nm=body.querySelector('.dlg-nume');if(nm){setTimeout(()=>{if(document.activeElement===nm)nm.select()},0)}
  if(nm)nm.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();salveazaDinDialog()}else if(e.key==='Escape'){e.preventDefault();S.dialog=null;re();focusTa()}});
  body.querySelectorAll('[data-dlg]').forEach(b=>b.onclick=()=>{const v=b.dataset.dlg,D=S.dialog;
    if(v==='ok')return salveazaDinDialog();
    if(v==='anulare'){S.dialog=null;mesaj(body,'');re();focusTa();return}
    if(v==='nu'){S.dialog=Object.assign({},D.dlgSalv,{eroare:''});mesaj(body,'Ai apăsat Nu: fișierul colegului a rămas neatins. Schimbă numele, de exemplu adaugă o cifră la sfârșit.');re();return}
    if(v==='da'){const DS=D.dlgSalv;const r=ACT.salveazaCa(S,{nume:DS.nume,dosar:DS.dosar,cod:DS.cod,inlocuieste:true});S.dialog=null;
      mesaj(body,`Ai înlocuit fișierul ${ESC(r.n)}: ce era în el s-a pierdut.${S.jurnal.some(j=>j.a==='inlocuit_coleg')?' Era fișierul unui coleg!':''}`,true);if(DS.inchideDupa!=null)ACT.inchideFila(S,DS.inchideDupa);re();focusTa();return}
    if(v==='ansiok'){S.dialog=Object.assign({},D.dlgSalv,{ansiOk:true});salveazaDinDialog();return}
    if(v==='ansinu'){S.dialog=Object.assign({},D.dlgSalv,{eroare:''});re();return}
    if(v==='isalv'){const x=S.np.file[D.i];if(x.n){S.np.activa=D.i;ACT.salveaza(S);ACT.inchideFila(S,D.i);S.dialog=null;mesaj(body,'Salvat și fila s-a închis.');re();return}
      S.np.activa=D.i;S.dialog={k:'salvare',dosar:S.locPropus,nume:numeFila(x.text)+'.txt',tip:'txt',cod:'UTF-8',inchideDupa:D.i};re();return}
    if(v==='inu'){ACT.inchideFila(S,D.i);S.dialog=null;mesaj(body,S.np.deschis?'Fila s-a închis fără salvare.':'Fila s-a închis fără salvare; Notepad s-a închis.');re();return}
    if(v==='ianul'){S.dialog=null;re();focusTa();return}
  });
  const dl=body.querySelector('.ew-dlg');if(dl)dl.addEventListener('keydown',e=>{
    if(e.key==='Escape'){const D=S.dialog;if(!D)return;e.preventDefault();if(D.k==='exista'||D.k==='ansi')S.dialog=Object.assign({},D.dlgSalv);else S.dialog=null;re();if(!S.dialog)focusTa()}
    else if(e.key==='Enter'&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='INPUT'&&e.target.tagName!=='SELECT'){const p=body.querySelector('.ew-dlg [data-focus]');if(p&&p.tagName==='BUTTON'){e.preventDefault();p.click()}}});
  /* Explorer */
  body.querySelectorAll('[data-exloc]').forEach(b=>b.onclick=()=>{S.ex.dosar=b.dataset.exloc;S.ex.sel=null;re()});
  body.querySelectorAll('[data-exf]').forEach(b=>{
    b.onclick=()=>{const n=b.dataset.exf,t=Date.now();if(E.lc&&E.lc.n===n&&t-E.lc.t<550){E.lc=null;return deschideDinExplorer(n)}E.lc={n,t};if(S.ex.sel!==n){S.ex.sel=n;re()}};
    b.ondblclick=e=>{e.preventDefault()};
    b.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();deschideDinExplorer(b.dataset.exf)}};
  });
  const deschideDinExplorer=n=>{const cale=S.ex.dosar+'/'+n;ACT.deschide(S,cale);
    mesaj(body,eHtml(n)?`S-a deschis în browser: <b>${ESC(n)}</b>.`:ext(n)==='txt'?`<b>${ESC(n)}</b> e un fișier text: s-a deschis în Notepad, nu în browser.`:'');re()};
  /* Browser */
  body.querySelectorAll('[data-brfila]').forEach(b=>b.onclick=()=>{S.br.activa=+b.dataset.brfila;S.ctx=null;re()});
  body.querySelectorAll('[data-brinch]').forEach(b=>b.onclick=()=>{ACT.inchideFilaBrowser(S,+b.dataset.brinch);S.ctx=null;re()});
  const bc=body.querySelector('.br-corp'),bw=body.querySelector('.ew-win[data-w="browser"]');
  /* ca în Edge/Chrome, F5 / Ctrl+R / Ctrl+U / Ctrl+S merg oriunde în fereastra browserului (fila, ⟳, pagina) */
  if(bc&&bw){
    bw.addEventListener('keydown',e=>{const k=e.key,c=e.ctrlKey||e.metaKey;
      if(k==='F5'||(c&&/^r$/i.test(k))){e.preventDefault();ACT.f5(S);S.ctx=null;mesaj(body,S.br.file.length?'Pagina s-a reîmprospătat: browserul a citit din nou fișierul salvat.':'');re();const x=body.querySelector('.br-corp');if(x)x.focus({preventScroll:true})}
      else if(c&&/^u$/i.test(k)){e.preventDefault();if(S.br.file[S.br.activa]){ACT.sursa(S);S.ctx=null;mesaj(body,'Ctrl+U a deschis o filă nouă cu sursa paginii: textul din fișier.');re();const x=body.querySelector('.br-corp');if(x)x.focus({preventScroll:true})}}
      else if(c&&/^s$/i.test(k)){e.preventDefault();mesaj(body,'În browser, Ctrl+S ar salva o copie a paginii. Pagina o salvezi în Notepad.')}});
    bc.addEventListener('contextmenu',e=>{e.preventDefault();if(!S.br.file[S.br.activa])return;const r=bc.getBoundingClientRect();S.ctx={x:Math.min(e.clientX-r.left,Math.max(0,r.width-230)),y:Math.min(e.clientY-r.top,Math.max(0,r.height-80))};re()});
    bc.addEventListener('click',e=>{if(S.ctx&&!e.target.closest('.br-ctx')){S.ctx=null;re()}});
  }
  body.querySelectorAll('[data-ctx]').forEach(b=>b.onclick=()=>{const v=b.dataset.ctx;S.ctx=null;if(v==='f5')ACT.f5(S);else ACT.sursa(S);mesaj(body,v==='f5'?'Pagina s-a reîmprospătat.':'S-a deschis o filă nouă cu sursa paginii.');re()});
  body.querySelectorAll('[data-tasta]').forEach(b=>b.onclick=()=>{const k=b.dataset.tasta;
    if(k==='Ctrl+S'){if(S.activa==='browser'&&!(window.matchMedia&&matchMedia('(min-width:860px)').matches)){mesaj(body,'Ctrl+S se apasă în Notepad. Treci întâi la Notepad (butonul de jos).');return}cmd('salvati')}
    else if(k==='F5'){if(S.activa==='notepad'&&!S.fer.includes('browser'))return;S.activa='browser';S.dreapta='browser';ACT.f5(S);mesaj(body,'F5 în browser: pagina s-a reîmprospătat.');re()}
    else if(k==='Ctrl+U'){S.activa='browser';S.dreapta='browser';if(S.br.file[S.br.activa]){ACT.sursa(S);mesaj(body,'Ctrl+U a deschis sursa paginii.')}re()}});
}

/* ------------------------------ tipul pentru motor ------------------------------ */
function porneste(Q,body,api,S){
  css();
  body._ew={S:S||stareInitiala(Q),verificat:false};
  deseneaza(Q,body,api);
}
const EditorWeb={
  render(Q,body,api){
    porneste(Q,body,api);
    const teste=Q.teste||[];
    if(!teste.length)return;
    const nav=api.checkButton(()=>{
      const E=body._ew,S=E.S;E.verificat=true;
      if(S.mod==='live'){const ta=body.querySelector('.np-ta');if(ta){S.live.text=ta.value;ta.dispatchEvent(new Event('input'))}}
      actualizeaza(Q,body);
      const k=teste.findIndex(c=>!test(S,c));
      if(k<0){api.resolve(true);return}
      api.resolve(false,`Testul care nu trece încă: <b>${teste[k].ce}</b>. ${teste[k].msg||''}`);
      /* focusul înapoi pe fereastra care se VEDE (Notepad ascuns sub browser nu poate primi focus, iar F5 ar ajunge la lecție) */
      if(S.mod==='live'){const f=body.querySelector('.np-ta');if(f)f.focus({preventScroll:true})}else focusVizibil(body);
      api.revealButton(()=>{const n=aplica(stareInitiala(Q),Q.rezolvare);porneste(Q,body,api,n);body._ew.verificat=true;actualizeaza(Q,body);
        if(api.nav())api.nav().innerHTML='';api.giveUp(Q.solutieText||'acum toate testele trec: uită-te la ferestre și la lista de teste.')});
    });
  },
  rezolva(Q,body,api){const n=aplica(stareInitiala(Q),Q.rezolvare);body._ew.S=n;deseneaza(Q,body,api);return true},
  gresit(Q,body,api){const n=aplica(stareInitiala(Q),Q.gresit||[]);body._ew.S=n;deseneaza(Q,body,api);return true}
};
window.EditorWeb=EditorWeb;
window.EditorWebUtil=UTIL_API;
})();
