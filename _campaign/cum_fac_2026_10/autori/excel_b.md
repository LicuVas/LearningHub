# Autor excel_b — Excel, clasa a VIII-a, lecțiile 8-13 (10.10.2026)

Fișier: `cum-fac/_sursa/fise_excel_b.json` — **34 de fișe**. Verificatorul: `fișe: 34 · fișiere: 1` / `0`.

## Fișele, pe lecții
- **L8 (7):** SUM, AVERAGE, MAX, MIN (scrise de mână); Σ Însumare automată pentru sumă; săgeata ▾ de lângă Σ (Medie/Max/Min, cu zona reparată); mânerul de umplere (copierea funcției în jos/spre dreapta, mai multe deodată). Mânerul de umplere apare prima dată în L8 (în VIII/1-7 nu e), deci fișa e a mea.
- **L9 (5):** condiția TRUE/FALSE (semnele, tastele < >); IF cu două texte (tastele ; și ", virgula pe setări englezești); ghilimelele drepte / repararea #NAME? din IF (și numerele fără ghilimele); IF pe rezultatul altei formule (zecimala cu virgulă); testul la limită.
- **L10 (5):** sortare crescătoare (A→Z / mic→mare / vechi→nou); descrescătoare (clasament); Sort Warning → Expand the selection; My data has headers; două criterii cu Add Level.
- **L11 (12):** grafic cu coloane; anii jos pe axă (A1 gol sau apostrof); mutare; mărire; ștergere; bare (Clustered Bar); linie; schimbarea tipului; Comutare rând/coloană; titlul; etichetele de date; legenda pornită/oprită; graficul se schimbă din tabel.
- **L12 (3):** grafic radial (Pie) — sursa e pasul „real”, singurul din L11-L12 care dă butonul complet (Insert Pie or Doughnut Chart › Pie); sumarul sub un rând gol (nu se amestecă la sortare); nota din punctaj (=SUM(B2:B6)+10, apoi /10).
- **L13 (1):** repararea #NAME? dintr-o funcție (SUM, nu SUMA).

## Gesturi văzute în lecții pentru care NU am făcut fișă, și de ce
1. **Celula lăsată goală pentru un absent (nu 0)** (L8 p4): e o regulă despre AVERAGE, nu un gest separat. E în `atentie` la fișa AVERAGE.
2. **Corectarea zonei propuse de Σ** (L8 p5): e pas în cele două fișe Σ, nu fișă proprie.
3. **Selectarea datelor pentru grafic** (L11 p2): e pasul 1 al fiecărei fișe de grafic (selectarea zonei e a altui autor, L4).
4. **Alegerea tipului potrivit de grafic** (L11 p4, L13 p5): e o judecată, nu un gest. Regula e în `atentie` la fișele cu linie/bare/radial.
5. **Metoda „ce date am, ce calculez, ce decid”** (L9 p6, L13 p4): e o metodă, nu un gest. Am pus în fișă doar testul la limită, care e gest.
6. **Verifici dacă e formulă sau număr scris de mână** (L13 p3, p6): e același gest ca „vezi formula în bara de formule” din L7, care e al celuilalt autor.
7. **Structura lucrării, rotunjirea, nivelurile, grila** (L12 p2, L13 p2-p5): sunt idei, nu gesturi. Partea de Excel e în fișa „nota din punctaj”.
8. **Repetate din VIII/1-7, fără variantă nouă** (ale celuilalt autor): Enable Editing, F12 Salvare ca + Confirm Save As/No, Ctrl+S, Blank workbook, trecerea între foi, aldin B, Toate bordurile, Golire totală, Ctrl+Z, formulele cu operatori (=B2*5+C2*2, =B2*C2), zecimala cu virgulă, scrisul unui text într-o celulă (concluzia, sursa).
9. **#DIV/0!** (L8 p4, L13 p6): lecția spune doar ce înseamnă, nu cum îl repari. E în `atentie` la fișa #NAME?.

## Nesiguranțe
- **Câte fișe la grafice:** mutarea, mărirea și ștergerea sunt 3 fișe separate, după regula 1. Un judecător le-ar putea vrea împreună.
- **Bare (Clustered Bar):** numele vine din legenda capturii L11 p4 („Clustered Bar, din aceeași listă cu coloanele”). Lecția nu dă numele în română, așa că fișa are doar numele englezesc.
- **Legenda oprită:** lecția spune „pornești sau oprești” și că butonul + „are bifele”. „Scoate bifa ca s-o oprești” e citirea mea a acestor două fraze.
- **Radialul:** rezultatul („valoarea cea mai mare are felia cea mai mare”) se sprijină pe o întrebare de verificare din L12 („mâncarea ia cea mai mare felie”), nu pe textul unui pas.
- **Fișa „nota din punctaj”** e mai mult o aplicare (SUM + împărțire) decât un gest nou. Am păstrat-o pentru că un elev chiar caută „cum îmi calculez nota”.
- **Capturi `null`** (nu există o captură care să arate exact gestul în pasul-sursă): AVERAGE, MAX, MIN, IF, testul la limită, mutare, ștergere, schimbarea tipului, legenda, actualizarea din tabel, radialul, nota.
- **Semnele < în pași** sunt scrise `&lt;`, pentru că verificatorul ia un `<` liber drept etichetă HTML. Dacă pagina afișează pașii ca text, nu ca HTML, s-ar vedea `&lt;` (fișele cu condiția și cu testul la limită).
- **Ciocniri de id-uri:** fișele celuilalt autor încă nu există, deci n-am putut verifica. Id-urile mele au cuvinte specifice (`excel-functia-…`, `excel-sortare-…`, `excel-grafic-…`, `excel-autosum-…`).
