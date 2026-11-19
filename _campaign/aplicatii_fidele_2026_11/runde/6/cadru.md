# Runda 6 · etapa B · Excel · unghiul aspect — CADRU (pasul 2, scris înainte de orice reparație)

## Suprafața aleasă
Aplicația Excel întreagă în biblioteca comună (`aplicatii/excel.js` + `aplicatii/date/excel.json` generat din
`referinte/uia_excel.json` + `profiluri/excel365.json`), pe scheletul și motorul de panglică al lui Word. Azi Excel NU
există în bibliotecă: `LH.aplicatii.deschide('excel')` respinge („nu e încă în bibliotecă”), deci toate scenariile Excel
sunt neexecutabile (O4), gesturile Excel n-au eveniment (O5), asistarea Excel pică (O9).

## Presupuneri (de verificat pe referință, nu pe memorie)
1. Referința Excel are aceeași formă ca a lui Word (`suprafete` cu `tip/eticheta/id_mso/rect_css/copii`), deci
   generatorul lui Word se poate refolosi fără să schimbe `word.json`. (Verificat parțial: 48 de suprafețe, aceleași câmpuri.)
2. Motorul `panglica.js` desenează filele, Backstage, meniurile de clic dreapta și dialogurile Excel fără schimbări;
   ce e specific Excel (bara de formule, grila, filele foilor) stă în `zona_document` și îl desenează `excel.js`, cu
   numele luate din referință (Name Box, Formula Bar, Sheet1, Add Sheet, Select All).
3. Excel real de pe PC-ul profesorului are setările regionale românești: separatorul de listă „;”, cel zecimal „,”
   (scenarii_real: `excel-separator-punct-si-virgula` trece, `excel-zecimale-virgula` = 7,5, `excel-zecimale-punct` = dată).
4. O3/O2/O8 pentru Excel se măsoară pe LECȚII (inventarul nu conține poligonul), deci în runda asta ele nu se mișcă:
   lecțiile Excel încă încarcă simulatoarele vechi (mutarea = etapa C). Se mișcă O4, O5, O9.
5. „Ecranul = starea” (§3) cere ca o celulă în editare să-și arate textul într-un `input` din celula ei; deci și
   `stare().celule` trebuie să arate textul aflat în editare (altfel O4 numără ecran ≠ stare).

## Citiri ale lui „fidel” pentru suprafața asta
- (a) **aspect**: aceleași elemente vizibile, în aceeași ordine și în același loc ca în `uia_excel.json` (1366×768):
  rândul filelor, panglica Home, Name Box + fx + bara de formule, antetele A, B, C… / 1, 2, 3…, Sheet1 + Add Sheet,
  bara de stare (Ready, Normal / Page Layout / Page Break Preview, zoom 100 %).
- (b) **gest → stare finală**: același gest (Enter, Tab, F2, F4, Ctrl+D, tragerea pătrățelului) duce la aceeași stare ca
  în `scenarii_real/excel-*.json` (39).
- (c) **mesaj de eroare**: ce spune Excel la o formulă greșită — nu am referință probată (`excel-separator-virgula` și
  `excel-autocompletare-tab` au `mod_probat: false`).

**Aleasă: (a) + (b) împreună**, cu (a) ca unghi al rundei: un Excel care calculează corect dar arată altfel nu trece
proba omului (R13: „găsește în laborator”), iar unul care arată corect dar nu se poartă la fel e o ușă pictată. (c) pierde:
nu are referință probată; ce face simulatorul acolo intră în `de_verificat.md`.
