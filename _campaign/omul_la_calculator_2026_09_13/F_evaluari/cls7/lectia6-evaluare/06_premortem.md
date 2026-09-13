# 06 — Pre-mortem (U14) și explicații alternative (U13)

„Ora de evaluare din 17.11.2026 (VII A/B) / 20.11.2026 (7 MA) a eșuat. De ce?”
(Schița cu 5 motive a fost scrisă după pasul 1; mai jos, fiecare cu verificarea făcută.)

## U14 — cinci motive, fiecare verificat
1. **Testul cere imaginea, care nu s-a predat.** VERIFICAT, ADEVĂRAT. `u1_predat_vs_cerut.txt`: în lecțiile 1-5 „Wrap Text” 0, „Crop” 0, „Picture Styles” 0; „Pictures” doar numit în lecția 1 (lista butoanelor Insert, r.328-329). În test: atomul „6b”, Ex.1 pct. 6, Ex.3 pct. 5, grila 11 cu cheia „ai invatat-o in Modulul 1”.
2. **Nu există barem.** VERIFICAT, ADEVĂRAT. Grep „barem|punctaj” = 0 (`u1_predat_vs_cerut.txt`, `u9_grep_spec.txt`); nici pe disc nu există un test/barem VII-U1 separat (`u13_barem_separat.txt`: `teste_sumative.json` are doar „V-U1”; `materiale/print` are doar `Test_BAREM_V-U1`). Planul cere „test_unitate, barem”.
3. **Nu încape.** VERIFICAT, ADEVĂRAT pentru ce cere lecția: tot = 106,8 min, **57,4 la ritm dublu**; citit + grile + Ex.1 = 67,7 (37,8 dublu); fără citit, doar Ex.1 = 26,7 (`u12_sensibilitate.txt`). Se poate ține doar dacă profesorul taie recapitularea și alege un singur exercițiu.
4. **Chei / rezolvări greșite.** VERIFICAT, PARȚIAL. Cheile celor 11 grile sunt corecte față de text (`u9_chestionare_lungimi.json`); dar: Ctrl+A „in tabel selecteaza tot tabelul” e greșit (`surse/s05`), rezolvarea Ex.2 (3x6) contrazice cerința (3x5) (`07_redeschis.json`), Ex.3 „Square + legenda dedesubt” nu iese (`04_a_doua_cale.json`), „Ctrl+A apoi Ctrl+J” strică titlul centrat (`u1_iesire.json`).
5. **Grilele nu măsoară nimic + la Izvoare nu sunt calculatoare.** VERIFICAT pentru grile: la răspuns greșit motorul arată răspunsul corect, scorul stă în localStorage-ul PC-ului (`surse/s06_motor_grile.txt`); răspunsul e în paragraful de deasupra (`innerText.txt` r.258 vs r.274). Pentru Izvoare: **nu se poate verifica fără sală**, pentru că dotarea e necunoscută (B_context §3) — partea practică (Ex.1-3) nu are variantă pe hârtie.

## U13 — explicații alternative pentru semnalările grave
| Semnalare | Explicația alternativă | Observația care le deosebește | Rezultat |
|:--|:--|:--|:--|
| Imaginea nu s-a predat | Vasile o predă la ora 4/7 din alt material, nu de pe site | Există pe disc material VII pentru imagine? Planul pune imaginea la ora 4 și 7 („Obiecte: text, imagini, tabele”; „Formatarea imaginii”) | Planul DA o cere; site-ul NU o predă; `materiale/continut/clasa_VII_M1.json` există dar nu l-am deschis ca sursă de predare. Oricum, **grila 11 afirmă pe site că lecțiile 1-5 au predat-o** — fals indiferent de ce face profesorul la clasă. Rămâne `blocant` pentru pagină, cu nota că profesorul poate acoperi golul. |
| Nu există barem | Baremul e în altă parte (ca la clasa V: `Test_BAREM_V-U1.pdf`) | Căutare pe disc (es.exe) + `teste_sumative.json` | `u13_barem_separat.txt`: doar V-U1. Nu există. |
| Nu încape | Lecția nu e gândită să fie făcută integral; elevul alege un nivel | Textul lecției: „Parcurge toate intrebarile si rezolva exercitiile practice” | Lecția cere tot; varianta „un nivel, fără citit” încape (26,7-33,3 min). → `important`, nu `blocant`: se repară prin tăiere. |
| Legenda lângă imagine | Artefact al randării LibreOffice | Principiul Word, text brut: „Square” = textul înconjoară imaginea (`surse/s02`) — paragraful legendei e text | Comportamentul e al încadrării, nu al randării; poziția exactă în Word = NEVERIFICATĂ (fără Word pornit). `important`. |
