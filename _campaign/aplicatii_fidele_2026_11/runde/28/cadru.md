# Cadrul rundei 28 (Word, B-word#3, unghiul gest_tastatura)

## Presupuneri despre suprafață (de verificat, nu crezute)
1. Cele două rânduri `word-*` rămase în O4 după acoperirea r26 sunt defecte ale simulatorului, nu ale referinței: „This Device...” e eticheta reală (capturi_word_brut.json › randuri_meniu), iar spațiul de la lipire e în realul nou (scenarii_real/word-copiere-lipire.json). — confirmat: ambele rânduri cad după reparație, fără alte rânduri noi.
2. Spațiul pus de Word la lipire ține doar de marginea dinainte a textului lipit: decuparea-lipirea (word-decupare-lipire.json) nu primește spațiu după „luni.” deși urmează „Aduceți”. — regula aleasă: spațiu doar înainte, doar la capăt de cuvânt; restul [presupus] R28-1.
3. Asistentul numără azi ca greșeli gesturi de pe drumul bun (refuzul care bifează Save, Alt+↓ în fereastră, literele din caseta Start): cele trei reguli cerute de criticii 24 și 26 sunt toate „indiciul vine după greșeli adevărate”. — sondat pe 5 aplicații (`probe_iesiri/sonda.json`).
4. „Câmp de text” se poate recunoaște fără să ating fișierele altor benzi: `eCamp` din aplicatii.js (câmpurile obișnuite) + câmpul ascuns al casetei din Start (windows.js îl marchează `data-lh-intrare-document`, deci eCamp nu-l vede). — rezolvat prin ținta evenimentului (în afara zonei de lucru, nu `fereastra_app:`).
5. Tastele Ctrl pe document (Ctrl+Backspace, Ctrl+Delete, Ctrl+↑/↓) nu au scenariu `word-*`; singura referință e pagina Microsoft „Keyboard shortcuts in Word” (citită 21.11.2026).

## Citiri ale lui „fidel” pe suprafața asta
- (a) **gest + stare finală**: același gest (tastă, clic, tastă de acces) duce la aceeași stare a documentului / ferestrei ca Word real (O4, scenariile reale, pagina Microsoft).
- (b) **aspect**: aceleași etichete, în același loc (eticheta „This Device...”, casetele Font la ±2 px).
- (c) **asistarea fidelă drumului**: monitorizarea nu pedepsește un gest pe care Word real îl primește ca normal (tastarea în File name, Alt+↓ pe casetă).

**Aleasă: (a)**, pentru că unghiul rundei e gest_tastatura și pentru că O4 (oracolul înghețat) măsoară exact starea după gest; (b) intră doar unde criticul a cerut-o (MINOR 1-2) sau unde eticheta e chiar defectul O4; (c) e ținta 1, dar e regulă de asistare, nu de fidelitate față de Word, deci o judec după O9 și după drumurile lecțiilor, nu după referințe.
