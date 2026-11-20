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
