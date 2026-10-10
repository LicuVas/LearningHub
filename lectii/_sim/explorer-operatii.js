/* Simulatorul „explorer-operatii” pentru lecțiile LearningHub — fișier comun (lectii/_sim/explorer-operatii.js).
   PROPRIETAR: autorul lecției V · M2 · nr. 10 („Operații cu fișiere și directoare: creare, redenumire, copiere, mutare,
   ștergere, căutare”), 11.10.2026. Extensie NOUĂ: nu modifică explorer-citire.js (lecția 9) și nimic din motor.
   Lecțiile 11 (aplicație practică) și 12 (evaluare) îl pot folosi: vezi „API” mai jos și surse.md al lecției 10.

   Folosire (după motor.js):
     <script src="../../_sim/explorer-operatii.js"></script>
     JocMotor.porneste({ …, tipuri:{explorerop:SimExplorerOperatii} })

   CE E ADEVĂRAT AICI (probat pe Windows 11 25H2 în română, 10-11.10.2026; dovezile: lectii/v/m2-l10/_proba/):
   - Lipire în ACELAȘI folder după Copiere → „tema - Copie.docx”, a doua oară „tema - Copie (2).docx” (sonda S1);
     folder nou → „Folder nou”, apoi „Folder nou (2)” (S9);
   - Lipire unde există deja același nume → fereastra „Înlocuire sau omitere fișiere”, cu „Se copiază 1 element de la X la Y”
     („Se mută …” la mutare), „Destinația are deja un fișier cu numele „…””, variantele „Înlocuire fișier de la destinație”
     (deja ALEASĂ: Enter = înlocuiește, S2b), „Se omite acest fișier” (fișierul din destinație rămâne, S2),
     „Comparați informațiile pentru ambele fișiere”;
   - Delete → Coș de reciclare, fără întrebare (setarea implicită, S4); Coșul are coloanele Nume, Locație inițială,
     Data ștergerii…; Restaurare pune elementul la locul lui (S4);
   - ștergerea definitivă întreabă „Sigur ștergeți definitiv acest fișier?” (titlul „Ștergere fișier”; la folder
     „Ștergere folder” / „…acest folder?”), cu Da deja ales (S5);
   - numele butoanelor din bara de comenzi (Windows 11, resursele explorerframe): Nou, Decupare (Ctrl+X), Copiere (Ctrl+C),
     Lipire (Ctrl+V), Redenumire (F2), Folder nou (Ctrl+Shift+N), Ștergere (Ctrl+D), Ștergere permanentă (Shift+Delete),
     Anulare (Ctrl+Z); caseta „Căutați în <folder>”, „Rezultatele căutării în <folder>”; meniul: „Afișați mai multe opțiuni”;
   - mesajele: „Numele unui fișier nu poate să conțină niciunul dintre următoarele caractere: \ / : * ? " < > |”;
     „Dacă modificați extensia unui fișier, acesta poate deveni inutilizabil. Sigur modificați extensia?”;
     „Folderul destinație este un subfolder al folderului sursă.”; „Sigur restaurați toate elementele șterse din coșul de
     reciclare?”; „Golire Coș de reciclare”, „Restaurare elemente selectate”, „Restaurare totală elemente” (șirurile din shell32).
   NESIGUR (din șiruri sau din documentație, neprobat în fereastră): fereastra la redenumirea cu un nume existent
   („Redenumire fișier”, „Această locație conține deja un fișier cu același nume.”, „Redenumiți „a” ca „b (2)”?”);
   F2 alege doar numele, fără extensie, când extensiile se văd; Ctrl+Z (Anulare) pe mai mulți pași; ștergerea de pe stick
   = definitivă; „Lipire” în rândul de sus al meniului locului gol; tipul „Fișier WAV”.

   PROBATE ÎN RUNDA DE REPARAȚII (11.10.2026, lectii/v/m2-l10/_proba/sonda_lipire_redenumire.py):
   - Copiere, apoi redenumești SURSA, apoi Lipire → fereastra „Element negăsit”: „Imposibil de găsit acest element” /
     „Nu se mai află în <folder>. Verificați locația elementului și încercați din nou.”, butoanele „Încercați din nou” și
     „Anulare”; nu se lipește nimic (L1). Copiere ține minte CALEA de atunci: aici clipboardul NU se mai mută pe numele nou.
   - Restaurare din Coș când în locația inițială există deja același nume → „Înlocuire sau omitere fișiere”, cu
     „Se mută un element la Restaurare” și numele intern din Coș ($R…); „Se omite” lasă elementul în Coș (L3).
   NESIGUR, ales prudent: căutarea găsește doar dacă textul e începutul numelui sau al unui cuvânt de după spațiu.

   ABATERI SPUSE PE ECRAN: un Explorer mic (fără Acasă, Galerie, Rețea, Partajare, Sortare, Vizualizare); sub pictogramele
   barei de comenzi scrie numele (în Windows îl vezi ținând mouse-ul pe pictogramă); clic dreapta = ții degetul apăsat pe
   telefon; fișierele nu se deschid; tragerea cu mouse-ul și selectarea mai multor elemente (Ctrl+clic) nu merg — rândul de
   sus o spune, iar la încercare apare un mesaj; în Media, Windows arată alte coloane; rezultatele căutării apar ca listă.
   Sub teste: butonul „Reîncep exercițiul” (starea de la început a sarcinii).

   API — TIPUL explorerop, Q:
     fs:[cale | [cale,'dd.mm.yyyy hh:mm','N KB']]   căi interne cu /, folderele se termină cu / ('C:/Users/Ana/Documents/Ex/')
     unitati:{'C:':{nume:'Disc local',liber,ocupat}, 'E:':{nume:'STICK',stick:true,…}}   (stick:true = ștergere definitivă)
     doc?:'C:/Users/Ana/Documents/'   (în bară „Documente”, în cale „Documents”)   desktop?:true (fâșia cu Coșul, implicit true)
     afisat?:{cale:'nume afișat'}  blocat?:[cale]  doarCitire?:[cale]  (în ele doar citești și copiezi)
     cos?:[[caleOriginala,'dd.mm.yyyy hh:mm','N KB','meu'?]]   ce era deja în Coș (al altora; 'meu' = al elevului)
     start?:cale|'PC'|'COS'   extensii?:false|true   acum?:'20.11.2026 09:20' (data scrisă la ce face elevul)
     checks:[ {are:cale} | {nu:cale} | {in:cale} | {sel:cale} | {cos:cale} | {restaurat:cale} | {gasit:cale, cautat?:text}
              | {neatins:cale} | {cosNeatins:true} | {copii:folder, n:N}
              | {intrebat:true} (a apărut „Sigur ștergeți definitiv…?”) | {toate:[checks]} ]  fiecare cu ce:'textul testului'
     solutie:[op], gresit?:[op]   op: ['cd',cale|'PC'|'COS'] ['sel',nume|cale] ['nou',nume] ['ren',nume,numeNou(complet)]
           ['copy',nume] ['cut',nume] ['paste'] ['omite'] ['inlocuieste'] ['del',nume] ['shiftdel',nume] ['da'] ['nu']
           ['rest',caleOriginala] ['cauta',text] ['undo']
     intro în pagină, nu aici. Evenimentul window „explorer-operatii” {tip, cale} la fiecare operație (pentru probe).
   window.ExplorerOperatii = {stare, aplica, test, numeCopie, numeLiber} — pentru probe și pentru lecțiile următoare. */
(function(){
'use strict';

const CSS=`
.exo{position:relative;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font-size:.86rem;overflow:hidden;outline:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.exo:focus-visible{box-shadow:0 0 0 3px var(--sel)}
.exo button{font:inherit;color:inherit}
.exo-tit{display:flex;align-items:center;gap:7px;padding:5px 10px;background:var(--paper2);border-bottom:1px solid var(--line);font-size:.8rem;color:var(--ink2)}
.exo-tit b{color:var(--ink);font-weight:600}
.exo-adr{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:6px;border-bottom:1px solid var(--line)}
.exo-nav3{display:flex;gap:2px}
.exo-nav3 button{min-width:34px;min-height:34px;font-size:1.05rem;line-height:1;border:1px solid transparent;border-radius:6px;background:none;cursor:pointer}
.exo-nav3 button:hover:not(:disabled){background:var(--paper2);border-color:var(--line)}
.exo-nav3 button:disabled{opacity:.35;cursor:default}
.exo-bara{flex:1 1 200px;min-width:0;min-height:36px;display:flex;align-items:center;gap:1px;border:1px solid var(--line);border-radius:5px;padding:0 4px;overflow:hidden;white-space:nowrap}
.exo-bara .seg{flex:0 1 auto;min-width:32px;min-height:32px;border:0;background:none;padding:2px 5px;border-radius:4px;cursor:pointer;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;font-size:.84rem}
.exo-bara .seg:hover{background:var(--paper2)}
.exo-bara .sag{flex:none;color:var(--ink2);padding:0 1px}
.exo-bara .gol{flex:1 0 32px;min-height:32px}
.exo-caut{flex:1 1 140px;min-width:0;display:flex;align-items:center;border:1px solid var(--line);border-radius:5px;background:var(--paper2)}
.exo-caut input{flex:1 1 auto;min-width:0;min-height:34px;font:inherit;font-size:.82rem;border:0;background:none;color:var(--ink);padding:2px 8px;outline:none;user-select:text;-webkit-user-select:text}
.exo-caut button{flex:none;min-width:32px;min-height:32px;border:0;background:none;cursor:pointer;color:var(--ink2);border-radius:4px}
.exo-cmd{display:flex;flex-wrap:wrap;align-items:stretch;gap:2px;padding:4px 6px;border-bottom:1px solid var(--line);background:var(--paper)}
.exo-cmd button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:52px;min-height:44px;padding:2px 5px;border:1px solid transparent;border-radius:6px;background:none;cursor:pointer;font-size:.7rem;line-height:1.1;color:var(--ink)}
.exo-cmd button:hover:not(:disabled){background:var(--paper2);border-color:var(--line)}
.exo-cmd button:disabled{opacity:.38;cursor:default}
.exo-cmd .sep{width:1px;background:var(--line);margin:4px 3px}
.exo-cmd svg,.exo-mn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.exo-cmd .nou svg{stroke:#0067C0}
.exo-corp{display:grid;grid-template-columns:minmax(0,32%) minmax(0,1fr);min-height:210px}
.exo-arb{border-right:1px solid var(--line);padding:4px 2px;overflow:auto;background:var(--paper2);max-height:320px}
.exo-arb .r{display:flex;align-items:center;min-height:32px}
.exo-arb .chev{flex:none;width:32px;min-height:32px;border:0;background:none;color:var(--ink2);font-size:.8rem;cursor:pointer;border-radius:4px}
.exo-arb .chev.nimic{visibility:hidden}
.exo-arb .nm{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:6px;min-height:32px;font-size:.82rem;text-align:left;border:0;background:none;cursor:pointer;border-radius:4px;padding:0 4px;white-space:nowrap;overflow:hidden}
.exo-arb .nm span.t{overflow:hidden;text-overflow:ellipsis}
.exo-arb .nm.on{background:var(--sel)}
.exo-arb .sp{border-top:1px solid var(--line);margin:4px 6px}
.exo-lista{position:relative;min-width:0;overflow:auto;max-height:320px;padding:2px 4px 30px}
.exo-cap,.exo-rand{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1.1fr) minmax(0,.6fr);gap:8px;align-items:center}
.exo-cap{padding:4px 6px;font-size:.74rem;color:var(--ink2);border-bottom:1px solid var(--line)}
.exo-rand{width:100%;min-height:34px;text-align:left;font-size:.84rem;padding:3px 6px;border:1px solid transparent;border-radius:4px;background:none;cursor:default;touch-action:manipulation}
.exo-rand:hover{background:var(--paper2)}
.exo-rand.on{background:var(--sel);border-color:var(--accent)}
.exo-rand.taiat .n{opacity:.45}
.exo-rand .n{display:flex;align-items:center;gap:7px;min-width:0}
.exo-rand .n span.t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.exo-rand .dt,.exo-rand .p,.exo-rand .z{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink2);font-size:.8rem}
.exo-rand .z,.exo-cap .z{text-align:right}
.exo-ren{flex:1 1 auto;min-width:0;font:inherit;font-size:.84rem;padding:1px 4px;border:1.5px solid #0067C0;border-radius:2px;background:var(--paper);color:var(--ink);user-select:text;-webkit-user-select:text}
.exo-ren::selection{background:#0067C0;color:#fff}
.exo-balon{position:absolute;z-index:6;left:8px;right:8px;max-width:420px;padding:8px 10px;border:1px solid #C9A227;border-radius:6px;background:#FFF8D6;color:#3A2E00;font-size:.8rem;box-shadow:0 4px 14px rgba(0,0,0,.18)}
.exo-gol{padding:16px 8px;color:var(--ink2);font-size:.84rem;text-align:center}
.exo-grup{padding:6px 6px 2px;font-size:.78rem;font-weight:700;color:var(--ink2)}
.exo-stare{padding:6px 10px;border-top:1px solid var(--line);background:var(--paper2);font-size:.82rem;color:var(--ink2);min-height:1.9em}
.exo-stare.av{color:var(--ink);font-weight:600}
.exo-desk{display:flex;align-items:center;gap:10px;padding:6px 10px;border-top:1px dashed var(--line);background:var(--paper2);font-size:.78rem;color:var(--ink2)}
.exo-desk button{display:flex;align-items:center;gap:6px;min-height:40px;padding:2px 10px;border:1px solid var(--line);border-radius:6px;background:var(--paper);cursor:pointer;font-size:.8rem}
.exo-mn{position:absolute;z-index:8;min-width:210px;max-width:min(300px,92%);padding:4px;border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 8px 24px rgba(0,0,0,.22);font-size:.84rem}
.exo-mn .rand-ic{display:flex;gap:2px;padding:2px 2px 6px;border-bottom:1px solid var(--line);margin-bottom:4px}
.exo-mn .rand-ic button{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:1px;min-width:44px;min-height:44px;border:0;border-radius:6px;background:none;cursor:pointer;font-size:.68rem}
.exo-mn .it{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:34px;padding:4px 10px;border:0;border-radius:5px;background:none;cursor:pointer;text-align:left;font-size:.84rem}
.exo-mn button:hover:not(:disabled){background:var(--paper2)}
.exo-mn button:disabled{opacity:.4;cursor:default}
.exo-mn .it small{color:var(--ink2)}
.exo-mn .sp{border-top:1px solid var(--line);margin:4px 2px}
.exo-dlg-fond{position:absolute;inset:0;z-index:9;background:rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;padding:8px}
.exo-dlg{width:min(430px,100%);border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 10px 30px rgba(0,0,0,.3);font-size:.86rem;user-select:text}
.exo-dlg .t{padding:7px 12px;background:var(--paper2);border-bottom:1px solid var(--line);border-radius:8px 8px 0 0;font-size:.8rem;color:var(--ink2);display:flex;justify-content:space-between;align-items:center}
.exo-dlg .t button{min-width:34px;min-height:32px;border:0;background:none;cursor:pointer;border-radius:4px}
.exo-dlg .c{padding:10px 14px}
.exo-dlg .c p{margin:.3em 0}
.exo-dlg .mare{font-size:1rem;margin:.4em 0 .6em}
.exo-dlg .opt{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;margin:3px 0;padding:6px 10px;border:1px solid transparent;border-radius:4px;background:none;cursor:pointer;text-align:left;font-size:.92rem}
.exo-dlg .opt:hover{background:var(--paper2)}
.exo-dlg .opt.implicit{border:2px solid var(--ink);background:#D6E9FB;color:#0B2440}
.exo-dlg .bt{display:flex;justify-content:flex-end;gap:8px;padding:10px 14px}
.exo-dlg .bt button{min-width:84px;min-height:36px;border:1px solid var(--line);border-radius:5px;background:var(--paper2);cursor:pointer}
.exo-dlg .bt button.implicit{border:2px solid #0067C0}
.exo-mic{margin:6px 0 0;font-size:.8rem;color:var(--ink2)}
.exo-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.exo-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.exo-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.92rem}
.exo-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:700;color:var(--ink2)}
.exo-teste li.ok .s{color:var(--ok)}
.exo-ic{flex:none;display:inline-block;position:relative;width:18px;height:14px}
.exo-ic.d{background:#F2C14E;border-radius:1px 3px 3px 3px;margin-top:2px}
.exo-ic.d::before{content:"";position:absolute;left:0;top:-3px;width:8px;height:4px;background:#E0A92E;border-radius:2px 2px 0 0}
.exo-ic.f{width:14px;height:18px;border:1.5px solid #7A8794;border-radius:2px 5px 2px 2px;background:#fff}
.exo-ic.f::after{content:"";position:absolute;left:2px;right:2px;bottom:2px;height:6px;border-radius:1px}
.exo-ic.f.img::after{height:8px;background:linear-gradient(135deg,transparent 45%,#3E9A5B 46%),linear-gradient(#8CC8F0,#8CC8F0)}
.exo-ic.f.sunet::after{content:"♪";height:auto;font:700 11px/1 system-ui;color:#C2185B;text-align:center;bottom:1px}
.exo-ic.f.film::after{height:7px;background:#5B3FA8;clip-path:polygon(0 0,100% 50%,0 100%);left:3px;right:3px}
.exo-ic.f.text::after{top:3px;bottom:3px;height:auto;background:repeating-linear-gradient(#9AA5B1 0 1.5px,transparent 1.5px 3.5px)}
.exo-ic.f.word::after{content:"W";height:auto;font:800 9px/1 system-ui;color:#fff;background:#2B579A;text-align:center;padding:1px 0;bottom:1px}
.exo-ic.pc{width:18px;height:13px;border:2px solid #4A5A6A;border-radius:2px;background:#9FD2F5;margin-bottom:3px}
.exo-ic.disc{width:18px;height:10px;border:1.5px solid #4A5A6A;border-radius:2px;background:#DDE3E8}
.exo-ic.stick{width:18px;height:9px;border:1.5px solid #4A5A6A;border-radius:1px 4px 4px 1px;background:#6C7A86;margin-left:4px}
.exo-ic.doc{width:14px;height:18px;border:1.5px solid #3B6FB6;border-radius:2px 5px 2px 2px;background:#E6EEF9}
.exo-ic.cos{width:16px;height:18px;border:1.5px solid #5A6B7A;border-top-width:3px;border-radius:1px 1px 4px 4px;background:repeating-linear-gradient(90deg,#DDE6EE 0 3px,#B9C7D3 3px 4px)}
@media (max-width:560px){
  .exo-corp{grid-template-columns:minmax(0,1fr)}
  .exo-arb{max-height:140px;border-right:0;border-bottom:1px solid var(--line)}
  .exo-cap,.exo-rand{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)}
  .exo-cap .dt,.exo-cap .z,.exo-rand .dt,.exo-rand .z{display:none}
  .exo-cmd button{min-width:46px;font-size:.66rem}
  /* în Coș, pe telefon: Locația inițială pe un rând al ei, sub nume, întreagă */
  .exo-cap.cosc,.exo-rand.cosr{grid-template-columns:minmax(0,1fr);gap:1px}
  .exo-rand.cosr .p{white-space:normal;overflow-wrap:anywhere;padding-left:25px}
  .exo-cap.cosc .p{padding-left:25px}
}
.exo-reia{margin-top:8px;min-height:36px;padding:4px 12px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:.86rem;cursor:pointer}
`;
function css(){if(document.getElementById('exo-css'))return;const s=document.createElement('style');s.id='exo-css';s.textContent=CSS;document.head.appendChild(s)}

/* ---------- pictogramele barei de comenzi (desenate aici, nu imagini din Windows) ---------- */
const SVG={
  nou:'<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5"/><path d="M10 6.5v7M6.5 10h7"/></svg>',
  cut:'<svg viewBox="0 0 20 20"><circle cx="6" cy="15" r="2.5"/><circle cx="14" cy="15" r="2.5"/><path d="M7.6 13.2 14.5 3M12.4 13.2 5.5 3"/></svg>',
  copy:'<svg viewBox="0 0 20 20"><rect x="7" y="6" width="9" height="11" rx="1.5"/><path d="M4.5 13V4.5A1.5 1.5 0 0 1 6 3h6"/></svg>',
  paste:'<svg viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="14" rx="1.5"/><rect x="7.5" y="2.5" width="5" height="3" rx="1"/></svg>',
  ren:'<svg viewBox="0 0 20 20"><rect x="2.5" y="5.5" width="12" height="9" rx="1.5"/><path d="M5.5 12l2-5 2 5M6.2 10.5h2.6M17 4v12M15.5 4h3M15.5 16h3"/></svg>',
  del:'<svg viewBox="0 0 20 20"><path d="M4 6h12M8 6V4h4v2M5.5 6l1 11h7l1-11M8.5 9v5.5M11.5 9v5.5"/></svg>',
  share:'<svg viewBox="0 0 20 20"><path d="M11 4l5 4.5-5 4.5V10.5c-4 0-6 1.5-7.5 4.5C4 10 6 7 11 6.5z"/></svg>',
  rest:'<svg viewBox="0 0 20 20"><path d="M5 8a6 6 0 1 1 0 4.5"/><path d="M3.5 4.5 5 8l3.5-1"/></svg>',
  gol:'<svg viewBox="0 0 20 20"><path d="M4 6h12M5.5 6l1 11h7l1-11M8 6V4h4v2"/><path d="M8 10l4 4M12 10l-4 4"/></svg>'
};

/* ---------- căile ---------- */
const TIP={png:'Fișier PNG',jpg:'Fișier JPG',bmp:'Fișier BMP',mp3:'Fișier MP3',mp4:'Fișier MP4',txt:'Fișier TXT',wav:'Fișier WAV',docx:'Microsoft Word Document',pptx:'Microsoft PowerPoint Presentation',xlsx:'Microsoft Excel Worksheet'};
const FAM={png:'img',jpg:'img',bmp:'img',mp3:'sunet',wav:'sunet',mp4:'film',txt:'text',docx:'word',pptx:'text',xlsx:'text'};
const INTERZISE=/[\\/:*?"<>|]/;
const MSG_INTERZIS='Numele unui fișier nu poate să conțină niciunul dintre următoarele caractere: \\ / : * ? " < > |';
const isD=p=>p.endsWith('/');
const par=p=>{if(p==='PC'||p==='COS')return '';if(/^[A-Z]:\/$/.test(p))return 'PC';const s=p.replace(/\/$/,''),i=s.lastIndexOf('/');return s.slice(0,i+1)};
const numeReal=p=>{const s=p.replace(/\/$/,'');return s.slice(s.lastIndexOf('/')+1)};
/* Numele din fereastra de la Restaurare (L3): Windows arată numele intern din Coș, de forma $R + 6 caractere + extensia */
const numeCos=p=>{const n=numeReal(p),i=n.lastIndexOf('.');let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))>>>0;const A='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';let r='';for(let k=0;k<6;k++){r+=A[h%36];h=Math.floor(h/36)+k*7+1}return '$R'+r+(i>0?n.slice(i):'')};
const ext=n=>{const i=n.lastIndexOf('.');return i>0?n.slice(i+1).toLowerCase():''};
const baza=n=>{const i=n.lastIndexOf('.');return i>0?n.slice(0,i):n};
const cuBackslash=p=>p==='PC'?'Acest PC':p.replace(/\//g,'\\').replace(/\\$/,'').replace(/^([A-Z]:)$/,'$1\\');
const lc=x=>String(x||'').toLocaleLowerCase('ro');
const sub=(p,d)=>p!==d&&p.startsWith(d);   /* p e în interiorul folderului d (oricât de adânc) */
const AFISAT_IMPLICIT={'C:/Users/':'Utilizatori','C:/Program Files/':'Fișiere program'};

function model(Q){
  const M={f:new Map(),un:Q.unitati||{'C:':{nume:'Disc local'}},doc:Q.doc||null,afisat:Object.assign({},AFISAT_IMPLICIT,Q.afisat||{}),
    blocat:new Set(Q.blocat||[]),dc:(Q.doarCitire||[]),ext:!!Q.extensii,acum:Q.acum||'20.11.2026 09:20',nid:1};
  if(M.doc)M.afisat[M.doc]=M.afisat[M.doc]||'Documente';
  const adauga=(p,info)=>{let q=p;while(q&&q!=='PC'){if(!M.f.has(q))M.f.set(q,{id:M.nid++,data:info&&info.data||''});q=par(q)}if(info)Object.assign(M.f.get(p),info)};
  Object.keys(M.un).forEach(u=>adauga(u+'/'));
  (Q.fs||[]).forEach(x=>{if(Array.isArray(x))adauga(x[0],{data:x[1]||'',dim:x[2]||''});else adauga(x,null)});
  return M;
}
function afis(M,p){
  if(p==='PC')return 'Acest PC';
  if(p==='COS')return 'Coș de reciclare';
  if(/^[A-Z]:\/$/.test(p)){const u=M.un[p.slice(0,2)]||{};return (u.nume||'Disc local')+' ('+p.slice(0,2)+')'}
  if(M.afisat[p])return M.afisat[p];
  const n=numeReal(p);
  if(isD(p)||M.ext||!TIP[ext(n)])return n;
  return baza(n);
}
function copii(M,d){
  if(d==='PC')return Object.keys(M.un).map(u=>u+'/');
  const k=[...M.f.keys()].filter(p=>par(p)===d&&!/^[A-Z]:\/$/.test(p));
  const cmp=(a,b)=>lc(numeReal(a)).localeCompare(lc(numeReal(b)),'ro',{numeric:true});
  return k.filter(isD).sort(cmp).concat(k.filter(p=>!isD(p)).sort(cmp));
}
function tipText(M,p){if(/^[A-Z]:\/$/.test(p))return 'Unitate';if(isD(p))return 'Folder de fișiere';return TIP[ext(numeReal(p))]||'Fișier'}
function icon(M,p){
  if(p==='PC')return '<span class="exo-ic pc" aria-hidden="true"></span>';
  if(p==='COS')return '<span class="exo-ic cos" aria-hidden="true"></span>';
  if(/^[A-Z]:\/$/.test(p))return `<span class="exo-ic ${(M.un[p.slice(0,2)]||{}).stick?'stick':'disc'}" aria-hidden="true"></span>`;
  if(M.doc&&p===M.doc)return '<span class="exo-ic doc" aria-hidden="true"></span>';
  if(isD(p))return '<span class="exo-ic d" aria-hidden="true"></span>';
  return `<span class="exo-ic f ${FAM[ext(numeReal(p))]||''}" aria-hidden="true"></span>`;
}
const peStick=(M,p)=>{const u=M.un[p.slice(0,2)];return !!(u&&u.stick)};
const inDoarCitire=(M,d)=>M.dc.some(x=>d===x||sub(d,x));
/* numele liber în folderul d: „Folder nou”, „Folder nou (2)”… / „tema - Copie.docx”, „tema - Copie (2).docx”… (probat, S1, S9) */
function exista(M,p){const t=lc(p);for(const k of M.f.keys())if(lc(k)===t)return k;return null}
function numeLiber(M,d,nume,folder){
  const b=folder?nume:baza(nume),e=folder?'':(ext(nume)?'.'+nume.slice(nume.lastIndexOf('.')+1):'');
  let n=b+e,i=2;while(exista(M,d+n+(folder?'/':'')))n=b+' ('+(i++)+')'+e;return n;
}
function numeCopie(M,d,nume,folder){
  const b=folder?nume:baza(nume),e=folder?'':(ext(nume)?'.'+nume.slice(nume.lastIndexOf('.')+1):'');
  let n=b+' - Copie'+e,i=2;while(exista(M,d+n+(folder?'/':'')))n=b+' - Copie ('+(i++)+')'+e;return n;
}

/* ---------- starea și operațiile ---------- */
function stare(Q){
  const M=model(Q);
  const s={M,cur:Q.start||'PC',sel:null,ist:[Q.start||'PC'],ii:0,exp:new Set(['PC']),clip:null,cos:[],undo:[],cautari:[],caut:null,
    rest:new Set(),edit:null,dlg:null,mn:null,msg:'',av:false,ev:[],init:new Map(),cosInit:0,balon:false};
  (Q.cos||[]).forEach(x=>{s.cos.push({orig:x[0],data:x[1]||'',info:{id:M.nid++,dim:x[2]||'',data:''},sub:[],alAltcuiva:x[3]!=='meu'})});
  s.cosInit=s.cos.filter(e=>e.alAltcuiva).length;
  for(const [p,i] of M.f)s.init.set(p,i.id);
  return s;
}
const ev=(s,tip,cale)=>{s.ev.push({tip,cale});try{window.dispatchEvent(new CustomEvent('explorer-operatii',{detail:{tip,cale}}))}catch(e){}};
function mergi(s,p,faraIstoric){
  const M=s.M;
  if(p!=='PC'&&p!=='COS'&&!M.f.has(p))return 'Folderul nu mai există.';
  if(M.blocat.has(p))return 'În acest Explorer mic nu intrăm în „'+afis(M,p)+'”.';
  s.caut=null;s.cur=p;s.sel=null;s.edit=null;
  if(!faraIstoric){s.ist=s.ist.slice(0,s.ii+1);s.ist.push(p);s.ii=s.ist.length-1}
  let q=p;while(q&&q!=='PC'&&q!=='COS'){s.exp.add(q);q=par(q)}
  return '';
}
const gaseste=(s,n)=>{if(!n)return null;if(s.M.f.has(n))return n;return listaCurenta(s).find(x=>numeReal(x)===n||lc(numeReal(x))===lc(n)||afis(s.M,x)===n)||null};
function listaCurenta(s){if(s.caut)return s.caut.rez.filter(p=>s.M.f.has(p));if(s.cur==='COS')return [];return copii(s.M,s.cur)}
/* mută/copiază un subarbore p -> d+nume */
function subarbore(M,p){return [...M.f.keys()].filter(k=>k===p||sub(k,p))}
function copiazaArbore(s,p,tinta,pastreazaId){
  const M=s.M,ch=subarbore(M,p);
  ch.forEach(k=>{const i=M.f.get(k),nk=tinta+k.slice(p.length);M.f.set(nk,Object.assign({},i,{id:pastreazaId?i.id:M.nid++}))});
}
function stergeArbore(M,p){subarbore(M,p).forEach(k=>M.f.delete(k))}
/* Lipire: întoarce '' sau pornește o fereastră (s.dlg) */
function lipeste(s){
  const M=s.M;
  if(!s.clip)return 'Nu ai nimic de lipit: întâi Copiere sau Decupare.';
  if(s.caut||s.cur==='COS'||s.cur==='PC')return 'Aici nu se poate lipi: intră într-un folder.';
  const src=s.clip.p,d=s.cur,mod=s.clip.mod;
  if(mod==='cut'&&inDoarCitire(M,par(src)))return 'Din acest folder al lui Windows doar copiezi: alege Copiere, nu Decupare. (Pe calculator, Windows ar cere permisiunea administratorului.)';
  /* Copiere ține minte CALEA: dacă între timp elementul a fost redenumit, mutat sau șters, Windows nu-l mai găsește (probat, L1) */
  if(!M.f.has(src))return {dlg:{tip:'negasit',mod,src,d}};
  if(inDoarCitire(M,d))return 'Aici doar citești și copiezi: e un folder al lui Windows. (Pe calculator, Windows ar cere permisiunea administratorului.)';
  if(isD(src)&&(d===src||sub(d,src)))return {dlg:{tip:'eroare',titlu:'1 a întrerupt acțiunea',text:'Folderul destinație este un subfolder al folderului sursă.',src}};
  const nume=numeReal(src);
  if(par(src)===d){
    if(mod==='cut')return '';   /* mutare în același loc: Windows nu face nimic */
    const nn=numeCopie(M,d,nume,isD(src)),tinta=d+nn+(isD(src)?'/':'');
    copiazaArbore(s,src,tinta,false);s.undo.push({t:'copy',p:tinta});s.sel=tinta;ev(s,'copiere',tinta);return '';
  }
  const tinta=d+nume+(isD(src)?'/':''),ex=exista(M,tinta);
  if(ex&&!isD(src)){return {dlg:{tip:'conflict',mod,src,tinta:ex,d}}}
  faLipirea(s,src,tinta,mod);return '';
}
function faLipirea(s,src,tinta,mod){
  const M=s.M;
  if(isD(src)&&M.f.has(tinta)){   /* folder cu același nume: conținutul se adaugă în el (fișierele care se ciocnesc, pe rând) */
    const omise=[];
    copii(M,src).forEach(c=>{const t=tinta+numeReal(c)+(isD(c)?'/':'');if(!exista(M,t)||isD(c))faLipirea(s,c,t,mod);else omise.push(afis(M,c))});
    if(mod==='cut'&&copii(M,src).length===0)M.f.delete(src);
    if(omise.length)s._omise=omise;
  }else{
    if(mod==='cut'){const vechi=subarbore(M,src).map(k=>[k,M.f.get(k)]);stergeArbore(M,src);vechi.forEach(([k,i])=>M.f.set(tinta+k.slice(src.length),i))}
    else copiazaArbore(s,src,tinta,false);
  }
  s.undo.push(mod==='cut'?{t:'move',from:src,to:tinta}:{t:'copy',p:tinta});
  if(mod==='cut')s.clip=null;
  s.sel=tinta;ev(s,mod==='cut'?'mutare':'copiere',tinta);
}
function inlocuieste(s,dlg){
  const M=s.M;stergeArbore(M,dlg.tinta);
  if(dlg.mod==='rest'){restaureaza(s,dlg.k);return}   /* restaurarea peste același nume: elementul din Coș ia locul celui din folder */
  const tinta=dlg.d+numeReal(dlg.src);
  if(dlg.mod==='cut'){const i=M.f.get(dlg.src);M.f.delete(dlg.src);M.f.set(tinta,i);s.clip=null;s.undo.push({t:'move',from:dlg.src,to:tinta});ev(s,'mutare',tinta)}
  else{M.f.set(tinta,Object.assign({},M.f.get(dlg.src),{id:M.nid++}));s.undo.push({t:'copy',p:tinta});ev(s,'inlocuire',tinta)}
  s.sel=tinta;
}
function laCos(s,p){
  const M=s.M,ch=subarbore(M,p).map(k=>[k,M.f.get(k)]);
  stergeArbore(M,p);
  s.cos.push({orig:p,data:M.acum,info:ch.find(x=>x[0]===p)[1],sub:ch.filter(x=>x[0]!==p)});
  /* clipboardul rămâne: o Lipire de acum dă „Element negăsit”, ca în Windows (calea nu mai există) */
  s.undo.push({t:'del',orig:p});if(s.sel===p)s.sel=null;ev(s,'stergere',p);
}
function restaureaza(s,k){
  const M=s.M,e=s.cos[k];if(!e)return 'Nu găsesc elementul în Coș.';
  /* același nume în locația inițială → fereastra „Înlocuire sau omitere fișiere” (probat, L3) */
  const ex0=exista(M,e.orig);if(ex0)return {dlg:{tip:'conflict',mod:'rest',k,src:e.orig,tinta:ex0,d:par(e.orig)}};
  let q=par(e.orig);const lipsa=[];while(q&&q!=='PC'&&!M.f.has(q)){lipsa.push(q);q=par(q)}
  lipsa.reverse().forEach(x=>M.f.set(x,{id:M.nid++,data:M.acum}));
  M.f.set(e.orig,e.info);e.sub.forEach(([kk,i])=>M.f.set(kk,i));
  s.cos.splice(k,1);s.rest.add(e.orig);ev(s,'restaurare',e.orig);return '';
}
function cauta(s,text){
  const M=s.M,t=lc(text).trim();if(!t){s.caut=null;return}
  const baza=s.caut?s.caut.baza:s.cur;
  if(baza==='COS')return;
  const toate=baza==='PC'?[...M.f.keys()]:[...M.f.keys()].filter(k=>sub(k,baza));
  /* prudent (nesigur în Windows): găsește doar dacă textul e începutul numelui sau al unui cuvânt de după spațiu,
     nu orice bucată din mijloc („arm” nu găsește Alarm02; după „_” — neprobat, deci nu) */
  const potriveste=n=>{const x=lc(n);return x.startsWith(t)||x.split(/\s+/).some(w=>w.startsWith(t))||x.includes(' '+t)};
  const rez=toate.filter(k=>!/^[A-Z]:\/$/.test(k)&&potriveste(numeReal(k))).sort((a,b)=>lc(numeReal(a)).localeCompare(lc(numeReal(b)),'ro'));
  s.caut={baza,text,rez};s.cautari.push({baza,text,rez:rez.slice()});s.sel=null;ev(s,'cautare',text);
}
/* Redenumire: întoarce '' (gata), {dlg} (întrebare) sau mesaj */
function redenumeste(s,p,valoare,confirmat){
  const M=s.M;let v=String(valoare).replace(/^\s+/,'').replace(/[\s.]+$/,'');
  const vechi=numeReal(p),dir=isD(p);
  if(INTERZISE.test(v))return MSG_INTERZIS;
  if(!v)return 'gol';
  let nou=v;
  if(!dir&&!M.ext&&TIP[ext(vechi)])nou=v+'.'+vechi.slice(vechi.lastIndexOf('.')+1);   /* extensia ascunsă rămâne la capăt */
  if(nou===vechi)return '';
  if(!dir&&M.ext&&ext(nou)!==ext(vechi)&&!(confirmat&&confirmat.ext))return {dlg:{tip:'extensie',p,v}};
  const tinta=par(p)+nou+(dir?'/':''),ex=exista(M,tinta);
  if(ex&&ex!==p){
    if(!(confirmat&&confirmat.exist))return {dlg:{tip:'renexist',p,v,propus:numeLiber(M,par(p),nou,dir)}};
    nou=numeLiber(M,par(p),nou,dir);
  }
  const t2=par(p)+nou+(dir?'/':'');
  const vechiK=subarbore(M,p).map(k=>[k,M.f.get(k)]);stergeArbore(M,p);vechiK.forEach(([k,i])=>M.f.set(t2+k.slice(p.length),i));
  /* clipboardul ține calea VECHE (probat, L1): o Lipire după redenumire dă „Element negăsit” */
  s.undo.push({t:'ren',from:p,to:t2});s.sel=t2;ev(s,'redenumire',t2);return '';
}
function anuleaza(s){
  const M=s.M,u=s.undo.pop();if(!u)return 'Nimic de anulat.';
  const muta=(a,b)=>{const v=subarbore(M,a).map(k=>[k,M.f.get(k)]);stergeArbore(M,a);v.forEach(([k,i])=>M.f.set(b+k.slice(a.length),i))};
  if(u.t==='move'&&M.f.has(u.to)&&!exista(M,u.from)){muta(u.to,u.from);ev(s,'anulare',u.from);return 'Anulare Mutare: „'+afis(M,u.from)+'” e din nou unde era.'}
  if(u.t==='ren'&&M.f.has(u.to)&&!exista(M,u.from)){muta(u.to,u.from);ev(s,'anulare',u.from);return 'Anulare Redenumire.'}
  if(u.t==='copy'&&M.f.has(u.p)){stergeArbore(M,u.p);ev(s,'anulare',u.p);return 'Anulare Copiere: copia a dispărut.'}
  if(u.t==='del'){const k=s.cos.map(e=>e.orig).lastIndexOf(u.orig);if(k>=0){const r=restaureaza(s,k);if(r&&r.dlg){s.dlg=r.dlg;return ''}if(!r){s.rest.delete(u.orig);return 'Anulare Ștergere: „'+afis(M,u.orig)+'” e din nou la locul lui.'}}}
  if(u.t==='nou'&&M.f.has(u.p)&&copii(M,u.p).length===0){M.f.delete(u.p);return 'Anulare Nou: folderul nou a dispărut.'}
  return 'Nimic de anulat.';
}
function folderNou(s){
  const M=s.M;
  if(s.caut||s.cur==='COS'||s.cur==='PC')return 'Aici nu se poate face un folder: intră într-un folder.';
  if(inDoarCitire(M,s.cur))return 'Aici doar citești și copiezi: e un folder al lui Windows.';
  const n=numeLiber(M,s.cur,'Folder nou',true),p=s.cur+n+'/';
  M.f.set(p,{id:M.nid++,data:M.acum});s.undo.push({t:'nou',p});s.sel=p;s.edit={p,nou:true};ev(s,'folder nou',p);return '';
}
function sterge(s,p,definitiv){
  const M=s.M;if(!p||!M.f.has(p))return 'Selectează întâi ce ștergi: un clic pe el.';
  if(inDoarCitire(M,par(p)))return 'Aici doar citești și copiezi: e un folder al lui Windows. (Pe calculator, Windows ar cere permisiunea administratorului.)';
  if(definitiv||peStick(M,p)){ev(s,'intrebare definitiv',p);return {dlg:{tip:'definitiv',p}}}
  laCos(s,p);return '';
}

/* ---------- operațiile din soluții (poarta + „Arată-mi răspunsul”) ---------- */
function aplica(s,ops){
  (ops||[]).forEach(o=>{
    const [k,a,b]=o;let r='';
    const fa=x=>{if(x&&typeof x==='object'&&x.dlg){s.dlg=x.dlg}else if(x)r=x};
    if(k==='cd')r=mergi(s,a);
    else if(k==='sel'){const p=gaseste(s,a);s.sel=p;if(!p)r='Nu găsesc „'+a+'”.'}
    else if(k==='nou'){fa(folderNou(s));if(s.edit){const p=s.edit.p;s.edit=null;if(a&&a!==numeReal(p))fa(redenumeste(s,p,a))}}
    else if(k==='ren'){const p=gaseste(s,a);if(!p)r='Nu găsesc „'+a+'”.';else{const v=(!isD(p)&&!s.M.ext&&TIP[ext(numeReal(p))])?baza(b):b;fa(redenumeste(s,p,v))}}
    else if(k==='copy'||k==='cut'){const p=gaseste(s,a);if(p){s.clip={mod:k,p};s.sel=p}else r='Nu găsesc „'+a+'”.'}
    else if(k==='paste')fa(lipeste(s));
    else if(k==='omite'){if(s.dlg&&s.dlg.tip==='conflict')s.dlg=null}
    else if(k==='inlocuieste'){if(s.dlg&&s.dlg.tip==='conflict'){const d=s.dlg;s.dlg=null;inlocuieste(s,d)}}
    else if(k==='nu'&&s.dlg&&s.dlg.tip==='negasit')s.dlg=null;
    else if(k==='del'||k==='shiftdel'){const p=gaseste(s,a);fa(sterge(s,p,k==='shiftdel'))}
    else if(k==='da'){if(s.dlg&&s.dlg.tip==='definitiv'){const p=s.dlg.p;s.dlg=null;stergeArbore(s.M,p);if(s.sel===p)s.sel=null;ev(s,'stergere definitiva',p)}}
    else if(k==='nu')s.dlg=null;
    else if(k==='rest'){const i=s.cos.map(e=>e.orig).lastIndexOf(a);fa(restaureaza(s,i))}
    else if(k==='cauta')cauta(s,a);
    else if(k==='undo')anuleaza(s);
    if(r){s.msg=r;s.av=true}
  });
}
function test(Q,s,c){
  const M=s.M;
  if(c.are)return !!M.f.has(c.are)||!!exista(M,c.are);
  if(c.nu)return !exista(M,c.nu);
  if(c.in)return !s.caut&&s.cur===c.in;
  if(c.sel)return s.sel===c.sel;
  if(c.cos)return s.cos.some(e=>e.orig===c.cos);
  if(c.restaurat)return s.rest.has(c.restaurat)&&M.f.has(c.restaurat);
  if(c.gasit)return s.cautari.some(x=>x.rez.includes(c.gasit)&&(!c.cautat||lc(x.text).includes(lc(c.cautat))));
  if(c.neatins)return M.f.has(c.neatins)&&s.init.get(c.neatins)===M.f.get(c.neatins).id;
  if(c.cosNeatins)return s.cos.filter(e=>e.alAltcuiva).length===s.cosInit;
  if(c.copii)return M.f.has(c.copii)&&copii(M,c.copii).length===c.n;
  if(c.intrebat)return s.ev.some(e=>e.tip==='intrebare definitiv');
  if(c.toate)return c.toate.every(x=>test(Q,s,x));
  return false;
}

/* ---------- desenul ---------- */
function titluCur(s){const M=s.M;if(s.caut)return 'Rezultatele căutării în '+afis(M,s.caut.baza);return afis(M,s.cur)}
function segmente(M,p){
  if(p==='COS')return ['COS'];if(p==='PC')return ['PC'];
  if(M.doc&&(p===M.doc||sub(p,M.doc))){const out=[];let q=p;while(q&&q!==par(M.doc)){out.unshift(q);q=par(q)}return out}
  const out=[];let q=p;while(q&&q!==''){out.unshift(q);if(q==='PC')break;q=par(q)}return out;
}
function desen(Q,body,api,s){
  const M=s.M,E=api.esc;
  /* arborele */
  const arb=[];
  const rand=(p,niv)=>{
    const k=p==='PC'?copii(M,'PC'):copii(M,p).filter(isD);
    const are=k.length>0&&!M.blocat.has(p),desch=s.exp.has(p);
    arb.push(`<div class="r" style="padding-left:${niv*12}px"><button type="button" class="chev ${are?'':'nimic'}" data-exp="${E(p)}" aria-label="${desch?'Restrânge':'Extinde'} ${E(afis(M,p))}" tabindex="-1">${desch?'⌄':'›'}</button><button type="button" class="nm ${!s.caut&&s.cur===p?'on':''}" data-nav="${E(p)}" tabindex="-1">${icon(M,p)}<span class="t">${E(afis(M,p))}</span></button></div>`);
    if(are&&desch)k.forEach(x=>rand(x,niv+1));
  };
  if(M.doc&&M.f.has(M.doc)){rand(M.doc,0);arb.push('<div class="sp"></div>')}
  rand('PC',0);
  /* lista */
  let lista;const L=listaCurenta(s);
  if(s.cur==='COS'&&!s.caut){
    lista=`<div class="exo-cap cosc"><span>Nume</span><span class="dt">Data ștergerii</span><span class="p">Locație inițială</span><span class="z">Dimensiune</span></div>`+
      (s.cos.length?s.cos.map((e,i)=>`<button type="button" class="exo-rand cosr ${s.sel==='cos:'+i?'on':''}" data-cos="${i}"><span class="n">${icon(M,e.orig)}<span class="t">${E(afis(M,e.orig))}</span></span><span class="dt">${E(e.data)}</span><span class="p">${E(cuBackslash(par(e.orig)))}</span><span class="z">${isD(e.orig)?'':E(e.info.dim||'')}</span></button>`).join(''):'<div class="exo-gol">Coșul de reciclare e gol.</div>');
  }else if(s.cur==='PC'&&!s.caut){
    lista=`<div class="exo-grup">Dispozitive și unități</div>`+L.map(p=>`<button type="button" class="exo-rand ${s.sel===p?'on':''}" data-p="${E(p)}"><span class="n">${icon(M,p)}<span class="t">${E(afis(M,p))}</span></span><span class="dt"></span><span class="p">${E(tipText(M,p))}</span><span class="z"></span></button>`).join('');
  }else{
    lista=`<div class="exo-cap"><span>Nume</span><span class="dt">Data modificării</span><span class="p">Tip</span><span class="z">Dimensiune</span></div>`+
      (L.length?L.map(p=>{const i=M.f.get(p)||{},ed=s.edit&&s.edit.p===p,taiat=s.clip&&s.clip.mod==='cut'&&s.clip.p===p;
        const nume=ed?`<input class="exo-ren" type="text" value="${E(afis(M,p))}" aria-label="Numele nou" autocomplete="off" autocapitalize="off" spellcheck="false">`:`<span class="t">${E(afis(M,p))}</span>`;
        return `<div role="button" tabindex="-1" class="exo-rand ${s.sel===p?'on':''} ${taiat?'taiat':''}" data-p="${E(p)}"><span class="n">${icon(M,p)}${nume}</span><span class="dt">${E(i.data||'')}</span><span class="p">${E(tipText(M,p))}</span><span class="z">${isD(p)?'':E(i.dim||'')}</span></div>`}).join('')
       :`<div class="exo-gol">${s.caut?'Niciun element nu se potrivește cu căutarea.':'Acest folder este gol.'}</div>`);
  }
  /* bara de adresă */
  const segs=s.caut?[s.caut.baza]:segmente(M,s.cur);
  const bara=`<div class="exo-bara" title="Bara de adresă">${icon(M,segs[0]==='PC'||segs[0]==='COS'?segs[0]:'PC')}<span class="sag">›</span>${segs.map((p,i)=>`<button type="button" class="seg" data-nav="${E(p)}" tabindex="-1">${E(afis(M,p))}</button>${i<segs.length-1?'<span class="sag">›</span>':''}`).join('')}${s.caut?`<span class="sag">›</span><span class="seg" style="cursor:default">Rezultatele căutării</span>`:''}<span class="gol"></span></div>`;
  const areSel=!!s.sel&&s.sel!=='PC'&&!/^[A-Z]:\/$/.test(s.sel||'')&&!String(s.sel).startsWith('cos:');
  const inCos=s.cur==='COS'&&!s.caut;
  const cmd=inCos?`<div class="exo-cmd" role="toolbar" aria-label="Bara de comenzi">
      <button type="button" data-c="gol" ${s.cos.length?'':'disabled'} title="Golire Coș de reciclare">${SVG.gol}<span>Golire Coș de reciclare</span></button>
      <button type="button" data-c="resttot" ${s.cos.length?'':'disabled'} title="Restaurare totală elemente">${SVG.rest}<span>Restaurare totală elemente</span></button>
      <button type="button" data-c="restsel" ${String(s.sel).startsWith('cos:')?'':'disabled'} title="Restaurare elemente selectate">${SVG.rest}<span>Restaurare elemente selectate</span></button>
    </div>`:`<div class="exo-cmd" role="toolbar" aria-label="Bara de comenzi">
      <button type="button" class="nou" data-c="nou" title="Nou" ${s.caut||s.cur==='PC'?'disabled':''}>${SVG.nou}<span>Nou ▾</span></button><span class="sep"></span>
      <button type="button" data-c="cut" ${areSel?'':'disabled'} title="Decupare (Ctrl+X)">${SVG.cut}<span>Decupare</span></button>
      <button type="button" data-c="copy" ${areSel?'':'disabled'} title="Copiere (Ctrl+C)">${SVG.copy}<span>Copiere</span></button>
      <button type="button" data-c="paste" ${s.clip&&!s.caut&&s.cur!=='PC'?'':'disabled'} title="Lipire (Ctrl+V)">${SVG.paste}<span>Lipire</span></button>
      <button type="button" data-c="ren" ${areSel?'':'disabled'} title="Redenumire (F2)">${SVG.ren}<span>Redenumire</span></button>
      <button type="button" data-c="del" ${areSel?'':'disabled'} title="Ștergere (Ctrl+D)">${SVG.del}<span>Ștergere</span></button>
    </div>`;
  const teste=(Q.checks||[]).map(c=>test(Q,s,c));
  const nr=s.cur==='COS'?s.cos.length:L.length;
  const st=s.msg||(nr+(nr===1?' element':' elemente')+(s.sel&&!String(s.sel).startsWith('cos:')&&s.sel!=='PC'?' · 1 element selectat':'')+(s.clip?' · ținut minte pentru Lipire: '+afis(M,s.clip.p)+(s.clip.mod==='cut'?' (decupat)':' (copiat)'):''));
  body.innerHTML=`<p class="exo-mic" style="margin:0 0 6px">Un Explorer mic, în pagină. <b>Clic dreapta</b> (pe telefon: ține degetul apăsat pe rând) deschide meniul. Sub pictogramele de sus scrie numele lor: în Windows îl vezi ținând mouse-ul pe pictogramă. Tragerea cu mouse-ul și selectarea mai multor fișiere deodată nu merg aici.</p>
  <div class="exo" tabindex="0" role="application" aria-label="Explorer simulat">
    <div class="exo-tit">${icon(M,s.caut?s.caut.baza:s.cur)} <b>${E(titluCur(s))}</b> — Explorer</div>
    <div class="exo-adr"><div class="exo-nav3"><button type="button" data-n="ina" aria-label="Înapoi (Alt + săgeată la stânga)" ${s.caut||s.ii>0?'':'disabled'} tabindex="-1">←</button><button type="button" data-n="inf" aria-label="Înainte (Alt + săgeată la dreapta)" ${s.ii<s.ist.length-1&&!s.caut?'':'disabled'} tabindex="-1">→</button><button type="button" data-n="sus" aria-label="Un nivel mai sus (Alt + săgeată în sus)" ${!s.caut&&par(s.cur)?'':'disabled'} tabindex="-1">↑</button></div>${bara}
      <div class="exo-caut"><input type="search" class="exo-ci" placeholder="Căutați în ${E(afis(M,s.caut?s.caut.baza:s.cur))}" value="${E(s.caut?s.caut.text:'')}" aria-label="Caseta de căutare" ${s.cur==='COS'?'disabled':''}><button type="button" data-c="cautX" aria-label="${s.caut?'Închide căutarea':'Caută'}" tabindex="-1">${s.caut?'✕':'⌕'}</button></div></div>
    ${cmd}
    <div class="exo-corp"><div class="exo-arb" aria-label="Panoul de navigare">${arb.join('')}</div><div class="exo-lista">${lista}</div></div>
    <div class="exo-stare ${s.av?'av':''}" aria-live="polite">${E(st)}</div>
    ${Q.desktop===false?'':`<div class="exo-desk">Desktop: <button type="button" data-cos-desk="1" title="Dublu-clic: deschide Coșul de reciclare">${icon(M,'COS')} Coș de reciclare</button><span>(dublu-clic)</span></div>`}
    ${s.mn?meniuHTML(s,E):''}
    ${s.dlg?dialogHTML(s,E):''}
  </div>
  ${(Q.checks||[]).length?`<div class="exo-teste"><b>Testele sarcinii</b> (se bifează singure):<ol>${(Q.checks||[]).map((c,i)=>`<li class="${teste[i]?'ok':''}"><span class="s">${teste[i]?'✔':'○'}</span><span>${c.ce}</span></li>`).join('')}</ol><button type="button" class="exo-reia" data-reia="1">↺ Reîncep exercițiul</button></div>`:''}`;
  body._exo={s,Q,api};
  leaga(Q,body,api,s);
}
function meniuHTML(s,E){
  const m=s.mn,M=s.M;let h='';
  const ic=(c,svg,n,dis)=>`<button type="button" data-m="${c}" ${dis?'disabled':''} title="${n}">${svg}<span>${n}</span></button>`;
  if(m.tip==='cos'){
    h=`<div class="rand-ic">${ic('cut',SVG.cut,'Decupare')}${ic('cosdel',SVG.del,'Ștergere')}</div>
      <button type="button" class="it" data-m="restsel">Restaurare</button><button type="button" class="it" data-m="prop">Proprietăți <small>Alt+Enter</small></button><div class="sp"></div><button type="button" class="it" data-m="mai">Afișați mai multe opțiuni</button>`;
  }else if(m.tip==='el'){
    h=`<div class="rand-ic">${ic('cut',SVG.cut,'Decupare')}${ic('copy',SVG.copy,'Copiere')}${ic('ren',SVG.ren,'Redenumire')}${ic('share',SVG.share,'Partajare',true)}${ic('del',SVG.del,'Ștergere')}</div>
      <button type="button" class="it" data-m="desch">Deschidere <small>Enter</small></button><button type="button" class="it" data-m="prop">Proprietăți <small>Alt+Enter</small></button><div class="sp"></div><button type="button" class="it" data-m="mai">Afișați mai multe opțiuni</button>`;
  }else if(m.tip==='nou'){
    h=`<button type="button" class="it" data-m="nouf"><span style="display:flex;gap:8px;align-items:center"><span class="exo-ic d" aria-hidden="true"></span>Folder</span></button><div class="exo-mic" style="padding:2px 10px 4px;margin:0">În Windows, sub Folder urmează și alte tipuri de fișiere: azi facem doar foldere.</div>`;
  }else{
    h=`${s.clip?`<div class="rand-ic">${ic('paste',SVG.paste,'Lipire')}</div>`:''}
      <button type="button" class="it" data-m="viz">Vizualizare <small>›</small></button><button type="button" class="it" data-m="viz">Sortați după <small>›</small></button><button type="button" class="it" data-m="viz">Grupare după <small>›</small></button><div class="sp"></div>
      <button type="button" class="it" data-m="noum">Nou <small>›</small></button>
      <div class="sp"></div><button type="button" class="it" data-m="prop">Proprietăți <small>Alt+Enter</small></button><button type="button" class="it" data-m="mai">Afișați mai multe opțiuni</button>`;
  }
  return `<div class="exo-mn" role="menu" style="left:${m.x}px;top:${m.y}px">${h}</div>`;
}
function dialogHTML(s,E){
  const d=s.dlg,M=s.M;
  const tit=t=>`<div class="t"><span>${E(t)}</span><button type="button" data-d="x" aria-label="Închidere">✕</button></div>`;
  if(d.tip==='negasit'){
    const verb=d.mod==='cut'?'Se mută':'Se copiază';
    return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog" aria-label="Element negăsit">${tit('Element negăsit')}<div class="c">
      <p class="mare">Imposibil de găsit acest element</p>
      <p>Nu se mai află în ${E(cuBackslash(par(d.src)))}. Verificați locația elementului și încercați din nou.</p>
      <p>${icon(M,d.src)} ${E(afis(M,d.src))}</p><p class="exo-mic" style="margin:0">${verb} 1 element de la ${E(afis(M,par(d.src)))} la ${E(afis(M,d.d))}</p></div>
      <div class="bt"><button type="button" class="implicit" data-d="reincerc">Încercați din nou</button><button type="button" data-d="nu">Anulare</button></div></div></div>`;
  }
  if(d.tip==='conflict'){
    const verb=d.mod==='cut'?'Se mută':'Se copiază';
    return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog" aria-label="Înlocuire sau omitere fișiere">${tit('Înlocuire sau omitere fișiere')}<div class="c">
      <p>${d.mod==='rest'?`Se mută un element la <b>Restaurare</b>`:`${verb} 1 element de la <b>${E(afis(M,par(d.src)))}</b> la <b>${E(afis(M,d.d))}</b>`}</p>
      <p class="mare">Destinația are deja un fișier cu numele „${E(d.mod==='rest'?numeCos(d.tinta):numeReal(d.tinta))}”</p>
      <button type="button" class="opt implicit" data-d="inloc">✓ Înlocuire fișier de la destinație</button>
      <button type="button" class="opt" data-d="omite">↶ Se omite acest fișier</button>
      <button type="button" class="opt" data-d="comp">⇆ Comparați informațiile pentru ambele fișiere</button></div></div></div>`;
  }
  if(d.tip==='definitiv'){
    const f=isD(d.p);
    return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog" aria-label="${f?'Ștergere folder':'Ștergere fișier'}">${tit(f?'Ștergere folder':'Ștergere fișier')}<div class="c"><p class="mare">Sigur ștergeți definitiv ${f?'acest folder':'acest fișier'}?</p><p>${icon(M,d.p)} ${E(afis(M,d.p))}</p></div>
      <div class="bt"><button type="button" class="implicit" data-d="da">Da</button><button type="button" data-d="nu">Nu</button></div></div></div>`;
  }
  if(d.tip==='extensie')return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog" aria-label="Redenumire">${tit('Redenumire')}<div class="c"><p>Dacă modificați extensia unui fișier, acesta poate deveni inutilizabil.</p><p>Sigur modificați extensia?</p></div><div class="bt"><button type="button" class="implicit" data-d="extda">Da</button><button type="button" data-d="extnu">Nu</button></div></div></div>`;
  if(d.tip==='renexist'){const f=isD(d.p),tt=f?'Redenumire folder':'Redenumire fișier';   /* shell32 16885/17041 la folder */
    return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog" aria-label="${tt}">${tit(tt)}<div class="c"><p class="mare">Această locație conține deja ${f?'un folder':'un fișier'} cu același nume.</p><p>Redenumiți „${E(numeReal(d.p))}” ca „${E(d.propus)}”?</p></div><div class="bt"><button type="button" class="implicit" data-d="renda">Da</button><button type="button" data-d="rennu">Nu</button></div></div></div>`;}
  if(d.tip==='cosconf')return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog">${tit(d.titlu)}<div class="c"><p class="mare">${E(d.text)}</p></div><div class="bt"><button type="button" class="implicit" data-d="cosda">Da</button><button type="button" data-d="nu">Nu</button></div></div></div>`;
  return `<div class="exo-dlg-fond"><div class="exo-dlg" role="dialog">${tit(d.titlu||'Explorer')}<div class="c"><p class="mare">${E(d.text||'')}</p></div><div class="bt"><button type="button" class="implicit" data-d="nu">Anulare</button></div></div></div>`;
}

function leaga(Q,body,api,s){
  const M=s.M,x=body.querySelector('.exo');
  const re=focus=>{s._t=Date.now();desen(Q,body,api,s);const y=body.querySelector(focus||'.exo');if(y)y.focus({preventScroll:true});
    if(s.edit){const inp=body.querySelector('.exo-ren');if(inp){inp.focus({preventScroll:true});const v=inp.value,p=s.edit.p;const end=(!isD(p)&&M.ext&&v.lastIndexOf('.')>0)?v.lastIndexOf('.'):v.length;try{inp.setSelectionRange(0,end)}catch(e){}}}
    const dl=body.querySelector('.exo-dlg .implicit');if(dl)dl.focus({preventScroll:true});};
  const mesaj=(t,av)=>{s.msg=t||'';s.av=!!av};
  const rez=(r,cand)=>{if(r&&typeof r==='object'&&r.dlg){s.dlg=r.dlg;s.mn=null}else if(r)mesaj(r,true);else if(cand)mesaj(cand)};
  const deschide=p=>{if(p==='COS'||p==='PC'||isD(p)||/^[A-Z]:\/$/.test(p)){mesaj(mergi(s,p),true);s.av=!!s.msg}else mesaj('Azi nu deschidem fișiere: lucrăm doar cu ele (copiere, mutare…).',true);re()};
  const act=(c)=>{
    s.mn=null;s.msg='';s.av=false;
    const p=s.sel&&!String(s.sel).startsWith('cos:')?s.sel:null;
    if(c==='noum'){s.mn={tip:'nou',x:Math.min((s._mx||10)+40,Math.max(4,x.getBoundingClientRect().width-240)),y:(s._my||110)+70};re();return}
    if(c==='nouf'){rez(folderNou(s));re();return}
    if(c==='cut'||c==='copy'){if(String(s.sel).startsWith('cos:')&&c==='cut'){mesaj('Din Coș pui înapoi cu Restaurare.',true);re();return}
      if(!p){mesaj('Selectează întâi un fișier sau un folder: un clic pe el.',true);re();return}s.clip={mod:c,p};mesaj((c==='cut'?'Decupat: ':'Copiat: ')+afis(M,p)+'. Acum intră în folderul unde îl vrei și alege Lipire.');re();return}
    if(c==='paste'){rez(lipeste(s));
      if(s._omise){mesaj('În Windows ar apărea, pentru fiecare fișier cu același nume („'+s._omise.join('”, „')+'”), fereastra Înlocuire sau omitere fișiere. Aici s-au omis: au rămas cele care erau acolo.',true);s._omise=null}
      re();return}
    if(c==='ren'){if(!p){mesaj('Selectează întâi ce redenumești: un clic pe el.',true);re();return}if(inDoarCitire(M,par(p))){mesaj('Aici doar citești și copiezi: e un folder al lui Windows.',true);re();return}s.edit={p};re();return}
    if(c==='del'){rez(sterge(s,p,false));re();return}
    if(c==='desch'){if(p)deschide(p);return}
    if(c==='share')return;
    if(c==='prop'){mesaj('Proprietățile nu le folosim azi.',true);re();return}
    if(c==='viz'){mesaj('Vizualizarea și sortarea nu le schimbăm azi: rămâne lista cu detalii.',true);re();return}
    if(c==='mai'){mesaj('În Windows, „Afișați mai multe opțiuni” arată meniul vechi, cu aceleași comenzi scrise: Decupare, Copiere, Ștergere, Redenumire, Lipire.',true);re();return}
    if(c==='restsel'){const k=String(s.sel).startsWith('cos:')?+String(s.sel).slice(4):-1;rez(restaureaza(s,k));if(!s.msg&&!s.dlg)mesaj('Restaurat: elementul e din nou în folderul lui.');s.sel=null;re();return}
    if(c==='cosdel'){const k=String(s.sel).startsWith('cos:')?+String(s.sel).slice(4):-1;if(k>=0)s.dlg={tip:'cosconf',titlu:isD(s.cos[k].orig)?'Ștergere folder':'Ștergere fișier',text:'Sigur ștergeți definitiv '+(isD(s.cos[k].orig)?'acest folder':'acest fișier')+'?',fa:'unul',k};re();return}
    if(c==='gol'){s.dlg={tip:'cosconf',titlu:'Ștergere mai multe elemente',text:'Sigur ștergeți definitiv aceste '+s.cos.length+' elemente?',fa:'gol'};re();return}
    if(c==='resttot'){s.dlg={tip:'cosconf',titlu:'Coș de reciclare',text:'Sigur restaurați toate elementele șterse din coșul de reciclare?',fa:'tot'};re();return}
  };
  /* dialogul */
  body.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{
    const d=s.dlg,k=b.dataset.d;s.dlg=null;
    if(k==='inloc'&&d)inlocuieste(s,d),mesaj('Ai ÎNLOCUIT fișierul din destinație: cel vechi s-a pierdut.',true);
    else if(k==='omite')mesaj(d&&d.mod==='rest'?'Ai omis: elementul a rămas în Coș, iar fișierul din folder e neatins.':'Ai omis fișierul: în destinație a rămas fișierul care era acolo.');
    else if(k==='reincerc'&&d){rez(lipeste(s))}
    else if(k==='nu'&&d&&d.tip==='negasit')mesaj('Nu s-a lipit nimic: Copiere ține minte numele de atunci, iar fișierul nu mai e acolo. Un clic pe el, în locul lui de acum, și apasă din nou Copiere.',true);
    else if(k==='comp'){s.dlg=d;mesaj('În pagină nu comparăm: alege una dintre primele două variante.',true)}
    else if(k==='da'&&d){stergeArbore(M,d.p);if(s.sel===d.p)s.sel=null;ev(s,'stergere definitiva',d.p);mesaj('Șters definitiv: nu mai e nici în Coș.',true)}
    else if(k==='extda'&&d){rez(redenumeste(s,d.p,d.v,{ext:true}))}
    else if(k==='extnu'&&d){s.edit={p:d.p,val:d.v}}
    else if(k==='renda'&&d){rez(redenumeste(s,d.p,d.v,{exist:true,ext:true}))}
    else if(k==='rennu'&&d){s.edit={p:d.p,val:d.v}}
    else if(k==='cosda'&&d){
      if(d.fa==='unul'){const e=s.cos.splice(d.k,1)[0];ev(s,'stergere definitiva',e&&e.orig);s.sel=null}
      else if(d.fa==='gol'){s.cos=[];ev(s,'golire cos','COS');mesaj('Coșul e gol: tot ce era în el, și al altora, s-a șters definitiv.',true)}
      else if(d.fa==='tot'){for(let i=s.cos.length-1;i>=0;i--)restaureaza(s,i);
        mesaj('Toate elementele, și ale altora, s-au întors în folderele lor.'+(s.cos.length?' Cele cu un nume care exista deja au rămas în Coș (în Windows, fereastra Înlocuire sau omitere te-ar fi întrebat).':''),true)}}
    else if(k==='x'||k==='nu'){if(d&&(d.tip==='conflict'||d.tip==='negasit'))mesaj('Ai închis fereastra: nu s-a lipit nimic.')}
    re();
  });
  /* arborele, bara, navigarea */
  body.querySelectorAll('[data-exp]').forEach(b=>b.onclick=()=>{const p=b.dataset.exp;if(s.exp.has(p))s.exp.delete(p);else s.exp.add(p);re()});
  body.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{s.mn=null;mesaj(mergi(s,b.dataset.nav),true);s.av=!!s.msg;re()});
  body.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{
    const n=b.dataset.n;s.mn=null;
    if(n==='ina'){if(s.caut){s.caut=null;s.sel=null}else if(s.ii>0){s.ii--;mesaj(mergi(s,s.ist[s.ii],true),true);s.av=!!s.msg}}
    else if(n==='inf'){if(s.ii<s.ist.length-1){s.ii++;mesaj(mergi(s,s.ist[s.ii],true),true);s.av=!!s.msg}}
    else if(n==='sus'){const u=par(s.cur);if(u)mesaj(mergi(s,u),true),s.av=!!s.msg}
    re()});
  body.querySelectorAll('[data-c]').forEach(b=>b.onclick=ev2=>{const c=b.dataset.c;
    if(c==='cautX'){if(s.caut){s.caut=null;s.sel=null;re()}else{const ci=body.querySelector('.exo-ci');if(ci&&ci.value.trim()){cauta(s,ci.value);re()}else if(ci)ci.focus()}return}
    if(c==='nou'){const r=b.getBoundingClientRect(),o=x.getBoundingClientRect();s.mn={tip:'nou',x:Math.max(4,Math.min(r.left-o.left,o.width-240)),y:r.bottom-o.top+2};s.msg='';re();return}
    act(c)});
  body.querySelectorAll('[data-m]').forEach(b=>b.onclick=e=>{e.stopPropagation();act(b.dataset.m)});
  const reia=body.querySelector('[data-reia]');
  if(reia)reia.onclick=()=>{const n=stare(Q);n.msg='Ai reînceput: Explorer-ul e ca la începutul exercițiului.';desen(Q,body,api,n);const y=body.querySelector('.exo');if(y)y.focus({preventScroll:true})};
  const deskB=body.querySelector('[data-cos-desk]');
  if(deskB){let t0=0;deskB.onclick=()=>{const t=Date.now();if(t-t0<500){s.mn=null;mergi(s,'COS');s.msg='Coșul de reciclare: aici stă ce ai șters cu Delete.';s.av=false;re()}else{t0=t;const st=body.querySelector('.exo-stare');if(st)st.textContent='Coșul se deschide cu dublu-clic: două clicuri repede.'}}}
  /* rândurile: clic = selectare, dublu-clic = deschidere, clic dreapta / ținut apăsat = meniu */
  const lst=body.querySelector('.exo-lista');
  const meniu=(tip,ex,ey)=>{const o=x.getBoundingClientRect();const w=230,h=tip==='fond'?260:230;
    let mx=ex-o.left,my=ey-o.top;mx=Math.max(4,Math.min(mx,o.width-w-4));my=Math.max(4,Math.min(my,o.height-h-4));s._mx=mx;s._my=my;s.mn={tip,x:mx,y:my};s.msg='';s.av=false;re()};
  body.querySelectorAll('[data-p]').forEach(b=>{const p=b.dataset.p;
    b.onclick=e=>{if(s.edit&&s.edit.p===p)return;if(Date.now()-(s._lp||0)<800)return;if(Date.now()-(s._trT||0)<400)return;const t=Date.now();s.mn=null;
      if(e.ctrlKey||e.shiftKey||e.metaKey){s.sel=p;mesaj('Aici selectezi câte un singur element. (În Windows, Ctrl și clic ar adăuga la selecție.) Lucrezi pe rând, cu fiecare.',true);re();return}
      if(s._ultim===p&&t-(s._tc||0)<450){s._ultim=null;deschide(p);return}
      s._ultim=p;s._tc=t;s.sel=p;s.msg='';s.av=false;if(s.edit)gataRen();re()};
    b.oncontextmenu=e=>{e.preventDefault();if(Date.now()-(s._lp||0)<800)return;s.sel=p;meniu(s.cur==='PC'&&!s.caut?'fond':'el',e.clientX,e.clientY)};
  });
  body.querySelectorAll('[data-cos]').forEach(b=>{const k=+b.dataset.cos;
    b.onclick=()=>{if(Date.now()-(s._lp||0)<800)return;s.sel='cos:'+k;s.mn=null;s.msg='';re()};
    b.oncontextmenu=e=>{e.preventDefault();if(Date.now()-(s._lp||0)<800)return;s.sel='cos:'+k;meniu('cos',e.clientX,e.clientY)}});
  if(lst){
    lst.oncontextmenu=e=>{if(e.target.closest('[data-p],[data-cos]'))return;e.preventDefault();if(Date.now()-(s._lp||0)<800)return;if(s.cur==='COS'||s.caut||s.cur==='PC')return;s.sel=null;meniu('fond',e.clientX,e.clientY)};
    lst.onclick=e=>{if(e.target===lst||e.target.classList.contains('exo-gol')){s.sel=null;s.mn=null;if(s.edit)gataRen();re()}};
    /* ținut apăsat pe telefon (550 ms, fără mișcare) = clic dreapta */
    let tm=null,sx=0,sy=0;
    lst.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;sx=e.clientX;sy=e.clientY;const r=e.target.closest('[data-p],[data-cos]');clearTimeout(tm);
      tm=setTimeout(()=>{s._lp=Date.now();
        /* degetul ridicat după ținut apăsat dă un „clic”: nu-l lăsăm să apese ceva din meniul abia deschis */
        document.addEventListener('click',e=>{if(Date.now()-s._lp<1200){e.stopPropagation();e.preventDefault()}},{capture:true,once:true});
        sx+=8;sy+=8;
        if(r&&r.dataset.p){s.sel=r.dataset.p;meniu(s.cur==='PC'&&!s.caut?'fond':'el',sx,sy)}else if(r&&r.dataset.cos){s.sel='cos:'+r.dataset.cos;meniu('cos',sx,sy)}else if(s.cur!=='COS'&&!s.caut&&s.cur!=='PC'){s.sel=null;meniu('fond',sx,sy)}},550)});
    ['pointerup','pointercancel','pointerleave'].forEach(t=>lst.addEventListener(t,()=>clearTimeout(tm)));
    lst.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10)clearTimeout(tm)});
    /* tragerea cu MOUSE-ul: nu o facem; spunem pe ecran de ce (în Windows, pe același disc mută, pe alt disc copiază) */
    let tr=null;
    lst.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('.exo-ren'))return;const r=e.target.closest('[data-p]');tr=r?{x:e.clientX,y:e.clientY,p:r.dataset.p,mers:false}:null});
    x.addEventListener('pointermove',e=>{if(tr&&!tr.mers&&(e.buttons&1)&&(Math.abs(e.clientX-tr.x)>12||Math.abs(e.clientY-tr.y)>12))tr.mers=true});
    x.addEventListener('pointerup',()=>{const t=tr;tr=null;if(!t||!t.mers)return;s._trT=Date.now();s.sel=t.p;s.mn=null;
      mesaj('Tragerea cu mouse-ul nu o facem azi: în Windows, pe același disc, ar MUTA fișierul (pe alt disc l-ar copia). Folosește Decupare sau Copiere, apoi Lipire.',true);re()});
  }
  /* clic în afara meniului îl închide */
  x.addEventListener('pointerdown',e=>{if(s.mn&&!e.target.closest('.exo-mn')&&!e.target.closest('[data-c="nou"]')){s.mn=null;const m=body.querySelector('.exo-mn');if(m)m.remove()}},true);
  /* redenumirea în rând */
  const inp=body.querySelector('.exo-ren');
  function gataRen(){const i=body.querySelector('.exo-ren');if(!i||!s.edit)return;const p=s.edit.p,v=i.value;s.edit=null;const r=redenumeste(s,p,v);
    if(r==='gol'){mesaj('Numele nu poate fi gol: a rămas „'+afis(M,p)+'”.',true)}else rez(r)}
  if(inp){
    if(s.edit&&s.edit.val!=null){inp.value=s.edit.val}
    inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();gataRen();re()}else if(e.key==='Escape'){e.preventDefault();s.edit=null;mesaj('Redenumirea s-a anulat: numele a rămas cel vechi.');re()}});
    inp.addEventListener('input',()=>{if(INTERZISE.test(inp.value)){const c=inp.selectionStart;inp.value=inp.value.replace(/[\\/:*?"<>|]/g,'');try{inp.setSelectionRange(c-1,c-1)}catch(e){}
      let bl=body.querySelector('.exo-balon');if(!bl){bl=document.createElement('div');bl.className='exo-balon';bl.setAttribute('role','alert');inp.closest('.exo-rand').after(bl)}bl.textContent=MSG_INTERZIS;clearTimeout(s._bt);s._bt=setTimeout(()=>{if(bl.isConnected)bl.remove()},5000)}});
    inp.addEventListener('blur',()=>{setTimeout(()=>{if(s.edit&&body.contains(inp)&&document.activeElement!==inp&&!s.dlg){gataRen();re()}},120)});
  }
  /* căutarea */
  const ci=body.querySelector('.exo-ci');
  if(ci){ci.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();cauta(s,ci.value);re()}else if(e.key==='Escape'){e.preventDefault();s.caut=null;re()}});}
  /* tastele, ca în Explorer */
  x.addEventListener('keydown',e=>{
    if(e.target.closest('.exo-ren,.exo-ci'))return;
    const k=e.key,c=e.ctrlKey||e.metaKey,kl=k.length===1?k.toLowerCase():k;
    if(s.dlg){if(k==='Escape'){e.preventDefault();const d=s.dlg;s.dlg=null;if(d.tip==='conflict'||d.tip==='negasit')mesaj('Ai închis fereastra: nu s-a lipit nimic.');re()}return}
    if(k==='Escape'&&s.mn){e.preventDefault();s.mn=null;re();return}
    if(c&&e.shiftKey&&kl==='n'){e.preventDefault();act('nouf');return}
    if(c&&kl==='c'){e.preventDefault();act('copy');return}
    if(c&&kl==='x'){e.preventDefault();act('cut');return}
    if(c&&kl==='v'){e.preventDefault();act('paste');return}
    if(c&&kl==='z'){e.preventDefault();mesaj(anuleaza(s));re();return}
    if(c&&(kl==='e'||kl==='f')||k==='F3'){e.preventDefault();const y=body.querySelector('.exo-ci');if(y)y.focus();return}
    if(k==='F2'){e.preventDefault();act('ren');return}
    if(k==='Delete'||(c&&kl==='d')){e.preventDefault();if(String(s.sel).startsWith('cos:'))act('cosdel');else if(e.shiftKey&&k==='Delete'){rez(sterge(s,s.sel,true));re()}else act('del');return}
    if(k==='Enter'){if(s.sel&&!String(s.sel).startsWith('cos:')){e.preventDefault();deschide(s.sel)}return}
    if(k==='Backspace'||(e.altKey&&k==='ArrowLeft')){e.preventDefault();if(s.caut){s.caut=null;s.sel=null}else if(s.ii>0){s.ii--;mergi(s,s.ist[s.ii],true)}re();return}
    if(e.altKey&&k==='ArrowUp'){e.preventDefault();const u=par(s.cur);if(u&&!s.caut)mergi(s,u);re();return}
    if(k==='ArrowDown'||k==='ArrowUp'||k==='Home'||k==='End'){const l=s.cur==='COS'?s.cos.map((_,i)=>'cos:'+i):listaCurenta(s);if(!l.length)return;e.preventDefault();let i=l.indexOf(s.sel);
      i=k==='Home'?0:k==='End'?l.length-1:k==='ArrowDown'?Math.min(l.length-1,i+1):Math.max(0,i<0?0:i-1);s.sel=l[i];s.msg='';re();return}
    if((e.shiftKey&&k==='F10')||k==='ContextMenu'){e.preventDefault();const r=body.querySelector('.exo-rand.on')||lst;const b=r.getBoundingClientRect();meniu(s.sel?(String(s.sel).startsWith('cos:')?'cos':'el'):'fond',b.left+30,b.top+20);return}
  });
}

const SimExplorerOperatii={
  render(Q,body,api){
    css();const s=stare(Q);desen(Q,body,api,s);
    api.checkButton(()=>{
      const {s:st}=body._exo,rez=(Q.checks||[]).map(c=>test(Q,st,c)),k=rez.indexOf(false);
      if(k<0){api.resolve(true);return}
      /* un test care NU mai poate trece în starea asta (fișierul altuia înlocuit, Coșul altora golit): spunem de ce și cum reiei */
      const pierdut=c=>{if(c.toate){for(const x of c.toate){const r=pierdut(x);if(r)return r}return ''}
        if(c.neatins&&st.M.f.has(c.neatins)&&!test(Q,st,c))return 'fișierul „'+afis(st.M,c.neatins)+'” a fost înlocuit (Înlocuire sau Enter), iar cel vechi s-a pierdut, ca în laborator';
        if(c.cosNeatins&&!test(Q,st,c))return 'Coșul a fost golit sau ai scos din el fișierele altora, iar ele nu se mai întorc';
        return ''};
      const kp=(Q.checks||[]).findIndex((c,i)=>!rez[i]&&pierdut(c));
      if(kp>=0)api.resolve(false,'Testul „'+Q.checks[kp].ce+'” nu mai poate trece: '+pierdut(Q.checks[kp])+'. Apasă „Reîncep exercițiul”, sub teste, și fă din nou.');
      else api.resolve(false,'Testul care nu trece încă: '+Q.checks[k].ce+'.');
      const f=body.querySelector('.exo');if(f)f.focus({preventScroll:true});
      api.revealButton(()=>{const n=stare(Q);aplica(n,Q.solutie);n.msg='Așa arată la final: toate testele trec.';n.av=false;n.dlg=null;desen(Q,body,api,n);
        api.giveUp(Q.solutieText||'uită-te în Explorer și la testele de sub el: acum trec toate.')});
    });
  },
  rezolva(Q,body,api){const n=stare(Q);aplica(n,Q.solutie);n.dlg=null;desen(Q,body,api,n)},
  gresit(Q,body,api){const n=stare(Q);aplica(n,Q.gresit||[]);n.dlg=null;desen(Q,body,api,n)}
};

window.SimExplorerOperatii=SimExplorerOperatii;
window.ExplorerOperatii={stare,aplica,test,numeCopie,numeLiber,model,afis,copii};
})();
