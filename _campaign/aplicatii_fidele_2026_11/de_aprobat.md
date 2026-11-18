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
