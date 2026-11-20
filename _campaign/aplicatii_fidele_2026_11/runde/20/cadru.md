# Cadrul rundei 20 (Word, valul B-word#2, unghiul stare_finala_erori) — scris ÎNAINTE de reparație

Suprafața: ferestrele cu fișiere ale lui Word (Save As, Save As cu PDF, Open, „Save this file”, „Save your changes…”), pe
drumurile din `lectii/vii/m1-l03` (`:189-195`, `:262-290`) și din atelier; ținta 1 = GRAV K1 din `runde/16/critic.md:65-94`.

## Presupuneri despre suprafață (de verificat, nu de crezut)
1. **Tab ajunge pe Save as type imediat după File name** în Save As. Referința dă ordinea nodurilor din arbore
   (`ordine_referinta.txt`, Save As: 22 ComboBox File name → 25 ComboBox Save as type → … → 38 Save → 39 Cancel), nu ordinea
   focusului (UIA nu o dă; critic 16 [FARA_REFERINTA] „Ordinea completă a Tab-ului”). Ordinea vizuală a părții de jos e
   aceeași (File name y 378, Save as type y 403, Save/Cancel y 513). Presupun că cele două coincid pe drumul lecției.
2. **Fereastra e capcană de focus**: în nicio fereastră Windows Tab nu duce focusul afară (learn.microsoft.com/en-us/windows/
   win32/dlgbox/dlgbox-programming-considerations, citată în `api_biblioteca.md:176-177` și în `aplicatii.js:480-482`).
3. **Enter pe un buton cu focusul îl apasă pe acela, nu butonul implicit** (aceeași sursă: butonul cu focusul devine
   butonul implicit; PowerPoint o face deja, `powerpoint.js:2140-2147`, criticul 13 › T1). Space apasă butonul / bifează
   caseta cu focusul. Fără asta, Tab până la Cancel + Enter ar SALVA (starea finală greșită, fără niciun semn).
4. **Esc = Cancel** în fiecare fereastră (IDCANCEL, aceeași sursă). În „Save your changes…” (fereastră Office, nu `#32770`)
   e [presupus]: în Word real Esc închide întrebarea și lasă documentul deschis, ca Cancel (scenarii_real/word-x-nesalvat-
   cancel.json e făcut cu clic pe Cancel, nu cu Esc).
5. Cârligul comun `I.tabFereastra` (`aplicatii.js:510-518`) oprește doar pe Button / SplitButton / CheckBox / RadioButton /
   MenuItem / TabItem / Edit / ComboBox / Spinner. Lista „Vizualizare elemente” și panoul din stânga NU sunt opriri (în
   Windows sunt). Nu schimb cârligul (suplimentul), deci lista rămâne fără Tab: o notez, nu o repar aici.

## Citiri ale lui „fidel” pe suprafața asta
- **(a) Stare finală:** după orice drum (Tab, Enter, Esc, Cancel, nume greșit) `stare()` și ecranul sunt cele din Word
  real: fișierele de pe disc, documentul, numele, titlul, `dialog.apasat`, numărul de documente.
- **(b) Gest:** fiecare tastă face ce face în fereastra Windows (Tab → controlul următor; Enter → butonul cu focusul /
  implicit; Esc → Cancel) și emite evenimentul §4 cu ținta = focusul din momentul tastei și `activat` = butonul apăsat.
- **(c) Mesaj de eroare:** la un gest refuzat (nume interzis, „already exists”) apare semnul, fereastra rămâne deschisă cu
  focusul în File name, iar asistentul nu trece pasul.

## Citirea aleasă: (a) stare finală, cu (b) doar cât e nevoie ca starea să iasă corect
- Unghiul rundei e `stare_finala_erori`, iar GRAV K1 e tocmai o stare finală greșită (un .docx nedorit + un rând gol în
  loc de .pdf). (b) intră doar unde schimbă starea: Tab rămâne în fereastră, Enter/Space pe butonul cu focusul, Esc = Cancel
  (cu `apasat` și `activat`).
- (b) întreagă (ordinea exactă a Tab-ului, lista ca oprire) pierde: ordinea nu e în referință, iar lista ar cere schimbarea
  cârligului comun, interzisă în runda asta → rânduri `R20-…` în `de_verificat.md`.
- (c) pierde: refuzul la nume interzis lasă deja fereastra deschisă și focusul în File name (proba la pornire,
  `E1_*`); asistentul care trece pasul la refuz e în `aplicatii.js` (comun, MINOR vechi din runda 5) — nu e al benzii Word.
