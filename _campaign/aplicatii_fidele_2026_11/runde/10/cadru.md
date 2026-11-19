# Runda 10 · B-excel · cadrul (pasul 2, scris înainte de reparații)

Suprafețele: graficul nou (A1), bara de stare cu o selecție de numere (A2), formula cu zonă confirmată prin „We found a typo…” (E5).

## Presupuneri (de verificat pe disc, nu de crezut)
1. Locul graficului din `com_r9.json` (H11) e locul de pe PC-ul din laborator la 1366×768. **Răsturnată:** `com_r10_b.json` arată că
   locul urmează zona utilă a ferestrei, iar fereastra invizibilă din COM are 754 px de grilă (la 768 px înălțime lasă 660 px de grilă, deci aproape fără panglică). Pe grila de
   1338×470 a simulatorului (cât lasă panglica la 1366×768), aceeași formulă dă G5.
2. Excel nu micșorează graficul când fereastra e mică. **Confirmată:** `com_r10_c.json`, ferestre de 168,6 și 219 pt înălțime →
   360 × 216 pt, top 0.
3. Bara de stare din referință poate fi reprodusă din `bara_stare#selectie_numere`, cu lățimile date de text. Referința are un
   singur caz (B2:C4 numere), deci restul cazurilor sunt presupuneri (R10-2).
4. Vărsarea poate trăi în motorul de calcul fără să scrie celule noi în `f.cel`: celulele vărsate se calculează din ancoră. Așa,
   Ctrl+Z, recalculul și sortarea nu au nevoie de cod separat.
5. Graficul de pe telefon nu poate avea și colțul, și titlul pe ecran dacă e mărit de 1,7 ori ca grila (816 px > 329 px vizibili;
   titlul e la mijloc, la 408 px).

## Citiri ale lui „fidel”
- **Aspect** (locul exact al graficului, butoanele din bara de stare la pixel): verificabil cu COM și cu referința UIA.
- **Gest → stare finală** (Alt, N, C, Enter → un grafic în stare și pe ecran în același loc; Yes → D2:D6 vărsate; Shift+săgeți →
  rezumatul): verificabil cu proba.
- **Ce vede elevul imediat** (pe telefon și în fereastra mică): graficul apărut se vede, fără să caute.

## Citirea aleasă
Gest → stare finală, cu aspectul măsurat acolo unde există număr (COM pentru loc, UIA pentru bara de stare). „Ce vede elevul” e
judecat în limitele lui Excel: unde Excel însuși taie graficul (fereastra mică), îl tăiem și noi și verificăm că restul se vede
după derulare. Pierd: „aspect la pixel” singur, care ar fi cerut H11 fără să țină seama că fereastra COM nu e cea din laborator;
și „ce vede elevul” singur, care ar fi cerut micșorarea graficului, lucru pe care Excel nu-l face (com_r10_c).
