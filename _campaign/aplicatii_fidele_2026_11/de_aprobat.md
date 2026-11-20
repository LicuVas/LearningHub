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
