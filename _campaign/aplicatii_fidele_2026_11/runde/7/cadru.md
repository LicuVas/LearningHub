# Runda 7 · etapa B · Excel · unghiul gest_tastatura — CADRUL (pasul 2, înainte de orice reparație)

Suprafața: zona foii Excel din bibliotecă (`aplicatii/excel.js`): celula + editarea ei, tastatura (fizică și cea care
compune), AutoSum, afișarea numerelor, curgerea textului, lățimea coloanelor; apoi bara Acces rapid și banda de jos.

## Presupuneri (de verificat, nu de crezut)
1. Pe telefon tastatura nu ajunge în celulă pentru că focusul pleacă din caseta de intrare la apăsare (clicul implicit al
   browserului mută focusul pe rădăcină). Word nu are problema pentru că oprește `mousedown` (`word.js:2074-2077`).
2. „Zona propusă” de AutoSum se poate face fără fereastră nouă: textul argumentului e SELECTAT în celula în editare, iar
   tastarea și tragerea înlocuiesc selecția (lecția m2-l08:181/196/201). Referința reală nu are lista ▾ de lângă Σ.
3. Afișarea unui număr depinde de lățimea coloanei în unități de cifră (Calibri 11): coloana implicită de 64 px încape
   exact 8 cifre („########”, „8,333333”, „1,23E+09” — `com_r6.json`); constanta TASTATĂ lățește coloana
   (`scenarii_real/excel-zero-in-fata`: „741234567”, 9 cifre, gest real), cea pusă prin COM / rezultatul formulei nu.
4. `=DACĂ(…)` cade pentru că jetoanele numelor de funcții acceptă doar `[A-Za-z]`; Excel îl primește și dă `#NAME?`.

## Citiri ale lui „fidel” pentru suprafața asta
- (a) **gest → stare finală**: același șir de taste / atingeri duce la aceeași celulă primită, cu același text afișat
  (Range.Text) ca în Excel real.
- (b) **aspect**: ce se vede în celulă (cifre, ####, curgerea textului) arată ca în captura reală.
- (c) **mesaj de eroare**: aceeași fereastră de eroare ca Excel (ex. „There's a problem with this formula”).

## Citirea aleasă: (a) gest → stare finală, cu textul afișat ca parte a stării (§5 „text = ce se vede”)
- (b) pierde pentru că unghiul rundei e gest_tastatura și pentru că aspectul se judecă de oracolul O3 / criticul pe aspect;
  textul afișat intră oricum în (a) prin `stare().celule.X.text`.
- (c) pierde pentru că fereastra de eroare a formulei NU există în referința înghețată (`uia_excel.json` n-are dialogul);
  se dă mesajul central (celula nu mai rămâne blocată tăcut) și se trece în `de_verificat.md`.
