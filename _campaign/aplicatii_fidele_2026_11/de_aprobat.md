# De aprobat de Vasile — abateri propuse de la aplicația reală

Fiecare rând: ce diferă, de ce îl propunem, ce l-ar închide. Până la aprobare, rândul se NUMĂRĂ ca diferență (R4/R5).
Aprobat → se mută în `abateri.md`; respins → se repară sau se scoate.

## Runda 2 · Word
- [ ] **A2-1** Fereastra **„Save this file”** (Ctrl+S pe document nou) e construită din textul paginilor Microsoft (URL-urile
  în `runde/2/diferente.md` D7), NU dintr-un dump UI Automation: geometria (locul și mărimea elementelor), numele propus
  (prima linie a documentului, ca la F12), valoarea „Documente” din Location și Esc = închidere sunt alese de noi.
  De ce: lecția `lectii/vii/m1-l03/index.html:143` cere Ctrl+S → „Save this file”; fără ea, Ctrl+S dădea „nu e simulată”
  (GRAV 4 al criticului, R12). Ce o închide: captura din `de_verificat.md` R2-2 (o rundă `acoperire` o îngheață în
  `referinte/` și fereastra se regenerează din ea).
  **18.11.2026, runda `acoperire`:** referința reală există acum — `referinte/uia_word.json › dialog.save_this_file`
  (Ctrl+S pe document nou, Word real, desktop ascuns) + scenariul `word-ctrl-s-document-nou` (titlul „Save this file”, File
  name „Poezia mea”, tip „Word Document (*.docx)”). Fereastra reală are și ce lipsea din cea construită: caseta mică Save as
  type, „Choose a Location” cu ▾, More options… (→ File › Save As) și Cancel. Rândul rămâne deschis până fereastra
  bibliotecii e refăcută după referință (atunci se închide fără aprobare: nu mai e abatere).
  **19.11.2026, runda 4 (constructorul):** fereastra inventată (`cuSalvareNoua`, `word.js`) e scoasă; Ctrl+S pe document nou
  desenează acum `dialog.save_this_file` din referință (File name „Poezia mea” fără .docx, Save as type, Choose a Location,
  More options… → File › Save As, Save, Cancel). Rândul rămâne bifat-deschis până îl confirmă criticul rundei 5 (atunci
  orchestratorul îl închide); ce n-are referință din fereastra asta e în `de_verificat.md` AC-8.

## Runda 14 · PowerPoint (codul comun aplicatii.js)
- [ ] **A14-1** **Alt + litera subliniată într-o fereastră** emite felul `tasta_acces` (ca în Word și Excel din rundele 4 și 7), deși
  api §4 descrie `tasta_acces` doar pentru șirul KeyTips al panglicii. De ce: api §4 nu are alt fel pentru Alt + literă în fereastră,
  iar `api_biblioteca.md` nu se atinge într-o rundă de reparație; `tasta_acces` e cel mai apropiat fel existent și e deja cel emis de
  Word / Excel. Ce îl închide: o rundă `acoperire` care scrie în api §4 felul pentru Alt + literă în fereastră (sau îl confirmă).
- [ ] **A14-2** **`stare().caseta_activa`** (PowerPoint) = `{tinta, text}` al casetei panglicii / ferestrei în care se scrie, `null` în
  rest — o cheie în plus față de api §5, pusă ca tastarea într-o casetă (Font, File name) să aibă `dupa` ≠ `inainte` (api §4). Nicio
  `stare_citita` n-o cere. Ce o închide: api §5 o primește (rundă `acoperire`) sau Vasile alege altă formă.
- [ ] **A14-3** **Asistentul (§6.3)** nu numără greșeală Esc-ul care doar iese din modul tastelor de acces (`tasta_esc` cu
  `actiune: 'iesire_taste_acces'`), ca pe celelalte taste de navigare. api §6.3 enumeră excepțiile fără el. Ce îl închide: api §6.3
  îl adaugă la excepții (rundă `acoperire`).

## Runda 17 · Excel
<!-- RUNDA17-EXCEL:START (scris de constructorul rundei 17, 20.11.2026) -->
- [ ] **A17-1** **Grila nu se lungește până la A1048576 / XFD.** Ctrl+↓ / Ctrl+→ după ultimul bloc duc celula activă la marginea
  foii, ca în Excel (scenariile `excel-ctrl-jos-ultimul-rand`, `excel-ctrl-dreapta-ultima-coloana` trec: `selectie` = A1048576 /
  XFD7, Name Box la fel), dar grila desenată se oprește la ultimele date + 2000 de rânduri / 200 de coloane (plafon 3000 × 300):
  celula activă de acolo nu se vede pe ecran. Excel derulează până la ea. De ce o păstrez: grila e desenată întreagă în DOM,
  iar 1.048.576 × 16.384 de celule ar îngheța pagina; nicio lecție a clasei a VIII-a nu cere Ctrl+săgeți (criticul 10,
  [FARA_REFERINTA] 4). Ce o închide: o grilă desenată pe ferestre (doar rândurile din jurul celulei active), sau Vasile o acceptă.
<!-- RUNDA17-EXCEL:END -->

<!-- RUNDA18-WINDOWS:START (scris de constructorul rundei 18, 20.11.2026) -->
- [ ] **A18-1** **Ceasul barei arată ora curentă**, nu „19:48 20.11.2026” din captură (formatul e cel din referință:
  „Ceas HH:MM / ZZ.LL.AAAA”). O3 numără 8 puncte (eticheta capturată lipsă + cea vie în plus). De ce o păstrez: pe un PC
  ceasul merge; un ceas oprit l-ar încurca pe elev. Ce o închide: Vasile o acceptă, sau o regulă O3 pentru valorile de moment.
- [ ] **A18-2** **Butoanele „deschise” din captură nu se desenează** („Terminal - 7 ferestre deschise”, „KeePassXC …”,
  „Google Chrome - 1 fereastră deschisă”, „AutoHotkey …”): erau ferestrele deschise atunci pe PC-ul profesorului (stare, nu
  configurație). Bara arată butoanele ferestrelor din `stare().ferestre`. O3 numără 28 (4 × lipsă) + 7 (`pozitie`: grupul
  se recentrează) în proba rundei. Ce o închide: Vasile o acceptă, sau o regulă O3 care tratează butoanele „deschise” ca stare.
<!-- RUNDA18-WINDOWS:END -->

<!-- RUNDA15-EXPLORER:START -->
## Runda 15 · B-explorer — abateri de aprobat de Vasile (se numără până la aprobare)
- **A15-1** Fâșia de desktop cu pictograma „Coș de reciclare” în stânga ferestrei Explorer, în aceeași rădăcină (`aplicatii/explorer.js:409`, în afara suprafețelor Explorer; `continut.desktop: false` o scoate). În Windows real Coșul stă pe desktop, nu în Explorer; fâșia ține locul desktopului până când Explorer se deschide în desktopul bibliotecii (banda Windows, runda 18). Fără ea, scenariul `explorer_restaurare_din_cos` (dublu clic pe `desktop:Coș de reciclare`) nu se poate juca.
<!-- RUNDA15-EXPLORER:END -->

<!-- RUNDA21-EXCEL:START (scris de constructorul rundei 21, 21.11.2026) -->
## Runda 21 · Excel (contractul asistentului, cod comun)
- [ ] **A21-1** **§6.3: ce face un pas care are și `tinta`, și `asteapta`?** (criticul 17, secțiunea D; `aplicatii.js:627-628`,
  `api_biblioteca.md:255-257`.) Textul: pasul e făcut de un eveniment „cu `tinta` = ținta canonică a pasului …, cu `activat`
  …, **sau** `asteapta(ev)` = true”; „Greșeală = orice alt eveniment”. Pentru pasul „scrie titlul graficului, apoi Enter”
  (`tinta: 'grafic:1/titlu'`, `asteapta: ev => ev.actiune === 'titlu_grafic'`) sunt două citiri, fiecare cu un defect:
  - **(1) literal, „sau”:** prima literă (ținta `grafic:1/titlu`) face pasul — prea devreme; `asteapta` nu mai poate restrânge
    niciodată un pas care are și țintă;
  - **(2) codul de azi:** cu `asteapta`, doar ea contează; literele scrise corect sunt greșeli → indiciul apare după a doua
    literă (pe telefon și pe calculator, `runde/17/critic_probe/p2c.json › 5_ă`, `p2.json › pc.6_a`);
  - (3) propunerea criticului 17: `asteapta` decide „făcut”, iar evenimentele cu ținta pasului care nu-l termină nu sunt
    greșeli — nu e în text.
  Runda 21 NU a atins `aplicatii.js` (textul nu spune ce rost are `asteapta` lângă `tinta`; e o alegere de contract). Azi
  nicio lecție nu pornește un asistent cu `asteapta` (grep pe `lectii/`, `jocuri/`: 0). Ce îl închide: Vasile alege (1), (2)
  sau (3); o rundă `acoperire` scrie alegerea în §6.3, apoi codul comun o urmează (regres pe asistent la toate aplicațiile, O9).
<!-- RUNDA21-EXCEL:END -->

<!-- RUNDA22-WINDOWS:START (scris de constructorul rundei 22, 21.11.2026) -->
## Runda 22 · Windows
- [ ] **A22-1** **CERERE către banda Explorer (r19) și orchestrator: un mod de montare a Explorer-ului într-o fereastră a desktopului Windows.**
  - Fără el, clicul pe dosarul galben din bară (drumul din 10 lecții, W4) dă doar evenimentul §4 și mesajul central. Explorer-ul bibliotecii nu se deschide.
  - Azi, `explorer.js` se deschide doar ca aplicație separată (`LH.aplicatii.deschide('explorer', …)`). Are doar `continut.desktop:false` și își desenează singur bara de titlu.
  - Montat în rădăcina Windows, ar avea patru probleme:
    - (a) dublează evenimentele: pointerdown / contextmenu / keydown ajung și la rădăcina Windows;
    - (b) moare la fiecare redesenare a ferestrelor (`windows.js › deseneazaFerestre` rescrie stratul ferestrelor);
    - (c) are două bare de titlu;
    - (d) `LH.aplicatii.deschideSuprafata` ia prima aplicație vie.
  - Ce cer: o opțiune, de exemplu `deschide('explorer', {loc: <corpul ferestrei>, incadrat: true})`, care:
    - nu-și desenează bara de titlu și Coșul;
    - își oprește evenimentele în rădăcina ei;
    - expune `I.stare()` pentru titlul ferestrei („Acasă” / calea).
  - Windows ar monta-o în fereastra lui și ar păstra-o la redesenare.
  - Ce o închide: opțiunea + legarea în `windows.js` (banda Windows, după ce criticul confirmă E1/E2 la Explorer).
- [ ] **A22-2** **Pe telefon (rădăcina sub 600 px), două adaptări pentru I1** (Windows real n-are ecran de 360 px, deci nu există referință):
  - Start stă fix în stânga barei, în afara benzii de aplicații care se derulează;
  - o fereastră normală se încadrează întreagă pe ecran (`x + lățime ≤ ecran`). Pe PC rămâne regula veche: fereastra poate ieși parțial.

  De ce: altfel derularea benzii spre aplicația activă scoate Start-ul din vedere (prins de proba r18, partea 3), iar butoanele ferestrei ies din ecran (W5). Ce o închide: Vasile o acceptă.
- [ ] **A22-3** **Paint și Calculator pornite din căutarea din Start deschid o fereastră generică goală**: bara de titlu cu Minimizare / Maximizare / Închidere, butonul în bară și mesajul central „În aplicația reală, „Paint” funcționează; aici nu e simulată”.
  - Aplicațiile nu sunt în bibliotecă, dar drumul din v/m2-l08 cere: pornește → minimizează → readu din bară → maximizează → închide.
  - Ce o închide: Paint în bibliotecă (contractul: „apoi Paint”) sau Vasile o acceptă.
<!-- RUNDA22-WINDOWS:END -->

<!-- RUNDA24-WORD:START (scris de constructorul rundei 24, 21.11.2026 — asistentul comun și fereastra mică) -->
- [ ] **A24-1** **Asistentul (§6.3): Tab / Shift+Tab care doar mută focusul (`actiune: 'mutare_focus'`) nu face pasul și nu e greșeală** (hotărârea orchestratorului din `runde/supliment_B_word_runda24.md`, pe constatarea criticului 20 › B, `rc20.json` › M6):
  - Înainte, pe drumul lecției `m1-l03:189-192` făcut cu tastele, Tab-ul care pleca de pe Save bifa „Save” fără salvare, iar Tab-urile se numărau ca greșeli. Bula apărea pe PDF după doi pași buni.
  - Acum (`aplicatii.js` › `L.asistent`, `api_biblioteca.md` §6.3), pasul Save se bifează doar la salvarea adevărată.
  - O lecție care chiar învață Tab-ul își spune pasul cu `asteapta(ev)`; acela primește evenimentul în continuare (A21-1 neatins).
  - Proba: `runde/24/proba_grav.py` › AS1-AS5 (Word + PowerPoint). Ce o închide: Vasile o acceptă.
- [ ] **A24-2** **Fereastra mică (laptopul la 125% în browser, 1093×526 css): fereastra Word mai înaltă decât ecranul se micșorează cât să încapă (cel puțin 70%); lista unei casete din fereastră se deschide deasupra casetei când dedesubt nu încape** (`word.js` › `arataFilaDialog`, `listaRef`):
  - Referința e capturată doar la 1366×768. Acolo și pe tablă dreptunghiurile rămân la pixel (`runde/24/probe_iesiri/aspect_dupa.json`, `proba_grav.py` › MN4).
  - Pe laptopul real fereastra încape (614 css la 125%); în browser bara lui fură înălțimea și Save / Cancel ieșeau din ecran (critic 16 și 20, MINOR).
  - Ce o închide: Vasile o acceptă, sau captura R24-3 arată altceva.
<!-- RUNDA24-WORD:END -->

<!-- RUNDA26-WINDOWS:START (scris de constructorul rundei 26, 21.11.2026) -->
## Runda 26 · Windows
- [ ] **A26-1** **Paint găsit pe telefon fără tastare** (suplimentul rundei 26, K3). Referința nu-l arată nicăieri în Start fără căutare.
  - Variante: (a) Vasile acceptă că pe telefon drumul e „scrii pai” (merge din runda 26); (b) o dală „Paint” fixată, deși PC-ul de
    referință n-o are (abatere de aspect, O3 ar crește); (c) așteptăm captura R26-3 și deschidem categoria cum o arată ea.
  - Constructorul n-a implementat nimic din (b) / (c).
- [ ] **A26-2** **Start se deschide la APĂSAREA tastei Windows, nu la ridicare** (abatere de gest, păstrată în runda 26).
  - De ce: evenimentul emis la ridicare ar trece prin `I.emite`, care nu poartă `activat` (K2); `I.emite` e cod comun în afara zonei rundei.
  - Ce o închide: orchestratorul lărgește `I.emite` cu `extra` (un rând, `aplicatii.js` › `L.deschide`), apoi windows.js deschide Start la
    `keyup`; sau Vasile acceptă clipirea Start-ului la Windows + E.
<!-- RUNDA26-WINDOWS:END -->

<!-- RUNDA23-EXPLORER:START (scris de constructorul rundei 23, 21.11.2026) -->
## Runda 23 · Explorer
- [ ] **A23-1** **CERERE către orchestrator: paza comună pentru montare (A22-1), 2 schimbări mici în `aplicatii.js`, în afara zonei r23.**
  - P1: în `leagaGesturi › pointerdown`, un clic pe o țintă dintr-o ALTĂ rădăcină montată în aceasta e al ei (`jos = null`).
  - P2: `deschideSuprafata(cheie, nume?)`: aplicația cerută, dacă e vie.
  - Fără ele, gazda Windows primește și ea clicurile din Explorer (`clic`, `dublu_clic` cu aplicatie „windows”).
  - Textul exact + proba pe copie (0 picate din 15): `runde/23/propunere_comun_A22-1.md`.
  - Ce o închide: orchestratorul aplică P1 + P2 (sau le dă unei benzi), apoi banda Windows leagă montarea în `windows.js`.
- [ ] **A23-2** **Semnele interzise în nume: numele rămâne neschimbat + mesajul central, nu balonul real** (balonul nu e în referință, R23-2).
  - De ce: altfel starea se strică („a/b” mută fișierul într-un folder inexistent).
  - Ce o închide: captura balonului (R23-2) sau Vasile acceptă.
<!-- RUNDA23-EXPLORER:END -->

<!-- RUNDA26-ACOPERIRE-OFFICE:START (scris de constructorul rundei `acoperire` Office, 21.11.2026) -->
## Runda 26 · acoperire Office (Word + Excel)
- [ ] **A26O-1** **Autocompletarea și separatorul se citesc în două momente** (`excel-autocompletare-tab`, `excel-separator-virgula` + perechile noi `…-esc-esc`).
  - De ce: cât mesajul e pe ecran, Excel e în modul de editare și nu răspunde prin COM; realul citea celulele abia după Esc + Esc, simulatorul fără ele (R25-2). Am ales varianta în care scenariul face ce face elevul din lecție: vede mesajul (momentul 1: mesajul + `ramane_in_editare`), apoi Esc închide mesajul și Esc renunță la formulă (momentul 2: celulele; `jocuri/_fixtura-excel/index.html:92` „Esc renunță”).
  - Ce se schimbă: scenariul vechi nu mai citește `celule`; perechea nouă le citește după pașii Esc, Esc. Amândouă au real nou, jucat pe Excel real.
  - Ce o închide: Vasile acceptă împărțirea (sau cere altă formă).
- [ ] **A26O-2** **Clicul din `word-clic-pune-cursorul` cade pe granița „me|re”** (`de_la = pana_la = 10`, ținta `pozitie:10`), nu la mijlocul în pixeli al cuvântului.
  - De ce: mijlocul în pixeli cădea la 0,5 px de centrul lui „e”, deci realul (9) și O4 (10) depindeau de rotunjiri (R24-1). Pe graniță, ambele părți dau 10. Lecția (`vii/m1-l02:165`) cere doar „un clic în text, acolo unde îl vrei”.
  - Ce o închide: Vasile acceptă.
- [ ] **A26O-3** **Eticheta din meniu e „This Device...” (trei puncte)**, cum o arată Word real în UI Automation; lecțiile scriu „This Device…” (un semn). Scenariul `word-imagine-inserare` folosește eticheta reală.
  - Ce o închide: dacă simulatorul nu găsește rândul după etichetă, e treaba bibliotecii (O4 îl arată ca neexecutabil), nu a scenariului.
<!-- RUNDA26-ACOPERIRE-OFFICE:END -->

<!-- RUNDA30-WINDOWS:START (scris de constructorul rundei 30, 21.11.2026) -->
## Runda 30 · Windows
- [ ] **A30-1** **Windows + E (sau dosarul galben) când e deja deschisă fereastra Explorer montată: fereastra existentă vine în față, nu
  se deschide a doua** (abatere păstrată, W4). În Windows, Windows + E deschide de fiecare dată o fereastră nouă.
  - De ce: biblioteca ține o singură instanță pe nume (`aplicatii.js` › `INST[nume]`; al doilea `deschide('explorer')` o închide pe prima).
    Două Explorer-e montate deodată cer o schimbare de api (instanțe cu cheie proprie), în afara zonelor rundei.
  - Variante: (a) Vasile acceptă (lecțiile folosesc o singură fereastră Explorer); (b) runda următoare cere instanțe multiple în §1.
- [x] **A26-2** (Start la apăsarea tastei Windows) — implementat în runda 30, nu mai e o abatere: `I.emite(…, extra)` + Start la ridicare
  (`runde/30/raport_constructor.md`). Rămâne doar ca notă: închiderea o confirmă criticul rundei 30.
<!-- RUNDA30-WINDOWS:END -->

<!-- RUNDA28-WORD:START (scris de constructorul rundei 28, 21.11.2026 — asistentul comun) -->
- [ ] **A28-1** Asistentul (`aplicatii.js` › `L.asistent`): tastele de editare într-un câmp de text al interfeței (File name, caseta din Start, Font Size, Name Box, adresa, redenumirea) NU mai sunt greșeli; tastarea în document (Word, Excel, PowerPoint) rămâne greșeală.
  - De ce: critic 26 › K2 (indiciul „Alege Paint” apărea după două litere bune pe drumul „Windows, pai, Enter”); critic 24 (File name).
  - Urmarea de aprobat: un elev care scrie mult în caseta greșită (de ex. Font Size în loc de document) primește indiciul doar după 30 s sau după alte greșeli, nu din litere.
  - Variante: (a) așa; (b) doar caseta din Start și File name (o listă de ținte); (c) cum era (literele = greșeli).
- [ ] **A28-2** Asistentul: clicul pe un buton GRI (`indisponibil`) bifează pasul, ca înainte, deși nu face nimic.
  - De ce n-am schimbat: cazurile E / G ale lui O9 (înghețat) iau ca pas Bold-ul gri al PowerPoint-ului la pornire; cu `indisponibil` între refuzuri O9 creștea 13 → 15.
  - Variante: (a) rămâne așa; (b) o rundă `acoperire` schimbă ținta din O9 (un buton activ) și apoi `indisponibil` intră între refuzuri.
<!-- RUNDA28-WORD:END -->
