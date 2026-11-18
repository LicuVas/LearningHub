# Convenția arborelui de interfață (Etapa 0, 16.11.2026; reparațiile 7, 8, 9, f — 17.11.2026)

Ce e: regula după care biblioteca centrală `aplicatii/` își MARCHEAZĂ interfața în DOM, ca oracolele de structură
(O1 `oracol_central.py`, O2 `oracol_identic.py`, O3 `oracol_ui.py`, O7 `oracol_text_ui.py`, O8 `oracol_comenzi_moarte.py`)
s-o poată citi și compara cu referința REALĂ înghețată (`referinte/uia_*.json`). Extractorul care o citește:
`oracole/arbore_randat.js` (injectat în pagină); comparația: `oracole/structura_lib.py`.
Referința NU e randarea bibliotecii: arborele citit din pagină se compară cu arborele UI Automation al aplicației
reale. O bibliotecă ce nu respectă convenția apare ca „suprafață lipsă” (toate comenzile ei lipsă), nu ca 0.

## 1. Rădăcina
- Fiecare aplicație desenată de bibliotecă are UN element rădăcină: `data-lh-aplicatie="word|excel|powerpoint|explorer|windows|paint"`
  (+ opțional `data-lh-profil="word365|word2007"`). Tot ce e interfață de aplicație stă SUB rădăcină.
- **Rădăcina contează doar dacă e ÎNREGISTRATĂ** (reparația 8): biblioteca o creează ea însăși și o întoarce în
  `LH.aplicatii.radacini()` (`api_biblioteca.md` §1), iar pagina încarcă `aplicatii/aplicatii.js`. Un element marcat
  `data-lh-aplicatie` pe care biblioteca nu l-a creat (pus de lecție, din HTML sau din scriptul ei) NU e rădăcină: e
  interfață desenată în pagină, și O1 îl numără (§6). Lecția are doar locul rezervat `data-lh-aplicatie-loc`.
- Rădăcina = cadrul ferestrei aplicației. Pozițiile se măsoară față de colțul ei stânga-sus (ca `rect_css` din referință,
  care e față de colțul cadrului vizibil al ferestrei reale, la 1366×768, 100% DPI).
- O1 numără orice element de interfață de aplicație din pagină care NU e sub o rădăcină înregistrată (vezi §6).

## 2. Suprafețele
- Fiecare suprafață are un element cu `data-lh-suprafata="<cheie>"`, cu ACEEAȘI cheie ca în `referinte/uia_<app>.json › suprafete`:
  `bara_titlu`, `acces_rapid`, `file_panglicii`, `bara_stare`, `zona_document`, `panglica.<TabId>` (ex. `panglica.TabHome`;
  doar fila activă trebuie să fie în DOM), `panglica_context.<Ctx_Id>` (ex. `panglica_context.Ctx_TableDesign`),
  `backstage.nav`, `backstage.<Pagina>` (ex. `backstage.Save As`), `meniu_contextual.<tinta>` (ex. `meniu_contextual.text`),
  `dialog.<idMso>` (ex. `dialog.FontDialog`; fila a doua a unui dialog: `dialog.FontDialog#Advanced`), `panou.<idMso>`.
- Suprafețele aplicațiilor fără referință încă (Windows, Explorer, Paint): cheia = partea de după punct din `suprafete.json`
  (ex. `meniu_start`, `panou_navigare`, `bara_instrumente`). Referința lor vine într-o rundă `acoperire`.
- Doar suprafețele VIZIBILE se citesc. Ce se deschide (Backstage, meniuri, dialoguri, file) se deschide prin GEST (§4).

## 3. Nodurile
Fiecare element de interfață din suprafață poartă:
- `data-lh-tip` = ControlType-ul UI Automation al elementului REAL, în engleză: `Group`, `Button`, `SplitButton`, `MenuItem`,
  `ComboBox`, `CheckBox`, `RadioButton`, `Edit`, `Spinner`, `ListItem`, `TabItem`, `Slider`, `Text`, `Hyperlink`, `Pane`,
  `List`, `Menu`, `ToolBar`, `StatusBar`, `TitleBar`, `Window`, `Tab` …
- `data-lh-eticheta` = numele accesibil al elementului REAL (exact ca `eticheta` din referință; ex. `Font...` cu cele trei
  puncte, `Zoom Out (Ctrl -)`). Lipsă → se ia `aria-label`, apoi textul.
  **Când elementul are text pe ecran, eticheta declarată TREBUIE să fie chiar textul de pe ecran** (reparația 9): unul
  dintre rândurile lui vizibile, întreg, sau toate rândurile împreună — NU o parte dintr-un „RO (EN)” (reverificare
  6.b, 17.11.2026: „Inserare (Insert)” pe ecran ≠ „Insert”); la `FileTabButton` „File Tab” ~ „File”; pe bara de stare
  și pe bara de titlu și forma lungă a numelui („Page Number Page 1 of 1” ~ „Page 1 of 1”). Altfel e o diferență
  (`eticheta_declarata`, §5) — exact riscul comutatorului RO: atributul „Insert”, ecranul „Inserare”. Galeriile cu
  previzualizare („AaBbCcDd” deasupra lui „Normal”) pun numele într-un rând (bloc) separat de previzualizare.
- `data-lh-id-mso` = idMso-ul (AutomationId) când referința îl are (ex. `Bold`, `FontDialog`, `TabHome`).
- `data-lh-nesimulat` (fără valoare) pe o comandă AFIȘATĂ dar nesimulată (dă mesajul central standard, R12). Același
  atribut, pe un element care NU are `data-lh-tip`, marchează MESAJUL acela („În aplicația reală, X …; aici nu e
  simulată”, `api_biblioteca.md` §3); O8 îl recunoaște după atribut.
- Ierarhia = imbricarea în DOM a elementelor cu `data-lh-tip` (strămoșul cel mai apropiat cu `data-lh-tip` e părintele).
  Ordinea fraților = ordinea în DOM = ordinea din referință.
- Panglica: `panglica.<TabId>` › `Group` (numele filei) › `Group` (grupurile: Clipboard, Font…) › comenzi. Comenzile din
  galerii (`ListItem`) și controalele compuse (o `SplitButton` cu săgeata ei) se marchează ca în referință; oracolele
  „turtesc” la fel ambele arbori: o comandă cu nume nevid e o unitate (copiii ei nu se mai citesc), un container
  (`Group`/`Pane`/`DataGrid`/nume gol) se străbate. Numele vizibil al unui grup = textul lui propriu (legenda de sub el),
  fără textul comenzilor din el. **Fiecare grup al panglicii își arată legenda pe ecran** (în Office numele grupului se
  vede mereu sub el; toate grupurile referinței au nume): un grup desenat fără niciun rând de text propriu vizibil —
  numele doar în `aria-label` / `data-lh-eticheta`, legenda scoasă sau ascunsă — e diferența `grup_fara_legenda` la O2
  și la O3 (reverificare 6.a, 17.11.2026).
- Ce NU e în aplicația reală (ex. tastele pentru telefon) stă în afara suprafețelor sau într-o suprafață proprie
  `extra.<nume>`, care se numără ca diferență (abatere de aprobat de Vasile, `de_aprobat.md`).

## 4. Cum deschide oracolul ce nu e vizibil (gesturi, nu declarații)
1. File-le panglicii: clic pe nodul `TabItem` din `file_panglicii` → se citește `panglica.<id>`.
2. Backstage: clic pe nodul cu `data-lh-id-mso="FileTabButton"` → `backstage.nav`; clic pe fiecare `ListItem` al lui →
   `backstage.<eticheta>`.
3. Dialogurile: idMso-ul din `deschis_prin` al referinței (ex. `ExecuteMso('FontDialog')`) → clic pe controlul cu acel
   `data-lh-id-mso` (căutat pe toate filele) → se citește `dialog.<idMso>`; filele dialogului (nodurile `TabItem` din el)
   se apasă pe rând → `dialog.<idMso>#<eticheta filei>`.
4. Meniurile de clic dreapta: evenimentul `contextmenu` (clic dreapta) pe elementul cu `data-lh-tinta="<tinta>"`
   (`text`, `text_selectat`, `celula`, `antet_coloana`, `antet_rand`, `fila_foii`, `diapozitiv`, `miniatura`) →
   `meniu_contextual.<tinta>`.
5. Filele contextuale: clic pe `data-lh-tinta="tabel|imagine|forma|grafic"` → `panglica_context.*` apare în `file_panglicii`.
6. Plasă (doar dacă gestul nu există încă): `window.LHAplicatii.deschideSuprafata("<cheie>")` (Promise sau sincron).
   Conținutul citit e tot DOM-ul randat, comparat cu referința reală.
Între gesturi oracolul reîncarcă exercițiul (`JocMotor.test.exercitiu(k)`), deci gesturile nu trebuie „anulate”.

## 5. Ce se compară (structura_lib.py)
- **Eticheta comparată = TEXTUL VIZIBIL** (reparația 9). Textul vizibil = textul nodurilor-text grupat pe blocuri, doar
  cel care se vede: fără elemente ascunse, de 1-3 px tăiate (tiparul „sr-only”), cu `clip`, cu opacitate 0, font sub
  6 px, culoare transparentă sau în afara paginii; scurtătura scrisă la capăt („Copy Ctrl+C”) nu face parte din nume;
  un rând cu mai puțin de 2 litere (B, ✕, ¶→, x²) e o pictogramă. Reguli:
  - element cu text vizibil → se compară textul vizibil ÎNTREG (fiecare rând sau toate împreună, FĂRĂ variantele
    `RO (EN)` / `EN (RO)`, `X · Y`, `X: Y` — acelea sunt doar pentru citatele din lecții, O7; reverificare 6.b,
    17.11.2026); `aria-label` și `title` nu mai contează; `data-lh-eticheta` e acceptată doar dacă e pe ecran (§3),
    altfel diferența `eticheta_declarata`;
  - buton doar cu pictogramă (fără text vizibil cu ≥ 2 litere) → `data-lh-eticheta`, apoi `aria-label` / `title` (ca înainte);
  - control care arată o valoare (`ComboBox`, `Edit`, `Spinner`, `Slider`, `<input>`, `<select>`, `<textarea>`: caseta
    fontului „Calibri”, mărimea „11”) → numele declarat, ca înainte.
- Unitățile: frunzele „comandă” după regula de turtire (§3), cu eticheta normalizată: litere mici, fără `...`/`…`/`▾`/`:`
  la final, fără sufixul de scurtătură `(Ctrl …)`, cratima neîntreruptibilă = `-`, spațiile strânse, fără `¶ ` în față.
  Potrivirea: întâi `id_mso` (când îl au ambele), apoi eticheta (textul vizibil întreg: un rând sau toate împreună);
  pe bara de stare se acceptă și numele fără valoare (`Page Number Page 1 of 1` ~ `Page 1 of 1`).
- Diferențele: `lipsa` (în referință, nu în pagină), `in_plus` (în pagină, nu în referință), `ordine` (potrivite − cel mai
  lung subșir comun), `suprafata_lipsa` (= toate unitățile ei lipsă + 1), `eticheta` (același idMso, alt nume PE ECRAN —
  la O2 și la O3), `eticheta_declarata` (data-lh-eticheta ≠ textul de pe ecran — la O2 și la O3), `grup_fara_legenda`
  (grupul panglicii desenat fără legenda vizibilă, §3 — la O2 și la O3); doar la O3: `tip`
  (familia ControlType diferă; un buton vechi cu `▾` = `MenuItem` sau `SplitButton`), `grupare` (comanda e în alt grup
  decât în referință; înlocuiește perechea lipsa+in_plus), `pozitie` (deplasarea față de colțul grupului/suprafeței
  diferă cu > 8 px pe x sau pe y — TOLERANȚA, la fereastra 1366×768).
- O2 = pe pagină: suprafețele „mereu la vedere” + filele + Backstage › nav + meniurile de clic dreapta; suma pe pagini.
  O3 = pe suprafață: reuniunea diferențelor din toate paginile care o desenează, socotită în PUNCTE pe comandă
  (reparația f): o comandă desenată = câte feluri de diferență are (`ordine`, `tip`, `eticheta`, `pozitie`,
  `eticheta_declarata`, cel mult 5); în alt grup (`grupare`) = cel puțin 6; LIPSĂ = cel puțin 7 — deci o comandă deja
  greșită care devine lipsă crește numărul, nu se anulează (−1 +1). Restul (`in_plus`, felurile de grup / suprafață) = 1.
  În plus + 1 pentru fiecare suprafață din `suprafete.json` fără referință (sau care nu există în aplicația reală).

## 6. Ce înseamnă „interfață de aplicație în afara bibliotecii” (O1, partea DOM)
Elemente în containerul exercițiului (`#body`) sau oriunde în pagină, care NU sunt sub o rădăcină ÎNREGISTRATĂ (§1) și se
potrivesc cu: `[role=tablist]`, `[role=tab]`, `[role=toolbar]`, `[role=menubar]`, `[role=menu]`, `[role=menuitem]`,
`[role=group][aria-label]`, `[role=dialog]`, `[role=tree]`, `[role=treeitem]`, `[role=grid]`, `[role=application]`,
`[data-nesim]`, `.pg`, `.rb`, `canvas` și ORICE control interactiv (`button`, `input`, `select`, `textarea`, `[role=button]`,
`[contenteditable]`, `[tabindex]`≠-1) din `#body` — într-un exercițiu simulat `#body` conține doar simulatorul (butoanele
motorului: Verifică, pașii, stau în afara lui); plus orice `[data-lh-aplicatie]` NEÎNREGISTRAT (el însuși și tot ce e
în el) — plus partea statică: pagina încarcă un simulator vechi (`lectii/_sim/<perimetru>.js`,
`jocuri/_motor/ui-panglica.js`, `panglica-*.js`, `tip-excel.js`, `tip-foaie.js`), își definește simulatorul în pagină,
scrie singură atributul `data-lh-aplicatie` (în HTML sau în scriptul ei: `data-lh-aplicatie=`, `setAttribute('data-lh-aplicatie'`,
`dataset.lhAplicatie`) sau își definește biblioteca / registrul (`LH.aplicatii =`, `LHAplicatii =`, `radacini`).
Deci: într-un exercițiu mutat, tot ce se apasă în `#body` stă sub rădăcina bibliotecii (inclusiv tastele pentru telefon);
motorul (`jocuri/_motor/motor.js`) nu pune controale în `#body`; indiciile lecției vin prin API-ul bibliotecii (R7).

## 7. Ce înseamnă „comandă moartă” (O8)
O comandă CITATĂ de lecție (numele ei apare în citatele paginii, ca la O7 — drumul predat al lecției), apăsată pe starea
de pornire a exercițiului, e moartă dacă (a) nu schimbă nimic; (b) singura schimbare e mesajul „aici nu e simulată”
(marcat `data-lh-nesimulat` pe un element fără `data-lh-tip`, sau unul dintre tiparele simulatoarelor vechi din
`structura_lib.TIPARE_NESIMULAT`); (c) e GRI pe ecran (`disabled`, `aria-disabled="true"`, clasă gri/dezactivat), dar
referința reală n-o arată indisponibilă (`activ` ≠ false) — o aplicație fără referință nu poate dovedi că e gri, deci
acolo gri = moartă. „Structura” comparată înainte/după = DOM-ul aplicației fără blocurile-mesaj + ferestrele de dialog +
meniurile / listele deschise în afara rădăcinii (`[role=menu|listbox|menubar]`) + valorile câmpurilor; mesajele se
compară separat, ca text. Starea de pornire trebuie să stea pe loc (două instantanee la rând egale, cel mult ~0,85 s),
altfel apăsarea e „instabilă” (neconcludentă).
