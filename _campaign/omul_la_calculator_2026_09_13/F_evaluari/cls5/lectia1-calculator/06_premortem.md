# 06 — Pre-mortem (U14) și explicații alternative (U13)

*Schița scrisă după pasul 1 (citit înapoi); verificările adăugate la pasul 5.*

**„Vineri 25.09.2026, ora 9:00, 5AM/5M. Ora a eșuat.” De ce?**

| # | Motivul | Verificarea făcută | Rezultat |
|--:|:--|:--|:--|
| 1 | Nu s-a ajuns la exerciții: citirea celor 6 pași + 10 întrebări a mâncat ora. | `u7_u12_verifica.py` → `u12_sensibilitate.txt` + poarta | **Confirmat parțial:** 78,3 min cu exerciții la ritmul provizoriu; doar citire + întrebări = 50,9 min. La ritm dublu încape (43,1). |
| 2 | Primele 10 minute pierdute pe provocarea „caută calculatoare în casa ta” — în clasă. | Citit `innerText.txt` rândurile 55-80 + `ecran_prima_vedere.png` | **Confirmat:** sarcina cere camera, bucătăria, rucsacul, buzunarul; Exercițiul 2 cere tot „in casa ta”. |
| 3 | Elevii au scris răspunsurile, profesorul nu le-a putut vedea / s-au pierdut. | Playwright `u7_salvare_raspuns.py` | **Confirmat:** salvare doar în `localStorage`; profil nou = gol. Dacă PC-urile se resetează la repornire → **nu se poate fără sală**, pentru că nu știm configurarea PC-urilor. |
| 4 | 5M nu are laborator la ora aceea → lecția web nu se poate deschide. | B_context_real §3 | **Nu se poate fără sală**, pentru că împărțirea laboratorului între 5AM și 5M e nerezolvată. Dar lecția e aproape toată pe hârtie → merge cu o fișă tipărită (care nu există). |
| 5 | Ora s-a suprapus cu orele 5 și 6: la 09.10 și 16.10 copiii „au făcut deja” intrare/ieșire și unitățile, dar superficial. | Comparat pașii 4 și 6 cu `Calendar_ore_5AM_5M.md` | **Confirmat:** pasul 4 = tema orei 5, pasul 6 = tema orei 6. |

## U13 — explicații alternative pentru semnalările grave

**A. „Lecția nu încape în oră.”**
- Alternativa 1: ritmurile porții (90 cuv/min, 40 caractere/min) sunt prea lente pentru copiii de la un liceu de arte.
- Alternativa 2: lecția nu e gândită să fie citită integral în clasă — exercițiile ar fi temă.
- Observația care le deosebește: recalculat la ritm dublu → 43,1 min, încape (`u12_sensibilitate.txt`). Pentru alternativa 2 am căutat în lecție: Exercițiul 2 cere „investigatie in casa ta” (deci chiar e temă), dar Exercițiile 1 și 3 au caseta „Raspunsul tau” pe pagină și nu scrie nicăieri „temă”. **Verdict:** „important”, nu „blocant”; formularea finală ține cont de ambele.

**B. „Cheia la «primul calculator electronic programabil» e discutabilă.”**
- Alternativa: la nivel de clasa a V-a, „ENIAC = primul” e convenția manualelor, iar variantele greșite (Desktop PC, Smartphone) fac întrebarea oricum corectă ca răspuns.
- Observația: feedbackul lecției spune însăși „unul dintre primele” — deci lecția se contrazice în același pas; sursa primară TNMOC dă Colossus (1944) (`surse/citate_verificate.txt`). **Verdict:** păstrăm „important”: răspunsul ales rămâne ENIAC, dar întrebarea trebuie să spună „de uz general”.

**C. „Răspunsurile nu ajung la profesor.”**
- Alternativa: poate profesorul nici nu vrea să le strângă digital — le verifică privind ecranul la fiecare elev.
- Observația: codul (`practice-simple.js`) spune „saves answers for teacher review”, dar singura destinație e `localStorage` (probat). Diferența între intenție și realitate rămâne; gravitatea depinde de cum lucrează Vasile → `depinde_de_necunoscut: true`.

**D. „Provocarea e pentru acasă.”**
- Alternativa: profesorul poate spune oral „uitați-vă în sală”. Observația: textul de pe ecran nu permite asta fără intervenție — elevul citește singur „in camera ta, in bucatarie”. Rămâne „important” (se repară cu o frază).
