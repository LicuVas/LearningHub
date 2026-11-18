# Criticul rece, runda 1, etapa B (Word): unghiul gest_tastatura

**Cine:** critic rece, fără notele constructorului (n-am citit `runde/1/*.md` și nici `de_verificat.md`).
**Ce am rulat:** server static legat de `127.0.0.1`, port liber; Playwright Chromium headless, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost. Pagina: `aplicatii/poligon.html`. Pentru fiecare probă am chemat `LH.aplicatii.deschide('word', {continut, profil, focus:true})`, am trimis gesturi reale (`page.keyboard` / `page.mouse`, iar pentru telefon CDP `Input.imeSetComposition` / `Input.insertText`), apoi am citit și `stare()`, și ecranul (`[data-lh-zona] [data-lh-tinta="text"]`), și evenimentele (`window.__lhAplicatieEv`). Scripturile și ieșirile sunt în scratchpad, în `%TEMP%`: `proba_tast.py`, `proba_tast2.py`, `rez1.json`, `rez2.json`.
**Word real:** am folosit `referinte/scenarii_real/word-*.json`, `referinte/uia_word.json` (extras cu Python) și contractul. Am făcut și o verificare **invizibilă prin COM** (DispatchEx, Visible=False, DisplayAlerts=0; instanța mea, PID 24736, a ieșit singură după `Quit`), doar pe modelul documentului. Rezultatul e în `com.json`, tot în scratchpad. COM-ul nu trimite gestul fizic, așa că acele constatări rămân **[FARA_REFERINTA]** și **nu le număr GRAV**.

---

## GRAV 1 (cel mai puternic motiv): pe telefon, tastatura care compune cuvântul dublează literele
**Pași:** document gol. Prin CDP am trimis ce trimite o tastatură Android cu compunere (Gboard cu sugestii, Samsung Keyboard): `imeSetComposition` „a” → „an” → „ana”, apoi `insertText` „ana”, apoi `insertText` „ ”, apoi aceeași secvență pentru „are”.
**Pe poligon:** `stare().text` = `["aananaana aarareare"]`. Ecranul arată la fel: `"aananaana aarareare"`. Au plecat 9 evenimente `tastare/scriere`.
**Word real:** textul tastat ajunge în document așa cum a fost scris. `scenarii_real/word-tastare-text.json`: „Planul de luni” tastat → `"text": ["Planul de luni"]`. Contractul: „Proba realității”: „Elevul (V-VIII, mulți începători, **unii pe telefon**) … tastează”; I1: „Telefon + laptop: biblioteca merge la 360-390 px”.
**Cauza:** `aplicatii.js:370-377`. Ascultătorul `input` golește `I.intrare.value = ''` (r. 372) la FIECARE `input`, inclusiv la `insertCompositionText`, și trimite bucata în document prin `I.la.text(v)`. Biblioteca nu ascultă deloc `compositionstart` / `compositionend` (grep „composition” în `aplicatii.js` = 0). Comentariul de la r. 359 promite tocmai „telefon, IME, diacritice”.
**Limita probei:** CDP emulează IME-ul în Chromium desktop. Ce ar lămuri-o pe un dispozitiv real: un telefon Android cu Chrome, Gboard sau Samsung Keyboard, tastezi „ana are mere” pe poligon și citești `LH.aplicatii.stare('word').text`. Pe regula „dacă nu ești sigur, e greșit”, o număr GRAV: pe un telefon care compune, orice sarcină cu tastare iese stricată.

## GRAV 2: tastele ajung în document cât sunt deschise Backstage sau o fereastră de dialog (documentul se schimbă pe ascuns)
**Pași și rezultate:**
- (a) `Ana are mere` cu cursorul la capăt, apoi tastele de acces Alt, F, A. Backstage se deschide pe `Home`, **fără nicio literă afișată**, iar „a” intră în document: `stare().text` = `["Ana are merea"]`.
- (b) Clic pe File, apoi tastez `xyz` și Backspace. Cu Backstage deschis, documentul devine `["Ana are merexy"]`. Evenimentele sunt `tastare/scriere` și `tasta_backspace/stergere` cu ținta `document`. După Esc rămâne tot `["Ana are merexy"]`.
- (c) Ctrl+D deschide fereastra Font, dar focusul rămâne în `TEXTAREA lh-ap-intrare Document1`. Tastez `qw` și Backspace: documentul din spatele ferestrei modale devine `["Ana are mereq"]`.

**Word real:** `uia_word.json › backstage.nav`: ListItem „Save As”, `tasta_acces: "Alt, F, A"` (la fel „Home” = `Alt, F, H`, „Open” = `Alt, F, O`, „Save” = `Alt, F, S` …). Deci Alt, F, A deschide pagina Save As, nu scrie „a”. `uia_word.json › dialog.FontDialog`: câmpurile ferestrei au tastele lor („Font:” Edit = `Alt+F`, „Font style:” = `Alt+y`, fila „Advanced” = `Alt+v`), deci tastatura e a ferestrei, nu a documentului.
**Cauza:**
- `word.js:1284-1291`: cu `dialog` sau `backstage` deschis, `I.la.tasta` întoarce `null` fără `preventDefault`. Litera trece în `textarea`, iar `aplicatii.js:370-377` o scrie în document prin `I.la.text` (`word.js:1341`), fără nicio verificare că un strat e deschis.
- `word.js:941`: `s.focus()` pe o suprafață nefocusabilă, deci focusul rămâne în document.
- `word.js:989-1003`: `deschideBackstage` nu mută focusul.
- `word.js:1384-1387`: File e `Button`, nu `TabItem`, deci `ktIesi()`. După Alt, F nu se arată literele din Backstage pe care referința le are.

**De ce e GRAV:** elevul nu vede documentul cât e deschis Backstage. Literele tastate pe drumul Alt, F, A sau în Save As/Backstage îi schimbă textul pe ascuns, iar verificarea pe `stare()` pică fără o cauză vizibilă.

## GRAV 3: mărimea fontului nu se poate schimba (nici scrisă în casetă, nici din listă), iar pe drumul Alt, H, F, S cifrele îi strică textul
**Pași și rezultate:**
- (a) Selectez „are”, clic în caseta Font Size, Ctrl+A, `14`, Enter. Rămâne `marime: 11`. Apare mesajul „În aplicația reală, „Font Size” funcționează; aici nu e simulată.”, iar focusul rămâne în `INPUT … Font Size`.
- (b) Clic pe ▾-ul casetei: mesajul „„Font Size ▾” … aici nu e simulată”, eveniment `meniu_derulant/nesimulat`.
- (c) Selectez „are”, apoi Alt, H, F, S, tastez `14` și apăs Enter. Focusul a rămas în document (`TEXTAREA … Document1`), „14” a **înlocuit cuvântul selectat**, iar Enter a rupt paragraful: `formatare_pe_caractere` = `"Ana 14\r mere"`.

**Word real:** `uia_word.json › panglica.TabHome`: ComboBox „Font Size” (`id_mso: FontSize`, `tasta_acces: "Alt, H, F S"`) cu un `Edit` „Font Size” (`Alt, H, F S`), adică o casetă în care se scrie.
**Drumul lecției:** `lectii/vii/m2-l10/index.html:152` spune „Apasă B (aldin), alege 20 în caseta de mărime (Font Size) și apasă Center”, iar r. 238 spune „(3) alege 16 în caseta de mărime (Font Size)”. Contractul, R12: „Orice comandă folosită de o lecție sau citată în ea funcționează”. `api_biblioteca.md` §3: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate.”
**Cauza:**
- `word.js:1037-1058`: tabelul `CMD` nu are `FontSize` (nici `Font`), deci `apasa` ajunge la `I.nesimulat` (`word.js:1088`).
- `word.js:1279-1283`: în câmp, Enter nu face nimic.
- `word.js:1386`: tasta de acces doar „apasă” caseta și nu mută focusul în ea.

## GRAV 4: Ctrl+S pe un document nou dă „aici nu e simulată”, deși lecția îl folosește
**Pași:** document `Poezie`, apăs Ctrl+S.
**Pe poligon:** mesajul „În aplicația reală, „Ctrl+S” funcționează; aici nu e simulată.”, eveniment `ctrl_s/nesimulat`, nicio fereastră.
**Lecția:** `lectii/vii/m1-l03/index.html:143`: „… apăsând Ctrl+S: în Word-ul nou apare o fereastră mică, Save this file, unde scrii numele și alegi locul.” (și r. 65).
**Cauza:** `word.js:1331`: `case 'ctrl_s': r = M.salvat ? 'salvare' : I.nesimulat('Ctrl+S');`.
**De ce e GRAV:** se încalcă R12 (scurtătură citată de lecție, nesimulată). Referința nu are nicio suprafață „Save this file” (lista `suprafete` din `uia_word.json`), deci la mutarea lecției pică și R11, iar după R4 „o suprafață fără referință contează ca diferență”. Ce ar lămuri-o: un scenariu `gest_real` „word-ctrl-s-document-nou” (Ctrl+S, apoi citit titlul ferestrei apărute) și dump-ul UIA al ferestrei. Constatarea e GRAV pe R12 chiar și fără acest scenariu.

## GRAV 5: tastele de acces fabrică un „dublu clic”, iar asistentul arată indiciul după O SINGURĂ greșeală
**Pași:** selectez „are”, pornesc asistentul `{pasi:[{tinta:'mso:Bold'},{tinta:'mso:Italic'}], dupaGreseli:2}`, apoi Alt, H, 1 (câte 60 ms între taste) și un singur clic real într-un loc gol al paginii.
**Pe poligon:** evenimentele sunt `clic_fila/fila/fila:Home`, `clic_comanda_panglica/aldin/panglica:Home/Font/Bold`, apoi **`dublu_clic/dublu_clic/panglica:Home/Font/Bold`** (gest pe care elevul nu l-a făcut) și `clic/pozitionare/document`. Indiciul apare pe `mso:Italic` după o singură greșeală reală. Același pas făcut cu mouse-ul pe Bold, apoi același clic greșit: nicio bulă (`[]`). La fel la Alt, H, A, C (`dublu_clic` pe Center).
**Contractul:** `api_biblioteca.md` §4: „Un eveniment pe fiecare gest fizic al elevului”; „Dublul clic = trei evenimente (clic, clic, dublu_clic)”. §6.3: „După `dupaGreseli` greșeli la rând … indiciu”. R6 (monitorizare) și R7.
**Cauza:**
- `word.js:1386` trimite un `new MouseEvent('click')` sintetic, cu `clientX/Y = 0` și `detail = 0`.
- `aplicatii.js:325-329` îl tratează drept clic. `aplicatii.js:276` numără al doilea clic sintetic în mai puțin de 500 ms, în același punct (0,0), ca `n = 2`.
- `aplicatii.js:283-287` emite `dublu_clic`. `dublu_clic` nu e în `NEGRESELI` (`aplicatii.js:420`), deci contează drept greșeală.
- În plus, tastele de acces apar profesorului ca „clic”: `clic_fila`, `clic_comanda_panglica`. Literele H, 1 nu emit niciun eveniment de tastatură, pentru că sunt oprite cu `stopPropagation` la `word.js:1398`.

## GRAV 6: pe telefon nu se mai face majuscula automată (AutoCorrect)
**Pași:** document gol. Prin CDP `Input.insertText` am trimis, bucată cu bucată, „ana”, „ ”, „are”, „ ”, „mere.”, „ ”, „el”, „ ”. Așa ajunge textul pe Android, unde `keydown` vine ca „Unidentified” și `gestTasta` întoarce `null`.
**Pe poligon:** `["ana are mere. el "]`. Cu tastatura fizică (probă P1), același text dă `["Ana are mere. El are pere."]`.
**Word real:** `scenarii_real/word-tastare-majuscula-automata.json`: „ana are mere. el are pere.” → `"text": ["Ana are mere. El are pere."]`.
**Cauza:** `word.js:1341` `I.la.text = v => { const r = scrie(v, false); …`. Cu `dinTastatura = false`, condițiile de la `word.js:204` și `word.js:207` sar peste `autoMajuscula`. Același gest dă alt document pe telefon decât pe laptop și decât în Word.

---

## Neconfirmate cu referință de gest [FARA_REFERINTA]: nu le număr GRAV, dar COM-ul le sprijină
Modelul Word real, prin COM, pe instanța mea invizibilă (Word 16.0, `Options.ReplaceSelection = True`):
- **Săgețile în tabel nu ies din celulă.** Tabelul e 2×2 (Nume/Punctaj/Ana/9), cu cursorul în (1,1). ↓ și apoi `X`: pe poligon dă `XNume` (↓ nu face nimic; `word.js:1303` întoarce `'cursor'` când `M.cel`). ↓×3 și apoi `Z` dă `ZNume`, deci elevul nu poate ieși din tabel cu tastatura. COM (`Selection.MoveDown(wdLine)`, comanda tastei ↓) dă `XAna`. End, → și apoi `Y`: pe poligon `NumeY` (`word.js:1232-1237` ține cursorul în celulă), iar COM (`MoveRight`) dă `YPunctaj`. Captura care lămurește: scenariile `gest_real` „word-sageata-jos-tabel” și „word-sageata-dreapta-capat-celula”.
- **Enter într-o celulă e ignorat.** Pe poligon: eveniment `tasta_enter/fara_efect` și celula `NumeQ` (`word.js:221`). COM (`TypeParagraph`) dă `Nume\rQ`.
- **Textul tastat peste o selecție aldină își pierde aldinul.** Pe poligon: Ctrl+B pe „are”, apoi `XYZ`, dă tot textul ne-aldin. COM (`TypeText` peste selecție) dă `X,Y,Z` aldine. Cauza: `word.js:199-201` șterge selecția, apoi ia formatul caracterului DINAINTE (`fmtLa`).
- **Ctrl+A și Delete lasă tabelul în document.** Pe poligon: `text [""]` și tabelul întreg (`word.js:1312` selectează doar paragrafele). COM (`WholeStory` + `Delete`): `Tables.Count = 0`. Tot COM arată că `Selection.End` după WholeStory = 28, cu caracterele tabelului numărate, iar poligonul nu numără celulele în `lungime()`.
- **Alt+H ținut apăsat (acord) nu face nimic, iar „1” apăsat apoi înlocuiește cuvântul selectat:** `"Ana 1 mere"`. Referința scrie tastele panglicii ca secvență (`"Alt, H"`), iar pe cele din dialoguri ca acord (`"Alt+t"`). Dacă panglica primește și acordul nu e capturat. Captura: Alt+H ca acord (WM_SYSKEYDOWN), apoi 1, pe Word real.

## MINOR (fără efect mare asupra elevului sau fără referință)
- Shift+Enter face paragraf nou (`word.js:1296`, `["Ana are mere","x"]`). În Word e rând nou în același paragraf [FARA_REFERINTA].
- Ctrl+Backspace și Ctrl+Delete șterg o literă (`"Ana are mer"`, `"na are mere"`). În Word șterg cuvântul [FARA_REFERINTA].
- Ctrl+Z imediat după majuscula automată șterge tot (`"Ana "` → `""`). În Word, primul Ctrl+Z anulează doar corectura [FARA_REFERINTA].
- Ctrl+→ sare peste punctuație și peste capătul de paragraf (pozițiile 4, 8, **14**, **20** în „Ana are mere, pere.¶Doi trei”; `word.js:1244-1245`). În Word virgula și punctul sunt „cuvinte” separate [FARA_REFERINTA].
- Ctrl+B fără selecție: litera următoare iese aldină, dar butonul Bold NU se aprinde (`aria-pressed="false"`). `actualizeazaPanglica` (`word.js:798`) nu citește `M.fmtIns` [FARA_REFERINTA].
- Esc în caseta Font Size nu întoarce focusul în document: litera tastată apoi rămâne în casetă [FARA_REFERINTA].
- Cu galeria Margins deschisă, „n” intră în document (`"Ana are meren"`), iar ↓ nu umblă prin listă [FARA_REFERINTA].
- După Alt, pe Home apar și literele de grup ZL, ZF, ZP, ZS, ZN, Z1. Word le arată doar pentru grupurile strânse [FARA_REFERINTA: referința dă `tasta_acces` pe toate grupurile, fără să spună dacă se afișează].
- Ctrl+Y după Ctrl+E nu repetă alinierea (`schimba` golește `M.ultima`, `word.js:178`). F10 nu arată tastele de acces [FARA_REFERINTA].
- Profilul word2007: Backspace×3 și Ctrl+Z repun o singură literă (`"caiet"`). Referințele `word2007-*` au `mod_probat: false` și nu acoperă ștergerea [NESIGUR].

## Ce a trecut (citit pe ecran și în `stare()`)
Tastare cu majusculă automată pe tastatura fizică; spații duble și Tab pe ecran = în stare; F12 → nume → Enter (`Tema mea.docx`, `nume_propus: "Tema mea de azi.docx"`); Esc închide Save As; word365 „abc” + Ctrl+Z → `[""]`; word2007 „abc” + Ctrl+Z → `["ab"]`, apoi Ctrl+Y → `["abc"]`; Backspace×3 + Ctrl+Z în word365 → `caietul`; clic pe Bold lasă focusul în document; Ctrl+Shift+→ = `"Ana "`; Ctrl+End, Shift+Home; Alt, H, 1 → aldin; Alt, H, A, C → centru; Esc coboară un nivel în tastele de acces, apoi iese; la 375 px, clicul în pagină pune focusul în document și tastarea fizică merge.

GRAV: 6
