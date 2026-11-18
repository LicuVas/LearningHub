# Criticul rece, runda 3, etapa B (Word): cele 5 GRAV din runda 2 + unghiul aspect

**Cine:** critic rece, fără notele constructorului. N-am citit `runde/3/diferente.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `de_verificat.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`. Din `runde/3/` am citit doar `gata_pentru_critic.md`. N-am rulat `proba_grav.py`.

**Ce am rulat:**
- Server static legat de `127.0.0.1`, pe port liber, servind worktree-ul. Playwright Chromium headless. `ctx.route("**/*")` abandonează tot ce nu e 127.0.0.1/localhost.
- Pagina: `aplicatii/poligon.html`, apoi `LH.aplicatii.deschide('word', {continut, profil, focus:true})`.
- Gesturi reale: `page.keyboard`, `page.mouse`, `page.touchscreen` (context cu atingere, 390 px). Tastatura de telefon care compune: CDP `Input.imeSetComposition` / `Input.insertText`.
- După fiecare gest am citit:
  - `stare()`;
  - ecranul (paragrafele, bara de titlu, caseta „Save as type”);
  - focusul;
  - mesajele `[data-lh-nesimulat]`;
  - `window.__lhAplicatieEv`;
  - `asistent.pas()`.
- Pentru aspect am folosit `getBoundingClientRect` / `getComputedStyle` și capturi de ecran, comparate cu `uia_word.json` (extras cu Python).
- **Office real n-am pornit.** Scripturile și ieșirile sunt în `runde/3/critic_probe/`:
  - scripturile: `h.py` (ajutoare), `pa.py` (partea A), `pb.py` și `pd.py` (aspect), `pc.py` (telefon / laptop 125 %), `e0.py`, `ref_dump.py` (referința);
  - ieșirile: `ra.json`, `rb.json`, `rc.json`, `rd.json`, `ref_titlu_saveas.txt`, `*.png`.

**Diff-ul rundei (necomis):** `aplicatii/aplicatii.js` și `aplicatii/word.js`, cu 124 de linii adăugate și 19 scoase. Ce s-a schimbat:
- **evenimente:** un câmp nou, `activat` (`aplicatii.js:204`), pe care asistentul îl acceptă (`aplicatii.js:530`);
- **compunerea pe telefon:** cuvântul pleacă imediat (`aplicatii.js:404`), iar o atingere oriunde încheie compunerea (`aplicatii.js:411-425`);
- **salvarea:**
  - `salveaza()` cheamă `actualizeazaPanglica()`;
  - `stare()` are cheile noi `folder_fisier` și `fisiere_salvate` (`word.js:583`);
  - lista „Save as type” are 2 rânduri (`word.js:1052`, `:1316`);
- **taste și casete:**
  - Ctrl+O deschide Backstage › Open (`word.js:1470`);
  - ▾-ul casetei Font Size și Alt+↓ dau mesajul central (`word.js:1138`, `:1407`).

---

## A. Cele 5 GRAV din runda 2

### Regres GRAV 1 (telefonul dublează literele): rămâne ÎNCHIS
- **`ra.json › g1a`:** compunere „a”, „an”, „ana” + `insertText` „ana” + „ ”, apoi „are”. Rezultatul e `text ["Ana are"]`, cu 3 evenimente `tastare|scriere`.
- **`g1b`:** litere corectate în timpul compunerii („anq” → „ana”, „arw” → „are”), apoi „mere.”, „el”. Rezultatul e `["Ana are mere. El "]`.
- **`g1_touch`:** în contextul cu atingere, 390 px, iese tot `["Ana are"]`.
- Schimbarea rundei (`trimite` imediat la `compositionend`, `aplicatii.js:404`) n-a adus dubluri.

### GRAV 3 (săgeata ▾ a casetei Font Size): **DESCHIS**
**Ce am făcut și ce am văzut:**
- **▾ (`g3b_sageata_word365` și `_word2007`):** am selectat „are” și am dat clic pe ▾ (`meniu_derulant:Home/Font/Font Size`).
  - Apare mesajul „În aplicația reală, „Font Size ▾” funcționează; aici nu e simulată.”, cu evenimentul `meniu_derulant|nesimulat`.
  - Nu se deschide nicio listă (`meniu: []`), iar mărimea rămâne 11.
  - Față de runda 2 s-a reparat atât: ▾ nu mai tace.
- **Alt+↓ în casetă (`g3_altjos_*`):** același mesaj (`alt_sageti|nesimulat`).
- **Drumul pe care îl face un începător, care nu știe de Ctrl+A (`g3f_clic_20_enter_*`):**
  - am selectat titlul, am dat un clic real în casetă, am tastat `20` și Enter;
  - după clic, caseta are `["11", 2, 2]`, adică cursorul e la capăt și nimic nu e selectat;
  - rezultatul: caseta arată `"1120"`, iar `formatare_pe_caractere` dă `marime: 1120` pe titlu. La fel pe ambele profiluri.

**Lecția:** `lectii/vii/m2-l10/index.html`:
- `:152`: „alege <b>20</b> în caseta de mărime (<b>Font Size</b>)”, cu verificarea „caseta de mărime arată 20”;
- `:238`: „alege <b>16</b> în caseta de mărime”;
- `:242`: „alege 16 în a doua casetă a grupului Font”.

**Referința:**
- Comentariul de la `word.js:1136-1137` spune că „rândurile listei NU sunt în referință”. Referința are însă lista mărimilor: `uia_word.json › dialog.FontDialog` › List `[775,210,71,44]` cu ListItem `8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72`.
- `panglica.TabHome`: ComboBox „Font Size” `[232,91,43,24]`, cu butonul lui de deschidere.

**Contractul:**
- `api_biblioteca.md` §3: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate”.
- R12: „Orice comandă folosită de o lecție sau citată în ea funcționează”.

**Judecata (R12, „nu tace”):**
- Mesajul ajunge pentru o comandă din afara lecției. Aici e drumul exercițiului, iar elevul nu-l poate duce la capăt așa cum scrie lecția: „alege 20” prin ▾ se oprește în mesaj, iar „scrie 20” după un clic dă 1120.
- Merg doar Ctrl+A + 20 + Enter (`g3a_ctrla_14_*`: `marime 14` pe „are”) și Alt, H, F, S. Lecția nu le cere pe niciunul.
- Faptul că un clic în casetă nu selectează valoarea e, singur, [FARA_REFERINTA]. GRAV-ul stă pe ▾.

### GRAV N1 (bara de titlu după salvare): **ÎNCHIS**
- **Pe toate cele 4 drumuri (`ra.json › n1_f12_enter`, `n1_f12_clic`, `n1_ctrls_enter`, `n1_ctrls_clic`):** documentul era `["Poezia mea","Toamna vine."]`, iar numele `Marin_Ioana_7B_poezie`.
  - Imediat după gest (citit în același pas, fără pauză), titlul e `"Marin_Ioana_7B_poezie  -  Word"`, cu `nume: "Marin_Ioana_7B_poezie.docx"` și `folder: "Documente"`.
  - Nu mai trebuie apăsată nicio tastă ca titlul să se schimbe.
- **Cauza reparației:** `salveaza()` cheamă `actualizeazaPanglica()`. Titlul se rescrie la `word.js:884`.
- **Rest de aspect:** butonul titlului e tăiat cu „…” (captura `n1_titlu.png`). Vezi [FARA_REFERINTA] (titlul tăiat).

### GRAV N2 (Enter în File name = Save, văzut de asistent): **ÎNCHIS**
- **`ra.json › n2_f12` și `n2_ctrls`:** asistentul are pașii `dialog_salvare:Save` → `mso:Bold`. Am apăsat F12 (sau Ctrl+S), Ctrl+A, `Popescu_Ana_7A_orar`, Enter.
  - Evenimentul e `tasta_enter|salvare|camp:nume_fisier`, cu `activat: dialog_salvare:Save`, iar `pas()` = **1**.
  - Profesorul vede acum „salvare” (acțiunea), cu ținta = focusul din momentul tastei (§4).
- **Cauza reparației:**
  - Enter în fereastră e tratat în `I.la.tasta` (`word.js:1408-1414`, `:1419`);
  - ținta e luată înainte de gest (`aplicatii.js`, `t0`);
  - asistentul acceptă `ev.activat` (`aplicatii.js:530`).
- Câmpul `activat` nu e scris în §4 / §6.3. Vezi MINOR.

### GRAV N3 (cuvântul aflat în compunere pe telefon): **ÎNCHIS** (cu limita CDP)
- **(a) `n3a_verifica`:** documentul `["Numele: "]`, compunere „I”, „Io”, „Ion”, fără confirmare. Apoi `touchscreen.tap` pe un buton „Verifică” din afara aplicației, care citește `stare().text` la `click`.
  - La `click`, starea e `["Numele: Ion"]`.
  - A doua oară la rând („ Pop”, `n3a2`), la `click` e `["Numele: Ion Pop"]`.
- **(b) `n3b_atingere_rand2`:** documentul `["Ana are ", "Doi"]`, compunere „mere” la capătul rândului 1, apoi o atingere în rândul 2.
  - Rezultatul e `["Ana are mere", "Doi"]`, cu evenimentul `clic|pozitionare|text:2`.
  - Apoi „X” dă `"DoiX"` (`n3b_apoi_X`), iar o compunere nouă, „pere”, dă `"DoiXpere"` (`n3b2`). Cuvântul nu se mai mută.
- **(c) `n3c_atingere_bold`:** o atingere pe B în timpul compunerii dă `["Ana are mere"]`. Cuvântul a rămas pe loc, iar B a primit `format_la_scriere`.
- **Cauza reparației:** `aplicatii.js:404` (trimite la `compositionend`), `:411-425` (o atingere încheie compunerea), `:298` (ia elementul nou din punctul atins).
- **Limita probei (aceeași ca în rundele 1-2):** IME-ul e emulat prin CDP pe Chromium. Ce ar lămuri-o: un telefon Android cu Gboard, „Ion” fără spațiu, apoi atingerea unui buton care citește `stare()`.

### GRAV N4 (drumurile lecției m1-l03): **DESCHIS** (reparat parțial)
**Ce s-a reparat (văzut):**
- **Ctrl+O** deschide Backstage › Open (`n4_ctrlo`: `ctrl_o|backstage`). Geometria e aceeași cu `uia_word.json › backstage.Open`, la 1 px (`rb.json › open_ref_vs_sim`: Text „Open” `[181,65,48,42]`, iar simularea `[182,66,48,42]`; Browse `[182,380,279,44]`, iar simularea `[183,381,279,44]`).
- **„Save as type” ▾** deschide o listă cu „Word Document (*.docx)” și „PDF (*.pdf)”. PDF + Save dă `fisiere_salvate: [{nume:"Orar.pdf", folder:"Documente", tip:"PDF (*.pdf)"}]`, iar documentul de lucru rămâne `Document1` (`n4_pdf_salvat`). Vezi însă GRAV A1: caseta nu arată alegerea.
- **`stare()`** are acum `folder_fisier` și `fisiere_salvate` (`n4_chei_stare`).

**Ce rămâne (gesturile mele):**
- **Ctrl+W:** „În aplicația reală, „Ctrl+W” funcționează; aici nu e simulată.” (`n4_ctrlw`, `ctrl_w|nesimulat`; tabelul `NESIM_TASTE`, `word.js:1399`).
- **✕ din bara de titlu:** „„Close” … aici nu e simulată” (`n4_x`, `clic|nesimulat|bara_titlu:Close`).
- **Recent din pagina Open** are 9 rânduri `[element de listă, nesalvat]`, desenate goale (`panglica.js:91`). Captura `n4_ctrlo.png`: lista e albă.
  - Clicul pe primul rând dă mesajul „În aplicația reală, „[element de listă, nesalvat]” funcționează; aici nu e simulată.” (`rb.json › open_recent_clic`). Elevul vede chiar eticheta-substitut a referinței.
  - **Browse** dă „„Browse” … aici nu e simulată” (`open_browse`). Documentul nu se poate redeschide pe niciun drum.
- **„Documente” nu se poate alege.** Panoul din stânga al ferestrei Save As e gol. Butonul „Documente” din bara de adrese nu are text (GRAV A2), iar clicul pe el dă „„Documente” … aici nu e simulată” (`n4_clic_documente_adresa`). Folderul e mereu „Documente” (`folderSalvare()`, `word.js:1022`).
- **Documentul nu poate porni cu nume și folder.** `deschide` primește la Word doar `{paragrafe, cursor, selectie, aliniere, tabel}` (`api_biblioteca.md` §7, `word.js:62-82`; `M.nume: 'Document1'` la `word.js:65`).
  - Cu `{nume:'Popescu_Ana_7A_orar', folder:'doc', salvat:true}` rămâne `Document1`, iar Ctrl+S deschide „Save this file” (`n4_doc_cu_nume`).
  - Exercițiile care pornesc dintr-un fișier salvat (`m1-l03:190`, `:213`: `docs:[{nume:'Popescu_Ana_7A_orar', folder:'doc', …}]`) nu pot porni. „Salvează-l în același fișier” cu Ctrl+S (`:189`) nu e posibil.
- **Conținutul fișierului salvat nu e în stare.** `fisiere_salvate` are doar `{nume, folder, tip}`. Verificările `fisier:{…, contine:'Marți: sport'}` (`m1-l03:191-192`, `:216`) n-au ce citi.
- **R8 (verdictele înghețate).** `referinte/verdicte_vechi.json › lectii/vii/m1-l03 › N1P2E1 › gresit1` (greșeala tipică `{folder:'desc', nume:'Orarul meu'}`, `m1-l03:131`) = „0 din 2 teste trecute”. Pe bibliotecă folderul nu se poate schimba, deci aceeași greșeală poate da cel mult „1 din 2”.

**Judecata (R12, „nu tace”):**
- Mesajul central e prezent pe Ctrl+W, ✕, Recent și Browse. Totuși exercițiul de la `m1-l03:212` („Închide documentul cu Ctrl+W … Redeschide-l cu Ctrl+O, din lista Recent”, cu verificările de la `:216-218`) nu se poate duce la capăt. Nici exercițiile de la `:127`, `:167` și `:189` nu se pot duce la capăt cum sunt scrise.
- `api_biblioteca.md` §3: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate.” Fereastra „Save your changes to this file?” și fereastra Open nu au referință în `uia_word.json`, iar R4 spune că „o suprafață fără referință contează ca diferență”. Lecția însă le cere.

---

## B. Unghiul aspect: constatări noi (de la cea mai puternică)

### GRAV A1: după „PDF (*.pdf)”, caseta „Save as type” arată tot „Word Document (*.docx)”, iar starea spune PDF
**Pași (`ra.json › n4_tip_lista`, `n4_dupa_pdf`):** documentul `["Orar","Marti: sport"]`, apoi F12, clic pe ▾-ul casetei „Save as type:”, apoi clic pe rândul „PDF (*.pdf)”.

**Pe poligon:**
- **Pe ecran:** caseta arată „Word Document (*.docx)” (captura `n4_dupa_pdf.png`; `combo_text_vizibil`: valoarea câmpului vizibil = `['Word Document (*.docx)']`).
- **În DOM:** textul „PDF (*.pdf)” a fost scris într-un nod `Text` de `0×0`, cu `display: none`.
- **În stare:** `stare().dialog_salvare.tip_propus = "PDF (*.pdf)"`, deci ecranul nu arată starea.
- **La Save** se face totuși `Orar.pdf` (`n4_pdf_salvat`).

**Word real:**
- `uia_word.json › dialog.FileSaveAs`: ComboBox „Save as type:” `[106,403,815,22]`, `valoare='Word Document (*.docx)'`. Caseta arată tipul ales, iar nodul ei `Text` e cel ascuns (`vizibil:False`, `[-1944,-17,…]`).
- Pagina Microsoft citată chiar în cod (`word.js:1048-1050`): „In the drop-down list, select PDF.”. După alegere, caseta arată PDF.

**Lecția:**
- `m1-l03:85` și `:192`: „la Save as type alege PDF (*.pdf) … Salvare (Save)”;
- `:183`: „Formatul îl alegi în lista Salvare cu tipul (Save as type)”.

**Efectul asupra elevului:** elevul alege PDF și vede că nu s-a schimbat nimic. Ori alege din nou și renunță, ori învață că alegerea „nu ține”. La laborator, caseta îi arată PDF.

**Cauza:** `alegeTip` (`word.js:1053-1058`) scrie în `[data-lh-tip="Text"]`, adică nodul ascuns, nu în `input`-ul pe care `panglica.js` îl desenează pentru ComboBox-ul fără Edit (`comboFaraEdit`).

**Introdus în runda asta** (codul e nou în diff).

### GRAV A2: fereastra Save As își desenează goale butoanele cu nume: locul „Documente” din bara de adrese și antetele coloanelor
**Pași (`e0.py`, `pb.py › saveas_ref_vs_sim`, captura `saveas_1366.png`):** F12, apoi am citit textul de pe ecran al fiecărui element, comparat cu referința (față de colțul ferestrei).

**Pe poligon:**
- **Geometria** e bună, la 1-2 px de referință. Lipsește însă textul:
  - SplitButton „Documente” `[187,39,83,34]` are `innerText ''`;
  - antetele „Nume” `[249,115,272,26]`, „Data modificării” `[521,115,144,26]`, „Tip” `[665,115,120,26]` și „Dimensiune” `[785,115,80,26]` au `innerText ''`;
  - „Detalii” are tot `innerText ''`.
- **În captură:** antetele sunt căsuțe goale, cu câte un „□” mic. Bara de adrese e goală între ↑ și cele două pătrate.
- **Cuvântul „Documente”** nu apare nicăieri pe ecranul ferestrei (`n4_documente_pe_ecran`: `innerText_are_Documente: false`).

**Word real (`uia_word.json › dialog.FileSaveAs`):**
- ToolBar **„Adresă: Documente”** › SplitButton **„Documente”** `[159,35,83,34]`. Lățimea de 83 px e cea a cuvântului, plus săgeata: e firimitura din bara de adrese, care arată folderul.
- Header › SplitButton **„Nume”** `[220,110,272,26]`, **„Data modificării”** `[492,110,144,26]`, **„Tip”** `[636,110,120,26]`, **„Dimensiune”** `[756,110,80,26]`. Fiecare are lângă el doar butonul de filtru, de 15 px, deci restul e eticheta coloanei.
- `api_biblioteca.md` §3: „`data-lh-eticheta` = textul de pe ecran când elementul are text vizibil”. Aici eticheta declarată („Documente”, „Nume”…) nu e pe ecran.

**Lecția:**
- `m1-l03:82`: „În stânga alege Documente (Documents)”;
- `:119`: „în stânga dai clic pe Documente”;
- `:127`, `:132`.

**Efectul asupra elevului:** fereastra nu arată nicăieri unde se salvează. Starea spune `folder_fisier: "Documente"`, dar ecranul nu. Elevul învață o fereastră Save As fără loc și fără coloane. La laborator, „Documente” scrie în bara de adrese.

**Cauza:**
- `panglica.js:229` (SplitButton-ul nu-și scrie singur numele);
- `panglica.js:303` (copilul scrie numele doar dacă butonul lui are ≥ 50 px, o regulă gândită pentru panglică);
- „Documente” n-are niciun copil în referință, deci nu primește text deloc.

**Separat de N4:** N4 e despre faptul că locul nu se poate alege. A2 e despre faptul că locul și coloanele nu se văd.

---

## [FARA_REFERINTA] (nu le număr GRAV)
- **Titlul după salvare e tăiat cu „…” la 134 px** (`rd.json`, `pd.py`):
  - butonul titlului are lățimea fixă din referință, 134 px, cât cere „Document1  -  Word”;
  - zona titlului are 464 px (`uia_word.json › bara_titlu`: TitleBar `[43,1,464,48]`), iar butonul `[43,1,134,48]`;
  - „Popescu_Ana_7A_orar  -  Word” cere 156 px. Se vede „Popescu_Ana_7A_orar  -  W…”;
  - „Constantinescu_Alexandra_7B_orar” cere 183 px doar pentru nume, deci **numele elevului e tăiat**. Lecția (`m1-l03:82`) spune: „sus, în bara de titlu, apare numele tău”.

  Referința are doar titlul „Document1”. Ce ar lămuri-o: dump-ul UIA al barei de titlu după Save As cu un nume de ~32 de caractere. Dacă butonul real se lărgește, e GRAV.
- **Lista „Save as type”:**
  - se deschide lipită de ▾ (`x 937`, lățime 163 px), nu sub casetă (caseta e la `x 135`, cu lățimea 815 px). Iese peste marginea ferestrei: lista se termină la 1100 px, fereastra la 961 px (`n4_tip_lista`, `n4_tip_lista.png`; `meniuLa`, `word.js:923`);
  - are doar 2 rânduri. Greșeala tipică a lecției, `tip:'rtf'` (`m1-l03:194`), nu se poate face.

  Referința nu are lista deschisă. Ce ar lămuri-o: dump-ul UIA al listei „Save as type” deschise.
- **Pagina Backstage › Open:** titlul „Open” e scris cu 12 px, într-o cutie de `48×42` (referința: Text „Open” `[181,65,48,42]`). La 12 px, „Open” are ~28 px. Lățimea de 48 px din referință arată un font mai mare, de ~20 px. Referința nu dă fontul.
- **„Save this file”** are geometria declarată inventată (`word.js:24-31`): fără buton Cancel, cu „Location” fără ▾, cu numele propus cu „.docx” în casetă (`rb.json › save_this_file`, `save_this_file.png`). Nu există referință.
- **Fereastra Save As:**
  - în colțul din stânga al barei de titlu e desenat un „?”, pe elementul „Sistem” (meniul ferestrei, `[-20,4,22,22]`, `Alt+Spațiu`). Butonul de ajutor adevărat, „Aj&utor” (`HelpButton`, `[888,82,29,26]`), e un pătrat gol (`panglica.js:239`);
  - Înapoi, Înainte și „Locații recente” sunt pătrate goale.

  Referința nu are pictograme.
- **Clicul în caseta Font Size nu-i selectează valoarea** (`g3f_dupa_clic_*`: `["11",2,2]`). „20” devine „1120” (rămas din runda 2).

## MINOR
- **Câmpul nou `activat` nu e în schema §4, iar asistentul îl acceptă ca pas făcut (`aplicatii.js:530`).** §6.3 spune: „pasul e făcut când vine un eveniment … cu `tinta` = ținta canonică … sau `asteapta(ev)`”. Abaterea e rezonabilă (Enter = butonul implicit), dar trebuie scrisă în contract. Altfel, o lecție care ascultă `tinta === 'dialog_salvare:Save'` cu `asculta` nu vede salvarea cu Enter.
- **Enter cu numele gol avansează asistentul** (`n2_nume_gol`: `tasta_enter|fara_efect|…|activat=dialog_salvare:Save`, `pas()` = 1). Fereastra Save As rămâne deschisă și nu se salvează nimic. Clicul pe Save cu numele gol se poartă la fel, deci e consecvent, dar bula „Apasă B” apare cât fereastra e încă deschisă.
- **Mesajul central citează eticheta-substitut** „[element de listă, nesalvat]” (`open_recent_clic`). §3 recomandă ca valoarea să fie „eticheta comenzii”.

## Ce a trecut (văzut pe ecran și în `stare()`)
- **Regresul GRAV 1:** pe desktop și pe telefon, fără dubluri.
- **N1:** titlul se schimbă imediat, pe 4 drumuri.
- **N2:** evenimentul spune „salvare” și asistentul trece de pasul Save, pe F12 și pe Ctrl+S.
- **N3:**
  - cuvântul aflat în compunere ajunge în stare înainte de `click`;
  - nu se mută la atingerea altui rând;
  - nu se pierde la atingerea lui B;
  - compunerea continuă normal după.
- **Font Size:** Ctrl+A + 14 + Enter pe ambele profiluri (`marime 14`). ▾ și Alt+↓ nu mai tac (mesajul are `role="status"`, jos la mijloc, `[490,697,387,36]`).
- **Geometria, față de referință:**
  - Save As: ±1-2 px față de colțul ferestrei;
  - Backstage › Open: ±1 px.
- **Pe ecrane mici:** pe telefon (390 px) și pe laptop la 125 % (1093×526), Save din Save As și din „Save this file” se poate atinge, pentru că stratul ferestrei derulează orizontal. Atingerea sau clicul real salvează (`rc.json`).
- **PDF:** face o copie `.pdf` în `fisiere_salvate`, iar documentul deschis rămâne cel de lucru. Asta se potrivește cu `m1-l03:196`.

GRAV_VECHI_DESCHISE: 2
GRAV: 4
