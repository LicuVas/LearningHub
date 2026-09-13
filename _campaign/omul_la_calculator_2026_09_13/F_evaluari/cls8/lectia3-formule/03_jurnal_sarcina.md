# 03 — Jurnalul sarcinii (U1, U11, U7)

## Constrângerile elevului pe care îl joc (U11)
- 14 ani, a VIII-a, a avut 3 ore de Excel (interfață, tipuri de date, formatare); **nu știe** ce e o funcție, nu a auzit de „fill handle”/„drag handle”, nu știe că Windows-ul lui poate fi pe română (virgulă zecimală).
- **Nu vede** rezolvările pliate când lucrează; vede doar „Ce rezultat apare?”.
- Are **50 de minute**, din care primele ~8 se duc pe pornire și logare; laboratorul (Brauner, sala „1 (TIC)”) are o dotare necunoscută; la Izvoare probabil nu are calculator deloc.
- Blocajele de mai jos sunt **ipoteze AI** (simularea e prea competentă) → trecute în `anexa.blocaje_probabile_ipoteza` ca întrebare pentru Vasile.

## Povestea pașilor (fișierele în `produs_elev/`, recalculate în `recalculat/`, randate în `randat_xlsx/`)
1. **Încearcă — lipirea tabelului.** Blocul copiabil are Tab (butonul copiază `textContent`), deci se împarte corect pe coloane. Defectul din lecțiile 1-2 **nu se repetă** aici — nici la Ex. 1 (`=COUNT(B2:E6)` = 20), nici la Ex. 2.
2. **E2 `=B2+C2+D2`** → 27, ca în indiciu. Trag în jos: E3 = 21, E4 = 29 (am verificat rândurile 2, 3 și 4, nu doar primul).
3. **F2 `=E2/3`** tras în jos → 9, 7, 9,666667. Pe ecranul elevului cu Windows în română apare exact „9,666667” (randarea LibreOffice pe acest PC ro-RO) — trei formate diferite în aceeași coloană. Aici un începător întreabă „am greșit?”.
4. **E5 `=SUM(E2:E4)`** → **77**. Deschid ajutorul „Blocat la pasul 5?”: *„Rezultatul ar trebui sa fie 78 (27 + 21 + 29).”* **Blocaj sigur**: elevul care a lucrat corect citește că a greșit, refolosește formula, verifică celulele. Același catalog în atomul 6 al lecției spune 77 — lecția se contrazice singură.
5. **Bonus** C3 = 10 → E3 = 25, F3 = 8,33, E5 = 81: se actualizează, cum promite.
6. **Ex. 1** — F2 `=SUM(B2:E2)` tras la F6, G2 `=F2/4` tras la G6: 30/37/26/37/28 și 7,5/9,25/6,5/9,25/7 — identic cu rezolvarea. Verificarea „media **7.50**” nu apare pe ecran: formatul General dă „7,5” (ro) sau „7.5” (en). Un elev pedant crede că e altceva.
7. **Ex. 2** — C3 `=B3*$B$1` tras la C7 → 1260, 3360, 980, 420, 560, C8 = 6580; cu B1 = 25 → 5875. Totul corect.
   Apoi fac ce ar face un elev curios la „De ce folosim $B$1 și nu B1?”: încerc `=B3*B1` și trag. **C4 = #VALUE!** (B2 are textul „Pret/elev”), **C5 = 1575** (35 × 45 — număr greșit care arată a răspuns). Rezolvarea spune „celule goale”. Explicația din lecție nu se potrivește cu ce vede elevul; și ratează lecția mai valoroasă: eroarea tăcută (1575) e mai periculoasă decât #VALUE!.
8. **Atomul 7 (TVA)** — tabelul cu `=B2*$B$1` și cota **19%** dă 0,95 / 0,57 / 1,52. Cota standard e **21%** din 01.08.2025 (Legea 141/2025, `surse/tva_L141_2025.txt`); chiar paragraful „Deschidere” al lecției vorbește de „TVA de la 19% la 21%”. Contabilul din fața lecției se oprește aici.
9. **F4** — documentația Microsoft confirmă tasta, dar arată patru tipuri de referință; lecția scrie „B1 → $B$1 → B1”. Elevul care apasă F4 de două ori vede `B$1`, nu `B1`, și crede că a stricat ceva.
10. **Ex. 3** — răspunsurile în `produs_elev/ex3_raspunsuri_elev.txt`; 18,67 vs 8 confirmate de LibreOffice.
11. **Provocarea** — E1 fără `$`: C3 = 50 (reducerea „dispare” în tăcere, E2 e gol), cu `$E$1` = 42,5. Merge ca exercițiu de descoperire.
12. **Întrebările atomilor** (`u3_iesire.json`): atomul 2 (operațiile) întreabă de actualizarea automată, predată în atomul 3; atomul 4 (referințe relative) întreabă de `=SUM(B2:B6)`, predat abia în atomul 6; atomul 5 (ordinea operațiilor) întreabă de copierea cu referințe relative — ordinea operațiilor nu are nicio întrebare.

## Unde se blochează un începător (ipoteze, de confirmat la oră)
- „Mie mi-a dat 77, nu 78” (pasul 5 din Încearcă) — pe tot rândul de elevi.
- „Nu găsesc drag handle-ul” — cuvântul nu există în Excel; în română e „instrumentul de umplere”.
- „De ce la Ion scrie 7 și la Maria 9,666667?” și „7,5 nu 7.50”.
- „Mi-a dat #VALUE!” la încercarea fără `$`.
- Ex. 3 cere „bara de formule”, folosită o singură dată, neexplicată.

## Puncte de verificare vizibile
Lecția are întrebări cu rezultat numeric („Ce rezultat apare?”, „Suma Anei trebuie să fie 30”, „6580 lei”) — bune pentru „ridicați mâna când vedeți 27”. Două din ele sunt însă greșite sau depind de setarea regională (78; 7.50).

## U7
`u7_redeschide.py` redeschide fișierele într-un proces nou → `07_redeschis.json`: formula din fișier + valoarea LibreOffice + textul afișat din PDF.
