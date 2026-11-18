# Referințele reale Office — Word, Excel, PowerPoint (Etapa 0, 16.11.2026)

Ce sunt: trei fotografii „în text” ale interfeței aplicațiilor REALE de pe PC-ul profesorului, citite cu UI Automation
(arborele de elemente pe care Windows îl dă cititoarelor de ecran). Sunt reperul înghețat cu care `oracol_ui.py` (O3)
compară biblioteca simulată (R4 din `../contract.md`). Nimic din ele nu e scris de mână: tot vine din aplicația rulată
sau din pagini Microsoft cu URL (`surse_microsoft.md`); ce nu se poate dovedi e marcat **[NEVERIFICAT]**.

| Fișier | Ce e |
|---|---|
| `dump_uia_office.py` | generatorul (rulează pe desktop ascuns; refuză pe ecranul omului) + `verifica` (oracol al livrabilului) |
| `uia_word.json` | Word — 45 de suprafețe, 2309 noduri (980 KB) |
| `uia_excel.json` | Excel — 47 de suprafețe, 2443 noduri (1009 KB) |
| `uia_powerpoint.json` | PowerPoint — 41 de suprafețe, 1947 noduri (906 KB) |
| `surse_microsoft.md` | paginile Microsoft citate (S1–S11) |

Generate: Word 22:39, Excel 22:42, PowerPoint 22:46 (16.11.2026, a doua rulare completă), fiecare închis normal,
`erori` = [] și `nedeschise` = [].

**Stabilitate (două rulări complete, 22:15–22:32 și 22:36–22:46, comparate nod cu nod):** aceleași suprafețe și aceleași
noduri (tip, etichetă, idMso) peste tot, cu 4 excepții care NU țin de interfață: ora din Backstage › Info („Today, 22:15” →
„Today, 22:36”, la toate trei) și un element din bara de adrese a ferestrei Windows Save As (MenuItem → SplitButton
„Documente”). Pozițiile: identice în panglică, Backstage, meniuri, bara de stare; diferă DOAR poziția dialogurilor față de
fereastră (fiecare dialog mutat în bloc, ex. Format Cells −295 px pe orizontală; conținutul lui identic). Deci oracolele
compară dialogurile relativ la colțul dialogului, nu la fereastra aplicației.

## Aplicațiile măsurate
- Office: `ProPlus2021Retail`, canal **Current Channel**, versiunea exe **16.0.20326.20318** (Word, Excel, PowerPoint identice),
  x64, interfață **engleză** (citit din registrul Click-to-Run, doar citire, și din fișierele exe).
  Notă: contractul spune „Microsoft 365”; produsul instalat e Office Professional Plus 2021 pe canalul lunar — interfața e cea
  modernă (bara de titlu cu căutare, Draw, Add-ins în Home); observat: fără comutatorul AutoSave în bara de titlu și fără
  grupurile Copilot/Designer din panglică (care apar în lista Microsoft, vezi comparația).
- Windows 11 Pro în română: ferestrele de sistem din aplicații (Save As, Insert Picture, butoanele de titlu ale dialogurilor:
  „Închidere”, „Ajutor contextual”) sunt în ROMÂNĂ, iar etichetele Office din ele în engleză („File name:”, „Save as type:”).

## Cum se rulează (≈3,5 minute pe aplicație)
```
python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/dump_uia_office.py toate
python C:/00/AI_0/tools/hidden_desktop.py run --desktop LHRefOffice --timeout 900 -- python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/dump_uia_office.py word
python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/dump_uia_office.py verifica
```
`verifica` tipărește pe ULTIMA linie numărul de probleme (cod 0 = nicio problemă, 1 = probleme): cheile obligatorii, toate
suprafețele cerute prezente sau explicate în `nedeschise`, ≥ 8 file, fila Developer absentă (atât suprafața
`panglica.TabDeveloper`, cât și TabItem-ul ei din rândul filelor sau din orice altă listă de file — de la 17.11.2026),
fereastra 1366×768 css,
niciun nume de utilizator/e-mail în fișier, nicio excepție. Detaliile se tipăresc pe rândurile dinainte (fără JSON separat:
nu am voie să scriu alte fișiere în afara celor 6 deținute). **Ultima rulare: `0`, cod 0** (17.11.2026, după scoaterea filei
Developer din rândul filelor Excel; cu verificarea nouă, înainte de scoatere dădea `1`: „fila personală „Developer”
(TabDeveloper) e încă în file_panglicii/1:Ribbon Tabs/8:Developer”).

Cum lucrează, pe scurt: pornește o instanță NOUĂ (`WINWORD /x /q /w`, `EXCEL /x` + „Blank workbook” din ecranul de pornire,
`POWERPNT /B`; PowerPoint se SARE dacă rulează deja) pe un desktop ascuns (`LHRefOffice`), mută fereastra pe monitorul cu
100% DPI (al doilea monitor; factor 1,0) și face CADRUL VIZIBIL exact 1366×768; legătura COM se ia din fereastra instanței
noastre (`AccessibleObjectFromWindow`), nu din instanța omului. La final: poziția ferestrei pusă înapoi (Office o ține minte
la ieșire), document marcat „salvat”, ieșire prin COM (Word, Excel) sau WM_CLOSE (pe acest PC PowerPoint nu a ieșit la
`Quit` în 60 s, de două ori), forțat doar după 90 s și doar PID-ul nostru. Nicio setare schimbată intenționat (excepția
posibilă: zoom-ul Word, vezi „De știut”).

## Formatul JSON
```
{aplicatie, versiune (exe), versiune_com_build, produs{...}, generat, mod_pornire, dpi_factor, dpi,
 fereastra:[1366,768] (css), fereastra_brut:[w,h] (px fizici), nota_rect,
 suprafete:{<id>: nod}, excluse_personal:[...], sarite_cont, redactari{motiv:număr}, nedeschise:[...],
 acces_rapid_implicit, comparatie_saec{...}, erori:[], jurnal:[...]}
nod = {tip (ControlType UIA în engleză: Button, SplitButton, MenuItem, Group, TabItem…), eticheta,
       id_mso? (AutomationId = idMso Office), id_win32? (id numeric de control Win32), clasa (clasa UIA/Win32),
       rect_css [x,y,l,h] (px CSS la 100%, față de colțul stânga-sus al cadrului VIZIBIL), rect_brut [x,y,l,h] (px fizici),
       vizibil:false? (în afara ecranului), activ:false? (gri), ajutor? (HelpText = textul sfatului), scurtatura? (ex. Ctrl+B),
       tasta_acces? (KeyTip, ex. "Alt, H, Z 1"), bifat? (ToggleState 0/1), valoare? (ex. fontul "Aptos (Body)", "Zoom 100 %"),
       copii:[nod...]}
```
Câmpuri în plus pe unele suprafețe: `fila` (panglica), `file_dialog` (filele unui dialog), `clasa_fereastra`, `deschis_prin`
(calea exactă: `CommandBars.ExecuteMso('…')`, `Application.Dialogs(129).Display()`, „clic dreapta pe diapozitiv › …”),
`punct_css` + `fereastra_tinta` (unde s-a dat clic dreapta), `obiect_selectat` (filele contextuale), `celule_omise` (Excel:
celulele grilei se numără, nu se salvează), `afisat` (bara Acces rapid).

## Ce conține (cheile din `suprafete`)
| Suprafață | Word | Excel | PowerPoint |
|---|---|---|---|
| `bara_titlu`, `acces_rapid`, `file_panglicii`, `bara_stare`, `zona_document` | da | da | da (zona documentului: PowerPoint nu-și expune diapozitivul și miniaturile în UIA → 12 noduri) |
| `panglica.<TabId>` — TOATE filele afișate | 10: Home, Insert, **Draw**, Design, Layout, References, **Mailings**, Review, View, **Help** | 9: Home, Insert, Draw, Page Layout, Formulas, Data, Review, View, Help (**Developer scoasă**) | 11: Home, Insert, **Draw**, Design, Transitions, Animations, Slide Show, **Record**, **Review**, View, Help |
| grupuri în filele de bază | 61 | 51 (+4 în Developer, scoase) | 55 |
| `backstage.*` | nav, cadru, Home, New, Open, Info, Save As, Print, Share, Export | la fel | la fel |
| `meniu_contextual.*` (meniu + mini-bara) | text, text_selectat | celula, antet_coloana, antet_rand, fila_foii | diapozitiv, text, miniatura |
| `dialog.*` / `panou.*` | Font(+Advanced), Paragraph(+Line and Page Breaks), Page Setup(+Paper, Layout), Insert Table, Borders and Shading(+Page Border, Shading), Columns, Insert Picture, Save As | Format Cells(+Alignment, Font, Border, Fill, Protection), Sort, **Sort Warning**, Insert, Delete, Column Width, Row Height, Move or Copy, Insert Function, Save As, Change Chart Type(+All Charts) | Font(+Character Spacing), Paragraph, Insert Table, Insert Picture, Save As, `panou.AnimationCustom` (Animation Pane), `panou.LaunchFormatBackground` (Format Background) |
| `panglica_context.*` (file contextuale, cu obiect selectat) | Table Design, Table Layout, Picture Format, Shape Format | Chart Design, Format | Shape Format, Picture Format, Table Design, Table Layout |

De unde lista de dialoguri (grep în `lectii/_sim` + `jocuri`, 16.11.2026): Font / Paragraph / Page Setup / Insert Table /
Borders and Shading / Insert Picture → `wordobj*.js`, `wordobj-pagina.js`, `jocuri/word-*`; Columns, Save As, Print → textul
lecțiilor; Format Cells / Delete (dialogSterge) / Column Width / Row Height → `excelx.js`, `excelx-formatare.js`; Sort + Sort
Warning → `excelx-sortare.js`, `excelx-proiect.js`, `jocuri/_motor/tip-excel.js`, `jocuri/excel-*`; Move or Copy →
`registru-foi.js`; Change Chart Type → `excelx-grafic.js`; Insert Function → `excelx-*` (citat, „azi nu o folosim”);
Format Background / Insert Table / Insert Picture → `simppt.js`, `simppt-formatare.js`, `jocuri/prezentari-vi`;
Animation Pane → `simppt-animatii.js`.

## Ce e PERSONAL și a ieșit din referință (`excluse_personal`)
- **Excel — fila Developer** (grupurile Code, Add-ins, Controls, XML): Microsoft spune că nu e afișată implicit (S1). Setarea
  omului NU a fost schimbată; fila a fost citită și apoi scoasă.
  **17.11.2026 (verificare_etapa0.md, punctul 4):** fila scăpase în RÂNDUL filelor (`file_panglicii`, TabItem „Developer”),
  pentru că `verifica` căuta doar suprafața `panglica.TabDeveloper`. Scoasă și de acolo cu
  `dump_uia_office.py scoate_personale excel` (fără Office, fără dump nou), cu notă în `excluse_personal` („scoasă: profilul
  curat al contractului R4 nu are Developer”); fila Help, care venea după ea, mutată la stânga cu cât ocupa Developer
  (x 623 → 543 css; filele stau lipite în rândul măsurat — DEDUS, nu re-măsurat într-un profil fără Developer). Un dump nou
  face același lucru singur (`scrie` cheamă `scoate_file_personale_din_rand`), iar `verifica` caută acum și fila din rând.
- **Excel și PowerPoint — grupul „Claude” din Home**: adus de un add-in instalat de om. Dovezi: niciun idMso în grup, nu e în
  lista Microsoft, lipsește în Word, iar registrul (doar citit) arată panglica modificată de add-in-uri web
  (`HKCU\Software\Microsoft\Office\16.0\WEF`, `Excel_RibbonCache = 1`, `PowerPoint_RibbonCache = 1`; Word nu are valoarea).
- **Contul**: elementele `MeControlWidget` / `PersonaPicture` sărite (`sarite_cont`); numele afișat al contului, numele de
  utilizator Windows și numele calculatorului se redactează oriunde ar apărea; e-mailurile, căile și numele de fișiere
  (lista Recent, „Authors” din Save As) se înlocuiesc cu `[redactat: …]` (`redactari`: Word 72, Excel 65, PowerPoint 28).
  Elementele listelor din ferestrele de fișiere și din Backstage › Open nu se salvează deloc. Ultima plasă: fișierul NU se
  scrie dacă un nume interzis a rămas în el.

## Rămase așa cum au fost găsite — de lămurit (NU sunt dovedite ca implicite)
- **[NEVERIFICAT] bara Acces rapid (Quick Access Toolbar)**: în Word e ASCUNSĂ, în Excel și PowerPoint e AFIȘATĂ (Excel: Save,
  Undo, Redo; PowerPoint: Save, Undo, Redo, From Beginning). Paginile Microsoft se contrazic asupra stării implicite (S3, S4).
  Referința păstrează starea găsită pe fiecare aplicație. De lămurit pe un PC din laborator (propus pentru `de_verificat.md`,
  pe care îl scrie dirijorul).
- **[NEVERIFICAT] „Language Romanian” în bara de stare** Word și PowerPoint: vine din limba de editare Office a omului
  (registrul: `PreferredEditingLanguage = ro-RO`). Pe PC-urile din laborator e probabil la fel, dar nedovedit.
- **[NEVERIFICAT] butoanele Left-to-Right / Right-to-Left** (Word › Home › Paragraph) și secțiunea „Complex scripts” din
  dialogul Font: ipoteza (nedovedită) e că apar din cauza limbilor de editare ale omului; nu am găsit o pagină Microsoft
  care s-o confirme și nu am schimbat nimic. Rămân în referință așa cum au fost găsite.
- Butoanele cu „ultima culoare folosită” (Font Color Red, Text Highlight Color yellow, Fill Color) poartă starea sesiunii.
- **Starea activ / gri (`activ:false`) a comenzilor de clipboard e starea DE LA DUMP, nu o proprietate a aplicației**
  (17.11.2026, reverificare_etapa0.md §1). Paste (SplitButton-ul și butonul `Paste` din Home › Clipboard) e ACTIV în toate
  trei referințele fiindcă în clipboard era ceva când s-a făcut dump-ul (16.11, 22:39-22:46); cu clipboard-ul gol, Paste e
  gri și în aplicația reală. La fel, Cut și Copy sunt gri în Word și PowerPoint (nimic selectat în documentul gol) și active
  în Excel (o celulă e mereu selectată). Cine se sprijină pe `activ`: O8 (`oracol_comenzi_moarte.py`, reparația 7a — o comandă
  gri pe ecran, dar activă în referință, se numără moartă) și mutantul O8-07 („Paste gri”), prins tocmai pentru că
  referința arată Paste activ. Un dump nou cu clipboard-ul gol ar face Paste `activ:false` și O8-07 n-ar mai fi prins
  (O8 are oricum alți 7 mutanți prinși fără el). La un dump nou: clipboard-ul cu text (Ctrl+C pe un cuvânt) ÎNAINTE de
  captură, ca starea să rămână aceeași; dacă nu, nota se actualizează și O8-07 se reverifică.
- Numele șabloanelor din Backstage › Home/New vin online, în română (regiunea RO); se pot schimba de la o zi la alta.
- Zoom-ul: Word capturat la 100% (pus de script, valoarea omului pusă înapoi la ieșire); Excel 100%; PowerPoint „Zoom 70 %”
  = potrivit la fereastră (implicit).

## Ce NU s-a putut deschide / limite (în ultimele rulări `nedeschise` = [] la toate trei)
- **Modul sigur (/safe) NU a fost folosit**: pe acest PC `WINWORD /x /q /w /safe` deschide la pornire fereastra „Default File
  Types” (alegere Office Open XML / OpenDocument) — a răspunde = a alege o setare; fără răspuns, panglica nu se încarcă.
  Personalul s-a scos pe dovezi (mai sus), nu prin /safe.
- PowerPoint: zona diapozitivului și panoul de miniaturi nu apar în UI Automation (fără ferestre copil) → `zona_document`
  are doar cadrul; clicurile din dreapta s-au dat la coordonate calculate (`PointsToScreenPixels`) și s-au VERIFICAT după
  conținut (meniul „miniatura” are Duplicate/Delete Slide; „text” are Font…/Paragraph…), altfel nu intrau în referință.
- PowerPoint: `TableInsertDialog` dă E_FAIL prin ExecuteMso (S7) → deschis prin `TableInsert`; `LaunchFormatBackground` dă
  E_INVALIDARG → deschis ca elevul, din clic dreapta pe diapozitiv › Format Background...
- Word: `TableInsertDialogWord` NU deschide fereastra când e text selectat → cursorul se pune la sfârșitul documentului înainte.
- Necapturate (nu se cer acum): listele derulante și galeriile deschise (Paste ▾, Borders ▾, lista de fonturi), sfaturile
  „pe hover” ca imagini, KeyTips afișate, Backstage › Account (personal), Options, ecranele de pornire Word/PowerPoint
  (Excel l-a trecut doar ca să creeze registrul gol), Start/bara de activități Windows (cer ecranul omului, vezi contractul I6).

## Comparația cu lista oficială Microsoft (`comparatie_saec` în fiecare JSON; sursa S11)
Filele principale afișate: Word 10, Excel 9, PowerPoint 11 — TOATE există în lista Microsoft (`file_doar_in_aplicatie` = []).
Grupuri: Word 61 față de 81 în listă, Excel 51 față de 79, PowerPoint 55 față de 80. Diferențele, pe tipuri:
1. Lista Microsoft e o REUNIUNE a tuturor variantelor (funcții de abonament, Insider, AI, etichete de confidențialitate,
   variante Power Query): `GroupAIAssistance`, `GroupActivation`, `GroupClassifyLabelProtect`, `GroupVoiceTools`,
   `GroupDesignerOptions`, `GroupPythonChunk`, `GroupPowerQuery*`, `GroupChunkCameoCamera` etc. — nu apar pe ProPlus 2021.
2. Grupuri ale căror controale nu poartă idMso (restrânse la 1366 px într-un singur buton, sau galerii), deci fără
   corespondent automat, dar prezente: Word Review › Language, Protect; View › Macros; Excel Insert › Text, Symbols;
   View › Macros; Draw › Drawing Tools (galeria de pixuri).
3. Grupuri mai noi decât lista sau mutate (prezente în aplicație, fără grup corespondent în acea filă a listei):
   **Add-ins** din Home la toate trei (S2), Word Insert › **eSignature**, Help › **Mobile**, Draw › **Help**/Undo.
4. File din listă care NU se afișează implicit: Developer, Add-ins, Automate (Excel), Blog/Outlining/Print Preview/Slide Master
   etc. (file de mod sau contextuale).
Detaliul complet, grup cu grup (`id_grup_saec` dedus din idMso-urile controalelor), e în `comparatie_saec.file.<TabId>`.

## Defectele dump-ului vechi (`_cercetare/office_comenzi/dump_panglica_uia.py`, 27.09) — reparate
- (a) file lipsă: acum se iau din aplicație TOATE filele afișate (Word cu Draw, Mailings, Help; PowerPoint cu Draw, Record,
  Review, Help), nu o listă scrisă de mână.
- (b) Developer = setare personală: citită și scoasă, cu sursa (S1); plus grupul add-in „Claude”.
- (c) DPI și fereastră mare: cadrul vizibil e 1366×768 pe monitorul de 100% (`dpi_factor` 1.0; pe un monitor cu alt DPI
  scriptul împarte la factor); `rect_css` față de colțul cadrului vizibil, `rect_brut` păstrat.
- (d) doar panglica: acum și bara de titlu, Acces rapid, bara de stare, Backstage (8 pagini), meniurile de clic dreapta,
  dialogurile din lecții (cu filele lor), panourile, filele contextuale.

## De știut (siguranța lucrului pe PC-ul omului)
- În timpul construirii (16.11, 21:4x–22:3x) au fost **opriri forțate** ale instanțelor MELE de pe desktopul ascuns: Excel
  (explorare 21:4x și prima rulare 21:5x — cauza probabilă: scriptul îi ținea referințe COM; după ce le eliberează înainte de
  ieșire, Excel se închide normal), Word în mod
  sigur (de două ori — fereastra „Default File Types”; renunțat la /safe), PowerPoint o dată (21:58). Fiecare aplicație a
  fost apoi pornită și închisă NORMAL de două rulări complete (Word 22:19 și 22:39, Excel 22:22 și 22:42, PowerPoint 22:32 și
  22:46), fără nicio fereastră de recuperare la pornire în jurnal.
- Un PowerPoint al meu a rămas deschis pe desktopul ascuns între 22:25 și ~22:31 (scriptul a crezut greșit că prezentarea e
  „străină”: PowerPoint o redenumise după titlu). Închis cu WM_CLOSE după ce am verificat că avea doar prezentarea mea
  nesalvată. Reparat: prezentările mele poartă acum eticheta `LHREF`, iar ieșirea se face prin WM_CLOSE.
- **Zoom Word [NESIGUR]**: la prima pornire (21:4x) un document nou Word se deschidea la **289%**; la ultimele rulări, la
  **100%**. Scriptul pune valoarea găsită înapoi înainte de ieșire, dar Word pare să nu țină minte zoom-ul pus prin COM.
  E posibil ca rulările mele să fi schimbat zoom-ul cu care Word deschide documentele noi. Vasile: dacă vrei altul, View › Zoom.
- Alt agent folosea în paralel Excel prin COM (EXCEL.EXE 16740); rulările mele au folosit procese separate (`/x`).
  PowerPoint are o singură instanță: dacă alt program cere PowerPoint cât rulează scriptul, se lipește de instanța ascunsă —
  scriptul închide atunci doar prezentarea lui și lasă aplicația (scrie asta în `erori`).
- `__pycache__/` din acest dosar e produs de importurile mele de probă; e în `.gitignore`.

## Runda `acoperire` pe Word (18.11.2026) — suprafețe noi în `uia_word.json`
Generator-soră: `acoperire_word_r3.py` (`capturi` / `scrie` / `verifica`, plus `scenarii` pentru rezultatele reale ale
scenariilor noi). Aceeași instanță nouă `WINWORD /x` pe desktopul ascuns `LHRefOffice`, fereastra 1366×768 css, gesturile
din `ruleaza_real.py`; niciun Save adevărat (Cancel / Esc). Cheile vechi NU au fost atinse; cele 16 noi:
`dialog.save_this_file` (Ctrl+S pe document nou), `dialog.save_your_changes_to_this_file` (Ctrl+W și ✕ cu modificări —
aceeași fereastră), `lista.FontSize`, `lista.FileSaveAs_tip`, `lista.FileSaveAs_navigare` (doar elementele implicite
Windows; 19 personale scoase), `dialog.FileSaveAs_pdf`, `dialog.open` (Ctrl+F12), `backstage.Open_rand_recent` (structura,
textele = „<fișier>”) și 8 liste din panglică (`lista.<idMso>`). Cum, când și faptele (ce pagină deschide Ctrl+O / File /
More options…): blocul `acoperire_r3` din `uia_word.json`. Ce n-a mers invizibil: `de_verificat.md` AC-1…AC-3.
