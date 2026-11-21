# Runda 29 — cadrul (B-excel#3, unghiul stare_finala_erori)

Suprafața: **foile registrului** (filele de jos, meniul filei, Move or Copy, Tab Color, Home › Delete ▾) pe drumul lecției viii/m1-l03 (pasul 4-5, exercițiile :220, :230, :247, :255, :266, atelierul :288, :306, :321), plus Ctrl+PageDown / PageUp și Alt într-o fereastră.

## Presupuneri (de verificat, nu de crezut)
1. Ștergerea foii golește istoricul Ctrl+Z (Excel: „ștergerea nu se anulează”, m1-l03:239, :312). Lecția spune doar că Ctrl+Z nu aduce foaia; că istoricul întreg se pierde e [DEDUS] → R29-3.
2. Fereastra de confirmare și refuzul la singura foaie arată ca mesajele „Microsoft Excel” din referință (`dialog.eroare_formula`: titlu verde, pictogramă, text, butoane jos-dreapta). Confirmarea are captura lecției (`img/confirma-stergerea.webp`), refuzul n-are nicio captură → R29-1 / R29-2.
3. Lista „Before sheet” din Move or Copy are foile registrului în ordine + „(move to end)” (`img/mutare-sau-copiere.webp`), iar rândul ales la deschidere e foaia activă [DEDUS] → R29-4.
4. Paleta Tab Color e aceeași galerie de culori ca Fill Color (`uia_excel.json › lista.CellFillColorPicker`: Theme Colors, Standard Colors, More Colors...), cu „No Color” în loc de „No Fill” [DEDUS] → R29-5.
5. Tragerea filei: foaia se lasă înaintea filei peste a cărei jumătate stângă e mouse-ul; Ctrl ținut la eliberare = copie (m1-l03:244).

## Citirile lui „fidel” aici
- **(a) aspect**: filele, fereastra de confirmare și lista arată ca în captură.
- **(b) gest**: același gest (clic dreapta › Delete, tragerea, Ctrl+tragere, Enter / Esc în fereastră, Ctrl+PageDown) are același efect.
- **(c) stare finală + mesaj de eroare** (unghiul rundei): după gest — inclusiv după gestul greșit (singura foaie, Cancel, Ctrl+Z după ștergere, mutare cu Create a copy bifat din greșeală) — foile, ordinea, foaia activă, culorile și fereastra afișată sunt cele din Excel, iar `stare()` le arată.

**Aleasă: (c)**, cu (b) ca mijloc. De ce pierd celelalte: (a) fără (c) e o poză care nu face nimic — exact G25-1 (meniul arăta bine, dar Delete tăcea); (b) fără starea finală nu spune dacă elevul ajunge la „Septembrie, Octombrie, Noiembrie” cerut de testele lecției. Aspectul ferestrelor desenate fără referință rămâne la R29-1 / R29-2 (capturi).
