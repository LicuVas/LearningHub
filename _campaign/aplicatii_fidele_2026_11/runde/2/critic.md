# Criticul rece, runda 2, etapa B (Word): închiderea GRAV-urilor vechi + unghiul stare_finala_erori

**Cine:** critic rece, fără notele constructorilor (n-am citit `runde/2/*.md`, `runde/1/*.md` în afară de `runde/1/critic.md`, `de_verificat.md`, `de_aprobat.md`).
**Ce am rulat:** server static legat de `127.0.0.1`, port liber; Playwright Chromium headless; `ctx.route("**/*")` abandonează tot ce nu e 127.0.0.1/localhost. Pagina `aplicatii/poligon.html`, apoi `LH.aplicatii.deschide('word', {continut, profil, focus:true})`. Gesturi reale: `page.keyboard`, `page.mouse`, `page.touchscreen` (context cu touch, 390 px). Tastatura de telefon care compune: CDP `Input.imeSetComposition` / `Input.insertText`. După fiecare gest am citit `stare()`, ecranul (`[data-lh-zona] [data-lh-tinta="text"]`, bara de titlu), focusul, mesajele `[data-lh-nesimulat]`, straturile deschise și `window.__lhAplicatieEv`. Scripturile și ieșirile sunt în scratchpad-ul sesiunii, sub `%TEMP%`: `h.py`, `pa.py`…`pe.py`, `com.py`, `ra.json`…`re.json`.
**Word real:** referințele (`uia_word.json` extras cu Python, `scenarii_real/word-*.json`) și o verificare **invizibilă prin COM**: DispatchEx, Visible=False, DisplayAlerts=0, doar pe modelul documentului. Instanța mea (PID 31828) n-a ieșit singură după `Quit` și am închis-o doar pe ea. Fișierul de probă din `%TEMP%` l-am șters.
**Diff-ul rundei:** `git diff -- aplicatii` = aplicatii.css +3, aplicatii.js 54 linii, word.js 179 linii.

---

## A. Cele 6 GRAV din runda 1

### GRAV 1 (telefonul dublează literele): **ÎNCHIS**
- **Proba exactă (`ra.json › g1a`):** compunere „a”, „an”, „ana” + `insertText` „ana” + „ ” + compunere „are” + `insertText`. Rezultatul: `stare().text = ["Ana are"]`, ecranul `["Ana are"]`, 3 evenimente `tastare/scriere`. În runda 1 ieșea `"aananaana aarareare"`.
- **Proba mai grea (`g1b`):** litere șterse și corectate în timpul compunerii („anq” → „an” → „ana”, „arw” corectat de tastatură în „are”), apoi „mere.”, spațiu, „el”. Rezultatul: `["Ana are mere. El "]`.
- **Ce a schimbat constructorul:** `aplicatii.js:376-382`. Cât compune tastatura, caseta nu se golește, iar cuvântul pleacă o singură dată, la `compositionend`.
- O problemă nouă de compunere (cuvântul aflat încă în compunere) e la B, GRAV N3.

### GRAV 2 (tastele ajung în document cât sunt deschise Backstage sau o fereastră): **ÎNCHIS**
- **(a) Alt, F, A (`g2a`):** se deschide pagina Save As din Backstage, iar documentul rămâne `["Ana are mere"]`. Focusul trece pe `DIV.lh-ap-strat-backstage`. După `xyz`, Backspace și un `insertText` „q” documentul e tot `["Ana are mere"]`, cu evenimentele `tastare/fara_efect`. Literele din Backstage se văd și ele: după Alt, F apar `H N O I S A K P Z E C D T`, iar după Alt, F, A apar `Y1 Y2 C A O Y4` (`re.json › k`).
- **(b) Clic pe File, apoi xyz, Backspace, Delete, Enter (`g2b`):** documentul nu se schimbă. Esc închide Backstage (`tasta_esc/inapoi`), iar „W” intră apoi în document: `["Ana are mereW"]`.
- **(c) Ctrl+D (`g2c`):** focusul trece pe fereastra Font (`dialog.FontDialog`). După qw, Backspace, Tab, k, Delete și o compunere „x” documentul e tot `["Ana are mere"]`. Esc închide fereastra, iar „Z” intră în document.
- **Cauza reparației:** paza din `word.js:1421-1432` (`if (dialog || backstage) return 'fara_efect'`) și `focusStrat`, `word.js:943-949`.
- **Rest MINOR:** Tab în fereastra Font duce focusul în caseta ascunsă a documentului (`TEXTAREA … Document1` cât fereastra e încă deschisă). Paza împiedică schimbarea documentului, dar următoarele taste nu ajung în câmpurile ferestrei.

### GRAV 3 (mărimea fontului nu se poate schimba): **DESCHIS**
- **(a) reparat (`g3a`):** selectez „are”, clic în casetă, Ctrl+A, `14`, Enter. Rezultatul: `{"text":"are","marime":14}`, iar focusul revine în `TEXTAREA … Document1`. „Q” tastat apoi înlocuiește selecția: `["Ana Q mere"]`, ca în Word.
- **(c) reparat (`g3c`):** Alt, H, F, S pune focusul în casetă, cu valoarea selectată. `14` și Enter dau `marime 14` pe „are”.
- **(b) a devenit MAI RĂU (`g3b`):** clicul pe ▾-ul casetei (ținta `meniu_derulant:Home/Font/Font Size`) emite `meniu_derulant/camp/…`. Nu se deschide nicio listă (`meniu_deschis: []`), nu apare niciun mesaj (`msg: []`), iar focusul rămâne în document. În runda 1 apărea măcar mesajul standard. La fel, Alt+↓ în casetă nu face nimic (`rb.json › f2`).
- **Contractul:** R12 cere că o comandă afișată și nesimulată „dă mesajul central standard …, nu tace”. `api_biblioteca.md` §3 spune: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate”.
- **Drumul lecției:** `lectii/vii/m2-l10/index.html:152` („alege <b>20</b> în caseta de mărime”), `:238` și `:242` („alege 16 în a doua casetă a grupului Font”). Pentru un începător, „alege” înseamnă ▾ și un rând din listă.
- **Cauza:**
  - `word.js:1125-1131`: `idDe` dă pentru butonul „Open” id-ul părintelui, `FontSize`.
  - `word.js:1102`: `CMD.FontSize(elx)` caută `elx.querySelector('input')`, care pe ▾ e `null`. Funcția întoarce `'camp'` fără niciun efect.

### GRAV 4 (Ctrl+S pe un document nou dădea „aici nu e simulată”): **ÎNCHIS**
- **Proba (`g4a`):** Ctrl+S deschide `dialog.SaveThisFile`, iar `dialog_salvare` = `{"titlu":"Save this file","nume_propus":"Poezie.docx"}`. Ctrl+A, `Marin_Ioana_7B_poezie`, Enter dau `nume_fisier: "Marin_Ioana_7B_poezie.docx"`. Un al doilea Ctrl+S salvează fără fereastră.
- **Proba mai grea (`g4b`):** Ctrl+S, Esc (anulare), Ctrl+S iar, apoi clic cu mouse-ul pe Save. Rezultatul: `"Tema.docx"`. Pe profilul word2007 (`g4c`), Ctrl+S deschide Save As.
- **Cauza reparației:** `word.js:1408`.
- **Rămâne pe R4/R5:** suprafața „Save this file” nu are referință în `uia_word.json`, iar geometria ei e inventată (comentariul de la `word.js:25-31`). Asta o numără oracolele, până la aprobare, nu eu.
- Pe același drum, bara de titlu nu se actualizează după salvare. Vezi B, GRAV N1.

### GRAV 5 (tastele de acces fabricau un „dublu clic”; indiciul apărea după o singură greșeală): **ÎNCHIS**
- **Proba exactă (`g5a`):** asistentul are pașii Bold → Italic, cu `dupaGreseli:2`. Alt, H, 1 la 60 ms, apoi un clic real în pagină. Evenimentele sunt `tasta_acces/arata_taste_acces`, `tasta_acces/fila/fila:Home`, `tasta_acces/aldin/panglica:Home/Font/Bold`, `clic/pozitionare/document`. Niciun `dublu_clic`, iar după o singură greșeală nu apare niciun indiciu (`[]`).
- **Proba mai grea (`g5b`):** Alt, H, A, C de două ori la rând, la 40 ms între taste. Tot niciun `dublu_clic`.
- **Cauza reparației:** `aplicatii.js:400-409` (`activeazaTasta` fără MouseEvent sintetic). Tastele emit acum evenimente de tastă (`tasta_acces`), nu „clic”.

### GRAV 6 (fără majuscula automată pe telefon): **ÎNCHIS**
- **Proba exactă (`g6a`):** `insertText` pe bucăți: „ana”, „ ”, „are”, „ ”, „mere.”, „ ”, „el”, „ ”. Rezultatul: `["Ana are mere. El "]`.
- **Proba mai grea (`g6b`):** totul într-o singură bucată, apoi Enter, „ion”, Enter. Rezultatul: `["Ana are mere. El are pere. ", "Ion", ""]`. Referința `scenarii_real/word-tastare-majuscula-automata.json` dă `"Ana are mere. El are pere."`.
- **Cauza reparației:** `word.js:1421-1426`.

---

## B. Unghiul stare_finala_erori: constatări noi (de la cea mai puternică)

### GRAV N1: după salvare, bara de titlu arată tot „Document1 - Word”, deși fișierul s-a salvat (pe toate cele 4 drumuri)
- **Pași (`rb.json › s1…s4`):** documentul `["Poezia mea","Toamna vine."]`. Am încercat F12 + Enter, F12 + clic pe Save, Ctrl+S + Enter și Ctrl+S + clic pe Save, de fiecare dată cu numele `Marin_Ioana_7B_poezie`.
- **Pe poligon, pe toate cele 4 drumuri:**
  - imediat după salvare și încă 1,5 s mai târziu, bara de titlu arată `"Document1 - Word"`;
  - în același timp, `stare().nume_fisier = "Marin_Ioana_7B_poezie.docx"`;
  - titlul devine `"Marin_Ioana_7B_poezie - Word"` abia după ce elevul mai apasă o tastă (`titlu_dupa_tasta_x`). Pe Save this file + Enter am verificat la fel (`re.json › s`): `titlu ["Document1  -  Word"]`, cu `nume` salvat.
- **Word real:**
  - `uia_word.json › suprafete.bara_titlu`: TitleBar › Button `"Document1  -  Word"`, adică titlul arată numele documentului;
  - `scenarii_real/word-salvare-ca-f12.json`: după salvare, numele documentului devine `"Tema mea.docx"`;
  - proba mea COM (`com.py`): `ActiveWindow.Caption` trece din `"Document1"` în `"critic2_tema_mea.docx"` imediat după `SaveAs2`;
  - simulatorul are chiar el regula, la `word.js:879`.
- **Lecția:**
  - `lectii/vii/m1-l03/index.html:133`: „De aceea sus scrie acum Popescu_Ana_7A_orar, nu Document1.”;
  - `:146`, verificarea „Sus scrie Marin_Ioana_7B_poezie”.
- **Efectul asupra elevului:** elevul care a salvat corect vede „Document1”, crede că n-a mers și salvează din nou sau se blochează. Textul lecției devine fals pe simulator (R11), iar ecranul nu arată starea (§3, „ecranul = starea”).
- **Cauza:**
  - `salveaza()` (`word.js:1018-1027`) nu cheamă `actualizeaza()`. Titlul se rescrie doar în `actualizeazaPanglica` (`word.js:876-883`).
  - Pe drumul cu Enter, `I.la.tasta` iese devreme, pe ramura `inCamp` (`word.js:1354-1357`).
  - Pe drumul cu clic, `I.la.clic` întoarce direct `salveaza()` (`word.js:1272`).

### GRAV N2: salvarea cu Enter e raportată ca „tasta_enter în document”, deci asistentul nu vede pasul Save
- **Pași (`rc.json › a1`):** asistentul are pașii `dialog_salvare:Save` → `mso:Bold`. F12, Ctrl+A, `Popescu_Ana_7A_orar`, Enter.
- **Pe poligon:**
  - fișierul se salvează (`nume_fisier: "Popescu_Ana_7A_orar.docx"`);
  - evenimentul gestului e `tasta_enter/tasta_enter/document`;
  - `pas()` rămâne **0** după salvare și după un clic. Bula „Apasă Save” stă pe `dialog_salvare:Save`, iar fereastra aceea s-a închis.
  - Același eveniment iese pe Ctrl+S + Enter (`re.json › s`) și pe F12 + Enter (`rb.json › s1`). Cu mouse-ul pe Save iese corect: `clic/salvare/dialog_salvare:Save`.
- **Lecția:** `m1-l03/index.html:129`: „scrie la File name exact Popescu_Ana_7A_orar și apasă Save (sau Enter)”. În Word real, Enter în câmpul File name apasă butonul implicit Save (`uia_word.json › dialog.FileSaveAs`: Button „Save”, `Alt+s`).
- **Contractul:** `api_biblioteca.md` §4: „actiune: ce a înțeles aplicația”, „tinta … la taste: ținta focusului”. Focusul era `camp:nume_fisier`, iar aplicația a înțeles o salvare. §6.3: pasul e făcut doar pe `tinta` sau pe `asteapta`. R6: profesorul vede „tasta Enter în document”, nu o salvare.
- **Cauza:**
  - Ascultătorul `keydown` al stratului (`word.js:1002-1004`) salvează și închide fereastra înaintea ascultătorului rădăcinii (bubbling).
  - Rădăcina calculează apoi `inCamp = true` și `act = null` (`word.js:1354-1357`, `dialog` e deja `null`). Ținta o ia din noul `activeElement`, deci `document` (`aplicatii.js:349-356`).

### GRAV N3: pe telefon, cuvântul aflat încă în compunere lipsește din stare() la „Verifică” și se mută acolo unde atinge elevul
**(a) Ultimul cuvânt lipsește la verificare (`rd_touch.json › t2`, context touch la 390 px):**
- **Pași:** documentul `["Numele: "]`. Compunere „I”, „Io”, „Ion”, fără spațiu după cuvânt, cum rămâne pe Gboard ultimul cuvânt al unui răspuns. Apoi o atingere reală (`touchscreen.tap`) pe un buton „Verifică” din afara aplicației, care citește `LH.aplicatii.stare('word').text` în `click`.
- **Rezultatul:** la `click`, starea e `["Numele: "]`. Abia după 300 ms devine `["Numele: Ion"]`.
- **De ce:** cu mouse-ul ținut apăsat 90 ms (`rd.json › t1`) se vede ordinea `mousedown → compositionend → blur → pointerup → click`, iar cuvântul ajunge la timp. Pe ecranul tactil însă, `mousedown`, mutarea focusului și `click` vin împreună, după ridicarea degetului, iar `trimite` e amânat cu `setTimeout(0)`. Așa, verificarea vede documentul fără ultimul cuvânt, iar elevul care a răspuns corect primește „greșit”.

**(b) Atingerea în alt rând mută cuvântul (`rc.json › a3`):**
- **Pași:** documentul `["Ana are ", "Doi"]`. Compunere „mere” la capătul rândului 1, apoi un clic în rândul 2, apoi tastatura confirmă „mere” și spațiul.
- **Rezultatul:** `["Ana are ", "Doimere "]`. Cuvântul tastat la capătul rândului 1 a ajuns în rândul 2.
- **De ce:** `mousedown` are `preventDefault`, deci focusul și caseta nu se schimbă și compunerea nu se încheie (`rb.json › c2`: niciun `compositionend` după clic).

**Referințe și cauză:**
- **Word real:** `scenarii_real/word-tastare-text.json`: textul tastat ajunge în document așa cum a fost scris, acolo unde era cursorul. `word-clic-pune-cursorul.json`: clicul mută cursorul, nu textul.
- **Contractul:** „Proba realității”: „unii pe telefon”. I1: telefonul la 360-390 px.
- **Cauza:**
  - `aplicatii.js:377-382`: textul compus pleacă doar la `compositionend`, cu `setTimeout(0)`;
  - `aplicatii.js:181`: `L.stare` nu ia în seamă compunerea în curs;
  - `word.js:1527-1530`: `mousedown` cu `preventDefault` ține focusul în casetă, deci o atingere în document nu încheie compunerea;
  - `I.la.jos` (`word.js:1159-1200`) mută cursorul fără să trimită întâi cuvântul din casetă.
- **Limita probei:** IME-ul e emulat prin CDP, la fel ca la GRAV 1 din runda 1. Ce ar lămuri-o: un telefon Android cu Chrome și Gboard (sugestii pornite). Scrii „Ion” fără spațiu și atingi un buton care citește `stare()`. Apoi scrii „mere” la capătul unui rând și atingi alt rând. După regula „dacă nu ești sigur, e greșit”, o număr GRAV.

### GRAV N4: drumurile lecției m1-l03 (fișiere) nu se pot duce până la capăt pe bibliotecă
**Pași și rezultate (`rd.json › m1`):**
- Ctrl+W dă mesajul „În aplicația reală, „Ctrl+W” funcționează; aici nu e simulată.” (`ctrl_w/nesimulat`).
- ✕ (`bara_titlu:Close`) dă „„Close” … aici nu e simulată”.
- Ctrl+O dă „„Ctrl+O” … aici nu e simulată”.
- În Save As, ▾-ul de la „Save as type:” dă „„Deschidere” … aici nu e simulată”, fără listă.
- Panoul din stânga al ferestrei Save As are doar elemente `"[element de listă, nesalvat]"`, așezate în afara ecranului (`[-1915.5, -13.5]`), deci „Documente” nu se poate alege.
- Cheile lui `stare()` nu au folderul: `[aliniere_paragrafe, cuvinte, dialog_salvare, formatare_pe_caractere, imagini, liste, nume_fisier, pagina, selectie, stil_paragrafe, tabele, text]`.

**Lecția:** `m1-l03/index.html`:
- `:212`: „(1) Închide documentul cu <b>Ctrl+W</b> și păstrează rândul. (2) Redeschide-l cu <b>Ctrl+O</b>”, cu verificarea „La întrebarea „Save your changes to this file?” apasă Save”;
- `:192`: „F12, la Save as type alege PDF (*.pdf), Save”;
- `:127-132`: „F12, clic în stânga pe Documente …”;
- verificările de la `:129` și `:145` sunt pe `fisier:{folder:'doc', nume:…}`.

**Contractul:** R12: „Orice comandă folosită de o lecție sau citată în ea funcționează”. `api_biblioteca.md` §3: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate”. R8: verificarea pe folder nu poate da verdictele vechi fără un folder în stare. Fereastra „Save your changes…” și fereastra Open nu au referință în `uia_word.json`, iar după R4 „o suprafață fără referință contează ca diferență”.

**De ce e GRAV:** e aceeași clasă cu GRAV 4 din runda 1 (Ctrl+S pe m1-l03), pe care runda a reparat-o, dar doar pentru Ctrl+S. La mutarea lecției, 3 din exercițiile ei se opresc într-un mesaj.

---

## Neconfirmate cu referință [FARA_REFERINTA] (nu le număr GRAV)
- **Clicul în caseta Font Size nu-i selectează valoarea, iar cifrele se adaugă la ea.**
  - **Pași (`rb.json › f1`):** titlul e selectat; clic în casetă (la mijloc sau la dreapta). Caseta arată `["11", 2, 2]`, adică cursorul e la capăt și nimic nu e selectat. Tastez `20` și Enter.
  - **Rezultatul:** caseta arată `"1120"`, iar titlul are `marime: 1120` (în limită, `word.js:333`).
  - **Inconsecvența din cod:** pe drumul cu tastele de acces, valoarea se selectează (`word.js:1486`, `camp.select()`), iar pe clic nu (`word.js:1527-1528` lasă `mousedown` browserului).
  - Drumul lecției m2-l10:152 („alege 20”) e exact acesta. Ce ar lămuri-o: un scenariu `gest_real` cu clic în caseta Font Size, tastat `20`, Enter, citit `Selection.Font.Size`.
- **Valorile greșite în casetă nu dau niciun mesaj.** `abc`, `0` și `2000` + Enter: nimic nu se schimbă, iar caseta revine la `11` (`rc.json › f3`). Word arată un mesaj de eroare. Captura care lămurește: fereastra apărută după `0` + Enter.
- **Numele de fișier.** „Pop.Mihai” se salvează fără `.docx`, la fel „Clasa 7.AB” și „Tema.doc”. „Tema/1” e acceptat ca `"Tema/1.docx"`, deși `word.js:965` scoate tocmai `\ / : * ? " < > |` din numele propus (`rc.json › n1`). Captura: Save As cu aceste nume, pe Word real.
- **F12 pe un document deja salvat propune iar primul rând, nu numele curent** (`word.js:964-965`).
- **„More save options” deschide fereastra Save As, nu pagina Save As din Backstage.** După Cancel, numele scris se pierde (`rc.json › n2`).

## MINOR
- **Esc în caseta Font Size lasă focusul în casetă.** Litera tastată apoi intră în casetă: `"11q"` (`rb.json › f2`). Rămâne din runda 1.
- **Gestul `tasta_acces` nu e în lista felurilor de gest din §4 / `suprafete.json`.** Pe lângă asta, `NAVIGARE_TA` (`aplicatii.js:454`, `:489`) scoate din „greșeli” `arata_taste_acces` și `prefix_tasta_acces`. Lista din §6.3 e închisă („orice alt eveniment … în afară de rotita, sageti, tasta_home_end, tasta_pagina”). Abaterea e rezonabilă, dar trebuie scrisă în contract, nu doar în cod.
- **Tastarea în câmpurile File name și Font Size emite `tastare` cu `dupa` = `inainte`.** §4 spune „La tastare în Word … dupa diferă de inainte”. Regula e despre document, dar oracolul o poate citi literal.

## Ce a trecut (citit pe ecran și în `stare()`)
- **Compunerea și tastarea pe telefon:** compunerea cu corecturi și ștergeri, majuscula automată pe calea „input” (bucăți sau o singură bucată).
- **Tastatura cât sunt deschise straturile:** Backstage și ferestrele țin tastatura pentru ele, cu literele de acces pe niveluri (F → A → O până la Browse). Esc urcă un nivel, apoi închide Backstage (`rc.json › k1`).
- **Caseta Font Size:** prin Ctrl+A + tastare și prin Alt, H, F, S; Ctrl+Z / Ctrl+Y după schimbarea mărimii (`[11]` → `[20]`).
- **Salvarea:** Save this file → nume → Enter / Save; Esc și o a doua încercare; word2007 Ctrl+S → Save As; Alt, F, A, O → Save As → nume → Enter (`"Tema mea.docx"`).
- **Asistentul:** nu mai numără tastele de acces ca dublu clic.

GRAV_VECHI_DESCHISE: 1
GRAV: 5
