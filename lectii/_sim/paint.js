/* Simulatorul „paint” pentru lecțiile LearningHub — fișier comun (lectii/_sim/paint.js).
   PROPRIETAR: autorul lecției V · M3 · nr. 18 („Rolul unui editor grafic. Interfața. Creare, deschidere, salvare”), 19.10.2026.
   E baza lanțului V/18 → V/22 (Paint din Windows 11). Lecțiile 19-22 îl EXTIND cu fișiere NOI (lectii/_sim/paint-<ceva>.js),
   prin API-ul de mai jos; nu rescriu fișierul acesta.

   Folosire (după motor.js):
     <script src="../../_sim/paint.js"></script>
     JocMotor.porneste({ …, tipuri:{paintw:SimPaint} })            // tipul de bază
     const SimPaintX=PaintSim.creeaza({unelte:[…], verifica, op, actiune, panou});   // o extensie (lecțiile următoare)

   FIDELITATE (Paint 11.2605.81.0 din Windows 11, în română; Paint NU a fost pornit de lecția 18, e aplicație din Magazin):
   PROBAT — capturi reale din Paint RO (jocuri/grafica-v/img, 20.09.2026) și probele judecătorului lecției V/8 pe Paint-ul real, pe
     desktopul ascuns (lectii/v/m2-l08/_verificare/paint_ascuns*.json):
     · titlul „Fără titlu - Paint”; butoanele ferestrei Minimizare / Maximizare / Închidere;
     · meniul de sus Fișier · Editare · Vizualizați și butoanele Salvați · Partajați · Anulați · Refaceți;
     · meniul Fișier: Nou Ctrl+N · Deschidere Ctrl+O · Importați pe pânză › · Recente › · Salvați Ctrl+S · Salvați ca › ·
       Salvați ca proiect Ctrl+Shift+S · Imprimați › · Partajați · Stabilire ca fundal pentru desktop › · Proprietăți imagine Ctrl+E · Ieși;
       Salvați ca › Imagine PNG · Imagine JPG · Imagine BMP · Imagine GIF · Alt format;
     · grupurile barei cu instrumente: Selecție, Imagine, Instrumente, Pensule, Forme, Culori, Copilot, Niveluri; într-o fereastră
       îngustă (~1230 px) Imagine, Instrumente, Forme și Culori devin butoane strânse (se deschid la clic);
     · la pornire e aleasă unealta Pensule (o pornire probată; Paint poate ține minte unealta colegului);
     · bara de stare: poziția, mărimea pânzei („1038 × 648px” la pornirea din probă), Potrivire la fereastră, Zoom (100 %), Micșorare, Mărire;
     · X fără modificări: Paint se închide fără întrebare; cu modificări: fereastra „Salvați lucrul?”, textul
       „Există modificări nesalvate în „Fără titlu”.”, butoanele Salvați (cu focusul) · Nu salvați · Anulare.
   DIN RESURSE — șirurile din resources.pri al pachetului Paint (citit ca fișier, lectii/v/m3-l18/_proba/pri_ro.txt): Creion, Umplere,
     Text, Radieră, Selector de culoare, Lupă, Bitmap 24 biți (*.bmp;*.dib), Toate fișierele imagine, Salvați ca proiect.
     Paint NU are un mesaj propriu „există deja”: îl dă fereastra Windows (probată de lecția V/15 în Edge, același dialog comun):
     „Confirmare Salvare ca” — „<nume> există deja. Îl înlocuiți?” — Da / Nu (focusul pe Nu); după Nu, numele e selectat din nou.
   FEREASTRA SALVARE CA (dialogul comun Windows, probat de V/15, lectii/_sim/browser-salvare.js): numele propus e selectat întreg
     (tastatul îl înlocuiește); dublu-clic pe un folder intră în el și numele scris rămâne; UN clic pe un folder schimbă butonul
     „Salvare” în „Deschidere”, care intră în folder; un clic pe un fișier îi pune numele în „Nume fișier”; Enter = Salvare; Esc = Anulare.
   PRESUPUS (neprobat, de fotografiat în laborator — lectii/v/m3-l18/capturi_lipsa.json):
     · Salvați (Ctrl+S) pe o imagine fără nume deschide fereastra Salvare ca, cu tipul PNG; pe o imagine cu nume salvează fără fereastră;
     · prima fereastră Salvare ca / Deschidere pornește în Imagini, apoi în ultimul folder folosit;
     · numele propus = „Fără titlu”; textele din „Salvare cu tipul”: „PNG (*.png)”, „JPEG (*.jpg;*.jpeg;*.jpe;*.jfif)”, „GIF (*.gif)”;
     · după salvare, bara de titlu arată numele fișierului (cu extensia doar dacă Windows arată extensiile);
     · un clic pe pânză, fără tragere, lasă un punct (afirmat de judecătorul V/8, neprobat);
     · Nou (Ctrl+N) și Deschidere, cu modificări nesalvate, pun aceeași întrebare „Salvați lucrul?” (resursele au și
       „Salvați modificările la %1?”: lecțiile NU construiesc exerciții pe textul ei);
     · dublu-clic pe un fișier în Salvare ca = Salvare cu numele lui (deci „Confirmare Salvare ca”), ca în dialogul comun Windows;
     · fereastra Deschidere: titlul „Deschidere”, „Toate fișierele imagine”, butoanele Deschidere / Anulare; un nume care nu există → mesaj.
   ABATERI, spuse pe ecran: doar Creionul și Pensula desenează (o linie neagră); celelalte unelte, culorile, zoomul, Editare și
     Vizualizați spun la ce lecție le înveți; fereastra Salvare ca are în stânga doar Desktop, Descărcări, Documente, Imagini;
     fereastra nu se micșorează și nu se mută; bara de stare arată poziția și mărimea pânzei (selecția nu există aici).
   TASTELE (reparat 19.10.2026, judecata 1): Ctrl+S și Ctrl+O (și Ctrl+Shift+S) merg cât e un Paint din pagină pe ecran, chiar dacă
     focusul nu e în el (altfel browserul ar deschide SALVAREA PAGINII WEB); nu se iau dintr-o altă casetă de scris a paginii.
     Ctrl+N NU ajunge la pagină în Chrome/Edge (browserul deschide o fereastră nouă): în pagină, Nou se face din meniul Fișier.

   TIPUL (Q): t:'paintw' (sau cheia ta din tipuri), q, ajutor, why, plus:
     start?: {pornit?:true, desen?:'gol'|'linie'|'casa'|'soare', fisier?:'Documente/Ex Pop Ana/linia mea.png', modificat?:false,
              unealta?:'pensula'|'creion', w?:1038, h?:648}   (fisier = imaginea deschisă la început; desen = ce e pe pânză;
              w × h = mărimea pânzei la început, în pixeli — o arată bara de stare)
     folderElev?: 'Ex Pop Ana' (în Documente; există de la început; 'elev' în teste = Documente/<folderElev>)
     fs?: [['Documente/Ex Ionescu Dan/'], ['Imagini/flori.png','soare']]   (foldere: cu / la capăt; fișiere: [cale, desen])
     extensii?: false (Windows ascunde extensiile, ca în laborator) | true
     unelte?: ['creion','pensula'] (cele care desenează; restul spun lecția lor)
     explorare?: true — un clic pe o zonă a ferestrei doar spune numele ei (pentru „arată-mi bara de stare”); nimic nu se schimbă;
       tastele Ctrl+S/O/N/Z/Y nu fac nimic (browserul nu le primește; mesajul spune că aici doar afli numele părților)
     raspuns?: {eticheta:'…'} — o casetă de răspuns sub Paint (test 'raspuns')
     checks: [{k, ce, msg?, …}] — se bifează singure. k:
       pornit (Paint pornit din Start) · deschisPaint (Paint e deschis acum) · unealta{u} · desen{cu?, linie?:true, min?} ·
       salvat{folder:'elev'|'Documente/…', nume?, exact?:true, ext?:'png'|'jpg', cu?:'creion', min?:N, nou?:true}
         (nume: primește și „nume 2”, „nume2” dacă nu e exact; cu+min: cel puțin N linii ale uneltei în FIȘIER; nou: scris de elev) ·
       meniu{m:'fisier'} (a deschis meniul Fișier) ·
       titlu{are} · nemodificat (tot ce e pe pânză e salvat) · inchis (Paint închis cel puțin o dată și închis acum) ·
       faraPierderi (nicio închidere / Nou / Deschidere n-a pierdut modificări nesalvate) · deschis{folder?, nume?} (deschis cu Deschidere) ·
       neatins{f:'Documente/…/x.png'} (fișierul nu a fost înlocuit) · intrebat (a apărut „Salvați lucrul?”) · nou (Fișier › Nou) ·
       inlocuireRefuzata (la „există deja” s-a ales Nu) · zona{z:'titlu'|'meniu'|'unelte'|'culori'|'panza'|'stare'} (ultimul clic;
         z:'unelte' primește și un clic pe grupul Culori, care e tot în bara cu instrumente) ·
       continuat{folder?, nume} (după ce ai DESCHIS imaginea cu Deschidere, ai mai desenat ceva și ai salvat-o, cu Ctrl+S sau cu
         Salvați la întrebare: deschis → desen → salvat, în ordinea asta) ·
       raspuns{are:[…], minN?} · toate{c:[…]}
     sol / gresit: listă de operații (pentru „Arată-mi” și pentru poartă):
       ['start'] · ['u','creion'] · ['linie',x1,y1,x2,y2] · ['punct',x,y] · ['cmd','nou'|'deschidere'|'salvati'|'png'|'jpg'|'bmp'|'gif'|'iesi'|'x'] ·
       ['ctrl','s'|'o'|'n'|'z'|'y'] · ['nume',text] · ['nav','Documente/Ex Pop Ana'] · ['sel','d:Nume'|'f:nume'] · ['tip','png'|'jpg'] ·
       ['ok'] · ['anul'] · ['da'] · ['nu'] · ['intreb','salvati'|'nusalvati'|'anulare'] · ['zona',z] · ['raspuns',t] ·
       ['salveaza',folder,nume,tip?] (Fișier › Salvați ca › tip, numele, folderul, Salvare) · ['deschide',folder,nume] (Fișier › Deschidere …)
   EVENIMENTE: pe body, 'paint-sim' (bubbles) cu detail {tip:'pornit'|'desen'|'meniu'|'dialog'|'salvat'|'deschis'|'nou'|'intrebare'|
     'inchis'|'zona'|'unealta', …}; ultimele 200 în PaintSim.evenimente.
   TIPUL pixeli (window.TipPixeli): un desen mărit, pixel cu pixel, și o casetă „lățime x înălțime”. Q: px:['.rr.','rrrr'] (rânduri egale;
     '.' alb, k negru, r roșu, v verde, a albastru, g galben, m maro), marime?, cere?:'marime'|'latime'|'inaltime', eticheta?, tipic?.
     Primește „7 x 6”, „7×6”, „7 * 6”, „7 pe 6”, cu sau fără „pixeli”; la ordinea inversată spune că întâi vine lățimea.
   window.PaintSim = {versiune:1, creeaza, DESENE, TIPURI, FOLDERE, UNELTE, GRUPURI, evenimente, pxHtml, evalPx} · window.SimPaint = tipul de bază.
   PENTRU LECȚIA URMĂTOARE (19-22): PaintSim.creeaza({unelte:[{id,nume,grup,lectie?,svg?,deseneaza?(S,traseu,ctx)}], verifica(c,ctx)→true|false|null,
     op(o,ctx)→bool, actiune(act,val,ctx)→bool, panou(ctx)→html}). ctx = {S, Q, draw, msg(text,rau), ev(tip,d), fisier(cale)}.
     traseu = {u:id, p:[[x,y],…]} în coordonatele pânzei; deseneaza() îl adaugă singur în S.desen (de ex. S.desen.push(traseu)).
     După deseneaza(), paint.js pune singur S.modificat=true, S.refa=[] și emite evenimentul 'desen' {u, puncte} (dacă extensia
     nu l-a emis ea, cu ctx.ev): fără el, testele desen-pe-evenimente (continuat: deschis → desen → salvat) nu văd desenul. Dacă
     gestul n-a schimbat nimic pe pânză, deseneaza() întoarce false și nu se emite nimic (judecata 2 la V/18, AA). O unealtă cu grup:'instrumente' apare și în grupul întins, și în lista butonului strâns „Instrumente”.
     Pe un ecran îngust, bara cu instrumente se derulează orizontal; săgeata „›” din dreapta (.pt-mai) arată că mai sunt grupuri.
     NU schimba: numele din meniuri și ferestre (probate), comportamentul ferestrei Salvare ca și al întrebării „Salvați lucrul?”.
     Pânza (.pt-svg) e UN element păstrat între redesenări (draw() îi rescrie doar conținutul): nu o înlocui și nu pune pe ea elemente
     care primesc atingeri (.pt-svg * are pointer-events:none). Pe pânză, touchstart/touchmove au preventDefault (în afara modului
     explorare): fără el, un deget ridicat DIN MERS lasă în Chromium un gest de „aruncare”, iar atingerea următoare (Fișier,
     Verifică) doar îl oprește și nu mai dă clic (proba 19.10.2026: 17 din 48 pierdute înainte, _proba/r1_atingere_*.txt la V/18).
     Desenul se face numai din evenimentele pointer*: nu te baza pe click / mouse* pe pânză.
     Derularea ferestrei Salvare ca, a listei și a meniului Fișier se păstrează la redesenare (dublu-clicul pe telefon). */
(function(){
'use strict';
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CSS=`
.pt{position:relative;font-size:14px}
.pt-win{position:relative;border:1px solid #c9c9c9;border-radius:8px;background:#f3f3f3;color:#1a1a1a;font-family:"Segoe UI",system-ui,sans-serif;overflow:hidden;outline:none}
.pt-win:focus-visible{box-shadow:0 0 0 3px var(--accent)}
.pt-tb{display:flex;align-items:center;min-height:34px;background:#f3f3f3;border-bottom:1px solid #e3e3e3}
.pt-tt{flex:1;min-width:0;padding:0 10px;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pt-tt i{display:inline-block;width:14px;height:14px;border-radius:3px;background:linear-gradient(135deg,#ffb900,#e74856 45%,#0078d4);vertical-align:-2px;margin-right:6px}
.pt-wb{width:40px;min-height:34px;border:0;background:transparent;font:inherit;font-size:14px;color:#1a1a1a;cursor:pointer}
.pt-wb:hover{background:#e5e5e5}.pt-wb.x:hover{background:#c42b1c;color:#fff}
.pt-mb{display:flex;align-items:center;gap:2px;padding:2px 6px;background:#f9f9f9;flex-wrap:wrap}
.pt-mi{border:0;background:transparent;font:inherit;font-size:13px;color:#1a1a1a;padding:4px 9px;min-height:32px;border-radius:4px;cursor:pointer}
.pt-mi:hover,.pt-mi.on{background:#e6e6e6}
.pt-ib{width:34px;min-height:32px;border:0;background:transparent;border-radius:4px;cursor:pointer;color:#1a1a1a;font-size:15px;padding:0}
.pt-ib:hover{background:#e6e6e6}
.pt-sep{width:1px;height:20px;background:#ddd;margin:0 4px}
.pt-tools-w{position:relative}
.pt-tools{display:flex;align-items:stretch;gap:0;padding:4px 4px 2px;background:#f9f9f9;border-bottom:1px solid #e3e3e3;overflow-x:auto;overscroll-behavior-x:contain}
.pt-mai{display:none;position:absolute;top:0;right:0;bottom:1px;width:30px;align-items:center;justify-content:flex-end;padding-right:3px;box-sizing:border-box;pointer-events:none;background:linear-gradient(to right,rgba(249,249,249,0),#f9f9f9 55%);font:700 22px/1 "Segoe UI",system-ui,sans-serif;color:#0067c0}
.pt-tools-w.are-mai .pt-mai{display:flex}
.pt-g{display:flex;flex-direction:column;align-items:center;padding:0 7px;border-right:1px solid #e3e3e3;flex:none}
.pt-g:last-child{border-right:0}
.pt-gc{display:flex;align-items:center;gap:2px;min-height:58px}
.pt-gn{font-size:11px;color:#5c5c5c;padding:1px 0 2px;white-space:nowrap}
.pt-tg{display:grid;grid-template-columns:repeat(3,32px);gap:2px}
.pt-t{width:32px;height:32px;border:1px solid transparent;border-radius:4px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;color:#1a1a1a}
.pt-t:hover{background:#e6e6e6}.pt-t.on{background:#e0eefc;border-color:#9cc3ef}
.pt-t svg{width:20px;height:20px}
.pt-big{width:44px;height:52px;flex-direction:column;font-size:11px}
.pt-col{display:grid;grid-template-columns:repeat(6,16px);gap:3px}
.pt-col b{width:16px;height:16px;border-radius:50%;display:block;border:1px solid #bbb}
.pt-cc{width:30px;height:30px;border-radius:50%;border:2px solid #4a4a4a;background:#000;margin-right:5px}
.pt-coll{min-width:58px;height:58px;flex-direction:column;font-size:11px;gap:2px;width:auto;padding:0 4px}
.pt-pop{position:absolute;z-index:6;background:#fff;border:1px solid #cfcfcf;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:6px}
.pt-pop .pt-gn{text-align:center}
.pt-wrap{background:#e8e8e8;padding:12px;min-height:150px;display:flex;justify-content:center;align-items:flex-start;position:relative}
.pt-svg{display:block;width:100%;max-width:640px;height:auto;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25);touch-action:none;cursor:crosshair}
.pt-svg *{pointer-events:none}
.pt-sb{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:3px 8px;min-height:32px;font-size:11.5px;color:#3b3b3b;background:#f3f3f3;border-top:1px solid #e3e3e3}
.pt-sb .z{margin-left:auto;display:flex;align-items:center;gap:4px}
.pt-sb .zv{border:1px solid #cfcfcf;border-radius:4px;background:#fff;padding:2px 8px;min-width:54px;text-align:center}
.pt-sb button{min-width:32px;min-height:32px;border:0;background:transparent;cursor:pointer;color:#1a1a1a;font-size:14px;border-radius:4px}
.pt-sb button:hover{background:#e6e6e6}
.pt-menu{position:absolute;z-index:7;background:#fff;border:1px solid #cfcfcf;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.2);padding:4px;min-width:250px;max-width:calc(100% - 12px);max-height:calc(100% - 74px);overflow-y:auto;overscroll-behavior:contain}
.pt-menu .pt-sub{border-left:3px solid #9cc3ef;margin:2px 0 4px 16px;padding-left:4px}
.pt-menu button{display:flex;width:100%;align-items:center;gap:10px;border:0;background:transparent;font:inherit;font-size:13px;color:#1a1a1a;text-align:left;padding:5px 10px;min-height:34px;border-radius:4px;cursor:pointer}
.pt-menu button:hover,.pt-menu button:focus-visible{background:#ececec;outline:none}
.pt-menu .sc{margin-left:auto;color:#6b6b6b;font-size:12px}
.pt-menu hr{border:0;border-top:1px solid #e5e5e5;margin:3px 2px}
.pt-ov{position:absolute;inset:0;z-index:9;background:rgba(0,0,0,.28);display:flex;align-items:flex-start;justify-content:center;padding:10px 6px;overflow:auto}
.pt-dlg{background:#fff;color:#1a1a1a;border:1px solid #9a9a9a;border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.3);width:100%;max-width:600px;font-size:13px}
.pt-dt{padding:7px 12px;font-size:12.5px;border-bottom:1px solid #e5e5e5;display:flex;align-items:center}
.pt-dt span{flex:1}
.pt-adr{display:flex;align-items:center;gap:6px;padding:6px 10px}
.pt-adr .bar{flex:1;min-width:0;border:1px solid #cfcfcf;border-radius:4px;padding:5px 8px;background:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pt-db{display:grid;grid-template-columns:minmax(96px,30%) 1fr;gap:0;border-top:1px solid #eee;border-bottom:1px solid #eee;min-height:150px}
.pt-left{border-right:1px solid #eee;padding:4px;display:flex;flex-direction:column;gap:1px}
.pt-left button,.pt-list button{display:flex;align-items:center;gap:7px;width:100%;border:1px solid transparent;background:transparent;font:inherit;font-size:13px;color:#1a1a1a;text-align:left;padding:4px 7px;min-height:34px;border-radius:4px;cursor:pointer}
.pt-left button:hover,.pt-list button:hover{background:#f0f0f0}
.pt-left button.on{background:#e5f0fb}
.pt-list{padding:4px;display:flex;flex-direction:column;gap:1px;max-height:220px;overflow:auto}
.pt-list button.sel{background:#cce4f7;border-color:#99c9ef}
.pt-list .gol{color:#6b6b6b;padding:8px}
.pt-ic{display:inline-block;width:18px;height:14px;border-radius:2px;flex:none}
.pt-ic.d{background:#f8d775;border:1px solid #d9a92f}
.pt-ic.f{background:linear-gradient(135deg,#7fc3ff,#2f80d1);border:1px solid #2a6db3}
.pt-df{display:grid;grid-template-columns:auto 1fr;gap:6px 8px;align-items:center;padding:8px 10px}
.pt-df label{font-size:12.5px;white-space:nowrap}
.pt-df input,.pt-df select{font:inherit;font-size:14px;padding:5px 7px;border:1px solid #8a8a8a;border-radius:4px;min-height:32px;min-width:0;width:100%;box-sizing:border-box;background:#fff;color:#1a1a1a}
.pt-bt{display:flex;justify-content:flex-end;gap:8px;padding:0 10px 10px}
.pt-bt button,.pt-q button{font:inherit;font-size:13px;min-width:84px;min-height:34px;border:1px solid #c4c4c4;border-radius:4px;background:#fdfdfd;color:#1a1a1a;cursor:pointer;padding:3px 12px}
.pt-bt button.imp,.pt-q button.imp{background:#0067c0;border-color:#0067c0;color:#fff}
.pt-err{margin:0 10px 8px;padding:6px 9px;border:1px solid #e0b4b0;background:#fdf0ef;border-radius:4px;font-size:12.5px}
.pt-conf,.pt-q{position:absolute;inset:0;z-index:11;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.18);padding:10px}
.pt-q>div,.pt-conf>div{background:#fff;color:#1a1a1a;border:1px solid #9a9a9a;border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.3);max-width:420px;width:100%;padding:14px 16px 12px}
.pt-q h4,.pt-conf h4{margin:0 0 6px;font-family:"Segoe UI",system-ui,sans-serif;font-size:15px;font-weight:600}
.pt-q p,.pt-conf p{margin:0 0 12px;font-size:13px}
.pt-q .r,.pt-conf .r{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.pt-off{padding:14px;min-height:220px;display:flex;flex-direction:column;gap:10px;background:#1f3550;color:#fff;font-family:"Segoe UI",system-ui,sans-serif}
.pt-off p{margin:0;font-size:13.5px}
.pt-bar{margin-top:auto;display:flex;gap:6px;align-items:center;background:rgba(255,255,255,.12);border-radius:6px;padding:4px}
.pt-bar button{min-height:36px;min-width:36px;border:0;border-radius:4px;background:transparent;color:#fff;font:inherit;font-size:13px;cursor:pointer;padding:0 8px}
.pt-bar button:hover{background:rgba(255,255,255,.18)}
.pt-sm{background:#fff;color:#1a1a1a;border-radius:8px;padding:8px;max-width:340px}
.pt-sm input{font:inherit;font-size:14px;width:100%;box-sizing:border-box;min-height:34px;border:1px solid #8a8a8a;border-radius:16px;padding:4px 12px}
.pt-sm button{display:flex;gap:8px;align-items:center;width:100%;border:0;background:transparent;color:#1a1a1a;font:inherit;font-size:13px;min-height:34px;border-radius:4px;cursor:pointer;text-align:left;padding:2px 8px}
.pt-sm button:hover{background:#eee}
.pt-msg{margin:6px 0 0;padding:6px 10px;border-radius:6px;background:var(--paper2);border:1px solid var(--line);color:var(--ink);font-size:.86rem}
.pt-msg.rau{border-color:var(--bad);background:var(--badbg)}
.pt-nota{font-size:.82rem;color:var(--ink2);margin:6px 0 0}
.pt-nota button,.pt-reset{font:inherit;font-size:.8rem;min-height:32px;border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);cursor:pointer;padding:2px 9px}
.pt-panou{margin-top:8px;border:1px solid var(--line);border-radius:8px;padding:6px 10px;background:var(--paper)}
.pt-panou .lbl{font-size:.8rem;font-weight:700;color:var(--ink2)}
.pt-teste{margin:4px 0 0;padding-left:1.2em}
.pt-teste li{margin:.15em 0;color:var(--ink)}
.pt-teste li.ok{color:var(--ok)}.pt-teste li.ok::marker{content:"✔ "}
.pt-rasp{font:inherit;width:100%;box-sizing:border-box;min-height:36px;margin-top:4px;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.pt-expl [data-z]{outline:2px dashed transparent;outline-offset:-2px}
.pt-expl [data-z]:hover{outline-color:#e4002b}
.pt-zsel{outline:3px solid #e4002b!important;outline-offset:-3px}
@media (max-width:520px){.pt-db{grid-template-columns:1fr}.pt-left{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid #eee}.pt-left button{width:auto}.pt-df{grid-template-columns:1fr}}
`;
let cssPus=false;function css(){if(cssPus)return;cssPus=true;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s)}

/* ---- datele lumii ---- */
const W0=1038,H0=648;
const FOLDERE=['Desktop','Descărcări','Documente','Imagini'];
const TIPURI={png:{n:'PNG (*.png)',ext:'png',meniu:'Imagine PNG'},jpg:{n:'JPEG (*.jpg;*.jpeg;*.jpe;*.jfif)',ext:'jpg',meniu:'Imagine JPG'},
  bmp:{n:'Bitmap 24 biți (*.bmp;*.dib)',ext:'bmp',meniu:'Imagine BMP'},gif:{n:'GIF (*.gif)',ext:'gif',meniu:'Imagine GIF'}};
const EXT_TIP={png:'png',jpg:'jpg',jpeg:'jpg',jpe:'jpg',jfif:'jpg',bmp:'bmp',dib:'bmp',gif:'gif'};
const cerc=(cx,cy,r)=>{const p=[];for(let i=0;i<=24;i++){const a=i/24*2*Math.PI;p.push([Math.round(cx+r*Math.cos(a)),Math.round(cy+r*Math.sin(a))])}return p};
const DESENE={
  gol:[],
  linie:[{u:'creion',p:[[220,330],[820,330]]}],
  casa:[{u:'creion',p:[[330,560],[330,330],[710,330],[710,560],[330,560]]},{u:'creion',p:[[300,340],[520,170],[740,340]]},{u:'creion',p:[[470,560],[470,440],[570,440],[570,560]]}],
  soare:[{u:'creion',p:cerc(520,300,120)},{u:'creion',p:[[520,120],[520,60]]},{u:'creion',p:[[520,480],[520,540]]},{u:'creion',p:[[340,300],[280,300]]},{u:'creion',p:[[700,300],[760,300]]}]
};
const UNELTE=[ /* grupul Instrumente, în ordinea din captură; numele din resurse */
  {id:'creion',nume:'Creion',lectie:19,svg:'<path d="M4 20l1.2-4.4L15.6 5.2a2 2 0 012.8 0l.4.4a2 2 0 010 2.8L8.4 18.8z" fill="#f7c948" stroke="#333" stroke-width="1.3"/><path d="M4 20l1.2-4.4 3.2 3.2z" fill="#333"/>'},
  {id:'umplere',nume:'Umplere',lectie:21,svg:'<path d="M5 11l6-6 7 7-6 6z" fill="#cfe3f7" stroke="#2f6fb2" stroke-width="1.4"/><path d="M19 15c1 1.6 1.4 2.4 1.4 3a1.4 1.4 0 01-2.8 0c0-.6.4-1.4 1.4-3z" fill="#2f6fb2"/>'},
  {id:'text',nume:'Text',lectie:22,svg:'<text x="12" y="18" text-anchor="middle" font-size="16" font-family="Segoe UI,Arial" fill="#333">A</text>'},
  {id:'radiera',nume:'Radieră',lectie:19,svg:'<path d="M4 15l7-7 7 7-4 4H8z" fill="#f4a3b4" stroke="#333" stroke-width="1.3"/><path d="M8 19h12" stroke="#333" stroke-width="1.3"/>'},
  {id:'pipeta',nume:'Selector de culoare',lectie:21,svg:'<path d="M5 19l9-9 2 2-9 9H5z" fill="#cde" stroke="#2f6fb2" stroke-width="1.3"/><path d="M14 6l4 4" stroke="#2f6fb2" stroke-width="3"/>'},
  {id:'lupa',nume:'Lupă',lectie:20,svg:'<circle cx="10" cy="10" r="5.5" fill="none" stroke="#333" stroke-width="1.6"/><path d="M14 14l5 5" stroke="#333" stroke-width="2"/><path d="M8 10h4M10 8v4" stroke="#333" stroke-width="1.3"/>'}
];
const SVG_PENS='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 3h6v8l-3 3-3-3z" fill="#bbb" stroke="#444" stroke-width="1.2"/><path d="M10 14h4l-1 7h-2z" fill="#6b4f2a"/></svg>';
const GRUPURI=[ /* [id, nume, lecția la care îl înveți] */
  ['selectie','Selecție',19],['imagine','Imagine',20],['instrumente','Instrumente',0],['pensule','Pensule',0],['forme','Forme',19],['culori','Culori',21],['copilot','Copilot',-1],['niveluri','Niveluri',-1]];
const PALETA=['#000000','#7f7f7f','#880015','#ed1c24','#ff7f27','#fff200','#22b14c','#00a2e8','#3f48cc','#a349a4','#ffffff','#c3c3c3','#b97a57','#ffaec9','#ffc90e','#efe4b0','#b5e61d','#99d9ea'];
const STARTAPPS=['Calculator','Ceas','Notepad','Paint','Setări'];
const EXPL_TASTE='Aici doar afli numele părților ferestrei: tastele nu fac nimic. Dă un clic pe o parte a ferestrei.';
const ZONE={titlu:'bara de titlu',meniu:'meniul de sus (Fișier, Editare, Vizualizați)',unelte:'bara cu instrumente',culori:'grupul Culori, din bara cu instrumente',panza:'pânza (zona de desen)',stare:'bara de stare'};
const LECTIE_GRUP=n=>n>0?`îl înveți la lecția ${n}`:'nu-l folosim la ore';
const EVENIMENTE=[];

function cloneD(d){return (d||[]).map(s=>({u:s.u,p:s.p.map(x=>[x[0],x[1]])}))}
function baza(n){return String(n).replace(/\.[^.\\/]*$/,'')}
function extDin(n){const m=/\.([a-z0-9]+)$/i.exec(n);return m?m[1].toLowerCase():''}
function lungime(s){let L=0;for(let i=1;i<s.p.length;i++)L+=Math.hypot(s.p[i][0]-s.p[i-1][0],s.p[i][1]-s.p[i-1][1]);return L}
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();

function creeaza(EXT){
  EXT=EXT||{};
  const EXTS=[].concat(EXT.extensii||EXT);
  return {
  render(Q,body,api){
    css();
    const esc=api.esc||E;
    const ACTIVE=new Set(Q.unelte||['creion','pensula']);
    const UNELTE_EXT=[].concat(...EXTS.map(e=>e.unelte||[]));
    const folderElev=Q.folderElev||'Ex Pop Ana';
    const ELEV='Documente/'+folderElev;
    const arataExt=!!Q.extensii;
    function stareNoua(){
      const st=Q.start||{};
      const fs={d:new Set(FOLDERE.concat([ELEV])),f:new Map()};
      (Q.fs||[]).forEach(x=>{const c=String(x[0]).replace(/\\/g,'/');
        if(c.endsWith('/')){const parti=c.slice(0,-1).split('/');for(let i=1;i<=parti.length;i++)fs.d.add(parti.slice(0,i).join('/'))}
        else{const dir=c.split('/').slice(0,-1).join('/');fs.d.add(dir);fs.f.set(c,{desen:cloneD(DESENE[x[1]||'casa']||DESENE.casa),w:W0,h:H0,rev:0})}});
      const S={fs,pornit:st.pornit!==false,dinStart:false,startMeniu:false,startText:'',cale:null,nume:null,ext:null,
        desen:cloneD(DESENE[st.desen||'gol']||[]),refa:[],modificat:!!st.modificat,w:+st.w||W0,h:+st.h||H0,unealta:st.unealta||'pensula',
        meniu:null,sub:null,pop:null,dlg:null,intreb:null,msg:'',rau:false,ultimFolder:null,poz:null,
        inchideri:0,pierdut:false,intrebat:0,nou:0,refuzat:0,deschise:[],zone:[],rasp:'',ev:[],ingust:false};
      if(st.fisier){const c=String(st.fisier).replace(/\\/g,'/');const f=fs.f.get(c);if(f){S.desen=cloneD(st.desen?DESENE[st.desen]:f.desen);S.cale=c.split('/').slice(0,-1).join('/');S.nume=c.split('/').pop();S.ext=extDin(S.nume)}}
      return S;
    }
    let S=stareNoua();
    body.innerHTML=`<div class="pt">
      <div class="pt-win${Q.explorare?' pt-expl':''}" tabindex="-1" aria-label="Paint din pagină"></div>
      <div class="pt-msgz" aria-live="polite"></div>
      <p class="pt-nota">Un Paint mic, desenat în pagină, după Paint-ul din Windows 11. ${Q.explorare?'Aici un clic pe o parte a ferestrei îți spune doar numele ei; nu schimbă nimic.':'Desenează Creionul (și Pensula), cu negru; celelalte butoane îți spun la ce lecție le înveți. Tastele <kbd>Ctrl</kbd>+<kbd>S</kbd> și <kbd>Ctrl</kbd>+<kbd>O</kbd> merg și aici; pentru <b>Nou</b> folosești meniul <b>Fișier</b> (în browser, <kbd>Ctrl</kbd>+<kbd>N</kbd> deschide altă fereastră). Pe telefon folosești meniul Fișier.'} <button type="button" class="pt-reset" data-reset="1">Ia-o de la capăt</button></p>
      ${Q.raspuns?`<div class="pt-panou"><label class="lbl" for="pt-r-${esc(Q.raspuns.id||'r')}">${esc(Q.raspuns.eticheta||'Răspunsul tău')}</label><input id="pt-r-${esc(Q.raspuns.id||'r')}" class="pt-rasp" type="text" autocomplete="off" spellcheck="false"></div>`:''}
      <div class="pt-ext"></div>
      ${(Q.checks||[]).length?'<div class="pt-panou"><div class="lbl">Teste — se bifează singure când faci ce trebuie</div><ul class="pt-teste"></ul></div>':''}
    </div>`;
    const root=body.querySelector('.pt'),win=root.querySelector('.pt-win'),msgEl=root.querySelector('.pt-msgz'),
      testeEl=root.querySelector('.pt-teste'),extEl=root.querySelector('.pt-ext');
    const ev=(tip,d)=>{const x=Object.assign({tip},d||{});S.ev.push(x);EVENIMENTE.push(x);if(EVENIMENTE.length>200)EVENIMENTE.shift();
      try{body.dispatchEvent(new CustomEvent('paint-sim',{bubbles:true,detail:x}))}catch(e){}};
    const msg=(t,rau)=>{S.msg=t;S.rau=!!rau};
    const ctx=()=>({S,Q,draw,msg,ev,fisier:c=>S.fs.f.get(c)});
    const numeAfis=n=>arataExt?n:baza(n);
    const titlu=()=>(S.nume?numeAfis(S.nume):'Fără titlu')+' - Paint';
    const caleElev=f=>f==='elev'?ELEV:String(f||'').replace(/\\/g,'/').replace(/\/$/,'');

    /* ---- operațiile aplicației ---- */
    function docNou(){S.desen=[];S.refa=[];S.cale=null;S.nume=null;S.ext=null;S.modificat=false;S.w=W0;S.h=H0;S.nou++;ev('nou',{})}
    function porneste(prinStart){S.pornit=true;S.dinStart=S.dinStart||!!prinStart;S.startMeniu=false;S.startText='';S.desen=[];S.refa=[];S.cale=null;S.nume=null;S.ext=null;S.modificat=false;S.w=W0;S.h=H0;S.unealta='pensula';S.msg='';ev('pornit',{prinStart:!!prinStart})}
    function inchide(){S.pornit=false;S.inchideri++;S.meniu=null;S.pop=null;S.dlg=null;S.intreb=null;S.desen=[];S.modificat=false;ev('inchis',{})}
    function dupa(a){if(a==='inchide')inchide();else if(a==='nou')docNou();else if(a==='deschidere')dlgDeschidere()}
    function intreaba(a){S.intreb={dupa:a};S.intrebat++;S.meniu=null;S.sub=null;ev('intrebare',{dupa:a})}
    function cmd(c){
      S.meniu=null;S.sub=null;S.pop=null;msg('');
      if(c==='nou'){if(S.modificat)intreaba('nou');else docNou();return}
      if(c==='deschidere'){if(S.modificat)intreaba('deschidere');else dlgDeschidere();return}
      if(c==='salvati'){if(S.cale)salveazaPeste();else dlgSalvare('png');return}
      if(TIPURI[c]){dlgSalvare(c);return}
      if(c==='iesi'||c==='x'){if(S.modificat)intreaba('inchide');else inchide();return}
      if(c==='proiect'){msg('<b>Salvați ca proiect</b> face un fișier de proiect Paint, nu o imagine. Azi alegi <b>Salvați ca</b>, apoi un format de imagine.',true);return}
      if(c==='alt'){msg('<b>Alt format</b> deschide aceeași fereastră Salvare ca; azi alegi direct <b>Imagine PNG</b> sau <b>Imagine JPG</b>.');return}
      msg('Comanda aceasta nu o folosim azi.');
    }
    function salveazaPeste(){const c=S.cale+'/'+S.nume,f=S.fs.f.get(c);S.fs.f.set(c,{desen:cloneD(S.desen),w:S.w,h:S.h,rev:(f?f.rev:0)+1,u:S.desen.map(s=>s.u)});S.modificat=false;msg('Salvat, fără fereastră: imaginea are deja nume și folder.');ev('salvat',{folder:S.cale,nume:S.nume,fara:true})}
    function dlgSalvare(tip,dupaAct){S.dlg={fel:'salvare',folder:S.ultimFolder||'Imagini',nume:S.nume?baza(S.nume):'Fără titlu',tip:tip||'png',sel:null,conf:null,err:'',dupa:dupaAct||null,selNume:true};ev('dialog',{fel:'salvare'})}
    function dlgDeschidere(){S.dlg={fel:'deschidere',folder:S.ultimFolder||'Imagini',nume:'',sel:null,err:'',selNume:true};ev('dialog',{fel:'deschidere'})}
    function continut(folder){
      const dir=[...S.fs.d].filter(d=>d.startsWith(folder+'/')&&!d.slice(folder.length+1).includes('/')).map(d=>d.slice(folder.length+1)).sort();
      const fis=[...S.fs.f.keys()].filter(f=>f.startsWith(folder+'/')&&!f.slice(folder.length+1).includes('/')).map(f=>f.slice(folder.length+1))
        .filter(n=>S.dlg&&S.dlg.fel==='salvare'?EXT_TIP[extDin(n)]===S.dlg.tip:!!EXT_TIP[extDin(n)]).sort();
      return {dir,fis};
    }
    function intraIn(folder,selecteaza){if(!S.dlg)return;S.dlg.folder=folder;S.dlg.sel=null;S.dlg.err='';if(selecteaza)S.dlg.selNume=true}
    function dlgOk(){
      const D=S.dlg;if(!D)return;D.err='';
      if(D.sel&&D.sel.startsWith('d:')){intraIn(D.folder+'/'+D.sel.slice(2),true);return}
      let n=String(D.nume||'').trim().replace(/[. ]+$/,'');
      if(!n){D.err='Scrie un nume de fișier.';return}
      let folder=D.folder;
      if(/[\\/]/.test(n)){const parti=n.replace(/\\/g,'/').split('/');n=parti.pop();const sub=parti.filter(Boolean).join('/');const fd=folder+'/'+sub;
        if(!S.fs.d.has(fd)){D.err='Calea nu există.<br>Verificați calea și încercați din nou.';return}folder=fd}
      if(/[:*?"<>|]/.test(n)){D.err='Numele de fișier nu este valid.';return}
      if(D.fel==='deschidere'){
        const gas=[...S.fs.f.keys()].find(f=>f.startsWith(folder+'/')&&!f.slice(folder.length+1).includes('/')&&(norm(f.slice(folder.length+1))===norm(n)||norm(baza(f.slice(folder.length+1)))===norm(n)));
        if(!gas){D.err=`${esc(n)}<br>Fișierul nu a fost găsit. Verificați numele fișierului și încercați din nou.`;return}
        const f=S.fs.f.get(gas);S.desen=cloneD(f.desen);S.refa=[];S.w=f.w;S.h=f.h;S.cale=folder;S.nume=gas.split('/').pop();S.ext=extDin(S.nume);S.modificat=false;
        S.ultimFolder=folder;S.dlg=null;S.deschise.push({folder,nume:S.nume});ev('deschis',{folder,nume:S.nume});return}
      const e=extDin(n);const tip=EXT_TIP[e]?EXT_TIP[e]:D.tip;const plin=EXT_TIP[e]?n:n+'.'+TIPURI[D.tip].ext;
      const cale=folder+'/'+plin;
      const exista=[...S.fs.f.keys()].find(f=>f.toLowerCase()===cale.toLowerCase());
      if(exista&&!D.conf){D.conf={nume:numeAfis(exista.split('/').pop()),cale:exista,folder,plin:exista.split('/').pop(),tip};return}
      scrie(folder,exista?exista.split('/').pop():plin,tip);
    }
    function scrie(folder,plin,tip){
      const D=S.dlg,c=folder+'/'+plin,f=S.fs.f.get(c);
      S.fs.f.set(c,{desen:cloneD(S.desen),w:S.w,h:S.h,rev:(f?f.rev:0)+1,u:S.desen.map(s=>s.u)});
      S.cale=folder;S.nume=plin;S.ext=tip;S.modificat=false;S.ultimFolder=folder;S.dlg=null;
      /* unde a ajuns fișierul: spus pe ecran (un Enter pe numele propus salvează „Fără titlu” în Imagini — judecata 1, J7 sonnet) */
      msg(`Ai salvat <b>${esc(numeAfis(plin))}</b> în <b>${esc(folder.split('/').join(' › '))}</b>.`+(folder!==ELEV&&!f?` Nu e folderul tău: la calculatorul din laborator, un fișier salvat din greșeală într-alt folder îl ștergi la sfârșitul orei (în Explorer: clic pe el, <kbd>Delete</kbd>).`:''),folder!==ELEV&&!f);
      ev('salvat',{folder,nume:plin,inlocuit:!!f});
      if(D&&D.dupa)dupa(D.dupa);
    }
    function confDa(){const D=S.dlg;if(!D||!D.conf)return;const c=D.conf;D.conf=null;scrie(c.folder,c.plin,c.tip)}
    function confNu(){const D=S.dlg;if(!D||!D.conf)return;D.conf=null;D.selNume=true;S.refuzat++;ev('refuzat',{})}
    function raspIntreb(r){const I=S.intreb;if(!I)return;S.intreb=null;
      if(r==='anulare')return;
      if(r==='nusalvati'){S.pierdut=true;S.modificat=false;dupa(I.dupa);return}
      if(S.cale){salveazaPeste();dupa(I.dupa)}else dlgSalvare('png',I.dupa)}
    function alegeUnealta(id){
      const u=UNELTE.find(x=>x.id===id)||UNELTE_EXT.find(x=>x.id===id);
      if(id==='pensula'||ACTIVE.has(id)){S.unealta=id;S.pop=null;msg(id==='pensula'?'Ai ales <b>Pensule</b>: desenează o linie groasă. Creionul e în grupul <b>Instrumente</b>.':'Ai ales <b>'+(u?u.nume:id)+'</b>.');ev('unealta',{u:id});return}
      S.pop=null;msg(`<b>${esc(u?u.nume:id)}</b>: ${LECTIE_GRUP(u?u.lectie:0)}. Azi desenezi doar cu <b>Creionul</b>.`);
    }
    function trage(s){S.desen.push(s);S.refa=[];S.modificat=true;ev('desen',{u:s.u,puncte:s.p.length})}
    function anuleaza(){if(S.desen.length){S.refa.push(S.desen.pop());S.modificat=true}}
    function reface(){if(S.refa.length){S.desen.push(S.refa.pop());S.modificat=true}}

    /* ---- desenul ferestrei ---- */
    function svgUnealta(u){return `<svg viewBox="0 0 24 24" aria-hidden="true">${u.svg||''}</svg>`}
    function grupuri(){
      const ing=S.ingust;
      return GRUPURI.map(([id,nume,lec])=>{
        let c='';
        if(ing&&['imagine','instrumente','forme','culori'].includes(id))
          c=`<button type="button" class="pt-t pt-coll" data-act="grup" data-v="${id}" aria-label="${nume}" title="${nume}">${id==='instrumente'?svgUnealta(UNELTE[0]):id==='culori'?'<span class="pt-cc" style="width:20px;height:20px;margin:0"></span>':id==='imagine'?'▣':'◇'}<span>${nume}</span></button>`;
        else if(id==='instrumente')c=`<div class="pt-tg">${UNELTE.concat(UNELTE_EXT.filter(x=>x.grup==='instrumente')).map(u=>`<button type="button" class="pt-t${S.unealta===u.id?' on':''}" data-act="unealta" data-v="${u.id}" aria-label="${u.nume}" title="${u.nume}">${svgUnealta(u)}</button>`).join('')}</div>`;
        else if(id==='pensule')c=`<button type="button" class="pt-t pt-big${S.unealta==='pensula'?' on':''}" data-act="unealta" data-v="pensula" aria-label="Pensule" title="Pensule">${SVG_PENS}<span aria-hidden="true">⌄</span></button>`;
        else if(id==='culori')c=`<span class="pt-cc" title="Culoare 1"></span><div class="pt-col" data-act="grup" data-v="culori" role="button" aria-label="Paleta de culori" title="Culori">${PALETA.map(x=>`<b style="background:${x}"></b>`).join('')}</div>`;
        else if(id==='forme')c=`<button type="button" class="pt-t pt-big" data-act="grup" data-v="forme" aria-label="Forme" title="Forme" style="width:64px">╲ ○ ▭<br>△ ◇ ☆</button>`;
        else c=`<button type="button" class="pt-t pt-big" data-act="grup" data-v="${id}" aria-label="${nume}" title="${nume}">${id==='selectie'?'⬚':id==='imagine'?'▣':id==='copilot'?'✦':'≋'}</button>`;
        return `<div class="pt-g" data-z="${id==='culori'?'culori':'unelte'}">${ing&&['imagine','instrumente','forme','culori'].includes(id)?c:`<div class="pt-gc">${c}</div><div class="pt-gn">${nume}</div>`}</div>`;
      }).join('');
    }
    const svgEl=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('class','pt-svg');svgEl.setAttribute('data-z','panza');svgEl.setAttribute('role','img');svgEl.setAttribute('aria-label','Pânza: zona albă pe care desenezi');
    /* Atingerea pierdută (judecata 1, J1-05): un deget ridicat DIN MERS de pe pânză lăsa în Chromium un gest de „aruncare”, iar
       atingerea următoare (Fișier, Verifică) doar îl oprea, fără clic. Fără gesturi pe pânză (preventDefault pe touchstart/
       touchmove), desenul merge tot din pointer*. În modul explorare pânza nu desenează și are nevoie de clicul ei. */
    const faraGest=e=>{if(!Q.explorare&&e.cancelable)e.preventDefault()};
    svgEl.addEventListener('touchstart',faraGest,{passive:false});svgEl.addEventListener('touchmove',faraGest,{passive:false});
    function panza(){
      const t=s=>s.u==='pensula'?6:1.6;
      const linii=S.desen.map(s=>s.p.length===1?`<circle cx="${s.p[0][0]}" cy="${s.p[0][1]}" r="${s.u==='pensula'?7:3}" fill="#000"/>`:
        `<polyline points="${s.p.map(x=>x.join(',')).join(' ')}" fill="none" stroke="#000" stroke-width="${t(s)}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('');
      /* pânza e UN singur element, păstrat între redesenări: dacă ar fi înlocuit sub degetul care tocmai se ridică, touchend ar
         ajunge la un nod scos din pagină, iar Chromium pierde clicul următoarei atingeri (proba 19.10.2026, 390 px, „Verifică”) */
      svgEl.setAttribute('viewBox',`0 0 ${S.w} ${S.h}`);svgEl.innerHTML=linii;
      return '<span class="pt-svg-loc"></span>';
    }
    function meniuFisier(){
      const it=(a,t,sc,sub)=>`<button type="button" role="menuitem" data-act="${a}"><span>${t}</span>${sc?`<span class="sc">${sc}</span>`:''}${sub?'<span class="sc">›</span>':''}</button>`;
      return `<div class="pt-menu" role="menu" aria-label="Fișier" style="left:6px;top:68px">
        ${it('m:nou','Nou','Ctrl+N')}${it('m:deschidere','Deschidere','Ctrl+O')}${it('m:import','Importați pe pânză','',1)}${it('m:recente','Recente','',1)}<hr>
        ${it('m:salvati','Salvați','Ctrl+S')}${it('sub:salvaca','Salvați ca','',1)}${S.sub==='salvaca'?`<div class="pt-sub" role="menu" aria-label="Salvați ca">${['png','jpg','bmp','gif'].map(k=>it('m:'+k,TIPURI[k].meniu)).join('')}${it('m:alt','Alt format')}</div>`:''}${it('m:proiect','Salvați ca proiect','Ctrl+Shift+S')}<hr>
        ${it('m:imprimati','Imprimați','',1)}${it('m:partajati','Partajați')}${it('m:fundal','Stabilire ca fundal pentru desktop','',1)}${it('m:proprietati','Proprietăți imagine','Ctrl+E')}<hr>
        ${it('m:iesi','Ieși')}
      </div>`;
    }
    function dialog(){
      const D=S.dlg;if(!D)return '';
      const {dir,fis}=continut(D.folder);
      const adr=D.folder.split('/').map(x=>esc(x)).join(' › ');
      const btn=D.sel&&D.sel.startsWith('d:')?'Deschidere':D.fel==='salvare'?'Salvare':'Deschidere';
      return `<div class="pt-ov"><div class="pt-dlg" role="dialog" aria-label="${D.fel==='salvare'?'Salvare ca':'Deschidere'}">
        <div class="pt-dt"><span>${D.fel==='salvare'?'Salvare ca':'Deschidere'}</span><button type="button" class="pt-wb x" data-act="d:anul" aria-label="Închidere">✕</button></div>
        <div class="pt-adr"><button type="button" class="pt-ib" data-act="d:sus" aria-label="Un folder mai sus" title="Un folder mai sus">↑</button><div class="bar" aria-label="Bara de adresă">› ${adr}</div></div>
        <div class="pt-db"><div class="pt-left" aria-label="Panoul din stânga">${FOLDERE.map(f=>`<button type="button" class="${D.folder===f?'on':''}" data-act="d:stg" data-v="${esc(f)}"><span class="pt-ic d" aria-hidden="true"></span>${esc(f)}</button>`).join('')}</div>
          <div class="pt-list" data-f="${esc(D.folder)}" aria-label="Fișierele și folderele din ${esc(D.folder.split('/').pop())}">${dir.map(x=>`<button type="button" class="${D.sel==='d:'+x?'sel':''}" data-act="d:item" data-v="d:${esc(x)}"><span class="pt-ic d" aria-hidden="true"></span>${esc(x)}</button>`).join('')}${fis.map(x=>`<button type="button" class="${D.sel==='f:'+x?'sel':''}" data-act="d:item" data-v="f:${esc(x)}"><span class="pt-ic f" aria-hidden="true"></span>${esc(numeAfis(x))}</button>`).join('')}${!dir.length&&!fis.length?'<div class="gol">Niciun element nu se potrivește cu criteriile de căutare.</div>':''}</div></div>
        <div class="pt-df"><label for="pt-nume">Nume fișier:</label><input id="pt-nume" type="text" value="${esc(D.nume)}" autocomplete="off" spellcheck="false" enterkeyhint="done">
          ${D.fel==='salvare'?`<label for="pt-tip">Salvare cu tipul:</label><select id="pt-tip">${Object.keys(TIPURI).map(k=>`<option value="${k}"${D.tip===k?' selected':''}>${TIPURI[k].n}</option>`).join('')}</select>`
            :`<span></span><select id="pt-tip" aria-label="Tipul de fișiere" disabled><option>Toate fișierele imagine</option></select>`}</div>
        ${D.err?`<div class="pt-err" role="alert">${D.err}</div>`:''}
        <div class="pt-bt"><button type="button" class="imp" data-act="d:ok">${btn}</button><button type="button" data-act="d:anul">Anulare</button></div>
        ${D.conf?`<div class="pt-conf"><div role="alertdialog" aria-label="Confirmare Salvare ca"><h4>Confirmare Salvare ca</h4><p>${esc(D.conf.nume)} există deja.<br>Îl înlocuiți?</p><div class="r"><button type="button" data-act="c:da">Da</button><button type="button" class="imp" data-act="c:nu">Nu</button></div></div></div>`:''}
      </div></div>`;
    }
    function draw(){
      S.ingust=root.clientWidth>0&&root.clientWidth<760;
      /* derularea din fereastra Salvare ca rămâne pe loc la redesenare (altfel, pe telefon, a doua atingere a unui dublu-clic
         nimerea alt folder: proba 19.10.2026, Î4 la 390 px) */
      const ov0=win.querySelector('.pt-ov'),li0=win.querySelector('.pt-list');
      const ovS=ov0?ov0.scrollTop:0,liS=li0?li0.scrollTop:0,liF=li0?li0.dataset.f:null,mn0=win.querySelector('.pt-menu'),mnS=mn0?mn0.scrollTop:0;
      const tl0=win.querySelector('.pt-tools'),tlS=tl0?tl0.scrollLeft:0;
      if(!S.pornit){
        win.innerHTML=`<div class="pt-off"><p>${S.inchideri?'Ai închis Paint.':'Paint e închis.'} Îl pornești din <b>Start</b>: scrii <b>pai</b> și dai clic pe <b>Paint</b> (lecția 8).</p>
          ${S.startMeniu?`<div class="pt-sm" role="dialog" aria-label="Meniul Start"><input type="text" aria-label="Căutare" placeholder="Căutare" value="${esc(S.startText)}" autocomplete="off" spellcheck="false">
            ${STARTAPPS.filter(a=>!S.startText||norm(a).split(' ').some(w=>w.startsWith(norm(S.startText)))).map(a=>`<button type="button" data-act="app" data-v="${a}">${a==='Paint'?'🎨':'▫️'} ${a}</button>`).join('')}</div>`:''}
          <div class="pt-bar"><button type="button" data-act="start" aria-label="Start" title="Start">⊞ Start</button></div></div>`;
      }else{
        const I=S.intreb;
        win.innerHTML=`<div class="pt-tb" data-z="titlu"><div class="pt-tt"><i aria-hidden="true"></i>${esc(titlu())}</div>
            <button type="button" class="pt-wb" data-act="w:min" aria-label="Minimizare" title="Minimizare">—</button><button type="button" class="pt-wb" data-act="w:max" aria-label="Maximizare" title="Maximizare">▢</button><button type="button" class="pt-wb x" data-act="w:x" aria-label="Închidere" title="Închidere">✕</button></div>
          <div class="pt-mb" data-z="meniu"><button type="button" class="pt-mi${S.meniu==='fisier'?' on':''}" data-act="meniu" data-v="fisier" aria-haspopup="menu" aria-expanded="${S.meniu==='fisier'}">Fișier</button><button type="button" class="pt-mi" data-act="meniu" data-v="editare">Editare</button><button type="button" class="pt-mi" data-act="meniu" data-v="viz">Vizualizați</button>
            <span class="pt-sep"></span><button type="button" class="pt-ib" data-act="m:salvati" aria-label="Salvați" title="Salvați (Ctrl+S)">💾</button><button type="button" class="pt-ib" data-act="m:partajati" aria-label="Partajați" title="Partajați">⇪</button><button type="button" class="pt-ib" data-act="undo" aria-label="Anulați" title="Anulați (Ctrl+Z)">↶</button><button type="button" class="pt-ib" data-act="redo" aria-label="Refaceți" title="Refaceți (Ctrl+Y)">↷</button></div>
          <div class="pt-tools-w"><div class="pt-tools" data-z="unelte">${grupuri()}</div><span class="pt-mai" aria-hidden="true">›</span></div>
          <div class="pt-wrap">${panza()}</div>
          <div class="pt-sb" data-z="stare"><span title="Poziția">↖ ${S.poz?S.poz.join(', ')+'px':''}</span><span title="Mărimea pânzei">▢ ${S.w} × ${S.h}px</span>
            <span class="z"><button type="button" data-act="zoom" aria-label="Potrivire la fereastră" title="Potrivire la fereastră">⛶</button><span class="zv" title="Zoom">100 %</span><button type="button" data-act="zoom" aria-label="Micșorare" title="Micșorare">−</button><button type="button" data-act="zoom" aria-label="Mărire" title="Mărire">+</button></span></div>
          ${S.meniu==='fisier'?meniuFisier():''}
          ${S.pop==='instrumente'?`<div class="pt-pop" style="left:8px;top:150px"><div class="pt-tg">${UNELTE.concat(UNELTE_EXT.filter(x=>x.grup==='instrumente')).map(u=>`<button type="button" class="pt-t${S.unealta===u.id?' on':''}" data-act="unealta" data-v="${u.id}" aria-label="${u.nume}" title="${u.nume}">${svgUnealta(u)}</button>`).join('')}</div><div class="pt-gn">Instrumente</div></div>`:''}
          ${dialog()}
          ${I?`<div class="pt-q"><div role="alertdialog" aria-label="Salvați lucrul?"><h4>Salvați lucrul?</h4><p>Există modificări nesalvate în „${esc(S.nume?numeAfis(S.nume):'Fără titlu')}”.</p><div class="r"><button type="button" class="imp" data-act="q:salvati">Salvați</button><button type="button" data-act="q:nusalvati">Nu salvați</button><button type="button" data-act="q:anulare">Anulare</button></div></div></div>`:''}`;
      }
      const loc=win.querySelector('.pt-svg-loc');if(loc)loc.replaceWith(svgEl);
      const ov1=win.querySelector('.pt-ov'),li1=win.querySelector('.pt-list');
      if(ov1&&ovS)ov1.scrollTop=ovS;
      if(li1&&liS&&li1.dataset.f===liF)li1.scrollTop=liS;
      const mn1=win.querySelector('.pt-menu');if(mn1&&mnS)mn1.scrollTop=mnS;
      /* bara cu instrumente îngustă: rămâne derulată unde a lăsat-o elevul, iar „›” arată că mai sunt grupuri în dreapta */
      const tl1=win.querySelector('.pt-tools');if(tl1){if(tlS)tl1.scrollLeft=tlS;semnBara(tl1);tl1.addEventListener('scroll',()=>semnBara(tl1),{passive:true})}
      msgEl.innerHTML=S.msg?`<div class="pt-msg${S.rau?' rau':''}">${S.msg}</div>`:'';
      extEl.innerHTML=EXTS.map(e=>e.panou?e.panou(ctx())||'':'').join('');
      ticks();
      focusDupa();
    }
    function semnBara(t){const w=t.parentNode;if(w&&w.classList)w.classList.toggle('are-mai',t.scrollLeft+t.clientWidth<t.scrollWidth-2)}
    function focusDupa(){
      const D=S.dlg;
      if(S.intreb){const b=win.querySelector('[data-act="q:salvati"]');if(b)b.focus({preventScroll:true});return}
      if(D&&D.conf){const b=win.querySelector('[data-act="c:nu"]');if(b)b.focus({preventScroll:true});return}
      if(D&&D.selNume){D.selNume=false;const i=win.querySelector('#pt-nume');if(i){i.focus({preventScroll:true});try{i.select()}catch(e){}}return}
      if(S.startMeniu){const i=win.querySelector('.pt-sm input');if(i){i.focus({preventScroll:true});const n=i.value.length;try{i.setSelectionRange(n,n)}catch(e){}}}
    }

    /* ---- testele ---- */
    function fisierCu(c){
      const folder=caleElev(c.folder||'elev');
      return [...S.fs.f.entries()].filter(([k,f])=>{
        const dir=k.split('/').slice(0,-1).join('/'),n=k.split('/').pop();
        if(dir!==folder)return false;
        if(c.ext&&EXT_TIP[extDin(n)]!==c.ext)return false;
        if(c.nume&&c.exact&&norm(baza(n))!==norm(c.nume))return false;
        if(c.nume&&norm(baza(n)).replace(/[\s_-]+/g,' ')!==norm(c.nume).replace(/[\s_-]+/g,' ')&&!new RegExp('^'+norm(c.nume).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'[\\s_-]*')+'[\\s_-]*\\d*$').test(norm(baza(n))))return false;
        if(c.cu&&f.desen.filter(s=>s.u===c.cu&&s.p.length>1).length<(c.min||1))return false;
        if(c.nou&&!(f.rev>0))return false;
        return true});
    }
    function test(c){
      switch(c.k){
        case 'pornit':return S.dinStart;
        case 'deschisPaint':return S.pornit;
        case 'unealta':return S.pornit&&S.unealta===c.u;
        case 'desen':{const L=S.desen.filter(s=>(!c.cu||s.u===c.cu)&&(!c.linie||(s.p.length>1&&lungime(s)>=40)));return S.pornit&&L.length>=(c.min||1)}
        case 'salvat':return fisierCu(c).length>0;
        case 'titlu':return S.pornit&&norm(titlu()).includes(norm(c.are));
        case 'nemodificat':return S.pornit&&!S.modificat&&S.desen.length>0&&!!S.cale;
        case 'inchis':return !S.pornit&&S.inchideri>0;
        case 'faraPierderi':return !S.pierdut;
        case 'deschis':return S.deschise.some(d=>(!c.folder||d.folder===caleElev(c.folder))&&(!c.nume||norm(baza(d.nume))===norm(c.nume)));
        case 'neatins':{const f=S.fs.f.get(c.f);return !!f&&f.rev===0}
        case 'intrebat':return S.intrebat>0;
        case 'meniu':return S.ev.some(x=>x.tip==='meniu'&&x.m===(c.m||'fisier'));
        case 'nou':return S.nou>0;
        case 'inlocuireRefuzata':return S.refuzat>0;
        case 'zona':{const l=S.zone[S.zone.length-1];return S.zone.length>0&&(l===c.z||(c.z==='unelte'&&l==='culori'))}
        case 'continuat':{const f=caleElev(c.folder||'elev'),potr=x=>x.folder===f&&(!c.nume||norm(baza(x.nume))===norm(c.nume));
          let i=-1,j=-1,gata=false;S.ev.forEach((x,k)=>{if(x.tip==='deschis'&&potr(x)){i=k;j=-1}else if(i>=0&&x.tip==='desen'&&j<0)j=k;else if(j>=0&&x.tip==='salvat'&&potr(x))gata=true});
          return gata}
        case 'raspuns':{const v=norm(S.rasp).replace(/\s*[x×*]\s*/g,' x ');return !!v&&[].concat(c.are).filter(x=>v.includes(norm(x))).length>=(c.minN||[].concat(c.are).length)}
        case 'toate':return (c.c||[]).every(test);
      }
      for(const e of EXTS){if(e.verifica){const r=e.verifica(c,ctx());if(r!=null)return !!r}}
      return false;
    }
    function ticks(){if(testeEl)testeEl.innerHTML=(Q.checks||[]).map(c=>`<li class="${test(c)?'ok':''}">${c.ce}</li>`).join('')}

    /* ---- operațiile pentru soluții (Arată-mi, poarta) ---- */
    function aplica(ops){
      (ops||[]).forEach(o=>{const [k,a,b,c2,d]=o;
        if(k==='start'){if(!S.pornit)porneste(true)}
        else if(k==='u')alegeUnealta(a);
        else if(k==='linie')trage({u:S.unealta,p:[[a,b],[c2,d]]});
        else if(k==='punct')trage({u:S.unealta,p:[[a,b]]});
        else if(k==='cmd')cmd(a);
        else if(k==='meniu'){S.meniu='fisier';S.sub=null;ev('meniu',{m:'fisier'})}
        else if(k==='ctrl'){if(a==='s')cmd('salvati');else if(a==='o')cmd('deschidere');else if(a==='n')cmd('nou');else if(a==='z')anuleaza();else if(a==='y')reface()}
        else if(k==='nume'){if(S.dlg){S.dlg.nume=a;S.dlg.sel=null}}
        else if(k==='nav'){if(S.dlg)intraIn(caleElev(a))}
        else if(k==='sel'){if(S.dlg){S.dlg.sel=a;if(a.startsWith('f:'))S.dlg.nume=numeAfis(a.slice(2))}}
        else if(k==='tip'){if(S.dlg&&TIPURI[a])S.dlg.tip=a}
        else if(k==='ok')dlgOk();
        else if(k==='anul')S.dlg=null;
        else if(k==='da')confDa();
        else if(k==='nu')confNu();
        else if(k==='intreb')raspIntreb(a);
        else if(k==='zona'){S.zone.push(a);ev('zona',{z:a})}
        else if(k==='raspuns')S.rasp=a;
        else if(k==='salveaza'){cmd(c2||'png');if(S.dlg){S.dlg.nume=b;intraIn(caleElev(a));S.dlg.nume=b;dlgOk()}}
        else if(k==='deschide'){cmd('deschidere');if(S.dlg){intraIn(caleElev(a));S.dlg.nume=b;dlgOk()}}
        else{for(const e of EXTS){if(e.op&&e.op(o,ctx()))break}}
      });
    }
    function run(ops,fresh){if(fresh)S=stareNoua();aplica(ops);const r=root.querySelector('.pt-rasp');if(r)r.value=S.rasp;draw()}
    body._sim={run,stare:()=>S,test};

    /* ---- gesturile ---- */
    let ultimClic={v:null,t:0};
    root.addEventListener('click',e=>{
      if(e.target.closest('[data-reset]')){run([],true);win.focus({preventScroll:true});return}
      if(Q.explorare&&S.pornit&&win.contains(e.target)&&!e.target.closest('.pt-ov')){   /* o fereastră deschisă totuși se închide cu clic */
        const z=e.target.closest('[data-z]');if(!z)return;e.preventDefault();
        const zz=z.dataset.z;S.zone.push(zz);ev('zona',{z:zz});msg(`Ai apăsat pe: <b>${ZONE[zz]}</b>.`);draw();   /* culori = tot bara cu instrumente (testul zona{z:'unelte'}) */
        const el=win.querySelector(`[data-z="${zz}"]`);if(el)el.classList.add('pt-zsel');return}
      const b=e.target.closest('[data-act]');if(!b||!root.contains(b))return;
      const a=b.dataset.act,v=b.dataset.v;
      for(const x of EXTS){if(x.actiune&&x.actiune(a,v,ctx())){draw();return}}
      msg('');
      if(a==='start'){S.startMeniu=!S.startMeniu}
      else if(a==='app'){if(v==='Paint')porneste(true);else{S.startMeniu=false;msg(`Ai pornit ${esc(v)}? Aici nu: azi pornești <b>Paint</b>.`,true)}}
      else if(a==='meniu'){if(v==='fisier'){S.meniu=S.meniu==='fisier'?null:'fisier';S.sub=null;if(S.meniu)ev('meniu',{m:'fisier'})}
        else msg(v==='editare'?'Meniul <b>Editare</b> (Decupare, Copiere, Lipire…) îl folosești la lecția 19.':'Meniul <b>Vizualizați</b> (riglele, zoomul) îl folosești la lecția 20.')}
      else if(a==='sub:salvaca'){S.sub=S.sub==='salvaca'?null:'salvaca'}
      else if(a.startsWith('m:')){const c=a.slice(2);
        if(['nou','deschidere','salvati','iesi','proiect','alt'].includes(c)||TIPURI[c])cmd(c);
        else{S.meniu=null;msg(c==='import'||c==='recente'?`<b>${c==='import'?'Importați pe pânză':'Recente'}</b>: azi deschizi imaginile cu <b>Deschidere</b>.`:'Comanda aceasta nu o folosim azi.')}}
      else if(a==='w:x')cmd('x');
      else if(a==='w:min'||a==='w:max')msg('Fereastra Paint-ului din pagină nu se micșorează și nu se mărește. Butoanele ferestrei le-ai învățat la lecția 8.');
      else if(a==='undo')anuleaza();else if(a==='redo')reface();
      else if(a==='unealta')alegeUnealta(v);
      else if(a==='grup'){S.meniu=null;if(v==='instrumente'){S.pop=S.pop==='instrumente'?null:'instrumente'}else{const g=GRUPURI.find(x=>x[0]===v);msg(`Grupul <b>${g?g[1]:v}</b>: ${LECTIE_GRUP(g?g[2]:0)}.`)}}
      else if(a==='zoom')msg('Zoomul (cât de mare vezi pânza) îl schimbi la lecția 20. Azi doar citești: 100 %.');
      else if(a==='d:anul'){S.dlg=null}
      else if(a==='d:stg'){if(S.dlg){S.dlg.folder=v;S.dlg.sel=null;S.dlg.err=''}}
      else if(a==='d:sus'){if(S.dlg&&S.dlg.folder.includes('/')){S.dlg.folder=S.dlg.folder.split('/').slice(0,-1).join('/');S.dlg.sel=null}}
      else if(a==='d:item'){const D=S.dlg;if(D){const acum=Date.now(),dublu=ultimClic.v===v&&acum-ultimClic.t<500;ultimClic={v,t:dublu?0:acum};
        if(dublu&&v.startsWith('d:'))intraIn(D.folder+'/'+v.slice(2));
        else if(dublu&&v.startsWith('f:')){D.nume=numeAfis(v.slice(2));D.sel=null;dlgOk()}   /* în Salvare ca: Salvare cu numele lui → „există deja” */
        else{D.sel=v;D.err='';if(v.startsWith('f:'))D.nume=numeAfis(v.slice(2))}}}
      else if(a==='d:ok')dlgOk();
      else if(a==='c:da')confDa();else if(a==='c:nu')confNu();
      else if(a.startsWith('q:'))raspIntreb(a.slice(2));
      if(a!=='meniu'&&a!=='sub:salvaca'&&!a.startsWith('m:')&&S.meniu&&!S.dlg)S.meniu=null;
      draw();
      if(!S.dlg&&!S.intreb&&!S.startMeniu){const t=a==='meniu'&&S.meniu?win.querySelector('.pt-menu button'):null;(t||win).focus({preventScroll:true})}
      else if(S.dlg&&['d:item','d:stg','d:sus'].includes(a)){const t=win.querySelector(a==='d:item'?'.pt-list button.sel':a==='d:stg'?'.pt-left button.on':'[data-act="d:sus"]');if(t)t.focus({preventScroll:true})}
    });
    /* desenul: mouse, deget, creion — punctele în coordonatele pânzei */
    let tras=null;
    const pct=(svg,e)=>{const r=svg.getBoundingClientRect();return [Math.max(0,Math.min(S.w,Math.round((e.clientX-r.left)/r.width*S.w))),Math.max(0,Math.min(S.h,Math.round((e.clientY-r.top)/r.height*S.h)))]};
    win.addEventListener('pointerdown',e=>{
      const svg=e.target.closest('.pt-svg');if(!svg||Q.explorare||S.dlg||S.intreb)return;
      if(S.meniu||S.pop){S.meniu=null;S.pop=null;draw();return}
      if(!['creion','pensula'].includes(S.unealta)&&!UNELTE_EXT.some(u=>u.id===S.unealta&&u.deseneaza))return;
      e.preventDefault();try{svg.setPointerCapture(e.pointerId)}catch(x){}
      tras={u:S.unealta,p:[pct(svg,e)],svg};win.focus({preventScroll:true});
    });
    win.addEventListener('pointermove',e=>{
      const svg=e.target.closest('.pt-svg')||(tras&&tras.svg);
      if(svg&&!Q.explorare){const p=pct(svg,e);S.poz=p;const sp=win.querySelector('.pt-sb span');if(sp)sp.textContent='↖ '+p.join(', ')+'px'}
      if(!tras)return;e.preventDefault();const p=pct(tras.svg,e),l=tras.p[tras.p.length-1];
      if(Math.hypot(p[0]-l[0],p[1]-l[1])>=3){tras.p.push(p);
        let pl=tras.svg.querySelector('polyline[data-viu]');
        if(!pl){pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');pl.setAttribute('data-viu','1');pl.setAttribute('fill','none');pl.setAttribute('stroke','#000');pl.setAttribute('stroke-width',tras.u==='pensula'?6:1.6);pl.setAttribute('stroke-linecap','round');pl.setAttribute('vector-effect','non-scaling-stroke');tras.svg.appendChild(pl)}
        pl.setAttribute('points',tras.p.map(x=>x.join(',')).join(' '))}
    });
    const gata=()=>{if(!tras)return;const s={u:tras.u,p:tras.p};tras=null;
      const ext=UNELTE_EXT.find(u=>u.id===s.u&&u.deseneaza);
      if(ext){const k0=S.ev.length;
        if(ext.deseneaza(S,s,ctx())!==false){S.refa=[];S.modificat=true;   /* ca trage(): evenimentul 'desen' (testul continuat) — judecata 2, AA */
          if(!S.ev.slice(k0).some(x=>x.tip==='desen'))ev('desen',{u:s.u,puncte:s.p.length})}}
      else trage(s);draw()};
    win.addEventListener('pointerup',gata);win.addEventListener('pointercancel',gata);
    root.addEventListener('input',e=>{
      if(e.target.id==='pt-nume'&&S.dlg){S.dlg.nume=e.target.value;if(S.dlg.sel){S.dlg.sel=null;const bt=win.querySelector('[data-act="d:ok"]');if(bt)bt.textContent=S.dlg.fel==='salvare'?'Salvare':'Deschidere';const s=win.querySelector('.pt-list .sel');if(s)s.classList.remove('sel')}}
      else if(e.target.classList.contains('pt-rasp')){S.rasp=e.target.value;ticks()}
      else if(e.target.matches('.pt-sm input')){S.startText=e.target.value;draw()}
    });
    root.addEventListener('change',e=>{if(e.target.id==='pt-tip'&&S.dlg&&TIPURI[e.target.value]){S.dlg.tip=e.target.value;const n=S.dlg.nume;draw();const i=win.querySelector('#pt-nume');if(i){i.value=n}}});
    root.addEventListener('focusin',e=>{if(e.target.id==='pt-nume'&&S.dlg&&S.dlg.sel){/* clic în „Nume fișier”: butonul redevine Salvare */S.dlg.sel=null;const bt=win.querySelector('[data-act="d:ok"]');if(bt)bt.textContent=S.dlg.fel==='salvare'?'Salvare':'Deschidere';const s=win.querySelector('.pt-list .sel');if(s)s.classList.remove('sel')}});
    root.addEventListener('keydown',e=>{
      const k=e.key,kl=String(k).toLowerCase(),inInput=e.target.tagName==='INPUT'||e.target.tagName==='SELECT';
      if(e.target.classList&&e.target.classList.contains('pt-rasp')){if(k==='Enter'){e.preventDefault();const b=document.getElementById('chk');if(b)b.click()}return}
      if(!win.contains(e.target)&&e.target!==win)return;
      if(S.startMeniu&&k==='Enter'&&e.target.matches('.pt-sm input')){e.preventDefault();const f=STARTAPPS.filter(x=>!S.startText||norm(x).split(' ').some(w=>w.startsWith(norm(S.startText))))[0];if(f==='Paint'){porneste(true);draw();win.focus({preventScroll:true})}else if(f){S.startMeniu=false;msg(`Ai pornit ${f}? Aici nu: azi pornești <b>Paint</b>.`,true);draw()}return}
      if(S.intreb){if(k==='Escape'){e.preventDefault();raspIntreb('anulare');draw();win.focus({preventScroll:true})}return}
      if(S.dlg){
        if(S.dlg.conf){if(k==='Escape'){e.preventDefault();confNu();draw()}return}
        if(k==='Escape'){e.preventDefault();S.dlg=null;draw();win.focus({preventScroll:true});return}
        if(k==='Enter'&&(e.target.id==='pt-nume'||e.target.closest('.pt-list'))){e.preventDefault();if(e.target.closest('.pt-list')&&S.dlg.sel&&S.dlg.sel.startsWith('f:')&&S.dlg.fel==='deschidere'){dlgOk()}else dlgOk();draw();if(!S.dlg)win.focus({preventScroll:true})}
        return}
      if(k==='Escape'&&(S.meniu||S.pop||S.startMeniu)){e.preventDefault();S.meniu=null;S.pop=null;S.startMeniu=false;draw();win.focus({preventScroll:true});return}
      if(!S.pornit||inInput)return;
      if(e.ctrlKey&&!e.altKey){
        if(Q.explorare){if(['s','o','n','z','y'].includes(kl)){e.preventDefault();msg(EXPL_TASTE);draw()}return}   /* explorare: tastele nu deschid ferestre (judecata 2, Z) */
        if(kl==='s'&&e.shiftKey){e.preventDefault();cmd('proiect');draw();return}
        const m={s:'salvati',o:'deschidere',n:'nou'}[kl];
        if(m){e.preventDefault();cmd(m);draw();if(!S.dlg&&!S.intreb)win.focus({preventScroll:true});return}
        if(kl==='z'){e.preventDefault();anuleaza();draw();win.focus({preventScroll:true});return}
        if(kl==='y'){e.preventDefault();reface();draw();win.focus({preventScroll:true});return}
      }
    });
    /* Ctrl+S / Ctrl+O cu focusul în afara Paint-ului din pagină (de exemplu imediat după ce apare exercițiul): le ia Paint-ul din
       pagină, nu browserul (care ar salva PAGINA WEB). Nu le ia dintr-o altă casetă de scris; se desprinde singur când exercițiul
       dispare din pagină. (judecata 1, J1-04) */
    const tasteDoc=e=>{
      if(!document.body.contains(root)){document.removeEventListener('keydown',tasteDoc,true);return}
      if(!e.ctrlKey||e.altKey||e.metaKey)return;
      const kl=String(e.key).toLowerCase();if(kl!=='s'&&kl!=='o')return;
      const t=e.target;if(root.contains(t))return;   /* în Paint-ul din pagină lucrează ascultătorul lui */
      if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||'')))return;
      e.preventDefault();
      if(Q.explorare){msg(EXPL_TASTE);draw();return}   /* explorare: browserul nu salvează pagina, iar Paint-ul din pagină nu deschide nimic (judecata 2, Z) */
      if(!S.pornit||S.dlg||S.intreb){msg(S.pornit?'':'Paint e închis: pornește-l din <b>Start</b>.',!S.pornit);draw();return}
      cmd(kl==='o'?'deschidere':e.shiftKey?'proiect':'salvati');draw();if(!S.dlg&&!S.intreb)win.focus({preventScroll:true});
    };
    document.addEventListener('keydown',tasteDoc,true);
    if(window.ResizeObserver){let w0=0;new ResizeObserver(()=>{const w=root.clientWidth;if(Math.abs(w-w0)>4){const ing=w<760;w0=w;if(ing!==S.ingust&&!tras){S.ingust=ing;draw()}}}).observe(root)}
    draw();
    const nav=api.checkButton(()=>{
      const bad=(Q.checks||[]).find(c=>!test(c));ticks();
      if(!bad){nav.innerHTML='';api.resolve(true);win.focus({preventScroll:true});return}
      api.resolve(false,bad.msg||('Testul care nu trece încă: '+bad.ce+'.'));
      win.focus({preventScroll:true});
      api.revealButton(()=>{run(Q.sol,true);nav.innerHTML='';api.giveUp(Q.solText||'am făcut pașii pentru tine în Paint-ul din pagină. Privește fereastra și testele: acum trec toate.')});
    },'Verifică');
  },
  rezolva(Q,body){body._sim.run(Q.sol,true);return true},
  gresit(Q,body){body._sim.run(Q.gresit||[],true);return true}
  };
}

const SimPaint=creeaza({});

/* TipPixeli: un desen mic, mărit (fiecare pătrățel = un pixel), și o casetă în care elevul scrie mărimea „lățime × înălțime”.
   Q: px:['.rr.','rrrr'] (rânduri egale; '.' = alb; litere: k negru, r roșu, v verde, a albastru, g galben, m maro), marime?:22,
   cere?:'marime'|'latime'|'inaltime' (implicit marime), eticheta?, tipic? (răspunsul greșit pentru poartă).
   Primește „7 x 6”, „7×6”, „7 * 6”, „7 pe 6”, cu sau fără „pixeli”/„px”. */
const CUL={k:'#1a1a1a',r:'#d62828',v:'#2a9d3a',a:'#2f6fd1',g:'#f2c200',m:'#8a5a2b','.':'#ffffff'};
function pxHtml(rows,m){m=m||22;const w=rows[0].length;
  return `<div role="img" aria-label="Desen mărit: ${w} pătrățele pe lățime și ${rows.length} pe înălțime" style="display:inline-grid;grid-template-columns:repeat(${w},${m}px);gap:1px;background:#9a9a9a;border:1px solid #9a9a9a;margin:6px 0">${rows.map(r=>[...r].map(ch=>`<span style="width:${m}px;height:${m}px;background:${CUL[ch]||'#fff'}"></span>`).join('')).join('')}</div>`}
function evalPx(v,Q){
  const w=Q.px[0].length,h=Q.px.length,cere=Q.cere||'marime';
  const s=norm(v).replace(/pixeli|pixel|px/g,' ').replace(/,/g,' ');
  const nr=(s.match(/\d+/g)||[]).map(Number);
  if(cere==='latime')return nr.length===1&&nr[0]===w?{ok:true}:{ok:false,msg:nr.includes(h)&&h!==w?'Ai numărat pe înălțime. Lățimea se numără de la stânga la dreapta, pe un rând.':'Numără pătrățelele de pe UN rând, de la stânga la dreapta.'};
  if(cere==='inaltime')return nr.length===1&&nr[0]===h?{ok:true}:{ok:false,msg:'Numără rândurile, de sus în jos.'};
  if(nr.length!==2)return {ok:false,msg:'Scrie două numere: întâi lățimea, apoi înălțimea, cu „x” între ele (de exemplu 4 x 2).'};
  if(nr[0]===w&&nr[1]===h)return {ok:true};
  if(nr[0]===h&&nr[1]===w)return {ok:false,msg:'Ai inversat: întâi vine lățimea (de la stânga la dreapta), apoi înălțimea (de sus în jos).'};
  return {ok:false,msg:'Numără din nou: pe un rând (lățimea), apoi rândurile (înălțimea).'};
}
const TipPixeli={
  render(Q,body,api){
    css();const esc=api.esc||E;
    body.innerHTML=`<div class="pt">${pxHtml(Q.px,Q.marime)}<div class="pt-panou"><label class="lbl" for="pt-px">${esc(Q.eticheta||'Mărimea, în pixeli (lățime x înălțime):')}</label><input id="pt-px" class="pt-rasp" type="text" inputmode="text" autocomplete="off" spellcheck="false"></div></div>`;
    const inp=body.querySelector('#pt-px');
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const b=document.getElementById('chk');if(b&&!inp.readOnly)b.click()}});
    const ok=()=>{const w=Q.px[0].length,h=Q.px.length;return (Q.cere==='latime'?String(w):Q.cere==='inaltime'?String(h):w+' x '+h)};
    const nav=api.checkButton(()=>{
      const r=evalPx(inp.value,Q);
      if(r.ok){inp.readOnly=true;nav.innerHTML='';api.resolve(true);return}
      api.resolve(false,r.msg);inp.focus({preventScroll:true});
      api.revealButton(()=>{inp.value=ok();inp.readOnly=true;nav.innerHTML='';api.giveUp(`<b>${esc(ok())}</b>`)});
    },'Verifică');
  },
  rezolva(Q,body){const w=Q.px[0].length,h=Q.px.length;body.querySelector('#pt-px').value=Q.cere==='latime'?String(w):Q.cere==='inaltime'?String(h):w+' x '+h;return true},
  gresit(Q,body){const w=Q.px[0].length,h=Q.px.length;body.querySelector('#pt-px').value=Q.tipic||(h+' x '+w);return true}
};
window.SimPaint=SimPaint;
window.TipPixeli=TipPixeli;
window.PaintSim={versiune:1,creeaza,DESENE,TIPURI,FOLDERE,UNELTE,GRUPURI,evenimente:EVENIMENTE,pxHtml,evalPx};
})();
