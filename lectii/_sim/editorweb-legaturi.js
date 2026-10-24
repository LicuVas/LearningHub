/* editorweb-legaturi.js — extensie pentru simulatorul editorweb.js (proprietar editorweb: lecția VIII/14) și pentru
   editorweb-schelet.js (proprietar: lecția VIII/15). Proprietarul ACESTEI extensii: lecția VIII/18 („Legături (link-uri)
   între pagini și către resurse externe”, 24.10.2026). Se încarcă DUPĂ editorweb.js și editorweb-schelet.js. NU le schimbă.
   Nu are nevoie de -continut / -tabele (nu le atinge; încărcată împreună cu -continut, cele două rescriu amândouă srcdoc:
   neprobat, deci nerecomandat).

   Faptele (lectii/viii/m3-l18/_proba/proba_browser_l18_*_full.json, proba_inapoi_l18.json, proba_vizitat_l18.json —
   Chromium 148 întreg, headless, motorul lui Edge și Chrome, fișiere scrise ca de Notepad, rețeaua blocată):
   - clic pe <a href="pagina2.html"> → pagina2.html din ACELAȘI folder, în ACEEAȘI filă; ← (Înapoi) → pagina de dinainte,
     CITITĂ DIN NOU de pe disc (o schimbare salvată între timp se vede); cu target="_blank" → o filă NOUĂ, cea veche rămâne;
   - numele cu alte litere mari/mici merge (Windows); spațiile de la capetele lui href nu contează; href fără ghilimele merge;
   - fișier lipsă / fără .html / cu un folder în față („Documente/pagina2.html”, „Documente\pagina2.html”) / din alt folder /
     o adresă de site fără https:// (și „https//…”, fără două puncte) → pagina de eroare a lui Chrome: „Fișierul nu a putut fi
     accesat” · „Este posibil să fi fost mutat, editat sau șters.” · ERR_FILE_NOT_FOUND (engleză: „Your file couldn’t be
     accessed”); titlul filei = adresa file:///…. Edge 155 are alt titlu, de obicei „Hmm… nu se poate accesa această pagină”
     (citit din Locales\ro.pak, ecranul nevăzut — spus prudent, „de obicei”, de la reparația 2; simulatorul arată varianta
     Chrome și spune asta în notă);
     F5 pe pagina de eroare, după ce fișierul apare → pagina; ← de pe ea → pagina de dinainte;
   - legătura nevizitată: albastră (#0000EE), subliniată, mâna pe ea; după ce ai deschis-o: mov (#551A8B);
   - fără </a>: textul care urmează devine și el legătură; ghilimeaua de după adresă lipsă: legătura și tot ce urmează dispar;
     href scris greșit (hre, src): text negru, nesubliniat, nu e legătură; <a href="…"></a>: nu se vede nimic;
     două <a> pe rânduri separate în Notepad → în browser, pe același rând.

   Ce adaugă:
   1. BROWSERUL SIMULAT URMEAZĂ LEGĂTURILE (mod 'notepad' și mod 'live' ale editorweb.js), la clic sau atingere pe
      pagina desenată, și cu tastatura (Tab până la legătură, Enter). Pagina desenată rămâne fără scripturi: iframe-ul primește
      sandbox="allow-same-origin" (FĂRĂ allow-scripts; CSP default-src 'none' rămâne), ca extensia să afle ce legătură e sub
      deget (elementFromPoint), sub stratul .br-strat al editorweb.js. La trecerea mouse-ului, adresa legăturii apare în
      colțul din stânga jos (ca în Chrome / Edge). Butonul ← al browserului devine activ când fila are unde să se întoarcă.
      Abateri (spuse pe ecran): o legătură spre Internet deschide o filă care spune că simulatorul n-are Internet;
      căile absolute (C:\…, file:///, /…) și mailto: nu se urmează (lecția nu le predă).
      Mod notepad: navigarea schimbă S.br (fila: cale, continut; în plus `ist` = istoria pentru ←, `extern` pentru Internet,
      `nume` pentru target) și redesenează prin butonul ferestrei „Browser” (data-fer) al editorweb.js.
      Mod live: fila 1 = pagina din editor (se întoarce singură la ea când scrii); legăturile deschid pagini din
      `start.fisiere` (dosarul Documente, ca la editorweb), în aceeași filă sau într-o filă nouă (_blank).
      Jurnalul: S.jurnal primește {a:'legatura', de, la, ok, blank, extern} și {a:'inapoi', la}.
   2. window.EditorWebLegaturi — verificări pentru teste `fn:(S,U)=>…`:
        legaturi(src) → [{href, text, target, blank}] · tinta(de, href) → {tip:'local', cale} | {tip:'extern', url} |
        {tip:'fara'} | {tip:'altceva'} (de = calea paginii, „Documente/x.html”) · paginaDe(S,U,spec) → calea paginii citite ·
        exista(S, cale) · duce(S,U,spec,{la, extern, text, textBun, blank}) → o legătură din pagină face asta (extern =
        o adresă, true sau o LISTĂ de adrese ale aceleiași pagini — 24.10) · eticheteA(src) → etichetele <a …> citite ca de
        browser (atribute, „>” lipsă, ghilimea deschisă — 24.10) · inCorp(src) → toate legăturile sunt în <body> (24.10) ·
        toateMerg(S,U,spec) → nicio legătură stricată · urmata(S,{la, de, ok, blank, extern}) → elevul a urmat-o în browser ·
        textBun(text) → textul spune unde duce (nu „aici”, „click”, „pagina 2”, nu o adresă) · perechiA(src) ·
        mesajText(src, ctx) → greșeala de legătură, cu ce se vede · cuDiagnostic(teste,{spec, coleg}) — ca la
        EditorWebSchelet: întâi starea (nesalvat, ora de la F5, fila colegului), apoi legăturile, apoi greșelile schelet-ului.
        randare(cod, inaltime) · mini({fisiere:{nume:cod}, start, inaltime, nota}) → un browser mic pentru „Uite cum”, în care
        legăturile se pot urma (aceleași reguli).
   Ce nu are voie să schimbe nimeni: numele funcțiilor de mai sus, forma jurnalului, clasele leg-*. */
(function(){
'use strict';
const U=window.EditorWebUtil,ES=window.EditorWebSchelet;
if(!U||!window.EditorWeb){console.error('editorweb-legaturi.js: se încarcă după editorweb.js');return}
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const parse=s=>new DOMParser().parseFromString(String(s||''),'text/html');
const txt=el=>String(el&&el.textContent||'').replace(/\s+/g,' ').trim();
const ext=n=>{const i=String(n).lastIndexOf('.');return i>0?String(n).slice(i+1).toLowerCase():''};
const eHtml=n=>['html','htm'].includes(ext(n));
const UTIL='Elev',CALE_D={Desktop:'Desktop',Documente:'Documents','Descărcări':'Downloads'},DOSARE=Object.keys(CALE_D);
const desp=c=>{const i=String(c).indexOf('/');return i<0?[c,'']:[c.slice(0,i),c.slice(i+1)]};
const caleBara=c=>{const [d,n]=desp(c);return `C:/Users/${UTIL}/${CALE_D[d]||d}/${n}`};
const caleFile=c=>'file:///'+caleBara(c);
const gazda=u=>{const m=String(u).match(/^[a-z]+:\/\/([^\/?#]+)/i);return m?m[1]:String(u)};
const tactil=()=>window.matchMedia&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:760px)').matches);
const cod=t=>`<code>&lt;${t}&gt;</code>`;

/* ---------- 1. citirea legăturilor ---------- */
function legaturi(src){
  return [...parse(lin(src)).querySelectorAll('a')].map(a=>{const tg=a.getAttribute('target');
    return {href:a.hasAttribute('href')?a.getAttribute('href'):null,text:txt(a),target:tg,blank:!!tg&&tg.trim().toLowerCase()==='_blank'}});
}
/* unde duce href, din pagina `de` („Documente/x.html”), după regulile adreselor (URL): spațiile de la capete și Tab-urile /
   rândurile noi dinăuntru nu contează; \ = /; ?… și #… nu schimbă fișierul; %20 = spațiu; .. = folderul de deasupra */
function tinta(de,href){
  if(href==null)return {tip:'fara'};
  let h=String(href).replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,'').replace(/[\t\n\r]/g,'');
  if(/^https?:/i.test(h))return {tip:'extern',url:h.replace(/^(https?:)\/*/i,'$1//')};
  if(/^[a-z]:[\\\/]/i.test(h)||/^[\\\/]/.test(h))return {tip:'altceva',url:h};
  if(/^[a-z][a-z0-9+.\-]*:/i.test(h))return {tip:'altceva',url:h};
  if(h===''||/^[?#]/.test(h))return {tip:'local',cale:de};
  h=h.replace(/\\/g,'/').split(/[?#]/)[0];
  const parti=[desp(de)[0]];
  for(const p of h.split('/')){let x=p;try{x=decodeURIComponent(p)}catch(e){}if(x===''||x==='.')continue;if(x==='..'){parti.pop();continue}parti.push(x)}
  return {tip:'local',cale:parti.join('/')};
}
const exista=(S,cale)=>desp(cale)[1].indexOf('/')<0&&U.citeste(S,cale)!=null;
/* pagina citită de un test: în modul live = fișierul din editor (în Documente); altfel fișierul elevului (spec) */
function paginaDe(S,U2,spec){
  if(S.mod==='live')return 'Documente/'+S.live.fisier;
  if(spec&&spec.browser){const t=U.tabBrowser(S,spec.browser===true?null:spec.browser);return t?t.cale:null}
  if(spec){const f=U.fisierElev(S,spec);return f?(spec.dosar||'Documente')+'/'+f.n:null}
  const f=S.np.file[S.np.activa];return f&&f.n?f.dosar+'/'+f.n:null;
}
/* există fișierul `cale` pentru pagina citită? (în modul live, și fișierul din editor) */
function existaPt(S,cale){if(S.mod==='live'&&norm(cale)===norm('Documente/'+S.live.fisier))return true;return exista(S,cale)}
const NUL=new Set('frumos frumoasa frumoase fain super tare wow uau ceva nimic chestie chestii text textul nou noua buna bun ok aici acolo click clic apasa apas apasati apasa-ma da dati link linkul legatura legatura legaturii pagina pagini paginii site site-ul siteul web here click-aici asta acesta aceasta mai mult multe vezi vedeti deschide deschideti intra intrati du-ma du ma inapoi urmatoare urmatorul next back go to the la spre pe de in si sau o un 1 2 3 4 5 6 7 8 9 0 nr numarul www http https'.split(' '));
/* textul legăturii spune unde duce: cel puțin un cuvânt care nu e „aici”, „click”, „pagina”, un număr…; nu e o adresă.
   Reparația 2 (judecata 2, R, 24.10.2026): „html” nu mai e cuvânt gol — „HTML” e numele articolului de la Î3 (spune unde
   ajungi); numele de fișier „….html” le prinde regula de mai jos (\.html?\b). */
function textBun(t){
  const s=norm(t);if(!s)return false;
  if(/https?:|www\.|\.html?\b|\.ro\b|\.com\b|\.org\b/.test(s))return false;
  return s.split(/[\s.,;:!?„”"'()«»\-–]+/).filter(Boolean).some(w=>!NUL.has(w)&&!/^\d+$/.test(w)&&w.length>1);
}
const urlNorm=u=>String(u||'').trim().replace(/\/+$/,'').toLowerCase();
/* adresa u e una dintre cele cerute (o = true | o adresă | o listă de adrese ale ACELEIAȘI pagini, probate) */
const exOk=(u,o)=>o===true||[].concat(o).some(x=>urlNorm(u)===urlNorm(x));
/* o legătură din pagină: la = numele fișierului țintă (există în același folder); extern = adresa (sau true); text; textBun; blank */
function duce(S,U2,spec,o){
  o=o||{};
  const src=ES?ES.src(S,U,spec):(S.live&&S.live.text);if(!src)return false;
  const de=paginaDe(S,U,spec);if(!de)return false;
  return legaturi(src).some(l=>{
    const r=tinta(de,l.href);
    if(o.la!=null){if(r.tip!=='local'||norm(desp(r.cale)[1])!==norm(o.la)||norm(desp(r.cale)[0])!==norm(desp(de)[0])||!existaPt(S,r.cale))return false}
    if(o.extern!=null){if(r.tip!=='extern')return false;if(!exOk(r.url,o.extern))return false}
    if(o.text!=null&&norm(l.text)!==norm(o.text))return false;
    if(o.textBun&&!textBun(l.text))return false;
    if(o.blank!=null&&l.blank!==!!o.blank)return false;
    return true;
  });
}
/* nicio legătură stricată: fiecare locală duce la un fișier care există, fiecare externă are https:// */
function toateMerg(S,U2,spec){
  const src=ES?ES.src(S,U,spec):(S.live&&S.live.text);if(!src)return false;
  const de=paginaDe(S,U,spec);if(!de)return false;
  return legaturi(src).every(l=>{const r=tinta(de,l.href);return r.tip==='extern'||(r.tip==='local'&&existaPt(S,r.cale))});
}
/* elevul a urmat în browser o legătură: la / de = numele fișierelor (fără folder), ok, blank, extern */
function urmata(S,o){
  o=o||{};
  return (S.jurnal||[]).some(j=>j.a==='legatura'&&(o.la==null||norm(desp(j.la||'')[1])===norm(o.la))&&(o.de==null||norm(desp(j.de||'')[1])===norm(o.de))&&
    (o.ok==null||j.ok===o.ok)&&(o.blank==null||j.blank===o.blank)&&(o.extern==null||(o.extern===true?!!j.extern:(!!j.extern&&exOk(j.extern,o.extern)))));
}
function perechiA(src){const s=lin(src).replace(/<!--[\s\S]*?-->/g,'');return {deschise:(s.match(/<a(?=[\s>\/])[^>]*>/gi)||[]).length,inchise:(s.match(/<\/a\s*>/gi)||[]).length}}

/* ---------- 2. mesajul greșelii făcute (cu ce se vede în browser — probat: _proba/proba_coduri_l18.json, „greseli”) ----------
   Reparația după judecata 1 (24.10.2026): etichetele <a …> se citesc întâi ca de browser (eticheteA), ca mesajul să numească
   greșeala ADEVĂRATĂ: ghilimele strâmbe, ghilimeaua lipsă (la sfârșit / la început), „>” lipsă, <a> scris în loc de </a>,
   „=” lipsă după href, href scris greșit; apoi </a fără >, perechile, legătura în <head>, textul gol, fișierul, adresa de
   Internet fără „https://” (și „https//”, fără două puncte), target scris greșit. */
const dist=(a,b)=>{a=norm(a);b=norm(b);const d=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){let p=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t}}return d[b.length]};
const DOMENIU=/^(www\.)?[a-z0-9\-]+(\.[a-z0-9\-]+)*\.(ro|com|org|net|eu|info|edu|md|gov)(\/|$)/i;
const STRAMBE=/[„”“‟«»]/;
/* etichetele <a …> citite pe scurt ca de tokenizatorul HTML: atributele {nume, val, q (ghilimeaua)}, inch = s-a închis cu „>”
   înainte de următorul „<”, ghil = o ghilimea a rămas deschisă (valoarea ar trece peste „<”, „>” sau rândul nou) */
function eticheteA(src){
  const s=lin(src).replace(/<!--[\s\S]*?-->/g,''),r=[],re=/<a(?=[\s>\/])/gi;let m;
  while((m=re.exec(s))){
    const n=s.length,at=[];let i=m.index+2,inch=false,ghil=false;
    while(i<n){
      while(i<n&&/[\s\/]/.test(s[i]))i++;
      if(i>=n||s[i]==='<')break;
      if(s[i]==='>'){inch=true;break}
      let j=i;while(j<n&&!/[\s\/>=<]/.test(s[j]))j++;
      if(j===i)j++;
      const nume=s.slice(i,j).toLowerCase();i=j;
      let k=i;while(k<n&&/[ \t\r\n]/.test(s[k]))k++;
      let val=null,q='';
      if(s[k]==='='){i=k+1;while(i<n&&/[ \t\r\n]/.test(s[i]))i++;
        if(s[i]==='"'||s[i]==="'"){q=s[i];const e=s.indexOf(q,i+1),v=e<0?s.slice(i+1):s.slice(i+1,e);
          if(e<0||/[<>\n]/.test(v)){ghil=true;at.push({nume,val:v.split(/[<>\n]/)[0],q});break}
          val=v;i=e+1}
        else{let e=i;while(e<n&&!/[\s>]/.test(s[e]))e++;val=s.slice(i,e);i=e}}
      at.push({nume,val,q});
    }
    r.push({start:m.index,at,inch,ghil});
  }
  return r;
}
/* toate legăturile stau în corpul paginii (între <body> și </body>) */
function inCorp(src){
  const s=lin(src).replace(/<!--[\s\S]*?-->/g,''),b=s.search(/<body(?=[\s>])/i),e=s.search(/<\/body\s*>/i);
  return eticheteA(s).every(t=>(b<0||t.start>b)&&(e<0||t.start<e));
}
/* ctx: {S, de} — ca să știe ce fișiere sunt în folderul paginii */
function mesajText(src,ctx){
  const s=lin(src).replace(/<!--[\s\S]*?-->/g,''),S=ctx&&ctx.S,de=ctx&&ctx.de;
  /* <ahref=…>: fără spațiu, browserul vede o etichetă necunoscută, nu o legătură (probat: textul negru, nesubliniat) */
  const lipit=s.match(/<a(href|target)/i);
  if(lipit)return `Între <code>a</code> și <code>${esc(lipit[1].toLowerCase())}</code> lași un spațiu: ${cod('a href="…"')}. Lipite, browserul nu mai vede eticheta ${cod('a')}: textul nu e legătură, e negru și nesubliniat.`;
  const T=eticheteA(s);
  for(let ti=0;ti<T.length;ti++){
    const t=T[ti],A=t.at,are=n=>A.find(x=>x.nume===n);
    const str=A.find(x=>STRAMBE.test(x.nume)||STRAMBE.test(x.val||''));
    /* reparația 2 (judecata 2, T): ghilimelele strâmbe stau DOAR la alt atribut (target), adresa e bună → mesajul numește atributul */
    if(str&&!/^href/i.test(str.nume.replace(/[„”“‟«»"=]/g,''))){const h0=are('href');
      if(!t.ghil&&h0&&h0.val!=null&&!STRAMBE.test(h0.val)){const nm=str.nume.replace(/[„”“‟«»"=]/g,''),v0=String(str.val||'').replace(/[„”“‟«»"]/g,'');
        return `Adresa e bună. Ghilimelele „strâmbe” sunt la <code>${esc(nm)}</code>, ca în scrisul de mână. În cod se scriu ghilimele drepte, la fel la început și la sfârșit: <code>${esc(nm)}="${esc(v0||'_blank')}"</code>.`}}
    if(str){const h=are('href'),v=String(h&&h.val!=null?h.val:(str.val||str.nume)).replace(/[„”“‟«»"=]/g,'').replace(/^href/i,'');
      const loc=h&&STRAMBE.test(h.val||'')&&!t.ghil&&!/^\W*https?:/i.test(h.val||'');
      return `Ghilimelele din eticheta ${cod('a …')} sunt „strâmbe”, ca în scrisul de mână. În cod se scriu ghilimele drepte, la fel la început și la sfârșit: <code>href="${esc(v)}"</code>. ${t.ghil?'Așa, browserul nu găsește sfârșitul adresei: textul legăturii nu se mai vede.':`Pe cele strâmbe browserul le ia drept litere din adresă${loc?' și arată pagina de eroare (ERR_FILE_NOT_FOUND)':''}.`}`}
    if(t.ghil){const x=A[A.length-1]||{nume:'href',val:''},tg=x.nume==='target';
      return `În eticheta ${cod('a …')} lipsește ghilimeaua de la sfârșitul ${tg?'valorii':'adresei'}: ${tg?'<code>target="_blank"</code>':`<code>href="${esc(x.val||'pagina2.html')}"</code>`}. Fără ea, browserul ia tot ce urmează, până la următoarea ghilimea, drept parte din etichetă: textul legăturii nu se mai vede.`}
    const fq=A.find(x=>!x.q&&x.val&&/["']/.test(x.val));
    if(fq){const v=fq.val.replace(/["']/g,''),loc=fq.nume==='href'&&!/^https?:/i.test(v);
      return `După <code>${esc(fq.nume)}=</code> lipsește prima ghilimea: valoarea stă între două ghilimele, <code>${esc(fq.nume)}="${esc(v)}"</code>. Fără ea, browserul ia ghilimeaua de la sfârșit drept literă din ${fq.nume==='href'?'adresă':'valoare'}${loc?' și arată pagina de eroare (ERR_FILE_NOT_FOUND)':''}.`}
    /* reparația 2 (judecata 2, U): href="https://www.retezat.ro target="_blank"> — ghilimeaua de după adresă lipsește, iar
       ghilimeaua lui target închide adresa: valoarea lui href se termină cu „ target=” (probat în Chromium: legătura se vede,
       target nu e citit, deci se deschide în aceeași filă) */
    const hU=are('href');
    if(hU&&hU.q&&hU.val!=null&&/\s+([a-z][a-z\-]*)\s*=\s*$/i.test(hU.val)){const nm=hU.val.match(/\s+([a-z][a-z\-]*)\s*=\s*$/i)[1].toLowerCase(),adr=hU.val.replace(/\s+[a-z][a-z\-]*\s*=\s*$/i,'').trim();
      return `După adresă lipsește ghilimeaua de închidere, chiar înainte de <code>${esc(nm)}</code>: <code>href="${esc(adr)}" ${esc(nm)}="…"</code>. Fără ea, browserul ia și „ ${esc(nm)}=” drept parte din adresă, iar <code>${esc(nm)}</code> nu mai e citit${nm==='target'?': legătura se deschide în aceeași filă':''}.`}
    /* reparația 2 (judecata 2, V): „>” lipsă — forma arătată păstrează TOATE atributele scrise de copil (href și target) */
    if(!t.inch){const h=are('href'),bune=A.filter(x=>x.val!=null&&(x.nume==='href'||x.nume==='target')),ult=bune[bune.length-1];
      const forma=`<code>&lt;a${bune.map(x=>` ${esc(x.nume)}="${esc(x.val)}"`).join('')}&gt;</code>`;
      return `${h&&h.val!=null?`${ult&&ult.nume==='target'?'După <code>target="…"</code>':'După adresă'}, eticheta se închide cu <code>&gt;</code>: ${forma}, apoi textul legăturii.`:`Eticheta ${cod('a …')} se închide cu <code>&gt;</code>, înainte de textul legăturii.`} Fără <code>&gt;</code>, browserul ia textul drept parte din etichetă: textul nu se vede, iar ce scrii după legătură poate deveni și el legătură.`}
    if(!are('href')){
      const ant=T.slice(0,ti).filter(x=>x.at.some(y=>y.nume==='href')).pop();
      const deschisa=!!ant&&!/<\/a\s*>/i.test(s.slice(ant.start,t.start));
      if(!A.length&&deschisa)return `Legătura se închide cu ${cod('/a')}, cu bara <code>/</code> în față, ca ${cod('/p')}. Ai scris ${cod('a')}, fără bară: pentru browser, acela e începutul unei legături noi, fără adresă.`;
      if(A.some(x=>x.nume.startsWith('href')))return `După <code>href</code> vine semnul <code>=</code>, apoi adresa între ghilimele, de exemplu <code>href="bucura.html"</code>. Fără <code>=</code>, browserul nu găsește adresa: textul nu e legătură, e negru și nesubliniat.`;
      const g=A.find(x=>x.nume!=='target'&&(x.nume==='src'||dist(x.nume,'href')<=2));
      if(!A.length||!g)return `În eticheta ${cod('a')} lipsește atributul <code>href</code>, cu adresa: ${cod('a href="…"')}. Fără <code>href</code>, textul nu e legătură: în pagină e negru și nesubliniat.`;
      return `Adresa legăturii se scrie în <code>href</code>, nu în <code>${esc(g.nume)}</code>: h, r, e, f. Fără <code>href</code>, textul nu e legătură: în pagină e negru și nesubliniat.`;
    }
    if(are('href').val==null)return `După <code>href</code> vine semnul <code>=</code>, apoi adresa între ghilimele, de exemplu <code>href="bucura.html"</code>. Fără <code>=</code>, adresa e goală: legătura duce înapoi la pagina în care ești.`;
  }
  if(/<\/a\b(?!\s*>)/i.test(s))return `După <code>&lt;/a</code> trebuie semnul <code>&gt;</code>, care închide eticheta. Fără el, browserul nu vede sfârșitul legăturii: ce scrii după ea devine și el legătură.`;
  const p=perechiA(s);
  /* reparația 2 (judecata 2, S): legătura e adesea ULTIMA din pagină — după ea nu se vede nimic albastru; mesajul spune ce se
     întâmplă cu ce SCRII după ea */
  if(p.deschise>p.inchise)return `Lipsește ${cod('/a')} după textul legăturii. Fără el, tot ce scrii după legătură devine și el legătură (albastru, subliniat). Închide fiecare legătură cu ${cod('/a')}.`;
  if(p.inchise>p.deschise)return `Un ${cod('/a')} n-are ${cod('a href=…')} înaintea lui. Verifică perechea pe fiecare rând.`;
  /* reparația 2 (judecata 2, W): perechea <p> … </p> din jurul legăturii (testul „scheletul a rămas întreg” cade, prin
     EditorWebUtil.corecteaza) — mesajul o numește. Chromium (probat, _proba/proba_coduri_l18.json, „greseli”): pagina arată la
     fel, browserul închide singur paragraful / reface ordinea */
  if(/<a(?=[\s>\/])[^>]*>[^<]*<\/p\s*>\s*<\/a\s*>/i.test(s))return `Etichetele se închid în ordinea inversă celei în care le-ai deschis: întâi ${cod('/a')}, apoi ${cod('/p')}, ca în <code>…&lt;/a&gt;&lt;/p&gt;</code>. Legătura stă în paragraf, deci se închide înaintea lui. Browserul repară singur ordinea și pagina arată la fel, dar codul se scrie corect.`;
  const pd=(s.match(/<p(?=[\s>\/])[^>]*>/gi)||[]).length,pi=(s.match(/<\/p\s*>/gi)||[]).length;
  if(pd>pi)return `Lipsește ${cod('/p')} la sfârșitul paragrafului: <code>&lt;p&gt;&lt;a href="…"&gt;…&lt;/a&gt;&lt;/p&gt;</code>. Fiecare ${cod('p')} are perechea lui, ${cod('/p')}. Browserul închide singur paragraful și pagina arată la fel, dar codul se scrie întreg.`;
  if(pi>pd)return `Un ${cod('/p')} n-are ${cod('p')} înaintea lui. Verifică perechea pe fiecare rând: <code>&lt;p&gt;&lt;a href="…"&gt;…&lt;/a&gt;&lt;/p&gt;</code>.`;
  const b=s.search(/<body(?=[\s>])/i),e=s.search(/<\/body\s*>/i);
  if(T.some(t=>b>=0&&t.start<b))return `Legătura e scrisă în ${cod('head')}, înainte de ${cod('body')}. În ${cod('head')} stau doar rândul meta și titlul (lecția 15); tot ce se vede în pagină se scrie între ${cod('body')} și ${cod('/body')}. Browserul o arată oricum, dar scheletul nu mai e cel bun: mut-o în corpul paginii.`;
  if(T.some(t=>e>=0&&t.start>e))return `Legătura e după ${cod('/body')}. Tot ce se vede în pagină se scrie între ${cod('body')} și ${cod('/body')}: mut-o înainte de ${cod('/body')}.`;
  const L=legaturi(s);
  if(L.some(l=>!norm(l.text)))return `O legătură n-are text între ${cod('a href=…')} și ${cod('/a')}: în pagină nu se vede nimic pe care să apeși.`;
  if(de){
    for(const l of L){
      const h=String(l.href).trim(),r=tinta(de,l.href);
      if(r.tip!=='local')continue;
      if(S&&existaPt(S,r.cale))continue;
      /* „https//www…”, „http//…”, „https;//…”: browserul o ia drept nume de fișier (probat: pagina de eroare) */
      const mI=h.match(/^(ht+ps?|htps?)\s*([:;.]?)\s*([\/\\]*)\s*(.*)$/i);
      if(mI&&(mI[3]||/^www\./i.test(mI[4])||DOMENIU.test(mI[4])))return `O adresă de pe Internet începe exact cu <code>https://</code>: https, două puncte (:), apoi două bare (//). Scrie <code>href="https://${esc(mI[4].replace(/^[\/\\]+/,''))}"</code>. Altfel, browserul caută pe calculator un fișier cu numele acesta și arată pagina de eroare (ERR_FILE_NOT_FOUND).`;
      if(DOMENIU.test(h)&&!eHtml(h))return `O adresă de pe Internet începe cu <code>https://</code>: <code>href="https://${esc(h)}"</code>. Fără el, browserul caută pe calculator un fișier cu numele acesta și arată pagina de eroare (ERR_FILE_NOT_FOUND).`;
      const dosar=desp(de)[0],nume=desp(r.cale).slice(1).join('/').split('/').pop();
      if(!S)continue;
      if(/[\\\/]/.test(h)&&existaPt(S,dosar+'/'+nume))return `Scrie în <code>href</code> doar numele fișierului, fără dosar: <code>href="${esc(nume)}"</code>. Paginile stau în același dosar, ${esc(dosar)}.`;
      if(!ext(nume)&&existaPt(S,dosar+'/'+nume+'.html'))return `În <code>href</code> lipsește <b>.html</b>: <code>href="${esc(nume)}.html"</code>. În Explorer nu vezi .html, dar numele fișierului îl are.`;
      const alt=DOSARE.find(d=>d!==dosar&&exista(S,d+'/'+nume));
      if(alt)return `Fișierul <b>${esc(nume)}</b> e în ${esc(alt)}, iar pagina ta în ${esc(dosar)}. O legătură cu doar numele caută în dosarul paginii: browserul arată pagina de eroare (ERR_FILE_NOT_FOUND). Salvează paginile în același dosar.`;
      const lst=(S.fisiere[dosar]||[]).map(f=>f.n).concat(S.mod==='live'?[S.live.fisier]:[]).filter(eHtml);
      const ap=lst.map(n=>[n,dist(n,nume)]).sort((a,b)=>a[1]-b[1])[0];
      if(ap&&ap[1]<=3)return `În ${esc(dosar)} nu e niciun fișier <b>${esc(nume)}</b>, deci browserul arată pagina de eroare (ERR_FILE_NOT_FOUND). Seamănă cu <b>${esc(ap[0])}</b>: verifică numele din <code>href</code>, literă cu literă.`;
      return `În ${esc(dosar)} nu e niciun fișier <b>${esc(nume)}</b>: browserul arată pagina de eroare (ERR_FILE_NOT_FOUND). Scrie în <code>href</code> numele exact al paginii, cu .html.`;
    }
  }
  /* target scris greșit: numele atributului sau valoarea fără liniuța jos */
  for(const t of T)for(const x of t.at){
    if(x.nume!=='target'&&x.nume!=='href'&&x.nume.length>=4&&dist(x.nume,'target')<=2)return `Atributul pentru filă nouă se scrie <code>target</code>: t, a, r, g, e, t. Ai scris <code>${esc(x.nume)}</code>, pe care browserul nu-l cunoaște: legătura se deschide în aceeași filă.`;
    if(x.nume==='target'&&x.val!=null&&!/^_(blank|self|top|parent)$/i.test(x.val.trim())&&/bl?a?n?k|_b/i.test(x.val))return `Valoarea lui <code>target</code> se scrie cu liniuță jos în față, lipită: <code>target="_blank"</code>. Tu ai scris <code>target="${esc(x.val)}"</code>.`;
  }
  return '';
}
function diagnostic(S,U2,opt){
  opt=opt||{};
  const s=ES?ES.src(S,U,opt.spec):(S.live&&S.live.text);
  if(ES){const d=ES.diagnostic(S,U,opt);if(d&&(!s||d!==ES.mesajText(s)))return d}
  const m=s?mesajText(s,{S,de:paginaDe(S,U,opt.spec)}):'';
  if(m)return m;
  return ES&&s?ES.mesajText(s):'';
}
function cuDiagnostic(teste,opt){
  opt=opt||{};
  return (teste||[]).map(c=>{
    if(!c||c.neatins||c.faraDiagnostic)return c;
    let d='';
    const o={ce:c.ce,fn(S,U2){
      const ok=typeof c.fn==='function'?!!c.fn(S,U2):U2.test(S,c);
      if(ES&&(c.curat||c.faraOraData)){const sp=c.fisier||opt.spec,s=ES.src(S,U2,sp);if(s&&ES.oraData(s)){d=ES.mesajOraSalvata(S,U2,sp,s,opt);return false}}
      d=ok?'':(c.faraLegaturi?(c.msgTactil&&tactil()?c.msgTactil:c.msg)||'':diagnostic(S,U2,Object.assign({},opt,c.spec?{spec:c.spec}:{})));return ok}};
    Object.defineProperty(o,'msg',{enumerable:true,get(){return d||(c.msgTactil&&tactil()?c.msgTactil:c.msg)||''}});
    return o;
  });
}

/* ---------- 3. paginile pe care le arată browserul simulat ---------- */
const M_ERR='<!--lh-legaturi:eroare-->',M_EXT='<!--lh-legaturi:extern-->';
const ICON='<div aria-hidden="true" style="width:28px;height:36px;border:3px solid #5f6368;border-radius:2px;position:relative;margin-bottom:34px"><div style="position:absolute;left:7px;top:12px;width:4px;height:4px;background:#5f6368"></div><div style="position:absolute;right:7px;top:12px;width:4px;height:4px;background:#5f6368"></div><div style="position:absolute;left:7px;right:7px;top:22px;height:3px;background:#5f6368"></div></div>';
function docEroare(cale){
  return M_ERR+`<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>${esc(caleFile(cale))}</title></head><body style="font-family:'Segoe UI',Arial,sans-serif;color:#202124;margin:0;padding:40px 36px;background:#fff">${ICON}<h1 style="font-size:20px;font-weight:500;margin:0 0 14px">Fișierul nu a putut fi accesat</h1><p style="font-size:14px;color:#5f6368;margin:0 0 14px">Este posibil să fi fost mutat, editat sau șters.</p><p style="font-size:12px;color:#5f6368;margin:0">ERR_FILE_NOT_FOUND</p></body></html>`;
}
function docExtern(url){
  return M_EXT+`<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>${esc(gazda(url))}</title></head><body style="font-family:'Segoe UI',Arial,sans-serif;color:#202124;margin:0;padding:24px 20px;background:#f6f7f9"><p style="font-size:15px;margin:0 0 8px">Aici se deschide site-ul de la adresa</p><p style="font-size:14px;margin:0 0 12px;word-break:break-all"><b>${esc(url)}</b></p><p style="font-size:13px;color:#5f6368;margin:0">Simulatorul din pagină nu are Internet, deci nu-l încarcă. La calculatorul din laborator, cu Internet, aici apare chiar site-ul.</p></body></html>`;
}
const eEroare=t=>typeof t==='string'&&t.startsWith(M_ERR);
/* nota de sub pagina de eroare: simulatorul arată varianta din Chrome; Edge 155 are alt titlu (citit din Locales\ro.pak) */
/* reparația 2 (judecata 2, Z): titlul din Edge e citit doar din ro.pak (ecranul nevăzut) → spus prudent, „de obicei” */
const NOTA_ERR='Pagina de eroare, așa cum o arată Chrome în română (în engleză: „Your file couldn’t be accessed”). În Edge titlul e altul (de obicei „Hmm… nu se poate accesa această pagină”); codul de jos, ERR_FILE_NOT_FOUND, e același.';
const eExtern=t=>typeof t==='string'&&t.startsWith(M_EXT);
/* pagina desenată: fără regula a{pointer-events:none} (ca stratul să afle legătura de sub deget) și cu legăturile deja
   vizitate în mov — :where() = nicio prioritate, deci orice culoare pusă de autor (lecția 19) câștigă, ca în browser */
function transforma(srcdoc,viz,de){
  let s=String(srcdoc).replace('a{pointer-events:none}','a{cursor:pointer}');
  if(!viz||!de||!Object.keys(viz).length||eEroare(srcdoc)||eExtern(srcdoc))return s;
  const doc=parse(s);let sch=false;
  doc.querySelectorAll('a[href]').forEach(a=>{const r=tinta(de,a.getAttribute('href'));const k=r.tip==='extern'?urlNorm(r.url):r.tip==='local'?norm(r.cale):null;if(k&&viz[k]){a.setAttribute('data-lh-viz','');sch=true}});
  if(!sch)return s;
  const st=doc.createElement('style');st.textContent=':where(a[data-lh-viz]){color:#551A8B}';
  const prim=doc.head.querySelector('style');if(prim)prim.after(st);else doc.head.prepend(st);
  return '<!doctype html>'+doc.documentElement.outerHTML;
}
const cheieViz=r=>r.extern?urlNorm(r.extern):norm(r.cale);

/* ---------- 4. comportamentul ---------- */
const STIL=`.leg-stare{position:absolute;left:0;bottom:0;z-index:3;max-width:92%;font:12px "Segoe UI",system-ui,sans-serif;background:#f1f3f4;color:#202124;border:1px solid #c7c7c7;border-left:0;border-bottom:0;border-radius:0 6px 0 0;padding:2px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
.leg-nota{font-size:12px;line-height:1.35;color:#3c4043;padding:5px 10px;background:#eef3fd;border-bottom:1px solid #d2dcf0}
.leg-bara{display:flex;align-items:center;gap:6px;padding:4px 8px;background:#fff;border-bottom:1px solid #e3e3e3;font:13px "Segoe UI",system-ui,sans-serif;color:#202124}
.leg-bara button{border:0;background:transparent;border-radius:50%;width:34px;height:34px;min-width:32px;font-size:17px;color:#202124;cursor:pointer}
.leg-bara button:disabled{color:#b8b8b8;cursor:default}
.leg-bara button:not(:disabled):hover{background:#eee}
.leg-bara .leg-adr{flex:1;min-width:0;border:1px solid #d6d6d6;border-radius:16px;padding:4px 12px;background:#f7f7f7;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.ew .br-file .leg-fila{display:flex;align-items:center;gap:4px;max-width:12em;min-width:5em;padding:4px 4px 4px 8px;border-radius:8px 8px 0 0;font-size:12.5px}
.ew .br-file .leg-fila.act,.leg-mini .br-file .br-fila.act{background:#fff}
.ew .br-file .leg-fila button,.ew .br-file .br-fila.leg-0{border:0;background:transparent;font:inherit;color:inherit;cursor:pointer}
.ew .br-file .leg-fila .fn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;min-width:32px;min-height:32px}
.ew .br-file .leg-fila .x{flex:none;width:32px;height:32px;min-width:32px}
.ew .br-file .br-fila.leg-0,.ew .br-file .leg-fila{min-height:32px}
.ew .br-file .br-fila.leg-0:not(.act),.leg-mini .br-file .br-fila:not(.act){background:transparent}
.leg-mini{border:1px solid var(--line,#ccd4e2);border-radius:8px;overflow:hidden;background:#fff;margin:.4em 0 .7em;color:#202124}
.leg-mini .leg-et{font-size:.78rem;color:var(--ink2,#4e5a6e);background:var(--paper2,#eef2f8);padding:3px 10px;border-bottom:1px solid var(--line,#ccd4e2)}
.leg-mini .br-file{display:flex;align-items:flex-end;gap:2px;background:#e8e8e8;padding:5px 6px 0;overflow-x:auto}
.leg-mini .br-fila{display:flex;align-items:center;gap:4px;max-width:12em;min-width:5em;padding:4px 6px 4px 10px;border:0;border-radius:8px 8px 0 0;font:12.5px "Segoe UI",system-ui,sans-serif;color:#202124;cursor:pointer;min-height:32px}
.leg-mini .br-fila .fn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.leg-mini .br-file .leg-fila{padding:2px 2px 2px 8px}
.leg-mini .leg-fila button{border:0;background:transparent;font:inherit;color:inherit;cursor:pointer;padding:0 4px}
.leg-mini .leg-fila .fn{flex:1;min-width:32px;min-height:32px;text-align:left}
.leg-mini .leg-fila .x{flex:none;width:32px;height:32px;min-width:32px;min-height:32px}
.leg-mini .br-corp{position:relative;background:#fff;min-height:0}
.leg-mini .br-corp iframe{display:block;width:100%;border:0;background:#fff}
.leg-mini .br-strat{position:absolute;inset:0;z-index:2}
.ewl-randare{margin:.4em 0 .7em;border:1px solid var(--line,#ccd4e2);border-radius:6px;overflow:hidden;background:#fff}
.ewl-randare .leg-et{font-size:.78rem;color:var(--ink2,#4e5a6e);background:var(--paper2,#eef2f8);padding:3px 10px;border-bottom:1px solid var(--line,#ccd4e2)}
.ewl-randare iframe{display:block;width:100%;border:0;background:#fff}`;
function css(){if(!document.getElementById('editorweb-legaturi-css')){const s=document.createElement('style');s.id='editorweb-legaturi-css';s.textContent=STIL;document.head.appendChild(s)}}
let NR=0;
const corpDe=sec=>sec.querySelector('.br-corp');

/* --- mod notepad: S.br --- */
function incarcaNp(S,loc){
  if(loc.extern)return {cale:'Internet/'+(++NR)+'.html',extern:loc.extern,continut:docExtern(loc.extern)};
  const c=exista(S,loc.cale)?U.citeste(S,loc.cale):null;
  return {cale:loc.cale,extern:null,continut:c!=null?c:docEroare(loc.cale)};
}
function redeseneaza(body,S){
  const b=body.querySelector('[data-fer="browser"]');
  if(b){b.click();return}
  const t=body.querySelector('[data-brfila]');if(t){t.dataset.brfila=String(S.br.activa);t.click()}
}
function mesajNav(S,r,dest,nou,de){
  const nume=desp(dest.cale)[1];
  if(dest.extern)return `Legătura duce pe Internet, la <b>${esc(dest.extern)}</b>${nou?', și s-a deschis într-o filă nouă (target="_blank"); fila paginii tale a rămas deschisă':''}. În simulator nu avem Internet: la calculator, cu Internet, apare chiar site-ul.`;
  if(eEroare(dest.continut))return `Browserul n-a găsit fișierul <b>${esc(nume)}</b> în ${esc(desp(dest.cale)[0])}: arată pagina de eroare (ERR_FILE_NOT_FOUND). Verifică numele din <code>href</code>, literă cu literă. Butonul ← te întoarce.`;
  return nou?`S-a deschis <b>${esc(nume)}</b> într-o filă nouă (target="_blank"). Fila paginii de dinainte a rămas deschisă: o vezi sus, în stânga.`:
    `Ai urmat legătura: în aceeași filă s-a deschis <b>${esc(nume)}</b>. Butonul ← (Înapoi) te întoarce la pagina de dinainte.`;
}
/* navigarea din fila activă (doar starea; desenul îl face cine cheamă) */
function navNp(S,href,target){
  const t=S.br.file[S.br.activa];if(!t||t.sursa)return false;
  const de=t.extern?null:t.cale;if(!de)return false;
  const r=tinta(de,href);
  if(r.tip==='altceva'){S.msg='Legăturile de felul acesta (cu o cale întreagă de pe calculator sau cu mailto:) nu le urmează simulatorul: în lecție scrii doar numele fișierului sau o adresă cu https://.';S.msgAv=true;return true}
  if(r.tip!=='local'&&r.tip!=='extern')return false;
  const dest=incarcaNp(S,r.tip==='extern'?{extern:r.url}:{cale:r.cale});
  const tg=String(target||'').trim(),nou=!!tg&&!/^_(self|top|parent)$/i.test(tg);
  S.jurnal.push({a:'legatura',t:++S.ts,de,la:dest.extern?null:dest.cale,extern:dest.extern||null,ok:!eEroare(dest.continut),blank:nou});
  if(!eEroare(dest.continut))(S._legViz||(S._legViz={}))[cheieViz(dest)]=1;
  if(nou){
    const k=tg.toLowerCase()!=='_blank'?S.br.file.findIndex(x=>x.nume===tg):-1;
    if(k>=0){const x=S.br.file[k];(x.ist||(x.ist=[])).push({cale:x.cale,extern:x.extern});Object.assign(x,dest);S.br.activa=k}
    else{S.br.file.push(Object.assign({id:900000+(++NR),sursa:false,ist:[],nume:tg},dest));S.br.activa=S.br.file.length-1}
  }else{(t.ist||(t.ist=[])).push({cale:t.cale,extern:t.extern||null});Object.assign(t,dest)}
  S.ctx=null;S.msg=mesajNav(S,r,dest,nou,de);S.msgAv=eEroare(dest.continut);S.activa='browser';S.dreapta='browser';
  return true;
}
function navInapoi(S){
  const t=S.br.file[S.br.activa];if(!t||!t.ist||!t.ist.length)return false;
  const p=t.ist.pop();Object.assign(t,incarcaNp(S,p.extern?{extern:p.extern}:{cale:p.cale}));
  S.jurnal.push({a:'inapoi',t:++S.ts,la:t.extern?null:t.cale});
  S.ctx=null;S.msg=`← Înapoi: browserul a citit din nou <b>${esc(t.extern?gazda(t.extern):desp(t.cale)[1])}</b>${t.extern?'':' de pe disc (o schimbare salvată între timp se vede)'}.`;S.msgAv=false;
  return true;
}
function urmeazaNp(body,S,href,target){if(navNp(S,href,target))redeseneaza(body,S)}
function inapoiNp(body,S){if(navInapoi(S))redeseneaza(body,S)}
/* acțiuni noi pentru `rezolvare` / `gresit` (aplica() din editorweb.js le găsește în EditorWebUtil.ACT):
   ['legatura', {text:'Lacul Bucura'} | {href:'x.html'}]  urmează legătura din pagina filei active a browserului;
   ['inapoi']  butonul ← al browserului. */
if(U.ACT){
  if(!U.ACT.legatura)U.ACT.legatura=(S,o)=>{o=o||{};const t=S.br&&S.br.file[S.br.activa];if(!t||t.sursa)return;
    const l=legaturi(t.continut).find(x=>o.text!=null?norm(x.text)===norm(o.text):x.href===o.href);if(l)navNp(S,l.href,l.target)};
  if(!U.ACT.inapoi)U.ACT.inapoi=S=>{navInapoi(S)};
}
function pregatesteNp(sec,body,S){
  const t=S.br.file[S.br.activa];
  /* butonul ← */
  const bar=sec.querySelector('.br-bara'),bi=bar&&bar.querySelector('button');
  if(bi){const poate=!!(t&&!t.sursa&&t.ist&&t.ist.length);
    if(poate){bi.disabled=false;bi.removeAttribute('aria-hidden');bi.tabIndex=0;bi.setAttribute('aria-label','Înapoi (Back)');bi.title='Înapoi (Back)';bi.onclick=()=>inapoiNp(body,S)}
    else{bi.disabled=true;bi.onclick=null}}
  if(bar&&!bar._leg){bar._leg=true;sec.addEventListener('keydown',e=>{if(e.altKey&&e.key==='ArrowLeft'){e.preventDefault();inapoiNp(body,S)}})}
  /* titlurile filelor spre Internet */
  S.br.file.forEach((x,i)=>{if(x.extern){const b=sec.querySelector(`[data-brfila="${i}"]`);if(b&&b.textContent!==gazda(x.extern)){b.textContent=gazda(x.extern);b.title=x.extern}}});
  if(!t||t.sursa)return;
  const corp=corpDe(sec);if(!corp)return;
  if(t.extern){const u=sec.querySelector('.br-adr .u'),ch=sec.querySelector('.br-adr .chip');if(u&&u.textContent!==t.extern)u.textContent=t.extern;if(ch&&ch.textContent!=='ⓘ')ch.textContent='ⓘ'}
  /* pagina de eroare pentru un nume fără .html: editorweb ar arăta-o ca text */
  if((eEroare(t.continut)||eExtern(t.continut))&&!corp.querySelector('iframe')){corp.innerHTML=`<iframe sandbox="" title="Pagina din browser"></iframe><div class="br-strat"></div>`;corp.querySelector('iframe').setAttribute('srcdoc',U.previewDoc(t.continut))}
  notaSub(sec,eEroare(t.continut)?NOTA_ERR:
    eExtern(t.continut)?'Fila unui site de pe Internet. În simulator nu avem Internet, deci site-ul nu se încarcă.':'');
  pregatesteIframe(corp,()=>S._legViz,()=>t.extern?null:t.cale,(href,tg)=>urmeazaNp(body,S,href,tg),()=>t.extern?null:t.cale);
}
function notaSub(sec,html){
  let n=sec.querySelector(':scope > .leg-nota');
  if(!html){if(n)n.remove();return}
  if(!n){n=document.createElement('div');n.className='leg-nota';n.setAttribute('role','note');sec.insertBefore(n,corpDe(sec))}
  if(n.innerHTML!==html)n.innerHTML=html;
}
/* iframe-ul paginii: same-origin fără scripturi, pagina transformată; stratul de deasupra prinde clicul, mâna și adresa */
function pregatesteIframe(corp,viz,deFn,urmeaza,baza){
  const fr=corp.querySelector('iframe');if(!fr)return;
  const sd=fr.getAttribute('srcdoc')||'';
  if(fr._legSet!==sd||fr.getAttribute('sandbox')!=='allow-same-origin'){
    const nou=transforma(sd,viz(),deFn());
    if(!fr._legLoad){fr._legLoad=true;fr.addEventListener('load',()=>{let d=null;try{d=fr.contentDocument}catch(e){}if(!d)return;
      const h=e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;e.preventDefault();e.stopPropagation();if(e.type==='click')fr._legUrm(a.getAttribute('href'),a.getAttribute('target'))};
      d.addEventListener('click',h,true);d.addEventListener('auxclick',h,true);potriveste(fr)})}
    fr.setAttribute('sandbox','allow-same-origin');fr._legSet=nou;if(sd!==nou)fr.setAttribute('srcdoc',nou);else{fr.srcdoc=nou}
  }
  fr._legUrm=urmeaza;
  const strat=corp.querySelector('.br-strat');
  if(strat&&!strat._leg){strat._leg=true;
    const sub=e=>{let d=null;try{d=fr.contentDocument}catch(x){}if(!d)return null;const r=fr.getBoundingClientRect();const el=d.elementFromPoint(e.clientX-r.left,e.clientY-r.top);return el&&el.closest?el.closest('a[href]'):null};
    strat.addEventListener('click',e=>{const a=sub(e);if(!a)return;e.preventDefault();e.stopPropagation();ascundeStare(corp);fr._legUrm(a.getAttribute('href'),a.getAttribute('target'))});
    strat.addEventListener('mousemove',e=>{const a=sub(e);strat.style.cursor=a?'pointer':'';if(!a){ascundeStare(corp);return}
      const de=baza();if(!de)return;const r=tinta(de,a.getAttribute('href'));arataStare(corp,r.tip==='extern'?r.url:r.tip==='local'?caleFile(r.cale):String(a.getAttribute('href')))});
    strat.addEventListener('mouseleave',()=>{strat.style.cursor='';ascundeStare(corp)});
  }
}
/* pagina desenată se vede întreagă, fără derulare (stratul de deasupra nu lasă rotița să deruleze pagina din iframe):
   browserul mic își ia înălțimea paginii; în editorweb, corpul browserului doar crește (min-height), cel mult 560 px */
function potriveste(fr){
  try{const d=fr.contentDocument,corp=fr.parentNode;if(!d||!d.documentElement||!corp)return;
    if(corp.closest('.leg-mini')){const h=Math.min(Math.max(Math.ceil(d.documentElement.scrollHeight),60),480);corp.style.height=h+'px';fr.style.height=h+'px';return}
    corp.style.minHeight='';const h=Math.ceil(d.documentElement.scrollHeight),c=corp.getBoundingClientRect().height;
    if(h>c+1)corp.style.minHeight=Math.min(h+2,560)+'px'}catch(e){}
}
function arataStare(corp,t){let s=corp.querySelector('.leg-stare');if(!s){s=document.createElement('div');s.className='leg-stare';corp.appendChild(s)}s.textContent=t}
function ascundeStare(corp){const s=corp.querySelector('.leg-stare');if(s)s.remove()}

/* --- mod live și browserul mic: un browser „de pagină”, cu filele lui ---
   VB = {fis(cale)→text|null, pagina:'Documente/x.html', tabs:[{loc, ist}], act, viz} ; loc = {cale} | {extern} */
function vbDoc(vb,loc){
  if(loc.extern)return {doc:docExtern(loc.extern),titlu:gazda(loc.extern),adresa:loc.extern};
  const c=vb.fis(loc.cale),n=desp(loc.cale)[1];
  if(c==null)return {doc:docEroare(loc.cale),titlu:caleFile(loc.cale),adresa:caleBara(loc.cale),eroare:true};
  return {doc:c,titlu:(eHtml(n)&&U.titluPagina(c))||n,adresa:caleBara(loc.cale),text:!eHtml(n)};
}
function vbUrmeaza(vb,href,target){
  const t=vb.tabs[vb.act];if(!t||t.loc.extern)return null;
  const r=tinta(t.loc.cale,href);
  if(r.tip!=='local'&&r.tip!=='extern')return {mesaj:'Legăturile de felul acesta nu le urmează simulatorul.'};
  const loc=r.tip==='extern'?{extern:r.url}:{cale:r.cale},d=vbDoc(vb,loc);
  const tg=String(target||'').trim(),nou=!!tg&&!/^_(self|top|parent)$/i.test(tg);
  if(!d.eroare)vb.viz[loc.extern?urlNorm(loc.extern):norm(loc.cale)]=1;
  if(nou){const k=tg.toLowerCase()!=='_blank'?vb.tabs.findIndex(x=>x.nume===tg):-1;
    if(k>=0){vb.tabs[k].ist.push(vb.tabs[k].loc);vb.tabs[k].loc=loc;vb.act=k}else{vb.tabs.push({loc,ist:[],nume:tg});vb.act=vb.tabs.length-1}}
  else{t.ist.push(t.loc);t.loc=loc}
  return {loc,eroare:!!d.eroare,nou};
}
function vbDeseneaza(view,vb){
  const t=vb.tabs[vb.act],d=vbDoc(vb,t.loc);
  /* filele */
  const strip=view.strip;
  strip.querySelectorAll('.leg-fila').forEach(x=>x.remove());
  if(view.fila0){view.fila0.classList.toggle('act',vb.act===0)}
  vb.tabs.forEach((x,i)=>{if(i===0&&view.fila0){const tt=vbDoc(vb,x.loc).titlu;if(view.titlu0&&view.titlu0.textContent!==tt)view.titlu0.textContent=tt;return}
    const dd=vbDoc(vb,x.loc),s=document.createElement('span');s.className='br-fila leg-fila'+(i===vb.act?' act':'');s.setAttribute('role','tab');
    s.innerHTML=`<span class="br-ic" aria-hidden="true"></span><button type="button" class="fn" title="${esc(dd.titlu)}">${esc(dd.titlu)}</button><button type="button" class="x" aria-label="Închide fila ${esc(dd.titlu)}">×</button>`;
    s.querySelector('.fn').onclick=()=>{vb.act=i;vbDeseneaza(view,vb)};
    s.querySelector('.x').onclick=()=>{vb.tabs.splice(i,1);if(vb.act>=i)vb.act=Math.max(0,vb.act-1);vbDeseneaza(view,vb)};
    strip.appendChild(s)});
  /* bara: ← și adresa */
  view.inapoi.disabled=!t.ist.length;view.inapoi.setAttribute('aria-label','Înapoi (Back)');view.inapoi.title='Înapoi (Back)';
  view.adr.textContent=d.adresa;
  /* pagina */
  let doc=d.text?`<!doctype html><html><head><meta charset="utf-8"></head><body><pre style="margin:0;padding:8px;font:13px Consolas,monospace;white-space:pre-wrap">${esc(d.doc)}</pre></body></html>`:d.doc;
  const prev=transforma(U.previewDoc(doc),vb.viz,t.loc.extern?null:t.loc.cale);
  view.fr._legSet=prev;view.fr.setAttribute('sandbox','allow-same-origin');
  if(view.fr.getAttribute('srcdoc')!==prev)view.fr.setAttribute('srcdoc',prev);
  if(view.nota)view.nota(d.eroare?NOTA_ERR:t.loc.extern?'Fila unui site de pe Internet. În simulator nu avem Internet, deci site-ul nu se încarcă.':'');
}
function vbLeaga(view,vb,laNav){
  view.inapoi.onclick=()=>{const t=vb.tabs[vb.act];if(!t.ist.length)return;t.loc=t.ist.pop();if(laNav)laNav({a:'inapoi',la:t.loc.cale||null});vbDeseneaza(view,vb)};
  if(view.fila0){view.fila0.onclick=()=>{if(vb.act!==0){vb.act=0;vbDeseneaza(view,vb)}};view.fila0.setAttribute('role','tab');view.fila0.tabIndex=0;
    view.fila0.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();view.fila0.click()}}}
  const urm=(href,tg)=>{const de=vb.tabs[vb.act].loc.cale;const r=vbUrmeaza(vb,href,tg);if(!r)return;if(r.mesaj){if(view.mesaj)view.mesaj(r.mesaj,true);return}
    if(laNav)laNav({a:'legatura',de,la:r.loc.cale||null,extern:r.loc.extern||null,ok:!r.eroare,blank:r.nou});
    vbDeseneaza(view,vb);
    if(view.mesaj)view.mesaj(r.loc.extern?`Legătura duce pe Internet${r.nou?', într-o filă nouă':''}. În simulator nu avem Internet.`:r.eroare?`Browserul n-a găsit fișierul <b>${esc(desp(r.loc.cale)[1])}</b>: pagina de eroare. Verifică numele din <code>href</code>. Butonul ← te întoarce.`:
      r.nou?`S-a deschis <b>${esc(desp(r.loc.cale)[1])}</b> într-o filă nouă. Prima filă a rămas deschisă.`:`S-a deschis <b>${esc(desp(r.loc.cale)[1])}</b>, în aceeași filă. Butonul ← te întoarce.`,!!r.eroare)};
  view.urm=urm;
  pregatesteIframe(view.corp,()=>vb.viz,()=>vb.tabs[vb.act].loc.extern?null:vb.tabs[vb.act].loc.cale,urm,()=>vb.tabs[vb.act].loc.extern?null:vb.tabs[vb.act].loc.cale);
}
/* bara ← + adresa, pusă înaintea corpului */
function faBara(sec,corp){
  let b=sec.querySelector(':scope > .leg-bara');
  if(!b){b=document.createElement('div');b.className='leg-bara';b.innerHTML='<button type="button" class="leg-inapoi" disabled>←</button><span class="leg-adr"></span>';sec.insertBefore(b,corp)}
  return {inapoi:b.querySelector('.leg-inapoi'),adr:b.querySelector('.leg-adr')};
}
function pregatesteLive(sec,body,S){
  const corp=corpDe(sec),fr=corp&&corp.querySelector('iframe');if(!fr)return;
  const sd=fr.getAttribute('srcdoc')||'';
  /* editorweb a redesenat pagina din editor (elevul a scris): totul pornește iar din fila 1 */
  const nouDinEditor=fr._legSet!==sd;
  if(!sec._vb||nouDinEditor){
    const pagina='Documente/'+S.live.fisier;
    const fis=c=>norm(c)===norm(pagina)?S.live.text:(exista(S,c)?U.citeste(S,c):null);
    const vechi=sec._vb;
    sec._vb={fis,pagina,tabs:[{loc:{cale:pagina},ist:[]}],act:0,viz:vechi?vechi.viz:(S._legViz||(S._legViz={}))};
    const b=faBara(sec,corp),strip=sec.querySelector('.br-file'),f0=strip.querySelector('.br-fila');
    if(f0)f0.classList.add('leg-0');
    const msgEl=body.querySelector('.ew-msg');
    sec._view={live:true,corp,fr,strip,fila0:f0,titlu0:f0&&f0.querySelector('.fn'),inapoi:b.inapoi,adr:b.adr,
      nota:h=>notaSub(sec,h),mesaj:(h,av)=>{if(msgEl){msgEl.innerHTML=h;msgEl.classList.toggle('av',!!av)}}};
    vbLeaga(sec._view,sec._vb,j=>{S.jurnal.push(Object.assign({t:++S.ts},j))});
    vbDeseneaza(sec._view,sec._vb);
  }
}
/* „Uite cum”: browserul mic, cu legăturile care se pot urma */
let MID=0;const MINI={};
function mini(o){
  const id='legmini'+(++MID);MINI[id]=o;
  const h=+o.inaltime||150;
  return `<div class="leg-mini" data-legmini="${id}"><div class="leg-et">${o.nota||'Așa desenează browserul tău paginile de mai sus. Apasă pe legătură: browserul o urmează.'}</div><div class="br-file" role="tablist"><span class="br-fila act"><span class="br-ic" aria-hidden="true"></span><span class="fn"></span></span></div><div class="leg-bara"><button type="button" class="leg-inapoi" disabled>←</button><span class="leg-adr"></span></div><div class="br-corp" style="height:${h}px"><iframe sandbox="" tabindex="0" title="Pagina desenată de browser" style="height:${h}px"></iframe><div class="br-strat"></div></div></div>`;
}
function pregatesteMini(el){
  if(el._leg)return;el._leg=true;
  const o=MINI[el.dataset.legmini];if(!o)return;
  const fis={};Object.entries(o.fisiere||{}).forEach(([n,t])=>fis[norm('Documente/'+n)]=t);
  const vb={fis:c=>Object.prototype.hasOwnProperty.call(fis,norm(c))?fis[norm(c)]:null,pagina:'Documente/'+o.start,tabs:[{loc:{cale:'Documente/'+o.start},ist:[]}],act:0,viz:{}};
  const strip=el.querySelector('.br-file'),f0=strip.querySelector('.br-fila');
  const view={corp:el.querySelector('.br-corp'),fr:el.querySelector('iframe'),strip,fila0:f0,titlu0:f0.querySelector('.fn'),inapoi:el.querySelector('.leg-inapoi'),adr:el.querySelector('.leg-adr')};
  vbLeaga(view,vb,null);vbDeseneaza(view,vb);
}
function randare(codPagina,inaltime){
  return `<div class="ewl-randare"><div class="leg-et">Așa desenează browserul tău codul de mai sus:</div><iframe sandbox="" tabindex="-1" title="Pagina desenată de browser din codul de mai sus" style="height:${+inaltime||120}px" srcdoc="${esc(U.previewDoc(codPagina))}"></iframe></div>`;
}

/* ---------- 5. legătura cu desenul editorweb.js ---------- */
function proceseaza(){
  document.querySelectorAll('.ew section[data-w="browser"]').forEach(sec=>{
    const ew=sec.closest('.ew'),body=ew&&ew.parentNode,E=body&&body._ew;if(!E||!E.S)return;
    try{if(E.S.mod==='live')pregatesteLive(sec,body,E.S);else pregatesteNp(sec,body,E.S)}catch(e){console.error('editorweb-legaturi:',e)}
  });
  document.querySelectorAll('.leg-mini[data-legmini]').forEach(el=>{try{pregatesteMini(el)}catch(e){console.error('editorweb-legaturi:',e)}});
}
let lucru=false;
function porneste(){css();proceseaza();new MutationObserver(()=>{if(lucru)return;lucru=true;try{proceseaza()}finally{lucru=false}}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['srcdoc']})}
if(document.body)porneste();else document.addEventListener('DOMContentLoaded',porneste);

window.EditorWebLegaturi={legaturi,tinta,paginaDe,exista,duce,toateMerg,urmata,textBun,perechiA,eticheteA,inCorp,mesajText,diagnostic,cuDiagnostic,randare,mini,docEroare,docExtern};
})();
