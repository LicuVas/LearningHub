/* editorweb-schelet.js — extensie pentru simulatorul editorweb.js (proprietar editorweb: lecția VIII/14).
   Proprietar acestei extensii: lecția VIII/15 („Elemente de structură: antet, titlu, corp”). Se încarcă DUPĂ editorweb.js.
   NU schimbă editorweb.js; adaugă patru lucruri, toate probate pe aplicațiile reale (lectii/viii/m2-l15/_proba/):

   1. Tasta Tab în zona de scris a Notepad-ului simulat scrie un caracter TAB, ca Notepad 11 (probat: Tab = caracterul 09,
      lățime 8 coloane = tab-size implicit al zonei de scris; cu o selecție, Tab o ÎNLOCUIEȘTE cu un TAB — Notepad nu
      indentează blocul). Ca să nu fie o capcană de tastatură: Esc, apoi Tab iese din zona de scris. Steagul „Esc” se
      șterge la orice altă tastă, la atingere/clic în zona de scris și la întoarcerea focusului în ea (Reparare 1: după
      Esc + clic înapoi, primul Tab se pierdea). Shift+Tab rămâne al browserului (în Notepad n-a putut fi probat).
      Enter nu indentează singur — nici Notepad (probat).
   2. Banda „browserul ar ghici”: când pagina desenată în browserul simulat NU are <meta charset> (sau îl are cu o
      codificare pe care browserul n-o cunoaște, de exemplu „ütf-8” scris pe tastatura Statele Unite – Internațional)
      și are litere ca ă, î, ș, ț, se spune pe ecran că browserul adevărat ghicește codificarea și poate greși (probat în
      Edge 154 și Chrome 154: „Școala mea” fără meta sau cu o codificare necunoscută (de exemplu utf-9) iese „Č□coala mea”;
      rândul cu ü (charset=ütf-8") e greșit; literele pot ieși corecte, pentru că browserul ghicește (probat); alte pagini ies bine).
      Simulatorul desenează pagina dintr-un text deja citit, deci literele ies mereu corect: abaterea e spusă, nu ascunsă
      (jocuri/README.md §1).
   3. window.EditorWebSchelet — verificări pe TEXTUL fișierului (nu pe pagina desenată, pe care browserul o „repară”),
      pentru teste `fn:(S,U)=>…` în configurația lecției. metaUtf8 primește și „utf8” (eticheta e acceptată de Edge/Chrome).
   4. EditorWebSchelet.cuDiagnostic(teste, {spec, coleg}) — aceleași teste, dar mesajul testului care pică spune greșeala
      FĂCUTĂ, când o recunoaște: schimbări nesalvate (testele citesc fișierul salvat), scris în fila colegului, ü în loc
      de "u (tastatura Internațională), </title fără >, <title> în loc de </title>. Altfel rămâne mesajul testului.
      Se folosesc doar condițiile documentate ale editorweb.js (fn, util.test, util.fisierElev). */
(function(){
'use strict';
const STIL=`.ew-cs{font-size:12px;line-height:1.35;color:#5c4400;padding:5px 10px;background:#fff4cc;border-bottom:1px solid #e8d48a}
.ew-cs code{font-size:11px}
.ew-tabnota{margin:0;font-size:.82rem;color:var(--ink2)}`;
function css(){if(!document.getElementById('editorweb-schelet-css')){const s=document.createElement('style');s.id='editorweb-schelet-css';s.textContent=STIL;document.head.appendChild(s)}}
const tactil=()=>window.matchMedia&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:760px)').matches);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ---------- 1. Tab = caracterul TAB (ca Notepad); Esc + Tab = ieșire ---------- */
const eZona=t=>!!(t&&t.matches&&t.matches('.ew .np-ta'));
document.addEventListener('keydown',e=>{
  const t=e.target;
  if(!eZona(t))return;
  if(e.key==='Escape'){t._ewIese=true;return}
  if(e.key!=='Tab'||e.shiftKey||e.ctrlKey||e.altKey||e.metaKey){if(e.key!=='Shift')t._ewIese=false;return}
  if(t._ewIese){t._ewIese=false;return}          /* Esc, apoi Tab: lasă focusul să plece */
  e.preventDefault();
  let ok=false;
  try{ok=document.execCommand('insertText',false,'\t')}catch(x){ok=false}
  if(!ok){const a=t.selectionStart,b=t.selectionEnd;t.setRangeText('\t',a,b,'end');t.dispatchEvent(new Event('input',{bubbles:true}))}
},true);
/* elevul s-a întors în zona de scris (clic, atingere sau focus): Tab scrie din nou un TAB */
const reiaTab=e=>{if(eZona(e.target))e.target._ewIese=false};
document.addEventListener('pointerdown',reiaTab,true);
document.addEventListener('focusin',reiaTab,true);

/* ---------- 2. banda „browserul ar ghici codificarea” ---------- */
const NEASCII=/[^\x00-\x7F]/;
function verificaBrowsere(){
  document.querySelectorAll('.ew section[data-w="browser"]').forEach(sec=>{
    const fr=sec.querySelector('.br-corp iframe');
    let html='';
    if(fr){
      const src=fr.getAttribute('srcdoc')||'';
      const doc=new DOMParser().parseFromString(src,'text/html');
      const txt=(doc.title||'')+' '+(doc.body?doc.body.textContent:'');
      if(NEASCII.test(txt)){
        const m=doc.querySelector('meta[charset]'),v=m?(m.getAttribute('charset')||'').trim():null;
        if(!m)html='Pagina nu are <code>&lt;meta charset="utf-8"&gt;</code>. Pe calculator, browserul ar <b>ghici</b> codificarea, iar ă, î, ș, ț pot ieși stricate. Aici, în simulator, literele apar mereu corect.';
        else if(NEASCII.test(v)||!v)html=`Rândul meta are o codificare scrisă greșit (<code>${esc(v)}</code>), pe care browserul n-o cunoaște: o ignoră și <b>ghicește</b>, iar ă, î, ș, ț pot ieși stricate. Aici, în simulator, literele apar mereu corect.`;
      }
    }
    let b=sec.querySelector(':scope > .ew-cs');
    if(html){
      if(!b){b=document.createElement('div');b.className='ew-cs';b.setAttribute('role','note');const corp=sec.querySelector('.br-corp');sec.insertBefore(b,corp)}
      if(b.innerHTML!==html)b.innerHTML=html;
    }else if(b)b.remove();
  });
  document.querySelectorAll('.ew').forEach(ew=>{
    if(!ew.querySelector('.np-ta')||ew.querySelector(':scope > .ew-tabnota'))return;
    const p=document.createElement('p');p.className='ew-tabnota';
    p.innerHTML=tactil()?'Pe telefon nu ai tasta Tab: ca să muți un rând la dreapta, pune la începutul lui două spații.':
      'Tasta <kbd>Tab</kbd> mută rândul la dreapta, ca în Notepad. Ca să ieși din zona de scris doar cu tastatura: <kbd>Esc</kbd>, apoi <kbd>Tab</kbd>.';
    ew.appendChild(p);
  });
}
let programat=false;
function programeaza(){if(programat)return;programat=true;requestAnimationFrame(()=>{programat=false;try{verificaBrowsere()}catch(x){}})}
function porneste(){css();verificaBrowsere();new MutationObserver(programeaza).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['srcdoc']})}
if(document.body)porneste();else document.addEventListener('DOMContentLoaded',porneste);

/* ---------- 3. verificări pe textul fișierului ---------- */
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const bloc=(src,tag)=>{const s=lin(src),a=s.search(new RegExp('<'+tag+'\\b[^>]*>','i'));if(a<0)return null;
  const r=s.slice(a),m=r.match(new RegExp('</'+tag+'\\s*>','i'));return m?r.slice(r.indexOf('>')+1,m.index):null};
const ES={
  /* textul de verificat: editorul (mod live), fișierul elevului (spec), pagina din browser ({browser:spec|true}) sau fila activă */
  src(S,U,spec){
    if(S.mod==='live')return S.live.text;
    if(spec&&spec.browser){const t=U.tabBrowser(S,spec.browser===true?null:spec.browser);return t?t.continut:null}
    if(spec){const f=U.fisierElev(S,spec);return f?f.t:null}
    const f=S.np.file[S.np.activa];return f?f.text:null;
  },
  doctypePrimul(src){const r=lin(src).split('\n').find(l=>l.trim());return !!r&&/^\s*<!doctype\s+html\s*>\s*$/i.test(r)},
  htmlLangRo(src){return /<html\s[^>]*\blang\s*=\s*(?:"ro"|'ro'|ro(?=[\s>]))/i.test(lin(src))},
  antet(src){return bloc(src,'head')},
  corp(src){return bloc(src,'body')},
  /* „utf-8” sau „utf8”: amândouă sunt etichete ale codificării UTF-8, acceptate de Edge 154 și Chrome 154 (probat) */
  metaUtf8(src){const h=bloc(src,'head');return h!=null&&/<meta\s+charset\s*=\s*(?:"utf-?8"|'utf-?8'|utf-?8(?=[\s\/>]))\s*\/?>/i.test(h)},
  titlu(src){const h=bloc(src,'head');if(h==null)return null;const m=h.match(/<title\s*>([^<]*)<\/title\s*>/i);return m?m[1].replace(/\s+/g,' ').trim():null},
  /* textul din corp așa cum îl citește un om (fără etichete) */
  textCorp(src){const b=bloc(src,'body');if(b==null)return '';return new DOMParser().parseFromString('<body>'+b+'</body>','text/html').body.textContent.replace(/\s+/g,' ').trim()},
  /* scheletul în ordinea bună: doctype, html, head, /head, body, /body, /html — și fiecare o singură dată */
  ordine(src){const s=lin(src).toLowerCase();const re=[/<!doctype\s+html\s*>/g,/<html\b[^>]*>/g,/<head\b[^>]*>/g,/<\/head\s*>/g,/<body\b[^>]*>/g,/<\/body\s*>/g,/<\/html\s*>/g];
    let ult=-1;for(const r of re){const m=s.match(r);if(!m||m.length!==1)return false;const i=s.search(r);if(i<ult)return false;ult=i}
    return !(window.EditorWebUtil&&window.EditorWebUtil.corecteaza(src).length)},
  /* indentarea: ce e între <head> și </head> (și între <body> și </body>) stă mai la dreapta decât <head> (<body>);
     </head> e sub <head>, </body> sub <body>. Tab = 8 coloane (ca Notepad), un spațiu = 1. */
  indentat(src){
    const L=lin(src).split('\n'),col=l=>{let c=0;for(const ch of l){if(ch==='\t')c=c-c%8+8;else if(ch===' ')c++;else break}return c};
    for(const tag of ['head','body']){
      const a=L.findIndex(l=>new RegExp('^\\s*<'+tag+'\\b','i').test(l)),b=L.findIndex(l=>new RegExp('^\\s*</'+tag+'\\s*>','i').test(l));
      if(a<0||b<0||b<a)return false;
      if(col(L[b])!==col(L[a]))return false;
      for(let i=a+1;i<b;i++)if(L[i].trim()&&col(L[i])<=col(L[a]))return false;
    }
    return true;
  },

  /* ---------- 4. greșeala făcută, spusă în mesaj ---------- */
  /* greșelile de scris pe care le recunoaște în text (cele probate în lecția 15), în ordinea în care le spune */
  mesajText(src){
    const s=lin(src);
    /* tastatura Statele Unite – Internațional: " e tastă moartă, iar " urmat de u dă ü (probat: ToUnicodeEx, _proba/proba_tastatura_r1.json) */
    if(/=[ \t]*[üÜ]/.test(s))return 'În rând a apărut <b>ü</b> în loc de <code>"u</code>: tastatura e „Statele Unite – Internațional”, unde după ghilimele nu apare nimic până la tasta următoare. Șterge ü și scrie din nou: ghilimelele, apoi <kbd>Spațiu</kbd>, apoi utf-8.';
    /* ghilimea de închidere uitată (<html lang="ro>, <meta charset="utf-8>): rând cu lang=/charset= și număr impar de " */
    if(s.split('\n').some(l=>/<(?:html|meta)\b[^>]*?\b(?:lang|charset)\s*=\s*["']/i.test(l)&&((l.match(/"/g)||[]).length%2||(l.match(/'/g)||[]).length%2)))return 'Pe rândul acesta <b>lipsește ghilimeaua de închidere</b>: valoarea stă între două ghilimele, ca <code>"ro"</code>. Pe tastatura Internațională, după ghilimele apasă <kbd>Spațiu</kbd>.';
    const m=s.match(/<\/(title|head|body|html|h1)\b(?!\s*>)/i);
    if(m)return `După <code>&lt;/${m[1].toLowerCase()}</code> trebuie semnul <code>&gt;</code>, care închide eticheta.`;
    if(/<title\b[^>]*>[^<\n]*<title\b[^>]*>/i.test(s))return 'A doua etichetă de pe rândul cu titlul nu închide: îi lipsește bara <code>/</code>, ca la <code>&lt;/h1&gt;</code>. De aceea pe filă apare și restul fișierului.';
    return '';
  },
  /* opt.spec: fișierul elevului citit de teste (mod notepad); opt.coleg: numele fișierelor colegilor, deschise în file */
  diagnostic(S,U,opt){
    opt=opt||{};
    if(S.mod!=='live'&&S.np&&Array.isArray(S.np.file)){
      for(const n of (opt.coleg||[]))
        if(S.np.file.some(f=>f.n===n)&&!U.test(S,{fila:{n,nemodificata:true}}))
          return 'Ai scris în fila colegului. Nu o salva: <kbd>Ctrl</kbd>+<kbd>S</kbd> ar scrie peste fișierul lui. Fă o filă nouă (<b>+</b>) și scrie acolo.';
      /* doar fila elevului, după TEXT (nu după punctul ●): o filă a colegului cu ● nu declanșează mesajul */
      const fe=opt.spec&&U.fisierElev(S,opt.spec),fl=fe&&S.np.file.find(x=>x.n===fe.n);
      if(fl&&lin(fl.text)!==lin(fe.t))
        return 'Testele citesc fișierul <b>salvat</b>, iar pe filă e punctul ● (schimbări nesalvate). Apasă <kbd>Ctrl</kbd>+<kbd>S</kbd> în Notepad, apoi <kbd>F5</kbd> în browser.';
    }
    const s=ES.src(S,U,opt.spec);
    return s?ES.mesajText(s):'';
  },
  /* aceleași teste, cu mesajul greșelii făcute; un test cu `neatins` sau `faraDiagnostic:true` rămâne neschimbat */
  cuDiagnostic(teste,opt){
    return (teste||[]).map(c=>{
      if(!c||c.neatins||c.faraDiagnostic)return c;
      let d='';
      const o={ce:c.ce,fn(S,U){const ok=typeof c.fn==='function'?!!c.fn(S,U):U.test(S,c);d=ok?'':ES.diagnostic(S,U,opt);return ok}};
      Object.defineProperty(o,'msg',{enumerable:true,get(){return d||c.msg||''}});
      return o;
    });
  }
};
window.EditorWebSchelet=ES;
})();
