# Unghiurile criticilor — făcute cu /promptExpert (10.11.2026)

## STAGE 0 — treapta
**High-stakes**: reparațiile intră în simulatoare COMUNE (un fișier = până la 22 de lecții), publicate pentru elevi.
⇒ tot lanțul, inclusiv STAGE 5 (un cititor rece pe unghiuri, înainte de pornire).

## STAGE 1 — cadrul, înainte de răspuns
Presupuneri:
1. „defect similar” = o comandă NECESARĂ există în simulator, dar elevul nu o poate vedea/folosi (tăiată, acoperită, în afara ecranului, de neatins pe telefon);
2. „pe site” = LearningHub public; grosul riscului stă în `lectii/_sim/` (106 simulatoare, 116 lecții);
3. ecranele reale: laborator 1366x768 (fereastra ~1366x657), uneori zoom Windows 125% (≈1093x525 CSS), telefoane ~390 px;
4. reparația bună păstrează aspectul Windows 11 RO (decizia de la Notepad: meniul deschis iese din fereastră).

Citiri posibile:
- A) exact aceeași greșeală (meniu tăiat de overflow:hidden) în alte simulatoare — prea îngustă: o acoperă deja oracolul, mecanic;
- B) orice comandă de care elevul are nevoie și n-o poate folosi, din orice cauză de așezare — **ALEASĂ**;
- C) orice defect vizual — prea largă: bucla n-ar mai converge (cosmetica nu se termină niciodată).

## STAGE 2 — pentru / contra / adevărul incomod
- **Pentru:** oracolul prinde mecanic clasa A pe 116 lecții × 2 ecrane; criticii acoperă ce el nu declanșează.
- **Contra:** criticii raportează ușor fals-pozitive (un meniu care ACOPERĂ bara de sub fereastră e normal, ca în Windows);
  o reparație într-un simulator comun poate strica alte lecții; „overflow:visible” poate lăsa meniul peste alte comenzi.
- **Adevărul incomod:** oracolul vede doar ce declanșează euristica lui (aria-haspopup, data-meniu, ▾…). Un 0 la oracol
  NU înseamnă „nu mai e nimic”; nu acoperă dialogurile deschise de comenzi, meniul contextual, modul test, zoomul 125%.

## STAGE 3 — artefactul: unghiurile (fiecare = ce deschizi · ce măsori · ce ar însemna „defect” · dovada)
Regula comună tuturor: **dovada = elementFromPoint pe centrul comenzii** după ce derulezi DOAR pagina (window.scrollTo),
NU un clic Playwright (clicul Playwright derulează și cutiile cu overflow:hidden, deci trece pe defect). Rețeaua externă
blocată (regula 24: `ctx.route` care abandonează tot ce nu e file:/127.0.0.1/localhost). Exercițiul se deschide cu
`JocMotor.test.deblocheaza()`, `.lvl[data-l=N]`, `JocMotor.test.pas(k)` / `.atelier()`, `.exercitiu(k)`.
NU e defect: un meniu deschis care acoperă ce e sub el; o comandă la care ajungi derulând o cutie care chiar se derulează.

1. **Dialogurile deschise de comenzi** (Salvare ca, Deschidere, Confirmare, Proprietăți, Inserare, Formatare…): deschide-le prin
   comenzile simulatorului, la 1366x657 și Pixel 7. Defect = butonul de confirmare/anulare, câmpul de nume sau lista de
   foldere nu se văd fără a derula o cutie care nu se derulează. Dovada: comanda, cutia care taie, înălțimile.
2. **Meniul contextual și listele derulante proprii** (clic dreapta, ▾, galerii de culori/forme/stiluri, submeniuri ›):
   deschise lângă marginea DREAPTĂ sau de JOS a ferestrei, pe telefon. Defect = o parte iese din fereastră/ecran și nu se poate atinge.
3. **Zoomul Windows 125%** (viewport 1093x525, deviceScaleFactor 1.25): același oracol, alt ecran. Defect = comandă necesară
   tăiată/acoperită doar la zoom. Dovada: aceeași formă ca oracolul.
4. **Bara fixă a lecției și butoanele plutitoare** (bara de jos P1…Î5, antetul, „Sunt elev — mă înscriu”, fereastra mică):
   acoperă comenzi ale simulatorului când acestea stau jos în ecran și pagina nu mai coboară? Defect = elementFromPoint dă bara.
5. **Modul test (întrebările qs) și „Acum în aplicația adevărată”**: aceleași simulatoare în alt cadru (lățime mai mică,
   fereastra mică). Defect = ce e folosibil în exercițiu devine tăiat/acoperit acolo.
6. **Atingerea pe telefon**: comenzi care apar DOAR la hover; ținte de atins sub 24x24 px lipite de altele; trageri fără
   alternativă cu atingeri. Defect = sarcina exercițiului nu se poate duce la capăt pe Pixel 7.
7. **Ferestrele multiple pe ecran îngust** (Notepad + Explorer + browser, Gmail, Colab): fereastra de care e nevoie e ascunsă și
   nimic nu spune cum o aduci; comutatorul e acoperit; două ferestre se suprapun.

Fiecare critic întoarce: lecția + exercițiul + ecranul + comanda + cauza (selectorul cutiei / elementul care acoperă) +
cum a măsurat. Fără dovadă măsurată = nu se raportează.

## STAGE 4 — ancorare
Afirmațiile se verifică pe disc/în browser (oracolul, elementFromPoint), nu din citirea CSS-ului. Cifrele din contract
vin din rulări (`oracol_controale_taiate.py`: VIII/18 vechi = 52, reparat = 0).

## STAGE 5 — cititorul rece (subagent fără context, 10.11.2026)
Verdict: „setul nu converge și aduce fals-pozitive; nicăieri nu scrie ce comenzi sunt NECESARE”. Preluat:
1. „necesară” = comanda numită în enunț / ajutor / explicație sau folosită în rezolvarea exercițiului (sol/rezolvare);
   restul (iconițe decorative ale panglicii etc.) nu se raportează din unghiuri — doar oracolul le numără, mecanic;
2. zoomul 125% a trecut în oracol (al 3-lea ecran); bara fixă e deja prinsă de oracol (ACOPERIT) ⇒ unghiurile 3 și 4 scoase;
   criticii primesc lista oracolului ca „defecte deja știute”;
3. deschiderea în probe: `page.mouse.click` pe coordonate verificate întâi cu elementFromPoint; derularea cutiilor
   readusă la 0 înainte de măsurare; pe telefon, apăsarea lungă nu se emulează ⇒ se caută o cale vizibilă;
4. clasă nouă: comenzi DOAR din tastatură (Ctrl+S, Ctrl+C, F5, Delete…) cerute de exercițiu pe telefon, fără altă cale.
Neacoperit, spus în raport: tastatura de pe ecranul telefonului care acoperă câmpul de nume / butonul OK (Playwright n-o simulează).

## UNGHIURILE FINALE (ordinea = ordinea rundelor; treapta normală folosește primele 4)
Prima propoziție a fiecăruia, comună: „Defect = o comandă NECESARĂ exercițiului (numită în enunț/ajutor/explicație sau
folosită în rezolvare) pe care elevul nu o poate vedea sau folosi. Dovada = elementFromPoint pe centrul ei după ce
derulezi doar pagina și cutiile care chiar se derulează; nu un clic Playwright.”
1. Defectele oracolului (`oracol_baza_25lectii_dupa_details.json`, 188): grupează-le pe CAUZĂ în simulatorul comun
   (panglica `pg`: casete `pg-camp` care taie săgeata ▾, eticheta `pg-txt` peste butoane, galeria de stiluri `pg-dala`
   peste vecini) și propune reparația o singură dată, în componenta comună, cu aspectul Windows 11 păstrat.
2. Dialogurile deschise de comenzi (Salvare ca, Deschidere, Confirmare, Proprietăți, Inserare, Formatare…), 1366x657, 1093x525, Pixel 7.
3. Telefonul: comenzi cerute de exercițiu care merg doar din tastatură sau doar la hover/apăsare lungă/tragere, fără cale vizibilă.
4. Meniul contextual, listele și submeniurile deschise lângă marginea dreaptă/de jos, plus ferestrele multiple pe ecran îngust.
5. Modul test (întrebările qs) și „Acum în aplicația adevărată” (fereastra mică): aceleași simulatoare, alt cadru.
