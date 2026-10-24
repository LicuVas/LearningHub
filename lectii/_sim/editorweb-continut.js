/* editorweb-continut.js — extensie pentru simulatorul editorweb.js (proprietar editorweb: lecția VIII/14; extensia
   editorweb-schelet.js: lecția VIII/15). Proprietarul ACESTEI extensii: lecția VIII/16 („Conținutul paginii: paragrafe
   și imagini”, 19.10.2026). Se încarcă DUPĂ editorweb.js și editorweb-schelet.js. NU schimbă fișierele lor.

   Ce adaugă (faptele probate în Chromium 1xx headless, motorul lui Edge și Chrome, pe fișiere locale scrise ca de Notepad:
   lectii/viii/m3-l16/_proba/proba_browser_l16.json):
   1. FIȘIERE-IMAGINE în dosarele simulatorului. În `start.fisiere` (mod notepad SAU live) un fișier
        {n:'bucura.jpg', imagine:'bucura'}
      e o imagine; `imagine` e cheia unei surse înregistrate cu  EditorWebContinut.inregistreaza('bucura', {uri:'data:…',
      latimeReala:640, inaltimeReala:480}). Explorer o arată ca orice fișier (numele fără extensie, Tip „Fișier JPG”, ca în
      setarea de la început a Windows-ului). Dublu-clic pe ea NU o deschide în browser: pe Windows se deschide aplicația de
      imagini a calculatorului (pe care simulatorul n-o are) — se spune pe ecran.
   2. PAGINA SIMULATĂ ARATĂ IMAGINILE din ACELAȘI dosar cu pagina: o etichetă <img src="nume"> al cărei nume (fără spațiile
      de la capete, cu litere mari sau mici — Windows nu le deosebește, probat: src="LAC.JPG" se vede) e un fișier-imagine
      din dosar primește imaginea; altfel rămâne imagine LIPSĂ, ca în browser: pictograma de imagine ruptă + textul din alt
      (fără alt: doar pictograma; cu alt="": nimic). Probat: src fără extensie, cu .jpeg/.png în loc de .jpg, cu un dosar în
      față („imagini/lac.jpg”), cu un spațiu în nume → imagine lipsă. În modul live, pagina stă în dosarul `start.dosarPagina`
      (implicit „Documente”), iar sub zona de scris apare dosarul ei, ca în Explorer.
      Abateri (spuse aici, nu ascunse): imaginea se desenează din copia mică înregistrată (`uri`), la lățimea fișierului
      real (`latimeReala`), micșorată cât să încapă (pagina simulată are img{max-width:100%}; în browser o fotografie mai
      lată decât fereastra iese din ea). Căile absolute (C:\…, file:///…) nu sunt simulate (lecția nu le predă).
      O pagină care are <img> primește o fereastră de browser mai înaltă (clasa ewc-inalt, min-height 27em), ca fotografia
      să se vadă fără derulare în ea. Imaginea lipsă e oprită de regula paginii simulate (CSP img-src data:): Chromium o
      desenează exact ca pe un fișier lipsă (pictograma + alt) și scrie în consolă „Refused to load the image…” — mesaj al
      paginii simulate, nu o eroare a lecției.
   3. window.EditorWebContinut — verificări pe TEXTUL paginii, pentru teste `fn:(S,U)=>…`:
        imagini(src) → [{src, alt, rand}] · seVede(S,U,spec) → o imagine din pagină se vede (numele e al unui fișier-imagine
        din dosarul paginii) · toateSeVad(S,U,spec) · altBun(src) → fiecare <img> are un alt care spune ce se vede: cel puțin
        două cuvinte, nu doar numele fișierului (cu sau fără extensie) și nu doar cuvinte goale ca „poză”, „imagine”, „foto”
        (mai strict de la reparare J1, 19.10.2026; de la reparația 2: nici umpluturi ca „o poză frumoasă”, „nu știu”)
        · paragrafe(src) → textele <p> din corp · titluri(src,'h2') → textele · br(src) → câte <br> în corp ·
        dosarImagini(S,dosar) → numele fișierelor-imagine · sursa(S,U,spec) = textul citit (ca EditorWebSchelet.src).
      `spec` ca la EditorWebSchelet.src: nimic (editorul live / fila activă), {dosar,model,ext}/{exact} (fișierul elevului)
      sau {browser:spec|true} (pagina afișată în browser, cu dosarul ei).
   4. EditorWebContinut.cuDiagnostic(teste, {spec, coleg}) = EditorWebSchelet.cuDiagnostic + greșelile cu imagini și rânduri,
      spuse ÎNAINTEA mesajelor lecției 15: litere ca ü, ä apărute după ghilimele (tastatura Statele Unite – Internațional),
      ghilimea lipsă pe rândul <img>, </img>, </br>, „srs”/„scr” în loc de src, numele din src fără extensie / cu altă
      extensie / cu dosar în față / care nu e în dosar. Altfel rămâne mesajul lecției 15 sau al testului.
   5. EditorWebContinut.tip — tipul pentru motor: tipuri:{editorweb:EditorWebContinut.tip}. Face exact ce face EditorWeb
      (render, rezolva, gresit), plus pregătirea fișierelor-imagine.
   Pentru lecțiile 17-19: se încarcă împreună cu extensia voastră; nu atinge `teste` și nici clasele CSS ale celorlalte
   extensii. Ce n-aveți voie să schimbați: forma `{n, imagine}` și numele funcțiilor de mai sus. */
(function(){
'use strict';
const U=window.EditorWebUtil,ES=window.EditorWebSchelet;
if(!U||!window.EditorWeb){console.error('editorweb-continut.js: se încarcă după editorweb.js');return}
const SURSE={};
const EXT_IMG={jpg:'jpeg',jpeg:'jpeg',png:'png',gif:'gif',webp:'webp',bmp:'bmp'};
const ext=n=>{const i=String(n).lastIndexOf('.');return i>0?String(n).slice(i+1).toLowerCase():''};
/* conținutul „text” al unui fișier-imagine: începutul unui JPEG/PNG, cum l-ar arăta Notepad, plus cheia sursei */
const MARCA={jpeg:'ÿØÿà JFIF ',png:'‰PNG IHDR ',gif:'GIF89a ',webp:'RIFF WEBPVP8 ',bmp:'BM '};
const marca=(n,k)=>(MARCA[EXT_IMG[ext(n)]]||'ÿØÿà JFIF ')+'#'+k;
const cheie=f=>{if(!f||typeof f.t!=='string'||!EXT_IMG[ext(f.n)])return null;const m=f.t.match(/^(?:ÿØÿà JFIF |‰PNG IHDR |GIF89a |RIFF WEBPVP8 |BM )#([\w-]+)$/);return m&&SURSE[m[1]]?m[1]:null};
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const parse=s=>new DOMParser().parseFromString(String(s||''),'text/html');
const tactil=()=>window.matchMedia&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:760px)').matches);

/* ---------- 1. pregătirea fișierelor-imagine din configurație ---------- */
function pregateste(Q){
  const st=Q&&Q.start;if(!st||!st.fisiere)return;
  Object.values(st.fisiere).forEach(l=>(l||[]).forEach(f=>{if(f&&f.imagine&&!f.t)f.t=marca(f.n,f.imagine)}));
}
function dosarImagini(S,dosar){
  return ((S&&S.fisiere&&S.fisiere[dosar])||[]).filter(f=>cheie(f)).map(f=>({n:f.n,k:cheie(f)}));
}
/* numele din src → fișierul-imagine din dosar (ca browserul pe Windows: spațiile de la capete nu contează, literele
   mari/mici nu contează; orice dosar în față înseamnă alt dosar) */
function gasesteImagine(src,lista){
  if(src==null)return null;
  let s=String(src).replace(/^[\s\u000c]+|[\s\u000c]+$/g,'');
  if(s.startsWith('./'))s=s.slice(2);
  try{s=decodeURIComponent(s)}catch(e){}
  if(/[\/\\]/.test(s)||!s)return null;
  return lista.find(f=>f.n.toLowerCase()===s.toLowerCase())||null;
}
function dosarPagina(S){return (S&&S.mod==='live')?(S.ewcDosar||'Documente'):'Documente'}

/* ---------- 2. pagina simulată, cu imaginile din dosarul ei ---------- */
function transforma(srcdoc,lista){
  const doc=parse(srcdoc);
  let schimbat=false;
  doc.querySelectorAll('img').forEach(im=>{
    const f=gasesteImagine(im.getAttribute('src'),lista);
    if(!f)return;
    const s=SURSE[f.k];
    im.setAttribute('src',s.uri);schimbat=true;
    if(!im.hasAttribute('width')&&!im.hasAttribute('height')&&s.latimeReala)im.setAttribute('width',String(s.latimeReala));
  });
  return schimbat?'<!doctype html>'+doc.documentElement.outerHTML:srcdoc;
}
function contextIframe(fr){
  const ew=fr.closest('.ew');if(!ew)return null;
  const body=ew.parentNode,E=body&&body._ew;if(!E||!E.S)return null;
  const S=E.S;
  if(S.mod==='live')return {S,text:S.live.text,dosar:dosarPagina(S)};
  if(!fr.closest('.ew-win[data-w="browser"]'))return null;
  const t=S.br.file[S.br.activa];if(!t||t.sursa)return null;
  return {S,text:t.continut,dosar:t.cale.split('/')[0]};
}
function actualizeaza(){
  document.querySelectorAll('.ew iframe').forEach(fr=>{
    const c=contextIframe(fr);if(!c)return;
    const lista=dosarImagini(c.S,c.dosar);
    const fin=transforma(U.previewDoc(c.text),lista);
    if(fr.getAttribute('srcdoc')!==fin){fr._ewcSet=fin;fr.setAttribute('srcdoc',fin)}
    /* o pagină cu imagine e mai înaltă: fereastra browserului simulat crește, ca fotografia să se vadă fără derulare în ea */
    const bc=fr.parentNode;if(bc&&bc.classList)bc.classList.toggle('ewc-inalt',/<img\b/i.test(c.text||''));
  });
  /* modul live: dosarul paginii, ca în Explorer (numele fără extensie + Tip) */
  document.querySelectorAll('.ew[data-mod="live"]').forEach(ew=>{
    const E=ew.parentNode&&ew.parentNode._ew;if(!E||!E.S)return;
    const S=E.S,d=dosarPagina(S),toate=(S.fisiere&&S.fisiere[d])||[];
    if(!toate.some(f=>cheie(f))||ew.querySelector('.ewc-dosar'))return;
    const el=document.createElement('div');el.className='ewc-dosar';el.setAttribute('role','note');
    const ascunde=n=>{const e=ext(n);return e?n.slice(0,n.length-e.length-1):n};
    const tip=n=>U.numeFinal&&EXT_IMG[ext(n)]?'Fișier '+ext(n).toUpperCase():(/\.html?$/i.test(n)?'Microsoft Edge HTML Document':'Fișier '+ext(n).toUpperCase());
    el.innerHTML=`<span class="ewc-t">Dosarul paginii, <b>${esc(d)}</b>, ca în Explorer:</span> `+
      toate.map(f=>`<span class="ewc-f"><span class="ewc-ic ${cheie(f)?'img':'pag'}" aria-hidden="true"></span>${esc(ascunde(f.n))} <span class="ewc-tip">· Tip: ${esc(tip(f.n))}</span></span>`).join(' ')+
      `<span class="ewc-n">Extensiile cunoscute nu se văd, ca în setarea de la început a Windows-ului: o afli din coloana Tip.</span>`;
    const lv=ew.querySelector('.lv');if(lv)lv.insertAdjacentElement('afterend',el);else ew.appendChild(el);
  });
  /* dublu-clic pe o imagine în Explorer: mesajul */
  document.querySelectorAll('.ew[data-mod="notepad"]').forEach(ew=>{
    const E=ew.parentNode&&ew.parentNode._ew;if(!E||!E.S||!E.S._ewcImagine)return;
    const S=E.S,n=S._ewcImagine;S._ewcImagine=null;
    S.msg=`<b>${esc(n)}</b> e o imagine (Tip: Fișier ${esc(ext(n).toUpperCase())}). La calculator, dublu-clic o deschide în aplicația de imagini, nu în browser. Pentru pagina ta nu trebuie s-o deschizi: îți trebuie doar numele ei întreg, cu extensia: <code>${esc(n)}</code>.`;
    S.msgAv=false;const m=ew.querySelector('.ew-msg');if(m){m.innerHTML=S.msg;m.classList.remove('av')}
  });
}
let programat=false;
function programeaza(){if(programat)return;programat=true;Promise.resolve().then(()=>{programat=false;try{actualizeaza()}catch(x){console.error(x)}})}
const STIL=`.ew .br-corp.ewc-inalt{min-height:27em}
.ewc-dosar{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;font-size:.85rem;color:var(--ink2);border:1px dashed var(--line);border-radius:8px;padding:6px 10px;margin-top:6px}
.ewc-f{display:inline-flex;align-items:center;gap:6px;font-family:"Segoe UI",system-ui,sans-serif;color:var(--ink)}
.ewc-tip{color:var(--ink2);font-size:.8rem}
.ewc-n{flex-basis:100%;font-size:.78rem}
.ewc-ic{display:inline-block;width:16px;height:13px;border-radius:2px;border:1px solid #6b7c93}
.ewc-ic.img{background:linear-gradient(160deg,#9cc6ef 0 45%,#5f8f4e 45% 100%)}
.ewc-ic.pag{background:#fff}`;
function porneste(){
  if(!document.getElementById('editorweb-continut-css')){const s=document.createElement('style');s.id='editorweb-continut-css';s.textContent=STIL;document.head.appendChild(s)}
  actualizeaza();
  new MutationObserver(programeaza).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['srcdoc']});
}
if(document.body)porneste();else document.addEventListener('DOMContentLoaded',porneste);

/* dublu-clic pe o imagine în Explorer: nu în browser (pe Windows se deschide aplicația de imagini) */
const deschideVechi=U.ACT.deschide;
U.ACT.deschide=function(S,cale){
  const d=cale.split('/')[0],n=cale.slice(d.length+1);
  const f=((S.fisiere&&S.fisiere[d])||[]).find(x=>x.n.toLowerCase()===n.toLowerCase());
  if(f&&cheie(f)){S._ewcImagine=f.n;return}
  return deschideVechi.call(this,S,cale);
};

/* ---------- 3. verificări pe text ---------- */
function corp(src){const d=parse(lin(src));return d.body}
/* cuvintele care nu spun ce se vede în fotografie (fără diacritice, ca după norm). Reparația 2 (19.10.2026, punctul O):
   și umpluturile — „o poză frumoasă”, „foarte frumos”, „nu știu”, „asta e o poza” treceau ca alt bun. */
const GOALE=new Set(('poza poze pozei poza mea imagine imaginea imagini imaginii foto fotografie fotografia fotografii poza img image picture pic photo jpg jpeg png gif webp bmp o un una mea meu cu de si'+
  ' frumos frumoasa frumoase frumosi frumusete foarte super superb superba tare fain faina misto minunat minunata dragut draguta'+
  ' asta acesta aceasta acela aceea aici acolo ceva nimic chestie este sunt nu stiu da ok bine'+
  ' cea cel cei cele mai wow uau waw omg lol haha ce vacanta vacantei vacante concediu excursie excursia excursiei'+
  ' fara titlu untitled nume descriere text alternativ alt captura screenshot ecran dsc dscn dcim pxl wa').split(' '));
/* Reparația 3 (19.10.2026, punctul O): rădăcinile umpluturilor, cu diminutivele („o pozică frumușică”, „pozuța”). */
const GOALE_RAD=/^(poz|frumu|frumo|fotograf|imagin|superb|minunat)/;
function altSpune(alt,src){
  const a=norm(alt),s=norm(src);
  if(a.length<3||a===s||/\.(jpe?g|png|gif|webp|bmp)$/.test(a))return false;
  if(a.split(/[\s-]+/).filter(Boolean).length<2)return false;          /* un singur cuvânt: „lac”, „bucura”, „poza”, „Popescu_Ana_bucura” („Lacul-Bucura” = două) */
  const cuv=a.split(/[^a-z0-9]+/).filter(Boolean);
  const baza=s.replace(/^.*[\/\\]/,'').replace(/\.[a-z0-9]+$/,'').split(/[^a-z0-9]+/).filter(Boolean).join(' ');
  if(baza&&cuv.join(' ')===baza)return false;                          /* numele fișierului fără extensie: „Popescu_Ana_bucura” */
  /* cel puțin un cuvânt care spune ceva; un cuvânt cu cifre nu se socotește (nume de fișier: „IMG 2034”, „DSC_0042”, „WA0003”) */
  return cuv.some(w=>w.length>=3&&/^[a-z]+$/.test(w)&&!GOALE.has(w)&&!GOALE_RAD.test(w)&&w!==baza);
}
const API={
  inregistreaza(k,s){SURSE[k]=s;programeaza()},
  surse:SURSE,
  sursa(S,U2,spec){
    if(S.mod==='live')return S.live.text;
    if(ES)return ES.src(S,U2||U,spec);
    const f=S.np.file[S.np.activa];return f?f.text:null;
  },
  dosarSpec(S,U2,spec){
    if(S.mod==='live')return dosarPagina(S);
    if(spec&&spec.browser){const t=(U2||U).tabBrowser(S,spec.browser===true?null:spec.browser);return t?t.cale.split('/')[0]:null}
    if(spec)return spec.dosar||'Documente';
    const f=S.np.file[S.np.activa];return f&&f.dosar||'Documente';
  },
  dosarImagini(S,dosar){return dosarImagini(S,dosar).map(f=>f.n)},
  imagini(src){
    const s=lin(src),out=[];const re=/<img\b[^>]*>/gi;let m;
    const dom=[...corp(s).querySelectorAll('img')];
    let i=0;while((m=re.exec(s))){const el=dom[i++];out.push({src:el?el.getAttribute('src'):null,alt:el?el.getAttribute('alt'):null,rand:s.slice(0,m.index).split('\n').length,cod:m[0]})}
    for(;i<dom.length;i++)out.push({src:dom[i].getAttribute('src'),alt:dom[i].getAttribute('alt'),rand:0,cod:''});
    return out;
  },
  /* imaginile din pagină care SE VĂD (numele din src = un fișier-imagine din dosarul paginii) */
  vazute(S,U2,spec){
    const src=API.sursa(S,U2,spec),d=API.dosarSpec(S,U2,spec);if(src==null||!d)return [];
    const lista=dosarImagini(S,d);
    return [...corp(src).querySelectorAll('img')].filter(im=>gasesteImagine(im.getAttribute('src'),lista)).map(im=>({src:im.getAttribute('src'),alt:im.getAttribute('alt')}));
  },
  seVede(S,U2,spec){return API.vazute(S,U2,spec).length>0},
  toateSeVad(S,U2,spec){const src=API.sursa(S,U2,spec);if(src==null)return false;const n=corp(src).querySelectorAll('img').length;return n>0&&API.vazute(S,U2,spec).length===n},
  /* alt care spune ce se vede: câteva cuvinte (cel puțin două), nu doar numele fișierului și nu doar cuvinte goale
     („poză”, „imagine”, „foto”…). Reparare J1 (19.10.2026, opus J1-m1 + sonnet M-1): „poză”, „imagine”, „foto”, „bucura”,
     „lac” erau primite, deși pasul învață că „poză” e slab. */
  altBun(src){const l=[...corp(src).querySelectorAll('img')];return l.length>0&&l.every(im=>altSpune(im.getAttribute('alt'),im.getAttribute('src')))},
  paragrafe(src){return [...corp(src).querySelectorAll('p')].map(p=>p.textContent.replace(/\s+/g,' ').trim()).filter(Boolean)},
  titluri(src,tag){return [...corp(src).querySelectorAll(tag||'h2')].map(h=>h.textContent.replace(/\s+/g,' ').trim())},
  br(src){return corp(src).querySelectorAll('br').length},
  /* ordinea elementelor din corp, ca text scurt: „h1:Excursia|h2:Drumul|p:…|img:bucura.jpg” (pentru teste de mutare) */
  ordine(src){return [...corp(src).querySelectorAll('h1,h2,h3,h4,h5,h6,p,img')].map(e=>e.tagName.toLowerCase()+':'+(e.tagName==='IMG'?(e.getAttribute('src')||''):e.textContent.replace(/\s+/g,' ').trim()))},

  /* ---------- 4. greșeala făcută, spusă în mesaj ---------- */
  mesajText(src,lista){
    const s=lin(src);
    /* eticheta <img> întreagă, chiar dacă atributele ei sunt pe două rânduri */
    const etichete=s.match(/<img\b[^>]*>?/gi)||[];
    const scurt=t=>esc(t.replace(/\s+/g,' ').trim().slice(0,70));
    /* tastatura Statele Unite – Internațional: " + vocală = ä ë ï ö ü (probat la lecția 15 cu ToUnicodeEx: "+u = ü) */
    const um=etichete.find(l=>/[äëïöüÿÄËÏÖÜŸ]/.test(l));
    if(um)return `În eticheta <code>${scurt(um)}</code> au apărut litere ca <b>ü</b>, <b>ä</b>: tastatura e „Statele Unite – Internațional”, unde ghilimelele urmate de o vocală dau o literă cu două puncte. Șterge-le și scrie din nou: ghilimelele, apoi <kbd>Spațiu</kbd>, apoi textul.`;
    const gh=etichete.find(l=>(l.match(/"/g)||[]).length%2);
    if(gh)return `În eticheta <code>${scurt(gh)}</code> lipsește o ghilimea: fiecare valoare stă între două ghilimele, <code>src="…"</code> și <code>alt="…"</code>.`;
    if(/<\/img\s*>/i.test(s))return '<code>&lt;img&gt;</code> nu are închidere: șterge <code>&lt;/img&gt;</code>.';
    if(/<\/br\s*>/i.test(s))return '<code>&lt;br&gt;</code> nu are închidere: șterge <code>&lt;/br&gt;</code>. Browserul l-ar lua drept încă un <code>&lt;br&gt;</code>.';
    if(/<img\b[^>]*\b(?:srs|scr|sr)\s*=/i.test(s)&&!/<img\b[^>]*\bsrc\s*=/i.test(s))return 'Atributul care spune fișierul imaginii se scrie <code>src</code> (de la „source”, sursa).';
    if(lista){
      const imgs=[...corp(s).querySelectorAll('img')];
      for(const im of imgs){
        const v=im.getAttribute('src');if(v==null)continue;
        if(gasesteImagine(v,lista))continue;
        let t=String(v).trim();
        const nume=t.split(/[\/\\]/).pop();
        const f=lista.find(x=>x.n.toLowerCase()===nume.toLowerCase());
        if(f&&/[\/\\]/.test(t))return `În <code>src="${esc(v)}"</code> e și un dosar. Fotografia stă în același dosar cu pagina: scrii doar numele ei, <code>src="${esc(f.n)}"</code>.`;
        const baza=n=>{const e=ext(n);return e&&EXT_IMG[e]?n.slice(0,n.length-e.length-1):n};
        const g=lista.find(x=>baza(x.n).toLowerCase()===baza(nume).toLowerCase());
        if(g&&!ext(nume))return `În <code>src="${esc(v)}"</code> lipsește extensia. În Explorer extensia nu se vede: la Tip scrie <b>Fișier ${esc(ext(g.n).toUpperCase())}</b>, deci numele întreg e <code>${esc(g.n)}</code>.`;
        if(g)return `Fișierul din dosar se termină cu <b>.${esc(ext(g.n))}</b> (la Tip: Fișier ${esc(ext(g.n).toUpperCase())}), nu cu .${esc(ext(nume))}: scrie <code>${esc(g.n)}</code>.`;
        return `În dosarul paginii nu e niciun fișier <code>${esc(v)}</code>: de aceea browserul arată pictograma de imagine lipsă${im.getAttribute('alt')?' și textul din alt':''}. Uită-te în Explorer la numele fotografiei și scrie-l exact, cu extensia.`;
      }
    }
    return '';
  },
  /* aceleași teste ca EditorWebSchelet.cuDiagnostic, cu greșelile de mai sus spuse întâi */
  cuDiagnostic(teste,opt){
    opt=opt||{};
    const baza=ES?ES.cuDiagnostic(teste,opt):(teste||[]);
    return baza.map((o,i)=>{
      const c=(teste||[])[i];
      if(!o||!c||c.neatins||c.faraDiagnostic)return o;
      let d='';
      const n={ce:o.ce,fn(S,U2){
        const ok=typeof o.fn==='function'?!!o.fn(S,U2):(U2||U).test(S,o);
        d='';
        if(!ok){const sp=c.fisier||(c.browser?{browser:c.browser.fisier||true}:null)||opt.spec,src=API.sursa(S,U2,sp);
          if(src)d=API.mesajText(src,dosarImagini(S,API.dosarSpec(S,U2,sp)||'Documente'))}
        return ok}};
      Object.defineProperty(n,'msg',{enumerable:true,get(){return d||o.msg||''}});
      return n;
    });
  }
};

/* ---------- 5. tipul pentru motor ---------- */
const EW=window.EditorWeb;
API.tip={
  render(Q,body,api){pregateste(Q);const r=EW.render(Q,body,api);if(body._ew&&body._ew.S&&Q.start&&Q.start.dosarPagina)body._ew.S.ewcDosar=Q.start.dosarPagina;programeaza();return r},
  rezolva(Q,body,api){pregateste(Q);const r=EW.rezolva(Q,body,api);programeaza();return r},
  gresit(Q,body,api){pregateste(Q);const r=EW.gresit(Q,body,api);programeaza();return r}
};
window.EditorWebContinut=API;
})();
