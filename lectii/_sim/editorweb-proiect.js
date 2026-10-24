/* editorweb-proiect.js — extensie pentru simulatorul editorweb.js (proprietar editorweb: lecția VIII/14) și pentru
   extensiile editorweb-schelet.js (VIII/15), editorweb-continut.js (VIII/16), editorweb-verificare.js (VIII/20) și
   editorweb-stil.js (VIII/19). Proprietarul ACESTEI extensii: lecția VIII/21 („Mini-proiect: pagină web după specificații
   date”, 24.10.2026). Se încarcă DUPĂ ele. NU le schimbă, nu ascultă taste și nu schimbă desenul simulatorului: doar
   CITEȘTE paginile elevului (textul fișierelor, ca browserul: DOMParser) și spune care cerință a proiectului e îndeplinită.

   De ce fără editorweb-legaturi.js: împreună cu editorweb-continut.js, cele două rescriu amândouă srcdoc-ul browserului
   simulat (spus în capul lui editorweb-legaturi.js: „neprobat, deci nerecomandat”). Mini-proiectul are nevoie de fotografie
   desenată (editorweb-continut.js), deci legăturile NU se urmează în browserul simulat (editorweb.js le desenează
   nemișcate, a{pointer-events:none}); lecția spune asta pe ecran. Legătura se verifică aici pe NUME, după regulile probate
   la VIII/18 în Chromium (lectii/viii/m3-l18/_proba/proba_browser_l18_*_full.json): numele cu alte litere mari/mici merge,
   spațiile de la capetele lui href nu contează, href fără ghilimele merge; fișier lipsă / fără .html / cu un dosar în față
   („Documente/x.html”, „Documente\x.html”) / adresă fără https:// → pagina de eroare (ERR_FILE_NOT_FOUND).

   window.EditorWebProiect:
     CERINTE → [{id, scurt, ce, lectia, pagina}] — cele 8 cerințe ale paginii (în ordinea lecției):
       structura · paragrafe · imagine · sursa · listaTabel · legaturi · stil · siguranta;
       pagina = 'prima' (2, 3, 5, 7) sau 'amândouă' (1, 4 — fiecare fotografie —, 6, 8). (Câmpul `pagina` e nou, 24.10.2026,
       reparația după judecata 1: cerințele spun pe ce pagină se aplică.)
     corp(src) → <body> citit ca de browser (DOMParser), dar DOAR din ce e scris între <body …> și </body>
       (EditorWebSchelet.corp): ce stă după </body> nu se numără, ca la VIII/16 și VIII/18.
     paragrafe(src) → textele <p> din corp care sunt TEXT al paginii: cel puțin 3 cuvinte, fără textul legăturilor și fără
       rândul cu sursa unei imagini („Foto: …”, „Sursa: …”).
     sursa(src) → [{img, text}] — pentru fiecare <img> din corp, primul element de după el (până la următoarea imagine) al
       cărui text începe cu „Foto”, „Fotografie”, „Sursa”, „Sursă”, „Imagine” sau „Autor” / „Autorul”; text '' dacă
       lipsește. („Sursă:” și „Autor” primite de la 24.10.2026: înainte, „Sursă:” era respins, din cauza lui \b după ă.)
     sursaBuna(text, {autor?, licenta?}) → textul are autorul (dacă e dat) și o licență: CC0, CC BY / CC BY-SA (cu sau
       fără versiune) sau „domeniu public”; fără diacritice și litere mari.
     listaSauTabel(src) → {li, tabel, tr, col, ok} — li = cel mai mare număr de <li> (cu text) dintr-o <ul>/<ol> din
       corp; tabel = câte <table> are corpul; tr, col = cel mai bun tabel: tr = rândurile <tr> cu cel puțin o celulă
       (<td>/<th>), col = cele mai multe celule de pe un rând (coloanele); ok = li ≥ 3 sau (tr ≥ 3 și col ≥ 2) — cerința 5:
       „o listă (cel puțin 3 rânduri) sau un tabel (cel puțin 3 rânduri și 2 coloane)”. (Schimbat 24.10.2026, judecata 1
       M4: înainte tr număra doar rândurile cu ≥ 2 celule și ok era tr ≥ 2; un tabel 3 × 1 primea „niciun tabel”.)
     formatari(src) → [{tag, prop, val}] — declarațiile style pe care browserul le APLICĂ (EditorWebStil.declaratii,
       valid), fără dubluri tag+proprietate; style pus pe <html> sau <head> nu se numără.
     seCiteste(src) → EditorWebStil.lizibil(src).ok (regula lecției 19: contrast ≥ 3 la tot textul).
     legaturi(S, U, spec) → [{href, text, cale, exista, tip:'local'|'extern'|'gresit', gasit}] — legăturile din CORPUL
       paginii citite de spec (ca EditorWebSchelet.src), cu fișierul la care duc în dosarul paginii: exista = e o pagină
       (.html/.htm); gasit = numele fișierului găsit cu numele din href, de orice fel (de ex. o fotografie .jpg: browserul
       o arată, nu dă eroare), sau null. (`gasit` e nou, 24.10.2026.)
     duce(S, U, spec, laSpec) → o legătură din pagina `spec` duce la fișierul elevului găsit de `laSpec` (U.fisierElev)
       și are text (textBun).
     textBun(text) → textul legăturii spune unde duce: nu e gol, nu e „aici” / „click aici” / „apasă aici” / „link”, nu e o
       adresă (http…, www…) — regula lecției 18 (P6).
     sigur(src, opt) → EditorWebVerificare.curat cu TOATE tiparele lecției 20, plus opt.nume / opt.texte, fisiere:false
       (numele fișierelor de la școală au numele elevului: întrebarea 6, se notează, nu se schimbă).
     randare(cod, inaltime, eticheta, imagini) → desenul browserului pentru „Uite cum” (EditorWebStil.randare, crește cât
       pagina); `imagini` = {nume: uri}: <img src="nume"> primește copia înregistrată (altfel, imagine lipsă, ca în
       browser). Pagina desenată rămâne fără scripturi.
     tinta(href) → {tip:'local', nume} | {tip:'extern', url} | {tip:'gresit'} (regulile de mai sus; „./nume.html” și
       „.\nume.html” = nume.html, în același dosar — probat în Chromium, lectii/viii/m3-l21/_proba/proba_href_punct.json).
   Ce nu are voie să schimbe nimeni: numele de mai sus și forma rezultatelor. Ce îți lipsește → extensie cu nume nou. */
(function(){
'use strict';
const U=window.EditorWebUtil,ES=window.EditorWebSchelet,EWC=window.EditorWebContinut,EV=window.EditorWebVerificare,EWS=window.EditorWebStil;
if(!U||!ES||!EWC||!EV||!EWS){console.error('editorweb-proiect.js: se încarcă după editorweb.js, -schelet, -continut, -verificare și -stil');return}
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const txt=el=>String(el&&el.textContent||'').replace(/\s+/g,' ').trim();
const parse=s=>new DOMParser().parseFromString(lin(s),'text/html');
const ext=n=>{const i=String(n).lastIndexOf('.');return i>0?String(n).slice(i+1).toLowerCase():''};

const CERINTE=[
  {id:'structura',scurt:'schelet, titlu pe filă, titlu mare',ce:'Scheletul întreg, cu &lt;title&gt; și titlul mare &lt;h1&gt;',lectia:'14, 15',pagina:'amândouă'},
  {id:'paragrafe',scurt:'două paragrafe',ce:'Cel puțin două paragrafe despre temă',lectia:'16',pagina:'prima'},
  {id:'imagine',scurt:'fotografia, cu alt',ce:'O fotografie care se vede, cu textul alternativ (alt)',lectia:'16',pagina:'prima'},
  {id:'sursa',scurt:'sursa sub fiecare fotografie',ce:'Sub fiecare fotografie, sursa ei: Foto, autorul, licența',lectia:'20',pagina:'amândouă'},
  {id:'listaTabel',scurt:'o listă sau un tabel',ce:'O listă (cel puțin 3 rânduri) sau un tabel (cel puțin 3 rânduri și 2 coloane)',lectia:'17',pagina:'prima'},
  {id:'legaturi',scurt:'legăturile dus-întors',ce:'O legătură spre pagina a doua și una înapoi, care merg',lectia:'18',pagina:'amândouă'},
  {id:'stil',scurt:'două formatări cu style',ce:'Cel puțin două formatări cu style, ușor de citit',lectia:'19',pagina:'prima'},
  {id:'siguranta',scurt:'lista de verificare',ce:'Lista de verificare a lecției 20, trecută',lectia:'20',pagina:'amândouă'}
];

/* corpul = DOAR ce e scris între <body …> și </body> (EditorWebSchelet.corp), citit ca de browser. Ce stă după </body>
   browserul tot îl arată, dar lecția 15 a predat că pagina se scrie în corp, iar VIII/16 și VIII/18 nu primesc ca bun
   un conținut pus în afara lui: aici, la fel. */
function corp(src){
  const b=ES.corp(src);
  return new DOMParser().parseFromString('<!DOCTYPE html><html><head></head><body>'+(b==null?'':b)+'</body></html>','text/html').body;
}
const RE_SURSA=/^(foto|fotografie|fotografia|sursa|sursă|imaginea|imagine|autorul|autor)(?![\p{L}\d])/iu;
const eSursa=t=>RE_SURSA.test(String(t).trim());
function paragrafe(src){
  const b=corp(src);
  return [...b.querySelectorAll('p')].map(p=>{const c=p.cloneNode(true);c.querySelectorAll('a').forEach(a=>a.remove());return txt(c)})
    .filter(t=>t&&!eSursa(t)&&t.split(' ').filter(w=>/[\p{L}\d]/u.test(w)).length>=3);
}
function sursa(src){
  const b=corp(src),toate=[...b.querySelectorAll('*')],out=[];
  toate.forEach((el,i)=>{
    if(el.tagName!=='IMG')return;
    let t='';
    for(let j=i+1;j<toate.length;j++){
      const e=toate[j];if(e.tagName==='IMG')break;
      if(el.contains(e))continue;
      const tt=txt(e);
      if(tt&&eSursa(tt)&&!(e.children.length&&[...e.children].some(c=>eSursa(txt(c))))){t=tt;break}
    }
    out.push({img:el.getAttribute('src')||'',text:t});
  });
  return out;
}
const RE_LIC=/\bcc0\b|\bcc[ -]?by(?:[ -]sa)?(?:[ -]?\d(?:\.\d)?)?\b|\bdomeniu public\b|\bdomeniul public\b/;
function sursaBuna(text,opt){
  opt=opt||{};const t=norm(text);if(!t)return false;
  if(opt.autor&&t.indexOf(norm(opt.autor))<0)return false;
  if(opt.licenta)return t.indexOf(norm(opt.licenta))>=0;
  return RE_LIC.test(t);
}
function listaSauTabel(src){
  const b=corp(src);
  const li=Math.max(0,...[...b.querySelectorAll('ul,ol')].map(l=>[...l.children].filter(c=>c.tagName==='LI'&&txt(c)).length));
  const tab=[...b.querySelectorAll('table')].map(t=>{const r=[...t.querySelectorAll('tr')].map(x=>[...x.children].filter(c=>c.tagName==='TD'||c.tagName==='TH').length).filter(n=>n>0);
    return {tr:r.length,col:Math.max(0,...r)}});
  const bun=x=>x.tr>=3&&x.col>=2;
  const cel=tab.slice().sort((a,b2)=>(bun(b2)-bun(a))||(b2.tr*b2.col-a.tr*a.col))[0]||{tr:0,col:0};
  return {li,tabel:tab.length,tr:cel.tr,col:cel.col,ok:li>=3||bun(cel)};
}
function formatari(src){
  const vazut=new Set(),out=[];
  (EWS.declaratii(src)||[]).forEach(d=>{
    if(!d.valid||/^(html|head|title|meta)$/i.test(d.tag))return;
    const k=String(d.tag).toLowerCase()+'|'+d.prop;
    if(vazut.has(k))return;vazut.add(k);out.push({tag:String(d.tag).toLowerCase(),prop:d.prop,val:d.val});
  });
  return out;
}
function seCiteste(src){try{return !!EWS.lizibil(src).ok}catch(e){return false}}
/* dosarul paginii citite de spec (mod live: dosarul editorului; altfel Documente sau spec.dosar) */
function dosarDe(S,spec){
  if(S.mod==='live')return S.ewcDosar||'Documente';
  if(spec&&spec.browser&&spec.browser!==true)return spec.browser.dosar||'Documente';
  return (spec&&spec.dosar)||'Documente';
}
function tinta(href){
  const h=String(href==null?'':href).trim().replace(/^\.[\/\\]/,'');
  if(!h)return {tip:'gresit'};
  if(/^https?:\/\//i.test(h))return {tip:'extern',url:h};
  if(/[\/\\:]/.test(h))return {tip:'gresit'};
  return {tip:'local',nume:h};
}
function legaturi(S,U2,spec){
  const src=ES.src(S,U2,spec);if(src==null)return [];
  const d=dosarDe(S,spec),fis=S.fisiere[d]||[];
  return [...corp(src).querySelectorAll('a[href]')].map(a=>{
    const href=a.getAttribute('href'),t=tinta(href);
    let exista=false,cale=null,gasit=null;
    if(t.tip==='local'){const f=fis.find(x=>x.n.toLowerCase()===t.nume.toLowerCase());if(f){gasit=f.n;if(['html','htm'].includes(ext(f.n))){exista=true;cale=d+'/'+f.n}}}
    return {href:String(href).trim(),text:txt(a),cale,exista,tip:t.tip,gasit};
  });
}
const RAU=['aici','click','click aici','clic aici','apasa aici','apasa','link','linkul','legatura','pagina 2','pagina','urmatoarea pagina'];
function textBun(text){
  const t=norm(text).replace(/[.!:,;]+$/,'');
  if(!t)return false;
  if(/^(https?:|www\.)/.test(t))return false;
  return RAU.indexOf(t)<0;
}
function duce(S,U2,spec,laSpec){
  const f=U2.fisierElev(S,laSpec);if(!f)return false;
  const d=(laSpec&&laSpec.dosar)||'Documente';
  return legaturi(S,U2,spec).some(l=>l.exista&&l.cale===d+'/'+f.n&&textBun(l.text));
}
function sigur(src,opt){
  opt=opt||{};
  return EV.curat(src,{tipuri:Object.keys(EV.TIPURI),nume:opt.nume||[],texte:opt.texte||[],fisiere:false});
}
const escA=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function randare(cod,inaltime,eticheta,imagini){
  let c=String(cod);
  Object.entries(imagini||{}).forEach(([n,uri])=>{c=c.replace(new RegExp('(<img\\b[^>]*?\\bsrc\\s*=\\s*")\\s*'+escA(n)+'\\s*"','gi'),'$1'+uri+'"')});
  return EWS.randare(c,inaltime,eticheta);
}
window.EditorWebProiect={CERINTE,corp,paragrafe,sursa,sursaBuna,listaSauTabel,formatari,seCiteste,legaturi,duce,textBun,sigur,randare,tinta};
})();
