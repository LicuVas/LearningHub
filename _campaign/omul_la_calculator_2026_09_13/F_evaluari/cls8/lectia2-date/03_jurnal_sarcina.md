# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- 14 ani, a făcut o singură oră de Excel (lecția 1), citește încet.
- **Nu știe:** ce e un separator zecimal, că Windows are „setări regionale”, că butoanele au alt nume în Office în română, că Ctrl+L din Word nu e Ctrl+L din Excel.
- **Nu vede:** rezolvările pliate când lucrează; obiectivele (pliate); fila Excel și lecția în același timp pe un ecran de 1366×768 (ipoteză) — comută între ferestre.
- **Timp:** 50 de minute, din care ~8 pornirea. Lecția are 4.048 de cuvinte (masuri.json).

## Pașii, în ordine
1. **Încearcă singur** (5 minute promise): tabel cu antet în rândul 1 + 5 elevi. „Media” la un elev cu o singură notă nu are sens — copilul întreabă „ce scriu la medie?”. Formatare: bold, fundal albastru, text alb, borduri, centrare, 2 zecimale. Am făcut-o în `incearca_catalog.xlsx`; LibreOffice pe Windows ro-RO afișează `8,50`, lecția promite `8.50`.
2. **Bonusul:** „Selecteaza celulele A1:D1 si imbina-le” — dar A1:D1 e antetul. După îmbinare, `=COUNTA(A1:D1)` = 1 (era 4): „Nume Elev”, „Nota”, „Media” au dispărut. Exact avertismentul din pliantul de două rânduri mai jos. Elevul care face bonusul își strică tabelul și nu mai are Ctrl+Z dacă a mai tastat ceva.
3. **Atomii 1-7** (citire + 7 întrebări). Atomul 5 îi dă tabelul cu Ctrl+L/Ctrl+E/Ctrl+R — dacă încearcă Ctrl+L pe catalog, Excel deschide „Create Table” (Microsoft, `surse/shortcuts_en.txt`). Atomul 2: „Backspace … sterge ultimul caracter” — în Excel golește toată celula.
4. **Ex. 1:** „Copiaza datele de mai sus in Excel” — blocul cu `|` nu are Tab; lipit, fiecare rând stă în coloana A, `=COUNT` = 0. **Aici se blochează:** „am lipit și e tot în A”. Retastează 20 de valori. Data 15/06/2026: în fișier = 46188 (dată), dar în randare apare `###` (coloană îngustă) — elevul crede că a greșit.
5. **Salvare** `catalog_cls8.xlsx`: lecția nu spune unde; la ora 6 (formatare) fișierul ar trebui regăsit.
6. **Ex. 2 (factura):** dacă tastează ca în model „5 buc”, „3.50 lei”, totalul nu se poate calcula (`Ca_in_model`: produsul dă eroare de valoare, `SUM` = 0). Dacă tastează numere, `=C4*D4` tras în jos dă 17,5 / 12 / 8 / 9,6 / 15 și `SUM` = 62,1 = rezolvarea. Dar exemplul din cerință arată „TOTAL GENERAL: 47.50 lei”, pe care nu îl obține nimeni. Cerința cere „formula =SUM()”, bonusul spune că formulele sunt opționale — două mesaje.
7. **Ex. 3:** compară „Tabelul A” și „Tabelul B” — care nu există pe pagină. Răspunsurile mele în `produs_elev/ex3_raspunsuri_elev.txt`.

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- lipirea blocului cu `|` (tot în coloana A);
- numele butoanelor în engleză, dacă Office e în română;
- 8.5 / 3.50 tastate cu punct pe Windows în română;
- `###` la dată;
- bonusul care șterge antetul;
- „ce scriu la Media?”.
