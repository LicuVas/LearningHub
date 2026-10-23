/* editorweb-stil.js — extensie pentru simulatorul editorweb.js (proprietar editorweb: lecția VIII/14) și pentru
   editorweb-schelet.js (proprietar: lecția VIII/15). Proprietarul ACESTEI extensii: lecția VIII/19 („Formatare la nivel
   de text, paragraf și fundal”, 24.10.2026). Se încarcă DUPĂ editorweb.js și editorweb-schelet.js. NU le schimbă; nu
   ascultă taste și nu schimbă desenul simulatorului.

   De ce nu trebuie alt desen: browserul simulat al lui editorweb.js desenează pagina elevului într-un iframe adevărat
   (EditorWebUtil.previewDoc, CSP cu style-src 'unsafe-inline'), deci atributele style se aplică exact ca în browser.
   Extensia doar CITEȘTE ce a desenat browserul, ca testele lecțiilor să judece ce VEDE elevul.

   Faptele (probate în Chromium 148 headless, motorul lui Edge și Chrome, pe fișiere scrise ca de Notepad, cu
   <!DOCTYPE html>: lectii/viii/m3-l19/_proba/proba_browser_l19.json):
     style="color: navy" merge cu sau fără spații, cu sau fără ; la sfârșit, cu litere mari, cu #000080;
     browserul SARE ÎN TĂCERE peste: = în loc de :, nume greșite (naavy, colour, culoare, albastru, centre, middle,
     dreapta, align, size), „20 px”, „20” fără px, al doilea atribut style de pe aceeași etichetă, style pus în eticheta
     de închidere; fără ; între două proprietăți le sare pe AMÂNDOUĂ; fără : la prima, doar pe ea; fără ghilimeaua de
     închidere, titlul dispare din pagină; „font-family: X, sans-serif” cu X lipsă = sans-serif; fără </strong>, se
     îngroașă și ce urmează.

   Ce adaugă — window.EditorWebStil:
   1. calc(src) → documentul desenat din src, într-un iframe ASCUNS al paginii (sandbox="allow-same-origin", FĂRĂ
      scripturi; aceeași curățare previewDoc ca browserul simulat). Stilurile se citesc CALCULATE de browser
      (getComputedStyle), deci cu moștenire (color pe <body> ajunge la <p>), cu ce a aruncat browserul și cu stilurile
      implicite (h1 = 32px, îngroșat). Ultimul text e ținut minte (testele aceleiași pagini nu-l desenează din nou).
      stil(src, selector, proprietate, i?) → valoarea calculată (ex. 'rgb(0, 0, 128)', '20px', 'center') sau null.
      are(src, selector, {proprietate: valoare, …}, i?) → true dacă elementul arată așa (culorile se compară ca
        culori: navy = #000080 = rgb(0, 0, 128); font-family: primul font din listă).
      fonturi(src, selector, i?) → lista fonturilor, cu litere mici, fără ghilimele; cuRezerva(src, selector, i?) →
        ultimul e serif / sans-serif / monospace.
      element(src, text) → cel mai adânc element al cărui text e exact `text` (fără diacritice și spații în plus);
      ingrosat(src, text), inclinat(src, text), culoareText(src, text) → cum arată acele cuvinte.
      fundalPagina(src) → culoarea ferestrei (fundalul lui <body>); textPagina(src) → textul paginii, simplificat.
   2. culoare(v) → 'rgb(r, g, b)' (sau 'rgba(…)') ori null dacă browserul n-o cunoaște; aceeasiCuloare(a, b);
      contrast(a, b) → raportul de contrast (formula WCAG 2, de la 1 la 21).
      lizibil(src, opt?) → {ok, rau:[{text, tag, culoare, fundal, raport, prag}]}: pentru fiecare bucată de text din
        pagină, culoarea literelor față de fundalul de sub ea. Pragul = REGULA LECȚIEI 19: raport ≥ 3 la tot textul
        (EditorWebStil.PRAG_LECTIE; reparația J1, 24.10.2026 — înainte 4,5 / 3 ca WCAG AA, ceea ce respingea roșul pe alb,
        4,0, deși lecția îl predă). Perechile „rele” din lecție rămân toate sub 3 (galben/alb 1,07; albastru/negru 2,44;
        roșu/verde 1,28; portocaliu/galben 1,84; bleumarin/negru 1,31). opt.prag = alt prag fix; opt.wcag = true → 4,5 și 3
        la litere mari (≥ 24px sau ≥ 18,66px îngroșate). E un CRITERIU al lecției (textul se citește), nu o regulă a
        browserului: browserul desenează orice culori.
   3. Verificări pe TEXTUL scris (browserul nu arată greșeala; elevul trebuie s-o găsească în Notepad):
      declaratii(src) → [{tag, prop, val, valid, eroare, rand}] — fiecare proprietate din fiecare style, cu ce a făcut
        browserul cu ea (valid = CSS.supports, adică exact regula browserului); eroare: 'egal' | 'faraDouaPuncte' |
        'faraPunctVirgula' | null.
      perechi(src) → fiecare <strong>, <em>, <span> are perechea lui.
      mesajText(src) → greșeala de stil FĂCUTĂ, spusă, cu ce se vede în browser (ordinea: style scris în text, style în
        eticheta de închidere, ghilimelele, două style pe o etichetă, =, : lipsă, ; lipsă, proprietate necunoscută, valoare
        necunoscută — culoare, mărime fără px / cu spațiu, aliniere, fonturi fără virgulă —, </strong> </em> </span> lipsă).
        De la reparația J1 (24.10.2026): ghilimelele „strâmbe” (puse de unele tastaturi de telefon) sunt numite; <font> și
        <center> au mesajul lor („etichetă veche; azi cu style”); fără <!DOCTYPE html> mesajul e ÎNTÂI despre rândul lipsă
        (browserul trece pe reguli vechi: „font-size: 20” e primit ca 20px, probat), apoi celelalte.
   4. cuDiagnostic(teste, {spec, coleg}) — ca EditorWebSchelet.cuDiagnostic (aceleași reguli: neatins / faraDiagnostic
      rămân neschimbate; curat / faraOraData pică pe ora și data scrise de F5 în Notepad; msgTactil), cu ordinea: starea
      (fila colegului, nesalvat, F5 în Notepad — ale schelet-ului) → greșeala de stil → greșelile schelet-ului.
   5. randare(cod, inaltime, eticheta?) — HTML-ul paginii desenate de browserul elevului (iframe FĂRĂ scripturi și fără
      cereri: EditorWebUtil.previewDoc), pentru „Uite cum”. Nu e imagine: e chiar desenul browserului. De la reparația J1
      (24.10.2026): sandbox="allow-same-origin" (tot fără allow-scripts), ca pagina lecției să-i citească înălțimea;
      `inaltime` e MINIMUL, iar desenul crește cât conținutul, la încărcare și la orice schimbare de lățime.

   Folosire:  <script src="../../_sim/editorweb.js"></script><script src="../../_sim/editorweb-schelet.js"></script>
              <script src="../../_sim/editorweb-stil.js"></script>
   apoi în teste  fn:S=>EditorWebStil.are(S.live.text,'h1',{color:'navy','text-align':'center'}).
   Pentru lecțiile următoare (VIII/21): semnăturile de mai sus nu se schimbă; ce vă lipsește → extensie nouă. */
(function(){
'use strict';
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cod=s=>'<code>'+esc(s)+'</code>';
const sup=(p,v)=>{try{return !!(window.CSS&&CSS.supports&&CSS.supports(p,v))}catch(e){return false}};

/* ---------- 1. pagina desenată, într-un iframe ascuns (fără scripturi) ---------- */
let FR=null,cSrc=null,cDoc=null;
function cadru(){
  if(FR&&FR.isConnected&&FR.contentDocument)return FR;
  FR=document.createElement('iframe');
  FR.setAttribute('sandbox','allow-same-origin');          /* fără allow-scripts: nimic din pagina elevului nu rulează */
  FR.setAttribute('aria-hidden','true');FR.setAttribute('tabindex','-1');FR.title='Calculul stilurilor (ascuns)';
  FR.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;border:0;opacity:0;visibility:hidden;pointer-events:none;z-index:-1';
  (document.body||document.documentElement).appendChild(FR);
  cSrc=null;cDoc=null;return FR;
}
function calc(src){
  src=lin(src);
  const f=cadru();
  if(cSrc===src&&cDoc&&cDoc===f.contentDocument)return cDoc;
  const U=window.EditorWebUtil;
  const html=U&&U.previewDoc?U.previewDoc(src):src;
  const d=f.contentDocument;
  d.open();d.write(html);d.close();
  cSrc=src;cDoc=f.contentDocument;return cDoc;
}
const cs=e=>e&&FR&&FR.contentWindow?FR.contentWindow.getComputedStyle(e):null;
function el(src,sel,i){const d=calc(src);if(!d)return null;return d.querySelectorAll(sel)[i||0]||null}
function stil(src,sel,prop,i){const e=el(src,sel,i);const s=cs(e);return s?s.getPropertyValue(prop).trim():null}

/* culorile: 'rgb(…)', 'rgba(…)', '#rrggbb' → [r,g,b,a] */
function rgba(v){
  if(!v)return null;v=String(v).trim();
  let m=v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if(m){let a=m[4]==null?1:(/%$/.test(m[4])?parseFloat(m[4])/100:parseFloat(m[4]));return [+m[1],+m[2],+m[3],a]}
  m=v.match(/^#([0-9a-f]{6})$/i);
  if(m){const n=parseInt(m[1],16);return [n>>16&255,n>>8&255,n&255,1]}
  return null;
}
let CV=null;
function culoareRgba(v){
  if(v==null)return null;v=String(v).trim();if(!v||!sup('color',v))return null;
  const r=rgba(v);if(r)return r;
  if(!CV){try{CV=document.createElement('canvas').getContext('2d')}catch(e){CV=null}}
  if(!CV)return null;
  CV.fillStyle='#010203';CV.fillStyle=v;return rgba(CV.fillStyle);
}
const sirCuloare=c=>c?(c[3]<1?`rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`:`rgb(${c[0]}, ${c[1]}, ${c[2]})`):null;
function culoare(v){return sirCuloare(culoareRgba(v))}
function aceeasiCuloare(a,b){const x=Array.isArray(a)?a:(rgba(a)||culoareRgba(a)),y=Array.isArray(b)?b:(rgba(b)||culoareRgba(b));
  return !!x&&!!y&&x[0]===y[0]&&x[1]===y[1]&&x[2]===y[2]&&Math.abs(x[3]-y[3])<0.01}
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])}
function contrast(a,b){const x=Array.isArray(a)?a:(rgba(a)||culoareRgba(a)),y=Array.isArray(b)?b:(rgba(b)||culoareRgba(b));
  if(!x||!y)return null;const l1=lum(x),l2=lum(y);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)}
/* fundalul de sub un element: primul strămoș cu fundal care se vede; pagina simulată are <body> alb (previewDoc) */
function fundal(e){
  for(let x=e;x&&x.nodeType===1;x=x.parentElement){const c=rgba(cs(x).backgroundColor);if(c&&c[3]>0.5)return c}
  return [255,255,255,1];
}
function fundalPagina(src){const d=calc(src);return d&&d.body?sirCuloare(fundal(d.body)):null}
function textPagina(src){const d=calc(src);return d&&d.body?norm(d.body.textContent):''}

const GENERICE=['serif','sans-serif','monospace','cursive','fantasy','system-ui'];
function fonturi(src,sel,i){const v=stil(src,sel,'font-family',i);if(v==null)return null;
  return v.split(',').map(x=>x.trim().replace(/^["']|["']$/g,'').toLowerCase()).filter(Boolean)}
function cuRezerva(src,sel,i){const l=fonturi(src,sel,i);return !!l&&l.length>1&&GENERICE.includes(l[l.length-1])}
/* are(src,'h1',{color:'navy','text-align':'center'}) */
function are(src,sel,props,i){
  const e=el(src,sel,i);if(!e)return false;const s=cs(e);
  for(const [p,v] of Object.entries(props||{})){
    const real=s.getPropertyValue(p).trim();
    if(/color$/.test(p)){if(!aceeasiCuloare(real,v))return false}
    else if(p==='font-family'){const l=fonturi(src,sel,i)||[];if(l[0]!==String(v).split(',')[0].trim().replace(/^["']|["']$/g,'').toLowerCase())return false}
    else if(p==='font-weight'){const w=parseInt(real,10)||400;if(String(v)==='bold'?w<600:w!==(parseInt(v,10)||400))return false}
    else if(norm(real)!==norm(v))return false;
  }
  return true;
}
/* cel mai adânc element din <body> al cărui text e exact `text` */
function element(src,text){
  const d=calc(src);if(!d||!d.body)return null;const t=norm(text);let gasit=null;
  [d.body,...d.body.querySelectorAll('*')].forEach(x=>{if(norm(x.textContent)===t)gasit=x});   /* ordinea documentului: ultimul = cel mai adânc */
  return gasit;
}
function ingrosat(src,text){const e=element(src,text);return !!e&&(parseInt(cs(e).fontWeight,10)||400)>=600}
function inclinat(src,text){const e=element(src,text);return !!e&&cs(e).fontStyle==='italic'}
function culoareText(src,text){const e=element(src,text);return e?cs(e).color:null}

/* ---------- 2. lizibilitatea ---------- */
const PRAG_LECTIE=3;   /* regula lecției 19 (reparația J1, 24.10.2026): raport ≥ 3 la tot textul; vezi capul fișierului */
function lizibil(src,opt){
  opt=opt||{};
  const d=calc(src);if(!d||!d.body)return {ok:true,rau:[]};
  const rau=[];
  [d.body,...d.body.querySelectorAll('*')].forEach(x=>{
    const t=[...x.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent).join(' ').replace(/\s+/g,' ').trim();
    if(!t)return;
    const s=cs(x);if(s.display==='none'||s.visibility==='hidden')return;
    const c=rgba(s.color)||[0,0,0,1],b=fundal(x),r=contrast(c,b);
    const fs=parseFloat(s.fontSize)||16,fw=parseInt(s.fontWeight,10)||400,
      prag=typeof opt.prag==='number'?opt.prag:opt.wcag?((fs>=24||(fs>=18.66&&fw>=600))?3:4.5):PRAG_LECTIE;
    if(r<prag)rau.push({text:t.slice(0,60),tag:x.tagName.toLowerCase(),culoare:sirCuloare(c),fundal:sirCuloare(b),raport:Math.round(r*100)/100,prag});
  });
  return {ok:!rau.length,rau};
}

/* ---------- 3. ce a SCRIS elevul ---------- */
function etichete(src){
  const s=lin(src),out=[],re=/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;let m;
  while((m=re.exec(s)))out.push({inchidere:!!m[1],tag:m[2].toLowerCase(),attrs:m[3],idx:m.index,rand:s.slice(0,m.index).split('\n').length});
  return out;
}
const RE_STYLE=/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;
function stiluriEticheta(attrs){const l=[];let m;RE_STYLE.lastIndex=0;while((m=RE_STYLE.exec(attrs)))l.push(m[1]!=null?m[1]:m[2]!=null?m[2]:m[3]);return l}
function declaratii(src){
  const out=[];
  etichete(src).filter(e=>!e.inchidere).forEach(e=>{
    const l=stiluriEticheta(e.attrs);if(!l.length)return;
    l[0].split(';').map(x=>x.trim()).filter(Boolean).forEach(ch=>{
      const k=ch.indexOf(':');
      if(k<0){const g=ch.indexOf('=');
        out.push(g>0?{tag:e.tag,prop:ch.slice(0,g).trim().toLowerCase(),val:ch.slice(g+1).trim(),valid:false,eroare:'egal',rand:e.rand}
                    :{tag:e.tag,prop:(ch.split(/\s+/)[0]||'').toLowerCase(),val:ch.split(/\s+/).slice(1).join(' '),valid:false,eroare:'faraDouaPuncte',rand:e.rand});return}
      const prop=ch.slice(0,k).trim().toLowerCase(),val=ch.slice(k+1).trim();
      if(/[a-z-]+\s*:/i.test(val)){out.push({tag:e.tag,prop,val,valid:false,eroare:'faraPunctVirgula',rand:e.rand});return}
      out.push({tag:e.tag,prop,val,valid:sup(prop,val),eroare:null,rand:e.rand});
    });
  });
  return out;
}
const TAGURI=['strong','em','span','b','i'];
function numara(src,t){const s=lin(src);return {d:(s.match(new RegExp('<'+t+'\\b[^>]*>','gi'))||[]).length,i:(s.match(new RegExp('</'+t+'\\s*>','gi'))||[]).length}}
function perechi(src){return TAGURI.every(t=>{const n=numara(src,t);return n.d===n.i})}

const SUGESTII={colour:'color',culoare:'color','font-color':'color','text-color':'color',fontcolor:'color',
  align:'text-align',allign:'text-align','text-allign':'text-align',aliniere:'text-align','text-aling':'text-align',
  size:'font-size','text-size':'font-size',fontsize:'font-size',marime:'font-size','font-zise':'font-size',
  font:'font-family','font-name':'font-family',fontfamily:'font-family','font-familly':'font-family',
  'background-colour':'background-color','backround-color':'background-color','bg-color':'background-color',fundal:'background-color','background-colr':'background-color'};
const CULORI_RO={rosu:'red',roșu:'red',albastru:'blue',verde:'green',galben:'yellow',alb:'white',negru:'black',portocaliu:'orange',gri:'gray',mov:'purple',roz:'pink',maro:'brown',bleumarin:'navy'};
const NUMEROASE=['color','background-color','font-size','font-family','text-align'];
const CURBE=/[\u201C\u201D\u201E\u201F\u2033\u00AB\u00BB]/;   /* ghilimelele „strâmbe” (probat: browserul sare peste stil) */
const VECHI={font:`${cod('<font>')} e o etichetă veche. Browserul o mai desenează, dar azi culoarea, mărimea și fontul se scriu cu ${cod('style')}: în locul lui ${cod('<font color="red">')}…${cod('</font>')}, scrie ${cod('<span style="color: red;">')}…${cod('</span>')}.`,
  center:`${cod('<center>')} e o etichetă veche. Browserul o mai desenează, dar azi alinierea se scrie cu ${cod('style')}: ${cod('<p style="text-align: center;">')}.`};

function mesajText(src){
  const s=lin(src),et=etichete(s),areDoctype=/<!doctype\s+html\s*>/i.test(s);
  /* fără DOCTYPE browserul trece pe reguli vechi (probat: „font-size: 20” e primit ca 20px), iar desenul simulat nu
     le are; schelet-ul n-are mesaj pentru rândul lipsă, deci îl spune extensia, ÎNAINTEA greșelilor de stil */
  if(!areDoctype&&/<html\b/i.test(s))return `Lipsește primul rând al paginii, ${cod('<!DOCTYPE html>')}. Pune-l la loc, deasupra lui ${cod('<html lang="ro">')}: fără el, browserul desenează pagina după reguli vechi, iar unele stiluri arată altfel.`;
  /* style scris după >, deci în textul paginii */
  {const m=s.match(/>\s*style\s*=\s*["']/i);if(m)return `Stilul e scris după semnul ${cod('>')}, deci în text: browserul îl arată în pagină, ca text. Mută-l înaintea lui ${cod('>')}, în eticheta de deschidere, de exemplu ${cod('<h1 style="color: navy;">')}.`}
  /* style în eticheta de închidere */
  {const e=et.find(x=>x.inchidere&&/\bstyle\s*=/i.test(x.attrs));if(e)return `Stilul e scris în eticheta de închidere, ${cod('</'+e.tag+' …>')}: browserul nu se uită acolo. Mută-l în eticheta de deschidere: ${cod('<'+e.tag+' style="…">')}.`}
  for(const e of et.filter(x=>!x.inchidere&&/\bstyle\b/i.test(x.attrs))){
    const a=e.attrs,q=(a.match(/"/g)||[]).length;
    if(/\bstyle\s*=/i.test(a)&&CURBE.test(a))return `În eticheta ${cod('<'+e.tag+'>')}, ghilimelele stilului sunt „strâmbe” (${cod('“')}, ${cod('”')} sau ${cod('„')}), cum le pune singură tastatura unor telefoane. Browserul cunoaște doar ghilimelele drepte, ${cod('"')}, așa că sare peste stil. Șterge-le și scrie în locul lor ghilimeaua dreaptă, ${cod('"')}.`;
    if(/\bstyle\s*=\s*"/i.test(a)&&q%2)return `În eticheta ${cod('<'+e.tag+'>')}, stilul n-are ghilimeaua de la sfârșit. Browserul ia drept stil tot ce urmează, până la următoarea ghilimea, iar textul ${e.tag==='h1'?'titlului ':''}dispare din pagină. Pune ${cod('"')} înainte de ${cod('>')}.`;
    if(/\bstyle\s*=\s*[^"'\s>]/i.test(a)&&q%2)return `În eticheta ${cod('<'+e.tag+'>')}, stilul n-are ghilimeaua de la început: după ${cod('style=')} vine ${cod('"')}. Fără ea, browserul sare peste stil.`;
    if(/\bstyle\s*=\s*[^"'\s>]+\s+[^\s>]/i.test(a)&&!q)return `În eticheta ${cod('<'+e.tag+'>')}, stilul stă între ghilimele: ${cod('style="color: navy;"')}. Fără ele, browserul se oprește la primul spațiu și sare peste stil.`;
    if(/\bstyle\s*=\s*$/i.test(a))return `În eticheta ${cod('<'+e.tag+'>')}, după ${cod('style=')} vin ghilimelele, cu stilul între ele: ${cod('style="color: navy;"')}.`;
    if(stiluriEticheta(a).length>1)return `Eticheta ${cod('<'+e.tag+'>')} are două atribute ${cod('style')}: browserul îl folosește doar pe primul și sare peste al doilea. Pune toate proprietățile în același ${cod('style')}, despărțite prin ${cod(';')}.`;
  }
  for(const d of declaratii(s)){
    if(d.eroare==='egal')return `În stil, între proprietate și valoare stau două puncte: ${cod(d.prop+': '+d.val)}, nu ${cod(d.prop+' = '+d.val)}. Cu ${cod('=')}, browserul sare peste ea.`;
    if(d.eroare==='faraDouaPuncte')return `După ${cod(d.prop)} lipsesc cele două puncte: ${cod(d.prop+': '+d.val)}. Fără ele, browserul sare peste ea.`;
    if(d.eroare==='faraPunctVirgula'){const prima=d.val.replace(/[\s,]*[a-z-]+\s*:[\s\S]*$/i,'').trim(),virg=/,\s*[a-z-]+\s*:/i.test(d.val)&&!/^font-family$/.test(d.prop);
      return `Între două proprietăți lipsește punctul și virgula: după ${cod(d.prop+': '+prima)} pune ${cod(';')}${virg?' (nu virgulă)':''}. Fără el, browserul sare peste amândouă.`}
    if(d.valid)continue;
    if(!sup(d.prop,'inherit')){const p=SUGESTII[norm(d.prop)];
      return `${cod(d.prop)} nu e o proprietate pe care o știe browserul, așa că sare peste ea. ${p?'Scrie '+cod(p)+'.':'Scrie-o exact, în engleză: '+NUMEROASE.map(cod).join(', ')+'.'}`}
    const v=d.val,vn=norm(v);
    if(/color$/.test(d.prop)){const ro=CULORI_RO[vn]||CULORI_RO[v.toLowerCase()];
      return ro?`Numele culorilor se scriu în engleză: în loc de ${cod(v)}, scrie ${cod(ro)}. Altfel, browserul sare peste culoare.`
               :`${cod(v)} nu e o culoare pe care o știe browserul, așa că sare peste ea. Verifică literă cu literă; numele culorilor sunt în engleză, de exemplu ${['navy','red','green','white','yellow','lightyellow'].map(cod).join(', ')}.`}
    if(d.prop==='font-size'){
      if(/^\d+([.,]\d+)?$/.test(v)&&!areDoctype)continue;   /* fără DOCTYPE browserul primește 20 ca 20px (reguli vechi): vorbește schelet-ul */
      if(/^\d+([.,]\d+)?\s+px$/i.test(v))return `Între număr și ${cod('px')} nu se pune spațiu: ${cod(v.replace(/\s+/g,''))}. Cu spațiu, browserul sare peste mărime.`;
      if(/^\d+([.,]\d+)?$/.test(v))return `După număr scrie ${cod('px')}, lipit: ${cod(v+'px')}. Fără ${cod('px')}, browserul sare peste mărime.`;
      return `Mărimea se scrie ca un număr lipit de ${cod('px')}, de exemplu ${cod('font-size: 20px;')}.`;
    }
    if(d.prop==='text-align')return `${cod(v)} nu e o aliniere pe care o știe browserul. Scrie ${cod('left')}, ${cod('center')} sau ${cod('right')}, în engleză (${cod('center')} se termină cu „er”).`;
    return `Valoarea ${cod(v)} nu se potrivește la ${cod(d.prop)}, așa că browserul sare peste ea.`;
  }
  /* fonturi fără virgulă: „Verdana sans-serif” e UN nume, de font care nu există (probat: se folosește fontul implicit) */
  for(const d of declaratii(s))if(d.prop==='font-family'&&d.valid&&!/,/.test(d.val)&&/\s(serif|sans-serif|monospace)\s*$/i.test(d.val))
    return `Între fonturi pune virgulă: ${cod(d.val.replace(/\s+(serif|sans-serif|monospace)\s*$/i,', $1'))}. Fără ea, browserul caută un singur font, cu tot numele acesta, care nu există.`;
  /* etichete vechi: browserul le mai desenează, dar lecția (și scheletul) cer style */
  {const e=et.find(x=>!x.inchidere&&VECHI[x.tag]);if(e)return VECHI[e.tag]}
  for(const t of ['strong','em','span']){const n=numara(s,t);
    if(n.d>n.i)return `Lipsește ${cod('</'+t+'>')}: fără el, browserul ${t==='strong'?'îngroașă':t==='em'?'înclină':'formatează'} și ce urmează după cuvintele tale. Închide-l chiar după ele.`;
    if(n.i>n.d)return `Un ${cod('</'+t+'>')} n-are ${cod('<'+t+'>')} înaintea lui. Verifică perechea.`}
  {const m=s.match(/<\/(strong|em|span)\b(?!\s*>)/i);if(m)return `După ${cod('</'+m[1].toLowerCase())} trebuie semnul ${cod('>')}, care închide eticheta.`}
  return '';
}

/* ---------- 4. aceleași teste, cu mesajul greșelii ---------- */
function diagnostic(S,U,opt){
  const ES=window.EditorWebSchelet;
  const s=ES?ES.src(S,U,opt&&opt.spec):(S.live&&S.live.text);
  if(ES){const d=ES.diagnostic(S,U,opt||{});if(d&&(!s||d!==ES.mesajText(s)))return d}   /* starea: fila colegului, nesalvat, F5 în Notepad */
  const m=s?mesajText(s):'';
  if(m)return m;
  return ES&&s?ES.mesajText(s):'';
}
function cuDiagnostic(teste,opt){
  opt=opt||{};
  const ES=window.EditorWebSchelet;
  return (teste||[]).map(c=>{
    if(!c||c.neatins||c.faraDiagnostic)return c;
    let d='';
    const o={ce:c.ce,fn(S,U){
      const ok=typeof c.fn==='function'?!!c.fn(S,U):U.test(S,c);
      if(ES&&(c.curat||c.faraOraData)){
        const sp=c.fisier||opt.spec,s=ES.src(S,U,sp);
        if(s&&ES.oraData(s)){d=ES.mesajOraSalvata(S,U,sp,s,opt);return false}
      }
      d=ok?'':diagnostic(S,U,opt);return ok}};
    Object.defineProperty(o,'msg',{enumerable:true,get(){return d||(c.msgTactil&&ES&&ES.tactil()?c.msgTactil:c.msg)||''}});
    return o;
  });
}

/* ---------- 5. desenul browserului, pentru „Uite cum” ---------- */
function randare(codPagina,inaltime,eticheta){
  const U=window.EditorWebUtil;
  const doc=U?U.previewDoc(codPagina):String(codPagina),h=+inaltime||140;
  return `<div class="ews-randare"><div class="ews-eticheta">${eticheta||'Așa desenează browserul tău codul de mai sus:'}</div><iframe sandbox="allow-same-origin" data-ews-min="${h}" tabindex="-1" title="Pagina desenată de browser din codul de mai sus" style="height:${h}px" srcdoc="${esc(doc)}"></iframe></div>`;
}
/* înălțimea desenului = înălțimea paginii desenate (reparația J1: la 390 px titlul se rupe pe două rânduri, iar un
   cadru fix tăia paragraful). Se potrivește la încărcare și la fiecare schimbare de LĂȚIME (telefon rotit, panou
   deschis după ce era ascuns). `inaltime` rămâne minimul. Fără scripturi în desen: doar pagina lecției îl măsoară. */
let RO=null;
function potriveste(f){
  try{
    const d=f.contentDocument,w=f.clientWidth;if(!d||!d.documentElement||!w)return;
    const min=+f.getAttribute('data-ews-min')||0;
    f.style.height=min+'px';
    const h=Math.ceil(d.documentElement.scrollHeight)+2;
    f.style.height=Math.max(min,h)+'px';f._ewsW=w;
  }catch(e){}
}
function urmareste(f){
  potriveste(f);
  if(!RO&&window.ResizeObserver)RO=new ResizeObserver(l=>l.forEach(x=>{const f=x.target;if(f.clientWidth&&f.clientWidth!==f._ewsW)potriveste(f)}));
  if(RO)RO.observe(f);
}
document.addEventListener('load',e=>{const f=e.target;if(f&&f.tagName==='IFRAME'&&f.hasAttribute('data-ews-min'))urmareste(f)},true);
const STIL=`.ews-randare{margin:.4em 0 .7em;border:1px solid var(--line,#ccd4e2);border-radius:6px;overflow:hidden;background:#fff}
.ews-eticheta{font-size:.78rem;color:var(--ink2,#4e5a6e);background:var(--paper2,#eef2f8);padding:3px 10px;border-bottom:1px solid var(--line,#ccd4e2)}
.ews-randare iframe{display:block;width:100%;border:0;background:#fff}`;
function css(){if(!document.getElementById('editorweb-stil-css')){const s=document.createElement('style');s.id='editorweb-stil-css';s.textContent=STIL;document.head.appendChild(s)}}
if(document.head)css();else document.addEventListener('DOMContentLoaded',css);

window.EditorWebStil={calc,stil,are,fonturi,cuRezerva,element,ingrosat,inclinat,culoareText,fundalPagina,textPagina,
  culoare,aceeasiCuloare,contrast,lizibil,PRAG_LECTIE,declaratii,perechi,mesajText,diagnostic,cuDiagnostic,randare};
})();
