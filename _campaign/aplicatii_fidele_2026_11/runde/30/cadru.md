# Runda 30 (B-windows#2, ciclul paralel D) · cadrul, scris înainte de reparații

## Presupuneri despre suprafață (shell-ul Windows: desktopul, bara, Start, fereastra Explorer)
1. **Focusul tastaturii e o parte a stării.** După orice gest care închide un câmp (redenumirea pe desktop, caseta din Start), tastele
   trebuie să ajungă tot la aplicație. Dacă focusul cade pe `<body>`, aplicația „tace” la F2 / Delete / tasta Windows (N1).
2. **Tasta Windows ține de shell, nu de aplicația din fereastră.** Ce se apasă cu ea ținută (literă, Spațiu, cifră, punct, Tab, săgeată)
   e o scurtătură a sistemului, chiar dacă focusul e într-un Explorer montat (N2, W4).
3. **„Dosarul galben” din lecții = Explorer-ul bibliotecii.** Lecțiile (viii/m2-l14, m2-l15, m3-l16) spun „Windows + E” și „clic pe
   dosarul galben”. Un mesaj „nu e simulată” pe acest drum oprește lecția (W4).
4. **Start se deschide la ridicarea tastei**, nu la apăsare: Windows + E nu deschide Start nici pentru o clipă (A26-2). [presupunere
   de comportament, fără captură UIA a momentului; o pun la de_verificat]

## Citiri ale lui „fidel” pentru suprafața asta
- **A. Aspect** (unghiul rundei): dreptunghiurile barei, Start-ului și ferestrei Explorer la ±2 px față de `referinte/uia_windows.json` /
  `uia_explorer.json`, fonturi, pictograme, la 1366×768, 125 %, 360 / 390, 1920×1080.
- **B. Gest + stare finală**: gestul elevului (tastă, clic, atingere) produce evenimentul §4 și starea §5 pe care le-ar produce Windows,
  iar ecranul = starea.
- **C. Mesaj**: tot ce nu e simulat spune „nu e simulat” cu numele comenzii, nu cu o etichetă internă.

## Citirea aleasă și de ce
- **B, cu C pentru resturi.** Cele 3 GRAV deschise (N1, N2, W4) sunt toate de gest / stare: elevul apasă și nu se întâmplă nimic sau se
  întâmplă altceva. Aspectul (A) contează doar dacă elevul ajunge la suprafață; azi nu ajunge la fereastra Explorer din bară.
- **A pierde ACUM** pentru că: (1) suplimentul pune N1, N2, W4 înaintea unghiului; (2) fereastra Explorer montată nu are referință de
  aspect a ferestrei întregi la 1366 (captura e de pe alt ecran, 1534×814); se compară doar conținutul Explorer-ului, care e al benzii r27.
  Ce măsor totuși pe aspect: fereastra montată umple corpul la 0 px, nu iese din ecran la 1366 / 360 / 390, butoanele ei rămân pe ecran.
- **C** intră doar la MINOR „start_fundal” (text intern în fața elevului).
