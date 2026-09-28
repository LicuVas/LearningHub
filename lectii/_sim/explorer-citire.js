/* Simulatorul „explorer-citire” pentru lecțiile LearningHub — fișier comun (lectii/_sim/explorer-citire.js).
   PROPRIETAR: autorul lecției V · M2 · nr. 9 („Organizarea datelor pe suport extern: fișiere și directoare”), 28.09.2026.
   Extensie NOUĂ (nu modifică niciun simulator existent). Pornit din ideea simulatorului „explorer” din jocuri/fisiere-v,
   dar DOAR PENTRU CITIT: nu creează, nu mută, nu șterge nimic (operațiile sunt lecția 10).

   Folosire în pagină (după motor.js):
     <script src="../../_sim/explorer-citire.js"></script>
     JocMotor.porneste({ …, tipuri:{explorer:SimExplorerCitire, cale:TipCale} })
   Stilul se pune singur în pagină, o singură dată; folosește jetoanele motorului (--line, --accent, --sel, --paper…).

   ce e ADEVĂRAT aici (probat pe Windows 11 25H2 în română, 28.09.2026; dovezile în lectii/v/m2-l09/_proba/):
   - bara de adresă are două fețe: bara cu butoane („Acest PC › Disc local (C:) › Scoala”) și, după un CLIC pe partea ei goală
     (sau Ctrl+L), caseta cu CALEA scrisă cu \, toată selectată; Esc întoarce bara cu butoane (sonda_adresa5);
   - un folder „cunoscut” (Documente) apare în bara cu butoane DOAR ca „Documente”, iar în casetă tot „Documente”;
     un folder din el: „Documente › TIC” și, în casetă, C:\Users\<nume>\Documents\TIC — cu numele ENGLEZESC (nume_bara_adresa.json);
   - C:\Users se vede „Utilizatori”, iar C:\Program Files „Fișiere program”, dar în cale rămân Users / Program Files (sonda_windows.json);
   - săgeata ↑ din Documente și din Acest PC duce la Desktop (butonul se numește „Până la "Desktop" (Alt + săgeată în sus)”,
     sonda_adresa4; judecătorul, J07): în atelier NU mergem acolo, iar pagina o spune;
   - tastele din lista Microsoft „File Explorer keyboard shortcuts”: Ctrl+L / Alt+D / F4 = caseta de adresă; Alt+← / Backspace = înapoi;
     Alt+→ = înainte; Alt+↑ = sus; Enter = deschide; Home / End = primul / ultimul element. Delete, Ctrl+D, Shift+Delete, F2,
     Ctrl+Shift+N, Ctrl+C/X/V, Shift+F10, Alt+Enter, F3, Ctrl+E/F: pagina spune ce ar face pe calculator (lecția 10);
   - vederea Detalii are coloanele Nume, Data modificării, Tip, Dimensiune (registry FolderTypes + sonda); Dimensiune e în KB
     („3.850 KB”, „245 KB”, sonda_dimensiune); folderele au Tip „Folder de fișiere”; data „12.11.2026 10:15”;
   - implicit, Windows ASCUNDE extensiile (HKLM …\Advanced\Folder\HideFileExt: DefaultValue=1) — Q.extensii:false;
   - Tip-ul unui fișier depinde de programele instalate; aici e forma generală „Fișier PNG”, „Fișier MP3” (văzută la MP3, BMP, TXT)
     și „Microsoft Word Document” (Office în engleză).
   ABATERI de la Explorer, spuse elevului pe ecran (rândul de sub fereastră și mesajele din bara de jos):
   - e un Explorer mic: mai puține foldere și fișiere; în unele foldere (Windows, Fișiere program…) nu intrăm;
   - în caseta de adresă doar citești (în Windows poți scrie acolo o cale, și cu / între părți: „C:/Users/Public” + Enter merge — J01);
   - pe telefon, numele din bara cu butoane se strâng cu „…”, ca partea goală să păstreze 44 px de atins (J02);
   - fișierele nu se deschid, clic dreapta și căutarea nu fac nimic (lecția 10), ordinea din listă nu se schimbă;
   - pe telefon se ascund coloanele Data modificării și Dimensiune (nu încap).

   TIPUL explorer — Q:
     fs:[cale | [cale, 'dd.mm.yyyy hh:mm', 'N KB']]   căile interne cu /: 'E:/Scoala/TIC/afis.png'; folderele se termină cu '/'
     unitati:{'C:':{nume:'Disc local', liber:'198 GB liber din 475 GB', ocupat:58}, 'E:':{…}}
     doc?:'C:/Users/Ana/Documents/'     folderul Documente (se vede „Documente”, în cale „Documents”)
     afisat?:{'C:/Users/':'Utilizatori', …}    numele afișate altfel decât în cale (se adaugă la cele implicite)
     blocat?:['C:/Windows/', …]         foldere în care atelierul nu intră (mesaj)
     start?:'PC' | cale                  unde pornește (implicit 'PC' = Acest PC)
     extensii?:false|true                se văd extensiile? (implicit false, ca în Windows)
     raspuns?:{eticheta, ok:'E:\\Scoala\\TIC\\afis.png'}   caseta în care elevul scrie o cale
     checks:[{in:cale, ce} | {sel:'afis.png', ce} | {cale:true, ce} | {vazut:cale, ce}]   testele numite (se bifează singure)
     solutie:[['cd',cale],['sel','nume.ext'],['vezi',cale],['scrie','text']]   pentru „Arată-mi răspunsul” și poartă
     gresit?:[…aceleași operații…]      o greșeală tipică de copil (poarta verifică respingerea)
   TIPUL cale — Q: {q, ok:'E:\\Scoala\\Muzica\\colind.mp3', eticheta?, tipic?:'răspunsul greșit tipic pentru poartă'}
   Verificarea căii scrise (ambele tipuri): literele mari/mici nu contează (nici Windows nu le deosebește), o bară \ la sfârșit
   nu contează; „/” în loc de „\” NU trece la NOTARE, cu motivul adevărat: Windows SCRIE calea cu \ (bara de adresă, după clic);
   bara de adresă ar înțelege și „/” (judecătorul, J01), dar lecția cere calea așa cum o arată Windows. Spațiul lângă \ nu trece
   („C:\ Windows” nu există). Mesajele spun exact ce lipsește (extensia, Documents în loc de Documente, litera unității…). */
(function(){
'use strict';
const CSS=`
.exc-cum{margin:0 0 8px;font-size:.88rem;color:var(--ink2)}
.exc{position:relative;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font-size:.86rem;overflow:hidden;outline:none}
.exc:focus-visible{box-shadow:0 0 0 3px var(--sel)}
.exc-tit{display:flex;align-items:center;gap:7px;padding:5px 10px;background:var(--paper2);border-bottom:1px solid var(--line);font-size:.8rem;color:var(--ink2)}
.exc-tit b{color:var(--ink);font-weight:600}
.exc-adr{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:6px;border-bottom:1px solid var(--line)}
.exc-nav3{display:flex;gap:2px}
.exc-nav3 button{min-width:34px;min-height:34px;font:inherit;font-size:1.05rem;line-height:1;border:1px solid transparent;border-radius:6px;background:none;color:var(--ink);cursor:pointer}
.exc-nav3 button:hover:not(:disabled){background:var(--paper2);border-color:var(--line)}
.exc-nav3 button:disabled{opacity:.35;cursor:default}
.exc-bara{flex:1 1 220px;min-width:0;min-height:38px;display:flex;align-items:center;gap:1px;border:1px solid var(--line);border-radius:5px;padding:0 4px;background:var(--paper);cursor:text;overflow:hidden}
.exc-bara .seg{flex:0 1 auto;min-width:32px;min-height:32px;font:inherit;font-size:.84rem;border:0;background:none;color:var(--ink);padding:2px 5px;border-radius:4px;cursor:pointer;white-space:nowrap;max-width:170px;overflow:hidden;text-overflow:ellipsis}
.exc-bara .seg:hover{background:var(--paper2)}
.exc-bara .sag{flex:none;color:var(--ink2);font-size:.9rem;padding:0 1px;user-select:none}
.exc-bara .gol{flex:1 0 44px;min-width:44px;min-height:32px;align-self:stretch}
.exc-bara>.exc-ic{flex:none}
.exc-bara .sag{flex:none}
.exc-bara .seg .st{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.exc-bara .capat{flex:none;min-width:32px;min-height:32px;font:inherit;font-size:.9rem;border:0;background:none;color:var(--ink2);cursor:pointer;border-radius:4px}
.exc-bara .capat:hover{background:var(--paper2)}
.exc-edit{flex:1 1 220px;min-width:0;min-height:34px;font:inherit;font-family:var(--fm);font-size:.84rem;border:1.5px solid var(--accent);border-radius:5px;padding:2px 8px;background:var(--paper);color:var(--ink)}
.exc-edit::selection{background:#0067C0;color:#fff}
.exc-caut{flex:1 1 120px;min-width:0;min-height:34px;font:inherit;font-size:.82rem;border:1px solid var(--line);border-radius:5px;padding:2px 8px;background:var(--paper2);color:var(--ink2)}
.exc-corp{display:grid;grid-template-columns:minmax(0,34%) minmax(0,1fr);min-height:200px}
.exc-arb{border-right:1px solid var(--line);padding:4px 2px;overflow:auto;background:var(--paper2);max-height:300px}
.exc-arb .r{display:flex;align-items:center;min-height:32px}
.exc-arb .chev{flex:none;width:32px;min-height:32px;border:0;background:none;color:var(--ink2);font:inherit;font-size:.8rem;cursor:pointer;border-radius:4px}
.exc-arb .chev.nimic{visibility:hidden}
.exc-arb .nm{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:6px;min-height:32px;font:inherit;font-size:.82rem;text-align:left;border:0;background:none;color:var(--ink);cursor:pointer;border-radius:4px;padding:0 4px;white-space:nowrap;overflow:hidden}
.exc-arb .nm span.t{overflow:hidden;text-overflow:ellipsis}
.exc-arb .nm.on{background:var(--sel)}
.exc-arb .sep{border-top:1px solid var(--line);margin:4px 6px}
.exc-lista{min-width:0;overflow:auto;max-height:300px;padding:2px 4px}
.exc-cap,.exc-rand{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1.15fr) minmax(0,1.2fr) minmax(0,.7fr);gap:8px;align-items:center}
.exc-cap{padding:4px 6px;font-size:.74rem;color:var(--ink2);border-bottom:1px solid var(--line)}
.exc-rand{width:100%;min-height:34px;text-align:left;font:inherit;font-size:.84rem;padding:3px 6px;border:1px solid transparent;border-radius:4px;background:none;color:var(--ink);cursor:default;user-select:none;-webkit-user-select:none}
.exc-rand:hover{background:var(--paper2)}
.exc-rand.on{background:var(--sel);border-color:var(--accent)}
.exc-rand .n{display:flex;align-items:center;gap:7px;min-width:0}
.exc-rand .n span.t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.exc-rand .d,.exc-rand .p,.exc-rand .z{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink2);font-size:.8rem}
.exc-rand .z{text-align:right}
.exc-cap .z{text-align:right}
.exc-grup{padding:6px 6px 2px;font-size:.78rem;font-weight:700;color:var(--ink2)}
.exc-unit{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;align-items:center;width:100%;text-align:left;font:inherit;padding:6px 8px;margin:2px 0;border:1px solid transparent;border-radius:6px;background:none;color:var(--ink);cursor:default;user-select:none;-webkit-user-select:none}
.exc-unit:hover{background:var(--paper2)}
.exc-unit.on{background:var(--sel);border-color:var(--accent)}
.exc-unit .ic-mare{grid-row:span 3}
.exc-unit .bar{height:8px;border:1px solid var(--line);background:var(--paper2);border-radius:2px;overflow:hidden;max-width:220px}
.exc-unit .bar i{display:block;height:100%;background:#26A0DA}
.exc-unit small{color:var(--ink2);font-size:.78rem}
.exc-stare{padding:6px 10px;border-top:1px solid var(--line);background:var(--paper2);font-size:.82rem;color:var(--ink2);min-height:1.9em}
.exc-stare.av{color:var(--ink);font-weight:600}
.exc-mic{margin:6px 0 0;font-size:.8rem;color:var(--ink2)}
.exc-tel{display:none}
.exc-rasp{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:10px 0 0}
.exc-rasp label{display:flex;flex-wrap:wrap;gap:6px;align-items:center;flex:1 1 260px;min-width:0;font-weight:600}
.exc-rasp input{flex:1 1 200px;min-width:0;min-height:36px;font-family:var(--fm);font-size:.92rem;padding:4px 8px;border:1.5px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.exc-rasp input:focus{border-color:var(--accent);outline:none}
.exc-bs{min-height:36px;min-width:44px;font-family:var(--fm);font-weight:700}
.exc-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.exc-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.exc-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.92rem}
.exc-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:700;color:var(--ink2)}
.exc-teste li.ok .s{color:var(--ok)}
/* pictogramele (desenate din CSS, ca în jocul fisiere-v; nu sunt pictogramele exacte din Windows) */
.exc-ic{flex:none;display:inline-block;position:relative;width:18px;height:14px}
.exc-ic.d{background:#F2C14E;border-radius:1px 3px 3px 3px;margin-top:2px}
.exc-ic.d::before{content:"";position:absolute;left:0;top:-3px;width:8px;height:4px;background:#E0A92E;border-radius:2px 2px 0 0}
.exc-ic.f{width:14px;height:18px;border:1.5px solid #7A8794;border-radius:2px 5px 2px 2px;background:#fff}
.exc-ic.f::after{content:"";position:absolute;left:2px;right:2px;bottom:2px;height:6px;border-radius:1px}
.exc-ic.f.img::after{height:8px;background:linear-gradient(135deg,transparent 45%,#3E9A5B 46%),linear-gradient(#8CC8F0,#8CC8F0)}
.exc-ic.f.sunet::after{content:"♪";height:auto;font:700 11px/1 system-ui;color:#C2185B;text-align:center;bottom:1px}
.exc-ic.f.film::after{height:7px;background:#5B3FA8;clip-path:polygon(0 0,100% 50%,0 100%);left:3px;right:3px}
.exc-ic.f.text::after{top:3px;bottom:3px;height:auto;background:repeating-linear-gradient(#9AA5B1 0 1.5px,transparent 1.5px 3.5px)}
.exc-ic.f.word::after{content:"W";height:auto;font:800 9px/1 system-ui;color:#fff;background:#2B579A;text-align:center;padding:1px 0;bottom:1px}
.exc-ic.pc{width:18px;height:13px;border:2px solid #4A5A6A;border-radius:2px;background:#9FD2F5;margin-bottom:3px}
.exc-ic.pc::after{content:"";position:absolute;left:4px;right:4px;bottom:-5px;height:3px;background:#4A5A6A}
.exc-ic.disc{width:18px;height:10px;border:1.5px solid #4A5A6A;border-radius:2px;background:#DDE3E8}
.exc-ic.disc::after{content:"";position:absolute;right:2px;top:3px;width:3px;height:2px;background:#3DB35E}
.exc-ic.stick{width:18px;height:9px;border:1.5px solid #4A5A6A;border-radius:1px 4px 4px 1px;background:#6C7A86;margin-left:4px}
.exc-ic.stick::before{content:"";position:absolute;left:-6px;top:1px;width:5px;height:4px;background:#C9CFCD;border:1px solid #7A8794}
.exc-ic.doc{width:14px;height:18px;border:1.5px solid #3B6FB6;border-radius:2px 5px 2px 2px;background:#E6EEF9}
.exc-ic.doc::after{content:"";position:absolute;left:2px;right:2px;top:4px;bottom:3px;background:repeating-linear-gradient(#3B6FB6 0 1.5px,transparent 1.5px 3.5px)}
.exc-ic.mare{transform:scale(1.6);margin:6px 8px}
@media (max-width:560px){
  .exc-corp{grid-template-columns:minmax(0,1fr)}
  .exc-arb{max-height:150px;border-right:0;border-bottom:1px solid var(--line)}
  .exc-cap,.exc-rand{grid-template-columns:minmax(0,1.5fr) minmax(0,1.1fr)}
  .exc-cap .d,.exc-cap .z,.exc-rand .d,.exc-rand .z{display:none}
  .exc-tel{display:block}
}
@media (pointer:coarse){.exc-arb .chev{width:34px}}
`;
function css(){if(document.getElementById('exc-css'))return;const s=document.createElement('style');s.id='exc-css';s.textContent=CSS;document.head.appendChild(s)}

/* ---------- căile ---------- */
const TIP={png:'Fișier PNG',jpg:'Fișier JPG',bmp:'Fișier BMP',mp3:'Fișier MP3',mp4:'Fișier MP4',txt:'Fișier TXT',docx:'Microsoft Word Document'};
const FAM={png:'img',jpg:'img',bmp:'img',mp3:'sunet',mp4:'film',txt:'text',docx:'word'};
const AFISAT_IMPLICIT={'C:/Users/':'Utilizatori','C:/Program Files/':'Fișiere program'};
const isD=p=>p.endsWith('/');
const par=p=>{if(p==='PC')return '';if(/^[A-Z]:\/$/.test(p))return 'PC';const s=p.replace(/\/$/,''),i=s.lastIndexOf('/');return s.slice(0,i+1)};
const numeReal=p=>{const s=p.replace(/\/$/,'');return s.slice(s.lastIndexOf('/')+1)};
const ext=n=>{const i=n.lastIndexOf('.');return i>0?n.slice(i+1).toLowerCase():''};
const cuBackslash=p=>p==='PC'?'Acest PC':p.replace(/\//g,'\\').replace(/\\$/,'').replace(/^([A-Z]:)$/,'$1\\');

function model(Q){
  const M={f:new Map(),un:Q.unitati||{},doc:Q.doc||null,afisat:Object.assign({},AFISAT_IMPLICIT,Q.afisat||{}),blocat:new Set(Q.blocat||[]),ext:!!Q.extensii};
  const adauga=(p,info)=>{let q=p;while(q&&q!=='PC'){if(!M.f.has(q))M.f.set(q,null);q=par(q)}if(info)M.f.set(p,info)};
  (Q.fs||[]).forEach(e=>{if(Array.isArray(e))adauga(e[0],{data:e[1],dim:e[2]});else adauga(e,null)});
  Object.keys(M.un).forEach(u=>adauga(u+'/',null));
  if(M.doc)adauga(M.doc,null);
  return M;
}
/* numele afișat al unui element (în listă, în arbore, în bara cu butoane) */
function afis(M,p){
  if(p==='PC')return 'Acest PC';
  if(/^[A-Z]:\/$/.test(p)){const u=M.un[p.slice(0,2)]||{};return (u.nume||'Disc local')+' ('+p.slice(0,2)+')'}
  if(M.doc&&p===M.doc)return 'Documente';
  if(M.afisat[p])return M.afisat[p];
  const n=numeReal(p);
  if(!isD(p)&&!M.ext&&TIP[ext(n)])return n.slice(0,n.length-ext(n).length-1);
  return n;
}
function copii(M,d){
  if(d==='PC')return Object.keys(M.un).map(u=>u+'/');
  return [...M.f.keys()].filter(p=>p!=='PC'&&par(p)===d).sort((a,b)=>(isD(b)-isD(a))||afis(M,a).localeCompare(afis(M,b),'ro')||a.localeCompare(b));
}
/* segmentele barei cu butoane: Documente e rădăcina lui (ca în Windows 11), altfel Acest PC › unitate › foldere */
function segmente(M,p){
  if(p==='PC')return ['PC'];
  const out=[];let q=p;
  while(q&&q!=='PC'){out.unshift(q);if(M.doc&&q===M.doc)return out;q=par(q)}
  out.unshift('PC');return out;
}
/* textul din caseta de adresă (după clic): Documente = „Documente”; restul = calea cu \ (numele adevărate, englezești) */
function textCaseta(M,p){if(p==='PC')return 'Acest PC';if(M.doc&&p===M.doc)return 'Documente';return cuBackslash(p)}
function tipText(M,p){if(p==='PC')return '';if(/^[A-Z]:\/$/.test(p))return (M.un[p.slice(0,2)]||{}).tip||'Unitate';if(isD(p))return 'Folder de fișiere';return TIP[ext(numeReal(p))]||'Fișier'}
function icon(M,p,mare){
  const m=mare?' mare':'';
  if(p==='PC')return `<span class="exc-ic pc${m}"></span>`;
  if(/^[A-Z]:\/$/.test(p))return `<span class="exc-ic ${(M.un[p.slice(0,2)]||{}).stick?'stick':'disc'}${m}"></span>`;
  if(M.doc&&p===M.doc)return `<span class="exc-ic doc${m}"></span>`;
  if(isD(p))return `<span class="exc-ic d${m}"></span>`;
  return `<span class="exc-ic f ${FAM[ext(numeReal(p))]||''}${m}"></span>`;
}

/* ---------- verificarea unei căi scrise de elev ---------- */
function verificaCale(txt,ok){
  const raw=String(txt||'').trim();
  const B='<code>\\</code>';
  if(!raw)return {ok:false,msg:'Scrie calea în casetă.'};
  if(raw.includes('/'))return {ok:false,msg:`Între părțile căii pune bara ${B} (bara spre stânga), nu <code>/</code>. Așa scrie Windows calea când faci clic pe bara de adresă. Nu găsești tasta? Apasă butonul <b>Pune \\</b>.`};
  if(/[›>]/.test(raw))return {ok:false,msg:`Semnul › apare doar în bara cu butoane. În cale, între părți stă ${B}.`};
  if(/\s\\|\\\s/.test(raw))return {ok:false,msg:`Nu pune spații lângă ${B}: spațiul ar deveni parte din nume, iar Windows n-ar mai găsi locul.`};
  /* două bare la rând: bara de adresă le-ar primi (judecătorul 2, K03), dar Windows SCRIE calea cu una singură */
  if(/\\\\/.test(raw.replace(/\\+$/,'')))return {ok:false,msg:`Între două părți pune o singură bară ${B}. Bara de adresă ar primi și două, dar Windows scrie calea cu una singură.`};
  const a=raw.replace(/\\+$/,'').toLowerCase(),b=String(ok).replace(/\\+$/,'').toLowerCase();
  if(a===b)return {ok:true};
  const e=ext(b.slice(b.lastIndexOf('\\')+1));
  const tinta=e?'fișierul':'folderul cerut';   /* răspunsul e un fișier (are extensie) sau un folder (K03) */
  if(e&&a===b.slice(0,b.length-e.length-1))return {ok:false,msg:`Lipsește extensia de la sfârșit (<code>.${e}</code>). Numele adevărat al fișierului are extensia, chiar dacă Explorer o ascunde. O afli din coloana Tip.`};
  if(/(^|\\)documente(\\|$)/.test(a)&&/(^|\\)documents(\\|$)/.test(b))return {ok:false,msg:'Pe ecran scrie „Documente”, dar în cale Windows păstrează numele englezesc: <code>Documents</code>. Uită-te în caseta de adresă, după clic.'};
  if(/(^|\\)utilizatori(\\|$)/.test(a))return {ok:false,msg:'Pe ecran scrie „Utilizatori”, dar în cale scrie <code>Users</code>.'};
  if(/^(acest pc|this pc)/.test(a))return {ok:false,msg:'Calea începe cu litera unității și două puncte (de exemplu <code>C:</code>), nu cu „Acest PC”.'};
  if(/^[a-z]:/.test(b)){
    const u=b.slice(0,2);
    if(/\([a-z]:\)/.test(a))return {ok:false,msg:`La început scrii doar litera și două puncte: <code>${u.toUpperCase()}</code>, fără numele unității din fața parantezei.`};
    if(!a.startsWith(u))return {ok:false,msg:`Calea începe cu unitatea pe care stă ${tinta}: <code>${u.toUpperCase()}</code>.`};
    if(!a.startsWith(u+'\\'))return {ok:false,msg:`După <code>${u.toUpperCase()}</code> vine bara ${B}, apoi primul folder.`};
  }
  const pa=a.split('\\'),pb=b.split('\\');
  if(pa.length<pb.length&&pb[pb.length-1]===pa[pa.length-1])return {ok:false,msg:`Lipsește un folder din drum. Scrie toate folderele, în ordine, de la unitate până la ${e?'fișier':'folderul cerut'}.`};
  if(pa.length===pb.length&&pa.slice().sort().join('|')===pb.slice().sort().join('|'))return {ok:false,msg:`Ai toate părțile, dar nu în ordine: unitatea întâi, apoi folderele de la cel din afară la cel dinăuntru, iar ${tinta} la sfârșit.`};
  return {ok:false,msg:e?`Nu e calea bună. Citește-o din nou: unitatea, folderele în ordine, apoi fișierul, cu ${B} între ele.`:`Nu e calea bună. Citește-o din nou: unitatea, apoi folderele în ordine, până la folderul cerut, cu ${B} între ele.`};
}
function puneBackslash(inp){
  const st=inp.selectionStart==null?inp.value.length:inp.selectionStart,en=inp.selectionEnd==null?st:inp.selectionEnd;
  inp.setRangeText('\\',st,en,'end');inp.focus({preventScroll:true});inp.dispatchEvent(new Event('input',{bubbles:true}));
}

/* ---------- starea și operațiile ---------- */
function stare(Q){const M=model(Q);const start=Q.start||'PC';
  const s={M,cur:start,sel:null,ist:[start],ii:0,edit:false,exp:new Set(['PC']),msg:'',av:false,rasp:'',vazut:new Set(),lc:null};
  segmente(M,start).forEach(x=>s.exp.add(x));return s}
function mergi(s,p,faraIstoric){
  const M=s.M;
  if(p!=='PC'&&!M.f.has(p))return 'Folderul nu există.';
  if(M.blocat.has(p)){s.msg=`În atelier nu intrăm în „${afis(M,p)}”: pe calculator are multe fișiere ale lui Windows sau ale programelor. Caută în altă parte.`;s.av=true;return ''}
  s.cur=p;s.sel=null;s.edit=false;s.msg='';s.av=false;
  if(!faraIstoric){s.ist=s.ist.slice(0,s.ii+1);s.ist.push(p);s.ii=s.ist.length-1}
  return '';
}
const OP={
  cd:(s,p)=>mergi(s,p),
  sel:(s,n)=>{const p=copii(s.M,s.cur).find(x=>numeReal(x)===n||x===n);s.sel=p||null;return p?'':'Nu găsesc „'+n+'” aici.'},
  vezi:(s,p)=>{if(p)mergi(s,p);s.edit=true;s.vazut.add(s.cur);return ''},
  scrie:(s,t)=>{s.rasp=String(t);return ''}
};
function aplica(s,ops){(ops||[]).forEach(o=>{const f=OP[o[0]];if(f){const e=f(s,...o.slice(1));if(e){s.msg=e;s.av=true}}})}
function test(Q,s,c){
  if(c.in)return s.cur===c.in;
  if(c.sel)return !!s.sel&&numeReal(s.sel)===c.sel;
  if(c.cale)return !!(Q.raspuns&&verificaCale(s.rasp,Q.raspuns.ok).ok);
  if(c.vazut)return s.vazut.has(c.vazut);
  return false;
}

/* ---------- desenul ---------- */
function desen(Q,body,api,s){
  const M=s.M,E=api.esc;
  /* arborele din stânga */
  const arb=[];
  const rand=(p,niv)=>{
    const k=p==='PC'?copii(M,'PC'):copii(M,p).filter(isD);
    const are=k.length>0&&!M.blocat.has(p),desch=s.exp.has(p);
    arb.push(`<div class="r" style="padding-left:${niv*14}px"><button type="button" class="chev ${are?'':'nimic'}" data-exp="${E(p)}" aria-label="${desch?'Restrânge':'Extinde'} ${E(afis(M,p))}" ${are?'':'tabindex="-1" aria-hidden="true"'}>${desch?'⌄':'›'}</button><button type="button" class="nm ${s.cur===p?'on':''}" data-nav="${E(p)}">${icon(M,p)}<span class="t">${E(afis(M,p))}</span></button></div>`);
    if(are&&desch)k.forEach(x=>rand(x,niv+1));
  };
  if(M.doc){arb.push(`<div class="r"><span class="chev nimic"></span><button type="button" class="nm ${s.cur===M.doc?'on':''}" data-nav="${E(M.doc)}">${icon(M,M.doc)}<span class="t">Documente</span></button></div>`);arb.push('<div class="sep"></div>')}
  rand('PC',0);
  /* lista din dreapta */
  const k=copii(M,s.cur);let lista;
  if(s.cur==='PC'){
    lista=`<div class="exc-grup">Dispozitive și unități</div>`+k.map(p=>{const u=M.un[p.slice(0,2)]||{};
      return `<button type="button" class="exc-unit ${s.sel===p?'on':''}" data-p="${E(p)}">${icon(M,p,true)}<span>${E(afis(M,p))}</span><span class="bar" aria-hidden="true"><i style="width:${u.ocupat||50}%"></i></span><small>${E(u.liber||'')}</small></button>`}).join('');
  }else{
    lista=`<div class="exc-cap"><span>Nume</span><span class="d">Data modificării</span><span class="p">Tip</span><span class="z">Dimensiune</span></div>`+
      k.map(p=>{const i=M.f.get(p)||{};return `<button type="button" class="exc-rand ${s.sel===p?'on':''}" data-p="${E(p)}"><span class="n">${icon(M,p)}<span class="t">${E(afis(M,p))}</span></span><span class="d">${E(i.data||'')}</span><span class="p">${E(tipText(M,p))}</span><span class="z">${isD(p)?'':E(i.dim||'')}</span></button>`}).join('');
  }
  /* bara de adresă */
  const bara=baraHTML(M,s,E);
  const sus=par(s.cur);
  const titluSus=s.cur==='PC'||(M.doc&&s.cur===M.doc)?'Desktop':afis(M,sus);
  const teste=(Q.checks||[]).map(c=>test(Q,s,c));
  body.innerHTML=`<p class="exc-cum">În partea din dreapta, un clic pe un folder îl <b>selectează</b>, iar dublu-clic (două clicuri repede; pe telefon, două atingeri) îl <b>deschide</b>. În panoul din stânga, un singur clic te duce acolo. Clic pe partea goală a barei de adresă îți arată <b>calea</b>.</p>
  <div class="exc" tabindex="0" role="application" aria-label="Explorer simulat, doar pentru citit">
    <div class="exc-tit">${icon(M,s.cur)}<b>${E(afis(M,s.cur))}</b> - Explorer</div>
    <div class="exc-adr">
      <span class="exc-nav3"><button type="button" data-a="inapoi" title="Înapoi (Alt + săgeată la stânga)" aria-label="Înapoi" ${s.ii>0?'':'disabled'}>←</button><button type="button" data-a="inainte" title="Înainte (Alt + săgeată la dreapta)" aria-label="Înainte" ${s.ii<s.ist.length-1?'':'disabled'}>→</button><button type="button" data-a="sus" title="${titluSus?`Până la „${E(titluSus)}” (Alt + săgeată în sus)`:''}" aria-label="Sus">↑</button></span>
      ${bara}
      <input class="exc-caut" type="search" readonly placeholder="Căutați în ${E(afis(M,s.cur))}" aria-label="Caseta de căutare (în atelier nu caută)">
    </div>
    <div class="exc-corp"><nav class="exc-arb" aria-label="Panoul din stânga (panoul de navigare)">${arb.join('')}</nav><div class="exc-lista">${lista}</div></div>
    <div class="exc-stare ${s.av?'av':''}" aria-live="polite">${s.msg?s.msg:(s.cur==='PC'?k.length+' unități':k.length+' elemente')}</div>
  </div>
  <p class="exc-mic">Atelierul e un Explorer mic: are mai puține foldere și fișiere decât un calculator adevărat, iar aici doar citești și deschizi foldere. Nu muți, nu ștergi și nu deschizi fișiere (asta vine la lecția 10).</p>
  <p class="exc-mic exc-tel">Pe telefon, coloanele Data modificării și Dimensiune sunt ascunse, ca să încapă lista.</p>
  ${Q.raspuns?`<div class="exc-rasp"><label>${E(Q.raspuns.eticheta||'Calea')}: <input class="exc-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="${E(s.rasp)}" aria-label="${E(Q.raspuns.eticheta||'Calea')}"></label><button type="button" class="btn sm exc-bs" data-bs="1" aria-label="Pune bara inversă \\">Pune \\</button></div><p class="exc-mic">Nu găsești tasta <code>\\</code>? Apasă butonul <b>Pune \\</b>: pune bara acolo unde e cursorul.</p>`:''}
  ${teste.length?`<div class="exc-teste"><div class="lbl">Testele sarcinii · ${teste.filter(Boolean).length} din ${teste.length} trec</div><ol>${Q.checks.map((c,i)=>`<li class="${teste[i]?'ok':''}"><span class="s">${teste[i]?'✓':'○'}</span><span>${c.ce}</span></li>`).join('')}</ol></div>`:''}`;
  body._exc={s,Q};
  leaga(Q,body,api,s);
}
/* bara de adresă: cu butoane (nume despărțite de ›) sau, după clic, caseta cu calea */
function baraHTML(M,s,E){
  if(s.edit)return `<input class="exc-edit" type="text" readonly value="${E(textCaseta(M,s.cur))}" aria-label="Caseta de adresă: calea locului în care ești">`;
  const seg=segmente(M,s.cur);
  return `<div class="exc-bara" data-bara="1" title="Bara de adresă: clic pe partea goală ca să vezi calea">${icon(M,seg[0])}${seg.map(p=>`<span class="sag" aria-hidden="true">›</span><button type="button" class="seg" data-seg="${E(p)}" title="${E(afis(M,p))}"><span class="st">${E(afis(M,p))}</span></button>`).join('')}<span class="gol" data-gol="1"></span></div>`;
}
/* ecran îngust: ascund primele nume (ca Windows) până când niciun nume rămas nu mai e tăiat; la început apare « */
function strangeBara(b){
  if(!b)return;
  const segs=[...b.querySelectorAll('.seg')],sags=[...b.querySelectorAll('.sag')],vechi=b.querySelector('.capat');
  segs.forEach((x,i)=>{x.hidden=false;if(sags[i])sags[i].hidden=false});if(vechi)vechi.remove();
  const taiat=()=>segs.some(x=>!x.hidden&&x.querySelector('.st').scrollWidth>x.querySelector('.st').clientWidth+1);
  let i=0;
  while(taiat()&&i<segs.length-1){
    if(i===0){const c=document.createElement('button');c.type='button';c.className='capat';c.textContent='«';c.setAttribute('aria-label','Locurile care nu mai încap în bară');
      const ic=b.querySelector('.exc-ic');(ic?ic.nextSibling:b.firstChild).before(c)}
    segs[i].hidden=true;if(sags[i])sags[i].hidden=true;i++;if(sags[i])sags[i].hidden=true}
}
if(!window.__excRedim){window.__excRedim=true;let tm;window.addEventListener('resize',()=>{clearTimeout(tm);tm=setTimeout(()=>document.querySelectorAll('.exc-bara').forEach(strangeBara),120)})}
function actualizeazaTeste(Q,body,s){
  const t=body.querySelector('.exc-teste');if(!t)return;
  const r=(Q.checks||[]).map(c=>test(Q,s,c));
  t.querySelector('.lbl').textContent=`Testele sarcinii · ${r.filter(Boolean).length} din ${r.length} trec`;
  t.querySelectorAll('li').forEach((li,i)=>{li.classList.toggle('ok',r[i]);li.querySelector('.s').textContent=r[i]?'✓':'○'});
}
function leaga(Q,body,api,s){
  const M=s.M,x=body.querySelector('.exc');
  /* redesen: focusul rămâne unde era (Explorer-ul, caseta de răspuns cu cursorul ei) sau merge unde cerem */
  const re=(focus)=>{
    const a=document.activeElement,inRasp=a&&a.classList&&a.classList.contains('exc-in')&&body.contains(a),poz=inRasp?a.selectionStart:null;
    desen(Q,body,api,s);
    const y=body.querySelector(focus||(inRasp?'.exc-in':'.exc'));
    if(y){y.focus({preventScroll:true});if(inRasp&&!focus){try{y.setSelectionRange(poz,poz)}catch(_){}}}
  };
  const mesaj=(t,av)=>{s.msg=t;s.av=!!av;re()};
  const deschide=p=>{if(isD(p)||p==='PC'||/^[A-Z]:\/$/.test(p)){const e=mergi(s,p);if(e)s.msg=e;segmente(M,s.cur).forEach(z=>s.exp.add(z));re()}
    else mesaj('Pe calculator, dublu-clic ar deschide fișierul cu programul lui. În atelier nu deschidem fișiere: doar citești numele, tipul și calea.',true)};
  const act=a=>{
    if(a==='inapoi'&&s.ii>0){s.ii--;mergi(s,s.ist[s.ii],true);return re()}
    if(a==='inainte'&&s.ii<s.ist.length-1){s.ii++;mergi(s,s.ist[s.ii],true);return re()}
    if(a==='sus'){
      if(s.cur==='PC'||(M.doc&&s.cur===M.doc))return mesaj(`Din ${s.cur==='PC'?'Acest PC':'Documente'}, săgeata ↑ te duce la Desktop. În atelier nu mergem acolo: folosește panoul din stânga.`,true);
      mergi(s,par(s.cur));return re()}
  };
  body.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>act(b.dataset.a));
  body.querySelectorAll('[data-exp]').forEach(b=>b.onclick=()=>{const p=b.dataset.exp;if(s.exp.has(p))s.exp.delete(p);else s.exp.add(p);re()});
  body.querySelectorAll('[data-nav]').forEach(b=>{b.onclick=()=>{const p=b.dataset.nav;const e=mergi(s,p);if(e)s.msg=e;re()};
    b.ondblclick=ev=>{ev.preventDefault();const p=b.dataset.nav;if(s.exp.has(p))s.exp.delete(p);else s.exp.add(p);re()}});
  const MSG_CALE='Asta e calea locului în care ești. În atelier, aici doar citești. Apasă Esc sau atinge lista ca să revii la bara cu butoane.';
  const stareImplicita=()=>s.cur==='PC'?copii(M,'PC').length+' unități':copii(M,s.cur).length+' elemente';
  const legaBara=()=>{
    strangeBara(body.querySelector('[data-bara]'));
    body.querySelectorAll('[data-seg]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();mergi(s,b.dataset.seg);re()});
    const cap=body.querySelector('.exc-bara .capat');
    if(cap)cap.onclick=ev=>{ev.stopPropagation();mesaj('Pe calculator, « deschide lista locurilor care nu mai încap în bară. Toată calea o vezi cu un clic pe partea goală a barei.',true)};
    const bara=body.querySelector('[data-bara]');
    if(bara)bara.addEventListener('click',ev=>{
      if(ev.target.closest('[data-seg]'))return;
      if(ev.target.closest('.sag'))return mesaj('Pe calculator, săgeata › dintre nume deschide lista folderelor de acolo. În atelier nu o folosim: deschide folderele din listă.',true);
      s.edit=true;s.editNou=true;s.vazut.add(s.cur);s.msg=MSG_CALE;s.av=false;re('.exc-edit');actualizeazaTeste(Q,body,s)});
    const ed=body.querySelector('.exc-edit');
    if(ed){
      if(s.editNou){s.editNou=false;ed.focus({preventScroll:true});try{ed.select()}catch(_){}}
      ed.addEventListener('keydown',ev=>{if(ev.key==='Escape'||ev.key==='Enter'){ev.preventDefault();ev.stopPropagation();s.edit=false;s.msg='';re()}});
      /* caseta pierde focusul (clic în listă, în panou, în afara Explorer-ului): revine PE LOC bara cu butoane, fără să
         redesenez lista (clicul care a luat focusul își face treaba: selectează rândul, deschide folderul…) */
      ed.addEventListener('blur',()=>{if(!body.contains(ed)||!s.edit)return;s.edit=false;if(s.msg===MSG_CALE){s.msg='';const st=body.querySelector('.exc-stare');if(st){st.textContent=stareImplicita();st.classList.remove('av')}}
        ed.outerHTML=baraHTML(M,s,api.esc);legaBara()});
    }
  };
  legaBara();
  body.querySelectorAll('[data-p]').forEach(b=>{const p=b.dataset.p;
    /* dublu-clicul ținut de mână: primul clic redesenează lista, deci evenimentul dblclick nativ s-ar pierde */
    b.onclick=()=>{const t=Date.now();
      if(s.lc&&s.lc.p===p&&t-s.lc.t<550){s.lc=null;return deschide(p)}
      s.lc={p,t};if(s.sel!==p){s.sel=p;s.msg='';s.av=false;re()}}});
  body.querySelector('.exc-caut').addEventListener('click',()=>mesaj('Căutarea o înveți la lecția 10. Azi găsești fișierele mergând din folder în folder.',true));
  const lista=body.querySelector('.exc-lista');
  lista.addEventListener('contextmenu',ev=>{ev.preventDefault();mesaj('Meniul de clic dreapta îl folosești la lecția 10. Azi doar citești.',true)});
  lista.addEventListener('click',ev=>{if(!ev.target.closest('[data-p]')&&s.sel){s.sel=null;re()}});
  x.addEventListener('keydown',ev=>{
    if(ev.target.tagName==='INPUT')return;
    const k=ev.key;
    const c=ev.ctrlKey||ev.metaKey,kl=k.length===1?k.toLowerCase():k;
    const lectia10=ce=>{ev.preventDefault();mesaj(`Pe calculator, ${ce}. Asta e lecția 10: în atelier nu se întâmplă nimic.`,true)};
    const caseta=()=>{ev.preventDefault();s.edit=true;s.editNou=true;s.vazut.add(s.cur);s.msg=MSG_CALE;re('.exc-edit');actualizeazaTeste(Q,body,s)};
    if((ev.altKey&&k==='ArrowLeft')||(k==='Backspace'&&!c&&!ev.altKey)){ev.preventDefault();act('inapoi')}
    else if(ev.altKey&&k==='ArrowRight'){ev.preventDefault();act('inainte')}
    else if(ev.altKey&&k==='ArrowUp'){ev.preventDefault();act('sus')}
    else if((c&&kl==='l')||(ev.altKey&&kl==='d')||k==='F4')caseta()
    else if(k==='Delete'||(c&&kl==='d')){if(s.sel)lectia10(ev.shiftKey?'Shift+Delete ar șterge DE TOT ce ai selectat':'tasta Delete ar muta ce ai selectat în Coșul de reciclare');else ev.preventDefault()}
    else if(k==='F2'){if(s.sel)lectia10('F2 ar începe redenumirea (schimbarea numelui) a ce ai selectat');else ev.preventDefault()}
    else if(c&&ev.shiftKey&&kl==='n')lectia10('Ctrl+Shift+N ar face un folder nou')
    else if(c&&(kl==='c'||kl==='x'||kl==='v'))lectia10(kl==='c'?'Ctrl+C ar copia ce ai selectat':kl==='x'?'Ctrl+X ar decupa ce ai selectat':'Ctrl+V ar lipi aici ce ai copiat')
    else if((ev.shiftKey&&k==='F10')||k==='ContextMenu'){ev.preventDefault();mesaj('Meniul de clic dreapta îl folosești la lecția 10. Azi doar citești.',true)}
    else if(ev.altKey&&k==='Enter'){ev.preventDefault();mesaj('Pe calculator, Alt+Enter ar deschide fereastra Proprietăți. În atelier nu o folosim.',true)}
    else if(k==='F3'||(c&&(kl==='e'||kl==='f'))){ev.preventDefault();mesaj('Căutarea o înveți la lecția 10. Azi găsești fișierele mergând din folder în folder.',true)}
    else if(k==='Home'||k==='End'){const l=copii(M,s.cur);if(l.length){ev.preventDefault();s.sel=k==='Home'?l[0]:l[l.length-1];re()}}
    else if(k==='Enter'&&s.sel){ev.preventDefault();deschide(s.sel)}
    else if(k==='ArrowDown'||k==='ArrowUp'){const l=copii(M,s.cur);if(!l.length)return;ev.preventDefault();let i=l.indexOf(s.sel);i=k==='ArrowDown'?Math.min(l.length-1,i+1):Math.max(0,i<0?0:i-1);s.sel=l[i];re()}
  });
  const inp=body.querySelector('.exc-in');
  if(inp){
    /* fără redesen la fiecare literă (pe telefon, tastatura s-ar închide): se actualizează doar testele */
    inp.addEventListener('input',()=>{s.rasp=inp.value;actualizeazaTeste(Q,body,s)});
    inp.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();const b=document.getElementById('chk');if(b)b.click()}});
    body.querySelector('[data-bs]').onclick=()=>puneBackslash(body.querySelector('.exc-in'));
  }
}

const SimExplorerCitire={
  render(Q,body,api){
    css();const s=stare(Q);desen(Q,body,api,s);
    api.checkButton(()=>{
      const {s:st}=body._exc,rez=(Q.checks||[]).map(c=>test(Q,st,c)),k=rez.indexOf(false);
      if(k<0){api.resolve(true);return}
      let msg='Testul care nu trece încă: '+Q.checks[k].ce+'.';
      if(Q.checks[k].cale&&Q.raspuns){const v=verificaCale(st.rasp,Q.raspuns.ok);if(!v.ok)msg+=' '+v.msg}
      api.resolve(false,msg);
      const f=body.querySelector(Q.checks[k].cale?'.exc-in':'.exc');if(f)f.focus({preventScroll:true});
      api.revealButton(()=>{const n=stare(Q);aplica(n,Q.solutie);n.msg='Așa arată la final: toate testele trec.';n.av=false;desen(Q,body,api,n);
        api.giveUp(Q.solutieText||'uită-te în Explorer și la testele de sub el: acum trec toate.')});
    });
  },
  rezolva(Q,body,api){const n=stare(Q);aplica(n,Q.solutie);desen(Q,body,api,n)},
  gresit(Q,body,api){const n=stare(Q);aplica(n,Q.gresit||[]);desen(Q,body,api,n)}
};

const TipCale={
  render(Q,body,api){
    css();
    body.innerHTML=`<div class="exc-rasp"><label>${api.esc(Q.eticheta||'Calea')}: <input class="exc-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(Q.eticheta||'Calea')}"></label><button type="button" class="btn sm exc-bs" data-bs="1" aria-label="Pune bara inversă \\">Pune \\</button></div>
    <p class="exc-mic">Nu găsești tasta <code>\\</code>? Apasă butonul <b>Pune \\</b>: pune bara acolo unde e cursorul.</p>`;
    const inp=body.querySelector('.exc-in');
    body.querySelector('[data-bs]').onclick=()=>puneBackslash(inp);
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const b=document.getElementById('chk');if(b)b.click()}});
    const nav=api.checkButton(()=>{
      const v=verificaCale(inp.value,Q.ok);
      if(v.ok){inp.readOnly=true;api.resolve(true);return}
      api.resolve(false,v.msg);inp.focus({preventScroll:true});
      api.revealButton(()=>{inp.value=Q.ok;inp.readOnly=true;nav.innerHTML='';api.giveUp(`<code>${api.esc(Q.ok)}</code>`)});
    });
  },
  rezolva(Q,body){body.querySelector('.exc-in').value=Q.ok;return true},
  gresit(Q,body){body.querySelector('.exc-in').value=Q.tipic||'';return true}
};

window.SimExplorerCitire=SimExplorerCitire;
window.TipCale=TipCale;
window.ExplorerCitire={verificaCale,textCaseta,segmente,afis,model};   /* pentru probe */
})();
