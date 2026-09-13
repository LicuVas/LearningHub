# 03 — Jurnalul sarcinii (U1, U11) · lectia3-paragrafe

## Constrângerile elevului pe care îl joc (U11)
- 13 ani, clasa a VII-a, a văzut Word la lecțiile 1-2 (dacă a existat laborator). Nu știe englezește cât să traducă „Indentation > Special > Hanging” în „Indentări și spațiere > Special > Agățat”.
- **Nu vede** rezolvările (sunt pliate) când lucrează; nu știe ce e un „pt” altfel decât din fraza „1 pt este aproximativ 0.35 mm”.
- Timpul: 50 de minute pentru lecțiile 2 și 3 împreună (ora 6 din plan); primele ~8 minute pleacă pe pornire.
- Tastatura: nu știu dacă are layout românesc; textul lecției e fără diacritice, deci nu are niciun model.

## Ce am făcut, pas cu pas (python-docx, A4, baza Word 365: interlinie 1,15, 8 pt după)
1. **Ex.1, scrisoarea.** Adresa și data aliniate la dreapta (3 paragrafe), „Doamnă Director,” centrat, corpul în 3 paragrafe Justify cu interlinie 1,5, ultimul paragraf cu 24 pt după, semnătura centrată. Randat de LibreOffice: marginile se văd corect (u3_iesire.json). *Blocaj probabil:* întrebările își dau singure răspunsul („dreapta sus”, „centrata”), iar atomul 2 a spus că semnătura se aliniază la dreapta → elevul atent ezită exact aici.
2. **Ex.2, First Line Indent 1,27 cm.** Trei paragrafe, primul rând mutat 36 pt (=1,27 cm), observat în PDF. *Blocaj probabil:* „sageata din coltul grupului Paragraph” e mică; pe ecranul românesc grupul se cheamă „Paragraf”, fila „Pornire”. Tragerea marcajului exact la 1,27 cm pe riglă e grea, iar lecția nu spune cum verifici valoarea după tragere.
3. **Ex.3 — lecția NU cere să faci documentul, doar să descrii.** L-am făcut totuși (cum ar face profesorul înainte de oră): 5 paragrafe cu câte 2 Enter-uri goale, apoi varianta corectată cu 10 pt după. **Rezultatul contrazice lecția:** documentul corectat nu „arată la fel” — spațiul alb dintre paragrafe scade de la 54,8 pt la 9,9 pt, iar cele 5 paragrafe ocupă 225 pt în loc de 405 pt. Elevul care face corectarea în Word vede textul „strâns” și crede că a greșit; cel care doar descrie scrie un răspuns memorat.
4. **Provocarea (opțională):** bibliografia cu Hanging Indent iese corect (primul rând la margine, al doilea la 1,27 cm).
5. **Răspunsurile pe site** (u1_raspunsuri_elev.txt): trei casete, ~900 de caractere în total — asta singură costă ~15 minute la 60 de caractere pe minut.

## Unde se blochează un începător (ipoteze AI → întrebări pentru Vasile)
- Numele englezești ale butoanelor pe un Word în română (dacă e cazul).
- Confuzia între cele trei marcaje suprapuse de pe riglă — lecția însăși o spune („la inceput e usor sa le confunzi”).
- Ex.3: „dar nu arată la fel” — când documentul se strânge.
- Tabulatorii și chenarele: predate, dar niciun exercițiu nu le cere → nu se exersează.
