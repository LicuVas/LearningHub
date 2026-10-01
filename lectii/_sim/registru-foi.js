/* Simulatorul „registru” pentru lecțiile LearningHub — fișier comun (lectii/_sim/registru-foi.js), extensie NOUĂ.
   PROPRIETAR: autorul lecției VIII · M1 · nr. 3 („Operații cu registrul și cu foile de calcul”), 28.09.2026.
   Nu modifică și nu folosește excelx.js: e o fereastră Excel mică, cu REGISTRUL (nou, salvare, salvare ca, formate,
   închidere, deschidere) și FILELE FOILOR (foaie nouă, trecere, redenumire, culoare, ștergere, mutare, copiere).

   Folosire în pagină (după motor.js):
     <script src="../../_sim/registru-foi.js"></script>
     JocMotor.porneste({ …, tipuri:{registru:SimRegistru} })

   FIDELITATEA (regula 9, jocuri/README.md §1). Tot ce e mai jos e PROBAT în Excel-ul real (Microsoft 365, Build 20326,
   interfața în engleză, Windows în română), pe un desktop ascuns: lectii/viii/m1-l03/_proba/p2_foi.json, p3_foi_lectie.json,
   p4_registru.json, p5_rest.json, p6_detalii.json (scripturile de lângă ele).
   - Registru nou (Ctrl+N): „Book1”, „Book2”… cu O foaie, „Sheet1”. Butonul + (Add Sheet) pune foaia nouă IMEDIAT DUPĂ
     foaia activă și o face activă; numele = „Sheet” + un număr care crește în sesiune (după Sheet3 ștearsă vine Sheet4);
     într-un registru redeschis numărătoarea pornește iar de la 1, sărind peste numele luate (p6 c).
   - Shift+F11 și Inserare... › Worksheet › OK pun foaia nouă ÎNAINTEA foii active (p2, p5 f).
   - Ctrl+PageDown / Ctrl+PageUp: foaia următoare / anterioară; la capete rămâne pe loc, nu sare la celălalt capăt (p2).
   - Redenumire (dublu clic pe filă sau clic dreapta › Rename): numele vechi e selectat, ce scrii îl înlocuiește, Enter
     confirmă, Esc renunță. Caracterele : \ / ? * [ ] nu se scriu deloc (Ore/2 -> Ore2), după 31 de caractere nu se mai
     scrie nimic; nume gol -> mesajul „You typed an invalid name…”; nume luat (și cu altă mărime a literelor: note/Note)
     -> „That name is already taken. Try a different one.”, iar după OK rămâi în editare, cu textul selectat (p2).
   - Meniul de clic dreapta al filei = CommandBars("Ply"): Insert..., Delete, Rename, Move or Copy..., View Code,
     Protect Sheet..., Tab Color ›, Hide, Unhide... (inactiv dacă nu e nimic ascuns), Select All Sheets (p2 meniu).
   - Tab Color: primul rând al culorilor temei + Standard Colors (numele din UI Automation) + No Color. Fila colorată
     activă are doar o dungă de culoare; neactivă e plină de culoare (captura p3). Ctrl+Z anulează culoarea (p5 d).
   - Ștergere: foaie GOALĂ -> fără întrebare; foaie cu date -> „Microsoft Excel will permanently delete this sheet. Do you
     want to continue?” [Delete] [Cancel]; după ștergere devine activă foaia din DREAPTA (sau cea din stânga, dacă era
     ultima). Ștergerea NU se poate anula și golește lista de anulări: Ctrl+Z nu mai desface nici ce făcuseși înainte
     (p3, p5 k). Singura foaie vizibilă nu se șterge: „A workbook must contain at least one visible worksheet…” (p3).
   - Mutare sau copiere: fereastra „Move or Copy”, lista „Before sheet” cu „(move to end)” la final, bifa „Create a copy”;
     copia se numește „Septembrie (2)” și are aceleași date (p3). Ctrl+Z anulează o mutare, o foaie nouă, o redenumire (p2).
   - Salvare: Ctrl+S pe un registru nesalvat -> fereastra „Save this file” (File name, Choose a Location, More options…,
     Save, Cancel); „More options…” și „More locations” duc la Fișier › Save As, cu Browse (p4, p6, p8 b2). Locul propus =
     cel folosit ultima dată pe calculator (p8; judecătorul g10), deci poate fi al colegului: start.locPropus (implicit Desktop).
     Ctrl+S pe un fișier salvat: fără nicio fereastră (p4).
   - PRIMA salvare (și „Save your changes…” la închidere) cu un nume care există deja în locul ales: fereastra „Save As”,
     „The file X.xlsx already exists. Do you want to replace the existing file?” [OK] [Anulare] (butoanele de la Windows-ul în
     română), Anulare implicit; OK înlocuiește fișierul; Anulare închide mesajul și fereastra de salvare, iar Excel o deschide
     din nou, cu același loc: la Ctrl+S cu numele de probă (Book1), la Ctrl+W („Save your changes…”) cu numele scris înainte,
     selectat (p8 a, d; judecata 2: k1-k3). NU e „Confirm Save As”.
   - Numele foii (p8 c): „History” -> „History is a reserved name.”; apostroful la final -> mesajul „invalid name”;
     apostroful de la început dispare ('Note -> Note); în mijloc e voie (No'te). (Mărimea literelor la History: neprobată.)
   - Salvare ca (F12): fereastra „Save As” cu „File name:” și „Save as type:” (cele 29 de tipuri, în ordinea din Excel);
     nume existent -> „Confirm Save As”: „X.xlsx already exists. Do you want to replace it?” [Yes] [No] (p4).
   - .csv dintr-un registru cu mai multe foi -> „The selected file type does not support workbooks that contain multiple
     sheets…” [OK] [Cancel]; se salvează DOAR foaia activă, doar valorile (formula -> rezultatul ei), fără aldin/culori;
     foaia activă primește numele fișierului; apare bara „POSSIBLE DATA LOSS”; redeschis, .csv-ul are o singură foaie (p4, p5 g).
   - .pdf: se salvează foaia activă; registrul rămâne cel de dinainte (titlul nu se schimbă) (p4).
   - Închidere (Ctrl+W, Fișier › Close) cu modificări nesalvate -> „Save your changes to this file?” [Save] [Don't Save]
     [Cancel], cu numele și locul (p4, p5 a). Don't Save -> revine cum era la ultima salvare (p5 b). După ultimul registru
     închis, Excel rămâne deschis, gol, cu titlul „Excel”; Ctrl+N face din nou un registru (p5 j).
   - Deschidere (Ctrl+O -> Fișier › Open › Browse; Ctrl+F12 direct): fereastra „Open”, cu lista „Files of type”, implicit
     „All Excel Files” (fără .csv și fără .pdf); „Text Files” arată .csv; „All Files” arată tot; un .pdf deschis în Excel
     arată semne fără sens („%PDF-1.7” în A1) (p5 h, p6 e).
   ABATERI, spuse pe ecran: Fișier (File) e aici o listă scurtă (în Excel e o pagină întreagă, iar Save As / Open cer apoi
   Browse); tastele pe care le ia browserul (Ctrl+N, Ctrl+W, Ctrl+PageUp/PageDown, F12) se apasă din butoanele de sub titlu;
   un singur registru deschis odată; pe telefon, apăsarea lungă pe filă = clic dreapta, iar tragerea cu Ctrl (copierea) se
   face din Mutare sau copiere. NEPROBAT cu mouse-ul real (mesajele de mouse postate sunt ignorate de bara filelor,
   p0_diag.json): tragerea filei și dublul clic (le descrie Microsoft, ro-ro și en-us); Ctrl+Z după o copie de foaie.

   CÂMPURI pe întrebare (t:'registru'):
     q, start:{gol?, registru?:{nume, fisier?:'Documente/X.xlsx', foi:[{n, d:{A1:'…'}, c?:'#hex'}], a?, m?},
               fisiere?:{Documente:[{n:'X.xlsx', foi?:[…], coleg?:true}], Desktop:[…]},
               locPropus?:'Desktop'   (locul „folosit ultima dată”, propus la prima salvare; implicit Desktop, ca elevul să aleagă singur)}
     teste:[{ce:'…', <condiție>}]   — se bifează pe loc; „Verifică” cere toate condițiile (Q.verifica = aceleași teste)
     condiții: foi:[…] (ordinea exactă), areFoi, nuAreFoi, activa, culoare:{Foaie:'orice'|'nu'|'verde'|'#HEX'},
               date:{Foaie:{A1:'…'}}, salvat:{folder, model?|fisier?, ext, foi?, culoare?}, deschisDin:{folder, model?|fisier?, ext},
               nemodificat:true, redeschis:true, inchis:true, colegi:true, neschimbat:['Documente/X.xlsx'], nouFacut:true
     numarFoi:N (câte foi are registrul deschis)
     rezolvare:[[op,…]], greseala:[[op,…]]   — pentru poartă și pentru „Arată-mi răspunsul” (op-urile de mai jos)
     o:[…], ok:i                    — „încearcă în foaie, apoi alege”: fără Verifică, răspunsul e varianta aleasă
     taste?:false                   — ascunde rândul de taste (la exercițiile doar cu foi)
   op-uri: nou · plus · inserareInainte · activeaza n · redenumeste n nou · culoare n hex|null · sterge n · muta n inainteDe|null
           · copiaza n inainteDe|null · scrie n adr val · salveaza {folder, nume} · salveazaCa {folder, nume, tip, inlocuieste?}
           · inchide 'da'|'nu' · deschide 'folder/fisier'
   salveaza {folder, nume, inlocuieste?}: cu un nume luat și fără inlocuieste = Anulare (nu salvează); cu inlocuieste = OK (peste fișier). */
const SimRegistru=(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fara=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const copie=o=>JSON.parse(JSON.stringify(o));

/* ---------------- ce arată Excel-ul real (probat) ---------------- */
const TIPURI=['Excel Workbook (*.xlsx)','Excel Macro-Enabled Workbook (*.xlsm)','Excel Binary Workbook (*.xlsb)','Excel 97-2003 Workbook (*.xls)',
 'CSV UTF-8 (Comma delimited) (*.csv)','XML Data (*.xml)','Single File Web Page (*.mht;*.mhtml)','Web Page (*.htm;*.html)','Excel Template (*.xltx)',
 'Excel Macro-Enabled Template (*.xltm)','Excel 97-2003 Template (*.xlt)','Text (Tab delimited) (*.txt)','Unicode Text (*.txt)','XML Spreadsheet 2003 (*.xml)',
 'Microsoft Excel 5.0/95 Workbook (*.xls)','CSV (Comma delimited) (*.csv)','Formatted Text (Space delimited) (*.prn)','Text (Macintosh) (*.txt)',
 'Text (MS-DOS) (*.txt)','CSV (Macintosh) (*.csv)','CSV (MS-DOS) (*.csv)','DIF (Data Interchange Format) (*.dif)','SYLK (Symbolic Link) (*.slk)',
 'Excel Add-in (*.xlam)','Excel 97-2003 Add-in (*.xla)','PDF (*.pdf)','XPS Document (*.xps)','Strict Open XML Spreadsheet (*.xlsx)','OpenDocument Spreadsheet (*.ods)'];
const extTip=t=>{const m=t.match(/\(\*\.([a-z]+)/i);return m?m[1].toLowerCase():'xlsx'};
const FOLOSITE={xlsx:1,csv:1,pdf:1};
const FILTRE=[
 {t:'All Excel Files (*.xl*;*.xlsx;*.xlsm;*.xlsb;*.xlam;*.xltx;*.xltm;*.xls;*.xlt;*.htm;*.html;*.mht;*.mhtml;*.xml;*.xla;*.xlm;*.xlw;*.odc;*.ods)',
  e:['xlsx','xlsm','xlsb','xlam','xltx','xltm','xls','xlt','htm','html','mht','mhtml','xml','xla','xlm','xlw','odc','ods']},
 {t:'Text Files (*.prn;*.txt;*.csv)',e:['prn','txt','csv']},
 {t:'All Files (*.*)',e:null}];
const TEMA=[['White, Background 1','#FFFFFF'],['Black, Text 1','#000000'],['Light Gray, Background 2','#E7E6E6'],['Blue-Gray, Text 2','#44546A'],
 ['Blue, Accent 1','#4472C4'],['Orange, Accent 2','#ED7D31'],['Gray, Accent 3','#A5A5A5'],['Gold, Accent 4','#FFC000'],['Blue, Accent 5','#5B9BD5'],['Green, Accent 6','#70AD47']];
const STD=[['Dark Red','#C00000','roșu închis'],['Red','#FF0000','roșu'],['Orange','#FFC000','portocaliu'],['Yellow','#FFFF00','galben'],['Light Green','#92D050','verde deschis'],
 ['Green','#00B050','verde'],['Light Blue','#00B0F0','albastru deschis'],['Blue','#0070C0','albastru'],['Dark Blue','#002060','albastru închis'],['Purple','#7030A0','mov']];
const VERZI=['#00B050','#92D050','#70AD47'];
const numeCuloare=h=>{const x=STD.find(c=>c[1]===h);if(x)return `${x[0]} (${x[2]})`;const y=TEMA.find(c=>c[1]===h);return y?y[0]:h};
const TXT={
 stergere:'Microsoft Excel will permanently delete this sheet. Do you want to continue?',
 stergereRo:'Excel va șterge definitiv această foaie. Vrei să continui?',
 singura:'A workbook must contain at least one visible worksheet.\n\nTo hide, delete, or move the selected sheet(s), you must first insert a new sheet or unhide a sheet that is already hidden.',
 singuraRo:'Un registru trebuie să aibă măcar o foaie vizibilă. Ca s-o ștergi, fă întâi altă foaie.',
 dublat:'That name is already taken. Try a different one.',dublatRo:'Numele e deja luat de altă foaie. Alege altul.',
 rezervat:'History is a reserved name.',rezervatRo:'History e un nume oprit: Excel îl folosește pentru el.',
 existaDeja:f=>`The file ${f} already exists.
Do you want to replace the existing file?`,existaDejaRo:'Fișierul există deja. Îl înlocuiești pe cel vechi?',
 invalid:'You typed an invalid name for a sheet or chart. Make sure that:\n\n• The name that you type does not exceed 31 characters.\n• The name does not contain any of the following characters:  :  \\  /  ?  *  [  or  ]\n• You did not leave the name blank.',
 invalidRo:'Numele nu e bun: cel mult 31 de caractere, fără : \\ / ? * [ ] și nu gol.',
 csvFoi:'The selected file type does not support workbooks that contain multiple sheets.\n\n• To save only the active sheet, click OK.\n• To save all sheets, save them individually using a different file name for each, or choose a file type that supports multiple sheets.',
 csvFoiRo:'Formatul ales nu poate ține mai multe foi. OK salvează doar foaia activă.',
 csvBara:'Some features might be lost if you save this workbook in the comma-delimited (.csv) format. To preserve these features, save it in an Excel file format.',
 inlocuire:f=>`${f} already exists.\nDo you want to replace it?`,inlocuireRo:'Fișierul există deja. Îl înlocuiești?'};
const FOLDERE=['Desktop','Documente','Descărcări'];
const FOLDER_EN={Desktop:'Desktop',Documente:'Documents','Descărcări':'Downloads'};
const INTERZISE=/[:\\/?*\[\]]/g;

const CSS=`
.rg{border:1px solid var(--line);border-radius:8px;background:#fff;color:#1f1f1f;font-family:"Segoe UI",system-ui,sans-serif;font-size:14px;overflow:hidden;max-width:640px;outline:none;position:relative}
.rg:focus-visible{box-shadow:0 0 0 3px var(--accent)}
.rg-titlu{display:flex;align-items:center;gap:6px;background:#f3f3f3;padding:4px 6px;border-bottom:1px solid #ddd;min-height:36px}
.rg-titlu .rg-nume{flex:1;text-align:center;font-size:13px;color:#444;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.rg button{font:inherit;color:inherit}
.rg-fis{background:#107C41;color:#fff!important;border:0;border-radius:4px;padding:6px 10px;min-height:32px;cursor:pointer;font-weight:600}
.rg-x{background:none;border:0;min-width:36px;min-height:32px;font-size:16px;cursor:pointer;border-radius:4px}
.rg-x:hover{background:#e81123;color:#fff}
.rg-taste{display:flex;flex-wrap:wrap;gap:4px;padding:5px 6px;background:#fafafa;border-bottom:1px solid #e5e5e5;align-items:center}
.rg-taste span{font-size:12px;color:#555;margin-right:2px}
.rg-taste button{border:1px solid #c8c8c8;background:#fff;border-radius:4px;padding:3px 7px;min-height:32px;font:12px/1.2 "Segoe UI",system-ui,sans-serif;cursor:pointer}
.rg-taste button:hover{background:#eaf4ee}
.rg-bara-csv{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:#fff4ce;border-bottom:1px solid #e8d78c;padding:5px 8px;font-size:12px}
.rg-bara-csv b{font-size:12px}
.rg-corp{background:#fff;min-height:128px}
.rg-gol{min-height:128px;background:#e9e9e9}
.rg-g{border-collapse:collapse;width:100%;table-layout:fixed;font-size:13px}
.rg-g th{background:#f3f3f3;color:#555;font-weight:400;border:1px solid #dadada;height:24px;font-size:12px}
.rg-g th:first-child{width:30px}
.rg-g td{border:1px solid #e1e1e1;height:26px;padding:0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:cell}
.rg-g td.num{text-align:right}
.rg-g td.sel{outline:2px solid #107C41;outline-offset:-2px}
.rg-g td input{width:100%;box-sizing:border-box;border:0;outline:0;font:inherit;padding:0;background:#fff;color:#1f1f1f}
.rg-jos{display:flex;align-items:stretch;background:#f3f3f3;border-top:1px solid #ddd;min-height:36px}
.rg-sag{border:0;background:none;color:#999!important;min-width:32px;cursor:pointer;font-size:15px}
.rg-sag:not([disabled]){color:#333!important}
.rg-file{display:flex;overflow-x:auto;scrollbar-width:none;flex:0 1 auto;min-width:0;position:relative}
.rg-file::-webkit-scrollbar{display:none}
.rg-fila{position:relative;border:0;border-right:1px solid #d6d6d6;background:transparent;padding:0 12px;min-height:36px;white-space:nowrap;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;color:#333;flex:0 0 auto}
.rg-fila.act{background:#fff;font-weight:700;color:#185c37}
.rg-fila.act::after{content:"";position:absolute;left:10px;right:10px;bottom:5px;height:3px;border-radius:2px;background:#107C41}
.rg-fila.col:not(.act){color:#1f1f1f}
.rg-fila input{font:inherit;font-weight:700;border:0;outline:1px solid #107C41;padding:1px 2px;min-width:40px;background:#fff;color:#1f1f1f}
.rg-plus{border:0;background:none;min-width:40px;font-size:20px;cursor:pointer;color:#444!important}
.rg-plus:hover,.rg-sag:not([disabled]):hover{background:#e6e6e6}
.rg-marcaj{position:absolute;top:-2px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #000;pointer-events:none;z-index:3}
.rg-fantoma{position:fixed;z-index:95;pointer-events:none;background:#fff;border:1px solid #888;border-radius:3px;padding:2px 8px;font:12px "Segoe UI",system-ui,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.25)}
.rg-stare{display:flex;justify-content:space-between;background:#f3f3f3;border-top:1px solid #e3e3e3;padding:2px 8px;font-size:11px;color:#555}
.rg-nota{margin:6px 0 0;font-size:.88rem;color:var(--ink2)}
.rg-nota:empty{display:none}
.rg-tel{margin:0 0 8px;padding:6px 10px;font-size:.86rem;border-radius:6px;background:var(--sel);color:var(--ink)}
.rg-teste{margin:0 0 10px;padding:10px 12px;border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper)}
.rg-teste .lbl{font-weight:700;font-size:.9rem;margin-bottom:4px}
.rg-teste ul{list-style:none;margin:0;padding:0}
.rg-teste li{padding:3px 0;color:var(--ink2)}
.rg-teste li.ok{color:var(--ok);font-weight:600}
.rg-teste li span[aria-hidden]{display:inline-block;width:1.3em}
.rg-meniu{position:fixed;z-index:96;min-width:220px;max-width:94vw;background:#fff;color:#1f1f1f;border:1px solid #c8c8c8;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.25);padding:4px 0;font:14px "Segoe UI",system-ui,sans-serif}
.rg-meniu button{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;border:0;background:none;color:inherit;font:inherit;padding:7px 14px;min-height:34px;cursor:pointer}
.rg-meniu button:hover,.rg-meniu button:focus-visible{background:#e6f2ea;outline:none}
.rg-meniu button[disabled]{color:#a0a0a0;cursor:default;background:none}
.rg-meniu hr{border:0;border-top:1px solid #e2e2e2;margin:4px 0}
.rg-meniu .mic{padding:4px 14px 6px;font-size:12px;color:#666;max-width:280px}
.rg-paleta{padding:6px 10px 8px;min-width:370px}
@media (max-width:480px){.rg-paleta{min-width:0}}
.rg-paleta .lbl{font-size:12px;font-weight:700;margin:4px 0}
.rg-paleta .rand{display:grid;grid-template-columns:repeat(10,1fr);gap:3px}
.rg-paleta .rand button{min-height:32px;min-width:0;padding:0;border:1px solid #bbb;border-radius:2px;display:block}
.rg-paleta .rand button:hover,.rg-paleta .rand button:focus-visible{outline:2px solid #107C41;outline-offset:1px}
.rg-paleta .nume{font-size:12px;color:#444;min-height:16px;margin-top:4px}
.rg-fundal{position:fixed;inset:0;z-index:97;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:12px}
.rg-dlg{background:#fff;color:#1f1f1f;border:1px solid #bbb;border-radius:8px;width:100%;max-width:440px;max-height:92vh;overflow:auto;box-shadow:0 12px 32px rgba(0,0,0,.3);font:14px "Segoe UI",system-ui,sans-serif}
.rg-dlg .cap{display:flex;justify-content:space-between;align-items:center;padding:10px 14px 4px}
.rg-dlg .cap b{font-size:15px}
.rg-dlg .cap.verde b{color:#107C41;font-size:19px}
.rg-dlg .cap button{border:0;background:none;min-width:32px;min-height:32px;font-size:16px;cursor:pointer}
.rg-dlg .corp{padding:4px 14px 8px}
.rg-dlg .ro{font-size:12px;color:#555;font-style:italic;margin:4px 0 0}
.rg-dlg p{margin:6px 0;white-space:pre-line}
.rg-dlg label{display:block;font-size:13px;margin:8px 0 3px}
.rg-dlg input[type=text],.rg-dlg select{width:100%;box-sizing:border-box;font:inherit;padding:6px 8px;border:1px solid #999;border-radius:4px;background:#fff;color:#1f1f1f;min-height:34px}
.rg-dlg .lista{border:1px solid #999;border-radius:4px;max-height:170px;overflow:auto;background:#f5f5f5}
.rg-dlg .lista button{display:block;width:100%;text-align:left;border:0;background:none;padding:6px 8px;min-height:32px;font:inherit;color:inherit;cursor:pointer}
.rg-dlg .lista button.ales{background:#cfe6d8;outline:1px solid #107C41}
.rg-dlg .lista .gol{padding:8px;color:#777;font-size:13px}
.rg-dlg .bife{display:flex;gap:8px;align-items:center;margin:10px 0 2px;font-size:14px}
.rg-dlg .bife input{width:20px;height:20px}
.rg-dlg .bt{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;align-items:center;padding:10px 14px 14px;border-top:1px solid #eee}
.rg-dlg .bt .st{margin-right:auto}
.rg-dlg .bt button{min-height:34px;min-width:78px;padding:4px 12px;border:1px solid #8a8a8a;background:#fff;border-radius:4px;font:inherit;cursor:pointer;color:#1f1f1f}
.rg-dlg .bt button.pr{background:#107C41;border-color:#107C41;color:#fff}
.rg-dlg .bt button.link{border:0;color:#107C41;font-weight:600;min-width:0;padding:4px 2px}
.rg-dlg .doua{display:grid;grid-template-columns:120px 1fr;gap:8px}
@media (max-width:480px){.rg-dlg .doua{grid-template-columns:1fr}}
.rg-dlg .fold button{display:block;width:100%;text-align:left;border:0;background:none;padding:6px 8px;min-height:32px;font:inherit;cursor:pointer;color:#1f1f1f;border-radius:3px}
.rg-dlg .fold button.ales{background:#dde8f3}
.rg-dlg .ext{font-size:13px;color:#555;white-space:nowrap}
.rg-dlg .rand-nume{display:flex;gap:6px;align-items:center}
.rg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (pointer:coarse){.rg-fila{min-height:40px}.rg-meniu button{min-height:40px}}
@media (max-width:480px){.rg-fila{padding:0 8px;font-size:13px}.rg-plus{min-width:34px}.rg-taste button{padding:3px 5px}.rg-paleta .rand{grid-template-columns:repeat(5,1fr);gap:6px}.rg-paleta .rand button{min-height:36px}}
.rg-taste button{min-width:36px}`;
function css(){if(!document.getElementById('rg-css')){const s=document.createElement('style');s.id='rg-css';s.textContent=CSS;document.head.appendChild(s)}}
const TEL=()=>matchMedia('(pointer:coarse)').matches||innerWidth<=760;

/* ---------------- modelul ---------------- */
const CTX=new WeakMap();
function foaieNoua(n){return {n,d:{},c:null,h:false}}
function areDate(f){return Object.values(f.d||{}).some(v=>String(v).trim()!=='')}
function stareStart(Q){
  const st=Q.start||{},S={reg:null,fold:{},nrNou:1,ist:{nou:false,inchideri:0,salvari:0},undo:[],orig:{},colegi:[],
    ultimulLoc:st.locPropus||'Desktop'};   // Excel propune locul folosit ULTIMA dată pe calculator (poate de un coleg): p8, judecător g10
  FOLDERE.forEach(f=>S.fold[f]=[]);
  Object.entries(st.fisiere||{}).forEach(([f,l])=>{S.fold[f]=S.fold[f]||[];l.forEach(x=>{
    const ext=(x.n.match(/\.([a-z]+)$/i)||[,'xlsx'])[1].toLowerCase();
    const cont=ext==='pdf'?{pdf:true,foaie:(x.foi&&x.foi[0]&&x.foi[0].n)||'Sheet1'}:{foi:(x.foi||[{n:'Sheet1',d:{A1:'…'}}]).map(o=>Object.assign(foaieNoua(o.n),copie(o))),a:0};
    S.fold[f].push({n:x.n,ext,cont,coleg:!!x.coleg});S.orig[f+'/'+x.n]=JSON.stringify(cont);if(x.coleg)S.colegi.push(f+'/'+x.n)})});
  if(st.registru){const r=st.registru;
    const foi=r.foi.map(o=>Object.assign(foaieNoua(o.n),copie(o)));
    let cale=null;
    if(r.fisier){const [f,n]=r.fisier.split('/');const ext=(n.match(/\.([a-z]+)$/i)||[,'xlsx'])[1].toLowerCase();cale={f,n,ext};
      if(!S.fold[f].some(x=>x.n===n)){const cont={foi:copie(foi),a:r.a||0};S.fold[f].push({n,ext,cont,coleg:false});S.orig[f+'/'+n]=JSON.stringify(cont)}}
    // registru deschis dintr-un fișier: numărătoarea foilor noi pornește de la 1 (p6 c); registru făcut acum: de la numărul foilor + 1
    S.reg={nume:cale?cale.n:(r.nume||'Book1'),cale,foi,a:r.a||0,m:!!r.m,cnt:urmatorul(foi,cale?1:foi.length+1),csvBara:false,sel:'A1',ed:null};
    const nr=/^Book(\d+)$/.exec(S.reg.nume);S.nrNou=nr?+nr[1]+1:1;
  }
  return S;
}
function urmatorul(foi,c){while(foi.some(f=>fara(f.n)===fara('Sheet'+c)))c++;return c}
function numeFoaieNoua(R){const c=urmatorul(R.foi,R.cnt);R.cnt=c+1;return 'Sheet'+c}
function vizibile(R){return R.foi.filter(f=>!f.h)}
function puneUndo(S){S.undo.push(copie({foi:S.reg.foi,a:S.reg.a,cnt:S.reg.cnt}));if(S.undo.length>30)S.undo.shift()}
function continutReg(R){return {foi:copie(R.foi),a:R.a}}
function gasesteFisier(S,f,n){return (S.fold[f]||[]).find(x=>fara(x.n)===fara(n))}
function titlu(S){return S.reg?`${S.reg.nume} - Excel`:'Excel'}

/* ---------------- operațiile (aceleași și pentru clic, și pentru poartă) ---------------- */
function nou(ctx){const S=ctx.S;
  if(S.reg){nota(ctx,'Aici poți avea un singur registru deschis odată (în Excel pot fi mai multe). Închide-l întâi pe cel deschis: Fișier › Închidere.');return false}
  S.reg={nume:'Book'+S.nrNou++,cale:null,foi:[foaieNoua('Sheet1')],a:0,m:false,cnt:2,csvBara:false,sel:'A1',ed:null};S.undo=[];S.ist.nou=true;
  nota(ctx,'Registru nou: are o singură foaie, Sheet1 (în Excel în română: Foaie1).');return true}
function plus(ctx){const R=ctx.S.reg;if(!R)return false;puneUndo(ctx.S);const n=numeFoaieNoua(R);R.foi.splice(R.a+1,0,foaieNoua(n));R.a=R.a+1;R.m=true;return true}
function inserareInainte(ctx){const R=ctx.S.reg;if(!R)return false;puneUndo(ctx.S);const n=numeFoaieNoua(R);R.foi.splice(R.a,0,foaieNoua(n));R.m=true;return true}
function idx(R,n){return typeof n==='number'?n:R.foi.findIndex(f=>fara(f.n)===fara(n))}
function activeaza(ctx,n){const R=ctx.S.reg;if(!R)return false;const i=idx(R,n);if(i<0||R.foi[i].h)return false;R.a=i;R.sel='A1';return true}
function pagina(ctx,dir){const R=ctx.S.reg;if(!R)return;let i=R.a+dir;while(i>=0&&i<R.foi.length&&R.foi[i].h)i+=dir;if(i>=0&&i<R.foi.length)R.a=i}
function verificaNume(R,i,nou){const t=nou;if(!t||!t.trim())return 'invalid';if(t.toLowerCase()==='history')return 'rezervat';if(/'$/.test(t))return 'invalid';if(t.length>31||INTERZISE.test(t)){INTERZISE.lastIndex=0;return 'invalid'}INTERZISE.lastIndex=0;
  if(R.foi.some((f,k)=>k!==i&&f.n.toLowerCase()===t.toLowerCase()))return 'dublat';return ''}
function redenumeste(ctx,n,nou){const R=ctx.S.reg;if(!R)return 'fara';const i=idx(R,n);if(i<0)return 'fara';nou=String(nou).replace(/^'+/,'');
  const e=verificaNume(R,i,nou);if(e)return e;if(R.foi[i].n===nou)return '';puneUndo(ctx.S);R.foi[i].n=nou;R.m=true;return ''}
function culoare(ctx,n,hex){const R=ctx.S.reg;if(!R)return false;const i=idx(R,n);if(i<0)return false;puneUndo(ctx.S);R.foi[i].c=hex||null;R.m=true;return true}
/* întoarce: 'singura' | 'confirma' | 'sters' */
function poateSterge(ctx,n){const R=ctx.S.reg;const i=idx(R,n);if(i<0)return 'fara';if(vizibile(R).length<=1&&!R.foi[i].h)return 'singura';return areDate(R.foi[i])?'confirma':'direct'}
function sterge(ctx,n){const R=ctx.S.reg;const i=idx(R,n);if(i<0)return false;
  R.foi.splice(i,1);let a=i;while(a<R.foi.length&&R.foi[a].h)a++;if(a>=R.foi.length){a=i-1;while(a>0&&R.foi[a].h)a--}R.a=Math.max(0,a);
  R.m=true;ctx.S.undo=[];return true}
function ascunde(ctx,n){const R=ctx.S.reg;const i=idx(R,n);if(vizibile(R).length<=1)return 'singura';puneUndo(ctx.S);R.foi[i].h=true;if(R.a===i){pagina(ctx,1);if(R.a===i)pagina(ctx,-1)}R.m=true;return ''}
function numeCopie(R,n){const b=n.replace(/ \(\d+\)$/,'');let k=2,x;do{x=`${b} (${k++})`;}while(R.foi.some(f=>fara(f.n)===fara(x)));return x.length>31?x.slice(0,31):x}
/* mută/copiază foaia n înaintea foii `inainte` (null = la sfârșit) */
function muta(ctx,n,inainte,cp){const R=ctx.S.reg;if(!R)return false;const i=idx(R,n);if(i<0)return false;
  let j=inainte==null?R.foi.length:idx(R,inainte);if(j<0)return false;
  if(!cp&&(j===i||j===i+1))return true;          // la același loc: nimic de făcut
  puneUndo(ctx.S);
  if(cp){const f=copie(R.foi[i]);f.n=numeCopie(R,R.foi[i].n);f.h=false;R.foi.splice(j,0,f);R.a=j}
  else{const [f]=R.foi.splice(i,1);if(j>i)j--;R.foi.splice(j,0,f);R.a=j}
  R.m=true;return true}
function scrie(ctx,n,adr,val){const R=ctx.S.reg;if(!R)return false;const i=idx(R,n);if(i<0)return false;puneUndo(ctx.S);
  if(String(val)==='')delete R.foi[i].d[adr];else R.foi[i].d[adr]=String(val);R.m=true;return true}
function anuleaza(ctx){const S=ctx.S;if(!S.reg||!S.undo.length)return false;const u=S.undo.pop();S.reg.foi=u.foi;S.reg.a=u.a;S.reg.cnt=u.cnt;S.reg.m=true;return true}
/* scrie fișierul în folder, după tip; întoarce fișierul sau null */
function scrieFisier(ctx,f,n,ext){const S=ctx.S,R=S.reg;let cont;
  if(ext==='csv'){const fa=R.foi[R.a],d={};Object.entries(fa.d).forEach(([k,v])=>{d[k]=String(v).startsWith('=')?(fa.rez&&fa.rez[k]!=null?String(fa.rez[k]):String(v)):v});
    cont={csv:true,foi:[{n:n.replace(/\.[a-z]+$/i,'').slice(0,31),d,c:null,h:false}],a:0}}
  else if(ext==='pdf')cont={pdf:true,foaie:R.foi[R.a].n,d:copie(R.foi[R.a].d)};
  else cont=continutReg(R);
  const L=S.fold[f]=S.fold[f]||[];const k=L.findIndex(x=>fara(x.n)===fara(n));const x={n,ext,cont,coleg:k>=0?L[k].coleg:false};
  if(k>=0)L[k]=x;else L.push(x);S.ist.salvari++;return x}
function salveazaLa(ctx,f,n,ext){const S=ctx.S,R=S.reg;const x=scrieFisier(ctx,f,n,ext);
  if(ext==='pdf'){S.ultimulLoc=f;nota(ctx,`Am făcut ${n} în ${f}. Registrul deschis a rămas ${R.nume}.`);return x}
  if(ext==='csv'){R.foi[R.a].n=n.replace(/\.[a-z]+$/i,'').slice(0,31);R.csvBara=true}else R.csvBara=false;
  R.cale={f,n,ext};R.nume=n;R.m=false;S.ultimulLoc=f;return x}
/* Salvare (Ctrl+S): fără fereastră dacă fișierul există deja */
function salveazaPeLoc(ctx){const R=ctx.S.reg;if(!R||!R.cale)return false;salveazaLa(ctx,R.cale.f,R.cale.n,R.cale.ext);nota(ctx,'Salvat în același fișier, fără nicio fereastră.');return true}
function inchide(ctx){const S=ctx.S;if(!S.reg)return false;S.ist.inchideri=(S.ist.inchideri||0)+1;S.reg=null;S.undo=[];return true}
function deschide(ctx,f,n){const S=ctx.S;if(S.reg){nota(ctx,'Aici poți avea un singur registru deschis odată. Închide-l întâi pe cel deschis.');return false}
  const x=gasesteFisier(S,f,n);if(!x)return false;
  let foi;
  if(x.cont.pdf)foi=[{n:x.n.replace(/\.[a-z]+$/i,'').slice(0,31),d:{A1:'%PDF-1.7',A2:'%âãÏÓ',A3:'1 0 obj'},c:null,h:false}];
  else foi=copie(x.cont.foi);
  S.reg={nume:x.n,cale:{f,n:x.n,ext:x.ext},foi,a:x.cont.pdf?0:(x.cont.a||0),m:false,cnt:urmatorul(foi,1),csvBara:false,sel:'A1',ed:null};
  S.undo=[];S.reg.redeschis=true;   // deschis dintr-un fișier; rămâne „redeschis” până la prima schimbare (R.m)
  if(x.cont.pdf)nota(ctx,'Excel nu citește un PDF ca pe un tabel: vezi doar semne fără sens. PDF-ul se deschide cu un cititor de PDF.');
  return true}

/* ---------------- testele ---------------- */
/* Nume_Prenume_<clasa>_<model>, cu o cifră opțională la sfârșit (lecția o cere când numele e luat: „…_lectia3_2”, „…_lectia3_3”,
   „…_lectia32”): judecata 3, M1. Clasa = orice bucată cu cel puțin o literă sau cifră (01.10.2026, profesorul: lecția merge și la alte clase, iar
   „XIID”, „12 D”, „AMF1-IF” sau „AMF1_IF” picau testul, care primea doar 8/VIII). Fără clasă tot pică. Proba: _proba/proba_model.js. */
function potrivesteModel(n,model,ext){const m=new RegExp('^[^_\\s.]+_[^_\\s.]+_[^a-z0-9]*[a-z0-9].*?_'+model.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(_?\\d{1,2})?\\.'+ext+'$','i');return m.test(fara(n))}
function cautaSalvat(S,c){const L=S.fold[c.folder||'Documente']||[];
  return L.filter(x=>x.ext===(c.ext||'xlsx')&&!x.coleg&&(c.fisier?fara(x.n)===fara(c.fisier):c.model?potrivesteModel(x.n,c.model,c.ext||'xlsx'):true))}
function potrivesteFoi(cont,c){if(!cont||!cont.foi)return false;
  if(c.foi&&cont.foi.map(f=>fara(f.n)).join('|')!==c.foi.map(fara).join('|'))return false;
  if(c.culoare&&!Object.entries(c.culoare).every(([n,v])=>{const f=cont.foi.find(x=>fara(x.n)===fara(n));return f&&potrivesteCuloare(f.c,v)}))return false;
  if(c.date&&!Object.entries(c.date).every(([n,cel])=>{const f=cont.foi.find(x=>fara(x.n)===fara(n));return f&&Object.entries(cel).every(([a,v])=>fara(f.d[a])===fara(v))}))return false;
  return true}
function potrivesteCuloare(c,v){if(v==='orice')return !!c;if(v==='nu')return !c;if(v==='verde')return VERZI.includes(c);return String(c||'').toUpperCase()===String(v).toUpperCase()}
function testeaza(ctx,t){const S=ctx.S,R=S.reg;
  if(t.inchis&&R)return false;
  if(t.nouFacut&&!S.ist.nou)return false;
  if(t.foi&&(!R||R.foi.map(f=>fara(f.n)).join('|')!==t.foi.map(fara).join('|')))return false;
  if(t.numarFoi&&(!R||R.foi.length!==t.numarFoi))return false;
  if(t.areFoi&&(!R||!t.areFoi.every(n=>R.foi.some(f=>fara(f.n)===fara(n)))))return false;
  if(t.nuAreFoi&&(!R||t.nuAreFoi.some(n=>R.foi.some(f=>fara(f.n)===fara(n)))))return false;
  if(t.activa&&(!R||fara(R.foi[R.a].n)!==fara(t.activa)))return false;
  if(t.culoare&&(!R||!Object.entries(t.culoare).every(([n,v])=>{const f=R.foi.find(x=>fara(x.n)===fara(n));return f&&potrivesteCuloare(f.c,v)})))return false;
  if(t.date&&(!R||!potrivesteFoi(continutReg(R),{date:t.date})))return false;
  if(t.salvat){const L=cautaSalvat(S,t.salvat);if(!L.length)return false;if(!L.some(x=>t.salvat.ext==='pdf'||t.salvat.ext==='csv'?true:potrivesteFoi(x.cont,t.salvat)))return false;
    if(t.salvat.pdfFoaie&&!L.some(x=>x.cont.pdf&&fara(x.cont.foaie)===fara(t.salvat.pdfFoaie)))return false}
  if(t.deschisDin){const c=t.deschisDin;if(!R||!R.cale)return false;if(R.cale.f!==(c.folder||'Documente')||R.cale.ext!==(c.ext||'xlsx'))return false;
    if(c.fisier&&fara(R.cale.n)!==fara(c.fisier))return false;if(c.model&&!potrivesteModel(R.cale.n,c.model,c.ext||'xlsx'))return false}
  if(t.nemodificat&&(!R||R.m||!R.cale))return false;
  if(t.redeschis&&(!R||!R.redeschis||R.m||!(S.ist.inchideri>0)))return false;
  if(t.colegi&&!S.colegi.every(k=>{const [f,n]=k.split('/');const x=gasesteFisier(S,f,n);return x&&JSON.stringify(x.cont)===S.orig[k]}))return false;
  if(t.neschimbat&&!t.neschimbat.every(k=>{const [f,n]=k.split('/');const x=gasesteFisier(S,f,n);return x&&JSON.stringify(x.cont)===S.orig[k]}))return false;
  return true}
function teste(ctx){return ctx.Q.teste||ctx.Q.verifica||[]}
function deseneazaTeste(ctx){const T=teste(ctx);if(!T.length||!ctx.el.teste)return;
  ctx.el.teste.innerHTML=`<div class="lbl">Testele (se bifează singure)</div><ul>${T.map(t=>{const ok=testeaza(ctx,t);
    return `<li class="${ok?'ok':''}"><span aria-hidden="true">${ok?'✔':'○'}</span>${esc(t.ce)}<span class="rg-sr">${ok?' — îndeplinit':' — încă nu'}</span></li>`}).join('')}</ul>`}

/* ---------------- desenul ---------------- */
const COLS=['A','B','C','D'],ROWS=5;
function nota(ctx,t){if(ctx.el&&ctx.el.nota)ctx.el.nota.textContent=t||''}
function eNumar(v){return /^-?\d+([.,]\d+)?$/.test(String(v).trim())}
function valoare(f,a){const v=f.d[a];if(v==null)return '';const s=String(v);if(s.startsWith('=')){const r=calc(f,s);if(r!=null){(f.rez=f.rez||{})[a]=r;return String(r).replace('.',',')}}return s}
function calc(f,s){const m=/^=\s*([A-D][1-5])\s*([+\-*/])\s*(\d+(?:[.,]\d+)?|[A-D][1-5])\s*$/i.exec(s);if(!m)return null;
  const g=x=>/^[A-D][1-5]$/i.test(x)?parseFloat(String(f.d[x.toUpperCase()]||'0').replace(',','.')):parseFloat(x.replace(',','.'));
  const a=g(m[1]),b=g(m[3]);if(!isFinite(a)||!isFinite(b))return null;return {'+':a+b,'-':a-b,'*':a*b,'/':b?a/b:null}[m[2]]}
function draw(ctx){const {S,el}=ctx,R=S.reg;
  el.titlu.textContent=titlu(S);
  el.csv.hidden=!(R&&R.csvBara);
  if(!R){el.corp.innerHTML='<div class="rg-gol" aria-label="Excel deschis, fără niciun registru"></div>';el.jos.hidden=true;el.stare.textContent='Gata (Ready)';deseneazaTeste(ctx);return}
  el.jos.hidden=false;
  const f=R.foi[R.a];
  let h='<table class="rg-g" aria-label="Foaia '+esc(f.n)+'"><thead><tr><th></th>'+COLS.map(c=>`<th>${c}</th>`).join('')+'</tr></thead><tbody>';
  for(let r=1;r<=ROWS;r++){h+=`<tr><th>${r}</th>`;COLS.forEach(c=>{const a=c+r,v=valoare(f,a);
    h+=`<td data-a="${a}" class="${eNumar(v)?'num ':''}${R.sel===a?'sel':''}">${R.ed===a?`<input value="${esc(f.d[a]||'')}" aria-label="Scrii în ${a}">`:esc(v)}</td>`});h+='</tr>'}
  el.corp.innerHTML=h+'</tbody></table>';
  const inp=el.corp.querySelector('td input');if(inp){inp.focus({preventScroll:true});inp.select()}
  el.file.innerHTML=R.foi.map((x,i)=>x.h?'':`<button type="button" role="tab" class="rg-fila${i===R.a?' act':''}${x.c?' col':''}" data-i="${i}" aria-selected="${i===R.a}" style="${x.c?(i===R.a?`background:linear-gradient(#fff 55%,${x.c}33)`:`background:${x.c};color:${luminos(x.c)?'#1f1f1f':'#fff'}`):''}">${esc(x.n)}</button>`).join('');
  if(R.ren!=null){const b=el.file.querySelector(`.rg-fila[data-i="${R.ren}"]`);if(b){b.innerHTML=`<input value="${esc(R.renVal!=null?R.renVal:R.foi[R.ren].n)}" maxlength="31" aria-label="Numele nou al foii" spellcheck="false">`;
    const i2=b.querySelector('input');i2.size=Math.max(4,i2.value.length+1);setTimeout(()=>{i2.focus({preventScroll:true});i2.select()},0)}}
  const act=el.file.querySelector('.rg-fila.act');if(act&&act.scrollIntoView)try{const fl=el.file;const L=act.offsetLeft,W=act.offsetWidth;if(L<fl.scrollLeft||L+W>fl.scrollLeft+fl.clientWidth)fl.scrollLeft=Math.max(0,L-20)}catch(e){}
  sageti(ctx);
  el.stare.textContent=R.ed?'Scriere (Enter)':'Gata (Ready)';
  deseneazaTeste(ctx)}
function luminos(h){const n=parseInt(h.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;return (r*299+g*587+b*114)/1000>150}
function sageti(ctx){const fl=ctx.el.file,[st,dr]=ctx.el.sageti;const prea=fl.scrollWidth>fl.clientWidth+2;st.disabled=!prea||fl.scrollLeft<=0;dr.disabled=!prea||fl.scrollLeft+fl.clientWidth>=fl.scrollWidth-2}
function schimbat(ctx){draw(ctx);if(ctx.Q.o)return;/* testele se bifează pe loc */}

/* ---------------- meniuri și ferestre ---------------- */
let MENIU=null;
function inchideMeniu(){if(MENIU){MENIU.remove();MENIU=null;document.removeEventListener('pointerdown',afara,true)}}
function afara(e){if(MENIU&&!MENIU.contains(e.target))inchideMeniu()}
function meniu(x,y,html,la){inchideMeniu();const m=document.createElement('div');m.className='rg-meniu';m.setAttribute('role','menu');m.innerHTML=html;document.body.appendChild(m);MENIU=m;
  const W=m.offsetWidth,H=m.offsetHeight;m.style.left=Math.max(4,Math.min(x,innerWidth-W-4))+'px';m.style.top=Math.max(4,Math.min(y,innerHeight-H-4))+'px';
  setTimeout(()=>document.addEventListener('pointerdown',afara,true),0);
  m.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();inchideMeniu();la&&la.focus({preventScroll:true})}
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const b=[...m.querySelectorAll('button:not([disabled])')];const k=b.indexOf(document.activeElement);b[(k+(e.key==='ArrowDown'?1:-1)+b.length)%b.length].focus()}});
  const p=m.querySelector('button:not([disabled])');if(p)p.focus({preventScroll:true});return m}
function dialog(ctx,html,la){const f=document.createElement('div');f.className='rg-fundal';f.innerHTML=`<div class="rg-dlg" role="dialog" aria-modal="true">${html}</div>`;document.body.appendChild(f);
  const d=f.firstChild;const inchid=()=>{f.remove();if(la!==false)ctx.el.rg.focus({preventScroll:true})};
  d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();const c=d.querySelector('[data-b="cancel"]');c?c.click():inchid()}
    if(e.key==='Enter'&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='SELECT'){e.preventDefault();const p=d.querySelector('.pr');p&&p.click()}});
  const x=d.querySelector('.cap button');if(x)x.onclick=()=>{const c=d.querySelector('[data-b="cancel"]');c?c.click():inchid()};
  setTimeout(()=>{const p=d.querySelector('input[type=text]')||d.querySelector('.pr');if(p){p.focus({preventScroll:true});if(p.select)p.select()}},0);
  return {d,inchid}}
function mesaj(ctx,en,ro,butoane,cb){const {d,inchid}=dialog(ctx,`<div class="cap verde"><b>Microsoft Excel</b><button type="button" aria-label="Închide">✕</button></div>
  <div class="corp"><p>⚠ ${esc(en)}</p><p class="ro">Pe românește: ${esc(ro)}</p></div>
  <div class="bt">${butoane.map((b,i)=>`<button type="button" data-b="${b[1]}" class="${i===0?'pr':''}">${esc(b[0])}</button>`).join('')}</div>`);
  d.querySelectorAll('.bt button').forEach(b=>b.onclick=()=>{inchid();cb&&cb(b.dataset.b)});return d}

function meniuFila(ctx,i,x,y,la){const R=ctx.S.reg;if(!R)return;activeaza(ctx,i);draw(ctx);
  const ascunse=R.foi.some(f=>f.h);
  const m=meniu(x,y,`<button type="button" data-c="ins">Inserare... (Insert...)</button><button type="button" data-c="del">Ștergere (Delete)</button><button type="button" data-c="ren">Redenumire (Rename)</button>
  <button type="button" data-c="mut">Mutare sau copiere... (Move or Copy...)</button><button type="button" data-c="cod">Vizualizare cod (View Code)</button><button type="button" data-c="prot">Protejare foaie... (Protect Sheet...)</button>
  <button type="button" data-c="cul">Culoare filă (Tab Color) <span aria-hidden="true">›</span></button><hr><button type="button" data-c="hide">Ascundere (Hide)</button>
  <button type="button" data-c="unhide" ${ascunse?'':'disabled'}>Reafișare... (Unhide...)</button><hr><button type="button" data-c="all">Selectare toate foile (Select All Sheets)</button>`,la);
  m.querySelectorAll('button').forEach(b=>b.onclick=()=>{const c=b.dataset.c;const r=m.getBoundingClientRect();inchideMeniu();
    if(c==='ins')dlgInsert(ctx);
    else if(c==='del')cereStergere(ctx,R.a);
    else if(c==='ren')incepeRedenumire(ctx,R.a);
    else if(c==='mut')dlgMutare(ctx);
    else if(c==='cul')paleta(ctx,R.a,r.left+30,r.top+180,la);
    else if(c==='hide'){if(ascunde(ctx,R.a)==='singura')mesaj(ctx,TXT.singura,TXT.singuraRo,[['OK','ok']]);draw(ctx)}
    else if(c==='unhide')dlgReafisare(ctx);
    else{nota(ctx,`„${b.textContent.trim()}” nu îl folosim în lecția asta.`);ctx.el.rg.focus({preventScroll:true})}})}
function paleta(ctx,i,x,y,la){const R=ctx.S.reg;
  const rand=L=>`<div class="rand">${L.map(c=>`<button type="button" data-h="${c[1]}" title="${esc(c[0])}" aria-label="${esc(c[0])}${c[2]?' ('+esc(c[2])+')':''}" style="background:${c[1]}"></button>`).join('')}</div>`;
  const m=meniu(x,y,`<div class="rg-paleta"><div class="lbl">Theme Colors (Culorile temei)</div>${rand(TEMA)}<div class="mic" style="padding:2px 0 0">În Excel, sub rândul acesta mai sunt nuanțe mai deschise și mai închise.</div>
   <div class="lbl">Standard Colors (Culori standard)</div>${rand(STD)}<div class="nume" aria-live="polite"></div></div><hr>
   <button type="button" data-h="">No Color (Fără culoare)</button><button type="button" data-more="1">More Colors... (Mai multe culori...)</button>`,la);
  const nm=m.querySelector('.nume');
  m.querySelectorAll('[data-h]').forEach(b=>{const arata=()=>{nm.textContent=b.dataset.h?numeCuloare(b.dataset.h):''};b.addEventListener('pointerenter',arata);b.addEventListener('focus',arata);
    b.onclick=()=>{inchideMeniu();culoare(ctx,i,b.dataset.h||null);nota(ctx,b.dataset.h?`Fila ${R.foi[i].n} are acum culoarea ${numeCuloare(b.dataset.h)}.`:`Fila ${R.foi[i].n} nu mai are culoare.`);draw(ctx);ctx.el.rg.focus({preventScroll:true})}});
  m.querySelector('[data-more]').onclick=()=>{inchideMeniu();nota(ctx,'„More Colors...” nu îl folosim aici.')}}
function cereStergere(ctx,i){const R=ctx.S.reg,k=poateSterge(ctx,i);
  if(k==='singura'){mesaj(ctx,TXT.singura,TXT.singuraRo,[['OK','ok']]);return}
  if(k==='direct'){const n=R.foi[i].n;sterge(ctx,i);nota(ctx,`Foaia ${n} era goală: Excel a șters-o fără să întrebe.`);draw(ctx);return}
  mesaj(ctx,TXT.stergere,TXT.stergereRo,[['Delete (Ștergere)','del'],['Cancel (Anulare)','cancel']],b=>{if(b==='del'){const n=R.foi[i].n;sterge(ctx,i);nota(ctx,`Foaia ${n} a fost ștearsă.`)}draw(ctx)})}
function dlgInsert(ctx){const L=['Worksheet','Chart','MS Excel 4.0 Macro','International Macro Sheet','MS Excel 5.0 Dialog'];let ales=0;
  const {d,inchid}=dialog(ctx,`<div class="cap"><b>Insert (Inserare)</b><button type="button" aria-label="Închide">✕</button></div><div class="corp"><p style="font-size:13px">General</p>
   <div class="lista">${L.map((x,k)=>`<button type="button" data-k="${k}" class="${k?'':'ales'}">${esc(x)}${k?'':' (foaie de calcul)'}</button>`).join('')}</div></div>
   <div class="bt"><button type="button" class="pr" data-b="ok">OK</button><button type="button" data-b="cancel">Cancel (Anulare)</button></div>`);
  d.querySelectorAll('.lista button').forEach(b=>b.onclick=()=>{ales=+b.dataset.k;d.querySelectorAll('.lista button').forEach(x=>x.classList.toggle('ales',x===b))});
  d.querySelector('[data-b="ok"]').onclick=()=>{inchid();if(ales===0){inserareInainte(ctx);nota(ctx,'Foaia nouă a apărut înaintea foii active.')}else nota(ctx,`„${L[ales]}” nu îl folosim în lecția asta.`);draw(ctx)};
  d.querySelector('[data-b="cancel"]').onclick=()=>inchid()}
function dlgReafisare(ctx){const R=ctx.S.reg,L=R.foi.map((f,i)=>[f,i]).filter(x=>x[0].h);let ales=L.length?L[0][1]:-1;
  const {d,inchid}=dialog(ctx,`<div class="cap"><b>Unhide (Reafișare)</b><button type="button" aria-label="Închide">✕</button></div><div class="corp"><label>Unhide one or more sheets:</label>
   <div class="lista">${L.map(([f,i],k)=>`<button type="button" data-i="${i}" class="${k?'':'ales'}">${esc(f.n)}</button>`).join('')}</div></div>
   <div class="bt"><button type="button" class="pr" data-b="ok">OK</button><button type="button" data-b="cancel">Cancel (Anulare)</button></div>`);
  d.querySelectorAll('.lista button').forEach(b=>b.onclick=()=>{ales=+b.dataset.i;d.querySelectorAll('.lista button').forEach(x=>x.classList.toggle('ales',x===b))});
  d.querySelector('[data-b="ok"]').onclick=()=>{inchid();if(ales>=0){puneUndo(ctx.S);R.foi[ales].h=false;R.a=ales;R.m=true}draw(ctx)};
  d.querySelector('[data-b="cancel"]').onclick=()=>inchid()}
function dlgMutare(ctx){const R=ctx.S.reg;const i=R.a;let ales=i;
  const {d,inchid}=dialog(ctx,`<div class="cap"><b>Move or Copy (Mutare sau copiere)</b><button type="button" aria-label="Închide">✕</button></div>
   <div class="corp"><p style="margin:2px 0">Move selected sheets <span class="ro">(mută foaia aleasă)</span></p>
   <label>To book: <span class="ro">(în registrul)</span></label><select data-c="book"><option>${esc(R.nume)}</option><option value="nou">(new book)</option></select>
   <label>Before sheet: <span class="ro">(înaintea foii)</span></label>
   <div class="lista" role="listbox">${R.foi.map((f,k)=>`<button type="button" data-k="${k}" class="${k===i?'ales':''}">${esc(f.n)}</button>`).join('')}<button type="button" data-k="end">(move to end) <span class="ro">(la sfârșit)</span></button></div>
   <label class="bife"><input type="checkbox" data-c="copie"> Create a copy <span class="ro">(fă o copie)</span></label></div>
   <div class="bt"><button type="button" class="pr" data-b="ok">OK</button><button type="button" data-b="cancel">Cancel (Anulare)</button></div>`);
  d.querySelectorAll('.lista button').forEach(b=>b.onclick=()=>{ales=b.dataset.k==='end'?'end':+b.dataset.k;d.querySelectorAll('.lista button').forEach(x=>x.classList.toggle('ales',x===b))});
  d.querySelector('[data-b="ok"]').onclick=()=>{const cp=d.querySelector('[data-c="copie"]').checked,bk=d.querySelector('[data-c="book"]').value;inchid();
    if(bk==='nou'){nota(ctx,'În Excel, foaia pleacă atunci într-un registru nou. Aici nu folosim asta.');return}
    const inainte=ales==='end'?null:R.foi[ales].n;muta(ctx,i,inainte,cp);if(cp)nota(ctx,`Copia se numește ${R.foi[R.a].n}.`);draw(ctx)};
  d.querySelector('[data-b="cancel"]').onclick=()=>inchid()}

/* ---- redenumirea pe filă ---- */
function incepeRedenumire(ctx,i){const R=ctx.S.reg;if(!R)return;activeaza(ctx,i);R.ren=R.a;R.renVal=null;draw(ctx)}
function curataNume(v){return v.replace(INTERZISE,'').slice(0,31)}
function termina(ctx,accept){const R=ctx.S.reg;if(!R||R.ren==null)return;const inp=ctx.el.file.querySelector('.rg-fila input');const v=inp?inp.value:R.foi[R.ren].n;const i=R.ren;
  if(!accept){R.ren=null;R.renVal=null;draw(ctx);ctx.el.rg.focus({preventScroll:true});return}
  const e=redenumeste(ctx,i,v);
  if(e==='invalid'||e==='dublat'||e==='rezervat'){R.renVal=v;R.ren=null;draw(ctx);
    mesaj(ctx,TXT[e],TXT[e+'Ro'],[['OK','ok']],()=>{R.ren=i;draw(ctx)});return}
  R.ren=null;R.renVal=null;draw(ctx);ctx.el.rg.focus({preventScroll:true})}

/* ---- salvarea, închiderea, deschiderea ---- */
function numeFisier(v,ext){let n=String(v||'').trim().replace(/[\\/:*?"<>|]/g,'');if(!n)return '';if(!new RegExp('\\.'+ext+'$','i').test(n))n+='.'+ext;return n}
/* Semnele pe care Windows nu le primește în numele unui fișier. Până la 01.10.2026 ferestrele de salvare le ștergeau pe tăcute
   („AMF1/IF” devenea „AMF1IF”). Acum fereastra rămâne deschisă și spune ce să schimbi. Textul e al lecției, NU mesajul exact
   al Excel-ului (neprobat, spus în viii/m1-l03/surse.md). Mesajul dispare când elevul scoate semnele. */
function semneInterzise(d,laSalvare){const c=d.querySelector('[data-c="nume"]'),s=[...new Set(c.value.match(/[\\/:*?"<>|]/g)||[])];
  let p=d.querySelector('.rg-interzis');
  if(!s.length){if(p)p.remove();return false}
  if(!p&&!laSalvare)return true;
  if(!p){p=document.createElement('p');p.className='rg-interzis';p.setAttribute('role','alert');p.style.cssText='color:#B3261E;margin:6px 0 0;font-size:14px;line-height:1.35';(c.closest('.rand-nume')||c).after(p)}
  p.textContent=`Windows nu primește în numele unui fișier semnele \\ / : * ? " < > |. Tu ai scris: ${s.map(x=>`„${x}”`).join(' ')}. Pune o liniuță (-) în loc${s.includes('/')?', de exemplu AMF1-IF, nu AMF1/IF':''}.`;
  return true}
function dlgSalveazaAcesta(ctx,laInchidere,dupa,locAles,numeScris){const R=ctx.S.reg;
  // numele propus = numele registrului (Book1); locul propus = cel folosit ULTIMA dată pe calculator (p8: poate fi al colegului)
  const baza=numeScris!=null?numeScris:R.nume.replace(/\.[a-z]+$/i,''),f0=locAles||(R.cale?R.cale.f:ctx.S.ultimulLoc);
  const {d,inchid}=dialog(ctx,`<div class="cap verde"><b>${laInchidere?'Save your changes to this file?':'Save this file'}</b><button type="button" aria-label="Închide">✕</button></div>
   <div class="corp"><p class="ro" style="margin-top:0">${laInchidere?'Salvezi modificările din acest fișier?':'Salvează acest fișier: îi dai un nume și alegi locul.'}</p>
   <label>File name <span class="ro">(numele fișierului)</span></label><div class="rand-nume"><input type="text" data-c="nume" value="${esc(baza)}" spellcheck="false"><span class="ext">.xlsx</span></div>
   <label>Choose a Location <span class="ro">(alege locul; Excel propune locul folosit ultima dată)</span></label><select data-c="loc">${FOLDERE.map(f=>`<option value="${f}" ${f===f0?'selected':''}>${f===FOLDER_EN[f]?f:`${f} (${FOLDER_EN[f]})`}</option>`).join('')}<option value="__more">More locations… (Mai multe locuri)</option></select></div>
   <div class="bt"><button type="button" class="link st" data-b="more">More options… (Mai multe opțiuni)</button><button type="button" class="pr" data-b="save">Save (Salvare)</button>${laInchidere?'<button type="button" data-b="nu">Don\'t Save (Nu salvați)</button>':''}<button type="button" data-b="cancel">Cancel (Anulare)</button></div>`);
  const spreSalvareCa=cum=>{inchid();nota(ctx,`„${cum}” te duce în Excel la pagina Fișier › Salvare ca (File › Save As); acolo apeși Browse (Răsfoire) și se deschide fereastra Save As, în care alegi orice folder în stânga. Aici se deschide direct fereastra.`);dlgSalvareCa(ctx,dupa)};
  d.querySelector('[data-c="loc"]').onchange=e=>{if(e.target.value==='__more')spreSalvareCa('More locations')};
  d.querySelector('[data-c="nume"]').addEventListener('input',()=>semneInterzise(d,false));
  d.querySelector('[data-b="save"]').onclick=()=>{if(semneInterzise(d,true)){d.querySelector('[data-c="nume"]').focus();return}
    const n=numeFisier(d.querySelector('[data-c="nume"]').value,R.cale?R.cale.ext:'xlsx'),f=d.querySelector('[data-c="loc"]').value;
    if(!n){d.querySelector('[data-c="nume"]').focus();return}
    const ext=R.cale?R.cale.ext:'xlsx';
    const eAcelasi=R.cale&&R.cale.f===f&&fara(R.cale.n)===fara(n);
    const fa=()=>{inchid();salveazaLa(ctx,f,n,ext);nota(ctx,`Salvat: ${n}, în ${f}.`);draw(ctx);dupa&&dupa('salvat')};
    if(!eAcelasi&&gasesteFisier(ctx.S,f,n))existaDeja(ctx,n,ok=>{
      if(ok){fa();return}
      // Anulare (probat, p8 și judecata 2, k1-k3): fereastra de salvare se închide și Excel o deschide din nou, cu același loc;
      // la Ctrl+S numele devine iar cel de probă (Book…), la Ctrl+W („Save your changes…”) rămâne numele scris, selectat
      const scris=d.querySelector('[data-c="nume"]').value;
      inchid();dlgSalveazaAcesta(ctx,laInchidere,dupa,f,laInchidere?scris:null)});
    else fa()};
  const nu=d.querySelector('[data-b="nu"]');if(nu)nu.onclick=()=>{inchid();dupa&&dupa('nu')};
  d.querySelector('[data-b="cancel"]').onclick=()=>{inchid();dupa&&dupa('cancel')};
  d.querySelector('[data-b="more"]').onclick=()=>spreSalvareCa('More options…')}
/* PRIMA salvare, nume luat (probat în Excel real: p8_reparatii.json, judecătorul g3/g9/g10): fereastra „Save As”, cu OK și
   Anulare (butoanele le pune Windows-ul în română); Anulare e butonul implicit (Enter); OK înlocuiește fișierul. */
function existaDeja(ctx,n,cb){const {d,inchid}=dialog(ctx,`<div class="cap"><b>Save As</b><button type="button" aria-label="Închide">✕</button></div><div class="corp"><p>⚠ ${esc(TXT.existaDeja(n))}</p><p class="ro">Pe românește: ${TXT.existaDejaRo}</p></div>
   <div class="bt"><button type="button" data-b="ok">OK</button><button type="button" class="pr" data-b="cancel">Anulare</button></div>`,false);
  d.querySelector('[data-b="ok"]').onclick=()=>{inchid();cb(true)};d.querySelector('[data-b="cancel"]').onclick=()=>{inchid();cb(false)};
  setTimeout(()=>{const a=d.querySelector('[data-b="cancel"]');a&&a.focus({preventScroll:true})},0)}
function confirmaInlocuire(ctx,n,cb){const {d,inchid}=dialog(ctx,`<div class="cap"><b>Confirm Save As</b></div><div class="corp"><p>⚠ ${esc(TXT.inlocuire(n))}</p><p class="ro">Pe românește: ${TXT.inlocuireRo}</p></div>
   <div class="bt"><button type="button" data-b="da">Yes (Da)</button><button type="button" class="pr" data-b="cancel">No (Nu)</button></div>`,false);
  d.querySelector('[data-b="da"]').onclick=()=>{inchid();cb(true)};d.querySelector('[data-b="cancel"]').onclick=()=>{inchid();cb(false)}}
function listaFisiere(S,f,filtru){return (S.fold[f]||[]).filter(x=>!filtru||filtru.includes(x.ext))}
function dlgSalvareCa(ctx,dupa){const S=ctx.S,R=S.reg;let fold=R.cale?R.cale.f:S.ultimulLoc;
  const baza=R.nume.replace(/\.[a-z]+$/i,'');let tip=R.cale&&R.cale.ext==='csv'?'CSV UTF-8 (Comma delimited) (*.csv)':TIPURI[0];
  const {d,inchid}=dialog(ctx,`<div class="cap"><b>Save As (Salvare ca)</b><button type="button" aria-label="Închide">✕</button></div>
   <div class="corp"><div class="doua"><div class="fold" aria-label="Folderele">${FOLDERE.map(f=>`<button type="button" data-f="${f}">${esc(f)}</button>`).join('')}</div>
   <div><div class="lista" data-c="fis" aria-label="Fișierele din folder"></div></div></div>
   <label>File name: <span class="ro">(numele fișierului)</span></label><input type="text" data-c="nume" value="${esc(baza)}" spellcheck="false">
   <label>Save as type: <span class="ro">(tipul fișierului)</span></label><select data-c="tip">${TIPURI.map(t=>`<option ${t===tip?'selected':''}>${esc(t)}</option>`).join('')}</select></div>
   <div class="bt"><button type="button" class="pr" data-b="save">Save (Salvare)</button><button type="button" data-b="cancel">Cancel (Anulare)</button></div>`);
  const arata=()=>{const e=extTip(d.querySelector('[data-c="tip"]').value);const L=listaFisiere(S,fold,[e]);
    d.querySelectorAll('.fold button').forEach(b=>b.classList.toggle('ales',b.dataset.f===fold));
    d.querySelector('[data-c="fis"]').innerHTML=L.length?L.map(x=>`<button type="button" data-n="${esc(x.n)}">${esc(x.n)}</button>`).join(''):'<div class="gol">Niciun fișier de tipul ales în folderul acesta.</div>';
    d.querySelectorAll('[data-c="fis"] button').forEach(b=>b.onclick=()=>{d.querySelector('[data-c="nume"]').value=b.dataset.n.replace(/\.[a-z]+$/i,'');semneInterzise(d,false)})};
  d.querySelectorAll('.fold button').forEach(b=>b.onclick=()=>{fold=b.dataset.f;arata()});
  d.querySelector('[data-c="tip"]').onchange=arata;arata();
  d.querySelector('[data-b="cancel"]').onclick=()=>{inchid();dupa&&dupa('cancel')};
  d.querySelector('[data-c="nume"]').addEventListener('input',()=>semneInterzise(d,false));
  d.querySelector('[data-b="save"]').onclick=()=>{if(semneInterzise(d,true)){d.querySelector('[data-c="nume"]').focus();return}
    const t=d.querySelector('[data-c="tip"]').value,e=extTip(t);const n=numeFisier(d.querySelector('[data-c="nume"]').value,e);
    if(!n){d.querySelector('[data-c="nume"]').focus();return}
    if(!FOLOSITE[e]){nota(ctx,`În lecția asta folosim doar .xlsx, .csv și .pdf. Alege unul dintre ele la „Save as type”.`);return}
    const fa=()=>{
      if(e==='csv'&&vizibile(R).length>1){mesaj(ctx,TXT.csvFoi,TXT.csvFoiRo,[['OK','ok'],['Cancel (Anulare)','cancel']],b=>{if(b==='ok'){inchid();salveazaLa(ctx,fold,n,e);nota(ctx,`Salvat ${n}: doar foaia activă, doar textul și numerele.`);draw(ctx);dupa&&dupa('salvat')}});return}
      inchid();salveazaLa(ctx,fold,n,e);if(e!=='pdf')nota(ctx,e==='csv'?`Salvat ${n}: doar textul și numerele foii.`:`Salvat: ${n}, în ${fold}.`);draw(ctx);dupa&&dupa('salvat')};
    // în Save As, Excel întreabă și când numele e chiar al fișierului deschis (p4 „inlocuire”)
    if(gasesteFisier(S,fold,n))confirmaInlocuire(ctx,n,ok=>{if(ok)fa()});else fa()}}
function cereSalvare(ctx){const R=ctx.S.reg;if(!R){nota(ctx,'Nu e deschis niciun registru.');return}
  if(R.cale&&R.cale.ext!=='pdf'){salveazaPeLoc(ctx);draw(ctx);return}
  dlgSalveazaAcesta(ctx,false)}
function cereInchidere(ctx,prinX){const R=ctx.S.reg;if(!R)return;
  const rest=prinX?' În Excel, ✕ închide și fereastra, dacă era ultimul registru deschis; aici fereastra rămâne, ca să lucrezi mai departe.':' Excel a rămas deschis, gol.';
  if(!R.m){inchide(ctx);nota(ctx,'Registrul s-a închis.'+rest);draw(ctx);return}
  dlgSalveazaAcesta(ctx,true,r=>{if(r==='cancel')return;if(r==='salvat'||r==='nu'){inchide(ctx);nota(ctx,(r==='nu'?'Închis fără salvare: ce ai schimbat de la ultima salvare s-a pierdut.':'Salvat și închis.')+rest);draw(ctx)}})}
function dlgDeschidere(ctx){const S=ctx.S;if(S.reg){nota(ctx,'Aici poți avea un singur registru deschis odată (în Excel pot fi mai multe). Închide-l întâi pe cel deschis.');return}
  let fold='Documente',fi=0,ales=null;
  const {d,inchid}=dialog(ctx,`<div class="cap"><b>Open (Deschidere)</b><button type="button" aria-label="Închide">✕</button></div>
   <div class="corp"><div class="doua"><div class="fold">${FOLDERE.map(f=>`<button type="button" data-f="${f}">${esc(f)}</button>`).join('')}</div><div class="lista" data-c="fis"></div></div>
   <label>File name: <span class="ro">(numele fișierului)</span></label><input type="text" data-c="nume" value="" spellcheck="false">
   <label>Files of type: <span class="ro">(ce fel de fișiere arată lista)</span></label><select data-c="filtru">${FILTRE.map((x,k)=>`<option value="${k}">${esc(x.t)}</option>`).join('')}</select></div>
   <div class="bt"><button type="button" class="pr" data-b="open">Open (Deschidere)</button><button type="button" data-b="cancel">Cancel (Anulare)</button></div>`);
  const arata=()=>{const L=listaFisiere(S,fold,FILTRE[fi].e);d.querySelectorAll('.fold button').forEach(b=>b.classList.toggle('ales',b.dataset.f===fold));
    d.querySelector('[data-c="fis"]').innerHTML=L.length?L.map(x=>`<button type="button" data-n="${esc(x.n)}" class="${ales===x.n?'ales':''}">${esc(x.n)}</button>`).join(''):'<div class="gol">Niciun fișier de felul acesta aici.</div>';
    d.querySelectorAll('[data-c="fis"] button').forEach(b=>{b.onclick=()=>{ales=b.dataset.n;d.querySelector('[data-c="nume"]').value=ales;arata()};b.ondblclick=()=>{ales=b.dataset.n;d.querySelector('[data-b="open"]').click()}})};
  d.querySelectorAll('.fold button').forEach(b=>b.onclick=()=>{fold=b.dataset.f;ales=null;arata()});
  d.querySelector('[data-c="filtru"]').onchange=e=>{fi=+e.target.value;arata()};arata();
  d.querySelector('[data-b="cancel"]').onclick=()=>inchid();
  d.querySelector('[data-b="open"]').onclick=()=>{const n=d.querySelector('[data-c="nume"]').value.trim();const x=gasesteFisier(S,fold,n);
    if(!x){nota(ctx,'Alege un fișier din listă (sau schimbă folderul ori felul fișierelor de jos).');return}
    inchid();deschide(ctx,fold,x.n);if(!x.cont.pdf)nota(ctx,`Deschis: ${x.n}.`);draw(ctx)}}

/* ---------------- gesturile ---------------- */
function tasteaza(ctx,k){const S=ctx.S,R=S.reg;
  if(k==='Ctrl+N'){nou(ctx);draw(ctx)}
  else if(k==='Ctrl+S')cereSalvare(ctx);
  else if(k==='F12'){if(R)dlgSalvareCa(ctx);else nota(ctx,'Nu e deschis niciun registru.')}
  else if(k==='Ctrl+W')cereInchidere(ctx);
  else if(k==='Ctrl+O'||k==='Ctrl+F12'){dlgDeschidere(ctx);if(k==='Ctrl+O'&&!S.reg)nota(ctx,'În Excel, Ctrl+O deschide pagina Fișier › Deschidere; acolo alegi Răsfoire (Browse). Aici se deschide direct fereastra Open.')}
  else if(k==='Ctrl+PageDown'){if(R){pagina(ctx,1);draw(ctx)}}
  else if(k==='Ctrl+PageUp'){if(R){pagina(ctx,-1);draw(ctx)}}
  else if(k==='Shift+F11'){if(R){inserareInainte(ctx);draw(ctx)}}
  else if(k==='Ctrl+Z'){if(R&&!anuleaza(ctx))nota(ctx,'Nu mai e nimic de anulat.');draw(ctx)}}
function leaga(ctx){const {el}=ctx;
  el.fis.onclick=e=>{const r=el.fis.getBoundingClientRect();const m=meniu(r.left,r.bottom+2,`<button type="button" data-k="Ctrl+N">Nou (New) <kbd>Ctrl+N</kbd></button><button type="button" data-k="Ctrl+O">Deschidere (Open) <kbd>Ctrl+O</kbd></button>
    <button type="button" data-k="Ctrl+S">Salvare (Save) <kbd>Ctrl+S</kbd></button><button type="button" data-k="F12">Salvare ca (Save As) <kbd>F12</kbd></button><button type="button" data-k="Ctrl+W">Închidere (Close) <kbd>Ctrl+W</kbd></button>
    <div class="mic">În Excel, Fișier (File) deschide o pagină întreagă, cu mai multe comenzi. Aici sunt doar cele de azi.</div>`,el.fis);
    m.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{inchideMeniu();tasteaza(ctx,b.dataset.k)})};
  el.x.onclick=()=>{if(!ctx.S.reg){nota(ctx,'În Excel, ✕ ar închide acum toată fereastra Excel. Aici rămâne deschisă, ca să poți lucra mai departe.');return}cereInchidere(ctx,true)};
  el.taste&&el.taste.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{tasteaza(ctx,b.dataset.k);if(!document.querySelector('.rg-fundal'))el.rg.focus({preventScroll:true})});
  el.plus.onclick=()=>{plus(ctx);draw(ctx);el.rg.focus({preventScroll:true})};
  const [st,dr]=el.sageti;st.onclick=()=>{el.file.scrollLeft-=90;setTimeout(()=>sageti(ctx),60)};dr.onclick=()=>{el.file.scrollLeft+=90;setTimeout(()=>sageti(ctx),60)};
  el.file.addEventListener('scroll',()=>sageti(ctx));
  /* tastatura: pe fereastră (nu în casetele de scris) */
  el.rg.addEventListener('keydown',e=>{const R=ctx.S.reg;
    if(e.target.closest('.rg-fila input')){if(e.key==='Enter'){e.preventDefault();termina(ctx,true)}else if(e.key==='Escape'){e.preventDefault();termina(ctx,false)}return}
    if(e.target.closest('td input')){if(e.key==='Enter'){e.preventDefault();const v=e.target.value;const a=R.ed;R.ed=null;scrie(ctx,R.a,a,v);const m=/([A-D])(\d)/.exec(a);R.sel=m[1]+Math.min(ROWS,+m[2]+1);draw(ctx);el.rg.focus({preventScroll:true})}
      else if(e.key==='Escape'){e.preventDefault();R.ed=null;draw(ctx);el.rg.focus({preventScroll:true})}return}
    const c=e.ctrlKey||e.metaKey,k=e.key;
    let t=null;
    if(c&&(k==='s'||k==='S'))t='Ctrl+S';else if(c&&(k==='o'||k==='O'))t='Ctrl+O';else if(c&&(k==='z'||k==='Z'))t='Ctrl+Z';
    else if(c&&k==='PageDown')t='Ctrl+PageDown';else if(c&&k==='PageUp')t='Ctrl+PageUp';else if(k==='F12'&&c)t='Ctrl+F12';else if(k==='F12')t='F12';
    else if(k==='F11'&&e.shiftKey)t='Shift+F11';else if(c&&(k==='n'||k==='N'))t='Ctrl+N';else if(c&&(k==='w'||k==='W'))t='Ctrl+W';
    if(t){e.preventDefault();tasteaza(ctx,t);return}
    if(!R)return;
    const fila=e.target.closest('.rg-fila');
    if(fila&&(k==='ContextMenu'||(e.shiftKey&&k==='F10'))){e.preventDefault();const r=fila.getBoundingClientRect();meniuFila(ctx,+fila.dataset.i,r.left,r.top-300,fila);return}
    if(fila&&(k==='Enter'||k===' ')){e.preventDefault();activeaza(ctx,+fila.dataset.i);draw(ctx);return}
    if(!fila&&R.sel&&!c&&k.length===1){e.preventDefault();R.ed=R.sel;draw(ctx);const i=el.corp.querySelector('td input');if(i){i.value=k;}return}
    if(!fila&&R.sel&&(k==='Delete'||k==='Backspace')){e.preventDefault();scrie(ctx,R.a,R.sel,'');draw(ctx)}});
  /* celulele */
  el.corp.addEventListener('click',e=>{const td=e.target.closest('td[data-a]');const R=ctx.S.reg;if(!td||!R||td.querySelector('input'))return;
    const deja=R.sel===td.dataset.a;R.sel=td.dataset.a;
    if(deja&&TEL()){R.ed=td.dataset.a;draw(ctx);return}   // pe telefon: a doua atingere pe celula aleasă deschide scrierea (tastatura telefonului)
    R.ed=null;draw(ctx);el.rg.focus({preventScroll:true})});
  el.corp.addEventListener('dblclick',e=>{const td=e.target.closest('td[data-a]');const R=ctx.S.reg;if(!td||!R)return;R.sel=td.dataset.a;R.ed=td.dataset.a;draw(ctx)});
  /* filele: clic, dublu clic (redenumire), clic dreapta / apăsare lungă (meniul), tragere (mutare; cu Ctrl = copiere) */
  let P=null,ultim={i:-1,t:0};
  el.file.addEventListener('contextmenu',e=>{const f=e.target.closest('.rg-fila');if(!f)return;e.preventDefault();
    if(P){if(P.lung)return;clearTimeout(P.timer);P.lung=true}   // telefonul trimite și el „contextmenu” la apăsarea lungă
    meniuFila(ctx,+f.dataset.i,e.clientX,e.clientY,f)});
  el.file.addEventListener('input',e=>{if(!e.target.matches('.rg-fila input'))return;const v=curataNume(e.target.value);   // : \ / ? * [ ] nu se scriu (p2)
    if(v!==e.target.value){const p=e.target.selectionStart;e.target.value=v;try{e.target.setSelectionRange(p-1,p-1)}catch(_){}}e.target.size=Math.max(4,v.length+1)});
  el.file.addEventListener('pointerdown',e=>{const f=e.target.closest('.rg-fila');if(!f||e.target.closest('input')||e.button!==0)return;
    P={i:+f.dataset.i,x:e.clientX,y:e.clientY,drag:false,lung:false,tip:e.pointerType,id:e.pointerId,el:f};
    if(e.pointerType!=='mouse')P.timer=setTimeout(()=>{if(P&&!P.drag){P.lung=true;const r=f.getBoundingClientRect();meniuFila(ctx,P.i,r.left,r.top-320,f)}},550)});
  el.file.addEventListener('pointermove',e=>{if(!P||P.id!==e.pointerId)return;const dx=e.clientX-P.x;
    if(!P.drag&&Math.abs(dx)>8&&!P.lung){P.drag=true;clearTimeout(P.timer);try{el.file.setPointerCapture(e.pointerId)}catch(_){}
      P.fantoma=document.createElement('div');P.fantoma.className='rg-fantoma';P.fantoma.textContent='▭ '+ctx.S.reg.foi[P.i].n;document.body.appendChild(P.fantoma);
      P.marcaj=document.createElement('div');P.marcaj.className='rg-marcaj';el.jos.appendChild(P.marcaj)}
    if(P.drag){e.preventDefault();P.lx=e.clientX;P.ly=e.clientY;P.ctrl=e.ctrlKey;
      /* ținut lângă marginea barei filelor, degetul/mouse-ul o derulează încet (ca în Excel): filele ascunse ies la vedere */
      const rf=el.file.getBoundingClientRect();P.auto=e.clientX<rf.left+22?-1:e.clientX>rf.right-22?1:0;
      if(P.auto&&!P.iv)P.iv=setInterval(()=>{if(!P||!P.auto){return}el.file.scrollLeft+=P.auto*8;pozitie()},40);
      pozitie()}});
  function pozitie(){if(!P||!P.drag)return;P.fantoma.style.left=(P.lx+12)+'px';P.fantoma.style.top=(P.ly-28)+'px';P.fantoma.textContent=(P.ctrl?'▭+ ':'▭ ')+ctx.S.reg.foi[P.i].n;
    const L=[...el.file.querySelectorAll('.rg-fila')];let j=L.length;for(let k=0;k<L.length;k++){const r=L[k].getBoundingClientRect();if(P.lx<r.left+r.width/2){j=k;break}}
    P.j=j;const rj=j<L.length?L[j].getBoundingClientRect():L[L.length-1].getBoundingClientRect(),rb=el.jos.getBoundingClientRect(),rf=el.file.getBoundingClientRect();
    const x=Math.max(rf.left,Math.min(rf.right,j<L.length?rj.left:rj.right));P.marcaj.style.left=(x-rb.left-6)+'px'}
  const gata=e=>{if(!P||P.id!==e.pointerId)return;clearTimeout(P.timer);if(P.iv)clearInterval(P.iv);const p=P;P=null;
    if(p.fantoma)p.fantoma.remove();if(p.marcaj)p.marcaj.remove();
    if(p.lung)return;
    const R=ctx.S.reg;if(!R)return;
    if(p.drag){const L=[...el.file.querySelectorAll('.rg-fila')];const tinta=p.j<L.length?R.foi[+L[p.j].dataset.i].n:null;
      const cp=e.ctrlKey&&p.tip==='mouse';muta(ctx,p.i,tinta,cp);if(cp)nota(ctx,`Copia se numește ${R.foi[R.a].n}.`);draw(ctx);el.rg.focus({preventScroll:true});return}
    if(e.type==='pointercancel')return;
    const t=Date.now();
    if(ultim.i===p.i&&t-ultim.t<450){ultim={i:-1,t:0};incepeRedenumire(ctx,p.i);return}
    ultim={i:p.i,t};activeaza(ctx,p.i);draw(ctx);const b=el.file.querySelector(`.rg-fila[data-i="${p.i}"]`);b&&b.focus({preventScroll:true})};
  el.file.addEventListener('pointerup',gata);el.file.addEventListener('pointercancel',gata);
  el.file.addEventListener('focusout',e=>{const R=ctx.S.reg;if(R&&R.ren!=null&&e.target.matches('.rg-fila input')&&!document.querySelector('.rg-fundal'))setTimeout(()=>{if(ctx.S.reg&&ctx.S.reg.ren!=null&&!document.querySelector('.rg-fundal'))termina(ctx,true)},0)});
  el.csv.querySelector('[data-b="csvx"]').onclick=()=>{if(ctx.S.reg)ctx.S.reg.csvBara=false;draw(ctx)};
  el.csv.querySelector('[data-b="csvsa"]').onclick=()=>{if(ctx.S.reg)dlgSalvareCa(ctx)};
  el.csv.querySelector('[data-b="csvnu"]').onclick=()=>{if(ctx.S.reg)ctx.S.reg.csvBara=false;draw(ctx)}}

/* ---------------- tipul ---------------- */
function construieste(Q,body,api){css();inchideMeniu();document.querySelectorAll('.rg-fundal').forEach(x=>x.remove());
  const T=teste({Q});
  body.innerHTML=`${TEL()?'<p class="rg-tel">Pe telefon: ții degetul apăsat pe o filă în loc de clic dreapta; atingi de două ori fila ca s-o redenumești; o tragi cu degetul ca s-o muți. O filă care nu încape o aduci la vedere cu săgețile ‹ ›; când tragi, ține degetul lângă margine și filele se derulează singure. Ca să scrii într-o celulă, o atingi de două ori. Tastele le apeși din butoanele de sub titlu.</p>':''}
   ${T.length?'<div class="rg-teste" aria-live="polite"></div>':''}
   <div class="rg" tabindex="0" aria-label="Excel simulat: registrul și foile lui">
    <div class="rg-titlu"><button type="button" class="rg-fis" aria-haspopup="menu">Fișier (File)</button><span class="rg-nume"></span><button type="button" class="rg-x" aria-label="Închide registrul (✕, Close)" title="Închidere (Close)">✕</button></div>
    ${Q.taste===false?'':`<div class="rg-taste"><span>Tastele lui Excel:</span>${['Ctrl+N','Ctrl+S','F12','Ctrl+W','Ctrl+O','Ctrl+PageUp','Ctrl+PageDown','Ctrl+Z'].map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('')}</div>`}
    <div class="rg-bara-csv" hidden><b>ⓘ POSSIBLE DATA LOSS</b><span>${esc(TXT.csvBara)}</span><button type="button" data-b="csvnu">Don't show again</button><button type="button" data-b="csvsa">Save As...</button><button type="button" data-b="csvx" aria-label="Închide bara">✕</button></div>
    <div class="rg-corp"></div>
    <div class="rg-jos" style="position:relative"><button type="button" class="rg-sag" aria-label="Filele din stânga">‹</button><button type="button" class="rg-sag" aria-label="Filele din dreapta">›</button><div class="rg-file" role="tablist" aria-label="Filele foilor"></div><button type="button" class="rg-plus" aria-label="Foaie nouă (New sheet)" title="New sheet (Foaie nouă)">+</button></div>
    <div class="rg-stare"><span class="st"></span><span>100%</span></div>
   </div>
   <p class="rg-nota" aria-live="polite"></p>
   ${Q.taste===false?'':'<p class="rg-nota" style="display:block">În pagină, tastele Ctrl+N, Ctrl+W, Ctrl+PageUp, Ctrl+PageDown și F12 le ia browserul (fereastră nouă, închide pagina, altă filă a browserului). De aceea le apeși din butoanele de mai sus. În Excel le apeși pe tastatură.</p>'}
   ${Q.o?`<div class="opts" style="margin-top:10px">${(Q.amesteca===false?Q.o.map((_,k)=>k):api.shuffle(Q.o.map((_,k)=>k))).map(k=>`<button class="opt" type="button" data-k="${k}">${esc(Q.o[k])}</button>`).join('')}</div>`:''}`;
  const q=s=>body.querySelector(s);
  const el={rg:q('.rg'),titlu:q('.rg-nume'),fis:q('.rg-fis'),x:q('.rg-x'),taste:q('.rg-taste'),csv:q('.rg-bara-csv'),corp:q('.rg-corp'),jos:q('.rg-jos'),file:q('.rg-file'),plus:q('.rg-plus'),
    sageti:[...body.querySelectorAll('.rg-sag')],stare:q('.rg-stare .st'),nota:q('.rg-nota'),teste:q('.rg-teste')};
  const ctx={Q,S:stareStart(Q),el,api};CTX.set(body,ctx);
  leaga(ctx);draw(ctx);
  if(!ctx.S.reg)nota(ctx,Q.notaStart||'Excel e deschis, dar fără niciun registru.');
  return ctx}
function render(Q,body,api){const ctx=construieste(Q,body,api);
  if(Q.o){body.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(api.done())return;const k=+b.dataset.k;
      if(k===Q.ok){b.classList.add('ok');body.querySelectorAll('.opt').forEach(x=>x.disabled=true);api.resolve(true)}
      else{b.classList.add('bad');b.disabled=true;api.resolve(false,'Mai încearcă. Fă întâi pașii în fereastra de mai sus și uită-te ce se întâmplă.');
        if(api.attempts()>=2){body.querySelectorAll('.opt').forEach(x=>x.disabled=true);body.querySelector(`.opt[data-k="${Q.ok}"]`).classList.add('ok');api.giveUp(esc(Q.o[Q.ok]))}}});
    return}
  api.checkButton(()=>{const c=CTX.get(body);const T=teste(c);const rau=T.find(t=>!testeaza(c,t));
    if(!rau){api.resolve(true)}
    else{api.resolve(false,`Încă nu: <b>${esc(rau.ce)}</b>.`);
      api.revealButton(()=>{const c2=construieste(Q,body,api);ruleaza(c2,Q.rezolvare||[]);draw(c2);api.giveUp(Q.raspuns||'am făcut pașii în fereastra de mai sus; uită-te la file și la titlu.')})}
    const c3=CTX.get(body);if(c3&&!document.querySelector('.rg-fundal'))c3.el.rg.focus({preventScroll:true})})}
/* op-urile, fără ferestre (poarta și „Arată-mi răspunsul”) */
function ruleaza(ctx,ops){(ops||[]).forEach(([op,...a])=>{const R=()=>ctx.S.reg;
  if(op==='nou')nou(ctx);else if(op==='plus')plus(ctx);else if(op==='inserareInainte')inserareInainte(ctx);else if(op==='activeaza')activeaza(ctx,a[0]);
  else if(op==='redenumeste')redenumeste(ctx,a[0],a[1]);else if(op==='culoare')culoare(ctx,a[0],a[1]);
  else if(op==='sterge'){if(poateSterge(ctx,a[0])!=='singura')sterge(ctx,a[0])}
  else if(op==='muta')muta(ctx,a[0],a[1],false);else if(op==='copiaza')muta(ctx,a[0],a[1],true);else if(op==='scrie')scrie(ctx,a[0],a[1],a[2]);
  else if(op==='salveaza'){const r=R();if(r.cale&&r.cale.ext!=='pdf')salveazaPeLoc(ctx);else{const n=numeFisier(a[0].nume,'xlsx');if(gasesteFisier(ctx.S,a[0].folder,n)&&!a[0].inlocuieste)return;salveazaLa(ctx,a[0].folder,n,'xlsx')}}
  else if(op==='salveazaCa'){const e=a[0].tip||'xlsx';const n=numeFisier(a[0].nume,e);if(gasesteFisier(ctx.S,a[0].folder,n)&&!a[0].inlocuieste)return;salveazaLa(ctx,a[0].folder,n,e)}
  else if(op==='inchide'){const r=R();if(r&&r.m&&a[0]==='da'&&r.cale)salveazaPeLoc(ctx);inchide(ctx)}
  else if(op==='deschide'){const [f,n]=a[0].split('/');deschide(ctx,f,n)}})}
function rezolva(Q,body,api){if(Q.o){const b=body.querySelector(`.opt[data-k="${Q.ok}"]`);if(b)b.click();return}
  let c=CTX.get(body);if(!c)return;c=construieste(Q,body,api);ruleaza(c,Q.rezolvare||[]);draw(c);api.checkButton&&render2(Q,body,api)}
function render2(Q,body,api){/* după construieste(), butonul Verifică trebuie legat de noul context */
  api.checkButton(()=>{const c=CTX.get(body);const T=teste(c);const rau=T.find(t=>!testeaza(c,t));if(!rau)api.resolve(true);else api.resolve(false,`Încă nu: <b>${esc(rau.ce)}</b>.`)})}
function gresit(Q,body,api){if(Q.o){const k=Q.o.findIndex((_,i)=>i!==Q.ok);const b=body.querySelector(`.opt[data-k="${k}"]`);if(b)b.click();return true}
  let c=construieste(Q,body,api);ruleaza(c,Q.greseala||[]);draw(c);render2(Q,body,api);return true}
/* pentru probe: starea citită din pagină */
function stare(body){const c=CTX.get(body);return c?copie({reg:c.S.reg,fold:c.S.fold,ist:c.S.ist,undo:c.S.undo.length}):null}
return {render,rezolva,gresit,stare,_ruleaza:(body,ops)=>{const c=CTX.get(body);ruleaza(c,ops);draw(c)}};
})();
if(typeof window!=='undefined')window.SimRegistru=SimRegistru;
