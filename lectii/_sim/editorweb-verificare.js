/* editorweb-verificare.js — extensie pentru simulatorul editorweb.js (proprietar: lecția VIII/14) și editorweb-schelet.js
   (lecția VIII/15). Proprietarul ACESTEI extensii: lecția VIII/20 („Securitate cibernetică: ce nu public niciodată pe web”,
   24.10.2026). Se încarcă DUPĂ editorweb.js și editorweb-schelet.js (și după editorweb-continut.js, dacă îl folosești).
   NU schimbă nimic din ele: nu ascultă taste, nu schimbă desenul, nu atinge `teste` și nici clasele CSS ale altora.

   Ce adaugă: window.EditorWebVerificare — „ochelarii” lecției 20. Caută în TEXTUL paginii (tot codul, nu doar ce se vede
   în pagină) datele care nu se publică și spune UNDE sunt: în pagină, pe filă (<title>), în textul alternativ (alt), în
   numele unui fișier (src / href) sau în alt atribut. Testele lecției verifică astfel pe comportament (ce a rămas în
   fișier), nu un singur răspuns scris.
   Nu e o funcție a vreunei aplicații reale: e corectorul exercițiilor (în Notepad și în browser nu există așa ceva).

   API (semnăturile NU se schimbă; ce-ți trebuie în plus = extensie cu nume nou):
     locuri(src)                → [{unde:'pagina'|'fila'|'alt'|'atribut', text, rand, fisier?}]  (citite cu DOMParser, ca
                                  browserul; `rand` = rândul din cod unde începe bucata, numărat de la 1; valorile lui src și
                                  href au unde:'atribut' și fisier:true — sunt nume de fișiere sau adrese)
     gaseste(src, opt)          → [{tip, eticheta, text, unde, rand, fisier?}] — datele găsite. opt.tipuri = lista tipurilor
                                  căutate (implicit toate); opt.nume = numele de familie ale persoanelor din exercițiu
                                  (['Popescu']) — căutate MEREU când sunt date, și cu opt.tipuri; opt.texte = [{tip, eticheta,
                                  text}] — fraze proprii exercițiului (programul, „acum suntem…”), căutate MEREU când sunt date;
                                  opt.fisiere = false → valorile lui src și href NU se caută (numele fișierelor de la școală,
                                  „Popescu_Ana_bucura.jpg”, rămân pentru profesor: lecția 20, întrebarea 6 din listă)
     are(src, tip, opt)         → bool (doar tipul cerut)
     curat(src, opt)            → nicio dată găsită (cu opt.tipuri / opt.nume / opt.texte / opt.fisiere)
     contine(src, text, unde?)  → textul apare (fără diferențe de litere mari, diacritice, spații), în tot codul sau doar în
                                  locul cerut ('pagina'|'fila'|'alt'|'atribut')
     textPagina(src)            → textul din corp, cum îl citește un om în browser (fără alt-uri)
     mesaj(src, opt)            → prima dată găsită, spusă elevului: ce e, unde e și pe ce rând; '' dacă nu e nimic
     cuDiagnostic(teste, opt)   → ca EditorWebSchelet.cuDiagnostic (sau EditorWebContinut.cuDiagnostic, dacă e încărcat):
                                  întâi starea (fila colegului, nesalvat, F5 în Notepad), apoi, la testele cu `date:{…}`
                                  (aceleași chei ca opt de mai sus), data rămasă, cu locul ei. Mesajul caută DOAR ce numește
                                  testul: `date:{nume:[…]}` → doar numele (nu și școala); fără `tipuri`, nu toate tiparele.
                                  opt.spec ca la Schelet.
     randare(cod, inaltime)     → HTML-ul paginii desenate de browserul elevului (iframe sandbox="", fără scripturi, fără
                                  cereri: EditorWebUtil.previewDoc), pentru „Uite cum”.
     TIPURI                     → {tip:{eticheta, re, orig?}} — tiparele: telefon, email, cnp, adresa, parola, scoala, nastere.

   Tiparele (românești; probate pe codurile lecției 20 în _proba/proba_coduri_l20.py și _proba/proba_reparatii.py):
     telefon  07xx xxx xxx, 02xx/03xx (fix), cu +40 sau 0040 în față, cu spații, puncte sau liniuțe între grupe;
     email    ceva@ceva.ceva;  cnp  13 cifre lipite, prima 1-9;
     adresa   Strada/Str./Bd./Bulevardul/Aleea/Șoseaua + nume cu literă mare sau număr („strada pietonală” nu e adresă);
              Calea + nume + număr („Calea Lactee” nu e adresă); bl./sc./ap. + număr;
     parola   „parola”, „parolă”, „password”, „PIN” scris cu litere mari sau „codul pin”, „codul de deblocare” („un pin pe
              ghiozdan” nu e cod);
     scoala   Școala/Școlii/Liceul/Liceului/Colegiul/Colegiului cu literă mare + numele (literă mare, cifră, „nr.”, ghilimele)
              sau gimnazială/generală/primară/profesională/tehnologic/teoretic/național — tot numele, până la „din” sau la
              semnul de punctuație („merg la școală cu plăcere” nu e nume de școală);
     nastere  „născut/născută” sau o dată zz.ll.aaaa.
   Tiparele sunt pentru EXERCIȚIILE lecției (date inventate), nu un detector universal: un nume de familie îl află doar din
   opt.nume, iar programul zilnic sau „unde ești acum” doar din opt.texte. Pe text liber (mini-proiectul), cere tipurile
   explicit (opt.tipuri) și opt.fisiere:false.

   Schimbări (24.10.2026, reparația după judecata 1, proprietarul VIII/20; semnăturile neschimbate): opt.fisiere; fisier:true
   la src/href; opt.nume / opt.texte căutate și cu opt.tipuri; `are` numără doar tipul cerut; mesajul la testele cu `date`
   caută doar ce numește testul; „Mai e încă un lucru de verificat”; numele școlii întreg; tiparele adresa / parola mai
   stricte (fără „strada pietonală”, „Calea Lactee”, „pin pe ghiozdan”). */
(function(){
'use strict';
const U=window.EditorWebUtil, ES=window.EditorWebSchelet;
if(!U||!window.EditorWeb){console.error('editorweb-verificare.js: se încarcă după editorweb.js');return}
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* comparare fără diacritice (și cu ş/ţ cu sedilă), fără litere mari, cu spațiile strânse */
const norm=s=>String(s==null?'':s).replace(/[şŞ]/g,'s').replace(/[ţŢ]/g,'t').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();

/* un cuvânt din numele școlii: cu literă mare, „nr. 99”, un număr, ceva între ghilimele, felul școlii sau „de” */
const SW='(?:\\p{Lu}[\\p{L}\\-]*|nr\\.?\\s*\\d+|\\d+|[„"][^”"]+[”"]|gimnazial\\p{L}*|general\\p{L}*|primar\\p{L}*|profesional\\p{L}*|tehnologic\\p{L}*|teoretic\\p{L}*|na[țţt]ional\\p{L}*)';
/* adresa: un nume de stradă (cuvinte cu literă mare) și numărul (cu „nr.” sau fără) */
const NM='\\p{Lu}[\\p{L}\\-]*',NUM='(?:nr\\.?\\s*)?\\d+[A-Za-z]?';
const RE_ADRESA=new RegExp('(?:^|[^\\p{L}])(?:(?:[Ss]trada|[Ss]tr\\.|[Bb]d\\.|[Bb]ulevardul|[Aa]leea|[ȘŞșşSs]oseaua)\\s*(?:'+NM+'(?:\\s+'+NM+')*(?:\\s*,?\\s*'+NUM+')?|'+NUM+')|[Cc]alea\\s+'+NM+'(?:\\s+'+NM+')*\\s*,?\\s*'+NUM+'|(?:[Bb]l|[Ss]c|[Aa]p)\\.\\s*[\\p{L}\\d])','u');
const TIPURI={
  telefon:{eticheta:'un număr de telefon',re:/(?:\+40|0040|\b0)[\s.\-]?(?:7\d{2}|[23]\d{2})[\s.\-]?\d{3}[\s.\-]?\d{3}\b/},
  email:{eticheta:'o adresă de e-mail',re:/[\w.+\-]+@[\w\-]+(?:\.[\w\-]+)+/},
  cnp:{eticheta:'un CNP (13 cifre)',re:/\b[1-9]\d{12}\b/},
  /* pe textul ORIGINAL: după cuvântul străzii vine un nume cu literă mare sau un număr („strada pietonală” nu e adresă);
     „Calea” doar cu număr („Calea Lactee” nu e adresă) */
  adresa:{eticheta:'o adresă de acasă (stradă, număr, bloc)',orig:true,re:RE_ADRESA},
  /* „PIN” doar cu litere mari (pinul de pe ghiozdan nu e cod) sau „codul pin” */
  parola:{eticheta:'o parolă sau un cod',orig:true,re:/(?:^|[^\p{L}])(?:[Pp]arol(?:ele|ei|[aăe])|PAROL[AĂE]|[Pp]assword|PIN|[Cc]odul\s+[Pp][Ii][Nn]|[Cc]odul de deblocare)(?![\p{L}])/u},
  /* numele școlii, ÎNTREG: „Școala Gimnazială nr. 99” (nu „Școala G”), pe textul ORIGINAL (cu diacritice), ca „merg la
     școală cu plăcere” să nu fie luat drept nume de școală */
  scoala:{eticheta:'numele școlii',orig:true,re:new RegExp('(?:^|[^\\p{L}])(?:[ȘŞS]coala|[ȘŞS]colii|Liceul(?:ui)?|Colegiul(?:ui)?)\\s+'+SW+'(?:\\s+(?:de\\s+)?'+SW+')*','u')},
  nastere:{eticheta:'data nașterii',re:/\bnascut[a]?\b|\b\d{1,2}[.\/]\d{1,2}[.\/](?:19|20)\d{2}\b/}
};
/* tiparele se aplică pe textul FĂRĂ diacritice (norm), ca „parolă” și „parola” să fie la fel (în afară de cele cu orig:true);
   textul arătat elevului e cel original */
const UNDE={pagina:'în pagină',fila:'pe filă (în <code>&lt;title&gt;</code>)',alt:'în textul alternativ (<code>alt</code>) al unei imagini',atribut:'într-un atribut din cod'};
const UNDE_FISIER='în numele unui fișier (la <code>src</code> sau <code>href</code>)';

/* rândul din cod pe care apare prima dată un text (căutat fără diacritice); 0 dacă nu-l găsește */
function randul(src,text){
  const L=lin(src).split('\n'),t=norm(text).slice(0,24);if(!t)return 0;
  for(let i=0;i<L.length;i++)if(norm(L[i]).includes(t))return i+1;
  return 0;
}
function locuri(src){
  const s=lin(src),doc=new DOMParser().parseFromString(s,'text/html'),out=[];
  const t=doc.querySelector('title');if(t&&t.textContent.trim())out.push({unde:'fila',text:t.textContent.replace(/\s+/g,' ').trim()});
  /* textul din corp, pe bucăți (fiecare nod de text), ca rândul să poată fi spus */
  const w=doc.createTreeWalker(doc.body||doc.documentElement,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){const x=n.nodeValue.replace(/\s+/g,' ').trim();if(x&&!(n.parentNode&&/^(script|style|title)$/i.test(n.parentNode.nodeName)))out.push({unde:'pagina',text:x})}
  doc.querySelectorAll('[alt]').forEach(e=>{const a=e.getAttribute('alt');if(a&&a.trim())out.push({unde:'alt',text:a.trim()})});
  doc.querySelectorAll('*').forEach(e=>[...e.attributes].forEach(a=>{
    if(['alt','charset','lang','href','src','style'].includes(a.name.toLowerCase()))return;
    if(a.value&&a.value.trim())out.push({unde:'atribut',text:a.value.trim()});
  }));
  /* și src/href (numele fișierelor pot avea date: „Ana_Popescu_acasa.jpg”), marcate fisier:true */
  doc.querySelectorAll('[src],[href]').forEach(e=>['src','href'].forEach(k=>{const v=e.getAttribute(k);if(v&&v.trim())out.push({unde:'atribut',text:v.trim(),fisier:true})}));
  out.forEach(o=>{o.rand=randul(s,o.text)});
  return out;
}
function textPagina(src){return locuri(src).filter(o=>o.unde==='pagina').map(o=>o.text).join(' ')}
function gaseste(src,opt){
  opt=opt||{};
  const nume=(opt.nume||[]).filter(Boolean),texte=opt.texte||[];
  /* tipurile căutate: cele cerute (sau toate) + numele și frazele exercițiului, dacă sunt date */
  const tipuri=(opt.tipuri||Object.keys(TIPURI)).concat(nume.length?['nume']:[]).concat(texte.map(x=>x.tip));
  const out=[],vazut=new Set();
  const pune=(tip,eticheta,text,o)=>{const k=tip+'|'+o.unde+'|'+(o.fisier?'f|':'')+norm(text);if(vazut.has(k))return;vazut.add(k);
    const r={tip,eticheta,text,unde:o.unde,rand:randul(src,text)||o.rand};if(o.fisier)r.fisier=true;out.push(r)};
  for(const o of locuri(src)){
    if(o.fisier&&opt.fisiere===false)continue;
    const n=norm(o.text);
    for(const tip of tipuri){
      const T=TIPURI[tip];
      if(!T)continue;
      if(T.orig){const m=o.text.replace(/\s+/g,' ').match(T.re);if(m)pune(tip,T.eticheta,m[0].replace(/^[^\p{L}]/u,'').trim(),o);continue}
      /* norm păstrează lungimea doar fără diacritice combinate; textul arătat = bucata din original de la aceeași poziție */
      const m=n.match(T.re);if(m)pune(tip,T.eticheta,o.text.replace(/\s+/g,' ').trim().substr(m.index,m[0].length)||m[0],o);
    }
    if(tipuri.includes('nume'))for(const nm of nume){const re=new RegExp('(?:^|[^a-z0-9])'+norm(nm).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![a-z0-9])');const m=n.match(re);if(m){const i=m.index+(m[0].length-norm(nm).length);pune('nume','un nume de familie („'+esc(nm)+'”)',o.fisier?o.text:(o.text.replace(/\s+/g,' ').trim().substr(i,norm(nm).length)||nm),o)}}
    for(const x of texte)if(n.includes(norm(x.text)))pune(x.tip,x.eticheta||'o informație care nu se publică',x.text,o);
  }
  return out;
}
const are=(src,tip,opt)=>gaseste(src,Object.assign({},opt,{tipuri:[tip]})).some(d=>d.tip===tip);
const curat=(src,opt)=>gaseste(src,opt).length===0;
function contine(src,text,unde){
  if(!unde)return norm(lin(src)).includes(norm(text));
  return locuri(src).some(o=>o.unde===unde&&norm(o.text).includes(norm(text)));
}
function mesaj(src,opt){
  const g=gaseste(src,opt);if(!g.length)return '';
  const d=g[0],rest=g.length-1;
  const unde=d.fisier?UNDE_FISIER:(UNDE[d.unde]||'în cod');
  return `A rămas ${d.eticheta}: <code>${esc(d.text)}</code>, ${unde}${d.rand?`, pe rândul ${d.rand} din Notepad`:''}.`+
    (d.unde==='pagina'?' Șterge-l sau înlocuiește-l cu ce se poate publica.':' În pagină nu se vede, dar e în cod: oricine îl citește cu <kbd>Ctrl</kbd>+<kbd>U</kbd>.')+
    (rest>0?(rest===1?' Mai e încă un lucru de verificat.':` Mai sunt încă ${rest} lucruri de verificat.`):'');
}
/* ce caută mesajul unui test: DOAR ce numește `date` (nume → doar numele; texte → doar frazele; tipuri → doar tipurile) */
function optTest(date){
  const t=(date.tipuri||[]).slice();
  if(!date.tipuri&&!(date.nume&&date.nume.length)&&!(date.texte&&date.texte.length))return date;
  return Object.assign({},date,{tipuri:t});
}
/* întâi starea (a schelet-ului / a conținutului), apoi data rămasă — doar la testele cu `date` */
function cuDiagnostic(teste,opt){
  opt=opt||{};
  const baza=(window.EditorWebContinut&&window.EditorWebContinut.cuDiagnostic)||(ES&&ES.cuDiagnostic);
  const T=baza?baza(teste,opt):teste;
  return T.map((o,i)=>{
    const c=(teste||[])[i];
    if(!c||!c.date||c.neatins||c.faraDiagnostic)return o;
    let d='';
    const fn0=o.fn,od=optTest(c.date);
    const r={ce:o.ce,fn(S,U2){
      const ok=fn0?!!fn0(S,U2):U2.test(S,c);
      if(ok){d='';return true}
      /* starea (nesalvat, fila colegului, F5 în Notepad) și greșelile de scris ale schelet-ului au întâietate:
         testele citesc fișierul SALVAT, iar o etichetă stricată se repară întâi */
      const stare=ES?ES.diagnostic(S,U2,opt):'';
      if(stare){d=stare;return false}
      const s=ES?ES.src(S,U2,opt.spec):(S.live?S.live.text:'');
      d=s?mesaj(s,od):'';
      return false;
    }};
    Object.defineProperty(r,'msg',{enumerable:true,get(){return d||o.msg||c.msg||''}});
    return r;
  });
}
function randare(cod,inaltime){
  const doc=U.previewDoc(cod);
  return `<div class="ewv-randare"><div class="ewv-eticheta">Așa desenează browserul tău codul de mai sus:</div><iframe sandbox="" tabindex="-1" title="Pagina desenată de browser din codul de mai sus" style="height:${+inaltime||120}px" srcdoc="${esc(doc)}"></iframe></div>`;
}
const STIL=`.ewv-randare{margin:.4em 0 .7em;border:1px solid var(--line,#ccd4e2);border-radius:6px;overflow:hidden;background:#fff}
.ewv-eticheta{font-size:.78rem;color:var(--ink2,#4e5a6e);background:var(--paper2,#eef2f8);padding:3px 10px;border-bottom:1px solid var(--line,#ccd4e2)}
.ewv-randare iframe{display:block;width:100%;border:0;background:#fff}`;
function css(){if(!document.getElementById('editorweb-verificare-css')){const s=document.createElement('style');s.id='editorweb-verificare-css';s.textContent=STIL;document.head.appendChild(s)}}
if(document.head)css();else document.addEventListener('DOMContentLoaded',css);

window.EditorWebVerificare={TIPURI,locuri,gaseste,are,curat,contine,textPagina,mesaj,cuDiagnostic,randare,norm};
})();
